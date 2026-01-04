// ==UserScript==
// @name         Grundo's Quick Ref Extra Filters
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Provides the functionality to hide various info on the pets quick ref page
// @author       Gem
// @match        https://grundos.cafe/quickref/
// @match        https://www.grundos.cafe/quickref/
// @icon         https://www.grundos.cafe/static/images/favicon.66a6c5f11278.ico
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/475762/Grundo%27s%20Quick%20Ref%20Extra%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/475762/Grundo%27s%20Quick%20Ref%20Extra%20Filters.meta.js
// ==/UserScript==
/* globals $ */

(function() {
    'use strict';

    let preferences = document.getElementsByClassName('links-flex');

    let newPreferences = document.createElement('div');
    newPreferences.className = 'newPreferences';
    preferences[0].append(newPreferences);

    var speciesCheck = document.createElement('input');
    speciesCheck.type = 'checkbox';
    speciesCheck.id = 'speciesCheckmark';
    speciesCheck.className = 'preferencesCheckbox';
    var speciesText = document.createTextNode('Hide Species Info')

    var statsCheck = document.createElement('input');
    statsCheck.type = 'checkbox';
    statsCheck.id = 'statsCheckmark';
    statsCheck.className = 'preferencesCheckbox';
    var statsText = document.createTextNode('| Hide Stats')

    var petpetCheck = document.createElement('input');
    petpetCheck.type = 'checkbox';
    petpetCheck.id = 'petpetCheckmark';
    petpetCheck.className = 'preferencesCheckbox';
    var petpetText = document.createTextNode('| Hide Petpets')

    newPreferences.appendChild(speciesText);
    newPreferences.appendChild(speciesCheck);
    newPreferences.appendChild(statsText);
    newPreferences.appendChild(statsCheck);
    newPreferences.appendChild(petpetText);
    newPreferences.appendChild(petpetCheck);

    var pets = document.getElementsByClassName('quickref_pet');
    var petSpecies = [];
    var petStats = [];
    var petPetpets = [];

    for (let i = 0; i < pets.length; i++) {
        let petElements = pets[i].children;
        petSpecies.push(petElements[1]);
        petStats.push(petElements[2]);
        petPetpets.push(petElements[3]);
    }

    let storageSpecies = localStorage.getItem('speciesCheck');
    let storageStats = localStorage.getItem('statsCheck');
    let storagePetpets = localStorage.getItem('petpetCheck');

    if (storageSpecies === 'checked') {
        speciesCheck.checked = true;
        petSpecies.forEach((element) => {
            element.classList.add('hide');
        });
    };

    if (storageStats === 'checked') {
        statsCheck.checked = true;
        petStats.forEach((element) => {
            element.classList.add('hide');
        });
    };

    if (storagePetpets === 'checked') {
        petpetCheck.checked = true;
        petPetpets.forEach((element) => {
            element.classList.add('hide');
        });
    };

    speciesCheck.addEventListener('change', () => {
        if (speciesCheck.checked == true) {
            console.log('checked');
            localStorage.setItem('speciesCheck', 'checked');
            petSpecies.forEach((element) => {
                element.classList.add('hide');
            });
        } else {
            console.log('unchecked');
            localStorage.setItem('speciesCheck', 'unchecked');
            petSpecies.forEach((element) => {
                element.classList.remove('hide');
            });
            console.log(localStorage.getItem('speciesCheck'));
        };
    });

    statsCheck.addEventListener('change', () => {
        if (statsCheck.checked == true) {
            localStorage.setItem('statsCheck', 'checked');
            petStats.forEach((element) => {
                element.classList.add('hide');
            });
        } else {
            localStorage.setItem('statsCheck', 'unchecked');
            petStats.forEach((element) => {
                element.classList.remove('hide');
            });
        };
    });

    petpetCheck.addEventListener('change', () => {
        if (petpetCheck.checked == true) {
            localStorage.setItem('petpetCheck', 'checked');
            petPetpets.forEach((element) => {
                element.classList.add('hide');
            });
        } else {
            localStorage.setItem('petpetCheck', 'unchecked');
            petPetpets.forEach((element) => {
                element.classList.remove('hide');
            });
        };
    });

    const customCSS = `
      .newPreferences {
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
        text-decoration: none;
        font-weight: bold;
        margin: 10px 0;
      }

      .newPreferences input {
        margin: 0 10px;
      }

      .hide {
        display: none;
      }`;

    $("<style>").prop("type", "text/css").html(customCSS).appendTo("head");
})();