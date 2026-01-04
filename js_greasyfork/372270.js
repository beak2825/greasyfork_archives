// ==UserScript==
// @name         Instagram Downloader
// @namespace    https://6869net.tk/
// @version      0.1
// @description  Adds a download button for Instagram posts online.
// @author       The 6869net Team
// @match        https://www.instagram.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372270/Instagram%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/372270/Instagram%20Downloader.meta.js
// ==/UserScript==

(function() {
    // If you like my code and want to use it in your creation, feel free -- just cite my website link within your creation somewhere: https://6869net.tk/
    // (A developer's gotta eat! :D)
    function instagramDownloaderCode() {
        var img = document.querySelector("#react-root > section > main > div > div > article > div > div > div > div > img")
        var srcset = img.getAttribute("srcset");
        console.log(srcset);
        var splitsrcset = srcset.split(",");
        var splitsrc = splitsrcset[splitsrcset.length - 1].split(" ");
        var correctsrc = splitsrc[0];
        console.log(correctsrc);
        var downloadbutton = document.createElement("button");
        downloadbutton.setAttribute("onclick", "var link = document.createElement('a');link.download = 'instadl.jpg';link.href = '" + correctsrc + "';document.body.appendChild(link);link.click();document.body.removeChild(link);delete link;");
        downloadbutton.setAttribute("width", "40");
        downloadbutton.setAttribute("height", "40");
        var downloadtextnode = document.createTextNode("DL");
        downloadbutton.appendChild(downloadtextnode);
        var buttonspan = document.querySelector("#react-root > section > main > div > div > article > div > section > span");
        buttonspan.appendChild(downloadbutton);
    }
    // don't run the code until after a second -- until after the page has loaded
    setTimeout(instagramDownloaderCode, 1000);
})();