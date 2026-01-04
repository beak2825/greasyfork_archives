// ==UserScript==
// @name         炎黄盈动平台自定义菜单~自用
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  优化顶部导航菜单
// @author       haifennj
// @match        https://my.awspaas.com/*
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/376900/%E7%82%8E%E9%BB%84%E7%9B%88%E5%8A%A8%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%AE%9A%E4%B9%89%E8%8F%9C%E5%8D%95~%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/376900/%E7%82%8E%E9%BB%84%E7%9B%88%E5%8A%A8%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%AE%9A%E4%B9%89%E8%8F%9C%E5%8D%95~%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let workbenchCSS = `
        .title-cell-div i:nth-child(2) {
            color: red !important;
            font-weight: bold !important;
        }
    `
    GM_addStyle(workbenchCSS);
    window.extendOpenNewPage = true;

    if(typeof(jQuery) == 'undefined'){
        return;
    }
    if(typeof(sid) == 'undefined'){
        return;
    }

    var container = $(".nav-set-yourself-one");
    if (container.width()<600){
        container.width("600px");
    }
    setTimeout(function(){
        if (container.width()<600){
            container.width("600px");
        }
    },5000);
    var funArr = [
        {"title":"流程中心","navId":"obj_c867594519be463faadfe4e4a9aa25d1","url":"./w?sid=ck&&cmd=com.actionsoft.apps.workbench_main_page","html":"<span id='taskCount'></span>"},
        {"title":"快邮","navId":"obj_a21ada8c345445d8bdfb384cface0e96","url":"./w?sid=ck&&msaAppId=&cmd=com.actionsoft.apps.kuaiyou_home","html":"<span id='kuaiyouCount'></span>"},
        {"title":"单位通讯录","navId":"obj_37fa3a92c3cc4e478c6628936da9b287","url":"./w?sid=ck&&msaAppId=&cmd=com.actionsoft.apps.entaddress_home"},
        {"title":"知识门户","navId":"obj_9db6edd0ccf5433f82fe0af6fd67b7cc","url":"./w?sid=ck&&msaAppId=&cmd=com.actionsoft.apps.kms_knwl&page=search"},
        {"title":"问题闭环","navId":"obj_f6c10e80f8214b10a602827f16d266be","url":"./w?sid=<#sid>&&msaAppId=com.crmpaas.apps.service&cmd=CLIENT_DW_PORTAL&processGroupId=obj_924174cb1eac44aead587c81f5d547c2&appId=com.crmpaas.apps.service"},
        {"title":"产品改善","navId":"obj_0ecd62a2721e4eb6b623fe0af52567c5","url":"./w?sid=<#sid>&&msaAppId=com.crmpaas.apps.service&cmd=CLIENT_DW_PORTAL&processGroupId=obj_40522b2a44c44d55bf264b968d1da3af&appId=com.crmpaas.apps.service","target":"window"},
        {"title":"日常费用报销","navId":"obj_39df54c7ac3c4c04af065f9b92252bab","url":"./w?sid=<#sid>&&msaAppId=com.finpaas.apps.expense&cmd=CLIENT_BPM_WORKLIST_MAIN&processGroupId=obj_2c1b4ca531664218a3dddb31bee77b03&boxTitle="},
        {"title":"差旅费报销","navId":"obj_5dd0e683a9c9463daf4badb66245f92f","url":"./w?sid=<#sid>&&msaAppId=com.finpaas.apps.expense&cmd=CLIENT_BPM_WORKLIST_MAIN&processGroupId=obj_0e8ecfbaf4a442c3b7904f098e362c53&boxTitle="},
        {"title":"工资单","navId":"","url":"./w?sid=<#sid>&msaSvcId=hr&cmd=com.actionsoft.apps.hr.payroll.query_get_mypayroll"},
        {"title":"请假申请","navId":"obj_e91ddb8b7afc437ea792a94ecf68d9d3","url":"./w?sid=<#sid>&msaSvcId=hr&cmd=CLIENT_BPM_WORKLIST_MAIN&processGroupId=obj_ceac2580c0884ef69e9c74982a6c7631&boxTitle="},
        {"title":"出差申请","navId":"obj_e31ab97bc86f44cdb95e1f5372005d72","url":"./w?sid=<#sid>&msaSvcId=hr&cmd=CLIENT_BPM_WORKLIST_MAIN&processGroupId=obj_8626a78741414d88b56266daf7e7fcce&boxTitle="},
        {"title":"补签申请","navId":"obj_47fc725f98a14d59b9f9d05fe1b0d690","url":"./w?sid=<#sid>&msaSvcId=hr&cmd=CLIENT_BPM_WORKLIST_MAIN&processGroupId=obj_73ab0a1cb18e4f3e9231598b88fc0aca&boxTitle="},
        {"title":"加班申请","navId":"obj_1bcfd34b2403492789db0938c2b033ba","url":"./w?sid=<#sid>&msaSvcId=hr&cmd=CLIENT_BPM_WORKLIST_MAIN&processGroupId=obj_15ff2c025d4b44d3a1245e193e57bbc0&boxTitle="},
        {"title":"调休申请","navId":"obj_00072f4150b041e1aee74f5ee6d5d6b7","url":"./w?sid=<#sid>&msaSvcId=hr&cmd=CLIENT_BPM_WORKLIST_MAIN&processGroupId=obj_b87a9645c7b6427da0b86c21fb8dadc1&boxTitle="},
        {"title":"考勤报表","navId":"obj_ddbf127f5e61489eb923738e652748bf","url":"./w?sid=<#sid>&msaSvcId=hr&cmd=CLIENT_DW_PORTAL&processGroupId=obj_f15bea778ecf4b1abe24e730926b46b2&appId=com.hrpaas.apps.pt","target":"window"},
        {"title":"考勤报表查询","navId":"obj_29f36e306265402e85ea836ce8c2d2ac","url":"./w?sid=<#sid>&msaSvcId=hr&cmd=CLIENT_DW_PORTAL&processGroupId=obj_a71836268ba64352a5b546f77cfbe764&appId=com.hrpaas.apps.pt","target":"window"},
        {"title":"","navId":"","url":"./w?sid=<#sid>&msaSvcId=hr"},
        {"title":"","navId":"","url":"./w?sid=<#sid>&msaSvcId=hr"},
        {"title":"","navId":"","url":"./w?sid=<#sid>&msaSvcId=hr"},
        {"title":"","navId":"","url":"./w?sid=<#sid>&msaSvcId=hr"},
        {"title":"","navId":"","url":"./w?sid=<#sid>&msaSvcId=hr"},
        {"title":"","navId":"","url":"./w?sid=<#sid>&msaSvcId=hr"},
    ];
    for(var i = 0; i < funArr.length; i++) {
        var fun = funArr[i];
        var a = $("<a></a>");
        a.text(fun.title);
        var url = fun.url;
        url = url.replace("<#sid>",sid);
        if ("window"==fun.target){
            a.attr("href","javascript:window.open('"+url+"', '"+fun.navId+"');");
        }else {
            a.attr("href","#");
            a.attr("onclick","showFunctionWindow('"+fun.navId+"', '"+fun.title+"', '"+url+"',false);");
        }
        var div = $("<div style='float:left;padding:5px;height:20px;line-height:20px;'></div>");
        div.append(a);

        container.append(div);
    }

    //菜单优化
    setInterval(function(){
        if($(".metro-nav-panel").width()=="60"){
            $(".metro-nav-action-items-panel").hide();
        }
    },5000);

    //工作台打开方式处理
    if ($("#openTarget").length > 0){
        $("#openTarget").val("window");
    }

    // 工资单可复制
    if ($("#payroll-main").length > 0) {
        $("body").attr("style","user-select:text !important;");
    }

})();