// ==UserScript==
// @name         查看页面的标题和描述
// @namespace    http://tampermonkey.net/
// @version      20211015104403
// @description  获取任意网站的标题、描述以及当前页面的链接，内容会显示在console中，按F12-》控制台（或者右键页面任意位置，选择检查-》控制台）即可打开查看
// @author       You
// @match        http://*/*
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?domain=gitee.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433944/%E6%9F%A5%E7%9C%8B%E9%A1%B5%E9%9D%A2%E7%9A%84%E6%A0%87%E9%A2%98%E5%92%8C%E6%8F%8F%E8%BF%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/433944/%E6%9F%A5%E7%9C%8B%E9%A1%B5%E9%9D%A2%E7%9A%84%E6%A0%87%E9%A2%98%E5%92%8C%E6%8F%8F%E8%BF%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let timer = setTimeout(() => {

        clearTimeout(timer);
        timer = null;
        let title = document.title;
        console.log(title);
        let metaArr = document.head.querySelectorAll("meta");
        if (metaArr.length > 0) {
            metaArr.forEach((res) => {
                if (res.name.toLocaleLowerCase() === "description") {
                    console.info(res.content);
                }else if(res.getAttribute("property") === 'description'){
                    console.info(res.content);
                }
            });
        }
        let href = location.href
        console.log(href)
    }, 2000);
})();