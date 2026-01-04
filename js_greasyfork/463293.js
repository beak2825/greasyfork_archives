// ==UserScript==
// @name         Candfans Evolved
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  make something new to candfans
// @author       likouw
// @match        https://candfans.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=candfans.jp
// @grant GM_xmlhttpRequest
// @connect video.candfans.jp
// @connect fanty-master-storage.s3.ap-northeast-1.amazonaws.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463293/Candfans%20Evolved.user.js
// @updateURL https://update.greasyfork.org/scripts/463293/Candfans%20Evolved.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        //console.log("now check mask content");
        unmaskUpper();
    }, 1000);
    function unmaskUpper() {
        let upperMasks = document.querySelectorAll('.content-mask,.image-mask');
        for (let i = 0; i < upperMasks.length; ++i) {
            [].forEach.call(upperMasks[i].children, function(el) {
                el.style.visibility = 'hidden';
            });
            // TODO: upperMasks[i].style.backgroundColor = '';
        }
    }

    setInterval(function() {
        //console.log("now clear mask element");
        unmask();
    }, 1000);
    function unmask() {
        var masks = document.querySelectorAll(".secret,.mosaic");

        [].forEach.call(masks, function(el) {
            el.classList.remove("secret");
            el.classList.remove("mosaic");
        });
    }

     setInterval(function() {
        // console.log("now replace secret content");
        replaceSecretImg();
    }, 1000);
    function replaceSecretImg() {
        var imgs = document.querySelectorAll(".thumbnail-img,.content-img,.content-image");

        [].forEach.call(imgs, function(el) {
            let childrens = el.children;
            [].forEach.call(childrens, function(child) {
               if (child.classList.contains('image') || child.tagName === "IMG") {
                   if (child.classList.contains('replaced') || child.lazy != undefined) {
                       return;
                   }

                   if ((child.src != undefined && child.src.includes('secret')) ||
                       (child.style != undefined && child.style.backgroundImage != undefined && child.style.backgroundImage.includes('secret'))) {
                       setUnmaskResource(child);

                       // mark
                       child.classList.add('replaced');
                   }
               }
            });
        });
    }

    function setUnmaskResource(ele) {
        if (ele.src && ele.src.includes('secret')) {
            setUnmaskResourceSrc(ele);
        }
        if (ele.style && ele.style.backgroundImage && ele.style.backgroundImage.includes('secret')) {
            setUnmaskResourceBg(ele);
        }
    }

    function setUnmaskResourceSrc(imageEle) {
        let imgSrc = imageEle.src;
        let thumbnailImg = imgSrc.replace('secret', 'thumbnail');
        let jpgImg = thumbnailImg.replace('jpeg', 'jpg');
        let finalImg = jpgImg;

        GM_xmlhttpRequest({
            method: "GET",
            url: finalImg,
            onload: function(response) {
                // coverage
                if (response.status == 200) {
                    imageEle.src = finalImg;
                }
            },
        });
    }

    function setUnmaskResourceBg(ele) {
        let oriBg = ele.style.backgroundImage;
        let src = oriBg.match(/\((.*?)\)/)[1]?.replace(/('|")/g,'');
        if (src == undefined || src == "") {
            return;
        }
        let finalImg = src.replace('secret', 'thumbnail').replace('jpeg', 'jpg');
        GM_xmlhttpRequest({
            method: "GET",
            url: finalImg,
            onload: function(response) {
                // coverage
                if (response.status == 200) {
                    ele.style.backgroundImage = 'url("' + finalImg + '")';
                }
            },
        });
    }
})();