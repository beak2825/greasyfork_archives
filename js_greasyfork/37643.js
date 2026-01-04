// ==UserScript==
// @name          Hobolinker
// @namespace     www.zaprocalypse.com
// @description   Adds links to hobopolis areas to the top pane
// @include       http://127.0.0.1:*/topmenu.php
// @version 0.0.1.20180120224045
// @downloadURL https://update.greasyfork.org/scripts/37643/Hobolinker.user.js
// @updateURL https://update.greasyfork.org/scripts/37643/Hobolinker.meta.js
// ==/UserScript==

var tmp = document.body.innerHTML;
tmp = tmp.replace(/character<\/a/,
    '<a target="mainpane" href="showplayer.php?who=352918">Character</a ');
document.body.innerHTML = tmp;

var tmp = document.body.innerHTML;
tmp = tmp.replace(/main<\/a>/,
      '<a target="mainpane" href="main.php">main</a> '
    + '<a target="mainpane" href="place.php?whichplace=airport">airport</a>');
document.body.innerHTML = tmp;

var tmp = document.body.innerHTML;
tmp = tmp.replace(/woods<\/a>/,
      '<a target="mainpane" href="woods.php">woods</a> <br/> '
    + '<a target="mainpane" href="place.php?whichplace=kgb">KGB</a> '
    + '<a target="mainpane" href="council.php">council</a> '
    + '<a target="mainpane" href="ascensionhistory.php?back=other&who=352918">ascensions</a> '
    + '<a target="mainpane" href="managestore.php">store</a> '
    + '<a target="mainpane" href="manageprices.php">prices</a> '
    + '<a target="mainpane" href="storelog.php">sales</a> '
    + '<a target="mainpane" href="clan_viplounge.php">VIP</a> '
    + '<a target="mainpane" href="clan_viplounge.php?whichfloor=2">VIP2</a> '
    + '<a target="mainpane" href="museum.php?floor=4&place=leaderboards&whichboard=4">leader</a> '
    + '<a target="mainpane" href="clan_dreadsylvania.php">Dread</a> '
    + '<a target="mainpane" href="clan_raidlogs.php">Logs</a> '
    + '<a target="mainpane" href="sendmessage.php?toid=352918">Paz</a> '
    + '<a target="mainpane" href="sendmessage.php?toid=514253">Derek</a>');
document.body.innerHTML = tmp;
