// ==UserScript==
// @name         The Journey Userscript
// @namespace    http://tampermonkey.net/
// @version      2.6
// @history      Updated accept button to make it work for reformatted economy.
// @description  A userscript used for The Journey
// @author       riben
// @include      https://artofproblemsolving.com/community/c1228935
// @include      https://artofproblemsolving.com/community/c1228935*
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/408970/The%20Journey%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/408970/The%20Journey%20Userscript.meta.js
// ==/UserScript==
$('head').append(`
<style>
@import url(https://db.onlinewebfonts.com/c/04631057dd8d776a913255a96925bc33?family=Creepy);
@font-face {font-family: "Creepy"; src: url("https://db.onlinewebfonts.com/t/04631057dd8d776a913255a96925bc33.eot"); src: url("https://db.onlinewebfonts.com/t/04631057dd8d776a913255a96925bc33.eot?#iefix") format("embedded-opentype"), url("https://db.onlinewebfonts.com/t/04631057dd8d776a913255a96925bc33.woff2") format("woff2"), url("https://db.onlinewebfonts.com/t/04631057dd8d776a913255a96925bc33.woff") format("woff"), url("https://db.onlinewebfonts.com/t/04631057dd8d776a913255a96925bc33.ttf") format("truetype"), url("https://db.onlinewebfonts.com/t/04631057dd8d776a913255a96925bc33.svg#Creepy") format("svg"); }
@import url(https://db.onlinewebfonts.com/c/009943a6e511476a8e88fa74c11797d2?family=Zombie+Guts);
@font-face {font-family: "Zombie Guts"; src: url("https://db.onlinewebfonts.com/t/009943a6e511476a8e88fa74c11797d2.eot"); src: url("https://db.onlinewebfonts.com/t/009943a6e511476a8e88fa74c11797d2.eot?#iefix") format("embedded-opentype"), url("https://db.onlinewebfonts.com/t/009943a6e511476a8e88fa74c11797d2.woff2") format("woff2"), url("https://db.onlinewebfonts.com/t/009943a6e511476a8e88fa74c11797d2.woff") format("woff"), url("https://db.onlinewebfonts.com/t/009943a6e511476a8e88fa74c11797d2.ttf") format("truetype"), url("https://db.onlinewebfonts.com/t/009943a6e511476a8e88fa74c11797d2.svg#Zombie Guts") format("svg"); }
@import url(https://db.onlinewebfonts.com/c/16abf4fcdf02f128bff40047d58c5956?family=Firecat);
@font-face {font-family: "Firecat"; src: url("https://db.onlinewebfonts.com/t/16abf4fcdf02f128bff40047d58c5956.eot"); src: url("https://db.onlinewebfonts.com/t/16abf4fcdf02f128bff40047d58c5956.eot?#iefix") format("embedded-opentype"), url("https://db.onlinewebfonts.com/t/16abf4fcdf02f128bff40047d58c5956.woff2") format("woff2"), url("https://db.onlinewebfonts.com/t/16abf4fcdf02f128bff40047d58c5956.woff") format("woff"), url("https://db.onlinewebfonts.com/t/16abf4fcdf02f128bff40047d58c5956.ttf") format("truetype"), url("https://db.onlinewebfonts.com/t/16abf4fcdf02f128bff40047d58c5956.svg#Firecat") format("svg"); }
#signup {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
#deposit {
  background-color: orange;
  border: none;
  color: white;
  padding: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
#purchase {
  background-color: blue;
  border: none;
  color: white;
  padding: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
#accumulation {
  background-color: pink;
  border: none;
  color: white;
  padding: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
#nominate {
  background-color: red;
  border: none;
  color: white;
  padding: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
#rankup {
  background-color: purple;
  border: none;
  color: white;
  padding: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
#loan {
  background-color: gray;
  border: none;
  color: white;
  padding: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
#reduce {
  background-color: orange;
  border: none;
  color: white;
  padding: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
#accept {
  background-color: aqua;
  border: none;
  color: white;
  padding: 5px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}
.bbcode-verbatim .bbcode_img{
display:none;
}
.bbcode-verbatim .jc:before{
content: ':jc:';
}
code .bbcode_img{
display:none;
}
code .jc:before{
content: ':jc:';
}
.bbcode-verbatim .thinking:before{
content: ':thinking:';
}
code .jc:before{
content: ':thinking:';
}
.bbcode-verbatim .rolling:before{
content: ':rolling:';
}
code .rolling:before{
content: ':rolling:';
}
.bbcode-verbatim .distraught:before{
content: ':distraught:';
}
code .distraught:before{
content: ':distraught:';
}
.bbcode-verbatim .xD:before{
content: ':xD:';
}
code .xD:before{
content: ':xD:';
}
.bbcode-verbatim .facepalm:before{
content: ':facepalm:';
}
code .facepalm:before{
content: ':facepalm:';
}
.display_count {
color: white;
height: 5px;
background-color: #1b365d;
}
span.bbcode_spoiler {
  background-color: black;
  font-family: Arial;
  color: black;
}
.blur {
   color: transparent;
   text-shadow: 0 0 5px rgba(0,0,0,0.5);
}
.bbcode-verbatim .blur{
all: inherit !important;
}
.bbcode-verbatim .blur:before{
content: "[blur]";
}
.bbcode-verbatim .blur:after{
content: "[/blur]";
}
code .blur {
all: inherit !important;
}
code .blur:before {
content: "[blur]";
}
code .blur:after {
content: "[/blur]";
}
.o {
text-decoration: overline !important;
}
.bbcode-verbatim .o{
all: inherit !important;
}
.bbcode-verbatim .o:before{
content: "[o]";
}
.bbcode-verbatim .o:after{
content: "[/o]";
}
code .o {
all: inherit !important;
}
code .o:before {
content: "[o]";
}
code .o:after {
content: "[/o]";
}
.reverse {
unicode-bidi:bidi-override;
  direction:rtl;
}
.bbcode-verbatim .reverse{
all: inherit !important;
}
.bbcode-verbatim .reverse:before{
content: "[reverse]";
}
.bbcode-verbatim .reverse:after{
content: "[/reverse]";
}
code .reverse {
all: inherit !important;
}
code .reverse:before {
content: "[reverse]";
}
code .reverse:after {
content: "[/reverse]";
}
.updown {
  -moz-transform:rotate(180deg); /* Firefox */
  -webkit-transform:rotate(180deg); /* Webkit */
  -ms-transform:rotate(180deg); /* IE */
  -o-transform:rotate(180deg); /* Opera */
  transform:rotate(180deg); /* future */
  display: inline-block;
}
.bbcode-verbatim .updown{
all: inherit !important;
}
.bbcode-verbatim .updown:before{
content: "[updown]";
}
.bbcode-verbatim .updown:after{
content: "[/updown]";
}
code .updown {
all: inherit !important;
}
code .updown:before {
content: "[updown]";
}
code .updown:after {
content: "[/updown]";
}
.hl {
background-color: yellow;
}
.bbcode-verbatim .hl{
all: inherit !important;
}
.bbcode-verbatim .hl:before{
content: "[hl]";
}
.bbcode-verbatim .hl:after{
content: "[/hl]";
}
code .hl {
all: inherit !important;
}
code .hl:before {
content: "[hl]";
}
code .hl:after {
content: "[/hl]";
}
.shadow {
text-shadow: 2px 2px 4px;
}
.bbcode-verbatim .shadow{
all: inherit !important;
}
.bbcode-verbatim .shadow:before{
content: "[shadow]";
}
.bbcode-verbatim .shadow:after{
content: "[/shadow]";
}
code .shadow {
all: inherit !important;
}
code .shadow:before {
content: "[shadow]";
}
code .shadow:after {
content: "[/shadow]";
}
.blink {
animation: blinker 1s linear infinite;
}
@keyframes blinker {
  50% {
    opacity: 0;
  }
}
.bbcode-verbatim .blink{
all: inherit !important;
}
.bbcode-verbatim .blink:before{
content: "[blink]";
}
.bbcode-verbatim .blink:after{
content: "[/blink]";
}
code .blink {
all: inherit !important;
}
code .blink:before {
content: "[blink]";
}
code .blink:after {
content: "[/blink]";
}
#mapid { height: 180px; }
</style>
<script>
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;
    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);
    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;
            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }
    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];
    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
function check_signup(){
var choice=prompt("Are you joining on your own, or are you joining on a team? Please say own or team.")
if (choice==null) {
return false;
}
else if (choice=="own") {
var username=AoPS.bd.my_profile.username;
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/signup{"+username+"}[/b]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else {
var team=prompt("What is the team you want to join?");
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/signup{"+username+"}[/b]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
}
function check_deposit(){
var username=AoPS.bd.my_profile.username;
var amount=prompt("Type in the amount you want to deposit:");
var reason=prompt("State a reason for your deposit:");
if (username==null) {
return false;
}
else {
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/deposit{"+username+", "+amount+", "+reason+"}[/b] [accept][/accept]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
};}
function check_purchase(){
var username=AoPS.bd.my_profile.username;
var item=prompt("Type the item that you want to purchase:");
var cost=prompt("Type the cost of the item:");
if (item==null) {
return false;
}
else if (cost==null) {
return false;
}
else {
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/purchase{"+username+", "+cost+", "+item+"}[/b] [accept][/accept]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
};}
function check_accumulation(){
var original_number=prompt("What is your current number?");
if (original_number==null) {
return false;
}
else if (original_number <= 50) {
var point=2;
var new_number=parseInt(original_number)+parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/accumulate{"+point+"}[/b], "+new_number);
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 50 && original_number<=100) {
var point=3;
var new_number=parseInt(original_number)+parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/accumulate{"+point+"}[/b], "+new_number);
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 100 && original_number<=175) {
var point=5;
var new_number=parseInt(original_number)+parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/accumulate{"+point+"}[/b], "+new_number);
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 175 && original_number<=250) {
var point=7;
var new_number=parseInt(original_number)+parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/accumulate{"+point+"}[/b], "+new_number);
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 250 && original_number<=350) {
var point=11;
var new_number=parseInt(original_number)+parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/accumulate{"+point+"}[/b], "+new_number);
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 350 && original_number<=425) {
var point=13;
var new_number=parseInt(original_number)+parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/accumulate{"+point+"}[/b], "+new_number);
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 425 && original_number<=500) {
var point=17;
var new_number=parseInt(original_number)+parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/accumulate{"+point+"}[/b], "+new_number);
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 500 && original_number<=550) {
var point=19;
var new_number=parseInt(original_number)+parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/accumulate{"+point+"}[/b], "+new_number);
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 550 && original_number<=625) {
var point=23;
var new_number=parseInt(original_number)+parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/accumulate{"+point+"}[/b], "+new_number);
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 625 && original_number<=700) {
var point=29;
var new_number=parseInt(original_number)+parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/accumulate{"+point+"}[/b], "+new_number);
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 700 && original_number<=750) {
var point=31;
var new_number=parseInt(original_number)+parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/accumulate{"+point+"}[/b], "+new_number);
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 750 && original_number<=825) {
var point=37;
var new_number=parseInt(original_number)+parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/accumulate{"+point+"}[/b], "+new_number);
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 825 && original_number<=900) {
var point=41;
var new_number=parseInt(original_number)+parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/accumulate{"+point+"}[/b], "+new_number);
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else{
var point=43;
var new_number=parseInt(original_number)+parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/accumulate{"+point+"}[/b], "+new_number);
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}};
function check_nominate(){
var game=prompt("Type the user or game you want to nominate:");
if (game==null) {
return false;
}
else {
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/nominate{"+game+"}[/b]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
};}
function check_rankup(){
var username=AoPS.bd.my_profile.username;
var rank=prompt("Type the new rank you want to rank up to. Be sure to capitalize the first letter!");
var reason=prompt("Type in your reason for ranking up:");
if (username==null) {
return false;
}
else {
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/rankup{"+username+", "+rank+", "+reason+"}[/b] [accept][/accept]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
};}
function check_loan(){
var username=AoPS.bd.my_profile.username;
var amount=prompt("Type the amount of Journey Coins you want to loan:");
var date=prompt("Type the date you will pay back then before 12:00 AM PST:");
if (username==null) {
return false;
}
else if (date==null) {
return false;
}
else {
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/loan{"+username+", "+amount+", "+date+"}[/b] (Make sure that the old loan has been paid before accepting a new one!) [accept][/accept]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
};}
function check_reduce(){
var opponent=prompt("What is your opponent's username?");
var original_number=prompt("What is your opponent's current number?")
if (original_number==null) {
return false;
}
else if (original_number <= 50) {
var point=1;
var new_number=parseInt(original_number)-parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/reduce{"+opponent+", "+new_number+"}[/b]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 50 && original_number<=100) {
var point=2;
var new_number=parseInt(original_number)-parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/reduce{"+opponent+", "+new_number+"}[/b]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 100 && original_number<=175) {
var point=3;
var new_number=parseInt(original_number)-parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/reduce{"+opponent+", "+new_number+"}[/b]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 175 && original_number<=250) {
var point=5;
var new_number=parseInt(original_number)-parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/reduce{"+opponent+", "+new_number+"}[/b]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 250 && original_number<=350) {
var point=7;
var new_number=parseInt(original_number)-parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/reduce{"+opponent+", "+new_number+"}[/b]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 350 && original_number<=425) {
var point=11;
var new_number=parseInt(original_number)-parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/reduce{"+opponent+", "+new_number+"}[/b]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 425 && original_number<=500) {
var point=13;
var new_number=parseInt(original_number)-parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/reduce{"+opponent+", "+new_number+"}[/b]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 500 && original_number<=550) {
var point=17;
var new_number=parseInt(original_number)-parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/reduce{"+opponent+", "+new_number+"}[/b]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 550 && original_number<=625) {
var point=19;
var new_number=parseInt(original_number)-parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/reduce{"+opponent+", "+new_number+"}[/b]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 625 && original_number<=700) {
var point=23;
var new_number=parseInt(original_number)-parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/reduce{"+opponent+", "+new_number+"}[/b]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 700 && original_number<=750) {
var point=29;
var new_number=parseInt(original_number)-parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/reduce{"+opponent+", "+new_number+"}[/b]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 750 && original_number<=825) {
var point=31;
var new_number=parseInt(original_number)-parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/reduce{"+opponent+", "+new_number+"}[/b]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else if (original_number > 825 && original_number<=900) {
var point=37;
var new_number=parseInt(original_number)-parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/reduce{"+opponent+", "+new_number+"}[/b]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
else{
var point=41;
var new_number=parseInt(original_number)-parseInt(point);
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("[b]/reduce{"+opponent+", "+new_number+"}[/b]");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}};
function check_accept(button) {
var post_num_top=document.getElementsByClassName("cmty-post-middle");
for (var i = 0; i < post_num_top.length; i++) {
if (post_num_top[i].childNodes[3].childNodes[3].childNodes[1].innerHTML=="#1") {
var command=button.parentNode.textContent.split('{')[0].substr(1);
if (command=="deposit") {
var right=post_num_top[i].nextSibling;
var edit=right.childNodes[5];
var wanted_user=button.parentNode.textContent.split(',')[0];
var user=wanted_user.substring(9);
var deposit_amount=button.parentNode.textContent.split(',')[1];
$(edit).trigger('click');
waitForKeyElements("textarea.cmty-post-textarea",accept_search);
function accept_search() {
var search_for=document.getElementsByClassName("cmty-post-textarea")[0].value;
var original_amount=search_for.split(user+"'s Money:[/b]")[1].split(' ')[1];
var new_amount=parseInt(original_amount)+parseInt(deposit_amount);
var new_text=search_for.replace("[b]"+user+"'s Money:[/b] "+original_amount+' Journey Coins',"[b]"+user+"'s Money:[/b] "+new_amount+' Journey Coins');
document.getElementsByClassName("cmty-post-textarea")[0].value=new_text;
$('.cmty-submit-button.btn.btn-primary').trigger('click');
$('.aops-modal-btn.btn.btn-primary').trigger('click');}
var back_edit=button.parentNode.parentNode.parentNode.nextSibling.childNodes[5];
$(back_edit).trigger('click');
waitForKeyElements("textarea.cmty-post-textarea",cleanup);
function cleanup() {
var op=document.getElementsByClassName("cmty-post-textarea")[1].value;
var new_op=op.replace("[accept][/accept]","[color=red]Done![/color]");
document.getElementsByClassName("cmty-post-textarea")[1].value=new_op;
$('.cmty-submit-button.btn.btn-primary').trigger('click');
$('.cmty-posting-preview-bar-hidden').trigger('click');
$('.aops-modal-btn.btn.btn-primary').trigger('click');
setTimeout(location.reload.bind(location), 10000);
}}
else if (command=="purchase") {
var right=post_num_top[i].nextSibling;
var edit=right.childNodes[5];
var wanted_user=button.parentNode.textContent.split(',')[0];
var user=wanted_user.substring(10);
var withdrew_amount=button.parentNode.textContent.split(',')[1];
var add_item=button.parentNode.textContent.split(',')[2].slice(0,-3);
$(edit).trigger('click');
waitForKeyElements("textarea.cmty-post-textarea",accept_search);
function accept_search() {
var search_for=document.getElementsByClassName("cmty-post-textarea")[0].value;
var original_amount=search_for.split(user+"'s Money:[/b]")[1].split(' ')[1];
var original_items=search_for.split(user+"'s Inventory:[/b]")[1].split("[")[0];
original_items=original_items.slice(0,-1);
var new_amount=parseInt(original_amount)-parseInt(withdrew_amount);
if (new_amount<0) {
alert("The user does not have enough money to purchase this item!");
}
else {
if (original_items=="None") {
var new_item=add_item;
var new_text=search_for.replace("[b]"+user+"'s Money:[/b] "+original_amount+' Journey Coins',"[b]"+user+"'s Money:[/b] "+new_amount+' Journey Coins');
var newer_text=new_text.replace("[b]"+user+"'s Inventory:[/b] None","[b]"+user+"'s Inventory:[/b]"+new_item);
document.getElementsByClassName("cmty-post-textarea")[0].value=newer_text;
$('.cmty-submit-button.btn.btn-primary').trigger('click');
$('.aops-modal-btn.btn.btn-primary').trigger('click');
var back_edit=button.parentNode.parentNode.parentNode.nextSibling.childNodes[5];
$(back_edit).trigger('click');
waitForKeyElements("textarea.cmty-post-textarea",cleanup);
function cleanup() {
var op=document.getElementsByClassName("cmty-post-textarea")[1].value;
var new_op=op.replace("[accept][/accept]","[color=red]Done![/color]");
document.getElementsByClassName("cmty-post-textarea")[1].value=new_op;
$('.cmty-submit-button.btn.btn-primary').trigger('click');
$('.cmty-posting-preview-bar-hidden').trigger('click');
$('.aops-modal-btn.btn.btn-primary').trigger('click');
setTimeout(location.reload.bind(location), 10000);
}
}
else {
var new_items=original_items+", "+add_item;
console.log(new_items);
var new_text=search_for.replace("[b]"+user+"'s Money:[/b] "+original_amount+' Journey Coins',"[b]"+user+"'s Money:[/b] "+new_amount+' Journey Coins');
var newer_text=new_text.replace("[b]"+user+"'s Inventory:[/b]"+original_items,"[b]"+user+"'s Inventory:[/b] "+new_items);
document.getElementsByClassName("cmty-post-textarea")[0].value=newer_text;
$('.cmty-submit-button.btn.btn-primary').trigger('click');
$('.aops-modal-btn.btn.btn-primary').trigger('click');
var back_edit=button.parentNode.parentNode.parentNode.nextSibling.childNodes[5];
$(back_edit).trigger('click');
waitForKeyElements("textarea.cmty-post-textarea",cleanup);
function cleanup() {
var op=document.getElementsByClassName("cmty-post-textarea")[1].value;
var new_op=op.replace("[accept][/accept]","[color=red]Done![/color]");
document.getElementsByClassName("cmty-post-textarea")[1].value=new_op;
$('.cmty-submit-button.btn.btn-primary').trigger('click');
$('.cmty-posting-preview-bar-hidden').trigger('click');
$('.aops-modal-btn.btn.btn-primary').trigger('click');
setTimeout(location.reload.bind(location), 10000);
}
}
}
}
}
else if (command=="rankup") {
var right=post_num_top[i].nextSibling;
var edit=right.childNodes[5];
var wanted_user=button.parentNode.textContent.split(',')[0];
var user=wanted_user.substring(8);
var new_rank=button.parentNode.textContent.split(',')[1].split(',')[0].substring(1);
$(edit).trigger('click');
waitForKeyElements("textarea.cmty-post-textarea",accept_search);
function accept_search() {
var search_for=document.getElementsByClassName("cmty-post-textarea")[0].value;
var original_users=search_for.split(new_rank+" Members:[/b] ")[1].split("[")[0];
original_users=original_users.slice(0,-1);
if (original_users=="None") {
var new_users=user;
var new_text=search_for.replace(user,"");
var newer_text=new_text.replace("[b]"+new_rank+" Members:[/b] None","[b]"+new_rank+" Members:[/b] "+new_users);
document.getElementsByClassName("cmty-post-textarea")[0].value=newer_text;
document.getElementsByClassName("cmty-post-textarea")[0].value=newer_text;
$('.cmty-submit-button.btn.btn-primary').trigger('click');
$('.aops-modal-btn.btn.btn-primary').trigger('click');
var back_edit=button.parentNode.parentNode.parentNode.nextSibling.childNodes[5];
$(back_edit).trigger('click');
waitForKeyElements("textarea.cmty-post-textarea",cleanup);
function cleanup() {
var op=document.getElementsByClassName("cmty-post-textarea")[1].value;
var new_op=op.replace("[accept][/accept]","[color=red]Done![/color]");
document.getElementsByClassName("cmty-post-textarea")[1].value=new_op;
$('.cmty-submit-button.btn.btn-primary').trigger('click');
$('.cmty-posting-preview-bar-hidden').trigger('click');
$('.aops-modal-btn.btn.btn-primary').trigger('click');
setTimeout(location.reload.bind(location), 10000);
}
}
else {
var new_users=original_users+", "+user;
var new_text=search_for.replace(user,"");
var newer_text=new_text.replace("[b]"+new_rank+" Members:[/b] "+original_users,"[b]"+new_rank+" Members:[/b] "+new_users);
document.getElementsByClassName("cmty-post-textarea")[0].value=newer_text;
document.getElementsByClassName("cmty-post-textarea")[0].value=newer_text;
$('.cmty-submit-button.btn.btn-primary').trigger('click');
$('.aops-modal-btn.btn.btn-primary').trigger('click');
var back_edit=button.parentNode.parentNode.parentNode.nextSibling.childNodes[5];
$(back_edit).trigger('click');
waitForKeyElements("textarea.cmty-post-textarea",cleanup);
function cleanup() {
var op=document.getElementsByClassName("cmty-post-textarea")[1].value;
var new_op=op.replace("[accept][/accept]","[color=red]Done![/color]");
document.getElementsByClassName("cmty-post-textarea")[1].value=new_op;
$('.cmty-submit-button.btn.btn-primary').trigger('click');
$('.cmty-posting-preview-bar-hidden').trigger('click');
$('.aops-modal-btn.btn.btn-primary').trigger('click');
setTimeout(location.reload.bind(location), 10000);
}
}
}
}
else if (command=="loan") {
var right=post_num_top[i].nextSibling;
var edit=right.childNodes[5];
var wanted_user=button.parentNode.textContent.split(',')[0];
var user=wanted_user.substring(6);
var amount=button.parentNode.textContent.split(',')[1].split(',')[0].substring(1);
var date=button.parentNode.textContent.split(',')[2].split('}')[0].substring(1);
$(edit).trigger('click');
waitForKeyElements("textarea.cmty-post-textarea",accept_search);
function accept_search() {
var search_for=document.getElementsByClassName("cmty-post-textarea")[0].value;
var original_amount=search_for.split(user+"'s Loan Amount:[/b]")[1].split(" ")[1];
var original_date=search_for.split(user+"'s Loan End Date:[/b]")[1].split("[")[0].slice(0,-1);
var new_amount=amount;
var new_date=date;
var new_text=search_for.replace(user+"'s Loan Amount:[/b] "+original_amount,user+"'s Loan Amount:[/b] "+new_amount);
var newer_text=new_text.replace(user+"'s Loan End Date:[/b]"+original_date,user+"'s Loan End Date:[/b] "+new_date);
document.getElementsByClassName("cmty-post-textarea")[0].value=newer_text;
$('.cmty-submit-button.btn.btn-primary').trigger('click');
$('.aops-modal-btn.btn.btn-primary').trigger('click');
var back_edit=button.parentNode.parentNode.parentNode.nextSibling.childNodes[5];
$(back_edit).trigger('click');
waitForKeyElements("textarea.cmty-post-textarea",cleanup);
function cleanup() {
var op=document.getElementsByClassName("cmty-post-textarea")[1].value;
var new_op=op.replace("[accept][/accept]","[color=red]Done![/color]");
document.getElementsByClassName("cmty-post-textarea")[1].value=new_op;
$('.cmty-submit-button.btn.btn-primary').trigger('click');
$('.cmty-posting-preview-bar-hidden').trigger('click');
$('.aops-modal-btn.btn.btn-primary').trigger('click');
setTimeout(location.reload.bind(location), 10000);
}
}
}
}
}
};
function bumping() {
$('.cmty-topic-mini-reply').trigger('click');
$('.cmty-post-textarea').append("Bumping this topic.");
$('.cmty-submit-button.btn.btn-primary').trigger('click');
}
</script>
 <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
 <!-- Make sure you put this AFTER Leaflet's CSS -->
 <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
   integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
   crossorigin=""></script>
`);
// Huge thanks to casi for helping me with betd() function. He wrote the first part, which is the part where it makes it work on text nodes. I wrote the second part where it makes it work on quotes, bold, etc.
// Also thank you to casi for helping me get the username of users without asking them.
// All Buttons, Emojis & Text Decoration
function betd() {
    $("div.cmty-post-html,div.cmty-post-preview-text.aops-scroll-content,div.cmty-hide-content,div.bbcode_quote_body,div.bbcode_center").each(function() {
        var code1 = ' <div class="jc" style="display: inline"><img class="bbcode_img" src="//cdn.artofproblemsolving.com/images/3/3/7/337ac130719ed3f965843c0ed8ca5df68dcaa816.png" alt="https://funkyimg.com/i/36dTG.png" width="3%"></img></div>';
        var code2 = ' <div class="thinking" style="display: inline"><img class="bbcode_img" src="//cdn.artofproblemsolving.com/images/9/3/4/934659b6131e140d3dd89e17fe75f8d55344dc2a.png"></img></div>';
        var code3 = ' <div class="rolling" style="display: inline"><img class="bbcode_img" src="//cdn.artofproblemsolving.com/images/2/6/7/267eedb7eb35b92a8f25ef2a9d3bb7a7cf9d6d4f.png"></img></div>';
        var code4 = ' <div class="distraught" style="display: inline"><img class="bbcode_img" src="//cdn.artofproblemsolving.com/images/d/a/1/da12b4d41dd8c593117d5cf5ba22017b2f1995b7.png"></img></div>';
        var code5 = ' <div class="xD" style="display: inline"><img class="bbcode_img" src="//cdn.artofproblemsolving.com/images/c/3/6/c36c26cf9db08186b884f01166c8205a39926e5b.png"></img></div>';
        var code6 = ' <div class="facepalm" style="display: inline"><img class="bbcode_img" src="//cdn.artofproblemsolving.com/images/5/3/2/5321e63d6445cd53c595ec5944462b92009f7b22.png"></img></div>';
        var code7 = '<span class="blur">';
        var code8= '</span>';
        var code9 = '<span class="o">';
        var code10 = '<span class="reverse">';
        var code11 = '<span class="updown">';
        var code12 = '<span class="hl">';
        var code13 = '<input id="signup" type="button" onclick="check_signup()" value="Signup"/>';
        var code14= '</input>';
        var code15 = '<input id="deposit" type="button" onclick="check_deposit()" value="Deposit"/>';
        var code16 = '<input id="purchase" type="button" onclick="check_purchase()" value="Purchase"/>';
        var code17 = '<input id="accumulation" type="button" onclick="check_accumulation()" value="Accumulation"/>';
        var code18 = '<input id="nominate" type="button" onclick="check_nominate()" value="Nominate"/>';
        var code19 = '<input id="rankup" type="button" onclick="check_rankup()" value="Rankup"/>';
        var code20 = '<input id="accept" type="button" onclick="check_accept(this)" value="Accept"/>';
        var code21 = '<span class="shadow">';
        var code22 = '<span class="blink">';
        var code23 = '<input id="loan" type="button" onclick="check_loan()" value="Loan"/>';
        var code24 = '<input id="reduce" type="button" onclick="check_reduce()" value="Reduce"/>';
        var code25 = '<div id="mapid"></div>'
        for (var node of this.childNodes) {
            if(node.nodeType === 3) {
                var content = node.textContent
                content = (content.split(':jc:').join(code1))
                content = (content.split(':thinking:').join(code2))
                content = (content.split(':rolling:').join(code3))
                content = (content.split(':distraught:').join(code4))
                content = (content.split(':xD:').join(code5))
                content = (content.split(':facepalm:').join(code6))
                content = (content.split('[blur]').join(code7))
                content = (content.split('[/blur]').join(code8))
                content = (content.split('[o]').join(code9))
                content = (content.split('[/o]').join(code8))
                content = (content.split('[reverse]').join(code10))
                content = (content.split('[/reverse]').join(code8))
                content = (content.split('[updown]').join(code11))
                content = (content.split('[/updown]').join(code8))
                content = (content.split('[hl]').join(code12))
                content = (content.split('[/hl]').join(code8))
                content = (content.split('[signup]').join(code13))
                content = (content.split('[/signup]').join(code14))
                content = (content.split('[deposit]').join(code15))
                content = (content.split('[/deposit]').join(code14))
                content = (content.split('[purchase]').join(code16))
                content = (content.split('[/purchase]').join(code14))
                content = (content.split('[accumulation]').join(code17))
                content = (content.split('[/accumulation]').join(code14))
                content = (content.split('[nominate]').join(code18))
                content = (content.split('[/nominate]').join(code14))
                content = (content.split('[rankup]').join(code19))
                content = (content.split('[/rankup]').join(code14))
                content = (content.split('[accept]').join(code20))
                content = (content.split('[/accept]').join(code14))
                content = (content.split('[shadow]').join(code21))
                content = (content.split('[/shadow]').join(code8))
                content = (content.split('[blink]').join(code22))
                content = (content.split('[/blink]').join(code8))
                content = (content.split('[loan]').join(code23))
                content = (content.split('[/loan]').join(code14))
                content = (content.split('[reduce]').join(code24))
                content = (content.split('[/reduce]').join(code14))
                content = (content.split('[tmap]').join(code25))
                content = $.parseHTML(content)
                for (var item of content) {
                    this.insertBefore(item, node)
                }
                node.remove()
            }}
        }
    );
    $("b,i,u,span,li").each(function() {
      var text = $(this).html();
      var code1 = ' <div class="jc" style="display: inline"><img class="bbcode_img" src="//cdn.artofproblemsolving.com/images/3/3/7/337ac130719ed3f965843c0ed8ca5df68dcaa816.png" alt="https://funkyimg.com/i/36dTG.png" width="3%"></img></div>';
     var code2 = ' <div class="thinking" style="display: inline"><img class="bbcode_img" src="//cdn.artofproblemsolving.com/images/9/3/4/934659b6131e140d3dd89e17fe75f8d55344dc2a.png"></img></div>';
        var code3 = ' <div class="rolling" style="display: inline"><img class="bbcode_img" src="//cdn.artofproblemsolving.com/images/2/6/7/267eedb7eb35b92a8f25ef2a9d3bb7a7cf9d6d4f.png"></img></div>';
        var code4 = ' <div class="distraught" style="display: inline"><img class="bbcode_img" src="//cdn.artofproblemsolving.com/images/d/a/1/da12b4d41dd8c593117d5cf5ba22017b2f1995b7.png"></img></div>';
        var code5 = ' <div class="xD" style="display: inline"><img class="bbcode_img" src="//cdn.artofproblemsolving.com/images/c/3/6/c36c26cf9db08186b884f01166c8205a39926e5b.png"></img></div>';
        var code6 = ' <div class="facepalm" style="display: inline"><img class="bbcode_img" src="//cdn.artofproblemsolving.com/images/5/3/2/5321e63d6445cd53c595ec5944462b92009f7b22.png"></img></div>';
        var code7 = '<span class="blur">';
        var code8= '</span>';
        var code9 = '<span class="o">';
        var code10 = '<span class="reverse">';
        var code11 = '<span class="updown">';
        var code12 = '<span class="hl">';
        var code13 = '<input id="signup" type="button" onclick="check_signup()" value="Signup"/>';
        var code14= '</input>';
        var code15 = '<input id="deposit" type="button" onclick="check_deposit()" value="Deposit"/>';
        var code16 = '<input id="purchase" type="button" onclick="check_purchase()" value="Purchase"/>';
        var code17 = '<input id="accumulation" type="button" onclick="check_accumulation()" value="Accumulation"/>';
        var code18 = '<input id="nominate" type="button" onclick="check_nominate()" value="Nominate"/>';
        var code19 = '<input id="rankup" type="button" onclick="check_rankup()" value="Rankup"/>';
        var code20 = '<input id="accept" type="button" onclick="check_accept()" value="Accept"/>';
        var code21 = '<span class="shadow">';
        var code22 = '<span class="blink">';
        var code23 = '<input id="loan" type="button" onclick="check_loan()" value="Loan"/>';
        var code24 = '<input id="reduce" type="button" onclick="check_reduce()" value="Reduce"/>';
        var code25 = '<div id="mapid"></div>'
        $(this).html(text.replace(':jc:',code1).replace(':thinking:',code2).replace(':rolling:',code3).replace(':distraught:',code4).replace(':xD:',code5).replace(':facepalm:',code6).replace('[blur]',code7).replace('[/blur]',code8).replace('[o]',code9).replace('[/o]',code8).replace('[reverse]',code10).replace('[/reverse]',code8).replace('[updown]',code11).replace('[/updown]',code8).replace('[hl]',code12).replace('[/hl]',code8).replace('[signup]',code13).replace('[/signup]',code14).replace('[deposit]',code15).replace('[/deposit]',code14).replace('[purchase]',code16).replace('[/purchase]',code14).replace('[accumulation]',code17).replace('[/accumulation]',code14).replace('[nominate]',code18).replace('[/nominate]',code14).replace('[rankup]',code19).replace('[/rankup]',code14).replace('[accept]',code20).replace('[/accept]',code14).replace('[shadow]',code21).replace('[/shadow]',code8).replace('[blink]',code22).replace('[/blink]',code8).replace('[loan]',code23).replace('[/loan]',code14).replace('[reduce]',code24).replace('[/reduce]',code14).replace('[tmap]',code25));
    })
var mymap = L.map('mapid', {
    crs: L.CRS.Simple
});
var bounds = [[-26.5,-25], [1021.5,1023]];
var image = L.imageOverlay('https://snipboard.io/7M8Ul9.jpg', bounds).addTo(mymap);
mymap.fitBounds(bounds);
var marker = L.marker([51.5, -0.09]).addTo(mymap);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                 '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                 'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(mymap);
};
setInterval(betd, 3000);
// Word Count. Special thanks to happycupcake for helping me realize that the code originally doesn't work without waitForKeyElements
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
waitForKeyElements ("textarea.cmty-post-textarea", word_count);
waitForKeyElements ("div.cmty-posting-box-container", add_counter);
function add_counter () {
$('.cmty-posting-box-container').append('<div class="display_count">0</div>');
}
function word_count () {
  var count = document.getElementsByClassName("cmty-post-textarea")[0].value.split(" ").length;
  document.getElementsByClassName('display_count')[0].innerHTML=count;
}
setInterval(word_count,1000);
// Tag Color Change
waitForKeyElements ("cmty-item-tag", tag_change);
function tag_change() {
var tag=document.getElementsByClassName("cmty-item-tag");
for (var i = 0; i < tag.length; i++) {
if (tag[i].textContent=='High quality') {
    tag[i].setAttribute("style", "background-color: green;");
}
else if (tag[i].textContent=='medium quality') {
    tag[i].setAttribute("style", "background-color: orange;");
}
else if (tag[i].textContent=='low quality') {
    tag[i].setAttribute("style", "background-color: red;");
}
else if (tag[i].textContent=='posting') {
    tag[i].setAttribute("style", "background-color: magenta;");
}
else if (tag[i].textContent=='RPG') {
    tag[i].setAttribute("style", "background-color: brown;");
}
else if (tag[i].textContent=='Round') {
    tag[i].setAttribute("style", "background-color: olive;");
}
else if (tag[i].textContent=='Signup') {
    tag[i].setAttribute("style", "background-color: yellowgreen;");
}
else if (tag[i].textContent=='host') {
    tag[i].setAttribute("style", "background-color: blue;");
}
else if (tag[i].textContent=='marathon') {
    tag[i].setAttribute("style", "background-color: goldenrod;");
}
    else if (tag[i].textContent=='simple') {
    tag[i].setAttribute("style", "background-color: #66ffb5;");
}
    else if (tag[i].textContent=='complex') {
    tag[i].setAttribute("style", "background-color: #ff7a66;");
}
}
};
setInterval(tag_change, 500);
// Helpers and Retired
$('head').append(`
<style>
a[title*="RYang2"] {
color: blue;
}
a[title*="3141592657"] {
color: orange;
}
</style>
`);
// Cosmetics
/*waitForKeyElements ("div.cmty-phone-inline.cmty-post-top-inline", cosmetic);
function cosmetic() {
var test=document.getElementsByClassName("cmty-phone-inline cmty-post-top-inline");
for (var i = 0; i < test.length; i++) {
if (test[i].childNodes[1]==test[i].querySelectorAll("a[href='/community/user/254592']")[0]) {
Two next siblings is upvote, four next siblings is body
    var body=test[i].nextSibling.nextSibling.nextSibling.nextSibling;
    body.setAttribute("style","background-color: pink;");
}
}};
setInterval(cosmetic, 3000);*/
// Bump Button
function bump() {
$('.cmty-post-right.no-print').each(function () {
var sidebar=document.getElementsByClassName("cmty-post-right no-print");
var bump_node=document.createElement("SPAN");
bump_node.className="cmty-post-bump aops-font";
bump_node.setAttribute("onclick", "bumping()")
var t = document.createTextNode(")");
bump_node.appendChild(t);
if ($(this).children().last().html()==')') {
    return false;
}
else {
$(this).append(bump_node);
}
})};
setInterval(bump,3000);