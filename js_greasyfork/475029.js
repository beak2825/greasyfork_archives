// ==UserScript==
// @name         iconfont-阿里巴巴矢量图标库svg下载
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  svg下载
// @author       Silvio27
// @match        https://www.iconfont.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iconfont.cn
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/475029/iconfont-%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E7%9F%A2%E9%87%8F%E5%9B%BE%E6%A0%87%E5%BA%93svg%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/475029/iconfont-%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E7%9F%A2%E9%87%8F%E5%9B%BE%E6%A0%87%E5%BA%93svg%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Todo 1 直接到导出png格式
    // Todo 2 添加文件名称
    // Todo 3 collections 批量下载

    window.addEventListener('load', function() {
        setTimeout(function() {
            let svgElements = document.getElementsByTagName("svg");
            Array.from(svgElements).forEach((svgElement) => {
                let pId = svgElement.getAttribute('p-id');
                let pp = svgElement.parentElement.parentElement
                // 删除icon-hover
                try {
                    pp.removeChild(pp.getElementsByClassName("icon-cover")[0])
                    pp.removeChild(pp.getElementsByClassName("icon-select-cover")[0])
                } catch(e){
                    console.log(e)

                }

                // 添加点击事件
                pp.setAttribute("onclick",`saveSvgAsFile(${pId})`)
            });
        }, 3000);
    });


    function saveSvgAsFile(pId) {
        const element = document.querySelector(`[p-id="${pId}"]`);
        if (element && element.tagName.toLowerCase() === 'svg') {
            const dp = element.cloneNode(true);
            // 删除无用信息
            try {
                dp.removeAttribute("style")
                dp.removeAttribute("p-id")
                dp.removeAttribute("class")
                let paths = dp.querySelectorAll("path")
                paths.forEach((p) => {
                    p.removeAttribute("p-id")
                })
            } catch(e){
                console.log(e)
            }
            let svgContent = dp.outerHTML
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${pId}.svg`;
            link.click()
            URL.revokeObjectURL(link.href);
        }
    }
    // 使得函数全局可用
    window.saveSvgAsFile = saveSvgAsFile;

})();