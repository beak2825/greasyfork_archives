// ==UserScript==
// @name         BonziMENU Alpha
// @namespace    https://jysite.ml
// @version      0.1
// @description  Mod menu that adds new features for all supported BonziWORLD Servers. BWR is excluded due to there being no consistent domains.
// @author       Jy
// @match        https://cyganworld.bluefong2.repl.co/
// @match        http://bonzi.lol
// @match        https://bonzi.lol
// @icon         https://media.discordapp.net/attachments/1053978787810902019/1062778187853090906/Screenshot_2023-01-11_10.59.51_AM.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458055/BonziMENU%20Alpha.user.js
// @updateURL https://update.greasyfork.org/scripts/458055/BonziMENU%20Alpha.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var menucont = "<div id='bg'><a href=''>Background Options</a></div> <br> <div id='menuoptions'><a href=''>Menu Options</a><br>"

    //startup
    $("#content").append(
        "<div id='drop' style='left:100%;'><button>Menu</button></div><div id='menuf' style='left:100%;width:200px;height:400px;background-color:white;color:black;'><h3>Menu</h3><hr>" + menucont + "<div id='close' style='bottom:100%;'><br><br><button>Close Menu</button></div></div>"
    );
    $("#menuf").hide();



    //ui
    $("#drop").click(function(){$("#menuf").show(); $("#drop").hide();});
    $("#close").click(function(){$("#menuf").hide(); $("#drop").show();});
})();