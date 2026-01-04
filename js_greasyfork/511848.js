// ==UserScript==
// @name         学习通批作业 使用快捷键快速赋分并提交进入下一份作业
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  按下 Alt+1 会自动选择A分数（默认100）然后在1秒后按下“提交并进入下一份”按钮，按下 Alt+2 会自动选择B分数（默认80）然后在1秒后按下“提交并进入下一份”按钮。
// @author       Woden
// @match        *://mooc2-ans.chaoxing.com/mooc2-ans/work/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511848/%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%89%B9%E4%BD%9C%E4%B8%9A%20%E4%BD%BF%E7%94%A8%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%BF%AB%E9%80%9F%E8%B5%8B%E5%88%86%E5%B9%B6%E6%8F%90%E4%BA%A4%E8%BF%9B%E5%85%A5%E4%B8%8B%E4%B8%80%E4%BB%BD%E4%BD%9C%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/511848/%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%89%B9%E4%BD%9C%E4%B8%9A%20%E4%BD%BF%E7%94%A8%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%BF%AB%E9%80%9F%E8%B5%8B%E5%88%86%E5%B9%B6%E6%8F%90%E4%BA%A4%E8%BF%9B%E5%85%A5%E4%B8%8B%E4%B8%80%E4%BB%BD%E4%BD%9C%E4%B8%9A.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.addEventListener('keydown', function(event) {
    // 检查是否同时按下了 Alt 和 1 键
    if (event.altKey && event.key === '1') {
      event.preventDefault();

      // 查找目标按钮，注意 fastScore 拼写
      const firstButton = document.querySelector('li.fastScore[data="100"] a');
        const secondButton = document.querySelector('a.jb_btn.jb_btn_160.fr.fs14.marginLeft30[onclick^="markAction"]');

      if (firstButton && secondButton) {
        firstButton.click();
        //alert("成功点击第一个按钮！");
          console.log("成功点击第一个按钮！")

        // 延时1秒后点击第二个按钮
        setTimeout(() => {
          secondButton.click();
            console.log("成功点击第二个按钮！")
          //alert("成功点击第二个按钮！");
        }, 1000); // 1000 毫秒 = 1 秒

      } else {
        console.error("未找到目标按钮！");
      }
    }
          // 检查是否同时按下了 Alt 和 2 键
    if (event.altKey && event.key === '2') {
      event.preventDefault();

      // 查找目标按钮，注意 fastScore 拼写
      const firstButton = document.querySelector('li.fastScore[data="80"] a');
        const secondButton = document.querySelector('a.jb_btn.jb_btn_160.fr.fs14.marginLeft30[onclick^="markAction"]');

      if (firstButton && secondButton) {
        firstButton.click();
        //alert("成功点击第一个按钮！");
          console.log("成功点击第一个按钮！")

        // 延时1秒后点击第二个按钮
        setTimeout(() => {
          secondButton.click();
            console.log("成功点击第二个按钮！")
          //alert("成功点击第二个按钮！");
        }, 1000); // 1000 毫秒 = 1 秒

      } else {
        console.error("未找到目标按钮！");
      }
    }

                // 检查是否同时按下了 Alt 和 3 键
    if (event.altKey && event.key === '3') {
      event.preventDefault();

      // 查找目标按钮，注意 fastScore 拼写
      const firstButton = document.querySelector('li.fastScore[data="70"] a');
        const secondButton = document.querySelector('a.jb_btn.jb_btn_160.fr.fs14.marginLeft30[onclick^="markAction"]');

      if (firstButton && secondButton) {
        firstButton.click();
        //alert("成功点击第一个按钮！");
          console.log("成功点击第一个按钮！")

        // 延时1秒后点击第二个按钮
        setTimeout(() => {
          secondButton.click();
            console.log("成功点击第二个按钮！")
          //alert("成功点击第二个按钮！");
        }, 1000); // 1000 毫秒 = 1 秒

      } else {
        console.error("未找到目标按钮！");
      }
    }

                // 检查是否同时按下了 Alt 和 4 键
    if (event.altKey && event.key === '4') {
      event.preventDefault();

      // 查找目标按钮，注意 fastScore 拼写
      const firstButton = document.querySelector('li.fastScore[data="60"] a');
        const secondButton = document.querySelector('a.jb_btn.jb_btn_160.fr.fs14.marginLeft30[onclick^="markAction"]');

      if (firstButton && secondButton) {
        firstButton.click();
        //alert("成功点击第一个按钮！");
          console.log("成功点击第一个按钮！")

        // 延时1秒后点击第二个按钮
        setTimeout(() => {
          secondButton.click();
            console.log("成功点击第二个按钮！")
          //alert("成功点击第二个按钮！");
        }, 1000); // 1000 毫秒 = 1 秒

      } else {
        console.error("未找到目标按钮！");
      }
    }

                // 检查是否同时按下了 Alt 和 5 键
    if (event.altKey && event.key === '5') {
      event.preventDefault();

      // 查找目标按钮，注意 fastScore 拼写
      const firstButton = document.querySelector('li.fastScore[data="50"] a');
        const secondButton = document.querySelector('a.jb_btn.jb_btn_160.fr.fs14.marginLeft30[onclick^="markAction"]');

      if (firstButton && secondButton) {
        firstButton.click();
        //alert("成功点击第一个按钮！");
          console.log("成功点击第一个按钮！")

        // 延时1秒后点击第二个按钮
        setTimeout(() => {
          secondButton.click();
            console.log("成功点击第二个按钮！")
          //alert("成功点击第二个按钮！");
        }, 1000); // 1000 毫秒 = 1 秒

      } else {
        console.error("未找到目标按钮！");
      }
    }
  });
})();