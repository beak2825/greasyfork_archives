// ==UserScript==
// @name              Gitlab Wiki Player
// @name:zh-cn        Gitlab WIKI 播放器
// @namespace         http://chengxuan.li
// @version           13.12.8
// @description       Play Gitlab wiki like PPT!
// @description:zh-cn 像PPT一样播放Gitlab WIKI
// @author            Leelmes <i@chengxuan.li>
// @match             http*://*/*/wikis/*
// @match             http*://*/*/merge_requests/*
// @match             http*://*/*/snippets/*
// @match             http*://*/*/issues/*
// @include           http*://*/-/blob/*/*.md
// @contributionURL   https://www.paypal.me/flyhope
// @grant             none
// @supportURL        https://github.com/flyhope/gitlab-script/issues
// @license           GNU General Public License v3.0 or later
// @downloadURL https://update.greasyfork.org/scripts/371351/Gitlab%20Wiki%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/371351/Gitlab%20Wiki%20Player.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // WIKI每页数据
    let wikis = [];

    // WIKI DOM对象
    let $wiki = $(".md[data-qa-selector=wiki_page_content]")

    // 当前看的是第几页（从0开始计算）
    let current = -1;

    // 检测是否可以执行
    if (typeof jQuery !== "undefined" && $("header.navbar-gitlab").length) {
        main();
    }

    // 主入口
    function main() {
        // WIKI：插入播放按钮
        $(".nav-controls").prepend('<a id="wiki-ppt-play" class="btn" href="javascript:void(0)">🍨</a>');
        // MergeRequest、ISSUE：插入播放按钮
        $(".detail-page-header-actions a.btn:first").before('<a id="wiki-ppt-play" class="btn btn-grouped" href="javascript:void(0)">🍨</a>');
        $(".detail-page-header-actions > button:first").after('<a id="wiki-ppt-play" class="btn btn-grouped" href="javascript:void(0)">🍨</a>');
        // Blob：插入播放按钮
        $(".tree-controls").prepend('<a id="wiki-ppt-play" class="btn" href="javascript:void(0)">🍨</a>');

        // 绑定PPT按钮播放事件
        $("#wiki-ppt-play").click(function() {
            play();
        });

        // 绑定H1/H2标题播放按钮
        $wiki.on("click", "[data-node=wiki-ppt-play-page]", function() {
            $(this).remove();
            play($(this).data("index"));
        }).find("h1,h2").each(function(k, v) {
            let obj = $(v)
            obj.hover(function(){
                obj.append(' <a data-node="wiki-ppt-play-page" data-index="' + k + '" href="javascript:void(0)">🍨</a>');
            }, function() {
                obj.find("[data-node=wiki-ppt-play-page]").remove();
            })
        });
    }

    // 执行播放操作
    function play(show_index = 0) {
        // 删除WIKI除主体外全部元素
        $("#feedly-mini,aside,header,.nav-sidebar,.wiki-page-header,.alert-wrapper").remove();
        $(".content-wrapper").removeClass("content-wrapper");
        $(".layout-page").removeClass("page-with-contextual-sidebar right-sidebar-expanded").css("padding-left", 0);

        // 删除mergeRequest除主体外全部元素，调整吸顶
        let mergeRequestTimer;
        let mergeRequestShow = () => {
            if ($(".file-title").length) {
                $(".alert-wrapper,.detail-page-header,.mr-state-widget,.merge-request-tabs-holder,.mr-version-controls").remove();
                $(".file-title").css("top", 0);
                clearInterval(mergeRequestTimer)
            }
        }

        // MergeRequest调整
        if (location.href.search("/merge_requests/") > 0) {
            if ($("#diffs-tab.active").length) {
                mergeRequestShow()
            } else {
                $("#diffs-tab a").trigger("click")
                mergeRequestTimer = setInterval(mergeRequestShow, 200)
            }
        }

        // 删除ISSUE讨论区，并全屏
        if (location.href.search("/issues/") > 0) {
            let $style = $('<style type="text/css">.issue-sticky-header{ display:none }</style>')
            $("head").append($style)
            $(".emoji-block,.issuable-discussion,.flash-container").remove();
            fullScreen()
        }

        // 删除blob所有内容，调整样式，并全屏
        if (location.href.search("/-/blob/") > 0) {
            $(".nav-block,.info-well,.js-file-title").remove();
            $(".container-fluid").removeClass("container-fluid");
            $(".file-content").css("padding", "8px");
            fullScreen()
        }

        if ($wiki.length) {
            // 整理数据，并清空现有WIKI数据结构
            if (!wikis.length) {
                $wiki.children().each(function(k, v){
                    let index = wikis.length - 1;
                    let newIndex = false;
                    if (index < 0) {
                        index = 0;
                        newIndex = true;
                    }
                    if (v.tagName === "H2") {
                        if (typeof wikis[index] !== "undefined") {
                            index++;
                        }
                        newIndex = true;
                    }

                    if (newIndex) {
                        wikis[index] = [];
                    }

                    wikis[index].push(v)
                })
            }

            // 开始播放
            $wiki.empty();
            show(show_index)
            fullScreen()
        }

        // 绑定按键
        $("body").keydown(function(e){
            switch (e.which) {
                case 37 :
                    prev();
                    break;
                case 39 :
                    next();
                    break;
            }
        });

    }

    // 下一页
    function next() {
        if (wikis.length >= current + 2) {
            show(current + 1);
        }
    }

    // 上一页
    function prev() {
        if (current > 0) {
            show(current - 1);
        }
    }

    // 展示内容
    function show(index) {
        console.log(wikis)
        current = index;
        $wiki.html("").hide().css({"padding-top":"30px"}).append(wikis[index])
        $wiki.show();
        $("body,html").scrollTop(0);
        $("h1,h2").css({
            "position":"fixed",
            "z-index":9999,
            "top":0,
            "left":0,
            "width":"100%",
            "padding":"6px 15px 8px 15px",
            "background-color":"black",
            "color":"white"
        });
    }

    // 全屏
    function fullScreen() {
        let element = document.documentElement;
        if(element.requestFullscreen) {
            element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        $("body").css("zoom", "2");
    };
})()
