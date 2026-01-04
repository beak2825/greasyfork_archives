// ==UserScript==
// @name         Skribbl Cheat German by Stabel
// @version      1.0.0
// @description  Fetches the Skribbl.io wordlist and displays clickable hints based on the current word's pattern.
// @author       Stabel
// @match        https://skribbl.io/*
// @grant        none
// @namespace    https://greasyfork.org/en/users/938580-stabel
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450561/Skribbl%20Cheat%20German%20by%20Stabel.user.js
// @updateURL https://update.greasyfork.org/scripts/450561/Skribbl%20Cheat%20German%20by%20Stabel.meta.js
// ==/UserScript==

const wort = document.getElementById("currentWord");
const inputChat = document.getElementById("inputChat");
const formChat = document.getElementById("formChat");
const containerGamePlayers = document.getElementById("containerGamePlayers");
const containerSidebar = document.getElementById("containerSidebar");
const votekick = document.getElementById("votekickCurrentplayer");
const logo = document.getElementsByClassName("logo logoSmall")[0];
const gameHeader = document.getElementsByClassName("gameHeader")[0];
const DomBody = document.body;
const timer = document.getElementById("timer");
const timerContainer = document.getElementsByClassName("timer-container")[0];
const inputName = document.getElementById("inputName");
const boxMessages = document.getElementById("boxMessages");
let wortVal = '';
let wortListe;
let hints;
var searchedWords = [];
var cheatOn = false;
var theme = "default";
var guiDivId;
var guessedStyleId;
var startDivId;
var guessesHref;
var themeSpanId;
var autoSpanId;
var hintsDisplaySpanId;
var playerDiv;
var contentDiv;

window.onkeydown = function(e){
    if(e.altKey){
      e.preventDefault();
    }
}

DomBody.onkeyup = (event) => {
    if(event.key === 'Alt'){
        if(!document.getElementById("guiDiv")){
            startCheat();
        } else{
            stopCheat();
        }
    }
};

function start(){
    var startDiv = document.createElement("div");
    startDiv.style.backgroundColor = "#eee";
    startDiv.style.textAlign = "center";
    startDiv.style.margin = "0 0 10px 0";
    startDiv.style.fontWeight = "bold";
    startDiv.style.borderRadius = "2px";
    startDiv.style.padding = "3px";
    startDiv.style.display = "block";
    startDiv.setAttribute("id", "startDiv");

    var startButton = document.createElement("button");
    startButton.setAttribute("id", "cheatStartButton");
    startButton.style.background = "#fafafa";
    startButton.style.borderRadius = "2px";
    startButton.style.border = "0"; 
    startButton.style.color = "rgb(0, 0, 0)";
    startButton.style.cursor = "default";
    startButton.innerHTML = "Drücke Alt zum Starten";

    startDiv.appendChild(startButton);
    containerSidebar.insertBefore(startDiv, document.getElementById("containerFreespace"));
    wort.style.userSelect = "all";
    timerContainer.style.userSelect = "all";
    startDivId = document.getElementById("startDiv");
}

function stopCheat(){
    guiDivId.remove();
    startDivId.style.display = "block";
    cheatOn = false;
}

