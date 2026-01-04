// ==UserScript==
// @name         Copy Job Description
// @namespace    http://tampermonkey.net/
// @version      2024-06-13
// @description  Copy LinkedIn Job Description
// @author       You
// @match        https://www.linkedin.com/jobs/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504174/Copy%20Job%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/504174/Copy%20Job%20Description.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;
    const jobLink = `[Job Link](${currentUrl})`;
    const company = document.querySelector('.job-details-jobs-unified-top-card__company-name').innerText;
    const jobTitle = document.querySelector('.job-details-jobs-unified-top-card__job-title').innerText;
    const jobHeader = `## ${jobTitle} - ${company}`;

    const headingElement = document.querySelector('h2.text-heading-large');

    const removeEmptyLines = (input) => {
        return input.split('\n').filter(line => line.trim() !== '').join('\n');
    };

    const parseElementToMarkdown = (element) => {
        let markdownText = '';

        element.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                markdownText += child.textContent.trim();
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                switch (child.tagName.toLowerCase()) {
                    case 'strong':
                        markdownText += `**${child.textContent.trim()}**\n`;
                        break;
                    case 'li':
                        markdownText += `- ${child.textContent.trim()}\n`;
                        break;
                    default:
                        markdownText += parseElementToMarkdown(child) + '\n';
                        break;
                }
            }
        });

        return markdownText;
    };

    if (headingElement) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'space-between';

        headingElement.parentNode.insertBefore(container, headingElement);
        container.appendChild(headingElement);

        const button = document.createElement('button');
        button.innerText = 'copy job description';
        button.className = 'artdeco-button'; 
        button.style.marginLeft = '10px'; 

        button.addEventListener('click', () => {
            const descriptionContainer = document.querySelector('.jobs-description__content');

            if (descriptionContainer) {
                const mt4Element = descriptionContainer.querySelector('.mt4');

                if (mt4Element) {
                    let textToCopy = parseElementToMarkdown(mt4Element);

                    textToCopy = removeEmptyLines(textToCopy);

                    textToCopy = jobHeader + '\n' + jobLink + '\n' + textToCopy;

                    GM_setClipboard(textToCopy.trim(), { mimetype: 'text/plain' });
                    alert('Job description copied to clipboard!');
                } else {
                    alert('No mt4 element found in job description.');
                }
            } else {
                alert('No job description found.');
            }
        });

        container.appendChild(button);
    }
})();
