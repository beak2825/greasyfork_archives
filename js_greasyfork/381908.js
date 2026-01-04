// ==UserScript==
// @name  防QQ弹窗
// @version 1.0.1
// @description 阻止自动弹出QQ聊天窗口.
// @match *://*/*
// @grant none
// @namespace https://greasyfork.org/users/21198
// @downloadURL https://update.greasyfork.org/scripts/381908/%E9%98%B2QQ%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/381908/%E9%98%B2QQ%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==
(function() {
    'use strict';
  var filter = $(".qq_iframe");
  for (var i = 0; i < filter.length; i++) {
            filter[i].remove();
    }
})();