// ==UserScript==
// @name         KIITConnect Data Management
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds a settings menu for downloading data, uploading data, and downloading a file
// @author       Bibek
// @match        https://www.kiitconnect.com/*
// @grant        none
// @icon         https://www.kiitconnect.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517067/KIITConnect%20Data%20Management.user.js
// @updateURL https://update.greasyfork.org/scripts/517067/KIITConnect%20Data%20Management.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const filenameDivSelector = '.flex.w-full.pt-10.md\\:pt-0.pb-6.text-base.mt-5.md\\:py-10.md\\:my-0.font-bold.md\\:text-2xl.justify-center.items-center span.pl-2';

    // Ensure the filename div is detected
    function ensureFilenameDivLoaded(callback) {
        const retryInterval = 100; // Check every 100ms
        const maxRetries = 50; // Limit retries to avoid infinite loop
        let retries = 0;

        const interval = setInterval(() => {
            const filenameDiv = document.querySelector(filenameDivSelector);
            if (filenameDiv) {
                clearInterval(interval);
                callback(filenameDiv);
            } else if (++retries >= maxRetries) {
                clearInterval(interval);
                console.error('Filename div not found within the retry limit.');
            }
        }, retryInterval);
    }

    // Function to handle PYQS functionality
    function executePYQsCode() {
        // alert("Now looking for PYQs.");
        console.log('Executing PYQS functionality...');
        // Your existing PYQS logic here
        // Function to create and insert the settings icon and menu
        function createSettingsMenu() {
            // Create settings icon
            const settingsIcon = document.createElement('img');
            settingsIcon.src = 'https://cdn-icons-png.flaticon.com/512/2697/2697990.png';
            settingsIcon.alt = 'Settings';
            settingsIcon.style.width = '40px';
            settingsIcon.style.cursor = 'pointer';
            settingsIcon.style.position = 'fixed';
            settingsIcon.style.bottom = '20px';
            settingsIcon.style.right = '20px';
            settingsIcon.style.zIndex = '1000';

            // Create menu container
            const menuContainer = document.createElement('div');
            menuContainer.style.display = 'none';
            menuContainer.style.flexDirection = 'column';
            menuContainer.style.position = 'fixed';
            menuContainer.style.bottom = '70px';
            menuContainer.style.right = '10px';
            menuContainer.style.backgroundColor = '#041d35';
            menuContainer.style.backdropFilter = 'blur(5px)';
            menuContainer.style.padding = '10px';
            menuContainer.style.border = '1px solid #143267';
            menuContainer.style.borderRadius = '50px';
            menuContainer.style.zIndex = '1000';

            // Toggle menu visibility on settings icon click
            settingsIcon.addEventListener('click', () => {
                menuContainer.style.display = menuContainer.style.display === 'none' ? 'flex' : 'none';
            });

            // Create download CSV icon
            const downloadCSVIcon = document.createElement('img');
            downloadCSVIcon.src = 'https://cdn-icons-png.flaticon.com/512/9153/9153957.png';
            downloadCSVIcon.alt = 'Download CSV';
            downloadCSVIcon.style.width = '40px';
            downloadCSVIcon.style.cursor = 'pointer';
            downloadCSVIcon.style.marginBottom = '10px';
            downloadCSVIcon.addEventListener('click', downloadCSVData);

            // Create upload icon (opens Google Form)
            const uploadIcon = document.createElement('img');
            uploadIcon.src = 'https://cdn-icons-png.flaticon.com/512/10152/10152423.png';
            uploadIcon.alt = 'Upload';
            uploadIcon.style.width = '40px';
            uploadIcon.style.cursor = 'pointer';
            uploadIcon.style.marginBottom = '10px';
            uploadIcon.addEventListener('click', () => {
                window.open('https://forms.gle/sb4uEPXWmhCvRcBG6', '_blank');
            });

            // Create download file icon
            const downloadFileIcon = document.createElement('img');
            downloadFileIcon.src = 'https://cdn-icons-png.flaticon.com/512/1091/1091007.png';
            downloadFileIcon.alt = 'Download File';
            downloadFileIcon.style.width = '40px';
            downloadFileIcon.style.cursor = 'pointer';
            downloadFileIcon.addEventListener('click', () => {
                window.open('https://drive.google.com/drive/folders/11FZF-h8tmulA9LgLLV9E4s2LbGD_Rf7iI5BwCl35WdZ-vfbuQzDZcGgP1IwiwkRVJ-rK0uoU?usp=sharing', '_blank');
            });

            // Append icons to menu container
            menuContainer.appendChild(downloadCSVIcon);
            menuContainer.appendChild(uploadIcon);
            menuContainer.appendChild(downloadFileIcon);

            // Append settings icon and menu container to document body
            document.body.appendChild(settingsIcon);
            document.body.appendChild(menuContainer);
        }

        // Function to scrape data and download as CSV
        function downloadCSVData() {
            // Retrieve the filename from the specific div
            const filenameDiv = document.querySelector('.flex.w-full.pt-10.md\\:pt-0.pb-6.text-base.mt-5.md\\:py-10.md\\:my-0.font-bold.md\\:text-2xl.justify-center.items-center span.pl-2');
            const filename = filenameDiv ? filenameDiv.textContent.trim() : 'subject_data';

            // Initialize an array to hold all subjects with their respective rows
            const allSubjectsData = [];

            // Select all subject name elements
            const subjectNameElements = document.querySelectorAll('.py-3.md\\:py-5.relative.rounded-md.text-\\[12px\\].md\\:text-2xl.font-bold.text-center.border.border-slate-500.text-gray-300');

            // Iterate over each subject name element
            subjectNameElements.forEach(subjectElement => {
                // Extract the subject name
                const subjectName = subjectElement.textContent.trim().replace(/^Syllabus\s*/, '');

                // Select the table rows within this subject
                const rows = subjectElement.nextElementSibling.querySelectorAll('tbody.text-white.text-base tr');

                // Iterate over each row within the subject
                rows.forEach(row => {
                    // Extract row data
                    const pyqYear = row.querySelector('td.whitespace-nowrap.px-6.font-bold.py-4.text-slate-300')?.textContent.trim() || '';
                    const pyqType = row.querySelector('td.whitespace-nowrap.px-6.text-gray-400.font-bold.hidden.md\\:block.py-4')?.textContent.trim() || '';

                    const pyqLinkElement = row.querySelector('td.whitespace-nowrap.px-6.py-4 a.font-bold.text-cyan-500');
                    const pyqLink = pyqLinkElement ? pyqLinkElement.href : '';
                    const pyqName = pyqLinkElement ? pyqLinkElement.textContent.trim() : '';

                    // Extract the last 33 characters of the question code from the link
                    // const questionCode = pyqLink ? pyqLink.match(/academic\/view\/([a-zA-Z0-9_-]{33})\?/)[1] : '';
                    const questionCode = pyqLink ? (pyqLink.match(/([a-zA-Z0-9_-]{33})\?/)?.[1] || '') : '';

                    const pyqSolutionLinkElement = row.querySelector('td.whitespace-nowrap.px-6.py-4.font-bold.text-gray-400 a.text-cyan-500');
                    const pyqSolutionLink = pyqSolutionLinkElement ? pyqSolutionLinkElement.href : '';
                    const solutionTextElement = row.querySelector('td.whitespace-nowrap.px-6.py-4.font-bold.text-gray-400 span');
                    const solution = pyqSolutionLinkElement
                    ? pyqSolutionLinkElement.textContent.trim()
                    : (solutionTextElement ? solutionTextElement.textContent.trim() : 'Not Available');

                    // Get the additional solutionStatus text
                    const solutionStatusText = row.querySelector('td.whitespace-nowrap.px-6.py-4.font-bold.text-gray-400')?.textContent.trim() || '';

                    const solutionCode = pyqSolutionLink ? (pyqSolutionLink.match(/([a-zA-Z0-9_-]{33})\?/)?.[1] || '') : ''; //  new line

                    // Add row data to the allSubjectsData array with subject name included
                    allSubjectsData.push({
                        subject: subjectName,
                        year: pyqYear,
                        type: pyqType,
                        pyqName: pyqName,
                        pyqLink: pyqLink,
                        questionCode: questionCode,// Add question code here
                        solutionLink: pyqSolutionLink,
                        solution: solution,
                        solutionStatus: solutionStatusText,
                        solutionCode: solutionCode,
                    });
                });
            });

            // Function to convert JSON to CSV format
            function convertToCSV(data) {
                const headers = [
                    'Subject',
                    'Year',
                    'Type',
                    'PYQ Name',
                    'PYQ Link',
                    'Question Code',
                    'Solution Link',
                    'Solution',
                    'Solution Status',
                    'solutionCode',
                    'Question Link', // New column header
                    'Solution Link' // New column header
                ];

                const rows = data.map(row => [
                    row.subject,
                    row.year,
                    row.type,
                    row.pyqName,
                    row.pyqLink,
                    row.questionCode,
                    row.solutionLink,
                    row.solution,
                    row.solutionStatus,
                    row.solutionCode,

                    // Question Link
                    row.questionCode
                    ? `=HYPERLINK("https://drive.google.com/file/d/${row.questionCode}/edit", "${row.year} ${row.pyqName}")`.replace(/"/g, '""')
                    : 'Not Available',
                    // Solution Link
                    row.solutionCode
                    ? `=HYPERLINK("https://drive.google.com/file/d/${row.solutionCode}/edit", "${row.year} ${row.pyqName} Solution")`.replace(/"/g, '""')
                    : 'Not Available'

                ]);

                // Convert rows to CSV format
                return [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
            }




            // Convert the data to CSV format
            const csvData = convertToCSV(allSubjectsData);

            // Create a Blob from the CSV data and trigger the download
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.csv`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Clean up the URL object
        }

        // Run the script only on the specified page
        if (window.location.href.startsWith('https://www.kiitconnect.com/')) {
            createSettingsMenu();
        }
    }

    // Function to handle NOTES functionality
    function executeNOTESCode() {
        // alert("Now looking for NOTES.");
        console.log('Executing NOTES functionality...');
        // Your existing NOTES logic here
        // Function to create and insert the settings icon and menu
        function createSettingsMenu() {
            // Create settings icon
            const settingsIcon = document.createElement('img');
            settingsIcon.src = 'https://cdn-icons-png.flaticon.com/512/2697/2697990.png';
            settingsIcon.alt = 'Settings';
            settingsIcon.style.width = '40px';
            settingsIcon.style.cursor = 'pointer';
            settingsIcon.style.position = 'fixed';
            settingsIcon.style.bottom = '20px';
            settingsIcon.style.right = '20px';
            settingsIcon.style.zIndex = '1000';

            // Create menu container
            const menuContainer = document.createElement('div');
            menuContainer.style.display = 'none';
            menuContainer.style.flexDirection = 'column';
            menuContainer.style.position = 'fixed';
            menuContainer.style.bottom = '70px';
            menuContainer.style.right = '10px';
            menuContainer.style.backgroundColor = '#041d35';
            menuContainer.style.backdropFilter = 'blur(5px)';
            menuContainer.style.padding = '10px';
            menuContainer.style.border = '1px solid #143267';
            menuContainer.style.borderRadius = '50px';
            menuContainer.style.zIndex = '1000';

            // Toggle menu visibility on settings icon click
            settingsIcon.addEventListener('click', () => {
                menuContainer.style.display = menuContainer.style.display === 'none' ? 'flex' : 'none';
            });

            // Create download CSV icon
            const downloadCSVIcon = document.createElement('img');
            downloadCSVIcon.src = 'https://cdn-icons-png.flaticon.com/512/9153/9153957.png';
            downloadCSVIcon.alt = 'Download CSV';
            downloadCSVIcon.style.width = '40px';
            downloadCSVIcon.style.cursor = 'pointer';
            downloadCSVIcon.style.marginBottom = '10px';
            downloadCSVIcon.addEventListener('click', downloadCSVData);

            // Create upload icon (opens Google Form)
            const uploadIcon = document.createElement('img');
            uploadIcon.src = 'https://cdn-icons-png.flaticon.com/512/10152/10152423.png';
            uploadIcon.alt = 'Upload';
            uploadIcon.style.width = '40px';
            uploadIcon.style.cursor = 'pointer';
            uploadIcon.style.marginBottom = '10px';
            uploadIcon.addEventListener('click', () => {
                window.open('https://forms.gle/sb4uEPXWmhCvRcBG6', '_blank');
            });

            // Create download file icon
            const downloadFileIcon = document.createElement('img');
            downloadFileIcon.src = 'https://cdn-icons-png.flaticon.com/512/1091/1091007.png';
            downloadFileIcon.alt = 'Download File';
            downloadFileIcon.style.width = '40px';
            downloadFileIcon.style.cursor = 'pointer';
            downloadFileIcon.addEventListener('click', () => {
                window.open('https://drive.google.com/drive/folders/11FZF-h8tmulA9LgLLV9E4s2LbGD_Rf7iI5BwCl35WdZ-vfbuQzDZcGgP1IwiwkRVJ-rK0uoU?usp=sharing', '_blank');
            });

            // Append icons to menu container
            menuContainer.appendChild(downloadCSVIcon);
            menuContainer.appendChild(uploadIcon);
            menuContainer.appendChild(downloadFileIcon);

            // Append settings icon and menu container to document body
            document.body.appendChild(settingsIcon);
            document.body.appendChild(menuContainer);
        }



        function downloadCSVData() {
            // Retrieve the filename from the specific div
            const filenameDiv = document.querySelector('.flex.w-full.pt-10.md\\:pt-0.pb-6.text-base.mt-5.md\\:py-10.md\\:my-0.font-bold.md\\:text-2xl.justify-center.items-center span.pl-2');
            const filename = filenameDiv ? filenameDiv.textContent.trim() : 'data_export';

            // Initialize an array to hold all subjects with their respective rows
            const allSubjectsData = [];

            // Select all subject name elements
            const subjectNameElements = document.querySelectorAll('.py-3.md\\:py-5.relative.rounded-md.text-\\[12px\\].md\\:text-2xl.font-bold.text-center.border.border-slate-500.text-gray-300');

            // Iterate over each subject name element
            subjectNameElements.forEach(subjectElement => {
                // Extract the subject name and remove "Syllabus"
                const subjectName = subjectElement.textContent.trim().replace(/^Syllabus\s*/, '');

                // Select all topics under this subject
                const topics = subjectElement.parentElement.querySelectorAll('.text-cyan-500 h1');
                const topicLinks = subjectElement.parentElement.querySelectorAll('.cursor-pointer.py-3[href]');

                topics.forEach((topicElement, index) => {
                    const topicName = topicElement.textContent.trim();
                    const topicLink = topicLinks[index]?.href || '';
                    const topicCode = topicLink ? (topicLink.match(/([a-zA-Z0-9_-]{33})(?=\?)/)?.[1] || '') : '';

                    // Add topic data to the allSubjectsData array with subject name included
                    allSubjectsData.push({
                        subject: subjectName,
                        topic: topicName,
                        topicLink: topicLink,
                        topicCode: topicCode,
                    });
                });
            });

            // Function to convert JSON to CSV format
            function convertToCSV(data) {
                const headers = ['Subject', 'Topic Name', 'Topic Link', 'Topic Code', 'Note Link'];
                const rows = data.map(row => [
                    row.subject,
                    row.topic,
                    row.topicLink,
                    row.topicCode,
                    `=HYPERLINK("https://drive.google.com/file/d/${row.topicCode}/edit", "${row.topic}")`.replace(/"/g, '""') // Escape double quotes
                ]);

                return [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
            }

            // Convert the data to CSV format
            const csvData = convertToCSV(allSubjectsData);

            // Create a Blob from the CSV data and trigger the download
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.csv`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Clean up the URL object
        }

        // Run the script only on the specified page
        if (window.location.href.startsWith('https://www.kiitconnect.com/')) {
            createSettingsMenu();
        }
    }

    // Check and execute functionality based on filename div content
    function checkAndExecute(filenameDiv) {
        const textContent = filenameDiv.textContent.trim().toUpperCase();
        console.log('Filename text detected:', textContent);

        if (textContent.includes('PYQS')) {
            executePYQsCode();
        } else if (textContent.includes('NOTES')) {
            executeNOTESCode();
        } else {
            console.warn('Unrecognized filename text:', textContent);
        }
    }

    // Observe changes in the DOM and recheck
    function observeChanges(filenameDiv) {
        const observer = new MutationObserver(() => {
            console.log('Filename text content changed, rechecking...');
            checkAndExecute(filenameDiv);
        });

        observer.observe(filenameDiv, {
            characterData: true,
            subtree: true,
            childList: true
        });

        console.log('MutationObserver is now watching for changes.');
    }

    // Initialize script
    window.addEventListener('load', () => {
        ensureFilenameDivLoaded((filenameDiv) => {
            checkAndExecute(filenameDiv);
            observeChanges(filenameDiv);
        });
    });
})();
