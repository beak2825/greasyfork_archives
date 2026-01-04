// ==UserScript==
// @name         Melvor CB only completion log
// @version      1.5.0
// @description  Completion log for combat only restricted accounts
// @author       8992
// @match        https://*.melvoridle.com/*
// @grant        none
// @namespace    http://tampermonkey.net/
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/404814/Melvor%20CB%20only%20completion%20log.user.js
// @updateURL https://update.greasyfork.org/scripts/404814/Melvor%20CB%20only%20completion%20log.meta.js
// ==/UserScript==
const skills = [0, 1, 2, 3, 4, 5, 10, 13, 14, 15, 19, 20];

function addCombatItem(id, sources) {
  const i = combatItems.findIndex(a => a.id == id);
  if (i == -1) {
    combatItems.push({ id, name: items[id].name, sources })
  } else {
    combatItems[i].sources = [...new Set([...sources, ...combatItems[i].sources])];
  }
}

let loadCheckInterval = setInterval(() => {
  if (isLoaded) {
    clearInterval(loadCheckInterval);
    loadScript();
  }
}, 200);

function loadScript() {
  for (let i = 0; i < skillLevel.length; i++) {
    if (skills.includes(i) && skillLevel[i] > 1) {
      console.log("Combat only completion log aborted loading due to account type");
      return;
    }
  }
  window.combatPets = [12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
  window.combatItems = [
    { id: CONSTANTS.item.Attack_Skillcape, name: items[CONSTANTS.item.Attack_Skillcape].name, sources: ["Shop"] },
    { id: CONSTANTS.item.Strength_Skillcape, name: items[CONSTANTS.item.Strength_Skillcape].name, sources: ["Shop"] },
    { id: CONSTANTS.item.Defence_Skillcape, name: items[CONSTANTS.item.Defence_Skillcape].name, sources: ["Shop"] },
    { id: CONSTANTS.item.Hitpoints_Skillcape, name: items[CONSTANTS.item.Hitpoints_Skillcape].name, sources: ["Shop"] },
    { id: CONSTANTS.item.Ranged_Skillcape, name: items[CONSTANTS.item.Ranged_Skillcape].name, sources: ["Shop"] },
    { id: CONSTANTS.item.Magic_Skillcape, name: items[CONSTANTS.item.Magic_Skillcape].name, sources: ["Shop"] },
    { id: CONSTANTS.item.Prayer_Skillcape, name: items[CONSTANTS.item.Prayer_Skillcape].name, sources: ["Shop"] },
    { id: CONSTANTS.item.Slayer_Skillcape, name: items[CONSTANTS.item.Slayer_Skillcape].name, sources: ["Shop"] },
    { id: CONSTANTS.item.Red_Party_Hat, name: items[CONSTANTS.item.Red_Party_Hat].name, sources: ["Shop"] },
    { id: CONSTANTS.item.Amulet_of_Calculated_Promotion, name: items[CONSTANTS.item.Amulet_of_Calculated_Promotion].name, sources: ["Leech"] },
    { id: CONSTANTS.item.Fire_Cape, name: items[CONSTANTS.item.Fire_Cape].name, sources: ["Malcs, the Guardian of Melvor"] },
    { id: CONSTANTS.item.Bowstring, name: items[CONSTANTS.item.Bowstring].name, sources: ["Shop"] },
    { id: CONSTANTS.item.Eight, name: items[CONSTANTS.item.Eight].name, sources: ["Easter egg"] },
    { id: CONSTANTS.item.Lemon, name: items[CONSTANTS.item.Lemon].name, sources: ["Easter egg"] },
    { id: CONSTANTS.item.Signet_Ring_Half_B, name: items[CONSTANTS.item.Signet_Ring_Half_B].name, sources: ["Any monster"] },
  ];
  for (const a of SHOP.Slayer.reduce((arr, option) => [...arr, ...option.contains.items],[])) {
    addCombatItem(a[0], ["Shop"]);
  }
  for (const a of SHOP.Gloves.reduce((arr, option) => [...arr, ...option.contains.items],[])) {
    addCombatItem(a[0], ["Shop"]);
  }
  for (const monster of MONSTERS) {
    //monster loot
    if (typeof monster.bones == "number") {
      addCombatItem(monster.bones, [monster.name]);
    }
    if (monster.lootTable !== undefined) {
      for (const j of monster.lootTable) {
        addCombatItem(j[0], [monster.name]);
        if (items[j[0]].type == "Seeds" && items[j[0]].tier == "Herb") addCombatItem(items[j[0]].grownItemID, [monster.name]);
      }
    }
  }
  for (const a of combatItems) {
    //upgrades 1
    if (items[a.id].trimmedItemID) {
      potentialUpgrade = [];
      for (let j = 0; j < items[items[a.id].trimmedItemID].itemsRequired.length; j++) {
        let found = combatItems.findIndex((x) => x.id == items[items[a.id].trimmedItemID].itemsRequired[j][0]);
        if (items[a.id].isPotion) found = -1;
        found >= 0 ? potentialUpgrade.push(true) : potentialUpgrade.push(false);
      }
      if (!potentialUpgrade.includes(false)) {
        addCombatItem(items[a.id].trimmedItemID, [...a.sources]);
      }
    }
  }
  for (const a of combatItems) {
    //chest loot
    if (items[a.id].dropTable !== undefined) {
      for (let j = 0; j < items[a.id].dropTable.length; j++) {
        addCombatItem(items[a.id].dropTable[j][0], [...a.sources]);
      }
    }
  }
  for (const a of combatItems) {
    //upgrades 2
    if (items[a.id].trimmedItemID) {
      potentialUpgrade = [];
      for (let j = 0; j < items[items[a.id].trimmedItemID].itemsRequired.length; j++) {
        let found = combatItems.findIndex((x) => x.id == items[items[a.id].trimmedItemID].itemsRequired[j][0]);
        if (items[a.id].isPotion) found = -1;
        found >= 0 ? potentialUpgrade.push(true) : potentialUpgrade.push(false);
      }
      if (!potentialUpgrade.includes(false)) {
        addCombatItem(items[a.id].trimmedItemID, [...a.sources]);
      }
    }
  }
  combatItems.sort(function (a, b) {
    return a.id - b.id;
  }); //sorts smallest to largest id

  window.updateCompletionLog = function () {
    let skills = 8 * 99;
    let skillsTotal =
      skillLevel[CONSTANTS.skill.Attack] +
      skillLevel[CONSTANTS.skill.Strength] +
      skillLevel[CONSTANTS.skill.Defence] +
      skillLevel[CONSTANTS.skill.Hitpoints] +
      skillLevel[CONSTANTS.skill.Ranged] +
      skillLevel[CONSTANTS.skill.Magic] +
      skillLevel[CONSTANTS.skill.Prayer] +
      skillLevel[CONSTANTS.skill.Slayer];
    let itemsTotal = combatItems.length;
    let itemsFound = 0;
    let monstersTotal = MONSTERS.length;
    let monstersKilled = 0;
    let pets = 0;
    let petsPercentage = 0;
    //skill level
    let skillsPercentage = (skillsTotal / skills) * 100;
    //items
    for (let i = 0; i < combatItems.length; i++) {
      if (itemStats[combatItems[i].id].stats[0] > 0 && !items[i].ignoreCompletion) itemsFound++;
      if (items[i].ignoreCompletion) itemsTotal -= 1;
    }
    let itemsPercentage = (itemsFound / itemsTotal) * 100;
    //monsters
    for (let i = 0; i < monsterStats.length; i++) {
      if (monsterStats[i].stats[2] > 0 && !MONSTERS[i].ignoreCompletion) monstersKilled++;
      if (MONSTERS[i].ignoreCompletion) monstersTotal -= 1;
    }
    let monstersPercentage = (monstersKilled / monstersTotal) * 100;
    //pets
    for (let i = 0; i < petUnlocked.length; i++) {
      if (petUnlocked[i] && combatPets.includes(i)) pets++;
    }
    petsPercentage = (pets / combatPets.length) * 100;
    let totalPercentage = (itemsPercentage + skillsPercentage + monstersPercentage + petsPercentage) / 4;
    //update percentages
    $("#completion-skills").text(Math.floor(skillsPercentage) + "%");
    $("#completion-items").text(Math.floor(itemsPercentage) + "%");
    $("#completion-monsters").text(Math.floor(monstersPercentage) + "%");
    $("#completion-pets").text(Math.floor(petsPercentage) + "%");
    $("#completion-total").text(Math.floor(totalPercentage) + "%");
  };

  window.openItemLog = function () {
    let timesFound = (ignoreCompletion = timesSold = gpFromSale = deathCount = damageTaken = damageDealt = missedAttacks = timesEaten = healedFor = totalAttacks = amountUsedInCombat = timeWaited = timesDied = timesGrown = harvestAmount = enemiesKilled = timesOpened = "");
    $("#itemlog-container").html("");
    let totalFound = 0;
    for (let i = 0; i < combatItems.length; i++) {
      let itemTooltip;
      if (itemStats[combatItems[i].id].stats[0] > 0) {
        totalFound++;
        timesFound = ignoreCompletion = timesSold = gpFromSale = deathCount = damageTaken = damageDealt = missedAttacks = timesEaten = healedFor = totalAttacks = amountUsedInCombat = timeWaited = timesDied = timesGrown = harvestAmount = enemiesKilled = timesOpened = "";
        if (items[combatItems[i].id].ignoreCompletion) ignoreCompletion = "<br><span class='text-danger'>Item does not count towards completion.</span>";
        if (itemStats[combatItems[i].id].stats[0] > 0) timesFound = "<br>Times Found: <small class='text-warning'>" + formatNumber(itemStats[combatItems[i].id].stats[0]) + "</small>";
        if (itemStats[combatItems[i].id].stats[1] > 0) timesSold = "<br>Quantity Sold: <small class='text-warning'>" + formatNumber(itemStats[combatItems[i].id].stats[1]) + "</small>";
        if (itemStats[combatItems[i].id].stats[2] > 0) gpFromSale = "<br>GP Gained from sales: <small class='text-warning'>" + formatNumber(itemStats[combatItems[i].id].stats[2]) + "</small>";
        if (itemStats[combatItems[i].id].stats[3] > 0) deathCount = "<br>Times lost due to death: <small class='text-warning'>" + formatNumber(itemStats[combatItems[i].id].stats[3]) + "</small>";
        if (itemStats[combatItems[i].id].stats[4] > 0) damageTaken = "<br>Damage Taken whilst Equipped: <small class='text-warning'>" + formatNumber(itemStats[combatItems[i].id].stats[4]) + "</small>";
        if (itemStats[combatItems[i].id].stats[5] > 0) damageDealt = "<br>Damage Dealt: <small class='text-warning'>" + formatNumber(itemStats[combatItems[i].id].stats[5]) + "</small>";
        if (itemStats[combatItems[i].id].stats[6] > 0) missedAttacks = "<br>Attacks Missed: <small class='text-warning'>" + formatNumber(itemStats[combatItems[i].id].stats[6]) + "</small>";
        if (itemStats[combatItems[i].id].stats[7] > 0) timesEaten = "<br>Times Eaten: <small class='text-warning'>" + formatNumber(itemStats[combatItems[i].id].stats[7]) + "</small>";
        if (itemStats[combatItems[i].id].stats[8] > 0) healedFor = "<br>Healed for: <small class='text-warning'>" + formatNumber(itemStats[combatItems[i].id].stats[8]) + "</small>";
        if (itemStats[combatItems[i].id].stats[9] > 0) totalAttacks = "<br>Total Attacks: <small class='text-warning'>" + formatNumber(itemStats[combatItems[i].id].stats[9]) + "</small>";
        if (itemStats[combatItems[i].id].stats[10] > 0) amountUsedInCombat = "<br>Amount used in combat: <small class='text-warning'>" + formatNumber(itemStats[combatItems[i].id].stats[10]) + "</small>";
        if (itemStats[combatItems[i].id].stats[11] > 0) timeWaited = "<br>Time spent waiting to grow: <small class='text-warning'>" + formatNumber(itemStats[combatItems[i].id].stats[11]) + "</small>";
        if (itemStats[combatItems[i].id].stats[12] > 0) timesDied = "<br>Crop deaths: <small class='text-warning'>" + formatNumber(itemStats[combatItems[i].id].stats[12]) + "</small>";
        if (itemStats[combatItems[i].id].stats[13] > 0) timesGrown = "<br>Successful grows: <small class='text-warning'>" + formatNumber(itemStats[combatItems[i].id].stats[13]) + "</small>";
        if (itemStats[combatItems[i].id].stats[14] > 0) harvestAmount = "<br>Amount harvested: <small class='text-warning'>" + formatNumber(itemStats[combatItems[i].id].stats[14]) + "</small>";
        if (itemStats[combatItems[i].id].stats[15] > 0) enemiesKilled = "<br>Enemies killed: <small class='text-warning'>" + formatNumber(itemStats[combatItems[i].id].stats[15]) + "</small>";
        if (itemStats[combatItems[i].id].stats[16] > 0) timesOpened = "<br>Opened: <small class='text-warning'>" + formatNumber(itemStats[combatItems[i].id].stats[16]) + "</small>";
        $("#itemlog-container").append('<img class="skill-icon-sm" id="item-log-img-' + combatItems[i].id + '" src="' + getItemMedia(combatItems[i].id) + '">');
        itemTooltip = "<div class='text-center'>" + items[combatItems[i].id].name + "<small class='text-info'> " + timesFound + timesSold + gpFromSale + totalAttacks + missedAttacks + damageDealt + damageTaken + enemiesKilled + amountUsedInCombat + timesEaten + healedFor + timesGrown + timesDied + timeWaited + harvestAmount + timesOpened + ignoreCompletion + "</small></div>";
        if (items[combatItems[i].id].ignoreCompletion && combatItems[i].id !== CONSTANTS.item.Cape_of_Completion) $("#item-log-img-" + combatItems[i].id).attr("onClick", "addItemToBank(" + combatItems[i].id + ", 1);");
      } else {
        if (!items[combatItems[i].id].ignoreCompletion) {
          $("#itemlog-container").append('<img class="skill-icon-sm" id="item-log-img-' + combatItems[i].id + '" src="https://cdn.melvor.net/core/v018/assets/media/main/question.svg">');
          itemTooltip = "<div class='text-center'>" + items[combatItems[i].id].name + "</div>";
        }
      }
      tippy("#item-log-img-" + combatItems[i].id, {
        content: itemTooltip,
        placement: "bottom",
        allowHTML: true,
        interactive: false,
        animation: false,
      });
    }
    document.getElementById("modal-item-log").getElementsByClassName("block-title")[0].textContent = "Item Log (" + totalFound + "/" + combatItems.length + ")";
    //updateTooltips();
    $("#modal-item-log").modal("show");
  }

  window.openPetLog = function () {
    $("#petlog-container").html("");
    for (let i = 0; i < PETS.length; i++) {
      if (combatPets.includes(i)) {
        let tooltip;
        if (petUnlocked[i]) {
          $("#petlog-container").append('<img class="skill-icon-md" id="pet-log-img-' + i + '" src="' + PETS[i].media + '">');
          tooltip =
            '<div class="text-center"><span class="text-warning">' +
            PETS[i].name +
            '</span><br><span class="text-info">' +
            PETS[i].description +
            "</span></div>";
        } else {
          $("#petlog-container").append('<img class="skill-icon-md" id="pet-log-img-' + i + '" src="assets/media/main/question.svg">');
          tooltip = "<div class=\"text-center\">???<br><small class='text-danger'>Hint: " + PETS[i].acquiredBy + "</small></div>";
        }
        tippy("#pet-log-img-" + i, {
          content: tooltip,
          placement: "bottom",
          allowHTML: true,
          interactive: false,
          animation: false,
        });
      }
      $("#modal-pet-log").modal("show");
    }
  };
  for (let i = 0; i < skillLevel.length; i++) {
    if (skills.includes(i)) $("#nav-skill-tooltip-" + i).remove();
  }
  $('li.nav-main-item:contains("Alt. Magic")').remove();
  $("#farming-glower").remove();
  $(".nav-main-heading").remove(":contains('Non-Combat')");
  $("#completion-mastery").parent().remove();
  $(".nav-main-item").remove(":contains('Mastery')");
  let m = [0, 1, 2, 3, 4, 5, 10, 11, 13, 14, 15, 19, 20];
  for (let i = 0; i < m.length; i++) {
    $('a[href="javascript: updateMilestoneTab(' + m[i] + ');"]')
      .parent()
      .remove();
  }

  window.downloadList = function () {
    let itemsRemaining = String("ID" + "\t" + "Name" + "\t" + "Sources" + "\n");
    for (let i = 0; i < combatItems.length; i++) {
      if (itemStats[combatItems[i].id].stats[0] < 1) {
        itemsRemaining += String(combatItems[i].id + "\t" + combatItems[i].name + "\t" + combatItems[i].sources + "\n");
      }
    }
    let file = new Blob([itemsRemaining], {
      type: "text/plain",
    });
    if (window.navigator.msSaveOrOpenBlob) window.navigator.msSaveOrOpenBlob(file, "Melvor_items_remaining.txt");
    else {
      var a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = "Melvor_items_remaining.txt";
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  };
  var button1 = document.createElement("button");
  button1.className = "btn btn-sm btn-warning m-1";
  button1.onclick = () => downloadList();
  button1.textContent = "Download list of remaining items";
  document
    .getElementById("modal-item-log")
    .getElementsByClassName("block-header bg-primary-dark")[0]
    .insertBefore(button1, document.getElementById("modal-item-log").getElementsByClassName("block-options")[0]);
  window.downloadKC = function () {
    let KCstring = String("ID" + "\t" + "Name" + "\t" + "KC" + "\n");
    for (let i = 0; i < monsterStats.length; i++) {
      KCstring += String(i + "\t" + MONSTERS[i].name + "\t" + monsterStats[i].stats[2] + "\n");
    }
    var file = new Blob([KCstring], {
      type: "text/plain",
    });
    if (window.navigator.msSaveOrOpenBlob) window.navigator.msSaveOrOpenBlob(file, "melvorKC.txt");
    else {
      var a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = "melvorKC.txt";
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  };
  var button2 = document.createElement("button");
  button2.className = "btn btn-sm btn-warning m-1";
  button2.onclick = () => downloadKC();
  button2.textContent = "Download Monster Killcounts";
  document
    .getElementById("modal-monster-log")
    .getElementsByClassName("block-header bg-primary-dark")[0]
    .insertBefore(button2, document.getElementById("modal-monster-log").getElementsByClassName("block-options")[0]);
  updateCompletionLog();
  console.log("Combat only completion log loaded");
}
