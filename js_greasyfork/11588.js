// ==UserScript==
// @name         NGU Beta
// @version      0.1
// @author       SonOfABeach
// @match        http://www.nextgenupdate.com/*
// @description  NGU Beta 1
// @grant        none
// @namespace https://greasyfork.org/users/14125
// @downloadURL https://update.greasyfork.org/scripts/11588/NGU%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/11588/NGU%20Beta.meta.js
// ==/UserScript==

if (window.location.href.indexOf("beta=1") == -1)
{
    if (window.location.href.indexOf("=") == -1)
        window.location.replace(window.location.href + "?beta=1");
    else
        window.location.replace(window.location.href + "&beta=1");
}