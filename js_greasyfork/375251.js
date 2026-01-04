// ==UserScript==
// @name         Dark Blue Messenger Theme
// @namespace    http://tampermonkey.net/
// @version      1.1.8
// @description  Dark blue theme for facebook messenger in browser
// @author       damakuno
// @match        https://www.facebook.com/messages/*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375251/Dark%20Blue%20Messenger%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/375251/Dark%20Blue%20Messenger%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = `
@namespace url(http://www.w3.org/1999/xhtml);
* {

}

body {
    color: #fbfdff !important;
}

h1, h2, h3, h4, h5, h6 {
    color: #8eb4ff !important;
}

._5iwm ._58al {
    background-color: #1970eca1; !important;
}

::placeholder {
   color: #ffffff !important;
}

a {
    color: #8ab2ff !important;
}

a._4ce_ {

}

a._4rv6 {

}

._4sp8 {
   background-color:#002040 !important;
}

._1ht6 {
    color: rgb(124, 213, 249) !important;
}

._2v6o, ._5eu7, ._6krh {
    color: rgba(255, 255, 255, 0.6) !important;
}

._3eus, ._5uh {
    color: rgba(255, 255, 255, 0.6) !important;
}

._3szq {
    color: rgb(193, 228, 255) !important;
}

._1ht7 {
    color: rgba(255, 255, 255, 0.4) !important;
}

._1lj0 {
    color: rgba(255, 255, 255, 0.7) !important;
}

._497p {
    color: rgba(255, 255, 255, 0.65)  !important;
}

._aou {
    background: #ff7dfa4f !important;
}

._4kf5 {
    background: #ff7dfa00 !important;
}

/*text messages*/
._wu0 {
    background: #1b2548;
    border: 1px solid #6da9ff;
}

._43by {
    background-color: #005bde !important;
    color: rgba(255, 255, 255, 1) !important;
}

._3erg ._hh7 {
    background-color: #005bde !important;
    color: rgba(255, 255, 255, 1) !important;
}
._hh7._2f5r, ._hh7:active._2f5r, ._-5k ._hh7._2f5r, ._6q1a ._hh7._2f5r, ._6q1a ._hh7:active._2f5r, ._6q1a ._-5k ._hh7._2f5r {
    background: none !important;
}

._53ij {
    background: #02af78a3 !important;
}

/* embeds */
._5i_d .__6k {
    color: rgba(255, 255, 255, 0.9) !important;
}

._5i_d .__6m {
    color: rgba(255, 255, 255, 0.4) !important;
}

/* chat attachments */

._4_j4 .chatAttachmentShelf {
    background-color: #213774  !important;
}

.__6l {
    color: #d9e5ffc9 !important;
}

.__6k {
    color: #ffffff !important;
}

/*._kmc {
    overflow-y: hidden !important;
}*/

/* left-side-bar */
._1ht3 ._1htf {
    color: rgb(255, 255, 255) !important;
}

._225b {
    color: rgba(255, 255, 255, .60) !important;
}

._364g {
    color: rgba(255, 255, 255, 0.7) !important;
}

._3q34 {
    color: rgba(255, 255, 255, 0.8) !important;
}

._3q35 {
    color: rgba(255, 255, 255, 0.4) !important;
}

._4gd0 {
    background-color: #002040 !important;
}

.clearfix_17pz {
    background-color: #002040 !important;
}

/*hidden menus right bar*/
._4eby {
    background: #516cf800 !important;
}

/*._59s7 {
    background-color: #85c0ffad !important;
}*/
._3quh {
    color: #ffffff !important;
}
._2c9i ._19jt {
    color: rgba(255, 255, 255, 0.75) !important;
}

/*._59s7 {
    background-color: #00ffd9 !important;
}*/
._59s7 {
    background-color: #0b2497 !important;
}

._374c {
    color: rgba(255, 255, 255, 0.9) !important;
}

._4ng2 {
    color: rgb(255, 255, 255) !important;
}

/* hidden search bar */
._33p7 {
    background-color: rgb(0, 37, 116) !important;
}

/* page top */
._36zg {
    color: rgba(255, 255, 255, 0.9) !important;
}

._1n-e {
    color: rgba(255, 255, 255, 0.8) !important;
}

/* top plan bar */
._3nta {
    background-color: #48a9f9 !important;
}

._2n3u {
    color: rgb(255, 255, 255) !important;
}

/* image previews */
._58al,._2y8z {
    color: rgba(255, 255, 255, 0.8) !important;
}
._2y8_ {
    background-color: #00598b !important;
}
._14-8 {
    background: #130364 !important;
}
._14-9 {
    color: #add7ff !important;
}

._5irm._7mkm {
    background: #002040 !important;
}

._7mkk._7t1o._7t0e {
    background: #002040 !important;
}
._7mkk._7t1o._7t0j {
    background: #002040 !important;
}

._4k7a {
    color: rgba(249, 249, 249, 0.5) !important;
}

._3egs {
    background: #002040 !important;
}

._2f5n {
    background-color: #002040 !important;
}

.__6j._43kk {
    border-bottom: 6px solid #ffffff10;
    border-left: 10px solid #ffffff10;
    border-right: 10px solid #ffffff10;
    border-top: 6px solid #ffffff10;
}
`
;
//#7dffb2
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        heads[0].appendChild(node);
    } else {
        // no head yet, stick it whereever
        document.documentElement.appendChild(node);
    }


window.onload = function() {
    /*
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    //link.href = 'http://www.stackoverflow.com/favicon.ico';
    link.href = 'http://www.stackoverflow.com/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
    */
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.ctrlKey && evt.keyCode == 90) {
            (function(){
                let sticker_button = document.querySelector('div._4rv4 > ul > li:nth-child(2) > a')
                if (sticker_button) sticker_button.click();
                sticker_button = document.querySelector('a[title="Choose a sticker"]');
                if (sticker_button) sticker_button.click();
                waitForKeyElements('a[aria-label="BugCat Capoo"]', function() {document.querySelector('a[aria-label="BugCat Capoo"]').click();});
                waitForKeyElements('div[aria-label="BugCat Capoo crying, cat crying sticker"]', function() {document.querySelector('div[aria-label="BugCat Capoo crying, cat crying sticker"]').click();});
            })();
        }
    };
}
//setTimeout(function() { document.querySelector('a[aria-label="BugCat Capoo"]').click(); }, 1000);
//setTimeout(function() { document.querySelector('div[aria-label="BugCat Capoo crying, cat crying sticker"]').parentElement.click();} , 1800);
// waitForKeyElements ('.AdaptiveMedia-container img', function() {});




    function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

})();