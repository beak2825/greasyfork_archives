// ==UserScript==
// @name         Pokeclicker : Press tab for pokemon
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Add Pokemon by Id for the game pokeclicker
// @author       Loliprane
// @match        https://www.pokeclicker.com/*
// @grant        none
// @license                  MIT
// @downloadURL https://update.greasyfork.org/scripts/456699/Pokeclicker%20%3A%20Press%20tab%20for%20pokemon.user.js
// @updateURL https://update.greasyfork.org/scripts/456699/Pokeclicker%20%3A%20Press%20tab%20for%20pokemon.meta.js
// ==/UserScript==


    document.addEventListener('keyup',function(evt){
    if(evt.keyCode==9){ // just click on tab and you'll get the pokemon of the chosen id (you can also change the keycode so that it's another button to press)
    App.game.party.gainPokemonById(869.67,false); //false will get you a non shiny, true will get you one. You can add as many of those line as you want.
    App.game.party.gainPokemonById(869.67,false); //etc, you just have to change the ID to get different pokemon
    
    
    App.game.party.removePokemonByName("MissingNo."); // remove the MissingNo if by mistake you add it to your party : getting the name of a pokemon is quite tedious but it's possible so if you want to know just post a feedback
        }});