// ==UserScript==
// @name         Copy Branch and Commit SHA
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Copies the project name, branch and latest commit.
// @author       Konstantin
// @match        https://gitlab.dopamine.bg/games/*
// @icon         https://www.google.com/s2/favicons?domain=dopamine.bg
// @grant        none
// @license      MIT 
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/431104/Copy%20Branch%20and%20Commit%20SHA.user.js
// @updateURL https://update.greasyfork.org/scripts/431104/Copy%20Branch%20and%20Commit%20SHA.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

const styles = `
#snackbar {
  visibility: hidden;
  min-width: 250px;
  margin-left: -125px;
  background-color: #292961;
  color: #fff;
  text-align: center;
  padding: 12px;
  position: fixed;
  z-index: 1;
  left: 50%;
  bottom: 30px;
  border-radius: 5px;
}

#snackbar.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.4s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@-webkit-keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}
`;

const SELECTORS = {
  buttons: "div.gl-ml-4.js-commit-sha-group.btn-group",
  gameTitle: ".sidebar-context-title",
  commit: "div.commit-content.qa-commit-content > a",
  commitSha: "div.gl-ml-4.js-commit-sha-group.btn-group > span",
  branch: "div.tree-ref-container.gl-display-flex.mb-2.mb-md-0 > div > form > div > button",
};

function copyInfo() {
  const branchUrl = window.location.href;
  const branchName = document.querySelector(SELECTORS.branch).dataset.selected;
  const commitSha = document.querySelector(SELECTORS.commitSha).textContent;
  const commitUrl = document.querySelector(SELECTORS.commit).href;
  const projectTitle = document.querySelector(SELECTORS.gameTitle).textContent.trim();

  const result = `*${projectTitle}:* [${branchName}|${branchUrl}] # [${commitSha}|${commitUrl}]`;

  navigator.clipboard.writeText(result);
  showSnackbar();
}

function showSnackbar() {
  const snackbar = document.getElementById("snackbar");

  snackbar.classList.add('show');

  setTimeout(() => {
    snackbar.classList.remove('show');
  }, 3000);
}

let buttonGroup = document.querySelector(SELECTORS.buttons);

function addElements() {
  const styleSheet = document.createElement("style");

  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  const button = document.createElement('button');

  button.textContent = 'Copy';
  button.classList.add('gl-button', 'btn', 'btn-confirm');
  button.onclick = copyInfo;
  button.title = "Copy Branch and Commit";
  buttonGroup.appendChild(button);

  const snackbar = document.createElement('div');

  snackbar.textContent = "Copied Branch and Commit!";
  snackbar.id = 'snackbar';
  document.body.appendChild(snackbar);
}

const loadInterval = setInterval(() => {
  if (buttonGroup) {
    addElements();
    clearInterval(loadInterval);

    return;
  }

  buttonGroup = document.querySelector(SELECTORS.buttons);
}, 200);