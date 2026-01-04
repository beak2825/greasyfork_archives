// ==UserScript==
// @name         YouTaker Download mp3
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Provide download button for YouTaker music
// @author       Fractalism
// @match        http*://www.youtaker.com/video/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/386580/YouTaker%20Download%20mp3.user.js
// @updateURL https://update.greasyfork.org/scripts/386580/YouTaker%20Download%20mp3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var title = document.getElementById("tr1").innerText
    var text_replace = document.getElementById("kdd").firstChild
    var kdd_style = document.createElement("style")
    kdd_style.innerHTML = `
    #kdd {
        background-color: black;
        border: 1px solid black;
        border-radius: 5px;
        padding: 3px 5px 3px 5px;
        cursor: pointer;
    }`
    text_replace.style.color = "darkseagreen"
    document.head.appendChild(kdd_style)
    if(typeof musicfile === "undefined") {
        text_replace.innerHTML = "Could not find music file"
        return
    }
    var download_func = function(event) {
        GM_download({
            url: musicfile,
            name: title,
            saveAs: false,
            onerror: function(download) {
                alert("Download failed\nError: " + download.error + "\nDetails: " + download.details.current + "\n\nTry right click -> 'Save As'")
            }
        })
        event.preventDefault()
    }

    text_replace.href = musicfile
    text_replace.parentElement.addEventListener("click", download_func)
    text_replace.innerHTML = "Download mp3"
})();
