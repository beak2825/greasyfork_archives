// ==UserScript==
// @name         绿色下载
// @namespace    http://z.houbin.site/download
// @version      0.4
// @description  去掉下载网站无关内容(高速下载/下载器/页面广告),持续更新中
// @author       z.houbin
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372099/%E7%BB%BF%E8%89%B2%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/372099/%E7%BB%BF%E8%89%B2%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var path = window.location.pathname;
    switch (window.location.hostname) {
        case 'www.cncrk.com':
            www_cncrk_com();
            break;
        case 'www.downza.cn':
            www_downza_cn();
            break;
        case 'xiazai.zol.com.cn':
            xiazai_zol_com_cn();
            break;
        case 'www.huacolor.com':
            www_huacolor_com();
            break;
        case 'dl.pconline.com.cn':
            dl_pconline_com_cn();
            break;
        case 'pc.qq.com':
            pc_qq_com();
            break;
        case 'www.onlinedown.net':
            www_onlinedown_net();
            break;
        case 'www.wmzhe.com':
            www_wmzhe_com();
            break;
        case 'download.pchome.net':
            download_pchome_net();
            break;
        case 'www.pc6.com':
            www_pc6_com();
            break;
        case 'www.crsky.com':
            www_crsky_com();
            break;
        case 'www.duote.com':
            www_duote_com();
            break;
        case 'mydown.yesky.com':
            mydown_yesky_com();
            break;
        case 'www.xiazaiba.com':
            www_xiazaiba_com();
            break;
        case 'www.ddooo.com':
            www_ddooo_com();
            break;
        case 'www.cr173.com':
            www_cr173_com();
            break;
        case 'www.xpgod.com':
            www_xpgod_com();
            break;
        case 'www.fixdown.com':
            www_fixdown_com();
            break;
        case 'www.downcc.com':
            www_downcc_com();
            break;
        case 'www.33lc.com':
            www_33lc_com();
            break;
        case 'www.ttrar.com':
            www_ttrar_com();
            break;
        case 'www.xitongzhijia.net':
            www_xitongzhijia_net();
            break;
        case 'www.bkill.com':
            www_bkill_com();
            break;
        case 'www.uzzf.com':
            www_uzzf_com();
            break;
        case 'www.veryhuo.com':
            www_veryhuo_com();
            break;
        case 'www.3987.com':
            www_3987_com();
            break;
        case 'down.52pk.com':
            down_52pk_com();
            break;
        case 'www.downxia.com':
            www_downxia_com();
            break;
        case 'www.66868.com':
            www_66868_com();
            break;
        case 'www.jz5u.com':
            www_jz5u_com();
            break;
        case 'www.anxz.com':
            www_anxz_com();
            break;
        case 'www.jisuxia.com':
            www_jisuxia_com();
            break;
        case 'www.wishdown.com':
            www_wishdown_com();
            break;
        case 'www.xzking.com':
            www_xzking_com();
            break;
        case 'www.minixiazai.com':
            www_mixiazai_com();
            break;
        case 'www.xp510.com':
            www_xp510_com();
            break;
        case 'www.05sun.com':
            www_05sun_com();
            break;
        case 'www.121down.com':
            www_121down_com();
            break;
        case 'www.pcsoft.com.cn':
            www_pcsoft_com_cn();
            break;
        case 'www.pc141.com':
            www_pc141_com();
            break;
        case 'www.xue51.com':
            www_xue51_com();
            break;
        case 'www.jb51.net':
            www_jb51_net();
            break;
        case 'www.jisuxz.com':
            if (path.indexOf('/down/') == 0) {
                www_jisuxz_com();
            }
            break;
        case 'www.dytt8.net':
            www_dytt8_net();
            break;
        case 'www.appinn.com':
            www_appinn_com();
            break;
        case 'www.portablesoft.org':
            www_portablesoft_org();
            break;
        case 'down.orsoon.com':
            down_orsoon_com();
            break;
        case 'www.ouyaoxiazai.com':
            www_ouyaoxiazai_com();
            break;
        case 'www.downkr.com':
            www_downkr_com();
            break;
        case 'www.xdowns.com':
            www_xdowns_com();
            break;
        case 'www.xiazaizhijia.com':
            www_xiazaizhijia_com();
            break;
        case 'www.14498.com':
            www_14498_com();
            break;
        case 'www.52z.com':
            www_52z_com();
            break;
        case 'soft.hao123.com':
            soft_hao123_com();
            break;
        case 'www.kuaihou.com':
            www_kuaihou_com();
            break;
        default:
            break;
    }

    loadStyle('newsfeed{display:none !important};ins{display:none !important};');

    function www_kuaihou_com() {
        console.log('www_kuaihou_com ad');
        var css = '#xiazhong1 {display:none !important}';
        css += '.ad-widget-imageplus-sticker{display:none !important}';
        css += '.baiduimageplus-s-bd{display:none !important}';
        css += '.baiduimageplus-s{display:none !important}';
        css += '#content > div:nth-child(7){display:none !important}';
        css += '#download > ul > li.address-wrap.on > ul:nth-child(4){display:none !important}';
        loadStyle(css);
    }

    function soft_hao123_com() {
        console.log('soft_hao123_com ad');
        var css = '.ps_290 {display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.popup{display:none !important}';
        css += '.soft-cont{width:auto!important}';
        loadStyle(css);
    }

    function www_52z_com() {
        console.log('www_52z_com ad');
        var css = '.elXxzt {display:none !important}';
        css += '#xiazaila{display:none !important}';
        css += '.flashbox{display:none !important}';
        css += '#softdown{display:none !important}';
        css += '#cai{display:none !important}';
        css += '#zhuanti{display:none !important}';
        css += '.elSytjBox{display:none !important}';
        css += '#downajaxview > div:nth-child(4){display:none !important}';
        loadStyle(css);
    }

    function www_14498_com() {
        console.log('www_14498_com ad');
        var css = '.syXxJcBox{display:none !important}';
        css += '.syRele{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.werZjList{display:none !important}';
        css += 'ins{display:none !important}';
        css += '.syDaRight{display:none !important}';
        css += 'body > div.wezMain > div.syDeLeft > div:nth-child(1){display:none !important}';
        css += 'body > div.wezMain > div.syEdBox{display:none !important}';
        css += '#hm_t_58414{display:none !important}';
        css += 'body > div.wezMain > div.syDeLeft > div:nth-child(4){display:none !important}';
        css += 'body > div.wezMain > div.syDeRight > div:nth-child(8){display:none !important}';
        css += '#MZAD_POP_PLACEHOLDER{display:none !important}';

        css += '#SOHUCS{display:none !important}';
        loadStyle(css);
    }

    function www_xiazaizhijia_com() {
        console.log('xiazaizhijia ad');
        var css = '#gg_1{display:none !important}';
        css += '#gg_2{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '#gg_3{display:none !important}';
        css += '#public_right_mid_ad{display:none !important}';
        css += '#xiazai_url_right_ad{display:none !important}';
        css += 'newsfeed{display:none !important}';
        css += '.m-hot-word{display:none !important}';
        css += 'body > div.page-art-soft > div > div.fix > div.col-l-l > div.art-main > div.m-art-dl.J_dl_area.J_tab_cont > div.fix.J_tab_cont > div.inner.fl.fix > div > ul:nth-child(4){display:none !important}';
        css += 'body > div.page-art-soft > div > div.fix > div.col-l-l > div.art-main > div.m-art-dl.J_dl_area.J_tab_cont > div.fix.J_tab_cont > div.inner.fl.fix > div > h3:nth-child(1){display:none !important}';
        loadStyle(css);
    }

    function www_xdowns_com() {
        console.log('www_xdowns_com ad');
        var css = '#tips{display:none !important}';
        css += '#main > div.appcon > div:nth-child(4){display:none !important}';
        loadStyle(css);
    }

    function www_downkr_com() {
        console.log('www_downkr_com ad');
        var css = '.download-panel-top{display:none !important}';
        css += '.hidden-xs{display:none !important}';
        loadStyle(css);
    }

    function www_ouyaoxiazai_com() {
        console.log('www_ouyaoxiazai_com ad');
        var css = '.qzhengfu{display:none !important}';
        loadStyle(css);
    }

    function down_orsoon_com() {
        console.log('down_orsoon_com ad');
        var css = '.prev-content{display:none !important}';
        css += '.high-down{display:none !important}';
        css += '#down-wrapper > p:nth-child(2){display:none !important}';
        loadStyle(css);
    }

    function www_appinn_com() {
        console.log('www_appinn_com ad');
        var css = 'ins{display:none !important}';
        loadStyle(css);
    }

    function www_portablesoft_org() {
        console.log('www_portablesoft_org ad');
        var css = '#bdun{display:none !important}';
        css += '.adsbygoogle{display:none !important}';
        css += '.bdunc{display:none !important};';
        loadStyle(css);
    }

    function www_dytt8_net() {
        console.log('www_dytt8_net ad');
        var css = 'body>div:nth-child(3){display:none !important}';
        css += 'iframe{display:none !important}';
        css += 'body>div:nth-child(4){display:none !important};';
        css += '.bd6{display:none !important}';
        css += '#header > div > div.bd2 > div.bd3 > div.bd6{display:none !important}';
        css += '#header > div > div.bd2 > div.bd3 > div.bd3l > div:nth-child(6){display:none !important}';
        css += '#header > div > div.bd2 > div.bd3 > div.bd3l > div:nth-child(7){display:none !important}';
        css += '#Zoom > span > a{display:none !important}';
        loadStyle(css);
    }

    function www_jisuxz_com() {
        console.log('www_jisuxz_com ad');
        var css = '#2345float{display:none !important}';
        css += '#Template_jisuxz >div:nth-child(2){display:none !important}';
        css += '.imgfloat{display:none !important}';
        css += '.browser2345{display:none !important}';
        css += '.download-share{display:none !important}';
        css += '#downcont4 > div.download-list > ul:nth-child(2){display:none !important}';
        css += '#downcont4 > div.download-list > span:nth-child(1){display:none !important}';
        loadStyle(css);
    }

    function www_jb51_net() {
        console.log('www_jb51_net ad');
        var css = 'body > div.header > div.wrap > div > div:nth-child(2){display:none !important}';
        css += 'body > div.header > div.wrap > div > div:nth-child(3){display:none !important}';
        css += '.tonglan{display:none !important}';
        css += '#dingandcai{display:none !important}';
        css += '#samesoft > a{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.side-box{display:none !important}';
        css += '#mainBody > div:nth-child(4){display:none !important}';
        css += '.mg20{display:none !important}';
        css += '#content > dd:nth-child(4){display:none !important}';
        css += 'da-download{display:none !important}';
        css += '#gaosu{display:none !important}';
        css += '.da-download{display:none !important}';
        css += '.ad-widget-imageplus-sticker{display:none !important}';
        css += 'li.address-wrap.on > h3:nth-child(2){display:none !important}';
        loadStyle(css);
    }

    function www_xue51_com() {
        console.log('www_xue51_com ad');
        var css = 'div.conins>div:nth-child(2){display:none !important}';
        css += 'div.rj_show_cen_l.l>div:nth-child(6){display:none !important}';
        css += '#gsxz > dl:nth-child(2){display:none !important}';
        loadStyle(css);
    }

    function www_pc141_com() {
        console.log('www_pc141_com ad');
        var css = '.soft-btn{display:none !important}';
        css += 'body > div.main > div.content > div.c-left > a{display:none !important}';
        css += '#down_one_a{display:none !important}';
        css += '#down_show_0 > p:nth-child(2){display:none !important}';
        loadStyle(css);
    }

    function www_pcsoft_com_cn() {
        console.log('www_pcsoft_com_cn ad');
        var css = 'body > div:nth-child(7){display:none !important}';
        css += 'body > div:nth-child(8){display:none !important}';
        css += '.zjbb_lb{display:none !important}';
        css += 'body > div:nth-child(3){display:none !important}';
        css += '.xzsbox {display:none !important}';
        css += 'newsfeed{display:none !important}';
        css += '.gsxzdl{display:none !important}';
        css += '#mv_ad_render{display:none !important}';

        loadStyle(css);
    }

    function www_121down_com() {
        console.log('www_121down_com ad');
        var css = '.c_soft_pic{display:none !important}';
        css += '#full_downad{display:none !important}';
        loadStyle(css);
    }

    function www_05sun_com() {
        console.log('www_05sun_com ad');
        var css = 'iframe{display:none !important}';
        css += '.ct-c{display:none !important}';
        css += 'body > div.con.soft.w > div:nth-child(1){display:none !important}';
        css += 'div.con-add > div:nth-child(1){display:none !important}';
        css += 'div.add-l.soft > ul.xzq{display:none !important}';
        css += 'div.add-l.soft > span:nth-child(2){display:none !important}';
        loadStyle(css);
    }

    function www_xp510_com() {
        console.log('www_xp510_com ad');
        var css = '.min-ad{display:none !important}';
        css += '#div_6{display:none !important}';
        css += '#div_29{display:none !important}';
        css += '.xzbox-gh{display:none !important}';
        css += ' div.xzbox-lf > p:nth-child(2){display:none !important}';
        css += ' div.xzbox-lf > ul:nth-child(3){display:none !important}';
        css += 'newsfeed{display:none !important}';
        loadStyle(css);
    }

    function www_mixiazai_com() {
        console.log('www_mixiazai_com ad');
        var css = 'body > article > div{display:none !important}';
        css += 'body > section:nth-child(4) > section > aside{display:none !important}';
        css += '#download > section > div > article > article{display:none !important}';
        css += 'div.down-main > h3:nth-child(2){display:none !important}';
        css += 'div.down-main > ul:nth-child(3){display:none !important}';
        css += 'div.down-main > ul:nth-child(4){display:none !important}';
        css += 'download{display:none !important}';
        loadStyle(css);
    }

    function www_xzking_com() {
        console.log('www_xzking_com ad');
        var css = '.con1_hrefdown{display:none !important}';
        css += '.down_right{display:none !important}';
        css += '#SOHUCS{display:none !important}';
        css += 'div.down_ul > ul > li:nth-child(2){display:none !important}';
        css += 'div.down_ul > ul > li:nth-child(3){display:none !important}';
        css += 'div.down_ul > ul > li:nth-child(4){display:none !important}';
        loadStyle(css);
    }

    function www_wishdown_com() {
        console.log('www_wishdown_com ad');
        var css = '.fr{display:none !important}';
        css += '#_ys_xiazai4{display:none !important}';
        css += '#softdown > div.all_bw_bd > div.down_adress_top.fl > ul.clearfix.tongyixzq{display:none !important}';
        loadStyle(css);
    }

    function www_jisuxia_com() {
        console.log('www_jisuxia_com ad');
        var css = 'div.related-soft.fl-lf > p{display:none !important}';
        css += 'iframe{display:none !important}';
        css += 'div.down-main.fl-lf > ul:nth-child(2){display:none !important}';
        css += '#top > div.layout > article{display:none !important}';
        loadStyle(css);
    }

    function www_anxz_com() {
        console.log('www_anxz_com ad');
        var css = '#page > section:nth-child(5) > section > aside{display:none !important}';
        css += '#gaosuxiazai{display:none !important}';
        css += 'ul.mod-list > h3:nth-child(2){display:none !important}';
        loadStyle(css);
    }

    function www_jz5u_com() {
        console.log('www_jz5u_com ad');
        var css = 'center{display:none !important}';
        css += '.co5r{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.baiduimageplus-s-pa{display:none !important}';
        css += '.dkl{display:none !important}';
        css += '#Down_1_2_2 > div.co_content5 > div:nth-child(1) > div.down_url > span:nth-child(1){display:none !important}';
        css += 'body > div.bd3 > div.bd3l > div:nth-child(3){display:none !important}';
        css += '.ad-widget-imageplus-sticker{display:none !important}';
        css += 'body > div.bd3 > div.bd3r > div > div:nth-child(9) > div.co_content7 > ul:nth-child(4){display:none !important}';
        loadStyle(css);
    }

    function www_66868_com() {
        console.log('www_66868_com ad');
        var css = 'body > div:nth-child(12){display:none !important}';
        css += '#a7 > div.dl_box > div.dl_addr > dl:nth-child(2){display:none !important}';
        loadStyle(css);
    }

    function www_downxia_com() {
        console.log('www_downxia_com ad');
        var css = '#bd > div > a{display:none !important}';
        css += '.download-ad{display:none !important}';
        css += '#softdown{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '#gaosu_div0{display:none !important}';
        css += '#download > div.tab_con3 > div.left.l.pr > div:nth-child(1) > ul > h3:nth-child(1){display:none !important}';
        loadStyle(css);
    }

    function down_52pk_com() {
        console.log('down_52pk_com ad');
        var css = '#cs_CFdivdlST_B_1{display:none !important}';
        css += '#cs_CFdivdlST_B_0{display:none !important}';
        css += '.adv{display:none !important}';
        css += '#siderAdv{display:none !important}';
        css += '#acool4{display:none !important}';
        css += '#address > div.down_txt1.clfx > dl:nth-child(2){display:none !important}';
        css += '.add{display:none !important}';
        css += '.down_adv{display:none !important}';
        css += 'div.download > dl:nth-child(1) > dd > ul > li:nth-child(1){display:none !important}';
        css += 'div.download > dl:nth-child(1) > dd > ul > li:nth-child(2){display:none !important}';

        loadStyle(css);
    }

    function www_3987_com() {
        console.log('www_3987_com ad');
        var css = '.min-sd{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '#div_5{display:none !important}';
        css += '#div_23{display:none !important}';
        css += '.xzbox-gh{display:none !important}';
        css += '.zxbq{display:none !important}';
        css += '.gaosu{display:none !important}';
        css += '.samesoft{display:none !important}';
        css += '.soft-label{display:none !important}';
        css += '.comment_box{display:none !important}';
        css += '#jprj{display:none !important}';
        css += '#djdxh{display:none !important}';
        css += '.abcbox{display:none !important}';
        css += 'body > div.main > div.content > div:nth-child(2){display:none !important}';
        css += 'newsfeed{display:none !important}';
        css += '#xzdz > div.xzbox > div.xzbox-lf > p:nth-child(2){display:none !important}';
        css += '#xzdz > div.xzbox > div.xzbox-lf > ul:nth-child(3){display:none !important}';
        loadStyle(css);
    }

    function www_veryhuo_com() {
        console.log('www_veryhuo_com ad');
        var css = 'body > div.container > div.span-24 > div.softright > div.box2 > div.sif > div.sif_r > div{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '#w720{display:none !important}';
        css += '.w720{display:none !important}';
        css += '#w1000{display:none !important}';
        css += '.download_adv{display:none !important}';
        css += 'div.down_lis > b > ul > li:nth-child(0){display:none !important}';
        css += 'div.down_lis > b > ul > li:nth-child(1){display:none !important}';
        css += 'div.down_lis > b > ul > li:nth-child(2){display:none !important}';
        css += 'div.down_lis > b > ul > li:nth-child(3){display:none !important}';
        css += 'div.down_lis > b > ul > li:nth-child(4){display:none !important}';
        css += 'div.down_lis > b > ul > li:nth-child(5){display:none !important}';
        css += 'div.down_lis > b > ul > li:nth-child(6){display:none !important}';
        loadStyle(css);
    }

    function www_uzzf_com() {
        console.log('www_uzzf_com ad');
        var css = '.m-resoft{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.detail-main-title{display:none !important}';
        css += '.alliance-ad{display:none !important}';
        css += '.underline{display:none !important}';
        css += '.c_soft_same{display:none !important}';
        css += '.fastdownload{display:none !important}';
        css += '.address_r{display:none !important}';
        css += '.topdown{display:none !important}';
        css += '.g-fx{display:none !important}';
        css += '#pl{display:none !important}';
        css += '#xgwz{display:none !important}';
        css += '#blzx{display:none !important}';
        css += '#bltj{display:none !important}';
        css += '.softdza{display:none !important}';
        css += '.xiangguan-ad{display:none !important}';
        css += 'ul.ul_Address > h3{display:none !important}';
        css += 'ul.ul_Address > li:nth-child(0){display:none !important}';
        css += 'ul.ul_Address > li:nth-child(1){display:none !important}';
        css += 'ul.ul_Address > li:nth-child(2){display:none !important}';
        css += 'ul.ul_Address > li:nth-child(3){display:none !important}';
        css += 'ul.ul_Address > li:nth-child(4){display:none !important}';
        css += 'ul.ul_Address > li:nth-child(5){display:none !important}';
        css += 'ul.ul_Address > li:nth-child(6){display:none !important}';
        css += 'ul.ul_Address > li:nth-child(7){display:none !important}';
        loadStyle(css);
    }

    function www_bkill_com() {
        console.log('www_bkill_com ad');
        var css = '.cross-ad{display:none !important}';
        css += '.yinsu_yd{display:none !important}';
        css += '.detail-main-title{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.alliance-ad{display:none !important}';
        css += 'div.half-lad.fl > div.fr > a > img{display:none !important}';
        css += '.underline{display:none !important}';
        css += '.soft-desc-heji{display:none !important}';
        css += '.side{display:none !important}';
        css += '.soft-xiangguan{display:none !important}';
        css += '.softdza{display:none !important}';
        css += '.xiangguan-ad{display:none !important}';
        loadStyle(css);
    }

    function www_xitongzhijia_net() {
        console.log('www_xitongzhijia_net ad');
        var css = 'iframe{display:none !important}';
        css += ".m-related-list{display:none !important}";
        css += ".m-faq {display:none !important}";
        css += "div.art-detail.fix > div:nth-child(2){display:none !important}";
        loadStyle(css);
    }

    function www_ttrar_com() {
        console.log('www_ttrar_com ad');
        var css = '.sj{display:none !important}';
        css += '.list_lf{display:none !important}';
        css += '.md_gg{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.boxlist {display:none !important}';
        css += '.gjcbox {display:none !important}';
        css += '.g-hotico {display:none !important}';
        css += '#djdxh {display:none !important}';
        css += '.xzsbox{display:none !important}';
        css += '.share{display:none !important}';
        css += 'div.sortbox > div > dl:nth-child(1){display:none !important}';
        loadStyle(css);
    }

    function www_33lc_com() {
        console.log('www_33lc_com ad');
        var css = 'iframe{display:none !important;height:0px !important}';
        css += '.share{display:none !important}';
        css += 'div.md_bt > div.bt_abtn > a.ags{display:none !important}';
        css += '#gdgs_r{display:none !important}';
        css += '#adbox{display:none !important}';
        css += 'div.dl_list_info > dl:nth-child(1){display:none !important}';
        loadStyle(css);
    }

    function www_downcc_com() {
        console.log('www_downcc_com ad');
        var css = '#download > section.download-mod.mg-Lr20.clear.zm > article:nth-child(3){display:none !important}';
        css += '.hm-t-container{display:none !important}';
        css += '.hm_t_2591{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.hot-soft{display:none !important}';
        css += '.soft-hot-bd{display:none !important}';
        css += '.hot-search{display:none !important}';
        css += '.top-download{display:none !important}';
        css += 'div.maindown_w4 > a.m-bdtn.downnowgaosu{display:none !important}';
        css += '.soft-details-news{display:none !important}';
        css += '#comment{display:none !important}';
        css += '#gaosuxiazai{display:none !important}';
        css += 'body > section.mg-t10.layout.clear > article > section:nth-child(5){display:none !important}';//猜你喜欢
        css += '#download > section.download-mod.mg-Lr20.clear.zm > article.clear > section > div > ul > h3:nth-child(3){display:none !important}';
        loadStyle(css);
    }

    function www_fixdown_com() {
        console.log('www_fixdown_com ad');
        var css = '.md_bt{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.gjcbox{display:none !important}';
        css += '.rmbox{display:none !important}';
        css += '#xzqdzbox > div.tab_list.tab_list_1 > div.xzdz_wrap.clearfix > div > div > div > dl:nth-child(1){display:none !important}';
        //css += '.ad_id_1{display:none !important}';
        // css += '.list_bt{display:none !important}';
        // css += 'div.sort_list>dl:nth-child(1){display:none !important}';
        loadStyle(css);
    }

    function www_xpgod_com() {
        console.log('www_xpgod_com ad');
        var css = '.top_r{display:none !important}';
        css += 'iframe{display:none !important;height:0px !important}';
        css += '.soft_snap{display:none !important}';
        css += '.gg{display:none !important}';
        css += '.art_lm_gg{display:none !important;height:0px !important}';
        css += '.show_xzq{display:none !important}';
        css += '.tltj_r{display:none !important}';
        css += '#bzxz > a:nth-child(2){display:none !important}';
        css += '.soft_rmsy{display:none !important}';
        css += '.rmzt{display:none !important}';
        css += '#cnxh{display:none !important}';
        css += '#sr_top{display:none !important}';
        css += '.share{display:none !important}';
        css += '.gjc{display:none !important}';
        css += 'div.softny1 > div.box > div.box_l > div.button{display:none !important}';
        loadStyle(css);
    }

    function www_cr173_com() {
        console.log('www_cr173_com ad');
        var css = '.show_970{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.m-soft-ad{display:none !important}';
        css += '.icolst{display:none !important}';
        css += '.c_info_side{display:none !important}';
        css += '#class-cms{display:none !important}';
        css += '#class-soft{display:none !important}';
        css += '#comment_list{display:none !important}';
        css += '.downnowgaosu{display:none !important}';
        css += 'div.span3.m-log-search > ul{display:none !important}';
        //css += '#c_des_content > div:nth-child(6){display:none !important}';
        css += '#full_downad{display:none !important}';
        css += 'ul.ul_Address > li:nth-child(0){display:none !important}';
        css += 'ul.ul_Address > li:nth-child(1){display:none !important}';
        css += 'ul.ul_Address > li:nth-child(2){display:none !important}';
        css += 'ul.ul_Address > li:nth-child(3){display:none !important}';
        css += 'ul.ul_Address > li:nth-child(4){display:none !important}';
        css += 'ul.ul_Address > li:nth-child(5){display:none !important}';
        css += 'ul.ul_Address > li:nth-child(6){display:none !important}';
        css += 'ul.ul_Address > li:nth-child(7){display:none !important}';
        css += '#download > div:nth-child(2) > ul > h3.f-gsh3{display:none !important}';

        loadStyle(css);
    }

    function www_ddooo_com() {
        console.log('www_ddooo_com ad');
        var css = 'ddooo_ad{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.pcbnt{display:none !important}';
        css += 'ul.listaddr > li:nth-child(0){display:none !important}';
        css += 'ul.listaddr > li:nth-child(1){display:none !important}';
        css += 'ul.listaddr > li:nth-child(2){display:none !important}';
        css += 'ul.listaddr > li:nth-child(3){display:none !important}';
        css += 'ul.listaddr > li:nth-child(4){display:none !important}';
        css += 'ul.listaddr > li:nth-child(5){display:none !important}';
        loadStyle(css);
    }

    function www_xiazaiba_com() {
        console.log('www_xiazaiba_com ad');
        var css = 'iframe{display:none !important}';
        css += '[class*="adv"]{display:none !important}';
        css += '.search-adv{display:none !important}';
        css += '.soft-keys{display:none !important}';
        css += '.list-hot{display:none !important}';
        css += '#downlist > div:nth-child(1){display:none !important}';
        loadStyle(css);
    }

    function mydown_yesky_com() {
        console.log('mydown_yesky_com ad');
        var css = '.newsfeed{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.bkdown{display:none !important}';
        css += '.ad{display:none !important}';
        css += '.comments{display:none !important}';
        css += '.head-recomm{display:none !important}';
        css += '.bk-soft_news{display:none !important}';
        css += '.bk-soft_ranking{display:none !important}';
        css += '.side-down4{display:none !important}';
        css += '.bk-soft_otherdown{display:none !important}';
        css += '.bk-soft_relespecial{display:none !important}';
        css += 'div.pull-left.url > ul.cl.top{display:none !important}';
        css += '.yestkydownad{display:none !important}';
        css += 'qihoobannerslider{display:none !important}';
        loadStyle(css);
    }

    function www_duote_com() {
        console.log('www_duote_com ad');
        var css = '.pic-bannerA{display:none !important}';
        css += '.dl-banner{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.ad{display:none !important}';
        css += '.down-ad{display:none !important}';
        css += 'div.main-right-box > div:nth-child(6){display:none !important}';
        css += '#hengfu{display:none}';
        css += '.comment{display:none}';
        css += 'div.down-lists > div:nth-child(1){display:none}';
        css += '.links-banner{height:0px !important}';
        css += 'div.dl_area > div:nth-child(2){height:0px !important;display:none !important}';
        css += 'body > div.wrapper > div.main > div>div:first-child{height:0px !important;display:none !important}';
        loadStyle(css);
    }

    function www_crsky_com() {
        console.log('www_crsky_com ad');
        var css = '.bdleft_down{display:none !important}';
        css += '.speed_down{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.Spdwon{display:none !important}';
        css += '.DianX{display:none !important}';
        css += '.green_block{display:none !important}';
        css += '.downWarp{display:none !important}';
        css += '.mirror-special{display:none !important}';
        css += '.yelldown{display:none !important}';
        loadStyle(css);
    }

    function www_pc6_com() {
        console.log('www_pc6_com ad');
        var css = 'div.dl-tip.clearfix > a{display:none !important}';
        css += '#xzbtn > a.downnow{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.ad{display:none !important}';
        css += '.ad2{display:none !important}';
        css += '.tagsk{display:none !important}';
        css += '.sendErr-wrap{display:none !important}';
        css += '#xgsp{display:none !important}';
        css += '#xgd{display:none !important}';
        css += '#company{display:none !important}';
        css += '#xgw{display:none !important}';
        css += '#reci{display:none !important}';
        css += '#autotab{display:none !important}';
        css += '#xgk{display:none !important}';
        css += '#bdfx{display:none !important}';
        css += '#dside{display:none !important}';
        css += '.enjoy{display:none !important}';
        css += '.ilist{display:none !important}';
        css += '.xgwz{display:none !important;height:0px important;}';
        css += '#comment{display:none !important}';
        css += '#comment-wrap{display:none !important}';
        css += '#innzt{display:none !important}';
        css += '#sidebar{display:none !important}';
        css += '#topbanner2{height:0px;display:none !important}';
        css += '.ad-download{height:0px;display:none !important}';
        css += '#gaosuxiazai{height:0px;display:none !important}';
        css += '.jsa3{height:0px;display:none !important}';
        css += '#download > ul > li.address-wrap.on > ul > h3:nth-child(2){display:none !important}';
        loadStyle(css);
    }

    function download_pchome_net() {
        console.log('download_pchome_net ad');
        var css = 'div.dl-tip.clearfix > a{display:none !important}';
        css += '.ad{display:none !important}';
        css += '.dl-rightbtns{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.dl-info-ad{display:none !important}';
        css += '#addFavorite{display:none !important}';//收藏本页
        css += '.dl-con-right{display:none !important}';//右边推荐排行
        css += '.t-right>a{display:none !important}';//搜索热词
        css += 'body > div.wrapper.clearfix > div.dl-con-left > div.dl-info-soft.clearfix.bottom-line.mg-btm10 > div.dl-info-con > ul > li:nth-child(8){display:none !important}';//编辑推荐
        css += '#dl-tuiian{display:none !important}';//推荐专区
        css += '.dl-sidelist-soft{display:none !important}';//用户推荐软件
        css += 'body > div.wrapper.clearfix > div.dl-con-right > div.dl-title-side.mg-btm10{display:none !important}';//用户推荐软件
        css += '.mod-global-link{display:none !important}';//传送门
        css += '.dl-kw{display:none !important}';//热搜软件
        css += 'body > div.wrapper.clearfix > div.dl-con-left > div:nth-child(16){display:none !important}';//热搜软件
        css += 'center{height:0px}';

        loadStyle(css);
    }

    function www_wmzhe_com() {
        console.log('www_wmzhe_com ad');
        var css = '.download{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.bdsharebuttonbox {display:none !important;height:0px !important}';
        css += '.zhuanti {display:none !important}';
        css += '.jiaocheng{display:none !important}';
        css += '.tuijian {display:none !important}';
        css += '.tags {display:none !important}';
        css += '#samesoft {display:none !important}';
        css += '.down + div +div{display:none !important}';
        css += 'ins{display:none !important}';
        css += 'div.down > dl:nth-child(2){display:none !important}';

        var overflow = document.getElementsByClassName('overflow');
        if (overflow.length == 3) {
            overflow[0].style = 'display:none';
            overflow[2].style = 'display:none';
        }
        loadStyle(css);
    }

    function www_onlinedown_net() {
        console.log('www_onlinedown_net ad');
        var css = '.downxzqtir{display:none !important}';
        css += '.onedownwp{display:none !important}';
        css += '.gg300{display:none !important}';
        css += '#down > div.cont > div > div.downDz > h4:nth-child(1){display:none !important}';
        css += '.xianssort{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.relateSoft{display:none !important}';//相关软件
        css += '.detailHotTab {display:none !important}';//热门词云
        css += '.xgshach {display:none !important}';//相关合集相关搜索
        css += '#NavXZDZ {background:none !important}';//下载地址图标
        css += '#ItemSSZT {display:none !important}';//所属专题
        css += '#ItemXGZT {display:none !important}';//相关专题
        css += '#ItemXGXZ {display:none !important}';//相关下载
        css += '#ItemWYPL {display:none !important}';//网友评论
        css += '#ItemCNXH {display:none !important}';//猜你喜欢
        css += '.greatrec {display:none !important}';//精彩推荐
        css += '.Friendlink {display:none !important}';//友情链接
        css += 'newsfeed{display:none !important}';
        css += '#mv_ad_render{display:none !important}';
        css += '.downgs{display:none !important}';
        css += '#ItemXGJC{display:none !important}';//相关文章

        loadStyle(css);
    }

    function pc_qq_com() {
        console.log('pc_qq_com ad');
        var css = '.J_qq_download{display:none !important}';

        loadStyle(css);
    }

    function dl_pconline_com_cn() {
        console.log('dl_pconline_com_cn ad');
        var css = '.ivy{display:none !important}';
        css += '[id*="ad"]{display:none !important}';
        css += '.rela-ivy{display:none !important}';
        css += '#rela-dl{display:none !important}';
        css += '#rela-subject{display:none !important}';
        css += '#rela-arts{display:none !important}';
        css += '.rela-new{display:none !important}';
        css += '.rela-best{display:none !important}';
        css += '.box-push{display:none !important}';
        css += '.sc-last{display:none !important}';
        css += '.new-twice-a{display:none !important}';
        css += '.block-jcz{display:none !important}';
        css += '.soft-rel{display:none !important}';
        css += '.box-tags{display:none !important}';
        css += '.seo-links{display:none !important}';
        // css += 'newsfeed{display:none !important}';
        // css += '.btn-org{display:none !important}';
        // css += '.block-jcz{display:none !important}';
        // css += '.rela-best{display:none !important}';
        // css += '.box-tags{display:none !important}';
        // css += '.tab-nav{display:none !important}';
        // css += '.soft-rel{display:none !important}';

        loadStyle(css);
    }

    function www_huacolor_com() {
        console.log('www_huacolor_com ad');
        var css = '.half-vds{display:none !important}';
        css += '.xzdza{display:none !important}';
        css += '.underline{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.soft-xiangguan{display:none !important}';
        css += '.hot-keys{display:none !important}';
        css += 'div.fastdownload > div.downbtn > a.orange{display:none !important}';
        css += '#soft-likeArc{display:none !important}';
        loadStyle(css);
    }

    function xiazai_zol_com_cn() {
        console.log('xiazai_zol_com_cn ad');
        var css = '#downloader_main{display:none !important}';
        css += '.ad-soft-box{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.filter-words{display:none !important}';
        css += '.box-top-ad{display:none !important}';
        css += '.down-jisu{display:none !important}';
        css += '.down-h4{display:none !important}';

        loadStyle(css);
    }

    function www_downza_cn() {
        console.log('www_downza_cn ad');
        var css = '.down_top{display:none !important}';
        css += 'qihoobannerslider{display:none !important}';
        css += '.downbtn{display:none !important}';
        css += '.newsfeed{display:none !important}';
        css += '.pc-down_relenews{display:none !important}';
        css += '.pc-down_tags{display:none !important}';
        css += '.pc-down_special{display:none !important}';
        css += 'iframe{display:none !important}';
        css += '.relever{display:none !important}';
        css += '.share{display:none !important}';
        css += '.chanel-softall{display:none !important}';
        css += '.search_hot{display:none !important}';
        loadStyle(css);
    }

    function www_cncrk_com() {
        console.log('www_cncrk_com ad');
        var css = 'iframe{display:none !important}';
        css += '.gsdt{display:none !important}';
        css += '.jsTAB_CON{display:none !important}';
        css += '#djdxh{display:none !important}';
        css += '#wypl{display:none !important}';
        css += '#jprj{display:none !important}';
        css += '.downfile_hits{display:none !important}';
        css += 'body > div.main > div.content > div:nth-child(2) > div{display:none !important}';
        loadStyle(css);
    }

    function loadStyle(css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        //for Chrome Firefox Opera Safari
        style.appendChild(document.createTextNode(css));
        //for IE
        //style.styleSheet.cssText = code;
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }

    function invalidHref(div) {
        div.setAttribute('href', '#');
        div.onClick = function () {
            alert('屏蔽');
        };
    }
})();