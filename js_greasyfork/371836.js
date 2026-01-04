// ==UserScript==
// @name         Scarica Video La Stampa
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Per Floriano
// @author       Stefano Bonato
// @match        https://video.lastampa.it/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371836/Scarica%20Video%20La%20Stampa.user.js
// @updateURL https://update.greasyfork.org/scripts/371836/Scarica%20Video%20La%20Stampa.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var iframescript = document.body.querySelectorAll("script:nth-of-type(3)")[0].innerText;
    var url = (/https:\/\/(.*?)\.mp4(?:')/g.exec(iframescript))[0];
    document.body.innerHTML += "<div id='floriano' style='position:fixed; z-index: 10000; bottom: 0px; left: 0px; text-align: center; background-color:green; width: 100%; height:30px'>"+
        "<a style='text-decoration: none; margin: 0 auto; color: white; font-weight: bold; line-height: 30px' href='"+url+"'>DISABILITA CUSTOM PLAYER</a></div>";
})();