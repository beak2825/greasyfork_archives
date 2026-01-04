// ==UserScript==
// @name         ChatGPT 代码预览助手 - Code Previewer for ChatGPT
// @namespace    http://xyde.net.cn
// @version      1.5
// @description  Preview HTML code on chatgpt.com by adding an iframe below code blocks with class 'language-html'. Allows downloading of the HTML preview.
// @author       You
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500687/ChatGPT%20%E4%BB%A3%E7%A0%81%E9%A2%84%E8%A7%88%E5%8A%A9%E6%89%8B%20-%20Code%20Previewer%20for%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/500687/ChatGPT%20%E4%BB%A3%E7%A0%81%E9%A2%84%E8%A7%88%E5%8A%A9%E6%89%8B%20-%20Code%20Previewer%20for%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create preview container
    function createPreviewContainer(htmlCode, id) {
        // Create container div
        const container = document.createElement('div');
        container.style.border = '1px solid #ddd';
        container.style.borderRadius = '5px';
        container.style.marginTop = '10px';
        container.style.padding = '10px';
        container.style.backgroundColor = '#f9f9f9';
        container.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        container.style.position = 'relative'; // Ensure relative positioning
        container.id = 'container-' + id;

        // Create title
        const title = document.createElement('div');
        title.textContent = 'HTML Code Preview 网页代码预览';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '10px';
        title.style.textAlign = 'center';

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.className = 'html-preview-iframe';
        iframe.style.width = '100%';
        iframe.style.height = '300px';
        iframe.style.border = 'none';
        iframe.id = 'code-preview-' + id;

        // Wait for iframe to load before setting content
        iframe.onload = function() {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.open();
            doc.write(htmlCode);
            doc.close();
        };

        // Create download button
        const downloadButton = document.createElement('a');
        downloadButton.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlCode);
        downloadButton.download = 'preview.html';
        downloadButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style="position: absolute; top: 5px; right: 5px; cursor: pointer;">
        <path d="M12 15.41l6.29-6.29 1.41 1.41L12 18.23 4.3 10.12l1.41-1.41z"/>
    </svg>
`;
        downloadButton.style.position = 'absolute';
        downloadButton.style.top = '5px';
        downloadButton.style.right = '5px';
        downloadButton.style.cursor = 'pointer';


        // Append title, iframe, and download button to container
        container.appendChild(title);
        container.appendChild(downloadButton);
        container.appendChild(iframe);

        return container;
    }

    // Function to find and process code elements
    function processCodeElements() {
        // Find all code elements with class 'language-html'
        const codeElements = document.querySelectorAll('code.language-html');

        // Iterate through each code element
        codeElements.forEach(codeElement => {
            // Check if it has already been processed
            if (codeElement.dataset.previewed){
                if(new Date().getSeconds() % 5 != 0){
                    return;
                }
                let iframeToRemove = document.querySelector("#container-" + codeElement.dataset.id);
                iframeToRemove.parentNode.removeChild(iframeToRemove);
            }

            // Mark as previewed
            codeElement.dataset.previewed = true;

            codeElement.dataset.id = Math.ceil(Math.random()*100000);

            // Get parent element of code block
            const parentElement = codeElement.closest('.flex-col');

            // Create a preview container
            const previewContainer = createPreviewContainer(codeElement.textContent, codeElement.dataset.id);

            // Insert container below the code element
            parentElement.appendChild(previewContainer);
        });
    }

    // Run processCodeElements initially and then every 3 seconds
    processCodeElements();
    setInterval(processCodeElements, 3000);
})();
