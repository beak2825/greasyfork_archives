// ==UserScript==
// @name        3d-load.net Preview fixer
// @namespace   Violentmonkey Scripts
// @match       https://3d-load.net/*
// @grant       GM_xmlhttpRequest
// @version     1.1
// @icon        https://3d-load.net/wp-content/uploads/2024/03/1016752-200.png
// @author      Schaken
// @license     MIT
// @description Change the link to a real link and replace images
// @downloadURL https://update.greasyfork.org/scripts/493795/3d-loadnet%20Preview%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/493795/3d-loadnet%20Preview%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Declare a global variable to store the link
    let globalLink = '';
    let OriginalImage = '';

    // Function to replace the main image with a new one
    function FindMainImage() {
        // Find the first <img> element within the <div> with the class 'the_content_wrapper'
        let mainImage = document.querySelector('.the_content_wrapper img');
        if (mainImage) {
            OriginalImage = mainImage.src;
        }
    }

    // Function to replace the main image with a new one
    function replaceMainImage(newImageSrc) {
        // Find the first <img> element within the <div> with the class 'the_content_wrapper'
        let mainImage = document.querySelector('.the_content_wrapper img');
        if (mainImage) {
            mainImage.srcset = '';
            mainImage.src = newImageSrc;
        }
    }

    // Function to extract the domain name from a URL
    function extractDomain(url) {
        let a = document.createElement('a');
        a.href = url;
        return a.hostname;
    }

    // Function to find the <h3> element that contains "Link:"
    function findLinkHeader() {
        let headers = document.getElementsByTagName('h3');
        for (let i = 0; i < headers.length; i++) {
            if (headers[i].textContent.includes('Link:')) {
                return headers[i];
            }
        }
        return null;
    }

    // Function to replace images with metadata image link
    function replaceImagesWithMetadataLink(metadataImageLink) {
        setTimeout(function() {
            let images = document.getElementsByTagName('img');
            for (let i = 0; i < images.length; i++) {
                if (images[i].src === 'https://i.imgur.com/UHBCLMK.png') {
                    images[i].src = metadataImageLink;
                }
            }
        }, 1000);
    }

    // Function to fetch and parse the site for a metadata image link
    function fetchAndParseSiteForMetadataImage(url) {
        if ((!url.includes('daz3d.com')) && (!OriginalImage.includes('i.postimg.cc'))) {
          GM_xmlhttpRequest({
              method: "GET",
              url: url,
              onload: function(response) {
                  if (response.status === 200) {
                      const parser = new DOMParser();
                      const doc = parser.parseFromString(response.responseText, 'text/html');
                      const metaTag = doc.querySelector('meta[property="og:image"]');
                      if (metaTag) {
                          const metadataImageLink = metaTag.getAttribute('content');
                          replaceMainImage(metadataImageLink);
                      }
                  }
              }
          });
        }
    }

    function addRefreshButton() {
        let descriptionHeader = Array.from(document.querySelectorAll('h3')).find(h3 => h3.textContent.includes('Description:'));
        let button = document.createElement('a');
        button.textContent = 'Get DAZ Image';
        button.style.margin = '10px';
        button.className = 'shortcode button blue large';
        // Insert the button after the image element
        descriptionHeader.parentNode.insertBefore(button, descriptionHeader);

        // Add event listener to the Refresh button
        button.addEventListener('click', function() {
            // Use the global variable that holds the link
            if (globalLink) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: globalLink,
                    onload: function(response) {
                        if (response.status === 200) {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            const mainImage = doc.getElementById('main-image');
                            if (mainImage) {
                                replaceMainImage(mainImage.src);
                            } else {
                                console.log('Image with ID "main-image" not found.');
                            }
                        }
                    }
                });
            } else {
                console.log('No link found.');
            }
        });
    }

    function addLinkButton() {
        let linkHeader = findLinkHeader();
        if (linkHeader) {
            let linkParagraph = linkHeader.nextElementSibling;
            if (linkParagraph) {
                let link = linkParagraph.querySelector('span').textContent;
                globalLink = link; // Update the global variable with the new link
                let domain = extractDomain(link);

                // Create a new button element
                let button = document.createElement('a');
                button.textContent = domain;
                button.className = 'shortcode button blue large';
                button.style.margin = '10px';
                button.href = link;
                button.target = '_blank';

                linkParagraph.innerHTML = '';
                linkParagraph.appendChild(button);
            }
        }
    }

    // Main script logic
    (function() {
        FindMainImage();
        addLinkButton();
        addRefreshButton();
        fetchAndParseSiteForMetadataImage(globalLink);
    })();
})();
