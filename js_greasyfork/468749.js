
// ==UserScript==
// @license     MIT
// @name        Gitlab share
// @namespace   https://gitlab.ilab.zone/
// @description Allows to easily share links to issues and MRs
// @match       https://gitlab.ilab.zone/*
// @version     1.0.0
// @author      rwysocki
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/468749/Gitlab%20share.user.js
// @updateURL https://update.greasyfork.org/scripts/468749/Gitlab%20share.meta.js
// ==/UserScript==

(function () {
'use strict';

var styles = {"toast":"toast-module_toast__HTmbd","error":"toast-module_error__cc4Ok"};
var stylesheet=".toast-module_toast__HTmbd{left:unset;right:10px;top:10px;transform:unset}.toast-module_error__cc4Ok{background-color:red;color:#fff}";

const copy = async ({
  fullTitle,
  url
}) => {
  await navigator.clipboard.write([new ClipboardItem({
    [`text/plain`]: new Blob([fullTitle], {
      type: `text/plain`
    }),
    [`text/html`]: new Blob([`<a href="${url}">${fullTitle}</a>`], {
      type: `text/html`
    })
  })]);
  VM.showToast('Link copied!', {
    style: stylesheet,
    className: styles.toast
  });
};
const getBoardIssueLink = () => {
  const selectedCard = document.querySelector("[data-testid='board_card'].gl-bg-blue-50");
  const issueNumber = selectedCard.querySelector('.board-card-footer').innerText.split('\n')[1];
  const title = selectedCard.querySelector('.board-card-title').textContent.trim();
  return {
    fullTitle: `[${issueNumber}] ${title}`,
    url: `https://gitlab.ilab.zone/ihlc/teams/mvp-teams/external-innovators/team-cmre/mcm-trumpet/-/issues/${issueNumber.substring(1)}`
  };
};
const getMergeRequestLink = () => {
  const title = document.querySelector(`[data-qa-selector='title_content']`).textContent.trim();
  return {
    fullTitle: `MR: ${title}`,
    url: window.location.href
  };
};
const getIssueLink = () => {
  const issueNumber = document.querySelector(`[data-qa-selector='breadcrumb_current_link']`).textContent.trim();
  const title = document.querySelector(`[data-qa-selector='title_content']`).textContent.trim();
  return {
    fullTitle: `[${issueNumber}] ${title}`,
    url: `https://gitlab.ilab.zone/ihlc/teams/mvp-teams/external-innovators/team-cmre/mcm-trumpet/-/issues/${issueNumber.substring(1)}`
  };
};
function ShareIssueButton({
  linkProvider
}) {
  const handleClick = async () => {
    try {
      const linkParams = linkProvider();
      await copy(linkParams);
    } catch (e) {
      VM.showToast('Something went wrong', {
        style: stylesheet,
        className: [styles.toast, styles.error].join(' ')
      });
      console.error(e);
    }
  };
  return VM.h("button", {
    type: "button",
    class: "btn hide-collapsed btn-default btn-sm gl-button",
    size: "small",
    "data-testid": 'share',
    onclick: handleClick
  }, VM.h("span", {
    class: "gl-button-text"
  }, "Share"));
}
VM.observe(document.body, () => {
  if (window.location.pathname.includes('/-/boards/')) {
    const toDoList = document.querySelector('[data-testid="sidebar-todo"]');
    if (toDoList !== null && !hasShareButton(toDoList)) {
      toDoList.appendChild(VM.m(VM.h(ShareIssueButton, {
        linkProvider: getBoardIssueLink
      })));
    }
  }
  if (window.location.pathname.includes('/-/issues/')) {
    const toDoList = document.querySelector('.issuable-sidebar-header');
    if (toDoList !== null && !hasShareButton(toDoList)) {
      toDoList.appendChild(VM.m(VM.h(ShareIssueButton, {
        linkProvider: getIssueLink
      })));
    }
  }
  if (window.location.pathname.includes('/-/merge_requests/')) {
    const toDoList = document.querySelector('[data-testid="sidebar-todo"]');
    if (toDoList !== null && !hasShareButton(toDoList)) {
      toDoList.appendChild(VM.m(VM.h(ShareIssueButton, {
        linkProvider: getMergeRequestLink
      })));
    }
  }
});
const hasShareButton = el => {
  const shareButton = el.querySelector('[data-testid="share"]');
  return shareButton !== null;
};

})();
