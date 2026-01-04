// ==UserScript==
// @name         一键打开自媒体网站
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  打开我写的自媒体创作中心，方便我上传视频
// @author       小垃圾kiki
// @match      *://*/*
// @include    *
// @license MIT
// @grant         GM_registerMenuCommand
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/474120/%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%E8%87%AA%E5%AA%92%E4%BD%93%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/474120/%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%E8%87%AA%E5%AA%92%E4%BD%93%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

(function() {
  'use strict';
  GM_registerMenuCommand('打开快手', () => {
      GM_openInTab('https://cp.kuaishou.com/article/publish/video?origin=www.kuaishou.com');
  });
  GM_registerMenuCommand('打开抖音', () => {
      GM_openInTab('https://www.douyin.com/');
  });
  GM_registerMenuCommand('打开小红书', () => {
      GM_openInTab('https://creator.xiaohongshu.com/publish/publish?source=official');
  });
  GM_registerMenuCommand('打开微博', () => {
      GM_openInTab('https://weibo.com/');
  });
  GM_registerMenuCommand('打开bilibili', () => {
      GM_openInTab('https://member.bilibili.com/platform/home?spm_id_from=333.1007.0.0');
  });
  GM_registerMenuCommand('打开西瓜创作平台', () => {
      GM_openInTab('https://studio.ixigua.com/');
  });
  GM_registerMenuCommand('打开全部', () => {
      open()
  });

  function open() {
      GM_openInTab('https://cp.kuaishou.com/article/publish/video?origin=www.kuaishou.com');
      GM_openInTab('https://www.douyin.com/');
      GM_openInTab('https://creator.xiaohongshu.com/publish/publish?source=official');
      GM_openInTab('https://weibo.com/');
      GM_openInTab('https://member.bilibili.com/platform/home?spm_id_from=333.1007.0.0');
      GM_openInTab('https://studio.ixigua.com/');
  }

})();
