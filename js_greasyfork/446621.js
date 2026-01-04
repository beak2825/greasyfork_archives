// ==UserScript==
// @name         agri 测试环境自动填写验证码脚本
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        http://127.0.0.1:8888/sso/*
// @match        https://dat-farm.yaic.com.cn/pcsso/*
// @match        http://127.0.0.1:8888/pcsso/*
// @match        https://uat-farm.yaic.com.cn/pcsso/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446621/agri%20%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E9%AA%8C%E8%AF%81%E7%A0%81%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/446621/agri%20%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E9%AA%8C%E8%AF%81%E7%A0%81%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {

    //判断当前的环境
    var url = window.location.href
    var environment = url.substring(8,url.indexOf('\/')+5)
    if(environment === 'uat'){
        // 永安测试环境自动填写验证码脚本: DNJS0711KJD
        document.querySelector("#code").value = 'DNJS0711KJD'
    }else if (environment === 'dat') {
        document.querySelector("#code").value = '768423'
    }else{
        document.querySelector("#code").value = '441535'
    }

    var board = document.getElementById("loginBox");
    var select = document.createElement("select");
    select.options[0] = new Option("西安", "10261010");
    select.options[1] = new Option("内蒙古","10026151");
    select.options[2] = new Option("新疆", "10026153");
    select.options[3] = new Option("河南", "10026146");
    select.options[4] = new Option("陕分", "10026143");
    select.options[5] = new Option("辽宁", "10026150");
    select.options[6] = new Option("分公司管理岗", "10038861");
    select.options[6] = new Option("陕分姚萌", "10026788");

    select.id = 'sid'
    select.onchange=function(str){
        let index = select.selectedIndex
        let user  = select.options[index].value
        select.options[index].text
        // 给帐号赋值
        document.querySelector("#userCode").value = user
        //给密码赋值
        if(index == 4){
            document.querySelector("#passWord").value ='YaIc@369!'
        }else if(index == 6){
            document.querySelector("#passWord").value ='YaIc@369!'
        }else {
            document.querySelector("#passWord").value ='Testxian@2022'
        }

    }
    var object = board.appendChild(select);
})();