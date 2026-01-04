// ==UserScript==
// @name         ManyVids Bulk Downloader Enhanced
// @namespace    https://www.manyvids.com/
// @version      1.5.9
// @description  Download videos in bulk from ManyVids Purchase History
// @author       BiAndNerdy@gmail.com
// @match        https://www.manyvids.com/View-my-history/*/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531157/ManyVids%20Bulk%20Downloader%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/531157/ManyVids%20Bulk%20Downloader%20Enhanced.meta.js
// ==/UserScript==
// Date Created: 2025-03-28
// Instructions: To download ALL videos you must first scroll down and click the "View More" button until it disappears. Then click the "Download" button.

(function() {
    'use strict';

    // Create the Download button
    const downloadBtn = document.createElement('button');
    downloadBtn.innerHTML = 'Download';
    styleButton(downloadBtn, '10px', '250px', '#4caf50');

    // Create the Pause button
    const pauseBtn = document.createElement('button');
    pauseBtn.innerHTML = 'Pause';
    styleButton(pauseBtn, '10px', '160px', '#ffa500');

    // Create the Stop button
    const stopBtn = document.createElement('button');
    stopBtn.innerHTML = 'Stop';
    styleButton(stopBtn, '10px', '50px', '#ff0000');

    document.body.appendChild(downloadBtn);
    document.body.appendChild(pauseBtn);
    document.body.appendChild(stopBtn);

    // Create progress bar and status display
    const progressContainer = document.createElement('div');
    progressContainer.style.position = 'fixed';
    progressContainer.style.bottom = '70px';
    progressContainer.style.right = '10px';
    progressContainer.style.width = '300px';
    progressContainer.style.height = '20px';
    progressContainer.style.backgroundColor = '#ddd';
    progressContainer.style.border = '1px solid #aaa';
    document.body.appendChild(progressContainer);

    const progressBar = document.createElement('div');
    progressBar.style.height = '100%';
    progressBar.style.width = '0%';
    progressBar.style.backgroundColor = '#4caf50';
    progressContainer.appendChild(progressBar);

    const statusText = document.createElement('div');
    statusText.style.position = 'fixed';
    statusText.style.bottom = '100px';
    statusText.style.right = '10px';
    statusText.style.color = '#fff';
    statusText.style.backgroundColor = '#000';
    statusText.style.padding = '5px 10px';
    statusText.style.border = '1px solid #aaa';
    document.body.appendChild(statusText);

    const currentFileText = document.createElement('div');
    currentFileText.style.position = 'fixed';
    currentFileText.style.bottom = '130px';
    currentFileText.style.right = '10px';
    currentFileText.style.color = '#fff';
    currentFileText.style.backgroundColor = '#000';
    currentFileText.style.padding = '5px 10px';
    currentFileText.style.border = '1px solid #aaa';
    document.body.appendChild(currentFileText);

    // Track downloaded file names to prevent duplicates
    const downloadedFiles = new Set();
    let totalVideos = 0;
    let downloadedCount = 0;
    let paused = false;
    let stopped = false;

    // Button click events
    downloadBtn.addEventListener('click', startDownload);
    pauseBtn.addEventListener('click', togglePause);
    stopBtn.addEventListener('click', stopDownload);

    async function startDownload() {
        const qualityChoice = confirm('Click OK for Full Resolution or Cancel for Compressed.');
        const useFullResolution = qualityChoice === true;

        const links = Array.from(document.querySelectorAll('a[href*="/Video/"]'));
        const videoLinks = Array.from(new Set(links
            .map(link => link.href.match(/https:\/\/www\.manyvids\.com\/Video\/(\d+)\//))
            .filter(match => match !== null)
            .map(match => match[1])));

        if (videoLinks.length === 0) {
            alert('No videos found on this page.');
            return;
        }

        totalVideos = videoLinks.length;
        updateProgress();

        for (const id of videoLinks) {
            if (stopped) {
                alert('Download stopped.');
                resetState();
                return;
            }
            while (paused) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            const privateJsonUrl = `https://www.manyvids.com/bff/store/video/${id}/private`;
            const publicJsonUrl = `https://www.manyvids.com/bff/store/video/${id}`;

            const metadata = await fetchMetadata(publicJsonUrl, id);
            await fetchAndDownloadVideo(privateJsonUrl, metadata, useFullResolution, id);
        }

        alert('All downloads complete!');
        resetState();
    }

    function togglePause() {
        paused = !paused;
        pauseBtn.innerHTML = paused ? 'Resume' : 'Pause';
    }

    function stopDownload() {
        stopped = true;
    }

    function resetState() {
        paused = false;
        stopped = false;
        pauseBtn.innerHTML = 'Pause';
    }

    async function fetchMetadata(url, id) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const metaData = JSON.parse(response.responseText);
                            const title = metaData.data?.title || 'Untitled';
                            const displayName = metaData.data?.model?.displayName || 'Unknown';
                            resolve({ title, displayName });
                        } catch (error) {
                            resolve({ title: 'Untitled', displayName: 'Unknown' });
                        }
                    } else {
                        resolve({ title: 'Untitled', displayName: 'Unknown' });
                    }
                },
                onerror: function() {
                    resolve({ title: 'Untitled', displayName: 'Unknown' });
                }
            });
        });
    }

    async function fetchAndDownloadVideo(url, metadata, useFullResolution, id) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            const videoUrl = useFullResolution ? data.data.filepath : data.data.transcodedFilepath;

                            if (videoUrl) {
                                const filename = `${metadata.displayName.replace(/[\\/:*?"<>|]/g, '')} - ${metadata.title.replace(/[\\/:*?"<>|]/g, '')}.mp4`;

                                if (downloadedFiles.has(filename)) {
                                    resolve();
                                    return;
                                }

                                downloadedFiles.add(filename);
                                updateCurrentFile(filename);

                                GM_download({
                                    url: videoUrl,
                                    name: filename,
                                    onload: function() {
                                        downloadedCount++;
                                        updateProgress();
                                        resolve();
                                    },
                                    onerror: function() {
                                        resolve();
                                    }
                                });
                            } else {
                                resolve();
                            }
                        } catch (error) {
                            resolve();
                        }
                    } else {
                        resolve();
                    }
                },
                onerror: function() {
                    resolve();
                }
            });
        });
    }

    function updateProgress() {
        const percentage = (downloadedCount / totalVideos) * 100;
        progressBar.style.width = `${percentage}%`;
        statusText.innerHTML = `Downloaded ${downloadedCount} of ${totalVideos}`;
    }

    function updateCurrentFile(filename) {
        currentFileText.innerHTML = `Downloading: ${filename}`;
    }

    function styleButton(button, bottom, right, bgColor) {
        button.style.position = 'fixed';
        button.style.bottom = bottom;
        button.style.right = right;
        button.style.zIndex = '9999';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = bgColor;
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
    }
})();
