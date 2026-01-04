// ==UserScript==
// @name         Stats Cellcraft
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show some Extra stuff / Take off/on Things
// @author       qwd
// @match        https://cellcraft.io/
// @icon         https://agarpowers.xyz/assets/img/coin2.png
// @grant        none
// @license      qwd

// @downloadURL https://update.greasyfork.org/scripts/469222/Stats%20Cellcraft.user.js
// @updateURL https://update.greasyfork.org/scripts/469222/Stats%20Cellcraft.meta.js
// ==/UserScript==

function info() {
    var infobox = document.createElement("div");
    infobox.setAttribute("id", "infobox");
    var body = document.querySelector(".inner-overlays");
    infobox.style.zIndex="90"; infobox.style.width="200px"; infobox.style.height="auto"; infobox.style.position="absolute"; infobox.style.marginTop="80px"; infobox.style.border="2px solid white"; infobox.style.borderRadius="7px"; infobox.style.color="white";infobox.style.padding="10px";
    var fpsText = document.createElement("div");
    var pingText = document.createElement("div");
    var xpGainedText = document.createElement("div");
    var xpBeforeText = document.querySelector(".exp-bar").textContent;
    var xpBefore = xpBeforeText.replace('%', '');
    var levelBefore = document.getElementById("level");
    var coinsGainedText = document.createElement("div");
    var coinsBeforeText = document.getElementById("coinsDash").textContent;
    var coinsBefore = coinsBeforeText.replace(' ', '');
    var CrazyText = document.createElement("div");
    var GigaText = document.createElement("div");
    var VirusText = document.createElement("div");
    var onlineText = document.createElement("div");
    function updateInfo(){
        var levelAfter = document.getElementById("level");
        var fps = document.getElementById("fps").textContent;
        var ping = document.getElementById("ping").textContent;
        if (fps =>60) {fpsText.style.color="lime";}
        if (fps < 60) {fpsText.style.color="orange";}
        if (fps < 30) {fpsText.style.color="red";}
        fpsText.innerHTML = "FPS: " + fps ;
        pingText.innerHTML = "Ping: " + ping ;
        if (levelBefore === levelAfter) {
            var xpAfterText = document.querySelector(".exp-bar").textContent;
            var xpAfter = xpAfterText.replace('%', '');
            var xpGained = (xpAfter - xpBefore);
            xpGainedText.innerHTML = 'XP Gained: ' + xpGained + '%' ;
            sessionStorage.setItem("xpGained", xpGained);
        }
        if (levelBefore > levelAfter) {
            var savedXP = sessionStorage.getItem("xpGained");
            var xpAfter2Text = document.querySelector(".exp-bar").textContent;
            var xpAfter2 = xpAfter2Text.replace('%', '');
            var xpGained2 = parseFloat(savedXP) + parseFloat(xpAfter2);
            xpGainedText.innerHTML = "XP Gained: " + xpGained2 + "%";
        }
        var coinsAfterText = document.getElementById("coinsDash").textContent;
        var coinsAfter = coinsAfterText.replace(' ', '');
        var coinsGained = (coinsAfter - coinsBefore);
        coinsGainedText.innerHTML = 'Coins Gained: ' + coinsGained;
        var Crazy = document.querySelector('#serverRow1 .info .details').textContent.replace('/150', '');
        var Giga = document.querySelector('#serverRow2 .info .details').textContent.replace('/150', '');
        var Virus = document.querySelector('#serverRow3 .info .details').textContent.replace('/150', '')
        CrazyText.innerHTML = 'Crazy: ' + Crazy ;
        GigaText.innerHTML = 'Gigasplit: ' + Giga ;
        VirusText.innerHTML = 'VirusFarm: ' + Virus ;
        if (document.getElementById("onlinestatus").checked) {
            onlineText.innerHTML = 'Profile: Public';
        }
        else {
            onlineText.innerHTML = 'Profile: Hidden';
        }

    } setInterval(updateInfo, 2000);

    infobox.appendChild(fpsText);
    infobox.appendChild(pingText);
    infobox.appendChild(onlineText);
    infobox.appendChild(xpGainedText);
    infobox.appendChild(coinsGainedText);
    infobox.appendChild(CrazyText);
    infobox.appendChild(GigaText);
    infobox.appendChild(VirusText);
    body.appendChild(infobox);
}
setTimeout(info, 3000);
function keybinds() {
    var keybindbox = document.createElement("div");
    keybindbox.setAttribute("id", "keybindbox");
    var body = document.querySelector(".inner-overlays");
    keybindbox.style.zIndex="90"; keybindbox.style.width="200px"; keybindbox.style.height="auto"; keybindbox.style.position="absolute"; keybindbox.style.marginTop="305px"; keybindbox.style.border="2px solid white"; keybindbox.style.borderRadius="7px"; keybindbox.style.color="white";keybindbox.style.padding="10px";
    var toggleBotsText = document.createElement("div");
    var splitBotsText = document.createElement("div");
    var ejectBotsText = document.createElement("div");
    var shotText = document.createElement("div");
    function updateKeys() {
        var toggleBots = document.getElementById("keyToggleControlBots").textContent;
        toggleBotsText.innerHTML = 'Toggle Bots: ' + toggleBots ;
        var splitBots = document.getElementById("keySplitBots").textContent;
        splitBotsText.innerHTML = 'Split Bots: ' + splitBots ;
        var ejectBots = document.getElementById("keyFeedBots").textContent;
        ejectBotsText.innerHTML = 'Bots Feed: ' + ejectBots ;
        var shot = document.getElementById("key360").textContent;
        shotText.innerHTML = '360 Shot: ' + shot ;

    } setInterval(updateKeys, 2000);
    keybindbox.appendChild(toggleBotsText);
    keybindbox.appendChild(splitBotsText);
    keybindbox.appendChild(ejectBotsText);
    keybindbox.appendChild(shotText);
    body.appendChild(keybindbox);
}
setTimeout(keybinds, 3000);
function btns() {
    var btnsbox = document.createElement("div");
    var body = document.querySelector(".inner-overlays");
    btnsbox.style.padding="0";btnsbox.style.zIndex="90"; btnsbox.style.width="200px"; btnsbox.style.height="auto"; btnsbox.style.position="absolute"; btnsbox.style.marginTop="430px"; btnsbox.style.border="2px solid white"; btnsbox.style.borderRadius="7px"; btnsbox.style.color="white";
    var infoBtn = document.createElement("button");
    infoBtn.style.border="2px solid white"; infoBtn.style.borderRadius="7px";infoBtn.style.background="none"; infoBtn.style.color="white"; infoBtn.style.padding="8px";
    infoBtn.innerHTML = 'Infobox';
    var keybindBtn = document.createElement("button");
    keybindBtn.style.border="2px solid white"; keybindBtn.style.borderRadius="7px";keybindBtn.style.background="none";keybindBtn.style.color="white"; keybindBtn.style.padding="8px";
    keybindBtn.innerHTML = 'Keybinds';
    var chatBtn = document.createElement("button");
    chatBtn.style.border="2px solid white"; chatBtn.style.borderRadius="7px";chatBtn.style.background="none";chatBtn.style.color="white"; chatBtn.style.padding="8px";
    chatBtn.innerHTML = 'Chat';
    var mapBtn = document.createElement("button");
    mapBtn.style.border="2px solid white"; mapBtn.style.borderRadius="7px"; mapBtn.style.background="none";mapBtn.style.color="white"; mapBtn.style.padding="8px";
    mapBtn.innerHTML = 'Map';
    var leaderBtn = document.createElement("button");
    leaderBtn.style.border="2px solid white"; leaderBtn.style.borderRadius="7px"; leaderBtn.style.background="none";leaderBtn.style.color="white"; leaderBtn.style.padding="8px";
    leaderBtn.innerHTML = 'Leaderboard';

    let clickCountI = 0;
    var info = document.getElementById("infobox");
    infoBtn.addEventListener('click', function() {
  if (clickCountI === 0) {
    info.style.display="none";
    clickCountI++;
  } else {
    info.style.display="block";
    clickCountI--;
  }
    });
    let clickCountK = 0;
    var keybind = document.getElementById("keybindbox");
    keybindBtn.addEventListener('click', function() {
  if (clickCountK === 0) {
    keybind.style.display="none";
    clickCountK++;
  } else {
    keybind.style.display="block";
    clickCountK--;
  }
    });
    let clickCountC = 0;
    var chat = document.getElementById("chat");
    chatBtn.addEventListener('click', function() {
  if (clickCountC === 0) {
    chat.style.display="none";
    clickCountC++;
  } else {
    chat.style.display="block";
    clickCountC--;
  }
    });
    let clickCountM = 0;
    var map = document.getElementById("minimap");
    mapBtn.addEventListener('click', function() {
  if (clickCountM === 0) {
    map.style.display="none";
    clickCountM++;
  } else {
    map.style.display="block";
    clickCountM--;
  }
    });
    let clickCountL = 0;
    var leader = document.getElementById("leaderboard");
    leaderBtn.addEventListener('click', function() {
  if (clickCountL === 0) {
    leader.style.display="none";
    clickCountL++;
  } else {
    leader.style.display="block";
    clickCountL--;
  }
    });

    btnsbox.appendChild(infoBtn);
    btnsbox.appendChild(keybindBtn);
    btnsbox.appendChild(chatBtn);
    btnsbox.appendChild(mapBtn);
    btnsbox.appendChild(leaderBtn);
    body.appendChild(btnsbox);
}
setTimeout(btns, 3010);
