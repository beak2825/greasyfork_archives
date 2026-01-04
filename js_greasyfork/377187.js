// ==UserScript==
// @name         萌娘百科增强插件
// @namespace    https://swsoyee.github.io
// @version      0.1.0
// @description  鼠标悬浮于超链接显示该条目内容（同维基百科）。
// @author       InfinityLoop
// @icon         https://img.moegirl.org/common/thumb/d/d1/%E5%A4%A7%E8%90%8C%E5%AD%97.png/146px-%E5%A4%A7%E8%90%8C%E5%AD%97.png
// @require      http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @require      https://unpkg.com/tippy.js@3/dist/tippy.all.min.js
// @include      *moegirl.org/*
// @compatible   chrome
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/377187/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/377187/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 功能1：删除碍事的“你知道的太多了”悬浮
    $(".heimu").attr("title", "")

    GM_addStyle(`.tippy-tooltip.light-theme {color: #26323d; box-shadow: 0 0 20px 4px rgba(154, 161, 177, 0.15), 0 4px 80px -8px rgba(36, 40, 47, 0.25), 0 4px 4px -2px rgba(91, 94, 105, 0.15); background-color: white; &[data-animatefill] {background-color: transparent;}}`)
    GM_addStyle(`.tippy-tooltip.light-theme .tippy-roundarrow {fill: white;}`)
    // 功能2：直接读取站内链接内容
    const INITIAL_CONTENT = "加载中...";
    // 获取所有站内链接地址
    $(".mw-body").find("a[href^='\/']").map(function(i, v) {
        var url = "https://zh.moegirl.org" + $(this).attr("href");
        // 如果页面不存在
        if( $(this).attr("class") == "new" || $(this).attr("class") == "image" || /Special|Category|Help/.test($(this).attr("href"))) {
        } else {
            $(this).attr("id", "popup" + i);
            $(this).attr("title", "");
            tippy("#popup" + i, {
                content: INITIAL_CONTENT,
                delay: 600,
                arrow: true,
                placement: "right-start",
                arrowType: "round",
                theme: "light",
                interactive: true,
                async onShow(tip) {
                    if (!tip.state.ajax) {
                        tip.state.ajax = {
                            isFetching: false,
                            canFetch: true,
                        }
                    }
                    if (tip.state.ajax.isFetching || !tip.state.ajax.canFetch) {
                        return
                    }
                    tip.state.ajax.isFetching = true
                    tip.state.ajax.canFetch = false
                    try {
                        $.ajax({
                            type : "GET",
                            url : url,
                            dataType : "html",
                            success: function(data) {
                                var reg = /[\s\S]*<\/body>/g;
                                var html = reg.exec(data)[0];
                                var output = ""
                                var image = $(html).find("table:first").find("img").attr("src")
                                // 如果子页面没有图片则不显示图片
                                if (image != undefined ) {
                                    image = `<div><img src='${image}' onload='if (this.height > 300) this.height=300;'></img></div>`
                                } else {
                                    image = ""
                                }
                                // 获取子页面TOC部分前的内容
                                $(html).find("div#toc.toc").prevAll("p").each(function(){
                                    if ( $(this).text().length > 1 ) {
                                        output += $(this).html()
                                    }
                                });
                                // 如果子页面没有TOC
                                if( output == "" ) {
                                    $(html).find("#bodyContent").find("div.mw-parser-output > h2:first").prevAll("p").each(function(){
                                    if ( $(this).text().length > 1 ) {
                                        output += $(this).html()
                                    }
                                });
                                }
                                // 追加到悬浮窗口内
                                tip.setContent(`<div style='text-align:left;'>${output}</div>${image}`);
                            },
                            error : function() {
                                console.log("无法获取页面信息");
                            }
                        });
                    } catch (e) {
                        tip.setContent(`获取失败：${e}`)
                    } finally {
                        tip.state.ajax.isFetching = false
                    }
                },
                onHidden(tip) {
                    tip.state.ajax.canFetch = true
                    tip.setContent(INITIAL_CONTENT)
                },
            })
        }
    })

})();