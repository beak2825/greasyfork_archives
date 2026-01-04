// ==UserScript==
// @name         炎黄盈动-内网新门户平台自定义菜单~自用
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自用
// @author       haifennj
// @match        https://my.awspaas.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/517792/%E7%82%8E%E9%BB%84%E7%9B%88%E5%8A%A8-%E5%86%85%E7%BD%91%E6%96%B0%E9%97%A8%E6%88%B7%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%AE%9A%E4%B9%89%E8%8F%9C%E5%8D%95~%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/517792/%E7%82%8E%E9%BB%84%E7%9B%88%E5%8A%A8-%E5%86%85%E7%BD%91%E6%96%B0%E9%97%A8%E6%88%B7%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%AE%9A%E4%B9%89%E8%8F%9C%E5%8D%95~%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.portalLayout == undefined) {
        return;
    }
    let css = `
        .custom-menu {
            float: left; padding-right: 10px; height: 20px; line-height: 20px;
        }
        .header {
            padding-left:10px !important;
        }
        a:LINK{color:#53709A}
        a:VISITED{color:#53709A; TEXT-DECORATION: none;}
        a:HOVER{color:#53709A}
    `
    let el = document.createElement('style')
    el.type = 'text/css'
    el.innerHTML = css
    document.head.appendChild(el);

    var showFunctionWindow = function(id,title,url,target) {
        portalApi.behavior.openPortalPage(id,url,{type:'mainFrame'},title);
    }

    function buildMenu() {

        window.showFunctionWindow = showFunctionWindow;

        var container;
        var header = document.querySelector('header.el-header.public-header-border');
        // 在 header 内查找 class="left" 的 span 元素
        var leftSpan = header.querySelector('span.left');
        leftSpan.style.display = 'inline';

        container = leftSpan;
        var maxWidth = 700;
        if (container.offsetWidth < maxWidth) {
            container.style.width = maxWidth + "px";
        }

        setTimeout(function () {
            if (container.offsetWidth < maxWidth) {
                container.style.width = maxWidth + "px";
            }
        }, 5000);
        var funArr = [
            { "title": "流程中心", "navId": "obj_c867594519be463faadfe4e4a9aa25d1", "url": "./w?sid=<#sid>&cmd=com.actionsoft.apps.workbench_main_page", "html": "<span id='taskCount'></span>" },
            { "title": "快邮", "navId": "obj_a21ada8c345445d8bdfb384cface0e96", "url": "./w?sid=<#sid>&msaAppId=&cmd=com.actionsoft.apps.kuaiyou_home", "html": "<span id='kuaiyouCount'></span>" },
            { "title": "单位通讯录", "navId": "obj_37fa3a92c3cc4e478c6628936da9b287", "url": "./w?sid=<#sid>&msaAppId=&cmd=com.actionsoft.apps.entaddress_home" },
            { "title": "知识门户", "navId": "obj_9db6edd0ccf5433f82fe0af6fd67b7cc", "url": "./w?sid=<#sid>&msaAppId=&cmd=com.actionsoft.apps.kms_knwl&page=search" },
            { "title": "问题闭环", "navId": "obj_f6c10e80f8214b10a602827f16d266be", "url": "./w?sid=<#sid>&msaAppId=com.crmpaas.apps.service&cmd=CLIENT_DW_PORTAL&processGroupId=obj_924174cb1eac44aead587c81f5d547c2&appId=com.crmpaas.apps.service" },
            { "title": "产品改善", "navId": "obj_0ecd62a2721e4eb6b623fe0af52567c5", "url": "./w?sid=<#sid>&msaAppId=com.crmpaas.apps.service&cmd=CLIENT_DW_PORTAL&processGroupId=obj_40522b2a44c44d55bf264b968d1da3af&appId=com.crmpaas.apps.service", "target": "window" },
            { "title": "日常费用报销", "navId": "obj_39df54c7ac3c4c04af065f9b92252bab", "url": "./w?sid=<#sid>&msaAppId=com.finpaas.apps.expense&cmd=CLIENT_BPM_WORKLIST_MAIN&processGroupId=obj_2c1b4ca531664218a3dddb31bee77b03&boxTitle=" },
            { "title": "差旅费报销", "navId": "obj_5dd0e683a9c9463daf4badb66245f92f", "url": "./w?sid=<#sid>&msaAppId=com.finpaas.apps.expense&cmd=CLIENT_BPM_WORKLIST_MAIN&processGroupId=obj_0e8ecfbaf4a442c3b7904f098e362c53&boxTitle=" },
            { "title": "工资单", "navId": "", "url": "./w?sid=<#sid>&msaSvcId=hr&cmd=com.actionsoft.apps.hr.payroll.query_get_mypayroll" },
            { "title": "请假申请", "navId": "obj_e91ddb8b7afc437ea792a94ecf68d9d3", "url": "./w?sid=<#sid>&msaSvcId=hr&cmd=CLIENT_BPM_WORKLIST_MAIN&processGroupId=obj_ceac2580c0884ef69e9c74982a6c7631&boxTitle=" },
            { "title": "出差申请", "navId": "obj_e31ab97bc86f44cdb95e1f5372005d72", "url": "./w?sid=<#sid>&msaSvcId=hr&cmd=CLIENT_BPM_WORKLIST_MAIN&processGroupId=obj_8626a78741414d88b56266daf7e7fcce&boxTitle=" },
            { "title": "补签申请", "navId": "obj_47fc725f98a14d59b9f9d05fe1b0d690", "url": "./w?sid=<#sid>&msaSvcId=hr&cmd=CLIENT_BPM_WORKLIST_MAIN&processGroupId=obj_73ab0a1cb18e4f3e9231598b88fc0aca&boxTitle=" },
            { "title": "加班申请", "navId": "obj_1bcfd34b2403492789db0938c2b033ba", "url": "./w?sid=<#sid>&msaSvcId=hr&cmd=CLIENT_BPM_WORKLIST_MAIN&processGroupId=obj_15ff2c025d4b44d3a1245e193e57bbc0&boxTitle=" },
            { "title": "调休申请", "navId": "obj_00072f4150b041e1aee74f5ee6d5d6b7", "url": "./w?sid=<#sid>&msaSvcId=hr&cmd=CLIENT_BPM_WORKLIST_MAIN&processGroupId=obj_b87a9645c7b6427da0b86c21fb8dadc1&boxTitle=" },
            { "title": "AI助理后台", "navId": "", "url": "./w?sid=<#sid>&cmd=com.actionsoft.apps.ai.copilot_home", "target": "window" },
            { "title": "AI门户", "navId": "", "url": "./w?sid=<#sid>&cmd=com.actionsoft.apps.ai.copilot_lui", "target": "window" },
            { "title": "AI门户移动端", "navId": "", "url": "./w?sid=<#sid>&cmd=com.actionsoft.apps.ai.copilot_lui_m", "target": "window" },
            { "title": "AI治理小组", "navId": "", "url": "./w?sid=<#sid>&cmd=com.actionsoft.apps.ai.chain_governance_main", "target": "window" },
            { "title": "", "navId": "", "url": "./w?sid=<#sid>&msaSvcId=hr" },
            { "title": "", "navId": "", "url": "./w?sid=<#sid>&msaSvcId=hr" },
            { "title": "", "navId": "", "url": "./w?sid=<#sid>&msaSvcId=hr" },
        ];
        for (var i = 0; i < funArr.length; i++) {
            var fun = funArr[i];

            var a = document.createElement("a");
            a.textContent = fun.title;

            var url = fun.url.replace("<#sid>", window.settingParam.sessionId);
            if (fun.target === "window") {
                a.href = "javascript:window.open('" + url + "');";
            } else {
                a.href = "#";
                a.setAttribute("onclick", "showFunctionWindow('" + fun.navId + "', '" + fun.title + "', '" + url + "', false);");
            }

            var div = document.createElement("div");
            div.className = "custom-menu";
            div.appendChild(a);

            container.appendChild(div);
        }

    }

    function addXMLRequestCallback(callback) {
        var oldSend, i;
        if (XMLHttpRequest.callbacks) {
            // we've already overridden send() so just add the callback
            XMLHttpRequest.callbacks.push(callback);
        } else {
            // create a callback queue
            XMLHttpRequest.callbacks = [callback];
            // store the native send()
            oldSend = XMLHttpRequest.prototype.send;
            // override the native send()
            XMLHttpRequest.prototype.send = function () {
                // process the callback queue
                // the xhr instance is passed into each callback but seems pretty useless
                // you can't tell what its destination is or call abort() without an error
                // so only really good for logging that a request has happened
                // I could be wrong, I hope so...
                // EDIT: I suppose you could override the onreadystatechange handler though
                for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                    XMLHttpRequest.callbacks[i](this);
                }
                // call the native send()
                oldSend.apply(this, arguments);
            }
        }
    }

    // e.g.
    addXMLRequestCallback(function (xhr) {
        xhr.addEventListener("load", function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var r = JSON.parse(xhr.response)
                console.log('拦截返回：', r.data);
                if (r.data && r.data["navList"]) {
                    setTimeout(function () {
                        buildMenu();
                    }, 300);
                }

            }
        });
    });

})();