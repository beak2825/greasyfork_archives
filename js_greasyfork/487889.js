// ==UserScript==
// @name         Grundos Cafe Battledome Utility (Keyboard)
// @namespace    grundos.cafe
// @version      1.2.1
// @description  Remember last selected battledome weapons and options, keyboard controls
// @author       eleven, wibreth
// @match        https://www.grundos.cafe/dome/1p/battle/*
// @match        https://www.grundos.cafe/dome/1p/endbattle/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/487889/Grundos%20Cafe%20Battledome%20Utility%20%28Keyboard%29.user.js
// @updateURL https://update.greasyfork.org/scripts/487889/Grundos%20Cafe%20Battledome%20Utility%20%28Keyboard%29.meta.js
// ==/UserScript==

/* globals $:false */


(function() {
	'use strict';

	// withdraw before losing/drawing a fight
	if ($('#end_blurb').text().includes('You have lost this fight!') || $('#end_blurb').text().includes('You have drawn this fight!')) {
		let confirmation = window.confirm("You didn't win! :( Withdraw from this battle?");
		if (confirmation) {
			window.location.href = 'https://www.grundos.cafe/dome/status/';
			return;
		}
	}

	GM_addStyle(`
    form#bd-form-end input[type=submit], form#bd-form input[type=submit], .cloned-btn {
		width: ${!GM_getValue('gowidth') ? 200 : GM_getValue('gowidth')}px;
        height: ${!GM_getValue('goheight') ? 200 : GM_getValue('goheight')}px;
        resize: both;
        overflow: hidden;
    }
    .cloned-btn input {
        width: 100%;
        height: 100% !important;
        display: block;
    }
    #bd-form .button-group, #bd-form-end {
        width: initial;
        align-items: center;
    }
    #equipment .itemList {
		display: flex;
		flex-wrap: wrap;
		gap: initial;
		padding: initial;
        align-items: stretch;
    }
    #equipment .itemList .relic {
		width: 25%;
		max-width: 120px;
		word-break: break-word;
		position: relative;
        margin: 0 auto;
    }
    #equipment .itemList label {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 100%;
    }
    #equipment .itemList .med-image {
		max-width: 100% !important;
		max-height: 100% !important;
		aspect-ratio: 1 / 1;
		height: auto !important;
    }
    #equipment .itemList .relic-span {
    height: auto;
    }
    #bd-form {
		width: ${GM_getValue('width', '450')-20}px;
		height: ${GM_getValue('height', '700')-20}px;
		max-width: none !important;
		resize: both;
		overflow: auto;
		position: absolute;
		left: ${GM_getValue('left', 0)}px;
		top: ${GM_getValue('top', 0)}px;
		background: var(--bgcolor);
		padding: 10px;
		border-radius: 10px;
		box-shadow: 0 0 10px 0 #00000088;
		cursor: move;
		container-name: bdform;
		container-type: size;
    }
    .relic-checkbox-container::before {
		content: attr(data-hotkey);
		position: absolute;
		left: 0;
		right: 0;
		font-size: 30px;
		-webkit-text-stroke: 1.5px var(--bgcolor);
		text-stroke: 1.5px var(--bgcolor);
		top: 0;
		font-weight: bold;
		text-shadow: 0 0 3px var(--bgcolor), 0 0 3px var(--bgcolor);
		pointer-events: none;
		height: min-content;
    }
    .relic-checkbox-container::after {
		content: attr(data-qty);
        margin: -3px 0 3px;
        display: block;
		pointer-events: none;
    }
    .ability-btn {
		cursor: pointer;
		padding: 0.3em;
		display: inline-block;
    }
	.ability-radio {
		margin-top: 1em;
		display: flex;
		flex-wrap: wrap;
	}
	.ability-radio input {
		position: absolute !important;
		clip: rect(0, 0, 0, 0);
		height: 1px;
		width: 1px;
		border: 0;
		overflow: hidden;
	}
	.ability-radio label {
		padding: 0.3em;
		margin-right: -1px;
		margin-bottom: -1px;
	}
	.ability-radio label:hover {
		cursor: pointer;
	}
	.ability-radio input:checked + label, .ability-radio input:checked + label:hover {
		background-color: var(--grid_select);
	}
	.ability-radio label::before {
		content: '('attr(data-hotkey)') ';
	}
    #bd-grid textarea {
        display: block;
    }
	@container bdform (max-width: 300px) {
		#equipment .itemList .relic-span  {
			font-size: 10px;
		}
    }
	@container bdform (max-width: 200px) {
		#equipment .itemList .relic-span {
			font-size: 6px
		}
	}`);

	let equipment = {}; //name: [array of equipment IDs]
	let hotkeys = {}; //keycode: name of equipment or ability ID or 'GO'
    let keycodes = ['KeyP','KeyO','KeyI','KeyU','Semicolon','KeyL','KeyK','KeyJ','Period','Comma','KeyM','KeyN','KeyV', 'KeyC', 'KeyX', 'KeyZ', 'KeyF', 'KeyD', 'KeyS', 'KeyA', 'KeyR', 'KeyE', 'KeyW', 'KeyQ']; // reverse order
    let keys = ['P','O','I','U',';','L','K','J','.',',','M','N','V', 'C', 'X', 'Z', 'F', 'D', 'S', 'A', 'R', 'E', 'W', 'Q'];


    // the priority list for ordering equipment puts reflectors first, then %-blockers, constants, blockers, and breakable/one-use items.
    // original list compiled by Chris (thesovereign)
    let original_priority = ['kings lens','nsu detector','ultimate dark reflectorb','ultra dark reflectorb','ultra dual shovel','shovel plus','superior reflection shield','combo battle mirror','dual battle mirror','cloud charm','triple turbo dryer','turbo dryer','u-bend of great justice','mega u-bend','umbrella shield','super u-bend','reflectozap 2000','flame reflectozap','turbo flame reflector','defender of neopia cape','wand of the dark faerie','rod of dark nova','stone hourglass','alien aisha scrambler','chia leaping boots','tornado ring','greater staff of the earth faerie','sad spell','sponge shield','grimoire of thade','mask of coltzan','air faeries fan','scroll of the western winds','jhudoras dark collar','air faerie crown','scroll of dark nova','portable cloud','super attack pea','seasonal attack pea','attack pea','faerie slingshot','monoceraptors claw','ghostkersword','sword of skardsen','noxious carrot blade','pirate captains cutlass','bony grarrl club','kougra brush','golden butter knife','scroll of ultranova','scroll of supernova','faerie tabard','ghostkershield','patched magic hat','irregulation chainmail','thyoras tear','downsize power plus','castle defenders shield','jade scorchstone','rainbow scorchstone','purple scorchstone','green scorchstone','blue scorchstone','red scorchstone','bronze scorchstone','obsidian scorchstone','greater healing scroll','great snowball','jewelled scarab','wocky wand of darkness','moehog healing root','kacheek life potion','elephante unguent','scorchio wand','gelert healing remedy','flotsam ice shell','moehog skull','snowball machine','sleep ray','freezing potion','h4000 helmet','scroll of freezing','wand of the snow faerie','crystal boomerang','ghostkerbomb','hubrids puzzle box','evil hubrid statue','dark nova','ultranova','supernova'];
    let priority = original_priority;
    priority = GM_getValue('priority', priority);

	function customOrder(a, b) {
		let textA = $(a).find('.relic-span').text().trim().toLowerCase();
		let textB = $(b).find('.relic-span').text().trim().toLowerCase();
		if (priority.indexOf(textA) < 0 || priority.indexOf(textB) < 0) return 9999;
		return priority.indexOf(textA) - priority.indexOf(textB);
	}
    function parsePriority(input) {
        return input
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0);
    }

    // setting a custom priority list
    $('#equipment').after(`
        <details>
            <summary>Edit equipment order</summary>
            Please note, reflectors should be placed before shields with a % block for full effectiveness.
            <textarea id="textarea-priority" rows="4" cols="50"></textarea>
            <button id="btn-priority">Submit</button>
            <button id="btn-reset-priority">Reset</button>
        </details>
    `);
    let textareaPriority = $('#textarea-priority').val(priority.join(','));
    $('#btn-priority').on('click', function () {
        priority = parsePriority(textareaPriority.val());
        GM_setValue('priority', priority);
        textareaPriority.val(priority.join(','));
        sortEquipment();

        $(this).prop('disabled', true).text('List updated!');
        setTimeout(() => {
            $(this).prop('disabled', false).text('Submit');
        }, 1500);
    });
    $('#btn-reset-priority').on('click', function () {
        priority = original_priority;
        GM_setValue('priority', priority);
        textareaPriority.val(priority.join(','));
        sortEquipment();

        $(this).prop('disabled', true).text('List updated!');
        setTimeout(() => {
            $(this).prop('disabled', false).text('Submit');
        }, 1500);
    });

	// sort the equipment list
    function sortEquipment() {
        let sorted = $('#equipment .itemList .relic');
        sorted.sort(customOrder);
        $('#equipment .itemList .relic').detach();
        $('#equipment .itemList').append(sorted);
    }
    sortEquipment();


    selected = [];
	let inputs = $('#bd-form .relic-checkbox-container input');
	inputs.each(function() {
		$(this).prop('checked', false); //set everything to false first
		const name = $(this).parent().siblings().eq(1).text().trim().toLowerCase();
		if (name in equipment) {
            // condense duplicates
            $(this).closest('.relic').hide();
			equipment[name].push($(this).val());
			let original = $(`input[value="${equipment[name][0]}"]`).parent();
			original.attr('data-qty', equipment[name].length);
			if (equipment[name].length > 2) {
                return;
            }
			original.append($(this));
			return;
		}
		const key = keycodes.pop();
		$(this).parent().attr('data-hotkey', keys.pop());
		hotkeys[key] = name;
		equipment[name] = [$(this).prop('id')];
	});
	$('#bd-form table').hide();

	// assign hotkeys create radio buttons that sync to the dropdown for:
	// species attack/defend, either berserk or fierce attack, defend, and faerie abilities
	// note that low level pets do not have berserk and must use fierce
	keycodes = ['Digit8', 'Digit7', 'Digit6', 'Digit5', 'Digit4', 'Digit3', 'Digit2', 'Digit1'];
	keys = ['8', '7', '6', '5', '4', '3', '2', '1'];
	let radios = $('<div class="ability-radio">');
	$('#bd-form .form-row').after(radios);
	let berserk = $('#ability option[value="5"]').length ? 5 : 4;
	$('#ability option').each(function() {
		const value = $(this).val();
		const text = $(this).text();
		let radio = `<input type="radio" name="ability-options" value="${value}" style="visibility: hidden">`;
		if (value < 0 || value >= berserk) {
			const key = keycodes.pop();
			radio = `<input type="radio" name="ability-options" value="${value}" id="${text.replace(/\s+/g, '-').toLowerCase()}"><label class="form-control" data-hotkey="${keys.pop()}" for="${text.replace(/\s+/g, '-').toLowerCase()}">${text}</label>`;
			hotkeys[key] = value;
		}
		radios.append(radio);
	});
	$('#ability').change(function() {
		$(`input[name='ability-options'][value='${$(this).val()}']`).prop('checked', true);
	});
	$('input[name="ability-options"]').change(function() {
		$('#ability').val($(this).val()).trigger('change');
	});

	// clone the Go!, Next, Rematch buttons and assign spacebar hotkey
	if (document.URL.indexOf('/dome/1p/battle/') !== -1) {
		let btn = $('#bd-form input[type=submit], #bd-form-end input[type=submit]').clone();
		btn.click(() => {
			$('input[type=submit]').prop('disabled', true);
			$('#bd-form, #bd-form-end').submit();
		});
		$('#page_content').prepend($('<div class="cloned-btn">').append(btn));
	} else if (document.URL.indexOf('/dome/1p/endbattle/') !== -1) {
		let btn = $('#bd-form-rematch input[type=submit]').clone();
		btn.click(() => {
			$('input[type=submit]').prop('disabled', true);
			$('#bd-form-rematch').submit();
		});
		$('#page_content').prepend($('<div class="cloned-btn">').append(btn))
	}
	hotkeys['Space'] = 'GO';
	hotkeys['NumpadEnter'] = 'GO';

    // set up hotkey listeners to make the hotkeys actually work
    // the hotkeys are disabled if the cursor is focused on a textarea/input field
    window.addEventListener('keydown', (e) => {
        if ($(e.target).is('textarea, input[type=text], [contenteditable]'))
            return;
		const key = e.code;
		if(key in hotkeys && hotkeys[key] === 'GO')
			e.preventDefault();
    }, true, );
	// keyup listener must distinguish between go, abilities, and equipment
    window.addEventListener('keyup', (e) => {
        if ($(e.target).is('textarea, input[type=text], [contenteditable]'))
            return;
		const key = e.code;
		if(!(key in hotkeys))
			return;
		let val = hotkeys[key];
		if (val === 'GO') {
			e.preventDefault();
			$('.cloned-btn input').click();
            return;
		}
		if (!(val in equipment)) { //ability
			$(`input[name='ability-options'][value='${val}']`).prop('checked', true).trigger('change');
			return;
		}
		val = equipment[hotkeys[key]][0];
		if (selected.indexOf(val) >= 0 && equipment[hotkeys[key]].length > 1)
			val = equipment[hotkeys[key]][1];
		$(`input[value="${val}"]`).prop('checked', true);
		countWeaps(val);
    }, true, );



	/*
	Copyright (c) 2024 by Loren McClaflin (https://codepen.io/Mozillex/pen/PoYmEbz)
	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/
	function dragElement(elmnt) {
		var pos1 = 0,
			pos2 = 0,
			pos3 = 0,
			pos4 = 0;

		addTouchToMouse(elmnt);
		elmnt.onmousedown = dragMouseDown;

		function dragMouseDown(e) {
			e = e || window.event;
			if ($(e.target).is('a, select, input, label') || $(e.target).closest('a, select, input, label').length)
				return; //don't drag if mousedown on these elements.... there's gotta be an easier way to do this.....
			// get the mouse cursor position at startup:
			pos3 = e.clientX;
			pos4 = e.clientY;
			if (e.offsetX > elmnt.offsetWidth - 18 && e.offsetY > elmnt.offsetHeight - 18)
				return; // don't drag if mousedown on resize handle
			e.preventDefault();
			document.onmouseup = closeDragElement;
			document.onmousemove = elementDrag;
		}

		function elementDrag(e) {
			e = e || window.event;
			e.preventDefault();
			// calculate the new cursor position:
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			// set the element's new position:
			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
			elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
			GM_setValue('left', elmnt.offsetLeft - pos1);
			GM_setValue('top', elmnt.offsetTop - pos2);
		}

		function closeDragElement() {
			document.onmouseup = null;
			document.onmousemove = null;
		}


	// Touch support added by Jonathan Arnett: https://codepen.io/sophtwhere
		function addTouchToMouse(forEl) {
			let doc = document;

			if (typeof forEl.removeTouchToMouse === "function") return;

			doc.addEventListener("touchstart", touch2Mouse, true);
			doc.addEventListener("touchmove", touch2Mouse, true);
			doc.addEventListener("touchend", touch2Mouse, true);
			var touching = false;

			 function isValidTouch (el) {
						if (el===forEl) return true;

						if ((el.parentElement===forEl)&&["INPUT","A","BUTTON"].indexOf(el.tagName)<0) return true;
					}
			function touch2Mouse(e) {
				var theTouch = e.changedTouches[0];
				var mouseEv;

				if (!isValidTouch(e.target)) return;

				switch (e.type) {
					case "touchstart":
						if (e.touches.length !== 1) return;
						touching = true;
						mouseEv = "mousedown";
						break;
					case "touchend":
						if (!touching) return;
						mouseEv = "mouseup";
						touching = false;
						break;
					case "touchmove":
						if (e.touches.length !== 1) return;
						mouseEv = "mousemove";
						break;
					default:
						return;
				}

				var mouseEvent = document.createEvent("MouseEvent");
				mouseEvent.initMouseEvent(
					mouseEv,
					true,
					true,
					window,
					1,
					theTouch.screenX,
					theTouch.screenY,
					theTouch.clientX,
					theTouch.clientY,
					false,
					false,
					false,
					false,
					0,
					null
				);
				theTouch.target.dispatchEvent(mouseEvent);

				e.preventDefault();
			}

			forEl.removeTouchToMouse = function removeTouchToMouse() {
				doc.removeEventListener("touchstart", touch2Mouse, true);
				doc.removeEventListener("touchmove", touch2Mouse, true);
				doc.removeEventListener("touchend", touch2Mouse, true);
			};
		}
	}

	const formResizeObserver = new ResizeObserver(entries => {
		for (const entry of entries) {
			const { width, height } = entry.target.getBoundingClientRect();
			GM_setValue('width', width);
			GM_setValue('height', height);
		}
	});

    // allow the equipment list to be repositionable and resizable
    if ($('#bd-form').length) {
		formResizeObserver.observe(document.getElementById('bd-form'));
		dragElement(document.getElementById('bd-form'));
	}

	// remember equipment and options
	// mostly written by Eleven
	let weapons = [];
	let weaponID = '';
	if ($('div#combatlog').text().indexOf('The fight commences!') !== -1) {
		if (GM_getValue('sw1', false)) weapons.push(GM_getValue('sw1'))
		if (GM_getValue('sw2', false)) weapons.push(GM_getValue('sw2'))
	}
	if (weapons.length === 0) {
		weapons = GM_getValue('weapons', []);
	}

	for (const weapon of weapons) {
		$('#equipment .itemList input').each(function() {
			if ($(this).val() !== weaponID && $(this).parent().siblings().eq(1).text().trim().toLowerCase() === weapon.toLowerCase()) {
				weaponID = $(this).val();
				$(this).prop('checked', true);
				countWeaps(weaponID);
				return false;
			}
		});
	}

	if (GM_getValue('ability')) { $('form#bd-form select#ability').val(GM_getValue('ability')).trigger('change') }
	if (GM_getValue('power')) { $('form#bd-form select#power').val(GM_getValue('power')) }

	let ability = '';
	let power = '';

	$('form#bd-form').on('submit', function() {
        if ($('#equipment .relic').length === 0) {
            return; // frozen
		}

		weapons = [];
		$('#equipment .itemList input:checked').each(function() {
			weapons.push($(this).parent().siblings().eq(1).text().trim());
		});

		ability = $('form#bd-form select#ability').find(':selected').val();
		power = $('form#bd-form select#power').find(':selected').val();
		GM_setValue('weapons', weapons);
		GM_setValue('ability', ability);
		GM_setValue('power', power);
	});

    //Go/next/rematch button sizing
    const btnTop = document.querySelector('.cloned-btn input');
    const btnBottom = document.querySelector('form#bd-form input[type=submit], form#bd-form-end input[type=submit]');

    const btnResizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            const resizedButton = entry.target;
            const { width, height } = resizedButton.getBoundingClientRect();
            btnBottom.style.width = `${width}px`;
            btnBottom.style.height = `${height}px`;
            GM_setValue('gowidth', width);
            GM_setValue('goheight', height);
        }
    });

    btnResizeObserver.observe(btnTop);

	GM_registerMenuCommand('Set Starting Weapon 1', function() {
		let value = prompt('Set the first starting weapon for each battle.', GM_getValue('sw1', ''));
		if (value) GM_setValue('sw1', value.trim());
	}, '1');
	GM_registerMenuCommand('Set Starting Weapon 2', function() {
		let value = prompt('Set the second starting weapon for each battle.', GM_getValue('sw2', ''));
		if (value) GM_setValue('sw2', value.trim());
	}, '2');
	GM_registerMenuCommand('Clear Starting Weapons', function() {
		GM_deleteValue('sw1');
		GM_deleteValue('sw2');
	}, 'c');

	})();
