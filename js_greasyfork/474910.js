// ==UserScript==
// @name         Reddit Collapse Automod 🛡️
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  automatically collapses Automod comments (only old.reddit.com)
// @author       Agreasyforkuser
// @match        https://*.reddit.com/r/*/comments/*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474910/Reddit%20Collapse%20Automod%20%F0%9F%9B%A1%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/474910/Reddit%20Collapse%20Automod%20%F0%9F%9B%A1%EF%B8%8F.meta.js
// ==/UserScript==


(function() {
    const undesirableModList = ['AutoModerator', 'example_name'];
    let filterAllStickyComments = true; // set to false to only filter out usernames added to the undesirableModList

    let comments = document.querySelectorAll('.comment');

    for (const comment of comments) {
        const author = comment.dataset.author;
        const isStickied = comment.classList.contains('stickied');

        if (filterAllStickyComments && isStickied) {
            comment.classList.add('collapsed');
            comment.classList.remove('noncollapsed');
        } else if (undesirableModList.includes(author)) {
            comment.classList.add('collapsed');
            comment.classList.remove('noncollapsed');
        }
    }
})();


// (function(){
//     const undesirableModList = ['AutoModerator', 'example_bot_name'];
//     let filterAllStickyComments = true; //set to false to only filter out usernames added to the undesirableModList
//     let stickiedComments = document.querySelectorAll('.stickied.noncollapsed.comment');
//     for (const sc of stickiedComments) {
//         if (filterAllStickyComments) {
//             sc.classList.add('collapsed'), sc.classList.remove('noncollapsed');
//         } else {
//             if (undesirableModList.includes(sc.dataset.author)) {
//                 sc.classList.add('collapsed'), sc.classList.remove('noncollapsed');
//             }
//         }
//     }
// })()