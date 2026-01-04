// ==UserScript==
// @name         4禁止弹窗
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  屏蔽网站弹窗
// @author       You
// @license      MIT
// @match        *://*/*
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/458153/4%E7%A6%81%E6%AD%A2%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/458153/4%E7%A6%81%E6%AD%A2%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
GM_addStyle(".popup,.popupShow{display:none!important}");
  var box = document.getElementById('popup')
  box.style.width = "0px"
  box.style.height = "0px"
box.style.display="none"
window.onload = function(){
    function  alert(str){}
}