function createGui(){
    //Erstellung der Über Div
    var guiDiv = document.createElement("div");
    guiDiv.style.padding = "1em";
    guiDiv.style.margin = "0 0 10px 0";
    guiDiv.style.fontWeight = "bold";
    guiDiv.style.borderRadius = "2px";
    guiDiv.style.userSelect = "none";
    guiDiv.setAttribute("id", "guiDiv");
    //

    //Erstellung des Animerten Hintergrundes und Sonstigen Style
    var styleTag = document.createElement("style");
    styleTag.innerHTML = `
    #guiDiv{
        background:linear-gradient(-35deg,#ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 800% 800%;animation: gradient 120s linear infinite;
    }

    @keyframes gradient{
        0%{background-position: 0% 50%;}
        50%{background-position: 100% 50%;}
        100%{background-position: 0% 50%;}
    }
    
    .aHints{
        cursor:pointer;
        text-decoration: none;
        color:#ADADC9;
    }

    a:link{
        text-decoration: none;
    }
    a:visited{
        text-decoration: none;
    }
    
    a:hover{
        text-decoration: none;
        color:#808080;
        animation:gradient 120s linear infinite;
    }
    
    .themesBtn{
        color:#696880;
        margin-right:5px;
        cursor:pointer;
        text-decoration:none;
    }
    
    @keyframes rainbow{
        0%{background-color: red}
        12.5%{background-color: orange}
        25%{background-color: yellow}
        37.5%{background-color: lime}
        50%{background-color: green}
        62.5%{background-color: #4877F4}
        75%{background-color: blue}
        87.5%{background-color: purple}
        100%{background-color: red}
    }`;
    //

    //Erstellung der Überschrift
    var nameCheat = document.createElement("p");
    nameCheat.innerHTML = "Skribbl.io Cheatv1.0 German by Stabel";
    nameCheat.style.textAlign = "center";
    nameCheat.style.margin = "0";
    nameCheat.style.color = "#C5C6D0";
    //


    //Erstellung des Schließen Buttons
    var stopButton = document.createElement("button");
    stopButton.setAttribute("id", "cheatStopButton");
    stopButton.innerHTML = "Alt";
    stopButton.style.fontSize = "12px";
    stopButton.style.position = "absolute";
    stopButton.style.top = "0";
    stopButton.style.right = "0";
    stopButton.style.border = "0";
    stopButton.style.backgroundColor = "red";
    stopButton.style.borderRadius = "2px";
    stopButton.style.padding = "1px 2px 1px 2px";
    stopButton.style.cursor = "default";
    //

    //Erstellung des Spieler Namen Spans
    var playerSpan = document.createElement("span");
    playerSpan.style.display = "none";
    playerSpan.setAttribute("id", "playerNameSpan");
    //

    //Erstellung des Theme menu
    var themesMenu = document.createElement("div");
    themesMenu.setAttribute("id","themesMenu");
    themesMenu.style.textAlign = "center";

    var themeTitle = document.createElement("p");
    themeTitle.innerHTML = "Designs";
    themeTitle.style.textAlign = "center";
    themeTitle.style.margin = "0";
    themeTitle.style.color = "#CBCBCB";
    themesMenu.appendChild(themeTitle);

    var themeSpan = document.createElement("span");
    themeSpan.style.display = "none";
    themeSpan.innerHTML = "default";
    themeSpan.setAttribute("id", "themeSpan");
    themesMenu.appendChild(themeSpan);

    var themeDefault = document.createElement("a");
    themeDefault.innerHTML = "Default";
    themeDefault.setAttribute("class", "themesBtn");
    themeDefault.setAttribute("onclick", "document.getElementById('themeSpan').innerHTML = 'default'");
    themesMenu.appendChild(themeDefault);

    var themeMeme = document.createElement("a");
    themeMeme.innerHTML = "Meme";
    themeMeme.setAttribute("class", "themesBtn");
    themeMeme.setAttribute("onclick", "document.getElementById('themeSpan').innerHTML = 'meme'");
    themesMenu.appendChild(themeMeme);
    //

    //Erstellen des Auto Guess Menues
    var autoMenu = document.createElement("div");
    autoMenu.setAttribute("id","autoMenu");
    autoMenu.style.textAlign = "center";

    var autoTitle = document.createElement("p");
    autoTitle.innerHTML = "Automatisches Raten";
    autoTitle.style.textAlign = "center";
    autoTitle.style.margin = "0";
    autoTitle.style.color = "#CBCBCB";
    autoMenu.appendChild(autoTitle);

    var autoSpan = document.createElement("span");
    autoSpan.style.display = "none";
    autoSpan.innerHTML = "off";
    autoSpan.setAttribute("id", "autoSpan");
    autoMenu.appendChild(autoSpan);

    var autoOn = document.createElement("a");
    autoOn.innerHTML = "Anschalten";
    autoOn.setAttribute("class", "themesBtn");
    autoOn.setAttribute("onclick", "document.getElementById('autoSpan').innerHTML = 'on'; if(document.getElementById('playerNameSpan').innerHTML.length == 0){document.getElementById('playerNameSpan').innerHTML = playerName}");
    autoMenu.appendChild(autoOn);

    var autoOff = document.createElement("a");
    autoOff.innerHTML = "Ausschalten";
    autoOff.setAttribute("class", "themesBtn");
    autoOff.setAttribute("onclick", "document.getElementById('autoSpan').innerHTML = 'off'");
    autoMenu.appendChild(autoOff);
    //

    //Erstellen des erratenen wort menus
    var guessedWord = document.createElement("div");
    guessedWord.style.textAlign = "center";

    var guessedWordTitle = document.createElement("p");
    guessedWordTitle.innerHTML = "Zuletzt Geraten:";
    guessedWordTitle.style.textAlign = "center";
    guessedWordTitle.style.margin = "0";
    guessedWordTitle.style.color = "#CBCBCB";
    guessedWord.appendChild(guessedWordTitle);

    var guessedWordSpan = document.createElement("span");
    guessedWordSpan.setAttribute("id", "guessedWordSpan");
    guessedWord.appendChild(guessedWordSpan);
    //

    //Einfügen der Elemente in einander
    guiDiv.appendChild(nameCheat);
    guiDiv.appendChild(stopButton);
    guiDiv.appendChild(styleTag);
    guiDiv.appendChild(guessedWord);
    guiDiv.appendChild(autoMenu);
    guiDiv.appendChild(themesMenu);
    guiDiv.appendChild(playerSpan);
    //

    //Injection der Elemente in das Skribbl.io DOM
    containerSidebar.insertBefore(guiDiv, document.getElementById("containerFreespace"));
    //
    guiDivId = document.getElementById("guiDiv");
    themeSpanId = document.getElementById("themeSpan");
    autoSpanId = document.getElementById("autoSpan");
}

