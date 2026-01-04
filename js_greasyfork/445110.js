// ==UserScript==
// @name         WebNovel genre filter
// @namespace    https://www.webnovel.com/
// @version      1.01
// @description  Genre filter for WebNovel.com!
// @author       idMysteries
// @match        https://www.webnovel.com/stories/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webnovel.com
// @license      Unlicense
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445110/WebNovel%20genre%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/445110/WebNovel%20genre%20filter.meta.js
// ==/UserScript==

const hidelist = ['# HAREM', '# ROMANCE', '# ECCHI'];

(function() {
    'use strict';

    var mutationObserver = new MutationObserver(function(mutations) {
        var novels = document.querySelectorAll('li.fl')
        for (var novel of novels) {
            var novellinks = novel.getElementsByTagName('a');
            for (var novellink of novellinks) {
                if (hidelist.includes(novellink.innerHTML)) {
                    novel.remove();
                    break;
                }
            }
        }
    });

    mutationObserver.observe(document.documentElement, {
        attributes: false,
        characterData: false,
        childList: true,
        subtree: true,
        attributeOldValue: false,
        characterDataOldValue: false
    });
})();