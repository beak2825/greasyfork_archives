// ==UserScript==
// @name         初音微博 Weibo_Miku
// @description  初音未来主题微博，背景图来自まきはる-Pixiv
// @author       WencyDeng
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.4
// @match        *://*.weibo.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/466062/%E5%88%9D%E9%9F%B3%E5%BE%AE%E5%8D%9A%20Weibo_Miku.user.js
// @updateURL https://update.greasyfork.org/scripts/466062/%E5%88%9D%E9%9F%B3%E5%BE%AE%E5%8D%9A%20Weibo_Miku.meta.js
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
    //微博logo（https://img.t.sinajs.cn/t5/style/images/register/logo_big.png）
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
            height:0rem!important;
        }
        .Pub_icon_3Vue-{
            vertical-align:0!important;
        }
        img.Ctrls_icon_2mxB4{
            width:33px!important;
            height:33px!important;
            border:none!important;
        }
    `);
    //注册
    GM_addStyle(`
        .W_nologin_main .main_tab_line .cur{
            padding-bottom: 5px!important;
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
    //其他
    GM_addStyle(`
        .UG_box_l, .W_layer_pop > *{
            border:none!important;
        }
        .WB_face .opt .W_btn_b .ficon_add{
            margin-top:5px;!important;
            margin-right:3px;!important;
        }
    `);

    /*
        配色
        ----
        new标识/数字标识——背景为MIKU发圈红色，文字为白色
        数字标识（分组下有新微博）——背景为淡灰色，数字为MIKU葱蓝色
        表单提交按钮、“返回顶部”按钮——默认为MIKU发圈黑色，悬停时为MIKU发圈红色
        导航条——MIKU发圈黑色
        导航条（淡色版）——白色
        导航条（淡色版）上的“发微博”按钮——默认为葱蓝色，悬停时为MIKU发圈红色
        导航条上的“发微博”按钮、“+关注”的加号图标、“立即注册”按钮、注册表单中的警示文字——MIKU发圈红色
        导航条上的“登录”按钮——默认为MIKU葱绿色，悬停时为MIKU发圈红色
        激活的标签、激活的面板标题及下划线标识——MIKU葱蓝色
        超链接、激活的面板标题及下划线标识（登录和注册表单）、选项开关的打开状态、超话页面的“发帖”按钮——MIKU葱绿色
        分隔线、导航项目激活状态、输入框聚焦状态——极淡的葱蓝色
        ----
    */
    //强调色：MIKU发圈-f23369、1d2631
    GM_addStyle (`
        :root{
            --weibo-top-nav-pub-icon-bg:#f23369!important;
            --weibo-top-nav-icon-badge-color:#f23369!important;
            --w-badge-background:#f23369!important;
            --w-liked-color:#f23369!important;
            --w-b-flat-primary-bg:#1d2631!important;
            --icon-bg-spe-4:#faadc3!important;
        }
        .Nav_wrap_gHB1a .woo-tab-item-main,
        .W_login_form .register a, .W_reg_form .tit i, .W_reg_form .error,
        .toolbar_cur_JoD5A button, .approval_box a:hover *,
        .W_btn_b:hover em.S_ficon, .W_btn_b em.ficon_add
        {
            color:#f23369!important;
        }
        .Nav_pub_QrDht:hover, .Pub_wrap_2V6Wk:hover, .IconBox_wrap_W3Oz_.IconBox_pub_1zIJ8:hover{
            background:#f34778!important;
        }
        .UG_left_nav .nav_item.cur, .UG_left_nav .nav_item:hover,
        .Nav_loginArea_2HJSu .loginBtn:hover, .W_btn_a:hover, .woo-button-flat.woo-button-primary:hover, .BackTop_main_3m3aB:hover,
        .s-btn-b:hover, .WB_global_nav .ficon_send:hover,
        .W_btn_big:hover, .btn_reg_a:hover,
        .IconBox_wrap_W3Oz_.IconBox_pub_1zIJ8
        {
            background:#f23369!important;
        }
        .Nav_panel_YI3-j, .W_btn_a, .BackTop_main_3m3aB, .m-gotop,
        .W_btn_big, .btn_reg_a
        {
            background:#1d2631!important;
            border:none!important;
        }
        .W_btn_big span, .btn_reg_a span{
            background:unset!important;
            border:none!important;
        }
        .W_layer .content{
            border-color:#f23369!important;
        }
    `);
    //超链接：MIKU葱绿色-39c5bb
    GM_addStyle (`
        :root{
            --w-alink:#39c5bb!important;
            --weibo-top-nav-loginBtn-bg:#39c5bb!important;
        }
        .detail_text_1U10O a, .WB_frame_c .WB_text a, .UG_contents ul a, .W_reg_info a,
        .card-feed .txt a, .card-feed .info .name:hover, .media-item-a a:hover, .main-side a:hover, .layer_menu_list li a:hover,
        .WB_global_nav a:hover, .WB_global_nav a:hover em, a.S_txt1:hover, a.S_txt1:hover *,
        .csc_describe dd a,
        .wbs-pic .pic .detail .con a:hover,
        .card-direct-a .info div a.name:hover,
        .login_box .info_header a.cur
        {
            color:#39c5bb!important;
        }
        .login_box .info_header a.cur, .W_nologin_main .main_tab_line a.cur, .wbs-pic .pic:hover, .m-adv-search dd label input:checked + em{
            border-color:#39c5bb!important;
        }
        .wbpro-setup__box .woo-switch-checked:after, .W_btn_c, .m-adv-search dd label input:checked + em{
            background:#39c5bb!important;
        }
        .W_btn_c:hover{
            background:#4dcbc2!important;
        }
    `);
    //标识/徽章：MIKU葱蓝色-4aa5c0
    GM_addStyle (`
        :root{
            --w-brand:#4aa5c0!important;
        }
        .NavItem_main_2hs9r .woo-badge-outlying,
        .UG_tips, .ProfileHeader_tag_2Ku6K,
        .WB_row_line a:hover, .WB_row_line a:hover em,
        .subinfo_rgt.S_txt2:hover *,
        .m-sub-nav li a.cur, .m-sub-nav li a:hover,
        .PCD_tab .tb_tab .current .tab_link *,
        .S_txt2 a:hover
        {
            color:#4aa5c0!important;
        }
        .WB_global_nav{
            border-color:#4aa5c0!important;
        }
        .WB_global_nav .ficon_send, .PCD_tab .tb_tab .tab_link .ani_border{
            background:#4aa5c0!important;
        }
    `);
    //极淡的葱蓝色-a6dbdd
    GM_addStyle (`
        :root{
            --w-dividing-line:#a6dbdd42!important;
            --weibo-top-nav-icon-bg-hover:#a6dbdd!important;
        }
        .woo-tab-active .Ctrls_item_3KzNH{
            background-color:#a6dbdd!important;
        }
        .LoginTopNav_logoS_wOXns path{
            fill:#a6dbdd!important;
        }
        .W_input:focus, .W_input_focus{
            border-color:#a6dbdd!important;
        }
    `);
    //白色、灰色
    GM_addStyle (`
        :root{
            --weibo-top-nav-logo-color:#fff!important;
            --w-badge-text: #fff!important;
            --w-hover:rgba(200,200,200,0.23)!important;
        }
        .Edit_lsort2in_2krtb:hover, .woo-button-line:hover,
        .ProfileHeader_tag_2Ku6K, .NavItem_main_2hs9r .woo-badge-outlying,
        .vc-rounded-full:hover, .vc-bg-blue-600:before, .vc-bg-blue-200
        {
            background:rgba(200,200,200,0.23)!important;
        }
        .Edit_lsort2in_2krtb i:hover{
            background-color:#fff!important;
        }
        .WB_global_nav .gn_search_v2{
            background-color:#fff!important;
            border:none!important;
        }
        .W_header_line{
            background-image:linear-gradient(90deg,#f23369,#4aa5c0,#39c5bb,#fff)!important;
            height:5px!important;
            border:none!important;
        }
        .nologin_footer *:not(select):not(option), .Bottom_text_1kFLe, .WB_global_nav .ficon_send:hover, .Tit_tit_1Accn, .Tit_titS_p5IvQ, .raffle_bnt a:hover{
            color:#fff!important;
        }
        .wbs-index .main .search .searchbox input{
            color:#fff!important;
            border-color:#fff!important;
        }
        .UG_tips, WB_global_nav, .SearchBtn_sipt_3NOip{
            background-color:#fffffff4!important;
        }
        .wbs-pic .pic .detail .con a{
            color:#333!important;
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
        .head_cut_2Zcft, .MessageLike_h3_2T4HG, .MessageCmt_h3_2gOAo, .card-feed .info .name{
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
    var img= "https://wx2.sinaimg.cn/large/680cf4dcgy1hdsdmacvsmj22a11lrnpd.jpg";
    img= "https://s3.bmp.ovh/imgs/2024/01/21/67f34c42666d1b1c.jpg";

    GM_addStyle (`
        body, .Frame_wrap_3g67Q, .wbs-feed{
            background:url(` + img + `) -38% 0%/auto 100% repeat fixed!important;
        }
        .WB_frame{
            background-color:rgba(250,250,250,0.92)!important;
        }
        .WB_miniblog, body.B_frame{
            background:none!important;
        }
    `);
})();