// ==UserScript==
// @name          phantom client
// @version       v1.9
// @author        Aethryon
// @description   from within the eternal abyss.
// @grant         none
// @run-at        document-start
// @icon          data:image/jpeg;base64,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
// @require       https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require       https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @match         *://sploop.io/*
// @namespace https://greasyfork.org/users/1374875
// @downloadURL https://update.greasyfork.org/scripts/510869/phantom%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/510869/phantom%20client.meta.js
// ==/UserScript==

let ThisIsNotNeeded = false

var e = false;
class f {
  constructor(a, b) {
    this.code = a;
    this.COPY_CODE = a;
    this.unicode = b || false;
    this.hooks = {};
    this.totalHooks = 0;
  }
  static parseValue(a) {
    try {
      return Function("return (" + a + ")")();
    } catch (a) {
      return null;
    }
  }
  isRegexp(a) {
    return g(a) === "regexp";
  }
  generateNumberSystem(a) {
    const b = [...l];
    const c = b.map(({
      prefix: b,
      radix: c
    }) => b + a.toString(c));
    return "(?:" + c.join("|") + ")";
  }
  parseVariables(a) {
    a = a.replace(/\{VAR\}/g, "(?:let|var|const)");
    a = a.replace(/\{QUOTE\}/g, "['\"`]");
    a = a.replace(/ARGS\{(\d+)\}/g, (...a) => {
      let b = Number(a[1]);
      let c = [];
      while (b--) {
        c.push("\\w+");
      }
      return c.join("\\s*,\\s*");
    });
    a = a.replace(/NUMBER\{(\d+)\}/g, (...a) => {
      const b = Number(a[1]);
      return this.generateNumberSystem(b);
    });
    return a;
  }
  format(a, b, c) {
    this.totalHooks += 1;
    let d = "";
    if (Array.isArray(b)) {
      d = b.map(a => this.isRegexp(a) ? a.source : a).join("\\s*");
    } else if (this.isRegexp(b)) {
      d = b.source;
    }
    d = this.parseVariables(d);
    if (this.unicode) {
      d = d.replace(/\\w/g, "(?:[^\\x00-\\x7F-]|\\$|\\w)");
    }
    const e = new RegExp(d.replace(/\{INSERT\}/, ""), c);
    const f = this.code.match(e);
    if (f === null) {
      console.debug("failed to find " + a);
    }
    if (d.includes("{INSERT}")) {
      return new RegExp(d, c);
    } else {
      return e;
    }
  }
  template(a, b, c, d) {
    const e = new RegExp("(" + this.format(b, c).source + ")");
    const f = this.code.match(e) || [];
    this.code = this.code.replace(e, a === 0 ? "$1" + d : d + "$1");
    return f;
  }
  match(a, b, c, d = false) {
    const e = this.format(a, b, c);
    const f = this.code.match(e) || [];
    const g = {
      expression: e,
      match: f
    };
    this.hooks[a] = g;
    return f;
  }
  matchAll(a, b, c = false) {
    const d = this.format(a, b, "g");
    const e = [...this.code.matchAll(d)];
    const f = {
      expression: d,
      match: e
    };
    this.hooks[a] = f;
    return e;
  }
  replace(a, b, c, d) {
    const e = this.format(a, b, d);
    this.code = this.code.replace(e, c);
    return this.code.match(e) || [];
  }
  append(a, b, c) {
    return this.template(0, a, b, c);
  }
  prepend(a, b, c) {
    return this.template(1, a, b, c);
  }
  insert(a, b, c) {
    const {
      source: d
    } = this.format(a, b);
    if (!d.includes("{INSERT}")) {
      throw new Error("Your regexp must contain {INSERT} keyword");
    }
    const e = new RegExp(d.replace(/^(.*)\{INSERT\}(.*)$/, "($1)($2)"));
    this.code = this.code.replace(e, "$1" + c + "$2");
    return this.code.match(e);
  }
}
const g = a => Object.prototype.toString.call(a).slice(8, -1).toLowerCase();
const l = [{
  radix: 2,
  prefix: "0b0*"
}, {
  radix: 8,
  prefix: "0+"
}, {
  radix: 10,
  prefix: ""
}, {
  radix: 16,
  prefix: "0x0*"
}];
const m = " phantom v1.9 ";
const n = [28, 44, 45];
const p = {
  request_received: 17,
  entity_spawned: 32,
  items_upgrade: 2,
  ping_update: 15,
  create_clan: 24,
  update_clan: 16,
  entity_chat: 30,
  leave_clan: 27,
  update_age: 8,
  item_hit: 29,
  upgrades: 14,
  spawned: 35,
  killed: 28,
  update: 20,
  died: 19
};
class q {
  static get Menu_HTML() {
    const a = "\n            <span class=\"menu-title-version\" style=\"position: fixed; bottom: 0px\">\n                " + m + "\n            </span>\n\n            <div class=\"menu-sector\">\n                <div class=\"menu-title-holder\">\n                    <span class=\"menu-title-icon\">\n                        phantom v1.9\n                    </span>\n\n                    <span class=\"menu-title-version\">\n                        \n                    </span>\n                </div>\n\n                <div class=\"menu-body\"></div>\n            </div>\n\n            <div id=\"Visuals\" class=\"menu-sector\" style=\"left: 22vw\">\n                <div class=\"menu-header\">\n                    <span class=\"menu-title\">\n                        Visuals\n                    </span>\n\n                    <i class=\"menu-icon menu-icon-touchable pointer bi bi-chevron-down\" onclick=\"MenuTools.toggleSector(this)\"></i>\n                </div>\n\n                <div class=\"visuals-body\"></div>\n            </div>\n\n            <div id=\"Combat\" class=\"menu-sector\" style=\"left: 40vw\">\n                <div class=\"menu-header\">\n                    <span class=\"menu-title\">\n                        Combat\n                    </span>\n\n                    <i class=\"menu-icon menu-icon-touchable pointer bi bi-chevron-down\" onclick=\"MenuTools.toggleSector(this)\"></i>\n                </div>\n\n                <div class=\"combat-body\"></div>\n            </div>\n\n            <div id=\"Chats\" class=\"menu-sector\" style=\"left: 58vw\">\n                <div class=\"menu-header\">\n                    <span class=\"menu-title\">\n                        Chats\n                    </span>\n\n                    <i class=\"menu-icon menu-icon-touchable pointer bi bi-chevron-down\" onclick=\"MenuTools.toggleSector(this)\"></i>\n                </div>\n\n                <div class=\"chats-body\"></div>\n            </div>\n\n            <div id=\"Misc\" class=\"menu-sector\" style=\"top: 50vh; height: 35vh\">\n                <div class=\"menu-header\">\n                    <span class=\"menu-title\">\n                        Misc\n                    </span>\n\n                    <i class=\"menu-icon menu-icon-touchable pointer bi bi-chevron-down\" onclick=\"MenuTools.toggleSector(this)\"></i>\n                </div>\n\n                <div class=\"misc-body\"></div>\n            </div>\n        ";
    return a;
  }
  static get Menu_CSS() {
    const a = "\n            background-color: rgb(0 0 0 / .5);\n            position: fixed;\n            display: none;\n            height: 100%;\n            z-index: 10;\n            width: 100%;\n            left: 0px;\n            top: 0px;\n        ";
    return a;
  }
  static get Global_CSS() {
    const a = "\n            @import url(\"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.0/font/bootstrap-icons.css\");\n            @import url('https://fonts.cdnfonts.com/css/summer-farmhouse');\n            @import url('https://fonts.cdnfonts.com/css/expletus-sans-2');\n            @import url('https://fonts.cdnfonts.com/css/bastian-script');\n            @import url('https://fonts.cdnfonts.com/css/sofia-sans');\n\n            :root {\n                --main-color: #525151;\n                --darker-color: #1a1a1a;\n                --lighter-color: #4f4e4e;\n\n                --main-color-lighter: #333232;\n                --darker-color-lighter: #262626;\n                --lighter-color-lighter: #4d4c4c;\n\n                --main-color-strong: #292829;\n                --darker-color-strong: #000000;\n                --lighter-color-strong: #4f4f4f;\n\n                --dark-text: #637180;\n                --border-color: #9d7a94;\n                --border-color-hover: #bf94b4;\n\n                --transparent-shadow: #0000007d;\n            }\n\n            * {\n                transition-duration: .5s\n            }\n\n            .pointer,\n            .pointer * {\n                cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;\n            }\n\n            .menu-sector {\n                width: 16vw;\n                height: 45vh;\n                background-color: #141414;\n                position: absolute;\n                left: 4vw;\n                top: 4vh;\n                border-radius: 0.4vw;\n                display: flex;\n                flex-direction: column;\n                align-items: flex-start;\n                overflow: hidden;\n                transition-duration: 0s\n            }\n\n            .menu-sector.open {\n                height: 5.4vh !important\n            }\n\n            .visuals-body,\n            .combat-body,\n            .chats-body,\n            .misc-body {\n                width: -webkit-fill-available;\n            }\n\n            .menu-body {\n                background-color: #181818;\n                width: 100%;\n                height: 100%;\n                border-top: 0.5vh solid #212121\n            }\n\n            .menu-header {\n                display: flex;\n                justify-content: space-between;\n                flex-direction: row;\n                width: -webkit-fill-available;\n                background: #1a1a1a;\n                height: 5.4vh\n            }\n\n            .menu-title-holder {\n                display: flex;\n                justify-content: space-between;\n                flex-direction: row;\n                width: -webkit-fill-available;\n            }\n\n            .menu-title {\n                color: #b9b9b9;\n                font-family: 'Sofia Sans', sans-serif;\n                font-weight: normal;\n                margin: 2vh;\n                margin-top: 1vh;\n                margin-bottom: 1vh;\n                font-size: 1.5vw;\n            }\n\n            .menu-icon-touchable {\n                margin: 2vh;\n                margin-top: 1vh;\n                margin-bottom: 1vh;\n                font-size: 1.5vw;\n                color: #b9b9b9\n            }\n\n            .menu-title-icon,\n            .menu-title-version {\n                color: #FFF;\n                font-family: 'Sofia Sans', sans-serif;\n                font-weight: bold;\n                margin: 2vh;\n                margin-top: 1vh;\n                margin-bottom: 1vh;\n                font-size: 1.5vw;\n            }\n\n            .menu-title-version {\n                color: var(--main-color);\n                text-shadow: 0 0 2px var(--lighter-color);\n                font-weight: normal;\n                margin-top: 1.3vh;\n                font-size: 1.3vw;\n            }\n\n            .menu-icon {\n                color: #626262;\n            }\n\n            .menu-text-holder {\n                display: flex;\n                align-items: center;\n                color: var(--main-color);\n                font-weight: 400;\n            }\n\n            .menu-text-icon::before {\n                margin-bottom: 0.2vh;\n                margin-right: .4vw\n            }\n\n            .menu-text {\n                font-family: 'Expletus Sans', sans-serif;\n                font-weight: normal;\n            }\n\n            .menu-input {\n                outline: none;\n                padding: 1vh;\n                cursor: url(img/ui/cursor-text.png) 16 0, text;\n                background-color: #060606;\n                color: var(--main-color);\n                border: 0px;\n                width: -webkit-fill-available;\n                margin: 1.5vh 1vw 0px 1vw;\n                border-radius: .8vh;\n            }\n\n            .menu-button {\n                color: var(--main-color);\n                display: flex;\n                flex-direction: row;\n                align-items: center;\n                justify-content: space-between;\n                width: -webkit-fill-available;\n                padding: 1vh\n            }\n\n            .menu-button:hover {\n                background-color: #1e1e1e\n            }\n\n            .menu-button:active {\n                background-color: #161616\n            }\n\n            .menu-button.active {\n                background-color: var(--main-color);\n            }\n\n            .menu-button.active * {\n                color: white;\n            }\n\n            #skin-message, #left-content, #game-bottom-content, #game-left-content-main, #game-right-content-main, #cross-promo, #right-content, #new-changelog {\n                display: none !important\n            }\n\n            #background-cosmetic-container {\n                background: var(--lighter-color-lighter)\n            }\n\n            #main-content {\n                background: rgb(213, 228, 233 / 80%);\n                width: max-content\n            }\n\n            #homepage {\n                background-color: var(--transparent-shadow);\n                padding-bottom: 5vh;\n            }\n\n            #skins-categories {\n                margin-right: .4vw;\n                margin-left: .4vw;\n            }\n\n            #play,\n            .blue-button,\n            .green-button,\n            .dark-blue-button,\n            .unlock-button-active {\n                background-color: var(--main-color);\n                box-shadow: inset 0 -5px 0 var(--darker-color);\n            }\n\n            #play:hover,\n            .blue-button:hover,\n            .green-button:hover,\n            .dark-blue-button:hover,\n            .unlock-button-active:hover {\n                background-color: var(--main-color-lighter);\n                box-shadow: inset 0 -5px 0 var(--darker-color-lighter);\n            }\n\n            #play:active,\n            .blue-button:active,\n            .green-button:active,\n            .dark-blue-button:active,\n            .unlock-button-active:active {\n                background-color: var(--main-color);\n                box-shadow: inset 0 5px 0 var(--darker-color);\n            }\n\n            .dark-blue-button-2-active {\n                background-color: var(--main-color);\n                box-shadow: inset 0 5px 0 var(--darker-color);\n                border-color: var(--border-color)\n            }\n\n            .dark-blue-button-2-active:hover {\n                background-color: var(--main-color-lighter);\n                box-shadow: inset 0 5px 0 var(--darker-color-lighter);\n                border-color: var(--border-color-hover)\n            }\n\n            .skins-button {\n                border-color: var(--border-color)\n            }\n\n            .skin,\n            .skin-active:hover {\n                background: transparent;\n                border-radius: 14px;\n                border: unset;\n                box-shadow: 0px 0px 4px 2px var(--main-color);\n            }\n\n            .skin:hover {\n                background-color: transparent;\n                box-shadow: 0px 0px 6px 5px var(--lighter-color)\n            }\n\n            .nav-button-active {\n                color: var(--main-color)\n            }\n\n            .nav-button-text:hover {\n                color: var(--darker-color)\n            }\n\n            .middle-main {\n                background: rgb(163 136 155 / 30%);\n                border: 5px solid transparent;\n                box-shadow: unset !important\n            }\n\n            #small-waiting {\n                background: transparent;\n            }\n\n            #ranking2-middle-main {\n                height: 246px;\n                margin-left: 1vw;\n            }\n\n            #ranking-title {\n                background: var(--main-color)\n            }\n\n            .table-line:hover,\n            .side-button:hover {\n                background: var(--lighter-color)\n            }\n\n            .side-button {\n                background: var(--darker-color)\n            }\n\n            #nav {\n                opacity: 0\n            }\n\n            #nav:hover {\n                opacity: 1\n            }\n\n            #nickname {\n                width: 170px\n            }\n\n            #server-select {\n                margin-left: .2vw\n            }\n\n            .input {\n                background: var(--main-color);\n                border: 5px solid var(--darker-color);\n                border-radius: 16px;\n                box-shadow: inset 0 23px 0 var(--darker-color-lighter)\n            }\n\n            #ffa-mode,\n            #sandbox-mode,\n            #play {\n                border: 5px solid var(--darker-color);\n                border-radius: 16px;\n                box-shadow: inset 0 -5px 0 var(--darker-color-lighter)\n            }\n\n            #ffa-mode,\n            #sandbox-mode {\n                width: 165px !important\n            }\n\n            #event-mode {\n                display: none\n            }\n\n            .background-img-play {\n                background: url() 0 0 repeat\n            }\n\n            #server-select,\n            #server-select:hover,\n            #server-select:active {\n                border: 5px solid var(--darker-color-strong);\n                border-radius: 15px;\n                background: var(--lighter-color-strong);\n                box-shadow: inset 0 -6px 0 0 var(--main-color-strong);\n                color: #fff\n            }\n\n            .active-bar-item {\n                position: fixed;\n                left: 35.4vw;\n                bottom: 0.53vh;\n                width: 5.4vw;\n                height: 10.9vh;\n                border: 0.35vw solid var(--darker-color-lighter);\n                border-radius: 0.9vw\n            }\n\n            .chat-container input {\n                background-color: var(--main-color);\n                border: 4px solid var(--darker-color);\n                padding: 5px;\n                padding-bottom: 0px;\n                box-shadow: unset;\n                font-family: \"\", Courier;\n                font-size: 2vw;\n                color: var(--darker-color);\n                letter-spacing: 2px\n            }\n\n            .chat-container input:placeholder {\n                color: var(--darker-color)\n            }\n\n            .chat-container input.text-shadowed-3 {\n                text-shadow: unset !important\n            }\n\n            .tooltip {\n                position: fixed;\n                width: max-content;\n                height: 4.5vh;\n                font-size: 1.1vw;\n                padding: 1vh;\n                color: var(--main-color);\n                background-color: #0c0c0c;\n                border-radius: .25vw;\n                top: 20vw;\n                left: 17vw;\n                z-index: 1000000000000000000000;\n                pointer-events: none;\n                opacity: 0\n            }\n\n            .radar-ui {\n                position: fixed;\n                opacity: 0;\n                top: 2vh;\n                left: 1vw;\n                width: 12vw;\n                height: 24vh;\n                background-color: #003300ad;\n                pointer-events: none;\n                border-radius: 14vw;\n                display: flex;\n                align-items: center;\n                overflow: hidden;\n                justify-content: center\n            }\n\n            .radar-canvas {\n                width: 200%;\n                height: 100%;\n            }\n        ";
    return a;
  }
static setSwitchs() {
  var a = "";
  for (let b = 0; b < D.length; b++) {
    const c = D[b];
    const className = c.enabled ? "active" : "disabled";
    a += "\n            <div class=\"menu-button " + className + " pointer\" onclick='" + (c.name === "Support" ? "window.open(\"https://www.youtube.com/@Jeanne_airmax\")" : "MenuTools.enableCard(this, " + b + ")") + "' onmouseover=\"MenuTools.title('" + c.title + "')\" onmouseleave=\"MenuTools.titleout()\">\n                <div class=\"menu-text-holder\">\n                    <div>\n                        <i class=\"menu-text-icon " + c.icon + "\"></i>\n                    </div>\n                    <span class=\"menu-text\"> " + c.name + " </span>\n                </div>\n\n                <i class=\"menu-icon bi bi-chevron-right\"></i>\n            </div>\n            ";
  }
  $(".menu-body")[0].innerHTML = a;
}

static setVisuals() {
  var a = "";
  for (let b = 0; b < I.length; b++) {
    const c = I[b];
    const className = c.enabled ? "active" : "disabled";
    a += "\n            <div class=\"menu-button " + className + " pointer\" onclick=\"MenuTools.toggleFeature(this, " + b + ")\" onmouseover=\"MenuTools.title('" + c.title + "')\" onmouseleave=\"MenuTools.titleout()\">\n                <span class=\"menu-text\"> " + c.name + " </span>\n\n                <i class=\"menu-icon bi bi-three-dots-vertical\"></i>\n            </div>";
  }
  $(".visuals-body")[0].innerHTML = a;
}

static setCombats() {
  var a = "";
  for (let b = 0; b < O.length; b++) {
    const c = O[b];
    const className = c.enabled ? "active" : "disabled";
    a += "\n            <div class=\"menu-button " + className + " pointer\" onclick=\"MenuTools.toggleFeatureC(this, " + b + ")\" onmouseover=\"MenuTools.title('" + c.title + "')\" onmouseleave=\"MenuTools.titleout()\">\n                <span class=\"menu-text\"> " + c.name + " </span>\n\n                <i class=\"menu-icon bi bi-three-dots-vertical\"></i>\n            </div>";
  }
  $(".combat-body")[0].innerHTML = a;
}

static setMiscs() {
  var a = "";
  for (let b = 0; b < X.length; b++) {
    const c = X[b];
    const className = c.enabled ? "active" : "disabled";
    a += "\n            <div class=\"menu-button " + className + " pointer\" onclick=\"MenuTools.toggleFeatureM(this, " + b + ")\" onmouseover=\"MenuTools.title('" + c.title + "')\" onmouseleave=\"MenuTools.titleout()\">\n                <span class=\"menu-text\"> " + c.name + " </span>\n\n                <i class=\"menu-icon bi bi-three-dots-vertical\"></i>\n            </div>";
  }
  $(".misc-body")[0].innerHTML = a;
}
  static setChats() {
    var a = "";
    for (let b = 0; b < T.length; b++) {
      const c = T[b];
      a += "\n            <input class=\"menu-input\" maxlength=\"35\" id=\"chat-" + b + "\" value=\"" + c.value + "\" onmouseover=\"MenuTools.title('" + c.name + " | " + c.title + "')\" onmouseleave=\"MenuTools.titleout()\">\n            ";
    }
    $(".chats-body")[0].innerHTML = a;
  }
  static title(a) {
    const b = $(".tooltip")[0];
    b.style.opacity = "1";
    b.style.left = ca.mouse.x + 20 + "px";
    b.style.top = ca.mouse.y + "px";
    b.innerHTML = a;
  }
  static titleout() {
    const a = $(".tooltip")[0];
    a.style.opacity = "0";
  }
  static enableCard(a, b) {
    const c = D[b];
    const d = c.enabled ? "none" : "flex";
    $("#" + c.name)[0].style.display = d;
    if (c.enabled) {
      c.enabled = false;
      a.classList.remove("active");
    } else {
      c.enabled = true;
      a.classList.add("active");
    }
  }
  static toggleFeature(a, b) {
    const c = I[b];
    if (c.enabled) {
      c.enabled = false;
      a.classList.remove("active");
    } else {
      c.enabled = true;
      a.classList.add("active");
    }
  }
static toggleFeatureC(a, b) {
  const c = O[b];
  if (c.enabled) {
    c.enabled = false;
    a.classList.remove("active");
  } else {
    c.enabled = true;
    a.classList.add("active");
  }
}
  static toggleFeatureM(a, b) {
    const c = X[b];
    if (c.enabled) {
      c.enabled = false;
      a.classList.remove("active");
    } else {
      c.enabled = true;
      a.classList.add("active");
    }
  }
  static toggleSector(a) {
    const b = a.parentElement.parentElement;
    b.style.transitionDuration = ".5s";
    setTimeout(() => {
      b.style.transitionDuration = "0s";
    }, 500);
    if (b.classList.contains("open")) {
      a.style.rotate = "0deg";
      b.classList.remove("open");
    } else {
      a.style.rotate = "180deg";
      b.classList.add("open");
    }
  }
  static get Radar_HTML() {
    const a = "\n            <canvas class=\"radar-canvas\"></canvas>\n        ";
    return a;
  }
}
class r {
  constructor() {
    this.loaded = false;
    this.images = {
      logo: "https://t3.ftcdn.net/jpg/03/76/74/78/240_F_376747823_L8il80K6c2CM1lnPYJhhJZQNl6ynX1yj.jpg"
    };
    this.mouse = {};
    this.angles = [];
    this.entities = [];
    this.mill = Date.now();
    this.packetLimiter = 800;
    this.oldDetectingInsta = false;
    this.colors = {
      own: {
        fill: "#00c224",
        stroke: "#75d18b"
      },
      ally: {
        fill: "#7cb4de",
        stroke: "#9187cc"
      },
      enemy: {
        fill: "#cc3b3b",
        stroke: "#bd7373"
      }
    };
  }
}
class s {
  static newElement(a, b = undefined, c = "", d = "", e, f = "", g = "") {
    if (b === undefined) b = [];
    const h = document.createElement(a);
    const i = {
      id: c,
      classList: d,
      innerHTML: f,
      style: g
    };
    Object.assign(h, i);
    if (e) {
      h.outerHTML = e;
    }
    b.forEach(a => {
      h.setAttribute(a.attribute, a.value);
    });
    return h;
  }
  static parseMessage(a) {
    const b = typeof a;
    const c = b === "string" ? JSON.parse(a) : new Uint8Array(a);
    c.type = c[0];
    return c;
  }
  static parseAngle(a) {
    const b = (a + Math.PI) * 65535 / (Math.PI * 2);
    return [b & 255, b >> 8 & 255];
  }
  static distance(a, b) {
    return Math.sqrt(Math.pow(b.y - a.y, 2) + Math.pow(b.x - a.x, 2));
  }
  static direction(a, b) {
    return Math.atan2(a.y - b.y, a.x - b.x);
  }
  static async sleep(a) {
    await new Promise(a => {
      setTimeout(() => {
        a();
      }, 1000);
    });
  }
  static async updatePackets() {
    da.packets++;
    await s.sleep(1000);
    da.packets--;
  }
}
class t {
  constructor() {
    this.dir = 0;
    this.oldX = 0;
    this.oldY = 0;
    this.clan = [];
    this.kills = 0;
    this.packets = 0;
    this.alive = false;
    this.old_weapon = 0;
  }
  packet() {
    const a = this.ws;
    const b = document.querySelector("#chat-3").value;
    if (a.readyState !== WebSocket.OPEN) {
      return;
    }
    if (X[3].enabled && this.packets >= b) {
      return;
    }
    s.updatePackets();
    a.send(new Uint8Array([...arguments]));
  }
  equip(a) {
    if (this.hat != a) {
      this.hat = a;
      this.packet(5, a);
    }
  }
  raw_select(a) {
    return this.packet(2, a);
  }
  select(a) {
    return this.packet(0, a);
  }
  hit(a) {
    const b = s.parseAngle(a);
    this.packet(19, b[0], b[1]);
    this.packet(18);
  }
  place(a, b = undefined) {
    if (b === undefined) b = fa.angle;
    this.select(this.old_weapon);
    this.select(a);
    this.hit(b);
    this.select(this.old_weapon);
  }
  ally(a) {
    let b = a.typeof === "number" ? a : a.sid;
    if (da.clan.length > 0) {
      let a = da.clan.length;
      for (let c = 0; c < a; c++) {
        let a = da.clan[c];
        if (b == a) {
          return true;
        }
      }
    }
    return false;
  }
  mine(a) {
    if (this.ally(a) || this.sid == a.sid) {
      return !0;
    }
    return !1;
  }
  chat(a) {
    if (a.trim() == "") {
      return;
    }
    const b = new TextEncoder().encode(a);
    this.packet(7, ...b);
  }
  quad(a) {
    const b = s.direction(a, this);
    for (let c = 0; c < Math.PI * 2; c += Math.PI / 8) {
      setTimeout(() => {
        this.place(4, -b + c);
      }, c / 0.4 * 30);
    }
  }
  getHat(a, b, c, d) {
    var e = 7;
    if (a < 180) {
      if (d) {
        e = 11;
      } else if (b === 2) {
        e = 5;
      } else if (b === 5) {
        e = 4;
      } else if (b === 4 && !c) {
        e = 2;
      }
    }
    return e;
  }
update() {
  if (this.alive) {
    const b = m == "Lite";
    const c = this.y > 8050 && this.y < 8800;
    var a = 7;
    const d = ca.entities.find(a => a && s.distance(a, this) < 60 && a.type == 6 && !this.mine(a));
    const e = ca.oldDetectingInsta;
    const f = ca.breaking;
    ca.oldDetectingInsta = false;
    ca.breaking = false;
    if (O[1].enabled && d) {
      if (!f) {
        this.quad(d);
      }
      const b = s.direction(d, this);
      ca.oldTrap = d;
      if (this.old_weapon != 1) {
        this.old_weapon = 1;
        this.select(1);
      }
      this.hit(b);
      a = 11;
      ca.breaking = true;
    } else if (f && !b) {
      const a = s.direction(ca.oldTrap, this);
      this.place(7, a);
      ca.oldTrap = null;
    }
    if (c) {
      a = 9;
    }
    if (!b && ca.enemy) {
      const f = s.distance(this, ca.enemy);
      const g = ca.enemy.hat;
      a = this.getHat(f, g, c, d);
      //Anti insta
      if (O[4] && ca.enemy && !b) {
        const b = ca.entities.filter(a => a && a.type == 0 && a.hat == 2 && !this.mine(a) && n.includes(a.weapon) && s.distance(this, a) < 180);
        const c = this.hat != 4 || a != 4;
        if (b.length != 0 && c && !e) {
          a = 4;
          ca.oldDetectingInsta = true;
        }
      }
    }
//Auto-spike
    if (O[5].enabled && ca.enemy) {
      const angle = s.direction(ca.enemy, this);
      const dist = document.querySelector("#chat-2").value;
    if (s.distance(ca.enemy, this) <= dist) {
      this.place(4, angle);
      }
    }
// Auto-Attack
const dist = document.querySelector("#chat-1").value;
if (O[6].enabled && ca.enemy && s.distance(ca.enemy, this) <= dist) {
  const trap = ca.entities.find(a => a && s.distance(a, this) <= 70 && a.type == 6 && !this.mine(a));
  const angle = s.direction(ca.enemy, this);
  if (!trap) {
  this.select(0);
  this.hit(angle);
  }
}
//AFK mode
if (O[7].enabled && ca.enemy && s.distance(ca.enemy, this) <= 187) {
  const angle = s.direction(ca.enemy, this);
  for (let i = 0; i < 2 * Math.PI; i += Math.PI / 4) {
    this.place(4, angle + i);
    this.equip(2);
    this.select(0);
    this.hit(i);
  }
}
document.addEventListener('keydown', (event) => {
    if (event.key === ';' && s.distance(this, ca.enemy) <= 650) {
        let angle = s.direction(ca.enemy, this);
        this.place(7, angle);
        this.place(4, angle);
        this.equip(2);
        this.hit(angle);
    }
});
//Auto heal
      if (this.health < 100 && O[0].enabled) {
        if (this.health < 36 && !b) {
          a = 4;
        }
        setTimeout(() => {
          this.place(2);
        }, b ? 10 : 30);
      }
// placer
if (!d && ca.enemy && O[2].enabled) {
  const enemyDistance = s.distance(this, ca.enemy);
  const enemyDirection = s.direction(ca.enemy, this);
  const dist = document.querySelector("#chat-0").value;

  if (enemyDistance <= dist) {
    const trapEntity = ca.entities.find(a => a && s.distance(a, ca.enemy) < 60 && a.type == 6 && this.mine(a));
    const trapDirection = trapEntity ? s.direction(trapEntity, this) : null;

    if (trapEntity) {
      const angles = [];
      for (let i = 0; i < 360; i += 10) {
        const angle = (i * Math.PI) / 180;
        angles.push(angle);
      }

      const scores = [];
      for (let i = 0; i < angles.length; i++) {
        const angle = angles[i];
        const distance = s.distance(ca.enemy, this, angle);
        const direction = s.direction(ca.enemy, this, angle);
        const score = distance * Math.cos(direction - enemyDirection);
        scores.push({ angle, score });
      }

      scores.sort((a, b) => b.score - a.score);

      const validAngles = [];
      for (let i = 0; i < scores.length; i++) {
        if (scores[i].score > 0) {
          validAngles.push(scores[i].angle);
        }
      }

      ca.angles = validAngles.slice(0, 10);
      this.place(4, ...ca.angles);
    } else {
      ca.angles = [enemyDirection];
      this.place(7, enemyDirection);
    }
  }
        if (!c && !this.items.includes(15) && X[0].enabled && this.age < 6 && Date.now() - ca.mill > 200) {
          const a = Math.atan2(this.y - this.oldY, this.x - this.oldX);
          this.place(5, a);
          ca.mill = Date.now();
        }
      }
      if (O[3].enabled) {
        this.equip(a);
      }
    }
  }
  auto_replace(a, b) {}
  choose(a) {
    this.packet(14, a);
  }
  autoselect(a) {
    if (a != 15) {
      return;
    }
    setTimeout(() => {
      this.select(1);
    }, 100);
  }
  listener(a) {
    const b = a.data;
    const c = s.parseMessage(b);
    if (c.type === p.died) {
      this.alive = false;
      this.kills = 0;
      this.age = 0;
    }
    if (c.type == p.update_age) {
      const a = Math.max(0, c[1] | c[2] << 8 | c[3] << 16 | c[4] << 24);
      this.age = ~~(Math.log(1 + a) ** 2.4 / 13);
    }
    if (c.type === p.spawned) {
      const a = 100;
      const b = true;
      const d = c[1];
      const e = c[2];
      const f = c[4];
      const g = {
        alive: b,
        health: a,
        id: d,
        name: e,
        items: f
      };
      Object.assign(this, g);
    }
    if (c.type === p.upgrades && X[1].enabled) {
      const a = [1, 12, 9, 19, 20, 15, 8, 17, 16];
      for (let b = 0; b < a.length; b++) {
        if (c[1].indexOf(a[b]) != -1) {
          this.choose(a[b]);
          this.autoselect(a[b]);
        }
      }
    }
    if (c.type === p.killed) {
      this.kills++;
      if (this.kills === 1) {
        this.chat("1 dumbass down");
      } else {
        this.chat(this.kills + " dumbasses down");
      }

    }
    if (c.type === p.update_clan || c.type === p.create_clan) {
      this.clan = [...c.slice(2, c.length)];
    }
    if (c.type === p.leave_clan) {
      this.clan = [];
    }
    if (c.type === p.items_upgrade) {
      if (c.byteLength > 1) {
        this.items = [];
        for (let a = 1; a < c.byteLength; a++) {
          this.items.push(c[a]);
        }
      }
    }
    if (c.type === p.update) {
      ca.enemy = null;
      for (let a = 1; a < c.length; a += 19) {
        const b = c[a + 8];
        const d = c[a + 0];
        const e = c[a + 1];
        const f = c[a + 2] | c[a + 3] << 8;
        const g = c[a + 4] | c[a + 5] << 8;
        const h = c[a + 6] | c[a + 7] << 8;
        const i = c[a + 9] / 255 * 6.283185307179586 - Math.PI;
        const j = c[a + 10];
        const k = c[a + 11];
        const l = c[a + 12];
        const m = c[a + 13] / 255 * 100;
        if (b & 2) {
          ca.entities[f] = null;
          da.auto_replace(g, h);
        } else {
          const a = ca.entities[f] || {};
          const b = {
            type: d,
            sid: e,
            id: f,
            x: g,
            y: h,
            weapon: j,
            hat: k,
            health: m,
            team: l,
            dir: i
          };
          Object.assign(a, b);
          ca.entities[f] = a;
          if (f === da.id) {
            Object.assign(da, a);
          }
          const c = !da.team || l != da.team;
          if (d === 0 && da.id !== f && c) {
            const b = ca.enemy;
            const c = Math.hypot(da.y - h, da.x - g);
            const d = ca.enemy ? Math.hypot(da.y - b.y, da.x - b.x) : null;
            if (b) {
              if (c < d) {
                ca.enemy = a;
              }
            } else {
              ca.enemy = a;
            }
          }
        }
      }
      da.update();
    }
  }
  setWS(a, b) {
    this.ws = a;
    this.ws_url = b;
    this.ws.addEventListener("message", this.listener.bind(this));
  }
}
class u {
static PlaceHelper(a, b) {
  if (a[window.values.sid] != da.sid) {
    return;
  }
  if (!I[3].enabled) {
    return;
  }
  for (let c = 0; c < ca.angles.length; c++) {
    const a = ca.angles[c];
    const d = ca.colors.own.fill;
    const e = 35;
    const f = window.values.x;
    const g = window.values.y;
    const h = da.raw[f] + Math.cos(a) * 75;
    const i = da.raw[g] + Math.sin(a) * 75;
    b.beginPath();
    b.translate(h, i);
    b.rotate(a);
    b.fillStyle = d;
    b.globalAlpha = 0.4;
    b.lineWidth = e;
    b.beginPath();
    b.arc(0, 0, e, 0, Math.PI * 2);
    b.fill();
    b.closePath();
  }
}
static Tracers(a, b) {
  if (I[2].enabled) {
  b.beginPath();
  b.moveTo(100, 100);
  b.lineTo(200, 200);
  b.strokeStyle = "#ff0000";
  b.stroke();
  b.closePath();
  }
}
  static Indicators(a, b, c) {
    const d = [21, 30, 40, 31, 32, 33, 34, 35, 38, 39, 1, 3, 4, 5, 9].includes(a.type);
    if (!I[0].enabled) {
      return;
    }
    if (d) {
      return;
    }
    const e = window.values.sid;
    const f = a[e];
    var g = "enemy";
    const h = 6;
    const i = 14;
    if (da.clan.includes(f)) {
      g = "ally";
    }
    if (f == da.sid) {
      g = "own";
    }
    const j = ca.colors[g];
    c.beginPath();
    c.strokeStyle = j.stroke;
    c.fillStyle = j.fill;
    c.globalAlpha = 0.6;
    c.lineWidth = h;
    c.beginPath();
    c.arc(0, 0, i - h, 0, Math.PI * 2);
    c.stroke();
    c.fill();
    c.closePath();
  }
}
class v {
  constructor() {
    this.actual = 0;
  }
  display() {
    const a = document.querySelector(".radar-ui");
    const b = da.alive && I[1].enabled;
    a.style.opacity = b * 1;
  }
  frame() {
    const a = this.canvas;
    const b = this.ctx;
    const c = a.width / 2;
    const d = a.height / 2;
    this.display();
    this.actual += 0.033;
    b.clearRect(0, 0, a.width, a.height);
    b.save();
    b.translate(c, d);
    b.beginPath();
    b.strokeStyle = "#46a72c";
    b.moveTo(-a.width, 0);
    b.lineTo(a.width, 0);
    b.moveTo(0, -a.height);
    b.lineTo(0, a.height);
    b.stroke();
    b.closePath();
    b.save();
    b.rotate(this.actual);
    b.beginPath();
    b.strokeStyle = "#3a7bad";
    b.shadowColor = "#3a7bad";
    b.shadowBlur = 15;
    b.lineWidth = 3;
    b.globalAlpha = 0.8;
    b.moveTo(0, 0);
    b.lineTo(0, a.height);
    b.stroke();
    b.closePath();
    b.restore();
    for (let a = 0; a <= 10; a++) {
      const c = a * 16;
      b.beginPath();
      b.strokeStyle = "#342ca7";
      b.arc(0, 0, c, 0, Math.PI * 2);
      b.stroke();
      b.closePath();
    }
    b.save();
    b.rotate(fa.angle - 1.5 || 0);
    b.beginPath();
    b.fillStyle = "#2a75bf";
    b.arc(0, 0, 8, 0, Math.PI * 2);
    b.arc(7, 5, 4, 0, Math.PI * 2);
    b.arc(-7, 5, 4, 0, Math.PI * 2);
    b.fill();
    b.closePath();
    b.restore();
    if (ca.entities || ca.enemy) {
      const a = ca.entities.filter(a => a && !a.type && a.id != da.id);
      for (let c = 0; c < a.length; c++) {
        const d = a[c];
        const e = (d.x - da.x) / 10;
        const f = (d.y - da.y) / 10;
        b.save();
        b.translate(e, f);
        b.rotate(d.dir - 1.5 || 0);
        b.beginPath();
        b.fillStyle = "#2a75bf";
        b.arc(0, 0, 8, 0, Math.PI * 2);
        b.arc(7, 5, 4, 0, Math.PI * 2);
        b.arc(-7, 5, 4, 0, Math.PI * 2);
        b.fill();
        b.closePath();
        b.restore();
      }
    }
    b.restore();
    requestAnimationFrame(this.frame.bind(this));
  }
  initialize() {
    this.canvas = document.querySelector(".radar-canvas");
    this.ctx = this.canvas.getContext("2d");
    requestAnimationFrame(this.frame.bind(this));
  }
}
class w {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.resize();
  }
  listeners() {
    window.addEventListener("mousemove", this.move.bind(this));
    window.addEventListener("resize", this.resize.bind(this));
  }
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.update();
  }
  move(a) {
    this.x = a.clientX;
    this.y = a.clientY;
    this.update();
  }
  update() {
    this.angle = Math.atan2(this.y - this.height / 2, this.x - this.width / 2);
  }
}
class x {
  constructor(a, b, c) {
    this.active = false;
    this.id = a;
    this.key = b;
    this.delay = c;
    this.interval;
  }
  start(a) {
    if (a != this.key) {
      return;
    }
    this.interval = setInterval(() => {
      if (!this.active) {
        clearInterval(this.interval);
      } else {
        da.place(this.id);
      }
    }, this.delay);
    this.active = true;
  }
  stop(a) {
    if (a != this.key) {
      return;
    }
    this.active = false;
  }
}
const D = [{
  name: "Visuals",
  icon: "bi bi-eye-fill",
  title: "Enable visuals card",
  enabled: true
}, {
  name: "Combat",
  icon: "bi bi-capsule",
  title: "Enable combat card",
  enabled: true
}, {
  name: "Chat",
  icon: "bi bi-chat-left-dots-fill",
  title: "Enable chat config card",
  enabled: true
}, {
  name: "Misc",
  icon: "bi bi-bucket-fill",
  title: "Enable extra config card",
  enabled: true
}];
const I = [{
  name: "Indicators",
  title: "Shows if the structure is yours / enemy / ally",
  enabled: true
}, {
  name: "Radar",
  title: "Shows up a radar in your screen for the players",
  enabled: false
}, {
  name: "Tracers",
  title: "Render lines to mark the entities",
  enabled: false
}, {
  name: "Place Helper",
  title: "Renders where you will auto place",
  enabled: true
}];
const O = [{
  name: "Auto Heal",
  title: "Heals you up when your hp is under 100",
  enabled: true
}, {
  name: "Auto break",
  title: "Automatically breaks the trap you fell in",
  enabled: true
}, {
  name: "Auto place",
  title: "Places trap / spikes to the enemy",
  enabled: true
}, {
  name: "Auto hats",
  title: "Equip hats automatically depending on the biome",
  enabled: true
}, {
  name: "Anti insta",
  title: "Detect if enemy is about to insta then prevent it",
  enabled: true
}, {
  name: "Auto spike",
  title: "Automatically place a spike when an enemy gets too close (can work with trapped enemies)",
  enabled: true
}, {
  name: "Auto attack",
  title: "Automatically attack nearby enemies",
  enabled: true
}, {
  name: "AFK",
  title: "AFK mode",
  enabled: false
}];
const T = [{
  name: "A/place distance",
  title: "Distance for autoPlace",
  value: "200"
}, {
  name: "A/ATK distance",
  title: "Distance for autoAttack",
  value: "170"
}, {
  name: "A/Spike distance",
  title: "Distance for autoSpike",
  value: "140"
}, {
  name: "Packet limit",
  title: "Limit your packets once you get a specific ammout",
  value: "900"
}];
const X = [{
  name: "Auto mill",
  title: "Places mills when you spawn",
  enabled: false
}, {
  name: "Auto upgrade",
  title: "Automatically upgrades for you to play (KH)",
  enabled: true
}, {
  name: "Auto chat",
  title: "Automatically chat",
  enabled: false
}, {
  name: "Packet limiter",
  title: "Limits your packets to prevent you kicked from game",
  enabled: true
}];

