// ==UserScript==
// @name        Kinopoisk Torrent Seeker
// @namespace   --
// @description Allows to search film at torrent trackers straignt from Kinopoisk.ru film page
// @include     http://www.kinopoisk.ru/film*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19197/Kinopoisk%20Torrent%20Seeker.user.js
// @updateURL https://update.greasyfork.org/scripts/19197/Kinopoisk%20Torrent%20Seeker.meta.js
// ==/UserScript==

var parent = document.getElementById("headerFilm");

//Select tracker
var el = $("title").eq(0);

//add trackers here
var trk = ['-','Rutor', 'Rutracker'] 

//search engines are individual,change manually
var link = []
    link[0] = 'about:blank'
    link[1] = 'http://new-rutor.org/search/' + el.text() + '/';
    link[2] = 'http://rutracker.org/forum/tracker.php?nm='+el.text()

//list generation
var select = document.createElement('select');
for (var i = 0; i < trk.length; i++) 
    {
       var opt = trk[i];
       var opt_el = document.createElement("option");
       opt_el.textContent = opt;
       opt_el.value =  link[i];
       select.appendChild(opt_el);
    }
    parent.appendChild(select);  

//button press 
var btn = document.createElement('button');
    btn.appendChild(document.createTextNode("Get on Torrent"));
    parent.appendChild(btn);
    btn.addEventListener ("click", function()
    {
        location.href = select.value;
    });