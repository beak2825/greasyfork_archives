// ==UserScript==
// @name         新火
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  用于谷歌首页左上角悬浮一个搜索框，一键去特定信息源搜索信息
// @author       氦客船长<guangzhi_tan@qq.com>
// @match        https://*.google.com.hk/*
// @match        https://*.google.com/*
// @grant        none
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443818/%E6%96%B0%E7%81%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/443818/%E6%96%B0%E7%81%AB.meta.js
// ==/UserScript==

const urlList = [
    {
        _id: 1,
        tag: "future",
        name: "百度指数",
        url: "https://index.baidu.com/v2/main/index.html#/trend/{searchKW}?words={searchKW}",
    },
    {
        _id: 2,
        tag: "history",
        name: "WayBack Machine",
        url: "https://web.archive.org/*/{searchKW}",
    },
    {
        _id: 3,
        tag: "future",
        name: "谷歌趋势",
        url: "https://trends.google.com/trends/explore?geo=CN&q={searchKW}",
    },
    {
        _id: 4,
        name: "百度百科",
        tag: "universal",
        url: "https://cn.bing.com/search?q={searchKW} site:baike.baidu.com",
    },

    {
        _id: 5,
        name: "维基百科",
        tag: "universal",
        url: "https://zh.wikipedia.org/wiki/{searchKW}",
    },
    {
        _id: 6,
        name: "Wikipedia",
        tag: "universal",
        url: "https://en.wikipedia.org/wiki/{searchKW}",
    },
    {
        _id: 7,
        name: "MBA智库",
        tag: "universal",
        url: "https://wiki.mbalib.com/wiki/Special:Search?search={searchKW}",
    },
];

// ## init
const init = () => {
    setTimeout(function () {
        $("body").append(`
        <input
        id="myInput"
        style=' background:rgba(241, 243, 244,0.5);
        overflow: hidden;
        z-index: 9999;
        position: fixed;
        top: 0px;
        padding:5px;
        text-align:center;
        width: 175px;
        height: 22px;
        border:none;
        border-radius:10px'>
       `);

        // 监听回车事件
        $("#myInput").keydown(function (e) {
            let userInput = e.target.value;
            if (e.keyCode == 13) {
                // 回车执行搜索
                search(userInput);
            }
        });
    }, 1000);
};

init();

// ## main
const search = async (value) => {
    for (let index = 0; index < urlList.length; index++) {
        const element = urlList[index];
        element.url = element.url.replaceAll("{searchKW}", value);
        await sleep(20);
        window.open(`${element.url}`);
    }
};

// ## other
const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
};
