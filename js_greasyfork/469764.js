// ==UserScript==
// @name         Reddit Old Auto-Expand ↕️
// @version      2.0
// @description  Automatically expands posts on old.reddit.com
// @author       Agreasyforkuser
// @match        https://old.reddit.com/*
// @grant        GM_addStyle
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png
// @namespace    old.reddit.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469764/Reddit%20Old%20Auto-Expand%20%E2%86%95%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/469764/Reddit%20Old%20Auto-Expand%20%E2%86%95%EF%B8%8F.meta.js
// ==/UserScript==



(function() {
    'use strict';

    function expandImagePosts() {
        // Select all post elements on the page
        const posts = document.querySelectorAll('.thing');

        // Loop through each post element
        posts.forEach((post) => {
            // Check if the post is an image post with data-type="link"
            if (post.dataset.type === 'link') {
                const expandoButton = post.querySelector('.expando-button');

                // Check if the post has a thumbnail image and is not already expanded
                if (expandoButton && !expandoButton.classList.contains('expanded')) {
                    // Simulate a click event on the expando button to expand the post
                    expandoButton.click();
                }
            }
        });
    }


var customCSS = `

        /* Adjust the size of the thumbnail container */
        /* .thumbnail, .thumbnail img {height: 50px !important; width: 50px !important} */
        .thumbnail, .thumbnail img {display: none !important}
        .expando-button          {opacity:0 !important}
        .expando-button.selftext {opacity:0.1 !important}
        .arrow.up       {display:block !important}
        .arrow.down     {display:block !important}
        .link .arrow    {filter: none !important}

        .link .title   {margin-top:30px}
        .link .midcol  {background:none !important; position:relative !important}
              .midcol  {overflow:visible !important}
        .link .score   {color: gray !important}
        .link .tagline {margin-top:10px !important}
       
        `
GM_addStyle(customCSS);

    // Expand image posts initially
    expandImagePosts();
    // Repeat the expansion 
    setInterval(expandImagePosts, 3000);
})();
