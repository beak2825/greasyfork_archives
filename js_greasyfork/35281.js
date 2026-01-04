// ==UserScript==
// @name         Vertical GoPlayground
// @version 1.1
// @description  Make the GO Playgroung appears vertically
// @copyright      Brahim Hamdouni (c) 2017
// @author         Brahim Hamdouni (@hamdouni)
// @License        http://creativecommons.org/licenses/by-nc-sa/3.0/
// @match        https://play.golang.org/
// @namespace https://greasyfork.org/users/136286
// @downloadURL https://update.greasyfork.org/scripts/35281/Vertical%20GoPlayground.user.js
// @updateURL https://update.greasyfork.org/scripts/35281/Vertical%20GoPlayground.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var wrap = document.getElementById("wrap");
    var output = document.getElementById("output");
    wrap.style.width = "50%";
    wrap.style.bottom = "0";
    wrap.style.padding = 0;
    wrap.style.margin = 0;
    wrap.style.border = 0;
    output.style.width = "50%";
    output.style.top = "50px";
    output.style.left = "50%";
    output.style.padding = 0;
    output.style.margin = 0;
    output.style.border = 0;
})();