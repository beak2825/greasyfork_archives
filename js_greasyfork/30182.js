// ==UserScript==
// @name         Skwikker
// @version      0.1342
// @description  Mise en forme automatique de Skwikker
// @author       MockingJay
// @match        https://www.dreadcast.eu/Forum*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @namespace    https://greasyfork.org/users/30975
// @license      http://creativecommons.org/licenses/by-nc-nd/4.0/
// @downloadURL https://update.greasyfork.org/scripts/30182/Skwikker.user.js
// @updateURL https://update.greasyfork.org/scripts/30182/Skwikker.meta.js
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

function rgb2hex(orig) {
    var rgb = orig.replace(/\s/g,'').match(/^rgba?\((\d+),(\d+),(\d+)/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : orig;
}

function getDCDate(){
    //Code de Ianouf
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getYear() - 100;

    var dchep = Math.floor(day / 7) + 1;
    var dcday = day % 7;
    var dcyear = 70 + year*12 + month;

    if(dcday === 0){
        dchep--;
        dcday=7;
    }

    return dcday + '/' + dcyear + '.' + dchep;
}

function detectAddContent(str) {
    if (str === "") {
        $("#sk_addType").val("txt");
    } else if (str.search(/\.(jpg|jpeg|png|gif|bmp)$/i) > -1) {
        $("#sk_addType").val("img");
    } else if (str.includes("youtube.com") || str.includes("youtu.be")) {
        $("#sk_addType").val("vid");
    }
}

var userPseudo = initLocalMemory("", "sk_userPseudo");
var userId = initLocalMemory("", "sk_userId");
var userLink = initLocalMemory("", "sk_userLink");
var userAvatar = initLocalMemory("", "sk_userAvatar");
var lastSkNum = initLocalMemory("000", "sk_lastSkNum");
var extendedBox = initLocalMemory(true, "sk_extendedBox");

var $skBox = $(`
<div id="sk_box" style="display: none; position: fixed; top: 100px; left: 20px; background: aliceblue; border: skyblue 2px solid; padding: 5px; z-index: 99999999999999">
<div id="sk_title" style="width: 380px;height: 20px;">
<h3 style="display: inline; position: absolute;">Skwikker</h3>
<input id="sk_reduce" type="button" value="Agrandir/Réduire" style="display: inline; right: 30px; position: absolute;">
<input id="sk_close" type="button" value="X" style="display: inline; right: 0px; position: absolute;" onclick="$('#sk_box').fadeOut();">
</div>
<br/>
<div id="sk_content" style="width: 380px; padding-left: 5px">
<div id="sk_prime">
<p>Pseudo:</p><input type="text" id="sk_pseudo" class="sk_field">
<p>@ID (Nom de compte):</p><input type="text" id="sk_id" class="sk_field">
<p>Lien EDC:</p><input type="text" id="sk_link" class="sk_field">
<p>Lien Avatar:</p><input type="text" id="sk_avatar" class="sk_field">
</div>
<p>N° Skwik:</p><input type="text" id="sk_n" class="sk_field" value="000">
<p>Message:</p><textarea id="sk_message" class="sk_field" maxlength="200" style="background: url(&quot;../../../../images/fr/design/forum/fond_message_repeat_x_2.jpg&quot;) repeat-x rgb(233, 233, 233); height: 60px;"></textarea>
<p>Image/vidéo (optionnel):</p><input type="text" id="sk_add" class="sk_field">
<p>Hashtags:</p><input type="text" id="sk_hash" class="sk_field">
<br/>
<div style="text-align: center">
<select id="sk_addType" style="margin-right: 20px;">
<option value="txt">Texte</option>
<option value="img">Image</option>
<option value="vid">Vidéo</option>
</select><input type="checkBox" id="sk_isEDC"><p style="display: inline; font-size: 13px;"> Afficher l'avatar (pour EDC)</p>
</div>
<div style="text-align: center"><input type="button" id="sk_send" value="Générer!"></div>
</div>
</div>
`);

var baseTemplate = `[quote]{#AVATAR#}[taille=4][b]{#PSEUDO#}[/b] [lien={#LIEN#}][c=A0A0A0]@{#ID#}[/c][/lien][c=A0A0A0] · {#DATE#} · #{#NUM#}[/c][/taille]
{#TEXT#}
{#HASH#}
 
[taille=4][c=A0A0A0][b][lien=#new_comment][c=vert]➦[/c][/lien][/b] 0 [invisible] ····· [/invisible] [b][lien=#give_star][c=rouge]❤[/c][/lien][/b] 0 [invisible] ····· [/invisible] [b][c=noir]♺[/c][/b] 0[/c][/taille][/quote]`;

$(document).ready(function() {

    $("body").append($skBox);
    $(".sk_field").css({
        width: "360px",
        padding: "2px 5px",
        color: "black",
        "margin-bottom": "5px"
    });
    $("#sk_prime").css({
        display: extendedBox ? "block" : "none"
    });
    $("#sk_pseudo").val(userPseudo).change(function() {
        userPseudo = $(this).val();
        GM_setValue("sk_userPseudo", userPseudo);
    });
    $("#sk_id").val(userId).change(function() {
        userId = $(this).val();
        GM_setValue("sk_userId", userId);
    });
    $("#sk_link").val(userLink).change(function() {
        userLink = $(this).val();
        GM_setValue("sk_userLink", userLink);
    });
    $("#sk_avatar").val(userAvatar).change(function() {
        userAvatar = $(this).val();
        GM_setValue("sk_userAvatar", userAvatar);
    });
    $("#sk_n").val(lastSkNum).change(function() {
        lastSkNum = $(this).val();
        GM_setValue("sk_lastSkNum", lastSkNum);
    });
    $("#sk_add").change(function() {
        detectAddContent($(this).val());
    });
    $("#sk_reduce").click(function() {
        $('#sk_prime').slideToggle();
        extendedBox = !extendedBox;
        GM_setValue("sk_extendedBox", extendedBox);
    });
    var $skButton = $('<div style="position: absolute;bottom: 0px;right: 0px" class="bouton">Skwikker</div>');
    $("#zone_reponse").append($skButton);
    $skButton.click(function(){
        $('#sk_box').fadeIn();
    });
    $("#sk_send").click(function() {
        var messageContent = $("#sk_message").val() || " ";
        if ($("#sk_addType").val() == "vid") {
            messageContent += "\n \n \n" + "[centre][youtube]" + $("#sk_add").val() + "[/youtube][/centre]\n ";
        } else if ($("#sk_addType").val() == "img") {
            messageContent += "\n \n \n" + "[centre][img=" + $("#sk_add").val() + "][/centre]\n ";
        } else {
            messageContent += $("#sk_isEDC").prop("checked") ? "\n ".repeat((2 - (messageContent.match("\n") || []).length) || 0) : "\n ";
        }
        var skweek = baseTemplate
        .replace("{#AVATAR#}", $("#sk_isEDC").prop("checked") ? "[gauche!][img="+ $("#sk_avatar").val() +"][/gauche!]" : "")
        .replace("{#PSEUDO#}", $("#sk_pseudo").val())
        .replace("{#LIEN#}", $("#sk_link").val())
        .replace("{#ID#}", $("#sk_id").val())
        .replace("{#DATE#}", getDCDate())
        .replace("{#NUM#}", $("#sk_n").val())
        .replace("{#TEXT#}", messageContent)
        .replace("{#HASH#}", $("#sk_hash").val() !== "" ? "[c=bleu]" + $("#sk_hash").val() + "[/c]" : " ");
        $("#zone_reponse_text").val(skweek);
    });

});