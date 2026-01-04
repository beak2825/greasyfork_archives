// ==UserScript==
// @name         打开本地文件
// @license MIT 
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  打开本地文件。
// @author       qiuchi
// @match       file:///*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467053/%E6%89%93%E5%BC%80%E6%9C%AC%E5%9C%B0%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/467053/%E6%89%93%E5%BC%80%E6%9C%AC%E5%9C%B0%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 查找所有<h3>元素
    var h3Elements = document.getElementsByTagName("h3");

    // 遍历<h3>元素
    for (var i = 0; i < h3Elements.length; i++) {
        var h3Element = h3Elements[i];

        // 获取所有<a>标签
        var links = document.getElementsByTagName("a");

        // 检查元素的文本内容是否为"Problems found"
        if (h3Element.textContent.trim() === "Problems found") {

            // 遍历所有<a>标签
            for (var j = 0; j < links.length; j++) {
                var link = links[j];

                // 获取href属性值
                var href = link.getAttribute("href");

                // 检查是否以@开头
                if (href.startsWith("@")) {
                    // 去除开头的@
                    var filePath = href.substring(1);

                    // 创建新的链接
                    var fileLink = "file://" + filePath;

                    // 检查是否包含行号
                    if (href.includes("##")) {
                        var lineNumber = href.split("##:")[1]; // 提取行号
                        fileLink = fileLink.split("##:")[0];
                        fileLink += "#" + lineNumber; // 将行号添加到链接中
                    }

                    // 将原始链接替换为新链接
                    link.setAttribute("href", fileLink);

                    // 设置在新标签页中打开链接
                    link.setAttribute("target", "_blank");
                }
            }
            break;
        }
    }
}
)();