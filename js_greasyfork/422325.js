// ==UserScript==
// @name        Rebecca's Black Tech
// @namespace   Rebecca's Black Tech
// @match       https://arch.b4k.co/v/thread/*
// @match       https://arch.b4k.co/vg/thread/*
// @match       https://arch.b4k.co/vm/thread/*
// @match       https://arch.b4k.co/vmg/thread/*
// @match       https://arch.b4k.co/vp/thread/*
// @match       https://arch.b4k.co/vrpg/thread/*
// @match       https://arch.b4k.co/vst/thread/*
// @version     4
// @description nah nah, nah
// @icon        https://archive.rebeccablacktech.com/favicon-rbt.png
// @downloadURL https://update.greasyfork.org/scripts/422325/Rebecca%27s%20Black%20Tech.user.js
// @updateURL https://update.greasyfork.org/scripts/422325/Rebecca%27s%20Black%20Tech.meta.js
// ==/UserScript==
document.body.style.width="393px";
document.body.style.zoom="2.5";
document.getElementsByClassName("pull-right")[3].style.display="none";
document.getElementsByTagName("header")[0].outerHTML="<br>"+
  document.getElementsByTagName("header")[0].innerHTML;
//Post Shenanigans
for(var a=0;a<document.getElementsByClassName("post").length;a++){
  document.getElementsByClassName("post")[a].style.marginRight="5px";
  document.getElementsByClassName("post")[a].style.marginLeft="5px";}
for(var a=0;a<document.getElementsByClassName("post_is_op").length;a++){
  document.getElementsByClassName("post_is_op")[a].style.marginRight="0px";
  document.getElementsByClassName("post_is_op")[a].style.marginLeft="0px";}
for(var a=1;a<document.getElementsByClassName("post_controls").length;a++){
  document.getElementsByClassName("post_controls")[a].style.display="none";}
//Post Structure
for(let a=0;a<document.getElementsByClassName("post_wrapper").length;a++){
  document.getElementsByClassName("post_wrapper")[a].innerHTML=
    document.getElementsByTagName("header")[a*2].outerHTML+
    document.getElementsByClassName("post_wrapper")[a].innerHTML+
    document.getElementsByClassName("text")[a*2+1].outerHTML+
    document.getElementsByClassName("backlink_list")[a*2+1].outerHTML;
  document.getElementsByTagName("header")[a*2+1].style.display="none";
  document.getElementsByClassName("backlink_list")[a*2+1].style.display="none";
  document.getElementsByClassName("text")[a*2+1].style.display="none";
  document.getElementsByClassName("post_wrapper")[a].style.paddingBottom="0px";
  document.getElementsByClassName("post_wrapper")[a].style.paddingLeft="5px";}
for(var a=0;a<document.getElementsByTagName("header").length;a++){
  document.getElementsByTagName("header")[a].style.paddingTop="2px";}
for(var a=0;a<document.getElementsByClassName("text").length;a++){
  document.getElementsByClassName("text")[a].style.padding="10px 35px";}
  document.getElementsByClassName("text")[0].style.paddingLeft="45px";
for(var a=0;a<document.getElementsByClassName("backlink_list").length;a++){
  document.getElementsByClassName("backlink_list")[a].innerHTML=
    document.getElementsByClassName("backlink_list")[a].innerHTML.replace("Quoted By:","");}
for(var a=0;a<document.getElementsByTagName("span").length;a++){
  document.getElementsByTagName("span")[a].innerHTML=
    document.getElementsByTagName("span")[a].innerHTML.replace("Deleted","");}
for(var a=0;a<document.getElementsByClassName("post_file_controls").length;a++){
  document.getElementsByClassName("post_file_controls")[a].innerHTML=
    document.getElementsByClassName("post_file_controls")[a].innerHTML.replace("ImgOps","");}
//Search Shenanigans
document.getElementsByClassName("pull-right")[0].style.width="393px";
document.getElementsByClassName("pull-right")[0].style.left="30px";
document.getElementsByClassName("search-query")[0].style.width="333px";
document.getElementsByClassName("search-query")[0].style.marginLeft="15px";
document.getElementsByClassName("search-query")[0].addEventListener("click",function(){
  document.getElementsByClassName("search_box")[0].style.right="-1px";},false)
document.getElementsByClassName("search_box")[0].style.width="371px";
document.getElementsByClassName("advanced_search")[0].style.width="361px";
document.getElementsByTagName("form")[1].style.width="361px";
document.getElementById("search_form_comment").style.width="333px";
document.getElementsByClassName("column")[0].style.width="187px";
document.getElementsByClassName("radixes")[0].style.width="187px";
for(var a=6;a<20;a++){document.getElementsByTagName("input")[a].style.width="87px";}
for(var a=0;a<document.getElementsByClassName("latest_search").length;a++){
  document.getElementsByClassName("latest_search")[a].style.width="181px";}
//Fappe Shenanigans
document.getElementsByClassName("post_controls")[0].appendChild(
  document.getElementsByClassName("btnr")[0].cloneNode(true));
document.getElementsByClassName("parent")[9].innerHTML="Fappe";
document.getElementsByClassName("parent")[9].removeAttribute("href");
document.getElementsByClassName("parent")[9].removeAttribute("data-controls-modal");
document.getElementsByClassName("parent")[9].addEventListener("click",function(){
  for(let a=0;a<document.querySelectorAll("article:not(.has_image)").length;a++){
    document.querySelectorAll("article:not(.has_image)")[a].style.display="none";
  	document.getElementsByClassName("parent")[9].style.display="none";
  	document.getElementsByClassName("parent")[10].style.display="inline";}},false)
document.getElementsByClassName("post_controls")[0].appendChild(
  document.getElementsByClassName("btnr")[0].cloneNode(true));
document.getElementsByClassName("parent")[10].innerHTML="Fappe";
document.getElementsByClassName("parent")[10].removeAttribute("href");
document.getElementsByClassName("parent")[10].removeAttribute("data-controls-modal");
document.getElementsByClassName("parent")[10].style.display="none";
document.getElementsByClassName("parent")[10].addEventListener("click",function(){
  for(let a=0;a<document.querySelectorAll("article:not(.has_image)").length;a++){
    document.querySelectorAll("article:not(.has_image)")[a].style.display="block";
  	document.getElementsByClassName("parent")[9].style.display="inline";
  	document.getElementsByClassName("parent")[10].style.display="none";}},false)