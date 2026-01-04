// ==UserScript==
// @name         Deluge RPG Pokémon Catcher
// @license      MIT
// @namespace    http://your-namespace.com
// @version      1.0
// @description  Automatically catches Pokémon from the list if they appear on the Deluge RPG website.
// @match        https://www.delugerpg.com/map/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468844/Deluge%20RPG%20Pok%C3%A9mon%20Catcher.user.js
// @updateURL https://update.greasyfork.org/scripts/468844/Deluge%20RPG%20Pok%C3%A9mon%20Catcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Pokémon list to match against
    var pokemonList = ["Pikachu", "Charizard", "Gyarados"]; // Add or remove Pokémon names here

    // Function to check if a Pokémon is on the list
    function isPokemonOnList(pokemonName) {
        return pokemonList.includes(pokemonName);
    }

    // Function to catch the Pokémon
    function catchPokemon() {
        var elements = document.querySelectorAll("#catch");
        elements.forEach(function(element) {
            var pokemonName = element.textContent.trim();
            if (isPokemonOnList(pokemonName)) {
                console.log("Catching Pokémon: " + pokemonName);
                element.click();
            }
        });
    }

    // Function to simulate a key press
    function simulateKeyPress(key) {
        var eventObj = document.createEventObject ? document.createEventObject() : document.createEvent("Events");
        if (eventObj.initEvent) {
            eventObj.initEvent("keydown", true, true);
        }
        eventObj.keyCode = key;
        eventObj.which = key;
        document.dispatchEvent ? document.dispatchEvent(eventObj) : document.fireEvent("onkeydown", eventObj);
    }

    // Function to start pressing a random key ('w', 'a', 's', 'd') every 2 seconds
    function startKeyPress() {
        setInterval(function() {
            var randomKey = Math.floor(Math.random() * 4); // Generate a random number from 0 to 3
            var keys = [87, 65, 83, 68]; // Key codes for 'w', 'a', 's', 'd' respectively
            simulateKeyPress(keys[randomKey]);
        }, 2000);
    }

    // Call the startKeyPress function to begin key presses
    startKeyPress();

    // Event listener for keydown events
    document.addEventListener('keydown', function(event) {
        var key = event.key.toLowerCase();
        if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
            catchPokemon();
        }
    });

    // Refresh the Pokémon list when 'w', 'a', 's', or 'd' keys are pressed
    document.addEventListener('keydown', function(event) {
        var key = event.key.toLowerCase();
        if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
            console.log("Refreshing Pokémon list...");
            location.reload();
        }
    });

})();
