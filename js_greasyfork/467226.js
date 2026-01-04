// ==UserScript==
// @name         v2ex评论区精简
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  v2ex评论区精简,类reddit样式
// @author       xianmua
// @match        https://*.v2ex.com/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467226/v2ex%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/467226/v2ex%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

//css微调

GM_addStyle(`
/*隐藏自动生成的话题标签区域*/
.tag{
display:none!important;
}
/*连同op的头像也隐藏*/
.avatar{
display:none;
}
/*回复按钮默认隐藏，悬浮显示*/
img[alt=Reply]{
opacity:0;
}
img[alt=Reply]:hover{
opacity:1;
}
/*去掉评论的头像部分*/
td:has(.avatar){
display:none;
}
/*去掉评论里的一个空白内容*/
.cell:has(.reply_content) .sep3{
display:none;
}
.cell:has(.reply_content) .sep5{
height:1px;
}
/*悬停显示评论发布时间，默认隐藏*/
.ago{
opacity:0;
}
.ago:hover{
opacity:1;
}

/*去掉评论边框，修改padding参数，内容更紧凑*/
.cell:has(.reply_content){
border-bottom:0px;
padding:3px;
}
/*评论的行高修改*/
.reply_content{
line-height:1.4;
display:block!important;
}
/*隐藏加入收藏一栏的点击次数*/
.topic_stats{
display:none;
}
/*嵌入的图片和视频大小自定义。不修改主题正文里的图片视频大小*/
/*鼠标悬停缩小后的图片/视频 原大小显示*/
/*嵌入图片的a标签，和文字内容分行显示*/
.embedded_image:not(.topic_content .embedded_image){
max-width:50%;
}
.embedded_image:not(.topic_content .embedded_image):hover{
max-width:100%;
}
a:has(img.embedded_image:not(.topic_content .embedded_image)){
display:inline-block;
}
.embedded_video_wrapper:not(.topic_content .embedded_video_wrapper){
max-width:50%;
max-height:50%;
padding-bottom:25%;
}
.embedded_video_wrapper:not(.topic_content .embedded_video_wrapper):hover{
max-width:100%;
max-height:100%;
padding-bottom:52.9%;
}

/*右上角主题收藏两侧的分割线*/
td:has(.dark){
border-left:none!important;
border-right:none!important;
}

/*评论的名字颜色略微改动，更容易区分*/
.box:has(.reply_content) a.dark{
color:#4d5256!important;
}
.box:has(.reply_content) a.dark:hover{
color:#385f8a!important;
}


`)
let yellowStripeReplyBox=GM_getValue("yellowStripeReplyBox",false),
    greyStripeReplyBox=GM_getValue("greyStripeReplyBox",false),
    fontBold=GM_getValue("fontBold",false)
function toggle_yellowStripeReplyBox(){GM_setValue("yellowStripeReplyBox",!yellowStripeReplyBox);if(greyStripeReplyBox){GM_setValue("greyStripeReplyBox",!greyStripeReplyBox)};window.location.reload()}
function toggle_greyStripeReplyBox(){GM_setValue("greyStripeReplyBox",!greyStripeReplyBox);if(yellowStripeReplyBox){GM_setValue("yellowStripeReplyBox",!yellowStripeReplyBox)};window.location.reload()}
function toggle_fontBold(){let menu_status=fontBold;menu_status=!menu_status;GM_setValue("fontBold",menu_status);window.location.reload()}

GM_registerMenuCommand(yellowStripeReplyBox?"✅浅黄色背景条纹交替":"❌浅黄色背景条纹交替",toggle_yellowStripeReplyBox);
GM_registerMenuCommand(greyStripeReplyBox?"✅浅灰色背景条纹交替":"❌浅灰色背景条纹交替",toggle_greyStripeReplyBox);
GM_registerMenuCommand(fontBold?"✅字体加粗":"❌字体加粗",toggle_fontBold);

if(yellowStripeReplyBox){
/*评论区浅黄色条纹交替显示,便于阅读*/
    GM_addStyle(`
    .cell:has(.reply_content):nth-child(2n){
       background-color:#f7f7ed;
     }
    .cell:has(.reply_content):nth-child(2n+1){
       background-color:#f0f0e3;
     }
     `)
}
if(greyStripeReplyBox){
/*评论区浅灰色条纹交替显示,便于阅读*/
    GM_addStyle(`
    .cell:has(.reply_content):nth-child(2n){
       background-color:#fafafa;
     }
    .cell:has(.reply_content):nth-child(2n+1){
       background-color:#f0f0f0;
     }
     `)
}

if(fontBold){
    GM_addStyle(`
    *:not(pre) {
      -webkit-text-stroke: 0.3px !important;
      text-stroke: 0.3px !important;
    }
    `)
}
