// ==UserScript==
// @name         Sword Gale Online 介面優化
// @namespace    http://tampermonkey.net/
// @version      1.37.3
// @description  優化界面
// @author       Wind
// @match        https://swordgale.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=swordgale.online
// @grant        none
// @license MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/479342/Sword%20Gale%20Online%20%E4%BB%8B%E9%9D%A2%E5%84%AA%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/479342/Sword%20Gale%20Online%20%E4%BB%8B%E9%9D%A2%E5%84%AA%E5%8C%96.meta.js
// ==/UserScript==
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

// import scriptLoader from "./pages/main";
const scriptLoader = require("./pages/main").default;
const commonUtil = require("./utils/common");
const uiUtil = require("./utils/ui");
const settingStorage = require("./storage/setting");
const globalVarsStorage = require("./storage/globalVars");
const eventUtil = require("./utils/event");
const pageScript = {
  "/profile": () => {
    scriptLoader.profile();
  },
  "/hunt": () => {
    scriptLoader.hunt();
  },
  "/items": () => {
    scriptLoader.items();
  },
  "/market"() {
    this["/items"]();
  },
  "/forge": () => {
    scriptLoader.forge();
  }
};
if (settingStorage.get("UPDATE.LAST_CHECK_TIMESTAMP") + globalVarsStorage.get("UPDATE_CHECK_INTERVAEL") < new Date().getTime()) {
  fetch("https://sgo-filter.wind-tech.tw/api/version").then(res => res.json()).then(data => {
    // fetch("http://localhost/api/version").then(res => res.json()).then((data) => {
    globalVarsStorage.set("LATEST_VERSION", data["version"]);
  }).catch(err => {
    console.error(err);
  });
}
let container;
let debounce = 0;
let timer = setInterval(() => {
  container = document.querySelector("#__next");
  if (container) {
    clearInterval(timer);
    uiUtil.createOpenDialogButton();
    if (commonUtil.isMobileDevice() && settingStorage.get("GENERAL.MOBILE_WRAP_NAVBAR")) uiUtil.wrapNavbar();
    if (settingStorage.get("GENERAL.BACKGROUND_IMAGE_URL") !== "") {
      const backgroundImageDiv = document.createElement("div");
      backgroundImageDiv.style.cssText = `
                background: #fff url(${settingStorage.get("GENERAL.BACKGROUND_IMAGE_URL")}) center center fixed no-repeat;
                background-size: cover;
                -webkit-background-size: cover;
                width: 100%;
                height: 100%;
                position: fixed;
                top: 0;
                left: 0;
                opacity: 0.5;
                pointer-events: none;
            `;
      if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) backgroundImageDiv.style.cssText += "background-attachment: scroll;";
      backgroundImageDiv.id = "background-image-div";
      document.body.insertBefore(backgroundImageDiv, document.body.firstChild);
      // document.body.style.background = ``;
      // document.body.style.backgroundSize = "cover";
    }
    // createSettingUI();
    // registerSettingUIEvent();
    loadObserver();
  } else {
    // console.log("test")
  }
}, 10);
function loadObserver() {
  const observer = new MutationObserver(function (e) {
    //奇怪的DOM 導致forge UI產生兩次
    if (e.length) {
      let renderDiv = false;
      for (let i = 0; i < e.length; i++) {
        if (e[i].addedNodes.length && e[i].addedNodes[0].tagName === "DIV" || e[i].removedNodes.length && e[i].removedNodes[0].tagName === "DIV") {
          renderDiv = true;
        }
      }
      if (!renderDiv) return;
    }
    const pathname = location.pathname;
    if (pageScript[pathname]) {
      debounce++;
      setTimeout(() => {
        debounce--;
        if (debounce === 0) {
          //console.log(e);
          commonUtil.clearObservers();
          commonUtil.clearTimers();
          eventUtil.clearSubscribeEvents();
          pageScript[pathname]();
        }
      }, 500);
    }
  });
  observer.observe(container, {
    subtree: false,
    childList: true
  });
}
if (location.hash !== "") {
  const token = location.hash.substring(1);
  history.pushState(null, null, "/");
  const _getItem = localStorage.getItem;
  localStorage.getItem = key => {
    if (key === "token") return token;
    return _getItem.apply(localStorage, [key]);
  };
}

},{"./pages/main":5,"./storage/globalVars":8,"./storage/setting":9,"./utils/common":10,"./utils/event":11,"./utils/ui":12}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const commonUtil = require("../utils/common");
const settingStorage = require("../storage/setting");
const eventUtil = require("../utils/event");
const forgeStorage = require("../storage/forge");
let recipeData = settingStorage.get("recipe");
let selectedMaterials = [];
let equipmentName = "";
const elementClassname = {};
let materialDiv, goMaterial, forgeContainer;
const filterRecipe = {};
function Init() {
  commonUtil.bindEvent("/forge", () => {
    forgeContainer = document.querySelectorAll(".chakra-container");
    if (forgeContainer.length > 0) {
      if (forgeContainer.length > 1) {
        forgeContainer = forgeContainer[1];
      } else {
        forgeContainer = forgeContainer[0];
      }
      // if(!materialDiv)
      materialDiv = forgeContainer.childNodes[2];
      goMaterial = forgeContainer.childNodes[0];

      const forgingBtn = document.querySelectorAll(".chakra-button")[0];
      //console.log(forgingBtn);
      //forgingBtn.onclick = goTop;

      const forgeButton = forgeContainer.querySelector("button");
      if (materialDiv.querySelector(".chakra-table__container") && forgeButton) {
        commonUtil.clearTimers();
        createUI();
        refreshRecipeTable();
        forgeContainer.querySelector("#addRecipeBtn").onclick = addRecipe;
        forgeButton.onclick = forgeClick;
        eventUtil.subscribeApi("forge", data => {
          const time = new Date(data.profile.actionStart);
          time.setSeconds(0);
          time.setMilliseconds(0);
          const base64 = btoa(encodeURIComponent(`${time.getTime()},${equipmentName},${data.profile.nickname}`));
          forgeStorage.set(base64, selectedMaterials.join(","));
          forgeStorage.save();
        });
      }
    }
  });
}

function createUI() {
  const equipmentNameDiv = forgeContainer.querySelector("div[role='group']");
  elementClassname["labelDiv"] = equipmentNameDiv.childNodes[1].className;
  elementClassname["input"] = equipmentNameDiv.childNodes[2].className;
  elementClassname["button"] = forgeContainer.querySelector("button").className;
  materialDiv.before(createRecipeTable());
  goMaterial.after(createGoMaterial());
  materialDiv.after(createAddRecipeBlock());
}
 function createGoMaterial() {
     const a = document.createElement('a');
     const linkText = document.createTextNode("移至材料");
     a.id = "goMaterial";
     a.appendChild(linkText);
     a.title = "移至材料";
     a.href = "#recipeDiv";

  return a;
}

