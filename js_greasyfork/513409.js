// ==UserScript==
// @name         Teletype Article Downloader
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Downloading articles from Teletype.in in HTML
// @author       c0lbarator, Claude3.5 Sonnet
// @match        https://teletype.in/*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @connect      teletype.in
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513409/Teletype%20Article%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/513409/Teletype%20Article%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function for downloading article
    function downloadArticle(url, title) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    const blob = new Blob([response.responseText], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    // Creating temporary link element for downloading
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = title.toLowerCase() + '.html'; //name for html file
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a); // Removing link after downloading

                    URL.revokeObjectURL(url); // Freeing up memory
                    GM_log(`Downloaded: ${title}`);
                } else {
                    console.error(`Error in the downloading ${title}: status ${response.status}`);
                }
            }
        });
    }

    // Function for downloading all articles
    function downloadAllArticles() {
        const articleLinks = document.querySelectorAll('a.blogArticleCut');
        const links = Array.from(articleLinks).map(link => ({
            url: link.href,
            title: link.querySelector('.blogArticleCut__title').innerText.trim()
        }));

        console.log(`${links.length} articles found for download.`);
        links.forEach(article => {
            console.log(`Downloading article: ${article.title} from ${article.url}`);
            downloadArticle(article.url, article.title);
        });
    }

    // Button for downloading all articles
    const downloadButton = document.createElement('button');
    downloadButton.innerText = 'Download all articles';
    downloadButton.style.position = 'fixed';
    downloadButton.style.bottom = '20px';
    downloadButton.style.right = '20px';
    downloadButton.style.zIndex = '1000';
    downloadButton.style.padding = '10px';
    downloadButton.style.backgroundColor = '#28a745';
    downloadButton.style.color = '#fff';
    downloadButton.style.border = 'none';
    downloadButton.style.borderRadius = '5px';
    downloadButton.style.cursor = 'pointer';

    downloadButton.onclick = downloadAllArticles;
    document.body.appendChild(downloadButton);
})();
