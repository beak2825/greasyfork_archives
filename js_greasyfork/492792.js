// ==UserScript==
// @name TankTrouble Booster
// @namespace http://tampermonkey.net/
// @version      3.1.3
// @license      GPL-3.0
// @description Boost performance for better game experience.
// @author kamarov
// @match https://tanktrouble.com/*
// @run-at      document-end
// @grant       GM_addStyle
// @require     https://update.greasyfork.org/scripts/482092/1297984/TankTrouble%20Development%20Library.js
// @downloadURL https://update.greasyfork.org/scripts/492792/TankTrouble%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/492792/TankTrouble%20Booster.meta.js
// ==/UserScript==

//Disable camera shake
UIConstants.MAX_CAMERA_SHAKE = 0;
UIConstants.CAMERA_SHAKE_FADE = 0;
UIConstants.MINE_EXPLOSION_CAMERA_SHAKE = 0;

//Disable feather particles spawning
UIConstants.TANK_FEATHER_COUNT = 0;
UIConstants.TANK_FEATHER_POOL_SIZE = 0;

//Disable score fragments particles spawning
UIConstants.MAX_SCORE_FRAGMENTS_PER_EXPLOSION = 0;
UIConstants.MIN_SCORE_FRAGMENTS_PER_LETTER = 0;

//Lower the sparkle effects
UIConstants.GOLD_SPARKLE_MAX_INTERVAL_TIME = 9999
UIConstants.GOLD_SPARKLE_MIN_INTERVAL_TIME = 9999
UIConstants.DIAMOND_SPARKLE_MAX_INTERVAL_TIME = 9999
UIConstants.DIAMOND_SPARKLE_MIN_INTERVAL_TIME = 9999

//Lower and disable garage animations
UIConstants.GARAGE_WELD_PARTICLE_TIME = 500
UIConstants.GARAGE_WELD_SMOKE_TIME = 500
UIConstants.GARAGE_WELD_SPARK_TIME = 500
UIConstants.GARAGE_SPRAY_SHAKE_PROBABILITY = 0
UIConstants.GARAGE_SPRAY_PARTICLE_TIME = 550

//Disable rubble particles
UIConstants.RUBBLE_TREAD_OFFSET = 0
UIConstants.RUBBLE_FRAGMENT_POOL_SIZE = 0
UIConstants.RUBBLE_FRAGMENT_MAX_LIFETIME= 0
UIConstants.RUBBLE_FRAGMENT_MIN_LIFETIME= 0
UIConstants.RUBBLE_FRAGMENT_MAX_ROTATION_SPEED= 0
UIConstants.RUBBLE_FRAGMENT_SPEED_SCALE = 0
UIConstants.RUBBLE_FRAGMENT_RANDOM_SPEED = 0
UIConstants.RUBBLE_SMOKE_SPEED_SCALE = 0
UIConstants.RUBBLE_SMOKE_RANDOM_SPEED = 0
UIConstants.INVERSE_RUBBLE_SPAWN_PROBABILITY_IN_COLLISION = 9999
UIConstants.INVERSE_RUBBLE_SPAWN_PROBABILITY_IN_THE_OPEN = 9999

//Lower and disable shield animations
UIConstants.SHIELD_LAYER_1_ROTATION_SPEED = 0
UIConstants.SHIELD_LAYER_2_ROTATION_SPEED = 0
UIConstants.SHIELD_NUM_BOLTS = 0
UIConstants.SHIELD_SPARK_BOLT_POOL_SIZE = 0

//Disable poof effects weapons
UIConstants.BULLET_PUFF_POOL_SIZE = 0

//Lower the amount of particles spawning for each quality
QualityManager.QUALITY_VALUES.auto = {
    "tank explosion smoke count": 2,
    "tank explosion fragment count": 2,
    "missile launch smoke count": 0,
    "missile smoke frequency": 9999,
    "mine explosion smoke count": 2,
    "crate land dust count": 0,
    "aimer min segment length":2,
    "aimer off max segment length": 15.0,
    "aimer on max segment length": 6.0,
    "bullet puff count": 0,
    "shield inverse bolt probability": 1,
    "shield spark particles per emit": 0,
    "spawn zone inverse unstable particle probability": 1,
    "spawn zone num collapse particles": 0
};

