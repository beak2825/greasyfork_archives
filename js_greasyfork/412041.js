// ==UserScript==
// @name         安乐滚
// @author       Jones Miller
// @version      23.04.01
// @namespace    https://t.me/jsday
// @description  Chromium 窄滚动条。
// @include      *
// @run-at       document-start
// @compatible   chrome
// @downloadURL https://update.greasyfork.org/scripts/412041/%E5%AE%89%E4%B9%90%E6%BB%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/412041/%E5%AE%89%E4%B9%90%E6%BB%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

  var jmforalg=' ::-webkit-scrollbar { width:9px;} ::-webkit-scrollbar-track { background:rgba(0,0,0,0); border-radius:2px;} ::-webkit-scrollbar-thumb { background:rgba(125,125,125,1); min-height:50px; border-radius:4px;}';
  function GMaddStyle(jmfor_alg) {
    var jmforalg=document.createElement('style'),jm_foralg;
    jmforalg.textContent=jmfor_alg;
    if (location.origin === '') {
      jm_foralg = document.head || document.documentElement;
    } else {
      jm_foralg = document.body || document.documentElement;
    }
    jm_foralg.appendChild(jmforalg);
  }
  GMaddStyle(jmforalg);
})();