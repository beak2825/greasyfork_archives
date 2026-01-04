// ==UserScript==
// @name         HasYoutube
// @namespace    https://hascoding.com
// @version      2024-01-02@06
// @description  Bu eklenti youtube için yazılmış oynatıcı içerir.
// @author       HASANERYILMAZ
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      HasCoding
// @downloadURL https://update.greasyfork.org/scripts/483690/HasYoutube.user.js
// @updateURL https://update.greasyfork.org/scripts/483690/HasYoutube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var v;

    function checkurl () {
        var url = window.location.href;
        var parts = url.split("?");
        var params = parts[1].split("&");
        for (var i = 0; i < params.length; i++) {
            var pair = params[i].split("=");
            if (pair[0] == "v") {
                v = pair[1];
            }
            break;
        }
    }

    function replaceDivWithIframe() {
        var div = document.getElementById("player");
        div.innerHTML = "";
        var iframe = document.createElement("iframe");
        iframe.id = "HasPlayer";
        iframe.width = "100%";
        iframe.height = "600";
        iframe.src = "https://www.youtube.com/embed/"+v+"?autoplay=1";
        iframe.style.border = "none";
        div.appendChild(iframe);
    }

    function checkV() {
        var url = window.location.href;
        var parts = url.split("?");
        var params = parts[1].split("&");
        var yeniv;
        for (var i = 0; i < params.length; i++) {
            var pair = params[i].split("=");
            if (pair[0] == "v") {
                yeniv = pair[1];
            }
        }
        if (yeniv != v) {
            v = yeniv;
            replaceDivWithIframe();
        }
    }
    setInterval(checkV, 10000);

})();