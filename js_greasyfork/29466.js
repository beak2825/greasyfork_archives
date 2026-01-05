// ==UserScript==
// @name           Virtonomica: гистограмма для обзора рынка технологий
// @version        1.0
// @include        http*://*virtonomic*.*/*/main/globalreport/technology_market/total
// @description    Добавляет гистограмму на страницу обзора рынка технологий
// @author         cobra3125
// @namespace      virtonomica
// @downloadURL https://update.greasyfork.org/scripts/29466/Virtonomica%3A%20%D0%B3%D0%B8%D1%81%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D0%BE%D0%B1%D0%B7%D0%BE%D1%80%D0%B0%20%D1%80%D1%8B%D0%BD%D0%BA%D0%B0%20%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/29466/Virtonomica%3A%20%D0%B3%D0%B8%D1%81%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D0%BE%D0%B1%D0%B7%D0%BE%D1%80%D0%B0%20%D1%80%D1%8B%D0%BD%D0%BA%D0%B0%20%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D0%B9.meta.js
// ==/UserScript==

var run = function() {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;

	function sumMoneyToNumber(spSum){
		return parseFloat(spSum.replace('$','').replace(/\s+/g,''),10);
	}
	//резделитель разрядов
	function commaSeparateNumber(val, sep){
		var separator = sep || ',';
		while (/(\d+)(\d{3})/.test(val.toString())){
			val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1"+separator);
		}
		return val;
	}
  function refreshGraph(){
    var colCnt = $('#compare_table_content > div.header_row > div').length;

    var avCategories = $('#compare_table_content > div.data_row > div:nth-child(1)').map(function(i, e){ return $(e).text();}).get();

    var avSeries = [];
    for(var col = 1; col < colCnt; ++col){
      var techName = $('#compare_table_content > div.row.header_row > div:nth-child('+ (col+1) +') > i').attr('title');
      avSeries.push({
        name: techName,
        data: $('#compare_table_content > div.data_row > div:nth-child('+ (col+1) +')').map(function(i, e){ return sumMoneyToNumber($(e).text()) || 0;}).get()
      });
    }
    /**
     * Custom Axis extension to allow emulation of negative values on a logarithmic
     * Y axis. Note that the scale is not mathematically correct, as a true
     * logarithmic axis never reaches or crosses zero.
     */
    (function (H) {
        // Pass error messages
        H.Axis.prototype.allowNegativeLog = true;

        // Override conversions
        H.Axis.prototype.log2lin = function (num) {
            var isNegative = num < 0,
                adjustedNum = Math.abs(num),
                result;
            if (adjustedNum < 10) {
                adjustedNum += (10 - adjustedNum) / 10;
            }
            result = Math.log(adjustedNum) / Math.LN10;
            return isNegative ? -result : result;
        };
        H.Axis.prototype.lin2log = function (num) {
            var isNegative = num < 0,
                absNum = Math.abs(num),
                result = Math.pow(10, absNum);
            if (result < 10) {
                result = (10 * (result - 1)) / (10 - 1);
            }
            return isNegative ? -result : result;
        };
    }(Highcharts));

    Highcharts.setOptions({
        lang: {
            decimalPoint: '.',
            thousandsSeparator: ' '
        }
    });
    Highcharts.chart('highchart_container', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Обзор рынка технологий'
      },
      xAxis: {
        categories: avCategories,
        crosshair: true
      },
      yAxis: {
        type: (($("#togglelinearprice:checked").length)?'linear':'logarithmic'),
        min: 0,
        title: {
          text: '$'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>$ {point.y:,.0f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: avSeries
    });
  }

  function main(){
    $('div.content > div:nth-child(2)').first().after('<div id="highchart_container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>');
    var btnRefresh = $('<input type="button" value="Обновить график">').click(function(){
      refreshGraph();
    });
    $('div.content > div:nth-child(2)').first().after('<input id="togglelinearprice" type="checkbox" checked> <label for="togglelinearprice">linear price</label>');
    $('div.content > div:nth-child(2)').first().after(btnRefresh);
    
    $("#togglelinearprice").change(function(){
      var checked = $("#togglelinearprice:checked").length;
      if(!checked){
        $('#highchart_container').highcharts().yAxis[0].update({ type: 'logarithmic'});
      } else {
        $('#highchart_container').highcharts().yAxis[0].update({ type: 'linear'});
      }
    });
  }
  function addJS() {
    var css = document.createElement("script");
    css.setAttribute("type", "text/javascript");
    css.setAttribute("src", "https://code.highcharts.com/highcharts.js");
    css.addEventListener('load', function () {
      main();
    }, false);
    document.body.appendChild(css);
  }

  addJS();
}

if(window.top == window) {
  var script = document.createElement("script");
  script.textContent = '(' + run.toString() + ')();';
  document.documentElement.appendChild(script);
}