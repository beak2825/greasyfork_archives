// ==UserScript==
// @name         worker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  sdfdsafadsfgfhvcbvcb,dsfgsdfdsafdsav,dfvcxfarewfvxzdasdhgfsfewsdfhhfdgfbhgfvvbgf
// @author       You
// @match        https://*
// @license      AGPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456198/worker.user.js
// @updateURL https://update.greasyfork.org/scripts/456198/worker.meta.js
// ==/UserScript==
// worker.js
let startTime = new Date().getTime();
let count = 0;
setInterval(function(){
    count++;
    console.log(count + ' --- ' + (new Date().getTime() - (startTime + count * 1000)));
}, 1000);