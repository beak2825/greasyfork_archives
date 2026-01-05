// ==UserScript==
// @name           Virtonomica: фильтр технологий в управлении
// @namespace      virtonomica
// @version 	   1
// @description    Добавляет фильтр для технологий на стр управления
// @include        http*://virtonomic*.*/*/main/company/view/*/unit_list/technology/*/*
// @downloadURL https://update.greasyfork.org/scripts/27197/Virtonomica%3A%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D0%B9%20%D0%B2%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/27197/Virtonomica%3A%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D0%B9%20%D0%B2%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B8.meta.js
// ==/UserScript==

var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

	var filterByCountry = '<option value="0">&nbsp;</option>';
	var filterByRegion = '<option value="0">&nbsp;</option>';
	var filterByTown = '<option value="0">&nbsp;</option>';
	var filterByUnitName = '<option value="0">&nbsp;</option>';
	var filterByUrTehn = '<option value="0">&nbsp;</option>';
	var filterByUrTehnMen = '<option value="0">&nbsp;</option>';
	/////////////////
	var countries = new Array();
    $('table[class="list"] > tbody > tr > td:nth-child(2) > img').each(function(){
		var img = $(this);
		var country = img.attr('title');
		countries[country] = 1;
    });
	for (key in countries) {
		filterByCountry = filterByCountry + '<option>'+key+'</option>';
	}
	/////////////////
	var regions = new Array();
    $('table[class="list"] > tbody > tr > td:nth-child(2)').each(function(){
		var cell = $(this);
        var first = cell.html().indexOf('&nbsp;') + 6;
        var second = cell.html().indexOf('<br>');
        var region = cell.html().substr(first, second - first);
		regions[region] = 1;
    });
	for (key in regions) {
		if(key != ''){
			filterByRegion = filterByRegion + '<option>'+key+'</option>';
		}
	}
	/////////////////
	var towns = new Array();
    $('table[class="list"] > tbody > tr > td:nth-child(2) > b').each(function(){
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
	var unitNames = new Array();
    $('table[class="list"] > tbody > tr > td:nth-child(3) > div:nth-child(1)> a > img').each(function(){
		var img = $(this);
        var unitName = img.attr('title');
		unitNames[unitName] = 1;
    });
	for (key in unitNames) {
		if(key != ''){
			filterByUnitName = filterByUnitName + '<option>'+key+'</option>';
		}
	}
	/////////////////
	var unitTehns = new Array();
	  $('table[class="list"] > tbody > tr > td:nth-child(5)').each(function(){
		var cell = $(this);
        var unitTehn = parseInt(cell.text());
		unitTehns[unitTehn] = 1;
    });
	for (key in unitTehns) {
		if(key != ''){
			filterByUrTehn = filterByUrTehn + '<option>'+key+'</option>';
		}
	}
	for (key in unitTehns) {
		if(key != ''){
			filterByUrTehnMen = filterByUrTehnMen + '<option><'+key+'</option>';
		}
	}
	/////////////////
	
	
	
	
	var svToggleForVisible = '<label><input id="toggleForVisible" type="checkbox">Выбрать отфильтрованные</label>';
	/////////////////
    $('form:first').first().before('<select id="filterByCountry">'+filterByCountry+'</select>');  
    $('form:first').first().before('<select id="filterByRegion">'+filterByRegion+'</select>');  
    $('form:first').first().before('<select id="filterByTown">'+filterByTown+'</select>');
    $('form:first').first().before('<select id="filterByUnitName">'+filterByUnitName+'</select>'); 
	  $('form:first').first().before('<select id="filterByUrTehn">'+filterByUrTehn+'</select>'); 
		  $('form:first').first().before('<select id="filterByUrTehnMen">'+filterByUrTehnMen+'</select>'); 
  	 $('form:first').first().before(svToggleForVisible);

	///////////////// 
  	$('#toggleForVisible').change( function(){
		var qty = parseFloat($('#qtyForActiveVisible').val(),10) || 1;
		var newVal = $(this).is(':checked');
		//	console.log(newVal);
		$('input[type="checkbox"][name^="units"]:visible').each(function() {
			var o = $(this);
			if(newVal != $(this).is(':checked')){
				$(this).click();
			}
		});
	});
	$('#toggleForVisible').change( function(){
	
		});
	
	///////////////// 
	function filterRowBy(){
		$('table[class="list"]:first > tbody > tr[class]').each(function() {
			var tableRow = $(this);
			var hide = false;

			if(!hide){
				var search = $('#filterByCountry').val();
				var img = $('td:nth-child(2) > img', tableRow);
				var country = img.attr('title');
				if (search == '0' || country == search ){
					hide = false;
				} else {
					hide = true;
				}
			}
			if(!hide){
				var search = $('#filterByRegion').val();
				var cell = $('td:nth-child(2)', tableRow);
				var first = cell.html().indexOf('&nbsp;') + 6;
				var second = cell.html().indexOf('<br>');
				var region = cell.html().substr(first, second - first);
				if (search == '0' || search == region ){
					hide = false;
				} else {
					hide = true;
				}
			}
			if(!hide){
				var search = $('#filterByTown').val();
				var cell = $('td:nth-child(2) > b', tableRow);
				var town = cell.text();
				if (search == '0' || search == town) {
					hide = false;
				} else {
					hide = true;
				}
			}
			if(!hide){
				var search = $('#filterByUnitName').val();
				var title = $('td:nth-child(3) >div:nth-child(1)> a > img', tableRow).attr('title');
				if (search == '0' || title == search ){
					hide = false;
				} else {
					hide = true;
				}
			}
		if(!hide){
				var search = $('#filterByUrTehn').val();
				var cell = $('td:nth-child(5)', tableRow);
			  var urtexn=parseInt(cell.text());
				if (search == '0' || urtexn == search ){
					hide = false;
				} else {
					hide = true;
				}
			}	
			if(!hide){
				var search = $('#filterByUrTehnMen').val();
				search=parseInt(search.replace(/\</g, ""));
				var cell = $('td:nth-child(5)', tableRow);
			  var urtexn=parseInt(cell.text());
				if (search == '0' || urtexn < search ){
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
	
	$('#filterByCountry').change( function(){
		filterRowBy();
	});
	$('#filterByRegion').change( function(){
		filterRowBy();
	});
	$('#filterByTown').change( function(){
		filterRowBy();
	});
	$('#filterByUnitType').change( function(){
		filterRowBy();
	});
	$('#filterByUnitName').change( function(){
		filterRowBy();
	});
		$('#filterByUrTehn').change( function(){
		filterRowBy();
	});
			$('#filterByUrTehnMen').change( function(){
		filterRowBy();
	});
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}