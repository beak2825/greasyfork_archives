// ==UserScript==
// @name         fast link
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  一些快捷链接
// @author       owell
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @match        *://*.aliyun.com/*
// @match        *://aliyun.com/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_cookie
// @grant        unsafeWindow
// @noframes
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/459187/fast%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/459187/fast%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCookie(cname) {
        var name = cname + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            if (ca[i].indexOf(name) >= 0) {
                return ca[i].split('=')[1];
            }
        }
        return '';
    }

    // 引入 jQuery
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    document.head.appendChild(script);

    var phoneNumber="18611603658";
    var jsessionid = getCookie("JSESSIONID");
    console.log(jsessionid)

    // 等待 jQuery 加载完成后再执行其他操作
    script.onload = function() {
        $(document.head).append(`
        <style>
              #toolDiv>div {
                  padding: 5px 10px;
                  background-color: #4CAF50;
                  color: white;
                  border: none;
                  cursor: pointer;
                  width: 110px;
                  font-size: 12px;
                  margin: 1px;
              }
              #toolDiv>div>a {
                  color: white;
              }
        </style>
        `);
        var aliasButtons = [];
        if(location.host.indexOf("aliyun")>=0){
            aliasButtons.push(...[
                "LOGIN_NACOS : https://signin.aliyun.com/login.htm?callback=https%3A%2F%2Fwww.aliyun.com%2F%3Fspm%3D5176.3047821.0.0.2c1970b4QKl3Jy#/main",
                "NACOS_TEST : https://mse.console.aliyun.com/#/Instance/Config/List?ClusterId=mse-e727a1e2&ClusterName=nacos-test&ClusterType=Nacos-Ans&InstanceId=mse_prepaid_public_cn-zxu3b5x3k07&VersionCode=NACOS_2_1_2_2&AppVersion=2.1.2.2&MseVersion=mse_pro&ChargeType=PREPAY&region=cn-beijing&namespaceId=test&prometheusVersion=basic",
                "NACOS_PROD : https://mse.console.aliyun.com/?spm=5176.12818093_-1363046575.0.0.3be916d0JPCyxX#/Instance/Config/List?ClusterId=mse-94bb4b02&ClusterName=nacos-prod&ClusterType=Nacos-Ans&InstanceId=mse_prepaid_public_cn-uqm3b5zws06&VersionCode=NACOS_2_1_2_2&AppVersion=2.1.2.2&MseVersion=mse_pro&ChargeType=PREPAY&region=cn-beijing&namespaceId=06927a4c-8617-48f8-8b40-9e168e2c9286",
                "OSS : https://oss.console.aliyun.com/bucket/oss-cn-beijing/public-read-only/object",
                "LOG_TEST : https://sls.console.aliyun.com/lognext/project/k8s-log-c5943885f20b64cbab0bd5f23f3dad472/overview",
                "LOG_PROD : https://sls.console.aliyun.com/lognext/project/k8s-log-cb5b752cbf75145c0b15b4baddc97d4c9/overview",
            ]);
        }
        var domHtml ='<div id="toolDiv" style="z-index:999;position: fixed;bottom:10px;right: 10px">';
        for(var i of aliasButtons){
            console.log(i);
            let arr = i.split(" : ");
            domHtml +=
'                 <div id="'+arr[0]+'" >'+
'                   <a href="'+arr[1]+'">'+arr[0]+'</a>'+
'                 </div>';
        }
        domHtml += '</div>'
        $(document.body).append(domHtml);
    };


    function test(){
        var url = "http://www.baidu.com";
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            anonymous: true,
            headers: {
                "Timezone": "GMT+8",
                "Accept-Language": "zh-Hans-CN",
            },
            onload: function(response) {
                console.log(response)
                console.log(response.responseText)
            },
            onerror: function(error) {
                console.log(error);
            }
        });
    }
})();