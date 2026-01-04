// ==UserScript==
// @name         baidu search|百度广告|百度搜索页优化|去广告|隐藏无用内容|页面美化|搜索扩展
// @namespace    com.github.secake.baidusearch
// @version      1.0
// @license      MIT
// @description  for www.baidu.com|百度广告|百度搜索页优化|去广告|隐藏无用内容|页面美化|搜索扩展
// @author       secake
// @match        https://www.baidu.com/s*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.staticfile.org/jquery/1.10.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/447814/baidu%20search%7C%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A%7C%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5%E4%BC%98%E5%8C%96%7C%E5%8E%BB%E5%B9%BF%E5%91%8A%7C%E9%9A%90%E8%97%8F%E6%97%A0%E7%94%A8%E5%86%85%E5%AE%B9%7C%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96%7C%E6%90%9C%E7%B4%A2%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/447814/baidu%20search%7C%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A%7C%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5%E4%BC%98%E5%8C%96%7C%E5%8E%BB%E5%B9%BF%E5%91%8A%7C%E9%9A%90%E8%97%8F%E6%97%A0%E7%94%A8%E5%86%85%E5%AE%B9%7C%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96%7C%E6%90%9C%E7%B4%A2%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

var isBaisuSearchPage = location.pathname.match(/\/s\?/i) !== null;

var optionShow = {
    "hideAd": "隐藏广告",
    "changeTheme": "开启页面美化",
    "hideBillboard": "隐藏热榜",
    "hideRelated": "隐藏关联词",
    "showHost": "展示跳转链接",
    "otherSearch": "展示扩展搜索",
}

var optionHandlers = {
    "hideAd": function () { GM_setValue('hideAd', !GM_getValue('hideAd')), showOptions() },
    "changeTheme": function () { GM_setValue('changeTheme', !GM_getValue('changeTheme')), showOptions() },
    "hideBillboard": function () { GM_setValue('hideBillboard', !GM_getValue('hideBillboard')), showOptions() },
    "hideRelated": function () { GM_setValue('hideRelated', !GM_getValue('hideRelated')), showOptions() },
    "showHost": function () { GM_setValue('showHost', !GM_getValue('showHost')), showOptions() },
    "otherSearch": function () { GM_setValue('otherSearch', !GM_getValue('otherSearch')), showOptions() },
}

var items = [
    "hideAd",
    "changeTheme",
    "hideBillboard",
    "hideRelated",
    "showHost",
    "otherSearch"
]

var optionIds = new Map()
showOptions()
function showOptions() {
    for (var k of items) {
        console.log(k, GM_getValue(k))
        if (optionIds.get(k) != undefined) {
            GM_unregisterMenuCommand(optionIds.get(k))
        }

        if (GM_getValue(k) == undefined) {
            GM_setValue(k, true)
        }

        show = '❌ '
        enable = false
        if (GM_getValue(k) == true) {
            show = '✅ '
            enable = true
        }

        optionIds.set(k, GM_registerMenuCommand(show + optionShow[k], optionHandlers[k], ''))
    }
}

var colorConfig = {
    "tagBackgroundColor": "#DEF4FE",
    "tagColor": "#196AD6",
    "itemBackgroundColor": "#FFFFFF",
}

// 只安装一次
var isSingleScript = true;

function init() {
    if ($('#is-single-script').text() != "true") {
        $('body').prepend('<div id="is-single-script" style="display:none;">true</div>')
    } else {
        isSingleScript = false
    }
}

(function () {
    init()
    if (!isSingleScript) {
        console.log("同时安装了多次插件")
        return
    }

    $('#su').on('click', function (event) { self.setTimeout(optimize, 1000) })
    optimize()
})()

function optimize() {

    // 隐藏广告
    if (GM_getValue('hideAd')) {
        hideAd()
    }
    // 修改主题
    if (GM_getValue('changeTheme')) {
        changeTheme()
    }
    // 隐藏热榜
    if (GM_getValue('hideBillboard')) {
        hideBillboard()
    }
    // 隐藏关联词
    if (GM_getValue('hideRelated')) {
        hideRelated()
    }
    // 显示跳转 host
    if (GM_getValue('showHost')) {
        showHost()
    }
    // 搜索扩展
    if (GM_getValue('otherSearch')) {
        otherSearch()
    }

    // 点击分页跳转
    $('#page').find('a').on('click', function (event) { self.setTimeout(optimize, 1000) })

}

// 隐藏广告
function hideAd() {
    var adDiv = $('.EC_result')
    adDiv.css({ "display": "none" })

    $('#con-right-bottom').css({ "display": "none" })
}

// 主题优化
function changeTheme() {
    $('.result-op.c-container').css({
        "backgroundColor": colorConfig['itemBackgroundColor'],
        "border-radius": "5px",
        "box-shadow": "0 3px 6px rgb(140 149 159 / 15%)",
        "padding": "5px"
    })
    $('.result.c-container').css({
        "backgroundColor": colorConfig['itemBackgroundColor'],
        "border-radius": "5px",
        "box-shadow": "0 3px 6px rgb(140 149 159 / 15%)",
        "padding": "5px"
    })
    $('em').css({
        "color": "#bb0000",
    })
    $('a').css({
        "color": "#0000bb",
    })
    $('a.kuaizhao').attr("style", "color: rgb(0, 0, 100);")
}

