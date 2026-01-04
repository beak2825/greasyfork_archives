// ==UserScript==
// @name         必应搜索手机网页端主题-iOS16
// @namespace    https://github.com/iMortRex
// @version      0.1.26
// @description  美化必应搜索在iOS16手机网页端的样式，使其样式更符合iOS16，适配必应搜索自带浅色&深色模式，iOS系统请把必应主题调成浅色，在网页深色模式插件中禁用必应
// @author       Mort Rex
// @run-at       document-start
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGFBMVEUAgJ1ms8QQiKP////L5uuDws8gkKlFo7h+xr4ZAAAAZUlEQVR42t3SOw7AIAwDUPJxuP+Nmwi1XRqzonqA5ckExDgpohtg5sJBBv8A4RK8wc3SECC5ltEO1LZMB3CLDig2IIlzMJ02hPMZ8FxifoE30MEAonnJrn1Fajz+MbEOJ1HEODIXXwsC6M7C5HUAAAAASUVORK5CYII=
// @grant        GM.addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447609/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%AB%AF%E4%B8%BB%E9%A2%98-iOS16.user.js
// @updateURL https://update.greasyfork.org/scripts/447609/%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%AB%AF%E4%B8%BB%E9%A2%98-iOS16.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 自定义样式，1.背景卡片 2.前景卡片 3.整体颜色
    var style1 = '';
    var style1_2 = '';
    var style2 = '';

    mainScript();
    function mainScript() {
        // 标题栏颜色，Meta颜色
        for (let i = 0; i < document.getElementsByTagName('meta').length; i++) {
            if (document.getElementsByTagName('meta')[i].name == 'theme-color') {
                document.getElementsByTagName('meta')[i].remove();
            }
        }
        let themeColorDark = document.createElement('meta');
        themeColorDark.name = 'theme-color';
        themeColorDark.content = '#000000';
        themeColorDark.media = '(prefers-color-scheme: dark)';
        let themeColorLight = document.createElement('meta');
        themeColorLight.name = 'theme-color';
        themeColorLight.content = '#F2F2F6';
        themeColorLight.media = '(prefers-color-scheme: light)';
        document.head.appendChild(themeColorDark);
        document.head.appendChild(themeColorLight);

        style1 = ' {border-radius: 12px !important; margin: 10px !important; -webkit-box-shadow: 0 0px 8px 0px rgb(0 0 0 / 0%) !important; background-image: linear-gradient(to right,rgba(0 0 0 / 0%), rgb(0 0 0 / 0%)) !important;}';
        // 搜索框专用
        style1_2 = ' {border-radius: 12px !important; -webkit-box-shadow: 0 0px 8px 0px rgb(0 0 0 / 0%) !important;}';
        style2 = ' {border-radius: 12px !important; -webkit-box-shadow: 0 0 0 1px rgb(0 0 0 / 0%), 0 0px 8px 0px rgb(0 0 0 / 0%) !important; border: 0px var(--brdcol) solid !important;}';

        // --htmlbk：背景色，--alinkcol：标题颜色，--alinkcol2：标题颜色2，--alinkvcol：标题颜色3，--citcol：标注文本和地址颜色，--sectxt：一些地址颜色，--canvasbk：一些卡片背景色，--canvasbk2：常规卡片背景色，--canvasbk3：一些卡片的背景色，--brdcol：分割线颜色，--greencol：一些卡片地址颜色，--partxtcol：标题下方网页内容颜色，--primtxt：特殊卡片标题颜色和搜索框内搜索文本颜色，--secbrdcol：一些卡片内分割线颜色，--promtxt：一些卡片内前景文本颜色如视频卡片内视频标题文本颜色，--actbrdcol：前景卡片上按钮颜色，--regtxt：特殊卡片选项颜色，--sectxt：特殊卡片注释颜色，--cardsbk2：前景卡片背景颜色，

        // 深色模式注入
        // 设置页背景颜色
        GM.addStyle('@media(prefers-color-scheme: dark) {' + '#HBright' + '{background-color: #292827 !important;}}');
        // 设置页箭头颜色
        GM.addStyle('@media(prefers-color-scheme: dark) {' + '.hbic_chevdown' + ' {background-position: -512px -52px !important;}}');
        GM.addStyle('@media(prefers-color-scheme: dark) {' + '.hbic_chevup' + ' {background-position: -512px -74px !important;}}');
        // 设置页设置图标颜色
        GM.addStyle('@media(prefers-color-scheme: dark) {' + '.hbic_setting' + ' {background-position: -52px -52px !important;}}');
        // 设置页安全搜索图标颜色
        GM.addStyle('@media(prefers-color-scheme: dark) {' + '.hbic_safesearch' + ' {background-position: -104px -52px !important;}}');
        // 设置页搜索历史记录图标颜色
        GM.addStyle('@media(prefers-color-scheme: dark) {' + '.hbic_history' + ' {background-position: -156px -52px !important;}}');
        // 设置页主题图标颜色
        GM.addStyle('@media(prefers-color-scheme: dark) {' + '.hbic_dmtoggle' + ' {background-position: -416px -52px !important;}}');
        // 设置页隐私图标颜色
        GM.addStyle('@media(prefers-color-scheme: dark) {' + '.hbic_privacy' + ' {background-position: -260px -52px !important;}}');
        // 设置页反馈图标颜色
        GM.addStyle('@media(prefers-color-scheme: dark) {' + '.hbic_feedback' + ' {background-position: -312px -52px !important;}}');
        // 设置页展开后背景颜色
        GM.addStyle('@media(prefers-color-scheme: dark) {' + '.hb_section.hb_top_sec.hb_expanded' + ' {background-color: #292827 !important;}}');
        GM.addStyle('@media(prefers-color-scheme: dark) {' + '.hb_expandible' + ' {background-color: #292827 !important;}}');

        // 整体颜色
        GM.addStyle('@media(prefers-color-scheme: dark) {\
                :root {\
                    --htmlbk: #000000 !important;\
                    --alinkcol: #ffffff !important;\
                    --alinkcol2: #ffffff !important;\
                    --alinkvcol: #ffffff !important;\
                    --citcol: #9b9b9b !important;\
                    --canvasbk: transparent !important;\
                    --canvasbk2: #1c1c1e !important;\
                    --canvasbk3: transparent !important;\
                    --brdcol: #3e3e41 !important;\
                    --greencol: #9b9b9b !important;\
                    --partxtcol: #ffffff !important;\
                    --primtxt: #ffffff !important;\
                    --secbrdcol: #3a3e41 !important;\
                    --promtxt: #ffffff !important;\
                    --actbrdcol: #00809d !important;\
                    --regtxt: #d2d0ce !important;\
                    --sectxt: #bebbb8 !important;\
                    --cardsbk2: #313135 !important;\
                }\
            }\
            @media(prefers-color-scheme: light) {\
                :root {\
                    --htmlbk: #f2f2f6 !important;\
                    --alinkcol: #000000 !important;\
                    --alinkcol2: #000000 !important;\
                    --alinkvcol: #000000 !important;\
                    --citcol: #9b9b9b !important;\
                    --canvasbk: transparent !important;\
                    --canvasbk2: #ffffff !important;\
                    --canvasbk3: transparent !important;\
                    --brdcol: #dddddd !important;\
                    --greencol: #9b9b9b !important;\
                    --partxtcol: #000000 !important;\
                    --primtxt: #000000 !important;\
                    --secbrdcol: #dddddd !important;\
                    --promtxt: #000000 !important;\
                    --actbrdcol: #00809d !important;\
                    --regtxt: #666666 !important;\
                    --sectxt: #767676 !important; \
                    --cardsbk2: #eeeeef !important;\
                }\
            }\
        ');
        // 背景颜色
        GM.addStyle('#bpage, #bpage .b_fpage' + ' {background-color: var(--htmlbk) !important;}');
        // 搜索框颜色
        GM.addStyle('#bpage .sa_as, #bpage .b_searchboxForm, #bpage .b_searchboxForm .sw_tpcbk, #bpage .b_overlay .btn .bg' + ' {background-color: var(--canvasbk2);}');
        // 前景卡片颜色
        GM.addStyle('#bpage #b_content .mna_cnt .mna_ti_card .mna_cap, #bpage #b_content .mna_cnt a.mnws_cwrp' + ' {background-color: var(--cardsbk2);}');
        GM.addStyle('.hozdl_car .b_slidebar .slide' + ' {background-color: var(--cardsbk2);}');
        // 搜索按钮下方错误颜色修正
        GM.addStyle('#bpage select, #bpage input, #bpage input[type="text"]' + ' {background-color: var(--canvasbk2);}');
        // 搜索框跟随背景颜色修正
        GM.addStyle('.phead' + ' {background-color: var(--htmlbk);}');
        // 卡片内标签颜色修正
        GM.addStyle('.b_dmtab' + ' {background-color: transparent !important; color: var(--citcol) !important; box-shadow: 0 !important;}');
        GM.addStyle('.tab-active' + ' {background-color: transparent !important; color: var(--alinkcol) !important; box-shadow: inset 0 -3px 0 0 var(--alinkcol) !important;}');
        // 标题颜色
        GM.addStyle('#bpage a, #bpage .b_alink' + ' {color: var(--alinkcol) !important;}');
        // 特殊标题背景色修正
        GM.addStyle('.b_rc_gb_template' + ' {background-image: linear-gradient(to right,rgba(0 0 0 / 0%), rgb(0 0 0 / 0%));}');
        // 特殊标题文本颜色
        GM.addStyle('.df_c div.rwrl' + ' {color: var(--alinkcol);}');
        GM.addStyle('.rch-cap-cntr' + ' {color: var(--alinkcol);}');
        GM.addStyle('.b_focusTextLarge' + ' {color: var(--alinkcol);}');
        GM.addStyle('.df_c, #b_content .df_c p' + ' {color: var(--alinkcol) !important;}');
        GM.addStyle('.b_entityTitle, #b_content .df_c p' + ' {color: var(--alinkcol) !important;}');
        GM.addStyle('.b_primtxt.titlespc' + ' {color: var(--alinkcol) !important;}');
        GM.addStyle('.qna_body' + ' {color: var(--alinkcol) !important;}');
        // 特殊标题底部横线
        GM.addStyle('hr.df_f' + ' {color: var(--brdcol) !important; background-color: var(--brdcol) !important;}');
        GM.addStyle('.ac-border' + ' {border-bottom: 1px solid var(--brdcol) !important;}');
        GM.addStyle('.acc-dcont' + ' {border-top: 1px solid var(--brdcol) !important;}');
        GM.addStyle('.scs_child_rpr {border-top: 1px solid var(--brdcol) !important;}');
        GM.addStyle('.b_mobExpChevCont {border-bottom: 0px solid var(--brdcol) !important; margin-top: 10px !important;}');
        GM.addStyle('.l_ecrd_a1_o {border-top: 1px solid var(--brdcol) !important;}');
        GM.addStyle('.l_ecrd_vqfcts_row::after' + ' {border-bottom: 1px solid var(--brdcol) !important;}');
        // 资讯文本颜色
        GM.addStyle('.b_promtxt' + ' {color: var(--alinkcol) !important;}');
        GM.addStyle('.sctTitlefst' + ' {color: var(--alinkcol) !important;}');
        // 资讯前景卡片颜色修正
        GM.addStyle('.b_slidebar .slide' + ' {background-color: transparent;}');
        GM.addStyle('.mnws_cwrp.single' + ' {background-color: transparent !important;}');
        GM.addStyle('.mnws_litem' + ' {background-color: var(--cardsbk2);}');
        GM.addStyle('.mnws_litem' + style2);
        // 隐藏资讯卡片
        GM.addStyle('.b_ans.b_nwsAns' + '{display: none !important;}');
        // 特殊卡片（搜索疫情）背景颜色修正
        GM.addStyle('.b_canvas.b_tophbb' + ' {background-color: transparent;}');
        // 特殊卡片分割线颜色修正
        GM.addStyle('.c_stat+.c_stat' + ' {border-left: 1px solid var(--brdcol);}');
        // 特殊卡片2（搜索人造肉）导航栏背景颜色
        GM.addStyle('#pec_config' + ' {background-color:  var(--canvasbk2);}');
        // 特殊卡片2卡片背景修正
        GM.addStyle('.filterBar' + ' {background-color:  transparent;}');
        // 特殊卡片2前景卡片
        GM.addStyle('.filtBarItem' + ' {background-color:  var(--cardsbk2); color: var(--alinkcol); border: 0px solid var(--brdcol);}');
        // 特殊卡片2分割线
        GM.addStyle('.b_entityHeader' + ' {border-bottom: 1px solid var(--brdcol);}');
        GM.addStyle('.pec_exp' + ' {border-top: 1px solid var(--brdcol);}');
        // 特殊卡片2前景卡片2
        GM.addStyle('.b_imgset_item' + ' {background-color:  var(--cardsbk2);}');
        // 特殊卡片3（搜索哔哩哔哩）前景卡片
        GM.addStyle('.b_cards' + ' {background-color:  var(--cardsbk2);}');
        GM.addStyle('.b_cards2' + ' {background-color:  var(--cardsbk2) !important;}');
        // 特殊卡片4（搜BrowseNX或球赛比分）背景颜色修正
        GM.addStyle('.tab-container' + ' {background-color: transparent !important; color: var(--alinkcol) !important;}');
        // 特殊卡片4前景卡片
        GM.addStyle('.splm-matchrow.b_canvas2' + ' {background-color: transparent !important; color: var(--alinkcol) !important;}');
        GM.addStyle('.spl-gameDetails' + ' {background-color: transparent !important; color: var(--alinkcol) !important;}');
        GM.addStyle('.spl-gs.spl-gcx' + ' {background-color: transparent !important; color: var(--alinkcol) !important;}');
        GM.addStyle('.spl-matchup' + ' {background-color: transparent !important; color: var(--alinkcol) !important;}');
        // 特殊卡片4顶部圆角修复
        GM.addStyle('.splm-headerbackground' + ' {border-top-left-radius: 12px !important; border-top-right-radius: 12px !important;}');
        // 特殊卡片4前景卡片文本颜色
        GM.addStyle('.b_regtxt' + ' {color: var(--alinkcol) !important;}');
        GM.addStyle('.b_primtxt' + ' {color: var(--alinkcol) !important;}');
        GM.addStyle('.b_sectxt' + ' {color: var(--alinkcol) !important;}');
        // 特殊卡片4分割线
        GM.addStyle('.tab-menu' + ' {border-bottom: 1px solid var(--brdcol) !important;}');
        GM.addStyle('.spl-gameCenterModules' + ' {border-bottom: 1px solid var(--brdcol) !important;}');
        GM.addStyle('.spl-gameDetails' + ' {border-top: 1px solid var(--brdcol) !important;}');
        GM.addStyle('.spl-gs.spl-gcx' + ' {border-bottom: 1px solid var(--brdcol) !important; border-top: 0px solid var(--brdcol) !important;}');
        GM.addStyle('.spl-matchup' + ' {border-bottom: 1px solid var(--brdcol) !important;}');
        // 特殊卡片5分割线
        GM.addStyle('.lite-entcard-blk' + ' {border-bottom: 1px solid var(--brdcol) !important;}');
        // 特殊卡片5样式
        GM.addStyle('.lite-entcard-main' + ' {border-bottom-left-radius: 12px !important; border-bottom-right-radius: 12px !important;}');
        GM.addStyle('.b_mopexpref.b_expmobcont' + ' {border-bottom-left-radius: 12px !important; border-bottom-right-radius: 12px !important;}');
        GM.addStyle('.b_exp_rc.b_expmob_rc' + ' {border-bottom-left-radius: 12px !important; border-bottom-right-radius: 12px !important;}');
        GM.addStyle('.l_ecrd_headergrad' + ' {border-top-left-radius: 12px !important; border-top-right-radius: 12px !important;}');
        GM.addStyle('#l_ecrd_blk_1_PlainHero' + ' {background-color: var(--canvasbk2);}');
        // 特殊卡片5文本颜色
        GM.addStyle('.l_ecrd_txt_gl' + ' {color: var(--alinkcol) !important;}');
        GM.addStyle('.mc_vmc_t' + ' {color: var(--alinkcol) !important;}');
        // 特殊卡片6卡片内分割线
        GM.addStyle('.b_vList .tabcap table tr th' + ' {border-bottom: 1px solid var(--brdcol) !important;}');
        // 特殊卡片7(搜索speedtest)网址文本颜色
        GM.addStyle('.b_algospacing_url' + ' {color: var(--citcol) !important;}');
        // 特殊卡片7内部卡片文本颜色
        GM.addStyle('.b_deeplink_mobile_title' + ' {color: var(--alinkcol) !important; background-color: var(--cardsbk2) !important;}');
        GM.addStyle('.b_deeplink_mobile_title' + style2);
        // 特殊卡片7分割线
        GM.addStyle('.b_algospacing::before' + ' {border-top: 1px solid var(--brdcol) !important;}');
        // 特殊卡片7隐藏图标
        GM.addStyle('.wr_fav_rc_gobig' + ' {display: none;}');
        // 特殊卡片7标题宽度
        GM.addStyle('.b_algoheader a h2' + ' {width: 100% !important;}');
        GM.addStyle('.b_algoheader a .b_attribution' + ' {width: 100% !important; max-width: 100% !important;}');
        // 模糊搜索中间横线
        GM.addStyle('#sp_requery' + ' {border-bottom: 1px solid var(--brdcol) !important;}');
        // 视频卡片底部横线
        GM.addStyle('.videoPlayer' + ' {border-bottom: 1px solid var(--brdcol) !important; border-top: 1px solid var(--brdcol) !important;}');
        // 视频卡片宽度修复
        GM.addStyle('.vidrc' + ' {width: 406px !important;}');
        GM.addStyle('.vidr' + ' {width: 196px !important;}');
        // 视频文本渐变条颜色
        GM.addStyle('.mobilevideoitemtitle_mmftb:after' + ' {background: linear-gradient(to right,var(--canvasbk2) 0%,var(--canvasbk2) 100%) !important;}');
        // 视频卡片视频描边
        GM.addStyle('.vtv2 a' + ' {border-radius: 12px !important; border: 0px var(--brdcol) solid !important;}');
        GM.addStyle('.rms_img' + ' {border-radius: 12px !important; border: 0px var(--brdcol) solid !important;}');
        // 相关搜索横条颜色
        GM.addStyle('.b_rs .b_vList li' + ' {border-top: 1px solid var(--brdcol) !important;}');
        // 切换到国际版文本颜色
        GM.addStyle('#est_switch' + ' {color: var(--tealcol);}');

        // 通用卡片样式注入
        GM.addStyle('.b_algo' + style1);
        GM.addStyle('.b_ad' + style1);
        GM.addStyle('.b_adrnd' + style1);
        GM.addStyle('.b_ans' + style1);
        GM.addStyle('.b_pag' + style1);
        GM.addStyle('.b_msg' + style1);
        GM.addStyle('.b_mpref' + style1);
        GM.addStyle('.b_no' + style1);
        GM.addStyle('.b_searchboxForm' + style1_2);
        GM.addStyle('.b_algo' + style1);

        GM.addStyle('.mna_cnt .mna_ti_card' + style2);
        GM.addStyle('.b_slidebar .slide' + style2);
        GM.addStyle('.b_scard' + style2);

        // 顶部背景颜色
        GM.addStyle('#b_header {background-color: var(--htmlbk) !important;}');
        // 顶部右下角渐变颜色
        GM.addStyle('.b_scopebar ul:after {background: linear-gradient(to right,var(--htmlbk) 0%,var(--htmlbk) 100%)  !important;}');
        // 关键字颜色
        GM.addStyle('#sp_requery strong, #sp_recourse strong, #tile_link_cn strong, .b_ad .ad_esltitle~div strong, h2 strong, .b_caption p strong, .b_snippetBigText strong, .recommendationsTableTitle+.b_slideexp strong, .recommendationsTableTitle+ul strong, .pageRecoContainer .b_module_expansion_control strong, .pageRecoContainer .b_title>strong, .b_ans .b_rs strong, #dict_ans strong, #b_content #ans_nws .mna_t strong, .adltwrnmsg strong {color: #F03232 !important;}');
        // 特殊标题顶部横线长度修复（搜索“cytoid官网”第一个卡片）
        GM.addStyle('.goBigAttr {margin: 0px -16px 16px -16px !important; padding: 0px 16px 16px 16px !important;}');
        // 特殊标题中间横线（搜索百度）
        GM.addStyle('.b_agseparator {margin: 0px 0px 0px 0px !important; padding: -12px -16px -16px 168px !important;}');
        // 隐藏视频声明卡片
        GM.addStyle('.b_vidAns' + ' {display: none;}');
        // 隐藏“为回应符合本地法律要求”声明卡片
        GM.addStyle('.b_msg.b_canvas' + ' {display: none;}');
        // 隐藏页脚
        GM.addStyle('#b_footer' + ' {display: none;}');
        // 隐藏深色模式推荐卡片
        GM.addStyle('#MobileDarkmodeOptIn' + ' {display: none;}');
        // 移除广告卡片
        var adRemoveTimeout = 0;
        adRemove();
        function adRemove() {
            if (document.getElementById('fbtop')) {
                document.getElementById('fbtop').parentNode.parentNode.parentNode.parentNode.parentNode.remove();
            }
            if (document.getElementById('tt_perajx')) {
                document.getElementById('tt_perajx').parentNode.parentNode.remove();
            }
            if (adRemoveTimeout < 1000) {
                adRemoveTimeout += 10;
                setTimeout(adRemove, 10);
            }
        }
    }
})();