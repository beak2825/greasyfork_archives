// ==UserScript==
// @name         RSS Feed Reader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  A simple RSS feed reader in Violentmonkey menu with NewsBlur support/Lettore di feed rss direttamente nel browser
// @author       Magneto1
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/513339/RSS%20Feed%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/513339/RSS%20Feed%20Reader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funzione per recuperare e analizzare il feed RSS
    function fetchRSS(url) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                    const items = xmlDoc.getElementsByTagName("item");
                    let feedItems = [];

                    for (let i = 0; i < items.length; i++) {
                        const title = items[i].getElementsByTagName("title")[0].textContent;
                        const link = items[i].getElementsByTagName("link")[0].textContent;
                        feedItems.push({ title, link });
                    }

                    saveFeed(url, feedItems);
                } else {
                    console.error("Failed to fetch RSS feed");
                }
            }
        });
    }

    // Funzione per salvare il feed
    function saveFeed(url, feedItems) {
        let savedFeeds = GM_getValue("savedFeeds", {});
        savedFeeds[url] = feedItems;
        GM_setValue("savedFeeds", savedFeeds);
        alert("Feed salvato con successo!");
    }

    // Funzione per visualizzare i feed salvati
    function viewSavedFeeds() {
        let savedFeeds = GM_getValue("savedFeeds", {});
        let feedList = "Feed salvati:\n";

        for (let url in savedFeeds) {
            feedList += `${url}:\n`;
            savedFeeds[url].forEach(item => {
                feedList += ` - ${item.title} (${item.link})\n`;
            });
            feedList += "\n";
        }

        alert(feedList || "Nessun feed salvato.");
    }

    // Aggiungi un'opzione al menu di Violentmonkey
    GM_registerMenuCommand("Leggi Feed RSS", function() {
        const rssUrl = prompt("Inserisci l'URL del feed RSS:");
        if (rssUrl) {
            fetchRSS(rssUrl);
        }
    });

    GM_registerMenuCommand("Visualizza Feed Salvati", function() {
        viewSavedFeeds();
    });
})();
