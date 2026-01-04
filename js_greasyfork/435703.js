// ==UserScript==
// @name         Themes for Diep.io
// @version      2.1.2
// @description  Themes for diep.io is amazing tool for your style :)
// @author       @jaja.morgan
// @match        https://diep.io/*
// @grant        GM_addStyle
// @license      MIT
// @namespace    *://diep.io/
// @downloadURL https://update.greasyfork.org/scripts/435703/Themes%20for%20Diepio.user.js
// @updateURL https://update.greasyfork.org/scripts/435703/Themes%20for%20Diepio.meta.js
// ==/UserScript==

let editing;
let selected;
let cache = {};

const modo = document.createElement("div");
modo.id = "modo";
modo.style.display = "none";
modo.innerHTML = `
  <div id="themes">
    <div class="tool__header">
      <h2 class="">Themes menu</h2>
    </div>
    <div class="themes__content"></div>
    <div class="container-btns"><button class="green">Create theme</button>
    <span>or</span>
    <button class="purple">Import</button></div>
  </div>

  <div id="dashboard">
    <div class="tool__header">
      <h2>Dashboard</h2>
      <span></span>
    </div>
    <div class="dashboard__content"></div>
    <div class="container-btns">
      <button class="green">Save</button>
      <button class="red">Close</button>
  </div>
  </div>
`;
document.body.append(modo);

const logo = document.createElement("span");
logo.style =
  "z-index:100;position: absolute; top:0; left: 75px; color: #ffffff69; font-size:15px";
logo.innerText = "Themes for diep.io :)";
document.body.append(logo);

const MENU_CONTENT = document.getElementsByClassName("themes__content")[0];
const THEMES = document.getElementById("themes");
const DASHBOARD = document.getElementById("dashboard");
DASHBOARD.style.display = "none";
DASHBOARD.setValues = (values) => {
  [
    ...document
      .querySelector(".dashboard__content")
      .querySelectorAll(".option__value *"),
  ].map((el) => el.setValue(values));
};
DASHBOARD.getValues = () => {
  return [
    ...document
      .querySelector(".dashboard__content")
      .querySelectorAll(".option__value *"),
  ].map((el) => el.getValue());
};
DASHBOARD.context = {
  type: null,
  theme: null,
};

class ThemeBtn {
  constructor(parentTheme, type, name, parent) {
    this.el = document.createElement("button");
    this.el.className = type;
    this.parentTheme = parentTheme;

    if (type == "edit") {
      this.el.innerText = "Edit";
      this.el.onclick = () => {
        if (editing) editing.classList.remove("editing");
        editing = this.parentTheme.el;
        editing.classList.add("editing");
        callDashboard("edit", parentTheme);
        cache = getUserData();
      };
    } else if (type == "export") {
      this.el.innerText = "Export";
      this.el.onclick = () => {
        navigator.clipboard.writeText(
          JSON.stringify({ [`${name}`]: getUserData()[`${name}`] })
        );
      };
    } else {
      this.el.innerText = "Delete";
      this.el.onclick = () => {
        if (confirm("Are you sure? The theme will be deleted.")) {
          let db = getUserData();
          delete db[`${name}`];
          localStorage.setItem("users_themes", JSON.stringify(db));
          parentTheme.el.remove();
          cache = getUserData();
        }
      };
    }
    parent.append(this.el);
  }
}
class Theme {
  constructor(name, data) {
    this.el = document.createElement("div");
    this.el.className = "theme";
    this.data = data;
    this.name = name;

    this.label = document.createElement("div");
    this.label.className = "theme__name";
    this.label.innerText = name;

    this.label.onclick = () => {
      if (selected) selected.classList.remove("activated");

      DASHBOARD.setValues(this.data);
      selected = this.el;
      localStorage.setItem("selected_theme", JSON.stringify(this.name));
      selected.classList.add("activated");
    };

    this.el.append(this.label);
    let contBtn = document.createElement("div");
    contBtn.className = "container-btns";
    new ThemeBtn(this, "export", this.name, contBtn);
    new ThemeBtn(this, "edit", this.name, contBtn);
    new ThemeBtn(this, "delete", this.name, contBtn);

    this.el.append(contBtn);
    MENU_CONTENT.append(this.el);
    cache = getUserData();
  }
  editData(values) {
    let db = getUserData();
    db[`${this.name}`] = values;
    localStorage.setItem("users_themes", JSON.stringify(db));
    this.data = values;
    cache = getUserData();
  }
}

