// ==UserScript==
// @name         远景论坛美化
// @namespace    https://bbs.pcbeta.com/
// @version      1.4.5
// @description  远景论坛主页/分区/看帖/高级发帖页美化
// @author       kitawa
// @match        https://*.pcbeta.com/*
// @match        https://*.pcbeta.com/forum.php?mod=viewthread&tid=*
// @exclude      https://bbs.pcbeta.com/search*
// @grant        none
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/526778/%E8%BF%9C%E6%99%AF%E8%AE%BA%E5%9D%9B%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/526778/%E8%BF%9C%E6%99%AF%E8%AE%BA%E5%9D%9B%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==
(function () {
  "use strict";
  // 创建 <style> 并立即注入
  const style = document.createElement("style");
  style.textContent = `
/* 去下划线 */
a {
    text-decoration: none !important;
}
a:hover {
    color: #ff3b30 !important;
    text-decoration: none !important;
    text-shadow: 0 0px 5px rgba(255, 255, 255, 0.4);
}
/* 全局背景色 */
html, body {
    background: #F2F3F5 !important;
}
.pl .quote blockquote,
.quote blockquote {
    background: none !important;
}

img[src*="/static/image/common/userinfo.gif"],
img[src*="/static/image/common/back.gif"],
img[src*="/static/image/common/bb_sup.gif"],
img[src*="/static/image/common/bb_sub.gif"],
#fastposteditor > div > div.bar > div > span.pipe.z,
#rt_rt_1ik0hja2b7u10a11r3h9u33pm1,
.tip_horn,
#e_cst1_sup > img,
#e_cst1_sub > img,
.tip_4 .tip_horn,
.m_l, .m_r,
.t_c, .b_c,
.ad .pls,
.ad .plc,
.t_l,
.t_r,
.b_l,
.b_r,
#postlist > table.ad,
#nv.custom,
.authicn,
#scbar_hot,
#scbar_hot strong, #scbar_hot a {
    display: none !important;
}


.pipe {
    opacity: 0 !important;
}
.fc-l {
    color: #ff9c00;
}
/*---- ---- ---- ---- ---- --- ---- ---- ---1.主页---- ---- --- ---- ---- --- ---- ---- ---- -------*/
#um .usernav {
    background: #1985DB;
    height: 24px;
    text-align: center;
    padding: 0 6px 0 10px;
    border-radius: 0px 0px 8px 8px;
    line-height: 20px;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2) !important;
}
#ribbon {
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2) !important;

}
#scbar {
    overflow: hidden;
    height: 42px;
    line-height: 42px;
    border-radius: 8px;
    border-top: 0px solid #FFF;
    border-bottom: 0px solid #E9EFF5;
    background: none;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2) !important;
}
#scbar_form > table > tbody {
    background: #1985dc;
    border-radius: 8px;
    border: none;
    overflow: visible;
    display: flex;
    justify-content: space-around;
    width: 1200px;
}
#scbar_type {
    margin-left: 16px;
    border-radius: 6px;
    border: none;
    color: #444 !important;
    background: #fff;
}
.xg1, .xg1 a {
    color: #444 !important;
}
#scbar_txt {
    border: 1px solid #1985db;
    border-radius: 6px;
}
#scbar_btn {
    background: #1985DB;
    border-radius: 6px;
    box-shadow: none;
}
.p_pop, .p_pof, .sllt {
    padding: 4px;
    border: 0px solid;
    min-width: 45px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 6px;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(30px);
}
.pls .bui {
    padding: 15px 0 15px 26px;
    position: absolute;
}
.p_pop a:hover, .p_pop a.a, #sctype_menu .sca {
    background-color: transparent;
    border-radius: 6px;
}
.fl .bm_h {
    border: none;
    background: #1985dc;
    height: 40px;
    margin-top: 0px;
    border-radius: 8px 8px 0 0;
}
.bmw .bm_h a {
    font-size: 15px;
    font-weight: 400;
    color: #fff;
    margin-top: 16px;
    text-shadow: none;
}
.bmw .bm_h a:hover{
    color: #fff !important;
}
.bm_h {
    line-height: 40px;
    border-top: 0px solid #FFF;

}
.fl {
    border: none;
    border-top: none;
}
.fl .bm {
    margin-bottom: 15px;
    border: none;
    border-radius: 8px;
    overflow: hidden;
    border: 0px solid #666 !important;
     box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1)!important;;
}
.bmw .bm_h .y {
    color: #fff;
}
#ct > div.mn > div.bm.lk,
#online {
    color: #fff;
    border: none;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #c5d3dd !important;
}
.mn {
    overflow: visible;
}
#um a:hover {
    color: #FFF !important;
}
#qmenu_menu ul.nav a {
    border: none;
}
#qmenu_menu ul.nav a:hover {
    background: none !important;
    text-shadow: none !important;
}
ul#scbar_type_menu {
    text-align: center;
}
/*---- ---- ---- ---- ---- --- ---- ---- ---2.分区---- ---- --- ---- ---- --- ---- ---- ---- -------*/
#threadlist {
    border: 1px solid #c5d3dd;
    background: #FFF;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1)!important;
    border-radius: 8px;
    overflow: hidden;
}
.pgs #newspecial, .pgs #newspecialtmp, .pgs #post_reply, .pgs #post_replytmp {
    float: left;
    margin-right: 5px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15) !important;
}
.ttp .a .num {
    background: #f7f9fb;
}
.tl #forumnewshow a {
    display: block;
    border: 1px solid #fddc9b70;
    text-indent: 25px;
    height: 29px;
    line-height: 29px;
    color: #f26c4f;
    margin-top: -10px;
    border-radius: 8px!important;
    overflow: hidden;
    background-color: #fff0c9 !important;
}
.tl .th {
    border-bottom: 1px solid #eee;
    margin-top: 0px;
}
.ttp .num {
    background: #fff;
    padding: 0 5px;
    margin-left: 5px;
    border-radius: 3px;
    color: #999 !important;
    border-radius: 4px;
}
.ttp a, .ttp strong {
    float: left;
    margin-right: 5px;
    padding: 4px 8px 3px;
    height: 18px;
    border: 1px solid #c5d3dd;
    background: #fff;
    overflow: visible;
    white-space: nowrap;
    border-radius: 6px;
    /* box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05) !important; */
}
.bm {
    border: none;
}
.pgsbtn {
    padding: 10px 16px;
    font-size: 14px;
    line-height: 14px;
    border-radius: 6px !important;
    background: #1985DB;
    letter-spacing: 2px;
    transition: .2s background ease;
}
.pgsbtn:hover {
    background: #1985dc;
}
.pg strong {
    background-color: #1985dc;
    color: #FFF !important;
    border-radius: 6px;
}
#f_pst {
    border: 1px solid #c5d3dd;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 1px 12px rgba(0, 0, 0, 0.1);
    background: #fff;
}
#f_pst > div.bm_h {
    background-color: #1985dc;
    color: #fff;
    border-radius: 7px 7px 0 0;
    padding-bottom: 6px;
}
.pn, .pgsbtn {
    border-radius: 6px;
}
#ct .mn .bm.bml.pbn {
    background: #fff;
    border: 1px solid #c5d3dd;
    border-radius: 8px;
}
.tl .th {
    border-bottom: 1px solid #eee;
    margin-top: 0px;
    background: #1985dc;
}
.tl .th td, .tl .th th {
    height: 20px;
    border: none;
    vertical-align: baseline;
    background: #1985dc;
    color: #fff;
}
.tl .th tr:hover th, .tl .th tr:hover td {
    height: 20px;
    border: none;
    vertical-align: baseline;
    background: #1985dc;
    color: #fff;
}
#atarget:before, .unchk:before, .chked:before {
    color: #fff;
}
.forumrefresh:after,
#filter_dateline,
#threadlist > div.th > table > tbody > tr > th > div > a:nth-child(6),
#threadlist > div.th > table > tbody > tr > th > div > a:nth-child(5),
#threadlist > div.th > table > tbody > tr > th > div > a:nth-child(4),
#threadlist > div.th > table > tbody > tr > th > div > a:nth-child(3),
.showmenu,
#atarget, .unchk, .chked {
    color: #fff!important;
}
.tl th, .tl td {
    padding: 10px 0;
    border-bottom: 0px dashed #F5F6F7;
}
.pg label .px {
    padding: 1px;
    width: 25px;
    height: 16px;
    line-height: 16px;
    border: 1px solid #c5d3dd !important;
    background-color: #fff;
    border-radius: 6px;
}
.nvhm {
    font-family: dzicon !important;
    color: #c5d3dd;
}
i.fico-vote.fic6.fc-n,
i.fico-thread.fic6.fc-n {
    color: #c2d5e3;
}
#number_favorite,
.fa_rss:before,
.fa_achv:before,
.fa_fav:before {
    color: #c2d5e3;
}
.tl .ts th, .tl .ts td {
    border: none;
    background: #f7f9fb !important;
    border-radius: 8px;
}
#separatorline > tr > td:nth-child(4),
#separatorline > tr > td:nth-child(3),
#separatorline > tr > th {
    border-radius: 0;
}
#separatorline > tr > td:nth-child(1) {
    border-radius: 8px 0 0 8px;
}
#separatorline > tr > td:nth-child(5) {
    border-radius: 0 8px 8px 0;
}
tr > th > img {
    margin-top: -5px;
}
/*---- ---- ---- ---- ---- --- ---- ---- ---3.内页---- ---- --- ---- ---- --- ---- ----*/
.t_f, .t_f td {
    font-size: 14px;
}
.avt img {
    padding: 0px;
    width: 48px;
    height: 48px;
    background: #FFF;
    border: none;
    margin: 2px;
    outline: 2px solid #000 !important;
}
.psta img {
    border-radius: 6px;
    outline: 1px solid #333;
}
.bui .m img {
    margin: 10px 0 10px -4px;
    width: 120px;
    border-radius: 8px;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
    outline: 3px solid #fff;
}
.rate dd ul li {
    overflow: visible;
}
.rate dt {
    float: left;
    padding: 0 !important;
    width: 80px;
    text-align: center;
}
.rate dt strong {
    border-radius: 6px!important;
}
.tip {
    border-radius: 8px;
    background: #ffffffe0;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    border: none;
    backdrop-filter: blur(80px);
}
.po p a, .po p label {
    margin-right: 6px;
    color: #000 !important;
}
.xw1 {
    font-weight: 700;
    font-size: 13px;
}
.fwinmask,
#fwin_rate,
#fwin_reply,
#fwin_comment {
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.2);
    background: #fffffff5;
    backdrop-filter: blur(50px);
}
.pnc, a.pnc, .pn:focus, .pnc:focus {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}
.tm_c .o,
.tm_c {
    background: none !important;
}
#postlist {
    border-top: 0;
    background: #FFF;
    border-left: 0;
    border-right: 0;
}
#postlist {
    border: 1px solid #c5d3dd;
    background: #fff;
    overflow: hidden;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1)!important;
    border-radius: 8px!important;
}
tbody > tr:nth-child(2) > td > div > font > font {
    font-size: 14px;
}
.pls .avatar img {
    padding: 0;
    width: 120px;
    outline: 3px solid #fff;
    border-radius: 8px;
    box-shadow: none;
    box-shadow: 0 0px 10px rgba(0,0,0,0.3);
}
.ptn {
    padding-top: 5px !important;
}
#f_pst .avatar {
    text-align: center;
    padding: 25px 0;
}
.pls .avatar {
    margin: 15px 0;
    text-align: center;
}
.pl .quote {
    border-top: 0px solid #77B4F4;
    border-radius: 8px;
    background: #f5f6f7;
    border: 1px solid #e0e0e0;
}
.pls {
    width: 160px;
    background: #c5d3dd54;
    overflow: visible;
    border-right: 1px solid #c5d3dd;
}
.pls p, .pls .pil, .pls .o {
    margin: 5px 10px 5px 20px;
    text-align: center;
}
.t_fsz > table {
    border: none !important;
    box-shadow: none !important;
}
.pi {
    border-bottom: 0px dashed #c5d3dd;
    color: #888;
}
.plhin {
    border-top: 1px solid #c5d3dd;
}
.zoom {
    display: block;
    margin: 20px auto !important;
    box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.4);
    outline: 6px solid #fff !important;
    border-radius: 6px;
}
.flbc {
    float: left;
    width: 18px;
    height: 18px;
    overflow: hidden;
    text-indent: -9999px;
    background: #000;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    position: relative;
    transition: background 0.15s ease;
}
.flbc:hover {
    background: red;
}
.flbc::before,
.flbc::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px; /* 将"X"的线条长度调整为10px */
    height: 2px; /* "X"的线条粗细 */
    background: white; /* 白色线条 */
    transform: translate(-50%, -50%) rotate(45deg); /* 旋转45度 */
    transition: background 0.15s ease; /* 添加过渡效果 */
}

.flbc::after {
    transform: translate(-50%, -50%) rotate(-45deg); /* 旋转-45度 */
}
.m_c {
    background: transparent;
}
.tedt .area,
.tedt .pt,
.m_c .o {
    border-top: 0px solid #CCC;
    background: transparent;
}
.tedt .bar {
    border-bottom: 1px solid #c5d3dd;
    background: #ebf1f5;
}
.tedt {
    width: 98%;
    border-radius: 6px;
    border: 1px solid #c5d3dd;
    overflow: hidden;
}
.pnc, a.pnc {
    border: none !important;
    background-color: #1C85DC;
}
#f_pst .tedt {
    border: 1px solid #c5d3dd;
    overflow: hidden;
}
#f_pst .tedt .bar {
    border-bottom-color: #c5d3dd;
    background-color: #ebf1f5;
}
.pls .pi {
    padding-left: 0px;
    text-align: center;
}
.pil.cl {
    display: flex;
    text-align: center;
    flex-direction: row;
    margin: 5px 15px 5px 15px;
    flex-wrap: wrap;
}
.xi2, .xi2 a, .xi3 a {
    color: #444;
}
a#filter_special {
    color: #fff!important;
}
.pgbtn a {
    border-radius: 8px;
    border: 1px solid #c5d3dd;
    font-size: 13px;
    letter-spacing: 3px;
}
#autopbn {
    border: 1px solid #c5d3dd;
    border-radius: 8px;
    padding-bottom: 6px;
    font-size: 13px;
    letter-spacing: 3px;
}
.pgbtn a:hover {
    border-color: #c5d3dd;
}
.pi strong a,
.sign,
.sign *,
.authi > a{
    color: #888;
}
.pg a, .pg strong, .pgb a, .pg label {
    color: #1985db;

}
#p_btn a {
    display: inline-block;
    margin-right: 6px;
    padding-right: 4px;
    padding-left: 4px;
    background: #1985db;
    vertical-align: top;
    color: #fff;
    white-space: nowrap;
    border-radius: 6px;
    transition: all 0.2s ease;

}
#p_btn a:hover {
    color: #fff;
    transform: scale(1.1);
}
#p_btn span,
#p_btn i,
#p_btn em {
    color: #fff;
}
.pstl {
    clear: left;
    padding: 0.5em 0;
    display: flex;
    align-items: center;
}
.psta {
    width: auto;
    overflow: visible;
}
.dt th {
    background: #f5f6f7;
}
.dt td, .dt th {
    border: none;
}
.pg_viewthread #mdly {
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2) !important;
    border-radius: 8px !important;
}
.p_pop a ,
.dpbtn {
    border: none;
}
#rateform > div > table > tbody > tr:nth-child(1) > th:nth-child(1) {
    border-radius: 6px 0 0 6px;
}
#rateform > div > table > tbody > tr:nth-child(1) > th:nth-child(2),
#rateform > div > table > tbody > tr:nth-child(1) > th:nth-child(3) {
    border-radius: 0;
}
#rateform > div > table > tbody > tr:nth-child(1) > th:nth-child(4) {
    border-radius: 0 6px 6px 0;
}
.dt {
    border-top: none;
}
.pls.cl.favatar > p.groupicon > a > img {
    margin-left: -5px;
}
.pl .blockcode {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
}
/*---- ---- ---- ---- ---- --- ---- ---- ---4.回复---- ---- --- ---- ---- --- ---- ----*/

.ftid a {
    color: #444 !important;
    border: 1px solid;
    border-color: #c5d3dd;
    border-radius: 4px;
    width: 84px !important;
}
.px:focus, .ps:focus, select:focus, .ftid a:focus {
    outline: 0;
    box-shadow: 0 0 2px #1985DB;
    border-radius: 4px;
}
.px, .pt, .ps, select {
    border: 1px solid;
    border-color: #c5d3dd;
    background: #FFF;
    border-radius: 4px;
}
.sltm {
    padding: 5px 11px 5px 10px;
    border: 0px solid #c5d3dd;
    background-color: #FFF;
    text-align: left;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}
.p_opt .txt, .p_opt .txtarea {
    margin: 5px 0;
    border: 1px solid #c5d3dd;
    border-radius: 6px;
}
/*---- ---- ---- ---- ---- --- ---- ---- ---5.搜索页---- ---- --- ---- ---- --- ---- ----*/
.slst.mtw {
    border: 0px solid #c5d3dd !important;
    box-shadow: none !important;
    background: none!important;
}

/*---- ---- ---- ---- ---- ---  ---- ---6.发帖（高级模式）---- ---- --- ---- ---- --- ----*/
.ct2_a, .ct3_a {
    background: #fff;
    background-image: none;
    border: 1px solid #c5d3dd;
    background-size: 167px;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1) !important;
    border-radius: 8px !important;
}
.ct2_a .mn, .ct2_a .bm {
    margin: 10px;
}
.bbda,
.tb {
    border-bottom: none;
}
.tb a {
    border: none !important;
    background: transparent;
}
.tb .a a, .tb .current a {
    background: transparent;
    border-radius: 6px;
    color: #ff3b30;
    height: 26px;
    font-weight:900 !important;
}
.imgl {
    background-color: #66666614;
    border-radius: 8px;
}
.imgl img {
    border: 2px solid #ffffff !important;;
}
.bbs {
    border-bottom: none !important;
}
.upfl a, #imgattachlist a {
    color: #ff3b30;
}
#post_extra_tb label {
    border: none;
}
#post_extra_c .exfm {
    margin: -1px 0 0;
    border: 1px solid #c5d3dd;
    background: #ebf1f5;
    border-radius: 6px;
}
.exfm {
    border-radius: 8px;
}
#post_extra_tb label.a {
    border-bottom-color: #F7F9FB;
    background: none;
    box-shadow: none;
    border-radius: 6px;
}
.tbms {
    border-radius: 6px;
}
.upfl table td {
    border-bottom: 0;
    height: 30px;
    line-height: 24px;
    border-radius: 0 !important;
}
#imgSpanButtonPlaceholder,
#e_attachlist #spanButtonPlaceholder {
    background-image: none !important;
    background-color: #000;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.20);
    color: #fff;
    width: 90px!important;
    height: 25px!important;
    position: relative;
    padding: 2px 10px;
    border-radius: 6px;
}
#imgSpanButtonPlaceholder::before,
#e_attachlist #spanButtonPlaceholder::before {
    content: "选择文件上传";  /* 设置伪元素的内容 */
    position: absolute; /* 定位伪元素 */
    top: 50%; /* 垂直居中 */
    left: 50%; /* 水平居中 */
    transform: translate(-50%, -50%); /* 精确居中 */
    color: #fff; /* 文字颜色 */
    font-size: 13px; /* 字体大小，根据需要调整 */
    white-space: nowrap; /* 强制文字不换行 */
}
.edt {
    border: 1px solid #c5d3dd !important;
    border-radius: 6px;
    overflow: hidden;
}
.edt .bar {
    border: none;
    background: #EBF1F5 !important;
}
.edt .bbar,
.edt .bar {
    border-bottom: 1px solid #c5d3dd !important;

}
.edt .bbar {
    border-bottom: none !important;
}
.pn {
    background: #ddd;
    height: 25px;
}
.pnc, a.pnc {
    border: none !important;
    background-color: #1C85DC;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    height: 25px;
}
.edt .bbar, .edt .bbar a {
    color: #666;
}
.edt .bbar {
    border-top: 1px solid #c5d3dd !important;;
}
.edt .b1r, .edt .b2r {
    border-right: 1px solid #ebf1f5 !important;
    border-left: 1px solid #ebf1f5 !important;
}
.edt .bar a {
    border: 1px solid #ebf1f500 !important;

}
.edt .btn {
    float: left;
    border-right: none !important;
}
.edt .bar a:hover, .edt .bar a.hover {
    border: 1px solid #fff !important;
    background-color: #c2d5e3 !important;
    border-radius: 6px!important;
    transition: all 0.2s ease;
}
ct2_a .tb {
    margin-top: 0;
    padding: 0;
    border: none;
}
.ntc_l {
    background: #ffecc4;
    border-bottom: 1px solid #fddc9b !important;
}
.t_table td {
    border: 1px solid #ccc;
}
.progressContainer {
    overflow: hidden;
    margin: 5px;
    padding: 4px;
    border: solid 1px #E8E8E8;
    background-color: #F7F7F7;
    border-radius: 6px;
}
.imgl img {
    border: none;
    max-width: 110px;
    border-radius: 8px;
}
.edt .b2r a.dp {
    margin-right: 3px  !important;
    background: #fff !important;
    border-radius: 6px;
    padding-left: 0px !important;
    text-align: center;
    height: 20px !important;
    border: 1px solid #c2d5e3 !important;
    padding-top: 2px;
}
.edt .b2r a {
    height: 22px !important;
}
.edt .btn,
.edt .b1r, .edt .b2r {
    border: none !important;
}
.bar_swch {
    display: block;
    clear: both;
    margin-left: 4px !important;
    padding-top: 5px !important;
}
/* 进度条关闭按钮*/
a.progressCancel {
    display: block;
    float: right;
    width: 16px; /* 修改为16px */
    height: 16px; /* 修改为16px */
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    background: #999; /* 设置背景为黑色 */
    border-radius: 50%; /* 设置圆形按钮 */
    position: relative; /* 确保可以使用伪元素定位 */
    transition: background 0.15s ease; /* 设置背景颜色过渡 */
}
a.progressCancel:hover {
    background: red; /* hover时背景颜色为红色 */
}
a.progressCancel::before,
a.progressCancel::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px; /* 调整线条长度为8px */
    height: 2px; /* "X"的线条粗细 */
    background: white; /* 白色线条 */
    transform: translate(-50%, -50%) rotate(45deg); /* 旋转45度 */
    transition: background 0.15s ease; /* 添加过渡效果 */
}
a.progressCancel::after {
    transform: translate(-50%, -50%) rotate(-45deg); /* 旋转-45度 */
}
/* 进度条关闭按钮结束*/

#e_simple, #e_fullswitcher {
    border: 1px solid #C2D5E3;
    background: none !important;
}
.ntc_l .d {
    width: 14px;
    height: 14px;
    background: #000;
    border-radius: 7px;
    text-align: center;
    text-decoration: none;
    line-height: 14px;
    overflow: hidden;
    position: relative;
    margin-top: 3px;
}
.webuploader-element-invisible {
    position: absolute;
    inset: 2px auto auto 10px;
    width: 107px;
    height: 25px;
    overflow: hidden;
    margin-left: -10px;
}
.ntc_l .d::before,
.ntc_l .d::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px; /* X线条长度 */
    height: 2px; /* X线条粗细 */
    background: white; /* X线条颜色 */
    transform: translate(-50%, -50%) rotate(45deg); /* 旋转45度 */
    transition: background 0.15s ease; /* 过渡效果 */
}
.ntc_l .d::after {
    transform: translate(-50%, -50%) rotate(-45deg); /* 旋转-45度 */
}
.ntc_l .d:hover {
    background: red !important;
}
#rt_rt_1ik525tbaom4cdte5h1om08sf1 {
    position: absolute;
    inset: 0px auto auto 0px;
    width: 20px;
    height: 25px;
    overflow: hidden;
}
.simpleedt .bar, .simpleedt .b1r, .simpleedt .b2r {
    height: 24px !important;
}
/*---- ---- ---- ---- ---- ---  ---- ---其他---- ---- --- ---- ---- --- ----*/
.zoominner {
    border-radius: 8px;
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.2);
}
.bm.bmw {
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
}
.bmw .bm_h {
    border: none;
    background: #1985dc;
    color: #fff;
}
.fpd a.fbld {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0xMS42MyA3LjgyQzEyLjQ2IDcuMjQgMTMgNi4zOCAxMyA1LjUgMTMgMy41NyAxMS40MyAyIDkuNSAySDR2MTJoNi4yNWMxLjc5IDAgMy4yNS0xLjQ2IDMuMjUtMy4yNSAwLTEuMy0uNzctMi40MS0xLjg3LTIuOTN6TTYuNSA0aDIuNzVjLjgzIDAgMS41LjY3IDEuNSAxLjVTMTAuMDggNyA5LjI1IDdINi41VjR6bTMuMjUgOEg2LjVWOWgzLjI1Yy44MyAwIDEuNS42NyAxLjUgMS41cy0uNjcgMS41LTEuNSAxLjV6Ii8+CiAgICA8cGF0aCBkPSJNMCAwaDE4djE4SDB6IiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo=) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;

    }
#e_bold {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0xMS42MyA3LjgyQzEyLjQ2IDcuMjQgMTMgNi4zOCAxMyA1LjUgMTMgMy41NyAxMS40MyAyIDkuNSAySDR2MTJoNi4yNWMxLjc5IDAgMy4yNS0xLjQ2IDMuMjUtMy4yNSAwLTEuMy0uNzctMi40MS0xLjg3LTIuOTN6TTYuNSA0aDIuNzVjLjgzIDAgMS41LjY3IDEuNSAxLjVTMTAuMDggNyA5LjI1IDdINi41VjR6bTMuMjUgOEg2LjVWOWgzLjI1Yy44MyAwIDEuNS42NyAxLjUgMS41cy0uNjcgMS41LTEuNSAxLjV6Ii8+CiAgICA8cGF0aCBkPSJNMCAwaDE4djE4SDB6IiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo=) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
    }
#e_italic {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik03IDJ2MmgyLjU4bC0zLjY2IDhIM3YyaDh2LTJIOC40MmwzLjY2LThIMTVWMnoiLz4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KPC9zdmc+Cg==) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
    }
#e_underline {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik05IDEzYzIuNzYgMCA1LTIuMjQgNS01VjFoLTIuNXY3YzAgMS4zOC0xLjEyIDIuNS0yLjUgMi41UzYuNSA5LjM4IDYuNSA4VjFINHY3YzAgMi43NiAyLjI0IDUgNSA1em0tNiAydjJoMTJ2LTJIM3oiLz4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KPC9zdmc+Cg==) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
    }
.fpd a.fclr {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGZpbGwtb3BhY2l0eT0iLjM2IiBkPSJNMCAxNWgxOHYzSDB6Ii8+CiAgICA8cGF0aCBkPSJNMCAwaDE4djE4SDB6IiBmaWxsPSJub25lIi8+CiAgICA8cGF0aCBkPSJNMTAgMUg4TDMuNSAxM2gybDEuMTItM2g0Ljc1bDEuMTIgM2gyTDEwIDF6TTcuMzggOEw5IDMuNjcgMTAuNjIgOEg3LjM4eiIvPgo8L3N2Zz4K) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
    }
.fpd a.flnk {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik0xLjkgOWMwLTEuMTYuOTQtMi4xIDIuMS0yLjFoNFY1SDRDMS43OSA1IDAgNi43OSAwIDlzMS43OSA0IDQgNGg0di0xLjlINGMtMS4xNiAwLTIuMS0uOTQtMi4xLTIuMXpNMTQgNWgtNHYxLjloNGMxLjE2IDAgMi4xLjk0IDIuMSAyLjEgMCAxLjE2LS45NCAyLjEtMi4xIDIuMWgtNFYxM2g0YzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00em0tOCA1aDZWOEg2djJ6Ii8+Cjwvc3ZnPgo=) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;

    }
.fpd a.fmg {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik0yMSAxOVY1YzAtMS4xLS45LTItMi0ySDVjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJ6TTguNSAxMy41bDIuNSAzLjAxTDE0LjUgMTJsNC41IDZINWwzLjUtNC41eiIvPgo8L3N2Zz4K) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;

}
.fpd a.fsml {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik02IDhjLjU1IDAgMS0uNDUgMS0xcy0uNDUtMS0xLTEtMSAuNDUtMSAxIC40NSAxIDEgMXptNiAwYy41NSAwIDEtLjQ1IDEtMXMtLjQ1LTEtMS0xLTEgLjQ1LTEgMSAuNDUgMSAxIDF6bS0zIDUuNWMyLjE0IDAgMy45Mi0xLjUgNC4zOC0zLjVINC42MmMuNDYgMiAyLjI0IDMuNSA0LjM4IDMuNXpNOSAxQzQuNTcgMSAxIDQuNTggMSA5czMuNTcgOCA4IDggOC0zLjU4IDgtOC0zLjU4LTgtOC04em0wIDE0LjVjLTMuNTkgMC02LjUtMi45MS02LjUtNi41UzUuNDEgMi41IDkgMi41czYuNSAyLjkxIDYuNSA2LjUtMi45MSA2LjUtNi41IDYuNXoiLz4KPC9zdmc+Cg==) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;

}
.fpd a.fqt {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0xMCA1djVoMi43NUwxMSAxM2gyLjI1TDE1IDEwVjVoLTV6bS03IDVoMi43NUw0IDEzaDIuMjVMOCAxMFY1SDN2NXoiLz4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KPC9zdmc+Cg==) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;

}
.fpd a.fcd {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0wIDBoMjR2MjRIMFYweiIvPgogICAgPHBhdGggZD0iTTkuNCAxNi42TDQuOCAxMmw0LjYtNC42TDggNmwtNiA2IDYgNiAxLjQtMS40em01LjIgMGw0LjYtNC42LTQuNi00LjZMMTYgNmw2IDYtNiA2LTEuNC0xLjR6Ii8+Cjwvc3ZnPgo=) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;

}
#e_quote {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0xMCA1djVoMi43NUwxMSAxM2gyLjI1TDE1IDEwVjVoLTV6bS03IDVoMi43NUw0IDEzaDIuMjVMOCAxMFY1SDN2NXoiLz4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KPC9zdmc+Cg==) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
}
#e_code {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0wIDBoMjR2MjRIMFYweiIvPgogICAgPHBhdGggZD0iTTkuNCAxNi42TDQuOCAxMmw0LjYtNC42TDggNmwtNiA2IDYgNiAxLjQtMS40em01LjIgMGw0LjYtNC42LTQuNi00LjZMMTYgNmw2IDYtNiA2LTEuNC0xLjR6Ii8+Cjwvc3ZnPgo=) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
}
#e_forecolor {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGZpbGwtb3BhY2l0eT0iLjM2IiBkPSJNMCAxNWgxOHYzSDB6Ii8+CiAgICA8cGF0aCBkPSJNMCAwaDE4djE4SDB6IiBmaWxsPSJub25lIi8+CiAgICA8cGF0aCBkPSJNMTAgMUg4TDMuNSAxM2gybDEuMTItM2g0Ljc1bDEuMTIgM2gyTDEwIDF6TTcuMzggOEw5IDMuNjcgMTAuNjIgOEg3LjM4eiIvPgo8L3N2Zz4K) no-repeat center center;
    background-size: 14px !important;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
    }
#e_backcolor {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGZpbGwtb3BhY2l0eT0iLjM2IiBkPSJNMCAxNWgxOHYzSDB6Ii8+CiAgICA8cGF0aCBkPSJNMTQuNSA4Ljg3UzEzIDEwLjQ5IDEzIDExLjQ5YzAgLjgzLjY3IDEuNSAxLjUgMS41czEuNS0uNjcgMS41LTEuNWMwLS45OS0xLjUtMi42Mi0xLjUtMi42MnptLTEuNzktMi4wOEw1LjkxIDAgNC44NSAxLjA2bDEuNTkgMS41OS00LjE1IDQuMTRjLS4zOS4zOS0uMzkgMS4wMiAwIDEuNDFsNC41IDQuNWMuMi4yLjQ1LjMuNzEuM3MuNTEtLjEuNzEtLjI5bDQuNS00LjVjLjM5LS4zOS4zOS0xLjAzIDAtMS40MnpNNC4yMSA3TDcuNSAzLjcxIDEwLjc5IDdINC4yMXoiLz4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KPC9zdmc+Cg==) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
    }

#e_autotypeset {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0yIDE2aDE0di0ySDJ2MnptMC00aDE0di0ySDJ2MnpNMiAydjJoMTRWMkgyem0wIDZoMTRWNkgydjJ6Ii8+CiAgICA8cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDE4djE4SDB6Ii8+Cjwvc3ZnPgo=) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
}
#e_justifyleft {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0yIDE2aDEwdi0ySDJ2MnpNMTIgNkgydjJoMTBWNnpNMiAydjJoMTRWMkgyem0wIDEwaDE0di0ySDJ2MnoiLz4KICAgIDxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0wIDBoMTh2MThIMHoiLz4KPC9zdmc+Cg==) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
}
#e_tbl {
    background: transparent url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIA0KICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciDQogIHdpZHRoPSIyNCINCiAgaGVpZ2h0PSIyNCINCiAgdmlld0JveD0iMCAwIDI0IDI0Ig0KICBmaWxsPSJub25lIg0KICBzdHJva2U9IiMwMDAwMDAiDQogIHN0cm9rZS13aWR0aD0iMiINCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIg0KICBzdHJva2UtbGluZWpvaW49InJvdW5kIg0KPg0KICA8cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiIgLz4NCiAgPGxpbmUgeDE9IjMiIHkxPSI5IiB4Mj0iMjEiIHkyPSI5IiAvPg0KICA8bGluZSB4MT0iMyIgeTE9IjE1IiB4Mj0iMjEiIHkyPSIxNSIgLz4NCiAgPGxpbmUgeDE9IjkiIHkxPSI5IiB4Mj0iOSIgeTI9IjIxIiAvPg0KICA8bGluZSB4MT0iMTUiIHkxPSI5IiB4Mj0iMTUiIHkyPSIyMSIgLz4NCjwvc3ZnPg==) no-repeat center center;
    background-size: 16px;
    width: 20px !important;
    height: 22px !important;
    background-position: 3px 3px !important;
}
#e_justifycenter {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik00IDE0djJoMTB2LTJINHptMC04djJoMTBWNkg0em0tMiA2aDE0di0ySDJ2MnpNMiAydjJoMTRWMkgyeiIvPgo8L3N2Zz4K) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 3px 4px !important;
}
#e_justifyright {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik02IDE2aDEwdi0ySDZ2MnptLTQtNGgxNHYtMkgydjJ6TTIgMnYyaDE0VjJIMnptNCA2aDEwVjZINnYyeiIvPgogICAgPHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxOHYxOEgweiIvPgo8L3N2Zz4K) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
}
#e_insertorderedlist {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0yIDEzaDJ2LjVIM3YxaDF2LjVIMnYxaDN2LTRIMnYxem0wLTVoMS44TDIgMTAuMXYuOWgzdi0xSDMuMkw1IDcuOVY3SDJ2MXptMS0yaDFWMkgydjFoMXYzem00LTN2Mmg5VjNIN3ptMCAxMmg5di0ySDd2MnptMC01aDlWOEg3djJ6Ii8+Cjwvc3ZnPgo=) no-repeat center center;
    background-size: 16px;
    width: 20px !important;
    height: 22px !important;
    background-position: 3px 3px !important;
}
#e_insertunorderedlist {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik03IDEwaDlWOEg3djJ6bTAtN3YyaDlWM0g3em0wIDEyaDl2LTJIN3Yyem0tNC01aDJWOEgzdjJ6bTAtN3YyaDJWM0gzem0wIDEyaDJ2LTJIM3YyeiIvPgo8L3N2Zz4K) no-repeat center center;
    background-size: 16px;
    width: 20px !important;
    height: 22px !important;
    background-position: 2px 3px !important;
}
#e_removeformat {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHptMCAwaDE4djE4SDB6bTAgMGgxOHYxOEgweiIgZmlsbD0ibm9uZSIvPgogICAgPHBhdGggZD0iTTIuMjcgNC41NUw3LjQzIDkuNyA1IDE1aDIuNWwxLjY0LTMuNThMMTMuNzMgMTYgMTUgMTQuNzMgMy41NSAzLjI3IDIuMjcgNC41NXpNNS44MiAzbDIgMmgxLjc2bC0uNTUgMS4yMSAxLjcxIDEuNzFMMTIuMDggNUgxNlYzSDUuODJ6Ii8+Cjwvc3ZnPgo=) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
}
#e_inserthorizontalrule {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgICA8ZGVmcz4KICAgICAgICA8cGF0aCBpZD0iYSIgZD0iTTAgMGgyNHYyNEgwVjB6Ii8+CiAgICA8L2RlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImIiPgogICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI2EiIG92ZXJmbG93PSJ2aXNpYmxlIi8+CiAgICA8L2NsaXBQYXRoPgogICAgPHBhdGggY2xpcC1wYXRoPSJ1cmwoI2IpIiBkPSJNMjAgOUg0djJoMTZWOXpNNCAxNWgxNnYtMkg0djJ6Ii8+Cjwvc3ZnPgo=) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
}
#e_sml {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik02IDhjLjU1IDAgMS0uNDUgMS0xcy0uNDUtMS0xLTEtMSAuNDUtMSAxIC40NSAxIDEgMXptNiAwYy41NSAwIDEtLjQ1IDEtMXMtLjQ1LTEtMS0xLTEgLjQ1LTEgMSAuNDUgMSAxIDF6bS0zIDUuNWMyLjE0IDAgMy45Mi0xLjUgNC4zOC0zLjVINC42MmMuNDYgMiAyLjI0IDMuNSA0LjM4IDMuNXpNOSAxQzQuNTcgMSAxIDQuNTggMSA5czMuNTcgOCA4IDggOC0zLjU4IDgtOC0zLjU4LTgtOC04em0wIDE0LjVjLTMuNTkgMC02LjUtMi45MS02LjUtNi41UzUuNDEgMi41IDkgMi41czYuNSAyLjkxIDYuNSA2LjUtMi45MSA2LjUtNi41IDYuNXoiLz4KPC9zdmc+Cg==) no-repeat center center;
    background-size: 25px;
    width: 35px !important;
    height: 15px !important;
    background-position: 6px 4px !important;
}
#e_image {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik0yMSAxOVY1YzAtMS4xLS45LTItMi0ySDVjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJ6TTguNSAxMy41bDIuNSAzLjAxTDE0LjUgMTJsNC41IDZINWwzLjUtNC41eiIvPgo8L3N2Zz4K) no-repeat center center;
    background-size: 25px;
    width: 35px !important;
    height: 15px !important;
    background-position: 6px 4px !important;
}
#e_attach {
    background: transparent url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgZGF0YS1uYW1lPSJMYXllciAyIj4KICAgIDxnIGRhdGEtbmFtZT0iYXR0YWNoIj4KICAgICAgPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBvcGFjaXR5PSIwIi8+CiAgICAgIDxwYXRoIGQ9Ik05LjI5IDIxYTYuMjMgNi4yMyAwIDAgMS00LjQzLTEuODggNiA2IDAgMCAxLS4yMi04LjQ5TDEyIDMuMkE0LjExIDQuMTEgMCAwIDEgMTUgMmE0LjQ4IDQuNDggMCAwIDEgMy4xOSAxLjM1IDQuMzYgNC4zNiAwIDAgMSAuMTUgNi4xM2wtNy40IDcuNDNhMi41NCAyLjU0IDAgMCAxLTEuODEuNzUgMi43MiAyLjcyIDAgMCAxLTEuOTUtLjgyIDIuNjggMi42OCAwIDAgMS0uMDgtMy43N2w2LjgzLTYuODZhMSAxIDAgMCAxIDEuMzcgMS40MWwtNi44MyA2Ljg2YS42OC42OCAwIDAgMCAuMDguOTUuNzguNzggMCAwIDAgLjUzLjIzLjU2LjU2IDAgMCAwIC40LS4xNmw3LjM5LTcuNDNhMi4zNiAyLjM2IDAgMCAwLS4xNS0zLjMxIDIuMzggMi4zOCAwIDAgMC0zLjI3LS4xNUw2LjA2IDEyYTQgNCAwIDAgMCAuMjIgNS42NyA0LjIyIDQuMjIgMCAwIDAgMyAxLjI5IDMuNjcgMy42NyAwIDAgMCAyLjYxLTEuMDZsNy4zOS03LjQzYTEgMSAwIDEgMSAxLjQyIDEuNDFsLTcuMzkgNy40M0E1LjY1IDUuNjUgMCAwIDEgOS4yOSAyMXoiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==) no-repeat center center;
    background-size: 25px !important;
    width: 35px !important;
    height: 15px !important;
    background-position: 6px 4px !important;
}
#e_free {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0wIDBoMjR2MjRIMFYweiIvPgogICAgPHBhdGggZD0iTTIwIDNINHYxMGMwIDIuMjEgMS43OSA0IDQgNGg2YzIuMjEgMCA0LTEuNzkgNC00di0zaDJjMS4xMSAwIDItLjkgMi0yVjVjMC0xLjExLS44OS0yLTItMnptMCA1aC0yVjVoMnYzek00IDE5aDE2djJINHoiLz4KPC9zdmc+Cg==) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
}
#e_index {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik04IDEyaDh2LTJIOHYyem0wLTRoOFY2SDh2MnptOCA2SDJ2MmgxNHYtMnpNMiA5bDMuNSAzLjV2LTdMMiA5em0wLTd2MmgxNFYySDJ6Ii8+CiAgICA8cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDE4djE4SDBWMHoiLz4KPC9zdmc+Cg==) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
}
#e_page {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik01LjUgMTBIMnY1YzAgLjU1LjQ1IDEgMSAxaDV2LTMuNWwtMy41IDEgMS0zLjV6TTIgM3Y1aDMuNWwtMS0zLjUgMy41IDFWMkgzYy0uNTUgMC0xIC40NS0xIDF6bTEzLTFoLTV2My41bDMuNS0xLTEgMy41SDE2VjNjMC0uNTUtLjQ1LTEtMS0xem0tMS41IDExLjVsLTMuNS0xVjE2aDVjLjU1IDAgMS0uNDUgMS0xdi01aC0zLjVsMSAzLjV6Ii8+CiAgICA8cGF0aCBkPSJNMCAwaDE4djE4SDB6IiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo=) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
}
#e_undo {
    background: transparent url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8dGl0bGU+dW5kbzwvdGl0bGU+CiAgPHBhdGggZD0iTTQ0OCAzODRRMzg5IDMzNiAzMzUgMzEyIDI4MCAyODggMjI0IDI4OEwyMjQgMzgwIDYwIDIxNiAyMjQgNTIgMjI0IDE0NFEzMjAgMTY2IDM3NCAyMjIgNDI4IDI3NyA0NDggMzg0WiIvPgo8L3N2Zz4=) no-repeat center center;
    background-size: 14px !important;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
}
#e_redo {
    background: transparent url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8dGl0bGU+cmVkbzwvdGl0bGU+CiAgPHBhdGggZD0iTTY0IDM4NFE4NCAyNzcgMTM4IDIyMiAxOTIgMTY2IDI4OCAxNDRMMjg4IDUyIDQ1MiAyMTYgMjg4IDM4MCAyODggMjg4UTIzMiAyODggMTc4IDMxMiAxMjMgMzM2IDY0IDM4NFoiLz4KPC9zdmc+) no-repeat center center;
    background-size: 14px !important;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
}
#e_password {
    background: transparent url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgNDggNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiI+CiAgICA8ZyBpZD0iaW52aXNpYmxlX2JveCIgZGF0YS1uYW1lPSJpbnZpc2libGUgYm94Ij4KICAgICAgPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSJub25lIi8+CiAgICA8L2c+CiAgICA8ZyBpZD0iTGF5ZXJfNyIgZGF0YS1uYW1lPSJMYXllciA3Ij4KICAgICAgPHBhdGggZD0iTTM5LDE4SDM1VjEzQTExLDExLDAsMCwwLDI0LDJIMjJBMTEsMTEsMCwwLDAsMTEsMTN2NUg3YTIsMiwwLDAsMC0yLDJWNDRhMiwyLDAsMCwwLDIsMkgzOWEyLDIsMCwwLDAsMi0yVjIwQTIsMiwwLDAsMCwzOSwxOFpNMTUsMTNhNyw3LDAsMCwxLDctN2gyYTcsNywwLDAsMSw3LDd2NUgxNVpNMTQsMzVhMywzLDAsMSwxLDMtM0EyLjksMi45LDAsMCwxLDE0LDM1Wm05LDBhMywzLDAsMSwxLDMtM0EyLjksMi45LDAsMCwxLDIzLDM1Wm05LDBhMywzLDAsMSwxLDMtM0EyLjksMi45LDAsMCwxLDMyLDM1WiIvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+) no-repeat center center;
    background-size: 14px !important;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
}
#e_postbg {
    background: transparent url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiBoZWlnaHQ9IjE4cHgiIHdpZHRoPSIxOHB4IiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj4KICA8Zz4KICAgIDxnPgogICAgICA8Zz4KICAgICAgICA8cGF0aCBkPSJNMjEuMzMzLDE5MmMxMS43OTcsMCwyMS4zMzMtOS41NTcsMjEuMzMzLTIxLjMzM3YtMjEuMzMzYzAtMTEuNzc2LTkuNTM2LTIxLjMzMy0yMS4zMzMtMjEuMzMzIEM5LjUzNiwxMjgsMCwxMzcuNTU3LDAsMTQ5LjMzM3YyMS4zMzNDMCwxODIuNDQzLDkuNTM2LDE5MiwyMS4zMzMsMTkyeiIvPgogICAgICAgIDxwYXRoIGQ9Ik0xOTIsNDIuNjY3aDIxLjMzM2MxMS43OTcsMCwyMS4zMzMtOS41NTcsMjEuMzMzLTIxLjMzM1MyMjUuMTMxLDAsMjEzLjMzMywwSDE5MmMtMTEuNzk3LDAtMjEuMzMzLDkuNTU3LTIxLjMzMywyMS4zMzMgUzE4MC4yMDMsNDIuNjY3LDE5Miw0Mi42Njd6Ii8+CiAgICAgICAgPHBhdGggZD0iTTIxLjMzMyw4NS4zMzNjMTEuNzk3LDAsMjEuMzMzLTkuNTU3LDIxLjMzMy0yMS4zMzNWNDIuNjY3YzAtMTEuNzc2LTkuNTM2LTIxLjMzMy0yMS4zMzMtMjEuMzMzIEM5LjUzNiwyMS4zMzMsMCwzMC44OTEsMCw0Mi42NjdWNjRDMCw3NS43NzYsOS41MzYsODUuMzMzLDIxLjMzMyw4NS4zMzN6Ii8+CiAgICAgICAgPHBhdGggZD0iTTMyMCw4NS4zMzNjLTExLjc5NywwLTIxLjMzMyw5LjU1Ny0yMS4zMzMsMjEuMzMzVjEyOGMwLDExLjc3Niw5LjUzNiwyMS4zMzMsMjEuMzMzLDIxLjMzM3MyMS4zMzMtOS41NTcsMjEuMzMzLTIxLjMzMyB2LTIxLjMzM0MzNDEuMzMzLDk0Ljg5MSwzMzEuNzk3LDg1LjMzMywzMjAsODUuMzMzeiIvPgogICAgICAgIDxwYXRoIGQ9Ik0yOTguNjY3LDQyLjY2N0gzMjBjMTEuNzk3LDAsMjEuMzMzLTkuNTU3LDIxLjMzMy0yMS4zMzNTMzMxLjc5NywwLDMyMCwwaC0yMS4zMzNjLTExLjc5NywwLTIxLjMzMyw5LjU1Ny0yMS4zMzMsMjEuMzMzIFMyODYuODY5LDQyLjY2NywyOTguNjY3LDQyLjY2N3oiLz4KICAgICAgICA8cGF0aCBkPSJNNDIuNjY3LDI1NmMwLTExLjc3Ni05LjUzNi0yMS4zMzMtMjEuMzMzLTIxLjMzM0M5LjUzNiwyMzQuNjY3LDAsMjQ0LjIyNCwwLDI1NnYyMS4zMzMgYzAsMTEuNzc2LDkuNTM2LDIxLjMzMywyMS4zMzMsMjEuMzMzYzExLjc5NywwLDIxLjMzMy05LjU1NywyMS4zMzMtMjEuMzMzVjI1NnoiLz4KICAgICAgICA8cGF0aCBkPSJNMTA2LjY2NywwSDg1LjMzM0M3My41MzYsMCw2NCw5LjU1Nyw2NCwyMS4zMzNzOS41MzYsMjEuMzMzLDIxLjMzMywyMS4zMzNoMjEuMzMzYzExLjc5NywwLDIxLjMzMy05LjU1NywyMS4zMzMtMjEuMzMzIFMxMTguNDY0LDAsMTA2LjY2NywweiIvPgogICAgICAgIDxwYXRoIGQ9Ik04NS4zMzMsMjk4LjY2N0g2NGMtMTEuNzk3LDAtMjEuMzMzLDkuNTU3LTIxLjMzMywyMS4zMzNTNTIuMjAzLDM0MS4zMzMsNjQsMzQxLjMzM2gyMS4zMzMgYzExLjc5NywwLDIxLjMzMy05LjU1NywyMS4zMzMtMjEuMzMzUzk3LjEzMSwyOTguNjY3LDg1LjMzMywyOTguNjY3eiIvPgogICAgICAgIDxwYXRoIGQ9Ik00OTAuNjY3LDE3MC42NjdIMzIwYy0xMS43OTcsMC0yMS4zMzMsOS41NTctMjEuMzMzLDIxLjMzM3YyMS4zMzN2MjEuMzMzdjY0aC04NS4zMzNIMTkyaC0yMS4zMzMgYy0xMS43OTcsMC0yMS4zMzMsOS41NTctMjEuMzMzLDIxLjMzM3M5LjUzNiwyMS4zMzMsMjEuMzMzLDIxLjMzM3YxNDkuMzMzYzAsMTEuNzc2LDkuNTM2LDIxLjMzMywyMS4zMzMsMjEuMzMzaDI5OC42NjcgYzExLjc5NywwLDIxLjMzMy05LjU1NywyMS4zMzMtMjEuMzMzVjE5MkM1MTIsMTgwLjIyNCw1MDIuNDY0LDE3MC42NjcsNDkwLjY2NywxNzAuNjY3eiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=) no-repeat center center;
    background-size: 13px !important;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
}
#e_unlink {
    background: transparent url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMDAgMTAwIj4KICA8Zz4KICAgIDxwYXRoIGQ9Ik0xNi4yMDEsMjAuMzg2bDkuNzE5LDkuNzIxYzEuMTIsMS4xMTgsMi45MzUsMS4xMTgsNC4wNTQsMGMxLjExOC0xLjEyMSwxLjExOC0yLjkzMywwLTQuMDU1bC05LjY3OS05LjY3NyBjLTAuMDAyLTAuMDAzLTAuMDA0LTAuMDA1LTAuMDA2LTAuMDA4cy0wLjAwNS0wLjAwNC0wLjAwOC0wLjAwNmwtMC4wMjYtMC4wMjZsLTAuMDAzLDAuMDAzYy0xLjEyMi0xLjA4NS0yLjkwOS0xLjA3Ny00LjAxNywwLjAzIGMtMS4xMDcsMS4xMDgtMS4xMTUsMi44OTUtMC4wMyw0LjAxNUwxNi4yMDEsMjAuMzg2eiIvPgogICAgPHBhdGggZD0iTTMyLjg5OCwxNi41NDZsMy41NTgsMTMuMjc3YzAuNDEsMS41MjksMS45ODEsMi40MzcsMy41MSwyLjAyNmMxLjUyNy0wLjQwOSwyLjQzNS0xLjk4MSwyLjAyNy0zLjUxbC0zLjU0NS0xMy4yMjQgYzAtMC4wMDIsMC0wLjAwNS0wLjAwMS0wLjAwN3MtMC4wMDItMC4wMDQtMC4wMDMtMC4wMDdsLTAuMDExLTAuMDRsLTAuMDA0LDAuMDAxYy0wLjQyOS0xLjUtMS45OC0yLjM4Ny0zLjQ5My0xLjk4MiBjLTEuNTEzLDAuNDA1LTIuNDEzLDEuOTQ5LTIuMDM1LDMuNDYzTDMyLjg5OCwxNi41NDZ6Ii8+CiAgICA8cGF0aCBkPSJNMTYuMDU0LDM5LjQyM2wtMC4wMDEsMC4wMDVsMC4wNDYsMC4wMTJjMCwwLDAuMDAxLDAsMC4wMDEsMGwwLjAwMSwwbDEzLjIyOSwzLjU0NGMxLjUzLDAuNDEsMy4xMDEtMC40OTgsMy41MTEtMi4wMjUgYzAuNDEtMS41MjktMC40OTgtMy4xMDEtMi4wMjYtMy41MUwxNy42LDMzLjkwOGMtMC4wMDUtMC4wMDItMC4wMS0wLjAwNS0wLjAxNi0wLjAwNnMtMC4wMTEtMC4wMDEtMC4wMTctMC4wMDNsLTAuMDMtMC4wMDggbC0wLjAwMSwwLjAwM2MtMS41MTUtMC4zNzctMy4wNTgsMC41MjMtMy40NjMsMi4wMzVDMTMuNjY4LDM3LjQ0MiwxNC41NTUsMzguOTkyLDE2LjA1NCwzOS40MjN6Ii8+CiAgICA8cGF0aCBkPSJNODMuNzk4LDc5LjYxM2wtOS43Mi05LjcyYy0xLjExOS0xLjExOS0yLjkzNC0xLjExOS00LjA1MywwYy0xLjExOCwxLjEyLTEuMTE4LDIuOTMzLDAsNC4wNTVsOS42NzksOS42NzcgYzAuMDAyLDAuMDAzLDAuMDA0LDAuMDA1LDAuMDA2LDAuMDA4YzAuMDAzLDAuMDAyLDAuMDA1LDAuMDA0LDAuMDA4LDAuMDA2bDAuMDI2LDAuMDI2bDAuMDAzLTAuMDAzIGMxLjEyMiwxLjA4NSwyLjkwOCwxLjA3Nyw0LjAxNy0wLjAzYzEuMTA3LTEuMTA4LDEuMTE1LTIuODk1LDAuMDMtNC4wMTZMODMuNzk4LDc5LjYxM3oiLz4KICAgIDxwYXRoIGQ9Ik02Ny4xMDEsODMuNDU0bC0zLjU1OS0xMy4yNzdjLTAuNDEtMS41MjktMS45OC0yLjQzNi0zLjUxLTIuMDI2Yy0xLjUzLDAuNDA5LTIuNDM2LDEuOTgxLTIuMDI3LDMuNTA5bDMuNTQ2LDEzLjIzMSBjMCwwLDAsMC4wMDEsMCwwLjAwMWMwLDAuMDAxLDAsMC4wMDEsMCwwLjAwMWwwLjAxMiwwLjA0NWwwLjAwNS0wLjAwMWMwLjQyOCwxLjUwMSwxLjk4LDIuMzg3LDMuNDkzLDEuOTgzIGMxLjUxMy0wLjQwNiwyLjQxMi0xLjk1LDIuMDM0LTMuNDYzTDY3LjEwMSw4My40NTR6Ii8+CiAgICA8cGF0aCBkPSJNODMuOTQzLDYwLjU3N2wwLjAwMS0wLjAwNGwtMC4wNDEtMC4wMTFjLTAuMDAyLDAtMC4wMDMtMC4wMDEtMC4wMDUtMC4wMDJjLTAuMDAyLDAtMC4wMDMsMC0wLjAwNS0wLjAwMWwtMTMuMjI2LTMuNTQ0IGMtMS41My0wLjQxLTMuMSwwLjQ5OS0zLjUxMSwyLjAyNmMtMC40MDksMS41MjksMC40OTgsMy4xLDIuMDI3LDMuNTExbDEzLjIyNCwzLjU0MmMwLjAwMiwwLjAwMSwwLjAwNCwwLjAwMiwwLjAwNiwwLjAwMiBjMC4wMDIsMC4wMDEsMC4wMDUsMCwwLjAwNywwLjAwMWwwLjA0LDAuMDExbDAuMDAxLTAuMDA0YzEuNTE0LDAuMzc4LDMuMDU4LTAuNTIyLDMuNDYyLTIuMDM1IEM4Ni4zMzEsNjIuNTU3LDg1LjQ0Myw2MS4wMDYsODMuOTQzLDYwLjU3N3oiLz4KICAgIDxwYXRoIGQ9Ik00OC4yMTIsNTEuNzU2Yy03LjU1Mi03LjU1Mi0xOS42NDgtNy43OS0yNy40ODYtMC43MTNsLTAuMDE5LTAuMDE5TDEwLjYxLDYxLjEyMWMtNy43OTcsNy43OTctNy43OTcsMjAuNDQsMCwyOC4yMzcgYzcuNzk3LDcuNzk4LDIwLjQzOSw3Ljc5OCwyOC4yMzcsMGwxMC4wOTgtMTAuMDk4bC0wLjAxOS0wLjAxOUM1Ni4wMDEsNzEuNDA0LDU1Ljc2NCw1OS4zMDgsNDguMjEyLDUxLjc1NnogTTQxLjY1OSw3Mi41NTggbC0wLjYxOSwwLjYxOWwtMC4wMDEsMC4wMDFsLTAuMDAxLDBsLTkuMDA1LDkuMDA1bC0wLjAwMSwwLjAwMWMtMy45MzUsMy45MzUtMTAuMzE0LDMuOTM1LTE0LjI0OCwwcy0zLjkzNS0xMC4zMTQsMC0xNC4yNDggbDAuMDAxLTAuMDAxbDkuMDA1LTkuMDA2bDAuMDAxLTAuMDAxbDAuMDAxLTAuMDAxbDAuNjE5LTAuNjE5bDAuMDI5LDAuMDI4YzMuOTU5LTMuMzI5LDkuODc0LTMuMTM0LDEzLjYsMC41OTEgYzMuNzI2LDMuNzI2LDMuOTIxLDkuNjQyLDAuNTkxLDEzLjZMNDEuNjU5LDcyLjU1OHoiLz4KICAgIDxwYXRoIGQ9Ik04OS4zODksMTAuNjQxYy03LjU1Mi03LjU1Mi0xOS42NDgtNy43OS0yNy40ODYtMC43MTNsLTAuMDE5LTAuMDE5TDUxLjc4NywyMC4wMDZjLTcuNzk3LDcuNzk3LTcuNzk3LDIwLjQ0LDAsMjguMjM3IGM3Ljc5Nyw3Ljc5OCwyMC40MzksNy43OTgsMjguMjM3LDBsMTAuMDk4LTEwLjA5OGwtMC4wMTktMC4wMTlDOTcuMTc4LDMwLjI4OSw5Ni45NDEsMTguMTkzLDg5LjM4OSwxMC42NDF6IE04Mi44MzYsMzEuNDQzIGwtMC42MTksMC42MTlsLTAuMDAxLDAuMDAxbC0wLjAwMSwwbC05LjAwNSw5LjAwNWwtMC4wMDEsMC4wMDFjLTMuOTM1LDMuOTM1LTEwLjMxNCwzLjkzNS0xNC4yNDgsMCBjLTMuOTM1LTMuOTM1LTMuOTM1LTEwLjMxNCwwLTE0LjI0OGwwLjAwMS0wLjAwMWw5LjAwNS05LjAwNmMwLDAsMCwwLDAuMDAxLTAuMDAxbDAuMDAxLTAuMDAxbDAuNjE5LTAuNjE5bDAuMDI5LDAuMDI4IGMzLjk1OS0zLjMyOSw5Ljg3NC0zLjEzNCwxMy42LDAuNTkxczMuOTIxLDkuNjQyLDAuNTkxLDEzLjZMODIuODM2LDMxLjQ0M3oiLz4KICA8L2c+Cjwvc3ZnPg==) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
}
#e_floatleft {
    background: transparent url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMTggMTgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTEuNSAwQzAuNjcxNTczIDAgMCAwLjY3MTU3MyAwIDEuNVY1LjVDMCA2LjMyODQzIDAuNjcxNTczIDcgMS41IDdINS41QzYuMzI4NDMgNyA3IDYuMzI4NDMgNyA1LjVWMS41QzcgMC42NzE1NzMgNi4zMjg0MyAwIDUuNSAwSDEuNVoiIGZpbGw9IiMwMDAwMDAiLz4KICA8cGF0aCBkPSJNOSAySDE1VjFIOVYyWiIgZmlsbD0iIzAwMDAwMCIvPgogIDxwYXRoIGQ9Ik05IDZIMTVWNUg5VjZaIiBmaWxsPSIjMDAwMDAwIi8+CiAgPHBhdGggZD0iTTAgMTBIMTVWOUgwVjEwWiIgZmlsbD0iIzAwMDAwMCIvPgogIDxwYXRoIGQ9Ik0wIDE0SDE1VjEzSDBWMTRaIiBmaWxsPSIjMDAwMDAwIi8+Cjwvc3ZnPg==) no-repeat center center;
    background-size: 14px !important;
    width: 20px !important;
    height: 22px !important;
    background-position: 5px 5px !important;
}
#e_floatright {
    background: transparent url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMTUgMTUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTkuNSAwQzguNjcxNTcgMCA4IDAuNjcxNTczIDggMS41VjUuNUM4IDYuMzI4NDMgOC42NzE1NyA3IDkuNSA3SDEzLjVDMTQuMzI4NCA3IDE1IDYuMzI4NDMgMTUgNS41VjEuNUMxNSAwLjY3MTU3MyAxNC4zMjg0IDAgMTMuNSAwSDkuNVoiIGZpbGw9IiMwMDAwMDAiLz4KICA8cGF0aCBkPSJNMCAySDZWMUgwVjJaIiBmaWxsPSIjMDAwMDAwIi8+CiAgPHBhdGggZD0iTTAgNkg2VjVIMFY2WiIgZmlsbD0iIzAwMDAwMCIvPgogIDxwYXRoIGQ9Ik0wIDEwSDE1VjlIMFYxMFoiIGZpbGw9IiMwMDAwMDAiLz4KICA8cGF0aCBkPSJNMCAxNEgxNVYxM0gwVjE0WiIgZmlsbD0iIzAwMDAwMCIvPgo8L3N2Zz4=) no-repeat center center;
    background-size: 12px !important;
    width: 20px !important;
    height: 22px !important;
    background-position: 5px 5px !important;
}
#e_pasteword {
    background: transparent url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMTkyIDE5MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSJub25lIj4KICA8cGF0aCBkPSJNNTYgMzBjMC0xLjY2MiAxLjMzOC0zIDMtM2gxMDhjMS42NjIgMCAzIDEuMzM4IDMgM3YxMzJjMCAxLjY2Mi0xLjMzOCAzLTMgM0g1OWMtMS42NjIgMC0zLTEuMzM4LTMtM3YtMzJtMC02OFYzMCIgc3R5bGU9ImZpbGwtb3BhY2l0eTouNDAyNjU4O3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxMjtzdHJva2UtbGluZWNhcDpyb3VuZDtwYWludC1vcmRlcjpzdHJva2UgZmlsbCBtYXJrZXJzIi8+CiAgPHJlY3Qgd2lkdGg9IjY4IiBoZWlnaHQ9IjY4IiB4PSItNTguMSIgeT0iNDAuMyIgcng9IjMiIHN0eWxlPSJmaWxsOm5vbmU7ZmlsbC1vcGFjaXR5Oi40MDI2NTg7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MTtwYWludC1vcmRlcjpzdHJva2UgZmlsbCBtYXJrZXJzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4MC4xIDIxLjcpIi8+CiAgPHBhdGggZD0iTTU1Ljk0NCA1OC43OTFIMTcwTTE3MCA5Nkg5MC4zMjhNMTY5IDEzMy4yMUg1NS45NDQiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIvPgogIDxwYXRoIGQ9Im03MyA4Mi04LjUgMjhtMCAwTDU2IDgybC04LjUgMjhNMzkgODJsOC41IDI4IiBzdHlsZT0iZm9udC12YXJpYXRpb24tc2V0dGluZ3M6bm9ybWFsO3ZlY3Rvci1lZmZlY3Q6bm9uZTtmaWxsOm5vbmU7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowO3N0cm9rZS1vcGFjaXR5OjE7LWlua3NjYXBlLXN0cm9rZTpub25lO3N0b3AtY29sb3I6IzAwMCIvPgo8L3N2Zz4=) no-repeat center center;
    background-size: 16px !important;
    width: 20px !important;
    height: 22px !important;
    background-position: 3px 3px !important;
}
#e_imagen, #e_attachn {
    background: transparent url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIDAgNDM3LjY5OSA0MzcuNjk5Ij4KICA8Zz4KICAgIDxwYXRoIGQ9Ik0zNzIuNTc4LDYzLjEwMWMtNDEuMTgtMzIuMzMyLTk1Ljc3NS01MC4xMzgtMTUzLjcyNy01MC4xMzhjLTU3Ljk1MiwwLTExMi41NDcsMTcuODA2LTE1My43MjgsNTAuMTM4IEMyMy4xMjcsOTYuMDczLDAsMTQwLjE2MiwwLDE4Ny4yNDRjMCw0Ny42ODgsMjQuNTM2LDkzLjI0Niw2Ny41ODksMTI2LjAyN2wtMjAuODEsOTcuNjU2Yy0wLjg5Myw0LjE4NiwwLjYyOSw4LjUxOCwzLjk0LDExLjIyNyBjMi4wNzksMS43MDEsNC42NDUsMi41ODIsNy4yMzcsMi41ODJjMS41MzgsMCwzLjA4Ny0wLjMxMSw0LjU0OC0wLjk0M2wxNDQuMDYzLTYyLjUzOWM0LjEwNCwwLjE4LDguMjIzLDAuMjcxLDEyLjI4MiwwLjI3MSBjNTcuOTUyLDAsMTEyLjU0NS0xNy44MDcsMTUzLjcyNy01MC4xMzljNDEuOTk2LTMyLjk3Myw2NS4xMjMtNzcuMDYxLDY1LjEyMy0xMjQuMTQ0IEM0MzcuNzAxLDE0MC4xNjIsNDE0LjU3NCw5Ni4wNzMsMzcyLjU3OCw2My4xMDF6IE0yMTguODUyLDMwNC4zOTNjLTE1LjcwOSwwLTI4LjQ5LTEyLjc4LTI4LjQ5LTI4LjQ4OSBjMC0xNS43MSwxMi43ODEtMjguNDkxLDI4LjQ5LTI4LjQ5MWMxNS43MDgsMCwyOC40OSwxMi43ODEsMjguNDksMjguNDkxQzI0Ny4zNDIsMjkxLjYxMiwyMzQuNTYxLDMwNC4zOTMsMjE4Ljg1MiwzMDQuMzkzeiBNMjQwLjcyMSwyMTUuNTdjLTAuNzcxLDExLjQ0Ni0xMC4zNjcsMjAuNDE3LTIxLjg0NCwyMC40MTdjLTAuNDk5LDAtMS4wMDItMC4wMTYtMS41MDUtMC4wNTEgYy0xMC44NjctMC43MzctMTkuNjI0LTkuNDk4LTIwLjM1NS0yMC4zNzZsLTYuOTMxLTEwMi4wNTZjLTAuNTIyLTcuNjg2LDEuOTgtMTUuMTE4LDcuMDQ5LTIwLjkyNiBjNS4wNjgtNS44MDYsMTIuMDkyLTkuMjksMTkuNzc5LTkuODEzYzAuNjUzLTAuMDQ0LDEuMzEzLTAuMDY2LDEuOTYyLTAuMDY2YzE1LjExLDAsMjcuNzU3LDExLjgxMywyOC43NzgsMjYuODk0IEMyNDguMjAyLDExNi4yLDI0MC43MjEsMjE1LjU3LDI0MC43MjEsMjE1LjU3eiIgc3R5bGU9ImZpbGw6IHJnYigyNTUsIDE5OSwgMCk7Ii8+CiAgPC9nPgo8L3N2Zz4=) no-repeat center center !important;
    background-size: 14px !important;
    background-position: 0px 0px !important;
}
#e_url {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik0xLjkgOWMwLTEuMTYuOTQtMi4xIDIuMS0yLjFoNFY1SDRDMS43OSA1IDAgNi43OSAwIDlzMS43OSA0IDQgNGg0di0xLjlINGMtMS4xNiAwLTIuMS0uOTQtMi4xLTIuMXpNMTQgNWgtNHYxLjloNGMxLjE2IDAgMi4xLjk0IDIuMSAyLjEgMCAxLjE2LS45NCAyLjEtMi4xIDIuMWgtNFYxM2g0YzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00em0tOCA1aDZWOEg2djJ6Ii8+Cjwvc3ZnPgo=) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;

    }
#e_cst1_sup {
    background: transparent url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgNTYgNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTSA0My42NDQ1IDI4LjE0MDYgQyA0NC42OTkyIDI4LjE0MDYgNDUuMzU1NSAyNy40NjA5IDQ1LjM1NTUgMjYuNDc2NiBMIDQ1LjM1NTUgMTAuNDQ1MyBDIDQ1LjM1NTUgOS4yNzM1IDQ0LjY1MjQgOC41NzAzIDQzLjUwMzkgOC41NzAzIEMgNDIuNDcyNyA4LjU3MDMgNDEuOTU3MCA4Ljk0NTMgNDEuMjc3MyA5LjQzNzUgTCAzNy41MjczIDExLjk5MjIgQyAzNi44NzExIDEyLjQzNzUgMzYuNTg5OCAxMi44NTk0IDM2LjU4OTggMTMuMzc1MCBDIDM2LjU4OTggMTQuMTQ4NCAzNy4xNzU4IDE0LjczNDQgMzcuOTAyNCAxNC43MzQ0IEMgMzguMzcxMSAxNC43MzQ0IDM4LjY3NTggMTQuNTkzNyAzOS4xNDQ1IDE0LjI2NTcgTCA0MS44NjMzIDEyLjQzNzUgTCA0MS45MzM2IDEyLjQzNzUgTCA0MS45MzM2IDI2LjQ3NjYgQyA0MS45MzM2IDI3LjQ2MDkgNDIuNjM2NyAyOC4xNDA2IDQzLjY0NDUgMjguMTQwNiBaIE0gMTIuNzMwNSA0Ny40Mjk3IEMgMTMuOTAyNCA0Ny40Mjk3IDE0LjQ2NDkgNDYuOTYwOSAxNC45MzM2IDQ1LjY3MTkgTCAxNy45MzM2IDM3LjM3NTAgTCAzMS43NjE3IDM3LjM3NTAgTCAzNC43ODUxIDQ1LjY3MTkgQyAzNS4yMzA1IDQ2Ljk2MDkgMzUuODE2NCA0Ny40Mjk3IDM2Ljk4ODMgNDcuNDI5NyBDIDM4LjI1MzkgNDcuNDI5NyAzOS4wOTc2IDQ2LjY3OTcgMzkuMDk3NiA0NS41MDc4IEMgMzkuMDk3NiA0NS4xMDk0IDM5LjAyNzMgNDQuNzU3OCAzOC44Mzk4IDQ0LjI0MjIgTCAyNy44NDc2IDE0Ljk5MjIgQyAyNy4zMDg2IDEzLjUzOTEgMjYuMzQ3NiAxMi44MzU5IDI0Ljg0NzYgMTIuODM1OSBDIDIzLjM5NDUgMTIuODM1OSAyMi40MzM2IDEzLjUzOTEgMjEuOTE4MCAxNC45Njg4IEwgMTAuOTAyNCA0NC4yNjU2IEMgMTAuNzE0OSA0NC43ODEzIDEwLjY0NDUgNDUuMTMyOCAxMC42NDQ1IDQ1LjUzMTMgQyAxMC42NDQ1IDQ2LjcwMzEgMTEuNDQxNCA0Ny40Mjk3IDEyLjczMDUgNDcuNDI5NyBaIE0gMTkuMDgyMCAzMy43ODkxIEwgMjQuNzc3MyAxOC4wMTU3IEwgMjQuOTE4MCAxOC4wMTU3IEwgMzAuNTg5OCAzMy43ODkxIFoiLz4KPC9zdmc+) no-repeat center center;
    background-size: 16px !important;
    width: 20px !important;
    height: 22px !important;
    background-position: 2px 4px !important;
    }
#e_cst1_sub {
    background: transparent url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgNTYgNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTSA5LjQ4NDQgNDIuMzMyMCBDIDEwLjY1NjMgNDIuMzMyMCAxMS4yMTg4IDQxLjg2MzMgMTEuNjg3NSA0MC41NzQyIEwgMTQuNjg3NSAzMi4yNzc0IEwgMjguNTE1NiAzMi4yNzc0IEwgMzEuNTM5MCA0MC41NzQyIEMgMzEuOTg0NCA0MS44NjMzIDMyLjU3MDMgNDIuMzMyMCAzMy43NDIyIDQyLjMzMjAgQyAzNS4wMDc4IDQyLjMzMjAgMzUuODUxNiA0MS41ODIwIDM1Ljg1MTYgNDAuNDEwMiBDIDM1Ljg1MTYgNDAuMDExNyAzNS43ODEyIDM5LjY2MDIgMzUuNTkzNyAzOS4xNDQ1IEwgMjQuNjAxNiA5Ljg5NDUgQyAyNC4wNjI1IDguNDQxNCAyMy4xMDE2IDcuNzM4MyAyMS42MDE2IDcuNzM4MyBDIDIwLjE0ODQgNy43MzgzIDE5LjE4NzUgOC40NDE0IDE4LjY3MTkgOS44NzExIEwgNy42NTYzIDM5LjE2ODAgQyA3LjQ2ODggMzkuNjgzNiA3LjM5ODQgNDAuMDM1MiA3LjM5ODQgNDAuNDMzNiBDIDcuMzk4NCA0MS42MDU1IDguMTk1MyA0Mi4zMzIwIDkuNDg0NCA0Mi4zMzIwIFogTSAxNS44MzU5IDI4LjY5MTQgTCAyMS41MzEyIDEyLjkxODAgTCAyMS42NzE5IDEyLjkxODAgTCAyNy4zNDM3IDI4LjY5MTQgWiBNIDQ2Ljg5MDYgNDguMjYxNyBDIDQ3LjkyMTkgNDguMjYxNyA0OC42MDE2IDQ3LjU4MjEgNDguNjAxNiA0Ni41OTc3IEwgNDguNjAxNiAzMC41NjY0IEMgNDguNjAxNiAyOS4zOTQ1IDQ3Ljg5ODQgMjguNjkxNCA0Ni43MjY2IDI4LjY5MTQgQyA0NS42OTUzIDI4LjY5MTQgNDUuMjAzMSAyOS4wNjY0IDQ0LjUgMjkuNTU4NiBMIDQwLjc1IDMyLjExMzMgQyA0MC4wOTM3IDMyLjU4MjEgMzkuODM1OSAzMi45ODA1IDM5LjgzNTkgMzMuNDk2MSBDIDM5LjgzNTkgMzQuMjY5NSA0MC4zOTg0IDM0Ljg1NTUgNDEuMTI1MCAzNC44NTU1IEMgNDEuNTkzNyAzNC44NTU1IDQxLjg5ODQgMzQuNzE0OCA0Mi4zNjcyIDM0LjM4NjcgTCA0NS4wODU5IDMyLjU1ODYgTCA0NS4xNzk3IDMyLjU1ODYgTCA0NS4xNzk3IDQ2LjU5NzcgQyA0NS4xNzk3IDQ3LjU4MjEgNDUuODU5NCA0OC4yNjE3IDQ2Ljg5MDYgNDguMjYxNyBaIi8+Cjwvc3ZnPg==) no-repeat center center;
    background-size: 16px !important;
    width: 20px !important;
    height: 22px !important;
    background-position: 2px 4px !important;
    }
#fastposteditor #spanButtonPlaceholder {
background: transparent url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgZGF0YS1uYW1lPSJMYXllciAyIj4KICAgIDxnIGRhdGEtbmFtZT0iYXR0YWNoIj4KICAgICAgPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBvcGFjaXR5PSIwIi8+CiAgICAgIDxwYXRoIGQ9Ik05LjI5IDIxYTYuMjMgNi4yMyAwIDAgMS00LjQzLTEuODggNiA2IDAgMCAxLS4yMi04LjQ5TDEyIDMuMkE0LjExIDQuMTEgMCAwIDEgMTUgMmE0LjQ4IDQuNDggMCAwIDEgMy4xOSAxLjM1IDQuMzYgNC4zNiAwIDAgMSAuMTUgNi4xM2wtNy40IDcuNDNhMi41NCAyLjU0IDAgMCAxLTEuODEuNzUgMi43MiAyLjcyIDAgMCAxLTEuOTUtLjgyIDIuNjggMi42OCAwIDAgMS0uMDgtMy43N2w2LjgzLTYuODZhMSAxIDAgMCAxIDEuMzcgMS40MWwtNi44MyA2Ljg2YS42OC42OCAwIDAgMCAuMDguOTUuNzguNzggMCAwIDAgLjUzLjIzLjU2LjU2IDAgMCAwIC40LS4xNmw3LjM5LTcuNDNhMi4zNiAyLjM2IDAgMCAwLS4xNS0zLjMxIDIuMzggMi4zOCAwIDAgMC0zLjI3LS4xNUw2LjA2IDEyYTQgNCAwIDAgMCAuMjIgNS42NyA0LjIyIDQuMjIgMCAwIDAgMyAxLjI5IDMuNjcgMy42NyAwIDAgMCAyLjYxLTEuMDZsNy4zOS03LjQzYTEgMSAwIDEgMSAxLjQyIDEuNDFsLTcuMzkgNy40M0E1LjY1IDUuNjUgMCAwIDEgOS4yOSAyMXoiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==) no-repeat center center !important;
    background-size: 14px !important;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 6px !important;
    }
.b2r #e_sml {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik02IDhjLjU1IDAgMS0uNDUgMS0xcy0uNDUtMS0xLTEtMSAuNDUtMSAxIC40NSAxIDEgMXptNiAwYy41NSAwIDEtLjQ1IDEtMXMtLjQ1LTEtMS0xLTEgLjQ1LTEgMSAuNDUgMSAxIDF6bS0zIDUuNWMyLjE0IDAgMy45Mi0xLjUgNC4zOC0zLjVINC42MmMuNDYgMiAyLjI0IDMuNSA0LjM4IDMuNXpNOSAxQzQuNTcgMSAxIDQuNTggMSA5czMuNTcgOCA4IDggOC0zLjU4IDgtOC0zLjU4LTgtOC04em0wIDE0LjVjLTMuNTkgMC02LjUtMi45MS02LjUtNi41UzUuNDEgMi41IDkgMi41czYuNSAyLjkxIDYuNSA2LjUtMi45MSA2LjUtNi41IDYuNXoiLz4KPC9zdmc+Cg==) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
}
.b2r #e_image {
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik0yMSAxOVY1YzAtMS4xLS45LTItMi0ySDVjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJ6TTguNSAxMy41bDIuNSAzLjAxTDE0LjUgMTJsNC41IDZINWwzLjUtNC41eiIvPgo8L3N2Zz4K) no-repeat center center;
    background-size: 14px;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
}
.b2r #e_attach {
    background: transparent url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgZGF0YS1uYW1lPSJMYXllciAyIj4KICAgIDxnIGRhdGEtbmFtZT0iYXR0YWNoIj4KICAgICAgPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBvcGFjaXR5PSIwIi8+CiAgICAgIDxwYXRoIGQ9Ik05LjI5IDIxYTYuMjMgNi4yMyAwIDAgMS00LjQzLTEuODggNiA2IDAgMCAxLS4yMi04LjQ5TDEyIDMuMkE0LjExIDQuMTEgMCAwIDEgMTUgMmE0LjQ4IDQuNDggMCAwIDEgMy4xOSAxLjM1IDQuMzYgNC4zNiAwIDAgMSAuMTUgNi4xM2wtNy40IDcuNDNhMi41NCAyLjU0IDAgMCAxLTEuODEuNzUgMi43MiAyLjcyIDAgMCAxLTEuOTUtLjgyIDIuNjggMi42OCAwIDAgMS0uMDgtMy43N2w2LjgzLTYuODZhMSAxIDAgMCAxIDEuMzcgMS40MWwtNi44MyA2Ljg2YS42OC42OCAwIDAgMCAuMDguOTUuNzguNzggMCAwIDAgLjUzLjIzLjU2LjU2IDAgMCAwIC40LS4xNmw3LjM5LTcuNDNhMi4zNiAyLjM2IDAgMCAwLS4xNS0zLjMxIDIuMzggMi4zOCAwIDAgMC0zLjI3LS4xNUw2LjA2IDEyYTQgNCAwIDAgMCAuMjIgNS42NyA0LjIyIDQuMjIgMCAwIDAgMyAxLjI5IDMuNjcgMy42NyAwIDAgMCAyLjYxLTEuMDZsNy4zOS03LjQzYTEgMSAwIDEgMSAxLjQyIDEuNDFsLTcuMzkgNy40M0E1LjY1IDUuNjUgMCAwIDEgOS4yOSAyMXoiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==) no-repeat center center;
    background-size: 14px !important;
    width: 20px !important;
    height: 22px !important;
    background-position: 4px 4px !important;
}



  `;
  document.head.appendChild(style); // 将其添加到 <head> 中

})();