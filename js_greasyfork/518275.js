// ==UserScript==
// @name         Brainly Plus
// @namespace    brainly
// @version      1.0.0
// @description  Visualize as resposta e remova os paineis irritantes
// @author       Dev4S
// @license      MIT
// @match        https://brainly.com.br/*
// @icon         https://www.google.com/s2/favicons?domain=brainly.com.br
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518275/Brainly%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/518275/Brainly%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hookProperty(parent, prop, beforeCallback) {
        let oldValue;

        Object.defineProperty(parent, prop, {
            get: function () {
                return oldValue;
            },
            set: function (newValue) {
                if (oldValue !== newValue){
                    oldValue = beforeCallback(newValue);
                }
            },
            enumerable: true,
            configurable: false,
        });
    }

    hookProperty(window, 'jsData', function (jsData) {
        hookProperty(jsData, 'hasVideoMeteringUnlogEnabled', ()=> false);
        hookProperty(jsData, 'hasVideoMeteringLogEnabled', ()=> false);
        hookProperty(jsData, 'hasVideoMeteringRedesignEnabled', ()=> false);
        hookProperty(jsData, 'hasBrainlyPlusToasterOnLoggedFeed', ()=> false);
        return jsData;
    })
})();




