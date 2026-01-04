// ==UserScript==
// @name        Progress Knight 2.0 Bot
// @namespace   PK2Bot
// @match       *://symb1.github.io/progress_knight_2/*
// @grant       none
// @version     1.0.0
// @author      Lexiebean <lexie@lexiebean.net>
// @license     GNU GPLv3
// @description Auto parts of Progress Knight 2.0
// @downloadURL https://update.greasyfork.org/scripts/439836/Progress%20Knight%2020%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/439836/Progress%20Knight%2020%20Bot.meta.js
// ==/UserScript==

function AutoBuy() {
  
  //AutoBuy Logic:
  //Will only buy upgrades that you can afford.
  //For properties, this factors in the price of the previous property on the list. So if you currently afford the Cottage with your current Net/day, but you COULD if you "sold" your Woooden Hut, it will buy the Cottage.
  //Will only buy properies that are more expensive than the current owned property. So you can manually play use properties that would cause a loss but are actually worth it if you have excess money. (Can I automate this logic?)
  //Will never deactivate Misc upgrades once bought.
  
  if (document.getElementById("autoBuy").checked) {
    
    //scan the shop
    var trs = document.getElementById("shop").getElementsByTagName("tr")
    var state = 0
    var cost = 0
    for(i=0;i<trs.length;i++) {
      var c = trs[i].className
      var p = 1
      if (c == "Misc headerRow") { p = 2 }

      //Get the cost of each upgrade
      if (c != "hidden" && c != "Misc headerRow" && c != "Properties headerRow") {
        var id = trs[i].id.replace("row ","")
        var costold = cost
        var cost = gameData.itemData[id].getExpense()

        //Buy upgrades
        net = getNet()
        if (p = 1) { net = net + costold } //Factor in the price of the previous property
        btnState = getComputedStyle(trs[i].getElementsByClassName("active w3-circle")[0]).getPropertyValue("background-color")
				if (btnState == "rgb(33, 158, 188)") { state = 1 } //Only buy properties if they're more expensive than the current owned property

        if (cost <= net && state == 1) {
          if (btnState != "rgb(181, 101, 118)") { //Don't try to re-buy Misc upgrades
            trs[i].getElementsByTagName("button")[0].click() //Buy the upgrade
          }
        }
      }
    }
  }
}

function main() {
	AutoBuy()
}

function init() {

  //set up the page
	auto = document.getElementById("automation")
	span = auto.getElementsByTagName("span")[1].innerHTML
	span = span.replace("Learn","Buy")
	span = span.replace("learn","buy")
	br = document.createElement("br")
	newspan = document.createElement("span")
	newspan.innerHTML = span
	document.getElementById("autoLearn").className = "inline"
	auto.appendChild(br)
	auto.appendChild(newspan)
  document.getElementById("autoBuy").checked = true

  //run the bot
  PK2Bot = setInterval(main, 1000);
}

init()
