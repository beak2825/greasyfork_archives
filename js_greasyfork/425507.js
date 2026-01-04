// ==UserScript==
// @name         TP Maptest U-M button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to the tagpro-test map test page to test a map from a U-M ID.
// @author       E. Lek-Tro
// @match        http://tagpro-maptest.koalabeast.com/testmap
// @match        http://tagpro-maptest.koalabeast.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425507/TP%20Maptest%20U-M%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/425507/TP%20Maptest%20U-M%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".form").parent().append("<button id='umIDBtn' class='btn btn-primary'>U-M ID</button>")

    $("#umIDBtn").click(e => {
        changeMapFromID(prompt("Map ID:")).then(() => {
            $(".form .form-group:last-child button[type='submit']").click();
        });
    });

    $("#play-now").attr("href", "http://tagpro-maptest.koalabeast.com/testmap");

    function changeMapFromID(id){
        return new Promise(async (resolve, reject) => {
            console.log("id:", id);
            if(isNaN(Number(id)) || id === "") id = Math.floor(Math.random() * 60000);
            let pngBlob = await fetch(`https://parretlabs.xyz:8006/proxy?isBlob=1&type=image/png&link=http://unfortunate-maps.jukejuice.com/static/maps/${id}.png`)
            .then(res => res.blob());
            let jsonBlob = await fetch(`https://parretlabs.xyz:8006/proxy?type=application/json&link=http://unfortunate-maps.jukejuice.com/static/maps/${id}.json`)
            .then(res => res.blob());

            const pngTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();
            const jsonTransfer = new ClipboardEvent('').clipboardData || new DataTransfer();
            pngTransfer.items.add(new File([pngBlob], 'map.png', {type: "image/png"}));
            jsonTransfer.items.add(new File([jsonBlob], 'map.json', {type: "application/json"}));

            document.querySelector("input[name='layout']").files = pngTransfer.files;
            document.querySelector("input[name='logic']").files = jsonTransfer.files;

            console.log(pngBlob, jsonBlob)

            setTimeout(function(){
                resolve();
            }, 100);
        });
    }

    // Your code here...
})();