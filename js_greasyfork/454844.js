// ==UserScript==
// @name         微博 Weibo_Wency
// @description  通过更改垃圾内容的呈现形式戒断垃圾内容载体
// @author       WencyDeng
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2.5
// @match        *://*.weibo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/454844/%E5%BE%AE%E5%8D%9A%20Weibo_Wency.user.js
// @updateURL https://update.greasyfork.org/scripts/454844/%E5%BE%AE%E5%8D%9A%20Weibo_Wency.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
        布局
    */
    //主框架、左侧侧边栏、主内容、个人资料banner
    GM_addStyle(`
        .Frame_content_3XrxZ{
            max-width:100vw!important;
        }
        .Frame_side_3G0Bf{
            width:220px!important;
        }
        .Frame_side_3G0Bf .Nav_inner_1QCVO{
            padding:10px 4px 40px!important;
        }
        .Main_full_1dfQX{
            width:47vw!important;
        }
        article footer{
            position:relative!important;
        }
        .ProfileHeader_pic_2Coeq{
            height:230px!important;
            overflow:hidden!important;
        }
    `);
    //隐藏内容：右侧侧边栏、首页广告条、首页微博内容类型、个人资料顶部返回条
    //.wbpro-side-main{ width: 285px!important; } .wbpro-side-copy{ display:none!important; }
    GM_addStyle(`
        .Main_side_i7Vti, .Main_sideMain_263ZF, .Side_sideBox_2G3FX{
            width:auto!important;
        }
        .Main_side_i7Vti{
            display:none!important;
        }
        .TipsAd_wrap_3QB_0, .Home_emptyPic_30wte{
            display:none!important;
        }
        .Bar_main_R1N5v{
            display:none!important;
        }
        .Home_wrap_XXu6Z .SecBar_visable_16JHY>div{
            display:none!important;
        }
    `);
    //返回顶部button
    GM_addStyle(`
        .BackTop_main_3m3aB, .m-gotop{
            margin-left:0!important;
            left:auto!important;
            right:10vw!important;
            bottom:10vh!important;
            width:60px!important;
            height:60px!important;
            background-color:#a472cb!important;
            border:none!important;
        }
        .woo-font--backTop{
            font-size:1.5rem!important;
            color:#fff!important;
        }
        .m-gotop a{
            height:100%!important;
            width:100%!important;
        }
    `);
    //微博logo
    GM_addStyle(`
        .Nav_logo_1BwBq{
            width:110px!important;
        }
        .Nav_logo_1BwBq img{
            display:none!important;
        }
        @media (min-width:1320px){
            .Nav_logoWrap_2fPbO{
                margin-left:-123px!important;
            }
        }
        @media (max-width:789px){
            .Nav_logoWrap_2fPbO {
                width:46px!important;
            }
        }
    `);
    //导航
    GM_addStyle(`
        .woo-tab-item-border{
            height:0.2rem!important;
        }
    `);
    //图片
    GM_addStyle(`
        .picture_inlineNum3_3P7k1{
            width:100%!important;
        }
        .picture_item_3zpCn{
            width:8vw!important;
            margin-right:5px!important;
            margin-bottom:5px!important;
        }
        .Viewer_content_3TYae{
            z-index:1!important;
        }
    `);
    //视频
    //.FeedPlayer_feedVideo_39PLs .wbpv-poster:before{ height:50px!important; }
    //.card-video_placeholder_3_xUz:before{ padding-bottom:40vh!important; }
    GM_addStyle(`
        .card-video_placeholder_3_xUz{
            max-height:35vh!important;
        }
        .card-video_plusInfo_IqCJC, .card-video_dur_9_eh0{
            bottom:15px!important;
        }
        .Index_backButton_3Yh5-[title="关闭弹层"] i{
            display:none!important;
        }
        .Index_backButton_3Yh5-[title="关闭弹层"]{
            z-index:1!important;
            top:0!important;
            left:0!important;
            height:100%!important;
            width:100%!important;
            background:none!important;
            border:none!important;
            cursor:default!important;
        }
        .Viewer_container_EZ7Dt{
            height:80%!important;
            width:80%!important;
            margin:5% auto 0!important;
        }
        .Frame_right_2tQRB{
            z-index:2!important;
        }
    `);

    /*
        配色（超链接-c076df，背景-a472cb、rgba(200,200,200,0.23)，标识/悬停-c74ab7）
    */
    GM_addStyle (`
        :root{
            --w-color-orange-3:#aaa!important;
            --weibo-top-nav-logo-color:#fff!important;
            --w-hover:rgba(200,200,200,0.23)!important;

            --w-color-orange-1:#a472cb!important;
            --weibo-top-nav-pub-icon-bg:#a472cb!important;
            --weibo-top-nav-icon-bg-hover:#a472cb!important;

            --w-brand:#c74ab7!important;
            --weibo-top-nav-icon-badge-color:#c74ab7!important;
            --w-badge-background:#c74ab7!important;
        }
        .NavItem_main_2hs9r .woo-badge-outlying{
            color:#c74ab7!important;
            background:rgba(200,200,200,0.23)!important;
        }
        .detail_text_1U10O a, .head_cut_2Zcft:hover, .WB_frame_c a{
            color:#c076df!important;
        }
        .woo-button-flat.woo-button-primary, .IconBox_wrap_W3Oz_.IconBox_pub_1zIJ8{
            background:#a472cb!important;
        }
        .W_btn_a{
            background-color:#a472cb!important;
            border:none!important;
        }
        .UG_tips, .ProfileHeader_tag_2Ku6K{
            color:#c74ab7!important;
        }
        .LoginTopNav_logoS_wOXns path{
            fill:#c74ab7!important;
        }
        .W_btn_a:hover, .Nav_pub_QrDht:hover, .BackTop_main_3m3aB:hover, .woo-button-flat.woo-button-primary:hover, .IconBox_wrap_W3Oz_.IconBox_pub_1zIJ8:hover{
            background:#c74ab7!important;
        }
        .Edit_lsort2_2EtTh{
            border-color:rgba(164,114,203,.6)!important;
        }
        .Edit_lsort2in_2krtb:hover, .woo-button-line:hover, .ProfileHeader_tag_2Ku6K{
            background:rgba(200,200,200,0.23)!important;
        }
        .Edit_lsort2in_2krtb i:hover, .SearchBtn_sipt_3NOip{
            background-color:#fff!important;
        }
        .Nav_wrap_gHB1a .woo-tab-item-main.woo-tab-active, .Nav_wrap_gHB1a .woo-tab-item-main{
            color:#fff!important;
        }
        .Nav_panel_YI3-j{
            background-color:#141414!important;
        }
    `);

    /*
        字体
    */
    GM_addStyle (`
        :root{
            --feed-detail-og-font-size:.95rem!important;
            --feed-detail-re-font-size:.9rem!important;
        }
        .NavItem_text_3Z0D7, .wbpro-tab2 .text{
            font-size:.96rem!important;
        }
        .head_cut_2Zcft{
            font-family:fantasy,"方正姚体"!important;
            font-size:1.2rem!important;
            line-height:1.3rem!important;
        }
        .head-info_info_2AspQ{
            line-height:1rem!important;
        }
        .wbpro-feed-ogText{
            font-weight:bold!important;
            padding-top:8px!important;
        }
        .wbpro-feed-ogText .detail_wbtext_4CRf9 img{
            width:25px!important;
            height:25px!important;
            margin:0 3px!important;
            vertical-align:-2px!important;
        }
        .UG_left_nav .nav_item{
            font-size:16px!important;
        }
    `);

    /*
        背景
    */
    var img= "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGYtczY1LXBvbS0wNzk5LXRlZGR5LTAxLmpwZw.jpg";
    img= "https://s3.bmp.ovh/imgs/2024/01/21/2f37ea2edef22d16.jpg";

    GM_addStyle (`
        body, .Frame_wrap_3g67Q, .wbs-feed{
            background:url(` + img + `) 0 0/contain repeat fixed!important;
        }
        .WB_frame{
            background-color:rgba(250,250,250,0.92)!important;
        }
        .S_page .WB_miniblog{
            background:none!important;
        }
    `);
})();