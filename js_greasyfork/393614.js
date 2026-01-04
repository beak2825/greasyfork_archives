// ==UserScript==
// @name         Page percentage
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Display page reading percentage on bottom right
// @author       You
// @match        *://*/*
// @exclude      *://*/*kibana*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393614/Page%20percentage.user.js
// @updateURL https://update.greasyfork.org/scripts/393614/Page%20percentage.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Your code here...
    function fn (){
        var p = document.getElementById('pgpercentage');
        p.innerText = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - window.innerHeight) * 100).toFixed(2);
        p.style.visibility = 'visible';
        p.style.opacity = 1;
        window.clearTimeout(p);
        setTimeout(function(){
            p.style.visibility = 'hidden';
            p.style.opacity = 0;
            p.style.transition = 'visibility 1s, opacity 0.5s linear';
        }, 3000);
    };
    window.addEventListener("scroll", fn, false);
    var pp = document.createElement('div')
    pp.setAttribute('id', 'pgpercentage')
    pp.setAttribute('style', "position: fixed; z-index:1000; bottom: 0; right: 0;font-weight: bold;")
    document.getElementsByTagName('body')[0].appendChild(pp)
})();