// ==UserScript==
// @name         aliyun - 云效产品管理平台登录失效后自动登录
// @namespace    https://aliyun.com/
// @version      0.18
// @description  让您在登录失效后自动登录
// @license      GPL-3.0
// @author       ss
// @match        https://devops.aliyun.com/*
// @match        https://signin.aliyun.com/*
// @match        https://account.aliyun.com/*
// @icon         https://img.alicdn.com/tfs/TB1_ZXuNcfpK1RjSZFOXXa6nFXa-32-32.ico
// @grant        unsafeInline
// @downloadURL https://update.greasyfork.org/scripts/486037/aliyun%20-%20%E4%BA%91%E6%95%88%E4%BA%A7%E5%93%81%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E7%99%BB%E5%BD%95%E5%A4%B1%E6%95%88%E5%90%8E%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/486037/aliyun%20-%20%E4%BA%91%E6%95%88%E4%BA%A7%E5%93%81%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E7%99%BB%E5%BD%95%E5%A4%B1%E6%95%88%E5%90%8E%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
  let reLoginClicked = false;

  const clickIfTextMatches = async (selector, text) => {
    const element = Array.from(document.querySelectorAll(selector)).find(el => el.textContent === text);
    console.log('clickIfTextMatches', selector, text, element);
    if (element) {
      if (text === '重新登录' && !reLoginClicked) {
        reLoginClicked = true;
        element.click();
      } else {
        element.click();
      }
    }
  };

  const handleDevops = async () => {
    if (window.location.hostname === 'devops.aliyun.com') {
      setInterval(async () => {
        clickIfTextMatches('.next-btn-helper', '重新登录');
      }, 1000);
    }
  };

  const handleAccount = async () => {
    if (window.location.hostname === 'account.aliyun.com') {
      // 等待1秒让内容加载完成，可以根据实际情况调整
      setTimeout(() => {
        clickIfTextMatches('.ram-login-text', 'RAM用户');
      }, 1000);
    }
  };

  const handleSignin = async () => {
    if (window.location.hostname === 'signin.aliyun.com') {
       // 等待1秒让内容加载完成，可以根据实际情况调整
       setInterval(() => {
        var myForm = document.querySelector('form[role="grid"]');
         // 检查 form 元素是否存在
        if (myForm) {
          // 获取 form 元素下的所有子元素
          var formChildren = myForm.children;

          // 检查是否有足够的子元素
          if (formChildren.length >= 2) {
            // 选择第二个子元素（索引为 1，因为索引是从 0 开始的）
            var myTargetDiv = formChildren[1];

            // 移除 display: none
            myTargetDiv.style.display = '';
          } else {
            console.error('form 元素下的子元素不足');
          }
        } else {
          console.error('找不到具有 role="grid" 属性的 form 元素');
        }
        const loginInput = document.getElementById('loginName');

        if (loginInput) {
          loginInput.autofocus = true
          loginInput.click()
          loginInput.value = "shenshuo@turing2020.onaliyun.com"
        }
      }, 1000);
      setInterval(() => {
        clickIfTextMatches('.next-btn-helper', '下一步');
      }, 1000);
      setInterval(() => {
        const loginPassword = document.getElementById('loginPassword');
        if (loginPassword) {
          loginPassword.click()
          loginPassword.value = "ALY@busy7371"
        }
      }, 1000);
      setInterval(() => {
        clickIfTextMatches('.next-btn-helper', '登录');
      }, 1000);
    }
  };

  handleDevops();
  handleAccount();
  handleSignin();
})();
