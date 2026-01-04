// ==UserScript==
// @name         Kemono/Coomer Renamer and Image Modifier
// @namespace    http://tampermonkey.net/
// @version      2024-12-13
// @description  Simple file renamer with consistent image src modification, appending original filename
// @author       You
// @match        *://kemono.su/*
// @match        *://coomer.su/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503662/KemonoCoomer%20Renamer%20and%20Image%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/503662/KemonoCoomer%20Renamer%20and%20Image%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Your Original Script Starts Here ---
    
    setTimeout(() => {
        function sanitizeText(text) {
            return text.replace(/[\s\W]+/g, '');
        }

        function removeCSSRule() {
            const styleSheets = document.styleSheets;
            for (let i = 0; i < styleSheets.length; i++) {
                let styleSheet = styleSheets[i];
                try {
                    let rules = styleSheet.cssRules || styleSheet.rules;
                    if (!rules) continue;
                    for (let j = 0; j < rules.length; j++) {
                        let rule = rules[j];
                        if (rule.cssText.includes("a.fileThumb.image-link") && rule.cssText.includes("display: none !important")) {
                            styleSheet.deleteRule(j);
                            break;
                        }
                    }
                } catch (e) {
                    console.warn("Could not access stylesheet:", e);
                }
            }
        }

        removeCSSRule();

        const userNameElement = document.querySelector('.post__user-name');
        let artistName = userNameElement ? sanitizeText(userNameElement.textContent) : '';

        function getSanitizedTags() {
            const tagElements = document.querySelectorAll('#post-tags a');
            if (tagElements.length === 0) return '';
            let combinedTags = '';
            tagElements.forEach(tag => {
                combinedTags += sanitizeText(tag.textContent);
            });
            return combinedTags;
        }

        function getSanitizedTitle() {
            const titleElements = document.querySelectorAll('.post__title *');
            let combinedTitle = '';
            titleElements.forEach(element => {
                combinedTitle += sanitizeText(element.textContent);
            });
            return combinedTitle;
        }

        let combinedTags = getSanitizedTags();
        let combinedTitle = getSanitizedTitle();

        if (artistName && combinedTitle) {
            const links = document.querySelectorAll('a.fileThumb.image-link, a.post__attachment-link');
            links.forEach(link => {
            
                let downloadAttr = link.getAttribute('download');
                let modifiedFilename = combinedTags
                    ? `${artistName}_${combinedTitle}_${combinedTags}_${downloadAttr}`
                    : `${artistName}_${combinedTitle}_${downloadAttr}`;

                link.setAttribute('download', modifiedFilename);
                let hrefAttr = link.getAttribute('href');
                let modifiedHref = hrefAttr.replace(/(\?f=)[^&]+/, `$1${modifiedFilename}`);
                link.setAttribute('href', modifiedHref);
                link.removeAttribute('hidden');
                link.removeAttribute('style');
            });
        }
    }, 750); // Original delay
    

    // --- Your Original Script Ends Here ---

    // --- New Functionality for Detecting and Renaming New IMG Elements ---
    
    function sanitizeText(text) {
        return text.replace(/[\s\W]+/g, '');
    }

    function renameImageSrc(img) {
        if (img.src.includes('?f=')) {
            // Collect necessary data (artist name, title, tags)
            const userNameElement = document.querySelector('.post__user-name');
            let artistName = userNameElement ? sanitizeText(userNameElement.textContent) : 'unknown_artist';

            const titleElements = document.querySelectorAll('.post__title *');
            let combinedTitle = '';
            titleElements.forEach(element => {
                combinedTitle += sanitizeText(element.textContent);
            });

            const tagElements = document.querySelectorAll('#post-tags a');
            let combinedTags = '';
            tagElements.forEach(tag => {
                combinedTags += sanitizeText(tag.textContent);
            });

            // Extract the original filename from the src URL
            const originalFilenameMatch = img.src.match(/\?f=([^\.]+)\./); // Extracts the filename with extension
            let originalFilename = originalFilenameMatch ? originalFilenameMatch[1].replace(/\+/g, '_') : 'image';

            // Construct the new filename using the same format + original filename
            let newFilename = combinedTags 
                ? `${artistName}_${combinedTitle}_${combinedTags}_${originalFilename}` 
                : `${artistName}_${combinedTitle}_${originalFilename}`;

            // Update the src attribute with the new filename
            img.src = img.src.replace(/(\?f=)[^&]+/, `$1${newFilename}`);
        }
    }

    // Observe newly added nodes in the DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'IMG' && node.src.includes('?f=')) {
                    renameImageSrc(node);
                }
                if (node.querySelectorAll) {
                    const imgs = node.querySelectorAll('img');
                    imgs.forEach(img => {
                        if (img.src.includes('?f=')) {
                            renameImageSrc(img);
                        }
                    });
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
