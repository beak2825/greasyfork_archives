// ==UserScript==
// @name            Betty Modern
// @namespace       mario0318.com
// @author          Raul Torres (Modern adaptation of Betty - Open directory search assistant)
// @version         0.7.0
// @license         GPLv3
// @description     Enhanced open directory finder for modern Google search
// @icon            https://raw.githubusercontent.com/sgeto/Betty/master/betty-space%20invader%20emoji.png
// @match           https://www.google.com/*
// @exclude         https://www.google.com/images/*
// @exclude         https://www.google.com/video/*
// @run-at          document-end
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/530326/Betty%20Modern.user.js
// @updateURL https://update.greasyfork.org/scripts/530326/Betty%20Modern.meta.js
// ==/UserScript==
/*
 * Original Betty script created by:
 * - Ali Abdulkadir (sgeto)
 * - Jorge Frisancho (teocci)
 * - jO9GEc
 *
 * Modern adaptation by mario0318
 *
 * This work is derived from:
 * https://github.com/sgeto/Betty (Original repository)
 * Licensed under GPL-3.0 - https://www.gnu.org/licenses/gpl-3.0.html
 */

(function() {
    'use strict';

    // Modern Google search form handling
    function enhanceSearchForm() {
        const searchBox = document.querySelector('textarea[name="q"], input[name="q"]');
        if (!searchBox) return;

        const form = searchBox.closest('form');
        if (!form) return;

        // Preserve original form submission
        const originalSubmit = form.submit.bind(form);
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            originalSubmit();
        });

        // Create radio buttons container
        const radioContainer = document.createElement('div');
        radioContainer.id = 'betty-radio-container';
        radioContainer.style.margin = '10px 0';
        radioContainer.style.display = 'flex';
        radioContainer.style.flexWrap = 'wrap';
        radioContainer.style.gap = '12px';

        // Radio button definitions
        const options = [
            { name: 'Web', value: '' },
            { name: 'Music', value: '+(mp3|wav|ac3|ogg|flac|wma|m4a) -inurl:(jsp|pl|php|html|aspx|htm|cf|shtml) intitle:index.of "last modified" -inurl:(listen77|mp3raid|mp3toss|mp3drug|index_of|wallywashis)' },
            { name: 'Video', value: '+(mkv|mp4|avi|mov|mpg|wmv) -inurl:(jsp|pl|php|html|aspx|htm|cf|shtml) intitle:index.of "last modified" -inurl:(listen77|mp3raid|mp3toss|mp3drug|index_of|wallywashis)' },
            { name: 'Files', value: 'intitle:"index of" -inurl:(jsp|pl|php|html|aspx|htm|cf|shtml) -inurl:(listen77|mp3raid|mp3toss|mp3drug|index_of|wallywashis)' },
            { name: 'Archives', value: '+(rar|zip|tar|tgz|7zip|iso|cso|gz|7z|bz2|gzip) intitle:"index of" -inurl:(jsp|pl|php|html|aspx|htm|cf|shtml) -inurl:(listen77|mp3raid|mp3toss|mp3drug|index_of|wallywashis)' },
            { name: 'Software', value: '+(exe|iso|tar|msi|rar|deb|zip|apk) -inurl:(jsp|pl|php|html|aspx|htm|cf|shtml) intitle:index.of "last modified" -inurl:(listen77|mp3raid|mp3toss|mp3drug|index_of|wallywashis)' },
            { name: 'Books', value: '+(mobi|cbz|cbr|cbc|chm|epub|fb2|lit|lrf|odt|pdf|prc|pdb|pml|rb|rtf|tcr|doc|docx) -inurl:(jsp|pl|php|html|aspx|htm|cf|shtml) intitle:index.of "last modified" -inurl:(listen77|mp3raid|mp3toss|mp3drug|index_of|wallywashis)' }
        ];

        // Create radio buttons
        options.forEach(opt => {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.gap = '4px';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'betty-search-type';
            radio.value = opt.value;
            radio.id = `betty-${opt.name.toLowerCase()}`;
            radio.style.margin = '0';

            if (opt.name === 'Web') radio.checked = true;

            radio.addEventListener('change', () => {
                searchBox.value = opt.value ? opt.value : '';
            });

            const label = document.createElement('label');
            label.htmlFor = radio.id;
            label.textContent = opt.name;
            label.style.color = '#70757a';
            label.style.fontSize = '14px';

            wrapper.appendChild(radio);
            wrapper.appendChild(label);
            radioContainer.appendChild(wrapper);
        });

        // Insert radio buttons after search box
        searchBox.parentElement.insertAdjacentElement('afterend', radioContainer);
    }

    // Enhanced cache link exposure
    function enhanceCacheLinks() {
        const results = document.querySelectorAll('div.g, div[data-snc]');

        results.forEach(result => {
            const menu = result.querySelector('div[role="button"][aria-label="More options"]');
            if (!menu) return;

            const cachedLink = Array.from(menu.parentElement.querySelectorAll('a')).find(a =>
                a.href.includes('webcache.googleusercontent.com')
            );

            if (cachedLink) {
                const clone = cachedLink.cloneNode(true);
                clone.textContent = 'Cached';
                clone.style.marginLeft = '12px';
                clone.style.fontSize = '14px';
                result.querySelector('a[href]:first-child').insertAdjacentElement('afterend', clone);
            }
        });
    }

    // Initialize
    function init() {
        if (window.location.href === 'https://www.google.com/' ||
            window.location.href.startsWith('https://www.google.com/search')) {
            enhanceSearchForm();
        }

        if (window.location.href.startsWith('https://www.google.com/search')) {
            const observer = new MutationObserver(mutations => {
                if (document.querySelector('div#betty-radio-container')) return;
                enhanceCacheLinks();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            enhanceCacheLinks();
        }
    }

    // Wait for DOM and initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();