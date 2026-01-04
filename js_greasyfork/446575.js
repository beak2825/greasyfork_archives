// ==UserScript==
// @name         Google Knowledge Graph +Wiki
// @namespace    https://greasyfork.org/users/21515
// @version      0.1.0
// @description  Add Wikipedia back to Google Knowledge Graph
// @author       CennoxX
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[New%20Userscript]%20
// @match        https://www.google.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446575/Google%20Knowledge%20Graph%20%2BWiki.user.js
// @updateURL https://update.greasyfork.org/scripts/446575/Google%20Knowledge%20Graph%20%2BWiki.meta.js
// ==/UserScript==
/* jshint esversion: 10 */
/* eslint quotes: ["warn", "double", {"avoidEscape": true}] */
/* eslint curly: "off" */

(function() {
    "use strict";
    document.querySelector('#rhs [data-t="kno-desc-sh"]')?.click();
    var knowledgeGraph = document.querySelector("#rhs .kno-rdesc");
    if (!knowledgeGraph) return;
    var wikiLink = document.querySelector(".kno-rdesc > span > a");
    if (wikiLink && wikiLink.innerHTML == "Wikipedia") return;
    var newLink = document.createElement("a");
    var wikiLinks = [...document.querySelectorAll("a h3")].map(i => i.parentElement.href).filter(i => i.match(/https:\/\/\w+\.wikipedia\.org.*/));
    if (!wikiLinks.length) return;
    knowledgeGraph.click();
    newLink.href = wikiLinks[0];
    newLink.innerHTML = "Wikipedia";
    knowledgeGraph.parentElement.appendChild(newLink);
})();