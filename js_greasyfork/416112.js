// ==UserScript==
// @name Dark Habitica Wiki
// @namespace https://greasyfork.org/users/704808
// @version 0.2.3
// @description A userstyle that turns the Habitica Wiki and Editor dark.
// @author Nakonana
// @supportURL https://habitica.com/profile/33bb14bd-814d-40cb-98a4-7b76a752761c
// @license CC-BY-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.habitica.fandom.com/*
// @downloadURL https://update.greasyfork.org/scripts/416112/Dark%20Habitica%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/416112/Dark%20Habitica%20Wiki.meta.js
// ==/UserScript==

(function() {
let css = `

.WikiaPage .WikiaPageContentWrapper,
.WikiaPage .WikiaPageContentWrapper img:not(a),
.WikiaPage .WikiaPageContentWrapper div[style="display: flex; width: 300px; margin-bottom: 2px; box-shadow: 0 2px 2px 0 rgba(26, 24, 29, 0.16), 0 1px 4px 0 rgba(26, 24, 29, 0.12); background: transparent; border-radius: 2px; position: relative; font-family: 'Roboto', sans-serif; color: #4E4A57; font-size: 14px; line-height: 1.43;"]:not(.mw-parser-output),
.WikiaPage .WikiaPageContentWrapper div[style="width:20em; min-height:1.62765em; background-color: rgb(255, 255, 255); color: rgb(51, 51, 51); text-align:center; padding: 0px; font-size: 1.41em; line-height: 1.62765; height: 2.32765em; margin-bottom:0.75em; margin:0px; box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.5) inset;"]:not(.mw-parser-output),
.WikiaPage .WikiaPageContentWrapper div[style="display: inline-block; width: 2.62765em; height: 1.62765em; padding: 0px; margin:0px; font-size: 1.41em; line-height: 1.62765; text-align: center; color: rgb(34, 34, 34); float:left; cursor: pointer; vertical-align: top; left:0px; position:relative; background-color: rgb(208, 224, 227); border-right: 0px none;"]:not(.mw-parser-output),
.WikiaPage .WikiaPageBackground,
.WikiaPage .WikiaPageBackground img:not(a){
    filter: invert();
}


.WikiaPage .WikiaPageContentWrapper img {
    background-image: radial-gradient(circle, #eeeded, #bfbbbb, black);
}

img[src="https://static.wikia.nocookie.net/habitrpg/images/b/b6/Habit_positive_white.svg/revision/latest/scale-to-width-down/10?cb=20180205205509"],
img[src="https://static.wikia.nocookie.net/habitrpg/images/0/00/Habit_negative_gray.svg/revision/latest?cb=20180205012306"],
img[src="https://static.wikia.nocookie.net/habitrpg/images/9/9c/Streak_icon.svg/revision/latest/scale-to-width-down/12?cb=20180205014033"],
img[src="https://static.wikia.nocookie.net/habitrpg/images/b/b7/Check_task.svg/revision/latest/scale-to-width-down/13?cb=20180206215535"]
{
    background-image:initial !important;
}


.ooui-theme-fandom .diff-deletedline {
    border-color:   #018c30;
}
.ooui-theme-fandom .diff-deletedline .diffchange {
    background-color: #018c30;
}
#pagehistory .mw-plusminus-neg{
    color:#018c30;
}      
    
.ooui-theme-fandom .diff-addedline {
    border-color:   #e81a3f;
}  
.ooui-theme-fandom .diff-addedline .diffchange {
    background-color: #e81a3f;
}
#pagehistory .mw-plusminus-pos{
    color:#e81a3f;
}


.wds-banner-notification,
.mcf-card-article,
.mcf-column > div:last-child {
    display:none;
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
