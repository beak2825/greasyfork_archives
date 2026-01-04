// ==UserScript==
// @name         Iwara: Theater Mode, Video Description & Comment Toggles
// @namespace    https://www.iwara.tv/
// @version      2.1
// @description  Big video player for Iwara. Fills the screen. Adds button toggles for video descriptions and comments. Removes Liked By Users, Footer, and Announcement. Moves More From User/More Like This to bottom of page.
// @author       sonikkuso
// @match        *://iwara.tv/*
// @match        *://www.iwara.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543912/Iwara%3A%20Theater%20Mode%2C%20Video%20Description%20%20Comment%20Toggles.user.js
// @updateURL https://update.greasyfork.org/scripts/543912/Iwara%3A%20Theater%20Mode%2C%20Video%20Description%20%20Comment%20Toggles.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addToggleButton() {
        const container = document.querySelector('.page-video .page-video__details');
        if (!container || container.dataset.toggleReady === 'true') return;

        container.dataset.toggleReady = 'true';

        const titleBlock = container.querySelector('.text');
        if (!titleBlock) return;

        // Hide all other elements except the title
        [...container.children].forEach(child => {
            if (child !== titleBlock) {
                child.style.display = 'none';
            }
        });

        // Create the toggle button
        const button = document.createElement('button');
        button.textContent = 'Show Description';
        button.style.marginLeft = '15px';
        button.style.cursor = 'pointer';
        button.setAttribute("class", "button likeButton button--primary button--solid");
        button.style.cssText += "vertical-align: middle; position: relative; bottom: 1px"


        let isVisible = false;

        button.addEventListener('click', () => {
            isVisible = !isVisible;
            button.textContent = isVisible ? 'Hide Description' : 'Show Description';

            [...container.children].forEach(child => {
                if (child !== titleBlock) {
                    child.style.display = isVisible ? '' : 'none';
                }
            });
        });

        titleBlock.appendChild(button);
    }

    // Initial run
    addToggleButton();

    // Observe for dynamic navigation
    const observer = new MutationObserver(addToggleButton);
    observer.observe(document.body, { childList: true, subtree: true });


    function addToggleButton2() {
        const comments = document.querySelector('.comments');
        if (!comments || comments.dataset.toggleReady === 'true') return;

        comments.dataset.toggleReady = 'true';

        // Elements to toggle
        const targets = [];

        const row = comments.querySelector('.row');
        if (row) targets.push(row);

        const text4 = comments.querySelector('.text');
        if (text4) targets.push(text4);

        const form = comments.querySelector('form');
        if (form) targets.push(form);

        const pagination = comments.querySelector('.pagination');
        if (pagination) targets.push(pagination);

        // Hide all targets by default
        targets.forEach(el => el.style.display = 'none');

        let visible = false;

        const button = document.createElement('button');
        button.textContent = 'Show Comments';
        button.style.marginBottom = '10px';
        button.style.cursor = 'pointer';
        button.setAttribute("class", "button likeButton button--primary button--solid");

        button.addEventListener('click', () => {
            visible = !visible;
            button.textContent = visible ? 'Hide Comments' : 'Show Comments';
            targets.forEach(el => {
                el.style.display = visible ? '' : 'none';
            });
        });

        // Insert button at the top of .comments
        comments.insertBefore(button, comments.firstChild);
    }

    // Run on load
    addToggleButton2();

    // Observe DOM changes for SPA navigation
    const observer2 = new MutationObserver(addToggleButton2);
    observer2.observe(document.body, { childList: true, subtree: true });


    function appendStylesheet(cssText) {
        const style = document.createElement('style');
        style.textContent = cssText;
        document.head.appendChild(style);
    }

    appendStylesheet(`
/* remove font weight */
.text--bold {
  font-weight: unset
}

/* widen homepage */
.page-home .container-fluid {
    max-width: 80%
}

/* removed footer and permanent news announcement */
.footer, div.row.justify-content-center {
    display:none
}

/* watch page .page-video */
.page-video .container-fluid {
    max-width: 97%;
    display: unset
}

/* remove padding under search bar */
.page-video .content {
    padding-top: 64px !important;
}

/* liked by, more from user, get pushed to end (removes flex-boxes) */
.container-fluid {
    display: unset
}

/* big video player */
@media (min-width: 768px) {
  .page-video .col-md-9 {
    flex: unset;
    max-width: 100%;
  }
}

/* liked by more from user, make as wide as video player (redundant as it is hidden) */
@media (min-width: 768px) {
  .page-video .col-md-3 {
    flex: unset;
    max-width: 100%;
  }
}

@media (min-width: 768px) {
  .page-video .col-md-6 {
    flex: unset;
    max-width: 6%;
    width: 76%;
  }
}

/* more from user , more like this smaller thumbs */
@media (min-width: 300px) and (min-width: 768px) {
  .page-video .moreFromUser__item,.page-video .moreLikeThis__item {
    width: calc(15% - 3.75px);
  }
}

/* remove liked by user */
.page-video__sidebar > div:first-child {
    display: none
}
/* remove Comments header label */
.comments.mt-4.mb-4 > div:first-of-type{
    display: none
}
`);

})();
