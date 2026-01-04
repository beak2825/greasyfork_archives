// ==UserScript==
// @name         TMVN Squad Hide (CN beta)
// @version      2.2023090501
// @namespace    https://trophymanager.com
// @description  Trophymanager: hide the players who buy wholesale to focus on the main squad
// @match        *trophymanager.com/club/*/squad/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431933/TMVN%20Squad%20Hide%20%28CN%20beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/431933/TMVN%20Squad%20Hide%20%28CN%20beta%29.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const DEFAULT_KEEP_RANGE = [[1, 35]];

	const RANGE_NUMBER_INVALID_ALERT = '填写数值需要遵循如下格式：  [[a, b], [c, d], [e, f]] \n 即中括号中包含一组或多组 [x, y], 其中 x 、 y > 0 且为正整数';

	const LOCAL_STORAGE_KEY = 'TMVN_SQUAD_HIDE_NUMBER';
	const NEW_DIV_ID = 'tmvn_script_squad_hide_div_id';
	const INPUT_ID = 'tmvn_script_squad_hide_input';

	const BUTTON_ID = {
		SAVE: 'tmvn_script_squad_save_button',
		HIDE: 'tmvn_script_squad_hide_button',
	}
	const BUTTON_HIDE_TEXT = {
		HIDE: '隐藏',
		SHOW: '显示'
	}

	try {
		$('.banner_placeholder.rectangle')[0].parentNode.removeChild($('.banner_placeholder.rectangle')[0]);
	} catch (err) {}

	let divContainer = $('.column1')[0];

	let hideArea =
		'<div class="box">' +
		'<div class="box_head"><h2 class="std">隐藏与显示球员</h2></div>' +
		'<div class="box_body">' +
		'<div class="box_shadow"></div>' +
		'<div id="' + NEW_DIV_ID + '" class="content_menu"></div>' +
		'<div class="box_footer"><div></div></div>' +
		'</div>';

	$(".column1").append(hideArea);

	let hideArea_content = '<table>';
	hideArea_content += '<tr><td style="text-align: center;">';
	hideArea_content += '<input id="' + INPUT_ID + '" type="text" class="embossed" style="width: 170px; line-height: 150%; padding: 3px 3px 4px 3px;" placeholder="Number to keep">';
	hideArea_content += '</td></tr>';
	hideArea_content += '<tr><td style="text-align: center;">';
	hideArea_content += '<span id="' + BUTTON_ID.SAVE + '" class="button" style="margin-left: 3px;"><span class="button_border">保存</span></span>';
	hideArea_content += '<span id="' + BUTTON_ID.HIDE + '" class="button" style="margin-left: 3px;"><span class="button_border">' + BUTTON_HIDE_TEXT.HIDE + '</span></span>';
	hideArea_content += '</td></tr>';
	hideArea_content += '</table>';

	$("#" + NEW_DIV_ID).append(hideArea_content);

	let keepRange;
	getKeepRangeFromLocalStorage();
	document.getElementById(BUTTON_ID.SAVE).addEventListener('click', (e) => {
		save();
	});
	document.getElementById(BUTTON_ID.HIDE).addEventListener('click', (e) => {
		toggle();
	});

	function toggle() {
		let btn = $('#' + BUTTON_ID.HIDE)[0];
		if (btn.innerText == BUTTON_HIDE_TEXT.HIDE) {
			let inputValue = $('#' + INPUT_ID)[0].value;
			if (inputValue != '') {
				if (isValidRangeNumber(inputValue)) {
					let keepRange = JSON.parse(inputValue);
					let tdNumberArr = $('.align_center.minishirt.small');
					for (let i = 0; i < tdNumberArr.length; i++) {
						let number = tdNumberArr[i].innerText;
						let isValid = false;
						for (let j = 0; j < keepRange.length; j++) {
							if (Number(number) >= keepRange[j][0] && Number(number) <= keepRange[j][1]) {
								isValid = true;
							}
						}
						if (!isValid) {
							tdNumberArr[i].parentNode.style.display = 'none';
						}
					}
					btn.children[0].innerText = BUTTON_HIDE_TEXT.SHOW;
				} else {
					alert(RANGE_NUMBER_INVALID_ALERT);
				}
			} else {
				alert('Input ranges into textbox');
			}
		} else {
			let tdNumberArr = $('.align_center.minishirt.small');
			for (let i = 0; i < tdNumberArr.length; i++) {
				tdNumberArr[i].parentNode.style.display = '';
			}
			btn.children[0].innerText = BUTTON_HIDE_TEXT.HIDE;
		}
	}

	function getKeepRangeFromLocalStorage() {
		try {
			let lsData = localStorage.getItem(LOCAL_STORAGE_KEY);
			if (lsData == null || lsData == "") {
				lsData = DEFAULT_KEEP_RANGE;
			} else if (isValidRangeNumber(lsData)) {
				lsData = JSON.parse(lsData);
			} else {
				lsData = DEFAULT_KEEP_RANGE;
			}
			$('#' + INPUT_ID).val(JSON.stringify(lsData));
		} catch (e) {
			localStorage.removeItem(LOCAL_STORAGE_KEY);
			$('#' + INPUT_ID).val(JSON.stringify(DEFAULT_KEEP_RANGE));
		}
	}

	function isValidRangeNumber(value) {
		let result = true;
		try {
			let array = JSON.parse(value);
			for (let i = 0; i < array.length; i++) {
				if (isNaN(array[i][0]) || isNaN(array[i][1]) || !isInt(array[i][0]) || !isInt(array[i][1]) || array[i][0] <= 0 || array[i][1] <= 0) {
					throw Exception;
				}
			}
		} catch (e) {
			result = false;
		}
		return result;
	}

	function save() {
		let inputValue = $('#' + INPUT_ID)[0].value;
		if (inputValue == '') {
			localStorage.removeItem(LOCAL_STORAGE_KEY);
			alert('Remove successful');
		} else if (isValidRangeNumber(inputValue)) {
			localStorage.setItem(LOCAL_STORAGE_KEY, inputValue);
			alert('Save successful');
		} else {
			alert(RANGE_NUMBER_INVALID_ALERT);
		}
	}

	function isInt(n) {
		return n % 1 === 0;
	}
})();
