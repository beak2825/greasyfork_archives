// ==UserScript==
// @name         easy-forex.com
// @namespace    http://your.homepage/
// @version      0.21
// @description  enter something useful
// @author       You
// @match        http://www.easy-forex.com/int/currencyratespage/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13211/easy-forexcom.user.js
// @updateURL https://update.greasyfork.org/scripts/13211/easy-forexcom.meta.js
// ==/UserScript==

function checkPrice(){
    var l = document.getElementsByTagName('a');
    var j=0;

    for (var i=0;i<l.length;i++){
        if (l[i].href.indexOf('secure.easy-forex.com/ntp/int/en/machine/tradingzone/default.aspx?buy=GBP&sell=USD')>0){
            
            //alert(window.document.title );
            
            j++;
            if(j==2) {top.document.title  = l[i].innerHTML  ;break;}

        }
    }
   //top.document.title =j;
}
//checkPrice();
//alert('start');
var myInterval = setInterval(checkPrice, 1000);