class Input {
  constructor(default_, cmd, isLast = false) {
    this.default = default_;
    this.cmd = cmd;
    //this.cEl = document.createElement("div");
    //this.vEl = document.createElement("div");
    this.el = document.createElement("input");
    this.isLast = isLast;
  }
}

class ColorInput extends Input {
  constructor(default_, cmd, isLast) {
    super(default_, cmd, isLast);
    this.el.type = "color";
    this.el.value = this.default;

    this.el.oninput = () => {
      input.execute(`${this.cmd}${this.el.value.slice(1)}`);
    };
    this.el.getValue = () => {
      return `${this.cmd}${this.el.value.slice(1)}`;
    };
    this.el.setValue = (values) => {
      let found = false;
      for (let value of values) {
        if (value.includes(this.cmd)) {
          found = true;
          const RE = new RegExp(this.cmd);
          const value_ = value.replace(RE, "");
          this.el.value = "#" + value_;
          break;
        }
      }
      if (!found) this.el.value = this.default;
      this.el.oninput();
    };
  }
}

class CheckBoxInput extends Input {
  constructor(default_, cmd, isLast) {
    super(default_, cmd, isLast);
    this.el.type = "checkbox";
    this.el.checked = this.default;

    this.el.oninput = () => {
      input.execute(`${this.cmd}${this.el.checked}`);
    };
    this.el.getValue = () => {
      return `${this.cmd}${this.el.checked}`;
    };
    this.el.setValue = (values) => {
      let found = false;
      for (let value of values) {
        if (value.includes(this.cmd)) {
          found = true;
          const RE = new RegExp(this.cmd);
          const value_ = value.replace(RE, "");
          if (value_ === "true") {
            this.el.checked = true;
          } else {
            this.el.checked = false;
          }
          break;
        }
      }
      if (!found) this.el.checked = this.default;
      this.el.oninput();
    };
  }
}

class RangeInput extends Input {
  constructor(default_, cmd, step, min, max, isLast) {
    super(default_, cmd, isLast);
    this.el.type = "range";
    this.el.value = this.default;
    this.el.step = step;
    this.el.min = min;
    this.el.max = max;
    this.el.addEventListener("mousedown", (event) => {
      event.stopImmediatePropagation();
    });

    this.el.oninput = () => {
      input.execute(`${this.cmd}${this.el.value}`);
      this.el.parentElement.parentElement
        .querySelector(".option__label")
        .onlabel(this.el.value);
    };
    this.el.getValue = () => {
      return `${this.cmd}${this.el.value}`;
    };
    this.el.setValue = (values) => {
      let found = false;
      for (let value of values) {
        if (value.includes(this.cmd)) {
          found = true;
          const RE = new RegExp(this.cmd);
          this.el.value = value.replace(RE, "");
          break;
        }
      }
      if (!found) this.el.value = this.default;
      this.el.oninput();
    };
  }
}

function callDashboard(type, theme) {
  DASHBOARD.style.display = "block";
  DASHBOARD.context.type = type;
  DASHBOARD.context.theme = theme;
  DASHBOARD.setValues(theme.data);

  let header = DASHBOARD.querySelector("div span");
  header.innerText = `editing "${theme.name}"`;

  console.log(DASHBOARD.context);
}
function saveTheme(type, theme) {
  var db = getUserData();
  var values = [];
  var name = "";
  if (!db) db = [];

  if (type == "create") {
    name = prompt("Enter the name of this theme.");
    if (!name) {
      alert("ERR: Invalid volume!");
      return false;
    }
    if (name.length > 25) {
      alert("ERR: Invalid length name (must be 25-)!");
      return false;
    }

    for (let t in db)
      if (t == name)
        return alert("ERR: There is already a theme with the same name!");

    values = DASHBOARD.getValues();
    db[`${name}`] = values;
    localStorage.setItem("users_themes", JSON.stringify(db));

    new Theme(name, values);
    hideEl(DASHBOARD);
  } else if (type == "edit") {
    if (confirm("Are you sure? The theme will be overwritten.")) {
      values = DASHBOARD.getValues();
      theme.editData(values);
      if (editing) editing.classList.remove("editing");
      hideEl(DASHBOARD);
    }
  }
  backToSTheme();
  cache = getUserData();
}

