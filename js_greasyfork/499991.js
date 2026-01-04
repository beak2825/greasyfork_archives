// ==UserScript==
// @name        Page Border Remover mangapill.com
// @namespace   a0fefd scripts
// @match       https://mangapill.com/chapters/*
// @license     OSL-3.0
// @version     1.0
// @author      a0fefd
// @description 08/07/2024, 19:07:21
// @downloadURL https://update.greasyfork.org/scripts/499991/Page%20Border%20Remover%20mangapillcom.user.js
// @updateURL https://update.greasyfork.org/scripts/499991/Page%20Border%20Remover%20mangapillcom.meta.js
// ==/UserScript==

let arr = document.getElementsByClassName("border-border");
for (let index = 0; index < arr.length; index++) {
    if (index > 5 && index % 2 == 0){
        arr[index].innerHTML = "";
    }
}