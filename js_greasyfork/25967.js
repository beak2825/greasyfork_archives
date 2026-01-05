// ==UserScript==
// @name         Teknoseyir Resim Linklerini Gosterici
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  try to take over the world!
// @author       You
// @match        https://teknoseyir.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25967/Teknoseyir%20Resim%20Linklerini%20Gosterici.user.js
// @updateURL https://update.greasyfork.org/scripts/25967/Teknoseyir%20Resim%20Linklerini%20Gosterici.meta.js
// ==/UserScript==

(function() {
    'use strict';
    ImageLinkAdd();

    function ImageLinkAdd()
    {
        var galleryDiv = document.querySelector(".gallery");
        var numberOfImgChildren = galleryDiv.getElementsByTagName("img").length;
        var element = document.createElement("div");
        for(var i = 0;i<numberOfImgChildren;i++){

            var url = galleryDiv.getElementsByTagName("img")[i];

            if(url!==null){
                var imgLink = url.getAttribute("src");
                if(imgLink.includes(".jpeg") || imgLink.includes(".jpg")){
                    if(imgLink.includes("598x") || imgLink.includes("x598") || imgLink.includes("250x") || imgLink.includes("x250")){
                        imgLink = imgLink.slice(0,-12);
                        imgLink = imgLink.concat(".jpg");
                    }
                }

                if(imgLink.includes(".png")){
                    if(imgLink.includes("598x") || imgLink.includes("x598") || imgLink.includes("250x") || imgLink.includes("x250")){
                        imgLink = imgLink.slice(0,-12);
                        imgLink = imgLink.concat(".png");
                    }
                }

                if(imgLink.includes(".gif")){
                    if(imgLink.includes("598x") || imgLink.includes("x598") || imgLink.includes("250x") || imgLink.includes("x250")){
                        imgLink = imgLink.slice(0,-12);
                        imgLink = imgLink.concat(".gif");
                    }
                }

                var testAelement = document.createElement("a");
                testAelement.setAttribute("href",imgLink);
                var brElement = document.createElement("br");
                element.appendChild(testAelement);
                element.appendChild(brElement);
                testAelement.appendChild(document.createTextNode(imgLink));
                testAelement.setAttribute("target", "_blank");
                var z = document.querySelectorAll('div[id^="gallery-"] img');
                z[i].appendChild(element);

            }
        }
        galleryDiv = document.querySelector('div[id^="gallery-"]');
        galleryDiv.appendChild(element);
    }
})();