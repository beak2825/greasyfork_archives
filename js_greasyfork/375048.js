// ==UserScript==
// @name         Instagram Text Copy
// @namespace    none
// @version      0.1
// @description  Обход запрета выделения текста
// @author       Vlados
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375048/Instagram%20Text%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/375048/Instagram%20Text%20Copy.meta.js
// ==/UserScript==


function func() {

var x = 0;

    for (x;x<30;x++) { 
        
        var post = document.getElementsByClassName("C4VMK")[x];

        post.style.cssText = "user-select: text";}

}

setInterval(func, 500);