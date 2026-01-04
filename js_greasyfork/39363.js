// ==UserScript==
// @name         YouTube双字幕
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @match  https://www.youtube.com/*
// @author       知乎：野菜 https://www.zhihu.com/people/wei-wei-64-89
// @来源        怎样才能让YouTube显示自动生成的双语字幕？ - 野菜的回答 - 知乎 https://www.zhihu.com/question/47045031/answer/280816127
// 由知乎回答中发现，做成油猴脚本，方便使用
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39363/YouTube%E5%8F%8C%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/39363/YouTube%E5%8F%8C%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==
//使用说明：设置一下 解说词 以及 要翻译的语言，一般翻译设置成汉语，解说词设置成英语
(function() {
    'use strict';

javascript:clearInterval(xxx_09_);
    var xh_ = document.getElementsByTagName('body');
    var xg_ = document.createElement('script'); xg_.type = 'text/javascript';
    xg_.src = "https://code.jquery.com/jquery-2.2.4.min.js";
    xh_[0].appendChild(xg_);
    var xxx_09_ = setInterval(function()
     {
        try
        {
            var xc_ = $("ytd-transcript-renderer").find(".active");
            var xd_;
            if (xc_.length > 0)
            {
                 var crt_ = $(".ytp-time-current").text();
                 var off_1 = Number(crt_.split(":")[0]) * 60 * 1000 + Number(crt_.split(":")[1]) * 1000;
                 for (var lxj = 0; lxj < xc_.length; lxj++)
                 {
                     var xcll = xc_[lxj];
                     var off_2 = Number($(xcll).attr("start-offset"));
                     if (Math.abs(off_1 -off_2) < 10000)
                     {
                         xd_ = xcll;
                         break;
                     };
                 }
             }
             xd_ = $(xd_).text();
             if (!($(".xdfwjkciijwjmmmf")[0]))
             {
                 var xa_ = $(".captions-text").html();
                 $(".captions-text").html(
                     "<span style='font-size: 25px;background: rgba(8, 8, 8, 0.75); -webkit-box-decoration-break: clone; border-radius: 5px; font-size: 35px; color: rgb(255, 255, 0); fill: rgb(255, 255, 0); font-family: \"YouTube Noto\", Roboto, \"Arial Unicode Ms\", Arial, Helvetica, Verdana, \"PT Sans Caption\", sans-serif;color:red;' class='xdfwjkciijwjmmmf'>" + xd_ + "</span><br>" + xa_);
             }
             else
             {
                 $(".xdfwjkciijwjmmmf").text(xd_);
             }
        }
        catch (e) {}
    },
                              10);
})();