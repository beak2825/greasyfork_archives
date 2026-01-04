// ==UserScript==
// @name         MomoYu网站样式优化（增加摸鱼友好性）
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  修改样式，个人偏好内容栏靠右，适合不适宜目光总是左撇到电脑最左边的打工人
// @author       You
// @match        https://momoyu.cc/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=momoyu.cc
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/462316/MomoYu%E7%BD%91%E7%AB%99%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96%EF%BC%88%E5%A2%9E%E5%8A%A0%E6%91%B8%E9%B1%BC%E5%8F%8B%E5%A5%BD%E6%80%A7%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/462316/MomoYu%E7%BD%91%E7%AB%99%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96%EF%BC%88%E5%A2%9E%E5%8A%A0%E6%91%B8%E9%B1%BC%E5%8F%8B%E5%A5%BD%E6%80%A7%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector(".my-content").style.flexDirection="row-reverse"
    document.querySelector(".side").style.marginLeft = "25px"
    let content = document.querySelector(".content")
    content.style.marginLeft = "-25px"
    content.style.marginRight = "15px"
    // Your code here...
})();