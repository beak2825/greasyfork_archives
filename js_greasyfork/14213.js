// ==UserScript==
// @name        Vittonomica:Auction
// @namespace   virtonomica
// @description Показ стоимости ресурсов шахт, выставленных на аукцион
// @include     http://virtonomica.ru/*/main/auction/list/unit/open
// @version     0.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14213/Vittonomica%3AAuction.user.js
// @updateURL https://update.greasyfork.org/scripts/14213/Vittonomica%3AAuction.meta.js
// ==/UserScript==
var run = function()
{
var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);

function numberFormat (number) {
        number += '';
        var parts = number.split('.');
        var int = parts[0];
        var dec = parts.length > 1 ? '.' + parts[1] : '';
        var regexp = /(\d+)(\d{3}(\s|$))/;
        while (regexp.test(int)) {
            int = int.replace(regexp, '$1 $2');
        }
        return int + dec;
}

var table = $("table.unit-list-2014");
var tr = $("tr.wborder", table);
for(var i=0; i<tr.length; i++){
   //console.log( tr.eq(i).html() );
   var el = $("div:contains('Запасы месторождения:')", tr.eq(i) );
   if ( el.length == 0) continue;
   //console.log( el.text() );
   var pos = el.text().indexOf(':');
   var amount = parseInt( el.text().substr(pos+1).replace(/\s/g, '') );
   //console.log( amount );

   var money = parseInt( el.prev().prev().text().replace('$','').replace(/\s/g, '') );
   //console.log( money );

   el.after( '<div class=amount>$' + numberFormat(Math.round( money/amount) ) +'</div>' );
}

$(".amount").css('color', 'blue');

console.log("end");
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}

