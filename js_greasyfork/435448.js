// ==UserScript==
// @name         Sunshine
// @namespace    Sunshine_on_my_page.
// @version      0.3
// @description  There is sunshine on my page
// @author       You
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://i.v2ex.co/w2nVO5jns.png
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/435448/Sunshine.user.js
// @updateURL https://update.greasyfork.org/scripts/435448/Sunshine.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const initSunshine = ()=>{
    const sunshineRoot = document.createElement('div')
    sunshineRoot.id = 'sunshine'
    const sunshine = sunshineRoot.attachShadow({mode: open})
    sunshine.innerHTML = `
    <style>
      .panel {
        --window-border-width: 9px;
        --sun-angle: -75deg;
        position: fixed;
        right: 0;
        top: -5vw;
        width: 80vw;
        height: 80vh;
        z-index: 2147483647;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        pointer-events: none;
        transform-origin: top right;
        transform: matrix(1, -0.1, 0, 1, 0, 0)
      }
      .panel > .win-grid {
        width: calc(40vw - var(--window-border-width));
        height: calc(40vh - var(--window-border-width));
        background: rgba(255, 255, 255, .3);
        box-shadow: -3px 3px 6px rgb(255 255 255 / 10%), 3px -3px 18px rgb(0 0 0 / 3%);
      }
      .panel > .win-grid:nth-child(even) {
        background: linear-gradient(var(--sun-angle), rgba(255, 255, 255, .5), rgba(255, 255, 255, .3));
        backdrop-filter: blur(2px) brightness(1.1);
      }
      .panel > .win-grid:nth-child(odd) {
        background: linear-gradient(var(--sun-angle), rgba(255, 255, 255, .3), rgba(255, 255, 255, .1));
        backdrop-filter: blur(1px) brightness(1.05);
      }
    </style>
    <div class="panel">
      <div class="win-grid"></div>
      <div class="win-grid"></div>
      <div class="win-grid"></div>
      <div class="win-grid"></div>
    </div>
    `
    document.documentElement.appendChild(sunshineRoot)
  }
  const exitSunshine = ()=>{
    document.documentElement.removeChild(document.documentElement.querySelector('#sunshine'))
  }
  GM_registerMenuCommand('Toggle Sunshine.', ()=>{
    if(document.documentElement.querySelector('#sunshine')){
      exitSunshine()
      GM_setValue('show_sunshine', false)
      return
    }
    initSunshine()
    GM_setValue('show_sunshine', true)
  })
  if(GM_getValue('show_sunshine', false)) initSunshine()
})();