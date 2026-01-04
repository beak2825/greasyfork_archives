// ==UserScript==
// @name         meogao222's EH Thumbnail show
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  my EH script, display thumbnails on the list
// @author       You
// @match        https://e-hentai.org/?f_search=*
// @match        https://e-hentai.org/
// @match        https://e-hentai.org/uploader/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458662/meogao222%27s%20EH%20Thumbnail%20show.user.js
// @updateURL https://update.greasyfork.org/scripts/458662/meogao222%27s%20EH%20Thumbnail%20show.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

//    setTimeout(start, 200);
    start();

    function start(){
        var allTrEles = document.getElementsByClassName('itg gltc')[0].childNodes[0].childNodes;

        allTrEles.forEach((ele)=>{
            var gl1c = ele.getElementsByClassName('gl1c glcat')[0];
            var gl2cDiv = ele.getElementsByClassName('gl2c')[0];
            if (gl2cDiv){
                var glThumbEle = gl2cDiv.getElementsByClassName('glthumb')[0];
                var imgEleLink = glThumbEle.childNodes[0].childNodes[0].getAttribute('data-src');
                if (!imgEleLink){
                    imgEleLink = glThumbEle.childNodes[0].childNodes[0].getAttribute('src');
                }
                var thumbEle = document.createElement('img');
                thumbEle.setAttribute('src', imgEleLink);
                gl1c.replaceWith(thumbEle);
                glThumbEle.remove();
            }

        });
    }
})();