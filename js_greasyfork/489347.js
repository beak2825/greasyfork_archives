// ==UserScript==
// @name         Bilibili 收藏夹 JSON 查看/保存
// @namespace    https://space.bilibili.com/398910090
// @version      2.0
// @description  仅在非私密收藏夹界面可用，私密收藏夹不可用，可查看和保存收藏夹界面的json,可点击收藏夹视频卡片菜单的查看json按钮来查看单个视频的json数据
// @author       Ace
// @match        https://space.bilibili.com/*/favlist*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/489347/Bilibili%20%E6%94%B6%E8%97%8F%E5%A4%B9%20JSON%20%E6%9F%A5%E7%9C%8B%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/489347/Bilibili%20%E6%94%B6%E8%97%8F%E5%A4%B9%20JSON%20%E6%9F%A5%E7%9C%8B%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const cfg = {
        api: 'https://api.bilibili.com/x/v3/fav/resource/list',
        ps: 40
    };

    const getMid = () => new URLSearchParams(location.search).get('fid');

    const buildUrl = (mid, pn = 1) =>
        `${cfg.api}?media_id=${mid}&pn=${pn}&ps=${cfg.ps}&keyword=&order=mtime&type=0&tid=0&platform=web&web_location=333.1387`;

    const getHeaders = () => ({
        'User-Agent': navigator.userAgent,
        'Referer': location.href
    });

    const fetchJSON = async (mid, pn = 1) => {
        const res = await fetch(buildUrl(mid, pn), { headers: getHeaders() });
        const json = await res.json();
        if (json.code !== 0) throw new Error(json.message || '接口错误');
        return json;
    };

    const fetchAll = async (mid) => {
        const list = [];
        let pn = 1, hasMore = true;
        while (hasMore) {
            const { data } = await fetchJSON(mid, pn);
            list.push(...data.medias);
            hasMore = data.has_more;
            pn++;
        }
        return { code: 0, data: { medias: list } };
    };

