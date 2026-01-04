// ==UserScript==
// @name          xanax [PREMIUM]
// @version       2MG
// @author        _._jeanne_._
// @description   why take 1mg when you can take 2?
// @grant         none
// @run-at        document-start
// @require       https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require       https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @match         *://sploop.io/*
// @namespace https://greasyfork.org/users/1326893
// @downloadURL https://update.greasyfork.org/scripts/499618/xanax%20%5BPREMIUM%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/499618/xanax%20%5BPREMIUM%5D.meta.js
// ==/UserScript==

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
const m = "Premium";
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
    const a = "\n            <span class=\"menu-title-version\" style=\"position: fixed; bottom: 0px\">\n                " + m + "\n            </span>\n\n            <div class=\"menu-sector\">\n                <div class=\"menu-title-holder\">\n                    <span class=\"menu-title-icon\">\n                        XANAX\n                    </span>\n\n                    <span class=\"menu-title-version\">\n                        2MG\n                    </span>\n                </div>\n\n                <div class=\"menu-body\"></div>\n            </div>\n\n            <div id=\"Visuals\" class=\"menu-sector\" style=\"left: 22vw\">\n                <div class=\"menu-header\">\n                    <span class=\"menu-title\">\n                        Visuals\n                    </span>\n\n                    <i class=\"menu-icon menu-icon-touchable pointer bi bi-chevron-down\" onclick=\"MenuTools.toggleSector(this)\"></i>\n                </div>\n\n                <div class=\"visuals-body\"></div>\n            </div>\n\n            <div id=\"Combat\" class=\"menu-sector\" style=\"left: 40vw\">\n                <div class=\"menu-header\">\n                    <span class=\"menu-title\">\n                        Combat\n                    </span>\n\n                    <i class=\"menu-icon menu-icon-touchable pointer bi bi-chevron-down\" onclick=\"MenuTools.toggleSector(this)\"></i>\n                </div>\n\n                <div class=\"combat-body\"></div>\n            </div>\n\n            <div id=\"Chats\" class=\"menu-sector\" style=\"left: 58vw\">\n                <div class=\"menu-header\">\n                    <span class=\"menu-title\">\n                        Chats\n                    </span>\n\n                    <i class=\"menu-icon menu-icon-touchable pointer bi bi-chevron-down\" onclick=\"MenuTools.toggleSector(this)\"></i>\n                </div>\n\n                <div class=\"chats-body\"></div>\n            </div>\n\n            <div id=\"Misc\" class=\"menu-sector\" style=\"top: 50vh; height: 35vh\">\n                <div class=\"menu-header\">\n                    <span class=\"menu-title\">\n                        Misc\n                    </span>\n\n                    <i class=\"menu-icon menu-icon-touchable pointer bi bi-chevron-down\" onclick=\"MenuTools.toggleSector(this)\"></i>\n                </div>\n\n                <div class=\"misc-body\"></div>\n            </div>\n        ";
    return a;
  }
  static get Menu_CSS() {
    const a = "\n            background-color: rgb(0 0 0 / .5);\n            position: fixed;\n            display: none;\n            height: 100%;\n            z-index: 10;\n            width: 100%;\n            left: 0px;\n            top: 0px;\n        ";
    return a;
  }
  static get Global_CSS() {
    const a = "\n            @import url(\"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.0/font/bootstrap-icons.css\");\n            @import url('https://fonts.cdnfonts.com/css/summer-farmhouse');\n            @import url('https://fonts.cdnfonts.com/css/expletus-sans-2');\n            @import url('https://fonts.cdnfonts.com/css/bastian-script');\n            @import url('https://fonts.cdnfonts.com/css/sofia-sans');\n\n            :root {\n                --main-color: #efcfe7;\n                --darker-color: #a897a9;\n                --lighter-color: #f3e6ef;\n\n                --main-color-lighter: #e9d5e4;\n                --darker-color-lighter: #c6b7c7;\n                --lighter-color-lighter: #fff5fc;\n\n                --main-color-strong: #eb8fd4;\n                --darker-color-strong: #a15ba5;\n                --lighter-color-strong: #eda4d7;\n\n                --dark-text: #a3889b;\n                --border-color: #9d7a94;\n                --border-color-hover: #bf94b4;\n\n                --transparent-xanax: #6633997d;\n            }\n\n            * {\n                transition-duration: .5s\n            }\n\n            .pointer,\n            .pointer * {\n                cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;\n            }\n\n            .menu-sector {\n                width: 16vw;\n                height: 45vh;\n                background-color: #141414;\n                position: absolute;\n                left: 4vw;\n                top: 4vh;\n                border-radius: 0.4vw;\n                display: flex;\n                flex-direction: column;\n                align-items: flex-start;\n                overflow: hidden;\n                transition-duration: 0s\n            }\n\n            .menu-sector.open {\n                height: 5.4vh !important\n            }\n\n            .visuals-body,\n            .combat-body,\n            .chats-body,\n            .misc-body {\n                width: -webkit-fill-available;\n            }\n\n            .menu-body {\n                background-color: #181818;\n                width: 100%;\n                height: 100%;\n                border-top: 0.5vh solid #212121\n            }\n\n            .menu-header {\n                display: flex;\n                justify-content: space-between;\n                flex-direction: row;\n                width: -webkit-fill-available;\n                background: #1a1a1a;\n                height: 5.4vh\n            }\n\n            .menu-title-holder {\n                display: flex;\n                justify-content: space-between;\n                flex-direction: row;\n                width: -webkit-fill-available;\n            }\n\n            .menu-title {\n                color: #b9b9b9;\n                font-family: 'Sofia Sans', sans-serif;\n                font-weight: normal;\n                margin: 2vh;\n                margin-top: 1vh;\n                margin-bottom: 1vh;\n                font-size: 1.5vw;\n            }\n\n            .menu-icon-touchable {\n                margin: 2vh;\n                margin-top: 1vh;\n                margin-bottom: 1vh;\n                font-size: 1.5vw;\n                color: #b9b9b9\n            }\n\n            .menu-title-icon,\n            .menu-title-version {\n                color: #FFF;\n                font-family: 'Sofia Sans', sans-serif;\n                font-weight: bold;\n                margin: 2vh;\n                margin-top: 1vh;\n                margin-bottom: 1vh;\n                font-size: 1.5vw;\n            }\n\n            .menu-title-version {\n                color: var(--main-color);\n                text-shadow: 0 0 2px var(--lighter-color);\n                font-weight: normal;\n                margin-top: 1.3vh;\n                font-size: 1.3vw;\n            }\n\n            .menu-icon {\n                color: #626262;\n            }\n\n            .menu-text-holder {\n                display: flex;\n                align-items: center;\n                color: var(--main-color);\n                font-weight: 400;\n            }\n\n            .menu-text-icon::before {\n                margin-bottom: 0.2vh;\n                margin-right: .4vw\n            }\n\n            .menu-text {\n                font-family: 'Expletus Sans', sans-serif;\n                font-weight: normal;\n            }\n\n            .menu-input {\n                outline: none;\n                padding: 1vh;\n                cursor: url(img/ui/cursor-text.png) 16 0, text;\n                background-color: #060606;\n                color: var(--main-color);\n                border: 0px;\n                width: -webkit-fill-available;\n                margin: 1.5vh 1vw 0px 1vw;\n                border-radius: .8vh;\n            }\n\n            .menu-button {\n                color: var(--main-color);\n                display: flex;\n                flex-direction: row;\n                align-items: center;\n                justify-content: space-between;\n                width: -webkit-fill-available;\n                padding: 1vh\n            }\n\n            .menu-button:hover {\n                background-color: #1e1e1e\n            }\n\n            .menu-button:active {\n                background-color: #161616\n            }\n\n            .menu-button.active {\n                background-color: var(--main-color);\n            }\n\n            .menu-button.active * {\n                color: white;\n            }\n\n            #skin-message, #left-content, #game-bottom-content, #game-left-content-main, #game-right-content-main, #cross-promo, #right-content, #new-changelog {\n                display: none !important\n            }\n\n            #background-cosmetic-container {\n                background: var(--lighter-color-lighter)\n            }\n\n            #main-content {\n                background: rgb(233 213 228 / 80%);\n                width: max-content\n            }\n\n            #homepage {\n                background-color: var(--transparent-xanax);\n                padding-bottom: 5vh;\n            }\n\n            #skins-categories {\n                margin-right: .4vw;\n                margin-left: .4vw;\n            }\n\n            #play,\n            .blue-button,\n            .green-button,\n            .dark-blue-button,\n            .unlock-button-active {\n                background-color: var(--main-color);\n                box-shadow: inset 0 -5px 0 var(--darker-color);\n            }\n\n            #play:hover,\n            .blue-button:hover,\n            .green-button:hover,\n            .dark-blue-button:hover,\n            .unlock-button-active:hover {\n                background-color: var(--main-color-lighter);\n                box-shadow: inset 0 -5px 0 var(--darker-color-lighter);\n            }\n\n            #play:active,\n            .blue-button:active,\n            .green-button:active,\n            .dark-blue-button:active,\n            .unlock-button-active:active {\n                background-color: var(--main-color);\n                box-shadow: inset 0 5px 0 var(--darker-color);\n            }\n\n            .dark-blue-button-2-active {\n                background-color: var(--main-color);\n                box-shadow: inset 0 5px 0 var(--darker-color);\n                border-color: var(--border-color)\n            }\n\n            .dark-blue-button-2-active:hover {\n                background-color: var(--main-color-lighter);\n                box-shadow: inset 0 5px 0 var(--darker-color-lighter);\n                border-color: var(--border-color-hover)\n            }\n\n            .skins-button {\n                border-color: var(--border-color)\n            }\n\n            .skin,\n            .skin-active:hover {\n                background: transparent;\n                border-radius: 14px;\n                border: unset;\n                box-shadow: 0px 0px 4px 2px var(--main-color);\n            }\n\n            .skin:hover {\n                background-color: transparent;\n                box-shadow: 0px 0px 6px 5px var(--lighter-color)\n            }\n\n            .nav-button-active {\n                color: var(--main-color)\n            }\n\n            .nav-button-text:hover {\n                color: var(--darker-color)\n            }\n\n            .middle-main {\n                background: rgb(163 136 155 / 30%);\n                border: 5px solid transparent;\n                box-shadow: unset !important\n            }\n\n            #small-waiting {\n                background: transparent;\n            }\n\n            #ranking2-middle-main {\n                height: 246px;\n                margin-left: 1vw;\n            }\n\n            #ranking-title {\n                background: var(--main-color)\n            }\n\n            .table-line:hover,\n            .side-button:hover {\n                background: var(--lighter-color)\n            }\n\n            .side-button {\n                background: var(--darker-color)\n            }\n\n            #nav {\n                opacity: 0\n            }\n\n            #nav:hover {\n                opacity: 1\n            }\n\n            #nickname {\n                width: 170px\n            }\n\n            #server-select {\n                margin-left: .2vw\n            }\n\n            .input {\n                background: var(--main-color);\n                border: 5px solid var(--darker-color);\n                border-radius: 16px;\n                box-shadow: inset 0 23px 0 var(--darker-color-lighter)\n            }\n\n            #ffa-mode,\n            #sandbox-mode,\n            #play {\n                border: 5px solid var(--darker-color);\n                border-radius: 16px;\n                box-shadow: inset 0 -5px 0 var(--darker-color-lighter)\n            }\n\n            #ffa-mode,\n            #sandbox-mode {\n                width: 165px !important\n            }\n\n            #event-mode {\n                display: none\n            }\n\n            .background-img-play {\n                background: url(https://i.imgur.com/Lq4Ap6p.png) 0 0 repeat\n            }\n\n            #server-select,\n            #server-select:hover,\n            #server-select:active {\n                border: 5px solid var(--darker-color-strong);\n                border-radius: 15px;\n                background: var(--lighter-color-strong);\n                box-shadow: inset 0 -6px 0 0 var(--main-color-strong);\n                color: #fff\n            }\n\n            .active-bar-item {\n                position: fixed;\n                left: 35.4vw;\n                bottom: 0.53vh;\n                width: 5.4vw;\n                height: 10.9vh;\n                border: 0.35vw solid var(--darker-color-lighter);\n                border-radius: 0.9vw\n            }\n\n            .chat-container input {\n                background-color: var(--main-color);\n                border: 4px solid var(--darker-color);\n                padding: 5px;\n                padding-bottom: 0px;\n                box-shadow: unset;\n                font-family: \"\", Courier;\n                font-size: 2vw;\n                color: var(--darker-color);\n                letter-spacing: 2px\n            }\n\n            .chat-container input:placeholder {\n                color: var(--darker-color)\n            }\n\n            .chat-container input.text-shadowed-3 {\n                text-shadow: unset !important\n            }\n\n            .tooltip {\n                position: fixed;\n                width: max-content;\n                height: 4.5vh;\n                font-size: 1.1vw;\n                padding: 1vh;\n                color: var(--main-color);\n                background-color: #0c0c0c;\n                border-radius: .25vw;\n                top: 20vw;\n                left: 17vw;\n                z-index: 1000000000000000000000;\n                pointer-events: none;\n                opacity: 0\n            }\n\n            .radar-ui {\n                position: fixed;\n                opacity: 0;\n                top: 2vh;\n                left: 1vw;\n                width: 12vw;\n                height: 24vh;\n                background-color: #003300ad;\n                pointer-events: none;\n                border-radius: 14vw;\n                display: flex;\n                align-items: center;\n                overflow: hidden;\n                justify-content: center\n            }\n\n            .radar-canvas {\n                width: 200%;\n                height: 100%;\n            }\n        ";
    return a;
  }
  static setSwitchs() {
    var a = "";
    for (let b = 0; b < D.length; b++) {
      const c = D[b];
      a += "\n            <div class=\"menu-button " + (c.name === "Support" ? "" : "active") + " pointer\" onclick='" + (c.name === "Support" ? "window.open(\"https://www.youtube.com/@Jeanne_airmax\")" : "MenuTools.enableCard(this, " + b + ")") + "' onmouseover=\"MenuTools.title('" + c.title + "')\" onmouseleave=\"MenuTools.titleout()\">\n                <div class=\"menu-text-holder\">\n                    <div>\n                        <i class=\"menu-text-icon " + c.icon + "\"></i>\n                    </div>\n                    <span class=\"menu-text\"> " + c.name + " </span>\n                </div>\n\n                <i class=\"menu-icon bi bi-chevron-right\"></i>\n            </div>\n            ";
    }
    $(".menu-body")[0].innerHTML = a;
  }
  static setVisuals() {
    var a = "";
    for (let b = 0; b < I.length; b++) {
      const c = I[b];
      a += "\n            <div class=\"menu-button active pointer\" onclick=\"MenuTools.toggleFeature(this, " + b + ")\" onmouseover=\"MenuTools.title('" + c.title + "')\" onmouseleave=\"MenuTools.titleout()\">\n                <span class=\"menu-text\"> " + c.name + " </span>\n\n                <i class=\"menu-icon bi bi-three-dots-vertical\"></i>\n            </div>";
    }
    $(".visuals-body")[0].innerHTML = a;
  }
  static setCombats() {
    var a = "";
    for (let b = 0; b < O.length; b++) {
      const c = O[b];
      a += "\n            <div class=\"menu-button active pointer\" onclick=\"MenuTools.toggleFeatureC(this, " + b + ")\" onmouseover=\"MenuTools.title('" + c.title + "')\" onmouseleave=\"MenuTools.titleout()\">\n                <span class=\"menu-text\"> " + c.name + " </span>\n\n                <i class=\"menu-icon bi bi-three-dots-vertical\"></i>\n            </div>";
    }
    $(".combat-body")[0].innerHTML = a;
  }
  static setMiscs() {
    var a = "";
    for (let b = 0; b < X.length; b++) {
      const c = X[b];
      a += "\n            <div class=\"menu-button active pointer\" onclick=\"MenuTools.toggleFeatureM(this, " + b + ")\" onmouseover=\"MenuTools.title('" + c.title + "')\" onmouseleave=\"MenuTools.titleout()\">\n                <span class=\"menu-text\"> " + c.name + " </span>\n\n                <i class=\"menu-icon bi bi-three-dots-vertical\"></i>\n            </div>";
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
      logo: "https://i.imgur.com/Lq4Ap6p.png"
    };
    this.mouse = {};
    this.angles = [];
    this.entities = [];
    this.mill = Date.now();
    this.packetLimiter = 800;
    this.oldDetectingInsta = false;
    this.colors = {
      own: {
        fill: "#f3e6ef",
        stroke: "#c6b7c7"
      },
      ally: {
        fill: "#e9d5e4",
        stroke: "#c6b7c7"
      },
      enemy: {
        fill: "#eb8fd4",
        stroke: "#a15ba5"
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
    if (X[2].enabled && this.packets >= b) {
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
        this.place(7, -b + c);
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
      const c = this.y > 8000 && this.y < 9000;
      var a = 7;
      const d = ca.entities.find(a => a && s.distance(a, this) < 60 && a.type == 6 && !this.mine(a));
      const e = ca.oldDetectingInsta;
      const f = ca.breaking;
      ca.oldDetectingInsta = false;
      ca.breaking = false;
      if (O[1].enabled && d) {
        if (!f) {
          const a = document.querySelector("#chat-1").value;
          this.quad(d);
          this.chat(a);
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
        if (O[4] && ca.enemy && !b) {
          const b = ca.entities.filter(a => a && a.type == 0 && a.hat == 2 && !this.mine(a) && n.includes(a.weapon) && s.distance(this, a) < 180);
          const c = this.hat != 4 || a != 4;
          if (b.length != 0 && c && !e) {
            const b = document.querySelector("#chat-2").value;
            this.chat(b);
            a = 4;
            ca.oldDetectingInsta = true;
          }
        }
      }
      if (this.health < 100 && O[0].enabled) {
        if (this.health < 36 && !b) {
          a = 4;
        }
        setTimeout(() => {
          this.place(2);
        }, b ? 10 : 30);
      }
      ca.angles = [];
      if (!d) {
        if (ca.enemy && O[2].enabled) {
          const a = ca.entities.find(a => a && s.distance(a, ca.enemy) < 60 && a.type == 6 && this.mine(a));
          const b = s.distance(this, ca.enemy);
          const c = s.direction(ca.enemy, this);
          if (b <= 160) {
            if (a) {
              ca.angles = [c + 0.95993, c - 0.95993];
              this.place(4, ca.angles[0]);
              setTimeout(() => {
                this.place(4, ca.angles[1]);
              }, 90);
            } else {
              ca.angles = [c];
              this.place(7, c);
            }
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
      const a = document.querySelector("#chat-0").value;
      this.kills++;
      if (a.trim() == "") {
        return;
      }
      this.chat(a.replace(/{kills}/g, this.kills));
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
      b.save();
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
      b.restore();
    }
  }
  static Tracers(a, b) {
    if (a[window.values.sid] == da.sid) {
      return da.raw = a;
    }
    if (a.type || !da.raw) {
      return;
    }
    if (!I[2].enabled) {
      return;
    }
    const c = b.fillStyle;
    const d = b.globalAlpha;
    const e = window.values.sid;
    const f = window.values.x;
    const g = window.values.y;
    const h = a[e];
    const i = a[f];
    const j = a[g];
    var k = "enemy";
    if (da.clan.includes(h)) {
      k = "ally";
    }
    if (h == da.sid) {
      k = "own";
    }
    const l = ca.colors[k];
    b.strokeStyle = l.fill;
    b.globalAlpha = 0.6;
    b.lineCap = "round";
    b.beginPath();
    b.moveTo(da.raw[f], da.raw[g]);
    b.lineTo(i, j);
    b.stroke();
    b.closePath();
    b.fillStyle = c;
    b.globalAlpha = d;
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
    b.strokeStyle = "#52ad3a";
    b.shadowColor = "#52ad3a";
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
      b.strokeStyle = "#46a72c";
      b.arc(0, 0, c, 0, Math.PI * 2);
      b.stroke();
      b.closePath();
    }
    b.save();
    b.rotate(fa.angle - 1.5 || 0);
    b.beginPath();
    b.fillStyle = "#4abf2a";
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
        b.fillStyle = "#4abf2a";
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
  name: "Chats",
  icon: "bi bi-chat-left-dots-fill",
  title: "Enable chat config card",
  enabled: true
}, {
  name: "Misc",
  icon: "bi bi-bucket-fill",
  title: "Enable extra config card",
  enabled: true
}, {
  name: "Support",
  icon: "bi bi-youtube",
  title: "Support Jeanne in YouTube for more mods <3",
  enabled: true
}];
const I = [{
  name: "Indicators",
  title: "Shows if the structure is yours / enemy / ally",
  enabled: true
}, {
  name: "Radar",
  title: "Shows up a radar in your screen for the players",
  enabled: true
}, {
  name: "Tracers",
  title: "Render lines to mark the entities",
  enabled: true
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
  title: "Detect if enemy is about to insta then equip crystal gear to prevent it",
  enabled: true
}];
const T = [{
  name: "Kill chat",
  title: "Chat when kill player",
  value: "{kills} Kişi Kuduruyor şuan!"
}, {
  name: "Auto break",
  title: "Chat when auto breaking trap",
  value: "Đừng đặt bẫy tôi, đồ ngốc."
}, {
  name: "Anti insta",
  title: "Chat when insta threat",
  value: "Đó là cách anh giết tôi à?"
}, {
  name: "Packet limit",
  title: "Limit your packets once you get a specific ammout",
  value: "800"
}];
const X = [{
  name: "Auto mill",
  title: "Places mills when you spawn",
  enabled: true
}, {
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
  b.replace("Clan Colors V2", /\w\(\w+\),"#404040"\):null/, "'#f3e6ef', '#c6b7c7') : null");
  b.replace("Age Color", /(\("AGE 0",24,)"#fff"\)/, "$1'#f3e6ef', '#c6b7c7')");
  b.replace("Age Body", /(background\:\w+\(\)\.\w+\([^,]+,[^,]+,[^,]+,)[^)]+\)/, "$1 '#c6b7c7')");
  b.replace("Age Fill", /(,[^=]+=)[^,]+(,this\.\w+&&)/, "$1 '#f3e6ef' $2");
  b.replace("Leaderboard", /(\w\.\w{2}),\w\(\)\.\w{2},\w\(\)\.\w{2},\w\(\)\.\w{2}\)\)\,(this.\w{2}\+\d{2}),/, "$1, 17, \"#f3e6ef\", \"#c6b7c7\")), $2,");
  b.replace("Map Color", /"#788F57"/, "\"#64803d\"");
  b.replace("Indicators", /(\(\w+\.\w+\+\w+,\w+\.\w+\+\w+\).+?\w+\(\).+?\w+\.\w+\.\w+\)([,;]))/, "\n        " + c[1].slice(0, -c[2].length - 1) + ";\n        " + c[2] + ";\n        Hooks.Indicators(...arguments);\n    ");
  b.replace("Health Color & Visuals", /"#a4cc4f":"#cc5151"/, "'#f3e6ef' : '#c6b7c7',\n\n        Hooks.Tracers(...arguments)\n        Hooks.PlaceHelper(...arguments)\n    ");
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
  document.querySelector("#logo").src = ca.images.logo;
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
  document.title = "XanaX Mod - 2MG";
}
const aa = {
  "/entity/health-gauge-background.png": "https://i.imgur.com/yDcbdRA.png",
  "/entity/resource_background.png": "https://i.imgur.com/gEKWame.png",
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