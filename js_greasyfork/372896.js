// ==UserScript==
// @name         Netflix - Mehr Kategorien als Auswahl
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Es wird ein neuer Menüpunkt mit vielen weiteren Unterkategorien hinzugefügt! Nachdem Ihr euer Profil ausgewählt habt, müsst Ihr die Seite nochmal neu laden, dann erscheint der zusätzliche Menü Eintrag neben den normalen Menüpunkten. Ist mein erster Versuch, also falls was nicht passt, naja!
// @author       lalelu
// @match        https://www.netflix.com/browse*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372896/Netflix%20-%20Mehr%20Kategorien%20als%20Auswahl.user.js
// @updateURL https://update.greasyfork.org/scripts/372896/Netflix%20-%20Mehr%20Kategorien%20als%20Auswahl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.setTimeout(function() {

        var menuItems = [
            {id:1365,name:"Action & Adventure"},
{id:43040,name:"Actionkomödien"},
{id:1568,name:"Action Sci-Fi & Fantasy"},
{id:43048,name:"Action-Thriller"},
{id:11881,name:"Animationsfilme für Erwachsene"},
{id:7442,name:"Abenteuer"},
{id:3761,name:"Afrikanische Filme"},
{id:3327,name:"Alien Science-Fiction"},
{id:5507,name:"Tiergeschichten"},
{id:7424,name:"Anime"},
{id:2653,name:"Action-Anime"},
{id:9302,name:"Anime-Komödien"},
{id:452,name:"Anime-Dramen"},
{id:11146,name:"Fantasy-Anime"},
{id:3063,name:"Anime-Spielfilme"},
{id:10695,name:"Horror-Anime"},
{id:2729,name:"Sci-Fi-Anime"},
{id:6721,name:"Anime-Serien"},
{id:29764,name:"Arthouse-Filme"},
{id:77232,name:"Asiatische Actionfilme"},
{id:5230,name:"Australische Filme"},
{id:8195,name:"B-Horrorfilme"},
{id:12339,name:"Baseball-Filme"},
{id:12762,name:"Basketball-Filme"},
{id:262,name:"Belgische Filme"},
{id:3652,name:"Biografische Dokumentarfilme"},
{id:3179,name:"Biografische Dramen"},
{id:12443,name:"Boxfilme"},
{id:10757,name:"Britische Filme"},
{id:52117,name:"Britische Serien"},
{id:1252,name:"Überdrehte Filme"},
{id:783,name:"Kinder- und Familienfilme"},
{id:3960,name:"Chinesische Filme"},
{id:46576,name:"Klassische Action– und Abenteuerfilme"},
{id:31694,name:"Klassische Komödien"},
{id:29809,name:"Klassische Dramen"},
{id:31574,name:"Filmklassiker"},
{id:31273,name:"Romantische Klassiker"},
{id:46588,name:"Klassische Thriller	"},
{id:48744,name:"Kriegsklassiker"},
{id:47465,name:"Klassische Western"},
{id:6548,name:"Komödien"},
{id:10118,name:"Comic- und Superhelden"},
{id:6895,name:"Monster und Kreaturen"},
{id:9875,name:"Kriminal-Dokumentarfilme"},
{id:6889,name:"Krimidramen"},
{id:10499,name:"Crime-Thriller"},
{id:26146,name:"Crime/Krimi-Serien"},
{id:869,name:"Düstere Komödien"},
{id:45028,name:"Tiefsee-Horrorfilme"},
{id:67673,name:"Disney"},
{id:59433,name:"Disney-Musicals"},
{id:6839,name:"Dokumentationen"},
{id:5763,name:"Dramen"},
{id:4961,name:"Dramen nach Buchvorlage"},
{id:3653,name:"Dramen nach wahren Begebenheiten"},
{id:10606,name:"Niederländische Filme"},
{id:5254,name:"Osteuropäische Filme"},
{id:10659,name:"Bildung"},
{id:52858,name:"Epen"},
{id:11079,name:"Experimentelle Filme"},
{id:52804,name:"Spirituelle & Glaubensfilme"},
{id:51056,name:"Familienspielfilme	"},
{id:9744,name:"Fantasy-Filme"},
{id:72436,name:"Essen- und Reiseserien"},
{id:12803,name:"Football-Filme"},
{id:58807,name:"Französische Filme"},
{id:31851,name:"Gangsterfilme"},
{id:58886,name:"Deutsche Filme"},
{id:5349,name:"Historische Dokumentarfilme"},
{id:89585,name:"Horrorkomödien"},
{id:8711,name:"Horrorfilme"},
{id:11804,name:"Independent Action & Abenteuer"},
{id:4195,name:"Independent-Komödien"},
{id:384,name:"Independent-Dramen"},
{id:7077,name:"Independent-Filme"},
{id:3269,name:"Independent-Thriller"},
{id:10463,name:"Indische Filme"},
{id:58750,name:"Irische Filme"},
{id:8221,name:"Italienische Filme"},
{id:10398,name:"Japanische Filme"},
{id:10271,name:"Jazz & Easy Listening"},
{id:52843,name:"Musik"},
{id:27346,name:"Für Kinder"},
{id:5685,name:"Koreanische Filme"},
{id:67879,name:"Koreanische Serien"},
{id:1613,name:"Lateinamerikanische Filme"},
{id:8985,name:"Martial Arts Filme"},
{id:6695,name:"Martial Arts, Boxing & Wrestling"},
{id:2125,name:"Militär-Action & Abenteuer"},
{id:4006,name:"Militär-Dokumentarfilme"},
{id:11,name:"Militärdramen"},
{id:25804,name:"Militärserien"},
{id:4814,name:"Miniserien"},
{id:26,name:"Mockumentarys"},
{id:947,name:"Monsterfilme"},
{id:10056,name:"Filme nach Kinderbüchern"},
{id:6796,name:"Filme (0 bis 2 Jahre)"},
{id:6218,name:"Filme (2 bis 4 Jahre)"},
{id:5455,name:"Filme (5 bis 7 Jahre)"},
{id:561,name:"Filme (8 bis 10 Jahre)"},
{id:6962,name:"Filme (11 bis 12 Jahre)"},
{id:90361,name:"Musik- & Konzert-Dokumentarfilme"},
{id:1701,name:"Musik"},
{id:63782,name:"Neuseeländische Filme"},
{id:12123,name:"Historische Filme"},
{id:2700,name:"Politische Komödien"},
{id:7018,name:"Politische Dokumentarfilme"},
{id:6616,name:"Politische Dramen"},
{id:5505,name:"Psychothriller"},
{id:36103,name:"Schräge Liebesfilme"},
{id:9833,name:"Reality TV"},
{id:3278,name:"Rock- & Popkonzerte"},
{id:5475,name:"Romantische Komödien"},
{id:1255,name:"Romantische Dramen"},
{id:502675,name:"Romantische Favoriten"},
{id:9916,name:"Romantische Independent-Filme"},
{id:8883,name:"Romantische Filme"},
{id:6998,name:"Teuflische Geschichten"},
{id:4922,name:"Satiren"},
{id:9292,name:"Skandinavische Filme"},
{id:1492,name:"Sci-Fi & Fantasy"},
{id:6926,name:"Sci-Fi-Abenteuer"},
{id:3916,name:"Sci-Fi-Dramen"},
{id:11014,name:"Sci-Fi-Thriller"},
{id:2595,name:"Dokumentarfilme über Wissenschaft & Natur"},
{id:52780,name:"Wissenschaft & Natur"},
{id:5012,name:"Showbusiness-Dramen"},
{id:10256,name:"Slapstick-Komödien"},
{id:8646,name:"Schlitzer- und Serienkiller-Filme"},
{id:12549,name:"Fußballfilme"},
{id:3675,name:"Sozial- und Kulturdokus"},
{id:3947,name:"Gesellschaftsdramen"},
{id:9196,name:"Südostasiatische Filme"},
{id:2760,name:"Spiritual Documentaries"},
{id:9327,name:"Sports & Fitness"},
{id:180,name:"Sportdokumentationen"},
{id:7243,name:"Sportdramen"},
{id:4370,name:"Sportfilme"},
{id:10702,name:"Spionage-Action & Abenteuer"},
{id:11559,name:"Stand-up Comedy"},
{id:35800,name:"Sinnliche romantische Filme"},
{id:972,name:"Sinnliche Thriller"},
{id:42023,name:"Übernatürliche Horrorfilme"},
{id:11140,name:"Übernatürliche Thriller"},
{id:3519,name:"Teen-Komödien"},
{id:9299,name:"Teen-Drama"},
{id:8933,name:"Thriller"},
{id:1159,name:"Reise- & Abenteuer-Dokumentarfilme"},
{id:10673,name:"Action- & Abenteuer-Serien"},
{id:11177,name:"Zeichentrickserien"},
{id:10375,name:"Comedy-Serien"},
{id:11714,name:"Drama-Serien"},
{id:83059,name:"Horror-Serien"},
{id:4366,name:"Mysterie-Serien"},
{id:1372,name:"Sci-Fi & Fantasy-Serien"},
{id:83,name:"Serien"},
{id:75804,name:"Vampirhorrorfilme"},
{id:7700,name:"Western"},
{id:2856,name:"Weltmusikkonzerte"},
{id:75405,name:"Zombie-Horrorfilme"}
        ];

        var mainMenuContainerStyle = 'position:absolute;top:0;display: block;width: 100vw;min-height: 100vh;background-color:#4d4d4d;color: white;z-index: 9999;padding: 0 0 20px 0; box-sizing: border-box;';

        /* create additional menu item into netflix default menu */
        var menuEl = document.getElementsByClassName('tabbed-primary-navigation');
        var newNav = document.createElement('li'); //the new menu item
        newNav.classList.add('navigation-tab');//to get netflix default style
        var newNavLink = document.createElement('a'); //the link within menuitem
        newNavLink.classList.add('showFullGenreList');
        newNavLink.setAttribute('href', 'javascript:document.getElementById("addmenucontainer").setAttribute("style", "' + mainMenuContainerStyle + '");');

        newNav.appendChild(newNavLink);

        newNavLink.appendChild(document.createTextNode("MEHR KATEGORIEN"));
        menuEl[0].appendChild(newNav);

        /* create full genre list as hide/show container */
        var mainMenuContainerDiv = document.createElement('div');
        mainMenuContainerDiv.setAttribute('id', 'addmenucontainer');
        mainMenuContainerDiv.setAttribute('style', 'display: none;');
        document.body.appendChild(mainMenuContainerDiv);
        var closer = document.createElement('a');
        closer.setAttribute('href', 'javascript:document.getElementById("addmenucontainer").setAttribute("style", "display:none;");');
        closer.setAttribute('style', 'text-transform:uppercase;width: 100vw !important;padding: 5px 10px; box-sizing: border-box;border-bottom: 1px solid white;display: block;text-align: center;font-size: 1.5em; font-weight: bold;');
        closer.appendChild(document.createTextNode('close'));
        mainMenuContainerDiv.appendChild(closer);

        /* generate menu */
        var menuUl = document.createElement('ul');
        mainMenuContainerDiv.appendChild(menuUl);
        for(var i = 0; i < menuItems.length;i++) {
            var li = document.createElement('li');
            li.setAttribute('style', 'list-style-type: none;float:left;width:auto;padding: 5px 10px; box-sizing: border-box;');

            menuUl.appendChild(li);
            var a = document.createElement('a');
            a.setAttribute('href', '/browse/genre/' + menuItems[i].id);
            a.setAttribute('style', 'text-transform:uppercase;');
            li.appendChild(a);
            a.appendChild(document.createTextNode(menuItems[i].name));
        }

    }, 60);
})();