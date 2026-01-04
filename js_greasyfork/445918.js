// ==UserScript==
// @include      /https?://archiveofourown\.org/.*works/\d+/
// @grant        none
// @namespace    https://greasyfork.org/en/users/921347-fire-soul
// @name         Firesoul19256
// @description  ao3 extra kudos copy
// @license MIT
// @version 0.0.1.20220602155011
// @downloadURL https://update.greasyfork.org/scripts/445918/Firesoul19256.user.js
// @updateURL https://update.greasyfork.org/scripts/445918/Firesoul19256.meta.js
// ==/UserScript==

//SETUP//
 
var auto = false;
    //Set to "true" if you want to skip the confirmation automatically.
 
var comments = Array(
    "extra kudos<3",
    "extra kudos, ao3 is mean:)",
    "i just wanted to leave more kudos <3"
);
    //Remember to keep your message between the quotation marks.
    //Remember to separate comments with a comma!
    //Message max length: 10000 characters
    //This is a copy of another extra kudos script but with some edits
 
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
message = message
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