// ==UserScript==
// @name     SpaceInMarkiplierARG
// @version  1
// @match    https://www.universalstabilityagency.space/*
// @description This Greasemonkey Script decrypts the text on the Space With Markiplier ARG
// @grant    none
// @namespace https://greasyfork.org/users/246759
// @downloadURL https://update.greasyfork.org/scripts/443590/SpaceInMarkiplierARG.user.js
// @updateURL https://update.greasyfork.org/scripts/443590/SpaceInMarkiplierARG.meta.js
// ==/UserScript==

function changeFont(element){
    element.setAttribute("style",element.getAttribute("style")+";font-family: Courier New !important");
    for(var i=0; i < element.children.length; i++){
        changeFont(element.children[i]);
    }
}
changeFont(document.getElementsByTagName("html")[0]);