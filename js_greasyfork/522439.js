// ==UserScript==
// @name         Kill NAO Public
// @namespace    zero.kill-nao-public.torn
// @version      1.1
// @description  quick kill
// @author       nao [2669774]
// @match        https://www.torn.com/loader.php?sid=attack*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522439/Kill%20NAO%20Public.user.js
// @updateURL https://update.greasyfork.org/scripts/522439/Kill%20NAO%20Public.meta.js
// ==/UserScript==

if (!localStorage.useTemp) {
  localStorage.useTemp = true;
}
if (!localStorage.weaponID) {
  localStorage.weaponID = 3;
}
if (!localStorage.switchWeapon) {
  localStorage.switchWeapon = false;
}
if (!localStorage.dontFinish) {
  localStorage.dontFinish = false;
}
if (!localStorage.lifeThreshold) {
  localStorage.lifeThreshold = 800;
}
if (!localStorage.switchWeaponId) {
  localStorage.switchWeaponId = 1;
}

function reset() {
  localStorage.attackResult = "mug";
  localStorage.useTemp = true;
  localStorage.weaponID = 3;
  localStorage.switchWeapon = false;
  localStorage.dontFinish = false;
  localStorage.lifeThreshold = 800;
  localStorage.switchWeaponId = 1;
}

let weaponID = localStorage.weaponID;
let fightResult = "mug";
let useTemp = localStorage.getItem("useTemp") === "true";
let switchWeapon = localStorage.getItem("switchWeapon") === "true";
let dontFinish = localStorage.getItem("dontFinish") === "true";
let lifeThreshold = localStorage.lifeThreshold;
let switchWeaponId = localStorage.switchWeaponId;

let rfcv = getRFC();
let useSelfHosp = false;

let execute = false;
let expercent = 0.19;

let url = window.location.href;
let targets = JSON.stringify(url.match(/user2ID=\d*/gm));

let attackIndex = 0;

let v = targets.substring(10, targets.length - 2);

function getRFC() {
  var rfc = $.cookie("rfc_v");
  if (!rfc) {
    var cookies = document.cookie.split("; ");
    for (var i in cookies) {
      var cookie = cookies[i].split("=");
      if (cookie[0] == "rfc_v") {
        return cookie[1];
      }
    }
  }
  return rfc;
}

