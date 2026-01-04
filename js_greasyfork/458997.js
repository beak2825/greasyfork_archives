// ==UserScript==
// @name         标题居中
// @namespace    https://viayoo.com/
// @version      0.1
// @description  只支持Via，可能有亿点点偏差，忍不了的可以暂时不使用，后续会完善
// @author       呆毛飘啊飘
// @run-at       document-end
// @run-at       document-start
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458997/%E6%A0%87%E9%A2%98%E5%B1%85%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/458997/%E6%A0%87%E9%A2%98%E5%B1%85%E4%B8%AD.meta.js
// ==/UserScript==

(function() {
getTxt=(txt)=>{
var cddiv = document.createElement("div");cddiv.id = "cdkj";cddiv.style.cssText = "white-space:nowrap;width:auto;position:fixed;top:0px;z-index:99999999;";document.body.appendChild(cddiv);var cdstyle = document.createElement("span");cdstyle.id='hh';cdstyle.innerHTML=txt;cdstyle.style.cssText = "margin:0px;padding:0px;font-size:16px;margin-left:45px;";document.getElementById("cdkj").appendChild(cdstyle);var kn = document.getElementById('hh').offsetWidth;document.getElementById('cdkj').remove();return kn;
};
getTit=()=>{
if(document.title.length==0){return window.location.href;}else{return document.title;}
};
screen=()=>{
return document.body.clientWidth;
};
var m=screen()-getTxt(getTit())-90;
var kg = getTxt('ㅤ');
m = m/kg/2;
mm=Math.floor(m);
m=Math.ceil(m);
if(mm==m)
{
var str ='ㅤ'.repeat(m)+getTit();
}else{
var str ='ㅤ'.repeat(mm)+getTit();
str='⠀'+str;
}
document.title=str;
console.log(m);
})();