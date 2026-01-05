// ==UserScript==
// @name        Warframe WTB
// @namespace   Sygnano
// @description Auto WTB message
// @include     *warframe.market/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24976/Warframe%20WTB.user.js
// @updateURL https://update.greasyfork.org/scripts/24976/Warframe%20WTB.meta.js
// ==/UserScript==

var buttonParent = document.getElementsByClassName("search-exist")[0];
var button = document.createElement("button");         
                    
buttonParent.appendChild(button);   
button.innerHTML = "Create WTB/WTS Messages";
button.onclick = function() { addMessages() };

function addMessages()
{
  var sellList = null;
  var login = null;
  var name = null;
  var price = 0;
  
  var msgButton = null;

    sellList = document.getElementsByClassName("success");
    name = document.getElementsByClassName("twitter-typeahead")[0].childNodes[2].innerHTML;
    for (var i = 0; i < sellList.length; i++)
     {
       if (sellList[i].childNodes[1].childNodes[1].childNodes[0].childNodes[0])
         continue;
       login = sellList[i].childNodes[1].childNodes[1].href.substring(window.location.protocol == "https:" ? 33 : 32);
       price = sellList[i].childNodes[3].innerHTML;
       msgButton = document.createElement("button");
       msgButton.innerHTML = "Whisper";
       msgButton.value = "/w ".concat(login).concat(" Hi, I'd like to ").concat(sellList[i].parentNode.parentNode.id == "sell-table" ? "buy your " : "sell my ").concat(name).concat(" listed for ").concat(price).concat("p on warframe.market");
       msgButton.addEventListener("click", function(){whisp(this);});
       sellList[i].childNodes[1].childNodes[1].removeAttribute("href");
       sellList[i].childNodes[1].childNodes[1].childNodes[0].appendChild(msgButton);
     }
}

function whisp(txt)
{
  window.prompt("Ctrl-C to copy, Ctrl-V to paste", txt.value);
}