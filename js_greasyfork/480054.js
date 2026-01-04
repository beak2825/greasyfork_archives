// ==UserScript==
// @name         open
// @namespace    sputnik
// @version      777
// @description  $$$
// @author       You
// @match        https://lis-skins.ru/market/csgo/?sort_by=hot
// @match        https://lis-skins.ru/market/dota2/?sort_by=hot
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480054/open.user.js
// @updateURL https://update.greasyfork.org/scripts/480054/open.meta.js
// ==/UserScript==

let id;
let skinSet = [];
let names = document.getElementsByClassName('name'); // Получаем набор для открытия скинов в новых вкладках
let skins = document.getElementsByClassName('skins-market-skins-list'); // Получаем все скины на странице
const audio = new Audio("https://sound-pack.net/download/Sound_16293.mp3");

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function _request() {
    const response = fetch("https://api.telegram.org/bot6863119282:AAFeYL3Zz24Qj8KygpeIK7P2CK-p-wYQvD4/sendMessage", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: `{
       "chat_id": 439831541,
       "text": "wake up you need to make money"
      }`,
    });
}
 
function refresh() {
    $('.skins-market .controls .reload i').click();
    let bottoms = document.getElementsByClassName('bottom');
    
    for (let i = 0; i != 3; i++) {
        if (bottoms[i].children[1].dataset.diffValue.slice(0, -1) > 74) {
            audio.play();
            _request();
            
            id = skins[0].children[i].attributes[2].nodeValue;

            if (!skinSet.includes(id)) {
                skinSet.push(id);
                window.open(names[i].href);
            }
        }
        delay(500);
    }
}
 
setInterval(refresh, 1000);
setInterval(function run() { skinSet.length = 0 }, 5000)
 
setInterval(() => {
  document.location.reload();
}, 3600000);