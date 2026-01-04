// ==UserScript==
// @name         隐藏react新官网援助乌克兰信息
// @namespace    https://juejin.cn/user/2154698523020205
// @version    	 4.2.2
// @description	 隐藏react新官网援助乌克兰信息，
// @author     	 is_tao
// @license    	 MIT
// @match        https://react.dev/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=react.dev
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462302/%E9%9A%90%E8%97%8Freact%E6%96%B0%E5%AE%98%E7%BD%91%E6%8F%B4%E5%8A%A9%E4%B9%8C%E5%85%8B%E5%85%B0%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/462302/%E9%9A%90%E8%97%8Freact%E6%96%B0%E5%AE%98%E7%BD%91%E6%8F%B4%E5%8A%A9%E4%B9%8C%E5%85%8B%E5%85%B0%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let dom=document.querySelector('#__next');
    let wkl=dom.getElementsByTagName('div')[0];
    wkl.style.display='none';
})();
