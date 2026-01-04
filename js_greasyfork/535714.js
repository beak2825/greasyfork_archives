// ==UserScript==
// @name         You.com University
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动填写you.com/university表单，触发验证码，等待表单提交成功后5秒自动刷新页面重新填写
// @author       你的名字
// @match        https://you.com/university*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535714/Youcom%20University.user.js
// @updateURL https://update.greasyfork.org/scripts/535714/Youcom%20University.meta.js
// ==/UserScript==
(function() {
  'use strict';

  // 生成随机字符串的函数
  function generateRandomString(length = 5) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  // 生成随机邮箱的函数
  function generateRandomEmail() {
    const randomChars = generateRandomString(5);
    return `TomMary2029+${randomChars}@u.northwestern.edu`;
  }

  // 设置输入框值的函数，兼容React/Vue等框架
  function setNativeValue(element, value) {
    const lastValue = element.value;
    element.value = value;
    const event = new Event('input', { bubbles: true });
    // 强制同步React、Vue这类框架的内部状态
    const tracker = element._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue);
    }
    element.dispatchEvent(event);
  }

  // 填写表单的函数
  function fillFormWithRandomEmail() {
    const randomEmail = generateRandomEmail();
    console.log(`生成的随机邮箱: ${randomEmail}`);

    const emailInput = document.querySelector('input[type="email"], input[id*="email"]');
    if (emailInput) {
      setNativeValue(emailInput, randomEmail);
      console.log('邮箱字段已填写');
    } else {
      console.log('未找到邮箱输入字段');
    }

    const universitySelect = document.querySelector('select[id*="university"]');
    if (universitySelect) {
      universitySelect.value = 'Northwestern University';
      universitySelect.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('大学已选择');
    } else {
      console.log('未找到大学选择字段');
    }

    const referrerSelect = document.querySelector('select[id*="where_you_referred"]');
    if (referrerSelect) {
      referrerSelect.value = 'N/A';
      referrerSelect.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('推荐人已选择');
    } else {
      console.log('未找到推荐人选择字段');
    }

    console.log('表单填写完成，随机邮箱为:', randomEmail);
    return randomEmail;
  }

  // 触发reCAPTCHA验证的函数
  function triggerRecaptcha() {
    try {
      console.log('尝试触发reCAPTCHA验证...');

      if (typeof window.grecaptcha !== 'undefined') {
        if (window.grecaptcha.enterprise) {
          window.grecaptcha.enterprise.execute();
          console.log('已使用enterprise.execute()触发reCAPTCHA验证');
          return true;
        } else if (window.grecaptcha.execute) {
          window.grecaptcha.execute();
          console.log('已使用execute()触发reCAPTCHA验证');
          return true;
        } else {
          console.log('grecaptcha对象存在但没有execute方法');
        }
      } else {
        console.log('grecaptcha对象不可用');
      }

      const recaptchaBadge = document.querySelector('.grecaptcha-badge');
      if (recaptchaBadge) {
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        recaptchaBadge.dispatchEvent(clickEvent);
        console.log('已点击reCAPTCHA徽章');
        return true;
      } else {
        console.log('未找到reCAPTCHA徽章');
      }

      return false;
    } catch (error) {
      console.error('触发reCAPTCHA时出错:', error);
      return false;
    }
  }

  // 等待成功提交信息后自动刷新页面
  function waitForSubmissionSuccess() {
    console.log('开始监听表单提交成功信息...');

    // 创建一个MutationObserver来监听DOM变化
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          // 查找包含成功提交信息的元素
          const successElements = document.querySelectorAll('*');
          for (const element of successElements) {
            const text = element.textContent || '';
            if (text.includes('Thank you for your submitting your information') ||
                text.includes('Thank you for submitting your information') ||
                text.includes('表单已成功提交')) {
              console.log('检测到表单提交成功信息！');

              // 尝试自动点击"OK"按钮关闭弹窗
              const okButtons = document.querySelectorAll('button');
              for (const button of okButtons) {
                if (button.textContent.includes('OK') ||
                    button.textContent.includes('Ok') ||
                    button.textContent.includes('确定') ||
                    button.textContent.includes('确认')) {
                  console.log('找到OK按钮，自动点击关闭弹窗');
                  button.click();
                  break;
                }
              }

              console.log('5秒后自动刷新页面...');

              // 延迟5秒后刷新页面，重新填写表单
              setTimeout(() => {
                console.log('正在刷新页面...');
                window.location.reload();
              }, 5000);

              // 停止观察
              observer.disconnect();
              break;
            }
          }
        }
      }
    });

    // 开始观察整个文档的变化
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  // 主函数
  function main() {
    const email = fillFormWithRandomEmail();
    const captchaTriggered = triggerRecaptcha();

    console.log('\n===== 填写完成 =====');
    console.log(`已生成并填写随机邮箱: ${email}`);
    console.log('验证码状态: ' + (captchaTriggered ? '已触发' : '触发失败，请手动完成验证码'));
    console.log('请完成验证码并点击提交按钮，提交成功后将在5秒内自动刷新页面');
    console.log('===================\n');

    // 启动成功提交监听
    waitForSubmissionSuccess();
  }

  // 页面加载完成后执行
  window.addEventListener('load', () => {
    setTimeout(main, 1500);
  });
})();