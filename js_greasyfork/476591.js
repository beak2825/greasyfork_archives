// ==UserScript==
// @name         Removes OnlyFans annoyances
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Script to help de-clutter your Onlyfans feed.
// @author       Owen3H
// @match        https://onlyfans.com*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476591/Removes%20OnlyFans%20annoyances.user.js
// @updateURL https://update.greasyfork.org/scripts/476591/Removes%20OnlyFans%20annoyances.meta.js
// ==/UserScript==

const postsSelector = ".vue-recycle-scroller__item-view"
const postHeaderSelector = ".b-post__header m-w50"

function clearOfficialPosts() {
    var posts = document.querySelectorAll(postsSelector);
    console.log(posts);

    var postLen = posts.length;
    var counter = 0;

    for (var i = 0; i < postLen; i++) {
        var post = posts[i];
        if (post.innerText.toLowerCase().includes('@onlyfans')) {
            post.remove();
            counter++;
        }
    }

    console.log('OnlyFans Annoyances: Removed ' + counter + ' posts from the @Onlyfans account')
}

function removeRecommended() {
    var recommended = document.querySelector(".b-recommended");
    var p = null;

    if (recommended) {
        p = recommended.parentNode;
    }

    if (!p) {
        console.log('OnlyFans Annoyances: Error removing suggested creators, could not find element.');
        return false;
    }

    p.removeChild(recommended);
    console.log('OnlyFans Annoyances: Removed suggested creators!');
    return true;
}

function delay(ms) {
    setTimeout(function () {}, ms);
}

(function() {
    delay(1300);

    setInterval(clearOfficialPosts, 250);
    setInterval(removeRecommended, 600);
})();