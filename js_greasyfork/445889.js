// ==UserScript==
// @name         Make Image Clickable
// @namespace    Quin15
// @version      0.1
// @description  Removes overlay that prevents images from being clicked
// @author       Quin15
// @match        https://www.imdb.com/title/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445889/Make%20Image%20Clickable.user.js
// @updateURL https://update.greasyfork.org/scripts/445889/Make%20Image%20Clickable.meta.js
// ==/UserScript==


 function tryRemoveElem() {
     try{document.querySelector('div[data-testid="media-viewer__touch-handler"]').remove()} catch(err) {}
 }

var RepeatCheck = setInterval(tryRemoveElem, 100)