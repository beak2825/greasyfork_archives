// ==UserScript==
// @name         SDU教学评价
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       u小鬼
// @match        https://bkzhjx.wh.sdu.edu.cn/jsxsd/xspj/xspj_edit.do?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446962/SDU%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/446962/SDU%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

// 12.24 update：修改匹配关键词
// 可以看到jsp文件，是不是可以直接操纵文件？

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

    var Options = document.getElementsByClassName("radio radio-xs");

    console.log(Options.length);
    for (var j = 0; j < Options.length; j++) {
        console.log(Options[j]);
        console.log(Options[j].innerText);
        if (Options[j].innerText == "很好(5) " || Options[j].innerText == "课程难度适中,经过努力可以取得较好成绩"
            || Options[j].innerText == "推荐") {
            Options[j].click();
        }
    }

    // console.log(document.getElementById("jynr_4F30205F0BD9418EA3A944D7DB8CD3A4"));
    // document.getElementById("jynr_4F30205F0BD9418EA3A944D7DB8CD3A4").value = "老师人很nice，课程讲授循序渐进，学到了很多东西！";
    console.log(document.getElementsByName("jynr")[0]);
    document.getElementsByName("jynr")[0].value = "老师人很nice，课程讲授循序渐进，学到了很多东西！";

    var btn = document.getElementById("tj");
    btn.click();

    // window.confirm = function(x) { console.log(x); return true; };

    // Your code here...
})();