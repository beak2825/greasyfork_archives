// ==UserScript==
// @name         Pixiv Origin Image
// @name:zh-cn   Pixiv 原图显示
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Pixiv原图显示
// @author       Faper
// @license      MIT
// @match        http*://www.pixiv.net/*
// @connect      i.pximg.net
// @connect      i-f.pximg.net
// @connect      i-cf.pximg.net
// @icon         http://www.pixiv.net/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/451113/Pixiv%20Origin%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/451113/Pixiv%20Origin%20Image.meta.js
// ==/UserScript==

"use strict";
(function() {
    const throttle = (fn, delay = 500) => {
        let flag = true;
        return (...args) => {
            if (!flag) return;
            flag = false;
            setTimeout(() => {
                fn.apply(this, args);
                flag = true;
            }, delay);
        };
    };
    //替换原图
    const originCallback = () => {
        let imgTags = document.querySelectorAll("a img");
        for(let imgTag of imgTags) {
            const originImg = imgTag.parentElement.href;
            if(/https:\/\/i.pximg.net\/img-original\/img\/[\w|\/]+\.(?:jpg|png)/g.test(originImg)) {
                imgTag.setAttribute("src", originImg);
            }
        }
    }
    //描述图片尺寸
    let sizeFig = [];
    const sizeCallback = () => {
        let imgTags = document.querySelectorAll("figure a img");
        for(let imgTag of imgTags) {
            if(sizeFig.find(x => x == imgTag) != undefined) {
                continue;
            }
            const height = imgTag.attributes.height.value;
            const width = imgTag.attributes.width.value;
            const id = "w-h-create-by-extension";
            const found = document.getElementById(id);
            if(found){
                found.innerText = `${width}\u00D7${height}`;
            }
            else{
                const span = document.createElement("span");
                span.id = "w-h-create-by-extension";
                const textNode = document.createTextNode(`${width}\u00D7${height}`);
                span.appendChild(textNode);
                imgTag.parentNode.parentNode.insertBefore(span, imgTag.parentNode);
                sizeFig.push(imgTag);
            }
        }
    }
    const targetNode = document.querySelector("body");
    const config = {
        childList: true,
        subtree: true,
    }
    const originObserver = new MutationObserver(throttle(originCallback));
    const sizeObserver = new MutationObserver(throttle(sizeCallback));
    originObserver.observe(targetNode, config);
    sizeObserver.observe(targetNode, config);
})();