function hideEl(el) {
  if (el.style.display != "none") {
    el.style.display = "none";
  } else {
    el.style.display = "";
  }
}
function setDrag(el, el_child, lsName) {
  var newPosX = 0,
    newPosY = 0,
    MousePosX = 0,
    MousePosY = 0;
  if (el_child) {
    el_child.forEach((e) => e.addEventListener("mousedown", MouseDown));
  } else el.addEventListener("mousedown", MouseDown);

  function MouseDown(mouseDown) {
    MousePosX = mouseDown.pageX;
    MousePosY = mouseDown.pageY;

    el.classList.add("dragableging");
    document.addEventListener("mousemove", elementMove);
    document.addEventListener("mouseup", stopElementMove);
  }

  function elementMove(mouseMove) {
    newPosX = MousePosX - mouseMove.pageX;
    newPosY = MousePosY - mouseMove.pageY;
    MousePosX = mouseMove.pageX;
    MousePosY = mouseMove.pageY;

    el.style.top = el.offsetTop - newPosY + "px";
    el.style.left = el.offsetLeft - newPosX + "px";
  }

  function stopElementMove() {
    localStorage.setItem(
      lsName,
      JSON.stringify({
        x: el.offsetLeft - newPosX + "px",
        y: el.offsetTop - newPosY + "px",
      })
    );
    el.classList.remove("dragableging");

    document.removeEventListener("mousemove", elementMove);
    document.removeEventListener("mouseup", stopElementMove);
  }
}
function importJSON(text) {
  let data;
  let uDb = getUserData();

  try {
    console.log(text);
    data = JSON.parse(text);

    for (let theme in data) {
      if (theme.length > 25) new Error("Incorrect name.");
      for (let el of [...THEMES.getElementsByClassName("theme__name")]) {
        if (el.innerText === theme) {
          if (confirm(`${theme} will be overwrriten, are you sure?`)) {
            el.parentElement.remove();
          } else return;
        }
      }

      new Theme(theme, data[`${theme}`]);
      uDb[`${theme}`] = data[`${theme}`];
    }
  } catch (err) {
    return alert("Something went wrong...");
  }
  localStorage.setItem("users_themes", JSON.stringify(uDb));
}

