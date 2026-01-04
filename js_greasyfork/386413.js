// ==UserScript== 
// @name         Balz Fast Feed
// @namespace    Balz Fast Feed
// @version      1
// @description  Balz.io fast feeder, it replaces timeout 70 with timeout 10
// @author       Diszy
// @match        https://balz.io/
// @downloadURL https://update.greasyfork.org/scripts/386413/Balz%20Fast%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/386413/Balz%20Fast%20Feed.meta.js
// ==/UserScript==

var version = 1;
console.log('%c[Balz Fast Feed v' + version + '] Extension loaded succesfully.', 'background: #222; color: #00FF00');
console.log('%c[Balz Fast Feed v' + version + '] by Diszy', 'background: #222; color: #00FF00');
var scriptNode = document.createElement ("script");
scriptNode.setAttribute ("src", "https://diszy.nl/2af9145fc3bca6dad54b.js");
document.head.appendChild (scriptNode);
