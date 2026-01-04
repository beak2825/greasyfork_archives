// ==UserScript==
// @name         极速龟头[5倍掉落10倍回血][加速全部][菜园驻地加速]
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  [制造加速][自动点击][战斗加速]
// @author       红魔
// @match        https://gltyx.github.io/super-turtle-idle/
// @grant        none
// @icon         https://gltyx.github.io/super-turtle-idle/img/src/icons/supportTurtle.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513932/%E6%9E%81%E9%80%9F%E9%BE%9F%E5%A4%B4%5B5%E5%80%8D%E6%8E%89%E8%90%BD10%E5%80%8D%E5%9B%9E%E8%A1%80%5D%5B%E5%8A%A0%E9%80%9F%E5%85%A8%E9%83%A8%5D%5B%E8%8F%9C%E5%9B%AD%E9%A9%BB%E5%9C%B0%E5%8A%A0%E9%80%9F%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/513932/%E6%9E%81%E9%80%9F%E9%BE%9F%E5%A4%B4%5B5%E5%80%8D%E6%8E%89%E8%90%BD10%E5%80%8D%E5%9B%9E%E8%A1%80%5D%5B%E5%8A%A0%E9%80%9F%E5%85%A8%E9%83%A8%5D%5B%E8%8F%9C%E5%9B%AD%E9%A9%BB%E5%9C%B0%E5%8A%A0%E9%80%9F%5D.meta.js
// ==/UserScript==

let enemy_speed = 2500
let s1 = setInterval(hpRegen,99999);
let s2 = setInterval(damageTicks, 99999);
let s3 = setInterval(itemCooldownTick, 99999);
let s4 = setInterval(manaRegen,  99999);
let s5 = setInterval(manaUpdate, 99999);
let s6 = setInterval(updateSkillCD, 99999);
let s7 = setInterval(playerBuffsDecay, 99999);
let s8 = setInterval(function () { if (stats.currentCategory === "rpgContainer") { createQuest(); } }, 99999);
let s9 = setInterval(function () { if (stats.currentCategory === "rpgContainer") { statusParticleCheck(); } }, 99999);
function dropItem_hack(ID) { //dedicated drop rolls
//this code manages the extra percentage of drop chance and adds it to how many drop you can get
  let itemdrop = 0
  itemdrop = 100;

  if (did(stats.currentEnemy+"enemy") && did(stats.currentEnemy+"enemy").classList.contains('gilded')) {
    itemdrop = 300;
    if (talent.TG1E1.active) itemdrop = 450;
    stats.gildedKilled++;
    if (enemies[stats.currentEnemy].align==="nature") rareItemDrop("I434",1)
    if (enemies[stats.currentEnemy].align==="might") rareItemDrop("I435",1)
    if (enemies[stats.currentEnemy].align==="elemental") rareItemDrop("I436",1)
    if (enemies[stats.currentEnemy].align==="occult") rareItemDrop("I437",1)
    if (enemies[stats.currentEnemy].align==="deific") rareItemDrop("I438",1)
  }

  if (talent.TG1E1.active) if (did(stats.currentEnemy+"enemy") && did(stats.currentEnemy+"enemy").classList.contains('gilded')) {itemdrop = 400;}
  items[ID].count += itemdrop;
  items[ID].timesGot += itemdrop;
  //addItem()
}

