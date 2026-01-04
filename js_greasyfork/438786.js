// ==UserScript==
// @name        anti-select-none - csdn.net
// @namespace   Violentmonkey Scripts
// @match       https://blog.csdn.net/*
// @grant       none
// @version     1.1.0
// @author      Lofairy
// @icon        https://blog.csdn.net/favicon.ico
// @description 解除 CSDN code block 的 select 鎖定
// @downloadURL https://update.greasyfork.org/scripts/438786/anti-select-none%20-%20csdnnet.user.js
// @updateURL https://update.greasyfork.org/scripts/438786/anti-select-none%20-%20csdnnet.meta.js
// ==/UserScript==

/* jshint esversion:6 */

(function() {
    'use strict';
    // console.info('init');

    var observer = new MutationObserver(resetTimer);
    var timer = setTimeout(action, 3000, observer);
    observer.observe(document, {childList: true, subtree: true});

    // reset timer every time something changes
    function resetTimer(changes, observer) {
        // console.info('timer');
        clearTimeout(timer);
        timer = setTimeout(action, 3000, observer);
    }

    function action(observer) {
      let codeElemants = document.querySelectorAll('pre');
      if (codeElemants.length > 0) {
        observer.disconnect();
        // console.info('done');
        codeElemants.forEach(ele => {
            ele.children[0].style.userSelect = 'text';
            ele.children[0].style.webkitUserSelect = 'text';
            ele.children[1].remove();
        });
      }
    }
  
})();