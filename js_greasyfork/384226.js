// ==UserScript==
// @name         Fucking New College English
// @namespace    http://magwer.net/
// @version      0.5
// @description  Easy college!
// @author       Mag_wer
// @match        http://10.120.48.47/npels/studentdefault.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384226/Fucking%20New%20College%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/384226/Fucking%20New%20College%20English.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function clickTask() {
        MainFrameClick();
        var divs = document.getElementsByClassName("tbox");
        if (!divs || divs.length != 1)
            return;
        var tbox = document.getElementsByClassName('tbox')[0];
        var display = tbox.style.display;
        if (display !== "none") {
            TINY.box.hide();
            console.log("Frame closed!");
        }
    }
    console.log("Now fucking New College English...");
    setInterval(clickTask, 2000);
})();