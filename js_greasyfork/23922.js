// ==UserScript==
// @name         Anti-Adblock Killer for overclockers.ru
// @namespace    FIX
// @version      0.14
// @description  Don't touch my Adblocker!
// @author       raletag
// @include      *://overclockers.ru/*
// @include      *://*.overclockers.ru/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/23922/Anti-Adblock%20Killer%20for%20overclockersru.user.js
// @updateURL https://update.greasyfork.org/scripts/23922/Anti-Adblock%20Killer%20for%20overclockersru.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function AAK () {
        var MO = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        if (!MO) {
            alert('ENG: Anti-Adblock Killer for overclockers.ru is not supported in this browser! \nRUS: Anti-Adblock Killer for overclockers.ru не поддерживается в данном браузере!');
            return;
        }
        new MO(function (ms) {
            var m, n;
            for (m of ms) {
                for (n of m.addedNodes) {
                    if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'SCRIPT' && /adblock/i.test(n.innerHTML)) {
                        n.innerHTML  = n.innerHTML.replace(/\$(.*)["']body["'](.*);/ig,'');
                        console.log('Anti-Adblock killed');
                    }
                }
            }
        }).observe(document, {childList:true, subtree:true});
    }
    var scr = document.createElement('script'),
        meta = document.createElement('meta');
    meta.httpEquiv = 'Cache-Control';
    meta.content = 'max-age=1, must-revalidate';
    scr.textContent = '(' + AAK.toString() + ')();';
    (document.documentElement||document).appendChild(meta);
    (document.documentElement||document).appendChild(scr);
})();