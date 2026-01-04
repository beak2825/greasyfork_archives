// ==UserScript==
// @name         Youtube生肉煮熟工具
// @namespace    https://space.bilibili.com/6041757
// @author       Miracle
// @version      0.2
// @description  在Youtube视频下添加下载视频，以及下载字幕的按钮（原生字幕+机翻字幕）
// @match        *://www.youtube.com/*
// @match        *://zhuwei.me/y2b/*
// @match        *://www.clipconverter.cc/*
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/404609/Youtube%E7%94%9F%E8%82%89%E7%85%AE%E7%86%9F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/404609/Youtube%E7%94%9F%E8%82%89%E7%85%AE%E7%86%9F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
if ("undefined" == typeof(youtube_tool)) {
    var youtube_tool = {
        //初始化当前链接
        currentMediaUrl: null,
        //拿参数
        getParam: function(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) {
                    return pair[1];
                }
            }
            return (false);
        },
        //添加按钮
        addButtons: function(document) {
            var icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM5NDU0RDIwRDQ1RjExREZBNkU3Q0FCMkU2OUIzNDYwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM5NDU0RDIxRDQ1RjExREZBNkU3Q0FCMkU2OUIzNDYwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Mzk0NTREMUVENDVGMTFERkE2RTdDQUIyRTY5QjM0NjAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Mzk0NTREMUZENDVGMTFERkE2RTdDQUIyRTY5QjM0NjAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5hHYvlAAAC9ElEQVR42nxTTUhUURQ+99434+ToODM2jRZDauJikiIoi4qiRdCiRRFEVBgR/cBAtApqUYugXZsKhBYuJCIrCGonSYiCi4JCrIhQkf7U9M2bcd68n/vXec8xgqAL37vnnnvP975zzr2kUChAMCilkEgkQsTj8XrG2B1091Wr1QnHcUBKCcFsWRbYtg2EkJU4+HfEhBB3Xdc9hcEJzjn8bxh/L5A15fv+A8/zDuPSQtxD35LWegLxFO3x/xFk8a8PUeZetIs1Xw7RjoG7cT6DuI/2LYRYTcFQnhcanNIM5taNGz4udSAIP6Jmc9Ca4d51VEKUUjf+KKg0pVcSN39N2pXKCV/KfuReiy4boYgQJayw0JTGcR2QXMWCDiNGwrTzIx9AUQYb341CevglFB1nGxdyAIPamJLnIZ15TX2XGWWriRuR9RLIBVQhkOBUQMDWnS2gVk2LuQ6tpIDI99k5p1Qa85Z+bbW37HhkXr75w8ltWvaS6XlqLs6QxfnnNhet2KmviArLnLkEyhdHiZSZcmtu1sxvB96yYUFPfX7hd2+f9bu23hbMOGh3bR6qtuRAO46m32bfSqVsVKJZ8lgvyKrTLMqVfuwjaMMQYmNHhO/c78nshgwvWsf5UukcUyItE8khqzOvlefq2NcpHdagbXA4vFX+YvGZ5vIYiRoVwqgFhuGDVI3adRuU1HiExIxU4wDEohe5z92IuYD90dhGRcJOSe5fE2apB7ly6I8F5GEXsAPBjIcdv2j2GukkIQ31vbw5ixU0gLnv34DCI7Q5ayrOx3h5eY9yqlnlehSlEuk6GqGk60ZU1WGSyydQFx/lM9Pgf/4IZPUxRDvzEO05ADKWWEsaUqdBeoewWR3guWkNOgWROoFqrjCQfXLmE3jjr0AtW0BYjUDXNJM1caDtecDfE8kia2h+V5+m0dN0fuak/DIxqL5P/zkbFhEJgnwbEXW1txFwUh1wMqMK+44UiDn3EybHH+ObbgjrEVxtgArC+S3AAPFbkuCGsMvQAAAAAElFTkSuQmCC';
            var clipconverterpath = "https://www.clipconverter.cc/?ref=addon&url=" + encodeURIComponent(document.URL);
            var zhuweipath = "https://zhuwei.me/y2b/?v=" + youtube_tool.getParam("v");
            var div_vid = null;
            var div_sub = null;
            if (document.getElementById('meta-contents')) {
                div_vid = document.getElementById('meta-contents').querySelector('#top-row ytd-video-owner-renderer.ytd-video-secondary-info-renderer #sponsor-button');
                div_vid.innerHTML += ' <a href="' + clipconverterpath + '" target="_blank" style="text-decoration: none; color: inherit;" class="style-scope ytd-subscribe-button-renderer"><paper-button subscribed id="vid_down" style="float:right" class="ytd-subscribe-button-renderer"><img  style="vertical-align: bottom;" src="' + icon + '"> <strong>下载视频</strong></paper-button></a>' + div_vid.innerHTML;
                div_sub = document.getElementById('meta-contents').querySelector('#top-row ytd-video-owner-renderer.ytd-video-secondary-info-renderer #analytics-button');
                div_sub.innerHTML += ' <a href="' + zhuweipath + '" target="_blank" style="text-decoration: none; color: inherit;" class="style-scope ytd-subscribe-button-renderer"><paper-button subscribed id="sub_down" style="float:right" class="ytd-subscribe-button-renderer"><img  style="vertical-align: bottom;" src="' + icon + '"> <strong>下载字幕</strong></paper-button></a>' + div_sub.innerHTML;
            }
        },
        //判断在网站
        StartJS: function() {
            if (document.body && document.domain == 'www.youtube.com') {
                setInterval(youtube_tool.Check, 500);
                youtube_tool.Check();
            } else if (document.body && document.domain == 'zhuwei.me') {
                youtube_tool.AutoFill();
                //alert("点击获取字幕来进行操作！")
                if (youtube_tool.getParam("v")) {
                    document.getElementsByClassName("btn-primary")[0].click();
                } else {
                    //啥都不发生
                }

            } else if (document.body && document.domain == 'www.clipconverter.cc') {
                alert("选择分辨率后点击Start进行压制，压制成功后点击Download下载视频！")
                /*document.getElementById("submitconvert").style = "display:none"
                if(!document.cookie.split('; ').find(row => row.startsWith('doSomethingOnlyOnce'))){
                if(confirm("是否启用自动下载默认画质功能？")){
                document.getElementById("submitconvert").style = ""
                    document.cookie = "defaultDownload=true"
                }else{
                document.getElementById("submitconvert").style = ""
                    document.cookie = "defaultDownload=flase"
                }
                    document.cookie = "doSomethingOnlyOnce=true";
                }else{
                document.getElementById("submitconvert").style = ""
                }
               if(document.cookie.split('; ').find(row => row.startsWith('defaultDownload'))){
               addEventListener("load",function(){
               //alert("默认且加载完");
                   document.getElementById("submitconvert").getElementByClassName("button")[0].click();
               })
               }*/
                //有空再写
            }
        },
        AutoFill: function() {
            //alert(youtube_tool.getParam("v"));//测试下能不能拿到参数
            var v = youtube_tool.getParam("v")
            //alert(v);
            if (v) {
                //alert("有参数");
                document.getElementById('youtubeform').youtubeURL.value = "youtube v=" + v;
            } else {
                //alert("没参数");
            }

        },
        //检测用户是否切换视频
        Check: function() {
            //切换
            if (youtube_tool.currentMediaUrl != document.URL) {
                youtube_tool.currentMediaUrl = document.URL;
                if (document.getElementById('vid_down')) {
                    document.getElementById('vid_down').outerHTML = "";
                    document.getElementById('sub_down').outerHTML = "";
                }
            }
            //第一次打开
            if (!document.getElementById('vid_down')) {
                youtube_tool.addButtons(document);
            }

        }
    };
}
youtube_tool.StartJS(); //开始脚本