// 展示源网页host
function showHost() {
    function getHost(url) {
        if (!url || url == null || url == "null") {
            return ""
        }
        u = new URL(url)
        return u.hostname
    }

    function showHostImpl(index) {
        $(this).find('.OP_LOG_LINK:last').find('.c-color-gray:first').text(getHost($(this).attr('mu')))
        $(this).find('.OP_LOG_LINK:last').find('a:first').attr("href", $(this).attr('mu'))
    }

    $('.result-op.c-container').each(showHostImpl)
    $('.result.c-container').each(showHostImpl)

}

function hideBillboard() {
    $('#con-ar').css({ "display": "none" })
    $('#con-ceiling-wrapper').css({ "display": "none" })
}

function hideRelated() {
    $('.cr-content.container_2AHLd').css({ "display": "none" })
}

function hideRightContent() {
    $('#content_right').css({ "display": "none" })
}

function otherSearch() {
    // 去掉旁站 header referrer
    $('meta[name=referrer]').attr('content', 'same-origin')
    // 增加css
    css = `
    .other-search-links{
        display:inline-block;
        border-radius: 1em;
        text-align:center;
        margin-right: 5px;
        margin-top: 5px;
        overflow: hidden;
        padding: 5px;
        padding-left: 10px;
        padding-right: 10px;
        box-sizing:border-box;
        font-size: 12px;
        font-weight: 600;
        line-height: 20px;
        color:`+ colorConfig['tagColor'] + `;
        background-color:`+ colorConfig['tagBackgroundColor'] + `;
    }
    `

    $('body').prepend(`<style id="baidu-search-css">` + css + `</style>`)

    const navigationDatas = [
        {
            "name": "资源搜索", "list": [
                { "name": "书签搜索", "url": "https://www.bookmarkearth.com/s/search?q=@@&currentPage=1" },
                { "name": "网盘搜索", "url": "https://www.xiaozhukuaipan.com/s/search?q=@@&currentPage=1" },
                { "name": "财经搜索", "url": "https://www.shaduizi.com/s/search?q=@@&currentPage=1" },
                { "name": "百度百科", "url": "https://baike.baidu.com/item/@@" },
                { "name": "知乎搜索", "url": "https://www.zhihu.com/search?type=content&q=@@" },
                { "name": "B站搜索", "url": "https://search.bilibili.com/all?keyword=@@&from_source=webtop_search&spm_id_from=333.851" },
                { "name": "抖音搜索", "url": "https://www.douyin.com/search/@@?aid=0a9fc74b-01e8-4fb0-9509-307c5c07fda1&publish_time=0&sort_type=0&source=normal_search&type=general" },
                { "name": "搜狗|公众号", "url": "https://weixin.sogou.com/weixin?type=2&query=@@" },
                { "name": "搜狗|知乎", "url": "https://www.sogou.com/sogou?pid=sogou-wsse-ff111e4a5406ed40&insite=zhihu.com&ie=utf8&p=73351201&query=@@&ie=utf8&p=73351201&query=@@" },
                { "name": "豆瓣搜索", "url": "https://www.douban.com/search?q=@@" },
                { "name": "电影搜索", "url": "https://www.cupfox.com/search?key=@@" },
                { "name": "维基百科", "url": "https://en.wikipedia.org/w/index.php?search=@@" },
                { "name": "法律法规", "url": "https://www.pkulaw.com/law/chl?Keywords=@@" },
                { "name": "PPT搜索", "url": "https://www.chuliansheji.com/s/search?q=@@&currentPage=1&c=1" },
                { "name": "icon搜索", "url": "https://www.iconfont.cn/search/index?searchType=icon&q=@@" },
                { "name": "github", "url": "https://github.com/search?q=@@" },
                { "name": "csdn", "url": "https://so.csdn.net/so/search?q=@@&t=&u=" },
            ]
        },
        {
            "name": "搜索引擎", "list": [
                { "name": "百度", "url": "https://www.baidu.com/s?wd=@@" },
                { "name": "必应", "url": "https://cn.bing.com/search?q=@@" },
                { "name": "Google", "url": "https://www.google.com/search?q=@@" },
                { "name": "360搜索", "url": "https://www.so.com/s?ie=utf-8&fr=none&src=360sou_newhome&nlpv=basest&q=@@" },
                { "name": "搜狗", "url": "https://www.sogou.com/web?query=@@" },
                { "name": "头条搜索", "url": "https://so.toutiao.com/search?dvpf=pc&source=input&keyword=@@" }
            ]
        }
    ];

    $('#content_right').prepend(`<div id="otherSearch"></div>`)
    for (var navigationData of navigationDatas) {
        $('#otherSearch').append(`<div>` + navigationData['name'] + `</div><div class="otherSearch-container"></div>`)
        container = $('#otherSearch').find('.otherSearch-container:last')
        for (var data of navigationData['list']) {
            container.append(`<div class="other-search-links">
            <a target="_blank" href="`+ data['url'].replace("@@", $('#kw').val()) + `">` + data['name'] + `</a></div>`)
        }
    }

}

// utils

// 获取查询参数
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}
