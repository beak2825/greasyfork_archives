// ==UserScript==
// @name         陕西师范大学-vip版本
// @namespace    www.111.com/
// @version      1.0
// @description  陕西师范大学继续教育-vip版本
// @author       666
// @match        *://*.oucnet.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402999/%E9%99%95%E8%A5%BF%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6-vip%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/402999/%E9%99%95%E8%A5%BF%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6-vip%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
  setInterval(function(){
				if($('p.success').length){$('#btn_next').click()}
				},3000)
})();