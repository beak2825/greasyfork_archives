// ==UserScript==
// @name         yxy_live_auto_sign
// @namespace    https://github.com/ufec/yxy_live_auto_sign
// @version      0.1.4
// @description  优学院直播/保利威直播自动签到 fuck ulearning
// @author       ufec
// @license      MIT
// @homepage     https://github.com/ufec/yxy_live_auto_sign
// @supportURL   https://github.com/ufec/yxy_live_auto_sign
// @match        https://live.polyv.cn/watch/*
// @match        https://www.ulearning.cn/ulearning/live.html?channelId=*
// @icon         https://static.ulearning.cn/static/course_web/common/img/appicon_2.0.png
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/450807/yxy_live_auto_sign.user.js
// @updateURL https://update.greasyfork.org/scripts/450807/yxy_live_auto_sign.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // 执行签到
  function execSign() {
    // 签到界面弹窗元素
    let signDialog = document.querySelector(
      '.plv-iar-btn-default.pws-btn-bg-color.pws-vclass-btn--primary',
    );
    if (signDialog == null) {
      setTimeout(execSign, 3000);
      return;
    }
    // 定位到具体签到Dialog
    signDialog = signDialog.parentElement.parentElement.parentElement.parentElement.parentElement;
    // 签到按钮
    let signButton = null;
    document
      .querySelectorAll(
        '.plv-iar-btn-default.pws-btn-bg-color.pws-vclass-btn--primary',
      )
      .forEach((btn) => {
        if (btn.innerText == '立即签到') {
          signButton = btn;
        }
      });
    const polyvLiveAutoSignObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        console.log('mutation: ', mutation);
        if (
          window.getComputedStyle(mutation.target).getPropertyValue('display') !=
          'none'
        ) {
          signButton.click(); // 点击签到按钮
          const target = document.querySelector(".g-boundary.c-watch__main__inner"); // 目标元素
          const newNode = document.createElement("p"); // 创建新元素
          newNode.innerHTML = new Date().toLocaleString() + " 自动签到成功"; // 设置新元素内容
          newNode.classList.add("g-boundary"); // 设置新元素样式
          newNode.style = "color: #fff; padding: 5px 0;"; // 设置新元素样式
          target.parentNode.insertBefore(newNode, target); // 插入到目标元素之前
        }
      });
    });
    alert('开始监听签到弹窗, flag is ' + String(polyvLiveAutoSignObserver instanceof MutationObserver));
    polyvLiveAutoSignObserver.observe(signDialog, {
      attributes: true,
      attributeFilter: ['style'],
    });
  }

  // 检查网页是否加载了签到弹窗
  function check() {
    const liveIframe = document.querySelector('#liveIframe');
    if (liveIframe == null) {
      setTimeout(check, 3000);
      return;
    }
    // 监听iframe加载完成
    liveIframe.onload = () => {
      // 跳转到iframe
      window.location.href = liveIframe.src;
    };
    execSign();
  }
  window.onload = function () {
    if (window.location.href.indexOf('live.polyv.cn') > -1) {
      // 保利威直播
      execSign();
    }else{
      // 优学院直播
      check();
    }
  };
})(window);