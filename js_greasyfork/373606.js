// ==UserScript==
// @name         去掉php中文网广告图标
// @namespace
// @version      0.2
// @description  去掉广告图标
// @author       e
// @include      /^http(s?)://www.php.cn/(.*)$/
// @grant        unsafeWindow
// @run-at       document-end
// @namespace https://greasyfork.org/users/221396
// @downloadURL https://update.greasyfork.org/scripts/373606/%E5%8E%BB%E6%8E%89php%E4%B8%AD%E6%96%87%E7%BD%91%E5%B9%BF%E5%91%8A%E5%9B%BE%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/373606/%E5%8E%BB%E6%8E%89php%E4%B8%AD%E6%96%87%E7%BD%91%E5%B9%BF%E5%91%8A%E5%9B%BE%E6%A0%87.meta.js
// ==/UserScript==
//

(function () {
    'use strict';
    
   setTimeout(function () {
     $(".close_id").hide();
     layer.closeAll();
   }, 150);
})();