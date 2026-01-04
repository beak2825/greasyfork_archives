// ==UserScript==
// @name         倒计时
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  一个适用于百度的倒计时器
// @match        *://www.baidu.com/*
// @author       Jack
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447730/%E5%80%92%E8%AE%A1%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/447730/%E5%80%92%E8%AE%A1%E6%97%B6.meta.js
// ==/UserScript==
(function () {
   'use strict';
    var tmp = 0;
    var sec2 = 25;// 防止出现 BUG
    var sec = 0;// 用户倒计时秒数
    var stime = 25;// 防止出现 BUG 直接跳出 while 循环（没有执行）
    var time;// 计时器
    function Go (){// 控制函数
        console.log (' 倒计时剩余 % d 秒 ',sec2 - 1);// 日志
        sec2 = sec2 - 1;
    }
    function isNumber (val){// 判断参数是否是数字
        var regPos = /^[0-9]+.?[0-9]*/; // 判断是否是数字。
        if (regPos.test (val) ){
            return true;
        } else {
            return false;
        }
    }
    // 生成按钮
    $('.s_btn_wr,#s_btn_wr').after ('<input type="button" id="djs" value="开始倒计时" class="btn self-btn bg" style="float:right; font-size:14px; text-align:center; text-decoration:none; width:100px; height:33px; line-height:33px; margin-left:5px;-webkit-appearance:none;-webkit-border-radius:0;border: 0;color:#fff;letter-spacing:1px;background:#757555;border-bottom:1px solid #757555;outline:medium;" onmouseover="this.style.background=\'#757575\'" onmouseout="this.style.background=\'#757575">')
    $("#djs").click (djsh)
    function djsh (){// 处理函数
        console.log ('---------------------------------');// 日志文件
        console.log (' 倒计时 正式版 v1.0.1');
        console.log ('---------------------------------');
        console.log (' 按钮被点击 ');
        //-------------------------
        tmp = prompt (' 请输入你要倒计时的秒数：');// 输入
        if (isNumber (tmp)){// 如果输入的是一个数字
            sec = parseInt (tmp);// 转换成 int 整数类型
            console.log (' 开始倒计时 % d 秒 ',sec);// 日志
            //stime = sec;// 计数器
            sec2 = sec;
            time = setInterval (function (){Go ();if (sec2 <= 0){
                console.log (' 倒计时结束 ');
                alert (' 时间到！！！');
                clearInterval (time);
                return;}}, 1000);// 每过一秒，计数器递减
            if (sec2 <= 0){
                console.log (' 倒计时结束 ');
                alert (' 时间到！！！');
                clearInterval (time);
                return;
            }
        } else {
            console.log ('Error：输入错误 ');// 日志
            alert (' 请输入正确数字！！！');// 提示消息
            return;// 退出
        }
        return;
    };

})();