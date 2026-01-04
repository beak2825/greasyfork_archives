// ==UserScript==
// @name     Custom SchoolLoop
// @version  1
// @grant    none
// @include https://*.schoolloop.com/* 
// @description Injects custom CSS on any Schoolloop portal
// @namespace https://greasyfork.org/users/161237
// @downloadURL https://update.greasyfork.org/scripts/38099/Custom%20SchoolLoop.user.js
// @updateURL https://update.greasyfork.org/scripts/38099/Custom%20SchoolLoop.meta.js
// ==/UserScript==
function addCss(cssString) {
var head = document.getElementsByTagName('head')[0];
var newCss = document.createElement('style');
newCss.type = "text/css";
newCss.innerHTML = cssString;
head.appendChild(newCss);
} // CSS Injector
addCss (
'#container_header_links { background-color: #bb4a4a !important; } .icon_settings2 { border-left: 0 !important; } .link_block_sm { border-right: 0 !important; } #container_header_top a, .red { color: white; } .header_icons a { color: #bb4a4a !important; } .header_icons a:hover { background-color: rgba(135, 157, 252, 0.5) !important; } a.icon_calendar:hover { border-radius: 0 3px 3px 0 !important; } a.icon_locker:hover, a.icon_dropbox:hover { border-radius: 0 !important; } a.icon_mail:hover { border-radius: 3px 0 0 3px !important; } .header_icons { background: none !important; background-color: rgb(242, 240, 233) !important; }'
); // Injects custom CSS on any Schoolloop portal