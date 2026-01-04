// ==UserScript==
// @name         禁止 JavaScript alert 弹出 菜单 页面
// @version      1.0.1
// @description  禁止浏览器 页面 弹窗,在火狐和chrome的tampermonkey上测试通过
// @author       ok！
// @namespace    https://greasyfork.org/zh-CN/scripts/390771-%E7%A6%81%E6%AD%A2-javascript-alert-%E5%BC%B9%E5%87%BA-%E8%8F%9C%E5%8D%95-%E9%A1%B5%E9%9D%A2
// @match        http*://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390771/%E7%A6%81%E6%AD%A2%20JavaScript%20alert%20%E5%BC%B9%E5%87%BA%20%E8%8F%9C%E5%8D%95%20%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/390771/%E7%A6%81%E6%AD%A2%20JavaScript%20alert%20%E5%BC%B9%E5%87%BA%20%E8%8F%9C%E5%8D%95%20%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==



(function() {
window.alert=function(){};
})();