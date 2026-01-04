// ==UserScript==
// @name        Classic Mouse
// @author      commander
// @description Restores the mouse from TankTrouble Classic back into TankTrouble Online
// @namespace   https://github.com/asger-finding/tanktrouble-userscripts
// @version     0.0.1
// @license     GPL-3.0
// @match       https://tanktrouble.com/*
// @match       https://beta.tanktrouble.com/*
// @exclude     *://classic.tanktrouble.com/
// @run-at      document-end
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/484391/Classic%20Mouse.user.js
// @updateURL https://update.greasyfork.org/scripts/484391/Classic%20Mouse.meta.js
// ==/UserScript==

/* eslint-disable new-cap */
/* eslint-disable complexity */

UIConstants.CLASSIC_MOUSE_INPUT = {
	ROTATION_DEAD_ANGLE: 0.1,
	POSITION_DEAD_DISTANCE: 180
};

MouseInputManager.method('update', function() {
	this._super();

	const game = GameManager.getGame();
	if (game) {
		let forwardState = false;
		const backState = false;
		const leftState = [];
		const rightState = [];
		let fireState = false;

		const gameBounds = game.scale.bounds;
		const gameScale = game.scale.scaleFactor;
		this.mouseX = (MouseInputManager.mousePageX - gameBounds.x) * gameScale.x;
		this.mouseY = (MouseInputManager.mousePageY - gameBounds.y) * gameScale.y;
		if (game.input.enabled && MouseInputManager.mouseActivated) {
			if (game.state.getCurrentState().getTankSprite) {
				const tankSprite = game.state.getCurrentState().getTankSprite(this.playerId);
				if (tankSprite) {
					const relativeToTank = tankSprite.toLocal(new Phaser.Point(this.mouseX, this.mouseY));
					const angle = Phaser.Math.angleBetween(0, 0, relativeToTank.x, relativeToTank.y);
					const distance = Math.abs((angle / Math.PI) + 0.5);

					const rotationSpeedMultiplier = distance > 0.1
						? Math.max(Math.min(distance * 12, 4), 1)
						: 1;

					leftState.push(angle + (Math.PI * 0.5) < -UIConstants.CLASSIC_MOUSE_INPUT.ROTATION_DEAD_ANGLE, rotationSpeedMultiplier);
					rightState.push(angle + (Math.PI * 0.5) > UIConstants.CLASSIC_MOUSE_INPUT.ROTATION_DEAD_ANGLE, rotationSpeedMultiplier);

					forwardState = relativeToTank.getMagnitude() > UIConstants.CLASSIC_MOUSE_INPUT.POSITION_DEAD_DISTANCE / UIConstants.GAME_ASSET_SCALE;

					fireState ||= KeyboardInputManager.leftMouseDown || game.input.mousePointer.leftButton.isDown;
				}
			}
		}
		let stateChanged = false;
		stateChanged ||= this.storedStates.forward !== forwardState;
		stateChanged ||= this.storedStates.fire !== fireState;
		stateChanged ||= !leftState.every((el, i) => this.storedStates.left[i] === el);
		stateChanged ||= !rightState.every((el, i) => this.storedStates.right[i] === el);

		const gameController = GameManager.getGameController();
		if (stateChanged && gameController) {
			const inputState = InputState.withState(this.playerId, forwardState, backState, leftState, rightState, fireState);
			gameController.setInputState(inputState);
		}

		this.storedStates.forward = forwardState;
		this.storedStates.back = backState;
		this.storedStates.left = leftState;
		this.storedStates.right = rightState;
		this.storedStates.fire = fireState;
	}
});

Tank.method('setTankState', function(tankState) {
	this.playerId = tankState.getPlayerId();
	this.x = tankState.getX();
	this.y = tankState.getY();
	this.forward = tankState.getForward();
	this.back = tankState.getBack();
	this.rotation = tankState.getRotation();
	this.fireDown = tankState.getFireDown();
	this.locked = tankState.getLocked();

	const left = tankState.getLeft();
	const right = tankState.getRight();
	[this.left, this.rotationSpeedMultiplier] = Array.isArray(left) ? left : [left, 1.0];
	[this.right, this.rotationSpeedMultiplier] = Array.isArray(right) ? right : [right, 1.0];

	if (this.b2dbody) {
		this.b2dbody.SetPosition(Box2D.Common.Math.b2Vec2.Make(this.x, this.y));
		this.b2dbody.SetAngle(this.rotation);

		this.update();
	}
});

Tank.method('update', function() {
	this.x = this.b2dbody.GetPosition().x;
	this.y = this.b2dbody.GetPosition().y;
	this.rotation = this.b2dbody.GetAngle();
	if (this.locked) {
		this.b2dbody.SetLinearVelocity(Box2D.Common.Math.b2Vec2.Make(0.0, 0.0));
		this.b2dbody.SetAngularVelocity(0.0);
	} else {
		this._computeSpeed();
		this._computeRotationSpeed();
		const speedX = Math.sin(this.rotation) * this.speed;
		const speedY = -Math.cos(this.rotation) * this.speed;
		this.b2dbody.SetLinearVelocity(Box2D.Common.Math.b2Vec2.Make(speedX, speedY));
		this.b2dbody.SetAngularVelocity(this.rotationSpeed * (this.rotationSpeedMultiplier || 1));
	}
});
