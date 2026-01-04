// ==UserScript==
// @name        検索
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Execute UserScript
// @author       Your Name
// @match       https:/*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532291/%E6%A4%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/532291/%E6%A4%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    document.addEventListener('keydown', (e) => {
        
                if (e.key === 'l') {
                    javascript:(function(){   var text = window.getSelection().toString().trim();   if (!text) {     alert("検索する文字を選択してください。");     return;   }   var query = encodeURIComponent("site:momon-ga.com OR site:hitomi.la OR site:missav.ws " + text);   window.open("https://www.google.com/search?q=" + query, "_blank"); })();
                }
            
    });
})();