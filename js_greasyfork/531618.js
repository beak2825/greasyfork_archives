// ==UserScript==
// @name         PDF RVZ
// @namespace    http://tampermonkey.net/
// @license MIT
// @version 2
// @description  PDF Rvz
// @author       You
// @match        https://rivezli.tn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/531618/PDF%20RVZ.user.js
// @updateURL https://update.greasyfork.org/scripts/531618/PDF%20RVZ.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fetchPDFs() {
        const urlParts = window.location.pathname.split('/');
        const courseId = urlParts[2];
        const chapterId = urlParts[3];

        if (!courseId || !chapterId) return;

        const apiUrl = `https://rivezli-new-prod-v2prod-back-cours.uy0eie.easypanel.host/api/course/get_chapter_shared/${courseId}/${chapterId}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    if (!data.chapterContent) return;

                    let container = document.getElementById('pdfContainer');
                    if (!container) {
                        container = document.createElement('div');
                        container.id = 'pdfContainer';
                        document.body.appendChild(container);

                        GM_addStyle(`
                            #pdfContainer {
                                position: fixed;
                                bottom: 10px;
                                right: 10px;
                                background: white;
                                padding: 15px;
                                border-radius: 8px;
                                border: 1px solid #ccc;
                                z-index: 1000;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                                width: auto;
                            }
                            .pdf-item {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 8px;
                                margin: 7px 0;
                                background: #f9f9f9;
                                border-radius: 5px;
                            }
                            .pdf-title {
                            margin-left: 10px;
                                flex-grow: 1;
                                font-size: 14px;
                                color: #333;
                                overflow: hidden;
                                white-space: nowrap;
                            }
                            .open-btn {
                                margin-left: 10px;
                                background: #007bff;
                                color: white;
                                border: none;
                                padding: 5px 10px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                            }
                            .open-btn:hover {
                                background: #0056b3;
                            }
                        `);
                    }

                    container.innerHTML = ''; // Clear previous buttons

                    data.chapterContent.forEach(item => {
                        if (item.contentType === 'pdf') {
                            const pdfItem = document.createElement('div');
                            pdfItem.className = 'pdf-item';

                            const title = document.createElement('span');
                            title.className = 'pdf-title';
                            title.textContent = item.pdfTitle;

                            const openBtn = document.createElement('button');
                            openBtn.className = 'open-btn';
                            openBtn.textContent = 'Open';
                            openBtn.onclick = () => window.open(item.pdfUrl, '_blank');

                            pdfItem.appendChild(title);
                            pdfItem.appendChild(openBtn);
                            container.appendChild(pdfItem);
                        }
                    });
                }
            }
        });
    }

    function checkURL() {
        if (window.location.href.includes('overview_chapter')) {
            fetchPDFs();
        } else {
            const container = document.getElementById('pdfContainer');
            if (container) container.remove();
        }
    }

    // Observe URL changes dynamically
    let lastUrl = window.location.href;
    const observer = new MutationObserver(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            checkURL();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    checkURL(); // Initial check
})();