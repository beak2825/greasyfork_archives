// ==UserScript==
// @name         知乎 ReFine
// @namespace    https://greasyfork.org/zh-CN/scripts/16384-知乎-refine
// @version      1.40
// @description  知乎阅读版式优化 
// @author       shinemoon
// @match        https://www.zhihu.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/16384/%E7%9F%A5%E4%B9%8E%20ReFine.user.js
// @updateURL https://update.greasyfork.org/scripts/16384/%E7%9F%A5%E4%B9%8E%20ReFine.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var styleStr = "";

var Sys = {};
var ua = navigator.userAgent.toLowerCase();
var s;
(s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;


styleStr = styleStr+".zu-main-content-inner, .zu-main-content-inner {";
styleStr = styleStr+"	margin-right:0px!important;";
styleStr = styleStr+"}";

styleStr = styleStr+".js-collapse-body,  m-editable-content {";
styleStr = styleStr+'font-family: Baskerville, Georgia, "Liberation Serif", "Kaiti SC", STKaiti, "AR PL UKai CN", "AR PL UKai HK", "AR PL UKai TW", "AR PL UKai TW MBE", "AR PL KaitiM GB", KaiTi, KaiTi_GB2312, "TW\-Kai", serif;';
if (Sys.chrome)
    styleStr = styleStr+"	font-size: 16px;";
styleStr = styleStr+"	color:black;";
styleStr = styleStr+"}";

styleStr = styleStr+".zu-top-nav-link, .top-nav-profile, zu-top-add-question {";
styleStr = styleStr+'font-family: Georgia, "Nimbus Roman No9 L", "AR PL UMing CN", "AR PL UMing HK", "AR PL UMing TW", "AR PL UMing TW MBE", PMingLiU, MingLiU, serif;';
if (Sys.chrome)
    styleStr = styleStr+"	font-size: 14px;";
styleStr = styleStr+"}";

styleStr = styleStr+".question_link {";
styleStr = styleStr+'font-family: "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Source Han Sans CN", "Source Han Sans SC", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif;';
if (Sys.chrome)
    styleStr = styleStr+"	font-size: 14px;";
styleStr = styleStr+"}";

styleStr = styleStr+".comment-app-holder {";
styleStr = styleStr+'font-family: Baskerville, "Times New Roman", "Liberation Serif", STFangsong, FangSong, FangSong_GB2312, "CWTEX\-F", serif;';
if (Sys.chrome)
    styleStr = styleStr+"	font-size: 16px;";
styleStr = styleStr+"}";



styleStr = styleStr+".zm-profile-item-text {";
styleStr = styleStr+'font-family: "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Source Han Sans CN", "Source Han Sans SC", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif;';
styleStr = styleStr+"	font-size: 12px;";
styleStr = styleStr+"}";


styleStr = styleStr+".zh-summary.summary.clearfix {";
styleStr = styleStr+'font-family: Baskerville, Georgia, "Liberation Serif", "Kaiti SC", STKaiti, "AR PL UKai CN", "AR PL UKai HK", "AR PL UKai TW", "AR PL UKai TW MBE", "AR PL KaitiM GB", KaiTi, KaiTi_GB2312, "TW\-Kai", serif;';
styleStr = styleStr+"	font-size: 15px;";
styleStr = styleStr+"}";
styleStr = styleStr+"";
styleStr = styleStr+".zu-main-sidebar {";
styleStr = styleStr+"	display:none;";
styleStr = styleStr+"}";
styleStr = styleStr+"";
styleStr = styleStr+".zu-main-content-inner{";
styleStr = styleStr+"	margin-right:10px;";
styleStr = styleStr+"}";
styleStr = styleStr+"";
styleStr = styleStr+".comment-app-holder, .zm-comment-box{";
styleStr = styleStr+"	max-width:5000px;";
styleStr = styleStr+"}";

styleStr = styleStr+".editable img, .zg-content-img-source-link, .origin_image, .content_image, .video_image, .play_video{";
styleStr = styleStr+"	max-width:60%!important;";
styleStr = styleStr+"	margin-left:auto!important;";
styleStr = styleStr+"	margin-right:auto!important;";
styleStr = styleStr+"};";

styleStr = styleStr+".zhi div.zh-backtotop {";
styleStr = styleStr+"	position:fixed!important;";
styleStr = styleStr+"	left:20px!important;";
styleStr = styleStr+"	right:100%!important;";
styleStr = styleStr+"}";

styleStr = styleStr+".zm-profile-side-following, .zm-profile-side-section {";
styleStr = styleStr+"	display:block!important;";
styleStr = styleStr+"}";



GM_addStyle(styleStr);

$( document ).ready(function(){
    console.log("Let's Take Over the World of 知乎 ！");
    if( $('.zm-profile-side-following a').length>0){
        var following = $('.zm-profile-side-following a').eq(0).find('strong').text();
        var followingUrl = $('.zm-profile-side-following a').eq(0).attr('href');
        var followed = $('.zm-profile-side-following a').eq(1).find('strong').text();
        var followedUrl = $('.zm-profile-side-following a').eq(1).attr('href');
        console.info("Following "+ following + ", Followed by " +followed);
        $('.profile-navbar').append('<a class="item" href="'+followingUrl+'"> 关注中 <span class="num">'+following+'</span></a>');
        $('.profile-navbar').append('<a class="item" href="'+followedUrl+'"> 关注者 <span class="num">'+followed+'</span></a>');
        
    }
    if($('.follow-button.zg-follow.zg-btn-green').length>0) {
        $('#zh-question-meta-wrap').append($('.follow-button.zg-follow.zg-btn-green').css('float','right'));
    }
    
    $('#zh-question-title').append($('.zh-question-followers-sidebar'));
    console.log($('.zh-backtotop'));
    setTimeout(function(){
        $('.zh-backtotop').show();
        $('.zh-backtotop').prop("style","right:20px!important;left:auto!important;bottom:10px!important;");
    }, 1);
});
