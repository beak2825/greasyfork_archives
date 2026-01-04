// ==UserScript==
// @name         ƬɌ✯Team Rivality Theme-Script
// @namespace    http://tampermonkey.net/
// @version      0.0.2[Beta]
// @description  TeamRivality's Official Theme
// @author       RubyDevilYT
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://cdn.jsdelivr.net/npm/@widgetbot/crate@3
// @match        https://agar.io/*
// @icon         https://i.imgur.com/Gq4ByRv.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/425253/%C6%AC%C9%8C%E2%9C%AFTeam%20Rivality%20Theme-Script.user.js
// @updateURL https://update.greasyfork.org/scripts/425253/%C6%AC%C9%8C%E2%9C%AFTeam%20Rivality%20Theme-Script.meta.js
// ==/UserScript==
var $ = window.jQuery;


window.onload = function() {
var mainUI = document.querySelectorAll("[data-v-04522a78]")[6];
var HTMLelement = document.querySelector("body");

    $('#mainui-features').appendTo(mainUI);


    $('<div id="TRsettings" class="TR-settings">  <input type="button" id="TRsettingsbtn" class="TR-settings-btn">  <div id="TRoptionbox"></div>  </div>').appendTo(HTMLelement);
    const TRsettingsbtn = document.getElementById('TRsettingsbtn');
    const TRsettings = document.getElementById('TRsettings');
    TRsettingsbtn.addEventListener('click', (event) => {
        TRsettings.classList.toggle('TR-open');
    }, true);


    $('<div id="settings_titlebox" class="TR-title-box">  <h1 id="settings_title" style="margin: auto; align-self; color:white; font-weight:800; font-size:2em;">✯Settings✯</h1>  </div>').appendTo('#TRoptionbox')

    $('<p style="color:white;font-size:auto;" class="TRlabel">☰</p>').appendTo('#settingsButton')

    var MassEject_HTML = `<div id="MassEject_box" class="TRoption">  <input type="checkbox" id="Mass_Eject" class="TRinputbox">  <label id="Mass_Eject_label" class="TRlabel">Fast Mass Eject</label>  <span id="Mass_Eject_key" class="keybind"> D </span>  </div>`
    $(MassEject_HTML).appendTo('#TRoptionbox');

    var Doublesplit_HTML = `<div id="Doublesplit_box" class="TRoption">  <input type="checkbox" id="Doublesplit" class="TRinputbox">  <label id="Doublesplit_label" class="TRlabel">Doublesplit  </label>  <span id="Doublesplit_key" class="keybind"> W </span>  </div>`
    $(Doublesplit_HTML).appendTo('#TRoptionbox');

    var Tricksplit_HTML = `<div id="Tricksplit_box" class="TRoption">  <input type="checkbox" id="Tricksplit" class="TRinputbox">  <label id="Tricksplit_label" class="TRlabel">Tricksplit</label>  <span id="Tricksplit_key" class="keybind"> E </span>  </div>`
    $(Tricksplit_HTML).appendTo('#TRoptionbox');

    const mass_eject = document.getElementById('Mass_Eject');
    const doublesplit = document.getElementById('Doublesplit');
    const tricksplit = document.getElementById('Tricksplit');
        mass_eject.checked = true;
        doublesplit.checked = true;
        tricksplit.checked = true;


//    var WidgetBot_script = `<script src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3"></script>`;
    var WidgetBot_script_html = ` <script src="https://cdn.jsdelivr.net/npm/@widgetbot/html-embed"></script> `;
//    var WidgetBot = `<script src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3" async defer> new Crate({ server: '299881420891881473', channel: '355719584830980096' })</script>`;
    var WidgetBot_html = ` <widgetbot id="chatbox" server="704129977146409090" channel="830852526207270963" style="height:100%;width:100%;"></widgetbot> `;

    $(WidgetBot_script_html).appendTo('head');
    $(WidgetBot_html).appendTo('#mainui-promo');
//    $(WidgetBot_HTML).appendTo(HTMLelement)


//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var _username = document.getElementById('nick');

    $('#nick').keydown(function(e) {
        var oldvalue = $(this).val();
        var field = this;
        setTimeout(function () {
            if(field.value.indexOf('ƬɌ✯') !== 0 && oldvalue.indexOf('ƬɌ✯') >= 0) {
                $(field).val(oldvalue);
            }
            else if ( field.value.indexOf('ƬɌ✯') !== 0 && !(oldvalue.indexOf('ƬɌ✯') >= 0) ) {
                $(field).val('ƬɌ✯'+oldvalue);
            }
        }, 1);
    });
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



};




    //MASS EJECT MACRO START
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);


var EjectDown = false;
var speed = 25; //in ms

function keydown(event) {
    var mass_eject = $('input#Mass_Eject:checked').length;
    var doublesplit = $('input#Doublesplit:checked').length;
    var tricksplit = $('input#Tricksplit:checked').length;

    if (event.keyCode == 87 && mass_eject==1) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
    }
    if (event.keyCode == 68 && doublesplit==1) {
        split();
        setTimeout(split, speed);
    }
    if (event.keyCode == 69 && tricksplit==1) {
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
        setTimeout(split, speed*3);
    }
}

