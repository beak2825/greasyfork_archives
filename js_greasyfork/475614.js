// ==UserScript==
// @name         [Addon] LZT Stats - Fullscreen modal
// @namespace    lzt-stats-fullscreen-modal
// @version      1.0
// @description  An addon for LZT Stats that makes a full-screen modal extension window
// @author       Toil
// @license      MIT
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.market/*
// @match        https://zelenka.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @supportURL   https://zelenka.guru/toil/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/475614/%5BAddon%5D%20LZT%20Stats%20-%20Fullscreen%20modal.user.js
// @updateURL https://update.greasyfork.org/scripts/475614/%5BAddon%5D%20LZT%20Stats%20-%20Fullscreen%20modal.meta.js
// ==/UserScript==

(function() {
  'use strict';

  GM_addStyle(`
      @media screen and (min-width: 1150px) {
        #LZTStatsOverlay {
          max-width: 100% !important;
        }

        .LZTStatsSection {
          display: flex;
        }

        .LZTStatsSection .LZTStatsInfo {
          max-width: 50% !important;
        }

        .LZTStatsSection canvas {
          margin-left: 15px !important;
          max-width: 50% !important;
          max-height: 100% !important;
        }

        #LZTStatsChatSection,
        #LZTStatsSettingsSection {
          flex-direction: column !important;
        }

        .LZTStatsSectionItem {
          max-width: 100% !important;
        }
      }

      @media screen and (min-width: 1150px) and (max-width: 1362px) {
        .LZTStatsInfo .LZTStatsItem {
          width: 48% !important;
        }
     }
  `)
})();