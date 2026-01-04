//Changez "Username" et "Password"
// ==UserScript==
// @name         Autovote Accro !
// @namespace    http://vote.accro.online/login.php
// @version      0.2
// @description  Un script pour voter automatiquement vote.accro.online
// @author       Congelateur
// @match        http://vote.accro.online/*
// @match        https://www.rotopserv.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367666/Autovote%20Accro%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/367666/Autovote%20Accro%20%21.meta.js
// ==/UserScript==

(function() {
    if(window.location.href.indexOf("/login.php") > -1)
            setInterval( function(){
            document.getElementById("login").setAttribute("value","Username");
            document.getElementById("senha").setAttribute("value","Password");
            document.querySelector(".bt").click();
            },500);
    else
    {
        setInterval( function(){
                    window.location.replace("http://vote.accro.online/votar.php?id=1.attr('1')");
            },15000);
    }
})();