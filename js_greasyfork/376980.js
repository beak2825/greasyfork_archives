// ==UserScript==
// @name         Calcul et Affiche le serveur Time avec les MS
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       Lotus Confort
// @match        https://*/game.php?village=*&screen=*
// @match        https://*/game.php?screen=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376980/Calcul%20et%20Affiche%20le%20serveur%20Time%20avec%20les%20MS.user.js
// @updateURL https://update.greasyfork.org/scripts/376980/Calcul%20et%20Affiche%20le%20serveur%20Time%20avec%20les%20MS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setMS() {
            var element1 = document.getElementById("serverTime");
            var element2 = document.getElementById("tsal_tw_ms");
            var time = element1.innerHTML.match(/^\d+\:\d+\:\d+/);
            var date = new Date();
            var ms = (date.getMilliseconds()).toString();
            while (ms.length < 3) {
                ms = "0" + ms;
            };
            var x = Number(ms);
            if (x < 200) {
                $("#tsal_tw_ms").css("color", "black");
            } else if (x < 400) {
                $("#tsal_tw_ms").css("color", "blue");
            } else if (x < 600) {
                $("#tsal_tw_ms").css("color", "darkgreen");
            } else if (x < 800) {
                $("#tsal_tw_ms").css("color", "darkmagenta");
            } else {
                $("#tsal_tw_ms").css("color", "red");
            }
            element2.innerHTML = ms;
        }
        if (!document.getElementById('tsal_tw_ms')) {
            var server_ms = '';
            var server_lag = Number(Timing.offset_to_server) - 70;
            $('.server_info').append('<span class="server_info">|<font color=darkorange><b> Ms: <span  id="tsal_tw_ms">' + server_ms + '</b></font></span><span id="tsal_tw_lag" class="server_info">|<font color=red><b> Lag: ' + server_lag + ' ms</b></font></span>');
            $(".server_info").css("color", "blue");
            $(".server_info").css("font-size", "medium");
            var tnt_show_ms = window.setInterval(setMS, 1);
        }

})();