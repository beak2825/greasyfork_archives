// ==UserScript==
// @name        ArkhamDB: "Open in arkham.build" button for decks
// @namespace   Violentmonkey Scripts
// @match       https://*.arkhamdb.com/decklist/view/*
// @match       https://*.arkhamdb.com/deck/view/*
// @grant       none
// @version     1.2
// @author      @hiflix
// @description 11/25/2024, 12:02:21 PM
// @downloadURL https://update.greasyfork.org/scripts/518790/ArkhamDB%3A%20%22Open%20in%20arkhambuild%22%20button%20for%20decks.user.js
// @updateURL https://update.greasyfork.org/scripts/518790/ArkhamDB%3A%20%22Open%20in%20arkhambuild%22%20button%20for%20decks.meta.js
// ==/UserScript==

init();

function init() {
  const targetNode =
    document.querySelector("a[href^='/deck/copy']") ??
    document.querySelector("#btn-print");

  if (!targetNode) return;

  const path = window.location.href.split("arkhamdb.com")[1];

  const isSmall = path.includes("/decklist/");

  const linkNode = htmlFromString(`
    <a class="btn btn-default${isSmall ? " btn-sm" : ""}" href="https://arkham.build${path}" target="_blank" rel="noreferrer nofollow"${!isSmall ? " style='margin-right: 4px'" : ""}>
      <span class="fa fa-external-link"></span> arkham.build
    </a>
  `);

  targetNode.insertAdjacentElement("beforeBegin", linkNode);
}

function htmlFromString(html) {
  const template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}
