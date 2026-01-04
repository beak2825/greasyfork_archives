// ==UserScript==
// @name         WebRTC Block
// @version      0.1
// @description  Блокирует WebRTC на всех сайтах.
// @author       Maksovich
// @run-at       document-start
// @namespace    https://greasyfork.org/users/681286
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webrtc.org
// @match        http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521196/WebRTC%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/521196/WebRTC%20Block.meta.js
// ==/UserScript==

(function() {
  "use strict";
  window.RTCPeerConnection = {};
})();