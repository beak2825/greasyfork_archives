// ==UserScript==
// @name         Swap x.com copy link
// @namespace    https://github.com/gjing/xittershare
// @version      1.1
// @description  Replace `x` to `vxtwitter` when clicking 'Copy Link'
// @author       gjing
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @match        https://tweetdeck.twitter.com/*
// @match        https://x.com/*
// @icon         https://abs.twimg.com/favicons/twitter.2.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479782/Swap%20xcom%20copy%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/479782/Swap%20xcom%20copy%20link.meta.js
// ==/UserScript==

const replacement = 'vxtwitter';

(function() {
    'use strict';

    document.addEventListener("copy", (e) => {
        let selected = e.target.innerText;
        setTimeout(async()=>await replace_x(selected), 0);
    });

    function replace_x(selected) {
        if (selected.match(/^https+:\/\/((.+)\.)?(twitter|x)\.com\/(.+)\/status\/(\d+)(\?.+)?$/)) {
            let newUrl = selected.replace(/^https+:\/\/((.+)\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.com\/(.+)\/status\/(\d+)(\?.+)?$/, ['https://', replacement, '.com/$3/status/$4'].join(''));
            navigator.clipboard.writeText(newUrl);
            return;
        }
    }
})();
