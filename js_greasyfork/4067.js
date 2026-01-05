// ==UserScript==
// @name         Nexus Clash: Navbar+
// @namespace    http://nexusclash.com/wiki/index.php/user:xensyria
// @version      1.4
// @description  Upgrades the Nexus Clash navigation bar by including it on Wiki pages, adding Google Doc map link "+", renaming "Game Map" to "Game", and moving the Ultramap next to it as "Map".
// @match        http://nexusclash.com/*
// @match        http://www.nexusclash.com/*
// @exclude      http://nexusclash.com/wiki/images/*
// @exclude      http://www.nexusclash.com/wiki/images/*
// @exclude      http://nexusclash.com/chargen.html
// @exclude      http://www.nexusclash.com/chargen.html
// @grant        GM_addStyle
// @copyright    PD
// @downloadURL https://update.greasyfork.org/scripts/4067/Nexus%20Clash%3A%20Navbar%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/4067/Nexus%20Clash%3A%20Navbar%2B.meta.js
// ==/UserScript==

if (document.URL.match(/nexusclash\.com\/wiki/)){    //  Check to see if it's the Wiki, and needs the navbar added

    //  Move login / user links
    document.getElementById ('firstHeading').parentNode.insertBefore (document.getElementById ('p-personal'), document.getElementById ('firstHeading'));
    GM_addStyle('#p-personal { padding-top: 0.9em !important; }');

    // Create navbar
    document.getElementById ('p-cactions').insertAdjacentHTML('beforebegin',
        '<table id="wikinavbar">'
            +'<tr>'
                +'<td><img src="/themes/NukeNews/images/pixel.gif" width="347px" height="10px"></img></td>'
                +'<td align="center" valign="center">'
                    +'<a class="wikinavbarlink" href="/modules.php?name=Game">Game</a>'
                    +'<a class="wikinavbarlink" href="http://hem.bredband.net/Treecko/ULTRAMAP.htm">Map</a>'
                    +'<a class="wikinavbarlink" id="wikinavbarplus" href="https://docs.google.com/spreadsheet/ccc?key=0ApnLeomaP9WndGY4b2Q5b0Z6bjFtYkhTY0I1aHVjeGc#gid=0">+</a>'
                    +'<a class="wikinavbarlink" href="/modules.php?name=Game&op=faction">Factions</a>'
                    +'<a class="wikinavbarlink" href="/modules.php?name=Forums">Forums</a>'
                    +'<a class="wikinavbarlink" href="/wiki">Wiki</a>'
                    +'<a class="wikinavbarlink" href="/chargen.html">Planner</a>'
                    +'<a class="wikinavbarlink" href="/modules.php?name=Your_Account">Account</a>'
                +'</td>'
                +'<td align="center" valign="center">'
                    +'<form action="https://www.paypal.com/cgi-bin/webscr" method="post">'
                        +'<input type="hidden" name="cmd" value="_s-xclick">'
                        +'<input type="hidden" name="hosted_button_id" value="NXMLRLMUST7CA">'
                        +'<input type="image" src="https://www.paypal.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">'
                        +'<img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1">'
                    +'</form>'
                +'</td>'
                +'<td><img src="/themes/NukeNews/images/pixel.gif" hspace="0" width="17px" height="10px" align="right"></img></td>'
            +'</tr>'
        +'</table>');
    GM_addStyle('#wikinavbar { position: absolute; width: 100%; height: 76px; top: 0px; background: none; padding: 8px; cellpadding: 0; cellspacing: 0; }');
    GM_addStyle('.wikinavbarlink { background: #ffffff; color: #000000 !important; font-weight: bold; font-size: 14px; font-family: Verdana, Helvetica, Geneva, sans-serif; text-decoration: none; border-color: #000000; border-style: outset; border-width: 3px; padding: 2px; margin: 0px 2px; }');
    GM_addStyle('.wikinavbarlink:hover { background: #C0C0C0; color: #FFFFFF !important; font-weight: bold; font-size: 14px; font-family: Verdana, Helvetica, Geneva, sans-serif; text-decoration: none; border-color: #000000; border-style: inset; border-width: 3px; padding: 2px; margin: 0px 2px; }');
    GM_addStyle('#wikinavbarplus { margin-left: -5px !important; }');
    GM_addStyle('#content { margin: 68px 0 0 12.2em !important; }');
    GM_addStyle('#p-cactions { top: 49px !important; }');

} else {    //  If it's not the Wiki, then just change the existing bar

    var navBar = document.getElementsByClassName('navbar');
    navBar[0].innerHTML = 'Game';
    navBar[5].innerHTML = 'Map';
    navBar[0].parentNode.insertBefore (navBar[5], navBar[1]);
    navBar[1].insertAdjacentHTML('afterend','<a class="navbar" id="navbarplus" href="https://docs.google.com/spreadsheet/ccc?key=0ApnLeomaP9WndGY4b2Q5b0Z6bjFtYkhTY0I1aHVjeGc#gid=0">+</a>');
    GM_addStyle('#navbarplus { margin-left: -3px !important; margin-right: 4px !important; }');

}