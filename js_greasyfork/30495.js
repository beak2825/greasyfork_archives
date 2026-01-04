// ==UserScript==
// @name         Miku Miku Sing!
// @version      1.39.6
// @description  Time to dance!
// @author       MokaP
// @match        https://www.dreadcast.net/Main
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @namespace https://greasyfork.org/users/30975
// @downloadURL https://update.greasyfork.org/scripts/30495/Miku%20Miku%20Sing%21.user.js
// @updateURL https://update.greasyfork.org/scripts/30495/Miku%20Miku%20Sing%21.meta.js
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

var lyricsContent = initLocalMemory("", "mms_lyricsContent");

function ameliorInput(str) {

    var chatInputValue = str;

    if (/^\/me/i.test(chatInputValue)) {

        chatInputValue = "/me" + chatInputValue.substr(3); //Transforme /Me en /me pour que la casse soit respectée et que le chat ressorte bien une emote.

        var quoteMatches = chatInputValue.match(/\"/gi); //Pré-calcul de la place que prendront les balises. Balisage que si ne dépasse pas 200 caractères, balises comprises.

        if (chatInputValue.length + (quoteMatches === null ? 0 : Math.floor(quoteMatches.length/2) * 14) <= 200) {
            return chatInputValue.replace(/"([^\"]+)"/gi, "[c=FFFFFF]$1[/c]");
        }
    } else {
        var starMatches = chatInputValue.match(/\*/gi);

        if (chatInputValue.length + (starMatches === null ? 0 : Math.floor(starMatches.length/2) * 21) <= 200) {
            return chatInputValue.replace(/\*([^\*]+)\*/gi, "[c=58DCF9][i]$1[/i][/c]");
        }
    }
}

function chatPrint(str) {
    $("#chatForm .text_chat").val(ameliorInput(str));
    $("#chatForm").submit();
}

$(document).ready(function() {

    $("body").append(`<style>
#mms_box {
	display: none;
	z-index: 999999;
	position: absolute;
	bottom: 20px;
	left: 0px;
}
#mms_lyrics {
	background-color: rgb(20, 62, 92);
	color: white;
	width: 600px;
	height: 142px;
	padding: 5px;
}

.mms_button {
	position: absolute;
	width: 50px;
	height: 50px;
	top: -50px;
	left: 2px;
	background-color: #723a75;
	color: white;
}

.mms_button:hover {
    background-color: #793F8C;
}

.mms_button:active {
    background-color: #843C57;
}


#mms_link {
	left: 2px;
}

#mms_del {
	left: 62px;
}

#mms_fire {
	width: 110px;
	left: 122px;
}
</style>`);

    $("body").append(`
<div id="mms_box">
    <textarea id="mms_lyrics"/>
    <input id="mms_link" class="mms_button" type="button" value="Link!">
    <input id="mms_del" class="mms_button" type="button" value="Suppr">
    <input id="mms_fire" class="mms_button" type="button" value="Fire! ♫">
</div>
    `);

    $("#mms_lyrics").val(lyricsContent);
    $("#mms_lyrics").change(function() {
        lyricsContent = $(this).val();
        GM_setValue("mms_lyricsContent", lyricsContent);
    });

    $("#mms_fire").click(function() {
        var lyricBullets = $("#mms_lyrics").val().split("\n");
        var actBullet = lyricBullets.shift().trim();

        // Dégager les lignes vides du début et les commentaires
        while (lyricBullets.length && !actBullet.length) {
            actBullet = lyricBullets.shift().trim();
        }

        if (actBullet.length > 0) {
            if (actBullet.length > 196) {
                var i = 195;
                for (; i>0 && actBullet[i] !== " "; i--) {}

                var firstBullet = actBullet.slice(0, i);
                actBullet = actBullet.slice(i+2);

                chatPrint(firstBullet);
                chatPrint(actBullet);
            } else {
                chatPrint(actBullet);
            }
        }

        // Dégager les lignes vides jusqu'à la prochaine ligne non vide
        while (lyricBullets.length && (!lyricBullets[0].trim().length)) {
            lyricBullets.shift();
        }

        lyricsContent = lyricBullets.join("\n");
        GM_setValue("mms_lyricsContent", lyricsContent);
        $("#mms_lyrics").val(lyricsContent);
    });

    // Supprimer la première ligne.
    $("#mms_del").click(function() {
        var lyricBullets = $("#mms_lyrics").val().split("\n");
        lyricBullets.shift();
        lyricsContent = lyricBullets.join("\n");
        GM_setValue("mms_lyricsContent", lyricsContent);
        $("#mms_lyrics").val(lyricsContent);
    });

    var musicLink = "";

    $("#mms_link").click(function() {
        if (musicLink.length) {
            chatPrint("[HRP - Lien musique: " + musicLink + " ]");
        }
        else {
            musicLink = prompt("Veuillez entrer le lien à partager:", "") || "";
        }
    });

    //---------------------------------------------------
    //Ajout d'un item au menu bandeau "Paramètres" de DC
    //---------------------------------------------------
    var $params_menu = $('.menus > .parametres > ul');
    var $mms_start = $('<li />').appendTo($params_menu);
    $mms_start.text("Miku Miku Sing! ♫");
    $mms_start.addClass('link couleur2 separator');
    $mms_start.click(function () {
        $("#mms_box").fadeToggle();
    });

});