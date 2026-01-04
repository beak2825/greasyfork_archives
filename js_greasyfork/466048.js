// ==UserScript==
// @name         Bsearch（intumu.com）
// @namespace    http://tampermonkey.net/
// @version      0.0.11
// @description  bilibili搜索加强版，现网页版不支持复合搜索选框！
// @author       yeayee
// @match        https://search.bilibili.com/*
// @icon        https://static.hdslb.com/mobile/img/512.png
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_openInTab
// @grant      GM_registerMenuCommand
// @grant      GM_setValue
// @grant      GM_getValue
// @run-at     document-end
// @require    https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js
// @require    https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require    https://unpkg.com/axios/dist/axios.min.js
// @connect    search.bilibili.com
// @connect    api.bilibili.com
// @connect    *.bilibili.com

// @license    MIT

// @downloadURL https://update.greasyfork.org/scripts/466048/Bsearch%EF%BC%88intumucom%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/466048/Bsearch%EF%BC%88intumucom%EF%BC%89.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    // grant       GM_getResourceText
    $("head").append($(
        '<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/github-markdown-css/5.2.0/github-markdown.css" media="(prefers-color-scheme: dark)">'
    ));

    // 通过class定位button
    const buttons = document.getElementsByClassName('vui_button vui_button--blue vui_button--lg search-button');

    // 遍历每个button
    for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];

    // 创建新的button元素
    const newButton = document.createElement('button');
    newButton.setAttribute('id', 'newbutton');
    newButton.innerHTML = '按时间+播放量搜索';

    // 将新的button插入到button后面
    button.parentNode.insertBefore(newButton, button.nextSibling);
    };

    const button = document.getElementById('newbutton');

    if (button) {
      button.addEventListener('click', function() {
        // 点击事件处理逻辑
        console.log('newButton click!');
        const inputElements = document.getElementsByClassName('search-input-el'); // 获取所有带有该class的input元素
        let values = [];
        for (let i = 0; i < inputElements.length; i++) {
        values.push(inputElements[i].value); // 将每个input元素的value添加到数组中
        }
        console.log(values[0]); // 打印数组中的值
        var pg =1 
        var url = 'https://api.bilibili.com/x/web-interface/wbi/search/type?page='+pg+'&keyword='+values[0]+'&search_type=video'
        console.log(url)
        let alldata = [];

        // Get current page headers
        const headers = Object.fromEntries(new Headers(document.headers));

        // Define GET request options
        const options = {
            method: 'GET',
            url: url,
            headers: headers,
            responseType: 'json',
            onload: function(response) {
                console.log(response.response);
                var jsonData = JSON.parse(response.response);
                var numPages = jsonData["data"]["numPages"];

                alldata.push(jsonData["data"]["result"])
            }
        };
        // Send GET request using GM_xmlhttpRequest
        GM_xmlhttpRequest(options);
      });
    } else {
      console.log('Button not found!');
    }


})();