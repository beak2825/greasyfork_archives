// ==UserScript==
// @name         Netflix - Additional Movie Categories
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Activate script, load Netflix, browse your profile and refresh your Netflix page to see the additional menu entry; big thanks to Keeni for this english translation
// @author       lalelu
// @match        https://www.netflix.com/browse*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375129/Netflix%20-%20Additional%20Movie%20Categories.user.js
// @updateURL https://update.greasyfork.org/scripts/375129/Netflix%20-%20Additional%20Movie%20Categories.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.setTimeout(function() {

        var menuItems = [
            {id: 1365, name: "Action & Adventure"},
{id: 43040, name: "Action comedies"},
{id: 1568, name: "Action Sci-Fi & Fantasy"},
{Id: 43048, name: "Action thriller"},
{id: 11881, name: "Animated Films for Adults"},
{Id: 7442, name: "Adventure"},
{id: 3761, name: "African Movies"},
{id: 3327, name: "Alien Science Fiction"},
{Id: 5507, name: "Animal Stories"},
{Id: 7424, name: "Anime"},
{Id: 2653, name: "Action Anime"},
{Id: 9302, name: "Anime Comedies"},
{Id: 452, name: "Anime Dramas"},
{Id: 11146, name: "Fantasy Anime"},
{Id: 3063, name: "Anime movies"},
{Id: 10695, name: "Horror anime"},
{Id: 2729, name: "Sci-Fi Anime"},
{Id: 6721, name: "Anime series"},
{Id: 29764, name: "Arthouse films"},
{id: 77232, name: "Asian Action Movies"},
{id: 5230, name: "Australian Movies"},
{Id: 8195, name: "B-horror movies"},
{Id: 12339, name: "Baseball movies"},
{Id: 12762, name: "Basketball Movies"},
{id: 262, name: "Belgian Movies"},
{id: 3652, name: "Biografische Dokumentarfilme"},
{id: 3179, name: "Biographical Dramas"},
{Id: 12443, name: "Boxing Films"},
{id: 10757, name: "British Movies"},
{id: 52117, name: "British Series"},
{id: 1252, name: "Exaggerated Movies"},
{id: 783, name: "Children and Family Movies"},
{id: 3960, name: "Chinese Movies"},
{id: 46576, name: "Classic Action and Adventure Movies"},
{id: 31694, name: "Classical Comedies"},
{id: 29809, name: "Classical Dramas"},
{Id: 31574, name: "classic film"},
{id: 31273, name: "Romantic Classics"},
{id: 46588, name: "Classic Thriller"},
{Id: 48744, name: "War classic"},
{id: 47465, name: "Classic Westerns"},
{Id: 6548, name: "Comedy"},
{id: 10118, name: "Comic and Superheroes"},
{id: 6895, name: "monsters and creatures"},
{Id: 9875, name: "Crime Documentaries"},
{Id: 6889, name: "crime drama"},
{Id: 10499, name: "Crime thriller"},
{Id: 26146, name: "Crime / crime series"},
{id: 869, name: "Dark Comedies"},
{Id: 45028, name: "deep-sea horror movies"},
{Id: 67673, name: "Disney"},
{Id: 59433, name: "Disney musical"},
{Id: 6839, name: "documentation"},
{Id: 5763, name: "dramas"},
{id: 4961, name: "Dramas based on novel"},
{id: 3653, name: "Dramas of true events"},
{id: 10606, name: "Dutch Movies"},
{id: 5254, name: "Eastern European Movies"},
{Id: 10659, name: "Education"},
{Id: 52858, name: "Epics"},
{id: 11079, name: "Experimental Movies"},
{id: 52804, name: "Spiritual & Belief Movies"},
{Id: 51056, name: "Family movies"},
{Id: 9744, name: "Fantasy films"},
{id: 72436, name: "Food and travel series"},
{Id: 12803, name: "Football Films"},
{id: 58807, name: "French Movies"},
{Id: 31851, name: "gangster films"},
{id: 58886, name: "German Movies"},
{id: 5349, name: "Historical Documentaries"},
{Id: 89585, name: "Horror comedies"},
{Id: 8711, name: "Horror movies"},
{id: 11804, name: "Independent Action & Adventure"},
{Id: 4195, name: "Independent comedies"},
{Id: 384, name: "Independent dramas"},
{Id: 7077, name: "Independent films"},
{Id: 3269, name: "Independent thriller"},
{id: 10463, name: "Indian Movies"},
{id: 58750, name: "Irish Movies"},
{id: 8221, name: "Italian Movies"},
{id: 10398, name: "Japanese Movies"},
{id: 10271, name: "Jazz & Easy Listening"},
{Id: 52843, name: "Music"},
{id: 27346, name: "For children"},
{id: 5685, name: "Korean Movies"},
{id: 67879, name: "Korean Series"},
{id: 1613, name: "Latin American Movies"},
{id: 8985, name: "Martial Arts Movies"},
{id: 6695, name: "Martial Arts, Boxing & Wrestling"},
{id: 2125, name: "Military Action & Adventure"},
{Id: 4006, name: "Military documentary"},
{Id: 11, name: "Military dramas"},
{Id: 25804, name: "Military series"},
{Id: 4814, name: "Miniseries"},
{Id: 26, name: "Documentary"},
{Id: 947, name: "Monster movies"},
{id: 10056, name: "Movies to Children's Books"},
{id: 6796, name: "Movies (0 to 2 years)"},
{id: 6218, name: "Movies (2 to 4 years)"},
{id: 5455, name: "Movies (5 to 7 years)"},
{id: 561, name: "Movies (8 to 10 years)"},
{id: 6962, name: "Movies (11 to 12 years)"},
{id: 90361, name: "Music & Concert Documentaries"},
{Id: 1701, name: "Music"},
{id: 63782, name: "New Zealand Movies"},
{id: 12123, name: "Historical Movies"},
{id: 2700, name: "Political Comedy"},
{id: 7018, name: "Political Documentaries"},
{id: 6616, name: "Political Dramas"},
{Id: 5505, name: "Psychological thriller"},
{id: 36103, name: "Weird Love Movies"},
{id: 9833, name: "Reality TV"},
{id: 3278, name: "Rock & Pop Concerts"},
{id: 5475, name: "Romantic Comedies"},
{id: 1255, name: "Romantic Dramas"},
{id: 502675, name: "Romantic Favorites"},
{id: 9916, name: "Romantic Independent Movies"},
{id: 8883, name: "Romantic Movies"},
{id: 6998, name: "Devilish Stories"},
{Id: 4922, name: "Satires"},
{id: 9292, name: "Scandinavian Movies"},
{id: 1492, name: "Sci-Fi & Fantasy"},
{Id: 6926, name: "Sci-fi adventure"},
{Id: 3916, name: "sci-fi drama"},
{Id: 11014, name: "Sci-fi thriller"},
{id: 2595, name: "Documentary Films on Science & Nature"},
{id: 52780, name: "Science & Nature"},
{Id: 5012, name: "Show Business dramas"},
{Id: 10256, name: "Slapstick comedy"},
{id: 8646, name: "Slayer and Serial Killer Movies"},
{Id: 12549, name: "Football Movies"},
{id: 3675, name: "Social and Cultural Docus"},
{Id: 3947, name: "social dramas"},
{id: 9196, name: "Southeast Asian Movies"},
{id: 2760, name: "Spiritual Documen"}
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

        newNavLink.appendChild(document.createTextNode("MORE CATEGORIES"));
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