// ==UserScript==
// @name         聚合搜索
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  整合百度、Google、微信、Bing、知乎、知网空间搜索，提高搜索效率。在原作者基础上自行修改了部分内容，原作者链接：https://greasyfork.org/zh-CN/scripts/436613-聚合搜索。原原作者链接：https://greasyfork.org/zh-CN/scripts/401457-聚合搜索
// @author       Peng Shiyu, 海洋空氣
// @website      https://www.pengshiyu.com/

// @match        *://www.baidu.com/s*
// @match        *://www.google.com/search*
// @match        *://weixin.sogou.com/weixin*
// @match        *://www.bing.com/search*
// @match        *://www.zhihu.com/search*
// @match        *://search.cnki.com.cn/Search/Result*

// @grant        unsafeWindow
// @grant        window.onload
// @run-at       document-end

// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/436652/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/436652/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

// @require      file:///Users/hina/workspace/www.farthe.com/code/chrome/search/index.js


// 搜索网址配置
const urlMapping = [{
        name: '百度',
        searchUrl: 'https://www.baidu.com/s?wd=',
        keyName: 'wd',
        testUrl: /https:\/\/www.baidu.com\/s.*/,
    },
    {
        name: 'Google',
        searchUrl: 'https://www.google.com/search?q=',
        keyName: 'q',
        testUrl: /https:\/\/www.google.com\/search.*/,
    },
    {
        name: '微信文章',
        searchUrl: 'https://weixin.sogou.com/weixin?type=2&s_from=input&query=',
        keyName: 'query',
        testUrl: /https:\/\/www.baidu.com\/s.*/,
    },
    {
        name: 'Bing',
        searchUrl: 'https://www.bing.com/search?ensearch=0&q=',
        keyName: 'q',
        testUrl: /https:\/\/www.bing.com\/search.*/,
    },
    {
        name: '知乎',
        searchUrl: 'https://www.zhihu.com/search?type=content&q=',
        keyName: 'q',
        testUrl: /https:\/\/www.google.com.hk\/search.*/,
    },    
    {
        name: '知网空间',
        searchUrl: 'https://search.cnki.com.cn/Search/Result?content=',
        keyName: 'q',
        testUrl: /https:\/\/fsou.cc\/search.*/,
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
    div.style = "position: fixed; top: 160px; left: 20px; width: 100px; background-color: #EEEEEE; font-size: 12px;z-index: 99999;"
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
        let defaultStyle = style + "color: #333333 !important;";
        let hoverStyle = style + "color: #ffffff !important; background-color: #666666;";

        let a = document.createElement('a')
        a.innerText = item.name
        a.style = defaultStyle
        a.id = index
        a.href = item.searchUrl + getKeywords()

        // 鼠标移入移除效果，相当于hover
        a.onmouseenter = function () {
            this.style = hoverStyle
        }
        a.onmouseleave = function () {
            this.style = defaultStyle
        }

        div.appendChild(a)
    }
};

(function () {
    'use strict';
    window.onload = addBox;
})();