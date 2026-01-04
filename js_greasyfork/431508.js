// ==UserScript==
// @name         古诗文网优化
// @namespace    https://github.com/isPoto
// @version      0.5
// @description  屏蔽登录弹窗，自动展开译文
// @author       Poto
// @match        https://so.gushiwen.cn/*
// @icon         https://www.google.com/s2/favicons?domain=https://so.gushiwen.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431508/%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/431508/%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //hide locin pop-up
var object = document.getElementById('hide-center2');
if (object != null){
    object.parentNode.removeChild(object);
}

//Automatic expansion of the translation
document.querySelector("a[id]");
$("a:contains(原文)")[0].click();

//let trans = document.getElementById("rightbtn46653FD803893E4F3FDDB0646B3C6684");
//trans.click();
//$("#rightbtn46653FD803893E4F3FDDB0646B3C6684").click();
    // Your code here...
})();