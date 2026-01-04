// ==UserScript==
// @name         C站页面简化
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  还原UI
// @author       You
// @match        https://bbs.colg.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=colg.cn
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479449/C%E7%AB%99%E9%A1%B5%E9%9D%A2%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/479449/C%E7%AB%99%E9%A1%B5%E9%9D%A2%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let style_Add = document.createElement('style');
    style_Add.innerHTML = `
[url=home.php?mod=space&uid=945662]@media[/url] (min-width:1366px) {
        body {
                background: none;
        }
        .wp {
                width: 100%;
        }
}
@media (max-width:650px) {
        #postlist .favatar.pls .avatar img {
                margin: 0 0 2px;
        }
}
#toptb, .dnch_eo_pt,.dnch_eo_pr, .dnch_eo_f, .bml, dl.pil.cl, td.plc.plm .sign, .dnch_eo_pb,.dnch_eo_pt, .pls .side-star, .pls .side-group, div#h_nv, .res-footer-note, a>img[border="0"].zoom, .md_ctrl, .pls.favatar .xg1, .wp.a_h, .hd_table, .a_cn, .wp.a_f, .bm.lk, .a_pt {
        display: none !important;
}
.pls .avatar img {
        width: 100px;
        height: 100px;
        background: none;
        padding: 0;
        border: 0px solid #ffffff;
    display: none !important;
}

html.widthauto body#nv_forum.pg_viewthread div#wp.wp div.optimize-layout div.optimize-right
{
display: none !important;
}

.pls .tns.xg2 {
display: auto !important;
}

.avtm img {
        width: 60px;
}

.pls .pbg2 {
        //font-size: 0px;
display: none;

}

.pls .avatar {
        text-align: center;
}

.pls {
        //font-size: 0px;
    //display: none;
        width: 175px;
        height: 0px;
    text-align: center;
}

.pls .pbg2 {
        //font-size: 0px;
display: none;

}

.pls .sprite_start_2 {
display: auto;

}

.pls .sprite_start_1 {
display: auto;

}

.pls .sprite_start_3 {
display: auto;

}

.pls .pm2 {
display: auto;

}

.t_fsz {
        min-height: 60px;
}
.pls .pi {
        text-align: center;
        padding: 10px 0 0 0;
        border: none;
        overflow: visible;
}
.xw1 {
        font-size: 15px;
}
textarea#fastpostmessage {
        background: none !important;
}
.pcb img {
        max-width: 60%;
        margin: 4px;
}
.rate {
        margin: 0;
}
.ratl td {
        padding: 0px;
}
.xw1 {
        font-size: 12px;
        font-weight: 500;
}
.xi2,.xi2 a,.xi3 a {
        ;
}
.mtw {
        margin-top: 0px !important;
}
#p_btn {
        padding: 0px;
        margin: 0 0 0 1px;
        display: flex;
        justify-content: space-evenly;
}
#scbar {
        border-top: 0;
        border-bottom: 0;
}

.optimize-layout>.optimize-layout-ignore-width
{
width:100% !important;
}

.t_f, .t_f td {
  font-size: 15px !important;
}

.f_textArea{
 padding:3px 5px !important;
}

/* 私货，限制勋章区高度 不喜可删 */
.md_ctrl {
  max-height: 150px;
  overflow-y: scroll;
  width: 147px;
  scrollbar-width: none;
}
/* 控制滚动条的样式 */
::-webkit-scrollbar {
width: 6px; /* 设置滚动条宽度 */
}
/* 滚动槽 */
::-webkit-scrollbar-track {
-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
border-radius: 10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
border-radius: 10px;
background: rgba(255,255,255,0.2); /* 滚动条颜色为透明 */
-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
}
/* 滚动条角落 */
::-webkit-scrollbar-corner {
background: transparent; /* 角落颜色为透明 */
}

/* 发帖、回复按钮还原 */
.sprite_pn_post {
    width: 75px;
    height: 29px;
    display: inline-block;
    background-position: -100px -60px;
    background-image: url(https://static.colg.cn/image/sprites/sprite-list.png);
}
#post_replytmp .sprite_pn_post,#post_reply .sprite_pn_post{
    background-position: -182px -60px;
}
.sprite_pn_post * {
  opacity: 0;
}

/*迷之广告浮窗*/
.cooperation_bd_wapper{
    display:none !important;
}

`;
    if (document.head) {
        document.head.appendChild(style_Add);
    } else {
        let timer = setInterval(function(){
            if (document.head) {
                document.head.appendChild(style_Add);
                clearInterval(timer);
            }
        });
    }

})();
