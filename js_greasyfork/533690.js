// ==UserScript==
// @name         ChickenSmoothie Replace 'Top' with Global Post Number
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replace "Top" link text (#wrap href) with global post number in ChickenSmoothie threads
// @author       Jerry + ChatGPT
// @match        https://www.chickensmoothie.com/Forum/viewtopic.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533690/ChickenSmoothie%20Replace%20%27Top%27%20with%20Global%20Post%20Number.user.js
// @updateURL https://update.greasyfork.org/scripts/533690/ChickenSmoothie%20Replace%20%27Top%27%20with%20Global%20Post%20Number.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get offset from URL ?start= (0 if missing)
    const urlParams = new URLSearchParams(window.location.search);
    const offset = parseInt(urlParams.get('start')) || 0;

    // Get all post containers (.post), assumes first is OP
    const posts = document.querySelectorAll('div.post');

    if (posts.length === 0) return;

    // We'll keep track of how many replies processed (skip OP)
    let replyCount = 0;

    // For each post starting from 2nd (.post index 1)
    for (let i = 1; i < posts.length; i++) {
        const post = posts[i];

        // Find the <a href="#wrap" class="top" title="Top">Top</a> inside the post
        const topLink = post.querySelector('a.top[href="#wrap"][title="Top"]');

        if (topLink && topLink.textContent.trim() === 'Top') {
            replyCount++;
            const globalNum = offset + replyCount;
            topLink.textContent = `#${globalNum}`;
            topLink.title = `Post #${globalNum}`;
        }
    }
})();