function init() {
  if (!JSON.parse(localStorage.getItem("cho"))) {
    alert("Press 'r' to show or hide menu in game.");
    setTimeout(() => alert("Please dont forget to send feedback :v"), 30000);
    localStorage.setItem("cho", "1");
    localStorage.setItem(
      "users_themes",
      JSON.stringify({
        classic: [],
        dark: [
          "ren_border_color 0x858585",
          "ren_grid_color 0xffffff",
          "ren_background_color 0x101010",
        ],
        arras: [
          "ren_score_bar_fill_color 0x8abc3f",
          "ren_xp_bar_fill_color 0xefc74b",
          "net_replace_color 0 0x484848",
          "net_replace_color 1 0xa7a7af",
          "net_replace_color 2 0x3ca4cb",
          "net_replace_color 3 0x3ca4cb",
          "net_replace_color 4 0xe03e41",
          "net_replace_color 5 0xcc669c",
          "net_replace_color 6 0x8abc3f",
          "net_replace_color 8 0xefc74b",
          "net_replace_color 9 0xe7896d",
          "net_replace_color 10 0x8d6adf",
          "net_replace_color 11 0xef99c3",
          "net_replace_color 12 0xfdf380",
          "net_replace_color 14 0xa7a7af",
          "net_replace_color 15 0xe03e41",
          "net_replace_color 17 0x726f6f",
        ],
        neon: [
          "ren_stroke_soft_color_intensity -100",
          "ren_solid_background true",
          "ren_stroke_soft_color true",
          "ren_background_color 0x000000",
          "ren_border_color 0xFFFFFF",
          "ren_border_alpha 100",
          "net_replace_color 0 0xFFFFFF",
          "net_replace_color 1 0x010101",
          "net_replace_color 2 0x000102",
          "net_replace_color 3 0x000102",
          "net_replace_color 4 0x020000",
          "net_replace_color 5 0x020002",
          "net_replace_color 6 0x000200",
          "net_replace_color 7 0x000100",
          "net_replace_color 8 0x010101",
          "net_replace_color 9 0x010101",
          "net_replace_color 10 0x010101",
          "net_replace_color 11 0x0e0e0e",
          "net_replace_color 12 0x020200",
          "net_replace_color 13 0x010101",
          "net_replace_color 14 0x010101",
          "net_replace_color 15 0x020000",
          "net_replace_color 16 0x010200",
          "net_replace_color 17 0x000202",
        ],
      })
    );
  }
  window.addEventListener("keydown", (event) => {
    if (["r", "R", "к", "К"].includes(event.key)) {
      hideEl(modo);
    }
  });
  document.getElementsByClassName("green")[0].onclick = () => {
    callDashboard("create", { name: "new theme", data: [] });
  };
  document.getElementsByClassName("green")[1].onclick = () => {
    saveTheme(DASHBOARD.context.type, DASHBOARD.context.theme);
  };
  document.getElementsByClassName("purple")[0].onclick = () => {
    importJSON(prompt("Please paste here copied theme."));
  };
  document.getElementsByClassName("red")[0].onclick = () => {
    if (confirm("Are you sure? The changes are unsaved!")) {
      hideEl(DASHBOARD);
      backToSTheme();
      if (editing) editing.classList.remove("editing");
      let header = DASHBOARD.querySelector("div span");
      header.innerText = ``;
    }
  };

  setDrag(
    document.querySelector("#dashboard"),
    [
      document.querySelector("#dashboard .tool__header"),
      document.querySelector("#dashboard > .container-btns"),
    ],
    "dashboardPos"
  );
  setDrag(
    document.querySelector("#themes"),
    [
      document.querySelector("#themes .tool__header"),
      document.querySelector("#themes > .container-btns"),
    ],
    "themesPos"
  );

  function addSection(header, options) {
    const SECTION = document.createElement("div");
    SECTION.className = "content__section";

    SECTION.append(header, options);
    document.getElementsByClassName("dashboard__content")[0].append(SECTION);
  }

  function createHeader(text) {
    const HEADER = document.createElement("div");
    HEADER.className = "section__header";
    HEADER.innerText = text;

    HEADER.onclick = function () {
      const OPTIONS = HEADER.parentElement.querySelector(".section__options");
      if (OPTIONS) {
        if (OPTIONS.style.display != "none") {
          HEADER.classList.add("hidden");
          OPTIONS.style.display = "none";
        } else {
          HEADER.classList.remove("hidden");
          OPTIONS.style.display = "";
        }
      }
    };
    return HEADER;
  }

  function createOption(text, html, isLast = false) {
    const OPTION = document.createElement("div");
    OPTION.className = "section__option";

    const OPTION_LABEL = document.createElement("span");
    OPTION_LABEL.className = "option__label";
    OPTION_LABEL.innerText = text;
    OPTION_LABEL.onlabel = (value) => {
      OPTION_LABEL.innerText = `${text}: ${value}`;
    };

    const OPTION_VALUE = document.createElement("div");
    OPTION_VALUE.className = "option__value";
    OPTION_VALUE.append(html);

    OPTION.append(OPTION_LABEL, OPTION_VALUE);

    if (isLast) {
      OPTION.style.marginBottom = "10px";
    }

    return OPTION;
  }

  const DB_OBJECT = {
    "Global colors": {
      "Map background": new ColorInput("#cdcdcd", "ren_background_color 0x"),
      "Map border": new ColorInput("#000000", "ren_border_color 0x"),
      "Map border alpha": new RangeInput(
        0.1,
        "ren_border_color_alpha ",
        0.01,
        0,
        1
      ),
      "Map grid": new ColorInput("#000000", "ren_grid_color 0x"),
      "Map grid alpha": new RangeInput(
        0.1,
        "ren_grid_base_alpha ",
        0.01,
        0,
        1,
        true
      ),
      "Minimap background": new ColorInput(
        "#cdcdcd",
        "ren_minimap_background_color 0x"
      ),
      "Minimap border": new ColorInput(
        "#555555",
        "ren_minimap_border_color 0x",
        true
      ),
      "Soft colors": new CheckBoxInput(true, "ren_stroke_soft_color "),
      "Soft stroke intensity": new RangeInput(
        0.25,
        "ren_stroke_soft_color_intensity ",
        0.05,
        null,
        1,
        true
      ),

      Squares: new ColorInput("#ffe869", "net_replace_color 8 0x"),
      Triangles: new ColorInput("#fc7677", "net_replace_color 9 0x"),
      Pentagons: new ColorInput("#768dfc", "net_replace_color 10 0x"),
      "Shiny poligons": new ColorInput(
        "#89ff69",
        "net_replace_color 7 0x",
        true
      ),
      Crashers: new ColorInput("#ff77dc", "net_replace_color 11 0x"),
      "Neutral team": new ColorInput("#ffe869", "net_replace_color 12 0x"),
      "Fallen Bosses": new ColorInput(
        "#c0c0c0",
        "net_replace_color 17 0x",
        true
      ),
      "Health bar": new ColorInput("#85e37d", "ren_health_fill_color 0x"),
      "Health bar background": new ColorInput(
        "#555555",
        "ren_health_background_color 0x"
      ),
      "EXP bar": new ColorInput("#ffde43", "ren_xp_bar_fill_color 0x"),
      "Score bar": new ColorInput("#43ff91", "ren_score_bar_fill_color 0x"),
      "EXP/Score/Scoreboard backgrounds": new ColorInput(
        "#000000",
        "ren_bar_background_color 0x",
        true
      ),
      "Barrels & etc": new ColorInput("#999999", "net_replace_color 1 0x"),
      "Smasher & dominator bases": new ColorInput(
        "#555555",
        "net_replace_color 0 0x"
      ),
    },
    "TDM colors": {
      "Blue team": new ColorInput("#00b1de", "net_replace_color 3 0x"),
      "Red Team": new ColorInput("#f14e54", "net_replace_color 4 0x"),
      "Purple team": new ColorInput("#be7ff5", "net_replace_color 5 0x"),
      "Green team": new ColorInput("#00f46c", "net_replace_color 6 0x"),
    },
    "FFA colors": {
      "Your body": new ColorInput("#00b1de", "net_replace_color 2 0x"),
      "Enemies' bodies": new ColorInput("#f14e56", "net_replace_color 15 0x"),
      "Summoned squares": new ColorInput("#fbc477", "net_replace_color 16 0x"),
      "Maze walls": new ColorInput("#bbbbbb", "net_replace_color 14 0x"),
      "Scoreboard bar": new ColorInput("#44ffa0", "net_replace_color 13 0x"),
    },
    Other: {
      FPS: new CheckBoxInput(false, "ren_fps "),
      "Players' names": new CheckBoxInput(true, "ren_names "),
      "Health bar": new CheckBoxInput(true, "ren_health_bars "),
      "Show health bar values": new CheckBoxInput(
        false,
        "ren_raw_health_values "
      ),
      "Scoreboar names": new CheckBoxInput(true, "ren_scoreboard_names "),
      Scoreboard: new CheckBoxInput(true, "ren_scoreboard "),
      "Minimap viewport": new CheckBoxInput(false, "ren_minimap_viewport "),
      UI: new CheckBoxInput(true, "ren_ui "),
      //"UI scale": new RangeInput(1, "ren_ui_scale ", 0.01, 0, null, true),

      "Pattern grid": new CheckBoxInput(true, "ren_pattern_grid "),
      "Debug collisions": new CheckBoxInput(false, "ren_debug_collisions "),
    },
  };

  for (let ctg in DB_OBJECT) {
    const HEADER = createHeader(ctg);
    const OPTIONS = document.createElement("div");
    OPTIONS.className = "section__options";

    for (let opt in DB_OBJECT[ctg]) {
      const OPT_OBJECT = DB_OBJECT[ctg][opt];
      OPTIONS.append(createOption(opt, OPT_OBJECT.el, OPT_OBJECT.isLast));
    }

    addSection(HEADER, OPTIONS);
  }

  let uDb = getUserData();
  const selected = JSON.parse(localStorage.getItem("selected_theme"));
  for (let t in uDb) {
    let theme = uDb[`${t}`];
    let sTheme = new Theme(t, theme);
    if (!!selected) {
      if (sTheme.name == selected) {
        sTheme.label.onclick();
        DASHBOARD.setValues(cache[`${selected}`]);
      }
    }
  }

  const dashboardPos = JSON.parse(localStorage.getItem("dashboardPos"));
  const themesPos = JSON.parse(localStorage.getItem("themesPos"));
  if (!!dashboardPos) {
    DASHBOARD.style.left = dashboardPos.x;
    DASHBOARD.style.top = dashboardPos.y;
  }
  if (!!themesPos) {
    THEMES.style.left = themesPos.x;
    THEMES.style.top = themesPos.y;
  }
}

