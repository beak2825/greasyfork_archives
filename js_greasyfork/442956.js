// ==UserScript==
// @name         匿名-自动登录
// @namespace    https://game.nimingxx.com/
// @version      0.1.4
// @description  匿名修仙
// @author       You
// @match        https://game.nimingxx.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442956/%E5%8C%BF%E5%90%8D-%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/442956/%E5%8C%BF%E5%90%8D-%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

var href = window.location.href;
if( href == "https://game.nimingxx.com/login"){
    document.querySelector("button.el-button.register-btn.el-button--default").click();
}else {
    setTimeout(init,1000);
}
if(document.getElementsByClassName("el-notification__content")[0].innerText.indexOf("掉线")!= -1){
    location.reload();
    
}else {
    setTimeout(init,1000);
}

