// ==UserScript==
// @name         PHP Documentation Sidebar
// @namespace    https://www.php.net/
// @version      1.2
// @description  Add a sidebar to documentation pages on https://www.php.net/ to navigate through headers.
// @author       Yi Wang
// @match        https://www.php.net/manual/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510216/PHP%20Documentation%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/510216/PHP%20Documentation%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the sidebar
    const sidebar = document.createElement('div');
    sidebar.style.position = 'fixed';
    sidebar.style.left = '0';
    sidebar.style.top = '60px';
    sidebar.style.width = '200px';
    sidebar.style.height = 'calc(100% - 60px)';
    sidebar.style.overflowY = 'auto';
    sidebar.style.backgroundColor = '#f9f9f9';
    sidebar.style.padding = '10px';
    sidebar.style.borderRight = '1px solid #ccc';
    sidebar.style.zIndex = '1000';

    // Find all headers
    const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    headers.forEach(header => {
        // Ensure each header has an ID for linking
        if (!header.id) {
            header.id = 'header-' + Math.random().toString(36).substr(2, 9);
        }

        // Create a link for each header
        const link = document.createElement('a');
        link.href = '#' + header.id;
        link.textContent = header.textContent.replace('¶', '').trim();
        link.style.display = 'block';
        link.style.marginBottom = '5px';
        link.style.textDecoration = 'none';
        link.style.color = 'purple';

        // Add indentation based on header level
        const level = parseInt(header.tagName.substring(1), 10);
        link.style.paddingLeft = (level - 1) * 10 + 'px';

        sidebar.appendChild(link);
    });

    document.body.appendChild(sidebar);

    // Adjust the main layout to accommodate the sidebar
    document.body.style.marginLeft = '210px';

})();