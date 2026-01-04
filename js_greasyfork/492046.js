// ==UserScript==
// @name         Old Reddit Inline Images
// @namespace    http://tampermonkey.net/
// @version      1.50
// @description  Displays image posts and replies inline in threads on the Old Reddit interface.
// @author       Spencer Ayers-Hale
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @match        https://*.reddit.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492046/Old%20Reddit%20Inline%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/492046/Old%20Reddit%20Inline%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var num = document.getElementsByTagName("a").length; //number of links on page
    var cnt = 0; //current link number
    var newLink;

    //Read image metadata
    const getMeta = (url, cb) => {
        const img = new Image();
        img.onload = () => cb(null, img);
        img.onerror = (err) => cb(err);
        img.src = url;
    };

    while(cnt < num){
        const link = document.getElementsByTagName("a")[cnt]; //get original link

        //replace text with image
        //comment images
        if(link.innerText=="<image>"){
            //get image width
            getMeta(link.href, (err, img) => {
                //keep oringal size
                if(img.naturalWidth < 480){
                    link.innerHTML="<img src=\""+link.href+"\">"
                }
                //scale down large images
                else{
                    link.innerHTML="<img src=\""+link.href+"\" width=\"480\">"
                }
            });
        }
        //linked post images
        else if(link.innerText==link.href && link.href.indexOf("preview.redd.it") > -1){
            //get image width
            getMeta(link.href, (err, img) => {
                //keep oringal size
                if(img.naturalWidth < 480){
                    link.innerHTML="<img src=\""+link.href+"\">"
                }
                //scale down large images
                else{
                    link.innerHTML="<img src=\""+link.href+"\" width=\"840\">"
                }
            });
        }

        cnt++;
    }

})();