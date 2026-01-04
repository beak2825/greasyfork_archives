// ==UserScript==
// @name         Disable comments on nicolive video screen
// @version      0.1
// @description  ニコニコ動画  
// @author       Werner78
// @match        https://live2.nicovideo.jp/watch/*
// @namespace    https://greasyfork.org/de/users/414179-werner78
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393491/Disable%20comments%20on%20nicolive%20video%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/393491/Disable%20comments%20on%20nicolive%20video%20screen.meta.js
// ==/UserScript==

setTimeout(function(){
document.querySelector('button[class*="comment-button"]').click();
}, 9000);