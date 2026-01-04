// ==UserScript==
// @name         阿里小站
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  阿里小站免回复获取链接
// @author       Lesia
// @match         *://wpxz.org/*/*
// @icon         https://wpxz.org/assets/logo-qrom5keh.png
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/444738/%E9%98%BF%E9%87%8C%E5%B0%8F%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/444738/%E9%98%BF%E9%87%8C%E5%B0%8F%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var d = document.getElementsByTagName("script")[0];
    //console.log(d.innerText)

    var j = JSON.parse(d.innerText)
    // console.log(j[0].mainEntity.text)



    //新建一个div元素节点
    var div=document.createElement("div");
    div.innerHTML = j[0].mainEntity.text
    div.className ="container"



    var c = document.getElementsByClassName("DiscussionPage-discussion")[0]
    // console.log("ccc", c)
    // console.log(c.children[0])
    //console.log(c.childNodes)
    //console.log(c.firstChild)




    //插入到最前面
   c.insertBefore(div, c.children[1]);

    // Your code here...
})();