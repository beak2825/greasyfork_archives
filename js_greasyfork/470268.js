// ==UserScript==
// @name         quakedeleteinfo
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  替换quake网页个人中心里的敏感信息为******!
// @author       360quake
// @match        https://quake.360.net/quake/
// @match        https://quake.qihoo.net/quake/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quake.360.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470268/quakedeleteinfo.user.js
// @updateURL https://update.greasyfork.org/scripts/470268/quakedeleteinfo.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 定义邮箱验证的正则表达式常量
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // 定义以+86开头的手机号码验证的正则表达式常量
  const PHONE_NUMBER_REGEX = /^\+86\d{11}$/;

  /**
   * 替换页面中的邮箱地址和手机号码为"***********"
   */
  function replaceEmailAndPhoneNumbers() {
    // 获取所有的<span>标签
    const spanTags = document.getElementsByTagName("span");

    // 遍历每个<span>标签
    for (let i = 0; i < spanTags.length; i++) {
      const spanTag = spanTags[i];
      const text = spanTag.textContent.trim();

      // 判断<span>标签的值是否为邮箱地址或以+86开头的手机号
      if (isEmail(text) || isPhoneNumber(text)) {
        // 将包含邮箱地址或手机号的<span>标签的值修改为"***********"
        spanTag.textContent = "***********";
      }
    }
  }

  /**
   * 判断给定的值是否为邮箱地址
   * @param {string} value - 待验证的字符串
   * @returns {boolean} - 如果是邮箱地址返回true，否则返回false
   */
  function isEmail(value) {
    // 使用正则表达式进行邮箱验证
    return EMAIL_REGEX.test(value);
  }

  /**
   * 判断给定的值是否为以+86开头的手机号码
   * @param {string} value - 待验证的字符串
   * @returns {boolean} - 如果是以+86开头的手机号码返回true，否则返回false
   */
  function isPhoneNumber(value) {
    return PHONE_NUMBER_REGEX.test(value);
  }

  // 在页面加载时进行替换操作
  replaceEmailAndPhoneNumbers();

  // 在DOM树变化时进行替换操作
  const observer = new MutationObserver(replaceEmailAndPhoneNumbers);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
