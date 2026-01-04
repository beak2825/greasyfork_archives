// ==UserScript==
// @name         page editor
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  works if you can find the buttons, allows you to edit the page.
// @author       twarped
// @include      https://*/*
// @include      http://*/*
// @exclude      *docs.google.com/*/*
// @exclude      *sites.google.com/*/edit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387418/page%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/387418/page%20editor.meta.js
// ==/UserScript==


var editon = document. createElement("button");
editon. innerHTML = "Edit On";
var body = document. getElementsByTagName("body")[0];
body. appendChild(editon);
editon.addEventListener ("click", function() {
javascript:document.body.contentEditable = 'true'; document.designMode='on'; void 0
});
   var editoff = document. createElement("button");
editoff. innerHTML = "Edit Off";
    var head = document. getElementsByTagName("body")[0];
body. appendChild(editoff);
editoff.addEventListener ("click", function() {
    javascript:document.body.contentEditable = 'false'; document.designMode='off'; void 0
});