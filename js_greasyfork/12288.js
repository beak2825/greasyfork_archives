// ==UserScript==
// @name        Virtonomica_Lobby
// @version     3.02
// @author      Alexander Murmanskiy (recoding by test01)
// @description Показывает процент влияния в городе
// @include     https://virtonomic*.*/*/main/politics/lobby/*
// @include     http:/igra.aup.*/*/main/politics/lobby/*
// @namespace   virtonomica
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12288/Virtonomica_Lobby.user.js
// @updateURL https://update.greasyfork.org/scripts/12288/Virtonomica_Lobby.meta.js
// ==/UserScript==

var mainfunction = function () {

function getFloat( str ){
   str = str.replace(/\s+/g, '') ;
   str = str.substr( str.indexOf('$') + 1 );
   return parseFloat(str);
}

   if (!/(me)/.test(document.URL)) {
        //var TableForWork = document.getElementById("mainContent").getElementsByTagName('table')[1];
        if (typeof (TableForWork) != "undefined") {
            function TableInsertTableTitle() {
                Element_TH_Text = document.createElement("TH");
                Element_TH_Text.innerHTML = "Влияние (%)";
                TableForWork.rows[0].insertBefore(Element_TH_Text, TableForWork.rows[0].cells[3]);
                delete Element_TH_Text;
                return true;
            }
            //TableInsertTableTitle();
        }
	//console.log('---1---');
	var table = $("table.grid");
	console.log(table.length);
	var tr = $("tr", table);
	var all = getFloat( $('th', table).eq(3).text() );

	for(var i=1; i<tr.length; i++) {
	    var tds = $("td", tr.eq(i) );
	    //var money = tds.eq(3).text().replace(/\s+/g, '').replace('$', '') ;
	    var money = getFloat( tds.eq(3).text() ) ;
	    tds.eq(3).before( $('<td align=right>').append( (100*money/all).toFixed(2) ).append(' %') );
 
	}
        $('th', table).eq(3).before( $('<th align=right>').append('Влияние (%)') );

    }
    else {
        var TableForWork = document.getElementById("mainContent").getElementsByTagName('table')[0];
        if (typeof (TableForWork) != "undefined") {
            function TableInsertTableTitle() {
                Element_TH_Text = document.createElement("TH");
                Element_TH_Text.innerHTML = "Влияние (%)";
                TableForWork.rows[0].insertBefore(Element_TH_Text, TableForWork.rows[0].cells[1]);
                delete Element_TH_Text;
                return true;
            }
            //TableInsertTableTitle();
console.log('---2---');
		var table = $("table.grid");
		console.log(table.length);
		var tr = $("tr", table);
		for(var i=1; i<tr.length; i++) {
			var tds = $("td", tr.eq(i) );
			//var money = tds.eq(3).text().replace(/\s+/g, '').replace('$', '') ;
			var money = getFloat( tds.eq(1).text() ) ;
			var all = getFloat( tds.eq(2).text() ) ;
			tds.eq(1).before( $('<td align=right>').append( (100*money/all).toFixed(2) ).append(' %') );
 
		}
		$('th', table).eq(1).before( $('<th align=right>').append('Влияние (%)') );
/*
            for (var cells in TableForWork.rows) {
                var x02 = TableForWork.rows[Number(cells) + Number(1)].getElementsByTagName('td')[1].innerHTML.split(/[$]/);
		console.log( x02 );
                var x03 = x02[0].replace(/\s+/g, '');
                var x04 = TableForWork.rows[Number(cells) + Number(1)].getElementsByTagName('td')[2].innerHTML.split(/[$]/);
                var x05 = x04[0].replace(/\s+/g, '');
                Element_TD_Text = document.createElement("TD");
                Element_TD_Text.setAttribute("align", 'center');
                Element_TD_Text.innerHTML = "<font color=green><b>" + (100* (Number(x03) / Number(x05)) ).toFixed(2) + "</b></font>";
                TableForWork.rows[Number(cells) + Number(1)].insertBefore(Element_TD_Text, TableForWork.rows[Number(cells) + Number(1)].cells[1]);
                delete Element_TD_Text;
            }
*/
        }
    }
}
if (window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + mainfunction.toString() + ')();';
    document.documentElement.appendChild(script);
}