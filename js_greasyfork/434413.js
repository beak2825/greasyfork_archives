// ==UserScript==
// @name         Tiny Ekata
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  One click to shortn Ekata Pages Url
// @author       bprasada
// @match        https://app.ekata.com/*
// @include      https://app.ekata.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434413/Tiny%20Ekata.user.js
// @updateURL https://update.greasyfork.org/scripts/434413/Tiny%20Ekata.meta.js
// ==/UserScript==
var b = document.getElementsByClassName("css-1y0rg2y-MenuItem e1nkls6v3")[1];
b.id = "Button_Id"
var a = window.location.href;
var res = encodeURIComponent(a);
let btn = document.createElement("button")
btn.innerHTML = "Tiny_Ekata"
b.insertAdjacentElement("beforeend", btn);
btn.onclick = function(){
    window.open("https://tiny.amazon.com/submit/url?name="+res)
}