// ==UserScript==
// @name        Braveに切り替え j
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Execute UserScript
// @author       Your Name
// @match       https://*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531687/Brave%E3%81%AB%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88%20j.user.js
// @updateURL https://update.greasyfork.org/scripts/531687/Brave%E3%81%AB%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88%20j.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    document.addEventListener('keydown', (e) => {
        
                if (e.key === 'j') {
                    javascript:(function(){   var u = window.location.href;   var ua = navigator.userAgent;   if(/android/i.test(ua)){    window.location = "intent:" + u.replace(/^https?:\/\//, "") + "#Intent;package=com.brave.browser;scheme=https;end";   } else if(/(iPhone|iPad|iPod)/i.test(ua)){ window.location = "brave://open-url?url=" + encodeURIComponent(u);   } else {    if(confirm("Braveで表示しますか？")){       window.location = "brave://open-url?url=" + encodeURIComponent(u);     }   } })();
                }
            
    });
})();