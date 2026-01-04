// ==UserScript==
// @name         DIEP UTILITY V2 (desync)
// @namespace    http://tampermonkey.net/
// @version      2.77
// @namespace    http://tampermonkey.net/
// @description  Themes, Anti-AFK, Anti-Cheat, Kill-Counter, net_predict_movement = false, Store-Convar, Build-Menu!
// @author       pinkthc
// @match        https://diep.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      DV | Do not plagiarize.
// @downloadURL https://update.greasyfork.org/scripts/501049/DIEP%20UTILITY%20V2%20%28desync%29.user.js
// @updateURL https://update.greasyfork.org/scripts/501049/DIEP%20UTILITY%20V2%20%28desync%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.alert('Welcome to TYLERS UTILITY!');
})();


function getInputObject() {
	return new Promise(resolve => {
		if (unsafeWindow.input) resolve(unsafeWindow.input);

		let interval = setInterval(() => {
			if (unsafeWindow.input) {
				clearInterval(interval);
				resolve(unsafeWindow.input);
			}
		});
	});
}

function modifyStoringConvar() {
	document.getElementById("textInput")
		.addEventListener("change", event => {
			let pair = event.target.value.split(/\s+/g);
			if (unsafeWindow.input.get_convar(pair[0]))
				GM_setValue(pair[0], pair[1]);
		});

	let set_convar = unsafeWindow.input.set_convar;
	unsafeWindow.input.set_convar = function (key, value) {
		if (unsafeWindow.input.get_convar(key))
			GM_setValue(key, value);
		set_convar.apply(unsafeWindow.input, arguments);
	}

	let execute = unsafeWindow.input.execute;
	unsafeWindow.input.execute = function (command) {
		let pair = command.split(/\s+/g);
		if (unsafeWindow.input.get_convar(pair[0]))
			GM_setValue(pair[0], pair[1]);
		execute.apply(unsafeWindow.input, arguments);
	}
}

(function init() {
	getInputObject()
		.then(modifyStoringConvar)
		.then(() => GM_listValues().forEach(key => unsafeWindow.input.set_convar(key, GM_getValue(key))));
})();

