// ==UserScript==
// @name         Enable Dokieli Save
// @namespace    http://tampermonkey.net/
// @version      2024-03-09
// @description  Dokieli save button is currently disabled always with pods: https://github.com/linkeddata/dokieli/issues/390 -- this attempts to force it to be enabled.
// @author       https://snydergd.solidcommunity.net/profile/card#me
// @match        https://*.solidcommunity.net/*
// @match        https://*.inrupt.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=solidcommunity.net
// @homepage     https://gist.github.com/snydergd/ed530bc8ea20861628b1cfea3e58590c
// @license      CC0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489401/Enable%20Dokieli%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/489401/Enable%20Dokieli%20Save.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElm(selector, selector2) {
        const baseSelector = selector2 ? selector : null;
        if (baseSelector) selector = selector2;

        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                mutations.forEach((mutation) => {
                    if (!mutation.addedNodes) return;

                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        // do things to your newly added nodes here
                        let node = mutation.addedNodes[i];
                        if (node.matches(selector) || node.querySelector(selector)) {
                            observer.disconnect();
                            resolve(document.querySelector(selector));
                        }
                    }
                });
            });

            // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
            observer.observe(baseSelector ? document.querySelector(baseSelector) : document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });
        });
    }

    const loaded = () => new Promise(resolve => {
        let resolved = false;
        window.addEventListener("load", () => {
            resolved = true;
            if (!resolved) setTimeout(0, resolve);
        });
        if (!resolved && (document.readyState === "complete" || document.readyState === "interactive")) {
            resolved = true;
            resolve();
        }
    });
    if ("DO" in window && "U" in window.DO) loaded().then(() => {
        console.log("loaded");
        waitForElm("#document-menu", ".resource-save").then(x => {
            x.disabled = false;
        });
    });
})();