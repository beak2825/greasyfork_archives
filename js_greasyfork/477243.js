// ==UserScript==
// @name         weibo 微博聊天图片防撤回
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  简单的图片暂存功能，监听最新的聊天并保存图片在网页上，点击view来查看
// @author       Xrit0515
// @license      MIT
// @match        https://api.weibo.com/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477243/weibo%20%E5%BE%AE%E5%8D%9A%E8%81%8A%E5%A4%A9%E5%9B%BE%E7%89%87%E9%98%B2%E6%92%A4%E5%9B%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/477243/weibo%20%E5%BE%AE%E5%8D%9A%E8%81%8A%E5%A4%A9%E5%9B%BE%E7%89%87%E9%98%B2%E6%92%A4%E5%9B%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log('test');
    // Your code here...
    const imageDiv = `<div
                    id="image-div"
                    style="width: 50px; height: 20px; background-color: white; transition: all 0.3s ease-in-out;position:absolute;z-index:99999; max-height:100vh; left:300px;overflow: hidden;"
                    onclick="toggleExpand()"
                    >View</div>`;
window.toggleExpand = function toggleExpand() {
    var div = document.getElementById('image-div');
    var isNotExpanded = div.style.width === '50px';
    div.style.width = isNotExpanded ? '400px' : '50px';
    div.style.overflow = isNotExpanded ? 'scroll' : 'hidden';
    div.style.height = isNotExpanded ? 'auto' : '20px';
}



setInterval(function () {
    if(!document.querySelector('#image-div')){
        document.querySelector('.message').insertAdjacentHTML('afterend', imageDiv);
    }
    let originalElement = document.querySelector('.message ul li:last-child');
    if(originalElement){
        if (originalElement.querySelector('.large_img_container') && !originalElement.classList.contains('generated')) {

            let clonedElement = originalElement.cloneNode(true);
            //remove all attributes
            let attributeNames = clonedElement.getAttributeNames();
            for (const attrName of attributeNames) {
                clonedElement.removeAttribute(attrName);
            }
            let imgURL = clonedElement.querySelector('.large_img_container img').src;
            imgURL = imgURL.replace('https:', '');
            imgURL = imgURL.replace('msget_thumbnail','msget');
            clonedElement.querySelector('.large_img_container img').src = imgURL;
            document.querySelector('#image-div').appendChild(clonedElement);
            originalElement.classList.add('generated');
        }
    }
}, 200);
})();