function keyup(event) {
    if (event.keyCode == 87) { // key W
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        $("body").trigger($.Event("keydown", { keyCode: 87})); //key space
        $("body").trigger($.Event("keyup", { keyCode: 87})); //jquery is required for split to work
        setTimeout(eject, speed);
    }
}

function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32})); //key space
    $("body").trigger($.Event("keyup", { keyCode: 32})); //jquery is required for split to work
}
    //MASS EJECT MACRO END












GM_addStyle ( `

    div { color: white; }

    #title {

    }

    .TR-title-box {
        margin-top: auto;
        margin-right: auto;
        margin-bottom: 1em;
        margin-left: auto;
        height:2em;
        display:flex;
        align-items:center;
    }
    .TR-settings {
        z-index:   99999;
        height:    2.5em;
        width:     2.5em;
        display:   block;
        position:  fixed;
        top:       0.5em;
        left:      0.5em;
        overflow:  hidden;
        transition-property: all;
        transition-duration: 1s;
    }
    .TR-settings-btn {
        width:             2.5em;
        height:            2.5em;
        display:           inline-block;
        border:            none;
        border-radius:     0.4em;
        outline:           none;
        background:        url('https://i.imgur.com/Gq4ByRv.png');
        background-size:   100%;
    }
    .TR-open {
        height: 100%;
        width:  17.5em;
    }
    #TRoptionbox {
        height:           min-content;
        width:            15em;
        display:          inline-block;
        position:         absolute;
        background-color: #17181B;
        border-radius:    1.5em;
        padding-bottom:   0.5em;
    }
    .TRoption {
        height:           2em;
        width:            85%;
        position:         relative;
        background-color: #202124;
        border-radius:    0.8em;
        margin:           auto;
        margin-top:       0.25em;
        margin-bottom:    0.25em;
        display:          flex;
        align-items:      center;
    }
    .keybind {
        background-color: #6ff542;
        color:            #ffffff;
        border-radius:    0.6em;
        height:           1.4em;
        width:            3em;
        margin-right:     0.3em;
        display:          flex;
        align-items:      center;
        justify-content:  center;
    }
    .TRinputbox {
        margin:           0.5em;
    }
    .TRlabel {
        color:            white;
        position:         relative;
        height:           80%;
        width:            80%;
        margin-left:      auto;
        margin-right:     auto;
        display:          flex;
        align-items:      center;
    }


    #settingsButton {
        background: none;
    }
    #nick {
        color: black;
    }
    div.bubble[data-v-0733aa78] {
        display: none;
    }
    #socialButtons {
        display: none;
    }

    #mainui-app {

    }
    #mainui-offers {
        background: url('https://images5.alphacoders.com/101/1010881.jpg') no-repeat center center fixed !important;
        -webkit-background-size: cover !important;
        -moz-background-size: cover !important;
        -o-background-size: cover !important;
        background-size: cover !important;
    }
    #mainui-play {
        background: url('https://images5.alphacoders.com/101/1010881.jpg') no-repeat center center fixed !important;
        -webkit-background-size: cover !important;
        -moz-background-size: cover !important;
        -o-background-size: cover !important;
        background-size: cover !important;
    }
    #mainui-user {
        background: url('https://images5.alphacoders.com/101/1010881.jpg') no-repeat center center fixed !important;
        -webkit-background-size: cover !important;
        -moz-background-size: cover !important;
        -o-background-size: cover !important;
        background-size: cover !important;
    }
    #mainui-features {
        background: url('https://images5.alphacoders.com/101/1010881.jpg') no-repeat center center fixed !important;
        -webkit-background-size: cover !important;
        -moz-background-size: cover !important;
        -o-background-size: cover !important;
        background-size: cover !important;
    }
    #mainui-modes {
        background: url('https://images5.alphacoders.com/101/1010881.jpg') no-repeat center center fixed !important;
        -webkit-background-size: cover !important;
        -moz-background-size: cover !important;
        -o-background-size: cover !important;
        background-size: cover !important;
    }
    #mainui-party {
        background: url('https://images5.alphacoders.com/101/1010881.jpg') no-repeat center center fixed !important;
        -webkit-background-size: cover !important;
        -moz-background-size: cover !important;
        -o-background-size: cover !important;
        background-size: cover !important;
    }
    #blocker {
        background: url('https://images5.alphacoders.com/101/1010881.jpg') no-repeat center center fixed !important;
        -webkit-background-size: cover !important;
        -moz-background-size: cover !important;
        -o-background-size: cover !important;
        background-size: cover !important;
    }

    .currency-container {
        background-color: white;
    }
    .progress-bar-container {
        background-color: white;
    }
    img {
        display: none;
    }

    div.options[data-v-0b8695e7] {
        background-color: #17181B;
        padding: 15px;
        font-size: 16px;
        color: #7d7d7d;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin-top: 10px;
    }
    div.dialog[data-v-0b8695e7] {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 10px;
        background-color: #17181B;
        width: 360px;
        padding: 15px;
        text-align: left;
    }

` );