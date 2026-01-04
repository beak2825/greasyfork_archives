// ==UserScript==
// @name            搜索引擎助手：搜索切换/搜索引擎切换，快速跳转/切换关键字搜索
// @namespace       https://github.com/qq943260285
// @version         1.1.0
// @description     搜索引擎助手，搜索切换/搜索引擎切换，快速跳转/切换关键字搜索，自定义搜索站点，提供快捷搜索工具支持。
// @author          小宇专属
// @license         GPL-3.0-only
// @icon            https://raw.githubusercontent.com/qq943260285/tampermonkey-search-switch/master/assets/logo_ico.png
// @create          2021-10-20
// @lastmodified    2021-11-30
// @supportURL      https://github.com/qq943260285/tampermonkey-search-switch.git
// @feedback-url    https://github.com/qq943260285/tampermonkey-search-switch.git
// @note            1.更新 google 地区域名；2.优化程序；
// @include         *
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/434182/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%8A%A9%E6%89%8B%EF%BC%9A%E6%90%9C%E7%B4%A2%E5%88%87%E6%8D%A2%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%EF%BC%8C%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%AC%E5%88%87%E6%8D%A2%E5%85%B3%E9%94%AE%E5%AD%97%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/434182/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%8A%A9%E6%89%8B%EF%BC%9A%E6%90%9C%E7%B4%A2%E5%88%87%E6%8D%A2%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%EF%BC%8C%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%AC%E5%88%87%E6%8D%A2%E5%85%B3%E9%94%AE%E5%AD%97%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

"use strict";

