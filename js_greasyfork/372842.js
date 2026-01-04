// ==UserScript==
// @name         V电影添加下载按钮
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  V电影添加下载按钮，喜欢的视频，一键下载收入口袋,第一次运行会提示跨域请求，请允许。
// @author       You
// @match        https://www.vmovier.com/*?from*
// @match        https://www.xinpianchang.com/*?from*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/372842/V%E7%94%B5%E5%BD%B1%E6%B7%BB%E5%8A%A0%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/372842/V%E7%94%B5%E5%BD%B1%E6%B7%BB%E5%8A%A0%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function download(){
        var url = $('iframe').attr('src')
        var y = url.split('/')[2]
        if (y!=='player.youku.com'){
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(res) {
                console.log("请求HTML成功！")
                if (res.status == 200) {
                   var find_text =  res.response
                   var re_s = /"https_url":"(\S*?)","video_bitrate"/
                   var find = find_text.match(re_s)[1].replace(/\\/g,'')
                   console.log(find)
                    $('.post-share').remove()
                    $('.animate').remove()
                    $(".post-share-btn").after('<div class="post-share-btn download" style="background-image: url(http://thyrsi.com/t6/380/1538632930x-1566688526.png);"><a href="'+find+'" target="_blank">下载</a></div>')

                }

            }
        });
        }
        else{
            $(".post-share-btn").after('<div class="post-share-btn download" style="background-image: url(http://thyrsi.com/t6/380/1538632930x-1566688526.png);"><a href="" target="_blank">优酷无下载资源</a></div>')
            console.log("优酷资源，不提供下载！")
        }
    }
    function X_P(){
        var text = $('body').html()
        var re_key = /vid: "(\S*?)",/
        var key = text.match(re_key)[1]
        var url = 'https://openapi-vtom.vmovier.com/v3/video/'+key+'?expand=resource'
        console.log(key)
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(res) {
                console.log("请求HTML成功！")
                if (res.status == 200) {
                   var find_text =  res.response
                   var re_s = /"https_url":"(\S*?)","video_bitrate"/
                   var find = find_text.match(re_s)[1].replace(/\\/g,'')
                   console.log(find)
                   $('span.xpc-stat.share-btn.show-qr.c_b_3.v-center.share-host').after('<span class="xpc-stat share-btn show-qr c_b_3 v-center share-host" data-event="clickArticleShare"><span class="v-center c_b_3 fs_12 fw_600"><a href="'+find+'"  style="margin-left: -6px;" target="_blank">下载</></span></span>')
                }

            }
        });
    }
    //识别是新片场还是V电影
    function X_V(){
        var url = window.location.href
        var YY = url.split('/')[2]
        console.log(YY)

        if (YY != 'www.xinpianchang.com'){
            // v电影
            download()
        }else{
            //新片场
            X_P()
        }
    }
    //主程序
    X_V()
    // Your code here...
})();