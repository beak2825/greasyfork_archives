// ==UserScript==
// @name         Download ChatGPT record
// @namespace    http://tampermonkey.net/
// @version      0.5.3
// @description  以html文件的形式保存当前页面下ChatGPT的对话记录：Save the chat record of ChatGPT on the current page in the form of html file
// @author       YYForReal
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/459853/Download%20ChatGPT%20record.user.js
// @updateURL https://update.greasyfork.org/scripts/459853/Download%20ChatGPT%20record.meta.js
// ==/UserScript==

(function() {
    'use strict';
(function(){
    // 原本官网的域名，用于连接资源
    // const ResourceDomain = "https://chat.openai.com/"
    // 使用Gitee仓库内托管的资源
    const ResourceDomain = "https://gitee.com/friendArt/download-ChatGPT-record/raw/master/resource/"
    function downloadInit(){
        // DOM 深拷贝，防止影响页面
        const head = document.head.cloneNode(true)
        const body = document.body.cloneNode(true)

        // 替换所有的href链接
        let links = head.querySelectorAll("link");
        for (let link of links) {
            if (link.getAttribute("href").indexOf("http") !== 0) {
                link.setAttribute("href", ResourceDomain + link.getAttribute("href"));
            }
        }

        // 移除head内部的script代码
        let scripts = head.querySelectorAll("script");
        for (let scriptDom of scripts) {
            scriptDom.parentElement.removeChild(scriptDom);
            // 如果需要继续使用的话可以拼接保留
            // if (link.getAttribute("href").indexOf("http") !== 0) {
            //     link.setAttribute("href", ResourceDomain + link.getAttribute("href"));
            // }
        }

        // 单独移除最新的CSS样式
        links = head.querySelectorAll('link[rel="stylesheet"]');
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            link.parentNode.removeChild(link);
        }

        // 单独引入CSS样式
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://gitee.com/friendArt/download-ChatGPT-record/raw/master/resource/_next/static/css/c770e01054031fe0.css';
        head.appendChild(link);


        // 移除body底部栏
        let bottom = body.querySelector('.absolute.bottom-0')
        bottom.parentNode.removeChild(bottom)

        // 修改样式，使之可以滚动
        let overflowDoms = body.querySelectorAll('.overflow-hidden')
        for (let dom of overflowDoms){
            dom.classList.remove("overflow-hidden")
        }

        // 拿到修改之后的字符串文本
        let mainStr = body.getElementsByTagName('main')[0].cloneNode(true).outerHTML;
        let headStr = head.outerHTML;

        // 去除所有的<script>
        // 获取script标签内的内容
        let reg = /<script[^>]*>([^<]|<(?!\/script))*<\/script>/gmi
        let res = mainStr.match(reg)
        // 如果具有script标签
        if (res != null) {
            res.forEach((ele) => {
                mainStr = mainStr.replace(ele,'')
            })
        }
        res = headStr.match(reg)
        if (res != null) {
            res.forEach((ele) => {
                headStr = headStr.replace(ele,'')
            })
        }

        // 去除头部的跨域标签
        headStr = headStr.replace(/crossorigin/igm,"")
        // 获取风格模式（light mode / dark mode）
        let htmlDom = document.querySelector('html')
        let mode = htmlDom.getAttribute('style')
        let htmlClass = htmlDom.className;

        // 增加copy code功能
        let copyCodeScript = `<script>
        let buttons = document.querySelectorAll('button.flex.ml-auto.gap-2')
        let timer = null;
        buttons.forEach(button => {
            button.addEventListener('click',(e)=>{
                // 不使用event对象找DOM会出现闭包、e.target是事件源、currentTarget是监听的对象
                let button = e.currentTarget
                let codeBlock = button.parentNode.nextSibling.children[0];
                const textArea = document.createElement("textarea");
                textArea.value = codeBlock.textContent;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                textArea.remove();
                button.innerHTML = button.innerHTML.replace(/Copy code/igm,'Copied!');
                if(timer == null){
                    timer = setTimeout(()=>{
                        button.innerHTML = button.innerHTML.replace(/Copied!/igm,'Copy code');
                        clearTimeout(timer);
                        timer = null
                    },1000)
                }
            })
        });
        </script>`

        return `<html class="${htmlClass}" style="${mode}" >${headStr} <body> ${mainStr} ${copyCodeScript}</body> </html>`
    }

    // 定义按钮
    var downloadButton = document.createElement("button");
    downloadButton.className = "download-button"
    downloadButton.innerHTML = "Download Record";

    // 设置按钮元素的样式
    downloadButton.style.position = "fixed";
    downloadButton.style.padding = "5px";
    downloadButton.style.bottom = "100px";
    downloadButton.style.right = "20px";
    downloadButton.style.backgroundColor = "skyblue"
    downloadButton.style.border = "1px solid black";
    downloadButton.style.borderRadius = "10px";
    downloadButton.style.zIndex = 99;

    // 为按钮添加点击事件
    downloadButton.addEventListener("click", function () {
        // 定义html代码字符串
        // var htmlCode = "<html><body><h1>Example HTML code</h1></body></html>";
        var htmlCode = downloadInit();
        // 创建Blob对象
        var blob = new Blob([htmlCode], {
            type: "text/html"
        });

        // 获取时间，用于文件命名
        var today = new Date();
        var month = (today.getMonth() + 1).toString().padStart(2, '0');
        var day = today.getDate().toString().padStart(2, '0');


        // 创建下载链接
        var downloadLink = document.createElement("a");
        downloadLink.download = `Chat-${document.title}(${month}${day}).html`
        downloadLink.href = URL.createObjectURL(blob);

        // 点击链接，实现下载
        downloadLink.click();

        // 由于修改了DOM，所以需要重新刷新页面
        // window.location.reload();
    });

    // 将按钮添加到页面中
    document.body.appendChild(downloadButton);
})()



})();