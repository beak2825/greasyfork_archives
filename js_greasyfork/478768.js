// ==UserScript==
// @name         sbx autospawn/level/build
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  auto spawn, level and build in diep.io, press alt+p to toggle it on and off, p to set a build
// @author       DDragon
// @match        https://*diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478768/sbx%20autospawnlevelbuild.user.js
// @updateURL https://update.greasyfork.org/scripts/478768/sbx%20autospawnlevelbuild.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function workOutUserInput(userInput){
        let Array = userInput.toLowerCase().split('');
        let filterspaces = Array.filter(letter => letter !== ' ');
        let filterhyphens = filterspaces.filter(letter => letter !== '-');
        let string = filterhyphens.join('');
        return string;
    };

    var build = '';
    let upgrades = [
        {name: 'glass', build: '656565656564488888777777756445884'},
        {name: 'factory', build: '656565656564444888888856544477777'},
        {name: 'overlord', build: '656565656564444888888856544432323'},
        {name: 'ssp', build: '656565656568888777777756853238328'},
        {name: 'ram', build: '232323232388888832832111777777711'},
        {name: 'smasher', build: '5656565656565677744487777888222222222233333333338888888888111'},
        {name: '2bs', build: '656565656564488887777777888565323'},
        {name: '3bs', build: '656565656564448888777777788856532'},
        {name: '4bs', build: '656565656564444888877777778885653'},
        {name: 'doge', build: '656565656567777777565323232323232'}
    ];

    var respawn = false;

    var i_code = 73;
    var o_code = 79;
    var p_code = 80;
    var k_code = 75;


    function press_key(k1, k2, t, w) {
        // k1 is the string of the key
        // k2 is the ascii of the key
        const eventOptions = {
          key: k1,
          code: k1,
          keyCode: k2, // Deprecated, but still widely used for compatibility
          which: k2,   // Deprecated, but still widely used for compatibility
          bubbles: true, // Crucial for event propagation to other listeners
          cancelable: true,
        };

        setTimeout(() => {
            const simulatedKeyDownEvent = new KeyboardEvent('keydown', eventOptions);
            document.body.dispatchEvent(simulatedKeyDownEvent);
        }, t);

        setTimeout(() => {
          const simulatedKeyUpEvent = new KeyboardEvent('keyup', eventOptions);
          document.body.dispatchEvent(simulatedKeyUpEvent);
        }, t + w);
    }

    function set_build(b, t) {
        setTimeout(function() {
            input.set_convar('game_stats_build', b);
        }, t);
    }

    function isDead(){
        const gameScreen = document.getElementById('in-game-screen');
        // console.log(gameScreen.className);

        return gameScreen.className == 'screen';

    }

    function respawnFunc(){
        // simulate enter presses to spawn
        press_key('Enter', 13, 1000, 200);
        press_key('Enter', 13, 1400, 200);

        // set build
        set_build(build, 2000);

        // level up
        press_key('k', k_code, 2500, 4000);
    }

    document.body.onkeydown = function(e) {
        console.log('key press');
        if (e.keyCode === o_code) {
            console.log('o pressed');
            if (respawn) {
                respawnFunc();
            }
        }
        if (e.keyCode === p_code) {
            console.log('p pressed');
            if (e.altKey) {respawn = !respawn}
            else {
                if (respawn) {
                    let user_choice = prompt('Choose the build, These are the options: glass, factory, overlord, ssp, ram, smasher, 2bs, 3bs, 4bs')
                    if (user_choice == '' || user_choice == null || user_choice == ' ') {
                        build = ''
                        return;
                    }
                    let match = upgrades.find((item) => {
                        return item.name.includes(workOutUserInput(user_choice))
                    });
                    input.set_convar('game_stats_build', match.build);
                    build = match.build;
                    press_key('o', o_code, 0, 100);
                    respawnFunc();
                }
            }
        }
    }

    window.addEventListener('load', () => {
        setInterval(() => {
            if (isDead() && respawn){
                respawnFunc();
            }
        });
    });
})();