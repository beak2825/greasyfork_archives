// ==UserScript==
// @name         ThE 5eCreT T0o1
// @namespace    http://tampermonkey.net/
// @version      V1.1
// @description  very cool tool
// @author       HX_2017
// @match        http://59.126.204.20/
// @license      GNU  GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501347/ThE%205eCreT%20T0o1.user.js
// @updateURL https://update.greasyfork.org/scripts/501347/ThE%205eCreT%20T0o1.meta.js
// ==/UserScript==

(function() {
document.onkeydown=keyFunction;
})();

function keyFunction(){
    document.addEventListener('keydown',(e)=>{    //(shift+T)
    if(e.shiftKey&&e.keyCode===84){
    let usercode = Number(window.prompt('輸入資料夾代碼(不含前面的0)，若一直卡在輸入沒有跳轉，請將網頁關閉重新開啟或重新整理'));
    window.alert('資料值已修改，準備自動跳轉');
    let cookie1 = "http%3A%2F%2F59.126.204.20%2Fline%2Fuser";
    let cookie2 = "%2Findex.html";
    let cookie = cookie1+usercode;
        cookie += cookie2;
    document.cookie = "thisUserPage="+cookie+";path=/";
    window.location.href = "http://59.126.204.20/line/user"+usercode+"/index.html";
    }
    })
}