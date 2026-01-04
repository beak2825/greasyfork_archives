// ==UserScript==
// @name         gImagesAttr
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds dimension informations of the images on thumbnails in Google Images search
// @author       cozen
// @include      http*://www.google.*/*tbm=isch*
// @include      http*://google.*/*tbm=isch*
// @include      https://www.google.*/search?tbm=isch*
// @include      https://google.*/search?tbm=isch*
// @include      https://www.google.co.*/*tbm=isch*
// @include      https://google.co.*/*tbm=isch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412962/gImagesAttr.user.js
// @updateURL https://update.greasyfork.org/scripts/412962/gImagesAttr.meta.js
// ==/UserScript==

function addDimensions(node) {
    let owAtt = node.getAttribute("data-ow"),
        ohAtt = node.getAttribute("data-oh");

    let divAtt = document.createElement('div')
    divAtt.innerText = owAtt + " x " + ohAtt;
    divAtt.style.position = "absolute";
    divAtt.style.width = "50%";
    divAtt.style.color = "#FFF";
    divAtt.style.background = "#000";
    divAtt.style.fontSize = "8px";
    divAtt.classList.add("dimensions");
    divAtt.style.zIndex="+1";


    node.insertBefore(divAtt, node.firstElementChild);
}


(function() {
    'use strict';

    let observer = new MutationObserver( mutations => {
        for (let mutation of mutations) {
            for (let newNode of mutation.addedNodes) {
                addDimensions(newNode)
            }
        }
    });

    let container = document.querySelector(".islrc");
    for (let node of container.children) {
        addDimensions(node);
    }

    observer.observe(container, {childList: true});

})();
