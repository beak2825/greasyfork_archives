// ==UserScript==
// @name         Jut.su Mod
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Mod For Jut.su to look clean and less cringe!
// @author       F1xGOD
// @license      GNU
// @match        https://jut.su/*
// @match        https://www.google.com/*
// @icon         https://www.fixcraft.org/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515344/Jutsu%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/515344/Jutsu%20Mod.meta.js
// ==/UserScript==
if(window.location.href.includes("https://jut.su")){
    if(window.location.href.includes("https://jut.su/favicon")){
    document.getElementsByTagName("img")[0].src="https://firebasestorage.googleapis.com/v0/b/fixcraft-vpn.appspot.com/o/other%2Fsnj.png?alt=media"}
if(window.location.href.includes("F1xGODim")){
    document.getElementsByClassName("dark-line")[0].getElementsByTagName("div")[0].getElementsByTagName("span")[0].firstChild.color="#8B0000"
document.getElementsByClassName("dark-line")[0].getElementsByTagName("div")[0].getElementsByTagName("span")[0].firstChild.firstChild.innerHTML="Admin"
}
    if(document.getElementsByClassName("vjs-big-play-button")[0]!=undefined){
    document.getElementsByClassName("vjs-big-play-button")[0].click()}
    if(dark_mode_is==false){    switch_dark_mode()
}

function cgg(){
setTimeout(function(){
    if(dark_mode_is==false){document.getElementsByClassName("top_logo_img")[0].src="https://i.ytimg.com/vi/7G9dg-JkODQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAg68-6eHbox_PvLer3cCY-9sAiWA"
;switch_dark_mode();setTimeout(function(){document.getElementsByClassName("top_logo_img")[0].src=""},4000)
                           }
    cgg()},2000)
}
   function cgg2(){
setTimeout(function(){if(document.getElementsByClassName("vjs-watermark-content vjs-watermark-top-left age_on_water age_rating_all age_rating_18")[0]!=undefined){
    document.getElementsByClassName("vjs-watermark-content vjs-watermark-top-left age_on_water age_rating_all age_rating_18")[0].firstChild.replaceWith(document.createElement("text").innerHTML="1488")
};if(document.getElementsByClassName("vjs-big-play-button")[0]!=undefined){
    document.getElementsByClassName("vjs-big-play-button")[0].click()}
    cgg2()},200)
}
       function cgg22(){
setTimeout(function(){
if(document.getElementsByClassName("vjs-big-play-button")[0]!=undefined){
    document.getElementsByClassName("vjs-big-play-button")[0].click();window.clc=1}
    if(window.clc!=1){cgg22()}},100)
}
    if(document.getElementsByClassName("age_rating_all age_rating_18")[0]!=undefined){
        document.getElementsByClassName("age_rating_all age_rating_18")[0].firstChild.replaceWith(document.createElement("text").innerHTML="1488")
    }
        function cgg12(){
setTimeout(function(){
    if(document.getElementsByClassName("vjs-watermark-content vjs-watermark-top-left age_on_water age_rating_all age_rating_18")[0]!=undefined){
    document.getElementsByClassName("vjs-watermark-content vjs-watermark-top-left age_on_water age_rating_all age_rating_18")[0].firstChild.replaceWith(document.createElement("text").innerHTML="1488")
;window.clc2=1}
    if(window.clc2!=1){cgg12()}},100)
}
cgg12()
cgg22()
cgg()
    document.getElementsByClassName("dark_moon")[1].remove()
if(document.getElementsByClassName("top_banner_yand")[0]!=undefined){
document.getElementsByClassName("top_banner_yand")[0].remove()}
if(document.getElementsByClassName("widget side_banner_yand")[0]!=undefined){
document.getElementsByClassName("widget side_banner_yand")[0].remove()}
if(document.title.includes("Школе техник Наруто")){
document.title=document.title.replace("Школе техник Наруто","jut.su")}else if(document.title.includes("Школа техник Наруто")){
document.title=document.title.replace("Школа техник Наруто","jut.su")
}
var link = document.querySelector("link[rel~='icon']");
if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
}
link.href = 'https://firebasestorage.googleapis.com/v0/b/fixcraft-vpn.appspot.com/o/other%2Fsnj.png?alt=media';
    for(let o=0;o<document.getElementsByClassName("media_content").length;o++){
document.getElementsByClassName("media_content")[o].remove()}
for(let o=0;o<document.getElementsByClassName("media_content").length;o++){
document.getElementsByClassName("media_content")[o].remove()}
for(let o=0;o<document.getElementsByClassName("media_content").length;o++){
document.getElementsByClassName("media_content")[o].remove()}
for(let o=0;o<document.getElementsByClassName("media_content").length;o++){
document.getElementsByClassName("media_content")[o].remove()}
    if(document.getElementsByClassName("media_b clear new_last_boruto_eps")[0]!=undefined){
document.getElementsByClassName("media_b clear new_last_boruto_eps")[0].remove()}
 for(let o=0;o<document.getElementsByTagName("noindex").length;o++){
    if(document.getElementsByTagName("noindex")[o].firstChild.classList[0]=="kstati_widget_out"){
document.getElementsByTagName("noindex")[o].remove()}}
    document.getElementsByClassName("social_links")[0].remove()
    document.getElementsByClassName("notice_top2 notice_cont")[0].remove()
    document.getElementsByClassName("top_logo_img")[0].src=""
for(let i=0;i<document.getElementsByTagName("link").length;i++){
if(document.getElementsByTagName("link")[i].rel.includes("icon")){
document.getElementsByTagName("link")[i].href="https://firebasestorage.googleapis.com/v0/b/fixcraft-vpn.appspot.com/o/other%2Fsnj.png?alt=media"
}
}}else if(window.location.href.includes("https://google.com")||window.location.href.includes("https://www.google.com")){
    for(let i=0;i<document.getElementsByTagName("a").length;i++){
        if(document.getElementsByTagName("a")[i].href=="https://jut.su/"){
            if(document.getElementsByTagName("a")[i].firstChild.tagName=="BR"){
                    for(let i=0;i<document.getElementsByTagName("a").length;i++){
        if(document.getElementsByTagName("a")[i].href=="https://jut.su/"){
            if(document.getElementsByTagName("a")[i].firstChild.tagName=="BR"){
        document.getElementsByTagName("a")[i].children[2].firstChild.firstChild.firstChild.firstChild.src="https://firebasestorage.googleapis.com/v0/b/fixcraft-vpn.appspot.com/o/other%2Fsnj.png?alt=media"}}
    }
                    for(let i=0;i<document.getElementsByTagName("a").length;i++){
        if(document.getElementsByTagName("a")[i].href=="https://jut.su/"){
            if(document.getElementsByTagName("a")[i].firstChild.tagName=="BR"){
       document.getElementsByTagName("a")[i].children[2].lastChild.lastChild.firstChild.firstChild.innerHTML="Anime"}}
    }
                if(document.getElementsByTagName("a")[i].children[1].innerHTML.includes("Школе техник Наруто")){
document.getElementsByTagName("a")[i].children[1].innerHTML=document.getElementsByTagName("a")[i].children[1].innerHTML.replace("Школе техник Наруто","jut.su")}else if(document.getElementsByTagName("a")[i].children[1].innerHTML.includes("Школа техник Наруто")){
document.getElementsByTagName("a")[i].children[1].innerHTML=document.getElementsByTagName("a")[i].children[1].innerHTML.replace("Школа техник Наруто","jut.su")
}}}
    }
}
