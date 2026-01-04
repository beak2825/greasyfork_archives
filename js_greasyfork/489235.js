// ==UserScript==
// @name            搜索引擎切换器2(侧栏版)
// @namespace       https://github.com/qq943260285
// @version         2.0.3
// @description     搜索引擎切换小助手，支持百度(Baidu)、谷歌(Google)、必应(Bing)、360/360AI、神马/夸克、搜狗、ｆ搜、头条、Yandex、Duckgo、雅虎(Yahoo)、Qwant、SwissCows、秘塔AI、天工AI等28个站点，支持更改排序和显示(在代码中)
// @author          小宇专属
// @license         GPL-3.0-only
// @include         *keyword=*
// @include         *query=*
// @include         *word=*
// @include         *text=*
// @include         *key=*
// @include         *web=*
// @include         *wd=*
// @include         *kw=*
// @include         *q=*
// @include         *p=*
// @include         *.tiangong.com/*
// @include         *.sou.com/*
// @exclude         *image*
// @exclude         *video*
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/489235/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%E5%99%A82%28%E4%BE%A7%E6%A0%8F%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489235/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%E5%99%A82%28%E4%BE%A7%E6%A0%8F%E7%89%88%29.meta.js
// ==/UserScript==
"use strict";

(function() {  
    window.WeltTool = function(config) {
        if (!config) config = {};
        if (!config.id) config.id = "xyzs-welt-tool";
        if (!config.itemList || !config.itemList.length) config.itemList = [];
        var mainDivDom, titleDiv = document.createElement("style"), bodyDom = document.getElementsByTagName("body")[0];
        if (titleDiv.innerHTML = ".xyzs-welt-tool{position:fixed;width:124px !important;height:200px;display:flex;background-color:#C1FFFB;opacity:.3;border-radius:10px;padding:5px 40px 5px 5px;flex-direction:column;bottom:200px;left:-148px;z-index:99999;transition:all .4s;overflow:hidden;}.xyzs-welt-tool:hover{opacity:1;background-color:hsla(200, 40%, 96%,.9);left:5px;overflow-y:scroll;padding:5px 10px;transition:all .4s;height:300px;}.xyzs-welt-tool .xyzs-title-div{font-size:6px;padding:0 0 2px;margin:0 5px 5px;text-align: center;color:#067;border-bottom:1px solid currentColor;line-height: 7px;}.xyzs-welt-tool .xyzs-item-list-div{margin:0;display:flex;justify-content:center;align-items:center;flex-direction:row;flex-wrap:wrap;}.xyzs-welt-tool .xyzs-item-list-div .xyzs-item-div{display:flex;width:max-content !important;margin:2px 2px;padding:4px;color:#222;font-size:13px !important;cursor:pointer;white-space:nowrap;box-sizing:border-box;}.xyzs-welt-tool .xyzs-item-list-div .xyzs-item-div:hover{color:#067;transition:all .4s;}", bodyDom.appendChild(titleDiv), (mainDivDom = document.createElement("div")).id = config.id, 
        mainDivDom.className = "xyzs-welt-tool", config.color) mainDivDom.style.backgroundColor = config.color;
        if (mainDivDom.onmouseout = function(e) {
            
        }, mainDivDom.onmouseover = function(e) {
           
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
        mainDivDom.appendChild(listDivDom), bodyDom.appendChild(mainDivDom)
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
                    }
/*将_blank改为_self即可在当前标签页切换搜索引擎*/
(search), "_blank");
                },
                show: function(data) {
                    return search.show && !matchItemHost(search);
                },
                data: search
            });
        }, i = 0; i < searchList.length; i++) _loop(i);
        new WeltTool({
            title: "“"+getKeywordString()+"”",
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
        searchUrl: "https://www.baidu.com/s?word=%s",
        searchType: SEARCH_TYPE_RequestParam,       
        show: !0,
        countryHost: [ "m.baidu.com","wap.baidu.com" ]
    }, {
        index: 2,
        name: "Bing",
        host: "bing.com",
        searchUrl: "https://bing.com/search?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0,
        countryHost: ["cn.bing.com","www.bing.com"]
    },{
        index: 3,
        name: "Google",
        host: "www.google.com",
        searchUrl: "https://www.google.com/search?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0,
        countryHost: [ "www.goo.gl", "www.google.com.af", "www.google.com.ag", "www.google.com.ai", "www.google.com.ar", "www.google.com.au", "www.google.com.bd", "www.google.com.bh", "www.google.com.bn", "www.google.com.bo", "www.google.com.br", "www.google.com.by", "www.google.com.bz", "www.google.com.co", "www.google.com.co.jp", "www.google.com.cu", "www.google.com.cy", "www.google.com.do", "www.google.com.ec", "www.google.com.eg", "www.google.com.et", "www.google.com.fj", "www.google.com.ge", "www.google.com.gh", "www.google.com.gi", "www.google.com.gr", "www.google.com.gt", "www.google.com.hk", "www.google.com.iq", "www.google.com.jm", "www.google.com.jo", "www.google.com.kh", "www.google.com.kw", "www.google.com.lb", "www.google.com.ly", "www.google.com.mm", "www.google.com.mt", "www.google.com.mx", "www.google.com.my", "www.google.com.na", "www.google.com.nf", "www.google.com.ng", "www.google.com.ni", "www.google.com.np", "www.google.com.nr", "www.google.com.om", "www.google.com.pa", "www.google.com.pe", "www.google.com.pg", "www.google.com.ph", "www.google.com.pk", "www.google.com.pr", "www.google.com.py", "www.google.com.qa", "www.google.com.ru", "www.google.com.sa", "www.google.com.sb", "www.google.com.sg", "www.google.com.sl", "www.google.com.sv", "www.google.com.tj", "www.google.com.tr", "www.google.com.tw", "www.google.com.ua", "www.google.com.uy", "www.google.com.vc", "www.google.com.vn", "www.google.ac", "www.google.ad", "www.google.ae", "www.google.af", "www.google.ag", "www.google.al", "www.google.am", "www.google.as", "www.google.at", "www.google.az", "www.google.ba", "www.google.be", "www.google.bf", "www.google.bg", "www.google.bi", "www.google.bj", "www.google.bs", "www.google.bt", "www.google.by", "www.google.bo", "www.google.ca", "www.google.cat", "www.google.cc", "www.google.cd", "www.google.cf", "www.google.cg", "www.google.ch", "www.google.ci", "www.google.cl", "www.google.cm", "www.google.co", "www.google.cv", "www.google.cz", "www.google.co.ao", "www.google.co.bw", "www.google.co.ck", "www.google.co.cr", "www.google.co.hu", "www.google.co.id", "www.google.co.il", "www.google.co.im", "www.google.co.in", "www.google.co.je", "www.google.co.jp", "www.google.co.ke", "www.google.co.kr", "www.google.co.ls", "www.google.co.ma", "www.google.co.mz", "www.google.co.nz", "www.google.co.th", "www.google.co.tz", "www.google.co.ug", "www.google.co.uk", "www.google.co.uz", "www.google.co.ve", "www.google.co.vi", "www.google.co.za", "www.google.co.zm", "www.google.co.zw", "www.google.de", "www.google.dj", "www.google.dk", "www.google.dm", "www.google.do", "www.google.dz", "www.google.ec", "www.google.ee", "www.google.es", "www.google.hk", "www.google.mx", "www.google.ng", "www.google.ph", "www.google.pk", "www.google.pl", "www.google.pn", "www.google.ps", "www.google.pt", "www.google.qa", "www.google.ro", "www.google.rs", "www.google.ru", "www.google.rw", "www.google.sc", "www.google.se", "www.google.sh", "www.google.si", "www.google.sk", "www.google.sm", "www.google.sn", "www.google.so", "www.google.st", "www.google.sg", "www.google.sl", "www.google.td", "www.google.tg", "www.google.tw", "www.google.tk", "www.google.tl", "www.google.tm", "www.google.tn", "www.google.to", "www.google.tt", "www.google.ua", "www.google.vg", "www.google.vn", "www.google.vu", "www.google.ws" ]
    }, {
        index: 4,
        name: "360搜索",
        host: "www.so.com",
        searchUrl: "https://www.so.com/s?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0,
        countryHost: [ "m.so.com" ]
    }, {
        index: 5,
        name: "神马",
        host: "yz.m.sm.cn",
        searchUrl: "https://yz.m.sm.cn/s?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0,
        countryHost: [  ]
    },{
        index: 6,
        name: "搜狗",
        host: "wap.sogou.com",
        searchUrl: "https://wap.sogou.com/web/sl?keyword=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !1,/*默认隐藏，将1改为0显示*/
        countryHost: [ "www.sogou.com","m.sogou.com" ]
    },{
        index: 7,
        name: "ｆ搜",
        host: "fsoufsou.com",
        searchUrl: "https://fsoufsou.com/search?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !1,/*默认隐藏，将1改为0显示*/
    },
{
        index: 8,
        name: "头条搜索",
        host: "so.toutiao.com",
        searchUrl: "https://so.toutiao.com/search?keyword=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0,
        countryHost:["tsearch.toutiaoapi.com"]
    },{
        index: 9,
        name: "Duckgo",
        host: "duckduckgo.com",
        searchUrl: "https://duckduckgo.com/?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !1,/*默认隐藏，将1改为0显示*/
        countryHost: [ ]
    },{
        index: 10,
        name: "Yandex",
        host: "www.yandex.com",
        searchUrl: "https://www.yandex.com/search/touch/?text=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0,
        countryHost: [ "yandex.ru" ]
    },{
        index: 11,
        name: "Yahoo",
        host: "search.yahoo.com",
        searchUrl: "https://search.yahoo.com/search?p=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !1,/*默认隐藏，将1改为0显示*/
    },{
        index: 12,
        name: "Brave",
        host: "search.brave.com",
        searchUrl: "https://search.brave.com/search?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !1,/*默认隐藏，将1改为0显示*/
    },{
        index: 13,
        name: "Ecosia",
        host: "www.ecosia.org",
        searchUrl: "https://www.ecosia.org/search?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !1,/*默认隐藏，将1改为0显示*/
    },{
        index: 14,
        name: "Qwant",
        host: "www.qwant.com",
        searchUrl: "https://www.qwant.com/?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0,
        countryHost: [ "lite.qwant.com" ]
    },{
        index: 15,
        name: "SwissCows",
        host: "swisscows.com",
        searchUrl: "https://swisscows.com/en/web?query=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0
    },{
        index: 16,
        name: "Yep",
        host: "yep.com",
        searchUrl: "https://yep.com/web?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !1,/*默认隐藏，将1改为0显示*/
    },{
        index: 17,
        name: "夸克",
        host: "quark.sm.cn",
        searchUrl: "https://quark.sm.cn/s?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !1,/*默认隐藏，将1改为0显示*/
    },{
        index: 18,
        name: "秘塔AI",
        host: "metaso.cn",
        searchUrl: "https://metaso.cn/?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0,
        countryHost: [  ]
    },{
        index: 19,
        name: "天工AI",
        host: "www.tiangong.com",
        searchUrl: "https://www.tiangong.cn/result?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0,
        countryHost: [ "m.tiangong.com" ]
    },{
        index: 20,
        name: "ThinkanyAI",
        host: "thinkany.so",
        searchUrl: "https://thinkany.so/zh/search?source=all&q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0,
        countryHost: [  ]
    },{
        index: 21,
        name: "十号AI",
        host: "retardphobia.moebh.org",
        searchUrl: "https://retardphobia.moebh.org/ui/search?mode=1&q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0,
        countryHost: [  ]
    },{
        index: 22,
        name: "360AI",
        host: "www.sou.com",
        searchUrl: "https://www.sou.com/?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0,
        countryHost: [ "m.sou.com" ]
    },{
        index: 23,
        name: "知乎搜索",
        host: "www.zhihu.com",
        searchUrl: "https://www.zhihu.com/search?q=%s&type=content",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0,
        countryHost: [ "m.zhihu.com" ]
    },{
        index: 24,
        name: "微博",
        host: "m.weibo.cn",
        searchUrl: "https://m.weibo.cn/search?containerid=100103type=1&q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0,
        countryHost: [ "www.weibo.com" ]
    },{
        index: 25,
        name: "B站",
        host: "m.bilibili.com",
        searchUrl: "https://m.bilibili.com/search?keyword=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0,
        countryHost: ["search.bilibili.com"]
    },{
        index: 26,
        name: "微信文章",
        host: "weixin.sogou.com",
        searchUrl: "https://weixin.sogou.com/weixinwap?type=2&query=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0,
    },{
        index: 27,
        name: "GitHub",
        host: "github.com",
        searchUrl: "https://github.com/search?o=desc&q=%s&s=stars&type=Repositories",
        searchType: SEARCH_TYPE_RequestParam,
        show: !1,/*默认隐藏，将1改为0显示*/
    },{
        index: 28,
        name: "Gitee",
        host: "search.gitee.com",
        searchUrl: "https://search.gitee.com/?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !1,/*默认隐藏，将1改为0显示*/
    },{
        index: 29,/*序号，用来排序的*/
        name: "GreasyFork",/*名字，用来显示的*/
        host: "greasyfork.org",/*应用到此域名*/
        searchUrl: "https://greasyfork.org/zh-CN/scripts?q=%s",
        searchType: SEARCH_TYPE_RequestParam,
        show: !0,/*默认显示，将0改为1隐藏*/
        countryHost: [ "sleazyfork.org" ],/*相似域名*/
    },
    ];
    (function() {
        if (top !== window) return;
        for (var i = 0; i < searchList.length; i++) if (matchItemHost(searchList[i])) return createDiv();
    })();
}();