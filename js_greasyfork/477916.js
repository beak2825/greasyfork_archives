/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               ku10 Enhance
// @namespace          PY-DNG userscripts
// @version            0.2.1
// @description        ku10.com增强：课程倒放、跳转Gomocalc分析
// @description:en     try to take over the world!
// @author             PY-DNG
// @license            GPL-3.0-or-later
// @match              *://ku10.com/
// @match              *://ku10.com/#*
// @require            https://greasyfork.org/scripts/456034-basic-functions-for-userscripts/code/script.js?version=1226884
// @icon               data:image/png;base64,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
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/477916/ku10%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/477916/ku10%20Enhance.meta.js
// ==/UserScript==

/* global LogLevel DoLog Err $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager */
/* global record_player */

(function __MAIN__() {
    'use strict';

	$('#play_control>.buttons').insertAdjacentElement('afterbegin', $$CrE({
		tagName: 'div',
		props: { innerText: '<' },
		classes: ['button'],
		listeners: [['click', e => record_player.back()]]
	}));

	record_player.jumpto = function(i) {
		const obj = this;

		const list = $('#chat_content');

		if (i < obj.pointer) {
			// Remove 'future' messages
			for (let j = obj.pointer; j > i; j--) {
				const noMsgActions = ['BACK', 'RESET', 'FIRST', 'NEXT', 'LOAD', 'LAST', 'GOTO'];
				if (!noMsgActions.includes(obj.record[j-1].action)) {
					while ($(list.children[list.children.length-1], '.chat-sys')) {
						list.children[list.children.length-1].remove();
					}
					list.children[list.children.length-1].remove();
				}
			}

			// Reload board
			const boardStatus = calcBoard(i);
			obj.boardHandler.load(boardStatus.game);
			obj.boardHandler.endgame = boardStatus.endgame;
			obj.pointer = i;
		} else {
			// Load history messages
			for (let j = obj.pointer; j < i; j++) {
				obj.play();
			}
		}
	}

	record_player.back = function() {
		record_player.pointer > 0 ? record_player.jumpto(record_player.pointer-1) : record_player.sysMsg('已经是第一条了');
	}

	// Analyze in gomocalc
	$AEL($('.controlbar>button'), 'click', function(e) {
		if (e.target.matches('.controlbar>button:first-child')) {
			record_player.pause();
			const gomocalcStr = ku10ToGomocalc(record_player.boardHandler.currgame);
			window.open(`https://gomocalc.com/#/${gomocalcStr}`, 'analyze');
			e.stopImmediatePropagation();
		}
	}, { capture: true });

	// No selections in buttons
	addStyle('.button {user-select: none;}');

	function calcBoard(i) {
		let game = '', endgame = '';
		for (let j = 0; j < i; j++) {
			const record = record_player.record[j];
			switch (record.action) {
				case 'MOVE': {
					game += record.content;
					if (endgame.substring(0, game.length) !== game) {
						endgame = game;
					}
					break;
				}
				case 'BACK': {
					game = game.substring(0, game.length-2);
					break;
				}
				case 'RESET': {
					game = endgame = '';
					break;
				}
				case 'FIRST': {
					game = endgame.substring(0, 2);
					break;
				}
				case 'NEXT': {
					game = endgame.substring(0, game.length+2);
					break;
				}
				case 'LOAD': {
					game = endgame = record.content;
					break;
				}
				case 'LAST': {
					game = endgame;
					break;
				}
				case 'GOTO': {
					while (game.length > record.content * 2) {
						game = game.substring(0, game.length-2);
					}
					while (game.length < record.content * 2) {
						game = endgame.substring(0, game.length+2);
					}
					break;
				}
			}
		}
		return {game, endgame};
	}

	function ku10ToGomocalc(ku10) {
		const xConvert = numStr => 'abcdefghijklmno'.charAt(parseInt(numStr, 16) - 1);
		const yConvert = numStr => ('123456789abcdef'.indexOf(numStr) + 1).toString();
		let gomocalc = '';
		for (let i = 0; i < ku10.length; i = i + 2) {
			const [x, y] = [ku10.charAt(i), ku10.charAt(i+1)];
			gomocalc += xConvert(x) + yConvert(y);
		}
		return gomocalc;
	}
})();