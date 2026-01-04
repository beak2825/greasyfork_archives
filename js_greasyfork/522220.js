// ==UserScript==
// @name         Download Grade Sheet Button with Dynamic Options
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Replace ID in the URL, open in a new tab, and dynamically adjust movement options
// @author       Venus
// @match        https://usis.bracu.ac.bd/academia/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bracu.ac.bd
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522220/Download%20Grade%20Sheet%20Button%20with%20Dynamic%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/522220/Download%20Grade%20Sheet%20Button%20with%20Dynamic%20Options.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Set the workerSrc for PDF.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    // Inject CSS for button styles and animations
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        @keyframes shineEffect {
            0% {
                box-shadow: 0 0 5px rgba(255,255,255,0.5);
            }
            50% {
                box-shadow: 0 0 20px rgba(255,255,255,1);
            }
            100% {
                box-shadow: 0 0 5px rgba(255,255,255,0.5);
            }
        }

        .custom-grade-button {
            position: fixed;
            top: 60px;
            right: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px 24px;
            background: linear-gradient(45deg, #007bff, #17a2b8, #28a745, #ffc107);
            background-size: 400% 400%;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            z-index: 1000;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            transition: transform 0.2s;
            animation: gradientShift 8s ease infinite, shineEffect 3s ease infinite;
        }

        .custom-grade-button:hover {
            transform: scale(1.05);
        }

        .custom-grade-button img {
            width: 20px;
            height: 20px;
            margin-right: 10px;
        }

        .context-menu {
            position: absolute;
            display: none;
            z-index: 1100;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
            padding: 5px 0;
            font-size: 14px;
            list-style: none;
            width: 200px;
        }

        .context-menu li {
            padding: 8px 15px;
            cursor: pointer;
            color: #333;
        }

        .context-menu li:hover {
            background-color: #f0f0f0;
        }
    `;
    document.head.appendChild(style);

    // Create the button
    const button = document.createElement('button');
    button.className = 'custom-grade-button';

    // Add the icon to the button
    const icon = document.createElement('img');
    icon.src = 'https://ptpimg.me/xun121.png';
    icon.alt = 'Grade Sheet Icon';
    button.appendChild(icon);

    // Add the text to the button
    const buttonText = document.createTextNode('Open Grade Sheet');
    button.appendChild(buttonText);

    // Append button to the body
    document.body.appendChild(button);

    // Add click event to the button
    button.addEventListener('click', function () {
        const userId = prompt('Enter the Student ID:');
        if (userId) {
            openGradeSheetTab(userId.trim());
        }
    });

    // Function to fetch and rename the PDF
    async function fetchAndRenamePdf(url, userId) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error('Failed to fetch the PDF:', response.statusText);
                return;
            }
            const blob = await response.blob();
            console.log('PDF fetched successfully');

            // Load the PDF using PDF.js
            const pdfData = await blob.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
            console.log('PDF loaded successfully');

            let extractedName = "UNKNOWN";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const text = textContent.items.map(item => item.str).join(" ");
                const nameMatch = text.match(/Name:\s*([A-Z\s]+)/i);
                if (nameMatch) {
                    extractedName = nameMatch[1].trim().replace(/\s+/g, "_");
                    break;
                }
            }

            const newFileName = `Grade_sheet_${userId}_${extractedName}.pdf`;
            console.log('Renaming PDF to:', newFileName);

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = newFileName;
            link.click();
            console.log('PDF download initiated');
        } catch (error) {
            console.error('Error fetching or processing the PDF:', error);
        }
    }

    // Modify the existing openGradeSheetTab function
    function openGradeSheetTab(userId) {
        const baseUrl = 'https://usis.bracu.ac.bd/academia/docuJasper/index';
        const params = new URLSearchParams({
            studentId: userId,
            reportFormat: 'PDF',
            old_id_no: userId,
            strMessage: '',
            scholarProgramMsg: '',
            companyLogo: '/var/academia/image/universityLogo/1571986355.jpg',
            companyName: 'BRAC University',
            headerTitle: 'GRADE SHEET',
            companyAddress: '66, MOHAKHALI C/A, DHAKA - 1212.',
            academicStanding: 'Satisfactory',
            gradeSheetBackground: '/bits/usis/tomcat/webapps/academia/images/gradeSheetBackground.jpg',
            _format: 'PDF',
            _name: `Grade_sheet_${userId}`,
            _file: 'student/rptStudentGradeSheetForStudent.jasper'
        });

        const newUrl = `${baseUrl}?${params.toString()}`;
        console.log('Opening grade sheet URL:', newUrl);
        fetchAndRenamePdf(newUrl, userId);
    }

    // Create a context menu
    const contextMenu = document.createElement('ul');
    contextMenu.className = 'context-menu';

    // Function to update context menu options
    function updateContextMenu() {
        contextMenu.innerHTML = ''; // Clear existing items
        const options = [
            'Move Left',
            'Move Right',
            'Move Up',
            'Move Down',
            button.style.top === 'calc(100% - 70px)' ? 'Move to Top Right' : 'Move to Bottom Right',
            'Download Multiple Gradesheet'
        ];

        options.forEach(option => {
            const item = document.createElement('li');
            item.textContent = option;
            contextMenu.appendChild(item);

            // Add functionality for each menu item
            item.addEventListener('click', async () => {
                const currentTop = parseInt(button.style.top, 10) || 60;
                const currentRight = parseInt(button.style.right, 10) || 25;

                if (option === 'Download Multiple Gradesheet') {
                    const userIds = prompt('Enter Student IDs (comma-separated):');
                    if (userIds) {
                        const idsArray = userIds.split(',')
                            .map(id => id.trim())
                            .filter(id => id.length === 8 && /^\d+$/.test(id)); // Ensure valid 8-digit numeric IDs

                        for (const id of idsArray) {
                            await openGradeSheetTab(id);
                            await new Promise(resolve => setTimeout(resolve, 5000)); // Delay of 5 seconds
                        }
                    }
                    return;
                }

                switch (option) {
                    case 'Move Left':
                        button.style.right = `${currentRight + 5}px`;
                        break;
                    case 'Move Right':
                        button.style.right = `${currentRight - 5}px`;
                        break;
                    case 'Move Up':
                        button.style.top = `${currentTop - 5}px`;
                        break;
                    case 'Move Down':
                        button.style.top = `${currentTop + 5}px`;
                        break;
                    case 'Move to Bottom Right':
                        button.style.top = 'calc(100% - 70px)';
                        button.style.right = '10px';
                        break;
                    case 'Move to Top Right':
                        button.style.top = '60px';
                        button.style.right = '25px';
                        break;
                }
                contextMenu.style.display = 'none';
            });
        });
    }

    document.body.appendChild(contextMenu);

    // Right-click handler
    button.addEventListener('contextmenu', (e) => {
        e.preventDefault();

        updateContextMenu(); // Update options dynamically

        // Adjust context menu position to stay within the viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const menuWidth = 200; // Width of the context menu
        const menuHeight = contextMenu.children.length * 36; // Approximate height based on options

        let menuX = e.clientX;
        let menuY = e.clientY;

        if (menuX + menuWidth > viewportWidth) {
            menuX = viewportWidth - menuWidth - 10; // 10px padding
        }

        if (menuY + menuHeight > viewportHeight) {
            menuY = viewportHeight - menuHeight - 10; // 10px padding
        }

        contextMenu.style.top = `${menuY}px`;
        contextMenu.style.left = `${menuX}px`;
        contextMenu.style.display = 'block';
    });

    // Hide context menu on click elsewhere
    document.addEventListener('click', () => {
        contextMenu.style.display = 'none';
    });
})();