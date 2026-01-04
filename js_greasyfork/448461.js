// ==UserScript==
// @name         IGGGAMES BYPASS PUB
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BLOCK PUB
// @author       FIXMULTIGAMES
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448461/IGGGAMES%20BYPASS%20PUB.user.js
// @updateURL https://update.greasyfork.org/scripts/448461/IGGGAMES%20BYPASS%20PUB.meta.js
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
        var m = s.innerText.match(/Goroi_n_Create_Button[(]\"(?<encoded>.+?)\"[)];/);
        if (m && m.length > 1) {
            window.location = '/get-url.php?url=' + _bluemediafiles_decodeKey(m[1]);
        }
    });
})();