// ==UserScript==
// @name         hub moomooio game name style
// @version      1
// @description  changes the style of moomooio game name
// @author       Nuro#9999
// @match        *://*.moomoo.io/*
// @run-at        document-start
// @license MIT 
// @namespace https://greasyfork.org/users/761829
// @downloadURL https://update.greasyfork.org/scripts/446324/hub%20moomooio%20game%20name%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/446324/hub%20moomooio%20game%20name%20style.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById("gameName").outerHTML='<div id="gameName" style="padding: 40px;">\n   <span style="text-shadow: none">Moo</span><span style="text-shadow: none;color: black;background: url(&quot;https://htmlcolorcodes.com/assets/images/colors/orange-color-solid-background-1920x1080.png&quot;);border-radius: 60px;background-size: 300px 100px;">Moo</span>\n</div>';
});