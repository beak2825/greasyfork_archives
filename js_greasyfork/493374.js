// ==UserScript==
// @name         SDU教学评价
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  用于省点等通知大学的事
// @author       u小鬼
// @match        https://bkzhjx.wh.sdu.edu.cn/jsxsd/xspj/xspj_edit.do?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493374/SDU%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/493374/SDU%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*var Comments = document.getElementsByTagName('a');

    for (var i = 0; i < Comments.length; i++) {
        console.info(Comments[i].getAttribute("href"));
    }

    var r = confirm("是否一键好评？");
    if (r == true) {
        console.log("OK，Start！");
        for (i = 0; i < Comments.length; i++) {
            Comments[i].click();
        }
        // Comments[0].click();

    }*/
    // var Alert = function() { return 1; };
    // var Confirm = function() { return 1; };
    // var Prompt = function() { return 1; };



    console.log(document.getElementsByName("pj06fz4")[0]);
    document.getElementsByName("pj06fz4")[0].value = "5";

    console.log(document.getElementsByName("pj06fz5")[0]);
    document.getElementsByName("pj06fz5")[0].value = "5";

    console.log(document.getElementsByName("pj06fz6")[0]);
    document.getElementsByName("pj06fz6")[0].value = "5";

    console.log(document.getElementsByName("pj06fz7")[0]);
    document.getElementsByName("pj06fz7")[0].value = "5";

    console.log(document.getElementsByName("pj06fz8")[0]);
    document.getElementsByName("pj06fz8")[0].value = "5";

    console.log(document.getElementsByName("pj06fz9")[0]);
    document.getElementsByName("pj06fz9")[0].value = "5";

    console.log(document.getElementsByName("pj06fz10")[0]);
    document.getElementsByName("pj06fz10")[0].value = "5";

    console.log(document.getElementsByName("pj06fz11")[0]);
    document.getElementsByName("pj06fz11")[0].value = "5";

    console.log(document.getElementsByName("pj06fz12")[0]);
    document.getElementsByName("pj06fz12")[0].value = "5";

    console.log(document.getElementsByName("pj06fz13")[0]);
    document.getElementsByName("pj06fz13")[0].value = "5";

    console.log(document.getElementsByName("pj06fz14")[0]);
    document.getElementsByName("pj06fz14")[0].value = "5";

    console.log(document.getElementsByName("pj06fz15")[0]);
    document.getElementsByName("pj06fz15")[0].value = "5";

    console.log(document.getElementsByName("pj06fz16")[0]);
    document.getElementsByName("pj06fz16")[0].value = "5";

    console.log(document.getElementsByName("pj06fz17")[0]);
    document.getElementsByName("pj06fz17")[0].value = "5";

    console.log(document.getElementsByName("pj06fz18")[0]);
    document.getElementsByName("pj06fz18")[0].value = "5";

    console.log(document.getElementsByName("pj06fz19")[0]);
    document.getElementsByName("pj06fz19")[0].value = "5";

    console.log(document.getElementsByName("pj06fz20")[0]);
    document.getElementsByName("pj06fz20")[0].value = "5";

    console.log(document.getElementsByName("pj06fz3")[0]);
    document.getElementsByName("pj06fz3")[0].value = "5";

    console.log(document.getElementsByName("pj06fz2")[0]);
    document.getElementsByName("pj06fz2")[0].value = "5";

    console.log(document.getElementsByName("pj06fz21")[0]);
    document.getElementsByName("pj06fz21")[0].value = "5";


    // console.log(document.getElementById("jynr_4F30205F0BD9418EA3A944D7DB8CD3A4"));
    // document.getElementById("jynr_4F30205F0BD9418EA3A944D7DB8CD3A4").value = "老师人很nice，课程讲授循序渐进，学到了很多东西！";
    console.log(document.getElementsByName("jynr")[0]);
    document.getElementsByName("jynr")[0].value = "老师人很nice，课程讲授循序渐进，学到了很多东西！";

    var btn = document.getElementById("tj");
    btn.click();

    // window.confirm = function(x) { console.log(x); return true; };

    // Your code here...
})();