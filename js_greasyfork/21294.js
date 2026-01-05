// ==UserScript==
// @name         Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://realitygaming.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21294/Search.user.js
// @updateURL https://update.greasyfork.org/scripts/21294/Search.meta.js
// ==/UserScript==

$('ul.visitorTabs').append('<li class="navTab rechercher"><a id="recher" href="search/"target="_blank" class="navLink NoPopupGadget">Rechercher</a></li>');
$('ul.visitorTabs').append('<li class="navTab noanswer"><a id="noanswer" href="sans-reponses/threads" target="_blank" class="navLink NoPopupGadget">NoRep</a></li>');
$('div#searchBar').remove();
