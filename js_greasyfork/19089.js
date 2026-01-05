// ==UserScript==
// @name           Virtonomica: смена названий юнитов через групповые операции
// @version        1.6
// @include        http*://*virtonomic*.*/*/main/company/view/*
// @description    Плагин для https://greasyfork.org/ru/scripts/2843-virtonomica-%D0%B8%D0%BD%D1%84%D0%BE-%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D0%BE%D0%B2%D1%8B%D0%B5-%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8
// @author         cobra3125
// @namespace      virtonomica
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/19089/Virtonomica%3A%20%D1%81%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B9%20%D1%8E%D0%BD%D0%B8%D1%82%D0%BE%D0%B2%20%D1%87%D0%B5%D1%80%D0%B5%D0%B7%20%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D0%BE%D0%B2%D1%8B%D0%B5%20%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/19089/Virtonomica%3A%20%D1%81%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B9%20%D1%8E%D0%BD%D0%B8%D1%82%D0%BE%D0%B2%20%D1%87%D0%B5%D1%80%D0%B5%D0%B7%20%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D0%BE%D0%B2%D1%8B%D0%B5%20%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8.meta.js
// ==/UserScript==

var run = function() {

	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;
	
	function changeName(unitLink, newName) {		
		var data = {};
		var svUrl = unitLink.attr('href').replace('/main/unit/view/', '/window/unit/changename/'); 
		data['unitData[name]'] = newName;
		//console.log("data = " + JSON.stringify(data));
		$.post( svUrl, data )
			.done(function() {
			console.log( "success" );
			if (newName == ""){
				var stdName = unitLink.parent().attr('title');
				unitLink.text(stdName);
			} else {
				unitLink.text(newName);
			}
		})
			.fail(function() {
			console.log( "error" );
		})
			.always(function() {
			//console.log( "always" );
		});
	}
	
	function add() {
		var panel = $('legend:contains("Групповые операции")');
		if(panel.length == 1) {
			//console.log( "1" );
			var btn = $('<button class="js-multisale-button">Переименовать</button>');
			btn.click(function() {
				var selectedRows = $('tr[class~="ui-selected"]');
				if (selectedRows.length == 0) {
					alert('Сначала выберите одно или несколько подразделений');
				} else {
					var newName = prompt("Введите новое название. Можно использовать ### для автонумерации.");
					if (newName !== null) {
						var initCnt = null;
						var nvMinimumIntegerDigits = 0;
						if (newName.indexOf('###') > -1) {
							nvMinimumIntegerDigits = newName.match(/#{3,}/)[0].length;
							initCnt = prompt("Введите начальное значение счётчика", 1);
							if (initCnt !== null) {
								initCnt = parseFloat(initCnt) || 0;
							} else {
								return false;
							}
						}
						selectedRows.each(function() {
							var row = $(this);
							var unitLink = $('> td.info > a', row).first();
							if (nvMinimumIntegerDigits > 0) {
								var counterStr = initCnt.toLocaleString('en-US',{
									style: 'decimal',
									minimumIntegerDigits: nvMinimumIntegerDigits,
									useGrouping: false
								});
								changeName(unitLink, newName.replace(/#{3,}/, counterStr));	
								initCnt++;	
							} else {
								changeName(unitLink, newName);	
							}
						});	
					}	
				}
				return false;
			});
			panel.after(btn);
		}
	}
	
	function waitfor(msec, count) {
		var panel = $('legend:contains("Групповые операции")');
		// Check if condition met. If not, re-check later (msec).
		while (panel.length != 1) {
			count++;
			setTimeout(function() {
				waitfor(msec, count);
			}, msec);
			return;
		}
		// Condition finally met. callback() can be executed.
		//console.log("count = " + count);
		add();
	}
	
	// Wait until idle (busy must be false)
	waitfor(100, 0);
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}