// ==UserScript==
// @name         Spys.one IP exporter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://spys.one/en/free-proxy-list/
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/408644/Spysone%20IP%20exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/408644/Spysone%20IP%20exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var removeElements = function(text, selector) {
        var wrapped = $("<div>" + text + "</div>");
        wrapped.find(selector).remove();
        return wrapped.html();
    }

var check = "document";

    var ip = '';
    $( $('font[class="spy14"]') ).each(function( index ) {
        if($( this ).text().indexOf(check) != -1){
            ip += $( this ).text().replace(/document.*\:/g, ':')+"\n";
        }
    });
    console.log(ip);
})();