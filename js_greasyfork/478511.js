// ==UserScript==
// @name         Auto upgrader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically puts the build in, press t to choose a build, f to use the recent build, g for a favourite build (has to be set in the code)
// @author       DDragon
// @match        https://*diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478511/Auto%20upgrader.user.js
// @updateURL https://update.greasyfork.org/scripts/478511/Auto%20upgrader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // factory   : 656565656564444888888856544477777
    // overlord  : 656565656564444888888856544432323
    // 5 bs glass: 656565656564488888777777756445884
    // ssp       : 656565656568888777777756853238328

    function workOutUserInput(userInput){
        let Array = userInput.toLowerCase().split('');
        let filterspaces = Array.filter(letter => letter !== ' ');
        let filterhyphens = filterspaces.filter(letter => letter !== '-');
        let string = filterhyphens.join('');
        return string;
    };

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

    var all_button = 84 // t
    var recent = ''; // factory
    var button_recent = 70; // button to press when upgrading (f)
    var favourite = '656565656564444888888856544432323'; // overlord
    var button_favourite = 71; // button to press when upgrading (g)

    document.body.onkeydown = function(e) {
        //console.log(e.keyCode)
        if (e.keyCode === all_button) {
            //console.log('all button')
            let user_choice = prompt('Choose the build, These are the options: glass, factory, overlord, ssp, ram, smasher, 2bs, 3bs, 4bs')
            if (user_choice == '' || user_choice == null || user_choice == ' ') return;
            let match = upgrades.find((item) => {
                return item.name.includes(workOutUserInput(user_choice))
            });
            input.set_convar('game_stats_build', match.build);
            recent = match.build;
        }
        if (e.keyCode === button_recent) {
            input.set_convar('game_stats_build', recent);
        }
        if (e.keyCode === button_favourite) {
            input.set_convar('game_stats_build', favourite);
        }
    }

})();