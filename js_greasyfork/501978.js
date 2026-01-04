// ==UserScript==
// @name         Hide Slack User 2024
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  block specified users in Slack.
// @author       nakyeonko3
// @match        https://*.slack.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501978/Hide%20Slack%20User%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/501978/Hide%20Slack%20User%202024.meta.js
// ==/UserScript==

(() => {
  // Add userName to hide here.
  // ex) const hiddenUsers = ["userName1", "엄준식 사원", "코딩애플 사장", "CEO 팀 쿡"];
  const hiddenUsers = ["userName1", "useName2"];

  const hideMainMessages = (message) => {
    let hide = false;
    // Detect a.c-message__sender_link and, if present, update hide.
    const sender = message.querySelector("span.c-message__sender");
    if (sender != null) {
      hide = hiddenUsers.includes(sender.getAttribute("data-stringify-text"));
    }
    if (hide) {
      message.style.display = "none";
    }
  };

  const hideSidbarMessages = (message) => {
    let hide = false;
    // Detect a.c-message__sender_link and, if present, update hide.
    const sender_sidebar = message.querySelector(
      "span.p-channel_sidebar__name span"
    );
    if (sender_sidebar !== null) {
      hide = hiddenUsers.includes(sender_sidebar.innerText);
    }
    if (hide === true) {
      sender_sidebar.closest(".c-virtual_list__item").style.display = "none";
    }
  };

  const hideMessages = (container) => {
    for (const message of container.children) {
      hideMainMessages(message); // hide main page messages
      hideSidbarMessages(message); // hide sidebar messages
    }
  };

  const observeMessages = (container) => {
    // Observe at most once per container.
    const callback = (mutations) => {
      hideMessages(container);
    };
    callback();
    const observer = new MutationObserver(callback);
    observer.observe(container, { childList: true });
  };

  const observeContainerIn = (layout, view) => {
    const callback = (mutations) => {
      for (const child of layout.children) {
        const container = child.querySelector(
          "div.c-virtual_list__scroll_container"
        );
        if (container != null) {
          observeMessages(container);
        }
      }
    };
    callback();
  };

  window.addEventListener(
    "load",
    () => {
      const workspace_layout = document.querySelector(
        "div.p-client_workspace__layout"
      );
      observeContainerIn(workspace_layout, "p-workspace__primary_view_body");
    },
    false
  );
})();
