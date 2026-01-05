// ==UserScript==
// @name         Aryojj
// @namespace    Aryojj
// @version      1.0
// @description  MODS FOR AGAR & OTHER !
// @author       MaSt
// @match        http://agar.io/*
// @match        http://agarly.com/*
// @match        http://gota.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22328/Aryojj.user.js
// @updateURL https://update.greasyfork.org/scripts/22328/Aryojj.meta.js
// ==/UserScript==
window.onload = function() {
    option_show_mass = true;
    option_skip_stats = true;
    $( "#options" ).after("<script>function addGlobalStyle(css) { var head, style; head = document.getElementsByTagName('head')[0]; if (!head) { return; } style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css; head.appendChild(style); }</script>");
    $( "h2" ).replaceWith('<h2 style="font-family: Ubuntu; font-size: 200%;">MaSt Agar.io</h2>');
    $( "h4" ).replaceWith('<h4 style="font-family: Ubuntu;">Partie</h4>');
    $( "title" ).replaceWith('<title>Aryojj</title>');
    $( "h1" ).replaceWith('<h1>Aryojj</h1>');
    $( "#controller_alert_connected" ).after("<img src='http://wallpoper.com/images/00/43/86/42/colored-particles_00438642.jpg' style='opacity: 0.5;' style='-moz-box-shadow: 5px 5px 5px 0px #656565;'>");
    $( "#tags-container" ).replaceWith("<div><select id='nick' class='form-control' onchange='location = this.options[this.selectedIndex].value;' style='margin-top: 18px; width: 146,5px; color: black; background-color: white;'><option disabled selected>Other games !</option><option value='//slither.io/'>Slither.io</option><option value='//diep.io/'>Diep.io</option><option value='//limax.io/'>Limax.io</option><option value='//vanar.io/'>Vanar.io</option><option value='//wings.io/'>Wings.io</option></select></div>");
    $( ".agario-promo" ).replaceWith("<div class='agario-promo' style='padding: 0px; width: 293px; height: 366px; position: relative; background-image: url(img/promo_hoc.png);'><iframe src='//discordapp.com/widget?id=199815915926323200&theme=white' width='350' height='500' allowtransparency='true' frameborder='0' style='border: 1px solid #000;'></iframe></div>");
    $( "#nick" ).after("<div><select id='nick' class='form-control' onchange='location = this.options[this.selectedIndex].value;' style='float: left; width: 146,5px; color: black; background-color: white;'><option disabled selected>Server !</option><option value='//agar.io/?ip=mastclan.servehttp.com:443'>MaSt Clan</option><option value='//agar.io/?ip=bubble-wars.tk:444'>Bubble Wars</option></select></div>");
    $( ".diep-cross" ).replaceWith("<div style='opacity: 0; visibility: hidden;'></div>");
    $( "input#nick.form-control").replaceWith("<input id='nick' class='form-control' placeholder='Speudo' maxlength='' autofocus>");
    $( "#adbg" ).replaceWith("<a href='//youtube.com/PLAYAgarioMaStPlay' target='_BLANK'><img src='//static1.squarespace.com/static/501587e5c4aa0c0d03289988/t/530a4774e4b0efed6707af65/1393182581824/youtube_logo_detail.png?format=500w' style='width: 100%; height: 100%;'></img></a>");
    $( "#container" ).replaceWith("<a href='//youtube.com/PLAYAgarioMaStPlay' target='_BLANK'><img src='//static1.squarespace.com/static/501587e5c4aa0c0d03289988/t/530a4774e4b0efed6707af65/1393182581824/youtube_logo_detail.png?format=500w' style='width: 100%; height: 100%;'></img></a>");
    $( "#canvas" ).after("<img src='https://i.ytimg.com/vi/Wzx75u30flA/maxresdefault.jpg'>");
    $( "#canvas" ).after("<img src='http://wallpoper.com/images/00/43/86/42/colored-particles_00438642.jpg'>");
    $( "#canvas" ).after("<img src='https://d13yacurqjgara.cloudfront.net/users/229857/screenshots/1266412/attachments/173778/particles_beta.png'>");
    $( "span.text-muted" ).after("<span class='text-muted'><span>Press <b>Shift</b> to full split</span><br><span>Press <b>Q</b> to macro feed</span></span>");
    $( "#pre-join-party-btn" ).after("<a href='//youtube.com/c/playagariomastplay' target='_BLANK'><button class='btn btn-primary' style='width: 102.5px; float: left; margin-top: 10px;'>YouTube</button></a>");
    $( "#pre-join-party-btn" ).after("<button class='btn btn-primary' style='width: 102.5px; float: right; margin-top: 10px; opacity: 0.6; cursor: not-allowed;'>Soon...</button>");
    $( ".btn.btn-primary.copy-party-token" ).replaceWith("<a href='//youtube.com/c/playagariomastplay' target='_BLANK'><button class='btn btn-primary copy-party-token' style='float: right; width: 60px;' data-original-title='' title=''>Click</button></a>");
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
    addGlobalStyle("#canvas { opacity: 0.6; } ");
    addGlobalStyle("small.text-muted { visibility: hidden; } ");
    addGlobalStyle(".plugin chrome webkit win x1 Locale_en_US { visibility: hidden; } ");
    addGlobalStyle(".btn-warning.disabled, .btn-warning.disabled.active, .btn-warning.disabled.focus, .btn-warning.disabled:active, .btn-warning.disabled:focus, .btn-warning.disabled:hover, .btn-warning[disabled], .btn-warning[disabled].active, .btn-warning[disabled].focus, .btn-warning[disabled]:active, .btn-warning[disabled]:focus, .btn-warning[disabled]:hover, fieldset[disabled] .btn-warning, fieldset[disabled] .btn-warning.active, fieldset[disabled] .btn-warning.focus, fieldset[disabled] .btn-warning:active, fieldset[disabled] .btn-warning:focus, fieldset[disabled] .btn-warning { border-color: #000; cursor: not-allowed; opacity: 0.6; } ");
    addGlobalStyle(".btn-warning.disabled, .btn-warning.disabled.active, .btn-warning.disabled.focus, .btn-warning.disabled:active, .btn-warning.disabled:focus, .btn-warning.disabled:hover, .btn-warning[disabled], .btn-warning[disabled].active, .btn-warning[disabled].focus, .btn-warning[disabled]:active, .btn-warning[disabled]:focus, .btn-warning[disabled]:hover, fieldset[disabled] .btn-warning, fieldset[disabled] .btn-warning.active, fieldset[disabled] .btn-warning.focus, fieldset[disabled] .btn-warning:active, fieldset[disabled] .btn-warning:focus, fieldset[disabled] .btn-warning { border-color: #000; cursor: not-allowed; opacity: 0.4; } ");
    addGlobalStyle("input#nick:focus { border: 3px solid #555; width: 100%; background-color: #6A6868; transform: translateY(4px); color: #fff; } ");
    addGlobalStyle(".btn:active { background-color: #3e8e41; box-shadow: 0 5px #666; transform: translateY(4px); } ");
    addGlobalStyle(".agario-panel.agario-side-panel.agario-party-2 { height: 195px; } ");
    addGlobalStyle(".agario-panel.agario-side-panel.agario-party-6 { height: 195px; } ");
    addGlobalStyle(".agario-panel.agario-side-panel.agario-party-0 { height: 195px; } ");
};
var SplitInterval;
var MacroInterval;
var SplitDebounce = false;
var MacroDebounce = false;
$(document).on('keydown', function(input) {
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
});
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