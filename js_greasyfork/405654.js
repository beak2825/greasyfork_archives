// ==UserScript==
// @name         Speedy | Discord theme
// @namespace    http://tampermonkey.net/
// @version      5
// @description  Discord cool theme!
// @author       Speedy
// @icon         https://i.ibb.co/svzZ1BZ/Speedy-icon.png
// @match        *://discord.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/405654/Speedy%20%7C%20Discord%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/405654/Speedy%20%7C%20Discord%20theme.meta.js
// ==/UserScript==

var High = "#873287"; // #b45454
var Med = "#5a205a"; // #5e2a2a
var Low = "#381438"; // #240f0f
var strong = "#bdbdbd";
var textColor = "White"; // White
var fontFamily = "'Cairo', sans-serif";

var fontLink = document.createElement('link');
fontLink.href = "https://fonts.googleapis.com/css2?family=Cairo:wght@600&display=swap";
document.head.appendChild(fontLink);

GM_addStyle(`
@import url(${fontLink.href});
.theme-dark {
   --background: url(https://i.imgur.com/kJGcWiR.jpg);
   --background-primary: ${High};
   --background-secondary: ${Med};
   --background-tertiary: ${Low};
   --channeltextarea-background: ${High};
   --deprecated-panel-background: ${High};
}
.theme-dark .scrollerThemed-2oenus.themedWithTrack-q8E3vB .scroller-2FKFPG::-webkit-scrollbar-track-piece {
   background-color: ${Med};
   border: 3px solid ${High};
   border-radius: 7px;
}
.theme-dark .scrollerThemed-2oenus.themedWithTrack-q8E3vB .scroller-2FKFPG::-webkit-scrollbar-thumb {
   background-color: ${Low};
   border-color: ${High};
}
.inner-zqa7da {
   border: rgba(204, 204, 204, 0.27) solid 1px;
   border-radius: 0;
}
.container-2ax-kl {
   color: #ffffff;
}
.container-3baos1, .container-3baos1 .avatar-SmRMf2, .scrollableContainer-2NUZem, .theme-dark .body-3iLsc4, .theme-dark .footer-1fjuF6, .scroller-3BxosC  {
   background-color: ${Low};
}
.auto-Ge5KZx, .auto-Ge5KZx.fade-2kXiP2:hover, .friendsEmpty-1K9B4k, .headerTop-3C2Zn0, .theme-dark .quickMessage-1yeL4E, .content-1LAB8Z {
   background-color: ${High};
}
.bodyTitle-Y0qMQz, .container-1sFeqf {
   color: ${textColor};
}
.theme-dark .headerClickable-2IVFo9, .theme-dark .headerDefault-1wrJcN, .webhookRow-20TsIQ, .item-26Dhrx, .theme-dark .footer-2gL1pp, .tierHeaderContent-2-YfvN {
   background-color: ${Low};
}

.theme-dark .tierBody-x9kBBp, .horizontalAutocompletes-3blb-Z {
   background-color: ${Med};
}
.scroller-2hZ97C, .header-1TKi98, .noScroll-3xWe_g, .content-mK72R6, .content-2oypg3, .autocompleteScroller-iInVqR, .theme-dark .selectorSelected-1_M1WV, .contentWrapper-1VyP0K {
   background-color: ${High};
}
.theme-dark .autocompleteArrow-Zxoy9H, .theme-dark .header-2bNvm4, .container-1giJp5, .activityPanel-28dQGo {
  background-color: ${Low};
}
.userSettingsAccount-2eMFVR .userInfoEditing-1CEzdT, .userSettingsAccount-2eMFVR .userInfoViewing-16kqK3, .theme-dark .elevationHigh-1PneE4 {
   background-color: ${Med};
}
.formNotice-2_hHWR, .accountList-33MS45, .theme-dark .codeRedemptionRedirect-1wVR4b, .autocompleteRowVertical-q1K4ky {
   background-color: ${Med};
}
.theme-dark .row-rrHHJU.selected-1pIgLL, .card-1yV8cG, .mentioned-xhSam7 {
   background: ${Med};
}
.theme-dark .scrollerThemed-2oenus.themeGhostHairline-DBD-2d .scroller-2FKFPG, .container-3mrum_, .addInputWrapper-1BOZ3d, .popout-2iWAc-, .popouts-2bnG9Z {
   background-color: ${High};
}
.cozy-3raOZG .messageContent-2qWWxC {
   color: ${textColor};
   font-family: ${fontFamily};
}
.px-10SIf7.botTag-2WPJ74, .item-2hkk8m, .modeSelected-1zApJ_ .content-3at_AU, .modeSelected-1zApJ_:hover .content-3at_AU, .perksModalContentWrapper-2HU6uL  {
   background: ${High};
}
.zalgo-jN1Ica.cozy-3raOZG .header-23xsNx, .h5-18_1nd, .icon-22AiRD, .theme-dark .discriminator-byOsvi, .theme-dark .keybind-KpFkfr, .reactionCount-2mvXRV {
   color: ${textColor};
}
.edited-3sfAzf {
   color: ${Med};
}
.theme-dark .uploadModal-2ifh8j, .content-2hhZxN {
   background-color: ${High};
}
.uploadModal-2ifh8j .footer-3mqk7D.hasSpoilers-1IRtQC, .theme-dark .scroller-1-nKid {
   background: ${Med};
}
.uploadModal-2ifh8j .inner-3nWsbo .file-34mY5K .icon-kyxXVr.image-2yrs5j {
   border: 2px solid ${Med};
}
.checkboxEnabled-CtinEn {
   background: ${Med};
   color: ${Med};
}
.reactors-Blmlhw {
   background-color: ${High};
}
.unreadTop-73gZ2_ .unreadBar-3YD_k9:before {
   background: ${High};
   z-index: -1;
   color: White;
   border-radius: 20px;
}
.unreadBar-3YD_k9:before {
   content: '';
   top: -8px;
   position: absolute;
   left: -8px;
   right: -8px;
   bottom: 0;
}
.theme-dark .closeButton-1tv5uR {
   border-color: ${textColor};
}
.markup-2BOw-j strong {
   color: ${strong};
}
`);