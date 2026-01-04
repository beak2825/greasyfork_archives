// ==UserScript==
// @name         pixiv登录页面图
// @namespace    https://www.pixiv.net/
// @version      1.1
// @description  pixiv
// @author       nangongxiaoxin
// @match        https://www.pixiv.net/
// @grant        unsafeWindow
// @license      MIT
// @match        https://www.pixiv.net/
// @downloadURL https://update.greasyfork.org/scripts/447173/pixiv%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/447173/pixiv%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2%E5%9B%BE.meta.js
// ==/UserScript==
window.onload=function(){
    let search_bar=document.getElementById("search-bar");
    let footer=document.getElementById("footer");
    let signup_form=document.getElementsByClassName("signup-form");

    search_bar.style.display="none";
    footer.style.display="none";
    signup_form[0].style.display="none";
}