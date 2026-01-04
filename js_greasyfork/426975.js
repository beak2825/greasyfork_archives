// ==UserScript==
// @name         Disable Auto Emoji
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prevents :) from turning into 🙂.
// @author       Two
// @match        https://sketchful.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426975/Disable%20Auto%20Emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/426975/Disable%20Auto%20Emoji.meta.js
// ==/UserScript==
/* global $ */

(function () {
    $('#gameChatInput').keydown(function (e) {
        if ($('#gameChatInput').is(':focus')) {
            if ('Enter' == e.key) {
                e.preventDefault();
                $('#gameChatInput').val($('#gameChatInput').val().replace(/(:|;)/g, "$1<emoji>"))
            }
        }
    })
})();