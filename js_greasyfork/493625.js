// ==UserScript==
// @name        Toggle Youtube Styles
// @license     MIT
// @namespace   rtonne
// @match       https://www.youtube.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @version     1.9
// @author      Rtonne
// @description Adds toggles to enable/disable some styles that change Youtube
// @require     https://update.greasyfork.org/scripts/498119/1395863/setupToggleCommands.js
// @grant       GM.addStyle
// @grant       GM.registerMenuCommand
// @grant       GM.unregisterMenuCommand
// @grant       GM.getValue
// @grant       GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/493625/Toggle%20Youtube%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/493625/Toggle%20Youtube%20Styles.meta.js
// ==/UserScript==

const commands = [
  {
    id: "guide_sections",
    default_value: true,
    on_text: "🞕 Guide Sections",
    off_text: "🞎 Guide Sections",
    toggleOnFunction: () =>
      GM.addStyle(`
      #sections.ytd-guide-renderer > ytd-guide-section-renderer:nth-child(n+3) {
        display: unset;
      }
    `),
    toggleOffFunction: () =>
      GM.addStyle(`
      #sections.ytd-guide-renderer > ytd-guide-section-renderer:nth-child(n+3) {
        display: none;
      }
    `),
  },
  {
    id: "sidebar_shorts",
    default_value: true,
    on_text: "🞕 Shorts Sidebar Button",
    off_text: "🞎 Shorts Sidebar Button",
    // This hides all the buttons without a href in the first sidebar section (should only be Shorts right now)
    toggleOnFunction: () =>
      GM.addStyle(`
      ytd-guide-section-renderer:first-of-type ytd-guide-entry-renderer:not(:has(> a[href])),
      ytd-mini-guide-entry-renderer:not(:has(> a[href])) {
        display: unset;
      }
    `),
    toggleOffFunction: () =>
      GM.addStyle(`
      ytd-guide-section-renderer:first-of-type ytd-guide-entry-renderer:not(:has(> a[href])),
      ytd-mini-guide-entry-renderer:not(:has(> a[href])) {
        display: none;
      }
    `),
  },
  {
    id: "shorts",
    default_value: true,
    on_text: "🞕 Shorts in Feed",
    off_text: "🞎 Shorts in Feed",
    toggleOnFunction: () =>
      GM.addStyle(`
      ytd-rich-section-renderer:has(> div > [is-shorts]) {
        display: unset;
      }
    `),
    toggleOffFunction: () =>
      GM.addStyle(`
      ytd-rich-section-renderer:has(> div > [is-shorts]) {
        display: none;
      }
    `),
  },
  {
    id: "community",
    default_value: true,
    on_text: "🞕 Community Posts in Feed",
    off_text: "🞎 Community Posts in Feed",
    toggleOnFunction: () =>
      GM.addStyle(`
      ytd-rich-section-renderer:has(> div > :not([is-shorts]):not([thumbnail-style])) {
        display: unset;
      }
    `),
    toggleOffFunction: () =>
      GM.addStyle(`
      ytd-rich-section-renderer:has(> div > :not([is-shorts]):not([thumbnail-style])) {
        display: none;
      }
    `),
  },
  {
    id: "comments",
    default_value: true,
    on_text: "🞕 Comments",
    off_text: "🞎 Comments",
    toggleOnFunction: () =>
      GM.addStyle(`
      ytd-comments#comments {
        display: unset;
      }
    `),
    toggleOffFunction: () =>
      GM.addStyle(`
      ytd-comments#comments {
        display: none;
      }
    `),
  },
  {
    id: "related_videos",
    default_value: true,
    on_text: "🞕 Related Videos",
    off_text: "🞎 Related Videos",
    toggleOnFunction: () =>
      GM.addStyle(`
      #secondary.ytd-watch-flexy > #secondary-inner > #related {
        display: unset;
      }
    `),
    toggleOffFunction: () =>
      GM.addStyle(`
      #secondary.ytd-watch-flexy > #secondary-inner > #related {
        display: none;
      }
    `),
  },
  {
    id: "description_shorts",
    default_value: true,
    on_text: "🞕 Remix Shorts in Description",
    off_text: "🞎 Remix Shorts in Description",
    toggleOnFunction: () =>
      GM.addStyle(`
      #description ytd-reel-shelf-renderer {
        display: unset;
      }
    `),
    toggleOffFunction: () =>
      GM.addStyle(`
      #description ytd-reel-shelf-renderer {
        display: none;
      }
    `),
  },
];

setupToggleCommands(commands);
