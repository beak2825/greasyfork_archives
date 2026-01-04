// ==UserScript==
// @name         CleanReader
// @namespace    https://greasyfork.org/zh-CN/users/141921
// @version      0.4.1
// @description  启用后，自动进入简洁阅读模式。
// @author       Vinx
// @match
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @require      https://greasyfork.org/scripts/38955-jquery-print/code/jQueryprint.js?version=254772
// @include      *
// @grant        GM_addStyle
// @run-at       document-end
// @note         2021.05.08-V0.4.1 修正开源中国显示
// @note         2021.05.08-V0.4.0 修复了CSDN显示问题，整理代码
// @note         2018.11.07-V0.3.3 修复了CSDN打印的问题，添加OSChina等网站
// @note         2018.03.18-V0.3.2 添加放大缩小按钮，并支持按键缩放（+/= :放大，- :缩小）
// @note         2018.03.18-V0.3.1 添加ESC退出阅读模式功能
// @note         2018.03.15-V0.3.0 添加对Discuz论坛的支持，修改标题和内容居中显示
// @note         2018.02.28-V0.2.0 不在自动进入，添加了阅读及打印按钮
// @note         2017.07.19-V0.1.0 首次发布，启用后，自动进入简洁阅读模式。
// @downloadURL https://update.greasyfork.org/scripts/31595/CleanReader.user.js
// @updateURL https://update.greasyfork.org/scripts/31595/CleanReader.meta.js
// ==/UserScript==

var contents = {
    'blog.csdn.net': {
        'title': ".title-article|.csdn_top",
        'content': ".article_content"
    },
    'www.cnblogs.com': {
        'title': "#cb_post_title_url",
        'content': "#cnblogs_post_body"
    },
    'blog.sina.com.cn': {
        'title': ".articalTitle",
        'content': ".articalContent"
    },
    'bbs.fishc.com': {
        'title': "#thread_subject",
        'content': "[id^='postmessage_']:first"
    },
    'www.liaoxuefeng.com': {
        'title': ".x-content h4",
        'content': ".x-main-content"
    },
    'blog.163.com': {
        'title': ".title.pre.fs1",
        'content': ".bct.fc05.fc11.nbw-blog.ztag"
    },
    'www.runoob.com': {
        'title': ".article-intro h1:first",
        'content': ".article-body"
    },
    'lib.uml.com.cn': {
        'title': ".arttitle",
        'content': ".artcontent"
    },
    'bbs.pediy.com': {
        'title': ".break-all.subject",
        'content': ".message.break-all:first"
    },
    'oschina.net': {
        'title': ".article-box__title",
        'content': ".article-detail .content"
    },
    'www.oschina.net': {
        'title': ".article-box__title",
        'content': ".article-detail .content"
    },
    'my.oschina.net': {
        'title': ".article-box__title",
        'content': ".article-detail .content"
    },
    'kns.cnki.net': {
        'title': "",
        'content': ".content"
    }

};

