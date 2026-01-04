// ==UserScript==
// @name         Lichess Whisper Switch by ipr
// @namespace    http://tampermonkey.net/
// @version      0.3.16
// @description  A simple GreaseMonkey script to toggle auto-whisper on/off and at the same time prepending the current move
// @author       You
// @match        https://lichess.org/*
// @grant        GM_addStyle
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/422291/Lichess%20Whisper%20Switch%20by%20ipr.user.js
// @updateURL https://update.greasyfork.org/scripts/422291/Lichess%20Whisper%20Switch%20by%20ipr.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

//--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              10px;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 20px;
    }
    #whisperButton {
        background-color: #384722; /* Green */
        border: none;
        color: white;
        padding: 12px 12px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 12px;
    }
    #prependMoveButton {
        background-color: #384722; /* Green */
        border: none;
        color: white;
        padding: 12px 12px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 12px;
    }

    #hiddenPrependMoveSwitch {
        display: none;
    }
    #hiddenWhisperSwitch {
        display: none;
    }
` );


function blackMoved(){
    return document.getElementsByTagName('l4x')[0].children.length % 3 === 0;
}

function getFormattedMoveNumber(){
    const move_number = Math.round(document.getElementsByTagName('l4x')[0].children.length / 3);
    const move = document.getElementsByTagName('l4x')[0].children[document.getElementsByTagName('l4x')[0].children.length -1].textContent;
    if (blackMoved()) {
        return "(" + move_number + "..." + move + ")";
    }
    else {
        return "(" + move_number + "." + move + ")";
    }
}

function gameInProgress(){
    const accepted_game_conditions_when_not_playing = ["game__tv", "game__tournament"];
    if (
        document.getElementsByClassName("game__meta")[0].childNodes.length === 1 ||
        accepted_game_conditions_when_not_playing.some(e=>document.getElementsByClassName("game__meta")[0].childNodes[1].className.includes(e)) ||
        document.getElementsByClassName("game__meta")[0].childNodes[1].childNodes[0].nodeValue.includes("Chess960") // 960 game
       )
    {
      return true;
    }
    else {
      return false;
    }
}

function shouldPrepend(){
    const moves_have_been_played = Boolean(document.getElementsByTagName('l4x')[0]);
    return moves_have_been_played && gameInProgress();
}


const user_is_deleting_comment = (event)=>{
   const inputType = event.inputType;
   switch(inputType)
   {
      case "deleteContentBackward":
      return true;
      case "deleteContentForward":
      return true;
      default:
      return false;
   }
};


function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const move_prepend =  new RegExp('\\([0-9]+\.{1,3}.{1,5}\\) ', 'g');
const whisper_prepend = new RegExp('^\/w ', 'ig');
const current_move_number_matcher = () => new RegExp(escapeRegExp(getFormattedMoveNumber()), "g");


const strip_prependers = (value) => {
  return value.replace(whisper_prepend,"").replace(move_prepend, "");
};


const whisper = (event)=>{
    let chatbox = document.getElementsByClassName('mchat__say')[0];
    const inputValue = event.currentTarget.value;
    console.log("KEY CODE" + inputValue);
    if (shouldPrepend() && !user_is_deleting_comment(event)){
				chatbox.value = (current_move_number_matcher().test(chatbox.value) && whisper_prepend.test(chatbox.value)) ? 
                         chatbox.value :
                         '/w ' + getFormattedMoveNumber() + " " + strip_prependers(chatbox.value);
    }
};

const whisper_no_move = (event)=>{
    const chatbox = document.getElementsByClassName('mchat__say')[0];
    if (shouldPrepend() && !user_is_deleting_comment(event)){
				chatbox.value = (!move_prepend.test(chatbox.value) && whisper_prepend.test(chatbox.value)) ? 
                         chatbox.value :
                         '/w ' + strip_prependers(chatbox.value);
    }
};

const nowhisper = (event)=>{
    const chatbox = document.getElementsByClassName('mchat__say')[0];
    if (shouldPrepend() && !user_is_deleting_comment(event)){
				chatbox.value = (current_move_number_matcher().test(chatbox.value) && !whisper_prepend.test(chatbox.value)) ? 
                         chatbox.value :
                         getFormattedMoveNumber() + " " + strip_prependers(chatbox.value);
    }
};


function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function userInPlayers(player, index, array){
    return player.textContent.includes(document.getElementById("user_tag").text);
}

function userIsPlaying(){
    const players = Array.from(document.getElementsByClassName("game__meta__players")[0].children);
    return players.filter(userInPlayers).length !== 0;
}


const checkIfMetaExists = setInterval(function() {
    const material = document.getElementsByClassName("game__meta")[0];
    const chatbox = document.getElementsByClassName('mchat__say')[0];
    const standings = document.getElementsByClassName('mchat__tab tourStanding')[0];

    if (material && chatbox && !standings) {
        clearInterval(checkIfMetaExists);

        let div_block = document.createElement ('div');
        div_block.setAttribute("id", "Whisperer");
        if (gameInProgress()){
            div_block.innerHTML = '<button id="whisperButton" type="button">Whisper</button><button id="prependMoveButton" type="button">Prepend move</button><input type="checkbox" id="hiddenPrependMoveSwitch" value="on" class="hidden"><input type="checkbox" id="hiddenWhisperSwitch" value="on" class="hidden">';
            insertAfter(material, div_block);

            document.getElementById ("whisperButton").addEventListener (
                "click", whisperClickAction, false);
            document.getElementById ("prependMoveButton").addEventListener (
                "click", prependMoveClickAction, false);

            // reset the colors now so that they match the theme
            resetButtonColorOn(document.getElementById("whisperButton"));
            resetButtonColorOn(document.getElementById("prependMoveButton"));

            if (!userIsPlaying()){
                document.getElementById("hiddenWhisperSwitch").value = "off";
                document.getElementById("whisperButton").style.display = "none";
            }

            setChatboxInputMode();
        }
    }
}, 25);

const checkStatusUpdates = setInterval(function() {
    if (document.getElementsByClassName("result-wrap")[0]){
        document.getElementById("hiddenWhisperSwitch").value = "off";
        document.getElementById("hiddenPrependMoveSwitch").value = "off";
        document.getElementById("Whisperer").style.display = "none";
        whisperClickAction();
        prependMoveClickAction();
        clearInterval(checkStatusUpdates);
    }

}, 25);


function setChatboxInputMode(){
    let chatbox = document.getElementsByClassName('mchat__say')[0];
    const whisper_switch_value = document.getElementById("hiddenWhisperSwitch").value;
    const prepend_switch_value = document.getElementById("hiddenPrependMoveSwitch").value;

    if (whisper_switch_value === "on"){
        if (prepend_switch_value === "on"){
            resetButtonColorOn(document.getElementById("prependMoveButton"));
            chatbox.oninput = whisper;
        }
        else{
            chatbox.oninput = whisper_no_move;
        }
    }
    else{
        if (prepend_switch_value === "on"){
            chatbox.oninput = nowhisper;
        }
        else{
            chatbox.oninput = null;
        }
    }
}

function resetButtonColorOff (button) {
  const colors = {
    "dark": {"background": "#262421", "opacity": "0.5"}, // dark gray
    "transp": {"background": "#9A2F2E", "opacity": "0.5"}, // red
    "light": {"background": "#262421", "opacity": "0.5"} // white
  };
  for (const [key, value] of Object.entries(colors)) {
    if (document.body.classList.contains(key)){
      for (const [property, property_value] of Object.entries(value)) {
        button.style[property]=property_value;
      }
      break;
    }
  }
}

function resetButtonColorOn (button) {
  const colors = {
    "dark": {"background": "#384722", "opacity": "1"}, // dark green
    "transp": {"background": "#40a35a", "opacity": "0.8"}, // light green
    "light": {"background": "#307843", "opacity": "0.8"} // light green
  };
  for (const [key, value] of Object.entries(colors)) {
    if (document.body.classList.contains(key)){
      for (const [property, property_value] of Object.entries(value)) {
        button.style[property]=property_value;
      }
      break;
    }
  }
}


function whisperClickAction (zEvent) {
    const whisper_switch_value = document.getElementById("hiddenWhisperSwitch").value;

    if (whisper_switch_value === "on"){
        document.getElementById("hiddenWhisperSwitch").value = "off";
        resetButtonColorOff(document.getElementById("whisperButton"));
    }
    else{
        document.getElementById("hiddenWhisperSwitch").value = "on";
        resetButtonColorOn(document.getElementById("whisperButton"));
    }
    setChatboxInputMode();
}

function prependMoveClickAction (zEvent) {
    const prepend_switch_value = document.getElementById("hiddenPrependMoveSwitch").value;

    if (prepend_switch_value === "on"){
        document.getElementById("hiddenPrependMoveSwitch").value = "off";
        resetButtonColorOff(document.getElementById("prependMoveButton"));
    }
    else {
        document.getElementById("hiddenPrependMoveSwitch").value = "on";
        resetButtonColorOn(document.getElementById("prependMoveButton"));
    }
    setChatboxInputMode();
}
