// ==UserScript==
// @name         禅道登录
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  自动登录禅道，需设置用户名、密码
// @author       lm
// @match        http://192.168.3.117/zentao/user-login*.html
// @icon         https://api.94speed.com/img/bitbug_favicon.ico
// @grant          GM_xmlhttpRequest
// @grant          GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475178/%E7%A6%85%E9%81%93%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/475178/%E7%A6%85%E9%81%93%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
function onGetTimeFrameToTime(starTime, endTime) {
    let m = new Date(starTime);
    let mt = m.getTime();
    let n = new Date(endTime);
    let nt = n.getTime();
    let s = nt - mt;
    let sm = Math.floor(Math.random() * s);
    return new Date(mt + sm).getTime();
}
function login(){
    var account = "用户名";
    var password = "密码";
    var passwordStrength = computePasswordStrength(password);

    var hasMD5 = typeof(md5) == 'function';
    var rand = $('input#verifyRand').val();
    var referer = $('#referer').val();
    var link = createLink('user', 'login');
    var keepLogin = $('#keepLoginon').attr('checked') == 'checked' ? 1 : 0;
    console.log(link,rand)
    $.ajax
    ({
        url: link,
        dataType: 'json',
        method: 'POST',
        data:
        {
            "account": account,
            "password": hasMD5 ? md5(md5(password) + rand) : password,
            'passwordStrength' : passwordStrength,
            'referer' : referer,
            'verifyRand' : rand,
            'keepLogin' : keepLogin,
        },
        success:function(data)
        {
            if(data.result == 'fail')
            {
                alert(data.message);
                return false;
            }
            else
            {
                location.href = data.locate;
            }
        }
    })
}
(function() {

    let date;
    let dataStr;
    let loginDate
    function initDate(){
        date = new Date();
        dataStr = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        loginDate = onGetTimeFrameToTime(`${dataStr} 8:40`,`${dataStr} 15:40`)
    }
    initDate();
    let time = setInterval(()=>{
        const newDate = new Date();
        const newDateStr = `${newDate.getFullYear()}/${newDate.getMonth() + 1}/${newDate.getDate()}`;
        if(localStorage.newDateStr!==newDateStr){
            localStorage.newDateStr = newDateStr
            initDate();
        }
        if(loginDate-newDate.getTime()<=10000&&localStorage.dataStr!==newDateStr){
            clearInterval(time);
            localStorage.dataStr=newDateStr;
            localStorage.loginDate = loginDate;
            console.log("进入登录")
            login()
            //let acc = document.getElementsByClassName("form-control")
            //acc[0].value = "lushaoming";
            //acc[1].value = "Lsm123456";
            //const logi = document.getElementById("submit");
            //logi.click();
        }else{
            console.log("登录时间：",new Date(loginDate))
            console.log("登录日期：",dataStr)
            console.log("当前时间：",newDate,"时间差：",loginDate-newDate.getTime())
        }
    },60000)


    })();