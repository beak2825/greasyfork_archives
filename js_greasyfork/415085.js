// ==UserScript==
// @name         【省一省】双11超级红包!优惠券+返现+抢购秒杀助手--任意网站抢购、秒杀、抢券等，支持淘宝、天猫、京东、唯品会、考拉海购领券，配合APP扫码下单后即可获得返现!!!。
// @namespace    cyzlizhe
// @version      5.3
// @description  【抢购秒杀助手】任意网站抢购、秒杀、抢券等，支持自建秒杀方案、从论坛导入秒杀方案，非常灵活。【领券+返现】在淘宝、天猫、京东、唯品会、考拉海购的‘商品搜索页’和‘商品详情页’上显示优惠券及返现，功能简单，显示直观，在商品详情页通过「花前省一省」APP扫码，直接在APP进入商品、领券及获得返现。
// @author       cyzlizhe
// @icon         https://s3.ax1x.com/2020/12/15/rKQCod.png
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @match        *://*.tmall.hk/*
// @match        *://*.liangxinyao.com/*
// @match        *://*.jd.com/*
// @match        *://*.jd.hk/*
// @match        *://*.vip.com/*
// @match        *://*.kaola.com/*
// @match        *://*.suning.com/*
// @match        *://*.fengwd.com/*
// @match        https://*/*
// @match        http://*/*
// @exclude      *://login.taobao.com/*
// @exclude      *://pages.tmall.com/*
// @exclude      *://uland.taobao.com/*
// @exclude      *://uland.taobao.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.6.3/jquery.js
// @require      https://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/apexcharts/3.9.0/apexcharts.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/sweetalert/2.1.2/sweetalert.min.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @noframes    true
// @connect     taobao.com
// @connect     gwdang.com
// @connect     jd.com
// @connect     suning.com
// @connect     pinduoduo.com
// @connect     vmall.com
// @connect     mi.com
// @connect     youyizhineng.top
// @antifeature referral-link 【应GreasyFork代码规范要求：含有优惠券查询功能的脚本必须添加此提示！】
// @note    2021年01月19日10:48:42 bug修复，新增年货节超级红包，调整以适应更多方案。
// @note    2021年01月13日11:10:04 界面调整
// @note    2021年01月11日11:08:31 1.设置中悬浮球可以选择白名单或者黑名单屏蔽 2.优化返现显示逻辑 3.其他底层优化
// @note    2020年12月31日11:15:32 1.修复设置持续时间不起作用的bug 2.插件调整，以适应捡漏模式 3.增加抢购助手使用说明 4.增加立即执行按钮，可以立即执行方案。
// @note    2020年12月22日22:05:43 优化淘宝快速下单预置方案，新增对天猫超市world页面的支持。
// @note    2020年12月15日11:05:02 全新版本，全新出发，新增抢购秒杀助手，返利机器人。
// @downloadURL https://update.greasyfork.org/scripts/411085/%E3%80%90%E7%9C%81%E4%B8%80%E7%9C%81%E3%80%91%E5%8F%8C11%E8%B6%85%E7%BA%A7%E7%BA%A2%E5%8C%85%21%E4%BC%98%E6%83%A0%E5%88%B8%2B%E8%BF%94%E7%8E%B0%2B%E6%8A%A2%E8%B4%AD%E7%A7%92%E6%9D%80%E5%8A%A9%E6%89%8B--%E4%BB%BB%E6%84%8F%E7%BD%91%E7%AB%99%E6%8A%A2%E8%B4%AD%E3%80%81%E7%A7%92%E6%9D%80%E3%80%81%E6%8A%A2%E5%88%B8%E7%AD%89%EF%BC%8C%E6%94%AF%E6%8C%81%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E5%94%AF%E5%93%81%E4%BC%9A%E3%80%81%E8%80%83%E6%8B%89%E6%B5%B7%E8%B4%AD%E9%A2%86%E5%88%B8%EF%BC%8C%E9%85%8D%E5%90%88APP%E6%89%AB%E7%A0%81%E4%B8%8B%E5%8D%95%E5%90%8E%E5%8D%B3%E5%8F%AF%E8%8E%B7%E5%BE%97%E8%BF%94%E7%8E%B0%21%21%21%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/411085/%E3%80%90%E7%9C%81%E4%B8%80%E7%9C%81%E3%80%91%E5%8F%8C11%E8%B6%85%E7%BA%A7%E7%BA%A2%E5%8C%85%21%E4%BC%98%E6%83%A0%E5%88%B8%2B%E8%BF%94%E7%8E%B0%2B%E6%8A%A2%E8%B4%AD%E7%A7%92%E6%9D%80%E5%8A%A9%E6%89%8B--%E4%BB%BB%E6%84%8F%E7%BD%91%E7%AB%99%E6%8A%A2%E8%B4%AD%E3%80%81%E7%A7%92%E6%9D%80%E3%80%81%E6%8A%A2%E5%88%B8%E7%AD%89%EF%BC%8C%E6%94%AF%E6%8C%81%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E5%94%AF%E5%93%81%E4%BC%9A%E3%80%81%E8%80%83%E6%8B%89%E6%B5%B7%E8%B4%AD%E9%A2%86%E5%88%B8%EF%BC%8C%E9%85%8D%E5%90%88APP%E6%89%AB%E7%A0%81%E4%B8%8B%E5%8D%95%E5%90%8E%E5%8D%B3%E5%8F%AF%E8%8E%B7%E5%BE%97%E8%BF%94%E7%8E%B0%21%21%21%E3%80%82.meta.js
// ==/UserScript==

