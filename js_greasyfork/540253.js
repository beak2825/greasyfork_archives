// ==UserScript==
// @name         No Space Scroll
// @name:zh-CN   禁用空格翻页
// @version      1.12
// @description  在页面加载初期即拦截全局的空格键（Space）和 Shift+Space 事件，仅在非输入框、非文本域及非可编辑区域触发时阻止默认的上下翻页行为，确保表单和富文本编辑区中的空格输入功能不受影响。
// @author       珞雪
// @match        *://*/*
// @match        *://*.bilibili.com/*
// @match        *://*.youtube.com
// @match        *://*.vimeo.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.youku.com/*
// @match        *://*.tudou.com/*
// @match        *://*.pptv.com/*
// @match        *://*.v.qq.com/*
// @match        *://*.mgtv.com/*
// @match        *://*.sohu.com/*
// @match        *://*.acfun.cn/*
// @match        *://*.netflix.com/*
// @match        *://*.primevideo.com/*
// @match        *://*.hulu.com/*
// @match        *://*.dailymotion.com/*
// @match        *://*.twitch.tv/*
// @exclude      *://*.bilibili.com/*/*
// @exclude      *://*.youtube.com/shorts/*
// @exclude      *://*.youtube.com/watch/*
// @exclude      *://*.vimeo.com/*/*
// @exclude      *://*.iqiyi.com/*/*
// @exclude      *://*.youku.com/*/*
// @exclude      *://*.tudou.com/*/*
// @exclude      *://*.pptv.com/*/*
// @exclude      *://*.v.qq.com/*/*
// @exclude      *://*.mgtv.com/*/*
// @exclude      *://*.sohu.com/*/*
// @exclude      *://*.acfun.cn/*/*
// @exclude      *://*.netflix.com/*/*
// @exclude      *://*.primevideo.com/*/*
// @exclude      *://*.hulu.com/*/*
// @exclude      *://*.dailymotion.com/*/*
// @exclude      *://*.twitch.tv/*/*
// @noframes
// @run-at       document-start
// @license      MIT
// @grant        none
// @namespace    https://github.com/luoxue3943/NoSpaceScroll
// @downloadURL https://update.greasyfork.org/scripts/540253/No%20Space%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/540253/No%20Space%20Scroll.meta.js
// ==/UserScript==

/*
声明：请您知晓本插件本是个人测试自用，本不完美也不保证可用性。
相关功能及代码均来自互联网及网友分享，我们仅做了相关功能的整合。
如无意中侵犯了哪个企业或个人等的知识产权，请联系我们将及时删除等相关处理
如果误杀请自行关闭被动去广告
*/

(function () {
  function isEditable(el) {
    return el.matches(
      'input, textarea, [contenteditable="true"], video, audio'
    );
  }

  function killSpace(e) {
    const active = document.activeElement;
    if (e.code === "Space" && !isEditable(active)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }

  window.addEventListener("keydown", killSpace, { capture: true });
  window.addEventListener("keypress", killSpace, { capture: true });
})();
