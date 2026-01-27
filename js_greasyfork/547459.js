// ==UserScript==
// @name         Block YouTube Comments
// @namespace    http://tampermonkey.net/
// @version      2026-01-27
// @description  Block the comment section under videos
// @author       skygate2012
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-start
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/547459/Block%20YouTube%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/547459/Block%20YouTube%20Comments.meta.js
// ==/UserScript==

(function() {
    const NativeIO = unsafeWindow.IntersectionObserver;
    if (!NativeIO) return;

    const nativeObserve = NativeIO.prototype.observe;

    NativeIO.prototype.observe = function (target) {
        // Skip comments
        const comments = document.getElementById('comments');
        if (comments && comments.contains(target)) return;

        return nativeObserve.call(this, target);
    };
})();