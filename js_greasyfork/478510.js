// ==UserScript==
// @name         Sandbox 1v1s
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  press alt+p to toggle it on and off, auto respawn, auto level/build, keeps track of the score, press o when you win, press i when your opponent wins, press p to reset points and change build
// @author       DDragon
// @match        https://*diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478510/Sandbox%201v1s.user.js
// @updateURL https://update.greasyfork.org/scripts/478510/Sandbox%201v1s.meta.js
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
    ];

    var respawn = false;

    var p1_score = 0;
    var p2_score = 0;

    var i_code = 73;
    var o_code = 79;
    var p_code = 80;
    var k_code = 75;
    function press_key(k, t, w) {
        setTimeout(function() {
            input.key_down(k);
        }, t);
        setTimeout(function() {
            input.key_up(k);
        }, t + w);
    }

    function set_build(b, t) {
        setTimeout(function() {
            input.set_convar('game_stats_build', b);
        }, t);
    }

    document.body.onkeydown = function(e) {
        console.log(e.keyCode);
        if (e.keyCode === o_code) {
            if (respawn) {
            p1_score++
            press_key(k_code, 1000, 4000);
            set_build(build, 1000);}
        }
        if (e.keyCode === i_code) {
            if (respawn) {
            p2_score++
            press_key(o_code, 0, 100);
            press_key(k_code, 1100, 4100);
            set_build(build, 1100);}
        }
        if (e.keyCode === p_code) {
            if (e.altKey) {respawn = !respawn}
            else { if (respawn) {
            p1_score = 0;
            p2_score = 0;
            let user_choice = prompt('Choose the build, These are the options: glass, factory, overlord, ssp, ram, smasher, 2bs, 3bs, 4bs')
            if (user_choice == '' || user_choice == null || user_choice == ' ') return;
            let match = upgrades.find((item) => {
                return item.name.includes(workOutUserInput(user_choice))
            });
            input.set_convar('game_stats_build', match.build);
            build = match.build;
            press_key(o_code, 0, 100);
            press_key(k_code, 1100, 4100);
            set_build(build, 1100);}}
        }
    }

    //input.setGameMode('sandbox')
    setInterval(() => {
        if (respawn) {
        input.try_spawn (p1_score+' - '+p2_score)}
    });
})();