(function() {
    window.WeltTool = function(config) {
        if (!config) config = {};
        if (!config.id) config.id = "xyzs-welt-tool";
        if (!config.itemList || !config.itemList.length) config.itemList = [];
        var mainDivDom, titleDiv = document.createElement("style"), bodyDom = document.getElementsByTagName("body")[0];
        if (titleDiv.innerHTML = ".xyzs-welt-tool{position:fixed;display:flex;background-color:#000;opacity:.3;border-radius:0 40px 40px 0;padding:10px 35px 10px 5px;flex-direction:column;bottom:100px;left:0;z-index:99999;transition:all .4s;box-shadow:2px 2px 4px 0 #c1c1c1}.xyzs-welt-tool:hover{opacity:1;border-radius:0 10px 10px 0}.xyzs-welt-tool .xyzs-title-div{font-size:5px;margin:0 5px 5px 5px}.xyzs-welt-tool .xyzs-item-list-div{margin:0;display:flex;justify-content:center}.xyzs-welt-tool .xyzs-item-list-div .xyzs-item-div{display:flex;margin:0 5px;color:#0cc;font-size:14px;cursor:pointer;line-height:1}.xyzs-welt-tool .xyzs-item-list-div .xyzs-item-div:hover{color:#0ff}", bodyDom.appendChild(titleDiv), (mainDivDom = document.createElement("div")).id = config.id, 
        mainDivDom.className = "xyzs-welt-tool", config.color) mainDivDom.style.backgroundColor = config.color;
        if (mainDivDom.onmouseout = function(e) {
            mainDivDom.style.left = 30 - mainDivDom.offsetWidth + "px";
        }, mainDivDom.onmouseover = function(e) {
            mainDivDom.style.left = "0px";
        }, void 0 !== config.title) {
            titleDiv = document.createElement("div");
            titleDiv.className = "xyzs-title-div", titleDiv.innerHTML = decodeURI(config.title), 
            mainDivDom.appendChild(titleDiv);
        }
        var listDivDom = document.createElement("div");
        listDivDom.className = "xyzs-item-list-div";
        for (var i = 0; i < config.itemList.length; i++) (function(itemDiv) {
            var item = config.itemList[itemDiv];
            if (item.show(item.data)) {
                if (item.onload) item.onload(item.data);
                itemDiv = document.createElement("div");
                itemDiv.className = "xyzs-item-div", itemDiv.title = item.title, itemDiv.onclick = function(e) {
                    if (item.onclick) item.onclick(e, item.data);
                }, itemDiv.onmouseout = function(e) {
                    if (item.onmouseout) item.onmouseout(e, item.data);
                }, itemDiv.onmouseover = function(e) {
                    if (item.onmouseover) item.onmouseover(e, item.data);
                }, itemDiv.innerHTML = item.name, listDivDom.appendChild(itemDiv);
            }
        })(i);
        mainDivDom.appendChild(listDivDom), bodyDom.appendChild(mainDivDom), mainDivDom.style.left = 30 - mainDivDom.offsetWidth + "px";
    };
})(), function() {
    function getKeywordString() {
        for (var i = 0; i < searchList.length; i++) {
            var urlParam = searchList[i];
            if (matchItemHost(urlParam)) {
                urlParam = function(url) {
                    for (var pList = url.substring(url.indexOf("?") + 1).split("&"), i = 0; i < pList.length; i++) {
                        var pair = pList[i].split("=");
                        if (pair[1] === CONFIG.KeywordSymbol) return pair[0];
                    }
                    return !1;
                }(urlParam.searchUrl), urlParam = function(url, name) {
                    for (var pList = url.substring(url.indexOf("?") + 1).split("&"), i = 0; i < pList.length; i++) {
                        var pair = pList[i].split("=");
                        if (pair[0] === name) return pair[1];
                    }
                    return !1;
                }(window.location.href, urlParam);
                return urlParam;
            }
        }
        return "";
    }
    function createDiv() {
        for (var itemList = [], _loop = function(i) {
            var search = searchList[i];
            itemList.push({
                name: search.name,
                title: search.host,
                onclick: function(e, data) {
                    window.open(function(search) {
                        var keywordString = getKeywordString();
                        return search.searchUrl.replaceAll(CONFIG.KeywordSymbol, keywordString);
                    }(search), "_blank");
                },
                show: function(data) {
                    return search.show && !matchItemHost(search);
                },
                data: search
            });
        }, i = 0; i < searchList.length; i++) _loop(i);
        new WeltTool({
            title: getKeywordString(),
            itemList: itemList
        });
    }
    function matchItemHost(item) {
        if (item.host === window.location.host) return 1;
        var countryHost = item.countryHost;
        if (countryHost && 0 < countryHost.length) for (var j = 0; j < countryHost.length; j++) if (countryHost[j] === window.location.host) return 1;
        return;
    }
    var SEARCH_TYPE_RequestParam = 0, CONFIG = {
        KeywordSymbol: "%s",
        DivId: "xyzs-search",
        defaultSearchType: SEARCH_TYPE_RequestParam,
        defaultCustomize: !1
    }, searchList = [ {
        index: 1,
        name: "百度",
        host: "www.baidu.com",
        urlKeyword: [],
        searchUrl: "https://www.baidu.com/s?wd=%s",
        searchType: SEARCH_TYPE_RequestParam,
        css: "",
        remark: "备注",
        customize: !1,
        show: !0,
        countryHost: [ "www.baidu.com" ]
    }, {
        index: 2,
        name: "必应",
        host: "cn.bing.com",
        searchUrl: "https://cn.bing.com/search?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0
    }, {
        index: 3,
        name: "好搜",
        host: "www.so.com",
        searchUrl: "https://www.so.com/s?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0
    }, {
        index: 4,
        name: "知乎",
        host: "www.zhihu.com",
        searchUrl: "https://www.zhihu.com/search?type=content&q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0
    }, {
        index: 5,
        name: "谷歌",
        host: "www.google.com",
        searchUrl: "https://www.google.com/search?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0,
        countryHost: [ "www.goo.gl", "www.google.com.af", "www.google.com.ag", "www.google.com.ai", "www.google.com.ar", "www.google.com.au", "www.google.com.bd", "www.google.com.bh", "www.google.com.bn", "www.google.com.bo", "www.google.com.br", "www.google.com.by", "www.google.com.bz", "www.google.com.co", "www.google.com.co.jp", "www.google.com.cu", "www.google.com.cy", "www.google.com.do", "www.google.com.ec", "www.google.com.eg", "www.google.com.et", "www.google.com.fj", "www.google.com.ge", "www.google.com.gh", "www.google.com.gi", "www.google.com.gr", "www.google.com.gt", "www.google.com.hk", "www.google.com.iq", "www.google.com.jm", "www.google.com.jo", "www.google.com.kh", "www.google.com.kw", "www.google.com.lb", "www.google.com.ly", "www.google.com.mm", "www.google.com.mt", "www.google.com.mx", "www.google.com.my", "www.google.com.na", "www.google.com.nf", "www.google.com.ng", "www.google.com.ni", "www.google.com.np", "www.google.com.nr", "www.google.com.om", "www.google.com.pa", "www.google.com.pe", "www.google.com.pg", "www.google.com.ph", "www.google.com.pk", "www.google.com.pr", "www.google.com.py", "www.google.com.qa", "www.google.com.ru", "www.google.com.sa", "www.google.com.sb", "www.google.com.sg", "www.google.com.sl", "www.google.com.sv", "www.google.com.tj", "www.google.com.tr", "www.google.com.tw", "www.google.com.ua", "www.google.com.uy", "www.google.com.vc", "www.google.com.vn", "www.google.ac", "www.google.ad", "www.google.ae", "www.google.af", "www.google.ag", "www.google.al", "www.google.am", "www.google.as", "www.google.at", "www.google.az", "www.google.ba", "www.google.be", "www.google.bf", "www.google.bg", "www.google.bi", "www.google.bj", "www.google.bs", "www.google.bt", "www.google.by", "www.google.bo", "www.google.ca", "www.google.cat", "www.google.cc", "www.google.cd", "www.google.cf", "www.google.cg", "www.google.ch", "www.google.ci", "www.google.cl", "www.google.cm", "www.google.co", "www.google.cv", "www.google.cz", "www.google.co.ao", "www.google.co.bw", "www.google.co.ck", "www.google.co.cr", "www.google.co.hu", "www.google.co.id", "www.google.co.il", "www.google.co.im", "www.google.co.in", "www.google.co.je", "www.google.co.jp", "www.google.co.ke", "www.google.co.kr", "www.google.co.ls", "www.google.co.ma", "www.google.co.mz", "www.google.co.nz", "www.google.co.th", "www.google.co.tz", "www.google.co.ug", "www.google.co.uk", "www.google.co.uz", "www.google.co.ve", "www.google.co.vi", "www.google.co.za", "www.google.co.zm", "www.google.co.zw", "www.google.de", "www.google.dj", "www.google.dk", "www.google.dm", "www.google.do", "www.google.dz", "www.google.ec", "www.google.ee", "www.google.es", "www.google.hk", "www.google.mx", "www.google.ng", "www.google.ph", "www.google.pk", "www.google.pl", "www.google.pn", "www.google.ps", "www.google.pt", "www.google.qa", "www.google.ro", "www.google.rs", "www.google.ru", "www.google.rw", "www.google.sc", "www.google.se", "www.google.sh", "www.google.si", "www.google.sk", "www.google.sm", "www.google.sn", "www.google.so", "www.google.st", "www.google.sg", "www.google.sl", "www.google.td", "www.google.tg", "www.google.tw", "www.google.tk", "www.google.tl", "www.google.tm", "www.google.tn", "www.google.to", "www.google.tt", "www.google.ua", "www.google.vg", "www.google.vn", "www.google.vu", "www.google.ws" ]
    }, {
        index: 6,
        name: "搜狗",
        host: "www.sogou.com",
        searchUrl: "https://www.sogou.com/web?query=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0
    }, {
        index: 7,
        name: "GitHub",
        host: "github.com",
        searchUrl: "https://github.com/search?o=desc&q=%s&s=stars&type=Repositories",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0
    } ];
    (function() {
        if (top !== window) return;
        for (var i = 0; i < searchList.length; i++) if (matchItemHost(searchList[i])) return createDiv();
    })();
}();