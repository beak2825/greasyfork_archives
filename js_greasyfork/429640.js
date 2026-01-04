// ==UserScript==
// @name         🔥持续更新🔥 简书 jianshu.com 广告完全过滤、人性化脚本优化：Greener系列的新产品，有口皆碑超好用。
// @namespace    https://github.com/adlered
// @version      1.0.1
// @description  ⚡️拥有数项独家功能的最强简书脚本，不服比一比⚡️|🕶继CSDNGreener的又一力作，一样的实用美观|🖥主页滑动自动加载，无需手动点击|
// @author       Adler
// @connect      www.jianshu.com
// @include      *://*.jianshu.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@1.11.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery.cookie/jquery.cookie.js
// @require      https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js
// @contributionURL https://doc.stackoverflow.wiki/web/#/21?page_id=138
// @grant        GM_addStyle
// @note         21-07-20 1.0.1 去除更多广告
// @note         21-07-20 1.0.0 初版发布
// @downloadURL https://update.greasyfork.org/scripts/429640/%F0%9F%94%A5%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%F0%9F%94%A5%20%E7%AE%80%E4%B9%A6%20jianshucom%20%E5%B9%BF%E5%91%8A%E5%AE%8C%E5%85%A8%E8%BF%87%E6%BB%A4%E3%80%81%E4%BA%BA%E6%80%A7%E5%8C%96%E8%84%9A%E6%9C%AC%E4%BC%98%E5%8C%96%EF%BC%9AGreener%E7%B3%BB%E5%88%97%E7%9A%84%E6%96%B0%E4%BA%A7%E5%93%81%EF%BC%8C%E6%9C%89%E5%8F%A3%E7%9A%86%E7%A2%91%E8%B6%85%E5%A5%BD%E7%94%A8%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/429640/%F0%9F%94%A5%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%F0%9F%94%A5%20%E7%AE%80%E4%B9%A6%20jianshucom%20%E5%B9%BF%E5%91%8A%E5%AE%8C%E5%85%A8%E8%BF%87%E6%BB%A4%E3%80%81%E4%BA%BA%E6%80%A7%E5%8C%96%E8%84%9A%E6%9C%AC%E4%BC%98%E5%8C%96%EF%BC%9AGreener%E7%B3%BB%E5%88%97%E7%9A%84%E6%96%B0%E4%BA%A7%E5%93%81%EF%BC%8C%E6%9C%89%E5%8F%A3%E7%9A%86%E7%A2%91%E8%B6%85%E5%A5%BD%E7%94%A8%E3%80%82.meta.js
// ==/UserScript==
var version = "1.0.1";
var currentURL = window.location.href;
if (currentURL.indexOf("?") !== -1) {
    currentURL = currentURL.substring(0, currentURL.indexOf("?"));
}
var list = [];
var startTimeMilli = Date.now();
var stopTimeMilli = 0;
var timeoutInt;

// 配置控制类
class Config {
    get(key, value) {
        var cookie = $.cookie(key);
        if (cookie == undefined) {
            new Config().set(key, value);
            console.debug("Renew key: " + key + " : " + value);
            return value;
        }
        console.debug("Read key: " + key + " : " + cookie);
        if (cookie === "true") { return true; }
        if (cookie === "false") { return false; }
        return cookie;
    }

    set(setKey, setValue) {
        $.cookie(setKey, setValue, {
            path: '/',
            expires: 365
        });
        console.debug("Key set: " + setKey + " : " + setValue);
    }

    listenButton(element, listenKey, trueAction, falseAction) {
        $(element).click(function () {
            let status = new Config().get(listenKey, true);
            console.debug("Status: " + status);
            if (status === "true" || status) {
                console.debug("Key set: " + listenKey + " :: " + false);
                new Config().set(listenKey, false);
            } else {
                console.debug("Key set: " + listenKey + " :: " + true);
                new Config().set(listenKey, true);
            }
        });
    }

    listenButtonAndAction(element, listenKey, trueAction, falseAction) {
        $(element).click(function () {
            let status = new Config().get(listenKey, true);
            console.debug("Status: " + status);
            if (status === "true" || status) {
                console.debug("Key set: " + listenKey + " :: " + false);
                new Config().set(listenKey, false);
                falseAction();
            } else {
                console.debug("Key set: " + listenKey + " :: " + true);
                new Config().set(listenKey, true);
                trueAction();
            }
        });
    }
}

