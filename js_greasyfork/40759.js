// ==UserScript==
// @name           Virtonomica: изменение размера подразделения на произвольное количество блоков
// @namespace      virtonomica
// @version 	   1.03
// @description    Добавляет в окно изменения размера строку с полем ввода количества блоков
// @include        http*://*virtonomic*.*/*/window/unit/upgrade/*
// @downloadURL https://update.greasyfork.org/scripts/40759/Virtonomica%3A%20%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%80%D0%B0%20%D0%BF%D0%BE%D0%B4%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%BD%D0%B0%20%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%BA%D0%BE%D0%BB%D0%B8%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%BE%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/40759/Virtonomica%3A%20%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B0%D0%B7%D0%BC%D0%B5%D1%80%D0%B0%20%D0%BF%D0%BE%D0%B4%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%BD%D0%B0%20%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%BA%D0%BE%D0%BB%D0%B8%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%BE%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%BE%D0%B2.meta.js
// ==/UserScript==

var run = function() {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;

  
  //резделитель разрядов
  function commaSeparateNumber(val, sep){
    var separator = sep || ' ';
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1"+separator);
    }
    return val;
  }
  const defaultRow = $('body > form > table > tbody > tr > td:nth-child(1) > input[type="radio"][value="0"]');
  const prevRow = $('body > form > table > tbody > tr > td:nth-child(1) > input[type="radio"][value="1"]');
  
  const count_label = defaultRow.parent().next().next().text().replace(/^[\d\s]+/g, '');

  const default_worker_count = parseFloat(defaultRow.parent().next().next().text().replace(/\s+/g, ''));
  const default_max_equip_count = parseFloat(defaultRow.parent().next().next().next().text().replace(/\s+/g, ''));
  const default_max_worker_count = parseFloat(defaultRow.parent().next().next().next().next().text().replace(/\s+/g, ''));
  
  const worker_count_per_block = parseFloat(prevRow.parent().next().next().text().replace(/\s+/g, '')) - default_worker_count ;
  const max_equip_count_per_block = parseFloat(prevRow.parent().next().next().next().text().replace(/\s+/g, '')) - default_max_equip_count ;
  const max_worker_count_per_block = parseFloat(prevRow.parent().next().next().next().next().text().replace(/\s+/g, '')) - default_max_worker_count ;
  
  defaultRow.parent().parent().before('<tr class="zebra odd" style="COLOR: navy; FONT-WEIGHT: bold;">'
		+ '<td><input id="manual_upgrade_delta" type="radio" name="upgrade[delta]" value="0" checked="checked"></td>'
		+ '<td align="right" width="1%"><input id="manual_input_for_block_count" size="1" value="0" type="number" step="1" ></input></td>'
		+ '	<td id="manual_worker_count">' + commaSeparateNumber(default_worker_count) + ' ' + count_label + '</td>'
		+ '<td align="right" class="nowrap" id="manual_max_equip_count">' + commaSeparateNumber(default_max_equip_count) + '</td>'
		+ '<td align="right" class="nowrap" id="manual_max_worker_count">' + commaSeparateNumber(default_max_worker_count) + '</td>'
		+ '<td align="right" class="nowrap"></td>'
		+ '<td align="right" class="nowrap"></td>'
		+ '<td align="right" class="nowrap"></td>'
		+ '<td align="right" class="nowrap"></td>'
	+ '</tr>'); 
  
  $('#manual_input_for_block_count').change( function(){
		const qty = parseFloat($(this).val(),10) || 0;
        const worker_count = default_worker_count + qty * worker_count_per_block;
        const max_equip_count = default_max_equip_count + qty * max_equip_count_per_block;
        const max_worker_count = default_max_worker_count + qty * max_worker_count_per_block;
		console.log(max_worker_count);
		$('#manual_upgrade_delta').val(qty);
		$('#manual_upgrade_delta').checked = true;
		$('#manual_worker_count').html(commaSeparateNumber(worker_count) + ' ' + count_label);
		$('#manual_max_equip_count').html(commaSeparateNumber(max_equip_count));
		$('#manual_max_worker_count').html(commaSeparateNumber(max_worker_count));
	});
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}