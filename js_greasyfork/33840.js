// ==UserScript==
// @name         Reduce borders
// @version      1.1
// @description  Reduce those unnecessary large borders
// @author       A Meaty Alt
// @include      /fairview\.deadfrontier\.com/
// @grant        none
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/33840/Reduce%20borders.user.js
// @updateURL https://update.greasyfork.org/scripts/33840/Reduce%20borders.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var lBorder = 0;
    var rBorder = isGM()? 35 : 33;
    var wrapper = 1;
    var header = 2;
    var tCenter1 = 2;
    var tCenter2 = 4;
    var tCenter3 = 5;
    var tCenter4 = 6;
    var tCenter5 = 7;
    var tProfile = 8;
    var tdProfile = 10;
    var centerBackground = 14;
    fixLeftBorder();
    fixRightBorder();
    fixAllCenter();

    function isGM(){
        return $("td.design2010")[20].textContent.indexOf("GM") > -1;
    }
    function fixLeftBorder(){
        $("td.design2010")[lBorder].setAttribute("width", "10%");
    }
    function fixRightBorder(){
        $("td.design2010")[rBorder].setAttribute("width", "10%");
    }
    function fixAllCenter(){
        fixWrapper();
        fixHeader();
        fixCenter();
        fixProfile();
    }
    function fixWrapper(){
        $("table.design2010")[wrapper].setAttribute("width", "100%");
    }
    function fixHeader(){
        $("td.design2010")[header].style.backgroundRepeat = "round";
    }
    function fixCenter(){
        $("table.design2010")[tCenter1].setAttribute("width", "100%");
        $("table.design2010")[tCenter2].setAttribute("width", "100%");
        $("table.design2010")[tCenter3].setAttribute("width", "100%");
        $("table.design2010")[tCenter4].setAttribute("width", "100%");
        $("table.design2010")[tCenter5].setAttribute("width", "100%");
        $("td.design2010")[centerBackground].style.backgroundRepeat = "round";
        $("td.design2010")[centerBackground].style.backgroundPosition = "";
    }
    function fixProfile(){
        $("table.design2010")[tProfile].setAttribute("width", "100%");
        $("td.design2010")[tdProfile].setAttribute("width", "20%");
    }
})();