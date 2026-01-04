// ==UserScript==
// @name         IMDB to Simkl
// @namespace    https://www.imdb.com/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.imdb.com/title/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404764/IMDB%20to%20Simkl.user.js
// @updateURL https://update.greasyfork.org/scripts/404764/IMDB%20to%20Simkl.meta.js
// ==/UserScript==

(function () {
'use strict';
var refreshIntervalId = setInterval(function(){
    if(window.history.length <= 2)
    {
        let stateObj = {
    foo: "bar",
};

history.pushState(stateObj, "page 2", "https://simkl.com/search/?type=movies&q="+window.location.href);
window.location = "https://simkl.com/search/?type=movies&q="+window.location.href;
    }
clearInterval(refreshIntervalId);
}, 1000);
})();



