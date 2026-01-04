// ==UserScript==
// @name         Xanax Taken to Age Ratio
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Calculate # of xan taken divided by age
// @author       Natty_Boh[1651049]
// @match        https://www.torn.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @connect      torn.com
// @downloadURL https://update.greasyfork.org/scripts/413556/Xanax%20Taken%20to%20Age%20Ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/413556/Xanax%20Taken%20to%20Age%20Ratio.meta.js
// ==/UserScript==

'use strict';
GM_addStyle ( `
    .xancalc {

font-family: Arial, Helvetica, sans-serif;
font-size: 12px;
letter-spacing: 2px;
color: #0028FF;
font-weight: 700;
margin-top: 2px;

}
`)

setTimeout(getStats, 500);
function getStats(){
    let currentUrl = window.location.href
    let id = currentUrl.split('=')[1];
    console.log(window.location.pathname)
    if (window.location.pathname == '/profiles.php') {
        let url = 'https://api.torn.com/user/'+ id +'?selections=profile,personalstats&key=Put API key here'
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                const data = JSON.parse(response.responseText);
                let age = data.age
                let xan = data.personalstats.xantaken
                let value = (xan/age).toFixed(2)
                let elem = document.querySelector(".user-information");
                elem.innerHTML += `<div class="xancalc">` + value + `</div>`;
            },
            onerror: function (error) {
                console.log(error);
            }
        })
    }

}

