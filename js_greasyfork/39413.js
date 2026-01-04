// ==UserScript==
// @icon            http://weibo.com/favicon.ico
// @name            downloadtool
// @namespace       
// @author          
// @description     下载视频
// @match           *://weibo.com/tv/v/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         0.0.1
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/39413/downloadtool.user.js
// @updateURL https://update.greasyfork.org/scripts/39413/downloadtool.meta.js
// ==/UserScript==
(function () {
    'use strict';
 
    //与元数据块中的@grant值相对应，功能是生成一个style样式
    GM_addStyle('#down_video_btn{color:#fa7d3c;}');
 
    //视频下载按钮的html代码
    var down_btn_html = '<li>';
    down_btn_html += '<a href="javascript:void(0);" id="down_video_btn" class="S_txt2" title="视频下载">';
    down_btn_html += '<span class="pos">';
    down_btn_html += '<span class="line S_line1" node-type="comment_btn_text">';
    down_btn_html += '<span>';
    down_btn_html += '<em class="W_ficon ficon_video_v2 S_ficon">i</em>';
    down_btn_html += '<em>视频下载</em>';
    down_btn_html += '</span>';
    down_btn_html += '</span>';
    down_btn_html += '</span>';
    down_btn_html += ' <span class="arrow"><span class="W_arrow_bor W_arrow_bor_t"><i class="S_line1"></i><em class="S_bg1_br"></em></span></span>';
    down_btn_html += ' </li>';
 
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