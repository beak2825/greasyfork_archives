// ==UserScript==
// @name         Skip Twitch clip content warning
// @namespace    https://gist.github.com/whtft
// @version      1.0
// @description  Skips Twitch clip content warning
// @author       whtft
// @license      MIT
// @match        https://clips.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/483641/Skip%20Twitch%20clip%20content%20warning.user.js
// @updateURL https://update.greasyfork.org/scripts/483641/Skip%20Twitch%20clip%20content%20warning.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const target = 'content-classification-gate-overlay-start-watching-button'
    /**
     *
     * @param {MutationRecord[]} mutations
     * @param {MutationObserver} obs
     * @returns {void}
     */
    function onMutation(mutations, obs) {
        const button = mutations
            .flatMap((mutation) => Array.from(mutation.addedNodes))
            .filter((node) => node.nodeType == Node.ELEMENT_NODE)
            .flatMap((node) => Array.from(node.querySelectorAll('button[data-a-target]')))
            .find((button) => button.getAttribute('data-a-target') == target)
        if (!button) return
        button.click()
        obs.disconnect()
    }
    const observer = new MutationObserver(onMutation)
    observer.observe(document.body, { subtree: true, childList: true })
})();