// ==UserScript==
// @name         Figma UI3优化习惯
// @namespace    https://zdo.fun/
// @version      1.0
// @author       ZDOFUN
// @description       zh-cn
// @match        https://www.figma.com/design/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=figma.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504736/Figma%20UI3%E4%BC%98%E5%8C%96%E4%B9%A0%E6%83%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/504736/Figma%20UI3%E4%BC%98%E5%8C%96%E4%B9%A0%E6%83%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var styleContent = `
    [data-fpl-version=ui3] .left_panel_positioner--leftPanelPositioner--8Yehe {
          top: 0;
          left: 0;
          bottom: 0;
    }
    [data-fpl-version=ui3] .left_panel_container--panel--ILPCV ,[data-fpl-version=ui3] .properties_panel--panelContainer--cKjqh{
          border-radius: 0
    }
    .positioned_design_toolbelt--root--INYO4{
          top: 12px;
          bottom: unset;
    }
    .pointing_dropdown--scrollIndicator--cvX-K {
          display: none;
    }
    [data-fpl-version=ui3] .properties_panel--panelPosition--oppQ8 {
          top: 0;
          right: 0;
          bottom: 0;
    }
    [data-fpl-version=ui3] .properties_panel--drillDownContainer--VaNDa {
          right: 0;
    }
    `;
document.head.insertAdjacentHTML('beforeend', '<style>' + styleContent + '</style>');
var observer = new MutationObserver(function() {
  var element = document.querySelector('.pointing_dropdown--content--hfmPL');
  if (element) {
    element.style.bottom = '';
  }
});

observer.observe(document.body, { childList: true, subtree: true });
})();