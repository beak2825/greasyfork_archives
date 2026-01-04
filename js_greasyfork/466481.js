// ==UserScript==
// @name         idrivesafely autoskip
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto skips with times runs out, also auto submits answers in quizzes and tests
// @author       idk
// @match        https://app.idrivesafely.com/courseflow/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466481/idrivesafely%20autoskip.user.js
// @updateURL https://update.greasyfork.org/scripts/466481/idrivesafely%20autoskip.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
    document.getElementsByClassName("icon gritIcon--arrow-right")[0].click()
}, 1000);
// auto repeats the click the next button every one second
})();
// if the script ever stops working its either they changed the class name or the lessons name (courseflow rn as you can see in the match)
// its pretty simple to fix, just copy paste the lessons url and then remove the random gibberish and add a *. explaining in baby terms