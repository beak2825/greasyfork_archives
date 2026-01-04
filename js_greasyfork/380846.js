// ==UserScript==
// @name         ECUT校园网登录助手
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       LiYang
// @match        http://172.21.255.105/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380846/ECUT%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/380846/ECUT%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var temp = 0;
    $(window).load(function () {
        if($(".edit_loginBox > form > input:nth-child(2)").attr('name') == 'logout')
            return;
        creatSpan();
        let storage = window.localStorage;
        if(storage.getItem('name') && storage.getItem('passw')){
            let name = storage.getItem('name');
            let password = storage.getItem('passw');
            var a = $(".edit_loginBox > form > input:nth-child(3)");
            $(".edit_loginBox > form > input:nth-child(3)").attr("value", name);
            $(".edit_loginBox > form > input:nth-child(4)").attr("value", password);
            $('.edit_radio span').eq(storage.getItem('network'))
                .children().eq(0).attr('checked', 'checked');
            if(storage.getItem('autoLogon') == 1){
                $("#auto_logon > input").attr('checked', 'checked');
                let span = "<div id='notice' style=\"\n" +
                    "    width: 324px;\n" +
                    "    position: absolute;\n" +
                    "    top: 33%;\n" +
                    "    left: 42%;\n" +
                    "    background: #5e5e5e;\n" +
                    "    z-index: 9999;\n" +
                    "    font-size: 30px;\n" +
                    "    text-align: center;\n" +
                    "\">\n" +
                    "  将在2秒之后自动登录\n" +
                    "  <button id='cancel'>取消自动登录</button>\n" +
                    "</div>";
                let a = $("body");
                a.append(span);
                setTimeout( function(){
                    if(temp == 0)
                        $(".edit_loginBox > form > input:nth-child(2)").click();
                }, 2 * 1000 );
            }
        }

        $("#cancel").click(function () {
            temp = 1;
            $("#notice").remove();
        })
        $(".edit_loginBox > form > input:nth-child(2)").click(function(){
            if($(".edit_loginBox > form > input:nth-child(2)").attr('name') == 'logout')
                return;

            if(checkValue($("#auto_logon > input"))){
                let storage = window.localStorage;
                storage.setItem('autoLogon', 1);
            }

            if(checkValue($("#re_passw > input"))){
                let storage = window.localStorage;
                storage.setItem('name', function () {
                    return $(".edit_loginBox > form > input:nth-child(3)").val();
                }())
                storage.setItem('passw', function () {
                    return $(".edit_loginBox > form > input:nth-child(4)").val();
                }())

                let a = $('.edit_radio span');
                let i = 1;
                for(; i < a.length; i++){
                    var b = a.eq(i).children().eq(0);
                    if(checkValue(b)){
                        storage.setItem('network', i);
                        break;
                    }
                }
            }
            else{
                let storage = window.localStorage;
                storage.removeItem('name');
                storage.removeItem('passw');
                storage.removeItem('network');
                storage.removeItem('autoLogon');
            }
        });
        $(".edit_loginBox > form > input:nth-child(2)").click(function(){
        });
    })

    function checkValue($) {
        if($.is(':checked'))
            return true;
        else
            return false;
    }
    function creatSpan() {
        let span = "<br> <span id = \"re_passw\" style=\"color: #FF4B2B\">\n" +
            "              <input type=\"checkbox\" checked=\"checked\">\n" +
            "              <span>记住密码</span>\n" +
            "            </span>\n" +
            "            <span id = \"auto_logon\" style=\"color: #FF4B2B\" >\n" +
            "              <input type=\"checkbox\">\n" +
            "              <span>自动登录</span>\n" +
            "            </span>"
        let a = $(".edit_radio");
        a.append(span);
    }
})();