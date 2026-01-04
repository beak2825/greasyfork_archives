// ==UserScript==
// @name         51nb-style
// @namespace    http://tampermonkey.net/
// @version      2025-1-2
// @description  ibmnb.com (green style)
// @author       Envy Chen
// @match        https://*.ibmnb.com/*
// @match        https://*.thinkpad.cn/*
// @match        https://*.thinkpad.com.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/488596/51nb-style.user.js
// @updateURL https://update.greasyfork.org/scripts/488596/51nb-style.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //document.body.style.display = 'none';
    // 黑名单id (适用桌面版本), 填写示例: const black_member_ids = [111, 222, 333];
    // 黑名单名字 (适用移动版本), 填写示例: const black_member_names = ["name1", "name2", "name3"];
    const black_member_ids = [];
    const black_member_names = [];

    var styleCss = `
/* mobile */
.cr180_pg.cl {
    background: #304633 !important;
}

.cr180_pmlist li a {
    color: #4545b1 !important;
}

.space_profile_box th {
    color: #eee !important;
}

.space_profile .cr_box .cr_name {
    color: #eee !important;
}

.cr180_space_ext p span {
    color: #eee !important;
}
.cr180_space_ext p {
    color: #ddd !important;
}

.cr_sub, .tl .cr_c {
    background: #314734 !important;
    color: #ddd !important;
}
.tl .cr_author, .tl .cr_author a {
    color: #ddd !important;
}
.tl .cr_date, .tl .cr_views,  .tl .cr_reply {
    color: #999 !important;
}
.cr180_nv, .forumorderby_title, .bm_title {
    background: #134e1f;
    box-shadow: rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset !important;
}
.cr180_forum_counts .z {
    color: #eee !important;
}
.cr180_message {
    background: #314734 !important;
    color: #ddd !important;
}
.arrow_box {
    background: #314734 !important;
}
.cr180_threadtitle {
    background: #314734 !important;
}
.cr_sub, .cr_sub a, .cr_c {
    border-left: 0 !important;
    border-right: 0 !important;
    border-bottom: 1px solid #888 !important;
}
div#thread_list {
    background: #0e3115;
    box-shadow: rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset !important;
}
.cr180_modmanage .cr_comment_s, .cr180_modmanage .cr_mods, .cr180_modmanage .cr_editp {
    color: #ddd !important;
}
.cr180_pg .pg .first, .cr180_pg .pg .prev, .cr180_pg .pg .nxt, .cr180_pg .pg .last {
    background: transparent !important;
}
li.cr_comment_list {
    color: #666 !important;
}
span.cr_c_author a {
    color: #000 !important;
}
form#poll {
    /*    background: #ccc !important;*/
    color: #ccc !important;
}
.arrow_box {
    border: 1px solid #888 !important;
}
.footer {
    background-color: transparent !important;
}

/* desktop */
body {
    background: #111 !important;
    color: #ddd !important;
    font-family: "Microsoft Yahei UI";
}
.edt .b2r a {
    color: #000 !important;
}
/* edit reply */
.pbl a, .pbls a {
    color: #000 !important;
}
td#fwin_content_nav {
    color: #000 !important;
}
.p_pop a:hover, .p_pop a.a, #sctype_menu .sca {
    background: #666 !important;
}
#post_extra_tb label.a {
    color: #000 !important;
}
.exfm {
    background: transparent;
    border: 1px solid #888 !important;
}
.edt .bbar {
    background: transparent !important;
}
.ntc_l {
    color: #000 !important;
}
dd.ntc_body {
    color: #eee !important;
}
div#calendar {
    background: #888 !important;
}

/* login popup */
div#main_messaqge_LU5y9 {
    color: #000 !important;
}
.card, .card .o a, .card span.xg1 {
    color: #333 !important;
    background: none !important;
}
.card a:hover {
    background: none !important;
}

/* post by reward */
.exfm.cl .xg1 {
    color: #eee !important;
}

/* post reply */
div#fwin_comment {
    color: #000 !important;
}
div#postbox .bar a {
    color: #000 !important;
}

td#fwin_content_reply , td#fwin_content_reply a{
    color: #000 !important;
}
div#fastposteditor a {
    color: #000 !important;
}

#viewui_fontsize ul li {
    color: #000 !important;
}
.ftid a {
    color: #333 !important;
}
form .ftid a {
    color: #eee !important;
}
#postbox .ftid a {
    color: #000 !important;
}
div#visitedforums_menu, td#v_forums {
    background: #fff !important;
}
#visitedforums_menu a:hover {
    background: #ccc !important;
}

ul.tb li a {
    color: #ccc !important;
}
ul.tb li.a a {
    color: #333 !important;
}
.tb .a a, .tb .current a {
    background: #fff !important;
}

#qmenu {
    color: #000 !important;
}
.dt th {
    background: transparent !important;
}
.ttp a, .ttp strong {
    background: #314734 !important;
    border: 1px solid #888 !important;
}
ul.tb a {
    background: #333 !important;

}
table td {
/*    background: #576459;*/
    color: #ddd;
}
tr {
    background: #314734 !important;
}
.tns th {
    color: #ddd !important;
/*    background: #576459;*/
    border: none;
}
.tl .bm_c tr td, .tl .bm_c tr th {
    background: #314734 !important;
}
.tl .bm_c {
    border: 0;
}
.tl td em, .tl td em a {
    color: #ddd !important;
}
div#second1 {
    background: #314734;
    border: 0 !important;
}
.fl_tb td, .tl .bm_c tr td, .tl .bm_c tr th {
    border: 1px solid #0c3c0c;
}
.tl .th {
    background: #314734 !important;
}

a {
    color: #a5c8c6 !important;
}
a:visited {
    color: #ca966b !important;
}
.authi span {
    color: #ddd !important;
}
.tl th em, .tl th em a {
    color: #ddd !important;
}
.authi a {
/*    color: #ddd !important;*/
}
span.ppm2 a {
    color: #afcd09 !important;
}
a.xi2 {
    color: #98bab8 !important;
}
div#wp a.xg1, div#wt .xgl, div#wt a.xg1 {
    color: #a5c8c6 !important;
}
div#ct li.xg1 {
    color: #eee !important;
}
td.xg1, td.xg1 a {
    color: #eee !important;
}
span.xg1, span.xg1 a {
    color: #a5c8c6 !important;
}
em.xg1 {
    color: #ccc !important;
}

.tip_c {
    color: #000 !important;
}
.alert_error {
    color: #000 !important;
}
input#scbar_txt {
    color: #000 !important;
}
i.pstatus {
    color: #ccc !important;
}

.msgborder {
    background: #2b4940;
    color: #bbb !important;
    border: 1px solid #888 !important;
    border-top: 0 !important;
}
.msgborder font {
    background: transparent !important;
}
.msgborder font[color^="#"] {
    background: transparent;
    color: #bbb !important;
}
.t_f a font {
/*    color: #ccc; */
}

.tl #forumnewshow a {
    color: #cc0 !important;
    border: 0 !important;
}
.tl #forumnewshow a:hover {
    background: #425b42;
}

div#second1 li a:hover {
    background: none;
    border: 0 !important;
    font-weight: 600;
}

.chart {
    color: #ddd !important;
}

p.xg2 font {
/*    color: #19a0e4;*/
}

.fl .bm_c p, .fl .bm_c dd {
    color: #ddd !important;
}

.bm .bm_h h1, .bm .bm_h h1 a, .bm .bm_h h2, .bm .bm_h h2 a, .bm .bm_h h3, .bm .bm_h h3 a {
    color: #fefc4f !important;
}

div#toptb {
    background: #314734;
}
.chart em {
    color: #bbb !important;
}

.jg12 td {
    background: #314734;
}

p.xg2 {
    color: #ddd !important;
}

#eis_nv {
    background: #134e1f;
    box-shadow: rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset !important;
}

.bm .bm_h {
    background: #134e1f;
    box-shadow: rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset !important;
}
.msgheader {
    background: #3a6357;
    box-shadow: rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset !important;
    color: #ddd !important;
    border: 1px solid #888 !important;
    border-bottom: 0 !important;
}

#ft {
    color: #bbb !important;
}
.pi {
    border: 1px solid #314734;
}
.sign {
    opacity: 0.8;
}
div#um p a {
    color: #6cf !important;
}
div#um a font[color="blue"] {
    color: #ddd !important;
    background: transparent !important
}
.scbar_btn_td {
    background: #0F3917 !important;
}

.hdc.cl h2 a img {
    filter: brightness(0.8);
}

.bbs1, .bbs2 {
    border: 1px solid #000 !important;
}
td.pls {
    border-right: #000 1px solid !important;
}
.pbn {
    padding-bottom: 0 !important;
    margin-bottom: 5px !important;
}

/* post rate */
div.tpclg, table.reason_slct tr td {
    background: #fff !important;
    color: #000 !important;
}
.xi2, .xi2 a, .xi3 a {
/*    color: #ddd !important;*/
    font-weight: 600;
    color: #3d78b2 !important;
}

/* custom reply text */
font[color^="#"] {
    background: #F7F7F7;
}

em.xg2 {
    color: #ddd;
}

.pf_l em {
    color: #ddd;
}

#uhd {
    background: transparent;
}

img.user_avatar[src*="noavatar.svg"] {
    stroke-opacity: revert;
    border-radius: 50%;
    zoom: 120%;
}

a.bm_h {
    background: transparent !important;
}
a.bm_h:hover {
    background: #5e8363 !important;
}

.pg a, .pg strong, .pgb a, .pg label {
    background: transparent;
    border: 0;
    color: #ddd;
}

.pg a.prev {
    background: none;
}
.pg a.nxt {
    background: none;
}

.pg a.prev:after {
    content: '<';
    color: #ddd;
}

.hdc.cl h2 a:after {
    content: "51NB";
    color: #ddd;
    font-size: 40px;
    font-family: "Microsoft Yahei UI";
    line-height: 66px;
    vertical-align: bottom;
    background: -webkit-linear-gradient(rgb(238 239 238), rgb(57 56 56));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.hdc.cl h2 a img, div.logo img {
    display: none !important;
}

#eis_nv li a:hover {
    background: transparent !important;
    font-weight: 600;
}

#eis_nv li {
    background: none !important;
}

.pinf, .pinf strong {
    color: #ddd !important;
}

img[src*="smiley"] {
    filter: drop-shadow(2px 4px 6px black);
}

.p_pop, .p_pof, .sllt {
    background: #333;
}

.jg12 td {
    background: #134e1f !important;
    border-bottom: 1px solid #000 !important;
}

td.t_f[id^="postmessage"] font:not([color]) , div[id^="postmessage"] font:not([color]) {
    color: #000;
    background: #ccc;
}

td.t_f[id^="postmessage"] font[style^="color"], div[id^="postmessage"] font[style^="color"] {
    background: #ccc !important;
    display:inline-block;
}
dl[id^="pmlist"] {
    background: transparent !important;
}

dl[id^="pmlist"] {
    background: transparent !important;
}
li#secondcurrent {
    color: #ccc;
}

.alt, .alt th, .alt td {
    background: transparent !important;
}

.tfx th, .tfx td {
    background: transparent !important;
}
.tdats .h th {
    color: #ddd !important;
}

font[color="red"] {
    color: #e95959;
}

.nfl .f_c {
    background: transparent !important;
}

.rfm table tr {
    background: transparent !important;
}

.avt img, img.user_avatar {
    background: none !important;
    border: 0 !important;
}

.sttl {
    background:  transparent !important;
}

/* badges */
img[id^="md_"] {
    filter: drop-shadow(1px 2px 3px #fff);
}

tr.fl_row a img {
    filter: drop-shadow(2px 2px 4px #eee);
}

.tfm .d {
    color: #eee !important;
}

span.xg1 {
    color: #ccc !important;
}

div#pt {
    margin: 0;
    padding: 2px 0;
}
div#ct {
    border: 1px solid #314734 !important;
}
div#wp {
    background: #304633 !important;
}

/* search results */
.pbw p {
    color: #ccc !important;
}

/* qiandao */
div.tb a {
    color: #000 !important;
}

.dt td, .dt th {
    border-bottom: 1px solid #333;
}
.fl-table tr:nth-child(even) {
    filter: brightness(0.8);
}

table#tablehead {
    border: 0 !important;
}
.fl-table td {
    border: 0 !important;
}
div#pt {
    margin: 0;
    padding: 2px 0;
}
.bm {
    background: #304633 !important;
}
.bm .bm_c {
    border: 2px solid #304633;
}
.fl-table td .lunar {
    color: #ddd !important;
}
.bm_c .dt th {
    background: #0F3918 !important;
}

/* config query */
.bbs1, .bbs2 {
    background: transparent !important;
}

/* deal area */
.boardnav table td {
    background: #576459;
}

/* special font - red */
font[color="#ff0000"], font[color="#ff0"], font[color="red"], font[color="#00ff00"], font[color="#0f0"], font[color="green"], font[color="#0000ff"], font[color="#00f"], font[color="blue"]{
    background: #ccc;
}

/* form uploading gif (see below) */
.tips-bar .quote {
    color: #eee !important;
}
`;
    const style = document.body.appendChild(document.createElement('style'));
    style.type = 'text/css';
    var black_member_css = []
    black_member_ids.forEach(function(member_id){
        black_member_css.push(`\n tbody[id*="normalthread_"]:has(> tr td cite a[href*="space-uid-` + member_id + `"]){display:none;}`);
        black_member_css.push(`\n div[id*="post_"]:has(> table tbody tr td div a[href*="space-uid-` + member_id + `"]){display:none;}`);
        black_member_css.push(`\n div[class*="cr180_postbox"]:has(> div p a[href*="uid=` + member_id + `"]){display:none;}`);
    });
    black_member_names.forEach(function(member_id){
        black_member_css.push(`\n tbody[id*="normalthread_"] tr td[class="by"]:has(> cite a[href*="space-username-` + member_id + `"]){display:none;}`);
    });
    styleCss += black_member_css.join('\n');
    console.log(styleCss);
    style.innerHTML = styleCss;

    try{
        window._51nb_black_member_check_timer = window.setInterval(function(){
            black_member_names.forEach(function(member_id){
                var o = $('div[class^="cr_c"]:contains("' + member_id + '")');
                if (o && o.length > 0){
                    o.css({'display':'none'});
                }
            });
        }, 500);
    }catch(e){
    }

    const style2 = document.body.appendChild(document.createElement('style'));
    style2.type = 'text/css';
    style2.innerHTML = `
.bbs_theme {
    position: absolute;
    top: 2px;
    left: 150px;
}
@media screen and (max-width:480px) {
    .bbs_theme {
        left:5px;
    }
}
select#sel_theme {
    background: #000;
    color: #fff;
}

.slidecontainer {
    width: 100px;
    display: inline-block;
    position: absolute;
    top: 5px;
}

/* The slider itself */

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.9;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: pointer;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAYCAIAAACeHvEiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAq5JREFUeNpi/P//PwMa+Pfr86cP7149vXf12o2Hj199/MEtJKOgqaevKisqJMjHy8HEgAH+o4C/n59f3Te/0ddQlAEL4DH0LZ2/7/zzT79Rdf1HMuXPlxt7pifZSjEQAAK28Z27r7z9jcWUv1/OLSk2lkCo5ZPVdPKLTEyKddOV58AwScQgcvbRp79QTfl1f3OrOcwRrGK6AZlVc7YceQlWdbA+XASrk3RDlpx7+w9uyuf7mxK1BCByguo+zctOf0I49uXqIj9BHH5T9O669PYX2JSfbzdXGLCARdnlHFu2PEYNuFdrcJvCwCCVuuzKj3//GT7eXOfFDxbhVIhsPfIJLfQJmMLA5dRz7cNvpkfHFu36COLLmrvGZlrxMpAGvh1auO/2B6Zbp/b+AXHF9XXdbQUZGUgFf64cvPiI6e7xXyAOr7iQug4PAxng/4mHL5je3YAELBs7PycDWeDVnz9MDKxgJiMQMJFnCiPDfyYxfTDzw5fvt16SZ4qGID+Tuq00iPn7yePbJ5//I8MQNidleSY9uwhw7vl85vKudZe+kWwIr7uFjgiThFlwqjEou325sm/hpPl3STOHUSUh1l6eG5iPvl9ZnAjNzOxyQTWrHv5CTrsv8aVdcde5519Dc+PvD1cnh2hCsz+7lGdO584r72Cm/NhSGSyE3QxR7/Zd738hlS/f7m0vtpOHSbPKm/vnVTZNXrj55Lkjs5Jc+LEYIWSaOPPKh1/oZd37Gzur/bSRCyR2QVkdfV1NCQEWNBOYpD2LlkDKBIwSExhCLy6v78m2EGbBV14aB7SvOfbsyz8c5S4E/P787Ob5nfM7M1y1RdiQUoWoskta3Zz1h248evsLXc9/Riw1Cagy+f31y6ev375/+/H927f/XFycHFycnNw8PNwczNgcCBBgAALk80Jz0kwqAAAAAElFTkSuQmCC");
}

.slider::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAYCAIAAACeHvEiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAq5JREFUeNpi/P//PwMa+Pfr86cP7149vXf12o2Hj199/MEtJKOgqaevKisqJMjHy8HEgAH+o4C/n59f3Te/0ddQlAEL4DH0LZ2/7/zzT79Rdf1HMuXPlxt7pifZSjEQAAK28Z27r7z9jcWUv1/OLSk2lkCo5ZPVdPKLTEyKddOV58AwScQgcvbRp79QTfl1f3OrOcwRrGK6AZlVc7YceQlWdbA+XASrk3RDlpx7+w9uyuf7mxK1BCByguo+zctOf0I49uXqIj9BHH5T9O669PYX2JSfbzdXGLCARdnlHFu2PEYNuFdrcJvCwCCVuuzKj3//GT7eXOfFDxbhVIhsPfIJLfQJmMLA5dRz7cNvpkfHFu36COLLmrvGZlrxMpAGvh1auO/2B6Zbp/b+AXHF9XXdbQUZGUgFf64cvPiI6e7xXyAOr7iQug4PAxng/4mHL5je3YAELBs7PycDWeDVnz9MDKxgJiMQMJFnCiPDfyYxfTDzw5fvt16SZ4qGID+Tuq00iPn7yePbJ5//I8MQNidleSY9uwhw7vl85vKudZe+kWwIr7uFjgiThFlwqjEou325sm/hpPl3STOHUSUh1l6eG5iPvl9ZnAjNzOxyQTWrHv5CTrsv8aVdcde5519Dc+PvD1cnh2hCsz+7lGdO584r72Cm/NhSGSyE3QxR7/Zd738hlS/f7m0vtpOHSbPKm/vnVTZNXrj55Lkjs5Jc+LEYIWSaOPPKh1/oZd37Gzur/bSRCyR2QVkdfV1NCQEWNBOYpD2LlkDKBIwSExhCLy6v78m2EGbBV14aB7SvOfbsyz8c5S4E/P787Ob5nfM7M1y1RdiQUoWoskta3Zz1h248evsLXc9/Riw1Cagy+f31y6ev375/+/H927f/XFycHFycnNw8PNwczNgcCBBgAALk80Jz0kwqAAAAAElFTkSuQmCC");
  cursor: pointer;
}
    `;
    //window.setTimeout(function(){
    //  document.body.style.display = '';
    //}, 500);

  //https://stackoverflow.com/questions/14196671/session-only-cookies-with-javascript
  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

    var theme = getCookie('sel_theme');
    if (theme == null) theme = 0;
    var t = document.createElement('div');
    t.className = 'bbs_theme';
    t.innerHTML = `<select id="sel_theme" onchange="onSelTheme()"><option value="0">默认主题</option><option value="1">绿色主题</option><option value="2">黑色主题</option></select><div class="slidecontainer">
  <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
</div>`;
    document.body.appendChild(t);
    window.onSelTheme = function(){
        var val = document.getElementById('sel_theme').value;
        if (val == 0){
            style.innerHTML = "";
            setCookie('sel_theme', 0, 365);
        }else if (val == 1){
            style.innerHTML = styleCss;
            setCookie('sel_theme', 1, 365);
        }else if (val == 2){
            style.innerHTML = styleCss.replace(/#111/g, '#000').replace(/#134e1f/g, '#333').replace(/(#0c3c0c)|(#0F3917)|(#2b4940)/g, '#333').replace(/(#314734)|(#304633)|(#0e3115)|(#3a6357)/g, '#111');
            setCookie('sel_theme', 2, 365);
        }
    }
    //alert(theme);
    document.getElementById('sel_theme').value = theme;
    window.onSelTheme();

    // brightness setting
    var brg = getCookie('cur_brg');
    if (brg == null) brg = 50;
    var slider = document.getElementById("myRange");
    slider.value = brg;
    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
      document.documentElement.style.filter = "brightness("+(parseInt(this.value,10)/100 + 0.5)+")";
      setCookie('cur_brg', this.value, 365);
    }
    slider.oninput();

})();

