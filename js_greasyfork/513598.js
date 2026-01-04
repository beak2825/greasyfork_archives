// ==UserScript==
// @name         贴吧手机版
// @namespace    https://space.bilibili.com/8286319
// @version      1.5.5
// @description  替代贴吧APP,需要配合user-agent switcher 切换成PC模式
// @author       happmaoo
// @match        https://tieba.baidu.com/*
// @exclude      https://tieba.baidu.com/photo/*
// @exclude      https://tieba.baidu.com/home/*
// @exclude      http://tieba.baidu.com/mo/*
// @exclude      http://tieba.baidu.com/mo/q---1E1A44492752A8CFE48A31DB2C0BB8FE:FG=1--1-3-0--2--wapp_1536855175546_700/m?tn=bdIndex&lp=5014&pinf=1_1_0
// @exclude      https://tieba.baidu.com/f/like/mylike
// @icon         https://www.baidu.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at document-start

// @downloadURL https://update.greasyfork.org/scripts/513598/%E8%B4%B4%E5%90%A7%E6%89%8B%E6%9C%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/513598/%E8%B4%B4%E5%90%A7%E6%89%8B%E6%9C%BA%E7%89%88.meta.js
// ==/UserScript==

// 1.5 版本取消引入外部jq，因为会和贴吧jq冲突。
// 1.3 版本更新:@run-at document-start 加载前用一个遮罩挡住原来的网页，免得到时候样式切换的时候闪一下。


// 加载前遮罩挡住
document.documentElement.insertAdjacentHTML('afterbegin', '<div id="fullscreen-overlay" style="text-align: center; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #fff; z-index: 991000;"><h1 style="font-size:30px;line-height:10em;"></h1></div>');



function viewport() {
    if (document.querySelector('meta[name="viewport"]')) {
      return;
    }
    const el = document.createElement("meta");
    el.name = "viewport";
    el.content = "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no";
    document.head.append(el);
}


