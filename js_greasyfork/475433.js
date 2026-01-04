// ==UserScript==
// @name         自动下载DLsite商品界面图片
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  提取Id，title以及下载url，来下载相关文件，需要修改油猴脚本设置里面的下载模式为api模式，否则无法生成文件夹
// @author       yuewuliuying
// @match        https://www.dlsite.com/maniax/work/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/475433/%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BDDLsite%E5%95%86%E5%93%81%E7%95%8C%E9%9D%A2%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/475433/%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BDDLsite%E5%95%86%E5%93%81%E7%95%8C%E9%9D%A2%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 根据URL获取文件名
    function getFileNameFromUrl(url) {
        var urlParts = url.split('/');
        return urlParts[urlParts.length - 1];
    }

    //自定义下载函数
    function downloadImages(Id, Title, srcArray) {

        // 创建文件夹名称
        var folderName = "[" + Id + "]" + Title;

        // 循环下载每个URL中的文件
        srcArray.forEach(function(src, index) {
            //下载路径的凭借
            const filePath = folderName + "/" + getFileNameFromUrl(src);
            // 使用GM_download函数下载文件
            GM_download({
                url: src,
                name: filePath, // 用函数自动获取下载文件名称
                saveAs: false, // 如果希望用户选择下载位置，可以设置为true
                onerror: function(error) {
                    console.error("Error downloading file:", error);
                }
            });
        });

    }

//运行入口
    //定义空变量
    var Id = "";//内容的编号
    var Title = "";//内容的标题
    const srcArray = [];// 初始化一个空数组来存储图片的url

     // 获取当前页面的 URL，从而获得游戏的Id编号
    const currentURL = window.location.href;
    const matchResult = currentURL.match(/\/product_id\/([A-Za-z0-9]+)/);
    if (matchResult) {
        // 提取的值存储在 matchResult[1] 中
        Id = matchResult[1];
    }

    //提取DLsite上的游戏的标题信息
    const h1Element = document.querySelector('h1[itemprop="name"]');
    if (h1Element) {
        // 提取<h1>元素的文本内容并存储在变量中
        Title = h1Element.textContent.trim();
    }

    // 获取包含data-src的元素，所有的图片的地址
    const Picelements = document.querySelectorAll('.product-slider-data div[data-src]');
    // 遍历元素并将data-src内容添加到数组中
    Picelements.forEach(element => {
        const src = 'https:' + element.getAttribute('data-src');
        srcArray.push(src);
    });

    //调用下载函数下载到本地文件夹
    //downloadImages(Id, Title, srcArray);
    // 控制台输出调试，查看是否获取了需要的相关信息
    //console.log(Id);
    //console.log(Title);
    //console.log(srcArray);

    //生成文件夹
    const button = document.createElement('button');
    button.textContent = '下载图片'; // 按钮上显示的文本
    button.style.backgroundColor = '#53F3F0E6'; //
    button.style.color = 'white'; // 按钮的文本颜色
    button.style.padding = '10px'; // 按钮的内边距
    button.style.borderRadius = '5px'; // 设置边框圆角半径，可以根据需要调整值

    // 添加按钮点击事件监听器
    button.addEventListener('click', function() {
        downloadImages(Id, Title, srcArray);
    });

    // 将按钮添加到页面中的某个元素中
    document.body.appendChild(button);
    if (h1Element) {
        //将按钮附加到这部分之后
        h1Element.parentNode.insertBefore(button, h1Element.nextSibling);
    }

})();
