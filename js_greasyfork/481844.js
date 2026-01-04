// ==UserScript==
// @name         pf自动获取及跳转
// @namespace    http://yournamespace
// @version      1.5
// @description  Example script to get cross-domain data
// @match        *://sjcz.52dafa.cn/*
// @match        *://*.paperfree.cn/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/481844/pf%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E5%8F%8A%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/481844/pf%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E5%8F%8A%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==


    var url = window.location.href;
document.cookie = "name="+"搜索";
let reg = new RegExp("(^|\\s)"+ 'name' +"=([^;]+)(;|$)");
console.log(document.cookie.match(reg)[2])




    if(url=="https://www.paperfree.cn/"){
        window.location.href="https://www.paperfree.cn/userindex/login.html";
    }
    if(url=="https://www.paperfree.cn/userindex/login.html"){
        // $('body').prepend('<input type="button" value="输入登录" id="button2" style="height: 200px;width: 135%;font-size: 100px;">');
        // $('body').prepend('<iframe id="insite" src="https://sjcz.52dafa.cn/" height="300px" width="135%" allowfullscreen="true"></iframe>');

        document.cookie = "czzh=; path=/user; Max-Age=0;";
        document.cookie = "czje=; path=/user; Max-Age=0;";

             var czzh = prompt("请输入充值帐号：").replace(/\s+/g,"");
             var czje = prompt("请输入充值金额：").replace(/\s+/g,"");
             var dlmm;



        document.cookie = "czzh="+ czzh + "; path=/user;";
        document.cookie = "czje="+ czje + "; path=/user;";




             var shoujihao_url;
             if(0<czje && czje<=20){
                 $('body').prepend('<iframe id="insite" src="https://sjcz.52dafa.cn/xiayige.php" height="0px" width="0px"></iframe>');
                 shoujihao_url = "https://sjcz.52dafa.cn/";
                 dlmm="";
             }
             else if(20<czje && czje<=115){
                 $('body').prepend('<iframe id="insite" src="https://sjcz.52dafa.cn/shiwan/xiayige.php" height="0px" width="0px"></iframe>');
                 shoujihao_url = "https://sjcz.52dafa.cn/shiwan";
                 dlmm="";
             }
             else if(115<czje && czje<=250){
                 $('body').prepend('<iframe id="insite" src="https://sjcz.52dafa.cn/ershiwuwan/xiayige.php" height="0px" width="0px"></iframe>');
                 shoujihao_url = "https://sjcz.52dafa.cn/ershiwuwan";
                 dlmm=""
             }

        setTimeout(function(){
            GM_xmlhttpRequest({
                method: "GET",
                url: shoujihao_url,
                onload: function(response_3) {
                    var wangyeneirong = response_3.responseText;
                    var shoujihaoma = wangyeneirong.indexOf('id="call">');
                    shoujihaoma = wangyeneirong.substring(shoujihaoma+10,shoujihaoma+21);
                    console.log(shoujihaoma);
                    document.getElementById('userName').value = shoujihaoma; //填写登录账号
                    document.getElementById('password').value = dlmm; //填写登录密码
                    document.getElementsByTagName("button")[0].click();
                }
            });
        }, 1000);




    }








    if(url=="https://www.paperfree.cn/paper/submit.html?from=login"){
        window.location.href="https://www.paperfree.cn/user/transferBalance.html";
    }


    if(url=="https://www.paperfree.cn/user/transferBalance.html"){
        $('body').prepend('<input type="button" value="充值" id="button1" style="height: 200px;width: 135%;font-size: 100px;">');
        let reg_1 = new RegExp("(^|\\s)"+ 'czzh' +"=([^;]+)(;|$)");
        console.log(document.cookie.match(reg_1)[2])
        let reg_2 = new RegExp("(^|\\s)"+ 'czje' +"=([^;]+)(;|$)");
        console.log(document.cookie.match(reg_2)[2])
        document.getElementById('toUserName').value = document.cookie.match(reg_1)[2]; //填写充值用户名
        document.getElementById('transferAmount').value = document.cookie.match(reg_2)[2]*1000; //填写充值字数

    }

    $("#button1").on("click", function(){
        // document.getElementById('toUserName').value = yhm; //填写充值用户名
        // document.getElementById('transferAmount').value = je; //填写充值字数
        document.getElementsByTagName("button")[0].click();
        })










