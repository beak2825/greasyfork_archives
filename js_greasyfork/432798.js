// ==UserScript==
// @name         Quick, Easy and Pretty Agar Paper
// @version      1.3
// @description  Press 2, 3, 4 key to split twice, thrice and quad times respectively all really fast, press F to stop movement and have unlimited zoom, press again to go back to normal, for the pretty part its still work in progress, Hold W to keep feeding
// @namespace    http://tampermonkey.net/
// @author       P_M_9_8_6
// @match       *http://paper-io.com/agar/*
// @match       *http://agarpaper.io/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432798/Quick%2C%20Easy%20and%20Pretty%20Agar%20Paper.user.js
// @updateURL https://update.greasyfork.org/scripts/432798/Quick%2C%20Easy%20and%20Pretty%20Agar%20Paper.meta.js
// ==/UserScript==


$("document").ready(console.log("Script is ready"));

$("body").append("<div id = 'indicatorText' Style ='Color:black; position:absolute; top:33px; left:10px;font-size:25px;opacity:0.2;'><i>Spectate Mode</i></div>")
$("#indicatorText").hide();
$('#paperio_p1').attr("maxlength","15");
/* Key : Codes
    1  :  50
    2  :  51
    3  :  52
    F  :  70
    W  :  87
*/







var interval;
var switchy = false;
var zoom = false;
var count = 0;
var global_i = 0;



$("body").keydown(function(key){
    if (key.keyCode === 70) {
        spectateMode();
    }
    if(key.keyCode == 50){ // Double Split
        doubleSplit();
    }
    if(key.keyCode == 51){ // Triple Split
        tripleSplit();
    }
    if(key.keyCode == 52){ // Quad Split
        quadSplit();
    }
    if(key.keyCode == 87){//  Continous Feeding
        feed();
    }
            return;
        });

$(document).on('keyup',function(e){
if(e.keyCode == 87){
switchy = false;
clearInterval(interval);
return;
}
});


function feed(){
if(switchy){
return;
}
switchy = true;
interval = setInterval(function() {

sp(21);
}, 10);//increase this number to make it fire them out slower
}

function spectateMode() {
    if (count == 0){// if not in spectator mode puts you in specate mode
        //setUnlimitedZoom(true);
        setSpectate(true);
        count = 1;
        console.log("set to spectate mode");
        $("#indicatorText").show();
        return;
    }
    else{// If already in spectate mode puts you out of spectate mode
        //setUnlimitedZoom(false);
        setSpectate(false);
        count = 0;
        console.log("OUT OF spectate mode");
        $("#indicatorText").hide();
        return;
    }
}

function doubleSplit() {
        if (global_i < 2) {
                global_i++;
                sp(17);
                setTimeout(doubleSplit, 170); // Increase this number to make its double split slower dont decrease it the server might not accept the split below this number
        }
        else
            global_i = 0;
}

function tripleSplit() {
        if (global_i < 3) {
                global_i++;
                sp(17);
                setTimeout(tripleSplit, 170);// Increase this number to make its triple split slower dont decrease it the server might not accept the split below this number
        }
        else
            global_i = 0;
}
function quadSplit() {
        if (global_i < 4) {
                global_i++;
                sp(17);
                setTimeout(quadSplit, 170);// Increase this number to make its quad split slower dont decrease it the server might not accept the split below this number
        }
        else
            global_i = 0;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*---------------------------------------------------------------------------------------FOR THE PRETTY PART----------------------------------------------------------------------------------------*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//Variables to store in local storage to rememeber the user setting from last update
var Links;
var BackGround;
var count_l = 1;

function updateLocalStorage(){
if(count_l == 1)
localStorage.setItem("Links", true);

if(count_l == 0)
localStorage.setItem("Links", false);
}

function checkLastSettings(){
Links = localStorage.getItem("Links");
}

function updateSettings(){
if(Links == 'true'){
    show_Links();}
else if(Links == 'false'){
    hide_Links();}
}


checkLastSettings();//Checks users last used settings
updateSettings();//Updates the settings to the last used settings


$("#block_links").hide(); // Hides the links at the bottom right of the screen

$("#bottom .a center").append("<button id = 'Links_'>Hide/Show links</button>") // Makes a button

$("#Links_").click(function(){
// When the button with the id Links_ is clicked it toggles between hide and show for the links on the top right of the screen
if(count_l == 0)
    show_Links();
else if(count_l == 1)
    hide_Links();


console.log("updating local sotorage");
updateLocalStorage();
console.log("local sotrage updated");
});

function hide_Links(){
$("#share").hide();
count_l = 0;
}
function show_Links(){
$("#share").show();
count_l = 1;
}