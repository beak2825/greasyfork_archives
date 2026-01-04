// ==UserScript==
// @name         Background Profile Viewer (Double-Click)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Даёт возможность увидеть фон любого человека у него в профиле в оригинальном виде и открывает изображение в новой вкладке при клике правой кнопкой мыши
// @author       MSHR
// @license      MSHR
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504501/Background%20Profile%20Viewer%20%28Double-Click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/504501/Background%20Profile%20Viewer%20%28Double-Click%29.meta.js
// ==/UserScript==

(() => {
  const noAnim = ['Menu','HeaderMenu','JsOnly','navPopup','Popup','Loaded','MenuOpened','tippy-box','xenOverlay','chat2-floating','lztng-10gi8uj'];
 
  const getPath = e => e.composedPath?.() || (() => {
    const path = [], el = e.target;
    for (let el = e.target; el; el = el.parentElement) path.push(el);
    return path.concat(document, window);
  })();
 
  const hasClassIn = (el, cls) => el?.classList && cls.some(c => el.classList.contains(c));
  const pathHasClass = (p, cls) => p.some(el => hasClassIn(el, cls));
 
  const getBgUrl = () => {
    const bg = getComputedStyle(document.getElementById('memberBackground'))?.backgroundImage;
    return bg?.match(/url\((['"]?)(.*?)\1\)/)?.[2] || null;
  };
 
  const init = () => {
    const h = document.getElementById('header'),
          hm = document.getElementById('headerMover'),
          bbt = [...document.querySelectorAll('div.breadBoxTop')],
          mb = document.getElementById('memberBackground'),
          chat = document.querySelector('.chat2-button.chat2-button-open.lztng-12iv6pu');
 
    if (!h || !hm || !bbt.length || !mb) return setTimeout(init, 500);
 
    const elems = [h, hm, ...bbt, chat].filter(Boolean), bgUrl = getBgUrl();
    if (bgUrl) {
      Object.assign(mb.style, {
        backgroundImage: `url("${bgUrl}")`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: '-1',
        transition: 'background-image 0.8s ease'
      });
    }
 
    let removed = false, scrollY = 0;
 
    const toggle = () => {
      removed = !removed;
      document.body.classList.toggle('header', !removed);
      mb.classList.toggle('gradient-visible', !removed);
      elems.forEach(el => {
        el.style.transition = 'opacity 0.6s, transform 0.6s';
        el.style.opacity = removed ? '0' : '1';
        el.style.pointerEvents = removed ? 'none' : 'auto';
        if (el === chat) el.style.transform = removed ? 'translateY(10px)' : 'translateY(0)';
      });
      if (!removed) {
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY);
          requestAnimationFrame(() => window.scrollTo(0, scrollY));
        });
      } else scrollY = window.scrollY || window.pageYOffset;
    };
 
    const shouldIgnore = e => {
      const path = getPath(e);
      return path.includes(hm) || elems.some(el => path.includes(el)) || pathHasClass(path, noAnim) ||
        (document.querySelector('.xenOverlay') && !path.includes(document.querySelector('.xenOverlay')));
    };
 
    document.addEventListener('dblclick', e => {
      if (e.button === 0 && !shouldIgnore(e)) toggle();
    });
 
    document.addEventListener('contextmenu', e => {
      if (shouldIgnore(e)) return;
      const url = getBgUrl();
      if (url) {
        e.preventDefault();
        window.open(url, '_blank');
      }
    });
 
    const style = document.createElement('style');
    style.textContent = `
      #memberBackground {
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-size: cover !important;
        background-attachment: fixed !important;
      }
      #memberBackground::before {
        content: ''; position: absolute; top:0; left:0; right:0; bottom:0;
        pointer-events: none; background: rgba(54,54,54,0.85);
        opacity: 0; transition: opacity 0.8s ease; z-index: 1;
      }
      #memberBackground.gradient-visible::before { opacity: 1; }
      .chat2-button.chat2-button-open.lztng-12iv6pu {
        transition: opacity 0.8s, transform 0.8s;
      }
    `;
    document.head.appendChild(style);
    mb.classList.add('gradient-visible');
  };
 
  init();
})();