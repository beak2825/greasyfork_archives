// ==UserScript==
// @name         夜间模式_阿亮
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  由于是临时写的简易统配版，可能会因为颜色设置不均匀导致页面风格不协调或不兼容无效的问题（后期修改），默认所有网站都启用，如想DIY可在下行添加例如 // @include  /^https://example\.com/ 或修改 @match 来设置特定域名启用并根据F12检测特定的标签随意设置想要的样式
// @author       阿亮
// @match        http*://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451537/%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F_%E9%98%BF%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/451537/%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F_%E9%98%BF%E4%BA%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let hour = new Date().getHours();
    let openNight = 18; //可根据时间自动设置开启：通过修改openNight控制几点开启，全天开启修改为0
    if (hour >= openNight) {
        //百度 canvasapi官网
        var d1 = document.querySelector("#wrapper")
        if (d1) d1.style.backgroundColor = "#7e8f8f"
        var d2 = document.querySelector("#head")
        if (d2) d2.style.backgroundColor = "#7e8f8f"
        var d3 = document.querySelector(".container")
        if (d3) d3.style.backgroundColor = "#333"
        var d4 = document.querySelector(".header-title")
        if (d4) d4.style.backgroundColor = "#333"
        var d5 = document.querySelector(".header")
        if (d5) d5.style.backgroundColor = "#333"
        var d6 = document.querySelector(".jsTips")
        if (d6) d6.style.display = "none"

        //b站
        var d7 = document.querySelector("#app")
        if (d7) d7.style.backgroundColor = "#333"
        var d8 = document.querySelector("#i_cecream")
        if (d8) d8.style.backgroundColor = "#333"

        document.body.style.color = "#ccc"
        document.body.style.backgroundColor = "#333"

        //代码块
        var doms1 = document.querySelectorAll("pre")
        if (doms1) {
            doms1.forEach(item => {
                item.style.color = "#333"
            })
        }
        var doms2 = document.querySelectorAll("code")
        if (doms2) {
            doms2.forEach(item => {
                item.style.color = "#2486ff"
            })
        }
        var doms3 = document.querySelectorAll(".vh canvas")
        if (doms3) {
            doms3.forEach(item => {
                item.style.backgroundColor = "#fff"
            })
        }
    }
})();

