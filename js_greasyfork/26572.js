// ==UserScript==
// @name           Virtonomica: фильтр для отчета "энергопотребление" в офисе
// @namespace      virtonomica
// @version        1.1
// @description    Фильтр для отчета "энергопотребление" в офисе
// @include        http*://*virtonomic*.*/*/main/unit/view/*/energy
// @downloadURL https://update.greasyfork.org/scripts/26572/Virtonomica%3A%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%B4%D0%BB%D1%8F%20%D0%BE%D1%82%D1%87%D0%B5%D1%82%D0%B0%20%22%D1%8D%D0%BD%D0%B5%D1%80%D0%B3%D0%BE%D0%BF%D0%BE%D1%82%D1%80%D0%B5%D0%B1%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%22%20%D0%B2%20%D0%BE%D1%84%D0%B8%D1%81%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/26572/Virtonomica%3A%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%B4%D0%BB%D1%8F%20%D0%BE%D1%82%D1%87%D0%B5%D1%82%D0%B0%20%22%D1%8D%D0%BD%D0%B5%D1%80%D0%B3%D0%BE%D0%BF%D0%BE%D1%82%D1%80%D0%B5%D0%B1%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%22%20%D0%B2%20%D0%BE%D1%84%D0%B8%D1%81%D0%B5.meta.js
// ==/UserScript==
var run = function() {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;
  
  //резделитель разрядов
  function commaSeparateNumber(val, sep){
    val = parseFloat(val).toFixed(2);
    var separator = sep || ' ';
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1"+separator);
    }
    return val;
  }
  
  var filterByTown = '<option value="0">&nbsp;</option>';
  var filterByUnitType = '<option value="0">&nbsp;</option>';
  var filterByUnitName = '<option value="0">&nbsp;</option>';

  /////////////////
  var towns = new Array();
  $('table[class="unit-list-2014"] > tbody > tr > td:nth-child(2)').each(function(){
    var cell = $(this);
    var town = cell.html().split('<')[0].trim();
    towns[town] = 1;
  });
  for (key in towns) {
    if(key != ''){
      filterByTown = filterByTown + '<option>'+key+'</option>';
    }
  }
  /////////////////
  var unitNames = new Array();
  $('table[class="unit-list-2014"] > tbody > tr > td > a').each(function(){
    var link = $(this);
    var unitName = link.text();
    unitNames[unitName] = 1;
  });
  for (key in unitNames) {
    if(key != ''){
      filterByUnitName = filterByUnitName + '<option>'+key+'</option>';
    }
  }
  /////////////////
  $('table[class="unit-list-2014"]').first().before('<select id="filterByTown">'+filterByTown+'</select>');  
  $('table[class="unit-list-2014"]').first().before('<select id="filterByUnitName">'+filterByUnitName+'</select>'); 


  ///////////////// 
  function filterRowBy(){
    var nvEnegrySum = 0;
    var nvPrcSum = 0;
    var nvRowCnt = 0;
    
    $('table[class="unit-list-2014"]:first > tbody > tr[class]').each(function() {
      var tableRow = $(this);
      var hide = false;

      if(!hide){
        var search = $('#filterByTown').val();
        var cell = $('> td:nth-child(2)', tableRow);
        var town = cell.html().split('<')[0].trim();
        if (search == '0' || search == town) {
          hide = false;
        } else {
          hide = true;
        }
      }
      if(!hide){
        var search = $('#filterByUnitName').val();
        var title = $('td > a', tableRow).text();
        if (search == '0' || title == search ){
          hide = false;
        } else {
          hide = true;
        }
      }
      

      if (hide && $('> td#table_summary', tableRow).length === 0){
        tableRow.hide();
      } else {
        tableRow.show();
        
        if($('> td#table_summary', tableRow).length === 0){
          nvEnegrySum += parseFloat($('> td.alerts', tableRow).html().split('<')[0].trim().replace(/\s+/,''));
          nvPrcSum += parseFloat($('> td.alerts', tableRow).html().split('$')[1].trim().replace(/\s+/,''));
          ++nvRowCnt;
        }
      }
    });
    //avg
	var nvPrcAvg = (nvPrcSum / nvRowCnt).toFixed(2);
    $('#table_summary').html(commaSeparateNumber(nvEnegrySum) +' МВт*ч x <span style="COLOR: red;">$'+ commaSeparateNumber(nvPrcAvg) +'</span>');
  }
  function toNumber(spNum){
    return parseFloat(spNum.replace('$','').replace('%','').replace(/\s+/g,''),10);
  }

  $('#filterByTown').change( function(){
    filterRowBy();
  });
  $('#filterByUnitName').change( function(){
    filterRowBy();
  });
  $('table[class="unit-list-2014"]:first > tbody > tr[class]:last').after('<tr class="wborder"><td colspan="4"></td><td class="alerts" id="table_summary"></td><td></td></tr>');
  filterRowBy();
}

if(window.top == window) {
  var script = document.createElement("script");
  script.textContent = '(' + run.toString() + ')();';
  document.documentElement.appendChild(script);
}