function insert() {
  const start = `<button  style='width:150px;height:80px;' class="torn-btn zeroAttack" mode="leave">Leave</button>
<button  style='width:150px;height:80px;' class="torn-btn zeroAttack" mode="mug">Mug</button>
<button style='width:150px;height:80px;' class="torn-btn zeroAttack"mode="hosp">Hosp</button>
`;

  const resp = `<span id='response'>[KILLNAO]</span>`;
  const container = `<div id='attackContainer'></div>`;

  const configDiv = document.createElement("div");
  configDiv.id = "configDiv";
  configDiv.style.display = "flex";
  configDiv.style.flexWrap = "wrap";
  configDiv.style.justifyContent = "center";
  configDiv.style.alignItems = "center";
  configDiv.style.maxWidth = "100%";

  const useTempLabel = document.createElement("label");
  useTempLabel.innerText = "Use Temp";
  useTempLabel.style.margin = "5px";
  configDiv.append(useTempLabel);
  const useTempCheckbox = document.createElement("input");
  useTempCheckbox.type = "checkbox";
  useTempCheckbox.id = "useTempCheckbox";
  useTempCheckbox.checked = useTemp;
  useTempCheckbox.addEventListener("change", function () {
    useTemp = useTempCheckbox.checked;
    localStorage.useTemp = useTemp;
  });
  configDiv.append(useTempCheckbox);

  const switchWeaponLabel = document.createElement("label");
  switchWeaponLabel.innerText = "Switch Weapon";
  switchWeaponLabel.style.margin = "5px";
  configDiv.append(switchWeaponLabel);
  const switchWeaponCheckbox = document.createElement("input");
  switchWeaponCheckbox.type = "checkbox";
  switchWeaponCheckbox.id = "switchWeaponCheckbox";
  switchWeaponCheckbox.checked = switchWeapon;
  switchWeaponCheckbox.addEventListener("change", function () {
    switchWeapon = switchWeaponCheckbox.checked;
    localStorage.switchWeapon = switchWeapon;

    configDiv.remove();
    $("#attackContainer").remove();
    $("#response").remove();
    insert();
  });
  configDiv.append(switchWeaponCheckbox);

  if (switchWeapon) {
    const switchWeaponLabel = document.createElement("label");
    switchWeaponLabel.innerText = "Switch Weapon To ";
    switchWeaponLabel.style.margin = "5px";
    configDiv.append(switchWeaponLabel);

    const switchIDInput = document.createElement("select");
    switchIDInput.id = "weaponIDInput";
    switchIDInput.add(new Option("Primary", "1"));
    switchIDInput.add(new Option("Secondary", "2"));
    switchIDInput.add(new Option("Melee", "3"));
    for (let option of switchIDInput.options) {
      if (option.value == switchWeaponId) {
        option.selected = true;
      }
    }
    switchIDInput.addEventListener("change", function () {
      switchWeaponId = switchIDInput.value;
      localStorage.switchWeaponId = switchWeaponId;
    });

    configDiv.append(switchIDInput);
  }

  const dontFinishLabel = document.createElement("label");
  dontFinishLabel.innerText = "Don't Finish";
  dontFinishLabel.style.margin = "5px";
  configDiv.append(dontFinishLabel);
  const dontFinishCheckbox = document.createElement("input");
  dontFinishCheckbox.type = "checkbox";
  dontFinishCheckbox.id = "dontFinishCheckbox";
  dontFinishCheckbox.checked = dontFinish;
  dontFinishCheckbox.addEventListener("change", function () {
    dontFinish = dontFinishCheckbox.checked;
    localStorage.dontFinish = dontFinish;
  });
  configDiv.append(dontFinishCheckbox);

  const lifeThresholdLabel = document.createElement("label");
  lifeThresholdLabel.innerText = "Life Threshold";
  lifeThresholdLabel.style.margin = "5px";
  configDiv.append(lifeThresholdLabel);
  const lifeThresholdInput = document.createElement("input");
  lifeThresholdInput.type = "number";
  lifeThresholdInput.id = "lifeThresholdInput";
  lifeThresholdInput.value = lifeThreshold;
  lifeThresholdInput.min = 0;
  lifeThresholdInput.addEventListener("change", function () {
    lifeThreshold = lifeThresholdInput.value;
    localStorage.lifeThreshold = lifeThreshold;
  });
  configDiv.append(lifeThresholdInput);

  const resetButton = document.createElement("button");
  resetButton.id = "resetButton";
  resetButton.style.margin = "5px";
  resetButton.innerText = "Reset";
  resetButton.style.width = "60px";
  resetButton.style.padding = "5px";
  resetButton.style.backgroundColor = "#f44336";
  resetButton.style.color = "#fff";
  resetButton.style.borderRadius = "5px";
  resetButton.addEventListener("click", reset);
  configDiv.append(resetButton);

  const weaponIDLabel = document.createElement("label");
  weaponIDLabel.innerText = "Weapon";
  weaponIDLabel.style.margin = "5px";
  configDiv.append(weaponIDLabel);
  const weaponIDInput = document.createElement("select");
  weaponIDInput.id = "weaponIDInput";
  weaponIDInput.add(new Option("Primary", "1"));
  weaponIDInput.add(new Option("Secondary", "2"));
  weaponIDInput.add(new Option("Melee", "3"));
  for (let option of weaponIDInput.options) {
    if (option.value == weaponID) {
      option.selected = true;
    }
  }
  weaponIDInput.addEventListener("change", function () {
    weaponID = weaponIDInput.value;
    localStorage.weaponID = weaponID;
  });
  configDiv.append(weaponIDInput);

  $("#header-root").append(container);
  $("#header-root").append(configDiv);

  $("#attackContainer").append(start);

  $("#header-root").append(container);

  $("#attackContainer").css("display", "flex");
  $("#attackContainer").css("justify-content", "center");
  $("#attackContainer > button").css("margin", "10px");

  $("#header-root").append(resp);
  $("#response").css("display", "table");
  $("#response").css("margin", "0 auto");

  $(".zeroAttack").on("click", function () {
    let mode = $(this).attr("mode");
    fightResult = mode;
    run();
  });
}

function fstart() {
  console.log("start");
  const link = `https://www.torn.com/loader.php?sid=attackData&mode=json&rfcv=${rfcv}`;
  $.post(
    link,
    {
      sid: "attackData",
      mode: "json",
      user2ID: v,
      rfcv: rfcv,
    },
    function (statResp) {
      if (statResp.startErrorTitle || statResp.DB.defenderUser.life <= 1) {
        attackIndex = 0;
        $("#response").html(statResp.startErrorTitle || "Unconscious");
        $(".zeroAttack").removeClass("disabled");
        $(".zeroAttack").prop("disabled", false);
      } else if (statResp.DB.startButtonTimer) {
        $("#response").html(
          "Start in " + statResp.DB.startButtonTimer.timeLeft,
        );
        $(".zeroAttack").removeClass("disabled");
        $(".zeroAttack").prop("disabled", false);
      } else {
        rstart();
      }
    },
  );
}

