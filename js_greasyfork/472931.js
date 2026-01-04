// ==UserScript==
// @name         🚀🚀搜索助手🚀🚀
// @namespace    http://baideye.com/
// @version      1.0.5
// @description  ✅快速切换搜索引擎,无需重复输入
// @author       公众号：白的夜
// @icon         data:image/png;base64,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
 
// @match        *://www.baidu.com/*
// @match        *://www.google.com/*
// @match        *://www.google.com.hk/*
// @match        *://www.bing.com/*
// @match        *://www.sogou.com/*
// @match        *://duckduckgo.com/*
// @match        *://yandex.com/*
// @match        *://www.douyin.com/*
// @match        *://www.zhihu.com/*
// @match        *://search.bilibili.com/*
// @match        *://search.cnki.com.cn/*
 
 
// @grant        unsafeWindow
// @grant        window.onload
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-body
 
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/472931/%F0%9F%9A%80%F0%9F%9A%80%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B%F0%9F%9A%80%F0%9F%9A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/472931/%F0%9F%9A%80%F0%9F%9A%80%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B%F0%9F%9A%80%F0%9F%9A%80.meta.js
// ==/UserScript==
 
const deafultMark = "bd-gg-by-sg-ddg-yandex-dy-zh-blbl";
 
const searchInfo = [
    {
        name: "百度",
        url: "https://www.baidu.com/s?wd=",
        regUrl: /www.baidu.com/i,
        mark: /bd/i,
        regWords: /wd=.*/i,
        isWords: function (str) {
            return str.toString().split("=")[1].split("&")[0];
        },
    },
    {
        name: "谷歌",
        url: "https://www.google.com/search?q=",
        regUrl: /www.google.com/i,
        mark: /gg/i,
        regWords: /\?q=.*/i,
        isWords: function (str) {
            return str.toString().split("=")[1].split("&")[0];
        },
    },
    {
        name: "必应",
        url: "https://www.bing.com/search?q=",
        regUrl: /www.bing.com/i,
        mark: /by/i,
        regWords: /\?q=.*/i,
        isWords: function (str) {
            return str.toString().split("=")[1].split("&")[0];
        },
    },
    {
        name: "搜狗",
        url: "https://www.sogou.com/web?query=",
        regUrl: /www.sogou.com/i,
        mark: /sg/i,
        regWords: /query=.*/i,
        isWords: function (str) {
            return str.toString().split("=")[1].split("&")[0];
        },
    },
    {
        name: "DDG",
        url: "https://duckduckgo.com/?q=",
        regUrl: /duckduckgo.com/i,
        mark: /ddg/i,
        regWords: /\?q=.*/i,
        isWords: function (str) {
            return str.toString().split("=")[1].split("&")[0];
        },
    },
    {
        name: "Yandex",
        url: "https://yandex.com/search/?text=",
        regUrl: /yandex.com/i,
        mark: /yandex/i,
        regWords: /\?text=.*/i,
        isWords: function (str) {
            return str.toString().split("=")[1].split("&")[0];
        },
    },
    {
        name: "抖音",
        url: "https://www.douyin.com/search/",
        regUrl: /www.douyin.com/i,
        mark: /dy/i,
        regWords: /search.*/i,
        isWords: function (str) {
            return str.toString().split("/")[1].split("?")[0];
        },
    },
    {
        name: "知乎",
        url: "https://www.zhihu.com/search?q=",
        regUrl: /www.zhihu.com/i,
        mark: /zh/i,
        regWords: /\?q=.*/i,
        isWords: function (str) {
            return str.toString().split("=")[1].split("&")[0];
        },
    },
    {
        name: "bilibili",
        url: "http://search.bilibili.com/all?keyword=",
        regUrl: /search.bilibili.com/i,
        mark: /blbl/i,
        regWords: /keyword=.*/i,
        isWords: function (str) {
            return str.toString().split("=")[1].split("&")[0];
        },
    },
];
 
