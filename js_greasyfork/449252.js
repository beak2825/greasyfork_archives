// ==UserScript==
// @name Incestflix Better Layout
// @namespace github.com/openstyles/stylus
// @version 0.0.2
// @description Maybe delete you browsing history when your done.
// @author UglyBoi
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.incestflix.org/*
// @downloadURL https://update.greasyfork.org/scripts/449252/Incestflix%20Better%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/449252/Incestflix%20Better%20Layout.meta.js
// ==/UserScript==

(function() {
let css = `
  
    :root {
    --scrollbar-background: #960000;
    --blue-night: #acacac;
    --red-day: #F8333C;
    --red-night: #3e0a0d;
    --green-day: #28B75C;
    --green-night: #591818;
    }
    #incflix-bodywrap {
    max-width: none;
    text-align: center;
    }
    #photos .img-overflow{
    margin: 1px;
    width: 445px !important;
    height: 250px!important;
    }
    #incflix-indexwrap {
    max-width: none;
    text-align: center;
    }
    #tables {
    text-align: left;
    padding: 0em 0.5em;
    max-width: none;
    }
    body > center:nth-child(4){
    display:none;
    }
    #incflix-header{
    position:absolute;
    top:-75px;
    }
    [class=headerlogo]{
    position:absolute;
    top:70px;
    left:0px;
    transform: scale(0.5);
    }
    #tagline{
    display:none!important;
    }
    #videotags {
    width: 100%;
    margin-top: 0em;
    text-align: left;
    }  
/* ============ SCROLLBAR ============ */
/* Sizing */
    ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
    }

/* Track */
    ::-webkit-scrollbar-track {
      background: #c6c6c600;
    }
/* Track on hover */
    ::-webkit-scrollbar-track:hover {
      background: #c6c6c6;
    }
/* Handle */
    ::-webkit-scrollbar-thumb {
        background: var(--scrollbar-background);
    }
/* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: #171717; 
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
