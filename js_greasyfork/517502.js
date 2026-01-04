// ==UserScript==
// @name        Reddit Expand Post
// @namespace   https://rant.li/boson
// @match       *://*.reddit.com/*
// @grant       none
// @version     1.7
// @author      Boson
// @description Expand posts on Reddit feeds and dynamically detect new posts to expand
// @license     GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/517502/Reddit%20Expand%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/517502/Reddit%20Expand%20Post.meta.js
// ==/UserScript==
(function () {
    'use strict';

    let expandingInProgress = false;

    function detectAndClickExpandos() {
        const expandos = document.querySelectorAll('.expando-button.collapsed');
        if (expandos.length === 0 || expandingInProgress) return;
        expandingInProgress = true;
        let delay = 0;
        const expandosArray = Array.from(expandos);
        const postsToExpand = expandosArray.slice(0, 10);

        if (postsToExpand.length > 0) {
            postsToExpand.forEach((expando, index) => {
                if (!expando.classList.contains('clicked')) {
                    setTimeout(() => {
                        expando.click();
                        expando.classList.add('clicked');
                    }, delay);
                    delay += 1000;
                }
            });
        }

        setTimeout(() => {
            expandingInProgress = false;
        }, delay);
    }

    function setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('expanded')) {
                    detectAndClickExpandos();
                    entry.target.classList.add('expanded');
                }
            });
        }, { threshold: 0.5 });

        const posts = document.querySelectorAll('.expando-button.collapsed');
        posts.forEach(post => observer.observe(post));
    }

    window.addEventListener('load', () => {
        detectAndClickExpandos();
        setupIntersectionObserver();
    });

    setInterval(() => {
        detectAndClickExpandos();
    }, 1000);
})();
