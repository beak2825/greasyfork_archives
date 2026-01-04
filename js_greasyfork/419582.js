// ==UserScript==
// @name         TMVN Transfer Value
// @version      5
// @description  Trophymanager: display value of player with infomations like: bank price, ti, routine, rerecb, ratingr5.
// @namespace    https://trophymanager.com
// @match        https://trophymanager.com/transfer/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419582/TMVN%20Transfer%20Value.user.js
// @updateURL https://update.greasyfork.org/scripts/419582/TMVN%20Transfer%20Value.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const CONTROL_ID = {
		R5_MIN: 'tmvn_script_transfer_value_input_filter_r5_min',
		R5_MAX: 'tmvn_script_transfer_value_input_filter_r5_max',
		REC_MIN: 'tmvn_script_transfer_value_input_filter_rec_min',
		REC_MAX: 'tmvn_script_transfer_value_input_filter_rec_max',
		TI_MIN: 'tmvn_script_transfer_value_input_filter_ti_min',
		TI_MAX: 'tmvn_script_transfer_value_input_filter_ti_max',
		SI_MIN: 'tmvn_script_transfer_value_input_filter_si_min',
		SI_MAX: 'tmvn_script_transfer_value_input_filter_si_max',
		AGE_MIN: 'tmvn_script_transfer_value_input_filter_age_min',
		AGE_MAX: 'tmvn_script_transfer_value_input_filter_age_max',
		BID_MAX: 'tmvn_script_transfer_value_input_filter_bid_max',
		BUTTON_FILTER: 'tmvn_script_transfer_value_button_filter',
		BUTTON_CLEAR: 'tmvn_script_transfer_value_button_clear',
	}

	const COLUMN_CLASS = {
		R5: 'tmvn_script_transfer_value_classname_r5',
		TI: 'tmvn_script_transfer_value_classname_ti',
		REC: 'tmvn_script_transfer_value_classname_rec',
		SI: 'tmvn_script_transfer_value_classname_si',
		AGE: 'tmvn_script_transfer_value_classname_age',
		CURRENT_BID: 'tmvn_script_transfer_value_classname_current_bid'
	}

	const FILTER_DIV_ID = 'tmvn_script_transfer_value_filter_div_id';

	const COMPARE = {
		GREATER_OR_EQUAL: '>=',
		SMALLER_OR_EQUAL: '<='
	}

	const APPLICATION_CONST = {
		TRANSFER_LIST_SELECTOR: 'div#transfer_list',
		BP_HEADER_NAME: 'BP',
		TI_HEADER_NAME: 'TI',
		XP_HEADER_NAME: 'XP',
		RREC_HEADER_NAME: 'REC',
		R5_HEADER_NAME: 'R5',
		RATIO_HEADER_NAME: '%',

		TI_PRECISION: 0,
		XP_PRECISION: 1,
		RREC_PRECISION: 3,
		R5_PRECISION: 2
	};

	const ORIGINAL_COLUMN_INDEX = { //for remove
		REC_COLUMN_POSITION: 4,
		CURRENT_BID_COLUMN_POSITION: 7,
	};

	const FINAL_COLUMN_INDEX = { //calculate after remove
		AGE_COLUMN_POSITION: 2,
		SI_COLUMN_POSITION: 4,
		CURRENT_BID_COLUMN_POSITION: 6,

		//addition column: index value base table after remove column
		BP_COLUMN_POSITION: 9,
		TI_COLUMN_POSITION: 10,
		XP_COLUMN_POSITION: 11,
		RREC_COLUMN_POSITION: 12,
		R5_COLUMN_POSITION: 13,
		RATIO_COLUMN_POSITION: 14
	};

	const PositionNames = {
		GOALKEEPER_STRING: 'GK'
	};

	const APP_COLOR = {
		LEVEL_1: "Darkred",
		LEVEL_2: "Black",
		LEVEL_3: "Orange",
		LEVEL_4: "Yellow",
		LEVEL_5: "Blue",
		LEVEL_6: "Aqua",
		LEVEL_7: "White"
	};

	const BP_CLASS = {
		LEVEL_1: 150000000,
		LEVEL_2: 100000000,
		LEVEL_3: 80000000,
		LEVEL_4: 60000000,
		LEVEL_5: 40000000,
		LEVEL_6: 20000000,
		LEVEL_7: 0
	};

	const WA_CLASS = {
		LEVEL_1: 6000000,
		LEVEL_2: 5000000,
		LEVEL_3: 4000000,
		LEVEL_4: 3000000,
		LEVEL_5: 2000000,
		LEVEL_6: 1000000,
		LEVEL_7: 0
	};

	const XP_CLASS = {
		LEVEL_1: 90,
		LEVEL_2: 75,
		LEVEL_3: 60,
		LEVEL_4: 45,
		LEVEL_5: 30,
		LEVEL_6: 15,
		LEVEL_7: 0
	};

	const REC_CLASS = {
		LEVEL_1: 5.5,
		LEVEL_2: 5,
		LEVEL_3: 4,
		LEVEL_4: 3,
		LEVEL_5: 2,
		LEVEL_6: 1,
		LEVEL_7: 0
	};

	const R5_CLASS = {
		LEVEL_1: 110,
		LEVEL_2: 100,
		LEVEL_3: 90,
		LEVEL_4: 80,
		LEVEL_5: 70,
		LEVEL_6: 60,
		LEVEL_7: 0
	};

	const TI_CLASS = {
		LEVEL_1: 25,
		LEVEL_2: 20,
		LEVEL_3: 15,
		LEVEL_4: 10,
		LEVEL_5: 5,
		LEVEL_6: 0,
		LEVEL_7: -10
	};

	let observer = new MutationObserver(init);
	observer.observe(document.querySelector(APPLICATION_CONST.TRANSFER_LIST_SELECTOR), {
		childList: true
	});

	function init(mutationRecords) {
		if (document.querySelector(APPLICATION_CONST.TRANSFER_LIST_SELECTOR + ' table') === null) {
			return;
		}
		showFilter();
		try {
			$('.banner_placeholder.rectangle_small')[0].parentNode.removeChild($('.banner_placeholder.rectangle_small')[0]);
		} catch (err) {}

		let playersIDs = getAllIDs();

		removeHeaderColumn(ORIGINAL_COLUMN_INDEX.REC_COLUMN_POSITION);

		addColumnToTable(FINAL_COLUMN_INDEX.BP_COLUMN_POSITION, APPLICATION_CONST.BP_HEADER_NAME);
		addColumnToTable(FINAL_COLUMN_INDEX.TI_COLUMN_POSITION, APPLICATION_CONST.TI_HEADER_NAME, COLUMN_CLASS.TI);
		addColumnToTable(FINAL_COLUMN_INDEX.XP_COLUMN_POSITION, APPLICATION_CONST.XP_HEADER_NAME);
		addColumnToTable(FINAL_COLUMN_INDEX.RREC_COLUMN_POSITION, APPLICATION_CONST.RREC_HEADER_NAME, COLUMN_CLASS.REC);
		addColumnToTable(FINAL_COLUMN_INDEX.R5_COLUMN_POSITION, APPLICATION_CONST.R5_HEADER_NAME, COLUMN_CLASS.R5);
		addColumnToTable(FINAL_COLUMN_INDEX.RATIO_COLUMN_POSITION, APPLICATION_CONST.RATIO_HEADER_NAME);

		playersIDs.map(requestPlayerASI).map((promise, index) => {
			promise.then((player) => {
				/*** remove first ***/
				removeTransferTableCell(index, ORIGINAL_COLUMN_INDEX.REC_COLUMN_POSITION);

				/*** add class ***/
				addClassToTableCell(index, FINAL_COLUMN_INDEX.CURRENT_BID_COLUMN_POSITION, COLUMN_CLASS.CURRENT_BID);
				addClassToTableCell(index, FINAL_COLUMN_INDEX.AGE_COLUMN_POSITION, COLUMN_CLASS.AGE);
				addClassToTableCell(index, FINAL_COLUMN_INDEX.SI_COLUMN_POSITION, COLUMN_CLASS.SI);

				/*** calculate ***/

				let oldASI = getOldASI(player.id);
				let agemonth = player.age + "." + player.month;
				let inBloomAge = (player.age <= 22 && player.month <= 6 ? true : false);
				let bp = BP.compute(player.ASI, player.age, player.month, player.position);
				let ti = TI.compute(player.ASI, oldASI, player.position).toFixed(APPLICATION_CONST.TI_PRECISION);
				let xp = player.xp.toFixed(APPLICATION_CONST.XP_PRECISION);

				/*** present ***/

				if (inBloomAge) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.AGE_COLUMN_POSITION, '<span style="color:Orange;">' + agemonth + '</span>');
				} else {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.AGE_COLUMN_POSITION, agemonth);
				}

				let playerRow = document.querySelector(APPLICATION_CONST.TRANSFER_LIST_SELECTOR + ' tr[id=player_row_' + player.id + ']');
				let currentBid = Number(playerRow.childNodes[FINAL_COLUMN_INDEX.CURRENT_BID_COLUMN_POSITION].childNodes[0].innerHTML.split(',').join(''));

				if (bp >= BP_CLASS.LEVEL_1) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.BP_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_1 + ';">' + (bp / 1000000).toFixed(1) + '</span>');
				} else if (bp >= BP_CLASS.LEVEL_2) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.BP_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_2 + ';">' + (bp / 1000000).toFixed(1) + '</span>');
				} else if (bp >= BP_CLASS.LEVEL_3) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.BP_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_3 + ';">' + (bp / 1000000).toFixed(1) + '</span>');
				} else if (bp >= BP_CLASS.LEVEL_4) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.BP_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_4 + ';">' + (bp / 1000000).toFixed(1) + '</span>');
				} else if (bp >= BP_CLASS.LEVEL_5) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.BP_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_5 + ';">' + (bp / 1000000).toFixed(1) + '</span>');
				} else if (bp >= BP_CLASS.LEVEL_6) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.BP_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_6 + ';">' + (bp / 1000000).toFixed(1) + '</span>');
				} else {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.BP_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_7 + ';">' + (bp / 1000000).toFixed(1) + '</span>');
				}

				if (ti >= TI_CLASS.LEVEL_1) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.TI_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_1 + ';">&nbsp;' + ti + '</span>');
				} else if (ti >= TI_CLASS.LEVEL_2) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.TI_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_2 + ';">&nbsp;' + ti + '</span>');
				} else if (ti >= TI_CLASS.LEVEL_3) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.TI_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_3 + ';">&nbsp;' + ti + '</span>');
				} else if (ti >= TI_CLASS.LEVEL_4) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.TI_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_4 + ';">&nbsp;' + ti + '</span>');
				} else if (ti >= TI_CLASS.LEVEL_5) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.TI_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_5 + ';">&nbsp;' + ti + '</span>');
				} else if (ti >= TI_CLASS.LEVEL_6) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.TI_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_6 + ';">&nbsp;' + ti + '</span>');
				} else {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.TI_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_7 + ';">&nbsp;' + ti + '</span>');
				}

				if (xp >= XP_CLASS.LEVEL_1) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.XP_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_1 + ';">&nbsp;' + xp + '</span>');
				} else if (xp >= XP_CLASS.LEVEL_2) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.XP_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_2 + ';">&nbsp;' + xp + '</span>');
				} else if (xp >= XP_CLASS.LEVEL_3) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.XP_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_3 + ';">&nbsp;' + xp + '</span>');
				} else if (xp >= XP_CLASS.LEVEL_4) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.XP_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_4 + ';">&nbsp;' + xp + '</span>');
				} else if (xp >= XP_CLASS.LEVEL_5) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.XP_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_5 + ';">&nbsp;' + xp + '</span>');
				} else if (xp >= XP_CLASS.LEVEL_6) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.XP_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_6 + ';">&nbsp;' + xp + '</span>');
				} else {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.XP_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_7 + ';">&nbsp;' + xp + '</span>');
				}

				let rec = player.REC.split('<br>');
				var recMax;
				if (rec.length == 2) {
					recMax = Number(rec[0]) >= Number(rec[1]) ? Number(rec[0]) : Number(rec[1]);
				} else {
					recMax = Number(rec[0]);
				}
				if (recMax >= REC_CLASS.LEVEL_1) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.RREC_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_1 + ';">&nbsp;' + player.REC + '</span>');
				} else if (recMax >= REC_CLASS.LEVEL_2) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.RREC_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_2 + ';">&nbsp;' + player.REC + '</span>');
				} else if (recMax >= REC_CLASS.LEVEL_3) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.RREC_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_3 + ';">&nbsp;' + player.REC + '</span>');
				} else if (recMax >= REC_CLASS.LEVEL_4) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.RREC_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_4 + ';">&nbsp;' + player.REC + '</span>');
				} else if (recMax >= REC_CLASS.LEVEL_5) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.RREC_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_5 + ';">&nbsp;' + player.REC + '</span>');
				} else if (recMax >= REC_CLASS.LEVEL_6) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.RREC_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_6 + ';">&nbsp;' + player.REC + '</span>');
				} else {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.RREC_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_7 + ';">&nbsp;' + player.REC + '</span>');
				}

				let r5 = player.R5.split('<br>');
				let r5Max;
				if (r5.length == 2) {
					r5Max = Number(r5[0]) >= Number(r5[1]) ? Number(r5[0]) : Number(r5[1]);
				} else {
					r5Max = Number(r5[0]);
				}
				if (r5Max >= R5_CLASS.LEVEL_1) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.R5_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_1 + ';">&nbsp;' + player.R5 + '</span>');
				} else if (r5Max >= R5_CLASS.LEVEL_2) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.R5_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_2 + ';">&nbsp;' + player.R5 + '</span>');
				} else if (r5Max >= R5_CLASS.LEVEL_3) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.R5_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_3 + ';">&nbsp;' + player.R5 + '</span>');
				} else if (r5Max >= R5_CLASS.LEVEL_4) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.R5_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_4 + ';">&nbsp;' + player.R5 + '</span>');
				} else if (r5Max >= R5_CLASS.LEVEL_5) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.R5_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_5 + ';">&nbsp;' + player.R5 + '</span>');
				} else if (r5Max >= R5_CLASS.LEVEL_6) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.R5_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_6 + ';">&nbsp;' + player.R5 + '</span>');
				} else {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.R5_COLUMN_POSITION, '<span style="color:' + APP_COLOR.LEVEL_7 + ';">&nbsp;' + player.R5 + '</span>');
				}

				if (currentBid > bp) {
					changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.RATIO_COLUMN_POSITION, '&nbsp;' + (currentBid / bp).toFixed(1));
				}
			}).catch((error) => {
				console.log(error);
				changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.AGE_COLUMN_POSITION, "Err");
				changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.BP_COLUMN_POSITION, "Err");
				changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.TI_COLUMN_POSITION, "Err");
				changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.XP_COLUMN_POSITION, "Err");
				changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.R5_COLUMN_POSITION, "Err");
				changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.RREC_COLUMN_POSITION, "Err");
				changeTransferTableCellInnerHTML(index, FINAL_COLUMN_INDEX.RATIO_COLUMN_POSITION, "Err");
			});
		});
	}

	function showFilter() {
		if ($('#' + FILTER_DIV_ID).length > 0)
			return;

		let rightFilterDiv = $('.right_filters')[0];
		let filterDiv = document.createElement('div');
		filterDiv.id = FILTER_DIV_ID;
		rightFilterDiv.appendChild(filterDiv);
		let table = document.createElement('table');
		filterDiv.appendChild(table);
		let tbody = document.createElement('tbody');
		table.appendChild(tbody);

		/*R5*/
		let trR5 = document.createElement('tr');

		let tdR5Label = document.createElement('td');
		tdR5Label.innerText = 'R5: ';

		let tdR5Min = document.createElement('td');
		tdR5Min.innerHTML = '<span style="display: inline-block;"><input id="' + CONTROL_ID.R5_MIN + '" type="text" class="embossed" style="width: 50px; line-height: 100%; padding: 3px 3px 4px 3px;"></span>';
		let tdR5Max = document.createElement('td');
		tdR5Max.innerHTML = '<span style="display: inline-block;"><input id="' + CONTROL_ID.R5_MAX + '" type="text" class="embossed" style="width: 50px; line-height: 100%; padding: 3px 3px 4px 3px;"></span>';

		trR5.appendChild(tdR5Label);
		trR5.appendChild(tdR5Min);
		trR5.appendChild(tdR5Max);
		tbody.appendChild(trR5);

		/*Rec*/
		let trRec = document.createElement('tr');

		let tdRecLabel = document.createElement('td');
		tdRecLabel.innerText = 'REC: ';

		let tdRecMin = document.createElement('td');
		tdRecMin.innerHTML = '<span style="display: inline-block;"><input id="' + CONTROL_ID.REC_MIN + '" type="text" class="embossed" style="width: 50px; line-height: 100%; padding: 3px 3px 4px 3px;"></span>';
		let tdRecMax = document.createElement('td');
		tdRecMax.innerHTML = '<span style="display: inline-block;"><input id="' + CONTROL_ID.REC_MAX + '" type="text" class="embossed" style="width: 50px; line-height: 100%; padding: 3px 3px 4px 3px;"></span>';

		trRec.appendChild(tdRecLabel);
		trRec.appendChild(tdRecMin);
		trRec.appendChild(tdRecMax);
		tbody.appendChild(trRec);

		/*Ti*/
		let trTi = document.createElement('tr');

		let tdTiLabel = document.createElement('td');
		tdTiLabel.innerText = 'TI: ';

		let tdTiMin = document.createElement('td');
		tdTiMin.innerHTML = '<span style="display: inline-block;"><input id="' + CONTROL_ID.TI_MIN + '" type="text" class="embossed" style="width: 50px; line-height: 100%; padding: 3px 3px 4px 3px;"></span>';
		let tdTiMax = document.createElement('td');
		tdTiMax.innerHTML = '<span style="display: inline-block;"><input id="' + CONTROL_ID.TI_MAX + '" type="text" class="embossed" style="width: 50px; line-height: 100%; padding: 3px 3px 4px 3px;"></span>';

		trTi.appendChild(tdTiLabel);
		trTi.appendChild(tdTiMin);
		trTi.appendChild(tdTiMax);
		tbody.appendChild(trTi);

		/*Si*/
		let trSi = document.createElement('tr');

		let tdSiLabel = document.createElement('td');
		tdSiLabel.innerText = 'SI: ';

		let tdSiMin = document.createElement('td');
		tdSiMin.innerHTML = '<span style="display: inline-block;"><input id="' + CONTROL_ID.SI_MIN + '" type="text" class="embossed" style="width: 50px; line-height: 100%; padding: 3px 3px 4px 3px;"></span>';
		let tdSiMax = document.createElement('td');
		tdSiMax.innerHTML = '<span style="display: inline-block;"><input id="' + CONTROL_ID.SI_MAX + '" type="text" class="embossed" style="width: 50px; line-height: 100%; padding: 3px 3px 4px 3px;"></span>';

		trSi.appendChild(tdSiLabel);
		trSi.appendChild(tdSiMin);
		trSi.appendChild(tdSiMax);
		tbody.appendChild(trSi);

		/*Age*/
		let trAge = document.createElement('tr');

		let tdAgeLabel = document.createElement('td');
		tdAgeLabel.innerText = 'Age: ';

		let tdAgeMin = document.createElement('td');
		tdAgeMin.innerHTML = '<span style="display: inline-block;"><input id="' + CONTROL_ID.AGE_MIN + '" type="text" class="embossed" style="width: 50px; line-height: 100%; padding: 3px 3px 4px 3px;"></span>';
		let tdAgeMax = document.createElement('td');
		tdAgeMax.innerHTML = '<span style="display: inline-block;"><input id="' + CONTROL_ID.AGE_MAX + '" type="text" class="embossed" style="width: 50px; line-height: 100%; padding: 3px 3px 4px 3px;"></span>';

		trAge.appendChild(tdAgeLabel);
		trAge.appendChild(tdAgeMin);
		trAge.appendChild(tdAgeMax);
		tbody.appendChild(trAge);

		/*Bid Max*/
		let trBidMax = document.createElement('tr');

		let tdBidMaxLabel = document.createElement('td');
		tdBidMaxLabel.innerText = 'Bid Max: ';

		let tdBidMax = document.createElement('td');
		tdBidMax.colSpan = 2;
		tdBidMax.innerHTML = '<span style="display: inline-block;"><input id="' + CONTROL_ID.BID_MAX + '" type="text" class="embossed" style="width: 143px; line-height: 100%; padding: 3px 3px 4px 3px;"></span>';

		trBidMax.appendChild(tdBidMaxLabel);
		trBidMax.appendChild(tdBidMax);
		tbody.appendChild(trBidMax);

		/*Button*/
		let trButton = document.createElement('tr');

		let tdButton = document.createElement('td');
		tdButton.colSpan = 3;
		tdButton.className = 'align_center';
		tdButton.innerHTML = '<span id="' + CONTROL_ID.BUTTON_FILTER + '" class="button" style="margin-left: 3px;"><span class="button_border">Filter</span></span>' +
			'<span id="' + CONTROL_ID.BUTTON_CLEAR + '" class="button" style="margin-left: 3px;"><span class="button_border">Clear</span></span>';

		trButton.appendChild(tdButton);
		tbody.appendChild(trButton);

		document.getElementById(CONTROL_ID.BUTTON_FILTER).addEventListener('click', (e) => {
			filterPlayer();
		});
		document.getElementById(CONTROL_ID.BUTTON_CLEAR).addEventListener('click', (e) => {
			clearFilter();
		});
	}

	function clearFilter() {
		$('#' + CONTROL_ID.R5_MIN)[0].value = '';
		$('#' + CONTROL_ID.R5_MAX)[0].value = '';
		$('#' + CONTROL_ID.REC_MIN)[0].value = '';
		$('#' + CONTROL_ID.REC_MAX)[0].value = '';
		$('#' + CONTROL_ID.TI_MIN)[0].value = '';
		$('#' + CONTROL_ID.TI_MAX)[0].value = '';
		$('#' + CONTROL_ID.SI_MIN)[0].value = '';
		$('#' + CONTROL_ID.SI_MAX)[0].value = '';
		$('#' + CONTROL_ID.AGE_MIN)[0].value = '';
		$('#' + CONTROL_ID.AGE_MAX)[0].value = '';
		$('#' + CONTROL_ID.BID_MAX)[0].value = '';
	}

	function filterPlayer() {
		let r5Min = $('#' + CONTROL_ID.R5_MIN)[0].value.trim();
		let r5Max = $('#' + CONTROL_ID.R5_MAX)[0].value.trim();

		let recMin = $('#' + CONTROL_ID.REC_MIN)[0].value.trim();
		let recMax = $('#' + CONTROL_ID.REC_MAX)[0].value.trim();

		let tiMin = $('#' + CONTROL_ID.TI_MIN)[0].value.trim();
		let tiMax = $('#' + CONTROL_ID.TI_MAX)[0].value.trim();

		let siMin = $('#' + CONTROL_ID.SI_MIN)[0].value.trim();
		let siMax = $('#' + CONTROL_ID.SI_MAX)[0].value.trim();

		let ageMin = $('#' + CONTROL_ID.AGE_MIN)[0].value.trim();
		let ageMax = $('#' + CONTROL_ID.AGE_MAX)[0].value.trim();

		let bidMax = $('#' + CONTROL_ID.BID_MAX)[0].value.trim();

		if (r5Min == '' && r5Max == '' &&
			recMin == '' && recMax == '' &&
			tiMin == '' && tiMax == '' &&
			siMin == '' && siMax == '' &&
			ageMin == '' && ageMax == '' &&
			bidMax == '') {
			showAllRow();
		} else {
			if ((r5Min != '' && isNaN(r5Min)) || (r5Max != '' && isNaN(r5Max))) {
				alert('R5 must be a number');
				return;
			}
			if ((recMin != '' && isNaN(recMin)) || (recMax != '' && isNaN(recMax))) {
				alert('REC must be a number');
				return;
			}
			if ((tiMin != '' && isNaN(tiMin)) || (tiMax != '' && isNaN(tiMax))) {
				alert('TI must be a number');
				return;
			}
			if ((siMin != '' && isNaN(siMin)) || (siMax != '' && isNaN(siMax))) {
				alert('SI must be a number');
				return;
			}
			if ((ageMin != '' && isNaN(ageMin)) || (ageMax != '' && isNaN(ageMax))) {
				alert('Age must be a number');
				return;
			}
			if (bidMax != '' && isNaN(bidMax)) {
				alert('Bid Max must be a number');
				return;
			}

			let compareArr = [];
			if (r5Min != '') {
				compareArr.push({
					Value: r5Min,
					Compare: COMPARE.GREATER_OR_EQUAL,
					ClassName: COLUMN_CLASS.R5
				});
			}
			if (r5Max != '') {
				compareArr.push({
					Value: r5Max,
					Compare: COMPARE.SMALLER_OR_EQUAL,
					ClassName: COLUMN_CLASS.R5
				});
			}
			if (recMin != '') {
				compareArr.push({
					Value: recMin,
					Compare: COMPARE.GREATER_OR_EQUAL,
					ClassName: COLUMN_CLASS.REC
				});
			}
			if (recMax != '') {
				compareArr.push({
					Value: recMax,
					Compare: COMPARE.SMALLER_OR_EQUAL,
					ClassName: COLUMN_CLASS.REC
				});
			}
			if (tiMin != '') {
				compareArr.push({
					Value: tiMin,
					Compare: COMPARE.GREATER_OR_EQUAL,
					ClassName: COLUMN_CLASS.TI
				});
			}
			if (tiMax != '') {
				compareArr.push({
					Value: tiMax,
					Compare: COMPARE.SMALLER_OR_EQUAL,
					ClassName: COLUMN_CLASS.TI
				});
			}
			if (siMin != '') {
				compareArr.push({
					Value: siMin,
					Compare: COMPARE.GREATER_OR_EQUAL,
					ClassName: COLUMN_CLASS.SI
				});
			}
			if (siMax != '') {
				compareArr.push({
					Value: siMax,
					Compare: COMPARE.SMALLER_OR_EQUAL,
					ClassName: COLUMN_CLASS.SI
				});
			}
			if (ageMin != '') {
				compareArr.push({
					Value: ageMin,
					Compare: COMPARE.GREATER_OR_EQUAL,
					ClassName: COLUMN_CLASS.AGE
				});
			}
			if (ageMax != '') {
				compareArr.push({
					Value: ageMax,
					Compare: COMPARE.SMALLER_OR_EQUAL,
					ClassName: COLUMN_CLASS.AGE
				});
			}
			if (bidMax != '') {
				compareArr.push({
					Value: bidMax,
					Compare: COMPARE.SMALLER_OR_EQUAL,
					ClassName: COLUMN_CLASS.CURRENT_BID
				});
			}

			hideRow(compareArr);
		}
	}

	function hideRow(compareObjArr) {
		let rows = document.querySelectorAll(APPLICATION_CONST.TRANSFER_LIST_SELECTOR + ' tr[id^=player_row]');
		for (let row of rows) {
			if (row.childElementCount === 0) {
				continue;
			}

			let validGlobal = true;

			for (let i = 0; i < compareObjArr.length; i++) {
				let compareObj = compareObjArr[i];
				let cell = $('.' + compareObj.ClassName, row)[0];
				let data = cell.innerText.trim().split('\n'); //because Rec, R5 maybe has 2 values

				let validLocal = false;

				for (let j = 0; j < data.length; j++) {
					data[j] = data[j].split(',').join('');
					if (compareObj.Compare == COMPARE.GREATER_OR_EQUAL) {
						if (parseFloat(data[j]) >= parseFloat(compareObj.Value)) {
							validLocal = true;
						}
					} else if (compareObj.Compare == COMPARE.SMALLER_OR_EQUAL) {
						if (parseFloat(data[j]) <= parseFloat(compareObj.Value)) {
							validLocal = true;
						}
					}
				}

				if (!validLocal)
					validGlobal = false;
			}

			if (!validGlobal) {
				row.style.display = 'none';
			} else {
				row.style.display = '';
			}
		}
	}

	function showAllRow() {
		let rows = document.querySelectorAll(APPLICATION_CONST.TRANSFER_LIST_SELECTOR + ' tr[id^=player_row]');
		for (let row of rows) {
			row.style.display = '';
		}
	}

	let TI = {
		compute: function (asiNew, asiOld, position) {
			let pow = Math.pow;
			if (position === PositionNames.GOALKEEPER_STRING) {
				return (pow(asiNew * pow(2, 9) * pow(5, 4) * pow(7, 7), 1 / 7) - pow(asiOld * pow(2, 9) * pow(5, 4) * pow(7, 7), 1 / 7)) / 14 * 11 * 10;
			} else {
				return (pow(asiNew * pow(2, 9) * pow(5, 4) * pow(7, 7), 1 / 7) - pow(asiOld * pow(2, 9) * pow(5, 4) * pow(7, 7), 1 / 7)) * 10;
			}
		}
	};

	let SKILL = {
		compute: function (asi, position, ti = 0, month = 0) {
			let pow = Math.pow;
			if (ti < 0)
				ti = 0; //don't calculate negative case because don't know formula
			ti = ti / 2 * (1 + TRANSFER_PARAM.TRAINING_GROUND_RATIO);
			if (position === PositionNames.GOALKEEPER_STRING) {
				return pow(asi * pow(2, 9) * pow(5, 4) * pow(7, 7), 1 / 7) / 14 * 11 + ti / 10 * month;
			} else {
				return pow(asi * pow(2, 9) * pow(5, 4) * pow(7, 7), 1 / 7) + ti / 10 * month;
			}
		}
	};

	let ASI = {
		compute: function (skill, position) {
			let pow = Math.pow;
			if (position === PositionNames.GOALKEEPER_STRING) {
				return Math.round(pow(skill / 11 * 14, 7) / (pow(2, 9) * pow(5, 4) * pow(7, 7)));
			} else {
				return Math.round(pow(skill, 7) / (pow(2, 9) * pow(5, 4) * pow(7, 7)));
			}
		}
	};

	let BP = {
		compute: function (asi, age, month, position) {
			let pow = Math.pow;
			if (position === PositionNames.GOALKEEPER_STRING) {
				return Math.floor((asi * 500 * pow((300 / (age * 12 + month)), 2.5)) * 0.75);
			} else {
				return Math.floor(asi * 500 * pow((300 / (age * 12 + month)), 2.5));
			}
		}
	};

	function changeTransferTableCellInnerHTML(rowIndex, columnIndex, innerHTML) {
		let row = document.querySelectorAll(APPLICATION_CONST.TRANSFER_LIST_SELECTOR + ' tr[id]');
		if (row[rowIndex].childElementCount === 0) {
			return;
		}

		row[rowIndex].childNodes[columnIndex].innerHTML = innerHTML;
	}

	function addClassToTableCell(rowIndex, position, className) {
		let row = document.querySelectorAll(APPLICATION_CONST.TRANSFER_LIST_SELECTOR + ' tr[id]');
		if (row[rowIndex].childElementCount === 0) {
			return;
		}

		row[rowIndex].children[position].classList.add(className);
	}

	function addColumnToTable(columnPosition, headerName, className) {
		let headerRow = document.querySelector(APPLICATION_CONST.TRANSFER_LIST_SELECTOR + ' tr.header');
		let columns = headerRow.querySelectorAll('th');
		let columnsCount = columns.length;
		let headerCell = document.createElement('th');
		headerCell.classList.add('align_right');
		headerCell.innerHTML = headerName;

		if (columnsCount > columnPosition + 1) {
			headerRow.insertBefore(headerCell, columns[columnPosition]);
		} else {
			headerRow.appendChild(headerCell);
		}

		let rows = document.querySelectorAll(APPLICATION_CONST.TRANSFER_LIST_SELECTOR + ' tr[id^=player_row]');
		for (let row of rows) {
			if (row.childElementCount === 0) {
				continue;
			}

			let cell = document.createElement('td');
			if (className != undefined) {
				cell.classList.add(className);
			}
			cell.classList.add('align_right');
			cell.innerHTML = '-';
			if (columnsCount > columnPosition + 1) {
				row.insertBefore(cell, row.querySelectorAll('td')[columnPosition]);
			} else {
				row.appendChild(cell);
			}
		}
	}

	function removeHeaderColumn(columnIndex) {
		$('tr.header th')[columnIndex].remove();
	}

	function removeTransferTableCell(rowIndex, columnIndex) {
		let row = document.querySelectorAll(APPLICATION_CONST.TRANSFER_LIST_SELECTOR + ' tr[id]');
		if (row[rowIndex].childElementCount === 0) {
			return;
		}

		row[rowIndex].childNodes[columnIndex].remove();
	}

	function getAllIDs() {
		let rows = document.querySelectorAll(APPLICATION_CONST.TRANSFER_LIST_SELECTOR + ' tr[id^=player_row]');
		let ids = [];

		for (let row of rows) {
			ids.push(row.id.split('_')[2]);
		}

		return ids;
	}

	function getOldASI(playerID) {
		let playerRow = document.querySelector(APPLICATION_CONST.TRANSFER_LIST_SELECTOR + ' tr[id=player_row_' + playerID + ']');
		let asiCell = playerRow.childNodes[FINAL_COLUMN_INDEX.SI_COLUMN_POSITION];
		let asi = asiCell.innerHTML.match(/[0-9]+/)[0];
		return Number(asi);
	}

	function requestPlayerASI(playerID) {
		return new Promise((resolve, reject) => {
			$.post("/ajax/tooltip.ajax.php", {
				"player_id": playerID,
				minigame: undefined
			})
			.done((responseText) => {
				var data = JSON.parse(responseText);

				var rrValue = calculateRR(data.player);
				var rec = rrValue[0];
				var recStr = '';
				if (rec.length == 2) {
					recStr = Number(rec[0]).toFixed(APPLICATION_CONST.RREC_PRECISION) + '<br>' + Number(rec[1]).toFixed(APPLICATION_CONST.RREC_PRECISION);
				} else {
					recStr = Number(rec[0]).toFixed(APPLICATION_CONST.RREC_PRECISION);
				}
				var r5 = rrValue[1];
				var r5Str = '';
				if (r5.length == 2) {
					r5Str = Number(r5[0]).toFixed(APPLICATION_CONST.R5_PRECISION) + '<br>' + Number(r5[1]).toFixed(APPLICATION_CONST.R5_PRECISION);
				} else {
					r5Str = Number(r5[0]).toFixed(APPLICATION_CONST.R5_PRECISION);
				}

				resolve({
					id: data.player.player_id,
					position: data.player.fp,
					ASI: Number(data.player.skill_index.split(',').join('')),
					xp: Number(data.player.routine.split(',').join('')),
					age: Number(data.player.age),
					month: Number(data.player.months),
					wage: Number(data.player.wage.replace("<span class='coin'>", "").replace("<\/span>", "").split(',').join('')),
					REC: recStr,
					R5: r5Str
				});
			}).fail((error) => {
				reject(error);
			});
		});
	}

	// R5 weights
	//		Str				Sta				Pac				Mar				Tac				Wor				Pos				Pas				Cro				Tec				Hea				Fin				Lon				Set
	var weightR5 = [[0.41029304, 0.18048062, 0.56730138, 1.06344654, 1.02312672, 0.40831256, 0.58235457, 0.12717479, 0.05454137, 0.09089830, 0.42381693, 0.04626272, 0.02199046, 0.00000000], // DC
		[0.42126371, 0.18293193, 0.60567629, 0.91904794, 0.89070915, 0.40038476, 0.56146633, 0.15053902, 0.15955429, 0.15682932, 0.42109742, 0.09460329, 0.03589655, 0.00000000], // DL/R
		[0.23412419, 0.32032289, 0.62194779, 0.63162534, 0.63143081, 0.45218831, 0.47370658, 0.55054737, 0.17744915, 0.39932519, 0.26915814, 0.16413124, 0.07404301, 0.00000000], // DMC
		[0.27276905, 0.26814289, 0.61104798, 0.39865092, 0.42862643, 0.43582015, 0.46617076, 0.44931076, 0.25175412, 0.46446692, 0.29986350, 0.43843061, 0.21494592, 0.00000000], // DML/R
		[0.25219260, 0.25112993, 0.56090649, 0.18230261, 0.18376490, 0.45928749, 0.53498118, 0.59461481, 0.09851189, 0.61601950, 0.31243959, 0.65402884, 0.29982016, 0.00000000], // MC
		[0.28155678, 0.24090675, 0.60680245, 0.19068879, 0.20018012, 0.45148647, 0.48230007, 0.42982389, 0.26268609, 0.57933805, 0.31712419, 0.65824985, 0.29885649, 0.00000000], // ML/R
		[0.22029884, 0.29229690, 0.63248227, 0.09904394, 0.10043602, 0.47469498, 0.52919791, 0.77555880, 0.10531819, 0.71048302, 0.27667115, 0.56813972, 0.21537826, 0.00000000], // OMC
		[0.21151292, 0.35804710, 0.88688492, 0.14391236, 0.13769621, 0.46586605, 0.34446036, 0.51377701, 0.59723919, 0.75126119, 0.16550722, 0.29966502, 0.12417045, 0.00000000], // OML/R
		[0.35479780, 0.14887553, 0.43273380, 0.00023928, 0.00021111, 0.46931131, 0.57731335, 0.41686333, 0.05607604, 0.62121195, 0.45370457, 1.03660702, 0.43205492, 0.00000000], // F
		[0.45462811, 0.30278232, 0.45462811, 0.90925623, 0.45462811, 0.90925623, 0.45462811, 0.45462811, 0.30278232, 0.15139116, 0.15139116]]; // GK

	// RECb weights		Str				Sta				Pac				Mar				Tac				Wor				Pos				Pas				Cro				Tec				Hea				Fin				Lon				Set
	var weightRb = [[0.10493615, 0.05208547, 0.07934211, 0.14448971, 0.13159554, 0.06553072, 0.07778375, 0.06669303, 0.05158306, 0.02753168, 0.12055170, 0.01350989, 0.02549169, 0.03887550], // DC
		[0.07715535, 0.04943315, 0.11627229, 0.11638685, 0.12893778, 0.07747251, 0.06370799, 0.03830611, 0.10361093, 0.06253997, 0.09128094, 0.01314110, 0.02449199, 0.03726305], // DL/R
		[0.08219824, 0.08668831, 0.07434242, 0.09661001, 0.08894242, 0.08998026, 0.09281287, 0.08868309, 0.04753574, 0.06042619, 0.05396986, 0.05059984, 0.05660203, 0.03060871], // DMC
		[0.06744248, 0.06641401, 0.09977251, 0.08253749, 0.09709316, 0.09241026, 0.08513703, 0.06127851, 0.10275520, 0.07985941, 0.04618960, 0.03927270, 0.05285911, 0.02697852], // DML/R
		[0.07304213, 0.08174111, 0.07248656, 0.08482334, 0.07078726, 0.09568392, 0.09464529, 0.09580381, 0.04746231, 0.07093008, 0.04595281, 0.05955544, 0.07161249, 0.03547345], // MC
		[0.06527363, 0.06410270, 0.09701305, 0.07406706, 0.08563595, 0.09648566, 0.08651209, 0.06357183, 0.10819222, 0.07386495, 0.03245554, 0.05430668, 0.06572005, 0.03279859], // ML/R
		[0.07842736, 0.07744888, 0.07201150, 0.06734457, 0.05002348, 0.08350204, 0.08207655, 0.11181914, 0.03756112, 0.07486004, 0.06533972, 0.07457344, 0.09781475, 0.02719742], // OMC
		[0.06545375, 0.06145378, 0.10503536, 0.06421508, 0.07627526, 0.09232981, 0.07763931, 0.07001035, 0.11307331, 0.07298351, 0.04248486, 0.06462713, 0.07038293, 0.02403557], // OML/R
		[0.07738289, 0.05022488, 0.07790481, 0.01356516, 0.01038191, 0.06495444, 0.07721954, 0.07701905, 0.02680715, 0.07759692, 0.12701687, 0.15378395, 0.12808992, 0.03805251], // F
		[0.07466384, 0.07466384, 0.07466384, 0.14932769, 0.10452938, 0.14932769, 0.10452938, 0.10344411, 0.07512610, 0.04492581, 0.04479831]]; // GK

	var posNames = ["DC", "DCL", "DCR", "DL", "DR", "DMC", "DMCL", "DMCR", "DML", "DMR", "MC", "MCL", "MCR", "ML", "MR", "OMC", "OMCL", "OMCR", "OML", "OMR", "F", "FC", "FCL", "FCR", "GK"];
	var pos = [0, 0, 0, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5, 5, 6, 6, 6, 7, 7, 8, 8, 8, 8, 9];

	function funFix1(i) {
		i = (Math.round(i * 10) / 10).toFixed(1);
		return i;
	}

	function funFix2(i) {
		i = (Math.round(i * 100) / 100).toFixed(2);
		return i;
	}

	function funFix3(i) {
		i = (Math.round(i * 1000) / 1000).toFixed(3);
		return i;
	}

	function calculate(weightRb, weightR5, skills, posGain, posKeep, fp, rou, remainder, allBonus) {
		var rec = 0; // RERECb
		var ratingR = 0; // RatingR5
		var ratingR5 = 0; // RatingR5 + routine
		var ratingR5Bonus = 0; // RatingR5 + routine + bonus
		var remainderWeight = 0; // REREC remainder weight sum
		var remainderWeight2 = 0; // RatingR5 remainder weight sum
		var not20 = 0; // 20以外のスキル数
		for (var i = 0; i < weightRb[fp].length; i++) { // weightR[fp].length = n.pesi[pos] cioè le skill: 14 o 11
			rec += skills[i] * weightRb[fp][i];
			ratingR += skills[i] * weightR5[fp][i];
			if (skills[i] != 20) {
				remainderWeight += weightRb[fp][i];
				remainderWeight2 += weightR5[fp][i];
				not20++;
			}
		}
		if (remainder / not20 > 0.9 || not20 == 0) {
			if (fp == 9)
				not20 = 11;
			else
				not20 = 14;
			remainderWeight = 1;
			remainderWeight2 = 5;
		}
		rec = funFix3((rec + remainder * remainderWeight / not20 - 2) / 3);
		ratingR += remainder * remainderWeight2 / not20;
		ratingR5 = funFix2(ratingR * 1 + rou * 5);

		if (skills.length == 11) {
			ratingR5Bonus = funFix2(ratingR5 * 1 + allBonus * 1);
		} else {
			ratingR5Bonus = funFix2(ratingR5 * 1 + allBonus * 1 + posGain[fp] * 1 + posKeep[fp] * 1);
		}
		return [rec, ratingR5Bonus];
	}

	function calculateRR(current_player_info) {
		var skillArray = current_player_info.skills;
		var STR,
		STA,
		PAC,
		MAR,
		TAC,
		WOR,
		POS,
		PAS,
		CRO,
		TEC,
		HEA,
		FIN,
		LON,
		SET,
		HAN,
		ONE,
		REF,
		AER,
		JUM,
		COM,
		KIC,
		THR;
		var skillValue;
		for (var i = 0; i < skillArray.length; i++) {
			if (skillArray[i].key == 'null')
				continue;
			skillValue = skillArray[i].value;
			if (isNaN(skillValue)) {
				if (skillValue.indexOf('19') != -1) {
					skillValue = 19;
				} else if (skillValue.indexOf('20') != -1) {
					skillValue = 20;
				} else {
					throw 'Error skillValue: ' + skillValue;
				}
			}

			switch (skillArray[i].key) {
			case 'strength':
				STR = skillValue;
				break;
			case 'stamina':
				STA = skillValue;
				break;
			case 'pace':
				PAC = skillValue;
				break;
			case 'marking':
				MAR = skillValue;
				break;
			case 'tackling':
				TAC = skillValue;
				break;
			case 'workrate':
				WOR = skillValue;
				break;
			case 'positioning':
				POS = skillValue;
				break;
			case 'passing':
				PAS = skillValue;
				break;
			case 'crossing':
				CRO = skillValue;
				break;
			case 'technique':
				TEC = skillValue;
				break;
			case 'heading':
				HEA = skillValue;
				break;
			case 'finishing':
				FIN = skillValue;
				break;
			case 'longshots':
				LON = skillValue;
				break;
			case 'set_pieces':
				SET = skillValue;
				break;
			case 'handling':
				HAN = skillValue;
				break;
			case 'one_on_ones':
				ONE = skillValue;
				break;
			case 'reflexes':
				REF = skillValue;
				break;
			case 'aerial_ability':
				AER = skillValue;
				break;
			case 'jumping':
				JUM = skillValue;
				break;
			case 'communication':
				COM = skillValue;
				break;
			case 'kicking':
				KIC = skillValue;
				break;
			case 'throwing':
				THR = skillValue;
				break;
			default:
				throw 'Error skillArray[i].key: ' + skillArray[i].key;
			}
		}

		var ROLE = current_player_info.favposition.toUpperCase();
		var ROU = Number(current_player_info.routine.split(',').join(''));
		var ASI = Number(current_player_info.skill_index.split(',').join(''));

		var ROLE1,
		ROLE2;
		var role = ROLE.split(',');
		if (role.length == 2) {
			ROLE1 = role[0];
			ROLE2 = role[1];
		} else {
			ROLE1 = role[0];
			ROLE2 = -1;
		}

		var fp,
		fp2 = -1;
		for (var i = 0; i < posNames.length; i++) {
			if (posNames[i] == ROLE1)
				fp = pos[i];
			if (ROLE2 != -1 && posNames[i] == ROLE2)
				fp2 = pos[i];
		}
		if (fp == 9) {
			var weight = 48717927500;
			var skills = [STR, STA, PAC, HAN, ONE, REF, AER, JUM, COM, KIC, THR];
		} else {
			weight = 263533760000;
			skills = [STR, STA, PAC, MAR, TAC, WOR, POS, PAS, CRO, TEC, HEA, FIN, LON, SET];
		}

		var goldstar = 0;
		var skillSum = 0;
		var skillsB = [];
		for (i = 0; i < skills.length; i++) {
			skillSum += parseInt(skills[i]);
		}
		var remainder = Math.round((Math.pow(2, Math.log(weight * ASI) / Math.log(Math.pow(2, 7))) - skillSum) * 10) / 10; // RatingR5 remainder
		for (var j = 0; j < 2; j++) {
			for (i = 0; i < 14; i++) {
				if (j == 0 && skills[i] == 20)
					goldstar++;
				if (j == 1) {
					if (skills[i] != 20)
						skillsB[i] = skills[i] * 1 + remainder / (14 - goldstar);
					else
						skillsB[i] = skills[i];
				}
			}
		}

		var routine = (3 / 100) * (100 - (100) * Math.pow(Math.E, -ROU * 0.035));
		var strRou = skillsB[0] * 1 + routine;
		var staRou = skillsB[1] * 1;
		var pacRou = skillsB[2] * 1 + routine;
		var marRou = skillsB[3] * 1 + routine;
		var tacRou = skillsB[4] * 1 + routine;
		var worRou = skillsB[5] * 1 + routine;
		var posRou = skillsB[6] * 1 + routine;
		var pasRou = skillsB[7] * 1 + routine;
		var croRou = skillsB[8] * 1 + routine;
		var tecRou = skillsB[9] * 1 + routine;
		var heaRou = skillsB[10] * 1 + routine;
		var finRou = skillsB[11] * 1 + routine;
		var lonRou = skillsB[12] * 1 + routine;
		var setRou = skillsB[13] * 1 + routine;

		var headerBonus;
		if (heaRou > 12)
			headerBonus = funFix2((Math.pow(Math.E, (heaRou - 10) ** 3 / 1584.77) - 1) * 0.8 + Math.pow(Math.E, (strRou * strRou * 0.007) / 8.73021) * 0.15 + Math.pow(Math.E, (posRou * posRou * 0.007) / 8.73021) * 0.05);
		else
			headerBonus = 0;

		var fkBonus = funFix2(Math.pow(Math.E, Math.pow(setRou + lonRou + tecRou * 0.5, 2) * 0.002) / 327.92526);
		var ckBonus = funFix2(Math.pow(Math.E, Math.pow(setRou + croRou + tecRou * 0.5, 2) * 0.002) / 983.65770);
		var pkBonus = funFix2(Math.pow(Math.E, Math.pow(setRou + finRou + tecRou * 0.5, 2) * 0.002) / 1967.31409);

		var allBonus = 0;
		if (skills.length == 11)
			allBonus = 0;
		else
			allBonus = headerBonus * 1 + fkBonus * 1 + ckBonus * 1 + pkBonus * 1;

		var gainBase = funFix2((strRou ** 2 + staRou ** 2 * 0.5 + pacRou ** 2 * 0.5 + marRou ** 2 + tacRou ** 2 + worRou ** 2 + posRou ** 2) / 6 / 22.9 ** 2);
		var keepBase = funFix2((strRou ** 2 * 0.5 + staRou ** 2 * 0.5 + pacRou ** 2 + marRou ** 2 + tacRou ** 2 + worRou ** 2 + posRou ** 2) / 6 / 22.9 ** 2);
		//	0:DC			1:DL/R			2:DMC			3:DML/R			4:MC			5:ML/R			6:OMC			7:OML/R			8:F
		var posGain = [gainBase * 0.3, gainBase * 0.3, gainBase * 0.9, gainBase * 0.6, gainBase * 1.5, gainBase * 0.9, gainBase * 0.9, gainBase * 0.6, gainBase * 0.3];
		var posKeep = [keepBase * 0.3, keepBase * 0.3, keepBase * 0.9, keepBase * 0.6, keepBase * 1.5, keepBase * 0.9, keepBase * 0.9, keepBase * 0.6, keepBase * 0.3];

		var valueFp = calculate(weightRb, weightR5, skills, posGain, posKeep, fp, routine, remainder, allBonus);
		var rec = [valueFp[0]];
		var r5 = [valueFp[1]];

		if (fp2 != -1 && fp2 != fp) {
			var valueFp2 = calculate(weightRb, weightR5, skills, posGain, posKeep, fp2, routine, remainder, allBonus);
			rec.push(valueFp2[0]);
			r5.push(valueFp2[1]);
		}

		return [rec, r5];
	}
})();
