// ==UserScript==
// @name         学习强国确认登陆
// @namespace    https://penicillin.github.io/
// @version      0.2.1
// @description  监视确认键，并登陆。
// @author       Penicillinm
// @match        https://login.xuexi.cn/login2*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xuexi.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452847/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E7%A1%AE%E8%AE%A4%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/452847/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E7%A1%AE%E8%AE%A4%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

function autoLogin(){
    var startBtn=document.getElementsByClassName('ant-btn submit___25nSV ant-btn-primary ant-btn-lg')[0];
    if (startBtn != undefined){
        startBtn.click();
    }
}

setInterval(autoLogin,1000);