// ==UserScript==
// @name         newonnetflix to Simkl
// @namespace    https://usa.newonnetflix.info/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://usa.newonnetflix.info/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404766/newonnetflix%20to%20Simkl.user.js
// @updateURL https://update.greasyfork.org/scripts/404766/newonnetflix%20to%20Simkl.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        if(document.getElementsByClassName('infoupdate').length > 0)
//window.location = "https://simkl.com/search/?type=tv&q="+document.querySelector('[target="_tmdb"]').href;
            window.location = "https://simkl.com/search/?type=tv&q="+document.getElementsByTagName('h1')[0].textContent.substring(11)
    else
       // window.location = "https://simkl.com/search/?type=movies&q="+document.querySelector('[target="_tmdb"]').href;
    window.location = "https://simkl.com/search/?type=movies&q="+document.getElementsByTagName('h1')[0].textContent.substring(11)
    }, 15000);})();