(function () {
    "use strict";
    var $2 = $.noConflict();
    var version = GM_info.script.version;
    // Your code here...

    //清除任务 若工作不正常，把下面三行注释打开随便打开一个网页，然后再注释上即可
    // GM_setValue('obj_plans', null);
    // GM_setValue('virtualCookie', null);
    // return

    var obj = {};
    var query_item_list = '';
    var query_data_list_back = '';
    var check_url = '';
    var stop = '';

    //加载屏蔽网址
    var blockUrl = GM_getValue('blockUrl', '');
    console.log(blockUrl);
    var passUrl = GM_getValue('passUrl', '');
    console.log(passUrl);
    var BWlist_sel = GM_getValue('BWlist_sel', '');
    if (BWlist_sel == '') {
        GM_setValue('BWlist_sel', 'white_mode');
        BWlist_sel = 'white_mode';
    }
    // BWlist_sel = 'white_mode';
    //#region css样式
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = '.coupon-wrap{margin:10px 0 5px 0;color:#fff}.coupon-wrap-rm{margin:1px 0 5px 0;overflow:hidden;color:#000}.coupon-wrap-qr{margin:1px 0 8px 0;overflow:hidden;color:#000}.coupon-wrap-trend{margin:1px 0 0 0;overflow:hidden;color:#000;display:none}.coupon-wrap-price{margin:1px 0 0 0;overflow:hidden;color:#000}.coupon-wrap-trend{margin:1px 0 0 0;overflow:hidden;color:#000;display:none}.coupon-wrap .coupon{background-image:linear-gradient(150deg,#f90,#f69);display:inline-flex;color:white;position:relative;padding-left:.5rem;padding-right:.5rem;border-top-right-radius:.3rem;border-bottom-right-radius:.3rem;overflow:hidden}.coupon-wrap .coupon::before{left:-7px;content:"";position:absolute;top:0;height:100%;width:14px;background-image:radial-gradient(white 0,white 4px,transparent 4px);background-size:14px 14px;z-index:1;background-position:0 2px;background-repeat:repeat-y}.coupon-wrap .coupon .coupon-info{border-right:2px dashed white;padding-left:20px;padding-top:20px;padding-bottom:20px;position:relative;min-width:200px;font-size:14px}.coupon-wrap .coupon .coupon-info::before,.coupon-wrap .coupon .coupon-info::after{content:"";width:20px;height:20px;background-color:white;position:absolute;right:-11px;border-radius:50%}.coupon-wrap .coupon .coupon-info::before{top:-10px}.coupon-wrap .coupon .coupon-info::after{bottom:-10px}.coupon-wrap .coupon .coupon-info .coupon-desc{font-size:18px}.coupon-wrap .coupon .coupon-get{display:flex;justify-content:center;align-items:center;flex-direction:column;min-width:100px;position:relative;font-size:20px;color:#fff;padding:20px}#tb-cool-area{border:1px solid #eee;margin:0 auto;position:relative;clear:both;display:none}#tb-cool-area .tb-cool-area-home{position:absolute;top:5px;right:10px;z-index:88}#tb-cool-area .tb-cool-area-home a{cursor:pointer;color:#515858;font-size:10px;text-decoration:none}#tb-cool-area .tb-cool-area-home a.new-version{color:#ff0036}#tb-cool-area .tb-cool-area-benefit{width:240px;float:left}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-qrcode{text-align:center;min-height:150px;margin-top:40px}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-qrcode canvas,#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-qrcode img{margin:0 auto}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-title{margin-top:20px;color:#000;font-size:14px;font-weight:700;text-align:center}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-title span{color:#ff0036;font-weight:700}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-action{margin-top:10px;text-align:center}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-action a{text-decoration:none}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-action .tb-cool-quan-button{min-width:120px;padding:0 8px;line-height:35px;color:#fff;background:#ff0036;font-size:13px;font-weight:700;letter-spacing:1.5px;margin:0 auto;text-align:center;border-radius:15px;display:inline-block;cursor:pointer}#tb-cool-area .tb-cool-area-benefit .tb-cool-quan-action .tb-cool-quan-button.quan-none{color:#000;background:#bec5c5}#tb-cool-area .tb-cool-area-history{height:300px;overflow:hidden;position:relative}#tb-cool-area .tb-cool-area-history #tb-cool-area-chart,#tb-cool-area .tb-cool-area-history .tb-cool-area-container{width:100%;height:100%}#tb-cool-area .tb-cool-area-history .tb-cool-history-tip{position:absolute;margin:0;top:50%;left:50%;letter-spacing:1px;font-size:15px;transform:translateX(-50%) translateY(-50%)}#tb-cool-area .tb-cool-area-table{margin-top:10px;position:relative;overflow:hidden}#tb-cool-area .tb-cool-quan-tip{position:absolute;margin:0;top:50%;left:50%;letter-spacing:1px;font-size:15px;opacity:0;transform:translateX(-50%) translateY(-50%)}#tb-cool-area .tb-cool-quan-tip a{color:#333;font-weight:400;text-decoration:none}#tb-cool-area .tb-cool-quan-tip a:hover{color:#ff0036}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table{width:100%;font-size:14px;text-align:center}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table tr td{padding:4px;color:#1c2323;border-top:1px solid #eee;border-left:1px solid #eee}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table tr td span{color:#ff0036;font-weight:700}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table tr td:first-child{border-left:none}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table .tb-cool-quan-link{width:60px;line-height:24px;font-size:12px;background:#ff0036;text-decoration:none;display:inline-block}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table .tb-cool-quan-link-enable{cursor:pointer;color:#fff}#tb-cool-area .tb-cool-area-table .tb-cool-quan-table .tb-cool-quan-link-disable{cursor:default;color:#000;background:#ccc}#tb-cool-area .tb-cool-quan-empty .tb-cool-quan-tip{opacity:1}#tb-cool-area .tb-cool-quan-empty .tb-cool-quan-table{filter:blur(3px);-webkit-filter:blur(3px);-moz-filter:blur(3px);-ms-filter:blur(3px)}.tb-cool-box-area{position:absolute;top:20px;right:0;z-index:87}.tb-cool-box-area-rm{position:absolute;top:50px;right:0;z-index:87}' +
        '.tb-cool-box-wait{cursor:pointer}.tb-cool-box-wait-rm{cursor:pointer}.tb-cool-box-already{position:relative}.tb-cool-box-info{width:auto!important;height:auto!important;padding:6px 8px!important;font-size:12px;color:#fff!important;border-radius:15px 0 0 15px;cursor:pointer;user-select:none}.tb-cool-box-info,.tb-cool-box-info:hover,.tb-cool-box-info:visited{text-decoration:none!important}.tb-cool-box-info-default{background:#3186fd!important}.tb-cool-box-info-find{background:#ff0036!important}.tb-cool-box-info-find-rm{background-image:linear-gradient(#ffd000,#fcea9e)!important;color:#000!important}.tb-cool-box-info-empty{color:#000!important;background:#ccc!important}.tb-cool-box-info-translucent{opacity:.33}.mui-zebra-module .tb-cool-box-info{font-size:10px}.import-shangou-itemcell .tb-cool-box-area,.zebra-ziying-qianggou .tb-cool-box-area{right:10px;left:auto}.item_s_cpb .tb-cool-box-area{top:auto;bottom:10px}.j-mdv-chaoshi .m-floor .tb-cool-box-area a{width:auto;height:auto}.left-wider .proinfo-main{margin-bottom:40px}.detailHd .m-info{margin-bottom:20px}.tb-cool-quan-date{color:#233b3d;font-weight:400;font-size:12px}.tb-cool-area-has-date .tb-cool-quan-qrcode{margin-top:30px!important}.tb-cool-area-has-date .tb-cool-quan-title{margin-top:10px!important}.rm-div{-webkit-tap-highlight-color:rgba(0,0,0,0);line-height:1.42857143;color:#333;font-size:12px!important;font-family:"Open Sans",Arial,sans-serif;box-sizing:border-box;position:relative;min-height:1px;padding-right:15px;padding-left:0;float:left;width:350px}.rm-div span{-webkit-tap-highlight-color:rgba(0,0,0,0);font-family:"Open Sans",Arial,sans-serif;box-sizing:border-box;text-decoration:none;margin-bottom:0;font-weight:normal;text-align:left;white-space:nowrap;vertical-align:middle;touch-action:manipulation;user-select:none;background-image:none;background-color:#ffd000;padding:0 0 0 8px;line-height:30px;display:inline-block;width:215px;letter-spacing:.6px;font-size:16px;-webkit-font-smoothing:subpixel-antialiased;transition:border .25s linear,color .25s linear,background-color .25s linear;color:#000;border:0;border-radius:99px 0 0 99px;float:left}.rm-div .rm-btn{-webkit-tap-highlight-color:rgba(0,0,0,0);font-family:"Open Sans",Arial,sans-serif;box-sizing:border-box;text-decoration:none;margin-bottom:0;font-weight:normal;text-align:left;white-space:nowrap;vertical-align:middle;touch-action:manipulation;cursor:pointer;user-select:none;background-image:none;background-color:#ffd000;padding:0 0 0 8px;line-height:30px;display:inline-block;width:120px;letter-spacing:.6px;font-size:16px;-webkit-font-smoothing:subpixel-antialiased;transition:border .25s linear,color .25s linear,background-color .25s linear;color:#000;border:0;border-radius:99px 0 0 99px;float:left;background-color:#fff;border-radius:0 99px 99px 0;border:1px solid #c2baba;padding:0 0 0 8px;line-height:28.2px}.rm-div .trend-btn{-webkit-tap-highlight-color:rgba(0,0,0,0);font-family:"Open Sans",Arial,sans-serif;box-sizing:border-box;text-decoration:none;font-weight:normal;text-align:left;white-space:nowrap;vertical-align:middle;touch-action:manipulation;cursor:pointer;user-select:none;background-image:none;background-color:#ff0036!important;padding:0 0 0 8px;line-height:30px;display:inline-block;width:140px;letter-spacing:.6px;font-size:16px;-webkit-font-smoothing:subpixel-antialiased;transition:border .25s linear,color .25s linear,background-color .25s linear;color:#fff;border:0;border-radius:99px 99px 99px 99px!important;float:left;background-color:#fff;border-radius:0 99px 99px 0;padding:0 0 0 8px;line-height:27px}.rm-div .trend-btn-img{max-height:15px;vertical-align:middle!important}.float_div{width:200px;height:200px;background-color:red;position:absolute;top:100px;left:100px;float:left;z-index:99999}.qr-code-div{width:440px;border-radius:10px;display:inline-block}.trend-div{width:440px;border-radius:10px;display:inline-block}#qrcode{display:inline}.qr-code-div .title{float:right;font-size:13px;width:280px}.qr-code-div .foot{font-size:12px;text-align:middle;width:100%}.qr-code-div .qr-img{height:150px;width:150px}.frame_div{position:fixed;width:700px;height:450px;z-index:999999999;display:none;background-color:#fff;border-radius:10px;border:1px solid #c2baba;padding:15px;left:0;top:0;right:0;bottom:0;-webkit-box-shadow:#666 0 0 10px;-moz-box-shadow:#666 0 0 10px;box-shadow:#666 0 0 10px}#iframe_check{position:relative;height:100%;width:100%}.image-status{margin-left:10px;position:absolute;top:50%;transform:translateY(-50%);height:20px}.status-span{margin-left:35px;position:absolute;top:50%;transform:translateY(-50%)}.frame_div .cover{position:absolute;border-radius:10px;text-align:center;top:0;right:0;height:85px;width:100%;background-color:#fff;font-size:20px}.frame_div .cover img{text-align:center;height:45px;background-color:#fff;font-size:40px}.cover-close{position:absolute;top:0;right:0;height:40px;cursor:pointer}' +
        '.cover-chart-span{position:absolute;text-align:center;line-height:200px;height:200px}#chart{min-height:215px;margin-bottom:-20px}.div-helper-box .butyInput,.div-helper-box a,.div-helper-box select{font-size:12px;border:1px solid #ccc;padding:4px 0;border-radius:3px;padding-left:5px;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);-webkit-transition:border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;-o-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}#imgPlanInfo{height:16px;width:16px;vertical-align:middle}.div-helper-box .butyInput:focus,.div-helper-box a:focus,.div-helper-box select:focus{border-color:#25a765;outline:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(102,175,233,0.6);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(102,175,233,0.6)}.div-helper-box{margin-top:5px;font-size:12px}.div-helper-box button{width:80px;height:35px;border-width:0;border-radius:5px;background:#25a765;cursor:pointer;outline:0;font-family:Microsoft YaHei;color:white;font-size:16px}.div-helper-box button:hover{background:#fc0;color:black}#button_delTask,#button_syn,#button_delPlan,#button_saveThisPage,#save_temporaryBlock,#temporaryBlock,#passThisPage,#permanentlyBlock,#button_saveSetting,#button_capture,#button_getCurrentTime,#button_newPlan,#importFromBbs,#shareToBbs,#button_editPlan,#button_exportPlan,#button_importPlan{background-color:#1e90ff;width:70px;height:25px;font-size:12px;font-weight:400!important;padding:0!important}#start_buy,#planCompleted{font-weight:400!important;padding:0!important}.dynamicDIV{vertical-align:baseline;border-bottom:1px solid #d6d6d6;font-size:12px}.dynamicSpan{vertical-align:middle;width:150px;display:inline-block;overflow:hidden;text-overflow:ellipsis;-o-text-overflow:ellipsis;white-space:nowrap;font-size:12px}.dynamicInput{vertical-align:middle;border-bottom:1px solid #12be02;border-top:0;border-left:0;border-right:0;width:150px;font-size:12px}.dynamicHostSpan{display:block;text-align:center;color:#000;background-color:#e0ffef;border-radius:10px}#button_add_mjd{display:none;background-color:#f30213;color:#fff;width:100px;height:25px;font-size:12px}#button_add_refresh{background-color:#f30213;color:#fff;width:80px;height:25px;font-size:12px;font-weight:400!important;padding:0!important}.swal_info,.swal-overlay{z-index:9999999999} .swal_info .swal-overlay{z-index:999999999;}.swal_info .swal-modal{z-index:999999999;background-color:rgba(63,255,106,0.69);border:3px solid white}.swal_info .swal-title{margin:0;font-size:16px;box-shadow:0 1px 1px rgba(0,0,0,0.21);margin-bottom:28px;background-color:#fc0;color:#000;border-radius:5px 5px 0 0}.swal_info .swal-text{background-color:#edffeb;padding:17px;border:1px solid #000;display:block;margin:22px;text-align:center;color:#25a765;border-radius:5px;font-weight:600;text-align:left}.swal_info .swal-footer{background-color:#f5f8fa;margin-top:32px;border-top:1px solid #e9eef1;overflow:hidden}.swal_info .swal-button--confirm{background-color:#f30213}#float_assistant{padding:3px;background-color:#fff;border:1px;border-radius:10px;position:fixed;top:8em;right:1em;text-align:left;display:inline-block;z-index:9999999;box-shadow:0 0 15px #4e4e4e} .callout{z-index:999;position:relative;width:150px;border:1px solid #f82800;background:#fff;border-radius:5px;margin-top:.5em !important;text-align:center}.callout::before{background-color: #f6792f;z-index:-1;content:"";position:absolute;top:-.41em;left:30px;padding:.35em;border:inherit;border-right:0;border-bottom:0;transform:rotate(45deg)}'
    document.getElementsByTagName("head").item(0).appendChild(style);

    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = '@charset "utf-8";.demo{width:410px;margin:0 auto}.stamp *{padding:0;margin:0;list-style:none;font-family:"Microsoft YaHei","Source Code Pro",Menlo,Consolas,Monaco,monospace}.stamp{width:340px;height:110px;padding:0 10px;position:relative;}.stamp:before{content:"";position:absolute;top:0;bottom:0;left:10px;right:10px;z-index:-1}.stamp i{position:absolute;left:20%;top:45px;height:190px;width:390px;background-color:rgba(255,255,255,.15);transform:rotate(-30deg);pointer-events:none}.stamp .par{float:left;padding:10px 10px;width:180px;border-right:2px dashed rgba(255,255,255,.3);text-align:left;height:90px}.stamp .par p{color:#fff;font-size:16px;line-height:21px}.stamp .par span{font-size:40px;color:#fff;margin-right:5px;line-height:65px}.stamp .par .sign{font-size:25px}.stamp .par sub{position:relative;color:rgba(255,255,255,.8)}.stamp .copy{display:inline-block;padding:21px 14px;width:100px;vertical-align:text-bottom;font-size:30px;color:#fff;text-align:center;line-height:initial}.stamp .copy p{font-size:16px;margin-top:15px}.stamp01{background:radial-gradient(rgba(0,0,0,0) 0,rgba(0,0,0,0) 5px,#f39b00 5px);background-size:15px 15px;background-position:9px 3px}.stamp01:before{background-color:#f39b00}.stamp02{background:radial-gradient(transparent 0,transparent 5px,#d24161 5px);background-size:15px 15px;background-position:9px 3px}.stamp02:before{background-color:#d24161}.stamp03{background:radial-gradient(transparent 0,transparent 5px,#7eab1e 5px);background-size:15px 15px;background-position:9px 3px}.stamp03:before{background-color:#7eab1e}.stamp03 .copy{padding:10px 6px 10px 12px;font-size:24px}.stamp03 .copy p{font-size:14px;margin-top:5px;margin-bottom:8px}.stamp03 .copy a{background-color:#fff;color:#333;font-size:14px;text-decoration:none;padding:5px 10px;border-radius:3px;display:block}.stamp04{width:320px;background:radial-gradient(rgba(0,0,0,0) 0,rgba(0,0,0,0) 4px,#f5610b 4px);border-radius:3px}.stamp04:before{background-color:#f5610b;left:5px;right:5px}.stamp04 .copy{padding:8px 4px 8px 10px;font-size:20px}.stamp04 .copy p{font-size:12px;margin-top:3px;margin-bottom:5px}.stamp04 .copy a{background-color:#fff;color:#333;font-size:14px;text-decoration:none;padding:5px 10px;border-radius:3px;display:block;z-index:200}';
    document.getElementsByTagName("head").item(0).appendChild(style);

    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = 'div.card-tabs-bar a{padding:5px;padding-bottom:1px;border:1px solid transparant;color:#575b66;text-decoration:none;margin-left:5px;outline:0}div.card-tabs-bar a:first-child{margin-left:10px}div.card-tabs-bar a:hover{text-decoration:underline}div.card-tabs-bar a.active{border-bottom:0;display:inline-block;color:black;font-weight:bold;border-radius:4px 4px 0 0;padding-top:6px;margin-bottom:-10px;background:#fff}div.card-tabs-bar a.active:hover{text-decoration:none}div.card-tabs-bar.titles{margin-top:-10px}div.card-tabs-bar.titles a{font-size:17px}div.card-tabs-stack div[data-tab]{display:none;border-top:0;padding:10px}div.card-tabs-stack div[data-tab]:first-child{display:block}div.card-tabs-bar.inset{border-bottom:1px solid #e5e5e5;border-radius:3px}div.card-tabs-bar.inset a.active{background-color:#fafafa;box-shadow:inset 0 0 10px rgba(0,0,0,0.05)}div.card-tabs-stack.inset div[data-tab]{padding:10px;border-top:0;border-radius:3px;box-shadow:inset 0 0 10px rgba(0,0,0,0.05)}div.card-tabs-bar.graygreen{border-bottom:1px solid #e5e5e5}div.card-tabs-bar.graygreen a{padding:15px;border-radius:0;margin:0;padding-bottom:10px;margin-bottom:-2px;font-size:17px}div.card-tabs-bar.graygreen a.active{background-color:#fafafa;border-top:4px solid #2cc185}div.card-tabs-stack.graygreen div[data-tab]{padding:10px;background-color:#fafafa;border:1px solid #e5e5e5;border-top:0}div.card-tabs-bar.wiki{border-radius:0;text-align:left;display:inline-block}div.card-tabs-bar.wiki a{display:inline-block;vertical-align:baseline;border-radius:0;margin:0;padding-bottom:10px;margin-bottom:-1px;margin-left:2px;font-size:12px;background:#fefefe;background:-moz-linear-gradient(top,#fefefe 0,#fdcd97 100%);background:-webkit-linear-gradient(top,#fefefe 0,#fdcd97 100%);background:linear-gradient(to bottom,#fefefe 0,#fdcd97 100%);border-top:#ff8700 1px solid;border-left:#ff8700 1px solid;border-right:#ff8700 1px solid;cursor: pointer}div.card-tabs-bar.wiki a:first-child{border-left:#ff8700 1px solid;margin-left:0}div.card-tabs-bar.wiki a:last-child{border-right:#ff8700 1px solid}div.card-tabs-bar.wiki a.active{border-top:1px solid #ff8700;border-left:1px solid #ff8700;border-right:1px solid #ff8700;background:white;border-bottom:1px solid white}div.card-tabs-stack.wiki div[data-tab]{display:"none"!important;width:fit-content;width:-webkit-fit-content;width:-moz-fit-content;padding:13px;border:1px solid #ff8700;border-radius:0 8px 8px 8px;text-align:left;background-color:white}';
    document.getElementsByTagName("head").item(0).appendChild(style);
    //#endregion
    obj.get_date_now_ms = function () {
        if (typeof (Date.now()) == "number") {
            return Date.now();
        } else if (typeof (Date.now()) == "object") {
            console.log(Date.now().getTime());
            return Date.now().getTime();
        } else {
            return Date.now();
        }
    }
    // 对Date的扩展，将 Date 转化为指定格式的String   
    // 月(M)、日(d)、小时(H)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
    // 例子：   
    // (new Date()).Format("yyyy-MM-dd HH:mm:ss.S") ==> 2006-07-02 08:09:04.423   
    // (new Date()).Format("yyyy-M-d H:m:s.S")      ==> 2006-7-2 8:9:4.18   
    Date.prototype.Format = function (fmt) { //author: meizz   
        var o = {
            "M+": this.getMonth() + 1,                 //月份   
            "d+": this.getDate(),                    //日   
            "h+": this.getHours(),                   //小时   
            "m+": this.getMinutes(),                 //分   
            "s+": this.getSeconds(),                 //秒   
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
            "S": this.getMilliseconds()             //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    console.log('▽载入时间▽');
    console.log(obj.get_date_now_ms());
    obj.swal_info = function (title, text, button, Func) {
        if (!arguments[0]) title = "SYS-抢购助手提醒";
        if (!arguments[2]) button = "确认";
        swal({
            className: "swal_info",
            title: title,
            text: text,
            button: button,
        }).then((value) => {
            if (value == null) return;
            if (typeof (Func) == 'function') {
                Func();
            }
        });
    }
    obj.swal_fadeAway = function (text, time_ms) {
        if (!arguments[1]) time_ms = 1000;
        swal(text, {
            buttons: false,
            timer: time_ms,
        });
    }
    obj.getObjKeys = function (obj) {
        var arry = [];
        for (var i in obj) {
            arry.push(i);
        }
        return arry;
    }
    obj.setVirtualCookie = function (name, active, start_time, theLifeCycle) {
        var virtualCookie = GM_getValue('virtualCookie');
        if (virtualCookie == null) {
            virtualCookie = {};
        }
        if (!virtualCookie.hasOwnProperty(name)) {
            virtualCookie[name] = {};
        }
        if (active != 'keep') {
            virtualCookie[name]['active'] = active;
        }
        if (start_time != 'keep') {
            virtualCookie[name]['start_time'] = start_time;
        }
        if (theLifeCycle != 'keep') {
            virtualCookie[name]['theLifeCycle'] = theLifeCycle;
        }
        virtualCookie[name]['property1'] = '';
        virtualCookie[name]['property2'] = '';
        virtualCookie[name]['property3'] = '';
        GM_setValue('virtualCookie', virtualCookie);
    }
    obj.getVirtualCookieByName = function (name) {
        var virtualCookie = GM_getValue('virtualCookie');
        if (virtualCookie == null) {
            virtualCookie = {};
        }
        if (virtualCookie.hasOwnProperty(name)) {
            return virtualCookie[name];
        } else {
            return null;
        }
    }
    obj.judgmentVirtualCookie = function (name) {
        var judgment = obj.getVirtualCookieByName(name);
        if (judgment == null) {
            return false;
        } else {
            if (obj.get_date_now_ms() - judgment['start_time'] > judgment['theLifeCycle']) {
                obj.setVirtualCookie(name, '0', 'keep', 'keep');
                return false;
            } else {
                return true;
            }
        }
    }

    obj.delVirtualCookie = function (name) {
        console.log('----------判断删除cookie----------');
        console.log(name);
        var del = obj.getVirtualCookieByName(name);
        if (del != null) {
            delete del[name];
        }
        GM_setValue('virtualCookie', del);
    }

    obj.captureButtonClick = function (cssPath, delay) {
        if (cssPath != 'refresh_page') {
            setTimeout(() => {
                try {
                    if (document.querySelector(cssPath)) {
                        document.querySelector(cssPath).click();
                    }
                } catch (e) {
                    console.log('发现异常，请忽略！')
                }
            }, delay);
        } else {
            setTimeout(() => {
                location.reload();
            }, delay);
        }
    }

    //#region 读取抢购助手方案信息
    var obj_plans = GM_getValue('obj_plans');
    if (obj_plans == undefined) {
        var obj_plans = {};
    } else {
        var obj_plans = JSON.parse(obj_plans);
        console.log('▽所有方案▽');
        console.log(obj_plans);
    }

    //针对京东快速下单，做个类似cookie的东东
    var page_type = '';
    if (obj.getVirtualCookieByName('mjdLogin') == null) {
        obj.setVirtualCookie('mjdLogin', '0', '0', 2 * 60 * 60 * 1000);
    }

    if (document.referrer.indexOf("plogin.m.jd.com") > -1) {
        obj.setVirtualCookie('mjdLogin', '1', obj.get_date_now_ms(), 'keep');
    }

    var v_cookie = GM_getValue('virtualCookie');
    console.log('▽所有任务▽');
    console.log(v_cookie);
    //#endregion

    obj.importPlan = function (from, value) {

        // var plan_str = value.replace(/\{/g, "\n{");
        // var plan_str = value.replace(/\}/g, "\n}");
        // plan_str = plan_str.replace(/\[/g, "\n[");
        // plan_str = plan_str.replace(/\]/g, "\n]");
        // plan_str = plan_str.replace(/\,/g, "\n");
        // swal(plan_str);
        if (from == 'plugin') {
            try {
                var obj_plan_tmp = JSON.parse(value);
                var arry_import_planid = obj.getObjKeys(obj_plan_tmp);
                obj_plans[arry_import_planid[0]] = obj_plan_tmp[arry_import_planid[0]];
                GM_setValue("obj_plans", JSON.stringify(obj_plans));
                location.reload();
                swal('导入成功');
            } catch (e) {
                swal(e.message);
            }
        } else if (from == 'bbs') {
            try {

                obj.swal_info('确认导入方案吗？', value, '确认导入', function () {
                    var obj_plan_tmp = JSON.parse(value);
                    var arry_import_planid = obj.getObjKeys(obj_plan_tmp);
                    obj_plans[arry_import_planid[0]] = obj_plan_tmp[arry_import_planid[0]];
                    GM_setValue("obj_plans", JSON.stringify(obj_plans));
                    location.reload();
                    swal('导入成功');
                })
            } catch (e) {
                swal(e.message);
            }
        }
    }

    //#region 趋势图参数
    var chart;
    var options = {
        title: { // 显示折现图的title
            text: '花前省一省-商品历史价格走势图',
            fontSize: '12px'
        },
        markers: {
            size: 0,
            colors: ['#fbb5b0'],
        },
        chart: {
            height: 200,
            width: "100%",
            type: "area",
            animations: {
                initialAnimation: {
                    enabled: false
                }
            }
        },
        series: [
            {
                name: "价格",
                data: []
            }
        ],
        xaxis: {
            type: "datetime",
            labels: {
                datetimeFormatter: {
                    year: 'yyyy',
                    month: 'MM \-yy',
                    day: 'yyyy-MM-dd',
                    hour: 'HH:mm'
                }
            }
        },
        stroke: {
            curve: 'smooth',
            width: [0.5, 0.5, 0.5]
        },
        colors: ['#F44336'],
        dataLabels: {
            enabled: false,
            style: {
                colors: ['#000000']
            }
        },
        tooltip: {
            x: {
                format: 'yyyy-MM-dd'
            },
            y: [{
                formatter: function (y) {
                    if (typeof y !== "undefined") {
                        return y.toFixed(0) + "元";
                    }
                    return y;
                }
            }]
        }
    }
    //#endregion
    obj.getNewVersion = function () {
        var get_ver_url;
        get_ver_url = "https://www.youyizhineng.top/query_coupon/get_version.php";

        GM_xmlhttpRequest({
            url: get_ver_url,
            method: 'GET',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'public'
            },
            onload: function (xhr) {
                const json = JSON.parse(xhr.responseText);
                const data = json;
                if (version < data.ver) {
                    $2("#pluginUpdate").css("display", "block");
                    $2("#pluginUpdate").css("color", data.color);
                    $2("#pluginUpdate").html(data.text);
                    $2("#pluginUpdate").click(function () {
                        GM_openInTab(data.url, { active: true, setParent: true });
                    });
                } else {
                    $2("#pluginUpdate").parent().css("display", "none");
                }
            }
        });
    }
    $2.fn.cardTabs = function (options) {
        var mainClass = $2(this).attr('class');
        var activeCount = 0;
        var settings = $2.extend({
            theme: '',
        }, options);
        // Initializing
        var htmlInner = $2(this).html();
        var stack = $2('<div />').addClass('card-tabs-stack').html(htmlInner);
        var bar = $2('<div />').addClass('card-tabs-bar');
        $2('.' + mainClass).children('div[data-tab]').each(function () {
            bar.append($2('<a />').data('tab', $2(this).data('tab')).append($2(this).data('tab')));
        });
        $2('.' + mainClass).html('').append(bar).append(stack);
        // Fixing the theme
        if (settings.theme != '') {
            $2('.' + mainClass + ' .card-tabs-bar').addClass(settings.theme);
            $2('.' + mainClass + ' .card-tabs-stack').addClass(settings.theme);
        }

        function toggleTab(obj) {
            $2('.' + mainClass + " .card-tabs-stack div[data-tab][data-tab='" + obj.data('tab') + "']").show();
            $2('.' + mainClass + " .card-tabs-stack div[data-tab][data-tab!='" + obj.data('tab') + "']").hide();
        }
        // Checking whether we have to set a tab as active
        $2('.' + mainClass + ' .card-tabs-stack').children('div[data-tab]').each(function () {
            if ($2(this).hasClass('active')) {
                $2('.' + mainClass + " .card-tabs-bar a[data-tab='" + $2(this).data('tab') + "']").addClass('active');
                toggleTab($2(this));
                $2(this).removeClass('active');
                activeCount++;
            }
        });
        // Otherwise, it's the first one, and the first tab in the bar needs to be active
        if (activeCount == 0) {
            $2('.' + mainClass + ' .card-tabs-bar a:first-child').addClass('active');
        }
        $2('.' + mainClass + ' .card-tabs-bar a').click(function () {
            $2('.' + mainClass + ' .card-tabs-bar a').removeClass('active');
            $2(this).addClass('active');
            toggleTab($2(this));
        });
        return this;
    };
    obj.hasSelectPlan = function () {
        var select_val = $2("#panicBuyingPlan").val();
        if (select_val == "---请选择---") {
            obj.swal_info(null, "您没有选择方案！");
            return false;
        } else {
            return true;
        }
    }
    obj.addPlan = function (value_str) {
        var obj_plan_tmp = JSON.parse(value_str);
        var arry_import_planid = obj.getObjKeys(obj_plan_tmp);
        obj_plans[arry_import_planid[0]] = obj_plan_tmp[arry_import_planid[0]];
        GM_setValue("obj_plans", JSON.stringify(obj_plans));
    }
    //切换tab
    obj.select_tab = function (tab_val, display, click) {
        var all_tabs = $2('.card-tabs-bar.wiki')[0].childNodes;
        for (let i = 0; i < all_tabs.length; i++) {
            if (all_tabs[i].text == tab_val) {
                all_tabs[i].style.display = display;
                if (click == 1) {
                    all_tabs[i].click();
                }
                break;
            }
        }
    };
    //列表页面操作
    obj.initSearchHtml = function (selectorList) {
        setInterval(function () {
            selectorList.forEach(function (selector) {
                obj.initSearchItemSelector(selector);
            });
        }, 1000);
    };
    obj.initSearchItemSelector = function (selector) {
        $2(selector).each(function () {
            obj.initSearchItem(this);
        });
    };
    obj.addClickTask = function (keys) {
        console.log(keys);
        var time_line = 0;
        var refresh_key = '';
        while (keys.length) {
            for (let i = 0; i < keys.length; i++) {
                keys[i]['press_num'] = keys[i]['press_num'] - 1;
                //todo 如果是刷新，直接跳出
                if (keys[i]['css_path'] == "refresh_page") {
                    refresh_key = keys[i];
                    continue;
                }
                time_line = time_line + Number(keys[i]['press_interval']);
                var cssPath = keys[i]['css_path'];
                obj.captureButtonClick(cssPath, time_line);
                console.log('添加任务：', '时刻' + time_line, keys[i]['key_name'], keys[i]['css_path']);
            }
            for (let i = keys.length - 1; i >= 0; i--) {
                if (keys[i]['press_num'] == 0) {
                    keys.splice(i, 1);
                }
            }

        }
        if (refresh_key != '') {
            time_line = time_line + Number(refresh_key['press_interval']);
            console.log('添加任务', refresh_key['key_name'], '时刻' + time_line);
            // return;
            obj.captureButtonClick(refresh_key['css_path'], time_line);
        }
    }
    obj.initSearchItem = function (selector) {
        var $this = $2(selector);
        var nid;
        if ($this.hasClass("tb-cool-box-already")) {
            return;
        } else {
            $this.addClass("tb-cool-box-already");
        }
        if (obj.site_type() == "taobao_lst_page") {
            nid = $this.attr("data-id");
            if (!obj.isVailidItemId(nid)) {
                nid = $this.attr("data-itemid");
            }

            if (!obj.isVailidItemId(nid)) {
                if ($this.attr("href")) {
                    nid = location.protocol + $this.attr("href");
                } else {
                    var $a = $this.find("a");
                    if (!$a.length) { return; }
                    nid = $a.attr("data-nid");
                    if (!obj.isVailidItemId(nid)) {
                        if ($a.hasClass("j_ReceiveCoupon") && $a.length > 1) {
                            nid = location.protocol + $2($a[1]).attr("href");
                        } else {
                            nid = location.protocol + $a.attr("href");
                        }
                    }
                }
            }
        }
        else if (obj.site_type() == "jingdong_lst_page") {
            nid = $this.attr("data-sku");
            if (typeof (nid) == "undefined") {
                nid = $this.find('.price').attr("data-skuid");
            }
            if (!obj.isVailidItemId(nid)) {
                nid = $this.find(".p-operate").find("a").attr("skuid");
            }
        }
        else if (obj.site_type() == "vip_list_page") {
            nid = $this.attr("data-product-id");
            if (typeof (nid) == "undefined") {
                nid = $this.find('.c-goods-item__sale-price').html().split("</span>")[1];
            }
            if (!obj.isVailidItemId(nid)) {
                // nid = $this.find(".p-operate").find("a").attr("skuid");
            }
        }
        else if (obj.site_type() == "kaola_list_page") {
            nid = $this.find('a').eq(0).attr("href").split("/product/")[1].split(".")[0];
        }

        if (obj.isValidNid(nid)) {
            obj.appenBasicQueryHtml($this, nid);
        }
    };
    //图片上显示提示图标
    obj.initSearchEvent = function () {
        $2(".tb-cool-box-area").live("click", function () {
            var Show_hide_div_id = $2(this).attr("name");
            var a = document.getElementsByName(Show_hide_div_id)[0].style.opacity;
            for (let index = 0; index < document.getElementsByName(Show_hide_div_id).length; index++) {
                if (a == "" || a == "1") {
                    document.getElementsByName(Show_hide_div_id)[index].style.opacity = "0.2";
                } else {
                    document.getElementsByName(Show_hide_div_id)[index].style.opacity = "1";
                }
            }
        });
        $2(".tb-cool-box-area-rm").live("click", function () {
            var Show_hide_div_id = $2(this).attr("name");
            var a = document.getElementsByName(Show_hide_div_id)[0].style.opacity;
            for (let index = 0; index < document.getElementsByName(Show_hide_div_id).length; index++) {
                if (a == "" || a == "1") {
                    document.getElementsByName(Show_hide_div_id)[index].style.opacity = "0.2";
                } else {
                    document.getElementsByName(Show_hide_div_id)[index].style.opacity = "1";
                }
            }
        });
    };

    obj.basicQuery = function () {
        setInterval(function () {
            $2(".tb-cool-box-wait").each(function () {
                obj.basicQueryItem(this);
            });
        }, 300);
    };

    obj.basicQuery_list = function () {
        setInterval(function () {
            if ($2(".tb-cool-box-wait").length > 0) {
                query_item_list = query_item_list.substr(0, query_item_list.length - 1);
                obj.update_list_data(query_item_list);
                query_item_list = '';
            }
            if ($2(".tb-cool-box-wait-rm").length > 0 && query_data_list_back != '') {
                $2(".tb-cool-box-wait-rm").each(function () {
                    obj.basicQueryListItem(this, query_data_list_back, 'refresh_cashback');
                });
                query_data_list_back = '';
            }
        }, 500);
    };

    obj.update_list_data = function (query_item_list) {
        if (query_item_list == '') { return; }
        var operate = '';
        if (obj.site_type() == "jingdong_lst_page") { operate = "quert_list_jd"; }
        else if (obj.site_type() == "vip_list_page") { operate = "quert_list_vip"; }
        else if (obj.site_type() == "taobao_lst_page") { operate = "quert_list_tb"; }
        else if (obj.site_type() == "kaola_list_page") { operate = "kaola_list"; }
        var url = "https://www.youyizhineng.top/query_coupon/query_coupon_v210120.php?operate=" + operate + "&itemid_list=" + query_item_list;
        console.log(url);
        $2.getJSON(url, function (data) {
            // console.log(data);
            $2(".tb-cool-box-wait").each(function () {
                obj.basicQueryListItem(this, data, '');
            });
            query_data_list_back = data;
        });
    }


    obj.appenBasicQueryHtml = function (selector, nid) {
        if (obj.site_type() == "jingdong_lst_page" || obj.site_type() == "vip_list_page" || obj.site_type() == "taobao_lst_page" || obj.site_type() == "kaola_list_page") {
            query_item_list = query_item_list + nid + ",";
        }

        selector.append(
            '<div class="tb-cool-box-area tb-cool-box-wait"  data-nid="' + nid + '"  name="c_div_' +
            nid +
            '"><a class="tb-cool-box-info tb-cool-box-info-default" title="点击查询">查询中...</a></div>'
        );
        selector.append(
            '<div class="tb-cool-box-area-rm tb-cool-box-wait-rm"  data-nid="' + nid + '"  name="r_div_' +
            nid +
            '"><a class="tb-cool-box-info tb-cool-box-info-default" title="点击查询">查询中...</a></div>'
        );
    };

    obj.basicQueryItem = function (selector) {
        var $this = $2(selector);
        var url;
        $this.removeClass("tb-cool-box-wait");

        var nid = $this.attr("data-nid");
        url = "https://www.youyizhineng.top/query_coupon/query_coupon_v210120.php?operate=quert_single&itemid=" + nid;

        var xhr1 = new XMLHttpRequest();//第一步：新建对象
        xhr1.open('GET', url, true);//第二步：打开连接  将请求参数写在url中
        xhr1.send();//第三步：发送请求  将请求参数写在URL中
        /**
         * 获取数据后的处理程序
         */
        xhr1.onreadystatechange = function () {
            if (xhr1.readyState == 4 && xhr1.status == 200) {
                var res = xhr1.responseText;//获取到json字符串，解析
                var data = JSON.parse(res);

                if (data.couponmoney != 0 || data.return_money_rate != 0) {
                    obj.showBasicQueryFind($this, data.couponmoney, data.return_money_rate, data.url2, '');
                } else {
                    obj.showBasicQueryEmpty($this);
                }
            }
        }
    };
    obj.basicQueryListItem = function (selector, data, flag) {
        if (flag == 'refresh_cashback') {
            var $this = $2(selector).prev();
        } else {
            var $this = $2(selector);
        }
        var url;
        var each_couponmoney;
        var each_return_money_rate;
        var each_return_money;
        var each_url2;
        if ($this.hasClass("tb-cool-box-wait")) {
            $this.removeClass("tb-cool-box-wait");
        } else {
            return;
        }
        // $this.next().removeClass("tb-cool-box-wait-rm");

        var nid = $this.attr("data-nid");
        if (typeof (data[nid]) == "undefined") {
            each_couponmoney = 0;
            each_return_money_rate = 0;
            each_url2 = '';
        }
        else {
            each_couponmoney = data[nid].couponmoney;
            each_return_money_rate = data[nid].return_money_rate;
            if (obj.site_type() == "vip_list_page" || obj.site_type() == "kaola_list_page") {
                each_return_money = data[nid].return_money;
            }
            each_url2 = data[nid].url2;
        }

        if (each_couponmoney != 0 || each_return_money_rate != 0) {
            obj.showBasicQueryFind($this, each_couponmoney, each_return_money_rate, each_url2, each_return_money)
        } else {
            obj.showBasicQueryEmpty($this);
        }
    };

    obj.showBasicQueryFind = function (selector, couponMoney, rm_Money, url2, return_money) {
        var price;
        if (selector.find(".tb-cool-box-info-find").length > 0) { return; }
        if (couponMoney == "0") {
            selector.html(
                '<a target="_blank" class="tb-cool-box-info tb-cool-box-info-find" title="显示/隐藏">无券</a>'
            );
        } else {
            selector.html(
                '<a target="_blank" class="tb-cool-box-info tb-cool-box-info-find" title="显示/隐藏">有券（减' +
                couponMoney +
                "元）</a>"
            );
        }

        var url = location.href;
        if (url.indexOf("//s.taobao.com/search") > 0 || url.indexOf("//s.taobao.com/list") > 0) {
            price = selector.prev().find("strong").html();
            if (url2 != '') {
                selector.prev().find(".J_ClickStat").attr("href", url2);
                selector.prev().prev().find(".pic").find("a").attr("href", url2);
            }
        }
        else if (url.indexOf("//list.tmall.com/search_product.htm") > 0) {
            price = selector.prev().find("em").attr('title');
            if (price > 0) {
                price = selector.prev().find("em").attr('title');
                if (url2 != '') {
                    selector.prev().find(".productTitle").find("a").attr("href", url2);
                    selector.prev().find(".productImg").attr("href", url2);
                }
            }
            else {
                price = selector.prev().find(".item-price").find("strong").html();
            }
        }
        else if (url.indexOf("//list.tmall.hk/search_product.htm") > 0) {
            price = selector.prev().find("em").attr('title');
            if (url2 != '') {
                selector.prev().find(".productTitle").find("a").attr("href", url2);
                selector.prev().find(".productImg").attr("href", url2);
            }
        }
        else if (url.indexOf("//maiyao.liangxinyao.com/shop/view_shop.htm") > 0) {
            price = selector.prev().prev().find(".c-price").html();
            if (price > 0) {
                price = selector.prev().prev().find(".c-price").html();
                if (url2 != '') {
                    selector.prev().prev().find("a").attr("href", url2);
                    selector.prev().prev().prev().find("a").attr("href", url2);
                }
            }
            else {
                price = selector.prev().find(".c-price").html();
                if (url2 != '') {
                    selector.prev().find("a").attr("href", url2);
                    selector.prev().prev().find("a").attr("href", url2);
                }
            }
        }
        else if (url.indexOf("//search.jd.com/Search") > 0 || url.indexOf("//list.jd.com/list.html") > 0 || url.indexOf("//i-search.jd.com/Search") > 0) {
            price = selector.prev().find(".p-price").find("i").html();
            if (price > 0) {
                price = selector.prev().find(".p-price").find("i").html();
            }
        }
        else if (url.toLowerCase().indexOf("//search.jd.hk/search".toLowerCase()) > 0) {
            price = selector.prev().find(".price").find("span").html().split('>')[2];
        }
        else if (url.toLowerCase().indexOf("//www.jd.com/xinkuan".toLowerCase()) > 0) {
            price = selector.prev().find(".price").find("strong").html().split('¥')[1];
            if (price == "暂无报价") { return; }
        }

        if (obj.site_type() != "vip_list_page" && obj.site_type() != "kaola_list_page") {
            var rm_Money_clc = Math.round(Math.floor((price - couponMoney) * rm_Money * 1000) / 10) / 100;
        } else {
            var rm_Money_clc = Math.floor(return_money * 100) / 100;
        }

        if (rm_Money_clc < 0) {
            rm_Money_clc = Math.round(Math.floor(price * rm_Money * 1000) / 10) / 100;
        }

        if (rm_Money_clc != 0) {
            selector.next().html(
                '<a target="_blank" class="tb-cool-box-info tb-cool-box-info-find-rm" title="使用APP「花前省一省」扫码宝贝详情页二维码可得返现">返现（约' +
                rm_Money_clc +
                "元）</a>"
            );
        }
        else {
            selector.next().html(
                '<a target="_blank" class="tb-cool-box-info tb-cool-box-info-find" title="显示/隐藏">无返现</a>'
            );
        }
    };
    // 最简单数组去重法
    obj.uniqueArr = function (array) {
        var n = []; //一个新的临时数组
        //遍历当前数组
        for (var i = 0; i < array.length; i++) {
            //如果当前数组的第i已经保存进了临时数组，那么跳过，
            //否则把当前项push到临时数组里面
            if (n.indexOf(array[i]) == -1 && array[i] != '') n.push(array[i]);
        }
        return n;
    }
    obj.isNumber = function (val) {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val) || regNeg.test(val)) {
            return true;
        } else {
            return false;
        }
    }
    obj.showBasicQueryEmpty = function (selector) {
        // selector.addClass("tb-cool-box-info-translucent");
        selector.html('<a href="javascript:void(0);" class="tb-cool-box-info tb-cool-box-info-empty" style="opacity:0.5;" title="切换透明度">暂无优惠</a>');
        selector.next().html('<a href="javascript:void(0);" class="tb-cool-box-info tb-cool-box-info-empty" style="opacity:0.5;" title="切换透明度">暂无返现</a>');
    };

    obj.site_type = function () {
        var url = location.href;
        if (
            url.indexOf("//item.taobao.com/item.htm") > 0 ||
            url.indexOf("//detail.tmall.com/item.htm") > 0 ||
            url.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 ||
            url.indexOf("//detail.tmall.hk/hk/item.htm") > 0 ||
            url.indexOf("//detail.liangxinyao.com/item.htm") > 0 ||
            url.indexOf("//world.tmall.com") > 0 ||
            url.indexOf("//detail.tmall.hk/item.htm") > 0
        ) {
            return "taobao_details_page";
        } else if (
            url.indexOf("//maiyao.liangxinyao.com/shop/view_shop.htm") > 0 ||
            url.indexOf("//list.tmall.com/search_product.htm") > 0 ||
            url.indexOf("//s.taobao.com/search") > 0 ||
            url.indexOf("//list.tmall.hk/search_product.htm") > 0
        ) {
            return "taobao_lst_page";
        }
        else if (
            url.indexOf("//search.jd.com/Search") > 0 ||
            url.indexOf("//search.jd.hk/search") > 0 ||
            url.indexOf("//www.jd.com/xinkuan") > 0 ||
            url.indexOf("//list.jd.com/list.html") > 0 ||
            url.indexOf("//i-search.jd.com/Search") > 0 ||
            url.indexOf("//search.jd.hk/Search") > 0
        ) {
            return "jingdong_lst_page";
        }
        else if (
            url.indexOf("//item.jd.hk") > 0 ||
            url.indexOf("//pcitem.jd.hk") > 0 ||
            url.indexOf("//i-item.jd.com") > 0 ||
            url.indexOf("//item.jd.com") > 0
        ) {
            return "jingdong_details_page";
        }
        else if (
            url.indexOf("//category.vip.com/suggest.php") > 0 ||
            url.indexOf("//list.vip.com") > 0
        ) {
            return "vip_list_page";
        }
        else if (
            url.indexOf("//detail.vip.com") > 0
        ) {
            return "vip_detail_page";
        }
        else if (
            url.indexOf("//m.vip.com/product") > 0
        ) {
            return "vip_detail_page_m";
        }
        else if (
            url.indexOf("//goods.kaola.com/product") > 0 ||
            url.indexOf("//goods.kaola.com.hk/product") > 0
        ) {
            return "kaola_detail_page";
        }
        else if (
            url.indexOf("//search.kaola.com/search.html") > 0
        ) {
            return "kaola_list_page";
        }
        else if (
            url.indexOf("//product.suning.com") > 0
        ) {
            return "suning_detail_page";
        }
        else if (
            url.indexOf("//www.vmall.com/product") > 0
        ) {
            return "huawei_detail_page";
        }
    }
    obj.platform = function () {
        var url = location.host;
        if (
            url.indexOf("taobao.com") > 0 ||
            url.indexOf("tmall.com") > 0 ||
            url.indexOf("tmall.hk") > 0 ||
            url.indexOf("liangxinyao.com") > 0 ||
            url.indexOf("alipay.com") > 0
        ) {
            return "taobao";
        }
        else if (
            url.indexOf("jd.com") > 0 ||
            url.indexOf("jd.hk") > 0
        ) {
            return "jingdong";
        }
        else if (
            url.indexOf("vip.com") > 0
        ) {
            return "vip";
        }
        else if (
            url.indexOf("kaola.com") > 0
        ) {
            return "kaola";
        }
        else if (
            url.indexOf("suning.com") > 0
        ) {
            return "suning";
        }
        else if (
            url.indexOf("vmall.com") > 0
        ) {
            return "huawei";
        }
        else if (
            url.indexOf("xiaomiyoupin.com") > 0
        ) {
            return "xiaomiyoupin";
        } else if (
            url.indexOf("pinduoduo.com") > 0
        ) {
            return "pinduoduo";
        }
    }
    obj.isDetailPageTaoBao = function (url) {
        if (
            url.indexOf("//item.taobao.com/item.htm") > 0 ||
            url.indexOf("//detail.tmall.com/item.htm") > 0 ||
            url.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 ||
            url.indexOf("//detail.tmall.hk/hk/item.htm") > 0
        ) {
            return true;
        } else {
            return false;
        }
    };

    obj.DetailPageTB_or_TM_or_JD = function () {
        var url = location.href;
        if (url.indexOf("//item.taobao.com/item.htm") > 0 ||
            url.indexOf("//detail.liangxinyao.com/item.htm") > 0
        ) {
            return 1;
        }
        else if (
            url.indexOf("//detail.tmall.com/item.htm") > 0 ||
            url.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 ||
            url.indexOf("//detail.tmall.hk/hk/item.htm") > 0 ||
            url.indexOf("//world.tmall.com") > 0 ||
            url.indexOf("//detail.tmall.hk/item.htm") > 0
        ) {
            return 2;
        }
        else if (obj.site_type() == "jingdong_details_page") {
            return 3;
        }
    };


    obj.isVailidItemId = function (itemId) {
        if (!itemId) {
            return false;
        }
        var itemIdInt = parseInt(itemId);
        if (itemIdInt == itemId && itemId > 10000) {
            return true;
        } else {
            return false;
        }
    };

    obj.isValidNid = function (nid) {
        if (!nid) {
            return false;
        } else if (nid.indexOf("http") >= 0) {
            if (obj.isDetailPageTaoBao(nid) || nid.indexOf("//detail.ju.taobao.com/home.htm") > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };


    obj.get_tb_price = function (price_str) {
        var price = '';
        if (price_str != null) {
            if (price_str.indexOf("-") > 0) {
                price = price_str.split("-")[0];
            }
            else {
                price = price_str;
            }
        }
        return price;
    };

    obj.get_data = function () {
        // alert(1);
        var operate = '';
        if (obj.site_type() == "vip_detail_page") {
            if (location.href.indexOf("wq=1") > 0) { return; }
            operate = "get_info_vip&vip_type=1";
        } else if (obj.site_type() == "vip_detail_page_m") {
            var arry_url_tmp = location.href.split('m.vip.com/product');
            window.location.href = arry_url_tmp[0] + 'detail.vip.com/detail' + arry_url_tmp[1];
            stop = '1';
            return;
        }
        var url = "https://www.youyizhineng.top/query_coupon/query_coupon_v210120.php?operate=get_info&data_i=" + encodeURIComponent(location.href);
        console.log(url);
        console.log('=============================');

        $2.ajax({
            url: url,
            async: false,
            timeout: 500,
            // dataType: "json",
            success: function (data) {
                try {
                    // console.log(data);
                    var data_tmp = JSON.parse(data);
                    if (obj.site_type() == "taobao_details_page") {
                        if (data_tmp.data_ii > 0) { return; }
                    }
                    if (data_tmp.data_i != null) {
                        window.location.href = data_tmp.data_i;
                        stop = '1';
                    }
                } catch { }
            }
        })
    };

    obj.generate_trend_data = function (all_begin_time, all_line) {

        if (all_line.length > 0) {
            for (let index = 0; index < all_line.length; index++) {
                var data_tmp = {};
                var newTime = new Date(all_begin_time);
                newTime = newTime.setDate(newTime.getDate() + index);
                newTime = new Date(newTime);

                var newTime_d = (newTime.getMonth() + 1).toString().padStart(2, '0') + "-" + newTime.getDate().toString().padStart(2, '0') + "-" + newTime.getFullYear() + " GMT";
                data_tmp["x"] = newTime_d;
                data_tmp["y"] = all_line[index];
                options.series[0].data.push(data_tmp);
            }
        }
    };
    obj.query_trend_data = function () {
        //获得价格波动var url = location.href;
        var gwdUrl = "https://browser.gwdang.com/extension/price_towards?url=" + encodeURIComponent(location.href);
        GM_xmlhttpRequest({
            url: gwdUrl,
            method: 'GET',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'public'
            },
            onload: function (res) {
                //loadingMask.parentNode.removeChild(mask);
                const json = JSON.parse(res.responseText);
                const data = json;
                if (data.is_ban == null) {
                    // console.log(typeof (data.store));
                    var all_line;
                    var all_begin_time;
                    if ($2("#float_div").css("display") == "block") {
                        location.reload();
                    }
                    if (typeof (data.store) != "undefined" && data.store[0].all_line != null) {
                        all_begin_time = data.store[0].all_line_begin_time;
                        all_line = data.store[0].all_line;
                        if (all_line.length != 0) {
                            obj.generate_trend_data(all_begin_time, all_line);
                        } else {
                            options.title.text = "花前省一省-本商品暂无历史数据";
                        }
                    }
                    else {
                        options.title.text = "花前省一省-本商品暂无历史数据";
                    }
                    // console.log(check_url);
                } else {
                    options.title.text = "本次需要验证:【点击上方按钮进行验证】";
                    check_url = data.action.to;
                }
                obj.add_iframe();
            }
        });
    }
    obj.add_iframe = function () {
        if (options.title.text == "花前省一省-本商品暂无历史数据") {
            $2(".image-status").attr("title", "历史数据加载成功");
            $2(".image-status").attr("src", "https://s1.ax1x.com/2020/10/26/BnYQkn.png");

            $2(".status-span").html("经查询，本商品暂无历史数据");
            $2("#coupon-wrap-trend").css("display", "none");
            $2(".trend-div").css("display", "none");
        }
        else if (options.series[0].data.length > 0) {
            $2(".image-status").attr("title", "历史数据加载成功");
            $2(".image-status").attr("src", "https://s1.ax1x.com/2020/10/26/BnYQkn.png");

            chart = new ApexCharts(document.querySelector("#chart"), options);
            chart.render();
        } else {
            //在chart上提示显示文字
            $2(".trend-div").append('<span class="cover-chart-span"></span>');

            $2(".image-status").attr("title", "需要验证");
            $2(".image-status").attr("src", "https://s1.ax1x.com/2020/10/26/BnYkfP.gif");
            $2(".image-status").css("cursor", "pointer");
            $2("#coupon-wrap-trend").css("display", "none");

            $2(".status-span").html("← 点击左侧按钮验证");

            $2(".image-status").click(function (event) {
                $2("body").append('<div id="float_div" class="frame_div"></div>');
                document.getElementById("float_div").style.left = (window.screen.width - 800) / 2 + "px";
                document.getElementById("float_div").style.top = (window.screen.height - 500) / 2 + "px";
                $2("#float_div").append('<iframe id="iframe_check" src="" ></iframe>');
                $2("#iframe_check").attr("src", check_url);
                $2("#iframe_check").attr("scrolling", "no");
                $2("#float_div").append('<div class="cover"><img src="https://s1.ax1x.com/2020/09/23/wjSB4K.png" alt="未命名1600825169" border="0"><br>验证后将自动刷新，若一直验证失败，<a style="color:red" target="_blank"  href="' + check_url + '">点击此处</a>在独立页面中验证后关闭即可</div>');
                $2("#float_div").css("display", "none");
                //关闭按钮
                $2("#float_div").append('<img class="cover-close" src="https://s1.ax1x.com/2020/10/26/BnYYXF.png" ></img>');
                $2(".cover-close").click(function (event) {
                    $2("#float_div").css("display", "none");
                });
                if ($2("#float_div").css("display") == "block") {
                    $2("#float_div").css("display", "none");
                } else {
                    $2("#float_div").css("display", "block");
                    var w_check = setInterval(function () {
                        obj.query_trend_data();
                        if (options.series[0].data.length > 0) {
                            // console.log(options);
                            $2("#float_div").css("display", "none");
                            chart = new ApexCharts(document.querySelector("#chart"), options);
                            chart.render();
                            clearInterval(w_check);
                        }
                    }, 1000);
                }
            });
        }
    }

    obj.close = function () {
        window.close();
    }
    obj.cssPath = function (el) {
        if (!(el instanceof Element)) {
            return;
        }
        var path = [];
        while (el.nodeType === Node.ELEMENT_NODE) {
            var selector = el.nodeName.toLowerCase();
            if (el.id) {
                selector += '#' + el.id;
                path.unshift(selector);
                break;
            } else if (document.getElementsByClassName(el.className).length == 1) {
                var str_class = $2.trim(el.className);
                str_class = str_class.replace(/\s+/g, ' ');
                selector += '.' + str_class.replace(/\ /g, '.');
                path.unshift(selector);
                break;
            }
            else {
                var sib = el, nth = 1;
                while (sib = sib.previousElementSibling) {
                    if (sib.nodeName.toLowerCase() == selector) {
                        nth++;
                    }
                }
                if (nth != 1) {
                    selector += ":nth-of-type(" + nth + ")";
                }
            }
            path.unshift(selector);
            el = el.parentNode;
        }
        return path.join(" > ");
    }
    obj.isParent = function (obj, parentObj) {
        while (obj != undefined && obj != null && obj.tagName != null && obj.tagName.toUpperCase() != 'BODY') {
            if (obj == parentObj) { return true; }
            obj = obj.parentNode;
        }
        return false;
    }
    obj.clearAllNodes = function () {
        document.getElementById('displayButton').innerHTML = '';
    }
    //#region 初始化设置
    obj.initialSetup = function () {

    }
    //#endregion 初始化设置
    var startMonitoringFlag = '0'
    var settime_ms = 0
    var criticalValue = 30000 //0.5分钟
    var settime_ms_difference_last = criticalValue;
    obj.timing = function (operate) {
        setInterval(function () {
            var timestamp = $2('#time_span_ms').html();
            var num_timestamp = Number(timestamp);
            var num_timestamp_now = num_timestamp + 50;
            var mydate_tmp = new Date(num_timestamp);
            // $2('#time_span').html(mydate_tmp.toLocaleString('chinese', { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + mydate_tmp.getMilliseconds());
            $2('#time_span').html(mydate_tmp.Format("yyyy-MM-dd hh:mm:ss") + ' ' + mydate_tmp.getMilliseconds());
            $2('#time_span_ms').html(num_timestamp_now);
            if (startMonitoringFlag == '1') {
                //开启监控后
                var settime_ms_difference_current = settime_ms - num_timestamp_now;
                if (settime_ms_difference_current <= 0) {
                    var planId = $2("#panicBuyingPlan").val();
                    var key_info = JSON.parse(JSON.stringify(obj_plans[planId]['keys'][location.host]));
                    var second = Number($2('#duration').val());
                    if (isNaN(second)) {
                        second = 60;
                    }
                    obj.setVirtualCookie(planId, '1', obj.get_date_now_ms(), second * 1000);
                    obj.addClickTask(key_info);
                    startMonitoringFlag = '0';
                    $2('#runStatus').val('方案已经执行，可在运行中的里面找到方案并停止');
                }
                else if (settime_ms_difference_current < criticalValue) {
                    $2('#runStatus').val('倒计时：' + ((settime_ms_difference_current) / 1000).toString() + '秒');
                }
                else {
                    $2('#runStatus').val('开始监控,将在 ' + criticalValue / 1000 + '秒后开始倒计时并自动同步时间');
                }
                if (settime_ms_difference_current <= criticalValue && settime_ms_difference_last >= criticalValue) {
                    obj.syntime();
                }

                settime_ms_difference_last = settime_ms_difference_current;
            } else {
                // $2('#runStatus').val('等待抢购，请确保已经登陆并已经选好商品规格');
            }
        }, 50);
    }
    obj.startMonitoring = function (planId, info) {
        if (info == "first_page") {
        } else {

        }
    }
    obj.stopMonitoring = function () {

    }
    //#region 跳转到新方案页
    obj.bindingNotCompleted = function (info) {
        //todo 如果是新建
        if (info == 'new') {
            obj.clearAllNodes();
            var plan_id = 'plan_' + obj.get_date_now_ms();
            $2("#planId").html(plan_id);
            $2("#isFinish").html('0');
        }
        else {
            obj.clearAllNodes();
            var plan_id = info;
            $2("#planId").html(plan_id);
            $2("#isFinish").html(obj_plans[plan_id]['isfinish']);
            $2("#planName").val(obj_plans[plan_id]['plan_name']);
            $2("#planInfo").val(obj_plans[plan_id]['plan_info']);
            var arry_plan_keys = [];
            for (var p in obj_plans[plan_id].keys) {
                arry_plan_keys.push(p);
            }
            for (let index = 0; index < arry_plan_keys.length; index++) {
                if (arry_plan_keys[index] != location.host) {
                    var host_tmp = arry_plan_keys[index];
                    var new_div = document.createElement("div");
                    new_div.id = host_tmp;
                    new_div.setAttribute('data-domainName', host_tmp);
                    document.getElementById('displayButton').appendChild(new_div);
                    var new_span = document.createElement("span");
                    new_span.className = 'dynamicHostSpan';
                    new_span.innerHTML = '[已保存]    ' + '页面：' + host_tmp;
                    document.getElementById(host_tmp).appendChild(new_span);

                    for (let j = 0; j < obj_plans[plan_id]['keys'][host_tmp].length; j++) {
                        var key_info = obj_plans[plan_id]['keys'][host_tmp][j];
                        var new_div = document.createElement("div");
                        new_div.className = 'dynamicDIV';
                        var new_span = document.createElement("span");
                        new_span.innerText = '▶' + key_info['key_name'];
                        new_span.title = '▶' + key_info['key_name'] + "\n" + key_info['css_path'];
                        new_span.className = 'dynamicSpan';
                        if (key_info['css_path'] == "refresh_page") {
                            new_span.style.color = 'red';
                        }
                        new_div.appendChild(new_span);
                        new_span = document.createElement("span");
                        new_span.innerHTML = '&nbsp&nbsp&nbsp&nbsp配置：';
                        if (key_info['css_path'] == "refresh_page") {
                            new_span.innerHTML = '&nbsp&nbsp&nbsp&nbsp配置：';
                        }
                        new_span.title = '例：按钮总共点击3次，与上一个按钮间隔200毫秒，输入3-200';
                        new_span.style.color = 'green';
                        new_span.style.verticalAlign = 'middle';
                        new_div.appendChild(new_span);
                        var new_input = document.createElement("input");
                        new_input.className = 'dynamicInput';
                        new_input.placeholder = '格式：次数-间隔(毫秒)';
                        new_input.value = (key_info['press_num'] + '-' + key_info['press_interval']);
                        if (key_info['css_path'] == "refresh_page") {
                            new_input.placeholder = '刷新按钮只能配置为1-xx';
                            new_input.id = host_tmp + "_refresh_page";
                        }
                        new_div.appendChild(new_input);
                        new_span = document.createElement("span");
                        new_span.innerHTML = key_info['css_path'];
                        new_span.style.display = 'none';
                        new_div.appendChild(new_span);
                        document.getElementById(host_tmp).appendChild(new_div);
                    }
                }
            }
            if ($2.inArray(location.host, arry_plan_keys) >= 0) {
                var new_div = document.createElement("div");
                new_div.id = location.host;
                new_div.setAttribute('data-domainName', location.host);
                document.getElementById('displayButton').appendChild(new_div);
                var new_span = document.createElement("span");
                new_span.className = 'dynamicHostSpan';
                new_span.innerHTML = '[已保存]    ' + '页面：' + location.host;
                document.getElementById(location.host).appendChild(new_span);

                for (let j = 0; j < obj_plans[plan_id]['keys'][location.host].length; j++) {
                    var key_info = obj_plans[plan_id]['keys'][location.host][j];
                    var new_div = document.createElement("div");
                    new_div.className = 'dynamicDIV';
                    var new_span = document.createElement("span");
                    new_span.innerText = '▶' + key_info['key_name'];
                    new_span.title = '▶' + key_info['key_name'] + "\n" + key_info['css_path'];
                    new_span.className = 'dynamicSpan';
                    if (key_info['css_path'] == "refresh_page") {
                        new_span.style.color = 'red';
                    }
                    new_div.appendChild(new_span);
                    new_span = document.createElement("span");
                    new_span.innerHTML = '&nbsp&nbsp&nbsp&nbsp配置：';
                    if (key_info['css_path'] == "refresh_page") {
                        new_span.innerHTML = '&nbsp&nbsp&nbsp&nbsp配置：';
                    }
                    new_span.title = '例：按钮总共点击3次，与上一个按钮间隔200毫秒，输入3-200';
                    new_span.style.color = 'green';
                    new_span.style.verticalAlign = 'middle';
                    new_div.appendChild(new_span);
                    var new_input = document.createElement("input");
                    new_input.className = 'dynamicInput';
                    new_input.placeholder = '格式：次数-间隔(毫秒)';
                    new_input.value = (key_info['press_num'] + '-' + key_info['press_interval']);
                    if (key_info['css_path'] == "refresh_page") {
                        new_input.placeholder = '刷新按钮只能配置为1-xx';
                        new_input.id = location.host + "_refresh_page";
                    }
                    new_div.appendChild(new_input);
                    new_span = document.createElement("span");
                    new_span.innerHTML = key_info['css_path'];
                    new_span.style.display = 'none';
                    new_div.appendChild(new_span);
                    document.getElementById(location.host).appendChild(new_div);
                }
            }
        }
        //todo 如果有传参则参数为planid

    }
    obj.switchToNew = function (source) {
        obj.select_tab('新方案', '', 1);
        if (source == 'edit_button') {
            obj.bindingNotCompleted($2("#panicBuyingPlan").val());
            return;
        }
        var arry_plans_code = [];
        for (var p in obj_plans) {
            arry_plans_code.push(p);
        }
        for (let index = 0; index < arry_plans_code.length; index++) {
            if (obj_plans[arry_plans_code[index]]['isfinish'] == '0') {
                console.log('未完成');
                if (source != null && source == 'new_button') {
                    obj.swal_info(null, '您有尚未保存的方案，保存后才能新建');
                }
                obj.bindingNotCompleted(arry_plans_code[index]);
                return;
            }
        }
        obj.bindingNotCompleted('new');
    }
    //#endregion
    //#region obj.initializePanicBuyingAssistant 抢购助手初始化
    var listen_click = '0';
    obj.captureExecution = function (target) {
        if (listen_click == '0') { return; }
        if (obj.isParent(target, document.getElementById("coupon-wrap-qr"))) {
            return;
        } else if (obj.isParent(document.getElementById("coupon-wrap-qr"), target)) {
            return;
        }
        if (target.id == "button_capture" || target.id == "button_saveThisPage" || target.innerText == "完成") {
            return;
        }
        if (obj.isParent(target, document.getElementsByClassName('swal-overlay'))) {
            return;
        }
        var cssTargetStr = obj.cssPath(target);
        if (document.getElementById(location.host) == null) {
            var new_div = document.createElement("div");
            new_div.id = location.host;
            new_div.setAttribute('data-domainName', location.host);
            document.getElementById('displayButton').appendChild(new_div);
            var new_span = document.createElement("span");
            new_span.className = 'dynamicHostSpan';
            new_span.innerHTML = '[未保存]    ' + '页面：' + location.host;
            document.getElementById(location.host).appendChild(new_span);
        } else {
            document.getElementById(location.host).childNodes[0].innerHTML = '[未保存]    ' + '页面：' + location.host;
        }
        if (document.getElementById(location.host).lastChild.firstChild.innerText == "▶刷新页面") {
            obj.swal_fadeAway("刷新操作后不能再添加按钮~", 1200);
            return;
        }
        var new_div = document.createElement("div");
        new_div.className = 'dynamicDIV';
        new_span = document.createElement("span");
        if (target.innerText != null) {
            new_span.innerText = '▶' + target.innerText.replace('\n', ' ');
            new_span.title = '▶' + target.innerText + "\n" + cssTargetStr;
        } else {
            new_span.innerText = '▶找不到名称';
            new_span.title = '▶找不到名称' + "\n" + cssTargetStr;
        }
        new_span.className = 'dynamicSpan';
        new_div.appendChild(new_span);
        new_span = document.createElement("span");
        new_span.innerHTML = '&nbsp&nbsp&nbsp&nbsp配置：';
        new_span.title = '例：按钮总共点击3次，与上一个按钮间隔200毫秒，输入3-200';
        new_span.style.color = 'green';
        new_span.style.verticalAlign = 'middle';
        new_div.appendChild(new_span);
        var new_input = document.createElement("input");
        new_input.className = 'dynamicInput';
        new_input.placeholder = '格式：次数-间隔(毫秒)';
        new_div.appendChild(new_input);
        new_span = document.createElement("span");
        new_span.innerHTML = cssTargetStr;
        new_span.style.display = 'none';
        new_div.appendChild(new_span);
        document.getElementById(location.host).appendChild(new_div);
        target.remove();
    }

    obj.bindPlanInfo = function (planId) {
        var info_str = '方案编号：' + planId + '\n';
        info_str += '方案名称：' + obj_plans[planId]['plan_name'] + '\n';
        info_str += '方案说明：' + obj_plans[planId]['plan_info'] + '\n';
        var arry_hosts = obj.getObjKeys(obj_plans[planId]['keys']);
        for (let i = 0; i < arry_hosts.length; i++) {
            info_str += '\n作用页面：' + arry_hosts[i] + '\n';
            var keyInfo = obj_plans[planId]['keys'][arry_hosts[i]];
            for (let j = 0; j < keyInfo.length; j++) {
                info_str += '       点击--' + keyInfo[j].key_name + '\n';
            }
        }
        $2('#imgPlanInfo').attr('title', info_str);
    }
    obj.setSelect = function (id, text) {
        var count = $2("#" + id).get(0).options.length;
        for (var i = 0; i < count; i++) {
            if ($2("#" + id).get(0).options[i].text == text) {
                $2("#" + id).get(0).options[i].selected = true;
                break;
            }
        }
    }
    var mouse_TO = '';
    obj.initializePanicBuyingAssistant = function (type) {
        if (page_type == 'other_page') {
            document.getElementById('float_assistant').onmouseenter = function () {
                if (mouse_TO != '') {
                    clearTimeout(mouse_TO);
                }
                obj.getNewVersion();
                $2('#float_assistant')[0].children[0].style.display = 'inline-block';
                $2('#float_assistant')[0].children[1].style.display = 'none';
                $2('#float_assistant')[0].style.borderRadius = "6px";
                $2('#float_assistant')[0].style.padding = "10px 10px 0px 10px ";
            }
            document.getElementById('float_assistant').onmouseleave = function () {
                mouse_TO = setTimeout(() => {
                    $2('#float_assistant')[0].children[1].style.display = 'block';
                    $2('#float_assistant')[0].children[0].style.display = 'none';
                    $2('#float_assistant')[0].style.borderRadius = "99px";
                    $2('#float_assistant')[0].style.padding = "3px";
                }, 500);
            }
            document.getElementById('float_assistant').onmousedown = function (e) {
                var e = e || window.event
                if (e.button == "1") {
                    $2('#float_assistant').css('display', 'none');
                }
            }
        } else {
            obj.getNewVersion();
        }
        //时钟同步源选择
        if (obj.platform() == "taobao") {
            obj.setSelect('syn_time_api', '源：淘宝服务器时间');
        } else if (obj.platform() == "jingdong") {
            obj.setSelect('syn_time_api', '源：京东服务器时间');
        } else if (obj.platform() == "suning") {
            obj.setSelect('syn_time_api', '源：苏宁服务器时间');
        } else if (obj.platform() == "huawei") {
            obj.setSelect('syn_time_api', '源：华为商城服务器时间');
        } else if (obj.platform() == "xiaomiyoupin") {
            obj.setSelect('syn_time_api', '源：小米有品服务器时间');
        } else if (obj.platform() == "pinduoduo") {
            obj.setSelect('syn_time_api', '源：拼多多服务器时间');
        } else {
            obj.setSelect('syn_time_api', '源：本页面服务器（精确到秒）');
        }
        $2("#duration").val(60);
        //绑定方案
        var arryPlanId = obj.getObjKeys(obj_plans);
        var select_plans = document.getElementById('panicBuyingPlan');
        for (let i = 0; i < arryPlanId.length; i++) {
            if (obj_plans[arryPlanId[i]]['isfinish'] == '0')
                continue;
            var new_option = document.createElement('option');
            new_option.value = arryPlanId[i];
            new_option.innerText = obj_plans[arryPlanId[i]]['plan_name'];
            select_plans.appendChild(new_option);
        }

        //绑定任务inProgress
        var array_task = obj.getObjKeys(v_cookie);
        for (let i = 0; i < array_task.length; i++) {
            if (array_task[i] == 'mjdLogin') continue;
            if (obj_plans[array_task[i]] == null || obj_plans[array_task[i]] == undefined) {
                obj.delVirtualCookie(array_task[i]);
                continue;
            }
            if (array_task[i].indexOf('plan_') > -1 && v_cookie[array_task[i]]['active'] == '1' && obj.judgmentVirtualCookie(array_task[i])) {
                //绑定任务inProgress
                var inProgress_plans = document.getElementById('inProgress');
                console.log(inProgress_plans);
                var new_option = document.createElement('option');
                new_option.value = array_task[i];
                new_option.innerText = obj_plans[array_task[i]]['plan_name'];
                inProgress_plans.appendChild(new_option);
            }
        }
        $2('#button_delTask').click(function () {
            obj.swal_info(null, "即将停止任务：" + $2("#inProgress").find("option:selected").text(), "确定", function () {
                obj.delVirtualCookie($2("#inProgress").val());
                location.reload();
            })
        });

        $2("#pageUrl").text(location.host);
        obj.select_tab('新方案', 'none', 0);
        var myDate = obj.get_date_now_ms();
        $2('#time_span_ms').html(myDate);

        $2('#button_syn').click(function () {
            obj.syntime();
        });
        $2('#button_getCurrentTime').click(function () {
            var myDate = new Date();
            // $2('#set_time').attr("value", myDate.toLocaleString('chinese', { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            $2('#set_time').attr("value", myDate.Format("yyyy-MM-dd hh:mm:ss"));
        });
        $2('#panicBuyingPlan').change(function () {
            var planId = $2(this).val();
            if (obj_plans[planId]['jd_spike'] == '1') {
                var active = '1';
                if (!obj.judgmentVirtualCookie('mjdLogin')) {
                    active = '0';
                    console.log('过期');
                }
                if (active == '0') {
                    obj.swal_info(null, '选择京东极速下单方案后，请点击"去登陆"确保已经登陆了web版京东~，本消息2小时内不再提醒', '去登陆', function () { $2('#mjdLogin')[0].click() })
                }
            }
            obj.bindPlanInfo(planId);

        });
        $2('#button_delPlan').click(function () {
            if (!obj.hasSelectPlan()) {
                return;
            }

            var select_val = $2("#panicBuyingPlan").val();
            var plan_name = obj_plans[select_val]['plan_name'];
            obj.swal_info(null, '即将删除方案！方案名称：' + plan_name, "确认删除", function () {
                delete obj_plans[select_val]
                GM_setValue("obj_plans", JSON.stringify(obj_plans));
                location.reload();
            });
        });
        $2('#button_newPlan').click(function () {
            obj.switchToNew('new_button');
        });
        $2('#button_editPlan').click(function () {
            if (!obj.hasSelectPlan()) {
                return;
            }
            obj.switchToNew('edit_button');
        });
        $2('#viewTutorial').click(function () {
            GM_openInTab('https://bbs.youyizhineng.top/d/10', { active: true, setParent: true });
        });

        $2('.sys-description').css("display", 'none');
        $2('#viewDescription').click(function () {
            if ($2('#viewDescription').text().indexOf("展开") > -1) {
                $2('.sys-description').css("display", 'block');
                $2('#viewDescription').text(">>隐藏说明");
            } else {
                $2('.sys-description').css("display", 'none');
                $2('#viewDescription').text(">>展开说明");
            }
        });
        $2('#button_startNow').click(function () {
            //检查是否是京东快速通道并登陆
            var select_val = $2("#panicBuyingPlan").val();

            //设定的时间转毫秒
            var set_time = $2('#set_time').val();

            if (select_val == "---请选择---") {
                obj.swal_info(null, "您没有选择方案，请选择合适的方案哦~");
                return;
            }
            var arry_plans = obj.getObjKeys(obj_plans[select_val]['keys']);
            if (arry_plans.length > 0 && $2.inArray(location.host, arry_plans) == -1) {
                obj.swal_info(null, "选中的方案不可作用于本页哦~");
                return;
            }
            else if (obj_plans[select_val]['jd_spike'] == '1' && !obj.judgmentVirtualCookie('mjdLogin')) {
                obj.swal_info(null, '选择京东极速下单方案后，请点击"去登陆"确保已经登陆了web版京东~，本消息2小时内不再提醒', '去登陆', function () { $2('#mjdLogin')[0].click() })
                return;
            } else {
                settime_ms = 0;
                startMonitoringFlag = '1';
                $2('#runStatus').val('方案已经执行，可在运行中的里面找到方案并停止');
            }
        });

        $2('#button_startMonitoring').click(function () {
            //添加任务到v_cookie
            if (startMonitoringFlag == '1') {
                startMonitoringFlag = '0';
                $2('#button_startMonitoring').text('开始执行');
                $2('#button_startMonitoring').css('background-color', '#25a765');
                $2('#button_startMonitoring').css('color', '#ffffff');
                $2("#panicBuyingPlan").attr("disabled", false);
                $2("#set_time").attr("disabled", false);
                $2("#syn_time_api").attr("disabled", false);
                $2("#set_time_ms").attr("disabled", false);
                $2("#earlyOrLate").attr("disabled", false);

                $2('#runStatus').val('等待抢购，请确保已经登陆并已经选好商品规格');
            } else {
                //检查是否是京东快速通道并登陆
                var select_val = $2("#panicBuyingPlan").val();

                //设定的时间转毫秒
                var set_time = $2('#set_time').val();

                if (select_val == "---请选择---") {
                    obj.swal_info(null, "您没有选择方案，请选择合适的方案哦~");
                    return;
                }
                var arry_plans = obj.getObjKeys(obj_plans[select_val]['keys']);
                if (arry_plans.length > 0 && $2.inArray(location.host, arry_plans) == -1) {
                    obj.swal_info(null, "选中的方案不可作用于本页哦~");
                    return;
                }
                else if (obj_plans[select_val]['jd_spike'] == '1' && !obj.judgmentVirtualCookie('mjdLogin')) {
                    obj.swal_info(null, '选择京东极速下单方案后，请点击"去登陆"确保已经登陆了web版京东~，本消息2小时内不再提醒', '去登陆', function () { $2('#mjdLogin')[0].click() })
                    return;
                }
                else if (set_time == '') {
                    obj.swal_info(null, "设定时间不能为空");
                    return;
                } else {
                    var d = new Date(set_time);
                    var d_ms = Number(d);
                    if (isNaN(Number(d))) {
                        obj.swal_info(null, "请输入正确的时间格式");
                    } else {
                        startMonitoringFlag = '1';
                        $2('#button_startMonitoring').text('监控中..');
                        $2('#button_startMonitoring').css('background-color', '#ffcc00');
                        $2('#button_startMonitoring').css('color', '#000000');
                        $2("#panicBuyingPlan").attr("disabled", true);
                        $2("#set_time").attr("disabled", true);
                        $2("#syn_time_api").attr("disabled", true);
                        $2("#set_time_ms").attr("disabled", true);
                        $2("#earlyOrLate").attr("disabled", true);
                        if ($2('#earlyOrLate').val() == 'inAdvance') {
                            settime_ms = d_ms - Number($2('#set_time_ms').val());
                        } else {
                            settime_ms = d_ms + Number($2('#set_time_ms').val());
                        }
                    }
                }
            }
        });
        $2('#button_saveThisPage').click(function () {
            // console.log($2("#planName").text());

            var error = 0;
            if ($2("#planName").val() == '') {
                // obj.swal_info(null, "方案名称不可为空！");
                obj.swal_fadeAway("方案名称不可为空！", 1200);
                return;
            }
            if ($2("#planName").val() == '') {
                // obj.swal_info(null, "方案名称不可为空！");
                obj.swal_fadeAway("方案名称不可为空！", 1200);
                return;
            }
            if ($2("#planInfo").val() == '') {
                // obj.swal_info(null, "方案描述不可为空！");
                obj.swal_fadeAway("方案描述不可为空！", 1200);
                return;
            }
            if ($2("#displayButton").find('div').length == 0) {
                // obj.swal_info(null, "没有捕获任何按键！");
                obj.swal_fadeAway("没有捕获任何按键！", 1200);
                return;
            } else {
                GM_setValue('newPlanFinish', '0');
                //todo 保存本页配置项
                var plan_id = $2("#planId").text();
                obj_plans[plan_id] = {};
                obj_plans[plan_id]['plan_name'] = $2("#planName").val();
                obj_plans[plan_id]['plan_info'] = $2("#planInfo").val();
                obj_plans[plan_id]['plan_type'] = '1';
                obj_plans[plan_id]['jd_spike'] = '0';
                obj_plans[plan_id]['plan_attributes1'] = '';
                obj_plans[plan_id]['plan_attributes2'] = '';
                obj_plans[plan_id]['plan_attributes3'] = '';
                obj_plans[plan_id]['isfinish'] = '0';
                obj_plans[plan_id]['keys'] = {};
                for (var i = 0; i < $2(".dynamicHostSpan").length; i++) {
                    var host = $2(".dynamicHostSpan")[i].textContent.split('：')[1];
                    obj_plans[plan_id]['keys'][host] = [];
                    for (var j = 1; j < $2('[data-domainname="' + host + '"]')[0].childNodes.length; j++) {
                        var childnodes = $2('[data-domainname="' + host + '"]')[0].childNodes[j];
                        var key_info = {};
                        var input_val = childnodes.childNodes[2].value;
                        if (!(input_val.indexOf('-') > 0) ||
                            input_val.split('-').length < 2 ||
                            !obj.isNumber(input_val.split('-')[0]) ||
                            !obj.isNumber(input_val.split('-')[1])
                        ) {
                            error = error + 1;
                            input_val = '1-200';
                        }
                        key_info['key_name'] = childnodes.childNodes[0].textContent.split('▶')[1];
                        key_info['press_num'] = input_val.split('-')[0];
                        key_info['press_interval'] = input_val.split('-')[1];
                        key_info['css_path'] = childnodes.childNodes[3].textContent;
                        if (childnodes.childNodes[3].textContent == "refresh_page") {
                            key_info['press_num'] = '1';
                        }
                        if (input_val.split('-')[0] != '0') {
                            obj_plans[plan_id]['keys'][host].push(key_info);
                        }
                    }
                    if (obj_plans[plan_id]['keys'][host].length == 0) {
                        delete obj_plans[plan_id]['keys'][host];
                    }
                    GM_setValue("obj_plans", JSON.stringify(obj_plans));
                }
            }

            if (error > 0) {
                listen_click = '0';
                obj.swal_info(null, "发现有错误的配置项，已将错误的配置项自动调整为1-200！", null, function () { location.reload(); })
            } else {
                location.reload();
            }
        });
        $2('#planCompleted').click(function () {
            for (let i = 0; i < $2('.dynamicHostSpan').length; i++) {
                if ($2('.dynamicHostSpan')[i].innerText.indexOf('未保存') > 0) {
                    obj.swal_fadeAway("请先保存本页！", 1200);
                    return;
                }
            }
            GM_setValue('newPlanFinish', '1');
            obj_plans[$2("#planId").text()]['isfinish'] = '1';
            GM_setValue("obj_plans", JSON.stringify(obj_plans));
            location.reload();
        });
        $2('#temporaryBlock').click(function () {
            obj.swal_info(null, "鼠标放在悬浮球上点击中键也可临时屏蔽悬浮球", "我知道了", function () {
                $2('#float_assistant').css('display', 'none');
            })
        });
        $2('#save_temporaryBlock').click(function () {
            var textarea_text = $2('#textarea_xzs').val();
            GM_setValue('blockUrl', textarea_text);
            //保存白名单
            var textarea_text = $2('#textarea_wlist').val();
            var arry_wlist = textarea_text.split("\n");
            var str_wlist = obj.uniqueArr(arry_wlist).join("\n");
            GM_setValue('passUrl', str_wlist);
            for (let i = 0; i < $2('.radio_ss').length; i++) {
                if ($2('.radio_ss')[i].checked) {
                    GM_setValue('BWlist_sel', $2('.radio_ss')[i].value);
                    break;
                }
            }
            obj.swal_info(null, "保存成功！", "确定", function () {
                location.reload();
            });
        });
        $2('#permanentlyBlock').click(function () {
            var textarea_text = $2('#textarea_xzs').val();
            var textarea_hosts = textarea_text.split("\n");
            if (textarea_hosts.length > 0 && $2.inArray(location.host, textarea_hosts) > -1) {
                obj.swal_info(null, "本域名已在屏蔽列表！");
            } else {
                textarea_hosts.push(location.host);
                var textarea_hosts = textarea_hosts.filter(function (s) {
                    return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
                });
                var val_new_url = textarea_hosts.join("\n");
                $2('#textarea_xzs').val(val_new_url);
                GM_setValue('blockUrl', val_new_url);
                obj.swal_info(null, "添加成功！", null, function () {
                    $2('#float_assistant').css('display', 'none');
                });
            }
        });
        $2('#passThisPage').click(function () {
            $2('#textarea_wlist').val(location.host + "\n" + $2('#textarea_wlist').val());
        });
        $2('#button_add_refresh').click(function () {
            listen_click = '0';
            obj.swal_info(null,
                "小提示:\n1.添加刷新页面按钮后，将无法继续捕获按钮\n2.刷新页面按钮前必须有已经捕获的按钮\n3.刷新页面按钮只能添加一个\n4.刷新操作将在所有按钮点击完毕后执行",
                "确定添加",
                function () {
                    if (document.getElementById(location.host) == null) {
                        obj.swal_fadeAway("添加刷新之前必须要有已捕捉的按钮！", 1200);
                    } else if (document.getElementById(location.host + "_refresh_page")) {
                        obj.swal_fadeAway("刷新页面操作只能添加一个！", 1200);
                    } else {
                        var new_div = document.createElement("div");
                        new_div.className = 'dynamicDIV';
                        var new_span = document.createElement("span");
                        new_span.innerText = '▶刷新页面';
                        new_span.style.color = 'red';
                        new_span.title = '▶刷新页面';
                        new_span.className = 'dynamicSpan';
                        new_div.appendChild(new_span);
                        new_span = document.createElement("span");
                        new_span.innerHTML = '&nbsp&nbsp&nbsp&nbsp配置：';
                        new_span.title = '例：按钮总共点击3次，与上一个按钮间隔200毫秒，输入3-200';
                        new_span.style.color = 'green';
                        new_span.style.verticalAlign = 'middle';
                        new_div.appendChild(new_span);
                        var new_input = document.createElement("input");
                        new_input.className = 'dynamicInput';
                        new_input.placeholder = '刷新按钮只能配置为1-xx';
                        // new_input.style.display = 'none';
                        new_input.value = '1-200';
                        new_div.appendChild(new_input);
                        new_input.id = location.host + "_refresh_page";
                        new_span = document.createElement("span");
                        new_span.innerHTML = 'refresh_page';
                        new_span.style.display = 'none';
                        new_div.appendChild(new_span);
                        document.getElementById(location.host).appendChild(new_div);
                    }
                })
        });
        $2('#button_capture').click(function () {
            if ($2("#button_capture").text() == '按钮捕获') {
                $2("#button_capture").text('结束捕获');
                $2("#button_capture").css('backgroundColor', '#ffcc00');
                $2("#button_capture").css('color', '#000000');
                listen_click = '1';
            } else {
                $2("#button_capture").text('按钮捕获');
                $2("#button_capture").css('backgroundColor', '#1e90ff');
                $2("#button_capture").css('color', '#ffffff');
                listen_click = '0';
            }
            var allDom = document.querySelectorAll('*');
            NodeList.prototype.forEach = Array.prototype.forEach;
            allDom.forEach((item) => {

                if (item.nodeName.toUpperCase() == 'SCRIPT') {
                    item.remove()
                }
                if (item.nodeName.toUpperCase() == 'A') {
                    item.href = "#";
                }
                if (item.nodeName.toUpperCase() == 'BODY' || item.nodeName.toUpperCase() == 'HTML') {
                    // item.style.backgroundColor = "rgba(78,110,242,0)"
                }
                else if (obj.isParent(item, document.getElementById("coupon-wrap-qr"))) {

                }
                else {
                    if (!obj.isParent(document.getElementById("coupon-wrap-qr"), item)) {
                        item.onfocus = function (evt) {
                            let event = evt || window.event;
                            let target = event.target || event.srcElement;

                            obj.captureExecution(target);
                            event.stopImmediatePropagation();
                            event.preventDefault();
                        }
                        item.onclick = function (evt) {
                            let event = evt || window.event;
                            let target = event.target || event.srcElement;
                            obj.captureExecution(target);

                            event.stopImmediatePropagation();
                            event.preventDefault();
                        }
                        item.style.cursor = 'pointer'
                        var color = item.style.backgroundColor;
                        item.onmouseenter = function () { item.style.backgroundColor = "rgba(78,110,242,0.15)"; }
                        item.onmouseleave = function () { item.style.backgroundColor = color; }
                    } else {
                        console.log(item);
                    }
                }
            })
        });
        $2('#button_exportPlan').click(function () {
            var obj_plan_tmp = {};
            if (!obj.hasSelectPlan()) {
                return;
            }
            var select_val = $2("#panicBuyingPlan").val();
            obj_plan_tmp[select_val] = obj_plans[select_val];
            var plan_str = JSON.stringify(obj_plan_tmp);
            obj.swal_info("方案序列化结果", plan_str, '复制', function () {
                GM_setClipboard(plan_str, 'text');
                obj.swal_fadeAway('复制成功', 1200);
            })
        });
        $2('#button_importPlan').click(function () {
            swal("请粘贴序列化后的方案", {
                content: "input",
            })
                .then((value) => {
                    obj.importPlan('plugin', value);
                });
        });
        $2('#shareToBbs').click(function () {
            if (!obj.hasSelectPlan()) {
                return;
            } else {
                var obj_plan_tmp = {};
                var select_val = $2("#panicBuyingPlan").val();
                obj_plan_tmp[select_val] = obj_plans[select_val];
                var plan_str = JSON.stringify(obj_plan_tmp);
                GM_setClipboard(plan_str, 'text');
                obj.swal_fadeAway("复制成功！正在打开论坛", 1200);
                GM_openInTab('https://bbs.youyizhineng.top/d/15', { active: true, setParent: true });
            }
        });
        $2('#importFromBbs').click(function () {
            GM_openInTab('https://bbs.youyizhineng.top/t/share', { active: true, setParent: true });
        });
        var newPlanFinish = GM_getValue('newPlanFinish');
        if (newPlanFinish == '0') {
            obj.switchToNew('');
        }
        obj.timing();
        //绑定屏蔽网址
        $2('#textarea_xzs').val(blockUrl);
        //绑定白名单
        $2("#textarea_wlist").val(passUrl);
        // obj.getNewVersion();
    }
    //#endregion 抢购助手初始化
    //#region obj.syntime 同步功能
    obj.syntime = function () {
        $2('#time_syncResult').html('同步中...');
        var syn_time_api_select = $2("#syn_time_api").val();
        if (syn_time_api_select == 'local') {
            $2('#time_span_ms').html(obj.get_date_now_ms());
            $2('#time_syncResult').html('同步本地时间成功');
        } else {
            if ($2("#syn_time_api").val().indexOf('youyizhineng.top') > 0) {
                var url_salt = syn_time_api_select + "&salt=" + Math.random();
            } else {
                var url_salt = syn_time_api_select;
            }
            // console.log(url_salt);
            var now1 = Number(obj.get_date_now_ms());
            var now2 = Number(obj.get_date_now_ms());
            GM_xmlhttpRequest({
                url: url_salt,
                method: 'GET',
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cache-Control': 'public'
                },
                onload: function (xhr) {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        now2 = Number(obj.get_date_now_ms());
                        var res = xhr.responseText;//获取到json字符串，解析sysTime1
                        if ($2("#syn_time_api").val().indexOf('youyizhineng.top') > 0) {
                            var data = JSON.parse(res);
                            console.log(data);
                            $2('#time_span_ms').html(Number(data.serverTime) + parseInt((now2 - now1) / 2));
                            $2('#time_syncResult').html('同步京东服务器时间成功！');
                        } else if ($2("#syn_time_api").val().indexOf('taobao.com') > 0) {
                            var data = JSON.parse(res);
                            console.log(data);
                            $2('#time_span_ms').html(Number(data.data.t) + parseInt((now2 - now1) / 2));
                            $2('#time_syncResult').html('同步淘宝服务器时间成功！');
                        } else if ($2("#syn_time_api").val().indexOf('suning.com') > 0) {
                            var data = JSON.parse(res);
                            var sn_time = new Date(data.sysTime2);
                            $2('#time_span_ms').html(Number(sn_time) + parseInt((now2 - now1) / 2));
                            $2('#time_syncResult').html('同步苏宁服务器时间成功！');
                        } else if ($2("#syn_time_api").val().indexOf('pinduoduo.com') > 0) {
                            var data = JSON.parse(res);
                            console.log(data);
                            $2('#time_span_ms').html(Number(data.server_time) + parseInt((now2 - now1) / 2));
                            $2('#time_syncResult').html('同步拼多多服务器时间成功！');
                        } else if ($2("#syn_time_api").val().indexOf('vmall.com') > 0) {
                            var data = JSON.parse(res);
                            console.log(data);
                            $2('#time_span_ms').html(Number(data.currentTime) + parseInt((now2 - now1) / 2));
                            $2('#time_syncResult').html('同步华为商城服务器时间成功！');
                        } else if ($2("#syn_time_api").val().indexOf('mi.com') > 0) {
                            console.log(res);
                            var xmTimestamp = res.split('=')[1];
                            $2('#time_span_ms').html(Number(xmTimestamp) * 1000 + parseInt((now2 - now1) / 2));
                            $2('#time_syncResult').html('同步小米有品服务器时间成功！');
                        } else {
                            var responseHeaders = xhr.responseHeaders.split("\n");
                            try {
                                for (let i = 0; i < responseHeaders.length; i++) {
                                    if (responseHeaders[i].split("date:").length > 1) {
                                        // console.log(responseHeaders[i].split("date:")[1]);
                                        var sn_time = new Date(responseHeaders[i].split("date:")[1]);
                                        $2('#time_span_ms').html(Number(sn_time) + parseInt((now2 - now1) / 2));
                                        $2('#time_syncResult').html('同步当前页面服务器时间成功！');
                                        break;
                                    }
                                }
                            } catch (e) {
                                $2('#time_span_ms').html(obj.get_date_now_ms());
                                $2('#time_syncResult').html('同步发生错误，已切换同步本地时间');
                            }
                        }
                    } else {
                        $2('#time_span_ms').html(obj.get_date_now_ms());
                        $2('#time_syncResult').html('同步发生错误，已切换同步本地时间');
                    }
                }
            });
        }
    }
    //#endregion
    obj.getAssistantHtml = function (type) {
        var html = '';
        if (type != 'detailPage') {
            html = html +
                '<div id="float_assistant">' +
                '<div id="coupon-wrap-qr" class="coupon-wrap-qr" style="display:inline-block;">' +
                '   <div class="tabsholder2" style="display:inline-block;">';
        }
        html = html +
            '<div data-tab="抢购助手">' +
            '    <div class="div-helper-box" style="margin-bottom:10px;" >' +
            '        <span id="pluginUpdate" style="cursor:pointer;color:#1e90ff;display:none;">插件有更新,点击更新</span>' +
            '    </div>' +
            '    <div class="div-helper-box" style="margin:0px;">' +
            '        <span>查看教程：</span>' +
            '        <span id="viewTutorial" style="cursor:pointer;color:#1e90ff;">点击查看教程</span>' +
            '        <span id="viewDescription" style="cursor:pointer;color:#3b9d3b;margin-left:20px;font-weight:700">>>展开说明</span>' +
            // '        <a href="#" id="viewTutorial" style="border:0px;box-shadow:;-webkit-box-shadow:;">点击查看教程</a>' +
            '    </div>' +
            '    <div class="div-helper-box">' +
            '        <span>执行中的：</span>' +
            '        <select id="inProgress" style="width:165px;">' +
            '           <option disabled selected>---请选择---</option>' +
            '        </select>' +
            '        <button id="button_delTask" style="background-color: #1E90FF;">停止任务</button>' +
            '    </div>' +
            '    <div class="div-helper-box sys-description" style="margin:0px;">' +
            '        <span style="color:#3b9d3b">▲当前执行中的任务，若任务执行影响正常浏览，可以停止对应的任务</span>' +
            '    </div>' +
            '    <div class="div-helper-box">' +
            '        <span>当前时间：</span>' +
            '        <span id="time_span" style="display:inline-block;width: 160px;"></span>' +
            '        <span id="time_span_ms" style="display:none;"></span>' +
            '        <span id="time_syncResult" style="color: green;">未同步</span>' +
            '    </div>' +
            '    <div class="div-helper-box sys-description" style="margin:0px;">' +
            '        <span style="color:#3b9d3b">▲当前时间，同步之后才会准确，最好在快开始抢购时候同步一次</span>' +
            '    </div>' +
            '    <div class="div-helper-box">' +
            '        <span>同步时间：</span>' +
            '        <select id="syn_time_api" style="width:165px;">' +
            '            <option value="local">源：本地时间</option>' +
            '            <option value="https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp">源：淘宝服务器时间</option>' +
            '            <option value="https://www.youyizhineng.top//query_coupon/query_coupon_v210120.php?operate=syn_time&type=jd">源：京东服务器时间</option>' +
            '            <option value="https://quan.suning.com/getSysTime.do">源：苏宁服务器时间</option>' +
            '            <option value="https://api.pinduoduo.com/api/server/_stm">源：拼多多服务器时间</option>' +
            '            <option value="https://mbuy.vmall.com/getSkuRushbuyInfo.json">源：华为商城服务器时间</option>' +
            '            <option value="https://tptm.hd.mi.com/gettimestamp">源：小米有品服务器时间</option>' +
            '            <option value="' + location.href + '">源：本页面服务器（精确到秒）</option>' +
            '        </select>' +
            '        <button id="button_syn" style="background-color: #1E90FF;">同步时间</button>' +
            '    </div>' +
            '    <div class="div-helper-box sys-description" style="margin:0px;">' +
            '        <span style="color:#3b9d3b">▲选择同步时间源，那个平台就选哪个源，点击同步时间可以同步一次</span>' +
            '    </div>' +
            '    <div class="div-helper-box">' +
            '        <span>抢购时间：</span>' +
            '        <input class="butyInput" type="text" id="set_time" style="width:158px;" placeholder="格式:2020-11-11 11:59:59">' +
            '        <button id="button_getCurrentTime" style="background-color: #1E90FF;">获取当前</button>' +
            '        <select id="earlyOrLate">' +
            '            <option value="inAdvance">提前</option>' +
            '            <option value="postpone">延后</option>' +
            '        </select>' +
            '        <!-- <span>&nbsp&nbsp&nbsp&nbsp提前</span> -->' +
            '        <input class="butyInput" type="text" id="set_time_ms" style="width: 30px;">' +
            '        <span>毫秒</span>' +
            '    </div>' +
            '    <div class="div-helper-box sys-description" style="margin:0px;">' +
            '        <span style="color:#3b9d3b">▲设置抢购时间，可以设置提前或者延后，提前和延后的值根据自己的经验设置，不设置则为0</span>' +
            '    </div>' +
            '    <div class="div-helper-box">' +
            '        <span>抢购方案：</span>' +
            '        <select  style="width:165px;" id="panicBuyingPlan">' +
            '        <option disabled selected>---请选择---</option>' +
            '        </select>' +
            '        <img id="imgPlanInfo" src="https://s3.ax1x.com/2020/11/30/Dgx1vq.png">' +
            '        <button id="button_newPlan">新建方案</button>' +
            '        <button id="button_editPlan">编辑方案</button>' +
            '    </div>' +
            '    <div class="div-helper-box">' +
            '        <span style="visibility:hidden">我来占位：</span>' +
            '        <button id="button_delPlan" style="background-color:red">删除方案</button>' +
            '        <button id="button_exportPlan">导出方案</button>' +
            '        <button id="button_importPlan">导入方案</button>' +
            '        <button id="shareToBbs" style="background-color:#ea7460;width=90px">分享到论坛</button>' +
            '        <button id="importFromBbs" style="background-color:#ea7460;width=90px">从论坛导入</button>' +
            '    </div>' +
            '    <div class="div-helper-box sys-description" style="margin:0px;">' +
            '        <span style="color:#3b9d3b">▲抢购方案选择、新建、编辑、导入、导出</span>' +
            '    </div>' +
            '    <div class="div-helper-box">' +
            '        <span>持续时间：</span>' +
            '        <input class="butyInput" type="text" id="duration" style="width:30px;">' +
            '        <span>秒(默认60秒) </span>  <span style="color:green">说明：从抢购时刻开始的持续抢购时间</span>' +
            '    </div>' +
            '    <div class="div-helper-box sys-description" style="margin:0px;">' +
            '        <span style="color:#3b9d3b">▲从抢购时刻开始的持续抢购时间，若设置的时间过长，抢购任务会一直抢购，可在“进行中的”停止任务。</span>' +
            '    </div>' +
            '    <div class="div-helper-box">' +
            '        <span>运行状态：</span>' +
            '        <input class="butyInput" type="text" id="runStatus" style="width: 300px;background-color: #f8f8f8;" readonly="readonly">' +
            '    </div>' +
            '    <div class="div-helper-box">' +
            '        <button id="button_startMonitoring" class="notRun">开始监控</button>' +
            '        <button id="button_startNow" class="notRun">立即执行</button>' +
            '    </div>' +
            '    <div class="div-helper-box sys-description" style="margin:0px;">' +
            '        <span style="color:#3b9d3b">▲开始监控：到设置的时间点后执行。立即执行：在现在时刻直接执行方案</span>' +
            '    </div>' +
            '</div>' +
            '<div data-tab="新方案">' +
            '    <div class="div-helper-box" style = "display:none;">' +
            '        <span id="planId"></span>' +
            '        <span id="isFinish"></span>' +
            '    </div>' +
            '    <div class="div-helper-box">' +
            '        <span>方案名称：</span>' +
            '        <input id="planName" class="butyInput" type="text" style="width: 150px;">' +
            '    </div>' +
            '    <div class="div-helper-box">' +
            '        <span>方案描述：</span>' +
            '        <input id="planInfo" class="butyInput" type="text" style="width: 250px;">' +
            '    </div>' +
            '    <div class="div-helper-box">' +
            '        <div>' +
            '           <span style="display:block;text-align:center;background-color:#f3f1f1;">▼已捕获按钮流▼</span>' +
            '        </div>' +
            '    </div>' +
            '    <div class="div-helper-box">' +
            '        <div id="displayButton">' +
            '        </div>' +
            '    </div>' +
            '    <div class="div-helper-box">' +
            '        <button id="button_capture" style="background-color: #1E90FF;">按钮捕获</button>' +
            '        <button id="button_saveThisPage" style="background-color: #1E90FF;">保存本页</button>' +
            '        <span style="display:inline-block;width:30px"></span>' +
            '        <button id="button_add_mjd">+京东快速通道</button>' +
            '        <button id="button_add_refresh">+刷新页面</button>' +
            '    </div>' +
            '    <div class="div-helper-box">' +
            '        <button id="planCompleted">保存方案</button>' +
            '    </div>' +
            '</div>';
        if (type != 'detailPage') {
            html = html +
                '<div data-tab="设置">' +
                '    <div class="div-helper-box">' +
                '        <input class="radio_ss" type="radio" name="urlMode" value="black_mode">黑名单模式 ' +
                '        <input class="radio_ss" type="radio" name="urlMode" value="white_mode">白名单模式' +
                '    </div>' +
                '   <div class="div-helper-box">' +
                '       <span style="display: block;">屏蔽网址（黑名单）：网址与网址之间需要换行</span>' +
                '       <textarea id="textarea_xzs" rows="10" cols="80" style="border: 1px solid;"></textarea>' +
                '   </div>' +
                '   <div class="div-helper-box">' +
                '       <span style="display: block;">放行网址（白名单）：网址与网址之间需要换行,方案中的网址自动加入白名单</span>' +
                '       <textarea id="textarea_wlist" rows="10" cols="80" style="border: 1px solid;"></textarea>' +
                '   </div>' +
                '   <div class="div-helper-box" style="text-align:right">' +
                '           <button id="save_temporaryBlock">保存</button>' +
                '   </div>' +
                '   <div class="div-helper-box">' +
                '       <span style="display: block;color:green">临时屏蔽仅本次生效</span>' +
                '       <span style="display: block;color:green">永久屏蔽后可在上面删除对应的网站解除屏蔽</span>' +
                '       <span >本页操作：</span>' +
                '       <button id="temporaryBlock">临时屏蔽</button>' +
                '       <button id="permanentlyBlock" style="background-color:red">永久屏蔽</button>' +
                '       <button id="passThisPage" style="background-color:green;width:110px">添加本页到白名单</button>' +
                '   </div>' +
                '</div>' +
                '    </div>' +
                '    </div>' +
                '    </div>' +
                '</div>';
        }
        return html;
    }
    obj.generateCouponArea = function () {
        var productId = ''; var operate = ''; var singleOrlist = '';
        var site_type_chinese = "淘宝";
        if (obj.site_type() == "taobao_details_page") {
            operate = 'quert_single';
            singleOrlist = 'itemid';
            obj.get_data();
            if (stop == '1') { return; }
            var params = location.search.split("?")[1].split("&");
            for (var index in params) {
                if (params[index].split("=")[0] == "id") {
                    productId = params[index].split("=")[1]; break;
                }
            }
            site_type_chinese = "淘宝";
        }
        else if (obj.site_type() == "jingdong_details_page") {
            operate = 'quert_single_jd';
            singleOrlist = 'itemid';
            //get data
            obj.get_data();
            if (stop == '1') { return; }
            productId = location.href.split("//")[1].split("/")[1].split(".")[0];
            site_type_chinese = "京东";
        }
        else if (obj.site_type() == "vip_detail_page" || obj.site_type() == "vip_detail_page_m") {
            operate = 'quert_list_vip';
            singleOrlist = 'itemid_list';
            //get data
            obj.get_data();
            if (stop == '1') { return; }
            productId = location.href.split("-")[location.href.split("-").length - 1].split(".")[0];
            site_type_chinese = "唯品会";
        }
        else if (obj.site_type() == "kaola_detail_page") {
            operate = 'kaola_single';
            singleOrlist = 'itemid_list';
            // //get data
            // obj.get_data();
            // if (stop == '1') { return; }
            productId = location.href.split("/product/")[1].split(".")[0];
            site_type_chinese = "考拉海购";
        }
        else if (obj.site_type() == "suning_detail_page") {
            operate = 'suning_single';
            singleOrlist = 'itemid';
            // //get data
            // obj.get_data();
            // if (stop == '1') { return; }
            // var mertCode = location.href.split("product.suning.com/")[1].split(".html")[0].split("/")[0];
            var commCode = location.href.split("product.suning.com/")[1].split(".html")[0].split("/")[1];
            productId = commCode;
            site_type_chinese = "苏宁易购";
        }

        var url = "https://www.youyizhineng.top/query_coupon/query_coupon_v210120.php?operate=" + operate + "&" + singleOrlist + "=" + productId;
        console.log(url);
        var xhr = new XMLHttpRequest();//第一步：新建对象
        xhr.open('GET', url, true);//第二步：打开连接  将请求参数写在url中
        xhr.send();//第三步：发送请求  将请求参数写在URL中
        /**
         * 获取数据后的处理程序
         */
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var res = xhr.responseText;//获取到json字符串，解析
                var data;
                if (obj.site_type() == "taobao_details_page") {
                    data = JSON.parse(res);
                }
                else if (obj.site_type() == "jingdong_details_page" || obj.site_type() == "vip_detail_page" || obj.site_type() == "vip_detail_page_m" || obj.site_type() == "kaola_detail_page" || obj.site_type() == "suning_detail_page") {
                    var data_tmp = JSON.parse(res);
                    data = data_tmp[productId];
                }
                var couponArea;
                if (data.couponmoney == 0) {
                    couponArea =
                        //#region 无优惠券显示
                        '<div class="coupon-wrap">' +
                        '   <div class="stamp stamp04">' +
                        '       <div class="par" >' +
                        '           <sub class="sign" style="vertical-align: baseline;display:none;">返</sub>' +
                        '           <span id="faceValue" style="font-size:18px;line-height:50px">暂无隐藏优惠券</span><p></p>' +
                        '           <p id="faceValueExplain" style="font-size:8px"></p>' +
                        '       </div>' +
                        '       <div id="copy_div" class="copy" style="display:none;">返现' +
                        '           <p>无优惠券<br>有返现</p>' +
                        '           <a id="a_scanCodeCashback">' + "扫码返现" + '</a>' +
                        '       </div>' +
                        '       <i></i>' +
                        '   </div>' +
                        '</div>';
                    //#endregion 优惠券显示
                } else {
                    var howToGetCoupons = '直接领券';
                    couponArea =
                        //#region 有优惠券显示
                        '<div class="coupon-wrap">' +
                        '   <div class="stamp stamp04">' +
                        '       <div class="par">' +
                        '           <sub class="sign" style="vertical-align: baseline;">￥</sub>' +
                        '           <span style="font-size:20px;">' + data.couponmoney + '</span>' +
                        '           <p>' + data.couponexplain + '</p>' +
                        '       </div>' +
                        '       <div class="copy">优惠券' +
                        '           <p>' + data.couponstarttime + "<br>" + data.couponendtime + '</p>' +
                        '           <a href="' + data.url1 + '">' + howToGetCoupons + '</a>' +
                        '       </div>' +
                        '       <i></i>' +
                        '   </div>' +
                        '</div>';
                    //#endregion 有优惠券显示
                }
                //#region 返现文字
                if (data.return_money_rate == 0) {
                    var span_text = '暂无返现';
                    var other_text = '其他功能';
                    var html_qr_code = '<img class="qr-img" src="https://s1.ax1x.com/2020/10/26/BnY7jS.png"></img>' +
                        '<span class="title">「花前省一省」是一款领券返现的APP，支持淘宝、天猫、京东、拼多多、唯品会等等主流平台~还有点外卖领券返现，电影票优惠购，全网vip视频免费看等功能，让您花钱之前，再省一省</span>' +
                        '<span class="foot" style="height:20px;">扫码下载，支持IOS和安卓，也可在各大应用市场下载</span>';
                } else {
                    var span_text = '返现查询中...';
                    var other_text = '点击领取返现';
                    var html_qr_code = '<div id="qrcode"></div>' +
                        '<span class="title">获得返现只需三步~</br></br>①应用商店下载APP：花前省一省</br>②使用APP主页扫一扫功能扫左侧生成的商品码</br>③选择自购省，从花前省一省APP跳转到' + site_type_chinese + 'APP下单，确认收货后返现将进入花前省一省APP账户余额~</br><br></span>' +
                        '<span class="foot" style="height:20px">支持IOS和安卓，各大应用市场均有下载</br></span>' +
                        '<span class="foot" style="height:20px;color:green;font-weight:700;display: block; text-align: right;">花前省一省--花钱之前，再省一省</span>';
                }
                //#endregion 返现文字
                couponArea = couponArea +
                    '<div class="coupon-wrap-rm">' +
                    '   <div class="rm-div" style="width:600px;text-align:center">' +
                    '       <span id="rm_money">' + span_text + '</span>' +
                    '       <div class="rm-btn" id="a_click">' + other_text + '</div>' +
                    '   </div>' +
                    '</div>' +

                    '<div id="coupon-wrap-qr" class="coupon-wrap-qr">' +
                    '   <div class="tabsholder2">';
                //#region 返现码
                couponArea = couponArea +
                    '       <div data-tab="返现码">' +
                    '           <div class="qr-code-div">' +
                    html_qr_code +
                    '           </div>' +
                    '       </div>';
                //#endregion
                //#region 价格走势
                couponArea = couponArea +
                    '       <div data-tab="价格走势">' +
                    '           <div class="coupon-wrap-rm">' +
                    '               <div class="rm-div">' +
                    '                   <div class="trend-btn" id="trend_click">历史价格走势<img class="trend-btn-img" src="https://s1.ax1x.com/2020/10/26/BnY0t1.png" alt=""></div>' +
                    '                   <img  class="image-status" >' +
                    '                   <em class="status-span"></em>' +
                    '               </div>' +
                    '           </div>' +
                    '           <div class="trend-div">' +
                    '               <div id="chart"></div>' +
                    '           </div>' +
                    '       </div>';
                //#endregion
                //#region 抢购助手
                couponArea = couponArea + obj.getAssistantHtml('detailPage');
                //#endregion
                //#region 动态
                if (data.tab_html != null && data.tab_html != '') {
                    couponArea = couponArea + data.tab_html;
                }
                //#设置页
                couponArea = couponArea +
                    '<div data-tab="设置">' +
                    '    <div class="div-helper-box">' +
                    '        <label for="" style="width: 300px;display: block;">请选择默认展示内容</label>' +
                    '    </div>' +
                    '    <div class="div-helper-box">' +
                    '        <input class="radio_s" type="radio" name="sex" value="hide">全部隐藏' +
                    '        <input class="radio_s" type="radio" name="sex" value="qrcode">返现码' +
                    '        <input class="radio_s" type="radio" name="sex" value="trend">价格走势' +
                    '        <input class="radio_s" type="radio" name="sex" value="assistant">抢购助手' +
                    '    </div>' +
                    '    <div class="div-helper-box">' +
                    '        <label for="" style="width: 300px;display: block;">请选择悬浮球屏蔽模式</label>' +
                    '    </div>' +
                    '    <div class="div-helper-box">' +
                    '        <input class="radio_ss" type="radio" name="shieldMode" value="black_mode">黑名单模式' +
                    '        <input class="radio_ss" type="radio" name="shieldMode" value="white_mode">白名单模式' +
                    '    </div>' +
                    '    <div class="div-helper-box">' +
                    '        <button id="button_saveSetting">保存</button>' +
                    '    </div>' +
                    '</div>';
                //#endregion
                couponArea = couponArea +
                    '   </div>' +
                    '</div>';
                var ls = setInterval(function () {
                    if ($2(".coupon-wrap").length == 0) {
                        if (obj.site_type() == "taobao_details_page") {
                            if ($2(".tm-fcs-panel").length > 0) {
                                $2(".tm-fcs-panel").after(couponArea);
                            } else if ($2("ul.tb-meta").length > 0) {
                                $2("ul.tb-meta").after(couponArea);
                            }
                            var qr_code_text = obj.DetailPageTB_or_TM_or_JD() + '//' + productId;
                        } else if (obj.site_type() == "jingdong_details_page") {
                            if (location.href.indexOf('//item.jd.com') > 0 || location.href.indexOf('//i-item.jd.com') > 0) {
                                if ($2(".summary-first").length > 0) {
                                    $2(".summary-first").after(couponArea);
                                }
                                else if ($2("#summary").length > 0) {
                                    $2("#summary").after(couponArea);
                                }
                                else if ($2("#pingou").length > 0) {
                                    $2("#pingou").after(couponArea);
                                }
                            } else if (location.href.indexOf('//item.jd.hk') > 0) {
                                if ($2(".summary-first").length > 0) {
                                    $2(".summary-first").after(couponArea);
                                }
                                else if ($2("#summary").length > 0) {
                                    $2("#summary").after(couponArea);
                                }
                                else if ($2("#summary-wrap").length > 0) {
                                    $2("#summary-wrap").after(couponArea);
                                }
                                else if ($2(".summary").length > 0) {
                                    $2(".summary").after(couponArea);
                                }
                            } else if (location.href.indexOf('//pcitem.jd.hk') > 0) {
                                if ($2(".summary").length > 0) {
                                    $2(".summary").after(couponArea);
                                }
                            }
                            var qr_code_text = obj.DetailPageTB_or_TM_or_JD() + '//' + productId;
                        } else if (obj.site_type() == "vip_detail_page" || obj.site_type() == "vip_detail_page_m") {
                            if ($2("#J-pi-price-box").length > 0) {
                                $2("#J-pi-price-box").after(couponArea);
                            }
                            var qr_code_text = location.href.split("?")[0] + "?/--/vipvip";
                        } else if (obj.site_type() == "kaola_detail_page") {
                            if ($2(".m-price-wrap").length > 0) {
                                $2(".m-price-wrap").after(couponArea);
                            }
                            var qr_code_text = location.href.split("?")[0] + "?/--/kaola";
                        }
                        else if (obj.site_type() == "suning_detail_page") {
                            if ($2("#priceDom").length > 0) {
                                $2("#priceDom").after(couponArea);
                            }
                            var qr_code_text = location.href.split("?")[0] + "?/--/suning";
                        }
                        $2('.tabsholder2').cardTabs({ theme: 'wiki' });
                        $2(".coupon-wrap").eq(0).before(data.html);
                        $2("#qrcode").qrcode({ width: 150, height: 150, text: qr_code_text });
                        $2("#a_click").click(function () {
                            $2("#coupon-wrap-qr").css("display", "block");
                            obj.select_tab('返现码', '', 1);
                        });
                        $2('#button_saveSetting').click(function () {
                            for (let i = 0; i < $2('.radio_s').length; i++) {
                                if ($2('.radio_s')[i].checked) {
                                    GM_setValue('radio_s', $2('.radio_s')[i].value);
                                    break;
                                }
                            }
                            for (let i = 0; i < $2('.radio_ss').length; i++) {
                                if ($2('.radio_ss')[i].checked) {
                                    GM_setValue('BWlist_sel', $2('.radio_ss')[i].value);
                                    break;
                                }
                            }
                            obj.swal_fadeAway("保存成功", 1200);
                        });
                        var radio_select = GM_getValue('radio_s', 'qrcode');
                        var stack_children = $2('.card-tabs-stack.wiki')[0].children;
                        var bar_children = $2('.card-tabs-bar.wiki')[0].children;
                        if (radio_select == "hide") {
                            for (let i = 0; i < stack_children.length; i++) {
                                stack_children[i].style.display = "none";
                            }
                            for (let i = 0; i < bar_children.length; i++) {
                                bar_children[i].removeAttribute('class');
                            }
                        } else if (radio_select == "assistant") {
                            obj.select_tab("抢购助手", "", 1);
                        } else if (radio_select == "qrcode") {
                            obj.select_tab("返现码", "", 1);
                        } else if (radio_select == "trend") {
                            obj.select_tab("价格走势", "", 1);
                        }
                        for (let i = 0; i < $2('.radio_s').length; i++) {
                            if ($2('.radio_s')[i].value == radio_select) {
                                $2('.radio_s')[i].checked = true;
                                break;
                            }
                        }
                        for (let i = 0; i < $2('.radio_ss').length; i++) {
                            if ($2('.radio_ss')[i].value == BWlist_sel) {
                                $2('.radio_ss')[i].checked = true;
                                break;
                            }
                        }
                        document.getElementsByClassName("card-tabs-bar wiki")[0].children[2].style.color = '#fb5414';
                        obj.initializePanicBuyingAssistant();
                        obj.query_trend_data();
                        var mouse_TO1;

                        // if (obj.site_type() == "taobao_details_page") {
                        //     $2("#qrcode_coupon").qrcode({ width: 140, height: 140, text: data.url1, correctLevel: 0 });
                        //     $2("#button_getCoupon").mouseenter(function () {
                        //         $2('#coupon_float_qr').css("display", "inline-block");
                        //     });
                        //     $2("#button_getCoupon").mouseleave(function () {
                        //         $2('#coupon_float_qr').css("display", "none");
                        //     });
                        // }
                        clearInterval(ls);
                        return;
                    }
                }, 100);

                setInterval(function () {
                    var rm = '0';
                    var price = '0';
                    if (obj.site_type() == "taobao_details_page") {
                        var price_str = '';
                        if ($2(".tm-price-panel").find(".tm-price").length > 0) {
                            var price_str = $2(".tm-price-panel").find(".tm-price").html();
                        } else if ($2("#J_StrPrice").find(".tb-rmb-num").length > 0) {
                            var price_str = $2("#J_StrPrice").find(".tb-rmb-num").html();
                        }
                        var price = obj.get_tb_price(price_str);
                        var price_prompt_str = '';
                        if ($2(".tm-promo-price").find(".tm-price").length > 0) {
                            price_prompt_str = $2(".tm-promo-price").find(".tm-price").html();
                        } else if ($2("#J_PromoPriceNum").length > 0) {
                            price_prompt_str = $2("#J_PromoPriceNum").html();
                        }
                        var price_prompt = obj.get_tb_price(price_prompt_str);
                        if (price != null) {
                            if (price_prompt != null && price_prompt != '') {
                                rm = Math.round(Math.floor((price_prompt - data.couponmoney) * data.return_money_rate * 1000) / 10) / 100;
                                if (rm < 0) {
                                    rm = Math.round(Math.floor(price_prompt * data.return_money_rate * 1000) / 10) / 100;
                                }
                            }
                            else {
                                rm = Math.round(Math.floor((price - data.couponmoney) * data.return_money_rate * 1000) / 10) / 100;
                                if (rm < 0) {
                                    rm = Math.round(Math.floor(price * data.return_money_rate * 1000) / 10) / 100;
                                }
                            }
                        }
                    }
                    else if (obj.site_type() == "jingdong_details_page") {
                        if (location.href.indexOf('//item.jd.com')) {
                            if ($2("#summary-price").find("#jd-price").length > 0) {
                                price = $2("#summary-price").find("#jd-price").html().split("</span>")[1];
                            } else if ($2(".p-price").find("span").eq(1).length > 0) {
                                price = $2(".p-price").find("span").eq(1).html();
                            }
                        } else {
                            price = $2(".p-price").find("span").eq(1).html();
                        }

                        if (price > 0) {
                            rm = Math.round(Math.floor((price - data.couponmoney) * data.return_money_rate * 1000) / 10) / 100;
                            if (rm < 0) {
                                rm = Math.round(Math.floor(price * data.return_money_rate * 1000) / 10) / 100;
                            }
                        }
                    }
                    if (obj.site_type() == "vip_detail_page" || obj.site_type() == "vip_detail_page_m" || obj.site_type() == "kaola_detail_page" || obj.site_type() == "suning_detail_page") {
                        if ($2("#rm_money").length > 0) {
                            if (data.return_money > 0) {
                                $2("#rm_money").html("返现约：" + Math.floor(data.return_money * 100) / 100 + "元");
                                if (data.couponmoney == 0) {
                                    $2("#faceValue").html(Math.floor(data.return_money * 100) / 100 + "元");
                                    $2("#faceValueExplain").html("1.花前省一省APP扫返现码跳转<br>2." + site_type_chinese + "APP下单");
                                    $2("#copy_div").css("display", "");
                                    $2(".sign").css("display", "");
                                    $2("#a_scanCodeCashback").css("cursor", "pointer");
                                    $2("#a_scanCodeCashback").click(function () {
                                        $2(".card-tabs-stack.wiki").css("display", "none");
                                        setTimeout(function () {
                                            obj.select_tab('返现码', '', 1);
                                            $2(".card-tabs-stack.wiki").css("display", "block");
                                        }, 200);
                                    });
                                }
                            }
                        }
                    }
                    else if (rm > 0) {
                        var str = '返现约:' + rm + '元'
                        var str1 = rm + '元'
                        $2("#rm_money").html(str);
                        if (data.couponmoney == 0) {
                            if (obj.site_type() != "jingdong_details_page") {
                                $2("#faceValue").html(str1);
                                $2("#faceValueExplain").html("1.花前省一省APP扫返现码跳转<br>2." + site_type_chinese + "APP下单");
                                $2("#copy_div").css("display", "");
                                $2(".sign").css("display", "");
                                $2("#a_scanCodeCashback").css("cursor", "pointer");
                                $2("#a_scanCodeCashback").click(function () {
                                    $2(".card-tabs-stack.wiki").css("display", "none");
                                    setTimeout(function () {
                                        obj.select_tab('返现码', '', 1);
                                        $2(".card-tabs-stack.wiki").css("display", "block");
                                    }, 200);
                                });
                            }
                        }
                    }
                }, 300);
            }
        };
    };

    if (obj.site_type() == "taobao_details_page") {
        obj.generateCouponArea();
    } else if (obj.site_type() == "taobao_lst_page") {
        if (document.title.indexOf("天猫超市") > 0) {
            // return;
        }
        var selectorList = [];
        var url = location.href;
        if (
            url.indexOf("//s.taobao.com/search") > 0 ||
            url.indexOf("//s.taobao.com/list") > 0
        ) {
            selectorList.push(".items .item");
        } else if (url.indexOf("//list.tmall.com/search_product.htm") > 0) {
            selectorList.push(".product");
            selectorList.push(".chaoshi-recommend-list .chaoshi-recommend-item");
        } else if (url.indexOf("//list.tmall.hk/search_product.htm") > 0) {
            selectorList.push("#J_ItemList .product");
        } else if (url.indexOf("//maiyao.liangxinyao.com/shop/view_shop") > 0) {
            selectorList.push("#J_ShopSearchResult .item");
        }
        if (selectorList && selectorList.length > 0) {
            obj.initSearchHtml(selectorList);
            obj.initSearchEvent();
            obj.basicQuery_list();
        }
    } else if (obj.site_type() == "jingdong_details_page") {
        obj.generateCouponArea();
    } else if (obj.site_type() == "jingdong_lst_page") {
        var selectorList_jd = [];
        selectorList_jd.push(".gl-item");
        selectorList_jd.push(".sku-detail");
        obj.initSearchHtml(selectorList_jd);
        obj.initSearchEvent();
        obj.basicQuery_list();
    } else if (obj.site_type() == "vip_list_page") {
        var selectorList_vip = [];
        selectorList_vip.push(".c-goods-item");
        obj.initSearchHtml(selectorList_vip);
        obj.initSearchEvent();
        obj.basicQuery_list();
    } else if (obj.site_type() == "vip_detail_page" || obj.site_type() == "vip_detail_page_m") {
        obj.generateCouponArea();
    } else if (obj.site_type() == "huawei_detail_page") {
        obj.get_data();
    } else if (obj.site_type() == "suning_detail_page") {
        // obj.generateCouponArea();
        //get data
        obj.get_data();
        if (stop == '1') { return; }
    } else if (obj.site_type() == "kaola_detail_page") {
        // obj.generateCouponArea();
        //get data
        obj.get_data();
        if (stop == '1') { return; }
    }

    window.onload = function () {

    }

    $2(document).ready(function () {
        if (obj.site_type() == "jingdong_details_page") {
            //先在页面最下面添加一个快速下单按钮
            var goodsId = location.href.split("//")[1].split("/")[1].split(".")[0];
            var pre_jd_html =
                '<a style="display:none;" href="https://plogin.m.jd.com/login/login?returnurl=' + encodeURI(location.href) + '" id="mjdLogin">登陆</a>' +
                '<a style="display:none;" href="https://wqs.jd.com/order/s_confirm_miao.shtml?sceneval=2&scene=jd&isCanEdit=1&commlist=,,1,' + goodsId + '" id="mjdChannel" style="display:">开始抢购</a>';
            $2('body').append(pre_jd_html);
        }
        setTimeout(() => {
            if (obj.site_type() == "kaola_detail_page") {
                obj.generateCouponArea();
            } else if (obj.site_type() == "suning_detail_page") {
                obj.generateCouponArea();
            }
        }, 300);


        var keysActiveThisPage = [];
        var array_task = obj.getObjKeys(v_cookie);
        for (let i = 0; i < array_task.length; i++) {
            if (array_task[i] == 'mjdLogin') continue;
            console.log('▽方案过期情况▽');
            console.log(array_task[i] + '\n' + obj.judgmentVirtualCookie(array_task[i]));
            if (obj_plans[array_task[i]] == null || obj_plans[array_task[i]] == undefined) {
                obj.delVirtualCookie(array_task[i]);
                continue;
            }

            if (array_task[i].indexOf('plan_') > -1 && v_cookie[array_task[i]]['active'] == '1' && obj.judgmentVirtualCookie(array_task[i])) {
                var objPlan_tmp = obj_plans[array_task[i]]['keys'];
                var host_array = obj.getObjKeys(objPlan_tmp);
                console.log($2.inArray(location.host, host_array) > -1);
                if ($2.inArray(location.host, host_array) > -1) {
                    keysActiveThisPage = JSON.parse(JSON.stringify(obj_plans[array_task[i]]['keys'][location.host]));
                    break;
                }
            }
        }
        console.log('▽keysActiveThisPage▽');
        console.log(keysActiveThisPage);

        if (keysActiveThisPage != undefined && keysActiveThisPage.length > 0) {
            obj.addClickTask(keysActiveThisPage);
        }
        if (obj.site_type() != "jingdong_details_page" &&
            obj.site_type() != "taobao_details_page" &&
            obj.site_type() != "kaola_detail_page" &&
            obj.site_type() != "vip_detail_page" &&
            obj.site_type() != "suning_detail_page" &&
            location.host != "bbs.youyizhineng.top"
        ) {
            console.log(BWlist_sel);
            var passUrl_arry = passUrl.split("\n");
            var plans_arry = obj.getObjKeys(obj_plans);
            for (let i = 0; i < plans_arry.length; i++) {
                var host_arry = obj.getObjKeys(obj_plans[plans_arry[i]]['keys']);
                passUrl_arry = passUrl_arry.concat(host_arry);
            }
            passUrl = obj.uniqueArr(passUrl_arry).join("\n");

            if (BWlist_sel == "black_mode") {
                var blockUrl_arry = blockUrl.split("\n");
                console.log(blockUrl_arry);
                if (!(blockUrl_arry.length > 0 && $2.inArray(location.host, blockUrl_arry) > -1)) {
                    //单独加载抢购助手
                    page_type = 'other_page';
                    $2('body').append(obj.getAssistantHtml());
                    $2('#float_assistant').append('<img id="smallIcon" src="https://s3.ax1x.com/2020/12/15/rKQCod.png" style="display:block;width:22px;height:22px">')
                    $2('.tabsholder2').cardTabs({ theme: 'wiki' });
                    $2('#float_assistant')[0].children[0].style.display = 'none'
                    $2('#float_assistant')[0].style.borderRadius = "999px";
                    obj.initializePanicBuyingAssistant('other_page');
                }
            } else {
                if ($2.inArray(location.host, passUrl_arry) > -1) {
                    //单独加载抢购助手
                    page_type = 'other_page';
                    $2('body').append(obj.getAssistantHtml());
                    $2('#float_assistant').append('<img id="smallIcon" src="https://s3.ax1x.com/2020/12/15/rKQCod.png" style="display:block;width:22px;height:22px">')
                    $2('.tabsholder2').cardTabs({ theme: 'wiki' });
                    $2('#float_assistant')[0].children[0].style.display = 'none'
                    $2('#float_assistant')[0].style.borderRadius = "999px";
                    obj.initializePanicBuyingAssistant('other_page');
                }
                //遍历方案,把方案中的域名添加进入白名单
                // console.log(passUrl);
            }

            for (let i = 0; i < $2('.radio_ss').length; i++) {
                if ($2('.radio_ss')[i].value == BWlist_sel) {
                    $2('.radio_ss')[i].checked = true;
                    break;
                }
            }
        } else {
            //首次安装提醒
            var first_install = GM_getValue('first_install', '1');
            if (first_install == '1') {
                obj.swal_info("温馨提醒", "尊敬的省一省Tampermonkey插件用户，您好：\n\n感谢您一直以来的陪伴，希望本插件及APP给您的购物带来便利。本次插件迎来重大升级:\n\n1. 新增抢购助手，方便您进行整点秒杀等抢购操作\n2. 抢购方案可以自行制定，理论上任何网站抢任何东西都可以使用\n3. 抢购方案支持分享及导入，并设立了论坛方便大家分享及交流反馈\n4. 根据用户的反馈，对页面进行了改版，更节省空间同时可展示内容更丰富，可以设置是否默认展示“返现码”，“价格走势”等功能\n\n本消息仅在首次出现，感谢您的支持，这是我们团队前进的最大动力", "我知道啦", function () {
                    swal("配置完毕请尽情使用~", {
                        icon: "success",
                        buttons: false,
                        timer: 1200,
                    });
                    obj.select_tab("抢购助手", "", 1);
                    var prePlan_str1 = '{"plan_preSet_jdjs":{"plan_name":"预置：京东极速秒杀v1.0","plan_info":"京东极速秒杀方案","plan_type":"1","jd_spike":"1","plan_attributes1":"","plan_attributes2":"","plan_attributes3":"","isfinish":"1","keys":{"wq.jd.com":[{"key_name":"在线支付","press_num":"2","press_interval":"200","css_path":"div#payBtnList > div:nth-of-type(10) > a"}],"pay.m.jd.com":[{"key_name":"打白条支付","press_num":"2","press_interval":"200","css_path":"a.btn.pay-next.confirm-pay"}],"item.jd.com":[{"key_name":"开始抢购","press_num":"1","press_interval":"200","css_path":"a#mjdChannel"}]}}}';
                    var prePlan_str2 = '{"plan_preSet_jdks":{"plan_name":"预置：京东快速下单v1.0","plan_info":"1.加入购物车 2.去购物车结算 3.提交订单 ","plan_type":"1","jd_spike":"0","plan_attributes1":"","plan_attributes2":"","plan_attributes3":"","isfinish":"1","keys":{"item.jd.com":[{"key_name":"加入购物车","press_num":"1","press_interval":"0","css_path":"a#InitCartUrl"}],"cart.jd.com":[{"key_name":"去购物车结算","press_num":"2","press_interval":"200","css_path":"a#GotoShoppingCart"},{"key_name":"去结算","press_num":"2","press_interval":"200","css_path":"a.common-submit-btn"}],"pay.jd.com":[{"key_name":"立即支付","press_num":"50","press_interval":"200","css_path":"div.base-button.pointer-g"}],"trade.jd.com":[{"key_name":"提交订单","press_num":"5","press_interval":"300","css_path":"button#order-submit"}]}}}';
                    var prePlan_str3 = '{"plan_preSet_tbks":{"plan_name":"预置：淘宝、天猫快速下单v1.0","plan_info":"立即购买->提交订单->最终付款","plan_type":"1","jd_spike":"0","plan_attributes1":"","plan_attributes2":"","plan_attributes3":"","isfinish":"1","keys":{"buy.tmall.com":[{"key_name":"提交订单","press_num":"1","press_interval":"200","css_path":"a.go-btn"}],"cashiergan.alipay.com":[{"key_name":"确认付款","press_num":"50","press_interval":"200","css_path":"input#J_authSubmit"}],"detail.tmall.com":[{"key_name":"立即购买","press_num":"1","press_interval":"0","css_path":"a#J_LinkBuy"}],"buy.taobao.com":[{"key_name":"提交订单","press_num":"1","press_interval":"200","css_path":"a.go-btn"}],"item.taobao.com":[{"key_name":"立即购买","press_num":"1","press_interval":"0","css_path":"a.J_LinkBuy"}]}}}';
                    obj.addPlan(prePlan_str1);
                    obj.addPlan(prePlan_str2);
                    obj.addPlan(prePlan_str3);
                    //绑定方案
                    var planss = GM_getValue("obj_plans");
                    var obj_planss = JSON.parse(planss);
                    var arryPlanId = obj.getObjKeys(obj_planss);
                    var select_plans = document.getElementById('panicBuyingPlan');
                    for (let i = 0; i < arryPlanId.length; i++) {
                        if (obj_planss[arryPlanId[i]]['isfinish'] == '0')
                            continue;
                        var new_option = document.createElement('option');
                        new_option.value = arryPlanId[i];
                        new_option.innerText = obj_planss[arryPlanId[i]]['plan_name'];
                        select_plans.appendChild(new_option);
                    }
                    GM_setValue('first_install', '0');
                    GM_setValue('last_ver', version);
                });
            } else {
                var last_ver = GM_getValue('last_ver', '');
                if (last_ver == '' || last_ver < version) {
                    GM_setValue('BWlist_sel', 'white_mode');
                    obj.swal_info(null, "插件更新成功，本次更新\n\n1.新增苏宁易购返现码显示。\n2. 默认悬浮球屏蔽模式为白名单模式", "确定", function () {
                        var prePlan_str1 = '{"plan_preSet_jdjs":{"plan_name":"预置：京东极速秒杀v1.0","plan_info":"京东极速秒杀方案","plan_type":"1","jd_spike":"1","plan_attributes1":"","plan_attributes2":"","plan_attributes3":"","isfinish":"1","keys":{"wq.jd.com":[{"key_name":"在线支付","press_num":"2","press_interval":"200","css_path":"div#payBtnList > div:nth-of-type(10) > a"}],"pay.m.jd.com":[{"key_name":"打白条支付","press_num":"2","press_interval":"200","css_path":"a.btn.pay-next.confirm-pay"}],"item.jd.com":[{"key_name":"开始抢购","press_num":"1","press_interval":"200","css_path":"a#mjdChannel"}]}}}';
                        var prePlan_str2 = '{"plan_preSet_jdks":{"plan_name":"预置：京东快速下单v1.0","plan_info":"1.加入购物车 2.去购物车结算 3.提交订单 ","plan_type":"1","jd_spike":"0","plan_attributes1":"","plan_attributes2":"","plan_attributes3":"","isfinish":"1","keys":{"item.jd.com":[{"key_name":"加入购物车","press_num":"1","press_interval":"0","css_path":"a#InitCartUrl"}],"cart.jd.com":[{"key_name":"去购物车结算","press_num":"2","press_interval":"200","css_path":"a#GotoShoppingCart"},{"key_name":"去结算","press_num":"2","press_interval":"200","css_path":"a.common-submit-btn"}],"pay.jd.com":[{"key_name":"立即支付","press_num":"50","press_interval":"200","css_path":"div.base-button.pointer-g"}],"trade.jd.com":[{"key_name":"提交订单","press_num":"5","press_interval":"300","css_path":"button#order-submit"}]}}}';
                        var prePlan_str3 = '{"plan_preSet_tbks":{"plan_name":"预置：淘宝、天猫快速下单v1.0","plan_info":"立即购买->提交订单->最终付款","plan_type":"1","jd_spike":"0","plan_attributes1":"","plan_attributes2":"","plan_attributes3":"","isfinish":"1","keys":{"buy.tmall.com":[{"key_name":"提交订单","press_num":"1","press_interval":"200","css_path":"a.go-btn"}],"cashiergan.alipay.com":[{"key_name":"确认付款","press_num":"50","press_interval":"200","css_path":"input#J_authSubmit"}],"detail.tmall.com":[{"key_name":"立即购买","press_num":"1","press_interval":"0","css_path":"a#J_LinkBuy"}],"buy.taobao.com":[{"key_name":"提交订单","press_num":"1","press_interval":"200","css_path":"a.go-btn"}],"item.taobao.com":[{"key_name":"立即购买","press_num":"1","press_interval":"0","css_path":"a.J_LinkBuy"}]}}}';
                        obj.addPlan(prePlan_str1);
                        obj.addPlan(prePlan_str2);
                        obj.addPlan(prePlan_str3);
                        //绑定方案
                        var planss = GM_getValue("obj_plans");
                        var obj_planss = JSON.parse(planss);
                        var arryPlanId = obj.getObjKeys(obj_planss);
                        var select_plans = document.getElementById('panicBuyingPlan');
                        for (let i = 0; i < arryPlanId.length; i++) {
                            if (obj_planss[arryPlanId[i]]['isfinish'] == '0')
                                continue;
                            var new_option = document.createElement('option');
                            new_option.value = arryPlanId[i];
                            new_option.innerText = obj_planss[arryPlanId[i]]['plan_name'];
                            select_plans.appendChild(new_option);
                        }
                        GM_setValue('last_ver', version);
                        location.reload();
                    })
                }
            }
        }
        if (obj.site_type() == "kaola_list_page") {
            var selectorList_kaola = [];
            selectorList_kaola.push(".goods.colorsku");
            obj.initSearchHtml(selectorList_kaola);
            obj.initSearchEvent();
            obj.basicQuery_list();
        }
    });

    // window.onload = function () {
    $2(window).load(function () {
        if (location.host == "bbs.youyizhineng.top") {
            //单独加载抢购助手
            page_type = 'other_page';
            $2('body').append(obj.getAssistantHtml());
            $2('#float_assistant').append('<img id="smallIcon" src="https://s3.ax1x.com/2020/12/15/rKQCod.png" style="display:block;width:22px;height:22px">')
            $2('.tabsholder2').cardTabs({ theme: 'wiki' });
            $2('#float_assistant')[0].children[0].style.display = 'none'
            $2('#float_assistant')[0].style.borderRadius = "999px";
            obj.initializePanicBuyingAssistant('other_page');

            setInterval(() => {
                var array_topics = document.getElementsByClassName('language-json hljs');
                for (let i = 0; i < array_topics.length; i++) {
                    if (array_topics[i].hasAttribute('plugin')) {
                        continue;
                    }
                    else {
                        var new_div = document.createElement('div');
                        new_div.style.textAlign = 'left';
                        var new_button = document.createElement('buton');
                        new_button.className = ' SplitDropdown-button Button Button--primary hasIcon';
                        new_button.style.backgroundColor = '#ffcc00';
                        new_button.style.color = '#000000';
                        new_button.innerHTML = '导入方案到小助手';
                        new_button.setAttribute('name', 'yh');
                        new_button.onclick = function () {
                            var plan_str = this.parentNode.previousSibling.querySelector('code').innerText;
                            obj.importPlan('bbs', plan_str);
                        }
                        var new_button_copy = document.createElement('buton');
                        new_button_copy.className = ' SplitDropdown-button Button Button--primary hasIcon';
                        new_button_copy.innerHTML = '复制';
                        new_button_copy.style.float = 'right';
                        new_button_copy.onclick = function () {
                            var plan_str = this.parentNode.previousSibling.querySelector('code').innerText;
                            GM_setClipboard(plan_str, 'text');
                            obj.swal_fadeAway("复制成功", 1200);
                        }
                        new_div.append(new_button);
                        new_div.append(new_button_copy);
                        array_topics[i].parentNode.after(new_div);
                        new_button.parentNode.previousSibling.setAttribute('flag', 'true');
                        array_topics[i].setAttribute('plugin', 'true');
                    }
                }

                var array_inster_button = document.getElementsByName('yh');
                for (let i = 0; i < array_inster_button.length; i++) {
                    var tmp = array_inster_button[i].parentNode.previousSibling;
                    if (tmp == null || !tmp.hasAttribute('flag')) {
                        array_inster_button[i].parentNode.remove();
                    }
                }

                //升级判断
                var version_new = $2(".item-link1").find('a')[0].text;
                if (version_new.indexOf("(有更新)") < 0 && version < version_new.split("v")[1]) {
                    $2(".item-link1").find('a')[0].text = (version_new + "(有更新)");
                }
            }, 500);
        }
    })
})();
