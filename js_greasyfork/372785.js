// ==UserScript==
// @name OpenAir improvements
// @namespace http://www.jaron.nl/misc/bookmarklets
// @description Improvements on open air time sheet
// @include https://www.openair.com/timesheet.pl?*
// @version 0.5
// @downloadURL https://update.greasyfork.org/scripts/372785/OpenAir%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/372785/OpenAir%20improvements.meta.js
// ==/UserScript==

(function() {


	/**
	* perform click on a dialog elm
	* @returns {undefined}
	*/
	const clickDialogElm = function(selector) {
		const dialogBlock = document.querySelector(`.dialogBlock`);
		if (dialogBlock) {
			dialogBlock.querySelector(selector).click();
		}
	};


	/**
	* open notes when input has value and notes are empty
	* @returns {undefined}
	*/
	const openNotesIfEmpty = function(input) {
		// const input = e.currentTarget;
		if (input.value !== "") {
			const notesTrigger = input.parentNode.querySelector('.tsDetailsAnchor');

			notesTrigger.click();
			const dialogBlock = document.querySelector(`.dialogBlock`);
			if (dialogBlock) {
				const textarea = dialogBlock.querySelector('[name="notes"]');
				if (textarea.value) {
					// we already have notes
					dialogBlock.querySelector('.dialogCloseButton').click();
				}
			}
		}
	};


	/**
	* parse time string and return array containing hours and minutes
	* @param {string} time The time spent, like 1h15m, 15m, 1h, 15, 1h15, 1.15, 1:15 etc
	* @returns {string} 'h.mm'
	*/
	const parseTime = function(timeStr) {
		const hourDelimiterRegex = /[\:\h]/;
		let hours = 0;
		let hundredths = 0;
		if (timeStr) {

			if (timeStr.indexOf('.') > -1) {
				// the format we want, don't do anything
			} else {
				// check if we have a delimiter
				var m = timeStr.match(hourDelimiterRegex);

				if (!m) {
					// no delimiter
					const amount = parseInt(timeStr, 10);
					if (amount < 15) {
						// treat 0-14 as hours,
						hours = amount;
					} else {
						// 15 or higher: treat as minutes; round to closest quarter
						hundredths = 25 * Math.round(amount/15);
						hours = Math.floor(hundredths/100);
						if (hours > 0) {
							hundredths = hundredths % (100 * hours);
						}
					}
				} else {
					//hours and possibly minutes
					var delimiter = m[0],
					arr = timeStr.split(delimiter);

					hours = parseInt(arr[0], 10);
					if (arr[1]) {
						// we actually had something after delimiter
						const minutes = parseInt(arr[1], 10);
						// round to closest 15
						hundredths = 25 * Math.round(minutes/15);
					}
				}

				// now make new string
				timeStr = hours;
				if (hundredths) {
					timeStr += '.' + hundredths;
				}
			}
		}// if (timeStr)

		return timeStr;
	};


	/**
	* add blur handlers for hour
	* @returns {undefined}
	*/
	const addHourInputHandlers = function() {
		const inputs = Array.from(document.querySelectorAll('.timesheetInputHour'));
		inputs.forEach((input) => {
			input.addEventListener('blur', (e) => {
				const inp = e.currentTarget;
				inp.value = parseTime(inp.value);
				openNotesIfEmpty(inp);
			});
		})
	};


	/**
	* add listeners for esc, alt-s for dialog
	* @returns {undefined}
	*/
	const addDialogKeyListeners = function() {
		document.addEventListener('keyup', (e) => {
			const dialogBlock = document.querySelector(`.dialogBlock`);
			const keyCodes = {
				enter: 13,
				esc: 27,
				s: 83
			};
			if (dialogBlock) {
				const keyCode = e.keyCode;
				if (keyCode === keyCodes.s && e.getModifierState('Alt')) {
					// alt + S: save note
					clickDialogElm('.dialogCloseAndSaveButton');
				} else if (keyCode === keyCodes.enter && e.getModifierState('Control')) {
					// ctrl + enter: OK (close without save)
					clickDialogElm('.dialogOkButton');
				} else if (keyCode === keyCodes.esc) {
					// ctrl + enter: OK (close without save)
					clickDialogElm('.dialogCloseButton');
				}
			}
		});
	};



	/**
	* initialize stuff that depends on grid being present
	* @returns {undefined}
	*/
	const initWhenGridReady = function() {
		const interval = 100;// check every 100 ms if timesheet grid is present
		const grid = document.getElementById(`timesheet_grid`);
		if (!grid) {
			setTimeout(initWhenGridReady, interval);
		} else {
			// kick off initialisation
			addHourInputHandlers();
			addDialogKeyListeners();
		}
	};
	
	



	
	/**
	* add css
	* @returns {undefined}
	*/
	const addCss = function() {
		const blue = '#00bdfa';
		const green = '#a0c03b';
		const lightGrey = '#ddd';

		const css = `
			html {
				font-size: 14px;
			}

			#timesheet_savebutton,
			#save_grid_submit {
				padding: 0.5em 1em;
			}

			#timesheet_savebutton {
				background: ${green};
			}

			#save_grid_submit {
				border: 1px solid currentColor;
				background: white;
				color: ${green};
			}

			.oa3_ui #formGrid select,
			.oa3_ui .select-oa {
				border-radius: 0;	
				background: white;
				box-shadow: none;
			}

			body.oa3_ui.timesheet #timesheet_grid.timesheetCompact table.timesheet tbody td select.select-oa,
			body.oa3_ui.timesheet #timesheet_header.timesheetCompact table.timesheet tbody td select.select-oa {
				border-color: ${lightGrey};
				padding: 0.3em;
			}

			body.oa3_ui.timesheet #timesheet_grid.timesheetCompact table.timesheet tbody td input,
			body.oa3_ui.timesheet #timesheet_header.timesheetCompact table.timesheet tbody td input {
				border-color: ${lightGrey};
				padding: 0.3em;
				box-shadow: none;
			}

			.dialogCloseButton,
			.dialogOkButton,
			.dialogCloseAndSaveButton {
				position: relative;
			}

			.dialogCloseButton::after,
			.dialogOkButton::after,
			.dialogCloseAndSaveButton::after {
				display: block;
				position: absolute;
				top: 100%;
				left: 50%;
				content: 'crtl+enter';
				font-weight: normal;
				color: #aaa;
				font-size: 10px;
				transform: translateX(-50%);
			}

			.dialogCloseAndSaveButton::after {
				content: 'alt+s';
			}

			.dialogCloseButton::after {
				content: 'esc';
			}
		`;
		const stl = document.createElement('style');
		stl.innerHTML = css;
		document.querySelector('head').appendChild(stl);
	};




	/**
	* 
	* @param {string} varname Description
	* @returns {undefined}
	*/
	const init = function() {
		initWhenGridReady();
		addCss();
	};

	init();

})();