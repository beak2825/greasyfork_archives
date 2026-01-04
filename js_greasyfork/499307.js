// ==UserScript==
// @name         Figma Layer Panel Horizontal Scroll Fix
// @name:zh-TW   Figma 圖層面板水平捲動修復
// @author       gstar
// @license      MIT
// @namespace    https://github.com/gstar175/
// @version      0.0.1
// @description  Improves horizontal scrolling in Figma's layer panel
// @description:zh-TW  改善 Figma 圖層面板的水平捲動功能
// @match        https://www.figma.com/design/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499307/Figma%20Layer%20Panel%20Horizontal%20Scroll%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/499307/Figma%20Layer%20Panel%20Horizontal%20Scroll%20Fix.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 創建樣式元素
  const style = document.createElement('style');
  style.textContent = `
      [class^="pages_panel--objectPanelContent"] [class^="scroll_container--scrollContainer"] {
          overflow-x: scroll !important;
      }
      [class^="pages_panel--objectPanelContent"] [class^="objects_panel--rowContainer"] [data-testid="layer-row"], 
      [class^="pages_panel--objectPanelContent"] [class^="objects_panel--rowContainer"] [data-testid="layer-row-with-children"] {
          min-width: fit-content;
      }
      [class^="pages_panel--objectPanelContent"] [class^="objects_panel--rowContainer"] [class^="object_row--rowText"] {
          width: auto !important;
          min-width: fit-content;
      }
      [class^="pages_panel--objectPanelContent"] [class^="objects_panel--rowContainer"] [class^="object_row--rowName"] {
          min-width: fit-content;
      }
      [class^="pages_panel--objectPanelContent"] [class^="objects_panel--rowContainer"] [class^="object_row--row"] input[type="text"] {
          width: auto !important;
          min-width: fit-content;
      }
      [class^="pages_panel--objectPanelContent"] [class^="objects_panel--rowContainer"] [class^="object_row--rowActions"] {
          position: sticky;
          right: 0;
          padding-left: 0.25rem;
          background-color: var(--color-bg, #fff);
      }
      [class^="pages_panel--objectPanelContent"] [class^="objects_panel--rowContainer"] [class^="object_row--row"][class*="selected"] [class^="object_row--rowActions"] {
          background-color: var(--color-bg-selected, #daebf7);
      }
      [class^="pages_panel--objectPanelContent"] [class^="objects_panel--rowContainer"] [class^="object_row--row"][class*="parentSelected"] [class^="object_row--rowActions"] {
          background-color: var(--color-bg-selected-secondary, #edf5fa);
      }
  `;

  // 將樣式添加到文檔頭部
  document.head.appendChild(style);
})();