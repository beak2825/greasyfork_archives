// ==UserScript==
// @name        Moe & Desu's Black Tech
// @namespace   Moe & Desu's Black Tech
// @match       https://desuarchive.org/*/thread/*
// @match       https://archive.wakarimasen.moe/*/thread/*
// @match       https://archived.moe/*/thread/*
// @version     3.1
// @description Rebecca was fired for being fucking proprietery. Will Asagi and Torako be able to pick up the slack? Also FUCK MOE YOU'RE FUCKING FIRED TOO YOU DOUBLE NIGGER
// @icon        https://archive.rebeccablacktech.com/favicon-rbt.png
// @downloadURL https://update.greasyfork.org/scripts/426973/Moe%20%20Desu%27s%20Black%20Tech.user.js
// @updateURL https://update.greasyfork.org/scripts/426973/Moe%20%20Desu%27s%20Black%20Tech.meta.js
// ==/UserScript==

// ==Fuckin' Buttons 'n Shiet==
document.getElementsByClassName("mobile_view")[0].innerHTML=
  document.getElementsByClassName("mobile_view")[0].innerHTML+
  "<a class='btnr parent fappe'>Fappe</a>"+
  "<a class='btnr parent nappe' style='display:none'>Fappe</a>"+
  "<a class='btnr parent expand'>Expand</a>"+
  "<a class='btnr parent nxpand' style='display:none'>Expand</a>";
// ==/Fuckin' Buttons 'n Shiet==

// ==Fappe Shenanigans==
var fap = document.getElementsByClassName("fappe")[0];
var nap = document.getElementsByClassName("nappe")[0];
var not = document.querySelectorAll("article:not(.has_image)");
fap.addEventListener("click",function(){
  for(let a=0;a<not.length;a++){not[a].style.display="none";
  	fap.style.display="none";nap.style.display="inline";}},false);
nap.addEventListener("click",function(){
  for(let a=0;a<not.length;a++){not[a].style.display="block";
  	nap.style.display="none";fap.style.display="inline";}},false);
// ==/Fappe Shenanigans==

// ==Image Expansion==
var box = document.getElementsByClassName("thread_image_box");
var img = document.getElementsByClassName("thread_image_link");
var pos = document.getElementsByClassName("post_image");
var fos = document.getElementsByClassName("fost_image");
for(let a=0;a<box.length;a++){
  box[a].style.textAlign="left";
  if(img[0].href.includes("webm")){
    box[a].innerHTML=pos[a].outerHTML+"<video src='"+img[0].href+
    "' class='fost_image' style='display:none' loading='lazy' width='360px' controls loop></video>";}else{
    box[a].innerHTML=pos[a].outerHTML+"<img src='"+img[0].href+
    "' class='fost_image' style='display:none' loading='lazy' width='360px'>";}}
for(let a=0;a<pos.length;a++){
  pos[a].addEventListener("click",function(){
    pos[a].style.display="none";fos[a].style.display="inline";},false);}
for(let a=0;a<fos.length;a++){
  fos[a].addEventListener("click",function(){
    fos[a].style.display="none";pos[a].style.display="inline";},false);}
// ==/Image Expansion==

// ==Expansion of Images==
var exp = document.getElementsByClassName("expand")[0];
var nxp = document.getElementsByClassName("nxpand")[0];
exp.addEventListener("click",function(){
  for(let a=0;a<pos.length;a++){
  	exp.style.display="none";nxp.style.display="inline";
		pos[a].style.display="none";fos[a].style.display="inline";}},false);
nxp.addEventListener("click",function(){
  for(let a=0;a<fos.length;a++){
  	nxp.style.display="none";exp.style.display="inline";
		fos[a].style.display="none";pos[a].style.display="inline";}},false);
// ==/Expansion of Images==

// ==Miscellaneous==
document.querySelector('[title="Post Count / File Count / Posters"]').innerHTML+=
  "<br>"+document.getElementsByClassName("post_title")[0].outerHTML;
document.getElementsByClassName("letters")[0].style.display="none";
document.getElementsByClassName("js_hook_realtimethread")[0].style.display="none";
document.getElementsByClassName("post_title")[1].style.display="none";
for(var a=0;a<document.getElementsByClassName("backlink_list").length;a++){
  document.getElementsByClassName("backlink_list")[a].innerHTML=
    document.getElementsByClassName("backlink_list")[a].innerHTML.replace("Quoted By:","");}
document.getElementsByClassName("post_is_op")[0].style.setProperty("margin", "0px", "important");
for(var a=1;a<document.getElementsByClassName("text").length;a++){
  document.getElementsByClassName("text")[a].style.setProperty("padding", "3px 18px 0px 8px", "important");}
document.getElementsByClassName("text")[0].style.setProperty("padding", "5px 20px 5px 23px", "important");
// Wakarimasen
document.getElementsByClassName("section_title")[0].style.display="none";
document.getElementsByClassName("thread_form_wrap")[0].style.display="none";
for(var a=0;a<document.getElementsByClassName("post_ghost").length;a++){
  document.getElementsByClassName("post_ghost")[a].style.display="none";}
// ==/Miscellaneous==