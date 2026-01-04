// ==UserScript==
// @name         furaffinity Page Arrows 2
// @version      0.1.0
// @description  Change page on furaffinity using arrow keys, modified from original by kittywithclaws: https://sleazyfork.org/en/scripts/38725-e621-page-arrows
// @author       justrunmyscripts
// @include      https://www.furaffinity.net/*
// @license      MIT
// @namespace NA
// @downloadURL https://update.greasyfork.org/scripts/494520/furaffinity%20Page%20Arrows%202.user.js
// @updateURL https://update.greasyfork.org/scripts/494520/furaffinity%20Page%20Arrows%202.meta.js
// ==/UserScript==

const NEXT = ['Next', 'Cont', 'Continue', '>'];
const BACK = ['Back', 'Prev', 'Previous', '<'];

//If it detects a Next or Previous button, add a keydown listener.
console.log(`next count = ${getElementsByText(NEXT).length}`)
console.log(`back count = ${getElementsByText(BACK).length}`)

if(getElementsByText(NEXT).length !== 0 || getElementsByText(BACK).length !== 0){
    document.addEventListener('keydown', (e) => checkKeycode(e));
}

//This skims the page for elements by text. Used to find Next/Prev buttons.
function getElementsByText(strs = [], tags = ['button', 'a']) {
  let found = []
  let _strs = strs.map(s => s.trim().toLowerCase())

  for (let t of tags) {
    found = found.concat([...document.getElementsByTagName(t)].filter(
      el => _strs.includes(el.textContent.trim().toLowerCase())
    ))
  }

  return found;
}

function checkKeycode(event) {
    let keycode = (event.which) ? event.which : event.keyCode;

    if(keycode==39 || keycode==37){
        changePage(keycode);
    }
    return false;
}
//Check if Left or Right arrow are pressed, and change page accordingly.
function changePage(keycode){
    const inputTypes = ["TEXTAREA", "INPUT"];
    const activeElementType = document.activeElement.tagName;

    if (inputTypes.includes(activeElementType)) {
      return;
    }

    if(keycode==39){
      // RIGHT
            getElementsByText(NEXT)[0].click();
    } else if (keycode==37){
      // LEFT
            getElementsByText(BACK)[0].click();
        }
    }