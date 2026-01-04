// ==UserScript==
// @name         Hide TikTok, People and Promotion Articles on Watson
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Hides articles containing TikTok, People or promotion on Watson.ch
// @author       ministriate
// @match        https://www.watson.ch/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461918/Hide%20TikTok%2C%20People%20and%20Promotion%20Articles%20on%20Watson.user.js
// @updateURL https://update.greasyfork.org/scripts/461918/Hide%20TikTok%2C%20People%20and%20Promotion%20Articles%20on%20Watson.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const keywords = ['tiktok', 'people', 'promotion', 'fifa'];

    const articles = document.querySelectorAll('div.text, div.teaser, div.storylink.combo_bd');

    for (let article of articles) {
        let text = article.innerText.toLowerCase();
        const links = article.querySelectorAll('a');

        for (let link of links) {
            const href = link.href.toLowerCase();

            if (keywords.some(keyword => href.includes(keyword))) {
                article.style.display = 'none';
                break;
            }
        }

        if (!article.style.display && keywords.some(keyword => text.includes(keyword))) {
            article.style.display = 'none';
        }
    }
})();