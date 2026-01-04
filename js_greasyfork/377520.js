// ==UserScript==
// @name         Pewdiepie Subbot
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/user/PewDiePie
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377520/Pewdiepie%20Subbot.user.js
// @updateURL https://update.greasyfork.org/scripts/377520/Pewdiepie%20Subbot.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let button = document.getElementsByClassName("ytd-subscribe-button-renderer")[0];
    let property = "subscribed";
    if(button.hasAttribute(property)){}
else
{
    button.click();
}
})();