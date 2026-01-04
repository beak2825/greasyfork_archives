// ==UserScript==
// @name        Wallhaven - Hide '0' New Wallpapers From Subscriptions
// @namespace   NooScripts
// @match       https://wallhaven.cc/subscription*
// @grant       GM_addStyle
// @version     1.0.1
// @author      NooScripts
// @description Auto hide Subscriptions with '0' new wallpapers, only displaying ones with '1' or more
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480428/Wallhaven%20-%20Hide%20%270%27%20New%20Wallpapers%20From%20Subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/480428/Wallhaven%20-%20Hide%20%270%27%20New%20Wallpapers%20From%20Subscriptions.meta.js
// ==/UserScript==


GM_addStyle(`
  [class="sidebar-section"] li {
    display: none !important;
  }

  [class="sidebar-section"] [class="has-new "] {
    display: table !important;
  }

  [class="sidebar-section"] [class="active has-new "] {
    display: table !important;
    border: 1px solid #fff !important;
  }

  [class="sidebar-section"] [class="active has-new"]:after {
    content: "Current Tag";
    font-size: 12px !important;
    font-weight: 700;
    color: #ffda00;
    padding: 90px !important;
  }
`);