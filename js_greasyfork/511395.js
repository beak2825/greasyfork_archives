// ==UserScript==
// @name        DGG - Add close stream button
// @namespace   Jaydr do your job
// @match       https://www.destiny.gg/bigscreen
// @match       https://www.destiny.gg/bigscreen*
// @match       https://www.destiny.gg/embed/chat
// @match       https://www.omniliberal.dev/bigscreen
// @match       https://www.omniliberal.dev/bigscreen*
// @match       https://www.omniliberal.dev/embed/chat
// @match       https://www.twitch.tv/destiny
// @grant       none
// @version     0.3
// @author      mif
// @license     MIT
// @description 2024-10-03, tfw you learn javashit to do Jaydr's job
// @downloadURL https://update.greasyfork.org/scripts/511395/DGG%20-%20Add%20close%20stream%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/511395/DGG%20-%20Add%20close%20stream%20button.meta.js
// ==/UserScript==

// idk how to do events so I'm clicking the other buttons
function click_close_embed() {document.getElementById("close-embed-btn").click();}
function click_change_platform() {document.getElementById("change-platform-btn").click();}
function blank_embed_function() {window.location.href = "#twitch/destiny";}

function css_overwrite (cssStr) { // this function injects CSS
    var D               = document;
    var newNode         = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ    = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}

// set a base element to attach to (CINEMA one)
let target_element = document.querySelector('#theater-mode');

// define new buttons to add after CINEMA mode
let custom_close_embed_button = document.createElement("button");
let blank_screen_button = document.createElement("button");
let change_platform_button = document.createElement("button");

// configuring the new buttons

// custom_close_embed_button.id = "close-embed-custom"; // useless
// custom_close_embed_button.style = "color:dedede!important"; // make it distinct
// custom_close_embed_button.style = "color:teal!important"; // make it distinct
custom_close_embed_button.textContent = "✖️ Embed"; // name the button
custom_close_embed_button.title = "Close Embed"; // hover text
custom_close_embed_button.addEventListener("click", click_close_embed, false); // can't copy the initial listner so target the other button

// blank_screen_button to hide forced hosted embeds
blank_screen_button.textContent = "⬛"; // name the button
blank_screen_button.title = "Black screen (using #twitch/destiny)"; // hover text
blank_screen_button.href = "#twitch/destiny";
blank_screen_button.addEventListener("click", blank_embed_function, false);

change_platform_button.textContent = "↔️"; // name the button
change_platform_button.title = "Switch Kick/Youtube (he needs to be live on both)"; // hover text
change_platform_button.addEventListener("click", click_change_platform, false); // can't copy the initial listner so target the other button

// he's not getting unbanned so it's fine to mess with and use this for the blank page
css_overwrite('[src="https://player.twitch.tv/?channel=destiny&parent=www.destiny.gg&parent=stage.destiny.gg"] {display: None;}');

// actually add the buttons after target_element
target_element.textContent = "🎥"; // text too long, make this one shorter also
target_element.after(custom_close_embed_button);
target_element.after(change_platform_button);
target_element.after(blank_screen_button);
