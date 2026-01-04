// ==UserScript==
// @name         gpt_academic语音播放功能
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  gpt_academic语音播放功能-只针对gpt_academic项目进行的油猴插件开发
// @author       You
// @match        */?__dark-theme=true
// @match        */?__theme=dark
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465274/gpt_academic%E8%AF%AD%E9%9F%B3%E6%92%AD%E6%94%BE%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/465274/gpt_academic%E8%AF%AD%E9%9F%B3%E6%92%AD%E6%94%BE%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("启动增强");
  console.log("加载jquery", $);
  var $component8 = $("#component-8");
  console.log($component8);
  setTimeout(() => {
    const button = document.createElement("button");
    button.innerText = "文本阅读";
    button.style.color = "red";
    button.style.backgroundColor = "yellow";

    // 创建 SpeechSynthesis 实例
    const synth = window.speechSynthesis;

    const speak = (textDtastr) => {
      // 创建新的 SpeechSynthesisUtterance 实例，并设置相关属性
      const utterance = new SpeechSynthesisUtterance(textDtastr);
      utterance.rate = 1.25; // 设置语速为 1.5x （可选）

      // 播放文本语音
      synth.speak(utterance);
    };
    $("#component-8").append(button);
    // 获取最后GPT输出的文案内容

    $(button).click(function () {
      const text = $(".markdown-body").last().text();
      speak(text);
    });
  }, 2500);

  // Your code here...
})();
