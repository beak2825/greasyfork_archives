// ==UserScript==
// @name         Speedy | Krunker Theme
// @namespace    http://tampermonkey.net/
// @version      5
// @description  Krunker Theme
// @author       Speedy
// @match        https://krunker.io/*
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.0.0-alpha1.min.js
// @icon         https://i.ibb.co/svzZ1BZ/Speedy-icon.png
// @require      http://code.jquery.com/jquery-3.2.1.slim.min.js
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://greasyfork.org/scripts/372672-everything-hook/code/Everything-Hook.js?version=784972
// @include      /^(https?:\/\/)?(www\.)?(.+)krunker\.io(|\/|\/\?(server|party)=.+)$/
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/406854/Speedy%20%7C%20Krunker%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/406854/Speedy%20%7C%20Krunker%20Theme.meta.js
// ==/UserScript==

document.title = "• Aurora Community";

var color = "#fc03ec";

GM_addStyle(`
.menuItem .menuItemIcon, .menuItem .menuItemTitle, .headerBar div, #instructions,.chatItem, #chatInput, #streamContainer, .blackShad, .terms, #mapInfo {
   color: ${color};
}
.menuItem:hover, .menuItemIcon:hover {
   background: ${color};
   color: #fff;
}
#subLogoButtons>.button, #customizeButton {
   background: ${color};
   box-shadow: none;
}
#subLogoButtons>.button:hover, #customizeButton:hover {
   background: #fff;
   color: ${color};
}
.buttonG {
   background-color: ${color};
   box-shadow: inset 0 -7px 0 0 #008b00!important;
}
`);