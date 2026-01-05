// ==UserScript==
// @name         Home
// @namespace    https://realitygaming.fr/*
// @version      1.0
// @description  New Header Reverse
// @author       Marent
// @match        https://realitygaming.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22364/Home.user.js
// @updateURL https://update.greasyfork.org/scripts/22364/Home.meta.js
// ==/UserScript==

$('ul.visitorTabs').prepend('<a href="https://realitygaming.fr/"><span id="MarentHome" title="Acceuil"></span></a>');
$('#QuickSearchPlaceholder').after('<a href="/sans-reponses/threads"><span id="MarentNorep" title="Sujets sans réponses"></span></a>');

    