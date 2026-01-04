// ==UserScript==
// @name         Goszakupki
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://zakupki.gov.ru/epz/orderplan/plan-graph-card/execution-info.html?revision-id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31380/Goszakupki.user.js
// @updateURL https://update.greasyfork.org/scripts/31380/Goszakupki.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $( "a.cryptoSignsSmall" ).each(function( index ) {
        var did = $( this ).attr('href');
        did = did.replace('/epz/orderplan/signview/list.html?printFormId=', '');
        $( this ).after(' <a class="" onclick="window.open(this.href); return false;" target="_blank" href="/epz/orderplan/printForm/view.html?printFormId=' + did + '"> П</a>'); 
    });
    // Your code here...
})();