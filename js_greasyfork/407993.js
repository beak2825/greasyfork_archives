// ==UserScript==
// @name        Get Repl links - theodinproject.com
// @namespace   Violentmonkey Scripts
// @match       https://www.theodinproject.com/*
// @grant       none
// @version     1.0
// @author      gogvale
// @description Prints to the console all Repl.it/Repl.run links on TheOdinProject as an array
// @downloadURL https://update.greasyfork.org/scripts/407993/Get%20Repl%20links%20-%20theodinprojectcom.user.js
// @updateURL https://update.greasyfork.org/scripts/407993/Get%20Repl%20links%20-%20theodinprojectcom.meta.js
// ==/UserScript==
function getReplLinks(){ 
  return [...document.querySelectorAll('a')].filter(a=>a.href.includes('repl')).map(a=>a.href);
}

links = getReplLinks()
console.log(links)