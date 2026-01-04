// ==UserScript==
// @name         Copy Access String
// @namespace    https://github.com/ecklf
// @version      0.2
// @description  Copies Access String to Clipboard
// @author       ecklf
// @icon         https://app.airplane.dev/favicon.ico
// @match        https://app.airplane.dev/*
// @match        https://cosmos.azure.com/
// @grant        GM_notification
// @grant        GM.setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442721/Copy%20Access%20String.user.js
// @updateURL https://update.greasyfork.org/scripts/442721/Copy%20Access%20String.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      onUrlChange();
    }
  }).observe(document, { subtree: true, childList: true });

  function clickElement(el) {
    const clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", true, true);
    el.dispatchEvent(clickEvent);
  }

  function addButton() {
    let button = document.createElement("button");
    button.setAttribute("id", "copyButton");
    button.innerHTML = "Copy → Cosmos";
    GM_addStyle(`
        #copyButton {
            position: fixed;
            bottom: 3%;
            right: 3%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.5rem;
            --tw-bg-opacity: 1;
            background-color: rgb(15 23 42 / var(--tw-bg-opacity));
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
            padding-left: 1rem;
            padding-right: 1rem;
            font-size: 0.875rem;
            line-height: 1.25rem;
            font-weight: 600;
            --tw-text-opacity: 1;
            color: rgb(255 255 255 / var(--tw-text-opacity));
        }
        #copyButton:hover {
            --tw-bg-opacity: 1;
            background-color: rgb(51 65 85 / var(--tw-bg-opacity));
        }
    `);

    button.onclick = () => {
      window.navigator.clipboard
        .writeText(
          document
            .getElementsByTagName("table")[0]
            .tBodies[0].outerText.split("\n")[1]
        )
        .then(() => window.open("https://cosmos.azure.com/"));
    };

    document.body.appendChild(button);
  }

  function onUrlChange() {
    if (location.href.includes("https://app.airplane.dev/runs")) {
      addButton();
    } else {
      document.getElementById("copyButton").remove();
    }
    if (location.href.includes("https://cosmos.azure.com")) {
      window.navigator.clipboard.readText().then((data) => {
        if (data.includes("AccountEndpoint=")) {
          clickElement(
            document.getElementsByClassName("switchConnectTypeText")[0]
          );
          const inputEl = document.getElementsByClassName("inputToken")[0];
          inputEl.focus();
        }
      });
    }
  }

  if (location.href.includes("https://app.airplane.dev/runs")) {
    addButton();
  }

  if (location.href.includes("https://cosmos.azure.com")) {
    window.navigator.clipboard.readText().then((data) => {
      if (data.includes("AccountEndpoint=")) {
        clickElement(
          document.getElementsByClassName("switchConnectTypeText")[0]
        );
        const inputEl = document.getElementsByClassName("inputToken")[0];
        inputEl.focus();
      }
    });
  }
})();