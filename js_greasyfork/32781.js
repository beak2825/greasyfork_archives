// ==UserScript==
// @name         Trade with friends
// @version      0.2
// @description  Tool to let you trade easier with your friends
// @author       A Meaty Alt
// @include      /sa=editBuddies/
// @grant        none
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/32781/Trade%20with%20friends.user.js
// @updateURL https://update.greasyfork.org/scripts/32781/Trade%20with%20friends.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var title = document.getElementsByClassName("catbg3")[0];
    var evenRows = document.getElementsByClassName("windowbg"); //except last 2
    var oddRows = document.getElementsByClassName("windowbg2"); //except first 2
    
    title.innerHTML += "<td>Trade</td>";
    
    for(var i=0; i<evenRows.length -2; i++){
        addCol(evenRows[i]);
    }
    
    for(var i=2; i<oddRows.length; i++){
        addCol(oddRows[i]);
    }
    
    function addCol(row){
        var tradeLink = getTradeLink(row);
        row.innerHTML += "<td><a href='"+tradeLink+"'><img height='30px' src='https://puu.sh/xoy3C/ecbe6d9dbc.png'/></a></td>";
    }
    
    function getTradeLink(row){
        var targetId = row.firstElementChild.firstElementChild.href.match(/u=(.*)/)[1];
        return "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=27&memto=" + targetId;
    }
})();