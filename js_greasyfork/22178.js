// ==UserScript==
// @name         MaSt Play Mods Useful And Powerful!
// @namespace    MaSt Play Mods
// @version      0.1
// @description  MODS FOR AGAR & OTHER !
// @author       MaSt
// @match        http://abs0rb.me/*
// @match        http://agar.io/*
// @match        http://agarabi.com/*
// @match        http://agarly.com/*
// @match        http://en.agar.bio/*
// @match        http://agar.pro/*
// @match        http://agar.biz/*
// @match        http://gota.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22178/MaSt%20Play%20Mods%20Useful%20And%20Powerful%21.user.js
// @updateURL https://update.greasyfork.org/scripts/22178/MaSt%20Play%20Mods%20Useful%20And%20Powerful%21.meta.js
// ==/UserScript==
window.onload = function() {                                      //fonction au démarrage
    $("h2").replaceWith('<h2 style="font-family: Ubuntu; font-size: 200%;">MaSt Agar.io</h2>');
    $("h4").replaceWith('<h4 style="font-family: Ubuntu;">Partie</h4>');
    $("title").replaceWith('<title>MaSt Agar.io</title>');
    $("h1").replaceWith('<h1>MaSt Agar.io</h1>');                          //CSS inject finish
    option_show_mass = true;     //options ( ce qui est déja activé sur le site )
    option_skip_stats = true;
    option_dark_theme = false;                     //options finish
    $( "#controller_alert_connected" ).after("<div style='-webkit-filter: saturate(10); -webkit-filter: drop-shadow(19px 19px 20px black); background-color: #000000; -moz-opacity: 0.4; -khtml-opacity: 0.4; opacity: 0.4; filter: alpha(opacity=40); zoom: 1; width: 300px; top: 50px; left: 0px; display: block; position: absolute; text-align: center; font-size: 15px; color: #ffffff; padding: 5px; font-family: Ubuntu;'> <div style='color:#ffffff; display: inline; -moz-opacity:1; -khtml-opacity: 1; opacity:1; filter:alpha(opacity=100); padding: 10px;'><a href='//www.youtube.com/channel/UCDus6QxlKthkN_n0oaEOsOg' target='_blank'>PLAY - Agar.io YT</a></div> <div style='color:#ffffff; display: inline; -moz-opacity:1; -khtml-opacity: 1; opacity:1; filter:alpha(opacity=100); padding: 10px;'><br>Macro Feed: <a>Q</a> </div> <div style='color:#ffffff; display: inline; -moz-opacity:1; -khtml-opacity: 1; opacity:1; filter:alpha(opacity=100); padding: 10px;'><br>Full split: <a>Shift</a></div></div>");
    $( "#controller_alert_connected" ).after("<div style='background: #f3f2f1; height: 5%; width: 100%; top: 0px; bottom: 0px; color: white; position: fixed; margin-bottom: 15px; -webkit-filter: saturate(10); -webkit-filter: drop-shadow(19px 19px 20px black); -moz-opacity: 0.6; -khtml-opacity: 0.6; opacity: 0.6; filter: alpha(opacity=60);'><ul style='padding: 0; margin: 0;'><li style='float: left; list-style: none; display: inline;'><a href='//mastbots.esy.es/' target='_blank' style='line-height: 40px; display: block; padding: 0 10px; font-size: 40px;'>MaSt Bots</a></li><li style='float: left; list-style: none; display: inline;'><a href='//www.youtube.com/c/PLAYAgarioMaStPlay' target='_blank' style='line-height: 40px; display: block; padding: 0 10px; font-size: 40px;'>My YouTube</a></li><li style='float: left; list-style: none; display: inline;'><a href='#' target='_blank' style='line-height: 40px; display: block; padding: 0 10px; font-size: 40px;'>Skins</a></li></ul></div>");
    $( "#tags-container" ).replaceWith("<div><select id='nick' class='form-control' onchange='location = this.options[this.selectedIndex].value;' style='width: 146,5px; color: black; background-color: white;'><option>Other games !</option><option value='//slither.io/'>Slither.io</option><option value='//diep.io/'>Diep.io</option><option value='//limax.io/'>Limax.io</option><option value='//vanar.io/'>Vanar.io</option><option value='//wings.io/'>Wings.io</option></select></div>");
    $( ".agario-promo" ).replaceWith("<div class='agario-promo' style='padding: 0px; width: 293px; height: 366px; position: relative; background-image: url(img/promo_hoc.png);'><iframe src='//discordapp.com/widget?id=199815915926323200&theme=white' width='350' height='500' allowtransparency='true' frameborder='0'></iframe></div>");
    $( "#nick" ).after("<div><select id='nick' class='form-control' onchange='location = this.options[this.selectedIndex].value;' style='float: right; width: 146,5px; color: black; background-color: white;'><option>Server !</option><option value='//agar.io/?ip=mastclan.servehttp.com:443'>MaSt Clan</option><option value='//agar.io/?ip=bubble-wars.tk:443'>Bubble Wars</option></select></div>");
    $( ".diep-cross" ).replaceWith("<div style='opacity: 0; visibility: hidden;'></div>");
    addGlobalStyle("#nick { width:100%; }");
    addGlobalStyle("#gamemode { width:100%; }");
    $( "#adbg" ).replaceWith("<a href='//youtube.com/PLAYAgarioMaStPlay' target='_BLANK'><img src='//static1.squarespace.com/static/501587e5c4aa0c0d03289988/t/530a4774e4b0efed6707af65/1393182581824/youtube_logo_detail.png?format=500w' style='width: 100%; height: 100%;'></img></a>");
    $( "#container" ).replaceWith("<a href='//youtube.com/PLAYAgarioMaStPlay' target='_BLANK'><img src='//static1.squarespace.com/static/501587e5c4aa0c0d03289988/t/530a4774e4b0efed6707af65/1393182581824/youtube_logo_detail.png?format=500w' style='width: 100%; height: 100%;'></img></a>");
};                   //fin de la fonction du démarrage
var SplitInterval;                                        //variables des macros
var MacroInterval;
var SplitDebounce = false;
var MacroDebounce = false;                               //fin des variables
$(document).on('keydown', function(input) {                //fonction et script des macros
    console.log("got keydown");
    if (input.keyCode == 16) {
        if (SplitDebounce) {
            return;
        }
        SplitDebounce = true;
        SplitInterval = setInterval(function() {
            $("body").trigger($.Event("keydown", {
                keyCode: 32
            }));
            $("body").trigger($.Event("keyup", {
                keyCode: 32
            }));
        }, 0);
    } else if (input.keyCode == 81) {
        if (MacroDebounce) {
            return;
        }
        MacroDebounce = true;
        MacroInterval = setInterval(function() {
            $("body").trigger($.Event("keydown", {
                keyCode: 87
            }));
            $("body").trigger($.Event("keyup", {
                keyCode: 87
            }));
        }, 0);
    }
});                                               //fin de la fonction
$(document).on('keyup', function(input) {
    if (input.keyCode == 16) {
        SplitDebounce = false;
        clearInterval(SplitInterval);
        return;
    } else if (input.keyCode == 81) {
        MacroDebounce = false;
        clearInterval(MacroInterval);
        return;
    }
});                                        //fin du script
function afficher_cacher(id)
{
    if(document.getElementById(id).style.visibility=="hidden")
    {
        document.getElementById(id).style.visibility="visible";
        document.getElementById('bouton_'+id).innerHTML='Cacher le texte';
    }
    else
    {
        document.getElementById(id).style.visibility="hidden";
        document.getElementById('bouton_'+id).innerHTML='Afficher le texte';
    }
    return true;
}
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}