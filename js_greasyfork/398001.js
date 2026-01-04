// ==UserScript==
// @name        Amazon mock login
// @name:zh-CN  懒人专用，亚马自动登录，长期更新，放心使用。
// @namespace   https://github.com/jubull/Tampermonkey
// @version     0.0.1
// @description Used to simulate login to amazon welcome to use
// @description:zh-CN 用于模拟登录亚马逊欢迎使用
// @author      LiuYun
// @include     https://sellercentral.amazon.com*
// @match       https://sellercentral.amazon.com
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/398001/Amazon%20mock%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/398001/Amazon%20mock%20login.meta.js
// ==/UserScript==
(function ($) {
    'use strict';
    function inputValue(dom, val) {
    var evt = new InputEvent('input', {
       'inputType'    : 'insertText',
          'data'         : val,
          'dataTransfer' : null,
          'isComposing'  : false
       });
       $(dom).val(val).get(0).dispatchEvent(evt);
    }
    inputValue('#ap_email', 'XXXXXXXXXXX');
    inputValue('#ap_password', 'XXXXXXXXXXX');
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('click', true, true);
    document.getElementById('signInSubmit').dispatchEvent(clickEvent);
})(jQuery);