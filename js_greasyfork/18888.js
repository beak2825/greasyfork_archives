// ==UserScript==
// @name         CotG Bot
// @version      0.1.4
// @description  Botnet for Crown of the God
// @author       lionnel0
// @include      https://w1.crownofthegods.com/*
// @exclude      view-source://*
// @grant        none
// @namespace https://greasyfork.org/users/39286
// @downloadURL https://update.greasyfork.org/scripts/18888/CotG%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/18888/CotG%20Bot.meta.js
// ==/UserScript==
function _CotGBotMain() {
    this.Debug = true;
    this.logNewChat = function() {
        console.log($(this).children().last());
    }
    this.init = function() {
        //debugger;
        if(this.Debug) console.log("Init CotG Bot...");
        //$("#chatDisplaya").bind("DOMNodeInserted", this.logNewChat);
        //$("#chatOut").children("input").val("/w lionnel0 A");
        //$("#chatOut").children("button").click();
		
		// Adding a clear button
		var clearButton= $('<button id="chatClear" class="greenb" style="height: 85%;width: 5%;font-size: 75%;color: #F3D298;text-align: center;font-family: Arial, Sans-Serif;border-color: #DAA520;position: absolute;right: 18.5%;top: 7%;">Clear</button>').insertAfter("#chatTabsButtons");
		clearButton.click(function() {$("#chatDisplay").children().remove();$("#chatDisplaya").children().remove();});
    };
}
$(document).ready(function() {
    console.log("Sarting CotG Bot...");
    if ($("#chatDisplaya").length == 0) {
        console.log("Game not started :(");
    } else {
        CotGBot = new _CotGBotMain();
        setTimeout(function() {
          CotGBot.init();
        }, 5000);
        
    }
});