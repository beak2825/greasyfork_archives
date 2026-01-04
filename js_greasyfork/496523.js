// ==UserScript==
// @name        ustc_email_automatic_insert_totp_code
// @namespace   Violentmonkey Scripts
// @match       https://email.ustc.edu.cn/*
// @match       https://mail.ustc.edu.cn/*
// @grant       none
// @version     0.1.0
// @author      danielshao,liudonghua123
// @icon        https://email.ustc.edu.cn/favicon.ico
// @license     MIT
// @description 邮箱本身有“同设备登录免二次验证功能”，所以自动填写TOTP功能可能没有用。
// @downloadURL https://update.greasyfork.org/scripts/496523/ustc_email_automatic_insert_totp_code.user.js
// @updateURL https://update.greasyfork.org/scripts/496523/ustc_email_automatic_insert_totp_code.meta.js
// ==/UserScript==

// 用户名、密码和TOTP密钥
const USERNAME = 'example@mail.ustc.edu.cn';
const PASSWORD = '';
const TOTPSECRET = '';

// This script is based on liudonghua123's "automatic_insert_totp_code" published on GreasyFork: https://greasyfork.org/zh-CN/scripts/459986-automatic-insert-totp-code

// https://stackoverflow.com/questions/5132488/how-can-i-insert-a-script-into-html-head-dynamically-using-javascript

const dynamicAddScript = (url) => {
    return new Promise(function(resolve, reject){
      const script = document.createElement('script');
      script.onload = resolve;
      script.onerror = reject;
      script.src = url;
      document.head.appendChild(script);
    });
}

function sleep(time){
   return new Promise(function(resolve){
     setTimeout(resolve, time);
   });
}

// https://github.com/yeojz/otplib
//dynamicAddScript('https://unpkg.com/@otplib/preset-browser@^12.0.0/buffer.js');
//dynamicAddScript('https://unpkg.com/@otplib/preset-browser@^12.0.0/index.js');
//window.otplib.totp.generate('EXGVVAJJ4SI2AEEX')
//
// https://github.com/LanceGin/jsotp
// no browser support ?


(async function process() {
  // https://github.com/hectorm/otpauth
  //
  // ERR_CONNECTION_RESET
  // await dynamicAddScript('https://cdn.jsdelivr.net/npm/otpauth/dist/otpauth.umd.min.js');
  //
  // https://unpkg.com/
  // You may also use a semver range or a tag instead of a fixed version number, or omit the version/tag entirely to use the latest tag.
  // await dynamicAddScript('https://unpkg.com/otpauth/dist/otpauth.umd.min.js');
  await dynamicAddScript('https://cdnjs.cloudflare.com/ajax/libs/otpauth/9.2.1/otpauth.umd.min.js');
  await sleep(1000);
  let loginBut = document.querySelector("button.u-btn.u-btn-primary.submit.j-submit");
  if (loginBut) {
    let totpinput = document.querySelector('div.second-auth-wrap.j-second-auth-wrap.f-dn > div.auth-body.j-auth-body > div.verify-main > div.f-mgb > div > input.u-input:not(.mgr)');
    if (totpinput) {
        let secret = TOTPSECRET;
        const totp = new OTPAuth.TOTP({secret,}); // 这里一定要叫secret，换成别的任何变量名都不行，不知道是JS的什么特性。
        // Generate a token.
        let token = totp.generate();
        console.info(`totp.generate code ${token}`);
        totpinput.value = token;
        let confirmbtn = document.querySelector('div.second-auth-wrap.j-second-auth-wrap.f-dn > div.u-dialog-btns > input.u-btn.u-btn-primary[value="确定"]')
        if (confirmbtn) {
            console.log("找到2FA确定按钮");
            confirmbtn.click();
        } else {
            console.log("未找到2FA确定按钮");
        }
    }
    else {
        console.log("找到登录按钮：尝试自动登录");
        let uidInput = document.getElementById("uid");
        let passwdInput = document.getElementById("password");
        if (uidInput && passwdInput) {
            uidInput.value = USERNAME;
            passwdInput.value = PASSWORD;
            loginBut.click();
        }
    }
  } else {
    console.log("未找到登录按钮，已登录");
  }
  //await sleep(1000);
})();

(function() {
    'use strict';

    function removeElementById(name) {
        let target = document.getElementById(name);
        if (target) {
            target.remove();
        }
    }

    function removeElementByClass(name) {
        document.querySelectorAll("." + name).forEach(function (item) {
            item.remove();
        });
    }

    (function simplify() {
        console.log("Start to clear.");
        // 清除Copyright
        //removeElementById("copyright_area");
        //removeElementByClass("mainPanel");
        console.log("Clear end.");
    })();
})();
