// ==UserScript==
// @name        dislazywykopalder
// @description Wymusza ładowanie lazyloadowanych obrazków na wykopie.
// @version     2018.01.29.1457
// @namespace   https://greasyfork.org/users/30-opsomh
// @grant       none
// @include     http://www.wykop.pl/*
// @include     https://www.wykop.pl/*
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/25819/dislazywykopalder.user.js
// @updateURL https://update.greasyfork.org/scripts/25819/dislazywykopalder.meta.js
// ==/UserScript==

(function(){
    var main = function(){
        //for (let i of $(window).data().lazyloaders) i.top = 1;
        $(window).data().lazyloaders.forEach(function(a){a.top = 1;});
    };

    var script = document.createElement('script');
    script.textContent = '(' + main.toString() + ')();';
    document.body.appendChild(script);
})()