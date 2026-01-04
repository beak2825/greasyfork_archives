// ==UserScript==
// @name         Simfileshare Folder Downloader
// @namespace    https://github.com/dear-clouds/mio-userscripts
// @version      1.0
// @description  Adds a button to download all files in a Simfileshare folder as a zip file and individual download buttons
// @author       Mio.
// @supportURL   https://github.com/dear-clouds/mio-userscripts/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=simfileshare.net
// @match        *://*.simfileshare.net/folder/*
// @grant        none
// @license      GPL-3.0
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/513304/Simfileshare%20Folder%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/513304/Simfileshare%20Folder%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        const MAX_CONCURRENT_DOWNLOADS = 8; // Control how many files to download concurrently here

        // console.log('Page loaded, initializing script...');

        // Button Download All
        const downloadAllButton = document.createElement('button');
        downloadAllButton.innerHTML = 'Download All Files as ZIP';
        const loaderSpanAll = document.createElement('span');
        loaderSpanAll.className = 'loader';
        loaderSpanAll.style.display = 'none';
        downloadAllButton.appendChild(loaderSpanAll);
        downloadAllButton.style.padding = '10px';
        downloadAllButton.style.backgroundColor = '#4CAF50';
        downloadAllButton.style.color = 'white';
        downloadAllButton.style.border = 'none';
        downloadAllButton.style.cursor = 'pointer';
        downloadAllButton.style.marginBottom = '10px';
        downloadAllButton.style.position = 'relative';

        const h4Element = document.querySelector('h4');
        if (h4Element) {
            h4Element.parentNode.insertBefore(downloadAllButton, h4Element.nextSibling);
            // console.log('Download All button appended successfully');
        }

        const loaderStyle = document.createElement('style');
        loaderStyle.innerHTML = `
            .loader {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                width: 16px;
                height: 16px;
                animation: spin 1s linear infinite;
                position: relative;
                margin-left: 10px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .dl-button {
                margin-left: 10px;
                padding: 4px 8px;
                background-color: #3498db;
                color: white;
                border: none;
                cursor: pointer;
                font-size: 0.9em;
                position: relative;
            }
        `;
        document.head.appendChild(loaderStyle);
        // console.log('Loader styles added');

        downloadAllButton.addEventListener('click', async () => {
            console.log('Download All button clicked');

            // Get all the download links in the folder
            const downloadLinks = document.querySelectorAll('a[href*="/download/"]');
            console.log(`Found ${downloadLinks.length} download links`);

            if (downloadLinks.length === 0) {
                alert('No files found to download!');
                return;
            }

            loaderSpanAll.style.display = 'inline-block';
            // console.log('Loader displayed for Download All button');

            // Create a ZIP file with JSZip
            const zip = new JSZip();
            const folderTitle = h4Element.textContent.replace('Folder: ', '').trim();
            console.log(`Folder title determined: ${folderTitle}`);

            // Function to fetch files with retries and concurrency limit
            const fetchFileWithRetry = async (url, retries = 20) => { // Here you can control the number of retries. Default: 20
                for (let attempt = 0; attempt < retries; attempt++) {
                    try {
                        const directUrl = url.replace('/download/', '/cdn/download/') + '/?dl';
                        console.log(`Fetching: ${directUrl} (Attempt ${attempt + 1})`);
                        const response = await fetch(directUrl);
                        if (response.ok) {
                            console.log(`Successfully fetched: ${directUrl}`);
                            return await response.blob();
                        } else {
                            console.warn(`Attempt ${attempt + 1} failed: ${response.statusText}`);
                        }
                    } catch (error) {
                        console.warn(`Attempt ${attempt + 1} failed: ${error.message}`);
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retrying
                }
                throw new Error(`Failed to fetch file after ${retries} attempts: ${url}`);
            };

            // Concurrency limiting function
            const limitConcurrency = async (limit, tasks) => {
                const results = [];
                const executing = [];

                for (const task of tasks) {
                    const p = task().then(result => {
                        executing.splice(executing.indexOf(p), 1);
                        return result;
                    });
                    results.push(p);
                    executing.push(p);

                    if (executing.length >= limit) {
                        await Promise.race(executing);
                    }
                }
                return Promise.all(results);
            };

            // Prepare a list of tasks to fetch each file
            const tasks = Array.from(downloadLinks).map(link => async () => {
                try {
                    console.log(`Preparing to fetch file: ${link.href}`);
                    const blob = await fetchFileWithRetry(link.href);
                    const filename = link.textContent.trim() || `file_${Math.random().toString(36).substring(7)}`;
                    console.log(`Adding file to ZIP: ${filename}`);
                    zip.file(filename, blob);
                } catch (error) {
                    console.error(error.message);
                }
            });

            // Run tasks with controlled concurrency
            await limitConcurrency(MAX_CONCURRENT_DOWNLOADS, tasks);
            // console.log('All files fetched, generating ZIP');

            // Generate ZIP and trigger download
            zip.generateAsync({ type: "blob" }).then(content => {
                saveAs(content, `${folderTitle}.zip`);
                loaderSpanAll.style.display = 'none';
                console.log('ZIP generated and download triggered');
            }).catch(error => {
                console.error('Error generating ZIP:', error);
                loaderSpanAll.style.display = 'none';
                alert('Error occurred while generating ZIP.');
            });
        });

        // Add individual download buttons next to each file link
        const fileLinks = document.querySelectorAll('tr td a[href*="/download/"]');
        fileLinks.forEach(link => {
            const dlButton = document.createElement('button');
            dlButton.innerHTML = 'DL';
            const loaderSpan = document.createElement('span');
            loaderSpan.className = 'loader';
            loaderSpan.style.display = 'none';
            dlButton.appendChild(loaderSpan);
            dlButton.className = 'dl-button';
            dlButton.addEventListener('click', async (e) => {
                e.preventDefault();
                console.log(`Individual download button clicked for link: ${link.href}`);
                loaderSpan.style.display = 'inline-block';
                // console.log('Loader displayed for individual download button');
                try {
                    // First visit the link to prepare the direct download
                    await fetch(link.href, { method: 'GET', mode: 'no-cors' });
                    const directUrl = link.href.replace('/download/', '/cdn/download/') + '/?dl';
                    console.log(`Fetching direct URL: ${directUrl}`);
                    const response = await fetch(directUrl);
                    if (!response.ok) {
                        throw new Error(`Failed to download: ${response.statusText}`);
                    }
                    const blob = await response.blob();
                    const filename = link.textContent.trim();
                    console.log(`Successfully downloaded file: ${filename}`);
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    console.log(`File download triggered: ${filename}`);
                } catch (error) {
                    console.error('Error downloading file:', error);
                    alert(`Error downloading file: ${link.textContent.trim()}`);
                } finally {
                    loaderSpan.style.display = 'none';
                    // console.log('Loader hidden for individual download button');
                }
            });
            link.parentNode.appendChild(dlButton);
            // console.log('DL button appended for link:', link.textContent);
        });
    });
})();
