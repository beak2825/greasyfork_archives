// ==UserScript==
// @name           跳过minecraftforge.net上的adfoc跳转链接 || Skip adfoc link on minecraftforge.net
// @name:zh        跳过minecraftforge.net上的adfoc跳转链接
// @name:en        Skip adfoc link on minecraftforge.net
// @description    跳过minecraftforge.net上的adfoc跳转链接，直接下载文件
// @description:zh 跳过minecraftforge.net上的adfoc跳转链接，直接下载文件
// @description:en Skip adfoc link on minecraftforge.net and download files directly
// @namespace      myitian.mc-forge.skip-adfoc
// @version        1.1
// @license        MIT
// @author         Myitian
// @match          *.minecraftforge.net/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/442635/%E8%B7%B3%E8%BF%87minecraftforgenet%E4%B8%8A%E7%9A%84adfoc%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5%20%7C%7C%20Skip%20adfoc%20link%20on%20minecraftforgenet.user.js
// @updateURL https://update.greasyfork.org/scripts/442635/%E8%B7%B3%E8%BF%87minecraftforgenet%E4%B8%8A%E7%9A%84adfoc%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5%20%7C%7C%20Skip%20adfoc%20link%20on%20minecraftforgenet.meta.js
// ==/UserScript==

window.onload=function linkReplacerX(){
    var ele_a=document.getElementsByTagName('A');
    var reg_a=/https:\/\/adfoc\.us\/serve\/sitelinks\/\?(?:\S+=\S+&)?url=(\S+)/i;
    for(var i=0; i<ele_a.length; i++){
        var match=reg_a.exec(ele_a[i].href);
        if(match){
            ele_a[i].href=match[1];
        }
    }
}
window.onclick=function linkReplacerY(){
    var ele_a=document.getElementsByTagName('A');
    var reg_a=/https:\/\/adfoc\.us\/serve\/sitelinks\/\?(?:\S+=\S+&)?url=(\S+)/i;
    for(var i=0; i<ele_a.length; i++){
        var match=reg_a.exec(ele_a[i].href);
        if(match){
            ele_a[i].href=match[1];
        }
    }
}
window.onmousedown=function linkReplacerZ(){
    var ele_a=document.getElementsByTagName('A');
    var reg_a=/https:\/\/adfoc\.us\/serve\/sitelinks\/\?(?:\S+=\S+&)?url=(\S+)/i;
    for(var i=0; i<ele_a.length; i++){
        var match=reg_a.exec(ele_a[i].href);
        if(match){
            ele_a[i].href=match[1];
        }
    }
}