// ==UserScript==
// @name itch user page grid
// @namespace github.com/openstyles/stylus
// @version 3
// @description A new userstyle
// @author rssaromeo
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @match *://*.itch.io/*
// @include /^(?:https?://[^.]+\.itch\.io/?([?#].*|$))$/
// @downloadURL https://update.greasyfork.org/scripts/524874/itch%20user%20page%20grid.user.js
// @updateURL https://update.greasyfork.org/scripts/524874/itch%20user%20page%20grid.meta.js
// ==/UserScript==

(function() {
let css = "";
if (new RegExp("^(?:https?://[^.]+\\.itch\\.io/?([?#].*|\$))\$").test(location.href)) {
  css += `
    .columns {
      display: flex;
      flex-direction: column;
    }
    .game_grid_widget.base_widget.user_game_grid {
      max-width: 960px;
      width: 100vw;
      display: flex !important;
      flex-direction: row;
      gap: 10px;
      flex-wrap: wrap !important;
    }
    .game_grid_widget.base_widget.user_game_grid > * {
      width: 200px !important;
    }
    .column.profile_column {
      position: unset !important;
    }
    .user_page.page_widget.base_widget {
      outline: none !important;
    }
  `;
}
if ((location.hostname === "itch.io" || location.hostname.endsWith(".itch.io"))) {
  css += `
    .drop_menu,
    .group_header,
    .menu_group {
      background-color: #8c8c8c !important;
      border-color: #000 !important;
    }
    .game_edit_theme_editor_widget.theme_editor_widget.slide_in-enter-done,
    [name^="layout"],
    .forms_simple_select_widget,
    .forms_color_input_popup_widget.color_popout,
    .horiz_input > *,
    .forms_color_input_widget,
    button.toggle_button,
    fieldset {
      background-color: #8c8c8c !important;
      border-color: #000 !important;
    }
    .slider_fill {
      background-color: #555 !important;
    }
    .slider_track {
      background-color: #262626 !important;
    }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
