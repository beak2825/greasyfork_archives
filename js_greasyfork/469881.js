// ==UserScript==
// @name         ankimemory 答题优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Anki web版答题优化
// @author       Matrixbingo
// @match        *://ankimemory.com/space/deck/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
 
// @downloadURL https://update.greasyfork.org/scripts/469881/ankimemory%20%E7%AD%94%E9%A2%98%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/469881/ankimemory%20%E7%AD%94%E9%A2%98%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    window.fillTimer = setInterval(function(){
      const doms = document.getElementsByClassName('w-fill');
      const dom =doms?.[1];
      if(!!dom && dom.className === 'w-fill h-fill bg-f bdr-15 position-relative column'){
        dom.style.maxWidth = '90%'
        clearInterval(window.fillTimer);
      }
    }, 1000);
})();