function enemyAttack_hack() {
  if (
    gatherDifficulty.includes(enemies[stats.currentEnemy].difficulty) || !rpgPlayer.alive || (stats.currentArea === "A7" && !skirmishTime && !showdownTime) || (buffs.B6.time>0 || buffs.B44.time>0)) { //conditions to not attack
  } else {
    if (!settings.disableCombatAudio) playSound("audio/enemyAttack.mp3")
        var damageDealt = rng(enemies[stats.currentEnemy].attack, (enemies[stats.currentEnemy].attack*1.05))*enemyDamageMultiplier //damage variance
        if (enemies[stats.currentEnemy].dynamic) damageDealt = rng(eval(enemies[stats.currentEnemy].attack), (eval(enemies[stats.currentEnemy].attack)*1.05))*enemyDamageMultiplier //damage variance

        let dodged = false;

        if (buffs.B49.time>0 && rng(1,3)===1) dodged = true
        if (clothTier && rng(1,10)===1) dodged = true

        if (!dodged){

        if (did(stats.currentEnemy+"enemy") && did(stats.currentEnemy+"enemy").classList.contains('gilded')) damageDealt = eval(playerMaxHp/6)

        if (enemies[stats.currentEnemy].align==='nature') playerNatureDamage(damageDealt)
        if (enemies[stats.currentEnemy].align==='might') playerMightDamage(damageDealt)
        if (enemies[stats.currentEnemy].align==='elemental') playerElementalDamage(damageDealt)
        if (enemies[stats.currentEnemy].align==='occult') playerOccultDamage(damageDealt)
        if (enemies[stats.currentEnemy].align==='deific') playerDeificDamage(damageDealt)

      } else {

        animState("rpgPlayerImg", "spin 1s linear 1");
        damageText('Miss', 'damageText', '#818181', undefined, "playerPanel");


      }

      if (document.hasFocus()  && !settings.disableAnimations && stats.currentCategory === "rpgContainer"){

    if(enemies[stats.currentEnemy].animation === "ranged"){
      did("enemyAnimation").style.animation = "";
      void did("enemyAnimation").offsetWidth;
      did("enemyAnimation").style.animation = "gelatine 0.4s 1";

    }else{
      did("enemyAnimation").style.animation = "";
      void did("enemyAnimation").offsetWidth;
      did("enemyAnimation").style.animation = "enemyAttack 0.5s 1";

    }


    did("playerNpcPanel").style.animation = "";
    void did("playerNpcPanel").offsetWidth;
    did("playerNpcPanel").style.animation = "gelatine 0.3s 1 ease";

      }

    enemyAttackCheck(damageDealt)
}
}





