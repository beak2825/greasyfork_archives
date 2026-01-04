// ==UserScript==
// @name         自用:代码随想录站点优化
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  站点优化
// @author       You
// @match        https://programmercarl.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=programmercarl.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471881/%E8%87%AA%E7%94%A8%3A%E4%BB%A3%E7%A0%81%E9%9A%8F%E6%83%B3%E5%BD%95%E7%AB%99%E7%82%B9%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/471881/%E8%87%AA%E7%94%A8%3A%E4%BB%A3%E7%A0%81%E9%9A%8F%E6%83%B3%E5%BD%95%E7%AB%99%E7%82%B9%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


// Get all elements with the class "option-box"
function removeElementByImageSource(src) {
    const element = document.querySelector(`img[src="${src}"]`);
    if (element) {
        element.remove();
    } else {
        console.log(`未找到匹配的图片元素，src: ${src}`);
    }
}

const optionBoxes = document.querySelectorAll('.option-box');

optionBoxes.forEach((optionBox) => {
    const text = optionBox.textContent.trim();
    if (text !== "侧边栏" && text.indexOf("一篇") === -1) {
        optionBox.remove();
    } else {
        optionBox.style.opacity = 0.4;
    }
});

removeElementByImageSource('/assets/img/训练营.5fb0409d.png');
removeElementByImageSource('/assets/img/网站星球宣传海报.dcf08b7f.jpg');
