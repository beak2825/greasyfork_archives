// ==UserScript==
// @name         baidu search filter
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  ntmlgbdgbbd
// @author       smilez
// @match        *://www.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460126/baidu%20search%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/460126/baidu%20search%20filter.meta.js
// ==/UserScript==

//热搜
var CACHE_KEY_HOT_NEWS_FLAG = "hotNewsFlag";
//底部搜索建议
var CACHE_KEY_BOTTOM_SEARCH_FLAG = "bottomSearchFlag";
//顶部搜索建议
var CACHE_KEY_TOP_SEARCH_FLAG = "bottomSearchFlag";
//标题过滤关键词
var CACHE_KEY_TITLE_KEY_SET = "titleKeySet";
//内容过滤关键词
var CACHE_KEY_CONENT_KEY_SET = "contentKeySet";
//url过滤关键词
var CACHE_KEY_URL_KEY_SET = "urlKeySet";

var hotNewsFlag = getBoolCache(CACHE_KEY_HOT_NEWS_FLAG);
var topSearchFlag = getBoolCache(CACHE_KEY_TOP_SEARCH_FLAG);
var bottomSearchFlag = getBoolCache(CACHE_KEY_BOTTOM_SEARCH_FLAG);
var titleKeySet = getFilterKey(CACHE_KEY_TITLE_KEY_SET);
var contentKeySet = getFilterKey(CACHE_KEY_CONENT_KEY_SET);
var urlKeySet = getFilterKey(CACHE_KEY_URL_KEY_SET);

function getBoolCache(key) {
    let result = localStorage.getItem(key);
    if (null == result) {
        return false;
    }
    return JSON.parse(result);
}

function getFilterKey(key) {
    let result = localStorage.getItem(key);
    if (null == result) {
        return new Set();
    }
    return new Set(JSON.parse(result));
}

class SearchItem {
    constructor(object) {
        this.object = object;
    }

    getContent() {
        return this.object.find('[class^="content-right"]').text();
    }
    getTitle() {
        return this.object.find(".c-title").text();
    }
    getSourceUrl() {
        return this.object.attr("mu");
    }
    isNormalItem() {
        let tpl = this.object.attr("tpl")
        return null != tpl && "se_com_default" == tpl;
    }
    replaceHref(url) {
        this.object.find(".c-title > a")[0].href = url;
    }

    createUrlHtml(url) {
        let html = `<span>${url}</span><button class="url-block-btn">屏蔽</button>`
        this.object.find(".c-color-gray").parent().parent().children().last().after(html);
    }
}

class SearchItemComposite {
    constructor(searchResultList) {
        let searchItems = new Array();
        searchResultList.each(function (index, element) {
            searchItems.push(new SearchItem($(element)));
        });
        this.searchItems = searchItems;
    }

    getBolckedIndexSetCustom(blockFunc, extraFunc) {
        let result = new Set();
        this.searchItems.forEach(function (item, index) {
            if (blockFunc(item)) {
                result.add(index);
                return;
            }
            extraFunc(item);
        });
        return result;
    }

    getBolckedIndexSetDefault() {
        let result = new Set();
        this.searchItems.forEach(function (item, index) {
            //非标准结果过滤
            if (!item.isNormalItem()) {
                result.add(index);
                return;
            }
            //url过滤
            let sourceUrl = item.getSourceUrl();
            if (hasContainUrlKey(sourceUrl)) {
                result.add(index);
                return;
            }
            //标题过滤
            if (hasContainTitleKey(item.getTitle())) {
                result.add(index);
                return;
            }
            //内容过滤
            if (hasContainContent(item.getContent())) {
                result.add(index);
                return;
            }
            //去除重定向
            item.replaceHref(sourceUrl);
            //显示url
            item.createUrlHtml(sourceUrl.split('/')[2]);
        });
        return result;
    }

}

function hasContainContent(content) {
    return hasContainKey(content, contentKeySet);
}

function hasContainUrlKey(url) {
    return hasContainKey(url, urlKeySet);
}

function hasContainTitleKey(title) {
    return hasContainKey(title, titleKeySet);
}

function hasContainKey(key, keySet) {
    if (null == keySet || 0 == keySet.size) {
        return false;
    }
    if (null == key || "" == key) {
        return true;
    }
    for (const k of keySet) {
        if (key.indexOf(k) != -1) {
            return true;
        }
    }
    return false;
}

