// ==UserScript==
// @name         WoT_LeaderBot by ansine
// @namespace    http://tampermonkey.net/
// @version      1
// @description  SomeText
// @author       95504525
// @icon https://greasyfork.org/system/screenshots/screenshots/000/007/132/original/300x300.png
// @match        *wot-leader.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30098/WoT_LeaderBot%20by%20ansine.user.js
// @updateURL https://update.greasyfork.org/scripts/30098/WoT_LeaderBot%20by%20ansine.meta.js
// ==/UserScript==
window.onload = function()
{
alert("БОТ НЕ РАБОТАЕТ");
};
/*
        var TIMERINTERVAL = 15 * 1000; // ПЕРИОД ПРОВЕРКИ НА МОНЕТКИ (в милисекундах) !!!!!!!!!!!!!!!
        //var clicks = 0;
        var txt = document.createElement("TEXT");
        var t = document.createTextNode("Время последнего сбора: 00:00:00 \nСобрали: ");//+String(clicks));
        txt.id = "infoText";
        txt.appendChild(t);
        document.getElementsByClassName("header")[0].appendChild(txt);
        var timerId = setInterval(function() {
            var d = new Date();
            var elcol = document.getElementsByTagName("div");
            for (var i = 0; i < elcol.length; i++)
            {
                if(elcol[i].className.length == 33)
                {
                    //clicks++;
                    document.getElementById("infoText").innerText = "Статистика не работает";//"Время последнего сбора: "+ d.getHours() +":"+ d.getMinutes() +":" +d.getSeconds() +"\nСобрали: "+String(clicks);
                    elcol[i].click();
                }
            }
        }, TIMERINTERVAL);
    };
})();*/
