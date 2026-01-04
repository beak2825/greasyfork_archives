// ==UserScript==
// @name         mp3 Downloader y2mate
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  automaticamente descarga mp3 de y2mate.com y cierra la pagina, junto al script Youtube Video Downloader podras descargar mp3 con un click!
// @author       MIGUEL -AĐM
// @license      MIGUEL -AĐM
// @match        https://www.y2mate.com/youtube/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=y2mate.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452068/mp3%20Downloader%20y2mate.user.js
// @updateURL https://update.greasyfork.org/scripts/452068/mp3%20Downloader%20y2mate.meta.js
// ==/UserScript==
var clik0 = "btn btn-success btn-file";
var mp3 = "process_mp3_a";

(function() {
    setInterval(function() {
        if (document.getElementsByClassName(clik0)[0] != null)
        {
            document.getElementsByClassName(clik0)[0].click();
            document.getElementsByClassName(clik0)[0].outnerHTML = "";
            setTimeout("window.close();", 1600);
        }else if (document.getElementById(mp3) != null)
        {
            document.getElementById(mp3).click();
            document.getElementById(mp3).outnerHTML = "";
        }

    }, 1000)
})();