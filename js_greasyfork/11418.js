// ==UserScript==
// @name         LimeLight fix
// @namespace    http://nkws.pl
// @version      0.1
// @description  Fix for the LimeLight board
// @author       Trusted - http://limelightgaming.net/index.php?action=profile;u=80
// @match        *://limelightgaming.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11418/LimeLight%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/11418/LimeLight%20fix.meta.js
// ==/UserScript==
function init() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "http://nkws.pl/lime.js";
    var head = document.getElementsByTagName('head')[0];
    if(head) head.appendChild(script);
}
init();