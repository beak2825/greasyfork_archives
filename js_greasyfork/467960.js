// ==UserScript==
// @name         Songpraise 'Copy for ProPresenter' button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A userscript that adds a 'Copy for ProPresenter' button to Songpraise - it adds 2 buttons: one for copying and another for re-adding the copy button if something goes wrong (fixed position on the page)
// @author       Tomi Olah
// @license      GNU GPLv3
// @match        https://www.songpraise.com/
// @icon         https://www.songpraise.com/favicon.ico
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/467960/Songpraise%20%27Copy%20for%20ProPresenter%27%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/467960/Songpraise%20%27Copy%20for%20ProPresenter%27%20button.meta.js
// ==/UserScript==

function getTitle() {
  const title = document.querySelector("div.title");
  return title;
}

// https://support.renewedvision.com/hc/en-us/articles/360011789393-How-do-I-import-plain-text-files-into-ProPresenter-
const transformSectionName = (name) => {
  return name
    .replaceAll(/I([0-9]*)/g, "Intro $1")
    .replaceAll(/V([0-9]*)/g, "Verse $1")
    .replaceAll(/PC([0-9]*)/g, "PreChorus $1")
    .replaceAll(/C([0-9]*)/g, "Chorus $1")
    .replaceAll(/B([0-9]*)/g, "Bridge $1")
    .replaceAll(/E([0-9]*)/g, "Ending $1")
    .trim();
};

function toProPresenterFormat(segments) {
  return segments.map((segment) => {
    const name = transformSectionName(segment.title);
    const lines = segment.lines.map((line) => line.trim()).join("\n");
    return `${name}\n${lines}`;
  });
}

const handleClick = (parent) => () => {
  const segmentsParent = parent.querySelector(
    "mat-card-content.mat-card-content"
  );
  if (!segmentsParent) {
    console.error("segmentsParent not found");
    return;
  }
  const segmentCards = segmentsParent.querySelectorAll("mat-card.mat-card");
  if (!segmentCards) {
    console.error("segmentCards not found");
    return;
  }
  const segments = Array.from(segmentCards)
    .filter((card) => card.childNodes[0].childNodes.length > 0)
    .map((card) => {
      const content = Array.from(card.childNodes[0].childNodes).filter(
        (node) => node.nodeName !== "#comment"
      );
      const title = content[0].innerText;
      const lines = content
        .slice(1)
        .map((node) => node.childNodes[0].innerText);
      return { title, lines };
    });
  const ppFormat = toProPresenterFormat(segments).join("\n\n");
  console.log("COPIED TO CLIPBOARD");
  console.log(ppFormat);
  navigator.clipboard.writeText(ppFormat);
};

function addCopyButton() {
  const title = getTitle();

  if (!title) {
    console.error("title not found");
    return;
  }

  const parent = title.parentNode;

  if (!parent) {
    console.error("parent not found");
    return;
  }

  if (Array.from(title.childNodes).some((node) => node.nodeName === "BUTTON")) {
    console.warn("button already added");
    return;
  }

  title.style.display = "flex";
  title.style.justifyContent = "space-between";
  title.style.alignItems = "center";

  const button = document.createElement("button");

  button.innerText = "Copy for ProPresenter";
  button.onclick = handleClick(parent);

  title.appendChild(button);
}

(function () {
  "use strict";
  addCopyButton();

  const adderBtn = document.createElement("button");
  adderBtn.innerText = "Add custom button";
  adderBtn.onclick = addCopyButton;
  adderBtn.style.position = "fixed";
  adderBtn.style.bottom = "0";
  adderBtn.style.right = "0";
  adderBtn.style.zIndex = "1000";
  adderBtn.style.margin = "20px";

  document.body.appendChild(adderBtn);
})();
