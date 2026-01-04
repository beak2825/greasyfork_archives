// ==UserScript==
// @name         Auto Github
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Automatically fill in and submit the payment information form after navigation.
// @author       llkj
// @match        https://github.com/signup*
// @match        https://github.com/
// @match        https://github.com/signup?source=login
// @match        https://github.com/login?return_to=*device*
// @match        https://github.com/account_verifications?recommend_plan=true
// @match        https://github.com/settings/billing/payment_information
// @match        https://github.com/join/welcome
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492736/Auto%20Github.user.js
// @updateURL https://update.greasyfork.org/scripts/492736/Auto%20Github.meta.js
// ==/UserScript==





(function () {
  'use strict';


  // 支付信息
  function payInfo() {
    console.log('步骤1: 填充支付信息...');
    try {
      document.querySelector('input#account_screening_profile_first_name').value = 'Goldner';
      document.querySelector('input#account_screening_profile_last_name').value = 'Adolf';
      document.querySelector('input#account_screening_profile_address1').value = 'No.1 Juxian Road';
      document.querySelector('input#account_screening_profile_city').value = 'Yantai City';
      document.querySelector('select#account_screening_profile_country_code').value = 'CN';
      document.querySelector('input#account_screening_profile_region').value = 'Shandong Province';
      document.querySelector('input#account_screening_profile_postal_code').value = '265500';
      document.querySelector('button.FormField-input.flex-self-start.Button--primary.Button--medium.Button').click();
      console.log('步骤1完成.');
    } catch (error) {
      console.error('步骤1出错: ', error);
    }
  }




  function createBox() {
    var logArea = document.createElement('textarea');
    logArea.id = 'logArea';
    logArea.style.position = 'fixed';
    logArea.style.top = '10px';
    logArea.style.left = '10px';
    logArea.style.width = '200px';
    logArea.style.height = '100px';
    logArea.style.zIndex = '9999';
    logArea.readOnly = true;
    document.body.appendChild(logArea);

    logArea.addEventListener('mousedown', function (event) {
      var shiftX = event.clientX - logArea.getBoundingClientRect().left;
      var shiftY = event.clientY - logArea.getBoundingClientRect().top;

      logArea.style.position = 'absolute';
      logArea.style.zIndex = 1000;

      moveAt(event.pageX, event.pageY);

      function moveAt(pageX, pageY) {
        logArea.style.left = pageX - shiftX + 'px';
        logArea.style.top = pageY - shiftY + 'px';
      }

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
      }

      document.addEventListener('mousemove', onMouseMove);

      logArea.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        logArea.onmouseup = null;
      };

    });

    logArea.ondragstart = function () {
      return false;
    };

    console.log = function (message) {
      logArea.value += new Date().toTimeString().split(' ')[0] + ' - ' + message + '\n';
      logArea.scrollTop = logArea.scrollHeight;
    };
  }


  function generateRandomPassword(length) {
    var uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    var numbers = '0123456789';
    var symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    var allCharacters = uppercaseLetters + lowercaseLetters + numbers + symbols;
    var password = '';

    for (var i = 0; i < length; i++) {
      var randomIndex = Math.floor(Math.random() * allCharacters.length);
      password += allCharacters[randomIndex];
    }

    return password;
  }


  const defaultPassword = ''
  async function signup() {
    const username = randomString();
    const password = defaultPassword || generateRandomPassword(10);
    // const email = ``;
    // 弹出一个输入框
    const email = prompt('请输入邮箱地址:', 'email@xx.com');

    logMessage('开始注册......');
    const github_signup = {
      username,
      email,
      password,
      name: 'github_signup',
    };
    localStorage.setItem('github_signup', JSON.stringify(github_signup));
    const github_signup_str = JSON.stringify(github_signup, null, 2);
    logMessage('注册信息: ' + JSON.stringify(github_signup));

    logMessage('点击继续按钮...');
    await clickButton(".js-continue-container");

    logMessage('输入注册信息...');
    logMessage('输入邮箱: ' + email);
    await fillInput("#email", email);

    logMessage('点击继续按钮...');
    await clickButton("#email-container .js-continue-button");

    logMessage('输入密码: ' + password);
    await fillInput("#password", password);

    logMessage('点击继续按钮...');
    await clickButton("#password-container .js-continue-button");

    logMessage('输入用户名: ' + username);
    await fillInput("#login", username);

    logMessage('点击继续按钮...');
    await clickButton("#username-container .js-continue-button");

    logMessage('点击继续按钮...');
    await clickButton("#opt-in-container .js-continue-button");

    logMessage('点击提交按钮...');
    await clickButton("button[name=button]");


    confirm('注册信息' + github_signup_str)

    logMessage('等待验证码提交按钮变为可点击状态...');
    await waitUntilButtonEnabled('.js-octocaptcha-form-submit');

    logMessage('点击验证码提交按钮...');
    await clickButton('.js-octocaptcha-form-submit');

    logMessage('取消勾选...');
    await uncheck("#opt_in");

    logMessage('点击提交按钮...');
    await clickButton("button[name=button]");

  }

  function randomString() {
    let str = '';
    for (let i = 0; i < 8; i++) {
      let random = Math.floor(Math.random() * 36);
      if (random < 10) {
        str += random;
      } else {
        str += String.fromCharCode(random + 87);
      }
    }
    return str;
  }




  function logMessage(message) {
    console.log(message);
  }



  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }



  async function clickButton(selector) {
    await delay(1000);
    await elementReady(selector).then(element => element.click());
  }


  async function fillInput(selector, value) {
    await delay(1000);
    await elementReady(selector).then(element => { element.value = value; element.blur() });
  }

  async function uncheck(selector) {
    await elementReady(selector).then(element => { element.checked = false; });
  }

  async function waitUntilButtonEnabled(selector) {
    return observeAttributeChange(selector, (node) => {
      return !node.hasAttribute('disabled') && !node.hasAttribute('hidden');
    })
  }

  function observeAttributeChange(selector, condition) {
    return new Promise((resolve, reject) => {
      const targetNode = document.querySelector(selector);
      if (!targetNode) {
        reject('No element found with the given selector.');
        return;
      }
      if (condition(targetNode)) {
        resolve(targetNode);
        return;
      }
      const config = { attributes: true };
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (condition(targetNode)) {
            observer.disconnect();
            resolve(targetNode);
          }
        });
      });
      observer.observe(targetNode, config);
    });
  }

  function elementReady(selector) {
    return new Promise((resolve, reject) => {
      let el = document.querySelector(selector);
      if (el) { resolve(el); }
      new MutationObserver((mutationRecords, observer) => {
        Array.from(document.querySelectorAll(selector)).forEach((element) => {
          resolve(element);
          observer.disconnect();
        });
      })
        .observe(document.documentElement, { childList: true, subtree: true });
    });
  }


  window.addEventListener('load', function () {
    console.log('页面加载完成，开始执行脚本...');
    try {
      if (window.location.href === 'https://github.com/login?return_to=https%3A%2F%2Fgithub.com%2Flogin%2Fdevice') {
        window.location.replace('https://github.com/signup?source=login');
      } else if (window.location.href === 'https://github.com/signup?source=login' || window.location.href === 'https://github.com/signup') {
        waitForElement("email", signup);
        localStorage.setItem('billing', 0);
      } else if (window.location.href === 'https://github.com/join/welcome' || (window.location.href === 'https://github.com/' && localStorage.getItem('billing') == 0)) {
        window.location.replace('https://github.com/settings/billing/payment_information');
        localStorage.setItem('billing', 1);
      } else if (window.location.href === 'https://github.com/settings/billing/payment_information' && localStorage.getItem('billing') == 1) {
        payInfo();
        localStorage.setItem('billing', 2);
      } else if (window.location.href === 'https://github.com/settings/billing/payment_information' && localStorage.getItem('billing') == 2) {
        window.location.replace('https://github.com/settings/two_factor_authentication/setup/intro');
        localStorage.setItem('billing', 3);
      }
    } catch (error) {
      console.error('脚本执行出错: ', error);
    }
  }, false);

  function waitForElement(elementId, callback) {
    console.log(`等待元素${elementId}出现...`);
    var interval = setInterval(function () {
      var element = document.getElementById(elementId);
      if (element) {
        clearInterval(interval);
        console.log(`元素${elementId}已出现，执行回调函数...`);
        setTimeout(() => {
          callback();
        }, 2000);
      }
    }, 500);
  }
})()