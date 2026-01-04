// ==UserScript==
// @name         Skryj kina na ČSFD
// @version      3.0
// @namespace    CSFD-Tomashnyk@gmail.com
// @author       Tomáš Hnyk mailto:tomashnyk@gmail.com
// @description  Skryje pražské multiplexy na ČSFD (jednoduše editovatelné pro vlastní výběr kin, stačí jen přepsat názvy kin v kódu podle toho, jak se objevují na ČSFD)
// @include      https://www.csfd.cz/kino/*
// @license      GPL 3
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/36957/Skryj%20kina%20na%20%C4%8CSFD.user.js
// @updateURL https://update.greasyfork.org/scripts/36957/Skryj%20kina%20na%20%C4%8CSFD.meta.js
// ==/UserScript==

var badCinemas = ["CineStar Praha - Anděl",
"CineStar Praha - Černý Most",
"Cinema City Flora",
"Cinema City Galaxie",
"Cinema City Chodov",
"Cinema City Letňany",
"Cinema City Nový Smíchov",
"Cinema City Slovanský dům",
"Cinema City Zličín",
"Premiere Cinemas Praha Hostivař"]
for (i = 0; i < badCinemas.length; i++) {
  try {var badDiv = $("header.updated-box-header h2:contains(" + badCinemas[i] + ")");
    badDiv.parent().parent().remove();
    }
  catch(e) {}
  try {var badDiv = $("li a:contains(" + badCinemas[i] + ")");
    badDiv.parent().remove();
    }
  catch(e) {}
};