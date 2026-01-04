// ==UserScript==
// @name         refresh
// @namespace    sputnik
// @version      777
// @description  $$$
// @author       You
// @match        https://lis-skins.ru/market/csgo/?sort_by=hot
// @match        https://lis-skins.ru/market/dota2/?sort_by=hot
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479843/refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/479843/refresh.meta.js
// ==/UserScript==

function _request(){
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

function refresh(){
    $('.skins-market .controls .reload i').click();
    let bottoms = document.getElementsByClassName('bottom');
    
    for (let i = 0; i != 6; i++) {
        if (bottoms[i].children[1].dataset.diffValue.slice(0, -1) > 74) {
            _request();
        }
    }
}

setInterval(refresh, 1000);


setInterval(() => {
  document.location.reload();
}, 3600000);