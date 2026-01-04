// ==UserScript==
// @name         解析91
// @version      1.5.1
// @description  次数是无限的，但精力是有限的。
// @author       shopkeeperV
// @include      *://*91p*n.com/*
// @include      https://www.vlogdownloader.com/*
// @namespace    https://greasyfork.org/users/673056-cuizhenhua
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/411082/%E8%A7%A3%E6%9E%9091.user.js
// @updateURL https://update.greasyfork.org/scripts/411082/%E8%A7%A3%E6%9E%9091.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;

    if (!/vlogdownloader/.test(url)) {
        $("body>div:eq(2)").remove();
        setTimeout(removeAd, 500);
    }

    function removeAd() {
        $("iframe").remove();
        if (/Android/i.test(navigator.appVersion)) {
            $(".gotop").remove();
        }
    }

    if (/view_video/.test(url) && !(/vlogdownloader|view_video_hd/.test(url))) {

        var styles = 'font-size:20px;font-weight:bold;color:#ff8800;cursor:pointer;';
        var border = 'border: 1px solid;margin-right:10px;padding:3px;';

        var err_msg = '';
        try {
            var video_src = $("#player_one_html5_api source")[0].src;
            //视频自适应大小
            var video = '<div style="width:100%;position:relative;padding-bottom:56.25%;height:0px;"><video src="' +
                video_src +
                '" controls autoplay loop style="position:absolute;top:0;left:0;width:100%;height:100%;"></video></div>';
            $(".video-container").html(video);
            err_msg = '<div style="' + styles + '">出现重复声音关闭adblock即可<br/>不出视频多刷新几次试试<br/>视频右下角可下载视频<br/>速度慢可尝试更换服务器</div>';
        } catch (err) {
            err_msg = '<div style="' + styles + '">无法播放<br/>请先登陆或使用解析</div>';
        }
        $(".video-container").css("background-color", "black");
        if (/Android/i.test(navigator.appVersion)) {
            $(".video-container").after(err_msg);
        } else {
            $("#row").prepend(err_msg, "<p/>");
            $("#row>br").remove();
        }

        var btn_analysis = '<span id="btn_analysis" style="' + styles + border + '">解析</span>';
        var btn_copy = '<span id="btn_copy" style="' + styles + border + '">点我复制标题</span>';
        var btn_server = '<span id="btn_server" style="' + styles + border + '">更换服务器</span>';
        var btn_declare = '<span id="btn_declare" style="' + styles + border + '">使用说明</span>';
        var btn_more = '<span id="btn_more" style="' + styles + border + '">查看该作者的其他作品</span>';
        var msg = '<div id="msg" style="' + styles + 'margin-top:5px;"></div>';
        var msg_content = '使用本插件可在已登陆的情况下无限播放和下载<br/>' +
            '已启动自动播放和自动循环播放功能<br/>' +
            '未登陆用户可点击解析按钮前往解析站播放<br/>' +
            '点击视频右下角的三点或前往解析站可以下载本视频';

        $("#search_form").after("<div id='mydiv' style='margin-bottom:10px'></div>");
        $("#mydiv").append(btn_analysis, btn_copy, btn_more, btn_server, btn_declare, msg);
        $("#msg").html(msg_content);
        if (/Android/i.test(navigator.appVersion)) {
            $("#mydiv>span:eq(1)").after("<p/>");
            $("#mydiv>span:eq(2)").after("<p/>");
            $("#msg").html(msg_content.replace(/<br\/>/g, "&ensp;"));
            $("#msg").css("text-align", "left");
        }

        $("#msg").hide();

        $("#btn_analysis").click(function() {
            window.open("https://www.vlogdownloader.com/#" + url);
        });

        $("#btn_copy").click(function() {
            var title = $("h4[class=login_register_header]:eq(0)").text().replace(/^\s+|\s+$/g, "");
            var director = $("span[class=title]:eq(0)").text();
            var input = document.createElement("input");
            input.value = title + "-" + director;
            document.body.appendChild(input);
            input.select();
            document.execCommand("Copy");
            input.style.display = "none";
        });

        $("#btn_declare").hover(function() {
            $("#msg").show();
        }, function() {
            $("#msg").hide();
        });

        $("#btn_server").click(function() {
            window.open("http://www.91porn.com/speed.php");
        });

        $("#btn_more").click(function() {
            var uprofile = $(".title-yakov:eq(2)>a:first").prop("href");
            var index = uprofile.lastIndexOf("=");
            var uid = uprofile.substring(index);
            window.location.href = "http://www.91porn.com/uvideos.php?UID" + uid + "&type=public";
        });

        //下载提示
        var down_msg = $("div[class=floatmenu]:eq(3)");
        down_msg.html("视频右下角下载");
        down_msg.css("color", "red");
    } else if (/login/.test(url) || /index/.test(url)) {
        var innerHtml = $(".pull-right:eq(0) li:eq(0)").html();
        if (/profile/.test(innerHtml)) {
            window.location.href = "http://www.91porn.com/v.php?category=rf";
        }
    } else if (/vlogdownloader.*view/.test(url)) {
        $("button:eq(2)").click();
    } else if (/vlogdownloader.*html/.test(url)) {
        $("#exampleModal").attr("data-backdrop", "static");
        $(".btn.btn-primary:eq(1)").click();
    } else if (/vlogdownloader.*code=40*/.test(url)) {
        window.history.back();
    }
})();