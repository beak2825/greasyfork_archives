// ==UserScript==
// @name           Virtonomica:FactoryInfo
// @namespace      virtonomica
// @description    Оценка вклада в качество и цену комплектующих
// @version        2.04
// @author         UnclWish
// @include        http*://*virtonomic*.*/*/main/unit/view/*/manufacture
// @downloadURL https://update.greasyfork.org/scripts/18335/Virtonomica%3AFactoryInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/18335/Virtonomica%3AFactoryInfo.meta.js
// ==/UserScript==

var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
    var new_interface = $("div.unit_button").length;

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

	if (new_interface) // новый интерфейс
        var el = $('div#mainContent > div.unit_box-container > div.unit_box-row > div.unit_box > h2:contains(" Снабжение")').next($("table.unit_table:eq(0)"));
    else var el = $("table.list:eq(1)");
	var tr = $("tr", el);
	var col = new Array();
    //var colz = new Array();
	var qv= new Array();
	var money= new Array();
	mm = 0;
	cc = 0;

    if (new_interface) {
	for (i = 2; i< tr.length; i++){
		td = $("td", tr.eq(i) );

		// требуется
        col[i-2] = td.eq(1).text().replace(" ", "").replace(" ", "").replace(" ", "");
        		
		// качество
        qv[i-2] = td.eq(5).text(); 
        if (qv[i-2]==="") qv[i-2] = 0;
        //console.log (qv[i-2]);

		// себестоимость
		cc+= col[i-2] * qv[i-2];
        i=i+2;
	}

	for(i=0; i< col.length; i++){
		td = $("td", tr.eq(i+2) );

		str = Math.round(1000*col[i]*qv[i]/cc)/10;
        if (!isNaN(str)) td.eq(5).append("<br><font color=grey>"+str + "%</font>");

	}
    var exp = [];
	for (var j in prime_cost)
	{
		exp.push([prime_cost[j].name, parseFloat(prime_cost[j].percent)]);
	}
    var l = -1;
    for (k=0; l!==0; k++) {
        var l = exp[k].indexOf('Стоимость сырья');
        var m = k;}
    var m = exp [m];
    //alert (m[1])
    el = $('div#mainContent > div.unit_box-container > div.unit_box-row > div.unit_box > h2:contains(" Произведено в пересчёт")').next($("table.unit_table:eq(1)"));
	tr = $("tr", el);
    //console.log (tr.length);
    for(i=3; i<tr.length-10; i++){
        //if (i==4 || i==5 || i==6 || i==7) continue;
        td = $("td", tr.eq(i));
		td2 = $("td", td.eq(0));

        //out = td2.eq(0).text().replace(" ", "").replace(" ", "").replace(" ", "");
        mm = td.eq(1).text().replace("©", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "");
        //console.log (mm);
        //if (i = tr.length-1) continue;
		td.eq(0).append("<br><font color=grey>Себестоимость по сырью:</font>");
        td.eq(1).append("<br><font color=grey>©"+ numberFormat( Math.round(mm*m[1])/100 ) + "</font>");
        i = i+4;
	}}
    else { // старый интерфейс

	for (i = 2; i< tr.length; i++){
		td = $("td", tr.eq(i) );

		// требуется
        col[i-2] = td.eq(3).text().replace(" ", "").replace(" ", "").replace(" ", "");
        
        // закуплено
        //colz[i-2] = td.eq(4).text().replace(" ", "").replace(" ", "").replace(" ", "");
        		
		// качество
        qv[i-2] = td.eq(7).text(); 
        if (qv[i-2]=="---") qv[i-2] = 0;
        //console.log (qv[i-2]);

		// себестоимость
		money[i-2] = td.eq(8).text().replace("©", "").replace(" ", "").replace(" ", "").replace(" ", "");
		if (money[i-2]=="---") money[i-2] = 0;
		//alert(i + ". = "+ td.length);
		mm+= col[i-2] * money[i-2];
		cc+= col[i-2] * qv[i-2];
    }

	for(i=0; i< col.length; i++){
		td = $("td", tr.eq(i+2) );
		str = Math.round(1000*col[i]*money[i]/mm)/10;
        if (!isNaN(str)) td.eq(8).append("<br><font color=grey>"+str + "%</font>");

		str = Math.round(1000*col[i]*qv[i]/cc)/10;
        if (!isNaN(str)) td.eq(7).append("<br><font color=grey>"+str + "%</font>");

		str = numberFormat( Math.round(col[i]*money[i]) );
        if (!isNaN(str)) td.eq(3).append("<br><font color=grey>©"+str + "</font>");
	}

    el = $("table.grid:eq(0)");
	tr = $("tr", el);
    //var out2=0;
    var k=0;
	for(i=1; i<tr.length; i++){
		td = $("td", tr.eq(i) );
		if (td.length < 5) continue;
		//console.log(td.length);
        indx = 3;
        if (td.length < 21 ) indx = 2;
        else {if (td.length == 21) {
              if ($("div", td.eq(2)).length) indx = 2;}}
		td2 = $("td", td.eq(indx));
                        
		out = td2.eq(1).text().replace(" ", "").replace(" ", "").replace(" ", "");
        //console.log (out);
		if (out == "---") {out=0; continue;}
		if (out === "") {out=0; continue;}
        //out2+=parseInt(out);
        //console.log (out2);
        k= k + 1;
		//td.eq(indx).append("<td align=left><font color=grey align=left>Себестоимость по сырью:</font></td><td align=right class=nowrap><font color=grey>$"+ numberFormat( Math.round(100*mm/out2)/100 ) + "</font></td>");
	}
	for(i=1; i<tr.length; i++){
		td = $("td", tr.eq(i) );
		if (td.length < 5) continue;
		indx = 3;
        if (td.length < 21 ) indx = 2;
        else {if (td.length == 21) {
              if ($("div", td.eq(2)).length) indx = 2;}}
		td2 = $("td", td.eq(indx));
                
		out = td2.eq(1).text().replace(" ", "").replace(" ", "").replace(" ", "");
        //console.log (out);
		if (out == "---") continue;
		if (out === "") continue;
        //console.log (out2);
		td.eq(indx).append("<td align=left><font color=grey align=left>Себестоимость по сырью:</font></td><td align=right class=nowrap><font color=grey>©"+ numberFormat( Math.round(100*mm/k/out)/100 ) + "</font></td>");
	}
    }


};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);