function Y(a) {
  const b = new f(a, true);
  window.COPY_CODE = (b.COPY_CODE.match(/^(\(function \w+\(\w+\)\{.+)\(.+?\);$/) || [])[1];
  b.append("EXTERNAL fix", /\(function (\w+)\(\w+\)\{/, "let $2 = eval(`(() => ${COPY_CODE})()`);delete window.COPY_CODE;");
  b.replace("Use Strict", /{QUOTE}use strict{QUOTE};/, "");
  const c = b.match("items", /(\(\w+\.\w+\+\w+,\w+\.\w+\+\w+\).+?(\w+\(\).+?\w+\.\w+\.\w+\))([,;]))/);
  const d = b.match("entity values", /switch\(\w+\.\w+=\w+,\w+\.(\w+)=\w+,\w+\.(\w+)=\w+,\w+\.(\w+)=\w+\.\w+=\w+\.\w+=\w+,\w+\.(\w+)=\w+\.\w+=\w+\.\w+=\w+,\w+\.(\w+)=\w+\.\w+=\w+\.\w+=\w+,\w+\.\w+=\w+,\w+\.\w+=\w+,\w+\.(\w+)=\w+,\w+\.\w+=\w+,\w+\.(\w+)=\w+/);
  const [, e] = b.match("weapon", /\(\w+\.(\w+)\|\w+\.(\w+)<<NUMBER{8}\)/);
  const g = {
    id: d[1],
    sid: d[2],
    x: d[3],
    y: d[4],
    dir: d[5],
    hat: d[6],
    hp: d[7],
    weapon: e
  };
  const h = g;
  b.replace("Clan Colors V2", /\w\(\w+\),"#404040"\):null/, "'#18d644', '#d62e18') : null");
  b.replace("Age Color", /(\("AGE 0",24,)"#fff"\)/, "$1'#18d644', '#c6b7c7')");
  b.replace("Age Body", /(background\:\w+\(\)\.\w+\([^,]+,[^,]+,[^,]+,)[^)]+\)/, "$1 '#2b2b2b')");
  b.replace("Age Fill", /(,[^=]+=)[^,]+(,this\.\w+&&)/, "$1 '#009da6' $2");
  b.replace("Leaderboard", /(\w\.\w{2}),\w\(\)\.\w{2},\w\(\)\.\w{2},\w\(\)\.\w{2}\)\)\,(this.\w{2}\+\d{2}),/, "$1, 17, \"#59a8c9\", \"#2d7796\")), $2,");
  b.replace("Map Color", /"#fff"/, "\"#fff\"");
  b.replace("Indicators", /(\(\w+\.\w+\+\w+,\w+\.\w+\+\w+\).+?\w+\(\).+?\w+\.\w+\.\w+\)([,;]))/, "\n        " + c[1].slice(0, -c[2].length - 1) + ";\n        " + c[2] + ";\n        Hooks.Indicators(...arguments);\n    ");
  b.replace("Health Color & Visuals", /"#04c213":"#c20d04"/, "'#121212' : '#121212',\n\n        Hooks.Tracers(...arguments)\n        Hooks.PlaceHelper(...arguments)\n    ");
  const i = {
    values: h
  };
  Object.assign(window, i);
  return b.code;
}
function Z() {
  ca.loaded = true;
  const a = s.newElement("style", [], "", "", undefined, q.Global_CSS);
  const b = s.newElement("div", [], "", "menu-holder", undefined, q.Menu_HTML, q.Menu_CSS);
  const c = s.newElement("div", [], "", "tooltip", undefined, "This is the tooltip, shows you up a help text");
  const d = s.newElement("div", [], "", "radar-ui", undefined, q.Radar_HTML);
  document.querySelector("#settings").children[0].src = "https://i.imgur.com/LhafJ4l.png";
  document.head.appendChild(a);
  document.body.appendChild(d);
  document.body.appendChild(c);
  document.body.appendChild(b);
  $(".menu-sector").draggable();
  q.setSwitchs();
  q.setVisuals();
  q.setCombats();
  q.setMiscs();
  q.setChats();
  ea.initialize();
  fa.listeners();
  document.title = "phantom";
}
const aa = {
  "/entity/health-gauge-background.png": "https://i.imgur.com/yDcbdRA.png",
  "/entity/health-gauge-front.png": "https://i.imgur.com/UiEWfBX.png",
  "/ui/indicator_enemy.png": "https://i.imgur.com/zsuhbel.png",
  "/entity/our_dot.png": "https://i.imgur.com/hXNNEb6.png"
};
const ba = Object.getOwnPropertyDescriptor(Image.prototype, "src").set;
Object.defineProperty(Image.prototype, "src", {
  set(a) {
    const b = Object.entries(aa).find(([b]) => a.includes(b));
    if (b) {
      a = b[1];
    }
    return ba.call(this, a);
  }
});
window.eval = new Proxy(window.eval, {
  apply(a, b, c) {
    const d = c[0];
    if (d.length > 100000) {
      c[0] = Y(d);
      window.eval = a;
    }
    return a.apply(b, c);
  }
});
window.WebSocket = new Proxy(window.WebSocket, {
  construct(a, b) {
    const c = new a(...b);
    da.setWS(c, b[0]);
    return c;
  }
});
document.addEventListener("DOMContentLoaded", () => {
  if (!ca.loaded) {
    Z();
  }
});
document.addEventListener("mousemove", a => {
  ca.mouse.x = a.clientX;
  ca.mouse.y = a.clientY;
});
document.addEventListener("keydown", a => {
  const b = a.keyCode;
  if (b == 27) {
    const a = document.querySelector(".menu-holder");
    const b = a.style.display !== "block" ? "block" : "none";
    a.style.display = b;
  }
  if (["clan-menu-clan-name-input", "nickname", "chat"].includes(document.activeElement.id)) {
    return;
  }
  if ([50, 49].includes(b)) {
    const a = 51 - b;
    da.old_weapon = a % 2;
  }
  for (let c in ga) {
    ga[c].start(b);
  }
});
document.addEventListener("keyup", a => {
  if (["clan-menu-clan-name-input", "nickname", "chat"].includes(document.activeElement.id)) {
    return;
  }
  for (let b in ga) {
    ga[b].stop(a.keyCode);
  }
});
const ca = new r();
const da = new t();
const ea = new v();
const fa = new w();
const ga = {
  spike: new x(4, 86, 30),
  trap: new x(7, 70, 30),
  heal: new x(2, 81, 30)
};
const ha = {
  Vars: ca,
  Tools: s,
  MenuTools: q,
  Client: da,
  Hooks: u,
  Radar: ea,
  Mouse: fa
};
Object.assign(window, ha);