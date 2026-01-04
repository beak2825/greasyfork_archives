// ==UserScript==
// @name         Ignorer Pillage
// @namespace    https://greasyfork.org/fr/users/233221-lotusconfort
// @version      1.2
// @description  Permet de montrer ou d'ignorer les pillages sur l'écran "overview"
// @author       LotusConfort
// @match        https://*/game.php?village=*&screen=overview
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377647/Ignorer%20Pillage.user.js
// @updateURL https://update.greasyfork.org/scripts/377647/Ignorer%20Pillage.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var url = window.location.hostname;
    var lang = url.slice(-2);
    if (sessionStorage.pillage == undefined) {
        sessionStorage.pillage = "off";
    }
    if (lang == "et") lang = "en";


    var $tableauCommands = $('#commands_outgoings');
    var $menu = $('#menu_row2');

    $menu.find('td:last').after('<td id="ignorerPillage" style="padding-right:10px"><a href="#">Ignorer Pillage | mode : ' + sessionStorage.pillage + '</a></td>');
    $('#ignorerPillage').click(function(){ignorerPillage();});

    if (sessionStorage.pillage == "on") {
         $tableauCommands.find('tr').each(function (index, element) {
             var $this = $(this);
             var iconepillage = $this.find('img').attr('src');
             if (iconepillage == "https://ds" + lang + ".innogamescdn.com/asset/4cfd523b/graphic/command/farm.png" || iconepillage == "https://ds" + lang + ".innogamescdn.com/asset/e5869dc3/graphic/command/return_farm.png") {
                 $this.remove();
             };
         });
     };

    function ignorerPillage(){
        console.log("Initialisation du script : Pillage en mode :" + sessionStorage.pillage);
        if(sessionStorage.pillage == "off"){
            sessionStorage.pillage = "on";
            window.location.reload();
        } else {
            sessionStorage.pillage = "off";
            window.location.reload();
        }
    };

})();