// check if you're in the blacklist of the author who posted this thread.
var tid = null;
if (window.location.href.match(/\/forum\.php\?mod=viewthread\&/)){
    var grp = window.location.href.match(/tid=(\d+)/);
    if (grp){
        tid = grp[1];
    }
}
if (window.location.href.match(/\/thread\-\d+\-\d+\-\d+\.html/)){
    var grp2 = window.location.href.match(/\/thread\-(\d+)\-\d+\-\d+\.html/);
    if (grp2){
        tid = grp2[1];
    }
}

if (tid){
    var url = '/forum.php?mod=post&action=reply&tid='+tid+'&inajax=1';
        const xhr = new XMLHttpRequest(); //创建XMLHttpRequest对象
		xhr.open('GET', url, true);
        xhr.onreadystatechange = function(e) //设置回调函数
        {
            const _xhr = e.target;
            if (_xhr.readyState === _xhr.DONE) { //请求完成时
                if (_xhr.status === 200) //正确加载时
                {
                    if ((_xhr.responseText.indexOf('alert_error') >= 0 || _xhr.responseText.indexOf('errorhandle') >= 0)  && _xhr.responseText.indexOf("黑名单") >= 0){
                        alert("你已经被楼主加入黑名单，请勿浪费时间读帖、回帖！");
                    }
                }
            }
        };
        xhr.send();
}

