// ==UserScript==
// @name         Nintendo Amiibo Hero Image Downloader
// @version      0.2
// @description  Download Nintendo amiibo hero's image with one click
// @icon         https://www.nintendo.com/images/mobile-icon/appicon_152.png
// @license      GPL version 3
// @encoding     utf-8
// @date         01/27/2018
// @modified     01/27/2018
// @author       Franklin Chen
// @supportURL   http://franklin614.com
// @include      https://www.nintendo.com/amiibo/detail/*
// @grant        GM_setClipboard
// @copyright	 2018, Franklin Chen
// @namespace https://greasyfork.org/users/4544
// @downloadURL https://update.greasyfork.org/scripts/37864/Nintendo%20Amiibo%20Hero%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/37864/Nintendo%20Amiibo%20Hero%20Image%20Downloader.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function getheroImgUrl() {
        var heroDiv = document.getElementById('detail-hero');
        if(heroDiv){
            var heroImg = heroDiv.getElementsByClassName('panel-img')[0];
            return heroImg.style.backgroundImage.slice(4, -1).replace(/"/g, "");
        }
    }

    function getFileName() {
        return window.location.href.replace("https://www.nintendo.com/amiibo/detail/", "");
    }

    function addDownloadButton() {
        var nav = document.getElementsByClassName('secondary-nav')[0];
        if(nav){
            var ullist = nav.getElementsByTagName('ul')[0];
            var firstChild = ullist.getElementsByTagName('li')[0];
            var newli = document.createElement('li');
            newli.className = "games";
            newli.innerHTML = '<a id="heroImageLink" href="' + getheroImgUrl() + '" tabindex="0" download="' + getFileName() + '">Download hero image</a>';
            ullist.insertBefore(newli, firstChild);

            var link = document.getElementById("heroImageLink");
            link.addEventListener("click", copyToClipboard);
        }
    }

    function addFileNameInput() {
        var breadcrumb = document.getElementsByClassName('breadcrumbs')[0];
        var newSpan = document.createElement('span');
        newSpan.innerHTML = '<input type="text" value="' + getFileName() + '" id="fileNameInput">';
        breadcrumb.append(newSpan);
    }

    function copyToClipboard() {
        try {
            var fileName = getFileName();
            GM_setClipboard (fileName);
            alert("Copied the file name: " + fileName);
        } catch (err) {
            alert('Cannot copy text');
        }
    }

    addDownloadButton();
})();