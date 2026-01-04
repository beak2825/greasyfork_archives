// ==UserScript==
// @name        Remove space between images
// @namespace   https://greasyfork.org/en/users/434434-lagradost
// @match       https://manganelo.com/chapter/*/*
// @match       https://mangakakalot.com/chapter/*/*
// @grant       none
// @version     1.2
// @author      Ost
// @description Removes the space between images on manganelo and mangakakalot
// @downloadURL https://update.greasyfork.org/scripts/395027/Remove%20space%20between%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/395027/Remove%20space%20between%20images.meta.js
// ==/UserScript==
img = document.getElementsByTagName('img');
div = document.getElementsByTagName('div')
setTimeout(function(){ 
    for (var i = 0; i < img.length; i++) {
        img[i].style.margin="0px auto 0";
    }
}, 3000);
//sometimes there's a random div element between the images, this part solves that. (seen on https://manganelo.com/chapter/tnqe284961561858429/chapter_13)
for (var i = 0; i < div.length; i++) {
  if (div[i].style.margin == '10px auto'){div[i].style.margin="0px auto";}
}
