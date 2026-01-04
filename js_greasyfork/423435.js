// ==UserScript==
// @name         IGG Games / bluemediafiles bypass
// @namespace    http://tampermonkey.net/
// @version      0.0.12
// @description  Skip count down and redirect to actual download page.
// @homepage     https://greasyfork.org/scripts/423435
// @supportURL   https://greasyfork.org/scripts/423435/feedback
// @match        *://*/url-generator*.php?url=*
// @grant        none
// @author       tths
// @downloadURL https://update.greasyfork.org/scripts/423435/IGG%20Games%20%20bluemediafiles%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/423435/IGG%20Games%20%20bluemediafiles%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function _bluemediafiles_decodeKey(encoded) {
        var key = '';
        for (var i = encoded.length / 2 - 5; i >= 0; i = i - 2) {
            key += encoded[i];
        }
        for (i = encoded.length / 2 + 4; i < encoded.length; i = i + 2) {
            key += encoded[i];
        }
        return key;
    }
    [].forEach.call(document.getElementsByTagName('script'), function (s) {
        var m = s.innerText.match(/generateDownloadUrl\(\).+?_0x44b739='(?<encoded>.+?)'/);
        if (m && m.length > 1) {
            window.location = '/get-url.php?url=' + _bluemediafiles_decodeKey(m[1]);
        }
    });
})();
