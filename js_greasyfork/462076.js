// ==UserScript==
// @name         小熊猫
// @namespace    https://your-namespace-here/
// @version      4
// @description  在监听回车键后执行您的代码
// @author       Your Name
// @match        https://aigcfun.com/*
// @match        https://chatmindai.cn/*
// @license      MIT
// @icon         https://inews.gtimg.com/newsapp_bt/0/11762967991/641
// @downloadURL https://update.greasyfork.org/scripts/462076/%E5%B0%8F%E7%86%8A%E7%8C%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/462076/%E5%B0%8F%E7%86%8A%E7%8C%AB.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (window.location.hostname === "aigcfun.com") {
    const key = 'CHATAPIKEYTOKENDATA';
    const storage = window.localStorage;

    function handleEnterKey(event) {
      if (event.key === 'Enter') {
        const value = storage.getItem(key);
        if (value) {
          const data = JSON.parse(JSON.parse(value));
          const currentKey = data.key
          fetch(`https://api.aigcfun.com/fc/verify-key?key=${currentKey}`)
            .then(response => response.json())
            .then(data => {
              console.log('校验', data)
              if (data.data.remain == 0) {
                storage.removeItem(key);
                location.reload();
              }
            })
        } else {
          fetch('https://api.aigcfun.com/fc/key')
            .then(response => response.json())
            .then(data => {
              const key = data.data;
              // setTimeout(() => {
              const input = document.querySelector('input[placeholder="FCXXXXXXXXXXXXXXXX"]');
              if (input) {
                input.focus();
                // input.value = key;
                document.execCommand('insertText', false, key);
                console.log('input', input, key)
              }
              // }, 1000)

            })
            .catch(error => {
              console.error('Error:', error);
            });
        }


      }
    }

    document.addEventListener('keydown', handleEnterKey);
  } else if (window.location.hostname === "chatmindai.cn") {
    function handleEnterKey(event) {

      const markdownBody = event.target.closest('.markdown-body'); // 查找点击元素最近的class属性为"markdown-body"的祖先元素
      console.log('markdownBody', markdownBody)

      if (markdownBody) {
        let textContent = '';
        for (let i = 0; i < markdownBody.children.length; i++) {
          textContent += markdownBody.children[i].textContent.trim() + ' '; // 将每个子元素的文本内容合并起来
        }
        if ('speechSynthesis' in window) {
          // 确认浏览器支持 Web Speech API
          // 创建一个新的音频合成对象
          const synth = window.speechSynthesis;
          // 实例化一个SpeechSynthesisUtterance对象
          const speech = new SpeechSynthesisUtterance(textContent);

          if (synth.speaking) {
            synth.cancel()
            return
          }
          // 播放语音合成
          synth.speak(speech);

        } else {
          return false
        }
      }
    }
    document.addEventListener('click', handleEnterKey);
  }




})();
