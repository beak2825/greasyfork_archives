// ==UserScript==
// @name         GetSome"m3u8"
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  获取网页中的m3u8资源
// @author       You
// @match        91porn.com/*
// @match        91porny.com/*
// @match        hsex.icu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474023/GetSome%22m3u8%22.user.js
// @updateURL https://update.greasyfork.org/scripts/474023/GetSome%22m3u8%22.meta.js
// ==/UserScript==


function removeIllegalCharacters(str) {
  // 定义非法字符的正则表达式
  var illegalCharsRegex = /[<>:"\\/|?*\x00-\x1F]/g;

  // 删除非法字符
  var cleanedStr = str.replace(illegalCharsRegex, '');

  return cleanedStr;
}

function isM3U8Url(url) {
  // 剔除问号及其后面的参数
  const cleanUrl = url.split('?')[0];

  // 使用正则表达式判断URL是否以.m3u8结尾
  const regex = /\.m3u8$/;
  return regex.test(cleanUrl);
    
}

function getvalue(input11,input22)
{
// 获取网页标题文本内容
        var title = document.title;
        title=title.replace(" Chinese homemade video","");
        title=removeIllegalCharacters(title);
        input22.value=title;
        console.log('找到标题:', title);
        var sources = document.getElementsByTagName('source');
        var resources = window.performance.getEntries();
        for (var i = 0; i < resources.length; i++) {
            var tmpurl=resources[i].name;
            console.log(tmpurl);
            if (isM3U8Url(tmpurl))
            {
                input11.value=tmpurl;
            }
        }
    /*
        for (var i = 0; i < sources.length; i++)
        {
            var source = sources[i];
            var src = source.getAttribute('src');
            console.log("FindM3u8:",src)
            if (isM3U8Url(src))
            {
                input11.value=src;
            }
        }*/
}

(function() {
   'use strict';

    // 创建悬浮窗元素
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = '50%';
    div.style.right = '0';
    div.style.transform = 'translateY(-50%)';
    div.style.width = '400px';
    div.style.height = '200px';
    div.style.borderRadius = '10px';
    div.style.backgroundColor = 'white';
    div.style.border = '2px solid black';
    div.style.zIndex = '9999';

    // 创建容纳输入字段的容器
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.height = '100%';

    // 创建输入字段
    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.placeholder = 'Input 1';
    input1.style.margin = '10px';
    input1.style.width = '100%';

    const input2 = document.createElement('input');
    input2.type = 'text';
    input2.placeholder = 'Input 2';
    input2.style.margin = '10px';
    input2.style.width = '100%';

    // 添加输入字段到容器
    container.appendChild(input1);
    container.appendChild(input2);

    // 添加容器到悬浮窗
    div.appendChild(container);

    // 创建按钮
    const button = document.createElement('button');
    button.style.position = 'absolute';
    button.style.top = '0';
    button.style.left = '0';
    button.style.width = '20px';
    button.style.height = '20px';
    button.innerText = '-';
    button.onclick = function() {
        if (input1.style.width === '1%') {
            input1.style.width = '100%';
            input2.style.width = '100%';
        } else {
            input1.style.width = '1%';
            input2.style.width = '1%';
        }
        if (div.style.width === '20px') {
            div.style.width = '400px';
            div.style.height = '200px';
        } else {
            div.style.width = '20px';
            div.style.height = '20px';
        }
    };

    // 添加按钮到悬浮窗
    div.appendChild(button);

    // 创建按钮2
    const button2 = document.createElement('button');
    button2.style.position = 'absolute';
    button2.style.top = '0';
    button2.style.left = '30px';
    button2.style.width = '20px';
    button2.style.height = '20px';
    //button2.innerText = 'Log';
    button2.onclick = function() {
        getvalue(input1,input2);
    };

    // 创建刷新图标
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.innerHTML = '<svg t="1691772491941" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4004" width="32" height="32"><path d="M960 630.4c-12.8-3.2-25.6 3.2-32 12.8-76.8 204.8-320 307.2-544 227.2-224-80-342.4-307.2-265.6-512 76.8-204.8 320-307.2 544-227.2 92.8 32 172.8 92.8 224 172.8l-92.8 0c-12.8 0-25.6 9.6-25.6 22.4 0 12.8 9.6 22.4 25.6 22.4l153.6 0c12.8 0 25.6-9.6 25.6-22.4l0-140.8c0-12.8-9.6-22.4-25.6-22.4-12.8 0-25.6 9.6-25.6 22.4l0 89.6c-57.6-86.4-140.8-150.4-246.4-188.8-249.6-86.4-518.4 28.8-608 256-86.4 230.4 44.8 486.4 294.4 572.8 249.6 86.4 518.4-28.8 608-256C979.2 649.6 972.8 636.8 960 630.4z" p-id="4005"></path></svg>';

    button2.appendChild(svg);
    // 添加按钮2到悬浮窗
    div.appendChild(button2);


    // 添加悬浮窗到文档主体
    document.body.appendChild(div);
    // Wait for the page to finish loading
/*网页加载完成后执行的程序*/
    window.addEventListener("load",function(){
getvalue(input1,input2);

    });
   
})();