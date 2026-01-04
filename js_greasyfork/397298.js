// ==UserScript==
// @name         LushStories.com & LitErotica.com-去除文章选择、复制限制，后台静默复制文章到剪贴板；添加朗读/听书按钮
// @name:en      LushStories.com & LitErotica.com-Enable Copy & Smart Read
// @namespace    yoursatan
// @version      0.1.3
// @description  LushStories.com & LitErotica.com：默认去除文章选择、复制限制；添加 Smart Read 按钮，实现语音朗读/听书功能,Esc-结束朗读；空格-暂定/继续（360安全浏览器急速模式（已测试），Chrome浏览器）；www.qidian.com：左侧功能栏增加“听书”按钮，点击“听书”开始朗读。后台静默复制文章内容到剪贴板。
// @description:en   LushStories.com & LitErotica.com:Default to remove the copy restriction of the site:www.lushStories.com & www.literotica.com;Add a Smart Read button to listen stories(Chrome:Esc to cancel & Space to psuse/resume).Silently copy the content of the article to the clipboard in the background.
// @author       yorusatan
// @include      https://www.lushstories.com/stories/*
// @include      https://www.literotica.com/s/*
// @include      https://read.qidian.com/chapter/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/397298/LushStoriescom%20%20LitEroticacom-%E5%8E%BB%E9%99%A4%E6%96%87%E7%AB%A0%E9%80%89%E6%8B%A9%E3%80%81%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%EF%BC%8C%E5%90%8E%E5%8F%B0%E9%9D%99%E9%BB%98%E5%A4%8D%E5%88%B6%E6%96%87%E7%AB%A0%E5%88%B0%E5%89%AA%E8%B4%B4%E6%9D%BF%EF%BC%9B%E6%B7%BB%E5%8A%A0%E6%9C%97%E8%AF%BB%E5%90%AC%E4%B9%A6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/397298/LushStoriescom%20%20LitEroticacom-%E5%8E%BB%E9%99%A4%E6%96%87%E7%AB%A0%E9%80%89%E6%8B%A9%E3%80%81%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%EF%BC%8C%E5%90%8E%E5%8F%B0%E9%9D%99%E9%BB%98%E5%A4%8D%E5%88%B6%E6%96%87%E7%AB%A0%E5%88%B0%E5%89%AA%E8%B4%B4%E6%9D%BF%EF%BC%9B%E6%B7%BB%E5%8A%A0%E6%9C%97%E8%AF%BB%E5%90%AC%E4%B9%A6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
// v0.1.3 修复一些使用中发现的bug。
// v0.1.2 添加朗读时scroll效果 ——2020-3-13
// v0.1.1 1，起点网听书按钮样式更新；2，实现后台静默复制文章到剪贴板（目前三个网站同时支持），感谢Sun Jing和他的 Enable Copy 代码 ——2020-3-11
// v0.1.0 增加 www.qidian.com 支持（在左侧侧边栏增加“听书”按钮，复制功能暂未实现o(╥﹏╥)o） ——2020-3-11
// v0.0.9 增加 www.LitErotica.com 支持 ——2020-3-10
// v0.0.8 修复一个格式化bug ——2020-3-9
// v0.0.7 1，移除 Enable Copy 按钮，“选择、复制，可划词以配合有道翻译”改为默认执行 ——2020-3-9
// v0.0.7 2，实现朗读时当前段落处于选中状态（蓝底白字） ——2020-3-9
// v0.0.6 完善 Smart Read 功能：Esc-结束朗读；空格-暂定/继续 ——2020-3-8
// v0.0.5 添加 Smart Read 按钮，实现语音朗读/听书功能 ——2020-3-8
// v0.0.4 修改介绍文字 -2020-3-7
// v0.0.3 更新按钮样式，统一按钮风格 ——2020-3-7
// v0.0.2 实现基本功能，点击可选，可复制，可划词使用有道翻译 ——2020-3-4
// v0.0.1 添加 Enable Copy 按钮，更改文章样式 ——2020-3-3
(function() {
    "use strict";
    // 用于获取story内文本的父元素全体
    var storyAll = "";
    // 用于获取story文本全体
    var story = "";
    // 用于存储格式化后story文本全体
    var newStory = "";

    if (
        // https://www.lushstories.com/stories/ 网站支持
        window.location.href.indexOf("https://www.lushstories.com/stories/") >
        -1
    ) {
        // 更改网站CSS样式
        $(".blockselect").css({
            "-moz-user-select": "-moz-text",
            "-khtml-user-select": "text",
            "-webkit-user-select": "text",
            "user-select": "text"
        });
        $("#printer").css({
            "-moz-user-select": "-moz-text",
            "-khtml-user-select": "text",
            "-webkit-user-select": "text",
            "user-select": "text"
        });
        $(".onoffswitch").css({
            "-moz-user-select": "-moz-text",
            "-khtml-user-select": "text",
            "-webkit-user-select": "text",
            "user-select": "text"
        });

        // 打包story
        $(".story").wrap("<div id='newCont'></div>");

        // 打包storycontent
        $(".storycontent").wrap("<div id='storycontent'></div>");

        // 添加 Smart Read 按钮
        $("#breadcrumb").append(
            '<a id="btnSmartRead" type = "button" href = "#" title = "Smart Read"  style="color:black;background:#e60022; width:150px;display: run-in ;margin:0 5px; padding: 0 5px;text-align:center ;font: 150% Trebuchet MS; border: 1px solid #e60022;-moz-border-radius: 3px;-webkit-border-radius: 3px;border-radius: 3px; height: 20px;">Smart Read</a>'
        );

        // 获取story文本并格式化；
        // 原.story文本
        storyAll = $(".story").html();

        // 原.storycontent文本
        story = $(".storycontent").html();

        // 解除选择、复制限制，更改默认样式
        $("#sticky-col").remove();
        $(".story").remove();
        $("#newCont").append(storyAll);
        $(".storycontent").remove();
        $("#newCont").css("width", "125%");
    }

    if (
        // https://www.literotica.com/s/ 网站支持
        window.location.href.indexOf("https://www.literotica.com/s/") > -1
    ) {
        // 添加 Smart Read 按钮
        $(".b-breadcrumbs").append(
            '<a id="btnSmartRead" type = "button" href = "#" title = "Smart Read"  style="color:black;background:#e60022; width:150px;display: run-in ;margin:0 5px; padding: 0 5px;text-align:center ;font: 150% Trebuchet MS; border: 1px solid #e60022;-moz-border-radius: 3px;-webkit-border-radius: 3px;border-radius: 3px; height: 20px;">Smart Read</a>'
        );

        // 打包.b-story-body-x div
        $(".b-story-body-x div").wrap("<div id='storycontent'></div>");

        // 获取story文本并格式化；
        // 原#content文本
        storyAll = $("#content").html();

        // 原.b-story-body-x文本
        story = $("#storycontent").html();

        $("#storycontent").empty();

        // 更改默认样式
        $("#w").css({
            width: "70%",
            margin: "0 auto",
            "max-width": "1033px",
            "min-width": "789px"
        });
        $("#b-footer-body").css({
            margin: "0 auto",
            "max-width": "1033px",
            "min-width": "789px",
            width: "70%"
        });
    }

    if (
        // https://read.qidian.com/chapter/ 网站支持
        window.location.href.indexOf("https://read.qidian.com/chapter/") > -1
    ) {
        // 侧边栏添加 听书 按钮
        $(".left-bar-list dl").append(
            '<dd style="background:#e60022;"><a href="javascript:"><i><em class="iconfont">&#xe60f;</em><span id ="btnSmartRead">听书</span></i></a><div class="guide-box"><cite>   </cite></div></dd>'
        );

        // 获取文章内容
        story = $(".read-content")
            .html()
            .replace(/<\/?p data-type="2">/gi, "\n")
            .replace(/<\/p>/gi, "\n")
            .replace(/<span class="content-wrap">/g, "\n")
            .replace(/<i><cite><\/cite><\/i>/g, "\n")
            .replace(/<span class="review-count.*data-segid=\"\d*\">\d*/g, "\n")
            .replace(/<\/span>/g, "\n");

        $(".read-content").empty();
        $(".read-content").append("<div id='storycontent'></div>");
    }

    // hover 事件
    $("#btnSmartRead").hover(
        function() {
            $("#btnSmartRead").css({ color: "white" });
        },
        function() {
            $("#btnSmartRead").css({ color: "black" });
        }
    );

    // 将原文本进行格式化，分割存储；
    var storyArr = story
        .replace(/<div class="hc">[\s\S].*<\/div>/gi, "")
        .replace(/<\/?p>/gi, "\n")
        .replace(/<\/?div>/gi, "\n")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/\n(\n)*( )*(\n)*\n/g, "\n")
        .replace(/\&nbsp;/g, "")
        .split(/\n/);

    // 用于存储格式化后，并移除空行文本数组
    var newStoryArr = [];

    // 移除数组空项（文本空行）
    const countPara = storyArr.length;
    for (var i = 0; i < countPara; i++) {
        storyArr[i] = storyArr[i].replace(/\s+/g, " ").trim();
        if (storyArr[i] != "") {
            newStory += "<p>" + storyArr[i] + "</p>";
            newStoryArr.push(storyArr[i]);
        }
    }

    // 重新加载文章内容，并更改默认样式
    $("#storycontent").append(newStory);
    if (
        // https://read.qidian.com/chapter/ 网站支持
        window.location.href.indexOf("https://read.qidian.com/chapter/") > -1
    ) {
        $("#storycontent").css({
            "font-size": "1em",
            "line-height": "1.5em"
        });
    } else {
        $("#storycontent").css({
            "font-size": "1.5em",
            "line-height": "1.8em"
        });
    }

    $("#storycontent").css({
        "font-family": "sans-serif",
        "font-weight": 300
    });
    const newCountPara = newStoryArr.length;

    // 用于逐段朗读
    var flag = 0;

    // 朗读
    var speaker = new window.SpeechSynthesisUtterance();
    speaker.rate = 1.24;
    speaker.lang = "en-US";
    speaker.voiceURI = "Microsoft Zira Desktop - English (United States)";

    if (
        // https://read.qidian.com/chapter/ 网站支持
        window.location.href.indexOf("https://read.qidian.com/chapter/") > -1
    ) {
        speaker.lang = "zh-CN";
        speaker.voiceURI = "Microsoft Huihui Desktop - Chinese (Simplified)";
        $("#storycontent").css("font-family", "PingFangSC-Regular");
    }

    // 多次尝试再for循环中无法循环朗读，故添加flag步进；利用setInterval进行循环。
    $("#btnSmartRead").click(function() {
        // 复制文章内容到剪贴板
        if (
            // https://read.qidian.com/chapter/ 网站支持
            window.location.href.indexOf("https://read.qidian.com/chapter/") >
            -1
        ) {
            // 功能参考插件Enable Copy：https://bitbucket.org/keakon/enable-copy/src/default/enable.js
            // 非常感谢！Sun Jing。Thanks very much.
            var doc = document;
            var body = doc.body;
            var html = doc.documentElement;
            function allowUserSelect(element) {
                element.setAttribute(
                    "style",
                    "-webkit-user-select: text !important"
                );
                element.setAttribute("style", "user-select: text !important");
                return element;
            }

            function allowUserSelectById(element_id) {
                return allowUserSelect(doc.getElementById(element_id));
            }

            function allowUserSelectByClassName(element_class) {
                var elements = doc.getElementsByClassName(element_class);
                var len = elements.length;
                for (var i = 0; i < len; ++i) {
                    allowUserSelect(elements[i]);
                }
                return elements;
            }

            function clearHandlers() {
                // html.onselectstart = html.oncopy = html.oncut = html.onpaste = html.onkeydown = html.oncontextmenu = html.onmousemove = body.oncopy = body.oncut = body.onpaste = body.onkeydown = body.oncontextmenu = body.onmousedown = body.onmousemove = body.onselectstart = body.ondragstart = doc.onselectstart = doc.oncopy = doc.oncut = doc.onpaste = doc.onkeydown = doc.oncontextmenu = doc.onmousedown = doc.onmouseup = window.onkeyup = window.onkeydown = null;
                // 起点网下列三个设置足以
                html.oncopy = body.oncopy = doc.oncopy = null;
                allowUserSelect(html);
                allowUserSelect(body);
            }
            clearHandlers();

            function defaultHandler(event) {
                event.returnValue = true;
            }

            for (var event_type in ["copy", "cut", "paste"]) {
                // 起点网，以上三个足以；
                // var event_type in ['selectstart', 'copy', 'cut', 'paste', 'keydown', 'contextmenu', 'dragstart']
                html.addEventListener(event_type, defaultHandler);
                body.addEventListener(event_type, defaultHandler);
                doc.addEventListener(event_type, defaultHandler);
            }

            function removeEventAttributes(element) {
                /*
                element.removeAttribute('oncontextmenu');
                element.removeAttribute('ondragstart');
                element.removeAttribute('onselectstart');
                element.removeAttribute('onselect');
                element.removeAttribute('oncopy');
                element.removeAttribute('onbeforecopy');
                element.removeAttribute('oncut');
                element.removeAttribute('onpaste');
                element.removeAttribute('onclick');
                element.removeAttribute('onmousedown');
                element.removeAttribute('onmouseup');
                */
                // 起点网设置这一个足以
                element.removeAttribute("oncopy");
            }

            var jQuery = window.jQuery;

            var $Fn = window.$Fn;
            if ($Fn) {
                try {
                    $Fn.freeElement(doc);
                    $Fn.freeElement(body);
                } catch (e) {}
            }
            /* // 不需要
            var jindo = window.jindo;
            if (jindo) {
            jindo.$A = null;
            }
            */

            function replaceElementEventsWithClone(element) {
                var clone = element.cloneNode();
                while (element.firstChild) {
                    clone.appendChild(element.firstChild);
                }
                element.parentNode.replaceChild(clone, element);
            }

            function replaceElementsEventsWithClone(elements) {
                var length = elements.length;
                for (var i = 0; i < length; ++i) {
                    replaceElementEventsWithClone(elements[i]);
                }
            }

            var url = doc.URL;
            var domain_pattern = /^https?:\/\/([^\/]+)/;
            var result = domain_pattern.exec(url);
            if (result) {
                var domain = result[1];
                if (
                    domain.length > 11 &&
                    domain.substr(-11, 11) == ".lofter.com"
                ) {
                    replaceElementsEventsWithClone(jQuery(".pic>a"));
                    return;
                }

                switch (domain) {
                    case "wenku.baidu.com":
                        jQuery(".doc-reader")
                            .off("copy")
                            .removeAttr("oncopy");
                        jQuery("#reader-container-1").off("copy");
                        break;
                    case "www.qidian.com":
                    case "read.qidian.com":
                    case "vipreader.qidian.com":
                    case "big5.qidian.com":
                    case "www.qdmm.com":
                        var element = doc.getElementById("bigcontbox");
                        if (element) {
                            element.onmousedown = null;
                        }
                        //jQuery(body).off('contextmenu copy cut');
                        // 可使用复制功能
                        jQuery(body).off("copy");
                        break;
                }
                /*
                // 百度文库不能覆盖这些事件
                // 起点会造成无限递归 bug
                if (jQuery) {
                var $doc = jQuery(doc);
                var $body = jQuery(body);
                if ($doc.off) {
                    $doc.off();
                    $body.off();
                    jQuery(window).off();
                    } else {
                    $doc.unbind();
                    $body.unbind();
                    jQuery(window).unbind();
                    }
                }
                */
            }
        }
        // 完成后台复制
        var copyStory = document.createElement("textarea"); //创建textarea对象
        copyStory.id = "copyArea";
        $("#storycontent").prepend(copyStory); //添加元素
        var storyTitle = $("head title").html();
        copyStory.value = storyTitle + "\n" + newStoryArr.join("\n"); // 组合文章标题
        copyStory.focus();
        if (copyStory.setSelectionRange) {
            copyStory.setSelectionRange(0, copyStory.value.length); //获取光标起始位置到结束位置
        } else {
            copyStory.select();
        }
        document.execCommand("Copy", "false", null); //执行复制
        if (document.execCommand("Copy", "false", null)) {
            console.log(
                "已复制文章到剪贴板！Success,The story  has been copied to clipboard！--yoursatan"
            );
        }
        $("#copyArea").remove(); //删除元素

        // 朗读文字数组
        var storyAllRead = newStoryArr;

        // 用于文字选中效果
        var range = document.createRange();
        var selection = window.getSelection();

        // 朗读
        var readStory = function() {
            var reading = setInterval(function() {
                if (!window.speechSynthesis.speaking && flag < newCountPara) {
                    speaker.text = storyAllRead[flag];
                    window.speechSynthesis.speak(speaker);
                    flag += 1;

                    // 朗读段落文字选中效果
                    var referenceNode = document
                        .getElementById("storycontent")
                        .childNodes.item(flag - 1);

                    if (
                        // https://read.qidian.com/chapter/ 网站支持
                        window.location.href.indexOf(
                            "https://read.qidian.com/chapter/"
                        ) > -1
                    ) {
                        // 不需要了，但是remove的用法可以留下来
                        // $("#storycontent p").removeAttr("data-type");
                        // $("span.review-count").remove();
                        // $("span.content-wrap").removeClass("content-wrap");

                        // 起点网朗读效果，当前朗读段落文字变红
                        $("#storycontent p")
                            .eq(flag - 1)
                            .css("color", "red");
                        $("html,body").animate(
                            {
                                scrollTop:
                                    $("#storycontent p")
                                        .eq(flag - 1)
                                        .offset().top -
                                    document.documentElement.clientHeight *
                                        0.382
                            },
                            500 /*scroll实现定位滚动*/
                        ); //代码参考，感谢：https://blog.csdn.net/qq_30109365/article/details/86592336
                        if (flag - 1) {
                            $("#storycontent p")
                                .eq(flag - 2)
                                .css("color", "black");
                        }

                        // 不需要了，但是方法可以留下来
                        // referenceNode = document
                        //   .getElementById("storycontent")
                        //   .childNodes.item(flag - 1).childNodes.item(1);
                    } else {
                        range.selectNodeContents(referenceNode);
                        selection.removeAllRanges();
                        selection.addRange(range);
                        $("html,body").animate(
                            {
                                scrollTop:
                                    $("#storycontent p")
                                        .eq(flag - 1)
                                        .offset().top -
                                    document.documentElement.clientHeight *
                                        0.382
                            },
                            500 /*scroll实现定位滚动*/
                        ); //代码参考，感谢：https://blog.csdn.net/qq_30109365/article/details/86592336
                    }
                } else if (flag >= newCountPara) {
                    // 朗读结束
                    // window.speechSynthesis.cancel();
                    clearInterval(reading);
                    selection.removeAllRanges();
                    if (
                        // https://read.qidian.com/chapter/ 网站支持
                        window.location.href.indexOf(
                            "https://read.qidian.com/chapter/"
                        ) > -1
                    ) {
                        $("#storycontent p")
                            .eq(flag - 1)
                            .css("color", "black");
                    }
                    flag = 0;
                    alert("The story is finished");
                }
            }, 500);

            // 监听键盘：Esc/F5
            $(document).keyup(function(event) {
                if (event.keyCode == 27 || event.keyCode == 116) {
                    window.speechSynthesis.cancel();
                    clearInterval(reading);
                    selection.removeAllRanges();
                    if (
                        // https://read.qidian.com/chapter/ 网站支持
                        window.location.href.indexOf(
                            "https://read.qidian.com/chapter/"
                        ) > -1
                    ) {
                        $("#storycontent p")
                            .eq(flag - 1)
                            .css("color", "black");
                    }
                    flag = 0;
                }
            });

            // 监听键盘：空格键
            $(document).keypress(function(event) {
                if (event.keyCode == 32) {
                    if (window.speechSynthesis.speaking) {
                        window.speechSynthesis.pause();
                    }
                    if (window.speechSynthesis.paused) {
                        window.speechSynthesis.resume();
                    }
                }
            });

            // 监听标签关闭事件
            window.onbeforeunload = function(e) {
                clearInterval(reading);
                window.speechSynthesis.cancel();
            }
        };
        readStory();
    });
})();
