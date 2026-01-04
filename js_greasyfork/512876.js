// ==UserScript==
//
// @license         MIT
// @name            Emoji Arena hack
// @namespace       Violentmonkey Scripts
// @match           https://g.wildwest.gg/g/d893cd5b-68e2-46a4-a23d-9efb65a198dd*
// @grant           none
// @version         2.1
// @author          Anonymous
// @description     Cheat for Emoji Arena
//
//
// @downloadURL https://update.greasyfork.org/scripts/512876/Emoji%20Arena%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/512876/Emoji%20Arena%20hack.meta.js
// ==/UserScript==


(function() {
    function getSaveData() {
        return JSON.parse(window.localStorage.emojiArenaGameData);
    }

    function startCheatBattle() {
        const gameState = getSaveData().gameState;
        const character = gameState.characters[gameState.selectedCharacter];

        const battleData = {
            type: 'battle',
            playerEmoji: character.emoji,
            playerHP: 100,
            playerAP: 100,
            playerSkills: character.selectedSkills,
            playerItems: {
                ...character.items
            },
            enemyEmoji: '🤡',
            enemyHP: 1,
            enemySkills: [],
            distance: 3,
            difficulty: 'medium',
        };

        window.localStorage.emojiArenaSwap = JSON.stringify(battleData);
        window.location.href = 'https://g.wildwest.gg/g/beccb87f-c9ae-4cd6-bdc2-156e56a82da9';
    }

    function addCheatButtleButton() {
        const save_data = JSON.parse(window.localStorage.emojiArenaGameData);
        save_data.gameState.currentPage = 'battle-page';
        window.localStorage.emojiArenaGameData = JSON.stringify(save_data);

        const difficultyButtons = document.getElementById('difficulty-buttons');

        const cheatButtleButton = document.createElement('button');
        cheatButtleButton.textContent  = 'Cheat battle';

        difficultyButtons.appendChild(cheatButtleButton);

        cheatButtleButton.addEventListener('click', startCheatBattle);
    }

    function addMoney() {
        const save_data = getSaveData();
        const gameState = save_data.gameState;

        gameState.characters[gameState.selectedCharacter].gold += 100;
        gameState.currentPage = 'shop-page';

        window.localStorage.emojiArenaGameData = JSON.stringify(save_data);

        window.location.href = 'https://g.wildwest.gg/g/d893cd5b-68e2-46a4-a23d-9efb65a198dd';
    }

    const currentPage = getSaveData().gameState.currentPage;

    startGame();
    if (currentPage) {
        showPage(currentPage);
        if (currentPage === 'battle-page') addCheatButtleButton();
    }

    const shopPage = document.getElementById('shop-page');

    const addMoneyButton = document.createElement('button');
    addMoneyButton.className += 'shop-item-button';
    addMoneyButton.textContent  = 'Add 100 gold';

    shopPage.appendChild(addMoneyButton);

    addMoneyButton.addEventListener('click', addMoney);
    document.getElementById('battle-btn').addEventListener('click', addCheatButtleButton);
})();
