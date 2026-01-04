// ==UserScript==
// @name         ƬɌ✯Team Rivality Script
// @namespace    http://tampermonkey.net/
// @version      0.0.1[Beta]
// @description  TeamRivality's Official Theme
// @author       RubyDevilYT
// @require      http://code.jquery.com/jquery-latest.js
// @match        https://agar.io/*
// @icon         https://i.imgur.com/DcZau8B_d.webp?maxwidth=760&fidelity=grand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/425181/%C6%AC%C9%8C%E2%9C%AFTeam%20Rivality%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/425181/%C6%AC%C9%8C%E2%9C%AFTeam%20Rivality%20Script.meta.js
// ==/UserScript==
var $ = window.jQuery;


(function() {
    'use strict';

    // Your code here...

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


    var MassEject_HTML = `<div id="MassEject_box" class="TRoption">  <input type="checkbox" id="Mass_Eject" class="TRinputbox">  <label id="Mass_Eject_label" class="TRlabel">Fast Mass Eject</label>  </div>`
    $(MassEject_HTML).appendTo('#TRoptionbox');

    var Doublesplit_HTML = `<div id="Doublesplit_box" class="TRoption">  <input type="checkbox" id="Doublesplit" class="TRinputbox">  <label id="Doublesplit_label" class="TRlabel">Doublesplit</label>  </div>`
    $(Doublesplit_HTML).appendTo('#TRoptionbox');

    var Tricksplit_HTML = `<div id="Tricksplit_box" class="TRoption">  <input type="checkbox" id="Tricksplit" class="TRinputbox">  <label id="Tricksplit_label" class="TRlabel">Tricksplit</label>  </div>`
    $(Tricksplit_HTML).appendTo('#TRoptionbox');


/*  MassEject.addEventListener('click', function(element) {
        if(element.checked) {
            window.removeEventListener('keydown', keydown_W);
            window.removeEventListener('keyup', keyup_W);
        } else {
            window.addEventListener('keydown', keydown_W);
            window.addEventListener('keyup', keyup_W);
        }
    }
 );*/

}
})();




    //MASS EJECT MACRO START
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

const mass_eject = document.getElementById('Tricksplit');
const doublesplit = document.getElementById('Doublesplit');
const tricksplit = document.getElementById('Tricksplit');

var EjectDown = false;
var speed = 25; //in ms

function keydown(event) {
    if (event.keyCode == 87/* && mass_eject.checked*/) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
    }
    if (event.keyCode == 81/* && doublesplit.checked*/) {
        split();
        setTimeout(split, speed);
    }
    if (event.keyCode == 69/* && tricksplit.checked*/) {
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
        border:    2px solid red;
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
        width:         2.5em;
        height:        2.5em;
        display:       inline-block;
        border-radius: 0.4em;
        outline:       none;
    }
    .TR-open {
        height: 17.5em;
        width:  17.5em;
    }
    #TRoptionbox {
        height:           17.5em;
        width:            15em;
        display:          inline-block;
        position:         absolute;
        background-color: #313131;
        border-radius:    1.5em;
    }
    .TRoption {
        height:           2em;
        width:            85%;
        position:         relative;
        background-color: #484848;
        border-radius:    0.8em;
        margin:           auto;
        margin-top:       0.5em;
        display:          flex;
        align-items:      center;
    }
    .TRinputbox {
        margin:           0.5em;
        size:             200%;
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




    #socialButtons {
        display: none;
    }

    #blocker {
        background: url('https://img.freepik.com/vecteurs-libre/abstrait-ornement-floral_52683-30016.jpg?size=626&ext=jpg') no-repeat center center fixed !important;
        -webkit-background-size: cover !important;
        -moz-background-size: cover !important;
        -o-background-size: cover !important;
        background-size: cover !important;
    }
    #mainui-offers {
        background: url('https://img.freepik.com/vecteurs-libre/abstrait-ornement-floral_52683-30016.jpg?size=626&ext=jpg') no-repeat center center fixed !important;
        -webkit-background-size: cover !important;
        -moz-background-size: cover !important;
        -o-background-size: cover !important;
        background-size: cover !important;
    }
    #mainui-play {
        background: url('https://img.freepik.com/vecteurs-libre/abstrait-ornement-floral_52683-30016.jpg?size=626&ext=jpg') no-repeat center center fixed !important;
        -webkit-background-size: cover !important;
        -moz-background-size: cover !important;
        -o-background-size: cover !important;
        background-size: cover !important;
    }
    #mainui-user {
        background: url('https://img.freepik.com/vecteurs-libre/abstrait-ornement-floral_52683-30016.jpg?size=626&ext=jpg') no-repeat center center fixed !important;
        -webkit-background-size: cover !important;
        -moz-background-size: cover !important;
        -o-background-size: cover !important;
        background-size: cover !important;
    }
    #mainui-features {
        background: url('https://img.freepik.com/vecteurs-libre/abstrait-ornement-floral_52683-30016.jpg?size=626&ext=jpg') no-repeat center center fixed !important;
        -webkit-background-size: cover !important;
        -moz-background-size: cover !important;
        -o-background-size: cover !important;
        background-size: cover !important;
    }
    #mainui-modes {
        background: url('https://img.freepik.com/vecteurs-libre/abstrait-ornement-floral_52683-30016.jpg?size=626&ext=jpg') no-repeat center center fixed !important;
        -webkit-background-size: cover !important;
        -moz-background-size: cover !important;
        -o-background-size: cover !important;
        background-size: cover !important;
    }
    #mainui-party {
        background: url('https://img.freepik.com/vecteurs-libre/abstrait-ornement-floral_52683-30016.jpg?size=626&ext=jpg') no-repeat center center fixed !important;
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

` );