function createGuesses(){
    if(!document.getElementById("guessesDiv")){
        var guessesDiv = document.createElement("div");
        guessesDiv.style.display = "none";
        guessesDiv.setAttribute("id", "guessesDiv");
        guiDivId.appendChild(guessesDiv);
    }
}

async function wordDB(){
    if(wortListe == undefined){
        try {
            wortListe = await fetch(
            'https://api.npoint.io/f3110ae2e42dbf8a5ddc'
            ).then((response) => response.json());
        } catch (e) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            return wordDB();
        }
        wortListe = JSON.stringify(wortListe);
        wortListe = wortListe.substring(1, wortListe.length - 1);
    }
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function wortSuchen(){
    const wortVal = wort.innerHTML;
    let wordRegex = wortVal.replace(/_/g, '[^ \\-"]');
    wordRegex = '"'.concat(wordRegex, '"');
    wordRegex = new RegExp(wordRegex, 'g');
    hints = wortListe.match(wordRegex);
    hints = hints.map((hint) => {
        return hint.substring(1, hint.length - 1);
    });
    hints = hints.sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    checkGuessed();
    for(i=0;i<hints.length;i++){
        for(z=0;z<searchedWords.length;z++){
            if(searchedWords[z] == hints[i]){
                delete hints[i];
            }
        }
    }
    if(document.getElementById("hintsSpan") != undefined){
        document.getElementById("hintsSpan").remove();
    }
    var hintSpan = document.createElement("span");
    hintSpan.setAttribute("id","hintsSpan");
    hintSpan.style.textAlign = "center";
    hintSpan.style.cursor = "default";
    var hintsDisplaySpan = document.createElement("span");
    hintsDisplaySpan.setAttribute("id","hintsDisplaySpan");
    for(i=0; i < hints.length; i++){
        if(hints[i] != undefined){
            var hrefHint = document.createElement("a");
            hrefHint.setAttribute("class", "aHints");
            hrefHint.setAttribute("id", hints[i]);
            hrefHint.innerHTML = hints[i];
            hrefHint.setAttribute("onclick", "{inputChat.value = event.target.innerHTML;formChat.dispatchEvent(new Event('submit', {bubbles: true,cancelable: true,}));var a = document.createElement('a');a.setAttribute('class', 'guessesHref') ;a.innerHTML = event.target.innerHTML; document.getElementById('guessesDiv').appendChild(a);document.getElementById('guessedWordSpan').innerHTML = event.target.innerHTML;event.target.remove();}");
            hrefHint.href = 'javascript:void(0);';
            if(hintsDisplaySpan.childElementCount < 20){
                hintsDisplaySpan.appendChild(hrefHint);
                hintsDisplaySpan.innerHTML += " ";
            }
            guessesHref = document.getElementsByClassName("guessesHref");
        }   
    }
    hintSpan.appendChild(hintsDisplaySpan);
    insertAfter(document.getElementById("cheatStopButton"), hintSpan);
    hintsDisplaySpanId = document.getElementById("hintsDisplaySpan");
}

