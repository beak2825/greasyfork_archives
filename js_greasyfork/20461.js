// ==UserScript==
// @name           Virtonomica: фильтр в окне просмотра компании другого игрока
// @namespace      FaustFaustov
// @version 	   1.01
// @description    Добавляет фильтр в окно просмотра компании другого игрока
// @include        http://*virtonomic*.*/*/main/company/view/*
// @exclude        http://*virtonomic*.*/*/main/company/view/*/unit_list
// @downloadURL https://update.greasyfork.org/scripts/20461/Virtonomica%3A%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%B2%20%D0%BE%D0%BA%D0%BD%D0%B5%20%D0%BF%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B0%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%B0%D0%BD%D0%B8%D0%B8%20%D0%B4%D1%80%D1%83%D0%B3%D0%BE%D0%B3%D0%BE%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/20461/Virtonomica%3A%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%B2%20%D0%BE%D0%BA%D0%BD%D0%B5%20%D0%BF%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80%D0%B0%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%B0%D0%BD%D0%B8%D0%B8%20%D0%B4%D1%80%D1%83%D0%B3%D0%BE%D0%B3%D0%BE%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%B0.meta.js
// ==/UserScript==
//Bug: Paging defailt do not work
//Todo: Fix default paging


var run = function () {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;

  var filterByCountry = '<option value="0">&nbsp;</option>';
  var filterByRegion = '<option value="0">&nbsp;</option>';
  var filterByTown = '<option value="0">&nbsp;</option>';
  var filterByUnitType = '<option value="0">&nbsp;</option>';

  // Set show by 400 by default
  // realm = readCookie('last_realm');
  // var strnsf = window.location.href;
  // strnsf = strnsf.split("/")

    // Set400Url = strnsf[0] + "/" + strnsf[1] + "/main/common/util/setpaging/dbunit/unitListWithProductionGuest/400"
    // console.log(Set400Url)
    // $.ajax({
      // url : Set400Url,
      // async : false,
      // type : 'get',
      // //data : 400,
      // success : function (data) {
        // console.log("Page set for 400 units view")
      // }
    // })

    /////////////////
    var countries = new Array();
  var regions = new Array();
  var towns = new Array();
  $('table[class="unit-list-2014"] > tbody > tr > td:nth-child(2)').each(function () {
    var geo = $(this);
    //console.log(geo)
    var str = geo.attr('title').split(";");
    country = str[0]
      region = str[1]
      town = geo.text().trim()
      //country="c"
      //region="r"
      //console.log("str: ", str,country,region, town)
      countries[country] = 1;
    regions[region] = 1
      towns[town] = 1;
    //console.log(countries)
  });
  //console.log("Countries: ", countries)
  for (key in countries) {
    filterByCountry = filterByCountry + '<option>' + key + '</option>';
  }
  /////////////////
  // var regions = new Array();
  // $('table[class="unit-list-2014"] > tbody > tr > td:nth-child(2)').each(function(){
  // var cell = $(this);
  // var first = cell.html().indexOf('&nbsp;') + 6;
  // var second = cell.html().indexOf('<br>');
  // var region = cell.html().substr(first, second - first);
  // regions[region] = 1;
  // });
  for (key in regions) {
    if (key != '') {
      filterByRegion = filterByRegion + '<option>' + key + '</option>';
    }
  }
  /////////////////
  // var towns = new Array();
  // $('table[class="unit-list-2014"] > tbody > tr > td:nth-child(2) > b').each(function(){
  // var cell = $(this);
  // var town = cell.text();
  // towns[town] = 1;
  // });
  for (key in towns) {
    if (key != '') {
      filterByTown = filterByTown + '<option>' + key + '</option>';
    }
  }
  /////////////////
  var types = new Array();
  $('table[class="unit-list-2014"] > tbody > tr > td:nth-child(3) ').each(function () {
    var row = $(this);

    // var type = row.text();
    var type = row.attr('title').trim()
      //console.log("type: ", type)
      // var matches = row.text().match(/\(([^)]+)\)$/);
      var matches = row.attr('title').match(/\(([^)]+)\)$/);
    if (matches != null && matches.length > 1) {
      type = matches[1];
    }
    types[type] = 1;
  });
  //console.log(types[type]);
  for (key in types) {
    filterByUnitType = filterByUnitType + '<option>' + key + '</option>';
  }
  /////////////////
  var svToggleForVisible = '<input id="toggleForVisible" type="checkbox">';
  var svInputQtyForActiveVisible = '<input id="qtyForActiveVisible" type="text" style="width: 80px;" value="0">';
  /////////////////
  $('table[class="unit-list-2014"]').first().before('<select id="filterByCountry">' + filterByCountry + '</select>');
  $('table[class="unit-list-2014"]').first().before('<select id="filterByRegion">' + filterByRegion + '</select>');
  $('table[class="unit-list-2014"]').first().before('<select id="filterByTown">' + filterByTown + '</select>');
  $('table[class="unit-list-2014"]').first().before('<select id="filterByUnitType">' + filterByUnitType + '</select>');
  $('table[class="unit-list-2014"]:first > tbody > tr:nth-child(1) > th:nth-child(1)').html(svToggleForVisible + svInputQtyForActiveVisible);
  /////////////////
  // $('#toggleForVisible').change( function(){
  // var qty = parseFloat($('#qtyForActiveVisible').val(),10) || 1;
  // var newVal = $(this).is(':checked');
  // //	console.log(newVal);
  // $('input[type="checkbox"][id^="unit_"]:visible').each(function() {
  // var o = $(this);
  // if(newVal != $(this).is(':checked')){
  // //$(this).click();
  // o.attr('checked', newVal);
  // var input = $('#'+ o.attr('id') +'_qty');
  // input.attr('disabled', !o.is(':checked'));
  // input.val(o.is(':checked') ? qty : 0);
  // }
  // });
  // showresult($(this).form);
  // });
  // $('#qtyForActiveVisible').keyup( function(){
  // var qty = parseFloat($(this).val(),10) || 1;
  // //#unit_5616819_qty
  // //console.log(qty);
  // $('input[id$="_qty"]').each(function() {
  // var input = $(this);
  // //console.log(input.prev().val());
  // //console.log(input.is(':visible'));
  // if(!input.is(":disabled") && input.parent().parent().is(":visible")){
  // input.val(qty);
  // }
  // });
  // showresult($(this).form);
  // });
  /////////////////
  function filterRowBy() {
    $('table[class="unit-list-2014"]:first > tbody > tr[class]').each(function () {

      var tableRow = $(this);
      var hide = false;
      //console.log(tableRow)

      if (!hide) {
        var search = $('#filterByCountry').val();
        console.log("Search: ", search)
        var geo = $('td:nth-child(2)', tableRow);
        var str = geo.attr('title').split(";");
        var country = str[0]
          console.log("Country: ", country)
          // var img = $('td:nth-child(2) > img', tableRow);
          // var country = img.attr('title');
          if (search == '0' || country == search) {
            hide = false;
          } else {
            hide = true;
          }
      }
      if (!hide) {
        var search = $('#filterByRegion').val();
        // var cell = $('td:nth-child(2)', tableRow);
        // var first = cell.html().indexOf('&nbsp;') + 6;
        // var second = cell.html().indexOf('<br>');
        // var region = cell.html().substr(first, second - first);
        var geo = $('td:nth-child(2)', tableRow);
        console.log("Str: ", str)
        if (str.length > 1) {
          var str = geo.attr('title').split(";");
          var region = str[1].trim()
            console.log("Search: ", search)
            console.log("Region: ", region)
            if (search == '0' || search == region) {
              hide = false;
            } else {
              hide = true;
            }
        }
      }
      if (!hide) {
        var search = $('#filterByTown').val();
        // var cell = $('td:nth-child(2) > b', tableRow);
        // var town = cell.text();
        var geo = $('td:nth-child(2)', tableRow);

        var town = geo.text().trim()
          // console.log("Search: ", search)
          // console.log("Town: ",town)
          if (search == '0' || search == town) {
            hide = false;
          } else {
            hide = true;
          }
      }
      if (!hide) {
        var search = $('#filterByUnitType').val();
        var row = $('td:nth-child(3)', tableRow);
        console.log(row)
        console.log("Search: ", search)
        // var matches = row.text().match(/\(([^)]+)\)$/);
        // var matches = row.attr('title').match(/\(([^)]+)\)$/);
        var matches = row.attr('title').trim();
        console.log("Matches: ", matches)
        // if (search == '0' || row.text() == search || (matches != null && matches[1] == search) ){
        if (search == '0' || matches == search || (matches != null && matches[1] == search)) {
          hide = false;
        } else {
          hide = true;
        }
      }
      console.log("Hide: ", hide)
      if (hide) {
        tableRow.hide();
      } else {
        tableRow.show();
      }
    });
  }

  $('#filterByCountry').change(function () {
    console.log("Making filter!")
    filterRowBy();
  });
  $('#filterByRegion').change(function () {
    filterRowBy();
  });
  $('#filterByTown').change(function () {
    filterRowBy();
  });
  $('#filterByUnitType').change(function () {
    filterRowBy();
  });
}

if (window.top == window) {
  var script = document.createElement("script");
  script.textContent = '(' + run.toString() + ')();';
  document.documentElement.appendChild(script);
}
