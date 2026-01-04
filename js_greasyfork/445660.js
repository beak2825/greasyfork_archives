// ==UserScript==
// @name         Torn Loadout Swapping
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hotswap loadouts from attack loader screen
// @author       kindly [1956699]
// @match        *.torn.com/loader.php?sid=attack*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445660/Torn%20Loadout%20Swapping.user.js
// @updateURL https://update.greasyfork.org/scripts/445660/Torn%20Loadout%20Swapping.meta.js
// ==/UserScript==



const addButtons = async () => {
  await getAction({
      type: 'post',
      action: 'page.php',
      data: {
          sid: 'itemsLoadouts',
          step: 'getEquippedItems'
      },
      success: (equippedItems) => {
          try {
              console.log('Loadout Count: ', Object.keys(equippedItems.currentLoadouts).length);
              equipLoadoutButtons(Object.keys(equippedItems.currentLoadouts).length);
          } catch (e) {
              console.log(`error loading equipped items: ${e}`);
          }
      }
  });
}

const equipLoadoutButtons = async (loadoutCount) => {
    while (!document.querySelector(".dialogButtons___HJmc7")) {
    await new Promise((r) => setTimeout(r, 500));
  }
  for (let i = 1; i < loadoutCount+1; i++) {
     const button = `<button id="loadout${i}" class="btn___uBzo2 torn-btn btn___oNEDf undefined">Loadout ${i}</button>`;
     $(".dialogButtons___HJmc7").append(button);
     $(`#loadout${i}`).on('click', async () => {
         await getAction({
                type: 'post',
                action: 'page.php',
                data: {
                    step: 'changeLoadout',
                    setID: i,
                    sid: 'itemsLoadouts',
                },
                success: (str) => {
                    try {
                      console.log("success")
                    } catch (e) {
                        console.log(e);
                    }
                }
      });
     })
  }
}


(function() {
    'use strict';

    addButtons()
})();

