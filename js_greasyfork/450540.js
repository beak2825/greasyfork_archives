// ==UserScript==
// @name        Don't waste time in treehole.
// @namespace   Dont-waste-time-in-treehole
// @description 当进入树洞时，自动跳转到pku.edu.cn.
// @version     1.0
// @match       *://pkuhelper.pku.edu.cn/
// 
// @author       Arthals
// @license      GPL-3.0 license
// @date         08/08/2022
// @downloadURL https://update.greasyfork.org/scripts/450540/Don%27t%20waste%20time%20in%20treehole.user.js
// @updateURL https://update.greasyfork.org/scripts/450540/Don%27t%20waste%20time%20in%20treehole.meta.js
// ==/UserScript==
(function(){
    let website = location.href;
    if(/^https*:\/\/pkuhelper.pku.edu.cn\/hole\/$/.test(website)){
        console.log("yes")
        window.location = "http://www.pku.edu.cn"
    }
})()