// ==UserScript==
// @name         冥土帰し
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  ヘヴンキャンセラー
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/493172/%E5%86%A5%E5%9C%9F%E5%B8%B0%E3%81%97.user.js
// @updateURL https://update.greasyfork.org/scripts/493172/%E5%86%A5%E5%9C%9F%E5%B8%B0%E3%81%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    self.unsafeWindow.onload = () => {
        (function (window) {
            const heavenCanceller = window.document.createElement("iframe");
            heavenCanceller.hidden = true;
            window.document.body.appendChild(heavenCanceller);
            heavenCanceller.onload = () => {
                window.RTCDataChannel = heavenCanceller.contentWindow.RTCDataChannel;
                window.RTCPeerConnection = heavenCanceller.contentWindow.RTCPeerConnection;
                window.RTCSessionDescription = heavenCanceller.contentWindow.RTCSessionDescription;
                window.MediaStreamTrack = heavenCanceller.contentWindow.MediaStreamTrack;
            }
            const html = "";
            const blob = new Blob([html], { type: 'text/html' });
            heavenCanceller.src = URL.createObjectURL(blob);
        })(unsafeWindow);
    };
})();