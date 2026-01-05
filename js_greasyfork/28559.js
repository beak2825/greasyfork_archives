// ==UserScript==
// @name         Leader_BOT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  RAF
// @author       raf-1994
// @match        https://wot-leader.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28559/Leader_BOT.user.js
// @updateURL https://update.greasyfork.org/scripts/28559/Leader_BOT.meta.js
// ==/UserScript==



(function() {
    window.onload = function(){
        var TIMERINTERVAL = 20 * 1000; // ПЕРИОД ПРОВЕРКИ НА МОНЕТКИ !!!!!!!!!!!!!!!
        var clicks = 0;
        var d1 = new Date();
        var txt = document.createElement("TEXT");
        var text1 = " | Время последнего клика:";
        var text2 = " | Сделано кликов: ";
        var text3 = "Информация о клики будет здесь";
        var text4 = " | Обновления каждые: "+TIMERINTERVAL/1000+" сек.";
        var text5 = "Время первого клика: "+ d1.getHours() +":"+ d1.getMinutes() +":" +d1.getSeconds();
        var t = document.createTextNode(text3);
        txt.id = "infoText";
        txt.appendChild(t);
        document.getElementsByClassName("header")[0].appendChild(txt);
        var timerId = setInterval(function() {
            var d = new Date();
            var elcol = document.getElementsByClassName("coin");
            for(var i = 0; i < elcol.length; i++)
            {
                clicks++;
                document.getElementById("infoText").innerText = text5+text1+" "+ d.getHours() +":"+ d.getMinutes() +":" +d.getSeconds() +text2+String(clicks)+text4;
                elcol[i].click();
            }
        }, TIMERINTERVAL);
    };
})();