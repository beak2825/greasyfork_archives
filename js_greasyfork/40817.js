// ==UserScript==
// @name        Mind42.com no ads
// @author      Asim0
// @version	0.8
// @description Simple ad remover!
// @include     http://mind42.com*
// @include     https://mind42.com*
// @grant          GM_addStyle
// @namespace https://greasyfork.org/users/180782
// @downloadURL https://update.greasyfork.org/scripts/40817/Mind42com%20no%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/40817/Mind42com%20no%20ads.meta.js
// ==/UserScript==

var overrideCSS = " \
#sidebar { display: none; } \
#content.sidebar2 { margin-right: 0; } \
#topbar .logo .icon { background-position: -260px -60px; } \
#topbar .button.help .icon { background-position: -40px -20px; } \
#topbar { width: 400px; background: linear-gradient(to bottom, #ffffffa6 0%,#d0d4dbb0 100%); color: #8d939b; border: 1px solid #c9ced6; border-radius: 4px; } \
#statusbar { width: 320px; background: linear-gradient(to bottom, #ffffffa6 0%,#d0d4dbb0 100%);} \
#editmenu { margin: unset; position:absolute; right:0; top:0; } \
#birdview { top: 0px; right: 504px; background: linear-gradient(to bottom, #ffffffa6 0%,#d0d4dbb0 100%);} \
#canvas { background: white; } \
";
GM_addStyle(overrideCSS);