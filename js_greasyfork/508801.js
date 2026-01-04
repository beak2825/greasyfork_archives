// ==UserScript==
// @name         Jira Cloud: Copy suggested Git branch name to Clipboard
// @version      1.1
// @description  Adds a button to Jira Cloud that copies the suggested Git branch name to the clipboard.
// @author       rasmusbe
// @license      MIT
// @match        https://*.atlassian.net/jira/software/projects/*/boards/*
// @match        https://*.atlassian.net/browse/*
// @namespace    rasmusbe/jirabranch
// @downloadURL https://update.greasyfork.org/scripts/508801/Jira%20Cloud%3A%20Copy%20suggested%20Git%20branch%20name%20to%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/508801/Jira%20Cloud%3A%20Copy%20suggested%20Git%20branch%20name%20to%20Clipboard.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const branchIcon = new Image();
  branchIcon.src =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KDTwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIEdlbmVyYXRvcjogU1ZHIFJlcG8gTWl4ZXIgVG9vbHMgLS0+Cjxzdmcgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIDAgNDggNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQogIDx0aXRsZT5icmFuY2g8L3RpdGxlPg0KICA8ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIj4NCiAgICA8ZyBpZD0iaW52aXNpYmxlX2JveCIgZGF0YS1uYW1lPSJpbnZpc2libGUgYm94Ij4NCiAgICAgIDxyZWN0IHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgZmlsbD0ibm9uZSIvPg0KICAgIDwvZz4NCiAgICA8ZyBpZD0iaWNvbnNfUTIiIGRhdGEtbmFtZT0iaWNvbnMgUTIiPg0KICAgICAgPHBhdGggZD0iTTQ0LDlhNyw3LDAsMSwwLTksNi43VjE2YTYsNiwwLDAsMS02LDZIMjFhMTAuMywxMC4zLDAsMCwwLTYsMlYxNS43YTcsNywwLDEsMC00LDBWMzIuM2E3LDcsMCwxLDAsNCwwVjMyYTYsNiwwLDAsMSw2LTZoOEExMCwxMCwwLDAsMCwzOSwxNnYtLjNBNyw3LDAsMCwwLDQ0LDlaTTEwLDlhMywzLDAsMCwxLDYsMCwzLDMsMCwwLDEtNiwwWm02LDMwYTMsMywwLDEsMS0zLTNBMi45LDIuOSwwLDAsMSwxNiwzOVpNMzcsMTJhMi45LDIuOSwwLDAsMS0zLTMsMywzLDAsMCwxLDYsMEEyLjksMi45LDAsMCwxLDM3LDEyWiIvPg0KICAgIDwvZz4NCiAgPC9nPg0KPC9zdmc+";
  branchIcon.width = "20";

  const issueTitleNormalized = (issueTitle) =>
    issueTitle
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\W+/g, "-")
      .toLowerCase();

  const copyBranchName = (issueId, issueTitle) =>
    navigator.clipboard.writeText(
      `${issueId}-${issueTitleNormalized(issueTitle)}`,
    );

  const doContextMenu = (issueWithContextMenu) => {
    const contextMenu = issueWithContextMenu.querySelector(
      '[data-testid="software-context-menu.ui.context-menu-inner.context-menu-inner-container"]',
    );
    const issueTitle = issueWithContextMenu.querySelector(
      '[data-testid="issue-field-summary-inline-edit.ui.read"] :first-child',
    )?.textContent;
    const issueId = issueWithContextMenu.querySelector(
      '[data-testid="platform-card.common.ui.key.key"]',
    )?.textContent;

    if (!issueId || !issueTitle) {
      return;
    }

    const contextMenuUl = contextMenu.querySelector("ul");
    const copyMenuItem = [
      ...contextMenuUl.querySelectorAll("li > button"),
    ].find((button) => button.textContent.indexOf("Copy") !== -1);
    const copyBranchItem = copyMenuItem.cloneNode(true);

    copyBranchItem.setAttribute("id", "copyBranchName");
    copyBranchItem.querySelector("span").innerText = "Copy issue branch";
    copyMenuItem.insertAdjacentElement("afterend", copyBranchItem);

    copyBranchItem.addEventListener("click", (e) => {
      e.preventDefault();
      copyBranchName(issueId, issueTitle);
      contextMenu.remove();
    });
  };

  const doIssueCard = (issueCard) => {
    const issueIdLink = issueCard.querySelector(
      '[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"]',
    );
    const issueId = issueIdLink?.textContent;
    const issueTitle = issueCard.querySelector(
      '[data-testid="issue.views.issue-base.foundation.summary.heading"]',
    )?.textContent;

    if (!issueId || !issueTitle) {
      return;
    }

    const buttonNeighbor = issueCard.querySelector(
      '[data-testid="issue.watchers.action-button.tooltip--container"]',
    )?.parentElement.parentElement.parentElement.parentElement;

    if (!buttonNeighbor) return;

    console.log("Creating branch button");
    const copyBranchNameButton = document.createElement("div");
    copyBranchNameButton.setAttribute("id", "copyBranchName");
    copyBranchNameButton.style.setProperty("width", "32px", "");
    copyBranchNameButton.style.setProperty("display", "flex", "");
    copyBranchNameButton.style.setProperty("cursor", "pointer", "");
    copyBranchNameButton.style.setProperty("align-items", "center", "");
    copyBranchNameButton.style.setProperty("justify-content", "center", "");
    copyBranchNameButton.style.setProperty(
      "transition",
      "200ms filter linear",
      "",
    );

    copyBranchNameButton.title = "Copy Branch Name";

    copyBranchNameButton.appendChild(branchIcon);

    copyBranchNameButton.addEventListener("click", () => {
      copyBranchName(issueId, issueTitle);
      copyBranchNameButton.style.setProperty(
        "filter",
        "invert(42%) sepia(93%) saturate(1352%) hue-rotate(87deg) brightness(119%) contrast(119%)",
        "",
      );

      setTimeout(() => {
        copyBranchNameButton.style.setProperty("filter", "", "");
      }, 500);
    });

    buttonNeighbor.prepend(copyBranchNameButton);
  };

  const scanPage = () => {
    if (!document.querySelector("#copyBranchName")) {
      const issueWithContextMenu = document.querySelector(
        '[data-testid="platform-board-kit.ui.card.card"]:has([data-testid="software-context-menu.ui.context-menu-inner.context-menu-inner-container"])',
      );
      const modalDialog = document.querySelector(
        '[data-testid="issue.views.issue-details.issue-modal.modal-dialog"]',
      );
      const issueDetailsView = document.querySelector(
        '[data-testid="issue.views.issue-details.issue-layout.issue-layout"]',
      );

      if (issueWithContextMenu) {
        console.log("Context menu found");
        doContextMenu(issueWithContextMenu);
      } else if (modalDialog) {
        console.log("Modal dialog found");
        doIssueCard(modalDialog);
      } else if (issueDetailsView) {
        console.log("Issue details found");
        doIssueCard(issueDetailsView);
      }
    }

    setTimeout(() => requestAnimationFrame(scanPage), 500);
  };

  requestAnimationFrame(scanPage);
})();
