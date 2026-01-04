// ==UserScript==
// @name         Webcamdarts Dual View Streaming NO AVG
// @name:fr      Webcamdarts Dual View Streaming (NO AVG)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Don't show average when you're playing, more focused on the game !
// @description:fr Ne pas montrer la moyenne pendant un match. Pour ne pas se focaliser sur sa moyenne mais sur le match
// @author       Antoine Maingeot
// @match        https://game.webcamdarts.com/game
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/RecordRTC/5.6.1/RecordRTC.js
// @require      https://cdn.jsdelivr.net/npm/detectrtc@1.4.1/DetectRTC.min.js
// @require      https://cdn.jsdelivr.net/npm/rtcmulticonnection@3.7.0/dev/getHTMLMediaElement.js

// @license MIT
// @copyright 2020, maingeot
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/420405/Webcamdarts%20Dual%20View%20Streaming%20NO%20AVG.user.js
// @updateURL https://update.greasyfork.org/scripts/420405/Webcamdarts%20Dual%20View%20Streaming%20NO%20AVG.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7 > div:nth-child(6),#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2 > div > div:nth-child(10), #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7 > div:nth-child(6), #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker > div:nth-child(6){display:none;}');
})();

