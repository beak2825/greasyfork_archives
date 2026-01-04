// ==UserScript==
// @name copyTerminal
// @namespace InGame
// @author Nasty, Pilz
// @date 14/10/2022
// @version 3
// @license DBAD - https://raw.githubusercontent.com/philsturgeon/dbad/master/translations/LICENSE-fr.md
// @include https://www.dreadcast.net/Main
// @include https://www.dreadcast.eu/Main
// @compat Firefox, Chrome
// @grant GM_setClipboard
// @grant GM_addStyle
// @description Copie rapidement le contenu d'une page du TP (STV, Cryo, Historiques des entreprises et OI)
// @downloadURL https://update.greasyfork.org/scripts/453068/copyTerminal.user.js
// @updateURL https://update.greasyfork.org/scripts/453068/copyTerminal.meta.js
// ==/UserScript==


GM_addStyle ( `
.downloadCurrentHistory {
  text-align: center;
  position: relative;
  border: none;
  font-size: 28px;
  color: #FFFFFF;
  padding: 20px;
  width: 100%;
  text-align: center;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  text-decoration: none;
  overflow: hidden;
  cursor: pointer;
}

.downloadCurrentHistory:after {
  content: "";
  background: #90eeea;
  display: block;
  position: absolute;
  padding-top: 300%;
  padding-left: 350%;
  margin-left: -20px!important;
  margin-top: -120%;
  opacity: 0;
  transition: all 0.8s
}

.downloadCurrentHistory:active:after {
  padding: 0;
  margin: 0;
  opacity: 1;
  transition: 0s
}
`);

$(document).ajaxSuccess(function (e, xhr, opt) {
  if (opt.url.includes("/CrystalHistory")) {
    var $button = $("#db_historique_cristaux").append('<button class="downloadCurrentHistory">Copier</button>');
    $button.click(function () {
      var copyText = $("#entreprise_historique").children().first().text().replace(/(\r\n|\n|\r|\t|")/gm, "").replace(/\s+/g, " ").replace(/Cr\. /gm, "Cr.\n").replace(/CF\ !\ /gm, "CF\!\n");
      GM_setClipboard(copyText);
    });
  }

  if (opt.url.includes("/ListeCryoFull")) {
    var $button = $("#db_liste_cryo").append('<button class="downloadCurrentHistory">Copier</button>');
    $button.click(function () {
      var copyText = $("#imperial_data").text().replace(/(\r\n|\n|\r|\t|")/gm, "").replace(/\s+/g, " ").replace(/\[/g,"\r\n[");
      GM_setClipboard(copyText);
    });
  }
  if (opt.url.includes("/Main/DataBox/default=CompanyHistory")) {
    console.log("oui")
    var $button = $("#db_historique_entreprise").append('<button class="downloadCurrentHistory">Copier</button>');
    $button.click(function () {
      var copyText = $("#entreprise_historique").children().eq(1).text().replace(/(\r|\t|")/gm, "").replace(/\s+/g, " ").replace(/Cr/gm, "Cr.\n").replace(/\ \[/gm,"\n [").replace(/(^\n)/gm, "").replace(/^\ /gm,"").replace(/\ $/gm,"\n");
      GM_setClipboard(copyText);
    });
  }

});
