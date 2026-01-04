// ==UserScript==
// @name         Roll20 Boilerplate v2
// @namespace    http://statonions.com
// @version      0.2.4
// @description  Use this before other scripts
// @author       Justice Noon
// @match        https://app.roll20.net/editor/
// @include      https://app.roll20.net/assets/*
// @run-at       document-start
// @grant        GM_webRequest
// @webRequest   {"selector": {"include":"*/assets/app.js?*","exclude":"*/assets/app.js?n*"}, "action": "cancel" }
//Changelog: Rollback VTTES detection because it doesn't work on chrome unpacked (sometimes) depending on load order. Exposed variable is now just d20 everywhere. VTTES already exposes it. Activating VTTES or this script should do the same thing for scripts relying on window.d20
// @downloadURL https://update.greasyfork.org/scripts/381827/Roll20%20Boilerplate%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/381827/Roll20%20Boilerplate%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var readyScript = '';

    GM_webRequest([{"selector": {"include":"*/assets/app.js?*","exclude":"*/assets/app.js?n*"}, "action": "cancel" }], function(info, message, details) {
        console.log(info, message, details);
    });
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function() {
		readyScript = this.responseText.replace('getPointer,degreesToRadians;', 'getPointer,degreesToRadians;window.d20=d20;');
    });
    oReq.open("GET", "https://app.roll20.net/assets/app.js?n" + Date.now());
    oReq.send();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(({ addedNodes }) => {
            addedNodes.forEach(node => {
                if(node.nodeType === 1 && node.tagName === 'SCRIPT') {
                    const src = node.src || '';
                    //Load modified app when it would have loaded normally
                    if(src.indexOf('assets/app.js') > -1) {
                        window.eval(readyScript);
                        node.type = 'javascript/blocked';
                        node.parentElement.removeChild(node);
                        observer.disconnect();
                    }
                }
            })
        })
    })

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    })
})();