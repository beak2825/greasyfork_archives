// ==UserScript==
// @name        Teknosa Bingo Scripti
// @license MIT
// @namespace   Violentmonkey Scripts
// @match       https://teknosabingo.com/oyun
// @grant       GM_addStyle
// @version     0.1
// @author      Telegram: @REEEEEEEEEEEEEEEEEEEEEE
// @description 25.12.2021 12:12:45
// @downloadURL https://update.greasyfork.org/scripts/437568/Teknosa%20Bingo%20Scripti.user.js
// @updateURL https://update.greasyfork.org/scripts/437568/Teknosa%20Bingo%20Scripti.meta.js
// ==/UserScript==

var zNode = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'BİNGO</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
  console.log(offsetSeconds)
  if (offsetSeconds >= 30 && offsetSeconds <= 60) {
    showableNumbers = cardFirstRow.concat(cardSecondRow)
  } else {
    alert("Çok erken. Son 30 saniyeyi bekle ve butona bas. O sırada gelen sayıları kontrol et.")
  }
  
}



//--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               fixed;
        top:                    0;
        left:                   0;
        font-size:              20px;
        background:             blue;
        border:                 2px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 20px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }
` );