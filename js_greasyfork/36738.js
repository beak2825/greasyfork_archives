// ==UserScript==
// @name         xbox-now linker
// @namespace    daniel_watson
// @version      0.1
// @description  Adds a button in the microsoft store to compare prices on xbox-now.com
// @author       You
// @match        https://www.microsoft.com/*/store/p/*/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/36738/xbox-now%20linker.user.js
// @updateURL https://update.greasyfork.org/scripts/36738/xbox-now%20linker.meta.js
// ==/UserScript==

function addButton() {
    var url = document.URL;
    var button_div = document.getElementsByClassName("pdp-action-buttons")[0];
    var pid = "";
    var buttons = button_div.getElementsByTagName("button");
    for (var i=0; i<buttons.length;i++){
        console.log(i);
        var data = buttons[i].getAttribute("data-m");
        if (data){
            var data_j = JSON.parse(data);
            if(data_j.pid) {
                pid = data_j.pid;
                break;
            }
        }
    }
    if (pid.length > 0){
        var xn_url = "https://www.xbox-now.com/de/game-comparison?search="+pid;
        //<a class="c-button f-primary cli_additionalSaleButton" role="button" href="/de-de/store/p/xbox-live-gold/cfq7ttc0k5dj">ABC</a>
        var xn_button = document.createElement ('a');
        xn_button.setAttribute ('class', 'c-button f-primary cli_additionalSaleButton');
        xn_button.setAttribute ('role', 'button');
        xn_button.setAttribute ('href', xn_url);
        xn_button.innerText="Compare Price";
        button_div.appendChild(xn_button);
        console.log(xn_button);
    }
}
window.addEventListener("load", addButton);