// ==UserScript==
// @name Yahoo Mail - New Design [2025.07] (USw) v.76
// @namespace https://greasyfork.org/en/users/8-decembre
// @version 76.0.0
// @description For Yahoo New Mail (2027.7)
// @author decembre
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.mail.yahoo.com/*
// @downloadURL https://update.greasyfork.org/scripts/412940/Yahoo%20Mail%20-%20New%20Design%20%5B202507%5D%20%28USw%29%20v76.user.js
// @updateURL https://update.greasyfork.org/scripts/412940/Yahoo%20Mail%20-%20New%20Design%20%5B202507%5D%20%28USw%29%20v76.meta.js
// ==/UserScript==

(function() {
let css = `

/* 0- Yahoo Mail - New Design [2025.07] (USw) v.76 (new76) NEWDESIGN */

/* PREV VERSION ERREUR 2027 - since last @version   20271020.10.41 - Increment 1020 Jusqu'a 202711 */

/* SUPP */
#mail-reader-container  + div[data-test-id="leaderboard-ad"] ,
a[href^="https://api.taboola.com/2.0/json/yahoo-mail/recommendations.notify-click?"] ,
.ybar-menu-hover-open #ybar-inserted-content ,
li[style="top: 0px;"] [aria-labelledby="list.banner-cue-title"] {
    display: none !important;
}

/* SPAM TO PROOF */
[class*="elementToProof"] ~ div:has(font) font,
[class*="elementToProof"]{
  font-family: Calibri, Helvetica, sans-serif;
  font-size: 12pt;
  color: red !important;
}
/* SPAM TO PROOF - INDICATOR */
[class*="elementToProof"]:before {
    content: "Spam ?" !important;
    position:  fixed  !important;
    display: inline-block !important;
    top: 8vh !important;
    left: -2% !important;
    padding: 2px 20px  !important;
    font-size: 18pt;
    border-radius: 5px  !important;
    transform: rotate(-90deg) !important;
    z-index: 500 !important;
  color: white !important;
background: red !important;
} 
/* REPLY */
#compose-styler [class*="elementToProof"]:before {
    content: "Spam ?" !important;
    position:  fixed  !important;
    display: inline-block !important;
    top: 12vh !important;
    left: unset !important;
    padding: 2px 20px  !important;
    font-size: 18pt;
    border-radius: 5px  !important;
    transform: unset !important;
    z-index: 500 !important;
  color: white !important;
background: red !important;
} 


/* (new74) EMAIL OPEN - TOP TOOLBAR SMALL */
#message-group-view > div[data-test-id="message-toolbar"]{
    display: flex;
    max-height: 3vh !important;
    min-height: 3vh !important;
    margin: 0 0px 0 0 !important;
    padding: 0 0 0 0 !important;
/*border: 1px solid red !important;*/
}

/* TEST - MAIL - UNREAD - INDICATOR */
[data-test-id="virtual-list-container"] [role="list"]  li:has([id^="unread-message-status-"]):has([id^="email-snippet-"]) {
    position: absolute;
    background: #022d24  !important;
/*border-right: 3px dashed red !important;*/
}
[data-test-id="virtual-list-container"] [role="list"]  li:has([id^="unread-message-status-"]):has([id^="email-snippet-"])  span[id^="unread-message-status-"].sr-only.sr-only {
    position: absolute;
    clip: unset !important;
    height: 8px;
    width: 8px;
    left: 10px !important;
    top: auto;
    margin: 0;
    padding: 0;
    white-space: nowrap;
    font-size: 0 !important;
    overflow: hidden;
    border-radius: 100% !important;
background: red  !important;
}


/* (new74) MSG - EMAIL DELETED */
[role="status"][aria-live="polite"]:not(:empty) > div {
    position: fixed  !important;
    top: 5vh !important;
    margin: 0 0px 0 0 !important;
    padding: 1px 5px !important;
    border-radius: 3px !important;
/*background: green !important;*/
/*border: 1px solid red !important;*/
}
#Atom .group:hover > .group-hover-flex {
    position: absolute !important;
    display: flex !important;
border: 1px solid red !important;
}

[data-test-id="virtual-list-container"] li:hover > div > div:has(span[role="checkbox"]) {
    width: auto !important;
    padding: 0px !important;
    border-radius : 5px 0 0 5px !important;
border: 1px solid red !important;
}

/* (new74) YAHOO RAPEL- INDICATOR */
[data-test-id="virtual-list-container"] li:has([title="Yahoo rappel"]) [id^="email-subject-"]:before {
    content: "⏰" !important;
    margin: 0 20px 0 0 !important;
    padding: 1px 5px !important;
    border-radius: 3px !important;
background: green !important;
}

/* MOVE MAILS TO TOP WHEN PUBS DELETED - top: 200px; */
li[style="top: 0px;"]:has([aria-labelledby="list.banner-cue-title"]) ~ li {
    margin-top: -200px !important;
}


/* POPUP HEIGH compact */
.pointer-mode [data-test-id="popover-content"] ul ul {
    max-height: 60vh !important;
}
.pointer-mode [data-test-id="popover-content"] ul ul li [data-test-id="focus-group"] > div{
    display: flex;
    height: 24px;
    padding: 0 5px !important;
}

/* POPUP - CHOOSE CONTACT */

[data-test-id="portal-layer"] #typeahead-list-to.select-dropdown[role="listbox"] li:hover .group-hover-flex {
    display: block !important;
    left: 1% !important;
    padding: 3px  !important;
    border-radius: 100% !important;
    transform: scale(0.8) !important;
