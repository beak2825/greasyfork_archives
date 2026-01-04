// ==UserScript==
// @name         专业技术人员继续教育网站不停止插件
// @namespace    http://web.chinahrt.com and so on
// @version      0.2
// @description  不停止插件(不保证所有网址，请自行尝试)
// @author       jeaven
// @match        http://*/*
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chinahrt.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447406/%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E7%AB%99%E4%B8%8D%E5%81%9C%E6%AD%A2%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/447406/%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E7%AB%99%E4%B8%8D%E5%81%9C%E6%AD%A2%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onfocus = function(){console.log('on focus')};
    window.onblur = function(){console.log('on blur')};
})();