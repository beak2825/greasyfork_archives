// ==UserScript==
// @name         NexusHD Subtitles
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Add subtile symbols in detail page.
// @author       t3x4
// @match        http*://www.nexushd.org/*
// @icon         http*://www.nexushd.org/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451492/NexusHD%20Subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/451492/NexusHD%20Subtitles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.href.match(/details\.php/)){

        //var x=document.getElementsByTagName("td");
        //alert(x[17].innerHTML);
        var x=document.querySelector("#outer > table:nth-child(2) > tbody > tr:nth-child(5) > td.rowfollow");
        if (x===null){
            x=document.querySelector("#outer > table:nth-child(6) > tbody > tr:nth-child(5) > td.rowfollow");
        }
        //alert(x.innerHTML);

        var text = document.getElementById('kdescr').innerHTML;
        //alert(text);

        if (text.match(/Unique ID/)){
            text = text.replaceAll("\n", "");
            text = text.match(/Text(.*)/)[1];
            //alert(text);
            if (text.match('English')){
                var English=document.createElement("img");
                English.src="/pic/flag/uk.gif";
                x.appendChild(English);
            }
            if (text.match('Arabic')){
                var Arabic=document.createElement("img");
                Arabic.src="/pic/flag/saudiarabia.gif";
                x.appendChild(Arabic);
            }
            if (text.match('Bulgarian')){
                var Bulgarian=document.createElement("img");
                Bulgarian.src="/pic/flag/bulgaria.gif";
                x.appendChild(Bulgarian);
            }
            if (text.match('Simplified')||text.match(/chs/i)||text.match('简体')||text.match(/zh-hans/i)||text.match('Chinese')){
                var china=document.createElement("img");
                china.src="/pic/flag/china.gif";
                x.appendChild(china);
            }
            if (text.match('Traditional')||text.match(/cht/i)||text.match('繁体')||text.match(/zh-hant/i)){
                var hongkong=document.createElement("img");
                hongkong.src="/pic/flag/hongkong.gif";
                x.appendChild(hongkong);
            }
            if (text.match('Czech')){
                var Czech=document.createElement("img");
                Czech.src="/pic/flag/czechrep.gif";
                x.appendChild(Czech);
            }
            if (text.match('Danish')){
                var Danish=document.createElement("img");
                Danish.src="/pic/flag/denmark.gif";
                x.appendChild(Danish);
            }
            if (text.match('German')){
                var German=document.createElement("img");
                German.src="/pic/flag/germany.gif";
                x.appendChild(German);
            }
            if (text.match('Greek')){
                var Greek=document.createElement("img");
                Greek.src="/pic/flag/greece.gif";
                x.appendChild(Greek);
            }
            if (text.match('Spanish')){
                var Spanish=document.createElement("img");
                Spanish.src="/pic/flag/spain.gif";
                x.appendChild(Spanish);
            }
            if (text.match('Estonian')){
                var Estonian=document.createElement("img");
                Estonian.src="/pic/flag/estonia.gif";
                x.appendChild(Estonian);
            }
            if (text.match('Finnish')){
                var Finnish=document.createElement("img");
                Finnish.src="/pic/flag/finland.gif";
                x.appendChild(Finnish);
            }
            if (text.match('French')){
                var French=document.createElement("img");
                French.src="/pic/flag/france.gif";
                x.appendChild(French);
            }
            if (text.match('Hebrew')){
                var Hebrew=document.createElement("img");
                Hebrew.src="/pic/flag/israel.gif";
                x.appendChild(Hebrew);
            }
            if (text.match('Hindi')){
                var Hindi=document.createElement("img");
                Hindi.src="/pic/flag/india.gif";
                x.appendChild(Hindi);
            }
            if (text.match('Hungarian')){
                var Hungarian=document.createElement("img");
                Hungarian.src="/pic/flag/hungary.gif";
                x.appendChild(Hungarian);
            }
            if (text.match('Indonesian')){
                var Indonesian=document.createElement("img");
                Indonesian.src="/pic/flag/indonesia.gif";
                x.appendChild(Indonesian);
            }
            if (text.match('Italian')){
                var Italian=document.createElement("img");
                Italian.src="/pic/flag/italy.gif";
                x.appendChild(Italian);
            }
            if (text.match('Japanese')){
                var Japanese=document.createElement("img");
                Japanese.src="/pic/flag/japan.gif";
                x.appendChild(Japanese);
            }
            if (text.match('Korean')){
                var Korean=document.createElement("img");
                Korean.src="/pic/flag/southkorea.gif";
                x.appendChild(Korean);
            }
            if (text.match('Latvian')){
                var Latvian=document.createElement("img");
                Latvian.src="/pic/flag/latvia.gif";
                x.appendChild(Latvian);
            }
            if (text.match('Lithuanian')){
                var Lithuanian=document.createElement("img");
                Lithuanian.src="/pic/flag/lithuania.gif";
                x.appendChild(Lithuanian);
            }
            if (text.match('Malay')){
                var Malay=document.createElement("img");
                Malay.src="/pic/flag/malaysia.gif";
                x.appendChild(Malay);
            }
            if (text.match('Dutch')){
                var Dutch=document.createElement("img");
                Dutch.src="/pic/flag/netherlands.gif";
                x.appendChild(Dutch);
            }
            if (text.match('Norwegian')){
                var Norwegian=document.createElement("img");
                Norwegian.src="/pic/flag/norway.gif";
                x.appendChild(Norwegian);
            }
            if (text.match('Polish')){
                var Polish=document.createElement("img");
                Polish.src="/pic/flag/poland.gif";
                x.appendChild(Polish);
            }
            if (text.match('Brazilian')){
                var Brazilian=document.createElement("img");
                Brazilian.src="/pic/flag/brazil.gif";
                x.appendChild(Brazilian);
            }
            if (text.match('Portuguese')){
                var Portuguese=document.createElement("img");
                Portuguese.src="/pic/flag/portugal.gif";
                x.appendChild(Portuguese);
            }
            if (text.match('Russian')){
                var Russian=document.createElement("img");
                Russian.src="/pic/flag/russia.gif";
                x.appendChild(Russian);
            }
            if (text.match('Slovak')){
                var Slovak=document.createElement("img");
                Slovak.src="/pic/flag/slovakia.gif";
                x.appendChild(Slovak);
            }
            if (text.match('Slovenian')){
                var Slovenian=document.createElement("img");
                Slovenian.src="/pic/flag/slovenia.gif";
                x.appendChild(Slovenian);
            }
            if (text.match('Swedish')){
                var Swedish=document.createElement("img");
                Swedish.src="/pic/flag/sweden.gif";
                x.appendChild(Swedish);
            }
            if (text.match('Tamil')){
                var Tamil=document.createElement("img");
                Tamil.src="/pic/flag/srilanka.gif";
                x.appendChild(Tamil);
            }
            if (text.match('Thai')){
                var Thai=document.createElement("img");
                Thai.src="/pic/flag/thailand.gif";
                x.appendChild(Thai);
            }
            if (text.match('Turkish')){
                var Turkish=document.createElement("img");
                Turkish.src="/pic/flag/turkey.gif";
                x.appendChild(Turkish);
            }
            if (text.match('Ukrainian')){
                var Ukrainian=document.createElement("img");
                Ukrainian.src="/pic/flag/ukraine.gif";
                x.appendChild(Ukrainian);
            }
            if (text.match('Vietnamese')){
                var Vietnamese=document.createElement("img");
                Vietnamese.src="/pic/flag/vietnam.gif";
                x.appendChild(Vietnamese);
            }

        }
    }

})();