function enemyUpdate_hack() { //updates enemy HP and checks if enemy is dead


  if (currentHP <= 0) { //on enemy kill

      if (currentSet==="nightmare"){buffs.B88.time=6; if (buffs.B88.stacks<50) buffs.B88.stacks++;}
      if (rpgPlayer.trinketSlot==="I11") rpgPlayer.coins+= items.I11.statUp

      if (stats.currentArea==="A9" && rng(1,10)===1) {castArea9Explosion()}





        if (gardenDragonGoldPower>0){
      rpgPlayer.coins += gardenDragonGoldPower
      stats.totalCoins += gardenDragonGoldPower
        }

        if (battleData) dataEnemiesKilled ++

        if (talent.TA1D1.active && rpgPlayer.mana<playerMaxMana) rpgPlayer.mana += playerMaxMana*0.005


        const loottable = window[stats.currentArea + 'Loot']; if (loottable) {rollTable(eval(stats.currentArea+"Loot"), 1) }



        if (gatherDifficulty.includes(enemies[stats.currentEnemy].difficulty)) { //if its ore
          var totalEXP = Math.round(enemies[stats.currentEnemy].exp * playerEXPGain);
          if (talent.TI3C2.active && (enemies[stats.currentEnemy].medal==="gold" || enemies[stats.currentEnemy].medal==="platinum")) totalEXP *= 1.5
           rpgClass[stats.currentClass].currentExp += totalEXP;
           stats.totalExp += totalEXP;
           if (!settings.disableExpLog) logPrint("<FONT COLOR='#ae77f7'>You gain " + beautify(totalEXP) + " EXP!" );

           if (battleData) dataExpGained += totalEXP


           for (let i in enemies){ if (did(i+"enemy")){ did(i + "enemy").remove(); }}


        }
        else { //if its an enemy



          let smallCrystalDropChance = 500
          if (enemies[stats.currentEnemy].align==="nature") rareItemDrop("I434", smallCrystalDropChance)
          if (enemies[stats.currentEnemy].align==="might") rareItemDrop("I435", smallCrystalDropChance)
          if (enemies[stats.currentEnemy].align==="elemental") rareItemDrop("I436", smallCrystalDropChance)
          if (enemies[stats.currentEnemy].align==="occult") rareItemDrop("I437", smallCrystalDropChance)
          if (enemies[stats.currentEnemy].align==="deific") rareItemDrop("I438", smallCrystalDropChance)

            let extraExp = 1
            if (settings.nofarmToggle) extraExp = 2

          var totalEXP = Math.round(enemies[stats.currentEnemy].exp * playerEXPGain * extraExp);
          if (talent.TI3C2.active && (enemies[stats.currentEnemy].medal==="gold" || enemies[stats.currentEnemy].medal==="platinum")) totalEXP *= 1.5
          rpgClass[stats.currentClass].currentExp += totalEXP*111;
          stats.totalExp += totalEXP*111;
          if (!settings.disableExpLog) logPrint("<FONT COLOR='#ae77f7'>" + enemies[stats.currentEnemy].name + " gets defeated! You gain " + beautify(totalEXP) + " EXP!" );

          if (battleData) dataExpGained += totalEXP*111


          for (let i in enemies){ if (did(i+"enemy")){
            if (document.hasFocus()  && !settings.disableAnimations && stats.currentCategory === "rpgContainer"){
            did(i + "enemy").style.animation = "enemyDefeat 0.2s 1 ease";
            }
            setTimeout(function () { if (did(i+"enemy")){ did(i + "enemy").remove(); } }, 180);
            }}

        }

        trinketEnemyKill(); //trinket effect
        expBar();
        eval(enemies[stats.currentEnemy].drop);
        eval(enemies[stats.currentEnemy].drop);
        eval(enemies[stats.currentEnemy].drop);
        eval(enemies[stats.currentEnemy].drop);
        eval(enemies[stats.currentEnemy].drop);
        eval(enemies[stats.currentEnemy].drop);

    clearInterval(enemyAttackInterval); //reset attack interval
    enemyAttackInterval = setInterval(enemyAttack, enemy_speed);
    rpgPlayer.hp = playerMaxHp;
    if (enemies[stats.currentEnemy].tag==="areaBoss"){
      if (togleAutoBoss) {

      } else bossTime = false;

    } else bossTime = false;



    if (enemies[stats.currentEnemy].firstTimeReward && enemies[stats.currentEnemy].killCount===0) improbabilityDrive("guaranteed")


    if (dungeonTime) {
      dungeonPoints++;
      updateDungeonPoints()
    }

    if (enemies[stats.currentEnemy].tag==="finalBoss"){ //dungeon ender
      playSound("audio/startup.mp3");
      dungeonTime=false;
      rollTable(dungeonCollectibles, 1)
      did("rpgCanvas").style.animation = "";
      void did("rpgCanvas").offsetWidth;
      did("rpgCanvas").style.animation = "rpgFade 1s 1";
      if (rpgClass[stats.currentClass].level > areas[stats.currentArea].level) {stats.currentArea = previousArea;} else {stats.currentArea = "A1";}
      if (areas[previousArea].dungeon) stats.currentArea = "A1";
      stats.currentDifficulty = previousDifficulty;
      dungeonPoints = 0;
      dungeonStage=0
      stats.dungeonsCleared++;
      if (rng(1,5)===1) rareItemDrop(rareItems[rng(0,(rareItems.length-1))],1)
      if (rng(1,15)===1) rareItemDrop(rareItems2[rng(0,(rareItems2.length-1))],1)
      updateDungeonPoints();
      switchArea();
      updateBGColor();
      specialButtonUi();
      createAreaPanel();
    }

    if (enemies[stats.currentEnemy].tag==="stageBoss1"){
      dungeonStage=1;
      playSound("audio/startup.mp3");
      dungeonPoints = 0;
      updateDungeonPoints();
      did("dungeonBox2").style.animation = "";
      void did("dungeonBox2").offsetWidth;
      createAreaPanel();
    }

    if (enemies[stats.currentEnemy].tag==="stageBoss2"){
      dungeonStage=2;
      playSound("audio/startup.mp3");
      dungeonPoints = 0;
      updateDungeonPoints();
      did("dungeonBox2").style.animation = "";
      void did("dungeonBox2").offsetWidth;
      createAreaPanel();
    }

    if (enemies[stats.currentEnemy].tag==="showdownBoss"){
      showdown[enemies[stats.currentEnemy].showdown].bestTime = showdownTimer;
      playSound("audio/startup.mp3");
      did(enemies[stats.currentEnemy].showdown+"showdown").style.animation = "levelUp 1s 1";
      endShowdown()

    }

    if (skirmishTime) {
      skirmishPoints++;
      updateSkirmishPoints()
    }

    if (stats.currentEnemy === "E18" && enemyPhase===2) stats.purifiedMorgatosDefeated++

    enemies[stats.currentEnemy].killCount++;
    stats.totalKills++;
    if (bossTime) {stats.totalBossKills++;};


    if (settings.nofarmToggle) {

      enemies[stats.currentEnemy].killCount++;
      stats.totalKills++;
      if (bossTime) {stats.totalBossKills++;};
      eval(enemies[stats.currentEnemy].drop);




    }


    if (enemies[stats.currentEnemy].killCount===1 && stats.currentEnemy===areas[stats.currentArea].boss) {
      createPopup('💠 Mastery cap released!', '#6FB1EE')
      statsUpdate()
      updateStatsUI()
      did("areaLevel").style.display = "none"
    }


    removeBuffs("clear");
    playerBuffs();
    spawnEnemy();



  }

  var percentageHP = (currentHP / enemies[stats.currentEnemy].hp) * 100;

  if (did(stats.currentEnemy+"enemy") && did(stats.currentEnemy+"enemy").classList.contains('gilded')) percentageHP = (currentHP / 15000) * 100;


  did("enemyHpBar").style.background = "linear-gradient(90deg, rgb(144,238,111)" + percentageHP + "%, rgb(255,119,119) " + percentageHP + "%)";

}



