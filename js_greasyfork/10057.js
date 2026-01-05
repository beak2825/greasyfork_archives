// ==UserScript==
// @name           Virtonomica:Итого в отчете по подразделениям
// @namespace      virtonomica
// @description    Итоговая строка в отчете по подразделениям. Origin By Izumrud_AO, http://userscripts-mirror.org/scripts/show/137698
// @include	   http*://*virtonomic*.*/*/main/company/view/*/finance_report/by_units*
// @include	   http*://*virtonomic*.*/*/main/company/view/*/marketing_report/shops/*
// @include	   http*://*virtonomic*.*/*/main/company/view/*/marketing_report/services
// @include	   http*://*virtonomic*.*/*/main/company/view/*/marketing_report/services/*
// @version        1.9
// @downloadURL https://update.greasyfork.org/scripts/10057/Virtonomica%3A%D0%98%D1%82%D0%BE%D0%B3%D0%BE%20%D0%B2%20%D0%BE%D1%82%D1%87%D0%B5%D1%82%D0%B5%20%D0%BF%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/10057/Virtonomica%3A%D0%98%D1%82%D0%BE%D0%B3%D0%BE%20%D0%B2%20%D0%BE%D1%82%D1%87%D0%B5%D1%82%D0%B5%20%D0%BF%D0%BE%20%D0%BF%D0%BE%D0%B4%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%D0%BC.meta.js
// ==/UserScript==

