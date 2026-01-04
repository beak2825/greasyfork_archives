// ==UserScript==
// @name Second Tab
// @namespace https://greasyfork.org/en/users/1188196
// @version 3.4
// @description this is a second tab script
// @match        *://www.google.com/*

// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476710/Second%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/476710/Second%20Tab.meta.js
// ==/UserScript==

var url = prompt("Enter a website remamber to add https:// ");
var b = document.createElement("iframe");
b.style.height = "700px";
b.style.width = "1200px";
b.src = "https://"+url;
b.style.border = "solid white 2px";
b.style.position = "fixed";
b.style.top = "0";
b.style.bottom  = "0";
b.style.zIndex = "99999";
b.style.borderRadius = "10px";


var d = document.createElement("button");
d.style.height = "40px";
d.style.color= "white";
d.style.width = "60px";
d.innerText = "Close";
d.style.background = "red";
d.style.fontWeight = "bold";
b.style.border = "solid white 2px";
d.style.position = "fixed";
d.style.top = "0";
d.style.marginLeft = "642px";
d.style.bottom  = "0";
d.style.zIndex = "99999";
d.style.borderRadius = "5px";


document.body.appendChild(b);
document.body.appendChild(d);

d.addEventListener("mouseover",function(){
    d.style.filter = "brightness(150%)";
    
});

d.addEventListener("mouseout",function(){
    d.style.filter = "brightness(100%)";
    
})

d.addEventListener("click",function(){
    document.body.removeChild(d);
    document.body.removeChild(b);
    clearInterval(t);
})
var t = 0;
function c(){
    url = b.src;
    console.log(url);
}
t = setInterval(c,100);