// ==UserScript==
// @name         SoccerWay - Name
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       SStvAA
// @match        https://*.soccerway.com/matches/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421501/SoccerWay%20-%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/421501/SoccerWay%20-%20Name.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(document.URL.search('soccerway.com/matches/')>=0){
        String.prototype.capitalize = function() {
            return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); });
        };
        //Copia texto
        function cT(e){var t=document.createElement("input");t.setAttribute("value",e),document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t);return false;}
        var script = document.createElement('script');
        script.innerText = 'function cT(e){var t=document.createElement("input");t.setAttribute("value",e),document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t);return false;}';
        document.body.appendChild(script);
        //Obtenemos tablas
        jQuery('.combined-lineups-container').each(function(i){
            //Revisa cada nombre
            var fch = this.querySelectorAll('.player.large-link');
            for(var i=0;fch.length>i;i++){
                var a = fch[i].getElementsByTagName('a')[0];
                var name = a.href.split('/')[4].replace(/-/g," ").capitalize();
                var link = a.href;
                a.removeAttribute('href');
                a.innerHTML = `<a href="${link}">${a.innerText}</a> - <a onclick="cT('${name}')" style = "background-color: rgba(0, 255, 255, 0.3);">${name}</a`
            }
        });
    }
})();