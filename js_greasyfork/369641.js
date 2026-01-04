// ==UserScript==
// @name         Camp Olympia Image Downloader
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a button to download full size images from CampMinder
// @author       John P. Smith
// @match        https://olympia.campintouch.com/ui/photo/Thumbnail*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/369641/Camp%20Olympia%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/369641/Camp%20Olympia%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const rootFolderName = "Camp Olympia 2018";
    const filenameExtension = ".jpg";

    //Add download button to page
    var input=document.createElement("input");
    input.type="button";
    input.value="Download Camp Images";
    input.onclick = downloadImages;
    input.setAttribute("style", "font-size:20px;position:absolute;top:140px;left:30px;background-color:blue;color:white;border-radius:20px");
    document.body.append(input);

    function downloadImages()
    {
        var albumDate = document.getElementById("pHeaderSummary").innerHTML.replace("Currently viewing ", "");
        var subFolderName = albumDate;
        var imagePrefix = albumDate;

        var imageNumber = 0;
        var thumbnailWrappers = document.getElementsByClassName('cmThumbnailImageWrapper');
        for(var x=0; x<thumbnailWrappers.length; x++){
            var backgroundImage = thumbnailWrappers[x].style.backgroundImage;
            if (backgroundImage != '') {
                backgroundImage = backgroundImage.replace("url(\"", "").replace("\")", ""); //Remove url(" & ")
                backgroundImage = backgroundImage.replace("thumbnail", "zoomin"); //Change thumbnail to zoomin to get full size version

                imageNumber++;
                var imageNumberFormatted = "00" + imageNumber;
                imageNumberFormatted = imageNumberFormatted.substring(imageNumberFormatted.length - 3);
                var filename = rootFolderName + "\\" + subFolderName + "\\" + imagePrefix + "_" + imageNumberFormatted + filenameExtension;
                var result = GM_download(backgroundImage, filename);
            }
        }
    }
})();





