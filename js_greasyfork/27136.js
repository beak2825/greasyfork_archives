// ==UserScript==
// @name         ECNU autologin
// @namespace    undefined
// @version      0.2
// @description  华东师范大学统一身份认证的cookie只保留到关闭浏览器前，下次打开浏览器就要重新登陆，令人非常不爽，因此使用脚本延长cookie保留时间。
// @author       ZENG Jinzhe
// @include      https://portal1.ecnu.edu.cn/cas/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27136/ECNU%20autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/27136/ECNU%20autologin.meta.js
// ==/UserScript==

function setCookie(c_name,value,expiredays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate()+expiredays);
document.cookie=c_name+ "=" +escape(value)+
((expiredays===null) ? "" : ";expires="+exdate.toGMTString());
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

CASTGC=getCookie('CASTGC');
if (CASTGC!==null && CASTGC!=="")
  {setCookie('CASTGC',CASTGC,10000);}