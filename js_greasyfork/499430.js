// ==UserScript==
// @name         Yurio Private ++
// @version      v1
// @author       Yurio
// @match        *://*.moomoo.io/*
// @description  No leak plez
// @grant        none
// @namespace https://greasyfork.org/users/1326893
// @downloadURL https://update.greasyfork.org/scripts/499430/Yurio%20Private%20%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/499430/Yurio%20Private%20%2B%2B.meta.js
// ==/UserScript==
let a = false;
let b = document.getElementsByTagName("script");
for (let c = 0; c < b.length; c++) {
  if (b[c].src.includes("index-f3a4c1ad.js") && !a) {
    b[c].remove();
    a = true;
    break;
  }
}
document.addEventListener("keydown", function (a) {
  if (a.keyCode === 45) {
    const a = document.getElementById("gameUI");
    if (a) {
      const b = a.style.display;
      a.style.display = b === "none" ? "block" : "none";
    }
  }
});
window.addEventListener("load", function () {
  var a = document.getElementById("allianceButton");
  var b = document.getElementById("storeButton");
  if (b) {
    b.style.right = "26px";
    b.style.top = "420px";
  }
  if (a) {
    a.style.right = "26px";
    a.style.top = "479px";
  }
});
function c(a) {
  return document.getElementById(a);
}
let d = document.createElement("link");
d.rel = "stylesheet";
d.href = "https://fonts.googleapis.com/css?family=Ubuntu:700";
d.type = "text/css";
document.body.append(d);
let e = document.createElement("script");
e.src = "https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js";
document.body.append(e);
window.oncontextmenu = function () {
  return false;
};
let f = window.config;
f.clientSendRate = 9;
f.serverUpdateRate = 9;
f.deathFadeout = 0;
f.playerCapacity = 9999;
f.isSandbox = window.location.hostname == "sandbox.moomoo.io";
f.skinColors = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373", "#91b2db"];
f.weaponVariants = [{
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
}, {
  id: 4,
  src: "_e",
  poison: true,
  heal: true,
  xp: 24000,
  val: 1.18
}];
f.anotherVisual = true;
f.useWebGl = false;
f.resetRender = true;
function g(a) {
  return new Promise(b => {
    setTimeout(() => {
      b();
    }, a);
  });
}
let h = [];
let i;
if (typeof Storage !== "undefined") {
  i = true;
}
function j(a, b) {
  if (i) {
    localStorage.setItem(a, b);
  }
}
function k(a) {
  if (i) {
    localStorage.removeItem(a);
  }
}
function l(a) {
  if (i) {
    return localStorage.getItem(a);
  }
  return null;
}
let m = function (a, b) {
  try {
    let c = JSON.parse(l(a));
    if (typeof c === "object") {
      return b;
    } else {
      return c;
    }
  } catch (a) {
    alert("dieskid");
    return b;
  }
};
function n() {
  return {
    help: {
      desc: "Show Commands",
      action: function (a) {
        for (let b in p) {
          B("/" + b, p[b].desc, "lime", 1);
        }
      }
    },
    clear: {
      desc: "Clear Chats",
      action: function (a) {
        D();
      }
    },
    debug: {
      desc: "Debug Mod For Development",
      action: function (a) {
        Zc(ja);
        B("Debug", "Done", "#99ee99", 1);
      }
    },
    play: {
      desc: "Play Music ( /play [link] )",
      action: function (a) {
        let b = a.split(" ");
        if (b[1]) {
          let a = new Audio(b[1]);
          a.play();
        } else {
          B("Warn", "Enter Link ( /play [link] )", "#99ee99", 1);
        }
      }
    },
    "!Leave": {
      desc: "Leave Game",
      action: function (a) {
        window.leave();
      }
    }
  };
}
function o() {
  return {
    killChat: false,
    autoBuy: true,
    autoBuyEquip: true,
    autoPush: true,
    revTick: true,
    spikeTick: true,
    predictTick: true,
    autoPlace: true,
    autoReplace: true,
    antiTrap: true,
    slowOT: false,
    attackDir: false,
    showDir: false,
    autoRespawn: false
  };
}
let p = n();
let q = o();
window.removeConfigs = function () {
  for (let a in q) {
    k(a, q[a]);
  }
};
for (let a in q) {
  q[a] = m(a, q[a]);
}
window.changeMenu = function () {};
window.debug = function () {};
window.wasdMode = function () {};
window.startGrind = function () {};
window.connectFillBots = function () {};
window.destroyFillBots = function () {};
window.tryConnectBots = function () {};
window.destroyBots = function () {};
window.resBuild = function () {};
window.toggleBotsCircle = function () {};
window.toggleVisual = function () {};
window.prepareUI = function () {};
window.leave = function () {};
window.ping = 0;
class r {
  constructor(a, b) {
    this.inGame = false;
    this.lover = a + b;
    this.baby = "ae86";
    this.isBlack = 0;
    this.webSocket = undefined;
    this.checkBaby = function () {
      if (this.baby !== "ae86") {
        this.isBlack++;
      } else {
        this.isBlack--;
      }
      if (this.isBlack >= 1) {
        return "bl4cky";
      }
      return "noting for you";
    };
    this.x2 = 0;
    this.y2 = 0;
    this.chat = "Imagine playing this badass game XDDDDD";
    this.summon = function (a) {
      this.x2 = a.x;
      this.y2 = a.y;
      this.chat = a.name + " ur so bad XDDDD";
    };
    this.commands = function (a) {
      if (a == "rv3link") {
        window.open("https://florr.io/");
      }
      if (a == "woah") {
        window.open("https://www.youtube.com/watch?v=MO0AGukzj6M");
      }
      return a;
    };
    this.dayte = "11yearold";
    this.memeganoob = "69yearold";
    this.startDayteSpawn = function (a) {
      let b = setInterval(() => {
        this.x2 = a.x + 20;
        this.y2 = a.y - 20;
        this.chat = "UR SO BAD LOL";
        if (a.name == "ae86") {
          this.chat = "omg ae86 go run";
          setTimeout(() => {
            this.inGame = false;
            clearInterval(b);
          }, 1000);
        }
      }, 1234);
    };
    this.AntiChickenModV69420 = function (a) {
      return "!c!dc user " + a.name;
    };
  }
}
;
class s {
  constructor(a) {
    this.element = a;
  }
  add(a) {
    if (!this.element) {
      return undefined;
    }
    this.element.innerHTML += a;
  }
  newLine(a) {
    let b = "<br>";
    if (a > 0) {
      b = "";
      for (let c = 0; c < a; c++) {
        b += "<br>";
      }
    }
    this.add(b);
  }
  checkBox(a) {
    let b = "<input type = \"checkbox\"";
    if (a.id) {
      b += " id = " + a.id;
    }
    if (a.style) {
      b += " style = " + a.style.replaceAll(" ", "");
    }
    if (a.class) {
      b += " class = " + a.class;
    }
    if (a.checked) {
      b += " checked";
    }
    if (a.onclick) {
      b += " onclick = " + a.onclick;
    }
    b += ">";
    this.add(b);
  }
  text(a) {
    let b = "<input type = \"text\"";
    if (a.id) {
      b += " id = " + a.id;
    }
    if (a.style) {
      b += " style = " + a.style.replaceAll(" ", "");
    }
    if (a.class) {
      b += " class = " + a.class;
    }
    if (a.size) {
      b += " size = " + a.size;
    }
    if (a.maxLength) {
      b += " maxLength = " + a.maxLength;
    }
    if (a.value) {
      b += " value = " + a.value;
    }
    if (a.placeHolder) {
      b += " placeHolder = " + a.placeHolder.replaceAll(" ", "&nbsp;");
    }
    b += ">";
    this.add(b);
  }
  select(a) {
    let b = "<select";
    if (a.id) {
      b += " id = " + a.id;
    }
    if (a.style) {
      b += " style = " + a.style.replaceAll(" ", "");
    }
    if (a.class) {
      b += " class = " + a.class;
    }
    b += ">";
    for (let c in a.option) {
      b += "<option value = " + a.option[c].id;
      if (a.option[c].selected) {
        b += " selected";
      }
      b += ">" + c + "</option>";
    }
    b += "</select>";
    this.add(b);
  }
  button(a) {
    let b = "<button";
    if (a.id) {
      b += " id = " + a.id;
    }
    if (a.style) {
      b += " style = " + a.style.replaceAll(" ", "");
    }
    if (a.class) {
      b += " class = " + a.class;
    }
    if (a.onclick) {
      b += " onclick = " + a.onclick;
    }
    b += ">";
    if (a.innerHTML) {
      b += a.innerHTML;
    }
    b += "</button>";
    this.add(b);
  }
  selectMenu(a) {
    let b = "<select";
    if (!a.id) {
      alert("please put id skid");
      return;
    }
    window[a.id + "Func"] = function () {};
    if (a.id) {
      b += " id = " + a.id;
    }
    if (a.style) {
      b += " style = " + a.style.replaceAll(" ", "");
    }
    if (a.class) {
      b += " class = " + a.class;
    }
    b += " onchange = window." + (a.id + "Func") + "()";
    b += ">";
    let d;
    let e = 0;
    for (let c in a.menu) {
      b += "<option value = " + ("option_" + c) + " id = " + ("O_" + c);
      if (a.menu[c]) {
        b += " checked";
      }
      b += " style = \"color: " + (a.menu[c] ? "#000" : "#fff") + "; background: " + (a.menu[c] ? "#8ecc51" : "#cc5151") + ";\">" + c + "</option>";
      e++;
    }
    b += "</select>";
    this.add(b);
    e = 0;
    for (let b in a.menu) {
      window[b + "Func"] = function () {
        a.menu[b] = c("check_" + b).checked ? true : false;
        j(b, a.menu[b]);
        c("O_" + b).style.color = a.menu[b] ? "#000" : "#fff";
        c("O_" + b).style.background = a.menu[b] ? "#8ecc51" : "#cc5151";
      };
      this.checkBox({
        id: "check_" + b,
        style: "display: " + (e == 0 ? "inline-block" : "none") + ";",
        class: "checkB",
        onclick: "window." + (b + "Func") + "()",
        checked: a.menu[b]
      });
      e++;
    }
    d = "check_" + c(a.id).value.split("_")[1];
    window[a.id + "Func"] = function () {
      c(d).style.display = "none";
      d = "check_" + c(a.id).value.split("_")[1];
      c(d).style.display = "inline-block";
    };
  }
}
;
class t {
  constructor() {
    this.element = null;
    this.action = null;
    this.divElement = null;
    this.startDiv = function (a, b) {
      let c = document.createElement("div");
      if (a.id) {
        c.id = a.id;
      }
      if (a.style) {
        c.style = a.style;
      }
      if (a.class) {
        c.className = a.class;
      }
      this.element.appendChild(c);
      this.divElement = c;
      let d = new s(c);
      if (typeof b == "function") {
        b(d);
      }
    };
    this.addDiv = function (a, b) {
      let d = document.createElement("div");
      if (a.id) {
        d.id = a.id;
      }
      if (a.style) {
        d.style = a.style;
      }
      if (a.class) {
        d.className = a.class;
      }
      if (a.appendID) {
        c(a.appendID).appendChild(d);
      }
      this.divElement = d;
      let e = new s(d);
      if (typeof b == "function") {
        b(e);
      }
    };
  }
  set(a) {
    this.element = c(a);
    this.action = new s(this.element);
  }
  resetHTML(a) {
    if (a) {
      this.element.innerHTML = "";
    } else {
      this.element.innerHTML = "";
    }
  }
  setStyle(a) {
    this.element.style = a;
  }
  setCSS(a) {
    this.action.add("<style>" + a + "</style>");
  }
}
;
let u = new t();
let v = document.createElement("div");
v.id = "menuDiv";
v.draggable = true;
v.addEventListener("dragstart", function (a) {
  a.dataTransfer.setData("text/plain", "");
});
document.addEventListener("dragover", function (a) {
  v.style.left = a.clientX - v.offsetWidth / 2 + "px";
  v.style.top = a.clientY - v.offsetHeight / 2 + "px";
});
document.body.appendChild(v);
u.set("menuDiv");
u.setStyle("\n            position: absolute;\n            left: 20px;\n            top: 20px;\n            ");
u.resetHTML();
u.setCSS("\n            .menuClass{\n                color: #fff;\n                font-size: 31px;\n                text-align: left;\n                padding: 10px;\n                padding-top: 7px;\n                padding-bottom: 5px;\n                width: 300px;\n                background-color: rgba(0, 0, 0, 0.25);\n                -webkit-border-radius: 4px;\n                -moz-border-radius: 4px;\n                border-radius: 4px;\n            }\n            .menuC {\n                display: none;\n                font-family: \"Hammersmith One\";\n                font-size: 12px;\n                max-height: 180px;\n                overflow-y: scroll;\n                -webkit-touch-callout: none;\n                -webkit-user-select: none;\n                -khtml-user-select: none;\n                -moz-user-select: none;\n                -ms-user-select: none;\n                user-select: none;\n            }\n            .menuB {\n                text-align: center;\n                background-color: rgb(25, 25, 25);\n                color: #fff;\n                -webkit-border-radius: 4px;\n                -moz-border-radius: 4px;\n                border-radius: 4px;\n                border: 2px solid #000;\n                cursor: pointer;\n            }\n            .menuB:hover {\n                border: 2px solid #fff;\n            }\n            .menuB:active {\n                color: rgb(25, 25, 25);\n                background-color: rgb(200, 200, 200);\n            }\n            .customText {\n                color: #000;\n                -webkit-border-radius: 4px;\n                -moz-border-radius: 4px;\n                border-radius: 4px;\n                border: 2px solid #000;\n            }\n            .customText:focus {\n                background-color: yellow;\n            }\n            .checkB {\n                position: relative;\n                top: 2px;\n                accent-color: #888;\n                cursor: pointer;\n            }\n            .Cselect {\n                -webkit-border-radius: 4px;\n                -moz-border-radius: 4px;\n                border-radius: 4px;\n                background-color: rgb(75, 75, 75);\n                color: #fff;\n                border: 1px solid #000;\n            }\n            #menuChanger {\n                position: absolute;\n                right: 10px;\n                top: 10px;\n                background-color: rgba(0, 0, 0, 0);\n                color: #fff;\n                border: none;\n                cursor: pointer;\n            }\n            #menuChanger:hover {\n                color: #000;\n            }\n            ::-webkit-scrollbar {\n                width: 10px;\n            }\n            ::-webkit-scrollbar-track {\n                opacity: 0;\n            }\n            ::-webkit-scrollbar-thumb {\n                background-color: rgb(25, 25, 25);\n                -webkit-border-radius: 4px;\n                -moz-border-radius: 4px;\n                border-radius: 4px;\n            }\n            ::-webkit-scrollbar-thumb:active {\n                background-color: rgb(230, 230, 230);\n            }\n            ");
u.startDiv({
  id: "menuHeadLine",
  class: "menuClass"
}, a => {
  a.add("YurioExclusive");
  a.button({
    id: "menuChanger",
    class: "material-icons",
    innerHTML: "sync",
    onclick: "window.changeMenu()"
  });
  u.addDiv({
    id: "menuButtons",
    style: "display: block; overflow-y: visible;",
    class: "menuC",
    appendID: "menuHeadLine"
  }, a => {
    a.button({
      class: "menuB",
      innerHTML: "Debug",
      onclick: "window.debug()"
    });
  });
  u.addDiv({
    id: "menuMain",
    style: "display: block",
    class: "menuC",
    appendID: "menuHeadLine"
  }, a => {
    a.button({
      class: "menuB",
      innerHTML: "Toggle Wasd Mode",
      onclick: "window.wasdMode()"
    });
    a.newLine();
    a.add("Weapon Grinder: ");
    a.checkBox({
      id: "weaponGrind",
      class: "checkB",
      onclick: "window.startGrind()"
    });
    a.newLine(2);
    u.addDiv({
      style: "font-size: 20px; color: #99ee99;",
      appendID: "menuMain"
    }, a => {
      a.add("Developing Settings:");
    });
    a.add("AntiPush(ass):");
    a.checkBox({
      id: "antipush",
      class: "checkB",
      checked: true
    });
    a.newLine();
    a.add("New Healing Beta:");
    a.checkBox({
      id: "healingBeta",
      class: "checkB",
      checked: true
    });
    a.newLine();
  });
  u.addDiv({
    id: "menuConfig",
    class: "menuC",
    appendID: "menuHeadLine"
  }, a => {
    a.add("AutoPlacer Placement Tick: ");
    a.text({
      id: "autoPlaceTick",
      class: "customText",
      value: "2",
      size: "2em",
      maxLength: "1"
    });
    a.newLine();
    a.add("AutoPlaceType: ");
    a.select({
      id: "Autoplacetype",
      class: "Cselect",
      option: {
        Smooth: {
          id: "smoothplace",
          selected: true
        },
        Spammy: {
          id: "spammyplace"
        }
      }
    });
    a.newLine();
    a.add("Configs: ");
    a.selectMenu({
      id: "configsChanger",
      class: "Cselect",
      menu: q
    });
    a.newLine();
    a.add("InstaKill Type: ");
    a.select({
      id: "instaType",
      class: "Cselect",
      option: {
        OneShot: {
          id: "oneShot",
          selected: true
        },
        Spammer: {
          id: "spammer"
        }
      }
    });
    a.newLine();
    a.add("AntiBull Type: ");
    a.select({
      id: "antiBullType",
      class: "Cselect",
      option: {
        "Disable AntiBull": {
          id: "noab",
          selected: true
        },
        "When Reloaded": {
          id: "abreload"
        },
        "Primary Reloaded": {
          id: "abalway"
        }
      }
    });
    a.newLine();
    a.add("Backup Nobull Insta: ");
    a.checkBox({
      id: "backupNobull",
      class: "checkB",
      checked: true
    });
    a.newLine();
    a.add("Turret Gear Combat Assistance: ");
    a.checkBox({
      id: "turretCombat",
      class: "checkB"
    });
    a.newLine();
    a.add("Safe AntiSpikeTick: ");
    a.checkBox({
      id: "safeAntiSpikeTick",
      class: "checkB",
      checked: true
    });
    a.newLine();
  });
  u.addDiv({
    id: "menuOther",
    class: "menuC",
    appendID: "menuHeadLine"
  }, a => {
    a.button({
      class: "menuB",
      innerHTML: "Connect Bots",
      onclick: "window.tryConnectBots()"
    });
    a.button({
      class: "menuB",
      innerHTML: "Disconnect Bots",
      onclick: "window.destroyBots()"
    });
    a.newLine();
    a.button({
      class: "menuB",
      innerHTML: "Connect FBots",
      onclick: "window.connectFillBots()"
    });
    a.button({
      class: "menuB",
      innerHTML: "Disconnect FBots",
      onclick: "window.destroyFillBots()"
    });
    a.newLine();
    a.button({
      class: "menuB",
      innerHTML: "Reset Break Objects",
      onclick: "window.resBuild()"
    });
    a.newLine();
    a.add("Break Objects Range: ");
    a.text({
      id: "breakRange",
      class: "customText",
      value: "700",
      size: "3em",
      maxLength: "4"
    });
    a.newLine();
    a.add("Predict Movement Type: ");
    a.select({
      id: "predictType",
      class: "Cselect",
      option: {
        "Disable Render": {
          id: "disableRender",
          selected: true
        },
        "X/Y and 2": {
          id: "pre2"
        },
        "X/Y and 3": {
          id: "pre3"
        }
      }
    });
    a.newLine();
    a.add("Render Placers: ");
    a.checkBox({
      id: "placeVis",
      class: "checkB"
    });
    a.newLine();
    a.add("Bot Mode: ");
    a.select({
      id: "mode",
      class: "Cselect",
      option: {
        "Clear Building": {
          id: "clear",
          selected: true
        },
        Sync: {
          id: "zync"
        },
        Search: {
          id: "zearch"
        },
        "Clear Everything": {
          id: "fuckemup"
        },
        Flex: {
          id: "flex"
        }
      }
    });
    a.newLine(2);
    a.button({
      class: "menuB",
      innerHTML: "Toggle Fbots Circle",
      onclick: "window.toggleBotsCircle()"
    });
    a.newLine();
    a.add("Circle Rad: ");
    a.text({
      id: "circleRad",
      class: "customText",
      value: "200",
      size: "3em",
      maxLength: "4"
    });
    a.newLine();
    a.add("Rad Speed: ");
    a.text({
      id: "radSpeed",
      class: "customText",
      value: "0.1",
      size: "2em",
      maxLength: "3"
    });
    a.newLine();
    a.add("Bot Zetup Type: ");
    a.select({
      id: "setup",
      class: "Cselect",
      option: {
        "Dagger Musket": {
          id: "dm",
          selected: true
        },
        "Katana Hammer": {
          id: "kh"
        },
        "Dagger Repeater-Crossbow": {
          id: "dr"
        },
        "Zhort-Zword Muzket": {
          id: "zd"
        }
      }
    });
    a.newLine(2);
    a.add("Cross World: ");
    a.checkBox({
      id: "funni",
      class: "checkB"
    });
    a.newLine();
    a.button({
      class: "menuB",
      innerHTML: "Toggle Another Visual",
      onclick: "window.toggleVisual()"
    });
    a.newLine();
  });
});
let w = document.createElement("div");
w.id = "menuChatDiv";
document.body.appendChild(w);
u.set("menuChatDiv");
u.setStyle("\n            position: absolute;\n            display: none;\n            left: 0px;\n            top: 25px;\n          //  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.65);\n            ");
u.resetHTML();
u.setCSS("\n                    .chDiv {\n    color: #fff;\n    padding: 10px;\n    width: 357px;\n    height: 217px;\n    background-color: rgba(0, 0, 0, 0.2);\n    font-family: \"HammerSmith One\", monospace;\n //   border-radius: 15px;\n//    box-shadow: black 1px 2px 19px;\n//backdrop-filter: blur(3px);\n\n}\n.chMainDiv {\n    font-family: \"Ubuntu\";\n    font-size: 16px;\n    max-height: 215px;\n    overflow-y: scroll;\n    scrollbar-width: thin;\n    scrollbar-color: rgba(0, 0, 0, 0.5) rgba(0, 0, 0, 0.1);\n    -webkit-touch-callout: none;\n    -webkit-user-select: none;\n    -khtml-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    overflow-x: hidden;\n}\n.chMainDiv::-webkit-scrollbar {\n    width: 8px;\n}\n.chMainDiv::-webkit-scrollbar-thumb {\n    background-color: rgba(0, 0, 0, 0.5);\n}\n.chMainDiv::-webkit-scrollbar-thumb:hover {\n    background-color: rgba(0, 0, 0, 0.7);\n}\n.chMainBox {\ndisplay:none;\n     position: absolute;\n    left: 10px;\n    bottom: 10px;\n    width: 380px;\n    height: 25px;\n    background-color: rgba(255, 255, 255, 0.1);\n    border-radius: 5px;\n    color: rgba(255, 255, 255, 0.75);\n    font-family: \"HammerSmith One\";\n    font-size: 12px;\n}\n            ");
u.startDiv({
  id: "mChDiv",
  class: "chDiv"
}, a => {
  u.addDiv({
    id: "mChMain",
    class: "chMainDiv",
    appendID: "mChDiv"
  }, a => {});
  a.text({
    id: "mChBox",
    class: "chMainBox"
  });
});
let x = c("mChMain");
let y = c("mChBox");
let z = false;
let A = 0;
y.value = "";
y.addEventListener("focus", () => {
  z = true;
});
y.addEventListener("blur", () => {
  z = false;
});
function B(a, b, c, d) {
  u.set("menuChatDiv");
  c = c || "white";
  let e = new Date();
  let f = e.getMinutes();
  let g = e.getHours();
  let h = "";
  if (!d) {
    h += (g < 10 ? "0" : "") + g + ":" + ((f < 10 ? "0" : "") + f);
  }
  if (a) {
    h += "" + ((!d ? " - " : "") + a);
  }
  if (b) {
    h += (a ? ": " : !d ? " - " : "") + b + "\n";
  }
  u.addDiv({
    id: "menuChDisp",
    style: "color: " + c,
    appendID: "mChMain"
  }, a => {
    a.add(h);
  });
  x.scrollTop = x.scrollHeight;
  A++;
}
function C(a, b, c, d) {
  u.set("menuChatDiv");
  c = c || "white";
  let e = new Date();
  let f = "";
  if (b) {
    f += (a ? ": " : !d ? "" : "") + b + "\n";
  }
  u.addDiv({
    id: "menuChDisp",
    style: "color: " + c,
    appendID: "mChMain"
  }, a => {
    a.add(f);
  });
  x.scrollTop = x.scrollHeight;
  A++;
}
function D() {
  x.innerHTML = "";
  A = 0;
  B(null, "Chat '/help' for a list of chat commands.", "white", 1);
}
D();
let E = 0;
let F = ["menuMain", "menuConfig", "menuOther"];
window.changeMenu = function () {
  c(F[E % F.length]).style.display = "none";
  E++;
  c(F[E % F.length]).style.display = "block";
};
let G = document.createElement("div");
G.id = "status";
c("gameUI").appendChild(G);
u.set("status");
u.setStyle("\n            display: block;\n            position: absolute;\n            color: #ddd;\n            font: 15px Hammersmith One;\n            bottom: 215px;\n            left: 20px;\n            ");
u.resetHTML();
u.setCSS("\n            .sizing {\n                font-size: 15px;\n            }\n            .mod {\n                font-size: 15px;\n                display: inline-block;\n            }\n            ");
u.startDiv({
  id: "uehmod",
  class: "sizing"
}, a => {
  a.add("Ping: ");
  u.addDiv({
    id: "pingFps",
    class: "mod",
    appendID: "uehmod"
  }, a => {
    a.add("None");
  });
  a.newLine();
  a.add("Packet: ");
  u.addDiv({
    id: "packetStatus",
    class: "mod",
    appendID: "uehmod"
  }, a => {
    a.add("None");
  });
});
let H = false;
let I = undefined;
let J = undefined;
let K = false;
let L = 0;
let M = 120;
let N = 1000;
let O = {
  sec: false
};
let P = {
  tick: 0,
  tickQueue: [],
  tickBase: function (a, b) {
    if (this.tickQueue[this.tick + b]) {
      this.tickQueue[this.tick + b].push(a);
    } else {
      this.tickQueue[this.tick + b] = [a];
    }
  },
  tickRate: 1000 / f.serverUpdateRate,
  tickSpeed: 0,
  lastTick: performance.now()
};
let Q = false;
let R = {
  last: 0,
  time: 0,
  ltime: 0
};
let S = undefined;
let T = ["cc", 1, "__proto__"];
WebSocket.prototype.nsend = WebSocket.prototype.send;
WebSocket.prototype.send = function (a) {
  if (!I) {
    I = this;
    I.addEventListener("message", function (a) {
      X(a);
    });
    I.addEventListener("close", a => {
      if (a.code == 4001) {
        window.location.reload();
      }
    });
  }
  if (I == this) {
    Q = false;
    let b = new Uint8Array(a);
    let c = window.msgpack.decode(b);
    let d = c[0];
    b = c[1];
    if (d == "6") {
      if (b[0]) {
        let a = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];
        let c;
        a.forEach(a => {
          if (b[0].indexOf(a) > -1) {
            c = "";
            for (let b = 0; b < a.length; ++b) {
              if (b == 1) {
                c += String.fromCharCode(0);
              }
              c += a[b];
            }
            let d = new RegExp(a, "g");
            b[0] = b[0].replace(d, c);
          }
        });
        b[0] = b[0].slice(0, 30);
      }
    } else if (d == "L") {
      b[0] = b[0] + String.fromCharCode(0).repeat(7);
      b[0] = b[0].slice(0, 7);
    } else if (d == "M") {
      b[0].name = b[0].name == "" ? "unknown" : b[0].name;
      b[0].moofoll = true;
      b[0].skin = b[0].skin == 10 ? "__proto__" : b[0].skin;
      T = [b[0].name, b[0].moofoll, b[0].skin];
    } else if (d == "D") {
      if (pa.lastDir == b[0] || [null, undefined].includes(b[0])) {
        Q = true;
      } else {
        pa.lastDir = b[0];
      }
    } else if (d == "d") {
      if (!b[2]) {
        Q = true;
      } else if (![null, undefined].includes(b[1])) {
        pa.lastDir = b[1];
      }
    } else if (d == "K") {
      if (!b[1]) {
        Q = true;
      }
    } else if (d == "S") {
      nc.wait = !nc.wait;
      Q = true;
    } else if (d == "a") {
      if (b[1]) {
        if (ja.moveDir == b[0]) {
          Q = true;
        }
        ja.moveDir = b[0];
      } else {
        Q = true;
      }
    }
    if (!Q) {
      let a = window.msgpack.encode([d, b]);
      this.nsend(a);
      if (!O.sec) {
        O.sec = true;
        setTimeout(() => {
          O.sec = false;
          L = 0;
        }, N);
      }
      L++;
    }
  } else {
    this.nsend(a);
  }
};
function U(a) {
  let b = Array.prototype.slice.call(arguments, 1);
  let c = window.msgpack.encode([a, b]);
  I.send(c);
}
function V(a) {
  let b = Array.prototype.slice.call(arguments, 1);
  let c = window.msgpack.encode([a, b]);
  I.nsend(c);
}
window.leave = function () {
  V("kys", {
    "frvr is so bad": true,
    "sidney is too good": true,
    "dev are too weak": true
  });
};
let W = {
  send: U
};
function X(a) {
  let b = new Uint8Array(a.data);
  let c = window.msgpack.decode(b);
  let d = c[0];
  b = c[1];
  let e = {
    A: $c,
    C: _c,
    D: ad,
    E: bd,
    a: od,
    G: rd,
    H: sd,
    I: td,
    J: ud,
    K: vd,
    L: wd,
    M: xd,
    N: yd,
    O: cd,
    P: dd,
    Q: hd,
    R: id,
    S: ed,
    T: fd,
    U: gd,
    V: zd,
    X: Ad,
    2: Id,
    3: Jd,
    4: Kd,
    5: Ld,
    6: Md,
    7: Nd,
    8: Od,
    9: Ye,
    0: sb
  };
  if (d == "io-init") {
    J = b[0];
  } else if (e[d]) {
    e[d].apply(undefined, b);
  }
}
Math.lerpAngle = function (a, b, c) {
  let d = Math.abs(b - a);
  if (d > Math.PI) {
    if (a > b) {
      b += Math.PI * 2;
    } else {
      a += Math.PI * 2;
    }
  }
  let e = b + (a - b) * c;
  if (e >= 0 && e <= Math.PI * 2) {
    return e;
  }
  return e % (Math.PI * 2);
};
CanvasRenderingContext2D.prototype.roundRect = function (a, b, c, d, e) {
  if (c < e * 2) {
    e = c / 2;
  }
  if (d < e * 2) {
    e = d / 2;
  }
  if (e < 0) {
    e = 0;
  }
  this.beginPath();
  this.moveTo(a + e, b);
  this.arcTo(a + c, b, a + c, b + d, e);
  this.arcTo(a + c, b + d, a, b + d, e);
  this.arcTo(a, b + d, a, b, e);
  this.arcTo(a, b, a + c, b, e);
  this.closePath();
  return this;
};
function Y() {
  ib = {};
  W.send("e");
}
let Z = [];
let _ = {
  tick: 0,
  delay: 0,
  time: [],
  manage: []
};
let aa = [];
let ba = [];
let ca = [];
let da = [];
let ea = [];
let fa = [];
let ga = [];
let ha = [];
let ia = [];
let ja;
let ka;
let la;
let ma = [];
let na = [];
let oa = [];
let pa = {
  reloaded: false,
  waitHit: 0,
  autoAim: false,
  revAim: false,
  ageInsta: true,
  reSync: false,
  bullTick: 0,
  anti0Tick: 0,
  antiSync: false,
  safePrimary: function (a) {
    return [0, 8].includes(a.primaryIndex);
  },
  safeSecondary: function (a) {
    return [10, 11, 14].includes(a.secondaryIndex);
  },
  lastDir: 0,
  autoPush: false,
  pushData: {}
};
function qa(a, b) {
  return a.find(a => a.id == b);
}
function ra(a, b) {
  return a.find(a => a.sid == b);
}
function sa(a) {
  return qa(ba, a);
}
function ta(a) {
  return ra(ba, a);
}
function ua(a) {
  return ra(aa, a);
}
function va(a) {
  return ra(ea, a);
}
function wa(a) {
  return ra(ea, a);
}
let xa = c("adCard");
xa.remove();
let ya = c("promoImgHolder");
ya.remove();
let za = c("chatButton");
za.remove();
let Aa = c("gameCanvas");
let Ba = Aa.getContext("2d");
let Ca = c("mapDisplay");
let Da = Ca.getContext("2d");
Ca.width = 300;
Ca.height = 300;
let Ea = c("storeMenu");
let Fa = c("storeHolder");
let Ga = c("upgradeHolder");
let Ha = c("upgradeCounter");
let Ia = c("chatBox");
Ia.autocomplete = "off";
Ia.style.textAlign = "center";
Ia.style.width = "18em";
let Ja = c("chatHolder");
let Ka = c("actionBar");
let La = c("leaderboardData");
let Ma = c("itemInfoHolder");
let Na = c("menuCardHolder");
let Oa = c("mainMenu");
let Pa = c("diedText");
let Qa;
let Ra;
let Sa = f.maxScreenWidth;
let Ta = f.maxScreenHeight;
let Ua = 1;
let Va;
let Wa;
let Xa = performance.now();
let Ya;
let Za;
let $a;
let _a = 0;
let ab = 0;
let bb = c("allianceMenu");
let cb = 1;
let db = 0;
let eb = "#525252";
let fb = "#3d3f42";
let gb = 5.5;
let hb = true;
let ib = {};
let jb = {
  87: [0, -1],
  38: [0, -1],
  83: [0, 1],
  40: [0, 1],
  65: [-1, 0],
  37: [-1, 0],
  68: [1, 0],
  39: [1, 0]
};
let kb = 0;
let lb = false;
let mb = {};
let nb = {
  place: 0,
  placeSpawnPads: 0
};
let ob;
let pb = [];
let qb = true;
window.onblur = function () {
  qb = false;
};
window.onfocus = function () {
  qb = true;
  if (ja && ja.alive) {}
};
let rb = {
  avg: 0,
  max: 0,
  min: 0,
  delay: 0
};
function sb() {
  let a = window.pingTime;
  const b = document.getElementById("pingDisplay");
  b.innerText = "Ping: " + a + " ms`";
  if (a > rb.max || isNaN(rb.max)) {
    rb.max = a;
  }
  if (a < rb.min || isNaN(rb.min)) {
    rb.min = a;
  }
}
let tb = [];
class ub {
  constructor() {
    let a = Math.abs;
    let b = Math.cos;
    let c = Math.sin;
    let d = Math.pow;
    let e = Math.sqrt;
    let f = Math.atan2;
    let g = Math.PI;
    let h = this;
    this.round = function (a, b) {
      return Math.round(a * b) / b;
    };
    this.toRad = function (a) {
      return a * (g / 180);
    };
    this.toAng = function (a) {
      return a / (g / 180);
    };
    this.randInt = function (a, b) {
      return Math.floor(Math.random() * (b - a + 1)) + a;
    };
    this.randFloat = function (a, b) {
      return Math.random() * (b - a + 1) + a;
    };
    this.lerp = function (a, b, c) {
      return a + (b - a) * c;
    };
    this.decel = function (a, b) {
      if (a > 0) {
        a = Math.max(0, a - b);
      } else if (a < 0) {
        a = Math.min(0, a + b);
      }
      return a;
    };
    this.getDistance = function (a, b, c, d) {
      return e((c -= a) * c + (d -= b) * d);
    };
    this.getDist = function (a, b, c, d) {
      let f = {
        x: c == 0 ? a.x : c == 1 ? a.x1 : c == 2 ? a.x2 : c == 3 && a.x3,
        y: c == 0 ? a.y : c == 1 ? a.y1 : c == 2 ? a.y2 : c == 3 && a.y3
      };
      let g = {
        x: d == 0 ? b.x : d == 1 ? b.x1 : d == 2 ? b.x2 : d == 3 && b.x3,
        y: d == 0 ? b.y : d == 1 ? b.y1 : d == 2 ? b.y2 : d == 3 && b.y3
      };
      return e((g.x -= f.x) * g.x + (g.y -= f.y) * g.y);
    };
    this.getDirection = function (a, b, c, d) {
      return f(b - d, a - c);
    };
    this.getDirect = function (a, b, c, d) {
      let e = {
        x: c == 0 ? a.x : c == 1 ? a.x1 : c == 2 ? a.x2 : c == 3 && a.x3,
        y: c == 0 ? a.y : c == 1 ? a.y1 : c == 2 ? a.y2 : c == 3 && a.y3
      };
      let g = {
        x: d == 0 ? b.x : d == 1 ? b.x1 : d == 2 ? b.x2 : d == 3 && b.x3,
        y: d == 0 ? b.y : d == 1 ? b.y1 : d == 2 ? b.y2 : d == 3 && b.y3
      };
      return f(e.y - g.y, e.x - g.x);
    };
    this.getAngleDist = function (b, c) {
      let d = a(c - b) % (g * 2);
      if (d > g) {
        return g * 2 - d;
      } else {
        return d;
      }
    };
    this.isNumber = function (a) {
      return typeof a == "number" && !isNaN(a) && isFinite(a);
    };
    this.isString = function (a) {
      return a && typeof a == "string";
    };
    this.kFormat = function (a) {
      if (a > 999) {
        return (a / 1000).toFixed(1) + "k";
      } else {
        return a;
      }
    };
    this.sFormat = function (a) {
      let b = [{
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
      let c = b.find(b => a >= b.num);
      if (!c) {
        return a;
      }
      return (a / c.num).toFixed(1) + c.string;
    };
    this.capitalizeFirst = function (a) {
      return a.charAt(0).toUpperCase() + a.slice(1);
    };
    this.fixTo = function (a, b) {
      return parseFloat(a.toFixed(b));
    };
    this.sortByPoints = function (a, b) {
      return parseFloat(b.points) - parseFloat(a.points);
    };
    this.lineInRect = function (a, b, c, d, e, f, g, h) {
      let i = e;
      let j = g;
      if (e > g) {
        i = g;
        j = e;
      }
      if (j > c) {
        j = c;
      }
      if (i < a) {
        i = a;
      }
      if (i > j) {
        return false;
      }
      let k = f;
      let l = h;
      let m = g - e;
      if (Math.abs(m) > 1e-7) {
        let a = (h - f) / m;
        let b = f - a * e;
        k = a * i + b;
        l = a * j + b;
      }
      if (k > l) {
        let a = l;
        l = k;
        k = a;
      }
      if (l > d) {
        l = d;
      }
      if (k < b) {
        k = b;
      }
      if (k > l) {
        return false;
      }
      return true;
    };
    this.containsPoint = function (a, b, c) {
      let d = a.getBoundingClientRect();
      let e = d.left + window.scrollX;
      let f = d.top + window.scrollY;
      let g = d.width;
      let h = d.height;
      let i = b > e && b < e + g;
      let j = c > f && c < f + h;
      return i && j;
    };
    this.mousifyTouchEvent = function (a) {
      let b = a.changedTouches[0];
      a.screenX = b.screenX;
      a.screenY = b.screenY;
      a.clientX = b.clientX;
      a.clientY = b.clientY;
      a.pageX = b.pageX;
      a.pageY = b.pageY;
    };
    this.hookTouchEvents = function (a, b) {
      let c = !b;
      let d = false;
      let e = false;
      a.addEventListener("touchstart", this.checkTrusted(f), e);
      a.addEventListener("touchmove", this.checkTrusted(g), e);
      a.addEventListener("touchend", this.checkTrusted(i), e);
      a.addEventListener("touchcancel", this.checkTrusted(i), e);
      a.addEventListener("touchleave", this.checkTrusted(i), e);
      function f(b) {
        h.mousifyTouchEvent(b);
        window.setUsingTouch(true);
        if (c) {
          b.preventDefault();
          b.stopPropagation();
        }
        if (a.onmouseover) {
          a.onmouseover(b);
        }
        d = true;
      }
      function g(b) {
        h.mousifyTouchEvent(b);
        window.setUsingTouch(true);
        if (c) {
          b.preventDefault();
          b.stopPropagation();
        }
        if (h.containsPoint(a, b.pageX, b.pageY)) {
          if (!d) {
            if (a.onmouseover) {
              a.onmouseover(b);
            }
            d = true;
          }
        } else if (d) {
          if (a.onmouseout) {
            a.onmouseout(b);
          }
          d = false;
        }
      }
      function i(b) {
        h.mousifyTouchEvent(b);
        window.setUsingTouch(true);
        if (c) {
          b.preventDefault();
          b.stopPropagation();
        }
        if (d) {
          if (a.onclick) {
            a.onclick(b);
          }
          if (a.onmouseout) {
            a.onmouseout(b);
          }
          d = false;
        }
      }
    };
    this.removeAllChildren = function (a) {
      while (a.hasChildNodes()) {
        a.removeChild(a.lastChild);
      }
    };
    this.generateElement = function (a) {
      let b = document.createElement(a.tag || "div");
      function c(c, d) {
        if (a[c]) {
          b[d] = a[c];
        }
      }
      c("text", "textContent");
      c("html", "innerHTML");
      c("class", "className");
      for (let c in a) {
        switch (c) {
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
        b[c] = a[c];
      }
      if (b.onclick) {
        b.onclick = this.checkTrusted(b.onclick);
      }
      if (b.onmouseover) {
        b.onmouseover = this.checkTrusted(b.onmouseover);
      }
      if (b.onmouseout) {
        b.onmouseout = this.checkTrusted(b.onmouseout);
      }
      if (a.style) {
        b.style.cssText = a.style;
      }
      if (a.hookTouch) {
        this.hookTouchEvents(b);
      }
      if (a.parent) {
        a.parent.appendChild(b);
      }
      if (a.children) {
        for (let c = 0; c < a.children.length; c++) {
          b.appendChild(a.children[c]);
        }
      }
      return b;
    };
    this.checkTrusted = function (a) {
      return function (b) {
        if (b && b instanceof Event && (b && typeof b.isTrusted == "boolean" ? b.isTrusted : true)) {
          a(b);
        } else {}
      };
    };
    this.randomString = function (a) {
      let b = "";
      let c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let d = 0; d < a; d++) {
        b += c.charAt(Math.floor(Math.random() * c.length));
      }
      return b;
    };
    this.countInArray = function (a, b) {
      let c = 0;
      for (let d = 0; d < a.length; d++) {
        if (a[d] === b) {
          c++;
        }
      }
      return c;
    };
    this.hexToRgb = function (a) {
      return a.slice(1).match(/.{1,2}/g).map(a => parseInt(a, 16));
    };
    this.getRgb = function (a, b, c) {
      return [a / 255, b / 255, c / 255].join(", ");
    };
  }
}
;
class vb {
  constructor() {
    this.init = function (a, b, c, d, e, f, g) {
      this.x = a;
      this.y = b;
      this.color = g;
      this.scale = c * 3.5;
      this.weight = 50;
      this.startScale = this.scale * 1.2;
      this.maxScale = c * 1.5;
      this.minScale = c * 0.5;
      this.scaleSpeed = 0.7;
      this.speed = d;
      this.speedMax = d;
      this.life = e;
      this.maxLife = e;
      this.text = f;
      this.movSpeed = d;
    };
    this.update = function (a) {
      if (this.life) {
        this.life -= a;
        if (this.scaleSpeed != -0.35) {
          this.y -= this.speed * a;
        } else {
          this.y -= this.speed * a;
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
    this.render = function (a, b, c) {
      a.lineWidth = 10;
      a.strokeStyle = fb;
      a.fillStyle = this.color;
      a.globalAlpha = 1;
      a.font = this.scale + "px Hammersmith One";
      a.strokeText(this.text, this.x - b, this.y - c);
      a.fillText(this.text, this.x - b, this.y - c);
      a.globalAlpha = 1;
    };
  }
}
;
class wb {
  constructor() {
    this.texts = [];
    this.stack = [];
    this.update = function (a, b, c, d) {
      b.textBaseline = "middle";
      b.textAlign = "center";
      for (let e = 0; e < this.texts.length; ++e) {
        if (this.texts[e].life) {
          this.texts[e].update(a);
          this.texts[e].render(b, c, d);
        }
      }
    };
    this.showText = function (a, b, c, d, e, f, g) {
      let h;
      for (let i = 0; i < this.texts.length; ++i) {
        if (!this.texts[i].life) {
          h = this.texts[i];
          break;
        }
      }
      if (!h) {
        h = new vb();
        this.texts.push(h);
      }
      h.init(a, b, c, d, e, f, g);
    };
  }
}
class xb {
  constructor(a) {
    this.sid = a;
    this.init = function (a, b, c, d, e, f, g) {
      f = f || {};
      this.sentTo = {};
      this.gridLocations = [];
      this.active = true;
      this.render = true;
      this.doUpdate = f.doUpdate;
      this.x = a;
      this.y = b;
      this.dir = c;
      this.lastDir = c;
      this.xWiggle = 0;
      this.yWiggle = 0;
      this.visScale = d;
      this.scale = d;
      this.type = e;
      this.id = f.id;
      this.owner = g;
      this.name = f.name;
      this.isItem = this.id != undefined;
      this.group = f.group;
      this.maxHealth = f.health;
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
      this.colDiv = f.colDiv || 1;
      this.blocker = f.blocker;
      this.ignoreCollision = f.ignoreCollision;
      this.dontGather = f.dontGather;
      this.hideFromEnemy = f.hideFromEnemy;
      this.friction = f.friction;
      this.projDmg = f.projDmg;
      this.dmg = f.dmg;
      this.pDmg = f.pDmg;
      this.pps = f.pps;
      this.zIndex = f.zIndex || 0;
      this.turnSpeed = f.turnSpeed;
      this.req = f.req;
      this.trap = f.trap;
      this.healCol = f.healCol;
      this.teleport = f.teleport;
      this.boostSpeed = f.boostSpeed;
      this.projectile = f.projectile;
      this.shootRange = f.shootRange;
      this.shootRate = f.shootRate;
      this.shootCount = this.shootRate;
      this.spawnPoint = f.spawnPoint;
      this.onNear = 0;
      this.breakObj = false;
      this.alpha = f.alpha || 1;
      this.maxAlpha = f.alpha || 1;
      this.damaged = 0;
    };
    this.changeHealth = function (a, b) {
      this.health += a;
      return this.health <= 0;
    };
    this.getScale = function (a, b) {
      a = a || 1;
      return this.scale * (this.isItem || this.type == 2 || this.type == 3 || this.type == 4 ? 1 : a * 0.6) * (b ? 1 : this.colDiv);
    };
    this.visibleToPlayer = function (a) {
      return !this.hideFromEnemy || this.owner && (this.owner == a || this.owner.team && a.team == this.owner.team);
    };
    this.update = function (a) {
      if (this.active) {
        if (this.xWiggle) {
          this.xWiggle *= Math.pow(0.99, a);
        }
        if (this.yWiggle) {
          this.yWiggle *= Math.pow(0.99, a);
        }
        let b = dc.getAngleDist(this.lastDir, this.dir);
        if (b > 0.01) {
          this.dir += b / 5;
        } else {
          this.dir = this.lastDir;
        }
      } else if (this.alive) {
        this.alpha -= a / (200 / this.maxAlpha);
        this.visScale += a / (this.scale / 2.5);
        if (this.alpha <= 0) {
          this.alpha = 0;
          this.alive = false;
        }
      }
    };
    this.isTeamObject = function (a) {
      if (this.owner == null) {
        return true;
      } else {
        return this.owner && a.sid == this.owner.sid || a.findAllianceBySid(this.owner.sid);
      }
    };
  }
}
class yb {
  constructor() {
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
    }, {
      id: 5,
      name: "trap",
      place: true,
      limit: 6,
      layer: -1
    }, {
      id: 6,
      name: "booster",
      place: true,
      limit: 12,
      layer: -1
    }, {
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
    }, {
      id: 9,
      name: "buff",
      place: true,
      limit: 4,
      layer: -1
    }, {
      id: 10,
      name: "spawn",
      place: true,
      limit: 1,
      layer: -1
    }, {
      id: 11,
      name: "sapling",
      place: true,
      limit: 2,
      layer: 0
    }, {
      id: 12,
      name: "blocker",
      place: true,
      limit: 3,
      layer: -1
    }, {
      id: 13,
      name: "teleporter",
      place: true,
      limit: 2,
      layer: -1
    }];
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
    this.weapons = [{
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
      consume: function (a) {
        return a.changeHealth(20, a);
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
      consume: function (a) {
        return a.changeHealth(40, a);
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
      consume: function (a) {
        if (a.changeHealth(30, a) || a.health < 100) {
          a.dmgOverTime.dmg = -10;
          a.dmgOverTime.doer = a;
          a.dmgOverTime.time = 5;
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
      itemAID: 22,
      shadow: {
        offsetX: 5,
        offsetY: 5,
        blur: 20,
        color: "rgba(0, 0, 0, 0.5)"
      }
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
      index: function (a, b) {
        if ([0, 1, 2].includes(a)) {
          return 0;
        } else if ([3, 4, 5].includes(a)) {
          return 1;
        } else if ([6, 7, 8, 9].includes(a)) {
          return 2;
        } else if ([10, 11, 12].includes(a)) {
          return 3;
        } else if ([13, 14].includes(a)) {
          return 5;
        } else if ([15, 16].includes(a)) {
          return 4;
        } else if ([17, 18, 19, 21, 22].includes(a)) {
          if ([13, 14].includes(b)) {
            return 6;
          } else {
            return 5;
          }
        } else if (a == 20) {
          if ([13, 14].includes(b)) {
            return 7;
          } else {
            return 6;
          }
        } else {
          return undefined;
        }
      }
    };
    for (let a = 0; a < this.list.length; ++a) {
      this.list[a].id = a;
      if (this.list[a].pre) {
        this.list[a].pre = a - this.list[a].pre;
      }
    }
    if (typeof window !== "undefined") {
      function a(a) {
        for (let b = a.length - 1; b > 0; b--) {
          const c = Math.floor(Math.random() * (b + 1));
          [a[b], a[c]] = [a[c], a[b]];
        }
        return a;
      }
    }
  }
}
class zb {
  constructor(a, b, c, d, e, f) {
    let g = Math.floor;
    let h = Math.abs;
    let i = Math.cos;
    let j = Math.sin;
    let k = Math.pow;
    let l = Math.sqrt;
    this.ignoreAdd = false;
    this.hitObj = [];
    this.disableObj = function (a) {
      a.active = false;
    };
    let m;
    this.add = function (b, c, d, e, f, g, h, i, j) {
      m = va(b);
      if (!m) {
        m = ea.find(a => !a.active);
        if (!m) {
          m = new a(b);
          ea.push(m);
        }
      }
      if (i) {
        m.sid = b;
      }
      m.init(c, d, e, f, g, h, j);
    };
    this.disableBySid = function (a) {
      let b = va(a);
      if (b) {
        this.disableObj(b);
      }
    };
    this.removeAllItems = function (a, b) {
      ea.filter(b => b.active && b.owner && b.owner.sid == a).forEach(a => this.disableObj(a));
    };
    this.checkItemLocation = function (a, e, f, g, h, i, j) {
      let k = b.find(b => b.active && c.getDistance(a, e, b.x, b.y) < f + (b.blocker ? b.blocker : b.getScale(g, b.isItem)));
      if (k) {
        return false;
      }
      if (!i && h != 18 && e >= d.mapScale / 2 - d.riverWidth / 2 && e <= d.mapScale / 2 + d.riverWidth / 2) {
        return false;
      }
      return true;
    };
  }
}
class Ab {
  constructor(a, b, c, d, e, f, g) {
    this.init = function (a, b, c, d, e, f, g, h, i) {
      this.active = true;
      this.tickActive = true;
      this.indx = a;
      this.x = b;
      this.y = c;
      this.x2 = b;
      this.y2 = c;
      this.dir = d;
      this.skipMov = true;
      this.speed = e;
      this.dmg = f;
      this.scale = h;
      this.range = g;
      this.r2 = g;
      this.owner = i;
    };
    this.update = function (a) {
      if (this.active) {
        let b = this.speed * a;
        if (!this.skipMov) {
          this.x += b * Math.cos(this.dir);
          this.y += b * Math.sin(this.dir);
          this.range -= b;
          if (this.range <= 0) {
            this.x += this.range * Math.cos(this.dir);
            this.y += this.range * Math.sin(this.dir);
            b = 1;
            this.range = 0;
            this.active = false;
          }
        } else {
          this.skipMov = false;
        }
      }
    };
    this.tickUpdate = function (a) {
      if (this.tickActive) {
        let b = this.speed * a;
        if (!this.skipMov) {
          this.x2 += b * Math.cos(this.dir);
          this.y2 += b * Math.sin(this.dir);
          this.r2 -= b;
          if (this.r2 <= 0) {
            this.x2 += this.r2 * Math.cos(this.dir);
            this.y2 += this.r2 * Math.sin(this.dir);
            b = 1;
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
class Bb {
  constructor() {
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
    }, {
      id: 7,
      name: "Bull Helmet",
      price: 6000,
      scale: 120,
      desc: "increases damage done but drains health",
      healthRegen: -5,
      dmgMultO: 1.5,
      spdMult: 0.96
    }, {
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
class Cb {
  constructor(a, b, c, d, e, f, g, h, i) {
    this.addProjectile = function (j, k, l, m, n, o, p, q, r, s) {
      let t = f.projectiles[o];
      let u;
      for (let a = 0; a < b.length; ++a) {
        if (!b[a].active) {
          u = b[a];
          break;
        }
      }
      if (!u) {
        u = new a(c, d, e, f, g, h, i);
        u.sid = b.length;
        b.push(u);
      }
      u.init(o, j, k, l, n, t.dmg, m, t.scale, p);
      u.ignoreObj = q;
      u.layer = r || t.layer;
      u.inWindow = s;
      u.src = t.src;
      return u;
    };
  }
}
;
class Db {
  constructor(a, b, c, d, e, f, g, h, i) {
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
    }];
    this.spawn = function (j, k, l, m) {
      let n = a.find(a => !a.active);
      if (!n) {
        n = new b(a.length, e, c, d, g, f, h, i);
        a.push(n);
      }
      n.init(j, k, l, m, this.aiTypes[m]);
      return n;
    };
  }
}
;
class Eb {
  constructor(a, b, c, d, e, f, g, h) {
    this.sid = a;
    this.isAI = true;
    this.nameIndex = e.randInt(0, f.cowNames.length - 1);
    this.init = function (a, b, c, d, e) {
      this.x = a;
      this.y = b;
      this.startX = e.fixedSpawn ? a : null;
      this.startY = e.fixedSpawn ? b : null;
      this.xVel = 0;
      this.yVel = 0;
      this.zIndex = 0;
      this.dir = c;
      this.dirPlus = 0;
      this.showName = "aaa";
      this.index = d;
      this.src = e.src;
      if (e.name) {
        this.name = e.name;
      }
      this.weightM = e.weightM;
      this.speed = e.speed;
      this.killScore = e.killScore;
      this.turnSpeed = e.turnSpeed;
      this.scale = e.scale;
      this.maxHealth = e.health;
      this.leapForce = e.leapForce;
      this.health = this.maxHealth;
      this.chargePlayer = e.chargePlayer;
      this.viewRange = e.viewRange;
      this.drop = e.drop;
      this.dmg = e.dmg;
      this.hostile = e.hostile;
      this.dontRun = e.dontRun;
      this.hitRange = e.hitRange;
      this.hitDelay = e.hitDelay;
      this.hitScare = e.hitScare;
      this.spriteMlt = e.spriteMlt;
      this.nameScale = e.nameScale;
      this.colDmg = e.colDmg;
      this.noTrap = e.noTrap;
      this.spawnDelay = e.spawnDelay;
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
    let i = 0;
    let j = 0;
    this.animate = function (a) {
      if (this.animTime > 0) {
        this.animTime -= a;
        if (this.animTime <= 0) {
          this.animTime = 0;
          this.dirPlus = 0;
          i = 0;
          j = 0;
        } else if (j == 0) {
          i += a / (this.animSpeed * f.hitReturnRatio);
          this.dirPlus = e.lerp(0, this.targetAngle, Math.min(1, i));
          if (i >= 1) {
            i = 1;
            j = 1;
          }
        } else {
          i -= a / (this.animSpeed * (1 - f.hitReturnRatio));
          this.dirPlus = e.lerp(0, this.targetAngle, Math.max(0, i));
        }
      }
    };
    this.startAnim = function () {
      this.animTime = this.animSpeed = 600;
      this.targetAngle = Math.PI * 0.8;
      i = 0;
      j = 0;
    };
  }
}
;
class Fb {
  constructor(a, b, c, d) {
    this.x = a;
    this.y = b;
    this.alpha = 0;
    this.active = true;
    this.alive = false;
    this.chat = c;
    this.owner = d;
  }
}
;
class Gb {
  constructor(a, b, c, d, e, f, g, h, i) {
    this.x = a;
    this.y = b;
    this.lastDir = c;
    this.dir = c + Math.PI;
    this.buildIndex = d;
    this.weaponIndex = e;
    this.weaponVariant = f;
    this.skinColor = g;
    this.scale = h;
    this.visScale = 0;
    this.name = i;
    this.alpha = 1;
    this.active = true;
    this.animate = function (a) {
      let b = dc.getAngleDist(this.lastDir, this.dir);
      if (b > 0.01) {
        this.dir += b / 20;
      } else {
        this.dir = this.lastDir;
      }
      if (this.visScale < this.scale) {
        this.visScale += a / (this.scale / 2);
        if (this.visScale >= this.scale) {
          this.visScale = this.scale;
        }
      }
      this.alpha -= a / 30000;
      if (this.alpha <= 0) {
        this.alpha = 0;
        this.active = false;
      }
    };
  }
}
;
class Hb {
  constructor(a, b, d, e, f, g, h, i, j, k, l, m, n, o) {
    this.id = a;
    this.sid = b;
    this.tmpScore = 0;
    this.team = null;
    this.latestSkin = 0;
    this.oldSkinIndex = 0;
    this.skinIndex = 0;
    this.latestTail = 0;
    this.oldTailIndex = 0;
    this.tailIndex = 0;
    this.hitTime = 0;
    this.lastHit = 0;
    this.showName = "NOOO";
    this.tails = {};
    for (let c = 0; c < l.length; ++c) {
      if (l[c].price <= 0) {
        this.tails[l[c].id] = 1;
      }
    }
    this.skins = {};
    for (let c = 0; c < k.length; ++c) {
      if (k[c].price <= 0) {
        this.skins[k[c].id] = 1;
      }
    }
    this.points = 0;
    this.dt = 0;
    this.hidden = false;
    this.itemCounts = {};
    this.isPlayer = true;
    this.pps = 0;
    this.moveDir = undefined;
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
    this.spawn = function (a) {
      this.attacked = false;
      this.timeDamaged = 0;
      this.timeHealed = 0;
      this.pinge = 0;
      this.millPlace = "NOOO";
      this.lastshamecount = 0;
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
      this.scale = d.playerScale;
      this.speed = d.playerSpeed;
      this.resetMoveDir();
      this.resetResources(a);
      this.items = [0, 3, 6, 10];
      this.weapons = [0];
      this.shootCount = 0;
      this.weaponXP = [];
      this.reloads = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 0,
        53: 0
      };
      this.bowThreat = {
        9: 0,
        12: 0,
        13: 0,
        15: 0
      };
      this.damageThreat = 0;
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
    this.resetResources = function (a) {
      for (let b = 0; b < d.resourceTypes.length; ++b) {
        this[d.resourceTypes[b]] = a ? 100 : 0;
      }
    };
    this.getItemType = function (a) {
      let b = this.items.findIndex(b => b == a);
      if (b != -1) {
        return b;
      } else {
        return j.checkItem.index(a, this.items);
      }
    };
    this.setData = function (a) {
      this.id = a[0];
      this.sid = a[1];
      this.name = a[2];
      this.x = a[3];
      this.y = a[4];
      this.dir = a[5];
      this.health = a[6];
      this.maxHealth = a[7];
      this.scale = a[8];
      this.skinColor = a[9];
    };
    this.updateTimer = function () {
      this.bullTimer -= 1;
      if (this.bullTimer <= 0) {
        this.setBullTick = false;
        this.bullTick = P.tick - 1;
        this.bullTimer = d.serverUpdateRate;
      }
      this.poisonTimer -= 1;
      if (this.poisonTimer <= 0) {
        this.setPoisonTick = false;
        this.poisonTick = P.tick - 1;
        this.poisonTimer = d.serverUpdateRate;
      }
    };
    this.update = function (a) {
      if (this.sid == ka) {
        this.circleRad = parseInt(c("circleRad").value) || 0;
        this.circleRadSpd = parseFloat(c("radSpeed").value) || 0;
        this.cAngle += this.circleRadSpd;
      }
      if (this.active) {
        let a = {
          skin: qa(k, this.skinIndex),
          tail: qa(l, this.tailIndex)
        };
        let b = (this.buildIndex >= 0 ? 0.5 : 1) * (j.weapons[this.weaponIndex].spdMult || 1) * (a.skin ? a.skin.spdMult || 1 : 1) * (a.tail ? a.tail.spdMult || 1 : 1) * (this.y <= d.snowBiomeTop ? a.skin && a.skin.coldM ? 1 : d.snowSpeed : 1) * this.slowMult;
        this.maxSpeed = b;
      }
    };
    let p = 0;
    let q = 0;
    this.animate = function (a) {
      if (this.animTime > 0) {
        this.animTime -= a;
        if (this.animTime <= 0) {
          this.animTime = 0;
          this.dirPlus = 0;
          p = 0;
          q = 0;
        } else if (q == 0) {
          p += a / (this.animSpeed * d.hitReturnRatio);
          this.dirPlus = e.lerp(0, this.targetAngle, Math.min(1, p));
          if (p >= 1) {
            p = 1;
            q = 1;
          }
        } else {
          p -= a / (this.animSpeed * (1 - d.hitReturnRatio));
          this.dirPlus = e.lerp(0, this.targetAngle, Math.max(0, p));
        }
      }
    };
    this.startAnim = function (a, b) {
      this.animTime = this.animSpeed = j.weapons[b].speed;
      this.targetAngle = a ? -d.hitAngle : -Math.PI;
      p = 0;
      q = 0;
    };
    this.canSee = function (a) {
      if (!a) {
        return false;
      }
      let b = Math.abs(a.x - this.x) - a.scale;
      let c = Math.abs(a.y - this.y) - a.scale;
      return b <= d.maxScreenWidth / 2 * 1.3 && c <= d.maxScreenHeight / 2 * 1.3;
    };
    this.judgeShame = function () {
      this.lastshamecount = this.shameCount;
      if (this.oldHealth < this.health) {
        if (this.hitTime) {
          let a = P.tick - this.hitTime;
          this.lastHit = P.tick;
          this.hitTime = 0;
          if (a < 2) {
            this.shameCount++;
          } else {
            this.shameCount = Math.max(0, this.shameCount - 2);
          }
        }
      } else if (this.oldHealth > this.health) {
        this.hitTime = P.tick;
      }
    };
    this.addShameTimer = function () {
      this.shameCount = 0;
      this.shameTimer = 30;
      let a = setInterval(() => {
        this.shameTimer--;
        if (this.shameTimer <= 0) {
          clearInterval(a);
        }
      }, 1000);
    };
    this.isTeam = function (a) {
      return this == a || this.team && this.team == a.team;
    };
    this.findAllianceBySid = function (a) {
      if (this.team) {
        return da.find(b => b === a);
      } else {
        return null;
      }
    };
    this.checkCanInsta = function (a) {
      let b = 0;
      if (this.alive && lb) {
        let c = {
          weapon: this.weapons[0],
          variant: this.primaryVariant,
          dmg: this.weapons[0] == undefined ? 0 : j.weapons[this.weapons[0]].dmg
        };
        let e = {
          weapon: this.weapons[1],
          variant: this.secondaryVariant,
          dmg: this.weapons[1] == undefined ? 0 : j.weapons[this.weapons[1]].Pdmg
        };
        let f = this.skins[7] && !a ? 1.5 : 1;
        let g = c.variant != undefined ? d.weaponVariants[c.variant].val : 1;
        if (c.weapon != undefined && this.reloads[c.weapon] == 0) {
          b += c.dmg * g * f;
        }
        if (e.weapon != undefined && this.reloads[e.weapon] == 0) {
          b += e.dmg;
        }
        if (this.skins[53] && this.reloads[53] <= (ja.weapons[1] == 10 ? 0 : P.tickRate) && oa.skinIndex != 22) {
          b += 25;
        }
        b *= oa.skinIndex == 6 ? 0.75 : 1;
        return b;
      }
      return 0;
    };
    this.manageReload = function () {
      if (this.shooting[53]) {
        this.shooting[53] = 0;
        this.reloads[53] = 2500 - P.tickRate;
      } else if (this.reloads[53] > 0) {
        this.reloads[53] = Math.max(0, this.reloads[53] - P.tickRate);
      }
      if (this.reloads[this.weaponIndex] <= 1000 / 9) {
        let a = this.weaponIndex;
        let b = fa.filter(a => (a.active || a.alive) && a.health < a.maxHealth && a.group !== undefined && e.getDist(a, ja, 0, 2) <= j.weapons[ja.weaponIndex].range + a.scale);
        for (let c = 0; c < b.length; c++) {
          let e = b[c];
          let f = j.weapons[a].dmg * d.weaponVariants[la[(a < 9 ? "prima" : "seconda") + "ryVariant"]].val * (j.weapons[a].sDmg || 1) * 3.3;
          let g = j.weapons[a].dmg * d.weaponVariants[la[(a < 9 ? "prima" : "seconda") + "ryVariant"]].val * (j.weapons[a].sDmg || 1);
          if (e.health - g <= 0 && oa.length) {
            Qb(oa.dist2 < oa.scale * 1.8 + 50 ? 4 : 2, kd(e, ja) + Math.PI);
          }
        }
      }
      if (this.gathering || this.shooting[1]) {
        if (this.gathering) {
          this.gathering = 0;
          this.reloads[this.gatherIndex] = j.weapons[this.gatherIndex].speed * (this.skinIndex == 20 ? 0.78 : 1);
          this.attacked = true;
        }
        if (this.shooting[1]) {
          this.shooting[1] = 0;
          this.reloads[this.shootIndex] = j.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1);
          this.attacked = true;
        }
      } else {
        this.attacked = false;
        if (this.buildIndex < 0) {
          if (this.reloads[this.weaponIndex] > 0) {
            this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - 110);
            if (this == ja) {
              if (c("weaponGrind").checked) {
                for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
                  Rb(ja.getItemType(22), a);
                }
              }
            }
            if (this.reloads[this.primaryIndex] == 0 && this.reloads[this.weaponIndex] == 0) {
              this.antiBull++;
              P.tickBase(() => {
                this.antiBull = 0;
              }, 1);
            }
          }
        }
      }
    };
    this.addDamageThreat = function (a) {
      let b = {
        weapon: this.primaryIndex,
        variant: this.primaryVariant
      };
      b.dmg = b.weapon == undefined ? 45 : j.weapons[b.weapon].dmg;
      let c = {
        weapon: this.secondaryIndex,
        variant: this.secondaryVariant
      };
      c.dmg = c.weapon == undefined ? 75 : j.weapons[c.weapon].Pdmg;
      let e = 1.5;
      let f = b.variant != undefined ? d.weaponVariants[b.variant].val : 1.18;
      let g = c.variant != undefined ? [9, 12, 13, 15].includes(c.weapon) ? 1 : d.weaponVariants[c.variant].val : 1.18;
      if (b.weapon == undefined ? true : this.reloads[b.weapon] == 0) {
        this.damageThreat += b.dmg * f * e;
      }
      if (c.weapon == undefined ? true : this.reloads[c.weapon] == 0) {
        this.damageThreat += c.dmg * g;
      }
      if (this.reloads[53] <= P.tickRate) {
        this.damageThreat += 25;
      }
      this.damageThreat *= a.skinIndex == 6 ? 0.75 : 1;
      if (!this.isTeam(a)) {
        if (this.dist2 <= 300) {
          a.damageThreat += this.damageThreat;
        }
      }
    };
  }
}
;
function Ib(a) {
  ja.reloads[a] = 0;
  U("H", a);
}
function Jb(a, b) {
  U("c", 0, a, b);
}
function Kb(a, b) {
  U("c", 1, a, b);
}
function Lb(a, b) {
  let c = ja.skins[6] ? 6 : 0;
  if (ja.alive && lb) {
    if (b == 0) {
      if (ja.skins[a]) {
        if (ja.latestSkin != a) {
          U("c", 0, a, 0);
        }
      } else if (q.autoBuyEquip) {
        let b = qa(hc, a);
        if (b) {
          if (ja.points >= b.price) {
            U("c", 1, a, 0);
            U("c", 0, a, 0);
          } else if (ja.latestSkin != c) {
            U("c", 0, c, 0);
          }
        } else if (ja.latestSkin != c) {
          U("c", 0, c, 0);
        }
      } else if (ja.latestSkin != c) {
        U("c", 0, c, 0);
      }
    } else if (b == 1) {
      if (K && a != 11 && a != 0) {
        if (ja.latestTail != 0) {
          U("c", 0, 0, 1);
        }
        return;
      }
      if (ja.tails[a]) {
        if (ja.latestTail != a) {
          U("c", 0, a, 1);
        }
      } else if (q.autoBuyEquip) {
        let b = qa(ic, a);
        if (b) {
          if (ja.points >= b.price) {
            U("c", 1, a, 1);
            U("c", 0, a, 1);
          } else if (ja.latestTail != 0) {
            U("c", 0, 0, 1);
          }
        } else if (ja.latestTail != 0) {
          U("c", 0, 0, 1);
        }
      } else if (ja.latestTail != 0) {
        U("c", 0, 0, 1);
      }
    }
  }
}
function Mb(a, b) {
  U("G", a, b);
}
function Nb(a, b) {
  if (!b) {
    ja.weaponCode = a;
  }
  U("G", a, 1);
}
function Ob() {
  U("K", 1, 1);
}
function Pb(a, b) {
  U("d", a, b, 1);
}
function Qb(a, b, d) {
  try {
    if (a == undefined) {
      return;
    }
    let e = ec.list[ja.items[a]];
    let g = ja.scale + e.scale + (e.placeOffset || 0);
    let h = ja.x2 + g * Math.cos(b);
    let i = ja.y2 + g * Math.sin(b);
    if (ja.alive && lb && ja.itemCounts[e.group.id] == undefined ? true : ja.itemCounts[e.group.id] < (f.isSandbox ? 299 : e.group.limit ? e.group.limit : 99)) {
      Mb(ja.items[a]);
      Pb(1, b);
      Nb(ja.weaponCode, 1);
      if (d && c("placeVis").checked) {
        tb.push({
          x: h,
          y: i,
          name: e.name,
          scale: e.scale,
          dir: b
        });
        P.tickBase(() => {
          tb.shift();
        }, 1);
      }
    }
  } catch (a) {}
}
function Rb(a, b) {
  try {
    if (a == undefined) {
      return;
    }
    let c = ec.list[ja.items[a]];
    let d = ja.scale + c.scale + (c.placeOffset || 0);
    let e = ja.x2 + d * Math.cos(b);
    let f = ja.y2 + d * Math.sin(b);
    if (fc.checkItemLocation(e, f, c.scale, 0.6, c.id, false, ja)) {
      Qb(a, b, 1);
    }
  } catch (a) {}
}
function Sb() {
  if (ja.latestSkin == 6) {
    return 0.75;
  } else {
    return 1;
  }
}
function Tb() {
  if (ja.health == 100) {
    return 0;
  }
  if (ja.skinIndex != 45 && ja.skinIndex != 56) {
    return Math.ceil((100 - ja.health) / ec.list[ja.items[0]].healing);
  }
  return 0;
}
function Ub(a) {
  let b = ma.filter(a => {
    let b = {
      three: a.attacked
    };
    return b.three;
  });
  return b;
}
function Vb() {
  for (let a = 0; a < Tb(); a++) {
    Qb(0, Oc());
  }
}
function Wb(a) {
  pa.antiSync = true;
  let b = setInterval(() => {
    if (ja.shameCount < 5) {
      Qb(0, Oc());
    }
  }, 75);
  setTimeout(() => {
    clearInterval(b);
    setTimeout(() => {
      pa.antiSync = false;
    }, P.tickRate);
  }, P.tickRate);
}
function Xb(a, b) {
  if (ja.y2 >= f.mapScale / 2 - f.riverWidth / 2 && ja.y2 <= f.mapScale / 2 + f.riverWidth / 2) {
    if (b) {
      return 31;
    }
    Lb(31, 0);
  } else if (ja.y2 <= f.snowBiomeTop) {
    if (b) {
      if (a && ja.moveDir == undefined) {
        return 6;
      } else {
        return 15;
      }
    }
    Lb(a && ja.moveDir == undefined ? 6 : 15, 0);
  } else {
    if (b) {
      if (a && ja.moveDir == undefined) {
        return 6;
      } else {
        return 12;
      }
    }
    Lb(a && ja.moveDir == undefined ? 6 : 12, 0);
  }
  if (b) {
    return 0;
  }
}
function Yb(a) {
  Lb(a && ja.moveDir == undefined ? 0 : 11, 1);
}
class Zb {
  constructor(a, b) {
    this.dist = 0;
    this.aim = 0;
    this.inTrap = false;
    this.replaced = false;
    this.antiTrapped = false;
    this.info = {};
    this.notFast = function () {
      return ja.weapons[1] == 10 && (this.info.health > b.weapons[ja.weapons[0]].dmg || ja.weapons[0] == 5);
    };
    this.testCanPlace = function (c, d = undefined, e = undefined, g = undefined, h, i, j) {
      if (d === undefined) d = -(Math.PI / 2);
      if (e === undefined) e = Math.PI / 2;
      if (g === undefined) g = Math.PI / 18;
      try {
        let k = b.list[ja.items[c]];
        let l = ja.scale + k.scale + (k.placeOffset || 0);
        let m = {
          attempts: 0,
          placed: 0
        };
        let n = [];
        fa.forEach(a => {
          n.push({
            x: a.x,
            y: a.y,
            active: a.active,
            blocker: a.blocker,
            scale: a.scale,
            isItem: a.isItem,
            type: a.type,
            colDiv: a.colDiv,
            getScale: function (a, b) {
              a = a || 1;
              return this.scale * (this.isItem || this.type == 2 || this.type == 3 || this.type == 4 ? 1 : a * 0.6) * (b ? 1 : this.colDiv);
            }
          });
        });
        for (let b = d; b < e; b += g) {
          m.attempts++;
          let d = h + b;
          let e = ja.x2 + l * Math.cos(d);
          let g = ja.y2 + l * Math.sin(d);
          let o = n.find(b => b.active && a.getDistance(e, g, b.x, b.y) < k.scale + (b.blocker ? b.blocker : b.getScale(0.6, b.isItem)));
          if (o) {
            continue;
          }
          if (k.id != 18 && g >= f.mapScale / 2 - f.riverWidth / 2 && g <= f.mapScale / 2 + f.riverWidth / 2) {
            continue;
          }
          if (!i && j) {
            if (j.inTrap) {
              if (a.getAngleDist(oa.aim2 + Math.PI, d + Math.PI) <= Math.PI * 1.3) {
                Qb(2, d, 1);
              } else if (ja.items[4] == 15) {
                Qb(4, d, 1);
              }
            } else if (a.getAngleDist(oa.aim2, d) <= f.gatherAngle / 2.6) {
              Qb(2, d, 1);
            } else if (ja.items[4] == 15) {
              Qb(4, d, 1);
            }
          } else {
            Qb(c, d, 1);
          }
          n.push({
            x: e,
            y: g,
            active: true,
            blocker: k.blocker,
            scale: k.scale,
            isItem: true,
            type: null,
            colDiv: k.colDiv,
            getScale: function () {
              return this.scale;
            }
          });
          if (a.getAngleDist(oa.aim2, d) <= 1) {
            m.placed++;
          }
        }
        if (m.placed > 0 && i && k.dmg) {
          if (oa.dist2 <= b.weapons[ja.weapons[0]].range + ja.scale * 1.8 && q.spikeTick) {
            nc.canSpikeTick = true;
          }
        }
      } catch (a) {}
    };
    this.checkSpikeTick = function () {
      try {
        if (![3, 4, 5].includes(oa.primaryIndex)) {
          return false;
        }
        if (c("safeAntiSpikeTick").checked || pa.autoPush ? false : oa.primaryIndex == undefined ? true : oa.reloads[oa.primaryIndex] > P.tickRate) {
          return false;
        }
        if (oa.dist2 <= b.weapons[oa.primaryIndex || 5].range + oa.scale * 1.8) {
          let c = b.list[9];
          let d = oa.scale + c.scale + (c.placeOffset || 0);
          let e = 0;
          let g = {
            attempts: 0,
            block: "unblocked"
          };
          for (let b = -1; b <= 1; b += 1 / 10) {
            g.attempts++;
            let h = a.getDirect(ja, oa, 2, 2) + b;
            let i = oa.x2 + d * Math.cos(h);
            let j = oa.y2 + d * Math.sin(h);
            let k = fa.find(b => b.active && a.getDistance(i, j, b.x, b.y) < c.scale + (b.blocker ? b.blocker : b.getScale(0.6, b.isItem)));
            if (k) {
              continue;
            }
            if (j >= f.mapScale / 2 - f.riverWidth / 2 && j <= f.mapScale / 2 + f.riverWidth / 2) {
              continue;
            }
            e++;
            g.block = "blocked";
            break;
          }
          if (e) {
            pa.anti0Tick = 1;
            return true;
          }
        }
      } catch (a) {
        return null;
      }
      return false;
    };
    function d(a, b) {
      try {
        return Math.hypot((b.y2 || b.y) - (a.y2 || a.y), (b.x2 || b.x) - (a.x2 || a.x));
      } catch (a) {
        return Infinity;
      }
    }
    this.protect = function (a) {
      if (!q.antiTrap) {
        return;
      }
      if (d(oa, ja) > d(oa, mc.info)) {
        for (let a = -(Math.PI / 2); a < Math.PI / 2; a += Math.PI / 18) {
          Rb(2, oa.aim2 + a);
        }
      } else if (d(oa, mc.info) > d(oa, ja)) {
        for (let a = -(Math.PI / 2); a < Math.PI / 2; a += Math.PI / 18) {
          Rb(4, oa.aim2 + a);
        }
      }
    };
    this.autoPlace = function () {
      if (ma.length && q.autoPlace && !nc.ticking) {
        if (P.tick % (Math.max(1, parseInt(c("autoPlaceTick").value)) || 1) === 0) {
          if (fa.length) {
            let b = {
              inTrap: false
            };
            let c = fa.filter(b => b.trap && b.active && b.isTeamObject(ja) && a.getDist(b, oa, 0, 2) <= oa.scale + b.getScale() + 5).sort(function (b, c) {
              return a.getDist(b, oa, 0, 2) - a.getDist(c, oa, 0, 2);
            })[0];
            if (c) {
              b.inTrap = true;
            } else {
              b.inTrap = false;
            }
            if (oa.dist3 <= 450) {
              if (oa.dist3 <= 200) {
                this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, oa.aim2, 0, {
                  inTrap: b.inTrap
                });
              } else if (ja.items[4] == 15) {
                this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, oa.aim2);
              }
            }
          } else if (oa.dist3 <= 450) {
            if (ja.items[4] == 15) {
              this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, oa.aim2);
            }
          }
        }
      }
    };
    this.replacer = function (d) {
      if (!d || !q.autoReplace) {
        return;
      }
      if (!lb) {
        return;
      }
      if (this.antiTrapped) {
        return;
      }
      P.tickBase(() => {
        let e = a.getDirect(d, ja, 0, 2);
        let f = a.getDist(d, ja, 0, 2);
        if (c("weaponGrind").checked && f <= b.weapons[ja.weaponIndex].range + ja.scale) {
          return;
        }
        if (f <= 400 && oa.dist2 <= 400) {
          let a = this.checkSpikeTick();
          if (!a && oa.dist3 <= b.weapons[oa.primaryIndex || 5].range + oa.scale * 1.8) {
            this.testCanPlace(2, 0, Math.PI * 2, Math.PI / 24, e, 1);
          } else if (ja.items[4] == 15) {
            this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, e, 1);
          }
          this.replaced = true;
        }
      }, 1);
    };
  }
}
;
class $b {
  constructor() {
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
    this.changeType = function (a) {
      this.wait = false;
      this.isTrue = true;
      pa.autoAim = true;
      let b = [a];
      let c = oa.backupNobull;
      oa.backupNobull = false;
      if (a == "rev") {
        Nb(ja.weapons[1]);
        Lb(53, 0);
        Ob();
        setTimeout(() => {
          Nb(ja.weapons[0]);
          Lb(7, 0);
          setTimeout(() => {
            Ob();
            this.isTrue = false;
            pa.autoAim = false;
          }, 225);
        }, 100);
      } else if (a == "nobull") {
        Nb(ja.weapons[0]);
        Lb(7, 0);
        Ob();
        setTimeout(() => {
          Nb(ja.weapons[1]);
          Lb(ja.reloads[53] == 0 ? 53 : 6, 0);
          setTimeout(() => {
            Ob();
            this.isTrue = false;
            pa.autoAim = false;
          }, 255);
        }, 105);
      } else if (a == "normal") {
        Nb(ja.weapons[0]);
        Lb(7, 0);
        Ob();
        setTimeout(() => {
          Nb(ja.weapons[1]);
          Lb(ja.reloads[53] == 0 ? 53 : 6, 0);
          setTimeout(() => {
            Ob();
            this.isTrue = false;
            pa.autoAim = false;
          }, 255);
        }, 100);
      } else {
        setTimeout(() => {
          this.isTrue = false;
          pa.autoAim = false;
        }, 50);
      }
    };
    this.spikeTickType = function () {
      this.isTrue = true;
      pa.autoAim = true;
      Nb(ja.weapons[0]);
      Lb(7, 0);
      Ob();
      P.tickBase(() => {
        Nb(ja.weapons[0]);
        Lb(53, 0);
        P.tickBase(() => {
          Ob();
          this.isTrue = false;
          pa.autoAim = false;
        }, 1);
      }, 1);
    };
    this.counterType = function () {
      this.isTrue = true;
      pa.autoAim = true;
      Nb(ja.weapons[0]);
      Lb(7, 0);
      Ob();
      P.tickBase(() => {
        Nb(ja.weapons[0]);
        Lb(53, 0);
        P.tickBase(() => {
          Ob();
          this.isTrue = false;
          pa.autoAim = false;
        }, 1);
      }, 1);
    };
    this.rangeType = function (a) {
      this.isTrue = true;
      pa.autoAim = true;
      if (a == "ageInsta") {
        pa.ageInsta = false;
        if (ja.items[5] == 18) {
          Qb(5, oa.aim2);
        }
        U("a", undefined, 1);
        Lb(22, 0);
        Lb(21, 1);
        P.tickBase(() => {
          Nb(ja.weapons[1]);
          Lb(53, 0);
          Lb(21, 1);
          Ob();
          P.tickBase(() => {
            Ib(12);
            Nb(ja.weapons[1]);
            Lb(53, 0);
            Lb(21, 1);
            P.tickBase(() => {
              Ib(15);
              Nb(ja.weapons[1]);
              Lb(53, 0);
              Lb(21, 1);
              P.tickBase(() => {
                Ob();
                this.isTrue = false;
                pa.autoAim = false;
              }, 1);
            }, 1);
          }, 1);
        }, 1);
      } else {
        Nb(ja.weapons[1]);
        if (ja.reloads[53] == 0 && oa.dist2 <= 700 && oa.skinIndex != 22) {
          Lb(53, 0);
        } else {
          Lb(20, 0);
        }
        Lb(11, 1);
        Ob();
        P.tickBase(() => {
          Ob();
          this.isTrue = false;
          pa.autoAim = false;
        }, 1);
      }
    };
    this.oneTickType = function () {
      this.isTrue = true;
      pa.autoAim = true;
      Nb(ja.weapons[1]);
      Lb(53, 0);
      Lb(11, 1);
      U("a", oa.aim2, 1);
      if (ja.weapons[1] == 15) {
        pa.revAim = true;
        Ob();
      }
      P.tickBase(() => {
        pa.revAim = false;
        Nb(ja.weapons[0]);
        Lb(7, 0);
        Lb(19, 1);
        U("a", oa.aim2, 1);
        if (ja.weapons[1] != 15) {
          Ob();
        }
        P.tickBase(() => {
          Ob();
          this.isTrue = false;
          pa.autoAim = false;
          U("a", undefined, 1);
        }, 1);
      }, 1);
    };
    this.threeOneTickType = function () {
      this.isTrue = true;
      pa.autoAim = true;
      Nb(ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0]);
      Xb();
      Lb(11, 1);
      U("a", oa.aim2, 1);
      P.tickBase(() => {
        Nb(ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0]);
        Lb(53, 0);
        Lb(11, 1);
        U("a", oa.aim2, 1);
        P.tickBase(() => {
          Nb(ja.weapons[0]);
          Lb(7, 0);
          Lb(19, 1);
          Ob();
          U("a", oa.aim2, 1);
          P.tickBase(() => {
            Ob();
            this.isTrue = false;
            pa.autoAim = false;
            U("a", undefined, 1);
          }, 1);
        }, 1);
      }, 1);
    };
    this.kmTickType = function () {
      this.isTrue = true;
      pa.autoAim = true;
      pa.revAim = true;
      Nb(ja.weapons[1]);
      Lb(53, 0);
      Lb(11, 1);
      Ob();
      U("a", oa.aim2, 1);
      P.tickBase(() => {
        pa.revAim = false;
        Nb(ja.weapons[0]);
        Lb(7, 0);
        Lb(19, 1);
        U("a", oa.aim2, 1);
        P.tickBase(() => {
          Ob();
          this.isTrue = false;
          pa.autoAim = false;
          U("a", undefined, 1);
        }, 1);
      }, 1);
    };
    this.boostTickType = function () {
      this.isTrue = true;
      pa.autoAim = true;
      Xb();
      Lb(11, 1);
      U("a", oa.aim2, 1);
      P.tickBase(() => {
        if (ja.weapons[1] == 15) {
          pa.revAim = true;
        }
        Nb(ja.weapons[[9, 12, 13, 15].includes(ja.weapons[1]) ? 1 : 0]);
        Lb(53, 0);
        Lb(11, 1);
        if ([9, 12, 13, 15].includes(ja.weapons[1])) {
          Ob();
        }
        U("a", oa.aim2, 1);
        Qb(4, oa.aim2);
        P.tickBase(() => {
          pa.revAim = false;
          Nb(ja.weapons[0]);
          Lb(7, 0);
          Lb(19, 1);
          if (![9, 12, 13, 15].includes(ja.weapons[1])) {
            Ob();
          }
          U("a", oa.aim2, 1);
          P.tickBase(() => {
            Ob();
            this.isTrue = false;
            pa.autoAim = false;
            U("a", undefined, 1);
          }, 1);
        }, 1);
      }, 1);
    };
    this.gotoGoal = function (a, b) {
      let c = a => a * f.playerScale;
      let d = {
        a: a - b,
        b: a + b,
        c: a - c(1),
        d: a + c(1),
        e: a - c(2),
        f: a + c(2),
        g: a - c(4),
        h: a + c(4)
      };
      let e = function (a, b) {
        if (ja.y2 >= f.mapScale / 2 - f.riverWidth / 2 && ja.y2 <= f.mapScale / 2 + f.riverWidth / 2 && b == 0) {
          Lb(31, 0);
        } else {
          Lb(a, b);
        }
      };
      if (ma.length) {
        let a = oa.dist2;
        this.ticking = true;
        if (a >= d.a && a <= d.b) {
          e(22, 0);
          e(11, 1);
          if (ja.weaponIndex != ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0] || ja.buildIndex > -1) {
            Nb(ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0]);
          }
          return {
            dir: undefined,
            action: 1
          };
        } else {
          if (a < d.a) {
            if (a >= d.g) {
              if (a >= d.e) {
                if (a >= d.c) {
                  e(40, 0);
                  e(10, 1);
                  if (q.slowOT) {
                    if (ja.buildIndex != ja.items[1]) {
                      Mb(ja.items[1]);
                    }
                  } else if (ja.weaponIndex != ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0] || ja.buildIndex > -1) {
                    Nb(ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0]);
                  }
                } else {
                  e(22, 0);
                  e(19, 1);
                  if (ja.weaponIndex != ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0] || ja.buildIndex > -1) {
                    Nb(ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0]);
                  }
                }
              } else {
                e(6, 0);
                e(12, 1);
                if (ja.weaponIndex != ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0] || ja.buildIndex > -1) {
                  Nb(ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0]);
                }
              }
            } else {
              Xb();
              e(11, 1);
              if (ja.weaponIndex != ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0] || ja.buildIndex > -1) {
                Nb(ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0]);
              }
            }
            return {
              dir: oa.aim2 + Math.PI,
              action: 0
            };
          } else if (a > d.b) {
            if (a <= d.h) {
              if (a <= d.f) {
                if (a <= d.d) {
                  e(40, 0);
                  e(9, 1);
                  if (q.slowOT) {
                    if (ja.buildIndex != ja.items[1]) {
                      Mb(ja.items[1]);
                    }
                  } else if (ja.weaponIndex != ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0] || ja.buildIndex > -1) {
                    Nb(ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0]);
                  }
                } else {
                  e(22, 0);
                  e(19, 1);
                  if (ja.weaponIndex != ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0] || ja.buildIndex > -1) {
                    Nb(ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0]);
                  }
                }
              } else {
                e(6, 0);
                e(12, 1);
                if (ja.weaponIndex != ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0] || ja.buildIndex > -1) {
                  Nb(ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0]);
                }
              }
            } else {
              Xb();
              e(11, 1);
              if (ja.weaponIndex != ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0] || ja.buildIndex > -1) {
                Nb(ja.weapons[[10, 14].includes(ja.weapons[1]) ? 1 : 0]);
              }
            }
            return {
              dir: oa.aim2,
              action: 0
            };
          }
          return {
            dir: undefined,
            action: 0
          };
        }
      } else {
        this.ticking = false;
        return {
          dir: undefined,
          action: 0
        };
      }
    };
    this.bowMovement = function () {
      let a = this.gotoGoal(685, 3);
      if (a.action) {
        if (ja.reloads[53] == 0 && !this.isTrue) {
          this.rangeType("ageInsta");
        } else {
          U("a", a.dir, 1);
        }
      } else {
        U("a", a.dir, 1);
      }
    };
    this.tickMovement = function () {
      let a = this.gotoGoal([10, 14].includes(ja.weapons[1]) && ja.y2 > f.snowBiomeTop ? 240 : ja.weapons[1] == 15 ? 250 : ja.y2 <= f.snowBiomeTop ? [10, 14].includes(ja.weapons[1]) ? 270 : 265 : 275, 3);
      if (a.action) {
        if (![6, 22].includes(oa.skinIndex) && ja.reloads[53] == 0 && !this.isTrue) {
          if ([10, 14].includes(ja.weapons[1]) && ja.y2 > f.snowBiomeTop || ja.weapons[1] == 15) {
            this.oneTickType();
          } else {
            this.threeOneTickType();
          }
        } else {
          U("a", a.dir, 1);
        }
      } else {
        U("a", a.dir, 1);
      }
    };
    this.kmTickMovement = function () {
      let a = this.gotoGoal(240, 3);
      if (a.action) {
        if (oa.skinIndex != 22 && ja.reloads[53] == 0 && !this.isTrue && (P.tick - oa.poisonTick) % f.serverUpdateRate == 8) {
          this.kmTickType();
        } else {
          U("a", a.dir, 1);
        }
      } else {
        U("a", a.dir, 1);
      }
    };
    this.boostTickMovement = function () {
      let a = ja.weapons[1] == 9 ? 365 : ja.weapons[1] == 12 ? 380 : ja.weapons[1] == 13 ? 390 : ja.weapons[1] == 15 ? 365 : 370;
      let b = ja.weapons[1] == 9 ? 2 : ja.weapons[1] == 12 ? 1.5 : ja.weapons[1] == 13 ? 1.5 : ja.weapons[1] == 15 ? 2 : 3;
      let c = this.gotoGoal(a, b);
      if (c.action) {
        if (ja.reloads[53] == 0 && !this.isTrue) {
          this.boostTickType();
        } else {
          U("a", c.dir, 1);
        }
      } else {
        U("a", c.dir, 1);
      }
    };
    this.perfCheck = function (a, b) {
      if (b.weaponIndex == 11 && dc.getAngleDist(b.aim2 + Math.PI, b.d2) <= f.shieldAngle) {
        return false;
      }
      if (![9, 12, 13, 15].includes(ja.weapons[1])) {
        return true;
      }
      let c = {
        x: b.x2 + Math.cos(b.aim2 + Math.PI) * 70,
        y: b.y2 + Math.sin(b.aim2 + Math.PI) * 70
      };
      if (dc.lineInRect(a.x2 - a.scale, a.y2 - a.scale, a.x2 + a.scale, a.y2 + a.scale, c.x, c.y, c.x, c.y)) {
        return true;
      }
      let d = aa.filter(a => a.visible).find(a => {
        if (dc.lineInRect(a.x2 - a.scale, a.y2 - a.scale, a.x2 + a.scale, a.y2 + a.scale, c.x, c.y, c.x, c.y)) {
          return true;
        }
      });
      if (d) {
        return false;
      }
      d = fa.filter(a => a.active).find(a => {
        let b = a.getScale();
        if (!a.ignoreCollision && dc.lineInRect(a.x - b, a.y - b, a.x + b, a.y + b, c.x, c.y, c.x, c.y)) {
          return true;
        }
      });
      if (d) {
        return false;
      }
      return true;
    };
  }
}
;
class _b {
  constructor(a, b) {
    this.hat = function () {
      a.forEach(a => {
        let b = qa(hc, a);
        if (b && !ja.skins[a] && ja.points >= b.price) {
          U("c", 1, a, 0);
        }
      });
    };
    this.acc = function () {
      b.forEach(a => {
        let b = qa(ic, a);
        if (b && !ja.tails[a] && ja.points >= b.price) {
          U("c", 1, a, 1);
        }
      });
    };
  }
}
;
class ac {
  constructor() {
    this.sb = function (a) {
      a(3);
      a(17);
      a(31);
      a(23);
      a(9);
      a(38);
    };
    this.kh = function (a) {
      a(3);
      a(17);
      a(31);
      a(23);
      a(10);
      a(38);
      a(4);
      a(25);
    };
    this.pb = function (a) {
      a(5);
      a(17);
      a(32);
      a(23);
      a(9);
      a(38);
    };
    this.ph = function (a) {
      a(5);
      a(17);
      a(32);
      a(23);
      a(10);
      a(38);
      a(28);
      a(25);
    };
    this.db = function (a) {
      a(7);
      a(17);
      a(31);
      a(23);
      a(9);
      a(34);
    };
    this.km = function (a) {
      a(7);
      a(17);
      a(31);
      a(23);
      a(10);
      a(38);
      a(4);
      a(15);
    };
  }
}
;
class bc {
  constructor(a) {
    this.calcDmg = function (a, b) {
      return a * b;
    };
    this.getAllDamage = function (a) {
      return [this.calcDmg(a, 0.75), a, this.calcDmg(a, 1.125), this.calcDmg(a, 1.5)];
    };
    this.weapons = [];
    for (let b = 0; b < a.weapons.length; b++) {
      let c = a.weapons[b];
      let d = c.name.split(" ").length <= 1 ? c.name : c.name.split(" ")[0] + "_" + c.name.split(" ")[1];
      this.weapons.push(this.getAllDamage(b > 8 ? c.Pdmg : c.dmg));
      this[d] = this.weapons[b];
    }
  }
}
let cc = [];
let dc = new ub();
let ec = new yb();
let fc = new zb(xb, ea, dc, f);
let gc = new Bb();
let hc = gc.hats;
let ic = gc.accessories;
let jc = new Cb(Ab, ga, ba, aa, fc, ec, f, dc);
let kc = new Db(aa, Eb, ba, ec, null, f, dc);
let lc = new wb();
let mc = new Zb(dc, ec);
let nc = new $b();
let oc = new _b([6, 7, 22, 12, 53, 40, 15, 31, 20], [11, 13, 19, 18, 21]);
let pc = new ac();
let qc;
let rc;
let sc = {};
let tc = [];
let uc;
let vc = [];
function wc(a) {
  U("6", a.slice(0, 30));
}
let xc = [];
function yc(a, b, c, d, e, g, h, i) {
  let j = g == 0 ? 9 : g == 2 ? 12 : g == 3 ? 13 : g == 5 && 15;
  let k = f.playerScale * 2;
  let l = {
    x: g == 1 ? a : a - k * Math.cos(c),
    y: g == 1 ? b : b - k * Math.sin(c)
  };
  let m = ba.filter(a => a.visible && dc.getDist(l, a, 0, 2) <= a.scale).sort(function (a, b) {
    return dc.getDist(l, a, 0, 2) - dc.getDist(l, b, 0, 2);
  })[0];
  if (m) {
    if (g == 1) {
      m.shooting[53] = 1;
    } else {
      m.shootIndex = j;
      m.shooting[1] = 1;
      Ac(m, c, d, e, g, j);
    }
  }
}
let zc = 0;
function Ac(a, b, c, d, e, f) {
  if (!a.isTeam(ja)) {
    $a = dc.getDirect(ja, a, 2, 2);
    if (dc.getAngleDist($a, b) <= 0.2) {
      a.bowThreat[f]++;
      if (e == 5) {
        zc++;
      }
      setTimeout(() => {
        a.bowThreat[f]--;
        if (e == 5) {
          zc--;
        }
      }, c / d);
      if (a.bowThreat[9] >= 1 && (a.bowThreat[12] >= 1 || a.bowThreat[15] >= 1)) {
        Qb(1, a.aim2);
        pa.anti0Tick = 4;
        if (!pa.antiSync) {
          Wb(4);
        }
      } else if (zc >= 2) {
        Qb(1, a.aim2);
        pa.anti0Tick = 4;
        if (!pa.antiSync) {
          Wb(4);
        }
      }
    }
  }
}
function Bc(a, b, c) {
  if (ja && a) {
    dc.removeAllChildren(Ma);
    Ma.classList.add("visible");
    dc.generateElement({
      id: "itemInfoName",
      text: dc.capitalizeFirst(a.name),
      parent: Ma
    });
    dc.generateElement({
      id: "itemInfoDesc",
      text: a.desc,
      parent: Ma
    });
    if (c) {} else if (b) {
      dc.generateElement({
        class: "itemInfoReq",
        text: !a.type ? "primary" : "secondary",
        parent: Ma
      });
    } else {
      for (let b = 0; b < a.req.length; b += 2) {
        dc.generateElement({
          class: "itemInfoReq",
          html: a.req[b] + "<span class='itemInfoReqVal'> x" + a.req[b + 1] + "</span>",
          parent: Ma
        });
      }
      if (a.group.limit) {
        dc.generateElement({
          class: "itemInfoLmt",
          text: (ja.itemCounts[a.group.id] || 0) + "/" + (f.isSandbox ? 99 : a.group.limit),
          parent: Ma
        });
      }
    }
  } else {
    Ma.classList.remove("visible");
  }
}
window.addEventListener("resize", dc.checkTrusted(Cc));
function Cc() {
  Qa = window.innerWidth;
  Ra = window.innerHeight;
  let a = Math.max(Qa / Sa, Ra / Ta) * Ua;
  Aa.width = Qa * Ua;
  Aa.height = Ra * Ua;
  Aa.style.width = Qa + "px";
  Aa.style.height = Ra + "px";
  Ba.setTransform(a, 0, 0, a, (Qa * Ua - Sa * a) / 2, (Ra * Ua - Ta * a) / 2);
}
Cc();
var Dc;
const Ec = document.getElementById("touch-controls-fullscreen");
Ec.style.display = "block";
Ec.addEventListener("mousemove", Fc, false);
function Fc(a) {
  _a = a.clientX;
  ab = a.clientY;
}
let Gc = {
  left: false,
  middle: false,
  right: false
};
Ec.addEventListener("mousedown", Hc, false);
function Hc(a) {
  if (kb != 1) {
    kb = 1;
    if (a.button == 0) {
      Gc.left = true;
    } else if (a.button == 1) {
      Gc.middle = true;
    } else if (a.button == 2) {
      Gc.right = true;
    }
  }
}
Ec.addEventListener("mouseup", dc.checkTrusted(Ic));
function Ic(a) {
  if (kb != 0) {
    kb = 0;
    if (a.button == 0) {
      Gc.left = false;
    } else if (a.button == 1) {
      Gc.middle = false;
    } else if (a.button == 2) {
      Gc.right = false;
    }
  }
}
Ec.addEventListener("wheel", Jc, false);
function Jc(a) {
  if (a.deltaY < 0) {
    wbe += 0.005;
    Sa = f.maxScreenWidth * wbe;
    Ta = f.maxScreenHeight * wbe;
    Cc();
  } else {
    wbe -= 0.005;
    Sa = f.maxScreenWidth * wbe;
    Ta = f.maxScreenHeight * wbe;
    Cc();
  }
}
function Kc() {
  let a = 0;
  let b = 0;
  for (let c in jb) {
    let d = jb[c];
    a += !!ib[c] * d[0];
    b += !!ib[c] * d[1];
  }
  if (a == 0 && b == 0) {
    return undefined;
  } else {
    return Math.atan2(b, a);
  }
}
function Lc() {
  if (!ja) {
    return 0;
  }
  if (!ja.lockDir) {
    ob = Math.atan2(ab - Ra / 2, _a - Qa / 2);
  }
  return ob || 0;
}
let Mc = 0;
let Nc = Date.now();
function Oc() {
  if (ja && Date.now() - Nc >= 235 && !Gc.right && !Gc.left) {
    Mc += Math.random() * (Math.PI * 2);
    Nc = Date.now();
  }
  if (!ja) {
    return "0";
  }
  if (pa.autoAim || (Gc.left || K && oa.dist2 <= ec.weapons[ja.weapons[0]].range + oa.scale * 1.8 && !mc.inTrap) && ja.reloads[ja.weapons[0]] == 0) {
    ob = c("weaponGrind").checked ? Lc() : ma.length ? oa.aim2 : Lc();
  } else if (Gc.right && ja.reloads[ja.weapons[1] == 10 ? ja.weapons[1] : ja.weapons[0]] == 0) {
    ob = Lc();
  } else if (mc.inTrap) {
    ob = mc.aim;
  } else if (!ja.lockDir) {
    if (!ja.lockDir && nd.stopspin) {
      if (K) {
        ob = ob;
      } else {
        ob = Lc();
      }
    }
  }
  return ob;
}
function Pc() {
  if (!ja) {
    return 0;
  }
  ob = Lc();
  return ob || 0;
}
function Qc() {
  return bb.style.display != "block" && Ja.style.display != "block" && !z;
}
function Rc() {
  if (w.style.display != "none") {
    let a = function (a) {
      return {
        found: a.startsWith("/") && p[a.slice(1).split(" ")[0]],
        fv: p[a.slice(1).split(" ")[0]]
      };
    };
    let b = a(y.value);
    if (b.found) {
      if (typeof b.fv.action === "function") {
        b.fv.action(y.value);
      }
    } else {
      wc(y.value);
    }
    y.value = "";
    y.blur();
  } else if (z) {
    y.blur();
  } else {
    y.focus();
  }
}
function Sc(a) {
  let b = a.which || a.keyCode || 0;
  if (ja && ja.alive && Qc()) {
    if (!ib[b]) {
      ib[b] = 1;
      mb[a.key] = 1;
      if (b == 27) {
        H = !H;
        $("#menuDiv").toggle();
        $("#menuChatDiv").toggle();
      } else if (b == 69) {
        Ob();
      } else if (b == 67) {
        Ze();
      } else if (ja.weapons[b - 49] != undefined) {
        ja.weaponCode = ja.weapons[b - 49];
      } else if (jb[b]) {
        Uc();
      } else if (a.key == "m") {
        nb.placeSpawnPads = !nb.placeSpawnPads;
      } else if (a.key == "z") {
        nb.place = !nb.place;
      } else if (a.key == "z") {
        W.send("6", "holding V rn XD");
      } else if (a.key == "Z") {
        if (typeof window.debug == "function") {
          window.debug();
        }
      } else if (b == 32) {
        U("d", 1, Lc(), 1);
        U("d", 0, Lc(), 1);
      } else if (a.key == ",") {
        W.send("6", "syncon");
        Gd.send(JSON.stringify(["tezt", "ratio"]));
        for (let a = 0; a < Ud.length; a++) {
          Ud[a][0].zync(oa);
          console.log(Ud[a][0]);
        }
      }
    }
  }
}
addEventListener("keydown", dc.checkTrusted(Sc));
function Tc(a) {
  if (ja && ja.alive) {
    let b = a.which || a.keyCode || 0;
    if (b == 13) {
      Rc();
    } else if (Qc()) {
      if (ib[b]) {
        ib[b] = 0;
        mb[a.key] = 0;
        if (jb[b]) {
          Uc();
        } else if (a.key == ",") {
          ja.sync = false;
        }
      }
    }
  }
}
window.addEventListener("keyup", dc.checkTrusted(Tc));
function Uc() {
  if (ld) {
    U("a", undefined, 1);
  } else {
    let a = Kc();
    if (S == undefined || a == undefined || Math.abs(a - S) > 0.3) {
      if (!pa.autoPush && !ld) {
        U("a", a, 1);
      }
      S = a;
    }
  }
}
function Vc() {}
Vc();
let Wc = [];
function Xc(a = undefined) {
  if (a === undefined) a = undefined;
  for (let b = 3; b < ec.list.length; ++b) {
    let d = ec.list[b].group.id;
    let e = ec.weapons.length + b;
    if (!Wc[e]) {
      Wc[e] = document.createElement("div");
      Wc[e].id = "itemCount" + e;
      c("actionBarItem" + e).appendChild(Wc[e]);
      Wc[e].style = "\n                        display: block;\n                        position: absolute;\n                        padding-left: 5px;\n                        font-size: 2em;\n                        color: #fff;\n                        ";
      Wc[e].innerHTML = ja.itemCounts[d] || 0;
    } else if (a == d) {
      Wc[e].innerHTML = ja.itemCounts[a] || 0;
    }
  }
}
function Yc() {
  let a = fa.filter(a => a.trap && a.active && a.isTeamObject(ja) && dc.getDist(a, oa, 0, 2) <= oa.scale + a.getScale() + 5).sort(function (a, b) {
    return dc.getDist(a, oa, 0, 2) - dc.getDist(b, oa, 0, 2);
  })[0];
  if (a) {
    let b = fa.filter(b => b.dmg && b.active && b.isTeamObject(ja) && dc.getDist(b, a, 0, 0) <= oa.scale + a.scale + b.scale).sort(function (a, b) {
      return dc.getDist(a, oa, 0, 2) - dc.getDist(b, oa, 0, 2);
    })[0];
    if (b) {
      let a = Math.atan2(oa.y2 - b.y, oa.x2 - b.x);
      pa.autoPush = true;
      pa.pushData = {
        x: b.x + Math.cos(a),
        y: b.y + Math.sin(a),
        x2: ja.x2 + 30,
        y2: ja.y2 + 30
      };
      let c = {
        x: oa.x2 + Math.cos(a) * 30,
        y: oa.y2 + Math.sin(a) * 60
      };
      let d = Math.atan2(c.y - ja.y2, c.x - ja.x2);
      U("a", d, 1);
    } else if (pa.autoPush) {
      pa.autoPush = false;
      U("a", S || undefined, 1);
    }
  } else if (pa.autoPush) {
    pa.autoPush = false;
    U("a", S || undefined, 1);
  }
}
function Zc(a) {
  ha.push(new Gb(a.x, a.y, a.dir, a.buildIndex, a.weaponIndex, a.weaponVariant, a.skinColor, a.scale, a.name));
}
function $c(a) {
  ca = a.teams;
}
function _c(a) {
  ib = {};
  mb = {};
  ka = a;
  kb = 0;
  lb = true;
  U("d", 0, Oc(), 1);
  pa.ageInsta = true;
  if (hb) {
    hb = false;
    ea.length = 0;
    fa.length = 0;
  }
}
function ad(a, b) {
  let c = sa(a[0]);
  if (!c) {
    c = new Hb(a[0], a[1], f, dc, jc, fc, ba, aa, ec, hc, ic);
    ba.push(c);
    if (a[1] != ka) {
      B(null, "Found " + a[2] + " {" + a[1] + "}", "lime");
    }
  } else if (a[1] != ka) {
    B(null, "Found " + a[2] + " {" + a[1] + "}", "lime");
  }
  c.spawn(b ? true : null);
  c.visible = false;
  c.oldPos = {
    x2: undefined,
    y2: undefined
  };
  c.x2 = undefined;
  c.y2 = undefined;
  c.x3 = undefined;
  c.y3 = undefined;
  c.setData(a);
  if (b) {
    if (!ja) {
      window.prepareUI(c);
    }
    ja = c;
    Ya = ja.x;
    Za = ja.y;
    pa.lastDir = 0;
    zd();
    fd();
    Xc();
    if (ja.skins[7]) {
      pa.reSync = true;
    }
  }
}
function bd(a) {
  for (let b = 0; b < ba.length; b++) {
    if (ba[b].id == a) {
      B("Game", ba[b].name + "[" + ba[b].sid + "] left the game", "red");
      ba.splice(b, 1);
      break;
    }
  }
}
function cd(a, b) {
  la = ta(a);
  if (la) {
    la.oldHealth = la.health;
    la.health = b;
    la.judgeShame();
    if (la.oldHealth > la.health) {
      la.timeDamaged = Date.now();
      la.damaged = la.oldHealth - la.health;
      let b = la.damaged;
      la = ta(a);
      let c = false;
      if (la.health <= 0) {
        if (!la.death) {
          la.death = true;
          if (la != ja) {
            if (la.skinIndex == 45) {
              B("Game", la.name + "[" + la.sid + "] has died due to clown", "red");
            } else if (la.shameCount >= 5) {
              B("Game", la.name + "[" + la.sid + "] has died due to high shame", "red");
            } else {
              B("Game", la.name + "[" + la.sid + "] has died", "red");
            }
          }
          Zc(la);
        }
      }
      if (la == ja) {
        if (la.skinIndex == 7 && (b == 5 || la.latestTail == 13 && b == 2)) {
          if (pa.reSync) {
            pa.reSync = false;
            la.setBullTick = true;
          }
          c = true;
        }
        if (lb) {
          let a = Ub(b);
          let d = [0.25, 0.45].map(a => a * ec.weapons[ja.weapons[0]].dmg * Sb());
          let e = !c && d.includes(b);
          let f = 95;
          let g = function (a) {
            setTimeout(() => {
              Vb();
            }, a);
          };
          if (oa.length && oa.damageThreat(ja) - (ja.canEmpAnti || ja.empAnti ? 25 : 0) >= 85) {
            ja.canEmpAnti = true;
            ja.antiTimer = P.tick;
            let a = 4;
            if (ja.shameCount < a) {
              Vb();
            } else {
              g(f);
            }
          } else {
            g(f);
          }
        }
      } else if (!la.setPoisonTick && (la.damaged == 5 || la.latestTail == 13 && la.damaged == 2)) {
        la.setPoisonTick = true;
      }
    } else {
      la.timeHealed = Date.now();
    }
    if (la.health <= 0) {
      Pd.forEach(a => {
        a.whyDie = la.name;
      });
    }
  }
}
function dd() {
  lb = false;
  qc = {
    x: ja.x,
    y: ja.y
  };
}
function ed(a, b) {
  if (ja) {
    ja.itemCounts[a] = b;
    Xc(a);
  }
}
function fd(a, b, c) {
  if (a != undefined) {
    ja.XP = a;
  }
  if (b != undefined) {
    ja.maxXP = b;
  }
  if (c != undefined) {
    ja.age = c;
  }
}
function gd(a, b) {
  ja.upgradePoints = a;
  ja.upgrAge = b;
  if (a > 0) {
    cc.length = 0;
    dc.removeAllChildren(Ga);
    for (let a = 0; a < ec.weapons.length; ++a) {
      if (ec.weapons[a].age == b && (ec.weapons[a].pre == undefined || ja.weapons.indexOf(ec.weapons[a].pre) >= 0)) {
        let b = dc.generateElement({
          id: "upgradeItem" + a,
          class: "actionBarItem",
          onmouseout: function () {
            Bc();
          },
          parent: Ga
        });
        b.style.backgroundImage = c("actionBarItem" + a).style.backgroundImage;
        cc.push(a);
      }
    }
    for (let a = 0; a < ec.list.length; ++a) {
      if (ec.list[a].age == b && (ec.list[a].pre == undefined || ja.items.indexOf(ec.list[a].pre) >= 0)) {
        let b = ec.weapons.length + a;
        let d = dc.generateElement({
          id: "upgradeItem" + b,
          class: "actionBarItem",
          onmouseout: function () {
            Bc();
          },
          parent: Ga
        });
        d.style.backgroundImage = c("actionBarItem" + b).style.backgroundImage;
        cc.push(b);
      }
    }
    for (let a = 0; a < cc.length; a++) {
      (function (a) {
        let b = c("upgradeItem" + a);
        b.onclick = dc.checkTrusted(function () {
          U("H", a);
        });
        dc.hookTouchEvents(b);
      })(cc[a]);
    }
    if (cc.length) {
      Ga.style.display = "block";
      Ha.style.display = "block";
      Ha.innerHTML = "SELECT ITEMS (" + a + ")";
    } else {
      Ga.style.display = "none";
      Ha.style.display = "none";
      Bc();
    }
  } else {
    Ga.style.display = "none";
    Ha.style.display = "none";
    Bc();
  }
}
function hd(a) {
  let b = va(a);
  fc.disableBySid(a);
  if (ja) {
    for (let b = 0; b < ia.length; b++) {
      if (ia[b].sid == a) {
        ia.splice(b, 1);
        break;
      }
    }
    if (!ja.canSee(b)) {
      vc.push({
        x: b.x,
        y: b.y
      });
    }
    if (vc.length > 8) {
      vc.shift();
    }
    mc.replacer(b);
  }
}
function id(a) {
  if (ja) {
    fc.removeAllItems(a);
  }
}
function jd(a, b) {
  if (!_.manage[_.tick + b]) {
    _.manage[_.tick + b] = [a];
  } else {
    _.manage[_.tick + b].push(a);
  }
}
function kd(a, b) {
  try {
    return Math.atan2((b.y2 || b.y) - (a.y2 || a.y), (b.x2 || b.x) - (a.x2 || a.x));
  } catch (a) {
    return 0;
  }
}
let ld = false;
let md = false;
let nd = {
  insta: {
    todo: false,
    wait: false,
    count: 4,
    shame: 5
  },
  bull: false,
  antibull: 0,
  reloaded: false,
  stopspin: true
};
function od(a) {
  function b(a, b) {
    a = a % (Math.PI * 2);
    b = b % (Math.PI * 2);
    let c = Math.abs(a - b);
    if (c > Math.PI) {
      c = Math.PI * 2 - c;
    }
    return c;
  }
  P.tick++;
  ma = [];
  na = [];
  oa = [];
  P.tickSpeed = performance.now() - P.lastTick;
  P.lastTick = performance.now();
  ba.forEach(a => {
    a.forcePos = !a.visible;
    a.visible = false;
    if (a.timeHealed - a.timeDamaged > 0 && a.lastshamecount < a.shameCount) {
      a.pinge = a.timeHealed - a.timeDamaged;
    }
  });
  for (let b = 0; b < a.length;) {
    la = ta(a[b]);
    if (la) {
      la.t1 = la.t2 === undefined ? P.lastTick : la.t2;
      la.t2 = P.lastTick;
      la.oldPos.x2 = la.x2;
      la.oldPos.y2 = la.y2;
      la.x1 = la.x;
      la.y1 = la.y;
      la.x2 = a[b + 1];
      la.y2 = a[b + 2];
      la.x3 = la.x2 + (la.x2 - la.oldPos.x2);
      la.y3 = la.y2 + (la.y2 - la.oldPos.y2);
      la.d1 = la.d2 === undefined ? a[b + 3] : la.d2;
      la.d2 = a[b + 3];
      la.dt = 0;
      la.buildIndex = a[b + 4];
      la.weaponIndex = a[b + 5];
      la.weaponVariant = a[b + 6];
      la.team = a[b + 7];
      la.isLeader = a[b + 8];
      la.oldSkinIndex = la.skinIndex;
      la.oldTailIndex = la.tailIndex;
      la.skinIndex = a[b + 9];
      la.tailIndex = a[b + 10];
      la.iconIndex = a[b + 11];
      la.zIndex = a[b + 12];
      la.visible = true;
      la.update(P.tickSpeed);
      la.dist2 = dc.getDist(la, ja, 2, 2);
      la.aim2 = dc.getDirect(la, ja, 2, 2);
      la.dist3 = dc.getDist(la, ja, 3, 3);
      la.aim3 = dc.getDirect(la, ja, 3, 3);
      la.damageThreat = 0;
      if (la.skinIndex == 45 && la.shameTimer <= 0) {
        la.addShameTimer();
      }
      if (la.oldSkinIndex == 45 && la.skinIndex != 45) {
        la.shameTimer = 0;
        la.shameCount = 0;
        if (la == ja) {
          Vb();
        }
      }
      h.forEach(a => {
        a.showName = "YEAHHH";
      });
      for (let a = 0; a < ba.length; a++) {
        for (let a = 0; a < h.length; a++) {
          if (ja.id === a.id) {
            a.showName = "YEAHHHHHH";
          }
        }
      }
      if (ja.shameCount < 4 && oa.dist3 <= 300 && oa.reloads[oa.primaryIndex] <= P.tickRate * (window.pingTime >= 200 ? 2 : 1)) {
        md = true;
        Vb();
      } else {
        if (md) {
          Vb();
        }
        md = false;
      }
      if (la == ja) {
        if (fa.length) {
          fa.forEach(a => {
            a.onNear = false;
            if (a.active) {
              if (!a.onNear && dc.getDist(a, la, 0, 2) <= a.scale + ec.weapons[la.weapons[0]].range) {
                a.onNear = true;
              }
              if (a.isItem && a.owner) {
                if (!a.pps && la.sid == a.owner.sid && dc.getDist(a, la, 0, 2) > (parseInt(c("breakRange").value) || 0) && !a.breakObj && ![13, 14, 20].includes(a.id)) {
                  a.breakObj = true;
                  ia.push({
                    x: a.x,
                    y: a.y,
                    sid: a.sid
                  });
                }
              }
            }
          });
          let a = fa.filter(a => a.trap && a.active && dc.getDist(a, la, 0, 2) <= la.scale + a.getScale() + 25 && !a.isTeamObject(la)).sort(function (a, b) {
            return dc.getDist(a, la, 0, 2) - dc.getDist(b, la, 0, 2);
          })[0];
          if (a) {
            let b = ea.filter(b => b.dmg && ef(la, b) <= la.scale + a.scale / 2 && !b.isTeamObject(la) && b.active)[0];
            mc.dist = dc.getDist(a, la, 0, 2);
            mc.aim = dc.getDirect(b ? b : a, la, 0, 2);
            mc.protect(kd(a, la) - Math.PI);
            mc.inTrap = true;
            mc.info = a;
          } else {
            mc.inTrap = false;
            mc.info = {};
          }
        } else {
          mc.inTrap = false;
        }
      }
      if (la.weaponIndex < 9) {
        la.primaryIndex = la.weaponIndex;
        la.primaryVariant = la.weaponVariant;
      } else if (la.weaponIndex > 8) {
        la.secondaryIndex = la.weaponIndex;
        la.secondaryVariant = la.weaponVariant;
      }
    }
    b += 13;
  }
  if (lc.stack.length) {
    let a = 0;
    let b = 0;
    let c = {
      x: null,
      y: null
    };
    let d = {
      x: null,
      y: null
    };
    lc.stack.forEach(e => {
      if (e.value >= 0) {
        if (a == 0) {
          c = {
            x: e.x,
            y: e.y
          };
        }
        a += Math.abs(e.value);
      } else {
        if (b == 0) {
          d = {
            x: e.x,
            y: e.y
          };
        }
        b += Math.abs(e.value);
      }
    });
    if (b > 0) {
      lc.showText(d.x, d.y, Math.max(45, Math.min(50, b)), 0.18, 500, b, "#8ecc51");
    }
    if (a > 0) {
      lc.showText(c.x, c.y, Math.max(45, Math.min(50, a)), 0.18, 500, a, "#fff");
    }
    lc.stack = [];
  }
  if (xc.length) {
    xc.forEach(a => {
      yc(...a);
    });
    xc = [];
  }
  for (let b = 0; b < a.length;) {
    la = ta(a[b]);
    if (la) {
      if (!la.isTeam(ja)) {
        ma.push(la);
        if (la.dist2 <= ec.weapons[la.primaryIndex == undefined ? 5 : la.primaryIndex].range + ja.scale * 2) {
          na.push(la);
        }
      }
      la.manageReload();
      if (la != ja) {
        la.addDamageThreat(ja);
      }
    }
    b += 13;
  }
  if (ja && ja.alive) {
    if (ma.length) {
      oa = ma.sort(function (a, b) {
        return a.dist2 - b.dist2;
      })[0];
    } else {}
    if (P.tickQueue[P.tick]) {
      P.tickQueue[P.tick].forEach(a => {
        a();
      });
      P.tickQueue[P.tick] = null;
    }
    ba.forEach(a => {
      if (!a.visible && ja != a) {
        a.reloads = {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
          10: 0,
          11: 0,
          12: 0,
          13: 0,
          14: 0,
          15: 0,
          53: 0
        };
      }
      if (a.setBullTick) {
        a.bullTimer = 0;
      }
      if (a.setPoisonTick) {
        a.poisonTimer = 0;
      }
      a.updateTimer();
    });
    if (lb) {
      if (ma.length) {
        if (ja.canEmpAnti) {
          ja.canEmpAnti = false;
          if (oa.dist2 <= 300 && !pa.safePrimary(oa) && !pa.safeSecondary(oa)) {
            if (oa.reloads[53] == 0) {
              ja.empAnti = true;
              ja.soldierAnti = false;
            } else {
              ja.empAnti = false;
              ja.soldierAnti = true;
            }
          }
        }
        let a = fa.filter(a => a.dmg && a.active && a.isTeamObject(ja) && dc.getDist(a, oa, 0, 3) <= a.scale + oa.scale).sort(function (a, b) {
          return dc.getDist(a, oa, 0, 2) - dc.getDist(b, oa, 0, 2);
        })[0];
        if (a) {
          if (oa.dist3 <= ec.weapons[ja.weapons[0]].range + ja.scale * 1.8 && q.predictTick) {
            nc.canSpikeTick = true;
            nc.syncHit = true;
            if (q.revTick && ja.weapons[1] == 15 && ja.reloads[53] == 0 && nc.perfCheck(ja, oa)) {
              nc.revTick = true;
            }
          }
        }
        let b = fa.filter(a => a.dmg && a.active && !a.isTeamObject(ja) && dc.getDist(a, ja, 0, 3) < a.scale + ja.scale).sort(function (a, b) {
          return dc.getDist(a, ja, 0, 2) - dc.getDist(b, ja, 0, 2);
        })[0];
        if (b && !mc.inTrap) {
          if (oa.dist3 <= ec.weapons[5].range + oa.scale * 1.8) {
            pa.anti0Tick = 1;
          }
        }
      }
      if ((K ? true : (ja.checkCanInsta(true) >= 100 ? ja.checkCanInsta(true) : ja.checkCanInsta(false)) >= (ja.weapons[1] == 10 ? 95 : 100)) && oa.dist2 <= ec.weapons[ja.weapons[1] == 10 ? ja.weapons[1] : ja.weapons[0]].range + oa.scale * 1.8 && (nc.wait || K && Math.floor(Math.random() * 5) == 0) && !nc.isTrue && !pa.waitHit && ja.reloads[ja.weapons[0]] == 0 && ja.reloads[ja.weapons[1]] == 0 && (K ? true : c("instaType").value == "oneShot" ? ja.reloads[53] <= (ja.weapons[1] == 10 ? 0 : P.tickRate) : true) && nc.perfCheck(ja, oa)) {
        if (ja.checkCanInsta(true) >= 100) {
          nc.nobull = K ? false : nc.canSpikeTick ? false : true;
        } else {
          nc.nobull = false;
        }
        nc.can = true;
      } else {
        nc.can = false;
      }
      if (mb.q) {
        Qb(0, Oc());
      }
      if (mb.f) {
        Qb(4, Lc());
      }
      if (mb.v) {
        Qb(2, Lc());
      }
      if (mb.y) {
        Qb(5, Lc());
      }
      if (mb.h) {
        Qb(ja.getItemType(22), Lc());
      }
      if (mb.n) {
        Qb(3, Lc());
      }
      if (P.tick % 1 == 0) {
        if (nb.place) {
          let a = 7.7;
          for (let b = -a; b <= a; b += a) {
            Rb(3, dc.getDirect(ja.oldPos, ja, 2, 2) + b);
          }
        } else if (nb.placeSpawnPads) {
          for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
            Rb(ja.getItemType(20), dc.getDirect(ja.oldPos, ja, 2, 2) + a);
          }
        }
      }
      if (nc.can) {
        nc.changeType(ja.weapons[1] == 10 ? "rev" : "normal");
      }
      if (nc.canCounter) {
        nc.canCounter = false;
        if (ja.reloads[ja.weapons[0]] == 0 && !nc.isTrue) {
          nc.counterType();
        }
      }
      if (nc.canSpikeTick) {
        nc.canSpikeTick = false;
        if (nc.revTick) {
          nc.revTick = false;
          if ([1, 2, 3, 4, 5, 6].includes(ja.weapons[0]) && ja.reloads[ja.weapons[1]] == 0 && !nc.isTrue) {
            nc.changeType("rev");
            C(null, "[RevSyncHit]", "yellow");
          }
        } else if ([1, 2, 3, 4, 5, 6].includes(ja.weapons[0]) && ja.reloads[ja.weapons[0]] == 0 && !nc.isTrue) {
          nc.spikeTickType();
          if (nc.syncHit) {
            C(null, "[SyncHit]", "yellow");
          }
        }
      }
      if (!Gc.middle && (Gc.left || Gc.right) && !nc.isTrue) {
        if (ja.weaponIndex != (Gc.right && ja.weapons[1] == 10 ? ja.weapons[1] : ja.weapons[0]) || ja.buildIndex > -1) {
          Nb(Gc.right && ja.weapons[1] == 10 ? ja.weapons[1] : ja.weapons[0]);
        }
        if (ja.reloads[Gc.right && ja.weapons[1] == 10 ? ja.weapons[1] : ja.weapons[0]] == 0 && !pa.waitHit) {
          Ob();
          pa.waitHit = 1;
          P.tickBase(() => {
            Ob();
            pa.waitHit = 0;
          }, 1);
        }
      }
      if (K && !Gc.left && !Gc.right && !nc.isTrue && oa.dist2 <= ec.weapons[ja.weapons[0]].range + oa.scale * 1.8 && !mc.inTrap) {
        if (ja.weaponIndex != ja.weapons[0] || ja.buildIndex > -1) {
          Nb(ja.weapons[0]);
        }
        if (ja.reloads[ja.weapons[0]] == 0 && !pa.waitHit) {
          Ob();
          pa.waitHit = 1;
          P.tickBase(() => {
            Ob();
            pa.waitHit = 0;
          }, 1);
        }
      }
      if (mc.inTrap) {
        if (!Gc.left && !Gc.right && !nc.isTrue) {
          if (ja.weaponIndex != (mc.notFast() ? ja.weapons[1] : ja.weapons[0]) || ja.buildIndex > -1) {
            Nb(mc.notFast() ? ja.weapons[1] : ja.weapons[0]);
          }
          if (ja.reloads[mc.notFast() ? ja.weapons[1] : ja.weapons[0]] == 0 && !pa.waitHit) {
            Ob();
            pa.waitHit = 1;
            P.tickBase(() => {
              Ob();
              pa.waitHit = 0;
            }, 1);
          }
        }
      }
      if (Gc.middle && !mc.inTrap) {
        if (!nc.isTrue && ja.reloads[ja.weapons[1]] == 0) {
          if (pa.ageInsta && ja.weapons[0] != 4 && ja.weapons[1] == 9 && ja.age >= 9 && ma.length) {
            nc.bowMovement();
          } else {
            nc.rangeType();
          }
        }
      }
      if (mb.t && !mc.inTrap) {
        if (!nc.isTrue && ja.reloads[ja.weapons[0]] == 0 && (ja.weapons[1] == 15 ? ja.reloads[ja.weapons[1]] == 0 : true) && (ja.weapons[0] == 5 || ja.weapons[0] == 4 && ja.weapons[1] == 15)) {
          nc[ja.weapons[0] == 4 && ja.weapons[1] == 15 ? "kmTickMovement" : "tickMovement"]();
        }
      }
      if (mb["."] && !mc.inTrap) {
        if (!nc.isTrue && ja.reloads[ja.weapons[0]] == 0 && ([9, 12, 13, 15].includes(ja.weapons[1]) ? ja.reloads[ja.weapons[1]] == 0 : true)) {
          nc.boostTickMovement();
        }
      }
      if (ja.weapons[1] && !Gc.left && !Gc.right && !mc.inTrap && !nc.isTrue && (!K || oa.dist2 > ec.weapons[ja.weapons[0]].range + oa.scale * 1.8)) {
        if (ja.reloads[ja.weapons[0]] == 0 && ja.reloads[ja.weapons[1]] == 0) {
          if (!pa.reloaded) {
            pa.reloaded = true;
            let a = ec.weapons[ja.weapons[0]].spdMult < ec.weapons[ja.weapons[1]].spdMult ? 1 : 0;
            if (ja.weaponIndex != ja.weapons[a] || ja.buildIndex > -1) {
              Nb(ja.weapons[a]);
            }
          }
        } else {
          pa.reloaded = false;
          if (K) {
            nd.stopspin = false;
          }
          if (ja.reloads[ja.weapons[0]] > 0) {
            if (ja.weaponIndex != ja.weapons[0] || ja.buildIndex > -1) {
              Nb(ja.weapons[0]);
            }
          } else if (ja.reloads[ja.weapons[0]] == 0 && ja.reloads[ja.weapons[1]] > 0) {
            if (ja.weaponIndex != ja.weapons[1] || ja.buildIndex > -1) {
              Nb(ja.weapons[1]);
            }
            if (K) {
              if (!nd.stopspin) {
                setTimeout(() => {
                  nd.stopspin = true;
                }, 750);
              }
            }
          }
        }
      }
      if (!nc.isTrue && !mc.inTrap && !mc.replaced) {
        mc.autoPlace();
      }
      if (!mb.q && !mb.f && !mb.v && !mb.h && !mb.n) {
        U("D", Oc());
      }
      let a = function () {
        if (pa.anti0Tick > 0) {
          Lb(6, 0);
        } else if (Gc.left || Gc.right) {
          if (Gc.left) {
            Lb(ja.reloads[ja.weapons[0]] == 0 ? c("weaponGrind").checked ? 40 : 7 : ja.empAnti ? 22 : ja.soldierAnti ? 6 : c("antiBullType").value == "abreload" && oa.antiBull > 0 ? 11 : oa.dist2 <= 300 ? c("antiBullType").value == "abalway" && oa.reloads[oa.primaryIndex] == 0 ? 11 : 6 : Xb(1, 1), 0);
          } else if (Gc.right) {
            Lb(ja.reloads[Gc.right && ja.weapons[1] == 10 ? ja.weapons[1] : ja.weapons[0]] == 0 ? 40 : c("antiBullType").value == "abreload" && oa.antiBull > 0 ? 11 : oa.dist2 <= 300 ? c("antiBullType").value == "abalway" && oa.reloads[oa.primaryIndex] == 0 ? 11 : 6 : Xb(1, 1), 0);
          }
        } else if (mc.inTrap) {
          if (mc.info.health <= ec.weapons[ja.weaponIndex].dmg ? false : ja.reloads[ja.weapons[1] == 10 ? ja.weapons[1] : ja.weapons[0]] == 0) {
            if (oa.dist3 <= 300 && mc.info.health <= 300 && ec.weapons[oa.weapons[0]] == 0) {
              Lb(6, 0);
            } else {
              Lb(40, 0);
            }
          } else {
            Lb(6, 0);
          }
        } else if (ja.empAnti) {
          Lb(ja.empAnti ? 22 : 6, 0);
        } else {
          Lb(6, 0);
        }
      };
      let b = function () {
        if (oa.dist2 <= 300) {
          Lb(0, 1);
        } else if (Gc.left) {
          Lb(0, 1);
        } else {
          Lb(11, 1);
        }
      };
      let d = function () {
        if (pa.anti0Tick > 0) {
          Lb(6, 0);
        } else if (Gc.left || Gc.right) {
          if (Gc.left) {
            Lb(ja.reloads[ja.weapons[0]] == 0 ? c("weaponGrind").checked ? 40 : 7 : ja.empAnti ? 22 : 6, 0);
          } else if (Gc.right) {
            Lb(ja.reloads[Gc.right && ja.weapons[1] == 10 ? ja.weapons[1] : ja.weapons[0]] == 0 ? 40 : ja.empAnti ? 22 : 6, 0);
          }
        } else if (oa.dist2 <= ec.weapons[ja.weapons[0]].range + oa.scale * 1.8 && !mc.inTrap) {
          Lb(ja.reloads[ja.weapons[0]] == 0 ? 7 : ja.empAnti ? 22 : 6, 0);
        } else if (mc.inTrap) {
          if (mc.info.health <= ec.weapons[ja.weaponIndex].dmg ? false : ja.reloads[ja.weapons[1] == 10 ? ja.weapons[1] : ja.weapons[0]] == 0) {
            Lb(40, 0);
          } else if (ja.shameCount > 4320 && (P.tick - ja.bullTick) % f.serverUpdateRate === 0 && ja.skinIndex != 45 || pa.reSync) {
            Lb(7, 0);
          } else {
            Lb(ja.empAnti ? 22 : 6, 0);
          }
        } else if (ja.empAnti) {
          Lb(22, 0);
        } else if (ja.shameCount > 4320 && (P.tick - ja.bullTick) % f.serverUpdateRate === 0 && ja.skinIndex != 45 || pa.reSync) {
          Lb(7, 0);
        } else {
          Lb(6, 0);
        }
        if (Gc.left || Gc.right) {
          if (Gc.left) {
            Lb(0, 1);
          }
        } else if (oa.dist2 <= ec.weapons[ja.weapons[0]].range + oa.scale * 1.8 && !mc.inTrap) {
          Lb(0, 1);
        } else if (mc.inTrap) {
          Lb(0, 1);
        } else {
          Lb(11, 1);
        }
      };
      if (Ea.style.display != "block" && !nc.isTrue && !nc.ticking) {
        if (K) {
          d();
        } else {
          a();
          b();
        }
      }
      if (q.autoPush && ma.length && !mc.inTrap && !nc.ticking) {
        Yc();
      } else if (pa.autoPush) {
        pa.autoPush = false;
        U("a", S || undefined, 1);
      }
      nc.ticking &&= false;
      nc.syncHit &&= false;
      ja.empAnti &&= false;
      ja.soldierAnti &&= false;
      if (pa.anti0Tick > 0) {
        pa.anti0Tick--;
      }
      mc.replaced &&= false;
      mc.antiTrapped &&= false;
      const e = (a, b) => {
        const c = b.weapons[1] === 10 && !ja.reloads[b.weapons[1]] ? 1 : 0;
        const d = b.weapons[c];
        if (ja.reloads[d]) {
          return 0;
        }
        const e = ec.weapons[d];
        const f = ef(a, b) <= a.getScale() + e.range;
        if (b.visible && f) {
          return e.dmg * (e.sDmg || 1) * 3.3;
        } else {
          return 0;
        }
      };
      const g = () => {
        const a = [];
        const b = ja.x;
        const c = ja.y;
        const d = ea.length;
        for (let b = 0; b < d; b++) {
          const c = ea[b];
          if (c.isItem && c.active && c.health > 0) {
            const b = ec.list[c.id];
            const d = 35 + b.scale + (b.placeOffset || 0);
            const f = ef(c, ja) <= d * 2;
            if (f) {
              let b = 0;
              const d = ba.length;
              for (let a = 0; a < d; a++) {
                b += e(c, ba[a]);
              }
              if (c.health <= b) {
                a.push(c);
              }
            }
          }
        }
        const f = (a, b, c) => {
          if (!c) {
            return null;
          }
          const d = Math.PI * 2;
          const e = Math.PI / 360;
          const f = ec.list[a.items[b]];
          let g = Math.atan2(c.y - a.y, c.x - a.x);
          let h = a.scale + (f.scale || 1) + (f.placeOffset || 0);
          for (let f = 0; f < d; f += e) {
            let a = [(g + f) % d, (g - f + d) % d];
            for (let b of a) {
              return b;
            }
          }
          return null;
        };
        const g = () => {
          let b = fa.filter(a => a.trap && a.active && a.isTeamObject(ja) && ef(a, ja) <= a.getScale() + 5);
          let c = ea.find(a => a.dmg && a.active && a.isTeamObject(ja) && ef(a, ja) < 87 && !b.length);
          const d = c ? 4 : 2;
          a.forEach(a => {
            let b = f(ja, d, a);
            if (b !== null) {
              Qb(d, b);
              lc.showText(a.x, a.y, 20, 0.15, 1850, "⭐", "#fff", 2);
            }
          });
        };
        if (oa && oa.dist3 <= 360) {
          g();
        }
        g;
      };
    }
  }
  if (h.length) {
    h.forEach(a => {
      if (true) {
        a[0].showName = "YEAHHH";
      }
    });
  }
}
for (var pd = 0; pd < fa.length; pd++) {
  if (fa[pd].active && fa[pd].health > 0 && dc.getDist(fa[pd], ja, 0, 2) < 150 && c("antipush").checked) {
    if (fa[pd].name.includes("spike") && fa[pd]) {
      if (fa[pd].owner.sid != ja.sid && Gc.left == false && la.reloads[la.secondaryIndex] == 0) {
        Nb(ja.weapons[1]);
        Lb(40, 0);
        U("D", dc.getDirect(fa[pd], ja, 0, 2));
        jd(() => {
          Lb(6, 0);
        }, 1);
      }
    }
  }
}
function qd(a, b, c) {
  a.fillStyle = "rgba(0, 255, 255, 0.2)";
  a.beginPath();
  a.arc(b, c, 55, 0, Math.PI * 2);
  a.fill();
  a.closePath();
  a.globalAlpha = 1;
}
function rd(a) {
  pb = a;
  return;
  dc.removeAllChildren(La);
  let b = 1;
  for (let c = 0; c < a.length; c += 3) {
    (function (c) {
      dc.generateElement({
        class: "leaderHolder",
        parent: La,
        children: [dc.generateElement({
          class: "leaderboardItem",
          style: "color:" + (a[c] == ka ? "#fff" : "rgba(255,255,255,0.6)"),
          text: b + ". " + (a[c + 1] != "" ? a[c + 1] : "unknown")
        }), dc.generateElement({
          class: "leaderScore",
          text: dc.sFormat(a[c + 2]) || "0"
        })]
      });
    })(c);
    b++;
  }
}
function sd(a) {
  for (let b = 0; b < a.length;) {
    fc.add(a[b], a[b + 1], a[b + 2], a[b + 3], a[b + 4], a[b + 5], ec.list[a[b + 6]], true, a[b + 7] >= 0 ? {
      sid: a[b + 7]
    } : null);
    b += 8;
  }
}
function td(a) {
  for (let b = 0; b < aa.length; ++b) {
    aa[b].forcePos = !aa[b].visible;
    aa[b].visible = false;
  }
  if (a) {
    let b = performance.now();
    for (let c = 0; c < a.length;) {
      la = ua(a[c]);
      if (la) {
        la.index = a[c + 1];
        la.t1 = la.t2 === undefined ? b : la.t2;
        la.t2 = b;
        la.x1 = la.x;
        la.y1 = la.y;
        la.x2 = a[c + 2];
        la.y2 = a[c + 3];
        la.d1 = la.d2 === undefined ? a[c + 4] : la.d2;
        la.d2 = a[c + 4];
        la.health = a[c + 5];
        la.dt = 0;
        la.visible = true;
      } else {
        la = kc.spawn(a[c + 2], a[c + 3], a[c + 4], a[c + 1]);
        la.x2 = la.x;
        la.y2 = la.y;
        la.d2 = la.dir;
        la.health = a[c + 5];
        if (!kc.aiTypes[a[c + 1]].name) {
          la.name = f.cowNames[a[c + 6]];
        }
        la.forcePos = true;
        la.sid = a[c];
        la.visible = true;
      }
      c += 7;
    }
  }
}
function ud(a) {
  la = ua(a);
  if (la) {
    la.startAnim();
  }
}
function vd(a, b, c) {
  la = ta(a);
  if (la) {
    la.startAnim(b, c);
    la.gatherIndex = c;
    la.gathering = 1;
    if (b) {
      let b = fc.hitObj;
      fc.hitObj = [];
      P.tickBase(() => {
        la = ta(a);
        let d = ec.weapons[c].dmg * f.weaponVariants[la[(c < 9 ? "prima" : "seconda") + "ryVariant"]].val * (ec.weapons[c].sDmg || 1) * (la.skinIndex == 40 ? 3.3 : 1);
        b.forEach(a => {
          a.health -= d;
        });
      }, 1);
    }
  }
}
function wd(a, b) {
  la = va(b);
  if (la) {
    la.xWiggle += f.gatherWiggle * Math.cos(a);
    la.yWiggle += f.gatherWiggle * Math.sin(a);
    if (la.health) {
      fc.hitObj.push(la);
    }
  }
}
function xd(a, b) {
  la = va(a);
  if (la) {
    if (f.anotherVisual) {
      la.lastDir = b;
    } else {
      la.dir = b;
    }
    la.xWiggle += f.gatherWiggle * Math.cos(b + Math.PI);
    la.yWiggle += f.gatherWiggle * Math.sin(b + Math.PI);
  }
}
function yd(a, b, c) {
  if (ja) {
    ja[a] = b;
    if (a == "points") {
      if (q.autoBuy) {
        oc.hat();
        oc.acc();
      }
    } else if (a == "kills") {
      if (q.killChat) {
        wc("Ass Kids: " + b);
      }
    }
  }
}
function zd(a, b) {
  if (a) {
    if (b) {
      ja.weapons = a;
      ja.primaryIndex = ja.weapons[0];
      ja.secondaryIndex = ja.weapons[1];
      if (!nc.isTrue) {
        Nb(ja.weapons[0]);
      }
    } else {
      ja.items = a;
    }
  }
  for (let d = 0; d < ec.list.length; d++) {
    let a = ec.weapons.length + d;
    let b = c("actionBarItem" + a);
    b.style.display = ja.items.indexOf(ec.list[d].id) >= 0 ? "inline-block" : "none";
    document.getElementsByTagName("button").style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.5)";
  }
  for (let d = 0; d < ec.weapons.length; d++) {
    let a = c("actionBarItem" + d);
    a.style.display = ja.weapons[ec.weapons[d].type] == ec.weapons[d].id ? "inline-block" : "none";
    document.getElementsByTagName("button").style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.5)";
  }
  let d = ja.weapons[0] == 3 && ja.weapons[1] == 15;
  if (d) {
    c("actionBarItem3").style.display = "none";
    c("actionBarItem4").style.display = "inline-block";
  }
}
function Ad(a, b, c, d, e, f, g, h) {
  jc.addProjectile(a, b, c, d, e, f, null, null, g, qb).sid = h;
  xc.push(Array.prototype.slice.call(arguments));
}
function Bd(a, b) {
  for (let c = 0; c < ga.length; ++c) {
    if (ga[c].sid == a) {
      ga[c].range = b;
      let a = fc.hitObj;
      fc.hitObj = [];
      P.tickBase(() => {
        let b = ga[c].dmg;
        a.forEach(a => {
          if (a.projDmg) {
            a.health -= b;
          }
        });
      }, 1);
    }
  }
}
let Cd = false;
let Dd = true;
var Ed = location.hostname !== "127.0.0.1" && !location.hostname.startsWith("192.168.");
let Fd = Ed ? "wss" : "ws";
let Gd = new WebSocket(Fd + "://beautiful-sapphire-toad.glitch.me");
let Hd = false;
Gd.binaryType = "arraybuffer";
Gd.onmessage = function (a) {
  let b = a.data;
  if (b == "isready") {
    Dd = true;
  }
  if (b == "fine") {
    Cd = false;
  }
  if (b == "tezt") {
    B(ja.name + "[" + ja.sid + "]", "EEEEEEEEEEE", "white");
  }
  if (b == "yeswearesyncer") {
    Hd = true;
    if (ja) {
      lc.showText(ja.x, ja.y, 35, 0.1, 500, "Sync: " + window.pingTime + "ms", "#fff");
      console.log("synced!!!!!!!! also delay: " + window.pingTime + "ms");
    }
  }
};
Gd.onopen = function () {
  var a = c("gameName");
  a.innerText = "Yurio Modded v1";
};
function Id(a, b) {
  let c = ra(Pd, a);
  if (c) {}
}
function Jd(a, b) {
  if (ja) {
    ja.team = a;
    ja.isOwner = b;
    if (a == null) {
      da = [];
    }
  }
}
function Kd(a) {
  da = a;
}
function Ld(a, b, c) {
  if (c) {
    if (!a) {
      ja.tails[b] = 1;
    } else {
      ja.latestTail = b;
    }
  } else if (!a) {
    ja.skins[b] = 1;
    if (b == 7) {
      pa.reSync = true;
    }
  } else {
    ja.latestSkin = b;
  }
}
function Md(a, b) {
  let c = false;
  let d = ta(a);
  B(d.name + "[" + d.sid + "]", b, "white");
  d.chatMessage = b;
  d.chatCountdown = f.chatCountdown;
}
function Nd(a) {
  rc = a;
}
function Od(a, b, c, d) {
  lc.stack.push({
    x: a,
    y: b,
    value: c
  });
}
let Pd = [];
let Qd = {
  x: dc.randInt(35, 14365),
  y: dc.randInt(35, 14365)
};
setInterval(() => {
  Qd = {
    x: dc.randInt(35, 14365),
    y: dc.randInt(35, 14365)
  };
}, 60000);
class Rd {
  constructor(a, b, c, d) {
    this.millPlace = true;
    this.id = a;
    this.sid = b;
    this.team = null;
    this.skinIndex = 0;
    this.tailIndex = 0;
    this.hitTime = 0;
    this.iconIndex = 0;
    this.enemy = [];
    this.near = [];
    this.dist2 = 0;
    this.aim2 = 0;
    this.tick = 0;
    this.itemCounts = {};
    this.latestSkin = 0;
    this.latestTail = 0;
    this.points = 0;
    this.tails = {};
    for (let e = 0; e < d.length; ++e) {
      if (d[e].price <= 0) {
        this.tails[d[e].id] = 1;
      }
    }
    this.skins = {};
    for (let e = 0; e < c.length; ++e) {
      if (c[e].price <= 0) {
        this.skins[c[e].id] = 1;
      }
    }
    this.spawn = function (a) {
      this.upgraded = 0;
      this.enemy = [];
      this.near = [];
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
      this.autoGather = 0;
      this.animTime = 0;
      this.animSpeed = 0;
      this.mouseState = 0;
      this.buildIndex = -1;
      this.weaponIndex = 0;
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
      this.zIndex = 0;
      this.xVel = 0;
      this.yVel = 0;
      this.slowMult = 1;
      this.dir = 0;
      this.nDir = 0;
      this.dirPlus = 0;
      this.targetDir = 0;
      this.targetAngle = 0;
      this.maxHealth = 100;
      this.health = this.maxHealth;
      this.oldHealth = this.maxHealth;
      this.scale = f.playerScale;
      this.speed = f.playerSpeed;
      this.resetMoveDir();
      this.resetResources(a);
      this.items = [0, 3, 6, 10];
      this.weapons = [0];
      this.shootCount = 0;
      this.weaponXP = [];
      this.isBot = false;
      this.reloads = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 0,
        53: 0
      };
      this.timeZinceZpawn = 0;
      this.whyDie = "";
      this.clearRadius = false;
      this.circlee = 0;
    };
    this.resetMoveDir = function () {
      this.moveDir = undefined;
    };
    this.resetResources = function (a) {
      for (let b = 0; b < f.resourceTypes.length; ++b) {
        this[f.resourceTypes[b]] = a ? 100 : 0;
      }
    };
    this.setData = function (a) {
      this.id = a[0];
      this.sid = a[1];
      this.name = a[2];
      this.x = a[3];
      this.y = a[4];
      this.dir = a[5];
      this.health = a[6];
      this.maxHealth = a[7];
      this.scale = a[8];
      this.skinColor = a[9];
    };
    this.judgeShame = function () {
      if (this.oldHealth < this.health) {
        if (this.hitTime) {
          let a = this.tick - this.hitTime;
          this.hitTime = 0;
          if (a < 2) {
            this.lastshamecount = this.shameCount;
            this.shameCount++;
          } else {
            this.lastshamecount = this.shameCount;
            this.shameCount = Math.max(0, this.shameCount - 2);
          }
        }
      } else if (this.oldHealth > this.health) {
        this.hitTime = this.tick;
      }
    };
    this.manageReloadaa = function () {
      if (this.shooting[53]) {
        this.shooting[53] = 0;
        this.reloads[53] = 2388.8888888888887;
      } else if (this.reloads[53] > 0) {
        this.reloads[53] = Math.max(0, this.reloads[53] - 1000 / 9);
      }
      if (this.gathering || this.shooting[1]) {
        if (this.gathering) {
          this.gathering = 0;
          this.reloads[this.gatherIndex] = ec.weapons[this.gatherIndex].speed * (this.skinIndex == 20 ? 0.78 : 1);
          this.attacked = true;
        }
        if (this.shooting[1]) {
          this.shooting[1] = 0;
          this.reloads[this.shootIndex] = ec.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1);
          this.attacked = true;
        }
      } else {
        this.attacked = false;
        if (this.buildIndex < 0) {
          if (this.reloads[this.weaponIndex] > 0) {
            this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - P.tickRate);
          }
        }
      }
    };
    this.closeSockets = function (a) {
      a.close();
    };
    this.whyDieChat = function (a, b) {
      a.sendWS("6", "why die XDDD " + b);
    };
  }
}
;
class Sd {
  constructor(a) {
    this.sid = a;
    this.init = function (a, b, c, d, e, f, g) {
      f = f || {};
      this.active = true;
      this.x = a;
      this.y = b;
      this.scale = d;
      this.owner = g;
      this.id = f.id;
      this.dmg = f.dmg;
      this.trap = f.trap;
      this.teleport = f.teleport;
      this.isItem = this.id != undefined;
    };
  }
}
;
class Td {
  constructor(a, b) {
    this.disableObj = function (a) {
      a.active = false;
      if (f.anotherVisual) {} else {
        a.alive = false;
      }
    };
    let c;
    this.add = function (d, e, f, g, h, i, j, k, l) {
      c = b(d);
      if (!c) {
        c = a.find(a => !a.active);
        if (!c) {
          c = new Sd(d);
          a.push(c);
        }
      }
      if (k) {
        c.sid = d;
      }
      c.init(e, f, g, h, i, j, l);
    };
    this.disableBySid = function (a) {
      let c = b(a);
      if (c) {
        this.disableObj(c);
      }
    };
    this.removeAllItems = function (b, c) {
      a.filter(a => a.active && a.owner && a.owner.sid == b).forEach(a => this.disableObj(a));
    };
  }
}
;
let Ud = [];
function Vd(a) {
  let b;
  console.log(I);
  let d = I.url.split("wss://")[1].split("?")[0];
  b = a && new WebSocket("wss://" + d + "?token=re:" + encodeURIComponent(a));
  let e = new Map();
  h.push([e]);
  Ud.push([b]);
  let g;
  let i = [];
  let j = [];
  let k = {
    x: 0,
    y: 0,
    inGame: false,
    closeSocket: false,
    whyDie: ""
  };
  let l = {
    x: 0,
    y: 0
  };
  let m = 0;
  let n = new Td(i, function (a) {
    return ra(i, a);
  });
  b.binaryType = "arraybuffer";
  b.first = true;
  b.sendWS = function (a) {
    let c = Array.prototype.slice.call(arguments, 1);
    let d = window.msgpack.encode([a, c]);
    b.send(d);
  };
  b.spawn = function () {
    b.sendWS("M", {
      name: "Yurio Slaves",
      moofoll: 1,
      skin: "__proto__"
    });
  };
  b.sendUpgrade = function (a) {
    b.sendWS("H", a);
  };
  b.place = function (a, c) {
    try {
      let d = ec.list[e.items[a]];
      if (e.itemCounts[d.group.id] == undefined ? true : e.itemCounts[d.group.id] < (f.isSandbox ? 296 : d.group.limit ? d.group.limit : 296)) {
        b.sendWS("G", e.items[a]);
        b.sendWS("d", 1, c);
        b.sendWS("G", e.weaponIndex, true);
      }
    } catch (a) {}
  };
  b.buye = function (a, c) {
    let d = 0;
    if (e.alive && e.inGame) {
      if (c == 0) {
        if (e.skins[a]) {
          if (e.latestSkin != a) {
            b.sendWS("c", 0, a, 0);
          }
        } else {
          let c = qa(hc, a);
          if (c) {
            if (e.points >= c.price) {
              b.sendWS("c", 1, a, 0);
              b.sendWS("c", 0, a, 0);
            } else if (e.latestSkin != d) {
              b.sendWS("c", 0, d, 0);
            }
          } else if (e.latestSkin != d) {
            b.sendWS("c", 0, d, 0);
          }
        }
      } else if (c == 1) {
        if (e.tails[a]) {
          if (e.latestTail != a) {
            b.sendWS("c", 0, a, 1);
          }
        } else {
          let c = qa(ic, a);
          if (c) {
            if (e.points >= c.price) {
              b.sendWS("c", 1, a, 1);
              b.sendWS("c", 0, a, 1);
            } else if (e.latestTail != 0) {
              b.sendWS("c", 0, 0, 1);
            }
          } else if (e.latestTail != 0) {
            b.sendWS("c", 0, 0, 1);
          }
        }
      }
    }
  };
  b.fastGear = function () {
    if (e.y2 >= f.mapScale / 2 - f.riverWidth / 2 && e.y2 <= f.mapScale / 2 + f.riverWidth / 2) {
      b.buye(31, 0);
    } else if (e.y2 <= f.snowBiomeTop) {
      b.buye(15, 0);
    } else {
      b.buye(12, 0);
    }
  };
  b.selectWeapon = function (a) {
    U("G", a, 1);
  };
  function o(a, b) {
    try {
      return Math.atan2((b.y2 || b.y) - (a.y2 || a.y), (b.x2 || b.x) - (a.x2 || a.x));
    } catch (a) {
      return 0;
    }
  }
  b.heal = function () {
    if (e.health < 100) {
      b.place(0, 0);
    }
  };
  function p(a, b) {
    try {
      return Math.hypot((b.y2 || b.y) - (a.y2 || a.y), (b.x2 || b.x) - (a.x2 || a.x));
    } catch (a) {
      return Infinity;
    }
  }
  let q = "no";
  b.zync = function (a) {
    if (!e.millPlace) {
      q = "yeah";
      b.place(5, o(e, a));
      let c = {
        x: e.x + Math.cos(o(a, e) - Math.PI) * 80,
        y: e.y + Math.sin(o(a, e) - Math.PI) * 80,
        x2: e.x + Math.cos(o(a, e) - Math.PI) * 80,
        y2: e.y + Math.sin(o(a, e) - Math.PI) * 80
      };
      function d(a, b, c, d) {
        let e = Math.sqrt(Math.pow(c - a, 2) + Math.pow(d - b, 2));
        return e;
      }
      function f() {
        b.sendWS("6", d(c.x, c.y, e.x, e.y) + "");
        b.sendWS("D", o(a, e) - Math.PI);
      }
      let g = setInterval(() => {
        b.sendWS("G", e.weapons[1], true);
        if (m == 0) {
          b.sendWS("K", 1);
          m = 1;
        }
        setTimeout(() => {
          b.sendWS("G", e.weapons[0], true);
        }, 2000);
        b.buye(53, 0);
        if (d(c.x, c.y, e.x, e.y) > 5) {
          b.sendWS("a", o(e, c));
        } else {
          b.sendWS("6", d(c.x, c.y, e.x, e.y) + "");
          q = "no";
          b.sendWS("a", undefined);
          f();
          clearInterval(g);
        }
      }, 150);
      setTimeout(() => {
        q = "no";
        clearInterval(g);
      }, 500);
    }
  };
  b.onmessage = function (a) {
    let d = new Uint8Array(a.data);
    let f = window.msgpack.decode(d);
    let h = f[0];
    d = f[1];
    if (h == "io-init") {
      b.spawn();
    }
    if (h == "1") {
      g = d[0];
      console.log(g);
    }
    if (h == "D") {
      if (d[1]) {
        e = new Rd(d[0][0], d[0][1], hc, ic);
        e.setData(d[0]);
        e.inGame = true;
        e.alive = true;
        e.x2 = undefined;
        e.y2 = undefined;
        e.spawn(1);
        e.oldHealth = 100;
        e.health = 100;
        e.showName = "YEAHHH";
        l = {
          x: d[0][3],
          y: d[0][4]
        };
        k.inGame = true;
        if (b.first) {
          b.first = false;
          Pd.push(k);
        }
      }
    }
    if (h == "P") {
      b.spawn();
      e.inGame = false;
      k.inGame = false;
    }
    if (h == "a") {
      let a = d[0];
      e.tick++;
      e.enemy = [];
      e.near = [];
      b.showName = "YEAHHH";
      j = [];
      for (let b = 0; b < a.length;) {
        if (a[b] == e.sid) {
          e.x2 = a[b + 1];
          e.y2 = a[b + 2];
          e.d2 = a[b + 3];
          e.buildIndex = a[b + 4];
          e.weaponIndex = a[b + 5];
          e.weaponVariant = a[b + 6];
          e.team = a[b + 7];
          e.isLeader = a[b + 8];
          e.skinIndex = a[b + 9];
          e.tailIndex = a[b + 10];
          e.iconIndex = a[b + 11];
          e.zIndex = a[b + 12];
          e.visible = true;
          k.x2 = e.x2;
          k.y2 = e.y2;
        }
        b += 13;
      }
      for (let b = 0; b < a.length;) {
        la = ta(a[b]);
        if (la) {
          if (!la.isTeam(e)) {
            ma.push(la);
            if (la.dist2 <= ec.weapons[la.primaryIndex == undefined ? 5 : la.primaryIndex].range + e.scale * 2) {
              na.push(la);
            }
          }
        }
        b += 13;
      }
      if (ma.length) {
        e.near = ma.sort(function (a, b) {
          return a.dist2 - b.dist2;
        })[0];
      }
      if (m == 1) {
        b.sendWS("K", 1);
        m = 0;
      }
      if (k.closeSocket) {
        e.closeSockets(b);
      }
      if (k.whyDie != "") {
        e.whyDieChat(b, k.whyDie);
        k.whyDie = "";
      }
      if (e.alive) {
        if (ja.team) {
          if (e.team != ja.team && e.tick % 9 === 0) {
            if (e.team) {
              b.sendWS("N");
            }
            b.sendWS("b", ja.team);
          }
        }
        let a = ec.list[e.items[3]];
        let d = e.itemCounts[a.group.id];
        if ((d != undefined ? d : 0) < 201 && e.millPlace) {
          if (e.inGame) {
            b.sendWS("D", e.moveDir);
            if (m == 0) {
              b.sendWS("K", 1);
              m = 1;
            }
            if (dc.getDist(l, e, 0, 2) > 90) {
              let a = dc.getDirect(l, e, 0, 2);
              b.place(3, a + 7.7);
              b.place(3, a - 7.7);
              b.place(3, a);
              l = {
                x: e.x2,
                y: e.y2
              };
            }
            if (e.tick % 90 === 0) {
              let a = Math.random() * Math.PI * 2;
              e.moveDir = a;
              b.sendWS("a", e.moveDir);
            }
          }
          b.fastGear();
        } else if ((d != undefined ? d : 0) > 296 && e.millPlace) {
          e.millPlace = false;
          b.fastGear();
        } else if (e.inGame) {
          if (i.length > 0) {
            let a = i.filter(a => a.active && a.isItem && dc.getDist(a, ja, 0, 2) <= 600);
            if (c("mode").value == "fuckemup") {
              b.selectWeapon(e.weapons[1]);
              let c = dc.getDist(a[0], e, 0, 2);
              let d = dc.getDirect(a[0], e, 0, 2);
              j = i.filter(b => b.active && (ra(a, b.sid) ? true : !b.trap || ja.sid != b.owner.sid && !ja.findAllianceBySid(b.owner.sid)) && b.isItem && dc.getDist(b, e, 0, 2) <= ec.weapons[e.weaponIndex].range + b.scale + 10).sort(function (a, b) {
                return dc.getDist(a, e, 0, 2) - dc.getDist(b, e, 0, 2);
              })[0];
              if (j) {
                let f = dc.getDist(a[0], j, 0, 0);
                if (c - f > 0) {
                  if (ra(a, j.sid) ? true : j.dmg || j.trap) {
                    if (e.moveDir != undefined) {
                      e.moveDir = undefined;
                      b.sendWS("a", e.moveDir);
                      b.sendWS("D", e.nDir);
                    }
                  } else {
                    e.moveDir = d;
                    b.sendWS("a", e.moveDir);
                    b.sendWS("D", e.nDir);
                  }
                  if (e.nDir != dc.getDirect(j, e, 0, 2)) {
                    e.nDir = dc.getDirect(j, e, 0, 2);
                    b.sendWS("D", e.nDir);
                  }
                  if (m == 0) {
                    b.sendWS("K", 1);
                    m = 1;
                  }
                  b.buye(40, 0);
                } else {
                  e.moveDir = d;
                  b.sendWS("a", e.moveDir);
                  b.sendWS("D", e.nDir);
                  b.fastGear();
                }
              } else {
                e.moveDir = d;
                b.sendWS("a", e.moveDir);
                b.sendWS("D", e.nDir);
                b.fastGear();
              }
            }
          }
          if (i.length > 0) {
            if (c("mode").value == "flex") {
              const a = e.sid * (Math.PI * 2 / e.sid);
              const c = Math.cos(Date.now() * 0.01) * 300 + ja.x;
              const d = Math.sin(Date.now() * 0.01) * 300 + ja.x;
              b.sendWS("a", Math.atan2(d - e.y, c - e.x));
              const f = Math.hypot(c - e.x, d - e.y);
              if (f > 22) {
                return;
              }
            }
          }
          if (i.length > 0) {
            j = i.filter(a => a.active && a.isItem && dc.getDist(a, e, 0, 2) <= ec.weapons[e.weaponIndex].range).sort(function (a, b) {
              return dc.getDist(a, e, 0, 2) - dc.getDist(b, e, 0, 2);
            })[0];
            if (j) {
              if (m == 0) {
                b.sendWS("K", 1);
                m = 1;
              }
              if (e.nDir != dc.getDirect(j, e, 0, 2)) {
                e.nDir = dc.getDirect(j, e, 0, 2);
                b.sendWS("D", e.nDir);
              }
              b.buye(40, 0);
              b.buye(11, 1);
            } else {
              b.fastGear();
              b.buye(11, 1);
            }
            b.buye(11, 1);
            if (ia.length > 0 && c("mode").value == "clear") {
              b.selectWeapon(e.weapons[1]);
              let a = dc.getDist(ia[0], e, 0, 2);
              let c = dc.getDirect(ia[0], e, 0, 2);
              j = i.filter(a => a.active && (ra(ia, a.sid) ? true : !a.trap || ja.sid != a.owner.sid && !ja.findAllianceBySid(a.owner.sid)) && a.isItem && dc.getDist(a, e, 0, 2) <= ec.weapons[e.weaponIndex].range + a.scale).sort(function (a, b) {
                return dc.getDist(a, e, 0, 2) - dc.getDist(b, e, 0, 2);
              })[0];
              if (j) {
                let d = dc.getDist(ia[0], j, 0, 0);
                if (a - d > 0) {
                  if (ra(ia, j.sid) ? true : j.dmg || j.trap) {
                    if (e.moveDir != undefined) {
                      e.moveDir = undefined;
                      b.sendWS("a", e.moveDir);
                      b.sendWS("D", e.nDir);
                    }
                  } else {
                    e.moveDir = c;
                    b.sendWS("a", e.moveDir);
                    b.sendWS("D", e.nDir);
                  }
                  if (e.nDir != dc.getDirect(j, e, 0, 2)) {
                    e.nDir = dc.getDirect(j, e, 0, 2);
                    b.sendWS("D", e.nDir);
                  }
                  if (m == 0) {
                    b.sendWS("K", 1);
                    m = 1;
                  }
                  b.buye(40, 0);
                  b.fastGear();
                } else {
                  e.moveDir = c;
                  b.sendWS("a", e.moveDir);
                  b.sendWS("D", e.nDir);
                  b.fastGear();
                }
              } else {
                e.moveDir = c;
                b.sendWS("a", e.moveDir);
                b.sendWS("D", e.nDir);
                b.fastGear();
              }
              if (a > 300) {
                if (dc.getDist(l, e, 0, 2) > 90) {
                  let a = dc.getDirect(l, e, 0, 2);
                  b.place(3, a + 7.7);
                  b.place(3, a - 7.7);
                  b.place(3, a);
                  l = {
                    x: e.x2,
                    y: e.y2
                  };
                }
              }
            }
          }
          if (i.length > 0 && c("mode").value == "zync") {
            let a = i.filter(a => a.active && a.isItem && dc.getDist(a, ja, 0, 2) <= ec.weapons[e.weaponIndex].range + a.scale);
            if (!a.length) {
              if (q == "no") {
                b.sendWS("D", dc.getDirect(ja, e, 0, 2));
              }
              b.sendWS("a", o(ja, e) + Math.PI);
            }
            if (a.length) {
              let c = dc.getDist(a[0], e, 0, 2);
              let d = dc.getDirect(a[0], e, 0, 2);
              j = i.filter(b => b.active && (ra(a, b.sid) ? true : !b.trap || ja.sid != b.owner.sid && !ja.findAllianceBySid(b.owner.sid)) && b.isItem && dc.getDist(b, e, 0, 2) <= ec.weapons[e.weaponIndex].range + b.scale).sort(function (a, b) {
                return dc.getDist(a, e, 0, 2) - dc.getDist(b, e, 0, 2);
              })[0];
              if (j) {
                let d = dc.getDist(a[0], j, 0, 0);
                if (c - d > 0) {
                  if (ra(a, j.sid) ? true : j.dmg || j.trap) {
                    if (e.moveDir != undefined) {
                      e.moveDir = undefined;
                      b.sendWS("a", e.moveDir);
                      b.sendWS("D", e.nDir);
                    }
                  } else {
                    b.sendWS("D", e.nDir);
                  }
                  if (e.nDir != dc.getDirect(j, e, 0, 2)) {
                    e.nDir = dc.getDirect(j, e, 0, 2);
                    b.sendWS("D", e.nDir);
                  }
                  if (m == 0) {
                    b.sendWS("K", 1);
                    m = 1;
                  }
                  b.buye(40, 0);
                  b.fastGear();
                } else {
                  if (q == "no") {
                    b.sendWS("D", dc.getDirect(j, e, 0, 2));
                  }
                  if (p(ja, e) <= 110) {
                    b.sendWS("a", undefined);
                  } else {
                    b.sendWS("a", o(ja, e) + Math.PI);
                  }
                }
              } else if (a.length) {
                if (q == "no") {
                  b.sendWS("D", dc.getDirect(a[0], e, 0, 2));
                }
                if (p(ja, e) <= 110) {
                  b.sendWS("a", undefined);
                } else {
                  b.sendWS("a", o(ja, e) + Math.PI);
                }
              } else {
                if (q == "no") {
                  b.sendWS("D", dc.getDirect(ja, e, 0, 2));
                }
                if (p(ja, e) <= 110) {
                  b.sendWS("a", undefined);
                } else {
                  b.sendWS("a", o(ja, e) + Math.PI);
                }
              }
            }
          }
        }
      }
    }
    if (h == "H") {
      let a = d[0];
      for (let b = 0; b < a.length;) {
        n.add(a[b], a[b + 1], a[b + 2], a[b + 3], a[b + 4], a[b + 5], ec.list[a[b + 6]], true, a[b + 7] >= 0 ? {
          sid: a[b + 7]
        } : null);
        b += 8;
      }
    }
    if (h == "N") {
      let a = d[0];
      let b = d[1];
      if (e) {
        e[a] = b;
      }
    }
    if (h == "O") {
      if (d[0] == e.sid) {
        e.oldHealth = e.health;
        e.health = d[1];
        e.judgeShame();
        if (e.oldHealth > e.health) {
          if (e.shameCount < 5) {
            for (let a = 0; a < 2; a++) {
              b.place(0, e.nDir);
            }
          } else {
            setTimeout(() => {
              for (let a = 0; a < 2; a++) {
                b.place(0, e.nDir);
              }
            }, 95);
          }
        }
      }
    }
    if (h == "Q") {
      let a = d[0];
      n.disableBySid(a);
    }
    if (h == "R") {
      let a = d[0];
      if (e.alive) {
        n.removeAllItems(a);
      }
    }
    if (h == "S") {
      let a = d[0];
      let b = d[1];
      if (e) {
        e.itemCounts[a] = b;
      }
    }
    if (h == "U") {
      if (d[0] > 0) {
        if (c("setup").value == "dm") {
          if (e.upgraded == 0) {
            b.sendUpgrade(7);
          } else if (e.upgraded == 1) {
            b.sendUpgrade(17);
          } else if (e.upgraded == 2) {
            b.sendUpgrade(31);
          } else if (e.upgraded == 3) {
            b.sendUpgrade(23);
          } else if (e.upgraded == 4) {
            b.sendUpgrade(9);
          } else if (e.upgraded == 5) {
            b.sendUpgrade(34);
          } else if (e.upgraded == 6) {
            b.sendUpgrade(12);
          } else if (e.upgraded == 7) {
            b.sendUpgrade(15);
          }
        } else if (c("setup").value == "dr") {
          if (e.upgraded == 0) {
            b.sendUpgrade(7);
          } else if (e.upgraded == 1) {
            b.sendUpgrade(17);
          } else if (e.upgraded == 2) {
            b.sendUpgrade(31);
          } else if (e.upgraded == 3) {
            b.sendUpgrade(23);
          } else if (e.upgraded == 4) {
            b.sendUpgrade(9);
          } else if (e.upgraded == 5) {
            b.sendUpgrade(34);
          } else if (e.upgraded == 6) {
            b.sendUpgrade(12);
          } else if (e.upgraded == 7) {
            b.sendUpgrade(13);
          }
        } else if (c("setup").value == "kh") {
          if (e.upgraded == 0) {
            b.sendUpgrade(3);
          } else if (e.upgraded == 1) {
            b.sendUpgrade(17);
          } else if (e.upgraded == 2) {
            b.sendUpgrade(31);
          } else if (e.upgraded == 3) {
            b.sendUpgrade(27);
          } else if (e.upgraded == 4) {
            b.sendUpgrade(10);
          } else if (e.upgraded == 5) {
            b.sendUpgrade(34);
          } else if (e.upgraded == 6) {
            b.sendUpgrade(4);
          } else if (e.upgraded == 7) {
            b.sendUpgrade(25);
          }
        } else if (c("setup").value == "zd") {
          if (e.upgraded == 0) {
            b.sendUpgrade(3);
          } else if (e.upgraded == 1) {
            b.sendUpgrade(17);
          } else if (e.upgraded == 2) {
            b.sendUpgrade(31);
          } else if (e.upgraded == 3) {
            b.sendUpgrade(27);
          } else if (e.upgraded == 4) {
            b.sendUpgrade(9);
          } else if (e.upgraded == 5) {
            b.sendUpgrade(34);
          } else if (e.upgraded == 6) {
            b.sendUpgrade(12);
          } else if (e.upgraded == 7) {
            b.sendUpgrade(15);
          }
        }
        e.upgraded++;
      }
    }
    if (h == "V") {
      let a = d[0];
      let b = d[1];
      if (a) {
        if (b) {
          e.weapons = a;
        } else {
          e.items = a;
        }
      }
    }
    if (h == "5") {
      let a = d[0];
      let b = d[1];
      let c = d[2];
      if (c) {
        if (!a) {
          e.tails[b] = 1;
        } else {
          e.latestTail = b;
        }
      } else if (!a) {
        e.skins[b] = 1;
      } else {
        e.latestSkin = b;
      }
    }
    if (h == "6") {
      let a = d[0];
      let c = d[1] + "";
      if (a == ja.sid && c.includes("syncon")) {
        b.zync(e.near);
      }
    }
  };
  b.onclose = function () {
    e.inGame = false;
    k.inGame = false;
  };
}
function Wd(a, b, c, d, e) {
  let f = a + c * Math.cos(d);
  let g = b + c * Math.sin(d);
  let h = c * 0.4;
  e.moveTo(a, b);
  e.beginPath();
  e.quadraticCurveTo((a + f) / 2 + h * Math.cos(d + Math.PI / 2), (b + g) / 2 + h * Math.sin(d + Math.PI / 2), f, g);
  e.quadraticCurveTo((a + f) / 2 - h * Math.cos(d + Math.PI / 2), (b + g) / 2 - h * Math.sin(d + Math.PI / 2), a, b);
  e.closePath();
  e.fill();
  e.stroke();
}
function Xd(a, b, c, d, e, f) {
  d = d || Ba;
  d.beginPath();
  d.arc(a, b, c, 0, Math.PI * 2);
  if (!f) {
    d.fill();
  }
  if (!e) {
    d.stroke();
  }
}
function Yd(a, b, c, d, e, f) {
  d = d || Ba;
  d.beginPath();
  d.arc(a, b, c, 0, Math.PI * 2);
  if (!f) {
    d.fill();
  }
  if (!e) {
    d.stroke();
  }
}
function Zd(a, b, c, d) {
  let e = Math.PI / 2 * 3;
  let f;
  let g;
  let h = Math.PI / b;
  a.beginPath();
  a.moveTo(0, -c);
  for (let i = 0; i < b; i++) {
    f = Math.cos(e) * c;
    g = Math.sin(e) * c;
    a.lineTo(f, g);
    e += h;
    f = Math.cos(e) * d;
    g = Math.sin(e) * d;
    a.lineTo(f, g);
    e += h;
  }
  a.lineTo(0, -c);
  a.closePath();
}
function $d(a, b, c, d) {
  let e = Math.PI / 2 * 3;
  let f;
  let g;
  let h = Math.PI / b;
  a.beginPath();
  a.moveTo(0, -c);
  for (let i = 0; i < b; i++) {
    f = Math.cos(e) * c;
    g = Math.sin(e) * c;
    a.lineTo(f, g);
    e += h;
    f = Math.cos(e) * d;
    g = Math.sin(e) * d;
    a.lineTo(f, g);
    e += h;
  }
  a.lineTo(0, -c);
  a.closePath();
}
function _d(a, b, c, d, e, f, g) {
  if (!g) {
    e.fillRect(a - c / 2, b - d / 2, c, d);
  }
  if (!f) {
    e.strokeRect(a - c / 2, b - d / 2, c, d);
  }
}
function ae(a, b, c, d, e, f, g) {
  if (!g) {
    e.fillRect(a - c / 2, b - d / 2, c, d);
  }
  if (!f) {
    e.strokeRect(a - c / 2, b - d / 2, c, d);
  }
}
function be(a, b, c, d, e, f, g, h) {
  f.save();
  f.translate(a, b);
  e = Math.ceil(e / 2);
  for (let i = 0; i < e; i++) {
    _d(0, 0, c * 2, d, f, g, h);
    f.rotate(Math.PI / e);
  }
  f.restore();
}
function ce(a, b, c, d) {
  let e = Math.PI / 2 * 3;
  let f;
  let g;
  let h = Math.PI / b;
  let i;
  a.beginPath();
  a.moveTo(0, -d);
  for (let f = 0; f < b; f++) {
    i = dc.randInt(c + 0.9, c * 1.2);
    a.quadraticCurveTo(Math.cos(e + h) * i, Math.sin(e + h) * i, Math.cos(e + h * 2) * d, Math.sin(e + h * 2) * d);
    e += h * 2;
  }
  a.lineTo(0, -d);
  a.closePath();
}
function de(a, b) {
  b = b || Ba;
  let c = a * (Math.sqrt(3) / 2);
  b.beginPath();
  b.moveTo(0, -c / 2);
  b.lineTo(-a / 2, c / 2);
  b.lineTo(a / 2, c / 2);
  b.lineTo(0, -c / 2);
  b.fill();
  b.closePath();
}
function ee() {}
const fe = 1;
function ge(a, b) {
  Ba.fillStyle = "#91b2db";
  const c = Date.now();
  ha.filter(a => a.active).forEach(d => {
    if (!d.startTime) {
      d.startTime = c;
      d.angle = 0;
      d.radius = 0.1;
    }
    const e = c - d.startTime;
    const f = 1;
    d.alpha = Math.max(0, f - e / 3000);
    d.animate(Va);
    Ba.globalAlpha = d.alpha;
    Ba.strokeStyle = eb;
    Ba.save();
    Ba.translate(d.x - a, d.y - b);
    d.radius -= 0.001;
    d.angle += 0.0174533;
    const g = 1;
    const h = d.radius * Math.cos(d.angle);
    const i = d.radius * Math.sin(d.angle);
    d.x += h * g;
    d.y += i * g;
    Ba.rotate(d.angle);
    ie(d, Ba);
    Ba.restore();
    Ba.fillStyle = "#91b2db";
    if (e >= 3000) {
      d.active = false;
      d.startTime = null;
    }
  });
}
function he(a, b, c) {
  Ba.globalAlpha = 1;
  Ba.fillStyle = "#91b2db";
  for (var d = 0; d < ba.length; ++d) {
    la = ba[d];
    if (la.zIndex == c) {
      la.animate(Va);
      if (la.visible) {
        la.skinRot += Va * 0.002;
        $a = la == ja ? Pc() : la.dir || 0;
        Ba.save();
        Ba.translate(la.x - a, la.y - b);
        Ba.rotate($a + la.dirPlus);
        je(la, Ba);
        Ba.restore();
      }
    }
  }
}
function ie(a, b) {
  b = b || Ba;
  b.lineWidth = gb;
  b.lineJoin = "miter";
  let c = Math.PI / 4 * (ec.weapons[a.weaponIndex].armS || 1);
  let d = a.buildIndex < 0 ? ec.weapons[a.weaponIndex].hndS || 1 : 1;
  let e = a.buildIndex < 0 ? ec.weapons[a.weaponIndex].hndD || 1 : 1;
  De(13, b, a);
  if (a.buildIndex < 0 && !ec.weapons[a.weaponIndex].aboveHand) {
    Fe(ec.weapons[a.weaponIndex], f.weaponVariants[a.weaponVariant || 0].src || "", a.scale, 0, b);
    if (ec.weapons[a.weaponIndex].projectile != undefined && !ec.weapons[a.weaponIndex].hideProjectile) {
      Ie(a.scale, 0, ec.projectiles[ec.weapons[a.weaponIndex].projectile], Ba);
    }
  }
  b.fillStyle = "#ececec";
  Xd(a.scale * Math.cos(c), a.scale * Math.sin(c), 14);
  Xd(a.scale * e * Math.cos(-c * d), a.scale * e * Math.sin(-c * d), 14);
  if (a.buildIndex < 0 && ec.weapons[a.weaponIndex].aboveHand) {
    Fe(ec.weapons[a.weaponIndex], f.weaponVariants[a.weaponVariant || 0].src || "", a.scale, 0, b);
    if (ec.weapons[a.weaponIndex].projectile != undefined && !ec.weapons[a.weaponIndex].hideProjectile) {
      Ie(a.scale, 0, ec.projectiles[ec.weapons[a.weaponIndex].projectile], Ba);
    }
  }
  if (a.buildIndex >= 0) {
    var g = Pe(ec.list[a.buildIndex]);
    b.drawImage(g, a.scale - ec.list[a.buildIndex].holdOffset, -g.width / 2);
  }
  Xd(0, 0, a.scale, b);
  me(48, b, null, a);
}
function je(a, b) {
  b = b || Ba;
  b.lineWidth = gb;
  b.lineJoin = "miter";
  let c = Math.PI / 4 * (ec.weapons[a.weaponIndex].armS || 1);
  let d = a.buildIndex < 0 ? ec.weapons[a.weaponIndex].hndS || 1 : 1;
  let e = a.buildIndex < 0 ? ec.weapons[a.weaponIndex].hndD || 1 : 1;
  let g = a == ja && a.weapons[0] == 3 && a.weapons[1] == 15;
  if (a.tailIndex > 0) {
    we(a.tailIndex, b, a);
  }
  if (a.buildIndex < 0 && !ec.weapons[a.weaponIndex].aboveHand) {
    Fe(ec.weapons[g ? 4 : a.weaponIndex], f.weaponVariants[a.weaponVariant].src, a.scale, 0, b);
    if (ec.weapons[a.weaponIndex].projectile != undefined && !ec.weapons[a.weaponIndex].hideProjectile) {
      Ie(a.scale, 0, ec.projectiles[ec.weapons[a.weaponIndex].projectile], Ba);
    }
  }
  b.fillStyle = f.skinColors[a.skinColor];
  Xd(a.scale * Math.cos(c), a.scale * Math.sin(c), 14);
  Xd(a.scale * e * Math.cos(-c * d), a.scale * e * Math.sin(-c * d), 14);
  if (a.buildIndex < 0 && ec.weapons[a.weaponIndex].aboveHand) {
    Fe(ec.weapons[a.weaponIndex], f.weaponVariants[a.weaponVariant].src, a.scale, 0, b);
    if (ec.weapons[a.weaponIndex].projectile != undefined && !ec.weapons[a.weaponIndex].hideProjectile) {
      Ie(a.scale, 0, ec.projectiles[ec.weapons[a.weaponIndex].projectile], Ba);
    }
  }
  if (a.buildIndex >= 0) {
    var h = Pe(ec.list[a.buildIndex]);
    b.drawImage(h, a.scale - ec.list[a.buildIndex].holdOffset, -h.width / 2);
  }
  Xd(0, 0, a.scale, b);
  if (a.skinIndex > 0) {
    b.rotate(Math.PI / 2);
    ne(a.skinIndex, b, null, a);
  }
}
var ke = {};
var le = {};
function me(a, b, c, d) {
  se = ke[a];
  if (!se) {
    var e = new Image();
    e.onload = function () {
      this.isLoaded = true;
      this.onload = null;
    };
    e.src = "https://moomoo.io/img/hats/hat_" + a + ".png";
    ke[a] = e;
    se = e;
  }
  var f = c || le[a];
  if (!f) {
    for (var g = 0; g < hc.length; ++g) {
      if (hc[g].id == a) {
        f = hc[g];
        break;
      }
    }
    le[a] = f;
  }
  if (se.isLoaded) {
    b.drawImage(se, -f.scale / 2, -f.scale / 2, f.scale, f.scale);
  }
  if (!c && f.topSprite) {
    b.save();
    b.rotate(d.skinRot);
    me(a + "_top", b, f, d);
    b.restore();
  }
}
function ne(a, b, c, d) {
  if (!(se = qe[a + (ze ? "lol" : 0)])) {
    var e = new Image();
    e.onload = function () {
      this.isLoaded = true;
      this.onload = null;
    };
    e.src = pe(a, "hat", a);
    qe[a + (ze ? "lol" : 0)] = e;
    se = e;
  }
  var f = c || re[a];
  if (!f) {
    for (var g = 0; g < hc.length; ++g) {
      if (hc[g].id == a) {
        f = hc[g];
        break;
      }
    }
    re[a] = f;
  }
  if (se.isLoaded) {
    b.drawImage(se, -f.scale / 2, -f.scale / 2, f.scale, f.scale);
  }
  if (!c && f.topSprite) {
    b.save();
    b.rotate(d.skinRot);
    te(a + "_top", b, f, d);
    b.restore();
  }
}
var oe = {
  7: "https://i.imgur.com/vAOzlyY.png",
  15: "https://i.imgur.com/YRQ8Ybq.png",
  40: "https://i.imgur.com/Xzmg27N.png",
  26: "https://i.imgur.com/I0xGtyZ.png",
  55: "https://i.imgur.com/uYgDtcZ.png",
  20: "https://i.imgur.com/f5uhWCk.png"
};
function pe(a, b, c) {
  if (true) {
    if (oe[a] && b == "hat") {
      return oe[a];
    } else if (b == "acc") {
      return ".././img/accessories/access_" + a + ".png";
    } else if (b == "hat") {
      return ".././img/hats/hat_" + a + ".png";
    } else {
      return ".././img/weapons/" + a + ".png";
    }
  } else if (b == "acc") {
    return ".././img/accessories/access_" + a + ".png";
  } else if (b == "hat") {
    return ".././img/hats/hat_" + a + ".png";
  } else {
    return ".././img/weapons/" + a + ".png";
  }
}
let qe = {};
let re = {};
let se;
function te(a, b, c, d) {
  se = qe[a];
  if (!se) {
    let b = new Image();
    b.onload = function () {
      this.isLoaded = true;
      this.onload = null;
    };
    b.src = "https://moomoo.io/img/hats/hat_" + a + ".png";
    qe[a] = b;
    se = b;
  }
  let e = c || re[a];
  if (!e) {
    for (let b = 0; b < hc.length; ++b) {
      if (hc[b].id == a) {
        e = hc[b];
        break;
      }
    }
    re[a] = e;
  }
  if (se.isLoaded) {
    b.drawImage(se, -e.scale / 2, -e.scale / 2, e.scale, e.scale);
  }
  if (!c && e.topSprite) {
    b.save();
    b.rotate(d.skinRot);
    te(a + "_top", b, e, d);
    b.restore();
  }
}
var ue = {
  21: "https://i.imgur.com/4ddZert.png",
  19: "https://i.imgur.com/sULkUZT.png"
};
function ve(a, b, c) {
  if (true) {
    if (ue[a] && b == "acc") {
      return ue[a];
    } else if (b == "acc") {
      return ".././img/accessories/access_" + a + ".png";
    } else if (b == "hat") {
      return ".././img/hats/hat_" + a + ".png";
    } else {
      return ".././img/weapons/" + a + ".png";
    }
  } else if (b == "acc") {
    return ".././img/accessories/access_" + a + ".png";
  } else if (b == "hat") {
    return ".././img/hats/hat_" + a + ".png";
  } else {
    return ".././img/weapons/" + a + ".png";
  }
}
function we(a, b, c) {
  if (!(se = xe[a + (ze ? "lol" : 0)])) {
    var d = new Image();
    d.onload = function () {
      this.isLoaded = true;
      this.onload = null;
    };
    d.src = ve(a, "acc");
    xe[a + (ze ? "lol" : 0)] = d;
    se = d;
  }
  var e = ye[a];
  if (!e) {
    for (var f = 0; f < ic.length; ++f) {
      if (ic[f].id == a) {
        e = ic[f];
        break;
      }
    }
    ye[a] = e;
  }
  if (se.isLoaded) {
    b.save();
    b.translate(-20 - (e.xOff || 0), 0);
    if (e.spin) {
      b.rotate(c.skinRot);
    }
    b.drawImage(se, -(e.scale / 2), -(e.scale / 2), e.scale, e.scale);
    b.restore();
  }
}
let xe = {};
let ye = {};
var ze = true;
function Ae(a, b, c) {
  se = xe[a];
  if (!se) {
    let b = new Image();
    b.onload = function () {
      this.isLoaded = true;
      this.onload = null;
    };
    b.src = "https://moomoo.io/img/accessories/access_" + a + ".png";
    xe[a] = b;
    se = b;
  }
  let d = ye[a];
  if (!d) {
    for (let b = 0; b < ic.length; ++b) {
      if (ic[b].id == a) {
        d = ic[b];
        break;
      }
    }
    ye[a] = d;
  }
  if (se.isLoaded) {
    b.save();
    b.translate(-20 - (d.xOff || 0), 0);
    if (d.spin) {
      b.rotate(c.skinRot);
    }
    b.drawImage(se, -(d.scale / 2), -(d.scale / 2), d.scale, d.scale);
    b.restore();
  }
}
var Be = {};
var Ce = {};
function De(a, b, c) {
  se = Be[a];
  if (!se) {
    var d = new Image();
    d.onload = function () {
      this.isLoaded = true;
      this.onload = null;
    };
    d.src = "https://moomoo.io/img/accessories/access_" + a + ".png";
    Be[a] = d;
    se = d;
  }
  var e = Ce[a];
  if (!e) {
    for (var f = 0; f < ic.length; ++f) {
      if (ic[f].id == a) {
        e = ic[f];
        break;
      }
    }
    Ce[a] = e;
  }
  if (se.isLoaded) {
    b.save();
    b.translate(-20 - (e.xOff || 0), 0);
    if (e.spin) {
      b.rotate(c.skinRot);
    }
    b.drawImage(se, -(e.scale / 2), -(e.scale / 2), e.scale, e.scale);
    b.restore();
  }
}
let Ee = {};
function Fe(a, b, c, d, e) {
  let f = a.src + (b || "");
  let g = Ee[f];
  if (!g) {
    g = new Image();
    g.onload = function () {
      this.isLoaded = true;
    };
    g.src = "https://moomoo.io/img/weapons/" + f + ".png";
    Ee[f] = g;
  }
  if (g.isLoaded) {
    e.drawImage(g, c + a.xOff - a.length / 2, d + a.yOff - a.width / 2, a.length, a.width);
  }
}
function Ge(a, b, c) {
  for (let d = 0; d < ga.length; d++) {
    la = ga[d];
    if (la.active && la.layer == a && la.inWindow) {
      la.update(Va);
      if (la.active && Ue(la.x - b, la.y - c, la.scale)) {
        Ba.save();
        Ba.translate(la.x - b, la.y - c);
        Ba.rotate(la.dir);
        Ie(0, 0, la, Ba, 1);
        Ba.restore();
      }
    }
  }
  ;
}
let He = {};
function Ie(a, b, c, d, e) {
  if (c.src) {
    let e = ec.projectiles[c.indx].src;
    let f = He[e];
    if (!f) {
      f = new Image();
      f.onload = function () {
        this.isLoaded = true;
      };
      f.src = "https://moomoo.io/img/weapons/" + e + ".png";
      He[e] = f;
    }
    if (f.isLoaded) {
      d.drawImage(f, a - c.scale / 2, b - c.scale / 2, c.scale, c.scale);
    }
  } else if (c.indx == 1) {
    d.fillStyle = "#939393";
    Xd(a, b, c.scale, d);
  }
}
let Je = {};
function Ke(a, b) {
  let c = a.index;
  let d = Je[c];
  if (!d) {
    let b = new Image();
    b.onload = function () {
      this.isLoaded = true;
      this.onload = null;
    };
    b.src = "https://moomoo.io/img/animals/" + a.src + ".png";
    d = b;
    Je[c] = d;
  }
  if (d.isLoaded) {
    let c = a.scale * 1.2 * (a.spriteMlt || 1);
    b.drawImage(d, -c, -c, c * 2, c * 2);
  }
}
function Le(a, b, c, d) {
  let e = f.riverWidth + d;
  let g = f.mapScale / 2 - b - e / 2;
  if (g < Ta && g + e > 0) {
    c.fillRect(0, g, Sa, e);
  }
}
let Me = {};
function Ne(a) {
  let b = a.y >= f.mapScale - f.snowBiomeTop ? 2 : a.y <= f.snowBiomeTop ? 1 : 0;
  let c = a.type + "_" + a.scale + "_" + b;
  let d = Me[c];
  if (!d) {
    let e = 6;
    let f = document.createElement("canvas");
    f.width = f.height = a.scale * 2.1 + gb;
    let g = f.getContext("2d");
    g.translate(f.width / 2, f.height / 2);
    g.rotate(dc.randFloat(0, Math.PI));
    g.strokeStyle = eb;
    g.lineWidth = gb;
    if (a.type == 0) {
      let c;
      let d = 8;
      g.globalAlpha = ef(a, ja) <= 250 ? 0.6 : 1;
      for (let a = 0; a < 2; ++a) {
        c = la.scale * (!a ? 1 : 0.5);
        Zd(g, d, c, c * 0.7);
        g.fillStyle = !b ? !a ? "#9ebf57" : "#b4db62" : !a ? "#e3f1f4" : "#fff";
        g.fill();
        if (!a) {
          g.stroke();
          g.shadowBlur = null;
          g.shadowColor = null;
          g.globalAlpha = 1;
        }
      }
    } else if (a.type == 1) {
      if (b == 2) {
        g.fillStyle = "#606060";
        Zd(g, 6, a.scale * 0.3, a.scale * 0.71);
        g.fill();
        g.stroke();
        g.fillStyle = "#89a54c";
        Xd(0, 0, a.scale * 0.55, g);
        g.fillStyle = "#a5c65b";
        Xd(0, 0, a.scale * 0.3, g, true);
      } else {
        ce(g, 6, la.scale, la.scale * 0.7);
        g.fillStyle = b ? "#e3f1f4" : "#89a54c";
        g.fill();
        g.stroke();
        g.fillStyle = b ? "#6a64af" : "#c15555";
        let a;
        let c = 4;
        let d = Math.PI * 2 / c;
        for (let b = 0; b < c; ++b) {
          a = dc.randInt(la.scale / 3.5, la.scale / 2.3);
          Xd(a * Math.cos(d * b), a * Math.sin(d * b), dc.randInt(10, 12), g);
        }
      }
    } else if (a.type == 2 || a.type == 3) {
      g.fillStyle = a.type == 2 ? b == 2 ? "#938d77" : "#939393" : "#e0c655";
      Zd(g, 3, a.scale, a.scale);
      g.fill();
      g.stroke();
      g.shadowBlur = null;
      g.shadowColor = null;
      g.fillStyle = a.type == 2 ? b == 2 ? "#b2ab90" : "#bcbcbc" : "#ebdca3";
      Zd(g, 3, a.scale * 0.55, a.scale * 0.65);
      g.fill();
    }
    d = f;
    Me[c] = d;
  }
  return d;
}
let Oe = [];
function Pe(a, b) {
  let c = Oe[a.id];
  if (!c || b) {
    let d = !b ? 20 : 5;
    let e = document.createElement("canvas");
    let f = !b && a.name == "windmill" ? ec.list[4].scale : a.scale;
    e.width = e.height = f * 2.5 + gb + (ec.list[a.id].spritePadding || 0) + d;
    let g = e.getContext("2d");
    g.translate(e.width / 2, e.height / 2);
    g.rotate(b ? 0 : Math.PI / 2);
    g.strokeStyle = eb;
    g.lineWidth = gb * (b ? e.width / 81 : 1);
    if (!b) {
      g.shadowBlur = 8;
      g.shadowColor = "rgba(0, 0, 0, 0.2)";
    }
    if (a.name == "apple") {
      g.fillStyle = "#c15555";
      Xd(0, 0, a.scale, g);
      g.fillStyle = "#89a54c";
      let b = -(Math.PI / 2);
      Wd(a.scale * Math.cos(b), a.scale * Math.sin(b), 25, b + Math.PI / 2, g);
    } else if (a.name == "cookie") {
      g.fillStyle = "#cca861";
      Xd(0, 0, a.scale, g);
      g.fillStyle = "#937c4b";
      let b = 4;
      let c = Math.PI * 2 / b;
      let d;
      for (let e = 0; e < b; ++e) {
        d = dc.randInt(a.scale / 2.5, a.scale / 1.7);
        Xd(d * Math.cos(c * e), d * Math.sin(c * e), dc.randInt(4, 5), g, true);
      }
    } else if (a.name == "cheese") {
      g.fillStyle = "#f4f3ac";
      Xd(0, 0, a.scale, g);
      g.fillStyle = "#c3c28b";
      let b = 4;
      let c = Math.PI * 2 / b;
      let d;
      for (let e = 0; e < b; ++e) {
        d = dc.randInt(a.scale / 2.5, a.scale / 1.7);
        Xd(d * Math.cos(c * e), d * Math.sin(c * e), dc.randInt(4, 5), g, true);
      }
    } else if (a.name == "wood wall" || a.name == "stone wall" || a.name == "castle wall") {
      g.fillStyle = a.name == "castle wall" ? "#83898e" : a.name == "wood wall" ? "#a5974c" : "#939393";
      let b = a.name == "castle wall" ? 4 : 3;
      Zd(g, b, a.scale * 1.1, a.scale * 1.1);
      g.fill();
      g.stroke();
      g.fillStyle = a.name == "castle wall" ? "#9da4aa" : a.name == "wood wall" ? "#c9b758" : "#bcbcbc";
      Zd(g, b, a.scale * 0.65, a.scale * 0.65);
      g.fill();
    } else if (a.name == "spikes" || a.name == "greater spikes" || a.name == "poison spikes" || a.name == "spinning spikes") {
      g.fillStyle = a.name == "poison spikes" ? "#7b935d" : "#939393";
      let b = a.scale * 0.6;
      Zd(g, a.name == "spikes" ? 5 : 6, a.scale, b);
      g.fill();
      g.stroke();
      g.fillStyle = "#a5974c";
      Xd(0, 0, b, g);
      g.fillStyle = "#c9b758";
      Xd(0, 0, b / 2, g, true);
    } else if (a.name == "windmill" || a.name == "faster windmill" || a.name == "power mill") {
      g.fillStyle = "#a5974c";
      Xd(0, 0, f, g);
      g.fillStyle = "#c9b758";
      be(0, 0, f * 1.5, 29, 4, g);
      g.fillStyle = "#a5974c";
      Xd(0, 0, f * 0.5, g);
    } else if (a.name == "mine") {
      g.fillStyle = "#939393";
      Zd(g, 3, a.scale, a.scale);
      g.fill();
      g.stroke();
      g.fillStyle = "#bcbcbc";
      Zd(g, 3, a.scale * 0.55, a.scale * 0.65);
      g.fill();
    } else if (a.name == "sapling") {
      for (let b = 0; b < 2; ++b) {
        let c = a.scale * (!b ? 1 : 0.5);
        Zd(g, 7, c, c * 0.7);
        g.fillStyle = !b ? "#9ebf57" : "#b4db62";
        g.fill();
        if (!b) {
          g.stroke();
        }
      }
    } else if (a.name == "pit trap") {
      g.fillStyle = "#a5974c";
      Zd(g, 3, a.scale * 1.1, a.scale * 1.1);
      g.fill();
      g.stroke();
      g.fillStyle = eb;
      Zd(g, 3, a.scale * 0.65, a.scale * 0.65);
      g.fill();
    } else if (a.name == "boost pad") {
      g.fillStyle = "#7e7f82";
      _d(0, 0, a.scale * 2, a.scale * 2, g);
      g.fill();
      g.stroke();
      g.fillStyle = "#dbd97d";
      de(a.scale * 1, g);
    } else if (a.name == "turret") {
      g.fillStyle = "#a5974c";
      Xd(0, 0, a.scale, g);
      g.fill();
      g.stroke();
      g.fillStyle = "#939393";
      let b = 50;
      _d(0, -b / 2, a.scale * 0.9, b, g);
      Xd(0, 0, a.scale * 0.6, g);
      g.fill();
      g.stroke();
    } else if (a.name == "platform") {
      g.fillStyle = "#cebd5f";
      let b = 4;
      let c = a.scale * 2;
      let d = c / b;
      let e = -(a.scale / 2);
      for (let f = 0; f < b; ++f) {
        _d(e - d / 2, 0, d, a.scale * 2, g);
        g.fill();
        g.stroke();
        e += c / b;
      }
    } else if (a.name == "healing pad") {
      g.fillStyle = "#7e7f82";
      _d(0, 0, a.scale * 2, a.scale * 2, g);
      g.fill();
      g.stroke();
      g.fillStyle = "#db6e6e";
      be(0, 0, a.scale * 0.65, 20, 4, g, true);
    } else if (a.name == "spawn pad") {
      g.fillStyle = "#7e7f82";
      _d(0, 0, a.scale * 2, a.scale * 2, g);
      g.fill();
      g.stroke();
      g.fillStyle = "#71aad6";
      Xd(0, 0, a.scale * 0.6, g);
    } else if (a.name == "blocker") {
      g.fillStyle = "#7e7f82";
      Xd(0, 0, a.scale, g);
      g.fill();
      g.stroke();
      g.rotate(Math.PI / 4);
      g.fillStyle = "#db6e6e";
      be(0, 0, a.scale * 0.65, 20, 4, g, true);
    } else if (a.name == "teleporter") {
      g.fillStyle = "#7e7f82";
      Xd(0, 0, a.scale, g);
      g.fill();
      g.stroke();
      g.rotate(Math.PI / 4);
      g.fillStyle = "#d76edb";
      Xd(0, 0, a.scale * 0.5, g, true);
    }
    c = e;
    if (!b) {
      Oe[a.id] = c;
    }
  }
  return c;
}
function Qe(a, b, c) {
  let d = Ba;
  let e = a.name == "windmill" ? ec.list[4].scale : a.scale;
  d.save();
  d.translate(b, c);
  d.rotate(a.dir);
  d.strokeStyle = eb;
  d.lineWidth = gb;
  if (a.name == "apple") {
    d.fillStyle = "#c15555";
    Xd(0, 0, a.scale, d);
    d.fillStyle = "#89a54c";
    let b = -(Math.PI / 2);
    Wd(a.scale * Math.cos(b), a.scale * Math.sin(b), 25, b + Math.PI / 2, d);
  } else if (a.name == "cookie") {
    d.fillStyle = "#cca861";
    Xd(0, 0, a.scale, d);
    d.fillStyle = "#937c4b";
    let b = 4;
    let c = Math.PI * 2 / b;
    let e;
    for (let f = 0; f < b; ++f) {
      e = dc.randInt(a.scale / 2.5, a.scale / 1.7);
      Xd(e * Math.cos(c * f), e * Math.sin(c * f), dc.randInt(4, 5), d, true);
    }
  } else if (a.name == "cheese") {
    d.fillStyle = "#f4f3ac";
    Xd(0, 0, a.scale, d);
    d.fillStyle = "#c3c28b";
    let b = 4;
    let c = Math.PI * 2 / b;
    let e;
    for (let f = 0; f < b; ++f) {
      e = dc.randInt(a.scale / 2.5, a.scale / 1.7);
      Xd(e * Math.cos(c * f), e * Math.sin(c * f), dc.randInt(4, 5), d, true);
    }
  } else if (a.name == "wood wall" || a.name == "stone wall" || a.name == "castle wall") {
    d.fillStyle = a.name == "castle wall" ? "#83898e" : a.name == "wood wall" ? "#a5974c" : "#939393";
    let b = a.name == "castle wall" ? 4 : 3;
    Zd(d, b, a.scale * 1.1, a.scale * 1.1);
    d.fill();
    d.stroke();
    d.fillStyle = a.name == "castle wall" ? "#9da4aa" : a.name == "wood wall" ? "#c9b758" : "#bcbcbc";
    Zd(d, b, a.scale * 0.65, a.scale * 0.65);
    d.fill();
  } else if (a.name == "spikes" || a.name == "greater spikes" || a.name == "poison spikes" || a.name == "spinning spikes") {
    d.fillStyle = a.name == "poison spikes" ? "#7b935d" : "#939393";
    let b = a.scale * 0.6;
    Zd(d, a.name == "spikes" ? 5 : 6, a.scale, b);
    d.fill();
    d.stroke();
    d.fillStyle = "#a5974c";
    Xd(0, 0, b, d);
    d.fillStyle = "#c9b758";
    Xd(0, 0, b / 2, d, true);
  } else if (a.name == "windmill" || a.name == "faster windmill" || a.name == "power mill") {
    d.fillStyle = "#a5974c";
    Xd(0, 0, e, d);
    d.fillStyle = "#c9b758";
    be(0, 0, e * 1.5, 29, 4, d);
    d.fillStyle = "#a5974c";
    Xd(0, 0, e * 0.5, d);
  } else if (a.name == "mine") {
    d.fillStyle = "#939393";
    Zd(d, 3, a.scale, a.scale);
    d.fill();
    d.stroke();
    d.fillStyle = "#bcbcbc";
    Zd(d, 3, a.scale * 0.55, a.scale * 0.65);
    d.fill();
  } else if (a.name == "sapling") {
    for (let b = 0; b < 2; ++b) {
      let c = a.scale * (!b ? 1 : 0.5);
      Zd(d, 7, c, c * 0.7);
      d.fillStyle = !b ? "#9ebf57" : "#b4db62";
      d.fill();
      if (!b) {
        d.stroke();
      }
    }
  } else if (a.name == "pit trap") {
    d.fillStyle = "#a5974c";
    Zd(d, 3, a.scale * 1.1, a.scale * 1.1);
    d.fill();
    d.stroke();
    d.fillStyle = eb;
    Zd(d, 3, a.scale * 0.65, a.scale * 0.65);
    d.fill();
  } else if (a.name == "boost pad") {
    d.fillStyle = "#7e7f82";
    _d(0, 0, a.scale * 2, a.scale * 2, d);
    d.fill();
    d.stroke();
    d.fillStyle = "#dbd97d";
    de(a.scale * 1, d);
  } else if (a.name == "turret") {
    d.fillStyle = "#a5974c";
    Xd(0, 0, a.scale, d);
    d.fill();
    d.stroke();
    d.fillStyle = "#939393";
    let b = 50;
    _d(0, -b / 2, a.scale * 0.9, b, d);
    Xd(0, 0, a.scale * 0.6, d);
    d.fill();
    d.stroke();
  } else if (a.name == "platform") {
    d.fillStyle = "#cebd5f";
    let b = 4;
    let c = a.scale * 2;
    let e = c / b;
    let f = -(a.scale / 2);
    for (let g = 0; g < b; ++g) {
      _d(f - e / 2, 0, e, a.scale * 2, d);
      d.fill();
      d.stroke();
      f += c / b;
    }
  } else if (a.name == "healing pad") {
    d.fillStyle = "#7e7f82";
    _d(0, 0, a.scale * 2, a.scale * 2, d);
    d.fill();
    d.stroke();
    d.fillStyle = "#db6e6e";
    be(0, 0, a.scale * 0.65, 20, 4, d, true);
  } else if (a.name == "spawn pad") {
    d.fillStyle = "#7e7f82";
    _d(0, 0, a.scale * 2, a.scale * 2, d);
    d.fill();
    d.stroke();
    d.fillStyle = "#71aad6";
    Xd(0, 0, a.scale * 0.6, d);
  } else if (a.name == "blocker") {
    d.fillStyle = "#7e7f82";
    Xd(0, 0, a.scale, d);
    d.fill();
    d.stroke();
    d.rotate(Math.PI / 4);
    d.fillStyle = "#db6e6e";
    be(0, 0, a.scale * 0.65, 20, 4, d, true);
  } else if (a.name == "teleporter") {
    d.fillStyle = "#7e7f82";
    Xd(0, 0, a.scale, d);
    d.fill();
    d.stroke();
    d.rotate(Math.PI / 4);
    d.fillStyle = "#d76edb";
    Xd(0, 0, a.scale * 0.5, d, true);
  }
  d.restore();
}
let Re = [];
function Se(a) {
  let b = Re[a.id];
  if (!b) {
    let c = document.createElement("canvas");
    c.width = c.height = a.scale * 2.5 + gb + (ec.list[a.id].spritePadding || 0) + 0;
    let d = c.getContext("2d");
    d.translate(c.width / 2, c.height / 2);
    d.rotate(Math.PI / 2);
    d.strokeStyle = eb;
    d.lineWidth = gb;
    if (a.name == "spikes" || a.name == "greater spikes" || a.name == "poison spikes" || a.name == "spinning spikes") {
      d.fillStyle = a.name == "poison spikes" ? "#7b935d" : "#939393";
      let b = a.scale * 0.6;
      Zd(d, a.name == "spikes" ? 5 : 6, a.scale, b);
      d.fill();
      d.stroke();
      d.fillStyle = "#a5974c";
      Xd(0, 0, b, d);
      d.fillStyle = "#cc5151";
      Xd(0, 0, b / 2, d, true);
    } else if (a.name == "pit trap") {
      d.fillStyle = "#a5974c";
      Zd(d, 3, a.scale * 1.1, a.scale * 1.1);
      d.fill();
      d.stroke();
      d.fillStyle = "#cc5151";
      Zd(d, 3, a.scale * 0.65, a.scale * 0.65);
      d.fill();
    }
    b = c;
    Re[a.id] = b;
  }
  return b;
}
function Te(a, b, c, d) {
  let e = {
    x: Qa / 2,
    y: Ra / 2
  };
  b.lineWidth = gb;
  Ba.globalAlpha = 0.2;
  b.strokeStyle = eb;
  b.save();
  b.translate(c, d);
  b.rotate(90 ** 10);
  if (a.name == "spikes" || a.name == "greater spikes" || a.name == "poison spikes" || a.name == "spinning spikes") {
    b.fillStyle = a.name == "poison spikes" ? "#7b935d" : "#939393";
    var f = a.scale;
    Zd(b, a.name == "spikes" ? 5 : 6, a.scale, f);
    b.fill();
    b.stroke();
    b.fillStyle = "#a5974c";
    Xd(0, 0, f, b);
    if (ja && a.owner && ja.sid != a.owner.sid && !la.findAllianceBySid(a.owner.sid)) {
      b.fillStyle = "#a34040";
    } else {
      b.fillStyle = "#c9b758";
    }
    Xd(0, 0, f / 2, b, true);
  } else if (a.name == "turret") {
    Xd(0, 0, a.scale, b);
    b.fill();
    b.stroke();
    b.fillStyle = "#939393";
    let c = 50;
    _d(0, -c / 2, a.scale * 0.9, c, b);
    Xd(0, 0, a.scale * 0.6, b);
    b.fill();
    b.stroke();
  } else if (a.name == "teleporter") {
    b.fillStyle = "#7e7f82";
    Xd(0, 0, a.scale, b);
    b.fill();
    b.stroke();
    b.rotate(Math.PI / 4);
    b.fillStyle = "#d76edb";
    Xd(0, 0, a.scale * 0.5, b, true);
  } else if (a.name == "platform") {
    b.fillStyle = "#cebd5f";
    let c = 4;
    let d = a.scale * 2;
    let e = d / c;
    let f = -(a.scale / 2);
    for (let g = 0; g < c; ++g) {
      _d(f - e / 2, 0, e, a.scale * 2, b);
      b.fill();
      b.stroke();
      f += d / c;
    }
  } else if (a.name == "healing pad") {
    b.fillStyle = "#7e7f82";
    _d(0, 0, a.scale * 2, a.scale * 2, b);
    b.fill();
    b.stroke();
    b.fillStyle = "#db6e6e";
    be(0, 0, a.scale * 0.65, 20, 4, b, true);
  } else if (a.name == "spawn pad") {
    b.fillStyle = "#7e7f82";
    _d(0, 0, a.scale * 2, a.scale * 2, b);
    b.fill();
    b.stroke();
    b.fillStyle = "#71aad6";
    Xd(0, 0, a.scale * 0.6, b);
  } else if (a.name == "blocker") {
    b.fillStyle = "#7e7f82";
    Xd(0, 0, a.scale, b);
    b.fill();
    b.stroke();
    b.rotate(Math.PI / 4);
    b.fillStyle = "#db6e6e";
    be(0, 0, a.scale * 0.65, 20, 4, b, true);
  } else if (a.name == "windmill" || a.name == "faster windmill" || a.name == "power mill") {
    b.fillStyle = "#a5974c";
    Xd(0, 0, a.scale, b);
    b.fillStyle = "#c9b758";
    be(0, 0, a.scale * 1.5, 29, 4, b);
    b.fillStyle = "#a5974c";
    Xd(0, 0, a.scale * 0.5, b);
  } else if (a.name == "pit trap") {
    b.fillStyle = "#a5974c";
    Zd(b, 3, a.scale * 1.1, a.scale * 1.1);
    b.fill();
    b.stroke();
    if (ja && a.owner && ja.sid != a.owner.sid && !la.findAllianceBySid(a.owner.sid)) {
      b.fillStyle = "#a34040";
    } else {
      b.fillStyle = eb;
    }
    Zd(b, 3, a.scale * 0.65, a.scale * 0.65);
    b.fill();
  }
  b.restore();
}
function Ue(a, b, c) {
  return a + c >= 0 && a - c <= Sa && b + c >= 0 && (b, c, Ta);
}
function Ve(a, b, c) {
  let d;
  let e;
  let g;
  fa.forEach(h => {
    la = h;
    if (la.active && fa.includes(h) && la.render) {
      e = la.x + la.xWiggle - b;
      g = la.y + la.yWiggle - c;
      if (a == 0) {
        la.update(Va);
      }
      Ba.globalAlpha = la.alpha;
      if (la.layer == a && Ue(e, g, la.scale + (la.blocker || 0))) {
        if (la.isItem) {
          if ((la.dmg || la.trap) && !la.isTeamObject(ja)) {
            d = Se(la);
          } else {
            d = Pe(la);
          }
          Ba.save();
          Ba.translate(e, g);
          Ba.rotate(la.dir);
          if (!la.active) {
            Ba.scale(la.visScale / la.scale, la.visScale / la.scale);
          }
          Ba.drawImage(d, -(d.width / 2), -(d.height / 2));
          if (la.blocker) {
            Ba.strokeStyle = "#db6e6e";
            Ba.globalAlpha = 0.3;
            Ba.lineWidth = 6;
            Xd(0, 0, la.blocker, Ba, false, true);
          }
          Ba.restore();
        } else {
          d = Ne(la);
          Ba.drawImage(d, e - d.width / 2, g - d.height / 2);
        }
      }
      if (a == 3 && !K) {
        if (la.health < la.maxHealth) {
          Ba.fillStyle = fb;
          Ba.roundRect(e - f.healthBarWidth / 2 - f.healthBarPad, g - f.healthBarPad, f.healthBarWidth + f.healthBarPad * 2, 17, 8);
          Ba.fill();
          Ba.fillStyle = la.isTeamObject(ja) ? "#8ecc51" : "#cc5151";
          Ba.roundRect(e - f.healthBarWidth / 2, g, f.healthBarWidth * (la.health / la.maxHealth), 17 - f.healthBarPad * 2, 7);
          Ba.fill();
        }
      }
    }
  });
  if (a == 0) {
    if (tb.length) {
      tb.forEach(a => {
        e = a.x - b;
        g = a.y - c;
        We(a, e, g);
      });
    }
  }
}
function We(a, b, c) {
  Te(a, Ba, b, c);
}
class Xe {
  constructor(a, b) {
    this.init = function (a, b) {
      this.scale = 0;
      this.x = a;
      this.y = b;
      this.active = true;
    };
    this.update = function (a, c) {
      if (this.active) {
        this.scale += c * 0.05;
        if (this.scale >= b) {
          this.active = false;
        } else {
          a.globalAlpha = 1 - Math.max(0, this.scale / b);
          a.beginPath();
          a.arc(this.x / f.mapScale * Ca.width, this.y / f.mapScale * Ca.width, this.scale, 0, Math.PI * 2);
          a.stroke();
        }
      }
    };
    this.color = a;
  }
}
function Ye(a, b) {
  uc = tc.find(a => !a.active);
  if (!uc) {
    uc = new Xe("#fff", f.mapPingScale);
    tc.push(uc);
  }
  uc.init(a, b);
}
function Ze() {
  sc.x = ja.x;
  sc.y = ja.y;
}
function $e(a) {
  if (ja && ja.alive) {
    Da.clearRect(0, 0, Ca.width, Ca.height);
    Da.lineWidth = 4;
    for (let b = 0; b < tc.length; ++b) {
      uc = tc[b];
      Da.strokeStyle = uc.color;
      uc.update(Da, a);
    }
    Da.globalAlpha = 1;
    Da.fillStyle = "#ff0000";
    if (vc.length) {
      Da.fillStyle = "#abcdef";
      Da.font = "34px Hammersmith One";
      Da.textBaseline = "middle";
      Da.textAlign = "center";
      for (let a = 0; a < vc.length;) {
        Da.fillText("!", vc[a].x / f.mapScale * Ca.width, vc[a].y / f.mapScale * Ca.height);
        a += 2;
      }
    }
    Da.globalAlpha = 1;
    Da.fillStyle = "#fff";
    Xd(ja.x / f.mapScale * Ca.width, ja.y / f.mapScale * Ca.height, 7, Da, true);
    Da.fillStyle = "rgba(255,255,255,0.35)";
    if (ja.team && rc) {
      for (let a = 0; a < rc.length;) {
        Xd(rc[a] / f.mapScale * Ca.width, rc[a + 1] / f.mapScale * Ca.height, 7, Da, true);
        a += 2;
      }
    }
    if (Pd.length) {
      Pd.forEach(a => {
        if (a.inGame) {
          Da.globalAlpha = 1;
          Da.strokeStyle = "#cc5151";
          Xd(a.x2 / f.mapScale * Ca.width, a.y2 / f.mapScale * Ca.height, 7, Da, false, true);
        }
      });
    }
    if (qc) {
      Da.fillStyle = "#fc5553";
      Da.font = "34px Hammersmith One";
      Da.textBaseline = "middle";
      Da.textAlign = "center";
      Da.fillText("x", qc.x / f.mapScale * Ca.width, qc.y / f.mapScale * Ca.height);
    }
    if (sc) {
      Da.fillStyle = "#fff";
      Da.font = "34px Hammersmith One";
      Da.textBaseline = "middle";
      Da.textAlign = "center";
      Da.fillText("x", sc.x / f.mapScale * Ca.width, sc.y / f.mapScale * Ca.height);
    }
  }
}
let _e = ["https://cdn.discordapp.com/attachments/1001384433078779927/1149285738412769300/newawwddd.png", "https://cdn.discordapp.com/attachments/1001384433078779927/1149285168780165170/100px-Crosshairs_Red.png"];
let af = {};
let bf = {};
let cf = ["crown", "skull"];
function df() {
  for (let a = 0; a < cf.length; ++a) {
    let b = new Image();
    b.onload = function () {
      this.isLoaded = true;
    };
    b.src = "./../img/icons/" + cf[a] + ".png";
    bf[cf[a]] = b;
  }
  for (let a = 0; a < _e.length; ++a) {
    let b = new Image();
    b.onload = function () {
      this.isLoaded = true;
    };
    b.src = _e[a];
    af[a] = b;
  }
}
df();
function ef(a, b) {
  try {
    return Math.hypot((b.y2 || b.y) - (a.y2 || a.y), (b.x2 || b.x) - (a.x2 || a.x));
  } catch (a) {
    return Infinity;
  }
}
function ff() {
  if (ea.length && lb) {
    ea.forEach(a => {
      if (dc.getDistance(a.x, a.y, ja.x, ja.y) <= 1200) {
        if (!fa.includes(a)) {
          fa.push(a);
          a.render = true;
        }
      } else if (fa.includes(a)) {
        if (dc.getDistance(a.x, a.y, ja.x, ja.y) >= 1200) {
          a.render = false;
          const b = fa.indexOf(a);
          if (b > -1) {
            fa.splice(b, 1);
          }
        }
      } else if (dc.getDistance(a.x, a.y, ja.x, ja.y) >= 1200) {
        a.render = false;
        const b = fa.indexOf(a);
        if (b > -1) {
          fa.splice(b, 1);
        }
      } else {
        a.render = false;
        const b = fa.indexOf(a);
        if (b > -1) {
          fa.splice(b, 1);
        }
      }
    });
  }
  Ba.beginPath();
  Ba.clearRect(0, 0, Aa.width, Aa.height);
  Ba.globalAlpha = 1;
  if (ja) {
    if (false) {
      Ya = ja.x;
      Za = ja.y;
    } else {
      let a = dc.getDistance(Ya, Za, ja.x, ja.y);
      let b = dc.getDirection(ja.x, ja.y, Ya, Za);
      let c = Math.min(a * 0.0045 * Va, a);
      if (a > 0.05) {
        Ya += c * Math.cos(b);
        Za += c * Math.sin(b);
      } else {
        Ya = ja.x;
        Za = ja.y;
      }
    }
  } else {
    Ya = f.mapScale / 2 + f.riverWidth;
    Za = f.mapScale / 2;
  }
  let a = Wa - 1000 / f.serverUpdateRate;
  let b;
  for (let c = 0; c < ba.length + aa.length; ++c) {
    la = ba[c] || aa[c - ba.length];
    if (la && la.visible) {
      if (la.forcePos) {
        la.x = la.x2;
        la.y = la.y2;
        la.dir = la.d2;
      } else {
        let c = la.t2 - la.t1;
        let d = a - la.t1;
        let e = d / c;
        let g = 170;
        la.dt += Va;
        let h = Math.min(1.7, la.dt / g);
        b = la.x2 - la.x1;
        la.x = la.x1 + b * h;
        b = la.y2 - la.y1;
        la.y = la.y1 + b * h;
        if (f.anotherVisual) {
          la.dir = Math.lerpAngle(la.d2, la.d1, Math.min(1.2, e));
        } else {
          la.dir = Math.lerpAngle(la.d2, la.d1, Math.min(1.2, e));
        }
      }
    }
  }
  let d = Ya - Sa / 2;
  let e = Za - Ta / 2;
  if (f.snowBiomeTop - e <= 0 && f.mapScale - f.snowBiomeTop - e >= Ta) {
    Ba.fillStyle = "#b6db66";
    Ba.fillRect(0, 0, Sa, Ta);
  } else if (f.mapScale - f.snowBiomeTop - e <= 0) {
    Ba.fillStyle = "#dbc666";
    Ba.fillRect(0, 0, Sa, Ta);
  } else if (f.snowBiomeTop - e >= Ta) {
    Ba.fillStyle = "#fff";
    Ba.fillRect(0, 0, Sa, Ta);
  } else if (f.snowBiomeTop - e >= 0) {
    Ba.fillStyle = "#fff";
    Ba.fillRect(0, 0, Sa, f.snowBiomeTop - e);
    Ba.fillStyle = "#b6db66";
    Ba.fillRect(0, f.snowBiomeTop - e, Sa, Ta - (f.snowBiomeTop - e));
  } else {
    Ba.fillStyle = "#b6db66";
    Ba.fillRect(0, 0, Sa, f.mapScale - f.snowBiomeTop - e);
    Ba.fillStyle = "#dbc666";
    Ba.fillRect(0, f.mapScale - f.snowBiomeTop - e, Sa, Ta - (f.mapScale - f.snowBiomeTop - e));
  }
  if (!hb) {
    cb += db * f.waveSpeed * Va;
    if (cb >= f.waveMax) {
      cb = f.waveMax;
      db = -1;
    } else if (cb <= 1) {
      cb = db = 1;
    }
    Ba.globalAlpha = 1;
    Ba.fillStyle = "#dbc666";
    Le(d, e, Ba, f.riverPadding);
    Ba.fillStyle = "#91b2db";
    Le(d, e, Ba, (cb - 1) * 250);
  }
  Ba.globalAlpha = 1;
  Ba.strokeStyle = eb;
  ge(d, e);
  Ba.globalAlpha = 1;
  Ba.strokeStyle = eb;
  Ve(-1, d, e);
  Ba.globalAlpha = 1;
  Ba.lineWidth = gb;
  Ge(0, d, e);
  he(d, e, 0);
  Ba.globalAlpha = 1;
  for (let a = 0; a < aa.length; ++a) {
    la = aa[a];
    if (la.active && la.visible) {
      la.animate(Va);
      Ba.save();
      Ba.translate(la.x - d, la.y - e);
      Ba.rotate(la.dir + la.dirPlus - Math.PI / 2);
      Ke(la, Ba);
      Ba.restore();
    }
  }
  Ve(0, d, e);
  Ge(1, d, e);
  Ve(1, d, e);
  he(d, e, 1);
  Ve(2, d, e);
  Ve(3, d, e);
  Ba.fillStyle = "#000";
  Ba.globalAlpha = 0.09;
  if (d <= 0) {
    Ba.fillRect(0, 0, -d, Ta);
  }
  if (f.mapScale - d <= Sa) {
    let a = Math.max(0, -e);
    Ba.fillRect(f.mapScale - d, a, Sa - (f.mapScale - d), Ta - a);
  }
  if (e <= 0) {
    Ba.fillRect(-d, 0, Sa + d, -e);
  }
  if (f.mapScale - e <= Ta) {
    let a = Math.max(0, -d);
    let b = 0;
    if (f.mapScale - d <= Sa) {
      b = Sa - (f.mapScale - d);
    }
    Ba.fillRect(a, f.mapScale - e, Sa - a - b, Ta - (f.mapScale - e));
  }
  Ba.globalAlpha = 1;
  Ba.fillStyle = "rgba(0, 5, 80, 0.55)";
  Ba.fillRect(0, 0, Sa, Ta);
  Ba.strokeStyle = fb;
  Ba.globalAlpha = 1;
  for (let a = 0; a < ba.length + aa.length; ++a) {
    la = ba[a] || aa[a - ba.length];
    if (la.visible && la.showName === "NOOO") {
      Ba.strokeStyle = fb;
      let a = (la.team ? "[" + la.team + "] " : "") + (la.name || "");
      if (a != "" && la.name != "Yurio Slaves") {
        Ba.font = (la.nameScale || 30) + "px Hammersmith One";
        Ba.fillStyle = "#fff";
        Ba.textBaseline = "middle";
        Ba.textAlign = "center";
        Ba.lineWidth = la.nameScale ? 11 : 8;
        Ba.lineJoin = "round";
        Ba.strokeText(a, la.x - d, la.y - e - la.scale - f.nameY);
        Ba.fillText(a, la.x - d, la.y - e - la.scale - f.nameY);
        if (la.isLeader && bf.crown.isLoaded) {
          let b = f.crownIconScale;
          let c = la.x - d - b / 2 - Ba.measureText(a).width / 2 - f.crownPad;
          Ba.drawImage(bf.crown, c, la.y - e - la.scale - f.nameY - b / 2 - 5, b, b);
        }
        if (la.iconIndex == 1 && bf.skull.isLoaded) {
          let b = f.crownIconScale;
          let c = la.x - d - b / 2 + Ba.measureText(a).width / 2 + f.crownPad;
          Ba.drawImage(bf.skull, c, la.y - e - la.scale - f.nameY - b / 2 - 5, b, b);
        }
        if (la.isPlayer && nc.wait && oa == la && (la.backupNobull ? af[1].isLoaded : af[0].isLoaded) && ma.length && !K) {
          let a = la.scale * 2.2;
          Ba.drawImage(la.backupNobull ? af[1] : af[0], la.x - d - a / 2, la.y - e - a / 2, a, a);
        }
      }
      if (la.health > 0) {
        if (la.name != "Yurio Slaves") {
          Ba.fillStyle = fb;
          Ba.roundRect(la.x - d - f.healthBarWidth - f.healthBarPad, la.y - e + la.scale + f.nameY, f.healthBarWidth * 2 + f.healthBarPad * 2, 17, 8);
          Ba.fill();
          Ba.fillStyle = la == ja || la.team && la.team == ja.team ? "#8ecc51" : "#cc5151";
          Ba.roundRect(la.x - d - f.healthBarWidth, la.y - e + la.scale + f.nameY + f.healthBarPad, f.healthBarWidth * 2 * (la.health / la.maxHealth), 17 - f.healthBarPad * 2, 7);
          Ba.fill();
        }
        if (la.isPlayer) {
          Ba.globalAlpha = 1;
          let a = {
            primary: la.primaryIndex == undefined ? 1 : (ec.weapons[la.primaryIndex].speed - la.reloads[la.primaryIndex]) / ec.weapons[la.primaryIndex].speed,
            secondary: la.secondaryIndex == undefined ? 1 : (ec.weapons[la.secondaryIndex].speed - la.reloads[la.secondaryIndex]) / ec.weapons[la.secondaryIndex].speed,
            turret: (2500 - la.reloads[53]) / 2500
          };
          if (!la.currentReloads) {
            la.currentReloads = {
              primary: a.primary,
              secondary: a.secondary,
              turret: a.turret
            };
          }
          const b = 0.3;
          la.currentReloads.primary = (1 - b) * la.currentReloads.primary + b * a.primary;
          la.currentReloads.secondary = (1 - b) * la.currentReloads.secondary + b * a.secondary;
          la.currentReloads.turret = (1 - b) * la.currentReloads.turret + b * a.turret;
          let g = la.primaryIndex !== undefined ? (ec.weapons[la.primaryIndex].speed - la.reloads[la.primaryIndex]) / ec.weapons[la.primaryIndex].speed : 1;
          let h = la.secondaryIndex !== undefined ? (ec.weapons[la.secondaryIndex].speed - la.reloads[la.secondaryIndex]) / ec.weapons[la.secondaryIndex].speed : 1;
          const i = la.x - d;
          const j = la.y - e;
          const k = 35;
          const l = 15;
          const m = Math.PI * 2 / 3;
          const n = -Math.PI / 2 + Math.PI / 3 + la.dir - Math.PI / 2;
          const o = n + m * la.currentReloads.secondary;
          const p = Math.PI / 2 + la.dir - Math.PI / 2;
          const q = p + m * la.currentReloads.primary;
          const r = Math.PI + Math.PI / 4.5 + la.dir - Math.PI / 2;
          const s = r + m / 1.25 * la.currentReloads.turret;
          function t(a) {
            const b = Math.floor((1 - a) * 255);
            return "rgb(" + b + ", " + b + ", " + b + ")";
          }
          Ba.save();
          if (la.currentReloads.primary < 0.999) {
            Ba.beginPath();
            Ba.lineCap = "round";
            Ba.arc(i, j, k, p, q);
            Ba.lineWidth = 4;
            Ba.strokeStyle = t(la.currentReloads.primary * 240);
            Ba.stroke();
          }
          if (la.currentReloads.secondary < 0.999) {
            Ba.beginPath();
            Ba.lineCap = "round";
            Ba.arc(i, j, k, n, o);
            Ba.lineWidth = 4;
            Ba.strokeStyle = t(la.currentReloads.secondary * 240);
            Ba.stroke();
          }
          if (la.currentReloads.turret < 0.999) {
            Ba.beginPath();
            Ba.lineCap = "round";
            Ba.arc(i, j, k, r, s);
            Ba.lineWidth = 4;
            Ba.strokeStyle = t(la.currentReloads.turret * 240);
            Ba.stroke();
          }
          Ba.restore();
          if (la.name != "Yurio Slaves") {
            Ba.globalAlpha = 1;
            Ba.font = "27px Hammersmith One";
            Ba.strokeStyle = fb;
            Ba.textBaseline = "middle";
            Ba.textAlign = "center";
            Ba.lineWidth = 11;
            Ba.lineJoin = "round";
            let a = f.crownIconScale;
            let b = la.x - d - a / 2 + f.crownPad - 2;
            let c = (la.skinIndex == 45 && la.shameTimer > 0 ? la.shameTimer : la.shameCount).toString();
            let g = b - 60;
            let h = la.y - e - la.scale - f.nameY + 0;
            if (la.skinIndex == 45) {
              Ba.fillStyle = "red";
            } else {
              Ba.fillStyle = "#fff";
            }
            Ba.strokeText(c, g, h);
            Ba.fillText(c, g, h);
          }
          if (!la.isTeam(ja)) {
            let a = {
              x: Qa / 2,
              y: Ra / 2
            };
            let b = Math.min(1, dc.getDistance(0, 0, ja.x - la.x, (ja.y - la.y) * (16 / 9)) * 100 / (f.maxScreenHeight / 2) / a.y);
            let c = a.y * b / 2;
            let g = c * Math.cos(dc.getDirect(la, ja, 0, 0));
            let h = c * Math.sin(dc.getDirect(la, ja, 0, 0));
            Ba.save();
            Ba.translate(ja.x - d + g, ja.y - e + h);
            Ba.rotate(la.aim2 + Math.PI / 2);
            let i = 255 - la.sid * 2;
            Ba.fillStyle = "rgb(" + i + ", " + i + ", " + i + ")";
            Ba.globalAlpha = b;
            let j = function (a, b) {
              b = b || Ba;
              let c = a * (Math.sqrt(3) / 2);
              b.beginPath();
              b.moveTo(0, -c / 1.5);
              b.lineTo(-a / 2, c / 2);
              b.lineTo(a / 2, c / 2);
              b.lineTo(0, -c / 1.5);
              b.fill();
              b.closePath();
            };
            j(25, Ba);
            Ba.restore();
          }
          if (c("predictType").value == "pre2") {
            Ba.lineWidth = 3;
            Ba.strokeStyle = "#fff";
            Ba.globalAlpha = 1;
            Ba.beginPath();
            let a = {
              x: la.x2 - d,
              y: la.y2 - e
            };
            Ba.moveTo(la.x - d, la.y - e);
            Ba.lineTo(a.x, a.y);
            Ba.stroke();
          } else if (c("predictType").value == "pre3") {
            Ba.lineWidth = 3;
            Ba.strokeStyle = "#cc5151";
            Ba.globalAlpha = 1;
            Ba.beginPath();
            let a = {
              x: la.x3 - d,
              y: la.y3 - e
            };
            Ba.moveTo(la.x - d, la.y - e);
            Ba.lineTo(a.x, a.y);
            Ba.stroke();
          }
        }
      }
    }
  }
  if (ja) {
    if (pa.autoPush && pa.pushData) {
      Ba.lineWidth = 5;
      Ba.globalAlpha = 1;
      Ba.beginPath();
      Ba.strokeStyle = "white";
      var g = ja.x - d;
      var h = ja.y - e;
      var i = pa.pushData.x2 - d;
      var j = pa.pushData.y2 - e;
      var k = pa.pushData.x - d;
      var l = pa.pushData.y - e;
      Ba.moveTo(g, h);
      Ba.lineTo(i, j);
      Ba.lineTo(k, l);
      Ba.stroke();
      var m = k - g;
      var n = l - h;
      var o = Math.sqrt(m * m + n * n);
      var p = 100;
      var q = o / p * 100;
      q = Math.min(100, Math.max(0, q));
      let a;
      Ba.fillStyle = "white";
      Ba.strokeStyle = "black";
      Ba.lineWidth = 5;
      Ba.font = "30px Hammersmith One";
      let b = fa.filter(a => a.trap && a.active && a.isTeamObject(ja) && dc.getDist(a, oa, 0, 2) <= oa.scale + a.getScale() + 5).sort(function (a, b) {
        return dc.getDist(a, oa, 0, 2) - dc.getDist(b, oa, 0, 2);
      })[0];
      if (b) {
        a = fa.filter(a => a.dmg && a.active && a.isTeamObject(ja) && dc.getDist(a, b, 0, 0) <= oa.scale + b.scale + a.scale).sort(function (a, b) {
          return dc.getDist(a, oa, 0, 2) - dc.getDist(b, oa, 0, 2);
        })[0];
      }
      let c = (ja.x - d + oa.x - d) / 2;
      let f = (ja.y - e + oa.y - e) / 2;
      Ba.moveTo(ja.x - d, ja.y - e);
      Ba.strokeText(oa.aim2, c, f);
      Ba.fillText(oa.aim2, c, f);
    }
  }
  Ba.globalAlpha = 1;
  lc.update(Va, Ba, d, e);
  for (let a = 0; a < ba.length; ++a) {
    la = ba[a];
    if (la.visible) {
      if (la.chatCountdown > 0) {
        la.chatCountdown -= Va;
        if (la.chatCountdown <= 0) {
          la.chatCountdown = 0;
        }
        Ba.font = "32px Hammersmith One";
        let a = Ba.measureText(la.chatMessage);
        Ba.textBaseline = "middle";
        Ba.textAlign = "center";
        let b = la.x - d;
        let c = la.y - la.scale - e - 90;
        let f = 47;
        let g = a.width + 17;
        Ba.fillStyle = "rgba(0,0,0,0.2)";
        Ba.roundRect(b - g / 2, c - f / 2, g, f, 6);
        Ba.fill();
        Ba.fillStyle = "#fff";
        Ba.fillText(la.chatMessage, b, c);
      }
      if (la.chat.count > 0) {
        if (!K) {
          la.chat.count -= Va;
          if (la.chat.count <= 0) {
            la.chat.count = 0;
          }
          Ba.font = "32px Hammersmith One";
          let a = Ba.measureText(la.chat.message);
          Ba.textBaseline = "middle";
          Ba.textAlign = "center";
          let b = la.x - d;
          let c = la.y - la.scale - e + 180;
          let f = 47;
          let g = a.width + 17;
          Ba.fillStyle = "rgba(0,0,0,0.2)";
          Ba.roundRect(b - g / 2, c - f / 2, g, f, 6);
          Ba.fill();
          Ba.fillStyle = "#ffffff99";
          Ba.fillText(la.chat.message, b, c);
        } else {
          la.chat.count = 0;
        }
      }
    }
  }
  if (Z.length) {
    Z.filter(a => a.active).forEach(a => {
      if (!a.alive) {
        if (a.alpha <= 1) {
          a.alpha += Va / 250;
          if (a.alpha >= 1) {
            a.alpha = 1;
            a.alive = true;
          }
        }
      } else {
        a.alpha -= Va / 5000;
        if (a.alpha <= 0) {
          a.alpha = 0;
          a.active = false;
        }
      }
      if (a.active) {
        Ba.font = "20px Ubuntu";
        let b = Ba.measureText(a.chat);
        Ba.textBaseline = "middle";
        Ba.textAlign = "center";
        let c = a.x - d;
        let f = a.y - e - 90;
        let g = 40;
        let h = b.width + 15;
        Ba.globalAlpha = a.alpha;
        Ba.fillStyle = a.owner.isTeam(ja) ? "#8ecc51" : "#cc5151";
        Ba.strokeStyle = "rgb(25, 25, 25)";
        Ba.strokeText(a.owner.name, c, f - 45);
        Ba.fillText(a.owner.name, c, f - 45);
        Ba.lineWidth = 5;
        Ba.fillStyle = "#ccc";
        Ba.strokeStyle = "rgb(25, 25, 25)";
        Ba.roundRect(c - h / 2, f - g / 2, h, g, 6);
        Ba.stroke();
        Ba.fill();
        Ba.fillStyle = "#fff";
        Ba.strokeStyle = "#000";
        Ba.strokeText(a.chat, c, f);
        Ba.fillText(a.chat, c, f);
        a.y -= Va / 100;
      }
    });
  }
  Ba.globalAlpha = 1;
  $e(Va);
}
window.requestAnimFrame = function () {
  return null;
};
window.rAF = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (a) {
    window.setTimeout(a, 1000 / 9);
  };
}();
function gf() {
  Wa = performance.now();
  Va = Wa - Xa;
  Xa = Wa;
  let a = performance.now();
  let b = a - R.last;
  if (b >= 1000) {
    R.ltime = R.time * (1000 / b);
    R.last = a;
    R.time = 0;
  }
  R.time++;
  c("pingFps").innerHTML = window.pingTime + "ms | Fps: " + Math.round(R.ltime);
  c("packetStatus").innerHTML = L;
  ff();
  rAF(gf);
  rb.avg = Math.round((rb.min + rb.max) / 2);
}
ee();
gf();
function hf(a) {
  c("instaType").disabled = a;
  c("antiBullType").disabled = a;
  c("predictType").disabled = a;
}
hf(K);
let jf = {};
window.debug = function () {
  pa.waitHit = 0;
  pa.autoAim = false;
  nc.isTrue = false;
  mc.inTrap = false;
  Oe = [];
  Re = [];
  Me = [];
};
window.wasdMode = function () {
  K = !K;
  hf(K);
};
window.startGrind = function () {
  if (c("weaponGrind").checked) {
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
      Rb(ja.getItemType(22), a);
    }
  }
};
let kf = ["adorable-eight-guppy", "galvanized-bittersweet-windshield"];
let lf = 0;
window.connectFillBots = function () {
  h = [];
  lf = 0;
  for (let a = 0; a < kf.length; a++) {
    let b = new WebSocket("wss://" + kf[a] + ".glitch.me");
    b.binaryType = "arraybuffer";
    b.onopen = function () {
      b.ssend = function (a) {
        let c = Array.prototype.slice.call(arguments, 1);
        let d = window.msgpack.encode([a, c]);
        b.send(d);
      };
      for (let a = 0; a < 4; a++) {
        window.grecaptcha.execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", {
          action: "homepage"
        }).then(function (a) {
          let c = I.url.split("wss://")[1].split("?")[0];
          b.ssend("bots", "wss://" + c + "?token=re:" + encodeURIComponent(a), lf);
          h.push([b]);
          lf++;
        });
      }
    };
    b.onmessage = function (a) {
      let b = new Uint8Array(a.data);
      let c = window.msgpack.decode(b);
      let d = c[0];
      b = c[1];
    };
  }
};
window.destroyFillBots = function () {
  h.forEach(a => {
    a[0].close();
  });
  h = [];
};
window.tryConnectBots = function () {
  for (let a = 0; a < (Pd.length < 3 ? 3 : 4); a++) {
    window.grecaptcha.execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", {
      action: "homepage"
    }).then(function (a) {
      Vd(a);
    });
  }
};
window.destroyBots = function () {
  Pd.forEach(a => {
    a.closeSocket = true;
  });
  Pd = [];
};
window.resBuild = function () {
  if (ea.length) {
    ea.forEach(a => {
      a.breakObj = false;
    });
    ia = [];
  }
};
window.toggleBotsCircle = function () {
  ja.circle = !ja.circle;
};
window.toggleVisual = function () {
  f.anotherVisual = !f.anotherVisual;
  ea.forEach(a => {
    if (a.active) {
      a.dir = a.lastDir;
    }
  });
};
window.prepareUI = function (a) {
  Cc();
  var b = document.getElementById("chatBox");
  var d = document.getElementById("chatHolder");
  var e = document.createElement("div");
  e.id = "suggestBox";
  var g = 0;
  function h() {
    if (!Dc) {
      if (d.style.display == "block") {
        if (b.value) {
          wc(b.value);
        }
        i();
      } else {
        Ea.style.display = "none";
        bb.style.display = "none";
        d.style.display = "block";
        b.focus();
        Y();
      }
    } else {
      setTimeout(function () {
        var a = prompt("chat message");
        if (a) {
          wc(a);
        }
      }, 1);
    }
    b.value = "";
    (() => {
      g = 0;
    })();
  }
  function i() {
    b.value = "";
    d.style.display = "none";
  }
  dc.removeAllChildren(Ka);
  for (let b = 0; b < ec.weapons.length + ec.list.length; ++b) {
    (function (a) {
      dc.generateElement({
        id: "actionBarItem" + a,
        class: "actionBarItem",
        style: "display:none; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5)",
        onmouseout: function () {
          Bc();
        },
        parent: Ka
      });
    })(b);
  }
  for (let b = 0; b < ec.list.length + ec.weapons.length; ++b) {
    (function (b) {
      let d = document.createElement("canvas");
      d.width = d.height = 66;
      let e = d.getContext("2d");
      e.translate(d.width / 2, d.height / 2);
      e.imageSmoothingEnabled = false;
      e.webkitImageSmoothingEnabled = false;
      e.mozImageSmoothingEnabled = false;
      if (ec.weapons[b]) {
        e.rotate(Math.PI);
        let g = new Image();
        Ee[ec.weapons[b].src] = g;
        g.onload = function () {
          this.isLoaded = true;
          let a = 1 / (this.height / this.width);
          let g = ec.weapons[b].iPad || 1;
          e.drawImage(this, -(d.width * g * f.iconPad * a) / 2, -(d.height * g * f.iconPad) / 2, d.width * g * a * f.iconPad, d.height * g * f.iconPad);
          e.fillStyle = "rgba(0, 0, 70, 0.2)";
          e.globalCompositeOperation = "source-atop";
          e.fillRect(-d.width / 2, -d.height / 2, d.width, d.height);
          c("actionBarItem" + b).style.backgroundImage = "url(" + d.toDataURL() + ")";
        };
        g.src = "./../img/weapons/" + ec.weapons[b].src + ".png";
        let h = c("actionBarItem" + b);
        h.onclick = dc.checkTrusted(function () {
          Nb(a.weapons[ec.weapons[b].type]);
        });
        dc.hookTouchEvents(h);
      } else {
        let g = Pe(ec.list[b - ec.weapons.length], true);
        let h = Math.min(d.width - f.iconPadding, g.width);
        e.globalAlpha = 1;
        e.drawImage(g, -h / 2, -h / 2, h, h);
        e.fillStyle = "rgba(0, 0, 70, 0.1)";
        e.globalCompositeOperation = "source-atop";
        e.fillRect(-h / 2, -h / 2, h, h);
        c("actionBarItem" + b).style.backgroundImage = "url(" + d.toDataURL() + ")";
        let i = c("actionBarItem" + b);
        i.onclick = dc.checkTrusted(function () {
          Mb(a.items[a.getItemType(b - ec.weapons.length)]);
        });
        dc.hookTouchEvents(i);
      }
    })(b);
  }
};
window.profineTest = function (a) {
  if (a) {
    let b = a + "";
    b = b.slice(0, f.maxNameLength);
    return b;
  }
};