// ==UserScript==
// @name         Desu Image Downloader
// @version      4.0
// @description  Download images with original filenames on desuarchive.org, archive.palanq.win, and add download button to direct image pages
// @author       Anonimas
// @match        https://desuarchive.org/*
// @match        https://desu-usergeneratedcontent.xyz/*
// @match        https://archive.palanq.win/*
// @match        https://archive-media.palanq.win/*
// @grant        GM_download
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1342214
// @downloadURL https://update.greasyfork.org/scripts/502134/Desu%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/502134/Desu%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #filename-search-container {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            display: flex !important;
            align-items: center !important;
            background-color: rgba(0, 0, 0, 0.5) !important;
            border-radius: 8px !important;
            padding: 0 8px !important;
            transition: background-color 0.3s !important;
            z-index: 9998 !important;
            height: 44px !important;
            box-sizing: border-box !important;
        }
        #filename-search-container:hover {
            background-color: rgba(0, 0, 0, 0.7) !important;
        }
        #filename-search-input {
            background-color: transparent !important;
            border: none !important;
            color: white !important;
            font-size: 18px !important;
            padding: 0 12px !important;
            width: 250px !important;
            height: 100% !important;
            outline: none !important;
            font-family: Arial, sans-serif !important;
            line-height: 44px !important;
            margin: 0 !important;
            box-shadow: none !important;
        }
        #filename-search-input::placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
        }
        #filename-search-input:focus {
            outline: none !important;
            box-shadow: none !important;
            border: none !important;
            background-color: transparent !important;
        }
        #filename-search-button {
            background-color: transparent !important;
            color: white !important;
            border: none !important;
            padding: 0 16px !important;
            height: 100% !important;
            cursor: pointer !important;
            font-size: 18px !important;
            font-family: Arial, sans-serif !important;
            transition: background-color 0.3s !important;
            line-height: 44px !important;
            margin: 0 !important;
        }
        #filename-search-button:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
            border-radius: 5px !important;
        }
        #download-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
            text-decoration: none;
            font-family: Arial, sans-serif;
            z-index: 9999;
            display: none; /* Hidden by default */
        }
        #download-button:hover {
            background-color: rgba(0, 0, 0, 0.7);
        }
        body.has-download-button #filename-search-container {
            right: 140px !important;
        }
    `);

    // Helper function to get full filename from an element
    function getFullFilename(element) {
        return element?.getAttribute('title') || element?.textContent?.trim() || null;
    }


    //Helper Function to extract filename from a URL.
    function extractFilenameFromUrl(url) {
        try {
            const parsedUrl = new URL(url);
            const pathname = parsedUrl.pathname;
            return pathname.substring(pathname.lastIndexOf('/') + 1);
        } catch (e) {
            console.error("Error parsing URL", url, e);
            return null;
        }
    }

    //Helper function to append the filename to the url.
    function appendFilenameToUrl(url, filename) {
         try {
            const parsedUrl = new URL(url);
            parsedUrl.searchParams.set('filename', filename);
            return parsedUrl.toString();
        }
        catch(e) {
            console.error("Error modifying URL", url, e);
             return url;
        }
    }


    // Function to download a single image with GM_download
    function downloadImage(imageUrl, originalFilename) {
        if (!imageUrl || !originalFilename) {
            console.error("Invalid image URL or filename:", { imageUrl, originalFilename });
            return;
        }

        GM_download({
            url: imageUrl,
            name: originalFilename,
            onload: () => {},
            onerror: (error) => console.error('Download error:', error)
        });
    }

    // Function to handle image click (opening image in new tab with filename)
    function handleImageClick(event) {
        event.preventDefault(); // Prevent the default link behavior

        const imageLink = event.target.closest('a[href*="//desu-usergeneratedcontent.xyz/"], a[href*="//archive-media.palanq.win/"]');
        if (!imageLink) return; // Exit if no image link is found

        const imageUrl = imageLink.href;
        let filenameElement = imageLink.closest('div.post_file, article.thread, article.post')?.querySelector('a.post_file_filename');
        if (!filenameElement) return;

        const originalFilename = getFullFilename(filenameElement);
        const newUrl = appendFilenameToUrl(imageUrl, originalFilename);
        window.open(newUrl, '_blank');
    }


    // Function to create the search interface
    function createSearchInterface() {
        const searchContainer = document.createElement('div');
        searchContainer.id = 'filename-search-container';

        const searchInput = document.createElement('input');
        searchInput.id = 'filename-search-input';
        searchInput.type = 'text';
        searchInput.placeholder = 'Search filename...';
        searchInput.autocomplete = 'off';

        const searchButton = document.createElement('button');
        searchButton.id = 'filename-search-button';
        searchButton.textContent = 'Search';

       const performSearch = () => {
            const searchTerm = searchInput.value.trim();
            if (!searchTerm) return;

            let searchUrl;
            const currentBoard = window.location.pathname.split('/')[1] || 'a';
            if (window.location.hostname === 'archive.palanq.win') {
                searchUrl = `https://archive.palanq.win/${currentBoard}/search/filename/${encodeURIComponent(searchTerm)}/`;
            } else {
                searchUrl = `https://desuarchive.org/${currentBoard}/search/filename/${encodeURIComponent(searchTerm)}/`;
            }
            window.location.href = searchUrl;
        };

        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });


        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchButton);
        return searchContainer;
    }

    // Function to add the download button to direct image pages
    function addDownloadButtonToImagePage() {
        if (!(window.location.hostname === 'desu-usergeneratedcontent.xyz' || window.location.hostname === 'archive-media.palanq.win')) {
            return; // Exit if not on an image page
        }


        if (document.getElementById('download-button')) {
           return;
        }

        const button = document.createElement('a');
        button.id = 'download-button';
        button.textContent = 'Download';


        const imageUrl = window.location.href.split('?')[0];
        button.href = imageUrl;

        const urlParams = new URLSearchParams(window.location.search);
        const originalFilename = urlParams.get('filename') || extractFilenameFromUrl(imageUrl);


        button.download = originalFilename;
        document.body.classList.add('has-download-button');
        document.body.appendChild(button);

        button.addEventListener('click', event => {
             event.preventDefault();
            downloadImage(imageUrl, originalFilename);
        });

        //Make download button visable
        button.style.display = 'block';
    }


    // Event delegation for image downloads and filename handling
    function setupEventDelegation() {
        document.body.addEventListener('click', function(event) {
            const target = event.target;

            //Direct Download from File Name
            if(target.closest('a.post_file_filename')) {
                event.preventDefault();
                 const link = target.closest('a.post_file_filename');
                 if (!link) return;

                 const imageUrl = link.href;
                 const originalFilename = getFullFilename(link);
                 downloadImage(imageUrl,originalFilename);
                 return;
            }
             //Direct Download from Icon
            if (target.closest('a[href*="//desu-usergeneratedcontent.xyz/"] i.icon-download-alt, a[href*="//archive-media.palanq.win/"] i.icon-download-alt')) {
                event.preventDefault();
                const downloadButton = target.closest('a');
                if (!downloadButton) return;

                const imageUrl = downloadButton.href;
                let filenameElement = downloadButton.closest('div.post_file, article.thread, article.post')?.querySelector('a.post_file_filename');
                 if (!filenameElement) return;

                 const originalFilename = getFullFilename(filenameElement);
                downloadImage(imageUrl,originalFilename);
                return;

            }

             //Handle image click
            if (target.closest('a[href*="//desu-usergeneratedcontent.xyz/"] img, a[href*="//archive-media.palanq.win/"] img')) {
                handleImageClick(event);
            }
        });
    }

      // Initialize
    function initialize() {
        if (window.location.hostname === 'desuarchive.org' || window.location.hostname === 'archive.palanq.win') {
              if (!document.getElementById('filename-search-container')) {
                const searchContainer = createSearchInterface();
                document.body.appendChild(searchContainer);
            }
             setupEventDelegation();
        }

          addDownloadButtonToImagePage();

          // Setup observer for dynamic content
          const observer = new MutationObserver(debounce(handleMutations, 200));
          observer.observe(document.body, { childList: true, subtree: true });
    }

    // Mutation Handling
     function handleMutations(mutations) {
          for (const mutation of mutations) {
              if (mutation.addedNodes.length) {
                const newLinks = document.querySelectorAll('a.post_file_filename:not([data-handled])');
                  newLinks.forEach(link => {
                    link.dataset.handled = 'true';
                });
              }
         }
      }


     //Debounce Function
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }


    initialize();
})();