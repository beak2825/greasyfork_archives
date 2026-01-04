// ==UserScript==
// @name         编码侯自动签到
// @namespace    （这里应该填写一个唯一的命名空间，比如作者的网站或邮箱地址）
// @version      1.0.0
// @description  进入编码侯后自动签到
// @author       几何奶酪
// @match        https://www.codinghou.cn/
// @icon         https://www.codinghou.cn/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492422/%E7%BC%96%E7%A0%81%E4%BE%AF%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/492422/%E7%BC%96%E7%A0%81%E4%BE%AF%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用XPath表达式来查找按钮，但XPath在JavaScript中并不常用，且需要额外的库支持
    // 这里假设你要找的是class为'btn box'的div元素
    var button = document.evaluate("//div[@class='btn box']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    // 检查按钮是否存在
    if (button) {
        // 定义一个函数来点击按钮
        function clickButton() {
            // 定义一个变量来标记是否找到了图片
            var found = false;

            // 获取所有img标签
            var images = document.getElementsByTagName('https://cdn.codinghou.cn/coding/pc/icons/box-activate.png');

            // 遍历所有图片，检查它们的src属性是否包含特定URL
            for (var i = 0; i < images.length && !found; i++) {
                var imgSrc = images.item(i).src; // 注意这里要使用item方法获取具体元素
                if (imgSrc.includes('https://cdn.codinghou.cn/coding/pc/icons/box-activate.png')) {
                    found = true; // 如果找到了，设置found为true
                    return; // 结束脚本
                }
            }

            // 如果找到了图片，就不执行点击操作
            if (!found) {
                // 点击按钮
                button.click();
            }
        }

        // 设置一个间隔，每隔1秒钟调用一次函数
        setInterval(clickButton, 1000);
    }
})();