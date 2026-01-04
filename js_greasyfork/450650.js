// ==UserScript==
// @name         税务登录助手升级版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  税务登录助手升级版!
// @author       王东祥
// @license      GPL-3.0 License
// @match        https://etax.shandong.chinatax.gov.cn/enterprise/dzswjlogin/*
// @match        https://etax.shandong.chinatax.gov.cn/EnterpriseDzswjLoginAction.do

// @match        https://etax.shandong.chinatax.gov.cn/enterprise/dzswjlogin/dzswj_login.jsp?type=main
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chinatax.gov.cn
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/450650/%E7%A8%8E%E5%8A%A1%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B%E5%8D%87%E7%BA%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/450650/%E7%A8%8E%E5%8A%A1%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B%E5%8D%87%E7%BA%A7%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var token = null;
    var userId = document.getElementById('userId')
    var userCzydm = document.getElementById('czydm')
    var userDlpassword = document.getElementById('password')

    // 获取当前网页地址
    var currentURL = window.location.href;
    // 分割URL后的参数对
    var param = currentURL.split('&');

    var data = {
        'userName': '18953388258',
        'password': '111111'
    };

    // 获取远程授权Token
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://121.37.106.114:8090/api/openapi/apilogin/login',
        // url: "http://192.168.0.200:8090/api/openapi/apilogin/login",
        headers: {
            'Content-Type': 'application/json-patch+json',
            'accept': 'text/plain'
        },
        data: JSON.stringify(data),
        dataType: 'json',
        onload: function(response) {
            console.log('请求成功')
            // console.log(json.parse(response.responseText));
            const daata = eval('(' + response.responseText + ')')
            token = daata.data.token

            // 参数对为2为合法参数对，1：默认参数，2：系统用户参数信息
            if(param.length ==2){
                var codeParam = param[1].split('=');
                // 判断参数对中是否存在Code键
                if(codeParam[0].trim()=="code".trim()) {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'http://121.37.106.114:8090/api/OpenApi/ApiCompany/GetById?id=' + parseInt(codeParam[1]),
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        onload: function(response) {
                            var item = JSON.parse(response.responseText).data
                            userId.value =item.companyCreditCode;
                            userCzydm.value = item.idCard;
                            userDlpassword.value = item.companyPwd;
                        },

                        onerror: function(response) {
                            console.log('请求失败')
                        }
                    })
                }
            }

        },
        onerror: function(response) {
            console.log('请求失败')
        }
    })


})();