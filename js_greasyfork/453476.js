// ==UserScript==
// @name DC - Bouge ta feuille
// @namespace InGame
// @author Nasty
// @date 21/10/2022
// @version 1
// @license DBAD - https://raw.githubusercontent.com/philsturgeon/dbad/master/translations/LICENSE-fr.md
// @include https://www.dreadcast.net/Main
// @include https://www.dreadcast.eu/Main
// @compat Firefox, Chrome
// @description Rend la lecture plus agréable en permettant de déplacer plus facilement une feuille
// @downloadURL https://update.greasyfork.org/scripts/453476/DC%20-%20Bouge%20ta%20feuille.user.js
// @updateURL https://update.greasyfork.org/scripts/453476/DC%20-%20Bouge%20ta%20feuille.meta.js
// ==/UserScript==

$(document).ajaxSuccess(function(e, xhr, opt){
    if (opt.url.includes("/Informations/Page")) {
        $("#livre_principal").append("<div class=glisse-feuille></div>")
        $(".glisse-feuille").css({'position' : 'absolute', 'bottom' : '0', 'right' : '0' , 'user-select' : 'none', 'color' : '#fff', 'font-size' : '12px', 'height' : '18px', 'width' : '18px','background-color' : 'rgba(145,145,145,1)', '-webkit-box-shadow' :'5px 5px 5px 5px rgba(0,0,0,0.65)', 'box-shadow' : '0px 0px 5px 5px rgba(0,0,0,0.65)', 'background-image' : 'url(https://i.imgur.com/dtjw2Gk.png)', 'background-size' : 'contain' });
    }
});
