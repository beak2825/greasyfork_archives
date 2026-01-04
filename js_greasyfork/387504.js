// ==UserScript==
// @name         桃花族视频区预加载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match       http://thz6.net/forum-181-*.html
// @grant        none
// @require      https://libs.baidu.com/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/387504/%E6%A1%83%E8%8A%B1%E6%97%8F%E8%A7%86%E9%A2%91%E5%8C%BA%E9%A2%84%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/387504/%E6%A1%83%E8%8A%B1%E6%97%8F%E8%A7%86%E9%A2%91%E5%8C%BA%E9%A2%84%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==
//注入页面的脚本文件
$(function() {
    var res = '';
    var html = ''
    var urls = $('td.num a');
    for (i = 0; i <= urls.length; i++) {
        var url = urls[i].href;
        $.ajax({
            url: url,
            success: function(data) {
                res = data.match('zoomfile="(.*?)" file');
                if (res !== null) {
                    $("[src='static/image/filetype/image_s.gif']").eq(0).attr({
                        'src': res[1],
                        'width': '500'
                    });
                }
            }
        });
    }
})