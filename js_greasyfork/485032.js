// ==UserScript==
// @name         Instagram: Arrow Keys for Multi-Image Posts
// @description  Makes right/left keys navigate next/previous images in multi-image posts, as well as to adjacent posts. Holding shift, right/left jumps directly between posts. Esc key closes posts.
// @match        https://www.instagram.com/*
// @version      0.7
// @author       mica
// @namespace    greasyfork.org/users/12559
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485032/Instagram%3A%20Arrow%20Keys%20for%20Multi-Image%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/485032/Instagram%3A%20Arrow%20Keys%20for%20Multi-Image%20Posts.meta.js
// ==/UserScript==


const nextImg = () => document.querySelector('article button[aria-label="Next"]');
const prevImg = () => document.querySelector('article button[aria-label="Go back"]');
const nextPgImg = () => document.querySelector('div[role="button"] button[aria-label="Next"]');
const prevPgImg = () => document.querySelector('div[role="button"] button[aria-label="Go back"]');
const nextPost = () => document.querySelector('svg[aria-label="Next"]');
const prevPost = () => document.querySelector('svg[aria-label="Go back"]');
const closePost = () => document.querySelector('svg[aria-label="Close"]');
const openFirst = () => document.querySelector('[role="tablist"]');

document.addEventListener('keydown', event => {
    if (!location.pathname.match(/^\/$|^\/reels\/|^\/direct\/|^\/accounts\/|^\/your_activity\/|^\/.*\/saved\//g)) {
        event.stopPropagation();
        switch (true) {
            case (event.shiftKey && event.key == 'ArrowRight'):
                nextPost().parentElement.click();
                break;
            case (event.key == 'ArrowRight'):
                if (nextImg()) {
                    nextImg().click();
                } else if (nextPost()) {
                    nextPost().parentElement.click();
                } else if (openFirst()) {
                    openFirst().parentNode.nextSibling.querySelector('a').click();
                } else {
                    nextPgImg().click();
                }
                break;
            case (event.shiftKey && event.key == 'ArrowLeft'):
                prevPost().parentElement.click();
                break;
            case (event.key == 'ArrowLeft'):
                if (prevImg()) {
                    prevImg().click();
                } else if (prevPost()) {
                    prevPost().parentElement.click();
                } else {
                    prevPgImg().click();
                }
                break;
            case (event.key == 'Escape'):
                closePost().parentElement.click();
                break;
        }
    }
});
