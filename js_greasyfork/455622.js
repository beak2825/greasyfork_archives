// ==UserScript==
// @name         Fame Parties Image Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to download full size images from Fame Parties
// @author       John P. Smith
// @match        https://www.fameparties.net/proofing/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/455622/Fame%20Parties%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/455622/Fame%20Parties%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const rootFolderName = "Fame Party Images";
    const filenameExtension = ".jpg";

    //Add download button to page
    var input=document.createElement("input");
    input.type="button";
    input.value="Download Images";
    input.onclick = downloadImages;
    input.setAttribute("style", "font-size:20px;position:absolute;top:70px;left:330px;background-color:#4BC5D7;color:white;border-radius:20px");
    document.body.append(input);

    function downloadImages()
    {
        var subFolderName = "Christmas 2022";
        var imagePrefix = "FameParty_Christmas2022";

        var imageNumber = 0;
        var thumbnailWrappers = document.getElementsByClassName('image-grid__image');
        for(var x=0; x<thumbnailWrappers.length; x++){
            var backgroundImage = thumbnailWrappers[x].style.backgroundImage;
            if (backgroundImage != '') {
                 backgroundImage = backgroundImage.replace("url(\"", "").replace("\")", ""); //Remove url(" & ")
                 backgroundImage = backgroundImage.replace("_large", "_xlarge"); //Change to large to get full size version

                 imageNumber++;
                 var imageNumberFormatted = "00" + imageNumber;
                 imageNumberFormatted = imageNumberFormatted.substring(imageNumberFormatted.length - 3);
                 var filename = rootFolderName + "\\" + subFolderName + "\\" + imagePrefix + "_" + imageNumberFormatted + filenameExtension;
                var result = GM_download(backgroundImage, filename);
            }
        }
    }
})();