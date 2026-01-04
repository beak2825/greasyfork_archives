// ==UserScript==
// @name         Close Zoom Tabs!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  make you not have to click the button to close like 100 zoom tabs that get opened every day!
//               especially now that chrome has re-added the checkbox to auto-open zoom, this makes it a 0-effort
//               process - to click a zoom link, then just click the "join with video" button.  
//               Note:  If your company has a custom zoom domain, you may need to add a second @match line for it
//               e.g., https://mycompany.zoom.us/j/*
// @author       Darin Kelkhoff
// @match        https://zoom.us/j/*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/407903/Close%20Zoom%20Tabs%21.user.js
// @updateURL https://update.greasyfork.org/scripts/407903/Close%20Zoom%20Tabs%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function makeTransparent(selector)
    {
        try // try, in case element isn't found in dom
        {
            document.querySelector(selector).style.background = "transparent";
        }
        catch(e) {}
    }

    function fadeToBlack()
    {
        console.log("starting fade to black");
        makeTransparent('#header_container');
        makeTransparent('[role="main"]');
        makeTransparent('#zoom-ui-frame');

        document.querySelector('body').style.transition = "all 4s linear";
        document.querySelector('body').style.backgroundColor = "black";
    }

    function close()
    {
        console.log("time to close the zoom window now");
        window.close();
    }

    setTimeout(fadeToBlack, 1000); // wait a second for elements to be in dom
    setTimeout(close, 5*1000); // wait a few seconds, to make sure zoom opened.

})();