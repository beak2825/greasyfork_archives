// ==UserScript== 
// @name FEH QHB Auto 
// @version 0.5
// @namespace fehqhbauto
// @description FEH auto-battle, but for a browser minigame 
// @match https://events.fire-emblem-heroes.com/color/play 
// @grant none 
// @downloadURL https://update.greasyfork.org/scripts/32861/FEH%20QHB%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/32861/FEH%20QHB%20Auto.meta.js
// ==/UserScript==   


function sendTouchEvent(x, y, element, eventType) { // generate fake touch events
    const touch = new Touch({
        identifier: Date.now(),
        target: element,
        clientX: x,
        clientY: y,
    });
    const touchEvent = new TouchEvent(eventType, {
        touches: [touch],
        targetTouches: [],
        changedTouches: [touch],
    });
    element.dispatchEvent(touchEvent);
}

const $ = document.querySelector.bind(document); // keep `this` as `document`

const checkForModal = function() {
    if ($(`.modal-container-result`) && $(`.modal-container-result`)
        .parentNode.parentNode.style.display === ``) { // popup is shown, has display=`none` if hidden
        if (!($(`.btn-result-retry`))) {
            console.log(`Pressing "Tweet" button...`);
            sendTouchEvent(5, 5, $(`.btn-result-tweet`), `touchend`); // click tweet button
        } else {
            console.log(`Pressing "Try again" button...`);
            sendTouchEvent(5, 5, $(`.btn-result-retry`), `touchend`); // click retry
        }
    }
};

const processNewEnemy = function(color, flying) {
    let hero;
    if (flying || color === `white`) { // Lyn provides 2 combo points against all fliers, no matter the color
        hero = `Lyn`;
    } else if (color === `green`) {
        hero = `Roy`;
    } else if (color === `red`) {
        hero = `Lucina`;
    } else {
        hero = `Ike`;
    }
    const coordinateMap = new Map([ // touch coordinates for each Hero
        [`Lyn`, [546, 701]],
        [`Roy`, [160, 701]],
        [`Lucina`, [251, 701]],
        [`Ike`, [368, 701]],
    ]);
    console.log(`Selected ${hero} against${flying ? ` flying` : ``} ${color} enemy.`);
  setTimeout(function() {
    sendTouchEvent(...coordinateMap.get(hero), $(`canvas`), `touchstart`);
  }, 500);
};

const oldLog = console.log;
console.log = function(...args) {
  if (typeof args[0] === `number` && args[1].color) {
    processNewEnemy(args[1].color, args[1].flying);
  }
  oldLog(...args);
};

setInterval(checkForModal, 1000);