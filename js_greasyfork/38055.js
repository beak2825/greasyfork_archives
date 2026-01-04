// ==UserScript==
// @name         91pojie破解会员
// @namespace    http://0xpoker.cn/
// @version      0.3
// @description  91 can change the world
// @author       0xPoker
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @include      http://91p*rn.com/*
// @include      https://fas*2.ro*ks/*
// @include      *://*.space/view*
// @include      https://www.vlogdownloader.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38055/91pojie%E7%A0%B4%E8%A7%A3%E4%BC%9A%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/38055/91pojie%E7%A0%B4%E8%A7%A3%E4%BC%9A%E5%91%98.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 设置会员和观看次数
    document.cookie = 'watch_times=0';
    document.cookie = 'level=7';
    document.cookie = 'user_level=7';
    // 去广告
    var ad_list = [$('#headnav > table > tbody > tr:nth-child(2) > td > table'),
        $('#container > table > tbody > tr > td:nth-child(1)'),
        $('#container > table > tbody > tr > td:nth-child(3)'),
        $('#footcontainer > p:nth-child(1) > iframe'),
        $('#userinfo')
    ];
    for (var i = 0; i < ad_list.length; i++) {
        if (ad_list[i].length != 0) {
            ad_list[i].remove();
        }
    }
    // 列出当前视频
    $(document).ready(function () {
        $('#video_choice').change(function () {
            var sobj = document.videos.choose_video.value;
            window.open(sobj, '_blank').location;
        });
    });
    $('#small-rightbox-title').html('更换播放源方法');
    $('#relatedtag-content > div').html('<div align="center" style="padding-top: 5px;font-size: x-large">在评分那里会有多的两个按钮可以点击来换源播放</div>');
    $('#useraction > table > tbody').html(function (index, oldcontent) {
        return '<tr><td><div class="floatmenu">在这里更换播放源</div></td><td><div class="floatmenu"><a onclick="window.open(\'https://91.yyxf.xyz/vip.php?link=\' + document.baseURI, \'_blank\').location;">使用播放源一</a></div></td><td><div class="floatmenu"><a href="" onclick="window.open(\'https://www.vlogdownloader.com/#\' + document.baseURI, \'_blank\').location;">使用播放源二</a></div></td></tr>' + oldcontent;
    });
    var head_div = $('#head');
    try {

        head_div[0].childNodes[1].innerHTML += '<form name="videos" action><select name="choose_video" id="video_choice">\n';
        head_div[0].childNodes[1].innerHTML += '</select></form>\n';
        head_div = $('#video_choice');
        head_div[0].innerHTML += '<option value="">====请选择一个视频====</option>';
        switch ($(document)[0].location.pathname) {
            case '/index.php':
                for (var j = 0; j < mycarousel_itemList.length; j++) {
                    head_div[0].innerHTML += '<option value="' + mycarousel_itemList[j].url + '">' + mycarousel_itemList[j].title + '</option>\n';
                }
                break;
            case '/v.php':
                var all_videos = $('#videobox > table > tbody > tr > td > div');
                for (var ii = 0; ii < all_videos.length; ii++) {
                    try {
                        head_div[0].innerHTML += '<option value="' + all_videos[ii].children[0].children[1].href + '">' + all_videos[ii].children[0].children[1].children[0].title + '</option>\n';
                    } catch (e) {
                        head_div[0].innerHTML += '<option value="' + all_videos[ii].children[0].children[0].href + '">' + all_videos[ii].children[0].children[0].children[0].title + '</option>\n';
                    }
                }
                break;
            default:
                $('#video_choice').remove();
                console.log('请联系开发者添加');
                break;
        }
    } catch (e) {
    }
    var thisSite = window.location.href;
    if (/vlog/i.test(thisSite) && (/view/i.test(thisSite))) {
        $("#vlog").submit();
    } else if (/html/i.test(thisSite)) {
        $("#exampleModal").attr("data-backdrop", "static");
        $(".btn.btn-primary:eq(10)").click();
        $("body").on("click", "video", function () {
            if (this.paused) {
                this.play();
            } else {
                this.pause();
            }
        });
        $(window).keydown(function (e) {
            var video = $("video")[0];
            if (e.keyCode == 32) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        });
    }
    else if (/vlog/i.test(thisSite) && (/403/i.test(thisSite))) {
        history.back();
    }
})();