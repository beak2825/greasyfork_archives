// ==UserScript==
// @name Evolution
// @namespace EvolutionBabe
// @match https://www.howrse.pl/operation/merge/
// @grant none
// @author Sara Sychowska
// @license MIT
// @version 1.6
// @description Skrypt umilający nam obecną promkę <3
// @downloadURL https://update.greasyfork.org/scripts/460527/Evolution.user.js
// @updateURL https://update.greasyfork.org/scripts/460527/Evolution.meta.js
// ==/UserScript==
const sleepy = ms => new Promise(r => setTimeout(r, ms));

async function dragAndDrop(
  sourceSelector,
  targetSelector,
  sourceQuery,
  targetQuery
) {
  let sourceElement;
  let targetElement;

  if (sourceSelector != "" && targetSelector != "") {
    sourceElement = document.querySelector(sourceSelector);
    targetElement = document.querySelector(targetSelector);
  }

  if (sourceQuery != "" && targetQuery != "") {
    sourceElement = sourceQuery;
    targetElement = targetQuery;
  }

  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();

  const sourceX = sourceRect.left + sourceRect.width / 2;
  const sourceY = sourceRect.top + sourceRect.height / 2;

  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;

  await new Promise((resolve) => {
    sourceElement.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: sourceX,
        clientY: sourceY,
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );

    setTimeout(() => {
      document.dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: targetX,
          clientY: targetY,
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );

      sourceElement.dispatchEvent(
        new MouseEvent("mouseup", {
          clientX: targetX,
          clientY: targetY,
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );

      resolve();
    }, 1000);
  });
}

let z_down;
let alt_down;

var keys = {};

