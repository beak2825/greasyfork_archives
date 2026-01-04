// ==UserScript==
// @name         Better Search for Twitter/X
// @name:ja      ツイッターの検索マシにするやつ
// @namespace    better-search-preset-for-twitter
// @version      1.0.0
// @author       Larthraid
// @license      MIT
// @description  Alt+Sで検索プリセット。UIは2カラム・タブのみ（既定/最新/メディア/ビデオ/写真）。閉じる/検索実行時や追加・編集・削除・並べ替え・インポート直後に時刻付きキーで自動スナップショット保存、起動時は最新を自動読込。履歴は最大 KEEP_SNAPSHOTS 件を保持し古いものを削除。
// @match        https://x.com/*
// @match        https://twitter.com/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      api.github.com
// @connect      gist.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/546473/Better%20Search%20for%20TwitterX.user.js
// @updateURL https://update.greasyfork.org/scripts/546473/Better%20Search%20for%20TwitterX.meta.js
// ==/UserScript==
(() => {
  'use strict';

  /** ============== 設定 ============== */
  const KEEP_SNAPSHOTS = 30;                           // 何件残すか（時刻版）
  const SNAP_PREFIX    = 'searchPresets.ts.';          // 実体保存キーの接頭辞（ts = timestamp）
  const LATEST_PTR     = 'searchPresets.latest';       // 最新キーへのポインタ（値はキー名）
  const HISTORY_KEY    = 'searchPresets.history';      // 直近キー配列（新→古）
  const EXPANDED_KEY   = 'searchPresets.expGroups.v1'; // 開閉状態保存キー（別管理）
  const GROUPS_KEY     = 'searchPresets.customGroups.v1'; // カスタムグループ保存キー
  const OPEN_IN_NEW_TAB = false;                       // true で新タブ
  const MIGRATE_FROM_VN = true;                        // 旧 vN 形式があれば最初に1回だけ移行
  /** ================================== */

  // 初期値（初回のみ）
  const DEFAULTS = [
    {
      title: 'Twitter 落ちた',
      group: '未分類',
      q: ['Twitter', '落ちた'],
      exclude: ['エックスくん', 'Twix'],
      lang: 'ja',
      tab: 'live', // 既定:'', 最新:'live', メディア:'media', ビデオ:'videos', 写真:'photos'
    },
  ];

  /* ================= バージョン管理（時刻版） ================= */
  const nowKey = () => {
    const d = new Date();
    const pad = (n, w=2) => String(n).padStart(w,'0');
    const key = `${SNAP_PREFIX}${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}-${pad(d.getMilliseconds(),3)}`;
    return key;
  };
  const listAllKeys = () => (typeof GM_listValues === 'function') ? GM_listValues() : [];
  const listSnapKeys = () => listAllKeys().filter(k => k.startsWith(SNAP_PREFIX)).sort().reverse(); // 新→古（文字列でOK）

  function readJSON(key, fallback=null){
    try {
      const raw = GM_getValue(key, null);
      if (raw == null) return fallback;
      return (typeof raw === 'string') ? JSON.parse(raw) : raw;
    } catch { return fallback; }
  }
  function writeJSON(key, obj){
    GM_setValue(key, JSON.stringify(obj));
  }

  

  /* ===== GitHub Gist 同期設定 ===== */
  const GIST_TOKEN_KEY = 'gist.token';
  const GIST_ID_KEY = 'gist.id';
  const GIST_FILENAME_KEY = 'gist.filename';
  const DEFAULT_GIST_FILENAME = 'better-search-twitter-presets.json';

  function getGistSettings(){
    return {
      token: GM_getValue(GIST_TOKEN_KEY, '').trim(),
      id: GM_getValue(GIST_ID_KEY, '').trim(),
      filename: (GM_getValue(GIST_FILENAME_KEY, '') || DEFAULT_GIST_FILENAME).trim(),
    };
  }
  function setGistSettings({token,id,filename}){
    if (typeof token === 'string') GM_setValue(GIST_TOKEN_KEY, token);
    if (typeof id === 'string') GM_setValue(GIST_ID_KEY, id);
    if (typeof filename === 'string') GM_setValue(GIST_FILENAME_KEY, filename);
  }

  // GM_xmlhttpRequest 版のシンプルな GitHub API 呼び出し
  function ghRequest({method, url, token, data=null}){
    return new Promise((resolve, reject)=>{
      GM_xmlhttpRequest({
        method, url,
        headers: Object.assign(
          {'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},
          token ? {'Authorization': 'token ' + token} : {}
        ),
        data: data ? JSON.stringify(data) : null,
        onload: resp=>{
          const ok = resp.status >=200 && resp.status<300;
          if (!ok) return reject(new Error('GitHub API '+resp.status+': '+resp.responseText));
          try { resolve(resp.responseText ? JSON.parse(resp.responseText) : null); }
          catch { resolve(resp.responseText); }
        },
        onerror: err=>reject(new Error('Network error')),
        ontimeout: ()=>reject(new Error('Timeout')),
      });
    });
  }

  async function ensureGistExists(){
    const s = getGistSettings();
    if (!s.token) throw new Error('Token not set');
    if (s.id) return s;
    // 作成（空ファイルを置く）
    const body = {
      description: 'Better Search for Twitter/X presets (auto-sync)',
      public: false,
      files: { [s.filename]: { content: JSON.stringify({presets:[], savedAt: Date.now()}, null, 2) } }
    };
    const created = await ghRequest({method:'POST', url:'https://api.github.com/gists', token:s.token, data:body});
    const newId = created.id;
    setGistSettings({id:newId});
    return getGistSettings();
  }

  function localLatestSavedAt(){
    const latestKey = GM_getValue(LATEST_PTR, '');
    if (!latestKey) return 0;
    const pack = readJSON(latestKey, null);
    return pack && typeof pack.savedAt==='number' ? pack.savedAt : 0;
  }

  async function syncToGist(presets){
    try{
      const s0 = getGistSettings();
      if (!s0.token) return; // 設定未入力なら何もしない
      const s = s0.id ? s0 : await ensureGistExists();
      const content = JSON.stringify({presets, savedAt: Date.now()}, null, 2);
      const body = { files: { [s.filename]: { content } } };
      await ghRequest({method:'PATCH', url:`https://api.github.com/gists/${s.id}`, token:s.token, data:body});
      // 成功通知は控えめに
      // console.info('Gist synced.');
    }catch(e){
      // 失敗してもローカル動作は継続
      // console.warn('Gist sync failed:', e);
    }
  }

  async function pullFromGistIfNewer({force=false}={}){
    try{
      const s = getGistSettings();
      if (!s.token || !s.id) { if(force) alert('Gist設定が未入力です'); return null; }
      const gist = await ghRequest({method:'GET', url:`https://api.github.com/gists/${s.id}`, token:s.token});
      const file = gist.files && gist.files[s.filename];
      if (!file){ if(force) alert('指定ファイルがGistに見つかりません'); return null; }
      async function fetchRaw(rawUrl){
        return new Promise((resolve,reject)=>{
          GM_xmlhttpRequest({ method:'GET', url: rawUrl, onload:r=>resolve(r.responseText), onerror:reject });
        });
      }
      const text = (file.truncated && file.raw_url) ? await fetchRaw(file.raw_url) : (file.content || '');
      if (!text) return null;
      let remote;
      try{ remote = JSON.parse(text); }catch{ if(force) alert('GistのJSONを解析できません'); return null; }
      const remoteAt = typeof remote.savedAt==='number' ? remote.savedAt : 0;
      const localAt = localLatestSavedAt();
      if (force || remoteAt > localAt){
        if (Array.isArray(remote.presets)){
          // 最新として保存し、呼び出し元スコープの presets も上書きできるよう返す
          saveSnapshot(remote.presets, force ? 'pull_gist_manual' : 'pull_gist_auto');
          return remote.presets;
        }
      } else {
        if (force) alert('ローカルの方が新しいため読み込みをスキップしました');
      }
      return null;
    }catch(e){
      if(force) alert('Gistからの取得に失敗: '+e.message);
      return null;
    }
  }
function saveSnapshot(presets, reason='manual'){
    const key = nowKey();
    writeJSON(key, { presets, reason, savedAt: Date.now() });
    GM_setValue(LATEST_PTR, key);
    const history = readJSON(HISTORY_KEY, []);
    history.unshift(key);
    const uniq = [...new Set(history)].slice(0, KEEP_SNAPSHOTS);
    writeJSON(HISTORY_KEY, uniq);
    const all = listSnapKeys();
    const toDelete = all.filter(k => !uniq.includes(k));
    toDelete.forEach(k => GM_deleteValue(k));
    try{ syncToGist(presets); }catch(e){}
  }

  function loadLatestPresets(){
    const latestKey = GM_getValue(LATEST_PTR, '');
    if (latestKey){
      const pack = readJSON(latestKey, null);
      if (pack && Array.isArray(pack.presets)) return migrateRecord(pack.presets);
    }
    const snaps = listSnapKeys();
    if (snaps.length){
      const pack = readJSON(snaps[0], null);
      if (pack && Array.isArray(pack.presets)){
        GM_setValue(LATEST_PTR, snaps[0]);
        const history = snaps.slice(0, KEEP_SNAPSHOTS);
        writeJSON(HISTORY_KEY, history);
        return migrateRecord(pack.presets);
      }
    }
    if (MIGRATE_FROM_VN){
      const vn = listAllKeys().map(k => {
        const m = /^searchPresets\.v(\d+)$/.exec(k);
        return m ? { key:k, ver: parseInt(m[1],10) } : null;
      }).filter(Boolean).sort((a,b)=> b.ver-a.ver);
      if (vn.length){
        const raw = readJSON(vn[0].key, DEFAULTS);
        const presets = Array.isArray(raw) ? raw : DEFAULTS;
        saveSnapshot(migrateRecord(presets),'migrated_from_vN');
        return migrateRecord(presets);
      }
    }
    saveSnapshot(DEFAULTS,'initialized');
    return DEFAULTS.slice();
  }

  // 古いフィールドの移行（live/images/videos → tab。images/videos は破棄）
  function migrateRecord(arr){
    return (Array.isArray(arr)?arr:[]).map(p=>{
      if (!p || typeof p!=='object') return p;
      const cp = {...p};
      if (cp.live && !cp.tab) cp.tab='live';
      if ('images' in cp) delete cp.images;
      if ('videos' in cp && cp.tab!=='videos') delete cp.videos;
      return cp;
    });
  }

  /* ============== ユーティリティ ============== */
  const esc = (s)=> (s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const enc = (s)=> encodeURIComponent(s);
  const loadExpanded = ()=> { try { return new Set(readJSON(EXPANDED_KEY, [])); } catch { return new Set(); } };
  const saveExpanded = (set)=> writeJSON(EXPANDED_KEY, Array.from(set));
  const loadGroups = ()=> { try { return new Set(readJSON(GROUPS_KEY, [])); } catch { return new Set(); } };
  const saveGroups = (set)=> writeJSON(GROUPS_KEY, Array.from(set));

  function isJapanese(str=''){ return /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー－]/u.test(str); }
  function toLines(v){
    if (!v) return [];
    if (Array.isArray(v)) {
      const arr=[]; v.forEach(x=> String(x).split(/\r?\n/).forEach(y=>{ y=y.trim(); if(y) arr.push(y); }));
      return arr;
    }
    return String(v).split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  }

  /* ============== URL 合成 ============== */
  function buildSearchUrl(p){
    if (p.url) return p.url;
    const parts=[];
    const qLines = toLines(p.q);
    const exLines = toLines(p.exclude);

    if (qLines.length){
      const hh=qLines.map(line=>{
        if(isJapanese(line)) return `"${line}"`;
        return /\s|OR|AND|NOT|-|:|\(|\)/i.test(line)?`(${line})`:line;
      }).join(' OR ');
      if(hh) parts.push(hh);
    }
    if (exLines.length){
      const ex=exLines.map(w=>isJapanese(w)?`-"${w}"`:`-${w}`).join(' ');
      if(ex) parts.push(ex);
    }
    if (p.lang) parts.push(`lang:${p.lang}`);
    if (p.tab === 'videos') parts.push('filter:videos');

    const qStr = parts.join(' ').trim();
    const params=['q='+enc(qStr),'src=typed_query'];

    if (p.tab==='live') params.push('f=live');
    else if (p.tab==='media' || p.tab==='videos') params.push('f=media');
    else if (p.tab==='photos') params.push('f=image');

    return `https://x.com/search?${params.join('&')}`;
  }

  function buildQueryText(p){
    const qLines = toLines(p.q);
    const exLines = toLines(p.exclude);
    if (qLines.length||exLines.length||p.lang||p.tab){
      const parts=[];
      if (qLines.length){
        const hh=qLines.map(line=>{
          if(isJapanese(line)) return `"${line}"`;
          return /\s|OR|AND|NOT|-|:|\(|\)/i.test(line)?`(${line})`:line;
        }).join(' OR ');
        if(hh) parts.push(hh);
      }
      if (exLines.length){
        const ex=exLines.map(w=>isJapanese(w)?`-"${w}"`:`-${w}`).join(' ');
        if(ex) parts.push(ex);
      }
      if (p.lang) parts.push(`lang:${p.lang}`);
      if (p.tab==='live') parts.push('[最新]');
      if (p.tab==='media') parts.push('[メディア]');
      if (p.tab==='videos') parts.push('[ビデオ]');
      if (p.tab==='photos') parts.push('[写真]');
      return parts.join(' ');
    }
    if (p.url) {
      try {
        const u=new URL(p.url);
        let t = u.searchParams.get('q') ? decodeURIComponent(u.searchParams.get('q')) : p.url;
        const f = u.searchParams.get('f');
        if (f==='live') t+=' [最新]';
        if (f==='media') t+=' [メディア]';
        if (f==='image') t+=' [写真]';
        return t;
      } catch { return p.url; }
    }
    return '';
  }

  /* ============== テーマ ============== */
  function detectTheme(){
    const bg=getComputedStyle(document.body).backgroundColor||'rgb(255,255,255)';
    const m=bg.match(/\d+/g); if(!m) return 'dim';
    const [r,g,b]=m.map(Number); const max=Math.max(r,g,b), min=Math.min(r,g,b); const l=(max+min)/510;
    if(l>0.82) return 'light'; if(l<0.10) return 'lightsout'; return 'dim';
  }
  const palettes={
    light:{bg:'#fff',card:'#fff',border:'#eff3f4',text:'#0f1419',subtle:'#536471',hover:'rgba(15,20,25,.06)'},
    dim:{bg:'#15202b',card:'#192734',border:'#22303c',text:'#e7e9ea',subtle:'#8899a6',hover:'rgba(29,155,240,.12)'},
    lightsout:{bg:'#000',card:'#0a0a0a',border:'#2f3336',text:'#e7e9ea',subtle:'#8b98a5',hover:'rgba(29,155,240,.15)'}
  };
  const pal=palettes[detectTheme()];

  GM_addStyle(`
  .psl-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:2147483646;display:none}
  .psl-modal{position:fixed;left:50%;top:10%;transform:translateX(-50%);
    width:min(900px,94vw);background:${pal.card};border:1px solid ${pal.border};border-radius:12px;
    box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:2147483647;color:${pal.text};
    font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji"}
  .psl-modal, .psl-modal * { box-sizing:border-box; font:inherit; color:inherit; }

  .psl-head{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid ${pal.border};font-weight:700}
  .psl-small{opacity:.7;font-size:12px;color:${pal.subtle}}
  .psl-kbd{background:${pal.border};border-radius:6px;padding:0 6px;margin-left:8px;font-size:12px}

  .psl-list{max-height:48vh;overflow:auto;padding:6px 8px}
  .psl-group{border:1px solid ${pal.border};border-radius:10px;margin:8px 0;overflow:hidden;background:${pal.bg}}
  .psl-group-header{display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:pointer;user-select:none}
  .psl-caret{transition:transform .15s}
  .psl-group-header:hover{background:${pal.hover}}
  .psl-group-title{font-weight:700;flex:1}
  .psl-group-actions{display:flex;gap:6px;align-items:center}
  .psl-group-body{display:none;padding:6px;min-height:36px}
  .psl-group.open .psl-group-body{display:block}
  .psl-group.open .psl-caret{transform:rotate(90deg)}
  .psl-group.empty .psl-group-body{display:block}
  .psl-group.empty .psl-group-body::after{content:'（空のグループ）ここにドラッグで追加';display:block;color:${pal.subtle};font-size:12px;padding:8px}

  .psl-card{display:flex;align-items:center;gap:10px;padding:10px;border:1px solid ${pal.border};border-radius:10px;background:${pal.card};margin:6px 4px;cursor:pointer}
  .psl-card[aria-selected="true"], .psl-card:hover{background:${pal.hover}}
  .psl-handle{flex:0 0 18px;display:flex;align-items:center;justify-content:center;cursor:grab;user-select:none;opacity:.6}
  .psl-handle::before{content:"⋮⋮";line-height:1}
  .psl-card.dragging{opacity:.6}
  .psl-card-main{display:flex;flex-direction:column;flex:1;min-width:0}
  .psl-title{font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .psl-sub{opacity:.8;font-size:12px;color:${pal.subtle};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .psl-card-actions{display:flex;gap:6px}
  .psl-mini{padding:6px 8px;border:1px solid ${pal.border};border-radius:8px;background:${pal.bg};color:${pal.text};cursor:pointer;font-size:12px}
  .psl-mini:hover{filter:brightness(1.06)}

  .psl-actions{display:flex;gap:8px;padding:10px 14px;justify-content:flex-end;border-top:1px solid ${pal.border};flex-wrap:wrap;position:relative}
  .psl-btn{padding:8px 10px;border:1px solid ${pal.border};border-radius:8px;background:${pal.bg};color:${pal.text};cursor:pointer}
  .psl-btn[disabled]{opacity:.5;cursor:not-allowed}
  .psl-btn:hover:not([disabled]){filter:brightness(1.06)}

  .psl-menu{position:absolute;right:14px;bottom:46px;background:${pal.card};border:1px solid ${pal.border};border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.35);display:none;min-width:180px;z-index:10}
  .psl-menu.open{display:block}
  .psl-menu button{display:block;width:100%;text-align:left;border:0;border-bottom:1px solid ${pal.border};background:transparent;padding:10px}
  .psl-menu button:last-child{border-bottom:0}
  .psl-menu button:hover{background:${pal.hover}}

  /* 入力域：2カラム固定（URLは全幅）。クエリと除外が左右対称、その下は言語とタブ選択 */
  .psl-inputs{display:grid;gap:10px 12px;padding:10px 14px;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "title group"
      "url   url"
      "q     ex"
      "lang  tab";}
  .psl-row{display:flex;flex-direction:column;gap:6px}
  .psl-label{font-size:12px;color:${pal.subtle}}
  .psl-inputs input,.psl-inputs textarea,.psl-inputs select{
    padding:8px 10px;border:1px solid ${pal.border};border-radius:8px;background:${pal.bg};color:${pal.text};width:100%;
  }
  .psl-inputs textarea{min-height:74px;resize:vertical}
  .psl-inputs input::placeholder, .psl-inputs textarea::placeholder { color:${pal.subtle}; opacity:.8; }

  .psl-a-title{grid-area:title}
  .psl-a-group{grid-area:group}
  .psl-a-url{grid-area:url}
  .psl-a-q{grid-area:q}
  .psl-a-ex{grid-area:ex}
  .psl-a-lang{grid-area:lang}
  .psl-a-tab{grid-area:tab}
  `);

  // DOM
  const backdrop=document.createElement('div'); backdrop.className='psl-backdrop';
  const modal=document.createElement('div'); modal.className='psl-modal';
  backdrop.appendChild(modal); document.body.appendChild(backdrop);

  // 状態
  let presets=loadLatestPresets();
  // 起動時：Gist側が新しければ読み込む
  pullFromGistIfNewer().then(remote=>{
    if (remote){ presets=remote; selectedGlobalIndex=0; editIndex=-1; dirty=true; render(); }
  });
  let selectedGlobalIndex=0;
  let editIndex=-1;
  let expandedGroups=loadExpanded();
  let customGroups=loadGroups();
  let dirty=false; // 変更フラグ

  const groupOf=(p)=> (p.group||'未分類');

  function labelWrap(text, control, extraClass=''){
    const wrap=document.createElement('div'); wrap.className='psl-row ' + extraClass;
    const lab=document.createElement('div'); lab.className='psl-label'; lab.textContent=text;
    wrap.appendChild(lab); wrap.appendChild(control); return wrap;
  }
  function btn(label,onClick){ const b=document.createElement('button'); b.className='psl-btn'; b.textContent=label; b.addEventListener('click',onClick); return b; }
  function mini(label,onClick){ const b=document.createElement('button'); b.className='psl-mini'; b.textContent=label; b.addEventListener('click',(e)=>{ e.stopPropagation(); onClick(e); }); return b; }

  function rebuildPresetsFromDOM(listEl){
    const used=new Set(); const newArr=[];
    const groups=[...listEl.querySelectorAll('.psl-group')];
    groups.forEach(gEl=>{
      const gname=gEl.getAttribute('data-group-name')||'未分類';
      const cards=[...gEl.querySelectorAll('.psl-card')];
      cards.forEach(card=>{
        const idx=Number(card.getAttribute('data-index'));
        if (Number.isInteger(idx) && presets[idx]){
          const obj=Object.assign({}, presets[idx]);
          obj.group=gname; newArr.push(obj); used.add(idx);
        }
      });
    });
    presets.forEach((p,i)=>{ if(!used.has(i)) newArr.push(p); });
    presets=newArr; dirty=true; saveSnapshot(presets,'reorder'); // 並べ替えは即スナップショット
  }

  function render(){
    modal.innerHTML='';

    const head=document.createElement('div');
    head.className='psl-head';
    head.innerHTML=`<div>検索プリセット</div>
      <div class="psl-small">Alt+S<span class="psl-kbd">Alt+S</span> / Esc</div>`;
    modal.appendChild(head);

    const setNames=new Set(['未分類']);
    customGroups.forEach(n=>setNames.add(n));
    presets.forEach(p=> setNames.add(groupOf(p)));
    const groupNames=[...setNames];

    const list=document.createElement('div'); list.className='psl-list'; modal.appendChild(list);

    groupNames.forEach(gname=>{
      const groupEl=document.createElement('div'); groupEl.className='psl-group'; groupEl.setAttribute('data-group-name', gname);
      const header=document.createElement('div'); header.className='psl-group-header';

      const caret=document.createElement('span'); caret.className='psl-caret'; caret.textContent='▶';
      const title=document.createElement('span'); title.className='psl-group-title'; title.textContent=gname;
      const gActions=document.createElement('div'); gActions.className='psl-group-actions';

      if (gname !== '未分類'){
        const delG=document.createElement('button');
        delG.className='psl-mini';
        delG.textContent='🗑';
        delG.title='グループ削除（カードは未分類へ移動）';
        delG.addEventListener('click',(e)=>{
          e.stopPropagation();
          const count = presets.filter(p=>groupOf(p)===gname).length;
          const ok = confirm(`${gname} を削除しますか？\n（含まれる ${count} 件は「未分類」へ移動します）`);
          if (!ok) return;
          presets.forEach(p=>{ if(groupOf(p)===gname) p.group='未分類'; });
          customGroups.delete(gname); saveGroups(customGroups);
          expandedGroups.delete(gname); saveExpanded(expandedGroups);
          dirty=true; saveSnapshot(presets,'delete_group');
          render();
        });
        gActions.appendChild(delG);
      }

      header.append(caret, title, gActions);
      header.addEventListener('click',()=>{
        if (groupEl.classList.toggle('open')) expandedGroups.add(gname); else expandedGroups.delete(gname);
        saveExpanded(expandedGroups);
      });
      if (expandedGroups.has(gname)) groupEl.classList.add('open');
      list.appendChild(groupEl); groupEl.appendChild(header);

      const body=document.createElement('div'); body.className='psl-group-body'; groupEl.appendChild(body);

      body.addEventListener('dragover',(e)=>{
        e.preventDefault();
        const dragging=list.querySelector('.psl-card.dragging');
        if (dragging){
          const after=getDragAfterElement(body, e.clientY);
          if (after==null) body.appendChild(dragging); else body.insertBefore(dragging, after);
        }
      });
      body.addEventListener('drop',(e)=>{ e.preventDefault(); rebuildPresetsFromDOM(list); render(); });

      const items=presets.map((p,i)=>({p,i})).filter(x=> groupOf(x.p)===gname);
      if (items.length===0) groupEl.classList.add('empty'); else groupEl.classList.remove('empty');

      items.forEach(({p,i})=>{
        const card=document.createElement('div');
        card.className='psl-card'; card.setAttribute('data-index', String(i));
        card.setAttribute('data-group', gname);
        card.setAttribute('draggable','true');

        const handle=document.createElement('div'); handle.className='psl-handle'; card.appendChild(handle);

        let dragEnabled=false;
        handle.addEventListener('mousedown',()=>{ dragEnabled=true; });
        handle.addEventListener('mouseup',()=>{ dragEnabled=false; });

        card.addEventListener('dragstart',(e)=>{
          if(!dragEnabled){ e.preventDefault(); return; }
          card.classList.add('dragging'); e.dataTransfer.effectAllowed='move';
        });
        card.addEventListener('dragend',()=>{ card.classList.remove('dragging'); });

        const main=document.createElement('div'); main.className='psl-card-main';
        const title=p.title?.trim()||'(no title)'; const sub=buildQueryText(p);
        main.innerHTML=`<div class="psl-title">${esc(title)}</div><div class="psl-sub">${esc(sub)}</div>`;
        card.appendChild(main);

        const right=document.createElement('div'); right.className='psl-card-actions';
        const editLabel = (editIndex===i) ? '更新' : '編集';
        const editB=mini(editLabel,()=>{
          if (editIndex===i){
            const pNew=formToPreset();
            if(!pNew.url && (!pNew.q||toLines(pNew.q).length===0)) return;
            presets[i]=pNew; dirty=true; saveSnapshot(presets,'update_card'); editIndex=-1; render();
          } else {
            editIndex=i; render();
          }
        });
        const delB=mini('削除',()=>{
            presets.splice(i,1);
            if(selectedGlobalIndex>=presets.length) selectedGlobalIndex=presets.length-1;
            dirty=true; saveSnapshot(presets,'delete_card'); render();
        });
        right.append(editB, delB);
        card.appendChild(right);

        if (i===selectedGlobalIndex) card.setAttribute('aria-selected','true');
        card.addEventListener('click',(e)=>{ if(e.target===handle) return; openPreset(i); });
        card.addEventListener('mouseenter',()=>{ selectedGlobalIndex=i; updateSelection(); });

        body.appendChild(card);
      });
    });

    // 入力フォーム（2カラム、クエリ/除外は左右対称。下段は言語/タブ）
    const inputs=document.createElement('div'); inputs.className='psl-inputs';
    const t=document.createElement('input'), g=document.createElement('input'), u=document.createElement('input'),
          q=document.createElement('textarea'), ex=document.createElement('textarea'),
          lang=document.createElement('input'), tabSel=document.createElement('select');

    tabSel.innerHTML=`
      <option value="">並べ替え既定</option>
      <option value="live">最新</option>
      <option value="media">メディア</option>
      <option value="videos">ビデオ</option>
      <option value="photos">写真</option>`;

    t.placeholder='タイトル（例:Twitter 落ちた）';
    g.placeholder='グループ（例: 障害情報）';
    u.placeholder='検索URL（https://x.com/search?...） ※URL保存ならこちらに記入';
    q.placeholder='#タグかキーワードを行区切りで。日本語は自動で""囲まれます（URLを使うなら空でOK）';
    ex.placeholder='除外ワード（行区切り / 日本語は自動で引用）';
    lang.placeholder='言語コード（例: ja）';

    if (editIndex>=0){
      const p=presets[editIndex];
      t.value=p.title||''; g.value=p.group||''; u.value=p.url||'';
      q.value=toLines(p.q).join('\n');
      ex.value=toLines(p.exclude).join('\n');
      lang.value=p.lang||''; tabSel.value = p.tab||'';
    } else {
      tabSel.value='';
    }

    inputs.append(
      labelWrap('タイトル',t,'psl-a-title'),
      labelWrap('グループ',g,'psl-a-group'),
      labelWrap('検索URL',u,'psl-a-url'),
      labelWrap('クエリ（行区切り / OR 連結）',q,'psl-a-q'),
      labelWrap('除外（行区切り / 日本語は自動で引用）',ex,'psl-a-ex'),
      labelWrap('言語',lang,'psl-a-lang'),
      labelWrap('タブ',tabSel,'psl-a-tab'),
    );
    modal.appendChild(inputs);

    // アクション（追加 / 編集(更新) / 削除 / バックアップ▾ / グループ追加）
    const actions=document.createElement('div'); actions.className='psl-actions';

    const addBtn=btn('追加',()=>{
      const p=formToPreset();
      if(!p.url && (!p.q||toLines(p.q).length===0)) return;
      presets.push(p); selectedGlobalIndex=presets.length-1; editIndex=-1;
      customGroups.add(groupOf(p)); saveGroups(customGroups);
      dirty=true; saveSnapshot(presets,'add_card'); render();
    });

    const editToggleBtn=btn(editIndex>=0?'更新':'編集',()=>{
      if (editIndex<0){
        if(presets.length===0) return;
        editIndex=selectedGlobalIndex; render();
      } else {
        const p=formToPreset();
        if(!p.url && (!p.q||toLines(p.q).length===0)) return;
        presets[editIndex]=p;
        customGroups.add(groupOf(p)); saveGroups(customGroups);
        dirty=true; saveSnapshot(presets,'update_card'); editIndex=-1; render();
      }
    });

    const delBtn=btn('削除',()=>{
      if(presets.length===0) return;
      presets.splice(selectedGlobalIndex,1);
      if(selectedGlobalIndex>=presets.length) selectedGlobalIndex=presets.length-1;
      dirty=true; saveSnapshot(presets,'delete_card'); render();
    });

    const backupBtn=btn('オプション',()=>{ menu.classList.toggle('open'); });
    const menu=document.createElement('div'); menu.className='psl-menu';
    const exportItem=document.createElement('button'); exportItem.textContent='エクスポート (.json)';
    exportItem.addEventListener('click',()=>{
      const blob=new Blob([JSON.stringify(presets,null,2)],{type:'application/json'});
      const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:'better-search-twitter-presets.json'});
      document.body.appendChild(a); a.click(); a.remove(); menu.classList.remove('open');
    });
    const importItem=document.createElement('button'); importItem.textContent='インポート (.json)';
    importItem.addEventListener('click',()=>{
      const input=Object.assign(document.createElement('input'),{type:'file',accept:'.json,application/json'});
      input.onchange=async()=>{ try{ const text=await input.files[0].text(); presets=JSON.parse(text); dirty=true; saveSnapshot(presets,'import'); render(); }catch{} };
      input.click(); menu.classList.remove('open');
    });
    
    // 認証/同期オプション
    const authItem=document.createElement('button'); authItem.textContent='認証/同期オプション';
    authItem.addEventListener('click',()=>{
      const s=getGistSettings();
      const t=prompt('GitHub Personal Access Token (gist 権限)', s.token||'')||'';
      const id=prompt('既存のGist ID（未設定なら空のまま）', s.id||'')||'';
      const fn=prompt('ファイル名', s.filename||DEFAULT_GIST_FILENAME)||DEFAULT_GIST_FILENAME;
      setGistSettings({token:t,id:id,filename:fn});
      alert('設定を保存しました');
      menu.classList.remove('open');
    });
    // 今すぐ同期（アップロード）
    const syncItem=document.createElement('button'); syncItem.textContent='今すぐ同期（アップロード）';
    syncItem.addEventListener('click',async()=>{
      await syncToGist(presets);
      alert('Gistに同期リクエストを送信しました');
      menu.classList.remove('open');
    });
    // Gistから読み込む（新しい場合のみ上書き）
    const pullItem=document.createElement('button'); pullItem.textContent='Gistから読み込む（新しい場合のみ）';
    pullItem.addEventListener('click',async()=>{
      const remote=await pullFromGistIfNewer({force:true});
      if (remote){ presets=remote; selectedGlobalIndex=0; editIndex=-1; dirty=true; render(); }
      menu.classList.remove('open');
    });

    menu.append(exportItem, importItem, authItem, syncItem, pullItem);

    actions.append(menu);
    document.addEventListener('click',(e)=>{ if (!actions.contains(e.target)) menu.classList.remove('open'); });

    const newGroupBtn=btn('グループ追加',()=>{
      const name=prompt('新しいグループ名を入力してください','新規グループ');
      if(!name) return;
      customGroups.add(name); saveGroups(customGroups);
      expandedGroups.add(name); saveExpanded(expandedGroups);
      render();
    });

    actions.append(addBtn, editToggleBtn, delBtn, backupBtn, newGroupBtn);
    modal.appendChild(actions);

    function formToPreset(){
      const obj={ title:(t.value||'').trim(), group:(g.value||'').trim()||'未分類' };
      const urlVal=(u.value||'').trim(); if(urlVal) obj.url=urlVal;
      const qLines=(q.value||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
      const exLines=(ex.value||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
      if(qLines.length) obj.q=qLines;
      if(exLines.length) obj.exclude=exLines;
      const langVal=(lang.value||'').trim(); if(langVal) obj.lang=langVal;
      obj.tab = tabSel.value || '';
      return obj;
    }
  }

  function updateSelection(){
    modal.querySelectorAll('.psl-card').forEach(el=>{
      const idx=Number(el.getAttribute('data-index'));
      if(idx===selectedGlobalIndex) el.setAttribute('aria-selected','true'); else el.removeAttribute('aria-selected');
    });
  }

  function openPreset(i){
    const p=presets[i]; if(!p) return;
    const url=buildSearchUrl(p);
    saveSnapshot(presets,'open_search');
    if(OPEN_IN_NEW_TAB) window.open(url,'_blank'); else location.href=url;
    close();
  }

  function show(){ selectedGlobalIndex=Math.min(selectedGlobalIndex, Math.max(0, presets.length-1)); render(); backdrop.style.display='block'; document.documentElement.style.overflow='hidden'; }
  function close(){
    backdrop.style.display='none'; editIndex=-1; document.documentElement.style.overflow='';
    if (dirty){ saveSnapshot(presets,'close_modal'); dirty=false; }
  }

  function getDragAfterElement(container,y){
    const els=[...container.querySelectorAll('.psl-card:not(.dragging)')];
    return els.reduce((closest,child)=>{
      const box=child.getBoundingClientRect(); const offset=y - box.top - box.height/2;
      if(offset<0 && offset>closest.offset) return {offset, element: child}; else return closest;
    }, {offset:Number.NEGATIVE_INFINITY}).element;
  }

  // キーイベント：モーダル中はXショートカット抑止、Alt+Sトグル/ESCのみ通す
  const isModalOpen=()=> backdrop.style.display==='block';
  ['keydown','keypress','keyup'].forEach((type)=>{
    window.addEventListener(type,(e)=>{
      const isAltS = e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && e.code==='KeyS';
      const isEsc  = e.key==='Escape';
      if (type==='keydown'){
        if (!isModalOpen() && isAltS){ e.preventDefault(); e.stopImmediatePropagation(); show(); return; }
        if (isModalOpen() && isAltS){  e.preventDefault(); e.stopImmediatePropagation(); close(); return; }
        if (isModalOpen() && isEsc){   e.preventDefault(); e.stopImmediatePropagation(); close(); return; }
      }
      if (isModalOpen()){
        if (!modal.contains(e.target)) e.preventDefault();
        e.stopPropagation(); e.stopImmediatePropagation();
      }
    }, true);
  });

  backdrop.addEventListener('click',(e)=>{ if(e.target===backdrop) close(); });

})();