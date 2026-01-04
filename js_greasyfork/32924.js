// ==UserScript==
// @name         sucem-better-cygl
// @namespace    sucem
// @version      0.2
// @description  set the cygl table high light current line. Filter the result and so on.
// @author       shjanken
// @match        http://10.0.0.205/sl/cygl.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32924/sucem-better-cygl.user.js
// @updateURL https://update.greasyfork.org/scripts/32924/sucem-better-cygl.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// add hight light current line to table
	$('.cx tr').mouseover(function(evt){
		var tr$ = $(this);

		tr$.data('ori-bg', tr$.css('background-color'));
		tr$.css('background-color', '#ccc');
	});

	$('.cx tr').mouseout(function() {
		var tr$ = $(this);

		tr$.css('background-color', tr$.data('ori-bg'));
	});

	/**
	根据选择的 受理点 创建一个表格
	这个表格中只包括该受理点的信息
	**/
	function createTableBySelectSLD(sld) {
		$('.cx tr').each(function() {
			var tr$ = $(this);

			// 首先将隐藏状态还原
			tr$.show();

			/**
			如果 ‘对应受理点中的内容不等于制定的受理点’
			隐藏该行内容
			**/
			var result = tr$.find('td:eq(2)').html();
			if(result != sld) {
				tr$.hide();
			}
		});
	}

	$('<button id="filterSldBtn" >只显示对应受理点的结果</button>').insertAfter('#sld');
	$('button#filterSldBtn').bind('click',function(evt){
		evt.stopPropagation();
		evt.preventDefault();

		var sld_value = $('#sld').val();
		createTableBySelectSLD(sld_value);
	});
})();