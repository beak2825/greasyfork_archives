// ==UserScript==
// @icon            http://weibo.com/favicon.ico
// @name            download chinese weibo vedio
// @namespace       [url=mailto:weibo.com]weibo.com[/url]
// @author          none
// @description     weibo download
// @match           *://weibo.com/tv/v/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         1.1
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/409421/download%20chinese%20weibo%20vedio.user.js
// @updateURL https://update.greasyfork.org/scripts/409421/download%20chinese%20weibo%20vedio.meta.js
// ==/UserScript==
(function () {
    'use strict';
 
    GM_addStyle('#down_film_btn{color:#00ff00;}');
 
    var down_btn_html = '<li>';
    down_btn_html += '<a href="javascript:void(0);" id="down_film_btn" class="S_txt2" title="download">';
    down_btn_html += '<span class="pos">';
    down_btn_html += '<span class="line S_line1" node-type="comment_btn_text">';
    down_btn_html += '<span>';
    down_btn_html += '<em class="W_ficon ficon_film_v2 S_ficon">i</em>';
    down_btn_html += '<em>download</em>';
    down_btn_html += '</span>';
    down_btn_html += '</span>';
    down_btn_html += '</span>';
    down_btn_html += ' <span class="arrow"><span class="W_arrow_bor W_arrow_bor_t"><i class="S_line1"></i><em class="S_bg1_br"></em></span></span>';
    down_btn_html += ' </li>';
 
    var ul_tag = $("div.WB_handle>ul");
    if (ul_tag) {
        ul_tag.removeClass("WB_row_r3").addClass("WB_row_r4").append(down_btn_html);
    }
 
    var filmTool = {
        getFileName: function (url, rule_start, rule_end) {
                var start = url.lastIndexOf(rule_start) + 1;
                var end = url.lastIndexOf(rule_end);
                return url.substring(start, end);
            },
            download: function (filmUrl, name) {
                var content = "file content!";
                var data = new Blob([content], {
                    type: "text/plain;charset=UTF-8"
                });
                var downloadUrl = window.URL.createObjectURL(data);
                var anchor = document.createElement("a");
                anchor.href = filmUrl;
                anchor.download = name;
                anchor.click();
                window.URL.revokeObjectURL(data);
            }
    };
 
    $(function () {
        var film = $("film");
        var film_url = null;
        if (film) {
            film_url = film.attr("src"); 
        }
        $("#down_film_btn").click(function () {
            if (film_url) {
                filmTool.download(film_url, filmTool.getFileName(film_url, "/", "?"));
            }
        });
    });
 
})();