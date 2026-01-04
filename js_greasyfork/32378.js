// ==UserScript==
// @name         google_plus_image_address_finder
// @namespace    NULL
// @version      0.1
// @description  try to find out the download url of a google plus image
// @author       Simon Shi
// @match        https://plus.google.com/photos/photo/*
// @grant        unsafeWindow
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/32378/google_plus_image_address_finder.user.js
// @updateURL https://update.greasyfork.org/scripts/32378/google_plus_image_address_finder.meta.js
// ==/UserScript==


function get_image()
{
    var image_list = [];

    image_list = unsafeWindow.document.getElementsByClassName("XkWAb-LmsqOc XkWAb-Iak2Lc");
    if(image_list.length === 0){
        console.log("[LS]no image found!!!");
        return 0;
    }
    var image_src = image_list[image_list.length-1].src;
    console.log("[LS]image src = "+image_src);
    var temp_a=document.createElement('a');
    document.body.appendChild(temp_a);
    temp_a.href=image_src.split("=")[0] + "=s0-d-ip";
    temp_a.click();
    document.removeChild(temp_a);
}


(function() {
    'use strict';

    console.log("[LS]Google Plus Image address finder :start");
    get_image();
})();