document.onkeydown = async function (e) {
  if (e.which == 90) { z_down = true; }
  if (e.which == 18) { alt_down = true; }
  
   keys[e.key] = true;
  
  if (z_down && !alt_down) {
    let selectDog;

    switch (e.which) {
      case 49: // 1 - poziom 1
      case 97:
        selectDog = 'a';
        break;
      case 50: // 2 - poziom 2
      case 98:
        selectDog = 'b';
        break;
      case 51: // 3 - poziom 3
      case 99:
        selectDog = 'c';
        break;
      case 52: // 4 - poziom 4
      case 100:
        selectDog = 'd';
        break;
      case 53: // 5 - poziom 5
      case 101:
        selectDog = 'e';
        break;
      case 54: // 6 - poziom 6
      case 102:
        selectDog = 'f';
        break;
      case 55: // 7 - poziom 7
      case 103:
        selectDog = 'g';
        break;
      case 56: // 8 - poziom 8
      case 104:
        selectDog = 'h';
        break;
      default:
        return; // exit this handler for other keys
    }
    
    selectDog = `#grille .ui-draggable[data-item='merge-item-${selectDog}']`;
    count = document.querySelectorAll(selectDog).length / 2;
    
    if (document.querySelectorAll(selectDog).length % 2 == 0 || document.querySelectorAll(selectDog).length > 2)
    {
      for (let i = 0; i < count; i++)
      {
        await dragAndDrop("", "", document.querySelectorAll(selectDog)[0], document.querySelectorAll(selectDog)[1]);
        await sleepy(1500)
      }

    }
    e.preventDefault();
  }
  else if (alt_down && !z_down)
  {
    let dog1;
    let dog2;
    
    switch (true)
    {
        
      case keys['1']:
        dog1 = 'a';
        switch (true)
        {
          case keys['2']:
            dog2 = 'b';
            break;
          case keys['3']:
            dog2 = 'c';
            break;
          case keys['4']:
            dog2 = 'd';
            break;
          case keys['5']:
            dog2 = 'e';
            break;
          case keys['6']:
            dog2 = 'f';
            break;
          case keys['7']:
            dog2 = 'g';
            break;
          case keys['8']:
            dog2 = 'h';
            break;
        }
        break;
        
      case keys['2']:
        dog1 = 'b';
        switch (true)
        {
          case keys['1']:
            dog2 = 'a';
            break;
          case keys['3']:
            dog2 = 'c';
            break;
          case keys['4']:
            dog2 = 'd';
            break;
          case keys['5']:
            dog2 = 'e';
            break;
          case keys['6']:
            dog2 = 'f';
            break;
          case keys['7']:
            dog2 = 'g';
            break;
          case keys['8']:
            dog2 = 'h';
            break;
        }
        break;
        
      case keys['3']:
        dog1 = 'c';
        switch (true)
        {
          case keys['1']:
            dog2 = 'a';
            break;
          case keys['2']:
            dog2 = 'b';
            break;
          case keys['4']:
            dog2 = 'd';
            break;
          case keys['5']:
            dog2 = 'e';
            break;
          case keys['6']:
            dog2 = 'f';
            break;
          case keys['7']:
            dog2 = 'g';
            break;
          case keys['8']:
            dog2 = 'h';
            break;
        }
        break;
        
        case keys['4']:
        dog1 = 'd';
        switch (true)
        {
          case keys['1']:
            dog2 = 'a';
            break;
          case keys['2']:
            dog2 = 'b';
            break;
          case keys['3']:
            dog2 = 'c';
            break;
          case keys['5']:
            dog2 = 'e';
            break;
          case keys['6']:
            dog2 = 'f';
            break;
          case keys['7']:
            dog2 = 'g';
            break;
          case keys['8']:
            dog2 = 'h';
            break;
        }
        break;

        case keys['5']:
        dog1 = 'e';
        switch (true)
        {
          case keys['1']:
            dog2 = 'a';
            break;
          case keys['2']:
            dog2 = 'b';
            break;
          case keys['3']:
            dog2 = 'c';
            break;
          case keys['4']:
            dog2 = 'd';
            break;
          case keys['6']:
            dog2 = 'f';
            break;
          case keys['7']:
            dog2 = 'g';
            break;
          case keys['8']:
            dog2 = 'h';
            break;
        }
        break;

        case keys['6']:
        dog1 = 'f';
        switch (true)
        {
          case keys['1']:
            dog2 = 'a';
            break;
          case keys['2']:
            dog2 = 'b';
            break;
          case keys['3']:
            dog2 = 'c';
            break;
          case keys['4']:
            dog2 = 'd';
            break;
          case keys['5']:
            dog2 = 'e';
            break;
          case keys['7']:
            dog2 = 'g';
            break;
          case keys['8']:
            dog2 = 'h';
            break;
        }
        break;

        case keys['7']:
        dog1 = 'g';
        switch (true)
        {
          case keys['1']:
            dog2 = 'a';
            break;
          case keys['2']:
            dog2 = 'b';
            break;
          case keys['3']:
            dog2 = 'c';
            break;
          case keys['4']:
            dog2 = 'd';
            break;
          case keys['5']:
            dog2 = 'e';
            break;
          case keys['6']:
            dog2 = 'f';
            break;
          case keys['8']:
            dog2 = 'h';
            break;
        }
        break;

        case keys['8']:
        dog1 = 'h';
        switch (true)
        {
          case keys['1']:
            dog2 = 'a';
            break;
          case keys['2']:
            dog2 = 'b';
            break;
          case keys['3']:
            dog2 = 'c';
            break;
          case keys['4']:
            dog2 = 'd';
            break;
          case keys['5']:
            dog2 = 'e';
            break;
          case keys['6']:
            dog2 = 'f';
            break;
          case keys['7']:
            dog2 = 'g';
            break;
        }
        break;
    }

    await dragAndDrop("", "", document.querySelectorAll(`#grille .ui-draggable[data-item='merge-item-${dog1}']`)[0], document.querySelectorAll(`#grille .ui-draggable[data-item='merge-item-${dog2}']`)[0]);
    e.preventDefault();
  }
  else if (e.which === 81)
  {
    let psy = ['a', 'b', 'c', 'd'];
    let count;
    for (let i = 0; i < 4; i++)
    {
      count = document.querySelectorAll(`#grille .ui-draggable[data-item='merge-item-${psy[i]}'`);
      if (count.length > 1)
      {
        for (let j = 0; j < count.length; j++)
        {
          await dragAndDrop("", "", document.querySelectorAll(`#grille .ui-draggable[data-item='merge-item-${psy[i]}']`)[0], document.querySelectorAll(`#grille .ui-draggable[data-item='merge-item-${psy[i]}']`)[1]);
          await sleepy(2000);
          count = document.querySelectorAll(`#grille .ui-draggable[data-item='merge-item-${psy[i]}'`);
        }
      }
    }
    e.preventDefault();
  }
  else if (e.which === 87)
  {
    let test = ['a', 'b', 'c'];
    let amount;
    for (let i = 0; i < 3; i++)
    {
      let k = i +1;
      amount = document.querySelectorAll("ul#inventory > li:nth-child(" + k + ") ol:nth-child(1) li.gaugeslot__cell--on").length;
      if (amount.length != 0)
      {
        for (let j = 0; j <= amount+1; j++)
        {
          await dragAndDrop("#inventory figure[data-item='merge-item-" + test[i] + "']", ".js-mergeslot--empty", "", "");
          console.log(amount)
          await sleepy(2000);
          amount = document.querySelectorAll("ul#inventory > li:nth-child(" + k + ") ol:nth-child(1) li.gaugeslot__cell--on").length;
          let psy = ['a', 'b', 'c', 'd'];
          let count;
          for (let i = 0; i < 4; i++)
          {
            count = document.querySelectorAll(`#grille .ui-draggable[data-item='merge-item-${psy[i]}'`);
            if (count.length > 1)
            {
              for (let j = 0; j < count.length; j++)
              {
                await dragAndDrop("", "", document.querySelectorAll(`#grille .ui-draggable[data-item='merge-item-${psy[i]}']`)[0], document.querySelectorAll(`#grille .ui-draggable[data-item='merge-item-${psy[i]}']`)[1]);
                await sleepy(2000);
                count = document.querySelectorAll(`#grille .ui-draggable[data-item='merge-item-${psy[i]}'`);
              }
            }
          }
        }
      }
    }
    e.preventDefault();
  }
  else {
    let selectedDog;
    let numberEnergy;
    let amount;

    switch (e.which) {
      case 49:
      case 97:
        numberEnergy = 1;
        selectedDog = "a";
        break;
      case 50:
      case 98:
        numberEnergy = 2;
        selectedDog = "b";
        break;
      case 51:
      case 99:
        numberEnergy = 3;
        selectedDog = "c";
        break;
      case 13:
        document.querySelector(".btn--success").click();
        break;
      case 8:
        document.querySelector(".js-button-cancel-merge").click();
        break;
    }
    amount = document.querySelectorAll("ul#inventory > li:nth-child(" + numberEnergy + ") ol:nth-child(1) li.gaugeslot__cell--on").length;
    for (let i = 0; i < amount; i++) {
      await dragAndDrop("#inventory figure[data-item='merge-item-" + selectedDog + "']", ".js-mergeslot--empty", "", "");
      await sleepy(400);
    } 
    e.preventDefault();
  }
};

document.onkeyup = function(e) {
  
  if (e.which == 90) { z_down = false; }
  if (e.which == 18) { alt_down = false; }
  
  keys[e.key] = false;
}
