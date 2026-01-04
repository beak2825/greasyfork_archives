// ==UserScript==
// @name         去除网页中图片的Webp格式转换以便于OneNote复制粘贴
// @version      0.1.1
// @description  自动将网页中引用路径用@转换为Webp的图片，去除转换的部分，以便于复制粘贴到不支持webp的笔记软件中（如OneNote）。推荐只在使用时打开此插件，这样在不需要复制的时候，仍使用 Webp格式，获得更快的网页加载速度。
// @author       CWBeta
// @include     *://*/*
// @icon         https://www.google.com/s2/favicons?domain=www.onenote.com
// @namespace    https://greasyfork.org/users/670174
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467055/%E5%8E%BB%E9%99%A4%E7%BD%91%E9%A1%B5%E4%B8%AD%E5%9B%BE%E7%89%87%E7%9A%84Webp%E6%A0%BC%E5%BC%8F%E8%BD%AC%E6%8D%A2%E4%BB%A5%E4%BE%BF%E4%BA%8EOneNote%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/467055/%E5%8E%BB%E9%99%A4%E7%BD%91%E9%A1%B5%E4%B8%AD%E5%9B%BE%E7%89%87%E7%9A%84Webp%E6%A0%BC%E5%BC%8F%E8%BD%AC%E6%8D%A2%E4%BB%A5%E4%BE%BF%E4%BA%8EOneNote%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function ReplaceImageSrc()
    {
        let images =  document.getElementsByTagName("img");
        for(var idx in images)
        {
            let image = images[idx];
            console.log(image);
            let newSrc = ""
            let dataSrc = image.getAttribute("data-src");
            let src = image.src;
            if (dataSrc == undefined)
            {
                newSrc = src.split('@')[0];
            }
            else
            {
                newSrc = dataSrc.split('@')[0];
            }
            console.log("Replace \"" + image.src + "\" to \"" + newSrc + "\"");
            image.src = newSrc;
            image.setAttribute("data-src", newSrc);
        }
        console.log("替换完成!");
    }

    window.onload = function(){setTimeout(ReplaceImageSrc, 1000)};

})();