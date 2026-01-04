// ==UserScript==
// @name			★Timer with MILISECONDS! 202s!
// @version			1.0
// @description		Timer!
// @author			xPlasmicc
// @match			*://moomoo.io/*
// @grant			none
// @namespace       https://greasyfork.org/en/users/855407-xplasmicc
// @license         none
// @downloadURL https://update.greasyfork.org/scripts/437875/%E2%98%85Timer%20with%20MILISECONDS%21%20202s%21.user.js
// @updateURL https://update.greasyfork.org/scripts/437875/%E2%98%85Timer%20with%20MILISECONDS%21%20202s%21.meta.js
// ==/UserScript==

var startTime = Date.now();

var interval = setInterval(function() {
    var elapsedTime = Date.now() - startTime;
    document.getElementById("timer").innerHTML = (elapsedTime / 1000).toFixed(3);
}, 100);