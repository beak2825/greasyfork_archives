// ==UserScript==
// @name         Self-study quiz button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a quiz button to the sitemap menu (one click access)
// @author       Skymaiden
// @include     /^https://(www|preview).wanikani.com//
// @exclude     /^https://(www|preview).wanikani.com/(review|lesson)/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402035/Self-study%20quiz%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/402035/Self-study%20quiz%20button.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';

    const sitemapMenu = document.querySelector('.sitemap');

    const buttonContent = document.createElement('a');
    buttonContent.href = '#';
    buttonContent.innerText = 'Quiz';
    buttonContent.style.paddingLeft = '14px';
    buttonContent.style.marginLeft = '8px';
    buttonContent.addEventListener('click', function() {
        if (window.ss_quiz && window.ss_quiz.open) {
            window.ss_quiz.open();
        } else {
            console.warn('Please install the Self-Study Quiz script');
        }
    });

    const button = document.createElement('li');
    button.classList.add('sitemap__section', 'navigation-shortcut');
    button.append(buttonContent);

    sitemapMenu.prepend(button);
})();