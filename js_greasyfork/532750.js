// ==UserScript==
// @name         MediaFire Bulk Downloader 2025.04.01
// @namespace    http://tampermonkey.net/
// @include      https://www.mediafire.com/folder/*
// @include      https://www.mediafire.com/file/*
// @version      1.0
// @description  Batch download files from a MediaFire folder with delay
// @author       Aditya Jain
// @license      GNU GPL v3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532750/MediaFire%20Bulk%20Downloader%2020250401.user.js
// @updateURL https://update.greasyfork.org/scripts/532750/MediaFire%20Bulk%20Downloader%2020250401.meta.js
// ==/UserScript==

/**
 * MediaFire Batch Downloader
 * 
 * This userscript enhances MediaFire with batch download capabilities:
 * 1. On folder pages: Adds a "DOWNLOAD ALL" button to batch download all files
 * 2. On file pages: Automatically starts download and closes the tab after a delay
 * 
 * @author Aditya Jain
 * @version 1.0
 */

(function() {
    'use strict';
    
    // Main entry point - determines page type and calls appropriate handler
    const init = () => {
      const urlType = window.location.pathname.split('/')[1];
      
      if (urlType === 'folder') {
        handleFolderPage();
      } else if (urlType === 'file') {
        handleFilePage();
      } else {
        console.error('MediaFire Batch Downloader: Unsupported page type');
      }
    };
    
    /**
     * Handles file pages by automatically initiating download and closing the tab
     * after a specified delay
     */
    const handleFilePage = () => {
      console.log('MediaFire Batch Downloader: Processing file page, will download and close tab after delay');
      
      // Find the download link input element
      const downloadLinkInput = document.querySelector('.download_link .input');
      
      if (downloadLinkInput) {
        // Get the direct download URL
        const downloadUrl = downloadLinkInput.getAttribute('href');
        console.log('MediaFire Batch Downloader: Found download link:', downloadUrl);
        
        // Redirect to the download URL
        location.replace(downloadUrl);
        
        // Set a timer to close the window after 5 seconds
        const closeWindowsTimer = setInterval(() => {
          window.close();
          clearInterval(closeWindowsTimer);
        }, 5000);
      } else {
        console.error('MediaFire Batch Downloader: Could not find download link on this page');
      }
    };
    
    /**
     * Handles folder pages by adding a "DOWNLOAD ALL" button
     * that allows batch downloading of all files in the folder
     */
    const handleFolderPage = () => {
      console.log('MediaFire Batch Downloader: Processing folder page, adding download all button');
            
      // Check for popup permissions before proceeding
      checkPopupPermission();
      
      // Add the Download All button to the page
      addDownloadAllButton();
    };
    
    /**
     * Verifies if the browser allows popups for MediaFire
     * Alerts the user if popups are blocked
     * @returns {boolean} - True if popups are allowed, false if blocked
     */
    const checkPopupPermission = () => {
      const testWindow = window.open('https://www.mediafire.com/');
      
      if (!testWindow || testWindow.closed || typeof testWindow.closed === 'undefined') {
        alert('Popups are blocked for MediaFire. Please enable them before clicking the "DOWNLOAD ALL" button.');
        return false;
      }
      
      // Close the test window
      testWindow.close();
      return true;
    };
    
    /**
     * Creates and adds a "DOWNLOAD ALL" button to the page
     * by replacing the existing upgrade button
     */
    const addDownloadAllButton = () => {
      // Find the upgrade button to replace it with our download button
      const upgradeButtonFrame = document.querySelector('.upgrade_button_frame');
      
      if (upgradeButtonFrame) {
        // Create a new "DOWNLOAD ALL" button
        const downloadAllButton = document.createElement('button');
        downloadAllButton.textContent = 'DOWNLOAD ALL';
        downloadAllButton.classList.add('Btn', 'Btn--greenUpgrade');
        downloadAllButton.style.backgroundColor = '#33CC66';
        downloadAllButton.style.color = '#222835';
        downloadAllButton.addEventListener('click', initiateDownloadAll);
        
        // Replace the upgrade button with our download button
        upgradeButtonFrame.parentNode.replaceChild(
          downloadAllButton,
          upgradeButtonFrame
        );
      } else {
        console.error('MediaFire Batch Downloader: Could not find the upgrade button to replace');
      }
    };
    
    /**
     * Initiates the batch download process for all files in the folder
     * 1. Checks popup permissions again
     * 2. Collects all file links by scrolling through the folder
     * 3. Opens each file link in a new tab with delay
     */
    const initiateDownloadAll = () => {
      // Verify popup permissions again before starting
      if (!checkPopupPermission()) {
        console.log('MediaFire Batch Downloader: Popup permission check failed. Stopping download process.');
        return;
      }
      
      // Map to store filenames and their download links
      const fileCollection = new Map();
      
      // Create a mutation observer to detect when new file items are added to the list
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.tagName === 'LI') {
              const fileContainer = node.querySelector(
                'div.info > div.filename_outer.cf > a'
              );
              
              if (fileContainer) {
                const fileName = fileContainer.querySelector('span')?.textContent || '';
                const downloadLink = fileContainer.href || '';
                
                if (fileName && !fileCollection.has(fileName)) {
                  fileCollection.set(fileName, downloadLink);
                  console.log('MediaFire Batch Downloader: File added to download list:', fileName);
                }
              }
            }
          });
        });
      });
      
      // Start observing the file list for changes
      const listContainer = document.querySelector('#main_list');
      
      if (!listContainer) {
        console.error('MediaFire Batch Downloader: Could not find the file list container');
        return;
      }
      
      observer.observe(listContainer, { childList: true, subtree: false });
      
      /**
       * Scrolls through the page to load all files and then
       * initiates download for each file with a delay
       */
      const scrollAndCollect = async () => {
        // Scroll down the page until no more new content is loaded
        let lastScrollPosition = window.scrollY;
        window.scrollBy(0, 1000);
        
        while (window.scrollY > lastScrollPosition) {
            lastScrollPosition = window.scrollY;
          window.scrollBy(0, 300);
          // Wait for content to load
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        // Stop observing once scrolling is complete
        observer.disconnect();
        console.log('MediaFire Batch Downloader: Finished collecting files. Total files found:', fileCollection.size);
        
        // Open each file link in a new tab with delay
        for (const downloadUrl of fileCollection.values()) {
          window.open(downloadUrl, '_blank');
          // Wait between opening tabs to prevent overwhelming the browser
          await new Promise(resolve => setTimeout(resolve, 8000));
        }
      };
      
      // Start the scrolling and collection process
      scrollAndCollect();
    };
    
    // Initialize the script
    init();
  })();