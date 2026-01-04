// ==UserScript==
// @name              左键限制解除
// @description       左键选中
// @version           1.3
// @match             *://*/*
// @run-at            document-start
// @grant             none
// @namespace https://greasyfork.org/users/12375
// @downloadURL https://update.greasyfork.org/scripts/526716/%E5%B7%A6%E9%94%AE%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/526716/%E5%B7%A6%E9%94%AE%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function() {

  // 默认规则配置
  var rule = {
    hook_addEventListener: true,
  };

  // 初始化
  function init() {

    // hook addEventListener
    if(rule.hook_addEventListener) {
      document.addEventListener = addEventListener;
    }

  }
  init();

  // 视频控制保护逻辑
  const EV = {
    select: 1, selectstart: 2, copy: 4, cut: 8, contextmenu: 16,
    mousedown: 32, mouseup: 64, mousemove: 128, click: 256
  };

  const isVideoControl = (target) => {
      if(target.tagName === 'VIDEO' ||
         target.classList.contains('progress-bar') ||
         target.closest('video,[role^="video-"]')) {
         return true;
      }
      return false;
  };

  const { addEventListener: protoAdd } = EventTarget.prototype;

  EventTarget.prototype.addEventListener = function(type, listener, options) {
    const eventFlag = EV[type] || 0;
    if(eventFlag & 0b00011111 && !isVideoControl(this)) {} else {
      protoAdd.call(this, type, listener, options);
    }
  };

})();