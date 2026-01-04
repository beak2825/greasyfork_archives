// ==UserScript==
// @name         Ghlv Theme
// @namespace    http://hello.ora.moe/
// @version      0.5
// @description  Like V2ex:)
// @author       H503mc
// @match        https://geekhub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403488/Ghlv%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/403488/Ghlv%20Theme.meta.js
// ==/UserScript==

try{
//This file use to covert some errors
//document.querySelectorAll(".inline-flex.items-center.px-2")[0].innerHTML="主页"//Code OK:change
document.querySelector(".container.flex.items-center.justify-between.px-3.py-3.mx-auto div form .mr-5").placeholder=""//Code OK:change
document.querySelectorAll(".container.flex.items-center.justify-between")[1].style.display="none" //Code OK:delete banner#2
document.querySelector("sidebar").children[0].children[3].style.display="none"//Code OK:delete some div
document.querySelector("sidebar").children[0].children[4].style.display="none"//Code OK:delete some div
document.querySelector("sidebar").children[0].children[5].style.display="none"//Code OK:delete some div
document.querySelector("#light").click()//Code OK:switch themes
//document.querySelector(".my-1.btn.btn-white").style.display="none"//Code OK:delete some html
//var temp=document.querySelector(".p-3.box").children[1]
//document.querySelector(".p-3.box").children[1]=document.querySelector(".p-3.box").children[2]
//document.querySelector(".p-3.box").children[2]=temp
//delete temp
document.querySelector("sidebar").children[0].children[0].children[5].children[0].style.display="none"//Code OK:delete some html
}catch{}
//setInterval(()=>{if(document.querySelector(".flex.items-center.text-primary-700.mr-5")!==null){document.querySelectorAll(".container.flex.items-center.justify-between")[1].style.display=""}else{document.querySelectorAll(".container.flex.items-center.justify-between")[1].style.display="none"}},100)
var Thememenu=document.querySelector("#light").parentNode;Thememenu.innerText="Menu"
Thememenu.onclick=()=>{if(document.querySelectorAll(".container.flex.items-center.justify-between")[1].style.display===""){document.querySelectorAll(".container.flex.items-center.justify-between")[1].style.display="none"}else{document.querySelectorAll(".container.flex.items-center.justify-between")[1].style.display="";}}
Thememenu.onselectstart=function(){return false}
Thememenu.style.cursor="pointer"
var style=document.createElement("style");style=document.createElement("style");style.innerHTML=`/* puesdo code */
.flex.flex-col.overflow-auto.bg-primary-300{
background-color:#e2e2e2; /*document.querySelector(".flex.flex-col.overflow-auto.bg-primary-300").style.backgroundColor="#e2e2e2"*/
}/* Code:background color */
.container.flex.items-center.justify-between.px-3.py-3.mx-auto div form .mr-5{
width:276px;
height:28px;
background-size:276px 28px;
background-image:url(https://i.v2ex.co/d7XTF58h.png);
background-repeat:no-repeat;
display:inline-block;
} /* Code ok:search */
.container.flex.items-center.justify-between.px-3.py-3.mx-auto {
text-align:center;
background-color:var(--box-background-color);
height:44px;
font-size:15px;
font-weight:500;
background-size:44px 44px;
border-bottom:1px solid rgba(0,0,0,.22);
padding:0 20px;
} /* Code ok:banner */
:root{--box-background-color:#fff;
--box-background-alt-color:#f9f9f9;
--box-background-hover-color:#fafafa;
--box-foreground-color:#000;
--box-border-color:#e2e2e2;
--box-border-focus-color:rgba(128, 128, 160, 0.6);
--box-border-radius:3px;
--box-font-size:14px;
--box-line-height:120%;
--menu-shadow-color:rgba(0, 0, 0, 0.2);
--geekhub-text-color:#484747;
}/* Code ok:Css vars */
a.badge.py-2px.sub{
line-height:12px;
font-weight:700;
color:#fff;
background-color:#e5e5e5;
display:inline-block;
padding:2px 10px;
-moz-border-radius:12px;
-webkit-border-radius:12px;
border-radius:12px;
text-decoration:none;
margin-right:5px;
}/* Code ok:Css number */
.p-3.mt-5.box.flex,.container.flex.items-center.justify-between:last-child,.my-1.btn.btn-white:first-child,.container.flex.flex-col.justify-between.p-3{
display:none;
}/* Code ok:delete */
`;document.head.appendChild(style)