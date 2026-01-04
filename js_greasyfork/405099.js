// ==UserScript==
// @name        Nitro Type "Updates" navigation button
// @namespace    https://www.youtube.com/channel/UCOQMOlaQ6GxltRHA_mwGVvQ
// @version      1.0
// @description  There's a new nitro type page, the "Updates" page. However it doesn't have "Updates" on the navigation to go to that page. You can use this script so you can access the "Updates" page easily like any other nitro type pages.
// @author       Ginfio
// @match        https://www.nitrotype.com/*
// @downloadURL https://update.greasyfork.org/scripts/405099/Nitro%20Type%20%22Updates%22%20navigation%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/405099/Nitro%20Type%20%22Updates%22%20navigation%20button.meta.js
// ==/UserScript==











window.onload=function(){var e=document.querySelector(".nav-list"),n=document.createElement("li");n.className="nav-list-item",e.appendChild(n),a=document.createElement("a"),a.href="/updates",a.className="nav-link",a.innerHTML="Updates",a.style.padding="15px 14px";for(var t=document.querySelectorAll(".nav-link"),l=0;l<t.length;l++)t[l].style.padding="15px 14px";n.appendChild(a),"https://www.nitrotype.com/updates"==window.location.href&&(n.className="nav-list-item is-current")};

