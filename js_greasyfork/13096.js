// ==UserScript==
// @name         Karachan czerwone tło - usuwanie
// @version      0.2
// @description  Usuwa czerwone tło ze strony karachan.org
// @author       TomaszTerka
// @include      http://karachan.org/*
// @exclude      http://karachan.org/
// @exclude      http://karachan.org/mitsuba.html*
// @grant        none
// @namespace http://your.homepage/
// @downloadURL https://update.greasyfork.org/scripts/13096/Karachan%20czerwone%20t%C5%82o%20-%20usuwanie.user.js
// @updateURL https://update.greasyfork.org/scripts/13096/Karachan%20czerwone%20t%C5%82o%20-%20usuwanie.meta.js
// ==/UserScript==
$('style').remove();