//文档高度
function getDocumentTop() {
    var scrollTop =  0, bodyScrollTop = 0, documentScrollTop = 0;
    if (document.body) {
        bodyScrollTop = document.body.scrollTop;
    }
    if (document.documentElement) {
        documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
}

//可视窗口高度
function getWindowHeight() {
    var windowHeight = 0;
    if (document.compatMode == "CSS1Compat") {
        windowHeight = document.documentElement.clientHeight;
    } else {
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}

//滚动条滚动高度
function getScrollHeight() {
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if (document.body) {
        bodyScrollHeight = document.body.scrollHeight;
    }
    if (document.documentElement) {
        documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
}

function l(log) {
    console.log("[JianShuGreener] " + log);
}

function e(error) {
    console.error("[JianShuGreener] " + error);
}

function clear() {
    list = [];
}

function put(tag) {
    list.push(tag);
}

function clean(times) {
    var loop = setInterval(function () {
        --times;
        if (times <= 0) {
            clearInterval(loop);
        }
        for (var k = 0; k < list.length; k++) {
            $(list[k]).remove();
        }
    }, 100);
}

function loop(num) {
    setInterval(function () {
        if (num === 1) {
            // 主页穿插的广告
            $("div[aria-label='baidu-ad']").remove();
        }
    }, 500);
}

function common(times, f) {
    var loop = setInterval(function () {
        --times;
        if (times <= 0) {
            clearInterval(loop);
        }
        f();
    }, 100);
    NProgress.inc();
}

(function () {
    'use strict';

    l("欢迎使用 JianShuGreener V" + version + "，页面优化中...");
    NProgress.start();

    let config = new Config();
    var blockURL = currentURL.split("/").length;

    var homePage = /(www\.jianshu\.com\/)$/;
    var articlePage = /\/p\//;
    var itPage = /\/techareas\/backend/;
    var notifyPage = /\/notifications\#\//;
    var settingsPage = /\/settings\//;
    var subscribePage = /\/subscriptions\#\//;

    if (homePage.test(currentURL)) {
        l("正在优化主页浏览体验...");

        common(5, function() {
            // 上栏抽奖
            $("a:contains('抽奖')").parent().remove();
            // 右下角红包
            $("img[src='//cdn2.jianshu.io/assets/web/close_luck-29c555eb1a1fc84e0df2284fb668fbae.png']").parent().parent().remove();
            // 顶栏下载App
            $(".menu-text:contains('下载App')").parent().remove();
        });

        // 右侧下载简书二维码
        put("#index-aside-download-qrbox");
        // 右侧谷歌广告
        put("div[aria-label='3rd-ad']");
        // 推荐作者
        put(".recommended-author-wrap");
        // 页脚
        put("footer");

        window.onscroll = function () {
            setTimeout(function () {
                if (timeoutInt != undefined) {
                    window.clearTimeout(timeoutInt);
                }
                timeoutInt = window.setTimeout(function () {
                    //监听事件内容
                    if(getScrollHeight() == getDocumentTop() + getWindowHeight()){
                        document.getElementsByClassName('load-more')[0].click()
                        l("触发自动加载阅读更多");
                    }
                }, 105);
            }, 100);
        }

        loop(1);
    } else if (articlePage.test(currentURL)) {
        l("正在优化文章页浏览体验...");

        common(5, function() {
            // 顶栏下载App
            $("a:contains('下载APP')").remove();
            // 悬浮抽奖图标
            $("div:contains('抽奖'):last").parent().parent().remove();
            // 更多好文按钮
            $("div:contains('更多好文'):last").parent().remove();
        });

        // 简书钻
        put("span[aria-label='简书钻']");
        // 右侧谷歌广告
        put("section[aria-label='baidu-ad']");
        // 右侧星辰广告
        setTimeout(function() {
            $("section[aria-label='xingchen-ad']").remove();
        }, 1000);
    } else if (itPage.test(currentURL)) {
        l("正在优化IT技术页浏览体验...");

        common(5, function() {
            // 顶栏下载App
            $(".menu-text:contains('下载App')").parent().remove();
        });
    } else if (notifyPage.test(currentURL)) {
        l("正在优化通知页浏览体验...");

        // 左侧谷歌广告
        put("div[aria-label='3rd-ad']");

        common(5, function() {
            // 上栏抽奖
            $("a:contains('抽奖')").parent().remove();
        });
    } else if (settingsPage.test(currentURL)) {
        l("正在优化设置页浏览体验...");

        // 左侧谷歌广告
        put("div[aria-label='3rd-ad']");

        common(5, function() {
            // 上栏抽奖
            $("a:contains('抽奖')").parent().remove();
        });
    } else if (subscribePage.test(currentURL)) {
        l("正在优化关注页浏览体验...");

        common(5, function() {
            // 上栏抽奖
            $("a:contains('抽奖')").parent().remove();
        });

        window.onscroll = function () {
            setTimeout(function () {
                if (timeoutInt != undefined) {
                    window.clearTimeout(timeoutInt);
                }
                timeoutInt = window.setTimeout(function () {
                    //监听事件内容
                    if(getScrollHeight() == getDocumentTop() + getWindowHeight()){
                        document.getElementsByClassName('load-more')[0].click()
                        l("触发自动加载阅读更多");
                    }
                }, 105);
            }, 100);
        }
    } else {
        l("正在尝试优化浏览体验...");

        common(5, function() {
            // 上栏抽奖
            $("a:contains('抽奖')").parent().remove();
        });
    }

    clean(10);

    NProgress.done();
    stopTimeMilli = Date.now();
    l("优化完毕! 耗时 " + (stopTimeMilli - startTimeMilli) + "ms");
})();
