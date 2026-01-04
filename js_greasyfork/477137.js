// ==UserScript==
// @name              Custom Flair Animator
// @version           1
// @description       Animate custom flair using a spritesheet
// @include           https://*.koalabeast.com/game
// @include           https://*.koalabeast.com/game?*
// @author            Bambi
// @grant             none
// @namespace https://greasyfork.org/users/1089343
// @downloadURL https://update.greasyfork.org/scripts/477137/Custom%20Flair%20Animator.user.js
// @updateURL https://update.greasyfork.org/scripts/477137/Custom%20Flair%20Animator.meta.js
// ==/UserScript==

console.log('START: ' + GM_info.script.name + ' (v' + GM_info.script.version + ' by ' + GM_info.script.author + ')');

tagpro.ready(function () {
    const flairSpritesheetURL = 'https://i.imgur.com/tnVHI5u.png'; // Replace with your spritesheet URL.
    const flairFrameWidth = 16; // Width of each frame in pixels.
    const flairFrameHeight = 16; // Height of each frame in pixels.
    const flairFramesPerSecond = 16; // Desired frames per second.
    const gridRows = 6; // Number of rows in the grid.
    const gridCols = 6; // Number of columns in the grid.
    const totalFrames = 36; // Total number of frames in your spritesheet.

    let currentFrame = 0;
    let lastUpdateTime = 0;

    const flairContainer = new PIXI.Container();
    const flairSprite = new PIXI.Sprite();
    flairContainer.addChild(flairSprite);
    flairContainer.scale.set(1.0); // Adjust the scale as needed.

    const flairTexture = PIXI.Texture.from(flairSpritesheetURL);

    function animateFlair() {
        const currentTime = Date.now();
        if (currentTime - lastUpdateTime >= 1000 / flairFramesPerSecond) {
            currentFrame = (currentFrame + 1) % totalFrames;
            const frameX = (currentFrame % gridCols) * flairFrameWidth;
            const frameY = Math.floor(currentFrame / gridCols) * flairFrameHeight;
            flairSprite.texture = new PIXI.Texture(flairTexture.baseTexture, new PIXI.Rectangle(frameX, frameY, flairFrameWidth, flairFrameHeight));
            lastUpdateTime = currentTime;
        }
        requestAnimationFrame(animateFlair);
    }

    function changeFlair() {
        const player = tagpro.players[tagpro.playerId];

        if (player.id === tagpro.playerId && !player.newFlair) {
            if (player.sprites.flair) {
                player.sprites.info.removeChild(player.sprites.flair);
                player.sprites.flair.destroy();
                player.sprites.flair = null;
            }

            if (!player.sprites.flair) {
                player.sprites.flair = flairContainer;
                player.sprites.flair.anchor = new PIXI.Point(0.5, 0.5);
                player.sprites.flair.position = new PIXI.Point(15, -17); // (20, -9) is normal
                player.sprites.info.addChild(player.sprites.flair);
                player.flair = player.sprites.flair.flairName = 'shinyaxe';
            }

            player.newFlair = true;
        }
    }

    function waitForPlayer() {
        return new Promise(resolve => {
            let clearable;

            clearable = setInterval(function () {
                if (tagpro && !tagpro.spectator && tagpro.players && tagpro.playerId && tagpro.players[tagpro.playerId] && tagpro.players[tagpro.playerId].hasOwnProperty('flair') && tagpro.players[tagpro.playerId].sprites) {
                    clearInterval(clearable);
                    resolve();
                }
            }, 100);
        });
    }

    waitForPlayer().then(() => {
        changeFlair();
        animateFlair();
    });
});