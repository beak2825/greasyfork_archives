// ==UserScript==
// @name           Disable middle mouse button scrolling
// @description    Prevents unintentional scrolling when opening a link in a new tab with middle mouse button
// @version        20240913
// @author         mykarean
// @icon           https://cdn-icons-png.flaticon.com/128/12640/12640098.png
// @source         https://superuser.com/questions/44418/how-to-disable-the-middle-button-scrolling-in-chrome
// @match          *://*/*
// @grant          none
// @run-at         document-idle
// @compatible     chrome
// @license        GPL3
// @noframes
// @namespace https://greasyfork.org/users/1367334
// @downloadURL https://update.greasyfork.org/scripts/508414/Disable%20middle%20mouse%20button%20scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/508414/Disable%20middle%20mouse%20button%20scrolling.meta.js
// ==/UserScript==
 
 
document.addEventListener("mousedown", function(mouseEvent) {
    if (mouseEvent.button != 1) return;
 
    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();
}, true);