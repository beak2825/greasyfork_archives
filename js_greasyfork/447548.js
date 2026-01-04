// ==UserScript==
// @name         opentrain search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  1234567
// @author       rainy
// @match        http://opentrains.snarknews.info/~ejudge/sn_sh.cgi?data=result_team&sid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=snarknews.info
// @grant        none
// @license MIT
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/447548/opentrain%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/447548/opentrain%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var element = '<input type="text" id="search" placeholder="search"></input>'
    $("body > center > h2").after(element)
    setInterval(function(){
        for(let i=1;i<$("body > center > table > tbody").children().length;i++) {
            let display = $("body > center > table > tbody > tr:nth-child(" + (i + 1)+ ") > td:nth-child(2)").text().indexOf($("#search").val()) == -1
            $("body > center > table > tbody > tr:nth-child(" + (i +1) + ")").css("display", display ? "none" : "")
        }
    }, 300)
})();