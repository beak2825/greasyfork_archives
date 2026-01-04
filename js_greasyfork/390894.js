// ==UserScript==
// @name         网易邮箱净化-首页
// @namespace    https://greasyfork.org/users/158180
// @version      0.2
// @description  净化网易系邮箱首页
// @author       Shiyunjin
// @match        http*://mail.163.com/js6/main.jsp*
// @match        http*://mail.126.com/js6/main.jsp*
// @match        http*://mail.yeah.net/js6/main.jsp*
// @match        http*://hw.mail.163.com/js6/main.jsp*
// @match        http*://hw.mail.126.com/js6/main.jsp*
// @match        http*://hw.mail.yeah.net/js6/main.jsp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390894/%E7%BD%91%E6%98%93%E9%82%AE%E7%AE%B1%E5%87%80%E5%8C%96-%E9%A6%96%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/390894/%E7%BD%91%E6%98%93%E9%82%AE%E7%AE%B1%E5%87%80%E5%8C%96-%E9%A6%96%E9%A1%B5.meta.js
// ==/UserScript==

var $S = function(a, b) {
    Session.set("isFree",false);
    Session.set("isVip", true);
    Session.set("ad",{show: false, showClose: false, userType: "ud"});
    if (2 == arguments.length) return Session.set(a, b);
    var c = Session.get(a);
    return c
}

(function() {
    'use strict';

    // Your code here...
})();
