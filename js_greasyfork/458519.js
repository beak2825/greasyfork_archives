// ==UserScript==
// @name 自动缩小图片
// @namespace https://greasyfork.org/zh-CN/users/459661-cycychenyi
// @version 0.1
// @description 自动缩小图片到原图的 20%。图片处于缩小状态时，点击可以放大到原图。图片处于原图状态时，点击可以缩小图片。
// @author cycychenyi
// @match https://www.google.com/
// @downloadURL https://update.greasyfork.org/scripts/458519/%E8%87%AA%E5%8A%A8%E7%BC%A9%E5%B0%8F%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/458519/%E8%87%AA%E5%8A%A8%E7%BC%A9%E5%B0%8F%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

function zoomOutAllImages(percent) {
    for (const image of getImages()) {
        zoomOut(image, percent);
    };
}

function addClickFunctionForAllImages(percent) {
    for (const image of getImages()) {
        addClickFunction(image, percent);
    }
}

function getImages() {
    return document.getElementsByTagName('img');
}

function addClickFunction(image, percent) {
    image.onclick = function() {
        if (inOriginalState(this)) {
            zoomOut(this, percent);
        } else {
            zoomIn(this);
        }
    };
}

function inOriginalState(image) {
    return image.style.maxWidth === '100%';
}

function zoomOut(image, percent) {
    image.style.maxWidth = percent;
    image.style.cursor = 'zoom-in';
}

function zoomIn(image) {
    image.style.maxWidth = '100%';
    image.style.cursor = 'zoom-out';
}

zoomOutAllImages('20%');
addClickFunctionForAllImages('20%');
