// ==UserScript==
// @name        Auto Clicker WaifuGame
// @namespace   Violentmonkey Scripts
// @match       https://waifugame.com/swiper
// @description Auto clicks all the cards so you don't have to
// @grant       none
// @version     1.5
// @license     MIT
// @icon        https://www.google.com/s2/favicons?sz=64&domain=waifugame.com
// @author      Nelen (discord: nelen)
// @description 4/19/2024, 9:33:42 PM
// @downloadURL https://update.greasyfork.org/scripts/492967/Auto%20Clicker%20WaifuGame.user.js
// @updateURL https://update.greasyfork.org/scripts/492967/Auto%20Clicker%20WaifuGame.meta.js
// ==/UserScript==

const debugMode = false;
const rarityMapping = {
    'glow-0': 'Normal',
    'glow-1': 'Uncommon',
    'glow-2': 'Rare',
    'glow-3': 'Epic',
    'glow-4': 'Legendary',
    'glow-5': 'Mythic'
}

const placement = document.querySelector('.tinder--buttons')

const div = document.createElement('div');
div.classList.add('cooldown-container');
placement.appendChild(div);

const button = document.createElement('button');
button.id = 'auto-clicker';
div.appendChild(button);

const i = document.createElement('i');
i.classList.add('fa')
i.classList.add('fa-wand-magic')
i.style.color = 'rgb(182, 183, 184)';
button.appendChild(i)

let timer = null;

button.addEventListener('click', () => {
    timer = setInterval(getAllCards, 1000);
    localStorage.setItem('auto-clicker-timer', timer);
});

function getAllCards() {
    let loveBtn = document.querySelector('button#love')
    let charmingBtn = document.querySelector('a.btnCharm');
    let crushBtn = document.querySelector('button#nope')

    const card = document.querySelectorAll('.tinder--card:not(.removed)');
    if (card.length > 0) {
        console.log(`${getCardRarity()} card found...`)
        if (!loveBtn.disabled) {
            if (getCardRarity() == 'Mythic') {
              if (!debugMode) { loveBtn.click(); }
              console.log('Flirted.')
            }
            else if (getCardRarity() == 'Wishlist') {
               if (!debugMode) { charmingBtn.click(); }
              console.log('Charmed.')
            }
            else {
              if (!debugMode) { crushBtn.click(); }
              console.log('Crushed.')
            }
        }
      if (debugMode) { card[0].remove() }
    } else {
        console.log('no more cards found');
        clearInterval(localStorage.getItem('auto-clicker-timer'));
    }
}

function getCardRarity() {
    const card = document.querySelectorAll('.tinder--card:not(.removed)');
    let classes = card[0].className.split(' ')[1];
    let rarity = rarityMapping[classes];
    return rarity || 'Wishlist';
}