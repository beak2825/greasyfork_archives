// ==UserScript==
// @name        Nitro Type "Support" navigation button
// @namespace    https://www.youtube.com/channel/UCOQMOlaQ6GxltRHA_mwGVvQ
// @version      1.0
// @description This button was back in the v2 and v1 version
// @author       Ashwin
// @match        https://www.nitrotype.com/*
// @downloadURL https://update.greasyfork.org/scripts/521815/Nitro%20Type%20%22Support%22%20navigation%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/521815/Nitro%20Type%20%22Support%22%20navigation%20button.meta.js
// ==/UserScript==
 
 
 
 
 
 
 
 
 
 
 
window.onload=function(){var e=document.querySelector(".nav-list"),n=document.createElement("li");n.className="nav-list-item",e.appendChild(n),a=document.createElement("a"),a.href="/updates",a.className="nav-link",a.innerHTML="Updates",a.style.padding="15px 14px";for(var t=document.querySelectorAll(".nav-link"),l=0;l<t.length;l++)t[l].style.padding="15px 14px";n.appendChild(a),"https://www.nitrotype.com/Support"==window.location.href&&(n.className="nav-list-item is-current")};
 