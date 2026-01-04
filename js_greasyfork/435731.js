// ==UserScript==
// @name         干掉下崽器
// @description  去TM的下崽器
// @version      0.2
// @author       壹局 QQ639446649
// @namespace    http://tampermonkey.net/
// @icon         https://gitee.com/yjgame-mark/tampermonkey/raw/master/killDown/logo.png
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @match        https://dl.pconline.com.cn/download/*
// @match        http://www.2234.cn/soft*
// @match        http://www.downza.cn/soft*
// @match        https://xiazai.zol.com.cn/detail*
// @match        https://www.pcsoft.com.cn/soft*
// @match        https://www.onlinedown.net/soft*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/435731/%E5%B9%B2%E6%8E%89%E4%B8%8B%E5%B4%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/435731/%E5%B9%B2%E6%8E%89%E4%B8%8B%E5%B4%BD%E5%99%A8.meta.js
// ==/UserScript==





(function () {
    'use strict';
    GM_addStyle(`


    #JsoftDes,
    #Jwrap > div.area.sc-1 > div.col-ab > div > div.box.rela-ivy,
    #rela-dl,
    #rela-subject,
    #rela-arts,
    #Jwrap > div.area.sc-1 > div.col-ab > div > div.ivy.ivy-pair,
    #Jwrap > div.area.sc-1 > div.col-ab > div > div.box.navi-floor.rela-new,
    #Jwrap > div.area.sc-1 > div.col-ab > div > div.box.rela-best,
    #Jwrap > div.area.sc-1 > div.col-c,
    #Jwrap > div.area.sc-2,
    #Jwrap > div.area.sc-last,
    #Jwrap > div.area.sc-1 > div.col-abc > div > div > div.publish-area,
    #Jwrap > div.area.sc-1 > div.col-abc > div > div > div.pic-txt > dl > dd,
    #JchaNavSub > div.nav-wrap-r > ul,
    #Jwrap > div.area.sc-1 > div.col-ab > div > div.soft-msg > div > div.msg-l > div > p > span,
    #JhsBtn,
    #Jwrap > div.area.sc-1 > div.col-ab > div.soft-msg > div > div.soft-rel,
    #Jwrap > div.area.sc-1 > div.col-ab > div.ivy.ivy-750,
    #Jwrap > div.area.sc-1 > div.col-ab > div.tab-nav,
    #Jwrap > div.area.sc-1 > div.col-ab > div.box.box-tags,
    #Jwrap > div.area.sc-1 > div.col-ab > div.box.rela-best,
    #Jwrap > div.area.sc-1 > div.col-ab > div.ivy.ivy-pair,
    div.block-jcz,
    div.links > div.bzxz,
    div.links > div.bzxz2,
    #Jwrap > div.area.sc-1 > div.col-ab > div.soft-msg > div > div.link-area > div > p,
    #Jwrap > div.area.sc-1 > div.col-abc > div > div > div.pic-txt > dl > dt > i,
    #Jbody > div.doc > div.header > div.ivy.ivy-tl1
    {
        display:none
    }
    .txt-area > .clearfix > h1
    {
        margin-top:20px
    }


 


    .soft-intro > .guess_head.pull-right,
    .soft-intro > .downza-btn_img.pull-left,
    .soft-info.pull-left > dl > .downbtn.pull-left.mr-20,
    .main.cl.mt-20.mb-20 .pull-right,
    .main.cl.mt-20.mb-20 .m_article,
    .main.cl.mt-20.mb-20 #m_rjjs,
    .main.cl.mt-20.mb-20 #m_tbsm,
    .main.cl.mt-20.mb-20 .side-down3,
    .main.cl.mt-20.mb-20 #m_article,
    .main.cl.mt-20.mb-20 > .pull-left.main-l_box.pos-r > .pc-down_url.mt-20 > .hd-title,
    .main.cl.mt-20.mb-20 > div.pull-left.main-l_box.pos-r > div.pc-down_url.mt-20 > div.bd-content.cl.pt-15.pl-15.pr-15.pb-15 > div.pull-left.pc-down_url_left > div.pull-left > div.down_top.down_remove.qrcode_show,
    .main.cl.mt-20.mb-20 > div.pull-left.main-l_box.pos-r > div.pc-down_url.mt-20 > div.bd-content.cl.pt-15.pl-15.pr-15.pb-15 > div.pull-left.pc-down_url_left > div.pull-left > div.down_bottom,
    .main.cl.mt-20.mb-20 > div.pull-left.main-l_box.pos-r > div.pc-down_url.mt-20 > div.bd-content.cl.pt-15.pl-15.pr-15.pb-15 > div.pull-left.pc-down_url_left > div.pull-left > div:nth-child(1)
    {
        display:none
    }
    .main .pull-left.main-l_box {
        width: 1200px;
    }
    .mt-20 {
        margin-top: 0;
    }




    .soft-header.clearfix > div.soft-info > div > span,
    .soft-summary.soft-summary-mt.clearfix > .soft-box.clearfix.soft-download-btn__04 > .clearfix.soft-down-btns,
    .soft-summary.soft-summary-mt.clearfix > :nth-child(2),
    .soft-summary.soft-summary-mt.clearfix > .soft-box.clearfix.soft-download-btn__04 > div:nth-child(2) > div.soft-text-l > div,
    .bdshare-slide-button-box.bdshare-slide-style-r5 > a,
    .soft-header.clearfix > .plug-tip.no-plug,
    .soft-header.clearfix > .rank-num.bor-r,
    .container > div:nth-child(12),
    .container > ul,
    .container > div.wrapper.clearfix > div.aside,
    .container > div.wrapper.clearfix > div.main > div.section-header.main-taps-link.clearfix,
    #sidebar_1,
    .container > div.wrapper.clearfix > div.main > div:nth-child(4),
    .container > div.wrapper.clearfix > div.main > div:nth-child(6),
    .container > div.wrapper.tonglan-foot,
    .container > div:nth-child(11),
    .container > div.wrapper.clearfix > div.main > div:nth-child(5) > div.sub-section,
    .container > div.wrapper.clearfix > div.main > div:nth-child(5) > div:nth-child(4),
    .container > div.wrapper.clearfix > div.main > div:nth-child(5) > div.downLoad.clearfix > div.down-right,
    .container > div.wrapper.clearfix > div.main > div:nth-child(5) > div.downLoad.clearfix > div.down-left > :nth-child(2),
    #downBoxGaosu > :nth-child(1),
    #downBoxGaosu > :nth-child(2),
    #dm > div.diy_banner > div > div.soft-intro > div.soft-info.pull-left > dl > dt > div.pull-left.cl.cs > span
    {
        display:none
    }
  



    .diy_banner > div > div.soft-intro > div._z5q8evnc7vn iframe,
    .diy_banner > div > div.soft-intro > div.guess_head.pull-left,
    .diy_banner > div > div.bkbottomAD.mt-20,
    .diy_banner > div > div.main.cl.mt-20 > div.pull-right,
    .main.cl.mt-20 > div.pull-left.main-l_box.pos-r > #m_article,
    .main.cl.mt-20 > div.pull-left.main-l_box.pos-r > #m_tags,
    .main.cl.mt-20 > div.pull-left.main-l_box.pos-r > #m_rjjx,
    .main.cl.mt-20 > div.pull-left.main-l_box.pos-r > div.side-down3,
    .diy_banner > div > div.main.cl.mt-20 > div.pull-left.main-l_box.pos-r > div.links,
    .diy_banner > div > div.main.cl.mt-20 > div.pull-left.main-l_box.pos-r > div.pc-down_url.mt-20 > div.hd-title,
    .main.cl.mt-20 > div.pull-left.main-l_box.pos-r > div.pc-down_url.mt-20 > div.bd-content.cl.pt-15.pl-15.pr-15.pb-15 > div.pull-left.pc-down_url_left > div.pull-right.ads,
    .diy_banner > div > div.main.cl.mt-20 > div.pull-left.main-l_box.pos-r > div.pc-down_url.mt-20 > div.bd-content.cl.pt-15.pl-15.pr-15.pb-15 > div.pull-right.relever,
    .main.cl.mt-20 > div.pull-left.main-l_box.pos-r > div.pc-down_url.mt-20 > div.bd-content.cl.pt-15.pl-15.pr-15.pb-15 > div.share,
    .main.cl.mt-20 > div.pull-left.main-l_box.pos-r > div.pc-down_url.mt-20 > div.bd-content.cl.pt-15.pl-15.pr-15.pb-15 > div.pull-left.pc-down_url_left > div.feedback,
    .main.cl.mt-20 > div.pull-left.main-l_box.pos-r > div.pc-down_url.mt-20 > div.bd-content.cl.pt-15.pl-15.pr-15.pb-15 > div.pull-left.pc-down_url_left > div.pull-left > div.down_top.down_remove,
    .main.cl.mt-20 > div.pull-left.main-l_box.pos-r > div.pc-down_url.mt-20 > div.bd-content.cl.pt-15.pl-15.pr-15.pb-15 > div.pull-left.pc-down_url_left > div.pull-left > div:nth-child(1),
    .main.cl.mt-20 > div.pull-left.main-l_box.pos-r > div.pc-down_url.mt-20 > div.bd-content.cl.pt-15.pl-15.pr-15.pb-15 > div.pull-left.pc-down_url_left > div.pull-left > hr,
    .main.cl.mt-20 > div.pull-left.main-l_box.pos-r > div.pc-down_url.mt-20 > div.bd-content.cl.pt-15.pl-15.pr-15.pb-15 > div.pull-left.pc-down_url_left > div.pull-left > span,
    .main.cl.mt-20 > div.pull-left.main-l_box.pos-r > div.pc-down_url.mt-20 > div.bd-content.cl.pt-15.pl-15.pr-15.pb-15 > div.pull-left.pc-down_url_left > div.pull-left > div.down_bottom.h_45.cloud_pop,
    .diy_banner > div > div.soft-intro > div.soft-info.pull-left > dl > div:nth-child(11),
    body > div.container > div.bgWhite > div > div.soft-summary.soft-summary-mt.clearfix > div.soft-box.clearfix.soft-download-btn__09 > div.clearfix.soft-down-btns,
    body > div.container > div.bgWhite > div > div.soft-summary.soft-summary-mt.clearfix > div.soft-box.clearfix.soft-download-btn__09 > div:nth-child(2) > div.soft-text-l > div
    {
        display:none
    }
    .bgWhite {
        min-height: auto;
    }
    .soft-box {
        min-height: 140px;
    }
    .main {
        width: 998px;
        height:100px
    }
    .down-left .down-box-gaosu {
        height: 60px;
    }




    body > div:nth-child(6),
    #main1k > div.xzbox > div.xz_list.clearfix > div.list_rg.list_ltbox.zjbb_lb,
    #main1k > div.xzbox > div.sytjbox,
    #main1k > div.xzbox > div.wrap.clearfix > div.wrap_rg,
    #main1k > div.xzbox > div.wrap.clearfix > div.wrap_lf > div.wrap_lf_tt,
    #main1k > div.xzbox > div.wrap.clearfix > div.wrap_lf > div.wrap_lf_tt_fixed,
    #j_app_desc,
    #main1k > div.xzbox > div.wrap.clearfix > div.wrap_lf > div.more_btn,
    #main1k > div.xzbox > div.wrap.clearfix > div.wrap_lf > div.rjjt_tips,
    #main1k > div.xzbox > div.wrap.clearfix > div.wrap_lf > div.sliderbox,
    #download_addr,
    #main1k > div.xzbox > div.wrap.clearfix > div.wrap_lf > div.xzsbox.mar0,
    #main1k > div.xzbox > div.wrap.clearfix > div.wrap_lf > div.xgztbox,
    #main1k > div.xzbox > div.wrap.clearfix > div.wrap_lf > div.otherbox,
    #main1k > div.xzbox > div.wrap.clearfix > div.wrap_lf > div.xgydbox,
    #main1k > div.xzbox > div.wrap.clearfix > div.wrap_lf > div.ggbox.mar0,
    #main1k > div.xzbox > div.wrap.clearfix > div.wrap_lf > div.cmtbox,
    #cybox,
    #main1k > div.xzbox > div.wrap.clearfix > div.wrap_lf > div.cyboxList,
    #main1k > div.xzbox > div.xz_list.clearfix > div.list_md > div.ls1016xz,
    #main1k > div.xzbox > div.wrap.clearfix > div.wrap_lf > div.xzdzbox > div.xzdz_huodong,
    #main1k > div.xzbox > div.wrap.clearfix > div.wrap_lf > div.xzdzbox > div.tab_list.tab_list_1 > div.xzdz_title2,
    #main1k > div.xzbox > div.wrap.clearfix > div.wrap_lf > div.xzdzbox > div.tab_list.tab_list_1 > div.feedback,
    #xzdz_adver > div > div > div > p,
    #xzdz_adver > div > div > div > dl.clearfix.gsxzdl.qrcode_show,
    #xzdz_adver > div > div > div > dl.clearfix.qrcode_show.count_down,
    #xzdz_adver > div > div > div > div,
    body > div.head > div.header > div.sj
    {
        display:none
    }
    


    body > section > div > div.g-main-top > div.m-sw-center > div.sw-param > div.sw-param-right,
    body > section > div > div.g-main-top > div.m-other-right,
    body > section > div > div.g-main-top > a,
    body > section > div > div.g-main-con > div.m-con-right,
    body > section > div > div.g-main-con > div.m-con-left > div.con-nav.box,
    #ItemRJJS,
    #otherVersion,
    #ItemXGJC,
    #ItemMax,
    #ItemWYPL,
    body > section > div > div.g-main-con > div.m-con-left > div.m-coll2.common-classify-partner,
    body > section > div > div.g-main-top > div.m-sw-center > div.sw-param > div.param-content > p,
    #downBox > div > div.g-huodong,
    #downBox > div > div.down-list > h4:nth-child(1),
    #downBox > div > div.down-list > p:nth-child(2),
    #downBox > div > div.down-list > p:nth-child(4),
    #downBox > div > div.down-list > h4:nth-child(5),
    #downBox > div > div.down-list > a,
    body > section > div > div.g-bottom-banner,
    #autotab,
    body > section > div > div.g-main-top > div.m-sw-center > div.sw-info > div > img,
    body > section > div > div.g-main-top > div.m-sw-center > div.sw-param > div.param-content > div
    {
        display:none
    }
    #downBox
    {
        min-height:100px;
        width: 1200px
    }
    .g-main-top .m-sw-center .sw-param {
        height: 150px;
    }

    `);



})();