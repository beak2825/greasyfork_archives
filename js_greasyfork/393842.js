// ==UserScript==
// @name         CDM : Copier le lien
// @namespace    http://tampermonkey.net/
// @version      0.171
// @description  Ajoute un lien "Copier le lien" dans la zone express
// @author       Flamby67
// @match        http://deskportal2003-si.cm-cic.fr/desk_common/devbooster.aspx?*&_pid=ExpressNew*
// @match        https://deskportal2003-si.cm-cic.fr/desk_common/devbooster.aspx?*&_pid=ExpressNew*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/393842/CDM%20%3A%20Copier%20le%20lien.user.js
// @updateURL https://update.greasyfork.org/scripts/393842/CDM%20%3A%20Copier%20le%20lien.meta.js
// ==/UserScript==

(function() {
    var $j = jQueryWlib;
    $j(document).ready(function() {
        var tile = $j('<a href="#" style="padding:4px; position:absolute; color:white!important; right:36px; text-decoration:none; font-size:12px;" title="Copier le lien dans le presse-papier">#</a>');
        $j(".blocboutons").append(tile);
        tile.click(function() {
            GM_setClipboard("https://wlib-si.cm-cic.fr/?mnc=" + $j("input#MnemonicCode").val() + "&ref=" + $j("input#I").val());
            $j("input#MnemonicCode").css("background-color", "#7FFF00");
            $j("input#I").css("background-color", "#7FFF00");
            setTimeout(function () { $j("input#MnemonicCode").css("background-color", "#fff"); }, 500);
            setTimeout(function () { $j("input#I").css("background-color", "#fff"); }, 500);
        });
    });
})();