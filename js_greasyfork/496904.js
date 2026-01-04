// ==UserScript==
// @name          Moodle Resourcen Downloader
// @namespace     http://rococolabs.org
// @description   Fügt "Alle herunterladen"-Buttons hinzu, um alle Ressourcen in einem Moodle-Kurs herunterzuladen.
// @version       2.1
// @run-at        document-end
// @match         https://moodle.thi.de/course/view.php*
// @grant         none
// @require       https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496904/Moodle%20Resourcen%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/496904/Moodle%20Resourcen%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility function to clean special characters from strings
    function cleanSpecialCharacters(string) {
        return string.replace(/[\u00E0-\u00FC]/g, (match) => {
            const specialChars = {
                'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ç': 'c',
                'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u',
                'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u'
            };
            return specialChars[match] || '';
        }).replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
    }

    // Function to fetch the course name
    function fetchCourseName() {
        const courseTitleElement = document.querySelector('.page-header-headings h1');
        return courseTitleElement ? cleanSpecialCharacters(courseTitleElement.innerText) : 'Course';
    }

    // Function to create and show loading spinner and status message
    function showLoadingSpinner() {
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '10000';
        document.body.appendChild(overlay);

        const spinner = document.createElement('div');
        spinner.id = 'loading-spinner';
        spinner.style.border = '16px solid rgba(0, 0, 0, 0)';
        spinner.style.borderTop = '16px solid #00ffcc';
        spinner.style.borderRadius = '50%';
        spinner.style.width = '120px';
        spinner.style.height = '120px';
        spinner.style.animation = 'spin 2s linear infinite';
        overlay.appendChild(spinner);

        const status = document.createElement('div');
        status.id = 'status-message';
        status.style.color = '#00ffcc';
        status.style.fontFamily = 'monospace';
        status.style.backgroundColor = 'transparent';
        status.style.padding = '10px';
        status.style.border = '2px solid #00ffcc';
        status.style.borderRadius = '0';
        status.style.textAlign = 'center';
        status.style.marginTop = '20px';
        overlay.appendChild(status);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // Function to update status message
    function updateStatusMessage(message) {
        const status = document.getElementById('status-message');
        if (status) {
            status.textContent = message;
        }
    }

    // Function to hide loading spinner and status message
    function hideLoadingSpinner() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Function to get file extension from URL
    function getFileExtension(url) {
        const pathname = new URL(url).pathname;
        const basename = pathname.split('/').pop();
        const match = basename.match(/\.([a-zA-Z0-9]+)$/);
        return match ? match[1] : '';
    }

    // Function to download and zip all resources using JSZip
    async function downloadAllResources(group, zip) {
        const links = document.querySelectorAll(`#${group} .activity.resource a, #${group} .activity.folder a`);
        for (const link of links) {
            const href = link.getAttribute('href');
            if (href && !href.includes('session-')) {
                try {
                    updateStatusMessage(`Hole ${link.innerText.trim()}...`);
                    const response = await fetch(href);
                    const text = await response.text();
                    const doc = new DOMParser().parseFromString(text, 'text/html');
                    const downloadLink = doc.querySelector('.resourceworkaround a')?.href || href;
                    const filenameBase = cleanSpecialCharacters(link.innerText.trim()) || 'download';
                    const fileExtension = getFileExtension(downloadLink);
                    const filename = `${filenameBase}.${fileExtension}`;
                    updateStatusMessage(`Lade ${filename} herunter...`);
                    const fileResponse = await fetch(downloadLink);
                    const fileBlob = await fileResponse.blob();
                    zip.file(filename, fileBlob, {binary: true});

                    // If it's a folder, recursively download its contents
                    if (link.closest('.modtype_folder')) {
                        await downloadFolderContents(href, filenameBase, zip);
                    }

                } catch (error) {
                    console.error(`Fehler beim Herunterladen der Ressource von ${href}:`, error);
                }
            }
        }
    }

    // Function to download contents of a folder
    async function downloadFolderContents(folderUrl, parentFolderName, zip) {
        try {
            const response = await fetch(folderUrl);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');
            const folderLinks = doc.querySelectorAll('.fp-filename-icon a');

            for (const link of folderLinks) {
                const href = link.getAttribute('href');
                if (href && !href.includes('session-')) {
                    const filenameBase = cleanSpecialCharacters(link.querySelector('.fp-filename').innerText.trim()) || 'download';
                    const fileExtension = getFileExtension(href);
                    const filename = `${parentFolderName}/${filenameBase}.${fileExtension}`;
                    updateStatusMessage(`Lade ${filename} herunter...`);
                    const fileResponse = await fetch(href);
                    const fileBlob = await fileResponse.blob();
                    zip.file(filename, fileBlob, {binary: true});
                }
            }
        } catch (error) {
            console.error(`Fehler beim Herunterladen des Verzeichnisses von ${folderUrl}:`, error);
        }
    }

    // Function to download and zip all resources from the entire course using JSZip
    async function downloadAllCourseResources() {
        const zip = new JSZip();
        const sections = document.querySelectorAll('.topics>li.section.main');
        const courseName = fetchCourseName();
        showLoadingSpinner();
        updateStatusMessage('Download startet...');
        for (const section of sections) {
            const group = section.getAttribute('id');
            await downloadAllResources(group, zip);
        }
        updateStatusMessage('Erstelle ZIP...');
        zip.generateAsync({ type: 'blob', compression: 'DEFLATE' }).then(function(content) {
            hideLoadingSpinner();
            saveAs(content, `${courseName}.zip`);
        }).catch(function(error) {
            hideLoadingSpinner();
            console.error('Fehler beim Erstellen der ZIP-Datei:', error);
        });
    }

    // Button styling
    function createStyledButton(id, text) {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        button.style.backgroundColor = '#1d1d1d';
        button.style.color = '#00ffcc';
        button.style.border = '2px solid #00ffcc';
        button.style.padding = '8px 20px';
        button.style.textAlign = 'center';
        button.style.textDecoration = 'none';
        button.style.display = 'inline-block';
        button.style.fontSize = '14px';
        button.style.margin = '4px 2px';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '0';
        button.style.fontFamily = 'monospace';
        button.style.boxShadow = '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)';

        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#00ffcc';
            button.style.color = '#1d1d1d';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#1d1d1d';
            button.style.color = '#00ffcc';
        });

        return button;
    }

    // Inject buttons into the page
    function addDownloadButtons() {
        // Add course-wide download button
        const courseHeader = document.querySelector('.page-header-headings');
        if (courseHeader) {
            const downloadAllCourseButton = createStyledButton('triggerall-course', 'Alle Kurs-Ressourcen herunterladen');
            downloadAllCourseButton.addEventListener('click', (e) => {
                e.preventDefault();
                downloadAllCourseResources();
            });
            const courseButtonContainer = document.createElement('div');
            courseButtonContainer.style.display = 'flex';
            courseButtonContainer.style.justifyContent = 'left';
            courseButtonContainer.style.marginBottom = '20px';
            courseButtonContainer.appendChild(downloadAllCourseButton);
            courseHeader.appendChild(courseButtonContainer);
        }

        // Add section-specific download buttons
        const sections = document.querySelectorAll('.topics>li.section.main');
        const courseName = fetchCourseName();
        sections.forEach(section => {
            const group = section.getAttribute('id');
            const downloadAllButton = createStyledButton(`triggerall-${group}`, 'Alle Ressourcen herunterladen');
            downloadAllButton.addEventListener('click', async (e) => {
                e.preventDefault();
                const zip = new JSZip();
                showLoadingSpinner();
                updateStatusMessage('Download startet...');
                await downloadAllResources(group, zip);
                updateStatusMessage('Erstelle ZIP...');
                zip.generateAsync({ type: 'blob', compression: 'DEFLATE' }).then(function(content) {
                    hideLoadingSpinner();
                    saveAs(content, `${courseName}_${group}.zip`);
                }).catch(function(error) {
                    hideLoadingSpinner();
                    console.error('Fehler beim Erstellen der ZIP-Datei:', error);
                });
            });

            const downloadContainer = document.createElement('div');
            downloadContainer.style.display = 'flex';
            downloadContainer.style.justifyContent = 'flex-end';
            downloadContainer.style.marginTop = '10px';
            downloadContainer.appendChild(downloadAllButton);

            section.querySelector('.content').appendChild(downloadContainer);
        });
    }

    addDownloadButtons();
})();