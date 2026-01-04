// ==UserScript==
// @name         干掉B站直播P2P传输
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  干掉Bilbili直播P2P传输
// @author       xfgryujk
// @include      /https?:\/\/live\.bilibili\.com\/?\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/\d+\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435132/%E5%B9%B2%E6%8E%89B%E7%AB%99%E7%9B%B4%E6%92%ADP2P%E4%BC%A0%E8%BE%93.user.js
// @updateURL https://update.greasyfork.org/scripts/435132/%E5%B9%B2%E6%8E%89B%E7%AB%99%E7%9B%B4%E6%92%ADP2P%E4%BC%A0%E8%BE%93.meta.js
// ==/UserScript==

(function() {
  delete window.RTCPeerConnection
  delete window.mozRTCPeerConnection
  delete window.webkitRTCPeerConnection
  delete window.RTCDataChannel
  delete window.DataChannel
})();