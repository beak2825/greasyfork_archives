// ==UserScript==
// @name        Display every game in the lobby
// @author      commander
// @version     0.0.2
// @license     GPL-3.0
// @namespace   https://github.com/asger-finding/tanktrouble-userscripts
// @match       https://tanktrouble.com/*
// @match       https://beta.tanktrouble.com/*
// @exclude     *://classic.tanktrouble.com/
// @description Show all 6 potential games while in the lobby
// @run-at      document-end
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/483169/Display%20every%20game%20in%20the%20lobby.user.js
// @updateURL https://update.greasyfork.org/scripts/483169/Display%20every%20game%20in%20the%20lobby.meta.js
// ==/UserScript==

UIConstants.GAME_ICON_POOL_SIZE = 6;
UIConstants.GAME_ICON_COUNT = 6;
UIConstants.GAME_ICON_WIDTH /= 1.9;
UIConstants.GAME_ICON_HEIGHT /= 1.9;

UIGameIconImage.prototype.spawn = function(x, y, gameState, favouriteActiveQueuedCounts) {
	this.reset(x, y);
	this.gameId = gameState.getId();
	this.mode = gameState.getMode();
	this.ranked = gameState.getRanked();
	this.playerStates = gameState.getPlayerStates();
	this.favouriteActiveQueuedCounts = favouriteActiveQueuedCounts;
	this._updateUI();
	const delay = 50 + (Math.random() * 200);
	if (this.removeTween) this.removeTween.stop();

	this.game.add.tween(this.scale).to({
		x: UIConstants.ASSET_SCALE / 1.9,
		y: UIConstants.ASSET_SCALE / 1.9
	}, UIConstants.ELEMENT_POP_IN_TIME, Phaser.Easing.Back.Out, true, delay);
};
