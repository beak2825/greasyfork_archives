// ==UserScript==
// @name         Tiny-Ekata
// @namespace    http://amazon.com
// @version      0.1
// @description  One click to shortn Ekata Pages Url
// @author       bprasada
// @match        https://app.ekata.com/*
// @include      https://app.ekata.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434603/Tiny-Ekata.user.js
// @updateURL https://update.greasyfork.org/scripts/434603/Tiny-Ekata.meta.js
// ==/UserScript==


var button_input_class = document.getElementsByClassName("css-1y0rg2y-MenuItem e1nkls6v3")[5];
var url = window.location.href;
var encode_url = encodeURIComponent(url);
let btn = document.createElement("button");
btn.innerHTML = "Tiny_Ekata";
button_input_class.insertAdjacentElement("afterend", btn);
btn.onclick = function(){
    window.open("https://tiny.amazon.com/submit/url?name="+encode_url)
}
