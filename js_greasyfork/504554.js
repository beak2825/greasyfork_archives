// ==UserScript==
// @name         Serebii No New Tab
// @namespace    Violentmonkey Scripts
// @version      0.1
// @license      MIT
// @description  I hate it when I have a million tabs of pokemon data open!
// @author       Kayleigh
// @icon         https://www.google.com/s2/favicons?sz=64&domain=serebii.net
// @match        https://serebii.net/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/504554/Serebii%20No%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/504554/Serebii%20No%20New%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var win = unsafeWindow || window;
    if (win.top !== win.self) return;

    console.time('Remove New Tab');

    function removeAttrs (scope) {
        var links = scope.querySelectorAll('a[target="_blank"]');
      	var i;
        for (i = links.length - 1; i >= 0; --i) {
            links[i].removeAttribute('target');
        }
    }

    removeAttrs (document.body);

    var obs = new MutationObserver(function(ms){
        ms.forEach(function(m){
            m.addedNodes.forEach(function(n){
                if (n.nodeType !== Node.ELEMENT_NODE) {
                    return;
                }
                removeAttrs(n);
            });
        });
    });
    obs.observe(document.body, {childList: true, subtree: true});

    console.timeEnd('Remove New Tab');
})();