// ==UserScript==
// @name         Mute Freevee Ads
// @namespace    mute-freevee-ads
// @version      0.3
// @license      Doesn't matter
// @description  Mutes ads on Freevee
// @match        https://www.amazon.com/*
// @downloadURL https://update.greasyfork.org/scripts/461997/Mute%20Freevee%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/461997/Mute%20Freevee%20Ads.meta.js
// ==/UserScript==

(() => {
    const observer = new MutationObserver(function(mutations_list) {
        const checkNodes = (nodes, value) => {
            nodes.forEach((node) => {
                console.log('checking node', value, node)
                if(node.classList.contains('atvwebplayersdk-ad-timer')){
                    document.querySelectorAll('video').forEach((video) => {
                        video.muted = value
                    })
                }
            })
        }

        mutations_list.forEach((mutation) => {
            checkNodes(mutation.addedNodes, true)
            checkNodes(mutation.removedNodes, false)
        })
    })

    observer.observe(document, { subtree: true, childList: true });
})()