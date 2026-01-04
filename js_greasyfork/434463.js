// ==UserScript==
// @name         Linkedin - Tiny
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  One click to shorten Linkedin Pages
// @author       bprasada
// @include      https://www.linkedin.com/*
// @match        https://www.linkedin.com/*
// @include      https://www.linkedin.com/in/*
// @match        https://www.linkedin.com/in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434463/Linkedin%20-%20Tiny.user.js
// @updateURL https://update.greasyfork.org/scripts/434463/Linkedin%20-%20Tiny.meta.js
// ==/UserScript==

var a2 = document.getElementById("global-nav-search");
var btn2 = document.createElement("button");
btn2.innerHTML = "Tiny-Linkedin";
a2.insertAdjacentElement("afterend", btn2);

btn2.onclick = function(){
    var url2 = window.location.href;
    var res2 = encodeURIComponent(url2);
    window.open("https://tiny.amazon.com/submit/url?name="+res2)
}