(function() {
    function waitForJQuery() {
        if (typeof $ !== 'undefined') {
            // jQuery 已加载









//--------------------------- $(document).ready -------------------------------------

$(document).ready(function() {
    'use strict';
//$('link[rel="stylesheet"], style').remove();
$("body").css({
    "display": "block"
});
    // Your code here...
viewport();
var mycss2 = `

.lottery-thread-modal-post,.u_creative,.u_official,.u_bdhome,.u_member,.u_setting,.media_box,.u_ddl,.j-placeholder-pay-member,.p_share_ding,#d_post_manage,.j_clear_fullscreen,.dialogJmodal,.tbshare_popup_wrapper,.ui_bubble_wrap,.footer,.homeworks_guide,.tbui_aside_smiley,.ip-location,.lzl_more,.replace_tip,.poster_head,.d_badge_title,.d_badge_lv,.threadlist_detail>.threadlist_author,.head_content,.share_btn_wrapper,.icon-jubao,.user-hide-post-down,.right_section,.suggestion_list,.search_top,#fixed_bar,.aside,.nav_wrap,.card_banner{display:none!important;}
/*这个不能隐藏，不然控制台疯狂错误*/
.card_top_wrap{    height: 0;width: 0;display:block;overflow: scroll;}
ul,li{list-style-type:none;padding:0px;margin:0;}
.aaaa{padding:0px!important;margin:0!important;width:auto!important;margin:0!important;}
body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";}


.userbar ul li{float: left;}
.userbar {overflow: hidden;display: block;clear: both;}
.u_notity_bd ul li{float: left; margin:0 5px 0 0;}
.u_ddl{display:none;}


.search_ipt{width:100px!important;}

.search_btn{margin:0 5px;}
.dialogJfix{position: fixed;background: #eee;}

/* 列表 */
#thread_list{padding:0px;}
.threadlist_video{display:none!important;}
.threadlist_author{float:right;font-size:14px;color:#777!important;}
.threadlist_author a{font-size:14px;color:#777!important;}
.threadlist_media li,.col2_left{float:left;}
.threadlist_rep_num{background: #917ccd;color: #fff;border-radius: 5px;padding:2px 5px;margin-right:5px;font-size:14px;font-family: sans-serif;font-weight: bold;}

.j_thread_list{background:#fff;overflow:hidden;margin:0 0 10px 0;}
.threadlist_title{margin: 0 0 0 25px;}
.j_thread_list a:link{text-decoration:none;color:#000;}
.j_thread_list a:visited{color:#888!important;}
.threadlist_text {
    display: -webkit-box;
    font-size: 14px;
    color: #999;
    line-height: 2.5em;
    max-height: 100px;
    text-indent: 2em;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}
.jump_input_bright{width:30px;}



.pb_content h1,.pb_content h3{font-size:20px;width:auto!important;}

/* 回复相关 */
.d_post_content_main{padding-left:10px;display:block;overflow: auto;flex: 0.9;}
.d_post_content img{max-width:300px;height:auto;}
.core_reply_content{background:#fff;margin-left:20px;padding:5px 10px;font-size:14px!important;}
.core_reply_content .j_user_card img{display:none;}
.p_author img{width:30px;height:auto;}
.lzl_jb .lzl_jb_in{width:0;height:0;display:none!important;}
.core_reply_tail ul,.p_reply{float:left;font-size:12px;color:#aaa;}
.core_reply_tail .p_tail li{float:left;}
.core_reply_content a,.core_reply_tail a{}
.d_name a{text-decoration:none;font-size:14px;}

.p_author{float:left;}
.l_post{background:#fff;overflow:hidden;border-bottom: 1px  solid #aaa;margin: 10px 0;padding-bottom:10px;}
.post-tail-wrap span{text-indent:0.5em;line-height: 100%;}
.post-tail-wrap,.post-tail-wrap a{font-size:12px;color:#aaa;text-indent:0.5em;line-height: 100%;}
.l_post .d_author{display:block;width:60px;font-size:14px;line-break: anywhere;flex: 0.1;border-right: 1px  solid #ccc;}


/* 编辑器相关 */
.edui-popup{display:block;background:#eee;border: 1px  solid #aaa;padding:20px;left:10px!important;}
.edui-popup .s_face {width:30px!important;height:30px!important;}
.edui-btn-image{}
.emotion_container .s_face .img {
    background: transparent url(https://gsp0.baidu.com/5aAHeD3nKhI2p27j8IqW0jdnxx1xbK/tb/editor/images/default/fFace.png?t=20140529) no-repeat scroll left top;
    width: 30px;
    height: 30px;
    background-size: 100% auto;
}
.edui-btn-image::before,.edui-btn-emotion::before {
    content: "🖼️";
    color:#fff;margin:0 6px 5px 0;padding:5px 0 0 0;
    text-align: center;
    float: left;
display:block;width:50px;height:30px;background:#eee;
    font-size: 18px;             /* 设置字体大小 */
}
.edui-btn-emotion::before {content: "😀";}
.ueditor_emotion_tab,.emotion_preview{display:none!important;}
.tbui_panel_content{height:auto!important;}

.next_step{display:block;width:100px;line-height:2em;background:#ccc;text-align: center;}
.slide_item{float:left;display:none;}
.j_ok {
    position: fixed; /* 设置为固定定位 */
    left: 0;        /* 距离左边 0 像素 */
    bottom: 0;      /* 距离底部 0 像素 */
    background-color: rgba(0, 0, 0, 0.7); /* 背景颜色 */
    color: white;   /* 字体颜色 */
    padding: 10px;  /* 内边距 */
}
.i_item_bg{width:60px;height:60px;}
.flash_editor_container,.error{display:none;}
.edui-container .BDE_Image{width:100px!important;height:auto!important;}
#ueditor_replace{width:350px!important;}
.edui-container{width:350px!important;}
.dialogJbody{height:250px!important;}
.poster_submit{margin:5px;display:block;padding:5px;width:100px;background:#eee;text-align: center;font-size: 16px;text-decoration:none;}
.poster_submit em{color:#000;font-style: normal!important;}
.edui-editor-body{border: 1px  solid #aaa;width:auto;}
.dialogJcontent img{background-size: contain;}
.edui-toolbar{overflow: hidden;}
.fullscreen-word-limit{margin:0;}


/*  reply 回复楼中楼 */
.core_reply_content{
max-height:200px;
overflow: hidden;
}
.core_reply_content:hover{
overflow: auto; /* 鼠标悬停时显示内容 */
}
.editor_for_container{background:#fff;}
.lzl_panel_submit{margin:5px;display:block;padding:5px;width:50px;background:#eee;text-align: center;font-size: 16px;text-decoration:none;}

.core_reply_tail{clear:both;    display: block;    overflow: hidden;}
.post-tail-wrap span{float:left;}





video{max-width:300px;}

.l_post{
    display: flex;
    flex-direction: row;
}
.BDE_Image{width:auto!important;}

.test{background:#0f0;}
.mydiv1{clear:both;overflow: hidden;margin:0 0 10px 0;padding:0 0 10px 0;border-bottom: 1px  solid #aaa;}
.mydiv1 li{float:left;margin:0 0 0 5px;}
.favlist{clear:both;border-top: 1px  solid #aaa;padding: 10px 0 0  0;margin: 10px 0 0  0!important;}

/* 翻页 */
.pagination-default span,.pagination-default a{float:left;margin-left:5px;display:block;padding:2px 5px;background:#eee;}
.pagination-default{clear:both;overflow: hidden;}

.pb_list_pager span,.pb_list_pager a{float:left;margin:5px 0 5px 5px;display:block;padding:2px 5px;background:#eee;}


.art-poster,.art-subtitle,.art-danmuku,.art-layers,.art-mask,.art-bottom,.art-loading,.art-notice,.art-info,.art-mini-header,.art-contextmenus{display:none;}

/* 消息页面 https://tieba.baidu.com/i/i/replyme */
.sub_tab_content{margin: 10px 0;}
.feed ul li{margin:0 0 20px 0;padding:5px;border: 1px  solid #aaa;clear: both;background:#fff;color: #888;font-size: 14px;}
.feed ul li a{color: #888;}
.replyme_content,.replyme_content a{padding:10px 5px;color:#000!important;text-decoration:none;font-size: 16px;}
.sub_tab_content li,.tab_content li{float:left;margin-right:5px;}


/* 搜索页面 */
.s_aside{display:none;}
.s_post_list{margin:10px 0 10px 0;}
.s_post{margin:0px 0 20px 0;font-size:14px;}
.s_post_list .p_content{padding:5px;background:#f5f5f5;}
.pager-search span,.pager-search a{float:left;margin:5px 0 5px 5px;display:block;padding:2px 5px;background:#eee;}


/* 弹出框的样式 */
.mypopup {width: 300px;height: 200px;background-color: #fff;color: #333;border: 1px solid #ccc;border-radius: 5px;box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);padding: 20px;position: fixed;top: 20px;left: 20px;}
.mypopup .x{    background: #eee;
    position: relative;
    float: right;
    overflow: hidden;
    clear: both;
    padding: 5px 10px;}
.mypopup .text{overflow: hidden;
    clear: both;}
#backToTop {
    display: none; /* 初始隐藏 */
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background-color: #333;
    color: #fff;
    text-align: center;
    line-height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    opacity: 0.2;
    z-index: 1000;
}

`;

setTimeout(function() {
$('link[rel="stylesheet"], style').remove();
GM_addStyle(mycss2);
//去除遮罩
$("#fullscreen-overlay").remove();
}, 500);









/* 顶部 吧内搜索 */
var keyword = $('input[name="kw1"]').val();
var mysearch = `
<div id="backToTop" onclick="javascript:$(window).scrollTop(0);">↑</div>
<ul class=mydiv1>
<li>
<svg class="mysetting" width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.4 5.6C10.4 4.84575 10.4 4.46863 10.6343 4.23431C10.8686 4 11.2458 4 12 4C12.7542 4 13.1314 4 13.3657 4.23431C13.6 4.46863 13.6 4.84575 13.6 5.6V6.6319C13.9725 6.74275 14.3287 6.8913 14.6642 7.07314L15.3942 6.34315C15.9275 5.80982 16.1942 5.54315 16.5256 5.54315C16.8569 5.54315 17.1236 5.80982 17.6569 6.34315C18.1903 6.87649 18.4569 7.14315 18.4569 7.47452C18.4569 7.80589 18.1903 8.07256 17.6569 8.60589L16.9269 9.33591C17.1087 9.67142 17.2573 10.0276 17.3681 10.4H18.4C19.1542 10.4 19.5314 10.4 19.7657 10.6343C20 10.8686 20 11.2458 20 12C20 12.7542 20 13.1314 19.7657 13.3657C19.5314 13.6 19.1542 13.6 18.4 13.6H17.3681C17.2573 13.9724 17.1087 14.3286 16.9269 14.6641L17.6569 15.3941C18.1902 15.9275 18.4569 16.1941 18.4569 16.5255C18.4569 16.8569 18.1902 17.1235 17.6569 17.6569C17.1236 18.1902 16.8569 18.4569 16.5255 18.4569C16.1942 18.4569 15.9275 18.1902 15.3942 17.6569L14.6642 16.9269C14.3286 17.1087 13.9724 17.2573 13.6 17.3681V18.4C13.6 19.1542 13.6 19.5314 13.3657 19.7657C13.1314 20 12.7542 20 12 20C11.2458 20 10.8686 20 10.6343 19.7657C10.4 19.5314 10.4 19.1542 10.4 18.4V17.3681C10.0276 17.2573 9.67142 17.1087 9.33591 16.9269L8.60598 17.6569C8.07265 18.1902 7.80598 18.4569 7.47461 18.4569C7.14324 18.4569 6.87657 18.1902 6.34324 17.6569C5.80991 17.1235 5.54324 16.8569 5.54324 16.5255C5.54324 16.1941 5.80991 15.9275 6.34324 15.3941L7.07314 14.6642C6.8913 14.3287 6.74275 13.9725 6.6319 13.6H5.6C4.84575 13.6 4.46863 13.6 4.23431 13.3657C4 13.1314 4 12.7542 4 12C4 11.2458 4 10.8686 4.23431 10.6343C4.46863 10.4 4.84575 10.4 5.6 10.4H6.6319C6.74275 10.0276 6.8913 9.67135 7.07312 9.33581L6.3432 8.60589C5.80987 8.07256 5.5432 7.80589 5.5432 7.47452C5.5432 7.14315 5.80987 6.87648 6.3432 6.34315C6.87654 5.80982 7.1432 5.54315 7.47457 5.54315C7.80594 5.54315 8.07261 5.80982 8.60594 6.34315L9.33588 7.07308C9.6714 6.89128 10.0276 6.74274 10.4 6.6319V5.6Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.4 12C14.4 13.3255 13.3255 14.4 12 14.4C10.6745 14.4 9.6 13.3255 9.6 12C9.6 10.6745 10.6745 9.6 12 9.6C13.3255 9.6 14.4 10.6745 14.4 12Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</li>
<li><button class="mylike">关注本吧</button></li> <li><form class="search-form" action="https://tieba.baidu.com/f/search/res" method="GET" target="_blank">
<input type="hidden" name="ie" value="utf-8">
<input type="hidden" name="kw" value="${keyword}">
    <input type="text" size="15" name="qw" placeholder="吧内搜贴" required>
    <button type="submit">搜贴</button>
</form></li><li><a class="fav" href="#">我关注的吧</a></li></ul>
`;
$(".content").before(mysearch);

// 关注按钮
$(".mylike").on("dblclick", function() {

var fid = $.getPageData("forum.id", 0);
//var a = $.getPageData("forum.name", 0);
var tbs = $.getPageData("tbs", 0);
var uname = $.getPageData("user.name", "")+'&ie=utf-8';

const data = new URLSearchParams({
    fid: fid,
    //fname: 'illustrator',
    uid: uname,
    ie: 'gbk',
    tbs: tbs,
    jt: ''
}).toString();

var text = $(".mylike").html();
var url = "https://tieba.baidu.com/f/like/commit/add";
if ($(".mylike").html().includes("取消")) {
url = "https://tieba.baidu.com/f/like/commit/delete";
}
GM_xmlhttpRequest({
    method: 'POST',
    url: url,
    data: data,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    onload: function(response) {
    	alert("执行完成: "+response.responseText);
    	$(".mylike").prop("disabled", true);
    },
    onerror: function(error) {
        alert(error);
    }
});
});



setTimeout(function() {
// 是否已经关注 延迟1秒执行
if ($(".user_level").html() !== null) {
$(".mylike").html("取消关注");
}


/* 顶部我的消息 */
$('.userbar ul li').not('.u_username, .u_news').hide();
$('.u_news_wrap').attr('href', 'https://tieba.baidu.com/i/sys/jump?type=replyme');
$('.u_news_wrap').attr('onclick', '');
$('.u_news_wrap').attr('target', '_blank');


}, 1000);


let isJobRunning = false;
function job(){

    if (isJobRunning) return;
    isJobRunning = true;

    // 查找内容为 "广告" 的 span
    $('span').filter(function() {
        return $(this).text().trim() === '广告';
    }).each(function() {
        $(this).parent().html('ad1');
    });

$('.l_post[data-field="{}"]').remove();

/* 视频相关 */
$('video').each(function() {
    $(this).attr('controls', true);
    $(this).removeAttr('autoplay');
});


//$('video').remove();
$('#thread_list>div').remove();
$('.p_postlist').children().not('.l_post, .p_postlist').html('ad2');


// 修改过长字符
$('.post-tail-wrap,.core_reply_tail ').each(function() {
  $(this).find('span,a').each(function() {
      $(this).text($(this).text().replace("IP属地:", ""));
      $(this).text($(this).text().replace("来自", ""));
      $(this).text($(this).text().replace("客户端", ""));
  });
});
isJobRunning = false;
}




// 页面加载后 每 x 秒执行一次，运行 x 次
let count = 0;
const intervalId = setInterval(function() {
    job();
    count++;
    if (count >= 10) {
        clearInterval(intervalId);
    }
}, 500);


// 滚动时执行，不滚动时不执行，优化代码

$(window).on("scroll", function() {
job();
});


$('.poster_submit').on('click', function() {
    $(this).css('background-color', '#aaa');
    setTimeout(() => {
        $(this).css('background-color', '#eee');
    }, 1000);
});

// 贴吧主页
if (window.location.href === 'https://tieba.baidu.com/' || window.location.href === 'https://tieba.baidu.com/index.html') {

var mycssindex = `
html{padding:20px;}
a{margin-right:10px;}
`;

setTimeout(function() {
    GM_addStyle(mycssindex);
}, 500);

$('img').remove();
// 获取 ID 为 likeforumwraper 的元素的 HTML 内容
var newContent = $('.left-sec').html();

// 替换整个 body 的内容
$('body').html(newContent);
} else {
}


//-------------------------------设置------------------------------------
$("body").prepend("<div class='mypopup' style='display:none;'><span class='tit'>设置</span><span class='x'>x</span>\
                  <div class='text'>帖子列表显示样式:<br><input type=\"radio\" name=\"option\" value=\"option1\">显示标题和摘要<br><input type=\"radio\" name=\"option\" value=\"option2\">只显示标题</div></div>");

// 页面加载时读取设置
if(GM_getValue("liststyle", "normal")=="normal"){
    //alert(GM_getValue("liststyle", "normal"));
    $('input[name="option"][value="option1"]').prop("checked", true);
}else{
    $('input[name="option"][value="option2"]').prop("checked", true);
    setTimeout(function() {
    GM_addStyle(".threadlist_text{display:none;}");
    }, 500);
}


// 选中 设置
$('input[name="option"]').change(function() {
    if ($('input[name="option"][value="option1"]').is(':checked')) {
        GM_setValue("liststyle", "normal");
    }
    if ($('input[name="option"][value="option2"]').is(':checked')) {
        GM_setValue("liststyle", "onlytit");
    }
});

// 关闭按钮 mypopup
$(".mypopup .x").on("click", function() {
     $(".mypopup").css({'display': 'none'});
});

// 打开设置 mypopup
$(".mysetting").on("click", function() {
     $(".mypopup").css({'display': 'block'});
});
//-------------------------------------------------------------------

//上传图片点击事件 不兼容手机
/*
$('.edui-btn-image').on('click', function() {
//$('.next_step').click();
setTimeout(function() {
$('.next_step').click();
}, 500);
});
*/

//-------------emoji 未使用---------------------
function insertText(text) {
    let editor = document.getElementById("ueditor_replace"); // 获取编辑器
    editor.focus(); // 确保编辑器获得焦点

    let selection = window.getSelection(); // 获取当前选择
    //console.log(selection);
    let range = selection.getRangeAt(0); // 获取光标所在的范围

    // 创建一个文本节点
    let textNode = document.createTextNode(text);

    // 插入内容到光标位置
    range.insertNode(textNode);

    // 移动光标到新插入内容的后面
    range.setStartAfter(textNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
}
// $(".poster_reply").after('<span class="mybtn-emoji">😀</span>');
$(".mybtn-emoji").on("click", function() {
     $(".mybtn-emoji").after('<div class="emoji-char" style="width: 200px;height: 100px;font-size:26px;background-color: #fff;color: #333;border: 1px solid #ccc;border-radius: 5px;box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);padding: 20px;position: fixed;top: 220px;left: 20px;"><span>😀</span><span>😆</span><span>😅</span><span>😍</span><span>😱</span><span>🏀</span><span>🧐</span><span>😞</span><span>😓</span><span>😭</span><span>👍</span><span>🐱</span><span>🚴‍♂️</span></div>');
$(".emoji-char span").on("click", function() {
    let char = $(this).text(); // 获取点击的字符
    //alert(char);
    insertText(char);// 插入到光标位置
    $(".emoji-char").remove();
});
});


// 我关注的贴吧列表
$(".fav").on("click", function() {
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://tieba.baidu.com/f/like/mylike",

        onload: function(response) {
            if (response.status === 200) {
                console.log("Request successful:", response.responseText);
                let htmlObject = $(response.responseText);
                // 使用 jQuery 选择 "吧名" 这一列的元素
                let names = [];
                htmlObject.find("td:first-child a").each(function() {
                    names.push($(this).text());
                });

                let links = names.map(name => `<a href="https://tieba.baidu.com/f?kw=${encodeURIComponent(name)}" target="_blank">${name}</a>`).join(" - ");
                $(".mydiv1").append("<li class='favlist'>" + links + "</li>");
                $(".fav").remove();
            } else {
                console.error("Request failed with status:", response.status);
            }
        },
        onerror: function(error) {
            console.error("Request failed:", error);
        }
    });
});


// 插入图片时的修复，会给html元素插入css让页面无法滚送，并无法显示图片框
// 方法是监控html标签style，发现后自动执行代码

const targetNode = document.documentElement;
const config = { attributes: true, attributeFilter: ["style"] };
let timeoutId = null;

const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            // 如果计时器已存在，说明1秒内已执行过清除操作
            if (timeoutId) return;

            // 清除 style 属性
            // 插入图片相关
            $('.button_bar').css({
                'display': 'none'
                });
            $('html').css({
            'overflow': '',        // 清除 overflow 样式
            'padding-right': ''    // 清除 padding-right 样式
            });

            $('.dialogJfix').css({
            'position': 'fixed',
            'padding': '20px',        // 清除 overflow 样式
            'left': '10px',
            'width': '280px',
            'border': '1px  solid #aaa',
            'background': '#eee'    // 清除 padding-right 样式
            });

            // 设置计时器，1秒后允许再次执行清除
            timeoutId = setTimeout(() => {
                timeoutId = null;
            }, 1000);
        }
    }
});

// 开始观察目标节点
observer.observe(targetNode, config);


/*
// 发完帖自动滚动到底部
$(".poster_submit").on("click", function() {
    setTimeout(function() {
        $(window).scrollTop($(document).height() - 800);
        }, 5000);
});
*/






});//--------------------------------end of $(document).ready ------------------------------