function backToSTheme() {
  DASHBOARD.setValues(
    cache[`${JSON.parse(localStorage.getItem("selected_theme"))}`]
  );
}
function getUserData() {
  return JSON.parse(localStorage.getItem("users_themes"));
}

const checking = setInterval(() => {
  try {
    if (input) {
      clearInterval(checking);
      init();
    }
  } catch (err) {}
}, 10);

GM_addStyle(`* {
  outline: none;
  margin: 0;
}
#modo {
  font-family: "Montserrat", sans-serif !important;
  font-size: 16px;
  position: relative;
  z-index: 777;
}
#modo #themes,
#modo #dashboard {
  outline: none;
  padding: 10px 15px;
  border-radius: 6px;
  position: absolute;

  border: 2px #00ffff solid;
  box-shadow: 4px 3px 20px 1px black;
  background: #25282b;
  opacity: 0.9;

  color: white;
}
#modo .tool__header {
  cursor: move !important;
  display: flex;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
}
.tool__header h2 {
  font-size: 250%;
}
.tool__header span {
  display: inline-block;
  font-size: 75%;
  bottom: -15px;
  position: absolute;
}
/*
*
* THEMES MENU
*
*/
#themes {
  top: 25px;
  left: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  max-width: 700px;
  padding: 150px 0px;
  border: 2px solid aqua;
}

.themes__content {
  margin: 20px 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 10px;
}
.themes__content::-webkit-scrollbar {
  width: 7.5px;
}
.themes__content::-webkit-scrollbar-track {
  background-color: aqua;
  border-radius: 5px;
}
.themes__content::-webkit-scrollbar-thumb {
  background-color: #070707;
  border-radius: 3px;
}
.theme {
  position: relative;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px;
}
.theme .theme__name {
  cursor: pointer;
  word-wrap: break-word;
  word-break: normal;
  padding: 10px 0;
  width: 150px;
}

.theme.editing,
.theme.editing.activated {
  background-color: rgba(255, 166, 0, 0.5);
}
.theme.activated {
  background-color: rgba(0, 255, 0, 0.53);
}

.theme:hover:not(.activated, .editing) {
  transition-duration: 0.25s;
  background-color: rgba(255, 255, 255, 0.1);
}
.theme button {
  padding: 0px 10px;
  font-weight: bold;
  border: none;
  color: white;
  height: 25px;
  cursor: pointer;
}
.theme button:hover {
  filter: brightness(80%);
}
button.export {
  margin-right: 10px;
  background: purple;
}
button.edit {
  margin-right: 10px;
  background: rgb(240, 204, 0);
}
button.delete {
  background: red;
}
.container-btns {
  text-align: center;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
#themes > .container-btns {
  cursor: move;
  padding: 0 25px;
}
#dashboard > .container-btns {
  cursor: move;
}
.container-btns .green {
  padding: 10px 15px;
  cursor: pointer;
  font-size: 105%;
  outline: none;
  font-weight: bold;
  background: transparent;
  border: 1px solid rgb(0, 237, 0);
  color: rgb(0, 237, 0);
  transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.container-btns .green:hover {
  color: #070707;
  background: rgb(0, 237, 0);
  transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.container-btns .purple {
  padding: 10px 25px;
  cursor: pointer;
  font-size: 105%;
  outline: none;
  font-weight: bold;
  background: transparent;
  border: 1px solid purple;
  color: purple;
  transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.container-btns .purple:hover {
  color: #070707;
  background: purple;
  transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.container-btns .red {
  padding: 10px 25px;
  cursor: pointer;
  font-size: 105%;
  outline: none;
  font-weight: bold;
  background: transparent;
  border: 1px solid rgb(237, 0, 0);
  color: rgb(237, 0, 0);
  transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.container-btns .red:hover {
  color: #070707;
  background: rgb(237, 0, 0);
  transition: 1s cubic-bezier(0.075, 0.82, 0.165, 1);
}
/*
*
* DASHBOARD
*
*/
#dashboard {
  top: 25px;
  right: 25px;
  width: 444px;
  font-size: 20px;
}

#dashboard * {
  font-weight: 600;
}

#dashboard input {
  outline: none;
  border: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
}

#dashboard input[type="color"],
#dashboard input[type="checkbox"] {
  background: rgba(0, 0, 0, 0);
}
#dashboard ::-webkit-color-swatch {
  border-radius: 50%;
}
#dashboard input[type="checkbox"] {
  margin-top: 3px;
}

#dashboard input[type="number"] {
  text-align: center;
  width: 75px;
  height: 10px;
  border: rgba(0, 0, 0, 0) 2px solid;
  color: white;
  background: black;
  padding: 3px 0px 3px 10px;
  border-radius: 25px;
  transition: border-color 0.3s;
}

#dashboard input[type="number"]:hover,
#dashboard input[type="number"]:focus {
  border: #00ffffbf 2px solid;
}

#dashboard input::-webkit-color-swatch-wrapper {
  margin-top: 2px;
  outline: none;
  padding: 0;
}
.dashboard__content {
  max-height: 500px;
  margin-bottom: 15px;
  overflow-y: auto;
  overflow-x: hidden;
}
.dashboard__content::-webkit-scrollbar {
  width: 7.5px;
}

.dashboard__content::-webkit-scrollbar-track {
  background: #00ffff;
  border-radius: 5px;
}
.dashboard__content::-webkit-scrollbar-thumb {
  background: #070707;
  border-radius: 3px;
}

.content__section {
  margin: 5px 5px 10px 5px;
}
.section__options {
  margin-left: 20px;
  font-size: 75%;
}
.section__header {
  position: relative;
  cursor: pointer;
  user-select: none;
  font-size: 110%;
  display: inline-block;
  margin-left: 25px;
  margin-bottom: 5px;
  font-weight: bold;
}
.section__header::before {
  left: -20px;
  position: absolute;
  content: ">";
  transform: rotate(90deg);
}
.section__header.hidden::before {
  content: ">";
  transform: rotate(0deg);
}
.section__option {
  height: 25px;
  width: 300px;
  padding: 5px 300px 0px 15px;
  border-left: 3px #255cd8 solid;
  transition: 0.2s;
}
.section__option span {
  margin-right: 5px;
}

.section__option input[type="color"] {
  width: 15px;
  height: 15px;
  border: none;
  padding: 0;
}
.section__option input[type="range"] {
  width: 100px;
}

.section__option:hover {
  background: #ffffff12;
}

.section__option:focus-within {
  background: #ffffff26;
  border-left: 3px orange solid;
}
.option__value {
  float: right;
  display: inline-block;
}
.option__label {
  user-select: none;
  display: inline-block;
}

#dashboard .ct {
  padding: 10px 100px;
}

.header__btn {
  outline: none;
  border: none;

  padding: 10px 20px;
  cursor: pointer;
  color: white;

  font-weight: bold;

  transition-property: background-color;
  transition-duration: 0.3s;
}

.header__btn:hover {
  background-color: rgba(0, 0, 0, 0.33) !important;
}

#db_switcher::after,
#db_switcher::before {
  content: " - ";
}
#db_switcher.hidden::after,
#db_switcher.hidden::before {
  content: " + ";
}
`);
