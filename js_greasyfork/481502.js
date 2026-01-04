
// ==UserScript==
// @name         Liwu Font Improved
// @license MIT
// @namespace    http://github.com/eastarpen
// @version      0.1
// @description  Customize [Liwu](www.253874.net) CSS
// @author       Eastarpen
// @match        https://www.253874.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=253874.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/481502/Liwu%20Font%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/481502/Liwu%20Font%20Improved.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeBodyCSS(doc) {
        const customCSS = {
            "font-size": "18px",
            "font-family": "'Consolas','Microsoft Yahei',sans-serif",
            "line-height": "180%"
        };

        // Apply the CSS properties to the body tag
        const body = doc.body;
        if (body) {
            for (let prop in customCSS) {
                body.style[prop] = customCSS[prop];
            }
        }
    }

    function onFrameLoad(event) {
        const frame = event.target;
        let frameDoc;
        try {
            frameDoc = frame.contentDocument || frame.contentWindow.document;
        } catch (e) {
            console.error('Access to frame content was denied.', e);
            return;
        }
        changeBodyCSS(frameDoc);
    }

    // Function to attach the load event listener to a frame
    function attachLoadListenerToFrame(frame) {
        frame.addEventListener('load', onFrameLoad);
    }

    // Attach to normal Html element
    changeBodyCSS(document);
    // Attach to all current frames/iframes
    const frames = document.querySelectorAll('frame, iframe');
    frames.forEach(attachLoadListenerToFrame);

    // Observe the DOM for the addition of new frames/iframes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'FRAME' || node.tagName === 'IFRAME') {
                    attachLoadListenerToFrame(node);
                }
            });
        });
    });

    // Start observing the document body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });

})();
