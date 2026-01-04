// ==UserScript==
// @name        simplemmo auto step 4x, by imtiyaz
// @namespace   Violentmonkey Scripts
// @match       https://web.simple-mmo.com/travel*
// @grant       none
// @version     1.7
// @author      BumbiSkyRender
// @description 4/17/2024, 8:43:38 PM
// @downloadURL https://update.greasyfork.org/scripts/492790/simplemmo%20auto%20step%204x%2C%20by%20imtiyaz.user.js
// @updateURL https://update.greasyfork.org/scripts/492790/simplemmo%20auto%20step%204x%2C%20by%20imtiyaz.meta.js
// ==/UserScript==

let singleButton = true;
let buttons;

function setup() {
    if (singleButton) {
        let allButtons = document.querySelectorAll('button');
        allButtons.forEach((button) => {
            if (button.textContent.includes('Take a step')) {
                buttons = button;
                return;
            }
        });

    } else {
        buttons = document.querySelectorAll('button');
    }
}

function clickMultButtons() {
    buttons.forEach(button => {   // there are actually 4 buttons to step, the other 3 are hidden, meaning 4x more xp and gold every step
        //if (button.textContent.includes("I'm a person! Promise!")) {
        //  throw new "lol";
        //}
        if (button.textContent.includes('Take a step')) {
            click(button);
        }
    });
}

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

function clickSingleButton() {
  if (buttons.disabled) {
  return;
}
    click(buttons);
}

function getRandomInterval(max, min) {
    // Generate a random interval between min and max
    return Math.random() * (max - min) + min;
}

// Checks the buttons every 1-2 seconds
function loop() {
    const atk = document.querySelector('[class="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"]');
    const gather = document.querySelector('[class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"]');
    const verification = document.querySelectorAll('[href="/i-am-not-a-bot?new_page=true"]');
    let ver = false
    verification.forEach(lol => {
      if (lol.textContent == "I'm a person! Promise!") {ver=true}
    })
    if (atk) {click(atk);return;}
    if (gather) {click(gather);return;}

    if (!ver) {singleButton ? clickSingleButton() : clickMultButtons();}
    setTimeout(loop, getRandomInterval(1000, 2000));
};
setup();
setTimeout(loop, 1000);