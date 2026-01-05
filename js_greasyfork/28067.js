// ==UserScript==
// @name               Decrease click at Zippyshare
// @name:ja            Zippyshareで楽をするためのスクリプト
// @namespace          http://hogehoge/
// @version            1.*
// @description        none
// @description:ja     多分これが一番楽だと思います
// @author             H. Amami
// @match              *://*.zippyshare.com/v/*
// @grant              none
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/28067/Decrease%20click%20at%20Zippyshare.user.js
// @updateURL https://update.greasyfork.org/scripts/28067/Decrease%20click%20at%20Zippyshare.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a = document.getElementById("dlbutton");
    if (a !== null) {
        location.href = a.href;
    }
})();