background: #aa7070 !important;
    border: none !important;
/*border: 1px solid lime !important;*/
}


/* POPUP - CREATE MAIL - FORMAT TOOLBAR */
[data-test-id="popover-content"]:has([role="toolbar"]){
    
    top: unset !important;
    bottom: 4vh !important;
    left: 30% !important;
    width: auto !important;
    padding: 0px !important;
    border-radius : 5px !important;
border: 1px solid lime !important;
}

/* POPUP- TRIER */ 
[data-test-id="popover-content"]:has([data-test-id="popover-inner-content"]):has([data-test-id="sort-and-filter-menu"]){
    width: auto !important;
    padding: 0px !important;
    border-radius : 5px !important;
border: 1px solid red !important;
}
[data-test-id="popover-content"] [data-test-id="popover-inner-content"]{
    width: auto !important;
    min-width: 100% !important;
    padding: 0px !important;
    border-radius : 5px !important;
/*border: 1px solid yellow !important;*/
}
[data-test-id="popover-content"] [data-test-id="sort-and-filter-menu"] {
    width: auto !important;
    padding: 5px !important;
    border-radius : 5px !important;
/*border: 1px solid green !important;*/
}
[data-test-id="popover-content"] [data-test-id="sort-and-filter-menu"]  [data-test-id="selectbox-input"] {
    width: 100% !important;
/*border: 1px solid aqua !important;*/
}
[data-test-id="popover-content"] [data-test-id="sort-and-filter-menu"]  [data-test-id="selectbox-input"] [data-test-id="popover-container"] {
    width: 100% !important;
/*border: 1px dashed red !important;*/
}
[data-test-id="popover-content"] [data-test-id="sort-and-filter-menu"]  [data-test-id="selectbox-input"] [data-test-id="popover-container"] [data-test-id="select-box"] {
    width: 100% !important;
/*border: 1px dashed yellow !important;*/
}
[data-test-id="popover-content"] [data-test-id="sort-and-filter-menu"]  [data-test-id="selectbox-input"] [data-test-id="popover-container"] [data-test-id="select-box"] > [aria-label] {
    width: 100% !important;
/*border: 1px dashed yellow !important;*/
}



/* (new74) EMAIL RESUME */
[role="list"] li [id^="email-snippet-"] {
    opacity: 0.2 !important;
    transition: opacity ease 0.7sec !important;
}


/* HOVER on line */
[role="list"] li:hover [id^="email-snippet-"] {
    /*word-wrap: break-word;
    white-space: pre-line !important;
    overflow: visible !important;*/
    opacity: 0.5 !important;
    transition: opacity ease 0.7sec !important;
}
/* HOVER on snipet */
[role="list"] li [id^="email-snippet-"]:hover {
    opacity: 1 !important;
    transition: opacity ease 0.7sec !important;
}

/*[data-test-id="focus-group"] h2 + ul li button > div {
    max-width: 100% !important;
    pointer-events: auto !important;
background: red !important;
}*/


/* (new74) ==== COLOR - LIGHT THEME  */
/*html[data-color-scheme="dark"] [data-maintain-color] a, 
html[data-color-theme-enabled] [data-color-scheme="light"] a, 
html[data-color-theme-enabled][data-color-scheme="light"] a {
    color: peru !important;
}*/

/* ONGLET */
/*[data-test-id="focus-group"] h2 + ul li button {
    background: #323232 !important;
}*/


/* (new74) ==== COLOR - DARK THEME*/

html[data-color-theme-enabled][data-color-scheme="dark"] a , 
html[data-color-theme-enabled] [data-color-scheme="dark"] a {
    color: peru !important;
}

/* (new74) DARK - CHECKED */
html[data-color-theme-enabled]#Atom [data-color-scheme="dark"] .q_2x2lMk {
  background: #392c29 !important;
}

/* (new74) DARK - ZEBRA - TEST - ALL */
html[data-color-theme-enabled] [data-color-scheme="dark"] [data-test-id="virtual-list-container"] li:nth-child(odd) > div:not([aria-checked="true"]) {
    background: #10101063 !important;
/*border-left: 5px solid red !important;*/
}
html[data-color-theme-enabled] [data-color-scheme="dark"] [data-test-id="virtual-list-container"] li:nth-child(even) > div:not([aria-checked="true"]) {
    background: #0d0d0d9c !important;
/*border-left: 5px solid green !important;*/
}

/* (new74) ZEBRA - TEST - UNREAD without ACTION - AP*/
/*html[data-color-theme-enabled] [data-color-scheme="dark"] [data-test-id="virtual-list-container"] li > div[aria-labelledby^="unread-message-status-AP__"] {
    background: olive !important;
}*/
/*html[data-color-theme-enabled] [data-color-scheme="dark"] [data-test-id="virtual-list-container"] li > div[aria-labelledby^="unread-message-status-AB"] ,
html[data-color-theme-enabled] [data-color-scheme="dark"] [data-test-id="virtual-list-container"] li > div[aria-labelledby^="unread-message-status-AP__"] {
    background: pink !important;
}*/

/* (new74) ZEBRA - UNREAD after ACTION - AB */
html[data-color-theme-enabled] [data-color-scheme="dark"] [data-test-id="virtual-list-container"] li:nth-child(even) > div[aria-labelledby^="unread-message-status-AB"] {
    /*background: blue !important;*/
}
html[data-color-theme-enabled] [data-color-scheme="dark"] [data-test-id="virtual-list-container"] li:nth-child(odd) > div[aria-labelledby^="unread-message-status-AB"] {
    /*background: green !important;*/
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
