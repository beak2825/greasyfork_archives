// ==UserScript==
// @name         visitor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Anon
// @include      http://hackforums.net/*
// @include      https://hackforums.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39481/visitor.user.js
// @updateURL https://update.greasyfork.org/scripts/39481/visitor.meta.js
// ==/UserScript==


var random  = Math.floor(Math.random()*50000 + 5700000);

setTimeout(function(){
    window.location.href = 'http://hackforums.net/showthread.php?tid=' + random;
}, 300000);