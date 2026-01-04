// ==UserScript==
// @name         Kongregate 2.0 - Disable Animations
// @namespace    com.ruudiluca.kongregate.disable.animations
// @description  Disable animations from the new Kongregate homepage
// @version      0.1
// @author       Ruudiluca
// @match        https://www.kongregate.com/
// @grant        GM_addElement
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478274/Kongregate%2020%20-%20Disable%20Animations.user.js
// @updateURL https://update.greasyfork.org/scripts/478274/Kongregate%2020%20-%20Disable%20Animations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function executeScript() {
        let sliderRoot = document.getElementsByTagName('k-ticker-banner')[0];
        let sliderDom = sliderRoot?.shadowRoot;

        if (!sliderDom) return setTimeout(executeScript, 100); // retry a bit later

        let styles = `
        .ticker-banner__ticker {
            animation: initial !important;
            padding-left: initial !important;
            margin: auto !important;
        }
    `;
        GM_addElement(sliderDom, 'style', { textContent: styles });

    }

    executeScript();

    function handleMutations(mutationsList, observer) {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                [].slice.apply(mutation.addedNodes).filter(is_gif_image).map(freeze_gif);
            }
        });
    }

    const observer = new MutationObserver(handleMutations);
    observer.observe(document, { childList: true, subtree: true });

    function is_gif_image(i) {
        return /^(?!data:).*\.gif/i.test(i.src);
    }

    function freeze_gif(i) {
        var c = document.createElement('canvas');
        var w = c.width = i.width;
        var h = c.height = i.height;
        c.getContext('2d').drawImage(i, 0, 0, w, h);
        try {
            i.src = c.toDataURL("image/gif"); // if possible, retain all css aspects
        } catch(e) { // cross-domain -- mimic original with all its tag attributes
            for (var j = 0, a; a = i.attributes[j]; j++)
                c.setAttribute(a.name, a.value);
            i.parentNode.replaceChild(c, i);
        }
    }
})();