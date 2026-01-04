// ==UserScript==
// @name         文献互助小帮手：①读秀PDF一键下载 ②图书馆联盟、读秀、超星、中美百万显示SSID等索书号 ③各文献站、图书电商站与豆瓣的互访链接 ④一键复制元数据
// @name:zh-CN   文献互助小帮手：①读秀PDF一键下载 ②图书馆联盟、读秀、超星、中美百万显示SSID等索书号 ③各文献站、图书电商站与豆瓣的互访链接 ④一键复制元数据
// @name:zh-TW   文獻互助小幫手：①讀秀PDF一鍵下載 ②圖書館聯盟、讀秀、超星、中美百萬顯示SSID等索書號 ③各文獻站、圖書電商站與豆瓣的互訪鏈接 ④一鍵複製元數據
// @name:en      Literature mutual helper
// @name:ja      文献相互支援
// @namespace    ucdrs.superlib.net
// @version      1.10.5
// @update-note  新增：书签链接和一键复制书签。复制的书签附带页码，可供PdgCntEditor使用，链接添加在SSID、DXID、复制的元数据三处，书签数据由yysk.org提供，见
// @update-note  新增：没有SSID时，通过yysk.org提供的接口，尝试查询SSID，见
// @update-note  修复：改善脚本管理器兼容性支持，见，删除DXID上误添加的到百度网盘存储路径的链接，DXID上opacity为NaN的问题
// @update-note  移除：移除SSID上到百度网盘存储路径的链接，以及相应的配置菜单
// @update-note  优化：有SSID时同时显示SSID和DXID，否则只显示DXID，优化一些说明性文字
// @update-note  优化：对自动翻页的支持方式由setinterval改为mutationObserver，降低页面资源损耗
// @update-note  修复：右键点击小图标无反应的问题
// @author       Theron
// @icon         data:image/png;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAACMuAAAjLgAAAAAAAAAAAAD///////////39///6+v//+/v///39//////////////7+///+/v///////////////////v7///////////////////z8///+/v////////7+////////4uL//0pJ//+wsP///////+np//9wb///vr7///////////////////////9ycf//Jyf//3h4//+np///4uL//+7u//9FRf//Cgn//+7u//+5uf//BQT//wAA//+jo/////////v7////////s7P//xoa//8XF///ISD//w4N//8tLP//f3///yoq//9YWP////////////8zMv//W1v////////7+////Pz///////89PP//hYT////////T0///Bgb//46O//+1tf//Bgb//+jo////////XFz//0tK////////+/v///z8////////ODf//4KB////////7u7//xUU///Pz////v7//w0M//+srP///////2Rk//9CQf////////z8///8/P///////0hI//8MC///NjX//yoq//8BAP//ysr///////8xMf//d3f///////9ubv//OTj////////8/P///Pz///////8+Pf//YWD//9nZ//+4t///Dg3//8fH////////VlX//1JS////////eHj//zEw/////////f3///z8////////Ojn//4SD////////7u7//xQT///Gxv///////29v//88O////////4GA//8qKf////////39///8/P///////0VF//8jIv//Y2L//1JR//8FBP//ysn///////+Fhf//Ly7///////+Skf//Jib////////+/v///Pz///////9CQv//PDv//5KS//95ef//Dw7//7Gx//9HRv//IyP//xEQ//9xcf//Ozr//yQk//////////////z8////////PDz//4aG////////7u7//xsa//+5uf//jY3//zw7//8NDP//ZWX//1VU//9vb////f3////////8/P///////0JC//85OP//j4///3h3//8HBv//x8f///////+NjP//Hx///////////////////////////////f3///////+Ghv//TEz//1NS//9TUv//VFP//9XV////////gYH//wAA///o6P////////v7///////////////////////////////////////////////////9/f///////7u7//+Ojv//6+v////////+/v////////////////////////39///7+///+/v///v7///7+////v7/////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @match        *://book.ucdrs.superlib.net/views/specific/*
// @match        *://book.ucdrs.superlib.net/search*
// @match        *://book.dglib.superlib.net/views/specific/*
// @match        *://book.dglib.superlib.net/search*
// @match        *://book.zslib.com.cn/views/specific/*
// @match        *://book.zslib.com.cn/search*
// @match        *://search.douban.com/book/subject_search*
// @match        *://book.douban.com/isbn/*
// @match        *://book.douban.com/subject_search*
// @match        *://book.douban.com/tag/*
// @match        *://book.douban.com/subject/*
// @match        *://book.douban.com/series/*
// @match        *://book.douban.com/works/*
// @match        *://book.douban.com/producers/*
// @match        *://book.douban.com/press/*
// @match        *://book.douban.com/author/*/books*
// @match        *://book.douban.com/people/*/wish*
// @match        *://book.douban.com/people/*/do*
// @match        *://book.douban.com/people/*/collect*
// @match        *://www.douban.com/doulist/*
// @match        *://book.douban.com/cart*
// @match        *://cadal.edu.cn/cadalinfo/search*
// @match        *://cadal.edu.cn/cardpage/bookCardPage?*ssno=*
// @match        *://fx.ccelib.com/detail_*
// @match        *://fx.ccelib.com/s?*
// @match        *://www.ncpssd.org/Literature/ancientbooklist.aspx*
// @match        *://www.ncpssd.org/Literature/articleinfo.aspx*
// @match        *://www.digital.archives.go.jp/DAS/meta/*
// @match        *://www.digital.archives.go.jp/file/*.html
// @match        *://e.jd.com/*.html*
// @match        *://item.jd.com/*.html*
// @match        *://e.dangdang.com/products/*.html*
// @match        *://product.dangdang.com/*.html*
// @match        *://read.douban.com/ebook/*/*
// @match        *://www.dedao.cn/ebook/detail?*
// @match        *://www.bookschina.com/*
// @match        *://citic.cmread.com/zxHtml/html/paperBookDetailShare.html?*
// @match        *://www.kongfz.com/publisher/*/*
// @match        *://www.kongfz.com/writer/*/*
// @match        *://shop.kongfz.com/*
// @match        *://book.kongfz.com/*/*/*
// @match        *://book.kongfz.com/C*/*
// @match        *://item.kongfz.com/*
// @match        *://search.kongfz.com/product_result/?*
// @match        *://search.kongfz.com/item_result/?*
// @match        */n/slib/book/slib/*
// @match        */n/jpgfs/book/base/*
// @require      https://greasyfork.org/scripts/450973-gb2312utf8/code/GB2312UTF8.js?version=1091107
// @require      https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.9.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @include      */search?*
// @include      *bookDetail.jsp?*
// @include      *chapter.jsp?*
// @include      *book.do?*
// @exclude      *://*.google./*
// @exclude      *://*.bing./*
// @description  ①读秀试读或者包库全文、汇雅电子书的一键下载 ② 在图书馆参考咨询联盟(ucdrs)或读秀(duxiu)以及他们镜像站上显示文献的ssid或dxid，用于图书文献互助、群组找书等场景；显示大学数字图书馆国际合作计划(cadal)的书号-ssno，用于查询下载中美百万书册；显示社科文献中心、日本内阁文库等文献站点的索书号。 ③ 提供各文献站点、图书电商和豆瓣图书的互访链接。 ④ 一键复制各文献站点的索书号、图书元数据。 To搜索[红太狼的平底锅]的朋友：提供红太狼的平底锅的部分功能，如显示ssid，但不提供售卖，下载请自行找百度网盘群组；显示dxid或其它索书号、双向链接、一键复制等为平底锅没有的新加功能。
// @description:zh-CN  ①读秀试读或者包库全文、汇雅电子书的一键下载 ② 在图书馆参考咨询联盟(ucdrs)或读秀(duxiu)以及他们镜像站上显示文献的ssid或dxid，用于图书文献互助、群组找书等场景；显示大学数字图书馆国际合作计划(cadal)的书号-ssno，用于查询下载中美百万书册；显示社科文献中心、日本内阁文库等文献站点的索书号。 ③ 提供各文献站点、图书电商和豆瓣图书的互访链接。 ④ 一键复制各文献站点的索书号、图书元数据。 To搜索[红太狼的平底锅]的朋友：提供红太狼的平底锅的部分功能，如显示ssid，但不提供售卖，下载请自行找百度网盘群组；显示dxid或其它索书号、双向链接、一键复制等为平底锅没有的新加功能。
// @description:zh-tw ①讀秀試讀或者包庫全文、匯雅電子書的一鍵下載 ② 在圖書館參考諮詢聯盟(ucdrs)或讀秀(duxiu)以及他們鏡像站上顯示文獻的ssid或dxid，用於圖書文獻互助、羣組找書等場景；顯示大學數字圖書館國際合作計劃(cadal)的書號-ssno，用於查詢下載中美百萬書冊；顯示社科文獻中心、日本內閣文庫等文獻站點的索書號。 ③ 提供各文獻站點、圖書電商和豆瓣圖書的互訪鏈接。 ④ 一鍵複製各文獻站點的索書號、圖書元數據。 To搜索[紅太狼的平底鍋]的朋友：提供紅太狼的平底鍋的部分功能，如顯示ssid，但不提供售賣，下載請自行找百度網盤羣組；顯示dxid或其它索書號、雙向鏈接、一鍵複製等爲平底鍋沒有的新加功能。
// @description:en ①Show ssid/dxid from Library Reference Alliance (ucdrs) or Duxiu (duxiu) ②Show ssno from CADAL ③Provide links from ucdrs, duxiu, cadal to Douban Books
// @description:ja ①LibraryReference Alliance（ucdrs）またはDuxiu（duxiu）からssid / dxidを取得②ZhongmeiMillion（cadal）からssnoを取得③ucdrs、duxiu、cadalからDoubanBooksへのリンクを提供
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @license     Copyright Theron
// @downloadURL https://update.greasyfork.org/scripts/435569/%E6%96%87%E7%8C%AE%E4%BA%92%E5%8A%A9%E5%B0%8F%E5%B8%AE%E6%89%8B%EF%BC%9A%E2%91%A0%E8%AF%BB%E7%A7%80PDF%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%20%E2%91%A1%E5%9B%BE%E4%B9%A6%E9%A6%86%E8%81%94%E7%9B%9F%E3%80%81%E8%AF%BB%E7%A7%80%E3%80%81%E8%B6%85%E6%98%9F%E3%80%81%E4%B8%AD%E7%BE%8E%E7%99%BE%E4%B8%87%E6%98%BE%E7%A4%BASSID%E7%AD%89%E7%B4%A2%E4%B9%A6%E5%8F%B7%20%E2%91%A2%E5%90%84%E6%96%87%E7%8C%AE%E7%AB%99%E3%80%81%E5%9B%BE%E4%B9%A6%E7%94%B5%E5%95%86%E7%AB%99%E4%B8%8E%E8%B1%86%E7%93%A3%E7%9A%84%E4%BA%92%E8%AE%BF%E9%93%BE%E6%8E%A5%20%E2%91%A3%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%85%83%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/435569/%E6%96%87%E7%8C%AE%E4%BA%92%E5%8A%A9%E5%B0%8F%E5%B8%AE%E6%89%8B%EF%BC%9A%E2%91%A0%E8%AF%BB%E7%A7%80PDF%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%20%E2%91%A1%E5%9B%BE%E4%B9%A6%E9%A6%86%E8%81%94%E7%9B%9F%E3%80%81%E8%AF%BB%E7%A7%80%E3%80%81%E8%B6%85%E6%98%9F%E3%80%81%E4%B8%AD%E7%BE%8E%E7%99%BE%E4%B8%87%E6%98%BE%E7%A4%BASSID%E7%AD%89%E7%B4%A2%E4%B9%A6%E5%8F%B7%20%E2%91%A2%E5%90%84%E6%96%87%E7%8C%AE%E7%AB%99%E3%80%81%E5%9B%BE%E4%B9%A6%E7%94%B5%E5%95%86%E7%AB%99%E4%B8%8E%E8%B1%86%E7%93%A3%E7%9A%84%E4%BA%92%E8%AE%BF%E9%93%BE%E6%8E%A5%20%E2%91%A3%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%85%83%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

/* jslint esversion: 6 */
/*globals jQuery, GB2312UTF8, JSZip, saveAs */

function bookid2link(bookid) {
    var lib;
    if (bookid.match(/^\d{8}$/)) {
        bookid = bookid.slice(0, 7);
        lib = "duxiu";
    } else if (bookid.match(/^CD\d{8}$/i)) {
        bookid = bookid.slice(2, 9);
        lib = "cadal";
    } else if (bookid.match(/^BC\d{8}$/i)) {
        bookid = bookid.slice(2, 9);
        lib = "ncpssd";
    } else if (bookid.match(/^[MF]\d{19}$/i)) {
        bookid = bookid.slice(15, 20);
        lib = "najda";
    }
    return "https://pan.baidu.com/disk/home?from=newversion&stayAtHome=true&_at_=" + Date.now() + "#/all?vmode=list&path=%2Fyysk.org%2F" + lib + "%2F" + bookid.split("").join("%2F");
}

function showLink() {
    showlink = GM_getValue("showlink", "n");
    GM_setValue("showlink", showlink === "n" ? "y" : "n");
    showlink = GM_getValue("showlink", "n");
    GM_unregisterMenuCommand(menuid_showlink);
    menuid_showlink = GM_registerMenuCommand(showlink === "n" ? "改为显示链接" : "改为隐藏链接", showLink, "l");
    alert(showlink === "y" ? "将显示图书ID到百度网盘存储路径的链接，刷新页面生效" : "不再显示图书ID到百度网盘存储路径的链接，刷新页面生效");
}

var showlink = GM_getValue("showlink", "n");
var menuid_showlink = GM_registerMenuCommand(showlink === "n" ? "改为显示链接" : "改为隐藏链接", showLink, "l");
function ss2rc() {
    enablerc = GM_getValue("enablerc", "n");
    GM_setValue("enablerc", enablerc === "n" ? "y" : "n");
    enablerc = GM_getValue("enablerc", "n");
    GM_unregisterMenuCommand(menuid_enablerc);
    menuid_enablerc = GM_registerMenuCommand(enablerc === "n" ? "芝麻开门" : "芝麻关门", ss2rc, "z");
    alert(enablerc === "y" ? "查询ssid获取图书秒传码的功能已启用，请低调使用。使用方法：右键点击ssid右侧的📋。" : "已停用查询ssid获取图书秒传码的功能");
}

var enablerc = GM_getValue("enablerc", "n");
var menuid_enablerc = GM_registerMenuCommand(enablerc === "n" ? "芝麻开门" : "芝麻关门", ss2rc, "z");

var html = document.documentElement.innerHTML;

var observerOptions = {
    childList: true,
    attributes: false,
    subtree: false
};

