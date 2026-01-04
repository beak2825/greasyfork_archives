// ==UserScript==
// @name         Redmine工时统计
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  方便统计redmine工时
// @author       You
// @match        http://192.168.6.8:33988/workreports*
// @match        http://redmine-pa.mxnavi.com/workreports*
// @icon         https://www.google.com/s2/favicons?domain=6.8
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437834/Redmine%E5%B7%A5%E6%97%B6%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/437834/Redmine%E5%B7%A5%E6%97%B6%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    function showWorkTime() {
        var workTimeArray = Array();

        document.querySelector("#workreport-table").querySelectorAll("tr").forEach((element, index) => {
              if(element.children[0].hasAttribute("rowspan")){
                  workTimeArray.push(parseFloat(element.children[7].innerHTML));
              }
        });
        var allTime = parseFloat(workTimeArray.reduce((a, b) => a + b, 0)).toFixed(2);
        alert("当前页面的工作量统计："+allTime);
    }

    var button = document.createElement("button");
    button.innerHTML = "统计当前工时";
    button.style.position = "fixed";
    button.style.top = "100px";
    button.style.right = "100px";
    button.onclick = showWorkTime;
    document.body.appendChild(button);
})();