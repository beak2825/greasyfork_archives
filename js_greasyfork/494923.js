// ==UserScript==
// @name        🔥拓展增强🔥 妖火图片加强（改）
// @namespace    http://yaohuo.me/
// @version      0.47
// @description  妖火图片加强!!! 改 烟花小神 的
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @match        https://yaohuo.me/bbs-**
// @match        https://www.yaohuo.me/bbs-**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yaohuo.me
// @author       夜猎
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/494923/%F0%9F%94%A5%E6%8B%93%E5%B1%95%E5%A2%9E%E5%BC%BA%F0%9F%94%A5%20%E5%A6%96%E7%81%AB%E5%9B%BE%E7%89%87%E5%8A%A0%E5%BC%BA%EF%BC%88%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/494923/%F0%9F%94%A5%E6%8B%93%E5%B1%95%E5%A2%9E%E5%BC%BA%F0%9F%94%A5%20%E5%A6%96%E7%81%AB%E5%9B%BE%E7%89%87%E5%8A%A0%E5%BC%BA%EF%BC%88%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function offSet(curEle) {
        var totalLeft = null;
        var totalTop = null;
        var par = curEle.offsetParent;
        //首先把自己本身的相加
        totalLeft += curEle.offsetLeft;
        totalTop += curEle.offsetTop;
        //现在开始一级一级往上查找，只要没有遇到body，我们就把父级参照物的边框和偏移相加
        while (par){
            if (navigator.userAgent.indexOf("MSIE 8.0") === -1){
                //不是IE8我们才进行累加父级参照物的边框
                totalTop += par.clientTop;
                totalLeft += par.clientLeft;
            }
            //把父级参照物的偏移相加
            totalTop += par.offsetTop;
            totalLeft += par.offsetLeft;
            par = par.offsetParent;
        }
        return {left: totalLeft,top: totalTop};
    }

    function isMobileDevice() {
        return /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    $(document).ready(function() {
        var maxPreviewSize = isMobileDevice() ? 580 : 680;   // 默认限制图片最大高度

        var contentImages = document.querySelectorAll('.content img');
        var recontentImages = document.querySelectorAll('.recontent img');
        var recontentVideos = document.querySelectorAll('.content video');
        var thirdImages = []
        for (let i = 0; i < contentImages.length; i++) {
            thirdImages.push(contentImages[i])
        }
        for (let i = 0; i < recontentImages.length; i++) {
            thirdImages.push(recontentImages[i])
        }
        for (let i = 0; i < recontentVideos.length; i++) {
            thirdImages.push(recontentVideos[i])
        }
        GM_addStyle(`.content video{max-width: max-content;}`);
        for (let i = 0; i < thirdImages.length; i++) {
            var thirdImage = thirdImages[i];
            thirdImage.style.maxHeight = `${maxPreviewSize}px`;
            if (thirdImage.parentNode.tagName == 'A' && thirdImage.parentNode.href.indexOf('https://yaohuo.me/bbs/upload/') == 0) {
                thirdImage.parentNode.onclick = function() {
                    return false;
                };
            }

            thirdImage.onclick = function() {
                if(this.tagName === "VIDEO") return;
                // 使用toggle函数根据当前样式来决定添加还是移除max-height属性
                if (this.style.maxHeight) {
                    this.style.maxHeight = null; // 移除max-height
                } else {
                    this.style.maxHeight = `${maxPreviewSize}px`; // 添加max-height
                    let offTop = offSet(this).top;
                    // 计算新的滚动位置，使图片位于视口偏下150px处
                    window.scrollTo({
                        top: offTop + 50,
                        behavior: "smooth"
                    });
                    //this.scrollIntoView({behavior: "smooth"});
                }
            };
        }
    });
})();