//翻页url
var autoPageUrl = null;
//翻页数标识
var pn = 0;

(function () {
    //拦截xhr
    var originalXhrOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function () {
        if (arguments[0] === "GET") {
            let url = arguments[1];
            originalXhrOpen.apply(this, arguments);
            if (url.indexOf("/s?") == 0) {
                let params = new URLSearchParams(url.substring(3));
                //百度一下的
                if ("baidu" === params.get("tn") && "1" === params.get("mod")) {
                    autoPageUrl = null;
                    pn = 0;
                    this.addEventListener('load', function () {
                        removePageHtml();
                        filterSearchResult();
                        showScroll();
                    });
                }
            }
        }
    };

})();


$(function () {
    createScriptHtml();
    removePageHtml();
    autoPage();
    filterSearchResult();
    showScroll();
});

function createScriptHtml() {
    let filterHtml = `
        <div style="padding-left: 70em;padding-top: 15px;">
            <input type="checkbox" id="hot-news-flag" style="-webkit-appearance: auto;">关闭热搜
            <input type="checkbox" id="bottom-search-flag" style="-webkit-appearance: auto;">关闭底部相关搜索
            <input type="checkbox" id="top-search-flag" style="-webkit-appearance: auto;">关闭顶部相关搜索
            <br/>
            添加过滤词汇
            <select id="filter-type">
                <option value="title">标题</option>
                <option value="content">内容</option>
                <option value="url">路径</option>
            </select>
            <input type="text" id="filter-value" style="-webkit-appearance: auto;">
            <button id="add-filter-key">添加</button>
            <button id="show-filter-key" flag="0">管理关键词</button>
            <div id ="filter-key-show" style="padding-left: 20em;display: none;"></div>
        </div>`;

    $("#m").after(filterHtml);

    $("#add-filter-key").on("click", () => { addFilterKey() });
    $("#show-filter-key").on("click", (e) => { showFilterKey(e) });

    checkboxInit(hotNewsFlag, $("#hot-news-flag"), CACHE_KEY_HOT_NEWS_FLAG);
    checkboxInit(bottomSearchFlag, $("#bottom-search-flag"), CACHE_KEY_BOTTOM_SEARCH_FLAG);
    checkboxInit(topSearchFlag, $("#top-search-flag"), CACHE_KEY_TOP_SEARCH_FLAG);
}

function addFilterKey() {
    let value = $("#filter-value").val();
    if (null == value || "" == value) {
        alert("请正确输入嗷");
        return;
    }

    let type = $("#filter-type option:selected").val();
    doAddFilterKey(type, value);

    if ($("#show-filter-key").attr("flag") == '1') {
        createFilterKeyHtml();
    }
}

function doAddFilterKey(type, value) {
    switch (type) {
        case "title":
            titleKeySet.add(value);
            localStorage.setItem(CACHE_KEY_TITLE_KEY_SET, JSON.stringify(Array.from(titleKeySet)));
            break;
        case "content":
            contentKeySet.add(value);
            localStorage.setItem(CACHE_KEY_CONENT_KEY_SET, JSON.stringify(Array.from(contentKeySet)));
            break;
        case "url":
            urlKeySet.add(value);
            localStorage.setItem(CACHE_KEY_URL_KEY_SET, JSON.stringify(Array.from(urlKeySet)));
            break;
        default:
            alert("?");
            break;
    }
}

function createFilterKeyHtml() {
    let html = "";
    html += doCreateFilterHtml("标题", titleKeySet, "ul-title");
    html += doCreateFilterHtml("内容", contentKeySet, "ul-content");
    html += doCreateFilterHtml("路径", urlKeySet, "ul-url");
    $("#filter-key-show").html(html);
}

function doCreateFilterHtml(title, value, ulId) {
    let result = `<b>${title}</b><ul id = "${ulId}">`;
    for (const key of value) {
        result += `<li><span>${key}</span><button>-</button><li>`;
    }
    result += "</ul>"
    return result;
}

