// ==UserScript==
// @name         CSDN去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  清除csdn广告
// @author       man Wang
// @match        https://www.csdn.net/*
// @match        https://blog.csdn.net/*
// @icon         https://img-home.csdnimg.cn/images/20211108111828.gif
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.js
// @license      LGPL
// @downloadURL https://update.greasyfork.org/scripts/435521/CSDN%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/435521/CSDN%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
      $(".toolbar-advert").empty()
      $(".use strict").empty()
      $(".csdn-common-logo-advert").empty()
      $("#footerRightAds").empty()
    }, 500)
})();