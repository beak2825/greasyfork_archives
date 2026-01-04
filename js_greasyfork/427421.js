// ==UserScript==
// @name         ao3 rekudos converter
// @version      3.15
// @history      3.15 - Fixing what I broke
// @history      3.1 - Manifest v3 change from "include" to "match"
// @history      3.0 - added Comment Assist Mode compatibility
// @history      2.53 - fixed stupid fucking spelling errors I s2g
// @history      2.5 - fixed freeze on fics with lots of kudos
// @history      2.1 - added toggle for verification
// @history      2.0 - added confirmation check for rekudosing, did cleaned up
// @history      1.55 - fixed stupid spelling errors
// @history      1.5 - rename, add extra comment fields and ID functionality
// @history      1.0 - basic functionality
// @description  automatically comment on a fic when you've already left kudos
// @match        http*://archiveofourown.org/*works*
// @grant        none
// @namespace    https://greasyfork.org/users/36620
// @downloadURL https://update.greasyfork.org/scripts/427421/ao3%20rekudos%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/427421/ao3%20rekudos%20converter.meta.js
// ==/UserScript==

//ACNOWLEDGEMENT: most of the method is cribbed from "ao3 no rekudos" by scriptfairy
//Rest is cribbed from "Change Ao3 Kudos button text to Glory" by AlectoPerdita
//I do not know enough JS to do shit like this on my own
//https://greasyfork.org/en/scripts/406616-ao3-no-rekudos
//https://greasyfork.org/en/scripts/390197-change-ao3-kudos-button-text-to-glory/code

//SETUP//

var auto = false;
    //Set to "true" if you want to skip the confirmation automatically.

var comments = Array(
    "Extra Kudos<3",
    "This is an extra kudos, since I've already left one. :)",
    "I just wanted to leave another kudos<3"
);
    //Remember to keep your message between the quotation marks.
    //Remember to separate comments with a comma!
    //Message max length: 10000 characters

var lat = 500;
    //Delay in milliseconds, waiting for reply from OTW servers. (Check with CTRL+SHIFT+K)

var verify = true;
    //Set to "false" to turn off anti-spam verification. (Not recommended.)

//Definitions
var work_id, kudos, banner, kudo_btn, cmnt_btn, cmnt_field, id;

work_id = window.location.pathname;
work_id = work_id.substring(work_id.lastIndexOf('/')+1);

banner = document.getElementById('kudos_message');

kudo_btn = document.getElementById('new_kudo');

cmnt_btn = document.getElementById('comment_submit_for_'+work_id);
cmnt_field = document.getElementById('comment_content_for_'+work_id);

//Message randomiser
var random = Math.floor(Math.random() * comments.length);
var message = comments[random];

// ID
if (verify == true) {
var d = new Date();
id = d.toISOString();
id = id.substring(0,10);
message = message+'</br><sub>Sent '+id+' using Ao3 Rekudos Converter</sub>'
}

//Comment-sending with button press rather than form submit
function send() {
    cmnt_field.value = message;
    cmnt_btn.click();
}

//Change kudos button behaviour
function change() {
    kudo_btn.addEventListener("click", send);
}

//Extra click for confirmation
var active = 'Rekudos?';
function rename() {
    'use strict';
    var kudo_text = document.querySelector('#kudo_submit');
    kudo_text.value = active;
    change();
}

//New method
function isAuto(){
if (auto == false || window.AssistMode == true) {
    rename();}
    else {
    send();}
}

function makeitwork() {
console.log('Rekudo latency check');
if (banner.classList.contains("kudos_error") == true) {
    isAuto();}
}

function delay(){
    setTimeout(makeitwork,lat);
}

kudo_btn.addEventListener("click", delay);
