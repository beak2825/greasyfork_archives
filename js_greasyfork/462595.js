// ==UserScript==
// @name         Shutup Curseforge APP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  这个脚本去除了 Curseforge Beta 上无处不在的 APP 推广
// @author       Colinxu2020
// @match        https://beta.curseforge.com/minecraft/mc-mods/*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=curseforge.com
// @grant        none
// @license      GNU LESSER GENERAL PUBLIC LICENSE VERSION 3
// @downloadURL https://update.greasyfork.org/scripts/462595/Shutup%20Curseforge%20APP.user.js
// @updateURL https://update.greasyfork.org/scripts/462595/Shutup%20Curseforge%20APP.meta.js
// ==/UserScript==


var lazyhack_files=function(){
        document.getElementsByClassName(' split-button')[1].innerHTML=document.getElementsByClassName("more-options")[1].children[1].innerHTML;
};
(function() {
    'use strict';

    if(window.location.href.indexOf("download")!=-1){
        console.log("curseforge download")
        document.getElementsByClassName("client-marketing")[0].innerHTML="";
    }
    if(window.location.href.indexOf("files")!=-1){
        console.log("curseforge files");
        setTimeout(lazyhack_files,5);
    }
    document.getElementsByClassName("user-actions")[0].innerHTML="";
    document.getElementsByClassName(' split-button')[0].innerHTML=document.getElementsByClassName("more-options")[0].children[1].innerHTML;
})();