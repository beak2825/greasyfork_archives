// ==UserScript==
// @name         Slack Web Helper
// @description  Enhances Slack web app.
// @author       dearrrfish (http://github.com/dearrrfish)
// @version      1.0.1
// @namespace    http://github.com/dearrrfish
// @include      https://app.slack.com/client/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/404957/Slack%20Web%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/404957/Slack%20Web%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const onLoad = callback => {
    const loadedStates = ['loaded', 'interactive', 'complete'];
    if (loadedStates.includes(document.readyState)) {
      callback();
    }
    else {
      window.addEventListener('load', () => {
        callback();
      });
    }
  };

  //   GM_addStyle(`

  // @media screen and (max-width: 700px) {

  //   .c-search_modal > .popover {
  //     min-width: unset !important;
  //   }

  //   .p-workspace-layout {
  //     grid-template-areas:
  //       "p-workspace__sidebar p-workspace__primary_view"
  //       "p-workspace__sidebar p-workspace__secondary_view" !important;
  //     grid-template-columns: 0 auto !important;
  //     grid-template-rows: auto min !important;
  //   }

  //   .p-workspace__secondary_view {

  //   }
  // }
  //   `)

  onLoad(() => {

    // Click new unread message button automatically
    setInterval(() => {
      const newMessageButton = document.querySelector('.p-workspace-layout .p-unreads_view__empty--show_new > button');
      const newMessageSyncButton = document.querySelector('.p-workspace-layout > div[aria-label="All unreads"] .p-ia__view_header > button:not(.p-ia__view_header__sidebar_toggle_button');
      if (newMessageButton) {
        newMessageButton.click();
      }
      if (newMessageSyncButton) {
        newMessageSyncButton.click();
      }
    }, 5000)

  });
})();
