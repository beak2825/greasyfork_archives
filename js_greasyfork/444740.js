// ==UserScript==
// @name         Bilibili Manga With XBox Controller
// @name:zh-CN   用XBox手柄翻页Bilibili漫画
// @namespace    http://sparta-en.org/
// @version      0.2
// @description  Use Xbox wireless controller to control manga player
// @description:zh-cn  用XBox手柄控制Bilibili漫画翻页
// @author       Sparta_EN
// @match        https://manga.bilibili.com/mc*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444740/Bilibili%20Manga%20With%20XBox%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/444740/Bilibili%20Manga%20With%20XBox%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function () {
        let buttonMappings = [
            // XBox 360 https://developer.mozilla.org/en-US/docs/Games/Techniques/Controls_Gamepad_API#implementation
            [
            'DPad-Up','DPad-Down','DPad-Left','DPad-Right',
            'Start','Back','Axis-Left','Axis-Right', 'LB','RB',
            'Power','A','B','X','Y'
            ],
            // XBox ONE
            [
            'A', 'B', 'X', 'Y', 'LB', 'RB', 'LT',
            'RT', 'View', 'Menu', 'Axis-Left', 'Axis-Right', 'DPad-Up',
            'DPad-Down', 'DPad-Left', 'DPad-Right', 'Xbox'
            ],
        ]
        let currentGamePad;
        let currentButtonMapping;
        let coolDown = false;
        window.addEventListener('gamepadconnected', function(e) {
            console.log("Controller connected " + e.gamepad.id);
            currentGamePad = e.gamepad;
            for (let buttonMapping of buttonMappings)
            {
                if (buttonMapping.length == currentGamePad.buttons.length) {
                    currentButtonMapping = buttonMapping;
                }
            }
            if (currentButtonMapping == null) {
                console.error("Unable to find a suitable button mapping :(")
            }
        })

        window.addEventListener('gamepaddisconnected', function(e) {
            if (currentGamePad == e.gamepad) {
                currentGamePad = null;
            }
        })

        function cooldown() {
            coolDown = true;
            setTimeout(function() {
                coolDown = false;
            }, 200);
        }

        function changePage(direction) {
            cooldown();
            if (direction == 'left') {
                window.dispatchEvent(new KeyboardEvent('keyup', {key: "ArrowLeft"}))
            } else {
                window.dispatchEvent(new KeyboardEvent('keyup', {key: "ArrowRight"}))
            }
        }

        setInterval(function() {
            if (currentGamePad && buttonMappings && !coolDown) {
                currentGamePad = navigator.getGamepads()[currentGamePad.index];
                for (let i = 0; i < currentButtonMapping.length; i++) {
                    if (currentGamePad.buttons[i].pressed) {
                        if (currentButtonMapping[i] == 'DPad-Left') {
                            changePage('left');
                        } else if (currentButtonMapping[i] == 'DPad-Right') {
                            changePage('right');
                        }
                    }
                }
                if (currentGamePad.axes[0] < -0.85) {
                    changePage('left');
                } else if (currentGamePad.axes[0] > 0.85) {
                    changePage('right');
                }
            }
        }, 20);
    });
})();