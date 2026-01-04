// ==UserScript==
// @name         AutoChat + MeanChat Menu (Made By FunkyAid)
// @description  AutoChat + MeanChat Menu (Open With The Button On The Top Right) join https://discord.gg/3AyKSvTGdh for scripts (mean chat messages credit by crygen)
// @version      FINAL
// @author       FunkyAid (discord user = funkyaid.py)
// @match        *://sploop.io/*
// @run-at       document-start
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @grant        none
// @namespace 
// @downloadURL
// @downloadURL https://update.greasyfork.org/scripts/512058/AutoChat%20%2B%20MeanChat%20Menu%20%28Made%20By%20FunkyAid%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512058/AutoChat%20%2B%20MeanChat%20Menu%20%28Made%20By%20FunkyAid%29.meta.js
// ==/UserScript==
// Add AutoChat option to Hack menu
const autoChatOption = `
<div class="control-box">
  <p style="font-size: 20px;font-weight: bold;color: white;">AutoChat</p>
  <input id="auto-chat-message-1" class="input text-shadowed-3" placeholder="Enter message 1..." value="Hello, world!">
  <input id="auto-chat-message-2" class="input text-shadowed-3" placeholder="Enter message 2..." value="This is a test!">
  <input id="auto-chat-message-3" class="input text-shadowed-3" placeholder="Enter message 3..." value="AutoChat is enabled!">
  <input id="auto-chat-message-4" class="input text-shadowed-3" placeholder="Enter message 4..." value="Have fun!">
  <input id="auto-chat-delay" class="input text-shadowed-3" placeholder="Enter delay (seconds)..." value="10" type="number">
  <button id="auto-chat-toggle" class="togglerButton text-shadowed-3" style="background: #96b943; box-shadow: inset 0 -5px 0 #809836;">Enabled</button>
</div>
`

// Add MeanChat option to Hack menu
const meanChatOption = `
<div class="control-box">
  <p style="font-size: 20px;font-weight: bold;color: white;">MeanChat</p>
  <input id="mean-chat-delay" class="input text-shadowed-3" placeholder="Enter delay (seconds)..." value="10" type="number">
  <button id="mean-chat-toggle" class="togglerButton text-shadowed-3" style="background: #96b943; box-shadow: inset 0 -5px 0 #809836;">Enabled</button>
</div>
`

// Add menu
const settingMenu = `
<div id="settingMenu" class="pop-box" style="display: none;">
  <div class="menu-title">
    <div class="pop-title text-shadowed-4">Settings</div>
    <div class="pop-close-button">
      <img id="setting-menu-close-button" class="pop-close" draggable="false" src="https://images-ext-2.discordapp.net/external/mgjNglv928NY9v8XuIr2Z2mFbQHliKADNMZn9XsDibA/https/sploop.io/img/ui/close.png">
    </div>
  </div>
  <div class="navbar">
    <div class="nb-btn text-shadowed-3" id="hack" style="margin-right: 10px;">Hack</div>
    <div class="nb-btn text-shadowed-3" id="control">Control</div>
  </div>
  <div class="select pop-list-content scrollbar text-shadowed-3 content subcontent-bg" id="hat_menu_content" data-menu="1"></div>
  <div class="select pop-list-content scrollbar text-shadowed-3 content subcontent-bg" id="hat_menu_content" data-menu="2" style="display: none;">
  </div>
</div>
<style>
.control-box {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  width:  100%;
  align-items: center;
}
#control-key {
  width: 180px;
  text-align: left;
  text-indent: 16px;
  color: white;
  line-height: 70px;
  height: 40px;
  font-weight: 600;
}
 .navbar {
  display: flex;
}
.nb-btn {
  margin-top: 5px;
  width: 150px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 -3px 0 #333;
  border-radius: 7px;
  background-color: rgb(40 45 34 / 60%);
  border : 4px solid #141414;
  cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;
}
#hat_menu_content {
  padding: 8px 0 0 0;
  margin-bottom: 0px;
  margin-top: 2.5px;
}
.togglerButton {
  margin-left: auto;
  outline: none;
  border: 4px solid #141414;
  padding:  7px;
  font-size : 16px;
  margin-right: 5px;
  cursor: url(https://sploop.io/img/ui/cursor-pointer.png) 6 0, pointer;
  margin-top: auto;
 margin-bottom: auto;
  color: #fff;
  border-radius: 10px;
  background-color: #96b943;
  box-shadow: inset 0 -5px 0 #809836;
}
.togglerButton:hover {
 background-color: #b5de53;
  box-shadow: inset 0 -5px 0 #95af44;
}
.name-desc {
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  margin-bottom: 5px;
}
.item-container {
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 3px solid #141414;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 5px;
}
.menu-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#settingMenu {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 367px;
  width: 500px;
  display: none;
  opacity: 1;
  background: rgba(40, 45,  34,  0.6);
  color: #fff;
}
</style>
<script>
function SupressInput($event) {
  $event.preventDefault();
}
</script>
`

