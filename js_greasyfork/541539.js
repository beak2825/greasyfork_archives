// ==UserScript==
// @name        Auto-Scroller 
// @version     1.1
// @description Auto-Scroller, works on mobile and desktop.
// @license     CC0-1.0
// @author       Mane
// @match       *://*/*
// @grant       none
// @run-at      document-idle
// @namespace https://greasyfork.org/users/1491313
// @downloadURL https://update.greasyfork.org/scripts/541539/Auto-Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/541539/Auto-Scroller.meta.js
// ==/UserScript==

;(function(){
  'use strict';

  const SPEED       = 1;    // px per tick
  const INTERVAL_MS = 16;   // ~60fps
  let ticker = null;

  // pick the correct scroll container
  function getScroller(){
    return document.scrollingElement 
        || document.documentElement 
        || document.body;
  }

  function play(){
    if (ticker) return;
    ticker = setInterval(()=>{
      const s = getScroller();
      s.scrollTop = s.scrollTop + SPEED;
    }, INTERVAL_MS);
  }

  function pause(){
    if (!ticker) return;
    clearInterval(ticker);
    ticker = null;
  }

  // build UI once <body> exists
  function init(){
    if (!document.body){
      document.addEventListener('DOMContentLoaded', init, {once:true});
      return;
    }

    const container = document.createElement('div');
    Object.assign(container.style, {
      position:  'fixed',
      bottom:    '20px',
      right:     '20px',
      display:   'flex',
      gap:       '6px',
      zIndex:    999999
    });

    function makeButton(symbol, onClick){
      const btn = document.createElement('button');
      btn.textContent = symbol;
      Object.assign(btn.style, {
        padding:      '8px 12px',
        fontSize:     '18px',
        background:   'rgba(0,0,0,0.6)',
        color:        '#fff',
        border:       'none',
        borderRadius: '6px',
        cursor:       'pointer'
      });
      btn.addEventListener('click', onClick);
      return btn;
    }

    container.append(
      makeButton('▶️', play),
      makeButton('⏸️', pause)
    );
    document.body.appendChild(container);
  }

  init();
})();
