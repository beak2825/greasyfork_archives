// ==UserScript==
// @name         SpeedTest (Automatic)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Autoclick en SpeedTest
// @author       You
// @match        https://www.speedtest.net/*
// @icon         https://www.google.com/s2/favicons?domain=speedtest.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428315/SpeedTest%20%28Automatic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428315/SpeedTest%20%28Automatic%29.meta.js
// ==/UserScript==

(function() {
'use strict';

setTimeout(function(){
var ob1=document.getElementsByClassName("start-button")[0];
var ob2=ob1.getElementsByTagName("a")[0];
var ob3=ob2.click();

},30000);
})();