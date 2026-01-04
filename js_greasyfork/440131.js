// ==UserScript==
// @name        tame WX OAs
// @namespace   Violentmonkey Scripts

// @match       http://2.20.102.106/*

// @match       http://58.215.18.56:58080/fs-consumer/

// @version     1.0.1
// @author      someone
// @license     MIT
// @description tame mess sites

// @grant       GM_notification
// @grant       unsafeWindow

// @downloadURL https://update.greasyfork.org/scripts/440131/tame%20WX%20OAs.user.js
// @updateURL https://update.greasyfork.org/scripts/440131/tame%20WX%20OAs.meta.js
// ==/UserScript==

// OA
if (location.host === '2.20.102.106') {
  const now = new Date();
  const year = String(now.getFullYear());
  // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = now.getHours();
  const today = `${year}-${month}-${day}`;
  const signinToday = `signin_${today}`;
  const signoutToday = `signout_${today}`;

  // 签到
  const sign = () => {
    if (hour <= 9 && !localStorage.getItem(signinToday)) {
      // 判断条件有问题，首次登录却已被代签到的就会无限执行
      if (document.querySelectorAll('button.ant-btn.ant-btn-primary').length === 1) {
        document.querySelector('button.ant-btn.ant-btn-primary').click();
        localStorage.setItem(signinToday, true);
        clearInterval(signInterval);
      }
    } else if (
      hour >= 17 &&
      !localStorage.getItem(signoutToday) &&
      document.getElementsByClassName('singBtn').length > 0
    ) {
      document.getElementsByClassName('singBtn')[0].click();
      if (document.querySelectorAll('button.ant-btn.ant-btn-primary').length === 1) {
        document.querySelector('button.ant-btn.ant-btn-primary').click();
        localStorage.setItem(signoutToday, true);
        clearInterval(signInterval);
      }
    }
  };

  const signInterval = setInterval(sign, 1000);

  unsafeWindow.alert = (message) => {
    console.log(message);
    if (message === '流程处理成功') {
      GM_notification(`流程处理成功`, 'Alert');
    }
  };
}

// 无锡财务共享平台默认使用密码登录模式
if (location.host === '58.215.18.56:58080') {
  window.addEventListener('load', () => {
    if (document.getElementById('logintype_pwd').style.display === 'none') {
      document.getElementById('change_logintype').click();
    }
  });
}
