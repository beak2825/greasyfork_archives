// ==UserScript==
// @name        Gartic.io CroxyProxy v1
// @namespace   http://tampermonkey.net/
// @author      MRé
// @match       https://www.croxyproxy.com/*
// @match       https://www.croxyproxy.com/
// @match       https://gartic.io/*
// @icon        https://i.pinimg.com/736x/43/fe/03/43fe03b205a5c3d1e3e16ac8222d7034.jpg
// @run-at      document-end
// @grant       none
// @version     1.1.9
// @license     MIT
// @description visit: https://gartic.io/?mrnIPselector
// @downloadURL https://update.greasyfork.org/scripts/519567/Garticio%20CroxyProxy%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/519567/Garticio%20CroxyProxy%20v1.meta.js
// ==/UserScript==

const proxylist=[{"id":"43","ip":"172.67.168.70"},{"id":"45","ip":"172.67.161.154"},
                 {"id":"46","ip":"172.67.181.121"}, {"id":"44","ip":"104.21.49.97"},
                 {"id":"46","ip":"172.67.196.57"},{"id":"47","ip":"188.165.1.152"},
                 {"id":"48","ip":"195.3.220.75"},{"id":"49","ip":"108.181.3.2"},
                 {"id":"50","ip":"104.21.5.205"},{"id":"51","ip":"104.21.35.240"},
                 {"id":"52","ip":"108.181.32.73"},{"id":"53","ip":"108.181.32.55"},
                 {"id":"54","ip":"108.181.32.61"},{"id":"56","ip":"108.181.32.59"},
                 {"id":"63","ip":"108.181.43.67"},{"id":"64","ip":"108.181.34.45"},
                 {"id":"68","ip":"108.181.24.243"},{"id":"69","ip":"108.181.34.177"},
                 {"id":"92","ip":"108.181.34.157"},{"id":"144","ip":"195.3.223.166"},
                 {"id":"145","ip":"195.3.223.164"},{"id":"146","ip":"146.19.24.89"},
                 {"id":"149","ip":"195.3.222.15"},{"id":"150","ip":"185.16.39.161"},
                 {"id":"154","ip":"95.214.53.145"},{"id":"157","ip":"95.214.53.152"},
                 {"id":"161","ip":"108.181.8.179"},{"id":"162","ip":"108.181.9.39"},
                 {"id":"163","ip":"108.181.11.39"},{"id":"164","ip":"108.181.6.89"},
                 {"id":"172","ip":"208.87.240.203"},{"id":"173","ip":"208.87.240.219"},
                 {"id":"174","ip":"104.21.76.240"},{"id":"176","ip":"172.67.181.17"},
                 {"id":"177","ip":"108.181.4.237"},{"id":"175","ip":"108.181.4.237"},
                 {"id":"178","ip":"208.87.241.209"},{"id":"179","ip":"108.181.4.241"},
                 {"id":"181","ip":"208.87.240.35"},{"id":"182","ip":"108.181.5.29"},
                 {"id":"180","ip":"208.87.242.233"},{"id":"183","ip":"208.87.242.233"},
                 {"id":"184","ip":"208.87.240.67"},{"id":"185","ip":"95.214.53.48"},
                 {"id":"186","ip":"195.3.222.40"},{"id":"187","ip":"185.225.191.49"},
                 {"id":"189","ip":"185.225.191.57"},{"id":"198","ip":"108.181.11.173"},
                 {"id":"199","ip":"108.181.11.193"},{"id":"200","ip":"108.181.11.137"},
                 {"id":"201","ip":"108.181.11.171"},{"id":"202","ip":"108.181.11.175"},
                 {"id":"203","ip":"185.16.39.144"},{"id":"204","ip":"185.16.39.213"},
                 {"id":"205","ip":"178.211.139.238"},{"id":"216","ip":"185.246.84.18"},
                 {"id":"219","ip":"185.246.84.66"},{"id":"220","ip":"151.101.129.140"},
                 {"id":"221","ip":"67.220.228.202"},{"id":"222","ip":"172.67.202.78"},
                 {"id":"225","ip":"172.67.210.26"},{"id":"226","ip":"104.21.81.163"},
                 {"id":"300","ip":"104.21.55.14"},{"id":"301","ip":"104.21.34.243"},
                 {"id":"132","ip":"172.67.143.236"},{"id":"177","ip":"172.67.145.6"},
                 {"id":"131","ip":"172.67.185.8"},{"id":"228","ip":"104.21.84.24"},
                 {"id":"122","ip":"172.67.221.185"},{"id":"229","ip":"172.67.181.30"},
                 {"id":"123","ip":"104.21.9.41"},{"id":"230","ip":"172.67.141.121"},
                 {"id":"124","ip":"104.21.11.67"},{"id":"125","ip":"104.21.86.157"},
                 {"id":"231","ip":"104.21.31.84"}, {"id":"234","ip":"104.21.26.103"},
                 {"id":"235","ip":"104.21.72.101"},{"id":"237","ip":"104.21.11.58"},
                 {"id":"236","ip":"104.21.12.60"},{"id":"134","ip":"104.21.80.127"},
                 {"id":"155","ip":"172.67.142.234"},{"id":"252","ip":"104.21.7.113"},
                 {"id":"150","ip":"104.21.27.141"},{"id":"254","ip":"172.67.178.59"},]

if(window.location.href.indexOf("mrnnext")>-1){sessionStorage.setItem("mrnnext",window.location.href.split("mrnnext=")[1]);

document.getElementsByClassName('fa fa-arrow-right')[0].dispatchEvent(new MouseEvent("click",{bubbles:true,button:0}))}

if(window.location.href.indexOf("servers")!=-1){inter=setInterval(()=>{if(document.querySelector("input[name=proxyServerId]")){

document.body.innerHTML+=`

<form class="myform" method="POST" action="/requests?fso=">
<input type="hidden" name="url" value="gartic.io">
<input type="hidden" name="proxyServerId" value="`+sessionStorage.getItem("mrnnext")+`">
<input type="hidden" name="csrf" value="`+document.querySelector("input[name=csrf]").value+`">
<input type="hidden" name="demo" value="0">
<input type="hidden" name="frontOrigin" value="https://www.croxyproxy.com"></form>`;

document.querySelector(".myform").submit();clearInterval(inter)}})}

if(window.location.href.indexOf("mrnIPselector")>-1){

document.body.innerHTML=`

<div style="background-color:Maroon">
<div style="width:100%;height:100vh;">
<div style="width:100%;color:black;">
<h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong><b>MR Proxy (Ready link for gartic.io)<br><br>Ready proxies<b></strong>:: `+proxylist.length+`</b></h4>
</div>
<div class="proxies" style="background:Maroon;color:yellow;width:100%;display:flex;justify-content:center;align-items:center;flex-wrap:wrap;">
</div>
</div>`;

proxylist.forEach((item)=>{

document.querySelector(".proxies").innerHTML+=`
<a target="_blank" class="proksi" style="border-radius:3px;margin:5px;padding:5px;background:#ffffff;color:black;" href="https://www.croxyproxy.com/?mrnnext=`+item.id+`">`+item.ip+`</a>`})}

