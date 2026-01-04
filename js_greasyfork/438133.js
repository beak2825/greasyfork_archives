// ==UserScript==
// @name         K12 Dark Mode Remastered
// @namespace    https://greasyfork.org/en/scripts/438133-k12-dark-mode-remastered
// @version      3.21
// @description  THIS SCRIPT IS A WORK IN PROGRESS. Many features/looks are subject to change. Allows for full customization of the K12 Pages, including custom background images, fonts, styles, and more! Press TAB to open the customization menu.
// @author       Chase Davis
// @match        *://*.k12.com/*
// @match        *://*.brightspace.com/*
// @match        *://*.api.brightspace.com/*
// @icon         https://www.google.com/s2/favicons?domain=k12.com
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document.start
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/438133/K12%20Dark%20Mode%20Remastered.user.js
// @updateURL https://update.greasyfork.org/scripts/438133/K12%20Dark%20Mode%20Remastered.meta.js
// ==/UserScript==

(function() {
    'use strict';
jQuery(function($) {
let first = GM_getValue('firsttime?');// Get the values from storage
//let first = undefined;
let pst = GM_getValue('preset');
let bg = GM_getValue('background');
let bg2 = GM_getValue('background2');
let acc = GM_getValue('accent');
let txt = GM_getValue('textcolor');
let img = GM_getValue('image');
let fnt = GM_getValue('font');
let inv = GM_getValue('invertImages');
//let customFont = GM_getValue('useCustomFont');
let invCheck = ''
//let customFontCheck = ''

var i; // Define some vars to be used later on
var ch;
var fon
var invertAmt;

// Log values for debug purposes
console.log('Display Vars\n\nPreset: '+pst+'\nBackground: '+bg+'\nBackground 2: '+bg2+'\nAccent: '+acc+'\nText Color: '+txt+'\nBackground Image: '+img+'\nInvert Images: '+inv)



// Create menu HTML
let preselect = ["","","","","",""]; // A very odd way to preselect the dropdown
preselect[pst] = " selected "
//let fontselect = ["","","","",""]
//fontselect[fnt] = " selected "
if (inv) { // Preselect the Invert Images checkbox
    let invCheck = ' checked ';
}


// Define the HTML to be injected into the site
let menu = `
<div class="menuItem" id="menuBlock" style="display: none; width: 100%; height: 100%; background-color: #00000090 !important; z-index: 9998;">



    <div class="menuItem" id="menuMain" style="overflow: auto; text-align: center; padding: 16px; border-radius: 16px; left: 5%; top: 5%; display: none; width: 90%; height: 90%; z-index: 9999;">
        <h1 class="menuText" style="margin: auto; padding: 10px; width: fit-content; border-radius: 8px;">K12 Dark Mode Customization Menu</h1><hr><br>



    <div id="mainWrapper" style="background-color: #00000000 !important; display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: space-between; align-items: flex-start;">

        <div class="menuItem" id="themeSelect" style="text-align: center; padding: 8px; border-radius: 8px; display: none; width: 20%; height: fit-content; position: relative;">
            <h2 class="menuText">Theme</h2><hr>
                Preset:
                <select id="themebox" class="menuDialog" style="width: 100%; height: 20%;">
                    <option value="0"`+preselect[0]+`>Dark</option>
                    <option value="1"`+preselect[1]+`>Extra Dark</option>
                    <option value="2"`+preselect[2]+`>Light</option>
                    <option value="3"`+preselect[3]+`>True Blue</option>
                    <option value="4"`+preselect[4]+`>Contrast</option>
                    <option value="5"`+preselect[5]+`>Custom</option>
                </select><hr>
                Background Image:
                <input id="img" class="menuDialog" style="width: 100%" value=`+img+`></input><br>
                Background:
                <input id="bg" class="menuDialog" style="width: 100%" value=`+bg+`></input><br>
                Secondary:
                <input id="bg2" class="menuDialog" style="width: 100%" value=`+bg2+`></input><br>
                Accent:
                <input id="acc" class="menuDialog" style="width: 100%" value=`+acc+`></input><br>
                Text Color:
                <input id="txt" class="menuDialog" style="width: 100%" value=`+txt+`></input><br>
            </div>



        <div id="middleBox">
        </div>



        <div class="menuItem" id="options" style="text-align: center; padding: 8px; border-radius: 8px; display: inline-block; width: 20%; height: fit-content; position: relative;">
            <h2 class="menuText">Options</h2><hr>

                Invert Images
                <input checked=`+inv+` type="checkbox" id="invert" value=`+inv+`></input><br>



            <hr><a href="https://discord.gg/xVsjWrK5cF" id="discord"
                <div class="menuItem" id="discordPromo" style="margin: auto; text-align: center; padding: 8px; border-radius: 8px; display: inline-block; max-width: 90%; width: 90%; height: fit-content; position: relative; background-position: center center; background-size: cover; background-image: url(https://i.ibb.co/cYzspHH/backdrop.png);">
                <div id="filter" style="padding: 3px; max-width: 95%; width: 95%; height: 100%; border-radius: 8px;">
                    <b style="background-color: #00000000 !important;">Join our Discord & chat with other students from IDVA!</b>
                </div>
            </div></a>

        </div>



    </div>
</div>
`;



// Define Functions
function setup() {// This will only be run once, it defines all the variables so the first time you load it the colors aren't 'undefined'

        alert('Welcome to K12 Dark Mode! Press Tab to bring up the new menu! \n\nRefresh the page to activate the script.');
        GM_setValue('firsttime?',false);// Set the firsttime variable to false, so this doesnt execute again accidentally

        let pst = 0 // Set all the values to default
        GM_setValue('preset',pst);
        let bg = '#202020';
        GM_setValue('background',bg);
        let bg2 = '#404040';
        GM_setValue('background2',bg2);
        let acc = '#004674';
        GM_setValue('accent',acc);
        let txt = '#b0b0b0';
        GM_setValue('textcolor',txt);
        let img = 'https://parade.com/wp-content/uploads/2021/11/new-year-wishes.jpg';
        GM_setValue('image',img);
        let fnt = 1;
        GM_setValue('font',fnt);
        let inv = 1
        GM_setValue('invertImages',inv);
        let customFont = 0
        GM_setValue('useCustomFont',customFont);

};

function makeCSS(background, background2, accent, textcolor, image, font, invert) {// Define the CSS for injection
    console.log('Updated CSS')
    let css = `
    <style id="K12DMR_CSS">

        *:not(span) {
            background-color: `+background+` !important;
            `+/*fon+*/`
            color: `+textcolor+` !important;
            transition: background-color 1s ease;
        }

        th {
            background-color: `+background+` !important;
        }

        @keyframes fadeIn {
            0% {opacity:0;}
            100% {opacity:1;}
        }

        .menuItem {
            animation: fadeIn 1s;
            font-family: `+font+` !important;
            color: `+textcolor+` !important;
            position: fixed;
            transition: background-color 1s ease;
            background-color: `+background2+` !important;
            box-shadow: 3px 3px 10px 1px #000000;
        }

        .menuDialog {
            background-color: `+background+` !important;
            display: block
        }

        .menuText {
            font-family: `+font+` !important;
            color: `+textcolor+` !important;
            background-color: `+background2+` !important;
            box-shadow: inset 2px 2px 5px 1px #000000;
            border-radius: 8px;
            padding: 3px;
        }

        #menuMain {
            background: linear-gradient(180deg, `+background+`, `+accent+`)
        }

        #filter {
            background-color: `+background+`b0 !important;
        }

        #discordPromo {
            box-shadow: inset 0px 0px 8px 5px `+background2+`;
        }

        .spacer {
            background-color: `+background+` !important;
            padding: 6px;
            border-radius: 8px;
        }

        #side-nav {
            background: linear-gradient(180deg, `+background+` 10%, `+accent+`)
        }

        #side-nav * {
            background-color: #00000000 !important;
        }

        #content-area {
            background-color: #00000000 !important;
        }

        #wallpaper {
            background: url(`+image+`) !important;
            background-size: cover !important;
            background-position: center center !important;
            z-index: 0 !important;
        }

        .d2l-image-banner-overlay {
            background-image: url(`+image+`) !important;
            background-size: cover !important;
            background-position: center center !important;
        }

        #background-chooser {
            display: none !important;
        }

        .credit-photo {
            display: none !important;
        }

        .cards-container {
            background-color: #00000000 !important;
        }

        .grid-sizer {
            background-color: #00000000 !important;
        }

        .item {
            background: linear-gradient(180deg, `+background+`, `+background2+`);
            border-radius: 12px;
            border: 4px solid `+accent+`;
        }

        .item * {
            background-color: #00000000 !important;
        }

        .card-info {
            background-color: `+background2+` !important;
        }


        .grade {
            background-color: `+background+` !important;
        }

        .component-group {
            background-color: #00000000 !important;
        }

        .widget-panel {
            border: 4px solid `+accent+` !important;
        }

        #components {
            background-color: #00000000 !important;
        }

        [id*="sidebar-nav-item"] {
            border-top: 1px solid `+accent+` !important;
            border-bottom: 1px solid `+accent+` !important;
        }

        .goto {
            background-color: `+accent+` !important;
        }

        .d2l-navigation-s-main-wrapper * {
            background-color: `+accent+` !important;
        }

        .d2l-navigation-s-main-wrapper {
            background-color: `+accent+` !important;
        }

        .d2l-branding-navigation-background-color {
            background-color: `+accent+` !important;
        }

        .d2l-widget {
            background-color: `+background2+` !important;
        }

        .d2l-widget * {
            background-color: `+background2+` !important;
        }

        .d2l-collapsepane-header {
            background: none !important;
        }

        .d2l-box {
            background: none !important;
        }

        .d2l-twopanelselector-side {
            background: linear-gradient(315deg, `+background+`, `+accent+`) !important;
        }

        .d2l-twopanelselector-side * {
            background: none !important;
        }

        .d2l-input-focus {
            background: `+background2+` !important;
        }

        .d2l-twopanelselector-main {
            background: `+background2+` !important;
        }

        .d2l-twopanelselector-main * {
            background: none !important;
        }

        img {
            filter: invert(`+invert+`) !important;
        }

        .form-container {
            background: `+background2+` !important;
        }

        .form-container * {
            background: none !important;
        }

        .btn {
            background: linear-gradient(315deg, `+background+`, `+accent+`) !important;
            border: 4px solid `+accent+` !important;
        }

        .form-control {
            background-color: `+background+` !important;
            border: 4px solid `+accent+` !important;
        }

        #logo-container * {
            filter: invert(0) !important;
        }

        .icon {
            background-color: #00000000 !important;
            color: `+textcolor+` !important;
        }

        .link-text {
            background-color: #00000000 !important;
            color: `+textcolor+` !important;
        }

        a:not(#discord) {
            background: linear-gradient(315deg, `+background+`, `+accent+`) !important;
            border: 2px solid `+accent+` !important;
            border-radius: 8px;
            padding: 2px;
        }

        a * {
            background: none !important;
        }

        td {
            background: url(http://justfunfacts.com/wp-content/uploads/2021/03/black.jpg)
        }

        th {
            background: url(http://justfunfacts.com/wp-content/uploads/2021/03/black.jpg)
        }

    </style>
    `;

    if (document.getElementById('K12DMR_CSS') == undefined) {// If the css doesnt exist in the page yet
        $('head').append(css);// Inject css
    } else {
        $('#K12DMR_CSS').remove();// Otherwise remove it
        $('head').append(css);// And add it again, so the colors are up-to-date
    }

    /*try {
        let divs = document.querySelectorAll('td');

        for (i=0; i<divs.length; i++) {
            divs[i].style.background = "url(http://justfunfacts.com/wp-content/uploads/2021/03/black.jpg)";
        }
    } catch(err){console.log(err)}*/

};

function toggleMenu() {
    if (document.getElementById('menuBlock').style.display == 'none') {//If the menu is currently hidden
        console.log('toggle menu on');// Log the menu toggle, for debugging
        let divs = $('.menuItem')// Get all elements that belong to the menu
        for (i = 0; i<divs.length; i++) {// For each of those elements
             divs[i].style.display = 'block';// Turn its display on to make it visible
        }
    } else {// If the menu is currently on,
        console.log('toggle menu off');// Log the menu toggle, for debugging
        let divs = $('.menuItem');// Get all elements that belong to the menu
        for (i = 0; i<divs.length; i++) {// For each of those elements
             divs[i].style.display = 'none';// Turn its display off to make it invisible
        }
    }
};

function onKeyDown(evt) { // When a key, any key is pressed
    if (evt.keyCode == 9) { // Every key has a key code, the code for Tab is 9
        toggleMenu(); // Toggle the menu
    }
    if (evt.keyCode == 81) { // This is the keycode for Q, dont press this, it triggers the setup. This will eventually be removed.
        setup();
        console.log('setup triggered')
    }
}
document.addEventListener('keydown', onKeyDown, true); // This adds the sensor for detecting key presses



// Now do the things
$('body').append(menu); // Inject the menu HTML
if (first == undefined) {setup()} else { // If this is the first time being used, trigger setup
makeCSS(bg, bg2, acc, txt, img, fnt);// Otherwise inject CSS like usual
};



// Menu sensory

// Theme selector
document.querySelector('#themebox').addEventListener('change', (event) => {// When preset theme changes
    let ch = document.querySelector('#themebox').value // Get the value of selector
    ch = parseInt(ch) // Turn it into a number

    let bgs = ["#202020", "#000000", "#fdfdfd", "#303940", "#000000", bg];// Colors for presets
    let bg2s = ["#404040", "#202020", "#d0d0d0", "#505960", "#404040", bg2];
    let accs = ["#004674", "#004674", "#83bade", "#004684", "#606060", acc];
    let txts = ["#b0b0b0", "#c0c0c0", "#404040", "#a0a0b0", "#cfcf2a", txt];

    pst = ch // Set all the colors to their corresponding theme
    GM_setValue('preset',pst);
    bg = bgs[ch]
    GM_setValue('background',bg);
    bg2 = bg2s[ch]
    GM_setValue('background2',bg2);
    acc = accs[ch]
    GM_setValue('accent',acc);
    txt = txts[ch]
    GM_setValue('textcolor',txt);
    makeCSS(bg, bg2, acc, txt, img, fnt);

    document.querySelector('#bg').value = bg;// Change all the input boxes to said color
    document.querySelector('#bg2').value = bg2;
    document.querySelector('#acc').value = acc;
    document.querySelector('#txt').value = txt;

    console.log('Theme changed to '+['Dark','Extra Dark','Light','True Blue','Contrast','Custom'][ch])// Log the theme change
    console.log('Display Vars\n\nPreset: '+pst+'\nBackground: '+bg+'\nBackground 2: '+bg2+'\nAccent: '+acc+'\nText Color: '+txt+'\nBackground Image: '+img+'\nFont: '+fnt)
    // And log the rest of the values

});

// Font selector, removed for now.
/*document.querySelector('#fnt').addEventListener('change', (event) => {
    let ch = document.querySelector('#fnt').value
    ch = parseInt(ch)

    let fnts = ["arial","monospace","cursive","fantasy","'ng-icons'"];// Fonts

    fnt = fnts[ch]
    GM_setValue('font',fnt);
    makeCSS(bg, bg2, acc, txt, img, fnt);
    console.log('Font changed to '+["arial","monospace","cursive","fantasy","'ng-icons'"][ch])
    console.log('Display Vars\n\nPreset: '+pst+'\nBackground: '+bg+'\nBackground 2: '+bg2+'\nAccent: '+acc+'\nText Color: '+txt+'\nBackground Image: '+img+'\nFont: '+fnt)

});*/

// Background Image input
document.querySelector('#img').addEventListener('change', (event) => { // When the text changed
    let val = document.querySelector('#img').value // Get its value

    img = val // Set the img variable to its value
    GM_setValue('image',img); // Store the value
    makeCSS(bg, bg2, acc, txt, img, fnt); // And update the CSS
    console.log('Background Image changed to '+val)
    console.log('Display Vars\n\nPreset: '+pst+'\nBackground: '+bg+'\nBackground 2: '+bg2+'\nAccent: '+acc+'\nText Color: '+txt+'\nBackground Image: '+img+'\nFont: '+fnt)

});

// Background input
document.querySelector('#bg').addEventListener('change', (event) => {// Same story for the rest of these.
    let val = document.querySelector('#bg').value

    bg = val
    GM_setValue('background',bg);
    makeCSS(bg, bg2, acc, txt, img, fnt);
    console.log('Background changed to '+val)
    console.log('Display Vars\n\nPreset: '+pst+'\nBackground: '+bg+'\nBackground 2: '+bg2+'\nAccent: '+acc+'\nText Color: '+txt+'\nBackground Image: '+img+'\nFont: '+fnt)

});

// Background2 input
document.querySelector('#bg2').addEventListener('change', (event) => {
    let val = document.querySelector('#bg2').value

    bg2 = val
    GM_setValue('background2',bg2);
    makeCSS(bg, bg2, acc, txt, img, fnt);
    console.log('Background 2 changed to '+val)
    console.log('Display Vars\n\nPreset: '+pst+'\nBackground: '+bg+'\nBackground 2: '+bg2+'\nAccent: '+acc+'\nText Color: '+txt+'\nBackground Image: '+img+'\nFont: '+fnt)

});

// Accent input
document.querySelector('#acc').addEventListener('change', (event) => {
    let val = document.querySelector('#acc').value

    acc = val
    GM_setValue('accent',acc);
    makeCSS(bg, bg2, acc, txt, img, fnt);
    console.log('Accent changed to '+val)
    console.log('Display Vars\n\nPreset: '+pst+'\nBackground: '+bg+'\nBackground 2: '+bg2+'\nAccent: '+acc+'\nText Color: '+txt+'\nBackground Image: '+img+'\nFont: '+fnt)

});

// Text Color input
document.querySelector('#txt').addEventListener('change', (event) => {
    let val = document.querySelector('#txt').value

    txt = val
    GM_setValue('textcolor',txt);
    makeCSS(bg, bg2, acc, txt, img, fnt);
    console.log('Text Color changed to '+val)
    console.log('Display Vars\n\nPreset: '+pst+'\nBackground: '+bg+'\nBackground 2: '+bg2+'\nAccent: '+acc+'\nText Color: '+txt+'\nBackground Image: '+img+'\nFont: '+fnt)

});

// Invert Images checkbox
document.querySelector('#invert').addEventListener('change', (event) => {
    let val = document.querySelector('#invert').checked

    if (val) { inv = 1 } else { inv = 0};// With this one val is a boolean, so if val is true, set inv to 1, otherwise 0.
    GM_setValue('invertImages',inv);
    makeCSS(bg, bg2, acc, txt, img, fnt, inv);
    console.log('Invert Images changed to '+inv)
    console.log('Display Vars\n\nPreset: '+pst+'\nBackground: '+bg+'\nBackground 2: '+bg2+'\nAccent: '+acc+'\nText Color: '+txt+'\nBackground Image: '+img+'\nInvert: '+inv)

});



})})();