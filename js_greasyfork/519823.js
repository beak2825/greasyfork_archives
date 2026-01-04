// ==UserScript==
// @name         评价页面自动填写
// @namespace    http://tampermonkey.net/
// @version      2024-08-03
// @description  jd评价页面自动填写
// @author       You
// @match        https://club.jd.com/myJdcomments/orderVoucher.action?ruleid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519823/%E8%AF%84%E4%BB%B7%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/519823/%E8%AF%84%E4%BB%B7%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        $(".star5").attr("class","star star5 active")
        $(".f-textarea>textarea").text("性价比非常高，充电非常快，质量也很好，结实耐用，做工很好。")
        $(".btn-submit:eq(0)").trigger("click")
    },10000)
    // Your code here...
})();