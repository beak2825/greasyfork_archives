// ==UserScript==
// @icon            https://appstatic.yaseok.com/static/src/images/favicon.ico
// @name            亚瑟VIP解析
// @namespace       https://fulibus.net/
// @author          fuliba
// @description     播放视频
// @include         *yase*/video/view/*
// @Require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         0.0.4
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/391367/%E4%BA%9A%E7%91%9FVIP%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/391367/%E4%BA%9A%E7%91%9FVIP%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
//=============================================
var css = '#'+ si1 + '{display:none !important;}';
css += '#'+ si3 + '{display:none !important;}';
css += '#'+ si4 + '{display:none !important;}';
css += '#'+ si5 + '{display:none !important;}';
loadStyle(css);
function loadStyle(css) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.appendChild(document.createTextNode(css));
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
    document.getElementsByTagName('fieldset')[0].style.display='none';
}
//=============================================
(function () {
    'use strict';

    var url = "https://1.yaseok.com";
    var time = poster_url.match(/m\/([0-9]{8})/)[1];
    var hash = poster_url.match(/[a-zA-Z0-9]{32}/g);
    //console.log(poster_url + "\n" + time + "\n" + hash);

    GM_xmlhttpRequest({
        method: "GET",
        url: url + "/api/video/player_domain?id=1116957",
        onload: function(response) {
            var m3u8 = JSON.parse(response.responseText).data;
            m3u8 = m3u8.replace(/[0-9]{8}/, time)
            m3u8 = m3u8.replace(/[a-zA-Z0-9]{32}/, hash)
            //console.log(response.responseText);
            //console.log(m3u8)

            GM_xmlhttpRequest({
                method: "GET",
                url: m3u8,
                onload: function(response) {
                    var str = response.responseText;
                    //console.log("Data: " + response.responseText + "\nStatus: " + response.status);
                    if (response.status == "404") {
                        m3u8 = m3u8.replace(/\/\/([a-zA-Z0-9]+).yy/g, "//htwo.yy")
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: m3u8,
                            onload: function(response) {
                                addBtn(response.responseText,m3u8)
                            }
                        });
                    } else {
                        addBtn(str,m3u8)
                    }
                }
            });

            function addBtn(data,m3u8u){
                var playURL = "http://youxiji.org/tools/play.php?url=" + encodeURIComponent(m3u8u);
                var button1 = "<td><a style='width: 60px; margin-left: 5px; margin-bottom: 10px; background: rgb(180, 99, 0); border: 1px solid rgb(180, 99, 0); color: white;'  href='" + playURL + "' target='_Blank'>";
                var button2 = "</a></td>";
                var button;
                var adress = $(".text-gray");
                var m_div = "<tr id='div_id'></tr>"
                adress.after(m_div);
                var x = $("#div_id");

                if (data.indexOf('1080p') !== -1) {
                    x.append(button1.replace("hls.m3u8", "hls-1080p.m3u8") + "1080p" + button2);
                }
                if (data.indexOf('720p') !== -1) {
                    x.append(button1.replace("hls.m3u8", "hls-720p.m3u8") + "720p" + button2);
                }
                if (data.indexOf('480p') !== -1) {
                    x.append(button1.replace("hls.m3u8", "hls-480p.m3u8") + "480p" + button2);
                }
                if (data.indexOf('360p') !== -1) {
                    x.append(button1.replace("hls.m3u8", "hls-360p.m3u8") + "360p" + button2);
                }
                if (data.indexOf('240p') !== -1) {
                    x.append(button1.replace("hls.m3u8", "hls-240p.m3u8") + "240p" + button2);
                }
            }
        }
    });
})();