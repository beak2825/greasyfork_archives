// ==UserScript==
// @name         Difference PersonalStats
// @namespace    differentstats
// @version      0.2
// @description  shows defends lost
// @author       nao
// @match        https://www.torn.com/profiles.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503213/Difference%20PersonalStats.user.js
// @updateURL https://update.greasyfork.org/scripts/503213/Difference%20PersonalStats.meta.js
// ==/UserScript==

let api = "3nT3RY0Urap1K3Y5Er3";

let id = window.location.href.split("XID=")[1];


async function getData(tstamp){

    let data =await $.getJSON(`https://api.torn.com/user/${id}?selections=personalstats&stat=defendslost&timestamp=${tstamp}&key=${api}`);
    console.log(data.personalstats.defendslost);
    return data.personalstats.defendslost;



}

async function main(){
    let currentTime  = parseInt(Date.now()/1000);
    let lastTime = currentTime - 82600;
    let lastdata =await getData(lastTime);
    let cdata =await getData("");

    let df = cdata - lastdata;
    $("#profileroot > div > div > div > div:nth-child(1) > div.profile-left-wrapper.left > div > div > div.title-black.top-round").text(`Defends Lost: ${df}`);

}

main();