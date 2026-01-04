// ==UserScript==
// @name         element.io-width
// @version      0.9
// @description  Removes all of the dead space in element.io.
// @match        *://*.app.element.io/*
// @namespace    https://greasyfork.org/users/217495-eric-toombs
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/429321/elementio-width.user.js
// @updateURL https://update.greasyfork.org/scripts/429321/elementio-width.meta.js
// ==/UserScript==

style_tag = document.createElement('style');
style_tag.innerHTML = `
  .mx_EventTile:not([data-layout="bubble"]) .mx_EventTile_msgOption {
    width: 16px;
  }
  .mx_RoomView_MessageList {
    padding: 0px;
  }
  .mx_EventTile_content {
    margin-right: 0px;
  }
  .mx_RoomView_timeline_rr_enabled .mx_EventTile:not([data-layout="bubble"]) .mx_EventTile_line {
    margin-right: 0px;
  }
  .mx_LeftPanel_wrapper .mx_SpacePanel {
    display: none;
  }
`;
document.getElementsByTagName('head')[0].append(style_tag);