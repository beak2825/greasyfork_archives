// ==UserScript==
// @name         [谷歌|Alook|Via]小说重排
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  一个简单的网页小说重排，兼容Via和Alook浏览器。自用脚本，不催不更。催了也不更[dog]。
// @author       Mr.NullNull
// @include      *://*/*
// @downloadURL https://update.greasyfork.org/scripts/401042/%5B%E8%B0%B7%E6%AD%8C%7CAlook%7CVia%5D%E5%B0%8F%E8%AF%B4%E9%87%8D%E6%8E%92.user.js
// @updateURL https://update.greasyfork.org/scripts/401042/%5B%E8%B0%B7%E6%AD%8C%7CAlook%7CVia%5D%E5%B0%8F%E8%AF%B4%E9%87%8D%E6%8E%92.meta.js
// ==/UserScript==

/* 
 * 2021-03-18 17:02:44 v0.2.2 增加 www.piaotian5.com站点
 * 2021-07-15 14:56:03 v0.2.3 增加 www.piaotian5.net站点 修改了配色方案以更好地适应oled屏
 * 2021-07-23 15:04:35 v0.2.4 增加 https://www.paomian.net/yuedu/e76/6zbok.html
 */

(function () {
    'use strict';
    /* window.alert("StartA"); */

    function ReaderMain(url, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref) {
        window.stop();

        /*colorCode: 夜间模式night 日间模式light*/
        var colorCode, fontSize;
        var topShow = false;

        init();

        function init() {

            var tmpColor = Utils.getCookie("i_Color"),
                tmpFontSize = Utils.getCookie("i_fontSize");
            if (tmpColor != null && tmpFontSize != null) {
                colorCode = tmpColor;
                fontSize = tmpFontSize;
            } else {
                colorCode = "night";
                fontSize = 16;
                setUserCookie();
            }

            /* 设置网页内容 */
            document.querySelector("html").innerHTML = htmlStr;
            document.querySelector("title").innerHTML = htmlTitle;
            document.querySelectorAll("#i_nr_title")[0].innerHTML = nrTitle;
            document.querySelectorAll("#i_nr_title")[1].innerHTML = nrTitle;
            document.querySelector("div.i_nr").innerHTML = nrStr;

            /* 初始化——字体大小 */
            setFontSize(fontSize);

            /* 初始化配色方案 */
            setColoer(colorCode);


            document.querySelectorAll("#i_btn_prev")[0].setAttribute("href", nrPrevHref);
            document.querySelectorAll("#i_btn_mulu")[0].setAttribute("href", nrMuLuHref);
            document.querySelectorAll("#i_btn_next")[0].setAttribute("href", nrNextHref);
            document.querySelectorAll("#i_btn_prev")[1].setAttribute("href", nrPrevHref);
            document.querySelectorAll("#i_btn_mulu")[1].setAttribute("href", nrMuLuHref);
            document.querySelectorAll("#i_btn_next")[1].setAttribute("href", nrNextHref);



            /* 开关菜单 */
            document.querySelector("div.i_nr").onclick = setOpen;

            /* 设置 */
            document.querySelector("#i_btn_setTheme").onclick = setColor;
            document.querySelector("#i_btn_fontSizeCut").onclick = setFontSizeCut;
            document.querySelector("#i_btn_fontSizeAdd").onclick = setFontSizeAdd;
        }

        function setOpen() {
            if (topShow) {
                document.querySelector("style#i_style_open").innerHTML = ` .i_top_head { top: -10em; } .i_top_food { bottom: -10em; } `;
                topShow = !topShow;
            } else {
                document.querySelector("style#i_style_open").innerHTML = ` .i_top_head { top:   0em; } .i_top_food { bottom:   0em; } `;
                topShow = !topShow;
            }
        }

        function setColor() {
            switch (colorCode) {
                case "light":
                    colorCode = "night";
                    setColoer(colorCode);
                    break;
                case "night":
                    colorCode = "light";
                    setColoer(colorCode);
                    break;
            }
            setUserCookie();
        }

        function setColoer(a) {
            switch (a) {
                case "night":
                    document.querySelector("style#i_style_css").innerHTML = htmlCssNight;
                    document.querySelector("#i_btn_setTheme > div").innerHTML = "开灯";
                    break;
                case "light":
                    document.querySelector("style#i_style_css").innerHTML = htmlCssLight;
                    document.querySelector("#i_btn_setTheme> div").innerHTML = "关灯";
                    break;
            }
        }

        function setFontSizeAdd() {
            fontSize++;
            setFontSize(fontSize);
            setUserCookie();
        }

        function setFontSizeCut() {
            fontSize--;
            setFontSize(fontSize);
            setUserCookie();
        }


        function setFontSize(a) {
            document.querySelector("style#i_style_font").innerHTML = 'body{font: ' + a + 'px/1.5 "微软雅黑";}';
        }

        function setUserCookie() {
            Utils.setCookie("i_Color", colorCode + "");
            Utils.setCookie("i_fontSize", fontSize + "");
        }
    };

    class Utils {
        static getCookie(name) {
            var cStr = document.cookie;
            var tmp, tmpName, tmpValue;
            cStr = cStr.split(";");
            for (var i = 0, len = cStr.length; i < len; i++) {
                tmp = cStr[i].split("=");
                tmpName = tmp[0];
                tmpValue = tmp[1];
                if (tmpName == name || tmpName == " " + name) {
                    return tmpValue;
                }
            }
            return null;
        }

        static setCookie(name, value) {
            document.cookie = name + '=' + value;
        }

        static getBrowser() {
            var browser = {
                msie: false,
                firefox: false,
                opera: false,
                safari: false,
                chrome: false,
                netscape: false,
                appname: 'unknown',
                version: 0
            },
                ua = window.navigator.userAgent.toLowerCase();
            if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(ua)) {
                browser[RegExp.$1] = true;
                browser.appname = RegExp.$1;
                browser.version = RegExp.$2;
            } else if (/version\D+(\d[\d.]*).*safari/.test(ua)) {
                /* safari */
                browser.safari = true;
                browser.appname = 'safari';
                browser.version = RegExp.$2;
            }
            return browser.appname + ' ' + browser.version;
        }

        static htmlTextToDomHtml(arg) {
            var objE = document.createElement("html");
            objE.innerHTML = arg;
            return objE;
        }


        static gteUrlHost(url) {
            var reg = /^http(s)?:\/\/(.*?)\//;
            return reg.exec(url)[2];
        }

        static getHtml(url, charset) {
            var request = new XMLHttpRequest();
            request.open("GET", url, false);
            request.overrideMimeType("text/html;charset=" + charset); /* gbk|utf-8 */
            request.send();
            return request.response;
        }

        static dellScript(htmlDom) {
            var a = htmlDom.querySelectorAll('script');
            for (var i = 0; i < a.length; i++) {
                a[i].parentNode.removeChild(a[i]);
            }
            return htmlDom;
        }

        static dellDom(htmlDom, str) {
            var a = htmlDom.querySelectorAll(str);
            for (var i = 0; i < a.length; i++) {
                a[i].parentNode.removeChild(a[i]);
            }
            return htmlDom;
        }

        static dellDom(str) {
            var a = document.querySelectorAll(str);
            for (var i = 0; i < a.length; i++) {
                a[i].parentNode.removeChild(a[i]);
            }
        }
    };

    const htmlCssLight = `
    body {
        color: #000000;
        background-color: #fbf6ec;
    }

    a {
        color: #000000;
    }

    .i_top_head,
    .i_top_food {
        background-color: #fbf6ec;
    }

    .i_top_head {
        border-bottom: 1px solid rgba(128, 128, 128, 0.5);
    }

    .i_top_food {
        border-top: 1.5px solid rgba(128, 128, 128, 0.5);
    }

    .i_menu_nr>.i_button+.i_button>div {
        border-left: 1px solid rgba(0, 0, 0, 0.5);
    }`;

    const htmlCssNight = `
    body {
        color: #cccccc;
        background-color: #000;
    }

    a {
        color: #cccccc;
    }

    .i_top_head,
    .i_top_food {
        background-color: #1d1d1d;
    }

    .i_top_head {
        border-bottom: 1px solid rgba(0, 0, 0, 0.6);
    }

    .i_top_food {
        border-top: 1.5px solid rgba(0, 0, 0, 0.6);
    }

    .i_menu_nr>.i_button+.i_button>div {
        border-left: 1px solid rgba(255, 255, 255, 0.5);
    }`;


    const htmlStr = `<html>

    <head>
        <title></title>
        <style type="text/css">
            body {
                margin: 0px;
                padding: 0px;
            }
    
            .i_content {
                margin: 0 0.6em;
                padding: 3em 0 2em 0em;
            }
    
            p {
                text-indent: 2em;
            }
    
            a {
                text-decoration: none;
            }
    
            /* 弹出菜单 */
            .i_top_head,
            .i_top_food {
                position: fixed;
                width: 100%;
            }
    
            .i_top_head {
                text-align: left;
                line-height: 3;
                padding: 0em 1em;
                font-weight: bold;
                box-shadow: -1em 0.1em 0.4em rgba(0, 0, 0, 0.2);
            }
    
            .i_top_food {
                height: 8em;
                padding: 0.1em 0 1.6em 0;
                text-align: center;
            }
    
            .i_top_food>div {
                margin: 0 0.5em;
            }
    
            .i_top_food_main>* {
                width: 50%;
            }
    
            .i_top_food_main>.i_button {
                text-align: center;
                float: left;
                display: block;
            }
    
            .i_top_food_main>.i_button>div {
                margin: 1em 0.5em 0.5em 0.5em;
                padding: 0.6em 0;
                border: 1px solid rgb(146, 146, 146);
                border-radius: 0.16em;
                line-height: 1;
            }
    
            .i_top_food_main2 {
                height: 3em;
            }
    
            .i_top_food_main2>* {
                width: 25%;
            }
    
            .i_top_food_main2>.i_button {
                text-align: center;
                float: left;
                display: block;
            }
    
            .i_top_food_main2>.i_button>div {
                margin: 0.6em 0.5em;
                padding: 0.6em 0;
                border: 1px solid rgba(136, 136, 136, 0.26);
                border-radius: 0.16em;
                line-height: 2;
            }
    
            /* 正文内容 */
            .i_title {
                font-weight: bold;
                line-height: 2em;
                margin: 0em 0 1em 0;
            }
    
            .i_menu_nr {
                height: 3em;
                margin: 3em -0.6em 0em -0.6em;
            }
    
            .i_menu_nr>* {
                width: 33%;
            }
    
            .i_menu_nr>.i_button {
                height: 2em;
                padding: 1em 0 0 0;
                text-align: center;
                float: left;
                display: block;
            }
    
            .i_menu_nr>.i_button>div {
                line-height: 1;
            }
        </style>
        <style type="text/css" id="i_style_font"></style>
        <style type="text/css" id="i_style_open">
            .i_top_head {
                top: -10em;
            }
    
            .i_top_food {
                bottom: -10em;
            }
        </style>
        <style type="text/css" id="i_style_css"></style>
    </head>
    
    <body>
        <div class="i_top_head">
            <div id="i_nr_title"></div>
        </div>
    
        <div class="i_content">
            <div class="i_title" id="i_nr_title"></div>
            <div class="i_nr" id="i_nr_str">
            </div>
            <div class="i_menu_nr">
                <a class="i_button" id="i_btn_prev">
                    <div>上一章</div>
                </a>
                <a class="i_button" id="i_btn_mulu">
                    <div>返回目录</div>
                </a>
                <a class="i_button" id="i_btn_next">
                    <div>下一章</div>
                </a>
            </div>
        </div>
        </div>
    
        <div class="i_top_food">
            <div>
                <div class="i_top_food_main">
                    <a class="i_button" id="i_btn_prev">
                        <div>上一章</div>
                    </a>
                    <a class="i_button" id="i_btn_next">
                        <div>下一章</div>
                    </a>
                </div>
                <div class="i_top_food_main2">
    
                    <a class="i_button" id="i_btn_mulu">
                        <div>目录</div>
                    </a>
                    <div class="i_button" id="i_btn_fontSizeCut">
                        <div>A-</div>
                    </div>
                    <div class="i_button" id="i_btn_fontSizeAdd">
                        <div>A+</div>
                    </div>
                    <div class="i_button" id="i_btn_setTheme">
                        <div>开灯</div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    
    </html>`;
    /*————————————————————————————————————————————————————————————————————————————————*/

    var url = document.URL;
    var strHtml, nrStr, nrTitle, htmlTitle, nrPrevHref, nrMuLuHref, nrNextHref;
    var htmlDom;

    var urlHost = Utils.gteUrlHost(url);
    switch (urlHost) {
        case "m.meiguixs.net":
            if (url.match(/m\.meiguixs\.net\/html\/\d*\/\d*\/\d*\.shtml/g) == null) break;
            window.stop();

            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "gbk"));
            htmlTitle = htmlDom.querySelector("title").innerHTML;
            nrTitle = htmlDom.querySelector("div#nr_title").innerHTML;
            nrStr = htmlDom.querySelector("div#nr1").innerHTML;
            nrPrevHref = htmlDom.querySelector("a#pb_prev").getAttribute("href");
            nrMuLuHref = htmlDom.querySelector("a#pb_mulu").getAttribute("href");
            nrNextHref = htmlDom.querySelector("a#pb_next").getAttribute("href");

            nrStr = nrStr.replace(/(&nbsp;|\s)/g, "");
            nrStr = "<p>" + nrStr.replace(/(\s*<br>\s*){1,10}/g, "<p>");

            nrTitle = nrTitle.replace("正文 ", "");
            htmlTitle = htmlTitle.replace("最新更新手打全文字TXT全集下载-玫瑰小说网手机阅读", "") + " " + nrTitle;
            nrStr = nrStr.replace(/(玫瑰小说网|大家记得收藏网址或牢记网址|网址m\.meiguixs\.net|免费最快更新无防盗无防盗|报错章|求书找书|和书友聊书请加qq群：647377658（群号）)(\,|\.|\s)*/g, "");

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);
            break;
        case "m.biquge.tv":
            if (url.match(/m\.biquge\.tv\/\d*\/\d*\/\d*.*\.html/g) == null) break;
            window.stop();

            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "gbk"));
            htmlTitle = htmlDom.querySelector("title").innerHTML;
            nrTitle = htmlDom.querySelector("#nr_title").innerHTML;
            nrStr = htmlDom.querySelector("#nr1").innerHTML;
            nrPrevHref = htmlDom.querySelector("a#pb_prev").getAttribute("href");
            nrMuLuHref = htmlDom.querySelector("a#pb_mulu").getAttribute("href");
            nrNextHref = htmlDom.querySelector("a#pb_next").getAttribute("href");

            nrStr = nrStr.replace(/(&nbsp;|\s)/g, "");
            nrStr = "<p>" + nrStr.replace(/(\s*<br>\s*){1,10}/g, "<p>");

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);
            break;
        case "m.52bqg.com":
            if (url.match(/m\.52bqg\.com\/book_\d*.*\.html/g) == null) break;
            window.stop();

            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "gbk"));
            htmlTitle = htmlDom.querySelector("title").innerHTML;
            nrTitle = htmlDom.querySelector("#nr_title").innerHTML;
            nrStr = htmlDom.querySelector("#nr1").innerHTML;
            nrPrevHref = htmlDom.querySelector("a#pb_prev").getAttribute("href");
            nrMuLuHref = htmlDom.querySelector("a#pb_mulu").getAttribute("href");
            nrNextHref = htmlDom.querySelector("a#pb_next").getAttribute("href");

            /* 检测拼接 */
            var end = nrStr.indexOf('<center class="red">本章未完，点击下一页继续阅读</center>');
            if (end != -1) {
                nrStr = nrStr.substring(0, end - 4);
                nrStr = nrStr.replace(/\s*(-){2}(=|"|>){0,6}(&gt;|\>){2}/g, "");
                var tmpHtmlDom = Utils.htmlTextToDomHtml(Utils.getHtml("https://m.52bqg.com/" + nrNextHref, "gbk"));
                var tmpNrStr = tmpHtmlDom.querySelector("#nr1").innerHTML;
                tmpNrStr = tmpNrStr.replace(/\s*/, "");
                nrStr = nrStr + tmpNrStr;

                nrNextHref = tmpHtmlDom.querySelector("a#pb_next").getAttribute("href");
            }

            nrStr = nrStr.replace(/(&nbsp;|\s)/g, "");
            nrStr = "<p>" + nrStr.replace(/(\s*<br>\s*){1,10}/g, "<p>");

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);
            break;
        case "m.biquge.lu":
            if (url.match(/m\.biquge\.lu\/book\/\d*\/\d*\.html/g) == null) break;
            window.stop();

            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "gbk"));
            htmlTitle = htmlDom.querySelector("title").innerHTML;
            nrTitle = htmlDom.querySelector("span.title").innerHTML;
            nrStr = htmlDom.querySelector("#chaptercontent").innerHTML;
            nrPrevHref = htmlDom.querySelector("a#pb_prev").getAttribute("href");
            nrMuLuHref = htmlDom.querySelector("a#pb_mulu").getAttribute("href");
            nrNextHref = htmlDom.querySelector("a#pb_next").getAttribute("href");

            var end = nrStr.indexOf("<br>");
            nrTitle = nrStr.substring(0, end).replace(/^(\s)*/g, "");
            nrStr = nrStr.substring(end, nrStr.length);

            nrStr = nrStr.replace(/<script>.{0,80}<\/script>/g, "");

            nrStr = nrStr.replace(/(^(\<br\>|\s)*)|((\<br\>|\s)*\s*(笔趣阁阅读网址：m\.biquge\.lu)(\,|\.|\s)*)/g, "");

            nrStr = nrStr.replace(/(&nbsp;|\s|\\r)/g, "");
            nrStr = "<p>" + nrStr.replace(/(\s*<br>\s*){1,10}/g, "<p>");

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);
            break;

        case "m.biquge.info":
            if (url.match(/(www|m)\.biquge\.info\/\d*_\d*\/\d*\.html/g) == null) break;
            url = url.replace(/m\.biquge\.info/g, "www.biquge.info");
            window.location.href = url;
        case "www.biquge.info":
            if (url.match(/(www|m)\.biquge\.info\/\d*_\d*\/\d*\.html/g) == null) break;

            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "utf-8"));
            htmlTitle = htmlDom.querySelector("title").innerHTML;
            nrTitle = htmlDom.querySelector("div.bookname > h1").innerHTML;
            nrStr = htmlDom.querySelector("div#content").innerHTML;
            nrPrevHref = htmlDom.querySelectorAll("div.bottem1 > a")[1].getAttribute("href");
            nrMuLuHref = htmlDom.querySelectorAll("div.bottem1 > a")[2].getAttribute("href");
            nrNextHref = htmlDom.querySelectorAll("div.bottem1 > a")[3].getAttribute("href");

            nrTitle = nrTitle.replace(/^(正文 )/, "");
            nrStr = nrStr.replace(/(&nbsp;|\s)/g, "");
            nrStr = "<p>" + nrStr.replace(/(\s*<br>\s*){1,10}/g, "<p>");

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);
            break;

        case "wap.xsbiquge.com":
        /* if (url.match(/(www|wap)\.xsbiquge\.com\/\d*_\d*\/\d*\.html/g) == null) break;
        window.stop(); */
        case "www.xsbiquge.com":
            if (url.match(/(www|wap)\.xsbiquge\.com\/\d*_\d*\/\d*\.html/g) == null) break;
            window.stop();

            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "utf-8"));
            htmlTitle = htmlDom.querySelector("title").innerHTML;
            nrTitle = htmlDom.querySelector("div.bookname > h1").innerHTML;
            nrStr = htmlDom.querySelector("div#content").innerHTML;
            nrPrevHref = htmlDom.querySelectorAll("div.bottem1 > a")[0].getAttribute("href");
            nrMuLuHref = htmlDom.querySelectorAll("div.bottem1 > a")[1].getAttribute("href");
            nrNextHref = htmlDom.querySelectorAll("div.bottem1 > a")[2].getAttribute("href");

            nrTitle = nrTitle.replace(/^(正文 )/, "");
            nrStr = nrStr.replace(/(&nbsp;|\s)/g, "");
            nrStr = "<p>" + nrStr.replace(/(\s*<br>\s*){1,10}/g, "<p>");

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);
            break;

        case "m.b5200.net":
            if (url.match(/(m)\.b5200\.net\/wapbook-\d*-\d*\//g) == null) break;
            window.stop();

            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "gbk"));
            htmlTitle = htmlDom.querySelector("title").innerHTML;
            nrTitle = htmlDom.querySelector("div.title").innerHTML;
            nrStr = htmlDom.querySelector("div.text").innerHTML;
            nrPrevHref = htmlDom.querySelectorAll("div.navigator-nobutton > ul > li > a")[0].getAttribute("href");
            nrMuLuHref = htmlDom.querySelectorAll("div.navigator-nobutton > ul > li > a")[1].getAttribute("href");
            nrNextHref = htmlDom.querySelectorAll("div.navigator-nobutton > ul > li > a")[3].getAttribute("href");

            nrStr = nrStr.replace(/<div.{0,50}>.{0,280}<\/div>/g, ""); /* 删除内容中间的js脚本和div */
            nrStr = nrStr.replace(/(&nbsp;|\s)/g, "");
            nrStr = "<p>" + nrStr.replace(/(\s*<br>\s*){1,10}/g, "<p>");

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);
            /* 这个网站貌似有防脚本的操作 识别出不是自己的结构会给你加 style="display: none;" */
            document.querySelector("body > div").setAttribute("class", "nav");
            document.querySelector("body > div.i_content").setAttribute("class", "body");

            break;

        case "www.shuquge.com":
            if (url.match(/(www)\.shuquge\.com\/txt\/\d*\/\d*\.html/g) == null) break;
            window.stop();

            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "utf-8"));
            htmlTitle = htmlDom.querySelector("title").innerHTML;
            nrTitle = htmlDom.querySelector("div.content > h1").innerHTML;
            nrStr = htmlDom.querySelector("div#content").innerHTML;
            nrPrevHref = htmlDom.querySelectorAll("div.page_chapter > ul > li > a")[0].getAttribute("href");
            nrMuLuHref = htmlDom.querySelectorAll("div.page_chapter > ul > li > a")[1].getAttribute("href");
            nrNextHref = htmlDom.querySelectorAll("div.page_chapter > ul > li > a")[2].getAttribute("href");

            if (nrStr.indexOf(url) != -1) nrStr = nrStr.split('<br>').slice(0, -3).join('<br>');

            nrStr = nrStr.replace(/(&nbsp;|\s)/g, "");
            nrStr = "<p>" + nrStr.replace(/(\s*<br>\s*){1,10}/g, "<p>");

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);
            break;

        case "m.wqge.cc":
            if (url.match(/(m)\.wqge\.cc\/wapbook-\d*-\d*\//g) == null) break;
            window.stop();

            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "gb2312"));
            htmlTitle = htmlDom.querySelector("title").innerHTML;
            nrTitle = htmlDom.querySelector("div.title").innerHTML;
            nrStr = htmlDom.querySelector("div.text").innerHTML;
            nrPrevHref = htmlDom.querySelectorAll("div.navigator-nobutton > ul > li > a")[0].getAttribute("href");
            nrMuLuHref = htmlDom.querySelectorAll("div.navigator-nobutton > ul > li > a")[1].getAttribute("href");
            nrNextHref = htmlDom.querySelectorAll("div.navigator-nobutton > ul > li > a")[2].getAttribute("href");
            console.log(nrStr);

            nrStr = nrStr.replace(/<div.*>.*<\/div>/g, "");
            nrStr = nrStr.replace(/(&nbsp;|\s)/g, "");
            nrStr = "<p>" + nrStr.replace(/(\s*<br>\s*){1,10}/g, "<p>");
            console.log(nrStr);

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);
            break;

        case "www.iqiwx.com":
            if (url.match(/(www)\.iqiwx\.com\/book\/\d*\/\d*\/\d*\.html/g) == null) break;
            window.stop();

            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "gb2312"));
            htmlTitle = htmlDom.querySelector("title").innerHTML;
            nrTitle = htmlDom.querySelector('div#center > div.title >h1').innerHTML;
            nrStr = htmlDom.querySelector("div#center > div#content").innerHTML;
            nrPrevHref = htmlDom.querySelectorAll("div.jump > a")[0].getAttribute("href");
            nrMuLuHref = htmlDom.querySelectorAll("div.jump > a")[2].getAttribute("href");
            nrNextHref = htmlDom.querySelectorAll("div.jump > a")[4].getAttribute("href");
            nrStr = nrStr.replace(/(&nbsp;|\s)/g, "");
            nrStr = "<p>" + nrStr.replace(/(\s*<br>\s*){1,10}/g, "<p>");

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);
            break;
        case "m.iqiwx.com":
            if (url.match(/(m)\.iqiwx\.com\/\d*\/\d*\/\d*\.html/g) == null) break;
            window.stop();

            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "utf-8"));
            htmlTitle = htmlDom.querySelector("title").innerHTML;
            nrTitle = htmlDom.querySelector('div.thirdnavbar > strong > font').innerHTML;
            nrStr = htmlDom.querySelector("div.mqq-content").innerHTML;
            nrPrevHref = htmlDom.querySelectorAll("ul.pagenav3 > li > a")[0].getAttribute("href");
            nrMuLuHref = htmlDom.querySelectorAll("ul.pagenav3 > li > a")[1].getAttribute("href");
            if (htmlDom.querySelectorAll("ul.pagenav3 > li > a").length == 6) {
                nrNextHref = htmlDom.querySelectorAll("ul.pagenav3 > li > a")[2].getAttribute("href");
            } else {
                nrNextHref = nrMuLuHref;
            }

            nrStr = nrStr.replace(/(&nbsp;|\s)/g, "");
            nrStr = "<p>" + nrStr.replace(/(\s*<br>\s*){1,10}/g, "<p>");

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);
            break;

        case "m.biquge.se":
            if (url.match(/(m)\.biquge\.se\/\d*\/\d*\.html/g) == null) break;
            window.stop();

            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "utf-8"));
            htmlTitle = htmlDom.querySelector("title").innerHTML;
            nrTitle = htmlDom.querySelector('#nr_title').innerHTML;
            nrStr = htmlDom.querySelector("div#nr1").innerHTML;
            nrPrevHref = htmlDom.querySelector("#pb_prev").getAttribute("href");
            nrMuLuHref = htmlDom.querySelector("#pb_mulu").getAttribute("href");
            nrMuLuHref = "http://m.biquge.se/list/" + nrMuLuHref.substring(1, nrMuLuHref.length - 1) + ".html";
            nrNextHref = htmlDom.querySelector("#pb_next").getAttribute("href");

            nrStr = nrStr.replace(/(&nbsp;|\s)/g, "");
            nrStr = "<p>" + nrStr.replace(/(\s*<br>\s*){1,10}/g, "<p>");

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);
            break;


        case "www.xbiquge.la":
            if (url.match(/(m|www)\.xbiquge\.la\/\d*\/\d*\/\d*\.html/g) == null) break;
            window.stop();
            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "utf-8"));
            htmlTitle = htmlDom.querySelector("title").innerHTML;
            nrTitle = htmlDom.querySelector('div.bookname > h1').innerHTML;
            nrStr = htmlDom.querySelector("div#content").innerHTML;

            nrPrevHref = htmlDom.querySelectorAll("div.bottem1 > a")[1].getAttribute("href");
            nrMuLuHref = htmlDom.querySelectorAll("div.bottem1 > a")[2].getAttribute("href");
            nrNextHref = htmlDom.querySelectorAll("div.bottem1 > a")[3].getAttribute("href");

            nrStr = nrStr.replace(/(<p>(\s|\S)*<\/p>)/g, "");
            nrStr = nrStr.replace(/(&nbsp;|\s)/g, "");
            nrStr = "<p>" + nrStr.replace(/(\s*<br>\s*){1,10}/g, "<p>");

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);
            break;

        case "m.soshuwu.com":
            if (url.match(/(m|www)\.soshuwu\.com\/\S*\/\d*\.html/g) == null) break;
            window.stop();
            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "utf-8"));
            htmlTitle = htmlDom.querySelector("title").innerHTML;
            nrTitle = htmlDom.querySelector('h1.headline').innerHTML;
            nrStr = htmlDom.querySelector("div.content").innerHTML;

            nrPrevHref = htmlDom.querySelectorAll("div.pager > a")[0].getAttribute("href");
            nrMuLuHref = htmlDom.querySelectorAll("div.pager > a")[1].getAttribute("href");
            nrNextHref = htmlDom.querySelectorAll("div.pager > a")[2].getAttribute("href");

            nrStr = nrStr.replace(/(<p>(\s|\S){1,20}(soshuwu\.com)(\s|\S){1,20}<\/p>)/g, "");

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);

            window.setTimeout(function () {
                Utils.dellDom("ul.layui-fixbar");
            }, 1000);
            break;

        case "m.cc148.com":
            if (url.match(/(m|www)\.cc148\.com\/\S*\/\d*\.html/g) == null) break;

            window.stop();
            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "gbk"));
            htmlTitle = htmlDom.querySelector("title").innerHTML;
            nrTitle = htmlDom.querySelector("#nr_title").innerHTML;
            nrStr = htmlDom.querySelector("#nr1").innerHTML;

            //这里网页id命名有问题，不是我的问题
            nrPrevHref = htmlDom.querySelector("#pt_mulu").getAttribute("href");
            nrMuLuHref = htmlDom.querySelector("#pt_prev").getAttribute("href");
            nrNextHref = htmlDom.querySelector("#pb_mulu").getAttribute("href");

            nrStr = nrStr.replace(/(&nbsp;|\s)/g, "");
            nrStr = "<p>" + nrStr.replace(/(\s*<br>\s*){1,10}/g, "<p>");
            nrStr = nrStr.replace(/(笔趣阁首发网址：m\.cc148\.com)/g, "");

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);
            break;

        case "m.shuwulou.com":
            if (url.match(/(m|www)\.shuwulou\.com\/\S*\/\d*\.html/g) == null) break;

            window.stop();
            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "gbk"));
            htmlTitle = htmlDom.querySelector("title").innerHTML;
            nrTitle = htmlDom.querySelector("#nr_title").innerHTML;
            nrStr = htmlDom.querySelector("#nr1").innerHTML;

            nrPrevHref = htmlDom.querySelector("#pb_prev").getAttribute("href");
            nrMuLuHref = htmlDom.querySelector("#pb_mulu").getAttribute("href");
            nrNextHref = htmlDom.querySelector("#pb_next").getAttribute("href");

            nrStr = nrStr.replace(/(&nbsp;|\s)/g, "");
            nrStr = "<p>" + nrStr.replace(/(\s*<br>\s*){1,10}/g, "<p>");

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);
            break;

        case "m.66wx.com":
            //http://m.66wx.com/mbook/126/126846/32102291.html
            if (url.match(/(m|www)\.66wx\.com\/mbook\/\d*\/\d*\/\d*\.html/g) == null) break;


            window.stop();
            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "gbk"));
            console.log(htmlDom);


            var tmp = htmlDom.querySelector("title").innerHTML.match(/([\S|\s]*)_(\S*)/);
            htmlTitle = tmp[2] + " - " + tmp[1];
            nrTitle = tmp[1];
            nrStr = htmlDom.querySelector("div#htmlContent > p").innerHTML;


            nrMuLuHref = htmlDom.querySelectorAll("#ufoot a")[2].getAttribute("href");

            nrPrevHref = htmlDom.querySelectorAll("#upPage > script")[0].innerHTML.match(/\d*\.html/)[0];
            nrPrevHref = nrPrevHref == "0.html" ? nrMuLuHref : nrPrevHref

            nrNextHref = htmlDom.querySelectorAll("#upPage > script")[1].innerHTML.match(/\d*\.html/)[0];
            nrNextHref = nrNextHref == "0.html" ? nrMuLuHref : nrNextHref


            nrStr = nrStr.replace(/(&nbsp;|\s)/g, "");
            nrStr = "<p>" + nrStr.replace(/(\s*<br>\s*){1,10}/g, "<p>");

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);
            break;

        case "www.piaotian5.net":
        //https://www.piaotian5.net/book/17810/10920457.html

        case "www.piaotian5.com":

            //https://www.piaotian5.com/book/29782/17457908.html
            if (url.match(/(m|www)\.piaotian5\.(com|net)\/book\/\d*\/\d*\.html/g) == null) break;


            window.stop();
            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "gbk"));
            console.log(htmlDom);

            //第5章 闯入5_嫁给一座荒芜城_其他小说小说_飘天文学网
            var tmp = htmlDom.querySelector("title").innerHTML.match(/([\S|\s]*)_(\S*)_(\S*)小说_飘天文学网/);
            htmlTitle = tmp[2] + " - " + tmp[1];
            nrTitle = tmp[1];
            nrStr = htmlDom.querySelector("div#content").innerHTML;


            var tmp = htmlDom.querySelectorAll(".page_chapter > ul > li > a");
            nrMuLuHref = tmp[1].getAttribute("href");
            nrPrevHref = tmp[0].getAttribute("href");
            nrNextHref = tmp[2].getAttribute("href");


            nrStr = nrStr.replace(/(&nbsp;|\s)/g, "");
            nrStr = "<p>" + nrStr.replace(/(\s*<br>\s*){1,10}/g, "<p>");
            nrStr = nrStr.replace(/https:\/\/www\.piaotian5\.(com|net)\/book\/\d*\/\d*.html/g, "");
            nrStr = nrStr.replace(/,,大家记得收藏网址或牢记网址,网址m..免费最快更新无防盗无防盗.报错章.求书找书.和书友聊书/g, "");
            nrStr = nrStr.replace(/天才一秒记住本站地址：www\.piaotian5\.(com|net)。飘天文学网手机版阅读网址：m\.piaotian5\.(com|net)/g, "");

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);
            break;


        case "m.paomian.net":
            //https://www.paomian.net/yuedu/e76/6zbok.html
            if (url.match(/m\.paomian\.net\/yuedu\/\S*\/\S*.html/g) == null) break;
            url = url.replace(/m\.paomian\.net/g, "www.paomian.net");
            window.location.href = url;
            s
        case "www.paomian.net":

            //hwww.paomian.net
            if (url.match(/www\.paomian\.net\/yuedu\/\S*\/\S*.html/g) == null) break;

            window.stop();
            htmlDom = Utils.htmlTextToDomHtml(Utils.getHtml(url, "utf-8"));
            console.log(htmlDom);

            //第5章 闯入5_嫁给一座荒芜城_其他小说小说_飘天文学网
            //她成了病娇君王的白月光 第361章 千层套路也不管用_泡面小说网
            console.log(htmlDom.querySelector("title").innerHTML);
            var tmp = htmlDom.querySelector("title").innerHTML.match(/([\S]*) (第\S*章 \S*)_泡面小说网/);
            console.log(tmp);
            htmlTitle = tmp[1] + " - " + tmp[2];
            nrTitle = tmp[2];

            var tmp1 = tmp[1];

            nrStr = htmlDom.querySelector("div#content").innerHTML;


            var tmp = htmlDom.querySelectorAll(".bottem2 > a");
            nrMuLuHref = tmp[1].getAttribute("href");
            nrPrevHref = tmp[0].getAttribute("href");
            nrNextHref = tmp[2].getAttribute("href");


            nrStr = nrStr.replace(/(&nbsp;|\s)/g, "");
            nrStr = "<p>" + nrStr.replace(/(\s*<br>\s*){1,10}/g, "<p>");
            
            tmp = new RegExp(`${tmp1}\\S*章节地址：(\\S|\\s)*(.html)`, "g");
            console.log(tmp);
            nrStr = nrStr.replace(tmp, "");

            ReaderMain(document.URL, htmlTitle, nrTitle, nrStr, nrPrevHref, nrMuLuHref, nrNextHref);
            break;
    }
})();