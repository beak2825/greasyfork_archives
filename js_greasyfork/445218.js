// ==UserScript==
// @name         autoLogin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动登录页面
// @author       You
// @match        http://leirensheng.dynv6.net:9999/*
// @match     http://*/dc-admin/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dynv6.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445218/autoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/445218/autoLogin.meta.js
// ==/UserScript==

(() => {
    const $ = (sel) => document.querySelector(sel);
  
    function loginNote() {
      const user = $("#loginBtns");
      if (user && user.innerText.includes("leirensheng")) {
        console.log("已经登录");
        $("#loginBtns > a:nth-child(1)").click();
      } else if (window.location.href.includes("login")) {
        $("#email").value = "leirensheng@163.com";
        $("#pwd").value = "fendou098765";
        $("#loginBtn").click();
      } else {
        const dom = $("body > section > div.header > div > a:nth-child(2)");
        if (dom) {
          dom.click();
        }
      }
    }
    function sleep(time) {
      return new Promise((resolve) => {
        setTimeout(resolve, time);
      });
    }
  
    async function loginJiance() {
      await sleep(500);
      const pass = $("[name=password]");
      const captcha = $("[name=captcha]");
      const user = $("[name=username]");
  
      user.value = "system";
      user.dispatchEvent(new Event("input"));
  
      pass.value = "123456";
      pass.dispatchEvent(new Event("input"));
  
      captcha.value = "1234";
      captcha.dispatchEvent(new Event("input"));
  
      $("[type=button]").click();
    }
  
    const platforms = [
      {
        condition: /(leirensheng(.*))|(192.168.2.34):9999|(51vip)/,
        handler: loginNote,
      },
      {
        condition: /dc-admin\/#\/login/,
        handler: loginJiance,
      },
    ];
  
    // eslint-disable-next-line no-restricted-syntax
    for (const one of platforms) {
      let isMatch = false;
      if (typeof one.condition === "function") {
        isMatch = one.condition();
      } else {
        isMatch = one.condition.test(window.location.href);
      }
      console.log({isMatch})
      if (isMatch) {
        one.handler();
        break;
      }
    }
  })();
  