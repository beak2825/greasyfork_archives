// ==UserScript==
// @name         百度搜索 - 优化
// @namespace    http://tampermonkey.net/
// @home-url     https://greasyfork.org/zh-CN/scripts/31642
// @description  1、屏蔽百度推广 2、居中单列(可选) 3、居中双列(可选) 4.自动下一页(可选)
// @version      5.2.4
// @author       浮生未歇
// @run-at       document-start
// @match         *://ipv6.baidu.com/*
// @match         *://www.baidu.com/
// @match         *://www.baidu.com/?*
// @match         *://www.baidu.com/s?*
// @match         *://www.baidu.com/#*
// @match         *://www.baidu.com/baidu?*
// @exclude      ^https://www.baidu.com/home*
// @exclude      ^https://www.baidu.com/sf*
// @exclude      ^https://www.baidu.com/search*
// @exclude      ^https://www.baidu.com/link*
// @exclude      ^https://www.baidu.com/s*tn=news*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @connect      self
// @connect      baidu.com
// @connect      bing.com
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/31642/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%20-%20%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/31642/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%20-%20%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


(function () {
    const UserConfig = {
        BG_IMAGE_URL: "",
    };
    const SYSTEM_CONFIGS = {
        IS_DEBUG: false,
        PAGE_SELECT_NAME: "BD_PAGE_SELECT",
        PAGE_AUTO_NEXT_PAGE_NAME: "IS_AUTO_NEXT_PAGE",
        DEFAULT_PAGE_SELECT_VALUE: 1,
        DEFAULT_AUTO_NEXT_PAGE_SWITCH: false,
        BAIDU_STYLES: {
            INDEX: "baiduIndexStyle",
            BASE: "baiduBaseStyle",
            MENU: "baiduMenu",
            ONE_PAGE: "baiduOne",
            TWO_PAGE: "baiduTwo",
            THREE_PAGE: "baiduThree"
        },
    };
    const SIDEBAR_TOOLBAR_ITEMS = {
        "百度识图": "https://graph.baidu.com/pcpage/index?tpl_from=pc",
        "百度资讯": "https://www.baidu.com/s?rtt=1&bsst=1&cl=2&tn=news&ie=utf-8&word=%s",
        "百度文库": "https://wenku.baidu.com/search?lm=0&od=0&ie=utf-8&word=%s",
        "百度知道": "https://zhidao.baidu.com/search?ct=17&pn=0&tn=ikaslist&rn=10&fr=wenku&word=%s",
        "百度贴吧": "https://tieba.baidu.com/f?kw=%s&t=4",
        "百度图片": "https://image.baidu.com/search/index?tn=baiduimage&ct=201326592&lm=-1&cl=2&word=%s&t=3",
        "百度地图": "https://map.baidu.com/",
        "Google": "https://www.google.com/search?&num=20&newwindow=1&q=%s",
        "Bing": "https://www.bing.com/search?q=%s",
        "淘宝": "https://s.taobao.com/search?q=%s",
        "京东": "https://search.jd.com/Search?keyword=%s&enc=utf-8"
    };
    let LAYOUT_TYPE;
    (function (LAYOUT_TYPE) {
        LAYOUT_TYPE[LAYOUT_TYPE["General"] = 0] = "General";
        LAYOUT_TYPE[LAYOUT_TYPE["OneCenter"] = 1] = "OneCenter";
        LAYOUT_TYPE[LAYOUT_TYPE["TwoCenter"] = 2] = "TwoCenter";
        LAYOUT_TYPE[LAYOUT_TYPE["ThreeCenter"] = 3] = "ThreeCenter";
    })(LAYOUT_TYPE || (LAYOUT_TYPE = {}));
    ;
    let SILTER_BAR_MODE;
    (function (SILTER_BAR_MODE) {
        SILTER_BAR_MODE[SILTER_BAR_MODE["auto"] = 0] = "auto";
        SILTER_BAR_MODE[SILTER_BAR_MODE["show"] = 1] = "show";
        SILTER_BAR_MODE[SILTER_BAR_MODE["hidden"] = 2] = "hidden";
    })(SILTER_BAR_MODE || (SILTER_BAR_MODE = {}));
    let ADDITION_FUNCTION;
    (function (ADDITION_FUNCTION) {
        ADDITION_FUNCTION[ADDITION_FUNCTION["AutoNextPage"] = 0] = "AutoNextPage";
        ADDITION_FUNCTION[ADDITION_FUNCTION["SideToolBar"] = 1] = "SideToolBar";
    })(ADDITION_FUNCTION || (ADDITION_FUNCTION = {}));
    const LAYOUT_CONFIG = {
        saveName: "PAGE_LAYOUT",
        defaultValue: LAYOUT_TYPE.General
    };
    const SILDER_BAR_CONFIG = {
        saveName: "silder_bar",
        defaultValue: SILTER_BAR_MODE.hidden
    };
    const ADDITION_FUNCTION_CONFIGS = {
        AutoNextPage: {
            saveName: "funciton_auto_next_page",
            defaultSwitch: false,
            functionName: ADDITION_FUNCTION.AutoNextPage
        },
        SideToolBar: {
            saveName: "funciton_side_tool_bar",
            defaultSwitch: false,
            functionName: ADDITION_FUNCTION.SideToolBar
        }
    };
    const INLINE_STYLE_BASE = `#content_left .c-container[data-lp],#content_left>.c-container[tpl=short_video_pc],#content_left>div>.c-container[tpl=short_video_pc],#content_left>table,#content_right,#demo,#ent_sug,#foot,#head .headBlock,#imsg,#page .fk,#result_logo img,#rs_new,#rs_top_new,#searchTag,#top-ad,#u>a .c-icon,.c-recommend,.chat-input-anchor,.hint_common_restop,.hit_top_new,.leftBlock,.rrecom-btn-parent,body>.res_top_banner,iframe{display:none!important}#content_left>div:not([id]),#content_left>div[style*='display:block !important;'],body>div[style*='position: absolute;'],body>div[style*='position: fixed;']{display:none!important;position:absolute!important;top:-1px!important;clip:rect(0 0 0 0)!important;z-index:-1!important}.bd-none{display:none!important}#form{display:none!important}#baidu_content_left{margin-left:200px}.c-container{display:inline-block;margin:20px auto}#container{position:relative!important}body{background:#f1f2f3!important}html{overflow-y:scroll}:root{overflow-y:auto;overflow-x:hidden}:root body{position:absolute}body{width:100vw;overflow:hidden}#form{position:absolute!important;z-index:-1;-webkit-transform:scaleX(0);transform:scaleX(0)}.bd-container-search{position:absolute;top:8px;left:150px}.bd-docker{position:absolute;top:0;left:0}.bd-barbox-ul{position:absolute;display:flow-root;width:640px;height:40px;font-size:18px;line-height:1.2;text-align:center;z-index:2}.bd-barbox-li{float:left;position:relative}.bd-barbox-li:first-of-type:after{content:"";position:absolute;top:0;bottom:0;left:0;right:0;z-index:-1}.bd-barbox-button,.bd-barbox-input{border:none!important;outline:0!important}.bd-barbox-input{position:relative;width:540px;height:40px;color:#000;font-size:inherit;border-radius:3px 0 0 3px;background:#e3e3e3!important;padding-left:15px;padding-right:10px;-webkit-transition:width .3s;transition:width .3s;-webkit-box-sizing:border-box;box-sizing:border-box;overflow:hidden}.bd-barbox-input:after{content:"";position:absolute;top:0;bottom:0;left:0;right:0;z-index:-1;background:#fff}.bd-barbox-button{position:relative;-webkit-box-sizing:border-box;box-sizing:border-box;width:100px;height:40px;line-height:1;font-size:inherit;background:linear-gradient(40deg,#18c0fe,#1677ff);border-radius:0 3px 3px 0;color:#fff;-webkit-transition:background .3s;transition:background .3s}.bd-barbox-button:hover{cursor:pointer;background:linear-gradient(40deg,#2070e5,#1890ff);-webkit-transition:background .3s;transition:background .3s}.bd-associate-ul{position:absolute;width:650px;top:50px;background:0 0;border-radius:.5em;text-align:left}.bd-associate-ul:after{content:"";position:absolute;top:0;bottom:0;left:0;right:0;z-index:-1;background:#fdfdfd;-webkit-box-shadow:0 0 5px 1px rgba(0,0,0,.2);box-shadow:0 0 5px 1px rgba(0,0,0,.2)}.bd-associate-li{font-size:16px;padding:10px 20px;list-style-type:none!important}.bd-associate-li>span{font-weight:700}.bd-associate-li:hover{cursor:pointer}.bd-associate-li:first-of-type{border-radius:.5em .5em 0 0}.bd-associate-li:last-of-type{border-radius:0 0 .5em .5em}.bd-associate-li:only-of-type{border-radius:.5em!important}.bd-associate-selected{position:relative;color:#2196f3;background:#f3f3f3!important}.bd-associate-selected:after{content:"";position:absolute;top:0;bottom:0;left:0;right:0;-webkit-box-shadow:0 0 3px hsla(0,0%,13%,.1);box-shadow:0 0 3px hsla(0,0%,13%,.1)}#head{background-color:#f1f2f3!important;border-bottom:1px solid!important;border-color:#e4e5e7!important;-webkit-box-shadow:none!important;box-shadow:none!important}#head .s_form{height:58px!important}#u .s-top-img-wrapper,.set-result-tts{display:none!important}#u{font-size:15px!important;margin-top:8px!important;padding-right:10px!important}#u a,#u a:hover{text-decoration:none}#u>a{-webkit-box-sizing:border-box!important;box-sizing:border-box!important;font-family:"Microsoft YaHei"!important;font-size:inherit!important;margin:0 8px!important;padding:8px 8px!important;position:relative;background:0 0!important;color:hsla(216,25%,24%,.8)!important;border-radius:3px}#u>a .s-top-username{font-size:15px!important;line-height:24px!important;margin:0!important;padding:0!important}#u>a[name=tj_login]{height:auto!important}#u>a:after{content:"";position:absolute;top:0;bottom:0;left:0;right:0;border-radius:3px;background-color:#e4e5e7!important;z-index:-1}#u>a:hover:after{background-color:#fff!important}#user{max-width:250px!important;text-overflow:ellipsis!important;height:auto!important}@media screen and (max-width:1024px){#u .toindex{display:none!important}}.bdpfmenu,.usermenu{width:auto!important;border:1px solid #e4e5e7!important;-webkit-box-shadow:none!important;box-shadow:none!important;padding:0!important;border-radius:0!important}.bdpfmenu{position:fixed!important;top:50px!important;width:100px!important;margin-top:3px!important;margin-right:10px!important}.usermenu{top:35px!important;width:100px!important;margin-top:10px!important;margin-right:0!important;z-index:1}.usermenu a{margin:0!important}.bdpfmenu>a,.usermenu>a{border-radius:0!important;display:block!important;width:auto!important;height:auto!important;margin:0!important;padding:5px 10px!important;font-size:14px!important;line-height:1.8!important;text-align:center!important;background:#fff!important;color:#222!important}.bdpfmenu>a>span,.usermenu>a>span{margin:0!important}.bdpfmenu>a:hover,.usermenu>a:hover{background:#f1f3fd!important;color:#315efb!important}#content_left{display:none!important}#head{width:100%!important}.s_form{padding:0!important}#container{padding-left:0!important}@media screen and (min-width:1921px){.head_wrapper{width:100%;margin:0 auto;position:relative;-webkit-transform:translate3d(-52px,0,1px);transform:translate3d(-52px,0,1px)}}.options_2Vntk{width:auto!important}.result-molecule{width:640px!important}.bd_search_result_container .bd_list{width:640px;float:left}.bd_search_result_container .bd_list:not(:first-of-type){margin-left:10px}.bd_search_result_container .c-container{margin:5px auto!important}.bd_search_result_container .c-container .c-container{width:100%!important}.bd_search_result_container #rs,.bd_search_result_container #rs_new,.bd_search_result_container .bd_list>.c-container[id][tpl]{width:640px!important;margin-top:5px!important;padding:0 20px 10px!important;margin-bottom:5px!important;background:#fff!important;-webkit-box-sizing:border-box!important;box-sizing:border-box!important;border:none!important;border-radius:3px}.bd_search_result_container #rs,.bd_search_result_container .bd_list>.c-container[id]{position:relative!important}.bd_search_result_container #rs:after,.bd_search_result_container .bd_list>.c-container[id]:after{content:"";z-index:-1;position:absolute;top:0;bottom:0;left:0;right:0;-webkit-box-shadow:0 0 30px 1px rgba(0,0,0,.1);box-shadow:0 0 30px 1px rgba(0,0,0,.1)}.bd_search_result_container .c-result-content>.c-container[id]{border:none!important;margin-left:-20px!important}.bd_search_result_container .bd_list>.c-container[tpl*=ty_lasar]{padding:0}.bd_search_result_container .bd_list>.c-container[tpl=soft] .op-soft-title,.bd_search_result_container .bd_list>.c-container[tpl] h3{background:hsla(0,0%,90%,.05)!important;margin:0 -20px 5px!important;padding:8px 20px 6px!important;border-bottom:1px solid hsla(0,2%,10%,.05)!important}.bd_search_result_container .bd_list>.c-container[tpl=jy_rota_wenshu_pc] .c-container{padding-top:0!important}.bd_search_result_container .bd_list>.c-container[tpl=jy_rota_wenshu_pc] header.c-gap-bottom-small{padding-bottom:10px!important}.bd_search_result_container .bd_list>.c-container h3 [class*=OP_LOG_LINK]{color:#fff!important}.bd_search_result_container .bd_list>.c-container h3 a,.bd_search_result_container .bd_list>.c-container h3 a em,.bd_search_result_container .bd_list>.c-container h3 p,.bd_search_result_container .bd_list>.c-container h3 span,.bd_search_result_container .bd_list>.c-container[tpl=soft] .op-soft-title a,.bd_search_result_container .bd_list>.c-container[tpl=soft] .op-soft-title a em{color:#014aa5!important;text-decoration:none!important}.bd_search_result_container .bd_list>.c-container h3 a em,.bd_search_result_container .bd_list>.c-container[tpl=soft] .op-soft-title a em{color:#e45465!important}.bd_search_result_container .bd_list>.c-container h3 a,.bd_search_result_container .op-soft-title a{position:relative;display:inline-block}.bd_search_result_container .bd_list>.c-container h3 a:after,.bd_search_result_container .op-soft-title a:after{position:absolute;z-index:1;content:"";border-bottom:1px solid;bottom:0;left:100%;width:0;-webkit-transition:width 350ms,left 350ms;-moze-transition:width 350ms,left 350ms;transition:width 350ms,left 350ms}.bd_search_result_container .bd_list>.c-container h3 a:hover:after,.bd_search_result_container .op-soft-title a:hover:after{left:0;width:100%;-webkit-transition:width 350ms;transition:width 350ms}.bd_search_result_container .bd_list>.c-container h3 a:visited,.bd_search_result_container .op-soft-title a:visited{color:#7c32a1!important}.bd_search_result_container .bd_list>.c-container h3 a:visited:after,.bd_search_result_container .op-soft-title a:visited:after{left:100%;width:0;-webkit-transition:width 350ms,left 350ms;-moze-transition:width 350ms,left 350ms;transition:width 350ms,left 350ms}.bd_search_result_container .bd_list>.c-container h3 a:visited:hover:after,.bd_search_result_container .op-soft-title a:visited:hover:after{left:0;width:100%;-webkit-transition:width 350ms;transition:width 350ms}.bd_search_result_container .bd_list>.c-container .c-abstract,.bd_search_result_container .bd_list>.c-container .c-span18,.bd_search_result_container ol li{color:#636363!important;color:#333!important;line-height:1.8}.bd_search_result_container table em{text-decoration:none!important}.bd_search_result_container .c-gap-right-small,.bd_search_result_container .c-gray a,.bd_search_result_container .c-offset>div a,.bd_search_result_container .c-span18 a,.bd_search_result_container .c-span6 a,.bd_search_result_container .c-tabs-content a,.bd_search_result_container .f13 a,.bd_search_result_container .f13 em,.bd_search_result_container .op-b2b-find-all-text,.bd_search_result_container .op-b2b-product-item-title a,.bd_search_result_container .op-generaltable-morelink a,.bd_search_result_container .op-img-address-link-menu a,.bd_search_result_container .op-se-listen-recommend,.bd_search_result_container .op-short-video-pc-more a,.bd_search_result_container .op-short-video-pc-poster a,.bd_search_result_container .op-tieba-general-mainpl a,.bd_search_result_container .op-tieba-general-right,.bd_search_result_container .op-tieba-novel-lookmore a,.bd_search_result_container .op-tieba-novel-trone a,.bd_search_result_container .op-tieba-novel-trtwo a,.bd_search_result_container .op-tieba-offical-lookmore a,.bd_search_result_container .op-tieba_offical-lianjie,.bd_search_result_container .op_dq01_morelink a,.bd_search_result_container .op_dq01_table a,.bd_search_result_container .op_dq01_title,.bd_search_result_container .op_generalqa_answer_title a,.bd_search_result_container .op_jingyan_list p.c-gap-top-small,.bd_search_result_container .op_offical_weibo_content a,.bd_search_result_container .op_offical_weibo_pz a,.bd_search_result_container .op_tieba2_tablinks_container a,.bd_search_result_container .subLink_factory a,.bd_search_result_container tbody a{text-decoration:none!important;color:#014aa5!important}.bd_search_result_container .c-gap-right-small:hover,.bd_search_result_container .c-gray:hover a,.bd_search_result_container .c-offset>div a:hover,.bd_search_result_container .c-span6 a:hover,.bd_search_result_container .c-tabs-content a:hover,.bd_search_result_container .f13 a:hover,.bd_search_result_container .f13 em:hover,.bd_search_result_container .op-b2b-product-item-title a:hover,.bd_search_result_container .op-generaltable-morelink a:hover,.bd_search_result_container .op-img-address-link-menu a:hover,.bd_search_result_container .op-se-listen-recommend:hover,.bd_search_result_container .op-short-video-pc-more a:hover,.bd_search_result_container .op-short-video-pc-poster a:hover,.bd_search_result_container .op-tieba-general-mainpl a:hover,.bd_search_result_container .op-tieba-general-right:hover,.bd_search_result_container .op-tieba-offical-lookmore a:hover,.bd_search_result_container .op-tieba_offical-lianjie:hover,.bd_search_result_container .op_dq01_morelink a:hover,.bd_search_result_container .op_dq01_table a:hover,.bd_search_result_container .op_dq01_title:hover,.bd_search_result_container .op_generalqa_answer_title:hover,.bd_search_result_container .op_jingyan_list p:hover,.bd_search_result_container .op_tieba2_tablinks_container a:hover,.bd_search_result_container .subLink_factory a:hover,.bd_search_result_container tbody a:hover{text-decoration:underline!important}.bd_search_result_container .f13 a{color:green!important}.bd_search_result_container em{color:#e45465}.bd_search_result_container .c-img6{opacity:.9}.bd_search_result_container .c-span18{width:455px!important}.bd_search_result_container .c-span24{width:100%!important;line-height:1.8!important}.bd_search_result_container .c-border{width:auto!important;border:none!important;border-bottom-color:transparent;border-right-color:transparent;-webkit-box-shadow:none!important;box-shadow:none!important}.bd_search_result_container .bd_list>.c-container .op-img-address-link-type,.bd_search_result_container .op_jingyan_list,.bd_search_result_container .se_com_irregular_gallery ul li{display:inline-block}.bd_search_result_container::after{content:"";display:table;clear:both}#page{display:none!important}#bd_page_number{width:640px;text-align:center;margin-top:20px;margin-bottom:100px}#bd_page_number .bd_page_item{border:none;border-radius:6px;background-color:#fff;color:#3951b3;margin-right:10px;display:inline-block;vertical-align:text-bottom;text-align:center;text-decoration:none;overflow:hidden}#bd_page_number .bd_page_item span{display:inline-block;cursor:pointer;width:100%;height:100%;line-height:36px}#bd_page_number .bd_page_item :hover{border:none;background:#4e6ef2;color:#fff}#bd_page_number .bd_page_number{width:36px;height:36px}#bd_page_number .bd_page_next_page,#bd_page_number .bd_page_pre_page{width:80px;height:36px}#bd_page_number .bd_page_next_page{margin-right:0}#bd_page_number .bd_page_number_selected{pointer-events:none;background-color:#4e6ef2;color:#fff} `;
    const INLINE_STYLE_INDEX = `#bds-message-wrapper,#bottom_container,#bottom_layer,#ftCon,#s-hotsearch-wrapper,#s_lm_wrap,#s_main,#s_new_search_guide,#s_side_wrapper,#s_top_wrap.s-down .s-center-box,.ai-input,.guide-info,.qrcodeCon,.s-set-homepage-tts,.s-top-wrap.s-isindex-wrap.s-down,.show-feed{display:none!important}body{position:relative;overflow-y:hidden!important;background:0 0!important}body::after{position:absolute;content:"";top:0;bottom:0;left:0;right:0;z-index:-100;background-color:#f1f2f3}#s_top_wrap{border:none!important}#head_wrapper{z-index:1!important}#s_main{background:hsla(0,0%,100%,.6)!important}#head_wrapper .s_form{width:900px}.s-top-wrap{background:0 0!important}.s-isindex-wrap .c-color-t:after{content:"";position:absolute;top:0;bottom:-2px;left:50%;right:50%;z-index:-2;border-bottom:2px solid}.s-isindex-wrap .c-color-t:hover{color:#2196f3!important;position:relative}.s-isindex-wrap .c-color-t:hover:after{left:0;right:0;-webkit-transition:left .3s ease,right .3s ease;transition:left .3s ease,right .3s ease}.s-top-more-content .c-color-t{color:#555!important;text-shadow:none!important}.s-top-more-content .c-color-t:hover{color:#4682b4!important}.s-isindex-wrap .c-color-red.c-color-red{color:#fff}.s-isindex-wrap .c-color-red.c-color-red:hover{color:#2196f3}#form{display:none!important}.bd-container-search{position:relative}.bd-barbox-ul{position:absolute;display:flow-root;top:200px;bottom:-50px;width:100%;height:48px;font-size:20px;line-height:1.2;text-align:center;z-index:2}.bd-barbox-center{display:inline-block;margin:0 auto;border-radius:30px;-webkit-box-shadow:0 0 8px 3px rgba(0,0,0,.1);box-shadow:0 0 8px 3px rgba(0,0,0,.1);text-align:center}.bd-barbox-li{float:left;position:relative}.bd-barbox-li:first-of-type:after{content:"";position:absolute;top:0;bottom:0;left:0;right:0;border-radius:20px 20px 0 0;background:hsla(0,0%,100%,.2)!important;-webkit-filter:blur(5px);filter:blur(5px);z-index:-1}.bd-barbox-button,.bd-barbox-input{border:none!important}.bd-barbox-input{position:relative;width:450px;height:40px;color:#000;text-shadow:0 0 1px 1px #000;border-radius:20px 0 0 20px;background:hsla(0,0%,100%,.3);padding-left:25px;padding-right:10px;-webkit-transition:width .3s;transition:width .3s;-webkit-box-sizing:border-box;box-sizing:border-box;overflow:hidden}.bd-barbox-input:focus{width:500px;background:hsla(0,0%,100%,.6);-webkit-transition:width .3s ease,background .5s ease-out;transition:width .3s ease,background .5s ease-out}.bd-barbox-input:after{content:"";position:absolute;top:0;bottom:0;left:0;right:0;z-index:-1;background:#fff;-webkit-backdrop-filter:blur(1px);backdrop-filter:blur(1px)}.bd-barbox-button{position:relative;height:40px;padding:0 20px;line-height:1;background:hsla(216,80%,55%,.7);border-radius:0 20px 20px 0;color:#fff;-webkit-transition:background .3s;transition:background .3s}.bd-barbox-button:hover{background:#3079e8;-webkit-transition:background .3s;transition:background .3s}.bd-associate-ul{position:absolute;width:620px;top:250px;left:0;margin-left:140px;background:0 0;border-radius:.5em;text-align:left;-webkit-box-shadow:0 0 10px 5px rgba(0,0,0,.1);box-shadow:0 0 10px 5px rgba(0,0,0,.1);overflow:hidden}.bd-associate-ul:after{content:"";position:absolute;top:0;bottom:0;left:0;right:0;z-index:-1;background:hsla(0,0%,100%,.6);-webkit-filter:blur(1px);filter:blur(1px);margin:-30px}.bd-associate-li{font-size:16px;padding:10px 20px;list-style-type:none!important}.bd-associate-li>span{font-weight:700}.bd-associate-li:hover{cursor:pointer}.bd-associate-li:first-of-type{border-radius:.5em .5em 0 0}.bd-associate-li:last-of-type{border-radius:0 0 .5em .5em}.bd-associate-li:only-of-type{border-radius:.5em!important}.bd-associate-selected{position:relative;color:#2196f3;background:rgba(255,255,255,.3)!important}.bd-associate-selected:after{content:"";position:absolute;top:0;bottom:0;left:0;right:0;-webkit-box-shadow:0 0 10px hsla(0,0%,13%,.1);box-shadow:0 0 10px hsla(0,0%,13%,.1)}#head_wrapper .s-p-top{height:181px}#lg>img{display:none!important}#lg{position:relative;width:900px}#lg:after{content:"";position:absolute;top:0;left:0;margin-left:35px;z-index:100}#lg:after{width:100%;height:230px;-webkit-transform:scale(.35);transform:scale(.35);background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAr4AAADwCAYAAADmSmdAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpBQUM5Qzc0MkM5N0NFNjExQkJFNTgyNTRGQzQzMjU2NSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5OTkxNTNBMjdDQzkxMUU2ODNCN0IyNjU5MTY1OUJBRCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5OTkxNTNBMTdDQzkxMUU2ODNCN0IyNjU5MTY1OUJBRCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkFCQzlDNzQyQzk3Q0U2MTFCQkU1ODI1NEZDNDMyNTY1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkFBQzlDNzQyQzk3Q0U2MTFCQkU1ODI1NEZDNDMyNTY1Ii8+IDwvcmRmOkRlc2NyaXB0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)!important;background-repeat:no-repeat}.bd-display{display:none}.bd-bg-ul{position:fixed;top:0;bottom:0;left:0;right:0;z-index:-1}.bd-bg-ul:after{content:"";position:absolute;top:0;bottom:0;left:0;right:0;z-index:2;-webkit-filter:blur(20px);filter:blur(20px);background-color:rgba(29,23,36,.2)}.bd-bg-li{position:absolute;top:0;bottom:0;left:0;right:0;z-index:-1;color:transparent}.bd-bg-li{background-size:100% 100%;background-repeat:no-repeat;background-attachment:fixed}.bd-opacity{opacity:0}#bd-search-association{background:red;width:575px;height:500px;position:absolute;margin-top:45px;border-radius:5px}.bd-head-more{background:red;position:fixed;top:50px;right:10px} `;
    const INLINE_STYLE_MENU = `#u>#bd-menu-btn:hover{-webkit-transition:background .3s;transition:background .3s}#bd-menu-detilas{position:absolute;top:-3px;left:-10px;margin-top:50px;border:1px solid #e4e5e7;background-color:#fff;-webkit-box-shadow:0 0 15px 1px rgba(0,0,0,.2);box-shadow:0 0 15px 1px rgba(0,0,0,.2)}#bd-menu-detilas .bt-menu-piece{display:flow-root;float:left;width:100px}#bd-menu-detilas ol{text-align:center;-webkit-box-shadow:none!important;box-shadow:none!important;border-bottom:1px dashed #e4e5e7!important}#bd-menu-detilas ol li{text-align:left;list-style:none!important;margin-left:-5px;padding:0 5px;color:#222;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}#bd-menu-detilas ol li input{-webkit-appearance:auto!important;-moz-appearance:auto!important;appearance:auto!important}#bd-menu-detilas ol:last-child{border-bottom:none!important}#bd-menu-detilas #bd_menu_save{display:block;width:100%;height:25px;margin-top:3px;border:1px solid #9e9e9e;cursor:pointer} `;
    const INLINE_STYLE_ONE_CENTER = `#container.sam_newgrid{margin:0!important;width:100%!important}.wrapper_new .s_form.s_form_fresh{width:100%!important}.bd-container-search{position:relative!important;left:0!important;margin:auto;width:640px;left:4px!important}.result-molecule{width:640px!important;margin:auto!important}#container.sam_newgrid{margin:0!important;width:100%!important}.bd_serach_result_dock{width:640px;margin:auto}@media screen and (min-width:1921px){#wrapper_wrapper{margin-left:0!important}}#bd_page_number{margin:20px auto 100px!important}#s_tab_inner{padding:0!important;display:inline-block;margin:auto} `;
    const INLINE_SIDEBAE = `#bd_sidebar{position:fixed;display:block;width:110px;height:100%;top:60px;z-index:100;background-color:transparent;color:#fff1c1;text-align:center;font-size:14px;left:-100px;opacity:0;opacity:1}#bd_sidebar:hover{opacity:1;left:0;background-color:#2b333e;overflow:hidden;-webkit-transition:left .2s;transition:left .2s}#bd_sidebar li{position:relative;width:100%;height:40px;line-height:40px;background:0 0!important;cursor:pointer}#bd_sidebar li:hover{padding-left:5px!important;-webkit-transition:padding-left .2s;transition:padding-left .2s;border-bottom-color:transparent}#bd_sidebar li:hover::after{content:"";position:absolute;top:0;bottom:0;left:0;right:0;z-index:-2;background:linear-gradient(to right,#00a8ff 3px,#3d5a83 0)!important} `;
    const INLINE_STYLE_THREE_CENTER = `#container.sam_newgrid{margin:0!important;width:100%!important}.wrapper_new .s_form.s_form_fresh{width:100%!important}.bd-container-search{position:relative!important;left:0!important;margin:auto;width:640px;left:4px!important}.result-molecule{width:1940px!important;margin:auto!important}#container.sam_newgrid{margin:0!important;width:100%!important}.bd_serach_result_dock{width:1940px;margin:auto}@media screen and (min-width:1921px){#wrapper_wrapper{margin-left:0!important}}#bd_page_number{margin:20px auto 100px!important}#s_tab_inner{padding:0!important;display:inline-block;margin:auto} `;
    const INLINE_STYLE_TWO_CENTER = `#container.sam_newgrid{margin:0!important;width:100%!important}.wrapper_new .s_form.s_form_fresh{width:100%!important}.bd-container-search{position:relative!important;left:0!important;margin:auto;width:640px;left:4px!important}.result-molecule{width:1290px!important;margin:auto!important}#container.sam_newgrid{margin:0!important;width:100%!important}.bd_serach_result_dock{width:1290px;margin:auto}@media screen and (min-width:1921px){#wrapper_wrapper{margin-left:0!important}}#bd_page_number{margin:20px auto 100px!important}#s_tab_inner{padding:0!important;display:inline-block;margin:auto} `;
    class GM {
        static getValue(key, defaultValue) {
            try {
                return GM_getValue(key, defaultValue);
            }
            catch (error) {
                console.debug(error);
            }
        }
        static setValue(key, value) {
            try {
                GM_setValue(key, value);
            }
            catch (error) {
                console.debug(error);
            }
        }
        static addStyle(content) {
            Promise.resolve().then(() => {
                try {
                    GM_addStyle(content);
                }
                catch (error) {
                    console.debug(error);
                }
            });
        }
        static xmlhttpRequest(config) {
            try {
                GM_xmlhttpRequest(config);
            }
            catch (error) {
                console.debug(error);
            }
        }
        static getResourceText(name) {
            try {
                return GM_getResourceText(name);
            }
            catch (error) {
                console.debug(error);
            }
        }
    }
    class OptionControl {
        constructor(name, defaultValue) {
            this.GM = GM;
            this.name = name;
            this.defalutValue = defaultValue;
        }
        getDefaultValue() {
            return this.defalutValue;
        }
        setOption(value) {
            this.GM.setValue(this.getOptionName(), value);
        }
        getOptionName() {
            return this.name;
        }
        getOptionValue() {
            return this.GM.getValue(this.getOptionName(), this.getDefaultValue());
        }
    }
    class Debug {
        static execute(callback) {
            if (Config.isDebug()) {
                callback();
            }
        }
        static log(msg) {
            this.execute(() => {
                console.log(msg);
            });
        }
        static info(msg) {
            this.execute(() => {
                console.info(msg);
            });
        }
        static count(msg) {
            this.execute(() => {
                console.count(msg);
            });
        }
        static debug(msg) {
            this.execute(() => {
                console.debug(msg);
            });
        }
    }
    class Config {
        static isDebug() {
            return SYSTEM_CONFIGS.IS_DEBUG;
        }
    }
    class Assoicate {
        constructor() {
            this.templateUrlAssociate = "https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&req=2&csor=10&wd=%s";
        }
        getURL(templateURL, keyWord) {
            const isEmptyKeyWord = keyWord.trim().length <= 0;
            if (isEmptyKeyWord) {
                return "";
            }
            else {
                return templateURL.replace(/\%s/i, encodeURIComponent(keyWord));
            }
        }
        decodeString(content) {
            return unescape(content.replace(/\\\u/g, "%u"));
        }
        stringToObject(content) {
            let result = `{"s":${content.match(/\[\".+\"\]/i)}}`;
            return JSON.parse(result);
        }
        processData(content, name) {
            let strContent = this.decodeString(content);
            let objContent = this.stringToObject(strContent);
            return name ? objContent[name] : objContent;
        }
        getItems(responseText) {
            let response = JSON.parse(responseText);
            let searchResults = response["g"];
            let items = [];
            for (const key in searchResults) {
                let item = searchResults[key]["q"];
                items.push(item);
            }
            return items;
        }
        getAssociateURL(keyWord) {
            return this.getURL(this.templateUrlAssociate, keyWord);
        }
    }
    class AssociateManager extends Assoicate {
        constructor(o) {
            super();
            this.o = o;
        }
        deal(responseText) {
            let items = super.getItems(responseText);
            this.update(items);
        }
        update(items) {
            this.o.update(items);
        }
        getAssoicateURL(keyWord) {
            return super.getAssociateURL(keyWord);
        }
        request(keyword) {
            let that = this;
            let url = this.getAssociateURL(keyword);
            GM.xmlhttpRequest({
                method: "GET",
                url: url,
                timeout: 3000,
                responseType: "json",
                headers: {
                    "User-Agent": navigator.userAgent,
                    "Cookie": document.cookie,
                },
                onload: (response) => {
                    if (response.status === 200 ||
                        response.status === 304) {
                        that.deal(response.responseText);
                    }
                },
                onerror: (error) => {
                    console.error("联想功能异常，请排查:", error);
                }
            });
        }
        search(keyWord) {
            let isEmptyKeyWord = keyWord.trim().length <= 0;
            let emptyKeyWord = [""];
            if (isEmptyKeyWord) {
                this.update(emptyKeyWord);
            }
            else {
                this.request(keyWord);
            }
        }
    }
    class AvoidMulExecute {
        constructor() {
            this.SING_NAME = "IsRunBaidu";
        }
        getSignElement() {
            return $("#content_left");
        }
        setSign() {
            let container = this.getSignElement();
            container.attr(this.SING_NAME, "true");
        }
        hasSign() {
            let container = this.getSignElement();
            return !!container.attr(this.SING_NAME);
        }
    }
    let Baidu = (function () {
        class Node {
            constructor(obj) {
                this.obj = obj;
                this.isReady = false;
                this.isDelay = false;
            }
            setReadyRun() {
                this.isReady = true;
                return this;
            }
            setDealyRun() {
                this.isDelay = true;
                return this;
            }
            isReadyRun() {
                return this.isReady;
            }
            isDelayRun() {
                return this.isDelay;
            }
            start() {
                new this.obj().start();
            }
            execute() {
                if (this.isReadyRun()) {
                    $().ready(() => {
                        this.start();
                    });
                    return;
                }
                if (this.isDelayRun()) {
                    setTimeout(() => {
                        this.start();
                    }, 0);
                    return;
                }
                this.start();
            }
        }
        class Componse {
            constructor() {
                this.list = [];
            }
            add(node) {
                this.list.push(node);
            }
            execute() {
                for (let node of this.list) {
                    node.execute();
                }
            }
        }
        class Baidu extends Componse {
            constructor() {
                super();
            }
            add(obj) {
                let node = new Node(obj);
                super.add(node);
                return this;
            }
            addReady(obj) {
                let node = new Node(obj).setReadyRun();
                super.add(node);
                return this;
            }
            addDealy(obj) {
                let node = new Node(obj).setDealyRun();
                super.add(node);
                return this;
            }
            addDelayAndReady(obj) {
                this.addDealy(obj);
                this.addReady(obj);
                return this;
            }
            execute() {
                super.execute();
            }
        }
        return Baidu;
    })();
    class UrlEditor {
        constructor(url) {
            this.url = new URL(url);
        }
        getFinalUrl() {
            return this.url.href;
        }
        hasParam(name) {
            return this.url.searchParams.has(name);
        }
        getParamValue(name) {
            return String(this.url.searchParams.get(name));
        }
        setParam(key, value) {
            this.url.searchParams.set(key, value);
        }
    }
    class Component {
        constructor() {
            this.list = [];
        }
        add(obj) {
            this.list.push(obj);
        }
        execute() {
            for (let obj of this.list) {
                obj.execute();
            }
        }
    }
    class Docker {
        createDocker() {
            return $("<div>");
        }
    }
    class Leaf extends Component {
        constructor(obj) {
            super();
            this.obj = obj;
        }
        insert() {
            this.obj.insertNode();
        }
        add(obj) {
            super.add(obj);
        }
        execute() {
            this.insert();
            super.execute();
        }
    }
    class Router {
        getCurrentPagePathURL() {
            return location.origin + location.pathname;
        }
        isRouterPage(routers) {
            const currentRouterURL = this.getCurrentPagePathURL();
            return routers.some((routerURL) => {
                return routerURL === currentRouterURL;
            });
        }
        addRoute(routers, factory) {
            if (this.isRouterPage(routers)) {
                factory.create();
            }
        }
    }
    class BaiduSearch {
        constructor() {
            this.DEFAULT_URL = "https://www.baidu.com/s?ie=utf-8";
            this.URL = new UrlEditor(this.DEFAULT_URL);
        }
        addSearchKeyword(searchContent) {
            searchContent = searchContent.trim();
            this.URL.setParam("wd", searchContent);
            return this;
        }
        openRandonNumber() {
            let randomBase64Code = window.btoa(new Date().getTime()).replace(/=+/g, "");
            return this;
        }
        addRN(rate) {
            this.URL.setParam("rn", String(rate));
            return this;
        }
        addPN(order) {
            this.URL.setParam("pn", String(order));
            return this;
        }
        addParam(key, value) {
            this.URL.setParam(key, value);
            return this;
        }
        addBaiduDeaultParam() {
            let that = this;
            let $inputs = $("#form>input");
            $inputs.each(function (index, element) {
                let $element = $(element);
                let name = String($element.attr("name"));
                let value = String($element.val());
                if (name != "" && value != "") {
                    that.addParam(name, value);
                }
            });
            this.addParam("tn", "baidu");
            return this;
        }
        getFinalURL() {
            return this.URL.getFinalUrl();
        }
        openWebWithNewWindow() {
            let url = this.getFinalURL();
            window.open(url);
        }
        openWebWithCurrentWindow() {
            let url = this.getFinalURL();
            location.href = url;
        }
        tiggerBaiduSumbit() {
            let searchContent = String($(".bd-barbox-input").val()).trim();
            if (searchContent.length > 0) {
                $("#form #kw").attr("value", searchContent.trim());
                $("#form").trigger("submit");
            }
        }
    }
    class SearchResultsFilter {
        constructor() {
            this.regulars = [
                `[style]`,
                `[tpl="b2b_straight"]`,
                `[tpl="short_video_pc"]`,
                `[tpl="trade_purchase"]`,
                `[tpl="img_address"]`,
                `[tpl="ads_b2c_universal_card"]`,
                `[tpl="zp_exact_new"]`,
                `[tpl="se_com_irregular_gallery"]`,
                `[tpl="ask_doctor"]`,
                `[tpl="med_qa"]`,
                `[tpl^="timeliness"]`,
                `[tpl^="sp_realtime"]`,
                `[tpl="wenda_abstract_pc"]`,
                `[tpl="jingyan_summary"]`,
                `[tpl="se_st_single_video_zhanzhang"]`,
                `[tpl="open_source_software]"`,
                `[data-click*="safe:1|t:1"]`
            ];
        }
        getFilterGularExpress() {
            let filterRegular = "div[tpl]";
            filterRegular = this.regulars.reduce(function (prev, current) {
                return prev + `:not(${current})`;
            }, filterRegular);
            return filterRegular;
        }
        removeInvalidItem(items) {
            let filterRegular = this.getFilterGularExpress();
            let $items = $(items);
            $items = $items.filter(filterRegular);
            return $items;
        }
    }
    class SessionStorage {
        constructor(key, value) {
            this.key = key;
            this.value = value;
        }
        hasStorage() {
            return sessionStorage.getItem(this.key) === this.value;
        }
        storage() {
            sessionStorage.setItem(this.key, this.value);
        }
        clear() {
            sessionStorage.removeItem(this.key);
        }
    }
    class StyleContent {
        getStlyeForIndex() {
            return INLINE_STYLE_INDEX;
        }
        getStyleForBase() {
            return INLINE_STYLE_BASE;
        }
        getStyleForMenu() {
            return INLINE_STYLE_MENU;
        }
        getStyleForSidebar() {
            return INLINE_SIDEBAE;
        }
        getStyleForLayoutOneCenter() {
            return INLINE_STYLE_ONE_CENTER;
        }
        getStyleForLayoutTwoCenter() {
            return INLINE_STYLE_TWO_CENTER;
        }
        getStyleForLayoutThreeCenter() {
            return INLINE_STYLE_THREE_CENTER;
        }
    }
    class StyleControl {
        constructor() {
            this.GM = GM;
            this.cache = "";
        }
        reset() {
            this.cache = "";
        }
        addStyle() {
            this.GM.addStyle(this.cache);
        }
        add(style) {
            this.cache = this.cache.concat(style);
            return this;
        }
        end() {
            this.addStyle();
            this.reset();
        }
    }
    class SyncRequest {
        constructor(dealer) {
            this.GM = GM;
            this.responseType = "json";
            this.dealer = dealer;
        }
        deal(response) {
            this.dealer.deal(response);
        }
        setResponseType(responseType) {
            this.responseType = responseType;
            return this;
        }
        request(requestURL) {
            let that = this;
            this.GM.xmlhttpRequest({
                method: "GET",
                url: requestURL,
                timeout: 3000,
                responseType: that.responseType,
                headers: {
                    "User-Agent": navigator.userAgent,
                    "Cookie": document.cookie,
                },
                onload: (response) => {
                    if (response.status === 200 ||
                        response.status === 304) {
                        that.deal(response.response);
                    }
                }
            });
        }
    }
    class OptionSelect extends OptionControl {
        constructor(layoutConfig) {
            super(layoutConfig.saveName, layoutConfig.defaultValue);
        }
    }
    class PageLayoutOption extends OptionSelect {
        constructor() {
            super(LAYOUT_CONFIG);
        }
        getCurrentPageType() {
            return Number(super.getOptionValue());
        }
        getName() {
            return super.getOptionName();
        }
        setPageLayoutType(value) {
            return super.setOption(value);
        }
    }
    class SilderBarOption extends OptionSelect {
        constructor() {
            super(SILDER_BAR_CONFIG);
        }
        getCurrentMode() {
            return Number(super.getOptionValue());
        }
        getName() {
            return super.getOptionName();
        }
        setMode(value) {
            return super.setOption(value);
        }
    }
    class OptionSwitch extends OptionControl {
        constructor(functionConfig) {
            super(functionConfig.saveName, functionConfig.defaultSwitch);
            this.functionName = functionConfig.functionName;
        }
        isEnable() {
            return Boolean(super.getOptionValue());
        }
        enable() {
            super.setOption(true);
        }
        disable() {
            super.setOption(false);
        }
        getName() {
            return super.getOptionName();
        }
        getFunctionName() {
            return this.functionName;
        }
    }
    class AutoNextPageSwitch extends OptionSwitch {
        constructor() {
            super(ADDITION_FUNCTION_CONFIGS.AutoNextPage);
        }
    }
    class SideToolBarSwitch extends OptionSwitch {
        constructor() {
            super(ADDITION_FUNCTION_CONFIGS.SideToolBar);
        }
    }
    let WallPaperModel;
    (function (WallPaperModel) {
        class Bing {
            constructor() {
                this.GM = GM;
                this.BING_GM_NAME = "bing_images";
                this.BING_DEFALUT_IMAGES = ["https://pic.imgdb.cn/item/5eca80bfc2a9a83be52d1cb0.jpg"];
                this.BING_REMOTE_IMAGE_URL = `https://cn.bing.com/HPImageArchive.aspx?format=js&n=8&mkt=zh-CN`;
                this.BING_HOSTNAME = `https://cn.bing.com`;
            }
            getDefaultImages() {
                return this.BING_DEFALUT_IMAGES;
            }
            saveImagesToLocal(images) {
                let key = this.BING_GM_NAME;
                this.GM.setValue(key, images);
            }
            getImagesFromLocal() {
                let key = this.BING_GM_NAME;
                return this.GM.getValue(key) || this.getDefaultImages();
            }
            hasCacheLocalImage() {
                let images = this.getImagesFromLocal();
                return images.length > 1;
            }
        }
        WallPaperModel.Bing = Bing;
    })(WallPaperModel || (WallPaperModel = {}));
    (function (WallPaperModel) {
        class Images {
            constructor(o) {
                this.images1 = [
                    "http://img.netbian.com/file/2019/0808/7062756ab554ab172d31ae293d2fa9e6.jpg",
                    "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1589899749&di=c016b13a5a98e2dbd6a207b8bb776580&src=http://pic1.win4000.com/wallpaper/2018-11-05/5bdfd64cbcd82.jpg",
                    "https://desk-fd.zol-img.com.cn/t_s1920x1080c5/g5/M00/09/04/ChMkJ14S2WmIcR4MAASTED6paWcAAwKOAIG18EABJMo577.jpg",
                    "https://desk-fd.zol-img.com.cn/t_s1920x1080c5/g5/M00/09/04/ChMkJ14S2UKIQ7V8AAHhgCbEWSkAAwKNwAT-XgAAeGY606.jpg",
                    "https://desk-fd.zol-img.com.cn/t_s2560x1440c5/g5/M00/09/04/ChMkJ14S2UqIAJhXAAZvffHvn_oAAwKNwD6CH8ABm-V325.jpg",
                    "https://desk-fd.zol-img.com.cn/t_s2560x1600c5/g5/M00/09/04/ChMkJl4S2W2INN3iACCh3pDxPQMAAwKOAKZtUsAIKH2841.jpg",
                    "https://desk-fd.zol-img.com.cn/t_s1920x1080c5/g5/M00/09/0D/ChMkJ1e2_KKIPLgPAAUyABcaCxEAAUkhANeazAABTIY478.jpg",
                    "https://desk-fd.zol-img.com.cn/t_s1920x1080c5/g5/M00/02/08/ChMkJ1bKzS-IMP1aAEMHk65qAm4AALI-QAAAAAAQwer218.jpg",
                    "https://desk-fd.zol-img.com.cn/t_s1920x1080c5/g5/M00/02/08/ChMkJlbKzTCIKFkcACIWcwMYvWsAALI-QDORlYAIhaL394.jpg",
                    "https://desk-fd.zol-img.com.cn/t_s1920x1080c5/g5/M00/02/08/ChMkJlbKzTGIEcieAFFa4NXfo20AALI-QEr_lIAUVr4406.jpg",
                    "https://desk-fd.zol-img.com.cn/t_s1920x1080c5/g5/M00/02/03/ChMkJlbKx2qIKB_ZAAKJbsI4qNMAALHzQFvTQ0AAomG519.jpg",
                    "https://desk-fd.zol-img.com.cn/t_s1920x1080c5/g4/M09/0F/01/ChMly12oJfuIDM0ZAAfuqk1g34AAAYKzgNEBzEAB-7C780.jpg",
                ];
                this.images2 = [
                    "https://momentumdash.com/backgrounds/01.jpg",
                    "https://momentumdash.com/backgrounds/02.jpg",
                    "https://momentumdash.com/backgrounds/03.jpg",
                    "https://momentumdash.com/backgrounds/04.jpg",
                    "https://momentumdash.com/backgrounds/05.jpg",
                    "https://momentumdash.com/backgrounds/06.jpg",
                    "https://momentumdash.com/backgrounds/07.jpg",
                    "https://momentumdash.com/backgrounds/08.jpg",
                    "https://momentumdash.com/backgrounds/09.jpg",
                    "https://momentumdash.com/backgrounds/10.jpg",
                    "https://momentumdash.com/backgrounds/11.jpg",
                    "https://momentumdash.com/backgrounds/12.jpg",
                    "https://momentumdash.com/backgrounds/13.jpg",
                ];
                this.o = o;
            }
            getImages() {
                return this.o.getImages();
            }
            getRandomIndex(minNumber, maxNumber) {
                return parseInt(Math.random() * (maxNumber - minNumber + 1) + minNumber, 10);
            }
            getMaxNumber(images) {
                return images.length - 1;
            }
            getMinNumber() {
                return 0;
            }
            getImageURL() {
                let images = this.getImages();
                let maxNumber = this.getMaxNumber(images);
                let minNumber = this.getMinNumber();
                let index = this.getRandomIndex(minNumber, maxNumber);
                return images[index];
            }
        }
        WallPaperModel.Images = Images;
    })(WallPaperModel || (WallPaperModel = {}));
    (function (WallPaperModel) {
        class SaveRequestWallPaterBing extends WallPaperModel.Bing {
            getAbsoluteImagesURL(images) {
                let hostName = this.BING_HOSTNAME;
                return images.map((image) => {
                    return new URL(image.url, hostName).href;
                });
            }
            saveImagesToLocal(images) {
                super.saveImagesToLocal(images);
            }
            deal(response) {
                let images = this.getAbsoluteImagesURL(response.images);
                this.saveImagesToLocal(images);
            }
        }
        WallPaperModel.SaveRequestWallPaterBing = SaveRequestWallPaterBing;
    })(WallPaperModel || (WallPaperModel = {}));
    (function (WallPaperModel) {
        class Tempalte {
            constructor(config) {
                this.config = config;
            }
            createImagePanelTemplate() {
                let nameBackgroundPanel = this.config.NODE_BG_UL;
                return `
                    <ul class="${nameBackgroundPanel}"></ul>
                `;
            }
            createImageItemTemplate() {
                let nameBackgroundItem = this.config.NODE_BG_LI;
                return `
                    <li class="${nameBackgroundItem}"></li>
                    `;
            }
            createImageAttribute(imageURL) {
                return `background-image: url("${imageURL}"); `;
            }
            createBingWallpaperNode(imageUrl) {
                let $ul = $(this.createImagePanelTemplate());
                let $li = $(this.createImageItemTemplate());
                let styleValue = this.createImageAttribute(imageUrl);
                $li.attr("style", styleValue);
                $ul.append($li);
                return $ul.html();
            }
        }
        WallPaperModel.Tempalte = Tempalte;
    })(WallPaperModel || (WallPaperModel = {}));
    (function (WallPaperModel) {
        class WallPaperBing extends WallPaperModel.Bing {
            hasSessionStorage() {
                let key = "wallpaper-bing";
                let value = "true";
                let session = new SessionStorage(key, value);
                if (session.hasStorage()) {
                    return true;
                }
                else {
                    session.storage();
                    return false;
                }
            }
            isNeedRequest() {
                let isNotNeedRequest = this.hasSessionStorage() && this.hasCacheLocalImage();
                return !isNotNeedRequest;
            }
            requestImagesFromRemoteBing() {
                let syncRequest = new SyncRequest(new WallPaperModel.SaveRequestWallPaterBing());
                syncRequest.request(this.BING_REMOTE_IMAGE_URL);
            }
            getImages() {
                if (this.isNeedRequest()) {
                    this.requestImagesFromRemoteBing();
                }
                return super.getImagesFromLocal();
            }
        }
        WallPaperModel.WallPaperBing = WallPaperBing;
    })(WallPaperModel || (WallPaperModel = {}));
    (function (WallPaperModel) {
        class WallpagerConfig {
            constructor() {
                this.NODE_BG_UL = "bd-bg-ul";
                this.NODE_BG_LI = "bd-bg-li";
                this.NODE_BG_DISPLAY = "bd-display";
            }
        }
        WallPaperModel.WallpagerConfig = WallpagerConfig;
    })(WallPaperModel || (WallPaperModel = {}));
    (function (WallPaperModel) {
        class WallPaperMomentumdash {
            constructor() {
                this.GM = GM;
                this.images = [
                    "https://momentumdash.com/backgrounds/01.jpg",
                    "https://momentumdash.com/backgrounds/02.jpg",
                    "https://momentumdash.com/backgrounds/03.jpg",
                    "https://momentumdash.com/backgrounds/04.jpg",
                    "https://momentumdash.com/backgrounds/05.jpg",
                    "https://momentumdash.com/backgrounds/06.jpg",
                    "https://momentumdash.com/backgrounds/07.jpg",
                    "https://momentumdash.com/backgrounds/08.jpg",
                    "https://momentumdash.com/backgrounds/09.jpg",
                    "https://momentumdash.com/backgrounds/10.jpg",
                    "https://momentumdash.com/backgrounds/11.jpg",
                    "https://momentumdash.com/backgrounds/12.jpg",
                    "https://momentumdash.com/backgrounds/13.jpg",
                ];
            }
            request(imageURL) {
                let requestURL = imageURL;
                this.GM.xmlhttpRequest({
                    method: "GET",
                    url: requestURL,
                    timeout: 3000,
                    responseType: "json",
                });
            }
            isPreloadAllImages() {
                let key = "wallpaper-Momentumdash";
                let value = "true";
                let session = new SessionStorage(key, value);
                if (session.hasStorage()) {
                    return true;
                }
                else {
                    session.storage();
                    return false;
                }
            }
            preloadAllImages() {
                for (const imageURL of this.images) {
                    this.request(imageURL);
                }
            }
            getImages() {
                return this.images;
            }
        }
    })(WallPaperModel || (WallPaperModel = {}));
    let SearchFormModel;
    (function (SearchFormModel) {
        class Action {
            constructor(Selector) {
                this.Selecor = Selector;
            }
            getInputValue() {
                return this.Selecor.$input.val();
            }
        }
        SearchFormModel.Action = Action;
        class ActionAssociateDockerShow extends Action {
            constructor(Selector) {
                super(Selector);
            }
            execute(event) {
                let $selector = this.Selecor.$associateDocker;
                if ($selector.hasClass("bd-none")) {
                    $selector.removeClass("bd-none");
                }
                this.Selecor.$associateDocker.show();
            }
        }
        SearchFormModel.ActionAssociateDockerShow = ActionAssociateDockerShow;
        class ActionAssociateDockerHide extends Action {
            constructor(Selector) {
                super(Selector);
            }
            execute(event) {
                let $associateDocker = this.Selecor.$associateDocker;
                $associateDocker.css("opacity", "0");
                setTimeout(() => {
                    $associateDocker.hide().css("opacity", "1");
                }, 200);
            }
        }
        SearchFormModel.ActionAssociateDockerHide = ActionAssociateDockerHide;
        class ActionAssociateSimilar extends Action {
            constructor(Selector) {
                super(Selector);
                this.Associate = new AssociateManager(new SearchFormModel.UpdateAssociateItem(Selector));
            }
            execute(event) {
                let inputValue = this.Selecor.$input.val();
                this.Associate.search(inputValue);
            }
        }
        SearchFormModel.ActionAssociateSimilar = ActionAssociateSimilar;
        class ActionSearchSelf extends Action {
            constructor(Selector) {
                super(Selector);
            }
            execute(event) {
                let inputValue = String(this.getInputValue()).trim();
                if (inputValue != "") {
                    new BaiduSearch().addSearchKeyword(inputValue)
                        .addBaiduDeaultParam()
                        .openWebWithCurrentWindow();
                }
            }
        }
        SearchFormModel.ActionSearchSelf = ActionSearchSelf;
        class ActionSearchBlank extends Action {
            constructor(Selector) {
                super(Selector);
            }
            execute(event) {
                let inputValue = this.getInputValue().trim();
                if (inputValue != "") {
                    new BaiduSearch().addSearchKeyword(inputValue)
                        .addBaiduDeaultParam()
                        .openWebWithCurrentWindow();
                }
            }
        }
        SearchFormModel.ActionSearchBlank = ActionSearchBlank;
        class ActionAssociateItemScrollUp extends Action {
            constructor(Selector) {
                super(Selector);
                this.ScrollAssociateItem = new SearchFormModel.ScrollAssociateItem(Selector);
            }
            execute(event) {
                this.ScrollAssociateItem.scrollUp();
            }
        }
        SearchFormModel.ActionAssociateItemScrollUp = ActionAssociateItemScrollUp;
        class ActionAssociateItemScrollDown extends Action {
            constructor(Selector) {
                super(Selector);
                this.ScrollAssociateItem = new SearchFormModel.ScrollAssociateItem(Selector);
            }
            execute(event) {
                this.ScrollAssociateItem.scrollDown();
            }
        }
        SearchFormModel.ActionAssociateItemScrollDown = ActionAssociateItemScrollDown;
        class ActionAssociatePanelHover extends Action {
            constructor(Selector) {
                super(Selector);
                this.ScrollAssociateItem = new SearchFormModel.ScrollAssociateItem(Selector);
            }
            execute(event) {
                this.ScrollAssociateItem.scrollHover();
            }
        }
        SearchFormModel.ActionAssociatePanelHover = ActionAssociatePanelHover;
        class ActionSetClickSelectedToInput extends Action {
            constructor(Selector) {
                super(Selector);
                this.ScrollAssociateItem = new SearchFormModel.ScrollAssociateItem(Selector);
            }
            execute(event) {
                this.ScrollAssociateItem.scrollHover();
            }
        }
        SearchFormModel.ActionSetClickSelectedToInput = ActionSetClickSelectedToInput;
    })(SearchFormModel || (SearchFormModel = {}));
    (function (SearchFormModel) {
        class Assistant {
            constructor() {
                this.SearchURL = new SearchFormModel.SearchURL();
                this.Element = SearchFormModel.SimpleElement.getInstance();
            }
            setInputValueFromURL() {
                let searchValue = this.SearchURL.getSearchValue();
                $(this.Element.getSelectorBarboxInput()).val(searchValue);
            }
            setInputFocus() {
                $(this.Element.getSelectorBarboxInput()).focus();
            }
        }
        SearchFormModel.Assistant = Assistant;
    })(SearchFormModel || (SearchFormModel = {}));
    (function (SearchFormModel) {
        class CheckElement {
            constructor() {
                this.Element = SearchFormModel.SimpleElement.getInstance();
            }
            hasSearchBox() {
                return $(this.Element.getSelectorBdContainer()).length > 0;
            }
        }
        SearchFormModel.CheckElement = CheckElement;
    })(SearchFormModel || (SearchFormModel = {}));
    (function (SearchFormModel) {
        class Count {
            constructor() {
                this.index = -1;
            }
            getUpperLimit(size) {
                return size - 1;
            }
            getLowerLimit() {
                return 0;
            }
            add(size) {
                let index = this.get();
                const UPPER_LIMIT = this.getUpperLimit(size);
                const LOWER_LIMIT = this.getLowerLimit();
                const isOverUpperLimit = (++index) > UPPER_LIMIT;
                if (isOverUpperLimit) {
                    index = LOWER_LIMIT;
                }
                this.set(index);
                return this;
            }
            sub(size) {
                let index = this.get();
                const UPPER_LIMIT = this.getUpperLimit(size);
                const LOWER_LIMIT = this.getLowerLimit();
                const isLessLowerLimit = (--index) < LOWER_LIMIT;
                if (isLessLowerLimit) {
                    index = UPPER_LIMIT;
                }
                this.set(index);
                return this;
            }
            set(index) {
                this.index = index;
                return this;
            }
            get() {
                return this.index;
            }
            reset() {
                this.index = -1;
            }
        }
        SearchFormModel.Count = Count;
        class SimpleCount {
            static getInstance() {
                if (!this.Count) {
                    this.Count = new Count();
                }
                return this.Count;
            }
            ;
        }
        SearchFormModel.SimpleCount = SimpleCount;
    })(SearchFormModel || (SearchFormModel = {}));
    (function (SearchFormModel) {
        class Docker {
            createDocker(template) {
                return $("<div>").append(template);
            }
        }
        SearchFormModel.Docker = Docker;
    })(SearchFormModel || (SearchFormModel = {}));
    (function (SearchFormModel) {
        class Element {
            constructor() {
                this.preClass = ".";
                this.preId = "#";
                this.bd_container = "bd-container-search";
                this.bd_docker = "bd-docker";
                this.barbox_panel = "bd-barbox-ul";
                this.barbox_item = "bd-barbox-li";
                this.barbox_center = "bd-barbox-center";
                this.barbox_input = "bd-barbox-input";
                this.barbox_button = "bd-barbox-button";
                this.associate_panel = "bd-associate-ul";
                this.associate_item = "bd-associate-li";
                this.associate_selected = "bd-associate-selected";
            }
            getClass(name) {
                return this.preClass + name;
            }
            getId(name) {
                return this.preId + name;
            }
            getNameBdContainer() {
                return this.bd_container;
            }
            getNameBdDocker() {
                return this.bd_docker;
            }
            getNameBarboxPanel() {
                return this.barbox_panel;
            }
            getNameBarboxItem() {
                return this.barbox_item;
            }
            getNameBarboxCenter() {
                return this.barbox_center;
            }
            getNameBarboxInput() {
                return this.barbox_input;
            }
            getNameBarboxButton() {
                return this.barbox_button;
            }
            getNameAssociatePanel() {
                return this.associate_panel;
            }
            getNameAssociateItem() {
                return this.associate_item;
            }
            getNameAssociateSelected() {
                return this.associate_selected;
            }
            getSelectorBdContainer() {
                return this.getClass(this.getNameBdContainer());
            }
            getSelectorBdDocker() {
                return this.getClass(this.getNameBdDocker());
            }
            getSelectorBarboxPanel() {
                return this.getClass(this.getNameBarboxPanel());
            }
            getSelectorBarboxItem() {
                return this.getClass(this.getNameBarboxItem());
            }
            getSelectorBarboxInput() {
                return this.getClass(this.getNameBarboxInput());
            }
            getSelectorBarboxButton() {
                return this.getClass(this.getNameBarboxButton());
            }
            getSelectorAssociatePanel() {
                return this.getClass(this.getNameAssociatePanel());
            }
            getSelectorAssociateItem() {
                return this.getClass(this.getNameAssociateItem());
            }
            getSelectorAssociateSelected() {
                return this.getClass(this.getNameAssociateSelected());
            }
        }
        SearchFormModel.Element = Element;
        class SimpleElement {
            static getInstance() {
                if (!this.instance) {
                    this.instance = new Element();
                }
                return this.instance;
            }
            ;
        }
        SearchFormModel.SimpleElement = SimpleElement;
    })(SearchFormModel || (SearchFormModel = {}));
    (function (SearchFormModel) {
        class Event {
            constructor(Selector) {
                this.Selecor = Selector;
            }
            isKeyDown(keyCode) {
                return keyCode === 40;
            }
            isKeyUp(keyCode) {
                return keyCode === 38;
            }
            isKeyEnter(keyCode) {
                return keyCode === 13;
            }
        }
        SearchFormModel.Event = Event;
        class EventInputFocus extends Event {
            constructor(Selector) {
                super(Selector);
            }
            listen(action) {
                this.Selecor.$input.on("focus", (event) => {
                    action.execute(event);
                    return false;
                });
            }
        }
        SearchFormModel.EventInputFocus = EventInputFocus;
        class EventInputBlur extends Event {
            constructor(Selector) {
                super(Selector);
            }
            listen(action) {
                this.Selecor.$input.on("blur", (event) => {
                    action.execute(event);
                    return false;
                });
            }
        }
        SearchFormModel.EventInputBlur = EventInputBlur;
        class EventInputKeyDownWithDown extends Event {
            constructor(Selector) {
                super(Selector);
            }
            listen(action) {
                this.Selecor.$input.on("keydown", (event) => {
                    let keyCode = event.keyCode || event.which || event.charCode;
                    if (this.isKeyDown(keyCode)) {
                        action.execute(event);
                        return false;
                    }
                });
            }
        }
        SearchFormModel.EventInputKeyDownWithDown = EventInputKeyDownWithDown;
        class EventInputKeyDownWithUp extends Event {
            constructor(Selector) {
                super(Selector);
            }
            listen(action) {
                this.Selecor.$input.on("keydown", (event) => {
                    let keyCode = event.keyCode || event.which || event.charCode;
                    if (this.isKeyUp(keyCode)) {
                        action.execute(event);
                        return false;
                    }
                });
            }
        }
        SearchFormModel.EventInputKeyDownWithUp = EventInputKeyDownWithUp;
        class EventInputKeyDownWithEnter extends Event {
            constructor(Selector) {
                super(Selector);
            }
            listen(action) {
                this.Selecor.$input.on("keydown", (event) => {
                    let keyCode = event.keyCode || event.which || event.charCode;
                    if (this.isKeyEnter(keyCode)) {
                        action.execute(event);
                        return false;
                    }
                });
            }
        }
        SearchFormModel.EventInputKeyDownWithEnter = EventInputKeyDownWithEnter;
        class EventInputChange extends Event {
            constructor(Selector) {
                super(Selector);
            }
            listen(action) {
                this.Selecor.$input.off("input propertychange").on("input propertychange", (event) => {
                    action.execute(event);
                    return false;
                });
            }
        }
        SearchFormModel.EventInputChange = EventInputChange;
        class EventButtonClick extends Event {
            constructor(Selector) {
                super(Selector);
            }
            listen(action) {
                this.Selecor.$button.on("click", (event) => {
                    action.execute(event);
                    return false;
                });
            }
        }
        SearchFormModel.EventButtonClick = EventButtonClick;
        class EventAssociatePanelMouseMove extends Event {
            constructor(Selector) {
                super(Selector);
            }
            listen(action) {
                this.Selecor.$associatePanel.on("mousemove", (event) => {
                    action.execute(event);
                    return false;
                });
            }
        }
        SearchFormModel.EventAssociatePanelMouseMove = EventAssociatePanelMouseMove;
        class EventAssociatePanelMouseEnter extends Event {
            constructor(Selector) {
                super(Selector);
            }
            listen(action) {
                this.Selecor.$associatePanel.on("mouseenter", (event) => {
                    action.execute(event);
                    return false;
                });
            }
        }
        SearchFormModel.EventAssociatePanelMouseEnter = EventAssociatePanelMouseEnter;
        class EventAssociatePanelClick extends Event {
            constructor(Selector) {
                super(Selector);
            }
            listen(action) {
                this.Selecor.$associatePanel.on("click", (event) => {
                    action.execute(event);
                    return false;
                });
            }
        }
        SearchFormModel.EventAssociatePanelClick = EventAssociatePanelClick;
    })(SearchFormModel || (SearchFormModel = {}));
    (function (SearchFormModel) {
        class ScrollAssociateItem {
            constructor(Selector) {
                this.Count = SearchFormModel.SimpleCount.getInstance();
                this.Element = SearchFormModel.SimpleElement.getInstance();
                this.Selector = Selector;
            }
            search(content) {
                let baiduSearch = new BaiduSearch();
                baiduSearch.addSearchKeyword(content)
                    .addBaiduDeaultParam()
                    .openWebWithCurrentWindow();
            }
            getItems() {
                return this.Selector.$associatePanel.find(this.Element.getSelectorAssociateItem());
            }
            getItemsSize(items) {
                return !!items ? items.length : 0;
            }
            setIputValue(associateValue) {
                this.Selector.$input.val(associateValue);
            }
            ScrollItem($items) {
                let index = this.Count.get();
                let setClassNameWithScorll = () => {
                    let nameItemSelected = this.Element.getNameAssociateSelected();
                    $items.removeClass(nameItemSelected);
                    $items.eq(index).addClass(nameItemSelected);
                };
                let setInputValue = () => {
                    let associateValue = $items.eq(index).attr("value");
                    this.setIputValue(associateValue);
                };
                setClassNameWithScorll();
                setInputValue();
            }
            scrollUp() {
                let items = this.getItems();
                let size = this.getItemsSize(items);
                this.Count.sub(size);
                this.ScrollItem(items);
            }
            scrollDown() {
                let items = this.getItems();
                let size = this.getItemsSize(items);
                this.Count.add(size);
                this.ScrollItem(items);
            }
            scrollHover_backup() {
                let $items = this.getItems();
                let nameItemHover = this.Element.getNameAssociateSelected();
                let lengthItems = $items.length;
                let isEmptyItems = lengthItems <= 0;
                if (isEmptyItems)
                    return;
                let setClassNameWithHover = (event) => {
                    let target = event.target;
                    $items.removeClass(nameItemHover);
                    if (target.nodeName.toUpperCase() == "LI") {
                        target.classList.add(nameItemHover);
                    }
                    if (target.nodeName.toUpperCase() == "SPAN") {
                        target.parentNode.classList.add(nameItemHover);
                    }
                };
                let setInputValue = () => {
                    $items.each((index, item) => {
                        let $item = $(item);
                        if ($item.hasClass(nameItemHover)) {
                            let itemValue = $item.attr("value");
                            this.setIputValue(itemValue);
                            this.Count.set(index);
                        }
                    });
                };
                setClassNameWithHover(event);
                setInputValue();
            }
            scrollHover() {
                let that = this;
                let $items = this.getItems();
                let nameItemHover = this.Element.getNameAssociateSelected();
                let lengthItems = $items.length;
                let isEmptyItems = lengthItems <= 0;
                if (isEmptyItems)
                    return;
                $items.off("mouseleave").on("mouseleave", function () {
                    let $item = $(this);
                    $item.removeClass(nameItemHover);
                });
                $items.off("mouseenter").on("mouseenter", function () {
                    let $item = $(this);
                    $items.removeClass(nameItemHover);
                    $item.addClass(nameItemHover);
                });
                $items.off("click").on("click", function () {
                    let $item = $(this);
                    let searchContent = String($item.attr("value"));
                    that.search(searchContent.trim());
                });
            }
        }
        SearchFormModel.ScrollAssociateItem = ScrollAssociateItem;
    })(SearchFormModel || (SearchFormModel = {}));
    (function (SearchFormModel) {
        class SearchURL {
            getSearchValue() {
                let currentURL = new URL(location.href);
                let searchValue = currentURL.searchParams.get("wd");
                return searchValue !== null ? decodeURIComponent(searchValue) : "";
            }
        }
        SearchFormModel.SearchURL = SearchURL;
    })(SearchFormModel || (SearchFormModel = {}));
    (function (SearchFormModel) {
        class Selector {
            constructor($docker) {
                this.Element = new SearchFormModel.Element();
                this.$docker = $docker;
                this.$input = this.search(this.Element.getSelectorBarboxInput());
                this.$button = this.search(this.Element.getSelectorBarboxButton());
                this.$associateDocker = this.search(this.Element.getSelectorBdDocker()).eq(1);
                this.$associatePanel = this.search(this.Element.getSelectorAssociatePanel());
            }
            search(selectorName) {
                return this.$docker.find(selectorName);
            }
        }
        SearchFormModel.Selector = Selector;
    })(SearchFormModel || (SearchFormModel = {}));
    (function (SearchFormModel) {
        class Template {
            constructor() {
                this.Element = SearchFormModel.SimpleElement.getInstance();
            }
        }
        class TemplateSearchBox extends Template {
            getTempalteSearchBar() {
                let nameBarboxPanel = this.Element.getNameBarboxPanel();
                let nameBarboxItem = this.Element.getNameBarboxItem();
                let nameBarboxCenter = this.Element.getNameBarboxCenter();
                let nameBarboxInput = this.Element.getNameBarboxInput();
                let nameBarboxButton = this.Element.getNameBarboxButton();
                return `
                    <div class="${nameBarboxPanel}">
                        <div class="${nameBarboxCenter}">
                            <div class="${nameBarboxItem}"><input class="${nameBarboxInput}" type="text" maxlength="255" autocomplete="off"></div>
                            <div  class="${nameBarboxItem}"><button class="${nameBarboxButton}">百度一下</button></div>
                        </div>
                    </div>
                `;
            }
            getTempalteAssociatePanel() {
                let nameAssociatePanel = this.Element.getNameAssociatePanel();
                return `
                    <ul class="${nameAssociatePanel}"></ul>
                `;
            }
            create() {
                let nameBdContainer = this.Element.getNameBdContainer();
                let nameBdDocker = this.Element.getNameBdDocker();
                return `
                    <div class="${nameBdContainer}">
                        <div class="${nameBdDocker}">${this.getTempalteSearchBar()}</div>
                        <div class="${nameBdDocker} bd-none">${this.getTempalteAssociatePanel()}</div>
                    </div>
                    `;
            }
        }
        SearchFormModel.TemplateSearchBox = TemplateSearchBox;
        class TemplateAssociateItem extends Template {
            create() {
                let nameAssociateItem = this.Element.getNameAssociateItem();
                return `
                    <li class="${nameAssociateItem}"></li>
                `;
            }
        }
        SearchFormModel.TemplateAssociateItem = TemplateAssociateItem;
    })(SearchFormModel || (SearchFormModel = {}));
    (function (SearchFormModel) {
        class UpdateAssociateItem {
            constructor(Selector) {
                this.Count = SearchFormModel.SimpleCount.getInstance();
                this.TemplateAssociateItem = new SearchFormModel.TemplateAssociateItem();
                this.Selector = Selector;
            }
            getCurrentInputVaule() {
                return this.Selector.$input.val().trim();
            }
            createTempateItem(inputValue, itemValue) {
                let pathValue = itemValue.replace(inputValue, "");
                let templateItem = this.TemplateAssociateItem.create();
                let $item = $(templateItem);
                $item.attr("value", itemValue);
                $item.html(`<span>${itemValue}</span>`);
                return $item.prop("outerHTML");
            }
            combineItemsTempate(items) {
                let template = "";
                let inputValue = this.getCurrentInputVaule();
                items.forEach((itemValue) => {
                    if (itemValue === "") {
                        template += "";
                    }
                    else {
                        template += this.createTempateItem(inputValue, itemValue);
                    }
                });
                return template;
            }
            isNotEmptyItems(items) {
                return !!items;
            }
            clearAssoicateOldItems() {
                this.Selector.$associatePanel.empty();
            }
            resetCount() {
                this.Count.reset();
            }
            insertItemsToPanel(items) {
                let itemsTemplate = this.combineItemsTempate(items);
                this.Selector.$associatePanel.append(itemsTemplate);
            }
            update(items) {
                this.clearAssoicateOldItems();
                this.resetCount();
                if (this.isNotEmptyItems(items)) {
                    this.insertItemsToPanel(items);
                }
            }
        }
        SearchFormModel.UpdateAssociateItem = UpdateAssociateItem;
    })(SearchFormModel || (SearchFormModel = {}));
    let MenuModel;
    (function (MenuModel) {
        MenuModel.MenuConfig = {
            DISABLE_NAME: "bd-none",
            CUSTOM_BUTTON_NAME: "bd-menu-btn",
            CUSTOM_DETIALS_PANEL_NAME: "bd-menu-detilas",
            OPTION_SELECT_NAME: "bd-page-select",
            OPTION_SWITCH_NAME: "bd-page-switch",
            OPTION_SAVE_NAME: "bd_menu_save",
            OPTION_SILDER_BAR_TAG_NAME: "bd-page-silderBar",
        };
    })(MenuModel || (MenuModel = {}));
    (function (MenuModel) {
        class MenuData {
            constructor() {
                this.MenuConfig = MenuModel.MenuConfig;
            }
            getCurrentPageSelectLayout() {
                return 1;
            }
        }
        MenuModel.MenuData = MenuData;
    })(MenuModel || (MenuModel = {}));
    (function (MenuModel) {
        class MenuElement {
            constructor() {
                this.Template = new MenuModel.MenuTemplate();
                this.PageLayoutOption = new PageLayoutOption();
                this.SilderBarOption = new SilderBarOption();
            }
            getSwitchContent(showContent, o) {
                return this.Template.getContentFunctionSwitch(showContent, o.isEnable(), o.getFunctionName());
            }
            getMenuPageSelectContent() {
                let currentType = this.PageLayoutOption.getCurrentPageType();
                let content = "";
                content += "<ol>页面选择";
                content += this.Template.getContentPageSelect("普通页面", LAYOUT_TYPE.General, currentType);
                content += this.Template.getContentPageSelect("单页居中", LAYOUT_TYPE.OneCenter, currentType);
                content += this.Template.getContentPageSelect("双页居中", LAYOUT_TYPE.TwoCenter, currentType);
                content += this.Template.getContentPageSelect("三页居中", LAYOUT_TYPE.ThreeCenter, currentType);
                content += "</ol>";
                return content;
            }
            getMenuPageFunctionSwitchContent() {
                let content = "";
                content += "<ol>功能选择";
                content += this.getSwitchContent("自动下一页", new AutoNextPageSwitch());
                content += this.getSwitchContent("开启侧边栏", new SideToolBarSwitch());
                content += "</ol>";
                return content;
            }
            getMenuSaveButtonConent(saveButtonName) {
                let content = "";
                content += "<ol>";
                content += `<input id="${saveButtonName}" type = "button" value = "保存" >`;
                content += "</ol>";
                return content;
            }
            getMenuCustomButtonHTML(buttonName) {
                return `<a id=${buttonName}>自定义</a>`;
            }
            getMenuPageSliderBar() {
                let currentMode = this.SilderBarOption.getCurrentMode();
                let content = "";
                content += "<ol>页面选择";
                content += this.Template.getContentSilderBar("自动", SILTER_BAR_MODE.auto, currentMode);
                content += this.Template.getContentSilderBar("显示", SILTER_BAR_MODE.show, currentMode);
                content += this.Template.getContentSilderBar("隐藏", SILTER_BAR_MODE.hidden, currentMode);
                content += "</ol>";
                return content;
            }
            getMenuDetialPanelHTML(detialPanelName, saveButtonName) {
                return `<div id="${detialPanelName}">
                            <div class="bt-menu-piece">
                                ${this.getMenuPageSelectContent()}
                                ${this.getMenuPageFunctionSwitchContent()}
                                ${this.getMenuSaveButtonConent(saveButtonName)}
                            </div>
                        </div>`;
            }
        }
        MenuModel.MenuElement = MenuElement;
    })(MenuModel || (MenuModel = {}));
    (function (MenuModel) {
        class MenuEvent {
            constructor() {
                this.MenuConfig = MenuModel.MenuConfig;
                this.UserConfigManager = new UserConfigManager();
            }
            refreshWeb() {
                location.href = location.href;
            }
            saveUserConfig() {
                this.UserConfigManager.savePageLayoutSelected();
                this.UserConfigManager.saveAdditionFuction();
                this.refreshWeb();
            }
            bindSaveEvent() {
                let saveID = "#" + this.MenuConfig.OPTION_SAVE_NAME;
                let $save = $(saveID);
                $save.off("click").on("click", this, () => {
                    $save.off("click");
                    this.saveUserConfig();
                    return false;
                });
            }
            bindCustonEvent() {
                let customButtonID = "#" + this.MenuConfig.CUSTOM_BUTTON_NAME;
                let detialsPanelID = "#" + this.MenuConfig.CUSTOM_DETIALS_PANEL_NAME;
                let $customButton = $(customButtonID);
                let $detialsPanel = $(detialsPanelID);
                let hiddenName = this.MenuConfig.DISABLE_NAME;
                $customButton.off("click").on("click", (e) => {
                    $detialsPanel.toggleClass(hiddenName);
                    return false;
                });
            }
            hideDetailPanel() {
                let detialsPanelID = "#" + this.MenuConfig.CUSTOM_DETIALS_PANEL_NAME;
                let $detialsPanel = $(detialsPanelID);
                let hiddenName = this.MenuConfig.DISABLE_NAME;
                $detialsPanel.addClass(hiddenName);
            }
            blurClickHideDetailPanel() {
                let detialsPanelID = "#" + this.MenuConfig.CUSTOM_DETIALS_PANEL_NAME;
                let rule = `:not(${detialsPanelID})`;
                $("#container").off("click").on('click', rule, () => {
                    this.hideDetailPanel();
                });
            }
        }
        MenuModel.MenuEvent = MenuEvent;
        class UserConfigManager {
            constructor() {
                this.MenuConfig = MenuModel.MenuConfig;
                this.PageLayoutOption = new PageLayoutOption();
                this.AutoNextPageSwitch = new AutoNextPageSwitch();
                this.SideToolBarSwitch = new SideToolBarSwitch();
            }
            savePageLayoutSelected() {
                let that = this;
                let containerRule = `#${this.MenuConfig.CUSTOM_DETIALS_PANEL_NAME}`;
                let radioRule = `input[name=${this.MenuConfig.OPTION_SELECT_NAME}]`;
                let $radios = $(containerRule).find(radioRule);
                $radios.each(function (index, element) {
                    let $radio = $(this);
                    if ($radio.prop('checked')) {
                        let option = Number($radio.attr("value"));
                        switch (option) {
                            case LAYOUT_TYPE.General:
                                that.PageLayoutOption.setPageLayoutType(LAYOUT_TYPE.General);
                                break;
                            case LAYOUT_TYPE.OneCenter:
                                that.PageLayoutOption.setPageLayoutType(LAYOUT_TYPE.OneCenter);
                                break;
                            case LAYOUT_TYPE.TwoCenter:
                                that.PageLayoutOption.setPageLayoutType(LAYOUT_TYPE.TwoCenter);
                                break;
                            case LAYOUT_TYPE.ThreeCenter:
                                that.PageLayoutOption.setPageLayoutType(LAYOUT_TYPE.ThreeCenter);
                                break;
                            default:
                                that.PageLayoutOption.setPageLayoutType(LAYOUT_TYPE.General);
                                break;
                        }
                        return;
                    }
                });
            }
            saveAdditionFuction() {
                let that = this;
                let containerRule = `#${this.MenuConfig.CUSTOM_DETIALS_PANEL_NAME}`;
                let switchRule = `input[name=${this.MenuConfig.OPTION_SWITCH_NAME}]`;
                let $switchs = $(containerRule).find(switchRule);
                $switchs.each(function (index, element) {
                    let $selector = $(this);
                    let functionName = Number($selector.attr("value"));
                    if (functionName == ADDITION_FUNCTION.AutoNextPage) {
                        if ($selector.prop('checked')) {
                            that.AutoNextPageSwitch.enable();
                        }
                        else {
                            that.AutoNextPageSwitch.disable();
                        }
                    }
                    if (functionName == ADDITION_FUNCTION.SideToolBar) {
                        if ($selector.prop('checked')) {
                            that.SideToolBarSwitch.enable();
                        }
                        else {
                            that.SideToolBarSwitch.disable();
                        }
                    }
                });
            }
        }
        MenuModel.UserConfigManager = UserConfigManager;
    })(MenuModel || (MenuModel = {}));
    (function (MenuModel) {
        class MenuTemplate {
            constructor() {
                this.MenuConfig = MenuModel.MenuConfig;
            }
            getContentPageSelect(content, layoutType, currentlayoutType) {
                let checked = layoutType === currentlayoutType ? "checked" : "";
                return `<li><input type="radio" name="${this.MenuConfig.OPTION_SELECT_NAME}" value="${layoutType}" ${checked}>${content}</li>`;
            }
            getContentFunctionSwitch(showContent, isEnable, additionFuntionName) {
                let checked = isEnable ? "checked" : "";
                return `<li><input type="checkbox" name="${this.MenuConfig.OPTION_SWITCH_NAME}"  value="${additionFuntionName}" ${checked}>${showContent}</li>`;
            }
            getContentSilderBar(showText, mode, currentMode) {
                let checked = (mode === currentMode) ? "checked" : "";
                return `<li><input type="radio"  name="${this.MenuConfig.OPTION_SILDER_BAR_TAG_NAME}" value="${mode}" ${checked}>${showText}</li>`;
            }
        }
        MenuModel.MenuTemplate = MenuTemplate;
    })(MenuModel || (MenuModel = {}));
    let SearchResult;
    (function (SearchResult) {
        class Cache {
            constructor() {
                this.caches = [];
            }
            hasCache() {
                return (this.caches.length > 0) ? true : false;
            }
            getCache() {
                return this.caches.shift();
            }
            add(content) {
                this.caches.push(content);
            }
        }
        SearchResult.Cache = Cache;
    })(SearchResult || (SearchResult = {}));
    (function (SearchResult) {
        SearchResult.Configs = {
            tplBlackLists: [
                "med_qa",
                "bjh_addressing",
                "recommend_list",
                "ads_b2c_universal_card",
                "sp_hot_sale",
                "b2b_straight",
                "b2b_factory2",
                "vmp_zxenterprise_new",
                "short_video",
            ]
        };
    })(SearchResult || (SearchResult = {}));
    (function (SearchResult) {
        class Fetch {
            constructor() {
                this.configs = SearchResult.Configs;
                this.Cache = new SearchResult.Cache();
                this.BaiduUrl = new UrlEditor(location.href);
                this.count = 0;
                this.request();
            }
            getNextPageURL() {
                this.Search = new BaiduSearch();
                this.Search.addSearchKeyword(this.BaiduUrl.getParamValue("wd"));
                this.Search.addPN(this.count);
                this.count += 30;
                this.Search.addRN(30);
                return this.Search.getFinalURL();
            }
            request() {
                let url = this.getNextPageURL();
                GM.xmlhttpRequest({
                    method: "GET",
                    url: url,
                    timeout: 3000,
                    responseType: "text",
                    headers: {
                        "User-Agent": navigator.userAgent,
                        "Cookie": document.cookie,
                    },
                    onload: (response) => {
                        if (response.status === 200 ||
                            response.status === 304) {
                            this.Cache.add(response.responseText);
                        }
                    },
                    onerror: (response) => {
                        console.error(response);
                    }
                });
            }
            run() {
                this.request();
                if (this.Cache.hasCache()) {
                    return this.Cache.getCache();
                }
                else {
                    return "";
                }
            }
        }
        SearchResult.Fetch = Fetch;
    })(SearchResult || (SearchResult = {}));
    (function (SearchResult) {
        class Filter {
            constructor() {
                this.config = SearchResult.Configs;
            }
            isAds(item) {
                let id = item.attr("id");
                if (id == "1") {
                    let items = $(item).find(".se_st_footer>a");
                    for (let i = 0, item; item = items[i++];) {
                        if ($(item).text() == "广告") {
                            return true;
                        }
                    }
                }
                return false;
            }
            isDryTpl(item) {
                let tplCurrentContent = item.attr("tpl");
                for (let tplBlackContent of this.config.tplBlackLists) {
                    if (tplBlackContent === tplCurrentContent) {
                        return true;
                    }
                }
                return false;
            }
            isWhiteItem(item) {
                let isRemove = false;
                if (!isRemove) {
                    isRemove = this.isAds(item);
                }
                if (!isRemove) {
                    isRemove = this.isDryTpl(item);
                }
                return isRemove ? false : true;
            }
            RemoveDryItem(items) {
                let temp = [];
                for (let i = 0, item; item = items[i++];) {
                    let $item = $(item);
                    let isNormal = this.isWhiteItem($item);
                    if (!isNormal) {
                        $item.remove();
                        continue;
                    }
                    temp.push(item);
                }
                return $(temp);
            }
            run(items) {
                return this.RemoveDryItem(items);
            }
        }
        SearchResult.Filter = Filter;
    })(SearchResult || (SearchResult = {}));
    (function (SearchResult) {
        class Manager {
            constructor() {
                this.Filter = new SearchResult.Filter();
                this.Fetch = new SearchResult.Fetch();
            }
            filterInvalidSearchResult(items) {
                return this.Filter.run(items);
            }
            getCurrentPageSerachResult() {
                let items = $("#content_left>div[id]");
                return this.filterInvalidSearchResult(items);
            }
            getNextPageSearchResult() {
                this.Fetch.run();
            }
            run() {
                console.log("SearchResultManager");
                this.getNextPageSearchResult();
            }
        }
        SearchResult.Manager = Manager;
    })(SearchResult || (SearchResult = {}));
    let SideToolBarModel;
    (function (SideToolBarModel) {
        SideToolBarModel.Configs = {
            SIDEBAR_NAME: "bd_sidebar",
        };
    })(SideToolBarModel || (SideToolBarModel = {}));
    (function (SideToolBarModel) {
        class Element {
            constructor() {
                this.Configs = SideToolBarModel.Configs;
                this.SIDEBAR_TOOLBAR_ITEMS = SIDEBAR_TOOLBAR_ITEMS;
            }
            getSiderbarItemsContent() {
                let content = "";
                for (let [name, value] of Object.entries(this.SIDEBAR_TOOLBAR_ITEMS)) {
                    content += `<li value=${value}>${name}</li>`;
                }
                return content;
            }
            getContainerHTML() {
                return `
                    <div id="${this.Configs.SIDEBAR_NAME}">
                    </div>
                   
                    
                `;
            }
            getItemsHTML() {
                return `
                    
                     <ol>
                        ${this.getSiderbarItemsContent()}
                    </ol>
                    
                   
                `;
            }
            getSignHTML() {
                return `<div class="bd_siderbar_sign">
                            <div class="box">
                                <div class="chevron"></div>
                                <div class="chevron"></div>
                                <div class="chevron"></div>
                            </div>
                            
                        </div>`;
            }
        }
        SideToolBarModel.Element = Element;
    })(SideToolBarModel || (SideToolBarModel = {}));
    (function (SideToolBarModel) {
        class SideToolBar {
            constructor() {
                this.Element = new SideToolBarModel.Element();
            }
            useThirdSearch(event) {
                let $target = $(event.target);
                let templateURL = String($target.attr("value"));
                let searchContent = new UrlEditor(location.href).getParamValue("wd").trim();
                searchContent = decodeURIComponent(searchContent);
                let finalURL = templateURL.replace("%s", encodeURIComponent(searchContent));
                location.href = finalURL;
            }
            bindClickEvent($selector) {
                $selector.off("click").on("click", "li", (event) => {
                    this.useThirdSearch(event);
                    return false;
                });
            }
            getSideToolBar() {
                let containerHTML = this.Element.getContainerHTML();
                let itemsHTML = this.Element.getItemsHTML();
                let $container = $(containerHTML);
                let $items = $(itemsHTML);
                $container.append($items);
                this.bindClickEvent($container);
                return $container;
            }
        }
        SideToolBarModel.SideToolBar = SideToolBar;
    })(SideToolBarModel || (SideToolBarModel = {}));
    class IndexPageInjectStyles {
        constructor() {
            this.StyleContent = new StyleContent();
        }
        construct() {
        }
        start() {
            let style = new StyleControl();
            style.add(this.StyleContent.getStlyeForIndex());
            style.end();
        }
    }
    class ResultPageInjectStyles {
        constructor() {
            this.StyleContent = new StyleContent();
            this.PageLayoutOption = new PageLayoutOption();
        }
        start() {
            let style = new StyleControl();
            let layoutType = this.PageLayoutOption.getCurrentPageType();
            style.add(this.StyleContent.getStyleForBase());
            style.add(this.StyleContent.getStyleForMenu());
            style.add(this.StyleContent.getStyleForSidebar());
            switch (layoutType) {
                case LAYOUT_TYPE.OneCenter:
                    style.add(this.StyleContent.getStyleForLayoutOneCenter());
                    break;
                case LAYOUT_TYPE.TwoCenter:
                    style.add(this.StyleContent.getStyleForLayoutTwoCenter());
                    break;
                case LAYOUT_TYPE.ThreeCenter:
                    style.add(this.StyleContent.getStyleForLayoutThreeCenter());
                    break;
                default:
                    break;
            }
            style.end();
        }
    }
    class CustomMenu {
        constructor() {
            this.Template = new MenuModel.MenuElement();
            this.MenuEvent = new MenuModel.MenuEvent();
            this.MenuCustomButton = new MenuModel.MenuCustomButton(this.Template);
            this.MenuDetialsPanel = new MenuModel.MenuCustomDetials(this.Template);
        }
        insertMenuCustomButton() {
            if (!this.MenuCustomButton.hasCustomButton()) {
                let $container = $("#u");
                let div = this.MenuCustomButton.getCustomButtonHTML();
                $container.prepend(div);
            }
        }
        insertMenuDetailPanel() {
            if (!this.MenuDetialsPanel.hasDetailsPanel()) {
                let $container = $("#u");
                let div = this.MenuDetialsPanel.getDetaialPanelHTML();
                $container.append(div);
            }
        }
        bindCustomButtonEvent() {
            this.MenuEvent.bindCustonEvent();
        }
        bindSaveEvent() {
            this.MenuEvent.bindSaveEvent();
        }
        blurClickHideDetailPanel() {
            this.MenuEvent.blurClickHideDetailPanel();
        }
        hideDetailPanel() {
            this.MenuEvent.hideDetailPanel();
        }
        start() {
            this.insertMenuCustomButton();
            this.insertMenuDetailPanel();
            this.hideDetailPanel();
            this.bindCustomButtonEvent();
            this.bindSaveEvent();
            this.blurClickHideDetailPanel();
        }
    }
    (function (MenuModel) {
        class MenuCustomButton {
            constructor(Template) {
                this.menuConfig = MenuModel.MenuConfig;
                this.buttonName = this.menuConfig.CUSTOM_BUTTON_NAME;
                this.buttonID = "#" + this.buttonName;
                this.Template = Template;
            }
            getCustomButtonHTML() {
                return this.Template.getMenuCustomButtonHTML(this.buttonName);
            }
            hasCustomButton() {
                return $(this.buttonID).length > 0 ? true : false;
            }
        }
        MenuModel.MenuCustomButton = MenuCustomButton;
    })(MenuModel || (MenuModel = {}));
    (function (MenuModel) {
        class MenuCustomDetials {
            constructor(Template) {
                this.MenuConfig = MenuModel.MenuConfig;
                this.Template = Template;
            }
            getDetaialPanelHTML() {
                return this.Template.getMenuDetialPanelHTML(this.MenuConfig.CUSTOM_DETIALS_PANEL_NAME, this.MenuConfig.OPTION_SAVE_NAME);
            }
            hasDetailsPanel() {
                let detailsPanelID = "#" + this.MenuConfig.CUSTOM_DETIALS_PANEL_NAME;
                return $(detailsPanelID).length > 0 ? true : false;
            }
        }
        MenuModel.MenuCustomDetials = MenuCustomDetials;
    })(MenuModel || (MenuModel = {}));
    class AddBingWallpaper {
        start() {
            let bingWallpater = new WallPaperModel.BingWallpaper();
            bingWallpater.insertBingWallpaperNode();
        }
    }
    (function (WallPaperModel) {
        class BingWallpaper {
            constructor() {
                this.config = new WallPaperModel.WallpagerConfig();
                this.isExcuteFlagName = "bd-BingWallpaper";
                this.isExcuteFlagClassName = "." + this.isExcuteFlagName;
            }
            createBingWallpaperNode(imageUrl) {
                let template = new WallPaperModel.Tempalte(this.config);
                return template.createBingWallpaperNode(imageUrl);
            }
            getBingWallpaperNode() {
                let images = new WallPaperModel.Images(new WallPaperModel.WallPaperBing());
                let url = images.getImageURL();
                return this.createBingWallpaperNode(url);
            }
            isExitNode() {
                return $(this.isExcuteFlagClassName).length > 0;
            }
            insertBingWallpaperNode() {
                if (!this.isExitNode()) {
                    let $node = $(this.getBingWallpaperNode());
                    $node.addClass(this.isExcuteFlagName);
                    $("body").append($node);
                }
            }
        }
        WallPaperModel.BingWallpaper = BingWallpaper;
    })(WallPaperModel || (WallPaperModel = {}));
    (function (SearchFormModel) {
        class Control {
            constructor() {
                this.isNewWindowSearch = false;
                this.Assistant = new SearchFormModel.Assistant();
                this.$docker = this.createDocker();
                this.Selector = new SearchFormModel.Selector(this.$docker);
            }
            createDocker() {
                return new SearchFormModel.Docker().createDocker(new SearchFormModel.TemplateSearchBox().create());
            }
            hasSearchBoxAtDom() {
                return new SearchFormModel.CheckElement().hasSearchBox();
            }
            bind(Event, Action) {
                new Event(this.Selector).listen(new Action(this.Selector));
            }
            events() {
                this.bind(SearchFormModel.EventInputFocus, SearchFormModel.ActionAssociateDockerShow);
                this.bind(SearchFormModel.EventInputFocus, SearchFormModel.ActionAssociateSimilar);
                this.bind(SearchFormModel.EventInputBlur, SearchFormModel.ActionAssociateDockerHide);
                this.bind(SearchFormModel.EventInputChange, SearchFormModel.ActionAssociateSimilar);
                this.bind(SearchFormModel.EventInputKeyDownWithUp, SearchFormModel.ActionAssociateItemScrollUp);
                this.bind(SearchFormModel.EventInputKeyDownWithDown, SearchFormModel.ActionAssociateItemScrollDown);
                this.bind(SearchFormModel.EventAssociatePanelMouseEnter, SearchFormModel.ActionAssociatePanelHover);
                this.bind(SearchFormModel.EventInputKeyDownWithEnter, SearchFormModel.ActionSearchSelf);
                this.bind(SearchFormModel.EventButtonClick, SearchFormModel.ActionSearchSelf);
            }
            insertDockerToDom(containerName) {
                $(containerName).append(this.$docker);
            }
            setInputValueFromURL() {
                this.Assistant.setInputValueFromURL();
            }
            setInputFocus() {
                this.Assistant.setInputFocus();
            }
            setNewWindowSearch() {
                this.isNewWindowSearch = true;
            }
            start(containerName) {
                if (!this.hasSearchBoxAtDom()) {
                    this.events();
                    this.insertDockerToDom(containerName);
                }
            }
        }
        SearchFormModel.Control = Control;
        class ConcreteControl extends Control {
            constructor() {
                super();
                this.isInputValueFromURL = false;
                this.isInputFocus = false;
            }
            executeCallback() {
                for (const fn of this.callbacks) {
                    fn();
                }
            }
            insertElementToDom() {
                $(this.targetContainer).append();
            }
            setPageIndex() {
                this.targetContainer = "#lg";
            }
            setPageResult() {
                this.targetContainer = ".s_form";
            }
            setInputFocus() {
                this.isInputFocus = true;
            }
            setInputValueFromURL() {
                this.isInputValueFromURL = true;
            }
            setNewWindowSearch() {
                super.setNewWindowSearch();
            }
            start() {
                super.start(this.targetContainer);
                if (!!this.isInputValueFromURL) {
                    super.setInputValueFromURL();
                }
                if (!!this.isInputFocus) {
                    super.setInputFocus();
                }
            }
        }
        SearchFormModel.ConcreteControl = ConcreteControl;
    })(SearchFormModel || (SearchFormModel = {}));
    class ResultPageAddSearchForm {
        start() {
            let control = new SearchFormModel.ConcreteControl();
            control.setPageResult();
            control.setInputValueFromURL();
            control.start();
        }
    }
    class IndexPageAddSearchForm {
        start() {
            let control = new SearchFormModel.ConcreteControl();
            control.setPageIndex();
            control.setInputFocus();
            control.start();
        }
    }
    class LayoutControl {
        constructor() {
            this.SearchResultManager = new SearchResult.Manager();
            this.LayoutElements = new LayoutElements();
            this.AutoNextPageSwitch = new AutoNextPageSwitch();
        }
        getListsHTML(ListTotal) {
            let listsHTML = "";
            for (let i = 0; i < ListTotal; i++) {
                listsHTML = listsHTML + this.LayoutElements.getListHTML();
            }
            return listsHTML;
        }
        getContainer(ListTotal) {
            let $container = $(this.LayoutElements.getContainerHTML());
            let $dock = $(this.LayoutElements.getDockHTML());
            let $lists = $(this.getListsHTML(ListTotal));
            $dock.append($lists);
            $container.append($dock);
            return $container;
        }
        insertListHTMLToWeb(ListTotal) {
            let $html = $("#content_left");
            let $container = this.getContainer(ListTotal);
            $html.after($container);
        }
        movePageResultToList() {
            let oldSearchResultItems = this.SearchResultManager.getCurrentPageSerachResult();
            let multipleLayout = new MultipleLayout();
            multipleLayout.addSearchResultToList(oldSearchResultItems);
        }
        addPageNumberModel() {
            let $pageNumberContainer = new PageNumber().getPageNumberContainer();
            $(this.LayoutElements.getContainerClassName()).after($pageNumberContainer);
        }
        autoNextPageLoad() {
            let nextPage = new NextPage();
            nextPage.autoLoad();
        }
        switchAutoNextPage() {
            return this.AutoNextPageSwitch.isEnable();
        }
        addAdditionModule() {
            this.movePageResultToList();
            if (this.switchAutoNextPage()) {
                this.autoNextPageLoad();
            }
            else {
                setTimeout(() => {
                    this.addPageNumberModel();
                }, 500);
            }
        }
        runGeneralLayout() {
            this.insertListHTMLToWeb(1);
            this.addAdditionModule();
        }
        runOneCenterLayout() {
            this.insertListHTMLToWeb(1);
            this.addAdditionModule();
        }
        runTwoCenterLayout() {
            this.insertListHTMLToWeb(2);
            this.addAdditionModule();
        }
        runThreeCenterLayout() {
            this.insertListHTMLToWeb(3);
            this.addAdditionModule();
        }
        start() {
            let pageLayoutOption = new PageLayoutOption();
            let currentLayout = pageLayoutOption.getCurrentPageType();
            switch (currentLayout) {
                case LAYOUT_TYPE.OneCenter:
                    this.runOneCenterLayout();
                    break;
                case LAYOUT_TYPE.TwoCenter:
                    this.runTwoCenterLayout();
                    break;
                case LAYOUT_TYPE.ThreeCenter:
                    this.runThreeCenterLayout();
                    break;
                default:
                    this.runGeneralLayout();
                    break;
            }
        }
    }
    class LayoutElements {
        constructor() {
            this.CONTAINER_NAME = "bd_search_result_container";
            this.DOCK_NAME = "bd_serach_result_dock";
            this.LIST_NAME = "bd_list";
        }
        getContainerClassName() {
            return "." + this.CONTAINER_NAME;
        }
        getDockClassName() {
            return "." + this.DOCK_NAME;
        }
        getListClassName() {
            return "." + this.LIST_NAME;
        }
        getContainerHTML() {
            return `
                <div class="${this.CONTAINER_NAME}">
                </div>
                `;
        }
        getDockHTML() {
            return `<div class="${this.DOCK_NAME}" > </div>`;
        }
        getListHTML() {
            return `<div class="${this.LIST_NAME}"></div>`;
        }
    }
    class MultipleLayout {
        constructor() {
            this.LayoutElements = new LayoutElements();
            this.listTotal = this.getListTotal();
        }
        getListTotal() {
            return this.getListSelector().length;
        }
        getListSelector() {
            return $(this.LayoutElements.getListClassName());
        }
        getListHeights() {
            let $listSelectors = this.getListSelector();
            let heights = new Array(this.listTotal).fill(0);
            $listSelectors.each(function (index, element) {
                heights[index] = $(this).outerHeight();
            });
            return heights;
        }
        useSinglePageLayout(searchResultItems) {
            let $lists = this.getListSelector();
            $lists.eq(0).append(searchResultItems);
        }
        useMultipageLayout(searchResultItems) {
            let that = this;
            let $lists = this.getListSelector();
            $(searchResultItems).each(function () {
                let listHeights = that.getListHeights();
                let minHeight = Reflect.apply(Math.min, null, listHeights);
                let order = listHeights.indexOf(minHeight);
                $lists.eq(order).append(this);
            });
        }
        addSearchResultToList(searchResultItems) {
            if (this.listTotal <= 1) {
                this.useSinglePageLayout(searchResultItems);
            }
            else {
                this.useMultipageLayout(searchResultItems);
            }
        }
    }
    class NextPage {
        constructor() {
            this.Page = new Page();
            this.MultipleLayout = new MultipleLayout();
            this.Filter = new SearchResult.Filter();
            this.nextPageOrder = 1;
            this.EXTRA_HEIGHT = 300;
            this.baiduNextPageHref = "";
            this.responTextCaches = [];
            this.baiduNextPageHref = this.getBaiduNextPageHref(this.getNextPageElement());
            setTimeout(() => {
                this.requireAndSave();
            }, 1000);
        }
        getNextPageElement() {
            return $("#page a").last();
        }
        getBaiduNextPageHref($element) {
            let tempURL = $element.attr("href");
            return String(tempURL);
        }
        updateBaiduNextPageHref($element) {
            let pathURL = this.getBaiduNextPageHref($element);
            this.baiduNextPageHref = pathURL;
        }
        hasBaiduNextPageHref() {
            return !!this.baiduNextPageHref ? true : false;
        }
        getNextPageURL() {
            return "https://www.baidu.com" + this.baiduNextPageHref;
        }
        isScrollToBottom() {
            let wh = Number($(window).height());
            let c = Number($(document).scrollTop());
            let h = Number($(document.body).height());
            return (Math.ceil(wh + c) + this.EXTRA_HEIGHT) >= h ? true : false;
        }
        hasResponTextCaches() {
            return this.responTextCaches.length > 0 ? true : false;
        }
        extractSearchItems(responseText) {
            return $(responseText).find("#content_left").children(" div[id]");
        }
        extractBaiduNextPageElement(responseText) {
            return $(responseText).find("#page a").last();
        }
        requireNextPageContent(nextPageURL) {
            let that = this;
            return new Promise((resolve) => {
                GM.xmlhttpRequest({
                    method: "GET",
                    url: nextPageURL,
                    timeout: 3000,
                    responseType: "text",
                    headers: {
                        "Host": "www.baidu.com",
                        "User-Agent": navigator.userAgent,
                        "Cookie": document.cookie,
                        "Accept- Encoding": "gzip, deflate, br",
                        "Is_xhr": 1,
                    },
                    onload: (response) => {
                        if (response.status === 200 ||
                            response.status === 304) {
                            resolve(response.responseText);
                        }
                    },
                    onerror: (response) => {
                        console.error(response);
                        console.error("不能获取下一页，请排查原因");
                        resolve("");
                    }
                });
            });
        }
        async requireAndSave(callback) {
            if (!this.hasBaiduNextPageHref()) {
                return;
            }
            let nextPageURL = this.getNextPageURL();
            let responseText = await this.requireNextPageContent(nextPageURL);
            let content = String(responseText);
            if (content == "") {
                return;
            }
            this.responTextCaches.push(content);
            if (callback) {
                Reflect.apply(callback, this, []);
            }
        }
        async addNextPageToWeb() {
            if (!this.hasBaiduNextPageHref()) {
                return;
            }
            if (this.hasResponTextCaches()) {
                let responseText = String(this.responTextCaches.shift());
                let $nextPageElement = this.extractBaiduNextPageElement(responseText);
                this.updateBaiduNextPageHref($nextPageElement);
                let oldSearchResultitems = this.extractSearchItems(responseText);
                let searchResultItems = this.Filter.run(oldSearchResultitems);
                this.MultipleLayout.addSearchResultToList(searchResultItems);
            }
            else {
                Reflect.apply(this.requireAndSave, this, [this.addNextPageToWeb]);
                return;
            }
            this.requireAndSave();
            setTimeout(() => {
                this.bindScrollEvent();
            }, 500);
        }
        bindScrollEvent() {
            $(window).on("scroll", document, () => {
                if (this.isScrollToBottom()) {
                    this.unbindScrollEvent();
                    this.addNextPageToWeb();
                }
            });
        }
        unbindScrollEvent() {
            $(window).off("scroll");
        }
        autoLoad() {
            setTimeout(() => {
                this.bindScrollEvent();
            }, 2000);
        }
    }
    class Page {
        constructor() {
            this.PN_DEFAULT_VALUE = 10;
            this.START_PN_MODIFIED_VALUE = 30;
            this.RN_SYSTEM_VALUE = 10;
            this.RN_VALUE = 30;
            this.pageNumberSelectedLabel = this.getSelectedLabelFromBaiduPageNumber();
            this.pageNumberStartLabel = this.getStartLabelFromBaiduPageNumber();
        }
        getStartLabelFromBaiduPageNumber() {
            let $element = $("#page span").first();
            let content = $element.find("span").text();
            return content == "" ? 1 : Number(content);
        }
        getSelectedLabelFromBaiduPageNumber() {
            let $element = $("#page strong").first();
            let content = $element.find("span").text();
            return content == "" ? 1 : Number(content);
        }
        getPageNumberStartLabel() {
            return Number(this.pageNumberStartLabel);
        }
        getPageNumberSelectedLabel() {
            return Number(this.pageNumberSelectedLabel);
        }
    }
    class Page_old {
        constructor() {
            this.PN_DEFAULT_VALUE = 10;
            this.START_PN_MODIFIED_VALUE = 30;
            this.RN_SYSTEM_VALUE = 10;
            this.RN_VALUE = 30;
            this.pageNumberSelectedLabel = this.getSelectedLabelFromBaiduPageNumber();
            this.pageNumberStartLabel = this.getStartLabelFromBaiduPageNumber();
        }
        getStartLabel(selectedLable) {
            let tempLable = selectedLable;
            let offset = tempLable % 10;
            let level = Math.floor(tempLable / 10);
            let startLable = level * 10 + offset;
            return startLable <= 5 ? 1 : startLable - 5;
        }
        getStartLabelFromBaiduPageNumber() {
            let $element = $("#page span").first();
            let content = $element.find("span").text();
            return content == "" ? 1 : Number(content);
        }
        getSelectedLabel() {
            let currentURL = new UrlEditor(location.href);
            if (!currentURL.hasParam("pn")) {
                return 1;
            }
            let pn = Number(currentURL.getParamValue("pn"));
            let rn = Number(currentURL.getParamValue("rn"));
            let firstTotal = this.getFirstPageToal();
            return (pn - firstTotal) / rn + 2;
        }
        getSelectedLabelFromBaiduPageNumber() {
            let $element = $("#page strong").first();
            let content = $element.find("span").text();
            return content == "" ? 1 : Number(content);
        }
        isFirstPage() {
            let currentSearchURL = new UrlEditor(location.href);
            let hasPnParam = currentSearchURL.hasParam("pn");
            if (!hasPnParam) {
                return true;
            }
            else {
                let pn = Number(currentSearchURL.getParamValue("pn"));
                return pn == 0 ? true : false;
            }
        }
        getPageNumberStartLabel() {
            return Number(this.pageNumberStartLabel);
        }
        getPageNumberSelectedLabel() {
            return Number(this.pageNumberSelectedLabel);
        }
        getFirstPageToal() {
            let currentSearchURL = new UrlEditor(location.href);
            let hasRandomParam = currentSearchURL.hasParam("rn");
            if (!hasRandomParam) {
                return this.PN_DEFAULT_VALUE;
            }
            else {
                return Number(currentSearchURL.getParamValue("rn"));
            }
        }
        getNewPageURL(pageOrder, baiduNextPageHref) {
            let currentSearchURL = new UrlEditor(location.href);
            let baiduSearch = new BaiduSearch();
            let firstPageTotal = this.getFirstPageToal();
            let rn = Number(currentSearchURL.getParamValue("rn")) || this.RN_SYSTEM_VALUE;
            let searchContent = currentSearchURL.getParamValue("wd");
            baiduSearch.addSearchKeyword(searchContent).addRN(rn).openRandonNumber();
            if (currentSearchURL.hasParam("si")) {
                baiduSearch.addParam("si", currentSearchURL.getParamValue("si"));
                baiduSearch.addParam("ct", currentSearchURL.getParamValue("ct"));
            }
            if (currentSearchURL.hasParam("gpc")) {
                baiduSearch.addParam("gpc", currentSearchURL.getParamValue("gpc"));
            }
            if (pageOrder > 1) {
                let level = pageOrder - 2;
                let finalPnValue = firstPageTotal * (pageOrder - 1);
                baiduSearch.addPN(finalPnValue);
            }
            if (!!baiduNextPageHref) {
                let fullURL = "https://www.baidu.com/" + baiduNextPageHref;
                let baiduNextParams = ["rsv_t", "rsv_idx", "rsv_pq"];
                let o = (new URL(fullURL)).searchParams;
                for (const param of baiduNextParams) {
                    if (o.has(param)) {
                        baiduSearch.addParam(param, String(o.get(param)));
                    }
                }
            }
            return baiduSearch.getFinalURL();
        }
    }
    class PageNumber {
        constructor() {
            this.Page = new Page();
            this.BAIDU_PAGE_NUMBER_CONTAINER_NAME = "bd_page_number";
            this.FIRST_PAGE = 1;
            this.baiduNextPageHref = "";
            this.baiduNextPageHref = this.getBaiduNextPageHref();
        }
        createContainerElement() {
            return `<div id = "${this.BAIDU_PAGE_NUMBER_CONTAINER_NAME}"><div>`;
        }
        createPrePageElement() {
            let template = "";
            let $page = $("#page>div>*");
            let currentPageNumber = Number($page.children().filter("strong>span").text());
            if (currentPageNumber == this.FIRST_PAGE) {
                template = `<div class="bd-none bd_page_item bd_page_pre_page"></div>`;
            }
            else {
                let href = $page.first().attr("href");
                template = `<a class="bd_page_item bd_page_pre_page" ><span bdhref="${href}">上一页</span></a>`;
            }
            return template;
        }
        createNextPageElement() {
            let href = $("#page>div>[href]").last().attr("href");
            let template = `<a class="bd_page_item bd_page_next_page"><span bdhref="${href}">下一页></span></a>`;
            return template;
        }
        createPageNumberElement() {
            let $page = $("#page>div>*");
            let currentPageNumber = Number($page.children().filter("strong>span").text());
            let template = "";
            for (let index = 1; index < $page.length - 1; index++) {
                let pageNumber = Number($page.eq(index).text());
                let href = $page.eq(index).attr("href");
                if (pageNumber == currentPageNumber) {
                    let selectedClassName = "bd_page_number_selected";
                    template += `<a  class="bd_page_item bd_page_number ${selectedClassName}"><span>${pageNumber}</span></a>`;
                }
                else {
                    template += `<a  class="bd_page_item bd_page_number"><span bdhref="${href}">${pageNumber}</span></a>`;
                }
            }
            return template;
        }
        getBaiduNextPageHref() {
            let tempURL = $("#page a").last().attr("href");
            return String(tempURL);
        }
        addClickEvent($container) {
            $container.on("click", "span", (event) => {
                event = event || window.event;
                let href = "https://www.baidu.com" + String($(event.target).attr("bdhref"));
                if (href != "") {
                    console.log(href);
                    window.open(href, "_self");
                }
            });
        }
        getPageNumberContainer() {
            let $container = $(this.createContainerElement());
            $container.append(this.createPrePageElement());
            $container.append(this.createPageNumberElement());
            $container.append(this.createNextPageElement());
            this.addClickEvent($container);
            return $container;
        }
    }
    class PageNumber_old {
        constructor() {
            this.Page = new Page();
            this.BAIDU_PAGE_NUMBER_CONTAINER_NAME = "bd_page_number";
            this.baiduNextPageHref = "";
            this.getBaiduNextPageHref();
        }
        createContainerElement() {
            return `<div id = "${this.BAIDU_PAGE_NUMBER_CONTAINER_NAME}"><div>`;
        }
        createPrePageElement() {
            let selectedLable = this.Page.getPageNumberSelectedLabel();
            let order = selectedLable - 1;
            let template = `<div class="bd-none bd_page_item bd_page_pre_page"></div>`;
            if (order >= 1) {
                template = `<a class="bd_page_item bd_page_pre_page"><span order="${order}"}"><上一页</span></a>`;
            }
            return template;
        }
        createNextPageElement() {
            let selectedLable = this.Page.getPageNumberSelectedLabel();
            let order = selectedLable + 1;
            let template = `<a class="bd_page_item bd_page_next_page"><span order="${order}"}">下一页></span></a>`;
            return template;
        }
        createPageNumberElement() {
            let selectedLable = this.Page.getPageNumberSelectedLabel();
            let startLable = this.Page.getPageNumberStartLabel();
            let endLable = startLable + 10;
            let content = "";
            for (let order = startLable; order < endLable; order++) {
                let additionClassName = "";
                if (order == selectedLable) {
                    additionClassName = "bd_page_number_selected";
                }
                let template = `<a  class="bd_page_item bd_page_number ${additionClassName}"><span order="${order}"}">${order}</span></a>`;
                content += template;
            }
            return content;
        }
        getBaiduNextPageHref() {
            if (this.baiduNextPageHref == "") {
                let tempURL = $("#page a").first().attr("href");
                this.baiduNextPageHref = String(tempURL);
            }
        }
        addClickEvent($container) {
            let selector = "#" + this.BAIDU_PAGE_NUMBER_CONTAINER_NAME;
            $container.on("click", "span", (event) => {
                event = event || window.event;
                let order = $(event.target).attr("order");
                let $element = $("#page>div>*").eq(Number(order) - 1);
                let href = $element.attr("href");
                if (href != "") {
                    window.open($element.attr("href"), "_self");
                }
            });
        }
        getPageNumberContainer() {
            let $container = $(this.createContainerElement());
            $container.append(this.createPrePageElement());
            $container.append(this.createPageNumberElement());
            $container.append(this.createNextPageElement());
            this.addClickEvent($container);
            return $container;
        }
    }
    class FixSearchToolbar {
        getNewURL(url) {
            let search = new BaiduSearch();
            let keyword = url.getParamValue("wd");
            search.addSearchKeyword(keyword).addRN(30).openRandonNumber();
            if (url.hasParam("si")) {
                let siValue = url.getParamValue("si");
                search.addParam("si", siValue);
            }
            return search.getFinalURL();
        }
        refresh() {
        }
        refresh_null() {
            let url = new UrlEditor(location.href);
            console.log(url.getFinalUrl());
            if (!url.hasParam("random")) {
                let temp = String(cleanURL(url));
                location.href = temp;
            }
            function cleanURL(url) {
                let search = new BaiduSearch();
                let keyword = url.getParamValue("wd");
                search.addSearchKeyword(keyword).addRN(30).openRandonNumber();
                if (url.hasParam("si")) {
                    search.addParam("si", url.getParamValue("si"));
                    search.addParam("ct", url.getParamValue("ct"));
                }
                if (url.hasParam("gpc")) {
                    search.addParam("gpc", url.getParamValue("gpc"));
                }
                return search.getFinalURL();
            }
        }
        observer() {
            window.onload = () => {
                let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
                if (!!MutationObserver) {
                    let observer = new MutationObserver(this.refresh_null);
                    let wrapper = document.querySelector("#form");
                    let observerConfig = {
                        childList: true,
                        subtree: true,
                    };
                    observer.observe(wrapper, observerConfig);
                }
                else {
                    console.error("百度搜索-优化: 浏览器不兼容 MutationObserver 接口, 请升级浏览器版本");
                }
            };
        }
        start() {
            this.observer();
        }
    }
    class ScrollToTop {
        isInputTarget(event) {
            return $(event.target).prop("tagName") == "INPUT" ? true : false;
        }
        bindScrollToTopEvent() {
            let $selector = $(".s_form ");
            $selector.off("click").on("click", (event) => {
                if (this.isInputTarget(event)) {
                    event.stopPropagation();
                    return;
                }
                let element = document.documentElement;
                let body = document.body;
                let node = element.scrollTop ? element : body;
                let top = node.scrollTop;
                let step = top / 20;
                let timer = setInterval(() => {
                    if (node.scrollTop <= 0) {
                        node.scrollTop = 0;
                        clearInterval(timer);
                    }
                    node.scrollTop -= step;
                }, 10);
                return false;
            });
        }
        start() {
            this.bindScrollToTopEvent();
        }
    }
    class ShortcutKey {
        constructor() {
            this.KEY_ENTER = 13;
            this.KEY_ALT = 18;
            this.KEY_SHIFT = 16;
            this.KEY_CTRL = 17;
            this.KEY_GOOGLE = "G";
        }
        googleSeach() {
            let google = new UrlEditor("https://www.google.com/search?q=%s");
            let url = new UrlEditor(location.href);
            let searchWord = url.getParamValue("wd");
            google.setParam("q", searchWord);
            location.href = google.getFinalUrl();
        }
        notAdditonKeyup(event) {
            if (!event.altKey &&
                !event.shiftKey &&
                !event.ctrlKey &&
                !event.metaKey) {
                return true;
            }
            else {
                return false;
            }
        }
        isInputKeyup(event) {
            let inputClassName = "bd-barbox-input";
            if ($(event.target).hasClass(inputClassName)) {
                return true;
            }
            else {
                return false;
            }
        }
        bingShortcutKeyEvent() {
            $(document).off("keyup").on("keyup", (event) => {
                let keyCode = event.keyCode || event.which || event.charCode;
                if (this.isInputKeyup(event)) {
                    return false;
                }
                if (keyCode ==
                    this.KEY_GOOGLE.toUpperCase().charCodeAt(0) && this.notAdditonKeyup(event)) {
                    this.googleSeach();
                }
            });
        }
        start() {
            this.bingShortcutKeyEvent();
        }
    }
    class Sidebar {
        constructor() {
            this.SideToolBar = new SideToolBarModel.SideToolBar();
            this.SideToolBarSwitch = new SideToolBarSwitch();
        }
        insertSidebarHTML() {
            let $container = $("#head");
            let $sideToolbar = this.SideToolBar.getSideToolBar();
            $container.after($sideToolbar);
        }
        start() {
            if (this.SideToolBarSwitch.isEnable())
                this.insertSidebarHTML();
        }
    }
    class BaiduIndexFactory {
        create() {
            let page = new Baidu();
            page.add(IndexPageInjectStyles);
            page.addDelayAndReady(IndexPageAddSearchForm);
            page.execute();
        }
    }
    class BaiduResultFactory {
        create() {
            let page = new Baidu();
            page.add(ResultPageInjectStyles);
            page.addDelayAndReady(ResultPageAddSearchForm);
            page.addDelayAndReady(CustomMenu);
            page.addReady(LayoutControl);
            page.addReady(ScrollToTop);
            page.addReady(Sidebar);
            page.addReady(ShortcutKey);
            page.execute();
            useObserver();
        }
    }
    function mutationfunc() {
        let avoidMulExecute = new AvoidMulExecute();
        if (avoidMulExecute.hasSign()) {
            return;
        }
        avoidMulExecute.setSign();
        location.href = location.href;
    }
    function useObserver() {
        window.onload = () => {
            let avoidMulExecute = new AvoidMulExecute();
            avoidMulExecute.setSign();
            let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            if (!!MutationObserver) {
                let observer = new MutationObserver(mutationfunc);
                let wrapper = document.querySelector("#wrapper");
                let observerConfig = {
                    childList: true,
                    subtree: true
                };
                observer.observe(wrapper, observerConfig);
            }
            else {
                console.error("百度搜索-优化: 浏览器不兼容 MutationObserver 接口, 请升级浏览器版本");
            }
        };
    }
    function cleanURL(url) {
        let search = new BaiduSearch();
        let keyword = url.getParamValue("wd");
        search.addSearchKeyword(keyword).addRN(30).openRandonNumber();
        if (url.hasParam("si")) {
            search.addParam("si", url.getParamValue("si"));
            search.addParam("ct", url.getParamValue("ct"));
        }
        if (url.hasParam("gpc")) {
            search.addParam("gpc", url.getParamValue("gpc"));
        }
        return search.getFinalURL();
    }
    function tidySearchLink() {
        let url = new UrlEditor(location.href);
        if (!url.hasParam("rn")) {
            url.setParam("rn", "30");
            location.href = url.getFinalUrl();
        }
    }
    const IndexPageRouters = ["https://www.baidu.com/", "https://www.baidu.com/#", "http://ipv6.baidu.com/", "https://ipv6.baidu.com/"];
    const ResultPagesRouters = ["https://www.baidu.com/s", "https://www.baidu.com/baidu"];
    let router = new Router();
    router.addRoute(IndexPageRouters, new BaiduIndexFactory());
    router.addRoute(ResultPagesRouters, new BaiduResultFactory());
})();










