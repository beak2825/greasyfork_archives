// ==UserScript==
// @name         stats cellcraft
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Information Box (Fps, Ping, PlayTime:)
// @author       
// @match        https://cellcraft.io/*
// @icon         
// @grant        none
// @license      
// @downloadURL https://update.greasyfork.org/scripts/495271/stats%20cellcraft.user.js
// @updateURL https://update.greasyfork.org/scripts/495271/stats%20cellcraft.meta.js
// ==/UserScript==


function button() {
  var targetContainer2 = document.querySelector(".setting-col");
  var targetContainer3 = document.querySelector("#ingame-ui");


  if (!targetContainer2) {
    console.log("TamperMonkey: Target container does not exist");
    return;
  }
  var button2 = document.createElement("button");
    var inputDark = document.createElement("input");
    inputDark.setAttribute("type", "checkbox");
    inputDark.style.marginLeft = "0px";
    var inputText = document.createElement("SPAN");
    inputText.innerHTML = "DarkMode"; inputText.style.marginLeft = "20px"; inputText.textDecoration = "underlined"

  inputDark.addEventListener("change", function(event) {
    if (event.target.checked) {
      DarkChecked();
    } else {
      Darkunchecked();
    }
  });

// Darkmode Checkbox
    function Darkunchecked() {
        var title = document.getElementById("title");
      title.textShadow = "0 0 15px black, 0 0 30px black";
var xpbar = document.getElementById("xp-bar");
      xpbar.style.backgroundImage = "linear-gradient(to right,#1aa7ec,#2537af)";
 var xpbarIn = document.getElementById("ingame-xp-bar");
      xpbarIn.style.backgroundImage = "linear-gradient(to right,#1aa7ec,#2537af)";
 var xpIn = document.querySelector(".xp-container");
      xpIn.style.borderTop = "black"; xpIn.style.borderBottom = "black"; xpIn.style.borderRight = "black";

 var level = document.getElementById("level");
    level.style.backgroundColor = "#1aa7ec";
 var levelIn = document.querySelector(".level-circle");
      levelIn.style.backgroundColor = "#1aa7ec";
      levelIn.style.border = "10px ridge #2284c4"
var play = document.getElementById("play-btn");
      play.style.backgroundColor = "#2579ff";
var spec = document.getElementById("spectate-btn");
      spec.style.backgroundColor = "#2579ff";
var settings = document.getElementById("cSettings");
        settings.style.backgroundColor="#4f4f4f";
      settings.addEventListener("click", function(event) {
          settings.style.backgroundColor="#2579ff";});
var controls = document.getElementById("cControls");
        controls.style.backgroundColor="#4f4f4f";
      controls.addEventListener("click", function(event) {
          controls.style.backgroundColor="#2579ff";});
var servers = document.getElementById("cServers");
        servers.style.backgroundColor="#4f4f4f";
      servers.addEventListener("click", function(event) {
          servers.style.backgroundColor="#2579ff";});
    document.getElementById("mana-count").style.color = "#fff";
    var powerdisplay = document.getElementById("powerup-display");
    document.getElementById("mana-bar").style.backgroundColor = "#2c303a";
    powerdisplay.style.borderTop = "2px solid #0077e6";
    powerdisplay.style.borderRight = "2px solid #0077e6";
    powerdisplay.style.borderLeft = "2px solid #0077e6";
    document.getElementById("mana-count").style.color = "grey";

 }


function DarkChecked(){
    var title = document.getElementById("title");
    title.textShadow = "0 0 15px black, 0 0 30px black";
    var xpbar = document.getElementById("xp-bar");
    xpbar.style.backgroundImage = "linear-gradient(to right,black,white";
    var xpbarIn = document.getElementById("ingame-xp-bar");
    xpbarIn.style.backgroundImage = "linear-gradient(to right,black,white";
    var xpIn = document.querySelector(".xp-container");
    xpIn.style.borderTop = "black"; xpIn.style.borderBottom = "black"; xpIn.style.borderRight = "black";

    var level = document.getElementById("level");
    level.style.backgroundColor = "black";
    var levelIn = document.querySelector(".level-circle");
    levelIn.style.backgroundColor = "black";
    levelIn.style.border = "10px ridge black"
    var play = document.getElementById("play-btn");
    play.style.backgroundColor = "black";
    var spec = document.getElementById("spectate-btn");
    spec.style.backgroundColor = "black";
    var settings = document.getElementById("cSettings");
    settings.style.backgroundColor = "black";
    var controls = document.getElementById("cControls");
    controls.style.backgroundColor = "black";
    var servers = document.getElementById("cServers");
    servers.style.backgroundColor = "black";
    var manabar = document.getElementById("mana-bar");
    manabar.style.backgroundColor = "black";
    document.getElementById("mana-count").style.color = "grey";
    document.getElementById("powerup-display").style.background = "none";
    document.getElementById("powerup-display").style.border = "none";



     // Change pics of pws
     var merge = document.querySelector("#pwMerge img");
     merge.src = "https://agma.io/img/store/recombine-min.png";

     var antimerge = document.querySelector("#pwAntimerge img");
      antimerge.src = "https://agma.io/skins/objects/21.png";
     var speed = document.querySelector("#pwSpeed img");
     speed.src ="https://agma.io/img/store/speed-min.png";
     var virus = document.querySelector("#pwVirus img");
     virus.src = "https://agma.io/img/store/virus3.png";
     var growth = document.querySelector("#pwGrowth img");
     growth.src = "https://agma.io/img/growth.png";
     var freezeVirus = document.querySelector("#pwFrzVirus img");
     freezeVirus.scr = "https://agma.io/img/store/frozen_virus.png";
     var goldenblock = document.querySelector("#pwBlock img");
     goldenblock.src = "https://agma.io/img/store/goldore.png";
     var antifreeze = document.querySelector("#pwAntifrz img");
     antifreeze.src = "https://agma.io/skins/objects/20.png";
     var shield = document.querySelector("#pwShield img");
     shield.src = "https://agma.io/img/inv_shield5.png";

     }
targetContainer2.appendChild(inputDark);
targetContainer2.appendChild(inputText);



}
button();
// Wearable Box
function wearable() {
   let bunny = false;
   let bat = false;
   let witch = false;
   let party = false;
   let santa = false;
   let none = false;
   var wearable = document.createElement("div");
    wearable.setAttribute("id", "wearable");
    wearable.style.width="200px";wearable.style.height="auto";wearable.style.border="2px solid white";
    wearable.style.zIndex="50";wearable.style.position="absolute"; wearable.style.padding="8px";
    wearable.style.marginTop="+460px";wearable.style.borderRadius="7px";wearable.style.color="white";
    wearable.style.boxShadow="inset 2px 0px 3px white"

    var bunnyW = document.createElement("div");
    var batW = document.createElement("div");
    var witchW = document.createElement("div");
    var partyW = document.createElement("div");
    var santaW = document.createElement("div");
   function updateWearable() {
     if (document.getElementById("wearableBtn1").innerHTML === 'Unequip Wearable') {
       bunny = true;
       bunnyW.innerHTML = "Bunny Ears: Equiped";
       bunnyW.style.color="lime";
     }
     else {
     bunny = false;
     bunnyW.innerHTML = "Bunny Ears: Unequiped";
     bunnyW.style.color="red";
     }
     if (document.getElementById("wearableBtn2").innerHTML === 'Unequip Wearable') {
       bat = true;
       batW.innerHTML = "Bat Wings: Equiped";
       batW.style.color="lime";
     }
     else {
     bat = false;
     batW.innerHTML = "Bat Wings: Unequiped";
     batW.style.color="red";
     }
     if (document.getElementById("wearableBtn3").innerHTML === 'Unequip Wearable') {
       witch = true;
       witchW.innerHTML = "Witches Hat: Equiped";
       witchW.style.color="lime";
     }
     else {
     witch = false;
     witchW.innerHTML = "Witch Hat: Unequiped";
     witchW.style.color="red";
     }
     if (document.getElementById("wearableBtn4").innerHTML === 'Unequip Wearable') {
       party = true;
       partyW.innerHTML = "Party Hat: Equiped";
       partyW.style.color="lime";
     }
     else {
     party = false;
     partyW.innerHTML = "Party Hat: Unequiped";
     partyW.style.color="red";
     }
     if (document.getElementById("wearableBtn5").innerHTML === 'Unequip Wearable') {
       santa = true;
       santaW.innerHTML = "Santa Hat: Equiped";
       santaW.style.color="lime";
     }
     else {
     santa = false;
     santaW.innerHTML = "Santa Hat: Unequiped";
     santaW.style.color="red";
     }


   }
    setInterval(updateWearable, 2000);
    wearable.appendChild(bunnyW);
    wearable.appendChild(batW);
    wearable.appendChild(witchW);
    wearable.appendChild(partyW);
    wearable.appendChild(santaW);
    var body = document.querySelector("body");
    body.appendChild(wearable);
}
wearable()
// Information Box (Fps, Ping, etc.)
function containerInfo(){

var container = document.createElement("div");
    container.setAttribute("id", "infor");
    container.style.width="200px";container.style.height="auto";container.style.border="2px solid white";
    container.style.zIndex="50";container.style.position="absolute"; container.style.padding="8px";
    container.style.marginTop="+200px";container.style.borderRadius="7px";container.style.color="white";
    container.style.boxShadow="inset 2px 0px 3px white"
    var fps = document.createElement("div");
    const fpsV = document.getElementById("fps");

    var ping = document.createElement("div");
    const pingV = document.getElementById("ping");

    var cells = document.createElement("div");
    const cellsV = document.getElementById("cells");

    var profile = document.createElement("div");
    const profileV = document.getElementById("setVisibility");

    var instant = document.createElement("div");
    const instantP = document.getElementById("plrCount1");

    var classic = document.createElement("div");
    const classicP = document.getElementById("plrCount2");

    var xpleft = document.createElement("div");

    const xpl = document.getElementById("xp-bar-text");

    var online = document.createElement("div");
    online.setAttribute("id", "online");
let count = 0;

//Playtime Counter
function updateCounter() {

  const hours = Math.floor(count / 3600);
  const minutes = Math.floor((count % 3600) / 60);
  const seconds = count % 60;
  count++;
  online.innerHTML = `Playtime: ${hours}h, ${minutes}min, ${seconds}s`;
}

setInterval(updateCounter, 1000);
// Coins & XP Calculating
function getCoins() {
    var coinsGained = document.createElement("div");
    coinsGained.setAttribute("id", "coinsg");
    const pCoins = document.getElementById("coinText");
    const pCoinsV = pCoins.textContent;
    const pCoinsV2 = pCoinsV.replace(' ', '');
    const pCoinsV3 = pCoinsV2.replace(' ', '');

    var xpGained = document.createElement("div");
    const pXP = document.getElementById("xp-bar-text");
    const pXPV = pXP.textContent;
    const pXPV2 = pXPV.replace(' %', '');
var levelg = document.getElementById("level").textContent;

// Updating Function for Coins & XP
var aXPV; 
var rXP; 

function updateGained() {
  var levelgN = document.getElementById("level").textContent;

  const nCoins = document.getElementById("coinText");
  const nCoinsV = nCoins.textContent;
  const nCoinsV2 = nCoinsV.replace(' ', '');
  const nCoinsV3 = nCoinsV2.replace(' ', '');
  const rCoin = nCoinsV3 - pCoinsV3;
  coinsGained.innerHTML = "Gained Coins: " + rCoin;
  container.appendChild(coinsGained);

  if (levelg === levelgN) {
    const nXP = document.getElementById("xp-bar-text");
    const nXPV = nXP.textContent;
    const nXPV2 = nXPV.replace(' %', '');
    rXP = (nXPV2 - pXPV2).toFixed(2);
    console.log("gleich");
    xpGained.innerHTML = "Gained XP: " + rXP + "%";
    sessionStorage.setItem("rXP", rXP);

  }

  if (levelg < levelgN) {
    var SavedrXP = sessionStorage.getItem("rXP");
    console.log(SavedrXP);
    const aXP = document.getElementById("xp-bar-text");
    const aXPT = aXP.textContent;
    aXPV = aXPT.replace(' %', '');
    const dXP = parseFloat(aXPV) + parseFloat(SavedrXP);
    const dXPFixed = dXP.toFixed(2);

    xpGained.innerHTML = "Gained XP: " + dXPFixed + "%";
  }

  xpleft.setAttribute("id", "xpl");
  container.appendChild(xpGained);
}

setInterval(updateGained, 2000);


} setTimeout(getCoins, 1900);
// Double XP / Coins
    let DoubleXP = false;
    let DoubleCoin = false;
    var doublex = document.createElement("div");
    var doublec = document.createElement("Div");



  var body = document.querySelector("body");
    container.appendChild(fps);
    container.appendChild(ping);
    container.appendChild(cells);
    container.appendChild(profile);
    container.appendChild(instant);
    container.appendChild(classic);
    container.appendChild(xpleft);
    container.appendChild(online);
    container.appendChild(doublex);
    container.appendChild(doublec);


    body.appendChild(container);
// Update all in the Information Box
function updateProgress() {

    const currentFPS = parseInt(fpsV.textContent);
    fps.innerHTML = "Fps: " + currentFPS;
    if (currentFPS > 60) {fps.style.color="lime";}
    else if (currentFPS > 30){fps.style.color="orange";}
    else{fps.style.color="red";}

    const currentPing = parseInt(pingV.textContent);
    ping.innerHTML = "Ping: " + currentPing;
    if (currentPing < 61) {ping.style.color="lime";}
    else if (currentPing < 120){ping.style.color="orange";}
    else{ping.style.color="red";}

    if (profileV.checked) {
    profile.innerHTML = "Profile is: Hidden";
    }
    else {
    profile.innerHTML = "Profile is: Public";
    }
    const currentI = instantP.textContent;
    const currentInstant = currentI.replace(' Players', '');
    instant.innerHTML = "Instant: " + currentInstant;

    const currentC = classicP.textContent;
    const currentClassic = currentC.replace(' Players', '');
    classic.innerHTML = "Classic: " + currentClassic;

    const lxp = xpl.textContent;
    const lxpWo = lxp.replace(' %', '');
    const currentlxp = (100 - lxpWo).toFixed(2);
    xpleft.innerHTML = "XP Left: " + currentlxp + "%";

    const nCoins = document.getElementById("coinText");
    const nCoinsV = nCoins.textContent;
    const nCoinsV2 = nCoinsV.replace(' ', '');
    const nCoinsV3 = nCoinsV2.replace(' ', '');

    if(document.getElementById("purchaseBtn2").innerHTML === 'Owned'){
        DoubleXP = true;
        doublex.innerHTML = '2x XP: On'
    } else {
        DoubleXP = false;
        doublex.innerHTML = '2x XP: Off'
    }

    if(document.getElementById("purchaseBtn3").innerHTML === 'Owned'){
        DoubleCoin = true;
        doublec.innerHTML = '1.5x Coin: On'
    } else {
        DoubleCoin = false;
        doublec.innerHTML = '1.5x Coin: Off'
    }

}
setInterval(updateProgress, 1000);
function updatecells() {
    const cellsS = cellsV.textContent;
    cells.innerHTML = 'Cells: ' + cellsS + '/64';
} setInterval(updatecells, 20);
}
containerInfo()
//Keybinds Box
function keybinds() {
    var keybinds = document.createElement("div");
    keybinds.style.width="200px";keybinds.style.height="180px";keybinds.style.border="2px solid white";
    keybinds.style.zIndex="50";keybinds.style.position="absolute"; keybinds.style.padding="8px";
    keybinds.style.marginTop="40%";keybinds.style.borderRadius="7px";keybinds.style.color="white";
    keybinds.setAttribute("id", "keybinds");
    keybinds.style.left="89%";



    var split = document.createElement("div");
    var msplit = document.createElement("div");
    var fsplit = document.createElement("div");
    var respawn = document.createElement("div");
    var feed = document.createElement("div");
    var freeze = document.createElement("div");
    var fdrop = document.createElement("div");
    var mlock = document.createElement("div");
// update keybinds
    function updateKeybinds() {
    const Ksplit = document.getElementById("split").textContent;
    const Kmsplit = document.getElementById("msplit").textContent;
    const Kfsplit = document.getElementById("fsplit").textContent;
    const Krespawn = document.getElementById("respawn").textContent;
    const Kfeed = document.getElementById("feed").textContent;
    const Kfreeze = document.getElementById("freeze").textContent;
    const Kfdrop = document.getElementById("sdrop").textContent;
    const Kmlock = document.getElementById("mouselock").textContent;

    split.innerHTML = "Split: " + Ksplit;
    msplit.innerHTML = "Macro Split: " + Kmsplit;
    fsplit.innerHTML = "Fast Split: " + Kfsplit;
    respawn.innerHTML = "Respawn: " + Krespawn;
    feed.innerHTML = "Feed: " + Kfeed;
    freeze.innerHTML = "Freeze: " + Kfreeze;
    fdrop.innerHTML = "Fast Drop: " + Kfdrop;
    mlock.innerHTML = "Mouse Lock: " + Kmlock;
    }
    setInterval(updateKeybinds, 2000);
    keybinds.appendChild(split);
    keybinds.appendChild(msplit);
    keybinds.appendChild(fsplit);
    keybinds.appendChild(respawn);
    keybinds.appendChild(feed);
    keybinds.appendChild(freeze);
    keybinds.appendChild(fdrop);
    keybinds.appendChild(mlock);
    var body = document.querySelector("body");
    body.appendChild(keybinds);

}
keybinds()
// Buttons (Chat & Keybinds) -> Turn off / on
function btns() {
    var body = document.querySelector("body");
    var btnbox = document.createElement("div");
    btnbox.style.zIndex="50"; btnbox.style.border="2px solid white"; btnbox.style.borderRadius="7px"; btnbox.style.position="absolute";
    btnbox.style.marginTop="30%"; btnbox.style.width="236px"; btnbox.style.height="55px";
    btnbox.style.boxShadow="inset 2px 0px 3px white"
    var chatBtn = document.createElement("button");

    chatBtn.innerHTML = "Chat";
    chatBtn.style.color="white"; chatBtn.style.background="none"; chatBtn.style.zIndex="50"; 
    let clickCount = 0;
    var chat = document.getElementById("chat-container");
    chatBtn.addEventListener('click', function() {
  if (clickCount === 0) {
    chat.style.display="none";
    clickCount++;
  } else {
    chat.style.display="block";
    clickCount--;
  }

});
    var keybindsBtn = document.createElement("button");
    keybindsBtn.style.color="white"; keybindsBtn.style.background="none"; keybindsBtn.style.zIndex="50"; keybindsBtn.style.marginTop="0%";keybindsBtn.style.borderTopRightRadius="7px"; keybindsBtn.style.width="73.5px";
    keybindsBtn.innerHTML = "Keybinds";
    let clickCountK = 0;
    var keybinds = document.getElementById("keybinds");
    keybindsBtn.addEventListener('click', function() {
  if (clickCountK === 0) {
    keybinds.style.display="none";
    clickCountK++;
  } else {
    keybinds.style.display="block";
    clickCountK--;
  }

});
    var informationBtn = document.createElement("button");
       informationBtn.style.color="white"; informationBtn.style.background="none"; informationBtn.style.zIndex="50"; informationBtn.style.marginTop="0%";
       informationBtn.innerHTML = "Info";
      let clickCountI = 0;
    var information = document.getElementById("infor");
    informationBtn.addEventListener('click', function() {
  if (clickCountI === 0) {
    information.style.display="none";
    clickCountI++;
  } else {
    information.style.display="block";
    clickCountI--;
  }
});

    var wearableBtn = document.createElement("button");
       wearableBtn.style.color="white"; wearableBtn.style.background="none"; wearableBtn.style.zIndex="50"; wearableBtn.style.marginTop="0%";
       wearableBtn.innerHTML = "Wearable";
    let clickCountW = 0;
    var wearables = document.getElementById("wearable");
    wearableBtn.addEventListener('click', function() {
  if (clickCountW === 0) {
    wearables.style.display="none";
    clickCountW++;
  } else {
    wearables.style.display="block";
    clickCountW--;
  }
});
    var br = document.createElement("br");
    var br2 = document.createElement("br");

    var $ = window.$;
    var levelBtn = document.createElement("button");
       levelBtn.style.color="white"; levelBtn.style.background="none"; levelBtn.style.zIndex="50"; levelBtn.style.marginTop="0%"; levelBtn.style.width="62px"; levelBtn.style.borderBottomRightRadius="7px";
       levelBtn.innerHTML = "Level";
    var coinsBtn = document.createElement("button");
       coinsBtn.style.color="white"; coinsBtn.style.background="none"; coinsBtn.style.zIndex="50"; coinsBtn.style.marginTop="0%";
       coinsBtn.innerHTML = "Coins";
    var rankBtn = document.createElement("button");
      rankBtn.style.color="white"; rankBtn.style.background="none"; rankBtn.style.zIndex="50"; rankBtn.style.marginTop="0%";
      rankBtn.innerHTML = "Rank";



    var chatbox = document.getElementById("chat_textbox");
    levelBtn.addEventListener('click', function() {
    chatbox.value = '/level';
        $("#canvas").trigger($.Event("keydown", { keyCode: 13}));
         $("#canvas").trigger($.Event("keydown", { keyCode: 13}));
    });
    coinsBtn.addEventListener('click', function() {
    chatbox.value = '/coins';
        $("#canvas").trigger($.Event("keydown", { keyCode: 13}));
         $("#canvas").trigger($.Event("keydown", { keyCode: 13}));
    });
    rankBtn.addEventListener('click', function() {
    chatbox.value = '/rank';
        $("#canvas").trigger($.Event("keydown", { keyCode: 13}));
         $("#canvas").trigger($.Event("keydown", { keyCode: 13}));

    });
    var xpleft = document.createElement("button");
      xpleft.style.color="white"; xpleft.style.background="none"; xpleft.style.zIndex="50"; xpleft.style.marginTop="0%"; xpleft.style.width="75px";
      xpleft.innerHTML = "XP Left";
     xpleft.addEventListener('click', function() {
        var xpl = document.getElementById("xp-bar");
    const xpl2 = xpl.textContent;
    const lxpWo = xpl2.replace(' %', '');
    const currentlxp = (100 - lxpWo).toFixed(2);
        chatbox.value = 'XP Left: ' + currentlxp + '%';
        $("#canvas").trigger($.Event("keydown", { keyCode: 13}));
         $("#canvas").trigger($.Event("keydown", { keyCode: 13}));

     });

    btnbox.appendChild(chatBtn);
    btnbox.appendChild(informationBtn);
    btnbox.appendChild(keybindsBtn);
    btnbox.appendChild(wearableBtn);
    btnbox.appendChild(br2);
    btnbox.appendChild(coinsBtn);
    btnbox.appendChild(rankBtn);
    btnbox.appendChild(levelBtn);
    btnbox.appendChild(xpleft);
    body.appendChild(btnbox);

}
btns()


