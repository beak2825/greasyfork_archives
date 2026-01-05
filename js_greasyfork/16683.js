// ==UserScript==
// @name           Virtonomica: фильтр по количеству фактически нанятого персонала.
// @namespace      virtonomica
// @version        1.4
// @description    Фильтр по количеству фактически нанятого персонала на странице Управление -> Персонал.
// @include        http*://virtonomic*.*/*/main/company/view/*/unit_list/employee
// @include        http*://virtonomic*.*/*/main/company/view/*/unit_list/employee/salary
// @downloadURL https://update.greasyfork.org/scripts/16683/Virtonomica%3A%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%BF%D0%BE%20%D0%BA%D0%BE%D0%BB%D0%B8%D1%87%D0%B5%D1%81%D1%82%D0%B2%D1%83%20%D1%84%D0%B0%D0%BA%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%20%D0%BD%D0%B0%D0%BD%D1%8F%D1%82%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/16683/Virtonomica%3A%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%BF%D0%BE%20%D0%BA%D0%BE%D0%BB%D0%B8%D1%87%D0%B5%D1%81%D1%82%D0%B2%D1%83%20%D1%84%D0%B0%D0%BA%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%20%D0%BD%D0%B0%D0%BD%D1%8F%D1%82%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB%D0%B0.meta.js
// ==/UserScript==
var run = function() {

	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;

	function getRealm(){
		var svHref = window.location.href;
        var matches = svHref.match(/\/(\w+)\/main\/unit\/view\//);
		return matches[1];
	}	
	function getUnitId(){
		var svHref = window.location.href;
        var matches = svHref.match(/\/main\/unit\/view\/(\d+)\//);
		return matches[1];
	}
	function getLast(str){
        var matches = str.match(/\/(\d+)$/);
		return matches[1];
	}
	Object.size = function(obj) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	};
	function isObject(item) {
		//console.log("item = " + (typeof item === "object" && Object.size(item) == 1 && item !== null));
		return (typeof item === "object" && Object.size(item) == 1 && item !== null);
	}
	function checkAll(chVal){
		//console.log("chVal = " + chVal);
		$('table.list > tbody > tr > td:nth-child(1) > input[type="checkbox"]').each(function() {
			var rowCh = $(this);
			var link = $('> td > input[name^="qnt["]', rowCh.parent().parent());
			var selVal = $('#actual_worker_cnt').val();
			if(selVal === '' || parseFloat(selVal) === parseFloat(link.val())){
				//console.log("rowCh = " + rowCh.prop('checked'));
				//console.log("link = " + link.val());
				rowCh.prop('checked', chVal);
			} else {
				rowCh.prop('checked', !chVal);
			}
		});
	}
	var panel = $('<td colspan="2" cellpadding="0" cellspacing="0" height="0" width="0">');
	var ops = '';
	var vals = [];
	var counts = [];
	$('table.list > tbody > tr > td > input[name^="qnt["]').each(function() {
		var link = $(this);
		//console.log("link = " + link.val());
		if($.inArray(link.val(), vals) == -1){
			vals.push(link.val());
			counts[link.val()] = 1;
		} else {
			counts[link.val()] += 1;
		}
	});
	vals.sort(function(a, b) {
		return parseFloat(a) - parseFloat(b);
	});
	var valsLength = vals.length;
	for (var i = 0; i < valsLength; i++) {
		ops += '<option value="'+vals[i]+'">'+vals[i]+' ('+counts[vals[i]]+')</option>';
	}
	var select = $('<select id="actual_worker_cnt">').change(function() {
		var selVal = $(this).val();
		//console.log("selVal = " + selVal);
		$('table.list > tbody > tr > td > input[name^="qnt["]').each(function() {
			var link = $(this);
			//console.log("link = " + link.val());
			if(selVal === '' || parseFloat(selVal) === parseFloat(link.val())){
				link.parent().parent().show();
			} else {
				link.parent().parent().hide();
			}
		});
		if(selVal === ''){
			checkAll(false);
		} else{
			checkAll(true);
		}
	}).append('<option value=""></option>' + ops);
	
	var checker = $('<input type=checkbox>').change(function() {
		var chVal = $(this).prop('checked');
		checkAll(chVal);
	});
	panel.append(select);
	//panel.append(checker);
	var row = $('<tr>');
	row.append(panel);
	$('table.list > tbody > tr:nth-child(3) > th:nth-child(2) > div > table > tbody > tr > td.title-ordertool').parent().parent().append(row);
}

if(window.top == window) {
	var script = document.createElement("script");
	script.textContent = '(' + run.toString() + ')();';
	document.documentElement.appendChild(script);
}