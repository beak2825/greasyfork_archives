// ==UserScript==
// @name         LinkedIn unsponsored
// @namespace    https://jacobbundgaard.dk
// @version      1.3
// @description  Block sponsored posts in the LinkedIn feed
// @match        https://www.linkedin.com/feed/*
// @grant        none
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/379003/LinkedIn%20unsponsored.user.js
// @updateURL https://update.greasyfork.org/scripts/379003/LinkedIn%20unsponsored.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Selectors
    const storySelector = '.feed-shared-update-v2';
    const descriptionSelector = '.feed-shared-actor__description, .feed-shared-actor__sub-description';

    // Search strings
    const searchStrings = {
        'da': ['Promoveret'],
        'en': ['Promoted'],
        'es': ['Promocionado'],
        'fr': ['Post sponsorisé']
    };
  
    const language = searchStrings.hasOwnProperty(document.documentElement.lang) ? document.documentElement.lang : 'en';

    function blockSponsoredPosts() {
        const stories = document.querySelectorAll(storySelector);
        for (const story of stories) {
            if (story.style.display == 'none') {
              continue;
            }

            const descriptions = story.querySelectorAll(descriptionSelector);
            for (const description of descriptions) {

                const descriptionContent = description.innerText.trim();
                if (searchStrings[language].find(searchString => searchString == descriptionContent)) {

                    console.debug('Blocked sponsored story', story);
                    story.style.display = 'none';
                }
            }
        }
    }

    const observer = new MutationObserver(blockSponsoredPosts);
    observer.observe(document.body, {
        'childList': true,
        'subtree': true
    });
  
    blockSponsoredPosts();
})();