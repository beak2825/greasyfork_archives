// ==UserScript==
// @name        Robotics vip rel
// @match       *://*.moomoo.io/*
// @grant       none
// @version      v2
// @author      Yurio,220ms
// @description good ms better player?
// @namespace https://greasyfork.org/users/1333420
// @downloadURL https://update.greasyfork.org/scripts/535719/Robotics%20vip%20rel.user.js
// @updateURL https://update.greasyfork.org/scripts/535719/Robotics%20vip%20rel.meta.js
// ==/UserScript==
setInterval(() => {
  console.clear();
}, 120000);
/*Visuals && Combat Mechanism:
Yurio
Oe
Brt3726
rim

tester / Bug Report:
Laplace/gowog
Wat
savior
zen*/
let serverID;
(function (p) {
  let v = {};
  function f(p2) {
    if (v[p2]) {
      return v[p2].exports;
    }
    let v2 = {
      exports: {}
    };
    p[p2](v2, v2.exports, f);
    v[p2] = v2;
    return v2.exports;
  }
  f.s = "_main_script_";
  return f(f.s);
})({
  "config.js": function (p3, p4) {
    p3.exports.maxScreenWidth = 1920;
    p3.exports.maxScreenHeight = 1080;
    p3.exports.serverUpdateRate = 9;
    p3.exports.maxPlayers = 40;
    p3.exports.maxPlayersHard = p3.exports.maxPlayers + 10;
    p3.exports.collisionDepth = 6;
    p3.exports.minimapRate = 3000;
    p3.exports.colGrid = 10;
    p3.exports.clientSendRate = 5;
    p3.exports.healthBarWidth = 50;
    p3.exports.healthBarPad = 4.5;
    p3.exports.iconPadding = 15;
    p3.exports.iconPad = 0.9;
    p3.exports.deathFadeout = 3000;
    p3.exports.crownIconScale = 60;
    p3.exports.crownPad = 35;
    p3.exports.chatCountdown = 3000;
    p3.exports.chatCooldown = 500;
    p3.exports.isSandbox = window.location.hostname == "sandbox.moomoo.io" ? true : false;
    p3.exports.maxAge = 100;
    p3.exports.gatherAngle = Math.PI / 2.6;
    p3.exports.gatherWiggle = 10;
    p3.exports.hitReturnRatio = 0.25;
    p3.exports.hitAngle = Math.PI / 2;
    p3.exports.playerScale = 35;
    p3.exports.playerSpeed = 0.0016;
    p3.exports.playerDecel = 0.993;
    p3.exports.nameY = 34;
    p3.exports.skinColors = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373"];
    p3.exports.animalCount = 7;
    p3.exports.aiTurnRandom = 0.06;
    p3.exports.cowNames = ["Sid", "Steph", "Bmoe", "Romn", "Jononthecool", "Fiona", "Vince", "Nathan", "Nick", "Flappy", "Ronald", "Otis", "Pepe", "Mc Donald", "Theo", "Fabz", "Oliver", "Jeff", "Jimmy", "Helena", "Reaper", "Ben", "Alan", "Naomi", "XYZ", "Clever", "Jeremy", "Mike", "Destined", "Stallion", "Allison", "Meaty", "Sophia", "Vaja", "Joey", "Pendy", "Murdoch", "Theo", "Jared", "July", "Sonia", "Mel", "Dexter", "Quinn", "Milky"];
    p3.exports.shieldAngle = Math.PI / 3;
    p3.exports.weaponVariants = [{
      id: 0,
      src: "",
      xp: 0,
      val: 1
    }, {
      id: 1,
      src: "_g",
      xp: 3000,
      val: 1.1
    }, {
      id: 2,
      src: "_d",
      xp: 7000,
      val: 1.18
    }, {
      id: 3,
      src: "_r",
      poison: true,
      xp: 12000,
      val: 1.18
    }];
    p3.exports.fetchVariant = function (p5) {
      var v3 = p5.weaponXP[p5.weaponIndex] || 0;
      for (var v4 = p3.exports.weaponVariants.length - 1; v4 >= 0; --v4) {
        if (v3 >= p3.exports.weaponVariants[v4].xp) {
          return p3.exports.weaponVariants[v4];
        }
      }
    };
    p3.exports.resourceTypes = ["wood", "food", "stone", "points"];
    p3.exports.areaCount = 7;
    p3.exports.treesPerArea = 9;
    p3.exports.bushesPerArea = 3;
    p3.exports.totalRocks = 32;
    p3.exports.goldOres = 7;
    p3.exports.riverWidth = 724;
    p3.exports.riverPadding = 114;
    p3.exports.waterCurrent = 0.0011;
    p3.exports.waveSpeed = 0.0001;
    p3.exports.waveMax = 1.3;
    p3.exports.treeScales = [150, 160, 165, 175];
    p3.exports.bushScales = [80, 85, 95];
    p3.exports.rockScales = [80, 85, 90];
    p3.exports.snowBiomeTop = 2400;
    p3.exports.snowSpeed = 0.75;
    p3.exports.maxNameLength = 15;
    p3.exports.mapScale = 14400;
    p3.exports.mapPingScale = 40;
    p3.exports.mapPingTime = 2200;
    p3.exports.volcanoScale = 320;
    p3.exports.innerVolcanoScale = 100;
    p3.exports.volcanoAnimalStrength = 2;
    p3.exports.volcanoAnimationDuration = 3200;
    p3.exports.volcanoAggressionRadius = 1440;
    p3.exports.volcanoAggressionPercentage = 0.2;
    p3.exports.volcanoDamagePerSecond = -1;
    p3.exports.volcanoLocationX = 13960;
    p3.exports.volcanoLocationY = 13960;
  },
  _UIS_client_: function (p6, p7) {
    let vF = p8 => document.getElementById(p8);
    p6.exports = {
      ads: {
        adCard: vF("adCard"),
        adContainer: vF("ad-container"),
        promoImg: vF("promoImg"),
        promoImageHolder: vF("promoImgHolder"),
        wideAdCard: vF("wideAdCard")
      },
      buttons: {
        store: vF("storeButton"),
        alliance: vF("allianceButton"),
        chat: vF("chatButton"),
        enterGame: vF("enterGame"),
        altchaCheckBox: vF("altcha_checkbox"),
        partyButton: vF("partyButton"),
        joinB: vF("joinPartyButton"),
        settingsButton: vF("settingsButton"),
        settingsButtonTitle: vF("settingsButton").getElementsByTagName("span")[0]
      },
      resources: {
        food: vF("foodDisplay"),
        wood: vF("woodDisplay"),
        stone: vF("stoneDisplay"),
        score: vF("scoreDisplay"),
        kill: vF("killCounter")
      },
      global: {
        menuText: vF("desktopInstructions"),
        setupCard: vF("setupCard"),
        guideCard: vF("guideCard"),
        gameUI: vF("gameUI"),
        gameName: vF("gameName"),
        mainMenu: vF("mainMenu"),
        storeMenu: vF("storeMenu"),
        nameInput: vF("nameInput"),
        gameCanvas: vF("gameCanvas"),
        gameContext: vF("gameCanvas").getContext("2d"),
        mapDisplay: vF("mapDisplay"),
        mapContext: vF("mapDisplay").getContext("2d"),
        shutdownDisplay: vF("shutdownDisplay"),
        pingDisplay: vF("pingDisplay"),
        loadingText: vF("loadingText"),
        diedText: vF("diedText"),
        ageText: vF("ageText"),
        ageBarBody: vF("ageBarBody"),
        allianceMenu: vF("allianceMenu"),
        allianceManager: vF("allianceManager"),
        notificationDisplay: vF("notificationDisplay"),
        leaderboardData: vF("leaderboardData"),
        actionBar: vF("actionBar"),
        playMusic: vF("playMusic"),
        upgradeCounter: vF("upgradeCounter"),
        chatBox: vF("chatBox"),
        altcha: vF("altcha")
      },
      holder: {
        menuCardHolder: vF("menuCardHolder"),
        itemInfoHolder: vF("itemInfoHolder"),
        upgradeHolder: vF("upgradeHolder"),
        allianceHolder: vF("allianceHolder"),
        skinColorHolder: vF("skinColorHolder"),
        storeHolder: vF("storeHolder"),
        chatHolder: vF("chatHolder")
      },
      server: {
        serverBrowser: vF("serverBrowser"),
        nativeResolutionOption: vF("nativeResolution"),
        showPingOption: vF("showPing")
      }
    };
  },
  _main_script_: function (p9, p10, p11) {
    var vP11 = p11("config.js");
    window.config = vP11;
    var vP112 = p11("_UIS_client_");
    var v5 = vP112.global.menuText;
    var v6 = vP112.global.setupCard;
    var v7 = vP112.global.guideCard;
    var v8 = vP112.global.gameName;
    var v9 = vP112.global.gameUI;
    var v10 = vP112.global.mainMenu;
    var v11 = vP112.global.storeMenu;
    var v12 = vP112.global.nameInput;
    var v13 = vP112.global.gameCanvas;
    var v14 = vP112.global.gameContext;
    var v15 = vP112.global.mapDisplay;
    var v16 = vP112.global.mapContext;
    var v17 = vP112.global.shutdownDisplay;
    var v18 = vP112.global.pingDisplay;
    var v19 = vP112.global.loadingText;
    var v20 = vP112.global.diedText;
    var v21 = vP112.global.ageText;
    var v22 = vP112.global.ageBarBody;
    var v23 = vP112.global.allianceMenu;
    var v24 = vP112.global.allianceManager;
    var v25 = vP112.global.notificationDisplay;
    var v26 = vP112.global.leaderboardData;
    var v27 = vP112.global.actionBar;
    var v28 = vP112.global.playMusic;
    var v29 = vP112.global.upgradeCounter;
    var v30 = vP112.global.chatBox;
    var v31 = vP112.global.altcha;
    var v32 = vP112.buttons.store;
    var v33 = vP112.buttons.alliance;
    var v34 = vP112.buttons.chat;
    var v35 = vP112.buttons.enterGame;
    var v36 = vP112.buttons.altchaCheckBox;
    var v37 = vP112.buttons.partyButton;
    var v38 = vP112.buttons.joinB;
    var v39 = vP112.buttons.settingsButton;
    var v40 = vP112.buttons.settingsButtonTitle;
    v34.remove();
    var v41 = vP112.resources.food;
    var v42 = vP112.resources.wood;
    var v43 = vP112.resources.stone;
    var v44 = vP112.resources.score;
    var v45 = vP112.resources.kill;
    var v46 = vP112.ads.adCard;
    var v47 = vP112.ads.adContainer;
    var v48 = vP112.ads.promoImg;
    var v49 = vP112.ads.promoImageHolder;
    var v50 = vP112.ads.wideAdCard;
    var v51 = Object.values(vP112.ads);
    v48.remove();
    v46.remove();
    v50.remove();
    var v52 = vP112.holder.menuCardHolder;
    var v53 = vP112.holder.itemInfoHolder;
    var v54 = vP112.holder.upgradeHolder;
    var v55 = vP112.holder.allianceHolder;
    var v56 = vP112.holder.skinColorHolder;
    var v57 = vP112.holder.storeHolder;
    var v58 = vP112.holder.chatHolder;
    var v59 = vP112.server.serverBrowser;
    var v60 = vP112.server.nativeResolutionOption;
    var v61 = vP112.server.showPingOption;
    var v62 = v13.getContext("2d");
    function f2(p12) {
      p12.style.opacity = "0";
      p12.style.transition = "opacity 0.5s ease, transform 0.3s ease";
      p12.style.transform = "scale(1)";
      p12.onmouseover = function () {
        p12.style.opacity = "1";
        p12.style.transform = "scale(1.05)";
      };
      p12.onmouseout = function () {
        p12.style.transform = "scale(1)";
      };
    }
    v15.style = "\n        left: 430px;\n        top: 10px;\n        width: 150px;\n        height: 150px;\n        ";
    let v63 = document.createElement("link");
    v63.href = "https://fonts.googleapis.com/css2?family=Lilita+One&display=swap";
    v63.rel = "stylesheet";
    document.head.appendChild(v63);
    v8.innerHTML = "MooMoo";
    v8.style.cssText = "\n        display: \"none\";\n        opacity: 0.85;\n        text-shadow: 0 1px 0 #c4c4c4, 0 2px 0 #c4c4c4, 0 3px 0 #c4c4c4, 0 4px 0 #c4c4c4, 0 5px 0 #c4c4c4, 0 6px 0 #c4c4c4, 0 7px 0 #c4c4c4, 0 8px 0 #c4c4c4, 0 9px 0 #c4c4c4;\n        font-size: 100px;\n        font-family: 'Lilita One', sans-serif;\n        opacity: 0;\n        transition: opacity 0.5s ease;\n        ";
    v31.style.display = "none";
    let vSetInterval = setInterval(() => {
      v36.click();
      let v64 = v31.querySelector(".altcha-label span");
      if (v64) {
        let v65 = v64.textContent.trim() === "Verified" && v35.classList.contains("disabled");
        if (v65) {
          location.reload();
        }
        if (v317) {
          clearInterval(vSetInterval);
        }
      }
    }, 890);
    window.addEventListener("load", () => {
      setTimeout(() => {
        const v66 = window.location.href;
        const v67 = v66.match(/[?&]server=([^&]+)/);
        if (v67 && v67[1]) {
          const vDecodeURIComponent = decodeURIComponent(v67[1]);
          serverID = vDecodeURIComponent;
        } else {
          location.reload();
        }
      }, 2000);
    });
    document.getElementById("promoImgHolder").append(document.getElementById("skinColorHolder"));
    document.getElementById("skinColorHolder").style.cssText = "\n        display: flex;\n        justify-content: center;\n        gap: 10px;\n        align-items: center;\n        flex-wrap: nowrap;\n        padding: 10px;\n        background-color: rgba(0, 0, 0, 0.25);\n        border-radius: 8px;\n        ";
    let v68 = document.createElement("div");
    v68.id = "serverMenu";
    v68.style.cssText = "\n    position: fixed;\n    top: 240px;\n    left: 1250px;\n    width: 280px;\n    opacity: 0;\n    height: auto;\n    max-height: 275px;\n    overflow-y: auto;\n    background-color: rgba(0, 0, 0, 0.45);\n    padding: 10px;\n    border-radius: 8px;\n    color: #fff;\n    font-family: Arial, sans-serif;\n    z-index: 1000;\n    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);\n    transition: opacity 0.3s ease-in-out;\n";
    document.body.appendChild(v68);
    let v69 = document.createElement("div");
    v69.style.cssText = "\n    display: flex;\n    flex-direction: column;\n    gap: 10px;\n    margin-bottom: 15px;\n    padding: 10px;\n";
    v68.appendChild(v69);
    let v70 = document.createElement("button");
    v70.textContent = "Join Test Server";
    v70.style.cssText = "\n    background-color: #28a745;\n    border: none;\n    color: white;\n    padding: 8px 10px;\n    border-radius: 4px;\n    cursor: pointer;\n    transition: background-color 0.3s;\n";
    v70.addEventListener("click", async () => {
      let v71 = await f3();
      let v72 = v71.filter(p13 => p13.playerCount === 0).sort((p14, p15) => p14.ping - p15.ping)[0];
      if (v72) {
        let v73 = location.protocol + "//" + location.hostname + "/?server=" + v72.region + ":" + v72.name;
        window.location.href = v73;
      } else {
        alert("Wla Pang test server");
      }
    });
    v69.appendChild(v70);
    let v74 = document.createElement("button");
    v74.textContent = "Join Active Server";
    v74.style.cssText = "\n    background-color: #007bff;\n    border: none;\n    color: white;\n    padding: 8px 10px;\n    border-radius: 4px;\n    cursor: pointer;\n    transition: background-color 0.3s;\n";
    v74.addEventListener("click", async () => {
      let v75 = await f3();
      let v76 = v75.sort((p16, p17) => {
        if (p16.playerCount === p17.playerCount) {
          return p16.ping - p17.ping;
        }
        return p17.playerCount - p16.playerCount;
      })[0];
      if (v76) {
        let v77 = location.protocol + "//" + location.hostname + "/?server=" + v76.region + ":" + v76.name;
        window.location.href = v77;
      } else {
        alert("wala nga ehh");
      }
    });
    v69.appendChild(v74);
    let v78 = document.createElement("div");
    v78.id = "game_servers";
    v68.appendChild(v78);
    let v79 = document.createElement("style");
    v79.innerHTML = "\n    #game_servers::-webkit-scrollbar {\n        width: 8px;\n    }\n    #game_servers::-webkit-scrollbar-track {\n        background: rgba(255, 255, 255, 0.1);\n    }\n    #game_servers::-webkit-scrollbar-thumb {\n        background: rgba(255, 255, 255, 0.4);\n        border-radius: 4px;\n    }\n    #game_servers::-webkit-scrollbar-thumb:hover {\n        background: rgba(255, 255, 255, 0.6);\n    }\n";
    document.head.appendChild(v79);
    window.regionsName = {
      "eu-west": "Frankfurt",
      gb: "London",
      "us-east": "Miami",
      "us-west": "Silicon Valley",
      au: "Sydney",
      sg: "Singapore",
      saopaulo: "São Paulo"
    };
    async function f3() {
      let v80 = location.host.replace(/\.moomoo\.io/, "");
      let vF2 = () => {
        if (/(sandbox|dev)/.test(v80)) {
          return "https://api-" + v80 + ".moomoo.io/servers?v=1.25";
        }
        return "https://api.moomoo.io/servers";
      };
      let v81 = await fetch(vF2());
      let v82 = await v81.json();
      await Promise.all(v82.map(async p18 => {
        let v83 = "https://" + p18.key + "." + p18.region + ".moomoo.io/ping/";
        let v84 = Date.now();
        try {
          await fetch(v83);
          p18.ping = Date.now() - v84;
        } catch (_0x3d3802) {
          p18.ping = Infinity;
        }
      }));
      return v82;
    }
    async function f4() {
      let v85 = await f3();
      let v86 = {};
      v85.forEach(p19 => {
        v86[p19.region] = v86[p19.region] || [];
        v86[p19.region].push(p19);
      });
      let v87 = [];
      for (let v88 in v86) {
        v87 = v87.concat(v86[v88]);
      }
      v87.sort((p20, p21) => {
        if (p20.ping === p21.ping) {
          return p21.playerCount - p20.playerCount;
        }
        return p20.ping - p21.ping;
      });
      let v89 = {};
      v78.childNodes.forEach(p22 => {
        v89[p22.dataset.serverKey] = p22;
      });
      v87.forEach(p23 => {
        let v90 = p23.region + ":" + p23.name;
        let v91 = v89[v90];
        if (!v91) {
          v91 = document.createElement("div");
          v91.dataset.serverKey = v90;
          v91.style.cssText = "\n                display: flex;\n                justify-content: space-between;\n                align-items: center;\n                background-color: rgba(255, 255, 255, 0.1);\n                border: 1px solid rgba(255, 255, 255, 0.2);\n                border-radius: 8px;\n                margin: 3px 0;\n                margin-bottom: 16px;\n                margin-left: 10px;\n                padding: 8px;\n            ";
          v78.appendChild(v91);
        }
        let v92 = p23.playerCount >= 25 ? "red" : p23.playerCount >= 15 ? "orange" : "green";
        let v93 = p23.ping < 150 ? "green" : p23.ping < 400 ? "orange" : p23.ping < 5000 ? "red" : "black";
        v91.innerHTML = "\n            " + (window.regionsName[p23.region] || p23.region) + " " + p23.name + "\n            (<span style=\"color: " + v92 + ";\">" + p23.playerCount + "</span>/" + p23.playerCapacity + ")\n            <span style=\"color: " + v93 + ";\">" + p23.ping + " ms</span>\n        ";
        let v94 = v91.querySelector("button");
        if (!v94) {
          v94 = document.createElement("button");
          v94.textContent = "Join";
          v94.style.cssText = "\n                background-color: #007bff;\n                border: none;\n                color: white;\n                padding: 5px 10px;\n                border-radius: 4px;\n                cursor: pointer;\n                transition: background-color 0.3s;\n            ";
          v91.appendChild(v94);
        }
        v94.onclick = () => {
          let v95 = location.protocol + "//" + location.hostname + "/?server=" + p23.region + ":" + p23.name;
          window.location.href = v95;
        };
      });
    }
    setInterval(f4, 5000);
    f4();
    f2(v49);
    f2(v6);
    v7.remove();
    v10.style.cssText = "\n        background: rgba(0, 0, 10, 0.45);\n        backdrop-filter: blur(7px);\n        border-radius: 6px;\n        ";
    v12.style.cssText = "\n        width: 350px;\n        height: 50px;\n        ";
    v12.placeholder = "Enter Username";
    v35.style.cssText = "\n        width: 95px;\n        height: 50px;\n        margin-left: 20px;\n        ";
    v35.innerHTML = "Play!";
    v49.style.cssText += "\n        width: auto;\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        background: rgba(0, 0, 0, 0);\n        padding: 20px;\n        border-radius: 10px;\n        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0);\n        ";
    v6.style.cssText += "\n        background: rgba(0, 0, 0, 0.45);\n        box-shadow: none;\n        display: flex;\n        width: 450px;\n        height: 50px;\n        border-radius: 10px;\n        margin-bottom: -20px;\n        margin-left: 70px;\n        ";
    v8.style.cssText = "\n        opacity: 0.85;\n        text-shadow: 0 1px 0 #c4c4c4, 0 2px 0 #c4c4c4, 0 3px 0 #c4c4c4, 0 4px 0 #c4c4c4, 0 5px 0 #c4c4c4, 0 6px 0 #c4c4c4, 0 7px 0 #c4c4c4, 0 8px 0 #c4c4c4, 0 9px 0 #c4c4c4;\n        font-size: 170px;\n        margin-bottom: -25px;\n        font-family: 'Lilita One', sans-serif;\n        opacity: 0;\n        ";
    setTimeout(() => {
      v8.style.opacity = "1";
      v6.style.opacity = "1";
      v7.style.opacity = "1";
      v49.style.opacity = "1";
      v68.style.opacity = "1";
    }, 2000);
    document.getElementById("loadingText").innerHTML = "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <style>\n\n        .progress-container {\n            top: 80%;\n            left: 50%;\n            transform: translate(-50%, -50%) scale(0.5);\n            width: 75%;\n            background-color: gray;\n            border-radius: 25px;\n            overflow: hidden;\n            height: 90px;\n            position: relative;\n        }\n        .progress-bar {\n            width: 0%;\n            margin-top: 5px;\n            margin-left: 5px;\n            height: 80%;\n            background-color: #fff;\n            border-radius: 25px;\n            animation: loading 1.1s linear forwards;\n            position: relative;\n        }\n        @keyframes loading {\n            from { width: 0%; }\n            to { width: 98%; }\n        }\n        .progress-text {\n            position: absolute;\n            top: 50%;\n            font-size: 50px;\n            left: 50%;\n            transform: translate(-50%, -50%);\n            color: black;\n            font-weight: bold;\n        }\n    </style>\n</head>\n<body>\n    <div class=\"progress-container\">\n        <div class=\"progress-bar\">\n            <div class=\"progress-text\" id=\"progressText\">Loading...</div>\n        </div>\n    </div>\n</body>\n</html>\n    ";
    let v96 = true;
    let v97 = console.log;
    let v98 = window.location.hostname == "127.0.0.1";
    let v99 = true;
    function f5(p24) {
      return document.getElementById(p24);
    }
    var vF3 = function (p25) {
      var v100 = {};
      function f6(p26) {
        if (v100[p26]) {
          return v100[p26].exports;
        }
        var v101 = v100[p26] = {
          i: p26,
          l: false,
          exports: {}
        };
        p25[p26].call(v101.exports, v101, v101.exports, f6);
        v101.l = true;
        return v101.exports;
      }
      f6.m = p25;
      f6.c = v100;
      f6.d = function (p27, p28, p29) {
        const v102 = {
          enumerable: true,
          get: p29
        };
        if (!f6.o(p27, p28)) {
          Object.defineProperty(p27, p28, v102);
        }
      };
      f6.r = function (p30) {
        const v103 = {
          value: true
        };
        if (typeof Symbol != "undefined" && Symbol.toStringTag) {
          Object.defineProperty(p30, Symbol.toStringTag, {
            value: "Module"
          });
        }
        Object.defineProperty(p30, "__esModule", v103);
      };
      f6.t = function (p31, p32) {
        if (p32 & 1) {
          p31 = f6(p31);
        }
        if (p32 & 8) {
          return p31;
        }
        if (p32 & 4 && typeof p31 == "object" && p31 && p31.__esModule) {
          return p31;
        }
        var v104 = Object.create(null);
        const v105 = {
          enumerable: true,
          value: p31
        };
        f6.r(v104);
        Object.defineProperty(v104, "default", v105);
        if (p32 & 2 && typeof p31 != "string") {
          for (var v106 in p31) {
            f6.d(v104, v106, function (p33) {
              return p31[p33];
            }.bind(null, v106));
          }
        }
        return v104;
      };
      f6.n = function (p34) {
        var v107 = p34 && p34.__esModule ? function () {
          return p34.default;
        } : function () {
          return p34;
        };
        f6.d(v107, "a", v107);
        return v107;
      };
      f6.o = function (p35, p36) {
        return Object.prototype.hasOwnProperty.call(p35, p36);
      };
      f6.p = "/bin/";
      return f6(f6.s = 0);
    }([function (p37, p38, p39) {
      var v108 = {};
      var vP39 = p39(1);
      var vP392 = p39(2);
      var vP393 = p39(3);
      p37.exports = v108;
      var v109 = 1;
      v108.js = function () {
        var v110;
        var v111;
        var v112;
        var v113 = 1.4;
        var v114 = false;
        var v115 = {};
        var v116 = {};
        var v117 = {};
        var v118 = {};
        var v119 = true;
        var v120 = {};
        var v121 = [];
        var v122 = Number.MAX_VALUE;
        var v123 = false;
        this.setAcceptableTiles = function (p40) {
          if (p40 instanceof Array) {
            v112 = p40;
          } else if (!isNaN(parseFloat(p40)) && isFinite(p40)) {
            v112 = [p40];
          }
        };
        this.enableSync = function () {
          v114 = true;
        };
        this.disableSync = function () {
          v114 = false;
        };
        this.enableDiagonals = function () {
          v123 = true;
        };
        this.disableDiagonals = function () {
          v123 = false;
        };
        this.setGrid = function (p41) {
          v110 = p41;
          for (var v124 = 0; v124 < v110.length; v124++) {
            for (var v125 = 0; v125 < v110[0].length; v125++) {
              v116[v110[v124][v125]] ||= 1;
            }
          }
        };
        this.setTileCost = function (p42, p43) {
          v116[p42] = p43;
        };
        this.setAdditionalPointCost = function (p44, p45, p46) {
          if (v117[p45] === undefined) {
            v117[p45] = {};
          }
          v117[p45][p44] = p46;
        };
        this.removeAdditionalPointCost = function (p47, p48) {
          if (v117[p48] !== undefined) {
            delete v117[p48][p47];
          }
        };
        this.removeAllAdditionalPointCosts = function () {
          v117 = {};
        };
        this.setDirectionalCondition = function (p49, p50, p51) {
          if (v118[p50] === undefined) {
            v118[p50] = {};
          }
          v118[p50][p49] = p51;
        };
        this.removeAllDirectionalConditions = function () {
          v118 = {};
        };
        this.setIterationsPerCalculation = function (p52) {
          v122 = p52;
        };
        this.avoidAdditionalPoint = function (p53, p54) {
          if (v115[p54] === undefined) {
            v115[p54] = {};
          }
          v115[p54][p53] = 1;
        };
        this.stopAvoidingAdditionalPoint = function (p55, p56) {
          if (v115[p56] !== undefined) {
            delete v115[p56][p55];
          }
        };
        this.enableCornerCutting = function () {
          v119 = true;
        };
        this.disableCornerCutting = function () {
          v119 = false;
        };
        this.stopAvoidingAllAdditionalPoints = function () {
          v115 = {};
        };
        this.findPath = function (p57, p58, p59, p60, p61) {
          function f7(p62) {
            if (v114) {
              p61(p62);
            } else {
              setTimeout(function () {
                p61(p62);
              });
            }
          }
          if (v112 === undefined) {
            throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");
          }
          if (v110 === undefined) {
            throw new Error("You can't set a path without first calling setGrid() on EasyStar.");
          }
          if (p57 < 0 || p58 < 0 || p59 < 0 || p60 < 0 || p57 > v110[0].length - 1 || p58 > v110.length - 1 || p59 > v110[0].length - 1 || p60 > v110.length - 1) {
            throw new Error("Your start or end point is outside the scope of your grid.");
          }
          if (p57 !== p59 || p58 !== p60) {
            var v126 = v110[p60][p59];
            var v127 = false;
            for (var v128 = 0; v128 < v112.length; v128++) {
              if (v126 === v112[v128]) {
                v127 = true;
                break;
              }
            }
            if (v127 !== false) {
              var v129 = new vP39();
              v129.openList = new vP393(function (p63, p64) {
                return p63.bestGuessDistance() - p64.bestGuessDistance();
              });
              v129.isDoneCalculating = false;
              v129.nodeHash = {};
              v129.startX = p57;
              v129.startY = p58;
              v129.endX = p59;
              v129.endY = p60;
              v129.callback = f7;
              v129.openList.push(f12(v129, v129.startX, v129.startY, null, 1));
              p60 = v109++;
              v120[p60] = v129;
              v121.push(p60);
              return p60;
            }
            f7(null);
          } else {
            f7([]);
          }
        };
        this.cancelPath = function (p65) {
          return p65 in v120 && (delete v120[p65], true);
        };
        this.calculate = function () {
          if (v121.length !== 0 && v110 !== undefined && v112 !== undefined) {
            for (v111 = 0; v111 < v122; v111++) {
              if (v121.length === 0) {
                return;
              }
              if (v114) {
                v111 = 0;
              }
              var v130 = v121[0];
              var v131 = v120[v130];
              if (v131 !== undefined) {
                if (v131.openList.size() !== 0) {
                  var v132 = v131.openList.pop();
                  if (v131.endX !== v132.x || v131.endY !== v132.y) {
                    if ((v132.list = 0) < v132.y) {
                      f8(v131, v132, 0, -1, +f11(v132.x, v132.y - 1));
                    }
                    if (v132.x < v110[0].length - 1) {
                      f8(v131, v132, 1, 0, +f11(v132.x + 1, v132.y));
                    }
                    if (v132.y < v110.length - 1) {
                      f8(v131, v132, 0, 1, +f11(v132.x, v132.y + 1));
                    }
                    if (v132.x > 0) {
                      f8(v131, v132, -1, 0, +f11(v132.x - 1, v132.y));
                    }
                    if (v123) {
                      if (v132.x > 0 && v132.y > 0 && (v119 || f9(v110, v112, v132.x, v132.y - 1, v132) && f9(v110, v112, v132.x - 1, v132.y, v132))) {
                        f8(v131, v132, -1, -1, v113 * f11(v132.x - 1, v132.y - 1));
                      }
                      if (v132.x < v110[0].length - 1 && v132.y < v110.length - 1 && (v119 || f9(v110, v112, v132.x, v132.y + 1, v132) && f9(v110, v112, v132.x + 1, v132.y, v132))) {
                        f8(v131, v132, 1, 1, v113 * f11(v132.x + 1, v132.y + 1));
                      }
                      if (v132.x < v110[0].length - 1 && v132.y > 0 && (v119 || f9(v110, v112, v132.x, v132.y - 1, v132) && f9(v110, v112, v132.x + 1, v132.y, v132))) {
                        f8(v131, v132, 1, -1, v113 * f11(v132.x + 1, v132.y - 1));
                      }
                      if (v132.x > 0 && v132.y < v110.length - 1 && (v119 || f9(v110, v112, v132.x, v132.y + 1, v132) && f9(v110, v112, v132.x - 1, v132.y, v132))) {
                        f8(v131, v132, -1, 1, v113 * f11(v132.x - 1, v132.y + 1));
                      }
                    }
                  } else {
                    var v133 = [];
                    const v134 = {
                      x: v132.x,
                      y: v132.y
                    };
                    v133.push(v134);
                    for (var v135 = v132.parent; v135 != null;) {
                      v133.push({
                        x: v135.x,
                        y: v135.y
                      });
                      v135 = v135.parent;
                    }
                    v133.reverse();
                    v131.callback(v133);
                    delete v120[v130];
                    v121.shift();
                  }
                } else {
                  v131.callback(null);
                  delete v120[v130];
                  v121.shift();
                }
              } else {
                v121.shift();
              }
            }
          }
        };
        function f8(p66, p67, p68, p69, p70) {
          p68 = p67.x + p68;
          p69 = p67.y + p69;
          if ((v115[p69] === undefined || v115[p69][p68] === undefined) && !!f9(v110, v112, p68, p69, p67)) {
            if ((p69 = f12(p66, p68, p69, p67, p70)).list === undefined) {
              p69.list = 1;
              p66.openList.push(p69);
            } else if (p67.costSoFar + p70 < p69.costSoFar) {
              p69.costSoFar = p67.costSoFar + p70;
              p69.parent = p67;
              p66.openList.updateItem(p69);
            }
          }
        }
        function f9(p71, p72, p73, p74, p75) {
          var v136 = v118[p74] && v118[p74][p73];
          if (v136) {
            var v_0x1ac44e = f10(p75.x - p73, p75.y - p74);
            if (!function () {
              for (var v137 = 0; v137 < v136.length; v137++) {
                if (v136[v137] === v_0x1ac44e) {
                  return true;
                }
              }
              return false;
            }()) {
              return false;
            }
          }
          for (var v138 = 0; v138 < p72.length; v138++) {
            if (p71[p74][p73] === p72[v138]) {
              return true;
            }
          }
          return false;
        }
        function f10(p76, p77) {
          if (p76 === 0 && p77 === -1) {
            return v108.TOP;
          }
          if (p76 === 1 && p77 === -1) {
            return v108.TOP_RIGHT;
          }
          if (p76 === 1 && p77 === 0) {
            return v108.RIGHT;
          }
          if (p76 === 1 && p77 === 1) {
            return v108.BOTTOM_RIGHT;
          }
          if (p76 === 0 && p77 === 1) {
            return v108.BOTTOM;
          }
          if (p76 === -1 && p77 === 1) {
            return v108.BOTTOM_LEFT;
          }
          if (p76 === -1 && p77 === 0) {
            return v108.LEFT;
          }
          if (p76 === -1 && p77 === -1) {
            return v108.TOP_LEFT;
          }
          throw new Error("These differences are not valid: " + p76 + ", " + p77);
        }
        function f11(p78, p79) {
          return v117[p79] && v117[p79][p78] || v116[v110[p79][p78]];
        }
        function f12(p80, p81, p82, p83, p84) {
          if (p80.nodeHash[p82] !== undefined) {
            if (p80.nodeHash[p82][p81] !== undefined) {
              return p80.nodeHash[p82][p81];
            }
          } else {
            p80.nodeHash[p82] = {};
          }
          var v139 = f13(p81, p82, p80.endX, p80.endY);
          var p84 = p83 !== null ? p83.costSoFar + p84 : 0;
          var v139 = new vP392(p83, p81, p82, p84, v139);
          return p80.nodeHash[p82][p81] = v139;
        }
        function f13(p85, p86, p87, p88) {
          var v140;
          var v141;
          if (v123) {
            if ((v140 = Math.abs(p85 - p87)) < (v141 = Math.abs(p86 - p88))) {
              return v113 * v140 + v141;
            } else {
              return v113 * v141 + v140;
            }
          } else {
            return (v140 = Math.abs(p85 - p87)) + (v141 = Math.abs(p86 - p88));
          }
        }
      };
      v108.TOP = "TOP";
      v108.TOP_RIGHT = "TOP_RIGHT";
      v108.RIGHT = "RIGHT";
      v108.BOTTOM_RIGHT = "BOTTOM_RIGHT";
      v108.BOTTOM = "BOTTOM";
      v108.BOTTOM_LEFT = "BOTTOM_LEFT";
      v108.LEFT = "LEFT";
      v108.TOP_LEFT = "TOP_LEFT";
    }, function (p89, p90) {
      p89.exports = function () {
        this.pointsToAvoid = {};
        this.startX;
        this.callback;
        this.startY;
        this.endX;
        this.endY;
        this.nodeHash = {};
        this.openList;
      };
    }, function (p91, p92) {
      p91.exports = function (p93, p94, p95, p96, p97) {
        this.parent = p93;
        this.x = p94;
        this.y = p95;
        this.costSoFar = p96;
        this.simpleDistanceToTarget = p97;
        this.bestGuessDistance = function () {
          return this.costSoFar + this.simpleDistanceToTarget;
        };
      };
    }, function (p98, p99, p100) {
      p98.exports = p100(4);
    }, function (p101, p102, p103) {
      var v142;
      var v143;
      (function () {
        var v144;
        var v145;
        var v146;
        var v147;
        var v148;
        var v149;
        var v150;
        var v151;
        var v152;
        var v153;
        var v154;
        var v155;
        var v156;
        var v157;
        var v158;
        function f14(p104) {
          this.cmp = p104 ?? v145;
          this.nodes = [];
        }
        v146 = Math.floor;
        v153 = Math.min;
        v145 = function (p105, p106) {
          if (p105 < p106) {
            return -1;
          } else if (p106 < p105) {
            return 1;
          } else {
            return 0;
          }
        };
        v152 = function (p107, p108, p109, p110, p111) {
          var v159;
          if (p109 == null) {
            p109 = 0;
          }
          if (p111 == null) {
            p111 = v145;
          }
          if (p109 < 0) {
            throw new Error("lo must be non-negative");
          }
          for (p110 == null && (p110 = p107.length); p109 < p110;) {
            if (p111(p108, p107[v159 = v146((p109 + p110) / 2)]) < 0) {
              p110 = v159;
            } else {
              p109 = v159 + 1;
            }
          }
          [].splice.apply(p107, [p109, p109 - p109].concat(p108));
          return p108;
        };
        v149 = function (p112, p113, p114) {
          if (p114 == null) {
            p114 = v145;
          }
          p112.push(p113);
          return v157(p112, 0, p112.length - 1, p114);
        };
        v148 = function (p115, p116) {
          var v160;
          var v161;
          if (p116 == null) {
            p116 = v145;
          }
          v160 = p115.pop();
          if (p115.length) {
            v161 = p115[0];
            p115[0] = v160;
            v158(p115, 0, p116);
          } else {
            v161 = v160;
          }
          return v161;
        };
        v151 = function (p117, p118, p119) {
          var v162;
          if (p119 == null) {
            p119 = v145;
          }
          v162 = p117[0];
          p117[0] = p118;
          v158(p117, 0, p119);
          return v162;
        };
        v150 = function (p120, p121, p122) {
          var v163;
          if (p122 == null) {
            p122 = v145;
          }
          if (p120.length && p122(p120[0], p121) < 0) {
            p121 = (v163 = [p120[0], p121])[0];
            p120[0] = v163[1];
            v158(p120, 0, p122);
          }
          return p121;
        };
        v147 = function (p123, p124) {
          var v164;
          var v165;
          var v166;
          var v167;
          var v168;
          var v169;
          if (p124 == null) {
            p124 = v145;
          }
          v168 = [];
          v165 = 0;
          v166 = (v167 = function () {
            v169 = [];
            for (var v170 = 0, vV146 = v146(p123.length / 2); vV146 >= 0 ? v170 < vV146 : vV146 < v170; vV146 >= 0 ? v170++ : v170--) {
              v169.push(v170);
            }
            return v169;
          }.apply(this).reverse()).length;
          for (; v165 < v166; v165++) {
            v164 = v167[v165];
            v168.push(v158(p123, v164, p124));
          }
          return v168;
        };
        v156 = function (p125, p126, p127) {
          if (p127 == null) {
            p127 = v145;
          }
          if ((p126 = p125.indexOf(p126)) !== -1) {
            v157(p125, 0, p126, p127);
            return v158(p125, p126, p127);
          }
        };
        v154 = function (p128, p129, p130) {
          var v171;
          var v172;
          var v173;
          var v174;
          var v175;
          if (p130 == null) {
            p130 = v145;
          }
          if (!(v172 = p128.slice(0, p129)).length) {
            return v172;
          }
          v147(v172, p130);
          v173 = 0;
          v174 = (v175 = p128.slice(p129)).length;
          for (; v173 < v174; v173++) {
            v171 = v175[v173];
            v150(v172, v171, p130);
          }
          return v172.sort(p130).reverse();
        };
        v155 = function (p131, p132, p133) {
          var v176;
          var v177;
          var v178;
          var v179;
          var v180;
          var v181;
          var v182;
          var v183;
          var v184;
          if (p133 == null) {
            p133 = v145;
          }
          if (p132 * 10 <= p131.length) {
            if (!(v178 = p131.slice(0, p132).sort(p133)).length) {
              return v178;
            }
            v177 = v178[v178.length - 1];
            v179 = 0;
            v181 = (v182 = p131.slice(p132)).length;
            for (; v179 < v181; v179++) {
              if (p133(v176 = v182[v179], v177) < 0) {
                v152(v178, v176, 0, null, p133);
                v178.pop();
                v177 = v178[v178.length - 1];
              }
            }
            return v178;
          }
          v147(p131, p133);
          v184 = [];
          v180 = 0;
          v183 = v153(p132, p131.length);
          for (; v183 >= 0 ? v180 < v183 : v183 < v180; v183 >= 0 ? ++v180 : --v180) {
            v184.push(v148(p131, p133));
          }
          return v184;
        };
        v157 = function (p134, p135, p136, p137) {
          var v185;
          var v186;
          var v187;
          if (p137 == null) {
            p137 = v145;
          }
          v185 = p134[p136];
          while (p135 < p136 && p137(v185, v186 = p134[v187 = p136 - 1 >> 1]) < 0) {
            p134[p136] = v186;
            p136 = v187;
          }
          return p134[p136] = v185;
        };
        v158 = function (p138, p139, p140) {
          var v188;
          var v189;
          var v190;
          var v191;
          var v192;
          if (p140 == null) {
            p140 = v145;
          }
          v189 = p138.length;
          v190 = p138[v192 = p139];
          v188 = p139 * 2 + 1;
          while (v188 < v189) {
            if ((v191 = v188 + 1) < v189 && !(p140(p138[v188], p138[v191]) < 0)) {
              v188 = v191;
            }
            p138[p139] = p138[v188];
            v188 = (p139 = v188) * 2 + 1;
          }
          p138[p139] = v190;
          return v157(p138, v192, p139, p140);
        };
        f14.push = v149;
        f14.pop = v148;
        f14.replace = v151;
        f14.pushpop = v150;
        f14.heapify = v147;
        f14.updateItem = v156;
        f14.nlargest = v154;
        f14.nsmallest = v155;
        f14.prototype.push = function (p141) {
          return v149(this.nodes, p141, this.cmp);
        };
        f14.prototype.pop = function () {
          return v148(this.nodes, this.cmp);
        };
        f14.prototype.peek = function () {
          return this.nodes[0];
        };
        f14.prototype.contains = function (p142) {
          return this.nodes.indexOf(p142) !== -1;
        };
        f14.prototype.replace = function (p143) {
          return v151(this.nodes, p143, this.cmp);
        };
        f14.prototype.pushpop = function (p144) {
          return v150(this.nodes, p144, this.cmp);
        };
        f14.prototype.heapify = function () {
          return v147(this.nodes, this.cmp);
        };
        f14.prototype.updateItem = function (p145) {
          return v156(this.nodes, p145, this.cmp);
        };
        f14.prototype.clear = function () {
          return this.nodes = [];
        };
        f14.prototype.empty = function () {
          return this.nodes.length === 0;
        };
        f14.prototype.size = function () {
          return this.nodes.length;
        };
        f14.prototype.clone = function () {
          var v193 = new f14();
          v193.nodes = this.nodes.slice(0);
          return v193;
        };
        f14.prototype.toArray = function () {
          return this.nodes.slice(0);
        };
        f14.prototype.insert = f14.prototype.push;
        f14.prototype.top = f14.prototype.peek;
        f14.prototype.front = f14.prototype.peek;
        f14.prototype.has = f14.prototype.contains;
        f14.prototype.copy = f14.prototype.clone;
        v144 = f14;
        v142 = [];
        if ((v143 = typeof (v143 = function () {
          return v144;
        }) == "function" ? v143.apply(p102, v142) : v143) !== undefined) {
          p101.exports = v143;
        }
      }).call(this);
    }]);
    let v194 = new vF3.js();
    "use strict";
    let v195 = document.createElement("link");
    v195.rel = "stylesheet";
    v195.href = "https://fonts.googleapis.com/css?family=Ubuntu:700";
    v195.type = "text/css";
    document.body.append(v195);
    window.oncontextmenu = function () {
      return false;
    };
    vP11.anotherVisual = false;
    vP11.useWebGl = false;
    vP11.resetRender = false;
    function f15(p146) {
      return new Promise(p147 => {
        setTimeout(() => {
          p147();
        }, p146);
      });
    }
    let v196 = false;
    let v197;
    if (typeof Storage !== "undefined") {
      v197 = true;
    }
    function f16(p148, p149) {
      if (v197) {
        localStorage.setItem(p148, p149);
      }
    }
    function f17(p150) {
      if (v197) {
        localStorage.removeItem(p150);
      }
    }
    function f18(p151) {
      if (v197) {
        return localStorage.getItem(p151);
      }
      return null;
    }
    let vF4 = function (p152, p153) {
      try {
        let v198 = JSON.parse(f18(p152));
        if (typeof v198 === "object") {
          return p153;
        } else {
          return v198;
        }
      } catch (_0x256d7d) {
        return p153;
      }
    };
    function f19() {
      return {
        help: {
          desc: "Show Commands",
          action: function (p154) {
            for (let v199 in vF19) {
              f21("/" + v199, vF19[v199].desc, "lime", 1);
            }
          }
        },
        clear: {
          desc: "Clear Chats",
          action: function (p155) {
            f22();
          }
        },
        debug: {
          desc: "Debug Mod For Development",
          action: function (p156) {
            f96(v286);
            f21("Debug", "Done", "#99ee99", 1);
          }
        },
        play: {
          desc: "Play Music ( /play [link] )",
          action: function (p157) {
            let v200 = p157.split(" ");
            if (v200[1]) {
              let v201 = new Audio(v200[1]);
              v201.play();
            } else {
              f21("Warn", "Enter Link ( /play [link] )", "#99ee99", 1);
            }
          }
        },
        bye: {
          desc: "Leave Game",
          action: function (p158) {
            window.leave();
          }
        }
      };
    }
    function f20() {
      return {
        killChat: true,
        autoBuy: false,
        autoBuyEquip: true,
        alwaysFlipper: false,
        autoQonSync: true,
        anti1tick: true,
        autoPush: true,
        revTick: false,
        revInsta: false,
        doSpikeOnReverse: true,
        hammerBreakerOptimisation: true,
        autoPlay: false,
        autoBreakSpike: true,
        safeWalk: false,
        spikeTick: true,
        predictTick: true,
        autoPlace: true,
        autoReplace: true,
        autoPrePlace: true,
        antiTrap: true,
        slowOT: false,
        attackDir: false,
        noDir: false,
        showDir: true,
        autoRespawn: true
      };
    }
    let vF19 = f19();
    let vF20 = f20();
    window.removeConfigs = function () {
      for (let v202 in vF20) {
        f17(v202, vF20[v202]);
      }
    };
    for (let v203 in vF20) {
      vF20[v203] = vF4(v203, vF20[v203]);
    }
    class C {
      constructor(p159) {
        this.element = p159;
      }
      add(p160) {
        if (!this.element) {
          return undefined;
        }
        this.element.innerHTML += p160;
      }
      newLine(p161) {
        let v204 = "<br>";
        if (p161 > 0) {
          v204 = "";
          for (let v205 = 0; v205 < p161; v205++) {
            v204 += "<br>";
          }
        }
        this.add(v204);
      }
      checkBox(p162) {
        let v206 = "<input type = \"checkbox\"";
        if (p162.id) {
          v206 += " id = " + p162.id;
        }
        if (p162.style) {
          v206 += " style = " + p162.style.replaceAll(" ", "");
        }
        if (p162.class) {
          v206 += " class = " + p162.class;
        }
        if (p162.checked) {
          v206 += " checked";
        }
        if (p162.onclick) {
          v206 += " onclick = " + p162.onclick;
        }
        v206 += ">";
        this.add(v206);
      }
      text(p163) {
        let v207 = "<input type = \"text\"";
        if (p163.id) {
          v207 += " id = " + p163.id;
        }
        if (p163.style) {
          v207 += " style = " + p163.style.replaceAll(" ", "");
        }
        if (p163.class) {
          v207 += " class = " + p163.class;
        }
        if (p163.size) {
          v207 += " size = " + p163.size;
        }
        if (p163.maxLength) {
          v207 += " maxLength = " + p163.maxLength;
        }
        if (p163.value) {
          v207 += " value = " + p163.value;
        }
        if (p163.placeHolder) {
          v207 += " placeHolder = " + p163.placeHolder.replaceAll(" ", "&nbsp;");
        }
        v207 += ">";
        this.add(v207);
      }
      select(p164) {
        let v208 = "<select";
        if (p164.id) {
          v208 += " id = " + p164.id;
        }
        if (p164.style) {
          v208 += " style = " + p164.style.replaceAll(" ", "");
        }
        if (p164.class) {
          v208 += " class = " + p164.class;
        }
        v208 += ">";
        for (let v209 in p164.option) {
          v208 += "<option value = " + p164.option[v209].id;
          if (p164.option[v209].selected) {
            v208 += " selected";
          }
          v208 += ">" + v209 + "</option>";
        }
        v208 += "</select>";
        this.add(v208);
      }
      button(p165) {
        let v210 = "<button";
        if (p165.id) {
          v210 += " id = " + p165.id;
        }
        if (p165.style) {
          v210 += " style = " + p165.style.replaceAll(" ", "");
        }
        if (p165.class) {
          v210 += " class = " + p165.class;
        }
        if (p165.onclick) {
          v210 += " onclick = " + p165.onclick;
        }
        v210 += ">";
        if (p165.innerHTML) {
          v210 += p165.innerHTML;
        }
        v210 += "</button>";
        this.add(v210);
      }
      selectMenu(p166) {
        let v211 = "<select";
        if (!p166.id) {
          alert("please put id skid");
          return;
        }
        window[p166.id + "Func"] = function () {};
        if (p166.id) {
          v211 += " id = " + p166.id;
        }
        if (p166.style) {
          v211 += " style = " + p166.style.replaceAll(" ", "");
        }
        if (p166.class) {
          v211 += " class = " + p166.class;
        }
        v211 += " onchange = window." + (p166.id + "Func") + "()";
        v211 += ">";
        let v212;
        let v213 = 0;
        for (let v214 in p166.menu) {
          v211 += "<option value = " + ("option_" + v214) + " id = " + ("O_" + v214);
          if (p166.menu[v214]) {
            v211 += " checked";
          }
          v211 += " style = \"color: " + (p166.menu[v214] ? "#000" : "#fff") + "; background: " + (p166.menu[v214] ? "#8ecc51" : "#cc5151") + ";\">" + v214 + "</option>";
          v213++;
        }
        v211 += "</select>";
        this.add(v211);
        v213 = 0;
        for (let v215 in p166.menu) {
          window[v215 + "Func"] = function () {
            p166.menu[v215] = f5("check_" + v215).checked ? true : false;
            f16(v215, p166.menu[v215]);
            f5("O_" + v215).style.color = p166.menu[v215] ? "#000" : "#fff";
            f5("O_" + v215).style.background = p166.menu[v215] ? "#8ecc51" : "#cc5151";
          };
          this.checkBox({
            id: "check_" + v215,
            style: "display: " + (v213 == 0 ? "inline-block" : "none") + ";",
            class: "checkB",
            onclick: "window." + (v215 + "Func") + "()",
            checked: p166.menu[v215]
          });
          v213++;
        }
        v212 = "check_" + f5(p166.id).value.split("_")[1];
        window[p166.id + "Func"] = function () {
          f5(v212).style.display = "none";
          v212 = "check_" + f5(p166.id).value.split("_")[1];
          f5(v212).style.display = "inline-block";
        };
      }
    }
    ;
    class C2 {
      constructor() {
        this.element = null;
        this.action = null;
        this.divElement = null;
        this.startDiv = function (p167, p168) {
          let v216 = document.createElement("div");
          if (p167.id) {
            v216.id = p167.id;
          }
          if (p167.style) {
            v216.style = p167.style;
          }
          if (p167.class) {
            v216.className = p167.class;
          }
          this.element.appendChild(v216);
          this.divElement = v216;
          let v217 = new C(v216);
          if (typeof p168 == "function") {
            p168(v217);
          }
        };
        this.addDiv = function (p169, p170) {
          let v218 = document.createElement("div");
          if (p169.id) {
            v218.id = p169.id;
          }
          if (p169.style) {
            v218.style = p169.style;
          }
          if (p169.class) {
            v218.className = p169.class;
          }
          if (p169.appendID) {
            f5(p169.appendID).appendChild(v218);
          }
          this.divElement = v218;
          let v219 = new C(v218);
          if (typeof p170 == "function") {
            p170(v219);
          }
        };
      }
      set(p171) {
        this.element = f5(p171);
        this.action = new C(this.element);
      }
      resetHTML(p172) {
        if (p172) {
          this.element.innerHTML = "";
        } else {
          this.element.innerHTML = "";
        }
      }
      setStyle(p173) {
        this.element.style = p173;
      }
      setCSS(p174) {
        this.action.add("<style>" + p174 + "</style>");
      }
    }
    ;
    let v220 = new C2();
    let v221 = document.createElement("div");
    v221.id = "nightMode";
    document.body.appendChild(v221);
    v220.set("nightMode");
    v220.setStyle("\n            display: none;\n            position: absolute;\n            pointer-events: none;\n            background-color: rgb(0, 0, 100);\n            opacity: 0;\n            top: 0%;\n            width: 100%;\n            height: 100%;\n            animation-duration: 5s;\n            animation-name: night2;\n            ");
    v220.resetHTML();
    v220.setCSS("\n            @keyframes night1 {\n                from {opacity: 0;}\n                to {opacity: 0.35;}\n            }\n            @keyframes night2 {\n                from {opacity: 0.35;}\n                to {opacity: 0;}\n            }\n            ");
    let v222 = document.createElement("div");
    v222.id = "menuDiv";
    document.body.appendChild(v222);
    v220.set("menuDiv");
    v220.setStyle("\n            position: absolute;\n            left: 20px;\n            top: 20px;\n            display: none;\n            ");
    v220.resetHTML();
    v220.setCSS("\n        .leaderboardItem {\n    float: left;\n    display: inline-block;\n    font-size: 13px;\n    text-align: center;\n    max-width: max-content;\n    position: relative;\n    left: 50%;\n    transform: translateX(-50%);\n    text-shadow: -1.1px -1.1px 0 #000, 1.1px -1.1px 0 #000, -1.1px 1.1px 0 #000, 1.1px 1.1px 0 #000;\n    font-family: Ubuntu, sans-serif;\n    margin-top: 1.2px;\n}\n\n            .menuClass{\n                color: #fff;\n                font-size: 31px;\n                text-align: left;\n                padding: 10px;\n                padding-top: 7px;\n                padding-bottom: 5px;\n                width: 300px;\n                background-color: rgba(0, 0, 0, 0.25);\n                -webkit-border-radius: 4px;\n                -moz-border-radius: 4px;\n                border-radius: 4px;\n            }\n            .menuC {\n                display: none;\n                font-family: \"Hammersmith One\";\n                font-size: 12px;\n                max-height: 180px;\n                overflow-y: scroll;\n                -webkit-touch-callout: none;\n                -webkit-user-select: none;\n                -khtml-user-select: none;\n                -moz-user-select: none;\n                -ms-user-select: none;\n                user-select: none;\n            }\n            .menuB {\n                text-align: center;\n                background-color: rgb(25, 25, 25);\n                color: #fff;\n                -webkit-border-radius: 4px;\n                -moz-border-radius: 4px;\n                border-radius: 4px;\n                border: 2px solid #000;\n                cursor: pointer;\n            }\n            .menuB:hover {\n                border: 2px solid #fff;\n            }\n            .menuB:active {\n                color: rgb(25, 25, 25);\n                background-color: rgb(200, 200, 200);\n            }\n            .customText {\n                color: #000;\n                -webkit-border-radius: 4px;\n                -moz-border-radius: 4px;\n                border-radius: 4px;\n                border: 2px solid #000;\n            }\n            .customText:focus {\n                background-color: yellow;\n            }\n            .checkB {\n                position: relative;\n                top: 2px;\n                accent-color: #888;\n                cursor: pointer;\n            }\n            .Cselect {\n                -webkit-border-radius: 4px;\n                -moz-border-radius: 4px;\n                border-radius: 4px;\n                background-color: rgb(75, 75, 75);\n                color: #fff;\n                border: 1px solid #000;\n            }\n            #menuChanger {\n                position: absolute;\n                right: 10px;\n                top: 10px;\n                background-color: rgba(0, 0, 0, 0);\n                color: #fff;\n                border: none;\n                cursor: pointer;\n            }\n            #menuChanger:hover {\n                color: #000;\n            }\n            ::-webkit-scrollbar {\n                width: 10px;\n            }\n            ::-webkit-scrollbar-track {\n                opacity: 0;\n            }\n            ::-webkit-scrollbar-thumb {\n                background-color: rgb(25, 25, 25);\n                -webkit-border-radius: 4px;\n                -moz-border-radius: 4px;\n                border-radius: 4px;\n            }\n            ::-webkit-scrollbar-thumb:active {\n                background-color: rgb(230, 230, 230);\n            }\n            ");
    v220.startDiv({
      id: "menuHeadLine",
      class: "menuClass"
    }, p175 => {
      p175.add("Mod:");
      p175.button({
        id: "menuChanger",
        class: "material-icons",
        innerHTML: "sync",
        onclick: "window.changeMenu()"
      });
      v220.addDiv({
        id: "menuButtons",
        style: "display: block; overflow-y: visible;",
        class: "menuC",
        appendID: "menuHeadLine"
      }, p176 => {
        p176.button({
          class: "menuB",
          innerHTML: "Debug",
          onclick: "window.debug()"
        });
        p176.button({
          class: "menuB",
          innerHTML: "Night Mode",
          onclick: "window.toggleNight()"
        });
      });
      v220.addDiv({
        id: "menuMain",
        style: "display: block",
        class: "menuC",
        appendID: "menuHeadLine"
      }, p177 => {
        p177.button({
          class: "menuB",
          innerHTML: "Toggle Wasd Mode",
          onclick: "window.wasdMode()"
        });
        p177.newLine();
        p177.add("Weapon Grinder: ");
        p177.checkBox({
          id: "weaponGrind",
          class: "checkB",
          onclick: "window.startGrind()"
        });
        p177.newLine(2);
        v220.addDiv({
          style: "font-size: 20px; color: #99ee99;",
          appendID: "menuMain"
        }, p178 => {
          p178.add("Developing Settings:");
        });
        p177.newLine();
        p177.add("New Healing Beta:");
        p177.checkBox({
          id: "healingBeta",
          class: "checkB",
          checked: true
        });
        p177.newLine();
        p177.add("CAmera");
        p177.checkBox({
          id: "camSexy",
          class: "checkB",
          checked: false
        });
      });
      v220.addDiv({
        id: "menuConfig",
        class: "menuC",
        appendID: "menuHeadLine"
      }, p179 => {
        p179.add("AutoPlacer Placement Tick: ");
        p179.text({
          id: "autoPlaceTick",
          class: "customText",
          value: "2",
          size: "2em",
          maxLength: "1"
        });
        p179.newLine();
        p179.add("Configs: ");
        const v223 = {
          id: "configsChanger",
          class: "Cselect",
          menu: vF20
        };
        p179.selectMenu(v223);
        p179.newLine();
        p179.add("InstaKill Type: ");
        const v224 = {
          id: "instaType",
          class: "Cselect",
          option: {}
        };
        v224.option.OneShot = {
          id: "oneShot",
          selected: true
        };
        v224.option.Spammer = {};
        v224.option.Spammer.id = "spammer";
        p179.select(v224);
        p179.newLine();
        p179.add("AntiBull Type: ");
        const v225 = {
          id: "antiBullType",
          class: "Cselect",
          option: {}
        };
        v225.option["Disable AntiBull"] = {};
        v225.option["When Reloaded"] = {};
        v225.option["Primary Reloaded"] = {};
        v225.option["Disable AntiBull"].id = "noab";
        v225.option["Disable AntiBull"].selected = true;
        v225.option["When Reloaded"].id = "abreload";
        v225.option["Primary Reloaded"].id = "abalway";
        p179.select(v225);
        p179.newLine();
        p179.add("Preplacer Type: ");
        const v226 = {
          id: "preplaceMore",
          class: "Cselect",
          option: {}
        };
        v226.option["For SpikeTick"] = {};
        v226.option["For retrap"] = {};
        v226.option["For SpikeTick"].id = "spike";
        v226.option["For retrap"].id = "trap";
        v226.option["For retrap"].selected = true;
        p179.select(v226);
        p179.newLine();
        p179.add("Hat Changer Type: ");
        p179.select({
          id: "hatType",
          class: "Cselect",
          option: {
            "Assassin Gear": {
              id: "ag"
            },
            "Bush Gear": {
              id: "bg"
            },
            Normal: {
              id: "norm",
              selected: true
            },
            "Hat Loop": {
              id: "loop"
            }
          }
        });
        p179.newLine();
        p179.add("Backup Nobull Insta: ");
        p179.checkBox({
          id: "backupNobull",
          class: "checkB",
          checked: true
        });
        p179.newLine();
        p179.add("Turret Gear Combat Assistance: ");
        p179.checkBox({
          id: "turretCombat",
          class: "checkB"
        });
        p179.newLine();
        p179.add("Safe AntiSpikeTick: ");
        p179.checkBox({
          id: "safeAntiSpikeTick",
          class: "checkB",
          checked: true
        });
        p179.newLine();
        const v227 = {
          id: "songChat",
          class: "Cselect",
          option: {}
        };
        v227.option["Park Chinois"] = {
          id: "song1"
        };
        v227.option["Gas Gas Gas"] = {};
        v227.option.Verbatim = {};
        v227.option["Dead of night"] = {};
        v227.option["I see a dreamer"] = {};
        v227.option["Sailor Song"] = {};
        v227.option["My ordinary life"] = {};
        v227.option["Dont Stand So Close"] = {};
        v227.option["Everything is awesome"] = {};
        v227.option["Candles on fire"] = {};
        v227.option["Gas Gas Gas"].id = "song2";
        v227.option.Verbatim.id = "song3";
        v227.option["Dead of night"].id = "song4";
        v227.option["I see a dreamer"].id = "song5";
        v227.option["Sailor Song"].id = "song6";
        v227.option["My ordinary life"].id = "song7";
        v227.option["Dont Stand So Close"].id = "song8";
        v227.option["Everything is awesome"].id = "song9";
        v227.option["Everything is awesome"].selected = true;
        v227.option["Candles on fire"].id = "song10";
        p179.select(v227);
        p179.newLine();
        p179.add("Target Player: ");
        p179.text({
          id: "targetSid",
          class: "customText",
          value: "0",
          size: "3em",
          maxLength: "2"
        });
        p179.newLine();
        p179.add("Player Follower: ");
        p179.checkBox({
          id: "followPlayer",
          class: "checkB",
          checked: false
        });
      });
      v220.addDiv({
        id: "menuOther",
        class: "menuC",
        appendID: "menuHeadLine"
      }, p180 => {
        p180.newLine();
        p180.button({
          class: "menuB",
          innerHTML: "Reset Break Objects",
          onclick: "window.resBuild()"
        });
        p180.newLine();
        p180.add("sync chat: ");
        p180.text({
          id: "syncChat",
          class: "customText",
          value: "wasdwasd",
          size: "30em",
          maxLength: "30"
        });
        p180.newLine();
        p180.add("primary weapon sync");
        p180.checkBox({
          id: "serverSync",
          class: "checkB",
          checked: false
        });
        p180.newLine();
        p180.add("Break Objects Range: ");
        p180.text({
          id: "breakRange",
          class: "customText",
          value: "700",
          size: "3em",
          maxLength: "4"
        });
        p180.newLine();
        p180.add("Predict Movement Type: ");
        const v228 = {
          id: "predictType",
          class: "Cselect",
          option: {}
        };
        v228.option["Disable Render"] = {};
        v228.option["X/Y and 2"] = {
          id: "pre2"
        };
        v228.option["X/Y and 3"] = {};
        v228.option["Disable Render"].id = "disableRender";
        v228.option["Disable Render"].selected = true;
        v228.option["X/Y and 3"].id = "pre3";
        p180.select(v228);
        p180.newLine();
        p180.add("Render Placers: ");
        p180.checkBox({
          id: "placeVis",
          class: "checkB",
          checked: true
        });
        p180.newLine();
        p180.add("Visuals: ");
        const v229 = {
          id: "visualType",
          class: "Cselect",
          option: {}
        };
        v229.option["Old Shit"] = {};
        v229.option["New shit"] = {};
        v229.option["Old Shit"].id = "ueh1";
        v229.option["New shit"].id = "ueh2";
        v229.option["New shit"].selected = true;
        p180.select(v229);
        p180.newLine(2);
        p180.button({
          class: "menuB",
          innerHTML: "Toggle Fbots Circle",
          onclick: "window.toggleBotsCircle()"
        });
        p180.newLine();
        p180.add("Circle Rad: ");
        p180.text({
          id: "circleRad",
          class: "customText",
          value: "200",
          size: "3em",
          maxLength: "4"
        });
        p180.newLine();
        p180.add("Rad Speed: ");
        p180.text({
          id: "radSpeed",
          class: "customText",
          value: "0.1",
          size: "2em",
          maxLength: "3"
        });
        p180.newLine(2);
        p180.add("Cross World: ");
        p180.checkBox({
          id: "funni",
          class: "checkB"
        });
        p180.newLine();
        p180.button({
          class: "menuB",
          innerHTML: "Toggle Another Visual",
          onclick: "window.toggleVisual()"
        });
        p180.newLine();
      });
    });
    let v230 = document.createElement("div");
    v230.id = "menuChatDiv";
    document.body.appendChild(v230);
    v220.set("menuChatDiv");
    v220.setStyle("\n            position: absolute;\n            display: block;\n            left: 10px;\n            top: 10px;\n            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.65);\n            ");
    v220.resetHTML();
    v220.setCSS("\n            .chDiv{\n                color: #fff;\n                padding: 5px;\n                width: 400px;\n                height: 240px;\n                background-color: rgba(0, 0, 0, 0.35);\n            }\n            .chMainDiv{\n                font-family: \"Ubuntu\";\n                font-size: 12px;\n                max-height: 195px;\n                overflow-y: scroll;\n                -webkit-touch-callout: none;\n                -webkit-user-select: none;\n                -khtml-user-select: none;\n                -moz-user-select: none;\n                -ms-user-select: none;\n                user-select: none;\n            }\n            .chMainBox{\n                position: absolute;\n                left: 5px;\n                bottom: 10px;\n                width: 395px;\n                height: 30px;\n                background-color: rgb(128, 128, 128, 0.35);\n                -webkit-border-radius: 4px;\n                -moz-border-radius: 4px;\n                border-radius: 4px;\n                color: #fff;\n                font-family: \"Ubuntu\";\n                font-size: 12px;\n                border: none;\n                outline: none;\n            }\n            ");
    v220.startDiv({
      id: "mChDiv",
      class: "chDiv"
    }, p181 => {
      v220.addDiv({
        id: "mChMain",
        class: "chMainDiv",
        appendID: "mChDiv"
      }, p182 => {});
      p181.text({
        id: "mChBox",
        class: "chMainBox",
        placeHolder: "To chat click here or press \"Enter\" key"
      });
    });
    let vF5 = f5("mChMain");
    let vF52 = f5("mChBox");
    let v231 = false;
    let v232 = 0;
    vF52.value = "";
    vF52.addEventListener("focus", () => {
      v231 = true;
    });
    vF52.addEventListener("blur", () => {
      v231 = false;
    });
    function f21(p183, p184, p185, p186) {
      v220.set("menuChatDiv");
      p185 = p185 || "white";
      let v233 = new Date();
      let v234 = v233.getMinutes();
      let v235 = v233.getHours();
      let v236 = v235 >= 12 ? "PM" : "AM";
      let v237 = "";
      if (!p186) {
        v237 += "<span style=\"color: white;\">[" + (v235 % 12 + ":" + v234 + " " + v236) + "] </span>";
      }
      if (p183) {
        v237 += "" + p183;
      }
      if (p184) {
        v237 += (p183 ? ": " : !p186 ? " " : "") + p184 + "\n";
      }
      v220.addDiv({
        id: "menuChDisp" + v232,
        style: "color: " + p185,
        appendID: "mChMain"
      }, p187 => {
        p187.add(v237);
      });
      vF5.scrollTop = vF5.scrollHeight;
      v232++;
    }
    function f22() {
      vF5.innerHTML = "";
      v232 = 0;
      f21("Script", "Thank You for Using this mod, Have fun!", "#0f0", 1);
    }
    f22();
    let v238 = 0;
    let v239 = ["menuMain", "menuConfig", "menuOther"];
    window.changeMenu = function () {
      f5(v239[v238 % v239.length]).style.display = "none";
      v238++;
      f5(v239[v238 % v239.length]).style.display = "block";
    };
    let v240 = false;
    let vUndefined = undefined;
    let vUndefined2 = undefined;
    let v241 = false;
    let v242 = 0;
    let v243 = 110;
    let v244 = 1000;
    let v245 = {
      sec: false
    };
    let v246 = {
      tick: 0,
      tickQueue: [],
      tickBase: function (p188, p189) {
        if (this.tickQueue[this.tick + p189]) {
          this.tickQueue[this.tick + p189].push(p188);
        } else {
          this.tickQueue[this.tick + p189] = [p188];
        }
      },
      tickRate: 1000 / vP11.serverUpdateRate,
      tickSpeed: 0,
      lastTick: performance.now()
    };
    let v247 = [];
    let v248 = false;
    let v249 = {
      last: 0,
      time: 0,
      ltime: 0
    };
    let v250 = ["cc", 1, "__proto__"];
    WebSocket.prototype.nsend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (p190) {
      if (!vUndefined) {
        vUndefined = this;
        vUndefined.addEventListener("message", function (p191) {
          f25(p191);
        });
        vUndefined.addEventListener("close", p192 => {
          if (p192.code == 4001) {
            window.location.reload();
          }
        });
      }
      if (vUndefined == this) {
        v248 = false;
        let v251 = new Uint8Array(p190);
        let v252 = window.msgpack.decode(v251);
        let v253 = v252[0];
        v251 = v252[1];
        if (v253 == "6") {
          if (v251[0]) {
            let v254 = [];
            let v255;
            v254.forEach(p193 => {
              if (v251[0].indexOf(p193) > -1) {
                v255 = "";
                for (let v256 = 0; v256 < p193.length; ++v256) {
                  if (v256 == 1) {
                    v255 += String.fromCharCode(0);
                  }
                  v255 += p193[v256];
                }
                let v257 = new RegExp(p193, "g");
                v251[0] = v251[0].replace(v257, v255);
              }
            });
            v251[0] = v251[0].slice(0, 30);
          }
        } else if (v253 == "L") {
          v251[0] = v251[0] + String.fromCharCode(0).repeat(7);
          v251[0] = v251[0].slice(0, 7);
        } else if (v253 == "M") {
          v251[0].name = v251[0].name == "" ? "unknown" : v251[0].name;
          v251[0].moofoll = true;
          v251[0].skin = v251[0].skin == 10 ? "__proto__" : v251[0].skin;
          v250 = [v251[0].name, v251[0].moofoll, v251[0].skin];
        } else if (v253 == "D") {
          if (v293.lastDir == v251[0] || [null, undefined].includes(v251[0])) {
            v248 = true;
          } else {
            v293.lastDir = v251[0];
          }
        } else if (v253 == "F") {
          if (!v251[2]) {
            v248 = true;
          } else if (![null, undefined].includes(v251[1])) {
            v293.lastDir = v251[1];
          }
        } else if (v253 == "K") {
          if (!v251[1]) {
            v248 = true;
          }
        } else if (v253 == "S") {
          v689.wait = !v689.wait;
          v248 = true;
        } else if (v253 == "f") {
          if (v251[1]) {
            if (v286.moveDir == v251[0]) {
              v248 = true;
            }
            v286.moveDir = v251[0];
          } else {
            v286.moveTime = Date.now();
            v248 = true;
          }
        }
        if (!v248) {
          let v258 = window.msgpack.encode([v253, v251]);
          this.nsend(v258);
          if (!v245.sec) {
            v245.sec = true;
            setTimeout(() => {
              v245.sec = false;
              v242 = 0;
            }, v244);
          }
          v242++;
        }
      } else {
        this.nsend(p190);
      }
    };
    function f23(p194) {
      let v259 = Array.prototype.slice.call(arguments, 1);
      let v260 = window.msgpack.encode([p194, v259]);
      vUndefined.send(v260);
    }
    function f24(p195) {
      let v261 = Array.prototype.slice.call(arguments, 1);
      let v262 = window.msgpack.encode([p195, v261]);
      vUndefined.nsend(v262);
    }
    const v263 = {
      send: f23
    };
    let vV263 = v263;
    function f25(p196) {
      let v264 = new Uint8Array(p196.data);
      let v265 = window.msgpack.decode(v264);
      let v266 = v265[0];
      v264 = v265[1];
      const v267 = {
        A: f97,
        C: f98,
        D: f99,
        E: f100,
        a: f112,
        G: f113,
        H: f114,
        I: f115,
        J: f116,
        K: f117,
        L: f118,
        M: f119,
        N: f120,
        O: f101,
        P: f104,
        Q: f108,
        R: f109,
        S: f105,
        T: f106,
        U: f107,
        V: f121,
        X: f122,
        Y: f123,
        Z: f124,
        "2": f125,
        "3": f126,
        "4": f127,
        "5": f128,
        "6": f130,
        "7": f131,
        "8": f132,
        "9": f176,
        "0": f102
      };
      let vV267 = v267;
      if (v266 == "io-init") {
        vUndefined2 = v264[0];
      } else if (vV267[v266]) {
        vV267[v266].apply(undefined, v264);
      }
    }
    Math.lerpAngle = function (p197, p198, p199) {
      let v268 = Math.abs(p198 - p197);
      if (v268 > Math.PI) {
        if (p197 > p198) {
          p198 += Math.PI * 2;
        } else {
          p197 += Math.PI * 2;
        }
      }
      let v269 = p198 + (p197 - p198) * p199;
      if (v269 >= 0 && v269 <= Math.PI * 2) {
        return v269;
      }
      return v269 % (Math.PI * 2);
    };
    CanvasRenderingContext2D.prototype.roundRect = function (p200, p201, p202, p203, p204) {
      if (p202 < p204 * 2) {
        p204 = p202 / 2;
      }
      if (p203 < p204 * 2) {
        p204 = p203 / 2;
      }
      if (p204 < 0) {
        p204 = 0;
      }
      this.beginPath();
      this.moveTo(p200 + p204, p201);
      this.arcTo(p200 + p202, p201, p200 + p202, p201 + p203, p204);
      this.arcTo(p200 + p202, p201 + p203, p200, p201 + p203, p204);
      this.arcTo(p200, p201 + p203, p200, p201, p204);
      this.arcTo(p200, p201, p200 + p202, p201, p204);
      this.closePath();
      return this;
    };
    let v270 = false;
    let vUndefined3 = undefined;
    let vUndefined4 = undefined;
    const v271 = {
      animationTime: 0,
      land: null,
      lava: null,
      x: vP11.volcanoLocationX,
      y: vP11.volcanoLocationY
    };
    var vV271 = v271;
    let v272 = false;
    let v273 = {
      mex: 0,
      mey: 0
    };
    let v274 = {
      active: false,
      x: 0,
      y: 0,
      aim: 0,
      info: {},
      dist: 0
    };
    let v275 = [];
    let v276 = [];
    let v277 = [];
    let v278 = [];
    let v279 = [];
    let v280 = [];
    let v281 = [];
    let v282 = [];
    let v283 = [];
    let v284 = [];
    let v285 = [];
    let v286;
    let v287;
    let v288;
    let v289 = [];
    let v290 = [];
    let v291 = [];
    let v292 = 0;
    let v293 = {
      reloaded: false,
      waitHit: 0,
      autoAim: false,
      revAim: false,
      ageInsta: true,
      reSync: false,
      bullTick: 0,
      anti0Tick: 0,
      predictSpikes: 0,
      antiSync: false,
      safePrimary: function (p205) {
        return [0, 8].includes(p205.primaryIndex);
      },
      safeSecondary: function (p206) {
        return [10, 11, 14].includes(p206.secondaryIndex);
      },
      lastDir: 0,
      autoPush: false,
      pushData: {},
      millPlacePos: {
        x: 0,
        y: 0
      },
      antiInsta: false
    };
    function f26(p207, p208) {
      return p207.find(p209 => p209.id == p208);
    }
    function f27(p210, p211) {
      return p210.find(p212 => p212.sid == p211);
    }
    function f28(p213) {
      return f26(v278, p213);
    }
    function f29(p214) {
      return f27(v278, p214);
    }
    function f30(p215) {
      return f27(v277, p215);
    }
    function f31(p216) {
      return f27(v282, p216);
    }
    function f32(p217) {
      return f27(v282, p217);
    }
    let v294;
    let v295;
    let v296 = vP11.maxScreenWidth;
    let v297 = vP11.maxScreenHeight;
    let v298 = 1;
    let v299;
    let v300;
    let v301 = performance.now();
    let v302;
    let v303;
    let v304;
    let v305 = 0;
    let v306 = 0;
    let v307 = 1;
    let v308 = 0;
    let v309 = "#525252";
    let v310 = "#3d3f42";
    let v311 = 5.5;
    let v312 = true;
    let v313 = true;
    let v314 = {};
    const v315 = {
      "87": [0, -1],
      "38": [0, -1],
      "83": [0, 1],
      "40": [0, 1],
      "65": [-1, 0],
      "37": [-1, 0],
      "68": [1, 0],
      "39": [1, 0]
    };
    let vV315 = v315;
    let v316 = 0;
    let v317 = false;
    let v318 = {};
    let v319 = {
      place: 0,
      placeSpawnPads: 0
    };
    let v320;
    let v321 = [];
    let v322 = true;
    window.onblur = function () {
      v322 = false;
    };
    window.onfocus = function () {
      v322 = true;
      if (v286 && v286.alive) {}
    };
    let v323 = [];
    let v324 = [];
    let v325 = [];
    let v326 = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];
    class C3 {
      constructor() {
        let v327 = Math.abs;
        let v328 = Math.cos;
        let v329 = Math.sin;
        let v330 = Math.pow;
        let v331 = Math.sqrt;
        let v332 = Math.atan2;
        let v333 = Math.PI;
        let vThis = this;
        this.round = function (p218, p219) {
          return Math.round(p218 * p219) / p219;
        };
        this.toRad = function (p220) {
          return p220 * (v333 / 180);
        };
        this.toAng = function (p221) {
          return p221 / (v333 / 180);
        };
        this.randInt = function (p222, p223) {
          return Math.floor(Math.random() * (p223 - p222 + 1)) + p222;
        };
        this.collisionDetection = function (p224, p225, p226) {
          return v331((p224.x - p225.x) ** 2 + (p224.y - p225.y) ** 2) < p226;
        };
        this.randFloat = function (p227, p228) {
          return Math.random() * (p228 - p227 + 1) + p227;
        };
        this.lerp = function (p229, p230, p231) {
          return p229 + (p230 - p229) * p231;
        };
        this.decel = function (p232, p233) {
          if (p232 > 0) {
            p232 = Math.max(0, p232 - p233);
          } else if (p232 < 0) {
            p232 = Math.min(0, p232 + p233);
          }
          return p232;
        };
        this.getDistance = function (p234, p235, p236, p237) {
          return v331((p236 -= p234) * p236 + (p237 -= p235) * p237);
        };
        this.getDist = function (p238, p239, p240, p241) {
          let v334 = {
            x: p240 == 0 ? p238.x : p240 == 1 ? p238.x1 : p240 == 2 ? p238.x2 : p240 == 3 && p238.x3,
            y: p240 == 0 ? p238.y : p240 == 1 ? p238.y1 : p240 == 2 ? p238.y2 : p240 == 3 && p238.y3
          };
          let v335 = {
            x: p241 == 0 ? p239.x : p241 == 1 ? p239.x1 : p241 == 2 ? p239.x2 : p241 == 3 && p239.x3,
            y: p241 == 0 ? p239.y : p241 == 1 ? p239.y1 : p241 == 2 ? p239.y2 : p241 == 3 && p239.y3
          };
          return v331((v335.x -= v334.x) * v335.x + (v335.y -= v334.y) * v335.y);
        };
        this.findMiddlePoint = function (p242, p243) {
          const v336 = {
            x: (p242.x + p243.x) / 2,
            y: (p242.y + p243.y) / 2
          };
          return v336;
        };
        this.fgdo = function (p244, p245) {
          return Math.sqrt(Math.pow(p245.y - p244.y, 2) + Math.pow(p245.x - p244.x, 2));
        };
        this.getDirection = function (p246, p247, p248, p249) {
          return v332(p247 - p249, p246 - p248);
        };
        this.getDirect = function (p250, p251, p252, p253) {
          let v337 = {
            x: p252 == 0 ? p250.x : p252 == 1 ? p250.x1 : p252 == 2 ? p250.x2 : p252 == 3 && p250.x3,
            y: p252 == 0 ? p250.y : p252 == 1 ? p250.y1 : p252 == 2 ? p250.y2 : p252 == 3 && p250.y3
          };
          let v338 = {
            x: p253 == 0 ? p251.x : p253 == 1 ? p251.x1 : p253 == 2 ? p251.x2 : p253 == 3 && p251.x3,
            y: p253 == 0 ? p251.y : p253 == 1 ? p251.y1 : p253 == 2 ? p251.y2 : p253 == 3 && p251.y3
          };
          return v332(v337.y - v338.y, v337.x - v338.x);
        };
        this.getAngleDist = function (p254, p255) {
          let v339 = v327(p255 - p254) % (v333 * 2);
          if (v339 > v333) {
            return v333 * 2 - v339;
          } else {
            return v339;
          }
        };
        this.isNumber = function (p256) {
          return typeof p256 == "number" && !isNaN(p256) && isFinite(p256);
        };
        this.isString = function (p257) {
          return p257 && typeof p257 == "string";
        };
        this.kFormat = function (p258) {
          if (p258 > 999) {
            return (p258 / 1000).toFixed(1) + "k";
          } else {
            return p258;
          }
        };
        this.sFormat = function (p259) {
          let v340 = [{
            num: 1000,
            string: "k"
          }, {
            num: 1000000,
            string: "m"
          }, {
            num: 1000000000,
            string: "b"
          }, {
            num: 1000000000000,
            string: "q"
          }].reverse();
          let v341 = v340.find(p260 => p259 >= p260.num);
          if (!v341) {
            return p259;
          }
          return (p259 / v341.num).toFixed(1) + v341.string;
        };
        this.capitalizeFirst = function (p261) {
          return p261.charAt(0).toUpperCase() + p261.slice(1);
        };
        this.fixTo = function (p262, p263) {
          return parseFloat(p262.toFixed(p263));
        };
        this.sortByPoints = function (p264, p265) {
          return parseFloat(p265.points) - parseFloat(p264.points);
        };
        this.lineInRect = function (p266, p267, p268, p269, p270, p271, p272, p273) {
          let vP270 = p270;
          let vP272 = p272;
          if (p270 > p272) {
            vP270 = p272;
            vP272 = p270;
          }
          if (vP272 > p268) {
            vP272 = p268;
          }
          if (vP270 < p266) {
            vP270 = p266;
          }
          if (vP270 > vP272) {
            return false;
          }
          let vP271 = p271;
          let vP273 = p273;
          let v342 = p272 - p270;
          if (Math.abs(v342) > 1e-7) {
            let v343 = (p273 - p271) / v342;
            let v344 = p271 - v343 * p270;
            vP271 = v343 * vP270 + v344;
            vP273 = v343 * vP272 + v344;
          }
          if (vP271 > vP273) {
            let vVP273 = vP273;
            vP273 = vP271;
            vP271 = vVP273;
          }
          if (vP273 > p269) {
            vP273 = p269;
          }
          if (vP271 < p267) {
            vP271 = p267;
          }
          if (vP271 > vP273) {
            return false;
          }
          return true;
        };
        this.containsPoint = function (p274, p275, p276) {
          let v345 = p274.getBoundingClientRect();
          let v346 = v345.left + window.scrollX;
          let v347 = v345.top + window.scrollY;
          let v348 = v345.width;
          let v349 = v345.height;
          let v350 = p275 > v346 && p275 < v346 + v348;
          let v351 = p276 > v347 && p276 < v347 + v349;
          return v350 && v351;
        };
        this.mousifyTouchEvent = function (p277) {
          let v352 = p277.changedTouches[0];
          p277.screenX = v352.screenX;
          p277.screenY = v352.screenY;
          p277.clientX = v352.clientX;
          p277.clientY = v352.clientY;
          p277.pageX = v352.pageX;
          p277.pageY = v352.pageY;
        };
        this.hookTouchEvents = function (p278, p279) {
          let v353 = !p279;
          let v354 = false;
          let v355 = false;
          p278.addEventListener("touchstart", this.checkTrusted(f33), v355);
          p278.addEventListener("touchmove", this.checkTrusted(f34), v355);
          p278.addEventListener("touchend", this.checkTrusted(f35), v355);
          p278.addEventListener("touchcancel", this.checkTrusted(f35), v355);
          p278.addEventListener("touchleave", this.checkTrusted(f35), v355);
          function f33(p280) {
            vThis.mousifyTouchEvent(p280);
            window.setUsingTouch(true);
            if (v353) {
              p280.preventDefault();
              p280.stopPropagation();
            }
            if (p278.onmouseover) {
              p278.onmouseover(p280);
            }
            v354 = true;
          }
          function f34(p281) {
            vThis.mousifyTouchEvent(p281);
            window.setUsingTouch(true);
            if (v353) {
              p281.preventDefault();
              p281.stopPropagation();
            }
            if (vThis.containsPoint(p278, p281.pageX, p281.pageY)) {
              if (!v354) {
                if (p278.onmouseover) {
                  p278.onmouseover(p281);
                }
                v354 = true;
              }
            } else if (v354) {
              if (p278.onmouseout) {
                p278.onmouseout(p281);
              }
              v354 = false;
            }
          }
          function f35(p282) {
            vThis.mousifyTouchEvent(p282);
            window.setUsingTouch(true);
            if (v353) {
              p282.preventDefault();
              p282.stopPropagation();
            }
            if (v354) {
              if (p278.onclick) {
                p278.onclick(p282);
              }
              if (p278.onmouseout) {
                p278.onmouseout(p282);
              }
              v354 = false;
            }
          }
        };
        this.removeAllChildren = function (p283) {
          while (p283.hasChildNodes()) {
            p283.removeChild(p283.lastChild);
          }
        };
        this.generateElement = function (p284) {
          let v356 = document.createElement(p284.tag || "div");
          function f36(p285, p286) {
            if (p284[p285]) {
              v356[p286] = p284[p285];
            }
          }
          f36("text", "textContent");
          f36("html", "innerHTML");
          f36("class", "className");
          for (let v357 in p284) {
            switch (v357) {
              case "tag":
              case "text":
              case "html":
              case "class":
              case "style":
              case "hookTouch":
              case "parent":
              case "children":
                continue;
              default:
                break;
            }
            v356[v357] = p284[v357];
          }
          if (v356.onclick) {
            v356.onclick = this.checkTrusted(v356.onclick);
          }
          if (v356.onmouseover) {
            v356.onmouseover = this.checkTrusted(v356.onmouseover);
          }
          if (v356.onmouseout) {
            v356.onmouseout = this.checkTrusted(v356.onmouseout);
          }
          if (p284.style) {
            v356.style.cssText = p284.style;
          }
          if (p284.hookTouch) {
            this.hookTouchEvents(v356);
          }
          if (p284.parent) {
            p284.parent.appendChild(v356);
          }
          if (p284.children) {
            for (let v358 = 0; v358 < p284.children.length; v358++) {
              v356.appendChild(p284.children[v358]);
            }
          }
          return v356;
        };
        this.checkTrusted = function (p287) {
          return function (p288) {
            if (p288 && p288 instanceof Event && (p288 && typeof p288.isTrusted == "boolean" ? p288.isTrusted : true)) {
              p287(p288);
            } else {}
          };
        };
        this.randomString = function (p289) {
          let v359 = "";
          let v360 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          for (let v361 = 0; v361 < p289; v361++) {
            v359 += v360.charAt(Math.floor(Math.random() * v360.length));
          }
          return v359;
        };
        this.countInArray = function (p290, p291) {
          let v362 = 0;
          for (let v363 = 0; v363 < p290.length; v363++) {
            if (p290[v363] === p291) {
              v362++;
            }
          }
          return v362;
        };
        this.hexToRgb = function (p292) {
          return p292.slice(1).match(/.{1,2}/g).map(p293 => parseInt(p293, 16));
        };
        this.getRgb = function (p294, p295, p296) {
          return [p294 / 255, p295 / 255, p296 / 255].join(", ");
        };
      }
    }
    ;
    class C4 {
      constructor() {
        this.init = function (p297, p298, p299, p300, p301, p302, p303) {
          this.x = p297;
          this.y = p298;
          this.color = p303;
          this.scale = p299 * 3.5;
          this.weight = 50;
          this.startScale = this.scale * 1.2;
          this.maxScale = p299 * 1.5;
          this.minScale = p299 * 0.5;
          this.scaleSpeed = 0.7;
          this.speed = p300;
          this.speedMax = p300;
          this.life = p301;
          this.maxLife = p301;
          this.text = p302;
          this.movSpeed = p300;
        };
        this.update = function (p304) {
          if (this.life) {
            this.life -= p304;
            if (this.scaleSpeed != -0.35) {
              this.y -= this.speed * p304;
            } else {
              this.y -= this.speed * p304;
            }
            this.scale -= 0.8;
            if (this.scale >= this.maxScale) {
              this.scale = this.maxScale;
              this.scaleSpeed *= -0.5;
              this.speed = this.speed * 0.75;
            }
            ;
            if (this.life <= 0) {
              this.life = 0;
            }
          }
          ;
        };
        this.render = function (p305, p306, p307) {
          p305.lineWidth = 10;
          p305.strokeStyle = v310;
          p305.fillStyle = this.color;
          p305.globalAlpha = 1;
          p305.font = this.scale + "px HammerSmith One";
          p305.strokeText(this.text, this.x - p306, this.y - p307);
          p305.fillText(this.text, this.x - p306, this.y - p307);
          p305.globalAlpha = 1;
        };
      }
    }
    ;
    class C5 {
      constructor() {
        this.texts = [];
        this.stack = [];
        this.update = function (p308, p309, p310, p311) {
          p309.textBaseline = "middle";
          p309.textAlign = "center";
          for (let v364 = 0; v364 < this.texts.length; ++v364) {
            if (this.texts[v364].life) {
              this.texts[v364].update(p308);
              this.texts[v364].render(p309, p310, p311);
            }
          }
        };
        this.showText = function (p312, p313, p314, p315, p316, p317, p318) {
          let v365;
          for (let v366 = 0; v366 < this.texts.length; ++v366) {
            if (!this.texts[v366].life) {
              v365 = this.texts[v366];
              break;
            }
          }
          if (!v365) {
            v365 = new C4();
            this.texts.push(v365);
          }
          v365.init(p312, p313, p314, p315, p316, p317, p318);
        };
      }
    }
    class C6 {
      constructor(p319) {
        this.sid = p319;
        this.init = function (p320, p321, p322, p323, p324, p325, p326) {
          p325 = p325 || {};
          this.sentTo = {};
          this.gridLocations = [];
          this.active = true;
          this.alive = true;
          this.doUpdate = p325.doUpdate;
          this.x = p320;
          this.y = p321;
          if (vP11.anotherVisual) {
            this.dir = p322 + Math.PI;
          } else {
            this.dir = p322;
          }
          this.lastDir = p322;
          this.xWiggle = 0;
          this.yWiggle = 0;
          this.visScale = p323;
          this.scale = p323;
          this.type = p324;
          this.id = p325.id;
          this.owner = p326;
          this.name = p325.name;
          this.isItem = this.id != undefined;
          this.group = p325.group;
          this.maxHealth = p325.health;
          this.health = this.maxHealth;
          this.layer = 2;
          if (this.group != undefined) {
            this.layer = this.group.layer;
          } else if (this.type == 0) {
            this.layer = 3;
          } else if (this.type == 2) {
            this.layer = 0;
          } else if (this.type == 4) {
            this.layer = -1;
          }
          this.colDiv = p325.colDiv || 1;
          this.blocker = p325.blocker;
          this.ignoreCollision = p325.ignoreCollision;
          this.dontGather = p325.dontGather;
          this.hideFromEnemy = p325.hideFromEnemy;
          this.friction = p325.friction;
          this.projDmg = p325.projDmg;
          this.dmg = p325.dmg;
          this.pDmg = p325.pDmg;
          this.pps = p325.pps;
          this.zIndex = p325.zIndex || 0;
          this.turnSpeed = p325.turnSpeed;
          this.req = p325.req;
          this.trap = p325.trap;
          this.healCol = p325.healCol;
          this.teleport = p325.teleport;
          this.boostSpeed = p325.boostSpeed;
          this.projectile = p325.projectile;
          this.shootRange = p325.shootRange;
          this.shootRate = p325.shootRate;
          this.shootCount = this.shootRate;
          this.spawnPoint = p325.spawnPoint;
          this.onNear = 0;
          this.breakObj = false;
          this.alpha = p325.alpha || 1;
          this.maxAlpha = p325.alpha || 1;
          this.damaged = 0;
          this.breakTime = 0;
        };
        this.startFadeOut = function () {
          this.fadingOut = true;
        };
        this.changeHealth = function (p327, p328) {
          this.health += p327;
          return this.health <= 0;
        };
        this.getScale = function (p329, p330) {
          p329 = p329 || 1;
          return this.scale * (this.isItem || this.type == 2 || this.type == 3 || this.type == 4 ? 1 : p329 * 0.6) * (p330 ? 1 : this.colDiv);
        };
        this.visibleToPlayer = function (p331) {
          return !this.hideFromEnemy || this.owner && (this.owner == p331 || this.owner.team && p331.team == this.owner.team);
        };
        this.update = function (p332) {
          if (this.active) {
            if (this.xWiggle) {
              this.xWiggle *= Math.pow(0.99, p332);
            }
            if (this.yWiggle) {
              this.yWiggle *= Math.pow(0.99, p332);
            }
            if (this.turnSpeed && this.dmg) {
              this.dir += this.turnSpeed * p332;
            }
            if (this.hideFromEnemy && this.isTeamObject(v286)) {
              for (let v367 of v289) {
                const v368 = {
                  x: this.x,
                  y: this.y
                };
                let v369 = v679.getDist(v368, v367, 0, 2);
                if (v369 < this.scale + v367.scale - 35) {
                  this.hideFromEnemy = false;
                }
              }
            }
          } else if (this.fadingOut) {
            if (this.alpha > 0) {
              this.alpha -= p332;
              if (this.alpha <= 0) {
                this.alpha = 0;
                this.alive = false;
                this.fadingOut = false;
              }
            }
          } else if (this.alive) {
            this.alpha -= p332 / (200 / this.maxAlpha);
            this.visScale += p332 / (this.scale / 2.5);
            if (this.alpha <= 0) {
              this.alpha = 0;
              this.alive = false;
            }
          }
        };
        this.isTeamObject = function (p333) {
          if (this.owner == null) {
            return true;
          } else {
            return this.owner && p333.sid == this.owner.sid || p333.findAllianceBySid(this.owner.sid);
          }
        };
      }
    }
    class C7 {
      constructor() {
        const v370 = {
          id: 5,
          name: "trap",
          place: true,
          limit: 6,
          layer: -1
        };
        const v371 = {
          id: 6,
          name: "booster",
          place: true,
          limit: 12,
          layer: -1
        };
        const v372 = {
          id: 9,
          name: "buff",
          place: true,
          limit: 4,
          layer: -1
        };
        const v373 = {
          id: 10,
          name: "spawn",
          place: true,
          limit: 1,
          layer: -1
        };
        const v374 = {
          id: 12,
          name: "blocker",
          place: true,
          limit: 3,
          layer: -1
        };
        const v375 = {
          id: 13,
          name: "teleporter",
          place: true,
          limit: 2,
          layer: -1
        };
        this.groups = [{
          id: 0,
          name: "food",
          layer: 0
        }, {
          id: 1,
          name: "walls",
          place: true,
          limit: 30,
          layer: 0
        }, {
          id: 2,
          name: "spikes",
          place: true,
          limit: 15,
          layer: 0
        }, {
          id: 3,
          name: "mill",
          place: true,
          limit: 7,
          layer: 1
        }, {
          id: 4,
          name: "mine",
          place: true,
          limit: 1,
          layer: 0
        }, v370, v371, {
          id: 7,
          name: "turret",
          place: true,
          limit: 2,
          layer: 1
        }, {
          id: 8,
          name: "watchtower",
          place: true,
          limit: 12,
          layer: 1
        }, v372, v373, {
          id: 11,
          name: "sapling",
          place: true,
          limit: 2,
          layer: 0
        }, v374, v375];
        this.projectiles = [{
          indx: 0,
          layer: 0,
          src: "arrow_1",
          dmg: 25,
          speed: 1.6,
          scale: 103,
          range: 1000
        }, {
          indx: 1,
          layer: 1,
          dmg: 25,
          scale: 20
        }, {
          indx: 0,
          layer: 0,
          src: "arrow_1",
          dmg: 35,
          speed: 2.5,
          scale: 103,
          range: 1200
        }, {
          indx: 0,
          layer: 0,
          src: "arrow_1",
          dmg: 30,
          speed: 2,
          scale: 103,
          range: 1200
        }, {
          indx: 1,
          layer: 1,
          dmg: 16,
          scale: 20
        }, {
          indx: 0,
          layer: 0,
          src: "bullet_1",
          dmg: 50,
          speed: 3.6,
          scale: 160,
          range: 1400
        }];
        const v376 = {
          id: 0,
          type: 0,
          name: "tool hammer",
          desc: "tool for gathering all resources",
          src: "hammer_1",
          length: 140,
          width: 140,
          xOff: -3,
          yOff: 18,
          dmg: 25,
          range: 65,
          gather: 1,
          speed: 300
        };
        const v377 = {
          id: 2,
          type: 0,
          age: 8,
          pre: 1,
          name: "great axe",
          desc: "deal more damage and gather more resources",
          src: "great_axe_1",
          length: 140,
          width: 140,
          xOff: -8,
          yOff: 25,
          dmg: 35,
          spdMult: 1,
          range: 75,
          gather: 4,
          speed: 400
        };
        const v378 = {
          id: 3,
          type: 0,
          age: 2,
          name: "short sword",
          desc: "increased attack power but slower move speed",
          src: "sword_1",
          iPad: 1.3,
          length: 130,
          width: 210,
          xOff: -8,
          yOff: 46,
          dmg: 35,
          spdMult: 0.85,
          range: 110,
          gather: 1,
          speed: 300
        };
        const v379 = {
          id: 4,
          type: 0,
          age: 8,
          pre: 3,
          name: "katana",
          desc: "greater range and damage",
          src: "samurai_1",
          iPad: 1.3,
          length: 130,
          width: 210,
          xOff: -8,
          yOff: 59,
          dmg: 40,
          spdMult: 0.8,
          range: 118,
          gather: 1,
          speed: 300
        };
        const v380 = {
          id: 5,
          type: 0,
          age: 2,
          name: "polearm",
          desc: "long range melee weapon",
          src: "spear_1",
          iPad: 1.3,
          length: 130,
          width: 210,
          xOff: -8,
          yOff: 53,
          dmg: 45,
          knock: 0.2,
          spdMult: 0.82,
          range: 142,
          gather: 1,
          speed: 700
        };
        const v381 = {
          id: 6,
          type: 0,
          age: 2,
          name: "bat",
          desc: "fast long range melee weapon",
          src: "bat_1",
          iPad: 1.3,
          length: 110,
          width: 180,
          xOff: -8,
          yOff: 53,
          dmg: 20,
          knock: 0.7,
          range: 110,
          gather: 1,
          speed: 300
        };
        const v382 = {
          id: 9,
          type: 1,
          age: 6,
          name: "hunting bow",
          desc: "bow used for ranged combat and hunting",
          src: "bow_1",
          req: ["wood", 4],
          length: 120,
          width: 120,
          xOff: -6,
          yOff: 0,
          Pdmg: 25,
          projectile: 0,
          spdMult: 0.75,
          speed: 600
        };
        const v383 = {
          id: 10,
          type: 1,
          age: 6,
          name: "great hammer",
          desc: "hammer used for destroying structures",
          src: "great_hammer_1",
          length: 140,
          width: 140,
          xOff: -9,
          yOff: 25,
          dmg: 10,
          Pdmg: 10,
          spdMult: 0.88,
          range: 75,
          sDmg: 7.5,
          gather: 1,
          speed: 400
        };
        const v384 = {
          id: 12,
          type: 1,
          age: 8,
          pre: 9,
          name: "crossbow",
          desc: "deals more damage and has greater range",
          src: "crossbow_1",
          req: ["wood", 5],
          aboveHand: true,
          armS: 0.75,
          length: 120,
          width: 120,
          xOff: -4,
          yOff: 0,
          Pdmg: 35,
          projectile: 2,
          spdMult: 0.7,
          speed: 700
        };
        const v385 = {
          id: 13,
          type: 1,
          age: 9,
          pre: 12,
          name: "repeater crossbow",
          desc: "high firerate crossbow with reduced damage",
          src: "crossbow_2",
          req: ["wood", 10],
          aboveHand: true,
          armS: 0.75,
          length: 120,
          width: 120,
          xOff: -4,
          yOff: 0,
          Pdmg: 30,
          projectile: 3,
          spdMult: 0.7,
          speed: 230
        };
        const v386 = {
          id: 14,
          type: 1,
          age: 6,
          name: "mc grabby",
          desc: "steals resources from enemies",
          src: "grab_1",
          length: 130,
          width: 210,
          xOff: -8,
          yOff: 53,
          dmg: 0,
          Pdmg: 0,
          steal: 250,
          knock: 0.2,
          spdMult: 1.05,
          range: 125,
          gather: 0,
          speed: 700
        };
        this.weapons = [v376, {
          id: 1,
          type: 0,
          age: 2,
          name: "hand axe",
          desc: "gathers resources at a higher rate",
          src: "axe_1",
          length: 140,
          width: 140,
          xOff: 3,
          yOff: 24,
          dmg: 30,
          spdMult: 1,
          range: 70,
          gather: 2,
          speed: 400
        }, v377, v378, v379, v380, v381, {
          id: 7,
          type: 0,
          age: 2,
          name: "daggers",
          desc: "really fast short range weapon",
          src: "dagger_1",
          iPad: 0.8,
          length: 110,
          width: 110,
          xOff: 18,
          yOff: 0,
          dmg: 20,
          knock: 0.1,
          range: 65,
          gather: 1,
          hitSlow: 0.1,
          spdMult: 1.13,
          speed: 100
        }, {
          id: 8,
          type: 0,
          age: 2,
          name: "stick",
          desc: "great for gathering but very weak",
          src: "stick_1",
          length: 140,
          width: 140,
          xOff: 3,
          yOff: 24,
          dmg: 1,
          spdMult: 1,
          range: 70,
          gather: 7,
          speed: 400
        }, v382, v383, {
          id: 11,
          type: 1,
          age: 6,
          name: "wooden shield",
          desc: "blocks projectiles and reduces melee damage",
          src: "shield_1",
          length: 120,
          width: 120,
          shield: 0.2,
          xOff: 6,
          yOff: 0,
          Pdmg: 0,
          spdMult: 0.7
        }, v384, v385, v386, {
          id: 15,
          type: 1,
          age: 9,
          pre: 12,
          name: "musket",
          desc: "slow firerate but high damage and range",
          src: "musket_1",
          req: ["stone", 10],
          aboveHand: true,
          rec: 0.35,
          armS: 0.6,
          hndS: 0.3,
          hndD: 1.6,
          length: 205,
          width: 205,
          xOff: 25,
          yOff: 0,
          Pdmg: 50,
          projectile: 5,
          hideProjectile: true,
          spdMult: 0.6,
          speed: 1500
        }];
        this.list = [{
          group: this.groups[0],
          name: "apple",
          desc: "restores 20 health when consumed",
          req: ["food", 10],
          consume: function (p334) {
            return p334.changeHealth(20, p334);
          },
          scale: 22,
          holdOffset: 15,
          healing: 20,
          itemID: 0,
          itemAID: 16
        }, {
          age: 3,
          group: this.groups[0],
          name: "cookie",
          desc: "restores 40 health when consumed",
          req: ["food", 15],
          consume: function (p335) {
            return p335.changeHealth(40, p335);
          },
          scale: 27,
          holdOffset: 15,
          healing: 40,
          itemID: 1,
          itemAID: 17
        }, {
          age: 7,
          group: this.groups[0],
          name: "cheese",
          desc: "restores 30 health and another 50 over 5 seconds",
          req: ["food", 25],
          consume: function (p336) {
            if (p336.changeHealth(30, p336) || p336.health < 100) {
              p336.dmgOverTime.dmg = -10;
              p336.dmgOverTime.doer = p336;
              p336.dmgOverTime.time = 5;
              return true;
            }
            return false;
          },
          scale: 27,
          holdOffset: 15,
          healing: 30,
          itemID: 2,
          itemAID: 18
        }, {
          group: this.groups[1],
          name: "wood wall",
          desc: "provides protection for your village",
          req: ["wood", 10],
          projDmg: true,
          health: 380,
          scale: 50,
          holdOffset: 20,
          placeOffset: -5,
          itemID: 3,
          itemAID: 19
        }, {
          age: 3,
          group: this.groups[1],
          name: "stone wall",
          desc: "provides improved protection for your village",
          req: ["stone", 25],
          health: 900,
          scale: 50,
          holdOffset: 20,
          placeOffset: -5,
          itemID: 4,
          itemAID: 20
        }, {
          age: 7,
          group: this.groups[1],
          name: "castle wall",
          desc: "provides powerful protection for your village",
          req: ["stone", 35],
          health: 1500,
          scale: 52,
          holdOffset: 20,
          placeOffset: -5,
          itemID: 5,
          itemAID: 21
        }, {
          group: this.groups[2],
          name: "spikes",
          desc: "damages enemies when they touch them",
          req: ["wood", 20, "stone", 5],
          health: 400,
          dmg: 20,
          scale: 49,
          spritePadding: -23,
          holdOffset: 8,
          placeOffset: -5,
          itemID: 6,
          itemAID: 22
        }, {
          age: 5,
          group: this.groups[2],
          name: "greater spikes",
          desc: "damages enemies when they touch them",
          req: ["wood", 30, "stone", 10],
          health: 500,
          dmg: 35,
          scale: 52,
          spritePadding: -23,
          holdOffset: 8,
          placeOffset: -5,
          itemID: 7,
          itemAID: 23
        }, {
          age: 9,
          group: this.groups[2],
          name: "poison spikes",
          desc: "poisons enemies when they touch them",
          req: ["wood", 35, "stone", 15],
          health: 600,
          dmg: 30,
          pDmg: 5,
          scale: 52,
          spritePadding: -23,
          holdOffset: 8,
          placeOffset: -5,
          itemID: 8,
          itemAID: 24
        }, {
          age: 9,
          group: this.groups[2],
          name: "spinning spikes",
          desc: "damages enemies when they touch them",
          req: ["wood", 30, "stone", 20],
          health: 500,
          dmg: 45,
          turnSpeed: 0.003,
          scale: 52,
          spritePadding: -23,
          holdOffset: 8,
          placeOffset: -5,
          itemID: 9,
          itemAID: 25
        }, {
          group: this.groups[3],
          name: "windmill",
          desc: "generates gold over time",
          req: ["wood", 50, "stone", 10],
          health: 400,
          pps: 1,
          turnSpeed: 0.0016,
          spritePadding: 25,
          iconLineMult: 12,
          scale: 45,
          holdOffset: 20,
          placeOffset: 5,
          itemID: 10,
          itemAID: 26
        }, {
          age: 5,
          group: this.groups[3],
          name: "faster windmill",
          desc: "generates more gold over time",
          req: ["wood", 60, "stone", 20],
          health: 500,
          pps: 1.5,
          turnSpeed: 0.0025,
          spritePadding: 25,
          iconLineMult: 12,
          scale: 47,
          holdOffset: 20,
          placeOffset: 5,
          itemID: 11,
          itemAID: 27
        }, {
          age: 8,
          group: this.groups[3],
          name: "power mill",
          desc: "generates more gold over time",
          req: ["wood", 100, "stone", 50],
          health: 800,
          pps: 2,
          turnSpeed: 0.005,
          spritePadding: 25,
          iconLineMult: 12,
          scale: 47,
          holdOffset: 20,
          placeOffset: 5,
          itemID: 12,
          itemAID: 28
        }, {
          age: 5,
          group: this.groups[4],
          type: 2,
          name: "mine",
          desc: "allows you to mine stone",
          req: ["wood", 20, "stone", 100],
          iconLineMult: 12,
          scale: 65,
          holdOffset: 20,
          placeOffset: 0,
          itemID: 13,
          itemAID: 29
        }, {
          age: 5,
          group: this.groups[11],
          type: 0,
          name: "sapling",
          desc: "allows you to farm wood",
          req: ["wood", 150],
          iconLineMult: 12,
          colDiv: 0.5,
          scale: 110,
          holdOffset: 50,
          placeOffset: -15,
          itemID: 14,
          itemAID: 30
        }, {
          age: 4,
          group: this.groups[5],
          name: "pit trap",
          desc: "pit that traps enemies if they walk over it",
          req: ["wood", 30, "stone", 30],
          trap: true,
          ignoreCollision: true,
          hideFromEnemy: true,
          health: 500,
          colDiv: 0.2,
          scale: 50,
          holdOffset: 20,
          placeOffset: -5,
          alpha: 0.6,
          itemID: 15,
          itemAID: 31
        }, {
          age: 4,
          group: this.groups[6],
          name: "boost pad",
          desc: "provides boost when stepped on",
          req: ["stone", 20, "wood", 5],
          ignoreCollision: true,
          boostSpeed: 1.5,
          health: 150,
          colDiv: 0.7,
          scale: 45,
          holdOffset: 20,
          placeOffset: -5,
          itemID: 16,
          itemAID: 32
        }, {
          age: 7,
          group: this.groups[7],
          doUpdate: true,
          name: "turret",
          desc: "defensive structure that shoots at enemies",
          req: ["wood", 200, "stone", 150],
          health: 800,
          projectile: 1,
          shootRange: 700,
          shootRate: 2200,
          scale: 43,
          holdOffset: 20,
          placeOffset: -5,
          itemID: 17,
          itemAID: 33
        }, {
          age: 7,
          group: this.groups[8],
          name: "platform",
          desc: "platform to shoot over walls and cross over water",
          req: ["wood", 20],
          ignoreCollision: true,
          zIndex: 1,
          health: 300,
          scale: 43,
          holdOffset: 20,
          placeOffset: -5,
          itemID: 18,
          itemAID: 34
        }, {
          age: 7,
          group: this.groups[9],
          name: "healing pad",
          desc: "standing on it will slowly heal you",
          req: ["wood", 30, "food", 10],
          ignoreCollision: true,
          healCol: 15,
          health: 400,
          colDiv: 0.7,
          scale: 45,
          holdOffset: 20,
          placeOffset: -5,
          itemID: 19,
          itemAID: 35
        }, {
          age: 9,
          group: this.groups[10],
          name: "spawn pad",
          desc: "you will spawn here when you die but it will dissapear",
          req: ["wood", 100, "stone", 100],
          health: 400,
          ignoreCollision: true,
          spawnPoint: true,
          scale: 45,
          holdOffset: 20,
          placeOffset: -5,
          itemID: 20,
          itemAID: 36
        }, {
          age: 7,
          group: this.groups[12],
          name: "blocker",
          desc: "blocks building in radius",
          req: ["wood", 30, "stone", 25],
          ignoreCollision: true,
          blocker: 300,
          health: 400,
          colDiv: 0.7,
          scale: 45,
          holdOffset: 20,
          placeOffset: -5,
          itemID: 21,
          itemAID: 37
        }, {
          age: 7,
          group: this.groups[13],
          name: "teleporter",
          desc: "teleports you to a random point on the map",
          req: ["wood", 60, "stone", 60],
          ignoreCollision: true,
          teleport: true,
          health: 200,
          colDiv: 0.7,
          scale: 45,
          holdOffset: 20,
          placeOffset: -5,
          itemID: 22,
          itemAID: 38
        }];
        this.checkItem = {
          index: function (p337, p338) {
            if ([0, 1, 2].includes(p337)) {
              return 0;
            } else if ([3, 4, 5].includes(p337)) {
              return 1;
            } else if ([6, 7, 8, 9].includes(p337)) {
              return 2;
            } else if ([10, 11, 12].includes(p337)) {
              return 3;
            } else if ([13, 14].includes(p337)) {
              return 5;
            } else if ([15, 16].includes(p337)) {
              return 4;
            } else if ([17, 18, 19, 21, 22].includes(p337)) {
              if ([13, 14].includes(p338)) {
                return 6;
              } else {
                return 5;
              }
            } else if (p337 == 20) {
              if ([13, 14].includes(p338)) {
                return 7;
              } else {
                return 6;
              }
            } else {
              return undefined;
            }
          }
        };
        for (let v387 = 0; v387 < this.list.length; ++v387) {
          this.list[v387].id = v387;
          if (this.list[v387].pre) {
            this.list[v387].pre = v387 - this.list[v387].pre;
          }
        }
        if (typeof window !== "undefined") {
          function f37(p339) {
            for (let v388 = p339.length - 1; v388 > 0; v388--) {
              const v389 = Math.floor(Math.random() * (v388 + 1));
              [p339[v388], p339[v389]] = [p339[v389], p339[v388]];
            }
            return p339;
          }
        }
      }
    }
    class C8 {
      constructor(p340, p341, p342, p343, p344, p345) {
        let v390 = Math.floor;
        let v391 = Math.abs;
        let v392 = Math.cos;
        let v393 = Math.sin;
        let v394 = Math.pow;
        let v395 = Math.sqrt;
        this.ignoreAdd = false;
        this.hitObj = [];
        this.disableObj = function (p346) {
          p346.active = false;
          p346.breakTime = Date.now();
          p346.startFadeOut();
          setTimeout(() => {
            p341.filter(p347 => p347 != p346);
          }, 5000);
        };
        let v396;
        this.add = function (p348, p349, p350, p351, p352, p353, p354, p355, p356) {
          v396 = f31(p348);
          if (!v396) {
            v396 = p341.find(p357 => !p357.active);
            if (!v396) {
              v396 = new p340(p348);
              p341.push(v396);
            }
          }
          if (p355) {
            v396.sid = p348;
          }
          v396.init(p349, p350, p351, p352, p353, p354, p356);
        };
        this.disableBySid = function (p358) {
          let vF31 = f31(p358);
          if (vF31) {
            this.disableObj(vF31);
          }
        };
        this.removeAllItems = function (p359, p360) {
          p341.filter(p361 => p361.active && p361.owner && p361.owner.sid == p359).forEach(p362 => this.disableObj(p362));
        };
        this.checkItemLocation = function (p363, p364, p365, p366, p367, p368) {
          let v397 = p341.filter(p369 => p369.active && p342.getDist(v286, p369, 2, 0) < 300);
          let v398 = v397.find(p370 => p370.active && p342.getDistance(p363, p364, p370.x, p370.y) < p365 + (p370.blocker ? p370.blocker : p370.getScale(p366, p370.isItem)));
          if (v398) {
            return false;
          }
          if (!p368 && p367 != 18 && p364 >= p343.mapScale / 2 - p343.riverWidth / 2 && p364 <= p343.mapScale / 2 + p343.riverWidth / 2) {
            return false;
          }
          return true;
        };
        this.preplaceCheck = function (p371, p372, p373, p374) {
          let v399 = v286.x2 + p374 * Math.cos(p372);
          let v400 = v286.y2 + p374 * Math.sin(p372);
          let v401 = p341.filter(p375 => p375.active && p342.getDist(v286, p375, 2, 0) < 300);
          const v402 = {
            x: v399,
            y: v400
          };
          let v403 = v401.find(p376 => p376.active && p376.sid !== p373.sid && p342.getDist(v402, p376, 0, 0) < p371.scale + (p376.blocker ? p376.blocker : p376.getScale(0.6, p376.isItem)));
          if (v403) {
            return false;
          }
          if (p371.id != 18 && v400 >= p343.mapScale / 2 - p343.riverWidth / 2 && v400 <= p343.mapScale / 2 + p343.riverWidth / 2) {
            return false;
          }
          return true;
        };
        this.canBeBroken = function (p377) {
          if (!v317 || !p377 || !v289.length) {
            return;
          }
          let v404 = v286.weapons[v688.notFast(p377) ? 1 : 0];
          let v405 = v286[(v404 < 9 ? "prima" : "seconda") + "ryVariant"];
          let v406 = v405 != undefined ? p343.weaponVariants[v405].val : 1;
          let v407 = v291.secondaryIndex != undefined && v291.primaryIndex != undefined ? v291.secondaryIndex == 10 && (p377.health > v680.weapons[v291.weapons[0]].dmg || v291.primaryIndex == 5) ? v291.secondaryIndex : v291.primaryIndex : 10;
          let v408 = v291.secondaryIndex != undefined && v291.primaryIndex != undefined ? v291[(v407 < 9 ? "prima" : "seconda") + "ryVariant"] : 3;
          let v409 = p343.weaponVariants[v408].val;
          let v410 = v680.weapons[v404].dmg;
          let v411 = v680.weapons[v407].dmg;
          let v412 = 3.3;
          let v413 = 0;
          if (v291.reloads[v407] == 0 && this.canHit(v291, p377, v407, 50)) {
            v413 += v411 * v412 * v409 * (v680.weapons[v404].sDmg || 1);
          }
          if (v688.inTrap && (p377 == v688.info[1] || p377 == v688.info[0]) || v274.active && p377 == v274.info || v711.right && v286.reloads[v404] == 0) {
            v413 += v410 * v412 * v406 * (v680.weapons[v404].sDmg || 1);
          }
          if (p377.health <= v413) {
            return true;
          }
          return false;
        };
        this.hitsToBreak = function (p378, p379) {
          if (!v317 || !p378 || !v289.length || !p379) {
            return;
          }
          let v414 = v688.notFast(p378, p379) ? p379.weapons[1] : p379.weapons[0];
          let v415 = p379[(v414 < 9 ? "prima" : "seconda") + "ryVariant"];
          let v416 = v415 != undefined ? p343.weaponVariants[v415].val : 1.18;
          let v417 = v680.weapons[v414].dmg;
          let v418 = 3.3;
          let v419 = v417 * v418 * v416 * (v680.weapons[v414].sDmg || 1);
          return Math.ceil(p378.health / v419);
        };
        this.canHit = function (p380, p381, p382, p383 = 0) {
          return p342.getDist(p380, p381, 2, 0) <= v680.weapons[p382].range + p380.scale + p381.scale / 3.25 + p383;
        };
      }
    }
    class C9 {
      constructor(p384, p385, p386, p387, p388, p389, p390) {
        this.init = function (p391, p392, p393, p394, p395, p396, p397, p398, p399) {
          this.active = true;
          this.tickActive = true;
          this.indx = p391;
          this.x = p392;
          this.y = p393;
          this.x2 = p392;
          this.y2 = p393;
          this.dir = p394;
          this.skipMov = true;
          this.speed = p395;
          this.dmg = p396;
          this.scale = p398;
          this.range = p397;
          this.r2 = p397;
          this.owner = p399;
        };
        this.update = function (p400) {
          if (this.active) {
            let v420 = this.speed * p400;
            if (!this.skipMov) {
              this.x += v420 * Math.cos(this.dir);
              this.y += v420 * Math.sin(this.dir);
              this.range -= v420;
              if (this.range <= 0) {
                this.x += this.range * Math.cos(this.dir);
                this.y += this.range * Math.sin(this.dir);
                v420 = 1;
                this.range = 0;
                this.active = false;
              }
            } else {
              this.skipMov = false;
            }
          }
        };
        this.tickUpdate = function (p401) {
          if (this.tickActive) {
            let v421 = this.speed * p401;
            if (!this.skipMov) {
              this.x2 += v421 * Math.cos(this.dir);
              this.y2 += v421 * Math.sin(this.dir);
              this.r2 -= v421;
              if (this.r2 <= 0) {
                this.x2 += this.r2 * Math.cos(this.dir);
                this.y2 += this.r2 * Math.sin(this.dir);
                v421 = 1;
                this.r2 = 0;
                this.tickActive = false;
              }
            } else {
              this.skipMov = false;
            }
          }
        };
      }
    }
    ;
    class C10 {
      constructor() {
        const v422 = {
          id: 7,
          name: "Bull Helmet",
          price: 6000,
          scale: 120,
          desc: "increases damage done but drains health",
          healthRegen: -5,
          dmgMultO: 1.5,
          spdMult: 0.96
        };
        this.hats = [{
          id: 45,
          name: "Shame!",
          dontSell: true,
          price: 0,
          scale: 120,
          desc: "hacks are for winners"
        }, {
          id: 51,
          name: "Moo Cap",
          price: 0,
          scale: 120,
          desc: "coolest mooer around"
        }, {
          id: 50,
          name: "Apple Cap",
          price: 0,
          scale: 120,
          desc: "apple farms remembers"
        }, {
          id: 28,
          name: "Moo Head",
          price: 0,
          scale: 120,
          desc: "no effect"
        }, {
          id: 29,
          name: "Pig Head",
          price: 0,
          scale: 120,
          desc: "no effect"
        }, {
          id: 30,
          name: "Fluff Head",
          price: 0,
          scale: 120,
          desc: "no effect"
        }, {
          id: 36,
          name: "Pandou Head",
          price: 0,
          scale: 120,
          desc: "no effect"
        }, {
          id: 37,
          name: "Bear Head",
          price: 0,
          scale: 120,
          desc: "no effect"
        }, {
          id: 38,
          name: "Monkey Head",
          price: 0,
          scale: 120,
          desc: "no effect"
        }, {
          id: 44,
          name: "Polar Head",
          price: 0,
          scale: 120,
          desc: "no effect"
        }, {
          id: 35,
          name: "Fez Hat",
          price: 0,
          scale: 120,
          desc: "no effect"
        }, {
          id: 42,
          name: "Enigma Hat",
          price: 0,
          scale: 120,
          desc: "join the enigma army"
        }, {
          id: 43,
          name: "Blitz Hat",
          price: 0,
          scale: 120,
          desc: "hey everybody i'm blitz"
        }, {
          id: 49,
          name: "Bob XIII Hat",
          price: 0,
          scale: 120,
          desc: "like and subscribe"
        }, {
          id: 57,
          name: "Pumpkin",
          price: 50,
          scale: 120,
          desc: "Spooooky"
        }, {
          id: 8,
          name: "Bummle Hat",
          price: 100,
          scale: 120,
          desc: "no effect"
        }, {
          id: 2,
          name: "Straw Hat",
          price: 500,
          scale: 120,
          desc: "no effect"
        }, {
          id: 15,
          name: "Winter Cap",
          price: 600,
          scale: 120,
          desc: "allows you to move at normal speed in snow",
          coldM: 1
        }, {
          id: 5,
          name: "Cowboy Hat",
          price: 1000,
          scale: 120,
          desc: "no effect"
        }, {
          id: 4,
          name: "Ranger Hat",
          price: 2000,
          scale: 120,
          desc: "no effect"
        }, {
          id: 18,
          name: "Explorer Hat",
          price: 2000,
          scale: 120,
          desc: "no effect"
        }, {
          id: 31,
          name: "Flipper Hat",
          price: 2500,
          scale: 120,
          desc: "have more control while in water",
          watrImm: true
        }, {
          id: 1,
          name: "Marksman Cap",
          price: 3000,
          scale: 120,
          desc: "increases arrow speed and range",
          aMlt: 1.3
        }, {
          id: 10,
          name: "Bush Gear",
          price: 3000,
          scale: 160,
          desc: "allows you to disguise yourself as a bush"
        }, {
          id: 48,
          name: "Halo",
          price: 3000,
          scale: 120,
          desc: "no effect"
        }, {
          id: 6,
          name: "Soldier Helmet",
          price: 4000,
          scale: 120,
          desc: "reduces damage taken but slows movement",
          spdMult: 0.94,
          dmgMult: 0.75
        }, {
          id: 23,
          name: "Anti Venom Gear",
          price: 4000,
          scale: 120,
          desc: "makes you immune to poison",
          poisonRes: 1
        }, {
          id: 13,
          name: "Medic Gear",
          price: 5000,
          scale: 110,
          desc: "slowly regenerates health over time",
          healthRegen: 3
        }, {
          id: 9,
          name: "Miners Helmet",
          price: 5000,
          scale: 120,
          desc: "earn 1 extra gold per resource",
          extraGold: 1
        }, {
          id: 32,
          name: "Musketeer Hat",
          price: 5000,
          scale: 120,
          desc: "reduces cost of projectiles",
          projCost: 0.5
        }, v422, {
          id: 22,
          name: "Emp Helmet",
          price: 6000,
          scale: 120,
          desc: "turrets won't attack but you move slower",
          antiTurret: 1,
          spdMult: 0.7
        }, {
          id: 12,
          name: "Booster Hat",
          price: 6000,
          scale: 120,
          desc: "increases your movement speed",
          spdMult: 1.16
        }, {
          id: 26,
          name: "Barbarian Armor",
          price: 8000,
          scale: 120,
          desc: "knocks back enemies that attack you",
          dmgK: 0.6
        }, {
          id: 21,
          name: "Plague Mask",
          price: 10000,
          scale: 120,
          desc: "melee attacks deal poison damage",
          poisonDmg: 5,
          poisonTime: 6
        }, {
          id: 46,
          name: "Bull Mask",
          price: 10000,
          scale: 120,
          desc: "bulls won't target you unless you attack them",
          bullRepel: 1
        }, {
          id: 14,
          name: "Windmill Hat",
          topSprite: true,
          price: 10000,
          scale: 120,
          desc: "generates points while worn",
          pps: 1.5
        }, {
          id: 11,
          name: "Spike Gear",
          topSprite: true,
          price: 10000,
          scale: 120,
          desc: "deal damage to players that damage you",
          dmg: 0.45
        }, {
          id: 53,
          name: "Turret Gear",
          topSprite: true,
          price: 10000,
          scale: 120,
          desc: "you become a walking turret",
          turret: {
            proj: 1,
            range: 700,
            rate: 2500
          },
          spdMult: 0.7
        }, {
          id: 20,
          name: "Samurai Armor",
          price: 12000,
          scale: 120,
          desc: "increased attack speed and fire rate",
          atkSpd: 0.78
        }, {
          id: 58,
          name: "Dark Knight",
          price: 12000,
          scale: 120,
          desc: "restores health when you deal damage",
          healD: 0.4
        }, {
          id: 27,
          name: "Scavenger Gear",
          price: 15000,
          scale: 120,
          desc: "earn double points for each kill",
          kScrM: 2
        }, {
          id: 40,
          name: "Tank Gear",
          price: 15000,
          scale: 120,
          desc: "increased damage to buildings but slower movement",
          spdMult: 0.3,
          bDmg: 3.3
        }, {
          id: 52,
          name: "Thief Gear",
          price: 15000,
          scale: 120,
          desc: "steal half of a players gold when you kill them",
          goldSteal: 0.5
        }, {
          id: 55,
          name: "Bloodthirster",
          price: 20000,
          scale: 120,
          desc: "Restore Health when dealing damage. And increased damage",
          healD: 0.25,
          dmgMultO: 1.2
        }, {
          id: 56,
          name: "Assassin Gear",
          price: 20000,
          scale: 120,
          desc: "Go invisible when not moving. Can't eat. Increased speed",
          noEat: true,
          spdMult: 1.1,
          invisTimer: 1000
        }];
        this.accessories = [{
          id: 12,
          name: "Snowball",
          price: 1000,
          scale: 105,
          xOff: 18,
          desc: "no effect"
        }, {
          id: 9,
          name: "Tree Cape",
          price: 1000,
          scale: 90,
          desc: "no effect"
        }, {
          id: 10,
          name: "Stone Cape",
          price: 1000,
          scale: 90,
          desc: "no effect"
        }, {
          id: 3,
          name: "Cookie Cape",
          price: 1500,
          scale: 90,
          desc: "no effect"
        }, {
          id: 8,
          name: "Cow Cape",
          price: 2000,
          scale: 90,
          desc: "no effect"
        }, {
          id: 11,
          name: "Monkey Tail",
          price: 2000,
          scale: 97,
          xOff: 25,
          desc: "Super speed but reduced damage",
          spdMult: 1.35,
          dmgMultO: 0.2
        }, {
          id: 17,
          name: "Apple Basket",
          price: 3000,
          scale: 80,
          xOff: 12,
          desc: "slowly regenerates health over time",
          healthRegen: 1
        }, {
          id: 6,
          name: "Winter Cape",
          price: 3000,
          scale: 90,
          desc: "no effect"
        }, {
          id: 4,
          name: "Skull Cape",
          price: 4000,
          scale: 90,
          desc: "no effect"
        }, {
          id: 5,
          name: "Dash Cape",
          price: 5000,
          scale: 90,
          desc: "no effect"
        }, {
          id: 2,
          name: "Dragon Cape",
          price: 6000,
          scale: 90,
          desc: "no effect"
        }, {
          id: 1,
          name: "Super Cape",
          price: 8000,
          scale: 90,
          desc: "no effect"
        }, {
          id: 7,
          name: "Troll Cape",
          price: 8000,
          scale: 90,
          desc: "no effect"
        }, {
          id: 14,
          name: "Thorns",
          price: 10000,
          scale: 115,
          xOff: 20,
          desc: "no effect"
        }, {
          id: 15,
          name: "Blockades",
          price: 10000,
          scale: 95,
          xOff: 15,
          desc: "no effect"
        }, {
          id: 20,
          name: "Devils Tail",
          price: 10000,
          scale: 95,
          xOff: 20,
          desc: "no effect"
        }, {
          id: 16,
          name: "Sawblade",
          price: 12000,
          scale: 90,
          spin: true,
          xOff: 0,
          desc: "deal damage to players that damage you",
          dmg: 0.15
        }, {
          id: 13,
          name: "Angel Wings",
          price: 15000,
          scale: 138,
          xOff: 22,
          desc: "slowly regenerates health over time",
          healthRegen: 3
        }, {
          id: 19,
          name: "Shadow Wings",
          price: 15000,
          scale: 138,
          xOff: 22,
          desc: "increased movement speed",
          spdMult: 1.1
        }, {
          id: 18,
          name: "Blood Wings",
          price: 20000,
          scale: 178,
          xOff: 26,
          desc: "restores health when you deal damage",
          healD: 0.2
        }, {
          id: 21,
          name: "Corrupt X Wings",
          price: 20000,
          scale: 178,
          xOff: 26,
          desc: "deal damage to players that damage you",
          dmg: 0.25
        }];
      }
    }
    ;
    class C11 {
      constructor(p402, p403, p404, p405, p406, p407, p408, p409, p410) {
        this.addProjectile = function (p411, p412, p413, p414, p415, p416, p417, p418, p419, p420) {
          let v423 = p407.projectiles[p416];
          let v424;
          for (let v425 = 0; v425 < p403.length; ++v425) {
            if (!p403[v425].active) {
              v424 = p403[v425];
              break;
            }
          }
          if (!v424) {
            v424 = new p402(p404, p405, p406, p407, p408, p409, p410);
            v424.sid = p403.length;
            p403.push(v424);
          }
          v424.init(p416, p411, p412, p413, p415, v423.dmg, p414, v423.scale, p417);
          v424.ignoreObj = p418;
          v424.layer = p419 || v423.layer;
          v424.inWindow = p420;
          v424.src = v423.src;
          return v424;
        };
      }
    }
    ;
    class C12 {
      constructor(p421, p422, p423, p424, p425, p426, p427, p428, p429) {
        this.aiTypes = [{
          id: 0,
          src: "cow_1",
          killScore: 150,
          health: 500,
          weightM: 0.8,
          speed: 0.00095,
          turnSpeed: 0.001,
          scale: 72,
          drop: ["food", 50]
        }, {
          id: 1,
          src: "pig_1",
          killScore: 200,
          health: 800,
          weightM: 0.6,
          speed: 0.00085,
          turnSpeed: 0.001,
          scale: 72,
          drop: ["food", 80]
        }, {
          id: 2,
          name: "Bull",
          src: "bull_2",
          hostile: true,
          dmg: 20,
          killScore: 1000,
          health: 1800,
          weightM: 0.5,
          speed: 0.00094,
          turnSpeed: 0.00074,
          scale: 78,
          viewRange: 800,
          chargePlayer: true,
          drop: ["food", 100]
        }, {
          id: 3,
          name: "Bully",
          src: "bull_1",
          hostile: true,
          dmg: 20,
          killScore: 2000,
          health: 2800,
          weightM: 0.45,
          speed: 0.001,
          turnSpeed: 0.0008,
          scale: 90,
          viewRange: 900,
          chargePlayer: true,
          drop: ["food", 400]
        }, {
          id: 4,
          name: "Wolf",
          src: "wolf_1",
          hostile: true,
          dmg: 8,
          killScore: 500,
          health: 300,
          weightM: 0.45,
          speed: 0.001,
          turnSpeed: 0.002,
          scale: 84,
          viewRange: 800,
          chargePlayer: true,
          drop: ["food", 200]
        }, {
          id: 5,
          name: "Quack",
          src: "chicken_1",
          dmg: 8,
          killScore: 2000,
          noTrap: true,
          health: 300,
          weightM: 0.2,
          speed: 0.0018,
          turnSpeed: 0.006,
          scale: 70,
          drop: ["food", 100]
        }, {
          id: 6,
          name: "MOOSTAFA",
          nameScale: 50,
          src: "enemy",
          hostile: true,
          dontRun: true,
          fixedSpawn: true,
          spawnDelay: 60000,
          noTrap: true,
          colDmg: 100,
          dmg: 40,
          killScore: 8000,
          health: 18000,
          weightM: 0.4,
          speed: 0.0007,
          turnSpeed: 0.01,
          scale: 80,
          spriteMlt: 1.8,
          leapForce: 0.9,
          viewRange: 1000,
          hitRange: 210,
          hitDelay: 1000,
          chargePlayer: true,
          drop: ["food", 100]
        }, {
          id: 7,
          name: "Treasure",
          hostile: true,
          nameScale: 35,
          src: "crate_1",
          fixedSpawn: true,
          spawnDelay: 120000,
          colDmg: 200,
          killScore: 5000,
          health: 20000,
          weightM: 0.1,
          speed: 0,
          turnSpeed: 0,
          scale: 70,
          spriteMlt: 1
        }, {
          id: 8,
          name: "MOOFIE",
          src: "wolf_2",
          hostile: true,
          fixedSpawn: true,
          dontRun: true,
          hitScare: 4,
          spawnDelay: 30000,
          noTrap: true,
          nameScale: 35,
          dmg: 10,
          colDmg: 100,
          killScore: 3000,
          health: 7000,
          weightM: 0.45,
          speed: 0.0015,
          turnSpeed: 0.002,
          scale: 90,
          viewRange: 800,
          chargePlayer: true,
          drop: ["food", 1000]
        }, {
          id: 9,
          name: "💀MOOFIE",
          src: "wolf_2",
          hostile: true,
          fixedSpawn: true,
          dontRun: true,
          hitScare: 50,
          spawnDelay: 60000,
          noTrap: true,
          nameScale: 35,
          dmg: 12,
          colDmg: 100,
          killScore: 3000,
          health: 9000,
          weightM: 0.45,
          speed: 0.0015,
          turnSpeed: 0.0025,
          scale: 94,
          viewRange: 1440,
          chargePlayer: true,
          drop: ["food", 3000]
        }, {
          id: 10,
          name: "💀Wolf",
          src: "wolf_1",
          hostile: true,
          fixedSpawn: true,
          dontRun: true,
          hitScare: 50,
          spawnDelay: 30000,
          nameScale: 35,
          dmg: 10,
          killScore: 700,
          health: 500,
          weightM: 0.45,
          speed: 0.00115,
          turnSpeed: 0.0025,
          scale: 88,
          viewRange: 1440,
          chargePlayer: true,
          drop: ["food", 400]
        }, {
          id: 11,
          name: "💀Bully",
          src: "bull_1",
          hostile: true,
          fixedSpawn: true,
          dontRun: true,
          hitScare: 50,
          spawnDelay: 100000,
          nameScale: 35,
          dmg: 20,
          killScore: 5000,
          health: 5000,
          weightM: 0.45,
          speed: 0.0015,
          turnSpeed: 0.0025,
          scale: 94,
          viewRange: 1440,
          chargePlayer: true,
          drop: ["food", 800]
        }];
        this.spawn = function (p430, p431, p432, p433) {
          let v426 = p421.find(p434 => !p434.active);
          if (!v426) {
            v426 = new p422(p421.length, p425, p423, p424, p427, p426, p428, p429);
            p421.push(v426);
          }
          v426.init(p430, p431, p432, p433, this.aiTypes[p433]);
          return v426;
        };
      }
    }
    ;
    class C13 {
      constructor(p435, p436, p437, p438, p439, p440, p441, p442) {
        this.sid = p435;
        this.isAI = true;
        this.nameIndex = p439.randInt(0, p440.cowNames.length - 1);
        this.init = function (p443, p444, p445, p446, p447) {
          this.x = p443;
          this.y = p444;
          this.startX = p447.fixedSpawn ? p443 : null;
          this.startY = p447.fixedSpawn ? p444 : null;
          this.xVel = 0;
          this.yVel = 0;
          this.zIndex = 0;
          this.dir = p445;
          this.dirPlus = 0;
          this.index = p446;
          this.src = p447.src;
          if (p447.name) {
            this.name = p447.name;
          }
          this.weightM = p447.weightM;
          this.speed = p447.speed;
          this.killScore = p447.killScore;
          this.turnSpeed = p447.turnSpeed;
          this.scale = p447.scale;
          this.maxHealth = p447.health;
          this.leapForce = p447.leapForce;
          this.health = this.maxHealth;
          this.chargePlayer = p447.chargePlayer;
          this.viewRange = p447.viewRange;
          this.drop = p447.drop;
          this.dmg = p447.dmg;
          this.hostile = p447.hostile;
          this.dontRun = p447.dontRun;
          this.hitRange = p447.hitRange;
          this.hitDelay = p447.hitDelay;
          this.hitScare = p447.hitScare;
          this.spriteMlt = p447.spriteMlt;
          this.nameScale = p447.nameScale;
          this.colDmg = p447.colDmg;
          this.noTrap = p447.noTrap;
          this.spawnDelay = p447.spawnDelay;
          this.hitWait = 0;
          this.waitCount = 1000;
          this.moveCount = 0;
          this.targetDir = 0;
          this.active = true;
          this.alive = true;
          this.runFrom = null;
          this.chargeTarget = null;
          this.dmgOverTime = {};
        };
        let v427 = 0;
        let v428 = 0;
        this.animate = function (p448) {
          if (this.animTime > 0) {
            this.animTime -= p448;
            if (this.animTime <= 0) {
              this.animTime = 0;
              this.dirPlus = 0;
              v427 = 0;
              v428 = 0;
            } else if (v428 == 0) {
              v427 += p448 / (this.animSpeed * p440.hitReturnRatio);
              this.dirPlus = p439.lerp(0, this.targetAngle, Math.min(1, v427));
              if (v427 >= 1) {
                v427 = 1;
                v428 = 1;
              }
            } else {
              v427 -= p448 / (this.animSpeed * (1 - p440.hitReturnRatio));
              this.dirPlus = p439.lerp(0, this.targetAngle, Math.max(0, v427));
            }
          }
        };
        this.startAnim = function () {
          this.animTime = this.animSpeed = 600;
          this.targetAngle = Math.PI * 0.8;
          v427 = 0;
          v428 = 0;
        };
      }
    }
    ;
    class C14 {
      constructor(p449, p450) {
        this.x = p449;
        this.y = p450;
        this.damage = 10;
        this.health = 10;
        this.maxHealth = this.health;
        this.active = false;
        this.alive = false;
        this.timer = 1500;
        this.time = 0;
        this.damaged = 0;
        this.alpha = 1;
        this.scale = 9;
        this.visScale = this.scale;
      }
    }
    ;
    class C15 {
      constructor(p451, p452, p453, p454) {
        this.x = p451;
        this.y = p452;
        this.alpha = 0;
        this.active = true;
        this.alive = false;
        this.chat = p453;
        this.owner = p454;
      }
    }
    ;
    class C16 {
      constructor(p455, p456, p457, p458, p459, p460, p461, p462, p463) {
        this.x = p455;
        this.y = p456;
        this.lastDir = p457;
        this.dir = p457 + Math.PI;
        this.buildIndex = p458;
        this.weaponIndex = p459;
        this.weaponVariant = p460;
        this.skinColor = p461;
        this.scale = p462;
        this.visScale = 0;
        this.name = p463;
        this.alpha = 1;
        this.active = true;
        this.animate = function (p464) {
          let v429 = v679.getAngleDist(this.lastDir, this.dir);
          if (v429 > 0.01) {
            this.dir += v429 / 20;
          } else {
            this.dir = this.lastDir;
          }
          if (this.visScale < this.scale) {
            this.visScale += p464 / (this.scale / 2);
            if (this.visScale >= this.scale) {
              this.visScale = this.scale;
            }
          }
          this.alpha -= p464 / 30000;
          if (this.alpha <= 0) {
            this.alpha = 0;
            this.active = false;
          }
        };
      }
    }
    ;
    class C17 {
      constructor(p465, p466, p467, p468, p469, p470, p471, p472, p473, p474, p475, p476, p477, p478) {
        this.id = p465;
        this.sid = p466;
        this.tmpScore = 0;
        this.team = null;
        this.latestSkin = 0;
        this.oldSkinIndex = 0;
        this.prevHW;
        this.prevDW;
        this.skinIndex = 0;
        this.latestTail = 0;
        this.oldTailIndex = 0;
        this.tailIndex = 0;
        this.hitTime = 0;
        this.lastHit = 0;
        this.hitTick = 0;
        this.inWater = false;
        this.tails = {};
        this.antiTurretSpam = false;
        for (let v430 = 0; v430 < p475.length; ++v430) {
          if (p475[v430].price <= 0) {
            this.tails[p475[v430].id] = 1;
          }
        }
        this.skins = {};
        for (let v431 = 0; v431 < p474.length; ++v431) {
          if (p474[v431].price <= 0) {
            this.skins[p474[v431].id] = 1;
          }
        }
        this.points = 0;
        this.dt = 0;
        this.hidden = false;
        this.itemCounts = {};
        this.isPlayer = true;
        this.pps = 0;
        this.moveDir = undefined;
        this.moveTime = 0;
        this.skinRot = 0;
        this.lastPing = 0;
        this.iconIndex = 0;
        this.skinColor = 0;
        this.dist2 = 0;
        this.aim2 = 0;
        this.maxSpeed = 1;
        this.chat = {
          message: null,
          count: 0
        };
        this.backupNobull = true;
        this.circle = false;
        this.circleRad = 200;
        this.circleRadSpd = 0.1;
        this.cAngle = 0;
        this.healSpeed = 0;
        this.spawn = function (p479) {
          this.attacked = false;
          this.death = false;
          this.spinDir = 0;
          this.sync = false;
          this.antiBull = 0;
          this.bullTimer = 0;
          this.poisonTimer = 0;
          this.active = true;
          this.alive = true;
          this.lockMove = false;
          this.lockDir = false;
          this.minimapCounter = 0;
          this.chatCountdown = 0;
          this.shameCount = 0;
          this.shameTimer = 0;
          this.sentTo = {};
          this.gathering = 0;
          this.gatherIndex = 0;
          this.lastGather = 0;
          this.shooting = {};
          this.shootIndex = 9;
          this.autoGather = 0;
          this.animTime = 0;
          this.animSpeed = 0;
          this.mouseState = 0;
          this.buildIndex = -1;
          this.weaponIndex = 0;
          this.weaponCode = 0;
          this.weaponVariant = 0;
          this.primaryIndex = undefined;
          this.secondaryIndex = undefined;
          this.dmgOverTime = {};
          this.noMovTimer = 0;
          this.maxXP = 300;
          this.XP = 0;
          this.age = 1;
          this.kills = 0;
          this.upgrAge = 2;
          this.upgradePoints = 0;
          this.x = 0;
          this.y = 0;
          this.oldXY = {
            x: 0,
            y: 0
          };
          this.zIndex = 0;
          this.xVel = 0;
          this.yVel = 0;
          this.slowMult = 1;
          this.dir = 0;
          this.dirPlus = 0;
          this.targetDir = 0;
          this.targetAngle = 0;
          this.maxHealth = 100;
          this.health = this.maxHealth;
          this.oldHealth = this.maxHealth;
          this.damaged = 0;
          this.scale = p467.playerScale;
          this.speed = p467.playerSpeed;
          this.resetMoveDir();
          this.resetResources(p479);
          this.items = [0, 3, 6, 10];
          this.weapons = [0];
          this.shootCount = 0;
          this.weaponXP = [];
          this.reloads = {
            "0": 0,
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9": 0,
            "10": 0,
            "11": 0,
            "12": 0,
            "13": 0,
            "14": 0,
            "15": 0,
            "53": 0
          };
          this.bowThreat = {
            "9": 0,
            "12": 0,
            "13": 0,
            "15": 0
          };
          this.damageThreat = 0;
          this.mostDamageThreat = 0;
          this.inTrap = false;
          this.canEmpAnti = false;
          this.empAnti = false;
          this.soldierAnti = false;
          this.poisonTick = 0;
          this.bullTick = 0;
          this.setPoisonTick = false;
          this.setBullTick = false;
          this.antiTimer = 2;
        };
        this.resetMoveDir = function () {
          this.moveDir = undefined;
        };
        this.resetResources = function (p480) {
          for (let v432 = 0; v432 < p467.resourceTypes.length; ++v432) {
            this[p467.resourceTypes[v432]] = p480 ? 100 : 0;
          }
        };
        this.getItemType = function (p481) {
          let v433 = this.items.findIndex(p482 => p482 == p481);
          if (v433 != -1) {
            return v433;
          } else {
            return p473.checkItem.index(p481, this.items);
          }
        };
        this.setData = function (p483) {
          this.id = p483[0];
          this.sid = p483[1];
          this.name = p483[2];
          this.x = p483[3];
          this.y = p483[4];
          this.dir = p483[5];
          this.health = p483[6];
          this.maxHealth = p483[7];
          this.scale = p483[8];
          this.skinColor = p483[9];
        };
        this.updateTimer = function () {
          this.bullTimer -= 1;
          if (this.bullTimer <= 0) {
            this.setBullTick = false;
            this.bullTick = v246.tick - 1;
            this.bullTimer = p467.serverUpdateRate;
          }
          this.poisonTimer -= 1;
          if (this.poisonTimer <= 0) {
            this.setPoisonTick = false;
            this.poisonTick = v246.tick - 1;
            this.poisonTimer = p467.serverUpdateRate;
          }
        };
        this.update = function (p484) {
          if (this.sid == v287) {
            this.circleRad = parseInt(f5("circleRad").value) || 0;
            this.circleRadSpd = parseFloat(f5("radSpeed").value) || 0;
            this.cAngle += this.circleRadSpd;
          }
          if (this.active) {
            let v434 = {
              skin: f26(p474, this.skinIndex),
              tail: f26(p475, this.tailIndex)
            };
            let v435 = (this.buildIndex >= 0 ? 0.5 : 1) * (p473.weapons[this.weaponIndex].spdMult || 1) * (v434.skin ? v434.skin.spdMult || 1 : 1) * (v434.tail ? v434.tail.spdMult || 1 : 1) * (this.y <= p467.snowBiomeTop ? v434.skin && v434.skin.coldM ? 1 : p467.snowSpeed : 1) * this.slowMult;
            this.maxSpeed = v435;
          }
        };
        let v436 = 0;
        let v437 = 0;
        this.animate = function (p485) {
          if (this.animTime > 0) {
            this.animTime -= p485;
            if (this.animTime <= 0) {
              this.animTime = 0;
              this.dirPlus = 0;
              v436 = 0;
              v437 = 0;
            } else if (v437 == 0) {
              v436 += p485 / (this.animSpeed * p467.hitReturnRatio);
              this.dirPlus = p468.lerp(0, this.targetAngle, Math.min(1, v436));
              if (v436 >= 1) {
                v436 = 1;
                v437 = 1;
              }
            } else {
              v436 -= p485 / (this.animSpeed * (1 - p467.hitReturnRatio));
              this.dirPlus = p468.lerp(0, this.targetAngle, Math.max(0, v436));
            }
          }
        };
        this.startAnim = function (p486, p487) {
          this.animTime = this.animSpeed = p473.weapons[p487].speed;
          this.targetAngle = p486 ? -p467.hitAngle : -Math.PI;
          v436 = 0;
          v437 = 0;
        };
        this.canSee = function (p488) {
          if (!p488) {
            return false;
          }
          let v438 = Math.abs(p488.x - this.x) - p488.scale;
          let v439 = Math.abs(p488.y - this.y) - p488.scale;
          return v438 <= p467.maxScreenWidth / 2 * 1.3 && v439 <= p467.maxScreenHeight / 2 * 1.3;
        };
        this.judgeShame = function () {
          if (this.oldHealth < this.health) {
            if (this.hitTime) {
              let v440 = Date.now() - this.hitTime;
              this.hitTime = 0;
              if (v440 < 120) {
                this.shameCount++;
              } else {
                this.shameCount = Math.max(0, this.shameCount - 2);
              }
            }
          } else if (this.oldHealth > this.health) {
            this.hitTime = Date.now();
            this.lastHit = Date.now();
            this.hitTick = v246.tick;
          }
        };
        this.addShameTimer = function () {
          this.shameCount = 0;
          this.shameTimer = 30;
          let vSetInterval2 = setInterval(() => {
            this.shameTimer--;
            if (this.shameTimer <= 0) {
              clearInterval(vSetInterval2);
            }
          }, 1000);
        };
        this.isTeam = function (p489) {
          return this == p489 || this.team && this.team == p489.team;
        };
        this.findAllianceBySid = function (p490) {
          if (this.team) {
            return v280.find(p491 => p491 === p490);
          } else {
            return null;
          }
        };
        this.checkCanInsta = function (p492) {
          let v441 = 0;
          if (this.alive && v317) {
            let v442 = {
              weapon: this.weapons[0],
              variant: this.primaryVariant,
              dmg: this.weapons[0] == undefined ? 0 : p473.weapons[this.weapons[0]].dmg
            };
            const v443 = {
              weapon: this.weapons[1],
              variant: this.secondaryVariant,
              dmg: this.weapons[1] == undefined ? 0 : p473.weapons[this.weapons[1]].Pdmg
            };
            let vV443 = v443;
            let v444 = this.skins[7] && !p492 ? 1.5 : 1;
            let v445 = v442.variant != undefined ? p467.weaponVariants[v442.variant].val : 1;
            if (v442.weapon != undefined && this.reloads[v442.weapon] == 0) {
              v441 += v442.dmg * v445 * v444;
            }
            if (vV443.weapon != undefined && this.reloads[vV443.weapon] == 0) {
              v441 += vV443.dmg;
            }
            if (this.skins[53] && this.reloads[53] <= (v286.weapons[1] == 10 ? 0 : v246.tickRate) && v291.skinIndex != 22) {
              v441 += 25;
            }
            v441 *= v291.skinIndex == 6 ? 0.75 : 1;
            return v441;
          }
          return 0;
        };
        this.manageReload = function () {
          if (this.shooting[53]) {
            this.shooting[53] = 0;
            this.reloads[53] = 2500 - v246.tickRate;
          } else if (this.reloads[53] > 0) {
            this.reloads[53] = Math.max(0, this.reloads[53] - v246.tickRate);
          }
          if (this.gathering || this.shooting[1]) {
            if (this.gathering) {
              this.gathering = 0;
              this.reloads[this.gatherIndex] = p473.weapons[this.gatherIndex].speed * (this.skinIndex == 20 ? 0.78 : 1);
              this.attacked = true;
            }
            if (this.shooting[1]) {
              this.shooting[1] = 0;
              this.reloads[this.shootIndex] = p473.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1);
              this.attacked = true;
            }
          } else {
            this.attacked = false;
            if (this.buildIndex < 0) {
              if (this.reloads[this.weaponIndex] > 0) {
                this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - v246.tickRate);
                if (this == v286) {
                  if (f5("weaponGrind").checked) {
                    for (let v446 = 0; v446 < Math.PI * 2; v446 += Math.PI / 2) {
                      f48(v286.getItemType(22), v446);
                    }
                  }
                }
                if (this.reloads[this.primaryIndex] == 0 && this.reloads[this.weaponIndex] == 0) {
                  this.antiBull++;
                  v246.tickBase(() => {
                    this.antiBull = 0;
                  }, 1);
                }
              }
            }
          }
        };
        this.addDamageThreat = function (p493) {
          const v447 = {
            weapon: this.primaryIndex,
            variant: this.primaryVariant
          };
          let vV447 = v447;
          const v448 = {
            weapon: this.secondaryIndex,
            variant: this.secondaryVariant
          };
          let vV448 = v448;
          vV447.dmg = vV447.weapon == undefined ? 45 : p473.weapons[vV447.weapon].dmg;
          vV448.dmg = vV448.weapon == undefined ? 50 : vV448.weapon == 10 ? p473.weapons[vV448.weapon].dmg : p473.weapons[vV448.weapon].Pdmg;
          let v449 = 1.5;
          let v450 = vV447.variant != undefined ? p467.weaponVariants[vV447.variant].val : 1.18;
          let v451 = vV448.variant != undefined ? [9, 12, 13, 15].includes(vV448.weapon) ? 1 : p467.weaponVariants[vV448.variant].val : 1.18;
          if (vV447.weapon == undefined || this.reloads[vV447.weapon] <= v292 * 2 + 120) {
            this.mostDamageThreat += vV447.dmg * v450 * v449;
            if (vV447.weapon == undefined || this.reloads[vV447.weapon] <= v292) {
              this.damageThreat += vV447.dmg * v450 * v449;
            }
          }
          if (vV448.weapon == undefined || this.reloads[vV448.weapon] <= v292 * 2 + 120) {
            this.mostDamageThreat += vV448.dmg * v451;
            if (vV448.weapon == undefined || this.reloads[vV448.weapon] <= v292) {
              this.damageThreat += vV448.dmg * v451;
            }
          }
          if (this.reloads[53] <= v246.tickRate) {
            this.damageThreat += 25;
            this.mostDamageThreat += 25;
          }
          if (v293.predictSpikes > 0) {
            let v452 = (vV448.weapon == 10 ? 45 : 35) * v293.predictSpikes;
            this.damageThreat += v452;
            this.mostDamageThreat += v452;
            v293.predictSpikes = 0;
          }
          if (vV447.variant == 3 || vV448.weapon == 10 && vV448.variant == 3) {
            this.damageThreat += 5;
            this.mostDamageThreat += 5;
          }
          if (v706.count) {
            this.damageThreat += v706.dmg;
            this.mostDamageThreat += v706.dmg;
            v286.chat.message = "projectile dmg: " + v706.dmg;
            v286.chat.count = 500;
          }
          this.damageThreat *= p493.skinIndex == 6 && !v689.isTrue ? 0.75 : 1;
          if (!this.isTeam(p493)) {
            if (this.dist2 <= 300) {
              p493.damageThreat += this.damageThreat;
              p493.mostDamageThreat += this.mostDamageThreat;
            }
          }
        };
      }
    }
    ;
    function f38(p494) {
      v286.reloads[p494] = 0;
      f23("H", p494);
    }
    function f39(p495, p496) {
      f23("c", 0, p495, p496);
    }
    function f40(p497, p498) {
      f23("c", 1, p497, p498);
    }
    let v453 = 0;
    let v454 = 0;
    function f41(p499, p500) {
      let v455 = v286.skins[6] ? 6 : 0;
      if (v286.alive && v317) {
        if (p500 == 0) {
          if (p499 == 6) {
            if (Date.now() - v453 > v246.tickRate) {
              v454 = p499;
              v453 = Date.now();
            }
          } else {
            v454 = p499;
            v453 = Date.now();
          }
          if (v286.skins[p499]) {
            if (v286.latestSkin != p499) {
              f23("c", 0, p499, 0);
            }
          } else if (vF20.autoBuyEquip) {
            let vF26 = f26(v683, p499);
            if (vF26) {
              if (v286.points >= vF26.price) {
                f23("c", 1, p499, 0);
                f23("c", 0, p499, 0);
              } else if (v286.latestSkin != v455) {
                f23("c", 0, v455, 0);
              }
            } else if (v286.latestSkin != v455) {
              f23("c", 0, v455, 0);
            }
          } else if (v286.latestSkin != v455) {
            f23("c", 0, v455, 0);
          }
        } else if (p500 == 1) {
          if (v241 && p499 != 11 && p499 != 0) {
            if (v286.latestTail != 0) {
              f23("c", 0, 0, 1);
            }
            return;
          }
          if (v286.tails[p499]) {
            if (v286.latestTail != p499) {
              f23("c", 0, p499, 1);
            }
          } else if (vF20.autoBuyEquip) {
            let vF262 = f26(v684, p499);
            if (vF262) {
              if (v286.points >= vF262.price) {
                f23("c", 1, p499, 1);
                f23("c", 0, p499, 1);
              } else if (v286.latestTail != 0) {
                f23("c", 0, 0, 1);
              }
            } else if (v286.latestTail != 0) {
              f23("c", 0, 0, 1);
            }
          } else if (v286.latestTail != 0) {
            f23("c", 0, 0, 1);
          }
        }
      }
    }
    function f42(p501, p502) {
      f23("z", p501, p502);
    }
    function f43(p503, p504) {
      if (!p504) {
        v286.weaponCode = p503;
      }
      f23("z", p503, 1);
    }
    let v456 = false;
    let v457 = false;
    function f44(p505) {
      if (v456) {
        return;
      }
      v456 = true;
      if (p505) {
        f23("K", 1, 1);
      } else {
        v457 = !v457;
        f23("K", 1, 1);
      }
      setTimeout(() => {
        v456 = false;
      }, 69);
    }
    function f45(p506, p507) {
      f23("F", p506, p507, 1);
    }
    function f46(p508, p509, p510, p511) {
      try {
        if (p508 == undefined) {
          return;
        }
        let v458 = v680.list[v286.items[p508]];
        let v459 = v286.scale + v458.scale + (v458.placeOffset || 0);
        let v460 = v286.x2 + v459 * Math.cos(p509);
        let v461 = v286.y2 + v459 * Math.sin(p509);
        if (p508 === 0 || v98 || (v286.alive && v317 && v286.itemCounts[v458.group.id] == undefined ? true : v286.itemCounts[v458.group.id] < (vP11.isSandbox ? p508 === 3 || p508 === 5 ? 299 : 99 : v458.group.limit ? v458.group.limit : 99))) {
          f42(v286.items[p508]);
          f45(1, p509);
          f43(v286.weaponCode, 1);
          const v462 = {
            x: v460,
            y: v461
          };
          if (p511 && vF20.spikeTick && p508 == 2 && v679.getDist(v291, v462, 2, 0) <= 85) {
            v689.canSpikeTick = true;
          }
          if (f5("placeVis").checked) {
            if (!p510) {
              const v463 = {
                x: v460,
                y: v461,
                name: v458.name,
                scale: v458.scale,
                dir: p509
              };
              v323.push(v463);
              v246.tickBase(() => {
                v323.shift();
              }, 1);
            } else {
              if (p508 == 4) {
                const v464 = {
                  x: v460,
                  y: v461,
                  name: v458.name,
                  scale: v458.scale,
                  dir: p509
                };
                v324.push(v464);
                v246.tickBase(() => {
                  v324.shift();
                }, 1);
              }
              if (p508 == 2) {
                const v465 = {
                  x: v460,
                  y: v461,
                  name: v458.name,
                  scale: v458.scale,
                  dir: p509
                };
                v325.push(v465);
                v246.tickBase(() => {
                  v325.shift();
                }, 1);
              }
            }
          }
        }
      } catch (_0x1ab61c) {}
    }
    function f47(p512, p513) {
      f46(p512, p513, 0, 1);
    }
    function f48(p514, p515) {
      try {
        if (p514 == undefined) {
          return;
        }
        let v466 = v680.list[v286.items[p514]];
        let v467 = v286.scale + v466.scale + (v466.placeOffset || 0);
        let v468 = v286.x2 + v467 * Math.cos(p515);
        let v469 = v286.y2 + v467 * Math.sin(p515);
        if (v681.checkItemLocation(v468, v469, v466.scale, 0.6, v466.id, false)) {
          f46(p514, p515);
        }
      } catch (_0xed67c9) {}
    }
    function f49() {
      if (v286.latestSkin == 6) {
        return 0.75;
      } else {
        return 1;
      }
    }
    function f50() {
      if (v286.health == 100) {
        return 0;
      }
      if (v286.skinIndex != 45 && v286.skinIndex != 56) {
        return Math.ceil((100 - v286.health) / v680.list[v286.items[0]].healing);
      }
      return 0;
    }
    function f51(p516) {
      let v470 = v289.filter(p517 => {
        const v471 = {
          three: p517.attacked
        };
        let vV471 = v471;
        return vV471.three;
      });
      return v470;
    }
    function f52() {
      for (let v472 = 0; v472 < f50(); v472++) {
        f46(0, f74());
      }
    }
    function f53(p518) {
      for (let v473 = 0; v473 < p518; v473++) {
        f46(0, f74());
      }
    }
    function f54(p519) {
      v293.antiSync = true;
      let vSetInterval3 = setInterval(() => {
        if (v286.shameCount < 5) {
          f46(0, f74());
        }
      }, 75);
      setTimeout(() => {
        clearInterval(vSetInterval3);
        setTimeout(() => {
          v293.antiSync = false;
        }, v246.tickRate);
      }, v246.tickRate);
    }
    let v474 = [28, 29, 30, 36, 37, 38, 44];
    let v475 = 0;
    function f55(p520, p521) {
      if (v286.inWater) {
        if (p521) {
          return 31;
        }
        f41(31, 0);
      } else if (f5("hatType").value == "bg") {
        if (p521) {
          return 10;
        }
        f41(10, 0);
      } else if (f5("hatType").value == "loop") {
        v475 = v475 >= v474.length - 1 ? 0 : v475 + 1;
        if (v286.y2 <= vP11.snowBiomeTop) {
          if (p521) {
            if (p520 && (v286.moveDir == undefined || v286.antiTurretSpam)) {
              return 22;
            } else {
              return v474[v475];
            }
          }
          f41(p520 && (v286.moveDir == undefined || v286.antiTurretSpam) ? 22 : v474[v475], 0);
        } else {
          if (p521) {
            if (p520 && (v286.moveDir == undefined || v286.antiTurretSpam)) {
              return 22;
            } else {
              return v474[v475];
            }
          }
          f41(p520 && (v286.moveDir == undefined || v286.antiTurretSpam) ? 22 : v474[v475], 0);
        }
      } else if (v286.y2 <= vP11.snowBiomeTop) {
        if (p521) {
          if (p520 && (v286.moveDir == undefined || v286.antiTurretSpam)) {
            return 22;
          } else {
            return 15;
          }
        }
        f41(p520 && (v286.moveDir == undefined || v286.antiTurretSpam) ? 22 : 15, 0);
      } else {
        if (p521) {
          if (p520 && (v286.moveDir == undefined || v286.antiTurretSpam)) {
            return 22;
          } else {
            return 12;
          }
        }
        f41(p520 && (v286.moveDir == undefined || v286.antiTurretSpam) ? 22 : 12, 0);
      }
      if (p521) {
        return 0;
      }
    }
    function f56(p522) {
      f41(p522 && v286.moveDir == undefined ? 0 : 11, 1);
    }
    const vF6 = (p523, p524, p525) => {
      if (!p524) {
        return null;
      }
      const v476 = Math.PI / 2;
      const v477 = Math.PI / 69;
      const v478 = v680.list[v286.items[p523]];
      let v479 = v286.scale + v478.scale + (v478.placeOffset || 0);
      let v480 = [];
      let v481 = v679.getDirect(p524, v286, 0, 2);
      if (p525 && p524.sid != p525.sid) {
        let v482 = v679.getDirect(p525, v286, 0, 2);
        for (let v483 = 0; v483 <= v476; v483 += v477) {
          let v484 = [(v482 + v483) % (Math.PI * 2), (v482 - v483 + Math.PI * 2) % (Math.PI * 2)];
          for (let v485 of v484) {
            if (v681.preplaceCheck(v478, v485, p524, v479)) {
              v480.push(v485);
            }
          }
        }
        if (v480.length) {
          v480.sort((p526, p527) => {
            return v679.getAngleDist(p526, v482) - v679.getAngleDist(p527, v482);
          });
          return v480[0];
        }
      } else {
        for (let v486 = 0; v486 <= v476; v486 += v477) {
          let v487 = [(v481 + v486) % (Math.PI * 2), (v481 - v486 + Math.PI * 2) % (Math.PI * 2)];
          for (let v488 of v487) {
            if (v681.preplaceCheck(v478, v488, p524, v479)) {
              return v488;
            }
          }
        }
      }
      return null;
    };
    const vF7 = () => {
      if (v291.dist2 > 269) {
        return;
      }
      const v489 = [];
      for (let v490 of v282) {
        if (!v490.isItem || !v490.active || v679.getDist(v490, v286, 0, 2) > 150 || v490.isTeamObject(v286) && v490.hideFromEnemy) {
          continue;
        }
        if (v681.canBeBroken(v490)) {
          v489.push(v490);
        }
      }
      let v491 = v489.sort((p528, p529) => v679.getDist(p528, v291, 0, 2) - v679.getDist(p529, v291, 0, 2)).slice(0, Math.min(2, v489.length));
      const vF8 = () => {
        let v492 = v291.inTrap;
        v491.forEach(p530 => {
          let v493 = v492 && !v293.autoPush && (f5("preplaceMore").value == "spike" ? true : p530.sid != v492.sid) ? 2 : 4;
          let vVF6 = vF6(v493, p530, v492);
          if (vVF6 !== null) {
            f46(v493, vVF6, 1);
          }
        });
      };
      vF8();
    };
    let v494 = [];
    class C18 {
      constructor() {}
    }
    class C19 {
      constructor(p531, p532) {
        this.dist = 0;
        this.aim = 0;
        this.inTrap = false;
        this.hasSpike = false;
        this.replaced = true;
        this.antiTrapped = false;
        this.info = {};
        this.replaceSids = [];
        this.radObjs = [];
        this.preplaces = [[], []];
        this.nest = {
          rad: 0,
          x: 0,
          y: 0
        };
        this.notFast = function (p533, p534 = v286) {
          if (p534.secondaryIndex == 10) {
            if (p533.health > p532.weapons[p534.primaryIndex].dmg || [5, 8].includes(p534.primaryIndex)) {
              return true;
            }
            if (p533.health <= p532.weapons[p534.primaryIndex].dmg) {
              if (!v681.canHit(p534, p533, p534.primaryIndex)) {
                return true;
              }
            }
          }
          return false;
        };
        this.testCanPlace = function (p535, p536 = -(Math.PI / 2), p537 = Math.PI / 2, p538 = Math.PI / 18, p539, p540, p541) {
          try {
            let v495 = p532.list[v286.items[p535]];
            let v496 = v286.scale + v495.scale + (v495.placeOffset || 0);
            let v497 = {
              attempts: 0,
              placed: 0
            };
            let v498 = [];
            v282.forEach(p542 => {
              v498.push({
                x: p542.x,
                y: p542.y,
                active: p542.active,
                blocker: p542.blocker,
                scale: p542.scale,
                isItem: p542.isItem,
                type: p542.type,
                colDiv: p542.colDiv,
                getScale: function (p543, p544) {
                  p543 = p543 || 1;
                  return this.scale * (this.isItem || this.type == 2 || this.type == 3 || this.type == 4 ? 1 : p543 * 0.6) * (p544 ? 1 : this.colDiv);
                }
              });
            });
            for (let vP536 = p536; vP536 <= p537; vP536 += p538) {
              v497.attempts++;
              let v499 = p539 + vP536;
              let v500 = v286.x2 + v496 * Math.cos(v499);
              let v501 = v286.y2 + v496 * Math.sin(v499);
              let v502 = v498.find(p545 => p545.active && p531.getDistance(v500, v501, p545.x, p545.y) < v495.scale + (p545.blocker ? p545.blocker : p545.getScale(0.6, p545.isItem)));
              if (v502) {
                continue;
              }
              if (v495.id != 18 && v501 >= vP11.mapScale / 2 - vP11.riverWidth / 2 && v501 <= vP11.mapScale / 2 + vP11.riverWidth / 2) {
                continue;
              }
              f46(p535, v499);
              const v503 = {
                x: v500,
                y: v501,
                active: true,
                blocker: v495.blocker,
                scale: v495.scale,
                isItem: true,
                type: null,
                colDiv: v495.colDiv,
                getScale: function () {
                  return this.scale;
                }
              };
              v498.push(v503);
              if (p531.getAngleDist(v291.aim2, v499) <= 1) {
                v497.placed++;
              }
              if (v497.placed > 0) {
                if (p540 && v495.dmg && Date.now() - this.info[0].breakTime >= 240) {
                  const v504 = {
                    x: v500,
                    y: v501
                  };
                  if (p531.getDist(v291, v504, 2, 0) <= 85 && vF20.spikeTick) {
                    v689.canSpikeTick = true;
                  }
                }
                if (p541 && v495.dmg && v497.placed >= 8) {
                  f23("N");
                }
              }
            }
          } catch (_0x1a0c89) {}
        };
        this.createObj = function (p546, p547) {
          const v505 = {
            id: p546.id,
            dir: p547,
            scale: p546.scale
          };
          let vV505 = v505;
          vV505.x = v286.x2 + (v286.scale + vV505.scale + (p546.placeOffset || 0)) * Math.cos(vV505.dir);
          vV505.y = v286.y2 + (v286.scale + vV505.scale + (p546.placeOffset || 0)) * Math.sin(vV505.dir);
          return vV505;
        };
        this.radCalc = function (p548, p549, p550, p551) {
          let v506 = this.createObj(p550, p549);
          let v507 = p548.getScale(0.6, p548.isItem);
          let v508 = p531.getDist(p548, v506, 0, 0);
          let v509 = v507 + v506.scale;
          let v510 = [];
          if (v508 < v509) {
            let v511 = Math.acos(v508 / v509);
            let v512 = [v511, -v511];
            for (let v513 = 0; v513 < v512.length; v513++) {
              let v514 = p549 + v512[v513];
              v506 = this.createObj(p550, v514);
              let v515 = this.preplaces[1].length ? this.preplaces[1].some(p552 => p531.getDist(p552, v506, 0, 0) < p552.scale + v506.scale) : false;
              if (v515) {
                continue;
              }
              let v516 = this.preplaces[0].length ? this.preplaces[0].some(p553 => p531.getDist(p553, v506, 0, 0) < p553.scale + v506.scale) : false;
              if (v516) {
                continue;
              }
              let v517 = v681.checkItemLocation(v506.x, v506.y, v506.scale, 0.6, v506.id, false);
              if (v517) {
                v510.push(v514);
                this.preplaces[1].push(v506);
              }
            }
          } else {
            if (p551) {
              return [];
            }
            v506 = this.createObj(p550, p549);
            let v518 = this.preplaces[1].length ? this.preplaces[1].some(p554 => p531.getDist(p554, v506, 0, 0) < p554.scale + v506.scale) : false;
            if (v518) {
              return [];
            }
            let v519 = this.preplaces[0].length ? this.preplaces[0].some(p555 => p531.getDist(p555, v506, 0, 0) < p555.scale + v506.scale) : false;
            if (v519) {
              return [];
            }
            let v520 = v681.checkItemLocation(v506.x, v506.y, v506.scale, 0.6, v506.id, false);
            if (v520) {
              v510.push(p549);
              this.preplaces[1].push(v506);
            }
          }
          return v510;
        };
        this.checkSpikeTick = function () {
          let v521 = 0;
          let v522 = false;
          if (!f5("safeAntiSpikeTick").checked || !v289.length) {
            return false;
          }
          if (v291.dist2 <= p532.weapons[v291.primaryIndex || 5].range + v286.scale * 2 + 24) {
            if (this.inTrap && this.info[0].health <= p532.weapons[v286.weaponIndex].dmg * vP11.weaponVariants[v286[(v286.weaponIndex < 9 ? "prima" : "seconda") + "ryVariant"]].val * (p532.weapons[v286.weaponIndex].sDmg || 1) * 3.3) {
              v521++;
              v522 = true;
            }
            if (!this.inTrap) {
              if (v291.reloads[v291.primaryIndex] <= v246.tickRate) {
                let v523 = new Set();
                for (let v524 of v282) {
                  if (v524.dmg && v524.active && !v524.isTeamObject(v286) || v524.type == 1 && v524.y >= 12000) {
                    let v525 = Math.atan2(v286.y2 - v291.y2, v286.x2 - v291.x2);
                    let v526 = (p532.weapons[v291.weapons[0]].knock || 0) * p532.weapons[v291.weapons[0]].range + v286.scale * 2;
                    let v527 = ![undefined, 9, 12, 13, 15].includes(v291.weapons[1]) ? (p532.weapons[v291.weapons[1]].knock || 0) * p532.weapons[v291.weapons[1]].range + v286.scale * 2 : 69;
                    let v528 = 69;
                    let v529 = v526 + v527 + v528;
                    let v530 = 13;
                    let v531 = v529 / v530;
                    let v532 = 40;
                    for (let v533 = 1; v533 <= v530; v533++) {
                      let v534 = v531 * v533;
                      if (v534 < v532) {
                        continue;
                      }
                      let v535 = v286.x2 + v531 * v533 * Math.cos(v525);
                      let v536 = v286.y2 + v531 * v533 * Math.sin(v525);
                      v273.mex = v535;
                      v273.mey = v536;
                      const v537 = {
                        x: v535,
                        y: v536
                      };
                      let v538 = p531.getDist(v537, v524, 0, 0);
                      if (v538 <= v524.scale + v286.scale * 1.5) {
                        if (!v523.has(v524.sid)) {
                          v523.add(v524.sid);
                        }
                      }
                    }
                  }
                }
                v521 += v523.size;
                if (![3, 4, 5].includes(v291.primaryIndex)) {
                  v522 = true;
                }
              }
            }
          }
          return [v521, v522];
        };
        this.protect = function (p556) {
          if (!vF20.antiTrap) {
            return;
          }
          this.testCanPlace(4, -(Math.PI / 2), Math.PI / 2, Math.PI / 22, p556 + Math.PI);
          this.testCanPlace(4, -(Math.PI / 4), Math.PI / 4, Math.PI / 10, p556 + Math.PI);
          this.antiTrapped = true;
        };
        this.autoPlace = function (p557, p558, p559, p560) {
          if (!v289.length) {
            return;
          }
          if (!vF20.autoPlace) {
            return;
          }
          if (p557 == 0) {
            if (p558 == undefined) {
              return;
            }
            let v539 = v286.items[p558];
            if (v539 == undefined) {
              return;
            }
            let v540 = p532.list[v539];
            let v541 = p559 == undefined ? null : v286.items[p559];
            let v542 = v541 == undefined ? null : p532.list[v541];
            this.radObjs = v282.filter(p561 => p561.active && p531.getDist(p561, v286, 0, 2) < 300);
            if (this.radObjs.length) {
              for (let v543 = 0; v543 < this.radObjs.length; v543++) {
                let v544 = this.radObjs[v543];
                let v545 = p531.getDirect(v544, v286, 0, 2);
                let v546 = this.radCalc(v544, v545, v540);
                if (v546.length) {
                  for (let v547 = 0; v547 < v546.length; v547++) {
                    f46(p558, v546[v547]);
                  }
                } else if (v542) {
                  let v548 = this.radObjs[v543];
                  let v549 = p531.getDirect(v548, v286, 0, 2);
                  let v550 = this.radCalc(v548, v549, v542);
                  if (v550.length) {
                    for (let v551 = 0; v551 < v550.length; v551++) {
                      f46(p559, v550[v551]);
                    }
                  }
                }
              }
            } else {
              for (let v552 = 0; v552 < Math.PI * 2; v552 += Math.PI / 2) {
                f48(p558, v291.aim2 + v552);
              }
            }
          } else if (p557 == 1) {
            if (p558 == undefined) {
              return;
            }
            let v553 = v286.items[p558];
            if (v553 == undefined) {
              return;
            }
            let v554 = p532.list[v553];
            this.nest.rad = 0;
            this.nest.x = v291.x2;
            this.nest.y = v291.y2;
            this.radObjs = v282.filter(p562 => {
              if ((p558 == 4 ? p562.dmg : p562.trap) && p562.active) {
                let v555 = p531.getDist(p562, v291, 0, 2);
                if (v555 < 500) {
                  if (this.nest.rad < v555) {
                    this.nest.rad = v555;
                  }
                  return true;
                }
              }
            });
            if (this.radObjs.length) {
              for (let v556 = 0; v556 < this.radObjs.length; v556++) {
                let v557 = this.radObjs[v556];
                let v558 = p531.getDirect(v557, v286, 0, 2);
                let v559 = this.radCalc(v557, v558, v554, 1);
                if (v559.length) {
                  for (let v560 = 0; v560 < v559.length; v560++) {
                    f46(p558, v559[v560]);
                  }
                }
              }
            }
            if (p560 && this.preplaces[1].length < 1) {
              this.autoPlace(1, p559, p558, false);
            }
          }
        };
        this.autoReplace = function (p563) {
          if (!v289.length) {
            return;
          }
          if (v291.dist2 > 300) {
            return;
          }
          if (!vF20.autoReplace) {
            return;
          }
          if (f5("weaponGrind").checked) {
            return;
          }
          let v561 = p563.length;
          for (let v562 = 0; v562 < v561; v562++) {
            let v563 = false;
            let v564 = p563[v562];
            v288 = f31(v564);
            if (!v288) {
              continue;
            }
            let v565 = p531.getDist(v288, v286, 0, 2);
            if (v565 > 300) {
              continue;
            }
            let v566 = p531.getDirect(v288, v286, 0, 2);
            let v567 = p531.getAngleDist(v566, v291.aim2);
            if (this.info[0]) {
              if (!this.info[0].active && Date.now() - this.info[0].breakTime <= 111) {
                if (v286.items[4] == 15) {
                  this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, v566);
                  continue;
                }
              }
            }
            let v568 = v565 > 200 ? 4 : v567 < Math.PI / 3 ? 4 : 2;
            let v569 = v286.items[v568];
            if (v569 == undefined) {
              continue;
            }
            let v570 = p532.list[v569];
            let v571 = this.createObj(v570, v566);
            let v572 = this.preplaces[0].length ? this.preplaces[0].some(p564 => p531.getDist(p564, v571, 0, 0) < p564.scale + v571.scale) : false;
            if (!v572) {
              let v573 = v681.checkItemLocation(v571.x, v571.y, v571.scale, 0.6, v571.id, false);
              if (v573) {
                f47(v568, v566);
                v563 = true;
                this.preplaces[0].push(v571);
              }
            }
            if (v563) {
              for (let v574 = -Math.PI * 1.5; v574 < Math.PI * 1.5; v574 += Math.PI / 32) {
                let v575 = v566 + v574 + Math.PI;
                let v576 = p531.getAngleDist(v575, v291.aim2);
                let v577 = v565 > 200 ? 4 : v576 < Math.PI / 4 ? 4 : v576 > Math.PI * 1.5 ? 4 : 2;
                let v578 = v286.items[v577];
                if (v578 == undefined) {
                  continue;
                }
                let v579 = p532.list[v578];
                let v580 = this.createObj(v579, v575);
                let v581 = this.preplaces[0].length ? this.preplaces[0].some(p565 => p531.getDist(p565, v580, 0, 0) < p565.scale + v580.scale) : false;
                if (!v581) {
                  let v582 = v681.checkItemLocation(v580.x, v580.y, v580.scale, 0.6, v580.id, false);
                  if (v582) {
                    f47(v577, v575);
                    this.preplaces[0].push(v580);
                  }
                }
              }
            } else {
              for (let v583 = -Math.PI * 1.5; v583 < Math.PI * 1.5; v583 += Math.PI / 32) {
                let v584 = v566 + v583;
                let v585 = p531.getAngleDist(v584, v291.aim2);
                let v586 = v565 > 200 ? 4 : v585 < Math.PI / 4 ? 4 : v585 > Math.PI * 1.5 ? 4 : 2;
                let v587 = v286.items[v586];
                if (v587 == undefined) {
                  continue;
                }
                let v588 = p532.list[v587];
                let v589 = this.createObj(v588, v584);
                let v590 = this.preplaces[0].length ? this.preplaces[0].some(p566 => p531.getDist(p566, v589, 0, 0) < p566.scale + v589.scale) : false;
                if (!v590) {
                  let v591 = v681.checkItemLocation(v589.x, v589.y, v589.scale, 0.6, v589.id, false);
                  if (v591) {
                    f47(v586, v584);
                    this.preplaces[0].push(v589);
                  }
                }
              }
            }
          }
        };
      }
    }
    ;
    let v592 = {
      active: false,
      gridSize: 100,
      scale: 1440,
      paths: [],
      attempts: 0,
      finded: false
    };
    class C20 {
      constructor() {
        this.grid = [];
        this.foundPath = false;
      }
      init(p567, p568, p569) {
        let v593 = {
          x: 0,
          y: 0
        };
        let v594 = [];
        let v595 = v282.filter(p570 => p570.active && !p570.ignoreCollision && Math.abs(v286.x2 - p570.x) <= v592.scale / 2 + p570.scale && Math.abs(v286.y2 - p570.y) <= v592.scale / 2 + p570.scale);
        let v596 = v286.x3 - v592.scale / 2;
        let v597 = v286.y3 - v592.scale / 2;
        let v598 = v592.scale / v592.gridSize;
        let v599 = [v598 - 10, v598 + 10];
        let v600 = [v286.scale, vP11.mapScale - v286.scale];
        let v601 = p568 ? v599[1] : v598;
        this.grid = [];
        for (let v602 = 0; v602 < v592.gridSize; v602++) {
          this.grid[v602] = [];
          for (let v603 = 0; v603 < v592.gridSize; v603++) {
            let v604 = {
              x: v596 + v598 * v603,
              y: v597 + v598 * v602
            };
            if (v679.getDist(v604, v286, 0, 2) <= v286.scale) {
              this.grid[v602][v603] = 0;
              continue;
            }
            if (p569 == "auto push") {
              const v605 = {
                x: p567.x,
                y: p567.y
              };
              let v606 = v679.getDist(v604, v605, 0, 0);
              if (v606 <= v599[1]) {
                const v607 = {
                  x: v603,
                  y: v602,
                  dist: v606
                };
                v594.push(v607);
                this.grid[v602][v603] = 0;
                continue;
              }
              let v608 = v679.getDist(v604, v291, 0, 2);
              if (v608 <= v291.scale) {
                this.grid[v602][v603] = 1;
                continue;
              }
              let v609 = v595.some(p571 => {
                return v679.getDist(v604, p571, 0, 0) <= p571.scale + v286.scale + 15;
              });
              if (v609) {
                this.grid[v602][v603] = 1;
              } else {
                this.grid[v602][v603] = 0;
              }
            } else if (p569 == "follow") {
              let v610 = v679.getDist(v604, {
                x: v291.x2 - p567.x,
                y: v291.y2 - p567.y
              }, 0, 0);
              if (v610 <= v599[1]) {
                const v611 = {
                  x: v603,
                  y: v602,
                  dist: v610
                };
                v594.push(v611);
                this.grid[v602][v603] = 0;
                continue;
              }
              let v612 = v595.some(p572 => {
                return v679.getDist(v604, p572, 0, 0) <= p572.scale + 10;
              });
              if (v612) {
                this.grid[v602][v603] = 1;
              } else {
                this.grid[v602][v603] = 0;
              }
            }
            if (v604.x < v600[0]) {
              this.grid[v602][v603] = 1;
              continue;
            }
            if (v604.x > v600[1]) {
              this.grid[v602][v603] = 1;
              continue;
            }
            if (v604.y < v600[0]) {
              this.grid[v602][v603] = 1;
              continue;
            }
            if (v604.y > v600[1]) {
              this.grid[v602][v603] = 1;
              continue;
            }
          }
        }
        this.foundPath = false;
        if (v594.length) {
          v594.sort((p573, p574) => {
            return p573.dist - p574.dist;
          });
          const v613 = {
            x: v594[0].x,
            y: v594[0].y
          };
          v593 = v613;
        }
        return {
          start: {
            x: v592.gridSize / 2,
            y: v592.gridSize / 2
          },
          goal: v593
        };
      }
      getPaths(p575) {
        return [{
          x: p575.x + 1,
          y: p575.y
        }, {
          x: p575.x + 1,
          y: p575.y + 1
        }, {
          x: p575.x,
          y: p575.y + 1
        }, {
          x: p575.x - 1,
          y: p575.y + 1
        }, {
          x: p575.x - 1,
          y: p575.y
        }, {
          x: p575.x - 1,
          y: p575.y - 1
        }, {
          x: p575.x,
          y: p575.y - 1
        }, {
          x: p575.x + 1,
          y: p575.y - 1
        }];
      }
      getScore(p576, p577) {
        return Math.abs(p576.x - p577.x) + Math.abs(p576.y - p577.y);
      }
      calc(p578, p579, p580) {
        let v614 = this.init(p578, p579, p580);
        let v615 = v614.goal;
        let v616 = v614.start;
        const v617 = {
          x: v615.x,
          y: v615.y
        };
        let vV617 = v617;
        let v618 = [{
          x: vV617.x,
          y: vV617.y,
          score: this.getScore(vV617, v616),
          seek: 0,
          hop: 0,
          start: true
        }];
        let v619 = this.getPaths(vV617);
        this.grid[v615.y][v615.x] = 0;
        this.grid[v616.y][v616.x] = 0;
        for (let v620 = 0; v620 < v619.length; v620++) {
          let v621 = v619[v620];
          if (v621.x < 0 || v621.y < 0 || v621.x > v592.gridSize - 1 || v621.y > v592.gridSize - 1) {
            continue;
          }
          if (this.grid[v621.y][v621.x] == 1) {
            continue;
          }
          v618.push({
            x: v621.x,
            y: v621.y,
            score: this.getScore(v621, v616),
            seek: 0,
            hop: 1
          });
        }
        let v622 = 100;
        let v623 = [];
        let v624 = 0;
        for (v624 = 0; v624 < v622; v624++) {
          if (this.foundPath || vV617.x == v616.x && vV617.y == v616.y) {
            if (!this.foundPath) {
              this.foundPath = true;
              v623.push({
                x: v286.x2 - v592.scale / 2 + v592.scale / v592.gridSize * vV617.x,
                y: v286.y2 - v592.scale / 2 + v592.scale / v592.gridSize * vV617.y
              });
            }
            let v625 = v618.filter(p581 => (p581.seek == 1 || p581.start) && Math.abs(p581.x - vV617.x) <= 1 && Math.abs(p581.y - vV617.y) <= 1).toSorted((p582, p583) => {
              return p582.hop - p583.hop;
            });
            if (v625.length > 0) {
              let v626 = v625[0];
              const v627 = {
                x: v626.x,
                y: v626.y
              };
              vV617 = v627;
              v626.seek = 2;
              v623.push({
                x: v286.x2 - v592.scale / 2 + v592.scale / v592.gridSize * vV617.x,
                y: v286.y2 - v592.scale / 2 + v592.scale / v592.gridSize * vV617.y
              });
              if (v626.start) {
                break;
              }
            } else {
              break;
            }
          } else {
            let v628 = v618.filter(p584 => p584.seek == 0).toSorted((p585, p586) => {
              return p585.score - p586.score;
            });
            if (v628.length > 0) {
              let v629 = v628[0];
              const v630 = {
                x: v629.x,
                y: v629.y
              };
              vV617 = v630;
              v629.seek = 1;
              v619 = this.getPaths(vV617);
              let v631 = v629.hop + 1;
              for (let v632 = 0; v632 < v619.length; v632++) {
                let v633 = v619[v632];
                if (v633.x < 0 || v633.y < 0 || v633.x > v592.gridSize - 1 || v633.y > v592.gridSize - 1) {
                  continue;
                }
                if (this.grid[v633.y][v633.x] == 1) {
                  continue;
                }
                if (v618.some(p587 => p587.x == v633.x && p587.y == v633.y)) {
                  continue;
                }
                v618.push({
                  x: v633.x,
                  y: v633.y,
                  score: this.getScore(v633, v616),
                  seek: 0,
                  hop: v631
                });
              }
            } else {
              break;
            }
          }
        }
        const v634 = {
          paths: v623,
          attempts: v624
        };
        return v634;
      }
    }
    ;
    function f57(p588, p589) {
      const v635 = 30;
      class C21 {
        constructor(p590, p591, p592) {
          this.x = p590;
          this.y = p591;
          this.g = p592;
          this.type = f58(p590, p591);
        }
      }
      const v636 = p588.x + (p589[0] - p588.x) / 2;
      const v637 = p588.y + (p589[1] - p588.y) / 2;
      const v638 = v282.filter(p593 => Math.hypot(p593.y - v637, p593.x - v636) < 500);
      function f58(p594, p595) {
        if (v638.some(p596 => {
          let v639 = p596.scale + p588.scale;
          const v640 = p596.dmg && !p596.isTeamObject(p588) ? v639 + 50 : v639;
          if (p596.ignoreCollision && (!p596.trap || p596.isTeamObject(p588))) {
            return false;
          }
          if (Math.hypot(p596.y - p595, p596.x - p594) < v640 + v635 && Math.hypot(p596.y - p589[1], p596.x - p589[0]) > v640 + v635 && Math.hypot(p596.y - p588.y2, p596.x - p588.x2) > v640 + v635) {
            return true;
          }
          return false;
        })) {
          return "wall";
        } else {
          return "space";
        }
      }
      const v641 = new C21(Math.round(p588.x2 / v635) * v635, Math.round(p588.y2 / v635) * v635, 0);
      const v642 = new C21(Math.round(p589[0] / v635) * v635, Math.round(p589[1] / v635) * v635, 0);
      const v643 = [];
      const v644 = [];
      let v645 = 0;
      const v646 = 100;
      let v647 = true;
      function f59(p597) {
        return Math.abs(p597);
      }
      while (!v644.find(p598 => Math.hypot(p598.y - v642.y, p598.x - v642.x) < v635)) {
        v645++;
        if (v645 >= v646) {
          v647 = false;
          break;
        }
        const v648 = v645 === 1 ? v641 : v644.filter(p599 => p599.type === "space").sort((p600, p601) => p600.good - p601.good)[0];
        if (!v648) {
          break;
        }
        for (let v649 = 0; v649 < 3; v649++) {
          for (let v650 = 0; v650 < 3; v650++) {
            if (v649 === 1 && v650 === 1) {
              continue;
            }
            const v651 = v648.x + v635 * (-1 + v649);
            const v652 = v648.y + v635 * (-1 + v650);
            const v653 = new C21(v651, v652, v645);
            if (v653.type === "wall") {
              continue;
            }
            v653.good = f59(v653.x - v642.x) + f59(v653.y - v642.y) / v635 - v645;
            if (!v644.some(p602 => p602.x === v653.x && p602.y === v653.y)) {
              v644.push(v653);
            }
          }
        }
        v643.push(v648);
      }
      if (v647) {
        return v643;
      } else {
        return false;
      }
    }
    class C22 {
      constructor() {
        if (v242 >= 69 || v293.anti0Tick > 0) {
          return;
        }
        this.wait = false;
        this.can = false;
        this.isTrue = false;
        this.nobull = false;
        this.ticking = false;
        this.canSpikeTick = false;
        this.startTick = false;
        this.readyTick = false;
        this.canCounter = false;
        this.revTick = false;
        this.syncHit = false;
        this.changeType = function (p603) {
          this.wait = false;
          this.isTrue = true;
          v293.autoAim = true;
          let v654 = [p603];
          let v655 = v291.backupNobull;
          v291.backupNobull = false;
          v246.tickBase(() => {
            v654.push(v286.skinIndex);
            v246.tickBase(() => {
              if (v291.skinIndex == 22 && f5("backupNobull").checked) {
                v291.backupNobull = true;
              }
              v654.push(v286.skinIndex);
            }, 1);
          }, 1);
          if (p603 == "rev") {
            f43(v286.weapons[1]);
            f41(53, 0);
            f41(21, 1);
            if (!v457) {
              f44();
            }
            v246.tickBase(() => {
              f43(v286.weapons[0]);
              if (v291.dist2 <= 120 && vF20.doSpikeOnReverse) {
                f46(2, v291.aim2);
              }
              f41(7, 0);
              f41(21, 1);
              v246.tickBase(() => {
                this.isTrue = false;
                v293.autoAim = false;
              }, 1);
            }, 1);
          } else if (p603 == "nobull") {
            f43(v286.weapons[0]);
            if (f5("backupNobull").checked && v655) {
              f41(7, 0);
            } else {
              f41(6, 0);
            }
            f41(21, 1);
            if (!v457) {
              f44();
            }
            v246.tickBase(() => {
              if (v291.skinIndex == 22) {
                if (f5("backupNobull").checked) {
                  v291.backupNobull = true;
                }
                f41(6, 0);
              } else {
                f41(53, 0);
              }
              f43(v286.weapons[1]);
              f41(21, 1);
              v246.tickBase(() => {
                this.isTrue = false;
                v293.autoAim = false;
              }, 1);
            }, 1);
          } else if (p603 == "normal") {
            f43(v286.weapons[0]);
            f41(7, 0);
            f41(21, 1);
            if (!v457) {
              f44();
            }
            v246.tickBase(() => {
              f43(v286.weapons[1]);
              f41(v286.reloads[53] == 0 ? 53 : 6, 0);
              f41(21, 1);
              v246.tickBase(() => {
                this.isTrue = false;
                v293.autoAim = false;
              }, 1);
            }, 1);
          } else {
            setTimeout(() => {
              this.isTrue = false;
              v293.autoAim = false;
            }, 50);
          }
        };
        this.spikeTickType = function (p604) {
          this.isTrue = true;
          v293.autoAim = true;
          f43(v286.weapons[0]);
          if (p604 == "rev" && v286.reloads[53] == 0) {
            f41(53, 0);
            v246.tickBase(() => {
              f41(7, 0);
              if (!v457) {
                f44();
              }
              v246.tickBase(() => {
                this.isTrue = false;
                v293.autoAim = false;
              }, 1);
            }, 1);
          } else {
            v246.tickBase(() => {
              f41(7, 0);
              if (!v457) {
                f44();
              }
              v246.tickBase(() => {
                if (v286.reloads[53] == 0 && f5("turretCombat").checked) {
                  f41(53, 0);
                  v246.tickBase(() => {
                    this.isTrue = false;
                    v293.autoAim = false;
                  }, 1);
                } else {
                  this.isTrue = false;
                  v293.autoAim = false;
                }
              }, 1);
            }, 1);
          }
        };
        this.counterType = function () {
          this.isTrue = true;
          v293.autoAim = true;
          f43(v286.weapons[0]);
          f41(7, 0);
          f41(21, 1);
          if (!v457) {
            f44();
          }
          v246.tickBase(() => {
            if (v286.reloads[53] == 0 && f5("turretCombat").checked) {
              f43(v286.weapons[0]);
              f41(53, 0);
              f41(21, 1);
              v246.tickBase(() => {
                this.isTrue = false;
                v293.autoAim = false;
              }, 1);
            } else {
              this.isTrue = false;
              v293.autoAim = false;
            }
          }, 1);
        };
        this.rangeType = function (p605) {
          this.isTrue = true;
          v293.autoAim = true;
          if (p605 == "ageInsta") {
            v293.ageInsta = false;
            if (v286.items[5] == 18) {
              v688.testCanPlace(5, 0, Math.PI * 2, Math.PI / 24, v291.aim2);
            }
            f23("f", undefined, 1);
            f41(53, 0);
            f41(21, 1);
            v246.tickBase(() => {
              f43(v286.weapons[1]);
              f41(53, 0);
              f41(21, 1);
              if (!v457) {
                f44();
              }
              v246.tickBase(() => {
                f38(12);
                f43(v286.weapons[1]);
                f41(53, 0);
                f41(21, 1);
                v246.tickBase(() => {
                  f38(15);
                  f43(v286.weapons[1]);
                  f41(53, 0);
                  f41(21, 1);
                  v246.tickBase(() => {
                    this.isTrue = false;
                    v293.autoAim = false;
                    this.readyTick = false;
                  }, 3);
                }, 1);
              }, 1);
            }, 2);
          } else {
            f43(v286.weapons[1]);
            if (v286.reloads[53] == 0 && v291.dist2 <= 700 && v291.skinIndex != 22) {
              f41(53, 0);
            } else {
              f41(20, 0);
            }
            f41(19, 1);
            if (!v457) {
              f44();
            }
            v246.tickBase(() => {
              this.isTrue = false;
              v293.autoAim = false;
            }, 1);
          }
        };
        this.musketSync = function () {
          if (v286.weapons[1] != 15) {
            return;
          }
          this.isTrue = true;
          if (v286.items[5] == 18) {
            v688.testCanPlace(5, 0, Math.PI * 2, Math.PI / 12, v291.aim2);
          }
          v293.autoAim = true;
          f41(53, 0);
          v246.tickBase(() => {
            f43(v286.weapons[1]);
            if (!v457) {
              f44();
            }
            v246.tickBase(() => {
              this.isTrue = false;
              v293.autoAim = false;
            }, 1);
          }, 1);
        };
        this.oneTickType = function () {
          this.isTrue = true;
          v293.autoAim = true;
          f23("f", v291.aim2, 1);
          v246.tickBase(() => {
            if (v286.weapons[1] == 15) {
              v293.revAim = true;
            }
            f43(v286.weapons[[9, 10, 12, 13, 15].includes(v286.weapons[1]) ? 1 : 0]);
            f41(53, 0);
            if ([9, 12, 13, 15].includes(v286.weapons[1])) {
              if (!v457) {
                f44();
              }
            }
            v246.tickBase(() => {
              v293.revAim = false;
              f43(v286.weapons[0]);
              f41(7, 0);
              if (!v457) {
                f44();
              }
              f23("f", v291.aim2, 1);
              v246.tickBase(() => {
                this.isTrue = false;
                v293.autoAim = false;
                f23("f", undefined, 1);
              }, 1);
            }, 1);
          }, 1);
        };
        this.threeOneTickType = function () {
          this.isTrue = true;
          v293.autoAim = true;
          f43(v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0]);
          f41(11, 1);
          f23("f", v291.aim2, 1);
          v246.tickBase(() => {
            f43(v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0]);
            f41(53, 0);
            f41(11, 1);
            f23("f", v291.aim2, 1);
            v246.tickBase(() => {
              f43(v286.weapons[0]);
              f41(7, 0);
              f41(19, 1);
              if (!v457) {
                f44();
              }
              f23("f", v291.aim2, 1);
              v246.tickBase(() => {
                this.isTrue = false;
                v293.autoAim = false;
                f23("f", undefined, 1);
              }, 1);
            }, 1);
          }, 1);
        };
        this.kmTickType = function () {
          this.isTrue = true;
          v293.autoAim = true;
          v293.revAim = true;
          f43(v286.weapons[1]);
          f41(53, 0);
          f41(11, 1);
          if (!v457) {
            f44();
          }
          f23("f", v291.aim2, 1);
          v246.tickBase(() => {
            v293.revAim = false;
            f43(v286.weapons[0]);
            f41(7, 0);
            f41(19, 1);
            f23("f", v291.aim2, 1);
            v246.tickBase(() => {
              this.isTrue = false;
              v293.autoAim = false;
              f23("f", undefined, 1);
            }, 1);
          }, 1);
        };
        this.boostTickType = function () {
          this.isTrue = true;
          v293.autoAim = true;
          f23("f", v291.aim2, 1);
          v246.tickBase(() => {
            if (v286.weapons[1] == 15) {
              v293.revAim = true;
            }
            f43(v286.weapons[[9, 12, 13, 15].includes(v286.weapons[1]) ? 1 : 0]);
            f41(53, 0);
            f41(11, 1);
            if ([9, 12, 13, 15].includes(v286.weapons[1])) {
              if (!v457) {
                f44();
              }
            }
            f23("f", v291.aim2, 1);
            f46(4, v291.aim2);
            v246.tickBase(() => {
              v293.revAim = false;
              f43(v286.weapons[0]);
              f41(7, 0);
              f41(19, 1);
              if (![9, 12, 13, 15].includes(v286.weapons[1])) {
                if (!v457) {
                  f44();
                }
              }
              f23("f", v291.aim2, 1);
              v246.tickBase(() => {
                this.isTrue = false;
                v293.autoAim = false;
                f23("f", undefined, 1);
              }, 1);
            }, 1);
          }, 1);
        };
        this.gotoGoal = function (p606, p607) {
          let vF9 = p608 => p608 * vP11.playerScale;
          let v656 = {
            a: p606 - p607,
            b: p606 + p607,
            c: p606 - vF9(1),
            d: p606 + vF9(1),
            e: p606 - vF9(2),
            f: p606 + vF9(2),
            g: p606 - vF9(4),
            h: p606 + vF9(4)
          };
          let vF10 = function (p609, p610) {
            if (v286.inWater && p610 == 0) {
              f41(31, 0);
            } else {
              f41(p609, p610);
            }
          };
          if (v289.length) {
            let v657 = v291.dist2;
            this.ticking = true;
            if (v657 >= v656.a && v657 <= v656.b) {
              vF10(22, 0);
              vF10(19, 1);
              if (v286.weaponIndex != v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0] || v286.buildIndex > -1) {
                f43(v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0]);
              }
              const v658 = {
                dir: undefined,
                action: 1
              };
              return v658;
            } else {
              if (v657 < v656.a) {
                if (v657 >= v656.g) {
                  if (v657 >= v656.e) {
                    if (v657 >= v656.c) {
                      vF10(40, 0);
                      vF10(0, 1);
                      if (vF20.slowOT) {
                        if (v286.buildIndex != v286.items[1]) {
                          f42(v286.items[1]);
                        }
                      } else if (v286.weaponIndex != v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0] || v286.buildIndex > -1) {
                        f43(v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0]);
                      }
                    } else {
                      vF10(22, 0);
                      vF10(0, 1);
                      if (v286.weaponIndex != v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0] || v286.buildIndex > -1) {
                        f43(v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0]);
                      }
                    }
                  } else {
                    vF10(6, 0);
                    vF10(0, 1);
                    if (v286.weaponIndex != v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0] || v286.buildIndex > -1) {
                      f43(v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0]);
                    }
                  }
                } else {
                  f55(1);
                  vF10(11, 1);
                  if (v286.weaponIndex != v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0] || v286.buildIndex > -1) {
                    f43(v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0]);
                  }
                }
                return {
                  dir: v291.aim2 + Math.PI,
                  action: 0
                };
              } else if (v657 > v656.b) {
                if (v657 <= v656.h) {
                  if (v657 <= v656.f) {
                    if (v657 <= v656.d) {
                      vF10(40, 0);
                      vF10(0, 1);
                      if (vF20.slowOT) {
                        if (v286.buildIndex != v286.items[1]) {
                          f42(v286.items[1]);
                        }
                      } else if (v286.weaponIndex != v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0] || v286.buildIndex > -1) {
                        f43(v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0]);
                      }
                    } else {
                      vF10(22, 0);
                      vF10(0, 1);
                      if (v286.weaponIndex != v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0] || v286.buildIndex > -1) {
                        f43(v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0]);
                      }
                    }
                  } else {
                    vF10(6, 0);
                    vF10(0, 1);
                    if (v286.weaponIndex != v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0] || v286.buildIndex > -1) {
                      f43(v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0]);
                    }
                  }
                } else {
                  f55(1);
                  vF10(11, 1);
                  if (v286.weaponIndex != v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0] || v286.buildIndex > -1) {
                    f43(v286.weapons[[10, 14].includes(v286.weapons[1]) ? 1 : 0]);
                  }
                }
                const v659 = {
                  dir: v291.aim2,
                  action: 0
                };
                return v659;
              }
              const v660 = {
                dir: undefined,
                action: 0
              };
              return v660;
            }
          } else {
            this.ticking = false;
            const v661 = {
              dir: undefined,
              action: 0
            };
            return v661;
          }
        };
        this.bowMovement = function () {
          let v662 = this.gotoGoal(682, 4);
          if (v662.action) {
            if (v286.reloads[53] == 0 && !this.isTrue) {
              this.rangeType("ageInsta");
            } else {
              f23("f", v662.dir, 1);
            }
          } else {
            f23("f", v662.dir, 1);
          }
        };
        this.tickMovement = function () {
          let v663 = this.gotoGoal([10, 14].includes(v286.weapons[1]) && v286.y2 > vP11.snowBiomeTop ? 243 : v286.weapons[1] == 15 ? 270 : v286.y2 <= vP11.snowBiomeTop ? [10, 14].includes(v286.weapons[1]) ? 233 : 231 : 240, 3);
          if (v663.action) {
            if (v291.skinIndex != 22 && v286.reloads[53] == 0 && !this.isTrue) {
              this.oneTickType();
            } else {
              f23("f", v663.dir, 1);
            }
          } else {
            f23("f", v663.dir, 1);
          }
        };
        this.kmTickMovement = function () {
          let v664 = this.gotoGoal(240, 3);
          if (v664.action) {
            if (v291.skinIndex != 22 && v286.reloads[53] == 0 && !this.isTrue && (v246.tick - v291.poisonTick) % vP11.serverUpdateRate == 8) {
              this.kmTickType();
            } else {
              f23("f", v664.dir, 1);
            }
          } else {
            f23("f", v664.dir, 1);
          }
        };
        this.boostTickMovement = function () {
          let v665 = v286.weapons[1] == 9 ? 365 : v286.weapons[1] == 12 ? 380 : v286.weapons[1] == 13 ? 390 : v286.weapons[1] == 15 ? 365 : 370;
          let v666 = v286.weapons[1] == 9 ? 2 : v286.weapons[1] == 12 ? 1.5 : v286.weapons[1] == 13 ? 1.5 : v286.weapons[1] == 15 ? 2 : 3;
          let v667 = this.gotoGoal(v665, v666);
          if (v667.action) {
            if (v286.reloads[53] == 0 && !this.isTrue) {
              this.boostTickType();
            } else {
              f23("f", v667.dir, 1);
            }
          } else {
            f23("f", v667.dir, 1);
          }
        };
        this.perfCheck = function (p611, p612) {
          if (p612.weaponIndex == 11 && v679.getAngleDist(p612.aim2 + Math.PI, p612.d2) <= vP11.shieldAngle) {
            return false;
          }
          if (![9, 12, 13, 15].includes(v286.weapons[1])) {
            return true;
          }
          let v668 = {
            x: p612.x2 + Math.cos(p612.aim2 + Math.PI) * 70,
            y: p612.y2 + Math.sin(p612.aim2 + Math.PI) * 70
          };
          if (v679.lineInRect(p611.x2 - p611.scale, p611.y2 - p611.scale, p611.x2 + p611.scale, p611.y2 + p611.scale, v668.x, v668.y, v668.x, v668.y)) {
            return true;
          }
          let v669 = v277.filter(p613 => p613.visible).find(p614 => {
            if (v679.lineInRect(p614.x2 - p614.scale, p614.y2 - p614.scale, p614.x2 + p614.scale, p614.y2 + p614.scale, v668.x, v668.y, v668.x, v668.y)) {
              return true;
            }
          });
          if (v669) {
            return false;
          }
          v669 = v282.filter(p615 => p615.active).find(p616 => {
            let v670 = p616.getScale();
            if (!p616.ignoreCollision && v679.lineInRect(p616.x - v670, p616.y - v670, p616.x + v670, p616.y + v670, v668.x, v668.y, v668.x, v668.y)) {
              return true;
            }
          });
          if (v669) {
            return false;
          }
          return true;
        };
      }
    }
    ;
    class C23 {
      constructor(p617) {
        this.items = p617;
      }
      buyNext() {
        for (const [v671, v672] of this.items) {
          const v673 = v672 === 0 ? f26(v683, v671) : f26(v684, v671);
          const v674 = v672 === 0 ? v286.skins[v671] : v286.tails[v671];
          if (!v673 || v674) {
            continue;
          }
          if (v286.points >= v673.price) {
            f23("c", 1, v671, v672);
            return;
          }
          return;
        }
      }
    }
    class C24 {
      constructor() {
        this.sb = function (p618) {
          p618(3);
          p618(17);
          p618(31);
          p618(23);
          p618(9);
          p618(38);
        };
        this.kh = function (p619) {
          p619(3);
          p619(17);
          p619(31);
          p619(23);
          p619(10);
          p619(38);
          p619(4);
          p619(25);
        };
        this.pb = function (p620) {
          p620(5);
          p620(17);
          p620(32);
          p620(23);
          p620(9);
          p620(38);
        };
        this.ph = function (p621) {
          p621(5);
          p621(17);
          p621(32);
          p621(23);
          p621(10);
          p621(38);
          p621(28);
          p621(25);
        };
        this.db = function (p622) {
          p622(7);
          p622(17);
          p622(31);
          p622(23);
          p622(9);
          p622(34);
        };
        this.km = function (p623) {
          p623(7);
          p623(17);
          p623(31);
          p623(23);
          p623(10);
          p623(38);
          p623(4);
          p623(15);
        };
      }
    }
    ;
    class C25 {
      constructor(p624) {
        this.calcDmg = function (p625, p626) {
          return p625 * p626;
        };
        this.getAllDamage = function (p627) {
          return [this.calcDmg(p627, 0.75), p627, this.calcDmg(p627, 1.125), this.calcDmg(p627, 1.5)];
        };
        this.weapons = [];
        for (let v675 = 0; v675 < p624.weapons.length; v675++) {
          let v676 = p624.weapons[v675];
          let v677 = v676.name.split(" ").length <= 1 ? v676.name : v676.name.split(" ")[0] + "_" + v676.name.split(" ")[1];
          this.weapons.push(this.getAllDamage(v675 > 8 ? v676.Pdmg : v676.dmg));
          this[v677] = this.weapons[v675];
        }
      }
    }
    let v678 = [];
    let v679 = new C3();
    let v680 = new C7();
    let v681 = new C8(C6, v282, v679, vP11);
    let v682 = new C10();
    let v683 = v682.hats;
    let v684 = v682.accessories;
    let v685 = new C11(C9, v283, v278, v277, v681, v680, vP11, v679);
    let v686 = new C12(v277, C13, v278, v680, null, vP11, v679);
    let v687 = new C5();
    let v688 = new C19(v679, v680);
    let v689 = new C22();
    let v690 = new C23([[11, 1], [40, 0], [31, 0], [6, 0], [7, 0], [15, 0], [19, 1], [22, 0], [53, 0], [12, 0], [20, 0], [10, 0], [56, 0], [21, 1], [11, 1], [26, 0], [18, 1], [13, 1]]);
    let v691 = new C24();
    let v692 = new C20();
    let v693;
    let v694;
    let v695 = {};
    let v696 = [];
    let v697;
    let v698 = [];
    let v699 = [];
    function f60(p628) {
      f23("6", p628.slice(0, 30));
    }
    let v700 = [];
    function f61(p629, p630, p631, p632, p633, p634, p635, p636) {
      let v701 = p634 == 0 ? 9 : p634 == 2 ? 12 : p634 == 3 ? 13 : p634 == 5 && 15;
      let v702 = vP11.playerScale * 2;
      let v703 = {
        x: p634 == 1 ? p629 : p629 - v702 * Math.cos(p631),
        y: p634 == 1 ? p630 : p630 - v702 * Math.sin(p631)
      };
      let v704 = v278.filter(p637 => p637.visible && v679.getDist(v703, p637, 0, 2) <= p637.scale).sort(function (p638, p639) {
        return v679.getDist(v703, p638, 0, 2) - v679.getDist(v703, p639, 0, 2);
      })[0];
      if (v704) {
        if (p634 == 1) {
          v704.shooting[53] = 1;
        } else {
          v704.shootIndex = v701;
          v704.shooting[1] = 1;
          f62(v704, p631, p632, p633, p634, v701);
        }
      }
    }
    let v705 = 0;
    let v706 = {
      count: 0,
      dmg: 0
    };
    function f62(p640, p641, p642, p643, p644, p645) {
      if (!p640.isTeam(v286)) {
        v304 = v679.getDirect(v286, p640, 2, 2);
        if (v679.getAngleDist(v304, p641) <= 0.2) {
          p640.bowThreat[p645]++;
          if (p644 == 5) {
            v705++;
          }
          if (p640.dist2 > 234) {
            v706.count++;
            v706.dmg += v680.projectiles[p644].dmg;
          }
          setTimeout(() => {
            p640.bowThreat[p645]--;
            v705--;
            if (v706.count > 0) {
              v706.count--;
              v706.dmg -= v680.projectiles[p644].dmg;
            }
          }, p642 / p643);
          if (p640.bowThreat[9] >= 1 && (p640.bowThreat[12] >= 1 || p640.bowThreat[15] >= 1)) {
            f46(3, p640.aim2);
            f46(1, p640.aim2);
            v293.anti0Tick = 4;
            v286.chat.message = "anti bow insta by " + p640.sid + " " + p640.name;
            v286.chat.count = 445;
            f53(1);
          } else if (v705 >= 2 || v706.count >= 4) {
            f46(3, p640.aim2);
            f46(1, p640.aim2);
            v293.anti0Tick = 4;
            v286.chat.message = "anti proj sync";
            v286.chat.count = 445;
            f53(2);
          }
        }
      }
    }
    function f63(p646, p647, p648) {
      if (v286 && p646) {
        v679.removeAllChildren(v53);
        v53.classList.add("visible");
        v679.generateElement({
          id: "itemInfoName",
          text: v679.capitalizeFirst(p646.name),
          parent: v53
        });
        const v707 = {
          id: "itemInfoDesc",
          text: p646.desc,
          parent: v53
        };
        v679.generateElement(v707);
        if (p648) {} else if (p647) {
          const v708 = {
            class: "itemInfoReq",
            text: !p646.type ? "primary" : "secondary",
            parent: v53
          };
          v679.generateElement(v708);
        } else {
          for (let v709 = 0; v709 < p646.req.length; v709 += 2) {
            v679.generateElement({
              class: "itemInfoReq",
              html: p646.req[v709] + "<span class='itemInfoReqVal'> x" + p646.req[v709 + 1] + "</span>",
              parent: v53
            });
          }
          if (p646.group.limit) {
            v679.generateElement({
              class: "itemInfoLmt",
              text: (v286.itemCounts[p646.group.id] || 0) + "/" + (vP11.isSandbox ? 99 : p646.group.limit),
              parent: v53
            });
          }
        }
      } else {
        v53.classList.remove("visible");
      }
    }
    window.addEventListener("resize", v679.checkTrusted(f64));
    function f64() {
      v294 = window.innerWidth;
      v295 = window.innerHeight;
      let v710 = Math.max(v294 / v296, v295 / v297) * v298;
      v13.width = v294 * v298;
      v13.height = v295 * v298;
      v13.style.width = v294 + "px";
      v13.style.height = v295 + "px";
      v62.setTransform(v710, 0, 0, v710, (v294 * v298 - v296 * v710) / 2, (v295 * v298 - v297 * v710) / 2);
    }
    f64();
    v13 = document.getElementById("touch-controls-fullscreen");
    v13.addEventListener("mousemove", f65, false);
    function f65(p649) {
      v305 = p649.clientX;
      v306 = p649.clientY;
    }
    let v711 = {
      left: false,
      middle: false,
      right: false
    };
    v13.addEventListener("mousedown", f66, false);
    function f66(p650) {
      if (v316 != 1) {
        v316 = 1;
        if (p650.button == 0) {
          v711.left = true;
        } else if (p650.button == 1) {
          v711.middle = true;
        } else if (p650.button == 2) {
          v711.right = true;
        }
      }
    }
    window.addEventListener("mouseup", v679.checkTrusted(f67));
    function f67(p651) {
      if (v316 != 0) {
        v316 = 0;
        if (p651.button == 0) {
          v711.left = false;
        } else if (p651.button == 1) {
          v711.middle = false;
        } else if (p651.button == 2) {
          v711.right = false;
        }
      }
    }
    v13.addEventListener("wheel", f68, false);
    function f68(p652) {
      if (p652.deltaY < 0) {
        v293.reSync = true;
      } else {
        v293.reSync = false;
      }
    }
    function f69() {
      let v712 = 0;
      let v713 = 0;
      for (let v714 in vV315) {
        let v715 = vV315[v714];
        v712 += !!v314[v714] * v715[0];
        v713 += !!v314[v714] * v715[1];
      }
      if (v712 == 0 && v713 == 0) {
        return undefined;
      } else {
        return Math.atan2(v713, v712);
      }
    }
    function f70() {
      return !v241 && v291.dist2 <= v680.weapons[v286.weapons[0]].range + v286.scale * 1.8 && !v688.inTrap;
      f41(21, 1);
    }
    function f71() {
      let v716 = v305 + v302 - v286.x;
      let v717 = v306 + v303 - v286.y;
      if (!v286) {
        return 0;
      }
      if (!v286.lockDir) {
        return Math.atan2(v717 - v295 / 2, v716 - v294 / 2);
      }
      return v320 || 0;
    }
    function f72(p653, p654, p655, p656) {
      const v718 = v286.scale * 1.5;
      const v719 = Math.PI / 2.6 / 2;
      const v720 = Math.PI / 8;
      for (let v721 = -Math.PI; v721 < Math.PI; v721 += v720) {
        const v722 = p653.x + p654 * Math.cos(v721);
        const v723 = p653.y + p654 * Math.sin(v721);
        const v724 = Math.atan2(v723 - v286.y2, v722 - v286.x2);
        const v725 = Math.hypot(v723 - v286.y2, v722 - v286.x2);
        let vF11 = p657 => (p657 + Math.PI * 2) % (Math.PI * 2) - Math.PI;
        let vVF11 = vF11(v724);
        let vVF112 = vF11(p655 - v719);
        let vVF113 = vF11(p655 + v719);
        if (v725 >= v718 && v725 <= p656) {
          if (vVF112 <= vVF113) {
            if (vVF11 >= vVF112 && vVF11 <= vVF113) {
              return true;
            }
          } else if (vVF11 >= vVF112 || vVF11 <= vVF113) {
            return true;
          }
        }
      }
      return false;
    }
    function f73(p658, p659, p660, p661, p662) {
      const v726 = Math.atan2(p658.y - v286.y2, p658.x - v286.x2);
      const v727 = Math.atan2(p660.y - v286.y2, p660.x - v286.x2);
      let v728 = (v726 + v727) / 2;
      if (Math.abs(v726 - v727) > Math.PI) {
        v728 += Math.PI;
        v728 = (v728 + Math.PI) % (Math.PI * 2) - Math.PI;
      }
      let vF72 = f72(p658, p659, v728, p662);
      let vF722 = f72(p660, p661, v728, p662);
      return [vF72 && vF722, v726, v727, v728];
    }
    function f74(p663) {
      if (p663) {
        if (!v286) {
          return "0";
        }
        if (v293.autoAim || f70() && v711.left && v286.reloads[v286.weapons[0]] == 0) {
          v320 = f5("weaponGrind").checked ? "getSafeDir()" : v289.length ? v293.revAim ? "(near.aim2 + Math.PI)" : "near.aim2" : "getSafeDir()";
        } else if (v711.right && v286.reloads[v286.weapons[1] == 10 ? v286.weapons[1] : v286.weapons[0]] == 0) {
          v320 = "getSafeDir()";
        } else if (v688.inTrap && v286.reloads[v688.notFast(v688.info[0]) ? v286.weapons[1] : v286.weapons[0]] == 0) {
          v320 = "traps.aim";
        } else if (!v286.lockDir) {
          if (vF20.noDir) {
            return "undefined";
          }
          v320 = "getSafeDir()";
        }
        return v320;
      } else {
        if (!v286) {
          return 0;
        }
        if (v293.autoAim || f70() && v711.left) {
          v320 = f5("weaponGrind").checked ? f71() : v289.length ? v293.revAim ? v291.aim2 + Math.PI : v291.aim2 : f71();
        } else if (v711.right) {
          v320 = f71();
        } else if (v688.inTrap) {
          let v729 = v688.hasSpike && v681.hitsToBreak(v688.info[1], v286) <= v681.hitsToBreak(v688.info[0], v286) ? v688.info[1] : v688.info[0];
          let v730 = v688.notFast(v729) ? v286.weapons[1] : v286.weapons[0];
          let v731 = v680.weapons[v730].range + v286.scale + (v688.hasSpike ? v688.info[1].scale / 3.25 : 0);
          let v732 = 0;
          if (v688.hasSpike) {
            if (v681.canHit(v286, v688.info[1], v730)) {
              let vF73 = f73(v688.info[0], 50, v688.info[1], 50, v731);
              if (vF73[0]) {
                v732 = vF73[3];
              } else if (v729.sid == v688.info[1].sid) {
                v732 = vF73[2];
              } else {
                v732 = v688.aim;
              }
            } else {
              v732 = v688.aim;
            }
          } else {
            v732 = v688.aim;
          }
          v320 = v732;
        } else if (v274.active) {
          v320 = v274.aim;
        } else if (!v286.lockDir) {
          if (vF20.noDir) {
            return undefined;
          }
          v320 = f71();
        }
        return v320 || 0;
      }
    }
    function f75() {
      if (!v286) {
        return 0;
      }
      if (v293.autoAim || (v711.left || v241 && v291.dist2 <= v680.weapons[v286.weapons[0]].range + v291.scale * 1.8 && !v688.inTrap) && v286.reloads[v286.weapons[0]] == 0) {
        v320 = f5("weaponGrind").checked ? f71() : v289.length ? v293.revAim ? v291.aim2 + Math.PI : v291.aim2 : f71();
      } else if (v711.right && v286.reloads[v286.weapons[1] == 10 ? v286.weapons[1] : v286.weapons[0]] == 0) {
        v320 = f71();
      } else if (v688.inTrap && v286.reloads[v688.notFast(v688.info[0]) ? v286.weapons[1] : v286.weapons[0]] == 0) {
        v320 = v688.aim;
      } else if (!v286.lockDir) {
        v320 = f71();
      }
      return v320 || 0;
    }
    function f76() {
      return v23.style.display != "block" && v58.style.display != "block" && !v231;
    }
    function f77() {
      if (v230.style.display != "none") {
        v58.style.display = "none";
        if (vF52.value != "") {
          let vF12 = function (p664) {
            return {
              found: p664.startsWith("/") && vF19[p664.slice(1).split(" ")[0]],
              fv: vF19[p664.slice(1).split(" ")[0]]
            };
          };
          let vVF12 = vF12(vF52.value);
          if (vVF12.found) {
            if (typeof vVF12.fv.action === "function") {
              vVF12.fv.action(vF52.value);
            }
          } else {
            f60(vF52.value);
          }
          vF52.value = "";
          vF52.blur();
        } else if (v231) {
          vF52.blur();
        } else {
          vF52.focus();
        }
      }
    }
    function f78(p665) {
      let v733 = p665.which || p665.keyCode || 0;
      if (v286 && v286.alive && f76()) {
        if (!v314[v733]) {
          v314[v733] = 1;
          v318[p665.key] = 1;
          if (v733 == 27) {
            v240 = !v240;
            $("#menuDiv").toggle();
            $("#menuChatDiv").toggle();
          } else if (v733 == 69) {
            f44(1);
          } else if (v733 == 67) {
            f177();
          } else if (v286.weapons[v733 - 49] != undefined) {
            v286.weaponCode = v286.weapons[v733 - 49];
          } else if (p665.key == "m") {
            v319.placeSpawnPads = !v319.placeSpawnPads;
          } else if (p665.key == "z") {
            v319.place = !v319.place;
          } else if (p665.key == "Z") {
            if (typeof window.debug == "function") {
              window.debug();
            }
          } else if (v733 == 32) {
            f23("F", 1, f71(), 1);
            f23("F", 0, f71(), 1);
          } else if (p665.key == ",") {
            v286.sync = true;
            f60(f5("syncChat").value);
          } else if (v733 == 16) {
            v272 = true;
            setTimeout(() => {
              v272 = false;
            }, 10000);
          }
        }
      }
    }
    addEventListener("keydown", v679.checkTrusted(f78));
    function f79(p666) {
      if (v286 && v286.alive) {
        let v734 = p666.which || p666.keyCode || 0;
        if (v734 == 13) {
          f77();
        } else if (f76()) {
          if (v314[v734]) {
            v314[v734] = 0;
            v318[p666.key] = 0;
            if (p666.key == ",") {
              v286.sync = false;
            } else if (p666.key == "C") {
              f93();
            }
          }
        }
      }
    }
    window.addEventListener("keyup", v679.checkTrusted(f79));
    function f80() {
      if (v689.ticking) {
        return;
      }
      let v735;
      if (f5("followPlayer").checked) {
        let vParseInt = parseInt(f5("targetSid").value);
        let vF29 = f29(vParseInt);
        if (vF29) {
          if (vF29.dist2 >= f5("serverSync").checked ? 10 : 140) {
            v735 = vF29.aim2;
          } else {
            v735 = undefined;
          }
        }
      } else {
        v735 = f69();
      }
      if (v735 == undefined || v286.moveDir == null || Math.abs(v735 - v286.moveDir) > 0.123) {
        if (!v293.autoPush && !v318.l) {
          f23("f", v735, 1);
        }
      }
    }
    function f81() {}
    f81();
    function f82() {}
    let v736 = [];
    let v737 = [];
    var v738;
    const vF13 = () => {
      let vV680 = v680;
      let vV286 = v286;
      let v739 = [];
      let v740 = document.getElementsByClassName("actionBarItem");
      for (let v741 of v740) {
        if (v741.style.display === "inline-block") {
          const vNumber = Number(v741.id.split("Item")[1]);
          v739.push(vNumber);
        }
      }
      v738 = v739.length;
      for (let v742 = 0; v742 < v739.length; v742++) {
        let v743 = v739[v742];
        let v744 = document.getElementById("actionBarItem" + v743);
        let v745;
        let v746;
        if (v743 >= 19) {
          let v747 = vV680.list[v743 - 16];
          v745 = window.location.href.includes("sandbox") ? 299 : v747.group.limit;
          v746 = Math.min(v745, vV286.itemCounts[v743 - 18] || 0);
        } else if (v743 <= 15) {
          let v748 = vV286.reloads[v743] == 0 ? vV680.weapons[v743].speed : vV286.reloads[v743];
          v745 = vV680.weapons[v743].speed;
          v746 = v748;
        } else {
          v745 = 8;
          v746 = vV286.shameCount;
        }
        if (v746 > 0 || v743 <= 18) {
          let v749 = v737[v743];
          if (!v749) {
            v749 = v737[v743] = document.createElement("canvas");
            v749.id = "itemCount" + v743;
            v749.classList.add("animated-progress");
            v749.style.height = "66px";
            v744.appendChild(v749);
            v749.getContext("2d").translate(68, 66);
          }
          f83(v749.getContext("2d"), v745, v746, v743 <= 15, v743);
        }
      }
    };
    function f83(p667, p668, p669, p670, p671) {
      let vV6802 = v680;
      let vV2862 = v286;
      p667.clearRect(-100, -100, 1000, 1000);
      if (p670) {
        let v750 = {
          primary: vV2862.primaryIndex === undefined ? 1 : (vV6802.weapons[vV2862.primaryIndex].speed - vV2862.reloads[vV2862.primaryIndex]) / vV6802.weapons[vV2862.primaryIndex].speed,
          secondary: vV2862.secondaryIndex === undefined ? 1 : (vV6802.weapons[vV2862.secondaryIndex].speed - vV2862.reloads[vV2862.secondaryIndex]) / vV6802.weapons[vV2862.secondaryIndex].speed
        };
        if (!vV2862.currentReloads) {
          const v751 = {
            primary: v750.primary,
            secondary: v750.secondary
          };
          vV2862.currentReloads = v751;
        }
        const v752 = 0.1;
        vV2862.currentReloads.primary = (1 - v752) * vV2862.currentReloads.primary + v752 * v750.primary;
        vV2862.currentReloads.secondary = (1 - v752) * vV2862.currentReloads.secondary + v752 * v750.secondary;
        let vP671 = p671;
        let v753 = vP671 == vV2862.primaryIndex;
        if (vV2862.reloads[vP671] != 0) {
          p667.beginPath();
          p667.lineWidth = 10;
          p667.strokeStyle = "#FFFFFF";
          p667.arc(10, 10, 60, 0, Math.PI * 2 * (v753 ? vV2862.currentReloads.primary : vV2862.currentReloads.secondary) * -1);
          p667.stroke();
        }
      } else {
        p667.beginPath();
        p667.lineWidth = 10;
        p667.strokeStyle = "#FFFFFF";
        p667.arc(0, 0, 60, 0, Math.PI * 2 * (p669 / p668));
        p667.stroke();
      }
    }
    function f84(p672 = undefined) {
      for (let v754 = 3; v754 < v680.list.length; ++v754) {
        let v755 = v680.list[v754].group.id;
        let v756 = v680.weapons.length + v754;
        if (!v736[v756]) {
          v736[v756] = document.createElement("div");
          v736[v756].id = "itemCount" + v756;
          f5("actionBarItem" + v756).appendChild(v736[v756]);
          v736[v756].style = "\n                        display: block;\n                        position: absolute;\n                        padding-left: 27px;\n                        font-size: 1em;\n                        color: #fff;\n                        ";
          v736[v756].innerHTML = v286.itemCounts[v755] || 0;
        } else if (p672 == v755) {
          v736[v756].innerHTML = v286.itemCounts[p672] || 0;
        }
      }
    }
    function f85() {
      const v757 = v286.scale;
      const v758 = v757 + Math.max(v757 / 1.6, v679.getDist(v286, v286, 2, 3) / 1.6);
      const v759 = v282.filter(p673 => p673.dmg && p673.active && v679.getDist(p673, v286, 0, 2) <= 200 && !p673.isTeamObject(v286)).sort((p674, p675) => v679.getDist(p674, v286, 0, 2) - v679.getDist(p675, v286, 0, 2))[0];
      const v760 = v688.checkSpikeTick();
      if (v760[0] > 0) {
        v293.predictSpikes += v760[0];
        if (!v760[1]) {
          v293.anti0Tick = 3;
          v286.chat.message = "PaS detected by " + v291.sid + " " + v291.name;
          v286.chat.count = 334;
        }
      }
      if (v289.length) {
        const v761 = v282.filter(p676 => p676.dmg && p676.active && !p676.isTeamObject(v286) && v679.getDist(p676, v286, 0, 3) <= p676.scale + v757).sort((p677, p678) => v679.getDist(p677, v286, 0, 2) - v679.getDist(p678, v286, 0, 2))[0];
        if (v761 && v291.reloads[v291.primaryIndex] == 0 && [3, 4, 5].includes(v291.primaryIndex) && v291.dist2 < 210) {
          v293.predictSpikes++;
          if (v688.inTrap) {
            if (v286.reloads[v286.weaponIndex] > v246.tickRate) {
              v293.anti0Tick = 2;
              v286.chat.message = "Anti SpikeTick by " + v291.sid + " (" + v291.name + ")";
              v286.chat.count = 223;
            }
          } else {
            v293.anti0Tick = 3;
            v286.chat.message = "Anti SpikeTick by " + v291.sid + " (" + v291.name + ")";
            v286.chat.count = 334;
          }
        }
      }
      if (!v688.inTrap && v759) {
        f86(v759);
        if (vF20.safeWalk) {
          f87(v759, v758);
        } else {
          v293.safeWalk = false;
        }
      } else {
        f88();
      }
      function f86(p679) {
        if (vF20.autoBreakSpike) {
          v274.info = p679;
          v274.aim = v679.getDirect(p679, v286, 0, 2);
          if (v681.canHit(v286, p679, v286.weapons[1] === 10 ? v286.weapons[1] : v286.weapons[0])) {
            v274.active = true;
          } else {
            v274.active = false;
          }
        } else {
          v274.active = false;
        }
      }
      function f87(p680, p681) {
        const v762 = v679.getDist(p680, v286, 0, 3);
        if (v762 <= p680.scale + p681) {
          v293.safeWalk = true;
          const v763 = v679.getDirect(p680, v286, 0, 3);
          f23("f", v763 + Math.PI, 1);
        } else {
          v293.safeWalk = false;
        }
      }
      function f88() {
        v274.active = false;
        v293.safeWalk = false;
      }
    }
    const vF14 = () => {
      if (v272 || !vF20.autoPush || !v289.length || v291.dist2 >= v592.scale || !v291.inTrap) {
        if (v293.autoPush) {
          v592.active = false;
          v293.autoPush = false;
          f23("f", v286.moveDir, 1);
        }
        return;
      }
      let v764 = {};
      let v765 = v282.filter(p682 => p682.active && p682.dmg && p682.isTeamObject(v286) && v679.getDist(p682, v291.inTrap, 0, 0) <= p682.scale * 0.8 + v291.inTrap.scale + v291.scale);
      let v766 = v765[0];
      if (v765.length == 1) {
        const v767 = {
          x: v766.x,
          y: v766.y,
          scale: v766.scale
        };
        v764 = v767;
      } else {
        let v768 = v765.sort((p683, p684) => p684.health - p683.health).sort((p685, p686) => v679.getDist(p685, v291, 0, 2) - v679.getDist(p686, v291, 0, 2));
        let v769 = v768[0];
        let v770 = v768.filter(p687 => p687.sid != v769.sid).sort((p688, p689) => v679.getDist(p688, v769, 0, 0) - v679.getDist(p689, v769, 0, 0))[0];
        if (v770) {
          let v771 = v679.findMiddlePoint(v769, v770);
          if (v679.getDist(v771, v769, 0, 0) <= 30 + v769.scale && v679.getDist(v771, v770, 0, 0) <= 30 + v770.scale) {
            const v772 = {
              x: v771.x,
              y: v771.y,
              scale: 20
            };
            v764 = v772;
          } else {
            const v773 = {
              x: v769.x,
              y: v769.y,
              scale: v769.scale
            };
            v764 = v773;
          }
        } else {
          const v774 = {
            x: v769.x,
            y: v769.y,
            scale: v769.scale
          };
          v764 = v774;
        }
      }
      if (!v764) {
        if (v293.autoPush) {
          v592.active = false;
          v293.autoPush = false;
          f23("f", v286.moveDir, 1);
        }
        return;
      }
      let v775 = v679.getDirect(v764, v291, 0, 2);
      let v776 = v679.getDirect(v764, v291.inTrap, 0, 0);
      const v777 = {
        x: v764.x,
        y: v764.y
      };
      v293.pushData = v777;
      let v778;
      let v779;
      let v780;
      let v781;
      let v782;
      let v783;
      let v784 = v679.getAngleDist(v776, v775);
      if (v784 > 0.25) {
        let v785 = v679.getDirect(v291.inTrap, v286, 0, 2);
        let v786 = v679.getDirect(v291.inTrap, v291, 0, 2);
        let v787 = v679.getDist(v291.inTrap, v291, 0, 2);
        v778 = v291.scale * 1.5;
        v779 = Math.max(v291.scale / 2, v291.scale + v778 - v787);
        v780 = v786;
        v781 = v679.getAngleDist(v785, v786) < 0.4;
        v782 = v778;
        v783 = 1;
      } else {
        let v788 = v679.getDirect(v764, v286, 0, 2);
        let v789 = v679.getDist(v764, v291, 0, 2);
        v778 = v291.scale * 1.5;
        v779 = Math.max(v291.scale / 2, v764.scale + v291.scale + v778 - v789);
        v780 = v775;
        v781 = v679.getAngleDist(v788, v775) < 0.5;
        v782 = null;
        v783 = 0;
      }
      if (v291.dist2 < v778 * 2 && v781) {
        v592.active = false;
        v592.paths = [];
        let v790 = v679.getDirect({
          x: v291.x2 - Math.cos(v780) * v779,
          y: v291.y2 - Math.sin(v780) * v779
        }, v286, 0, 2);
        f23("f", v790, 1);
        v293.autoPush = true;
      } else {
        let v791 = Math.cos(v780) * v779;
        let v792 = Math.sin(v780) * v779;
        let v793 = v692.calc({
          x: v291.x2 - v791,
          y: v291.y2 - v792
        }, false, "auto push");
        v592.paths = v793.paths;
        v592.attempts = v793.attempts;
        if (v592.paths.length > 0) {
          v592.active = true;
          let v794 = v679.getDirect(v592.paths[1], v286, 0, 2);
          f23("f", v794, 1);
          v293.autoPush = true;
        } else {
          v791 = Math.cos(v780) * v778;
          v792 = Math.sin(v780) * v778;
          v793 = v692.calc({
            x: v291.x2 - v791,
            y: v291.y2 - v792
          }, true, "auto push");
          v592.paths = v793.paths;
          v592.attempts = v793.attempts;
          if (v592.paths.length > 0) {
            v592.active = true;
            let v795 = v679.getDirect(v592.paths[1], v286, 0, 2);
            f23("f", v795, 1);
            v293.autoPush = true;
          } else if (v293.autoPush) {
            f23("f", v286.moveDir, 1);
            v592.active = false;
            v592.active = false;
            v293.autoPush = false;
          }
        }
      }
    };
    let v796 = null;
    const v797 = "wss://beryl-brief-farmhouse.glitch.me";
    let v798 = [];
    let v799 = [];
    function f89() {
      if (!v796 || v796.readyState !== WebSocket.OPEN) {
        v796 = new WebSocket(v797);
        v796.addEventListener("message", p690 => {
          const v800 = JSON.parse(p690.data);
          if (v800.action === "update") {
            let v801 = v800.data.filter(p691 => p691.sid !== v286.sid);
            if (!v801) {
              return;
            }
            v798 = v801.map(p692 => p692.sid);
            v799 = v801.filter(p693 => p693.sync).map(p694 => p694.sid);
          }
        });
        v796.addEventListener("close", () => {
          v796 = null;
        });
      }
    }
    function f90() {
      if (v796 && v796.readyState === WebSocket.OPEN) {
        const v802 = {
          action: "update",
          data: {
            sid: v286.sid,
            server: serverID,
            sync: f5("serverSync").checked
          }
        };
        v796.send(JSON.stringify(v802));
      } else {
        f89();
      }
    }
    setInterval(() => {
      if (v317) {
        f90();
      }
    }, 10000);
    function f91(p695) {
      let v803 = ~~(p695 % 3600 / 60);
      let v804 = ~~p695 % 60;
      if (v804 <= 9) {
        v804 = "0" + v804;
      }
      return v803 + ":" + v804;
    }
    let v805 = {
      "0:13": "Clean up gang with a hoover,",
      "0:15": "pull up and sweep the street",
      "0:17": "Told bae book Park Chinois,",
      "0:18": "the bricks came cheap",
      "0:19": "this week",
      "0:20": "Brought out the glee",
      "0:21": "this week,",
      "0:22": "so somethin might end up",
      "0:23": "on a tee this week",
      "0:24": "Done studio time done the re",
      "0:25": "this week,",
      "0:26": "big bustdown",
      "0:27": "that ain't no Jesus piece",
      "0:28": "No G17,G19 had the G17",
      "0:29": "then the G19",
      "0:30": "Had an old .44",
      "0:31": "but the pin was weak,",
      "0:32": "still gonna spin if need",
      "0:35": "Sayin no smoke backstage,",
      "0:36": "but bro still ask",
      "0:37": "can we bring it please,",
      "0:38": "or a ZK at least",
      "0:40": "You could see me",
      "0:41": "in tape with the Gs,",
      "0:42": "bro just got in a",
      "0:43": "striptape with the Gs",
      "0:44": "Get the drop it's go time,",
      "0:45": "bro came out with the key",
      "0:47": "Yo, 38 autos gang said",
      "0:48": "we need more sweets",
      "0:50": "Before Halloween,",
      "0:51": "we was out playin",
      "0:52": "trick or treat",
      "0:53": "An opp boy swam and drowned,",
      "0:55": "he didn't kick his feet",
      "0:57": "Heard that news",
      "0:58": "I was right by the runaway,",
      "0:59": "made me feel like bree",
      "1:00": "This C comes like",
      "1:01": "a pocket rocket,",
      "1:02": "now the gang",
      "1:03": "in central with C",
      "1:04": "Had my case papers printed,",
      "1:05": "now I got the monogram",
      "1:06": "print on me",
      "1:07": "Runnin throught bells,",
      "1:08": "throwback run with the 12",
      "1:10": "Whole 1 cover the scales,",
      "1:11": "bine at the barbeque,",
      "1:12": "better cover your girl",
      "1:14": "Hate when they're",
      "1:15": "runnin their mouth,",
      "1:16": "see them runnin for help",
      "1:17": "I'm in the Bando,",
      "1:18": "but let me see my man again,",
      "1:19": "and I'll double the L",
      "1:21": "We really leave Shit drownin,",
      "1:22": "you ain't brought 3",
      "1:23": "on an outin",
      "1:24": "Shootouts in",
      "1:25": "the oldest clothes,",
      "1:26": "you wouldn't believe",
      "1:27": "these outfits",
      "1:28": "Foot down no breaks,",
      "1:29": "tryna leave everythin taped",
      "1:30": "Asked bout the shotty,",
      "1:31": "told them I got it",
      "1:32": "from the farm,",
      "1:33": "now they think I got from H",
      "1:34": "Clean up gang with a hoover,",
      "1:36": "pull up and sweep the street",
      "1:38": "Told bae book Park Chinois,",
      "1:39": "the bricks came cheap",
      "1:40": "this week",
      "1:41": "Brought out the glee",
      "1:42": "this week,",
      "1:43": "so somethin might end up",
      "1:44": "on a tee this week",
      "1:45": "Done studio time done the re",
      "1:46": "this week,",
      "1:47": "big bustdown",
      "1:48": "that ain't no Jesus piece",
      "1:49": "No G17,G19 had the G17",
      "1:50": "then the G19",
      "1:51": "Had an old .44",
      "1:52": "but the pin was weak,",
      "1:53": "still gonna spin if need",
      "1:54": "Sayin no smoke backstage,",
      "1:55": "but bro still ask",
      "1:56": "can we bring it please,",
      "1:57": "or a ZK at least",
      "1:59": "This opps in this",
      "2:00": "spliff's sativa,",
      "2:01": "still put smoke in the whiz,",
      "2:02": "Khalifa",
      "2:03": "Bad B don't wanna",
      "2:04": "lock the smoke,",
      "2:05": "I just gotta love her",
      "2:06": "and leave her",
      "2:07": "Yo, had the Liz",
      "2:08": "come like Peter",
      "2:09": "and the bujj like Cleveland",
      "2:10": "This ice in my wrist says",
      "2:11": "whole lotta money,",
      "2:12": "swear it's comin like BIA",
      "2:14": "O14 me, Zee had the bruc",
      "2:15": "back in a bruck down Kia",
      "2:16": "Now you'll find me in Venice,",
      "2:17": "tryin some shellfish",
      "2:18": "oh mama mia",
      "2:19": "Old school I was",
      "2:20": "hoppin out first,",
      "2:21": "had bro sayin",
      "2:22": "stop bein selfish",
      "2:23": "Yo,",
      "2:24": "now I just leave that stage,",
      "2:25": "pullin strings like Elvis",
      "2:26": "Ding dong on an outin,",
      "2:27": "would've been a loss",
      "2:28": "if we found him",
      "2:29": "Can't record,",
      "2:30": "need more points on the board",
      "2:31": "Gang, tape it first,",
      "2:32": "then I'll give them an album",
      "2:33": "Spoke to the yard man,",
      "2:34": "wanna know the P for the .45,",
      "2:35": "like Alhan",
      "2:36": "Spoke to the runner,",
      "2:37": "said he's got more than a oner",
      "2:39": "and he's still counting",
      "2:40": "Go get that car,",
      "2:41": "congestion zone,",
      "2:42": "gotta step with ours",
      "2:43": "Pocket rocket,",
      "2:44": "had it in a pouch",
      "2:45": "next to the brush",
      "2:46": "and the metro card",
      "2:47": "Double R truck,",
      "2:48": "stars in the roof,",
      "2:49": "and we got a seperate star",
      "2:50": "Ain't done it in a Tesla yet,",
      "2:51": "if we do thats lead",
      "2:52": "in an electric car",
      "2:53": "Clean up gang with a hoover,",
      "2:55": "pull up and sweep the street",
      "2:57": "Told bae book Park Chinois,",
      "2:58": "the bricks came cheap",
      "2:59": "this week",
      "3:00": "Brought out the glee",
      "3:01": "this week,",
      "3:02": "so somethin might end up",
      "3:03": "on a tee this week",
      "3:04": "Done studio time done the re",
      "3:05": "this week,",
      "3:06": "big bustdown",
      "3:07": "that ain't no Jesus piece",
      "3:08": "No G17,G19 had the G17",
      "3:09": "then the G19",
      "3:10": "Had an old .44",
      "3:11": "but the pin was weak,",
      "3:12": "still gonna spin if need",
      "3:13": "Sayin no smoke backstage,",
      "3:14": "but bro still ask",
      "3:15": "can we bring it please,",
      "3:16": "or a ZK at least"
    };
    let v806 = {
      "0:16": "Ahhhhh",
      "0:19": "gas,",
      "0:20": "Gas,",
      "0:21": "gas",
      "0:23": "Ahhhhh",
      "0:28": "Do you like",
      "0:29": "My car?",
      "0:31": "my car",
      "0:32": "m y  c a r",
      "0:52": "Guess you're ready",
      "0:53": "Cause I'm waiting for you",
      "0:55": "It's gonna be so exciting!",
      "0:58": "Got this feeling",
      "1:00": "Really deep in my soul",
      "1:01": "Let's get out, I wanna go",
      "1:03": "Come along, get it on!",
      "1:05": "Gonna take my car",
      "1:07": "Gonna sit in",
      "1:08": "Gona drive along till I get you",
      "1:10": "Cause I'm crazy, hot and ready",
      "1:12": "But you'll like it!",
      "1:14": "I wanna race for you!",
      "1:15": "(Shall I go now?)",
      "1:17": "Gas Gas Gas!",
      "1:19": "I'm gonna step on the gas",
      "1:20": "Tonight I'll fly!",
      "1:22": "And be your lover",
      "1:23": "Yeah yeah yeah!",
      "1:25": "I'll be so quick as a flash",
      "1:27": "And I'll be your hero",
      "1:29": "Gas Gas Gas!",
      "1:31": "I'm gonna run as a flash",
      "1:32": "Tonight I'll fight!",
      "1:34": "To be the winner",
      "1:35": "Yeah yeah yeah!",
      "1:37": "I'm gonna step on the gas",
      "1:39": "And you'll see the big show!",
      "1:54": "Don't be lazy",
      "1:56": "Cause I'm burning for you",
      "1:57": "It's like a hot sensation!",
      "2:00": "Got this power",
      "2:02": "That is taking me out",
      "2:03": "Yes, I've got a crush on you",
      "2:05": "Ready, now",
      "2:06": "Ready, go!",
      "2:07": "Gonna take my car",
      "2:09": "Gonna sit in",
      "2:10": "Gona drive along til I get you",
      "2:13": "Cause I'm crazy, hot and ready",
      "2:14": "But you'll like it!",
      "2:16": "I wanna race for you!",
      "2:18": "Shall I go now?",
      "2:19": "Gas Gas Gas!",
      "2:21": "I'm gonna step on the gas",
      "2:23": "Tonight I'll fly!",
      "2:24": "And be your lover",
      "2:25": "Yeah yeah yeah!",
      "2:27": "I'll be so quick as a flash",
      "2:29": "And I'll be your hero",
      "2:31": "Gas Gas Gas!",
      "2:33": "I'm gonna run as a flash",
      "2:35": "Tonight I'll fight!",
      "2:37": "To be the winner",
      "2:38": "Yeah yeah yeah!",
      "2:40": "I'm gonna step on the gas",
      "2:41": "And you'll see the big show!",
      "3:09": "Guess you're ready",
      "3:10": "Cause I'm waiting for you",
      "3:12": "It's gonna be so exciting!",
      "3:15": "Got this feeling",
      "3:17": "Really deep in my soul",
      "3:18": "Let's get out, I wanna go",
      "3:20": "Come along, get it on",
      "3:22": "Gonna take my car",
      "3:23": "Do you like my car?",
      "3:28": "Cause I'm crazy, hot and ready",
      "3:30": "But you'll like it!",
      "3:31": "I wanna race for you!",
      "3:33": "Shall I go now?",
      "3:34": "Gas Gas Gas!",
      "3:37": "I'm gonna step on the gas",
      "3:39": "Tonight I'll fly!",
      "3:41": "And be your lover",
      "3:42": "Yeah yeah yeah!",
      "3:43": "I'll be so quick as a flash",
      "3:45": "And I'll be your hero",
      "3:48": "Gas Gas Gas!",
      "3:50": "I'm gonna run as a flash",
      "3:51": "Tonight I'll fight!",
      "3:53": "To be the winner",
      "3:54": "Yeah yeah yeah!",
      "3:56": "I'm gonna step on the gas",
      "3:58": "And you'll see the big show!",
      "4:01": "Gas Gas Gas!",
      "4:04": "Yeah yeah yeah!",
      "4:07": "Gas Gas Gas!",
      "4:10": "And you'll see the big show!",
      "4:27": "Ahhhhh"
    };
    let v807 = {
      "0:13": "Oh, oh",
      "0:14": "Yeah, yeah",
      "0:16": "Oh, oh",
      "0:17": "Yeah, yeah, oh",
      "0:19": "Oh, oh",
      "0:20": "Yeah, yeah",
      "0:22": "Oh, oh",
      "0:25": "I wear women's underwear",
      "0:27": "And then I go to strike a pose",
      "0:29": "In my full length mirror",
      "0:30": "I cross my legs",
      "0:31": "Just like a queer",
      "0:33": "But my libido is strong",
      "0:34": "When a lady is near, yeah",
      "0:36": "What defines",
      "0:37": "A straight man's straight?",
      "0:39": "Is it the boxer in the briefs",
      "0:41": "Or a 12 ounce steak? Nah",
      "0:43": "I tell you what a women",
      "0:44": "Loves most",
      "0:45": "It's a man who can slap",
      "0:47": "But can also stroke",
      "0:49": "Goin' in the wind is an eddy",
      "0:51": "Of the truth and it's naked",
      "0:52": "It's verbatim",
      "0:53": "And it's shakin'",
      "0:56": "No, no, no, no, no, no,",
      "0:58": "no, no, no, no, no,",
      "0:59": "no more gettin' elated",
      "1:00": "No more listless invitations",
      "1:05": "URGH",
      "1:06": "I live by a hospital",
      "1:09": "And every day",
      "1:10": "I go out walking past",
      "1:11": "It's sickly windows",
      "1:12": "I see people dying there",
      "1:15": "But my tender age",
      "1:16": "Makes it hard to care",
      "1:18": "The incinerator and",
      "1:19": "A big smoke stack",
      "1:21": "It's a phallic symbol and",
      "1:23": "It makes me laugh",
      "1:24": "All I need is a heart attack",
      "1:27": "C'mon, humble my bones",
      "1:28": "With a cardiac",
      "1:31": "Goin' in the wind is an eddy",
      "1:33": "Of the truth and it's naked",
      "1:35": "It's verbatim and it's shakin'",
      "1:38": "No, no, no, no, no, no,",
      "1:39": "no, no, no, no, no,",
      "1:42": "no more gettin' elated",
      "1:43": "No more listless invitations",
      "1:47": "For the love of Fuck",
      "1:49": "For the sake of Pete",
      "1:50": "Did you ever really think",
      "1:52": "You'd love a guy like me?",
      "1:53": "I am the rooster in the mornin",
      "1:55": "I'm the Cock of the day",
      "1:57": "I'm the boxer in the briefs",
      "1:58": "I'm a 12 ounce steak",
      "1:59": "Ayy-oh, Ayy-oh, Ayy-oh, Hey-oh",
      "2:05": "Yeah-bo, yeah-bo, yeah-bo,",
      "2:10": "yeah-bo, yeah-bo",
      "2:14": "It's verbatim",
      "2:15": "And yeah, and it's naked",
      "2:18": "And yeah, and it's shakin'",
      "2:21": "It shakes, shakes, shakes",
      "2:24": "Oh-oh, yeah-yeah,",
      "2:28": "oh-oh, yeah-yeah-oh",
      "2:30": "Oh-oh, yeah-yeah,",
      "2:33": "oh-oh, yeah-yeah-oh",
      "2:36": "Oh-oh, yeah-yeah,",
      "2:39": "oh-oh, yeah-yeah-oh",
      "2:42": "Oh-oh, yeah-yeah"
    };
    let v808 = {
      "0:03": "Baby, this is do or die",
      "0:06": "Feel it in my veins at night",
      "0:08": "Emotional suicide",
      "0:11": "You know it's an eye for eye",
      "0:13": "I didn't wanna walk,",
      "0:15": "didn't wanna walk the plank",
      "0:19": "No,",
      "0:20": "but then ready or not,",
      "0:21": "then ready or not it came",
      "0:23": "Like the thunder,",
      "0:24": "I was on my way to going under",
      "0:26": "(under)",
      "0:27": "Swimming in the pain,",
      "0:28": "yeah, I was covered",
      "0:30": "In a tidal wave,",
      "0:32": "in a tidal wave",
      "0:33": "But I'm a fighter",
      "0:34": "(hu)",
      "0:35": "Tryna take me down,",
      "0:36": "I'm going higher",
      "0:37": "(I'm higher)",
      "0:38": "Baby, you've been playing",
      "0:39": "with some fire",
      "0:40": "(you've playing)",
      "0:41": "You've been playing with fire",
      "0:42": "(playing with fire)",
      "0:43": "One day you will see",
      "0:46": "What you made of me",
      "0:48": "Found my inner beast",
      "0:49": "(inner beast)",
      "0:51": "You'll watch it release",
      "0:53": "In the dead of night",
      "1:05": "In the dead of night",
      "1:10": "In the dead of",
      "1:14": "  Night  ",
      "1:18": "Baby, when it's do or die",
      "1:19": "(when it's do or die)",
      "1:20": "You know it's an eye for eye",
      "1:22": "(it's an eye for eye)",
      "1:23": "Feel the energy align",
      "1:25": "(oh)",
      "1:26": "In the dead of night",
      "1:27": "you've been playing with fire",
      "1:28": "In the dead of night,",
      "1:31": "In the dead of night",
      "1:33": "(in the dead of night)",
      "1:37": "In the dead of night",
      "1:50": "You can save your alibi",
      "1:52": "I already know you lied",
      "1:55": "Oh no, no don't even try",
      "1:57": "(don't even try)",
      "1:58": "Watch the flame in me ignite",
      "2:00": "You didn't wanna walk,",
      "2:02": "didn't wanna walk the plank",
      "2:05": "But then ready or not,",
      "2:07": "then ready or not it came",
      "2:09": "Baby, it was dark",
      "2:10": "It was hard to see",
      "2:12": "And that's when a spark",
      "2:14": "lit inside of me,",
      "2:16": " Oh ",
      "2:17": "I was lost in reverie,",
      "2:19": "Oh-oh, oh-oh",
      "2:22": "One day you will see",
      "2:23": "(you will see)",
      "2:24": "What you made of me",
      "2:27": "What's inside of me",
      "2:28": "(what's inside of me)",
      "2:30": "Oh, one day you will see",
      "2:35": "I found my inner beast",
      "2:37": "(I found my inner beast)",
      "2:38": "You'll watch it release",
      "2:41": "In the dead of night, oh",
      "2:51": "In the dead of night",
      "2:55": "(In the dead of)",
      "2:57": "In the dead of night, oh-woah",
      "3:03": "In the dead of night",
      "3:05": "Baby, when it's do or die",
      "3:07": "You know it's an eye for eye",
      "3:10": "Feel the energy align",
      "3:12": "In the dead of night",
      "3:16": " In the dead of night ",
      "3:18": "  In the dead of night  ",
      "3:21": "   In the dead of night   ",
      "3:23": "    In the dead of night    ",
      "3:26": "And one day you will see",
      "3:28": "What you made of me",
      "3:31": "What's inside of me",
      "3:35": "Oh, and one day you will see",
      "3:39": "I found my inner beast",
      "3:42": "And you'll watch it release"
    };
    let v809 = {
      "0:07": "As the wind whips 'round",
      "0:09": "I take a breath for victory",
      "0:14": "Wanna play tag",
      "0:15": "or wave your white flag?",
      "0:17": "'Cause you'll never touch me",
      "0:22": "King of hearts, all in",
      "0:24": "(All in)",
      "0:25": "It's not a sin to wanna win",
      "0:27": "(Sin to wanna win)",
      "0:28": "Can't see me",
      "0:30": "Flyin' like a bee,",
      "0:32": "black and yellow energy",
      "0:34": "Only me on my team, naturally",
      "0:37": "I see a dreamer",
      "0:39": "over there by the water",
      "0:41": "But I got no,",
      "0:42": "but I got no",
      "0:43": "kakorrhaphiophobia",
      "0:45": "I see a dreamer",
      "0:46": "and he ripe for the slaughter",
      "0:48": "But I got no,",
      "0:49": "but I got no",
      "0:50": "kakorrhaphiophobia",
      "0:53": "Phobia,",
      "0:54": "phobia,",
      "0:55": " p h o b i a ",
      "0:56": "(Oh~)",
      "0:57": "I hear battalions",
      "0:58": "sing of my demise",
      "0:59": "But I don't know the words",
      "1:00": "(What?)",
      "1:01": "I take a road of my own making",
      "1:02": "On a journey, no returning",
      "1:04": "Woah oh,",
      "1:05": "woah oh,",
      "1:06": "that's how it goes",
      "1:08": "They've drawn the battle line",
      "1:09": "and I see fire in their eyes",
      "1:12": "Na na na na na na",
      "1:14": "I'm better off not listening",
      "1:16": "Na na na na na na",
      "1:17": "I've got my own song to sing",
      "1:19": "Flyin' like a bee,",
      "1:20": "black and yellow energy",
      "1:23": "Only me on my team,",
      "1:24": "Naturally, wooaahhhh",
      "1:27": "I see a dreamer",
      "1:28": "over there by the water",
      "1:30": "But I got no,",
      "1:31": "but I got no,",
      "1:33": "kakorrhaphiophobia",
      "1:35": "I see a dreamer",
      "1:36": "and hes ripe for the slaughter",
      "1:38": "But I got no,",
      "1:39": "but I got no",
      "1:41": "kakorrhaphiophobia",
      "1:43": "Phobia,",
      "1:44": "phobia,",
      "1:45": "  phobia  ",
      "1:46": "(Phobia)",
      "1:47": "(Oh~)",
      "1:52": "Ooooohh",
      "1:59": "My boat is full,",
      "2:00": "why don't you swim?",
      "2:02": "Enjoy my fortress,",
      "2:04": "I'll be right in",
      "2:06": "I stare a hole",
      "2:07": "through danger's soul",
      "2:09": "We all know I can do this,",
      "2:12": "eyes closed",
      "2:16": "I refuse to fail",
      "2:19": "So heed this cautionary tale",
      "2:23": "You've got dragons,",
      "2:25": "my little friend",
      "2:26": "You'll conquer them in the end",
      "2:29": "If you can,",
      "2:30": "(Aha-ha-ha-ha, jump in)",
      "2:32": "I see a dreamer",
      "2:33": "over there by the water",
      "2:34": "Oh, but I got no,",
      "2:35": "but I got no,",
      "2:36": "kakorrhaphiophobia",
      "2:39": "I see a dreamer",
      "2:40": "and hes ripe for the slaughter",
      "2:43": "Oh, but I got no,",
      "2:44": "but I got no",
      "2:45": "kakorrhaphiophobia",
      "2:47": "Phobia,",
      "2:48": "phobia,",
      "2:49": "pHoBiA",
      "2:50": "(Oh)"
    };
    let v810 = {
      "0:25": "I saw her in",
      "0:27": "the rightest way",
      "0:30": "Looking like",
      "0:32": "Anne Hathaway",
      "0:35": "Laughing while",
      "0:37": "she hit her pen",
      "0:39": "and coughed",
      "0:42": "and coughed.",
      "0:45": "And then",
      "0:46": "she came",
      "0:47": "up to my knees",
      "0:50": "Begging, Baby",
      "0:53": "would you please",
      "0:55": "Do the things",
      "0:57": "you said",
      "0:59": "you'd do to me",
      "1:02": "to me?",
      "1:04": "Oh, won't you",
      "1:05": "kiss me on the mouth",
      "1:07": "and love me like a sailor",
      "1:10": "And when",
      "1:11": "you get a taste me",
      "1:13": "tell me",
      "1:14": "what's my flavor",
      "1:15": "I don't believe in God",
      "1:17": "but i believe",
      "1:18": "that you're my savior"
    };
    let v811 = {
      "0:30": "They tell me keep it simple,",
      "0:31": "I tell them take it slow",
      "0:32": "I feed and water an idea,",
      "0:33": "so I let it grow",
      "0:35": "I tell them take it easy,",
      "0:36": "they laugh and tell me no",
      "0:37": "It's cool, but I don't see them",
      "0:38": "laughin' at my money, though",
      "0:40": "They spittin' facts at me,",
      "0:41": "Im spittin' tracks, catch me?",
      "0:43": "Im spinning gold out my records",
      "0:44": "know you can't combat me",
      "0:45": "They tell me, Jesus walks,",
      "0:47": "I tell them, money talks",
      "0:48": "Bling got me chill, 'cause im",
      "0:49": "living in an icebox",
      "0:51": "They tell me I've been sleepin',",
      "0:52": "I say im wide awake",
      "0:53": "Tracks hot and ready so they,",
      "0:54": "call me Mr. Easy-Bake",
      "0:56": "They say the grass is greener,",
      "0:57": "I think my grass is dank",
      "0:58": "Drivin' with a drank on an",
      "0:59": "empty tank to the bank",
      "1:02": "Do you feel me? Take a look,",
      "1:03": "inside my brain",
      "1:04": "The people always different,",
      "1:05": "but it always feels the same",
      "1:07": "That's the real me, pop the",
      "1:08": "champagne",
      "1:09": "The haters wanna hurt me,",
      "1:10": "and im laughin' at the pain",
      "1:12": "Stayin' still, eyes closed",
      "1:14": "Let the world just pass me by,",
      "1:17": "Pain pills, nice clothes",
      "1:20": "If I fall, I think I'll fly",
      "1:23": "Touch me, Midas",
      "1:25": "Make me part of your design",
      "1:28": "None to, guide us",
      "1:30": "I feel fear",
      "1:31": "for the very last time",
      "1:54": "They tell me that im special,",
      "1:56": "I smile and shake my head",
      "1:57": "I'll give them stories to tell,",
      "1:58": "friends bout the things I said",
      "2:00": "They tell me im so humble,",
      "2:01": "I say im turning red",
      "2:02": "They let me lie to them",
      "2:03": "and dont feel like",
      "2:04": "they've been misled",
      "2:05": "They give so much to me,",
      "2:06": "Im losing touch, get me?",
      "2:07": "Served on a silver platter,",
      "2:08": "ask for seconds,",
      "2:09": "they just let me",
      "2:10": "They tell me im a god,",
      "2:11": "Im lost in the facade",
      "2:13": "Six feet off the ground at all",
      "2:14": "times, I think im feelin' odd",
      "2:15": "No matter what I make,",
      "2:17": "they never see mistakes",
      "2:18": "Makin' so much bread,",
      "2:19": "I don't care that",
      "2:20": "they're just fake",
      "2:21": "They tell me they're below me,",
      "2:22": "I act like im above",
      "2:23": "The people blend together,",
      "2:24": "but I'd be lost",
      "2:25": "without their love",
      "2:26": "Can you heal me?",
      "2:27": " Have I gained too much?",
      "2:29": "When you become untouchable,",
      "2:30": "you're unable to touch",
      "2:31": "Is there a real me?",
      "2:32": "Pop the champagne",
      "2:34": "It hurts me just to think,",
      "2:35": "and I don't do pain",
      "2:37": "Stayin' still, eyes closed,",
      "2:39": "Let the world just pass me by",
      "2:42": "Pain pills, nice clothes,",
      "2:44": "If I fall, I think I'll fly",
      "2:47": "Touch me, Midas,",
      "2:50": "Make me part of your design,",
      "2:53": "None to guide us,",
      "2:55": "I feel fear",
      "2:56": "for the very last time",
      "2:58": "Lay still, restless,",
      "3:00": "Losing sleep while",
      "3:01": "I lose my mind",
      "3:03": "All thrill, no stress,",
      "3:06": "All my muses left behind",
      "3:09": "World is below,",
      "3:11": "So high up, im near-divine",
      "3:14": "Lean in, let go,",
      "3:16": "I feel fear",
      "3:17": "for the very last time"
    };
    let v812 = {
      "0:04": "Ooh-ooh-ooh",
      "0:07": "I will be good",
      "0:18": "We'll be together",
      "0:19": "'til the morning light",
      "0:21": "Don't stand so,",
      "0:23": "don't stand so,",
      "0:24": "Don't stand so close to me",
      "0:39": "Baby, you belong to me",
      "0:42": "Yes, you do, yes, you do",
      "0:44": "you're my affection",
      "0:46": "I can make you wanna cry",
      "0:48": "Yes, I do, yes, I do",
      "0:50": "I will be good",
      "0:52": "You're like a cruel device",
      "0:54": "your blood is cold like ice",
      "0:55": "Poison for my veins",
      "0:56": "I'm breaking my chains",
      "0:58": "One look and you can kill",
      "0:59": "my pain now is your thrill",
      "1:01": "Your love is for me",
      "1:03": "I say, try me",
      "1:05": "take a chance on emotions",
      "1:07": "For now and ever",
      "1:08": "close to your heart",
      "1:10": "I say, try me",
      "1:11": "take a chance on my passion",
      "1:13": "We'll be together all the time",
      "1:16": "I say, try me",
      "1:17": "take a chance on emotions",
      "1:20": "For now and ever",
      "1:21": "into my heart",
      "1:22": "I say, try me",
      "1:23": "take a chance on my passion",
      "1:26": "We'll be together",
      "1:27": "'til the morning light",
      "1:29": "Don't stand so,",
      "1:30": "don't stand so,",
      "1:32": "Don't stand so close to me",
      "1:47": "Baby, let me take control",
      "1:50": "Yes, I do, yes, I do",
      "1:52": "you are my target",
      "1:53": "No one ever made me cry",
      "1:56": "What you do, what you do",
      "1:58": "baby's so bad",
      "2:00": "You're like a cruel device",
      "2:01": "your blood is cold like ice",
      "2:03": "Poison for my veins",
      "2:04": "I'm breaking my chains",
      "2:06": "One look and you can kill",
      "2:07": "my pain now is your thrill",
      "2:09": "Your love is for me",
      "2:11": "I say, try me",
      "2:13": "take a chance on emotions",
      "2:15": "For now and ever",
      "2:16": "close to your heart",
      "2:17": "I say, try me",
      "2:19": "take a chance on my passion",
      "2:21": "We'll be together all the time",
      "2:23": "I say, try me",
      "2:25": "take a chance on emotions",
      "2:27": "For now and ever",
      "2:28": "into my heart",
      "2:29": "I say, try me",
      "2:31": "take a chance on my passion",
      "2:33": "We'll be together",
      "2:34": "'til the morning light",
      "2:37": "Don't stand so,",
      "2:38": "don't stand so,",
      "2:40": "Don't stand so close to me",
      "3:07": "I say, try me",
      "3:08": "take a chance on emotions",
      "3:10": "For now and ever",
      "3:11": "close to your heart",
      "3:13": "I say, try me",
      "3:14": "take a chance on my passion",
      "3:17": "We'll be together all the time",
      "3:19": "I say, try me",
      "3:20": "take a chance on emotions",
      "3:23": "For now and ever",
      "3:24": "into my heart",
      "3:25": "I say, try me",
      "3:26": "take a chance on my passion",
      "3:29": "We'll be together",
      "3:30": "'til the morning light",
      "3:32": "Don't stand so,",
      "3:34": "don't stand so,",
      "3:35": "Don't stand so close to me",
      "3:50": "Try me",
      "3:51": "take a chance on emotions",
      "3:53": "For now and ever",
      "3:54": "close to your heart",
      "3:55": "I say, try me",
      "3:56": "take a chance on my passion",
      "3:59": "We'll be together all the time",
      "4:02": "I say, try me",
      "4:03": "take a chance on emotions",
      "4:06": "For now and ever",
      "4:07": "into my heart",
      "4:08": "I say, try me",
      "4:09": "take a chance on my passion",
      "4:12": "We'll be together",
      "4:13": "'til the morning light",
      "4:15": "Don't stand so,",
      "4:17": "don't stand so,",
      "4:18": "Don't stand so close to me"
    };
    let v813 = {
      "0:01": "Everything is awesome",
      "0:03": "Everything is cool when",
      "0:05": "you're part of a team",
      "0:07": "Everything is awesome",
      "0:10": "When you're living out a dream",
      "0:15": "Everything is better when",
      "0:16": "we stick together",
      "0:21": "Side by side, you and I",
      "0:23": "are gonna win forever,",
      "0:25": "let's party forever",
      "0:28": "We're the same, I'm like you,",
      "0:29": "you're like me",
      "0:30": "We are working in harmony",
      "0:33": "Everything is awesome",
      "0:36": "Everything is cool when you're",
      "0:38": "part of a team",
      "0:40": "Everything is awesome",
      "0:43": "When you're living out a dream",
      "0:45": "(Woooo! Three, two, one, go!)",
      "0:46": "Have you heard the news?",
      "0:47": "Everyone's talkin'",
      "0:48": "Life is good 'cause",
      "0:49": "everything's awesome",
      "0:50": "Lost my job, there's",
      "0:51": "a new opportunity",
      "0:52": "More free time for",
      "0:53": "my awesome community",
      "0:54": "I feel more awesome than an",
      "0:55": "awesome possum",
      "0:56": "Dip my body in",
      "0:57": "chocolate frostin'",
      "0:58": "Three years later,",
      "0:59": "wash off the frostin'",
      "1:00": "Smellin' like a blossom,",
      "1:01": "everything is awesome",
      "1:02": "Stepped in mud,",
      "1:03": "got new brown shoes",
      "1:04": "It's awesome to win, and it's",
      "1:05": "awesome to lose",
      "1:08": "Everything is better when",
      "1:09": "we stick together",
      "1:14": "Side by side, you and I",
      "1:15": "are gonna win forever,",
      "1:17": "let's party forever",
      "1:21": "We're the same, I'm like you,",
      "1:22": "you're like me",
      "1:23": "We are working in harmony",
      "1:28": "Everything is awesome",
      "1:31": "Everything is cool when",
      "1:32": "you're part of a team",
      "1:34": "Everything is awesome",
      "1:37": "When you're living out a dream",
      "1:40": "Blue skies, bouncy springs",
      "1:41": "We just named",
      "1:42": "two awesome things",
      "1:43": "A Nobel prize,",
      "1:44": "a piece of string",
      "1:45": "You know what's awesome?",
      "1:46": "Everything!",
      "1:47": "Dogs with fleas, allergies",
      "1:48": "A book of Greek antiquities",
      "1:50": "Brand new pants,",
      "1:51": "a very old vest",
      "1:52": "Awesome items are the best",
      "1:53": "Trees, frogs, clogs,",
      "1:56": "they're awesome",
      "1:57": "Rocks, clocks, and socks,",
      "1:59": "they're awesome",
      "2:00": "Figs, and jigs, and twigs,",
      "2:02": "that's awesome",
      "2:03": "Everything you see or think",
      "2:05": "or say is awesome",
      "2:27": "Everything is awesome",
      "2:30": "Everything is cool when you're",
      "2:32": "part of a team",
      "2:33": "Everything is awesome",
      "2:36": "When you're living out a dream"
    };
    let v814 = {};
    const v815 = new Audio("https://github.com/oe2735/music/raw/refs/heads/main/Headie_One_K-Trap_-_PARK_CHINOIS_(Hydr0.org).mp3");
    const v816 = new Audio("https://github.com/oe2735/music/raw/refs/heads/main/Eurobeat_-_Manuel_-_Gas_Gas_Gas_(Hydr0.org).mp3");
    const v817 = new Audio("https://github.com/oe2735/music/raw/refs/heads/main/verbatim_-_mother_mother_(Hydr0.org).mp3");
    const v818 = new Audio("https://ncs.io/track/download/3db2d7b2-fe13-4063-a618-a29eca83f45f?_gl=1*1we4mwn*_up*MQ..*_ga*MTgxNjU2NDI0MC4xNzMwMTYzNTE0*_ga_PFS54FR7NV*MTczMDE2MzUxNC4xLjAuMTczMDE2MzUxNC4wLjAuMA..");
    const v819 = new Audio("https://github.com/oe2735/music/raw/refs/heads/main/I_See_a_Dreamer_Dream_Team_Original_Song_-_CG5_(Hydr0.org).mp3");
    const v820 = new Audio("https://github.com/oe2735/music/raw/refs/heads/main/Gigi_Perez_-_Sailor_Song_(Hydr0.org).mp3");
    const v821 = new Audio("https://github.com/oe2735/music/raw/refs/heads/main/he_Living_Tombstone_-_My_Ordinary_Life_(Hydr0.org).mp3");
    const v822 = new Audio("https://github.com/oe2735/music/raw/refs/heads/main/dont_stand_so_close_to_me_-_initial_d_(Hydr0.org).mp3");
    const v823 = new Audio("https://github.com/oe2735/music/raw/refs/heads/main/The_LEGO_Movie_-_Everything_is_awesome_(Hydr0.org).mp3");
    const v824 = new Audio("");
    let v825 = false;
    let v826 = "";
    function f92(p696, p697) {
      p696.play();
      p696.ontimeupdate = function (p698) {
        let v827 = p697[f91(Math.round(this.currentTime | 0))];
        if (v827 && v827 !== v826) {
          v826 = v827;
          f60(v827);
        }
      };
      p696.onended = function () {
        if (v825) {
          p696.play();
        }
      };
      v825 = true;
    }
    function f93() {
      if (!v825) {
        switch (f5("songChat").value) {
          case "song1":
            f92(v815, v805);
            break;
          case "song2":
            f92(v816, v806);
            break;
          case "song3":
            f92(v817, v807);
            break;
          case "song4":
            f92(v818, v808);
            break;
          case "song5":
            f92(v819, v809);
            break;
          case "song6":
            f92(v820, v810);
            break;
          case "song7":
            f92(v821, v811);
            break;
          case "song8":
            f92(v822, v812);
            break;
          case "song9":
            f92(v823, v813);
            break;
          case "song10":
            f92(v824, v814);
            break;
          default:
            break;
        }
      } else {
        v815.pause();
        v816.pause();
        v817.pause();
        v818.pause();
        v819.pause();
        v820.pause();
        v821.pause();
        v822.pause();
        v823.pause();
        v824.pause();
        v825 = false;
      }
    }
    function f94() {
      let v828 = Math.atan2(v291.y2 - v286.y2, v291.x2 - v286.x2);
      let vInfinity = Infinity;
      let v829 = v291.inTrap;
      if (v291.dist2 - v286.scale * 1.8 <= v680.weapons[v286.weapons[0]].range && !v829) {
        for (let v830 of v282) {
          if (v830.dmg && v830.active && v830.isTeamObject(v286) || v830.type == 1 && v830.y >= 12000) {
            let v831 = (v680.weapons[v286.weapons[0]].knock || 0) * v680.weapons[v286.weapons[0]].range + v286.scale * 2;
            let v832 = ![undefined, 9, 12, 13, 15].includes(v286.weapons[1]) ? (v680.weapons[v286.weapons[1]].knock || 0) * v680.weapons[v286.weapons[1]].range + v286.scale * 2 - 10 : v286.weapons[1] != undefined ? 60 : 0;
            let v833 = v831 + v832;
            let v834 = v286.reloads[53] == 0 ? v831 + v832 + 75 : v833;
            let v835 = v291.x2 + v831 * Math.cos(v828);
            let v836 = v291.y2 + v831 * Math.sin(v828);
            let v837 = v291.x2 + v832 * Math.cos(v828);
            let v838 = v291.y2 + v832 * Math.sin(v828);
            let v839 = v291.x2 + v833 * Math.cos(v828);
            let v840 = v291.y2 + v833 * Math.sin(v828);
            let v841 = v291.x2 + v834 * Math.cos(v828);
            let v842 = v291.y2 + v834 * Math.sin(v828);
            const v843 = {
              x: v835,
              y: v836
            };
            if (v679.getDist(v843, v830, 0, 0) < v830.scale + v286.scale && v286.reloads[v286.weapons[0]] == 0) {
              return "primary sync";
            }
            const v844 = {
              x: v839,
              y: v840
            };
            if (v679.getDist(v844, v830, 0, 0) < v830.scale + v286.scale && v286.reloads[v286.weapons[0]] == 0 && v286.reloads[v286.weapons[1]] == 0 && v291.dist2 <= v680.weapons[v286.weapons[1]].range + v286.scale * 1.8) {
              return "insta them";
            }
          }
        }
      } else {}
      return false;
    }
    function f95(p699, p700, p701) {
      let v845 = document.getElementById("gameCanvas").getContext("2d");
      let vV273 = v273;
      v845.globalAlpha = 0.5;
      let v846 = {
        x: vV273.mex - p700,
        y: vV273.mey - p701
      };
      v845.fillStyle = "#A9A9A9";
      v845.beginPath();
      v845.arc(v846.x, v846.y, 65, 0, Math.PI * 2);
      v845.fill();
    }
    function f96(p702) {
      v284.push(new C16(p702.x, p702.y, p702.dir, p702.buildIndex, p702.weaponIndex, p702.weaponVariant, p702.skinColor, p702.scale, p702.name));
    }
    function f97(p703) {
      v279 = p703.teams;
    }
    function f98(p704) {
      v314 = {};
      v318 = {};
      v287 = p704;
      v316 = 0;
      v317 = true;
      v68.style.display = "none";
      f23("F", 0, f74(), 1);
      v293.ageInsta = true;
      if (v313) {
        v313 = false;
        v282.length = 0;
      }
    }
    function f99(p705, p706) {
      let vF28 = f28(p705[0]);
      if (!vF28) {
        vF28 = new C17(p705[0], p705[1], vP11, v679, v685, v681, v278, v277, v680, v683, v684);
        v278.push(vF28);
        if (p705[1] != v287) {
          f21("Game", "Encountered " + p705[2] + " {" + p705[1] + "}.", "lightblue");
        }
      } else if (p705[1] != v287) {
        f21("Game", "Encountered " + p705[2] + " {" + p705[1] + "}.", "lightblue");
      }
      vF28.spawn(p706 ? true : null);
      vF28.visible = false;
      const v847 = {
        x2: undefined,
        y2: undefined
      };
      vF28.oldPos = v847;
      vF28.x2 = undefined;
      vF28.y2 = undefined;
      vF28.x3 = undefined;
      vF28.y3 = undefined;
      vF28.setData(p705);
      if (p706) {
        if (!v286) {
          window.prepareUI(vF28);
        }
        v286 = vF28;
        v302 = v286.x;
        v303 = v286.y;
        v293.lastDir = 0;
        f121();
        f106();
        f84();
        for (let v848 = 0; v848 < 5; v848++) {
          v275.push(new C14(v286.x, v286.y));
        }
        if (v286.skins[7]) {
          v293.reSync = true;
        }
      }
    }
    function f100(p707) {
      for (let v849 = 0; v849 < v278.length; v849++) {
        if (v278[v849].id == p707) {
          f21("Game", v278[v849].name + " left the game", "yellow");
          v278.splice(v849, 1);
          break;
        }
      }
    }
    let v850 = false;
    setInterval(() => {
      if (v317) {
        if (v286.health < 100 && !v850) {
          if (v292 < 69) {
            if (Date.now() - v286.lastHit >= 120) {
              v850 = true;
              f52();
            }
          } else if (v246.tick - v286.hitTick > 1) {
            v850 = true;
            f52();
          }
          if (v286.shameCount < 7) {
            if (v688.inTrap && v688.hasSpike && v291.dist2 <= 169 && v679.getDist(v286, v688.info[1], 2, 0) <= v286.scale + v688.info[1].scale + 3) {
              if (v286.health <= v292 < 45 ? 35 : 65) {
                v850 = true;
                if (v292 < 45) {
                  f52();
                } else {
                  f53(2);
                }
              }
            } else if (v286.health < 33) {
              v850 = true;
              f52();
            }
          }
        }
      }
    });
    function f101(p708, p709) {
      v288 = f29(p708);
      if (v288) {
        v850 = false;
        v288.oldHealth = v288.health;
        v288.health = p709;
        v288.judgeShame();
        if (v288.oldHealth > v288.health) {
          v288.damaged = v288.oldHealth - v288.health;
          v494.push([p708, p709, v288.damaged]);
        }
      }
    }
    let v851 = [];
    function f102() {
      let v852 = window.pingTime;
      v851.push(v852);
      if (v851.length > 20) {
        v851.shift();
      }
      function f103(p710) {
        if (p710.length === 0) {
          return 0;
        }
        let v853 = [...p710].sort((p711, p712) => p711 - p712);
        let v854 = Math.floor(v853.length / 2);
        if (v853.length % 2 !== 0) {
          return v853[v854];
        } else {
          return (v853[v854 - 1] + v853[v854]) / 2;
        }
      }
      let vF103 = f103(v851);
      v292 = vF103;
    }
    function f104() {
      v317 = false;
      const v855 = {
        x: v286.x,
        y: v286.y
      };
      v693 = v855;
      v20.style.display = "block";
      v20.style.fontSize = "0px";
      setTimeout(function () {
        if (vF20.autoRespawn) {
          const v856 = {
            name: v250[0],
            moofoll: v250[1],
            skin: v250[2]
          };
          f23("M", v856);
        }
        v52.style.display = "block";
        v10.style.display = "block";
        v20.style.display = "none";
      }, vP11.deathFadeout);
    }
    function f105(p713, p714) {
      if (v286) {
        v286.itemCounts[p713] = p714;
        f84(p713);
      }
    }
    function f106(p715, p716, p717) {
      if (p715 != undefined) {
        v286.XP = p715;
      }
      if (p716 != undefined) {
        v286.maxXP = p716;
      }
      if (p717 != undefined) {
        v286.age = p717;
      }
    }
    function f107(p718, p719) {
      v286.upgradePoints = p718;
      v286.upgrAge = p719;
      if (p718 > 0) {
        v678.length = 0;
        v679.removeAllChildren(v54);
        for (let v857 = 0; v857 < v680.weapons.length; ++v857) {
          if (v680.weapons[v857].age == p719 && (v98 || v680.weapons[v857].pre == undefined || v286.weapons.indexOf(v680.weapons[v857].pre) >= 0)) {
            let v858 = v679.generateElement({
              id: "upgradeItem" + v857,
              class: "actionBarItem",
              onmouseout: function () {
                f63();
              },
              parent: v54
            });
            v858.style.backgroundImage = f5("actionBarItem" + v857).style.backgroundImage;
            v678.push(v857);
          }
        }
        for (let v859 = 0; v859 < v680.list.length; ++v859) {
          if (v680.list[v859].age == p719 && (v98 || v680.list[v859].pre == undefined || v286.items.indexOf(v680.list[v859].pre) >= 0)) {
            let v860 = v680.weapons.length + v859;
            let v861 = v679.generateElement({
              id: "upgradeItem" + v860,
              class: "actionBarItem",
              onmouseout: function () {
                f63();
              },
              parent: v54
            });
            v861.style.backgroundImage = f5("actionBarItem" + v860).style.backgroundImage;
            v678.push(v860);
          }
        }
        for (let v862 = 0; v862 < v678.length; v862++) {
          (function (p720) {
            let vF53 = f5("upgradeItem" + p720);
            vF53.onmouseover = function () {
              if (v680.weapons[p720]) {
                f63(v680.weapons[p720], true);
              } else {
                f63(v680.list[p720 - v680.weapons.length]);
              }
            };
            vF53.onclick = v679.checkTrusted(function () {
              f23("H", p720);
            });
            v679.hookTouchEvents(vF53);
          })(v678[v862]);
        }
        if (v678.length) {
          v54.style.display = "block";
          v29.style.display = "block";
          v29.innerHTML = "SELECT ITEMS (" + p718 + ")";
        } else {
          v54.style.display = "none";
          v29.style.display = "none";
          f63();
        }
      } else {
        v54.style.display = "none";
        v29.style.display = "none";
        f63();
      }
    }
    function f108(p721) {
      let vF312 = f31(p721);
      v681.disableBySid(p721);
      if (v286) {
        for (let v863 = 0; v863 < v285.length; v863++) {
          if (v285[v863].sid == p721) {
            v285.splice(v863, 1);
            break;
          }
        }
        if (!v286.canSee(vF312)) {
          const v864 = {
            x: vF312.x,
            y: vF312.y
          };
          v698.push(v864);
        }
        if (v698.length > 8) {
          v698.shift();
        }
        v688.replaceSids.push(p721);
        v688.replaced = false;
      }
    }
    function f109(p722) {
      if (v286) {
        v681.removeAllItems(p722);
      }
    }
    function f110(p723) {
      return v286.reloads[p723] > 0;
    }
    function f111(p724) {
      return v286.weaponIndex != p724 || v286.buildIndex > -1;
    }
    let v865 = false;
    function f112(p725) {
      setTimeout(() => {
        if (vF20.autoPrePlace && v289.length && !f5("weaponGrind").checked) {
          vF7();
        }
      }, 111 - v292);
      v246.tick++;
      v289 = [];
      v290 = [];
      v291 = [];
      v246.tickSpeed = performance.now() - v246.lastTick;
      v246.lastTick = performance.now();
      v278.forEach(p726 => {
        p726.forcePos = !p726.visible;
        p726.visible = false;
      });
      for (let v866 = 0; v866 < p725.length;) {
        v288 = f29(p725[v866]);
        if (v288) {
          v288.t1 = v288.t2 === undefined ? v246.lastTick : v288.t2;
          v288.t2 = v246.lastTick;
          v288.oldPos.x2 = v288.x2;
          v288.oldPos.y2 = v288.y2;
          v288.x1 = v288.x;
          v288.y1 = v288.y;
          v288.x2 = p725[v866 + 1];
          v288.y2 = p725[v866 + 2];
          v288.x3 = v288.x2 + (v288.x2 - v288.oldPos.x2);
          v288.y3 = v288.y2 + (v288.y2 - v288.oldPos.y2);
          v288.d1 = v288.d2 === undefined ? p725[v866 + 3] : v288.d2;
          v288.d2 = p725[v866 + 3];
          v288.dt = 0;
          v288.buildIndex = p725[v866 + 4];
          v288.weaponIndex = p725[v866 + 5];
          v288.weaponVariant = p725[v866 + 6];
          v288.team = p725[v866 + 7];
          v288.isLeader = p725[v866 + 8];
          v288.oldSkinIndex = v288.skinIndex;
          v288.oldTailIndex = v288.tailIndex;
          v288.skinIndex = p725[v866 + 9];
          v288.tailIndex = p725[v866 + 10];
          v288.iconIndex = p725[v866 + 11];
          v288.zIndex = p725[v866 + 12];
          v288.visible = true;
          v288.update(v246.tickSpeed);
          v288.dist2 = v679.getDist(v288, v286, 2, 2);
          v288.aim2 = v679.getDirect(v288, v286, 2, 2);
          v288.dist3 = v679.getDist(v288, v286, 3, 3);
          v288.aim3 = v679.getDirect(v288, v286, 3, 3);
          v288.damageThreat = 0;
          v288.mostDamageThreat = 0;
          if (v288.skinIndex == 45 && v288.shameTimer <= 0) {
            v288.addShameTimer();
          }
          if (v288.oldSkinIndex == 45 && v288.skinIndex != 45) {
            v288.shameTimer = 0;
            v288.shameCount = 0;
            if (v288 == v286) {
              f52();
            }
          }
          let v867 = v282.filter(p727 => p727.trap && p727.active && v679.getDist(p727, v288, 0, 2) <= v288.scale + p727.getScale() + 3 && !p727.isTeamObject(v288)).sort(function (p728, p729) {
            return v679.getDist(p728, v288, 0, 2) - v679.getDist(p729, v288, 0, 2);
          })[0];
          v865 = v291.inTrap ? true : false;
          v288.inTrap = v867;
          if (v288 == v286) {
            let v868 = 0;
            v288.inWater = v288.y2 >= vP11.mapScale / 2 - vP11.riverWidth / 2 && v288.y2 <= vP11.mapScale / 2 + vP11.riverWidth / 2;
            if (v282.length) {
              v282.forEach(p730 => {
                p730.onNear = false;
                if (p730.active) {
                  if (!p730.onNear && v679.getDist(p730, v288, 0, 2) <= p730.scale + v680.weapons[v288.weapons[0]].range) {
                    p730.onNear = true;
                  }
                  if (p730.isItem && p730.owner) {
                    if (p730.name == "turret" && v679.getDist(v286, p730, 2, 0) < 680 && !p730.isTeamObject(v288)) {
                      v868++;
                    }
                    if (!p730.pps && v288.sid == p730.owner.sid && v679.getDist(p730, v288, 0, 2) > (parseInt(f5("breakRange").value) || 0) && !p730.breakObj && ![13, 14, 20].includes(p730.id)) {
                      p730.breakObj = true;
                      const v869 = {
                        x: p730.x,
                        y: p730.y,
                        sid: p730.sid
                      };
                      v285.push(v869);
                    }
                  }
                }
              });
              v288.antiTurretSpam = v868 >= 5;
              let v870 = v282.filter(p731 => p731.dmg && p731.active && v681.canHit(v288, p731, v288.weapons[1] == 10 ? v288.weapons[1] : v288.weapons[0]) && !p731.isTeamObject(v288)).sort(function (p732, p733) {
                return v679.getDist(p732, v288, 0, 2) - v679.getDist(p733, v288, 0, 2);
              })[0];
              if (v867) {
                v688.dist = v679.getDist(v867, v288, 0, 2);
                v688.aim = v679.getDirect(v867, v288, 0, 2);
                if (!v688.inTrap) {
                  v688.protect(v688.aim);
                }
                v688.inTrap = true;
                v688.info = [v867, v870];
                v688.hasSpike = v870 != undefined ? true : false;
              } else {
                v688.inTrap = false;
              }
            } else {
              v688.inTrap = false;
            }
          }
          if (v288.weaponIndex < 9) {
            v288.primaryIndex = v288.weaponIndex;
            v288.primaryVariant = v288.weaponVariant;
          } else if (v288.weaponIndex > 8) {
            v288.secondaryIndex = v288.weaponIndex;
            v288.secondaryVariant = v288.weaponVariant;
          }
        }
        v866 += 13;
      }
      if (v687.stack.length) {
        let v871 = [];
        let v872 = [];
        let v873 = 0;
        let v874 = 0;
        let v875 = {
          x: null,
          y: null
        };
        let v876 = {
          x: null,
          y: null
        };
        v687.stack.forEach(p734 => {
          if (p734.value >= 0) {
            const v877 = {
              x: p734.x,
              y: p734.y
            };
            if (v873 == 0) {
              v875 = v877;
            }
            v873 += Math.abs(p734.value);
          } else {
            const v878 = {
              x: p734.x,
              y: p734.y
            };
            if (v874 == 0) {
              v876 = v878;
            }
            v874 += Math.abs(p734.value);
          }
        });
        if (v874 > 0) {
          v687.showText(v876.x, v876.y, Math.max(45, Math.min(50, v874)), 0.18, 500, v874, "#8ecc51");
        }
        if (v873 > 0) {
          v687.showText(v875.x, v875.y, Math.max(45, Math.min(50, v873)), 0.18, 500, v873, "#fff");
        }
        v687.stack = [];
      }
      if (v700.length) {
        v700.forEach(p735 => {
          f61(...p735);
        });
        v700 = [];
      }
      for (let v879 = 0; v879 < p725.length;) {
        v288 = f29(p725[v879]);
        if (v288) {
          if (!v288.isTeam(v286)) {
            v289.push(v288);
            if (v288.dist2 <= v680.weapons[v288.primaryIndex == undefined ? 5 : v288.primaryIndex].range + v286.scale * 2 + 69) {
              v290.push(v288);
            }
          }
          v288.manageReload();
          if (v288 != v286) {
            v288.addDamageThreat(v286);
          }
        }
        v879 += 13;
      }
      if (v286 && v286.alive) {
        if (v289.length) {
          v291 = v289.sort(function (p736, p737) {
            return p736.dist2 - p737.dist2;
          })[0];
        }
        if (v246.tickQueue[v246.tick]) {
          v246.tickQueue[v246.tick].forEach(p738 => {
            p738();
          });
          v246.tickQueue[v246.tick] = null;
        }
        if (v494.length) {
          v494.forEach(p739 => {
            let v880 = p739[0];
            let v881 = p739[1];
            let v882 = p739[2];
            v288 = f29(v880);
            let v883 = false;
            if (v288.health <= 0) {
              if (!v288.death) {
                v288.death = true;
                if (v288 != v286) {
                  f21("", v288.name + " {" + v288.sid + "} has died.", "red");
                }
                f96(v288);
              }
            }
            if (v288 == v286) {
              if (v288.skinIndex == 7 && (v882 == 5 || v288.latestTail == 13 && v882 == 2)) {
                if (v293.reSync) {
                  v293.reSync = false;
                  v288.setBullTick = true;
                }
                v883 = true;
              }
              if (v317) {
                let vF51 = f51(v882);
                let v884 = 100 - v286.health;
                let v885 = v290.some(p740 => p740.primaryVariant == 3 || p740.secondaryIndex == 10 && p740.secondaryVariant == 3) && v883 ? 10 : 5;
                let v886 = v884 + v288.damageThreat >= 100 ? 6 : 5;
                if (v884 + v288.mostDamageThreat >= 100 && v884 + v288.damageThreat < 100) {
                  v270 = true;
                }
                if (v290.some(p741 => [undefined, 9, 12, 13, 15].includes(p741.secondaryIndex))) {
                  if (v882 > 39 && v882 < 80 && v884 + v288.damageThreat >= 100) {
                    if (v246.tick - v288.antiTimer > 1) {
                      v288.canEmpAnti = true;
                      v288.antiTimer = v246.tick;
                    }
                    if (v288.shameCount < v886) {
                      f52();
                      v293.antiInsta = true;
                    }
                  } else if ([18.75, 22.5, 25, 26.25, 30, 35, 37.5, 50].includes(v882) && v884 + v288.damageThreat >= 100) {
                    if (v246.tick - v288.antiTimer > 1) {
                      v288.canEmpAnti = true;
                      v288.antiTimer = v246.tick;
                    }
                    if (v288.shameCount < v886) {
                      f52();
                      v293.antiInsta = true;
                    }
                  } else if (v882 > v885 && v884 + v288.damageThreat >= 100) {
                    if (v288.shameCount < v886) {
                      f52();
                      v293.antiInsta = true;
                    }
                  }
                } else if (v882 > v885 && v884 + v288.damageThreat >= 100) {
                  if (v288.shameCount < v886) {
                    f52();
                    v293.antiInsta = true;
                  }
                }
                if (v882 >= 20 && v286.skinIndex == 11) {
                  v689.canCounter = true;
                }
              }
            } else if (!v288.setPoisonTick && (v288.damaged == 5 || v288.latestTail == 13 && v288.damaged == 2)) {
              v288.setPoisonTick = true;
            }
          });
          v494 = [];
        }
        v278.forEach(p742 => {
          if (!p742.visible && v286 != p742) {
            p742.reloads = {
              "0": 0,
              "1": 0,
              "2": 0,
              "3": 0,
              "4": 0,
              "5": 0,
              "6": 0,
              "7": 0,
              "8": 0,
              "9": 0,
              "10": 0,
              "11": 0,
              "12": 0,
              "13": 0,
              "14": 0,
              "15": 0,
              "53": 0
            };
          }
          if (p742.setBullTick) {
            p742.bullTimer = 0;
          }
          if (p742.setPoisonTick) {
            p742.poisonTimer = 0;
          }
          p742.updateTimer();
        });
        if (v317) {
          if (v289.length) {
            v688.preplaces[0] = [];
            v688.preplaces[1] = [];
            if (!v688.replaced) {
              v688.autoReplace(v688.replaceSids);
              v688.replaced = true;
              v688.replaceSids = [];
            }
            if (v286.inTrap) {
              v688.autoPlace(1, 4, 2, true);
            }
            if (v689.ticking) {
              v688.autoPlace(0, 4, 2);
            }
            if (v293.predictSpikes > 0) {
              v688.autoPlace(0, 4, 2);
            }
            if (v291.inTrap && v291.dist2 < 500) {
              v688.autoPlace(1, 2, 4, true);
            } else if (v865 && !v291.inTrap) {
              v688.autoPlace(0, 4, 2);
            } else if (v291.dist2 > 300 && v291.dist2 < 499) {
              v688.autoPlace(1, 2, 4, true);
            } else if (v291.dist2 < 150) {
              v688.autoPlace(1, 2, 4, true);
            } else if (v291.dist2 <= 300) {
              v688.autoPlace(0, 4, 2);
            }
            if (v286.canEmpAnti) {
              v286.canEmpAnti = false;
              if (v291.dist2 <= 300 && !v293.safePrimary(v291) && !v293.safeSecondary(v291)) {
                if (v291.reloads[53] == 0) {
                  v286.empAnti = true;
                  v286.soldierAnti = false;
                } else {
                  v286.empAnti = false;
                  v286.soldierAnti = true;
                }
              }
            }
            if (!v689.isTrue && vF20.predictTick && v293.anti0Tick <= 0) {
              let vF94 = f94();
              if (vF94 == "insta them" && (![9, 12, 13, 15].includes(v286.weapons[1]) || v291.dist2 <= v680.weapons[v286.weapons[1]].range + v286.scale * 1.8)) {
                v689.changeType("rev");
              }
              if (vF94 == "primary sync") {
                v689.spikeTickType("rev");
              }
            }
            let v887 = v282.filter(p743 => p743.dmg && p743.active && p743.isTeamObject(v286) && v679.getDist(p743, v291, 0, 3) <= p743.scale + v291.scale).sort(function (p744, p745) {
              return v679.getDist(p744, v291, 0, 2) - v679.getDist(p745, v291, 0, 2);
            })[0];
            if (v887) {
              if (v291.dist2 <= v680.weapons[v286.weapons[0]].range + v286.scale * 1.8 && vF20.predictTick) {
                v689.canSpikeTick = true;
              }
            }
            if (vF20.anti1tick) {
              v290.forEach(p746 => {
                if (p746.primaryIndex == 5 && p746.primaryVariant >= 2) {
                  if (p746.dist2 > 169 && p746.dist2 < 269) {
                    if (p746.skinIndex == 53) {
                      v293.anti0Tick = 3;
                      f53(1);
                      v286.chat.message = "Anti 1 tick by " + p746.sid + " " + p746.name;
                      v286.chat.count = 334;
                    }
                  }
                }
              });
            }
            if (vF20.autoQonSync && v290.length > 1 && v286.shameCount < 5 && v290.some(p747 => [undefined, 3, 4, 5].includes(p747.primaryIndex)) && v242 < 60) {
              v293.anti0Tick = 3;
              f53(2);
              v286.chat.message = "sync detect test";
              v286.chat.count = 334;
            }
            if (f5("serverSync").checked && v799.length && v290.length) {
              v290.forEach(p748 => {
                let v888 = p748.dist2;
                v799.forEach(p749 => {
                  if (p748.sid == p749) {
                    return;
                  }
                  let vF292 = f29(p749);
                  let v889 = v679.getDist(vF292, p748, 2, 2);
                  if (v888 <= v286.scale * 1.8 + v680.weapons[v286.weapons[0]].range && v889 <= v286.scale * 1.8 + v680.weapons[vF292.primaryIndex || 5].range && v286.reloads[v286.weapons[0]] == 0 && vF292.reloads[vF292.primaryIndex || 5] == 0) {
                    v689.spikeTickType();
                  }
                });
              });
            }
          }
          if (v291.dist2 <= v680.weapons[v286.weapons[1] == 10 ? v286.weapons[1] : v286.weapons[0]].range + v291.scale * 1.8 && v689.wait && !v689.isTrue && !v293.waitHit && v286.reloads[v286.weapons[0]] == 0 && v286.reloads[v286.weapons[1]] == 0 && f5("instaType").value == "oneShot" && v689.perfCheck(v286, v291)) {
            v689.can = true;
          } else {
            v689.can = false;
          }
          if (v318.q) {
            f46(0, f74());
          }
          if (v318.f) {
            f46(4, f71());
          }
          if (v318.v) {
            f46(2, f71());
          }
          if (v318.y) {
            f46(5, f71());
          }
          if (v318.h) {
            f46(v286.getItemType(22), f71());
          }
          if (v318.n) {
            f46(3, f71());
          }
          if (v318.l) {
            let vF293 = f29(parseInt(f5("targetSid").value));
            if (vF293) {
              if (f5("hatType").value != "ag") {
                f23("f", vF293.aim2, 1);
                if (vF293.dist2 >= 145) {
                  if (v286.items[4] != 15) {
                    f46(4, vF293.aim2);
                  }
                }
              }
              if (vF293.dist2 <= 70) {
                v688.testCanPlace(2, 0, Math.PI * 2, Math.PI / 8, vF293.aim2 + Math.PI / 2, 0, 1);
                f23("N");
              }
            }
          }
          f80();
          if (v679.getDist(v293.millPlacePos, v286, 0, 2) >= (v680.list[v286.items[3]].scale + 5) * 2) {
            if (v319.place) {
              let v890 = v286.items[4] == 16 ? 1.4 : 1.23456789;
              v688.testCanPlace(3, -v890, v890, v890 / 3, v679.getDirect(v293.millPlacePos, v286, 0, 2));
            }
            if (v319.placeSpawnPads) {
              v688.testCanPlace(v286.getItemType(20), 0, Math.PI * 2, Math.PI / 2, v679.getDirect(v286.oldPos, v286, 2, 2));
            }
            const v891 = {
              x: v286.x2,
              y: v286.y2
            };
            v293.millPlacePos = v891;
          }
          if (v689.can) {
            v689.changeType(vF20.revInsta || v286.weapons[1] == 10 ? "rev" : "normal");
          }
          if (v689.canCounter) {
            v689.canCounter = false;
            if (v286.reloads[v286.weapons[0]] == 0 && !v689.isTrue) {
              v689.counterType();
            }
          }
          if (v689.canSpikeTick) {
            v689.canSpikeTick = false;
            if (v286.reloads[v286.weapons[0]] == 0 && !v689.isTrue && [3, 4, 5].includes(v286.weapons[0])) {
              v689.spikeTickType();
            }
          }
          if (v270 && v457) {
            v246.tickBase(() => {
              f44();
              v293.waitHit = 0;
            }, 1);
          } else {
            if (!v711.middle && !v711.left && !v711.right && !v689.isTrue && !v688.inTrap && !v274.active && v457) {
              v246.tickBase(() => {
                f44();
                v293.waitHit = 0;
              }, 1);
            }
            if (!v711.middle && (v711.left || v711.right) && !v689.isTrue) {
              if (v286.weaponIndex != (v711.right && v286.weapons[1] == 10 && vF20.hammerBreakerOptimisation ? v286.weapons[1] : v286.weapons[0]) || v286.buildIndex > -1) {
                f43(v711.right && v286.weapons[1] == 10 && vF20.hammerBreakerOptimisation ? v286.weapons[1] : v286.weapons[0]);
              }
              if (v286.reloads[v711.right && v286.weapons[1] == 10 && vF20.hammerBreakerOptimisation ? v286.weapons[1] : v286.weapons[0]] == 0 && !v293.waitHit && !v457) {
                f44();
                v293.waitHit = 1;
                v246.tickBase(() => {
                  v293.waitHit = 0;
                }, 1);
              }
            }
            if (v241 && !v711.left && !v711.right && !v689.isTrue && v291.dist2 <= v680.weapons[v286.weapons[0]].range + v286.scale * 1.8 && !v688.inTrap) {
              if (v286.weaponIndex != v286.weapons[0] || v286.buildIndex > -1) {
                f43(v286.weapons[0]);
              }
              if (v286.reloads[v286.weapons[0]] == 0 && !v293.waitHit && !v457) {
                f44();
                v293.waitHit = 1;
              }
            }
            if (v688.inTrap) {
              if (!v711.left && !v711.right && !v689.isTrue) {
                let v892 = v688.hasSpike && v681.hitsToBreak(v688.info[1], v286) <= v681.hitsToBreak(v688.info[0], v286) ? v688.info[1] : v688.info[0];
                let v893 = v688.notFast(v892) ? v286.weapons[1] : v286.weapons[0];
                if (v286.weaponIndex != v893 || v286.buildIndex > -1) {
                  f43(v893);
                }
                if (v286.reloads[v893] == 0 && !v293.waitHit && !v457) {
                  f44();
                  v293.waitHit = 1;
                  v246.tickBase(() => {
                    v293.waitHit = 0;
                  }, 1);
                }
              }
            }
            if (!v688.inTrap && v274.active) {
              if (!v711.left && !v711.right && !v689.isTrue) {
                let v894 = v688.notFast(v274.info) ? v286.weapons[1] : v286.weapons[0];
                if (v286.weaponIndex != v894 || v286.buildIndex > -1) {
                  f43(v894);
                }
                if (v286.reloads[v894] == 0 && !v293.waitHit && !v457) {
                  f44();
                  v293.waitHit = 1;
                  v246.tickBase(() => {
                    v293.waitHit = 0;
                  }, 1);
                }
              }
            }
          }
          if (v711.middle && !v688.inTrap) {
            if (!v689.isTrue && v286.reloads[v286.weapons[1]] == 0) {
              if (v293.ageInsta && v286.weapons[0] != 4 && v286.weapons[1] == 9 && v286.age >= 9 && v289.length) {
                v689.bowMovement();
              } else {
                v689.rangeType();
              }
            }
          }
          if (v318.t && !v688.inTrap) {
            if (!v689.isTrue && v286.reloads[v286.weapons[0]] == 0 && (v286.weapons[1] == 15 ? v286.reloads[v286.weapons[1]] == 0 : true) && (v286.weapons[0] == 5 || v286.weapons[0] == 4 && v286.weapons[1] == 15)) {
              v689[v286.weapons[0] == 4 && v286.weapons[1] == 15 ? "kmTickMovement" : "tickMovement"]();
            }
          }
          if (v318["."] && !v688.inTrap) {
            if (!v689.isTrue && v286.reloads[v286.weapons[0]] == 0 && ([9, 12, 13, 15].includes(v286.weapons[1]) ? v286.reloads[v286.weapons[1]] == 0 : true)) {
              v689.boostTickMovement();
            }
          }
          if (v286.weapons[1] && !v711.left && !v711.right && !v688.inTrap && !v689.isTrue && !v274.active) {
            if (v286.reloads[v286.weapons[0]] == 0 && v286.reloads[v286.weapons[1]] == 0) {
              if (!v293.reloaded) {
                v293.reloaded = true;
                let v895 = v680.weapons[v286.weapons[0]].spdMult < v680.weapons[v286.weapons[1]].spdMult ? 1 : 0;
                if (v286.weaponIndex != v286.weapons[v895] || v286.buildIndex > -1) {
                  f43(v286.weapons[v895]);
                }
              }
            } else {
              v293.reloaded = false;
              let v896 = [9, 12, 13, 15].includes(v286.weapons[1]);
              if (v896) {
                if (f110(v286.weapons[0])) {
                  if (f111(v286.weapons[0])) {
                    f43(v286.weapons[0]);
                  }
                } else if (f110(v286.weapons[1])) {
                  if (f111(v286.weapons[1])) {
                    f43(v286.weapons[1]);
                  }
                }
              } else if (f110(v286.weapons[1])) {
                if (f111(v286.weapons[1])) {
                  f43(v286.weapons[1]);
                }
              } else if (f110(v286.weapons[0])) {
                if (f111(v286.weapons[0])) {
                  f43(v286.weapons[0]);
                }
              }
            }
          }
          if (!v318.q && !v318.f && !v318.v && !v318.h && !v318.n) {
            f23("D", f74());
          }
          let vF15 = function () {
            if (v293.anti0Tick > 0 || v270) {
              f41(6, 0);
            } else if (f5("hatType").value == "ag" && v286.moveDir == null && Date.now() - v286.moveTime > 1357 && v286.health == 100 && Date.now() - v286.lastHit > 1357 && Date.now() - v286.lastGather > 1357) {
              f41(56, 0);
            } else if (v711.left || v711.right) {
              if (v711.left) {
                f41(v286.reloads[v286.weapons[0]] == 0 ? f5("weaponGrind").checked ? 40 : 7 : v286.tailIndex == 11 ? 7 : v286.empAnti || v286.antiTurretSpam ? 22 : v286.soldierAnti ? 6 : f5("antiBullType").value == "abreload" && v291.antiBull > 0 ? 11 : v291.dist2 <= 300 ? f5("antiBullType").value == "abalway" && v291.reloads[v291.primaryIndex] == 0 ? 11 : 6 : f55(1, 1), 0);
              } else if (v711.right) {
                f41(v286.reloads[v286.weapons[1] == 10 && vF20.hammerBreakerOptimisation ? v286.weapons[1] : v286.weapons[0]] == 0 && v454 != 40 ? 40 : v286.empAnti || v286.antiTurretSpam ? 22 : v286.soldierAnti ? 6 : f5("antiBullType").value == "abreload" && v291.antiBull > 0 ? 11 : v291.dist2 <= 300 ? f5("antiBullType").value == "abalway" && v291.reloads[v291.primaryIndex] == 0 ? 11 : 6 : f55(1, 1), 0);
              }
            } else if (v688.inTrap) {
              let v897 = v688.hasSpike && v681.hitsToBreak(v688.info[1], v286) <= v681.hitsToBreak(v688.info[0], v286) ? v688.info[1] : v688.info[0];
              if (v897.health <= v680.weapons[v688.notFast(v897) ? v286.weapons[1] : v286.weapons[0]].dmg && v897.active ? false : v286.reloads[v286.weapons[1] == 10 ? v286.weapons[1] : v286.weapons[0]] == 0 && v454 != 40) {
                f41(40, 0);
              } else if ((!v289.length || v286.mostDamageThreat < 95) && v286.shameCount > 0 && v286.skinIndex != 45 && Date.now() - v286.lastHit > 240 || v293.reSync) {
                f41(7, 0);
              } else {
                f41(v286.empAnti || v291.dist2 > 300 || !v289.length ? 22 : 6, 0);
              }
            } else if (v274.active) {
              if (v274.info.health > v680.weapons[v688.notFast(v274.info) ? v286.weapons[1] : v286.weapons[0]].dmg && v274.info.active && v286.reloads[v286.weapons[1] == 10 ? v286.weapons[1] : v286.weapons[0]] == 0 && v454 != 40) {
                f41(40, 0);
              } else if ((!v289.length || v286.mostDamageThreat < 95) && v286.shameCount > 0 && v286.skinIndex != 45 && Date.now() - v286.lastHit > 169 || v293.reSync) {
                f41(7, 0);
              } else {
                f41(v286.empAnti || v291.dist2 > 300 || !v289.length ? 22 : 6, 0);
              }
            } else if (v286.empAnti || v286.antiTurretSpam || v286.soldierAnti) {
              f41(v286.empAnti || v286.antiTurretSpam ? 22 : 6, 0);
            } else if ((!v289.length || v286.mostDamageThreat < 95) && v286.shameCount > 0 && v286.skinIndex != 45 && Date.now() - v286.lastHit > 169 && (v688.info[0] ? Date.now() - v688.info[0].breakTime > 169 : true) || v293.reSync) {
              f41(7, 0);
            } else if (v286.inWater) {
              if (!vF20.alwaysFlipper) {
                if (v291.dist2 <= 300) {
                  f41(f5("antiBullType").value == "abreload" && v291.antiBull > 0 ? 11 : f5("antiBullType").value == "abalway" && v291.reloads[v291.primaryIndex] == 0 ? 11 : 6, 0);
                } else {
                  f55(1);
                }
              } else {
                f55(1);
              }
            } else if (v291.dist2 <= 300) {
              f41(f5("antiBullType").value == "abreload" && v291.antiBull > 0 ? 11 : f5("antiBullType").value == "abalway" && v291.reloads[v291.primaryIndex] == 0 ? 11 : 6, 0);
            } else {
              f55(1);
            }
          };
          let vF16 = function () {
            if ((v711.left || v291.dist2 < 300) && v286.weapons[0] != 8 && (!v293.autoPush || !(v291.dist2 > 100))) {
              if (f5("antiBullType").value == "noab" || vF20.alwaysFlipper && v286.inWater) {
                f41(19, 1);
              } else {
                f41(21, 1);
              }
            } else {
              f41(11, 1);
            }
          };
          if (v11.style.display != "block" && !v689.isTrue && !v689.ticking) {
            vF15();
            vF16();
          }
          f85();
          if (!v293.safeWalk) {
            vF14();
            if (!v293.autoPush && !v272) {
              console.log(1);
              if (vF20.autoPlay && v289.length && v291.dist2 < v592.scale / 2) {
                console.log(2);
                let v898 = v692.calc({
                  x: Math.cos(v291.aim2 + Math.PI / 2) * (v291.scale * 2),
                  y: Math.sin(v291.aim2 + Math.PI / 2) * (v291.scale * 2)
                }, false, "follow");
                v592.paths = v898.paths;
                v592.attempts = v898.attempts;
                if (v592.paths.length > 0) {
                  console.log(3);
                  v592.finded = true;
                  let v899 = v679.getDirect(v592.paths[1], v286, 0, 2);
                  f23("f", v899, 1);
                } else {
                  console.log(4);
                  v898 = v692.calc({
                    x: 0,
                    y: 0
                  }, true, "follow");
                  v592.paths = v898.paths;
                  v592.attempts = v898.attempts;
                  if (v592.paths.length > 0) {
                    console.log(5);
                    v592.finded = true;
                    let v900 = v679.getDirect(v592.paths[1], v286, 0, 2);
                    f23("f", v900, 1);
                  } else {
                    console.log(6);
                    v592.finded = false;
                    f23("f", v286.moveDir, 1);
                  }
                }
              } else {
                console.log(7);
                v592.finded = false;
              }
            } else {
              console.log(8);
              v592.finded = false;
            }
          } else if (v293.autoPush) {
            v293.autoPush = false;
            f23("f", v286.moveDir, 1);
          }
          v689.ticking &&= false;
          v689.syncHit &&= false;
          v286.empAnti &&= false;
          if (v286.soldierAnti) {
            v286.soldierAnti = false;
          }
          if (v293.anti0Tick > 0) {
            v293.anti0Tick--;
          }
          v688.antiTrapped &&= false;
          v270 = false;
          v293.antiInsta = false;
        }
      }
    }
    let v901 = document.getElementById("leaderboard");
    let v902 = v901.firstChild;
    if (v902.nodeType === 3 && v902.textContent === "Leaderboard") {
      v901.removeChild(v902);
    }
    function f113(p750) {
      v321 = p750;
      v679.removeAllChildren(v26);
      let v903 = 1;
      let v904 = p750[2];
      for (let v905 = 0; v905 < p750.length; v905 += 3) {
        (function (p751) {
          let v906 = p750[p751 + 2];
          let v907 = v906 / v904 * 100;
          let v908 = document.createElement("div");
          v908.className = "leaderHolder";
          v908.style = "\n                background-color: rgba(0, 0, 0, 0.45);\n                height: 20px;\n                border-radius: 5px;\n                margin-bottom: 5px;\n            ";
          v26.appendChild(v908);
          let v909 = p750[p751];
          let v910 = document.createElement("div");
          v910.className = "leaderboardItem";
          v910.style = "\n                color: " + (v909 == v286.sid ? "#fffb95" : v799.includes(v909) ? "#FF0000" : v798.includes(v909) ? "#00ff00" : "#fff") + ";\n            ";
          v910.textContent = p750[p751 + 1] + ": " + (v679.sFormat(v906) || "0");
          v908.appendChild(v910);
          let v911 = document.createElement("div");
          v911.id = "leaderProsBar-" + p750[p751];
          v911.className = "leaderProgressBar";
          v911.style = "\n                margin-bottom: 5px;\n                display: block;\n                height: 20px;\n                border-radius: 5px;\n                background-color: #94e484;\n                width: " + v907 + "% ;\n                transition: width 0.5s ease-in-out;\n            ";
          v908.appendChild(v911);
          if (v911.style.width) {
            let vParseFloat = parseFloat(v911.style.width);
            let v912 = v907 + "%";
            v911.style.width = v912;
          } else {
            v911.style.width = v907 + "%";
          }
        })(v905);
        v903++;
      }
    }
    function f114(p752) {
      for (let v913 = 0; v913 < p752.length;) {
        v681.add(p752[v913], p752[v913 + 1], p752[v913 + 2], p752[v913 + 3], p752[v913 + 4], p752[v913 + 5], v680.list[p752[v913 + 6]], true, p752[v913 + 7] >= 0 ? {
          sid: p752[v913 + 7]
        } : null);
        v913 += 8;
      }
    }
    function f115(p753) {
      for (let v914 = 0; v914 < v277.length; ++v914) {
        v277[v914].forcePos = !v277[v914].visible;
        v277[v914].visible = false;
      }
      if (p753) {
        let v915 = performance.now();
        for (let v916 = 0; v916 < p753.length;) {
          v288 = f30(p753[v916]);
          if (v288) {
            v288.index = p753[v916 + 1];
            v288.t1 = v288.t2 === undefined ? v915 : v288.t2;
            v288.t2 = v915;
            v288.x1 = v288.x;
            v288.y1 = v288.y;
            v288.x2 = p753[v916 + 2];
            v288.y2 = p753[v916 + 3];
            v288.d1 = v288.d2 === undefined ? p753[v916 + 4] : v288.d2;
            v288.d2 = p753[v916 + 4];
            v288.health = p753[v916 + 5];
            v288.dt = 0;
            v288.visible = true;
          } else {
            v288 = v686.spawn(p753[v916 + 2], p753[v916 + 3], p753[v916 + 4], p753[v916 + 1]);
            v288.x2 = v288.x;
            v288.y2 = v288.y;
            v288.d2 = v288.dir;
            v288.health = p753[v916 + 5];
            if (!v686.aiTypes[p753[v916 + 1]].name) {
              v288.name = vP11.cowNames[p753[v916 + 6]];
            }
            v288.forcePos = true;
            v288.sid = p753[v916];
            v288.visible = true;
          }
          v916 += 7;
        }
      }
    }
    function f116(p754) {
      v288 = f30(p754);
      if (v288) {
        v288.startAnim();
      }
    }
    function f117(p755, p756, p757) {
      v288 = f29(p755);
      if (v288) {
        v288.startAnim(p756, p757);
        v288.gatherIndex = p757;
        v288.gathering = 1;
        v288.lastGather = Date.now();
        if (p756) {
          let v917 = v681.hitObj;
          v681.hitObj = [];
          v246.tickBase(() => {
            v288 = f29(p755);
            let v918 = v680.weapons[p757].dmg * vP11.weaponVariants[v288[(p757 < 9 ? "prima" : "seconda") + "ryVariant"]].val * (v680.weapons[p757].sDmg || 1) * (v288.skinIndex == 40 ? 3.3 : 1);
            v917.forEach(p758 => {
              p758.health -= v918;
            });
          }, 1);
        }
      }
    }
    function f118(p759, p760) {
      v288 = f31(p760);
      if (v288) {
        v288.xWiggle += vP11.gatherWiggle * Math.cos(p759);
        v288.yWiggle += vP11.gatherWiggle * Math.sin(p759);
        if (v288.health) {
          v681.hitObj.push(v288);
        }
      }
    }
    function f119(p761, p762) {
      v288 = f31(p761);
      if (v288) {
        if (vP11.anotherVisual) {
          v288.lastDir = p762;
        } else {
          v288.dir = p762;
        }
        v288.xWiggle += vP11.gatherWiggle * Math.cos(p762 + Math.PI);
        v288.yWiggle += vP11.gatherWiggle * Math.sin(p762 + Math.PI);
      }
    }
    function f120(p763, p764, p765) {
      if (v286) {
        v286[p763] = p764;
        if (p763 == "points") {
          if (vF20.autoBuy) {
            v690.buyNext();
          }
        } else if (p763 == "kills") {
          if (vF20.killChat) {
            f60("ezez blue legend best lolol");
          }
        }
      }
    }
    function f121(p766, p767) {
      if (p766) {
        if (p767) {
          v286.weapons = p766;
          v286.primaryIndex = v286.weapons[0];
          v286.secondaryIndex = v286.weapons[1];
          if (!v689.isTrue) {
            f43(v286.weapons[0]);
          }
        } else {
          v286.items = p766;
        }
      }
      for (let v919 = 0; v919 < v680.list.length; v919++) {
        let v920 = v680.weapons.length + v919;
        f5("actionBarItem" + v920).style.display = v286.items.indexOf(v680.list[v919].id) >= 0 ? "inline-block" : "none";
      }
      for (let v921 = 0; v921 < v680.weapons.length; v921++) {
        f5("actionBarItem" + v921).style.display = v286.weapons[v680.weapons[v921].type] == v680.weapons[v921].id ? "inline-block" : "none";
      }
      let v922 = v286.weapons[0] == 3 && v286.weapons[1] == 15;
      if (v922) {
        f5("actionBarItem3").style.display = "none";
        f5("actionBarItem4").style.display = "inline-block";
      }
    }
    function f122(p768, p769, p770, p771, p772, p773, p774, p775) {
      v685.addProjectile(p768, p769, p770, p771, p772, p773, null, null, p774, v322).sid = p775;
      v700.push(Array.prototype.slice.call(arguments));
    }
    function f123(p776, p777) {
      for (let v923 = 0; v923 < v283.length; ++v923) {
        if (v283[v923].sid == p776) {
          v283[v923].range = p777;
          let v924 = v681.hitObj;
          v681.hitObj = [];
          v246.tickBase(() => {
            let v925 = v283[v923].dmg;
            v924.forEach(p778 => {
              if (p778.projDmg) {
                p778.health -= v925;
              }
            });
          }, 1);
        }
      }
    }
    function f124(p779) {
      v17.innerHTML = "Server restarting in " + p779 + "s";
    }
    function f125(p780, p781) {}
    function f126(p782, p783) {
      if (v286) {
        v286.team = p782;
        v286.isOwner = p783;
        if (p782 == null) {
          v280 = [];
        }
      }
    }
    function f127(p784) {
      v280 = p784;
    }
    function f128(p785, p786, p787) {
      if (p787) {
        if (!p785) {
          v286.tails[p786] = 1;
        } else {
          v286.latestTail = p786;
        }
      } else if (!p785) {
        v286.skins[p786] = 1;
      } else {
        v286.latestSkin = p786;
      }
    }
    function f129(p788) {
      return p788 == v286 || p788.team && p788.team == v286.team;
    }
    function f130(p789, p790) {
      p790 = DOMPurify.sanitize(p790);
      let vF294 = f29(p789);
      if (vF294) {
        f21(vF294.name + " {" + vF294.sid + "}", p790, vF294 == v286 || vF294.team && vF294.team == v286.team ? "#8ecc51" : "#fff");
        vF294.chatMessage = p790;
        vF294.chatCountdown = vP11.chatCountdown;
        if (vF294.team == v286.team && p790 == f5("syncChat").value) {
          v689.musketSync();
        }
      }
    }
    function f131(p791) {
      v694 = p791;
    }
    function f132(p792, p793, p794, p795) {
      v687.showText(p792, p793, 50, 0.18, 500, Math.abs(p794), p794 >= 0 ? "#fff" : "#8ecc51");
    }
    function f133(p796, p797) {
      v687.showText(v286.x, v286.y, v286.scale, 0.1, p796, p797, "#fff");
    }
    function f134(p798, p799, p800, p801, p802) {
      let v926 = p798 + p800 * Math.cos(p801);
      let v927 = p799 + p800 * Math.sin(p801);
      let v928 = p800 * 0.4;
      p802.moveTo(p798, p799);
      p802.beginPath();
      p802.quadraticCurveTo((p798 + v926) / 2 + v928 * Math.cos(p801 + Math.PI / 2), (p799 + v927) / 2 + v928 * Math.sin(p801 + Math.PI / 2), v926, v927);
      p802.quadraticCurveTo((p798 + v926) / 2 - v928 * Math.cos(p801 + Math.PI / 2), (p799 + v927) / 2 - v928 * Math.sin(p801 + Math.PI / 2), p798, p799);
      p802.closePath();
      p802.fill();
      p802.stroke();
    }
    function f135(p803, p804) {
      if (v592.active) {
        p803.lineWidth = 6;
        p803.globalAlpha = 1;
        p803.beginPath();
        p803.strokeStyle = "#00ffff";
        p803.moveTo(v286.x - p804.x, v286.y - p804.y);
        let v929 = v592.paths.length;
        for (let v930 = 0; v930 < v929; v930++) {
          let v931 = v592.paths[v930];
          if (v931) {
            p803.lineTo(v931.x - p804.x, v931.y - p804.y);
          }
        }
        p803.stroke();
        if (v293.pushData) {
          p803.lineWidth = 6;
          p803.beginPath();
          p803.strokeStyle = "#fff";
          p803.moveTo(v592.paths[v592.paths.length - 1].x - p804.x, v592.paths[v592.paths.length - 1].y - p804.y);
          p803.lineTo(v293.pushData.x - p804.x, v293.pushData.y - p804.y);
          p803.stroke();
        }
      } else if (v293.autoPush) {
        p803.lineWidth = 6;
        p803.globalAlpha = 1;
        p803.beginPath();
        p803.strokeStyle = "#fff";
        p803.moveTo(v286.x - p804.x, v286.y - p804.y);
        p803.lineTo(v293.pushData.x - p804.x, v293.pushData.y - p804.y);
        p803.stroke();
      } else if (v592.finded) {
        p803.globalAlpha = 1;
        p803.lineWidth = 6;
        p803.beginPath();
        p803.strokeStyle = "#00ffff";
        p803.moveTo(v286.x - p804.x, v286.y - p804.y);
        let v932 = v592.paths.length;
        for (let v933 = 0; v933 < v932; v933++) {
          let v934 = v592.paths[v933];
          if (v934) {
            p803.lineTo(v934.x - p804.x, v934.y - p804.y);
          }
        }
        p803.stroke();
      }
    }
    function f136(p805, p806, p807, p808, p809, p810) {
      p808 = p808 || v62;
      p808.beginPath();
      p808.arc(p805, p806, p807, 0, Math.PI * 2);
      if (!p810) {
        p808.fill();
      }
      if (!p809) {
        p808.stroke();
      }
    }
    function f137(p811, p812, p813, p814, p815, p816) {
      p814 = p814 || v62;
      p814.beginPath();
      p814.arc(p811, p812, p813, 0, Math.PI * 2);
      if (!p816) {
        p814.fill();
      }
      if (!p815) {
        p814.stroke();
      }
    }
    function f138(p817, p818, p819, p820) {
      let v935 = Math.PI / 2 * 3;
      let v936;
      let v937;
      let v938 = Math.PI / p818;
      p817.beginPath();
      p817.moveTo(0, -p819);
      for (let v939 = 0; v939 < p818; v939++) {
        v936 = Math.cos(v935) * p819;
        v937 = Math.sin(v935) * p819;
        p817.lineTo(v936, v937);
        v935 += v938;
        v936 = Math.cos(v935) * p820;
        v937 = Math.sin(v935) * p820;
        p817.lineTo(v936, v937);
        v935 += v938;
      }
      p817.lineTo(0, -p819);
      p817.closePath();
    }
    function f139(p821, p822, p823, p824) {
      let v940 = Math.PI / 2 * 3;
      let v941;
      let v942;
      let v943 = Math.PI / p822;
      p821.beginPath();
      p821.moveTo(0, -p823);
      for (let v944 = 0; v944 < p822; v944++) {
        v941 = Math.cos(v940) * p823;
        v942 = Math.sin(v940) * p823;
        p821.lineTo(v941, v942);
        v940 += v943;
        v941 = Math.cos(v940) * p824;
        v942 = Math.sin(v940) * p824;
        p821.lineTo(v941, v942);
        v940 += v943;
      }
      p821.lineTo(0, -p823);
      p821.closePath();
    }
    function f140(p825, p826, p827, p828, p829, p830, p831) {
      if (!p831) {
        p829.fillRect(p825 - p827 / 2, p826 - p828 / 2, p827, p828);
      }
      if (!p830) {
        p829.strokeRect(p825 - p827 / 2, p826 - p828 / 2, p827, p828);
      }
    }
    function f141(p832, p833, p834, p835, p836, p837, p838) {
      if (!p838) {
        p836.fillRect(p832 - p834 / 2, p833 - p835 / 2, p834, p835);
      }
      if (!p837) {
        p836.strokeRect(p832 - p834 / 2, p833 - p835 / 2, p834, p835);
      }
    }
    function f142(p839, p840, p841, p842, p843, p844, p845, p846) {
      p844.save();
      p844.translate(p839, p840);
      p843 = Math.ceil(p843 / 2);
      for (let v945 = 0; v945 < p843; v945++) {
        f140(0, 0, p841 * 2, p842, p844, p845, p846);
        p844.rotate(Math.PI / p843);
      }
      p844.restore();
    }
    function f143(p847, p848, p849, p850) {
      let v946 = Math.PI / 2 * 3;
      let v947;
      let v948;
      let v949 = Math.PI / p848;
      let v950;
      p847.beginPath();
      p847.moveTo(0, -p850);
      for (let v951 = 0; v951 < p848; v951++) {
        v950 = v679.randInt(p849 + 0.9, p849 * 1.2);
        p847.quadraticCurveTo(Math.cos(v946 + v949) * v950, Math.sin(v946 + v949) * v950, Math.cos(v946 + v949 * 2) * p850, Math.sin(v946 + v949 * 2) * p850);
        v946 += v949 * 2;
      }
      p847.lineTo(0, -p850);
      p847.closePath();
    }
    function f144(p851, p852) {
      p852 = p852 || v62;
      let v952 = p851 * (Math.sqrt(3) / 2);
      p852.beginPath();
      p852.moveTo(0, -v952 / 2);
      p852.lineTo(-p851 / 2, v952 / 2);
      p852.lineTo(p851 / 2, v952 / 2);
      p852.lineTo(0, -v952 / 2);
      p852.fill();
      p852.closePath();
    }
    function f145(p853, p854, p855) {
      let v953 = p853.lineWidth || 0;
      let v954 = p855 / 2;
      p853.beginPath();
      let v955 = Math.PI * 2 / p854;
      for (let v956 = 0; v956 < p854; v956++) {
        let v957 = v954 + (v954 - v953 / 2) * Math.cos(v955 * v956);
        let v958 = v954 + (v954 - v953 / 2) * Math.sin(v955 * v956);
        p853.lineTo(v957, v958);
      }
      p853.closePath();
    }
    function f146() {
      var v959 = vP11.mapScale / 2;
      v681.add(0, v959, v959 + 200, 0, vP11.treeScales[3], 0);
      v681.add(1, v959, v959 - 480, 0, vP11.treeScales[3], 0);
      v681.add(2, v959 + 300, v959 + 450, 0, vP11.treeScales[3], 0);
      v681.add(3, v959 - 950, v959 - 130, 0, vP11.treeScales[2], 0);
      v681.add(4, v959 - 750, v959 - 400, 0, vP11.treeScales[3], 0);
      v681.add(5, v959 - 700, v959 + 400, 0, vP11.treeScales[2], 0);
      v681.add(6, v959 + 800, v959 - 200, 0, vP11.treeScales[3], 0);
      v681.add(7, v959 - 260, v959 + 340, 0, vP11.bushScales[3], 1);
      v681.add(8, v959 + 760, v959 + 310, 0, vP11.bushScales[3], 1);
      v681.add(9, v959 - 800, v959 + 100, 0, vP11.bushScales[3], 1);
      v681.add(10, v959 - 800, v959 + 300, 0, v680.list[4].scale, v680.list[4].id, v680.list[10]);
      v681.add(11, v959 + 650, v959 - 390, 0, v680.list[4].scale, v680.list[4].id, v680.list[10]);
      v681.add(12, v959 - 400, v959 - 450, 0, vP11.rockScales[2], 2);
    }
    const v960 = 35;
    function f147(p856, p857) {
      v62.fillStyle = "#91b2db";
      v284.filter(p858 => p858.active).forEach(p859 => {
        p859.animate(v299);
        v62.globalAlpha = p859.alpha;
        v62.strokeStyle = v309;
        v62.save();
        v62.translate(p859.x - p856, p859.y - p857);
        v62.rotate(p859.dir);
        v62.scale(p859.visScale / p859.scale, p859.visScale / p859.scale);
        f150(p859, v62);
        v62.restore();
        v62.font = "20px Ubuntu";
        let v961 = v62.measureText("imagine using fixed mod L");
        let v962 = 60;
        let v963 = v961.width + 10;
        v62.textBaseline = "middle";
        v62.textAlign = "center";
        v62.fillStyle = "#ccc";
        v62.strokeStyle = "#999";
        v62.roundRect(p859.x - p856 - v963 / 2, p859.y - p857 - v962 / 2 + p859.scale * 1.5, v963, v962, 6);
        v62.fill();
        v62.stroke();
        v62.fillStyle = "#fff";
        v62.strokeStyle = "#000";
        v62.strokeText("disney", p859.x - p856, p859.y + p859.scale * 1.5 - p857);
        v62.fillText("fixed", p859.x - p856, p859.y + p859.scale * 1.5 - p857);
        v62.strokeText(p859.name, p859.x - p856, p859.y + p859.scale * 1.5 + 20 - p857);
        v62.fillText(p859.name, p859.x - p856, p859.y + p859.scale * 1.5 + 20 - p857);
        v62.fillStyle = "#91b2db";
      });
    }
    function f148(p860, p861, p862, p863, p864, p865) {
      p863 = p863 || v62;
      p863.beginPath();
      p863.ellipse(p860, p861, p862 * 1.5, p862, Math.PI / 2, 0, Math.PI * 2);
      if (!p865) {
        p863.fill();
      }
      if (!p864) {
        p863.lineWidth = 3.5;
        p863.stroke();
      }
    }
    function f149(p866, p867, p868) {
      v62.globalAlpha = 1;
      v62.fillStyle = "#91b2db";
      for (var v964 = 0; v964 < v278.length; ++v964) {
        v288 = v278[v964];
        if (v288.zIndex == p868) {
          v288.animate(v299);
          if (v288.visible) {
            v288.skinRot += v299 * 0.002;
            v304 = !vF20.showDir && !v241 && v288 == v286 ? vF20.attackDir ? f75() : f71() : v288.dir || 0;
            v62.save();
            v62.translate(v288.x - p866, v288.y - p867);
            v62.rotate(v304 + v288.dirPlus);
            f151(v288, v62);
            v62.restore();
          }
        }
      }
    }
    function f150(p869, p870) {
      p870 = p870 || v62;
      p870.lineWidth = v311;
      p870.lineJoin = "miter";
      let v965 = Math.PI / 4 * (v680.weapons[p869.weaponIndex].armS || 1);
      let v966 = p869.buildIndex < 0 ? v680.weapons[p869.weaponIndex].hndS || 1 : 1;
      let v967 = p869.buildIndex < 0 ? v680.weapons[p869.weaponIndex].hndD || 1 : 1;
      if (p869.buildIndex < 0 && !v680.weapons[p869.weaponIndex].aboveHand) {
        f154(v680.weapons[p869.weaponIndex], vP11.weaponVariants[p869.weaponVariant].src, p869.scale, 0, p870);
        if (v680.weapons[p869.weaponIndex].projectile != undefined && !v680.weapons[p869.weaponIndex].hideProjectile) {
          f156(p869.scale, 0, v680.projectiles[v680.weapons[p869.weaponIndex].projectile], v62);
        }
      }
      p870.fillStyle = vP11.skinColors[p869.skinColor];
      f136(p869.scale * Math.cos(v965), p869.scale * Math.sin(v965), 14);
      f136(p869.scale * v967 * Math.cos(-v965 * v966), p869.scale * v967 * Math.sin(-v965 * v966), 14);
      if (p869.buildIndex < 0 && v680.weapons[p869.weaponIndex].aboveHand) {
        f154(v680.weapons[p869.weaponIndex], vP11.weaponVariants[p869.weaponVariant].src, p869.scale, 0, p870);
        if (v680.weapons[p869.weaponIndex].projectile != undefined && !v680.weapons[p869.weaponIndex].hideProjectile) {
          f156(p869.scale, 0, v680.projectiles[v680.weapons[p869.weaponIndex].projectile], v62);
        }
      }
      if (p869.buildIndex >= 0) {
        var v_0x3e3113 = f160(v680.list[p869.buildIndex]);
        p870.drawImage(v_0x3e3113, p869.scale - v680.list[p869.buildIndex].holdOffset, -v_0x3e3113.width / 2);
      }
      f136(0, 0, p869.scale, p870);
      p870.lineWidth = 2;
      p870.fillStyle = "#555";
      p870.font = "35px Hammersmith One";
      p870.textBaseline = "middle";
      p870.textAlign = "center";
      p870.fillText("(", 20, 5);
      p870.rotate(Math.PI / 2);
      p870.font = "30px Hammersmith One";
      p870.fillText("X", -15, 15 / 2);
      p870.fillText("D", 15, 15 / 2);
    }
    function f151(p871, p872) {
      p872 = p872 || v62;
      p872.lineWidth = v311;
      p872.lineJoin = "miter";
      let v968 = Math.PI / 4 * (v680.weapons[p871.weaponIndex].armS || 1);
      let v969 = p871.buildIndex < 0 ? v680.weapons[p871.weaponIndex].hndS || 1 : 1;
      let v970 = p871.buildIndex < 0 ? v680.weapons[p871.weaponIndex].hndD || 1 : 1;
      let v971 = p871 == v278 && p871.weapons[0] == 3 && p871.weapons[1] == 15;
      if (p871.tailIndex > 0) {
        f153(p871.tailIndex, p872, p871);
      }
      if (p871.buildIndex < 0 && !v680.weapons[p871.weaponIndex].aboveHand) {
        f154(v680.weapons[v971 ? 4 : p871.weaponIndex], vP11.weaponVariants[p871.weaponVariant].src, p871.scale, 0, p872);
        if (v680.weapons[p871.weaponIndex].projectile != undefined && !v680.weapons[p871.weaponIndex].hideProjectile) {
          f156(p871.scale, 0, v680.projectiles[v680.weapons[p871.weaponIndex].projectile], v62);
        }
      }
      p872.fillStyle = vP11.skinColors[p871.skinColor];
      f136(p871.scale * Math.cos(v968), p871.scale * Math.sin(v968), 14);
      f136(p871.scale * v970 * Math.cos(-v968 * v969), p871.scale * v970 * Math.sin(-v968 * v969), 14);
      if (p871.buildIndex < 0 && v680.weapons[p871.weaponIndex].aboveHand) {
        f154(v680.weapons[p871.weaponIndex], vP11.weaponVariants[p871.weaponVariant].src, p871.scale, 0, p872);
        if (v680.weapons[p871.weaponIndex].projectile != undefined && !v680.weapons[p871.weaponIndex].hideProjectile) {
          f156(p871.scale, 0, v680.projectiles[v680.weapons[p871.weaponIndex].projectile], v62);
        }
      }
      if (p871.buildIndex >= 0) {
        var v_0x3e31132 = f160(v680.list[p871.buildIndex]);
        p872.drawImage(v_0x3e31132, p871.scale - v680.list[p871.buildIndex].holdOffset, -v_0x3e31132.width / 2);
      }
      f136(0, 0, p871.scale, p872);
      if (p871.skinIndex > 0) {
        p872.rotate(Math.PI / 2);
        f152(p871.skinIndex, p872, null, p871);
      }
    }
    let v972 = {};
    let v973 = {};
    let v974;
    function f152(p873, p874, p875, p876) {
      v974 = v972[p873];
      if (!v974) {
        let v975 = new Image();
        v975.onload = function () {
          this.isLoaded = true;
          this.onload = null;
        };
        v975.src = "https://moomoo.io/img/hats/hat_" + p873 + ".png";
        v972[p873] = v975;
        v974 = v975;
      }
      let v976 = p875 || v973[p873];
      if (!v976) {
        for (let v977 = 0; v977 < v683.length; ++v977) {
          if (v683[v977].id == p873) {
            v976 = v683[v977];
            break;
          }
        }
        v973[p873] = v976;
      }
      if (v974.isLoaded) {
        p874.drawImage(v974, -v976.scale / 2, -v976.scale / 2, v976.scale, v976.scale);
      }
      if (!p875 && v976.topSprite) {
        p874.save();
        p874.rotate(p876.skinRot);
        f152(p873 + "_top", p874, v976, p876);
        p874.restore();
      }
    }
    let v978 = {};
    let v979 = {};
    function f153(p877, p878, p879) {
      v974 = v978[p877];
      if (!v974) {
        let v980 = new Image();
        v980.onload = function () {
          this.isLoaded = true;
          this.onload = null;
        };
        v980.src = "https://moomoo.io/img/accessories/access_" + p877 + ".png";
        v978[p877] = v980;
        v974 = v980;
      }
      let v981 = v979[p877];
      if (!v981) {
        for (let v982 = 0; v982 < v684.length; ++v982) {
          if (v684[v982].id == p877) {
            v981 = v684[v982];
            break;
          }
        }
        v979[p877] = v981;
      }
      if (v974.isLoaded) {
        p878.save();
        p878.translate(-20 - (v981.xOff || 0), 0);
        if (v981.spin) {
          p878.rotate(p879.skinRot);
        }
        p878.drawImage(v974, -(v981.scale / 2), -(v981.scale / 2), v981.scale, v981.scale);
        p878.restore();
      }
    }
    let v983 = {};
    function f154(p880, p881, p882, p883, p884) {
      let v984 = p880.src + (p881 || "");
      let v985 = v983[v984];
      if (!v985) {
        v985 = new Image();
        v985.onload = function () {
          this.isLoaded = true;
        };
        v985.src = "https://moomoo.io/img/weapons/" + v984 + ".png";
        v983[v984] = v985;
      }
      if (v985.isLoaded) {
        p884.drawImage(v985, p882 + p880.xOff - p880.length / 2, p883 + p880.yOff - p880.width / 2, p880.length, p880.width);
      }
    }
    function f155(p885, p886, p887) {
      for (let v986 = 0; v986 < v283.length; v986++) {
        v288 = v283[v986];
        if (v288.active && v288.layer == p885 && v288.inWindow) {
          v288.update(v299);
          if (v288.active && f167(v288.x - p886, v288.y - p887, v288.scale)) {
            v62.save();
            v62.translate(v288.x - p886, v288.y - p887);
            v62.rotate(v288.dir);
            f156(0, 0, v288, v62, 1);
            v62.restore();
          }
        }
      }
      ;
    }
    let v987 = {};
    function f156(p888, p889, p890, p891, p892) {
      if (p890.src) {
        let v988 = v680.projectiles[p890.indx].src;
        let v989 = v987[v988];
        if (!v989) {
          v989 = new Image();
          v989.onload = function () {
            this.isLoaded = true;
          };
          v989.src = "https://moomoo.io/img/weapons/" + v988 + ".png";
          v987[v988] = v989;
        }
        if (v989.isLoaded) {
          p891.drawImage(v989, p888 - p890.scale / 2, p889 - p890.scale / 2, p890.scale, p890.scale);
        }
      } else if (p890.indx == 1) {
        p891.fillStyle = "#939393";
        f136(p888, p889, p890.scale, p891);
      }
    }
    let v990 = {};
    function f157(p893, p894) {
      let v991 = p893.index;
      let v992 = v990[v991];
      if (!v992) {
        let v993 = new Image();
        v993.onload = function () {
          this.isLoaded = true;
          this.onload = null;
        };
        v993.src = "https://moomoo.io/img/animals/" + p893.src + ".png";
        v992 = v993;
        v990[v991] = v992;
      }
      if (v992.isLoaded) {
        let v994 = p893.scale * 1.2 * (p893.spriteMlt || 1);
        p894.drawImage(v992, -v994, -v994, v994 * 2, v994 * 2);
      }
    }
    function f158(p895, p896, p897, p898) {
      let v995 = vP11.riverWidth + p898;
      let v996 = vP11.mapScale / 2 - p896 - v995 / 2;
      if (v996 < v297 && v996 + v995 > 0) {
        p897.fillRect(0, v996, v296, v995);
      }
    }
    let v997 = {};
    function f159(p899) {
      let v998 = p899.y >= vP11.mapScale - vP11.snowBiomeTop ? 2 : p899.y <= vP11.snowBiomeTop ? 1 : 0;
      let v999 = p899.type + "_" + p899.scale + "_" + v998;
      let v1000 = v997[v999];
      if (!v1000) {
        let v1001 = 15;
        let v1002 = document.createElement("canvas");
        v1002.width = v1002.height = p899.scale * 2.1 + v311;
        let v1003 = v1002.getContext("2d");
        v1003.translate(v1002.width / 2, v1002.height / 2);
        v1003.rotate(v679.randFloat(0, Math.PI));
        v1003.strokeStyle = v309;
        v1003.lineWidth = v311;
        if (p899.type == 0) {
          let v1004;
          let v1005 = v679.randInt(5, 7);
          v1003.globalAlpha = v312 ? 0.6 : 0.8;
          for (let v1006 = 0; v1006 < 2; ++v1006) {
            v1004 = v288.scale * (!v1006 ? 1 : 0.5);
            f138(v1003, v1005, v1004, v1004 * 0.7);
            v1003.fillStyle = !v998 ? !v1006 ? "#9ebf57" : "#b4db62" : !v1006 ? "#e3f1f4" : "#fff";
            v1003.fill();
            if (!v1006) {
              v1003.stroke();
              v1003.shadowBlur = null;
              v1003.shadowColor = null;
              v1003.globalAlpha = 1;
            }
          }
        } else if (p899.type == 1) {
          if (v998 == 2) {
            v1003.fillStyle = "#606060";
            f138(v1003, 6, p899.scale * 0.3, p899.scale * 0.71);
            v1003.fill();
            v1003.stroke();
            v1003.fillStyle = "#89a54c";
            f136(0, 0, p899.scale * 0.55, v1003);
            v1003.fillStyle = "#a5c65b";
            f136(0, 0, p899.scale * 0.3, v1003, true);
          } else {
            f143(v1003, 6, v288.scale, v288.scale * 0.7);
            v1003.fillStyle = v998 ? "#e3f1f4" : "#89a54c";
            v1003.fill();
            v1003.stroke();
            v1003.fillStyle = v998 ? "#6a64af" : "#c15555";
            let v1007;
            let v1008 = 4;
            let v1009 = Math.PI * 2 / v1008;
            for (let v1010 = 0; v1010 < v1008; ++v1010) {
              v1007 = v679.randInt(v288.scale / 3.5, v288.scale / 2.3);
              f136(v1007 * Math.cos(v1009 * v1010), v1007 * Math.sin(v1009 * v1010), v679.randInt(10, 12), v1003);
            }
          }
        } else if (p899.type == 2 || p899.type == 3) {
          v1003.fillStyle = p899.type == 2 ? v998 == 2 ? "#938d77" : "#939393" : "#e0c655";
          f138(v1003, 3, p899.scale, p899.scale);
          v1003.fill();
          v1003.stroke();
          v1003.shadowBlur = null;
          v1003.shadowColor = null;
          v1003.fillStyle = p899.type == 2 ? v998 == 2 ? "#b2ab90" : "#bcbcbc" : "#ebdca3";
          f138(v1003, 3, p899.scale * 0.55, p899.scale * 0.65);
          v1003.fill();
        }
        v1000 = v1002;
        v997[v999] = v1000;
      }
      return v1000;
    }
    let v1011 = [];
    function f160(p900, p901) {
      let v1012 = v1011[p900.id];
      if (!v1012 || p901) {
        let v1013 = !p901 && v312 ? 15 : 0;
        let v1014 = document.createElement("canvas");
        let v1015 = !p901 && p900.name == "windmill" ? v680.list[4].scale : p900.scale;
        v1014.width = v1014.height = v1015 * 2.5 + v311 + (v680.list[p900.id].spritePadding || 0) + v1013;
        if (vP11.useWebGl) {
          let v1016 = v1014.getContext("webgl");
          v1016.clearColor(0, 0, 0, 0);
          v1016.clear(v1016.COLOR_BUFFER_BIT);
          let v1017 = v1016.createBuffer();
          v1016.bindBuffer(v1016.ARRAY_BUFFER, v1017);
          function f161(p902, p903, p904, p905) {
            let v1018 = v1016.createShader(v1016.VERTEX_SHADER);
            v1016.shaderSource(v1018, p902);
            v1016.compileShader(v1018);
            v1016.getShaderParameter(v1018, v1016.COMPILE_STATUS);
            let v1019 = v1016.createShader(v1016.FRAGMENT_SHADER);
            v1016.shaderSource(v1019, p903);
            v1016.compileShader(v1019);
            v1016.getShaderParameter(v1019, v1016.COMPILE_STATUS);
            let v1020 = v1016.createProgram();
            v1016.attachShader(v1020, v1018);
            v1016.attachShader(v1020, v1019);
            v1016.linkProgram(v1020);
            v1016.getProgramParameter(v1020, v1016.LINK_STATUS);
            v1016.useProgram(v1020);
            let v1021 = v1016.getAttribLocation(v1020, "vertex");
            v1016.enableVertexAttribArray(v1021);
            v1016.vertexAttribPointer(v1021, 2, v1016.FLOAT, false, 0, 0);
            let v1022 = p904.length / 2;
            v1016.bufferData(v1016.ARRAY_BUFFER, new Float32Array(p904), v1016.DYNAMIC_DRAW);
            v1016.drawArrays(p905, 0, v1022);
          }
          function f162(p906) {
            return p906.slice(1).match(/.{1,2}/g).map(p907 => parseInt(p907, 16));
          }
          function f163(p908, p909, p910) {
            return [p908 / 255, p909 / 255, p910 / 255].join(", ");
          }
          let v1023 = 100;
          for (let v1024 = 0; v1024 < v1023; v1024++) {
            let v1025 = Math.PI * (v1024 / (v1023 / 2));
            f161("\n                            precision mediump float;\n                            attribute vec2 vertex;\n                            void main(void) {\n                                gl_Position = vec4(vertex, 0, 1);\n                            }\n                            ", "\n                            precision mediump float;\n                            void main(void) {\n                                gl_FragColor = vec4(" + f163(...f162("#fff")) + ", 1);\n                            }\n                            ", [0 + Math.cos(v1025) * 0.5, 0 + Math.sin(v1025) * 0.5, 0, 0], v1016.LINE_LOOP);
          }
        } else {
          let v1026 = v1014.getContext("2d");
          v1026.translate(v1014.width / 2, v1014.height / 2);
          v1026.rotate(p901 ? 0 : Math.PI / 2);
          v1026.strokeStyle = v309;
          v1026.lineWidth = v311 * (p901 ? v1014.width / 81 : 1);
          if (p900.name == "apple") {
            v1026.fillStyle = "#c15555";
            f136(0, 0, p900.scale, v1026);
            v1026.fillStyle = "#89a54c";
            let v1027 = -(Math.PI / 2);
            f134(p900.scale * Math.cos(v1027), p900.scale * Math.sin(v1027), 25, v1027 + Math.PI / 2, v1026);
          } else if (p900.name == "cookie") {
            v1026.fillStyle = "#cca861";
            f136(0, 0, p900.scale, v1026);
            v1026.fillStyle = "#937c4b";
            let v1028 = 4;
            let v1029 = Math.PI * 2 / v1028;
            let v1030;
            for (let v1031 = 0; v1031 < v1028; ++v1031) {
              v1030 = v679.randInt(p900.scale / 2.5, p900.scale / 1.7);
              f136(v1030 * Math.cos(v1029 * v1031), v1030 * Math.sin(v1029 * v1031), v679.randInt(4, 5), v1026, true);
            }
          } else if (p900.name == "cheese") {
            v1026.fillStyle = "#f4f3ac";
            f136(0, 0, p900.scale, v1026);
            v1026.fillStyle = "#c3c28b";
            let v1032 = 4;
            let v1033 = Math.PI * 2 / v1032;
            let v1034;
            for (let v1035 = 0; v1035 < v1032; ++v1035) {
              v1034 = v679.randInt(p900.scale / 2.5, p900.scale / 1.7);
              f136(v1034 * Math.cos(v1033 * v1035), v1034 * Math.sin(v1033 * v1035), v679.randInt(4, 5), v1026, true);
            }
          } else if (p900.name == "wood wall" || p900.name == "stone wall" || p900.name == "castle wall") {
            v1026.fillStyle = p900.name == "castle wall" ? "#83898e" : p900.name == "wood wall" ? "#a5974c" : "#939393";
            let v1036 = p900.name == "castle wall" ? 4 : 3;
            f138(v1026, v1036, p900.scale * 1.1, p900.scale * 1.1);
            v1026.fill();
            v1026.stroke();
            v1026.fillStyle = p900.name == "castle wall" ? "#9da4aa" : p900.name == "wood wall" ? "#c9b758" : "#bcbcbc";
            f138(v1026, v1036, p900.scale * 0.65, p900.scale * 0.65);
            v1026.fill();
          } else if (p900.name == "spikes" || p900.name == "greater spikes" || p900.name == "poison spikes" || p900.name == "spinning spikes") {
            v1026.fillStyle = p900.name == "poison spikes" ? "#7b935d" : "#939393";
            let v1037 = p900.scale * 0.6;
            f138(v1026, p900.name == "spikes" ? 5 : 6, p900.scale, v1037);
            v1026.fill();
            v1026.stroke();
            v1026.fillStyle = "#a5974c";
            f136(0, 0, v1037, v1026);
            v1026.fillStyle = "#c9b758";
            f136(0, 0, v1037 / 2, v1026, true);
          } else if (p900.name == "windmill" || p900.name == "faster windmill" || p900.name == "power mill") {
            v1026.fillStyle = "#a5974c";
            f136(0, 0, v1015, v1026);
            v1026.fillStyle = "#c9b758";
            f142(0, 0, v1015 * 1.5, 29, 4, v1026);
            v1026.fillStyle = "#a5974c";
            f136(0, 0, v1015 * 0.5, v1026);
          } else if (p900.name == "mine") {
            v1026.fillStyle = "#939393";
            f138(v1026, 3, p900.scale, p900.scale);
            v1026.fill();
            v1026.stroke();
            v1026.fillStyle = "#bcbcbc";
            f138(v1026, 3, p900.scale * 0.55, p900.scale * 0.65);
            v1026.fill();
          } else if (p900.name == "sapling") {
            for (let v1038 = 0; v1038 < 2; ++v1038) {
              let v1039 = p900.scale * (!v1038 ? 1 : 0.5);
              f138(v1026, 7, v1039, v1039 * 0.7);
              v1026.fillStyle = !v1038 ? "#9ebf57" : "#b4db62";
              v1026.fill();
              if (!v1038) {
                v1026.stroke();
              }
            }
          } else if (p900.name == "pit trap") {
            v1026.fillStyle = "#a5974c";
            f138(v1026, 3, p900.scale * 1.1, p900.scale * 1.1);
            v1026.fill();
            v1026.stroke();
            v1026.fillStyle = v309;
            f138(v1026, 3, p900.scale * 0.65, p900.scale * 0.65);
            v1026.fill();
          } else if (p900.name == "boost pad") {
            v1026.fillStyle = "#7e7f82";
            f140(0, 0, p900.scale * 2, p900.scale * 2, v1026);
            v1026.fill();
            v1026.stroke();
            v1026.fillStyle = "#dbd97d";
            f144(p900.scale * 1, v1026);
          } else if (p900.name == "turret") {
            v1026.fillStyle = "#a5974c";
            f136(0, 0, p900.scale, v1026);
            v1026.fill();
            v1026.stroke();
            v1026.fillStyle = "#939393";
            let v1040 = 50;
            f140(0, -v1040 / 2, p900.scale * 0.9, v1040, v1026);
            f136(0, 0, p900.scale * 0.6, v1026);
            v1026.fill();
            v1026.stroke();
          } else if (p900.name == "platform") {
            v1026.fillStyle = "#cebd5f";
            let v1041 = 4;
            let v1042 = p900.scale * 2;
            let v1043 = v1042 / v1041;
            let v1044 = -(p900.scale / 2);
            for (let v1045 = 0; v1045 < v1041; ++v1045) {
              f140(v1044 - v1043 / 2, 0, v1043, p900.scale * 2, v1026);
              v1026.fill();
              v1026.stroke();
              v1044 += v1042 / v1041;
            }
          } else if (p900.name == "healing pad") {
            v1026.fillStyle = "#7e7f82";
            f140(0, 0, p900.scale * 2, p900.scale * 2, v1026);
            v1026.fill();
            v1026.stroke();
            v1026.fillStyle = "#db6e6e";
            f142(0, 0, p900.scale * 0.65, 20, 4, v1026, true);
          } else if (p900.name == "spawn pad") {
            v1026.fillStyle = "#7e7f82";
            f140(0, 0, p900.scale * 2, p900.scale * 2, v1026);
            v1026.fill();
            v1026.stroke();
            v1026.fillStyle = "#71aad6";
            f136(0, 0, p900.scale * 0.6, v1026);
          } else if (p900.name == "blocker") {
            v1026.fillStyle = "#7e7f82";
            f136(0, 0, p900.scale, v1026);
            v1026.fill();
            v1026.stroke();
            v1026.rotate(Math.PI / 4);
            v1026.fillStyle = "#db6e6e";
            f142(0, 0, p900.scale * 0.65, 20, 4, v1026, true);
          } else if (p900.name == "teleporter") {
            v1026.fillStyle = "#7e7f82";
            f136(0, 0, p900.scale, v1026);
            v1026.fill();
            v1026.stroke();
            v1026.rotate(Math.PI / 4);
            v1026.fillStyle = "#d76edb";
            f136(0, 0, p900.scale * 0.5, v1026, true);
          }
        }
        v1012 = v1014;
        if (!p901) {
          v1011[p900.id] = v1012;
        }
      }
      return v1012;
    }
    function f164(p911, p912, p913) {
      let vV62 = v62;
      let v1046 = p911.name == "windmill" ? v680.list[4].scale : p911.scale;
      vV62.save();
      vV62.translate(p912, p913);
      vV62.rotate(p911.dir);
      vV62.strokeStyle = v309;
      vV62.lineWidth = v311;
      if (p911.name == "apple") {
        vV62.fillStyle = "#c15555";
        f136(0, 0, p911.scale, vV62);
        vV62.fillStyle = "#89a54c";
        let v1047 = -(Math.PI / 2);
        f134(p911.scale * Math.cos(v1047), p911.scale * Math.sin(v1047), 25, v1047 + Math.PI / 2, vV62);
      } else if (p911.name == "cookie") {
        vV62.fillStyle = "#cca861";
        f136(0, 0, p911.scale, vV62);
        vV62.fillStyle = "#937c4b";
        let v1048 = 4;
        let v1049 = Math.PI * 2 / v1048;
        let v1050;
        for (let v1051 = 0; v1051 < v1048; ++v1051) {
          v1050 = v679.randInt(p911.scale / 2.5, p911.scale / 1.7);
          f136(v1050 * Math.cos(v1049 * v1051), v1050 * Math.sin(v1049 * v1051), v679.randInt(4, 5), vV62, true);
        }
      } else if (p911.name == "cheese") {
        vV62.fillStyle = "#f4f3ac";
        f136(0, 0, p911.scale, vV62);
        vV62.fillStyle = "#c3c28b";
        let v1052 = 4;
        let v1053 = Math.PI * 2 / v1052;
        let v1054;
        for (let v1055 = 0; v1055 < v1052; ++v1055) {
          v1054 = v679.randInt(p911.scale / 2.5, p911.scale / 1.7);
          f136(v1054 * Math.cos(v1053 * v1055), v1054 * Math.sin(v1053 * v1055), v679.randInt(4, 5), vV62, true);
        }
      } else if (p911.name == "wood wall" || p911.name == "stone wall" || p911.name == "castle wall") {
        vV62.fillStyle = p911.name == "castle wall" ? "#83898e" : p911.name == "wood wall" ? "#a5974c" : "#939393";
        let v1056 = p911.name == "castle wall" ? 4 : 3;
        f138(vV62, v1056, p911.scale * 1.1, p911.scale * 1.1);
        vV62.fill();
        vV62.stroke();
        vV62.fillStyle = p911.name == "castle wall" ? "#9da4aa" : p911.name == "wood wall" ? "#c9b758" : "#bcbcbc";
        f138(vV62, v1056, p911.scale * 0.65, p911.scale * 0.65);
        vV62.fill();
      } else if (p911.name == "spikes" || p911.name == "greater spikes" || p911.name == "poison spikes" || p911.name == "spinning spikes") {
        vV62.fillStyle = p911.name == "poison spikes" ? "#7b935d" : "#939393";
        let v1057 = p911.scale * 0.6;
        f138(vV62, p911.name == "spikes" ? 5 : 6, p911.scale, v1057);
        vV62.fill();
        vV62.stroke();
        vV62.fillStyle = "#a5974c";
        f136(0, 0, v1057, vV62);
        vV62.fillStyle = "#c9b758";
        f136(0, 0, v1057 / 2, vV62, true);
      } else if (p911.name == "windmill" || p911.name == "faster windmill" || p911.name == "power mill") {
        vV62.fillStyle = "#a5974c";
        f136(0, 0, v1046, vV62);
        vV62.fillStyle = "#c9b758";
        f142(0, 0, v1046 * 1.5, 29, 4, vV62);
        vV62.fillStyle = "#a5974c";
        f136(0, 0, v1046 * 0.5, vV62);
      } else if (p911.name == "mine") {
        vV62.fillStyle = "#939393";
        f138(vV62, 3, p911.scale, p911.scale);
        vV62.fill();
        vV62.stroke();
        vV62.fillStyle = "#bcbcbc";
        f138(vV62, 3, p911.scale * 0.55, p911.scale * 0.65);
        vV62.fill();
      } else if (p911.name == "sapling") {
        for (let v1058 = 0; v1058 < 2; ++v1058) {
          let v1059 = p911.scale * (!v1058 ? 1 : 0.5);
          f138(vV62, 7, v1059, v1059 * 0.7);
          vV62.fillStyle = !v1058 ? "#9ebf57" : "#b4db62";
          vV62.fill();
          if (!v1058) {
            vV62.stroke();
          }
        }
      } else if (p911.name == "pit trap") {
        vV62.fillStyle = "#a5974c";
        f138(vV62, 3, p911.scale * 1.1, p911.scale * 1.1);
        vV62.fill();
        vV62.stroke();
        vV62.fillStyle = v309;
        f138(vV62, 3, p911.scale * 0.65, p911.scale * 0.65);
        vV62.fill();
      } else if (p911.name == "boost pad") {
        vV62.fillStyle = "#7e7f82";
        f140(0, 0, p911.scale * 2, p911.scale * 2, vV62);
        vV62.fill();
        vV62.stroke();
        vV62.fillStyle = "#dbd97d";
        f144(p911.scale * 1, vV62);
      } else if (p911.name == "turret") {
        vV62.fillStyle = "#a5974c";
        f136(0, 0, p911.scale, vV62);
        vV62.fill();
        vV62.stroke();
        vV62.fillStyle = "#939393";
        let v1060 = 50;
        f140(0, -v1060 / 2, p911.scale * 0.9, v1060, vV62);
        f136(0, 0, p911.scale * 0.6, vV62);
        vV62.fill();
        vV62.stroke();
      } else if (p911.name == "platform") {
        vV62.fillStyle = "#cebd5f";
        let v1061 = 4;
        let v1062 = p911.scale * 2;
        let v1063 = v1062 / v1061;
        let v1064 = -(p911.scale / 2);
        for (let v1065 = 0; v1065 < v1061; ++v1065) {
          f140(v1064 - v1063 / 2, 0, v1063, p911.scale * 2, vV62);
          vV62.fill();
          vV62.stroke();
          v1064 += v1062 / v1061;
        }
      } else if (p911.name == "healing pad") {
        vV62.fillStyle = "#7e7f82";
        f140(0, 0, p911.scale * 2, p911.scale * 2, vV62);
        vV62.fill();
        vV62.stroke();
        vV62.fillStyle = "#db6e6e";
        f142(0, 0, p911.scale * 0.65, 20, 4, vV62, true);
      } else if (p911.name == "spawn pad") {
        vV62.fillStyle = "#7e7f82";
        f140(0, 0, p911.scale * 2, p911.scale * 2, vV62);
        vV62.fill();
        vV62.stroke();
        vV62.fillStyle = "#71aad6";
        f136(0, 0, p911.scale * 0.6, vV62);
      } else if (p911.name == "blocker") {
        vV62.fillStyle = "#7e7f82";
        f136(0, 0, p911.scale, vV62);
        vV62.fill();
        vV62.stroke();
        vV62.rotate(Math.PI / 4);
        vV62.fillStyle = "#db6e6e";
        f142(0, 0, p911.scale * 0.65, 20, 4, vV62, true);
      } else if (p911.name == "teleporter") {
        vV62.fillStyle = "#7e7f82";
        f136(0, 0, p911.scale, vV62);
        vV62.fill();
        vV62.stroke();
        vV62.rotate(Math.PI / 4);
        vV62.fillStyle = "#d76edb";
        f136(0, 0, p911.scale * 0.5, vV62, true);
      }
      vV62.restore();
    }
    let v1066 = [];
    function f165(p914) {
      let v1067 = v1066[p914.id];
      if (!v1067) {
        let v1068 = v312 ? 15 : 0;
        let v1069 = document.createElement("canvas");
        v1069.width = v1069.height = p914.scale * 2.5 + v311 + (v680.list[p914.id].spritePadding || 0) + v1068;
        let v1070 = v1069.getContext("2d");
        v1070.translate(v1069.width / 2, v1069.height / 2);
        v1070.rotate(Math.PI / 2);
        v1070.strokeStyle = v309;
        v1070.lineWidth = v311;
        if (v312) {
          v1070.shadowBlur = v1068;
          v1070.shadowColor = "rgba(0, 0, 0, " + Math.min(0.3, p914.alpha) + ")";
        }
        if (p914.name == "spikes" || p914.name == "greater spikes" || p914.name == "poison spikes" || p914.name == "spinning spikes") {
          v1070.fillStyle = p914.name == "poison spikes" ? "#7b935d" : "#939393";
          let v1071 = p914.scale * 0.6;
          f138(v1070, p914.name == "spikes" ? 5 : 6, p914.scale, v1071);
          v1070.fill();
          v1070.stroke();
          v1070.fillStyle = "#a5974c";
          f136(0, 0, v1071, v1070);
          v1070.fillStyle = "#cc5151";
          f136(0, 0, v1071 / 2, v1070, true);
        } else if (p914.name == "pit trap") {
          v1070.fillStyle = "#a5974c";
          f138(v1070, 3, p914.scale * 1.1, p914.scale * 1.1);
          v1070.fill();
          v1070.stroke();
          v1070.fillStyle = "#cc5151";
          f138(v1070, 3, p914.scale * 0.65, p914.scale * 0.65);
          v1070.fill();
        }
        v1067 = v1069;
        v1066[p914.id] = v1067;
      }
      return v1067;
    }
    function f166(p915, p916, p917, p918, p919) {
      p916.lineWidth = v311;
      p916.globalAlpha = 1;
      p916.strokeStyle = v309;
      p916.save();
      p916.translate(p917, p918);
      p916.rotate(p915.dir);
      if (p919) {
        p916.globalAlpha = 0.6;
        p916.fillStyle = "rgba(0, 255, 255, 0.6)";
        f136(0, 0, v288.scale, p916);
        p916.fill();
        p916.stroke();
      } else if (p915.name == "wood wall" || p915.name == "stone wall" || p915.name == "castle wall") {
        let v1072 = p915.name == "castle wall" ? 4 : 3;
        f139(p916, v1072, p915.scale * 1.1, p915.scale * 1.1);
        p916.stroke();
      } else if (p915.name == "spikes" || p915.name == "greater spikes" || p915.name == "poison spikes" || p915.name == "spinning spikes") {
        let v1073 = p915.scale * 0.6;
        f139(p916, p915.name == "spikes" ? 5 : 6, p915.scale, v1073);
        p916.stroke();
      } else if (p915.name == "windmill" || p915.name == "faster windmill" || p915.name == "power mill") {
        f137(0, 0, p915.scale, p916, false, true);
      } else if (p915.name == "mine") {
        f139(p916, 3, p915.scale, p915.scale);
        p916.stroke();
      } else if (p915.name == "sapling") {
        let v1074 = p915.scale * 0.7;
        f139(p916, 7, p915.scale, v1074);
        p916.stroke();
      } else if (p915.name == "pit trap") {
        f139(p916, 3, p915.scale * 1.1, p915.scale * 1.1);
        p916.stroke();
      } else if (p915.name == "boost pad") {
        f141(0, 0, p915.scale * 2, p915.scale * 2, p916, false, true);
      } else if (p915.name == "turret") {
        f137(0, 0, p915.scale, p916, false, true);
      } else if (p915.name == "platform") {
        f141(0, 0, p915.scale * 2, p915.scale * 2, p916, false, true);
      } else if (p915.name == "healing pad") {
        f141(0, 0, p915.scale * 2, p915.scale * 2, p916, false, true);
      } else if (p915.name == "spawn pad") {
        f141(0, 0, p915.scale * 2, p915.scale * 2, p916, false, true);
      } else if (p915.name == "blocker") {
        f137(0, 0, p915.scale, p916, false, true);
      } else if (p915.name == "teleporter") {
        f137(0, 0, p915.scale, p916, false, true);
      }
      p916.restore();
    }
    function f167(p920, p921, p922) {
      return p920 + p922 >= 0 && p920 - p922 <= v296 && p921 + p922 >= 0 && (p921, p922, v297);
    }
    function f168() {
      let v1075 = vP11.volcanoScale * 2;
      let v1076 = document.createElement("canvas");
      v1076.width = v1075;
      v1076.height = v1075;
      let v1077 = v1076.getContext("2d");
      v1077.strokeStyle = "#3e3e3e";
      v1077.lineWidth = 11;
      v1077.fillStyle = "#7f7f7f";
      f145(v1077, 10, v1075);
      v1077.fill();
      v1077.stroke();
      vV271.land = v1076;
      let v1078 = document.createElement("canvas");
      let v1079 = vP11.innerVolcanoScale * 2;
      v1078.width = v1079;
      v1078.height = v1079;
      let v1080 = v1078.getContext("2d");
      v1080.strokeStyle = "#525252";
      v1080.lineWidth = 8.8;
      v1080.fillStyle = "#f54e16";
      v1080.strokeStyle = "#f56f16";
      f145(v1080, 10, v1079);
      v1080.fill();
      v1080.stroke();
      vV271.lava = v1078;
    }
    f168();
    function f169() {
      let vVUndefined3 = vUndefined3;
      let vVUndefined4 = vUndefined4;
      vV271.animationTime += v299;
      vV271.animationTime %= vP11.volcanoAnimationDuration;
      let v1081 = vP11.volcanoAnimationDuration / 2;
      let v1082 = 1.7 + Math.abs(v1081 - vV271.animationTime) / v1081 * 0.3;
      let v1083 = vP11.innerVolcanoScale * v1082;
      v62.drawImage(vV271.land, vV271.x - vP11.volcanoScale - vVUndefined3, vV271.y - vP11.volcanoScale - vVUndefined4, vP11.volcanoScale * 2, vP11.volcanoScale * 2);
      v62.drawImage(vV271.lava, vV271.x - v1083 - vVUndefined3, vV271.y - v1083 - vVUndefined4, v1083 * 2, v1083 * 2);
    }
    function f170(p923, p924, p925) {
      let v1084;
      let v1085;
      let v1086;
      v282.forEach(p926 => {
        v288 = p926;
        if (v288.alive) {
          v1085 = v288.x + v288.xWiggle - p924;
          v1086 = v288.y + v288.yWiggle - p925;
          if (p923 == 0) {
            v288.update(v299);
          }
          v62.globalAlpha = v288.alpha;
          if (v288.layer == p923 && f167(v1085, v1086, v288.scale + (v288.blocker || 0))) {
            if (v288.isItem) {
              if ((v288.dmg || v288.trap) && !v288.isTeamObject(v286)) {
                v1084 = f165(v288);
              } else {
                v1084 = f160(v288);
              }
              v62.save();
              v62.translate(v1085, v1086);
              v62.rotate(v288.dir);
              if (!v288.active) {
                v62.scale(v288.visScale / v288.scale, v288.visScale / v288.scale);
              }
              if (!v288.hideFromEnemy) {
                v62.globalAlpha = 1;
              }
              v62.drawImage(v1084, -(v1084.width / 2), -(v1084.height / 2));
              if (v288.blocker) {
                v62.strokeStyle = "#db6e6e";
                v62.globalAlpha = 0.3;
                v62.lineWidth = 6;
                f136(0, 0, v288.blocker, v62, false, true);
              }
              v62.restore();
            } else if (v288.type == 4) {
              f169();
            } else {
              v1084 = f159(v288);
              v62.drawImage(v1084, v1085 - v1084.width / 2, v1086 - v1084.height / 2);
            }
          }
          if (p923 == 3 && !v241) {
            if (v288.health < v288.maxHealth) {
              v62.fillStyle = v310;
              v62.roundRect(v1085 - vP11.healthBarWidth / 2 - vP11.healthBarPad, v1086 - vP11.healthBarPad, vP11.healthBarWidth + vP11.healthBarPad * 2, 17, 8);
              v62.fill();
              v62.fillStyle = v288.isTeamObject(v286) ? "#8ecc51" : "#cc5151";
              v62.roundRect(v1085 - vP11.healthBarWidth / 2, v1086, vP11.healthBarWidth * (v288.health / v288.maxHealth), 17 - vP11.healthBarPad * 2, 7);
              v62.fill();
            }
          }
        }
      });
      if (p923 == 0) {
        if (v323.length) {
          v323.forEach(p927 => {
            v1085 = p927.x - p924;
            v1086 = p927.y - p925;
            f171(p927, v1085, v1086);
          });
        }
        if (v324.length) {
          v324.forEach(p928 => {
            v1085 = p928.x - p924;
            v1086 = p928.y - p925;
            f172(p928, v1085, v1086);
          });
        }
        if (v325.length) {
          v325.forEach(p929 => {
            v1085 = p929.x - p924;
            v1086 = p929.y - p925;
            f173(p929, v1085, v1086);
          });
        }
      }
    }
    function f171(p930, p931, p932) {
      f166(p930, v62, p931, p932);
    }
    function f172(p933, p934, p935) {
      f174(v62, p934, p935);
    }
    function f173(p936, p937, p938) {
      f175(v62, p937, p938);
    }
    function f174(p939, p940, p941) {
      p939.fillStyle = "rgba(0, 255, 255, 0.4)";
      p939.beginPath();
      p939.arc(p940, p941, 55, 0, Math.PI * 2);
      p939.fill();
      p939.closePath();
    }
    function f175(p942, p943, p944) {
      p942.fillStyle = "rgba(255, 0, 0, 0.4)";
      p942.beginPath();
      p942.arc(p943, p944, 55, 0, Math.PI * 2);
      p942.fill();
      p942.closePath();
    }
    class C26 {
      constructor(p945, p946) {
        this.init = function (p947, p948) {
          this.scale = 0;
          this.x = p947;
          this.y = p948;
          this.active = true;
        };
        this.update = function (p949, p950) {
          if (this.active) {
            this.scale += p950 * 0.05;
            if (this.scale >= p946) {
              this.active = false;
            } else {
              p949.globalAlpha = 1 - Math.max(0, this.scale / p946);
              p949.beginPath();
              p949.arc(this.x / vP11.mapScale * v15.width, this.y / vP11.mapScale * v15.width, this.scale, 0, Math.PI * 2);
              p949.stroke();
            }
          }
        };
        this.color = p945;
      }
    }
    function f176(p951, p952) {
      v697 = v696.find(p953 => !p953.active);
      if (!v697) {
        v697 = new C26("#fff", vP11.mapPingScale);
        v696.push(v697);
      }
      v697.init(p951, p952);
    }
    function f177() {
      v695.x = v286.x;
      v695.y = v286.y;
    }
    function f178(p954) {
      if (v286 && v286.alive) {
        v16.clearRect(0, 0, v15.width, v15.height);
        v16.lineWidth = 4;
        for (let v1087 = 0; v1087 < v696.length; ++v1087) {
          v697 = v696[v1087];
          v16.strokeStyle = v697.color;
          v697.update(v16, p954);
        }
        v16.globalAlpha = 1;
        v16.fillStyle = "#ff0000";
        if (v698.length) {
          v16.fillStyle = "#abcdef";
          v16.font = "34px Hammersmith One";
          v16.textBaseline = "middle";
          v16.textAlign = "center";
          for (let v1088 = 0; v1088 < v698.length;) {
            v16.fillText("!", v698[v1088].x / vP11.mapScale * v15.width, v698[v1088].y / vP11.mapScale * v15.height);
            v1088 += 2;
          }
        }
        v16.globalAlpha = 1;
        v16.fillStyle = "#fff";
        f136(v286.x / vP11.mapScale * v15.width, v286.y / vP11.mapScale * v15.height, 7, v16, true);
        v16.fillStyle = "rgba(255,255,255,0.35)";
        if (v286.team && v694) {
          for (let v1089 = 0; v1089 < v694.length;) {
            f136(v694[v1089] / vP11.mapScale * v15.width, v694[v1089 + 1] / vP11.mapScale * v15.height, 7, v16, true);
            v1089 += 2;
          }
        }
        if (v693) {
          v16.fillStyle = "#fc5553";
          v16.font = "34px Hammersmith One";
          v16.textBaseline = "middle";
          v16.textAlign = "center";
          v16.fillText("x", v693.x / vP11.mapScale * v15.width, v693.y / vP11.mapScale * v15.height);
        }
        if (v695) {
          v16.fillStyle = "#fff";
          v16.font = "34px Hammersmith One";
          v16.textBaseline = "middle";
          v16.textAlign = "center";
          v16.fillText("x", v695.x / vP11.mapScale * v15.width, v695.y / vP11.mapScale * v15.height);
        }
      }
    }
    let v1090 = ["https://upload.wikimedia.org/wikipedia/commons/9/95/Crosshairs_Red.svg", "https://upload.wikimedia.org/wikipedia/commons/9/95/Crosshairs_Red.svg"];
    let v1091 = {};
    let v1092 = {};
    let v1093 = ["crown", "skull"];
    function f179() {
      for (let v1094 = 0; v1094 < v1093.length; ++v1094) {
        let v1095 = new Image();
        v1095.onload = function () {
          this.isLoaded = true;
        };
        v1095.src = "./../img/icons/" + v1093[v1094] + ".png";
        v1092[v1093[v1094]] = v1095;
      }
      for (let v1096 = 0; v1096 < v1090.length; ++v1096) {
        let v1097 = new Image();
        v1097.onload = function () {
          this.isLoaded = true;
        };
        v1097.src = v1090[v1096];
        v1091[v1096] = v1097;
      }
    }
    f179();
    function f180(p955) {
      var v1098 = Math.abs(p955.x - v286.x) - p955.scale;
      var v1099 = Math.abs(p955.y - v286.y) - p955.scale;
      var v1100 = v296 / 2 * 1.3;
      var v1101 = v297 / 2 * 1.3;
      return v1098 <= v1100 && v1099 <= v1101;
    }
    function f181(p956, p957, p958, p959, p960) {
      this.startX = p956;
      this.startY = p957;
      this.endX = p958;
      this.distance = p959;
      this.float = p960;
      this.amountPaths = Math.ceil(this.endX / this.distance);
      this.path = new Map();
      this.generate = function () {
        for (let v1102 = 1; v1102 <= this.amountPaths; v1102 += 1) {
          const v1103 = v1102 % 2 === 0 ? this.distance : 0;
          const v1104 = this.startX + this.distance * (v1102 - 1);
          const v1105 = Math.floor(Math.random() * 35) + 10;
          const v1106 = this.startY + ((this.float === "down" ? v1103 : -v1103) + (v1102 % 2 === 0 ? Math.random() < 0.55 ? v1105 : -v1105 : 0));
          this.path.set(v1102, [v1104, v1106, v1103, v1105]);
        }
      };
      this.render = function (p961, p962, p963) {
        const v1107 = Array.from(this.path.values());
        if (!v286?.active || !v286?.alive) {
          return;
        }
        for (let v1108 = 1; v1108 < v1107.length; v1108++) {
          const v1109 = v1107[v1108 - 1];
          const v1110 = v1107[v1108];
          const v1111 = {
            x: v1109[0],
            y: v1109[1],
            scale: 10
          };
          if (!f180(v1111)) {
            continue;
          }
          const v1112 = {
            x: v1110[0],
            y: v1110[1],
            scale: 10
          };
          if (!f180(v1112)) {
            continue;
          }
          const v1113 = this.distance / 2;
          const v1114 = [v1109[0] - v1113 / 2, v1109[1] + (v1109[2] === 0 ? v1113 : -v1113)];
          const v1115 = [v1110[0] + v1113 * 1.15, v1110[1] + v1113 * 1.2];
          const v1116 = [v1110[0] + v1113 * 1.35, v1110[1] - v1113 * 1.15];
          const v1117 = [v1110[0] - v1113 * 1.35, v1110[1] + v1113 * 1.15];
          v62.save();
          v62.fillStyle = p961;
          v62.lineCap = "round";
          v62.lineJoin = "round";
          v62.beginPath();
          v62.moveTo(v1109[0] - p962, v1109[1] - p963);
          v62.lineTo(v1109[0] + this.distance * 2 - p962, this.startY - p963);
          v62.lineTo(v1110[0] - p962, v1110[1] - p963);
          v62.fill();
          v62.beginPath();
          v62.moveTo(v1109[0] - p962, v1109[1] - p963);
          v62.bezierCurveTo(v1114[0] - p962, v1114[1] - p963, v1115[0] - p962, v1115[1] - p963, v1110[0] + (v1110[3] >= 10 ? 3.5 : 1) - p962, v1110[1] - p963);
          v62.fill();
          v62.beginPath();
          v62.moveTo(v1110[0] - p962, v1110[1] - p963);
          v62.bezierCurveTo(v1115[0] - p962, v1115[1] - p963, v1116[0] - p962, v1116[1] - p963, v1110[0] + this.distance * 2 - p962, this.startY - p963);
          v62.fill();
          v62.restore();
        }
      };
      return this.generate();
    }
    const v1118 = new f181(-v296, vP11.snowBiomeTop - 1, vP11.mapScale + v296 * 2, 50, "down");
    const v1119 = new f181(-v296, vP11.mapScale - vP11.snowBiomeTop + 1, vP11.mapScale + v296 * 2, 50, "up");
    let vF17 = () => {
      let v1120 = document.querySelectorAll(".snowflake");
      v1120.forEach(p964 => p964.remove());
    };
    let vF18 = function () {
      let v1121 = document.createElement("div");
      v1121.className = "snowflake";
      v1121.style = "\n        position: absolute;\n        width: 10px;\n        height: 10px;\n        background: #fff;\n        border-radius: 50%;\n        z-index: 9998;\n        opacity: " + Math.random() + ";\n        left: " + Math.random() * 100 + "vw;\n        animation: fall " + (Math.random() * 3 + 2) + "s linear infinite;\n    ";
      v1121.addEventListener("animationiteration", function () {
        v1121.style.left = Math.random() * 100 + "vw";
        v1121.style.opacity = Math.random();
      });
      return v1121;
    };
    let v1122 = document.createElement("style");
    v1122.textContent = "\n    @keyframes fall {\n        0% { transform: translateY(-10vh); opacity: 1; }\n        100% { transform: translateY(110vh); opacity: 0; }\n    }\n    .fast-fall { animation-duration: " + (Math.random() * 1 + 1) + "s; }\n";
    document.head.appendChild(v1122);
    let v1123 = document.createElement("div");
    v1123.style = "\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    pointer-events: none;\n    z-index: 9998;\n    display: none;\n";
    document.body.appendChild(v1123);
    let v1125 = {
      isEnabled: false,
      overlay: {
        opacity: 0,
        r: 0,
        g: 0,
        b: 0
      },
      starField: []
    };
    let v1126 = 0;
    let vF21 = (p965, p966, p967, p968) => {
      v1125.overlay.opacity = v1125.isEnabled ? Math.min(0.5, v1125.overlay.opacity + 0.001) : Math.max(0, v1125.overlay.opacity - 0.001);
      if (v1125.overlay.opacity > 0) {
        if (v1125.overlay.opacity > 0.3 && v1126 > 300) {
          v1126 = 0;
          let v1127 = v679.randInt(3, 5);
          for (let v1128 = 0; v1128 < v1127; v1128++) {
            let v1129 = v679.randFloat(1, 3);
          }
        } else {
          v1126 += p966;
        }
        p965.globalAlpha = v1125.overlay.opacity;
        p965.fillStyle = "rgb(" + v1125.overlay.r + ", " + v1125.overlay.g + ", " + v1125.overlay.b + ")";
        p965.fillRect(0, 0, v296, v297);
      }
      v1125.starField = v1125.starField.filter(p969 => p969.visible);
      for (let v1130 = 0; v1130 < v1125.starField.length; v1130++) {
        let v1131 = v1125.starField[v1130];
        if (v1131.brightening) {
          v1131.transparency = Math.min(1, v1131.transparency + 0.02);
          if (v1131.transparency >= 1) {
            v1131.brightening = false;
          }
        } else {
          v1131.transparency = Math.max(0, v1131.transparency - 0.02);
          if (v1131.transparency <= 0) {
            v1131.visible = false;
          }
        }
        let vF22 = (p970, p971) => {
          p970.beginPath();
          p970.moveTo(0, -p971);
          for (let v1132 = 1; v1132 < 8; v1132++) {
            let v1133 = Math.PI / 4 * v1132;
            let v1134 = v1132 % 2 === 0 ? p971 : p971 / 2;
            p970.lineTo(Math.sin(v1133) * v1134, -Math.cos(v1133) * v1134);
          }
          p970.closePath();
        };
        p965.save();
        p965.globalAlpha = v1131.transparency;
        p965.translate(v1131.posX - p967 * v1131.scaleMultiplier, v1131.posY - p968 * v1131.scaleMultiplier);
        p965.scale(v1131.size, v1131.size);
        vF22(p965, 3);
        p965.fillStyle = v1131.color;
        p965.fill();
        p965.restore();
      }
    };
    let v1135 = 1;
    let v1136 = Date.now();
    function f182() {
      v1125.isEnabled = !v1125.isEnabled;
      if (v1125.isEnabled) {
        v221.style.animationName = "night1";
        v221.style.opacity = 0.35;
        v221.style.display = "block";
      } else {
        v221.style.animationName = "night2";
        v221.style.opacity = 0;
        setTimeout(() => {
          v221.style.display = "none";
        }, parseFloat(v221.style.animationDuration) * 1000);
      }
    }
    setInterval(() => {
      if (!v1136 || Date.now() - v1136 >= 240000) {
        v1135 = !v1135;
        v1136 = Date.now();
        f182();
      }
    }, 1000);
    window.toggleNight = function () {
      clearTimeout(v1212);
      f182();
      v1135 = !v1135;
      v1136 = Date.now();
    };
    function f183() {
      vF13();
      if (vP11.resetRender) {
        v62.clearRect(0, 0, v13.width, v13.height);
        v62.beginPath();
      }
      let v1137 = {
        width: 1920,
        height: 1080
      };
      if (true) {
        if (f5("camSexy").checked) {
          if (v286) {
            let v1138;
            let v1139;
            let v1140 = 0.1;
            let v1141 = 0;
            let v1142 = v286.x;
            let v1143 = v286.y;
            if (v289.length) {
              if (v291.dist2 <= 650) {
                v1141 = (650 - v291.dist2) / 650;
                v1142 = v286.x2 + (v291.x2 - v286.x2) * v1141;
                v1143 = v286.y2 + (v291.y2 - v286.y2) * v1141;
              }
            }
            v1138 = v1137.width;
            v1139 = v1137.height;
            if (v1141 === 0) {
              v1138 *= 1.2;
              v1139 *= 1.4;
            }
            v302 = (v302 * 24 + v1142) / 25;
            v303 = (v303 * 24 + v1143) / 25;
            v302 = Math.max(540, Math.min(13840, v302));
            v303 = Math.max(200, Math.min(14240, v303));
            v296 += (v1138 - v296) * v1140;
            v297 += (v1139 - v297) * v1140;
            f64();
          } else {
            v302 = Math.max(540, Math.min(13840, vP11.mapScale / 2));
            v303 = Math.max(200, Math.min(14240, vP11.mapScale / 2));
            f64();
          }
        } else if (v286) {
          if (false) {
            v302 = v286.x;
            v303 = v286.y;
          } else {
            let v1144 = v679.getDistance(v302, v303, v286.x, v286.y);
            let v1145 = v679.getDirection(v286.x, v286.y, v302, v303);
            let v1146 = Math.min(v1144 * 0.01 * v299, v1144);
            if (v1144 > 0.05) {
              v302 += v1146 * Math.cos(v1145);
              v303 += v1146 * Math.sin(v1145);
            } else {
              v302 = v286.x;
              v303 = v286.y;
            }
          }
        } else {
          v302 = vP11.mapScale / 2 + vP11.riverWidth;
          v303 = vP11.mapScale / 2;
        }
        let v1147 = v300 - 1000 / vP11.serverUpdateRate;
        let v1148;
        for (let v1149 = 0; v1149 < v278.length + v277.length; ++v1149) {
          v288 = v278[v1149] || v277[v1149 - v278.length];
          if (v288 && v288.visible) {
            if (v288.forcePos) {
              v288.x = v288.x2;
              v288.y = v288.y2;
              v288.dir = v288.d2;
            } else {
              let v1150 = v288.t2 - v288.t1;
              let v1151 = v1147 - v288.t1;
              let v1152 = v1151 / v1150;
              let v1153 = 170;
              v288.dt += v299;
              let v1154 = Math.min(1.7, v288.dt / v1153);
              v1148 = v288.x2 - v288.x1;
              v288.x = v288.x1 + v1148 * v1154;
              v1148 = v288.y2 - v288.y1;
              v288.y = v288.y1 + v1148 * v1154;
              v288.dir = Math.lerpAngle(v288.d2, v288.d1, Math.min(1.2, v1152));
            }
          }
        }
        let v1156 = v302 - v296 / 2;
        let v1157 = v303 - v297 / 2;
        vUndefined3 = v1156;
        vUndefined4 = v1157;
        if (vP11.snowBiomeTop - v1157 <= 0 && vP11.mapScale - vP11.snowBiomeTop - v1157 >= v297) {
          v62.fillStyle = "#b6db66";
          v62.fillRect(0, 0, v296, v297);
        } else if (vP11.mapScale - vP11.snowBiomeTop - v1157 <= 0) {
          v62.fillStyle = "#dbc666";
          v62.fillRect(0, 0, v296, v297);
        } else if (vP11.snowBiomeTop - v1157 >= v297) {
          v62.fillStyle = "#fff";
          v62.fillRect(0, 0, v296, v297);
        } else if (vP11.snowBiomeTop - v1157 >= 0) {
          v62.fillStyle = "#fff";
          v62.fillRect(0, 0, v296, vP11.snowBiomeTop - v1157);
          v62.fillStyle = "#b6db66";
          v62.fillRect(0, vP11.snowBiomeTop - v1157, v296, v297 - (vP11.snowBiomeTop - v1157));
        } else {
          v62.fillStyle = "#b6db66";
          v62.fillRect(0, 0, v296, vP11.mapScale - vP11.snowBiomeTop - v1157);
          v62.fillStyle = "#dbc666";
          v62.fillRect(0, vP11.mapScale - vP11.snowBiomeTop - v1157, v296, v297 - (vP11.mapScale - vP11.snowBiomeTop - v1157));
          v1119.render("#b6db66", v1156, v1157);
        }
        if (!v313) {
          v307 += v308 * vP11.waveSpeed * v299;
          if (v307 >= vP11.waveMax) {
            v307 = vP11.waveMax;
            v308 = -1;
          } else if (v307 <= 1) {
            v307 = v308 = 1;
          }
          v62.globalAlpha = 1;
          v62.fillStyle = "#dbc666";
          f158(v1156, v1157, v62, vP11.riverPadding);
          v62.fillStyle = "#91b2db";
          f158(v1156, v1157, v62, (v307 - 1) * 250);
        }
        if (v286) {
          if (v286.alive) {
            f95(v288, v1156, v1157);
          }
          if (v693) {
            v62.globalAlpha = 1;
            v62.fillStyle = "#fc5553";
            v62.font = "100px Hammersmith One";
            v62.textBaseline = "middle";
            v62.textAlign = "center";
            v62.fillText("x", v693.x - v1156, v693.y - v1157);
          }
        }
        v62.globalAlpha = 1;
        v62.strokeStyle = v309;
        f147(v1156, v1157);
        v62.globalAlpha = 1;
        v62.strokeStyle = v309;
        f170(-1, v1156, v1157);
        v62.globalAlpha = 1;
        v62.lineWidth = v311;
        f155(0, v1156, v1157);
        f149(v1156, v1157, 0);
        v62.globalAlpha = 1;
        for (let v1158 = 0; v1158 < v277.length; ++v1158) {
          v288 = v277[v1158];
          if (v288.active && v288.visible) {
            v288.animate(v299);
            v62.save();
            v62.translate(v288.x - v1156, v288.y - v1157);
            v62.rotate(v288.dir + v288.dirPlus - Math.PI / 2);
            f157(v288, v62);
            v62.restore();
          }
        }
        f170(0, v1156, v1157);
        f155(1, v1156, v1157);
        f170(1, v1156, v1157);
        f149(v1156, v1157, 1);
        f170(2, v1156, v1157);
        f170(3, v1156, v1157);
        v62.fillStyle = "#000";
        v62.globalAlpha = 0.09;
        if (v1156 <= 0) {
          v62.fillRect(0, 0, -v1156, v297);
        }
        if (vP11.mapScale - v1156 <= v296) {
          let v1159 = Math.max(0, -v1157);
          v62.fillRect(vP11.mapScale - v1156, v1159, v296 - (vP11.mapScale - v1156), v297 - v1159);
        }
        if (v1157 <= 0) {
          v62.fillRect(-v1156, 0, v296 + v1156, -v1157);
        }
        if (vP11.mapScale - v1157 <= v297) {
          let v1160 = Math.max(0, -v1156);
          let v1161 = 0;
          if (vP11.mapScale - v1156 <= v296) {
            v1161 = v296 - (vP11.mapScale - v1156);
          }
          v62.fillRect(v1160, vP11.mapScale - v1157, v296 - v1160 - v1161, v297 - (vP11.mapScale - v1157));
        }
        v62.globalAlpha = 1;
        v62.fillStyle = "rgba(0, 0, 70, 0.35)";
        v62.fillRect(0, 0, v296, v297);
        v62.strokeStyle = v310;
        v62.globalAlpha = 1;
        for (let v1162 = 0; v1162 < v278.length + v277.length; ++v1162) {
          v288 = v278[v1162] || v277[v1162 - v278.length];
          if (v288.visible) {
            v62.strokeStyle = v310;
            if (v288.skinIndex != 10 || v288 == v286 || v288.team && v288.team == v286.team) {
              let v1163 = (v288.team ? "[" + v288.team + "] " : "") + (v288.name || "") + (v288.isPlayer ? " {" + v288.sid + "}" : "");
              if (v1163 != "") {
                v62.font = (v288.nameScale || 30) + "px Hammersmith One";
                v62.fillStyle = v288.isPlayer ? v799.includes(v288.sid) ? "#FF0000" : v798.includes(v288.sid) ? "#00ff00" : "#fff" : "#fff";
                v62.textBaseline = "middle";
                v62.textAlign = "center";
                v62.lineWidth = v288.nameScale ? 11 : 8;
                v62.lineJoin = "round";
                v62.strokeText(v1163, v288.x - v1156, v288.y - v1157 - v288.scale - vP11.nameY);
                v62.fillText(v1163, v288.x - v1156, v288.y - v1157 - v288.scale - vP11.nameY);
                if (v288.isLeader && v1092.crown.isLoaded) {
                  let v1164 = vP11.crownIconScale;
                  let v1165 = v288.x - v1156 - v1164 / 2 - v62.measureText(v1163).width / 2 - vP11.crownPad;
                  v62.drawImage(v1092.crown, v1165, v288.y - v1157 - v288.scale - vP11.nameY - v1164 / 2 - 5, v1164, v1164);
                }
                if (v288.iconIndex == 1 && v1092.skull.isLoaded) {
                  let v1166 = vP11.crownIconScale;
                  let v1167 = v288.x - v1156 - v1166 / 2 + v62.measureText(v1163).width / 2 + vP11.crownPad;
                  v62.drawImage(v1092.skull, v1167, v288.y - v1157 - v288.scale - vP11.nameY - v1166 / 2 - 5, v1166, v1166);
                }
                if (v288.isPlayer && v689.wait && v291 == v288 && (v288.backupNobull ? v1091[1].isLoaded : v1091[0].isLoaded) && v289.length && !v241) {
                  let v1168 = v288.scale * 2.2;
                  v62.drawImage(v288.backupNobull ? v1091[1] : v1091[0], v288.x - v1156 - v1168 / 2, v288.y - v1157 - v1168 / 2, v1168, v1168);
                }
              }
              if (v288.health > 0) {
                let v1169 = v288.prevHW || vP11.healthBarWidth * 2 * (v288.health / v288.maxHealth);
                v62.fillStyle = v310;
                v62.roundRect(v288.x - v1156 - vP11.healthBarWidth - vP11.healthBarPad, v288.y - v1157 + v288.scale + vP11.nameY, vP11.healthBarWidth * 2 + vP11.healthBarPad * 2, 17, 8);
                v62.fill();
                let v1170 = vP11.healthBarWidth * 2 * (v288.health / v288.maxHealth);
                if (v288.prevHW !== undefined) {
                  v288.prevDW = v288.prevDW || v288.prevHW;
                  v288.prevDW += (v1170 - v288.prevDW) * 0.03;
                }
                v1169 += (v1170 - v1169) * 0.2;
                v288.prevHW = v1169;
                v62.fillStyle = v288 == v286 || v288.team && v288.team == v286.team ? "#FF6666" : "#FFFF66";
                v62.roundRect(v288.x - v1156 - vP11.healthBarWidth, v288.y - v1157 + v288.scale + vP11.nameY + vP11.healthBarPad, v288.prevDW, 17 - vP11.healthBarPad * 2, 7);
                v62.fill();
                v62.fillStyle = v288 == v286 || v288.team && v288.team == v286.team ? "#8ecc51" : "#cc5151";
                v62.roundRect(v288.x - v1156 - vP11.healthBarWidth, v288.y - v1157 + v288.scale + vP11.nameY + vP11.healthBarPad, v1169, 17 - vP11.healthBarPad * 2, 7);
                v62.fill();
                if (v288.isPlayer) {
                  v62.globalAlpha = 1;
                  if (v288 == v286) {}
                  v62.globalAlpha = 1;
                  v62.font = "20px Hammersmith One";
                  v62.fillStyle = "#fff";
                  v62.strokeStyle = v310;
                  v62.textBaseline = "middle";
                  v62.textAlign = "center";
                  v62.lineWidth = 8;
                  v62.lineJoin = "round";
                  let v1171 = [];
                  if (v288 == v286) {
                    if (f5("visualType").value == "ueh1") {
                      v1171 = [v288.oldSkinIndex, v288.skinIndex];
                      v62.strokeText("[" + v1171.join(",") + "]", v288.x - v1156, v288.y - v1157 + v288.scale + vP11.nameY + 27);
                      v62.fillText("[" + v1171.join(",") + "]", v288.x - v1156, v288.y - v1157 + v288.scale + vP11.nameY + 27);
                    }
                  } else {
                    v1171 = [v288.primaryIndex, v288.secondaryIndex || 0, v679.fixTo(v288.damageThreat, 2)];
                    v62.strokeText("[" + v1171.join(",") + "]", v288.x - v1156, v288.y - v1157 + v288.scale + vP11.nameY + 27);
                    v62.fillText("[" + v1171.join(",") + "]", v288.x - v1156, v288.y - v1157 + v288.scale + vP11.nameY + 27);
                  }
                  v62.globalAlpha = 1;
                  v62.font = "30px Hammersmith One";
                  v62.fillStyle = "#fff";
                  v62.strokeStyle = v310;
                  v62.textBaseline = "middle";
                  v62.textAlign = "center";
                  v62.lineWidth = 8;
                  v62.lineJoin = "round";
                  let v1172 = vP11.crownIconScale;
                  let v1173 = v288.x - v1156 - v1172 / 2 + v62.measureText(v1163).width / 2 + vP11.crownPad + (v288.iconIndex == 1 ? 82.5 : 30);
                  v62.strokeText(v288.skinIndex == 45 && v288.shameTimer > 0 ? v288.shameTimer : v288.shameCount, v1173, v288.y - v1157 - v288.scale - vP11.nameY);
                  v62.fillText(v288.skinIndex == 45 && v288.shameTimer > 0 ? v288.shameTimer : v288.shameCount, v1173, v288.y - v1157 - v288.scale - vP11.nameY);
                  if (!v288.isTeam(v286)) {
                    let v1174 = {
                      x: v294 / 2,
                      y: v295 / 2
                    };
                    let v1175 = Math.min(1, v679.getDistance(0, 0, v286.x - v288.x, (v286.y - v288.y) * (16 / 9)) * 100 / (vP11.maxScreenHeight / 2) / v1174.y);
                    let v1176 = v1174.y * v1175;
                    let v1177 = v1176 * Math.cos(v679.getDirect(v288, v286, 0, 0));
                    let v1178 = v1176 * Math.sin(v679.getDirect(v288, v286, 0, 0));
                    v62.save();
                    v62.translate(v286.x - v1156 + v1177, v286.y - v1157 + v1178);
                    v62.rotate(v288.aim2 + Math.PI / 2);
                    let v1179 = 255 - v288.sid * 2;
                    v62.fillStyle = "rgb(" + v1179 + ", " + v1179 + ", " + v1179 + ")";
                    v62.globalAlpha = v1175;
                    let vF23 = function (p972, p973) {
                      p973 = p973 || v62;
                      let v1180 = p972 * (Math.sqrt(3) / 2);
                      p973.beginPath();
                      p973.moveTo(0, -v1180 / 1.5);
                      p973.lineTo(-p972 / 2, v1180 / 2);
                      p973.lineTo(p972 / 2, v1180 / 2);
                      p973.lineTo(0, -v1180 / 1.5);
                      p973.fill();
                      p973.closePath();
                    };
                    vF23(25, v62);
                    v62.restore();
                  }
                  if (f5("predictType").value == "pre2") {
                    v62.lineWidth = 3;
                    v62.strokeStyle = "#cc5151";
                    v62.globalAlpha = 1;
                    v62.beginPath();
                    let v1181 = {
                      x: v288.x2 - v1156,
                      y: v288.y2 - v1157
                    };
                    v62.moveTo(v288.x - v1156, v288.y - v1157);
                    v62.lineTo(v1181.x, v1181.y);
                    v62.stroke();
                  } else if (f5("predictType").value == "pre3") {
                    v62.lineWidth = 3;
                    v62.strokeStyle = "#cc5151";
                    v62.globalAlpha = 1;
                    v62.beginPath();
                    let v1182 = {
                      x: v288.x3 - v1156,
                      y: v288.y3 - v1157
                    };
                    v62.moveTo(v288.x - v1156, v288.y - v1157);
                    v62.lineTo(v1182.x, v1182.y);
                    v62.stroke();
                  }
                }
              }
            }
          }
        }
        if (v286) {
          const v1183 = {
            x: v1156,
            y: v1157
          };
          f135(v62, v1183);
          if (v275.length && f5("funni").checked) {
            v286.spinDir += 2.5 / 60;
            let v1184 = 0;
            if (v711.left) {
              v1184 = 100;
            } else if (v711.right) {
              v1184 = 15;
            } else {
              v1184 = 40;
            }
            v1184 += v286.scale;
            v275.forEach((p974, p975) => {
              if (p974.active) {
                let v1185 = Math.PI * (p975 / (v275.length / 2));
                let v1186 = {
                  x: v286.x + v1184 * Math.cos(v286.spinDir + v1185),
                  y: v286.y + v1184 * Math.sin(v286.spinDir + v1185)
                };
                let v1187 = v679.getDirect(v1186, p974, 0, 0);
                let v1188 = v679.getDist(v1186, p974, 0, 0);
                p974.x += v1188 / 7 * Math.cos(v1187);
                p974.y += v1188 / 7 * Math.sin(v1187);
                v278.filter(p976 => p976.visible && p976 != v286).forEach(p977 => {
                  let v1189 = v679.getDirect(p974, p977, 0, 0);
                  let v1190 = v679.getDist(p974, p977, 0, 0);
                  let v1191 = p974.scale + p977.scale;
                  if (v1190 <= v1191) {
                    let v1192 = v1190 - v1191;
                    let v1193 = -v1192;
                    p974.x += v1193 * Math.cos(v1189);
                    p974.y += v1193 * Math.sin(v1189);
                    p974.health -= 10;
                    p974.damaged += 125;
                    if (p974.health <= 0) {
                      p974.active = false;
                    }
                  }
                });
              } else {
                p974.time += v299;
                if (p974.alive) {
                  p974.alpha -= v299 / 200;
                  p974.visScale += v299 / (p974.scale * 2);
                  if (p974.alpha <= 0) {
                    p974.alpha = 0;
                    p974.alive = false;
                  }
                }
                if (p974.time >= p974.timer) {
                  p974.time = 0;
                  p974.active = true;
                  p974.alive = true;
                  p974.x = v286.x;
                  p974.y = v286.y;
                  p974.health = p974.maxHealth;
                  p974.damaged = 0;
                  p974.alpha = 1;
                  p974.visScale = p974.scale;
                }
              }
              if (p974.alive) {
                let vF24 = function (p978, p979, p980, p981) {
                  return "rgb(" + (Math.min(255, p978 + Math.floor(p981)) + ", " + Math.max(0, p979 - Math.floor(p981)) + ", " + Math.max(0, p980 - Math.floor(p981))) + ")";
                };
                v62.globalAlpha = p974.alpha;
                v62.lineWidth = 3;
                v62.fillStyle = vF24(255, 255, 255, p974.damaged);
                v62.strokeStyle = vF24(200, 200, 200, p974.damaged);
                v62.beginPath();
                v62.arc(p974.x - v1156, p974.y - v1157, p974.visScale, 0, Math.PI * 2);
                v62.fill();
                v62.stroke();
                p974.damaged = Math.max(0, p974.damaged - v299 / 2);
              }
            });
          }
        }
        v62.globalAlpha = 1;
        v687.update(v299, v62, v1156, v1157);
        for (let v1194 = 0; v1194 < v278.length; ++v1194) {
          v288 = v278[v1194];
          if (v288.visible) {
            if (v288.chatCountdown > 0) {
              v288.chatCountdown -= v299;
              if (v288.chatCountdown <= 0) {
                v288.chatCountdown = 0;
              }
              v62.font = "32px Hammersmith One";
              let v1195 = v62.measureText(v288.chatMessage);
              v62.textBaseline = "middle";
              v62.textAlign = "center";
              let v1196 = v288.x - v1156;
              let v1197 = v288.y - v288.scale - v1157 - 90;
              let v1198 = 47;
              let v1199 = v1195.width + 17;
              v62.fillStyle = "rgba(0,0,0,0.2)";
              v62.roundRect(v1196 - v1199 / 2, v1197 - v1198 / 2, v1199, v1198, 6);
              v62.fill();
              v62.fillStyle = "#fff";
              v62.fillText(v288.chatMessage, v1196, v1197);
            }
            if (v288.chat.count > 0) {
              if (!v241) {
                v288.chat.count -= v299;
                if (v288.chat.count <= 0) {
                  v288.chat.count = 0;
                }
                v62.font = "32px Hammersmith One";
                let v1200 = v62.measureText(v288.chat.message);
                v62.textBaseline = "middle";
                v62.textAlign = "center";
                let v1201 = v288.x - v1156;
                let v1202 = v288.y - v288.scale - v1157 + 180;
                let v1203 = 47;
                let v1204 = v1200.width + 17;
                v62.fillStyle = "rgba(0,0,0,0.2)";
                v62.roundRect(v1201 - v1204 / 2, v1202 - v1203 / 2, v1204, v1203, 6);
                v62.fill();
                v62.fillStyle = "#ffffff99";
                v62.fillText(v288.chat.message, v1201, v1202);
              } else {
                v288.chat.count = 0;
              }
            }
          }
        }
        if (v276.length) {
          v276.filter(p982 => p982.active).forEach(p983 => {
            if (!p983.alive) {
              if (p983.alpha <= 1) {
                p983.alpha += v299 / 250;
                if (p983.alpha >= 1) {
                  p983.alpha = 1;
                  p983.alive = true;
                }
              }
            } else {
              p983.alpha -= v299 / 5000;
              if (p983.alpha <= 0) {
                p983.alpha = 0;
                p983.active = false;
              }
            }
            if (p983.active) {
              v62.font = "20px Ubuntu";
              let v1205 = v62.measureText(p983.chat);
              v62.textBaseline = "middle";
              v62.textAlign = "center";
              let v1206 = p983.x - v1156;
              let v1207 = p983.y - v1157 - 90;
              let v1208 = 40;
              let v1209 = v1205.width + 15;
              v62.globalAlpha = p983.alpha;
              v62.fillStyle = p983.owner.isTeam(v286) ? "#8ecc51" : "#cc5151";
              v62.strokeStyle = "rgb(25, 25, 25)";
              v62.strokeText(p983.owner.name, v1206, v1207 - 45);
              v62.fillText(p983.owner.name, v1206, v1207 - 45);
              v62.lineWidth = 5;
              v62.fillStyle = "#ccc";
              v62.strokeStyle = "rgb(25, 25, 25)";
              v62.roundRect(v1206 - v1209 / 2, v1207 - v1208 / 2, v1209, v1208, 6);
              v62.stroke();
              v62.fill();
              v62.fillStyle = "#fff";
              v62.strokeStyle = "#000";
              v62.strokeText(p983.chat, v1206, v1207);
              v62.fillText(p983.chat, v1206, v1207);
              p983.y -= v299 / 100;
            }
          });
        }
        vF21(v62, v299, v1156, v1157);
      }
      v62.globalAlpha = 1;
      f178(v299);
    }
    window.requestAnimFrame = function () {
      return null;
    };
    window.rAF = function () {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (p984) {
        window.setTimeout(p984, 1000 / 60);
      };
    }();
    function f184() {
      v300 = performance.now();
      v299 = v300 - v301;
      v301 = v300;
      let v1210 = performance.now();
      let v1211 = v1210 - v249.last;
      if (v1211 >= 1000) {
        v249.ltime = v249.time * (1000 / v1211);
        v249.last = v1210;
        v249.time = 0;
      }
      v249.time++;
      f183();
      rAF(f184);
    }
    f146();
    f184();
    function f185(p985) {
      f5("instaType").disabled = p985;
      f5("antiBullType").disabled = p985;
      f5("predictType").disabled = p985;
      f5("visualType").disabled = p985;
    }
    f185(v241);
    let v1212;
    window.debug = function () {
      v293.waitHit = 0;
      v293.autoAim = false;
      v689.isTrue = false;
      v688.inTrap = false;
      v274.active = false;
      v1011 = [];
      v1066 = [];
      v997 = [];
      v272 = true;
      setTimeout(() => {
        v272 = false;
      }, 10000);
      v246.tick = 0;
    };
    window.wasdMode = function () {
      v241 = !v241;
      f185(v241);
    };
    window.startGrind = function () {
      if (f5("weaponGrind").checked) {
        for (let v1213 = 0; v1213 < Math.PI * 2; v1213 += Math.PI / 2) {
          f48(v286.getItemType(22), v1213);
        }
      }
    };
    window.resBuild = function () {
      if (v282.length) {
        v282.forEach(p986 => {
          p986.breakObj = false;
        });
        v285 = [];
      }
    };
    const vF25 = async p987 => new Promise(p988 => setTimeout(p988, p987));
    const vF27 = (p989, p990) => {
      const v1214 = q3.url.split("token=")[0] + "token=" + encodeURIComponent("alt:" + V0);
      let v1215 = new WebSocket(v1214);
      v1215.binaryType = "arraybuffer";
      v1215.botType = p990;
      v1215.emit = (p991, p992, p993, p994) => {
        v1215.send(window.msgpack.encode([p991, [p992, p993, p994]]));
      };
      v1215.spawn = function () {
        v1215.emit("M", {
          name: "unknown",
          moofoll: 1,
          skin: 0
        });
      };
      v1215.onopen = async () => {
        await vF25(111);
        v1215.spawn();
      };
      v1215.onmessage = p995 => {
        let v1216 = new Uint8Array(p995.data);
        let v1217 = window.msgpack.decode(v1216);
        let v1218 = v1217[0];
        if (v1218 == "P") {
          v1215.spawn();
        }
      };
    };
    window.toggleBotsCircle = function () {
      v286.circle = !v286.circle;
    };
    window.toggleVisual = function () {
      vP11.anotherVisual = !vP11.anotherVisual;
      v282.forEach(p996 => {
        if (p996.active) {
          p996.dir = p996.lastDir;
        }
      });
    };
    window.prepareUI = function (p997) {
      f64();
      v679.removeAllChildren(v27);
      for (let v1219 = 0; v1219 < v680.weapons.length + v680.list.length; ++v1219) {
        (function (p998) {
          v679.generateElement({
            id: "actionBarItem" + p998,
            class: "actionBarItem",
            style: "display:none",
            onmouseout: function () {
              f63();
            },
            parent: v27
          });
        })(v1219);
      }
      for (let v1220 = 0; v1220 < v680.list.length + v680.weapons.length; ++v1220) {
        (function (p999) {
          let v1221 = document.createElement("canvas");
          v1221.width = v1221.height = 66;
          let v1222 = v1221.getContext("2d");
          v1222.translate(v1221.width / 2, v1221.height / 2);
          v1222.imageSmoothingEnabled = false;
          v1222.webkitImageSmoothingEnabled = false;
          v1222.mozImageSmoothingEnabled = false;
          if (v680.weapons[p999]) {
            v1222.rotate(Math.PI / 4 + Math.PI);
            let v1223 = new Image();
            v983[v680.weapons[p999].src] = v1223;
            v1223.onload = function () {
              this.isLoaded = true;
              let v1224 = 1 / (this.height / this.width);
              let v1225 = v680.weapons[p999].iPad || 1;
              v1222.drawImage(this, -(v1221.width * v1225 * vP11.iconPad * v1224) / 2, -(v1221.height * v1225 * vP11.iconPad) / 2, v1221.width * v1225 * v1224 * vP11.iconPad, v1221.height * v1225 * vP11.iconPad);
              v1222.fillStyle = "rgba(0, 0, 70, 0.1)";
              v1222.globalCompositeOperation = "source-atop";
              v1222.fillRect(-v1221.width / 2, -v1221.height / 2, v1221.width, v1221.height);
              f5("actionBarItem" + p999).style.backgroundImage = "url(" + v1221.toDataURL() + ")";
            };
            v1223.src = "./../img/weapons/" + v680.weapons[p999].src + ".png";
            let vF54 = f5("actionBarItem" + p999);
            vF54.onmouseover = v679.checkTrusted(function () {
              f63(v680.weapons[p999], true);
            });
            vF54.onclick = v679.checkTrusted(function () {
              f43(p997.weapons[v680.weapons[p999].type]);
            });
            v679.hookTouchEvents(vF54);
          } else {
            let vF160 = f160(v680.list[p999 - v680.weapons.length], true);
            let v1226 = Math.min(v1221.width - vP11.iconPadding, vF160.width);
            v1222.globalAlpha = 1;
            v1222.drawImage(vF160, -v1226 / 2, -v1226 / 2, v1226, v1226);
            v1222.fillStyle = "rgba(0, 0, 70, 0.1)";
            v1222.globalCompositeOperation = "source-atop";
            v1222.fillRect(-v1226 / 2, -v1226 / 2, v1226, v1226);
            f5("actionBarItem" + p999).style.backgroundImage = "url(" + v1221.toDataURL() + ")";
            let vF55 = f5("actionBarItem" + p999);
            vF55.onmouseover = v679.checkTrusted(function () {
              f63(v680.list[p999 - v680.weapons.length]);
            });
            vF55.onclick = v679.checkTrusted(function () {
              f42(p997.items[p997.getItemType(p999 - v680.weapons.length)]);
            });
            v679.hookTouchEvents(vF55);
          }
        })(v1220);
      }
    };
    window.profineTest = function (p1000) {
      if (p1000) {
        let v1227 = "unknown";
        let v1228 = p1000 + "";
        v1228 = v1228.slice(0, vP11.maxNameLength);
        v1228 = v1228.replace(/[^\w:\(\)\/? -]+/gmi, " ");
        v1228 = v1228.replace(/[^\x00-\x7F]/g, " ");
        v1228 = v1228.trim();
        let v1229 = {
          list: ["ahole", "anus", "ash0le", "ash0les", "asholes", "ass", "Ass Monkey", "Assface", "assh0le", "assh0lez", "asshole", "assholes", "assholz", "asswipe", "azzhole", "bassterds", "bastard", "bastards", "bastardz", "basterds", "basterdz", "Biatch", "bitch", "bitches", "Blow Job", "boffing", "butthole", "buttwipe", "c0ck", "c0cks", "c0k", "Carpet Muncher", "cawk", "cawks", "Clit", "cnts", "cntz", "cock", "cockhead", "cock-head", "cocks", "CockSucker", "cock-sucker", "crap", "cum", "cunt", "cunts", "cuntz", "dick", "dild0", "dild0s", "dildo", "dildos", "dilld0", "dilld0s", "dominatricks", "dominatrics", "dominatrix", "dyke", "enema", "f u c k", "f u c k e r", "fag", "fag1t", "faget", "fagg1t", "faggit", "faggot", "fagg0t", "fagit", "fags", "fagz", "faig", "faigs", "fart", "flipping the bird", "fuck", "fucker", "fuckin", "fucking", "fucks", "Fudge Packer", "fuk", "Fukah", "Fuken", "fuker", "Fukin", "Fukk", "Fukkah", "Fukken", "Fukker", "Fukkin", "g00k", "God-damned", "h00r", "h0ar", "h0re", "hells", "hoar", "hoor", "hoore", "jackoff", "jap", "japs", "jerk-off", "jisim", "jiss", "jizm", "jizz", "knob", "knobs", "knobz", "kunt", "kunts", "kuntz", "Lezzian", "Lipshits", "Lipshitz", "masochist", "masokist", "massterbait", "masstrbait", "masstrbate", "masterbaiter", "masterbate", "masterbates", "Motha Fucker", "Motha Fuker", "Motha Fukkah", "Motha Fukker", "Mother Fucker", "Mother Fukah", "Mother Fuker", "Mother Fukkah", "Mother Fukker", "mother-fucker", "Mutha Fucker", "Mutha Fukah", "Mutha Fuker", "Mutha Fukkah", "Mutha Fukker", "n1gr", "nastt", "nigger;", "nigur;", "niiger;", "niigr;", "orafis", "orgasim;", "orgasm", "orgasum", "oriface", "orifice", "orifiss", "packi", "packie", "packy", "paki", "pakie", "paky", "pecker", "peeenus", "peeenusss", "peenus", "peinus", "pen1s", "penas", "penis", "penis-breath", "penus", "penuus", "Phuc", "Phuck", "Phuk", "Phuker", "Phukker", "polac", "polack", "polak", "Poonani", "pr1c", "pr1ck", "pr1k", "pusse", "pussee", "pussy", "puuke", "puuker", "queer", "queers", "queerz", "qweers", "qweerz", "qweir", "recktum", "rectum", "retard", "sadist", "scank", "schlong", "screwing", "semen", "sex", "sexy", "Sh!t", "sh1t", "sh1ter", "sh1ts", "sh1tter", "sh1tz", "shit", "shits", "shitter", "Shitty", "Shity", "shitz", "Shyt", "Shyte", "Shytty", "Shyty", "skanck", "skank", "skankee", "skankey", "skanks", "Skanky", "slag", "slut", "sluts", "Slutty", "slutz", "son-of-a-bitch", "tit", "turd", "va1jina", "vag1na", "vagiina", "vagina", "vaj1na", "vajina", "vullva", "vulva", "w0p", "wh00r", "wh0re", "whore", "xrated", "xxx", "b!+ch", "bitch", "blowjob", "clit", "arschloch", "fuck", "shit", "ass", "asshole", "b!tch", "b17ch", "b1tch", "bastard", "bi+ch", "boiolas", "buceta", "c0ck", "cawk", "chink", "cipa", "clits", "cock", "cum", "cunt", "dildo", "dirsa", "ejakulate", "fatass", "fcuk", "fuk", "fux0r", "hoer", "hore", "jism", "kawk", "l3itch", "l3i+ch", "lesbian", "masturbate", "masterbat*", "masterbat3", "motherfucker", "s.o.b.", "mofo", "nazi", "nigga", "nigger", "nutsack", "phuck", "pimpis", "pusse", "pussy", "scrotum", "sh!t", "shemale", "shi+", "sh!+", "slut", "smut", "teets", "tits", "boobs", "b00bs", "teez", "testical", "testicle", "titt", "w00se", "jackoff", "wank", "whoar", "whore", "*damn", "*dyke", "*fuck*", "*shit*", "@$$", "amcik", "andskota", "arse*", "assrammer", "ayir", "bi7ch", "bitch*", "bollock*", "breasts", "butt-pirate", "cabron", "cazzo", "chraa", "chuj", "Cock*", "cunt*", "d4mn", "daygo", "dego", "dick*", "dike*", "dupa", "dziwka", "ejackulate", "Ekrem*", "Ekto", "enculer", "faen", "fag*", "fanculo", "fanny", "feces", "feg", "Felcher", "ficken", "fitt*", "Flikker", "foreskin", "Fotze", "Fu(*", "fuk*", "futkretzn", "gook", "guiena", "h0r", "h4x0r", "hell", "helvete", "hoer*", "honkey", "Huevon", "hui", "injun", "jizz", "kanker*", "kike", "klootzak", "kraut", "knulle", "kuk", "kuksuger", "Kurac", "kurwa", "kusi*", "kyrpa*", "lesbo", "mamhoon", "masturbat*", "merd*", "mibun", "monkleigh", "mouliewop", "muie", "mulkku", "muschi", "nazis", "nepesaurio", "nigger*", "nigga", "negga", "orospu", "paska*", "perse", "picka", "pierdol*", "pillu*", "pimmel", "piss*", "pizda", "poontsee", "poop", "porn", "p0rn", "pr0n", "preteen", "pula", "pule", "puta", "puto", "qahbeh", "queef*", "rautenberg", "schaffer", "scheiss*", "schlampe", "schmuck", "screw", "sh!t*", "sharmuta", "sharmute", "shipal", "shiz", "skribz", "skurwysyn", "sphencter", "spic", "spierdalaj", "splooge", "suka", "b00b*", "testicle*", "titt*", "twat", "vittu", "wank*", "wetback*", "wichser", "wop*", "yed", "zabourah", "4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx", "jew", "black", "baby", "child", "white", "porn", "pedo", "trump", "clinton", "hitler", "nazi", "gay", "pride", "sex", "pleasure", "touch", "poo", "kids", "rape", "white power", "nigga", "nig nog", "doggy", "rapist", "boner", "nigger", "nigg", "finger", "nogger", "nagger", "nig", "fag", "gai", "pole", "stripper", "penis", "vagina", "pussy", "nazi", "hitler", "stalin", "burn", "chamber", "cock", "peen", "dick", "spick", "nieger", "die", "satan", "n|ig", "nlg", "cunt", "c0ck", "fag", "lick", "condom", "anal", "shit", "phile", "little", "kids", "free KR", "tiny", "sidney", "ass", "kill", ".io", "(dot)", "[dot]", "mini", "whiore", "whore", "faggot", "github", "1337", "666", "satan", "senpa", "discord", "d1scord", "mistik", ".io", "senpa.io", "sidney", "sid", "senpaio", "vries", "asa"],
          exclude: [],
          placeHolder: "*",
          regex: {},
          replaceRegex: {}
        };
        let v1230 = false;
        let v1231 = v1228.toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
        for (let v1232 of v1229.list) {
          if (v1231.indexOf(v1232) != -1) {
            v1230 = true;
            break;
          }
        }
        if (v1228.length > 0 && !v1230) {
          v1227 = v1228;
        }
        return v1227;
      }
    };
  }
});
const PACKET_MAP = {
  // wont have all old packets, since they conflict with some of the new ones, add them yourself if you want to unpatch mods that are that old.
  "33": "9",
  // "7": "K",
  ch: "6",
  pp: "0",
  "13c": "c",
  // most recent packet changes
  a: "9",
  d: "F",
  G: "z",
  f: "9"
};
let originalSend = WebSocket.prototype.send;
WebSocket.prototype.send = new Proxy(originalSend, {
  apply: (target, websocket, argsList) => {
    let decoded = msgpack.decode(new Uint8Array(argsList[0]));
    if (PACKET_MAP.hasOwnProperty(decoded[0])) {
      decoded[0] = PACKET_MAP[decoded[0]];
    }
    return target.apply(websocket, [msgpack.encode(decoded)]);
  }
});