function rstart() {
  $.post(
    "loader.php?sid=attackData&mode=json",
    {
      step: "startFight",
      user2ID: v,
    },
    function (result) {
      $(".zeroAttack").removeClass("disabled");
      $(".zeroAttack").prop("disabled", false);

      console.log(result);
      var stat = result.DB.hasOwnProperty("error");
      console.log(stat);
      if (stat) {
        attackIndex = 0;
        $("#response").html(result.DB.error);
        return;
      } else {
        let life = result.DB.defenderUser.life;

        $("#response").html("Started");

        if (switchWeapon && life <= lifeThreshold) {
          weaponID = switchWeaponId;
          attackIndex = 3;
          return;
        }

        if (useTemp) {
          attackIndex = 2;
        } else {
          attackIndex = 3;
        }
      }
    },
  );
}

function fattack() {
  console.log("attack");
  $.post(
    "loader.php?sid=attackData&mode=json&rfcv=" + rfcv,
    {
      step: "attack",
      user2ID: v,
      user1EquipedItemID: weaponID,
    },
    function (result) {
      $(".zeroAttack").removeClass("disabled");
      $(".zeroAttack").prop("disabled", false);

      var stat = result.DB.hasOwnProperty("error");
      if (stat) {
        attackIndex = 0;
        $("#response").html(result.DB.error);
        return;
      } else {
        let life = result.DB.defenderUser.life;
        let myLife = result.DB.attackerUser.life;
        let moveNo = result.DB.currentMove;

        $("#response").html(`ATTACKER: ${myLife} / DEFENDER: ${life}`);
        if (moveNo >= 25) {
          $("#response").html("Stalemate");
          attackIndex = 0;
          return;
        }
        if (switchWeapon && life <= lifeThreshold) {
          weaponID = 1;
        }

        if (
          weaponID == "1" &&
          result.DB.currentClips[0].attackerPrimaryRoundsLeft - 0 <= 0
        ) {
          weaponID = 3;
        }

        if (life <= 1) {
          attackIndex = 4;
          return;
        }

        if (myLife <= 1) {
          $("#response").html("Lost");
          attackIndex = 0;
          return;
        }
      }
    },
  );
}

function fhosp() {
  if (dontFinish) {
    $("#response").html("Don't Finish");
    return;
  }
  $.post(
    "loader.php?sid=attackData&mode=json",
    {
      step: "finish",
      fightResult: fightResult,
    },
    function (result) {
      setTimeout(function () {
        $(".zeroAttack").removeClass("disabled");
        $(".zeroAttack").prop("disabled", false);
      }, 2000);

      attackIndex = 0;

      var stat = result.DB.hasOwnProperty("error");
      if (stat) {
        attackIndex = 0;
        $("#response").html(result.DB.error);
        return;
      } else {
        $("#response").html(result.info.info);
      }
    },
  );
}

function ftemp() {
  $.post(
    "loader.php?sid=attackData&mode=json",
    {
      step: "attack",
      user2ID: v,
      user1EquipedItemID: 5,
    },
    function (result) {
      $(".zeroAttack").removeClass("disabled");
      $(".zeroAttack").prop("disabled", false);

      var stat = result.DB.hasOwnProperty("error");
      if (stat) {
        $("#response").html(result.DB.error);
        attackIndex = 0;
        return;
      } else {
        let life = result.DB.defenderUser.life;
        let myLife = result.DB.attackerUser.life;

        if (life <= 1) {
          attackIndex = 4;
          return;
        }
        if (myLife <= 1) {
          $("#response").html("Lost");
          attackIndex = 0;
          return;
        }

        attackIndex = 3;
        $("#response").html(`ATTACKER: ${myLife} / DEFENDER: ${life}`);
      }
    },
  );
}

const ATTACK_ORDER = [fstart, rstart, ftemp, fattack, fhosp];
insert();

function run() {
  $(".zeroAttack").prop("disabled", true);
  $(".zeroAttack").addClass("disabled");
  ATTACK_ORDER[attackIndex]();
}