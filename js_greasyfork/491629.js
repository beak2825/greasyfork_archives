// ==UserScript==
// @name         搜索主页清理器
// @namespace    https://greasyfork.org/
// @version      2.6.4
// @description  搜索主页清理器，一个可以让您摆脱搜索引擎广告的插件
// @author       Voldemort
// @match        https://www.baidu.com/
// @match        https://www.hao123.com/
// @match        https://www.so.com/
// @match        https://www.so.com/?src=haosou.com
// @match        https://www.so.com/?src=haosou.net
// @match        https://www.so.com/?src=haosou.com.cn
// @match        https://www.so.com/?src=haoso.com
// @match        https://hao.360.com/
// @match        https://www.sogou.com/
// @match        http://www.sogou.net/
// @icon         https://img1.baidu.com/it/u=4275680630,1655814315&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491629/%E6%90%9C%E7%B4%A2%E4%B8%BB%E9%A1%B5%E6%B8%85%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/491629/%E6%90%9C%E7%B4%A2%E4%B8%BB%E9%A1%B5%E6%B8%85%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

/*
 * Copyright(c) 2021 DK
 * 此程序基于 GPL-3.0 开源。
*/

let url = document.URL;

//删除函数
let del = function (element) {
    if (element != null) {
        element.remove();
    }
    console.log(element);
}

//修改百度
let baidu = function () {
    let news_ad = document.getElementById("s_wrap");
    let top_ad = document.getElementById("s_top_wrap");
    let top_left_ad = document.getElementById("s-top-left");
    let top_u1_ad = document.getElementById("u1");
    let ad5 = document.getElementById("bottom_layer");
    let s_hotsearch_wrapper_ad = document.getElementById("s-hotsearch-wrapper");
    del(news_ad);
    del(top_ad);
    del(top_left_ad);
    del(top_u1_ad);
    del(ad5);
    del(s_hotsearch_wrapper_ad);
}

//修改hao123
let hao123 = function () {
    let topcolumn_ad = document.getElementById("topColumn");
    let noticeslider_ad = document.getElementById("noticeslider");
    let hotsearchcon_ad = document.getElementsByClassName("hotsearchCon")[0];
    let noticelink_ad = document.getElementById("noticeLink");
    let layoutmain_ad = document.getElementsByClassName("layout-main")[0];
    let shortcutbox_ad = document.getElementById("shortcut-box");
    let skinwrapper_ad = document.getElementsByClassName("skin-wrapper")[0];
    let agingtools_ad = document.getElementsByClassName("aging-tools")[0];
    let footer_ad = document.getElementById("footer");
    let notice_ad = document.getElementById("notice");
    let hotword_hotword_hook_ad = document.getElementsByClassName("hotword hotword-hook")[0];
    del(topcolumn_ad);
    del(noticeslider_ad);
    del(hotsearchcon_ad);
    del(noticelink_ad);
    del(layoutmain_ad);
    del(shortcutbox_ad);
    del(skinwrapper_ad);
    del(agingtools_ad);
    del(footer_ad);
    del(notice_ad);
    del(hotword_hotword_hook_ad);
}

//修改so360
let so360 = function () {
    let header_ad = document.getElementById("header");
    let cardcontainer_ad = document.getElementById("card_container");
    let oftenso_ad = document.getElementById("often_so");
    let footer_ad = document.getElementById("footer");
    del(header_ad);
    del(cardcontainer_ad);
    del(oftenso_ad);
    del(footer_ad);
}

//修改hao360
let hao360 = function () {
    let docbd_ad = document.getElementById("doc-bd");
    let docft_ad = document.getElementById("doc-ft");
    let doctopft_ad = document.getElementById("doc-top-ft");
    let doctophd_ad = document.getElementById("doc-top-hd");
    let browser360tips_ad = document.getElementById("browser360-tips");
    let plane_ad = document.getElementById("plane");
    let searchhd_ad = document.getElementsByClassName("search-hd")[0];
    let festivalsearchbg_ad = document.getElementById("festival-search-bg");
    let sohotwordwrap_ad = document.getElementById("so-hotword-wrap");
    let searchhotword_ad = document.getElementById("search-hotword");
    let large2small_ad = document.getElementById("large2small");
    let search_newhotword_count_ad = document.getElementById("search-new-hotword-count");
    del(docbd_ad);
    del(docft_ad);
    del(doctopft_ad);
    del(doctophd_ad);
    del(browser360tips_ad);
    del(plane_ad);
    del(searchhd_ad);
    del(festivalsearchbg_ad);
    del(sohotwordwrap_ad);
    del(searchhotword_ad);
    del(large2small_ad);
    del(search_newhotword_count_ad);
}

//修改搜狗
let sougou = function () {
    let header_ad = document.getElementsByClassName("header")[0];
    let qrcode_footer_ad = document.getElementById("QRcode-footer");
    del(header_ad);
    del(qrcode_footer_ad);
}

window.onload = function () {
    if (url === "https://www.baidu.com/") {
        baidu();
    }
    else if (url === "https://www.hao123.com/") {
        hao123();
    }
    else if (url === "https://www.so.com/" || url === "https://www.so.com/?src=haosou.com" || url === "https://www.so.com/?src=haosou.net" || url === "https://www.so.com/?src=haosou.com.cn" || url === "https://www.so.com/?src=haoso.com") {
        so360();
    }
    else if (url === "https://hao.360.com/") {
        hao360();
    }
    else if (url === "https://www.sogou.com/" || url === "http://www.sogou.net/") {
        sougou();
    }
};