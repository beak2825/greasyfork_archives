// ==UserScript==
// @name         解除网页复制粘贴右键限制
// @namespace    zhaocrx
// @version      1.0
// @description  解除普通网页js限制复制，粘贴，右键
// @author       老码
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

   function done(){
 // Your code here...
    // 禁止右键菜单
document.oncontextmenu = function(){ return true; };
// 禁止文字选择
document.onselectstart = function(){ return true; };
// 禁止复制
document.oncopy = function(){ return true; };
// 禁止剪切
document.oncut = function(){ return true; };
// 禁止粘贴
document.onpaste = function(){ return true; };
}done();
})();