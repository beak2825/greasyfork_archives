// ==UserScript==
// @name         粘贴搜索功能
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Xslist.org 粘贴搜索
// @author       _mogu
// @match        https://xslist.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xslist.org
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/447238/%E7%B2%98%E8%B4%B4%E6%90%9C%E7%B4%A2%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/447238/%E7%B2%98%E8%B4%B4%E6%90%9C%E7%B4%A2%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.addEventListener('paste', function( e ) {
    unsafeWindow.$('body').addClass('function-activating');
    unsafeWindow.picSearch( e.clipboardData );
  }, false);
})();