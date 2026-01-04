/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               Keyboard support for http://game.hg0355.com/game/xpg/
// @name:zh-CN         键盘暴打小苹果
// @namespace          SP_XPG_WITH_KEYBOARD
// @version            0.2
// @description        Use 'D' 'F' 'J' 'K' to beat the apples
// @description:zh-CN  使用'D' 'F' 'J' 'K'四个键位暴打小苹果
// @author             PY-DNG
// @license            MIT
// @match              http*://game.hg0355.com/game/xpg/
// @icon               https://api.iowen.cn/favicon/get.php?url=http://game.hg0355.com/game/xpg/
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/437946/Keyboard%20support%20for%20http%3Agamehg0355comgamexpg.user.js
// @updateURL https://update.greasyfork.org/scripts/437946/Keyboard%20support%20for%20http%3Agamehg0355comgamexpg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function main() {
		if (typeof (GameLayerBG) != 'object') {
			setTimeout(main, 100);
			return false;
		}

		// Backup sharetext
		window.oshareText = window.shareText;
		const gameStart = window.gameStart;
		window.gameStart = function() {
			window.shareText = window.oshareText;
			return gameStart();
		}

		document.addEventListener('keydown', function(e) {
			const key = e.key.toLowerCase();
			if (key === 'enter') {closeWelcomeLayer();}
			if (!['d', 'f', 'j', 'k'].includes(key)) {return false;}

			// Get block
			let number = 0;
			switch(key) {
				case 'd':
					number = _gameBBListIndex * 4 + 4;
					break;
				case 'f':
					number = _gameBBListIndex * 4 + 5;
					break;
				case 'j':
					number = _gameBBListIndex * 4 + 6;
					break;
				case 'k':
					number = _gameBBListIndex * 4 + 7;
					break;
			}
			const id = '#GameLayer{A}-{B}'.replace('{A}', Math.floor(number / 40) % 2 === 0 ? '1' : '2').replace('{B}', (number % 40).toString());
			const tar = document.querySelector(id);

			// Create event
			const evtOptions = {
				clientX: Math.round((touchArea[0] + touchArea[1]) / 2),
				clientY: Math.round((touchArea[0] + touchArea[1]) / 2),
				target: tar
			}

			// Dispatch event
			GameLayerBG.onmousedown(evtOptions);

			// Using keyboard, then display keyboard text in final page
			window.shareText = _shareText;
		});

		function _shareText(score) {
			cookie('score2', score, 100);
			if (score <= 49) return '呵呵！我吃掉了' + score + '个小苹果！<br/>亲，还得加油哦!<br/><span style="font-size:0.5em">(电脑端键盘操作)</span>';
			if (score <= 99) return '酷！我吃掉了' + score + '个小苹果！<br/>亲，不错哦！<br/><span style="font-size:0.5em">(电脑端键盘操作)</span>';
			if (score <= 149) return '帅呆了！我吃掉了' + score + '个小苹果！<br/>亲，爱死你了！<br/><span style="font-size:0.5em">(电脑端键盘操作)</span>';
			if (score <= 199) return '太牛了！我吃掉了' + score + '个小苹果！<br/>亲，奥巴马和金正恩都惊呆了！<br/><span style="font-size:0.5em">(电脑端键盘操作)</span>';
			if (score >= 200) return '【年度科幻片】您在20秒内恰了' + score + '个小苹果！<br/><span style="font-size:0.2em"><del>您入门了</del></span><br/><span style="font-size:0.5em">(电脑端键盘操作)</span>';
		}
	}) ();
})();