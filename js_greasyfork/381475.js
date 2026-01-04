// ==UserScript==
// @name         微博视频下载助手
// @namespace    [url=mailto:jiance520@163.com]jiance520@163.com[/url]
// @version      0.0.1
// @icon         http://weibo.com/favicon.ico
// @description  下载微博视频
// @author       f8xn
// @supportURL   https://www.f8xn.top
// @match        *://weibo.com/tv/v/*
// @match        *://weibo.com/tv/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/381475/%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/381475/%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';
    //与元数据块中的@grant值相对应，功能是生成一个strle样式
    GM_addStyle('#down_video_btn{color:#fa7d3c;}');
    //视频下载按钮的html代码
    //<em class="W_ficon ficon_repeat S_ficon">i</em>中间的i是图标样式
    var down_btn_html = '<li>\n' +
        '    <a href="javascript:void(0);" class="S_txt2" id="down_video_btn" title="视频下载">\n' +
        '        <span class="pos">\n' +
        '            <span class="line S_line1" node-type="comment_btn_text"><span>\n' +
        '                <em class="W_ficon ficon_repeat S_ficon">i</em>\n' +
        '                <em>视频下载</em>\n' +
        '            </span>\n' +
        '            </span>\n' +
        '        </span>\n' +
        '    </a>\n' +
        '    <span class="arrow">\n' +
        '        <span class="W_arrow_bor W_arrow_bor_t">\n' +
        '            <i class="S_line1"></i>\n' +
        '            <em class="S_bg1_br"></em>\n' +
        '        </span>\n' +
        '    </span>\n' +
        '</li>';

    //将以上拼接的html代码插入到网页里的ul标签中
    var ul_tag = $("div.WB_handle>ul");
    if (ul_tag) {
        ul_tag.removeClass("WB_row_r3").addClass("WB_row_r4").append(down_btn_html);
    }

    var videoTool = {
        //获取文件名
        getFileName: function (url, rule_start, rule_end) {
            var start = url.lastIndexOf(rule_start) + 1;
            var end = url.lastIndexOf(rule_end);
            return url.substring(start, end);
        },
        //弹出下载框
        download: function (videoUrl, name) {
            var content = "file content!";
            var data = new Blob([content], {
                type: "text/plain;charset=UTF-8"
            });
            var downloadUrl = window.URL.createObjectURL(data);
            var anchor = document.createElement("a");
            anchor.href = videoUrl;
            anchor.download = name;
            anchor.click();
            window.URL.revokeObjectURL(data);
        }
    };

    $(function () {
        //获取播放器（video）对象
        var video = $("video");
        var video_url = null;
        if (video) {
            video_url = video.attr("src"); //获取视频链接地址
        }

        //执行下载按钮的单击事件并调用下载函数
        $("#down_video_btn").click(function () {
            if (video_url) {
                videoTool.download(video_url, videoTool.getFileName(video_url, "/", "?"));
            }
        });
    });
})();