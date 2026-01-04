// ==UserScript==
// @name         bwiki一键勾选重复文件确认框
// @namespace    https://wiki.biligame.com/blhx/%E7%94%A8%E6%88%B7:1541127
// @version      0.1
// @description  在文件上传位置增加一个按钮，点击后一键勾选重复文件确认
// @author       Flandre Cirno
// @match        https://wiki.biligame.com/blhx/index.php*action=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448983/bwiki%E4%B8%80%E9%94%AE%E5%8B%BE%E9%80%89%E9%87%8D%E5%A4%8D%E6%96%87%E4%BB%B6%E7%A1%AE%E8%AE%A4%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/448983/bwiki%E4%B8%80%E9%94%AE%E5%8B%BE%E9%80%89%E9%87%8D%E5%A4%8D%E6%96%87%E4%BB%B6%E7%A1%AE%E8%AE%A4%E6%A1%86.meta.js
// ==/UserScript==

function clickAllFileWarning() {
   $(".file-warning input").click();
}

function clickAllInit() {
    var clickAllButton = document.createElement('div');
    clickAllButton.onclick = clickAllFileWarning;
    clickAllButton.style['text-align'] = "center";
    clickAllButton.style['cursor'] = "pointer";
    clickAllButton.innerText = "勾选确认重复文件";
    document.getElementById("msupload-div").before(clickAllButton);
}

if (document.readyState == 'loading') {
	document.addEventListener('DOMContentLoaded', clickAllInit);
} else {
    setTimeout(clickAllInit, 2500);
}