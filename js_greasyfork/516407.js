// ==UserScript==
// @name         Dolomitenstadt
// @namespace    http://tampermonkey.net/
// @version      2024-11-08
// @description  Umgehung der Premium restriction
// @match        https://www.dolomitenstadt.at/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516407/Dolomitenstadt.user.js
// @updateURL https://update.greasyfork.org/scripts/516407/Dolomitenstadt.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Wait for all content (DOM, CSS, JS, images, etc.) to be fully loaded
    window.onload = async () => {
        var premiumBlocker = document.querySelector('#premium_article_block');
        if(!premiumBlocker){
            return;
        }

        var id = document.querySelector("#article_data");
        if (!id) {
            console.error("Element with selector '#article_data' not found.");
            return;
        }

        var articleId = id.getAttribute("data-id");
        const url = `https://www.dolomitenstadt.at/wp-json/wp/v2/posts/${articleId}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            var articleContent = document.querySelector('.article__content');
            if (articleContent) {
                articleContent.innerHTML = json.content.rendered;
                document.querySelector('#premium_article_block').remove();
            } else {
                console.error("Element with selector '.article__content' not found.");
            }
        } catch (error) {
            console.error(error.message);
        }
    };
})();
