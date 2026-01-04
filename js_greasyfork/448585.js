// ==UserScript==
// @name         nautiljon-forum-topic-last-page-by-default
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Dans le forum, renvoie directement à la dernière page d'un sujet lorsque l'on clique dessus dans la liste.
// @author       Ed38
// @license      MIT
// @match        https://www.nautiljon.com/forum/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nautiljon.com
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/448585/nautiljon-forum-topic-last-page-by-default.user.js
// @updateURL https://update.greasyfork.org/scripts/448585/nautiljon-forum-topic-last-page-by-default.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.getElementById("list_topic")) {
        var lastPage ;
        var links ;
        var list = document.getElementById("list_topic") ;
        var cells = list.getElementsByTagName("td") ;

        for (var i = 0 ; i < cells.length; i = i+6) {
            links = cells[i+1].getElementsByTagName("a") ;
            if(links.length > 1) {
                lastPage = links[links.length-1].href ;
                links[0].href = lastPage;
            }
        }
    }
})();