function showFilterKey(e) {
    let element = $(e.target);
    let i = element.attr("flag");

    if (i == "0") {
        element.text("收起");
        createFilterKeyHtml();

        removeFilterKey($("#ul-title > li > button"), titleKeySet, CACHE_KEY_TITLE_KEY_SET);
        removeFilterKey($("#ul-content > li > button"), contentKeySet, CACHE_KEY_CONENT_KEY_SET);
        removeFilterKey($("#ul-url > li > button"), urlKeySet, CACHE_KEY_URL_KEY_SET);

        $("#filter-key-show").slideToggle();
        element.attr("flag", "1");
    }
    else {
        element.text("管理关键词");
        element.attr("flag", "0");
        $("#filter-key-show").slideToggle();
    }
}

function removeFilterKey(button, keySet, cacheKey) {
    button.on("click", (e) => {
        let element = $(e.target);
        let text = element.prev().text();
        keySet.delete(text);
        localStorage.setItem(cacheKey, JSON.stringify(Array.from(keySet)));
        element.parent().remove();
    });
}

function checkboxInit(flag, element, key) {
    if (flag) {
        element.prop("checked", true);
    }
    element.on("change", (e) => {
        localStorage.setItem(key, $(e.target).is(":checked"));
    });
}

function removePageHtml() {
    if (hotNewsFlag) {
        $("#content_right").remove();
    }
    if (bottomSearchFlag) {
        $("#rs_new").remove();
    }
    if (topSearchFlag) {
        $("#searchTag").remove();
    }
}

function filterSearchResult() {
    let searchResults = getSearchResult();
    let searchItemComposite = new SearchItemComposite(searchResults)
    let indexSet = searchItemComposite.getBolckedIndexSetDefault();
    for (let i of indexSet) {
        searchResults[i].remove();
    }
    initSearchResultHtml();
}

function getSearchResult() {
    return $("div#content_left > div:not(.page-title)");
}

function initSearchResultHtml() {
    $(".url-block-btn").click(function () {
        let url = $(this).prev().text();
        doAddFilterKey("url", url);
        let searchResults = getSearchResult();
        let searchItemComposite = new SearchItemComposite(searchResults)
        let indexSet = searchItemComposite.getBolckedIndexSetCustom(item => item.getSourceUrl().split('/')[2] == url, item => { });
        for (let i of indexSet) {
            searchResults[i].remove();
        }
        showScroll();
    });
}

function autoPage() {
    let repeatedLock = true;
    $(window).scroll(function () {
        let scrollTop = $(this).scrollTop();
        let scrollHeight = $(document).height();
        let windowHeight = $(this).height();
        if (repeatedLock && (scrollHeight != windowHeight) && ((scrollTop + windowHeight) + 1 >= scrollHeight)) {
            repeatedLock = false;
            doAutoPage();
            setTimeout(() => { repeatedLock = true; }, 1500)
        }
    });
}

function doAutoPage() {
    if (null == autoPageUrl) {
        autoPageUrl = window.location.href + "&pn=";
    }
    pn += 10;

    GM_xmlhttpRequest({
        url: autoPageUrl + pn,
        method: "GET",
        header: { "Referer": window.location.href },
        timeout: 8000,
        onreadystatechange: (response) => {
            if (null == response || null == response.responseText || typeof (response.responseText) === "undefined") {
                return;
            }
            let parser = new DOMParser();
            let doc = parser.parseFromString(response.responseText, 'text/html');
            let searchResults = $(doc.querySelectorAll("div#content_left > div"));
            if (null == searchResults || searchResults.length == 0) {
                pn -= 10;
                console.log("翻页,没有搜索到");
                return;
            }

            let html = `<div class='page-title'><span style="font-size: 1.5em;text-align: center;display: inherit;">------第${(pn / 10 + 1)}页------</span></div>`;
            let searchItemComposite = new SearchItemComposite(searchResults)
            let indexSet = searchItemComposite.getBolckedIndexSetDefault();
            for (let i = 0; i < searchResults.length; i++) {
                if (indexSet.has(i)) {
                    continue;
                }
                html += searchResults[i].outerHTML;
            }
            $("div#content_left").append(html);
            initSearchResultHtml();
        }
    });
}

function showScroll() {
    let pageHeight = $(document).height()
    let windowHeight = $(window).height();
    if (pageHeight > windowHeight) {
        return;
    }
    let height = windowHeight - $("#content_left").height() + 50;
    $("#page").css("margin-top", height + "px");
}