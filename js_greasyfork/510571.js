// ==UserScript==
// @name         Google Scholar BibTeX Citation Copier
// @version      2.0
// @description  Enhances Google Scholar by adding "Copy BibTeX" options directly to the search results and citation popup. Modifies the "Cite" button to "Cite[Copy BibTeX]" in search results and adds "BibTeX[Copy]" in the citation popup for quick copying of BibTeX entries.
// @match        https://scholar.google.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM.setClipboard
// @connect      scholar.google.com
// @connect      scholar.googleusercontent.com
// @license MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/510571/Google%20Scholar%20BibTeX%20Citation%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/510571/Google%20Scholar%20BibTeX%20Citation%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add Copy BibTeX to Cite buttons
    function addCopyBibTeXToCiteButtons() {
        // Select all articles in the search results
        const articles = document.querySelectorAll('.gs_r.gs_or.gs_scl');

        articles.forEach(article => {
            // Avoid modifying the button multiple times
            if (article.dataset.copyBibtexModified === 'true') return;

            // Mark as processed
            article.dataset.copyBibtexModified = 'true';

            // Find the action buttons container
            const actionContainer = article.querySelector('.gs_ri .gs_fl');

            if (actionContainer) {
                // Find the "Cite" button
                const citeButton = actionContainer.querySelector('a[aria-controls="gs_cit"]');

                if (citeButton) {
                    // Create a new container for the "Cite[Copy BibTeX]" links
                    const citeCopyContainer = document.createElement('span');
                    citeCopyContainer.style.display = 'inline';

                    // Clone the original "Cite" button
                    const newCiteButton = citeButton.cloneNode(true);

                    // Update the text of the new "Cite" button
                    newCiteButton.textContent = 'Cite';

                    // Remove any margin from the "Cite" button
                    newCiteButton.style.marginRight = '0';
                    newCiteButton.style.paddingRight = '0';

                    // Create the "[Copy BibTeX]" link
                    const copyLink = document.createElement('a');
                    copyLink.href = '#';
                    copyLink.innerText = '[Copy BibTeX]';
                    copyLink.className = 'gs_or_cit_copy';
                    copyLink.style.marginLeft = '0';
                    copyLink.style.paddingLeft = '0';

                    // Add click event listener to copy BibTeX
                    copyLink.addEventListener('click', function(event) {
                        event.preventDefault();
                        copyBibTeX(article);
                    });

                    // Append the new "Cite" button and the "[Copy BibTeX]" link without any spaces
                    citeCopyContainer.appendChild(newCiteButton);
                    citeCopyContainer.appendChild(copyLink);

                    // Add margin to the container to create a gap after the brackets
                    citeCopyContainer.style.marginRight = '10px';

                    // Replace the original "Cite" button with the new container
                    citeButton.parentNode.replaceChild(citeCopyContainer, citeButton);
                }
            }
        });
    }

    // Function to copy BibTeX from the search results page
    function copyBibTeX(article) {
        // Get the article ID from the data-cid attribute
        const dataCid = article.getAttribute('data-cid');

        if (!dataCid) {
            alert('Could not find the article ID.');
            return;
        }

        // Fetch the citation popup to get the necessary parameters
        fetchCitationPopup(dataCid, function(citationPopupHtml) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(citationPopupHtml, 'text/html');
            // Find the BibTeX link
            const bibtexLink = doc.querySelector('#gs_citi a[href*="scholar.bib"]');

            if (bibtexLink) {
                const bibtexUrl = bibtexLink.href;

                // Fetch the BibTeX content
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: bibtexUrl,
                    headers: {
                        'Referer': location.href
                    },
                    onload: function(response) {
                        if (response.status === 200) {
                            const bibtexContent = response.responseText;
                            // Copy the BibTeX content to the clipboard
                            GM.setClipboard(bibtexContent);
                            alert('BibTeX content copied to clipboard!');
                        } else {
                            alert('Failed to fetch BibTeX content.');
                        }
                    },
                    onerror: function() {
                        alert('Error fetching BibTeX content.');
                    }
                });
            } else {
                alert('Could not find the BibTeX link.');
            }
        });
    }

    // Function to fetch the citation popup
    function fetchCitationPopup(dataCid, callback) {
        // Fetch the citation popup via AJAX
        GM.xmlHttpRequest({
            method: 'GET',
            url: `/scholar?q=info:${dataCid}:scholar.google.com/&output=cite&scirp=&hl=en`,
            headers: {
                'Referer': location.href
            },
            onload: function(response) {
                if (response.status === 200) {
                    callback(response.responseText);
                } else {
                    alert('Failed to fetch citation popup.');
                }
            },
            onerror: function() {
                alert('Error fetching citation popup.');
            }
        });
    }

    // Function to add "Copy" option in the citation popup
    function addCopyOptionInCitationPopup() {
        // Observe mutations to detect when the citation popup appears
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.id === 'gs_citi' || node.querySelector('#gs_citi')) {
                            // Citation popup detected
                            modifyCitationPopup();
                        }
                    }
                }
            }
        });

        // Start observing the body for added nodes
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function modifyCitationPopup() {
        // Locate the BibTeX link in the citation popup
        const bibtexLink = document.querySelector('#gs_citi a[href*="scholar.bib"]');

        if (bibtexLink) {
            // Avoid modifying multiple times
            if (bibtexLink.dataset.copyAdded === "true") {
                return;
            }

            bibtexLink.dataset.copyAdded = "true"; // Mark as modified

            // Remove any margin from BibTeX link
            bibtexLink.style.marginRight = '0';
            bibtexLink.style.paddingRight = '0';

            // Create the "[Copy]" link
            const copyLink = document.createElement('a');
            copyLink.href = '#';
            copyLink.innerText = '[Copy]';
            copyLink.className = bibtexLink.className;
            copyLink.style.marginLeft = '0';
            copyLink.style.paddingLeft = '0';

            copyLink.addEventListener('click', function(event) {
                event.preventDefault();
                copyBibTeXFromPopup(bibtexLink.href);
            });

            // Create a container for "BibTeX[Copy]"
            const bibtexCopyContainer = document.createElement('span');
            bibtexCopyContainer.style.display = 'inline';

            // Clone the BibTeX link to avoid modifying the original node
            const newBibtexLink = bibtexLink.cloneNode(true);
            newBibtexLink.style.marginRight = '0';
            newBibtexLink.style.paddingRight = '0';

            // Append the links without spaces
            bibtexCopyContainer.appendChild(newBibtexLink);
            bibtexCopyContainer.appendChild(copyLink);

            // Replace the original BibTeX link with the combined container
            bibtexLink.parentNode.replaceChild(bibtexCopyContainer, bibtexLink);
        }
    }

    function copyBibTeXFromPopup(bibtexUrl) {
        GM.xmlHttpRequest({
            method: 'GET',
            url: bibtexUrl,
            headers: {
                'Referer': location.href
            },
            onload: function(response) {
                if (response.status === 200) {
                    const bibtexContent = response.responseText;
                    // Copy the BibTeX content to the clipboard
                    GM.setClipboard(bibtexContent);
                    alert('BibTeX content copied to clipboard!');
                } else {
                    alert('Failed to fetch BibTeX content.');
                }
            },
            onerror: function() {
                alert('Error fetching BibTeX content.');
            }
        });
    }

    // Run the functions on page load
    window.addEventListener('load', function() {
        addCopyBibTeXToCiteButtons();
        addCopyOptionInCitationPopup();
    });

    // Also monitor for any dynamic content changes (e.g., when scrolling)
    const observer = new MutationObserver(() => {
        addCopyBibTeXToCiteButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
