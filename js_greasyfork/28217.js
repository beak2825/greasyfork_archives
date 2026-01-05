// ==UserScript==
// @name        YouTube video/mp4
// @version     1.0
// @description Plays video in h.264 format.
// @author      gvvad
// @run-at      document-start
// @include     *.youtube.com/*
// @grant       none
// @noframes
// @license     MIT; https://opensource.org/licenses/MIT
// @copyright   2020, gvvad
// @namespace   https://greasyfork.org/users/100160
// @downloadURL https://update.greasyfork.org/scripts/28217/YouTube%20videomp4.user.js
// @updateURL https://update.greasyfork.org/scripts/28217/YouTube%20videomp4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getCustomMimeChecker(producer, isBool) {
        const rejector = /(webm|vp8|vp9|av01)/;

        return function (mime) {
            if (rejector.test(mime)) {
                return (isBool) ? false : '';
            }

            return producer(mime);
        };
    }

    let videoElem = document.createElement('video');
    let v_proto = Object.getPrototypeOf(videoElem);
    v_proto.canPlayType = getCustomMimeChecker(v_proto.canPlayType.bind(videoElem), false);
    Object.setPrototypeOf(videoElem, v_proto);

    if (window.MediaSource === undefined) return;
    window.MediaSource.isTypeSupported = getCustomMimeChecker(window.MediaSource.isTypeSupported, true);
})();
