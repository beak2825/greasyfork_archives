// ==UserScript==
// @name         Mcbbs-Light
// @namespace    undefined
// @version      0.6
// @description  the new
// @author       Snownee
// @include      *mcbbs.net/*
// @downloadURL https://update.greasyfork.org/scripts/32390/Mcbbs-Light.user.js
// @updateURL https://update.greasyfork.org/scripts/32390/Mcbbs-Light.meta.js
// ==/UserScript==

jQuery(document).ready(function($) {
    console.log('欢迎使用 MCBBS Light! =w=');
    // 修改标题
    // document.title = " Minecraft(我的世界)中文论坛 - Mcbbs";
    // $("[src='template/mcbbs/image/logo_sc.png']").attr("src ", "http://i.imgur.com/8WUBLPS.png");
    // 主体背景颜色
    var css = `
#scrolltop {
bottom: 40px !important;
transform: translateX(50px);
}
#scrolltop .scrolltopa {
background-color: #7E57C2 !important;
background-image: none !important;
border-radius: 50%;
width: 54px !important;
padding: 0;
box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.2);
color: #fff;
line-height: 54px;
font-size: x-large;
font-family: cursive;
font-weight: bolder;
transform: rotate(-89deg);
}
#body_fixed_bg {
background-size: cover !important
}
.ad {
display: none
}
#wp .wp, #hd .wp,
.pm .flb {
background: none !important;
}
.kk_xshow .kkinnerpad,
.kk_xshow .tab,
.plugin .bm_h,
.portal_left_dev,
.m_c,
#ct.wp.ct1,
.move-span,
.appl,
#threadlist,
.pm_tac, .c,
.special_user_login,
#group_f_mn .xld.xlda,
#group_f_mn .tbmu {
background: #FDFDFD !important
}
.portal_left_content,
.portal_left_content,
#portal_index_right .portal_note,
#portal_index_right .portal_news,
#portal_index_right .portal_game,
#portal_index_right .portal_zb,
.portal_wrapper4_dev,
.portal_left_dev,
#autopbn,
.bm_h,
.tbn ul,
#diy5,
#deletepmform,
.ct1, #uhd,
.sttl.mbn {
border: none !important
}
.kk_xshow .tab, .kk_xshow .tab_cur {
color: #444
}
.kk_xshow li,
.pg_index .mn>.fl.bm,
.pg_guide .mn {
background: none !important
}
.bm {
border: none;
background: #FDFDFD !important;
}
#threadlist>.bm_c,
.bm_c[id|=recommendgroups_],
.pg_index .bm_c {
padding: 0 !important
}
#ip_notice,
.special_user_info {
display: none;
}
.bmw,
.move-span,
.special_user_info,
embed,
.kk_xshow .kkinnerpad,
#postlist,
#f_pst,
.portal_left_dev,
#threadlist,
.bml.pbn,
#thread_types,
#autopbn,
#pt,
.pgbtn,
#threadindex>.tindex,
.pg_space .bm,
.appl,
#nv_group .mn>.bm,
#nv_group .sd>.bm,
.pg_spacecp .bm,
#editorbox,
#uhd,
#nv_portal .bm,
#nv_group .tb.cl,
#darkroomtable,
.sttl.mbn,
#postform .bm.cl,
.special_user_login,
#group_f_mn .xld.xlda,
#group_f_mn .tbmu,
.ttp.cl {
box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.2), 0 1px 8px 0 rgba(0, 0, 0, 0.12) !important;
}
#framea7S7Jl, #portal_block_711 {
box-shadow: none !important
}
#visitedforumstmp {
margin-left: 0
}
#faq_right {
margin-left: 0;
background: none;
}
#faq_right .faq_right_inp {
background: none;
border-bottom: 2px solid #C2D5E3;
font-size: 16px;
}
.pg_index .mn {
width: 662px !important;
}
.mn {
padding: 4px !important;
transform: translate(-4px, -4px);
}
table.fl_tb tr,
.tl tr th, .tl tr td,
#hd .p_pop a {
transition: background .2s;
}
table.fl_tb tr:hover,
.tl tr:hover th, .tl tr:hover td,
.kk_xshow .tab_cur,
#hd .p_pop a:hover {
background-color: #EFF6F8 !important
}
.fl_icn, .fl_g, #postbox, #threadlist {
padding: 10px !important;
}
#portal_block_741 iframe, #portal_block_713_content iframe {
height: 416px;
width: 100% !important
}
#portal_block_713 {
height: 450px;
}
.kkinnerpad div img {
visibility: hidden;
}
.bm_h,
.blocktitle.title,
.portal_left_title,
.tbn .mt.bbda,
.mn .tb {
background-color: #1976D2 !important;
background-image: none !important;
padding: 0 10px !important;
}
#nv {
height: 38px !important;
transform: translateY(-5px);
}
.block>.title,
.tbn .mt.bbda,
#threadlist {
width: auto !important
}
#portal_index_right .block .dxb_bc {
margin: 0 4px !important;
}
#autopbn,
.pgbtn a {
color: #fff !important
}
.pgs {
background: none !important
}
#pt .z {
margin-left: 10px
}
#thread_types {
padding: 10px 10px 5px 10px;
}
.pls {
background: #e1f5fe !important;
border-right: 1px solid #C2D5E3 !important;
}
.pi {
border-color: #C2D5E3 !important
}
.tbn li {
border-bottom-style: solid;
margin: 0 !important;
padding: 0 10px !important;
}
.tbn li.a {
border-top: none;
}
.pg_space .pgs {
padding-bottom: 10px;
}
.pg_guide .pbn {
padding-bottom: 0 !important
}
.pg_guide .bm_c.cl.pbn {
display: none
}
.mn .tb li a {
color: #FDFDFD
}
.ct2_a .mn {
transform: translate(4px,-4px);
}
.appl {
width: auto;
margin: 0;
float: none;
}
#nv_group .bm {
margin: 3px;
}
#nv_group .bm_c {
padding: 8px !important;
}
#group_mn {
width: 682px !important
}
.frame-1-1-l, .frame-1-1-r {
width: 48.9% !important
}
#nv_home #ct {
background: none !important
}
#nv_group .tb.cl,
#nv_group .ttp.cl,
#group_f_mn>* {
margin: 0 3px !important
}
#wp #portal_block_741_content {
margin: 0 !important;
}
#nv_search .pgs {
margin-top: 10px;
float: right
}
.showhide, .ignore_notice {
height: 11px !important;
}
#my16modannouncement, #mymodannouncement {
background: #e1f5fe !important;
border-color: #ddd !important;
}
.bbda, .tbmu, .bm_c tr td, .bm_c tr th {
border-bottom: 1px solid #C2D5E3 !important;
}
.fl_row td, #nv_group .bm_c tr:first-child td, #nv_group .bm_c tr:first-child th {
border-top: 1px solid #C2D5E3 !important;
}
.xlda .m {
margin: 8px 0 8px -60px;
}
#group_f_mn .tbmu {
padding: 8px 10px 8px 0;
}
`;

    $('.bm.bmw.cl, #tabVpFJkk_content').css('background', '#FDFDFD');
    $('.bm_c, .move-span').css("cssText", "border:none !important;");
    $('.weiboShow .weiboShow_wrap').css("cssText", "background:#FDFDFD !important;");
    $('#frameEUfgzT, #frameVrMSR7').removeClass('move-span');
    $('.hdc h2 a').attr('href', 'http://www.mcbbs.net/forum.php');
    $('#ft').parent().css({'min-width': '1130px', 'background': 'rgba(0, 0, 0, 0.4) none repeat scroll 0 0', 'margin-top': '-40px', 'padding-top': '50px'});
    $('.pg_group #pgt').parent().css({'background': '#FDFDFD', 'box-shadow': '0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.2), 0 1px 8px 0 rgba(0, 0, 0, 0.12)', 'margin': '0 3px', 'border': 'none'});
    $('#scrolltop .scrolltopa').text('>');
    $('#group_f_mn .tbmu:not(.cl)').css('padding', '0 20px 5px');
    $('#ft').parent().css('background', 'none');
    $('#tabVpFJkk_title').css('background-color', '#DDD');
    $('#toptb').append(`
<a href="javascript:;" id="qmenu" onmouseover="delayShow(this, function () {showMenu({'ctrlid':'qmenu','ctrlclass':'a','duration':1});showForummenu();})" initialized="true" class="a">♥</a>
`);
    $('#qmenu').click(function(e) {$(e).hide();});

    //修改顶部
    css += `
#qmenu.a {
position: absolute;
right: 0;
background: none;
width: auto;
height: 35px;
color: #F44336;
font-size: 24px;
margin: 7px;
}
#toptb {
background: none 0px 0px repeat scroll rgba(0, 0, 0, 0.4);
line-height: 39px;
height: auto;
box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.2);
}
#toptb .z a {
height: 39px;
}
#toptb .z a:hover {
background: rgba(255, 255, 255, 0.2) none repeat scroll 0 0;
background-size: 100% 37px;
color: #fff;
text-decoration: none;
}
#um {
margin-right: 82px;
}
.mc_map_wp {
margin-top: -26px;
}
`;
    $(".hdc.cl > h2").css("margin-top", "-18px").css("margin-left", "130px");

    //边框修改
    css += `
.mc_map_border_top {
background: none;
height: 0;
}
.mc_map_border_right {
background: none
}
.mc_map_border_foot {
height: 0;
background: none
}
.mc_map_border_left {
background: none
}
`;

    //导航栏修改
    css += `
#nv .nv_ul {
background: none
}

#nv .nv_ul li a {
width: 80px;
height: 57px;
padding: 0;
text-align: center;
font-size: 14px;
background: none !important;
border: none
}
#nv .nv_ul li a:hover {
background: none !important;
color: #ffff58;
text-decoration: underline;
}
#nv .nv_ul li {
width: 60px;
padding: 0;
height: 57px;
line-height: 56px;
background: none !important;
}
#nv .nv_ul li:last-child a {
border: none;
}
#nv .nv_ul li:first-child a:hover{
border: none;
}
#nv li#mn_N7844.hover a {
background: none !important;
color: #ffff58 !important;
}
#hd .h_pop {
border: none !important;
background: #FDFDFD !important;
box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.2);
}
#hd .p_pop a {
background: none;
}
`;
    $("#nv_right").remove();

    //修改搜索
    css += `
.y_search {
width: auto;
margin-top:4px;
}
.y_search_inp {
background: none;
}
`;
    $(".y_search_btn").remove();

    //分情况处理
    var url = document.URL;
    if (url.includes("/forum.php") || url.includes("/portal.php")) {

        //修改个人资料部分
        css += `
.special_info_t {
background: none !important
}
.special_info_i {
background: none !important
}
.special_user_info {
background: #FDFDFD !important;
height: 113px !important
}
.special_user_info1, .special_user_info3 {
display: none !important
}
`;

        //背景修改
        css += `
#nv_forum #ct {
background: none;
}
`;

        if (url.includes("/portal.php")) {
            //修改侧边栏
            css += `
#portal_index_right .block {
background: #FDFDFD
}
#portal_index_right .frame {
background: none
}
#portal_index_right .portal_game {
width: auto;
}
#portal_index_right .portal_game {
padding: 0px 1px
}
`;

            $('#portal_block_741_content iframe').css('border', 'none');

            //修改轮播
            css += `
.ss3_wrapper .slideshow_paging li {
background: none;
}
.ss3_wrapper .slideshow_paging a {
width: 90px;
height: 43px;
overflow: hidden;
}
.ss3_wrapper .slideshow_paging .activeSlide {
background-color: rgba(255,255,255,0.4);
}
.portal_wrapper4 .slideshow_paging li {
height: auto;
}
#portal_left .portal_txt table {
margin: auto 8px;
}
.portal_wrapper .slideshow_paging a {
width: 73px;
height: 39px
}
.portal_wrapper .slideshow_paging li {
background: none;
}
.portal_wrapper .slideshow_paging .activeSlide {
background-color: rgba(255,255,255,0.6);
}
#slideshow_3 .slideshow_item .image a {
height: 320px;
width: 670px;
overflow: hidden;
}

`;
        }
        if (url === "http://www.mcbbs.net/forum.php") {
            //修改侧边栏
            css += `
#forum_index_right .frame {
background: none;
}
#forum_index_right .block {
background-color: #FDFDFD !important;
}
.tb a {
border: none;
}
`;
            $('#category_1 td').attr('width', '49.9%');
        }
    } else if (url.includes("http://www.mcbbs.net/misc.php?mod=faq")) {
        //修改背景
        css += `
.tbn {
background: #FDFDFD
}
.lum ul {
background: #FDFDFD !important
}
`;
        if (url === "http://www.mcbbs.net/misc.php?mod=faq") {
            css += `
.bm {
background: none;
}
`;
        }
        if (new RegExp("mod=faq&action=faq&id=\d*").test(url)) {
            css += `
.bm {
background: #FDFDFD
}"
`;
        }
    }
    $("<style></style>").text(css).appendTo($("head"));
});
