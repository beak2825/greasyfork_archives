// ==UserScript==
// @name Darker ExHentai
// @namespace https://greasyfork.org/users/707017
// @version 0.0.1
// @description Dark css for exhentai + Better Gallery Viewer
// @grant GM_addStyle
// @run-at document-start
// @match *://*.exhentai.org/*
// @downloadURL https://update.greasyfork.org/scripts/416892/Darker%20ExHentai.user.js
// @updateURL https://update.greasyfork.org/scripts/416892/Darker%20ExHentai.meta.js
// ==/UserScript==

(function() {
let css = `
/* Main Colors */
:root {
    --Text-Color: #acacac;
    --Background-darker: #000;
    --Background-dark: #1a1a1a;
    --Background-light: #121212;
    --Background-lighter: #262626;
}

/* Main Background color */
body {
    background: var(--Background-darker);
}
/* Browsing page */
.gld {
    border: none;
}
div.ido {
    background: var(--Background-lighter);
}
div.itg {
    border: 1px solid #000;
}
.gl1t:nth-child(2n+1), .gl1t:nth-child(2n+2) {
    background: #00000029;
}

/* TEXT */
body {
    font-size: 8pt;
    font-family: arial,helvetica,sans-serif;
    color: var(--Text-Color);
}




/* Titles*/
div.gm,div#gd2 {
    background: var(--Background-darker);
}
div#gmid {
    background: var(--Background-light);
}


/* Tags : Language - Artist - Misc */
div.gt {
    border-radius: 4px;
    border: 1px solid #000;
    background: #422d2d;
}
/* Tags : Parody - Female - Male */
div.gtw {
    border-radius: 4px;
    border: 1px solid #000;
    background: #592626;
}

/* Gallery */
div#gdt {
    background: var(--Background-light);
    border: 1px solid var(--Background-lighter);
    text-align: left;
    min-width: 720px;
    max-width: 1200px;
    margin: 0 auto;
    clear: both;
    padding: 5px;
    
}

/* Image Viewer */
div.sni {
    background: var(--Background-light);
    border: 1px solid #000000;
    text-align: center;
    margin: 0px auto 0px;
    padding: 0 0px 0px;
}
div.sni img{
    max-height: 100vh !important;
    width: auto !important;
    margin: 0px auto 0px;
    padding: 0 0px 0px;
}

/* side nav */
div#i4{
    display:none;
}
Div#i2{
    position:fixed !important;
    top:10px !important;
    left: 50%;
}

div.sb{
    position:fixed;
    bottom:5px;
    left: 50%;
}
/* bottom image viewer downloads and other misc things */
div.if, div.dp{
    display:none;
}

div.sni h1{
    display:none;
}


/* width */
::-webkit-scrollbar {
  width: 2px;
  height: 0px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #0000; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #131313;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #aaaaaa; 
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
