// ==UserScript==
// @name         peter sasha
// @namespace    http://tampermonkey.net/
// @version      2.6.8
// @description  auto click skip button
// @match        http://www.ebesucher.com/surfbar/*
// @match        http://www.ebesucher.de/surfbar/*
// @author       peter
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23551/peter%20sasha.user.js
// @updateURL https://update.greasyfork.org/scripts/23551/peter%20sasha.meta.js
// ==/UserScript==
setTimeout(beginclick,20000);
function beginclick()
{
setCookie('num',1); 
setInterval(autoClick,10000);
}
function autoClick(){
if(findInPage("no websites can be currently displayed to you")){
var nn=parseInt(getCookie('num')); 
setCookie('num',++nn); 
if(nn>10){
window.location.href = 'about:blank'; 
}
else $("#skip").click();
}
else $("#skip").click();
}
function findInPage(str) {
var result=window.find(str, false, true);
return result;
}
function setCookie(name,value){ 
var exp = new Date(); 
exp.setTime(exp.getTime() + 30*60*1000); 
document.cookie = name+"="+value+";expires="+exp.toGMTString()+";path=/";
} 
function getCookie(c_name)
{
if (document.cookie.length>0)
  {
  c_start=document.cookie.indexOf(c_name + "=");
  if (c_start!=-1)
    { 
    c_start=c_start + c_name.length+1; 
    c_end=document.cookie.indexOf(";",c_start);
    if (c_end==-1) c_end=document.cookie.length;
    return unescape(document.cookie.substring(c_start,c_end));
    } 
  }
return "";
}