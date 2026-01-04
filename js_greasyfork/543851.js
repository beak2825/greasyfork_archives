// ==UserScript==
// @name         MBSSTagBetter
// @namespace    http://tampermonkey.net/
// @version      1.16
// @description  Упрощённая работа с тегами в MBSS
// @author       Sunnybunny
// @match        https://support-admin-common-master.mbss.maxbit.private/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543851/MBSSTagBetter.user.js
// @updateURL https://update.greasyfork.org/scripts/543851/MBSSTagBetter.meta.js
// ==/UserScript==

;(function(){
  'use strict';

  // —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
  // 1) Глобальные флаги (до создания кнопок)
  // —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
  let visible      = false;
  let deletionMode = false;
  let moveMode     = false;
  let seenDialog   = false;

  // —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
  // 2) Настройки селекторов и интервалов
  // —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
  const ADDTAG_SELECTOR         = '#active_room_addTag';
  const ROOMS_LIST_BTN_SELECTOR = '#rooms-list .vac-room-info > button.el-button';
  const CHECK_INTERVAL          = 200;  // ms

  // —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
  // 3) Построить UI: красный круг + toolbar
  // —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
  const circle  = createCircle();
  const toolbar = createToolbar();
  document.body.append(circle, toolbar);

  // —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
  // 4) Восстановить ранее созданные кнопки
  // —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
  const items = loadState().map(cfg => {
    cfg.el = createItem(cfg);
    return cfg;
  });

  // —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
  // 5) Ловим клик по “Add tag”
  // —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
  document.body.addEventListener('click', e => {
    if (e.target.closest(ADDTAG_SELECTOR)) {
      console.log('[TagBetter] Add tag clicked');
      triggerTagBetter();
    }
  });

  // —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
  // 6) Настраиваем наблюдение за #rooms-list (динамические вкладки)
  // —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
  setupRoomsButtonsObserver();

  // —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
  // 7) Функция-стартер: показывает UI и ждёт закрытия диалога
  // —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
  function triggerTagBetter(){
    showAll();
    seenDialog = false;
    const code = getCodeUrl();
    const watcher = setInterval(() => {
      const sel    = `[aria-label="Add tag to ${code}"]`;
      const dialog = document.querySelector(sel);
      if (dialog) seenDialog = true;
      else if (seenDialog) {
        hideAll();
        clearInterval(watcher);
      }
    }, CHECK_INTERVAL);
  }

  // —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
  // 8) Модуль: следим за появлением/удалением кнопок в #rooms-list
  // —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
  function setupRoomsButtonsObserver(){
    const root = document.querySelector('#rooms-list');
    if (!root) {
      setTimeout(setupRoomsButtonsObserver, 500);
      return;
    }
    initRoomButtons(root);
    const obs = new MutationObserver(() => initRoomButtons(root));
    obs.observe(root, { childList: true, subtree: true });
  }

  function initRoomButtons(root){
    root.querySelectorAll(ROOMS_LIST_BTN_SELECTOR).forEach(btn => {
      if (btn.__tb_initialized) return;
      btn.__tb_initialized = true;
      btn.addEventListener('click', () => {
        console.log('[TagBetter] rooms-list button clicked');
        triggerTagBetter();
      });
    });
  }

  // —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
  // 9) HELPERS: парсинг URL, сохранение, создание UI-элементов, show/hide…
  // —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––—
  function getCodeUrl(){
    const p = new URLSearchParams(location.search);
    return p.get('codeUrl')||p.get('id')||location.href.split('=').pop();
  }

  function loadState(){
    try {
      return JSON.parse(localStorage.getItem('tagbetter-items')||'[]');
    } catch {
      return [];
    }
  }

  function saveState(){
    const dump = items.map(({id,text,x,y})=>({id,text,x,y}));
    localStorage.setItem('tagbetter-items', JSON.stringify(dump));
  }

  function createCircle(){
    const c = document.createElement('div');
    Object.assign(c.style, {
      position:'fixed', top:'50%', right:'20px',
      width:'100px', height:'100px',
      background:'red', borderRadius:'50%',
      transform:'translateY(-50%)',
      display:'none', zIndex:'9999'
    });
    return c;
  }

  function createToolbar(){
    const bar = document.createElement('div');
    Object.assign(bar.style, {
      position:'fixed', top:'20px', right:'20px',
      background:'#fff', border:'1px solid #ccc',
      padding:'8px', borderRadius:'4px',
      display:'none', zIndex:'9999'
    });
    bar.append(
      mkBtn('Создать', ()=>{
        const txt = prompt('Текст кнопки:');
        if (!txt) return;
        const cfg = {
          id: 'tb_'+Date.now(),
          text: txt,
          x: window.innerWidth/2,
          y: window.innerHeight/2
        };
        cfg.el = createItem(cfg);
        items.push(cfg);
        saveState();
      }),
      mkBtn('Удалить', btn => {
        deletionMode = !deletionMode;
        btn.style.background = deletionMode? '#fcc':'';
      }),
      mkBtn('Перемещение', btn => {
        moveMode = !moveMode;
        btn.style.background = moveMode? '#cff':'';
        items.forEach(o=>o.el&&(o.el.style.cursor=moveMode?'move':'pointer'));
      })
    );
    return bar;

    function mkBtn(label, handler){
      const b = document.createElement('button');
      b.textContent = label;
      Object.assign(b.style, {marginRight:'6px',padding:'4px 8px'});
      b.addEventListener('click', handler);
      return b;
    }
  }

  function createItem(cfg){
    const b = document.createElement('button');
    b.textContent = cfg.text;
    b.id = cfg.id;
    Object.assign(b.style, {
      position:'absolute',
      left: cfg.x+'px',
      top:  cfg.y+'px',
      padding:'4px 8px',
      display: visible?'block':'none',
      cursor: visible&&moveMode?'move':'pointer',
      zIndex:'9998'
    });
    document.body.append(b);

    b.addEventListener('click', async e => {
      e.stopPropagation();
      if (deletionMode) {
        b.remove();
        const idx = items.findIndex(o=>o.id===cfg.id);
        if (idx>-1) items.splice(idx,1);
        saveState();
        return;
      }
      // автоселект Element UI
      let wrap = document.querySelector(
        '.el-select-dropdown__wrap.el-scrollbar__wrap.el-scrollbar__wrap--hidden-default'
      );
      if (!wrap) {
        const inp = document.querySelector('.el-select__input');
        if (!inp) return;
        inp.click();
      }
      const list = await new Promise(res=>{
        const start = Date.now();
        const tid = setInterval(()=>{
          const lst = document.querySelector(
            '.el-scrollbar__view.el-select-dropdown__list'
          );
          if (lst) { clearInterval(tid); res(lst); }
          else if (Date.now()-start>3000){ clearInterval(tid); res(null); }
        },100);
      });
      if (!list) return;
      const opt = Array.from(list.querySelectorAll('li'))
                       .find(li=>li.textContent.trim()===cfg.text);
      if (opt) opt.click();
    });

    // drag’n’drop
    let dragging=false, dx=0, dy=0;
    b.addEventListener('mousedown', e =>{
      if (!moveMode) return;
      dragging=true;
      dx = e.clientX - b.offsetLeft;
      dy = e.clientY - b.offsetTop;
      e.preventDefault();
    });
    document.addEventListener('mousemove', e =>{
      if (!dragging) return;
      b.style.left = e.clientX - dx + 'px';
      b.style.top  = e.clientY - dy + 'px';
    });
    document.addEventListener('mouseup', ()=>{
      if (!dragging) return;
      dragging = false;
      cfg.x = b.offsetLeft;
      cfg.y = b.offsetTop;
      saveState();
    });

    return b;
  }

  function showAll(){
    visible = true;
    circle.style.display  = 'block';
    toolbar.style.display = 'block';
    items.forEach(o=>o.el&&(o.el.style.display='block'));
  }

  function hideAll(){
    visible = false;
    circle.style.display  = 'none';
    toolbar.style.display = 'none';
    items.forEach(o=>o.el&&(o.el.style.display='none'));
  }

})();