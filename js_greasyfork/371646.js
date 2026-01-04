// ==UserScript==
// @name         自动刷新编辑保存页面
// @namespace    none
// @version      0.2
// @description  每隔一段时间自动刷新页面，可自定义刷新间隔时间，自用与编辑和保存
// @author       HY清风
// @match        http://newvideos.youku.com/u/videos/setbullet/id*
// @match        http://newvideos.youku.com/u/videos/save
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371646/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E7%BC%96%E8%BE%91%E4%BF%9D%E5%AD%98%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/371646/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E7%BC%96%E8%BE%91%E4%BF%9D%E5%AD%98%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(()=>{
    location.reload();
},5000)
    // 时间设置5秒
})();