// ==UserScript==
// @name         国家中小学智慧平台教材、备课资料等文本资料下载
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  下载国家中小学智慧平台上的教材和备课资源中的文本资料
// @author       Mr.Z
// @compatible   Chrome
// @compatible   Firefox
// @compatible   Edge
// @compatible   Safari
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_download
// @run-at       document-start
// @license      MIT
// @match        **/syncClassroom/classActivity**
// @match        **/tchMaterial/detail**
// @match        **/qualityCourse?**
// @match        **/syncClassroom/prepare/detail?**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/512688/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E5%B9%B3%E5%8F%B0%E6%95%99%E6%9D%90%E3%80%81%E5%A4%87%E8%AF%BE%E8%B5%84%E6%96%99%E7%AD%89%E6%96%87%E6%9C%AC%E8%B5%84%E6%96%99%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/512688/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E5%B9%B3%E5%8F%B0%E6%95%99%E6%9D%90%E3%80%81%E5%A4%87%E8%AF%BE%E8%B5%84%E6%96%99%E7%AD%89%E6%96%87%E6%9C%AC%E8%B5%84%E6%96%99%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let data = {
        "pdf_url": "",
        "fileName": "",
    }
    GM_setValue('dataInfo', data);
    let oldFetch = unsafeWindow.fetch;
    function hookFetch(url, init) {
        if (url.endsWith('.pdf')) {
            let hrefurl = window.location.href;
            let fileName = ""
            
                let links = document.querySelectorAll(".fish-breadcrumb-link")
                if(links){
                    let len = links.length

                if (len >= 2) {
                    fileName = links[len - 2].text + "-" + links[len - 1].text
                }

                let butens = document.getElementsByClassName("style-module_active_YItIU")
                if (butens.length) {
                    fileName += "-" + butens[0].textContent
                }
                butens = document.getElementsByClassName("study-list-item-active")
                if (butens.length) {
                    fileName += "-" + butens[0].textContent
                }
                }

            

            data = {
                "pdf_url": url.replace('ndr-private', 'ndr'),
                "fileName": fileName,
            }
            GM_log("猪猪侠：", data)
            GM_setValue('dataInfo', data);
        }
        // 这里进行提交内容劫持
        return oldFetch(url, init);
    }
    unsafeWindow.fetch = hookFetch;







    // 在网页中添加元素
    function addElementToPage() {
        // 创建一个新的按钮元素并添加一个唯一的类名
        var button = document.createElement('button');
        button.classList.add('tm-beautiful-button');

        // 设置按钮的文本内容
        button.textContent = '下载当前资料';

        // 为按钮添加一些样式
        var style = document.createElement('style');
        style.textContent = `
        .tm-beautiful-button {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            padding: 10px 20px;
            font-size: 30px !important; /* 使用!important来确保字体大小不会被覆盖 */
            color: white;
            background-color: #4CAF50;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s ease;
            z-index: 9999;
        }

        .tm-beautiful-button:hover {
            background-color: #45a049;
        }
    `;

        // 将样式添加到文档的<head>中
        document.head.appendChild(style);

        // 为按钮添加点击事件监听器
        button.addEventListener('click', function () {
            let dataInfo = {
                "pdf_url": "",
                "fileName": "",
            }

            // let data = {
            //     "pdf_url": "",
            //     "fileName": "",
            // }
            let hrefurl = window.location.href;
            // 教材页面
            if (hrefurl.includes("/tchMaterial/detail")) {
                
                let furl = document.getElementById('pdfPlayerFirefox').src
                let Uurl = new URL(furl);
                let fileurl = Uurl.searchParams.get("file")
                
                let fileName = document.querySelectorAll("span.fish-breadcrumb-link")[0].textContent
                console.log(fileName)
                dataInfo = {
                    "pdf_url": fileurl.replace('ndr-private', 'ndr'),
                    "fileName": fileName,
                }

                // 课程资源界面
            } else{
                GM_log("读取")
                dataInfo = data = GM_getValue('dataInfo')
                GM_log("datainfo:", dataInfo)
            }

            
            GM_log("猪猪侠last:", dataInfo)
            GM_download({
                url: dataInfo.pdf_url,
                name: `${dataInfo.fileName}.pdf`,
            });
        });

        // 将按钮添加到文档的<body>中
        document.body.appendChild(button);
    }
    // 等待页面加载完成后再添加元素
    window.addEventListener('load', addElementToPage);


})();