"use strict";
// ==UserScript==
// @name         YouTube Normal Thumbnails
// @namespace    http://greasyfork.org
// @version      0.7.1
// @description  Restores normal thumbnails size
// @author       NeoCortex
// @license      MIT
// @match        *://www.youtube.com/*
// @match        *://youtube.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391636/YouTube%20Normal%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/391636/YouTube%20Normal%20Thumbnails.meta.js
// ==/UserScript==
(function () {
    var styles = "\n    ytd-rich-grid-video-renderer[mini-mode] #video-title.ytd-rich-grid-video-renderer {\n        font-size: 1.4rem;\n        font-weight: 500;\n        line-height: 1.6rem;\n    }\n\n    #avatar-link.ytd-rich-grid-video-renderer {\n        display: none !important;\n    }\n\n    ytd-video-renderer[use-prominent-thumbs] ytd-thumbnail.ytd-video-renderer {\n        min-width: 120px !important;\n        max-width: 240px !important;\n    }\n    ".trim();
    var YoutubeThumbnailsFixer = /** @class */ (function () {
        function YoutubeThumbnailsFixer() {
            var _this = this;
            this.replaceMathMin();
            document.addEventListener("DOMContentLoaded", function () { return _this.installStyle(styles); });
        }
        YoutubeThumbnailsFixer.prototype.replaceMathMin = function () {
            var origMathMin = Math.min;
            function modifiedMathMin() {
                if (/calcElementsPerRow/img.test(Error().stack || '')) {
                    return origMathMin.apply(Math, arguments) + 1;
                }
                return origMathMin.apply(Math, arguments);
            }
            Math.min = modifiedMathMin;
        };
        YoutubeThumbnailsFixer.prototype.installStyle = function (contents) {
            var style = document.createElement('style');
            style.innerHTML = contents;
            document.body.appendChild(style);
        };
        return YoutubeThumbnailsFixer;
    }());
    new YoutubeThumbnailsFixer();
})();