QualityManager.QUALITY_VALUES.high = {
    "tank explosion smoke count": 2,
    "tank explosion fragment count": 2,
    "missile launch smoke count": 0,
    "missile smoke frequency": 9999,
    "mine explosion smoke count": 2,
    "crate land dust count": 0,
    "aimer min segment length": 2,
    "aimer off max segment length": 10.0,
    "aimer on max segment length": 5.0,
    "bullet puff count": 0,
    "shield inverse bolt probability": 1,
    "shield spark particles per emit": 0,
    "spawn zone inverse unstable particle probability": 1,
    "spawn zone num collapse particles": 0
};

QualityManager.QUALITY_VALUES.low = {
    "tank explosion smoke count": 1,
    "tank explosion fragment count": 1,
    "missile launch smoke count": 0,
    "missile smoke frequency": 9999,
    "mine explosion smoke count": 1,
    "crate land dust count": 0,
    "aimer min segment length": 0,
    "aimer off max segment length": 12.0,
    "aimer on max segment length": 6.0,
    "bullet puff count": 0,
    "shield inverse bolt probability": 1,
    "shield spark particles per emit": 0,
    "spawn zone inverse unstable particle probability": 1,
    "spawn zone num collapse particles": 0
};

whenContentInitialized().then(() => {
Game.UIBootState.method('create', function () {
    this.log = Log.create('UIBootState');

            // Input & scale settings
            this.input.touch.preventDefault = false;
            this.scale.compatibility.scrollTo = false;

            // Disable right-click context menu
            this.game.canvas.oncontextmenu = function (e) {
                e.preventDefault();
            };

            // Prevent game from pausing when tab loses focus
            this.game.stage.disableVisibilityChange = true;

            // Add key capture for common keys
            this.input.keyboard.addKeyCapture([
                Phaser.Keyboard.LEFT,
                Phaser.Keyboard.RIGHT,
                Phaser.Keyboard.UP,
                Phaser.Keyboard.DOWN,
                Phaser.Keyboard.SPACEBAR
            ]);

            // Disable input if overlay is showing
            if (OverlayManager.isOverlayShowing()) {
                this.input.enabled = false;
            }

            // Set world bounds and background
            this.world.bounds = new Phaser.Rectangle(0, 0, this.game.width, this.game.height);
            this.camera.setBoundsToWorld();
            this.stage.backgroundColor = '#fff';

            // Change animation frames
            var time = this.game.time;
            time.physicsElapsed = 1 / 120;
            time.physicsElapsedMS = 1000 * time.physicsElapsed;

            // Handle high DPI scaling
            if (this.game.device.pixelRatio > 1) {
                this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;

                // Scale down for high DPI
                const scaleRatio = 1 / this.game.device.pixelRatio;
                this.scale.setUserScale(scaleRatio, scaleRatio, 0, 0);
                this.scale.setGameSize(
                    this.game.width * this.game.device.pixelRatio,
                    this.game.height * this.game.device.pixelRatio
                );

                // Handle resizing
                this.scale.setResizeCallback(function (scale, parentBounds) {
                    const newWidth = parentBounds.width * this.game.device.pixelRatio;
                    const newHeight = parentBounds.height * this.game.device.pixelRatio;

                    if (
                        Math.abs(newWidth - this.game.width) >= 0.01 ||
                        Math.abs(newHeight - this.game.height) >= 0.01
                    ) {
                        this.log.debug('RESIZE CANVAS!');
                        this.scale.setGameSize(newWidth, newHeight);
                    }
                }, this);
            } else {
                this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
            }

            // Start preload state
            this.state.start('Preload');
        });

  //Uncap FPS
  (function() {
    'use strict';

    const originalRequestAnimationFrame = window.requestAnimationFrame;

    window.requestAnimationFrame = function(callback) {
        return originalRequestAnimationFrame(function(timestamp) {
            setTimeout(() => callback(performance.now()), 0);
        });
    };

    if ('requestAnimationFrame' in window) {
        console.log('FPS uncapped.');
    }
})();

})