(function() {
    'use strict';

    function injectScript(code) {
        const script = document.createElement('script');
        script.textContent = code;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    }

    injectScript('net_predict_movement = false;');

function hook(target, callback){
  const check = () => {
    window.requestAnimationFrame(check)
    const func = CanvasRenderingContext2D.prototype[target]

    if(func.toString().includes(target)){

      CanvasRenderingContext2D.prototype[target] = new Proxy (func, {
        apply (method, thisArg, args) {
          callback(thisArg, args)

          return Reflect.apply (method, thisArg, args)
        }
      });
    }
  }
  check()
}
let blacklist = new Array (0);
let killCounter = 0;
hook('fillText', function(thisArg, args){
    if (args[0].includes("You've killed ")) {
      if (blacklist.indexOf(args[0]) === -1) {
        killCounter+=1;
        blacklist.push (args[0])
        setTimeout (function() {
          blacklist.splice(blacklist.indexOf(args[0]), 1);
        },1000);

        setTimeout (function() {
          blacklist.push(args[0]);
        },4600);

        setTimeout (function() {
          blacklist.splice(blacklist.indexOf(args[0]), 1);
        },5000);
      }
    }
})

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

setInterval(() => {
    let gui = () => {
        ctx.fillStyle = "white";
        ctx.lineWidth = 5;
        ctx.font = "1.5em Ubuntu";
        ctx.strokeStyle = "black";
        ctx.strokeText(`Kills: ` + killCounter, canvas.width * 0.935, canvas.height * 0.8);
        ctx.fillText(`Kills: ` + killCounter, canvas.width * 0.935, canvas.height * 0.8);

        window.requestAnimationFrame(gui);
    }
    gui();
}, 1000);

    function getBuilds() {
        const savedBuilds = GM_getValue("builds", null);
        return savedBuilds ? JSON.parse(savedBuilds) : [
            { name: "Anni", values: [1, 1, 0, 7, 7, 7, 3, 7] },
            { name: "Glass", values: [0, 0, 0, 7, 7, 7, 7, 5] },
            { name: "Ram", values: [5, 7, 7, 0, 0, 0, 7, 7] },
            { name: "OverLord", values: [0, 5, 0, 7, 7, 7, 0, 7] },
            { name: "Trapper", values: [5, 7, 0, 0, 7, 7, 7, 0] },
            { name: "Necro", values: [0, 0, 0, 7, 6, 7, 6, 7] },
            { name: "Spammer", values: [2, 3, 0, 7, 7, 7, 7, 0] },
            { name: "Tri-Angle", values: [4, 4, 4, 0, 7, 7, 7, 0] },
            { name: "Assassin", values: [2, 3, 0, 7, 7, 7, 3, 4] },
            { name: "Predator", values: [0, 0, 0, 6, 7, 7, 7, 6] },
            { name: "Penta", values: [1, 3, 0, 5, 6, 6, 7, 5] }
        ];
    }

    function saveBuilds(builds) {
        GM_setValue("builds", JSON.stringify(builds));
        updateBuildMenu();
    }

    let builds = getBuilds();

    function sendCommand(command) {
        input.execute(command);
    }

    function convertBuildToString(build) {
        return build.values.map((value, index) => (index + 1).toString().repeat(value)).join('');
    }

    function optimizeBuildString(buildString) {
        const count = new Array(8).fill(0);
        for (let i = 0; i < buildString.length; i++) {
            count[buildString[i] - 1]++;
        }

        let result = "";
        while (result.length < buildString.length) {
            let max = 0;
            let maxValue = null;
            for (let i = 0; i < count.length; i++) {
                if (count[i] > max) {
                    max = count[i];
                    maxValue = i + 1;
                }
            }
            result += maxValue.toString();
            count[maxValue - 1]--;
        }

        return result;
    }

    function determineBuildType(values) {
        const damageStats = values[4] + values[5];
        const ramStats = values[1] + values[2];

        if (damageStats > ramStats) {
            return "damage";
        } else if (ramStats > damageStats) {
            return "ram";
        } else {
            return "balanced";
        }
    }

    function selectBuild(build) {
        const buildType = determineBuildType(build.values);
        const initialPoints = buildType === "damage" ? "65" : buildType === "ram" ? "23" : "";

        const buildString = initialPoints + optimizeBuildString(convertBuildToString(build));
        sendCommand(`game_stats_build ${buildString}`);
        console.log(`Build order: ${buildString}`);
        closeSubmenus();
        hideBuildValues();
    }

    function createButton(label, icon, clickHandler) {
        const button = document.createElement("button");
        button.innerHTML = icon + " " + label;
        button.style.marginTop = "5px";
        button.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        button.style.color = "white";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.padding = "3px 6px";
        button.style.fontSize = "0.8em";
        button.addEventListener("click", clickHandler);
        return button;
    }

    function showManageBuildsMenu() {
        let menu = document.querySelector("#manageBuildsMenu");

        if (menu) {
            menu.parentNode.removeChild(menu);
            closeSubmenus();
            hideBuildValues();
            return;
        }

        menu = document.createElement("div");
        menu.id = "manageBuildsMenu";
        menu.style.cssText = "position: fixed; top: 55%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(0, 0, 0, 0.7); border: 1px solid grey; padding: 10px; text-align: center; z-index: 9999; color: white; font-size: 0.8em;";

        builds.forEach((build, index) => {
            const buildElement = document.createElement("div");
            buildElement.classList.add("menu-item");
            buildElement.style.cssText = "font-family: sans-serif; display: flex; justify-content: space-between; align-items: center;";

            const buildInfo = document.createElement("span");
            buildInfo.innerHTML = `${build.name}`;
            buildInfo.style.flex = "1";

            const editButton = createButton("", "✎", (event) => {
                event.stopPropagation();
                editBuild(index);
            });

            const deleteButton = createButton("", "⛌", (event) => {
                event.stopPropagation();
                deleteBuild(index);
            });

            buildElement.appendChild(buildInfo);
            buildElement.appendChild(editButton);
            buildElement.appendChild(deleteButton);

            menu.appendChild(buildElement);
        });

        menu.appendChild(createButton("Add New Build", "➕", addNewBuild));
        menu.appendChild(createButton("Close", "➖", () => {
            menu.parentNode.removeChild(menu);
            hideBuildValues();
        }));

        document.body.appendChild(menu);
    }

    function editBuild(index) {
        let buildName = prompt("Enter build name", builds[index].name);
        let buildValues = prompt("Enter build values (e.g., 1,1,0,7,7,7,3,7)", builds[index].values.join(","));

        if (buildName !== null && buildValues !== null) {
            builds[index].name = buildName;
            builds[index].values = buildValues.split(",").map(value => parseInt(value.trim(), 10));
            saveBuilds(builds);
            closeSubmenus();
            showManageBuildsMenu();
        }
    }

    function deleteBuild(index) {
        builds.splice(index, 1);
        saveBuilds(builds);
        closeSubmenus();
        showManageBuildsMenu();
    }

    function addNewBuild() {
        let buildName = prompt("Enter build name");
        let buildValues = prompt("Enter build values (e.g., 1,1,0,7,7,7,3,7)");

        if (buildName !== null && buildValues !== null) {
            const newBuild = {
                name: buildName,
                values: buildValues.split(",").map(value => parseInt(value.trim(), 10))
            };
            builds.push(newBuild);
            saveBuilds(builds);
            closeSubmenus();
            showManageBuildsMenu();
        }
    }

    function closeSubmenus() {
        document.querySelectorAll(".submenu").forEach(menu => menu.parentNode.removeChild(menu));
    }

    function updateBuildMenu() {
        const menu = document.querySelector("#buildMenu");
        if (menu) {
            menu.innerHTML = '';
            builds.forEach((build, index) => {
                const buildElement = document.createElement("div");
                buildElement.classList.add("menu-item");
                buildElement.style.cssText = "font-family: sans-serif; display: flex; justify-content: space-between; align-items: center;";

                const buildInfo = document.createElement("span");
                buildInfo.innerHTML = `${build.name}`;
                buildInfo.style.flex = "1";

                const selectButton = createButton("Select", "", () => selectBuild(build));

                buildElement.appendChild(buildInfo);
                buildElement.appendChild(selectButton);
                menu.appendChild(buildElement);

                buildElement.addEventListener("mouseover", () => showBuildValues(build));
                buildElement.addEventListener("mouseout", hideBuildValues);
            });
        }
    }

    function showBuildValues(build) {
        let buildValuesDisplay = document.querySelector("#buildValuesDisplay");

        if (!buildValuesDisplay) {
            buildValuesDisplay = document.createElement("div");
            buildValuesDisplay.id = "buildValuesDisplay";
            buildValuesDisplay.style.cssText = "position: fixed; top: 55%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(0, 0, 0, 0.7); border: 1px solid grey; padding: 5px; text-align: center; z-index: 9999; color: white; font-size: 0.8em;";
            document.body.appendChild(buildValuesDisplay);
        }

        buildValuesDisplay.textContent = build.values.join("/");
    }

    function hideBuildValues() {
        const buildValuesDisplay = document.querySelector("#buildValuesDisplay");
        if (buildValuesDisplay) {
            buildValuesDisplay.parentNode.removeChild(buildValuesDisplay);
        }
    }

function showBuildMenu() {
    let menu = document.querySelector("#buildMenu");

    if (menu) {
        menu.parentNode.removeChild(menu);
        closeSubmenus();
        hideBuildValues();
        return;
    }

    menu = document.createElement("div");
    menu.id = "buildMenu";
    menu.classList.add("submenu");
    menu.style.cssText = "position: fixed; top: 50%; transform: translateY(-50%); right: 20px; background-color: rgba(0, 0, 0, 0.7); border: 1px solid grey; padding: 5px; text-align: center; z-index: 9999; color: white; font-size: 0.8em;";

    builds.forEach((build, index) => {
        const buildElement = document.createElement("div");
        buildElement.classList.add("menu-item");
        buildElement.style.cssText = "font-family: sans-serif; display: flex; justify-content: space-between; align-items: center;";

        const buildInfo = document.createElement("span");
        buildInfo.innerHTML = `${build.name}`;
        buildInfo.style.flex = "1";

        const selectButton = createButton("Select", "", () => selectBuild(build));

        buildElement.appendChild(buildInfo);
        buildElement.appendChild(selectButton);
        menu.appendChild(buildElement);

        buildElement.addEventListener("mouseover", () => showBuildValues(build));
        buildElement.addEventListener("mouseout", hideBuildValues);
    });

    menu.appendChild(createButton("Manage Builds", "🛠", showManageBuildsMenu));
    menu.appendChild(createButton("Close", "➖", () => {
        menu.parentNode.removeChild(menu);
        hideBuildValues();
    }));

    document.body.appendChild(menu);
}

    document.addEventListener('keydown', function(event) {
        if (event.key === 'r' || event.key === 'R') {
            showBuildMenu();
        }
    });

    updateBuildMenu();

})();


Object.freeze = new Proxy(Object.freeze, {
    apply(r, o, a) {
        Error.stackTraceLimit = 0;
        return r.apply(o, a);
    }
});

