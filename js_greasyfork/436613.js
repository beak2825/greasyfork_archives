// ==UserScript==
// @name         聚合搜索
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  整合大部分网页搜索，提高搜索效率。在原作者基础上自行修改了部分内容，原作者链接：https://greasyfork.org/zh-CN/scripts/401457-聚合搜索
// @author       Peng Shiyu, 海洋空氣
// @website      https://www.pengshiyu.com/

// @match        *://www.baidu.com/s*
// @match        *://*.bing.com/search*
// @match        *://www.google.com.hk/search*
// @match        *://www.google.com/search*

// @grant        window.onurlchange
// @run-at       document-end

// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/436613/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/436613/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

// 针对百度不重载网页
if (window.onurlchange === null) {
    window.addEventListener('urlchange', OnURLChange)
}

// 搜索网址配置
const urlMapping = [{
        name: '百度',
        searchUrl: 'https://www.baidu.com/s?wd=',
        keyName: 'wd',
        testUrl: /https:\/\/www.baidu.com\/s.*/,
    },
    {
        name: '必应国内版',
        searchUrl: 'https://www.bing.com/search?ensearch=0&q=',
        keyName: 'q',
        testUrl: /https:\/\/www.bing.com\/search.*/,
    },
    {
        name: '必应国际版',
        searchUrl: 'https://www.bing.com/search?ensearch=1&q=',
        keyName: 'q',
        testUrl: /https:\/\/www.bing.com\/search.*/,
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
    }
];

// JS 获取 url 参数
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

// 从 url 中获取搜索关键词
function getKeywords() {
    let keywords = '';

    for (let item of urlMapping) {
        if (item.testUrl.test(window.location.href)) {
            keywords = getQueryVariable(item.keyName);
            break
        }
    }
    return keywords;
};

// 添加节点
function addBox() {
    // 主元素
    var div = document.createElement('div');
    div.id = 'search-app-box';
    div.style = "position: fixed; top: 160px; left: 20px; width: 100px; background-color: #EEEEEE; font-size: 12px;z-index: 99999;";
    // document.body.appendChild(div);
    document.body.insertAdjacentElement("afterBegin", div);

    // 标题
    let title = document.createElement('span');
    title.innerText = "聚合搜索";
    title.style = "display: block; text-align: center; margin-top: 10px; font-size: 14px; font-weight: bold;";
    div.appendChild(title);

    // 搜索列表
    for (let index in urlMapping) {

        let item = urlMapping[index];

        // 样式
        let style = "display: block; padding: 10px 0 10px 20px; text-decoration: none;";
        let defaultStyle = style + "color: #333333 !important;";
        let hoverStyle = style + "color: #ffffff !important; background-color: #666666;";

        let a = document.createElement('a');
        a.innerText = item.name;
        a.style = defaultStyle;
        a.id = index;
        a.href = item.searchUrl + getKeywords();

        // 鼠标移入移除效果，相当于 hover
        a.onmouseenter = function () {
            this.style = hoverStyle;
        }
        a.onmouseleave = function () {
            this.style = defaultStyle;
        }

        div.appendChild(a);
    }
};

function OnURLChange() {
    // 删除原菜单，重新添加
    document.getElementById('search-app-box').remove();
    addBox();
}

(function () {
    'use strict';
    window.onload = addBox;
})();