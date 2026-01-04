// ==UserScript==
// @name         RS Playlist enhancer and simplifier
// @namespace    https://greasyfork.org/en/scripts/440738-rs-playlist-enhancer-and-simplifier
// @version      0.3
// @description  This scripts is designed to enhance and simplify the RS Playlist page from https://rsplaylist.com/
// @author       kozaka
// @match        https://rsplaylist.com/*
// @icon         https://rsplaylist.com/favicon-32x32.png
// @grant        none
// @homepage     https://github.com/kozaka-tv/Rocksmith-Servant
// @homepageURL  https://github.com/kozaka-tv/Rocksmith-Servant
// @supportURL   https://github.com/kozaka-tv/Rocksmith-Servant/issues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440738/RS%20Playlist%20enhancer%20and%20simplifier.user.js
// @updateURL https://update.greasyfork.org/scripts/440738/RS%20Playlist%20enhancer%20and%20simplifier.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(
    function () {
        'use strict';

        $("div.logo").remove();
        $("div.footer").remove();

        $('div.content').attr('style', 'width: 95%');
        $('div.request-header-columns').attr('style', 'display: flex; align-items: stretch; flex-direction: row; margin-bottom: 00px;');

        $("div.playlist").append(`
            <div class="cookie" style="color: white; text-align: center; padding: 10px">
                <input type="hidden" name="PHPSESSID" value="` + extractPHPSESSIDFromCookie() + `" id="myInput">
                <button id="copyButton">Copy your PHPSESSID to clipboard</button>
            </div>
        `);

        $('#copyButton').click(function (event) {
            copyToClipboard();
        });

        function extractPHPSESSIDFromCookie() {
            if (document.cookie.split(';').some((item) => item.trim().startsWith('PHPSESSID='))) {
                return document.cookie
                    .split('; ')
                    .find(row => row.startsWith('PHPSESSID='))
                    .split('=')[1];
            }
            return "";
        }

        function copyToClipboard() {
            let phpsessidElement = document.getElementsByName("PHPSESSID")[0];
            phpsessidElement.select();
            navigator.clipboard.writeText(phpsessidElement.value);
            alert("Your PHPSESSID has been copied to the clipboard!\n(PHPSESSID = " + phpsessidElement.value + ")");
        }

    }
)();
