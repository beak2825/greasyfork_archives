// ==UserScript==
// @name     Goatlings Accessibility Mod
// @namespace goatlings.accessibility
// @description Accessibility features for Goatlings
// @version  1.2.1
// @grant    none
// @match https://www.goatlings.com/*
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/411537/Goatlings%20Accessibility%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/411537/Goatlings%20Accessibility%20Mod.meta.js
// ==/UserScript==

let page = document.location.href;
let modsActive = false;
let mode = "";

// each one of these conditions should have three parts:
// 1. assign the current mode
// 2. make mods active
// 3. style page to fit mode
if (page.includes("battle")) {
  mode = "battle";
  modsActive = true;

  if (page === "https://www.goatlings.com/battle"){
    findText("Battle Center").innerHTML += " (1)";
    findText("Training Center").innerHTML += " (2)";
    findText("Your Battle").innerHTML += " (3)";
    findText("Your Goatlings").innerHTML += " (4)"
  } else if (page === "https://www.goatlings.com/battle/challengers" || page === "https://www.goatlings.com/battle/train_challengers") {
    let battleButtons = document.querySelectorAll('input[type="submit" i]');
    for (i = 1; i < battleButtons.length; i++) {
        battleButtons[i].value = battleButtons[i].value + ` (${i})`
    }
  } else if (page === "https://www.goatlings.com/battle/thebattle") {
    window.battleItems = document.querySelectorAll(".itema");
    document.getElementsByName("s")[1].value = "Press Spacebar to " + document.getElementsByName("s")[1].value
    for (i = 0; i < window.battleItems.length; i++) {
      window.battleItems[i].innerHTML += `<br> ${i+1}`;
    }
    let endLink = findText("+THE BATTLE IS OVER! CLICK HERE TO FINALIZE AND CLAIM REWARDS!+");
    if (endLink) {
      endLink.innerHTML += "<br>PRESS SPACE TO CONTINUE";
    }
  } else if (page === "https://www.goatlings.com/battle/over") {
    findText("Battle Center").innerHTML += " (1)";
    findText("Training Center").innerHTML += " (2)";
    findText("Current Explore Adventure").innerHTML += " (3)";
    findText("Your Inventory").innerHTML += " (4)";
    findText("Your Goatlings").innerHTML += " (5)";
    if (document.querySelectorAll('input[type="submit" i]')[1]) {
      document.querySelectorAll('input[type="submit" i]')[1].value = "Press Spacebar to Battle Again";
    }
  } else if (page === "https://www.goatlings.com/battle/create_temp") {
    findText("inventory").textContent += " (Press Spacebar)";
  }
} else if (page.includes("explore")) { 
  modsActive = true;

  if (page.includes("view")){
    mode = "explore";
  
    if (findText("Start Battle")) {
      findText("Start Battle").textContent += " (1)"
      findText("Run Away").textContent += " (2)"
    } else {
      document.body.innerHTML = document.body.innerHTML.replace('map anywhere', 'map anywhere <b>or press spacebar</b>');
    }
  } else {
    mode = "explore_index"

    // none of these variables work properly here,
    // but making them properties of the window fixes it
    // idk but it works like this, so don't change it unless you know what you're doing
    // and you probably don't
    window.eAreas = document.querySelectorAll("center > div");
    
    window.eAreasArray = Array.prototype.slice.call(window.eAreas);

    window.x1 = window.eAreasArray.slice(0, 5);
    window.x2 = window.eAreasArray.slice(5, 10);
    window.x3 = window.eAreasArray.slice(10, 15);
    window.x4 = window.eAreasArray.slice(15, 20);
    window.x5 = window.eAreasArray.slice(20, 25);
    window.x6 = window.eAreasArray.slice(25, 30);

    window.y = [window.x1, window.x2, window.x3, window.x4, window.x5, window.x6]


    window.yPos = 0;
    window.xPos = 0;

    window.currentOption = y[window.yPos][window.xPos];

    window.currentOption.style.border = "5px red solid";
  }
} else if (page.includes("hol")) {
  mode = "hol";
  modsActive = true;

  if (page === "https://www.goatlings.com/hol") {
    document.getElementsByName("s")[1].value = "Press Spacebar to Play";
  } else if (page === "https://www.goatlings.com/hol/view") {
    document.getElementsByName("high")[0].value += " (1)";
    document.getElementsByName("low")[0].value += " (2)";
  } else if (page === "https://www.goatlings.com/hol/go") {
    let battleButtons = document.getElementsByName("s");
    for (i = 1; i < battleButtons.length; i++) {
      battleButtons[i].value = battleButtons[i].value + ` (${i})`
    }
  }
} else if (page.includes("rps")) {
  mode = "rps";
  modsActive = true;

  if (page == "https://www.goatlings.com/rps") {
    document.body.innerHTML = document.body.innerHTML.replace("https://www.goatlings.com/images/games/rps/Butterfly.jpg", "https://cdn.discordapp.com/attachments/500206268909223936/756708475211350166/Butterfly1.jpg");
    document.body.innerHTML = document.body.innerHTML.replace("https://www.goatlings.com/images/games/rps/Flower.jpg", "https://cdn.discordapp.com/attachments/500206268909223936/756708480139657246/Flower2.jpg");
    document.body.innerHTML = document.body.innerHTML.replace("https://www.goatlings.com/images/games/rps/Net.jpg", "https://cdn.discordapp.com/attachments/500206268909223936/756708483243704371/Net3.jpg");
  } else if (page.includes("play")) {
    findText("Play Again?").textContent = "Press Spacebar to play again!";
  }
}

// find element that contains passed text, stored in variable toFind
function findText(toFind) {
  let xpath = `//a[text()='${toFind}']`;
  let matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

  return matchingElement;
}

