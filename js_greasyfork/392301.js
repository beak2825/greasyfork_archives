// ==UserScript==
// @name         知乎答案内容获取并保存为Markdown文件
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @require      https://unpkg.com/turndown/dist/turndown.js
// @description  将知乎问题下的答案提取出来在下载为markdown文件
// @description  可一键浏览以及下载，也可以手动浏览和下载
// @version      1.0
// @author       Hao
// @match        https://www.zhihu.com/question/*
// @namespace    https://github.com/HawkTom
// @copyright    2019, Hao
// @downloadURL https://update.greasyfork.org/scripts/392301/%E7%9F%A5%E4%B9%8E%E7%AD%94%E6%A1%88%E5%86%85%E5%AE%B9%E8%8E%B7%E5%8F%96%E5%B9%B6%E4%BF%9D%E5%AD%98%E4%B8%BAMarkdown%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/392301/%E7%9F%A5%E4%B9%8E%E7%AD%94%E6%A1%88%E5%86%85%E5%AE%B9%E8%8E%B7%E5%8F%96%E5%B9%B6%E4%BF%9D%E5%AD%98%E4%B8%BAMarkdown%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let turndownService = new TurndownService();
    var btn = "<div class=\"CornerAnimayedFlex\"><button id=\"save_button\" data-tooltip=\"保存已有答案\" type=\"button\" class=\"Button CornerButton Button--plain\">HS</button></div>";
    var oneBtn = "<div class=\"CornerAnimayedFlex\"><button id=\"one_key\" data-tooltip=\"一键搞定\" type=\"button\" class=\"Button CornerButton Button--plain\">OK</button></div>";
    var AutoBtn = "<div class=\"CornerAnimayedFlex\"><button id=\"auto_key\" data-tooltip=\"自动浏览\" type=\"button\" class=\"Button CornerButton Button--plain\">AT</button></div>";
    var isGo = true;
    var autoRead;
    jQuery(document).ready(function($) {

        $(".CornerButtons").append(btn)
        $(".CornerButtons").append(oneBtn)
        $(".CornerButtons").append(AutoBtn)

        // 分析已有内容，转化为Markdown保存

        function saveMD(){
            var len = $(".List-item").length;
            var y = $(".List-item");
            var content = ""
            for (var i=0; i<len; i++){
                var tmp=y[i].getElementsByClassName("RichText ztext CopyrightRichText-richText")[0]
                var author = JSON.parse((y[i].children)[0].getAttribute("data-zop"))
                //                 console.log(author.authorName)
                let markdown = turndownService.turndown(tmp);
                markdown = markdown.replace(/<img.+?>/g, "");
                content = content + "\n\n ## " + author.authorName + "\n\n" + markdown
            };
            var x = $(".QuestionPage")[0]
            var filename = x.children[0].content + '.md'
            exportRaw(filename, content)
        }

        // 自动浏览
        $("#auto_key").click(function(){
            //             console.log(isGo)
            if (isGo){
                autoRead = setInterval(function (){
                    var pos = $("html").scrollTop();
                    $("html").scrollTop(pos+200);
                    $(".ListShortcut").scroll();
                    //console.log(pos)
                }, 100);
            }else{
                clearInterval(autoRead);
            }
            isGo = !isGo;
        });

        // 一键搞定所有
        $("#one_key").click(function(){
            var scrollDown = setInterval(function (){
                var pos = $("html").scrollTop();
                $("html").scrollTop(pos+200);
                $(".ListShortcut").scroll();
                //console.log(pos)
            }, 100);

            $(".ListShortcut").scroll(function(){
                //console.log("123456...")
                var x = $(".QuestionPage")[0]
                var answerCount = x.children[3].content
                var answerShow = $(".List-item").length;
                //console.log(answerCount + " << -- >>" + answerShow)
                if ( answerShow == answerCount){
                    clearInterval(scrollDown);
                    for (var i=0; i<5; i++){
                        $("html").scrollTop($("html").scrollTop()+500);
                    };
                    saveMD();
                    document.getElementById("one_key").disabled = true;
                }
            });

        });

        // 随时保存按钮
        $("#save_button").click(function(){
            saveMD();
        });
    });

    // 将获取内容保存到文件下载到本地
    function fakeClick(obj) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, document.defaultView, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
        obj.dispatchEvent(evt);
    };

    function exportRaw(name, data) {
        var urlObject = window.URL || window.webkitURL || window;
        var export_blob = new Blob([data]);
        var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = name;
        console.log(save_link)
        fakeClick(save_link);
    };
})();













