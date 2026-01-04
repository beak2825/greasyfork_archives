// ==UserScript==
// @name         自动填写重庆大学研究生管理系统验证码
// @namespace    none
// @version      0.2
// @description  登录重庆大学研究生管理系统的时可以自动填写验证码
// @author       Asafield
// @match      *://mis.cqu.edu.cn/mis/
// @license        GPL version 3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452277/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E7%A0%94%E7%A9%B6%E7%94%9F%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/452277/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E7%A0%94%E7%A9%B6%E7%94%9F%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

setInterval(function(){
    if(document.readyState == 'complete'){
        // 页面加载完毕
        document.getElementById("checkNum").value = document.getElementById("checkCode").innerHTML
    }
},500);