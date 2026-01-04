// ==UserScript==
// @name         Replace background-images with <img> tag
// @description  Replaces elements with "background-image" inline style with a separate img tag with src pointing to that image. That allows right-click on the image to copy URL & share conveniently.
// @namespace    replbackgroundiwithimgtag
// @version      1.0.4
// @author       k3abird
// @include      *
// @exclude      https://steamcommunity.com/*
// @downloadURL https://update.greasyfork.org/scripts/421254/Replace%20background-images%20with%20%3Cimg%3E%20tag.user.js
// @updateURL https://update.greasyfork.org/scripts/421254/Replace%20background-images%20with%20%3Cimg%3E%20tag.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const els = document.querySelectorAll("[style]");
    let reURL = /url\(['"]*(.*?)['"]*\)/;

    let replacedCnt = 0;
    els.forEach((el) => {
        // skip img tags
        if (el.tagName == "IMG") {
          return;
        }
      
        const elSt = el.style;
        if (elSt.backgroundImage != "" && elSt.backgroundPosition == "") {
            const m = el.style.backgroundImage.match(reURL);
            if (m != null && m.length > 1) {
                const cs = window.getComputedStyle(el);
                //if (cs.backgroundSize != "cover") {
                //    return // does not have cover, do not replace
                //}
              
                // remove original background image
                elSt.backgroundImage = "";
                // ensure position relative on parent
                elSt.position = "relative";
                
                // append a child <img>
                const img = document.createElement("img")
                img.src = m[1];
                img.style.position = "absolute";
                img.style.display = "inline";
                img.style.visibility = "visible";
                img.style.left = img.style.top = "0";
                img.style.zIndex = -1;
                // img.style.width = img.style.height = "100%";
                // if (cs.width != "" && cs.width != "0px") {
                //     img.style.width = cs.width;
                // } else {
                //     img.style.width = "100%";
                // }
                if (cs.height != "" && cs.height != "0px") {
                    img.style.height = cs.height;
                } else {
                    img.style.height = "100%";
                }
                el.appendChild(img);
                replacedCnt++;
            }
        }
    });

    if (replacedCnt > 0) {
        console.log("k3a: fixed "+replacedCnt+"/"+els.length+" elements with background-image by appending img child");
    }
})();