// ==UserScript==
// @name         Bootleggers R9.75 Mod Check
// @namespace    Bootleggers
// @version      0.1
// @description  Check if a mods online every 10 seconds
// @author       BD
// @match        https://www.bootleggers.us/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378582/Bootleggers%20R975%20Mod%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/378582/Bootleggers%20R975%20Mod%20Check.meta.js
// ==/UserScript==

CheckForMods(true);

function CheckForMods(loggedIn) {
    var modOnline = 0;
    if (loggedIn) {
        $.get("/usersonline.php", function(data) {
            $(data).find("#usersOnline > a").each(function() {
                if ($(this).text() == "KyleKroff" || $(this).text() == "FlameS" || $(this).text() == "Riot") {
                    modOnline = 1;
                }
            });

            if (modOnline == 0) {
                console.log("There are no mods online, checking again in 10secs.");
            } else {
                console.log("There is a mod online, checking again in 10secs.");
                //window.location.href = $("a:contains('LOGOUT')")[0].href;
            }

            $.post("https://storebldata.000webhostapp.com/modstatus.php", "online=" + modOnline);

            setTimeout(function() {
                CheckForMods(true);
            }, 10000);
        });
    } else {
        $.get("https://storebldata.000webhostapp.com/modstatus.php", function(data) {
            modOnline = data.split("Mod online: ")[1].split("<div")[0] == "TRUE" ? true : false;
            if (!modOnline) {
                console.log("There are no mods online, logging in.");
                $.post("/checkuser.php", "username=" + LoginName + "&password=" + LoginPass, function() {
                    window.location.href = "https://www.bootleggers.us/news.php?scripts=1";
                });
            } else {
                console.log("There is a mod online, checking again in 10secs.");
                setTimeout(function() {
                    CheckForMods(false);
                }, 10000);
            }
        });
    }
}