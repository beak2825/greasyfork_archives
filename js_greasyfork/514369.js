// ==UserScript==
// @name         Minimal Brave Search
// @namespace    http://tampermonkey.net/
// @version      2024-10-27
// @description  Darkens the logo progressively and removes specified elements on Brave Search
// @match        https://search.brave.com/*
// @grant        none
// @run-at       document-start
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514369/Minimal%20Brave%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/514369/Minimal%20Brave%20Search.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`

#codebox {display: none!important}
#llm-snippet {display: none!important}
#rh {display: none!important}
#search-elsewhere {display: none!important}
#submit-llm-button {display: none!important}

.nav-logo {
    opacity: 0;
    transition: opacity 1s ease-in-out; /* Transition length */
}
.gray-out {
    filter: grayscale(10%) contrast(1.02);
    transition: filter 1s ease-in-out; /* Transition effect for filter */
}
.inline-qa {
    border: none !important
}
.inline-qa-answer {
    padding: 0 !important;
    max-height: 85px!important;
}
.sidebar {
    display: none !important
}

[class^="thumbnail"]{
        display: none !important; /* Applies 170% width with !important */
}

@media (min-width: 768px) {
    [class^="snippet svelte"] {
        width: 150% !important; /* Applies 170% width with !important */
    }
}
    `);
    const hideImagesBasedOnPageUrl = () => {
      // Check if the current page URL starts with the specified string
      if (!window.location.href.startsWith('https://search.brave.com/images')) {
          // Get all the images on the page
          const images = document.querySelectorAll('img');

          // Hide all images
          images.forEach((img) => {
              if(img.width > 64 && img.height > 64) img.style.display = 'none';
          });
      }
    }

    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const idsToHide = ['llm-snippet', 'rh', 'search-elsewhere','codebox'];
    const classesToHide = ['infobox', 'sidebar', 'subutton-wrapper', 'snippet standalone', 'tabs','thumbnail'];
    const elementsToDarken = ['body','search-page']

    const hideElements = () => {
        idsToHide.forEach(selector => {
            const idElement = document.querySelectorAll('[id="' + selector + '"]');
            if (idElement && idElement.style) idElement.style.display = 'none'
        })
        classesToHide.forEach(selector => {
            const classElements = [...document.querySelectorAll('[class^="' + selector + '"]')].filter(e => e.tagName === 'DIV');
            classElements.forEach(classElement => {
                if (classElement && classElement.style) classElement.style.display = 'none';
            });
        })
    };

    const darkenElements = () => {
        elementsToDarken.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.classList.add('gray-out')
                }
            });
        });
    };

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const logo = document.querySelector('.nav-logo'); // Match class starting with nav-logo
                if (logo) {
                    logo.style.opacity = '0'; // Fade-in the logo
                }
                hideElements();
                hideImagesBasedOnPageUrl();
                if(theme == 'dark') darkenElements();
            }
        }
    });
    // Start observing the body for added nodes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(hideElements, 500)
    setTimeout(hideElements, 1500)
})();
