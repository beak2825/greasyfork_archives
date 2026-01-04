// ==UserScript==
// @name Pikabu hide post with negative rating
// @namespace http://tampermonkey.net/
// @version 0.1
// @description Hide negative posts
// @author ABD
// @match https://pikabu.ru/
// @license MIT
// @icon
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/471577/Pikabu%20hide%20post%20with%20negative%20rating.user.js
// @updateURL https://update.greasyfork.org/scripts/471577/Pikabu%20hide%20post%20with%20negative%20rating.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getUrl(body) {
        let header = body.querySelectorAll('.story__title-link')[0];
        if (header) {
            return header.href;
        }
    }

    function hide() {
        let stories = document.getElementsByClassName('story');
        for (let story of stories) {
            let rating = story.attributes["data-rating"]?.value;
            let body = story.querySelector('.story__main');

            if (story.style.display !== "none") {
                if (Number(rating) < 0) {
                    console.log('hidden negative rating', getUrl(body));
                    story.style.display = "none";
                }
                if (body && ((body.innerText.includes('://vk.com') & !body.innerText.includes('://vk.com/album')) || body.innerText.includes('://t.me'))) {
                    console.log('hidden shitpost', getUrl(body));
                    story.style.display = "none";
                }
            }
        };
    }

    let dropdowns = document.getElementsByClassName('quick-ignore');

    document.getElementsByClassName('stories-feed__container')

    [0].addEventListener('DOMNodeInserted', hide);
})();
