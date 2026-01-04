// ==UserScript==
// @name     Youtube Homepage Filter
// @description Puts a custom block over youtube videos that match particular phrases.
// @version  1.4
// @grant    none
// @namespace aeoniumsalad
// @license  GNU GPLv3
// @match https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/491770/Youtube%20Homepage%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/491770/Youtube%20Homepage%20Filter.meta.js
// ==/UserScript==

// these are the phrases to look for: seperate with commas and surround each with apostrophes. make sure your phrases are also lowercase when adding new ones, it will match regardless of case.
const searchPhrases = [
  { phrase: 'mix -', context: 'auto-generated mix' },
  { phrase: 'my mix', context: 'auto-generated mix' },
  { phrase: 'put phrase here', context: 'block reason' }
];

function searchAndModifyContent(phrases) {
    const elements = document.querySelectorAll('ytd-rich-item-renderer');

    elements.forEach(element => {
        const videoTitleLink = element.querySelector('a#video-title-link');
        if (videoTitleLink) {
            const videoTitle = videoTitleLink.title.toLowerCase();
            const videoHref = videoTitleLink.href.toLowerCase();

            phrases.forEach(item => {
                if (videoTitle.includes(item.phrase) || videoHref.includes(item.phrase)) {
                    element.innerHTML = `<div class="videoReplacement">
                                         <h3>Video gone.</h3>
                                         <p><span style="opacity: 0.8">Video is blocked for this reason:</span> <b>${item.context}</b></p>
                                         <hr>
                                         <details><summary>more info</summary>
                                         <span style="font-size: 0.9em"><b>title: </b>${videoTitle}</span><br>
                                         <span style="font-size: 0.9em"><b>link: </b><a href="${videoHref}">${videoHref}</a></span>
                                         </details>
                                         </div>
                                         `;
                }
            });
        }
    });
}

// runs script on element load
const observer = new MutationObserver(mutationsList => {
    mutationsList.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Check if added nodes match the target class and run the function
            mutation.addedNodes.forEach(node => {
                if (node.classList && node.classList.contains('ytd-rich-item-renderer')) {
                    searchAndModifyContent(searchPhrases);
                }
            });
        }
    });
});

// watches for element changes ?
observer.observe(document.body, { childList: true, subtree: true });