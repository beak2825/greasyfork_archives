// ==UserScript==
// @name        Reload & autoscroll buttons at character.ai
// @namespace   https://sleazyfork.org/en/users/927364-mozgovlom
// @match       https://beta.character.ai/chat?char=*
// @grant       none
// @run-at      document-end
// @license     MIT
// @version     2.2
// @author      Mozgovlom
// @description Adds menu with autoscrolling, page reloading, char's info, chat styling, replies numbering and bookmarking, imagegen hiding, anyone's last reply deleting, etc.
// @icon          https://characterai.io/static/logo512.png
 
 
// @downloadURL https://update.greasyfork.org/scripts/463870/Reload%20%20autoscroll%20buttons%20at%20characterai.user.js
// @updateURL https://update.greasyfork.org/scripts/463870/Reload%20%20autoscroll%20buttons%20at%20characterai.meta.js
// ==/UserScript==
'use strict';
//
//------------------------------User settings------------------------------
//
 
// If enabled, will hide new feedback buttons
// Default: false
const hide_new_rating = false;
// If enabled, will use "safe" autoscrolling
// Default: false
const safe_autoscroll = false;
// If enabled, will reload the page in case of 500 Internal Server Error to continue autoscrolling
// Default: true
const reload_if_autoscroll = true;
// If enabled, will show a persistent notification in case of 500 Internal Server Error hinting you to reload the page
// Default: true
const error500_persistent = true;
// If enabled, will show reply number inside the blue "c.AI" label and will allow "bookmarking" on click
// Default: true
const reply_numbering = true;
// If enabled, will show « and » buttons to scroll messages by 5
// Default: true
const quickscrll = true;
 
const DAY_background_image = "https://i.imgur.com/qzWTGAn.jpg";                    //----------LIGHT mode; default background image url goes inside " " ----------
const NIGHT_background_image = "https://i.imgur.com/xnDnQHc.jpg";                  //----------DARK mode;  default background image url goes inside " " ----------
const DAY_user_bubble = "lightsteelblue";                                          //----------LIGHT mode; USER chat bubble color goes inside " " ----------
const NIGHT_user_bubble = "#310062";                                               //----------DARK mode;  USER chat bubble color goes inside " " ----------
const DAY_char_bubble = "aquamarine";                                              //----------LIGHT mode; CHAR chat bubble color goes inside " " ----------
const NIGHT_char_buble = "#560319";                                                //----------DARK mode;  CHAR chat bubble color goes inside " " ----------
const DAY_label_glow = "green";                                                    //----------LIGHT mode; swipe bookmarking color goes inside " " ----------
const NIGHT_label_glow = "deeppink";                                               //----------DARK mode;  swipe bookmarking color goes inside " " ----------
 
