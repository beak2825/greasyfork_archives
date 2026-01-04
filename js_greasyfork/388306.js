// ==UserScript==
// @name         ZergPool
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        http://zergpool.com/site/mining
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/388306/ZergPool.user.js
// @updateURL https://update.greasyfork.org/scripts/388306/ZergPool.meta.js
// ==/UserScript==

jQuery(document).ready(function(){
    $.get( "http://zergpool.com/site/graph_price_results", function( data ) {
        var today = Date.now();
        console.log("tick_count: " + today);
        //console.log(data);
        var encodedString = btoa(data);
        //console.log("|" + encodedString + "|");
        var k = 1000; //daljinata na paketite
        var daljina = encodedString.length;
        var paketi = Math.ceil(daljina / k);
        console.log("daljina: " + daljina);
        console.log("paketi:  " + paketi);
        var i;
        for (i = 0; i < paketi; i++) {
            //console.log("sending " + i + "/" + paketi);
            //var alabala = encodedString.substr(0, k);
            var alabala = encodedString.slice(i*k, (i+1)*k);
            var url = "http://localhost.zergpool.com/zergpool.php?tc="+today+"&i="+i+"&c="+paketi+"&graph_price_results="+alabala;
            $.get(url);
        }
        //$.get( "http://localhost.zergpool.com/zergpool.php?graph_price_results=alabala");
        //
        //select_algo("m7m");
        //
        setTimeout(function () {
            //window.location.reload(true);
            javascript:select_algo("m7m");
        }, 60*1000);
        //
    });
});
