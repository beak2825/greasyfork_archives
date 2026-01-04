// ==UserScript==
// @name         Dark/Light Mode Toggle Button
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Toggle between dark and light mode with a floating button.
// @author       Lincoln
// @match        *://*/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/537597/DarkLight%20Mode%20Toggle%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/537597/DarkLight%20Mode%20Toggle%20Button.meta.js
// ==/UserScript==

(function(){'use strict';const a=document.createElement('div');a.innerHTML='🌓';a.title='Toggle Dark/Light Mode';a.style.cssText='position:fixed;bottom:20px;right:20px;width:50px;height:50px;background-color:#ffffffdd;color:#000;font-size:24px;border-radius:50%;display:flex;justify-content:center;align-items:center;cursor:pointer;z-index:9999;box-shadow:0 2px 8px rgba(0,0,0,0.3);transition:background-color 0.3s ease,color 0.3s ease;';document.body.appendChild(a);const b=document.createElement('style');b.id='dark-mode-style';b.textContent='html,body{background-color:#121212!important;color:#e0e0e0!important;}img,video{filter:brightness(0.8) contrast(1.2);}a{color:#90caf9!important;}*{background-color:transparent!important;border-color:#444!important;}';let c=false;a.onclick=()=>{if(!c){document.head.appendChild(b);a.style.backgroundColor='#222';a.style.color='#fff';}else{const d=document.getElementById('dark-mode-style');d&&d.remove();a.style.backgroundColor='#ffffffdd';a.style.color='#000';}c=!c;};})();
