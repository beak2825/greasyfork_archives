/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               game.hg0355.com hack
// @name:zh-CN         你是我的小苹果 判定破解
// @namespace          game.hg0355.com-hack
// @version            0.1
// @description        Hack: feel free to touch anywhere, no fail!
// @description:zh-CN  随便点哪都能接住苹果，飙手速的时候到了！
// @author             PY-DNG
// @license            MIT
// @match              http*://game.hg0355.com/game/xpg/
// @icon               https://api.iowen.cn/favicon/get.php?url=game.hg0355.com
// @grant              none
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/437244/gamehg0355com%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/437244/gamehg0355com%20hack.meta.js
// ==/UserScript==


(function main() {
	if (typeof (GameLayerBG) != 'object') {
		setTimeout(main, 100);
		return false;
	}
	GameLayerBG.ontouchstart && (GameLayerBG.ontouchstart = _gameTapEvent);
	GameLayerBG.onmousedown && (GameLayerBG.onmousedown = _gameTapEvent);

	function _gameTapEvent(e) {
		if (_gameOver) {
			return false;
		}
		var tar = e.target;
		var y = e.clientY || e.targetTouches[0].clientY,
			x = (e.clientX || e.targetTouches[0].clientX) - body.offsetLeft,
			p = _gameBBList[_gameBBListIndex];
		if (y > touchArea[0] || y < touchArea[1]) {
			return false;
		}
		if (!_gameStart) {
			gameStart();
		}
		createjs.Sound.play("tap");
		tar = document.getElementById(p.id);
		tar.className = tar.className.replace(_ttreg, ' tt$1');
		_gameBBListIndex++;
		_gameScore++;
		gameLayerMoveNextRow();
		return false;
	}
})();