// ==UserScript==
// @name         account-manage
// @namespace    https://github.com/xhonker/account-manage
// @version      0.1.20
// @description  internal account manage
// @author       Quicker
// @include      *://e.360.cn/
// @include      *://cas.baidu.com*
// @include      *://ad.oceanengine.com/pages/login/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/408681/account-manage.user.js
// @updateURL https://update.greasyfork.org/scripts/408681/account-manage.meta.js
// ==/UserScript==

'use strict';
document.body.setAttribute('oncontextmenu', 'return false');
document.body.setAttribute('onselectstart', 'return false');
const hostname = window.location.hostname;

const config = {
  'e.360.cn': {
    username: 'input[name="userName"]',
    password: 'input[name="password"]',
    login: 'input[value="登录"]',
  },
  'ad.oceanengine.com': {
    username: 'input[name="account"]',
    password: 'input[name="password"]',
    login: '[class$=login-button]',
  },
  'cas.baidu.com': {
    username: 'input[name="entered_login"]',
    password: '#ucsl-password-edit',
    login: '#submit-form',
  },
};

postMessage('GET_ACCOUNT');
window.onmessage = handlerEvent;
window.onbeforeunload = () => {
  postMessage('WINDOW_CLOSE');
};

function postMessage(action, payload = null) {
  window.opener.postMessage({ action, payload }, '*');
}

function handlerEvent(ev) {
  if (/lanyicj/gi.test(ev.origin)) {
    switch (ev.data.action) {
      case 'GET_ACCOUNT':
        handlerLogin(ev.data.payload);
        break;
      case 'RETRY_CAPTCHA':
        postMessage('CAPTCHA', getCaptcha(ev.data.payload));
        break;
      default:
        break;
    }
  }
}

function handlerLogin(data) {
  const { username, password, login } = config[hostname];
  const $username = document.querySelector(username);
  if (!$username) return setTimeout(() => handlerLogin(data), 500);
  handlerBaidu();
  const $password = document.querySelector(password);
  const $login = document.querySelector(login);
  $username.value = data.username;
  $password.value = data.password;
  $login.click();
}

function handlerBaidu() {
  if (/baidu/gi.test(hostname)) {
    const $loginType = document.querySelector('.login-header .pull-left');
    const $changeLoginType = document.querySelector('.login-header .pull-right');
    const isScanLogin = $loginType.textContent === '扫码登录';
    if (isScanLogin) {
      $changeLoginType.click();
    }
  }
}
