// ==UserScript==
// @name         Nature插入高清图片、图表
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display inline high-res images and tables, ensure left alignment in Nature articles
// @author       Lily
// @match        https://www.nature.com/articles/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523813/Nature%E6%8F%92%E5%85%A5%E9%AB%98%E6%B8%85%E5%9B%BE%E7%89%87%E3%80%81%E5%9B%BE%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/523813/Nature%E6%8F%92%E5%85%A5%E9%AB%98%E6%B8%85%E5%9B%BE%E7%89%87%E3%80%81%E5%9B%BE%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace thumbnail with high-res image
    // Function to insert images after <h3> tag
    function insertImagesAfterH3() {
        // Select the <h3> tag with class c-article-supplementary__title u-h3
        const h3Tags = document.querySelectorAll('h3.c-article-supplementary__title.u-h3');

        h3Tags.forEach(h3Tag => {
            // Find the corresponding <a> tag inside the <h3> for image insertion
            const link = h3Tag.querySelector('a[data-supp-info-image]');

            if (link) {
                // Extract the thumbnail image URL from data-supp-info-image attribute
                const thumbUrl = link.getAttribute('data-supp-info-image');
                if (thumbUrl) {
                    // Convert the thumbnail URL to high-res by replacing part of the URL
                    const highResUrl = thumbUrl.replace(/media\.springernature\.com\/.*?\/springer-static/, 'media.springernature.com/full/springer-static');

                    // Create an <img> element for the high-res image
                    const img = document.createElement('img');
                    img.src = highResUrl;
                    img.style.maxWidth = '100%';
                    img.style.marginTop = '10px';  // Add margin for better spacing

                    // Insert the image after the <h3> tag
                    h3Tag.insertAdjacentElement('afterend', img);
                }
            }
        });
    }


    // Function to fetch and display table content
    async function insertTables() {
        // Select all <a> tags with data-test="table-link"
        const tableLinks = document.querySelectorAll('a[data-test="table-link"]');

        tableLinks.forEach(async (link) => {
            const tableUrl = link.href;
            if (tableUrl) {
                try {
                    // Fetch the table page content
                    const response = await fetch(tableUrl);
                    const text = await response.text();

                    // Create a temporary element to parse the HTML
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'text/html');

                    // Extract the table content from <div class="c-article-table-container">
                    const tableContainer = doc.querySelector('div.c-article-table-container');
                    const tableImage = doc.querySelector('div.c-article-table-image img');

                    //if (tableContainer) {
                        // Insert the table content after the link
                      //  link.parentNode.insertBefore(tableContainer, link.nextSibling);
                    //}

                    if (tableImage) {
                        // Replace the table image URL with high-res image
                        const tableImageUrl = tableImage.src.replace(/media\.springernature\.com\/.*?\/springer-static/, 'media.springernature.com/full/springer-static');

                        // Create and insert high-res image
                        const highResImg = document.createElement('img');
                        highResImg.src = tableImageUrl;
                        highResImg.style.maxWidth = '100%';
                        highResImg.style.margin = '10px 0';
                        highResImg.style.display = 'block';  // Block-level for left alignment
                        highResImg.style.textAlign = 'left';  // Left-align the image

                        link.parentNode.insertBefore(highResImg, link.nextSibling);
                    } else if (tableContainer){
                        //Insert the table content after the link
                        // Apply left alignment to the table container
                        tableContainer.style.margin = '10px 0';  // Add some margin
                        tableContainer.style.textAlign = 'left';  // Left align the table content
                        tableContainer.style.width = '100%';  // Ensure it takes full width
                        link.parentNode.insertBefore(tableContainer, link.nextSibling);
                    }

                } catch (error) {
                    console.error('Failed to fetch table content:', error);
                }
            }
        });
    }

    // Function to replace inline article images with high-res versions
    function replaceInlineImages() {
        // Select all <a> tags with data-test="img-link" and find <source> tags under <picture>
        const sourceTags = document.querySelectorAll('a[data-test="img-link"] picture source');

        sourceTags.forEach(source => {
            const srcset = source.getAttribute('srcset');
            if (srcset) {
                // Replace "media.springernature.com/*/springer-static" with "full" in the srcset URL
                const highResUrl = srcset.replace(/media\.springernature\.com\/.*?\/springer-static/, 'media.springernature.com/full/springer-static');
                source.setAttribute('srcset', highResUrl);
            }
        });
    }

    // Run all functions to insert high-res images, tables, and inline images
    insertImagesAfterH3();
    insertTables();
    replaceInlineImages();

})();
