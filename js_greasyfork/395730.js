// ==UserScript==
// @name         AITLien
// @version      1.0
// @description  Rend les liens dans l'AITL cliquables.
// @author       MockingJay
// @match        https://www.dreadcast.net/Main
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @license      http://creativecommons.org/licenses/by-nc-nd/4.0/
// @namespace https://greasyfork.org/users/30975
// @downloadURL https://update.greasyfork.org/scripts/395730/AITLien.user.js
// @updateURL https://update.greasyfork.org/scripts/395730/AITLien.meta.js
// ==/UserScript==

//Lit les variables dans GM à la demande. A utiliser pour chaque déclaration de variable qui est copiée en mémoire.
//initValue: Valeur par défaut de la variable, qu'on lui donne à la déclaration et qu'elle garde si pas d'équivalent en mémoire. localVarName: Valeur GM locale.
function initLocalMemory(defaultValue, localVarName) {
    if (GM_getValue(localVarName) === undefined) {
        GM_setValue(localVarName, defaultValue);
        return defaultValue;
    } else {
        return GM_getValue(localVarName);
    }
}

function format_liens(html) {

    //URLs starting with http://, https://, or ftp://
    let replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&#\/%?=~_|!:,.;]*[-A-Z0-9+&#\/%=~_|])/gim;
    html = html.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    let replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    html = html.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    html = html.replace(/(<br\/><\/a>)|(<br><\/a>)/gim, '<\/a><br>'); //Problème des liens www dont la fin peut être tronquée avec une balise <br/>
    html = html.replace(/(<br\/>\" target)|(<br>\" target)/gim, '" target'); //Pareil, correction dans le href

    //Correction pour les images
    html = html.replace(/\<img .*\<a .*\>(.+)\"\>/gim, '<img src="$1" style="max-width: 370px">')
    html = html.replace(/\<img src\=\"(.+)\<\/a\>/gim, '<img src="$1');

    return html;
}

$(document).ready(function() {

    AITL.prototype.showAnnonce = function(a) {
        var b = this.id;
        $.post("ItemAITL/Annonce/Get", {
            id: a
        }, function(a) {
            $("#" + b + " .aitl_page").hide(),
                $("#" + b + " .annonce").fadeIn(),
                $("#" + b + " .annonce .titre span:first").html($(a).find("enteteAnnonce").xml()),
                $("#" + b + " .annonce .titre span:last").html($(a).find("titreAnnonce").xml()),
                $("#" + b + " .annonce .texte span:first").html(format_liens($(a).find("texteAnnonce").xml())),
                $("#" + b + " .annonce .texte span:last").unbind("click"),
                $("#" + b + " .annonce .texte span:last").click(function() {
                $(a).find("auteurAnnonce").xml() ? nav.getMessagerie().newMessage($(a).find("auteurAnnonce").xml()) : engine.displayLightInfo("Auteur inconnu")
            })
        })
    }

});