// ==UserScript==
// @name         Pokeclicker : Press tab to apply vitamins
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add vitamins to pokemon, for the game pokeclicker
// @author       DarthNato
// @match        https://www.pokeclicker.com/*
// @grant        none
// @license                  MIT
// @downloadURL https://update.greasyfork.org/scripts/483926/Pokeclicker%20%3A%20Press%20tab%20to%20apply%20vitamins.user.js
// @updateURL https://update.greasyfork.org/scripts/483926/Pokeclicker%20%3A%20Press%20tab%20to%20apply%20vitamins.meta.js
// ==/UserScript==


    document.addEventListener('keyup',function(evt){
    if(evt.keyCode==9){ // just click tab and you'll add vitamins to the pokemon of the chosen id (you can also change the keycode so that it's another button to press)
    //App.game.party.getPokemon(1).useVitamin(0,19);
    // Change the pokemon #
    // Change the Vitamin to use (0 = Protein, 1 = Calcium, 0 = Carbos)
    // Change the Number of Vitamins to use
    // NOTE: DOES NOT LIMIT THE AMOUNT OF VITAMINS


        // Give Bulbasaur 19 Proteins
        App.game.party.getPokemon(1).useVitamin(0,19);

        // Give Bulbasaur 21 Carbos
        App.game.party.getPokemon(1).useVitamin(2,21);
        }});