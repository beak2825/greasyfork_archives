// ==UserScript==
// @icon            https://appstatic.yaseok.com/static/src/images/favicon.ico
// @name            亚瑟解析器
// @namespace       [url=yashee888[/url]
// @author          fuliba
// @description     播放视频
// @include            *yase*.com/video-*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         0.0.8
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/389847/%E4%BA%9A%E7%91%9F%E8%A7%A3%E6%9E%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/389847/%E4%BA%9A%E7%91%9F%E8%A7%A3%E6%9E%90%E5%99%A8.meta.js
// ==/UserScript==
(function () {
    'use strict';

    //获取解析网址
    var m3u8 = m3u8_url;
    var new_domain = document.domain;
    var id= window.location.href.split("-")[1];
    var url = "https://" + new_domain + "/index/req/getPlayerDomain?id=1102309";
    $.get(url, function (data, status) {
        console.log(data['domain_dan']);
        m3u8 = m3u8.replace("[domain_dan]", data['domain_dan']);
        console.log(data['domain_shuang']);
        m3u8 = m3u8.replace("[domain_fourth]", data['domain_fourth']);
        console.log(data['domain_three']);
        m3u8 = m3u8.replace("[domain_shuang]", data['domain_shuang']);
        console.log(data['domain_fourth']);
        m3u8 = m3u8.replace("[domain_three]", data['domain_three']);
        console.log(m3u8);
        //创建按钮 位置
        var button1 = "<td><a style='width: 60px; margin-left: 5px; margin-bottom: 10px; background: rgb(180, 99, 0); border: 1px solid rgb(180, 99, 0); color: white;'  href='http://youxiji.org/tools/play.php?url=" + encodeURIComponent(m3u8) + "' target='_Blank'>";
        var button2 = "</a></td>";
        var button;
        var adress = $("#realviewnum");
        var m_div = "<tr id='div_id' ></tr>"
        adress.after(m_div);
        var x = $("#div_id");
        //获取子地址并添加按钮
        $.get(m3u8, function (data, status) {
            //alert("Data: " + data + "nStatus: " + status);
            //
            if (data.indexOf('720p') !== -1) {
                button = button1.replace("hls.m3u8", "hls-720p.m3u8") + "720p" + button2;
                x.append(button);
            }
            if (data.indexOf('480p') !== -1) {
                button = button1.replace("hls.m3u8", "hls-480p.m3u8") + "480p" + button2;
                x.append(button);
            }
            if (data.indexOf('360p') !== -1) {
                button = button1.replace("hls.m3u8", "hls-360p.m3u8") + "360p" + button2;
                x.append(button);
            }
            if (data.indexOf('240p') !== -1) {
                button = button1.replace("hls.m3u8", "hls-240p.m3u8") + "320p" + button2;
                x.append(button);
            }
        });
    });
})();