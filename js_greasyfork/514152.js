// ==UserScript==
//
// @name                Cheat for What Beats Rock Royale
// @namespace           GameRoMan
//
// @match               https://1267650567392591964.discordsays.com/.proxy/wildwest/g//g/74d88b31-d5d7-46ac-a002-be692defad93?discord=true*
// @match               https://g.wildwest.gg/g/74d88b31-d5d7-46ac-a002-be692defad93*
// @match               https://www.whatbeatsrock.com/*
//
// @grant               GM.getValue
// @grant               GM.setValue
//
// @version             1.2
// @author              GameRoMan
// @description         What Beats Rock Royale Cheat
//
//
//
// @downloadURL https://update.greasyfork.org/scripts/514152/Cheat%20for%20What%20Beats%20Rock%20Royale.user.js
// @updateURL https://update.greasyfork.org/scripts/514152/Cheat%20for%20What%20Beats%20Rock%20Royale.meta.js
// ==/UserScript==


(function() {

    function sortObjectByKey(obj) {
        const keys = Object.keys(obj);
        keys.sort();

        return keys.reduce(
            (acc, key) => {
                acc[key] = obj[key];
                return acc;
            }, {}
        );
    }

    function combineDicts(dict1, dict2) {
        const combinedDict = {};

        for (const key in dict1) combinedDict[key] = dict1[key];

        for (const key in dict2) {
            if (combinedDict[key]) {
                combinedDict[key] = [...new Set(combinedDict[key].concat(dict2[key]))];
            } else {
                combinedDict[key] = dict2[key];
            }
        }

        return combinedDict;
    }

    function randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function toDict(array) {
        const dict = {};

        for (let i = 0; i < array.length - 1; i++) {
            const key = array[i + 1].toLowerCase();
            const value = array[i].toLowerCase();

            if (!dict.hasOwnProperty(key)) dict[key] = [];

            dict[key].push(value);
        }

        return dict;
    }


    // ====================================================================================================================


    async function saveToCloud(newContent) { // Save data to GitLab
        console.error('Cloud saving functionality is diabled for public use');
        return;
        
        const filePath = 'database%2Fsave.json'; // Replace with your file location 

        const headers = {
            // 'Authorization': 'Bearer YOUR_API_TOKEN'
            'Content-Type': 'application/json',
        };

        const data = {
            content: newContent,
            branch: 'main',
            commit_message: 'Update file content'
        };

        fetch(
            `https://example.com`, // Your api, for example `https://gitlab.com/api/v4/projects/PROJECT ID/repository/files/${filePath}`
            {
                method: 'PUT',
                headers,
                body: JSON.stringify(data)
            }
        )
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Cloud data saved successfully');
            })
            .catch(error => {
                console.error('Error updating file:', error);
            });
    }

    function reset() {
        const resetButton = document.getElementById('hard-reset-button');
        resetButton.disabled = false;
        resetButton.click();
        document.querySelectorAll('button.modal-button')[0].click();
        document.getElementById('start-game').click();
    }

    async function addData(newData) { // Add new data to script storage
        const save = await GM.getValue("save", '{}');
        const savedDict = JSON.parse(save);

        const combinedDict = combineDicts(savedDict, newData);
        const sortedDict = sortObjectByKey(combinedDict);

        GM.setValue("save", JSON.stringify(sortedDict));
        console.log('Local data saved successfully');
    }

    async function loadCloudSave() { // Load data from GitLab
        const response = await fetch(
            'https://glcdn.githack.com/gameroman/what-beats-rock/-/raw/main/database/save.json?min=1', // Replace with your Cloud Storage if you want 
            {cache: 'no-store'}
        );
        const savedata = await response.json();

        console.log('Data loaded from Cloud successfully');

        addData(savedata);
    }

    async function get_message(last) {
        const save = await GM.getValue("save", '{}');
        const savedDict = JSON.parse(save);

        if (savedDict[last]) return randomChoice(savedDict[last]);
        if (last.includes('lgbt')) return 'love and support';

        return `DESTROYER OF EVERYTHING INCLUDING [${last}]`;
    }

    function get_last() {
        const guessList = [...document.getElementById('guess-list').children];
        if (!guessList.length) return 'rock';

        const texts = guessList.map(child => child.textContent);
        const guesses = [...texts].filter(child => child.includes('🤜'));
        const last = guesses[0].split(' 🤜')[0];

        return last.toLowerCase();
    }

    async function cheat() {
        const last = get_last();
        const message = await get_message(last);

        document.getElementById('guess-input').value = message;
        document.getElementById('submit-guess').click();

        return message;
    }

    function setupCheat() { // Add cheat button for What Beats Rock Royale
        document.getElementById('guess-input').maxlength = "500";

        const cheatButton = document.createElement('button');
        cheatButton.textContent = 'CHEAT';
        cheatButton.style.cssText = `
            border: 2px solid black;
            color: black;
            margin: 5px;
            padding: 5px;
            border-radius: 4px;
            cursor: pointer;
            background-color:
            transparent; font-size: 25px
        `;
        cheatButton.addEventListener('click', cheat);
        document.getElementById('guess-form').appendChild(cheatButton);
    }

    function getThisGame() { // Get this game data from whatbeatsrock.com
        const guessesElement = [...document.querySelectorAll('p')].filter(p => p.textContent.includes('🤜 rock'))[0];
        if (!guessesElement) return {};

        const guessText = guessesElement.textContent.trim();
        const after = guessText.split(' 😵 ');
        const guesses = after[after.length - 1].split(' 🤜 ');
        const guessesDict = toDict(guesses);

        return guessesDict;
    }

    function localSaveScore() {
        const newData = getThisGame();
        addData(newData);
    }

    async function cloudSaveScore() {
        const localSave = await GM.getValue("save", '{}');
        const localSaveDict = JSON.parse(localSave);
        const newContent = JSON.stringify(localSaveDict, null, 4);

        saveToCloud(newContent);
    }

    function setupSaveButtons() {
        const containerStyle = `
            padding: 5px;
            background-color: white;
            border: 2px solid black;
            border-radius: 10px;
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1000;
            overflow: auto;
            min-width: 10px;
            min-height: 10px;
        `;

        const container = document.createElement('div');
        container.style.cssText = containerStyle;
        document.body.appendChild(container);

        const localSaveButton = document.createElement('button');
        localSaveButton.textContent = 'LOCAL SAVE';
        localSaveButton.style.border = '2px solid black';
        localSaveButton.style.color = 'black';
        localSaveButton.style.margin = '5px';
        localSaveButton.style.padding = '2px';
        localSaveButton.style.borderRadius = '4px';
        localSaveButton.addEventListener('click', localSaveScore);
        container.appendChild(localSaveButton);

        const cloudSaveButton = document.createElement('button');
        cloudSaveButton.textContent = '☁ CLOUD SAVE';
        cloudSaveButton.style.border = '2px solid black';
        cloudSaveButton.style.color = 'black';
        cloudSaveButton.style.margin = '5px';
        cloudSaveButton.style.padding = '2px';
        cloudSaveButton.style.borderRadius = '4px';
        cloudSaveButton.addEventListener('click', cloudSaveScore);
        container.appendChild(cloudSaveButton);

        document.addEventListener('keydown', (event) => {
            if (event.key === '=') {
                localSaveScore();
            }
        });
    }


    // ====================================================================================================================


    loadCloudSave(); // Load save data from Cloud Storage

    if (window.location.href.includes('wildwest')) {
        setupCheat();
    } else {
        setupSaveButtons();
    }

})();




