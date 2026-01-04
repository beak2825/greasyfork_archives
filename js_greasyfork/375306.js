// ==UserScript==
// @name         Minimalist Dark Blue Messenger Terminal Theme
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Dark blue theme styled like a terminal for facebook messenger in browser
// @author       damakuno
// @match        https://www.facebook.com/messages/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375306/Minimalist%20Dark%20Blue%20Messenger%20Terminal%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/375306/Minimalist%20Dark%20Blue%20Messenger%20Terminal%20Theme.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var css = `
@namespace url(http://www.w3.org/1999/xhtml);
* {

}

/* header */
#pagelet_bluebar {
    display: none;
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
._43by {
    background-color: #005bde00 !important;
    color: rgba(255, 255, 255, 1) !important;
}

._3erg ._hh7 {
    background-color: #005bde00 !important;
    color: rgba(255, 255, 255, 1) !important;
    margin-left: 5px !important;
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

/* left bar */

div._4ldz {
    height: 0px !important;
    width: 0px !important;
}
div._55lt img{
    display: none !important;
}

div._4ldz:before {
    position: absolute;
    content: attr(data-tooltip-content);
    font-size: 12px;
    top: -21px;
}

div._4ld- img {
    display: none !important;
}

._2j6 {
   display: none !important;
}

._1enh {
    max-width: 10px !important; /* Put some width to hover on. */
    min-width: 10px !important; /* Put some width to hover on. */
}

/* ON HOVER */
._1enh:hover{
    max-width: 420px !important;
}

/* right bar */
._4_j5 {
    max-width: 10px !important; /* Put some width to hover on. */
    min-width: 10px !important; /* Put some width to hover on. */
}

._4_j5:hover {
    max-width: 420px !important;
}

`
;
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


/*window.onload = function() {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    //link.href = 'http://www.stackoverflow.com/favicon.ico';
    link.href = 'http://www.stackoverflow.com/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
}
*/

})();