// 返回顶部按钮
$(window).scroll(function() {
    if ($(window).scrollTop() > 100) {
        $('#backToTop').fadeIn();
    } else {
        $('#backToTop').fadeOut();
    }
});









  } else {
            // 每隔 100 毫秒检查一次，直到 jQuery 加载完成
            setTimeout(waitForJQuery, 100);
        }
    }
    waitForJQuery();
})();

/*
备份

// 设置icon
<li>
<svg class="mysetting" width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.4 5.6C10.4 4.84575 10.4 4.46863 10.6343 4.23431C10.8686 4 11.2458 4 12 4C12.7542 4 13.1314 4 13.3657 4.23431C13.6 4.46863 13.6 4.84575 13.6 5.6V6.6319C13.9725 6.74275 14.3287 6.8913 14.6642 7.07314L15.3942 6.34315C15.9275 5.80982 16.1942 5.54315 16.5256 5.54315C16.8569 5.54315 17.1236 5.80982 17.6569 6.34315C18.1903 6.87649 18.4569 7.14315 18.4569 7.47452C18.4569 7.80589 18.1903 8.07256 17.6569 8.60589L16.9269 9.33591C17.1087 9.67142 17.2573 10.0276 17.3681 10.4H18.4C19.1542 10.4 19.5314 10.4 19.7657 10.6343C20 10.8686 20 11.2458 20 12C20 12.7542 20 13.1314 19.7657 13.3657C19.5314 13.6 19.1542 13.6 18.4 13.6H17.3681C17.2573 13.9724 17.1087 14.3286 16.9269 14.6641L17.6569 15.3941C18.1902 15.9275 18.4569 16.1941 18.4569 16.5255C18.4569 16.8569 18.1902 17.1235 17.6569 17.6569C17.1236 18.1902 16.8569 18.4569 16.5255 18.4569C16.1942 18.4569 15.9275 18.1902 15.3942 17.6569L14.6642 16.9269C14.3286 17.1087 13.9724 17.2573 13.6 17.3681V18.4C13.6 19.1542 13.6 19.5314 13.3657 19.7657C13.1314 20 12.7542 20 12 20C11.2458 20 10.8686 20 10.6343 19.7657C10.4 19.5314 10.4 19.1542 10.4 18.4V17.3681C10.0276 17.2573 9.67142 17.1087 9.33591 16.9269L8.60598 17.6569C8.07265 18.1902 7.80598 18.4569 7.47461 18.4569C7.14324 18.4569 6.87657 18.1902 6.34324 17.6569C5.80991 17.1235 5.54324 16.8569 5.54324 16.5255C5.54324 16.1941 5.80991 15.9275 6.34324 15.3941L7.07314 14.6642C6.8913 14.3287 6.74275 13.9725 6.6319 13.6H5.6C4.84575 13.6 4.46863 13.6 4.23431 13.3657C4 13.1314 4 12.7542 4 12C4 11.2458 4 10.8686 4.23431 10.6343C4.46863 10.4 4.84575 10.4 5.6 10.4H6.6319C6.74275 10.0276 6.8913 9.67135 7.07312 9.33581L6.3432 8.60589C5.80987 8.07256 5.5432 7.80589 5.5432 7.47452C5.5432 7.14315 5.80987 6.87648 6.3432 6.34315C6.87654 5.80982 7.1432 5.54315 7.47457 5.54315C7.80594 5.54315 8.07261 5.80982 8.60594 6.34315L9.33588 7.07308C9.6714 6.89128 10.0276 6.74274 10.4 6.6319V5.6Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.4 12C14.4 13.3255 13.3255 14.4 12 14.4C10.6745 14.4 9.6 13.3255 9.6 12C9.6 10.6745 10.6745 9.6 12 9.6C13.3255 9.6 14.4 10.6745 14.4 12Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</li>


// 去掉详情页的帖子广告
var nodes = document.querySelectorAll('.l_post');
nodes.forEach(function(node){
    if(node.classList.length > 4) {
        node.remove();
    }
});
*/