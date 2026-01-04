// ==UserScript==
// @name animevost.org dark
// @namespace animevost.org
// @version 0.1.1
// @description https://animevost.org/ dark style
// @author Tony 0tis
// @license Apache-2.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.animevost.org/*
// @downloadURL https://update.greasyfork.org/scripts/504014/animevostorg%20dark.user.js
// @updateURL https://update.greasyfork.org/scripts/504014/animevostorg%20dark.meta.js
// ==/UserScript==

(function() {
let css = `
*{
    background-color: #222222 !important;
    color: #c5c5c5 !important;
    border-color: #555555 !important;
}
input{
    background: #000000 !important;
}
a{
    color: #b3a010 !important
}
.menu{
    background-image: none !important;
    background-color: #000000 !important;
}
.shortstory{
    background-color: #444444 !important;
    background-image: none !important;
    box-shadow: 0px 1px 1px 1px #000000 !important;
}
div.interDubBgTwo h2, #shortstoryContentTegi, .butt, .epizode, .prev, .next, .fastPunkt, .modeKino, .bottomProblem, .ca-nav-prev>img, ca-nav-next>img, .shortstoryFuter form a, #rulesComment, .interDubBg, .imgOngoing img{
    background-image: none !important;
}
.butt, .epizode, .prev, .next, .close{
    background-color: #000000 !important;
    color: #b3a010 !important;
}
.prev:before, .next:before{
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 150%;
}
.prev:before{
    content: '<';
}
.next:before{
    content: '>';
}
.close:before{
    content: 'x';
    left: 0px;
    top: -7px;
    position: absolute;
    font-size: 150%;
}
.epizode.active{
    background-color: #3d3c3c !important;
background-image: none !important;
}
.ca-nav-prev>img, .ca-nav-next>img{
    filter: grayscale(1) brightness(0.7);
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
