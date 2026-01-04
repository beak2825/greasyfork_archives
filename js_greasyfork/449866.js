// ==UserScript==
// @name         Twitch Player Overlay Remover
// @namespace    https://tampermonkey.net/
// @version      1.0.1
// @description  Twitchのプレーヤーでオーバーレイが出てウザいので消すやつ
// @author       tofulix
// @match        https://dashboard.twitch.tv/*
// @match        https://www.twitch.tv/*
// @run-at        document-start
// @noframes
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449866/Twitch%20Player%20Overlay%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/449866/Twitch%20Player%20Overlay%20Remover.meta.js
// ==/UserScript==


var css = "";
css += [
    ".video-player .video-player__overlay .player-overlay-background {",
    "opacity: 0!important;",
    "}",
    ".video-player .video-player__overlay .player-controls {",
    "opacity: 0!important;",
    "}",
    ".video-player .video-player__overlay .player-controls:hover {",
    "opacity: 1!important;",
    "}",
    ".video-player .video-player__overlay .top-bar {",
    "opacity: 0!important;",
    "}",
    ".persistent-player__border--mini .video-player .video-player__overlay .player-overlay-background {",
    "opacity: 1!important;",
    "}",
    ".persistent-player__border--mini .video-player .video-player__overlay .player-controls {",
    "opacity: 1!important;",
    "}",
    ".persistent-player__border--mini .video-player .video-player__overlay .player-controls:hover {",
    "opacity: 1!important;",
    "}",
    ".persistent-player__border--mini .video-player .video-player__overlay .top-bar {",
    "opacity: 1!important;",
    "}",

].join("\n");

let node = document.createElement("style");
node.type = "text/css";
node.appendChild(document.createTextNode(css));
let heads = document.getElementsByTagName("head");
if (heads.length > 0) {
    heads[0].appendChild(node); }
else {
    // no head yet, stick it whereever
    document.documentElement.appendChild(node); }