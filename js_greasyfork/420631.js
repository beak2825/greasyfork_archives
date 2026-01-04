// ==UserScript==
// @name         Automatic BodyTemp AB830
// @namespace    https://www.asmpacific.com/
// @version      1.0.1
// @description  https://www.asmpacific.com/
// @author       GG
// @match        https://ias.asmpt.com/BodyTempLog/?temp
// @include      https://ias.asmpt.com/*BodyTempLog*
// @require      https://code.jquery.com/jquery-3.5.1.min.js”
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420631/Automatic%20BodyTemp%20AB830.user.js
// @updateURL https://update.greasyfork.org/scripts/420631/Automatic%20BodyTemp%20AB830.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var UserName = "ahkex\\xxxxxxx";    //Enter your Username
    var Password = "xxxxxxxxxxxxxx";    //Enter your Password
    var BadgeNo = "1000xxxx";           //Enter your BadgeNo
    var Temp = 36 + Math.random();

    Login(UserName, Password);

    CheckTime();

    setTimeout(function(){ location.reload() }, 21600000);

    function CheckTime(){
        var timeNow = new Date();

        //console.log(timeNow);

        if ((timeNow.getDay() == 0) || (timeNow.getDay() == 6))
        {
        }
        else if ((timeNow.getHours() == 12) || (timeNow.getHours() == 8))
        {
            if (timeNow.getMinutes() == 29)
            {
                //if (timeNow.getSeconds() == 0)
                {
                    setTimeout(function(){ InputTemp(BadgeNo, Temp.toFixed(1)) }, 60000);
                }
            }
        }

        setTimeout(CheckTime, 1000);
    }

    function AlertUser(szDDD){
        alert(szDDD);
        console.log(szDDD);
    }
    function Login(name, pw){
        var loginpage = document.getElementById("Windows_Login_Btn");
        if (loginpage)
        {
             //document.getElementById("Windows_Login_Btn").click();
            document.getElementById("domain_username").value = name;
            document.getElementById("domain_password").value = pw;
            document.getElementById("login_button").click();
        }
    }
    function InputTemp(badge, temperature){
        var data = '';
                data += "{'badge' :'";
                data += badge;
                data += "','status' :'";
                data += "5";
                data += "','temperature' :'";
                data += temperature;
                data += "'}";
        $.ajax({
            type: 'post',
            url: 'Default.aspx/RecordTemperature',
            dataType: 'json',
            data: data,
            contentType: 'application/json'
        });
        location.reload();
    }
})();