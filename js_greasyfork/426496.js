// ==UserScript==
// @name        Google Search Direct Links
// @namespace   Google Search Direct Links
// @match       *://*.google.*/*
// @grant       none
// @version     1.0
// @author      K.D.
// @description Remove redirects by Google!
// @downloadURL https://update.greasyfork.org/scripts/426496/Google%20Search%20Direct%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/426496/Google%20Search%20Direct%20Links.meta.js
// ==/UserScript==

function main(){
    
let links= document.querySelectorAll(".Zu0yb.UGIkD.qzEoUe");

links.forEach(link => {
let gURL= link.closest("a");
link.innerHTML= `<a href="${gURL.href}">${gURL.href}</a>`;
link.style.background= "#98ff98";
gURL.removeAttribute("ping");

gURL.onclick=()=>{
location.href= gURL.href;
return false;
};

    
});

    
}   


setInterval(main, 2000);
