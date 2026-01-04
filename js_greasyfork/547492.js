// ==UserScript==
// @name         Shortcut Keys
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Some unuseful shortcut keys
// @author       Me
// @match        *://*/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/547492/Shortcut%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/547492/Shortcut%20Keys.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event) {
        // Duplicate Tab
        let a=event.altKey,
            c=event.ctrlKey,
            s=event.shiftKey,
            k = event.key;
        const currentUrl = window.location.href;
        if (a && k === 't') {
            event.preventDefault();
            GM_openInTab(currentUrl, { active: true });
        }
        //Open Gemini
        if (a && k === 'g') {
            event.preventDefault();
            GM_openInTab("https://gemini.google.com/app?hl=vi", { active: true });
        }
        //Open Coding Space
        if (a && k === 'c') {
            event.preventDefault();
            GM_openInTab("https://www.programiz.com/javascript/online-compiler/", {active: true });
        }
        // Auto Capslock in Geogebra
        if (currentUrl === 'https://www.geogebra.org/geometry') {
            let x = k.charCodeAt(0);
            if (a || c || k.length>1) {
                return;
            } else {
                event.preventDefault();
                if (x > 96 && x < 123){
                    x-=32;
                    document.execCommand('insertText',false,String.fromCharCode(x));
                } else if (x > 64 && x < 91){
                    x+=32;
                    document.execCommand('insertText',false,String.fromCharCode(x));
                } else {
                    document.execCommand('insertText',false,k);
                }
            }
        }
        //
    });
})();
