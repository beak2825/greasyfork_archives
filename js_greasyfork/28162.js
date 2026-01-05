// ==UserScript==
// @name         Happyfor.win - By - RDC-agario
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  hack ,Tricksplit , doblesplit , etc
// @author       RDC y WERNER
// @icon         https://yt3.ggpht.com/-_3mXLLjZmXA/AAAAAAAAAAI/AAAAAAAAAAA/n0AfuhvZe3o/s100-c-k-no-mo-rj-c0xffffff/photo.jpg
// @match        http://agar.io/*
// @match        http://happyfor.win/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/28162/Happyforwin%20-%20By%20-%20RDC-agario.user.js
// @updateURL https://update.greasyfork.org/scripts/28162/Happyforwin%20-%20By%20-%20RDC-agario.meta.js
// ==/UserScript==

//replaces title
//h2 selects all h2 elements
$("h2").replaceWith('<h4>iRanD RDC</h4>');

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

//List instructions
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_w'>  <code>▁▂▃▄▅▆▇█▇▆▅▄▃▂▁<code> </span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_w'> <code>|</code>Para tirara masa <code>(W)</code> y <code>(Q)</code> <code>|</code><code>|</code>para Doblesplit <code>(D)</code> <code>|</code><code>|</code>para Split de 16 <code>(T)</code> <code>|</code><code>|</code>Para TrickSplit <code>(A)</code> <code>|</code><code>|</code>Para Split de 11 <code>(S)</code> <code>|</code><code>|</code>Para hacer LineSplit presionar <code>(V)</code> o <code>(H)</code> Y luego separarse <code>|</code> </span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_w'> - <code>▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀<code> </span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> <button>Creador <a><a href='https://www.youtube.com/channel/UCFf1_gRuGId63rDrAHubeqg' target='_blank' >iRanD RDC </button></span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> <button>Unete -> <a><a href='https://www.facebook.com/groups/335947826747210/' target='_blank' >Clan 【ЯÐĊ】 </button></span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> <dialog>Unete -> <a><a href='https://www.facebook.com/groups/335947826747210/' target='_blank' >Clan 【ЯÐĊ】 </dialog></span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> <button> <a><a href='http://www.liveonlineradio.net/usa/nightcore-radio.htm' target='_blank' >Radio Nightcore </dialog></span></span></center>";

//Auto-enable show mass/skip stats
//IMPORTANT: You must uncheck showmass/skip stats first then recheck them for it to auto save every time
function autoSet() {
    if (document.getElementById("overlays").style.display!="none") {
        document.getElementById("settings").style.display = "block";
        //Show mass
        if (document.getElementById('showMass').checked) {
            document.getElementById('showMass').click();
        }   document.getElementById('showMass').click();
        //Skip stats
        if (document.getElementById('skipStats').checked) {
            document.getElementById('skipStats').click();
        }   document.getElementById('skipStats').click();
    } else {setTimeout(autoSet, 100);}
}


//Load macros
var canFeed = false;
function keydown(event) {
    switch (event.keyCode) {
        case 87: //Feeding Macro (w)
            canFeed = true;
            feed();
            break;
        case 81: //Feeding Macro (q)
            canFeed = true;
            feed();
            break;
        case 84: //Tricksplit Macro (t)
            var t = 35;
            for (var t2 = 0; t2 < 4; t2++) {
                setTimeout(split, t);
                t *= 2;
            }
            break;
        case 69: //Tricksplit Macro (e)
            var e = 35;
            for (var e2 = 0; e2 < 4; e2++) {
                setTimeout(split, e);
                e *= 2;
            }
            break;
        case 52: //Tricksplit Macro (4)
            var four = 35;
            for (var four2 = 0; four2 < 4; four2++) {
                setTimeout(split, four);
                four *= 2;
            }
            break;
        case 65: //Triplesplit Macro (a)
            var a = 35;
            for (var a2 = 0; a2 < 3; a2++) {
                setTimeout(split, a);
                a *= 2;
            }
            break;
        case 51: //Triplesplit Macro (3)
            var three = 35;
            for (var three2 = 0; three2 < 3; three2++) {
                setTimeout(split, three);
                three *= 2;
            }
            break;
        case 68: //Doublesplit Macro (d)
            split();
            setTimeout(split, 50);
            break;
        case 50: //Doublesplit Macro (2)
            split();
            setTimeout(split, 50);
            break;
        case 83: //Space Macro (s)
            split();
            break;
        case 49: //Space Macro (1)
            split();
            break;
        case 72: //Horizontal linesplit (h)
            X = window.innerWidth / 2;
            Y = window.innerHeight / 2;
            $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
            break;
        case 86: //Vertical linesplit (v)
            X = window.innerWidth / 2;
            Y = window.innerHeight / 2.006;
            $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
            break;
    }
}

//When a player lets go of Q or W, stop feeding
function keyup(event) {
    if (event.keyCode == 87 || event.keyCode == 81) canFeed = false;
}

//Alias for W key
function feed() {
    if (canFeed) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(feed, 0);
    }
}

//Alias for space
function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));

}
 
function inicio() {
    document.title = "RDC :)";
    modificarTextoLeaderboard("RDC");
    modificarCanalYoutube("GRDC", "");
    modificarFooter("rdc", "");

}
 
function modificarTextoLeaderboard(titulo) {
    var texto = $("h4.main-color").text();
    if (texto === "ogario.ovh") {
        $("h4.main-color").text(titulo);
    }
 
    // Cambia el leaderboard
    $("h4.main-color").on('DOMSubtreeModified', function() {
        var texto = $(this).text();
        if (texto !== "Leaderboard") {
            $(this).text(titulo);
        }
    });
}
 
function modificarCanalYoutube(titulo, ID) {
    $(".ogario-yt-panel").remove();
    $("#profile").append('<div class="agario-panel ogario-yt-panel"></div>');
    $(".ogario-yt-panel").append('<h5 class="main-color">' + titulo + '</h5>');
    $(".ogario-yt-panel").append(
        '<center><div class="g-ytsubscribe" data-channelid="' + ID + '" data-layout="full" data-theme="dark" data-count="default"></div></center>');
    $(".ogario-yt-panel").insertBefore(".radio-panel");
}
 
function modificarFooter(texto, URL) {
    if (texto === undefined) {
        $("#menu-footer-v").hide();
    } else {
        if (URL === undefined) {
            $("#menu-footer-v").text(texto);
        } else {
            $("#menu-footer-v").html('<a href="' + URL + '" target="_blank">' + texto + '</a>');
        }
    }
}