// ==UserScript==
// @name        西浦自动登录
// @namespace   PairZhu
// @match       https://*.xjtlu.edu.cn/*
// @grant       none
// @version     3.1
// @author      PairZhu
// @run-at      document-end
// @description 2023/12/1 19:02:50
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/484105/%E8%A5%BF%E6%B5%A6%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/484105/%E8%A5%BF%E6%B5%A6%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const domain = window.location.hostname.split('.')[0];
  const pathname = window.location.pathname;
  const search = new URLSearchParams(window.location.search);
  const $ = str => document.querySelector(str);

  const setting = {
    username: 'Heizi.Xiao',// 西浦账号
    password: '1145141919810',// 西浦密码
    waitTimeout: 5000 // 等待表单元素加载超时时间
  }

  const webConfig = {
    core: {
      path: '/local/login',
      action: () => $('#local-login-options div.idp-login.container-fluid.saml2 > a').click()
    },
    uim: {
      path: '/esc-sso/login/page',
      username: '.para-widget-account-psw__input--account input[type=text]',
      password: '.para-widget-account-psw__input--psw input[type=password]',
      login: 'button.para-widget-account-psw__login-button',
    },
    sso: {
      path: '/login',
      username: '#username_show',
      password: '#password_show',
      login: '#btn_login input',
      error: '#msg'
    },
    mail: {
      path: '/owa/auth/logon.aspx',
      username: '#username',
      password: '#password',
      login: '.signinbutton',
      error: '#signInErrorDiv'
    },
    ebridge: {
      path: '/urd/sits.urd/run/siw_lgn',
      username: '#MUA_CODE\\.DUMMY\\.MENSYS',
      password: '#PASSWORD\\.DUMMY\\.MENSYS',
      login: '.sv-btn.sv-btn-block.sv-btn-primary',
      error: '.sv-panel.sv-panel-danger.sv-message-box'
    },
    idp: {
      path: '/idp/profile/SAML2/',
      action: () => {
        switch (search.get("execution")) {
          case "e1s3":
            $('#accept').checked = true;
            $('[name="_eventId_proceed"]').click();
            break;
          case "e1s4":
            $('#_shib_idp_globalConsent').click();
            $('[name="_eventId_proceed"]').click();
            break;
          default:
            break;
        }
      }
    }
  }

  const wait = ms => {
    return new Promise(resolve => {
      const rt = () => resolve()
      setTimeout(rt, ms)
    })
  }

  const waitForElements = async (selectors, timeout = setting.waitTimeout, interval = 100) => {
    selectors = selectors.filter(x=>x);
    for (let i = 0; i < timeout; i += interval) {
      if (selectors.every(selector => $(selector))) {
        return;
      }
      await wait(interval);
    }
    // 获取未找到元素的选择器
    const notFound = selectors.filter(selector => !$(selector));
    if (notFound.length > 0) {
      throw new Error(`未找到元素: ${notFound.join(', ')}`);
    }
  }

  const inputValue = (selector, value) => {
    const element = $(selector);
    element.value = value;
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  const init = async () => {
    if (!webConfig[domain]) return;
    const config = webConfig[domain];
    if (!pathname.startsWith(config.path)) return;
    if (config.error && $(config.error)) return;
    console.log("运行自动登录");
    config.preAction && await config.preAction();
    await waitForElements([config.username, config.password, config.login], setting.waitTimeout);
    try {
      if (config.action) {
        await config.action();
      } else {
        await waitForElements([config.username, config.password, config.login], setting.waitTimeout);
        inputValue(config.username, setting.username);
        inputValue(config.password, setting.password);
        $(config.login).click();
      }
    } catch (e) {
      config.fail && await config.fail();
      console.log('自动登录失败', e);
    }
    config.postAction && await config.postAction();
  }

  init();

})();