// ==UserScript==
// @name         新浪微博视频下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       hitori-Jnai
// @match        https://weibo.com/tv/v/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/378987/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/378987/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;

    //alert("helllo world");直接就运行了.
    $(function(){
        // 1.获取播放器（video）对象
        var video = $("video");
        var video_url = null;
        if (video) {
            video_url = "http:" +  video.attr("src"); //获取视频链接地址
            console.log("url: "+video_url);
        }

        //2.视频下载按钮的html代码
        var down_btn_html ='\
<li>\
<a href="javascript:void(0);" class="S_txt2" id="down_video_btn" title="视频下载">\
<span class="pos">\
<span class="line S_line1">\
<span node-type="like_status" class="">\
<em class="W_ficon ficon_praised S_txt2"></em>\
<em>视频下载</em></span>\
</span>\
</span>\
</a>\
<span class="arrow">\
<span class="W_arrow_bor W_arrow_bor_t">\
<i class="S_line1"></i>\
<em class="S_bg1_br"></em>\
</span>\
</span>\
</li>\
';
        //3.网页中插入按钮
        var ul_tag = $("div.WB_handle>ul");
        if (ul_tag) {
            ul_tag.removeClass("WB_row_r3").addClass("WB_row_r4").append(down_btn_html);
        }
        //与元数据块中的@grant值相对应，功能是生成一个style样式
        //GM_addStyle('#down_video_btn{color:#fa7d3c;}');

        //4.getName 下载
        var downloader = {

            getFileName: (url, rule_start, rule_end) => {
                var start = url.lastIndexOf(rule_start) + 1;
                var end = url.lastIndexOf(rule_end);
                return url.substring(start, end);
            },
            headers: {
                "Host": "f.us.sinaimg.cn",
                "Connection": "keep - alive",
                "Accept - Encoding": "identity;q = 1,*;q = 0",
                "User - Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
                "chrome - proxy": "frfr",
                "Accept": "*/*",
                "Referer": "https://weibo.com/tv/v/FxUpOEzBQ?from=movie",
                "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                "Range": "bytes=0-"
            },
            download:function(url, fName){
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: this.headers,
                    responseType: 'blob',
                    onload: response => {
                        console.log(response.status);
                        console.log(response.responseHeaders);
                        var a = document.createElement("a");
                        a.href = window.URL.createObjectURL(response.response);
                        a.download =fName || downloader.getFileName(url, "/", "?");
                        a.click();
                        window.URL.revokeObjectURL(a.href);
                    }
                });
            }
        };
        //5.给按钮添加click事件,加上链接
        $("#down_video_btn").click(function () {
            if (video_url) {
                console.log(video_url);
                var filename = downloader.getFileName(video_url, "/", "?");
                //"#down_video_btn").prop({href:video_url,download:filename});
                
                downloader.download(video_url);
            }else {
                alert("没找到下载链接");
            }
        });
    });
})();

















