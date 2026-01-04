// ==UserScript==
// @name         教师研修网免十分钟点击继续计时
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  中国教师研修网十分钟自动单击继续计时
// @author       断点李
// @match        *://i.yanxiu.com/uft/course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33960/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%BD%91%E5%85%8D%E5%8D%81%E5%88%86%E9%92%9F%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E8%AE%A1%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/33960/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%BD%91%E5%85%8D%E5%8D%81%E5%88%86%E9%92%9F%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E8%AE%A1%E6%97%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //code here...
    var limingClick=setInterval(function(){
    document.querySelector(".clock-tip p").click();
},60*1000*10);
})();