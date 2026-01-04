// ==UserScript==
// @name          JVC Dezoomer
// @namespace     https://jeuxvideo.com
// @author        [Myster] et LaBistou880
// @run-at        document-start
// @match         https://www.jeuxvideo.com/forums/*
// @match         https://www.jeuxvideo.com/forums/*
// @match         http://*.jeuxvideo.com/forums/*
// @match         https://*.jeuxvideo.com/forums/*
// @match         https://www.jeuxvideo.com/forums/*
// @match         https://www.jeuxvideo.com/forums/*
// @match         http://*.jeuxvideo.com/forums/*
// @match         https://*.jeuxvideo.com/forums/*
// @match         https://www.jeuxvideo.com/recherche/forums/*
// @match         https://www.jeuxvideo.com/recherche/forums/*
// @match         http://*.jeuxvideo.com/recherche/forums/*
// @match         https://*.jeuxvideo.com/recherche/forums/*
// @version       0.8
// @license       BSD
// @description   Script JVC - Permet de remettre le style avant le zoom dégueulasse.
// @downloadURL https://update.greasyfork.org/scripts/445125/JVC%20Dezoomer.user.js
// @updateURL https://update.greasyfork.org/scripts/445125/JVC%20Dezoomer.meta.js
// ==/UserScript==

const url = 'https://static.jvc.gg/22.7.1/css/skin-forum.css'; // Variable qui contient l'adresse de la 22.7.1 du forum, non concerné par le "zoom"

(function() {
    var head = document.head
    var link = document.createElement("link")

    var links = document.getElementsByTagName("link")
    for (var i = 0; i < links.length; i++) {
        if (links[i].href.indexOf("skin-forum.css") != -1) {
            links[i].rel = "alternate"

        }
    }

    link.type = "text/css"
    link.rel = "stylesheet"
    link.href = url

    head.appendChild(link)

})()