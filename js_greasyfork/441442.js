// ==UserScript==
// @name         xistore.by Privacy Window and Ad Removal
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes the privacy window and the header's top ad row
// @author       psxvoid
// @match        https://xistore.by/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xistore.by
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441442/xistoreby%20Privacy%20Window%20and%20Ad%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/441442/xistoreby%20Privacy%20Window%20and%20Ad%20Removal.meta.js
// ==/UserScript==

(function() {
    'use strict';

     let isObserving = false,
        isNextProcessingRequested = false;

    const processDom = () => {
        isObserving = true;

        const toRemoveSelectors = [
                  "div.personalData-auth.popup", // privacy blocking popup
                  "div.header-block-topb-mobile", // header ad line
                  "div.header-block-topb", // header ad line
              ];

        for (let selector of toRemoveSelectors) {
            let element = document.querySelector(selector);
            if (element != null) {
                element.remove();
            }
        }

        setTimeout(() => {
            if (isNextProcessingRequested) {
                isNextProcessingRequested = false;
                processDom();
            }
        }, 50);
    };

    processDom();

    // Your code here...
     var observeDOM = (function () {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;

        return function (obj, callback) {
            if (MutationObserver) {
                // define a new observer
                var obs = new MutationObserver(function (mutations, observer) {
                    //if(mutations[0].addedNodes.length || mutations[0].removedNodes.length)
                    if (mutations[0].addedNodes.length) {
                        if (isObserving) {
                            isNextProcessingRequested = true;
                            return;
                        }
                    }
                    callback();
                });
                // have the observer observe foo for changes in children
                obs.observe(obj, {
                    childList: true,
                    subtree: true
                });
            } else if (eventListenerSupported) {
                obj.addEventListener('DOMNodeInserted', callback, false);
                //obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        };
    })();
    let containers = document.querySelectorAll('body');
    let n = containers.length;
    for (let i = 0; i < n; ++i) {
        let d = containers[i];
        //TODO: Uncomment, performance issues
        observeDOM(d, processDom);
    }
})();