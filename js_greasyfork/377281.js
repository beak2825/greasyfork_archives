// ==UserScript==
// @name         去除重定向
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  去除搜索引擎重定向
// @author       linmii
// @include      *://www.sogou.com/web*
// @include      *://m.sogou.com/web*
// @include      *://www.google*/search*
// @include      *://www.baidu.com/s*
// @include      *://www.baidu.com/baidu*
// @include      *://www.so.com/s*
// @include      *://*.bing.com/search*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdn.staticfile.org/axios/0.19.0/axios.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377281/%E5%8E%BB%E9%99%A4%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/377281/%E5%8E%BB%E9%99%A4%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

let insertLocked = true;
let currentSite;
const DBSite = {
    sogou: {
        key: "sogou",
        sourceNodeReg: ".results a[href^='/link?url=']",
        responseDealReg: /window.location.replace\("(.+)"\)/
    },
    mSogou: {
        key: "mSogou",
        sourceNodeReg: ".results a[href*='http://m.sogou.com/web/uID=']",
        responseDealReg: /url=(.+?)&/
    },
    google: {
        key: "google",
        sourceNodeReg: "#search a"
    },
    baidu: {
        key: "baidu",
        sourceNodeReg: "#content_left .c-container .t a, #content_left .c-container .f13 a.c-showurl, #content_left .c-container .c-row a[target='_blank']",
        responseDealReg: /window.location.replace\("(.+)"\)/
    },
    so: {
        key: "so",
        sourceNodeReg: "#main .result a[href^='http://www.so.com/link?']",
        responseDealReg: /window.location.replace\("(.+)"\)/
    },
    bing: {
        key: "bing",
        sourceNodeReg: "#b_results .b_ad"
    }
};

(function () {
    'use strict';
    fetchCurrentSite();
    if (currentSite) {
        antiRedirect(currentSite);
    }

    document.addEventListener('DOMNodeInserted', function () {
        if (!insertLocked) {
            insertLocked = true;
            if (currentSite) {
                repeatDeal();
            }
        }
    }, false);
})();

function fetchCurrentSite() {
    let host = window.location.host;
    if (host.indexOf("www.sogou") > -1) {
        currentSite = DBSite.sogou;
    } else if (host.indexOf("m.sogou") > -1) {
        currentSite = DBSite.mSogou;
    } else if (host.indexOf("google") > -1) {
        currentSite = DBSite.google;
    } else if (host.indexOf("baidu") > -1) {
        currentSite = DBSite.baidu;
    } else if (host.indexOf("so.com") > -1) {
        currentSite = DBSite.so;
    } else if (host.indexOf("bing") > -1) {
        currentSite = DBSite.bing;
    }
}

function repeatDeal() {
    setTimeout(function () {
        antiRedirect(currentSite);
    }, 20);
}

function antiRedirect(webSite) {
    switch (webSite.key) {
        case "sogou":
            $(webSite.sourceNodeReg).each(function () {
                fetchRealUrlByAxios($(this), webSite.responseDealReg);
            });
            break;
        case "mSogou":
            $(webSite.sourceNodeReg).each(function () {
                let matches = $(this).attr("href").match(webSite.responseDealReg);
                if (matches && matches.length === 2) {
                    $(this).attr("href", decodeURIComponent(matches[1]));
                }
            });
            break;
        case "google":
            $(webSite.sourceNodeReg).each(function () {
                $(this).attr("target", "_blank");
            });
            break;
        case "baidu":
            $(webSite.sourceNodeReg).each(function () {
                fetchRealUrlByAjax($(this), webSite.responseDealReg);
            });
            break;
        case "so":
            $(webSite.sourceNodeReg).each(function () {
                if ($(this).attr("data-url")) {
                    $(this).attr("href", $(this).attr("data-url"));
                } else {
                    $(this).attr("href", decodeURIComponent($(this).attr("href").split("url=")[1]));
                }
            });
            break;
        case "bing":
            $(webSite.sourceNodeReg).each(function () {
                $(this).remove();
            });
            break;
        default:
    }
    insertLocked = false;
}

function fetchRealUrlByAxios(sourceObj, reg) {
    let url = sourceObj.attr("href").replace(/^http:/, "https:");
    axios.get(url)
        .then(function (response) {
            let data = response.data;
            let matches = data.match(reg);
            if (matches && matches.length === 2) {
                sourceObj.attr("href", matches[1]);
            }
            sourceObj.attr("target", "_blank");
        })
        .catch(function (error) {
            console.error("去除重定向失败！", error);
        });
}

function fetchRealUrlByAjax(sourceObj, reg) {
    let url = sourceObj.attr("href").replace(/^http:/, "https:");
    if (!url.startsWith("https://www.baidu.com/link?url=")) {
        return;
    }
    if (currentSite.key === "baidu") {
        url = url + "&wd=&eqid=";
    }
    $.ajax({
        url: url,
        dataType: "text",
        headers: {
            "Accept": "*/*"
        },
        success: function (response) {
            let matches = response.match(reg);
            if (matches && matches.length === 2) {
                sourceObj.attr("href", matches[1]);
            }
        }
    });
}