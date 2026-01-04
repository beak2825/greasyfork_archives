// ==UserScript==
// @name         keymailer辅助
// @namespace    龟龟
// @version      0.1
// @description  keymailer增加一个跳转到steam商店页面的按钮
// @author       兰屿绿蠵龟
// @match        https://www.keymailer.co/g/games/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/411550/keymailer%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/411550/keymailer%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
anniu();
anniu1();
var appid = document.getElementsByClassName("orbit-figure")[0].children[0].currentSrc.match(/\d+/);
function anniu() {
    var anniu2 = document.createElement('style');
    anniu2.type = 'text/css';
    anniu2.innerHTML = "#Steam_page{position:fixed;bottom:50%;right:1px;border:1px solid gray;padding:3px;width:120px;font-size:36px;cursor:pointer;border-radius: 10px;background-color: #9cbf00;}";
    document.getElementsByTagName('head')[0].appendChild(anniu2);
}

function anniu1() {
     $(document.body).append("<div id='Steam_page'>Steam page</div>");
     $('#Steam_page').click(function (){window.location.href="https://store.steampowered.com/app/" + appid;})};