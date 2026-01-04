// ==UserScript==
// @name:zh-tw      CakeResume 誰造訪了我的個人檔案
// @name            View all visitor on CakeResume insight page
// @namespace       com.sherryyue.cakeresumeunlock
// @version         0.5
// @description:zh-tw 此腳本移除 CakeResume 平台上「誰造訪了我的個人檔案」頁面的限制，讓用戶能完整查看並互動來自求職者、雇主或獵頭的訊息，不再有遮蔽或模糊顯示的內容。這些功能原本是需要購買付費會員才能達到的效果。
// @description     This script removes the restrictions on the 'Who Visited My Profile' page in CakeResume, allowing users to view and interact with messages from job seekers, employers, or headhunters without any obstructions or blurred content. Originally, these features are only available to paid members.
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           *://*.cakeresume.com/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/446764/View%20all%20visitor%20on%20CakeResume%20insight%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/446764/View%20all%20visitor%20on%20CakeResume%20insight%20page.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // insight page
  const class1 = 'c-viewer-card-blur';
  const class2 = 'l-viewer-card-mask';
  const class4 = "[class*='MessageChannelViewer_acceptance_']";
  // messages page & message popup
  const class3 = 'chat-connect-container';

  let errorBlockObserver = new MutationObserver((mutations, obs) => {
    const elm1 = document.querySelector(`.${class1}`);
    if (elm1) {
      document.querySelectorAll('.' + class1).forEach(elm => {
        elm.classList.remove(class1);
      });
    }
    const elm2 = document.querySelector(`.${class2}`);
    if (elm2) {
      document.querySelectorAll('.' + class2).forEach(elm => {
        elm.classList.remove(class2);
      });
    }
    const elm3 = document.querySelector(`.${class3}`);
    if (elm3) {
      document.querySelectorAll('.' + class3).forEach(elm => {
        elm.classList.remove(class3);
      });
    }
    const elm4 = document.querySelector(class4);
    if (elm4) {
      elm4.style.setProperty('background','none','important');
    }
  });

  errorBlockObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
})();