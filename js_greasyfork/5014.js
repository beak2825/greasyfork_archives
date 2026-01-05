// ==UserScript==
// @name        Unfuck Instagram
// @description View Instagram images without javascript. Just the image, please.
// @namespace   halcyon1234
// @include     http://instagram.com/p/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5014/Unfuck%20Instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/5014/Unfuck%20Instagram.meta.js
// ==/UserScript==

$elms = document.getElementsByTagName("meta");


for(i = 0; i < $elms.length; i++) 
{ 
    $elm = $elms[i]; 
    if ($elm.getAttribute("property") == "og:image")
    {
        img = document.createElement("img"); 
        img.src = $elm.getAttribute("content"); 
        document.body.appendChild(img); 
    } 
}