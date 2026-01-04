// ==UserScript==
// @name         FB_HideFriendsCount
// @namespace    http://tampermonkey.net/
// @version      2024-07-05
// @author       Zoidy
// @license      MIT
// @description  Hides the count of friends in your Facebook user profile so you (and only you) can't see it to avoid the temptation of constantly checking.
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499506/FB_HideFriendsCount.user.js
// @updateURL https://update.greasyfork.org/scripts/499506/FB_HideFriendsCount.meta.js
// ==/UserScript==


(function() {
    function filterElements(elements){
        var filtered = [];
        var regex = /^[0-9]+ friends$/gi;
        for (var i = 0, len = elements.length; i < len; i++) {
            //console.log('New inserted element', elements[i].textContent);
            if (regex.test(elements[i].textContent)) filtered.push(elements[i]);
        }
        return filtered;
    }

    //code to detect newly inserted elements from https://greasyfork.org/en/scripts/493176-hide-posts-from-those-i-m-not-following-in-facebook
    function onElementInserted(containerSelector, elementSelector, callback) {
        var onMutationsObserved = function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length) {
                    [].map.call(mutation.addedNodes, function(el) {
                        if (!el || !el.querySelector) return;
                        var elements = filterElements(el.querySelectorAll(elementSelector));
                        elements.forEach((item) => callback(item));
                    });
                }
            });
        };

        var target = document.querySelector(containerSelector);
        var config = { childList: true, subtree: true };
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        var observer = new MutationObserver(onMutationsObserved);
        observer.observe(target, config);
    }

    onElementInserted('body', 'span, a', function(element) {
        element.style.display = 'none';
    });

    var elements = filterElements(document.body.querySelectorAll('span, a'));
    elements.forEach((item) => (item.style.display = 'none'));
})();