const openTab = (obj) => {
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>JSON 浏览器</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{margin:0;font-family:SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;font-size:14px;background:#1e1e1e;color:#d4d4d4;line-height:1.45}
#search{width:100%;padding:8px 12px;border:none;border-bottom:1px solid #444;background:#252526;color:#d4d4d4;outline:none}
#tools{padding:8px 12px;background:#252526;display:flex;gap:8px}
button{padding:4px 10px;border:1px solid #444;background:#3c3c3c;color:#d4d4d4;cursor:pointer;border-radius:3px}
button:hover{background:#484848}
#tree{padding:12px;white-space:pre;cursor:pointer}
.collapsed>ul{display:none}
li{list-style:none;margin-left:20px;position:relative}
li::before{content:"▶";position:absolute;left:-14px;transition:transform .1s}
li.collapsed::before{transform:rotate(0)}
li.expanded::before{transform:rotate(90deg)}
.key{color:#9cdcfe}.str{color:#ce9178}.num{color:#b5cea8}.bool{color:#569cd6}.null{color:#569cd6}
mark{background:#515c6a;border-radius:2px}
</style>
</head>
<body>
<input id="search" placeholder="搜索键或值 ↵" autocomplete="off">
<div id="tools">
  <button id="expandAll">全部展开</button>
  <button id="collapseAll">全部折叠</button>
  <button id="copyRaw">复制原始 JSON</button>
</div>
<ul id="tree"></ul>
<script>
const data = ${JSON.stringify(obj)};
const tree=document.getElementById('tree'),search=document.getElementById('search');
function escapeHtml(str){return str.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function build(o, path = '') {
  if (o === null) return '<span class="null">null</span>';
  if (typeof o === 'boolean') return '<span class="bool">' + o + '</span>';
  if (typeof o === 'number') return '<span class="num">' + o + '</span>';
  if (typeof o === 'string') return '<span class="str">"' + escapeHtml(o) + '"</span>';

  let out = '';
  if (Array.isArray(o)) {
    out += '[ ' + o.length + ' ]<ul>';
    o.forEach((v, i) => {
      const hasChildren = typeof v === 'object' && v !== null && (Array.isArray(v) ? v.length : Object.keys(v).length);
      out += '<li class="' + (hasChildren ? 'collapsed' : '') + '"><span class="key">' + i + '</span>: ' + build(v, path + '[' + i + ']') + '</li>';
    });
    out += '</ul>';
  } else {
    out += '{ ' + Object.keys(o).length + ' }<ul>';
    for (let [k, v] of Object.entries(o)) {
      const hasChildren = typeof v === 'object' && v !== null && (Array.isArray(v) ? v.length : Object.keys(v).length);
      out += '<li class="' + (hasChildren ? 'collapsed' : '') + '"><span class="key">' + escapeHtml(k) + '</span>: ' + build(v, path + (path ? '.' : '') + k) + '</li>';
    }
    out += '</ul>';
  }
  return out;
}
tree.innerHTML=build(data);
tree.addEventListener('click',e=>{
  const li=e.target.closest('li');
  if(li){li.classList.toggle('collapsed');li.classList.toggle('expanded');}
});
document.getElementById('expandAll').onclick = () => tree.querySelectorAll('li').forEach(n => {
  n.classList.remove('collapsed');
  n.classList.add('expanded');
});
document.getElementById('collapseAll').onclick = () => tree.querySelectorAll('li').forEach(n => {
  n.classList.remove('expanded');
  n.classList.add('collapsed');
});
document.getElementById('copyRaw').onclick=()=>navigator.clipboard.writeText(JSON.stringify(data,null,2)).then(()=>alert('已复制'));
search.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const q = search.value.trim().toLowerCase();
  if (!q) {
    tree.innerHTML = build(data);
    return;
  }
  function filter(o, path = '') {
    if (typeof o !== 'object' || o === null) return o;
    if (Array.isArray(o)) {
      const filtered = o.map((v, i) => filter(v, path + '[' + i + ']')).filter(v => v !== undefined);
      return filtered.length ? filtered : undefined;
    }
    const n = {};
    for (let [k, v] of Object.entries(o)) {
      const fullPath = path + (path ? '.' : '') + k;
      if (k.toLowerCase().includes(q) || String(v).toLowerCase().includes(q)) {
        n[k] = v;
      } else {
        const f = filter(v, fullPath);
        if (f !== undefined) n[k] = f;
      }
    }
    return Object.keys(n).length ? n : undefined;
  }
  tree.innerHTML = build(filter(data) || {});
});
</script>
</body></html>`;

  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
};

    const saveFile = (obj) => {
        const name = prompt('文件名：', GM_getValue('fname', 'favlist.json')) || 'favlist.json';
        GM_setValue('fname', name);
        const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
        const u = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement('a'), { href: u, download: name });
        a.click();
        URL.revokeObjectURL(u);
    };

    const addJsonButton = () => {
        const observer = new MutationObserver(() => {
            document.querySelectorAll('.bili-video-card__info--right').forEach((menu) => {
                if (!menu.querySelector('.view-json-btn')) {
                    const btn = document.createElement('button');
                    btn.textContent = '查看 JSON 数据';
                    btn.className = 'view-json-btn';
                    btn.style.cssText = 'margin-left: 10px; cursor: pointer; color: #00a1d6; border: none; background: none;';
                    btn.onclick = async () => {
                        const videoCard = menu.closest('.bili-video-card');
                        const bvid = videoCard?.querySelector('.bili-video-card__info--tit a')?.href.match(/\/video\/(BV\w+)/)?.[1];
                        if (!bvid) return alert('无法获取视频 bvid');
                        
                        const mid = getMid();
                        if (!mid) return alert('无法获取当前收藏夹 ID');
                        
                        try {
                            const allData = await fetchAll(mid);
                            const videoData = allData.data.medias.find((item) => item.bvid === bvid);
                            if (!videoData) return alert('未找到匹配的视频 JSON 数据');
                            openTab(videoData);
                        } catch (e) {
                            alert(e.message);
                        }
                    };
                    menu.appendChild(btn);
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

const observeDynamicMenu = () => {
  const done = new WeakSet();

  const injectBtn = (card) => {
    // 等菜单真正出现再塞按钮
    const tryInject = () => {
      const menu = document.querySelector('.bili-card-dropdown-popper');
      if (!menu || done.has(menu)) return;
      const btn = document.createElement('div');
      btn.className = 'bili-card-dropdown-popper__item';
      btn.textContent = '🔍 查看JSON';
      btn.style.cssText = 'color:#00a1d6;cursor:pointer;white-space:nowrap;';
      btn.onclick = async () => {
        const bvid = card.dataset.bsbBvid
                  || card.querySelector('a[href*="/video/BV"]')?.href.match(/BV\w+/)?.[0];
        if (!bvid) return alert('无法获取 bvid');
        const mid = getMid();
        if (!mid) return alert('无法获取收藏夹 ID');
        try {
          const allData = await fetchAll(mid);
          const item = allData.data.medias.find(m => m.bvid === bvid);
          if (!item) return alert('未找到该视频 JSON');
          openTab(item);
        } catch (e) {
          alert(e.message);
        }
      };
      menu.appendChild(btn);
      done.add(menu);
    };

    // 每 50ms 检查一次，最多 1 秒
    let t = 0;
    const id = setInterval(() => {
      if (document.querySelector('.bili-card-dropdown-popper') || t++ > 20) {
        clearInterval(id);
        tryInject();
      }
    }, 50);
  };

  /* 悬停即注入，不用点击 */
  document.body.addEventListener('mouseenter', (e) => {
    const card = e.target.closest('.bili-video-card');
    if (card) injectBtn(card);
  }, true);
};
    /* ---------- 入口（每次点击都重新读取 fid） ---------- */
    GM_registerMenuCommand('📖 查看 JSON（当前页）', async () => {
        const mid = getMid();
        if (!mid) return alert('无法获取当前收藏夹 ID');
        try { openTab(await fetchJSON(mid)); } catch (e) { alert(e.message); }
    });

    GM_registerMenuCommand('💾 保存 JSON（全部）', async () => {
        const mid = getMid();
        if (!mid) return alert('无法获取当前收藏夹 ID');
        try { saveFile(await fetchAll(mid)); } catch (e) { alert(e.message); }
    });

    // 启动时添加 JSON 按钮
    addJsonButton();

    // 启动时监听动态菜单
    observeDynamicMenu();
})();