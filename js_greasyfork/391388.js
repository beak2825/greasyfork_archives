
// ==UserScript==
// @name         标记微信公众号未访问的链接
// @namespace    https://github.com/kingphoenix2000/tampermonkey_scripts
// @supportURL   https://github.com/kingphoenix2000/tampermonkey_scripts
// @version      0.1.1
// @author       浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description  在微信公众号页面，标题处显示出当前页面一共有多少链接，其中你访问过的链接有多少，然后给页面中没有访问过的链接加一个红色边框。作者：浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @homepage     https://blog.csdn.net/kingwolf_javascript/
// @include      https://mp.weixin.qq.com/s*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/391388/%E6%A0%87%E8%AE%B0%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%9C%AA%E8%AE%BF%E9%97%AE%E7%9A%84%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/391388/%E6%A0%87%E8%AE%B0%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%9C%AA%E8%AE%BF%E9%97%AE%E7%9A%84%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(function () {
        let title = document.querySelector("#activity-name").innerText;
        document.title = title;
        document.__defineSetter__("title", function (e) { console.log(e); });
        let arr = JSON.parse(GM_getValue("VisitedLinks", "[]"));
        let href = location.href;
        if (arr.includes(href)) {
            document.querySelector("#js_name").innerText = "已阅读";
        }
        else {

            arr.push(href);
            GM_setValue("VisitedLinks", JSON.stringify(arr));
        }

        let links = document.querySelectorAll("#js_content a");
        //if(links.length==0){links=document.querySelectorAll("#js_content > h2 > a");}
        let num = 0;
        links = Array.from(links);
        links.forEach(function (a) {
            let href = a.href.replace("http://", "https://");
            if (href.startsWith("http") && !arr.includes(href)) {
                a.style.border = "1px solid red";
                num++;
            }
        });
        let str = title + ' 总共有 <span style="color:red;">' + links.length + '</span> 个链接,其中未访问 <span style="color:red;">' + num + "</span> 个";
        document.querySelector("#activity-name").innerHTML = str;
        let js_content = document.querySelector("#js_content");
        let input = document.createElement("input");
        input.type = "button";
        input.value = "删除链接红框";
        input.addEventListener("click", function (e) {
            links.forEach(function (a) {
                a.style.border = "none";
            });
        }, false);
        js_content.insertBefore(input, js_content.firstChild);
    }, 1000);
    // Your code here...
})();
