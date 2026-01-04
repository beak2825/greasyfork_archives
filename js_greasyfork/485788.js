// ==UserScript==
// @name        Outlook 365 change colour of mouse-hover email and selected email
// @namespace   english
// @description Changes the colour of the email that your mouse cursor is hovering over, as well as the colour of a selected email
// @match        https://outlook.office365.com/*
// @match        https://outlook.office.com/*
// @version     1.9
// @run-at      document-end
// @author      chaoscreater
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/485788/Outlook%20365%20change%20colour%20of%20mouse-hover%20email%20and%20selected%20email.user.js
// @updateURL https://update.greasyfork.org/scripts/485788/Outlook%20365%20change%20colour%20of%20mouse-hover%20email%20and%20selected%20email.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
    /* Changes the background color to gray when hovering over email items */
    .xc0ZS.JtO0E:hover {
        background-color: #808080 !important; /* gray color */
    }

    /* Changes the background color to dark blue for selected email items */
    .jGG6V[aria-selected="true"] .xc0ZS.JtO0E {
        background-color: #11528a !important; /* Dark blue color */
    }

    /* Sets the loading screen background to a dark gray */
    #loadingScreen {
        background-color: #2b2b2b; /* Dark gray color */
    }

    .jGG6V[aria-selected="true"] .zwF6Z.gaDEX .ms-Button,
    .jGG6V[aria-selected="true"] .fne0op0.fg4l7m0.fmd4ok8.f1sxfq9t
    {
        color: #fff !important; /* White color for high contrast */
    }

    /* Changes text color to white (email body description) only when email is selected */
    .xc0ZS.JtO0E:hover .gy2aJ.U2XB8,
    .xc0ZS.JtO0E:hover .FqgPc.gy2aJ.U2XB8,
    .jGG6V[aria-selected="true"] .xc0ZS.JtO0E .gy2aJ.U2XB8,
    .jGG6V[aria-selected="true"] .xc0ZS.JtO0E .FqgPc.gy2aJ.U2XB8,
    .jGG6V[aria-selected="true"] .YkUu6.YhfbB.i1OgB.mSZDy .bUGtK,
    .jGG6V[aria-selected="true"] ._rWRU.U2XB8.qq2gS.cbNn0,
    .jGG6V[aria-selected="true"] .wUZqD.x8t0i {
        color: #fff !important; /* White color for high contrast */
    }

    /* Changes the color of the time display and certain text elements to light blue */
    .xc0ZS.JtO0E:hover ._rWRU.U2XB8.qq2gS.D8iyG,
    .jGG6V[aria-selected="true"] .xc0ZS.JtO0E ._rWRU.U2XB8.qq2gS.D8iyG {
        color: #fff !important; /* White color for visibility */
    }

    /*
    // Email sender name
    .jGG6V[aria-selected="true"] .W3BHj.gy2aJ.Dc0o9.U2XB8,
    */
    .jGG6V[aria-selected="true"] .IjzWp.xc0ZS.gy2aJ.U2XB8 {
        // color: #54d0ec !important; /* Light blue color for distinct appearance */
        color: #00FFFF !important;
    }


    /* Changes the color of the calendar occurrence text to white for readability */
    div.PHmmX.lm1q3.sqQsa.ivPEU .bUGtK {
        color: #fff !important; /* White color for clear visibility */
    }
`;
document.getElementsByTagName('head')[0].appendChild(style);