(function () {
  "use strict";
  const jsColorPackage=`https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.0.4/jscolor.min.js`;
  var localStorage;
  var saveList;
  var nowSetting;
  var isLocal;
  var clone;
  jsInit();
  setTimeout(pluginInit, 2000);

  function jsInit() {
    Storage.prototype.setObject = function (key, value) {
      this.setItem(key, JSON.stringify(value));
    };
    Storage.prototype.getObject = function (key) {
      var value = this.getItem(key);
      return value && JSON.parse(value);
    };
    clone = function (obj) {
      return JSON.parse(JSON.stringify(obj));
    };
    window.diepStyle = {};
    localStorage = window.localStorage;
    if (location.href.indexOf("file://") >= 0) {
      var warning = false;
      warning ? "" : console.warn("off warning");
      isLocal = true;
      window.input = {
        set_convar: function () {
          warning ? console.warn("block input.set_convar") : "";
        },
        execute: function () {
          warning ? console.warn("block input.set_execute") : "";
        },
      };
    }
  }

  function pluginInit() {
    storageInit();
    keyListen();
    tempInit();
    styleInit();
    diepStyle.onColor = onColor;
    diepStyle.storageInit = storageInit;

    function storageInit(cmd) {
      var th = 50,
        netTH = 110;
      var colors = [
        {
          id: 2,
          name: "You FFA",
          color: "00b1de",
        },
        {
          id: 15,
          name: "Other FFA",
          color: "f14e54",
        },
        {
          id: 3,
          name: "Blue Team",
          color: "00b1de",
        },
        {
          id: 4,
          name: "Red Team",
          color: "f14e54",
        },
        {
          id: 5,
          name: "Purple Team",
          color: "bf7ff5",
        },
        {
          id: 6,
          name: "Green Team",
          color: "00e16e",
        },
        {
          id: 17,
          name: "Fallen team",
          color: "c6c6c6",
        },
        {
          id: 12,
          name: "Arena Closer",
          color: "ffe869",
        },
        {
          id: 8,
          name: "Square",
          color: "ffe869",
        },
        {
          id: 7,
          name: "Green Square?",
          color: "89ff69",
        },
        {
          id: 16,
          name: "Necro Square",
          color: "fcc376",
        },
        {
          id: 9,
          name: "Triangle",
          color: "fc7677",
        },
        {
          id: 10,
          name: "Pentagon",
          color: "768dfc",
        },
        {
          id: 11,
          name: "Crasher",
          color: "f177dd",
        },
        {
          id: 14,
          name: "Waze Wall",
          color: "bbbbbb",
        },
        {
          id: 1,
          name: "Turret",
          color: "999999",
        },
        {
          id: 0,
          name: "Smasher",
          color: "4f4f4f",
        },
        {
          id: th++,
          name: "All Bars",
          color: "000000",
          cmd: "ren_bar_background_color",
        },
        {
          id: th++,
          name: "Outline",
          color: "555555",
          cmd: "ren_stroke_solid_color",
        },
        {
          id: 13,
          name: "Leader Board",
          color: "64ff8c",
        },
        {
          id: th++,
          name: "Xp Bar",
          color: "ffde43",
          cmd: "ren_xp_bar_fill_color",
        },
        {
          id: th++,
          name: "Score Bar",
          color: "43ff91",
          cmd: "ren_score_bar_fill_color",
        },
        {
          id: th++,
          name: "Health Bar1",
          color: "85e37d",
          cmd: "ren_health_fill_color",
        },
        {
          id: th++,
          name: "Health Bar2",
          color: "555555",
          cmd: "ren_health_background_color",
        },
        {
          id: th++,
          name: "Grid Color",
          color: "000000",
          cmd: "ren_grid_color",
        },
        {
          id: th++,
          name: "Minimap 1",
          color: "CDCDCD",
          cmd: "ren_minimap_background_color",
        },
        {
          id: th++,
          name: "Minimap 2",
          color: "797979",
          cmd: "ren_minimap_border_color",
        },
        {
          id: th++,
          name: "Background 1",
          color: "CDCDCD",
          cmd: "ren_background_color",
        },
        {
          id: th++,
          name: "Background 2",
          color: "797979",
          cmd: "ren_border_color",
        },
        {
          id: netTH++,
          name: "UI Color1",
          color: "e69f6c",
          cmd: "ui_replace_colors",
        },
        {
          id: netTH++,
          name: "UI Color2",
          color: "ff73ff",
          cmd: "ui_replace_colors",
        },
        {
          id: netTH++,
          name: "UI Color3",
          color: "c980ff",
          cmd: "ui_replace_colors",
        },
        {
          id: netTH++,
          name: "UI Color4",
          color: "71b4ff",
          cmd: "ui_replace_colors",
        },
        {
          id: netTH++,
          name: "UI Color5",
          color: "ffed3f",
          cmd: "ui_replace_colors",
        },
        {
          id: netTH++,
          name: "UI Color6",
          color: "ff7979",
          cmd: "ui_replace_colors",
        },
        {
          id: netTH++,
          name: "UI Color7",
          color: "88ff41",
          cmd: "ui_replace_colors",
        },
        {
          id: netTH++,
          name: "UI Color8",
          color: "41ffff",
          cmd: "ui_replace_colors",
        },
      ];
      diepStyle.colorMap = new Map(
        colors.map(function (elem) {
          return [
            elem.id,
            {
              color: elem.color,
              cmd: elem.cmd || "no cmd",
            },
          ];
        })
      );

      diepStyle.uiColorMap = function (cmd) {
        var uiTH = nowSetting.colors.findIndex(
          (elem) => elem.name == "UI Color1"
        );
        var colorBunch = "";
        var arr = [];
        if (cmd == "0x") {
          for (var i = 0; i < 8; i++) {
            colorBunch = " 0x" + nowSetting.colors[uiTH + i].color + colorBunch;
          }
          return colorBunch;
        }
        if (cmd == "array") {
          for (var i = 0; i < 8; i++) {
            arr.push(nowSetting.colors[uiTH + i].color);
          }
          return arr;
        }
      };
      var renders = [
        {
          name: "Grid Alpha",
          value: 0.1,
          cmd: "grid_base_alpha",
        },
        {
          name: "Outline Intensity",
          value: 0.25,
          cmd: "stroke_soft_color_intensity",
        },
        {
          name: "Show Outline",
          value: false,
          cmd: "stroke_soft_color",
          reverse: true,
        },
        {
          name: "Border Alpha",
          value: 0.1,
          cmd: "border_color_alpha",
        },
        {
          name: "UI Scale",
          value: 1,
          cmd: "ui_scale",
        },
        {
          name: "Clear UI",
          value: false,
          cmd: "ui",
          reverse: true,
        },
        {
          name: "Show FPS",
          value: false,
          cmd: "fps",
        },
        {
          name: "Show Health",
          value: false,
          cmd: "raw_health_values",
        },
        {
          name: "Hide Name",
          value: false,
          cmd: "names",
          reverse: true,
        },
      ];

      (function checkHasStorage() {
        var _localStorage = localStorage.getObject("diepStyle");
        var page = 1;
        if (nowSetting && nowSetting.saveTH) {
          page = nowSetting.saveTH;
        }
        if (_localStorage && _localStorage.saveList) {
          saveList = _localStorage.saveList;
          nowSetting = _localStorage.nowSetting;
        }
        if (!nowSetting || cmd == "reset") {
          nowSetting = getBlankSetting();
          nowSetting.saveTH = page;
        }

        if (!saveList) saveList = getBlankSaveList();
        saveList[0] = getBlankSetting();
        (function checkMissing() {
          var plain = getBlankSetting();
          plain.renders.forEach((elem, th) => {
            var index = nowSetting.renders.findIndex(
              (now) => elem.cmd == now.cmd
            );
            if (index < 0) {
              nowSetting.renders.splice(th, 0, elem);
              saveList[nowSetting.saveTH].renders.splice(th, 0, elem);
            }
          });
          plain.colors.forEach((elem, th) => {
            var index = nowSetting.colors.findIndex((now) => {
              if (elem.cmd && elem.cmd == now.cmd) return true;
              if ((elem.id || elem.id == 0) && elem.id == now.id) return true;
            });
            if (index < 0) {
              nowSetting.colors.splice(th, 0, elem);
              saveList[nowSetting.saveTH].colors.splice(th, 0, elem);
            }
          });
        })();
      })();

      (function command() {
        diepStyle.command = {};
        renders.forEach((elem) => {
          diepStyle.command[elem.cmd] = {};
          if (elem.reverse) diepStyle.command[elem.cmd].reverse = true;
        });
        diepStyle.command.fn = function (cmd, value) {
          nowSetting.renders = nowSetting.renders.map((elem) => {
            if (elem.cmd == cmd) elem.value = value;
            return elem;
          });
          if (diepStyle.command[cmd].reverse) value = !value;
          input.set_convar("ren_" + cmd, value);
        };
      })();

      function getBlankSetting() {
        return {
          version: 1.0,
          saveTH: 1,
          lock: false,
          colors,
          renders,
        };
      }

      function getBlankSaveList() {
        var list = [];
        for (var i = 0; i < 6; i++) {
          list[i] = getBlankSetting();
          if (i == 0) list[i].isDefault = "default,no save";
        }
        return clone(list);
      }
      Storage.prototype.pluginSave = function () {
        saveList[nowSetting.saveTH] = clone(nowSetting);
        var _storageObj = {
          nowSetting: clone(nowSetting),
          saveList: clone(saveList),
        };
        localStorage.setObject("diepStyle", _storageObj);
      };
      localStorage.pluginSave();
    }

    function keyListen() {
      var input = "";
      document.addEventListener("keyup", function (evt) {
        var that = this;
        if (that.pluginOn == undefined) that.pluginOn = false;
        var e = window.event || evt;
        var key = e.which || e.keyCode;
        input += key;
        if (input.indexOf("2727") >= 0) {
          input = "";
          that.pluginOn = !that.pluginOn;
          togglePanel(that.pluginOn);
          (function save() {
            if (!that.pluginOn) {
              localStorage.pluginSave();
            }
          })();
        }
        if (input.length > 10) input = input.substring(input.length - 10);
      });
    }

    function tempInit() {
      var colorObj = {
        th: 0,
      };
      var setObj = {
        th: 0,
      };

      diepStyle.exportJSON = exportJSON;
      diepStyle.importJSON = importJSON;
      init1();
      loadColor();
      setTimeout(diepStyle.resetRender, 1500);
      diepStyle.resetColor = loadColor;

      function init1() {
        diepStyle.resetRender = resetRender;

        var title = `<div class="title">TYLERS THEME MENU<br>
                Press Esc twice to toggle this</div>`;

        var colorPlane = function (id) {
          return `{position:'left',width:300, height:200,onFineChange:'diepStyle.onColor(${id},this)'}`;
        };

        colorObj.setClass = function () {
          return `colorBlock colorBlock${this.th++}`;
        };
        setObj.setClass = function () {
          return `setting setting${this.th++}`;
        };

        function resetRender(cmd) {
          document
            .querySelectorAll("#styleSetting .render")
            .forEach(function (elem) {
              elem.outerHTML = ``;
            });
          var it = document.querySelector(".renderBegin");
          it.insertAdjacentHTML("afterend", getRenderBody());
          it.remove();
          nowSetting.renders.forEach(function (elem) {
            diepStyle.command.fn(elem.cmd, elem.value);
          });
          listenerInit(cmd);
        }
        var bodyTheme = getThemeBody();
        var bodyRender = getRenderBody();
        var bodyColor = getColorBody();
        var bodyImport = getImportBody();

        function getThemeBody() {
          var th = 0;
          var html = `
                    <div class="themeBody">
                        <div class="themeBegin">Theme</div>
                        <div class="header hide themeDesc">
                            <span class="name"></span>
                            <span class="author"></span>
                        </div>
                        <div class="theme">
                            <div class="list">
                            <div data-theme="dark"><img src="https://imgur.com/bFyXqs5.jpg"><br>Dark</div>
                            <div data-theme="glass"><img src="https://imgur.com/4fnXdkE.jpg"><br>Glass</div>
                            <div data-theme="moomoo"><img src="https://imgur.com/XJwGabH.jpg"><br>Moomoo</div>
                            <div data-theme="80s"><img src="https://imgur.com/9Lma43A.jpg"><br>80s </div>
                            </div>
                        </div>
                    </div>
                    `;
          return html;
        }

        function getRenderBody() {
          var renders = nowSetting.renders;
          var th = -1;
          var html = `
                    <div class="renderBegin">Render</div>

                    <div class="row render">
                    <div class="cell">${
                      renders[++th].name
                    } <br><span class="grid_base_value">${
            renders[th].value
          }</span></div>
                    <div class="cell"><input type="range" name="grid_base_alpha" value=${
                      renders[th].value * 100
                    } max="200"></div>
                    </div>
                    <div class="row render">
                    <div class="cell">${
                      renders[++th].name
                    } <br><span class="stroke_intensity_value">${
            renders[th].value
          }</span></div>
                    <div class="cell"><input type="range" name="stroke_soft_color_intensity" value=${
                      renders[th].value * 100
                    } max="100"></div>
                    </div>
                    <div class="row render">
                    <div class="cell">${renders[++th].name}</div>
                    <div class="cell"><input type="checkbox" name="stroke_soft_color" ${
                      renders[th].value ? "checked" : ""
                    }></div>
                    </div>
                    <div class="row render">
                    <div class="cell">${
                      renders[++th].name
                    } <br><span class="border_value">${
            renders[th].value
          }</span></div>
                    <div class="cell"><input type="range" name="border_color_alpha" value=${
                      renders[th].value * 100
                    } max="100"></div>
                    </div>
                    <div class="row render">
                    <div class="cell">${
                      renders[++th].name
                    } <br><span class="ui_scale_value">${
            renders[th].value
          }</span></div>
                    <div class="cell"><input type="range" name="ui_scale" value=${
                      renders[th].value * 100
                    } max="200"></div>
                    </div>
                    <div class="row render">
                    <div class="cell">${renders[++th].name}</div>
                    <div class="cell"><input type="checkbox" name="ui" ${
                      renders[th].value ? "checked" : ""
                    }></div>
                    </div>
                    <div class="row render">
                    <div class="cell">${renders[++th].name}</div>
                    <div class="cell"><input type="checkbox" name="fps" ${
                      renders[th].value ? "checked" : ""
                    }></div>
                    </div>
                    <div class="row render">
                    <div class="cell">${renders[++th].name}</div>
                    <div class="cell"><input type="checkbox" name="raw_health_values" ${
                      renders[th].value ? "checked" : ""
                    }></div>
                    </div>
                    <div class="row render">
                    <div class="cell">${renders[++th].name}</div>
                    <div class="cell"><input type="checkbox" name="names" ${
                      renders[th].value ? "checked" : ""
                    }></div>
                    </div>
                    `;
          return html;
        }

        function getColorBody() {
          var it = `<div class="row colorBegin">Color</div>\n`;
          nowSetting.colors.forEach(function (elem, th) {
            var id = elem.id;
            it += `
                        <div class="row colorBlock colorBlock${th}">
                        <div class="cell"></div>
                        <div class="cell"><input class="jscolor ${colorPlane(
                          `${id}`
                        )}">  </div>
                        </div>
                        `;
          });
          return it;
        }

        var allBody = `
                <div class="pluginBody">${title}
                <hr>
                ${bodyTheme}
                <div class="table">
                 ${bodyRender} ${bodyColor} <br>
                </div>
                </div>
                `;
        var getSaveBtns = function () {
          var btn = "";
          for (var i = 0; i < 6; i++) {
            if (i == 0) {
              btn += `<button>Default</button>`;
              continue;
            }
            btn += `<button>${i}</button>`;
          }
          return btn;
        };

        function getImportBody() {
          var html = `
                    <div class="importBegin">Import / Export Save</div>
                    <div class="row">
                    <div class="cell">
                    <button class="import">Import</button>
                    </div>
                    <div class="cell">
                    <button class="export">Export</button>
                    </div>
                    </div>
                    `;
          return html;
        }
        var footer = `
                <div class="footer">
                <div class="saveBtns">${getSaveBtns()}</div>
                <div class="otherBtns">
                <span><button class="import">Import</button></span>
                <span><button class="export">Export</button></span>
                <span class="lock"><button>Lock</button></span>
                <span class="reset"><button>Reset</button></span>
                </div>
                </div>
                `;
        var id = 0;
        var temp = `<div id="styleSetting"> ${allBody} ${footer} </div>`;
        document.querySelector("body").insertAdjacentHTML("afterend", temp);
        addScript(jsColorPackage);

        function listenerInit(cmd) {
          (function () {
            var theName = "grid_base_alpha";
            document
              .querySelector(`input[name=${theName}]`)
              .addEventListener("input", function (e) {
                var value = (e.target.value - (e.target.value % 2)) / 100;
                document.querySelector(".grid_base_value").innerHTML = value;
                diepStyle.command.fn(theName, value);
              });
          })();
          (function () {
            var theName = "stroke_soft_color_intensity";
            document
              .querySelector(`input[name=${theName}]`)
              .addEventListener("input", function (e) {
                var value = (e.target.value - (e.target.value % 5)) / 100;
                document.querySelector(".stroke_intensity_value").innerHTML =
                  value;
                diepStyle.command.fn(theName, value);
              });
          })();
          (function () {
            var theName = "stroke_soft_color";
            document
              .querySelector(`input[name=${theName}]`)
              .addEventListener("change", function (e) {
                diepStyle.command.fn(theName, e.target.checked);
              });
          })();
          (function () {
            var theName = "border_color_alpha";
            document
              .querySelector(`input[name=${theName}]`)
              .addEventListener("input", function (e) {
                var value = (e.target.value - (e.target.value % 2)) / 100;
                document.querySelector(".border_value").innerHTML = value;
                diepStyle.command.fn(theName, value);
              });
          })();
          (function () {
            var theName = "ui_scale";
            document
              .querySelector(`input[name=${theName}]`)
              .addEventListener("input", function (e) {
                var value = (e.target.value - (e.target.value % 2)) / 100;
                document.querySelector(`.${theName}_value`).innerHTML = value;
                diepStyle.command.fn(theName, value);
              });
          })();
          (function () {
            var theName = "ui";
            document
              .querySelector(`input[name=${theName}]`)
              .addEventListener("change", function (e) {
                diepStyle.command.fn(theName, e.target.checked);
              });
          })();
          (function () {
            var theName = "fps";
            document
              .querySelector(`input[name=${theName}]`)
              .addEventListener("change", function (e) {
                diepStyle.command.fn(theName, e.target.checked);
              });
          })();
          (function () {
            var theName = "raw_health_values";
            document
              .querySelector(`input[name=${theName}]`)
              .addEventListener("change", function (e) {
                diepStyle.command.fn(theName, e.target.checked);
              });
          })();
          (function () {
            var theName = "names";
            document
              .querySelector(`input[name=${theName}]`)
              .addEventListener("change", function (e) {
                diepStyle.command.fn(theName, e.target.checked);
              });
          })();
          if (cmd == "reset") return;
          (function () {
            document
              .querySelectorAll(`.theme div[data-theme]`)
              .forEach((dom) => {
                dom.addEventListener("click", () => {
                  const name = dom.getAttribute("data-theme");
                  const themes = diepStyle.themeJson;
                  diepStyle.importJSON(themes[name]);
                });
              });
          })();
          document
            .querySelector("button.import")
            .addEventListener("click", () => {
              var example =
                '[\n{"cmd":"ui_scale","value":"1.5"},' +
                '\n{"id":"8","value":"888888"}\n]';
              var gotValue = prompt(
                "Enter The JSON\nExample:\n" + example,
                example.replace(/\s/g, "")
              );
              diepStyle.importJSON(gotValue);
            });
          document
            .querySelector("button.export")
            .addEventListener("click", function (e) {
              prompt("Copy the Json", diepStyle.exportJSON("one"));
            });
          document.querySelectorAll(".saveBtns button").forEach((elem, th) => {
            elem.addEventListener("click", function () {
              localStorage.pluginSave();
              nowSetting = clone(saveList[th]);
              nowSetting.saveTH = th;
              diepStyle.resetColor();
              diepStyle.resetRender("reset");
              updateSaveBtns();
            });
          });
          document
            .querySelector(".lock button")
            .addEventListener("click", function (e) {
              nowSetting.lock = !nowSetting.lock;
              updateSaveBtns();
            });
          document
            .querySelector(".reset button")
            .addEventListener("click", function (e) {
              if (e.target.innerHTML != "Confirm") {
                e.target.innerHTML = "Confirm";
              } else {
                diepStyle.storageInit("reset");
                diepStyle.resetColor();
                diepStyle.resetRender("reset");
                updateSaveBtns();
              }
            });
          document
            .querySelector(".reset button")
            .addEventListener("mouseleave", function (e) {
              e.target.innerHTML = "Reset";
            });
          updateSaveBtns();

          function updateSaveBtns() {
            var theTH = nowSetting.saveTH;
            var status = saveList[theTH];
            var lockBtn = document.querySelector(".lock button");
            var resetBtn = document.querySelector(".reset button");
            if (theTH == 0) {
              lockBtn.disabled = true;
              resetBtn.disabled = true;
              nowSetting.lock = true;
            } else {
              resetBtn.disabled = nowSetting.lock;
              lockBtn.disabled = false;
            }
            if (resetBtn.disabled) {
              document.querySelector(".table").classList.add("noClicks");
              document.querySelector(".themeBody").classList.add("noClicks");
              document.querySelector("button.import").classList.add("noClicks");
              lockBtn.innerHTML = "locked";
            } else {
              document.querySelector(".table").classList.remove("noClicks");
              document.querySelector(".themeBody").classList.remove("noClicks");
              document
                .querySelector("button.import")
                .classList.remove("noClicks");
              lockBtn.innerHTML = "no lock";
            }
            (function () {
              document
                .querySelectorAll(".saveBtns button")
                .forEach(function (elem, th) {
                  elem.classList.remove("chosenBtn");
                  if (theTH == th) elem.classList.add("chosenBtn");
                });
            })();
          }
        }
      }

      function loadColor() {
        if (nowSetting.theme) {
          document.querySelector(".themeDesc").classList.remove("hide");
          var it = document.querySelector(".themeDesc .name");
          it.innerText = nowSetting.theme.name;
          it = document.querySelector(".themeDesc .author");
          it.innerText = "by\n " + nowSetting.theme.author;
        } else {
          document.querySelector(".themeDesc").classList.add("hide");
        }

        nowSetting.colors.some(function (elem, th) {
          var target = document.querySelector(`.colorBlock${th}`);
          if (!target || !target.querySelector(".cell input").jscolor) {
            setTimeout(loadColor, 500);
            return true;
          }
          onColor(elem.id, elem.color);
          target.querySelector(".cell").innerHTML = elem.name;
          target.querySelector(".cell input").jscolor.fromString(elem.color);
        });
      }

      function exportJSON(cmd) {
        var toExport = [];
        if (cmd == "one") toExport = write(nowSetting);
        if (cmd == "all")
          saveList.forEach((elem) => toExport.push(write(elem)));
        return JSON.stringify(toExport);

        function write(now) {
          var array = [];
          now.colors.forEach(function (elem) {
            if (elem.id && elem.id < 50)
              array.push({
                id: elem.id,
                value: elem.color,
              });
            if (elem.id && elem.id >= 50 && elem.id < 100)
              array.push({
                cmd: elem.cmd,
                value: elem.color,
              });
            if (!elem.id && elem.cmd)
              array.push({
                cmd: elem.cmd,
                value: elem.color,
              });
          });
          array.push({
            cmd: "ui_replace_colors",
            value: diepStyle.uiColorMap("array"),
          });
          now.renders.forEach(function (elem) {
            array.push({
              cmd: elem.cmd,
              value: elem.value,
            });
          });
          if (now.theme) {
            array.unshift({
              theme: {
                name: now.theme.name || "",
                author: now.theme.author || "",
              },
            });
          } else {
            array.unshift({
              theme: {
                name: "",
                author: "",
              },
            });
          }
          return array;
        }
      }

      function importJSON(json) {
        if (!isJson(json)) {
          alert("Code Incorrect\nPlz git gud and check your JSON");
          return;
        }
        var gotArr = JSON.parse(json);
        if (!gotArr) return;
        gotArr.forEach(function (elem) {
          nowSetting.colors = nowSetting.colors.map(function (now) {
            if (elem.id && now.id == elem.id) now.color = elem.value;
            if (!elem.id && elem.cmd && now.cmd == elem.cmd)
              now.color = elem.value;
            return now;
          });
          nowSetting.renders = nowSetting.renders.map(function (now) {
            if (elem.cmd && now.cmd == elem.cmd) now.value = elem.value;
            return now;
          });
          if (elem.cmd == "ui_replace_colors") {
            var uiTH = nowSetting.colors.findIndex(
              (elem) => elem.name == "UI Color1"
            );
            for (var i = 0; i < 8; i++) {
              nowSetting.colors[uiTH + i].color = elem.value[i];
            }
          }
          if (elem.theme) {
            if (elem.theme.name || elem.theme.author)
              nowSetting.theme = elem.theme;
          } else {
            elem.theme = {};
          }
        });
        document
          .querySelectorAll(".saveBtns button")
          [nowSetting.saveTH].click();

        function isJson(str) {
          try {
            JSON.parse(str);
          } catch (e) {
            return false;
          }
          if (typeof JSON.parse(str) == "object") return true;
        }
      }
    }

    function onColor(id, e) {
      var target = id;
      var color = e.toString();
      if (id >= 0 && id < 50) {
        input.execute(`net_replace_color ${target} 0x${color}`);
      } else if (id >= 50 && id < 100) {
        var cmd = diepStyle.colorMap.get(id).cmd;
        input.set_convar(cmd, `0x${color}`);
      } else {
        input.execute("ui_replace_colors" + diepStyle.uiColorMap("0x"));
      }
      nowSetting.colors = nowSetting.colors.map(function (elem) {
        if (elem.id === id) elem.color = color;
        return elem;
      });
    }

    function styleInit() {
      addGlobalStyle(`#styleSetting{padding: 0.2em; margin:0.2em; position: absolute;top: 0;right: 0;width: 35%;
                min-width:20em; background-color: rgba(200,200,200,0.8);display:none;border: 1px solid black;height: 85vh;}`);
      addGlobalStyle(
        ".table{ display: table; text-align: center; width: 99%;}"
      );
      addGlobalStyle(".row{ display: table-row; }");
      addGlobalStyle(`.cell{ display: table-cell;}`);
      addGlobalStyle(
        `.cell:not(.noBoard){ display: table-cell; padding: 0.1em 0.3em;border: 1px solid black;}`
      );
      addGlobalStyle(
        "input[type=checkbox],input[type=range]{transform: scale(1.2); }"
      );
      addGlobalStyle(`.pluginBody{height: 90%; overflow-y: auto;}`);
      addGlobalStyle(
        `.theme .list div{width: 48%; float: left; text-align: center; padding: 1%;}`
      );
      addGlobalStyle(`.theme img {width: 90%;}`);
      addGlobalStyle(
        `.colorBegin, .renderBegin, .importBegin,.themeBegin,.header{font-size:1.1rem; line-height:1.3em;text-align: center;}`
      );
      addGlobalStyle(`.saveBtns button{margin: 0 3%; padding: 0.2em 0.5em;}`);
      addGlobalStyle(
        `@-moz-document url-prefix() {.saveBtns button{margin: 0 1%;padding: 0.1em 0.3em;} } }`
      );
      addGlobalStyle(`.otherBtns button{margin: 0 4%; padding: 0.2em 0.5em;}`);
      addGlobalStyle(
        `.footer{text-align:center;height:10%; border: 1px solid black;}`
      );
      addGlobalStyle(`.footer > *{margin: 0.2vh 0 1.3vh 0;}`);

      addGlobalStyle(`.reset button{box-shadow: 0 0 1em red;}`);
      addGlobalStyle(`.backRed{background-color:#f14e54}`);
      addGlobalStyle(
        `.chosenBtn{-webkit-filter: brightness(0.8);filter:brightness(0.8);}`
      );
      addGlobalStyle(
        `.noClicks{pointer-events:none; -webkit-filter: opacity(50%); filter: opacity(50%);}`
      );
      addGlobalStyle(`.hide{display:none}`);

      function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName("head")[0];
        if (!head) {
          return;
        }
        style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = css;
        head.appendChild(style);
      }
    }
  }

  function togglePanel(tf) {
    if (tf) {
      try {
        document.querySelector("#styleSetting").style.display = "block";
      } catch (err) {
        var warn =
          "\n\nYou can DELETE ALL PLUGIN SAVES to fix this" +
          "\nType delete to confirm" +
          "\nor cancel to download all saves";
        var gotValue = prompt("Got an error\n" + err + warn);
        if (gotValue == "delete") {
          localStorage.removeItem("diepStyle");
          alert("Deleted,refresh to take effect");
          return;
        } else {
          download("diep.style saves.txt", diepStyle.exportJSON("all"));
        }
      }
    } else {
      document.querySelector("#styleSetting").style.display = "none";
    }
    function download(filename, text) {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  }

  (function loadThemes() {
    diepStyle.themeJson = {
      dark: `[{"theme":{"name":"Dark Mode","author":"/u/162893476"}} ,{"id":2,"value":"001117"},{"id":15,"value":"140000"},{"id":3,"value":"005574"},{"id":4,"value":"540000"},{"id":5,"value":"090413"},{"id":6,"value":"00121a"},{"id":17,"value":"0D0D0D"},{"id":12,"value":"0D0D0D"},{"id":8,"value":"141400"},{"id":7,"value":"0d1500"},{"id":9,"value":"170606"},{"id":10,"value":"0a0016"},{"id":11,"value":"160517"},{"id":14,"value":"141414"},{"id":1,"value":"0f0f0f"},{"cmd":"ren_bar_background_color","value":"000000"},{"cmd":"ren_stroke_solid_color","value":"555555"},{"id":13,"value":"00bd88"},{"cmd":"ren_xp_bar_fill_color","value":"ffde43"},{"cmd":"ren_score_bar_fill_color","value":"43ff91"},{"cmd":"ren_health_fill_color","value":"85e37d"},{"cmd":"ren_health_background_color","value":"555555"},{"cmd":"ren_grid_color","value":"111111"},{"cmd":"ren_minimap_background_color","value":"323232"},{"cmd":"ren_minimap_border_color","value":"986895"},{"cmd":"ren_background_color","value":"000000"},{"cmd":"ren_border_color","value":"0f0f0f"},{"cmd":"ui_replace_colors","value":["ffe280","ff31a0","882dff","2d5aff","ffde26","ff2626","95ff26","17d2ff"]},{"cmd":"grid_base_alpha","value":2},{"cmd":"stroke_soft_color_intensity","value":-10},{"cmd":"stroke_soft_color","value":false},{"cmd":"border_color_alpha","value":0.5},{"cmd":"ui_scale","value":1},{"cmd":"ui","value":false},{"cmd":"fps","value":false},{"cmd":"raw_health_values","value":false},{"cmd":"names","value":false}] `,
      glass: `[{"theme":{"name":"Glass","author":"/u/162893476"}}, {"id":2,"value":"00627D"},{"id":15,"value":"7E0000"},{"id":3,"value":"00627D"},{"id":4,"value":"7E0000"},{"id":5,"value":"3D007E"},{"id":6,"value":"007E00"},{"id":17,"value":"464646"},{"id":12,"value":"7E7E00"},{"id":8,"value":"7E7E00"},{"id":7,"value":"457E00"},{"id":16,"value":"795C00"},{"id":9,"value":"7C0320"},{"id":10,"value":"43397d"},{"id":11,"value":"7E037A"},{"id":14,"value":"252525"},{"id":1,"value":"464646"},{"cmd":"ren_bar_background_color","value":"191919"},{"cmd":"ren_stroke_solid_color","value":"555555"},{"id":13,"value":"008B54"},{"cmd":"ren_xp_bar_fill_color","value":"666600"},{"cmd":"ren_score_bar_fill_color","value":"008B54"},{"cmd":"ren_health_fill_color","value":"85e37d"},{"cmd":"ren_health_background_color","value":"555555"},{"cmd":"ren_grid_color","value":"373737"},{"cmd":"ren_minimap_background_color","value":"464646"},{"cmd":"ren_minimap_border_color","value":"676767"},{"cmd":"ren_background_color","value":"000000"},{"cmd":"ren_border_color","value":"454545"},{"cmd":"ui_replace_colors","value":["e69f6c","ff73ff","c980ff","71b4ff","ffed3f","ff7979","88ff41","41ffff"]},{"cmd":"grid_base_alpha","value":2},{"cmd":"stroke_soft_color_intensity","value":-9},{"cmd":"stroke_soft_color","value":false},{"cmd":"border_color_alpha","value":0.5},{"cmd":"ui_scale","value":1},{"cmd":"ui","value":false},{"cmd":"fps","value":false},{"cmd":"raw_health_values","value":false},{"cmd":"names","value":false}] `,
      moomoo: `[{"theme":{"name":"Moomoo","author":"yst6zJTuKCHQvAXW4IPV"}}, {"id":2,"value":"847377"},{"id":15,"value":"7F4B63"},{"id":3,"value":"475F9E"},{"id":4,"value":"844052"},{"id":5,"value":"A330B1"},{"id":6,"value":"A66E4F"},{"id":17,"value":"6D6B84"},{"id":12,"value":"596B4A"},{"id":8,"value":"5b6b4d"},{"id":7,"value":"928150"},{"id":16,"value":"596B4A"},{"id":9,"value":"8c4256"},{"id":10,"value":"63647e"},{"id":11,"value":"5A5B72"},{"id":14,"value":"837752"},{"id":1,"value":"535377"},{"cmd":"ren_bar_background_color","value":"586B44"},{"cmd":"ren_stroke_solid_color","value":"35354E"},{"id":13,"value":"64ff8c"},{"cmd":"ren_xp_bar_fill_color","value":"FFFFFF"},{"cmd":"ren_score_bar_fill_color","value":"586B44"},{"cmd":"ren_health_fill_color","value":"8ECC51"},{"cmd":"ren_health_background_color","value":"3D3F42"},{"cmd":"ren_grid_color","value":"000000"},{"cmd":"ren_minimap_background_color","value":"586B44"},{"cmd":"ren_minimap_border_color","value":"586B44"},{"cmd":"ren_background_color","value":"768F5B"},{"cmd":"ren_border_color","value":"333333"},{"cmd":"ui_replace_colors","value":["5d4322","825d30","a8783e","bf8f54","c89e6a","d6b68f","e3ceb5","f1e7da"]},{"cmd":"grid_base_alpha","value":0.1},{"cmd":"stroke_soft_color_intensity","value":0.25},{"cmd":"stroke_soft_color","value":false},{"cmd":"border_color_alpha","value":0.1},{"cmd":"ui_scale","value":1},{"cmd":"ui","value":false},{"cmd":"fps","value":false},{"cmd":"raw_health_values","value":false},{"cmd":"names","value":false}]`,
      "80s": `[{"theme":{"name":"80s Light","author":"Road-to-100k"}}, {"id":2,"value":"00efff"},{"id":15,"value":"ff00ff"},{"id":3,"value":"00efff"},{"id":4,"value":"ff00ff"},{"id":5,"value":"ffaa00"},{"id":6,"value":"4FFFB0"},{"id":17,"value":"c6c6c6"},{"id":12,"value":"ffe869"},{"id":8,"value":"FFD800"},{"id":7,"value":"89ff69"},{"id":16,"value":"fcc376"},{"id":9,"value":"FF004F"},{"id":10,"value":"0000CD"},{"id":11,"value":"ffffff"},{"id":14,"value":"43197e"},{"id":1,"value":"999999"},{"cmd":"ren_bar_background_color","value":"1e0b38"},{"cmd":"ren_stroke_solid_color","value":"555555"},{"id":13,"value":"64ff8c"},{"cmd":"ren_xp_bar_fill_color","value":"ffde43"},{"cmd":"ren_score_bar_fill_color","value":"43ff91"},{"cmd":"ren_health_fill_color","value":"85e37d"},{"cmd":"ren_health_background_color","value":"555555"},{"cmd":"ren_grid_color","value":"ff00ff"},{"cmd":"ren_minimap_background_color","value":"CDCDCD"},{"cmd":"ren_minimap_border_color","value":"797979"},{"cmd":"ren_background_color","value":"1e0b38"},{"cmd":"ren_border_color","value":"000000"},{"cmd":"ui_replace_colors","value":["e69f6c","ff73ff","c980ff","71b4ff","ffed3f","ff7979","88ff41","41ffff"]},{"cmd":"grid_base_alpha","value":1.1},{"cmd":"stroke_soft_color_intensity","value":0.3},{"cmd":"stroke_soft_color","value":false},{"cmd":"border_color_alpha","value":0.6},{"cmd":"ui_scale","value":1},{"cmd":"ui","value":false},{"cmd":"fps","value":false},{"cmd":"raw_health_values","value":false},{"cmd":"names","value":false}] `,
    };
  })();
  function addScript(src) {
    var s = document.createElement("script");
    s.setAttribute("src", src);
    document.body.appendChild(s);
  }
})();