function checkGuessed(){
    while(document.getElementsByClassName("guessesHref").length != 0){
        searchedWords[searchedWords.length] = guessesHref[0].innerHTML;
        guessesHref[0].remove();
    }
}


function startCheat(){
    startDivId.style.display = "none";
    createGui();
    cheatOn = true;
    createGuesses();
}

function roundReset(){
    if(parseInt(timer.innerHTML) == 0 ){
        searchedWords = [];
    }
}

function randomMemeAvatar(){
    var x = Math.floor(Math.random() * 2) + 1
    switch(x){
        case 1:
            x = "url(https://c.tenor.com/F7-S_CN5TqkAAAAi/frog-dancing.gif)";
        break;
        case 2:
            x = "url(https://c.tenor.com/7wA-N7uaDVcAAAAi/zan-rui-zhanrui.gif)";
    }
    return x;
}

function autoGuess(){
    if(autoSpanId.innerHTML == "on"){
        if(contentDiv.style.bottom == "100%"){
            if(!playerDiv.match("player guessedWord")){
                hintsDisplaySpanId.childNodes[0].click();
                document.getElementById("boxMessages").scrollTo(0,999999)
            }
        }
    }
}

function getPlayerDiv(){
    for(i=0;i<document.getElementsByClassName("player").length;i++){
        if(document.getElementsByClassName("player")[i].innerHTML.match("(You)")){
            playerDiv = document.getElementsByClassName("player")[i].outerHTML;
        }
    }
}

function getContentDiv(){
    for(i=0;i<document.getElementsByClassName("content").length;i++){
        if(document.getElementsByClassName("content")[i].outerHTML.match('style="bottom:')){
            contentDiv = document.getElementsByClassName("content")[i];
        }
    }
}


