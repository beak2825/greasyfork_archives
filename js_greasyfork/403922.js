// ==UserScript==
// @icon    https://vv.bdstatic.com/static/videoui/img/favicon-4_f4b9465.ico
// @name         好看视频下载助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       刘宝盛
// @match        *://haokan.baidu.com/v*
// @grant        GM_addStyle
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/403922/%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/403922/%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //与元数据块中的@grant值相对应，功能是生成一个style样式
    GM_addStyle('#down_video_btn{color:#fa7d3c;}');

    $(function () {
        //获取播放器（video）对象
        var video = $("video");
        var video_url = null;
        if (video) {
            video_url = video.attr("src"); //获取视频链接地址
        }
        console.log(video_url);

            //视频下载按钮的html代码
        var down_btn_html = '<span >';
        down_btn_html += '<a href="'+video_url+'" id="down_video_btn" title="视频下载">视频下载';
        down_btn_html += '</span>';

        //将以上拼接的html代码插入到网页里的ul标签中
        var ul_tag = $("div.videoinfo-text");
        if (ul_tag) {
            ul_tag.append(down_btn_html);
        }

    });
})();