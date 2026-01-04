// ==UserScript==
// @name          Twitter - Remove Promoted Tweets
// @description   Remove promoted tweets from Twitter
// @author        Nick Stakenburg
// @namespace     https://gist.githubusercontent.com/staaky
// @license       MIT; https://opensource.org/licenses/MIT
// @include       http://twitter.com/*
// @include       https://twitter.com/*
// @include       http://*.twitter.com/*
// @include       https://*.twitter.com/*
// @icon          data:image/png;base64,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
// @grant         GM_addStyle
// @version       1.1.1
// @downloadURL https://update.greasyfork.org/scripts/376287/Twitter%20-%20Remove%20Promoted%20Tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/376287/Twitter%20-%20Remove%20Promoted%20Tweets.meta.js
// ==/UserScript==

(() => {
    // remove all tweets that contain an svg path that matches the promoted tweet icon
    // this avoids language based checks
    const pathDs = [
        'M20.75 2H3.25A2.25 2.25 0 0 0 1 4.25v15.5A2.25 2.25 0 0 0 3.25 22h17.5A2.25 2.25 0 0 0 23 19.75V4.25A2.25 2.25 0 0 0 20.75 2zM17.5 13.504a.875.875 0 1 1-1.75-.001V9.967l-7.547 7.546a.875.875 0 0 1-1.238-1.238l7.547-7.547h-3.54a.876.876 0 0 1 .001-1.751h5.65c.483 0 .875.39.875.874v5.65z'
    ];

    // selectors pointing to ad containers
    const newTwitterAdContainerSelector = [
        'article',
        'div[data-focusable="true"]'
    ].map(s => `${s}:not([adschecked])`).join(', ');

    const legacyTwitterAdContainerSelector = [
        'li[data-item-type="tweet"]',
        'li.promoted-trend'
    ].map(s => `${s}:not([adschecked])`).join(', ');

    let checkLegacyTwitter = true;

    function remove(element) {
        // for debugging (blank out instead of remove)
        //element.setAttribute('style', 'opacity: 0');
        element.remove();
    }

    function findElementToRemove(container, iconSelector) {
        let removeElement = null;

        // if the element contains an promoted icon
        if (container.querySelectorAll(iconSelector).length > 0) {
            // return the element iself
            let parent = container.parentNode,
                height = container.getBoundingClientRect().height;

            removeElement = container;

            // or the parent as long as it is the same height as the element (accounting for a border)
            while (parent && (parent.getBoundingClientRect().height <= height + 1)) {
                removeElement = parent;
                parent = parent.parentNode;
            }
        }

        return removeElement;
    }

    function removeAdTweets() {
        // new twitter
        let adContainers = document.querySelectorAll(newTwitterAdContainerSelector);

        for (let container of adContainers) {
            container.setAttribute('adschecked', 'adschecked');

            for (let d of pathDs) {
                let removeElement = findElementToRemove(container, `svg path[d='${d}']`);

                if (removeElement) {
                    remove(removeElement);
                    checkLegacyTwitter = false;

                    break;
                }
            }
        }

        // legacy twitter
        if (checkLegacyTwitter) {
            adContainers = document.querySelectorAll(legacyTwitterAdContainerSelector);

            for (let container of adContainers) {
                container.setAttribute('adschecked', 'adschecked');

                let removeElement = findElementToRemove(container, '.Icon--promoted');

                if (removeElement) {
                    remove(removeElement);
                }
            }
        }
    }

    let mutationObserver = new MutationObserver(removeAdTweets);

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    removeAdTweets();

    if (checkLegacyTwitter) {
        GM_addStyle('.Footer .flex-module.Footer-adsModule { display: none !important; }');
    }
})();