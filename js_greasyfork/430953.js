// ==UserScript==
// @name         135模板？拿来吧你！
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  本插件可以让普通用户在135编辑器主页使用vip模板
// @description  2021年12月3日
// @description  2023年06月16日
// @author       greedy
// @match        https://www.135editor.com/beautify_editor.html
// @icon         https://www.135editor.com/img/vip/vip.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/430953/135%E6%A8%A1%E6%9D%BF%EF%BC%9F%E6%8B%BF%E6%9D%A5%E5%90%A7%E4%BD%A0%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/430953/135%E6%A8%A1%E6%9D%BF%EF%BC%9F%E6%8B%BF%E6%9D%A5%E5%90%A7%E4%BD%A0%EF%BC%81.meta.js
// ==/UserScript==


setInterval(function(){
    let lis = document.getElementById('editor-template-scroll').getElementsByTagName('li');
    for (let i=0,len=lis.length; i<len; i++) {
        lis[i].classList.remove('vip-style');
    }
} ,"1000");

(function() {
    window.style_click = window.show_role_vip_dialog = function(){};
    publishController.open_dialog = {};
})();