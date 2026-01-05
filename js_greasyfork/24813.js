// ==UserScript==
// @name       Url in title
// @namespace  https://infovikol.ch/
// @version    0.1
// @description  Puts the url in the title bar. Very useful for KeePass.
// @match      http*://*/*
// @grant   none
// @downloadURL https://update.greasyfork.org/scripts/24813/Url%20in%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/24813/Url%20in%20title.meta.js
// ==/UserScript==

document.title=document.title+' '+document.URL;