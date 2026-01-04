// ==UserScript==
// @name         Payhip Course Assignment Bulk Downloader
// @namespace    https://tampermonkey.net/
// @version      1.0.1
// @description  Bulk download all Payhip course assignment files with formatted names
// @author       ymhc
// @match        https://payhip.com/course-assignments*
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539715/Payhip%20Course%20Assignment%20Bulk%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/539715/Payhip%20Course%20Assignment%20Bulk%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create floating download button
    function createFloatingButton() {
        const button = document.createElement('button');
        button.innerHTML = '📥 Bulk Download';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: #007bff;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: background 0.3s ease;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.background = '#0056b3';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = '#007bff';
        });

        button.addEventListener('click', bulkDownload);

        document.body.appendChild(button);
        return button;
    }

    // Extract assignment data from the page
    function getAssignmentData() {
        const assignments = [];
        const rows = document.querySelectorAll('.general-row.js-general-row');

        rows.forEach(row => {
            try {
                // Extract student name
                const studentLink = row.querySelector('a[href*="/student-details/"]');
                let studentName = '';
                if (studentLink) {
                    studentName = studentLink.textContent.trim();
                }

                // Extract assignment title
                const assignmentElement = row.querySelector('.lesson-type-icon-and-lesson-name-wrapper');
                let assignmentTitle = '';
                if (assignmentElement) {
                    assignmentTitle = assignmentElement.textContent.trim();
                }

                // Extract download URL
                const downloadLink = row.querySelector('a[href*="/course-assignments/download"]');
                let downloadUrl = '';
                if (downloadLink) {
                    downloadUrl = downloadLink.href;
                }

                // Extract original filename for extension
                const fileNameElement = row.querySelector('.file-name');
                let originalFileName = '';
                let fileExtension = '';
                if (fileNameElement) {
                    originalFileName = fileNameElement.textContent.trim();
                    const lastDotIndex = originalFileName.lastIndexOf('.');
                    if (lastDotIndex > -1) {
                        fileExtension = originalFileName.substring(lastDotIndex);
                    }
                }

                if (studentName && assignmentTitle && downloadUrl) {
                    assignments.push({
                        studentName,
                        assignmentTitle,
                        downloadUrl,
                        originalFileName,
                        fileExtension,
                        newFileName: `${studentName} - ${assignmentTitle}${fileExtension}`
                    });
                }
            } catch (error) {
                console.error('Error processing assignment row:', error);
            }
        });

        return assignments;
    }

    // Download a single file with custom name
    function downloadFile(url, fileName) {
        return new Promise((resolve, reject) => {
            // Try using GM_download if available (Tampermonkey)
            if (typeof GM_download !== 'undefined') {
                GM_download(url, fileName, url)
                    .then(() => {
                        setTimeout(resolve, 500);
                    })
                    .catch(error => {
                        console.error(`GM_download failed for ${fileName}:`, error);
                        // Fallback to fetch method
                        fallbackDownload(url, fileName).then(resolve).catch(reject);
                    });
            } else {
                // Use fetch method as fallback
                fallbackDownload(url, fileName).then(resolve).catch(reject);
            }
        });
    }

    // Fallback download method using fetch and blob
    function fallbackDownload(url, fileName) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.blob();
                })
                .then(blob => {
                    const blobUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = fileName;
                    link.style.display = 'none';

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // Clean up the blob URL
                    window.URL.revokeObjectURL(blobUrl);

                    // Small delay to prevent overwhelming the browser
                    setTimeout(resolve, 500);
                })
                .catch(error => {
                    console.error(`Failed to download ${fileName}:`, error);
                    reject(error);
                });
        });
    }

    // Show progress indicator
    function showProgress(current, total) {
        let progressDiv = document.getElementById('bulk-download-progress');

        if (!progressDiv) {
            progressDiv = document.createElement('div');
            progressDiv.id = 'bulk-download-progress';
            progressDiv.style.cssText = `
                position: fixed;
                top: 70px;
                right: 20px;
                z-index: 9999;
                background: #28a745;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                font-size: 12px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(progressDiv);
        }

        progressDiv.textContent = `Downloading: ${current}/${total}`;

        if (current === total) {
            setTimeout(() => {
                if (progressDiv.parentNode) {
                    progressDiv.parentNode.removeChild(progressDiv);
                }
            }, 2000);
        }
    }

    // Main bulk download function
    async function bulkDownload() {
        const assignments = getAssignmentData();

        if (assignments.length === 0) {
            alert('No assignments found on this page.');
            return;
        }

        const confirmMessage = `Found ${assignments.length} assignments. Download all?`;
        if (!confirm(confirmMessage)) {
            return;
        }

        console.log('Starting bulk download of assignments:', assignments);

        for (let i = 0; i < assignments.length; i++) {
            const assignment = assignments[i];
            showProgress(i + 1, assignments.length);

            try {
                console.log(`Downloading: ${assignment.newFileName}`);
                await downloadFile(assignment.downloadUrl, assignment.newFileName);
            } catch (error) {
                console.error(`Failed to download ${assignment.newFileName}:`, error);
            }
        }

        console.log('Bulk download completed!');
    }

    // Initialize the script when page loads
    function init() {
        // Check if we're on the assignments page
        if (window.location.pathname.includes('course-assignments')) {
            // Wait a bit for the page to fully load
            setTimeout(() => {
                createFloatingButton();
                console.log('Payhip Assignment Bulk Downloader loaded');
            }, 1000);
        }
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();