// 允许连续失败的最大次数
const max_failscnt = 5;
// 页面下载失败，下次尝试前等待的秒数
const gap_fails = 30;
// 页面下载间隔随机秒数的上限、下限
const sleep_max = 8;
const sleep_min = 3;
const fmblimits = 999;

(function () {
    'use strict';
    function ogetk(object, key, default_value) {
        var result = object[key];
        return (typeof result !== "undefined") ? result : default_value;
    }
    function slim(s) {
        return s.replaceAll(/  +/g, "").trim();
    }
    function showbid(bookid, idtype, p=1) {
        var title = "";
        var rate = "";
        var prefix = "";
        if (idtype == "SSID") {
            prefix = bookid.slice(0, 4);
            rate = ogetk(rate_ssid, prefix, "-");
            title = rate === "-" ? "库存无此书-灰色" : prefix + "号段库存率为" + rate + "%";
        } else if (idtype == "DXID") {
            title = "如有SSID请优先使用SSID，DXID查询库存资源命中率较低";
            rate = "-";
        } else if (idtype == "SSNO<br>") {
            prefix = bookid.replace(/CD/, "").slice(0, 4);
            rate = ogetk(rate_ssno, prefix, "-");
            title = rate === "-" ? "库存无此书-灰色" : prefix + "号段库存率为" + rate + "%";
        }
        var title_type = {"SSID": "SSID / SuperStar ID", "DXID": "DXID / DuXiu ID", "SSNO<br>": "CADAL用于编目的SSNO", "BCID": "社科院文献中心编目的barcodenum", "DAID": "日本国立公文书馆内阁文库文献编号，有F和M开头两类，分别为辑合/单本的ID"}[idtype];
        var color = rate === "-" ? "grey" : "blue";
        var opacity = rate === "-" ? 1 : (parseFloat(rate) / 100 + 0.2);
        var bookid_snippet = `<span style="color: red; padding-right: 3px;" title="${title_type}">${idtype.replace("ID", "")}</span><span class="bid" style="color: ${color}; font-weight: bold; opacity: ${opacity}">${bookid}</span>`;
        if (showlink === "y" && bookid.length === 8) {
            var link = bookid2link(bookid);
            bookid_snippet = `<a href="${link}" target="_blank" style="text-decoration: none;">${bookid_snippet}</a>`;
        }
        if (p !== 1) {
            return bookid_snippet;
        }
        return `<p title="${title}" style="width: ${bookid.length <= 10 ? "120" : "120"}%; margin-left: -20px; font-size: 85%; text-align: center; margin-top: 5px; margin-bottom: 5px; clear:both;">${bookid_snippet}</p>`;
    }
    function sepit(s, sep) {
        if (sep === "|") {
            s = " | " + s;
        } else if (sep === "br") {
            s = s + "<br>";
        } else if (sep === "p") {
            s = `<p style="text-align: center">${s}</p>`;
        } else if (sep) {
            s = sep + s;
        }
        return s;
    }
    function shortenbkn(s) {
        s = s.trim().replace(/(.)[\[【\(（].*/, "$1");
        while (s.includes(" ") && s.replace(/[A-z0-9]{2}/g, "的").length > 20) {
            s = s.replace(/ [^ ]*$/, "");
        }
        return s;
    }
    function ucdrslink(bookname, isbn = "", args = {}) {
        var args0 = {"sep": "", text: "参考联盟", cls: "", style: ""};
        args = args === {} ? args0 : Object.assign({}, args0, args);
        var sep = args.sep;
        var text = args.text;
        var cls = args.cls;
        var style = args.style;
        if (!style.includes("font-size")) style += "font-size: 90%;";
        if (text === "") text = "参考联盟";
        var r = sepit(`<a href="http://book.ucdrs.superlib.net/search?sw=${isbn ? isbn : bookname.replace(/^\[.*?\]/, "")}&bCon=&ecode=utf-8&channel=search&Field=${isbn ? "All" : "1"}" target="_blank" class="${cls}" style="${style}" title="参考联盟">${text}</a>`, sep);
        return r.replace(' class=""', '').replace(' style=""', '');
    }
    function ucdrslink4db(bookname, args = {"sep": "|"}) {
        args.style = "font-size: 80%; color: orange;";
        return ucdrslink(bookname, "", args);
    }
    function dzylink(key, args = {}) {
        var args0 = {"sep": "|", text: "多抓鱼", cls: "", style: ""};
        args = args === {} ? args0 : Object.assign({}, args0, args);
        var sep = args.sep;
        var text = args.text;
        var cls = args.cls;
        var style = args.style;
        if (!style.includes("font-size")) style += "font-size: 90%;";
        if (text === "") text = "多抓鱼";
        var r = sepit(`<a href="https://www.duozhuayu.com/search/book/${key.replace(/\//g, '')}" target="_blank" class="${cls}" style="${style}" title="多抓鱼">${text}</a>`, sep);
        return r.replace(' class=""', '').replace(' style=""', '');
    }
    function dblink(bookname, isbn = "", args = {}) {
        var args0 = {"sep": "|", "text": "", "cls": "", "style": ""};
        args = args === {} ? args0 : Object.assign({}, args0, args);
        var sep = args.sep;
        var text = args.text;
        var cls = args.cls;
        var style = args.style;
        if (!style.includes("font-size")) style += "font-size: 90%;";

        var dbname = isbn === "" ? "豆瓣搜索" : "豆瓣直达";
        if (text === "") text = dbname;
        if (pageurl.includes("://www.ncpssd.org/")) {
            text = "豆瓣";
        }
        var href = isbn === "" ? "https://search.douban.com/book/subject_search?search_text=" + bookname.trim() : `https://book.douban.com/isbn/${isbn.trim()}/?bookname=${bookname.trim()}`;
        return sepit(`<a href="${href}" target="_blank" class="${cls}" style="${style}" title="${dbname}">${text}</a>`, sep).replace(' class=""', '').replace(' style=""', '');
    }
    function dxtoc(url) {
        url = url.replace("bookDetail.jsp", "chapter.jsp").replace(/sw=[^/&]*/, "sw=1 2 3 中 4 5 6 7 8 大 参考 9 是 人 上 附 不 小 从 之 下 有 用 以 多 后 表 什么 十 10 部分 前 到 图 我 如何 要 可 内 里 记 区 外 天 来 你 西 再 序 南 步骤 同 录 附 去 女 篇 开 文 都 题 东 就 节 他 也 公 北 结 右 又 少 百 那 这 关 没 千 表格 个 男 章 0 论 几 今 左 万");
        return ` | <a href="${url}" target="_blank" style="font-size: 90%;">目录</a>`;
    }
    function dedao() {
        bookname = document.querySelector("figure.ebook-detail-header > figcaption.detail > h3.title").textContent.trim().split("（")[0];
        m_isbn = html.match(/"href":"isbn(\d+)/);
        isbn = m_isbn ? m_isbn[1] : "";
        let link = document.createElement("p");
        link.innerHTML = ucdrslink(bookname, isbn) + dblink(bookname, isbn);
        document.querySelector("figure.ebook-detail-header > figcaption.detail > h3.title").after(link);
    }
    function iid2bookid(iid) {
        if (iid.length >= 112) return "00000000";
        var bookid = "";
        var part = "";
        var tailhex = parseInt(iid.substring(iid.length - 2), 16);
        var encoded = iid.substring(0, iid.length - 32);
        var i;
        for (i = 0; i < encoded.length; i = i + 2) {
            part = encoded.substring(i, i + 2);
            bookid += String.fromCharCode(parseInt(part, 16) - tailhex);
        }
        console.log(bookid);
        return bookid.match(/^\d/) ? bookid.replace(/\//g, "").match(/^\d{8,}/)[0] : "00000000";
    }
    function copybid(bookid, bidtype) {
        return ` <a href="#" style="color: grey; text-decoration: none;" title="左击复制${bidtype}${enablerc === "y" ? "，右击查询秒传码" : ""}" class="copybid" data-text="${bookid}">📋</a><span class="copy_status" style="color:red; display:none;"></span></p>`;
    }
    function copymeta(bookid) {
        return ` <a href="#" style="color: grey; text-decoration: none;" title="点击复制完整元信息" class="copymeta" data-text="${bookid}">📑</a> <span class="copy_status" style="color:red; display:none;"></span>`;
    }
    function copyText(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            let textarea = document.createElement("textarea");
            document.body.appendChild(textarea);
            textarea.style.position = "absolute";
            textarea.style.clip = "rect(0 0 0 0)";
            textarea.value = text;
            textarea.select();
            document.execCommand("copy", true);
            textarea.remove();
        }
    }
    function nes(s) {
        return s === "" ? "-" : s;
    }
    function hsize(i) {
        let k = 1024;
        let m = k * 1024;
        let g = m * 1024;
        if (i >= g) return Math.round(i / g * 100, 2) / 100 + "G";
        if (i >= m) return Math.round(i / m * 100, 2) / 100 + "M";
        if (i >= k) return Math.round(i / k * 100, 2) / 100 + "K";
        return i + "bytes";
    }
    function fmb_clicked(event) {
        let ele = event.target;
        if (jQuery(ele).attr("href") !== "#") {
            return;
        }
        event.preventDefault();
        let fmbid = jQuery(ele).attr("data-fmbid");
        let md5_cache = GM_getValue("fmb" + fmbid, "");
        let ele_status = jQuery(ele).next();
        let filename = jQuery(ele).prev().prev().prev().text();
        let filesize = jQuery(ele).prev().prev().attr("title").split(" ")[1];
        if (md5_cache !== "") {
            let [cmd5, smd5] = md5_cache;
            if (smd5 !== "") {
                jQuery(ele).attr("href", `https://pcs.baidu.com/rest/2.0/pcs/file?app_id=266719&method=rapidupload&ondup=overwrite&content-length=${filesize}&content-md5=${cmd5}&slice-md5=${smd5}&path=/${filename}`);
                jQuery(ele).attr("title", "点击此链接，尝试直接转存，如失败需使用秒传连接脚本转存");
                ele_status.html("缓存命中，秒传码已复制，点击🔗也可直接转存");
            } else {
                ele_status.html("缓存命中，秒传码已复制");
            }
            return;
        }
        let today = new Date().toLocaleDateString('sv').replaceAll('-', '');
        let cnts = GM_getValue("ss2rc_cnt", {});
        let cnt = cnts[today] === undefined ? 0 : cnts[today];
        if (cnt >= fmblimits) return;
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.freembook.com/acquire?book_id=${fmbid}`,
            headers: {
                "referer": "https://api.freembook.com"
            },
            timeout: 10000,
            onload(res) {
                let rdata = JSON.parse(res.responseText);
                if (rdata.code !== 0) {
                    if (rdata.code === 1005) {
                        GM_setValue("ss2rc_cnt", cnts);
                        jQuery(".fmbquota").each(function(i, el) {
                            jQuery(el).text(cnt + 1);
                        });
                        ele_status.html(`获取秒传码失败，错误码 ${rdata.code} - ${rdata.message}${cnt === fmblimits ? " - 额度用完了，请明天再试（自行通过freembook查询或同IP的其他人查询也会消耗额度）" : " - 请重试"}`);
                    } else {
                        ele_status.html(`获取秒传码失败，错误码 ${rdata.code} - ${rdata.message}`);
                    }
                    return;
                }
                cnts[today] = cnt + 1;
                GM_setValue("ss2rc_cnt", cnts);
                let [cmd5, smd5] = rdata.book_baidu;
                GM_setValue("fmb" + fmbid, rdata.book_baidu);
                if (smd5 !== "") {
                    jQuery(ele).attr("href", `https://pcs.baidu.com/rest/2.0/pcs/file?app_id=266719&method=rapidupload&ondup=overwrite&content-length=${filesize}&content-md5=${cmd5}&slice-md5=${smd5}&path=/${filename}`);
                    jQuery(ele).attr("title", "点击此链接，尝试直接转存，如失败需使用秒传连接脚本转存");
                    copyText(`${cmd5}#${smd5}#${filesize}#${filename}`);
                    ele_status.html("秒传码已复制，点击🔗也可直接转存");
                } else {
                    copyText(`${cmd5}#${filesize}#${filename}`);
                    ele_status.html("秒传码已复制");
                }
            },
            onerror(res) {
                ele_status.html(`查询秒传码时发生错误，请稍后重试`);
            },
            onabort(res) {
                ele_status.html(`查询秒传码的任务被取消，请稍后重试`);
            },
            ontimeout(res) {
                ele_status.html(`查询秒传码的任务超时，请稍后重试`);
            },
        });
        jQuery(".fmbquota").each(function(i, el) {
            jQuery(el).text(cnt + 1);
        });
    }
    function copybid_clicked(event) {
        let ele = event.target;
        let bid = jQuery(ele).attr("data-text");
        jQuery(".copybid").unbind("contextmenu").bind("contextmenu", copybid_clicked);
        let bidtype = bid.length === 8 ? "SSID" : "DXID";
        if (bid.length === 10) bidtype = bid[0] === "B" ? "BCID" : "SSNO";
        if (bid.length === 20) bidtype = "DAID";
        if ((bidtype === "SSID" || bidtype === "DXID") && enablerc === "y" && event.type === "contextmenu" && !pageurl.includes("/s?")) {
            let today = new Date().toLocaleDateString('sv').replaceAll('-', '');
            let cnts = GM_getValue("ss2rc_cnt", {});
            let cnt = cnts[today] === undefined ? 0 : cnts[today];
            let tip = cnt <= (fmblimits - 1) ? `正在查询${bid}的秒传码......请耐心等待` : `根据ssid/dxid获取秒传链接为试验性功能，请低调使用。获取秒传码每日每IP限额${fmblimits}次，你已用完额度，只能查看资源列表。要获得秒传码，请明天再尝试！（自行通过freembook查询或同IP的其他人查询也会消耗额度，因此已用额度可能与你印象中不一致。）`;
            let nostock = jQuery(ele).prev().attr("style").includes("color: grey;");
            if (nostock) tip = "灰色SSID的书无库存，请不要查询！";
            let snippet = `<div class="rcresult">${tip}</div><div class="tgresult"></div>`;
            let isdx = html.includes("/views/specific/") ? false : true;
            let block = isdx ? jQuery(ele).parent().parent().parent() : jQuery(ele).parent().parent();
            let bookname = pageurl.includes("/search?") ? block.find("input[id^='title']").val().replace(/<.*?>/g, "") : jQuery(isdx ? "div.card_text > dl > dt" : "div.tutilte").text();
            let rcresult = pageurl.includes("/search?") ? block.find("div.rcresult") : jQuery("div.rcresult");
            let tgresult = pageurl.includes("/search?") ? block.find("div.tgresult") : jQuery("div.tgresult");
            if (rcresult.length === 0) {
                if (!isdx && pageurl.includes("/views/specific/")) jQuery("div.leftnav_tu > div:last").css({"height": "", "min-height": "265px"});
                (pageurl.includes("/search?") ? block.find(isdx ? "dl" : "div.get") : jQuery(isdx ? "div.card_text > dl" : "div.leftnav_tu").children().last()).after(snippet);
                rcresult = pageurl.includes("/search?") ? block.find("div.rcresult") : jQuery("div.rcresult");
                tgresult = pageurl.includes("/search?") ? block.find("div.tgresult") : jQuery("div.tgresult");
            } else {
                rcresult.text(tip);
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.freembook.com/search?category=tg&q=${bookname}`,
                headers: {
                    "referer": "https://api.freembook.com"
                },
                timeout: 10000,
                onload(res) {
                    console.log(res.responseText);
                    let rdata = JSON.parse(res.responseText);
                    if (rdata.code !== 0) {
                        tgresult.html(`在tg库查询【${bookname}】时发生错误，错误码 ${rdata.code} - ${rdata.message}`);
                        return;
                    }
                    let books = rdata.books;
                    if (books.length === 0) {
                        tgresult.html(`在tg库查询【${bookname}】无结果`);
                        return;
                    }
                    let r = "";
                    let seq = 0;
                    for (let book of books) {
                        let [bookname, author, language, pubdate, isbn, fids] = book;
                        seq += 1;
                        r += `<p class="rcitem"><span class="seq">${seq}.</seq> <span title="书名">${nes(bookname)}</span>, <span title="作者">${nes(author)}</span>, <span title="书号">${nes(isbn)}</span>`;
                        fids = fids.split("|");
                        for (let i = 0; i < fids.length; i++) {
                            let fid = fids[i];
                            if (fid !== "") {
                                let ftype = ["mobi", "epub", "azw3", "pdf"][i];
                                r += `, <a href="https://t.me/freembook_channel/${fid}" target="_blank" title="跳转到telegram客户端完成下载。">${ftype}</a>`;
                            }
                        }
                        r += "</p>";
                    }

                    if (r) {
                        r = `以下为检索书名获得的telegram 群组文件，请自行辨别是否所需图书。数据来源<a href="https://freembook.com/" target="_blank">freembook</a>。` + r;
                        tgresult.html(r);
                    }
                },
                onerror(res) {
                    tgresult.html(`在tg库查询【${bookname}】时发生错误，请稍后重试：<br>${res.responseText}`);
                },
                onabort(res) {
                    tgresult.html(`在tg库查询【${bookname}】的任务被取消，请稍后重试：<br>${res.responseText}`);
                },
                ontimeout(res) {
                    tgresult.html(`tg库查询${bookname}的任务超时，请稍后重试：<br>${res.responseText}`);
                },
            });
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.freembook.com/search?category=duxiu&q=${bid}`,
                headers: {
                    "referer": "https://api.freembook.com"
                },
                timeout: 10000,
                onload(res) {
                    let rdata = JSON.parse(res.responseText);
                    if (rdata.code !== 0) {
                        rcresult.html(`查询${bid}秒传码发生错误，错误码 ${rdata.code} - ${rdata.message}`);
                        return;
                    }
                    let books = rdata.books;
                    if (books.length === 0) {
                        rcresult.html(`查询${bid}秒传码无结果`);
                        return;
                    }
                    let books_filter = {};
                    for (let book of books) {
                        let [bidx, ssid, filename, filesize, dxid, bookname, pubdate, page, isbn, rctype] = book;
                        let key = filesize + "-" + rctype;
                        if (books_filter[key] !== undefined) continue;
                        books_filter[key] = bidx;
                    }
                    let r = "";
                    let seq = 0;
                    for (let book of books) {
                        let [bidx, ssid, filename, filesize, dxid, bookname, pubdate, page, isbn, rctype] = book;
                        if (books_filter[filesize + "-32"] !== undefined && books_filter[filesize + "-32"] !== bidx) continue;
                        if (books_filter[filesize + "-32"] === undefined && books_filter[filesize + "-0"] !== undefined && books_filter[filesize + "-0"] !== bidx) continue;
                        seq += 1;
                        r += `<p class="rcitem"><span class="seq">${seq}.</span> <span title="SSID">${nes(ssid)}</span>, <span title="DXID">${nes(dxid)}</span>, <span title="文件名">${nes(filename)}</span>, <span title="文件体积 ${nes(filesize)}">${hsize(filesize)}</span>, <span title="秒传码类型，长码比短码成功率高">${rctype === 32 ? "长码" : "短码"}</span> <a href="#" target="_blank" class="getfmb" title="点此获取秒传码" data-fmbid="${bidx}">🔗</a> <span class="cpstatus"></span></p>`;
                    }

                    if (r) {
                        r = `<p>今日已使用 <span class="fmbquota">${cnt}</span> / ${fmblimits}，点击🔗可获取${bid}的秒传码。使用<a href="https://greasyfork.org/zh-CN/scripts/424574" target="_blank">秒传链接脚本</a>可提取文件。数据来源<a href="https://freembook.com/" target="_blank">freembook</a>。</p>` + r;
                        rcresult.html(r);
                        jQuery(".getfmb").unbind("click").bind("click", fmb_clicked);
                    } else {
                        rcresult.html(`${bid}暂无秒传链接，库存率为0的书请不要尝试。本次查询不计用量，今日额度已使用 <span class="fmbquota">${cnt}</a> / ${fmblimits}。`);
                    }
                },
                onerror(res) {
                    rcresult.html(`查询${bid}的秒传码时发生错误，请稍后重试：<br>${res.responseText}`);
                },
                onabort(res) {
                    rcresult.html(`查询${bid}秒传码的任务被取消，请稍后重试：<br>${res.responseText}`);
                },
                ontimeout(res) {
                    rcresult.html(`查询${bid}秒传码的任务超时，请稍后重试：<br>${res.responseText}`);
                },
            });
        }
        copyText(bid);
        jQuery(ele).siblings(".copy_status").text("已复制" + bidtype).show().delay(1000).hide(0);
        return false;
    }
    function copymeta_clicked(event) {
        let ele = event.target;
        let bid = jQuery(ele).attr("data-text");
        let bidtype = bid.length === 8 ? "SSID" : "DXID";
        let meta;
        let bookname;
        let score;
        let popularity;
        let ele_title;
        let libscnt;
        let idx;
        if (pageurl.includes("superlib.net/search") || pageurl.includes("zslib.com.cn/search")) {
            meta = jQuery(ele).parent().parent().parent().parent().parent().text();
            meta = meta.replace(/\s+《(.*?)》.*\s+/, "【书名】$1");
            meta = meta.replace(/(作者|页数|出版社|出版日期|丛书名称|简介|主题词):/g, "\n【$1】");
            meta = meta.replace(/\meta+/g, "");
            meta = meta.trim() + `\n【链接】${pageurl.split("/search")[0] + jQuery(ele).prev().prev().prev().attr("href")}`;
        } else if (pageurl.includes("/views/specific/")) {
            meta = jQuery(ele).parent().parent().next().text();
            meta += jQuery(".tu_content").text().replace("内容提要:", "【内容提要】");
            meta = meta.replace(/\n\s+/g, "\n").replace("【作　者】", "【作者】");
            meta = meta.replace(/\n([^【])/g, "$1");
            bookname = jQuery(".tutilte").text();
            meta = `【书名】${bookname}\n` + meta + `\n【链接】${pageurl}`;
        } else if (pageurl.includes("://book.douban.com/subject")) {
            bidtype = "DBID";
            bookname = jQuery("h1")[0].textContent.trim();
            score = jQuery(".rating_people").text() === "" ? jQuery(".rating_sum").text().trim() : jQuery(".rating_num").text().trim() + "分 / " + jQuery(".rating_people").text();
            popularity = jQuery("div#collector > p.pl > a").text().replace(/([读过])(\d+)/g, "$1 / $2") + jQuery(".mod-hd > h2 > span.pl > a").text().replace("全部", "，短评") + jQuery("header > h2 > span.pl > a").text().replace("全部", "，书评");
            meta = jQuery("#info").text();
            meta = `【书名】${bookname}\n【评分】${score}\n【热度】${popularity}` + meta;
            meta = meta.replace(/\n\s+/g, "\n").replace(/:\n+/g, ": ").replace(" ", " ").replace(/(作者|出版社|出品方|副标题|原作名|译者|出版年|页数|定价|装帧|丛书|ISBN): */g, "【$1】").replace(/\n([^【])/g, "$1").replace(/【热度】\n/, "");
            meta += `\n【链接】https://book.douban.com/subject/${bid}/`;
        } else if (pageurl.includes("://www.ncpssd.org/Literature/articleinfo.aspx")) {
            bidtype = "BCID";
            meta = jQuery(ele).parent().parent().text().replace(/\n\s+/g, "\n").replace(/(.*)古籍 📋 /, "【书名】$1").replace(/(阅读全文|全文下载)/g, "").replace(/(分类|条码号|责任者|出版者|出版时间|版本|索书号|备注)：/g, "【$1】").trim() + `\n【链接】${pageurl}`;
        } else if (pageurl.includes("://cadal.edu.cn/cardpage/bookCardPage")) {
            bidtype = "SSNO";
            meta = jQuery(ele).parent().parent().text().replace(/\n\s+/g, "\n").replace(/(.*) \| 豆瓣(搜索|直达) 📋 /, "【书名】$1").replace(/(添加标签|试读|章节阅读)\n/g, "").replace(/(作者|出版社|馆藏单位|出版时间|ISBN|资源类型|标签|主题|说明)：/g, "【$1】").replace(/[\n\r]([^【])/, "$1").trim() + `\n【链接】${pageurl}`;
        } else if (pageurl.includes("://cadal.edu.cn/cadalinfo/search")) {
            bidtype = "SSNO";
            bookname = jQuery(ele).prev().prev().text().trim();
            meta = `【书名】${bookname}\n` + jQuery(ele).parent().parent().find("dd").text().replace(/\n\s+/g, "\n").replace(/(详情|阅读)\n/g, "").replace(/(作者|出版社|馆藏单位|出版时间|ISBN|资源类型|标签|主题|说明)：/g, "\n【$1】").trim().replace("作者】\n", "作者】").replace(/图书列表\(\d+\)/, "").replace(/[\n\r]+([^【])/g, "$1") + `\n【链接】https://cadal.edu.cn/cardpage/bookCardPage?ssno=${bid.replace("CD", "")}`;
        } else if (pageurl.includes("/search?sw=")) {
            ele_title = jQuery(ele).prev().prev().prev();
            bookname = jQuery(ele).prev().prev().prev().text().trim().match("^《(.*)》$")[1];
            meta = `【书名】${bookname}\n` + jQuery(ele).parent().parent().find("dd").text().replace(/\n\s+/g, "\n").replace(/(\n(馆藏纸本|包库全文|部分阅读|试读|汇雅电子书))+\n/g, "\n").replace(/\s*(总被引:|被图书引:)/g, "，$1").replace("收藏馆:", "【热度】收藏馆:").replaceAll(" ", "").replace(/(作者|出版社|出版日期|页数|丛书名|简介|ISBN|主题词|分类) : /g, "\n【$1】").trim() + `\n【链接】${pageurl.split("/search")[0] + "/" + ele_title.attr("href").split("&fenlei")[0]}`;
        } else if (pageurl.includes("/bookDetail.jsp?")) {
            libscnt = jQuery("div#otherlib > a:last").text();
            libscnt = libscnt.match(/>>更多\(收藏馆:\d+\)/) ? libscnt.match(/>>更多\(收藏馆:(\d+)\)/)[1] : 0;
            idx = jQuery("div#bookphoto > p").text().match(/.*(被引用指数.*)/);
            idx = idx ? idx[1].replace("被图书", "，被图书").replaceAll("数", "数 ") : "";
            popularity = (libscnt ? "收藏馆 " + libscnt : "") + (idx ? "，" + idx : "");
            meta = "【书名】" + jQuery("div.card_text").text().replace(/\n\s+/g, "\n").replace(/\n(馆藏纸本|包库全文|部分阅读|图书馆文献传递)\n/g, "\n").replace(/(作  者|ISBN号|页  数|出版发行|中图法分类号|参考文献格式|内容提要|原书定价|开本|主题词|丛书名) ?[:：] ?/g, "\n【$1】").replace("【作  者】", "【作者】").replace("【页  数】", "【页数】").trim().replace(/\n([^【])/g, "$1") + (popularity ? `\n【热度】${popularity}` : "") + `\n【链接】${pageurl.split("&fenlei=")[0]}`;
        } else if (pageurl.includes("://fx.ccelib.com/detail_")) {
            libscnt = jQuery("div.titStyle > em").text();
            libscnt = libscnt ? "馆藏 " + libscnt.match(/(\d+)/)[1] : "";
            meta = "【书名】" + jQuery("h4.falv_tit").text().trim() + jQuery(ele).parent().parent().text().replace(/.*豆瓣直达 📋 \n/, "").replace(/\n\s+/g, "\n").replace(/\n([^【])/g, "$1").replace(/全部展开\n【摘要】.*收起\n/, "\n").replace(/【获取途径】.*\n/, "\n") + (libscnt ? `\n【热度】${libscnt}` : "") + `\n【链接】${pageurl.split("&fenlei=")[0]}`;
        } else if (pageurl.includes("/s?")) {
            meta = "【书名】" + jQuery(ele).parent().parent().text().replace("[图书]", "").replace(/.*豆瓣直达 📋 \n/, "").replace(/\n\s+/g, "\n").replace(/\n获得途径[^\a]*/g, "").replace(/(作者|出处|ISBN|丛书名|主题词|摘要) ?[:：] ?/g, "\n【$1】").replace(/\n([^【])/g, "$1") + `\n【链接】${pageurl.split("/s?")[0] + jQuery(ele).parent().find("a:eq(1)").attr("href")}`;
        }

        meta = `【${bidtype}】${bid}\n` + meta.replace(" ,", ",").replace(/,([A-z0-9])/g, ", $1");
        meta = meta.replace(/^【DBID】.*\n/, "");
        meta = meta.replace(/\n+/g, "\n");
        meta = meta.replace(/\s+$/g, "");
        copyText(meta);
        jQuery(ele).siblings(".copy_status").text("已复制图书元数据").show().delay(1000).hide(0);
        return false;
    }
    function gettoc() {
        if (document.querySelector("ul#ztree").textContent === "") {
            alert("本书无目录数据可用");
            return false;
        }
        var tocurl = "http://path.sslibrary.com" + html.match(/<ul id="ztree" param="(.*?)" class="ztree">/)[1].replace(/amp;/g, "");
        GM_xmlhttpRequest({
            method: "GET",
            url: tocurl,
            timeout: 10000,
            onload(res) {
                var toc = "";
                console.log(res.responseText);
                const nodes = res.responseText.matchAll(/<(?:tree|node) id="(.*?)" Caption="(.*?)" PageNumber="(\d+)"/g);
                for (const node of nodes) {
                    let nodeid = node[1];
                    let tabs = (nodeid.match(/-/g) || []).length;
                    let caption = node[2].trim();
                    let pagenum = node[3];
                    toc += `${"\t".repeat(tabs)}${caption}\t${pagenum}\n`;
                }
                var pagesum = 0;
                if (pages[4][1] > 0) {pagesum += pages[4][1]; toc = `目录\t-${pagesum}\n` + toc;}
                if (pages[3][1] > 0) {pagesum += pages[3][1]; toc = `前言\t-${pagesum}\n` + toc;}
                if (pages[2][1] > 0) {pagesum += pages[2][1]; toc = `版权\t-${pagesum}\n` + toc;}
                if (pages[1][1] > 0) {pagesum += pages[1][1]; toc = `书名\t-${pagesum}\n` + toc;}
                if (pages[0][1] > 0) {pagesum += pages[0][1]; toc = `封面\t-${pagesum}\n` + toc;}
                if (pages[6][1] > 0) toc += `附录\t${pages[5][1] + 1}\n`;
                if (pages[7][1] > 0) toc += `封底\t${pages[5][1] + 1 + pages[6][1]}\n`;
                copyText(toc);
                alert("目录已复制到剪切板上，可在 PdgCntEditor 中直接粘贴使用");
            },
            onerror(res) {
                alert(`获取目录时发生错误，请稍后重试：${res.responseText}`);
            },
            onabort(res) {
                alert(`获取目录的任务被取消，请稍后重试。`);
            },
            ontimeout(res) {
                alert(`获取目录的任务超时，请稍后重试，如提示跨域权限请允许。`);
            },
        });
        return false;
    }
    function pad(num, n) {
        var s = '000000000000000000000000000000' + num;
        return s.substr(s.length - n);
    }
    function genpages(pe, prefix, ps=1) {
        let spages = [];
        for (var i = ps; i <= pe; i++) {
            spages.push(prefix + pad(i, 6 - prefix.length));
        }
        return spages;
    }
    function tipspage(spage) {
        var prefix;
        if (spage === "cov001") prefix = "封面";
        else if (spage === "cov002") prefix = "封底";
        else prefix = {"!": "目录页", "b": "书名页", "f": "前言页", "a": "附录页", "l": "版权页", "0": "正文页"}[spage[0]];
        return prefix + " " + spage;
    }
    function gen_spages_list() {
        var download_start = parseInt(document.querySelector("input#download_start").value);
        var download_end = parseInt(document.querySelector("input#download_end").value);
        if (download_end < 1 || download_end > pages[5][1]) download_end = pages[5][1];
        if (download_start < 1) download_start = 1;
        if (download_start > download_end) download_start = download_end;
        var download_all = document.querySelector("input#download_all").checked;
        var spages_all = (pages[0][0] > 0) ? ['cov001'] : []; // 封面
        if (pages[1][1] > 0) spages_all = spages_all.concat(genpages(pages[1][1], 'bok')); // 书名
        if (pages[2][1] > 0) spages_all = spages_all.concat(genpages(pages[2][1], 'leg')); // 版权
        if (pages[3][1] > 0) spages_all = spages_all.concat(genpages(pages[3][1], 'fow')); // 前言
        if (pages[4][1] > 0) spages_all = spages_all.concat(genpages(pages[4][1], '!')); // 目录
        var spages = download_all ? spages_all : [];
        spages_all = spages_all.concat(genpages(pages[5][1], '', 1)); // 正文
        spages = spages.concat(genpages(download_end, '', download_start)); // 正文
        var tails = (pages[6][1] > 0) ? genpages(pages[6][1], 'att') : []; // 附录
        if (pages[7][1] > 0) tails.push('cov002'); // 封底
        spages_all = spages_all.concat(tails);
        if (download_all) spages = spages.concat(tails);
        return [spages_all, spages, download_start, download_end, download_all];
    }
    function download_spages_list() {
        var list = gen_spages_list()[0].join("\n");
        list = list.replace("cov001", "封面页\tcov001").replace("cov002", "封底页\tcov002").replace(/^0/gm, "正文页\t0").replace(/l/g, "版权页\tl").replace(/b/g, "书名页\tb").replace(/!/g, "目录页\t!").replace(/a/g, "附录页\ta").replace(/f/g, "前言页\tf");
        var bookname = html.match(/<title>(.*?)<\/title>/)[1];
        var ssid = pageurl.match(/\b(\d{8})\b/)[1];
        saveAs(new Blob([list], {type: "text/plain;charset=utf-8"}), `${bookname}_${ssid}_pages.txt`);
        return false;
    }
    function appendlog(log) {
        var ele = jQuery("textarea#helperlog");
        var now = new Date().toLocaleString('en-US', {hour12: false}).split(" ")[1];
        ele.val(`${now} ${log}\n` + ele.val());
    }
    function show_failtip(failscnt, errorline) {
        console.log(errorline);
        if (failscnt === max_failscnt) {
            appendlog(`已连续${max_failscnt}次失败，将自动中断任务，请耐心等待下载`);
        } else {
            appendlog(`已失败${failscnt}次，${gap_fails}秒后将重试，请立即处理验证码`);
            alert("下载页面错误，请滚动页面查看是否需要过反爬虫验证，如多个页面加载失败，大概率是会话过期，请重新打开页面重试！");
        }
    }
    function okdownload() {
        if (downloading) {
            document.getElementById("okdownload").innerText = "一键下载";
            downloading = false;
            return false;
        }
        document.getElementById("okdownload").innerText = "停止下载";
        downloading = true;
        var jpgPath = html.match(/jpgPath: *"(.*?)",/)[1];
        var zoomvalue = document.querySelector("select#zoomvalue").value;
        var download_format = document.querySelector("select#download_format").value;
        var [spages_all, spages, download_start, download_end, download_all] = gen_spages_list();
        var temp = document.getElementById("spageslist").value.replace(/\s+/g, "\n").trim().split("\n").filter(function(s){
            return s.length === 6 && s.match(/^(cov|bok|leg|fow|!|att)?\d{3,}$/);
        });
        if (temp.length > 0) spages = temp;
        var maintip = temp.length > 0 ? `开始下载列表中的${spages.length}个页面` : `开始下载P${download_start}-P${download_end}，${download_all ? "附带非正文页" : "跳过非正文页"}`;
        jQuery("textarea#helperlog").val(`-----\n${maintip}，zoom值为${zoomvalue}，目标格式为${{"pdf": "PDF", "zip": "ZIP", "page": "分页图片"}[download_format]}\n-----\n1、为了避免频繁触发验证码，下载过程中不要滚动页面，出现弹窗时则要立即向下滚动页面或打开新的阅读页面，触发验证码并通过验证，超时${max_failscnt}次会中断下载。\n2、点击停止下载可中断任务，下载任务完成或被中断后，浏览器会保存剩余文件并导出下载日志，若pdf/zip文件生成慢暂时没反应，请耐心等待，不要关闭页面`);
        var bookname = html.match(/<title>(.*?)<\/title>/)[1];
        var ssid = pageurl.match(/\b(\d{8})\b/)[1];
        var jsPDF = window.jspdf.jsPDF;
        if(jsPDF && jsPDF.version) {
            console.log('jsPDF version: ' + jsPDF.version);
        }
        var pages_success = [];
        var pagescnt = spages.length;
        var imgsData = {};
        var imgsSize = {};
        var imgsExt = {};
        var maxwidth = 0;
        var maxheight = 0;
        var failscnt = 0;
        var page = 0;
        var timeout = 0;
        var now;
        var releasemem = function() {
            pages_success = [];
            imgsData = {};
            imgsSize = {};
            imgsExt = {};
            appendlog(`内存已释放`);
        };
        var savefiles = function() {
            if (download_format !== "page") appendlog(`正在保存${download_format}文件，请耐心等待！\n-----`);
            var zip = new JSZip();
            var doc = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: [imgsSize[pages_success[0]][0], imgsSize[pages_success[0]][1]],
                putOnlyUsedFonts:true
            });
            doc.setFontSize(72);
            var txt_download_done = "";
            var txt_download_fails = "";
            var log = "";
            var emptypages = 0;
            var firstpage_used = false;
            for (var i = 0; i < spages_all.length; i++) {
                let spage = spages_all[i];
                if (!spages.includes(spage)) {
                    log += `skip\t${spage}\n`;
                    continue;
                }
                let imgData = imgsData[spage];
                if (imgData === undefined) {
                    if (firstpage_used && (download_format === "pdf")) doc.addPage([imgsSize[pages_success[0]][0], imgsSize[pages_success[0]][1]], "p");
                    if (download_format === "pdf") doc.text(spage, 100, 100);
                    emptypages += 1;
                    log += `fail\t${spage}\n`;
                    txt_download_fails += (spage + "\n");
                    continue;
                }
                log += `ok\t${spage}\n`;
                let imgExt = imgsExt[spage];
                txt_download_done += (spage + "\n");
                if (download_format === "zip") zip.file(`${spage}.${imgExt}`, imgData, {blob: true});
                if (firstpage_used && (download_format === "pdf")) doc.addPage([imgsSize[spage][0], imgsSize[spage][1]], "p");
                if (download_format === "pdf") {
                    doc.addImage(imgData, imgExt, 0, 0, imgsSize[spage][0], imgsSize[spage][1]);
                    firstpage_used = true;
                }
            }
            if (download_format === "zip") {
                console.log("zipping");
                zip.file("done.txt", txt_download_done);
                zip.file("fails.txt", txt_download_fails);
                let progress = 0;
                let progress_prev = 0;
                zip.generateAsync({type:"blob"}, function updateCallback(metadata) {
                    progress = Math.round(metadata.percent * 10) / 10;
                    if (progress !== progress_prev) appendlog(`zip打包进度 ${progress}%'`);
                    progress_prev = progress;
                }).then(function(content) {
                    saveAs(content, `${bookname}_${ssid}.zip`);
                    appendlog(`zip文件完成打包，将自动保存到本地`);
                    releasemem();
                }).catch(function(err) {
                    appendlog(`zip文件打包出错，${err}`);
                    releasemem();
                });
            }
            if (download_format === "pdf") {
                doc.save(`${bookname}_${ssid}.pdf`);
                appendlog(`pdf文件保存完毕，${emptypages === 0 ? "无缺页" : "有" + emptypages + "张缺页，已标注"}`);
            }
            if (download_format !== "zip") releasemem();
            saveAs(new Blob([log], {type: "text/plain;charset=utf-8"}), `${bookname}_${ssid}_log.txt`);
            document.getElementById("okdownload").innerText = "一键下载";
            downloading = false;
        };
        var getpage = function () {
            page += 1;
            timeout = getRndInteger(sleep_min, sleep_max);
            let spage = spages[page - 1];
            console.log(`will download page ${spage}`);
            now = new Date().toLocaleString('en-US', {hour12: false}).split(" ")[1];
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://${pageurl.split("/")[2]}${jpgPath}${spage}?zoom=${zoomvalue}`,
                headers: {referer: pageurl},
                timeout: 5000,
                responseType: "blob",
                onload: function (res) {
                    console.log(`${res.status} ${res.statusText}`);
                    if (res.statusText !== "OK") {
                        console.log(res.responseText);
                        failscnt += 1;
                        show_failtip(failscnt, "statusText_not_OK");
                        timeout = (failscnt === max_failscnt) ? 0 : gap_fails;
                        appendlog(`${tipspage(spage)} 状态码错误`);
                        page -= 1;
                        if (timeout > 0) {setTimeout(getpage, timeout * 1000);} else savefiles();
                        return;
                    }
                    let blob = res.response;
                    let oFileReader = new FileReader();
                    oFileReader.onloadend = function (e) {
                        let imageData = e.target.result;
                        console.log(`image loaded, ${imageData.substring(0, 100)}`);
                        let image = new Image();
                        image.src = imageData;
                        image.onload = function() {
                            console.log(`page ${spage} dimension is w${image.width} x h${image.height}`);
                            console.log(imageData);
                            if (!imageData.startsWith("data:image") || (image.width === 994 && image.height === 1455 && imageData.startsWith("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+IAAAWvCAIAAACkbtyUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw"))) {
                                failscnt += 1;
                                show_failtip(failscnt, "fail_image_shown");
                                timeout = (failscnt === max_failscnt) ? 0 : gap_fails;
                                appendlog(`${tipspage(spage)} 数据加载失败`);
                                page -= 1;
                                if (timeout > 0) {setTimeout(getpage, timeout * 1000);} else savefiles();
                                return;
                            }
                            failscnt = 0;
                            pages_success.push(spage);
                            imgsSize[spage] = [image.width, image.height];
                            imgsExt[spage] = imageData.split(';')[0].split('/')[1];
                            if (download_format === "page") {
                                saveAs(blob, `${spage}.${imgsExt[spage]}`);
                            } else if (download_format === "pdf") {
                                imgsData[spage] = imageData;
                            } else if (download_format === "zip") {
                                imgsData[spage] = blob;
                            }
                            appendlog(`${tipspage(spage)} 已下载`);
                            console.log(`page ${spage} download ok: success - ${pages_success.length} / tried - ${page} / all - ${pagescnt} / flag - ${downloading}`);
                            document.querySelector("span#download_status").innerText = `下载进度：${pages_success.length} / ${page} / ${pagescnt}`;
                            if (!downloading || page === pagescnt) timeout = 0;
                            if (timeout > 0) {setTimeout(getpage, timeout * 1000);} else savefiles();
                        };
                        image.onerror = function() {
                            failscnt += 1;
                            show_failtip(failscnt, "image_load_error");
                            timeout = (failscnt === max_failscnt) ? 0 : gap_fails;
                            appendlog(`${tipspage(spage)} 未知原因，图片无法加载`);
                            page -= 1;
                            if (!downloading) timeout = 0;
                            if (timeout > 0) {setTimeout(getpage, timeout * 1000);} else savefiles();
                        };
                    };
                    oFileReader.readAsDataURL(blob);
                },
                onerror, onabort, ontimeout: function (res) {
                    console.log(`${res.status} ${res.statusText}`);
                    console.log(res.responseText);
                    console.warn(`page ${spage} download fail: success - ${pages_success.length} / tried - ${page} / all - ${pagescnt} / flag - ${downloading}`);
                    document.querySelector("span#download_status").innerText = `下载进度：${pages_success.length} / ${page} / ${pagescnt}`;
                    timeout = gap_fails;
                    appendlog(`${tipspage(spage)} 下载失败: ${res.statusText}`);
                    page -= 1;
                    if (!downloading) timeout = 0;
                    if (timeout > 0) {setTimeout(getpage, timeout * 1000);} else savefiles();
                }
            }); // GM_xmlhttpRequest end
        };
        getpage();
        return false;
    }
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
    function funcinterval(func, interval = 3000) {
        func();
        setInterval(func, interval);
    }
    var pageurl = window.location.href;
    console.log(pageurl);
    var bookid;
    var bookname;
    var author;
    var press;
    var ssid;
    var dxid;
    var img;
    var m_isbn;
    var isbn;
    var m_ssn;
    var m_dxid;
    var m_iid;
    var copys;
    var bidtype;
    var rate_ssno = {"0102":"6.78", "0103":"61.39", "0104":"13.44", "0105":"21.79", "0106":"5.95", "0200":"8.76", "0201":"14.58", "0202":"60.94", "0203":"99.75", "0204":"97.9", "0205":"100", "0206":"99.94", "0207":"32.44", "0208":"99.03", "0209":"96.05", "0210":"92.26", "0211":"72.13", "0212":"14.35", "0300":"54.5", "0301":"99.9", "0302":"98.44", "0303":"100", "0600":"50.14", "0601":"74.62", "0603":"10.05", "0604":"98.32", "0605":"98.83", "0606":"98.36", "0607":"17.15", "0610":"9.73", "0620":"12.67", "0621":"20.87", "0630":"71.93", "0631":"99.41", "0632":"99.97", "0633":"99.88", "0634":"23.53", "0635":"99.87", "0636":"86.49", "0637":"93.95", "0638":"52.87", "0639":"41.99", "0640":"9.92", "0650":"4.16", "0651":"0.06", "0655":"59.33", "0700":"91.92", "0701":"99.77", "0702":"16", "0709":"0.01", "0800":"12.82", "0801":"87.75", "0802":"32.89", "0803":"16.25", "0900":"99.29", "0901":"44.39", "0902":"0.15", "0903":"0.01", "0904":"0.01", "0905":"0.01", "0909":"0.04", "0920":"0.02", "0940":"0.01", "0981":"0.01", "1100":"0.05", "1101":"0.02", "1110":"99.94", "1111":"8.91", "1120":"28.99", "1140":"79.28", "1141":"24.02", "1300":"41.64", "1302":"4.5", "1303":"9.29", "1305":"0.02", "1390":"1.52", "1400":"13.6", "1401":"9.96", "1402":"5.71", "1501":"0.03", "1502":"0.02", "1503":"0.01", "1504":"0.01", "1600":"62.07", "1601":"53.61", "1602":"42.82", "1604":"97.75", "1605":"41.48", "1607":"5.59", "2100":"0.2", "2101":"53.79", "2102":"1.92", "2103":"0.97", "2300":"15.42", "2500":"54.85", "3200":"65.76", "3201":"88.28", "3202":"88.15", "3203":"78.57", "3204":"35.68", "3300":"97.61", "3301":"99.06", "3302":"97.91", "3303":"98.63", "3304":"97.11", "3305":"95.62", "3306":"89.35", "3307":"96.42", "3308":"87.63", "3309":"94.43", "3310":"92.08", "3311":"93.46", "3312":"94.49", "3313":"83.21", "3314":"93.99", "3315":"92.2", "3316":"90.44", "3317":"90.86", "3318":"85.25", "3319":"73.38", "3320":"23.49", "7700":"67.84", "9900":"4.15"};
    var rate_ssid = {"1000":"71.71","1001":"68.23","1002":"74.22","1003":"76.48","1004":"33.54","1005":"24.57","1006":"77.02","1007":"79.33","1008":"62.93","1009":"80.42","1010":"78.69","1011":"82.3","1012":"84.34","1013":"13.81","1014":"32.16","1015":"73.28","1016":"87.19","1017":"68.41","1018":"53.02","1019":"90.8","1020":"79.03","1021":"67.56","1022":"65.6","1023":"80.18","1024":"60.03","1025":"65.67","1026":"84.78","1027":"88.63","1028":"76.94","1029":"88.01","1030":"89.35","1031":"83.21","1032":"85.73","1033":"94.67","1034":"94.9","1035":"56.94","1036":"0.36","1037":"0.39","1038":"77.56","1039":"68.37","1040":"96.51","1041":"89.93","1042":"96.53","1043":"93.44","1044":"79.85","1045":"78.8","1046":"85.47","1047":"74.65","1048":"73.18","1049":"60.75","1050":"91.74","1051":"79.96","1052":"70.93","1053":"52.37","1054":"11.47","1055":"2.86","1056":"2.08","1057":"2.28","1058":"2.55","1059":"2.73","1060":"2.91","1061":"3.03","1062":"3.02","1063":"2.75","1064":"24.09","1065":"72.48","1066":"38.47","1067":"41.97","1068":"47.14","1069":"46.96","1070":"48.12","1071":"41.39","1072":"44.49","1073":"47.84","1074":"46.49","1075":"45.14","1076":"47.27","1077":"47.06","1078":"77.98","1079":"81.71","1080":"81.97","1081":"82.3","1082":"81.47","1083":"82.87","1084":"61.22","1085":"81.93","1086":"52.22","1087":"59.38","1088":"72.63","1089":"77.22","1090":"50.5","1091":"56.33","1092":"26.83","1093":"41.35","1094":"75.03","1095":"68.18","1096":"70.67","1097":"94.62","1098":"92.99","1099":"66.97","1100":"93.63","1101":"92.93","1102":"93.74","1103":"89.08","1104":"92.15","1105":"90.58","1106":"69.55","1107":"57.18","1108":"78.82","1109":"78.7","1110":"94.88","1111":"95.86","1112":"94.64","1113":"94.09","1114":"94.11","1115":"94.87","1116":"92.94","1117":"93.18","1118":"94.53","1119":"93.38","1120":"93.68","1121":"93.92","1122":"85.44","1123":"92.02","1124":"93.3","1125":"92.02","1126":"92.04","1127":"88.15","1128":"91.51","1129":"92.07","1130":"93.48","1131":"89.15","1132":"89.33","1133":"90.77","1134":"95.18","1135":"91.75","1136":"92.5","1137":"93.44","1138":"96.09","1139":"94.78","1140":"93.76","1141":"93.31","1142":"94.48","1143":"94.7","1144":"95.4","1145":"95.64","1146":"95.79","1147":"95.14","1148":"93.93","1149":"95.13","1150":"67.93","1151":"77.19","1152":"93.33","1153":"90.43","1154":"93.48","1155":"93.72","1156":"92.46","1157":"92.6","1158":"88.82","1159":"91.74","1160":"78.63","1161":"83.73","1162":"88.36","1163":"82.68","1164":"84.41","1165":"55.92","1166":"65.95","1167":"87.33","1168":"88.11","1169":"85.21","1170":"82.67","1171":"84.5","1172":"85.67","1173":"81.19","1174":"83.12","1175":"90.12","1176":"89.58","1177":"93.29","1178":"93.65","1179":"92.51","1180":"91.77","1181":"92.64","1182":"87.4","1183":"93.49","1184":"96.37","1185":"93.88","1186":"90.17","1187":"93.81","1188":"93.68","1189":"94.7","1190":"91.54","1191":"91.58","1192":"93.5","1193":"91.46","1194":"92.97","1195":"91.86","1196":"93.19","1197":"91.79","1198":"95.45","1199":"91.65","1200":"91.28","1201":"90.54","1202":"90.66","1203":"88.47","1204":"93.36","1205":"94.78","1206":"94.58","1207":"95.26","1208":"94.86","1209":"91.52","1210":"86.56","1211":"88.15","1212":"92.45","1213":"87.64","1214":"87.78","1215":"93.35","1216":"92.12","1217":"91.43","1218":"93.53","1219":"91.21","1220":"92.4","1221":"89.44","1222":"91.68","1223":"89.25","1224":"89","1225":"89.65","1226":"88.46","1227":"86.29","1228":"87.33","1229":"86.77","1230":"93.06","1231":"88.67","1232":"91.45","1233":"93.18","1234":"91.72","1235":"90.73","1236":"91.67","1237":"90.49","1238":"91.1","1239":"91.05","1240":"93.37","1241":"89.77","1242":"90.11","1243":"89.63","1244":"94.38","1245":"81.23","1246":"81.62","1247":"79.38","1248":"74.55","1249":"81.85","1250":"47.91","1251":"89.17","1252":"93.62","1253":"91.82","1254":"89.49","1255":"89.37","1256":"85.65","1257":"90.62","1258":"91.42","1259":"88.33","1260":"84.46","1261":"91.09","1262":"92.65","1263":"81.34","1264":"89.74","1265":"90.45","1266":"88.23","1267":"91.34","1268":"88.63","1269":"89.52","1270":"80.56","1271":"90.32","1272":"93.36","1273":"92.85","1274":"93.15","1275":"95.42","1276":"93.33","1277":"92.04","1278":"91.23","1279":"88.29","1280":"84.29","1281":"88.02","1282":"84.27","1283":"73.43","1284":"86.68","1285":"79.91","1286":"82.33","1287":"84.47","1288":"75.75","1289":"74.47","1290":"77.19","1291":"75.9","1292":"74.32","1293":"80","1294":"83.02","1295":"76.56","1296":"75.25","1297":"80.92","1298":"82.73","1299":"86.3","1300":"93.41","1301":"90.68","1302":"87.51","1303":"84.51","1304":"90.62","1305":"77.34","1306":"72.41","1307":"73.89","1308":"79.56","1309":"91.46","1310":"78.15","1311":"80.02","1312":"78.14","1313":"77.43","1314":"68.21","1315":"63.73","1316":"76.78","1317":"95.88","1318":"90.39","1319":"77.2","1320":"82.85","1321":"89.47","1322":"82.44","1323":"89.09","1324":"79.95","1325":"71.54","1326":"84.11","1327":"80.28","1328":"77.42","1329":"86.19","1330":"82.69","1331":"85.89","1332":"92.11","1333":"95.03","1334":"89.69","1335":"95.05","1336":"93.12","1337":"81.98","1338":"81.13","1339":"92.26","1340":"89.55","1341":"93.02","1342":"90.73","1343":"94.82","1344":"95.46","1345":"88.61","1346":"89.42","1347":"93.85","1348":"94.69","1349":"90.46","1350":"86.58","1351":"91.11","1352":"85.56","1353":"84.05","1354":"80.7","1355":"82.1","1356":"83.34","1357":"82.31","1358":"93.03","1359":"90","1360":"87.67","1361":"83.16","1362":"81.77","1363":"76.46","1364":"88.29","1365":"92.85","1366":"90.96","1367":"93.5","1368":"91.41","1369":"88.88","1370":"91.68","1371":"84.52","1372":"79.57","1373":"76.3","1374":"85.47","1375":"79.57","1376":"80.01","1377":"72.61","1378":"78.69","1379":"69.11","1380":"73.96","1381":"53.4","1382":"72.78","1383":"67.52","1384":"79.51","1385":"78.44","1386":"66.38","1387":"69.57","1388":"71.11","1389":"73.01","1390":"72.68","1391":"75.59","1392":"84.39","1393":"85.84","1394":"79.67","1395":"84.44","1396":"76.67","1397":"67.46","1398":"53.76","1399":"58.62","1400":"79.04","1401":"89.36","1402":"57.92","1403":"69.58","1404":"64.65","1405":"60.51","1406":"57.08","1407":"73.35","1408":"75.29","1409":"81.62","1410":"90.98","1411":"73.41","1412":"62.47","1413":"66.23","1414":"57.71","1415":"63.76","1416":"78.32","1417":"79.53","1418":"79.21","1419":"54.85","1420":"77.7","1421":"70.08","1422":"72.47","1423":"47.21","1424":"40.38","1425":"71.44","1426":"74.41","1427":"77.15","1428":"67.71","1429":"61.79","1430":"58.39","1431":"69.31","1432":"70.5","1433":"52.64","1434":"68.87","1435":"79.04","1436":"66.34","1437":"67.72","1438":"60.88","1439":"73.41","1440":"58.54","1441":"55.88","1442":"67.17","1443":"63.31","1444":"71.51","1445":"60.61","1446":"54.52","1447":"38.98","1448":"53.54","1449":"56.14","1450":"38.41","1451":"72.05","1452":"63.03","1453":"62.69","1454":"60.31","1455":"41.46","1456":"41.82","1457":"29.09","1458":"31.62","1459":"34.15","1460":"55.93","1461":"61.57","1462":"53.19","1463":"45.06","1464":"49.22","1465":"37.63","1466":"28.52","1467":"60.48","1468":"40.21","1469":"39.4","1470":"5","1471":"4.98","1472":"4.26","1473":"4.75","1474":"4.7","1475":"5.79","1476":"14.37","1477":"6.12","1478":"4.97","1479":"6.2","1480":"1.35","1481":"0.5","1482":"0.55","1483":"0.26","1484":"0.03","1485":"0.05","1486":"0.03","1487":"0.03","1488":"0.01","1489":"0.01","1490":"0.01","1491":"0.03","1492":"0.06","1494":"0.01","1500":"0.02","1501":"0.04","1502":"0.02","1503":"0.01","1504":"0.09","1511":"0.01","1513":"0.01","1514":"0.02","1521":"0.01","1527":"0.02","1529":"0.01","1533":"0.01","1540":"0.01","1541":"0.01","1544":"0.01","1556":"0.01","1562":"0.01","1565":"0.01","1569":"0.01","1570":"0.01","1579":"0.02","1580":"0.01","1584":"0.01","1588":"0.01","1590":"0.01","1592":"0.01","1593":"0.01","1594":"0.02","1596":"0.01","1599":"0.01","1600":"0.76","1601":"0.33","1602":"0.36","1603":"0.01","1604":"2.61","1605":"1.57","1606":"0.02","1607":"0.25","1610":"0.03","1612":"0.04","1613":"0.01","1615":"0.01","1620":"0.03","1622":"0.01","1623":"0.01","1624":"0.01","1633":"0.01","1641":"0.01","1642":"0.01","1644":"0.02","1645":"0.01","1651":"0.01","1654":"0.01","1658":"0.01","1662":"0.01","1664":"0.01","1665":"0.01","1672":"0.01","1673":"0.01","1682":"0.01","1683":"0.01","1684":"0.02","1688":"0.01","1691":"0.02","1692":"0.01","1694":"0.02","1698":"0.01","1700":"0.6","1710":"0.01","1712":"0.01","1713":"0.02","1714":"0.01","1717":"0.01","1722":"0.02","1723":"0.01","1726":"0.01","1728":"0.01","1729":"0.01","1730":"0.01","1733":"0.01","1738":"0.01","1740":"0.01","1743":"0.01","1749":"0.01","1756":"0.01","1757":"0.01","1759":"0.01","1761":"0.01","1763":"0.01","1778":"0.02","1779":"0.01","1783":"0.01","1785":"0.01","1788":"0.01","1789":"0.03","1794":"0.01","1795":"0.02","1797":"0.01","1800":"0.01","1805":"0.01","1812":"0.03","1813":"0.01","1816":"0.02","1820":"0.01","1822":"0.01","1828":"0.01","1840":"0.05","1842":"0.02","1847":"0.01","1848":"0.01","1852":"0.01","1853":"0.01","1858":"0.01","1860":"0.01","1866":"0.02","1868":"0.03","1869":"0.01","1870":"0.01","1871":"0.03","1876":"0.01","1879":"0.01","1883":"0.01","1890":"0.02","1893":"0.02","1894":"0.01","1895":"0.05","1896":"0.02","1898":"0.04","1899":"0.01","1900":"0.06","1901":"0.04","1902":"0.02","1903":"0.02","1905":"0.01","1906":"0.01","1907":"0.02","1908":"0.02","1909":"0.01","1910":"0.02","1911":"0.05","1912":"0.07","1913":"0.02","1914":"0.03","1916":"0.01","1917":"0.02","1918":"0.01","1919":"0.05","1921":"0.05","1922":"0.02","1923":"0.02","1924":"0.03","1925":"0.01","1926":"0.02","1927":"0.07","1928":"0.02","1929":"0.06","1930":"0.02","1931":"0.04","1932":"0.02","1933":"0.01","1934":"0.04","1936":"0.02","1937":"0.09","1938":"0.01","1939":"0.06","1940":"0.04","1941":"0.03","1942":"0.02","1944":"0.01","1945":"0.13","1946":"0.01","1947":"0.02","1948":"0.02","1949":"0.25","1950":"0.03","1951":"0.01","1952":"0.03","1953":"0.01","1954":"0.01","1955":"0.01","1956":"0.02","1957":"0.03","1958":"0.08","1959":"0.01","1960":"0.02","1961":"0.01","1962":"0.01","1963":"0.01","1964":"0.01","1965":"0.03","1966":"0.04","1967":"0.02","1968":"0.01","1969":"0.01","1970":"0.01","1971":"0.01","1973":"0.03","1974":"0.03","1975":"0.01","1976":"0.06","1977":"0.05","1978":"0.08","1979":"0.02","1980":"0.05","1981":"0.04","1982":"0.04","1983":"0.01","1984":"0.02","1985":"0.07","1986":"0.04","1987":"0.04","1988":"0.04","1989":"0.02","1990":"0.03","1991":"0.01","1992":"0.04","1993":"0.06","1994":"0.05","1995":"0.05","1996":"0.03","1997":"0.05","1998":"0.08","1999":"0.14","2000":"3.82","2001":"5.5","2002":"3.26","2003":"3.35","2004":"3.18","2005":"5.87","2006":"3.72","2007":"11.02","2008":"8","2009":"5.41","2010":"2.5","2011":"0.13","2012":"10.46","2013":"4.6","2014":"7.92","2015":"13.44","2016":"1.74","2017":"0.17","2018":"0.2","2019":"0.04","2020":"0.03","2021":"0.01","2023":"1.8","2024":"9.18","2030":"0.01","2033":"0.02","2037":"0.01","2042":"0.02","2047":"1.94","2048":"0.08","2051":"0.01","2060":"0.01","2065":"0.01","2068":"2.54","2069":"4.36","2070":"4.21","2071":"4.15","2072":"3.06","2073":"3.36","2074":"3.62","2075":"2.35","2076":"4.47","2077":"3.46","2078":"0.47","2081":"0.29","2083":"0.01","2084":"0.01","2086":"0.01","2090":"0.01","2100":"0.05","2101":"0.97","2102":"0.02","2103":"0.03","2105":"0.02","2109":"0.02","2110":"0.02","2111":"0.02","2112":"0.04","2113":"0.02","2114":"0.07","2115":"0.03","2116":"0.05","2118":"0.02","2119":"0.05","2120":"0.03","2121":"0.05","2122":"0.03","2123":"0.08","2124":"0.03","2125":"0.05","2126":"0.19","2127":"0.06","2128":"0.05","2129":"0.06","2130":"0.03","2131":"0.06","2132":"0.08","2133":"0.09","2134":"0.07","2135":"0.12","2136":"0.09","2137":"0.04","2138":"0.13","2139":"0.03","2140":"0.03","2142":"0.03","2143":"0.02","2146":"0.01","2155":"0.57","2156":"0.08","2161":"0.01","2165":"0.01","2167":"0.04","2168":"0.01","2200":"0.01","2212":"0.01","2222":"0.01","2225":"0.01","2226":"0.01","2255":"0.02","2270":"0.01","2271":"0.01","2300":"0.01","2304":"0.01","2312":"0.02","2330":"0.01","2332":"0.01","2344":"0.01","2348":"0.01","2372":"0.01","2402":"0.01","2412":"0.02","2413":"0.01","2500":"0.03","2512":"0.01","2548":"0.01","2555":"0.01","2561":"0.01","2600":"0.01","2611":"0.01","2612":"0.02","2623":"0.01","2640":"0.34","2641":"0.17","2642":"0.02","2683":"0.01","2693":"0.01","2725":"0.01","2729":"0.44","2762":"0.16","2765":"0.83","2800":"0.01","2843":"0.01","2846":"0.64","2847":"1.39","2848":"0.34","2849":"0.72","2850":"0.22","2851":"0.01","2852":"0.01","2853":"0.01","2855":"0.01","2863":"0.01","2869":"0.08","2875":"0.27","2876":"0.06","2879":"0.03","2885":"0.02","2890":"0.01","2891":"0.29","2892":"0.24","2893":"0.17","2910":"0.01","2912":"0.02","2913":"0.01","2960":"0.01","2961":"0.01","3000":"0.36","3001":"0.01","3011":"0.01","3012":"0.02","3031":"0.01","3040":"0.01","3053":"0.01","3064":"0.01","3100":"0.06","3101":"0.01","3102":"0.01","3104":"0.01","3109":"0.01","3111":"0.02","3112":"0.01","3113":"0.01","3114":"0.06","3115":"0.01","3116":"0.06","3117":"0.01","3118":"0.02","3119":"0.01","3120":"0.01","3121":"0.05","3122":"0.01","3123":"0.01","3124":"0.05","3125":"0.03","3126":"0.09","3127":"0.05","3128":"0.03","3129":"0.04","3130":"0.02","3131":"0.06","3132":"0.03","3133":"0.06","3134":"0.04","3135":"0.06","3136":"0.05","3137":"0.03","3138":"0.08","3139":"0.01","3144":"0.02","3145":"0.01","3160":"0.01","3187":"0.01","3200":"0.43","3201":"0.47","3202":"0.15","3203":"0.18","3204":"0.06","3210":"0.01","3300":"0.36","3301":"0.37","3302":"0.55","3303":"0.31","3304":"0.8","3305":"0.37","3306":"0.89","3307":"0.56","3308":"1.17","3309":"0.91","3310":"0.26","3311":"0.55","3312":"0.22","3313":"0.86","3314":"0.2","3315":"0.29","3316":"0.71","3317":"0.64","3318":"0.91","3319":"0.87","3320":"0.6","3331":"0.01","3435":"0.01","3651":"0.03","3691":"0.01","3792":"0.01","3801":"0.01","3804":"0.02","3813":"0.01","3839":"0.01","3864":"0.01","3872":"0.01","3903":"0.01","3981":"0.01","3995":"0.01","4000":"10.2","4001":"13.14","4002":"8.12","4003":"34.11","4004":"36.7","4005":"17.67","4006":"13.62","4007":"24.39","4008":"8.95","4009":"17.27","4010":"31.8","4011":"20.85","4012":"6.37","4013":"11.94","4014":"2.74","4015":"0.73","4016":"28.34","4017":"17.31","4018":"27.41","4019":"30.6","4020":"19.22","4021":"50.35","4022":"18.92","4023":"20.27","4024":"22.97","4025":"31.72","4026":"16.91","4027":"18.71","4028":"23.09","4029":"23.81","4030":"31.29","4031":"21.63","4032":"26.24","4033":"7.55","4034":"30.95","4035":"49.71","4036":"61.66","4037":"67.6","4038":"62.33","4039":"51.71","4040":"40.88","4041":"48.32","4042":"28.93","4043":"31.41","4044":"65.45","4045":"53.63","4046":"75.73","4047":"79.22","4048":"13.58","4049":"11.2","4050":"18.36","4051":"7.87","4052":"5.03","4053":"10.99","4054":"18.51","4055":"8.9","4056":"12.11","4057":"4.61","4058":"4.84","4059":"3.19","4060":"17.41","4061":"16.06","4062":"9.1","4063":"15.63","4064":"16.48","4065":"3.99","4066":"14.9","4067":"8.74","4068":"18.55","4069":"50.98","4070":"22.31","4071":"46.8","4072":"36.8","4073":"53.15","4074":"22.96","4075":"57.71","4076":"13.31","4077":"9.28","4078":"24.13","4079":"14.02","4080":"20.98","4081":"3.78","4082":"13.78","4083":"12.67","4084":"13.65","4085":"15.82","4086":"40.5","4087":"41.84","4088":"71.96","4089":"42.68","4090":"6.78","4091":"3.38","4092":"19.95","4093":"19.69","4094":"7.75","4095":"17.87","4096":"0.37","4097":"0.02","4098":"7.07","4099":"0.01","4101":"0.09","4102":"0.01","4103":"0.01","4106":"0.01","4109":"0.01","4112":"0.02","4113":"0.02","4114":"0.01","4115":"0.01","4116":"0.01","4118":"0.01","4120":"0.01","4121":"0.03","4122":"0.02","4124":"0.01","4125":"0.02","4126":"0.13","4127":"0.03","4128":"0.02","4130":"0.02","4131":"0.02","4132":"0.01","4133":"0.07","4134":"0.02","4135":"0.06","4136":"0.03","4138":"0.04","4139":"0.03","4141":"0.01","4145":"0.01","4401":"0.01","4469":"0.01","4510":"0.11","4524":"0.01","4562":"0.01","4566":"0.01","4581":"0.01","4612":"0.01","4653":"0.15","4655":"0.01","4715":"0.01","4717":"0.01","4745":"0.01","4772":"0.02","4773":"0.03","4780":"0.01","4781":"0.1","4794":"0.18","4820":"0.18","4821":"0.01","4834":"0.04","4835":"0.02","4849":"0.07","4850":"0.14","4999":"0.01","5000":"2.32","5001":"0.02","5002":"4.96","5003":"2.42","5004":"1.49","5005":"0.49","5009":"0.22","5011":"0.01","5014":"0.22","5019":"0.01","5021":"0.01","5023":"0.2","5024":"0.86","5030":"0.01","5036":"0.07","5037":"11.16","5038":"3.98","5071":"0.01","5100":"0.07","5108":"0.01","5112":"0.01","5114":"0.05","5115":"0.01","5116":"0.02","5118":"0.02","5120":"0.05","5121":"0.02","5122":"0.01","5123":"0.02","5124":"0.02","5125":"0.02","5126":"0.08","5127":"0.02","5129":"0.01","5131":"0.01","5132":"0.01","5133":"0.05","5135":"0.02","5136":"0.02","5140":"0.02","5159":"0.01","5164":"0.01","5168":"0.01","5201":"0.01","5218":"0.01","5220":"0.01","5268":"0.01","5297":"0.01","5300":"0.03","5371":"0.01","5411":"0.01","5424":"0.01","5465":"0.01","5481":"0.01","5554":"0.01","5555":"0.01","5594":"0.01","5611":"0.01","5668":"0.01","5700":"0.01","5873":"0.01","5923":"0.01","5939":"0.01","5945":"0.01","5966":"0.01","5991":"0.01","5998":"0.01","6000":"0.33","6001":"0.05","6025":"0.01","6088":"0.01","6100":"0.29","6101":"0.1","6103":"0.01","6110":"0.01","6112":"0.03","6113":"0.02","6114":"0.02","6115":"0.01","6116":"0.01","6121":"0.02","6122":"0.01","6125":"0.02","6126":"0.08","6127":"0.02","6129":"0.01","6130":"0.01","6131":"0.01","6132":"0.01","6133":"0.02","6134":"0.01","6135":"0.04","6200":"0.16","6276":"0.01","6295":"0.01","6300":"0.19","6301":"0.22","6410":"0.01","6418":"0.01","6420":"0.01","6426":"0.01","6510":"0.01","6666":"0.01","6801":"0.02","6836":"0.01","6870":"0.01","6871":"0.01","6912":"0.01","6934":"0.01","7000":"0.01","7002":"0.01","7020":"0.01","7104":"0.01","7113":"0.01","7114":"0.03","7115":"0.01","7118":"0.01","7122":"0.01","7124":"0.02","7126":"0.07","7127":"0.01","7129":"0.01","7132":"0.01","7133":"0.05","7134":"0.01","7136":"0.01","7143":"0.01","7152":"0.02","7200":"0.01","7300":"0.16","7303":"0.01","7488":"0.01","7500":"0.01","7512":"0.01","7524":"0.01","7547":"0.01","7690":"0.01","7700":"0.43","7711":"0.01","7777":"0.02","7801":"0.01","7805":"0.01","7873":"0.01","7889":"0.01","7972":"0.01","8000":"0.01","8012":"0.01","8013":"0.01","8029":"0.01","8038":"0.02","8040":"77.34","8041":"20.93","8053":"0.01","8061":"0.01","8080":"0.01","8086":"0.01","8088":"0.01","8113":"0.01","8114":"0.01","8116":"0.01","8121":"0.01","8123":"12.65","8124":"0.01","8125":"0.01","8126":"0.08","8132":"0.01","8133":"0.02","8134":"0.02","8135":"0.02","8136":"0.01","8137":"0.01","8139":"0.01","8140":"0.01","8210":"0.01","8301":"0.01","8311":"0.01","8351":"0.01","8400":"0.01","8549":"0.01","8645":"0.01","8811":"0.02","8812":"0.75","8813":"1.35","8839":"0.01","8888":"0.08","8896":"0.06","9000":"0.02","9001":"0.03","9004":"0.01","9006":"1.65","9007":"0.74","9008":"0.96","9009":"0.16","9010":"0.01","9011":"1.34","9012":"1.65","9014":"0.68","9015":"0.11","9029":"0.01","9041":"0.01","9102":"0.11","9113":"0.01","9121":"0.01","9124":"0.01","9125":"0.02","9126":"0.03","9130":"0.01","9131":"0.02","9132":"0.02","9133":"0.02","9134":"0.01","9135":"0.01","9137":"0.01","9139":"0.01","9152":"0.01","9210":"0.02","9212":"0.01","9313":"0.01","9331":"0.01","9570":"0.05","9572":"0.08","9574":"0.02","9575":"0.01","9576":"0.02","9577":"0.03","9578":"0.05","9579":"0.02","9600":"26.79","9601":"33.79","9602":"26.23","9603":"43.98","9604":"36.66","9605":"22.85","9606":"16.56","9607":"34.08","9608":"49.26","9609":"32.73","9610":"39.96","9611":"20.51","9612":"50.22","9613":"47.02","9614":"7.45","9615":"27.36","9616":"9.24","9617":"34.62","9618":"51.17","9619":"14.95","9620":"14.98","9621":"7.23","9622":"6.83","9623":"20.63","9624":"11.55","9625":"0.04","9626":"0.17","9629":"0.01","9740":"0.01","9780":"0.01","9781":"0.03","9787":"0.02","9789":"0.64","9800":"0.02","9861":"0.01","9866":"0.01","9867":"0.12","9868":"0.02","9869":"0.01","9900":"0.03","9999":"0.02"};
    if (pageurl.includes("://search.douban.com/book/subject_search") || pageurl.includes("://book.douban.com/subject_search")) {
        jQuery("div.item-root > div.detail > div.title").each(function (i, el) {
            bookname = slim(jQuery(el).text());
            jQuery(el).find("a").after(ucdrslink4db(bookname));
        });
    } else if (pageurl.includes("://book.douban.com/works")) {
        jQuery("div.bkdesc > a.pl2").each(function (i, el) {
            bookname = slim(jQuery(el).text());
            jQuery(el).after(ucdrslink4db(bookname));
        });
    } else if (pageurl.includes("://book.douban.com/producers") || pageurl.includes("://book.douban.com/press")) {
        jQuery("div.info > h2 > a").each(function (i, el) {
            bookname = slim(jQuery(el).text());
            jQuery(el).after(ucdrslink4db(bookname));
        });
    } else if (pageurl.includes("://book.douban.com/cart")) {
        jQuery("td.book_title > a").each(function (i, el) {
            bookname = slim(jQuery(el).text());
            jQuery(el).after(ucdrslink4db(bookname, {sep: "|", text: "参"}));
        });
    } else if (pageurl.includes("://www.douban.com/doulist")) {
        jQuery("div.title > a").each(function (i, el) {
            bookname = slim(jQuery(el).text());
            var src = slim(jQuery(el).parent().prev().prev().text());
            if (src === "来自：豆瓣读书") {
                jQuery(el).after(ucdrslink4db(bookname));
            }
        });
    } else if (pageurl.match("book.douban.com.*/(series|tag|do|wish|collect)")) {
        jQuery("div.info > h2 > a").each(function (i, el) {
            bookname = slim(jQuery(el).text());
            jQuery(el).after(ucdrslink4db(bookname));
        });
    } else if (pageurl.includes("://book.douban.com/author")) {
        jQuery("h6 > a").each(function (i, el) {
            bookname = slim(jQuery(el).text());
            jQuery(el).after(ucdrslink4db(bookname));
        });
    } else if (pageurl.includes("://book.douban.com/subject")) {
        bookid = pageurl.match(/book.douban.com\/subject\/(\d+)/)[1];
        var json = jQuery('script[type="application/ld+json"]').text();
        bookname = json.match(/"name" : "(.*?)",/)[1];
        m_isbn = json.match(/"isbn" : "(.*?)",/);
        isbn = m_isbn ? m_isbn[1] : "";
        jQuery("div#mainpic > a.nbg").after("<br>" + ucdrslink(bookname, isbn) + copymeta(bookid));
    } else if (pageurl.includes("://book.douban.com/isbn")) {
        var error = jQuery("div#exception").text().trim();
        if (error === "豆瓣评论暂时没有收录此书，请原谅。" || error === "您提供的ISBN号码不正确，请校正后再试。谢谢。") {
            var m_bookname = pageurl.match(/\?bookname=(.+)/);
            if (m_bookname) {
                bookname = m_bookname[1];
                document.location = "https://search.douban.com/book/subject_search?search_text=" + bookname;
            }
        }
    } else if (pageurl.includes(".kongfz.com/")) {
        setTimeout(function() {
            jQuery("div.book > a > p.money, div.book_list_box > ul.clearfix > li > div.price, ul.clearfix > li > div.price_box").each(function (i, el) {
                var bnele = {"money": "p.name", "price": "div.book_name", "price_box": "div.text_height > div.book_name"}[jQuery(el).attr("class")];
                bookname = shortenbkn(jQuery(el).parent().find(bnele).text());
                jQuery(el).append(ucdrslink(bookname, "", {sep: "|", text: "参", cls: "link"}) + dblink(bookname, "", {"text": "豆", cls: "link"}));
            });
            jQuery("div.item-info > div.title > a.link").each(function (i, el) {
                bookname = shortenbkn(jQuery(el).text());
                jQuery(el).after(ucdrslink(bookname, "", {sep: "|", cls: "link"}) + dblink(bookname, "", {"cls": "link"}));
            });
        }, 1000);
        if (pageurl.match(/book.kongfz.com\/\d+\/\d+\//)) {
            bookname = shortenbkn(jQuery("h1.title").text());
            m_isbn = html.match(/ISBN:\s*<span>&nbsp;(.*?)<\/span>/);
            if (!m_isbn) m_isbn = html.match(/<span class="keywords-define-txt" itemprop="isbn">\s*(.*?)\s*<\/span>/);
            isbn = m_isbn ? m_isbn[1] : "";
            jQuery("h1.title").after(ucdrslink(bookname, isbn, {sep: "|", cls: "link"}) + dblink(bookname, isbn));
        } else if (pageurl.match(/item.kongfz.com\/book\/\d+\.html/)) {
            bookname = shortenbkn(jQuery("h1.detail-title").text());
            m_isbn = html.match(/var isbn = "(.*?)",/);
            isbn = m_isbn ? m_isbn[1] : "";
            jQuery("h1.detail-title").after(ucdrslink(bookname, isbn, {"style": "color: #365899;"}) + dblink(bookname, isbn, {"style": "color: #365899;"}));
        }
    } else if (pageurl.match(/e.jd.com\/\d+\.html/)) {
        bookname = jQuery("div.itemInfo-wrap > div.sku-name").text().trim();
        m_isbn = html.match(/<div class="dt">I S B N<\/div>\s*<div class="dd">(.*?)<\/div>/);
        isbn = m_isbn ? m_isbn[1] : "";
        jQuery("div.itemInfo-wrap > div.sku-name").after(ucdrslink(bookname, isbn) + dblink(bookname, isbn));
    } else if (pageurl.match(/item.jd.com\/\d+\.html/) && jQuery("div.crumb > div.first > a").text() === "图书") {
        bookname = jQuery("div.itemInfo-wrap > div.sku-name").text().trim();
        m_isbn = html.match(/ISBN：([\d\-]*)/);
        isbn = m_isbn ? m_isbn[1] : "";
        jQuery("div.itemInfo-wrap > div.sku-name").after(ucdrslink(bookname, isbn) + dblink(bookname, isbn));
    } else if (pageurl.match(/e.dangdang.com\/products\/\d+\.html/)) {
        setTimeout(function() {
            bookname = shortenbkn(jQuery("h1.bookname_box > span.title_words").text());
            m_isbn = html.match(/ISBN：([\d-]*)/);
            isbn = m_isbn ? m_isbn[1] : "";
            jQuery("h1.bookname_box").after(ucdrslink(bookname, isbn) + dblink(bookname, isbn));
        }, 2000);
    } else if (pageurl.match(/product.dangdang.com\/\d+\.html/) && jQuery("div#breadcrumb > a.domain:eq(0)").text()=== "图书") {
        bookname = shortenbkn(jQuery("div.name_info > h1").text());
        m_isbn = html.match(/<li>国际标准书号ISBN：(.*?)<\/li>/);
        isbn = m_isbn ? m_isbn[1] : "";
        jQuery("div.name_info > h1").after(ucdrslink(bookname, isbn) + dblink(bookname, isbn));
    } else if (pageurl.includes("www.bookschina.com")) {
        jQuery("div.siteHotPannel > ul > li > h3.bookName").each(function (i, el) {
            bookname = slim(jQuery(el).text());
            bookname = GB2312UTF8.GB2312ToUTF8(bookname);
            jQuery(el).parent().find("div.priceWrap > del.price").after(ucdrslink(bookname, "", {text: "参", sep: "&nbsp;| "}) + dblink(bookname, "", {"text": "豆"}));
        });
        if (pageurl.includes("www.bookschina.com/tejia/NewTeHui.aspx")) {
            funcinterval(function() {
                jQuery("div.bookLIst > ul > li > div.text > div.priceWrap > span.dPrcie").each(function (i, el) {
                    if (jQuery(el).text().match(/：\d+(\.\d+)?元$/)) {
                        bookname = slim(jQuery(el).parent().parent().find("div.bookName").text());
                        bookname = GB2312UTF8.GB2312ToUTF8(bookname);
                        jQuery(el).append(ucdrslink(bookname, "", {text: "参", sep: "&nbsp;| "}) + dblink(bookname, "", {"text": "豆"}));
                    }
                });
            });
        } else if (pageurl.includes("www.bookschina.com/books/9kuai9/")) {
            funcinterval(function() {
                jQuery("div.freeShipFloor > ul#ulList > li.default > div.bookInfor > div.authorPublisher > b.author").each(function (i, el) {
                    var p = jQuery(el).parent().parent().find("div.priceWrap > div.sellPrice");
                    if (jQuery(el).text() !== "暂无" && !p.text().match(/参 \| 豆$/)) {
                        bookname = slim(jQuery(el).parent().parent().find("h3.bookName").text());
                        bookname = GB2312UTF8.GB2312ToUTF8(bookname);
                        p.append(ucdrslink(bookname, "", {text: "参", sep: "&nbsp;| "}) + dblink(bookname, "", {"text": "豆"}));
                    }
                });
            });
        }
        if (pageurl.match(/www.bookschina.com\/\d+\.htm/)) {
            bookname = shortenbkn(jQuery("h1").text());
            m_isbn = html.match(/<li>ISBN：(.*?)<\/li>/);
            isbn = m_isbn ? m_isbn[1] : "";
            jQuery("h1").after(ucdrslink(bookname, isbn) + dblink(bookname, isbn));
        } else {
            jQuery("a.collectBtn").each(function (i, el) {
                jQuery(el).css("margin-right", "3px");
                bookname = slim(jQuery(el).parent().parent().find("h2.name").text());
                bookname = GB2312UTF8.GB2312ToUTF8(bookname);
                jQuery(el).after(ucdrslink(bookname, "", {text: "参", cls: "collectBtn", style: "margin-right: 3px; width: 30px;"}) + dblink(bookname, "", {"sep": "", "text": "豆", "cls": "collectBtn", "style": "margin-right: 3px; width: 30px;"}));
            });
        }
        return;
    } else if (pageurl.includes("citic.cmread.com")) {
        setTimeout(function() {
            bookname = jQuery("div.book-name").text().trim();
            jQuery("div.book-name").after(ucdrslink(bookname, "", {"style": "font-size: 12px; display: inline-block; margin-left: 10px; cursor: pointer;"}) + dblink(bookname, "", {"sep": " ", "style": "font-size: 12px; display: inline-block; cursor: pointer;"}));
        }, 1000);
    } else if (pageurl.match(/www.dedao.cn\/ebook\/detail\?/)) {
        setTimeout(dedao, 1000);
        let currentUrl = location.href;
        setInterval(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                setTimeout(dedao, 1000);
            }
        }, 3000);
        return;
    } else if (pageurl.match(/read.douban.com\/ebook\/\d+\//)) {
        setTimeout(function(){
            bookname = jQuery("h1.article-title").text().trim();
            m_isbn = html.match(/itemprop="isbn">(.*?)<\/a>/);
            isbn = m_isbn ? m_isbn[1] : "";
            jQuery("h1.article-title").after(ucdrslink(bookname, isbn) + dblink(bookname, isbn));
        }, 1000);
    } else if (pageurl.includes("superlib.net/search") || pageurl.includes("zslib.com.cn/search")) {
        function power_ucdrs_item(el){
            if (jQuery(el).parent("tr").find("p > a > span.bid").length >= 1 || jQuery(el).parent("tr").find("p > span.bid").length >= 1) return;
            ssid = jQuery(el).parent("tr").find('input[name*="ssid"]').val();
            dxid = jQuery(el).find("a[href]").attr("href").match(/dxNumber=(\d+)/);
            dxid = dxid ? dxid[1] : "";
            if (ssid) {
                jQuery(el).after(showbid(ssid, "SSID").replace("</p>", copybid(ssid, "SSID")) + (dxid ? showbid(dxid, "DXID").replace("</p>", copybid(dxid, "DXID")) : ""));
            } else if (dxid) {
                jQuery(el).after(showbid(dxid, "DXID").replace("</p>", copybid(dxid, "DXID")));
            }
            bookid = ssid ? ssid : dxid;
            bookname = jQuery(el).parent("tr").find('input[name*="title"]').val().replaceAll(/<.*?>/g, "");
            let meta = jQuery(el).parent("tr").find('span.fc-green').text();
            author = meta.match(/作者:\s*(.*?) /);
            author = author ? author[1].replace(/[\(\[（【].*?[\)\]）】]/g, "").trim().replace(/[ \/；;,，:：].*/g, "").replace(/等?(主?编|编?著)?$/, "") : "";
            press = meta.match(/出版社:\s*(.*?) /);
            press = press ? press[1].replace(/.*：/, "") : "";
            if (bookname) jQuery(el).parent().children().last().find("a").after(dzylink(bookname + " " + author + " " + press) + dblink(bookname) + copymeta(bookid));
            jQuery(el.querySelector(".copybid")).unbind("click").bind("click", copybid_clicked);
            jQuery(el.querySelector(".copybid")).unbind("contextmenu").bind("contextmenu", copybid_clicked);
            jQuery(el.querySelector(".copymeta")).unbind("click").bind("click", copymeta_clicked);
        }
        jQuery('td[id="b_img"]').each(function (i, el) {power_ucdrs_item(el)});
        new MutationObserver(function(mutationList, observer) {
            mutationList.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((addedNode) => {power_ucdrs_item(addedNode.querySelector("#b_img"))});
                }
            });
        }).observe(document.querySelector("#noscroll > table > tbody > tr > td:nth-child(2) > form"), observerOptions);
    } else if (pageurl.includes("://www.digital.archives.go.jp")) {
        jQuery("div.list_ti_box > h4.list_ti > a.list_ti_txt").each(function (i, el) {
            bookid = jQuery(el).attr("onclick").match(/(submitHierarchy|submitDetail)\('(\w+)'/)[2];
            bookname = jQuery(el).text();
            jQuery(el).after(dblink(bookname));
            jQuery(el).after(" | " + showbid(bookid, "DAID", 0));
        });
        var bknameele;
        if (pageurl.includes("/listPhoto")) {
            var m_bookid = pageurl.match(/\bID=(\w+)/);
            if (m_bookid === null) {
                m_bookid = pageurl.match(/\bBID=(\w+)/);
            }
            bookid = m_bookid[1];
            bknameele = jQuery(jQuery("div.view_ti > h1 > a")[0]);
            bookname = bknameele.text();
        } else {
            bknameele = jQuery(jQuery("dl.detail_tb > dd")[0]);
            bookname = bknameele.text();
            var ptitle;
            ptitle = jQuery(jQuery("div.page_ti > h2")[0]).text().trim();
            if (ptitle.indexOf("情報") > 0) {
                bookid = pageurl.match(/IS_KEY_S51=(\w+)/)[1];
            } else if (ptitle.indexOf("詳細") > 0) {
                if (pageurl.includes("/file/")) {
                    bookid = html.match(/var mid = '(\w+)';/)[1];
                } else {
                    bookid = pageurl.match(/IS_KEY_S16=(\w+)/)[1];
                }
            }
        }
        bknameele.after(dblink(bookname));
        bknameele.after(showbid(bookid, "DAID", 0));
    } else if (pageurl.includes("://www.ncpssd.org/Literature/ancientbooklist.aspx")) {
        jQuery("div.jour-pic > ul.clr > li > a").each(function (i, el) {
            bookid = atob(jQuery(el).attr("href").match(/barcodenum=(.*)/)[1]);
            bookname = jQuery(el).next().attr("title").replace(/(第?[一二三四五六七八九十百千]+|不分)卷.*/, "");
            jQuery(el).next().after(dblink(bookname));
            jQuery(el).next().after(showbid("BC" + bookid, "BCID", 0));
        });
    } else if (pageurl.includes("://www.ncpssd.org/Literature/articleinfo.aspx")) {
        bookid = jQuery("p#p_institutions").text().replace("条码号：", "");
        bookname = jQuery("h2#h2_title_c").text().replace(/(第?[一二三四五六七八九十百千]+|不分)卷.*/, "");
        jQuery("img#img").after(dblink(bookname) + copybid("BC" + bookid, "BCID").replace("</p>", ""));
        jQuery("img#img").after(showbid("BC" + bookid, "BCID", 0));
        jQuery("h2#h2_title_c > i").after(copymeta("BC" + bookid));
    } else if (pageurl.includes("://cadal.edu.cn/cadalinfo/search")) {
        funcinterval(function() {
            jQuery("a.title").each(function (i, el) {
                if (jQuery(el).parent().parent().prev().find("span.bid").length >= 1) return;
                bookid = jQuery(el).attr("onclick").match(/'\w+'/)[0].replace(/'/g, "").replace("hj", "");
                jQuery(el).parent().parent().prev().find("a").after(showbid("CD" + bookid, "SSNO<br>").replace("</p>", copybid("CD" + bookid, "SSNO").replace("</a>", "</a><br>")));
                bookname = jQuery(el).text().trim();
                jQuery(el).after(dblink(bookname) + copymeta("CD" + bookid));
            });
        });
    } else if (pageurl.includes("/search?") && (typeof jQuery !== "undefined") && jQuery("#dxid0").val()) {
        funcinterval(function() {
            jQuery('div[class="divImg"]').each(function (i, el) {
                if (jQuery(el).find("span.bid").length >= 1) return;
                ssid = jQuery(el).prev().prev().val();
                dxid = jQuery(el).prev().prev().prev().val();
                bookid = ssid ? ssid : dxid;
                bidtype = bookid.length === 8 ? "SSID" : "DXID";
                bookname = jQuery(el).parent().find('input[name*="title"]').val().replaceAll(/<.*?>/g, "");
                m_isbn = jQuery(el).next().text().match(/ISBN : ([\d-]+)\n/);
                isbn = m_isbn ? m_isbn[1] : "";
                var ele_title = jQuery(el).next().find("dt").find("a");
                ele_title.after(dxtoc(ele_title.attr("href")) + dblink(bookname, isbn) + copymeta(bookid));
                jQuery(el).children().first().after(showbid(bookid, bidtype.replace("ID", "号")).replace("</p>", copybid(bookid, bidtype)));
            });
        });
    } else if (pageurl.includes("://fx.ccelib.com/s?")) {
        funcinterval(function() {
            jQuery('div[class="savelist clearfix"]').each(function (i, el) {
                if (jQuery(el).find("span.bid").length >= 1) return;
                var ele_ul = jQuery(el).find("div.savelist_con > div.savelist_box > ul");
                if (ele_ul.find("li.biaoti > a:first").text() === "[图书]") {
                    bookname = ele_ul.find("li.biaoti > a:eq(1)").text().trim();
                    var ele_input = jQuery(el).find("div.save_img > input");
                    bookid = iid2bookid(ele_input.attr("img").match(/iid=(\w+)/)[1]);
                    if (bookid === "00000000") bookid = ele_ul.prev().find("div.favorite > span").attr("dxid");
                    bidtype = bookid.length == 8 ? "SSID": "DXID";
                    jQuery(el).find("div.save_img > a").after(showbid(bookid, bidtype).replace("</p>", copybid(bookid, bidtype)));
                    var m_isbn = ele_ul.text().match(/ISBN：([\d-]+)\n/);
                    isbn = m_isbn ? m_isbn[1] : "";
                    ele_ul.find("li.biaoti > a:last").after(dblink(bookname, isbn, {"sep": "", "style": "float: none;"}) + copymeta(bookid).replace(';" title', '; float: none;" title'));
                }
            });
        });
    } else if (pageurl.includes("/views/specific/")) {
        m_ssn = jQuery("script:contains(send_requestajax)").text().match(/ssn=(\d{3,})/);
        m_dxid = pageurl.match(/dxNumber=(\d+)/);
        ssid = m_ssn ? m_ssn[1] : "";
        dxid = m_dxid[1];
        bookid = ssid ? ssid : dxid;
        bidtype = bookid.length === 8 ? "SSID" : "DXID";
        img = jQuery("div.tubookimg>img");
        img.after(showbid(bookid, bidtype).replace("</p>", copybid(bookid, bidtype)) + (bidtype === "SSID" ? showbid(dxid, "DXID").replace("</p>", copybid(dxid, "DXID")) : ""));
        bookname = jQuery("div.tutilte").text();
        m_isbn = jQuery("div.tubox").find("dl").text().match(/【ISBN号】(.*?)\n/);
        isbn = m_isbn ? m_isbn[1] : "";
        img.after(`<p style="text-align: center">${dblink(bookname, isbn, {"sep": ""}) + copymeta(bookid)}</p>`);
        jQuery("body").children().last().append('<script type="text/javascript">function hasLogin(url){window.open(url);return;}</script>');
    } else if (pageurl.includes("bookDetail.jsp?") && (typeof jQuery !== "undefined") && jQuery("input#dxid").val()) {
        m_iid = jQuery("div#bookphoto").html().match(/CoverNew.dll\?iid=(\w{40,56}\b)/);
        m_ssn = jQuery("script:contains(send_requestlib)").text().match(/ssn=(\d{3,})/);
        m_dxid = pageurl.match(/dxNumber=(\d+)/);
        bookid = m_iid ? iid2bookid(m_iid[1]) : (m_ssn? m_ssn[1] : m_dxid[1]);
        bidtype = bookid.length == 8 ? "SSID": "DXID";
        img = jQuery("#grade1").prev();
        img.after(showbid(bookid, bidtype).replace("</p>", copybid(bookid, bidtype)));
        bookname = jQuery("input#dxid").prev().text();
        m_isbn = jQuery("div.card_text").find("dl").text().match(/ISBN号 ：(.*?)\n/);
        isbn = m_isbn ? m_isbn[1] : "";
        img.after(`<p style="text-align: center">${dxtoc(pageurl)} | ${dblink(bookname, isbn, {"sep": ""})}${copymeta(bookid)}</p>`);
    } else if (pageurl.includes("://cadal.edu.cn/cardpage/bookCardPage?")) {
        bookid = pageurl.match(/ssno=(\w+)/)[1];
        jQuery("div.title_img").each(function (i, el) {
            bookname = jQuery("span.title").text().trim();
            m_isbn = jQuery(el).next().text().match(/ISBN：(.*?)\n/);
            isbn = m_isbn ? m_isbn[1] : "";
            jQuery("span.title").after(dblink(bookname, isbn) + copymeta("CD" + bookid));
            jQuery(el).find("a").after(showbid("CD" + bookid, "SSNO<br>").replace("</p>", copybid("CD" + bookid, "SSNO").replace("</a>", "</a><br>")));
        });
        jQuery("#menu_area").show();
    } else if (pageurl.includes("://fx.ccelib.com/detail_")) {
        jQuery('div[class="savelist clearfix"]').each(function (i, el) {
            img = jQuery(el).find("div.save_img > img:first");
            if (img.next().text() === "【图书】") {
                bookname = jQuery("h4.falv_tit").text().trim();
                var ele_ul = jQuery(el).find("div.savelist_con > ul.infolist");
                var ele_headline = ele_ul.find("li.biaoti").children().last();
                bookid = iid2bookid(img.attr("src").match(/iid=(\w+)/)[1]);
                if (bookid === "00000000") bookid = jQuery("div.sharediv > div.bdsharebuttonbox").attr("data-tag").replace("share_", "");
                bidtype = bookid.length == 8 ? "SSID": "DXID";
                img.after(showbid(bookid, bidtype).replace("-20px", "0px").replace("</p>", copybid(bookid, bidtype)));
                m_isbn = ele_ul.text().match(/【ISBN】([\d-]+)\n/);
                isbn = m_isbn ? m_isbn[1] : "";
                ele_headline.after(dblink(bookname, isbn, {"sep": "", "style": "float: none;"}) + copymeta(bookid));
            }
        });
    } else if (pageurl.includes("chapter.jsp?") && pageurl.includes("dxNumber=")) {
        jQuery("#also").after('<p style="color: orange; font-size: 120%;">以下目录非完整版，由于读秀限制，仅展示匹配了 <a href="https://greasyfork.org/zh-CN/scripts/435569/" target="_blank">文献互助小帮手</a> 脚本内置关键词的条目。</p>');
    } else if (pageurl.includes("/n/slib/book/slib/") || pageurl.includes("/n/jpgfs/book/base/")) {
        var downloading = false;
		let tip_fomrat = "设定下载格式：PDF方便，失败页会留空，适合成功率高、不易触发验证码的场景；ZIP包生成速度可能较慢，配置低的电脑慎用；分页下载节省内存，但频繁下载可能干扰你使用浏览器，下载完成后请手动将全部图片收集到一个文件夹，否则多个下载任务的文件会因自动命名难以辨别";
		let tip_zoom = "设定zoom值：值越大越清晰，文件体积也越大；本页面阅读器zoom值为0，若清晰度可用，无需调整";
        var pages = JSON.parse(html.match(/var pages = (\[.*?\]);/)[1]);
        var logarea = `<div id="helperdiv"><a style="display: block; color: #333;" href="#" onclick="(function(){jQuery('textarea#spageslist').toggle()})()">显示/隐藏 页面ID输入区域</a><textarea id="spageslist" rows="12" placeholder="如需指定待下载页面，请在此处输入页面ID列表，每行一个。页面ID为6位长度的字符串，如cov001、!00012、000123等，可点“获取页面列表”获取，也可参考之前的下载log。此功能适用于补下部分失败页面等场景，工具条上设定的页面范围将被忽略。"></textarea><hr><span id="download_status" title="成功页数 / 完成页数 / 全部页数">下载进度</span><hr><textarea id="helperlog" rows="30" placeholder="下载功能使用提示：\n\n顶部工具条上添加的下拉框、输入框、链接、按钮各有其用，鼠标移动到上面会显示提示；\n\n${tip_fomrat}；\n\n${tip_zoom}；"></textarea></div>`;
        var toolbar = `<a href="#" id="downloadlist" class="dtool" title="获取页面列表">页面列表</a><select id="download_format" class="dtool w50px" title="${tip_fomrat}"><option value="pdf">PDF</option><option value="zip">ZIP</option><option value="page">分页</option></select><select id="zoomvalue" class="dtool w35px" title="${tip_zoom}"><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select><input type="text" id="download_start" class="dtool w35px" value="1" title="设定下载范围-起始页"><input type="text" id="download_end" class="dtool w35px" value="${pages[5][1]}" title="设定下载范围-终止页"><input type="checkbox" id="download_all" checked="checked" class="dtool" title="是否下载封面目录等非正文页"><a href="#" id="okdownload" class="dtool">一键下载</a>`;
        setTimeout(function() {
            if (pageurl.includes("/n/slib/book/slib/")) {
                jQuery("div.ToolsBar > ul").css({"width": "96%"});
                jQuery("div.ToolsBar > ul > li.ssbook").css({"width": "160px"});
                jQuery("div.ToolsBar").children().last().after(`<a href="#" id="gettoc" class="dtool">获取目录</a>` + toolbar);
            } else {
                jQuery("div#t_content").css({"margin-left": "150px", "width": "100%"});
                jQuery("div#tc_right").after(`<div style="float: left; height: 23px; margin-top: 2px;">${toolbar}</div>`);
            }
            jQuery("div#reader").after(logarea);
            jQuery("select#pagejump > option").each(function(i, el){
                if (jQuery(this).val() != 5) jQuery(this).text(jQuery(this).text().replace("页", pages[jQuery(this).val()][1] + "页"));
            });
            jQuery("#downloadlist").unbind("click").bind("click", download_spages_list);
            jQuery("#okdownload").unbind("click").bind("click", okdownload);
            jQuery("#gettoc").unbind("click").bind("click", gettoc);
        }, 1000);
    }
    GM_addStyle('#helperlog::-webkit-scrollbar {display: none;} #helperlog {scrollbar-width: none; -ms-overflow-style: none; overflow-x: hidden; overflow-y: auto;} #helperdiv {text-align: center; position: fixed; right: 30px; top: 60px; width: 250px; min-height:500px; background-color: #bfbfbf; border: 1px solid grey;} #helperdiv > hr {margin: 1px 0 1px 0;} #spageslist {padding: 3px; width: 95%; display: none;} #helperlog {background-color: #cecece; padding: 3px; width: 95%;} .dtool {margin-right: 10px; float: left;} .w35px {width: 35px;} .w50px {width: 50px;} div.ToolsBar > ul > li {margin: 0 10px 0 0} span.cpstatus {font-size: 0.8em; color: gray;} .rcresult, .tgresult {width: 100%; background-color: #efefef; padding: 10px;} .rcitem {border-bottom: 1px dotted #ababab}');
    if (typeof jQuery === "undefined" || jQuery === null) return;
    jQuery(".copybid").unbind("click").bind("click", copybid_clicked);
    jQuery(".copybid").unbind("contextmenu").bind("contextmenu", copybid_clicked);
    jQuery(".copymeta").unbind("click").bind("click", copymeta_clicked);
})();
