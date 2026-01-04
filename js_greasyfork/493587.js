// ==UserScript==
// @name        有谱么 Copyleft
// @namespace   Violentmonkey Scripts
// @match       https://yopu.co/*
// @grant       GM_addStyle
// @version     1.3
// @author      Byaidu
// @description 解锁版权下架乐谱
// @license     GNU General Public License v3.0 or later
// @downloadURL https://update.greasyfork.org/scripts/493587/%E6%9C%89%E8%B0%B1%E4%B9%88%20Copyleft.user.js
// @updateURL https://update.greasyfork.org/scripts/493587/%E6%9C%89%E8%B0%B1%E4%B9%88%20Copyleft.meta.js
// ==/UserScript==
(function() {
    GM_addStyle('.copyright-note {display:none;}')
    setInterval(()=>{
        Array.from(document.getElementsByClassName('copyright')).forEach((n)=>{
          if (n.nodeName=='A'){
              n.classList.remove('copyright');
          }
          if (n.nodeName=='DIV'&&n.parentNode.classList.contains('song-preview')){
              n.classList.remove('copyright');
              n.parentNode.getElementsByTagName('a')[0].href=n.parentNode.getElementsByTagName('a')[0].href.replace('song#title=','explore#q=').replace('&artist=',' ');
          }
        })
    },1000)
})();