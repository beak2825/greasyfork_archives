// ==UserScript==
// @name         禁用open3dmodel的广告拦截弹窗
// @name:en      Disable open3dmodel AD blocker pop-ups
// @namespace    http://tampermonkey.net/
// @version      2024-08-27
// @description  移除安装广告拦截插件后导致的弹窗
// @description:en  Removes pop-ups caused by installing AD blockers
// @author       You
// @match        https://open3dmodel.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=open3dmodel.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505372/%E7%A6%81%E7%94%A8open3dmodel%E7%9A%84%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/505372/%E7%A6%81%E7%94%A8open3dmodel%E7%9A%84%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const timer = setTimeout(() => {
      if (!document.querySelector('.mdp-deblocker-wrapper')) return;
      run();
    }, 5);

    const run = () => {
      clearTimeout(timer);
      const nodeList = document.querySelectorAll('body.mdp-deblocker-blur>:not(#wpadminbar):not(.mdp-deblocker-modal):not(.mdp-deblocker-wrapper):not(.mdp-deblocker-blackout)');
      nodeList.forEach((el, i) => {
        el.style.webkitFilter = 'blur';
        el.style.filter = 'none';
      });

      document.querySelector('.mdp-deblocker-blackout.active').remove();
      document.querySelector('.mdp-deblocker-wrapper').remove();
    }
})();