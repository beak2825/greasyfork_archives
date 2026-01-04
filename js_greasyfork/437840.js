// ==UserScript==
// @name         豫章师范学院自动评教
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点击评价按钮会自动提交，默认为全5.0分
// @author       EggFuckRice
// @match        *://jw.yuznu.edu.cn/jxkp/Stu_WSKP_pj.aspx?*
// @icon         https://www.google.com/s2/favicons?domain=yuznu.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437840/%E8%B1%AB%E7%AB%A0%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/437840/%E8%B1%AB%E7%AB%A0%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {

    // Your code here...
    var a = document.getElementsByClassName('B');
    for(var i=0; i<a.length; i++){a[i].firstChild.firstChild.click()};
    window.confirm = function(confirm_msg){return 1};
    go_12735();
})();