// ==UserScript==
// @name         MOOMOO.IO Funny Color Mod
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fun Colors 4 MooMoo.io!
// @author       Cody Webb
// @match                 *://moomoo.io/*
// @match                 *://sandbox.moomoo.io/*
// @match                 *://dev.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405090/MOOMOOIO%20Funny%20Color%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/405090/MOOMOOIO%20Funny%20Color%20Mod.meta.js
// ==/UserScript==

(function() {
    document.getElementById("storeHolder").style = "height: 1500px; width: 450px;";
    document.getElementById("gameName").style.color = "blue";
    document.getElementById("setupCard").style.color = "red";
    document.getElementById("gameName").innerHTML = "MooMoo.io <br>Cool Colors";
    document.getElementById('adCard').remove();
    document.getElementById("leaderboard").append('COLOR MOD');
    document.getElementById("leaderboard").style.color = "#1EFF0E";
    document.getElementById("allianceButton").style.color = "#990000";
    document.getElementById("chatButton").style.color = "#FFFF50";
    document.getElementById("storeButton").style.color = "#FF50DD";
    $("#mapDisplay").css("background", "url('https://i.imgur.com/fgFsQJp.png')");
    document.getElementById("diedText").innerHTML = "U DIED, OOOOOOOOOF!!!!";
    $("#adCard").css({display: "none"});
    $("#gameCanvas").css('cursor', 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default');
    $("#moomooio_728x90_home").parent().css({display: "none"});
    document.getElementById("scoreDisplay").style.color = "#000000";
    document.getElementById("woodDisplay").style.color = "#00FFFF";
    document.getElementById("stoneDisplay").style.color = "#FF8000";
    document.getElementById("killCounter").style.color = "#FF8A50";
    document.getElementById("foodDisplay").style.color = "#e842f4";
})();