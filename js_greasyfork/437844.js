// ==UserScript==
// @name         Quicker 用户主页改数据
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  安装后，可以自己改源代码
// @author       You
// @match        https://getquicker.net/Member/Home
// @icon         https://www.google.com/s2/favicons?domain=getquicker.net
// @grant        none
// @license      Mit
// @downloadURL https://update.greasyfork.org/scripts/437844/Quicker%20%E7%94%A8%E6%88%B7%E4%B8%BB%E9%A1%B5%E6%94%B9%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/437844/Quicker%20%E7%94%A8%E6%88%B7%E4%B8%BB%E9%A1%B5%E6%94%B9%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function () {
    var table_body = document.querySelector("body > div.body-wrapper > div.container.mb-5.main > div.row > div.col-12.col-md-8 > table > tbody");
    //邮箱
    table_body.querySelector("tr:nth-child(1) > td > div > div:nth-child(1) > span").innerHTML = "123456@quicker.com"
    //推荐码
    table_body.querySelector("tr:nth-child(8) > td > div > span").innerHTML = "114514-1919";
    //会员到期时间
    table_body.querySelector("tr:nth-child(6) > td > span").innerHTML = "2211-11-11";
    //注册时间
    table_body.querySelector("tr:nth-child(4) > td").innerHTML = "2021-11-11 11:11";
    //昵称
    table_body.querySelector("tr:nth-child(2) > td > div > div:nth-child(1)").innerHTML = "aaaaa";
    //Q豆
    var qd = table_body.querySelector("tr:nth-child(7) > td");
    var span = document.createElement("span");
    span.setAttribute("style", "font-size:30px");
    span.innerText = " ∞ ";
    qd.firstChild.remove();
    qd.insertBefore(span, qd.firstChild);
    // table_body.querySelector("tr:nth-child(7) > td").appendChild(new )
    // Your code here...
})();