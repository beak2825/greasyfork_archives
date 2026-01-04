// ==UserScript==
// @name         binameplate Userscript
// @namespace    binameplateUserscript
// @version      0.1
// @description  Userscript to change the width of the flash element that passes data to the flash element that shows the preview. You might have to visit the page as https in order for this to work. I know this is dumping errors into the log, i am hoping that they will fix the site and this script wont be needed
// @author       RickZabel
// @match          http://www.binameplate.com/*
// @match          https://www.binameplate.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377628/binameplate%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/377628/binameplate%20Userscript.meta.js
// ==/UserScript==

/* global $, W, I18n */


(function() {
    function Startcode() {
        setTimeout(Startcode, 500); //run init for adding tab
        $('body > div:nth-child(8) > embed').width("23")
    }
    setTimeout(Startcode, 1000);
})();