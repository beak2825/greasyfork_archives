// ==UserScript==
// @name         登录工单
// @namespace    http://www.acfun.cn/login
// @version      1.0
// @description  税务顾问专用
// @author       Jun Ge
// @match        http://demo.jeesite.com/js/a/login
// @match        http://www.acfun.cn/login
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @icon         http://www.portal.unicom.local/favicon.ico
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/377018/%E7%99%BB%E5%BD%95%E5%B7%A5%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/377018/%E7%99%BB%E5%BD%95%E5%B7%A5%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //window.location.href = 'http://www.portal.unicom.local/link-na110';
    //window.location.href = 'http://www.portal.unicom.local/link-na044';
    //window.location.href = 'http://10.249.217.120/uflow/listProblemKFS.do?method=getWaitingClaim&pageNo=1&pageSize=100&sortname=id&sortorder=desc';
    //window.location.href = "http://10.249.217.120/kfs/getDemandList?type=7&type2=1&type3=0-0-0-0-0-2-0-0-0-1&_="+Date.parse(new Date().toString());
    //沃运营工单
    //window.location.href = "http://10.249.217.120/uflow/listProcessOOP.do?method=getWaitingClaim&pageNo=1&pageSize=100&sortname=TASK_CREATE&sortorder=desc";


    var username = 'jc-xxx';
    var password = 'xxxxxx';
    var uri = window.location.href;

    function loginYunMenHu(){
        // 创建IFRAME
        var iframe1 = document.createElement("iframe");
        iframe1.id = "ymhiframe";
        iframe1.name = "ymhiframe";
        document.body.appendChild(iframe1);

        var iframe2 = document.createElement("iframe");
        iframe2.id = "myiframe";
        document.body.appendChild(iframe2);

        var iframe3 = document.createElement("iframe");
        iframe3.id = "ksfiframe";
        document.body.appendChild(iframe3);

        // 创建一个 form
        var form1 = document.createElement("form");
        form1.id = "loginForm";
        form1.name = "loginForm";
        form1.target="ymhiframe"
        document.body.appendChild(form1);

        var input1 = document.createElement("input");
        input1.id = "return";
        input1.name = "return";
        input1.type = "hidden";
        input1.value = "http://www.portal.unicom.local/";
        form1.appendChild(input1);

        var input2 = document.createElement("input");
        input2.id = "appid";
        input2.name = "appid";
        input2.type = "hidden";
        input2.value = "np000";
        form1.appendChild(input2);

        var input3 = document.createElement("input");
        input3.id = "success";
        input3.name = "success";
        input3.type = "hidden";
        input3.value = "http://www.portal.unicom.local/user/token";
        form1.appendChild(input3);

        var input4 = document.createElement("input");
        input4.id = "error";
        input4.name = "error";
        input4.type = "hidden";
        input4.value = "http://www.portal.unicom.local/user/error";
        form1.appendChild(input4);

        var input5 = document.createElement("input");
        input5.id = "login";
        input5.name = "login";
        input5.type = "hidden";
        input5.value = username;
        form1.appendChild(input5);

        var input6 = document.createElement("input");
        input6.id = "password";
        input6.name = "password";
        input6.type = "hidden";
        input6.value = password;
        form1.appendChild(input6);

        form1.method = "POST";
        form1.action = "http://sso.portal.unicom.local/eip_sso/rest/authentication/login";
        form1.submit();
    }

    function init(){
        document.body.innerHTML='';
        window.setTimeout(woYunYing, 3000);
        loginYunMenHu();
    }

    //登录沃运营
    function woYunYing(){
        window.setTimeout(reloadUrl,3000);
        var url = "http://www.portal.unicom.local/link-na110";
        var uri = "http://www.portal.unicom.local/link-na044";
        document.getElementById('ymhiframe').hidden="hidden"
		document.getElementById('myiframe').src=url;
        document.getElementById('ksfiframe').src=uri;
    }

    function reloadUrl(){
        document.getElementById('myiframe').hidden="hidden"
        document.getElementById('ksfiframe').hidden="hidden"
        var url = "http://10.249.217.120/uflow/listProblemKFS.do?method=getWaitingClaim&pageNo=1&pageSize=100&sortname=id&sortorder=desc";
        window.location.href = url;
    }

    init();
})();