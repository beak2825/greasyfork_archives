// ==UserScript==
// @name         金融研訓院證照試題下載
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  將PDF連結轉換為直接下載，並依考試種類、屆數命名檔案
// @author       Your Name
// @match        https://www.tabf.org.tw/LicenseHistoryExam.aspx?PHID=*
// @icon         https://www.google.com/s2/favicons?domain=tabf.org.tw
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521947/%E9%87%91%E8%9E%8D%E7%A0%94%E8%A8%93%E9%99%A2%E8%AD%89%E7%85%A7%E8%A9%A6%E9%A1%8C%E4%B8%8B%E8%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521947/%E9%87%91%E8%9E%8D%E7%A0%94%E8%A8%93%E9%99%A2%E8%AD%89%E7%85%A7%E8%A9%A6%E9%A1%8C%E4%B8%8B%E8%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Current page URL
    const currentURL = window.location.href;

    // Select the specific container holding the PDF links
    const container = document.querySelector('ul.ul');

    if (container) {
        // Get all anchor tags within the container
        const links = container.querySelectorAll('a');

        // Find the exam type based on the title and href matching current URL
        let examType = '';
        const allTitles = document.querySelectorAll('a[title]');
        allTitles.forEach(titleLink => {
            const href = titleLink.getAttribute('href');
            if (href && currentURL.includes(href)) {
                examType = titleLink.getAttribute('title') || '';
            }
        });

        // Remove "試題" from the exam type if present
        examType = examType.replace(/試題/, '');

        links.forEach(link => {
            const href = link.getAttribute('href');
            const title = link.getAttribute('title');

            // Check if the link ends with ".pdf"
            if (href && href.endsWith('.pdf') && title) {
                // Extract the subject name from the title attribute
                const subjectMatch = title.match(/點擊下載檔案：(.*)\.pdf/);
                let subjectName = subjectMatch ? subjectMatch[1] : '下載';

                // Remove "試題" from the subject name if present
                subjectName = subjectName.replace(/試題/, '');

                // Create a download button
                const button = document.createElement('button');
                button.textContent = subjectName;
                button.style.margin = '5px auto'; // Center align
                button.style.padding = '10px';
                button.style.cursor = 'pointer';
                button.style.border = 'none';            // No border
                button.style.borderRadius = '5px';       // Rounded corners
                button.style.boxShadow = '0px 2px 5px rgba(0,0,0,0.3)'; // Shadow effect
                button.style.fontSize = '14px';          // Adjust font size
                button.style.display = 'block';          // Ensure block-level for centering
                button.style.textAlign = 'center';

                // Add a tooltip to the button
                button.title = '點擊下載 PDF 檔案';

                // Set up the button to download the file
                button.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent default link behavior

                    // Combine exam type and subject name for the file name
                    const fileName = examType ? `${examType}${subjectName}.pdf` : `${subjectName}.pdf`;
                    GM_download(href, fileName);
                });

                // Insert the button after the link
                link.parentNode.insertBefore(button, link.nextSibling);

                // Optionally hide the original link
                link.style.display = 'none';
            }
        });
    }
})();
