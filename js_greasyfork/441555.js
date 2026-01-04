// ==UserScript==
// @name         知乎显示性别
// @namespace    https://skygate2012.github.io
// @version      0.4
// @description  为男女对立火上浇油[滑稽]
// @author       skygate2012
// @license      GPL-3.0-only
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441555/%E7%9F%A5%E4%B9%8E%E6%98%BE%E7%A4%BA%E6%80%A7%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/441555/%E7%9F%A5%E4%B9%8E%E6%98%BE%E7%A4%BA%E6%80%A7%E5%88%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
[data-gender]::after {
    color: #8590a6;
    margin-left: 0.3em;
}
[data-gender="0"]::after {
    content: "母";
}
[data-gender="1"]::after {
    content: "公";
}
`;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    async function UserLink_display_user_gender(element) {
        console.log(element)
        if (
            element.firstChild.nodeType !== Node.TEXT_NODE ||
            'gender' in element.dataset
        ) {
            return
        }
        const user_url = element.href;
        const username = user_url.substring(user_url.lastIndexOf('/') + 1);
        let user_gender;
        if (typeof user_gender_cache.get(username) === "undefined") {
            user_gender_cache.set(username, null);
            try {
                //console.log("Fetching user info for", username);
                const page_src = await (await fetch(user_url)).text();
                user_gender = parseInt((page_src.match(/"gender":.*?(\d+)/) || [])[1], 10);
                //console.log(user_gender);
                user_gender_cache.set(username, user_gender);
            } catch {
                //console.log("Failed to fetch user info for", username);
            }
        } else {
            while (user_gender_cache.get(username) === null) {
                await new Promise(r => setTimeout(r, 10));
            }
            user_gender = user_gender_cache.get(username);
        }
        element.dataset.gender = user_gender;
    }

    function Comment_UserLink_observer(mutationList) {
        mutationList.forEach(function(mutation) {
            mutation.target.querySelectorAll('a[href*="www.zhihu.com/people"]').forEach(UserLink_display_user_gender);
        });
    }

    class LRU {
        constructor(max) {
            this.max = max;
            this.cache = new Map();
        }

        get(key) {
            let item = this.cache.get(key);
            if (item) {
                // refresh key
                this.cache.delete(key);
                this.cache.set(key, item);
            }
            return item;
        }

        set(key, val) {
            // refresh key
            if (this.cache.has(key)) this.cache.delete(key);
            // evict oldest
            else if (this.cache.size == this.max) this.cache.delete(this.first());
            this.cache.set(key, val);
        }

        first() {
            return this.cache.keys().next().value;
        }
    }

    const user_gender_cache = new LRU(1000);
    const observer = new MutationObserver(Comment_UserLink_observer);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();