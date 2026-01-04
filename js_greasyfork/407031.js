// ==UserScript==
// @name         网页文字编辑
// @namespace    xuexizuoye.com
// @version      1.01
// @description  将网页一键开启可编辑按钮，选中即可把当前网页当作TXT随意删除修改，注意：仅在编辑完记得关闭，不然部分链接无法点击
// @author       huansheng
// @run-at       document-start
// @match        htt*://*/*
// @exclude        *www.52pojie.cn*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407031/%E7%BD%91%E9%A1%B5%E6%96%87%E5%AD%97%E7%BC%96%E8%BE%91.user.js
// @updateURL https://update.greasyfork.org/scripts/407031/%E7%BD%91%E9%A1%B5%E6%96%87%E5%AD%97%E7%BC%96%E8%BE%91.meta.js
// ==/UserScript==
window.changeCss = function changeCss(){
    console.log('当前按钮是否选中：' + document.querySelector("#checkBt").checked)
    document.body.contentEditable = document.querySelector("#checkBt").checked;
}
var styledom = document.createElement("style");
styledom.setAttribute("type", "text/css");
styledom.innerHTML = '.checkBt:hover{left:3px;}.checkBt{position:fixed;left:-42px;bottom:8vh;border:1px solid;border-radius:23%;background-color:#6cbd45;color:#fff;padding:5px;z-index:999;'
document.querySelector("head").appendChild(styledom);
document.body.innerHTML = document.body.innerHTML + '<div class="checkBt" onMouseOver="changeCss()"><label for="checkBt"><input type="checkbox" name="editable" id="checkBt">是否 编辑</label></div>'