var run = function() {
  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;
  
  //резделитель разрядов
  function commaSeparateNumber(val, sep){
    var separator = sep || ',';
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1"+separator);
    }
    return val;
  }
  function edit_summ(pr) {	
    return commaSeparateNumber( parseFloat(pr).toFixed(2), ' ');
  }

	function cleanNumber(spNum) {
		return spNum.replace('$','').replace(/\s+/g,'');
	}
	
  if (/\/main\/company\/view\/\d+\/finance_report\/by_units\//.test(window.location)) {
    var nvInSum = 0;
    var nvOutSum = 0;
    var nvTaxSum = 0;
    var nvProfit = 0;
    var nvProfitPercent = 0;
    var numrow = 0;
    
    $( '#mainContent tr[class]' ).each( function() {
      var cells = $( 'td', this );
      console.log(cleanNumber($( cells[4] ).text()));
      
      nvInSum = nvInSum + parseFloat( cleanNumber($( cells[4] ).text()) );
      nvOutSum = nvOutSum + parseFloat( cleanNumber($( cells[5] ).text()) );
      nvTaxSum = nvTaxSum + parseFloat( cleanNumber($( cells[6] ).text()) );
      nvProfit = nvProfit + parseFloat( cleanNumber($( cells[7] ).text()) );
      nvProfitPercent = nvProfitPercent + parseFloat( cleanNumber($( cells[8] ).text()) );
      numrow = numrow + 1;
    });
    //avg
	nvProfitPercent = (nvProfitPercent / numrow).toFixed(2);
    
    var tclass ="nowrap";
    if (nvProfit < 0) {
      tclass="moneySmallerZero";
    }
    var svQty = "Кол-во: " + numrow + " шт.";

    var text = "<tr style='background: #EEFACA'> <td style='font-size:14px'>"+"Итого :"+"</td> <td> </td> <td> </td> <td>"+ svQty +"</td>";
    text += "<td align=\"right\" class=\"nowrap\">$" + edit_summ(nvInSum) + "</td>";
    text += "<td align=\"right\" class=\"nowrap\">$" + edit_summ(nvOutSum) + "</td>";
    text += "<td align=\"right\" class=\"nowrap\">$" + edit_summ(nvTaxSum) + "</td>";
    text += "<td align=\"right\" class=\"nowrap\"><span class='"+ tclass +"'>$" + edit_summ(nvProfit) + "</span></td>";
    text += "<td align=\"right\" class=\"nowrap\">" + edit_summ(nvProfitPercent) + " %</td>  </tr>";

    $(text).insertBefore($('table.grid > tbody > tr:last'));
  }
  
  if (/\/main\/company\/view\/\d+\/marketing_report\/shops\//.test(window.location)) {
    var nvVolume = 0;
    var nvSum = 0;
    var nvPrc = 0;
    var nvQual = 0;
    var nvBrand = 0;
    var numrow = 0;
    var avVolAndSum=[];
    
    $( 'table[class^="unit-list"] > tbody > tr[class]' ).each( function() {
      var cells = $( 'td', this );
      console.log(cleanNumber($( cells[4] ).text()));
      
	  avVolAndSum = $( cells[4] ).html().split('<br>');
      nvVolume = nvVolume + parseFloat( cleanNumber(avVolAndSum[0]) );
      nvSum = nvSum + parseFloat( cleanNumber(avVolAndSum[1]) );
      nvPrc = nvPrc + parseFloat( cleanNumber($( cells[5] ).text()) );
      nvQual = nvQual + parseFloat( cleanNumber($( cells[6] ).text()) );
      nvBrand = nvBrand + parseFloat( cleanNumber($( cells[7] ).text()) );
      numrow = numrow + 1;
    });
    //avg
	nvPrc = (nvPrc / numrow).toFixed(2);
	nvQual = (nvQual / numrow).toFixed(2);
	nvBrand = (nvBrand / numrow).toFixed(2);
    
    var svQty = "Кол-во: " + numrow + " шт.";

    var text = "<tr style='background: #EEFACA'> <td style='font-size:14px'>"+"Итого :"+"</td> <td> </td> <td> </td> <td>"+ svQty +"</td>";
    text += "<td align=\"right\" class=\"nowrap\">" + edit_summ(nvVolume) + " ед.<br>$" + edit_summ(nvSum) + "</td>";
    text += "<td align=\"right\" class=\"nowrap\">$" + edit_summ(nvPrc) + "</td>";
    text += "<td align=\"right\" class=\"nowrap\">" + edit_summ(nvQual) + "</td>";
    text += "<td align=\"right\" class=\"nowrap\">" + edit_summ(nvBrand) + "</td>  </tr>";
    
    $(text).insertAfter($('table[class^="unit-list"] > tbody > tr:last'));
  }
  
  if (/\/main\/company\/view\/\d+\/marketing_report\/services/.test(window.location)) {
    var nvVolume = 0;
    var nvSum = 0;
    var nvPrc = 0;
    var nvQ1 = 0;
    var nvQ2 = 0;
    var nvQ3 = 0;
    var numrow = 0;
    var avVolAndSum=[];
    
    $( 'table[class^="unit-list"] > tbody > tr[class]' ).each( function() {
      var cells = $( 'td', this );
      console.log(cleanNumber($( cells[4] ).text()));
      
	  avVolAndSum = $( cells[4] ).html().split('<br>');
      nvVolume = nvVolume + parseFloat( cleanNumber(avVolAndSum[0]) );
      nvSum = nvSum + parseFloat( cleanNumber(avVolAndSum[1]) );
      nvPrc = nvPrc + parseFloat( cleanNumber($( cells[5] ).text()) );
      nvQ1 = nvQ1 + parseFloat( cleanNumber($( cells[6] ).text()) );
      nvQ2 = nvQ2 + parseFloat( cleanNumber($( cells[7] ).text()) );
      nvQ3 = nvQ3 + parseFloat( cleanNumber($( cells[8] ).text()) );
      numrow = numrow + 1;
    });
    //avg
	nvPrc = (nvPrc / numrow).toFixed(2);
	nvQ1 = (nvQ1 / numrow).toFixed(2);
	nvQ2 = (nvQ2 / numrow).toFixed(2);
	nvQ3 = (nvQ3 / numrow).toFixed(2);
    
    var svQty = "Кол-во: " + numrow + " шт.";

    var text = "<tr style='background: #EEFACA'> <td style='font-size:14px'>"+"Итого :"+"</td> <td> </td> <td> </td> <td>"+ svQty +"</td>";
    text += "<td align=\"right\" class=\"nowrap\">" + edit_summ(nvVolume) + " ед.<br>$" + edit_summ(nvSum) + "</td>";
    text += "<td align=\"right\" class=\"nowrap\">$" + edit_summ(nvPrc) + "</td>";
    text += "<td align=\"right\" class=\"nowrap\">" + edit_summ(nvQ1) + "</td>";
    text += "<td align=\"right\" class=\"nowrap\">" + edit_summ(nvQ2) + "</td>";
    text += "<td align=\"right\" class=\"nowrap\">" + edit_summ(nvQ3) + "</td>  </tr>";
    
    $(text).insertAfter($('table[class^="unit-list"] > tbody > tr:last'));
  }

}

var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
