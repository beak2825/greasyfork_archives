// ==UserScript==
// @name         故宫博物院水印去除
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除故宫博物院藏品水印，免打开新网页浏览
// @author       weixiaorucimeimiao
// @match        *.dpm.org.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473573/%E6%95%85%E5%AE%AB%E5%8D%9A%E7%89%A9%E9%99%A2%E6%B0%B4%E5%8D%B0%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/473573/%E6%95%85%E5%AE%AB%E5%8D%9A%E7%89%A9%E9%99%A2%E6%B0%B4%E5%8D%B0%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout (function() {
        const watermark4 = document.querySelector("#watermark4");
        if (watermark4) {
            watermark4.style.display = "none"; // 隐藏水印
        }
    }, 100);

    function adjustment() {
        const oldEmbed = document.querySelector("embed"); // 去除上次嵌入的内容
        if (oldEmbed) {
            oldEmbed.remove();
        }
        const imgElement = document.querySelector("div.boximg > div.foucs > div > div > img"); // 原主图
        let src = imgElement.getAttribute("custom_tilegenerator"); // 获取图片源链接
        if (imgElement && src) {
            document.querySelector("div.boximg > div.foucs").style.height = "660px"; // 主图高度
            const rightList = document.querySelector("div.boximg > div.rightlist");
            if (rightList) {
                rightList.style.height = "660px";
            }
            const embedElement = document.createElement("embed"); // 创建嵌入元素
            embedElement.style.height = "660px";
            embedElement.style.width = "100%";
            if (src.startsWith("http://")) {
                src = src.replace("http://", "https://");
            }
            embedElement.setAttribute("src", src);
            imgElement.parentNode.insertBefore(embedElement, imgElement.nextSibling); // 将<embed>元素添加在<img>主图元素后面
            function adjustButtonAndHideImage() { // 待调用
                const Btn = document.querySelector(".pic > .fdj"); // 放大镜按钮
                if (Btn) {
                    Btn.style = "position: absolute; bottom: 1%; right: 1%; width: 25px; height: 25px; margin-top: 170px; margin-left: 134px; background: url('/Public/static/themes/image/lyc/fdj.png') center center no-repeat"; // 按钮置于右下
                    Btn.addEventListener("click", function() {
                        window.open(src, "_blank"); // 按钮添加链接
                    });
                }
                imgElement.style.display = "none"; // 隐藏原图
            }
            setTimeout(adjustButtonAndHideImage, 200); // 在200毫秒后调用adjustButtonAndHideImage函数
            window.onload = function() {
                setTimeout(adjustButtonAndHideImage, 200); // 网页加载后在200毫秒调用adjustButtonAndHideImage函数
            };
        }
    }
    adjustment(); // 调用函数

    const rightlist = document.querySelector("#hl_content > div > div.boximg > div.rightlist > div");
    rightlist.addEventListener("click", function() {
        adjustment(); // 调用函数
    });
})();