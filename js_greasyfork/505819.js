// ==UserScript==
// @name         Ironwood RPG - Expedition Notifier
// @namespace    http://tampermonkey.net/
// @version      2024-08-29
// @description  none
// @author       Cascade
// @match        https://ironwoodrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ironwoodrpg.com
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/505819/Ironwood%20RPG%20-%20Expedition%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/505819/Ironwood%20RPG%20-%20Expedition%20Notifier.meta.js
// ==/UserScript==
//jQuery because idc

wait(3000).then(() => {if (!running) {run(); running = true;}});
var running = false;
function run(){
    if (window.location.href.indexOf("skill/15") != -1){
        let obj = $('div.card').find('div:contains("Expedition Success")').closest('div').find('span:contains("/")').closest('div')[0];
        let successfulExpedCount = obj ? parseInt(obj.childNodes[0].textContent.trim()) : -1;
        console.log($('div:contains("Expedition Success")')[0]);
        console.log('successfulExpedCount: ' + successfulExpedCount);
        if(successfulExpedCount == 31){
            playSound('https://cdn.freesound.org/previews/611/611112_1629501-lq.ogg');
            wait(1000).then(() => alert('on expedition 31 / 32 required for egg'));
        }
    }
    wait(30000).then(run);
}

function wait(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

function playSound(url) {
    let a = new Audio(url);
    a.play();
}