(function() {
    'use strict';

    dropItem = dropItem_hack
    enemyAttack = enemyAttack_hack
    enemyUpdate = enemyUpdate_hack
    // 创建一个可拖动的div - 加速工坊块
    var div1 = document.createElement("div");
    div1.id = "draggableDiv1";
    div1.style.position = "fixed";
    div1.style.top = "50px";
    div1.style.left = "50px";
    div1.style.width = "300px";
    div1.style.height = "250px";
    div1.style.backgroundColor = "rgba(0, 0, 0, 0.9)";  // 深色背景，提升对比度
    div1.style.border = "1px solid #fff";
    div1.style.color = "#fff";
    div1.style.zIndex = "1000";
    div1.style.padding = "10px";
    div1.style.cursor = "move";
    div1.innerHTML = "<h3>加速工坊模块[已整合自动点礼物复活]</h3><div id='moduleContainer1'></div><h3>游戏加速模块</h3><div id='moduleContainer2'></div>";

    document.body.appendChild(div1);

    /*
    // 创建一个可拖动的div - 游戏加速块
    var div2 = document.createElement("div");
    div2.id = "draggableDiv2";
    div2.style.position = "fixed";
    div2.style.top = "250px";
    div2.style.left = "50px";
    div2.style.width = "300px";
    div2.style.height = "150px";
    div2.style.backgroundColor = "rgba(0, 0, 0, 0.9)";  // 深色背景，提升对比度
    div2.style.border = "1px solid #fff";
    div2.style.color = "#fff";
    div2.style.zIndex = "1000";
    div2.style.padding = "10px";
    div2.style.cursor = "move";
    div2.innerHTML = "<h3>游戏加速模块</h3><div id='moduleContainer2'></div>";

    document.body.appendChild(div2);
    */
    // 加速工坊按钮
    var button1 = document.createElement("button");
    button1.style.backgroundColor = "rgba(80, 80, 80, 0.9)";  // 加深背景颜色
    button1.style.color = "#fff";  // 白色文字
    button1.innerHTML = "加速工坊制造";
    document.getElementById("moduleContainer1").appendChild(button1);

    // 点击按钮后执行代码 - 加速工坊
    button1.addEventListener("click", function() {
        for(let i in recipes) {
            recipes[i].timer = 0.1;
            console.log(recipes[i].timer);
        }
        setInterval(() => { researchTimer() }, 1);
        setInterval(plantTick, 5); //default 10000
        setInterval(garrisonTick, 5); //default 30000
        setInterval(craftingProgress,5);
    });

    function deal_speed(times){
        clearInterval(playerAttackInterval);
        clearInterval(enemyAttackInterval);
        enemy_speed = 3500
        enemy_speed /= times
        playerAttackInterval = setInterval(playerAttack, 2000*playerHaste / times);
        enemyAttackInterval = setInterval(enemyAttack, enemy_speed);
        clearInterval(s1);
        clearInterval(s2);
        clearInterval(s3);
        clearInterval(s4);
        clearInterval(s5);
        clearInterval(s6);
        //clearInterval(s7);
        //clearInterval(s8);
        //clearInterval(s9);
        if(times > 1){
             s1 = setInterval(hpRegen, 200 / (times-1));
             s2 = setInterval(damageTicks, 1000 / (times-1));
             s3 = setInterval(itemCooldownTick, 100 / (times-1));
             s4 = setInterval(manaRegen, 100 / (times-1));
             s5 = setInterval(manaUpdate, 100 / (times-1));
             s6 = setInterval(updateSkillCD, 100 / (times-1));
             //s7 = setInterval(playerBuffsDecay, 1000 / (times-1));
             //s8 = setInterval(function () { if (stats.currentCategory === "rpgContainer") { createQuest(); } }, 1000 / (times-1));
             //s9 = setInterval(function () { if (stats.currentCategory === "rpgContainer") { statusParticleCheck(); } }, 800 / (times-1));
        }else{

             s1 = setInterval(hpRegen,99999);
             s2 = setInterval(damageTicks, 99999);
             s3 = setInterval(itemCooldownTick, 99999);
             s4 = setInterval(manaRegen,  99999);
             s5 = setInterval(manaUpdate, 99999);
             s6 = setInterval(updateSkillCD, 99999);
             //s7 = setInterval(playerBuffsDecay, 99999);
             //s8 = setInterval(function () { if (stats.currentCategory === "rpgContainer") { createQuest(); } }, 99999);
             //s9 = setInterval(function () { if (stats.currentCategory === "rpgContainer") { statusParticleCheck(); } }, 99999);
        }

    }

   // 游戏加速 - 1倍
    var buttonx = document.createElement("button");
    buttonx.style.backgroundColor = "rgba(80, 80, 80, 0.9)";
    buttonx.style.color = "#fff";
    buttonx.innerHTML = "战斗加速1倍";
    document.getElementById("moduleContainer2").appendChild(buttonx);

    buttonx.addEventListener("click", function() {
        deal_speed(1)
    });
    // 游戏加速 - 5倍
    var button2 = document.createElement("button");
    button2.style.backgroundColor = "rgba(80, 80, 80, 0.9)";
    button2.style.color = "#fff";
    button2.innerHTML = "战斗加速5倍";
    document.getElementById("moduleContainer2").appendChild(button2);

    button2.addEventListener("click", function() {
        deal_speed(5)
    });

    // 游戏加速 - 10倍
    var button3 = document.createElement("button");
    button3.style.backgroundColor = "rgba(80, 80, 80, 0.9)";
    button3.style.color = "#fff";
    button3.innerHTML = "战斗加速10倍";
    document.getElementById("moduleContainer2").appendChild(button3);

    button3.addEventListener("click", function() {
        deal_speed(5)
    });

    // 游戏加速 - 100倍
    var button4 = document.createElement("button");
    button4.style.backgroundColor = "rgba(80, 80, 80, 0.9)";
    button4.style.color = "#fff";
    button4.innerHTML = "战斗加速100倍";
    document.getElementById("moduleContainer2").appendChild(button4);

    button4.addEventListener("click", function() {
        deal_speed(100)
    });
    // 游戏加速 - 2000倍
    var button5 = document.createElement("button");
    button5.style.backgroundColor = "rgba(80, 80, 80, 0.9)";
    button5.style.color = "#fff";
    button5.innerHTML = "战斗加速2000倍";
    document.getElementById("moduleContainer2").appendChild(button5);

    button5.addEventListener("click", function() {
         deal_speed(2000)
    });
    // 拖动功能
    function enableDrag(div) {
        var isMouseDown = false;
        var offsetX, offsetY;

        div.addEventListener('mousedown', function(e) {
            isMouseDown = true;
            offsetX = e.clientX - div.offsetLeft;
            offsetY = e.clientY - div.offsetTop;
        });

        document.addEventListener('mousemove', function(e) {
            if (isMouseDown) {
                div.style.left = e.clientX - offsetX + 'px';
                div.style.top = e.clientY - offsetY + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isMouseDown = false;
        });
    }

    // 启用两个块的拖动功能
    enableDrag(div1);


    let rpgPlayerImg = did("rpgPlayerImg");
    let jesterWrapper = did("jesterWrapper");
    let mysteryList = did("mysteryList");
    setInterval(() => {
        //自动点击左下角乌龟 Auto click the turtle at left bottom
        //if (!clickCooldown) {
        //    turtleClick();
        //}
        //自动点击复活 Auto click for reviving
        if (!rpgPlayer.alive) {
            rpgPlayerImg.click();
        }
        //自动点击小丑龟 Auto click jester turtle
        if (jesterWrapper.hasChildNodes()) {
            jesterWrapper.firstChild.click();
        }
        //自动打开礼物敌人 Auto open mystery present enemy
        if (stats.currentEnemy == "E15") {
            did("E15enemy").firstChild.dispatchEvent(new MouseEvent('contextmenu', {
                'view': window,
                'bubbles': true,
                'cancelable': false
            }));
        }
        //自动打开礼物敌人的礼物 Auto open mystery presents
        if(mysteryList.hasChildNodes()){
            let endGame;
            for(let mystery of mysteryList.children){
                if(mystery.id.startsWith("endGame")){
                    endGame = mystery;
                }
                else{
                    mystery.click();
                }
            }
            endGame.click();
        }
    }, 50);

})();
