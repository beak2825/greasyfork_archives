// ==UserScript==
// @name         Rive 中文术语管理
// @namespace    http://tampermonkey.net/
// @version      1.5.2
// @description  Rive编辑器自定义中文术语词典，目前支持：词条分组管理/编辑删除/导入导出/搜索/组内拖拽/分组拖拽/蓝色插入线/删空组/面板收起成可拖拽按钮；如果需要支持其他网站，自主进行代码更改，或留言添加
// @match        https://editor.rive.app/*
// @match        https://app.rive.app/*
// @match        https://rive.app/*
// @match        https://*.rive.app/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547441/Rive%20%E4%B8%AD%E6%96%87%E6%9C%AF%E8%AF%AD%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/547441/Rive%20%E4%B8%AD%E6%96%87%E6%9C%AF%E8%AF%AD%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var DEBUG = false;
  function log(){ if (DEBUG) try{ console.log('[Rive-I18N]', ...arguments);}catch(_){} }

  var STORAGE_KEY = 'rive_terms_dict_shadow_v11';
  var UI_STATE_KEY = 'rive_panel_ui_shadow_v11';
  var uidSeed = 1;
  function uid(){ return 'u' + Date.now().toString(36) + (uidSeed++).toString(36); }

  var DEFAULT_DICT = [
    { uid: uid(), group: '动画', items: [{ uid: uid(), key: 'Animation', value: '动画' }, { uid: uid(), key: 'Timeline', value: '时间轴' }] },
    { uid: uid(), group: '状态机', items: [{ uid: uid(), key: 'State Machine', value: '状态机' }, { uid: uid(), key: 'Transition', value: '过渡' }] }
  ];
  function loadDict(){
    try{
      var raw = localStorage.getItem(STORAGE_KEY);
      var d = raw ? JSON.parse(raw) : DEFAULT_DICT;
      d.forEach(function(g){ if(!g.uid) g.uid = uid(); if(!Array.isArray(g.items)) g.items=[]; g.items.forEach(function(it){ if(!it.uid) it.uid=uid(); }); });
      return d;
    }catch(_){ return DEFAULT_DICT; }
  }
  function saveDict(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(dict)); }

  function loadUIState(){
    try{
      var raw = localStorage.getItem(UI_STATE_KEY);
      var s = raw ? JSON.parse(raw) : {};
      return { minimized: !!s.minimized, panelPos: s.panelPos || null, miniPos: s.miniPos || null, collapsed: s.collapsed || {} };
    }catch(_){ return { minimized:false, panelPos:null, miniPos:null, collapsed:{} }; }
  }
  function saveUIState(){ localStorage.setItem(UI_STATE_KEY, JSON.stringify(uiState)); }

  var dict = loadDict();
  var uiState = loadUIState();

  var hostEl=null, shadow=null, root=null, panelEl=null, miniEl=null, groupsEl=null;

  function setFixed(el,x,y){ el.style.left=x+'px'; el.style.top=y+'px'; el.style.right='auto'; }
  function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
  function restoreFixed(box,pos){
    if(!box) return;
    var w=box.offsetWidth||0, h=box.offsetHeight||0;
    var vx=window.innerWidth, vy=window.innerHeight;
    var x=(pos&&Number.isFinite(pos.x))?pos.x:(vx-w-20);
    var y=(pos&&Number.isFinite(pos.y))?pos.y:80;
    x=Math.max(0, Math.min(vx-w,x)); y=Math.max(0, Math.min(vy-h,y));
    setFixed(box,x,y);
  }

  var CSS = ''
  + '#rive-root, #rive-panel, #rive-mini{font-family: Inter, ui-sans-serif, system-ui, Arial, sans-serif; line-height: 1.4;}'
  + '#rive-panel{display:block; position:fixed; top:80px; right:20px; width:440px; background:#3D3D3D; color:#FFFFFF; border:1px solid #3A3A3A; border-radius:10px; font-size:13px; box-shadow:0 6px 18px rgba(0,0,0,.6); overflow:hidden; z-index:2147483647;}'
  + '#rive-panel *{box-sizing:border-box;}'
  + '#rive-header{background:#474747;color:#FFFFFF;display:flex;align-items:center;justify-content:space-between;padding:12px;user-select:none;cursor:move;}'
  + '#rive-title{margin-left:12px;font-weight:700;}'
  + '#rive-header .right{display:inline-flex;align-items:center;column-gap:12px;margin-right:12px;}'
  + '#rive-header .btn{border:1px solid #666;background:#5a5a5a;color:#fff;border-radius:6px;padding:2px 10px;cursor:pointer;}'
  + '#rive-header .btn:hover{filter:brightness(1.06);}'
  + '#rive-inner{padding:12px;display:flex;flex-direction:column;gap:12px;background:#3D3D3D;}'
  + '.rive-search-wrap{background:rgba(0,0,0,0.15);border:1px solid #3A3A3A;border-radius:8px;padding:8px;display:flex;align-items:center;gap:8px;}'
  + '.rive-search-wrap .icon{opacity:.65;}'
  + '#rive-search{flex:1;background:transparent;border:none;outline:none;color:#FFFFFFCC;font-size:13px;}'
  + '#rive-search::placeholder{color:#FFFFFF99;opacity:.8;}'
  + '#rive-groups{max-height:560px;overflow:auto;position:relative;border-radius:8px;}'
  + '.rive-group{background:#3D3D3D;border-radius:8px;margin:0 0px 12px 0px;}'
  + '.rive-group:last-child{margin-bottom:4px;}'
  + '.rive-group-header{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border:1px solid #454545;border-radius:6px;background:#3D3D3D;}'
  + '.rive-group-header .left{display:inline-flex;align-items:center;gap:8px;}'
  + '.rive-toggle{width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #555;border-radius:4px;background:#2F2F2F;color:#fff;cursor:pointer;}'
  + '.rive-group-title{font-weight:600;color:#FFFFFF;}'
  + '.rive-group-handle{cursor:grab;color:#FFFFFF99;user-select:none;padding:2px 6px;border-radius:4px;}'
  + '.rive-group-handle:hover{background:rgba(255,255,255,.08);}'
  + '.rive-items{padding-top:8px;}'
  + '.rive-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:4px 0;padding:8px 10px;cursor:grab;border:1px solid #3a3a3a;border-radius:6px;background:#FFFFFF0D;transition:background .12s ease,border-color .12s ease;}'
  + '.rive-row:first-child{margin-top:0;}.rive-row:last-child{margin-bottom:0;}'
  + '.rive-row:hover{background:#FFFFFF1A;border-color:#4a4a4a;}'
  + '.rive-row .term{font-weight:400;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:70%;}'
  + '.rive-row .actions{display:inline-flex;align-items:center;column-gap:12px;}'
  + '.rive-row .act{color:#7ECBFF;cursor:pointer;font-weight:600;text-decoration:none;}'
  + '.rive-row .act:hover{text-decoration:underline;}'
  + '.dragging{opacity:.85;}'
  + '#rive-insert-indicator{position:absolute;left:8px;right:8px;height:2px;background:#2AA0FF;box-shadow:0 0 0 1px rgba(42,160,255,.25);pointer-events:none;display:none;}'
  + '#rive-footer{display:flex;align-items:center;justify-content:center;gap:12px;background:#3D3D3D;border-radius:8px;padding:8px;}'
  + '.rive-btn{border:1px solid #888;background:#5A5A5A;color:#fff;border-radius:8px;padding:8px 12px;cursor:pointer;}'
  + '.rive-btn:hover{filter:brightness(1.06);}'
  + '#rive-mini{position:fixed;top:80px;right:20px;background:#474747;color:#fff;border:1px solid #3A3A3A;border-radius:20px;padding:8px 12px;cursor:move;user-select:none;box-shadow:0 6px 18px rgba(0,0,0,.4);font-size:13px;font-weight:600;z-index:2147483647;}'
  + '#rive-mini .tap{cursor:pointer;}'
  + '.hidden{display:none !important;}';

  function injectStylesSafe(shadowRoot, cssText){
    try{
      if ('adoptedStyleSheets' in shadowRoot && 'CSSStyleSheet' in window) {
        var sheet = new CSSStyleSheet(); sheet.replaceSync(cssText);
        shadowRoot.adoptedStyleSheets = (shadowRoot.adoptedStyleSheets || []).concat(sheet);
        log('styles: adoptedStyleSheets'); return 'adopted';
      }
    }catch(e1){ log('adopted failed', e1); }
    try{
      var blob = new Blob([cssText], {type:'text/css'});
      var link = document.createElement('link'); link.rel='stylesheet'; link.href=URL.createObjectURL(blob);
      shadowRoot.appendChild(link);
      window.addEventListener('unload', function(){ try{ URL.revokeObjectURL(link.href);}catch(e){} });
      log('styles: blob link'); return 'blob';
    }catch(e2){ log('blob failed', e2); }
    try{
      var style = document.createElement('style'); style.textContent = cssText; shadowRoot.appendChild(style);
      log('styles: inline style'); return 'inline';
    }catch(e3){ log('inline failed', e3); }
    return 'none';
  }

  function applyEmergencyPanelStyle(el){
    if(!el) return;
    el.style.cssText += ';position:fixed;top:80px;right:20px;width:520px;display:block;background:#3D3D3D;color:#fff;border:1px solid #3A3A3A;border-radius:10px;font:13px Inter,ui-sans-serif,system-ui,Arial,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.6);z-index:2147483647;';
  }
  function applyEmergencyMiniStyle(el){
    if(!el) return;
    el.style.cssText += ';position:fixed;top:80px;right:20px;background:#474747;color:#fff;border:1px solid #3A3A3A;border-radius:20px;padding:8px 12px;font:600 13px Inter,ui-sans-serif,system-ui,Arial,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.4);z-index:2147483647;cursor:move;';
  }

  function waitForDomReady(cb, tries){
    tries = tries || 0;
    if (document.body || document.documentElement) { cb(); return; }
    if (tries > 300) { cb(); return; }
    requestAnimationFrame(function(){ waitForDomReady(cb, tries+1); });
  }

  function makeDraggable(box, handle, onMove){
    var down=false, dx=0, dy=0;
    handle.addEventListener('mousedown', function(e){
      var t = e.target;
      var isBtn = t && (t.id==='rive-close' || t.id==='rive-collapse' || t.classList.contains('tap'));
      if (isBtn) return;
      down=true; var r=box.getBoundingClientRect(); dx=e.clientX-r.left; dy=e.clientY-r.top;
    });
    document.addEventListener('mouseup', function(){ down=false; });
    document.addEventListener('mousemove', function(e){
      if(!down) return;
      var x = clamp(e.clientX - dx, 0, window.innerWidth - box.offsetWidth);
      var y = clamp(e.clientY - dy, 0, window.innerHeight - box.offsetHeight);
      setFixed(box, x, y); if (typeof onMove==='function') onMove(x,y);
    });
  }

  var DND = { mode:null, dragGroupEl:null, dragItemEl:null, indicator:null, tgtGroupIdx:null, tgtItemIdx:null };

  function onGroupHandleDragStart(ev){ ev.dataTransfer.effectAllowed='move'; DND.mode='group'; DND.dragGroupEl = ev.currentTarget.closest('.rive-group'); }
  function onGroupHandleDragEnd(){ DND.mode=null; DND.dragGroupEl=null; hideIndicator(); }
  function onRowDragStart(e){ DND.mode='item'; DND.dragItemEl=e.currentTarget; e.currentTarget.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; }
  function onRowDragEnd(e){ e.currentTarget.classList.remove('dragging'); DND.mode=null; DND.dragItemEl=null; DND.tgtItemIdx=null; hideIndicator(); }

  function onGroupsClick(e){
    var t=e.target; if(!t) return;
    if (t.classList.contains('rive-toggle')){
      var gid=t.dataset.uid; var curOpen=!uiState.collapsed[gid];
      uiState.collapsed[gid] = curOpen ? true : false; saveUIState();
      renderGroups(shadow.getElementById('rive-search').value.trim().toLowerCase()); return;
    }
    if (t.classList.contains('act')){
      var action=t.dataset.action; var row=t.closest('.rive-row'); var group=t.closest('.rive-group');
      if (!row || !group) return;
      var gUid=group.dataset.uid, itUid=row.dataset.uid;
      var gIndex = dict.findIndex(function(g){ return g.uid===gUid; }); if (gIndex<0) return;
      var iIndex = dict[gIndex].items.findIndex(function(it){ return it.uid===itUid; }); if (iIndex<0) return;

      if (action==='edit'){
        var cur=dict[gIndex].items[iIndex];
        var nk=window.prompt('编辑英文术语', cur.key); if(!nk) return;
        var nv=window.prompt('编辑中文翻译', cur.value); if(nv===null) return;
        dict[gIndex].items[iIndex].key=nk; dict[gIndex].items[iIndex].value=nv; saveDict();
        renderGroups(shadow.getElementById('rive-search').value.trim().toLowerCase());
      } else if (action==='del'){
        if(!window.confirm('确认删除此词条？')) return;
        dict[gIndex].items.splice(iIndex,1);
        if (dict[gIndex].items.length===0) dict.splice(gIndex,1);
        saveDict();
        renderGroups(shadow.getElementById('rive-search').value.trim().toLowerCase());
      }
    }
  }

  function ensureHost(){
    var existed=document.getElementById('rive-i18n-host');
    if (existed){
      hostEl=existed; shadow=hostEl.shadowRoot || hostEl.attachShadow({mode:'open'});
      root=shadow.getElementById('rive-root'); if(!root){ root=document.createElement('div'); root.id='rive-root'; shadow.appendChild(root); }
      return true;
    }
    hostEl=document.createElement('div'); hostEl.id='rive-i18n-host';
    hostEl.style.cssText='position:fixed;left:0;top:0;width:0;height:0;z-index:2147483647;';
    (document.body||document.documentElement).appendChild(hostEl);
    shadow=hostEl.attachShadow({mode:'open'}); root=document.createElement('div'); root.id='rive-root'; shadow.appendChild(root);
    return true;
  }

  function buildPanel(){
    ensureHost(); if(!shadow||!root) return;
    root.innerHTML='';
    injectStylesSafe(shadow, CSS);

    panelEl=document.createElement('div'); panelEl.id='rive-panel';
    panelEl.innerHTML =
      '<div id="rive-header">'+
        '<div id="rive-title">Rive 中文术语管理</div>'+
        '<div class="right">'+
          '<button id="rive-collapse" class="btn" title="收起">收起</button>'+
          '<button id="rive-close" class="btn" title="关闭">✖</button>'+
        '</div>'+
      '</div>'+
      '<div id="rive-inner">'+
        '<div class="rive-search-wrap"><span class="icon">🔍</span><input id="rive-search" type="text" placeholder="搜索英文或中文..."></div>'+
        '<div id="rive-groups"></div>'+
        '<div id="rive-footer">'+
          '<button id="btn-add" class="rive-btn">添加新词条</button>'+
          '<button id="btn-import" class="rive-btn">导入词条 JSON</button>'+
          '<button id="btn-export" class="rive-btn">导出词条 JSON</button>'+
        '</div>'+
      '</div>';
    root.appendChild(panelEl);

    var headerEl=panelEl.querySelector('#rive-header'); groupsEl=panelEl.querySelector('#rive-groups');

    panelEl.querySelector('#rive-close').addEventListener('click', function(){ root.innerHTML=''; panelEl=null; miniEl=null; });
    panelEl.querySelector('#rive-collapse').addEventListener('click', function(){ toMini(); });
    panelEl.querySelector('#rive-search').addEventListener('input', function(){ renderGroups(this.value.trim().toLowerCase()); });
    makeDraggable(panelEl, headerEl, function(x,y){ uiState.panelPos={x:x,y:y}; saveUIState(); });

    setTimeout(function(){ if(uiState.panelPos&&uiState.panelPos.x!=null&&uiState.panelPos.y!=null){ restoreFixed(panelEl, uiState.panelPos); } },0);

    groupsEl.addEventListener('click', onGroupsClick);

    renderGroups('');
    bindFooter();

    setTimeout(function(){
      try{
        var cs=getComputedStyle(panelEl);
        var bad=!cs || cs.position!=='fixed' || cs.backgroundColor==='rgba(0, 0, 0, 0)' || panelEl.offsetWidth===0;
        if (bad) applyEmergencyPanelStyle(panelEl);
      }catch(_){ applyEmergencyPanelStyle(panelEl); }
      if (uiState.minimized) toMini();
    },120);
  }

  function toMini(){
    if(!shadow||!root) return;
    if(panelEl) panelEl.classList.add('hidden');
    if(!miniEl){
      injectStylesSafe(shadow, CSS);
      miniEl=document.createElement('div'); miniEl.id='rive-mini'; miniEl.innerHTML='<span class="tap">Rive中文</span>';
      root.appendChild(miniEl);
      miniEl.querySelector('.tap').addEventListener('click', function(){
        if(panelEl) panelEl.classList.remove('hidden');
        if(miniEl) miniEl.remove(); miniEl=null;
        uiState.minimized=false; saveUIState();
      });
      makeDraggable(miniEl, miniEl, function(x,y){ uiState.miniPos={x:x,y:y}; saveUIState(); });
      setTimeout(function(){
        try{ var cs=getComputedStyle(miniEl); var bad=!cs||cs.position!=='fixed'||miniEl.offsetWidth===0; if(bad) applyEmergencyMiniStyle(miniEl); }
        catch(_){ applyEmergencyMiniStyle(miniEl); }
      },50);
    }
    uiState.minimized=true; saveUIState();
    setTimeout(function(){ restoreFixed(miniEl, uiState.miniPos); },0);
  }

  function ensureIndicator(){
    if (DND.indicator && groupsEl && groupsEl.contains(DND.indicator)) return DND.indicator;
    var line=document.createElement('div'); line.id='rive-insert-indicator'; groupsEl.appendChild(line); DND.indicator=line; return line;
  }
  function showIndicator(y){ var line=ensureIndicator(); line.style.top=y+'px'; line.style.display='block'; }
  function hideIndicator(){ if (DND.indicator) DND.indicator.style.display='none'; }

  function renderGroups(filter){
    groupsEl.innerHTML=''; hideIndicator();
    for (var gi=0; gi<dict.length; gi++){
      var grp=dict[gi];
      var card=document.createElement('div'); card.className='rive-group'; card.dataset.uid=grp.uid;

      var gh=document.createElement('div'); gh.className='rive-group-header';
      var left=document.createElement('div'); left.className='left';

      var open=!uiState.collapsed[grp.uid];
      var btn=document.createElement('button'); btn.className='rive-toggle'; btn.textContent=open?'▾':'▸'; btn.dataset.uid=grp.uid;

      var title=document.createElement('div'); title.className='rive-group-title'; title.textContent=grp.group+' ('+grp.items.length+')';
      left.appendChild(btn); left.appendChild(title);

      var handle=document.createElement('div'); handle.className='rive-group-handle'; handle.title='拖拽排序此分组'; handle.textContent='⠿'; handle.setAttribute('draggable','true');
      handle.addEventListener('dragstart', onGroupHandleDragStart);
      handle.addEventListener('dragend', onGroupHandleDragEnd);

      gh.appendChild(left); gh.appendChild(handle);
      card.appendChild(gh);

      var items=document.createElement('div'); items.className='rive-items'; if(!open) items.classList.add('hidden');

      for (var ii=0; ii<grp.items.length; ii++){
        var it=grp.items[ii];
        if (filter){
          var ok=(it.key||'').toLowerCase().includes(filter) || (it.value||'').includes(filter);
          if (!ok) continue;
        }
        var row=document.createElement('div'); row.className='rive-row'; row.setAttribute('draggable','true'); row.dataset.uid=it.uid;
        var term=document.createElement('div'); term.className='term'; term.textContent=it.key+' → '+it.value;

        var actions=document.createElement('div'); actions.className='actions';
        var aEdit=document.createElement('a'); aEdit.className='act'; aEdit.href='javascript:void(0);'; aEdit.textContent='编辑'; aEdit.dataset.action='edit';
        var aDel=document.createElement('a'); aDel.className='act'; aDel.href='javascript:void(0);'; aDel.textContent='删除'; aDel.dataset.action='del';

        actions.appendChild(aEdit); actions.appendChild(aDel);
        row.appendChild(term); row.appendChild(actions); items.appendChild(row);

        row.addEventListener('dragstart', onRowDragStart);
        row.addEventListener('dragend', onRowDragEnd);
      }

      card.appendChild(items);
      groupsEl.appendChild(card);
    }
    bindDnDContainer();
  }

  function bindDnDContainer(){
    if (!groupsEl) return;
    groupsEl.onDragOverBound && groupsEl.removeEventListener('dragover', groupsEl.onDragOverBound);
    groupsEl.onDropBound && groupsEl.removeEventListener('drop', groupsEl.onDropBound);

    var onDragOver=function(e){
      e.preventDefault(); if(!DND.mode) return;

      var y = e.clientY + (shadow.host.getBoundingClientRect().top + window.scrollY);
      var rect=groupsEl.getBoundingClientRect();
      var baseY = rect.top + window.scrollY - groupsEl.scrollTop;

      if (DND.mode==='group' && DND.dragGroupEl){
        var groups = Array.prototype.slice.call(groupsEl.querySelectorAll('.rive-group'));
        var insertAt = groups.length;
        for (var i=0;i<groups.length;i++){
          var r=groups[i].getBoundingClientRect(); var mid=r.top + window.scrollY + r.height/2;
          if (y < mid){ insertAt=i; break; }
        }
        var lineTop;
        if (groups.length===0) lineTop=0;
        else if (insertAt===0) lineTop=groups[0].getBoundingClientRect().top + window.scrollY - baseY;
        else if (insertAt>=groups.length) lineTop=groups[groups.length-1].getBoundingClientRect().bottom + window.scrollY - baseY;
        else lineTop=groups[insertAt-1].getBoundingClientRect().bottom + window.scrollY - baseY;
        DND.tgtGroupIdx=insertAt; showIndicator(lineTop);
      }

      if (DND.mode==='item' && DND.dragItemEl){
        var groupEl = DND.dragItemEl.closest('.rive-group'); if(!groupEl) return;
        var rows = Array.prototype.slice.call(groupEl.querySelectorAll('.rive-items > .rive-row')); if (rows.length===0) return;

        var insertAt2 = rows.length;
        for (var j=0;j<rows.length;j++){
          var rr=rows[j].getBoundingClientRect(); var mid2=rr.top + window.scrollY + rr.height/2;
          if (y < mid2){ insertAt2=j; break; }
        }
        var lineTop2;
        if (insertAt2===0) lineTop2=rows[0].getBoundingClientRect().top + window.scrollY - baseY;
        else if (insertAt2>=rows.length) lineTop2=rows[rows.length-1].getBoundingClientRect().bottom + window.scrollY - baseY;
        else lineTop2=rows[insertAt2-1].getBoundingClientRect().bottom + window.scrollY - baseY;
        DND.tgtItemIdx=insertAt2; showIndicator(lineTop2);
      }
    };

    var onDrop=function(e){
      e.preventDefault(); if(!DND.mode) return;

      // 分组拖拽：修正目标索引；更新数据后直接重渲染，避免 DOM 快照错位
      if (DND.mode==='group' && DND.dragGroupEl){
        var groups = Array.prototype.slice.call(groupsEl.querySelectorAll('.rive-group'));
        var src = groups.indexOf(DND.dragGroupEl);
        var dst = DND.tgtGroupIdx != null ? DND.tgtGroupIdx : src;
        if (src < dst && dst < groups.length) dst = dst - 1; // 非末尾插入才补偿
        if (src !== dst && dst >= 0){
          var moved = dict.splice(src,1)[0];
          if (dst > dict.length) dst = dict.length; // 允许 append
          dict.splice(dst,0,moved); saveDict();
          // 关键改动：用 renderGroups() 统一刷新，避免使用旧 rows/refs 造成 off-by-one
          var q1 = shadow.getElementById('rive-search')?.value.trim().toLowerCase() || '';
          renderGroups(q1);
        }
      }

      // 词条拖拽：同理，更新数据后整体重渲染
      if (DND.mode==='item' && DND.dragItemEl){
        var groupEl = DND.dragItemEl.closest('.rive-group'); if(!groupEl) return;
        var gUid = groupEl.dataset.uid;
        var gIdx = dict.findIndex(function(x){ return x.uid===gUid; }); if (gIdx<0) return;

        var rows = Array.prototype.slice.call(groupEl.querySelectorAll('.rive-items > .rive-row'));
        var src2 = rows.indexOf(DND.dragItemEl);
        var dst2 = DND.tgtItemIdx != null ? DND.tgtItemIdx : src2;
        if (src2 < dst2 && dst2 < rows.length) dst2 = dst2 - 1; // 非末尾插入才补偿

        if (src2 !== dst2 && dst2 >= 0){
          var moved2 = dict[gIdx].items.splice(src2,1)[0];
          if (dst2 > dict[gIdx].items.length) dst2 = dict[gIdx].items.length; // 允许 append
          dict[gIdx].items.splice(dst2,0,moved2); saveDict();
          var q2 = shadow.getElementById('rive-search')?.value.trim().toLowerCase() || '';
          renderGroups(q2);
        }
      }

      DND.mode=null; DND.dragGroupEl=null; DND.dragItemEl=null; DND.tgtGroupIdx=null; DND.tgtItemIdx=null;
      hideIndicator();
    };

    groupsEl.onDragOverBound=onDragOver; groupsEl.onDropBound=onDrop;
    groupsEl.addEventListener('dragover', onDragOver);
    groupsEl.addEventListener('drop', onDrop);
  }

  function bindFooter(){
    var add=shadow.getElementById('btn-add');
    var imp=shadow.getElementById('btn-import');
    var exp=shadow.getElementById('btn-export');

    add.addEventListener('click', function(){
      var g=window.prompt('分组名',''); if(!g) return;
      var k=window.prompt('英文术语',''); if(!k) return;
      var v=window.prompt('中文翻译',''); if(v===null||v==='') return;
      var grp=dict.find(function(x){ return x.group===g; });
      if(!grp){ grp={uid:uid(), group:g, items:[]}; dict.push(grp); }
      grp.items.push({uid:uid(), key:k, value:v}); saveDict();
      var q=shadow.getElementById('rive-search').value.trim().toLowerCase(); renderGroups(q);
    });

    exp.addEventListener('click', function(){
      var data=JSON.stringify(dict.map(function(g){
        return { group:g.group, items:g.items.map(function(it){ return {key:it.key, value:it.value}; }) };
      }), null, 2);
      var blob=new Blob([data], {type:'application/json'});
      var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download='rive_terms.json'; a.click(); URL.revokeObjectURL(url);
    });

    imp.addEventListener('click', function(){
      var input=document.createElement('input'); input.type='file'; input.accept='.json,application/json';
      input.onchange=function(e){
        var file=e.target.files && e.target.files[0]; if(!file) return;
        var reader=new FileReader();
        reader.onload=function(evt){
          try{
            var json=JSON.parse(evt.target.result);
            if(!Array.isArray(json)){ window.alert('JSON 结构应为数组'); return; }
            dict=json.map(function(g){
              return { uid:uid(), group:g.group, items:Array.isArray(g.items)?g.items.map(function(it){ return {uid:uid(), key:it.key, value:it.value}; }):[] };
            });
            saveDict(); var q=shadow.getElementById('rive-search').value.trim().toLowerCase(); renderGroups(q);
          }catch(_){ window.alert('JSON 解析失败'); }
        };
        reader.readAsText(file);
      };
      input.click();
    });
  }

  var lastUrl=location.href;
  function ensurePanel(){ ensureHost(); if(!panelEl && !miniEl) buildPanel(); if(uiState.minimized && panelEl && !miniEl) toMini(); }
  function boot(){ try{ ensurePanel(); }catch(_){ setTimeout(boot,300); } }

  document.addEventListener('keydown', function(e){
    if(e.altKey && e.shiftKey && (e.key==='R' || e.key==='r')){
      try{
        ensureHost(); if(!panelEl) buildPanel();
        if(panelEl) panelEl.classList.remove('hidden');
        if(miniEl){ miniEl.remove(); miniEl=null; }
        uiState.minimized=false; saveUIState();
        setTimeout(function(){ applyEmergencyPanelStyle(panelEl); },50);
      }catch(_){}
    }
  });

  setInterval(function(){ if(lastUrl!==location.href){ lastUrl=location.href; setTimeout(ensurePanel,400); } }, 800);

  var mo=new MutationObserver(function(){ if(!document.getElementById('rive-i18n-host')){ setTimeout(function(){ buildPanel(); },300); } });
  function startObserver(){ if(!document.documentElement){ setTimeout(startObserver,200); return; } mo.observe(document.documentElement,{childList:true,subtree:true}); }

  document.addEventListener('visibilitychange', function(){ if(!document.hidden) setTimeout(ensurePanel,400); });
  setInterval(ensurePanel, 3000);

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', function(){ waitForDomReady(boot); }); waitForDomReady(boot); }
  else { waitForDomReady(boot); }
  startObserver();
})();
