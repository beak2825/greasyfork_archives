// ==UserScript==
// @name         强制使用紫色qpt头像
// @namespace    https://github.com/linkedlist771
// @description  中文
// @license      MIT
// @include      /^https://chat\.openai\.com/.*/
// @version      1.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467403/%E5%BC%BA%E5%88%B6%E4%BD%BF%E7%94%A8%E7%B4%AB%E8%89%B2qpt%E5%A4%B4%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/467403/%E5%BC%BA%E5%88%B6%E4%BD%BF%E7%94%A8%E7%B4%AB%E8%89%B2qpt%E5%A4%B4%E5%83%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
var link = "https://s3.bmp.ovh/imgs/2023/05/29/c98e0e162aabf086.png";
var change = false;
var text = "";
var circle = false;
var shadow = false;

document.addEventListener("DOMNodeInserted", function() {
    if(!change){
        setTimeout(() => {
            let textelements = document.querySelectorAll('.flex.flex-col.w-full.py-2');
            let element = textelements[0];
            let textarea = element.querySelector('textarea');
            textarea.value = text;
        }, 500);
        change = !change;
    }

    function removeOverlayImages(elementSVG) {
        var prevElement = elementSVG.previousSibling;
        while(prevElement && prevElement.tagName === 'IMG') {
            elementSVG.parentNode.removeChild(prevElement);
            prevElement = elementSVG.previousSibling;
        }
    }

        let elementsSVG = document.querySelectorAll('.flex.flex-col.relative.items-end svg[viewBox="0 0 41 41"]');
    elementsSVG.forEach(function(elementSVG) {
        var imgElement;
        var existingImgElement = elementSVG.previousSibling;
        if (existingImgElement && existingImgElement.tagName === 'IMG') {
            imgElement = existingImgElement;
        } else {
            imgElement = document.createElement("img");
            if (elementSVG) {
                removeOverlayImages(elementSVG);
                elementSVG.parentNode.insertBefore(imgElement, elementSVG);
                elementSVG.style.display = "none";
            }
        }
        imgElement.src = link;
        if(circle){imgElement.style.borderRadius = "14px";}
        if(shadow){imgElement.style.boxShadow = "0 2px 4px rgba(0,0,0,6)";}
    });

    let elementsRound = document.querySelectorAll('.relative.p-1.rounded-sm.text-white.flex.items-center.justify-center');
    elementsRound.forEach(function (elementRound) {
        elementRound.style.padding = '0';
        if (circle) {
            elementRound.style.borderRadius = "14px";
        }
    });
});

})();