// ==UserScript==
// @name         Discord Dark Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A collection of minor style element tweaks to improve UI appearance
// @author       Aristo-TTL
// @match        *://discord.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/426320/Discord%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/426320/Discord%20Dark%20Theme.meta.js
// ==/UserScript==

GM_addStyle(`
.theme-dark {
   --background-primary: #202225;
   --background-secondary: #202225;
   --background-message-hover: #202225;
   --background-mentioned: #101215;
   --background-mentioned-hover: #000000;
   --channeltextarea-background: #29292f;
   --background-secondary-alt: #19191b;
}
.reaction-1hd86g.reactionMe-wv5HKu .reactionCount-2mvXRV {
   --brand-experiment-200: #1773d1
}
.reaction-1hd86g.reactionMe-wv5HKu {
   --brand-experiment-15a: #202225;
   --brand-experiment: #202225;
}

.hidden-HHr2R9 {
   --background-color: #000000;
}

.theme-dark .spoilerText-3p6IlD.hidden-HHr2R9, .theme-dark .spoilerText-3p6IlD.hidden-HHr2R9:hover { background-color: var(--background-secondary-alt);}


/*---------------------------------------- Other Fixes ----------------------------------------*/

.ephemeral-1PsL1r {
  position: relative;
}
.ephemeral-1PsL1r:before {
  content: '';
  position:absolute;
  display:block;
  top:0;
  left:0;
  bottom:0;
  pointer-events:none;
  width: 3px;
}
.mentioned-xhSam7 {
  position: relative;
}
.mentioned-xhSam7:before {
  content: '';
  position:absolute;
  display:block;
  top:0;
  left:0;
  bottom:0;
  pointer-events:none;
  width: 3px;
}
.replying-1x3H0T {
  position: relative;
}
.replying-1x3H0T:before {
  content: '';
  position:absolute;
  display:block;
  top:0;
  left:0;
  bottom:0;
  pointer-events:none;
  width: 3px;
}
`);

var styleElem = document.head.appendChild(document.createElement("style"));

styleElem.innerHTML = ".mentioned-xhSam7:before {background: #235F91;}";

(function() {
let css = `

/*---------------------------------------- SLIDE IN AND OUT ANIMATION ----------------------------------------*/

/* CHANNELS/DMS */
div.sidebar-2K8pFh {
    opacity: 0;
    width: 40px;
    -webkit-transition: opacity 0.3s ease-in-out, width 0.5s;
    -moz-transition: opacity 0.3s ease-in-out;
    -ms-transition: opacity 0.3s ease-in-out;
    -o-transition: opacity 0.3s ease-in-out;
}
div.sidebar-2K8pFh:hover {
    opacity: 1;
    width: 250px;
}
/* MEMBER LIST */
[class|=membersWrap] {
    opacity: 0;
    width: 10px;
    min-width: 40px;
    -webkit-transition: opacity 0.3s ease-in-out, width 0.5s;
    -moz-transition: opacity 0.3s ease-in-out;
    -ms-transition: opacity 0.3s ease-in-out;
    -o-transition: opacity 0.3s ease-in-out;
}
[class|=membersWrap]:hover {
    opacity: 1;
    width: 240px;
}
.members-1998pB {
    opacity: 0;
    width: 40px;
    -webkit-transition: opacity 0.3s ease-in-out, width 0.5s;
    -moz-transition: opacity 0.3s ease-in-out;
    -ms-transition: opacity 0.3s ease-in-out;
    -o-transition: opacity 0.3s ease-in-out;
}
.members-1998pB:hover {
    opacity: 1;
    width: 240px;
}

/*---------------------------------------- SCROLL BAR CHANGES ----------------------------------------*/
::-webkit-scrollbar,
::-webkit-scrollbar-track,
::-webkit-scrollbar-track-piece,
::-webkit-scrollbar:horizontal,
::-webkit-scrollbar:vertical {
  background: #29292f !important;
}


/*---------------------------------------- @ COLOR FIX----------------------------------------*/

:root {

    --SD-accent: 27,133,209;

    --SD-font: 'Roboto';
  --SD-accent-default: 27,133,209;
  --SD-accent-set: var(--SD-accent, var(--SD-accent-default));
}
#app-mount .chat-3bRxxu .wrapper-3WhCwL {
  background: rgba(var(--SD-accent-set), 0.1);
  color: rgba(var(--SD-accent-set), 1);
}
#app-mount .chat-3bRxxu .wrapper-3WhCwL:hover {
  background: rgba(var(--SD-accent-set), 1);
  color: #fff;
}

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();