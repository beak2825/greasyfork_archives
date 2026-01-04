// ==UserScript==
// @name         nhentai Super Filter
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Filtering nhentai.net comics to preference
// @author       Tristan Reeves
// @match        https://nhentai.net/g/*
// @match        https://nhentai.net/*
// @grant        GM_xmlhttpRequest
// @connect      nhentai.net
// @downloadURL https://update.greasyfork.org/scripts/505886/nhentai%20Super%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/505886/nhentai%20Super%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Values for filtering
    //tag1 shouldnt be empty
    const tag1 = 'yuri';
    let tag2 = 'big breasts';
    let tag3 = '';
    let tag4 = '';
    //Tags that you dont want
    const nontag1 = 'yaoi';
    const nontag2 = 'males only';
    //No of pages
    const noofpage = 20;


    // Queue for comic URLs
    const comicQueue = [];
    let isProcessing = false; // Flag to check if we are currently processing

    // Function to add status indicator at the top of the page
    function createStatusIndicator() {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'script-status';
        statusDiv.style.position = 'fixed';
        statusDiv.style.top = '60px';
        statusDiv.style.left = '10px';
        statusDiv.style.padding = '5px 10px';
        statusDiv.style.backgroundColor = 'red';
        statusDiv.style.color = 'white';
        statusDiv.style.fontSize = '12px';
        statusDiv.style.fontFamily = 'Arial, sans-serif';
        statusDiv.style.zIndex = '9999';
        statusDiv.style.borderRadius = '5px';
        statusDiv.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.2)';
        statusDiv.innerText = 'Analyzing comics...';
        document.body.appendChild(statusDiv);
    }

    // Function to update the status indicator when finished
    function updateStatusIndicator(isComplete) {
        const statusDiv = document.getElementById('script-status');
        if (isComplete) {
            statusDiv.innerText = 'Analysis complete!';
            statusDiv.style.backgroundColor = 'green';
            setTimeout(() => {
                statusDiv.style.opacity = '0'; // Fade out
                setTimeout(() => {
                    statusDiv.remove();
                }, 5000);
            }, 5000);
        }
    }

    function analyzeComicPage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');

                        if (tag2 === '') tag2 = tag1;
                        if (tag3 === '') tag3 = tag1;
                        if (tag4 === '') tag4 = tag1;

                        const tagsSection = doc.querySelector('#info #tags');
                        let hasTag1 = false;
                        let hasTag2 = false;
                        let hasTag3 = false;
                        let hasTag4 = false;
                        let hasNontag1 = true;
                        let hasNontag2 = true;

                        if (tagsSection) {
                            const tagContainers = tagsSection.querySelectorAll('.tag-container.field-name');
                            tagContainers.forEach(container => {
                                if (container.textContent.includes('Tags:')) {
                                    const tagLinks = container.querySelectorAll('.tags a');
                                    tagLinks.forEach(link => {
                                        const tagName = link.querySelector('.name').textContent.toLowerCase();
                                        if (tagName === tag1) hasTag1 = true;
                                        if (tagName === tag2) hasTag2 = true;
                                        if (tagName === tag3) hasTag3 = true;
                                        if (tagName === tag4) hasTag4 = true;
                                        if (tagName === nontag1) hasNontag1 = false;
                                        if (tagName === nontag2) hasNontag2 = false;
                                    });
                                }
                            });
                        }

                        const languagesSection = doc.querySelector('#info-block #info');
                        let hasEnglish = false;

                        if (languagesSection) {
                            const languageContainers = languagesSection.querySelectorAll('.tag-container.field-name');
                            languageContainers.forEach(container => {
                                if (container.textContent.includes('Languages:')) {
                                    const languageLinks = container.querySelectorAll('.tags a');
                                    languageLinks.forEach(link => {
                                        const href = link.getAttribute('href');
                                        if (href && href.includes('/language/english/')) {
                                            hasEnglish = true;
                                        }
                                    });
                                }
                            });
                        }

                        const pagesSection = doc.querySelector('#info-block #info');
                        let pageCount = 0;

                        if (pagesSection) {
                            const pageContainers = pagesSection.querySelectorAll('.tag-container.field-name');
                            pageContainers.forEach(container => {
                                if (container.textContent.includes('Pages:')) {
                                    const pageSpan = container.querySelector('.tags a .name');
                                    if (pageSpan) {
                                        const pageText = pageSpan.textContent.trim();
                                        const pageCountMatch = pageText.match(/\d+/);
                                        if (pageCountMatch) {
                                            pageCount = parseInt(pageCountMatch[0], 10);
                                        }
                                    }
                                }
                            });
                        }


                        if (hasTag1 && hasTag2 && hasTag3 && hasTag4 && hasNontag1 && hasNontag2 && hasEnglish && pageCount > noofpage) {
                            resolve(url);
                        } else {
                            resolve(null); // Resolve with null if it does not match
                        }
                    } else {
                        reject(`Failed to fetch: ${response.status}`);
                    }
                },
                onerror: function(error) {
                    reject('Error fetching the page:', error);
                }
            });
        });
    }

    // Function to process the queue
    async function processQueue() {
        if (isProcessing) return; // Prevent re-entry if already processing
        isProcessing = true; // Mark as processing

        while (comicQueue.length > 0) {
            const url = comicQueue.shift();
            try {
                const result = await analyzeComicPage(url);
                if (result) {
                    window.open(result, '_blank');
                }
            } catch (error) {
                console.error(error); // Handle error
            }
        }


        updateStatusIndicator(true);
        isProcessing = false; // Mark as not processing
    }


    function fetchComics() {
        const galleries = document.querySelectorAll('.container.index-container .gallery');

        galleries.forEach(gallery => {
            const link = gallery.querySelector('a[href^="/g/"]');
            if (link) {
                const fullUrl = "https://nhentai.net" + link.getAttribute('href');
                comicQueue.push(fullUrl);
            }
        });

        // Start processing the queue
        processQueue();
    }

    // Main function
    function main() {
        const currentUrl = window.location.href;

        if (currentUrl.startsWith('https://nhentai.net/')) {
            createStatusIndicator();
            fetchComics();
        }
    }

    // Execute the main function
    main();
})();
