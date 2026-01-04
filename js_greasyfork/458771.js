// ==UserScript==
// @name         Talep
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  B2B talep et butonu
// @author       Tevfik Bagcivan
// @match        https://b2b.defacto.com.tr/web/Inspection/InspectionRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=defacto.com.tr
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458771/Talep.user.js
// @updateURL https://update.greasyfork.org/scripts/458771/Talep.meta.js
// ==/UserScript==

(function() {
    'use strict';



    let talepbtn = document.createElement("button");
    talepbtn.innerHTML = "Talep Et";
    talepbtn.className = 'class="onlyPassed k-button k-button-icontext k-grid-Search';
    talepbtn.id = "talepet";
    talepbtn.type = "submit";

    document.querySelector("#inspectionHeaderGrid > div.k-header.k-grid-toolbar.k-grid-top").appendChild(talepbtn);

    var bekleme = 1750
    function waitforme(ms){
        return new Promise(resolve =>{
            setTimeout(() => {resolve('')},ms);

        })}

    async function talepet()
    {
        var talep = document.getElementsByClassName('k-button k-button-icontext k-grid-Approve request'),i;

        for (let i = 0; i < talep.length; i++) {

            //await waitforme(bekleme);
            //document.querySelector("#inspectionHeaderGrid > div.k-grid-content > table > tbody > tr:nth-child("+[i+1]+")").click();

            talep[i].click();
            await waitforme(bekleme);

            document.querySelector("#SendButton").click();
            await waitforme(bekleme);

        }

        var toast = document.getElementsByClassName('toast-message')
        for (let index = 0; index < toast.length; index++) {
            toast[index].click()
        }
    }

    const talepetbtn = document.getElementById('talepet');

    talepetbtn.addEventListener('click', () => {
        talepet();
    });


})();