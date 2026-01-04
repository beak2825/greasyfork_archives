// ==UserScript==
// @name         FusionFall Universe Forums Widescreen
// @namespace    time to take a
// @version      1.0.1
// @description  The forums now use 90% of the screen.
// @author       Superstarxalien
// @match        https://www.forums.fusionfalluniverse.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370922/FusionFall%20Universe%20Forums%20Widescreen.user.js
// @updateURL https://update.greasyfork.org/scripts/370922/FusionFall%20Universe%20Forums%20Widescreen.meta.js
// ==/UserScript==

(function() {

    function widescreenAmIDoingThisRight()
    {
        var forum = document.getElementsByTagName("div");
        var forumContent = document.getElementById("wrapper");
        forum[7].style.width = "100%";
        forum[7].style.maxWidth = "90%";
        forumContent.style.width = "100%";
        //header screen fix
        forum[4].style.width = "100%"
        forum[4].style.maxWidth = "90%"
        forum[5].style.width = "100%"
        forum[5].style.maxWidth = "90%"
        forum[5].style.marginLeft = "0px"
    }
    widescreenAmIDoingThisRight();
    //css fix so the main page doesn't look ugly
    var css =
        `
        table.table_list{ width: auto; padding-right: 10px;}
        `;
    var head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet)
    {
        style.styleSheet.cssText = css;
    }
    else
    {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);

})();