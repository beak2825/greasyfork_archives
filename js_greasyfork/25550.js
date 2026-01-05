// ==UserScript==
// @name        Bot for typeracer.com
// @namespace   type_bot
// @include     http://play.typeracer.com/
// @version     1.03
// @grant       none
// @description:en A simple bot for typeracer.
// @description A simple bot for typeracer.
// @downloadURL https://update.greasyfork.org/scripts/25550/Bot%20for%20typeracercom.user.js
// @updateURL https://update.greasyfork.org/scripts/25550/Bot%20for%20typeracercom.meta.js
// ==/UserScript==


var CURRENT_WORD_ID = "nhwMiddlegwt-uid-6";
var ADDITIONAL_WORD_ID = "nhwMiddleCommagwt-uid-7";
var INPUT_CLASS = "txtInput";
var INPUT_CLASS_UNFOCUSED = "txtInput txtInput-unfocused";
var CLASS_OF_START = "mainMenuItem mainMenuItem-highlighted";
var CLASS_OF_START_PRACTICE = "mainMenuItem mainMenuItem-secondary";
var CONTAINER_ELEM_ID = "dUI";
var RACE_AGAIN_CLASS = "raceAgainLink";
var CONTAINER_SINGLE_PLAYER_TO_NORMAL_RACE = "roomSection";
var DEFAULT_SPEED = 700;
var tb_container = document.getElementsByClassName("themeContent").item(0);
var button_text_active = "Bot activated";
var button_text_deactivated = "Bot deactivated";
var INFO_TXT = "Reload page after every race.";
var bot_input;
var words;
var tb_input;
var tb_thread;
var tb_info;
var ev;
var space;   
ev = document.createEvent("KeyboardEvent");
ev.initKeyEvent("keypress", true, false, window, 0, 0, 0, 0, 13, 13);
space = document.createEvent("KeyboardEvent");
space.initKeyEvent("keypress",true,false, window, 0,0,0,0,32,32);


if(localStorage.type_bot === undefined)
  localStorage.type_bot = "active";

var waitforElem = setInterval(function(){
  if(document.getElementsByClassName(CLASS_OF_START).item(0) != null &&
    document.getElementsByClassName(CLASS_OF_START_PRACTICE).item(0) != null){
     console.log("waiting...");
      var RACE_ELEM = document.getElementsByClassName(CLASS_OF_START).item(0);//.item(NUMBER_RACE);
      var PRACTICE_ELEM = document.getElementsByClassName(CLASS_OF_START_PRACTICE).item(0);//.item(NUMBER_PRACTICE);
      RACE_ELEM.addEventListener("click",tb_init);
      PRACTICE_ELEM.addEventListener("click",tb_init);
     clearInterval(waitforElem);
  }
},100);


function tb_init(){
    
  var bot_button = document.createElement("input");
  bot_button.id = "bot_button";
  bot_button.type = "button";
 
  if(localStorage.type_bot == "active")
     bot_button.value = button_text_active;
  else bot_button.value = button_text_deactivated;
  
  bot_button.style.position = "absolute";
  bot_button.style.top = "100px";
  bot_button.style.left = "50px";
  bot_button.addEventListener("click",button_pressed);
  
  bot_input = document.createElement("input");
  bot_input.id = "bot_input";
  bot_input.type = "text";
  bot_input.value = DEFAULT_SPEED;
  bot_input.style.top = "150px";
  bot_input.style.left = "50px";
  bot_input.style.position = "absolute";
  bot_input.title = "Milliseconds between each word";
  
  tb_info = document.createTextNode(INFO_TXT);
  var tb_div = document.createElement("div");
  tb_div.style.position = "absolute";
  tb_div.style.top = "200px";
  tb_div.style.left = "50px";
  tb_div.appendChild(tb_info);
  
  tb_container.appendChild(tb_div);    
  tb_container.appendChild(bot_input);
  tb_container.appendChild(bot_button);
  
  setTimeout(tb_wait,2000);
  
}

function button_pressed(event){
   if(localStorage.type_bot == "active"){
     localStorage.type_bot = "unactive";
     event.target.value = button_text_deactivated;
     bot_input.disabled = true;
  }
  else{
    localStorage.type_bot = "active";
    event.target.value = button_text_active;
    bot_input.disabled = false;
  }
}

function tb_wait(){
  tb_input = document.getElementsByClassName(INPUT_CLASS_UNFOCUSED).item(0);
  tb_thread = window.setInterval(function(){
    if(tb_input.className == INPUT_CLASS)
         tb_type(tb_input);
  },100);
}

function tb_type(input){  
  
  clearInterval(tb_thread); 
  
  if(localStorage.type_bot == "active"){
    
    var WAIT_BETWEEN_WORDS = parseInt(bot_input.value);  
    if(isNaN(WAIT_BETWEEN_WORDS) || !WAIT_BETWEEN_WORDS)
      WAIT_BETWEEN_WORDS = DEFAULT_SPEED;
  
    words = document.getElementById(CURRENT_WORD_ID);
    additional = document.getElementById(ADDITIONAL_WORD_ID);
    var word = words.innerHTML;
    var add = additional.innerHTML;
    
    tb_thread = window.setInterval(function(){
        if(word == null)
          clearInterval(tb_thread);

        tb_input.value += word + add;
        tb_input.dispatchEvent(space);

        word = words.innerHTML;
        add = additional.innerHTML;

    },WAIT_BETWEEN_WORDS);
  }
}