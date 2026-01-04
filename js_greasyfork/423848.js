// ==UserScript==
// @name         MH Basics Button
// @author       The guide? Zafiast
// @namespace    https://greasyfork.org/en/users/748165-chromatical
// @version      1.0.0
// @description  Adds MHBasics Button :D
// @resource     YOUR_CSS https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/js/all.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js
// @include      https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @connect      self
// @connect      script.google.com
// @connect      script.googleusercontent.com
//
// @downloadURL https://update.greasyfork.org/scripts/423848/MH%20Basics%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/423848/MH%20Basics%20Button.meta.js
// ==/UserScript==
$(document).ready(function() {
    addTouchPoint2();
});

function addTouchPoint2() {
    if ($('.zafHix').length == 0) {
        const invPages = $('.kingdom .guide ');
        //Zaf Copium Button
        const zafHix = document.createElement('li');
        zafHix.classList.add('zafHix');
        const zafHixBtn = document.createElement('a');
        zafHixBtn.href = 'https://mousehuntbasics.wordpress.com/'
        zafHixBtn.target="_blank"
        zafHixBtn.innerText = "MouseHunt Basics";
        zafHixBtn.onclick = function () {
            onZafHXOnClick();
        };
        const icon = document.createElement("div");
        icon.className = "icon";
        zafHixBtn.appendChild(icon);
        zafHix.appendChild(zafHixBtn);
        $(zafHix).insertAfter(invPages);
    }
}