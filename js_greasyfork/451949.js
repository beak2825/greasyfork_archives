// ==UserScript==
// @name         Reddit auto-expand
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto-expand posts in new reddit
// @author       Blueshirt
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451949/Reddit%20auto-expand.user.js
// @updateURL https://update.greasyfork.org/scripts/451949/Reddit%20auto-expand.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var excluded_posts = [];
    var auto_expand = true;

    function onKeyup(evt) {
        // Use https://keycode.info/ to get keys
        // ` shortcut
        if (evt.keyCode == 192) {
            // expando();
            auto_expand = !auto_expand;
            if (auto_expand) {
                window.alert("Auto-expand enabled.");
            }
            else {
                window.alert("Auto-expand disabled.");
            }
        }
    }
    function mouseClicked(event) {
        const elem = event.target;
        if (elem.className.includes("icon-expand")) {
            // add the post to the excluded list
            const post_id = elem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id;
            if (!excluded_posts.includes(post_id)) {
                excluded_posts.push(post_id);
            }

        }
        if (elem.className.includes("icon-collapse")) {
            // add the post to the excluded list
            const post_id = elem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id;
            if (!excluded_posts.includes(post_id)) {
                excluded_posts.push(post_id);
            }
        }

    }
    function getPostId(iconElement) {
        let id = iconElement.id;
        while(iconElement !== undefined && (id === undefined || id === "")) {
            iconElement = iconElement.parentElement;
            id = iconElement.id;
        }
        return id;
    }
    function autoExpand() {
        if (auto_expand && !window.location.href.includes("/comments/")) {
            let icons = document.getElementsByClassName("icon-expand");
            for (const icon of icons) {
                const postId = getPostId(icon);
                if (!excluded_posts.includes(postId)) {
                    let button = icon.parentNode
                    button.click();
                }
            }
        }
    }


    if (!window.location.href.includes("/comments/")) {
        // listen to "`" to enable / disable auto_expand
        document.addEventListener('keyup', onKeyup, true);
        // listen to click to add to excluded list
        document.addEventListener("click", mouseClicked);
        // listen to page scroll to expand new content
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        var observer = new MutationObserver(function(mutations, observer) {
            autoExpand();
        });
        // TODO: probably tuning this can improve performances
        observer.observe(document, {
            subtree: true,
            attributes: true
        });
    }
})();