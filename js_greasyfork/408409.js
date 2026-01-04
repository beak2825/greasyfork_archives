// ==UserScript==
// @name         Add Game to my Site to Latest Humble
// @namespace    http://www.hajdurichard.hu/
// @version      0.2
// @description  Add games to my Site for easier addition
// @author       Tusk
// @match        https://store.steampowered.com/app/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/408409/Add%20Game%20to%20my%20Site%20to%20Latest%20Humble.user.js
// @updateURL https://update.greasyfork.org/scripts/408409/Add%20Game%20to%20my%20Site%20to%20Latest%20Humble.meta.js
// ==/UserScript==

function queryGame() {
    let steam_id = document.querySelector('.popular_tags').dataset.appid;
    GM_xmlhttpRequest ( {
        method:     "POST",
        url:        `https://www.hajdurichard.hu/games/check-game-in-monthly/${steam_id}/`,
        headers:    {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload:     function (response) {
            console.log(response);
            let r = JSON.parse(response.response);
            if (r.exists) {
                createExistsButton(r.bundles);
            } else {
                createAddButton();
                addFunctionality();
            }
        }
    });
}

function sendToSite() {
    let steam_id = document.querySelector('.popular_tags').dataset.appid
    GM_xmlhttpRequest ( {
        method:     "POST",
        url:        `https://www.hajdurichard.hu/games/add-new-game-to-latest-monthly/${steam_id}/`,
        headers:    {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload:     function (response) {
            if(response.status === 200) {
                document.getElementById('hr-add-button').children[0].innerHTML = 'Added to HR';
                document.getElementById("hr-add-button").removeEventListener("click", sendToSite);
            } else {
                alert(`${response.status} - ${response.statusText}`);
            }
        }
    });
}

function createAddButton() {
    var zNode = document.createElement ('div');
    zNode.innerHTML = '<div style="" class="btnv6_blue_hoverfade btn_medium" id="hr-add-button">'
        + '<span>Add to HR</span>'
        + '</div>';
    var clearDivs = document.getElementById('queueActionsCtn').querySelectorAll('div[style="clear: both;"]');

    // Loop through the selected divs and remove them
    clearDivs.forEach(function(div) {
        div.parentNode.removeChild(div);
    });
    zNode.setAttribute ('class', 'queue_control_button hr-add-button');
    document.querySelector('#queueActionsCtn').append(zNode);
}

function createExistsButton(bundles) {
    var zNode = document.createElement ('div');
    zNode.innerHTML = '<div style="" class="btnv6_blue_hoverfade btn_medium" id="hr-add-button">'
        + '<span>Exists in HR</span>'
        + `<small>${bundles.toString()}</small>`
        + '</div>';
    var clearDivs = document.getElementById('queueActionsCtn').querySelectorAll('div[style="clear: both;"]');

    // Loop through the selected divs and remove them
    clearDivs.forEach(function(div) {
        div.parentNode.removeChild(div);
    });
    zNode.setAttribute ('class', 'queue_control_button hr-add-button');
    document.querySelector('#queueActionsCtn').append(zNode);
}


function addFunctionality() {
    document.getElementById("hr-add-button").addEventListener("click", sendToSite, false);
}

(function() {
    'use strict';
    queryGame();
    GM_addStyle('.hr-add-button { margin-left: 3px; display: inline-flex;} #hr-add-button {display:flex; flex-direction: column; align-items: center;}');
})();