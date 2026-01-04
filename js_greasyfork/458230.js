// ==UserScript==
// @name         闽江学院教务系统允许浏览器自动填写账密
// @namespace    http://shenhaisu.cc/
// @version      1.0
// @description  删除掩人耳目的输入框，替换为可以自动填写的输入框
// @author       ShenHaiSu_KimSama
// @match        http://183.250.189.53/jwglxt/xtgl/login_slogin.html
// @match        http://jwgl.mju.edu.cn/jwglxt/xtgl/login_slogin.html
// @match        http://183.250.189.53/jwglxt/xtgl/login_slogin.html?time=*
// @match        http://jwgl.mju.edu.cn/jwglxt/xtgl/login_slogin.html?time=*
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/458230/%E9%97%BD%E6%B1%9F%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%85%81%E8%AE%B8%E6%B5%8F%E8%A7%88%E5%99%A8%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%B4%A6%E5%AF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/458230/%E9%97%BD%E6%B1%9F%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%85%81%E8%AE%B8%E6%B5%8F%E8%A7%88%E5%99%A8%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%B4%A6%E5%AF%86.meta.js
// ==/UserScript==

(function () {
    let yhmInput = document.querySelector("input#yhm");
    let mmInput = document.querySelector("input#mm");
    let loginButton = document.querySelector("#dl");
    mmInput.setAttribute("name","password");
    mmInput.setAttribute("type","password");
    console.log("替换完毕");
})();