// ==UserScript==
// @name            twitter图片快捷缩放
// @namespace       http://weibo.com/myimagination
// @author          @MyImagination
// @version			    1.0
// @description    点击放大方便截图
// @include         https://twitter.com/*/status/*
// @license         WTFPL
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/29311/twitter%E5%9B%BE%E7%89%87%E5%BF%AB%E6%8D%B7%E7%BC%A9%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/29311/twitter%E5%9B%BE%E7%89%87%E5%BF%AB%E6%8D%B7%E7%BC%A9%E6%94%BE.meta.js
// ==/UserScript==
(function () {
  timer = setTimeout(onSub, 3000);
  //.find(".username.js-action-profile-name")
}) ();
function onSub() {
  $('#permalink-overlay .metadata').click(function () {
    $('#permalink-overlay img[data-aria-label-part]').css('top', '');
    $('.AdaptiveMedia.is-square').css('max-height', '5060px');
  });
};
