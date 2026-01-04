// ==UserScript==
// @name nga dark clean mode
// @namespace metaphor
// @version 1.0.0
// @description dark clean mode for bbs.nga.com
// @author metaphor
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.nga.178.com/*
// @match *://*.ngabbs.com/*
// @match *://*.bbs.nga.cn/*
// @downloadURL https://update.greasyfork.org/scripts/491021/nga%20dark%20clean%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/491021/nga%20dark%20clean%20mode.meta.js
// ==/UserScript==

(function() {
let css = `;

{
body {
    --backGround1: #323232;/* 引用，弹窗底色 */
    --backGround2: #282828;/* 评论区交替浅底色 */
    --backGround3: #212121;/* 大背景底色 */
    --hyperlink: #a9b7c6;
    --hyperlink-hover: #b87563;
    --font-color: #a6a6a6;
    }
html body{
  background-color: var(--backGround3) !important;
  color: var(--font-color);
}

/* 超链接颜色：导航，翻页，用户名 */
.stdbtn a , a{color:var(--hyperlink) !important}
.stdbtn a:hover , a:hover {color:var(--hyperlink-hover) !important}

/* 导航栏/翻页：底色、边框 */
.innerbg {background: var(--backGround3) !important;}
.stdbtn {box-shadow: 0 0 15px -3px black !important;}
.stdbtn a {border-color: transparent;background: var(--backGround3) !important;}

/* 搜索栏 */
textarea, select, input[type="text"], input:not([type]) {
    border: 0px;
    box-shadow: 0 0 2px 0 #bbb inset;
    background: var(--backGround3);
    color:var(--font-color);
}
/* 搜索框 */
.single_ttip2 {border:0px !important;left: 960px !important;box-shadow: 0 0 15px -3px black !important;border-radius: 20px!important;}
.single_ttip2 .div2 {background-color: var(--backGround1) !important;border:0px;border-radius: 10px!important;}

/* 更多框 */
.single_ttip2 .tip_title {height:0em; border-bottom: none;}
.single_ttip2 .div2 {background: var(--backGround1);border:none}
.single_ttip2 .div2 .div3 .ltxt .group {border-top: 0px solid transparent !important;}
.block_txt_big {
    line-height: 1.6em;
    margin: 0.1em;
    text-align: left;
    padding: 0em 0em 0em 0em !important;
    height: 2em !important;
    background: var(--backGround1) !important;
    display:inline-block;
    font-size: 12px;
}
.block_txt_big.title {width: auto !important;float: none !important;}
.block_txt_big.title span{transform: none !important;;}
.single_ttip2 .colored_text_btn{background-color: var(--backGround1) !important;}
.single_ttip2 .group img{display: none !important;}
/* 按钮 */
button {background: var(--font-color);}

/* 去除banner图 */
#custombg {margin-bottom: 0px !important;display: none;}
#mainmenu{margin-bottom: 20px !important;}


/* 板块栏 */
.nav_root, .nav_link, .nav_spr {
  border:1px solid transparent;
  background:var(--backGround3);
  color:var(--hyperlink);
  box-shadow: 0 0 15px -3px black;
}
.haveCustomBackground #m_pbtntop .stdbtn {background:transparent;border:0px solid transparent;}
/* 板块卡片 */
#m_pbtnbtm+div,#m_fopts+div{background-color: var(--backGround1) !important;border: 0px solid transparent !important;}


/* 隐藏边线 */
.forumbox {border-spacing:0px;border-color: transparent !important;}

/* 人物栏 回复 */
.forumbox {background-color:var(--backGround1) !important;}
#m_posts {border: 0px;}
.row1 .c1, .row1 .c2, .row1 .c3, .row1 .c4{background-color:var(--backGround2);}
.row2 .c1, .row2 .c2, .row2 .c3, .row2 .c4{background-color:var(--backGround3);}
.c3 div, .c4 div{background-color: #454545 !important;}

/* 楼层 */
/* .block_txt_c0 {background: transparent;} */
/* 点赞 */
/* .block_txt_c2 {background: transparent;} */
/* 改动 */
/* .block_txt_c3 {background: transparent;color: #888;} */
/* 拇指 */
/* .white {color:var(--font-color)} */

/* 浮动栏 */
.stdbtn {background:transparent;border: 0px;box-shadow: 0 0 15px -3px black;}


/* 用户栏宽度 */
.forumbox .postrow .c1 {width:17%;}
/* 人物属性：无边框 */
.forumbox .postrow .stat {border:0px solid transparent;margin-top: 0px;}
/* 经验条 */
.r_container {display: none;}
/* 用户栏隐藏头像 */
.postrow .avatar, .msgread .avatar {display: none;}
/* 用户栏昵称优化 */
.block_txt {
  min-width: auto !important;
  background-color: transparent !important;
  color:var(--hyperlink) !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.small_colored_text_btn{
  background-color: transparent !important;
}

/* POST阴影 */
#m_posts .forumbox {box-shadow: 0 0 15px -3px black;}
/* 去除POST右上角3个ICON */
/* .small_colored_text_btn , .inlineBlock {display: none  !important;} */
/* 去除"改动分割线“ */
.forumbox .postrow .c2 .subtitle {display: none;}
/* 正文图片去边框 */
img {outline: 0px !important;}
/* 正文折叠部分 */
.collapse_btn {width:fit-content;border-top:0px;border-bottom:0px;background: #161616;border-radius: 7px;box-shadow: 0 0 3px 0px #454545}
.collapse_content {width:fit-content;border-bottom: 0px;background: #161616;border-radius: 7px;box-shadow: 0 0 3px 0px #454545;}
/* 正文隐藏签名 */
.sigline , [id ^= "postsign"] {display: none !important;}
/* 正文引用 */
.quote {background:var(--backGround1) !important;border:0px;}
/* 贴条 */
.comment_c_1, .comment_c_2 {border: 0em !important;background:var(--backGround1) !important;}

/* 搜索页 */
#toptopics .contentBlock, .catenew .b2, .catenew .b3{background-color: var(--backGround1) !important;}
#sub_forums {background-color: var(--backGround1) !important;border: 1px solid var(--backGround1) !important;}

/* 表格 */
table , table td{border-color: #454545 !important;}

/* 表情反色 */
.smile_ac {filter:invert(0.5);}
  `;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
