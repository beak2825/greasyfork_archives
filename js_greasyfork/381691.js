// ==UserScript==
// @name         去掉实验楼广告
// @namespace
// @version      0.1
// @description  去掉广告
// @author       e
// @include      /^http(s?)://www.shiyanlou.com/(.*)$/
// @grant        unsafeWindow
// @run-at       document-end
// @namespace https://greasyfork.org/users/221396
// @downloadURL https://update.greasyfork.org/scripts/381691/%E5%8E%BB%E6%8E%89%E5%AE%9E%E9%AA%8C%E6%A5%BC%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/381691/%E5%8E%BB%E6%8E%89%E5%AE%9E%E9%AA%8C%E6%A5%BC%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
//

(function () {
    'use strict';

   setTimeout(function () {
     $(".louplus-top-banner").hide();
   }, 150);
})();