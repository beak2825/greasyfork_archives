// ==UserScript==
// @name         Newpunch visual coin progress
// @namespace    https://greasyfork.org/en/scripts/369744-newpunch-visual-coin-progress
// @version      1.04
// @description  shows a cute progress bar behind your coin count thing
// @author       0xbbadbeef(Exploderguy)
// @match        https://forum.facepunch.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/369744/Newpunch%20visual%20coin%20progress.user.js
// @updateURL https://update.greasyfork.org/scripts/369744/Newpunch%20visual%20coin%20progress.meta.js
// ==/UserScript==

(function() {
    var coinElement = $("a[href='/user/shop']");

    if (!coinElement.length) return;

    var strProgress = coinElement.prop("title");
    var numProgress = strProgress.substr(strProgress.length - 3);

    //awfully dark/white/whatever
    var useColour = ($("div#toolbar").css("background-color") == "rgb(87, 33, 33)") ? "#6d5414" : "#a9b1bc";

    coinElement.prepend("<div id='coinProgress'></div>");
    $("div#coinProgress").css({
        "height" : numProgress,
        "background-color" : useColour,
        "position" : "absolute",
        "bottom" : "0px",
        "width" : "100%",
        "border-top": "1px solid black",
        "border-top-style" : "dashed",
        "z-index": "-1"
    })
    coinElement.css({
        "border" : "1px solid black"
    });
})();