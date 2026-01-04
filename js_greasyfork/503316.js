// ==UserScript==
// @name         Honey's card fetcher
// @namespace    http://tampermonkey.net/
// @version      2024-10-11
// @description  yandev edition!
// @author       Tots not me!
// @match        https://moescape.ai/tavern/my-characters/*
// @license      MIT
// @grant        GM_registerMenuCommand
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/503316/Honey%27s%20card%20fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/503316/Honey%27s%20card%20fetcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("card fetcher is running");
    GM_registerMenuCommand("Export V1 Card", dlTavernCard);

    let tavernCard = {
        name: "",
        description: "",
        scenario: "",
        first_mes: "",
        mes_example: ""
    };

    function downloadJSON(data, filename) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function GetCharacterData(){
        let nickname = document.getElementById('name');
        if (nickname) {
            tavernCard.name = nickname.value;
        }
        let desc = document.getElementById('char_persona');
        if (desc) {
            tavernCard.description = desc.value;
        }

        let world_scenario = document.getElementById('world_scenario');
        if (world_scenario) {
            tavernCard.scenario = world_scenario.value;
        }
        let char_greeting = document.getElementById('char_greeting');
        if (char_greeting) {
            tavernCard.first_mes = char_greeting.value;
        }
        let example_dialogue = document.getElementById('example_dialogue');
        if (example_dialogue) {
            tavernCard.mes_example = example_dialogue.value;
        }
        return tavernCard;
    }
    function dlTavernCard() {
        let tavernCard = GetCharacterData();
        let filename = tavernCard.name ? `${tavernCard.name}.json` : 'taverncard.json';
        downloadJSON(tavernCard, filename);
    }
})();