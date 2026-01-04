// ==UserScript==
// @name        Baidu2Google
// @name:zh-CN  百度搜索切换到Google
// @description change search engine from baidu to google
// @description:zh-CN   百度搜索携带搜索词快速切换到google搜索
// @namespace   https://github.com/beijiyouyu/Browser
// @license     MIT
// @author      北极有鱼
// @include     *://www.baidu.com/*
// @run-at document-end
// @version     2.0.0
// @downloadURL https://update.greasyfork.org/scripts/416458/Baidu2Google.user.js
// @updateURL https://update.greasyfork.org/scripts/416458/Baidu2Google.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let domain = window.location.host

    if (domain !== 'www.baidu.com') {
        return
    }
    console.log('Baidu2Google is running...')  // 控制台输出运行状态

    let insert = `
        <div class="engine" id="google">
          <a href="javascript:void(0);" onclick="window.location.href = 'https://www.google.com/search?q=' + document.getElementById('kw').value">换google</a>
        </div>
    `

    // 先生成div
    let insertDom = document.createElement('div')  // 生成待插入的元素
    let documentDom = document.getElementById('form')  // 获取需要插入的位置
    insertDom.innerHTML = insert  // 元素赋值
    documentDom.appendChild(insertDom)
    // 再添加样式
    let style = `
        #google {
            position:absolute;
            right:-136px;
            width:85px;
            text-align:center;
            line-height:40px;
            top:50%;
            transform:translate(-50%,-50%);
            border-radius:24px;
            font-size:14px;
            background:#fbbc05;
        }
        #google:hover {
            background:#d2a00e;
        }
        #google a {
            color:white;
            text-decoration:none;
            display:inline-block;
            width: 100%;
        }
    `

    let styleDom = document.createElement('style')
    styleDom.innerHTML = style
    documentDom.appendChild(styleDom)
// 打完收功
})();