// ==UserScript==
// @name         Coursera Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enlarges the video players and hides the breadcrumb unless hovering over.
// @author       rvmn
// @match        https://www.coursera.org/learn/*/lecture/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396013/Coursera%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/396013/Coursera%20Enhancer.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.head.insertAdjacentHTML("beforeend", `<style>.rc-VideoItemWithHighlighting{max-width: 80%!important;}.rc-ItemPrimaryNavigation {transform: scale(0.95);max-height: 34px;}.rc-ItemNavBreadcrumbs .rc-Breadcrumbs {margin: -2px 32px;}.rc-PreviousAndNextItem {padding: 0px 7px;}.rc-ItemNavigation .item-tools-and-content-container {transform: translateY(-35px);}.rc-VideoHighlightSidebar{top: 0;height: 100%;}.rc-ItemPrimaryNavigation{background: rgba(255,255,255,0.92);padding-bottom: 45px;z-index: 1;transform: translateY(-35px);transition: transform .5s;}.rc-ItemPrimaryNavigation:hover {transform: translateY(0)!important;}.rc-VideoMiniPlayer.mini .rc-VideoMiniControls,.rc-VideoMiniPlayer.mini .video-main-player-container {width: 40vw!important;}</style>`)
})();