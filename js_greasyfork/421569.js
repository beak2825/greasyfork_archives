// ==UserScript==
// @name              アクセラレータ
// @namespace         AcceleratorWebRTCKiller
// @namespace         TGSAN
// @version           1.0
// @description       WebRTC 禁用脚本
// @author            TGSAN
// @run-at            document-start
// @include           /.*/
// @grant             unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/421569/%E3%82%A2%E3%82%AF%E3%82%BB%E3%83%A9%E3%83%AC%E3%83%BC%E3%82%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/421569/%E3%82%A2%E3%82%AF%E3%82%BB%E3%83%A9%E3%83%AC%E3%83%BC%E3%82%BF.meta.js
// ==/UserScript==

(function () {
    "use strict";

    (function (window) {
        delete window.RTCPeerConnection;
        delete window.webkitRTCPeerConnection;
        delete window.mozRTCPeerConnection;
    })(unsafeWindow);

    console.log("Accelerator killed WebRTC.");
})();