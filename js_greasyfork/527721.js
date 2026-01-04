// ==UserScript==
// @name         GGn Recently Updated Articles Fix
// @namespace    https://gazellegames.net/
// @version      1.0
// @license      MIT
// @description  Updates the "Recently Updated Articles" section on GGn Wiki to be as long as you want.
// @author       SleepingGiant
// @match        https://gazellegames.net/wiki.php
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527721/GGn%20Recently%20Updated%20Articles%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/527721/GGn%20Recently%20Updated%20Articles%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WIKI_BROWSE_URL = "https://gazellegames.net/wiki.php?action=browse";
    const DEFAULT_ARTICLE_COUNT = GM_getValue("articleCount", 10);

    function getTargetBox() {
        return [...document.querySelectorAll(".box")].find(box => {
            let header = box.querySelector(".head");
            return header && header.textContent.trim() === "Recently Updated Articles";
        })?.querySelector(".body ol.navigation_list");
    }

    function fetchArticles() {
        GM_xmlhttpRequest({
            method: "GET",
            url: WIKI_BROWSE_URL,
            onload: function(response) {
                if (response.status === 200) {
                    updateRecentlyUpdatedArticles(parseArticles(response.responseText));
                }
            }
        });
    }

    function parseArticles(html) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");
        let rows = [...doc.querySelectorAll("table tbody tr:not(.colhead)")];

        return rows.map(row => {
            let link = row.querySelector("td:nth-child(1) a");
            let date = row.querySelector("td:nth-child(2)").textContent.trim();
            return { title: link.textContent.trim(), href: link.getAttribute("href"), date: date };
        }).sort((a, b) => b.date.localeCompare(a.date));
    }

    function updateRecentlyUpdatedArticles(articles) {
        let count = GM_getValue("articleCount", DEFAULT_ARTICLE_COUNT);
        let recentArticles = articles.slice(0, count);
        let container = getTargetBox();
        if (container) {
            container.innerHTML = "";
            recentArticles.forEach(article => {
                let li = document.createElement("li");
                let a = document.createElement("a");
                a.href = article.href;
                a.textContent = article.title;
                li.appendChild(a);
                container.appendChild(li);
            });
        }
    }

    function addSettingsBox() {
        let settingsDiv = document.createElement("div");
        settingsDiv.style.marginTop = "10px";
        settingsDiv.innerHTML = `
            <label for="articleCount">Number of articles: </label>
            <input type="number" id="articleCount" value="${GM_getValue("articleCount", DEFAULT_ARTICLE_COUNT)}" min="1" style="width: 50px;">
            <button id="saveArticleCount">Save</button>
        `;

        let targetBox = getTargetBox();
        if (targetBox) {
            targetBox.appendChild(settingsDiv);
        }

        document.getElementById("saveArticleCount").addEventListener("click", () => {
            let count = parseInt(document.getElementById("articleCount").value, 10);
            GM_setValue("articleCount", count);
            fetchArticles();
        });
    }

    fetchArticles();
    setTimeout(addSettingsBox, 2000);
})();

