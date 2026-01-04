// ==UserScript==
// @name         SteamDB Free Games Auto Opener
// @version      0.4
// @description  Automatically open Free games on Steam.
// @author       Painforpay
// @match        https://steamdb.info/sales/*
// @grant        none
// @namespace https://greasyfork.org/users/571205
// @downloadURL https://update.greasyfork.org/scripts/403987/SteamDB%20Free%20Games%20Auto%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/403987/SteamDB%20Free%20Games%20Auto%20Opener.meta.js
// ==/UserScript==

(function() {

    'use strict';

        var freegamesc = 0;
        var i;


        start();
        var btn = document.createElement("Button");
        btn.innerHTML = 'Run Script';
        btn.onclick = function() {console.log("Running Again...");start();}
        btn.setAttribute("class", "btn btn-block");
        document.getElementById("DataTables_Table_0_length").appendChild(btn);


        function start() {
        var games = document.querySelector('.table-sales');
        window.SteamDB.Storage.Set("sales-hide-owned-games", 1)
        var list = games.children[1].children;
         if(!list[0].dataset.appid) {
         return alert("No Games Found.");
         }
         for (i = 0; i < list.length; i++) {
         console.log(`[${i+1}] Found "${list[i].children[2].children[0].innerText} [${list[i].dataset.appid}] at ${list[i].children[3].dataset.sort}% Sale"`)
             if(list[i].children[3].dataset.sort > 99) {
                 console.log(`Opening Game with Index ID ${i+1}`)
                 window.open('https://store.steampowered.com/app/' + list[i].dataset.appid);
                 freegamesc += 1;
             }
         }
         if(freegamesc < 1) {alert("No Free Games Found. (Or You Already have them.)")}
         console.log(`Total Free Games: ${freegamesc}`);
    }


})();