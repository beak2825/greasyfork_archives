// ==UserScript==
// @name               AtCoder Copy Contest ID
// @name:ja            AtCoder Copy Contest ID
// @namespace          https://github.com/xe-o
// @version            0.4
// @description        Add a button to copy the contest ID to the clipboard in AtCoder contest pages
// @description:ja     AtCoderコンテストページのナビゲーションバーへ、コンテストIDをコピーするためのボタンを追加します
// @author             XERO
// @license            MIT
// @match              https://atcoder.jp/*
// @grant              GM_setClipboard
// @run-at             document-idle
// @downloadURL https://update.greasyfork.org/scripts/463842/AtCoder%20Copy%20Contest%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/463842/AtCoder%20Copy%20Contest%20ID.meta.js
// ==/UserScript==

const INIT_LABEL = "Copy Contest ID";
const COPIED_LABEL = "Copied!";
const FAILED_LABEL = "Failed to copy";
const ICONS = {
  COPY: "glyphicon-copy",
  OK: "glyphicon-ok",
  REMOVE: "glyphicon-remove",
};

const copyContestId = () => {
  const $ = (selector, baseElement = document) =>
    baseElement.querySelector(selector);
  const getContestId = () => window.location.pathname.split("/")[2];
  const navbar = $(".navbar-nav");
  const style = document.createElement("style");
  style.innerHTML = `
    @media (max-width: 991px) {
      .contest-title {
        width: auto;
      }
    }
    @media (max-width: 1150px) {
      .contest-title {
        width: auto;
        max-width: 580px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      #copy-button-text {
        display: none;
      }
    }
    @media (max-width: 1000px) {
      .contest-title {
        width: auto;
        max-width: 300px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    @media (max-width: 767px) {
      .contest-title {
        width: auto;
        max-width: none;
      }
      #copy-button-text {
        display: inline;
      }
    }

    .header-nav .j-menu_gnav a {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  `;

  const addCopyButton = () => {
    if (!navbar) {
      console.error("Failed to find navbar element.");
      return;
    }
    navbar.insertAdjacentHTML(
      "beforeend",
      `
      <li>
        <a id="copy-contest-id-button" style="cursor: pointer; font-size: 12px">
          <span class="glyphicon ${ICONS.COPY}" style="margin-right: 2px" aria-hidden="true"></span>
          <span id="copy-button-text">${INIT_LABEL}</span>
        </a>
      </li>
    `
    );
  };

  const setupCopyButton = () => {
    const button = $("#copy-contest-id-button");
    const icon = $(".glyphicon", button);
    const label = $("#copy-button-text");
    let isCopying = false;

    const resetButton = () => {
      icon.classList.replace(ICONS.OK, ICONS.COPY, ICONS.REMOVE);
      label.textContent = INIT_LABEL;
      isCopying = false;
    };

    const copyToClipboard = async () => {
      if (isCopying) return;
      isCopying = true;

      try {
        await GM_setClipboard(getContestId(), {
          type: "text",
          mimetype: "text/plain",
        });
        icon.classList.replace(ICONS.COPY, ICONS.OK);
        label.textContent = COPIED_LABEL;
      } catch (error) {
        console.error(`Failed to copy contest ID: ${error}`);
        icon.classList.replace(ICONS.COPY, ICONS.REMOVE);
        label.textContent = FAILED_LABEL;
      } finally {
        setTimeout(resetButton, 1800);
      }
    };

    button.addEventListener("click", copyToClipboard);
  };

  document.head.appendChild(style);
  addCopyButton();
  setupCopyButton();
};

copyContestId();
