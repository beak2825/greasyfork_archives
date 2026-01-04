// ==UserScript==
// @name Paper.IO by DangNhutNguyen
// @namespace -
// @version 1.1.5
// @description Zoom hack, game speed change hack, instant movement hack, and pause/resume functionality.
// @author Dang Nhut
// @match *://paper-io.com/*
// @match *://*.paper-io.com/*
// @run-at document-start
// @license GPL-3.0-or-later
// @grant none
// @icon data:image/png;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe8MAYnvDAHp7wwB6e8MAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHvDAMp7wwD/e8MA/3vDAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7wwDKe8MA/3vDAP97wwBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfcQAyn3EAP99xAD/fcQAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIHGAMqBxgD/gcYA/4HGAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACHyQDKh8kA/4fJAP+HyQBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjcwAyo3MAP+NzAD/jcwAsI7MAJSOzACUhrgAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJPPAMqTzwD/k88A/5PPAP+TzwD/k88A/4q5DfqKtxdaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACb0wDKm9MA/5vTAP+b0wD/m9MA/5vTAP+Rvif/kLss+pG8MVoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAodYDyqHWA/+h1gP/oNYBhp/VAFyf1QBcnc4X7J3OGP+ezhf6oNMOIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKnaKMqp2ij/qdoo/6naKEAAAAAAAAAAAKnaKOKp2ij/qdoo/6naKCoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACv3UHKr91B/6/dQf+v3UFAAAAAAAAAAACv3UHir91B/6/dQf+v3UEqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAr9VclK/UX/+v1F//tN1WwrXgVK614FSur9Ve9q/UX/+v1F7gsdpUEgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK/QbASx0XCisdFx/7nfY/+64mD/uuJg/7LTb/+x0XDgsNBtIgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtdN3ArbUeqK+4W//v+Rt/7/kbf+31nngtdN4IgAAAAAAAAAAAAAAALXTdwwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC614AEweR2QMLmdELC5nRCvNt8GgAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAPH/AADx/wAA8f8AAPH/AADx/wAA8D8AAPAfAADwDwAA8McAAPHHAADxxwAA8AcAAPgPAAD8HwAA//8AAA==
// @downloadURL https://update.greasyfork.org/scripts/502044/PaperIO%20by%20DangNhutNguyen.user.js
// @updateURL https://update.greasyfork.org/scripts/502044/PaperIO%20by%20DangNhutNguyen.meta.js
// ==/UserScript==