// 论坛头像上传gif
if (window.location.href.match(/\/home\.php\?mod\=spacecp\&ac\=avatar/)){
(function(){
	'use strict';

const avatarform = document.querySelector("#avatarform") ||
					document.querySelector("form[action^=home]"); //以前没有HTML5的老版本，没有#avatarform
if (!avatarform) return;

let noGM_xmlhttpRequest = false;
//仿GM_xmlhttpRequest函数v1.4
if (typeof(GM_xmlhttpRequest) == 'undefined' || typeof(GM_info) == 'undefined')
{
	noGM_xmlhttpRequest = true;
	window.GM_xmlhttpRequest = function(GM_param) {
		const xhr = new XMLHttpRequest(); //创建XMLHttpRequest对象
		xhr.open(GM_param.method, GM_param.url, true);
		if (GM_param.responseType) xhr.responseType = GM_param.responseType;
		if (GM_param.overrideMimeType) xhr.overrideMimeType(GM_param.overrideMimeType);
		xhr.onreadystatechange = function(e) //设置回调函数
			{
				const _xhr = e.target;
				if (_xhr.readyState === _xhr.DONE) { //请求完成时
					if (_xhr.status === 200 && GM_param.onload) //正确加载时
					{
						GM_param.onload(_xhr);
					}
					if (_xhr.status !== 200 && GM_param.onerror) //发生错误时
					{
						GM_param.onerror(_xhr);
					}
				}
			};
		if (GM_param.onprogress)
			xhr.upload.onprogress = function(e){GM_param.onprogress(e.target)};
		//添加header
		for (let header in GM_param.headers) {
			xhr.setRequestHeader(header, GM_param.headers[header]);
		}
		//发送数据
		xhr.send(GM_param.data ? GM_param.data : null);
	};
}

const avatarsDefine = [
	{name:'大头像',code:'big',maxWidth:200,maxHeight:250,blob:null},
	{name:'中头像',code:'middle',maxWidth:120,maxHeight:120,blob:null},
	{name:'小头像',code:'small',maxWidth:48,maxHeight:48,blob:null},
];

const html5mode = Boolean(avatarform.querySelector('#avatardesigner')); //HTML5模式还是Flash
const insertPlace = avatarform.parentNode;

// HTML5版本才会有的几个提交按钮
const ipt_avatarArr = [
	avatarform.querySelector('[name="avatar1"]'),
	avatarform.querySelector('[name="avatar2"]'),
	avatarform.querySelector('[name="avatar3"]'),
];
const ipt_Filedata = avatarform.querySelector('[name="Filedata"]');
const ipt_confirm = avatarform.querySelector('[name="confirm"]');
let data = (typeof(unsafeWindow) == 'undefined' ? window : unsafeWindow).data;
// Flash版本的Flash
const swf_mycamera = avatarform.querySelector('[name="mycamera"]');

if (!html5mode && !swf_mycamera)
{ //解决垃圾机锋论坛的问题
	const table1 = avatarform.querySelector('table');
	const t1cell = table1.tBodies[0].rows[0].cells[0];
	const avatarSrc = t1cell.querySelector('img').src;
	const fiexdApiUrl = avatarSrc.substring(0,avatarSrc.indexOf('/data/avatar'));

	const table2 = avatarform.querySelector('table:nth-of-type(2)');
	const t2cell = table2.tBodies[0].rows[0].cells[0];
	const scriptHTML = t2cell.querySelector('script').innerHTML;
	const regRes = /document\.write\(AC_FL_RunContent\((.+?)\)\);/i.exec(scriptHTML);
	data = regRes[1].split(',').map(str=>str.replace(/^'|'$/g,''));
	const brokenSwfUrl = data[data.indexOf('src')+1];
	const swfUrlParse = new URL(fiexdApiUrl + brokenSwfUrl.substr(brokenSwfUrl.indexOf('/images/camera.swf')));
	swfUrlParse.searchParams.set('ucapi',fiexdApiUrl);
	data[data.indexOf('src')+1] = swfUrlParse.toString();
}

const swfUrl = new URL(data ? data[data.indexOf('src')+1] : swf_mycamera.src);
const maxSize = parseInt(swfUrl.searchParams.get('uploadSize') || 2048, 10) * 1024;


const styleCss = `.discuz-avatar{
	border: 1px solid #ccc;
	padding: 5px 15px;
	width:auto;
	display:inline-block;
	width: 450px;
	box-sizing: border-box;
}
.discuz-avatar h3{
	text-align:center;
}
.pic-type-div{
	display:inline-block;
	vertical-align:top;
	margin-right: 15px;
}
.pic-type-div:last-of-type{
	margin-right: unset;
}
.pic-div{
	border: 1px solid #ccc;
	cursor: pointer;
	position: relative;
	display: table-cell;
	text-align:center;
	vertical-align: middle;
	background: #fff;
	background-image:
		linear-gradient(45deg, #eee 25%, transparent 26%, transparent 74%, #eee 75%),
		linear-gradient(45deg, #eee 25%, transparent 26%, transparent 74%, #eee 75%);
	background-position: 0 0, 10px 10px;
	background-size: 20px 20px;
}
.pic-type-big .pic-div{
	width: 200px;
	height: 250px;
}
.pic-type-big .pic-img{
	max-width: 200px;
	max-height: 250px;
}
.pic-type-middle .pic-div{
	width: 120px;
	height: 120px;
}
.pic-type-middle .pic-img{
	max-width: 120px;
	max-height: 120px;
}
.pic-type-small .pic-div{
	width: 48px;
	height: 48px;
}
.pic-type-small .pic-img{
	max-width: 48px;
	max-height: 48px;
}

.choose-file{
	display: none;
}
.pic-div.nopic::before{
	content:"➕";
	font-size: 2em;
}
.pic-tag{
	text-align:center;
}
.submit-bar{
	text-align:center;
}
/*Flash AJAX状态使用*/
.status-bar{
	font-size:2em;
	background-repeat: no-repeat;
	background-position: center;
	margin:0px auto;
	display:none;
	text-align: center;
}
.status-bar[data-status]{
	display:block;
}
@keyframes loading-animate{
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(3600deg);
	}
}
.status-bar[data-status="loading"]::before {
	display: inline-block;
	border: 4px SteelBlue dotted;
	border-radius: 50%;
	content:"";
	width: 1em;
	height: 1em;
	animation: loading-animate 50s infinite linear;
}
.status-bar[data-status="success"]::before {
	content:"✔️";
}
.status-bar[data-status="error"]::before {
	content:"❌";
}
.progress-bar{
	padding: 5px;
	text-align: center;
}`;

const fragment = document.createDocumentFragment();

const ctlDiv = fragment.appendChild(document.createElement('div'));
ctlDiv.className = 'discuz-avatar';
const style = ctlDiv.appendChild(document.createElement('style'));
style.type = 'text/css';
style.innerHTML = styleCss;
const caption = ctlDiv.appendChild(document.createElement('h3'));
caption.appendChild(document.createTextNode(typeof(GM_info) != 'undefined' ?`${GM_info.script.name} ${GM_info.script.version}`:'无脚本扩展，直接执行脚本'));
caption.appendChild(document.createElement('br'));
caption.appendChild(document.createTextNode(`${html5mode?'HTML5':'Flash'}模式`));
const picTable = ctlDiv.appendChild(document.createElement('div'));
const picImgs = [];
avatarsDefine.forEach((obj,idx)=>{
	const picTypeDiv = picTable.appendChild(document.createElement('div'));
	picTypeDiv.className = 'pic-type-div pic-type-' + obj.code;
	const picDiv = picTypeDiv.appendChild(document.createElement('div'));
	picDiv.className = 'pic-div nopic';

	const pic = new Image();
	picDiv.appendChild(pic);
	pic.className = 'pic-img img-' + obj.code;
	pic.onload = function(){
		if (this.naturalWidth > obj.maxWidth)
		{
			progressDiv.appendChild(document.createElement('br'));
			progressDiv.appendChild(document.createTextNode(`${obj.name}宽度大于 ${obj.maxWidth}px，可能可能上传失败！`));
		}
		if (this.naturalHeight > obj.maxHeight)
		{
			progressDiv.appendChild(document.createElement('br'));
			progressDiv.appendChild(document.createTextNode(`${obj.name}高度大于 ${obj.maxHeight}px，可能可能上传失败！`));
		}
	}
	picImgs.push(pic);

	const file = picDiv.appendChild(document.createElement('input'));
	file.type = "file";
	file.className = "choose-file";
	picDiv.onclick = function(){
		file.click();
	}

	file.onchange = function(e){
		const file = e.target.files[0];
		const imageType = /image\/.*/i;
		progressDiv.textContent = '';
		if (!imageType.test(file.type)) {
			progressDiv.textContent = `${file.name} 不是有效的图像文件！`;
			pic.src = '';
			picDiv.classList.add('nopic');
			return;
		}
		if (file.size > maxSize) {
			progressDiv.textContent = `${obj.name} ${file.name} 文件大小超出 ${maxSize/1048576}MiB，可能上传失败！`;
		}
		picDiv.classList.remove('nopic');
		if (pic.src.length>0)
			URL.revokeObjectURL(pic.src);
		pic.src = URL.createObjectURL(file);
		obj.blob = file;
	}

	const tagDiv = picTypeDiv.appendChild(document.createElement('div'));
	tagDiv.className = 'pic-tag';
	const span1 = tagDiv.appendChild(document.createElement('span'));
	span1.appendChild(document.createTextNode(obj.name));
	tagDiv.appendChild(document.createElement('br'));
	const span2 = tagDiv.appendChild(document.createElement('span'));
	span2.appendChild(document.createTextNode(`${obj.maxWidth}×${obj.maxHeight}`));

});

const statusDiv = ctlDiv.appendChild(document.createElement('div'));
statusDiv.className = 'status-bar';
const progressDiv = ctlDiv.appendChild(document.createElement('div'));
progressDiv.className = 'progress-bar';
const submitDiv = ctlDiv.appendChild(document.createElement('div'));
submitDiv.className = 'submit-bar';
const submit = submitDiv.appendChild(document.createElement('button'));
submit.className = 'submit-btn';
submit.innerHTML = '📤提交';
submit.onclick = function(){
	if (!avatarsDefine.every(obj=>obj.blob))
	{
		progressDiv.textContent = `还未添加 ${avatarsDefine.filter(obj=>!obj.blob).map(obj=>obj.name).join('、')} 图像`;
		return;
	}
	submit.disabled = true;

	const fileDataArr = [];
	function readBlobs(blobArr,type,callback)
	{
		if (blobArr.length<1)
		{
			callback(fileDataArr);
			return;
		}
		const file = blobArr.shift();
		const fileReader = new FileReader();
		fileReader.onload = function (e) {
			fileDataArr.push(e.target.result);
			readBlobs(blobArr, type, callback);
		}
		if (type == 'base64')
			fileReader.readAsDataURL(file);
		else //if (type == 'arrayBuffer')
			fileReader.readAsArrayBuffer(file);
	}
	readBlobs(avatarsDefine.map(obj=>obj.blob), html5mode ? 'base64':'arrayBuffer', (html5mode ? sumbitAvatarsHTML5 : sumbitAvatarsFlash));
}
ctlDiv.appendChild(document.createElement('hr'));
const tipsDiv = ctlDiv.appendChild(document.createElement('div'));
tipsDiv.className = 'tips-bar';
let quote = null,code = null;

if (!html5mode)
{
	console.log(new URL(_parseBasePath(swfUrl)).host,location.host,noGM_xmlhttpRequest)
	if (noGM_xmlhttpRequest && new URL(_parseBasePath(swfUrl)).host != location.host)
	{
		quote = submitDiv.appendChild(document.createElement('div'));
		quote.className = 'quote';
		quote.appendChild(document.createTextNode('该站点 UCenter 跨域，目前为直接执行模式无法处理 Flash 跨域问题。请使用脚本扩展，或使用 DZX3.4 的 HTML5 模式。'));
	}

	quote = tipsDiv.appendChild(document.createElement('div'));
	quote.className = 'quote';
	quote.appendChild(document.createTextNode('若上传100%后显示'));
	code = quote.appendChild(document.createElement('div'));
	code.className = 'blockcode';
	code.appendChild(document.createTextNode('<?xml version="1.0" ?><root><face success="0"/></root>'));
	quote.appendChild(document.createTextNode('可能是图像像素超出服务器后台限制，或格式不被 PHP 支持。'));

	quote = tipsDiv.appendChild(document.createElement('div'));
	quote.className = 'quote';
	quote.appendChild(document.createTextNode('若上传显示'));
	code = quote.appendChild(document.createElement('div'));
	code.className = 'blockcode';
	code.appendChild(document.createTextNode('Access denied for agent changed'));
	quote.appendChild(document.createTextNode('可能是你的活动状态失效了需要刷新，或者是 Discuz 和 UCenter 通信没配好，请直接联系网站管理员。'));

}

quote = tipsDiv.appendChild(document.createElement('div'));
quote.className = 'quote';
quote.appendChild(document.createTextNode('PHP 7.1 才支持 WebP 格式，若 WebP 上传失败可能是服务器后端检查时失败。想上传动画还是乖乖用 APNG 或 GIF。'));

//将UI插入
insertPlace.appendChild(fragment);

//HTML5模式提交
function sumbitAvatarsHTML5(base64Arr)
{
	progressDiv.textContent = '已提交，HTML5 模式成功状态请直接参考上方编辑器';
	const dataArr = base64Arr.map(str=>str.substr(str.indexOf(",") + 1)); //拿到3个头像的Base64字符串
	dataArr.forEach((str,idx)=>{
		ipt_avatarArr[idx].value = str;
	});
	ipt_Filedata.value = '';
	ipt_confirm.value = '';

	avatarform.action = swfUrl.toString().replace('uc_server', 'api/avatar').replace('images/camera.swf?inajax=1', 'index.php?m=user&inajax=1&a=rectavatar&base64=yes'); //来自官方代码： static/avatar/avatar.js?EMK，你敢信？官方代码居然就是字符串替换
	avatarform.target='rectframe';
	avatarform.submit();
	submit.disabled = false;
}
//Flash模式提交
function sumbitAvatarsFlash(arrayBufferArr)
{
	statusDiv.setAttribute('data-status','loading');
	const dataArr = arrayBufferArr.map(bytes=>{
		const uint8Array = new Uint8Array(bytes);
		const numArray = Array.from(uint8Array);
		const strArray = numArray.map(bit=>`${bit<16?0:''}${bit.toString(16)}`);
		return strArray.join('').toUpperCase();
	});
	const sp = swfUrl.searchParams;
	const loc1 = _parseBasePath(swfUrl);
	const apiUrl = new URL(`${loc1}index.php`);
	apiUrl.protocol = location.protocol; //解决http和https混合内容的问题
	const asp = apiUrl.searchParams;
	asp.set('m','user');
	asp.set('inajax',1);
	asp.set('a','rectavatar');
	asp.set('appid',sp.get('appid'));
	asp.set('input',sp.get('input'));
	asp.set('agent',sp.get('agent'));
	asp.set('avatartype',sp.get('avatartype'));
	const post = new URLSearchParams();
	dataArr.forEach((str,idx)=>{
		post.set(`avatar${idx+1}`,str)
	});
	post.set('urlReaderTS',Date.now());

	GM_xmlhttpRequest({
		method: "POST",
		url: apiUrl,
		data: post.toString(),
		headers: {"Content-Type": "application/x-www-form-urlencoded"},
		onload: onloadHandler,
		onerror: onerrorHandler,
		onprogress: uploadOnprogressHandler
	});
}

//Flash模式的传统方法
function _parseBasePath(arg1)
{
	let loc1 = arg1.searchParams.get('ucapi');
	if (loc1.length > 0 && !(loc1.substring((loc1.length - 1)) == "/"))
	{
		loc1 = loc1 + "/";
	}
	if (loc1.length > 0 && !new RegExp("^https?://", "i").test(loc1))
	{
		loc1 = "http://" + loc1;
	}
	return loc1;
}

function onloadHandler(response) {
	progressDiv.textContent = "100%";
	const xml = response.responseXML;
	console.log(xml)
	if (xml) {
		const success = xml.querySelector('face');
		if (success != null && success.getAttribute("success") == 1) {
			statusDiv.setAttribute('data-status','success');
		} else {
			statusDiv.setAttribute('data-status','error');
			const message = xml.querySelector('message');
			if (message)
				progressDiv.textContent = message.getAttribute('type') + ': ' + message.getAttribute('value');
			else
				progressDiv.textContent = response.responseText;
		}
	} else {
		statusDiv.setAttribute('data-status','error');
		progressDiv.textContent = 'error: no responseXML';
	}
	onloadendHandler();
}

function onerrorHandler(e) {
	statusDiv.setAttribute('data-status','error');
	onloadendHandler();
}

function onloadendHandler(e) {
	submit.disabled = false;
}

function uploadOnprogressHandler(e) {
	if (e.lengthComputable) {
		progressDiv.textContent = (e.loaded / e.total).toLocaleString(undefined,{style:'percent'});
	}
}
})();
}