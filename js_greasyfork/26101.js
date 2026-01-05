// ==UserScript==
// @name        GA special symbols
// @namespace   glav.su
// @description Добавляет к редактору панель с набором спец. символов.
// @include     https://glav.su/forum/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26101/GA%20special%20symbols.user.js
// @updateURL https://update.greasyfork.org/scripts/26101/GA%20special%20symbols.meta.js
// ==/UserScript==
$(document).ready(function(){
	if(typeof $.sceditor == 'function' && $("div.sceditor-group").length > 0){
		function addStyle(styleText) {
			var style = document.createElement('style');
			if (document.head) {
				document.head.appendChild(style);
				style.innerHTML = styleText;
			}
		}
		addStyle([
			'.spec_symbol {',
				'cursor: pointer;',
				'display: inline-block;',
				'border: 1px solid #eee;',
				'padding: 5px;',
				'background-color: #fff;',
				'color: black;',
				'font-size: 16px;',
				'width: 16px;',
				'height: 16px;',
				'text-align: center;',
				'text-indent: 0px;',
				'vertical-align: middle;',
				'line-height: 1;',
			'}',
			'.spec_symbol:hover {',
				'background-color: #ddd;',
			'}',
			'.spec_button {',
				'background-color: #eee;',
				'background-clip: padding-box;',
				'border: 1px solid #ccc;',
				'border-radius: 0px;',
				'cursor: pointer;',
				'display: block;',
				'float: left;',
				'height: 24px;',
				'margin: 0px 1px 0px 0px;',
				'padding: 0;',
				'text-decoration: none;',
				'width: 24px;',
				'-moz-background-clip: padding;',
				'-moz-border-radius: 0px;',
				'-webkit-background-clip: padding-box;',
				'-webkit-border-radius: 0px;',
			'}',
			'.spec_button:hover {',
				'background-color: #ccc;',
				'text-decoration: none;',
			'}',
		].join(''));
		var symbols = [
			{s: '©', d: 'Copyright'},{s: '®', d: 'Reserved'},{s: '™', d: 'Trade Mark'},{s: '€', d: 'Евро'},{s: '£', d: 'Фунт'},{s: '¥', d: 'Йена'},
			{s: '§', d: 'Параграф'},{s: '«', d: 'Кавычка «уголки»'},{s: '»', d: 'Кавычка «уголки»'},{s: '́', d: 'Ударение'},{s: '–', d: 'Тире En Dash'},{s: '—', d: 'Тире Em Dash'},
			{s: '¹', d: 'Первая степень'},{s: '²', d: 'Квадрат'},{s: '³', d: 'Куб'},{s: '·', d: 'Точка по центру'},{s: '•', d: 'Большая точка (bullet)'},{s: '…', d: 'Троеточие'},
			{s: '±', d: 'Плюс-минус'},{s: '≈', d: 'Примерно равно'},{s: '≠', d: 'Не равно'},{s: '≡', d: 'Тождественно равно'},{s: '≤', d: 'Меньше или равно'},{s: '≥', d: 'Больше или равно'},
			{s: '°', d: 'Градус'},{s: '√', d: 'Корень'},{s: '∫', d: 'Интеграл'},{s: 'µ', d: 'Мю'},{s: 'π', d: 'Пи'},{s: 'ω', d: 'Омега'},
			{s: '∑', d: 'Сумма'},{s: 'λ', d: 'Лямбда'},{s: '∆', d: 'Дельта'},{s: '∂', d: 'Дифференциал'},{s: '∞', d: 'Бесконечность'},{s: 'ε', d: 'Эпсилон'},
			{s: '¼', d: 'Четверть'},{s: '½', d: 'Одна вторая'},{s: '¾', d: 'Три четверти'},{s: '⅓', d: 'Одна треть'},{s: '⅔', d: 'Две трети'},{s: '⅛', d: 'Одна восьмая'},
			{s: '←', d: 'Стрелка влево'},{s: '↑', d: 'Стрелка вверх'},{s: '→', d: 'Стрелка вправо'},{s: '↓', d: 'Стрелка вниз'},{s: '↔', d: 'Стрелка влево-вправо'},{s: '↕', d: 'Стрелка вверх-вниз'},
		];
 		var $symbols_box = $('<div id="symbols_box" style="cursor: pointer; display: none; border: 1px solid #aaa; padding: 5px 2px; white-space: nowrap; border-radius: 5px; position: absolute; box-shadow: 3px 3px 10px #444; background-color: #fff; background-image: none; width: auto; height: auto;">')
				.mouseenter(function(){ $symbols_box.under_mouse = true; })
				.mouseleave(function(){ $symbols_box.under_mouse = false; });
		$symbols_box.under_mouse = false;
		$(document.body).click(function(){
			if(!$symbols_box.under_mouse){
				$symbols_box.hide();
			} 
		});
		$('#messageBBCodeForm').find('textarea').sceditor('instance').focus(function(){
			$symbols_box.hide();
		});
		var $symbols_button = $('<a class="spec_button" title="Специальные символы">')
			.append($('<div>')
				.css({'background-image': "url(/files/messages/f2b0cbedeeafbe675883cd6a311c7c67.gif)",
					height: "24px", width: "24px", display: "block", })
			)
			.mouseenter(function(){ $symbols_box.under_mouse = true; })
			.mouseleave(function(){ $symbols_box.under_mouse = false; })
			.click(function(){
				$("#symbols_box").toggle();
			})
			.appendTo( $($("div.sceditor-group")[0]) );
		$symbols_box.appendTo( $($("div.sceditor-toolbar")[0]) );
		var i = 0;
		$("#symbols_box").append('<br />');
		$.each(symbols, function(sidx, sym){
			$('<span class="spec_symbol" title="'+sym.d+'">'+sym.s+'</span>')
				.click(function(){
					$('#messageBBCodeForm').find('textarea').sceditor('instance').insert(sym.s);
					$("#symbols_box").hide();
				})
				.appendTo($("#symbols_box"));
			if( ++i % 6 == 0 ) $("#symbols_box").append('<br />');
		});
		$('<a class="spec_button" title="Ударение">')
			.append($('<div>')
				.css({'background-image': "url(/files/messages/fcceb9e0d812176b96f1da874b41eb40.gif)",
					height: "24px", width: "24px", display: "block", })
			)
			.click(function(){
				$('#messageBBCodeForm').find('textarea').sceditor('instance').insert('́');
			})
			.appendTo( $($("div.sceditor-group")[0]) );
		$('<a class="spec_button" title="Тире">')
			.append($('<div>–</div>')
				.css({ 'text-indent': "0", color: "#000", 'text-align': "center", 'padding-top': "10px",
					height: "24px", width: "24px", display: "block", })
			)
			.click(function(){
				$('#messageBBCodeForm').find('textarea').sceditor('instance').insert('–');
			})
			.appendTo( $($("div.sceditor-group")[0]) );
	}
});