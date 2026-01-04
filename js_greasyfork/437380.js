// ==UserScript==
// @name         电子科技大学校园邮箱自动登录
// @namespace    https://huguoyang.cn
// @version      1.0
// @license      MIT
// @description  自动登录电子科技大学校园邮箱
// @author       ambition_echo
// @match        http://mail.std.uestc.edu.cn/
// @icon         https://www.google.com/s2/favicons?domain=mail.std.uestc.edu.cn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437380/%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/437380/%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    var usrname="your username";
    var passwd="your password";

    var flag=0;
    setInterval(f, 1000);
    if(flag==1){
        return;
    }
    function f(){
        if(document.querySelector("#uid")!=null){
            document.querySelector("#uid.u-input").value=usrname;
            document.querySelector("#fakePassword.u-input").value=passwd;
            document.querySelector(".u-btn.u-btn-primary.submit.j-submit").click();
            flag=1;
        }
    }

})();