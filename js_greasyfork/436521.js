// ==UserScript==
// @name         NPC RS Logger
// @author       ben 🦝#8804 (mushroom)
// @version      0.5
// @description  Log your restocks!
// @match        https://neopetsclassic.com/buyitem/*
// @icon         https://www.google.com/s2/favicons?domain=neopetsclassic.com
// @grant        none
// @namespace https://greasyfork.org/users/727556
// @downloadURL https://update.greasyfork.org/scripts/436521/NPC%20RS%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/436521/NPC%20RS%20Logger.meta.js
// ==/UserScript==

var currentDate = new Date();
var next_rs;
localStorage.getItem("rstracker==") != null ? next_rs = JSON.parse(localStorage.getItem("rstracker==")) : next_rs = 0;

(function() {
    'use strict';

    var page_html = document.body.innerHTML;
    var content = document.getElementById("center")
    var payload = {};

    payload.username = /user=(.*?)"/g.exec(page_html)[1];
    payload.server = "WW";

    if(page_html.indexOf("I accept your offer") > 0 && currentDate > next_rs){
        payload.price = /I accept your offer of (.*?) Neopoints!/g.exec(page_html)[1];
        payload.item = /Buying : (.*?)</g.exec(page_html)[1];
        payload.image = content.getElementsByTagName("img")[1].src;
        payload.description = content.getElementsByTagName("i")[0].innerText;
        console.log(payload)
        $.get("https://rs-logger-gg.herokuapp.com/restock", {payload: JSON.stringify(payload)});

        next_rs = currentDate.getTime() + 2*60*1000
        localStorage.setItem("rstracker==", next_rs);
    }
    else if(page_html.indexOf("SOLD OUT!") > 0){
        payload.item = /<b>(.*?) is SOLD OUT!/g.exec(page_html)[1];
        var contentHTML = document.getElementsByClassName("content")[0]
        payload.image = contentHTML.getElementsByTagName("img")[0].src
        $.get("https://rs-logger-gg.herokuapp.com/miss", {payload: JSON.stringify(payload)});
    }
})();
