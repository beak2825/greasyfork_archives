// ==UserScript==
// @name         TVDB / SensCritique quick search
// @namespace    tvdb-sc-quick-search
// @version      0.3.1
// @description  Adds a shortcut button on TVDB pages to search in SensCritique database (admin only).
// @author       ewauq
// @match        https://thetvdb.com/series/*
// @icon         https://thetvdb.com/images/icon.png
// @downloadURL https://update.greasyfork.org/scripts/391508/TVDB%20%20SensCritique%20quick%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/391508/TVDB%20%20SensCritique%20quick%20search.meta.js
// ==/UserScript==


;(function () {
  'use strict'
    const tvdbId = document.querySelector("#series_basic_info li:first-child span")?.textContent;
    if (!tvdbId) return

    const queryUrl = `https://admin.senscritique.com/queries/view/1734/${tvdbId}`;

    const ToolBox = document.querySelector(".page-toolbox");
    const QuickSearchButton = document.createElement('a');
    QuickSearchButton.innerHTML = "Rechercher sur SC"
    QuickSearchButton.href = queryUrl;
    QuickSearchButton.target = "_blank";
    QuickSearchButton.classList.add("btn");
    QuickSearchButton.style.backgroundColor = "#007fff";
    QuickSearchButton.style.color = "#FFFFFF";
    QuickSearchButton.style.fontWeight = "normal";

    ToolBox.prepend(QuickSearchButton);
})();