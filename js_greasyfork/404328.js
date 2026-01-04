// ==UserScript==
// @name         AI智能操作
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  提升户户通系统的效率
// @author       You
// @match        https://sms.huhutv.com.cn/rtcrm-clientweb/npage/base/pub/pub0010/Pub0010Controller-initMainPage.gv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404328/AI%E6%99%BA%E8%83%BD%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/404328/AI%E6%99%BA%E8%83%BD%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // Your code here...
    var btss = $("#searchkeyBtn");
     btss.after('<button id="qkBtn" type="buttton" class="">&nbsp;清空</button>');
    btss.after('姓名:<input id="uname" autocomplete="off" disableautocomplete="" class="textInput" type="text" placeholder="需要改名输入名字" value="" maxlength="3">');
    btss.after('<button id="yjBtn" type="buttton" class="">&nbsp;快速移机</button>');
   
    $("#nv_18052_10_ico").mousedown(function () {
        $("#contactPhone").after('<button id="rdphone" type="buttton" class="">&nbsp;随机号码</button>');

    });
$("#qkBtn").click(function () {
$("#searchkey").val("");
    $("#uname").val("");
setTimeout(function(){ $("#alertMsgBox").find("a").click();}, 100);


});

    $("#yjBtn").click(function () {
         var uname=$("#uname").val();
        btss.click();
        // sleep(3000);
        // $("#nv_18052_10_ico").click();
        console.log($(":contains('客户概览')"));
        $("#nv_18052_4_switch").click();
        $("#nv_18052_9_switch").click();
        $("#nv_18052_12_switch").click();
        //  while( )){
        ///alert("ok");
        //  }

        sleep(2000).then(() => {
            do {
                sleep(5000).then(() => {
                    //code
                    $("#nv_18052_11_ico").click();
                    do {
                        sleep(2000).then(() => {
                            var newphone = getMoble();
                            window.frames[0].document.getElementById("contactPhone").value = newphone;
                            if(uname!=""){
                                window.frames[0].document.getElementById("custName").value = uname;
                            }
                            window.frames[0].document.getElementById("f1210Submit").click();
                            //点击确认
                            window.frames[0].document.getElementById("alertMsgBox").childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].click()
                            sleep(2000).then(() => {

                                do {
                                    //点击确认
                                    $("#nv_18052_13_ico").click();
                                    //移机确认
                                    sleep(2000).then(() => {
                                        window.frames[0].document.getElementById("f1954Submit").click();
                                    });
                                    sleep(2000).then(() => {
                                        //点击确认
                                        window.frames[0].document.getElementById("alertMsgBox").childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].click();
                                    });
                                    //关闭当前窗体
                                    // sleep(2000).then(() => {
                                         //$(".close:eq(0)").click();
                                   //  });
                                } while ($("#alertMsgBox").length<0)



                            });
                            console.log(newphone);
                        });
                        break;
                    }
                    while ($("#ajaxLoadingDiv").attr("display") == "none")
                });

                break;
            }

            while ($("#ajaxLoadingDiv").attr("display") == "none")

        });

        /**

* 随机生成手机号

*/

        function getMoble() {
                var prefixArray = new Array("130", "131", "132", "133", "135", "137", "138", "170", "187", "189");
                var i = parseInt(10 * Math.random());
                var prefix = prefixArray[i];
                for (var j = 0; j < 8; j++) {
                    prefix = prefix + Math.floor(Math.random() * 10);
                }
                return prefix;

            }
            //暂停

        function sleep(ms) {
            return new Promise(resolve =>
                setTimeout(resolve, ms)
            )
        }

    });
    //f1210Submit 确定修改资料
})();