// ==UserScript==
// @name         Unlock All Medium.com Blogs
// @description  Bypass all medium blogs paywall (external domain and subdomains too)
// @version      1.5
// @match        *://*.medium.com/*
// @match        *://medium.com/*
// @author       SH3LL
// @license      MIT
// @namespace    https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/525137/Unlock%20All%20Mediumcom%20Blogs.user.js
// @updateURL https://update.greasyfork.org/scripts/525137/Unlock%20All%20Mediumcom%20Blogs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funzione per controllare i tag con un ritardo
    function checkMediumTags() {
        const mediumTag = document.querySelector('meta[property="og:site_name"][content="Medium"]');

        if (mediumTag) {
            console.log("Medium.com TAG Found");

            const authorTag1 = document.querySelector('meta[name="author"]');
            const authorTag2 = document.querySelector('meta[property="article:author"]');
            if (authorTag1 || authorTag2) {
                const unlocked_page = "https://freedium-mirror.cfd/" + window.location.href;
                console.log("Redirection to: " + unlocked_page);
                window.location.href = unlocked_page;
            } else {
                console.log("Medium.com AUTHOR TAG Not Found. Not Redirected!");
            }
        } else {
            console.log("Medium.com BLOG TAG Not Found. Not Redirected!");
        }
    }

    // Esegui il controllo quando il DOM è completamente caricato
    window.addEventListener('load', () => {
        checkMediumTags();
        // Aggiungi un MutationObserver per monitorare modifiche al DOM
        const observer = new MutationObserver(checkMediumTags);
        observer.observe(document.head, { childList: true, subtree: true });
    });

    // Change the background color of medium.rest
    if (window.location.href.includes("medium.rest")) {
        document.body.style.backgroundImage = 'none';
        let main_body = document.querySelector('.ci.bh.ez.fa.fb.fc');
        if (main_body) {
            main_body.style.maxWidth = "10000px";
            main_body.style.margin = "0px";
        }
    }

    // Remove id="header" and specific divs from freedium-mirror.cfd
    if (window.location.href.includes("freedium-mirror.cfd")) {
        const headerElement = document.getElementById('header');
        if (headerElement) {
            headerElement.remove();
        }

        const fixedDivs = document.querySelectorAll('.fixed.bottom-4.left-4');
        fixedDivs.forEach(div => {
            div.remove();
        });
    }
})();