const settingButton = `
<div id="setting-button" style="position: absolute; top: 10px; right: 10px; cursor: url(https://sploop.io/img/ui/cursor-pointer.png) 6 0, pointer;">
  <button id="setting-button-click" style="outline: none; border: 4px solid #141414; padding: 7px; font-size: 16px; margin-right: 5px; color: #fff; border-radius: 10px; background-color: #96b943; box-shadow: inset 0 -5px 0 #809836;">Settings</button>
</div>
<style>
#setting-button-click:hover {
  background-color: #b5de53;
  box-shadow: inset 0 -5px 0 #95af44;
}
</style>
`

$("body").append(settingMenu)
$("body").append(settingButton)
$('[data-menu="1"]').append(autoChatOption)
$('[data-menu="1"]').append(meanChatOption)

$("#setting-button-click").click(() => {
  if ($("#settingMenu").css("display") == "none") {
    $("#settingMenu").css("display", "flex")
  } else {
    $("#settingMenu").css("display", "none")
  }
})

let autoChatEnabled = false;
let autoChatInterval = null;

$("#auto-chat-toggle").click(() => {
  if (autoChatEnabled) {
    autoChatEnabled = false;
    $("#auto-chat-toggle").css("background-color", "#b94343")
    $("#auto-chat-toggle").css("box-shadow", "inset 0 -5px 0 #983636")
    $("#auto-chat-toggle").text("Disabled")
    clearInterval(autoChatInterval);
    addNotifications("AutoChat <span style='color: #cc5151'>disabled</span>")
  } else {
    autoChatEnabled = true;
    $("#auto-chat-toggle").css("background-color","#96b943")
    $("#auto-chat-toggle").css("box-shadow", "inset 0 -5px 0 #809836")
    $("#auto-chat-toggle").text("Enabled")
    autoChatInterval = setInterval(() => {
      const message1 = $("#auto-chat-message-1").val();
      const message2 = $("#auto-chat-message-2").val();
      const message3 = $("#auto-chat-message-3").val();
      const message4 = $("#auto-chat-message-4").val();
      const delay = parseInt($("#auto-chat-delay").val());
      // Send messages to chat using Sploop.chat function
      Sploop.chat(message1);
      setTimeout(() => Sploop.chat(message2), delay * 1000);
      setTimeout(() => Sploop.chat(message3), delay * 2000);
      setTimeout(() => Sploop.chat(message4), delay * 3000);
    }, parseInt($("#auto-chat-delay").val()) * 4000);
    addNotifications("AutoChat <span style='color: #8ecc51'>enabled</span>")
  }
})

let meanChatEnabled = false;
let meanChatInterval = null;

const meanChatMessages = [
  "you're so bad",
  "get good, noob",
  "try harder next time",
  "is that your best shot?",
  "you're a real rookie",
  "even a potato plays better",
  "you call that a move?",
  "no skill at all",
  "do you even practice?",
  "i've seen better from a bot",
  "you play like my grandma",
  "you're just a free kill",
  "give up already",
  "not even close",
  "you're a walking target",
  "that was embarrassing",
  "your game sense is zero",
  "i thought this was a joke",
  "who taught you to play?",
  "you should stick to watching",
  "is this your first game?",
  "you make it too easy",
  "i've met rocks with more skill"
];

$("#mean-chat-toggle").click(() => {
  if (meanChatEnabled) {
    meanChatEnabled = false;
    $("#mean-chat-toggle").css("background-color", "#b94343")
    $("#mean-chat-toggle").css("box-shadow", "inset 0 -5px 0 #983636")
    $("#mean-chat-toggle").text("Disabled")
    clearInterval(meanChatInterval);
    addNotifications("MeanChat <span style='color: #cc5151'>disabled</span>")
  } else {
    meanChatEnabled = true;
    $("#mean-chat-toggle").css("background-color","#96b943")
    $("#mean-chat-toggle").css("box-shadow", "inset 0 -5px 0 #809836")
    $("#mean-chat-toggle").text("Enabled")
    meanChatInterval = setInterval(() => {
      const delay = parseInt($("#mean-chat-delay").val());
      const randomMessage = meanChatMessages[Math.floor(Math.random() * meanChatMessages.length)];
      Sploop.chat(randomMessage);
      setTimeout(() => Sploop.chat(randomMessage), delay * 1000);
    }, parseInt($("#mean-chat-delay").val()) * 4000);
    addNotifications("MeanChat <span style='color: #8ecc51'>enabled</span>")
  }
})