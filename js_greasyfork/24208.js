// ==UserScript==
// @name         AED Private
// @namespace    Agar Extension DD
// @version      0.3
// @description  G - Double Split -|- T - 16 Split -|- E - Feed
// @author       Inker-Denmed-Atex
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/24208/AED%20Private.user.js
// @updateURL https://update.greasyfork.org/scripts/24208/AED%20Private.meta.js
// ==/UserScript==
window.onload = function() {
    option_show_mass = true;
    option_skip_stats = true;
    $( "head" ).append("<script>function addGlobalStyle(css) { var head, style; head = document.getElementsByTagName('head')[0]; if (!head) { return; } style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css; head.appendChild(style); }</script>");
    $( "head" ).append('<script>function mc_clan() { var div = document.getElementById(""); if(div.style.display=="none") { div.style.display = "block"; bouton.innerHTML = "-"; } else { div.style.display = "none"; bouton.innerHTML = "+"; } }</script>');
    $( "h2" ).replaceWith('<h2 style="font-family: Ubuntu; font-size: 200%;">AED--Plus</h2>');
    $( "h4" ).replaceWith('<h4 style="font-family: Ubuntu;">Partie</h4>');
    $( "title" ).replaceWith('<title>AED--Plus</title>');
    $( "h1" ).replaceWith('<h1>AED--Plus</h1>');
    $( "input#nick.form-control" ).before('<h3 align="center" style="float: right; text-align: center; margin-top: 0px; margin-right: 25px; font-family: Ubuntu;">Clan</h3><h4 style="float: right; margin-top: 15px; margin-right: 5px; margin-top: 25px; margin-bottom: 5px; visibility: hidden;">Soon...</h4>');
    $( "select#gamemode" ).after("<input class='form-control' id='clan' placeholder='Clan Tag' maxlength='10' autofocus style='width: 30%; float: right;'>");
    $( "#tags-container" ).replaceWith("<div><select id='nick' class='form-control' onchange='location = this.options[this.selectedIndex].value;' style='margin-top: 18px; width: 100%; color: black; background-color: white;'><option disabled selected>-- Other games --</option><option value='//slither.io/'>Slither.io</option><option value='//diep.io/'>Diep.io</option><option value='//limax.io/'>Limax.io</option><option value='//vanar.io/'>Vanar.io</option><option value='//wings.io/'>Wings.io</option></select></div>");
    $( ".diep-cross" ).replaceWith("<div style='opacity: 0; visibility: hidden;'></div>");
    $( "input#nick.form-control").replaceWith("<input id='nick' class='form-control' placeholder='Nombre' maxlength='' autofocus>");
    $( "#adbg" ).replaceWith("<a href='//youtube.com/channel/UCf723zWlsRz3oXz96iuvAVg' target='_BLANK'><img src='//static1.squarespace.com/static/501587e5c4aa0c0d03289988/t/530a4774e4b0efed6707af65/1393182581824/youtube_logo_detail.png?format=500w' style='width: 100%; height: 100%;'></img></a>");
    $( "#container" ).replaceWith("<a href='//youtube.com/channel/UCf723zWlsRz3oXz96iuvAVg' target='_BLANK'><img src='//static1.squarespace.com/static/501587e5c4aa0c0d03289988/t/530a4774e4b0efed6707af65/1393182581824/youtube_logo_detail.png?format=500w' style='width: 100%; height: 100%;'></img></a>");
    $( "span.text-muted" ).after("<span class='text-muted'><span>Press <b>T</b> to full split</span><br><span>Press <b>E</b> to macro feed</span></span>");
    $( "#pre-join-party-btn" ).after("<a href='//youtube.com/channel/UCf723zWlsRz3oXz96iuvAVg' target='_BLANK'><button class='btn btn-primary' style='width: 102.5px; float: left; margin-top: 10px;'>YouTube</button></a>");
    $( "#pre-join-party-btn" ).after("<a href='//leij.typeform.com/to/ZWw8tN' target='_blank'><button id='mcjoin' class='btn btn-primary' onclick='' style='width: 102.5px; float: right; margin-top: 10px;'>Join MC !</button></a>");
    $( "#options").append("<label><input type='checkbox' onclick='MC.showFreeCoins (100,1,100);'><span>Free Coins</span></label><label><input type='checkbox'><label><input type='checkbox' id='fakeBan' onclick='MC.onPlayerBanned (100,1,100)' style='float: left;'><span>Fake BAN</span></label><label><input type='checkbox' id='fakeLvl' onclick='MC.showLevelUp (100,1,100)' style='float: left;'><span>Fake Level Up</span></label><label><input type='checkbox' onclick='MC.openShop (100,1,100)' style='float: left;'><span>Open Shop</span></label>");
    $( "#gamemode" ).replaceWith('<select id="gamemode" class="form-control" onchange="MC.setGameMode($(this).val());" required=""><option disabled selected>-- Gamemodes --</option><option value="" data-itr="page_gamemode_ffa">FFA</option><option value=":teams" data-itr="page_gamemode_teams">Teams</option><option value=":experimental" data-itr="page_gamemode_experimental">Experimental</option><option value=":party" data-itr="page_party">Party</option></select>');
    addGlobalStyle("div#advertisement.agario-panel { visibility: hidden; } ");
    addGlobalStyle("#nick { width: 65%; margin-bottom: 5px; float: left; }");
    addGlobalStyle("#gamemode { width: 65%; float: left; }");
    addGlobalStyle(".form-control { border: 1px solid #000; background-color: #fff; color: #000; border-radius: 0px; transition: width 0.4s ease-in-out; } ");
    addGlobalStyle(".btn-success { border: 1px solid #000; background-color: #fff; color: #000; transition-duration: 0.4s; } ");
    addGlobalStyle(".btn-login-play { border: 1px solid #000; background-color: #fff; color: #000; transition-duration: 0.4s; } ");
    addGlobalStyle(".btn-info { border: 1px solid #000; background-color: #fff; color: #000; border-radius: 0px; transition-duration: 0.4s; } ");
    addGlobalStyle(".btn-shop, .btn-shop:active, .btn-shop:disabled { border: 1px solid #000; background-color: #fff; color: #000; transition-duration: 0.4s; } ");
    addGlobalStyle(".btn-warning { border: 1px solid #000; background-color: #fff; color: #000; transition-duration: 0.4s; } ");
    addGlobalStyle(".btn-primary { border: 1px solid #000; background-color: #fff; color: #000; border-radius: 0px; transition-duration: 0.4s; } ");
    addGlobalStyle(".btn-danger { border: 1px solid #000; background-color: #fff; color: #000; transition-duration: 0.4s; } ");
    addGlobalStyle(".btn { border-radius: 0px; box-shadow: 0 9px #999; } ");
    addGlobalStyle(".agario-panel { border-radius: 0px; } ");
    addGlobalStyle(".tosBox.right { border-radius: 0px; border: 1px solid #000; } ");
    addGlobalStyle(".tosBox.left { border-radius: 0px; border: 1px solid #000; } ");
    addGlobalStyle("small.text-muted { visibility: hidden; } ");
    addGlobalStyle(".plugin chrome webkit win x1 Locale_en_US { visibility: hidden; } ");
    addGlobalStyle(".btn-warning.disabled, .btn-warning.disabled.active, .btn-warning.disabled.focus, .btn-warning.disabled:active, .btn-warning.disabled:focus, .btn-warning.disabled:hover, .btn-warning[disabled], .btn-warning[disabled].active, .btn-warning[disabled].focus, .btn-warning[disabled]:active, .btn-warning[disabled]:focus, .btn-warning[disabled]:hover, fieldset[disabled] .btn-warning, fieldset[disabled] .btn-warning.active, fieldset[disabled] .btn-warning.focus, fieldset[disabled] .btn-warning:active, fieldset[disabled] .btn-warning:focus, fieldset[disabled] .btn-warning { border-color: #000; cursor: not-allowed; opacity: 0.6; } ");
    addGlobalStyle(".btn-warning.disabled, .btn-warning.disabled.active, .btn-warning.disabled.focus, .btn-warning.disabled:active, .btn-warning.disabled:focus, .btn-warning.disabled:hover, .btn-warning[disabled], .btn-warning[disabled].active, .btn-warning[disabled].focus, .btn-warning[disabled]:active, .btn-warning[disabled]:focus, .btn-warning[disabled]:hover, fieldset[disabled] .btn-warning, fieldset[disabled] .btn-warning.active, fieldset[disabled] .btn-warning.focus, fieldset[disabled] .btn-warning:active, fieldset[disabled] .btn-warning:focus, fieldset[disabled] .btn-warning { border-color: #000; cursor: not-allowed; opacity: 0.4; } ");
    //addGlobalStyle("input#nick:focus { border: 3px solid #555; background-color: #6A6868; color: #fff; width: 100%; } ");
    addGlobalStyle(".btn:active { background-color: #3e8e41; box-shadow: 0 5px #666; transform: translateY(4px); } ");
    addGlobalStyle(".agario-panel.agario-side-panel.agario-party-2 { height: 195px; } ");
    addGlobalStyle(".agario-panel.agario-side-panel.agario-party-6 { height: 195px; } ");
    addGlobalStyle(".agario-panel.agario-side-panel.agario-party-0 { height: 195px; } ");
    addGlobalStyle(".opts { margin-left: -20px; position: absolute; width: 13px; height: 13px; } ");
    addGlobalStyle(".us-elections { visibility: hidden; } ");
    addGlobalStyle(".checkbox label, .radio label { font-weight: 700; } ");
};
var SplitInterval;
var MacroInterval;
var SplitDebounce = false;
var MacroDebounce = false;
$(document).on('keydown', function(input) {
    console.log("got keydown");
    if (input.keyCode == 84) {
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
    } else if (input.keyCode == 69) {
        if (MacroDebounce) {
            return;
        }
        MacroDebounce = true;
        MacroInterval = setInterval(function() {
            $("body").trigger($.Event("keydown", {
                keyCode: 69
            }));
            $("body").trigger($.Event("keyup", {
                keyCode: 69
            }));
        }, 0);
    }
});
$(document).on('keyup', function(input) {
    if (input.keyCode == 16) {
        SplitDebounce = false;
        clearInterval(SplitInterval);
        return;
    } else if (input.keyCode == 69) {
        MacroDebounce = false;
        clearInterval(MacroInterval);
        return;
    }
});
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}