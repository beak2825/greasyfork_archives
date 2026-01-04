// ==UserScript==
// @name Decluttered Outlook
// @namespace https://greasyfork.org/users/703184
// @version 1.2.1
// @description Removes all advertisement banners, favorites, groups und the header of folders.
// @author floriegl
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @match https://outlook.live.com/mail/*
// @downloadURL https://update.greasyfork.org/scripts/422440/Decluttered%20Outlook.user.js
// @updateURL https://update.greasyfork.org/scripts/422440/Decluttered%20Outlook.meta.js
// ==/UserScript==

(function() {
let css = `
/* Top ad banner */
#MailList > div > div > div > div > div > div> div > div:nth-child(1) > div > div:not([role]) {
    display: none !important;
}
  
/* Favorites in sidebar */
#folderPaneDroppableContainer > div > div:nth-child(2) {
    display: none !important;
}

/* Folder header in sidebar */
#folderPaneDroppableContainer > div > div:nth-child(3) > div > div:nth-child(1) {
    display: none !important;
}

/* Groups in sidebar */
#folderPaneDroppableContainer > div > div:nth-child(3) > div > div:nth-child(3) {
    display: none !important;
}
    
/* New group button in sidebar */
#folderPaneDroppableContainer > div > div:nth-child(3) > div > div:nth-child(5) {
    display: none !important;
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
