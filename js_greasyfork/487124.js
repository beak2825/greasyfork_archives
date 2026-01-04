// ==UserScript==
// @license MIT
// @name         DelugeRPG S-BattlerV3 (WITH WORKING REPEAT BUTTON!!)
// @match        https://www.delugerpg.com/battle/user*
// @version      3.2
// @description  I fixed Monarc4YT's code.
// @author       Calcite
// @grant        none
// @namespace    https://greasyfork.org/en/users/1260021
// @downloadURL https://update.greasyfork.org/scripts/487124/DelugeRPG%20S-BattlerV3%20%28WITH%20WORKING%20REPEAT%20BUTTON%21%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/487124/DelugeRPG%20S-BattlerV3%20%28WITH%20WORKING%20REPEAT%20BUTTON%21%21%29.meta.js
// ==/UserScript==


setInterval(()=>{
    if(document.querySelector(".modal-open") == null){
        document.querySelector("#attack > div.cardif > form > div.buttoncenter > input:nth-child(1)")?.click()
    }
}, 450);

setInterval(() => {
    document.querySelector("#battle > form > div.center > input:nth-child(1)").click();
}, 450);

    document.querySelector("#battle > div.notify_done > a:nth-child(5)").click();


//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑If it gets stuck, delete this code↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑//

//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓Use this if it's getting stuck in the end↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓//

//setInterval(() => {
//document.querySelector("#battle > div.notify_done > a.btn.btn-primary").click();
//}, 450);
