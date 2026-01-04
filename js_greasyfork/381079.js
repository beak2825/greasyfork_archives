// ==UserScript==
// @name         Oanda.com Trading Platform - Enable Chart Dark Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enables the hidden "dark mode" theme for the Chart on Oanda's web trading platform.
// @author       FreshScripts
// @match        https://trade.oanda.com/
// @grant        CC BY - Creative Commons Attribution
// @downloadURL https://update.greasyfork.org/scripts/381079/Oandacom%20Trading%20Platform%20-%20Enable%20Chart%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/381079/Oandacom%20Trading%20Platform%20-%20Enable%20Chart%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Bypassing browser warning...');
    var button = document.querySelector('.button button');
    button.click();

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {

            if (mutation.type !== 'childList') return
            for (var i = 0; i < mutation.addedNodes.length; i++) {

                // do things to your newly added nodes here
                var thisNode = mutation.addedNodes[i];
                if (thisNode.nodeName === 'IFRAME'){

                    thisNode.onload = function() {
                        console.log('iframe is completely loaded, setting theme to Dark');
                        thisNode.contentWindow.document.getElementsByTagName('html')[0].classList.add('theme-dark');
                        // stop watching using:
                        observer.disconnect()
                    }
                }
            }
        })
    })
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    })
})();