function battle_function(key) {
  if (page === "https://www.goatlings.com/battle") {
    // If on the main battle page
    if (key == 1) {
      findText("Battle Center (1)").click();
    } else if (key == 2) {
      findText("Training Center (2)").click();
    } else if (key == 3) {
      findText("Your Battle (3)").click();
    } else if (key == 4) {
      findText("Your Pets (4)").click();
    }
  } else if (page === "https://www.goatlings.com/battle/challengers" || page === "https://www.goatlings.com/battle/train_challengers") {
    // If on the battle center or training center pages
    let battleButtons = document.querySelectorAll('input[type="submit" i]');
    // using key without subtracting one because the first value of the list is the search button on the sidebar
    // using the regular number skips it
    battleButtons[key].click();
  } else if (page === "https://www.goatlings.com/battle/thebattle") {
    // If in the actual battle

    if (key === ' ' || key === 'Spacebar'){
      let endLink = findText("+THE BATTLE IS OVER! CLICK HERE TO FINALIZE AND CLAIM REWARDS!+");
      if (endLink) {
        endLink.click();
      } else {
        endLink = document.getElementsByName("s")[1];
        endLink.click();
      }
    } else if (key < 10) {
      window.battleItems[key - 1].childNodes[0].click();
    }
  } else if (page === "https://www.goatlings.com/battle/over") {
    // If on the main battle page OR battle over page
    if (key == 1) {
      findText("Battle Center (1)").click();
    } else if (key == 2) {
      findText("Training Center (2)").click();
    } else if (key == 3) {
      findText("Current Explore Adventure (3)").click();
    } else if (key == 4) {
      findText("Your Inventory (4)").click();
    } else if (key == 5) {
      findText("Your Goatlings (5)").click();
    } else if (key === ' ' || key === "Spacebar") {
      document.querySelectorAll('input[type="submit" i]')[1].click();
    }
  } else if (page.includes("https://www.goatlings.com/battle/attack")){
    if (key === ' ' || key === 'Spacebar'){
      let returnLink = findText("Click here to go back");
      returnLink.click();
    }
  } else if (page === "https://www.goatlings.com/battle/create_temp") {
    if (key === ' ' || key === 'Spacebar'){
      findText("inventory (Press Spacebar)").click()
    }
  }
}

function explore_function(key) {
  if (page.includes("view")) {
    if (key === ' ' || key === 'Spacebar'){
      let exploreWindow = document.querySelector("#content > center > a");
      exploreWindow.click();
    } else if (key == 1) {
      let yesBattle = findText("Start Battle (1)")
      yesBattle.click()
    } else if (key == 2) {
      let noBattle = findText("Run Away (2)")
      noBattle.click()
    }
  }
}

function explore_index_function(key) {
  if (key == "ArrowUp") {
    if (window.yPos > 0) {
      window.yPos -= 1;
    }
  } else if (key == "ArrowDown") {
    if (window.yPos < 5) {
      window.yPos += 1;
    }
  } else if (key == "ArrowLeft") {
    if (window.xPos > 0) {
      window.xPos -= 1;
    }
  } else if (key == "ArrowRight") {
    if (window.xPos < 4) {
      window.xPos += 1;
    }
  }
  window.currentOption.style.border = "";
  window.currentOption = y[window.yPos][window.xPos];
  window.currentOption.style.border = "5px red solid";

  if (key === ' ' || key === 'Spacebar'){
    window.currentOption.childNodes[0].click();
  }
}

function hol_function(key) {
  if (page === "https://www.goatlings.com/hol") {
    if (key === ' ' || key === 'Spacebar'){
      // "Play" button is given name "s"
      document.getElementsByName("s")[1].click();
    }
  } else if (page === "https://www.goatlings.com/hol/view") {
    if (key == 1){
      document.getElementsByName("high")[0].click();
    } else if (key == 2) {
      document.getElementsByName("low")[0].click();
    }
  } else if (page === "https://www.goatlings.com/hol/go") {
    if (key == 1 || key == 2){
      // "Play Again" and "Collect Pot" buttons are named "s"
      // buttons are contained in separate forms
      document.getElementsByName("s")[key].click();
    }
  }
}

function rps_function(key) {
  if (page.includes("play") && (key === ' ' || key === 'Spacebar')) {
    findText("Press Spacebar to play again!").click();
  } else if (page == "https://www.goatlings.com/rps") {
    let butterfly = Array.prototype.slice.call(document.querySelectorAll("a[href='https://www.goatlings.com/rps/play/2']"))[0];
    let flower = Array.prototype.slice.call(document.querySelectorAll("a[href='https://www.goatlings.com/rps/play/3']"))[0];
    let net = Array.prototype.slice.call(document.querySelectorAll("a[href='https://www.goatlings.com/rps/play/1']"))[0];

    let rps_array = [butterfly, flower, net];

    if (key > 0 && key < 4) {
      rps_array[key - 1].click();
    } 
  }
}

function kPress(e) {
  switch (mode) {
    case "battle":
      battle_function(e.key);
    case "explore":
      explore_function(e.key);
    case "explore_index":
      explore_index_function(e.key);
    case "hol":
      hol_function(e.key);
    case "rps":
      rps_function(e.key);
  }
}

if (modsActive == true) {
  // creates the HUD element letting user know that shortcuts are active
  var hud = document.createElement("span");
  hud.innerHTML = "Shortcuts Active";
  hud.style = "top:10;left:10;position:absolute;z-index: 9999;color:white;font-weight:bold;background:green;border:5px green solid;font-size:16px"
  document.body.appendChild(hud);

  // adds key event listener
  window.addEventListener('keydown', kPress);
}
