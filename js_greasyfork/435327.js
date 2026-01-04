// ==UserScript==
// @name         Better and more bars.
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  This script changes a lot about bars in your game, Adds percentage, color changing, smooth transitions, new bars Etc.
// @author       Diamond king x
// @match        http://zombs.io/
// @icon         https://www.google.com/s2/favicons?domain=zombs.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435327/Better%20and%20more%20bars.user.js
// @updateURL https://update.greasyfork.org/scripts/435327/Better%20and%20more%20bars.meta.js
// ==/UserScript==
 
var newcss = `
#newp{
color: white;
position: absolute;
font-weight: bold;
top: -20%;
left: 45%;
}
.background-bar{
width: 0%;
height: 100%;
transition: all 0.8s;
position: relative;
background-color: green;
border-radius: 6px;
z-index: -1;
bottom: 100%;
max-width: 100%;
min-width: 0%;
}
#healthanime{
animation: healthanime 0.5s ease-in-out infinite;
}
@keyframes healthanime{
 0%{
            opacity: 0.0;
         };
         5%{
           opacity: 0.1;
         };
         10%{
             opacity:  0.2;
         };
         15%{
            opacity: 0.3;
         };
         20%{
             opacity: 0.4;
         };
         25%{
             opacity: 0.5;
         };
         30%{
             opacity: 0.6;
         };
         35%{
             opacity: 0.7;
         };
         40%{
             opacity: 0.8;
         };
         45%{
             opacity: 0.9;
         };
         50%{
             opacity: 1.0;
         };
         55%{
             opacity: 0.9;
         };
         60%{
             opacity: 0.8;
         };
         65%{
             opacity: 0.7;
         };
         70%{
             opacity: 0.6;
         };
        75%{
             opacity: 0.5;
         };
         80%{
             opacity: 0.4;
         };
         85%{
             opacity: 0.3;
         };
         90%{
             opacity: 0.2;
         };
         95%{
             opacity: 0.1;
         };
         100%{
             opacity: 0.0;
         };
}
#healthanime2{
animation: healthanime 0.5s ease-in-out infinite;
}
#playerhb{
width: 70px;
height: 12px;
background-color: #2C3E50;
position: relative;
border-radius: 4px;
top: 56.8%;
left: 47.6%;
font-family:'Hammersmith One', sans-serif;
max-width: 70px;
min-width: 0px;
min-height: 0px;
max-height: 12px;
transition: all 0.4s;
}
.playersb{
 width: 70px;
height: 12px;
background-color: #2C3E50;
position: relative;
border-radius: 4px;
top: 56.8%;
left: 47.6%;
font-family:'Hammersmith One', sans-serif;
max-width: 70px;
min-width: 0px;
min-height: 0px;
max-height: 12px;
transition: all 0.4s;
transform: scale(0);
}
.playersbinner{
width: 100%;
height: 100%;
position:absolute;
font-family:'Hammersmith One', sans-serif;
border-radius: 4px;
background-color: #3498DB;
transition: all 0.2s;
z-index: 2;
max-width: 100%;
min-width:0%;
}
.playersbback{
background-color: #85C1E9;
width:0%;
height:100%;
position: absolute;
transition: all 0.6s;
z-index: 1;
border-radius: 20px;
max-width: 100%;
min-width: 0%;
}
.psbp{
font-size: 9px;
font-weight: bold;
position: absolute;
left: 29%;
top: -130%;
color: white;
z-index: 2;
}
#phbinner{
width: 0%;
height:100%;
position:absolute;
font-family:'Hammersmith One', sans-serif;
border-radius: 4px;
background-color: #2ECC71;
transition: all 0.2s;
z-index: 2;
max-width: 100%;
min-width:0%;
}
#newp2{
color: white;
font-weight: bold;
font-size: 9px;
position: absolute;
left: 53%;
top: -60%;
transform: translate(-50%,-50%);
z-index: 3;
}
#phbiback{
background-color: #82E0AA;
width:0%;
height:100%;
position: absolute;
transition: all 0.6s;
z-index: 1;
border-radius: 20px;
max-width: 100%;
min-width: 0%;
}
.phbinneranime{
animation: healthanime 0.5s ease-in-out infinite;
}
.phbibackanime{
animation: healthanime 0.5s ease-in-out infinite;
}
#pethp{
background-color: rgba(0, 0, 0, 0.4);
height: 35px;
top: 255px;
border: 4px solid rgba(0, 0, 0, 0.1);
font-family: 'Hammersmith One' , sans-serif;
border-radius: 4px;
position: relative;
padding: 5;
z-index: 10;
margin: none;
transition: all 0.3s;
transform: scale(0.0);
}
#petp {
font-family: 'Hammersmith One' , sans-serif;
position: absolute;
transform: translate(-50%, -50%);
top: -35%;
left: 58%;
bottom: 0%;
color: white;
font-weight: bold;
z-index: 2;
}
#pethpin {
background-color: #F39C12;
position: relative;
height: 100%;
font-family: 'Hammersmith One' , sans-serif;
border-radius: 4px;
transition: all 0.4s;
}
#pethp:after{
    display: block;
    content: 'PET HEALTH';
    position: absolute;
    top: 1px;
    left: 5px;
    bottom: 0px;
    line-height: 27px;
    font-size: 14px;
    color: #eee;
    text-shadow: 0 0 1px rgb(0 0 0 / 80%);
}
.expDiv{
    width: 18px;
    height: 166px;
    background-color: rgba(0,0,0,0.4);
    position: absolute;
    top: 700.4%;
    left: 98.6%;
    border: 4px solid rgba(0,0,0,0.1);
    border-radius: 3px;
    z-index: 10;
    transition: left 0.4s, transform 0.8s,top 0.4s, height 0.4s;
}
.innerExpDiv{
    width: 100%;
    height: 100%;
    background-color: #F1C40F;
    position: absolute;
    bottom: 0%;
    border-radius: 3px;
    transition: all 0.4s;
}
.petLevel{
    position: absolute;
    top: -25.2%;
    left: 50%;
    transform: translateX(-50%);
    color: #F1C40F;
    font-size: 14px;
    z-index: 10;
    text-shadow: 0px 0px 20px #F1C40F;
    font-weight: bold;
    width: 20px;
    height: 20px;
    background-color: rgba(0,0,0,0.4);
    border-radius: 50%;
    text-align: center;
    transition: all 0.4s;
}
 
.bossHealthInPercent {
    position: absolute;
    top: -43%;
    left: 85.5%;
    font-family: 'Hammersmith One';
    font-size: 14px;
    font-weight: bold;
    color: white;
}
.bossHealthInNumbers {
    position: absolute;
    top: -43%;
    left: 2%;
    font-family: 'Hammersmith One';
    font-size: 14px;
    font-weight: bold;
    color: white;
 }
 .bossimagecircle {
    width: 50px;
    height: 50px;
    border: 3px dashed #ad0727;
    border-radius: 50%;
    transition: all 0.3s;
    background: rgba(0,0,0,0.8);
    position: absolute;
    top: 50%;
    left: -10.9%;
    transform: translateY(-50%) rotateZ(0deg);
    z-index: 10;
    animation: spinBorder 1s linear infinite;
}
@keyframes spinBorder {
    100% {
    transform: translateY(-50%) rotateZ(360deg)};
}
@keyframes spinOpposite {
    100% {
    transform: rotateZ(-360deg);
}
  }
.bossTier {
   position: absolute;
    font-size: 14px;
    color: white;
    font-family: 'Hammersmith One';
    font-weight: bold;
    top: -143%;
    left: 2.5%;
}
`;
(function () {
    var healthbar = document.getElementsByClassName('hud-health-bar-inner')[0],
        hud = document.getElementsByClassName('hud')[0],
        healthvarout = document.getElementsByClassName('hud-health-bar')[0],
        backgroundbar = document.createElement('div'),
        playerhb = document.createElement('div'),
        phbinner = document.createElement('div'),
        phbiback = document.createElement('div'),
        p = document.createElement('p'),
        p2 = document.createElement('p'),
        bottomhud = document.getElementsByClassName("hud-bottom-right")[0],
        pethpbar = document.createElement("div"),
        pethpbarinner = document.createElement("div"),
        pethpp = document.createElement("p"),
        playersb = document.createElement("div"),
        playersbback = document.getElementsByClassName("playersbback")[0],
        shield = document.getElementsByClassName("hud-shield-bar")[0];
    window.expDiv = document.createElement("div");
    window.expDivInner = document.createElement("div");
    window.petLevelp = document.createElement("p");
    expDiv.append(petLevelp);
    petLevelp.className = "petLevel";
    expDivInner.className = "innerExpDiv"
    expDiv.className = "expDiv";
    hud.append(expDiv);
    expDiv.append(expDivInner);
    backgroundbar.className = 'background-bar';
    healthbar.id = 'healthbar';
    healthbar.style.maxWidth = '100%';
    healthbar.style.minWidth = '0%';
    healthbar.style.transition = 'all 0.4s';
    p.id = 'newp';
    p2.id = 'newp2';
    healthbar.appendChild(p);
    healthvarout.appendChild(backgroundbar);
    hud.append(playerhb);
    playerhb.id = 'playerhb';
    phbiback.id = 'phbiback';
    playerhb.style.border = '2px solid rgba(0, 0, 0, 0.1)';
    playersb.style.border = '2px solid rgba(0, 0, 0, 0.1)';
    playerhb.appendChild(phbinner);
    phbinner.id = 'phbinner';
    playerhb.appendChild(p2);
    playerhb.appendChild(phbiback);
    pethpbar.style.width = healthbar.style.with;
    pethpbar.id = "pethp";
    pethpp.id = "petp";
    pethpbarinner.id = 'pethpin';
    pethpbar.appendChild(pethpp);
    pethpbar.appendChild(pethpbarinner);
    bottomhud.appendChild(pethpbar);
    function getShield(what) {
        if (game.world.inWorld == true) {
            switch (what) {
                case "Equiped":
                    if (game.world.entities[game.ui.playerTick.uid].currentModel.shieldBar.isVisible == true) {
                        return true
                    }
                    else {
                        return false
                    }
                    break;
                case "Health":
                    return game.ui.playerTick.zombieShieldHealth
                    break;
                case "MaxHealth":
                    return game.ui.playerTick.zombieShieldMaxHealth
                    break;
                case "Tier":
                    if (game.ui.inventory.ZombieShield == undefined) {
                        return 0
                    }
                    else { return game.ui.inventory.ZombieShield.tier }
                    break;
            }
        }
    }
    function getPetHealth() {
        if (game.world.entities[game.ui.playerPetUid] !== undefined) {
            return game.world.entities[game.ui.playerPetUid].targetTick.health;
        }
        else {
            return -1;
        }
 
    }
 
    function getPetXp() {
        if (game.world.entities[game.ui.playerPetUid] !== undefined) {
            return game.world.entities[game.ui.playerPetUid].targetTick.experience;
        }
        else {
            return -1;
        }
 
    }
    setInterval(function () {
        if (game.world.inWorld == true) {
            var phealth = Game.currentGame.world.localPlayer.entity.targetTick.health.toFixed(1);
            var shieldPercent = 100 - (getShield("MaxHealth") - getShield("Health")) / getShield("MaxHealth") * 100;
            document.getElementsByClassName("psbp")[0].innerText = shieldPercent.toFixed(1) + "%";
            document.getElementsByClassName("playersbinner")[0].style.width = shieldPercent.toFixed(1) + "%";
            if (getShield("Equiped") == true) {
                playersb.style.transform = "scale(0,1.0)";
                playersb.style.transform = "scale(1.0,1.0)";
                expDiv.style.height = "188px";
                petLevelp.style.top = "-21.5%";
            }
            else {
                playersb.style.transform = "scale(0.0)";
                expDiv.style.height = "166px";
                petLevelp.style.top = "-25.2%";
            };
            if (game.world.entities[game.ui.playerPetUid] !== undefined) {
 
                expDivInner.style.height = game.world.entities[game.ui.playerPetUid].currentModel.experienceBar.percent * 100 + "%";
                petLevelp.innerText = game.world.entities[game.ui.playerPetUid].currentModel.experienceBar.level;
            }
            window.one = healthbar.style.width.replaceAll('%', '');
            var fixed = phealth / 5;
            p.innerText = fixed.toFixed(1) + '%';
            p2.innerText = fixed.toFixed(1) + '%';
            phbinner.style.width = healthbar.style.width;
            game.world.entities[game.ui.playerTick.uid].currentModel.healthBar.backgroundNode.draw.visible = false;
            game.world.entities[game.ui.playerTick.uid].currentModel.healthBar.barNode.draw.visible = false;
            game.world.entities[game.ui.playerTick.uid].currentModel.shieldBar.barNode.draw.visible = false;
            game.world.entities[game.ui.playerTick.uid].currentModel.shieldBar.backgroundNode.draw.visible = false;
            document.getElementsByClassName("hud-resources")[0].style.transition = 'all 0.3s';
            document.getElementsByClassName("hud-party-icons")[0].style.transition = 'all 0.3s';
            document.getElementsByClassName("hud-party-icons")[0].style.left = '-5px';
            document.getElementsByClassName("hud-health-bar")[0].style.transition = 'all 0.3s';
            shield.style.transition = 'all 0.4s';
            shield.style.transform = "scale(0.0)";
            document.getElementsByClassName("hud-shield-bar-inner")[0].style.transition = "all 0.4s";
            document.getElementsByClassName("hud-shield-bar-inner")[0].style.backgrounColor = "#3498DB";
            if (getShield("Equiped") == true) {
                shield.style.transform = "scale(1.0)";
            }
            else {
                shield.style.transform = "scale(0.0)";
            }
            if (one <= 20) {
                healthbar.style.backgroundColor = '#E74C3C';
                backgroundbar.style.backgroundColor = '#F1948A';
                healthbar.id = 'healthanime';
                backgroundbar.id = 'healthanime2';
                phbinner.className = 'phbinneranime';
                phbiback.className = 'phbibackanime';
                phbinner.style.backgroundColor = '#E74C3C';
                phbiback.style.backgroundColor = '#F1948A';
            }
            else {
                healthbar.id = 'noanime';
                backgroundbar.id = 'noanime';
                phbinner.className = 'noanime';
                phbiback.className = 'noanime';
                if (one <= 50) {
                    healthbar.style.backgroundColor = '#F39C12';
                    backgroundbar.style.backgroundColor = '#F8C471';
                    phbinner.style.backgroundColor = '#F39C12';
                    phbiback.style.backgroundColor = '#F8C471';
 
                }
                else {
                    if (one <= 80) {
                        healthbar.style.backgroundColor = '#F1C40F';
                        backgroundbar.style.backgroundColor = '#F7DC6F';
                        phbinner.style.backgroundColor = '#F1C40F';
                        phbiback.style.backgroundColor = '#F7DC6F';
                    }
                    else {
                        healthbar.style.backgroundColor = '#2ECC71';
                        backgroundbar.style.backgroundColor = '#82E0AA';
                        phbinner.style.backgroundColor = '#2ECC71';
                        phbiback.style.backgroundColor = '#82E0AA';
                    }
                }
            }
        }
    }, 225);
    setInterval(function () {
        backgroundbar.style.width = healthbar.style.width;
        phbiback.style.width = healthbar.style.width;
 
    }, 600);
    setInterval(function () {
        if (healthbar.style.width < '0%') {
            healthbar.style.width = '0%';
        };
    }, 1)
 
 
    setInterval(function () {
        if (window.screenTop && window.screenY) {
            playerhb.style.top = '55.6%';
            playersb.style.top = "55.5%";
            if (getShield("Equiped") == false) {
                expDiv.style.top = "77.5%";
            }
            else {
                expDiv.style.top = "74.4%";
            }
        }
        else {
            playerhb.style.top = '56.8%';
            playersb.style.top = "56.8%";
            if (getShield("Equiped") == false) {
                expDiv.style.top = "73.8%";
            }
            else {
                expDiv.style.top = "70.4%";
            }
        };
 
        var petuid = game.ui.playerPetUid;
        var entries = game.world.entities;
        if (game.world.inWorld == true && petuid !== undefined)
            if (entries[petuid] !== undefined || getPetHealth() > 0) {
                if (entries[petuid] !== undefined) {
                    if (entries[petuid].isInViewport() == true) {
                        if (getShield("Equiped") == false) {
                            document.getElementsByClassName("hud-health-bar")[0].style.bottom = '25px';
                            document.getElementsByClassName("hud-resources")[0].style.bottom = '15px';
                            document.getElementsByClassName("hud-party-icons")[0].style.bottom = '5px';
                            document.getElementsByClassName("hud-shield-bar")[0].style.bottom = '80px';
                            document.getElementsByClassName("hud-shield-bar")[0].style.position = 'absolute';
                        }
                        else {
                            document.getElementsByClassName("hud-health-bar")[0].style.bottom = '25px';
                            document.getElementsByClassName("hud-resources")[0].style.bottom = '35px';
                            document.getElementsByClassName("hud-party-icons")[0].style.bottom = '25px';
                            document.getElementsByClassName("hud-shield-bar")[0].style.bottom = '80px';
                            document.getElementsByClassName("hud-shield-bar")[0].style.position = 'absolute';
                        }
                        pethpbar.style.transform = "scale(1.0)";
                        var pethealth = entries[petuid].targetTick.health;
                        var maxpethealth = entries[petuid].targetTick.maxHealth;
                        var pettickhealth = game.world.entities[petuid].targetTick.health;
                        if (game.ui.playerPetUid !== undefined && pethealth > 0 || getPetHealth() < 0) {
                            var topercent = (maxpethealth - pethealth) / maxpethealth * 100.0,
                                percentage = 100 - topercent,
                                petfixed = percentage.toFixed(1);
                            pethpp.innerText = petfixed + "%";
                            pethpbarinner.style.width = petfixed + "%"
                        };
                    }
                }
            }
            else {
                pethpbar.style.transform = "scale(0.0)";
                if (getShield("Equiped") == false) {
                    document.getElementsByClassName("hud-health-bar")[0].style.bottom = '5px';
                }
                else {
                    document.getElementsByClassName("hud-health-bar")[0].style.bottom = '-5px';
                }
                document.getElementsByClassName("hud-resources")[0].style.bottom = '5px';
                document.getElementsByClassName("hud-party-icons")[0].style.bottom = '0px';
                document.getElementsByClassName("hud-shield-bar")[0].style.bottom = '50px';
                document.getElementsByClassName("hud-shield-bar")[0].style.position = 'absolute';
            }
        if (entries[petuid] !== undefined) {
            if (getPetHealth() > 0) {
                if (getPetXp() > 0) {
                    if (entries[petuid].isInViewport() == true) {
                        if (entries[petuid].targetTick.tier < 8) {
                            expDiv.style.left = "98.6%";
                            expDiv.style.transform = "scale(1)";
                        }
                    }
                }
            }
        }
        else {
            expDiv.style.left = "100.0%";
            expDiv.style.transform = "scale(0)";
        }
    }, 100);
    var styles = document.createElement('style');
    styles.appendChild(document.createTextNode(newcss));
    document.head.appendChild(styles);
    function FixShield() {
        if (game.ui.inventory.ZombieShield !== undefined) {
            if (Game.currentGame.ui.playerTick.zombieShieldHealth < 85000) {
                Game.currentGame.network.sendRpc({ name: "EquipItem", itemName: "ZombieShield", tier: Game.currentGame.ui.inventory.ZombieShield.tier });
            }
        }
    }
    Game.currentGame.network.addRpcHandler("DayCycle", FixShield);
    playersb.className = "playersb";
    hud.appendChild(playersb);
    playersb.innerHTML = `<div class="playersbinner" ></div><p class="psbp" >100.0%</p>`
})();
//BossHealthBar took a long time!
window.bossHealthBarContainer = document.createElement("div");
bossHealthBarContainer.className = "bossHealthBarContainer";
document.getElementsByClassName("hud")[0].append(bossHealthBarContainer);
bossHealthBarContainer.setAttribute("style", `
  width: auto;
  height: auto;
  background-color: rgba(0,0,0,0.4);
  border-radius: 4px;
  position: absolute;
  left: 50%;
  top: 5%;
  transform: translate(-50%,-50%);
  padding: 4px;
  transition: all 0.3s;
  z-index: 9;
`)
window.bossHealthBar = document.createElement("div");
bossHealthBar.className = "bossHealthBar";
bossHealthBarContainer.append(bossHealthBar);
bossHealthBar.setAttribute("style", `
  width: 400px;
  height: 0px;
  position: relative;
  top: 0%;
  left: 0%;
  background-color: rgba(0,0,0,0.4);
  border-radius: 2px;
  transition: all 0.3s;
`);
bossHealthBar.innerHTML = `<div class="bossimagecircle">
<div style="width: 100%; height: 100%; background-color: transparent; background-image: url('https://u.cubeupload.com/diamondkingx/halloweenpumpkin.png'); background-size: 50px 40px; background-position: 50% 90%; background-repeat: no-repeat; transition: all 0.3s; animation: spinOpposite 5s linear infinite; filter: brightness(1.1);" class="bossImage">
</div>
 
</div>
<div style="width: 100%; height: 100%; border-radius: 2px; transition: all 0.4s; background-color: #ad0727;" class="bossHealthBarInner">
  <p class="bossHealthInPercent">100.0%</p> <p class="bossHealthInNumbers">5000000/5000000</p>
  </div>
  <div class="numberOfBosses" style="color: #ad0727; position: absolute; top: -78%; left: -2%; font-family: 'Hammersmith One'; font-weight: bold; font-size: 80%; filter: brightness(1.7); text-align: center; z-index: 1; width: 16px; height: 16px; background-color: rgba(0,0,0,0.8); border-radius: 50%;">1</div>
  <p class="bossTier">TIER 13</p>
  `;
