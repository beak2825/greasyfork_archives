// ==UserScript==
// @name         TTS Demo Downloader
// @version      0.1
// @namespace    https://www.oddcast.com
// @description  Download MP3 file when playing demo voice in ttsdemo.com
// @author       EdaCha
// @match        https://www.oddcast.com/ttsdemo/*
// @grant        none
// @license      CC0
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/469144/TTS%20Demo%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/469144/TTS%20Demo%20Downloader.meta.js
// ==/UserScript==

(function(open) {
    XMLHttpRequest.prototype.open = function() {
        // Intercept API response and download file
        this.addEventListener('load', function() {
            if (this.responseURL.indexOf('cache-a.oddcast.com/tts/genB.php') > -1) {
                const blob = new Blob([this.response], {type: 'audio/mp3'});
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = document.getElementById('flash-speck-area').value.slice(0, 20) + '.mp3'
                link.click()
            }
        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);