// ==UserScript==
// @name         </> Kurt & Java Raid (L) Anaktarı
// @namespace    http://tampermonkey.net/
// @version      12.5
// @description  Kurt & Java
// @author       Kurt
// @match        http://zombs.io/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/424136/%3C%3E%20Kurt%20%20Java%20Raid%20%28L%29%20Anaktar%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/424136/%3C%3E%20Kurt%20%20Java%20Raid%20%28L%29%20Anaktar%C4%B1.meta.js
// ==/UserScript==

// Çok Beklenen Raid Modumuz

var Settings = ''
Settings += `
<input type="text" class="TFkey" placeholder="Anaktar (L)">
<button class="TFvalidKey">Kayıt</button>
<button class="TFbtn">Kule Dondurucu (&)</button>
`

document.getElementsByClassName('hud-party-server')[0].innerHTML = Settings

var menu = $("hud-party-server");
for (var i = 0; i < menu.children.length; i++) {
  var child = menu.children[i];
  child.addEventListener('click', function() {
    $("myCustomIcon").click();
  })
}

$("TFbtn").addEventListener("click", FREEZE);
var TowerFreeze = null;
var key;
$("TFvalidKey").addEventListener("click", function() {
  key = $("TFkey").value;
});

function FREEZE() {
  if ($("TFbtn").innerText == "Kule Dondurucu (+)") {
    $("TFbtn").innerText = "Kule Dondurucu (-)";
  } else {
    $("TFbtn").innerText = "Kule Dondurucu (+)";
  }
  if (TowerFreeze == null) {
    TowerFreeze = setInterval(function() {
      Game.currentGame.network.sendRpc({
        name: "JoinPartyByShareKey",
        partyShareKey: key
      });
      Game.currentGame.network.sendRpc({
        name: "LeaveParty"
      })
    }, 50);
  } else {
    clearInterval(TowerFreeze);
    TowerFreeze = null;
  }
}
