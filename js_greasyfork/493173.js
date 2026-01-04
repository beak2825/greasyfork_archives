// ==UserScript==
// @name        simplemmo auto attack, by imtiyaz
// @namespace   Violentmonkey Scripts
// @match       https://web.simple-mmo.com/npcs/attack/*
// @grant       none
// @version     1.3
// @author      BumbiSkyRender
// @description 4/22/2024, 2:17:04 PM
// @downloadURL https://update.greasyfork.org/scripts/493173/simplemmo%20auto%20attack%2C%20by%20imtiyaz.user.js
// @updateURL https://update.greasyfork.org/scripts/493173/simplemmo%20auto%20attack%2C%20by%20imtiyaz.meta.js
// ==/UserScript==

const atkBtn = document.querySelector('[class="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"]');
const enemyHp = document.querySelector('[class="flex justify-center bg-gradient-to-r from-red-500 to-red-400 h-4 rounded-lg w-36 text-xs text-gray-100 nightwind-prevent text-center ring-1 ring-black ring-opacity-5 shadow-sm transition-all"]');
let hp;

function click(button) {
    const rect = button.getBoundingClientRect();

    // Calculate random coordinates within the button's area
    const offsetX = Math.random() * rect.height;
    const offsetY = Math.random() * rect.width;

    // Simulate a click at a random position within the button
    button.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            clientX: rect.left + offsetX,
            clientY: rect.top + offsetY
        })
    );
}

function getRandomInterval(max, min) {
    // Generate a random interval between min and max
    return Math.random() * (max - min) + min;
}


function attack () {



  if (enemyHp.textContent == hp) {
    const genBtn = document.querySelector('[class="text-indigo-700 hover:text-indigo-800"]');
    // clicks gen neew enemy (if in battle arena)
    if (genBtn) {
          click(genBtn);
    } else {  // clicks end battle
        click(document.querySelector('[class="mt-2 inline-flex w-full justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"]'));
    }

    return;
  }
  click(atkBtn);
  hp = enemyHp.textContent;

}

setInterval(attack, getRandomInterval(1500, 2000));
