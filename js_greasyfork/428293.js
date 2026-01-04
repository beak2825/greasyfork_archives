// ==UserScript==
// @name         Inoreader Auto-Load Full Article
// @namespace    elddc
// @version      1.1
// @description  Automatically load full content when opening an article in Inoreader
// @author       Elddc
// @match        https://www.inoreader.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428293/Inoreader%20Auto-Load%20Full%20Article.user.js
// @updateURL https://update.greasyfork.org/scripts/428293/Inoreader%20Auto-Load%20Full%20Article.meta.js
// ==/UserScript==

//----- configure (change as desired) -----
const excludedSources = ['The Associated Press']; //subscriptions to exclude from auto-load
const waitTime = 200; //time in ms to wait for page load (1 sec: 1000ms)
//-----------------------------------------

loadFullArticle();
window.onpopstate = loadFullArticle;

function loadFullArticle() {
    if (window.location.pathname.includes('article/')) {
        setTimeout(() => {
            try {
                const source = document.querySelector('.article_subtitle_author_wrapper');
                const button = document.querySelector('.icon-article_topbar_mobilize_empty');
                if (!excludedSources.includes(source.innerHTML.trim())) {
                    button.click();
                }
            } catch (err) {
                console.log('page has not loaded');
            }
        }, waitTime);
    }
}