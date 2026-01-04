// ==UserScript==
// @name         v2自用css
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world
// @author       You
// @match        https://*.v2ex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/469567/v2%E8%87%AA%E7%94%A8css.user.js
// @updateURL https://update.greasyfork.org/scripts/469567/v2%E8%87%AA%E7%94%A8css.meta.js
// ==/UserScript==

GM_addStyle(`
/*彩虹进度条*/
.member-activity-done{
background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
}
.member-activity-almost{
background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
}
.member-activity-half{
background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
}
.member-activity-fourth{
background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
width: 100% !important;
}
.member-activity-start{
background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
width: 100% !important;
}
/*隐藏进度条*/
#member-activity{
display:none;
}
/*隐藏昵称*/
#Rightbar > div:nth-child(2) > div:nth-child(1) > table:nth-child(1){
display: none;
}

/*------------------------------------*/
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
}
/*隐藏加入收藏一栏的点击次数*/
.topic_stats{
display:none;
}
/*嵌入的图片和视频大小自定义。不修改主题正文里的图片视频大小*/
/*鼠标悬停缩小后的图片/视频 原大小显示*/
/*嵌入图片的a标签，和文字内容分行显示*/
/*自用样式:连带主题内容嵌入的图片/视频 一起缩放，并实现嵌入的图片单独一行(topic content内<p>的设置)*/
.embedded_image{
max-width:49%!important;
}
.embedded_image:hover{
max-width:100%!important;
}
a:has(img.embedded_image){
display:inline-block;
}
p:has(img.embedded_image){
display:grid;
}
.markdown_body:has(img.embedded_image){
display:grid;
}

.embedded_video_wrapper{
max-width:50%;
max-height:50%;
padding-bottom:25%;
}
.embedded_video_wrapper:hover{
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
/*灰色按钮默认隐藏*/
strong button[style*="color:#777777"]{
opacity:0!important;
}

/*全局字体美化*/
*:not(pre) {
-webkit-text-stroke: 0.3px !important;
text-stroke: 0.3px !important;
}

/*浅色背景条纹交替，便于阅读*/
.cell:has(.reply_content):nth-child(2n){
background-color:#f7f7ed;
}
.cell:has(.reply_content):nth-child(2n+1){
background-color:#f0f0e3;
}`
)