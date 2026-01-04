// ==UserScript==
// @name         AutoLogin Network
// @namespace    http://huaqin.com/
// @version      0.3
// @description  用于自动帐号密码登录，也支持飞书跳转
// @author       AustinYoung
// @match        *://*/ac_portal/*
// @match        *://*.wifi.com/*
// @match        *://sso.huaqin.com/login
// @match        https://adfs.huaqin.com/adfs/ls/*
// @grant        none
// @license      MIT
// @require      https://unpkg.com/ajax-hook@2.1.3/dist/ajaxhook.min.js
// @downloadURL https://update.greasyfork.org/scripts/457799/AutoLogin%20Network.user.js
// @updateURL https://update.greasyfork.org/scripts/457799/AutoLogin%20Network.meta.js
// ==/UserScript==
// http://auth-20108000.wifi.com/*
let maxSec = 3;  // 倒计时
let handle = 0;
(function () {
    'use strict';
    addFloat()
    autoLogin()
    feishuJump()
})();

function addFloat() {
    var strControlHTML = `
    <div style="padding:2px;position:fixed;top:40px;left:2px;z-index:99999" id="myselfFloat">
    <div  style="background-color:rgb(208, 227, 245);opacity: 0.8;">
    用户名<input size=15 value="" id='oUid' placeholder="将保存在本地浏览器">
    密码 <input type='password' size=15 value="" id='oPwd' placeholder="将保存在本地浏览器"> <input type='button' id='mySave' value='保存'>将在 <span id='lastSec' style='color:red'></span> 秒后自动登录<input type='button' id='myStop' value='停止'>
    <span style="color:blue">如已登录飞书，点击二维码即可跳转登录</span></div>
  </div>
  `;
    var oNode = document.createElement('div');
    oNode.innerHTML = strControlHTML;
    document.body.append(oNode);
    mySave.onclick = function () {
        localStorage.setItem('plugin-uid', crypto(oUid.value,true))
        localStorage.setItem('plugin-pwd', crypto(oPwd.value,true))
    }
    myStop.onclick = function () {
        clearInterval(handle)
    }
    oUid.value = crypto(localStorage.getItem('plugin-uid'),false)
    oPwd.value = crypto(localStorage.getItem('plugin-pwd'),false)

}
function autoLogin() {
    lastSec.innerText = maxSec;
    handle = setInterval(function () {
        maxSec--;
        lastSec.innerText = maxSec;
        if (maxSec <= 0) {
            clearInterval(handle)
            autoLoginCore();
        }
    }, 1000)
}
function autoLoginCore() {
    console.log('autoLoginCore')
    let uid = crypto(localStorage.getItem('plugin-uid'),false)
    let pwd = crypto(localStorage.getItem('plugin-pwd'),false)

   // 可自行根据不同网页添加登录脚本，并在开头添加 @match 的内容
    if (location.href.indexOf('adfs.huaqin.com/adfs/ls/') > -1) {
        window.userNameInput.value = uid
        window.passwordInput.value = pwd
        if (uid != '') {
            window.submitButton.click()
        }
    }else if (location.href.indexOf('sso.huaqin.com/login') > -1) {
        window.tbLoginName.value = uid
        window.tbPassword.value = pwd
        if (uid != '') {
            document.querySelector('div.login-btn')?.click()
        }
    }else if (location.href.indexOf('ac_portal') > -1) {
        $('#password_name')?.val(uid);
        $('#password_pwd')?.val(pwd);
        $('#rememberPwd')?.attr("checked", "true");
        if (uid != '') {
            onPwdLogin();
        }
    }else if (location.host.indexOf('wifi.com') > -1) {
        $('#account_form_name')?.val(uid);
        $('#account_form_pwd')?.val(pwd);
        $('#account_form_remember')?.attr("checked", "true");
        if (uid != '') {
            $('#account_form_submitBtn')?.click();
        }
    }
}

// 参数1 加密，0 解密 , 返回空字符串为报错，简单自定义加解密
function crypto(p, bl) {
    let tarArr = [];
    // 控制符号范围在 32- 126
    const cRange = [32, 126]
    if( p==null )return '';
    let crytoFlag = bl?1:-1;
    // 循环位移
    for (var i = 0; i < p.length; i++) {
        let tmp = p.charCodeAt(i)
        let flag = crytoFlag* ((i % 2 == 0)?1:-1)
        let step = 2 * (i + 1) * flag
        let currCode = tmp + step
        // 位置调整，可以在 cRange 中循环，注意不能超过1倍，否则循环会报错
        let range = cRange[1]-cRange[0]+1;
        let maxRange = [cRange[0]-range,cRange[0] + range];
        if(currCode<maxRange[0]||maxRange>maxRange[1])
        {
            return ''
        }
        if (currCode < cRange[0]) {
            currCode = currCode - cRange[0] + cRange[1] + 1
        } else if (currCode > cRange[1]) {
            currCode = currCode - cRange[1] + cRange[0] - 1
        }
        tarArr.push(currCode)
    }
    return String.fromCharCode(...tarArr)
}

// 监控拦截，飞书跳转
function feishuJump()
{
    ah.proxy({
        onResponse: (response, handler) => {
            if (response.config.url.startsWith('/fsLogin')) {
                location.href = JSON.parse(response.response).url;
            }
            handler.next(response);
        }
    });
}