//
//------------------------------Intercepting XMLHttpRequest------------------------------
//
let XHR_interception_promise = new Promise(function(XHR_interception_resolve, XHR_interception_reject) {
  var original_prototype_open = XMLHttpRequest.prototype.open;
  const intercepted_data_object = {};
  XMLHttpRequest.prototype.open = function(method, url, async) {
    if (url.startsWith('https://beta.character.ai/chat/history/continue/')) {
      this.addEventListener('load', function() {
        let info1 = JSON.parse(this.responseText);
        intercepted_data_object.history_external_id = info1.external_id;
      });
    };
    if (url.startsWith('https://beta.character.ai/chat/character/info')) {
      this.addEventListener('load', function() {
        let info2 = JSON.parse(this.responseText);
        intercepted_data_object.tgt = info2.character.participant__user__username;
        intercepted_data_object.name = info2.character.name;
        intercepted_data_object.participant__num_interactions = info2.character.participant__num_interactions;
        intercepted_data_object.greeting = info2.character.greeting;
        intercepted_data_object.title = info2.character.title;
        intercepted_data_object.description = info2.character.description;
        intercepted_data_object.avatar_file_name = info2.character.avatar_file_name;
        intercepted_data_object.base_img_prompt = info2.character.base_img_prompt;
      });
    };
    if (url.startsWith('https://beta.character.ai/chat/history/msgs/user/?history_external_id=')) {          //List of messages that are visible on screen
      this.addEventListener('load', function() {
        let messages = this.responseText;          //Now message id contains more than 15 symbols, so browser javascript was rounding it off. So now I pass it as a string instead of a number.
        let info3 = JSON.parse(messages);
        let message_id_regex = /"id": ([0-9]+)/g;
        let message_id_array = [...messages.matchAll(message_id_regex)];          // An array with just the message ids as strings.
        intercepted_data_object.last_msg_id = message_id_array[info3.messages.length - 1][1];
        intercepted_data_object.last_msg_text = info3.messages[info3.messages.length - 1].text;
        for (let i = info3.messages.length - 1; i > -1; i--) {
          if (info3.messages[i].src__is_human == true) {
            intercepted_data_object.parent_msg_id = message_id_array[i][1];
            break;
          };
        };
 
      });
    };
    XHR_interception_resolve(intercepted_data_object);
    original_prototype_open.apply(this, [method, url, async]);        // I've assembled this piece of code without real understanding of this particular part
  };
});
//
//------------------------------Arrow right keypress for swiping------------------------------
//
function ArrowRightKeyDown () {
  document.body.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      key: 'ArrowRight',
    })
  );
  console.log("Arrow right pressed");
};
//
//------------------------------Arrow left keypress for swiping------------------------------
//
function ArrowLeftKeyDown () {
  document.body.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      key: 'ArrowLeft',
    })
  );
  console.log("Arrow left pressed");
};
//
//------------------------------Timed MutationObserver------------------------------
//
function waitForElement(querySelector, timeout) {
  return new Promise(function(resolve, reject) {
    var timer = false;
    if (document.querySelectorAll(querySelector).length) {
      return resolve();
    };
    const observer = new MutationObserver(function () {
      if (document.querySelectorAll(querySelector).length) {
        observer.disconnect();
        //console.log("Timed MutationObserver is disconnected");
        if (timer !== false) clearTimeout(timer);
        return resolve();
      };
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    if (timeout) {
      timer = setTimeout(function() {
        observer.disconnect();
        //console.log("Timed MutationObserver is disconnected");
        reject();
      }, timeout);
    };
  });
};
//
//------------------------------Data in sessionStorage is valid only for a particular tab------------------------------
//
var sessionStorage_MasterButton = sessionStorage.getItem("RAs_MasterButton");
console.log("Master button status =", sessionStorage_MasterButton);
var sessionStorage_ReloadScroll = sessionStorage.getItem("RAs_ReloadScroll");
console.log("Reload & Scroll switch status =", sessionStorage_ReloadScroll);
var sessionStorage_Autoscroll = sessionStorage.getItem("RAs_Autoscroll");
console.log("Autoscroll switch status =", sessionStorage_Autoscroll);
var sessionStorage_ImageGen = sessionStorage.getItem("RAs_ImageGen");
console.log("Hide generated images switch status =", sessionStorage_ImageGen);
var sessionStorage_GlobalWp = sessionStorage.getItem("RAs_GlobalWallpaper");
console.log("Wallpaper switch status =", sessionStorage_GlobalWp);
var sessionStorage_LocalWp = sessionStorage.getItem("RAs_LocalWallpaper");
console.log("Local wallpaper switch status =", sessionStorage_LocalWp);
var sessionStorage_AvatarYou = sessionStorage.getItem("RAs_AvatarYou");
console.log("Local avatar for you switch status =", sessionStorage_AvatarYou);
var sessionStorage_AvatarChar = sessionStorage.getItem("RAs_AvatarChar");
console.log("Local avatar for char switch status =", sessionStorage_AvatarChar);
var sessionStorage_ChatBg = sessionStorage.getItem("RAs_ChatBackground");
console.log("Chat backgroung color switch status =", sessionStorage_ChatBg);
var sessionStorage_ChatStyle_1 = sessionStorage.getItem("RAs_ChatStyle_1");
console.log("Chat bubbles style 1 switch status =", sessionStorage_ChatStyle_1);
var sessionStorage_ChatStyle_2 = sessionStorage.getItem("RAs_ChatStyle_2");
console.log("Chat bubbles style 2 switch status =", sessionStorage_ChatStyle_2);
var sessionStorage_ChatStyle_3 = sessionStorage.getItem("RAs_ChatStyle_3");
console.log("Chat bubbles style 3 switch status =", sessionStorage_ChatStyle_3);
//
//------------------------------Data in localStorage is saved across browser sessions------------------------------
//
var localStorage_nativedark = localStorage.getItem ("darkMode");
console.log("Native dark mode switch status =", localStorage_nativedark);
const localStorage_authorization = JSON.parse(localStorage.getItem('char_token')).value;
console.log("Authorization token =", localStorage_authorization);
//
//------------------------------Master style------------------------------
//
var master_style = document.createElement('style');
master_style.classList.add('Reload_Autoscroll_script', 'master_style');
master_style.innerHTML = `
  :root {
    --master_button_height: 40px;
    --master_button_width: 300px;
    --menu_item_button_height: 40px;
    --padding_all: 4px;
  }
  div[class="Reload_Autoscroll_script master_button"] {
    cursor: pointer;
    user-select: none;
    border: 3px solid gray;
    padding: var(--padding_all);
    height: var(--master_button_height);
    width: var(--master_button_width);
    position: absolute;
    bottom: 5px;
    left: 5px;
    background-color: lightsteelblue;
    color: black;
    font-weight: bold;
    text-align: center;
    justify-content: center;
    align-items: center;
    z-index: 101;
    overflow: hidden;
  }
  div[class="Reload_Autoscroll_script master_button"]:hover {
    background:#789ac7;
  }
  div[class^="Reload_Autoscroll_script master_menu"] {
    user-select: none;
    display:none;
    position: absolute;
    width: var(--master_button_width);
    z-index: 101;
    bottom: calc(var(--master_button_height) + 5px);
    left: 5px;
  }
  div[class="Reload_Autoscroll_script master_menu unhide"] {
    display: flex;
    flex-direction: column;
  }
  div[class^="Reload_Autoscroll_script"][class*="menu_item"] {
    cursor: pointer;
    background-color: rgba(250,250,250,1);
    box-shadow: 0px 0px 1px 0px rgba(0,0,0,0.5) inset;
    padding: var(--padding_all);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-width: 50px;
    height: var(--menu_item_button_height);
    white-space: nowrap;
  }
  div[class^="Reload_Autoscroll_script"][class*="menu_item"][class*="dropdown_only"] {
    cursor:default;
  }
  div[class^="Reload_Autoscroll_script"][class*="menu_item"]:hover {
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,1) inset;
  }
  div[class^="Reload_Autoscroll_script"][class*="dropdown_menu"] {
    display: none;
    min-width: 150px;
    height: auto;
  }
  div[class^="Reload_Autoscroll_script"][class*="menu_item"]:hover div[class^="Reload_Autoscroll_script"][class*="dropdown_menu"] {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: var(--master_button_width);
    bottom: 0px;
  }
  div[class^="Reload_Autoscroll_script"][class*="table_inside"] {
    min-width: 50vw !important;
    max-width: 80vw;
    max-height: 70vh;
    overflow: auto;
    border: 2px solid black;
    white-space: normal;
  }
  table[class^="Reload_Autoscroll_script"], table[class^="Reload_Autoscroll_script"]>tbody>tr, table[class^="Reload_Autoscroll_script"]>tbody>tr>td {
    cursor:default;
    user-select: text;
    border: 1px solid rgba(0,0,0,0.3);
    border-collapse: collapse;
    background-color: rgba(250,250,250,1);
    overflow: auto;
    font-size: min(2vw, 1rem);
  }
  div[class^="Reload_Autoscroll_script"][class*="grid"] {
    display: inline-grid;
    align-items: center;
    width: auto;
    height: auto;
  }
  @media screen and (max-width: 1919px) {
    :root {
      --master_button_width: 200px;
    }
  }
  @media screen and (max-width: 1279px) {
    :root {
      --master_button_height: 37px;
      --master_button_width: 130px;
      --menu_item_button_height: auto;
    }
  }
  @media screen and (max-width: 799px) {
    :root {
      --master_button_height: 24px;
      --master_button_width: 121px;
      --padding_all: 0px;
    }
    div[class="Reload_Autoscroll_script master_button"] {
      border: none;
    }
  }
`;
//
//------------------------------Blur user style------------------------------
//
var blur_user_style = document.createElement('style');
blur_user_style.classList.add('Reload_Autoscroll_script', 'blur_user_style');
blur_user_style.innerHTML = `
  div[class="row p-0 m-0"]:has(div[class="msg user-msg"])>div[class="col-auto p-0"]>div[class=" sb-avatar sb-avatar--text"] {
    filter: blur(7px) !important;
  }
  div[class="row p-0 m-0"]:has(div[class="msg user-msg"])>div[class="col-auto p-0"]>div[class=" sb-avatar sb-avatar--src"] {
    filter: blur(7px) !important;
  }
  div[class="col-10 p-2 pt-0"]:has(div[class="msg user-msg"])>div[class="justify-content-start"]>span[class="msg-author-name"] {
    filter: blur(5px) !important;
    text-decoration: line-through;
    text-decoration-color: black;
    text-decoration-style: wavy;
    text-decoration-thickness: 5px;
  }
`;
//
//------------------------------Blur char style------------------------------
//
var blur_char_style = document.createElement('style');
blur_char_style.classList.add('Reload_Autoscroll_script', 'blur_char_style');
blur_char_style.innerHTML = `
  div[class="msg-row msg-row-light-bg"]:has(div[class="msg char-msg"])>div[class="row p-0 m-0"]>div[class="col-auto p-0"]>div[class="justify-content-start"]>div[class=" sb-avatar sb-avatar--text"] {
    filter: blur(7px) !important;
  }
  div[class="msg-row msg-row-light-bg"]:has(div[class="msg char-msg"])>div[class="row p-0 m-0"]>div[class="col-auto p-0"]>div[class="justify-content-start"]>div[class=" sb-avatar sb-avatar--src"] {
    filter: blur(7px) !important;
  }
  div[class="msg-row msg-row-light-bg"]:has(div[class="msg char-msg"])>div[class="row p-0 m-0"]>div[class="col-10 p-2 pt-0"]>div[class="justify-content-start"]>span {
    filter: blur(5px) !important;
    text-decoration: line-through;
    text-decoration-color: black;
    text-decoration-style: wavy;
    text-decoration-thickness: 5px;
  }
 
`;
//
//------------------------------Hide char generated images style------------------------------
//
var imagegen_style = document.createElement('style');
imagegen_style.classList.add('Reload_Autoscroll_script', 'imagegen_style');
imagegen_style.innerHTML = `
  div[class="msg char-msg"]>div>img {
    display: none !important;
  }
  div[class="msg char-msg"]>div>div>div[class="annotation-buttons-container col mb-3"] {
    display: none !important;
  }
  div[class="msg char-msg"]>div>div[class="d-flex"] {
    display: none !important;
  }
`;
//
//------------------------------Hide new feedback buttons style------------------------------
//
var hide_new_rating_style = document.createElement('style');
hide_new_rating_style.classList.add('Reload_Autoscroll_script', 'hide_new_rating_style');
hide_new_rating_style.innerHTML = `
  div[class="annotation-buttons-container col mb-3"]>div[class="d-flex align-items-center"]:nth-of-type(2) {
    display: none !important;
  }
`;
//
//------------------------------Global wallpaper style------------------------------
//
if (localStorage_nativedark === "true") {
  var var_global_background_image = NIGHT_background_image;
} else {
  var var_global_background_image = DAY_background_image;
};
var global_wallpaper_style = document.createElement('style');
global_wallpaper_style.classList.add('Reload_Autoscroll_script', 'global_wallpaper_style');
global_wallpaper_style.innerHTML = `
  body {
    background-image: url("${var_global_background_image}");
    background-repeat: no-repeat;
    background-size: cover;
  }
`;
//
//------------------------------Local wallpaper style------------------------------
//
function local_wallpaper_style_innerHTML(arg1) {
  return `
  body {
    background-image: url("${arg1}");
    background-repeat: no-repeat;
    background-size: cover;
  }
`
}
var local_wallpaper_style = document.createElement('style');
local_wallpaper_style.classList.add('Reload_Autoscroll_script', 'local_wallpaper_style');
local_wallpaper_style.innerHTML = local_wallpaper_style_innerHTML (sessionStorage.getItem("RAs_LocalWallpaper"));
 
//
//------------------------------Local avatar for you style------------------------------
//
function avatar_local_you_style_innerHTML (arg1) {
  return `
  div[class="row p-0 m-0"]:has(div[class="msg user-msg"])>div[class="col-auto p-0"]>div[class=" sb-avatar sb-avatar--text"]>div {
    background-image: url("${arg1}") !important;
    background-repeat: no-repeat  !important;
    background-size: cover  !important;
  }
  div[class="row p-0 m-0"]:has(div[class="msg user-msg"])>div[class="col-auto p-0"]>div[class=" sb-avatar sb-avatar--text"]>div>div {
    display: none !important;
  }
  div[class="row p-0 m-0"]:has(div[class="msg user-msg"])>div[class="col-auto p-0"]>div[class=" sb-avatar sb-avatar--src"] {
    background-image: url("${arg1}") !important;
    background-repeat: no-repeat  !important;
    background-size: cover  !important;
  }
  div[class="row p-0 m-0"]:has(div[class="msg user-msg"])>div[class="col-auto p-0"]>div[class=" sb-avatar sb-avatar--src"]>img {
    display: none !important;
  }
`
};
var avatar_local_you_style = document.createElement('style');
avatar_local_you_style.classList.add('Reload_Autoscroll_script', 'avatar_local_you_style');
avatar_local_you_style.innerHTML = avatar_local_you_style_innerHTML (sessionStorage.getItem("RAs_AvatarYou"));
//
//------------------------------Local avatar for char style------------------------------
//
function avatar_local_char_style_innerHTML (arg1) {
  return `
  div[class="msg-row msg-row-light-bg"]:has(div[class="msg char-msg"])>div[class="row p-0 m-0"]>div[class="col-auto p-0"]>div[class="justify-content-start"]>div[class=" sb-avatar sb-avatar--text"]>div {
    background-image: url("${arg1}") !important;
    background-repeat: no-repeat  !important;
    background-size: cover  !important;
  }
  div[class="msg-row msg-row-light-bg"]:has(div[class="msg char-msg"])>div[class="row p-0 m-0"]>div[class="col-auto p-0"]>div[class="justify-content-start"]>div[class=" sb-avatar sb-avatar--text"]>div>div {
    display: none !important;
  }
  div[class="msg-row msg-row-light-bg"]:has(div[class="msg char-msg"])>div[class="row p-0 m-0"]>div[class="col-auto p-0"]>div[class="justify-content-start"]>div[class=" sb-avatar sb-avatar--src"] {
    background-image: url("${arg1}") !important;
    background-repeat: no-repeat  !important;
    background-size: cover  !important;
  }
  div[class="msg-row msg-row-light-bg"]:has(div[class="msg char-msg"])>div[class="row p-0 m-0"]>div[class="col-auto p-0"]>div[class="justify-content-start"]>div[class=" sb-avatar sb-avatar--src"]>img {
    display: none !important;
  }
`
};
var avatar_local_char_style = document.createElement('style');
avatar_local_char_style.classList.add('Reload_Autoscroll_script', 'avatar_local_char_style');
avatar_local_char_style.innerHTML = avatar_local_char_style_innerHTML (sessionStorage.getItem("RAs_AvatarChar"));
//
//------------------------------Chat background style------------------------------
//
var chat_background_style = document.createElement('style');
chat_background_style.classList.add('Reload_Autoscroll_script', 'chat_background_style');
chat_background_style.innerHTML = `
  div[class="row chatdisplay2"] {
    background-color: var(--bs-body-bg);
  }
  div[class="row chatfooterbg-normal"] {
    background-color: var(--bs-body-bg) !important;
  }
`;
//
//------------------------------Chat bubbles color auxiliary style------------------------------
//
if (localStorage_nativedark === "true") {
  var VAR_user_bubble = NIGHT_user_bubble;
  var VAR_char_bubble = NIGHT_char_buble;
} else {
  var VAR_user_bubble = DAY_user_bubble;
  var VAR_char_bubble = DAY_char_bubble;
};
var chat_bubbles_color_style = document.createElement('style');
chat_bubbles_color_style.classList.add('Reload_Autoscroll_script', 'chat_bubbles_color_style');
chat_bubbles_color_style.innerHTML = `
  div[class="msg-row msg-row-light-bg"]:has(div[class="msg user-msg"]){
    background-color: ${VAR_user_bubble};
  }
  div[class="msg-row msg-row-light-bg"]:has(div[class="msg char-msg"]){
    background-color: ${VAR_char_bubble};
  }
`;
//
//------------------------------Chat bubbles 1 style------------------------------
//
var chat_style_1_style = document.createElement('style');
chat_style_1_style.classList.add('Reload_Autoscroll_script', 'chat_style_1_style');
chat_style_1_style.innerHTML = `
  /*Chat bubble*/
  div[class="msg-row msg-row-light-bg"]:has(div[class="msg user-msg"]) {border-radius: 30px 30px 0px 30px; padding-top: 10px !important; padding-right: 10px !important; }
  div[class="msg-row msg-row-light-bg"]:has(div[class="msg char-msg"]) {border-radius: 0px 30px 30px 30px; padding-top: 10px !important; padding-left: 10px !important; }
  div[class="row p-0 m-0"]:has(span[class="msg-author-name"]) {justify-content: end; }
  div[class="col-10 p-2 pt-0"]:has(span[class="msg-author-name"]) { order: 0; }
  div[class="col-10 p-2 pt-0"]:not(:has(span[class="msg-author-name"])) { order: 2; }
  div[class="col-auto p-0"]{ order: 1; }
  div[class="justify-content-start"]:has(span[class="msg-author-name"]) {text-align: right !important; }
  span[class="msg-author-name"] {display: block !important;}
  div>div[class="col"]:has(div[class="msg user-msg"]) {display: flex; justify-content: end; }
  div[class="msg user-msg"] {text-align-last: right; text-align: right; padding-right: 0px; padding-bottom: 0px;}
  div[class="msg user-msg"]>div>img {max-width: fit-content !important; margin-left: auto; margin-right: 0px;}
  /*Text paragraph spacing*/
  div[class="msg user-msg"]>div>div>p {margin-block-end: 0.5em;}
  div[class="msg char-msg"]>div>div>div>p {margin-block-end: 0.5em;}
  /*Color background -above- and below chat
  div[class*="chatheaderbg-normal"] {background-color: rgba(0,0,0,0);}*/
  div[class="row chatfooterbg-normal"] {background-color: rgba(0,0,0,0); box-shadow: none;}
  div[class^="chatbox"] {margin: 0px !important;}
  /*Scrollbar background*/
  ::-webkit-scrollbar {  width: auto; background: transparent; background-color: transparent;}
  ::-webkit-scrollbar-corner {background: transparent; background-color: transparent;}
  ::-webkit-scrollbar-thumb {color: transparent; background: transparent; border-radius: 10px;}
  ::-webkit-scrollbar-thumb:hover {  background: rgba(255, 255, 255, .3) !important; border-radius: 10px; border: 1px solid rgba(0, 0, 0, .3) !important;}
  ::-webkit-resizer {background: transparent;}
  div[class="Reload_Autoscroll_script master_button"] {border-radius: 32px;}
`;
//
//------------------------------Chat bubbles 2 style------------------------------
//
var chat_style_2_style = document.createElement('style');
chat_style_2_style.classList.add('Reload_Autoscroll_script', 'chat_style_2_style');
chat_style_2_style.innerHTML = `
  /*Chat bubble COLOR*/
  div[class="msg-row msg-row-light-bg"]:has(div[class="msg user-msg"]) {border: 3px solid black;}
  div[class="msg-row msg-row-light-bg"]:has(div[class="msg char-msg"]) {border: 3px solid black;}
  /*Avatars*/
  div[class=" sb-avatar sb-avatar--src"] {height: 100px !important; width: 100px !important; border-radius: 0px !important;}
  div[class=" sb-avatar sb-avatar--src"]>img {height: 100px !important; width: 100px !important; border-radius: 0px !important;}
  div[class=" sb-avatar sb-avatar--text"] {height: 100px !important; width: 100px !important; border-radius: 0px !important;}
  div[class=" sb-avatar sb-avatar--text"]>div[class=" sb-avatar__text"] {height: 100px !important; width: 100px !important; border-radius: 0px !important;}
  div[class="msg-row msg-row-light-bg"]>div[class="row p-0 m-0"]>div[class="col-auto p-0"] {margin-top: auto !important; margin-bottom: auto !important;}
  div[class*="swiper-slide"]>div[class="row p-0 m-0"]>div[class="col-auto p-0"] {margin-top: auto !important; margin-bottom: auto !important;}
  div[class="col-auto p-0"] {padding-top: 1px !important; padding-bottom: 1px !important; padding-left: 1px !important;}
  /*Text paragraph spacing*/
  div[class="msg user-msg"]>div>div>p {margin-block-end: 0.5em;}
  div[class="msg char-msg"]>div>div>div>p {margin-block-end: 0.5em;}
  div[class="msg user-msg"] {padding: 0px;}
  div[class="msg char-msg"] {padding: 0px;}
  /*Text padding*/
  div[class="msg char-msg"]>div>div>div {padding-right: 5px; padding-left: 5px; padding-top: 5px;}
  div[class="msg user-msg"]>div>div {padding-right: 5px; padding-left: 5px; padding-top: 5px;}
  /*Text centering*/
  div[class="col-10 p-2 pt-0"] {margin-top: auto !important; margin-bottom: auto !important; padding-top: 1px !important; padding-bottom: 1px !important;}
  div[class="msg char-msg"]>div>div[class="markdown-wrapper"] {margin-top: auto !important; margin-bottom: auto !important;}
  div[class="msg-row msg-row-light-bg"]>div[class="row p-0 m-0"]>div[class="col-10 p-2 pt-0"]>div[class="justify-content-start"] {display: none;}
  div[class="msg user-msg"]>div[class="markdown-wrapper"]>div {margin-top: auto !important; margin-bottom: auto !important;}
  /*Images*/
  div[class="msg user-msg"]>div>img {max-width: fit-content !important; margin-top: auto !important; margin-bottom: auto !important; margin-right: -46px; margin-left: auto;}
  div[class="msg char-msg"]>div>img {margin-top: auto !important; margin-bottom: auto !important; margin-right: -36px; margin-left: auto;}
  /*Text and image arrangement inside regular messages*/
  div[class="msg user-msg"]>div[class="markdown-wrapper"] {display: flex; flex-direction: row;}
  div[class="msg-row msg-row-light-bg"]>div>div>div>div>div[class="msg char-msg"]>div {display: flex; flex-direction: row;}
  div[class="msg user-msg"] {width: 100%; }
  div[class="msg user-msg"]>div[class="markdown-wrapper"] {width: 100%; }
  /*Text and image arrangement inside slider*/
  div[class="msg-row msg-row-light-bg"]:has(div[class="swiper-wrapper"]) {display: flex; flex-direction: row;}
  div[class="msg-row msg-row-light-bg"]:has(div[class="swiper-wrapper"])>div[class="row p-0 m-0"] {margin-top: auto !important; margin-bottom: auto !important;}
  div[class^="swiper swiper-initialized swiper-horizontal"] {margin-top: 0px !important; margin-left: -45px; z-index: 5 !important;}
  div[class^="swiper-slide"]>div>div[class="col-auto p-0"] {top: 1px !important;}
  div[class^="swiper-slide"]>div {width: calc(722px + 110px) !important;}
  div[class*="swiper-slide"]>div>div>div>div>div[class="msg char-msg"]>div {display: inline-grid; grid-template-columns: auto max-content;}
  div[class*="swiper-slide"]>div>div>div>div>div[class="msg char-msg"]>div>div[class="markdown-wrapper markdown-wrapper-last-msg swiper-no-swiping"] {grid-area: 1 / 1 / span 1 / span 1; margin-top: auto !important; margin-bottom: auto !important;}
  div[class*="swiper-slide"]>div>div>div>div>div[class="msg char-msg"]>div>div[class="annotation-buttons-container col mb-3"] {grid-area: 2 / 1 / span 1 / span 1; margin-bottom: 0px !important;}
  div[class*="swiper-slide"]>div>div>div>div>div[class="msg char-msg"]>div>img {grid-area: 1 / 2 / span 1 / span 1;}
  div[class*="swiper-slide"]>div>div>div>div>div[class="msg char-msg"]>div>div:nth-of-type(3) {grid-area: 2 / 2 / span 1 / span 1; margin-right: -17px;}
  /*Swiper buttons*/
  div[class*="swiper-button"] {margin-top: auto !important; margin-bottom: auto; filter: opacity(30%);}
  div[class^="Reload_Autoscroll_script swiper-button"] {top: 46% !important;}
  /*Color background -above- and below chat
  div[class*="chatheaderbg-normal"] {background-color: rgba(0,0,0,0);}*/
  div[class="row chatfooterbg-normal"] {background-color: rgba(0,0,0,0); box-shadow: none;}
  div[class^="chatbox"] {border-radius: 0px; margin-left: 0px !important;}
  textarea[id="user-input"] {border-radius: 0;}
  /*Scrollbar background*/
  ::-webkit-scrollbar {width: auto; background: transparent; background-color: transparent;}
  ::-webkit-scrollbar-corner {background: transparent; background-color: transparent;}
  ::-webkit-scrollbar-thumb {color: transparent; background: transparent; border-radius: 0px;}
  ::-webkit-scrollbar-thumb:hover {background: rgba(255, 255, 255, .3) !important; border-radius: 0px; border: 1px solid rgba(0, 0, 0, .3) !important;}
  ::-webkit-resizer {background: transparent;}
`;
//
//------------------------------Chat bubbles 3 style------------------------------
//
var chat_style_3_style = document.createElement('style');
chat_style_3_style.classList.add('Reload_Autoscroll_script', 'chat_style_3_style');
chat_style_3_style.innerHTML = `
  /*Font*/
  body {font-family: Monospace;}
  /*Chat width*/
  div[class="apppage"]>div>div {max-width: none !important;}
  div[class="msg-row msg-row-light-bg"]>div>div[class="col-10 p-2 pt-0"] {width: 100%;}
  div[class^="swiper-slide"]>div>div[class="col-10 p-2 pt-0"] {width: 100%;}
  div[class="msg user-msg"], div[class="msg char-msg"] {margin-left: 45px !important;}
  /*Hide avatars*/
  div[class="msg-row msg-row-light-bg"]>div>div[class="col-auto p-0"] {display: none;}
    /*Images fix*/
  div[class="msg user-msg"]>div>img {max-width: fit-content !important;}
  /*Carousel hight*/
  div[class^="swiper swiper-initialized swiper-horizontal"] {min-height: 80px !important; margin-top: 0 !important;}
  /*Text paragraph spacing*/
  div[class="msg user-msg"]>div>div>p {margin-block-end: 0; margin-block-start: 0; display: inline-block;}
  div[class="msg char-msg"]>div>div>div>p {margin-block-end: 0; margin-block-start: 0; display: inline-block;}
  div[class="msg user-msg"]>div>div>p>br {display: none;}
  div[class="msg char-msg"]>div>div>div>p>br {display: none;}
  div[class="msg user-msg"]>div>div>pre {margin-bottom: 0px;}
  div[class="msg char-msg"]>div>div>div>pre {margin-bottom: 0px;}
  div[class="msg-row msg-row-light-bg"]>div>div[class="col-10 p-2 pt-0"]>div>span {line-height: 1;}
  div[class="swiper-wrapper"]> div > div > div > div>div > div[class="msg char-msg"]>div>div {min-height: auto !important;}
  /*Headings*/
  h1, h2, h3, h4, h5, h6 {margin-bottom: 0;}
  /*Between messages spacing*/
  div[class="msg-row msg-row-light-bg"] {margin-bottom: 0;}
  div[class="msg-row msg-row-light-bg"]>div>div[class="col-10 p-2 pt-0"] {padding-bottom: 0 !important;}
  div[class="msg user-msg"] {padding-bottom: 0;}
  div[class="swiper-wrapper"] {padding-top: 0; padding-bottom: 0;}
  /*c.AI label*/
  div[class="msg-row msg-row-light-bg"]>div>div[class="col-10 p-2 pt-0"]>div>span>div[class=" rounded py-0 px-1"] {display: none !important;}
  /*Scrollbar background*/
  ::-webkit-scrollbar {width: auto; background: transparent; background-color: transparent;}
  ::-webkit-scrollbar-corner {background: transparent; background-color: transparent;}
  ::-webkit-scrollbar-thumb {color: rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(0, 0, 0, .1)}
  ::-webkit-resizer {background: transparent;}
  /*Input textarea*/
  div[class="row chatfooterbg-normal"] {background-color: transparent; box-shadow: none;}
  div[class^="chatbox"] {border-radius: 0; border: 0; background-color: transparent !important; flex-direction: row-reverse; margin: 0 !important;}
  textarea[id="user-input"] {border-radius: 0;}
  /*textarea[id="user-input"] {background-color: transparent !important;}*/     /*Looks bad in case of multiline input*/
  textarea[id="user-input"]::placeholder {filter: opacity(30%)}
  div[class^="chatbox"]>div {margin-right: 0 !important; margin-left: 45px;}
  /*< and > buttons transparency*/
  div[class^="swiper-button"] {filter: opacity(30%); bottom: 6px !important; top: auto !important;}
  div[class^="Reload_Autoscroll_script swiper-button"] {filter: opacity(30%); bottom: 1px !important; top: auto !important;}
  /*To show user and char names comment or delete the following line*/
  div[class="msg-row msg-row-light-bg"]>div>div[class="col-10 p-2 pt-0"]>div>span {display: none !important;}
  /*HYW width correction*/
  body>div[class="display-btn"] {width: 15%;}
  body>div>div>div[class="messages-list"] {width: 15%;}
  body>div[class="screen-btn"] {width: 15%;}
  body>div>div>div[class="messages-list"]>div[class^="hywmsg"] {border-radius: 0;}
`;
//
//------------------------------Bookmarking glow style------------------------------
//
if (localStorage_nativedark === "true") {
  var bookmark_glow_color = NIGHT_label_glow;
} else {
  var bookmark_glow_color = DAY_label_glow;
};
var swipe_label_bookmaring_style = document.createElement('style');
swipe_label_bookmaring_style.classList.add('Reload_Autoscroll_script', 'swipe_label_bookmaring_style');
swipe_label_bookmaring_style.innerHTML = `
  div[class="swiper-wrapper"]>div[class^="swiper-slide"]>div[class="row p-0 m-0"]>div[class="col-auto p-0"][RAs_bookmarked="true"] {
    background-image: linear-gradient(${bookmark_glow_color}, transparent);
    background-color: transparent;
    height: 50%;
  }
  div[class="swiper-wrapper"]>div[class^=swiper-slide]>div[class="row p-0 m-0"]>div[class="col-auto p-0"] {
    background-color: rgb(60, 133, 246);
    color: white;
    font-weight: 600;
    font-size: 12px;
    border-radius: 0.25rem;
    width: 45px;
    position: absolute;
    top: calc(45px/2);
    text-align: center;
  }
`;
//
//------------------------------Quickscroll buttons style------------------------------
//
var quickscroll_buttons_style = document.createElement('style');
quickscroll_buttons_style.classList.add('Reload_Autoscroll_script', 'quickscroll_buttons_style');
quickscroll_buttons_style.innerHTML = `
  div[class="Reload_Autoscroll_script swiper-button-next-quickscroll"] {
    cursor: pointer;
    user-select: none;
    position: absolute;
    top: 45%;
    right: 0;
    color: black;
    font-weight: 700;
    height: 30px;
    z-index: 10;
    justify-content: center;
    align-items: center;
    font-family: swiper-icons;
    margin-top: -18px;
    transform: scale(0.6, 1.5);
  }
  div[class="Reload_Autoscroll_script swiper-button-next-quickscroll"]:hover {
    color: #3c85f6;
  }
  div[class="Reload_Autoscroll_script swiper-button-next-quickscroll"]::after {
    content: "next" "next";
  }
  div[class="Reload_Autoscroll_script swiper-button-prev-quickscroll"] {
    cursor: pointer;
    user-select: none;
    position: absolute;
    top: 45%;
    left: 0;
    color: black;
    font-weight: 700;
    height: 30px;
    z-index: 10;
    justify-content: center;
    align-items: center;
    font-family: swiper-icons;
    margin-top: -18px;
    transform: scale(0.6, 1.5);
  }
  div[class="Reload_Autoscroll_script swiper-button-prev-quickscroll"]:hover {
    color: #3c85f6;
  }
  div[class="Reload_Autoscroll_script swiper-button-prev-quickscroll"]::after {
    content: "prev" "prev";
  }
`;
//
//------------------------------When the whole page has loaded, including all dependent resources such as stylesheets, scripts, iframes, and images------------------------------
//
window.addEventListener('load', function () {
//
//------------------------------CSS------------------------------
//
  document.body.appendChild(master_style);
  if (reply_numbering) {
    document.body.appendChild(swipe_label_bookmaring_style);  // Have to append this, quickscroll_buttons_style and chat_background_style to document.body
  };                                                          // to utilize the native css vars and darkreader coloring instead of manual color picking.
  if (hide_new_rating) {
    master_style.appendChild(hide_new_rating_style);
  };
  if (quickscrll) {
    document.body.appendChild(quickscroll_buttons_style);
  };
//
//------------------------------Buttons level 0------------------------------
//
  var master_button = document.createElement('div');
  master_button.innerHTML = 'Master button';
  master_button.onclick = function (){
    event.stopPropagation();
    if (sessionStorage.getItem("RAs_MasterButton")) {
      sessionStorage.removeItem("RAs_MasterButton");
      master_menu.classList.remove('unhide');
    } else {
      sessionStorage.setItem("RAs_MasterButton", "true");
      master_menu.classList.add('unhide');
    };
  };
  master_button.classList.add('Reload_Autoscroll_script', 'master_button');
  document.body.appendChild(master_button);
//
//------------------------------Menu and buttons level 1------------------------------
//
  var master_menu = document.createElement('div');
  master_menu.classList.add('Reload_Autoscroll_script', 'master_menu');
  document.body.appendChild(master_menu);
  if (sessionStorage_MasterButton) {
    master_menu.classList.add('unhide');
  };
 
  var autoscroll_button = document.createElement('div');
  autoscroll_button.innerHTML = 'Autoscroll';
  autoscroll_button.setAttribute("style", "display: flex; order: 1;");
  autoscroll_button.classList.add('Reload_Autoscroll_script', 'autoscroll_button', 'menu_item');
  master_menu.appendChild(autoscroll_button);
 
  var reload_button = document.createElement('div');
  reload_button.innerHTML = 'Reload';
  reload_button.setAttribute("style", "display: flex; order: 2;");
  reload_button.classList.add('Reload_Autoscroll_script', 'reload_button', 'menu_item');
  master_menu.appendChild(reload_button);
 
  var replies_button = document.createElement('div');
  replies_button.innerHTML = 'Reply control';
  replies_button.setAttribute("style", "display: flex; order: 3;");
  replies_button.classList.add('Reload_Autoscroll_script', 'replies_button', 'menu_item', 'dropdown_only');
  master_menu.appendChild(replies_button);
 
  var info_button = document.createElement('div');
  info_button.innerHTML = 'Char info';
  info_button.setAttribute("style", "display: flex; order: 11;");
  info_button.classList.add('Reload_Autoscroll_script', 'info_button', 'menu_item', 'dropdown_only');
  master_menu.appendChild(info_button);
 
  var imagegen_button = document.createElement('div');
  imagegen_button.innerHTML = 'ImageGen';
  imagegen_button.setAttribute("style", "display: flex; order: 5;");
  imagegen_button.classList.add('Reload_Autoscroll_script', 'imagegen_button', 'menu_item');
  master_menu.appendChild(imagegen_button);
 
  var blur_button = document.createElement('div');
  blur_button.innerHTML = 'Blur';
  blur_button.setAttribute("style", "display: flex; order: 6;");
  blur_button.classList.add('Reload_Autoscroll_script', 'blur_button', 'menu_item');
  master_menu.appendChild(blur_button);
 
  var wallpaper_button = document.createElement('div');
  wallpaper_button.innerHTML = 'Wallpaper';
  wallpaper_button.setAttribute("style", "display: flex; order: 7;");
  wallpaper_button.classList.add('Reload_Autoscroll_script', 'wallpaper_button', 'menu_item');
  master_menu.appendChild(wallpaper_button);
 
  var avatar_button = document.createElement('div');
  avatar_button.innerHTML = 'Avatars';
  avatar_button.setAttribute("style", "display: flex; order: 8;");
  avatar_button.classList.add('Reload_Autoscroll_script', 'avatar_button', 'menu_item', 'dropdown_only');
  master_menu.appendChild(avatar_button);
 
  var chat_button = document.createElement('div');
  chat_button.innerHTML = 'Chat bubbles';
  chat_button.setAttribute("style", "display: flex; order: 9;");
  chat_button.classList.add('Reload_Autoscroll_script', 'chat_button', 'menu_item', 'dropdown_only');
  master_menu.appendChild(chat_button);
 
  var darkmode_button = document.createElement('div');
  darkmode_button.innerHTML = 'Dark mode';
  darkmode_button.setAttribute("style", "display: flex; order: 10;");
  darkmode_button.classList.add('Reload_Autoscroll_script', 'darkmode_button', 'menu_item');
  master_menu.appendChild(darkmode_button);
//
//------------------------------Menu and buttons level 2------------------------------
//
  var reload_button_menu = document.createElement('div');
  reload_button_menu.classList.add('Reload_Autoscroll_script', 'reload_button_menu', 'dropdown_menu');
  reload_button.appendChild(reload_button_menu);
 
  var reload_scroll_button = document.createElement('div');
  reload_scroll_button.innerHTML = 'Reload & Scroll';
  reload_scroll_button.setAttribute("style", "order: 1;");
  reload_scroll_button.classList.add('Reload_Autoscroll_script', 'reload_scroll_button', 'menu_item');
  reload_button_menu.appendChild(reload_scroll_button);
 
  var replies_button_menu = document.createElement('div');
  replies_button_menu.classList.add('Reload_Autoscroll_script', 'replies_button_menu', 'dropdown_menu');
  replies_button.appendChild(replies_button_menu);
 
  var replies_fetch_button = document.createElement('div');
  replies_fetch_button.innerHTML = 'Fetch 10 replies';
  replies_fetch_button.setAttribute("style", "order: 1;");
  replies_fetch_button.classList.add('Reload_Autoscroll_script', 'replies_fetch_button', 'menu_item');
  replies_button_menu.appendChild(replies_fetch_button);
 
  var replies_delete_button = document.createElement('div');
  replies_delete_button.innerHTML = 'Delete last reply';
  replies_delete_button.setAttribute("style", "order: 2;");
  replies_delete_button.classList.add('Reload_Autoscroll_script', 'replies_delete_button', 'menu_item');
  replies_button_menu.appendChild(replies_delete_button);
 
  var info_button_menu = document.createElement('div');
  info_button_menu.classList.add('Reload_Autoscroll_script', 'info_button_menu', 'dropdown_menu', 'table_inside');
  info_button.appendChild(info_button_menu);
 
  var blur_button_menu = document.createElement('div');
  blur_button_menu.classList.add('Reload_Autoscroll_script', 'blur_button_menu', 'dropdown_menu');
  blur_button.appendChild(blur_button_menu);
 
  var blur_you_button = document.createElement('div');
  blur_you_button.innerHTML = 'Blur you';
  blur_you_button.setAttribute("style", "order: 1;");
  blur_you_button.classList.add('Reload_Autoscroll_script', 'blur_you_button', 'menu_item');
  blur_button_menu.appendChild(blur_you_button);
 
  var blur_char_button = document.createElement('div');
  blur_char_button.innerHTML = 'Blur char';
  blur_char_button.setAttribute("style", "order: 2;");
  blur_char_button.classList.add('Reload_Autoscroll_script', 'blur_char_button', 'menu_item');
  blur_button_menu.appendChild(blur_char_button);
 
  var wallpaper_button_menu = document.createElement('div');
  wallpaper_button_menu.classList.add('Reload_Autoscroll_script', 'wallpaper_button_menu', 'dropdown_menu');
  wallpaper_button_menu.onclick = function (){
    event.stopPropagation();
  };
  wallpaper_button.appendChild(wallpaper_button_menu);
 
  var avatar_button_menu = document.createElement('div');
  avatar_button_menu.classList.add('Reload_Autoscroll_script', 'avatar_button_menu', 'dropdown_menu');
  avatar_button.appendChild(avatar_button_menu);
  avatar_button_menu.onclick = function (){
    event.stopPropagation();
  };
 
  var chat_button_menu = document.createElement('div');
  chat_button_menu.classList.add('Reload_Autoscroll_script', 'chat_button_menu', 'dropdown_menu');
  chat_button.appendChild(chat_button_menu);
 
  var chat_background_button = document.createElement('div');
  chat_background_button.innerHTML = 'Enable chat background';
  chat_background_button.setAttribute("style", "order: 1;");
  chat_background_button.classList.add('Reload_Autoscroll_script', 'chat_background_button', 'menu_item');
  chat_button_menu.appendChild(chat_background_button);
 
  var chat_style_1_button = document.createElement('div');
  chat_style_1_button.innerHTML = 'Enable chat 💬 style 1';
  chat_style_1_button.setAttribute("style", "order: 2;");
  chat_style_1_button.classList.add('Reload_Autoscroll_script', 'chat_style_1_button', 'menu_item');
  chat_button_menu.appendChild(chat_style_1_button);
 
  var chat_style_2_button = document.createElement('div');
  chat_style_2_button.innerHTML = 'Enable chat 💬 style 2';
  chat_style_2_button.setAttribute("style", "order: 3;");
  chat_style_2_button.classList.add('Reload_Autoscroll_script', 'chat_style_2_button', 'menu_item');
  chat_button_menu.appendChild(chat_style_2_button);
 
  var chat_style_3_button = document.createElement('div');
  chat_style_3_button.innerHTML = 'Enable chat 💬 style 3';
  chat_style_3_button.setAttribute("style", "order: 4;");
  chat_style_3_button.classList.add('Reload_Autoscroll_script', 'chat_style_3_button', 'menu_item');
  chat_button_menu.appendChild(chat_style_3_button);
//
//------------------------------Menu and buttons level 2.5------------------------------
//
  var info_char_table = document.createElement('table');
  waitForElement('div[class="msg-row msg-row-light-bg"]', 60000).then(function () {
    //console.log("msg-row msg-row-light-bg observer SUCCESS");
    XHR_interception_promise.then (function (arg1) {
    //console.log(arg1);                               // For some reason I wasn't able to use only the promise.then, so I had to wrap it into my "timed mutatiobserver"
    info_char_table.insertAdjacentHTML("afterbegin", `<table>
     <tr><td>Name</td><td>${arg1.name}</td></tr>
     <tr><td>Interaction count</td><td>${arg1.participant__num_interactions}</td></tr>
     <tr><td>Greeting</td><td>${arg1.greeting}</td></tr>
     <tr><td>Short Description</td><td>${arg1.title}</td></tr>
     <tr><td>Long Description</td><td>${arg1.description}</td></tr>
     <tr><td>Avatar</td><td><img src='https://characterai.io/i/400/static/avatars/${arg1.avatar_file_name}'></td></tr>
     <tr><td>Image style</td><td>${arg1.base_img_prompt}</td></tr>
    </table>`);
  });
 
  }).catch(function() {
    console.log("msg-row msg-row-light-bg observer ERROR");
  });
  info_char_table.classList.add('Reload_Autoscroll_script', 'info_char_table');
  info_button_menu.appendChild(info_char_table);
 
  var wallpaper_local_grid = document.createElement('div');
  wallpaper_local_grid.classList.add('Reload_Autoscroll_script', 'wallpaper_local_grid', 'menu_item', 'dropdown_only', 'grid');
  wallpaper_button_menu.appendChild(wallpaper_local_grid);
 
  var wallpaper_local_span = document.createElement('span');
  wallpaper_local_span.innerHTML = 'Set local wallpaper';
  wallpaper_local_span.setAttribute("style", "grid-area: 1 / 1 / span 1 / span 3;");
  wallpaper_local_span.classList.add('Reload_Autoscroll_script', 'wallpaper_local_span');
  wallpaper_local_grid.appendChild(wallpaper_local_span);
 
  var wallpaper_local_input = document.createElement('input');
  wallpaper_local_input.setAttribute("type", "url");
  wallpaper_local_input.setAttribute("style", "grid-area: 2 / 1 / span 1 / span 1; border: 1px solid black; border-radius: 0 0 0 0; height: 1em;");
  wallpaper_local_input.classList.add('Reload_Autoscroll_script', 'wallpaper_local_input');
  wallpaper_local_grid.appendChild(wallpaper_local_input);
 
  var wallpaper_local_set_button = document.createElement('div');
  wallpaper_local_set_button.innerHTML = 'Set';
  wallpaper_local_set_button.setAttribute("style", "grid-area: 2 / 2 / span 1 / span 1;");
  wallpaper_local_set_button.classList.add('Reload_Autoscroll_script', 'menu_item', 'wallpaper_local_set_button');
  wallpaper_local_grid.appendChild(wallpaper_local_set_button);
 
  var wallpaper_local_reset_button = document.createElement('div');
  wallpaper_local_reset_button.innerHTML = 'Reset';
  wallpaper_local_reset_button.setAttribute("style", "grid-area: 2 / 3 / span 1 / span 1;");
  wallpaper_local_reset_button.classList.add('Reload_Autoscroll_script', 'menu_item', 'wallpaper_local_reset_button');
  wallpaper_local_grid.appendChild(wallpaper_local_reset_button);
 
  var avatar_local_grid = document.createElement('div');
  avatar_local_grid.classList.add('Reload_Autoscroll_script', 'wallpaper_local_grid', 'menu_item', 'dropdown_only', 'grid');
  avatar_button_menu.appendChild(avatar_local_grid);
 
  var avatar_local_span_you = document.createElement('span');
  avatar_local_span_you.innerHTML = 'Set local avatar for you';
  avatar_local_span_you.setAttribute("style", "grid-area: 1 / 1 / span 1 / span 3;");
  avatar_local_span_you.classList.add('Reload_Autoscroll_script', 'avatar_local_span_you');
  avatar_local_grid.appendChild(avatar_local_span_you);
 
  var avatar_local_input_you = document.createElement('input');
  avatar_local_input_you.setAttribute("type", "url");
  avatar_local_input_you.setAttribute("style", "grid-area: 2 / 1 / span 1 / span 1; border: 1px solid black; border-radius: 0 0 0 0; height: 1em;");
  avatar_local_input_you.classList.add('Reload_Autoscroll_script', 'avatar_local_input_you');
  avatar_local_grid.appendChild(avatar_local_input_you);
 
  var avatar_local_set_you_button = document.createElement('div');
  avatar_local_set_you_button.innerHTML = 'Set';
  avatar_local_set_you_button.setAttribute("style", "grid-area: 2 / 2 / span 1 / span 1;");
  avatar_local_set_you_button.classList.add('Reload_Autoscroll_script', 'menu_item', 'avatar_local_set_you_button');
  avatar_local_grid.appendChild(avatar_local_set_you_button);
 
  var avatar_local_reset_you_button = document.createElement('div');
  avatar_local_reset_you_button.innerHTML = 'Reset';
  avatar_local_reset_you_button.setAttribute("style", "grid-area: 2 / 3 / span 1 / span 1;");
  avatar_local_reset_you_button.classList.add('Reload_Autoscroll_script', 'menu_item', 'avatar_local_reset_you_button');
  avatar_local_grid.appendChild(avatar_local_reset_you_button);
 
  var avatar_local_span_char = document.createElement('span');
  avatar_local_span_char.innerHTML = 'Set local avatar for char';
  avatar_local_span_char.setAttribute("style", "grid-area: 3 / 1 / span 1 / span 3;");
  avatar_local_span_char.classList.add('Reload_Autoscroll_script', 'avatar_local_span_char');
  avatar_local_grid.appendChild(avatar_local_span_char);
 
  var avatar_local_input_char = document.createElement('input');
  avatar_local_input_char.setAttribute("type", "url");
  avatar_local_input_char.setAttribute("style", "grid-area: 4 / 1 / span 1 / span 1; border: 1px solid black; border-radius: 0 0 0 0; height: 1em;");
  avatar_local_input_char.classList.add('Reload_Autoscroll_script', 'avatar_local_input_char');
  avatar_local_grid.appendChild(avatar_local_input_char);
 
  var avatar_local_set_char_button = document.createElement('div');
  avatar_local_set_char_button.innerHTML = 'Set';
  avatar_local_set_char_button.setAttribute("style", "grid-area: 4 / 2 / span 1 / span 1;");
  avatar_local_set_char_button.classList.add('Reload_Autoscroll_script', 'menu_item', 'avatar_local_set_char_button');
  avatar_local_grid.appendChild(avatar_local_set_char_button);
 
  var avatar_local_reset_char_button = document.createElement('div');
  avatar_local_reset_char_button.innerHTML = 'Reset';
  avatar_local_reset_char_button.setAttribute("style", "grid-area: 4 / 3 / span 1 / span 1;");
  avatar_local_reset_char_button.classList.add('Reload_Autoscroll_script', 'menu_item', 'avatar_local_reset_char_button');
  avatar_local_grid.appendChild(avatar_local_reset_char_button);
//
//------------------------------Autoscroll button------------------------------
//
  if (safe_autoscroll) {
    var TryAgain_popup = 'div[class="Toastify__toast Toastify__toast-theme--light Toastify__toast--default"]>div[role="alert"]';
    var error_TryAgain_observer_options = {childList: true, attributes: true, subtree: true};
  } else {
    var TryAgain_popup = 'div[class*="Toastify__toast--default"]';
    var error_TryAgain_observer_options ={childList: true, subtree: true};
  };
  const error_TryAgain_observer = new MutationObserver (function () {
    //console.log("error_TryAgain_observer observer fired");
    if (document.querySelector(TryAgain_popup)) {
      console.log("Try Again error detected");
      document.querySelector('div[class*="Toastify__toast--default"]>div>div>div>div[class="row"]>div[class="col"]>button[class="btn btn-primary"]').click();
      console.log("Try Again button clicked");
    } else if (document.querySelector('div[class*="Toastify__toast--error"]')) {
      console.log("500 Internal Server Error detected");
      if (reload_if_autoscroll) {
        window.location.reload();
      };
    };
  });
  function scroll_totheright () {
    if (document.querySelector('div[class="swiper-button-next"]')) {
      ArrowRightKeyDown();
      scroll_totheright ();
    } else {
      scroll_totheright_observer.observe(document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]'), {childList: true, subtree: true});
    };
  };
  const scroll_totheright_observer = new MutationObserver (function () {
    //console.log("scroll_totheright_observer observer fired");
    scroll_totheright ();
  });
  autoscroll_button.onclick = function (){
    event.stopPropagation();
    if (sessionStorage.getItem("RAs_Autoscroll") === "true") {
      sessionStorage.removeItem("RAs_Autoscroll");
      autoscroll_button.innerHTML = 'Autoscroll';
      autoscroll_button.style.cssText = '';
      error_TryAgain_observer.disconnect();
      scroll_totheright_observer.disconnect();
    } else {
      sessionStorage.setItem("RAs_Autoscroll", "true");
      autoscroll_button.innerHTML = 'Autoscroll ⏭️';
      autoscroll_button.style.cssText = 'background-color: rgba(153,17,17,1); color: white;';
      error_TryAgain_observer.observe(document.querySelector('div[id="root"]>div[class="Toastify"]'), error_TryAgain_observer_options);
      waitForElement('div[class="swiper-wrapper"]', 60000).then(function() {
        console.log("[Autoscroll] observer SUCCESS");
        scroll_totheright ();
      }).catch(function() {
        console.log("[Autoscroll] observer ERROR");
      });
    };
  };
  if (sessionStorage_Autoscroll) {
    autoscroll_button.innerHTML = 'Autoscroll ⏭️';
    autoscroll_button.style.cssText = 'background-color: rgba(153,17,17,1); color: white;';
    error_TryAgain_observer.observe(document.querySelector('div[id="root"]>div[class="Toastify"]'), error_TryAgain_observer_options);
    waitForElement('div[class="swiper-wrapper"]', 60000).then(function() {
      console.log("[Autoscroll] observer SUCCESS");
      scroll_totheright ();
    }).catch(function() {
      console.log("[Autoscroll] observer ERROR");
    });
  };
//
//------------------------------Reload button------------------------------
//
  reload_button.onclick = function (){
    event.stopPropagation();
    window.location.reload();
  };
//
//------------------------------Reload & Scroll button------------------------------
//
  reload_scroll_button.onclick = function (){
    event.stopPropagation();
    sessionStorage.setItem("RAs_ReloadScroll", "true");
    window.location.reload();
  };
  if (sessionStorage_ReloadScroll) {
    waitForElement('div[class="swiper-wrapper"]', 60000).then(function() {
      console.log("[Reload & Scroll] observer SUCCESS");
            for (let step = 0; step < 50; step++) {
              ArrowRightKeyDown();
            };
    }).catch(function() {
      console.log("[Reload & Scroll] observer ERROR");
    });
    sessionStorage.removeItem("RAs_ReloadScroll");
  };
//
//------------------------------Timed MutationObserver to assist the two following buttons------------------------------
//
  waitForElement('div[class="msg-row msg-row-light-bg"]', 60000).then(function() {
    //console.log("msg-row msg-row-light-bg observer SUCCESS");
    const fetch_observer = new MutationObserver (function () {
      //console.log("fetch_observer fired");
      XHR_interception_promise.then (function (arg1) {
        var requestHistory = new XMLHttpRequest ();
        requestHistory.open ('GET', `https://beta.character.ai/chat/history/msgs/user/?history_external_id=${arg1.history_external_id}`, false);
        requestHistory.setRequestHeader("content-type", "application/json");
        requestHistory.setRequestHeader("authorization", `Token ${localStorage_authorization}`);
        requestHistory.send (`history_external_id:${arg1.history_external_id}`);
      });
    });
    fetch_observer.observe(document.querySelector('div[class="infinite-scroll-component "]'), {childList: true});
  }).catch(function() {
    console.log("row msg-row-light-bg observer ERROR");
  });
//
//------------------------------Fetch replies button------------------------------
//
  replies_fetch_button.onclick = function (){
    event.stopPropagation();
    XHR_interception_promise.then (function (arg1) {
      for (let step = 0; step < 10; step++) {
        fetch("https://beta.character.ai/chat/streaming/", {
          "headers": {
            "authorization": `Token ${localStorage_authorization}`,
            "content-type": "application/json",
          },
          "body": `{\"history_external_id\":\"${arg1.history_external_id}\",\"tgt\":\"${arg1.tgt}\",\"parent_msg_id\":${arg1.parent_msg_id}}`,
          "method": "POST"
        });
        console.log("A reply request was sent.");
      };
    });
    replies_fetch_button.innerHTML = 'Fetch 10 replies 🔄❗';
  };
//
//------------------------------Delete reply button------------------------------
//
  replies_delete_button.onclick = function (){
    event.stopPropagation();
    XHR_interception_promise.then (function (arg1) {
      fetch("https://beta.character.ai/chat/history/msgs/delete/", {
        "headers": {
          "authorization": `Token ${localStorage_authorization}`,
          "content-type": "application/json",
        },
        "body": `{\"history_id\":\"${arg1.history_external_id}\",\"ids_to_delete\":[${arg1.last_msg_id}]}`,
        "method": "POST"
      });
      console.log("Last reply was deleted. Now you have to reload the page. Text was:", arg1.last_msg_text);
    });
    replies_delete_button.innerHTML = 'Delete last reply 🔄❗';
  };
//
//------------------------------ImageGen button------------------------------
//
  imagegen_button.onclick = function (){
    event.stopPropagation();
    if (sessionStorage.getItem("RAs_ImageGen")) {
      master_style.removeChild(imagegen_style);
      sessionStorage.removeItem("RAs_ImageGen");
      imagegen_button.innerHTML = "ImageGen";
    } else {
      master_style.appendChild(imagegen_style);
      sessionStorage.setItem("RAs_ImageGen", "true");
      imagegen_button.innerHTML = "ImageGen 🎨";
    };
  };
  if (sessionStorage_ImageGen) {
    master_style.appendChild(imagegen_style);
    imagegen_button.innerHTML = 'ImageGen 🎨';
  };
//
//------------------------------Blur button------------------------------
//
  blur_button.onclick = function (){
    event.stopPropagation();
    if (document.querySelector('style[class="Reload_Autoscroll_script blur_user_style"]') && document.querySelector('style[class="Reload_Autoscroll_script blur_char_style"]')) {
      master_style.removeChild(blur_user_style);
      master_style.removeChild(blur_char_style);
      blur_you_button.innerHTML = "Blur you";
      blur_char_button.innerHTML = "Blur char";
    } else {
      master_style.appendChild(blur_user_style);
      master_style.appendChild(blur_char_style);
      blur_you_button.innerHTML = "UNBLUR you";
      blur_char_button.innerHTML = "UNBLUR char";
    };
  };
//
//------------------------------Blur you button------------------------------
//
  blur_you_button.onclick = function (){
    event.stopPropagation();
    if (document.querySelector('style[class="Reload_Autoscroll_script blur_user_style"]')) {
      master_style.removeChild(blur_user_style);
      blur_you_button.innerHTML = "Blur you";
    } else {
      master_style.appendChild(blur_user_style);
      blur_you_button.innerHTML = "UNBLUR you";
    };
  };
//
//------------------------------Blur char button------------------------------
//
  blur_char_button.onclick = function (){
    event.stopPropagation();
    if (document.querySelector('style[class="Reload_Autoscroll_script blur_char_style"]')) {
      master_style.removeChild(blur_char_style);
      blur_char_button.innerHTML = "Blur char";
    } else {
      master_style.appendChild(blur_char_style);
      blur_char_button.innerHTML = "UNBLUR char";
    };
  };
//
//------------------------------Wallpaper button------------------------------
//
  wallpaper_button.onclick = function() {
    if (!sessionStorage.getItem("RAs_LocalWallpaper")) {
      event.stopPropagation();
      if (sessionStorage.getItem("RAs_GlobalWallpaper")) {
        master_style.removeChild(global_wallpaper_style);
        sessionStorage.removeItem("RAs_GlobalWallpaper");
      } else {
        master_style.appendChild(global_wallpaper_style);
        sessionStorage.setItem("RAs_GlobalWallpaper", "true");
      };
    };
  };
  if (sessionStorage_GlobalWp && !sessionStorage_LocalWp) {
    master_style.appendChild(global_wallpaper_style);
  };
//
//------------------------------Set local wallpaper button------------------------------
//
  wallpaper_local_set_button.onclick = function (){
    event.stopPropagation();
    if (wallpaper_local_input.value.length !== 0) {
      sessionStorage.setItem("RAs_LocalWallpaper", wallpaper_local_input.value);
      local_wallpaper_style.innerHTML = local_wallpaper_style_innerHTML (sessionStorage.getItem("RAs_LocalWallpaper"));
      master_style.appendChild(local_wallpaper_style);
      if (sessionStorage.getItem("RAs_GlobalWallpaper")) {
        master_style.removeChild(global_wallpaper_style);
        sessionStorage.removeItem("RAs_GlobalWallpaper");
      };
    };
  };
  if (sessionStorage_LocalWp) {
    wallpaper_local_input.setAttribute("placeholder", sessionStorage_LocalWp);
    master_style.appendChild(local_wallpaper_style);
  } else {
    wallpaper_local_input.setAttribute("placeholder", "image url goes here");
  };
//
//------------------------------Reset local wallpaper button------------------------------
//
  wallpaper_local_reset_button.onclick = function (){
    event.stopPropagation();
    if (sessionStorage.getItem("RAs_LocalWallpaper")) {
      sessionStorage.removeItem("RAs_LocalWallpaper");
      master_style.removeChild(local_wallpaper_style);
      wallpaper_local_input.setAttribute("placeholder", "");
      wallpaper_local_input.value = "";
      console.log("Local wallpaper was reset");
    };
  };
//
//------------------------------Set local avatar for you button------------------------------
//
  avatar_local_set_you_button.onclick = function (){
    event.stopPropagation();
    if (avatar_local_input_you.value.length !== 0) {
      sessionStorage.setItem("RAs_AvatarYou", avatar_local_input_you.value);
      avatar_local_you_style.innerHTML = avatar_local_you_style_innerHTML (sessionStorage.getItem("RAs_AvatarYou"));
      master_style.appendChild(avatar_local_you_style);
    };
  };
  if (sessionStorage_AvatarYou) {
    avatar_local_input_you.setAttribute("placeholder", sessionStorage_AvatarYou);
    master_style.appendChild(avatar_local_you_style);
  } else {
    avatar_local_input_you.setAttribute("placeholder", "image url goes here");
  };
//
//------------------------------Reset local avatar for you button------------------------------
//
  avatar_local_reset_you_button.onclick = function (){
    event.stopPropagation();
    if (sessionStorage.getItem("RAs_AvatarYou")) {
      sessionStorage.removeItem("RAs_AvatarYou");
      master_style.removeChild(avatar_local_you_style);
      avatar_local_input_you.setAttribute("placeholder", "");
      avatar_local_input_you.value = "";
      console.log("Local avatar for you was reset");
    };
  };
//
//------------------------------Set local avatar for char button------------------------------
//
  avatar_local_set_char_button.onclick = function (){
    event.stopPropagation();
    if (avatar_local_input_char.value.length !== 0) {
      sessionStorage.setItem("RAs_AvatarChar", avatar_local_input_char.value);
      avatar_local_char_style.innerHTML = avatar_local_char_style_innerHTML (sessionStorage.getItem("RAs_AvatarChar"));
      master_style.appendChild(avatar_local_char_style);
    };
  };
  if (sessionStorage_AvatarChar) {
    avatar_local_input_char.setAttribute("placeholder", sessionStorage_AvatarChar);
    master_style.appendChild(avatar_local_char_style);
  } else {
    avatar_local_input_char.setAttribute("placeholder", "image url goes here");
  };
//
//------------------------------Reset local avatar for char button------------------------------
//
  avatar_local_reset_char_button.onclick = function (){
    event.stopPropagation();
    if (sessionStorage.getItem("RAs_AvatarChar")) {
      sessionStorage.removeItem("RAs_AvatarChar");
      master_style.removeChild(avatar_local_char_style);
      avatar_local_input_char.setAttribute("placeholder", "");
      avatar_local_input_char.value = "";
      console.log("Local avatar for char was reset");
    };
  };
//
//------------------------------Chat background button------------------------------
//
  chat_background_button.onclick = function (){
    event.stopPropagation();
    if (sessionStorage.getItem("RAs_ChatBackground")) {
      document.body.removeChild(chat_background_style);
      sessionStorage.removeItem("RAs_ChatBackground");
      chat_background_button.innerHTML = 'Enable chat background';
    } else {
      document.body.appendChild(chat_background_style);
      sessionStorage.setItem("RAs_ChatBackground", "true");
      chat_background_button.innerHTML = 'Disable chat background';
    };
  };
  if (sessionStorage_ChatBg) {
    document.body.appendChild(chat_background_style);
    chat_background_button.innerHTML = 'Disable chat background';
  };
//
//------------------------------Chat styles auxiliary code------------------------------
//
  function check_chat_style_1 () {
    if (sessionStorage.getItem("RAs_ChatStyle_1")) {
      master_style.removeChild(chat_style_1_style);
      master_style.removeChild(chat_bubbles_color_style);
      chat_style_1_button.innerHTML = 'Enable chat 💬 style 1';
      sessionStorage.removeItem("RAs_ChatStyle_1");
    };
  };
  function check_chat_style_2 () {
    if (sessionStorage.getItem("RAs_ChatStyle_2")) {
      master_style.removeChild(chat_style_2_style);
      master_style.removeChild(chat_bubbles_color_style);
      chat_style_2_button.innerHTML = 'Enable chat 💬 style 2';
      sessionStorage.removeItem("RAs_ChatStyle_2");
    };
  };
  function check_chat_style_3 () {
    if (sessionStorage.getItem("RAs_ChatStyle_3")) {
      master_style.removeChild(chat_style_3_style);
      chat_style_3_button.innerHTML = 'Enable chat 💬 style 3';
      sessionStorage.removeItem("RAs_ChatStyle_3");
    };
  };
//
//------------------------------Chat style 1 button------------------------------
//
  chat_style_1_button.onclick = function (){
    event.stopPropagation();
    check_chat_style_2 ();
    check_chat_style_3 ();
    if (sessionStorage.getItem("RAs_ChatStyle_1")) {
      master_style.removeChild(chat_style_1_style);
      master_style.removeChild(chat_bubbles_color_style);
      chat_style_1_button.innerHTML = 'Enable chat 💬 style 1';
      sessionStorage.removeItem("RAs_ChatStyle_1");
    } else {
      master_style.appendChild(chat_style_1_style);
      master_style.appendChild(chat_bubbles_color_style);
      chat_style_1_button.innerHTML = 'Disable chat 💬 style 1';
      sessionStorage.setItem("RAs_ChatStyle_1", "true");
    }
  };
  if (sessionStorage_ChatStyle_1) {
    chat_style_1_button.innerHTML = 'Disable chat 💬 style 1';
    master_style.appendChild(chat_style_1_style);
    master_style.appendChild(chat_bubbles_color_style);
    console.log("Chat bubbles style 1 remains enabled");
  };
//
//------------------------------Chat style 2 button------------------------------
//
  chat_style_2_button.onclick = function (){
    event.stopPropagation();
    check_chat_style_1 ();
    check_chat_style_3 ();
    if (sessionStorage.getItem("RAs_ChatStyle_2")) {
      master_style.removeChild(chat_style_2_style);
      master_style.removeChild(chat_bubbles_color_style);
      chat_style_2_button.innerHTML = 'Enable chat 💬 style 2';
      sessionStorage.removeItem("RAs_ChatStyle_2");
    } else {
      master_style.appendChild(chat_style_2_style);
      master_style.appendChild(chat_bubbles_color_style);
      chat_style_2_button.innerHTML = 'Disable chat 💬 style 2';
      sessionStorage.setItem("RAs_ChatStyle_2", "true");
    }
  };
  if (sessionStorage_ChatStyle_2) {
    chat_style_2_button.innerHTML = 'Disable chat 💬 style 2';
    master_style.appendChild(chat_style_2_style);
    master_style.appendChild(chat_bubbles_color_style);
    console.log("Chat bubbles style 2 remains enabled");
  };
//
//------------------------------Chat style 3 button------------------------------
//
  chat_style_3_button.onclick = function (){
    event.stopPropagation();
    check_chat_style_1 ();
    check_chat_style_2 ();
    if (sessionStorage.getItem("RAs_ChatStyle_3")) {
      master_style.removeChild(chat_style_3_style);
      chat_style_3_button.innerHTML = 'Enable chat 💬 style 3';
      sessionStorage.removeItem("RAs_ChatStyle_3");
    } else {
      master_style.appendChild(chat_style_3_style);
      chat_style_3_button.innerHTML = 'Disable chat 💬 style 3';
      sessionStorage.setItem("RAs_ChatStyle_3", "true");
    }
  };
  if (sessionStorage_ChatStyle_3) {
    chat_style_3_button.innerHTML = 'Disable chat 💬 style 3';
    master_style.appendChild(chat_style_3_style);
    console.log("Chat bubbles style 3 remains enabled");
  };
//
//------------------------------Dark mode button------------------------------
//
  darkmode_button.onclick = function (){
    event.stopPropagation();
    if (localStorage.getItem ("darkMode") === "true") {
      console.log
      localStorage.setItem ("darkMode", "false");
      darkmode_button.innerHTML = "Dark Mode 🔄❗";
    } else {
      localStorage.setItem ("darkMode", "true");
      darkmode_button.innerHTML = "Light Mode 🔄❗";
    };
  };
  if (localStorage_nativedark === "true") {
    darkmode_button.innerHTML = "Light Mode";
  } else {
    darkmode_button.innerHTML = "Dark Mode";
  };
//
//------------------------------500 Internal Server Error persistent notification------------------------------
//
  if (error500_persistent) {
    waitForElement('div[id="root"]>div[class="Toastify"]', 60000).then(function() {
      //console.log("Toastify observer SUCCESS");
      const error500_observer = new MutationObserver (function () {
        //console.log("error500_observer observer fired");
        if (document.querySelector('div[class*="Toastify__toast--error"]')) {
          console.log("500 Internal Server Error detected");
          document.querySelector('textarea[id="user-input"]').style.setProperty("background-color", "lightpink", "important");
          document.querySelector('textarea[id="user-input"]').setAttribute("placeholder", "   “500 Internal Server Error” was fired! Refresh the page!");
        };
      });
      error500_observer.observe(document.querySelector('div[id="root"]>div[class="Toastify"]'), {childList: true, subtree: true});
    }).catch(function() {
      console.log("Toastify observer ERROR");
    });
  };
//
//------------------------------Swipes numbering and bookmarking------------------------------
//
  if (reply_numbering) {
    function add_swipe_number () {
      var swipe_labels_text_NodeList = document.querySelectorAll('div[class="swiper-wrapper"]>div[class^="swiper-slide"]>div[class="row p-0 m-0"]>div[class="col-auto p-0"]');
      for (let i = 0; i < swipe_labels_text_NodeList.length; i++) {
        if (!swipe_labels_text_NodeList[i].getAttribute('swipe_number_listener')) {
          swipe_labels_text_NodeList[i].innerHTML = i + 1;
          swipe_labels_text_NodeList[i].setAttribute('swipe_number_listener', 'true');
          console.log(swipe_labels_text_NodeList[i].innerHTML); // This is left enabled intentionally because I like watching numbers go brrr.
        };
      };
    };
    function make_label_glow (arg1) {
      if (arg1.getAttribute('RAs_bookmarked')) {
        arg1.removeAttribute('RAs_bookmarked');
      } else if (!arg1.getAttribute('RAs_bookmarked')) {
        arg1.setAttribute('RAs_bookmarked', 'true');
      };
    };
    function add_swipe_bookmark () {
      var swipe_labels_NodeList = document.querySelectorAll('div[class="swiper-wrapper"]>div[class^="swiper-slide"]>div[class="row p-0 m-0"]>div[class="col-auto p-0"]');
      for (let i = 0; i < swipe_labels_NodeList.length; i++) {
        if (!swipe_labels_NodeList[i].getAttribute('swipe_bookmark_listener')) {
          swipe_labels_NodeList[i].addEventListener('click', function () {
            make_label_glow (swipe_labels_NodeList[i]);
          });
          swipe_labels_NodeList[i].setAttribute('swipe_bookmark_listener', 'true');
        };
      };
    };
    waitForElement('div[class="swiper-wrapper"]', 60000).then(function () {
      //console.log("swiper-wrapper observer SUCCESS");
      add_swipe_number ();
      add_swipe_bookmark ();
      const new_replies_row_observer = new MutationObserver(function () {
        //console.log("new_replies_row_observer fired");
        add_swipe_number ();
        add_swipe_bookmark ();
      });
      new_replies_row_observer.observe(document.querySelector('div[class="swiper-wrapper"]'), {childList: true});
      const new_replies_column_observer = new MutationObserver(function () {
        //console.log("new_replies_column_observer fired");
        if (document.querySelector('div[class="swiper-wrapper"]')) {
          new_replies_row_observer.disconnect();
          new_replies_row_observer.observe(document.querySelector('div[class="swiper-wrapper"]'), {childList: true});
        };
      });
      new_replies_column_observer.observe(document.querySelector('div[class="infinite-scroll-component "]'), {childList: true});
    }).catch(function() {
      console.log("swiper-wrapper observer ERROR");
    });
  };
//
//------------------------------Quickscroll « and » buttons------------------------------
//
  if (quickscrll) {
    var quickscroll_right_button = document.createElement('div');
    quickscroll_right_button.classList.add('Reload_Autoscroll_script', 'swiper-button-next-quickscroll');
    quickscroll_right_button.onclick = function (){
      event.stopPropagation();
      for (let step = 0; step < 5; step++) {
        ArrowRightKeyDown ();
      };
    };
    var quickscroll_left_button = document.createElement('div');
    quickscroll_left_button.classList.add('Reload_Autoscroll_script', 'swiper-button-prev-quickscroll');
    quickscroll_left_button.onclick = function (){
      event.stopPropagation();
      for (let step = 0; step < 5; step++) {
        ArrowLeftKeyDown ();
      };
    };
    function append_quickscroll_right_button () {
      if (document.querySelector('div[class="swiper-button-next"]')) {
        document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]').appendChild(quickscroll_right_button);
      } else if (document.querySelector('div[class="swiper-button-next swiper-button-disabled"]') && document.querySelector('div[class="Reload_Autoscroll_script swiper-button-next-quickscroll"]')) {
        document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]').removeChild(quickscroll_right_button);
      };
    };
    function append_quickscroll_left_button () {
      if (document.querySelector('div[class="swiper-button-prev"]')) {
        document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]').appendChild(quickscroll_left_button);
      } else if (document.querySelector('div[class="swiper-button-prev swiper-button-disabled"]') && document.querySelector('div[class="Reload_Autoscroll_script swiper-button-prev-quickscroll"]')) {
        document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]').removeChild(quickscroll_left_button);
      };
    };
    waitForElement('div[class="swiper-wrapper"]', 60000).then(function () {
      //console.log("swiper-wrapper observer SUCCESS");
      append_quickscroll_right_button ();
      append_quickscroll_left_button ();
      const swipe_buttons_row_observer = new MutationObserver(function () {
        //console.log("swipe_buttons_row_observer fired");
        append_quickscroll_right_button ();
        append_quickscroll_left_button ();
      });
      swipe_buttons_row_observer.observe(document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]>div:nth-of-type(3)'), {attributes: true, attributeFilter: ['class']});
      swipe_buttons_row_observer.observe(document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]>div:nth-of-type(2)'), {attributes: true, attributeFilter: ['class']});
      const swipe_buttons_intermediate_observer = new MutationObserver(function () {
        //console.log("swipe_buttons_intermediate_observer fired");
        swipe_buttons_intermediate_observer.disconnect();
        if (document.querySelector('div[class="swiper-wrapper"]')) {
          swipe_buttons_row_observer.disconnect();
          swipe_buttons_row_observer.observe(document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]>div:nth-of-type(3)'), {attributes: true, attributeFilter: ['class']});
          swipe_buttons_row_observer.observe(document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]>div:nth-of-type(2)'), {attributes: true, attributeFilter: ['class']});
        };
      });
      const swipe_buttons_column_observer = new MutationObserver(function () {
        //console.log("swipe_buttons_column_observer fired");
        if (document.querySelector('div[class="swiper-wrapper"]')) {
          swipe_buttons_intermediate_observer.observe(document.querySelector('div[class*="swiper swiper-initialized swiper-horizontal"]'), {childList: true});
        };
      });
      swipe_buttons_column_observer.observe(document.querySelector('div[class="infinite-scroll-component "]'), {childList: true});
    }).catch(function() {
      console.log("swiper-wrapper observer ERROR");
    });
  };
//
//------------------------------comment name here------------------------------
//
 
 
 
}, false);   ///   window.addEventListener('load', function () { closes here <---   ///