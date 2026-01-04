// ==UserScript==
// @name         GamesGX Downloader
// @version      0.1
// @namespace    GamesGx Downloader
// @description  Skip shortener to gamesgx.net
// @author       GrrAmd2
// @match        https://eco-area.com/*
// @match        http://eco-area.com/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419240/GamesGX%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/419240/GamesGX%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var entryPoint = window.location.pathname.split('/');
    if(entryPoint[1] == "go") {
        document.querySelector('.linkprotect').click();
    }else{
        var linkArchivo = document.querySelector(".botontour").children[0].text;
        var regex = new RegExp(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/gi)

        var url = linkArchivo.match(regex)[0];
        window.open(url, "_blank");
        setTimeout(function() {
            window.close()
        }, 500);
    }
})();