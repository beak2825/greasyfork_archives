// ==UserScript==
// @name          unknown
// @version       v2.1
// @author        Aethryon
// @description   updates, more updates.
// @grant         none
// @run-at        document-start
// @icon          data:image/png;base64,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
// @require       https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require       https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @match         *://sploop.io/*
// @namespace https://greasyfork.org/users/738839
// @downloadURL https://update.greasyfork.org/scripts/513265/unknown.user.js
// @updateURL https://update.greasyfork.org/scripts/513265/unknown.meta.js
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
const m = " unknown 2.1 ";
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
    const a = "\n            <span class=\"menu-title-version\" style=\"position: fixed; bottom: 0px\">\n                " + m + "\n            </span>\n\n            <div class=\"menu-sector\">\n                <div class=\"menu-title-holder\">\n                    <span class=\"menu-title-icon\">\n                        unknown 2.1\n                    </span>\n\n                    <span class=\"menu-title-version\">\n                        \n                    </span>\n                </div>\n\n                <div class=\"menu-body\"></div>\n            </div>\n\n            <div id=\"Visuals\" class=\"menu-sector\" style=\"left: 22vw\">\n                <div class=\"menu-header\">\n                    <span class=\"menu-title\">\n                        Visuals\n                    </span>\n\n                    <i class=\"menu-icon menu-icon-touchable pointer bi bi-chevron-down\" onclick=\"MenuTools.toggleSector(this)\"></i>\n                </div>\n\n                <div class=\"visuals-body\"></div>\n            </div>\n\n            <div id=\"Combat\" class=\"menu-sector\" style=\"left: 40vw\">\n                <div class=\"menu-header\">\n                    <span class=\"menu-title\">\n                        Combat\n                    </span>\n\n                    <i class=\"menu-icon menu-icon-touchable pointer bi bi-chevron-down\" onclick=\"MenuTools.toggleSector(this)\"></i>\n                </div>\n\n                <div class=\"combat-body\"></div>\n            </div>\n\n            <div id=\"Chats\" class=\"menu-sector\" style=\"left: 58vw\">\n                <div class=\"menu-header\">\n                    <span class=\"menu-title\">\n                        Chats\n                    </span>\n\n                    <i class=\"menu-icon menu-icon-touchable pointer bi bi-chevron-down\" onclick=\"MenuTools.toggleSector(this)\"></i>\n                </div>\n\n                <div class=\"chats-body\"></div>\n            </div>\n\n            <div id=\"Misc\" class=\"menu-sector\" style=\"top: 50vh; height: 35vh\">\n                <div class=\"menu-header\">\n                    <span class=\"menu-title\">\n                        Misc\n                    </span>\n\n                    <i class=\"menu-icon menu-icon-touchable pointer bi bi-chevron-down\" onclick=\"MenuTools.toggleSector(this)\"></i>\n                </div>\n\n                <div class=\"misc-body\"></div>\n            </div>\n        ";
    return a;
  }
  static get Menu_CSS() {
    const a = `background-color: rgb(12 1 26 / 0); position: fixed; display: none; height: 100%; z-index: 10; width: 100%; left: 0px; top: 0px; backdrop-filter: blur(5px);`;
    return a;
  }
  static get Global_CSS() {
    const a = "\n            @import url(\"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.0/font/bootstrap-icons.css\");\n            @import url('https://fonts.cdnfonts.com/css/summer-farmhouse');\n            @import url('https://fonts.cdnfonts.com/css/expletus-sans-2');\n            @import url('https://fonts.cdnfonts.com/css/bastian-script');\n            @import url('https://fonts.cdnfonts.com/css/sofia-sans');\n\n            :root {\n --main-color: #3a5c88; --darker-color: #2e4a71; --lighter-color: #4b739f; --main-color-lighter: #5a86b1; --darker-color-lighter: #406593; --lighter-color-lighter: #6c9bc2; --main-color-strong: #486b9a; --darker-color-strong: #36557e; --lighter-color-strong: #5d83b1; --dark-text: #4b6b8e; --border-color: #587da1; --border-color-hover: #6991b5; --transparent-shadow: #0000005f;\n}\n            * {\n                transition-duration: .5s\n            }\n\n            .pointer,\n            .pointer * {\n                cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;\n            }\n\n            .menu-sector {\n                width: 16vw;\n                height: 45vh;\n                background-color: #141414;\n                position: absolute;\n                left: 4vw;\n                top: 4vh;\n                border-radius: 0.4vw;\n                display: flex;\n                flex-direction: column;\n                align-items: flex-start;\n                overflow: hidden;\n                transition-duration: 0s\n            }\n\n            .menu-sector.open {\n                height: 5.4vh !important\n            }\n\n            .visuals-body,\n            .combat-body,\n            .chats-body,\n            .misc-body {\n                width: -webkit-fill-available;\n            }\n\n            .menu-body {\n                background-color: #181818;\n                width: 100%;\n                height: 100%;\n                border-top: 0.5vh solid #212121\n            }\n\n            .menu-header {\n                display: flex;\n                justify-content: space-between;\n                flex-direction: row;\n                width: -webkit-fill-available;\n                background: black;\n                height: 5.4vh\n            }\n\n            .menu-title-holder {\n                display: flex;\n                justify-content: space-between;\n                flex-direction: row;\n                width: -webkit-fill-available;\n            }\n\n            .menu-title {\n                color: black;\n                font-family: 'Sofia Sans', sans-serif;\n                font-weight: normal;\n                margin: 2vh;\n                margin-top: 1vh;\n                margin-bottom: 1vh;\n                font-size: 1.5vw;\n            }\n\n            .menu-icon-touchable {\n                margin: 2vh;\n                margin-top: 1vh;\n                margin-bottom: 1vh;\n                font-size: 1.5vw;\n                color: black\n            }\n\n            .menu-title-icon,\n            .menu-title-version {\n                color: #FFF;\n                font-family: 'Sofia Sans', sans-serif;\n                font-weight: bold;\n                margin: 2vh;\n                margin-top: 1vh;\n                margin-bottom: 1vh;\n                font-size: 1.5vw;\n            }\n\n            .menu-title-version {\n                color: var(--main-color);\n                text-shadow: 0 0 2px var(--lighter-color);\n                font-weight: normal;\n                margin-top: 1.3vh;\n                font-size: 1.3vw;\n            }\n\n            .menu-icon {\n                color: black;\n            }\n\n            .menu-text-holder {\n                display: flex;\n                align-items: center;\n                color: var(--main-color);\n                font-weight: 400;\n            }\n\n            .menu-text-icon::before {\n                margin-bottom: 0.2vh;\n                margin-right: .4vw\n            }\n\n            .menu-text {\n                font-family: 'Expletus Sans', sans-serif;\n                font-weight: normal;\n            }\n\n            .menu-input {\n                outline: none;\n                padding: 1vh;\n                cursor: url(img/ui/cursor-text.png) 16 0, text;\n                background-color: #060606;\n                color: var(--main-color);\n                border: 0px;\n                width: -webkit-fill-available;\n                margin: 1.5vh 1vw 0px 1vw;\n                border-radius: .8vh;\n            }\n\n            .menu-button {\n                color: var(--main-color);\n                display: flex;\n                flex-direction: row;\n                align-items: center;\n                justify-content: space-between;\n                width: -webkit-fill-available;\n                padding: 1vh\n            }\n\n            .menu-button:hover {\n                background-color: black\n            }\n\n            .menu-button:active {\n                background-color: #161616\n            }\n\n            .menu-button.active {\n                background-color: var(--main-color);\n            }\n\n            .menu-button.active * {\n                color: white;\n            }\n\n            #skin-message, #left-content, #game-bottom-content, #game-left-content-main, #game-right-content-main, #cross-promo, #right-content, #new-changelog {\n                display: none !important\n            }\n\n            #background-cosmetic-container {\n                background: var(--lighter-color-lighter)\n            }\n\n            #main-content {\n                background: rgb(0, 0, 0 / 80%);\n                width: max-content\n            }\n\n            #homepage {\n                background-color: var(--transparent-shadow);\n                padding-bottom: 5vh;\n            }\n\n            #skins-categories {\n                margin-right: .4vw;\n                margin-left: .4vw;\n            }\n\n            #play,\n            .blue-button,\n            .green-button,\n            .dark-blue-button,\n            .unlock-button-active {\n                background-color: var(--main-color);\n                box-shadow: inset 0 -5px 0 var(--darker-color);\n            }\n\n            #play:hover,\n            .blue-button:hover,\n            .green-button:hover,\n            .dark-blue-button:hover,\n            .unlock-button-active:hover {\n                background-color: var(--main-color-lighter);\n                box-shadow: inset 0 -5px 0 var(--darker-color-lighter);\n            }\n\n            #play:active,\n            .blue-button:active,\n            .green-button:active,\n            .dark-blue-button:active,\n            .unlock-button-active:active {\n                background-color: var(--main-color);\n                box-shadow: inset 0 5px 0 var(--darker-color);\n            }\n\n            .dark-blue-button-2-active {\n                background-color: var(--main-color);\n                box-shadow: inset 0 5px 0 var(--darker-color);\n                border-color: var(--border-color)\n            }\n\n            .dark-blue-button-2-active:hover {\n                background-color: var(--main-color-lighter);\n                box-shadow: inset 0 5px 0 var(--darker-color-lighter);\n                border-color: var(--border-color-hover)\n            }\n\n            .skins-button {\n                border-color: var(--border-color)\n            }\n\n            .skin,\n            .skin-active:hover {\n                background: transparent;\n                border-radius: 14px;\n                border: unset;\n                box-shadow: 0px 0px 4px 2px var(--main-color);\n            }\n\n            .skin:hover {\n                background-color: transparent;\n                box-shadow: 0px 0px 6px 5px var(--lighter-color)\n            }\n\n            .nav-button-active {\n                color: var(--main-color)\n            }\n\n            .nav-button-text:hover {\n                color: var(--darker-color)\n            }\n\n            .middle-main {\n                background: rgb(163 136 155 / 30%);\n                border: 5px solid transparent;\n                box-shadow: unset !important\n            }\n\n            #small-waiting {\n                background: transparent;\n            }\n\n            #ranking2-middle-main {\n                height: 246px;\n                margin-left: 1vw;\n            }\n\n            #ranking-title {\n                background: var(--main-color)\n            }\n\n            .table-line:hover,\n            .side-button:hover {\n                background: var(--lighter-color)\n            }\n\n            .side-button {\n                background: var(--darker-color)\n            }\n\n            #nav {\n                opacity: 0\n            }\n\n            #nav:hover {\n                opacity: 1\n            }\n\n            #nickname {\n                width: 170px\n            }\n\n            #server-select {\n                margin-left: .2vw\n            }\n\n            .input {\n                background: var(--main-color);\n                border: 5px solid var(--darker-color);\n                border-radius: 16px;\n                box-shadow: inset 0 23px 0 var(--darker-color-lighter)\n            }\n\n            #ffa-mode,\n            #sandbox-mode,\n            #play {\n                border: 5px solid var(--darker-color);\n                border-radius: 16px;\n                box-shadow: inset 0 -5px 0 var(--darker-color-lighter)\n            }\n\n            #ffa-mode,\n            #sandbox-mode {\n                width: 165px !important\n            }\n\n            #event-mode {\n                display: none\n            }\n\n            .background-img-play {\n                background: url() 0 0 repeat\n            }\n\n            #server-select,\n            #server-select:hover,\n            #server-select:active {\n                border: 5px solid var(--darker-color-strong);\n                border-radius: 15px;\n                background: var(--lighter-color-strong);\n                box-shadow: inset 0 -6px 0 0 var(--main-color-strong);\n                color: #fff\n            }\n\n            .active-bar-item {\n                position: fixed;\n                left: 35.4vw;\n                bottom: 0.53vh;\n                width: 5.4vw;\n                height: 10.9vh;\n                border: 0.35vw solid var(--darker-color-lighter);\n                border-radius: 0.9vw\n            }\n\n               .chat-container input { color: cyan; text-align: center; background-color: #000000ba; box-shadow: none; width: 315px; }\n            .tooltip {\n                position: fixed;\n                width: max-content;\n                height: 4.5vh;\n                font-size: 1.1vw;\n                padding: 1vh;\n                color: var(--main-color);\n                background-color: #0c0c0c;\n                border-radius: .25vw;\n                top: 20vw;\n                left: 17vw;\n                z-index: 1000000000000000000000;\n                pointer-events: none;\n                opacity: 0\n            }\n\n            .radar-ui {\n                position: fixed;\n                opacity: 0;\n                top: 2vh;\n                left: 1vw;\n                width: 12vw;\n                height: 24vh;\n                background-color: #003300ad;\n                pointer-events: none;\n                border-radius: 14vw;\n                display: flex;\n                align-items: center;\n                overflow: hidden;\n                justify-content: center\n            }\n\n            .radar-canvas {\n                width: 200%;\n                height: 100%;\n            }\n        ";
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
        fill: "#3774de",
        stroke: "#4072c9"
      },
      ally: {
        fill: "#3a7fbf",
        stroke: "#397bed"
      },
      enemy: {
        fill: "#8a1e1e",
        stroke: "#a62828"
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
    if (X[1].enabled && this.packets >= b) {
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
  place(a, b = Mouse.angle) {
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
      const steps = 6; // Number of steps, adjust for accuracy
      const angleIncrement = Math.PI * 2 / steps; // Calculate angle increment

      for (let i = 0; i < steps; i++) {
          const angle = -b + (i * angleIncrement); // Calculate angle
          const delay = (i / steps) * 400; // Total delay (400ms for all)
          setTimeout(() => {
              this.place(7, angle);
          }, delay);
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
      this.equip(11);
      this.hit(b);
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
      if (O[4].enabled && ca.enemy && !b) {
        const b = ca.entities.filter(a => a && a.type == 0 && a.hat == 2 && !this.mine(a) && n.includes(a.weapon) && s.distance(this, a) < 180);
        const c = this.hat != 4 || a != 4;
        if (b.length != 0 && c && !e) {
          a = 4;
          ca.oldDetectingInsta = true;
        }
      }
    }
// Auto-spike
if (O[5].enabled && ca.enemy) {
    const angle = s.direction(ca.enemy, this);
    const dist = document.querySelector("#chat-2").value;
    const distanceToEnemy = s.distance(ca.enemy, this);
    if (distanceToEnemy <= dist) {
        const angleThreshold = 10;
        const playerAngle = s.direction(this, ca.enemy);
        const angleDifference = Math.abs(playerAngle - angle);

        // Ensure the angle difference is within the threshold
        if (angleDifference <= angleThreshold) {
            this.place(4, angle);
        }
    }
}
//auto insta
if (ca.enemy && s.distance(ca.enemy, this) <= 200 && ca.enemy.health <= 50) {
  const angle = s.direction(ca.enemy, this);
    this.equip(2);
    this.select(0);
    this.hit(angle);
    this.select(1);
}



if (O[7].enabled && ca.enemy && s.distance(this, ca.enemy) <= 130 && ca.enemy.hat != 4 && ca.enemy.hat != 6) {
  const trap = ca.entities.find(a => a && s.distance(a, ca.enemy) <= 70 && a.type == 6);
  if (!trap) {
    const angle = s.direction(ca.enemy, this);
    this.place(4, angle);
    this.select(0);
    this.equip(2);
    this.hit(angle);
    this.select(1);
  }
}


// Select the checkboxes for ping and grid
const pingCheckbox = document.querySelector('#display-ping-toggle');
const gridCheckbox = document.querySelector('#grid-toggle');
    if (!pingCheckbox.checked) {
        pingCheckbox.click();
    }
    if (gridCheckbox.checked) {
        gridCheckbox.click();
    }



// Auto-Attack
const dist = document.querySelector("#chat-1").value;
if (O[6].enabled && ca.enemy && s.distance(ca.enemy, this) <= dist) {
  const trap = ca.entities.find(a => a && s.distance(a, this) <= 70 && a.type == 6 && !this.mine(a));
  const angle = s.direction(ca.enemy, this);
  if (trap) {
    console.log("trap");
  } else {
  this.select(0);
  this.hit(angle);
  }
}

//Auto heal
      if (this.health < 100 && O[0].enabled) {
        if (this.health < 36 && !b) {
          a = 4;
        }
          this.place(2);
      }
if (!d) {
// Placer
ca.angles = [];
if (ca.enemy && O[2].enabled) {
  const nearestEntity = ca.entities.find(a =>
    a && s.distance(a, ca.enemy) < 60 && a.type === 6 && this.mine(a)
  );

  const distanceToEnemy = s.distance(this, ca.enemy);
  const headingDirection = s.direction(ca.enemy, this);
  const distanceThreshold = document.querySelector("#chat-0").value;

  if (distanceToEnemy <= distanceThreshold) {
    const angleSpread = Math.PI; // Spread angle (180 degrees)
    const angleCount = 2; // Number of angles to calculate (front and back)

    if (nearestEntity) {
      // Calculate angles for both front and back
      ca.angles = Array.from({ length: angleCount }, (_, i) =>
        headingDirection + (i === 0 ? 0 : Math.PI) // 0 for front, Math.PI for back
      );

      // Place at the first angle (front)
      this.place(4, ca.angles[0]); // Place in front

      // Schedule placement for the second angle (back)
      setTimeout(() => {
        this.place(4, ca.angles[1]); // Place behind
      }, 90); // Delay for the back placement
    } else {
      // If no nearest entity, place at the heading direction
      ca.angles = [headingDirection];
      this.place(7, headingDirection); // Place in the direction
      }
    }
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
    if (c.type === p.upgrades && X[0].enabled) {
      const a = [0, 12, 9, 19, 20, 15, 8, 17, 16];
      for (let b = 0; b < a.length; b++) {
        if (c[1].indexOf(a[b]) != -1) {
          this.choose(a[b]);
          this.autoselect(a[b]);
        }
      }
    }
    if (c.type === p.killed) {
      this.kills++;
        this.chat(" Kneel! ");
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
  enabled: false
}, {
  name: "Night mode",
  title: "Renders the game in night mode",
  enabled: false
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
  name: "Auto insta",
  title: "Auto insta - invis",
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
  name: "Auto upgrade",
  title: "Automatically upgrades for you to play (KH)",
  enabled: true
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
  b.replace("Map Color", /"#fff"/, "\"#fff\"");
  b.replace("Health Color & Visuals", /"#a4cc4f":"#cc5151"/, "'#397bed' : '#cc5151',\n\n        Hooks.Tracers(...arguments)\n        Hooks.PlaceHelper(...arguments)\n    ");
  b.replace("Indicators", /(\(\w+\.\w+\+\w+,\w+\.\w+\+\w+\).+?\w+\(\).+?\w+\.\w+\.\w+\)([,;]))/, "\n        " + c[1].slice(0, -c[2].length - 1) + ";\n        " + c[2] + ";\n        Hooks.Indicators(...arguments);\n    ");
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
  document.title = "unknown";
}
const aa = {
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
  spike: new x(4, 86, 35),
  trap: new x(7, 70, 35),
  heal: new x(2, 81, 35),
  mill: new x(5, 78, 35),
  platform: new x(8, 72, 35)
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