// ==UserScript==
// @name         Profile spy v1
// @description  Adds tornstats spies to profile page
// @author       Link- [2411345]
// @match        https://www.torn.com/profiles.php*
// @grant        GM.xmlHttpRequest
// @require      https://greasyfork.org/scripts/422172-gmfetch/code/gmfetch.js?version=903521
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       GM_addStyle
// @version 0.0.1.20220324161555
// @namespace https://greasyfork.org/users/891960
// @downloadURL https://update.greasyfork.org/scripts/453174/Profile%20spy%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/453174/Profile%20spy%20v1.meta.js
// ==/UserScript==
$.each($('h4#skip-to-content.left'),function(i,v){
    if($(v).html().length > 0)
        $(v).html( $(v).html().substr(0,0) + "Spy: ");
});
(function attack() {
    'use strict';
    let api = "0n3XYaUutZeIfPEI";
    let url = window.location.href;
    if(url.includes("XID"))
    {
        url = new URL(url);
        let attackId = url.searchParams.get("XID");
        console.log(`https://www.tornstats.com/api/v1/${api}/spy/${attackId}`);
        gmfetch(`https://www.tornstats.com/api/v1/${api}/spy/${attackId}`)
        .then(function(response) {
            if (response.status !== 200) {
                console.log(`fetch error ${response.status}`);
                return;
            }
            response.json().then(function(data) {
                let joinBtn = $("h4:contains(\"Spy\")").closest("h4");
                if($(joinBtn).length){
                    $(joinBtn).after(`<div id='attackInfo'>
                    <center><h6>Strength: ${data.spy.strength.toLocaleString("en")}&emsp;
                    Defense: ${data.spy.defense.toLocaleString("en")}&emsp;
                    Speed: ${data.spy.speed.toLocaleString("en")}&emsp;
                    Dexterity: ${data.spy.dexterity.toLocaleString("en")}
                    <br />Total: ${data.spy.total.toLocaleString("en")}&emsp;
                    Spied: ${data.spy.difference}</h6></center>
                    </div>`);
                }
            }).catch((err) => { console.log(err); });
        }).catch(function(err) {
            console.log(`fetch error ${err}`);
        });
    }
})();