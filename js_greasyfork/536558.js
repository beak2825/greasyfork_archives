// ==UserScript==
// @name         AutoRelic
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  automatically rolls on <T6 mods.
// @author       Cascade
// @match        https://ironwoodrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ironwoodrpg.com
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536558/AutoRelic.user.js
// @updateURL https://update.greasyfork.org/scripts/536558/AutoRelic.meta.js
// ==/UserScript==
function holup(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

holup(50).then(() => {
    clearInterval(checkit);
    setInterval(checkit, 100);
});

function checkit(){
    if(window.location.href.indexOf("quests") == -1) return;
    let q = $('div.name:contains("Create Random Mod")');
    if(q.length > 0){
        doit(q[0]);
    }
}

function num(str){return Number((str.replace(/\D/g, '') || 0))}

let lastModID = "_"

function doit(q){
    let APCounter = $('div.card').find('div.header').find('div.name:contains("Modifier")').parent().find('div.amount').text();

    let curAP = num(APCounter.split("/")[0].trim())
    let maxAP = num(APCounter.split("/")[1].trim());

    let AP = maxAP - curAP;

    let modID = findModID()
    let modTier = findModTier()
    //console.log("curAP/maxAP", curAP + "/" + maxAP + ", " + AP + " remain. modTier: " + modTier +  ", modID: " + modID)

    if(lastModID != modID){
        lastModID = modID
        if(AP > 0 && modTier < 6) {
            $('div.name:contains("Create Random Mod")').click()
        }
    }
}

function findModTier(){
    let tierText = $('div.card').find('div.header').find('div.name:contains("Modifier")').parent().parent().find('div.stat').find('span.tier').text()

    return num(tierText.trim())
}
function findModID(){
    return $('div.card').find('div.header').find('div.name:contains("Modifier")').parent().parent().find('div.stat').text()
}