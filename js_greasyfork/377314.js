// ==UserScript==
// @name         Penny-Arcade Forums Clean Up @List
// @namespace    https://greasyfork.org/en/users/162009-delmain
// @author       delmain
// @version      0.1
// @description  Try to remove vulgar names from the @list
// @match        https://forums.penny-arcade.com/discussion/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377314/Penny-Arcade%20Forums%20Clean%20Up%20%40List.user.js
// @updateURL https://update.greasyfork.org/scripts/377314/Penny-Arcade%20Forums%20Clean%20Up%20%40List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        var banList = [
            "@spool32isaracistdouche"
        ];

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var callback = function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type == 'childList') {
                    if(mutation.addedNodes != null) {
                        mutation.addedNodes.forEach(function(n) {
                            if(n.tagName === "LI") {
                                if(n.dataset != null) {
                                    if(banList.includes(n.dataset.value)) {
                                        n.remove();
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
        var observer = new MutationObserver(callback);
        var divs = document.querySelectorAll('.atwho-view-ul');
        divs.forEach(function(d) {
            observer.observe(d, {
                attributes: true,
                childList: true,
                characterData: true
            });
        });
    });
})();