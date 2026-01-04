// ==UserScript==
// @name         跳过从QQ打开 提示非官方链接
// @namespace    https://space.bilibili.com/52159566
// @version      0.1
// @description  从QQ打开链接提示非官方，直接转跳
// @author       苏芣苡
// @match        *://c.pc.qq.com/*
// @icon         https://q.qlogo.cn/g?b=qq&s=100&nk=318328258
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431908/%E8%B7%B3%E8%BF%87%E4%BB%8EQQ%E6%89%93%E5%BC%80%20%E6%8F%90%E7%A4%BA%E9%9D%9E%E5%AE%98%E6%96%B9%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/431908/%E8%B7%B3%E8%BF%87%E4%BB%8EQQ%E6%89%93%E5%BC%80%20%E6%8F%90%E7%A4%BA%E9%9D%9E%E5%AE%98%E6%96%B9%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    var string = document.getElementById("url").innerHTML;
    var location = string.indexOf(">")+1;
    var len = string.length;
    var url = string.substring(location,len);
    window.location.href = url;
})();