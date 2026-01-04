// ==UserScript==
// @name         有道自动重命名
// @namespace    http://note.youdao.com/
// @version      0.8
// @description  自动把打开的有道笔记分享页面重命名
// @author       Ts8zs
// @match        https://note.youdao.com/ynoteshare1/index.html?id=*
// @downloadURL https://update.greasyfork.org/scripts/423526/%E6%9C%89%E9%81%93%E8%87%AA%E5%8A%A8%E9%87%8D%E5%91%BD%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/423526/%E6%9C%89%E9%81%93%E8%87%AA%E5%8A%A8%E9%87%8D%E5%91%BD%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(()=>{
        var text = "";
        if(document.querySelector('.file-name')){
            text = document.querySelector('.file-name').textContent;
        }
        if(document.querySelector('.file-name-coEdit')){
            text = document.querySelector('.file-name-coEdit').textContent;
        }
        document.title=text+' - 有道云笔记'},1000)
})();