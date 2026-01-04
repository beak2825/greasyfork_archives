// ==UserScript==
// @name         小助手查询视觉优化
// @license      AGPL License
// @namespace    https://penicillin.github.io/
// @version      0.2.13
// @description  清理网页版面，添加快捷键方便用户操作!
// @author       静夜轻风
// @match        https://www.tiaozhandati.club/
// @downloadURL https://update.greasyfork.org/scripts/389397/%E5%B0%8F%E5%8A%A9%E6%89%8B%E6%9F%A5%E8%AF%A2%E8%A7%86%E8%A7%89%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/389397/%E5%B0%8F%E5%8A%A9%E6%89%8B%E6%9F%A5%E8%AF%A2%E8%A7%86%E8%A7%89%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

document.styleSheets[0].addRule('strong','padding:0px 20px;')
document.styleSheets[0].addRule('strong','background-color:yellow;color:red;')

var s=document.getElementsByClassName('search')[0];
var r=document.getElementsByClassName('result')[0];
document.body.style.textAlign='center';
document.body.innerHTML=''
document.body.appendChild(s);
document.body.appendChild(r);

var keyword=document.getElementsByTagName('Input')[0];
keyword.placeholder="输入关键字,按回车搜索,按Ctrl清空内容并聚焦。";
keyword.style.paddingLeft="10px";

document.onkeydown=function(event){
var key = event || window.event || arguments.callee.caller.arguments[0];
if(key && key.keyCode==17){ // 按 ctrl
keyword.click();
}
}
keyword.focus();