window.bossImage = bossHealthBar.getElementsByClassName("bossImage")[0];
window.bossImageCircle = bossHealthBar.getElementsByClassName("bossimagecircle")[0];
window.numberOfBosses = bossHealthBar.getElementsByClassName("numberOfBosses")[0];
window.displayAllBossHealthBars = function (time) {
    setTimeout(() => {
        let bars = document.getElementsByClassName("bossHealthBar");
        for (var i = 0; i < bars.length; i++) {
            bars[i].style.height = "24px";
        }
    }, time)
};
displayAllBossHealthBars(500);
let spinTime = 5;
window.bossesInfo = [];
function checkIncludes(array, valueTo, property) {
    let checkArray = [];
    let timesMatched = 0;
    array.forEach(info => {
        if (info[property] == valueTo) {
            checkArray.push([info[property], "yes"]);
        }
        else {
            checkArray.push([info[property], "no"]);
        }
    })
    checkArray.forEach(check => {
        if (check[1] == "yes") {
            timesMatched++;
        }
    });
    return timesMatched == 0 && timesMatched > -1 ? false : true
}
window.zombiesActive = () => {
    let getZombies = false;
    for (let i in game.world.entities) {
        if (!game.world.entities[i].fromTick.model.includes("Neutral")) {
            if (game.world.entities[i].fromTick.model.toUpperCase().includes("BOSS")) {
                getZombies = true;
            }
        }
    }
    return getZombies;
};
window.partyMembers = 99999999999999;
var getBoss = setInterval(() => {
    var numberp = document.getElementsByClassName("bossHealthInNumbers")[0];
    var percentp = document.getElementsByClassName("bossHealthInPercent")[0];
    Object.entries(game.world.entities).forEach(entity => {
        var selected = entity[1];
        if (selected.targetTick.model.toUpperCase().includes("BOSS")) {
            bossesInfo.length < 1 ? bossesInfo.push({ health: selected.targetTick.health, maxHealth: selected.targetTick.maxHealth, uid: selected.targetTick.uid }) : undefined;
            for (let i = 0; i < bossesInfo.length; i++) {
                if (game.world.entities[bossesInfo[i].uid] !== undefined) {
                    bossesInfo[i].health = game.world.entities[bossesInfo[i].uid].targetTick.health;
                }
                else {
                    bossesInfo[i].health = 0;
                }
            }
            if (checkIncludes(bossesInfo, selected.targetTick.uid, "uid") == false) {
                bossesInfo.push({ health: selected.targetTick.health, maxHealth: selected.targetTick.maxHealth, uid: selected.targetTick.uid });
            }
            if (bossesInfo.length > 0) {
                window.calculatedAllBossHealth = bossesInfo.reduce((a, b) => { return a + b["health"] }, 0);
                window.calculatedAllBossMaxHealth = bossesInfo.reduce((a, b) => { return a + b["maxHealth"] }, 0);
                numberp.innerText = calculatedAllBossHealth.toFixed(0) + "/" + calculatedAllBossMaxHealth.toFixed(0);
                percentp.innerText = (100 - (calculatedAllBossMaxHealth - calculatedAllBossHealth) / calculatedAllBossMaxHealth * 100).toFixed(1) + "%";
                bossesInfo.length > 4 ? numberOfBosses.innerText = 4 : numberOfBosses.innerText = bossesInfo.length;
                bossHealthBar.getElementsByClassName("bossHealthBarInner")[0].style.width = (100 - (calculatedAllBossMaxHealth - calculatedAllBossHealth) / calculatedAllBossMaxHealth * 100).toFixed(1) + "%";
                window.tierArray = []
                Object.entries(game.world.entities).forEach(zombie => {
                    if (zombie[1].targetTick.model.toUpperCase().includes("ZOMBIE")) {
                        tierArray.push(zombie[1].targetTick.model.match(/[0-9]+/g).join(""))
                    }
                })
                window.repeated = [];
                window.object = {};
                for (let i of tierArray) {
                    if (object[i] !== undefined) {
                        object[i]++
                    }
                    else {
                        object[i] = 1;
                    }
                };
                Object.keys(object).map(function (property) { let repeatition = { repeated: object[property] }; repeated.push([property, repeatition]) });
                var max = [];
                for (let i in repeated) {
                    max.push(repeated[i][1].repeated);
                    if (repeated[i][1].repeated == Math.max(...max)) { bossHealthBar.getElementsByClassName("bossTier")[0].innerText = "TIER" + " " + repeated[i][0] }
                }
            }
            else { numberp.innerText = 0; percentp.innerText = 0; }
            // console.log(selected.targetTick.model, "Health: " + selected.targetTick.health, "Max-Health: " + selected.targetTick.maxHealth);
        }
    }
    )
    let spinSpeed = spinTime;
    if (window.calculatedAllBossHealth) {
        var speedToSet = (((100 - (calculatedAllBossMaxHealth - calculatedAllBossHealth) / calculatedAllBossMaxHealth * 100).toFixed(1) / 100) * spinTime).toFixed(1);
        if (speedToSet > 0.1) {
            spinSpeed = speedToSet;
        }
        else {
            spinSpeed = 0.1
        }
    }
    else {
        spinSpeed = spinTime;
    }
    bossImageCircle.style.animation = "spinBorder " + spinSpeed + "s linear infinite";
    bossImage.style.animation = "spinOpposite " + spinSpeed + "s linear infinite";
}, 100)
var displayHealthBar = setInterval(() => {
    if (zombiesActive() == false) {
        bossHealthBarContainer.style.opacity = "0";
    }
    else {
        bossHealthBarContainer.style.opacity = "1";
    }
}, 25);
var inGame = false;
setInterval(() => {
    if (game.world.inWorld == true && inGame == false) {
        var timeLeft = 60;
        window.oldTime = game.ui.components.DayNightTicker.tickData.isDay
        var tellDay = setInterval(() => {
            setTimeout(() => {
                window.oldTime = game.ui.components.DayNightTicker.tickData.isDay;
            }, 50)
            window.time = game.ui.components.DayNightTicker.tickData.isDay;
            if (oldTime !== time) {
                // console.log(time == 0 ? "Night" : "Day");
                timeLeft = 60
            }
        }, 50)
        var decreamentInTimeLeft = setInterval(() => {
            if (timeLeft > 0.0) { timeLeft -= 0.1 };
            if (time == 1 && timeLeft.toFixed(1) == 30) {
                window.bossesInfo = [];
                // console.log("Resetting: bossesInfo...")
            }
            // console.log(timeLeft.toFixed(1) + "s");
        }, 100);
        inGame = true;
    }
}, 100)
 
 