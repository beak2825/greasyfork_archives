// ==UserScript==
// @name         Zombia Borders
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Creates useful borders around your factory.
// @author       asdf
// @match        zombia.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505887/Zombia%20Borders.user.js
// @updateURL https://update.greasyfork.org/scripts/505887/Zombia%20Borders.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const loadPixiAndRun = () => {
        const script = document.createElement('script');
        script.src = 'https://pixijs.download/release/pixi.min.js';
        script.onload = () => {
            const checkGameReady = () => {
                if (typeof game !== 'undefined' && game.renderer && game.renderer.scenery && game.renderer.scenery.node) {
                    const lines = [];

                    const makeBorder = (x, y, width, height, shouldAddInArray, colorType = "red") => {
                        const obj = new PIXI.Graphics();
                        const color = colorType === "white" ? 0xFFFFFF : 0xff0000;

                        obj.beginFill(color);
                        obj.drawRect(0, 0, width, height);
                        obj.endFill();

                        obj.x = x;
                        obj.y = y;
                        game.renderer.scenery.node.addChild(obj);

                        if (shouldAddInArray) {
                            lines.push(obj);
                        }
                    };

                    makeBorder(0, 0, 3, 23997);
                    makeBorder(0, 0, 23997, 3);
                    makeBorder(23997, 0, 3, 24000);
                    makeBorder(0, 23997, 23997, 3);

                    if (!game.renderer.world.oldCreateEntity) {
                        game.renderer.world.oldCreateEntity = game.renderer.world.createEntity;
                    }

                    game.renderer.world.createEntity = (e, i) => {
                        if (e.entityClass) {
                            game.renderer.world.oldCreateEntity(e);
                        }

                        if (e.model === "Factory") {
                            if (window.lines && window.lines.length) {
                                window.lines.forEach(line => line.destroy());
                            }

                            if (window.lines) {
                                window.lines.length = 0;
                            }

                            const factory = { x: e.position.x, y: e.position.y };

                            makeBorder(factory.x - 48, factory.y - 48, 3, 96, true, "white");
                            makeBorder(factory.x - 48, factory.y + 48, 96, 3, true, "white");
                            makeBorder(factory.x + 48, factory.y - 48, 3, 96, true, "white");
                            makeBorder(factory.x - 48, factory.y - 48, 96, 3, true, "white");

                            makeBorder(factory.x - 864, factory.y - 864, 3, 1728, true, "white");
                            makeBorder(factory.x - 864, factory.y + 864, 1728, 3, true, "white");
                            makeBorder(factory.x + 864, factory.y - 864, 3, 1728, true, "white");
                            makeBorder(factory.x - 864, factory.y - 864, 1728, 3, true, "white");
                        }
                    };

                } else {
                    setTimeout(checkGameReady, 1000);
                }
            };

            checkGameReady();
        };
        document.head.appendChild(script);
    };

    loadPixiAndRun();
})();