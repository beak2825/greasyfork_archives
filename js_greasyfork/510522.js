// ==UserScript==
// @name         Discuz论坛自动登录
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  支持一些基于 Discuz! 的论坛自登录，根据网页元素特征匹配单个论坛，需要一定的开发能力
// @author       wzj042
// @match        *://*/*
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3NTc1Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3NzcxNzc1Nzc3Nzg3Nzc3N//AABEIABwAHAMBEQACEQEDEQH/xAAaAAACAgMAAAAAAAAAAAAAAAAEBQEGAAIH/8QAKhAAAgEDAQYFBQAAAAAAAAAAAQIDAAQRUQUSITFBYRMiMpGhQnGxwdH/xAAaAQACAwEBAAAAAAAAAAAAAAAEBQABAwYH/8QAJREAAQMCBQQDAAAAAAAAAAAAAQACAwQRBRIhMfBBUWHRE4Gh/9oADAMBAAIRAxEAPwDs9/di1RQqhpH9IPLuT8UFW1jaZo0uTsFrFF8h8BK5bydfNJeMjHiFRV/n5pFPiMsesktj2AHo/qLbC07NW1htktOsNwd4McB8YIPfHCt8Pxv5XiOTr125zRVNSWbmanldGgEp20jK0c4HkAKsdNP38UjxmJ9mygaDdGUrhYtSKRjvEv6uua4aQvc8l+6ZAC2iizge6u0SPXj2HU0ywumfNMA1VK8RsJKulehpEsIyMHlUUSe+2Iszlrd1jB+jHAfbSkVbgkc787DbwjYqwsFnC6Et/A2LcN4haWTGDujAXOPc8tKDidTYTNkdcuPbp7PO61fnqW6aBWJGDorKchhkGuoaQ4XCXEWNipq1SyoohbmwtbmQSTwhmHXJHvrQk9FTzvD5G3I59rVk0jBZpRQ4DAotZL//2Q==
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/510522/Discuz%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/510522/Discuz%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // 等待网页加载
  const config = {
    username: "",
    password: "",
    auto_login: true,
    weight_limit: 2,
    // 如果存在发布页
    requirement_enable: false,
    // 发布页域名特征
    requirement_domain: [""],
    sample: [ "地址发布器下载", "发现以下行为将会被扣分处理"]
  };
  window.onload = function () {
    // 匹配域名
    // 此处可根据特定论坛的发布页自定义
    if (config.requirement_enable) {
      var domain = window.location.hostname;
      var is_discuz = config.requirement_domain.some((item) => {
        return domain.includes(item);
      });
      if (is_discuz) {
        const link = queryElement(".link");
        link.then((element) => {
          if (element.innerText.includes("最新地址")) {
            element.click();
          }
        });
        return;
      }
    }
    // 如果配置为空，提示用户在配置页面填写
    const data = config;
    if (!data.username || !data.password) {
      console.log("请在脚本源码页面填写用户名和密码");
      return;
    }

    // 匹配元素
    // 设置校验权重，通过大部分视为discuz子论坛
    var weight = 0;
    // 通过链接文本匹配，也可以自行拓展
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
      const { title, innerText } = links[i];

      config.sample.forEach((text) => {
        if (innerText.includes(text) || title.includes(text)) {
          weight += 1;
        }
      });
    }

    if (weight < config.weight_limit) {
      return;
    }

    // 假设未登录，查询表单
    const element = queryElement("#lsform");
    element.then((element) => {
      const username = element.querySelector('input[name="username"]');
      const password = element.querySelector('input[name="password"]');
      const auto_login = element.querySelector('input[name="cookietime"]');
      const submit = element.querySelector("button");
      if (!username || !password || !auto_login || !submit) {
        console.log("element not found");
        return;
      }
      // 填写表单
      username.value = data.username;
      password.value = data.password;
      auto_login.checked = data.auto_login;
      console.log("submit:", submit);

      // 提交表
      submit.click();
    });
  };
  // 异步查询确保元素加载
  async function queryElement(selector) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          clearInterval(interval);
          resolve(element);
        }
      }, 1000);
    });
  }
})();
