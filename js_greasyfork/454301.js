// ==UserScript==
// @name         新pf自动跳转
// @namespace    http://pp.net/
// @version      0.6
// @description  world!
// @author       Derek.Ss
// @match        https://www.paperfree.cn/*
// @grant        none
// @license      DAFA
// @downloadURL https://update.greasyfork.org/scripts/454301/%E6%96%B0pf%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/454301/%E6%96%B0pf%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';



    var url = window.location.href;


    if(url=="https://www.paperfree.cn/"){
        window.location.href="https://www.paperfree.cn/userindex/login.html";
    }
    var url1 = window.location.href;
    if(url1=="https://www.paperfree.cn/userindex/login.html"){
        $('body').prepend('<input type="button" value="输入登录" id="button2" style="height: 200px;width: 135%;font-size: 100px;">');
        $('body').prepend('<iframe id="insite" src="https://sjcz.52dafa.cn/" height="300px" width="135%" allowfullscreen="true"></iframe>');

         $("#button2").on("click", function(){
             var dlzh = prompt("请输入登录帐号：").replace(/\s+/g,"");
             var dlmm = prompt("请输入登录密码：").replace(/\s+/g,"");
             if(dlmm==""){
                 dlmm="请输入密码";
             }
             document.getElementById('userName').value = dlzh; //填写登录账号
             document.getElementById('password').value = dlmm; //填写登录密码
             document.getElementsByTagName("button")[0].click();
        })








    }
    var url2 = window.location.href;
    if(url2=="https://www.paperfree.cn/paper/submit.html?from=login"){
        window.location.href="https://www.paperfree.cn/user/transferBalance.html";
    }

    var url3 = window.location.href;
    if(url3=="https://www.paperfree.cn/user/transferBalance.html"){
        $('body').prepend('<input type="button" value="充值" id="button1" style="height: 200px;width: 135%;font-size: 100px;">');
        $('body').prepend('<iframe id="insite" src="https://sjcz.52dafa.cn/" height="300px" width="135%" allowfullscreen="true"></iframe>');

        var czzh = prompt("请输入充值帐号：").replace(/\s+/g,"");
        var czzs = prompt("请输入充值金额：").replace(/\s+/g,"");

    // document.getElementById('toUserName').value = czzh; //填写充值用户名
    // document.getElementById('transferAmount').value = czzs*1000; //填写充值字数
    // document.getElementsByTagName("button")[0].click();

    }

    $("#button1").on("click", function(){
        document.getElementById('toUserName').value = czzh; //填写充值用户名
        document.getElementById('transferAmount').value = czzs*1000; //填写充值字数
        document.getElementsByTagName("button")[0].click();
        })


    
    
})();