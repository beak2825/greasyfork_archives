// ==UserScript==
// @name         Netflix - Disable Auto-Preview
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Completely disables mouseover trailers from auto-previewing while browsing
// @author       Kache
// @match        https://www.netflix.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372614/Netflix%20-%20Disable%20Auto-Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/372614/Netflix%20-%20Disable%20Auto-Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var config = {
        disableJawBoneBigPreview: false
    };

    var addGlobalStyle = function(css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.querySelector('head').appendChild(style);
    };

    addGlobalStyle(`
      .mainView .slider-item div.bob-card div.bob-video-merch-player-wrapper {
        display: none !important;
      }
    `);

    var observer = new MutationObserver(function(mutations) {
        for (var mutation of mutations) {
            for (var node of mutation.addedNodes) {
                if (node.nodeType === 1 && node.tagName === 'VIDEO') {
                    if (config.disableJawBoneBigPreview || !node.matches('.jawBoneContainer video')) {
                        node.muted = "true";
                        node.remove();
                    }
                } else if (node.className == 'bob-video-merch-player-wrapper') {
                    node.remove();
                }
            }
        }
    });
    observer.observe(document.querySelector('#appMountPoint'), { childList: true, subtree: true });
})();