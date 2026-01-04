// ==UserScript==
// @name     Disable P2P feature (WebRTC)
// @namespace https://github.com/NateScarlet/Scripts/tree/master/user-script
// @description disable p2p connection on all page
// @grant    unsafeWindow
// @run-at   document-start
// @include	 *
// @version   2024.12.09+7b896c9c
// @downloadURL https://update.greasyfork.org/scripts/436803/Disable%20P2P%20feature%20%28WebRTC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/436803/Disable%20P2P%20feature%20%28WebRTC%29.meta.js
// ==/UserScript==

"use strict";
(() => {
  // src/disable-p2p.user.ts
  ((win = window) => {
    delete win.RTCPeerConnection;
    delete win.mozRTCPeerConnection;
    delete win.webkitRTCPeerConnection;
    delete win.RTCDataChannel;
    delete win.DataChannel;
  })(unsafeWindow);
})();