//添加浮窗
function addContent() {
    let oDiv = document.querySelector("body").appendChild(document.createElement("div"));
    oDiv.setAttribute("id", "contentBox");
    oDiv.style = `
        position:fixed;
        left:10px;
        top:160px;
        font-size:15px;
        text-align: center;
        color:#477493;
        background: #edf3f7;
        padding: 10px;
        border-radius: 5px;
        z-index:9999999;
    `;
    let oUl = oDiv.appendChild(document.createElement("ul"));
    oUl.style = `
        display: flex;
        flex-direction: column;
        padding: 0px;
        margin: 5px 2px 10px;
    `;
    for (var i = 0; i < searchInfo.length; i++) {
        var search = searchInfo[i];
        if (search.mark.test(GM_getValue("setup_search"))) {
            var oLi = oUl.appendChild(document.createElement("li"));
            oLi.innerHTML = `
                <a href='' id="url-a" style="color:#477493;text-decoration: none;" url='${search.url}'>${search.name}</a>
            `;
            oLi.style = `
                list-style-type: none;
                margin: 3px 0;
            `;
        }
 
    }
    let divBtn = oDiv.appendChild(document.createElement("div"));
    divBtn.style = `    
        display: flex;
        justify-content: space-around;
        align-items: center;
    `;
    divBtn.innerHTML = `
        <span id="btnSet">
            <svg width="17" height="17" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34.0003 41L44 24L34.0003 7H14.0002L4 24L14.0002 41H34.0003Z" fill="none" stroke="#abcbe1" stroke-width="4" stroke-linejoin="round"/><path d="M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z" fill="none" stroke="#abcbe1" stroke-width="4" stroke-linejoin="round"/></svg>
        </span>
        <span id="btnClose">
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="none" stroke="#abcbe1" stroke-width="4" stroke-linejoin="round"/><path d="M29.6567 18.3432L18.343 29.6569" stroke="#abcbe1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.3433 18.3432L29.657 29.6569" stroke="#abcbe1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        `;
 
    let btnSet = document.querySelector("#btnSet");
    let btnClose = document.querySelector("#btnClose");
    btnSet.onclick = function () {
        // let oDiv = document.querySelector("body").appendChild(document.createElement("div"));
        // let divBox = oDiv.appendChild(document.createElement("div"));
        // divBox.innerHTML += `
        //     <div>
        //         <input type="text" value="${GM_getValue("setup_search")}">
        //     </div>
        //     `;
        let sss = prompt("输入需要显示的搜索引擎。格式：" + deafultMark);
        if (sss) {
            GM_setValue("setup_search", sss);
        }
        console.log("用户设置" + GM_getValue("setup_search"));
    }
    btnClose.onclick = function () {
        oDiv.style = `display:none;`;
    }
}
 
 
// ------------------------------------------------------
'use strict';
 
//初始化设置
if (!GM_getValue("setup_search")) {
    GM_setValue("setup_search", deafultMark);
}
 
//添加浮窗
addContent();
 
//监听<a> 点击添加搜索词
let aElement = document.querySelectorAll("#url-a");
for (let value of aElement) {
    value.addEventListener("click", function () {
        //获取搜索词
        let nowUrl = window.location.href;
        let nowWords = "";
        for (i = 0; i < searchInfo.length; i++) {
            let search = searchInfo[i];
            if (search.regUrl.test(nowUrl)) {
                console.log("regUrl匹配通过");
                let grep = search.regWords;
                let str = nowUrl.match(grep);
                // console.log(str)//
                if (str === null) {
                    nowWords = "";
                } else {
                    var keyword = search.isWords(str);
                    nowWords = decodeURIComponent(keyword);;
                }
            }
        }
        //添加
        url = value.getAttribute("url");
        value.setAttribute("href", url + nowWords);
    });
    value.addEventListener("contextmenu", function () {
        //获取搜索词
        let nowUrl = window.location.href;
        let nowWords = "";
        for (i = 0; i < searchInfo.length; i++) {
            let search = searchInfo[i];
            if (search.regUrl.test(nowUrl)) {
                console.log("regUrl匹配通过");
                let grep = search.regWords;
                let str = nowUrl.match(grep);
                // console.log(str)//
                if (str === null) {
                    nowWords = "";
                } else {
                    var keyword = search.isWords(str);
                    nowWords = decodeURIComponent(keyword);;
                }
            }
        }
        //添加
        url = value.getAttribute("url");
        value.setAttribute("href", url + nowWords);
    });
}
 
 
console.log("当前存储的" + GM_getValue("setup_search"));
 
 
 
 
 
 
 
 
 