setTimeout (function() {
function hook(target, callback){
  const check = () => {
    window.requestAnimationFrame(check)
    const func = CanvasRenderingContext2D.prototype[target]

    if(func.toString().includes(target)){

      CanvasRenderingContext2D.prototype[target] = new Proxy (func, {
        apply (method, thisArg, args) {
          callback(thisArg, args)

          return Reflect.apply (method, thisArg, args)
        }
      });
    }
  }
  check()
}
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let distance = [0, 0];
let isActive = false;
let storedPos = [0, 0];
let arrowPos = [0, 0];
let minimapPos = [0, 0];
let minimapDim = [0, 0];
let worldPosition = [0, 0];

let teamSnapshot = false;
let team = '#f14e54';
function hookMinimapArrow() {
  let drawInstructions = 0;
  let vertices = new Array(0);

  hook('beginPath', function(context, args) {
    drawInstructions = 1;
    vertices = new Array(0);
  });
  hook('moveTo', function(context, args) {
      drawInstructions = 2;
      vertices.push(args);
  });
  hook('lineTo', function(context, args) {
    if (drawInstructions >= 2 && drawInstructions <= 5) {
      drawInstructions++;
      vertices.push(args);
      return;
    }
    drawInstructions = 0;
  });
  hook('fill', function(context, args) {
    if (context.globalAlpha != 1 || context.fillStyle != '#000000') {
      return;
    }
    if (drawInstructions === 4) {
      const pos = getAverage (vertices);
      arrowPos = pos;
    }
  });
}
function hookMinimap() {
  hook('strokeRect', function(context, args) {
    const t = context.getTransform();
    minimapPos = [t.e, t.f];
    minimapDim = [t.a, t.d];
  });
  hook('rect', function(context, args) {
    const c = context.fillStyle;
    if (teamSnapshot) {
      if (c == '#f14e54') {
        team = c;
      }
      if (c == '#00b2e1') {
        team = c;
      }
      if (c == '#bf7ff5') {
        team = c;
      }
      if (c == '#00e16e') {
        team = c;
      }
    }
  });
}
hookMinimap();
hookMinimapArrow();
function getAverage(points) {
  let ret = [0, 0];
  points.forEach (point => {
    ret[0] += point[0];
    ret[1] += point[1];
  });
  ret[0] /= points.length;
  ret[1] /= points.length;
  return ret;
}
function getWorldPos () {
  const ret = [
    parseFloat((((arrowPos[0] - minimapPos[0] - minimapDim[0] / 2) / minimapDim[0] * 100) * 460).toFixed (3)),
    parseFloat((((arrowPos[1] - minimapPos[1] - minimapDim[1] / 2) / minimapDim[1] * 100) * 460).toFixed (3)),
  ]
  return ret;
}
let lineWidth = 0;
let cameraZoom = 0;
CanvasRenderingContext2D.prototype.stroke = new Proxy(CanvasRenderingContext2D.prototype.stroke, {
    apply(method, self, args) {
        lineWidth = self.lineWidth;
        return Reflect.apply(method, self, args);
    }
});
CanvasRenderingContext2D.prototype.createPattern = new Proxy(CanvasRenderingContext2D.prototype.createPattern, {
    apply(method, self, args) {
        cameraZoom = 1 / lineWidth;
        return Reflect.apply(method, self, args);
    }
});
input.try_spawn = new Proxy(input.try_spawn, {
    apply(method, self, args) {
        teamSnapshot = true;
        setTimeout(function() {
          teamSnapshot = false;
          console.log (team)
        },1000);
        return Reflect.apply(method, self, args);
    }
});
function tick() {
  window.requestAnimationFrame(tick);
  worldPosition = getWorldPos();
  distance = getDist(
    worldPosition,
    storedPos,
  )
  if (isActive) {
    move();
  }
  drawAfkPos();
}
tick();
function toGrid(dist) {
  return [
    dist[0] / ((1 - cameraZoom) * 8),
    dist[1] / ((1 - cameraZoom) * 8),
    dist[2] / ((1 - cameraZoom) * 8),
  ]
}
function drawAfkPos() {
  const width = canvas.width;
  const height = canvas.height;

  const grid = toGrid(distance);
  const size = 50;
  let toDraw = [
    width / 2 - grid[1],
    height / 2 - grid[2],
  ]
  ctx.beginPath();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = team
  ctx.arc(...toDraw, size, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.font = "23px bold arial"
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  if (isActive) {
    ctx.strokeText('[J] Locked', toDraw[0] - 50, toDraw[1] + 25);
    ctx.fillText('[J] Locked', toDraw[0] - 50, toDraw[1] + 25);
  } else {
    ctx.strokeText('[J] Unlocked', toDraw[0] - 50, toDraw[1] + 25);
    ctx.fillText('[J] Unlocked', toDraw[0] - 50, toDraw[1] + 25);
  }

}
document.addEventListener('keydown', e => {
  if(e.key === 'j') {
    isActive = !isActive;
    input.key_up (83);
    input.key_up (87);
    input.key_up (68);
    input.key_up (65);
  }
  if(e.key === 'f') {
    storedPos = worldPosition;
  }
});
function getDist(t1, t2) {
  const distX = t1[0] - t2[0];
  const distY = t1[1] - t2[1];
  return [Math.hypot(distX, distY), distX, distY];
};
function move() {
  if (distance[1] < 0.1) {
    input.key_up (65);
    input.key_down (68);
  } else if (distance[1] > -0.1) {
    input.key_up (68);
    input.key_down (65);
  } else {
    input.key_up (68);
    input.key_up (65);
  }

  if (distance[2] < 0.1) {
    input.key_up (87);
    input.key_down (83);
  } else if (distance[2] > 0.1) {
    input.key_up (83);
    input.key_down (87);
  } else {
    input.key_up (83);
    input.key_up (87);
  }
}
},2500);
(function() {
    'use strict';
    setInterval(() => {
        let screen = window.ui.screen;
        if (screen === "stats") return;
        else window.input.grantReward();
    }, 250);
})();

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.key === 'x' || event.key === 'X') {
            const input = document.querySelector('input');
            if (input) {
                input.dispatchEvent(new Event('keydown', { key: 'ArrowLeft', keyCode: 37 }));
                input.dispatchEvent(new Event('keyup', { key: 'ArrowLeft', keyCode: 37 }));
            }
        }
    });
})();