(function () {
    'use strict';
    var J;
    if (typeof jQuery != 'undefined') {  //避免与原网页中的Jquery冲突
        J = jQuery.noConflict(true);
    }

    AddTemplateSite();

    if (!IsContentPage()) return;

    // 添加样式表
    addStyle();

    // 保存样式
    var html_height = J("html").css("height");
    var body_width = J("body").css("width");
    var body_height = J("body").css("height");
    var body_min_width = J("body").css("min_width");
    var body_min_height = J("body").css("min_height");
    var body_background = J("body").css("background");
    var body_text_align = J("body").css("text-align");
    var body_margin = J("body").css("margin");
    var body_padding = J("body").css("padding");
    var body_overflow_y = J("body").css("overflow-y");

    // 创建阅读按钮
    createReadButton();
    // 创建打印按钮
    createPrintButton();
    // 创建缩小按钮
    createZoomOutButton();
    // 创建放大按钮
    createZoomInButton();

    keyEventHandler();

    function addStyle() {
        J("head").append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.css">');

        GM_addStyle(`
        #read_button, #print_button, #zoom_out_button, #zoom_in_button{
            width: 24px;
            height: 24px;
            z-index: 999999;
            cursor: pointer;
            position: fixed;
            margin: 0 auto;
            color: #0593d3;
            font-size: 24px;
        }

        #read_button{

            right: 32px;
            bottom: 32px;
        }

        #print_button {

            right: 32px;
            bottom: 64px;
        }

        #zoom_out_button {

            right: 32px;
            bottom: 96px;
        }

        #zoom_in_button {

            right: 32px;
            bottom: 128px;
        }

        @media print{
            body{
                min-width:1000px;
            }

            pre{
                word-break: break-word;
                white-space: pre-wrap;
            }

            #read_button, #print_button, #zoom_in_button ,#zoom_out_button{
                display: none;
            }
        }
    `);
    }

    // 创建阅读按钮
    function createReadButton() {
        var read_button = document.createElement("div");
        J(read_button).attr("class", "fa fa-book fa-2");
        J(read_button).attr("id", "read_button");
        J("body").prepend(read_button);

        J("#read_button").click(function () {
            var isShow = J(read_button).attr("userdata");
            if (isShow == "true") {
                exitCleanRead();
                J("#print_button").hide();
                J("#zoom_in_button").hide();
                J("#zoom_out_button").hide();
            }
            else {
                enterCleanRead();
                J("#read_button").show();
                J("#print_button").show();
                J("#zoom_in_button").show();
                J("#zoom_out_button").show();
            }
        });
    }

    // 创建打印按钮
    function createPrintButton() {
        var print_button = document.createElement("div");
        J(print_button).attr("class", "fa fa-print fa-2");
        J(print_button).attr("id", "print_button");
        J("body").prepend(print_button);
        J("#print_button").hide();

        J("#print_button").click(function () {
            J("#CleanReader").print({
                globalStyles: true,
                mediaPrint: false,
                stylesheet: null,
                noPrintSelector: ".no-print",
                iframe: true,
                append: null,
                prepend: null,
                manuallyCopyFormValues: true,
                deferred: J.Deferred()
            });
        });
    }

    // 创建缩小按钮
    function createZoomOutButton() {
        var zoom_out_button = document.createElement("div");
        J(zoom_out_button).attr("class", "fa fa-search-minus fa-2");
        J(zoom_out_button).attr("id", "zoom_out_button");
        J("body").prepend(zoom_out_button);
        J("#zoom_out_button").hide();

        J("#zoom_out_button").click(function () {
            var zoom = J("#CleanReader").css("zoom");
            zoom = parseFloat(zoom);
            zoom = zoom - 0.1;
            if (zoom <= 0) zoom = 0.1;
            J("#CleanReader").css("zoom", zoom);
        });

    }

    // 创建放大按钮
    function createZoomInButton() {
        var zoom_in_button = document.createElement("div");
        J(zoom_in_button).attr("class", "fa fa-search-plus fa-2");
        J(zoom_in_button).attr("id", "zoom_in_button");
        J("body").prepend(zoom_in_button);
        J("#zoom_in_button").hide();

        J("#zoom_in_button").click(function () {
            var zoom = J("#CleanReader").css("zoom");
            zoom = parseFloat(zoom);
            zoom = zoom + 0.1;
            J("#CleanReader").css("zoom", zoom);
        });

    }

    // 按键事件处理
    function keyEventHandler() {
        //ESC退出
        J(document).keyup(function () {
            var isShow = J("#read_button").attr("userdata");
            if (event.keyCode == 27 && isShow == "true") {
                exitCleanRead();
                J("#print_button").hide();
                J("#zoom_in_button").hide();
                J("#zoom_out_button").hide();
            }
        });

        // + - 放大缩小
        J(document).keydown(function () {
            var zoom = 1;
            var isShow = J("#read_button").attr("userdata");
            if (event.keyCode == 107 || event.keyCode == 187) {
                zoom = J("#CleanReader").css("zoom");
                zoom = parseFloat(zoom);
                zoom = zoom + 0.1;
                J("#CleanReader").css("zoom", zoom);
            }
            else if (event.keyCode == 109 || event.keyCode == 189) {
                zoom = J("#CleanReader").css("zoom");
                zoom = parseFloat(zoom);
                zoom = zoom - 0.1;
                if (zoom <= 0) zoom = 0.1;
                J("#CleanReader").css("zoom", zoom);
            }
        });
    }

    // 判断是否为内容页
    function IsContentPage() {
        if (!contents.hasOwnProperty(window.location.host)) return false;

        var isContentPage = false;
        var tmp1 = contents[window.location.host].content.split("|");
        for (var i = 0; i < tmp1.length; i++) {
            if (J(tmp1[i]).length > 0) {
                isContentPage = true;
                break;
            }
        }

        if (!isContentPage) return false;

        return true;
    }

    function AddTemplateSite() {
        var jsonstr = {};
        //Discuz
        if (J("meta[name='generator'][content]").length > 0 && J("meta[name='generator'][content]").attr("content").indexOf("Discuz") >= 0) {
            jsonstr.title = "#thread_subject";
            jsonstr.content = "[id^='postmessage_']:first|.pattl";
            contents[window.location.host] = jsonstr;
        }
    }

    // 进入阅读模式
    function enterCleanRead() {
        var hostName = window.location.host;

        J("html").css("height", "100%");
        J("body").css("height", "100%");
        J("body").css("background", "#ffffff");
        J("body").css("text-align", "left");
        J("body").css("margin", "0 0");
        J("body").css("padding", "0 0");
        J("body").css("overflow-y", "hidden");

        var CleanReader = document.createElement("div");
        J(CleanReader).attr("style", "background-color: rgb(255, 255, 255);"
            + "width: 1000px;"
            + "margin: 0px auto;"
            + "padding: 0px 20px;")
        J(CleanReader).attr("id", "CleanReader");

        // 标题节点
        var titleSelectors = contents[hostName].title.split("|");
        var titleText;
        for (var i = 0; i < titleSelectors.length; i++) {
            if (J(titleSelectors[i]).length > 0) {
                titleText = J(titleSelectors[i]).text();
                break;
            }
        }

        var title = document.createElement("div");
        J(title).html(titleText);
        J(title).attr("style", "font-size: 32px;"
            + "margin: 0px auto;"
            + "padding: 10px 0px;"
            + "text-align: center;")

        J(CleanReader).append(title);
        J(CleanReader).append("<hr/>");

        // 正文节点
        var textSelectors = contents[hostName].content.split("|");
        for (var j = 0; j < textSelectors.length; j++) {
            J(CleanReader).append(J(textSelectors[j]).clone());
        }

        J(CleanReader).children().css("margin", "0px auto");

        // 黑色遮罩
        var mask = document.createElement("div");
        J(mask).attr("style", "height: 100%;"
            + "width: 100%;"
            + "background-color: rgba(0, 0, 0, 0.9);"
            + "z-index: 999997;"
            + "position: fixed;"
            + "left: 0;"
            + "top: 0;"
            + "margin: 0px auto;"
            + "overflow-y: auto;");
        J(mask).attr("id", "CleanReadermask");
        J(mask).append(CleanReader);

        J("body").css("overflow-y", "hidden");
        J("body").prepend(mask);

        var image = J(CleanReader).find("img");
        for (var k = 0; k < image.length; k++) {
            J(image[k]).css("max-width", "90%");
            J(image[k]).css("height", "auto");
        }

        J("#read_button").attr("userdata", "true");
    }

    // 退出阅读模式
    function exitCleanRead() {
        J("#CleanReadermask").remove();

        J("html").css("height", html_height);
        J("body").css("width", body_width);
        J("body").css("height", body_height);
        J("body").css("min_width", body_min_width);
        J("body").css("min_height", body_min_height);
        J("body").css("background", body_background);
        J("body").css("text-align", body_text_align);
        J("body").css("margin", body_margin);
        J("body").css("padding", body_padding);
        J("body").css("overflow-y", body_overflow_y);

        J("#read_button").attr("userdata", "");
    }
})();

