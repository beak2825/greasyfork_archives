// ==UserScript==
// @name         Notify On New Housesit
// @namespace    http://trustedhousesitters.com/
// @version      0.1
// @description  Notify if there's a new housesit
// @author       cookiemonster
// @license      MIT
// @match        https://www.trustedhousesitters.com/house-and-pet-sitting-assignments/?q=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trustedhousesitters.com
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.notification
// @downloadURL https://update.greasyfork.org/scripts/486566/Notify%20On%20New%20Housesit.user.js
// @updateURL https://update.greasyfork.org/scripts/486566/Notify%20On%20New%20Housesit.meta.js
// ==/UserScript==

( async()=> {
    console.log("Checking for new housesits!");
    let q = new URLSearchParams(window.location.search).get('q');
    let key = "LatestHouse" + q;
    let prevHouse = await GM.getValue(key);
    var housesitNames = document.getElementsByTagName("h3");
    var latestHouse = housesitNames[0].textContent;

    if(prevHouse != latestHouse) {
        var dates = housesitNames[0].parentNode.nextElementSibling;
        var location = dates.nextElementSibling;
        var details = dates.textContent + "\n" + location.textContent;
        GM.notification( details, latestHouse, "", () =>{
            window.focus();
        });
        await GM.setValue( key, latestHouse );
    }
})();