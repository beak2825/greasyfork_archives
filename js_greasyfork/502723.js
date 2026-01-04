// ==UserScript==
// @name         Thumb Everything
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Automatically applies the [thumb] tag to every image in a 3dmm.com post.
// @author       Plopilpy
// @match        https://*.3dmm.com/*
// @icon         https://*.3dmm.com/favicon_3dmmcom_logo.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502723/Thumb%20Everything.user.js
// @updateURL https://update.greasyfork.org/scripts/502723/Thumb%20Everything.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var parent, wrapper, i;
    var curImg = document.querySelectorAll(`.threedmm_postbit_message img:not(.threedmm_postbit_message .threedmm-thumb img, img.inlineimg)`);
    for(i = 0; i < curImg.length;++i){

    if(curImg[i].getBoundingClientRect().height > 100 && curImg[i].getBoundingClientRect().width > 100){
        curImg[i].style.maxWidth = "300px";
        curImg[i].style.maxHeight = "300px";

        parent = curImg[i].parentNode;
        wrapper = document.createElement('a');
        wrapper.classList.add("threedmm-thumb");
        wrapper.href = curImg[i].src;
        wrapper.setAttribute("target", "_blank")

        parent.replaceChild(wrapper, curImg[i]);
        wrapper.appendChild(curImg[i]);

    }
    }
})();