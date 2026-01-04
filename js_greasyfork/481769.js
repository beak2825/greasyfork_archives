// ==UserScript==
// @name         YouTube TimedReaction Adjustment
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  YouTubeライブ配信のTimedReaction(スタンプ)ボタンの透過＆位置を微調整する
// @author       Rambo Panda
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481769/YouTube%20TimedReaction%20Adjustment.user.js
// @updateURL https://update.greasyfork.org/scripts/481769/YouTube%20TimedReaction%20Adjustment.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Reaction control panel overlayの位置調整
    var overlay = document.querySelector("#reaction-control-panel-overlay.yt-live-chat-renderer");
    if (overlay) {
        overlay.style.right = "10px";
        overlay.style.bottom = "35px";
    }

    // Collapsed buttonの透過率設定
    var collapsedButton = document.querySelector("div#collapsed-button");
    if (collapsedButton) {
        collapsedButton.style.opacity = "0.4";
    }

    // ライトテーマ用
    var lightThemeElements = document.querySelectorAll("yt-reaction-control-panel-view-model:not([is-dark-theme]) #fab-container.yt-reaction-control-panel-view-model:not([is-dark-theme])");
    lightThemeElements.forEach(function(element) {
        element.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    });

    // ダークテーマ用
    var darkThemeElements = document.querySelectorAll("yt-reaction-control-panel-view-model[is-dark-theme] #fab-container.yt-reaction-control-panel-view-model");
    darkThemeElements.forEach(function(element) {
        element.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
        element.style.outline = "1px solid rgba(100, 100, 100, 0.2)";
    });
})();