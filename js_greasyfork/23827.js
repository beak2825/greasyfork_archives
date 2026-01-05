// ==UserScript==
// @name           Virtonomica: фильтр для отчета "городская энергосеть" (City power grid filter)
// @namespace      virtonomica
// @version        1.0
// @description    Фильтр для отчета "аналитика" - "анализ рынков" - "энергопотребление" - "городская энергосеть"
// @include        http*://*virtonomic*.*/*/main/globalreport/energy/city
// @downloadURL https://update.greasyfork.org/scripts/23827/Virtonomica%3A%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%B4%D0%BB%D1%8F%20%D0%BE%D1%82%D1%87%D0%B5%D1%82%D0%B0%20%22%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D1%81%D0%BA%D0%B0%D1%8F%20%D1%8D%D0%BD%D0%B5%D1%80%D0%B3%D0%BE%D1%81%D0%B5%D1%82%D1%8C%22%20%28City%20power%20grid%20filter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/23827/Virtonomica%3A%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%B4%D0%BB%D1%8F%20%D0%BE%D1%82%D1%87%D0%B5%D1%82%D0%B0%20%22%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D1%81%D0%BA%D0%B0%D1%8F%20%D1%8D%D0%BD%D0%B5%D1%80%D0%B3%D0%BE%D1%81%D0%B5%D1%82%D1%8C%22%20%28City%20power%20grid%20filter%29.meta.js
// ==/UserScript==
var run = function() {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;

  var filterByCountry = '<option value="0">&nbsp;</option>';
  var filterByRegion = '<option value="0">&nbsp;</option>';
  var filterByTown = '<option value="0">&nbsp;</option>';

  /////////////////
  var countries = new Array();
  $('table[class="list"] > tbody > tr > td:nth-child(1) > div > img').each(function(){
    var country = $(this).attr('title');
    countries[country] = 1;
  });
  for (key in countries) {
    filterByCountry = filterByCountry + '<option>'+key+'</option>';
  }
  /////////////////
  var regions = new Array();
  $('table[class="list"] > tbody > tr > td:nth-child(1) > div:nth-child(2)').each(function(){
    var region = $(this).text();
    regions[region] = 1;
  });
  for (key in regions) {
    if(key != ''){
      filterByRegion = filterByRegion + '<option>'+key+'</option>';
    }
  }
  /////////////////
  var towns = new Array();
  $('table[class="list"] > tbody > tr > td:nth-child(1) > div > b').each(function(){
    var cell = $(this);
    var town = cell.text();
    towns[town] = 1;
  });
  for (key in towns) {
    if(key != ''){
      filterByTown = filterByTown + '<option>'+key+'</option>';
    }
  }
  /////////////////
  function getLocale() {
    return (document.location.hostname === 'virtonomica.ru') ? 'ru' : 'en';
  }
  $('table[class="list"]').first().before('<select id="filterByCountry">'+filterByCountry+'</select>');  
  $('table[class="list"]').first().before('<select id="filterByRegion">'+filterByRegion+'</select>');  
  $('table[class="list"]').first().before('<select id="filterByTown">'+filterByTown+'</select>');  

  var locale = getLocale();
  var fromLabel = (locale == 'en') ? 'from' : 'с';
  var toLabel = (locale == 'en') ? 'to' : 'по';

  var filterByRegPriceLabel = $('table[class="list"] > tbody > tr:nth-child(1) > th:nth-child(5)').text();
  var filterByRegPriceLabel2 = $('table[class="list"] > tbody > tr:nth-child(2) > th:nth-child(1) > div > table > tbody > tr > td').text();
  $('table[class="list"]').first().before('<br>'+filterByRegPriceLabel+'('+filterByRegPriceLabel2+')'+':<label for="filterByRegPriceFrom"> '+fromLabel+' </label><input type="number" step="0.01" id="filterByRegPriceFrom" value="1"><label for="filterByRegPriceTo"> '+toLabel+' </label><input type="number" step="0.01" id="filterByRegPriceTo">'); 

  var filterByUserPercentLabel = $('table[class="list"] > tbody > tr:nth-child(1) > th:nth-child(6)').text();
  var filterByUserPercentLabel2 = $('table[class="list"] > tbody > tr:nth-child(2) > th:nth-child(2) > div > table > tbody > tr > td').text();
  $('table[class="list"]').first().before('<br>'+filterByUserPercentLabel+'('+filterByUserPercentLabel2+')'+':<label for="filterByUserPriceFrom"> '+fromLabel+' </label><input type="number" step="0.01" id="filterByUserPriceFrom" value="0"><label for="filterByUserPriceTo"> '+toLabel+' </label><input type="number" step="0.01" id="filterByUserPriceTo" value="">'); 

  var filterByUserPriceLabel3 = $('table[class="list"] > tbody > tr:nth-child(2) > th:nth-child(3) > div > table > tbody > tr > td').text();
  $('table[class="list"]').first().before(' ('+filterByUserPriceLabel3+')'+':<label for="filterByUserPercentFrom"> '+fromLabel+' </label><input type="number" step="0.01" id="filterByUserPercentFrom" value="0"><label for="filterByUserPercentTo"> '+toLabel+' </label><input type="number" step="0.01" id="filterByUserPercentTo" value="75">'); 


  ///////////////// 
  function filterRowBy(){
    $('table[class="list"]:first > tbody > tr[class]').each(function() {
      var tableRow = $(this);
      var hide = false;

      if(!hide){
        var search = $('#filterByCountry').val();
        var img = $('> td:nth-child(1) > div > img', tableRow);
        var country = img.attr('title');
        if (search == '0' || country == search ){
          hide = false;
        } else {
          hide = true;
        }
      }
      if(!hide){
        var search = $('#filterByRegion').val();
        var cell = $('> td:nth-child(1) > div:nth-child(2)', tableRow);
        var region = cell.text();
        if (search == '0' || search == region ){
          hide = false;
        } else {
          hide = true;
        }
      }
      if(!hide){
        var search = $('#filterByTown').val();
        var cell = $('> td:nth-child(1) > div > b', tableRow);
        var town = cell.text();
        if (search == '0' || search == town) {
          hide = false;
        } else {
          hide = true;
        }
      }
      if(!hide && $('#filterByRegPriceFrom').val() != ''){
        var from = parseFloat($('#filterByRegPriceFrom').val());
        var value = toNumber($('> td:nth-child(3)', tableRow).text());

        if (from <= value){
          hide = false;
        } else {
          hide = true;
        }
      }
      if(!hide && $('#filterByRegPriceTo').val() != ''){
        var to = parseFloat($('#filterByRegPriceTo').val());
        var value = toNumber($('> td:nth-child(3)', tableRow).text());

        if (to >= value ){
          hide = false;
        } else {
          hide = true;
        }
      }
      if(!hide && $('#filterByUserPriceFrom').val() != ''){
        var from = parseFloat($('#filterByUserPriceFrom').val());
        var value = toNumber($('> td:nth-child(4)', tableRow).text());

        if (from <= value){
          hide = false;
        } else {
          hide = true;
        }
      }
      if(!hide && $('#filterByUserPriceTo').val() != ''){
        var to = parseFloat($('#filterByUserPriceTo').val());
        var value = toNumber($('> td:nth-child(4)', tableRow).text());

        if (to >= value ){
          hide = false;
        } else {
          hide = true;
        }
      }
      if(!hide && $('#filterByUserPercentFrom').val() != ''){
        var from = parseFloat($('#filterByUserPercentFrom').val());
        var value = toNumber($('> td:nth-child(5)', tableRow).text());

        if (from <= value){
          hide = false;
        } else {
          hide = true;
        }
      }
      if(!hide && $('#filterByUserPercentTo').val() != ''){
        var to = parseFloat($('#filterByUserPercentTo').val());
        var value = toNumber($('> td:nth-child(5)', tableRow).text());

        if (to >= value ){
          hide = false;
        } else {
          hide = true;
        }
      }
      

      if (hide){
        tableRow.hide();
      } else {
        tableRow.show();
      }
    });
  }
  function toNumber(spNum){
    return parseFloat(spNum.replace('$','').replace('%','').replace(/\s+/g,''),10);
  }

  $('#filterByCountry').change( function(){
    filterRowBy();
  });
  $('#filterByRegion').change( function(){
    filterRowBy();
  });
  $('#filterByTown').change( function(){
    filterRowBy();
  });
  $('#filterByRegPriceFrom').keyup( function(){
    filterRowBy();
  });
  $('#filterByRegPriceTo').keyup( function(){
    filterRowBy();
  });
  $('#filterByUserPercentFrom').keyup( function(){
    filterRowBy();
  });
  $('#filterByUserPercentTo').keyup( function(){
    filterRowBy();
  });
  $('#filterByUserPriceFrom').keyup( function(){
    filterRowBy();
  });
  $('#filterByUserPriceTo').keyup( function(){
    filterRowBy();
  });
  filterRowBy();
}

if(window.top == window) {
  var script = document.createElement("script");
  script.textContent = '(' + run.toString() + ')();';
  document.documentElement.appendChild(script);
}