function checkTheme(){
    if(theme != themeSpanId.innerHTML){
        theme = themeSpanId.innerHTML;
        switch (theme) {
            case "default": 
                DomBody.style.background = "url(https://skribbl.io/res/background.png) center fixed";
                gameHeader.style.animation = "none";
                gameHeader.style.backgroundColor = "#eee";
                logo.setAttribute("src", "res/logo.gif");
                if(guessedStyleId != undefined){
                    guessedStyleId.innerHTML = "";
                    votekick.innerHTML = "Votekick";
                }
                for(i=0;i<containerGamePlayers.childElementCount; i++){
                    containerGamePlayers.childNodes[i].childNodes[2].childNodes[0].style.display = "block";
                    containerGamePlayers.childNodes[i].childNodes[2].childNodes[1].style.display = "block";
                    containerGamePlayers.childNodes[i].childNodes[2].childNodes[2].style.display = "block";
                }
                if(document.getElementsByClassName("memeAvatar").length != 0){
                    for(i=0;i<document.getElementsByClassName("memeAvatar").length;i++){
                        document.getElementsByClassName("memeAvatar")[i].style.display = "none";
                    }
                }
                break;
            case "meme":
                DomBody.style.background = "url(https://c.tenor.com/fX2gnOTguswAAAAC/memz-virus.gif) center fixed";
                gameHeader.style.animation = "rainbow 10s infinite";
                logo.setAttribute("src", "https://c.tenor.com/CHc0B6gKHqUAAAAi/deadserver.gif")
                if(document.getElementById("guessedStyle") == undefined){
                    var guessedStyle = document.createElement("style");
                    guessedStyle.innerHTML = `
                    #containerGamePlayers .player:nth-child(even) {
                        background-color: #666583;
                    }
                    .guessedWord{
                        animation: rainbow 5s infinite;
                        background-image: url();
                    }
                    #containerGamePlayers .player:nth-child(odd){
                        background: repeating-linear-gradient(45deg, #144274, #144274 15px, transparent 15px, transparent 30px);
                        animation: rainbowGradient 20s linear infinite;
                        background-size: 500% 500%;
                    }
                    @keyframes rainbowGradient{
                        0%{background-color: red;background-position: 0% 50%;}
                        12.5%{background-color: orange}
                        25%{background-color: yellow}
                        37.5%{background-color: lime}
                        50%{background-color: green;background-position: 100% 50%;}
                        62.5%{background-color: #4877F4}
                        75%{background-color: blue}
                        87.5%{background-color: purple}
                        100%{background-color: red;background-position: 0% 50%;}
                    }
                    @keyframes colorAni{
                        0%{background-color: #696880;}
                        50%{background-color: whitesmoke}
                        100%{background-color: #696880;}
                    }
                    .avatar .drawing{
                        background-image: url(https://c.tenor.com/hrvpJjHYFLoAAAAi/pepe-pepe-drawing.gif);
                        width: 48px;
                        height: 48px;
                    }
                    .btn-warning {
                        color: #fff;
                        background-color: transparent;
                        border-color: #000000;
                        background-image: url(https://c.tenor.com/q7p4R3NaP7AAAAAC/richie-souf-among-us.gif);
                        background-size: 200px 142px;
                        height: 142px;
                    }
                    @keyframes bg-scrolling-reverse {
                        100% {
                          background-position: 50px 50px;
                        }
                      }
                      @keyframes bg-scrolling {
                        0% {
                          background-position: 50px 50px;
                        }
                      }
                      #boxMessages{
                        background: url("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/38b75c66-8378-44aa-805d-987cf272a6a7/dasap2f-9b7d4d31-308e-42c3-9b1e-1d117147cc98.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTpmaWxlLmRvd25sb2FkIl0sIm9iaiI6W1t7InBhdGgiOiIvZi8zOGI3NWM2Ni04Mzc4LTQ0YWEtODA1ZC05ODdjZjI3MmE2YTcvZGFzYXAyZi05YjdkNGQzMS0zMDhlLTQyYzMtOWIxZS0xZDExNzE0N2NjOTguZ2lmIn1dXX0.yHm0fBwEkUBWqdXpkpEpC8gHyNF2jhOaHESbrWDV9xI") repeat 0 0;
                        animation: bg-scrolling-reverse 0.92s infinite;
                        animation-timing-function: linear;
                      }
                      #boxChat, #containerChat {
                        animation: rainbow 5s infinite;
                    }
                    #boxMessages p {
                        animation: colorAni 5s infinite;
                    }
                    .logoSmall {
                        width: 82px;
                        height: 82px;
                    }
                    #audio{
                        background: url(https://c.tenor.com/aaKo1WqBJlQAAAAC/mute-command.gif) center no-repeat;
                        width: 96px;
                        height: 96px;
                        background-size: contain;
                    }
                    `;
                    votekick.innerHTML = "<br><br><br><br>Votekick";
                    guessedStyle.setAttribute("id", "guessedStyle");
                    guiDivId.appendChild(guessedStyle);
                    guessedStyleId = document.getElementById("guessedStyle");
                } else{
                    guessedStyleId.innerHTML = `
                    #containerGamePlayers .player:nth-child(even) {
                        background-color: #666583;
                    }
                    .guessedWord{
                        animation: rainbow 5s infinite;
                        background-image: url();
                    }
                    #containerGamePlayers .player:nth-child(odd){
                        background: repeating-linear-gradient(45deg, #144274, #144274 15px, transparent 15px, transparent 30px);
                        animation: rainbowGradient 20s linear infinite;
                        background-size: 500% 500%;
                    }
                    @keyframes rainbowGradient{
                        0%{background-color: red;background-position: 0% 50%;}
                        12.5%{background-color: orange}
                        25%{background-color: yellow}
                        37.5%{background-color: lime}
                        50%{background-color: green;background-position: 100% 50%;}
                        62.5%{background-color: #4877F4}
                        75%{background-color: blue}
                        87.5%{background-color: purple}
                        100%{background-color: red;background-position: 0% 50%;}
                    }
                    @keyframes colorAni{
                        0%{background-color: #696880;}
                        50%{background-color: whitesmoke}
                        100%{background-color: #696880;}
                    }
                    .avatar .drawing{
                        background-image: url(https://c.tenor.com/hrvpJjHYFLoAAAAi/pepe-pepe-drawing.gif);
                        width: 48px;
                        height: 48px;
                    }
                    .btn-warning {
                        color: #fff;
                        background-color: transparent;
                        border-color: #000000;
                        background-image: url(https://c.tenor.com/q7p4R3NaP7AAAAAC/richie-souf-among-us.gif);
                        background-size: 200px 142px;
                        height: 142px;
                    }
                    @keyframes bg-scrolling-reverse {
                        100% {
                          background-position: 50px 50px;
                        }
                      }
                      @keyframes bg-scrolling {
                        0% {
                          background-position: 50px 50px;
                        }
                      }
                      #boxMessages{
                        background: url("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/38b75c66-8378-44aa-805d-987cf272a6a7/dasap2f-9b7d4d31-308e-42c3-9b1e-1d117147cc98.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTpmaWxlLmRvd25sb2FkIl0sIm9iaiI6W1t7InBhdGgiOiIvZi8zOGI3NWM2Ni04Mzc4LTQ0YWEtODA1ZC05ODdjZjI3MmE2YTcvZGFzYXAyZi05YjdkNGQzMS0zMDhlLTQyYzMtOWIxZS0xZDExNzE0N2NjOTguZ2lmIn1dXX0.yHm0fBwEkUBWqdXpkpEpC8gHyNF2jhOaHESbrWDV9xI") repeat 0 0;
                        animation: bg-scrolling-reverse 0.92s infinite;
                        animation-timing-function: linear;
                      }
                      #boxChat, #containerChat {
                        animation: rainbow 5s infinite;
                    }
                    #boxMessages p {
                        animation: colorAni 5s infinite;
                    }
                    .logoSmall {
                        width: 82px;
                        height: 82px;
                    }
                    #audio{
                        background: url(https://c.tenor.com/aaKo1WqBJlQAAAAC/mute-command.gif) center no-repeat;
                        width: 96px;
                        height: 96px;
                        background-size: contain;
                    }
                    `;
                    votekick.innerHTML = "<br><br><br><br>Votekick";
                }
                for(i=0;i<containerGamePlayers.childElementCount; i++){
                    containerGamePlayers.childNodes[i].childNodes[2].childNodes[0].style.display = "none";
                    containerGamePlayers.childNodes[i].childNodes[2].childNodes[1].style.display = "none";
                    containerGamePlayers.childNodes[i].childNodes[2].childNodes[2].style.display = "none";
                }
                if(document.getElementsByClassName("memeAvatar").length == 0){
                    for(i=0;i<document.getElementsByClassName("player").length;i++){
                        var memeAvatarDiv = document.createElement("div");
                        memeAvatarDiv.style.background = randomMemeAvatar();
                        memeAvatarDiv.style.backgroundSize = "48px 48px";
                        memeAvatarDiv.style.width = "48px";
                        memeAvatarDiv.style.height = "48px";
                        memeAvatarDiv.setAttribute("class", "memeAvatar");
                        document.getElementsByClassName("player")[i].childNodes[2].appendChild(memeAvatarDiv);
                    }
                }else {
                    for(i=0;i<document.getElementsByClassName("memeAvatar").length;i++){
                        document.getElementsByClassName("memeAvatar")[i].style.display = "block";
                    }
                }
            }
    } 
}

start();
wordDB();

setInterval(() => {
    if(cheatOn == true){
        wortSuchen();
        roundReset();
        checkTheme();
        getPlayerDiv();
        getContentDiv();
    }
}, 500);

setInterval(() => {
    if(cheatOn == true){
        autoGuess();
    }
}, 950);