// ==UserScript==
// @name           Virtonomica: фильтр истории операций с корпоративными сертификатами
// @namespace      virtonomica
// @version 	   1.2
// @description    Добавляет фильтр в историю операций с корпоративными сертификатами
// @include        http*://*virtonomic*.*/*/main/corporation/token
// @downloadURL https://update.greasyfork.org/scripts/27424/Virtonomica%3A%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D0%B8%20%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B9%20%D1%81%20%D0%BA%D0%BE%D1%80%D0%BF%D0%BE%D1%80%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D0%BC%D0%B8%20%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D0%B0%D0%BC%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/27424/Virtonomica%3A%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D0%B8%20%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B9%20%D1%81%20%D0%BA%D0%BE%D1%80%D0%BF%D0%BE%D1%80%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D0%BC%D0%B8%20%D1%81%D0%B5%D1%80%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D0%B0%D0%BC%D0%B8.meta.js
// ==/UserScript==

var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

	var filterByOper = '<option value="0">&nbsp;</option>';
	var filterByUserName = '<option value="0">&nbsp;</option><option value="-">-</option>';
	
	/////////////////
	var usersName = new Array();
    $('div.assetbox > table > tbody > tr > td:nth-child(2) > div > div > table > tbody > tr > td:nth-child(4) > a').each(function(){
		var link = $(this);
		var name = link.text();
		usersName[name] = 1;
    });
	for (key in usersName) {
		filterByUserName = filterByUserName + '<option>'+key+'</option>';
	}
	/////////////////
	var operations = new Array();
    $('div.assetbox > table > tbody > tr > td:nth-child(2) > div > div > table > tbody > tr > td:nth-child(2)').each(function(){
		var text = $(this).text();
		operations[text] = 1;
    });
	for (key in operations) {
		if(key != ''){
			filterByOper = filterByOper + '<option>'+key+'</option>';
		}
	}
	/////////////////
    $('div.plusboxDiv > div.assetbox > table').first().before('<select id="filterByOper">'+filterByOper+'</select>');  
    $('div.plusboxDiv > div.assetbox > table').first().before('<select id="filterByUserName">'+filterByUserName+'</select>');  
    $('div.plusboxDiv > div.assetbox > table').first().before('<input readonly id="filteredSum" type="number"></input>');  
	///////////////// 
	function filterRowBy(){
        var nvSum = 0;
		$('div.assetbox > table > tbody > tr > td:nth-child(2) > div > div > table > tbody > tr[class]').each(function() {
			var tableRow = $(this);
			var hide = false;

			if(!hide){
				var search = $('#filterByOper').val();
				var cell = $(' > td:nth-child(2)', tableRow);
				var text = cell.text().trim();
				if (search == '0' || text == search ){
					hide = false;
				} else {
					hide = true;
				}
			}
			if(!hide){
				var search = $('#filterByUserName').val();
				var link = $(' > td:nth-child(4) > a', tableRow);
				var text = link.text();
				if (search == '0' || search == text || (search === '-' && text == '')){
					hide = false;
				} else {
					hide = true;
				}
			}

			if (hide){
				tableRow.hide();
			} else {
				nvSum += parseFloat($(' > td:nth-child(3) > span', tableRow).text().replace(/\s+/,''));
                
				tableRow.show();
			}
		});
      $('#filteredSum').val(nvSum);
	}
	
	$('#filterByOper').change( function(){
		filterRowBy();
	});
	$('#filterByUserName').change( function(){
		filterRowBy();
	});
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}