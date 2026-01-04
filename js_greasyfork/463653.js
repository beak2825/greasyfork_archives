// ==UserScript==
// @name         AtCoder Companions Quick Jump
// @namespace    https://github.com/ryoryon66
// @version      0.2
// @description  AtCoder CompanionsでCompanionsを探すためのボタンを提出画面に追加します。
// @author       ryoryon66
// @match        https://atcoder.jp/contests/*/submissions/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463653/AtCoder%20Companions%20Quick%20Jump.user.js
// @updateURL https://update.greasyfork.org/scripts/463653/AtCoder%20Companions%20Quick%20Jump.meta.js
// ==/UserScript==



function redirectToCompanions() {
  const urlPattern = /^https:\/\/atcoder\.jp\/contests\/([a-zA-Z0-9-]+)\/submissions\/(\d+)$/;
  const matches = window.location.href.match(urlPattern);

  if (matches) {
    const contest = matches[1];
    const submissionId = matches[2];
    const url = `https://atcoder-companions.kakira.dev/?c=${contest}&sid=${submissionId}`;
    window.location.href = url;
  }
}

function addRedirectButton() {
  const urlPattern = /^https:\/\/atcoder\.jp\/contests\/([a-zA-Z0-9-]+)\/submissions\/(\d+)$/;
  const matches = window.location.href.match(urlPattern);

  if (matches) {
    const button = document.createElement("button");
    button.innerText = "See Companions";
    button.onclick = redirectToCompanions;
    button.style.cursor = "pointer";
    button.style.width = "70%";
    button.style.height = "40px";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.backgroundColor = "#4CAF50";
    button.style.color = "white";
    button.style.fontWeight = "bold";
    button.style.fontSize = "16px";
    button.style.marginTop = "10px";
    button.style.marginBottom = "20px";

    const sibling = document.querySelector("#contest-nav-tabs").nextElementSibling;
    if (sibling) {
      const container = document.createElement("div");
      container.style.textAlign = "center";
      container.appendChild(button);
      sibling.insertBefore(container, sibling.firstElementChild);
    }
  }
}

addRedirectButton();