// ==UserScript==
// @name breakingnewsenglish.com Enhancements
// @namespace https://breakingnewsenglish.com/
// @version 1.2.1
// @description Simple English news for language learners. Easy 
// @author You
// @match *://breakingnewsenglish.com/*
// @license MIT
// @icon https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/542421/breakingnewsenglishcom%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/542421/breakingnewsenglishcom%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CSS Styles ---
    // This section injects custom CSS to style paragraphs.
    const css = `
article>p,h2,ul>li>a,header>h3>a,.lesson-excerpt {
    font-family: 'Source Sans Pro';
    font-style: italic;
    font-size: 22px;
    color:#000;
}
.link-menu,
footer,
div#secondary,
div#ebook-ad-insert,
div#center,img,
div#warm-ups,
div#before-reading-listening,
div#after-reading-listening,
div#listening-fill-gaps,
div#listening-guess-the-answers,
div#gap-fill,
div#role-play,
div#comprehension-questions,
div#newspapers-survey,
div#newspapers-discussion,
div#spelling,
div#circle-the-correct-word,
div#language-cloze,
div#put-the-words-in-right-order,
div#insert-the-vowels,
div#put-the-text-back,
div#punctuate,
div#spaces,
div#free-writing,
div#academic-writing,
div#homework,
div#more,
div#answers,
div#support-this-site,
div#banvilles-book,
div#multiple-choice-quiz,
div#discussion-write-your-own{display:none;}
    `;
    GM_addStyle(css);

    // --- List Item to Link Conversion ---
    // This section converts text within list items into clickable links.
    // It assumes the text content of the list item is a valid URL.
    const listItems = document.querySelectorAll('li');

    listItems.forEach(item => {
        // Get the text content of the list item.
        const urlText = item.textContent;

        // Use a regular expression to clean up any invalid characters
        // (like HTML tags if they somehow get into textContent).
        const cleanUrl = urlText.replace(/<[^>]*>/g, '');

        // Create an anchor element.
        const link = document.createElement('a');
        link.href = cleanUrl; // Set the link's URL.
        link.textContent = cleanUrl; // Set the link's display text.

        // Clear the original list item's content and then add the new link.
        item.innerHTML = '';
        item.appendChild(link);
    });

})();