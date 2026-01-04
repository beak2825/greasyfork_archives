// ==UserScript==
// @name         Quick Search
// @namespace    quick-search
// @homepage     https://github.com/WhyWhatHow/powertoys4browser
// @supportURL   https://github.com/WhyWhatHow/powertoys4browser/issues
// @author       whywhathow
// @version      1.9
// @icon         https://raw.githubusercontent.com/WhyWhatHow/powertoys4browser/master/icons/quick-search.ico
// @description  Quick search for Google,google image, google scholar, duckduckgo, twitter,  GitHub.... You don't need to enter the whole links, you just need to use `g keyword`  to google search, `yt keyword`to youtube.com search. and don't worry about like 'yt ' , you just will go to youtube.com. nothing will change. 
// @match        *://*/*
// @grant        GM_notification
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/464329/Quick%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/464329/Quick%20Search.meta.js
// ==/UserScript==


const DEFAULT_SEARCH_ENGINE = "https://www.google.com/search?q=";
const searchEngines = {};

/**
 *  初始化 搜索引擎 配置信息
 */
function initSearchEngines() {

    const jsonData = {
        "phind": {
            "shortcut": "ph",
            "url": "https://phind.com/search?q="
        },

        "google": {
            "shortcut": "g",
            "url": "https://www.google.com/search?q="
        },
        "googleimages": {
            "shortcut": "gi",
            "url": "https://www.google.com/search?tbm=isch&q="
        },
        "bing": {
            "shortcut": "b",
            "url": "https://www.bing.com/search?q="
        },
        "bingimages": {
            "shortcut": "bi",
            "url": "https://www.bing.com/images/search?q="
        },
        "duckduckgo": {
            "shortcut": "d",
            "url": "https://duckduckgo.com/?q="
        },
        "wikipedia": {
            "shortcut": "w",
            "url": "https://wikipedia.org/w/index.php?search="
        },
        "youtube": {
            "shortcut": "yt",
            "url": "https://www.youtube.com/results?search_query="
        },
        "amazon": {
            "shortcut": "a",
            "url": "https://www.amazon.com/s?k="
        },
        "twitter": {
            "shortcut": "tw",
            "url": "https://twitter.com/search?q="
        },
        "googlescholar": {
            "shortcut": "s",
            "url": "https://scholar.google.com/scholar?q="
        },
        "arxiv": {
            "shortcut": "x",
            "url": "https://arxiv.org/search/?query="
        },
        "ebay": {
            "shortcut": "e",
            "url": "https://www.ebay.com/sch/i.html?_nkw="
        },
        "stackoverflow": {
            "shortcut": "so",
            "url": "https://stackoverflow.com/search?q="
        },
        "github": {
            "shortcut": "gh",
            "url": "https://github.com/search?q="
        },
        "linkedin": {
            "shortcut": "li",
            "url": "https://www.linkedin.com/search/results/all/?keywords="
        },
        "reddit": {
            "shortcut": "r",
            "url": "https://www.reddit.com/search/?q="
        },
        "wolframalpha": {
            "shortcut": "wa",
            "url": "https://www.wolframalpha.com/input/?i="
        },
        "steam": {
            "shortcut": "st",
            "url": "https://store.steampowered.com/search/?term="
        }
    };

    for (const [key, value] of Object.entries(jsonData)) {
        searchEngines[value.shortcut] = value.url;
    }
}

/***
 * 消息通知
 */
function showNotification(title, options) {
    // 检查浏览器是否支持通知
    if (!('Notification' in window)) {
        console.log('浏览器不支持通知');
        return;
    }
    // 检查通知权限
    if (Notification.permission === 'granted') {
        // 显示通知
        const notification = new Notification(title, options);

        // 点击通知时执行回调函数
        if (options && options.onClick) {
            notification.addEventListener('click', options.onClick);
        }
    } else if (Notification.permission !== 'denied') {
        // 请求通知权限
        Notification.requestPermission((permission) => {
            if (permission === 'granted') {
                // 显示通知
                const notification = new Notification(title, options);

                // 点击通知时执行回调函数
                if (options && options.onClick) {
                    notification.addEventListener('click', options.onClick);
                }
            }
        });
    }
}

/**
 * 判断是否是readwise 的插件版本
 * 是readwise 插件部分 返回true ,不是返回false
 * @returns {boolean}
 */
function isReadwise() {
    var tagName = document.activeElement.tagName;
    if ("READWISE-TOOLTIP-CONTAINER" === tagName) {
        console.log("-----------------------true---------------------")
        return true;
    }
    return false;
}

/**
 * 判断是否是 需要忽略的部分, 比如说 input textarea, 以及部分browser 插件 example: readwise
 */
function isIgnored() {
    if (!isInput() && !isReadwise()) {
        return true;
    }
    return false;
}

/***
 * 光标判断 是否是在输入框 input ,textarea
 */
function isInput() {
    var tagName = document.activeElement.tagName;
    console.log(tagName + "---------------------+");
    if (document.activeElement.tagName.toLowerCase() == "input" || document.activeElement.tagName.toLowerCase() == "textarea") {
        return true;
    } else if (document.activeElement.tagName.toLowerCase() == "div" && document.activeElement.contentEditable == "true") {
        return true;
    } else {
        return false;
    }
}

/**
 * 获取url的hostname, 即 homepage
 * @param {string} url
 */
function gengerateHomepage(url) {
    const homepageUrl = url.split("/").slice(0, 3).join("/");
    return homepageUrl;
}

/**
 *  // todo user determine open new window, or just default window
 *  页面跳转
 * @param url
 */
function redirect(url) {
    console.log("-----------------------------------search url --------------------------");
    console.log(url);
    // todo user determine open new window, or just default window
    window.location.href = url;
    // window.open(url, '_blank');
    // window.open(url);
}

/**
 * 输入窗口判断
 */
function running() {
    console.log("runing........................")
    // 弹出输入窗口
    var search = prompt(" Quick search:   ^-_-^ ");
    // 如果用户输入了内容，则进行搜索
    if (search !== null) {
        var parts = search.trim().split(" ");
        var engine = parts.shift().toLowerCase();
        var keyword = parts.join(" ");
        // 处理keyword 为空, 直接进行go to home page 
        var url = searchEngines[engine];
        if (!url) {
            // default search
            url = DEFAULT_SEARCH_ENGINE;
            keyword = engine;
        }
        console.log(url);
        if (!keyword) {
            url = gengerateHomepage(searchEngines[engine]);
        } else {
            url = searchEngines[engine] + keyword;
        }
        showNotification("now searching, please wait.....")
        redirect(url);
    }
}

/**
 * 1. init search engine
 * 2. check is in input
 */
(function () {
    'use strict';
    console.log('------------------------------------------------------')

    console.log("---------------------quick search start -------------------")
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 'g') {
            return;
        }
        if (event.altKey && event.shiftKey && event.key === 'g') {
            return;
        }
        if (event.key === 'g' && isIgnored()) {
            initSearchEngines();
            running();
        }
    }, true);
})();

// hints : js 匿名hanshu 执行 是 (function(){})();(function(){}) 只是定义了一个匿名函数. fuck!
