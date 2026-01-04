// ==UserScript==
// @name         JDY_hide_navigation
// @namespace    http://www.liftnova-cranes.com/
// @version      0.1
// @description  使简道云仪表盘上方的导航栏隐藏
// @author       Bruce
// @match        https://rut8nwds2o.jiandaoyun.com/dash/*
// @icon         https://www.google.com/s2/favicons?domain=jiandaoyun.com
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/470792/JDY_hide_navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/470792/JDY_hide_navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var web_height = 1080; //页面高度，默认1080P的高度
    var delay_time = 5000; //单位毫秒，根据原本页面载入用时判断
setTimeout(function(){
//css start
    let css = `
.fx-dashboard-entry-view.dash-theme-dark .dashboard-navigation {
display:none;/*顶部导航栏隐藏*/
}
    `
    GM_addStyle(css);
//css end

} , delay_time)
    // Your code here...
})();