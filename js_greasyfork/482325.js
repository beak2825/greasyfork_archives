// ==UserScript==
// @name        Naurok Bypass v2: Extras
// @description Companion userscript for naurok bypass; Contains unstable and unfinished features and enhancements for the Testing pages.
// @author      griffi-gh
// @namespace   griffi-gh
// @match       https://naurok.com.ua/test/testing/*
// @grant       none
// @grant       GM_addStyle
// @version     0.3
// @run-at      document-idle
// @inject-into page
// @sandbox     DOM
// @connect     naurok.com.ua
// @icon        https://play-lh.googleusercontent.com/scIkpmsUJTfDbV39X0rb-AvxbgxOrpa9zIGJQqDHP1VbuBTmortXomSSWVZnpErwyA=w480-h960
// @downloadURL https://update.greasyfork.org/scripts/482325/Naurok%20Bypass%20v2%3A%20Extras.user.js
// @updateURL https://update.greasyfork.org/scripts/482325/Naurok%20Bypass%20v2%3A%20Extras.meta.js
// ==/UserScript==

"use strict";

let session_info;

async function loadSessionInfo() {
  //Get session ID
  const session_id = document.querySelector(`[ng-app="testik"]`).getAttribute("ng-init").match(/[0-9]+/g)[1];
  console.log("Session id: ", session_id);

  //Get session info from API
  session_info = await fetch(`https://naurok.com.ua/api2/test/sessions/${session_id}`, {
    credentials: "include",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
  }).then(x => x.json());
  console.log("Session info: ", session_info);
}

function displayUi() {
  //Add test name to the page
  const testContainer = document.querySelector('.test-container')

  const infoNode = document.createElement("div");
  infoNode.classList.add("x-test-info");
  testContainer.insertBefore(infoNode, testContainer.firstChild);

  const nameNode = document.createElement("div");
  nameNode.classList.add("x-test-name");
  infoNode.append(nameNode);
  nameNode.textContent = `${session_info.settings.name}`;

  const buttonsNode = document.createElement("div");
  buttonsNode.classList.add("x-button-container");
  infoNode.append(buttonsNode);

  let xButton

  xButton = document.createElement("a");
  buttonsNode.append(xButton);
  xButton.classList.add("x-button");
  xButton.textContent = "Результати інших учнів";
  xButton.href = `https://naurok.com.ua/test/homework/${session_info.settings.id}/detailed-export/score`;

  xButton = document.createElement("a");
  buttonsNode.append(xButton);
  xButton.classList.add("x-button");
  xButton.textContent = "Наступні питання";
  xButton.href = `javascript:alert("TODO")`;

}

function applyStyles() {
  let styleCss = `
    /* allow selection */
    * {
      -webkit-user-select: unset !important;
      -webkit-touch-callout: unset !important;
      -moz-user-select: unset !important;
      -ms-user-select: unset !important;
      user-select: unset !important;
    }

    /* style our own ui */
    .test-container {
      display: flex !important;
      flex-direction: row !important;
    }
    .test-container > :last-child {
      flex-grow: 1 !important;
    }

    .x-test-info {
      background: white;
      border-radius: 1rem;
      max-width: 20vw;
      min-width: 200px;
      margin: 1rem;
      padding: 1rem;
      box-shadow: 0 0 .5rem rgba(0,0,0,.5);
      overflow: hidden;
      position: absolute;
      z-index: 999;
      height: 100%;
      transition: transform 1s, opacity .5s;
      transform: translateZ(1px);
    }

    .x-test-info:not(:hover) {
      transform: rotate(5deg) translateX(-100%) translateX(-10px) scaleY(.95) skewX(-1deg) skewY(-1deg) translateZ(1px);
      opacity: .6;
    }

    .dyslexia .x-test-info {
      background: #fafac8;
    }

    .x-test-name {
      margin: -1rem;
      margin-bottom: 1rem;
      padding: 1rem;
      background: #40596b;
      color: white;
    }

    .dyslexia .x-test-name {
      background: #dadaa8;
      color: black;
    }

    .x-button-container {
      display: flex;
      flex-direction: column;
      gap: .5rem;
    }

    .x-button {
      display: block;
      appearance: button;
      text-decoration: none;
      text-align: center;
      background-color: #f7cdcd;
      padding: 1rem 2rem;
      color: black;
      border-radius: .33rem;
      font-size: 1.5rem;
    }

    .x-button:hover {
      text-decoration: inherit;
      color: inherit;
    }

    .dyslexia .x-button {
      background: #dadaa8;
    }
  `;

  //use layer if possible on newer browsers to override important
  styleCss = `
    ${ styleCss }
    @layer { ${styleCss} }
  `;

  //add css to page, using GM_addStyle if possible
  if (window.GM_addStyle) {
    window.GM_addStyle(styleCss);
  } else {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = styleCss;
    document.querySelector("head").append(styleElement);
  }
}

async function main() {
  applyStyles();
  loadSessionInfo().then(() => {
    displayUi();
  });
}

main();