function createRecipeTable() {
  const recipeDiv = document.createElement("div");
  recipeDiv.id = "recipeDiv";
  recipeDiv.style.marginBottom = "1.25rem";
  const recipeH2 = materialDiv.querySelector("h2").cloneNode();
  recipeH2.innerText = "合成配方(非官方功能)";
  const recipeTable = materialDiv.querySelector(".chakra-table__container").cloneNode();
  recipeTable.innerHTML = materialDiv.querySelector(".chakra-table__container").innerHTML;
  const tableColumns = recipeTable.querySelectorAll("thead > tr > th");
  tableColumns[0].innerText = "名稱";
  tableColumns[1].innerText = "材料";
  tableColumns[1].removeAttribute("data-is-numeric");
  tableColumns[2].innerText = "操作";
  tableColumns[2].style.minWidth = "1px";
  tableColumns[2].style.width = "1px";
  //清空Table
  recipeTable.querySelector("tbody").innerHTML = "";
  elementClassname["td"] = materialDiv.querySelector("tbody > tr > td").className;
  elementClassname["tr"] = materialDiv.querySelector("tbody > tr").className;
  recipeDiv.appendChild(recipeH2);
  recipeDiv.appendChild(recipeTable);
  return recipeDiv;
}
function createAddRecipeBlock() {
  const div = document.createElement("div");
  div.style.marginBottom = "1.25rem";
  div.innerHTML = `
            <div class="${elementClassname["labelDiv"]}">選擇完原料之後輸入配方名字，可將此次選擇的原料記錄在合成配方裡面</div>
            <input id="recipeNameInput" type="text" class="${elementClassname["input"]}" style="width: 80%;">
            <button id="addRecipeBtn" type="button" class="${elementClassname["button"]}" style="width: 18%; float: right;">新增配方</button>
        `;
  return div;
}
function refreshRecipeTable() {
  const keyOfRecipeData = Object.keys(recipeData);
  if (keyOfRecipeData.length > 0) {
    let tbody = forgeContainer.querySelector("#recipeDiv");
    if (!tbody) {
      materialDiv.before(createRecipeTable());
      tbody = forgeContainer.querySelector("#recipeDiv");
    }
    tbody = tbody.querySelector("tbody");
    const recipeNamesDOM = tbody.querySelectorAll("tr > td:nth-child(1)");
    if (recipeNamesDOM) {
      recipeNamesDOM.forEach(recipeNamesDOM => {
        const index = keyOfRecipeData.indexOf(recipeNamesDOM.innerText);
        if (!!~index) {
          keyOfRecipeData.splice(index, 1);
        }
      });
    }
    // tbody.innerHTML = "";
    keyOfRecipeData.forEach(key => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                    <td class="${elementClassname["td"]}">${key}</td>
                    <td class="${elementClassname["td"]}" style="white-space: normal;">${recipeData[key]}</td>
                    <td class="${elementClassname["td"]}">
                        <button type="button" class="${elementClassname["button"]}"
                            style="height: 1.75rem; background-color: indianred;"
                        >X</button>
                    </td>
                `;
      tr.className = elementClassname["tr"];
      tr.querySelector("button").onclick = removeRecipe;
      tr.onclick = clickRecipe;
      tbody.appendChild(tr);
    });
  }
}
function clickRecipe(e) {
  if (e.target.tagName === "BUTTON") return;
  let tr = e.currentTarget;
  const recipeName = tr.querySelector("td").innerText;
  if (tr.style.backgroundColor) {
    tr.style.backgroundColor = "";
    delete filterRecipe[recipeName];
  } else {
    tr.style.backgroundColor = "#1C4532";
    filterRecipe[recipeName] = recipeData[recipeName];
  }
  const materialTable = materialDiv.querySelector("table");
  const tableData = commonUtil.getTableData(materialTable, {
    name: "名稱",
    isNumeric: false
  });
  const materials = {};
  const keyOfFilterRecipe = Object.keys(filterRecipe);
  if (keyOfFilterRecipe.length === 0) {
    tableData.forEach(row => {
      row["DOM"].removeAttribute("hidden");
    });
  } else {
    keyOfFilterRecipe.forEach(name => {
      filterRecipe[name].replaceAll(/ × [0-9]+/g, "").split("、").forEach(material => {
        if (!materials[material]) {
          materials[material] = 1;
        }
      });
    });
    tableData.forEach(row => {
      if (materials[row["名稱"]]) {
        row["DOM"].removeAttribute("hidden");
      } else {
        row["DOM"].setAttribute("hidden", "");
      }
    });
  }
}
function goTop() {
    alert('123');
}
function addRecipe() {
  const recipeNameInput = document.querySelector("#recipeNameInput");
  const recipeName = recipeNameInput.value;
  if (recipeName !== "") {
    const materials = [];
    forgeContainer.childNodes[5].childNodes[2].childNodes.forEach(materialDOM => {
      const materialName = materialDOM.innerText;
      materials.push(materialName);
      for (let i = 0; i < Number(materialName.split(" × ")[1]); i++) {
        setTimeout(() => {
          materialDOM.click();
        }, 100);
      }
    });
    recipeData = settingStorage.get("recipe");
    if (!recipeData[recipeName] && materials.length > 0) {
      recipeData[recipeName] = materials.join("、");
      settingStorage.set("recipe", recipeData);
      settingStorage.save();
      refreshRecipeTable();
      recipeNameInput.value = "";
    } else {
      alert("配方名稱與材料不可為空");
    }
  } else {
    alert("配方名稱與材料不可為空");
  }
}
function removeRecipe(e) {
  const row = e.target.parentElement.parentElement;
  const recipeName = row.querySelector("td").innerText;
  delete recipeData[recipeName];
  settingStorage.set("recipe", recipeData);
  settingStorage.save();
  row.remove();
}
function forgeClick() {
  selectedMaterials.length = 0;
  forgeContainer.querySelectorAll("p + div > div").forEach(div => {
    selectedMaterials.push(div.textContent.replace(" × ", "x"));
  });
  equipmentName = forgeContainer.querySelector("input").value;
}
var _default = Init;
exports.default = _default;

},{"../storage/forge":7,"../storage/setting":9,"../utils/common":10,"../utils/event":11}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const commonUtil = require("../utils/common");
const settingStorage = require("../storage/setting");
const eventUtil = require("../utils/event");
const uiUtil = require("../utils/ui");
let currentZoneLevel, filter;
function Init() {
  commonUtil.bindEvent("/hunt", () => {
    const huntTabButton = document.querySelector("button.chakra-tabs__tab[data-index='0']");
    const playerListTabButton = document.querySelector("button.chakra-tabs__tab[data-index='1']");
    if (huntTabButton && playerListTabButton) {
      commonUtil.clearTimers();
      huntTabButton.onclick = registerHuntLogOberserverAndHideRestButtons;
      playerListTabButton.onclick = registerPlayerListObserverAndCreateSearchPlayerUI;
      currentZoneLevel = getCurrentZoneLevel();
      if (!localStorage.hunt_tabIndex || localStorage.hunt_tabIndex === "0") {
        registerHuntLogOberserverAndHideRestButtons();
      } else if (localStorage.hunt_tabIndex === "1") {
        registerPlayerListObserverAndCreateSearchPlayerUI();
      }
      eventUtil.subscribeApi("hunt", apiEvent);
      eventUtil.subscribeApi("boss", apiEvent);
    }
  });
}
function apiEvent(data) {
  if (data?.statusCode === 400) return;

  //百分比血體
  // if(settingStorage.get("GENERAL.HUNT_STATUS_PERCENT")){
  //     data.profile.fullHp += ` (${Math.floor(data.profile.hp / data.profile.fullHp * 100)}%)`
  //     data.profile.fullSp += ` (${Math.floor(data.profile.sp / data.profile.fullSp * 100)}%)`
  // }

  //爬層提示
  if (currentZoneLevel === undefined) currentZoneLevel = data.profile.huntStage;
  if (data.profile.huntStage > currentZoneLevel) {
    data.messages.push({
      m: `爬到了${data.profile.zoneName} ${data.profile.huntStage}`,
      s: "info"
    });
  }
  currentZoneLevel = data.profile.huntStage;

  //血量耗損提示
  data.meta.teamA.forEach(player => {
    const {
      name,
      hp
    } = player;
    const index = data.messages.findIndex(msg => msg.m.match(`^${name}還有 [0-9]+ 點HP`));
    if (!!~index) {
      const huntHp = Number(commonUtil.regexGetValue(`${name}還有 ([0-9]+) 點HP`, data.messages[index].m)[0]);
      if (hp - huntHp !== 0) {
        if (hp - huntHp > 0) {
          data.messages[index].m += `(-${hp - huntHp})`;
        } else {
          data.messages[index].m += `(+${huntHp - hp})`;
        }
      }
    }
  });

  //體力耗損提示
  const nickname = data.profile.nickname;
  const metaData = data.meta.teamA.find(player => player.name === nickname);
  const index = data.messages.findIndex(msg => msg.m.match(`^${nickname}還有 [0-9]+ 點HP`));
  if (!!~index) {
    const msg = {
      m: "",
      s: "subInfo"
    };
    if (metaData.sp - data.profile.sp > 0) {
      msg.m = `${nickname}還有 ${data.profile.sp} 點體力(-${metaData.sp - data.profile.sp})`;
    } else {
      msg.m = `${nickname}還有 ${data.profile.sp} 點體力(+${data.profile.sp - metaData.sp})`;
    }
    data.messages.splice(index + 1, 0, msg);
  }
  let findEquipmentBroken = false;
  let settingChanged = false;
  const playerNames = data.meta.teamA.map(player => player.name).join("|");
  data.messages.forEach(message => {
    //裝備損壞
    if (/損壞了$/.test(message.m)) {
      findEquipmentBroken = true;
    }

    //物品過濾器
    if (/獲得了.*/.test(message.m)) {
      const itemData = message.m.replace(/.*獲得了/, "").split(" × "); // .replace(/\ \×\ [0-9]+/, "")
      const itemName = itemData[0];
      const itemQuatity = itemData.length > 1 ? Number(itemData[1]) : 1;
      commonUtil.itemApplyFilter(itemName, {
        playSound: true
      });

      //狩獵記錄
      if (settingStorage.get("ITEM_RECORD.ENABLE")) {
        const pattern = `(${playerNames}|)獲得了(.*)$`;
        const regexResult = commonUtil.regexGetValue(pattern, message.m);
        if (!/ [0-9]+ 點.*(經驗值|熟練度)/.test(regexResult[1])) {
          //單人狩獵判斷
          const currentPlayerName = regexResult[0] === "" ? nickname : regexResult[0];
          const records = settingStorage.get("ITEM_RECORD.RECORDS");
          if (!records[currentPlayerName]) records[currentPlayerName] = {};
          if (!records[currentPlayerName][itemName]) {
            records[currentPlayerName][itemName] = itemQuatity;
          } else {
            records[currentPlayerName][itemName] += itemQuatity;
          }
          settingStorage.set("ITEM_RECORD.RECORDS", records);
          settingChanged = true;
        }
      }
    }
  });
  settingStorage.save();

  //裝備損壞超級提示
  if (findEquipmentBroken && settingStorage.get("GENERAL.RED_BACKBROUND_WHEN_EQUIPMENT_BROKEN")) {
    document.querySelector("#__next").style.backgroundColor = "var(--chakra-colors-red-500)";
  } else {
    document.querySelector("#__next").style.backgroundColor = "";
  }

   if (findEquipmentBroken) {
    const equipmentWarnEncode = settingStorage.get("WARNING.EQUIPMENT_BROKEN_ENCODE")
    console.log(equipmentWarnEncode);
    try {
        filter = JSON.parse(decodeURIComponent(atob(equipmentWarnEncode)));
    } catch (e) {
        // console.error("parse error", e);
        filter = [];
    }
    console.log(filter);
    if (filter.length > 0) {
        const audio = new Audio(filter[0].sound);

        audio.volume = filter[0].volume;
        audio.play().catch((err) => console.error(err));
    }
  }
}
function getCurrentZoneLevel() {
  const currentZone = document.querySelector("[zones]").textContent.split("：")[1].trim();
  const reglevel = commonUtil.regexGetValue("([0-9]+)", currentZone);
  if (reglevel.length) {
    return Number(reglevel[0]);
  }
  return 0;
}
function createSearchPlayerUI() {
  if (document.querySelector("#searchPlayerName")) return;
  const playerListContainer = document.querySelector("[tabindex='0'] > .chakra-container > .css-0");
  const [div, input] = uiUtil.createSearchUI("搜尋玩家", "searchPlayerName");
  input.onchange = () => {
    const name = input.value;
    document.querySelectorAll("[tabindex='0'] > .chakra-container > .css-0 > div > div").forEach(row => {
      checkPlayerName(row, name);
    });
  };
  playerListContainer.querySelector("p").after(div);
}
function registerHuntLogOberserverAndHideRestButtons() {
  // console.log("Register");
  if (settingStorage.get("GENERAL.HIDE_REST_BUTTON")) hideRestButtons();
  commonUtil.clearObservers();
  const huntLogContainer = document.querySelector("[tabindex='0'] > .chakra-container").lastChild;
  const observer = new MutationObserver(beautifyHuntLog);
  observer.observe(huntLogContainer, {
    childList: true
  });
  commonUtil.addObserver(observer);
  beautifyHuntLog();
}
function registerPlayerListObserverAndCreateSearchPlayerUI() {
  // console.log("Register");
  createSearchPlayerUI();
  commonUtil.clearObservers();
  const playerListContainer = document.querySelector("[tabindex='0'] > .chakra-container > .css-0");
  const observer = new MutationObserver(playerListRefreshEvent);
  observer.observe(playerListContainer, {
    childList: true,
    subtree: true
  });
  commonUtil.addObserver(observer);
  playerListRefreshEvent();
}
function hideRestButtons() {
  document.querySelectorAll("[tabindex='0'] > .chakra-container > div > button").forEach(button => {
    if (button.textContent === "休息") button.style.display = "none"; //button.style.marginLeft = "auto";
    // if(button.textContent === "清空記錄") button.style.marginLeft = "var(--chakra-space-2)";
  });
}

function beautifyHuntLog() {
  if (localStorage.hunt_tabIndex === "1") return;
  const huntLogContainer = document.querySelector("[tabindex='0'] > .chakra-container " // > .css-0"
  ).lastChild;
  huntLogContainer.childNodes.forEach(node => {
    const lines = node.querySelectorAll("[data-line-number]");
    if (lines.length > 1 && !node.querySelector(".information")) {
      node.style.justifyContent = "space-between";
      const beforeHuntInformations = Array.from(node.childNodes[1].childNodes[0].childNodes);
      const profiles = [];
      const equipments = [];
      let playerInformationClassname;
      beforeHuntInformations.forEach(information => {
        if (!playerInformationClassname) {
          playerInformationClassname = information.childNodes[0].childNodes[0].className;
        }
        if (information.childNodes[0].childNodes[0].className === playerInformationClassname) {
          const informationLines = Array.from(information.childNodes);
          //get name
          const profileText = informationLines[0].innerText;
          profiles.push({
            name: profileText.split("\n")[0],
            hp: commonUtil.regexGetValue("HP: ([0-9]+)", profileText)[0],
            die: false
          });
          // profiles.push(informationLines[0].innerText.split("\n")[0]);
          informationLines.shift();
          informationLines.forEach(information => {
            const equipmentData = information.innerText;
            const equipment = {
              name: commonUtil.regexGetValue("的(.*)（", equipmentData)[0],
              durability: Number(commonUtil.regexGetValue("耐([0-9]+)", equipmentData)[0]),
              costDurablilty: 9999999,
              msgClassname: ""
            };
            equipments.push(equipment);
          });
        }
      });
      const informationDiv = document.createElement("div");
      informationDiv.className = "information";
      informationDiv.style.marginLeft = "0.5em";
      let battleLogEnd = false;
      lines.forEach(line => {
        const profile = profiles.find(profile => line.innerText === `${profile.name}被擊殺死亡了`);
        if (profile) {
          profile.die = true;
          informationDiv.appendChild(line);
        }

        //單人戰鬥結束檢查
        if (!!~line.innerText.indexOf("點HP")) {
          battleLogEnd = true;
          //組隊戰鬥結束檢查
        } else if (profiles.filter(profile => !profile.die).length === 0) {
          battleLogEnd = true;
        }
        if (battleLogEnd) {
          //血量耗損計算
          profiles.forEach(profile => {
            const hpRegexMatch = commonUtil.regexGetValue(`${profile.name}還有 ([0-9]+) 點HP`, line.innerText);
            if (hpRegexMatch.length > 0) {
              const currentHp = Number(hpRegexMatch[0]);
              const costHp = profile.hp - currentHp;
              if (costHp / profile.hp >= settingStorage.get("WARNING.HP") / 100) {
                line.style.color = settingStorage.get("COLOR.WARNING");
              }
            }
            const spRegexMatch = commonUtil.regexGetValue(`${profile.name}還有 ([0-9]+) 點體力`, line.innerText);
            if (spRegexMatch.length) {
              const currentSp = Number(spRegexMatch[0]);
              if (currentSp < settingStorage.get("WARNING.SP")) {
                line.style.color = settingStorage.get("COLOR.WARNING");
              }
            }
          });
          //計算耐久
          let findEquipment = false;
          let equipmentBroken = false;
          equipments.forEach(equipment => {
            //同名武器耐久篩選
            if (equipment.costDurablilty === 9999999 && !findEquipment) {
              const matchArray = commonUtil.regexGetValue(`${equipment.name}耗損了 ([0-9]+) 點耐久`, line.innerText);
              if (matchArray.length > 0) {
                findEquipment = true;
                equipment.msgClassname = line.className;
                equipment.costDurablilty = Number(matchArray[0]);
              }
              if (RegExp(`${equipment.name}損壞了`).test(line.innerText)) {
                equipment.costDurablilty = equipment.durability;
                findEquipment = true;
                equipmentBroken = true;
              }
            }
          });

          //武器損壞
          if (equipmentBroken) {
            informationDiv.insertBefore(line, informationDiv.firstChild);
          } else {
            informationDiv.appendChild(line);
          }

          //爬層提示
          if (/^爬到了(.*)/.test(line.innerText)) {
            line.style.color = settingStorage.get("COLOR.ZONE_LEVEL");
            informationDiv.insertBefore(line, informationDiv.firstChild);
          }
          if (/獲得了.*/.test(line.innerText)) {
            const itemName = line.innerText.replace(/.*獲得了/, "").replace(/\ \×\ [0-9]+/, "");
            commonUtil.itemApplyFilter(itemName, {
              highlight: true,
              dom: line
            });
          }
        }
      });
      //裝備耐久提示
      equipments.forEach(equipment => {
        const calcDurablilty = equipment.durability - equipment.costDurablilty;
        if (calcDurablilty > 0) {
          const equipmentMsgDiv = document.createElement("div");
          equipmentMsgDiv.className = equipment.msgClassname;
          equipmentMsgDiv.innerText = `${equipment.name}還有 ${calcDurablilty} 點耐久`;
          equipmentMsgDiv.style.color = calcDurablilty <= settingStorage.get("WARNING.EQUIPMENT") ? settingStorage.get("COLOR.WARNING") : settingStorage.get("COLOR.TIPS");
          informationDiv.appendChild(equipmentMsgDiv);
        }
      });
      // if(currentZoneLevel && getCurrentZoneLevel() > currentZoneLevel){
      //     const zoneLevelChangeDiv = document.createElement("div");
      //     zoneLevelChangeDiv.style.display = "flex";
      //     zoneLevelChangeDiv.style.color = settingStorage.get("COLOR.ZONE_LEVEL");
      //     zoneLevelChangeDiv.innerText = `爬到了${document.querySelector("[zones]").textContent.split("：")[1]}`
      //     informationDiv.insertBefore(zoneLevelChangeDiv, informationDiv.firstChild);
      // }
      // currentZoneLevel = getCurrentZoneLevel();

      const leftDiv = document.createElement("div");
      const rightDiv = document.createElement("div");
      leftDiv.style.display = "flex";
      rightDiv.style.alignSelf = "flex-start";
      leftDiv.appendChild(node.childNodes[0]);
      if (commonUtil.isMobileDevice()) {
        informationDiv.style.marginLeft = "";
        if (settingStorage.get("GENERAL.MOBILE_HUNT_REPORT")) {
          informationDiv.insertBefore(node.childNodes[0].childNodes[0], informationDiv.childNodes[0]);
          node.childNodes[0].remove();
        } else {
          informationDiv.insertBefore(node.childNodes[0], informationDiv.childNodes[0]);
        }
        leftDiv.appendChild(informationDiv);
      } else {
        leftDiv.appendChild(node.childNodes[0]);
        rightDiv.appendChild(informationDiv);
      }
      node.appendChild(leftDiv);
      if (!commonUtil.isMobileDevice()) node.appendChild(rightDiv);
    }
  });
}
function checkPlayerName(row, name) {
  //檢查是否為體力低下的提示row
  if (new RegExp("^[0-9]{2}/[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$").test(row.outerText)) return;
  const playerName = row?.childNodes[1]?.childNodes[0]?.childNodes[1]?.childNodes[0].textContent;
  if (playerName && !!~playerName.indexOf(name)) {
    row.hidden = false;
  } else {
    row.hidden = true;
  }
}
function playerListRefreshEvent() {
  document.querySelectorAll("[tabindex='0'] > .chakra-container > .css-0 > div > div").forEach(row => {
    //搜尋玩家
    checkPlayerName(row, document.querySelector("#searchPlayerName").value);
    //禁用壞按鍵
    if (settingStorage.get("GENERAL.DISABLE_BAD_BUTTON")) {
      const menuButtons = row.querySelectorAll("[role='menu'] > button");
      menuButtons.forEach(button => {
        if (["搶劫", "我要超渡你"].includes(button.textContent)) {
          button.disabled = true;
        }
      });
    }

    // }
  });
}
var _default = Init;
exports.default = _default;

},{"../storage/setting":9,"../utils/common":10,"../utils/event":11,"../utils/ui":12}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const commonUtil = require("../utils/common");
const settingStorage = require("../storage/setting");
const eventUtil = require("../utils/event");
const forgeStorage = require("../storage/forge");
const globalVarsStorage = require("../storage/globalVars");
const uiUtil = require("../utils/ui");
const quality = {
  傳說: [2.3, 0.82],
  神話: [2.1, 0.84],
  史詩: [2.0, 0.85],
  完美: [1.85, 0.87],
  頂級: [1.65, 0.88],
  精良: [1.5, 0.9],
  高級: [1.33, 0.93],
  上等: [1.15, 0.96],
  普通: [1, 1],
  次等: [0.9, 1.01],
  劣質: [0.8, 1.02],
  破爛: [0.7, 1.03],
  垃圾般: [0.55, 1.06],
  屎一般: [0.4, 1.1]
};
const tablesColumns = {};
const equipmentFilter = {
  color: "",
  type: ""
};
function Init() {
  commonUtil.bindEvent(["/items", "/market"], () => {
    //var targetContainer = document.querySelector(".chakra-tabs").childNodes[2];
    const tables = document.querySelectorAll("table");
    const targetContainer = document.querySelector(".chakra-tabs");
    if (!tables || !targetContainer) return;
    if (location.pathname === "/market" && tables.length < 3) {
      return;
    }
    commonUtil.clearTimers();
    const observer = new MutationObserver(e => {
      if (e.length === 2 && e[1].addedNodes.length && e[1].addedNodes[0].innerHTML !== '') {
        if (!settingStorage.get("GENERAL.DISABLE_TRUE_STATS")) onItemsDetail(e[1].addedNodes[0].childNodes[0].childNodes);
        if (location.pathname === "/market" && !settingStorage.get("GENERAL.DISABLE_MARKET_FUNCTION")) createMarketButtons(e[1].addedNodes[0].childNodes[0].childNodes);
      }
    });
    ;
    observer.observe(targetContainer, {
      subtree: false,
      childList: true
    });
    commonUtil.addObserver(observer);
    if (!document.querySelector("#searchPlayerName") && location.pathname === "/market") {
      const [div, input] = uiUtil.createSearchUI("搜尋販賣者", "searchPlayerName");
      // targetContainer.before(targetContainer.firstChild, div);
      div.querySelector("label").style.width = "96px";
      div.style.maxWidth = "800px";
      div.style.marginLeft = "auto";
      div.style.marginRight = "auto";
      div.style.width = "95%";
      document.querySelector("[role=tablist]").before(div);
      ["equipments", "mines", "items"].forEach(category => {
        eventUtil.subscribeApi(`trades?category=${category}`, data => {
          data.trades = data.trades.filter(trade => trade.sellerName.match(input.value));
        });
      });
    }
    ;
    const types = ["equipments", "mines", "items"];
    tables.forEach(table => {
      const type = types.shift();
      const tableId = `table${Object.keys(tablesColumns).length}-${type}`;
      table.id = tableId;
      tablesColumns[tableId] = commonUtil.getTableColumns(table, sortTable);
      if (location.pathname === "/items") {
        const tableData = commonUtil.getTableData(table, {
          name: "類型",
          isNumeric: false
        }, tablesColumns[tableId]);
        const types = [];
        tableData.forEach(row => {
          if (!types.includes(row["類型"])) types.push(row["類型"]);
        });
        createTypeFilter(table, types);
        createQuickFilter(table);
      } else if (location.pathname === "/market") {
        const tbody = table.querySelector("tbody");
        function highlightRow() {
          const rows = tbody.querySelectorAll("[role=row]");
          rows.forEach(row => {
            row.style.border = "";
          });
          const highlightRowData = globalVarsStorage.get("HIGHTLIGHT_ROW");
          highlightRowData[type].forEach(rowIndex => {
            if (rows.length > 0) {
              // console.log(tbody.childNodes, rowIndex, tbody.childNodes[rowIndex])
              try {
                rows[rowIndex].style.border = `solid ${settingStorage.get("COLOR.MARKET_WATCH")}`;
              } catch (e) {
                console.error(rowIndex, rows);
              }
            }
          });
        }
        const observer = new MutationObserver(highlightRow);
        // tbody.firstChild.remove();
        observer.observe(tbody, {
          subtree: false,
          childList: true
        });
        commonUtil.addObserver(observer);
        tbody.appendChild(document.createElement("tr"));
        // highlightRow();
      }
    });

    // document.querySelector(".chakra-container > div > button")?.click()
  });
}

function filterTable(table) {
  // if(equipmentFilter.color === "" && equipmentFilter.type === "") return;

  const tableRow = table.querySelectorAll("tbody > tr");
  tableRow.forEach(tr => {
    const rowColor = getComputedStyle(tr.querySelector("td:nth-child(1) > div")).borderColor;
    if (table.filter.color === "" || table.filter.color === rowColor) {
      tr.style.display = "";
    } else {
      tr.style.display = "none";
      return;
    }
    if (table.filter.type === undefined) return;
    const equipmentType = tr.querySelector("td:nth-child(2)").textContent;
    if (table.filter.type === "" || table.filter.type === equipmentType) {
      tr.style.display = "";
    } else {
      tr.style.display = "none";
      return;
    }
  });
}
function createQuickFilter(table) {
  if (document.querySelectorAll(".quick-filter-container").length === 3) return;
  const quickFilterContainer = document.createElement("div");
  quickFilterContainer.classList.add("quick-filter-container");
  quickFilterContainer.innerText = "快篩：";
  if (table.filter) {
    table.filter.color = "";
  } else {
    table.filter = {
      color: ""
    };
  }
  const colors = ["red", "blue", "cyan", "green", "teal", "orange", "yellow", "pink", "purple", "gray"];
  colors.forEach(color => {
    const circle = document.createElement("div");
    circle.classList.add(`circle-${color}`);
    circle.onclick = e => {
      let lastClickCircle;
      circle.parentNode.querySelectorAll("div").forEach(div => {
        if (div.style.backgroundColor !== "") lastClickCircle = div;
        div.style.backgroundColor = "";
      });
      let targetColor = "";
      if (lastClickCircle !== circle) {
        circle.style.backgroundColor = `var(--chakra-colors-${color}-500)`;
        targetColor = color === "gray" ? "rgba(0, 0, 0, 0)" : getComputedStyle(circle).backgroundColor;
      }
      equipmentFilter.color = targetColor;
      table.filter.color = targetColor;
      filterTable(table);
      // table.querySelectorAll("tr > td:nth-child(1) > div").forEach(div => {
      //     const tr = div.parentElement.parentElement;
      //     if(targetColor === "" || getComputedStyle(div).borderColor === targetColor){
      //         tr.style.display = "";
      //     }else{
      //         tr.style.display = "none";
      //     }
      // });
    };

    quickFilterContainer.appendChild(circle);
  });
  table.before(quickFilterContainer);
}
function createTypeFilter(table, types) {
  if (document.querySelector(`.type-filter-container`)) return;
  const typeFilterContainer = document.createElement("div");
  typeFilterContainer.classList.add("type-filter-container");
  typeFilterContainer.innerText = "類型：";

  // const types = ["單手劍", "細劍", "短刀", "單手錘", "盾牌", "雙手劍", "太刀", "雙手斧", "長槍", "大衣", "盔甲", "戒指"];
  table.filter = {
    type: ""
  };
  types.forEach(type => {
    const choice = document.createElement("div");
    const circle = document.createElement("div");
    choice.classList.add(`choice`);
    circle.classList.add("circle");
    choice.appendChild(circle);
    choice.append(type);
    choice.onclick = e => {
      if (!e.target.matches(".circle")) return;
      // console.log(choice, circle);
      let lastClickCircle;
      choice.parentNode.querySelectorAll("div > .circle").forEach(div => {
        if (div.style.backgroundColor !== "") lastClickCircle = div;
        div.style.backgroundColor = "";
      });
      table.filter.type = "";
      if (lastClickCircle !== circle) {
        circle.style.backgroundColor = `var(--chakra-colors-gray-500)`;
        table.filter.type = type;
      }
      filterTable(table);
    };
    typeFilterContainer.appendChild(choice);
  });
  table.before(typeFilterContainer);
}
function sortTable(e) {
  const tableDOM = e.target.parentElement.parentElement.parentElement;
  const sortClassDOM = tableDOM.querySelector(".sort");
  if (["攻擊", "防禦", "耐久"].includes(e.target.innerText) && location.pathname === "/items") {
    if (sortClassDOM && sortClassDOM.innerText.match("↓|↑")) {
      sortClassDOM.innerText = sortClassDOM.innerText.slice(0, -1);
      sortClassDOM.classList.remove("sort");
    }
    return;
  }
  ;
  let sortingMethod = "↓";
  if (sortClassDOM) {
    if (sortClassDOM === e.target) {
      sortingMethod = !!~sortClassDOM.innerText.indexOf("↓") ? "↑" : "↓";
    }
    sortClassDOM.classList.remove("sort");
    sortClassDOM.innerText = sortClassDOM.innerText.slice(0, -1);
  }
  const sortType = e.target.innerText;
  const tableColumns = tablesColumns[tableDOM.id];
  const targetColumn = tableColumns.find(column => column.name === sortType);
  const tbodyDOM = tableDOM.querySelector("tbody");
  if (targetColumn.isNumeric) {
    const data = commonUtil.getTableData(tableDOM, targetColumn, tableColumns);
    let sortedData = data.sort((a, b) => a[sortType] - b[sortType]);
    if (sortingMethod === "↑") {
      sortedData = sortedData.reverse();
    }
    sortedData.forEach(item => {
      tbodyDOM.appendChild(item.DOM);
    });
    e.target.innerText += sortingMethod;
    e.target.classList.add("sort");
  } else {
    const data = {};
    tbodyDOM.querySelectorAll("tr[role=row]").forEach(rowDOM => {
      const index = tableColumns.indexOf(targetColumn);
      const key = rowDOM.childNodes[index].innerText;
      if (data[key]) {
        data[key].push(rowDOM);
      } else {
        data[key] = [rowDOM];
      }
    });
    Object.keys(data).forEach(key => {
      data[key].forEach(rowDOM => {
        tbodyDOM.appendChild(rowDOM);
      });
    });
  }
}
function onItemsDetail(containerNodes) {
  if (containerNodes[1].tagName === "H2") return;
  const targetDom = containerNodes[1];
  if (targetDom.classList.contains("addedTrueStat")) return;
  let equipmentNameMatch = commonUtil.regexGetValue("(傳說|神話|史詩|完美|頂級|精良|高級|上等|普通|次等|劣質|破爛|垃圾般|屎一般)的 (.*)", targetDom.querySelector("h2").innerText);
  if (equipmentNameMatch.length < 2) return console.error("quality error");

  //replace把強化次數移除
  const equipmentName = equipmentNameMatch[1].replace(/\ \+\ [0-9]+/, "");
  const ratio = quality[equipmentNameMatch[0]];
  if (!ratio) return console.error("ratio error");

  //市集的裝備顯示有較多資訊 故childNodes在7
  let statDom, forgeDataDom;
  if (targetDom.childNodes.length >= 6 && location.pathname === "/market") {
    forgeDataDom = targetDom.querySelector("hr + div");
    statDom = targetDom.childNodes[5].childNodes[0];
  } else {
    forgeDataDom = targetDom.childNodes[2];
    statDom = targetDom.querySelector("hr + div").childNodes[0];
  }
  const [atk, def, luck, kg, dur] = statDom.innerHTML.split("<br>").map((s, index) => {
    //有強化的裝備
    let value = commonUtil.regexGetValue("([0-9]+) \\(([+-]{1}[0-9]+)\\)", s);
    if (value.length === 2) {
      return Number(value[0]) - Number(value[1]);
    } else {
      //耐久數值處理
      if (index === 4) {
        value = commonUtil.regexGetValue("[0-9]+ / ([0-9]+)", s);
      } else {
        value = commonUtil.regexGetValue("([0-9]+)", s);
      }
      //一般情況
      if (value.length > 0) {
        return Number(value[0]);
      }
      console.error("parse stat error");
      return 0;
    }
  });
  const trueStats = [atk, def, luck].map(num => {
    return (num / ratio[0]).toFixed(2);
  });
  trueStats.push((kg / ratio[1]).toFixed(2));
  trueStats.push((dur / ratio[0]).toFixed(2));
  const colorSpan = document.createElement("span");
  colorSpan.style.color = settingStorage.get("COLOR.TRUE_STATS");
  const newStatHTML = statDom.innerHTML.split("<br>").map((s, index) => {
    colorSpan.innerText = `(${trueStats[index]})`;
    return `${s} ${colorSpan.outerHTML}`;
  }).join("<br>");
  const forger = forgeDataDom.childNodes[0].textContent.replace("鍛造者：", "");
  const forgeTime = new Date(`${new Date().getFullYear()} ${forgeDataDom.childNodes[1].textContent.replace("鍛造時間：", "")}`);
  forgeTime.setSeconds(0);
  forgeTime.setMilliseconds(0);
  const base64 = btoa(encodeURIComponent(`${forgeTime.getTime()},${equipmentName},${forger}`));
  let forgeMaterial = "";
  if (forgeStorage.get(base64)) {
    forgeMaterial = `鍛造材料:${forgeStorage.get(base64)}\n`;
  }
  targetDom.classList.add("addedTrueStat");
  statDom.innerHTML = newStatHTML;
  const div = document.createElement("div");
  div.innerText = `${forgeMaterial}括號內原始素質僅供參考，有研究出更好的算法可以聯絡插件作者`;
  targetDom.appendChild(targetDom.querySelector("hr").cloneNode());
  targetDom.appendChild(div);
}
function createMarketButtons(containerNodes) {
  let seller = "";
  //道具or礦物
  if (containerNodes[1].tagName === "H2") {
    //販賣者：XXXX
    if (!containerNodes[3]?.childNodes[1]?.childNodes[1]?.textContent.startsWith("販賣者：")) return;
    seller = containerNodes[3]?.childNodes[1]?.childNodes[1]?.textContent.substring(4);
  } else {
    //裝備類
    // seller =  containerNodes[1].childNodes[3].childNodes[0].textContent.substring(4)
    if (!containerNodes[1].querySelector("h2 + div")?.childNodes[1]?.childNodes[1]?.textContent.startsWith("販賣者：")) return;
    seller = containerNodes[1].querySelector("h2 + div").childNodes[1].childNodes[1].textContent.substring(4);
  }
  const buttonContainer = containerNodes[containerNodes.length - 1];
  const buyButton = buttonContainer.querySelector("button");
  if (buyButton === null || settingStorage.get("MARKET.WATCH_LIST").includes(seller) || settingStorage.get("MARKET.BLACK_LIST").includes(seller)) return;
  const watchButton = buyButton.cloneNode();
  const blacklistButton = buyButton.cloneNode();
  watchButton.style.marginRight = "0.5rem";
  watchButton.innerText = "關注賣家";
  if (watchButton.getAttribute("disabled") === "") watchButton.removeAttribute("disabled");
  watchButton.onclick = () => {
    let list = settingStorage.get("MARKET.WATCH_LIST");
    watchButton.remove();
    blacklistButton.remove();
    if (!list.includes(seller)) {
      list.push(seller);
      settingStorage.set("MARKET.WATCH_LIST", list);
      settingStorage.save();
    }
  };
  blacklistButton.innerText = "黑名單賣家";
  blacklistButton.style.backgroundColor = settingStorage.get("COLOR.WARNING");
  blacklistButton.style.marginRight = "0.5rem";
  if (blacklistButton.getAttribute("disabled") === "") blacklistButton.removeAttribute("disabled");
  blacklistButton.onclick = () => {
    watchButton.remove();
    blacklistButton.remove();
    let list = settingStorage.get("MARKET.BLACK_LIST");
    if (!list.includes(seller)) {
      list.push(seller);
      settingStorage.set("MARKET.BLACK_LIST", list);
      settingStorage.save();
    }
  };
  buyButton.before(watchButton);
  watchButton.before(blacklistButton);
}
var _default = Init;
exports.default = _default;

},{"../storage/forge":7,"../storage/globalVars":8,"../storage/setting":9,"../utils/common":10,"../utils/event":11,"../utils/ui":12}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  profile: require("./profile").default,
  hunt: require("./hunt").default,
  items: require("./items").default,
  forge: require("./forge").default
};
exports.default = _default;

},{"./forge":2,"./hunt":3,"./items":4,"./profile":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const commonUtil = require("../utils/common");
function Init() {
  commonUtil.bindEvent("/profile", () => {
    const actionContainer = document.querySelectorAll(".chakra-container")[2];
    if (actionContainer) {
      actionContainer.querySelector("div > button:nth-child(3)").onclick = calcTime;
      commonUtil.clearTimers();
    }
  });
}
function calcTime() {
  const actionContainer = document.querySelectorAll(".chakra-container")[2];
  const actionLogContainer = actionContainer.querySelector("div > :nth-child(12)");
  if (actionLogContainer.tagName === "HR") return;
  const actionTime = actionContainer.querySelector("div > span").innerText;
  const observer = new MutationObserver(function (e) {
    const row = actionLogContainer.querySelector("div:nth-child(1) > div:nth-child(2) > div");
    // console.log("row", row, row.innerText);
    row.innerText += `    ${actionTime}`;
    setTimeout(() => {
      const msgArray = JSON.parse(localStorage.generalActionMessages);
      // console.log("msgArray", msgArray);
      msgArray[0].messages[0].m = row.innerText;
      localStorage.generalActionMessages = JSON.stringify(msgArray);
    }, 1500);
    observer.disconnect();
    // console.log("disconnnnnnnnnnnn");
  });

  observer.observe(actionLogContainer, {
    subtree: true,
    childList: true,
    characterData: true
  });
  commonUtil.addObserver(observer);
}
var _default = Init;
exports.default = _default;

},{"../utils/common":10}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteIfKeyExist = deleteIfKeyExist;
exports.get = get;
exports.load = load;
exports.save = save;
exports.set = set;
const FORGE_STORAGE_NAME = "forgeLog";
let FORGE_LOG = load();
function set(key, value) {
  FORGE_LOG[key] = value;
}
function get(key) {
  return FORGE_LOG[key] ?? "";
}
function load() {
  if (localStorage[FORGE_STORAGE_NAME]) {
    try {
      return JSON.parse(localStorage[FORGE_STORAGE_NAME]);
    } catch (e) {
      console.error("load forge log failed", e);
    }
  }
  return {};
}
function save() {
  localStorage[FORGE_STORAGE_NAME] = JSON.stringify(FORGE_LOG);
}
function deleteIfKeyExist(key) {
  if (FORGE_LOG[key]) {
    delete FORGE_LOG[key];
    save();
  }
}

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.set = set;
const globalVars = {
  VERSION: "1.37.3",
  LATEST_VERSION: "",
  UPDATE_CHECK_INTERVAEL: 3600,
  HIGHTLIGHT_ROW: {
    equipments: [],
    mines: [],
    items: []
  }
};
function get(key) {
  return globalVars[key];
}
function set(key, value) {
  globalVars[key] = value;
}

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.save = save;
exports.set = set;
const commonUtil = require("../utils/common");
const STORAGE_NAME = "SGO_Interface_Optimization";
const DEFAULT_SETTINGS = {
  COLOR: {
    TIPS: "#9AE6B4",
    //一般提示
    WARNING: "#FC8181",
    //紅色警告
    TRUE_STATS: "#FEEBC8",
    //裝備原始素質顏色
    ZONE_LEVEL: "#FF95CA",
    //樓層切換的顏色
    MARKET_WATCH: "#ffff00",
    // 關注中的訂單
    EXP_BAR_BACKGROUND: "#57595b",
    EXP_BAR_FILL: "#aadc1e",
    EXP_BAR_FONT: "#fbfbfb"
  },
  WARNING: {
    EQUIPMENT: 20,
    //裝備低於多少耐久
    HP: 60,
    //血量單次耗損幾成
    SP: 100 //體力低於多少
  },

  GENERAL: {
    DISABLE_BAD_BUTTON: false,
    //將 false 改成 true，即可禁用"搶劫"與"我要超渡你"按鍵
    DISABLE_TRUE_STATS: false,
    DISABLE_MARKET_FUNCTION: true,
    HIDE_REST_BUTTON: false,
    MOBILE_WRAP_NAVBAR: false,
    MOBILE_HUNT_REPORT: true,
    HUNT_STATUS_PERCENT: false,
    SHOW_EXP_BAR: false,
    RED_BACKBROUND_WHEN_EQUIPMENT_BROKEN: false,
    FORGE_NOTIFICATION: false,
    EXP_BAR_FILL_BACKGROUND_IMAGE_URL: "",
    BACKGROUND_IMAGE_URL: "",
    ITEM_FILTER_ENCODE: ""
  },
  MARKET: {
    WATCH_LIST: [],
    BLACK_LIST: []
  },
  ITEM_RECORD: {
    ENABLE: false,
    APPLY_FILTER: false,
    RECORDS: {}
  },
  UPDATE: {
    LAST_CHECK_TIMESTAMP: 0,
    LATEST_VERSION: ""
  },
  recipe: {}
};
let SETTINGS = load();
function load() {
  if (localStorage[STORAGE_NAME]) {
    try {
      return JSON.parse(localStorage[STORAGE_NAME]);
    } catch (e) {}
  }
  return structuredClone(DEFAULT_SETTINGS);
}
function save() {
  localStorage[STORAGE_NAME] = JSON.stringify(SETTINGS);
}
function get(key) {
  //檢查是否有新的類別設定或缺少類別設定
  if (key.split(".").length === 1) {
    Object.keys(DEFAULT_SETTINGS).forEach(classKey => {
      // if(getObjectValueByRecursiveKey(SETTINGS, `${key}.${k}`) !== undefined) return;
      // commonUtil.setObjectValueByRecursiveKey(SETTINGS, `${key}.${k}`, DEFAULT_SETTINGS[key][k])
      // SETTINGS[key][k] = DEFAULT_SETTINGS[key][k];

      if (SETTINGS[classKey] !== undefined) return;
      SETTINGS[classKey] = structuredClone(DEFAULT_SETTINGS[classKey]);
      save();
    });
  }
  if (commonUtil.getObjectValueByRecursiveKey(SETTINGS, key) === null) {
    // commonUtil.setObjectValueByRecursiveKey(SETTINGS, key, commonUtil.getObjectValueByRecursiveKey(structuredClone(DEFAULT_SETTINGS), key))
    set(key, commonUtil.getObjectValueByRecursiveKey(structuredClone(DEFAULT_SETTINGS), key));
    // SETTINGS[key] = commonUtil.getObjectValueByRecursiveKey(structuredClone(DEFAULT_SETTINGS), key)
    save();
  } else if (key === "recipe" && typeof SETTINGS[key] === 'string') {
    try {
      SETTINGS[key] = JSON.parse(SETTINGS[key]);
    } catch (e) {
      SETTINGS[key] = {};
    }
    save();
  }
  return commonUtil.getObjectValueByRecursiveKey(SETTINGS, key);
}
function set(key, value) {
  commonUtil.setObjectValueByRecursiveKey(SETTINGS, key, value);
}

},{"../utils/common":10}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addObserver = addObserver;
exports.bindEvent = bindEvent;
exports.clearObservers = clearObservers;
exports.clearTimers = clearTimers;
exports.getObjectValueByRecursiveKey = getObjectValueByRecursiveKey;
exports.getTableColumns = getTableColumns;
exports.getTableData = getTableData;
exports.isMobileDevice = isMobileDevice;
exports.itemApplyFilter = itemApplyFilter;
exports.regexGetValue = regexGetValue;
exports.setObjectValueByRecursiveKey = setObjectValueByRecursiveKey;
let filter;
const settingStorage = require("../storage/setting");
const observers = [];
const timers = [];
function getObjectValueByRecursiveKey(obj, recursiveKey) {
  const keys = recursiveKey.split(".");
  let tempObj = obj;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (tempObj[key] === undefined) {
      // tempObj = null;
      return null;
    }
    tempObj = tempObj[key];
  }
  // keys.forEach(key => {

  // });
  return tempObj;
}
function setObjectValueByRecursiveKey(obj, recursiveKey, value) {
  const keys = recursiveKey.split(".");
  const lastKey = keys.pop();
  let tempObj = obj;
  keys.forEach(key => {
    if (tempObj[key] === undefined || typeof tempObj[key] !== "object") tempObj[key] = {};
    tempObj = tempObj[key];
  });
  tempObj[lastKey] = value;
  return obj;
}
function isMobileDevice() {
  const mobileDevices = ['Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone'];
  for (let i = 0; i < mobileDevices.length; i++) {
    if (navigator.userAgent.match(mobileDevices[i])) {
      return true;
    }
  }
  return false;
}
function itemApplyFilter(itemName, config) {
  if (!Array.isArray(filter)) {
    const itemFilterEncode = settingStorage.get("GENERAL.ITEM_FILTER_ENCODE");
    try {
      filter = JSON.parse(decodeURIComponent(atob(itemFilterEncode)));
    } catch (e) {
      // console.error("parse error", e);
      filter = [];
    }
  }
  let result = false;
  filter.forEach(filter => {
    if (filter.items.includes(itemName)) {
      if (config.highlight) config.dom.style.color = filter.color;
      if (config.playSound) {
        const audio = new Audio(filter.sound);
        audio.volume = filter.volume;
        audio.play().catch(err => console.error(err));
      }
      result = true;
    }
  });
  return result;
}

/**
 * @returns {{name: string, isNumeric: boolean}[]}
 */
function getTableColumns(table, tableHeaderClickEvent) {
  const ths = table.querySelectorAll("thead > tr > th");
  const tableColumns = [];
  ths.forEach(th => {
    const column = {
      name: th.innerText,
      isNumeric: th.getAttribute("data-is-numeric") ? true : false
    };
    tableColumns.push(column);
    if (tableHeaderClickEvent) th.onclick = tableHeaderClickEvent;
  });
  return tableColumns;
}
/**
 * @param {HTMLTableElement} targetColumnName
 * @param {{name: string, isNumeric: boolean}} targetColumn
 * @param {{name: string, isNumeric: boolean}[]} columns
 * @returns {{DOM: HTMLTableRowElement}[]}
 */
function getTableData(table, targetColumn, columns) {
  const data = [];
  if (!columns) {
    columns = getTableColumns(table);
  }
  const index = columns.findIndex(column => column.name === targetColumn.name);
  if (!!~index === false) return [];
  table.querySelectorAll("tbody > tr[role=row]").forEach(row => {
    const rowData = {};

    //金錢逗號處理
    const text = row.childNodes[index].innerText.replaceAll(",", "");
    if (targetColumn.name === "耐久") {
      rowData[targetColumn.name] = Number(regexGetValue("([0-9]+) / [0-9]+", text)[0]);
    } else {
      rowData[targetColumn.name] = targetColumn.isNumeric ? Number(text) : text;
    }
    rowData["DOM"] = row;
    data.push(rowData);
  });
  return data;
}
function regexGetValue(pattern, str) {
  const match = new RegExp(pattern).exec(str);
  if (match) {
    return match.slice(1);
  } else {
    return [];
  }
}
function addObserver(observer) {
  observers.push(observer);
}
function clearObservers() {
  // console.log("clear")
  observers.forEach(observer => {
    observer.disconnect();
  });
  observers.length = 0;
}
function clearTimers() {
  // console.log("clear")
  timers.forEach(timer => {
    clearInterval(timer);
  });
  timers.length = 0;
}
function bindEvent(pathname, timerEvent) {
  const timer = setInterval(() => {
    if (Array.isArray(pathname)) {
      if (pathname.filter(path => path === location.pathname).length === 0) {
        clearInterval(timer);
        return;
      }
    } else {
      if (location.pathname !== pathname) {
        clearInterval(timer);
        return;
      }
    }
    timerEvent();
  }, 100);
  timers.push(timer);
}

// let container;
// let debounce = 0;
// let timer = setInterval(() => {
//     container = document.querySelector("#__next");
//     if (container) {
//         clearInterval(timer);
//         createOpenDialogButton();
//         if(isMobileDevice() && settingStorage.get("GENERAL.MOBILE_WRAP_NAVBAR")) wrapNavbar()
//         if(settingStorage.get("GENERAL.BACKGROUND_IMAGE_URL") !== ""){
//             const backgroundImageDiv = document.createElement("div");
//             backgroundImageDiv.style.cssText = `
//                 background: #fff url(${settingStorage.get("GENERAL.BACKGROUND_IMAGE_URL")}) center center fixed no-repeat;
//                 background-size: cover;
//                 -webkit-background-size: cover;
//                 width: 100%;
//                 height: 100%;
//                 position: fixed;
//                 top: 0;
//                 left: 0;
//                 opacity: 0.5;
//                 pointer-events: none;
//             `
//             if((/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)))
//                 backgroundImageDiv.style.cssText += "background-attachment: scroll;"
//             backgroundImageDiv.id = "background-image-div";
//             document.body.insertBefore(backgroundImageDiv, document.body.firstChild);
//             // document.body.style.background = ``;
//             // document.body.style.backgroundSize = "cover";
//         }
//         // createSettingUI();
//         // registerSettingUIEvent();
//         loadObserver();
//     }else{
//         // console.log("test")
//     }
// }, 10);

// function loadObserver() {
//     const observer = new MutationObserver(function (e) {

//         //奇怪的DOM 導致forge UI產生兩次
//         if (e.length) {
//             let renderDiv = false;
//             for(let i = 0; i < e.length; i++){

//                 if (
//                     (e[i].addedNodes.length && e[i].addedNodes[0].tagName === "DIV") ||
//                     (e[i].removedNodes.length && e[i].removedNodes[0].tagName === "DIV")
//                 ) {
//                     renderDiv = true;
//                 }
//             }
//             if(!renderDiv) return;
//         }
//         const pathname = location.pathname;
//         if (pageScript[pathname]) {
//             debounce++;
//             setTimeout(() => {
//                 debounce--;
//                 if (debounce === 0) {
//                     //console.log(e);
//                     clearObservers();
//                     clearTimers();
//                     clearSubscribeEvents();

//                     pageScript[pathname]();
//                 }
//             }, 500);
//         }
//     });
//     observer.observe(container, { subtree: false, childList: true });
// }

},{"../storage/setting":9}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearSubscribeEvents = clearSubscribeEvents;
exports.subscribeApi = subscribeApi;
const settingStorage = require("../storage/setting");
const commonUtil = require("./common");
const uiUtil = require("./ui");
const forgeStorage = require("../storage/forge");
const globalVarsStorage = require("../storage/globalVars");
let updateAnnouncement;
let forgeNotificationTimes = [];
const subscribeEvents = [];
const specialSubscribeEvents = {
  profile: [data => {
    if (location.pathname === "/hunt" && settingStorage.get("GENERAL.HUNT_STATUS_PERCENT")) {
      data.fullHp += ` (${Math.floor(data.hp / data.fullHp * 100)}%)`;
      data.fullSp += ` (${Math.floor(data.sp / data.fullSp * 100)}%)`;
    }
  }, data => {
    if (settingStorage.get("GENERAL.SHOW_EXP_BAR")) {
      if (!document.querySelector(".exp-container")) uiUtil.createExpBar();
      const expBar = document.querySelector("#exp-bar");
      const expBarFill = document.querySelector("#exp-bar-fill");
      let percent = Math.floor(data.exp / data.nextExp * 1000) / 10.0;
      document.querySelector("#exp-bar-level-label").textContent = `LV.${data.lv}`;
      document.querySelector("#exp-bar-exp-label").textContent = `EXP:${data.exp} / ${data.nextExp} (${percent}%)`;
      expBar.style.backgroundColor = settingStorage.get("COLOR.EXP_BAR_BACKGROUND");
      expBarFill.style.backgroundColor = settingStorage.get("COLOR.EXP_BAR_FILL");
      if (settingStorage.get("GENERAL.EXP_BAR_FILL_BACKGROUND_IMAGE_URL") !== "") {
        expBar.style.backgroundImage = `url(${settingStorage.get("GENERAL.EXP_BAR_FILL_BACKGROUND_IMAGE_URL")})`;
        expBar.style.backgroundSize = "100% 24px";
        expBarFill.style.backgroundColor = settingStorage.get("COLOR.EXP_BAR_BACKGROUND");
        expBarFill.style.left = "unset";
        expBarFill.style.right = "0px";
        percent = 100 - percent;
        // expBarFill.style.backgroundImage = `url(${settingStorage.get("GENERAL.EXP_BAR_FILL_BACKGROUND_IMAGE_URL")})`
        // expBarFill.style.backgroundSize = "100% 24px";
      } else {
        expBar.style.backgroundImage = ``;
        expBarFill.style.left = "";
        expBarFill.style.right = "";
      }
      expBarFill.style.width = `${percent}%`;
      document.querySelector(".exp-container").style.color = settingStorage.get("COLOR.EXP_BAR_FONT");
    }
  }, data => {
    if (settingStorage.get("GENERAL.FORGE_NOTIFICATION") && 'Notification' in window && Notification.permission === "granted") {
      if (!data.forgingCompletionTime || data.forgingCompletionTime - new Date().getTime() < 0 || forgeNotificationTimes.includes(data.forgingCompletionTime)) return;
      const currentForgeCompletionTime = data.forgingCompletionTime;
      forgeNotificationTimes.push(currentForgeCompletionTime);
      setTimeout(() => {
        new Notification(`${data.nickname} 鍛造已完成！`);
        forgeNotificationTimes = forgeNotificationTimes.filter(time => time !== currentForgeCompletionTime);
      }, currentForgeCompletionTime - new Date().getTime());
    }
  }],
  announcement: [data => {
    if (data.announcement) return;
    if (updateAnnouncement) {
      data.announcement = structuredClone(updateAnnouncement);
      return;
    }
    const latestVersion = globalVarsStorage.get("LATEST_VERSION");
    let haveNewVersion = false;
    if (!/[0-9]+\.[0-9]+\.[0-9]+/.test(latestVersion)) return;
    /*
    const setting = JSON.parse(localStorage.getItem("SGO_Interface_Optimization"))
    setting.UPDATE.LAST_CHECK_TIMESTAMP = 0
    setting.UPDATE.LATEST_VERSION = ""
    localStorage.setItem("SGO_Interface_Optimization", JSON.stringify(setting));
    */
    if (settingStorage.get("UPDATE.LAST_CHECK_TIMESTAMP") + globalVarsStorage.get("UPDATE_CHECK_INTERVAEL") < new Date().getTime() && settingStorage.get("UPDATE.LATEST_VERSION") !== latestVersion) {
      settingStorage.set("UPDATE.LATEST_VERSION", latestVersion);
      settingStorage.set("UPDATE.LAST_CHECK_TIMESTAMP", new Date().getTime());
      settingStorage.save();
      const currentVersionSplit = globalVarsStorage.get("VERSION").split(".");
      const latestVersionSplit = latestVersion.split(".");
      //依序比較大中小版本號
      for (let i = 0; i < 3; i++) {
        if (Number(latestVersionSplit[i]) > Number(currentVersionSplit[i])) {
          haveNewVersion = true;
          break;
        }
      }
      if (haveNewVersion) {
        data.announcement = {
          status: "info",
          message: `[SGO介面優化] 發現插件新版本 Ver ${latestVersion}`
        };
        updateAnnouncement = structuredClone(data.announcement);
      }
    }
  }]
};
const apiData = {};
const _fetch = window.fetch;
window.fetch = async (url, fetchOptions) => {
  try {
    const originResp = await _fetch(url, fetchOptions);
    const ab = await originResp.arrayBuffer();
    const jsonObject = JSON.parse(new TextDecoder("utf-8").decode(ab));

    //特殊問題 部分電腦的url不是字串而是requestInfo 需要取其中的url property來拿到api網址
    const apiUrl = commonUtil.regexGetValue("api/(.*)", typeof url === "string" ? url : url.url);
    if (apiUrl.length) {
      if (jsonObject.profile) {
        apiData["profile"] = jsonObject.profile;
        triggerEventHook("profile");
        jsonObject.profile = structuredClone(apiData["profile"]);
      }
      if (apiUrl[0].match("trades\\?category=[a-z]+")) {
        //特例常駐subscribe
        apiData[apiUrl[0]] = structuredClone(jsonObject);
        triggerEventHook(apiUrl[0]);
        const category = commonUtil.regexGetValue("trades\\?category=([a-z]+)", apiUrl[0])[0];
        const highlightRow = globalVarsStorage.get("HIGHTLIGHT_ROW");
        highlightRow[category].length = 0;
        if (!settingStorage.get("GENERAL.DISABLE_MARKET_FUNCTION")) {
          const blackList = settingStorage.get("MARKET.BLACK_LIST");
          apiData[apiUrl[0]].trades = apiData[apiUrl[0]].trades.filter(trade => !blackList.includes(trade.sellerName));
          const watchList = settingStorage.get("MARKET.WATCH_LIST");
          for (let i = 0; i < apiData[apiUrl[0]].trades.length; i++) {
            const trade = apiData[apiUrl[0]].trades[i];
            if (watchList.includes(trade.sellerName)) {
              highlightRow[category].push(i);
            }
          }
        }
        return new Response(new TextEncoder().encode(JSON.stringify(apiData[apiUrl[0]])));
      } else if (apiUrl[0].match("equipment\/([0-9]+)\/recycle")) {
        //清除回收裝備的鍛造資料
        const equipmentId = commonUtil.regexGetValue("equipment\/([0-9]+)\/recycle", apiUrl[0])[0];
        const equipment = apiData["items"]?.equipments.find(equipment => equipment.id === Number(equipmentId));
        if (equipment && equipment.crafter !== null) {
          const forgeTime = new Date(`${equipment.craftedTime}`);
          forgeTime.setSeconds(0);
          forgeTime.setMilliseconds(0);
          const base64 = btoa(encodeURIComponent(`${forgeTime.getTime()},${equipment.name},${equipment.crafter}`));
          forgeStorage.deleteIfKeyExist(base64);
        }
      }
      apiData[apiUrl[0]] = structuredClone(jsonObject);
      triggerEventHook(apiUrl[0]);
      // console.log(apiUrl[0], apiData);
      return new Response(new TextEncoder().encode(JSON.stringify(apiData[apiUrl[0]])));
    } else {
      const uint8Array = new TextEncoder().encode(JSON.stringify(jsonObject));
      const newResp = new Response(uint8Array);
      return newResp;
    }
  } catch (error) {
    console.error(error);
  }
};
function triggerEventHook(url) {
  if (specialSubscribeEvents[url]) {
    specialSubscribeEvents[url].forEach(e => {
      e(apiData[url]);
    });
  }
  if (subscribeEvents[url]) {
    const removes = [];
    subscribeEvents[url].forEach(element => {
      if (!element.forever) removes.push(element);
      element.event(apiData[url]);
    });
    if (removes.length) subscribeEvents[url] = subscribeEvents[url].filter(element => !removes.includes(element));
  }
}
function subscribeApi(url, event, forever = true) {
  if (!subscribeEvents[url]) {
    subscribeEvents[url] = [];
  }
  subscribeEvents[url].push({
    event,
    forever
  });
}
function clearSubscribeEvents() {
  Object.keys(subscribeEvents).forEach(key => {
    delete subscribeEvents[key];
  });
}

},{"../storage/forge":7,"../storage/globalVars":8,"../storage/setting":9,"./common":10,"./ui":12}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExpBar = createExpBar;
exports.createOpenDialogButton = createOpenDialogButton;
exports.createSearchUI = createSearchUI;
exports.createSettingUI = createSettingUI;
exports.registerSettingUIEvent = registerSettingUIEvent;
exports.wrapNavbar = wrapNavbar;
const commonUtil = require("../utils/common");
const settingStorage = require("../storage/setting");
const globalVarsStorage = require("../storage/globalVars");

//改變navbar
function wrapNavbar() {
  const style = document.createElement("style");
  style.innerHTML = `
        nav {
            flex-wrap: wrap;
            min-width: auto !important;
        }
        #__next > div > div:nth-child(2) {
            height: 120px;
        }
    `;
  document.body.appendChild(style);
  // document.querySelector("nav").style.flexWrap = "wrap";
  // document.querySelector("nav").style.minWidth = "unset";
}
// 搜尋UI
function createSearchUI(labelText, inputId) {
  const div = document.createElement("div");
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.marginBottom = "1rem";
  div.innerHTML = `<label style="width: 84px;">${labelText}</label>`;
  const input = document.createElement("input");
  input.type = "text";
  input.id = inputId;
  input.autocomplete = "off";
  input.style.cssText = `
        width: var(--chakra-sizes-full);
        min-width: 0px;
        outline: transparent solid 2px;
        outline-offset: 2px;
        position: relative;
        appearance: none;
        transition-property: var(--chakra-transition-property-common);
        transition-duration: var(--chakra-transition-duration-normal);
        font-size: var(--chakra-fontSizes-md);
        padding-inline-start: var(--chakra-space-4);
        padding-inline-end: var(--chakra-space-4);
        height: var(--chakra-sizes-10);
        border-radius: var(--chakra-radii-md);
        border-width: 2px;
        border-style: solid;
        border-image: initial;
        border-color: var(--chakra-colors-transparent);
        background: var(--chakra-colors-whiteAlpha-100);
    `;
  // input.onchange = inputEvent
  div.appendChild(input);
  return [div, input];
}
//開啟系統設定UI
function createOpenDialogButton() {
  //開啟設定的按鍵
  const openDialogBtn = document.createElement("button");
  openDialogBtn.id = "open-dialog-btn";
  openDialogBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-settings" width="50" height="50" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
        <circle cx="12" cy="12" r="3" />
        </svg>
    `;
  const style = document.createElement("style");
  //scss
  style.innerText = `
    *{box-sizing:border-box}.wrapper{display:flex;align-items:center;justify-content:center;background-color:rgba(15,19,26,.8);height:100vh;position:fixed;width:100%;left:0;top:0;overflow:auto;z-index:9999}.header{display:flex;justify-content:space-between;padding:1rem 1rem 0 1rem;position:absolute;width:calc(100% - 56px);top:0;left:56px;border-bottom:1px solid #3c3f43}.header button{height:100%}.header h1{color:#fff}.header #close-dialog-btn{margin-left:auto}.content-container{padding-top:50px;margin-left:56px;height:100%}.content-container .content{display:flex;margin:0 1rem 1rem 1rem;flex-direction:column;height:100%;overflow-y:scroll}.content-container .content hr{width:100%}.panel{position:relative;width:100%;display:flex;flex-direction:column;display:none;opacity:0}.panel input[type=checkbox]{margin:.5rem}.panel input[type=text]{background-color:#1a1d24;background-image:none;border:1px solid #3c3f43;border-radius:6px;color:#e9ebf0;display:block;font-size:14px;line-height:1.42857143;padding:7px 11px;transition:border-color .3s ease-in-out;width:100px}.panel input[type=color]{background-color:#292d33;width:50px}.panel button{border-radius:.375rem;padding:.25rem}.panel button.warning{background-color:var(--chakra-colors-red-500)}.panel button.warning:hover{background-color:var(--chakra-colors-red-600)}.panel[expand]{display:block;opacity:1}.panel-header{width:100%;padding:20px}.panel-header span{color:#fff;font-size:16px;line-height:1.25}.panel-body{padding:0 20px 20px 20px}.panel-body .row{margin-top:1rem;display:flex;align-items:center}.panel-body .row label{color:#a4a9b3;margin-right:1rem}.panel-body .row input{margin-right:1rem}.panel-body .row a{color:#a4a9b3;margin-right:1rem;text-decoration:underline}.panel-body .row a:hover{background-color:#3c3f43}.panel-body .row.table{flex-direction:column;align-items:flex-start}.record{width:100%;border-bottom:1px solid #3c3f43}.record .record-header{margin-top:.25rem}.record .record-body{display:flex;flex-direction:column}.record .record-item{display:flex;width:80%;margin:.5rem 0}.record .record-quatity{margin-left:auto}.grid{margin-top:10px;width:100%;color:#a4a9b3;background-color:#1a1d24}.grid div{border-bottom:1px solid #292d33;width:100%;height:40px;padding:10px}.grid .grid-row{display:flex;align-items:center}.grid .grid-row:hover{background-color:#3c3f43}.grid .grid-row button{font-size:14px;border:none;background-color:rgba(0,0,0,0);color:#9146ff;margin-left:auto}.grid .grid-row button:hover{cursor:pointer}.description{margin:0px;color:#a4a9b3;line-height:1.5;font-size:8px}.dialog{width:800px;height:500px;position:relative;overflow:auto;z-index:9999;display:flex;background-color:#292d33;border-radius:6px;box-shadow:0 4px 4px rgba(0,0,0,.12),0 0 10px rgba(0,0,0,.06);display:block}.dialog .navbar{height:500px;background-color:#1a1d24;width:56px;position:fixed;display:flex;flex-direction:column}.dialog .navbar button{height:50px}.dialog .navbar button:hover{background-color:#292d33}.dialog .navbar button[active]{background-color:#292d33}.dialog .right-container{margin-left:56px}#open-dialog-btn{position:-webkit-sticky;position:sticky;left:0;bottom:20px;margin-right:1rem;z-index:9998;color:#7d7d7d;background-color:rgba(0,0,0,0);border:none}#open-dialog-btn:hover{color:#fff}#exp-bar{position:fixed;bottom:0px;width:100%;height:24px}#exp-bar-fill{position:fixed;bottom:0px;left:0px;height:24px}.exp-container{display:flex;justify-content:flex-end;position:fixed;width:100%;bottom:0px}.quick-filter-container{display:flex;margin-bottom:.5rem;align-items:center;-webkit-box-align:center}.quick-filter-container div{width:18px;height:18px;margin-right:var(--chakra-space-3);border-radius:50%;background:var(--chakra-colors-transparent);border-width:2px;border-style:solid;-o-border-image:initial;border-image:initial;cursor:pointer}.quick-filter-container .circle-red{border-color:var(--chakra-colors-red-500)}.quick-filter-container .circle-red:hover{background-color:var(--chakra-colors-red-300)}.quick-filter-container .circle-blue{border-color:var(--chakra-colors-blue-500)}.quick-filter-container .circle-blue:hover{background-color:var(--chakra-colors-blue-300)}.quick-filter-container .circle-cyan{border-color:var(--chakra-colors-cyan-500)}.quick-filter-container .circle-cyan:hover{background-color:var(--chakra-colors-cyan-300)}.quick-filter-container .circle-green{border-color:var(--chakra-colors-green-500)}.quick-filter-container .circle-green:hover{background-color:var(--chakra-colors-green-300)}.quick-filter-container .circle-teal{border-color:var(--chakra-colors-teal-500)}.quick-filter-container .circle-teal:hover{background-color:var(--chakra-colors-teal-300)}.quick-filter-container .circle-orange{border-color:var(--chakra-colors-orange-500)}.quick-filter-container .circle-orange:hover{background-color:var(--chakra-colors-orange-300)}.quick-filter-container .circle-yellow{border-color:var(--chakra-colors-yellow-500)}.quick-filter-container .circle-yellow:hover{background-color:var(--chakra-colors-yellow-300)}.quick-filter-container .circle-pink{border-color:var(--chakra-colors-pink-500)}.quick-filter-container .circle-pink:hover{background-color:var(--chakra-colors-pink-300)}.quick-filter-container .circle-purple{border-color:var(--chakra-colors-purple-500)}.quick-filter-container .circle-purple:hover{background-color:var(--chakra-colors-purple-300)}.quick-filter-container .circle-gray{border-color:var(--chakra-colors-gray-500)}.quick-filter-container .circle-gray:hover{background-color:var(--chakra-colors-gray-300)}.type-filter-container{display:flex;align-items:center;flex-wrap:wrap}.type-filter-container .choice{display:flex;align-items:center;margin-right:.5rem}.type-filter-container .choice .circle{width:18px;height:18px;margin-right:var(--chakra-space-1);border-radius:50%;background:var(--chakra-colors-transparent);border-width:2px;border-style:solid;-o-border-image:initial;border-image:initial;border-color:var(--chakra-colors-gray-500);cursor:pointer;display:block}.type-filter-container .choice .circle:hover{background-color:var(--chakra-colors-gray-300)}
    `;
  // document.querySelector("#open-dialog-btn").onclick = () => {createSettingUI(); registerSettingUIEvent();}
  openDialogBtn.onclick = () => {
    createSettingUI();
    registerSettingUIEvent();
    document.body.style.overflow = "hidden";
  };
  document.body.appendChild(style);
  document.body.appendChild(openDialogBtn);
}
//系統設定UI
function createSettingUI() {
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  wrapper.style.display = "";
  wrapper.innerHTML = `
    <div class="dialog">
        <div class="navbar">
        </div>
        <div class="header">
            <h1>SGO介面優化插件 Ver${globalVarsStorage.get("VERSION")}</h1>
            <button id="reset-settings-btn" hidden>RESET</button>
            <button id="close-dialog-btn">X</button>
        </div>
        <div class="content-container">
            <div class="content">
            </div>
        </div>
    </div>`;
  const rowEvent = {
    checkbox: e => {
      const element = e.target;
      settingStorage.set(element.getAttribute("bind-setting"), element.checked);
      settingStorage.save();
    },
    colorInput: e => {
      const element = e.target;
      const bindSetting = element.getAttribute("bind-setting");
      // if(!/^#[0-9a-fA-F]{6}$|transparent/.test(element.value)){
      //     element.value = settingStorage.get(bindSetting);
      // }
      settingStorage.set(bindSetting, element.value);
      element.nextElementSibling.style.color = element.value;
      settingStorage.save();
    },
    numberInput: e => {
      const element = e.target;
      const bindSetting = element.getAttribute("bind-setting");
      if (element.value === "" || Number.isNaN(Number(element.value))) {
        element.value = settingStorage.get(bindSetting);
        return;
      }
      settingStorage.set(bindSetting, Number(element.value));
      settingStorage.save();
    },
    input: e => {
      const element = e.target;
      const bindSetting = element.getAttribute("bind-setting");
      settingStorage.set(bindSetting, element.value);
      settingStorage.save();
    }
  };
  const panel = [{
    category: "一般",
    description: "一般功能的開啟與關閉",
    rows: [{
      id: "bad-button",
      type: "checkbox",
      label: "禁用搶劫與超渡按鍵",
      bindSetting: "GENERAL.DISABLE_BAD_BUTTON"
    }, {
      id: "rest-button",
      type: "checkbox",
      label: "隱藏狩獵頁面的休息按鍵",
      bindSetting: "GENERAL.HIDE_REST_BUTTON"
    }, {
      id: "disable-true-stats",
      type: "checkbox",
      label: "關閉原始素質顯示",
      bindSetting: "GENERAL.DISABLE_TRUE_STATS"
    }, {
      id: "disable-market-function",
      type: "checkbox",
      label: "關閉市場黑名單與關注名單功能",
      bindSetting: "GENERAL.DISABLE_MARKET_FUNCTION"
    }, {
      id: "hunt-status-percent",
      type: "checkbox",
      label: "顯示血量、體力百分比(僅在狩獵頁有效)",
      bindSetting: "GENERAL.HUNT_STATUS_PERCENT"
    }, {
      id: "show-exp-bar",
      type: "checkbox",
      label: "顯示經驗條",
      bindSetting: "GENERAL.SHOW_EXP_BAR"
    }, {
      id: "red-backround-when-equipment-broken",
      type: "checkbox",
      label: "裝備損壞超級提示",
      bindSetting: "GENERAL.RED_BACKBROUND_WHEN_EQUIPMENT_BROKEN"
    }, {
      id: "equipment-encode",
      type: "input",
      label: "裝備損壞音效編碼",
      bindSetting: "WARNING.EQUIPMENT_BROKEN_ENCODE"
    }, {
      id: "enable-forge-notification",
      type: "checkbox",
      label: "開啟鍛造完成通知",
      bindSetting: "GENERAL.FORGE_NOTIFICATION",
      event: e => {
        if (!settingStorage.get("GENERAL.FORGE_NOTIFICATION")) return;
        if ('Notification' in window) {
          console.log('Notification permission default status:', Notification.permission);
          Notification.requestPermission(function (status) {
            console.log('Notification permission status:', status);
          });
        }
      }
    }, {
      id: "exp-bar-fill-background-image-url",
      type: "input",
      label: "自訂經驗條填充圖片",
      bindSetting: "GENERAL.EXP_BAR_FILL_BACKGROUND_IMAGE_URL"
    }, {
      id: "background-image-url",
      type: "input",
      label: "自訂背景圖片",
      bindSetting: "GENERAL.BACKGROUND_IMAGE_URL"
    }, {
      id: "item-filter-encode",
      type: "input",
      label: "物品過濾器編碼",
      bindSetting: "GENERAL.ITEM_FILTER_ENCODE"
    }, {
      type: "a",
      label: "SGO-物品過濾器-Editor",
      link: "https://sgo-filter.wind-tech.tw/"
    }]
  }, {
    category: "手機",
    description: "手機特別功能開啟與關閉",
    mobile: true,
    rows: [{
      id: "mobile-wrap-navbar",
      type: "checkbox",
      label: "導覽列換行",
      bindSetting: "GENERAL.MOBILE_WRAP_NAVBAR"
    }, {
      id: "mobile-hunt-report",
      type: "checkbox",
      label: "精簡狩獵結果",
      bindSetting: "GENERAL.MOBILE_HUNT_REPORT"
    }]
  }, {
    category: "顏色",
    description: "設定插件各種提示的顏色",
    rows: [{
      id: "tips",
      type: "colorInput",
      label: "一般提示",
      bindSetting: "COLOR.TIPS"
    }, {
      id: "warning",
      type: "colorInput",
      label: "紅色警告",
      bindSetting: "COLOR.WARNING"
    }, {
      id: "true-stats",
      type: "colorInput",
      label: "裝備原始素質",
      bindSetting: "COLOR.TRUE_STATS"
    }, {
      id: "zone-level",
      type: "colorInput",
      label: "到達新樓層",
      bindSetting: "COLOR.ZONE_LEVEL"
    }, {
      id: "market-watch",
      type: "colorInput",
      label: "關注中的賣家外框顏色",
      bindSetting: "COLOR.MARKET_WATCH"
    }, {
      id: "exp-bar-background",
      type: "colorInput",
      label: "經驗條背景色",
      bindSetting: "COLOR.EXP_BAR_BACKGROUND"
    }, {
      id: "exp-bar-fill-color",
      type: "colorInput",
      label: "經驗條填充色",
      bindSetting: "COLOR.EXP_BAR_FILL"
    }, {
      id: "exp-bar-font",
      type: "colorInput",
      label: "經驗條字體顏色",
      bindSetting: "COLOR.EXP_BAR_FONT"
    }]
  }, {
    category: "警示",
    description: "設定警示功能的數值",
    rows: [{
      id: "equipment",
      type: "numberInput",
      label: "裝備耐久低於(數值)",
      bindSetting: "WARNING.EQUIPMENT"
    }, {
      id: "hp",
      type: "numberInput",
      label: "血量單次耗損(百分比)",
      bindSetting: "WARNING.HP"
    }, {
      id: "sp",
      type: "numberInput",
      label: "體力低於(數值)",
      bindSetting: "WARNING.SP"
    }]
  }, {
    category: "市場",
    description: "刪除市場的關注名單與黑名單<BR>新增請至市場點擊訂單下方即可新增",
    rows: [{
      id: "watch-list",
      type: "table",
      label: "關注名單",
      header: "名字",
      bindSetting: "MARKET.WATCH_LIST"
    }, {
      id: "black-list",
      type: "table",
      label: "黑名單",
      header: "名字",
      bindSetting: "MARKET.BLACK_LIST"
    }]
  }, {
    category: "狩獵記錄",
    description: "記錄狩獵獲得的物品",
    rows: [{
      id: "item-record",
      type: "checkbox",
      label: "啟用狩獵記錄",
      bindSetting: "ITEM_RECORD.ENABLE"
    }, {
      id: "reset-item-record",
      type: "button",
      class: "warning",
      label: "重置狩獵記錄",
      bindSetting: "ITEM_RECORD.RECORDS",
      event: e => {
        const currentPanel = e.target.closest(".panel");
        currentPanel.querySelector(".row.table").innerHTML = `
                            <label>當前記錄</label>
                            <div style="margin: 1rem">無</div>
                        `;
        settingStorage.set("ITEM_RECORD.RECORDS", {});
        settingStorage.save();
      }
    }, {
      id: "item-record-apply-filter",
      type: "checkbox",
      label: "狩獵記錄套用過濾器",
      bindSetting: "ITEM_RECORD.APPLY_FILTER",
      event: e => {
        const checked = e.target.checked;
        const currentPanel = e.target.closest(".panel");
        currentPanel.querySelectorAll(".record-item").forEach(item => {
          if (checked) {
            const result = commonUtil.itemApplyFilter(item.innerText.split("\n")[0], {
              highlight: true,
              dom: item
            });
            if (!result) item.style.display = "none";
          } else {
            item.style.display = item.style.color = "";
          }
        });
      }
    }, {
      id: "item-record-table",
      type: "record-table",
      label: "當前記錄",
      bindSetting: "ITEM_RECORD.RECORDS"
    }]
  }, {
    category: "贊助",
    description: "",
    rows: [{
      type: "customize",
      html: `
                        <p class="description" style="font-size: 1rem">
                            如果你覺得插件對你有幫助<BR>歡迎贊助我喝一杯飲料
                        </p>
                        <p class="description" style="font-size: 1rem; color: var(--chakra-colors-red-300);">
                            希望你已經贊助過茅場晶彥再來贊助我<BR>沒有茅場晶彥做遊戲就不會有此插件
                        </p>
                        <a target="_blank" style = "color: var(--chakra-colors-blue-300); margin-top: 0.5rem;" href="https://www.buymeacoffee.com/ourcastle">茅場晶彥的 Buy Me a Coffee</a>
                        <a target="_blank" style = "color: var(--chakra-colors-blue-300); margin-top: 0.5rem;" href="https://www.buymeacoffee.com/sgoeplugin">Wind 的 Buy Me a Coffee</a>

                        <a target="_blank" href="https://p.ecpay.com.tw/D6A6802" style="margin-top: 0.5rem;"><img src="https://payment.ecpay.com.tw/Content/themes/WebStyle20170517/images/ecgo.png" /></a>
                    `
    }]
  },{
    category: "帳號",
    description: "在多個帳號間快速切換<BR>點擊名稱切換帳號",
    rows: [{
        id: "watch-list",
        type: "table_a",
        label: "帳號列表",
        header: "名字"
    }]
  }];
  function createRow(rowDiv, rowData) {
    const type = {
      checkbox: () => {
        rowDiv.innerHTML = `
                    <input type="checkbox" id="${rowData.id}" bind-setting="${rowData.bindSetting}">
                    <label for="${rowData.id}">${rowData.label}</label>
                `;
        const mainElement = rowDiv.querySelector(`#${rowData.id}`);
        mainElement.checked = settingStorage.get(rowData.bindSetting);
        mainElement.onchange = rowEvent[rowData.type];
        if (rowData.event) {
          mainElement.addEventListener("change", rowData.event);
        }
      },
      input: () => {
        rowDiv.innerHTML = `
                    <label for="${rowData.id}">${rowData.label}</label>
                    <input type="text" id="${rowData.id}" bind-setting="${rowData.bindSetting}">
                `;
        const mainElement = rowDiv.querySelector(`#${rowData.id}`);
        mainElement.value = settingStorage.get(rowData.bindSetting);
        mainElement.onchange = rowEvent[rowData.type];
      },
      numberInput: () => {
        rowDiv.innerHTML = `
                    <label for="${rowData.id}">${rowData.label}</label>
                    <input type="text" id="${rowData.id}" bind-setting="${rowData.bindSetting}">
                `;
        const mainElement = rowDiv.querySelector(`#${rowData.id}`);
        mainElement.value = settingStorage.get(rowData.bindSetting);
        mainElement.onchange = rowEvent[rowData.type];
      },
      colorInput: () => {
        rowDiv.innerHTML = `
                    <label for="${rowData.id}">${rowData.label}</label>
                    <input type="color" id="${rowData.id}" bind-setting="${rowData.bindSetting}">
                    <p>我是顏文字</p>
                `;
        const mainElement = rowDiv.querySelector(`#${rowData.id}`);
        mainElement.value = settingStorage.get(rowData.bindSetting);
        rowDiv.querySelector("p").style.color = settingStorage.get(rowData.bindSetting);
        mainElement.onchange = mainElement.oninput = rowEvent[rowData.type];
      },
      table: () => {
        const tableData = settingStorage.get(rowData.bindSetting);
        let gridRowHTML = "";
        if (!tableData.length) {
          gridRowHTML = `
                    <div class="grid-row">
                        <label>空</label>
                    </div>`;
        } else {
          tableData.forEach(name => {
            const div = document.createElement("div");
            div.innerHTML = `
                            <label>${name}</label>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="19" height="19" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        `;
            div.className = "grid-row";
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="19" height="19" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>`;
            gridRowHTML += div.outerHTML;
          });
        }
        rowDiv.innerHTML = `
                    <label>${rowData.label}</label>
                    <div class="grid" id="${rowData.id}" bind-setting="${rowData.bindSetting}">
                        <div class="grid-row-header">${rowData.header}</div>
                        ${gridRowHTML}
                    </div>`;
      },
      "record-table": () => {
        /*
        {
            name: {
                itemName: quatity
            }
        }
        */
        const tableData = settingStorage.get(rowData.bindSetting);
        const names = Object.keys(tableData);
        let recordsHTML = "";
        if (!names.length) {
          recordsHTML = `<div style="margin: 1rem">無</div>`;
        } else {
          const itemRecordApplyFilter = settingStorage.get("ITEM_RECORD.APPLY_FILTER");
          names.forEach(name => {
            const record = document.createElement("div");
            record.innerHTML = `
                            <div class="record-header">${name} 獲得了</div>
                        `;
            record.className = "record";
            const recordBody = document.createElement("div");
            recordBody.className = "record-body";
            Object.keys(tableData[name]).forEach(itemName => {
              const recordItem = document.createElement("div");
              recordItem.className = "record-item";
              recordItem.innerHTML = `
                                <div class="record-name">${itemName}</div>
                                <div class="record-quatity"> x ${tableData[name][itemName]}</div>
                            `;
              if (itemRecordApplyFilter) {
                const result = commonUtil.itemApplyFilter(itemName, {
                  highlight: true,
                  dom: recordItem
                });
                if (!result) recordItem.style.display = "none";
              }
              recordBody.appendChild(recordItem);
            });
            record.appendChild(recordBody);
            recordsHTML += record.outerHTML;
          });
        }
        rowDiv.innerHTML = `
                    <label>${rowData.label}</label>
                    ${recordsHTML}
                `;
      },
      a: () => {
        rowDiv.innerHTML = `
                    <a href="${rowData.link}" target="_blank" rel="noopener noreferrer">${rowData.label}</a>
                `;
      },
        table_a: () => {
        const TOKEN_LIST = [
        ["EGG","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEzOTA3LCJ2Ijo1LCJyIjo2LCJpYXQiOjE2OTk0OTU4ODYsImV4cCI6MTcxNTA0Nzg4Nn0.lJbVqqi90MA3Q14VWjGsou9gU6MemqN_b4IHav1DE-w"],
        ["芙莉蓮","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE1MDI3LCJ2Ijo1LCJyIjo2LCJpYXQiOjE2OTU0MjM0NDAsImV4cCI6MTcxMDk3NTQ0MH0.f0fNkk-oepXG1Vwm_EHt0EbI_gj10Nv29AKC-EkeSJ8"],
        ["捲影","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE3MzA4LCJ2Ijo1LCJpYXQiOjE2ODUyNzkyOTcsImV4cCI6MTcwMDgzMTI5N30.QMJKbcYmL3QAAdK0SryKvXmJ2eqXITX8khH-enftzYE"],
        ["初音未來","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE3MzA3LCJ2Ijo1LCJpYXQiOjE2ODUyNzkxMTQsImV4cCI6MTcwMDgzMTExNH0.31Tc8ig7ousOP9WVVMnspkKVnHIscs1zJeWsagh1KEM"],
        ["太刀","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4MzM3LCJ2Ijo1LCJyIjo2LCJpYXQiOjE2OTI5NjE5NzgsImV4cCI6MTcwODUxMzk3OH0.XjdVPs8A67MKL3e0mlZCB2oDONceJTd_1njldWWZFyA"],
        ["貓咪女王","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2NTg2LCJ2Ijo1LCJyIjo1LCJpYXQiOjE2ODczNTEyMjQsImV4cCI6MTcwMjkwMzIyNH0.BmmdmntfgU6If8qe4rsH0PYtcHysZJc0cZvg9JLR8GI"],
        ["細劍","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4MjUzLCJ2Ijo1LCJpYXQiOjE2OTIwMDk2MDIsImV4cCI6MTcwNzU2MTYwMn0.GFhAizA69aTqLsvug7UP5Q85-obkMHGEZOIE43RJdSM"],
        ["77","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE1MzQwLCJ2Ijo1LCJyIjo2LCJpYXQiOjE2OTYyNTU2OTEsImV4cCI6MTcxMTgwNzY5MX0.mvmZPOQmiZW_M1VuqIk_ywTA3q1d6FyLo6zHqcNmOLw"],
        ["性慾人","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0MTI2LCJ2Ijo1LCJyIjo2LCJpYXQiOjE2OTM3MzMwMjEsImV4cCI6MTcwOTI4NTAyMX0.y2WZ1haQBwIZAsFBFnimwO4b6zKNZ8borBCf2E-atCM"],
        ["磚頭","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMyNTgsInYiOjUsInIiOjUsImlhdCI6MTY4ODQyNDg3NCwiZXhwIjoxNzAzOTc2ODc0fQ.J9Kb_xBbFUCSDKJnmCOSIAZ-ycnmw6nqBbEkRg-aCzI"],
        ["Neko3","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE5MSwidiI6NSwiciI6NSwiaWF0IjoxNjg2MTE2NzY0LCJleHAiOjE3MDE2Njg3NjR9.Qi5WNrli3DQgdUCzQJwXqP85BbkNa28LpK-cOm0xT1o"],
        ["鹹魚","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjczODUsInYiOjUsInIiOjIsImlhdCI6MTY4MjMxMzg1MywiZXhwIjoxNjk3ODY1ODUzfQ.hSTn7Zp4tFZfNUuCdNfMyDS7-i8bReW_DO2KoxiHhxQ"],
    ]

        const tableData = TOKEN_LIST;
        let gridRowHTML = "";
        if (!tableData.length) {
            gridRowHTML = `
            <div class="grid-row">
                <label>空</label>
            </div>`
        } else {
            tableData.forEach(arr => {
                if (arr[1] == "") {
                    return
                }
                const div = document.createElement("div");
                div.innerHTML = `
                    <label data-token="${arr[1]}">${arr[0]}</label>`
                div.className = "grid-row"

                gridRowHTML += div.outerHTML;
            });
        }
        rowDiv.innerHTML = `
            <label>${rowData.label}</label>
            <div class="grid" id="${rowData.id}">
                <div class="grid-row-header">${rowData.header}</div>
                ${gridRowHTML}
            </div>`
        rowDiv.querySelectorAll(".grid-row").forEach(row => {
            row.onclick = (e) => {
                let accountLabel = e.target;
                if (e.target.tagName.toLowerCase() != "label") {
                    accountLabel = accountLabel.querySelector('label');
                }
                const token = accountLabel.getAttribute("data-token");
                if (parseJwt(token)) {
                    localStorage.token = token;
                    location.reload();
                } else {
                    alert("token可能錯誤!!");
                }
            }
        });

        function parseJwt(token) {
          try {
              var base64Url = token.split('.')[1];
              var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));

              return JSON.parse(jsonPayload);
          } catch (e) {
              return null;
          }
      }
    },
      button: () => {
        rowDiv.innerHTML = `
                    <button class=${rowData.class}>${rowData.label} </button>
                `;
        rowDiv.querySelector("button").onclick = rowData.event;
      },
      customize: () => {
        rowDiv.className = "row table";
        rowDiv.innerHTML = rowData.html;
      }
    };
    type[rowData.type]();
  }
  const content = wrapper.querySelector(".content");
  const navbar = wrapper.querySelector(".navbar");
  panel.forEach((panel, index) => {
    if (panel.mobile && !commonUtil.isMobileDevice()) return;
    const panelDiv = document.createElement("div");
    panelDiv.className = "panel";
    panelDiv.innerHTML = `
            <div class="panel-header">
                <span>${panel.category}</span>
            </div>
            <div class="panel-body">
                <p class="description">${panel.description}</p>
            </div>
        `;
    const panelBody = panelDiv.querySelector(".panel-body");
    panel.rows.forEach(row => {
      const rowDiv = document.createElement("div");
      rowDiv.className = /table/.test(row.type) ? "row table" : "row";
      createRow(rowDiv, row);
      panelBody.appendChild(rowDiv);
    });
    content.appendChild(panelDiv);
    panelDiv.setAttribute("panel-index", index);
    //panel 切換
    const button = document.createElement('button');
    button.innerHTML = panel.category.length > 2 ? `${panel.category.substring(0, 2)}<br>${panel.category.substring(2)}` : panel.category;
    button.setAttribute("bind-panel-index", index);
    button.onclick = e => {
      content.querySelector("[expand]")?.removeAttribute("expand");
      content.querySelector(`.panel[panel-index="${button.getAttribute("bind-panel-index")}"]`)?.toggleAttribute("expand");
      navbar.querySelector("[active]")?.removeAttribute("active");
      button.toggleAttribute("active");
    };
    if (index === 0) {
      panelDiv.toggleAttribute("expand");
      button.toggleAttribute("active");
    }
    navbar.appendChild(button);
  });
  document.body.appendChild(wrapper);
}
function createExpBar() {
  const expContainer = document.createElement("div");
  expContainer.className = "exp-container";
  expContainer.innerHTML = `
    <div style="margin-right: 1rem;z-index: 1;" id="exp-bar-level-label"></div>
    <div style="margin-right: 1rem;z-index: 1;" id="exp-bar-exp-label"></div>
    <div id="exp-bar"></div>
    <div id="exp-bar-fill"></div>
    `;
  // const expBar = document.createElement("div");
  // const expBarFill = document.createElement("div");

  // expBar.id = "exp-bar"
  // expBarFill.id = "exp-bar-fill"

  // document.body.appendChild(expBar)
  document.body.appendChild(expContainer);
}
function registerSettingUIEvent() {
  // document.querySelector("#open-dialog-btn").onclick = () => {document.querySelector(".wrapper").style.display = ""}
  // document.querySelector("#close-dialog-btn").onclick = () => {document.querySelector(".wrapper").style.display = "none"}
  document.querySelector("#close-dialog-btn").onclick = () => {
    document.querySelector(".wrapper").remove();
    document.body.style.overflow = "";
  };
  document.querySelectorAll(".grid-row > button").forEach(btn => {
    btn.onclick = e => {
      const grid = e.currentTarget.parentElement.parentElement;
      const name = e.currentTarget.parentElement.querySelector("label").textContent;
      const bindSetting = grid.getAttribute("bind-setting");
      const tableList = settingStorage.get(bindSetting);
      settingStorage.set(bindSetting, tableList.filter(row => row !== name));
      settingStorage.save();
      e.currentTarget.parentElement.remove();
      if (grid.querySelectorAll(`.grid-row`).length === 0) {
        const spaceGridRow = document.createElement("div");
        spaceGridRow.innerHTML = "<label>空</label>";
        spaceGridRow.className = "grid-row";
        grid.appendChild(spaceGridRow);
      }
    };
  });
  document.querySelector("#reset-settings-btn").onclick = () => {
    SETTINGS = structuredClone(DEFAULT_SETTINGS);
    settingStorage.save();
    registerSettingUIEvent();
  };
  document.querySelector(".wrapper").onclick = e => {
    // if(e.target.className === "wrapper") e.target.style.display = "none";
    if (e.target.matches(".wrapper")) {
      e.target.remove();
      document.body.style.overflow = "";
    }
  };
}

},{"../storage/globalVars":8,"../storage/setting":9,"../utils/common":10}]},{},[1]);