(function() {
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 100000;

    const MIN_GAME_SPEED = 0;
    const MAX_GAME_SPEED = 900000;

    const DEBUG_LEVEL = 0 /* 0 - disabled; 1 - info; 2 - errors */;
    const API_PROPS = ['paperio2api', 'paper2'];

    class Utils {
        static minmax(n, min, max) {
            return Math.min(Math.max(n, min), max);
        }

        static debug(level, ...args) {
            let _level;

            switch (level) {
                case 'log':
                    _level = 0;
                    break;
                case 'error':
                    _level = 1;
                    break;
            }

            if (DEBUG_LEVEL > _level) {
                console[level].apply(this, args);
            }
        }

        static waitForProperty(target, props) {
            let tries = 0;

            try {
                return new Promise((res, rej) => {
                    let intervalId = setInterval(() => {
                        tries++;

                        let validProp = props.find(prop => target[prop]);

                        if (validProp) {
                            clearInterval(intervalId);
                            return res(target[validProp]);
                        }

                        if (tries > 6) {
                            rej('Timeout error, cannot find properties: "' + props + '" in target object.');
                        }
                    }, 1e3);
                });
            } catch(e) {
                Utils.debug('error', 'waitForProperty', e);
            }
        }
    }

    class Hack {
        static init(paper_api) {
            const GAME = paper_api.game;
            const CONFIG = GAME.config;
            const SCENE = getScene();
            let isPaused = false;
            let previousSpeed = CONFIG.unitSpeed;

            Utils.debug('log', this.name + ' initialized!');

            class GameSpeedHack {
                static init(maxGameSpeed, minGameSpeed) {
                    window.addEventListener('keydown', e => {
                        if (e.code === 'ArrowUp') {
                            e.preventDefault();
                            CONFIG.unitSpeed += 100;
                            CONFIG.unitSpeed = Utils.minmax(CONFIG.unitSpeed, minGameSpeed, maxGameSpeed);
                        } else if (e.code === 'ArrowDown') {
                            e.preventDefault();
                            CONFIG.unitSpeed -= 100;
                            CONFIG.unitSpeed = Utils.minmax(CONFIG.unitSpeed, minGameSpeed, maxGameSpeed);
                        }
                    });

                    window.addEventListener('keydown', e => {
                        if (e.code === 'Space') {
                            e.preventDefault();
                            if (isPaused) {
                                CONFIG.unitSpeed = previousSpeed;
                                isPaused = false;
                            } else {
                                previousSpeed = CONFIG.unitSpeed;
                                CONFIG.unitSpeed = 0;
                                isPaused = true;
                            }
                        }
                    });
                }
            }

            class ZoomHack {
                static init(maxZoom, minZoom) {
                    window.addEventListener('wheel', e => {
                        e.preventDefault();

                        const isPositive = e.deltaY > 0;
                        const zoomChange = isPositive ? -0.1 : 0.1; // Adjust zoom sensitivity

                        SCENE.maxScale += zoomChange;
                        SCENE.maxScale = Utils.minmax(SCENE.maxScale, minZoom, maxZoom);
                    });
                }
            }

            class InstantMovement {
                static init(listenersData) {
                    listenersData.forEach(data => {
                        try {
                            window.addEventListener('keydown', e => {
                                try {
                                    if (e.code === data.code) {
                                        const PLAYER = GAME.player;

                                        PLAYER.position[data.direction] += 200 * (data.isNegative ? -1 : 1);
                                    }
                                } catch (err) {
                                    Utils.debug('error', data, err);
                                }
                            });
                        } catch (e) {
                            Utils.debug('error', this.name, data, e);
                        }
                    });
                }
            }

            GameSpeedHack.init(
                MAX_GAME_SPEED,
                MIN_GAME_SPEED
            );

            ZoomHack.init(
                MAX_ZOOM,
                MIN_ZOOM
            );

            InstantMovement.init([{
                code: 'KeyW',
                direction: 'y',
                isNegative: true,
            }, {
                code: 'KeyS',
                direction: 'y',
                isNegative: false,
            }, {
                code: 'KeyA',
                direction: 'x',
                isNegative: true,
            }, {
                code: 'KeyD',
                direction: 'x',
                isNegative: false,
            }]);

            function getScene() {
                if (paper_api.currentConfig) {
                    return paper_api.currentConfig;
                }

                if (paper_api.configs) {
                    return paper_api.configs.paper2_classic;
                }

                return paper_api.config;
            }
        }
    }

    class Main {
        static init() {
            Utils.waitForProperty(window, API_PROPS).then(paperapi => {
                Utils.waitForProperty(paperapi, ['game']).then(() => {
                    Main.showInstructions();
                    Hack.init(paperapi);
                });
            });
        }

        static showInstructions() {
            alert(
                "PAPER.IO Script - Made by Dang Nhut INSTRUCTION:\n" +
                "- Follow me on Github: https://github.com/DangNhutNguyen:\n" +
                "- This script only for education purpose only, please use this script as tools to developed your programming language.\n" +
                "- Zoom: Use the mouse wheel to zoom in and out.\n" +
                "- Change game speed: Use the up/down arrow keys to adjust speed.\n" +
                "- Instant Movement: Use 'W', 'A', 'S', 'D' for quick moves in the respective directions.\n" +
                "- Pause/Resume: Press 'Spacebar' to pause or resume the game."
            );
        }
    }

    Main.init();
})();
