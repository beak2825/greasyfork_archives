// ==UserScript==
// @name        Webtoons.com for Desktop
// @namespace   https://greasyfork.org/users/3363-iceflame
// @description Resizes and downloads higher quality versions of the images on webtoons.com to improve usability on Desktops and Laptops.
// @include     http://*webtoons.com/viewer?*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3227/Webtoonscom%20for%20Desktop.user.js
// @updateURL https://update.greasyfork.org/scripts/3227/Webtoonscom%20for%20Desktop.meta.js
// ==/UserScript==

var allImages = document.getElementsByClassName('_checkVisible');
var totalHeight = 0;

for (i = 0; i < allImages.length; i++) {
    totalHeight += imageList[i].height;
    imageList[i].url = imageList[i].url.replace("?type=q70","");
    allImages[i].src = imageList[i].url;
    allImages[i].width = imageList[i].width;
    allImages[i].height = imageList[i].height;
}

document.getElementById('_viewer') .style.textAlign = 'center';
document.getElementById('_viewer') .style.height = totalHeight + 'px';
document.getElementById('ct') .style.overflow = 'visible';