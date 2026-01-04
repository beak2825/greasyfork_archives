// ==UserScript==
// @name         RedGIFs Tag Filter
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Remove RedGIFs posts based on tags and injection nodes
// @author       Greasy_Gronch
// @match        https://www.redgifs.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528088/RedGIFs%20Tag%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/528088/RedGIFs%20Tag%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
	
	// replace the below strings with the list of tags you would like to filter. You can add as many as you would like but make sure they are in quotes and sepecraed with commas like below,
    const blockedTags = ["Matching Tags 1", "Matching Tags 2", "Matching Tags 3"];

    function removePosts() {
        document.querySelectorAll('.GifPreview').forEach(post => {
            const tagContainer = post.querySelector('.tagList');
            if (tagContainer) {
                const tags = Array.from(tagContainer.querySelectorAll('.tagButton .text')).map(el => el.innerText.trim());
                if (tags.some(tag => blockedTags.includes(tag))) {
                    post.remove();
                }
            }
        });
    }

    function removeInjectionNodes() {
        document.querySelectorAll('.injection').forEach(injection => {
            injection.remove();
        });
    }

    const observer = new MutationObserver(() => {
        removePosts();
        removeInjectionNodes();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    removePosts();
    removeInjectionNodes();
})();
