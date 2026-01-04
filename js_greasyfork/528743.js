// ==UserScript==
// @name         Google Search PDF & Switch Scholar
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a PDF tab to Google search results
// @author       Pencilheart
// @match        *://www.google.com/search*
// @match        *://scholar.google.com/scholar*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsPSJyZWQiIGQ9Ik0xMiAyMS4zNWwtMS40NS0xLjMyQzUuNCAxNS4zNiAyIDEyLjI4IDIgOC41IDIgNS40MiA0LjQyIDMgNy41IDNjMS43NCAwIDMuNDEuODEgNC41IDIuMDlDMTMuMDkgMy44MSAxNC43NiAzIDE2LjUgMyAxOS41OCAzIDIyIDUuNDIgMjIgOC41YzAgMy43OC0zLjQgNi44Ni04LjU1IDExLjU0TDEyIDIxLjM1eiIvPjwvc3ZnPg==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528743/Google%20Search%20PDF%20%20Switch%20Scholar.user.js
// @updateURL https://update.greasyfork.org/scripts/528743/Google%20Search%20PDF%20%20Switch%20Scholar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentURL = window.location.href;

    if (currentURL.includes("google.com/search")) {
        // Google 搜索页面
        const tabContainer = document.querySelector('.crJ18e');
        if (!tabContainer) return;

        const moreTab = [...tabContainer.querySelectorAll('div[role="listitem"]')]
            .find(tab => tab.textContent.trim() === '更多');

        if (!moreTab) return;

        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        if (!query) return;

        // PDF Tab
        if (!query.toLowerCase().includes("filetype:pdf")) {
            const pdfSearchUrl = `/search?q=${encodeURIComponent(query)}+filetype:pdf`;
            const pdfTab = document.createElement('div');
            pdfTab.setAttribute('role', 'listitem');
            pdfTab.innerHTML = `
                <a href="${pdfSearchUrl}" class="nPDzT T3FoJb">
                    <div class="YmvwI">PDF</div>
                </a>
            `;
            moreTab.insertAdjacentElement('beforebegin', pdfTab);
        }

        // Scholar Tab
        const scholarSearchUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
        const scholarTab = document.createElement('div');
        scholarTab.setAttribute('role', 'listitem');
        scholarTab.innerHTML = `
            <a href="${scholarSearchUrl}" class="nPDzT T3FoJb">
                <div class="YmvwI">Scholar</div>
            </a>
        `;
        moreTab.insertAdjacentElement('beforebegin', scholarTab);

    } else if (currentURL.includes("scholar.google.com/scholar")) {
        // Google Scholar 页面
        const tabContainer = document.querySelector('#gs_hdr_tsb'); // Scholar 页面顶部的导航栏
        if (!tabContainer) return;

        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        if (!query) return;

        // Google Search Tab
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        const googleTab = document.createElement('div');
        googleTab.style.display = "inline-block";
        googleTab.innerHTML = `
            <a href="${googleSearchUrl}" style="text-decoration: none; font-weight: bold; color: #1a0dab;">
                Google
            </a>
        `;

        // tabContainer.insertAdjacentElement('beforebegin', googleTab);

        // Modify gs_hdr_md layout and add Google button
        const gsHdrMd = document.querySelector('#gs_hdr_md');
        if (gsHdrMd) {
            gsHdrMd.style.display = 'flex';
            gsHdrMd.style.width = '100%';
            gsHdrMd.style.justifyContent = 'space-between';

            // Create a new container for the Google button in the second part
            const buttonContainer = document.createElement('div');
            buttonContainer.style.flex = '1';
            buttonContainer.style.textAlign = 'left';
            buttonContainer.style.display = 'flex'; // 使用flex布局
            buttonContainer.style.alignItems = 'center'; // 垂直居中

            const googleButton = document.createElement('button');
            googleButton.innerHTML = 'Google';
            googleButton.style.padding = '5px 10px';
            googleButton.style.fontSize = '14px';
            googleButton.style.cursor = 'pointer';
            googleButton.style.backgroundColor = '#357ae8';
            googleButton.style.color = '#fff';
            googleButton.style.border = 'none';
            googleButton.style.borderRadius = '4px';
            googleButton.addEventListener('click', function() {
                window.location.href = googleSearchUrl;  // Redirect to Google Search
            });

            buttonContainer.appendChild(googleButton);

            // Create the container for the original content (1/3 width)
            const originalContainer = document.createElement('div');
            originalContainer.style.flex = '2'; // Occupy 1/3 of the space

            // Move the original content into the new container
            originalContainer.innerHTML = gsHdrMd.innerHTML;
            gsHdrMd.innerHTML = ''; // Clear the original content
            gsHdrMd.appendChild(originalContainer);
            gsHdrMd.appendChild(buttonContainer); // Append the button container
        };
        // 让 Google Scholar 搜索框变长
        const searchForm = document.querySelector('#gs_hdr_frm');
        const searchBox = document.querySelector('#gs_hdr_tsi');

        if (searchForm && searchBox) {
            searchForm.style.width = '160%'; // 让搜索框容器占满可用空间
            searchBox.style.width = '1000px'; // 直接修改搜索框的宽度
            searchBox.style.maxWidth = '100%'; // 避免过长，保持响应式
        }


    }
})();
