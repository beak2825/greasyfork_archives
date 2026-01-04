// ==UserScript==
// @name        HaremHeroes
// @namespace   HaHeroes
// @description Bot
// @include     https://*.haremheroes.*/*
// @include     http://*.haremheroes.*/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30734/HaremHeroes.user.js
// @updateURL https://update.greasyfork.org/scripts/30734/HaremHeroes.meta.js
// ==/UserScript==

var uri = document.documentURI;
var x;
console.log(uri);
if (uri.includes("harem")) {
    console.log("Harem Page");
    window.onload = function(){
      collectHarem();
    }
      setInterval(collectHarem, 30 * 1000);
}
else if (uri.includes("missions")){
    console.log("Mission Page");
  window.onload = function(){
    doMissions();
    setInterval(doMissions, 60* 1000);
  }
}
else if (uri.includes("shop")){
    window.onload = function(){
      console.log("You are in the shop page");
      cleanArmory();
      document.getElementById("type_item").getElementsByTagName("DIV")[1].click();
      cleanBooster();
      document.getElementById("type_item").getElementsByTagName("DIV")[0].click();
    }
}
else if (uri.includes("battle")) {
    console.log("Battle Page");
    window.onload = function(){
       document.getElementsByClassName("green_text_button")[0].click();
    }
    setInterval(checkBattleOver, 5 * 1000);
}
else if (uri.includes("world")) {
    console.log("world page");
    window.onload = function(){
       startBossFight();
       setInterval(startBossFight, 30 * 1000);
    }
}
else if (uri.includes("arena")) {
    console.log("arena page");
    x = document.getElementsByClassName("opponents_ego");
    var ego = [];
    window.onload = function(){
        for(i = 0; i < x.length; i++){
            ego[i] = parseInt(x[i].innerHTML.replace(/[^0-9\.]/g, ""), 10);
        }
        var index = 0;
        var value = ego[0];
        for(j = 1; j < ego.length; j++) {
            if (ego[j] < value) {
                value = ego[j];
                index = j;
            }
        }
        var energy = document.getElementsByClassName("energy_counter")[1].getElementsByTagName("span")[0].innerHTML;
        var energyInt = parseInt(energy.replace(/[^0-9\.]/g, ""), 10);
        
        //Console Logging
        console.log("Min HP Index");
        console.log(index);
        console.log("Min HP");
        console.log(value);
        console.log("Energy");
        console.log(energyInt);
        setInterval(function() {
            console.log("check");
            var energy = document.getElementsByClassName("energy_counter")[1].getElementsByTagName("span")[0].innerHTML;
            var energyInt = parseInt(energy.replace(/[^0-9\.]/g, ""), 10);
        if (energyInt > 0) {
           document.getElementsByClassName("grey_text_button")[index].click();
       }
        }, 30 * 1000);
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadHud() {
    var btn = document.createElement("BUTTON");
    btn.appendChild(document.createTextNode("Sell"));
    btn.setAttribute("style", "float: left; position: fixed; z-index: 999; margin: 0,0,100,200;");
    document.body.getElementsByTagName("header")[0].appendChild(btn);
}

function startBossFight(){
  var energy = document.getElementsByClassName("energy_counter")[1].getElementsByTagName("span")[0].innerHTML;
  var energyInt = parseInt(energy.replace(/[^0-9\.]/g, ""), 10);
  if (energyInt > 1) {
    document.getElementsByClassName("troll_world")[2].click();
  }
}

async function cleanArmory() {
    //Sells duplicates and commons
    //Saves at least 1 of each rare
  var beforeMoney = parseInt(document.getElementsByClassName("currency")[0].firstChild.innerHTML.replace(/[^0-9\.]/g, ""));
  var soldItems = 0;
  var stackSize;
    var x = document.getElementById("inventory").getElementsByClassName("armor")[0].getElementsByClassName("slot");
    var length = x.length - document.getElementById("inventory").getElementsByClassName("armor")[0].getElementsByClassName("slot empty").length;
    console.log("Amount equipment items: " + length);

    for(i = 0; i < length; i++) {
        var selected = document.getElementById("inventory").getElementsByClassName("armor")[0].getElementsByClassName("slot")[i];
        selected.click(); //Selecting the item
        var classes = selected.classList;
        
        await sleep(600);
        if(classes.contains("common")) {
            console.log("Found common items selling...");
            stackSize = parseInt(selected.getElementsByClassName("stack_num")[0].getElementsByTagName("SPAN")[0].innerHTML);
            console.log(stackSize);
            for (j = 0; j < stackSize; j++) {
               selected.click();
               document.getElementById("inventory").getElementsByClassName("green_text_button")[0].click();
              soldItems++;
               await sleep(500);
            }
          i--;
        }
        else if(classes.contains("rare")) {
            stackSize = parseInt(selected.getElementsByClassName("stack_num")[0].getElementsByTagName("SPAN")[0].innerHTML);
            if(stackSize > 1) {
                console.log("Found duplicates of rare items selling...");
                selected.click();//Selecting the item
              for(j = 1; j < stackSize; j++){
                document.getElementById("inventory").getElementsByClassName("green_text_button")[0].click();
                soldItems++;
                await sleep(500);
              }
              i--;
            }
        }
    }
  var afterMoney = parseInt(document.getElementsByClassName("currency")[0].firstChild.innerHTML.replace(/[^0-9\.]/g, ""));
  console.log("Sold "+soldItems+" items for " + (afterMoney - beforeMoney) + "!");
}

async function cleanBooster(){
    //Sells everything in the Booster Section
  var x, selected;
  var stackSize = 0;
    x = document.getElementById("inventory").getElementsByClassName("booster")[0].getElementsByClassName("slot");
    length = x.length - document.getElementById("inventory").getElementsByClassName("booster")[0].getElementsByClassName("slot empty").length;
    console.log("Amount booster items: " + length);
    
    for(i = 0; i < length; i++) {
        await sleep(1000);
        selected = document.getElementById("inventory").getElementsByClassName("booster")[0].getElementsByClassName("slot")[i];
        selected.click(); //Selecting the item
        console.log("Found items..");
        stackSize += parseInt(selected.getElementsByClassName("stack_num")[0].getElementsByTagName("SPAN")[0].innerHTML);
    }
    console.log("Total stackSize: " + stackSize);
    for(j = 0; j < stackSize; j++) {
        document.getElementById("inventory").getElementsByClassName("booster")[0].getElementsByClassName("slot")[0].click();
      //ERROR wont sell items
        document.getElementById("inventory").getElementsByClassName("green_text_button")[0].click();
      await sleep(1000);
    }
}

async function doMissions(){
  var collect, collectIndex, startMission, numberOfMissions;
    x = document.getElementsByClassName("mission_object");
    numberOfMissions = x.length;
    console.log("Number of Missions: " + numberOfMissions);
    
    //Collect
    for(i = 0; i < numberOfMissions; i++){
      if(x[i].getElementsByClassName("purple_text_button")[0].style.display !== "none"){
        collect = true;
        collectIndex = i;
        break;
      }else {
        collect = false;
      }
    }

    if(collect){
      console.log("Collecting..");
      document.getElementsByClassName("mission_object")[collectIndex].getElementsByClassName("purple_text_button")[0].click();
      await sleep(1000);
      if(document.getElementById("missions_rewards").style.display == "block"){
        document.getElementById("missions_rewards").children[2].click();
      }
      await sleep(2000);
      if(document.getElementsByClassName("end_gift")[0].style.display == "block"){
        document.getElementsByClassName("end_gift")[0].getElementsByTagName("BUTTON")[0].click();
      }
    }
   
  await sleep(1000);
  x = document.getElementsByClassName("mission_object");
  numberOfMissions = x.length;
  console.log("Number of missions after collection was made: " + numberOfMissions);

    //StartMission
    for(i = 0; i < numberOfMissions; i++){
      //Is disabled and visible
      if(x[i].getElementsByClassName("blue_text_button")[0].disabled && (x.getElementsByClassName("blue_text_button")[0].style.display !== "none")){
        startMission = false;
        break;
      } else {
        startMission = true;
        break;
      }
    }

    console.log("Collect: " + collect + "\nCollectIndex: " + collectIndex);
    console.log("Start Mission: " + startMission);
  
    if(startMission){
      x[0].getElementsByClassName("blue_text_button")[0].click();
    }
}

function getCurrentWorld(){
  var str = uri;
  var n = str.lastIndexOf('=');
  var result = parseInt(str.substring(n+1)) + 1;
  return result;
}

async function checkBattleOver(){
  if (document.getElementById("battle_end").style.display == "block"){
    if (uri.includes("id_troll")) {
      var str = uri;
      var n = str.lastIndexOf('=');
      var result = parseInt(str.substring(n+1)) + 1;
      location.href = "https://www.nutaku.haremheroes.com/world/" + result;
    }else {
      location.href = "https://www.nutaku.haremheroes.com/arena.html";
    }
  }
}

async function collectHarem(){
  console.clear();
  x = document.getElementsByClassName("blue_text_button");
  console.log("Found "+(document.getElementsByClassName("girls_list")[0].childElementCount-2)+" girls");
  for (i = 0; i < (document.getElementsByClassName("girls_list")[0].childElementCount - 2); i++){
    await sleep(100);
    x[i].click();
    var girlName = document.getElementsByClassName("girls_list")[0].getElementsByTagName("H4")[i].innerHTML;
    console.log("Collecting from "+ girlName +"..");
  }
  await sleep(60000)
  location.href = "https://www.nutaku.haremheroes.com/harem.html";
}
