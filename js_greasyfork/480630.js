// ==UserScript==
// @name         skidrowreloaded.com block pub
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script removes ads and reactivates text selection on the skidrowreloaded.com site
// @author       AngeHell
// @match        https://www.skidrowreloaded.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skidrowreloaded.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480630/skidrowreloadedcom%20block%20pub.user.js
// @updateURL https://update.greasyfork.org/scripts/480630/skidrowreloadedcom%20block%20pub.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        ('a[dont]').remove();
    },1500)
    document.body.onselectstart = null;
    document.body.onmousedown = null;
    document.body.style.cursor = "";
    document.oncontextmenu = null;
    window.addEventListener('load', function() {
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src.includes('edvxygh.com/script/ut.js')) {
                scripts[i].parentNode.removeChild(scripts[i]);
            }
        }
        var hiddenLinks = document.querySelectorAll('a[style*="display: none"], a[style*="visibility: hidden"]');
        hiddenLinks.forEach(function(link) {
            if (link.href.includes('tqrjlqt.com/ad/visit.php')) {
                link.parentNode.removeChild(link);
            }
        });
    });

})();