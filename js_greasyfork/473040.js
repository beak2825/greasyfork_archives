// ==UserScript==
// @name         Odjebite trolovi
// @license      MIT
// @namespace    https://forum.hr*
// @version      01
// @run-at       document-idle
// @description  mice sve postove, ukljucujuci i kvotove
// @author       fs
// @match        https://www.forum.hr/*
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/473040/Odjebite%20trolovi.user.js
// @updateURL https://update.greasyfork.org/scripts/473040/Odjebite%20trolovi.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const postsContainer = document.getElementById('posts');
    const postDivs = postsContainer.querySelectorAll('div');

    const keywords = ['ZoomZoom'];

    postDivs.forEach(postDiv => {
        const postText = postDiv.textContent;

        // Check if any of the keywords are present in the post text
        const keywordFound = keywords.some(keyword => postText.includes(keyword));

        if (keywordFound) {
            postDiv.remove();
        }
    });
})();