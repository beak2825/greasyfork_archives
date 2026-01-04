// ==UserScript==
// @name         聚合搜索
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  整合大部分网页搜索，提高搜索效率
// @author       Peng Shiyu
// @website      https://www.pengshiyu.com/

// @match        *://www.baidu.com/s*
// @match        *://cn.bing.com/search*
// @match        *://www.so.com/s*
// @match        *://www.sogou.com/web*
// @match        *://www.google.com.hk/search*
// @match        *://www.google.com/search*
// @match        *://fanyi.sogou.com/*

// @grant        unsafeWindow
// @grant        window.onload
// @downloadURL https://update.greasyfork.org/scripts/401457/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/401457/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

// @require      file:///Users/hina/workspace/www.farthe.com/code/chrome/search/index.js


// 搜索网址配置
const urlMapping = [{
        name: '百度',
        searchUrl: 'https://www.baidu.com/s?wd=',
        keyName: 'wd',
        testUrl: /https:\/\/www\.baidu\.com\/s.*/,
    },
    {
        name: '必应',
        searchUrl: 'https://cn.bing.com/search?q=',
        keyName: 'q',
        testUrl: /https:\/\/cn\.bing\.com\/search.*/,
    },
    {
        name: '360',
        searchUrl: 'https://www.so.com/s?q=',
        keyName: 'q',
        testUrl: /https:\/\/www\.so\.com\/s.*/,
    },
    {
        name: '搜狗',
        searchUrl: 'https://www.sogou.com/web?query=',
        keyName: 'query',
        testUrl: /https:\/\/www\.sogou\.com\/web.*/,
    },
    {
        name: 'Google',
        searchUrl: 'https://www.google.com/search?q=',
        keyName: 'q',
        testUrl: /https:\/\/www.google.com\/search.*/,
    },
    {
        name: 'Google.hk',
        searchUrl: 'https://www.google.com.hk/search?q=',
        keyName: 'q',
        testUrl: /https:\/\/www.google.com.hk\/search.*/,
    },
    {
        name: '翻译',
        searchUrl: 'https://fanyi.sogou.com/?keyword=',
        keyName: 'keyword',
        testUrl: /https:\/\/fanyi.sogou.com\/.*/,
    }
];

// JS获取url参数
function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let pairs = query.split("&");
    for (let pair of pairs) {
        let [key, value] = pair.split("=");
        if (key == variable) {
            return decodeURIComponent(value);
        }
    }
    return null;
};

// 从url中获取搜索关键词
function getKeywords() {
    let keywords = '';

    for (let item of urlMapping) {
        if (item.testUrl.test(window.location.href)) {
            keywords = getQueryVariable(item.keyName);
            break
        }
    }

    console.log(keywords);
    return keywords;
};

// 添加节点
function addBox() {
    // 主元素
    var div = document.createElement('div')
    div.id = 'search-app-box'
    div.style = "position: fixed; top: 120px; left: 20px; width: 80px; background-color: #EEEEEE; font-size: 12px;z-index: 99999;"
    // document.body.appendChild(div)
    document.body.insertAdjacentElement("afterBegin", div);

    // 标题
    let title = document.createElement('span')
    title.innerText = "聚合搜索"
    title.style = "display: block; text-align: center; margin-top: 10px; font-size: 14px; font-weight: bold;"
    div.appendChild(title)

    // 搜索列表
    for (let index in urlMapping) {

        let item = urlMapping[index];

        // 样式
        let style = "display: block; padding: 10px 0 10px 20px; text-decoration: none;";
        let defaultStyle = style + "color: #333333;";
        let hoverStyle = style + "color: #ffffff; background-color: #666666;";

        let a = document.createElement('a')
        a.href = 'javascript:;'
        a.innerText = item.name
        a.style = defaultStyle
        a.id = index

        // 鼠标移入移除效果，相当于hover
        a.onmouseenter = function () {
            this.style = hoverStyle
        }
        a.onmouseleave = function () {
            this.style = defaultStyle
        }
        a.onclick = function () {
            window.location.href = item.searchUrl + getKeywords();
        }

        div.appendChild(a)
    }
};

(function () {
    'use strict';
    window.onload = addBox;
})();