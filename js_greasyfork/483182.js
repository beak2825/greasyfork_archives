// ==UserScript==
// @name         Pokeclicker get all Unown by pressing space
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Press space to get all Unown
// @author       AyZz
// @match        https://www.pokeclicker.com/
// @grant        none
// @license                  MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokeclicker.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483182/Pokeclicker%20get%20all%20Unown%20by%20pressing%20space.user.js
// @updateURL https://update.greasyfork.org/scripts/483182/Pokeclicker%20get%20all%20Unown%20by%20pressing%20space.meta.js
// ==/UserScript==


    document.addEventListener('keyup',function(evt){
    if(evt.keyCode==32){
    App.game.party.gainPokemonById(201,false) //change false to true if you want them in their shiny forms
    App.game.party.gainPokemonById(201.01,false)
    App.game.party.gainPokemonById(201.02,false)
    App.game.party.gainPokemonById(201.03,false)
    App.game.party.gainPokemonById(201.04,false)
    App.game.party.gainPokemonById(201.05,false)
    App.game.party.gainPokemonById(201.06,false)
    App.game.party.gainPokemonById(201.07,false)
    App.game.party.gainPokemonById(201.08,false)
    App.game.party.gainPokemonById(201.09,false)
    App.game.party.gainPokemonById(201.1,false)
    App.game.party.gainPokemonById(201.11,false)
    App.game.party.gainPokemonById(201.12,false)
    App.game.party.gainPokemonById(201.13,false)
    App.game.party.gainPokemonById(201.14,false)
    App.game.party.gainPokemonById(201.15,false)
    App.game.party.gainPokemonById(201.16,false)
    App.game.party.gainPokemonById(201.17,false)
    App.game.party.gainPokemonById(201.18,false)
    App.game.party.gainPokemonById(201.19,false)
    App.game.party.gainPokemonById(201.2,false)
    App.game.party.gainPokemonById(201.21,false)
    App.game.party.gainPokemonById(201.22,false)
    App.game.party.gainPokemonById(201.23,false)
    App.game.party.gainPokemonById(201.24,false)
    App.game.party.gainPokemonById(201.25,false)
    App.game.party.gainPokemonById(201.26,false)
    App.game.party.gainPokemonById(201.27,false)
    App.game.party.gainPokemonById(201.28,false)

    App.game.party.removePokemonByName("MissingNo.");
    }});