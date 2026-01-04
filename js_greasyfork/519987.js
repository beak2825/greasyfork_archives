// ==UserScript==
// @name    Traducteur Cosmos-Français
// @namespace   InGame
// @author  Nasty
// @date 06/12/2024
// @version 1
// @license DBAD - https://raw.githubusercontent.com/philsturgeon/dbad/master/translations/LICENSE-fr.md
// @include https://www.dreadcast.net/Forum*
// @include https://www.dreadcast.eu/Forum*
// @description Remplace les ù par des u
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/519987/Traducteur%20Cosmos-Fran%C3%A7ais.user.js
// @updateURL https://update.greasyfork.org/scripts/519987/Traducteur%20Cosmos-Fran%C3%A7ais.meta.js
// ==/UserScript==

GM_addStyle ( `
    #footer_sujet .traduire {
        position:absolute;
        bottom:0;
        width:130px;
        left:71%;
        margin-left:5px
      }
    `);


    $(document).ajaxSuccess(function (e, xhr, opt) {
        if (opt.url.includes("/Forum/Navigate")) {
        if ($("#traducteur").length == 0 ) {
          var $button = $("#zone_reponse").append('<div id="traducteur" class="bouton traduire">Traduire</div>');
          $button.click(function() {
            var messagepaslisible = $("#zone_reponse_text").val()
            var messagelisible = messagepaslisible.replace(/ù/g, "u");
            console.log(messagelisible)
            $("#zone_reponse_text").val(messagelisible)
        });
        }
    }});
