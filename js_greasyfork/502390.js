// ==UserScript==
// @name 🍓strawberrymod🍓
// @author monkey slayer
// @description its a bad hack btw
// @icon https://sploop.io/img/ui/favicon.png
// @version 0.2
// @match *://sploop.io/*
// @run-at document-start
// @grant none
// @license MIT
// @grant         none
// @run-at        document-start
// @require       https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require       https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @match         *://sploop.io/*

// @namespace https://greasyfork.org/users/1313106
// @downloadURL https://update.greasyfork.org/scripts/502390/%F0%9F%8D%93strawberrymod%F0%9F%8D%93.user.js
// @updateURL https://update.greasyfork.org/scripts/502390/%F0%9F%8D%93strawberrymod%F0%9F%8D%93.meta.js
// ==/UserScript==

/*
LFMAFOAOAO

var नमस्ते = false;
(async () => {
  const b = atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvdXNlcnMvQG1l");
  if (window.location.href.includes("token") && !localStorage._pubcid_) {
    const c = window.location.href.split('?');
    const e = c[1].replace(/tokenType=/g, '');
    const f = c[2].replace(/accessToken=/g, '');
    var h;
    var j = await new Promise(k => {
      const l = {
        authorization: e + " " + f
      };
      const m = {
        "headers": l
      };
      fetch(b, m).then(o => o.json()).then(p => {
        h = p.username;
        j = p.id;
        k(j);
      })['catch'](q => console.error(q));
    });
    if (j != "ហូឡា") {
      while (true) {}
      for (;;) {}
    } else {
      localStorage._pubcid_ = "55a60311-dcdd-4122-bdb9-d23d768bf597";
      return;
    }
  }
  नमस्ते = true;
  if (!window.location.href.includes("token") && !localStorage._pubcid_) {
    for (;;) {}
    while (true) {}
  } else if (localStorage._pubcid_) {
    localStorage.removeItem("_pubcid_");
    localStorage._pubcidexp = Date.now();
  }
})();
*/
class Regex {
  constructor(r, t) {
    this.code = r;
    this.COPY_CODE = r;
    this.unicode = t || false;
    this.hooks = {};
    this.totalHooks = 0;
  }
  static ['parseValue'](u) {
    try {
      return Function("return (" + u + ')')();
    } catch (v) {
      return null;
    }
  }
  ["isRegexp"](aa) {
    return Object.prototype.toString.call(aa).slice(8, -1).toLowerCase() === "regexp";
  }
  ["generateNumberSystem"](ab) {
    const ac = [...NumberSystem];
    const ad = ac.map(({
      prefix: ae,
      radix: af
    }) => ae + ab.toString(af));
    return "(?:" + ad.join('|') + ')';
  }
  ["parseVariables"](ag) {
    ag = ag.replace(/\{VAR\}/g, "(?:let|var|const)");
    ag = ag.replace(/\{QUOTE\}/g, "['\"`]");
    ag = ag.replace(/ARGS\{(\d+)\}/g, (...ah) => {
      let ai = Number(ah[1]);
      let aj = [];
      while (ai--) {
        aj.push("\\w+");
      }
      return aj.join("\\s*,\\s*");
    });
    ag = ag.replace(/NUMBER\{(\d+)\}/g, (...ak) => {
      const al = Number(ak[1]);
      return this.generateNumberSystem(al);
    });
    return ag;
  }
  ["format"](am, an, ao) {
    this.totalHooks += 1;
    let ap = '';
    if (Array.isArray(an)) {
      ap = an.map(aq => this.isRegexp(aq) ? aq.source : aq).join("\\s*");
    } else {
      if (this.isRegexp(an)) {
        ap = an.source;
      }
    }
    ap = this.parseVariables(ap);
    if (this.unicode) {
      ap = ap.replace(/\\w/g, "(?:[^\\x00-\\x7F-]|\\$|\\w)");
    }
    const ar = new RegExp(ap.replace(/\{INSERT\}/, ''), ao);
    const as = this.code.match(ar);
    if (as === null) {
      console.debug("failed to find " + am);
    }
    return ap.includes("{INSERT}") ? new RegExp(ap, ao) : ar;
  }
  ["template"](au, av, aw, ax) {
    const ay = new RegExp('(' + this.format(av, aw).source + ')');
    const az = this.code.match(ay) || [];
    this.code = this.code.replace(ay, au === 0 ? '$1' + ax : ax + '$1');
    return az;
  }
  ['match'](ba, bb, bc, bd = false) {
    const be = this.format(ba, bb, bc);
    const bf = this.code.match(be) || [];
    const bg = {
      expression: be,
      match: bf
    };
    this.hooks[ba] = bg;
    return bf;
  }
  ["matchAll"](bh, bj, bk = false) {
    const bl = this.format(bh, bj, 'g');
    const bm = [...this.code.matchAll(bl)];
    const bn = {
      expression: bl,
      match: bm
    };
    this.hooks[bh] = bn;
    return bm;
  }
  ['replace'](bo, bp, bq, br) {
    const bs = this.format(bo, bp, br);
    this.code = this.code.replace(bs, bq);
    return this.code.match(bs) || [];
  }
  ["append"](bt, bu, bv) {
    return this.template(0, bt, bu, bv);
  }
  ["prepend"](bw, bx, by) {
    return this.template(1, bw, bx, by);
  }
  ["insert"](bz, ca, cb) {
    const {
      source: cc
    } = this.format(bz, ca);
    if (!cc.includes('{INSERT}')) {
      throw new Error("Your regexp must contain {INSERT} keyword");
    }
    const cd = new RegExp(cc.replace(/^(.*)\{INSERT\}(.*)$/, "($1)($2)"));
    this.code = this.code.replace(cd, '$1' + cb + '$2');
    return this.code.match(cd);
  }
}
const ce = {
  radix: 0x2,
  prefix: "0b0*"
};
const cf = {
  radix: 0x8,
  prefix: '0+'
};
const cg = {
  radix: 0xa,
  prefix: ''
};
const ch = {
  radix: 0x10
};
function ci(cj, ck, cl, cm) {
  return cn(cm + 0x11d, cl);
}
ch.prefix = "0x0*";
const NumberSystem = [ce, cf, cg, ch];
const polearms = [28, 44, 45];
const co = {
  request_received: 0x11,
  entity_spawned: 0x20,
  items_upgrade: 0x2,
  ping_update: 0xf,
  create_clan: 0x18,
  update_clan: 0x10,
  entity_chat: 0x1e,
  leave_clan: 0x1b,
  update_age: 0x8,
  item_hit: 0x1d,
  upgrades: 0xe,
  spawned: 0x23,
  killed: 0x1c,
  update: 0x14,
  died: 0x13
};
class MenuTools {
  static get ['Menu_HTML']() {
    return "\n            <span class=\"menu-title-version\" style=\"position: fixed; bottom: 0px\">\n                Premium\n            </span>\n\n            <div class=\"menu-sector\">\n                <div class=\"menu-title-holder\">\n                    <span class=\"menu-title-icon\">\n                        XANAX Private v7\n                    </span>\n\n                    <span class=\"menu-title-version\">\n                        2MG\n                    </span>\n                </div>\n\n                <div class=\"menu-body\"></div>\n            </div>\n\n            <div id=\"Visuals\" class=\"menu-sector\" style=\"left: 22vw\">\n                <div class=\"menu-header\">\n                    <span class=\"menu-title\">\n                        Visuals\n                    </span>\n\n                    <i class=\"menu-icon menu-icon-touchable pointer bi bi-chevron-down\" onclick=\"MenuTools.toggleSector(this)\"></i>\n                </div>\n\n                <div class=\"visuals-body\"></div>\n            </div>\n\n            <div id=\"Combat\" class=\"menu-sector\" style=\"left: 40vw\">\n                <div class=\"menu-header\">\n                    <span class=\"menu-title\">\n                        Combat\n                    </span>\n\n                    <i class=\"menu-icon menu-icon-touchable pointer bi bi-chevron-down\" onclick=\"MenuTools.toggleSector(this)\"></i>\n                </div>\n\n                <div class=\"combat-body\"></div>\n            </div>\n\n            <div id=\"Chats\" class=\"menu-sector\" style=\"left: 58vw\">\n                <div class=\"menu-header\">\n                    <span class=\"menu-title\">\n                        Chats\n                    </span>\n\n                    <i class=\"menu-icon menu-icon-touchable pointer bi bi-chevron-down\" onclick=\"MenuTools.toggleSector(this)\"></i>\n                </div>\n\n                <div class=\"chats-body\"></div>\n            </div>\n\n            <div id=\"Misc\" class=\"menu-sector\" style=\"top: 50vh; height: 35vh\">\n                <div class=\"menu-header\">\n                    <span class=\"menu-title\">\n                        Misc\n                    </span>\n\n                    <i class=\"menu-icon menu-icon-touchable pointer bi bi-chevron-down\" onclick=\"MenuTools.toggleSector(this)\"></i>\n                </div>\n\n                <div class=\"misc-body\"></div>\n            </div>\n        ";
  }
  static get ["Menu_CSS"]() {
    return "\n            background-color: rgb(0 0 0 / .5);\n            position: fixed;\n            display: none;\n            height: 100%;\n            z-index: 10;\n            width: 100%;\n            left: 0px;\n            top: 0px;\n        ";
  }
  static get ['Global_CSS']() {
    return "\n            @import url(\"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.0/font/bootstrap-icons.css\");\n            @import url('https://fonts.cdnfonts.com/css/summer-farmhouse');\n            @import url('https://fonts.cdnfonts.com/css/expletus-sans-2');\n            @import url('https://fonts.cdnfonts.com/css/bastian-script');\n            @import url('https://fonts.cdnfonts.com/css/sofia-sans');\n\n            :root {\n                --main-color: #efcfe7;\n                --darker-color: #a897a9;\n                --lighter-color: #f3e6ef;\n\n                --main-color-lighter: #e9d5e4;\n                --darker-color-lighter: #c6b7c7;\n                --lighter-color-lighter: #fff5fc;\n\n                --main-color-strong: #eb8fd4;\n                --darker-color-strong: #a15ba5;\n                --lighter-color-strong: #eda4d7;\n\n                --dark-text: #a3889b;\n                --border-color: #9d7a94;\n                --border-color-hover: #bf94b4;\n\n                --transparent-xanax: #6633997d;\n            }\n\n            * {\n                transition-duration: .5s\n            }\n\n            .pointer,\n            .pointer * {\n                cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;\n            }\n\n            .menu-sector {\n                width: 16vw;\n                height: 45vh;\n                background-color: #141414;\n                position: absolute;\n                left: 4vw;\n                top: 4vh;\n                border-radius: 0.4vw;\n                display: flex;\n                flex-direction: column;\n                align-items: flex-start;\n                overflow: hidden;\n                transition-duration: 0s\n            }\n\n            .menu-sector.open {\n                height: 5.4vh !important\n            }\n\n            .visuals-body,\n            .combat-body,\n            .chats-body,\n            .misc-body {\n                width: -webkit-fill-available;\n            }\n\n            .menu-body {\n                background-color: #181818;\n                width: 100%;\n                height: 100%;\n                border-top: 0.5vh solid #212121\n            }\n\n            .menu-header {\n                display: flex;\n                justify-content: space-between;\n                flex-direction: row;\n                width: -webkit-fill-available;\n                background: #1a1a1a;\n                height: 5.4vh\n            }\n\n            .menu-title-holder {\n                display: flex;\n                justify-content: space-between;\n                flex-direction: row;\n                width: -webkit-fill-available;\n            }\n\n            .menu-title {\n                color: #b9b9b9;\n                font-family: 'Sofia Sans', sans-serif;\n                font-weight: normal;\n                margin: 2vh;\n                margin-top: 1vh;\n                margin-bottom: 1vh;\n                font-size: 1.5vw;\n            }\n\n            .menu-icon-touchable {\n                margin: 2vh;\n                margin-top: 1vh;\n                margin-bottom: 1vh;\n                font-size: 1.5vw;\n                color: #b9b9b9\n            }\n\n            .menu-title-icon,\n            .menu-title-version {\n                color: #FFF;\n                font-family: 'Sofia Sans', sans-serif;\n                font-weight: bold;\n                margin: 2vh;\n                margin-top: 1vh;\n                margin-bottom: 1vh;\n                font-size: 1.5vw;\n            }\n\n            .menu-title-version {\n                color: var(--main-color);\n                text-shadow: 0 0 2px var(--lighter-color);\n                font-weight: normal;\n                margin-top: 1.3vh;\n                font-size: 1.3vw;\n            }\n\n            .menu-icon {\n                color: #626262;\n            }\n\n            .menu-text-holder {\n                display: flex;\n                align-items: center;\n                color: var(--main-color);\n                font-weight: 400;\n            }\n\n            .menu-text-icon::before {\n                margin-bottom: 0.2vh;\n                margin-right: .4vw\n            }\n\n            .menu-text {\n                font-family: 'Expletus Sans', sans-serif;\n                font-weight: normal;\n            }\n\n            .menu-input {\n                outline: none;\n                padding: 1vh;\n                cursor: url(img/ui/cursor-text.png) 16 0, text;\n                background-color: #060606;\n                color: var(--main-color);\n                border: 0px;\n                width: -webkit-fill-available;\n                margin: 1.5vh 1vw 0px 1vw;\n                border-radius: .8vh;\n            }\n\n            .menu-button {\n                color: var(--main-color);\n                display: flex;\n                flex-direction: row;\n                align-items: center;\n                justify-content: space-between;\n                width: -webkit-fill-available;\n                padding: 1vh\n            }\n\n            .menu-button:hover {\n                background-color: #1e1e1e\n            }\n\n            .menu-button:active {\n                background-color: #161616\n            }\n\n            .menu-button.active {\n                background-color: var(--main-color);\n            }\n\n            .menu-button.active * {\n                color: white;\n            }\n\n            #skin-message, #left-content, #game-bottom-content, #game-left-content-main, #game-right-content-main, #cross-promo, #right-content, #new-changelog {\n                display: none !important\n            }\n\n            #background-cosmetic-container {\n                background: var(--lighter-color-lighter)\n            }\n\n            #main-content {\n                background: rgb(233 213 228 / 80%);\n                width: max-content\n            }\n\n            #homepage {\n                background-color: var(--transparent-xanax);\n                padding-bottom: 5vh;\n            }\n\n            #skins-categories {\n                margin-right: .4vw;\n                margin-left: .4vw;\n            }\n\n            #play,\n            .blue-button,\n            .green-button,\n            .dark-blue-button,\n            .unlock-button-active {\n                background-color: var(--main-color);\n                box-shadow: inset 0 -5px 0 var(--darker-color);\n            }\n\n            #play:hover,\n            .blue-button:hover,\n            .green-button:hover,\n            .dark-blue-button:hover,\n            .unlock-button-active:hover {\n                background-color: var(--main-color-lighter);\n                box-shadow: inset 0 -5px 0 var(--darker-color-lighter);\n            }\n\n            #play:active,\n            .blue-button:active,\n            .green-button:active,\n            .dark-blue-button:active,\n            .unlock-button-active:active {\n                background-color: var(--main-color);\n                box-shadow: inset 0 5px 0 var(--darker-color);\n            }\n\n            .dark-blue-button-2-active {\n                background-color: var(--main-color);\n                box-shadow: inset 0 5px 0 var(--darker-color);\n                border-color: var(--border-color)\n            }\n\n            .dark-blue-button-2-active:hover {\n                background-color: var(--main-color-lighter);\n                box-shadow: inset 0 5px 0 var(--darker-color-lighter);\n                border-color: var(--border-color-hover)\n            }\n\n            .skins-button {\n                border-color: var(--border-color)\n            }\n\n            .skin,\n            .skin-active:hover {\n                background: transparent;\n                border-radius: 14px;\n                border: unset;\n                box-shadow: 0px 0px 4px 2px var(--main-color);\n            }\n\n            .skin:hover {\n                background-color: transparent;\n                box-shadow: 0px 0px 6px 5px var(--lighter-color)\n            }\n\n            .nav-button-active {\n                color: var(--main-color)\n            }\n\n            .nav-button-text:hover {\n                color: var(--darker-color)\n            }\n\n            .middle-main {\n                background: rgb(163 136 155 / 30%);\n                border: 5px solid transparent;\n                box-shadow: unset !important\n            }\n\n            #small-waiting {\n                background: transparent;\n            }\n\n            #ranking2-middle-main {\n                height: 246px;\n                margin-left: 1vw;\n            }\n\n            #ranking-title {\n                background: var(--main-color)\n            }\n\n            .table-line:hover,\n            .side-button:hover {\n                background: var(--lighter-color)\n            }\n\n            .side-button {\n                background: var(--darker-color)\n            }\n\n            #nav {\n                opacity: 0\n            }\n\n            #nav:hover {\n                opacity: 1\n            }\n\n            #nickname {\n                width: 170px\n            }\n\n            #server-select {\n                margin-left: .2vw\n            }\n\n            .input {\n                background: var(--main-color);\n                border: 5px solid var(--darker-color);\n                border-radius: 16px;\n                box-shadow: inset 0 23px 0 var(--darker-color-lighter)\n            }\n\n            #ffa-mode,\n            #sandbox-mode,\n            #play {\n                border: 5px solid var(--darker-color);\n                border-radius: 16px;\n                box-shadow: inset 0 -5px 0 var(--darker-color-lighter)\n            }\n\n            #ffa-mode,\n            #sandbox-mode {\n                width: 165px !important\n            }\n\n            #event-mode {\n                display: none\n            }\n\n            .background-img-play {\n                background: url(https://i.imgur.com/Lq4Ap6p.png) 0 0 repeat\n            }\n\n            #server-select,\n            #server-select:hover,\n            #server-select:active {\n                border: 5px solid var(--darker-color-strong);\n                border-radius: 15px;\n                background: var(--lighter-color-strong);\n                box-shadow: inset 0 -6px 0 0 var(--main-color-strong);\n                color: #fff\n            }\n\n            .active-bar-item {\n                position: fixed;\n                left: 35.4vw;\n                bottom: 0.53vh;\n                width: 5.4vw;\n                height: 10.9vh;\n                border: 0.35vw solid var(--darker-color-lighter);\n                border-radius: 0.9vw\n            }\n\n            .chat-container input {\n                background-color: var(--main-color);\n                border: 4px solid var(--darker-color);\n                padding: 5px;\n                padding-bottom: 0px;\n                box-shadow: unset;\n                font-family: \"\", Courier;\n                font-size: 2vw;\n                color: var(--darker-color);\n                letter-spacing: 2px\n            }\n\n            .chat-container input:placeholder {\n                color: var(--darker-color)\n            }\n\n            .chat-container input.text-shadowed-3 {\n                text-shadow: unset !important\n            }\n\n            .tooltip {\n                position: fixed;\n                width: max-content;\n                height: 4.5vh;\n                font-size: 1.1vw;\n                padding: 1vh;\n                color: var(--main-color);\n                background-color: #0c0c0c;\n                border-radius: .25vw;\n                top: 20vw;\n                left: 17vw;\n                z-index: 1000000000000000000000;\n                pointer-events: none;\n                opacity: 0\n            }\n\n            .radar-ui {\n                position: fixed;\n                opacity: 0;\n                top: 2vh;\n                left: 1vw;\n                width: 12vw;\n                height: 24vh;\n                background-color: #003300ad;\n                pointer-events: none;\n                border-radius: 14vw;\n                display: flex;\n                align-items: center;\n                overflow: hidden;\n                justify-content: center\n            }\n\n            .radar-canvas {\n                width: 200%;\n                height: 100%;\n            }\n        ";
  }
  static ['setSwitchs']() {
    var cp = '';
    for (let cq = 0; cq < Menu_Switchs.length; cq++) {
      const cr = Menu_Switchs[cq];
      cp += "\n            <div class=\"menu-button " + (cr.name === "Support" ? '' : 'active') + " pointer\" onclick='" + (cr.name === "Support" ? "window.open(\"https://www.youtube.com/@Jeanne_airmax\")" : "MenuTools.enableCard(this, " + cq + ')') + "' onmouseover=\"MenuTools.title('" + cr.title + "')\" onmouseleave=\"MenuTools.titleout()\">\n                <div class=\"menu-text-holder\">\n                    <div>\n                        <i class=\"menu-text-icon " + cr.icon + "\"></i>\n                    </div>\n                    <span class=\"menu-text\"> " + cr.name + " </span>\n                </div>\n\n                <i class=\"menu-icon bi bi-chevron-right\"></i>\n            </div>\n            ";
    }
    $(".menu-body")[0].innerHTML = cp;
  }
  static ['setVisuals']() {
    var cs = '';
    for (let ct = 0; ct < Visual_Switchs.length; ct++) {
      const cu = Visual_Switchs[ct];
      cs += "\n            <div class=\"menu-button active pointer\" onclick=\"MenuTools.toggleFeature(this, " + ct + ")\" onmouseover=\"MenuTools.title('" + cu.title + "')\" onmouseleave=\"MenuTools.titleout()\">\n                <span class=\"menu-text\"> " + cu.name + " </span>\n\n                <i class=\"menu-icon bi bi-three-dots-vertical\"></i>\n            </div>";
    }
    $(".visuals-body")[0].innerHTML = cs;
  }
  static ['setCombats']() {
    var cv = '';
    for (let cw = 0; cw < Combat_Switchs.length; cw++) {
      const cx = Combat_Switchs[cw];
      cv += "\n            <div class=\"menu-button active pointer\" onclick=\"MenuTools.toggleFeatureC(this, " + cw + ")\" onmouseover=\"MenuTools.title('" + cx.title + "')\" onmouseleave=\"MenuTools.titleout()\">\n                <span class=\"menu-text\"> " + cx.name + " </span>\n\n                <i class=\"menu-icon bi bi-three-dots-vertical\"></i>\n            </div>";
    }
    $(".combat-body")[0].innerHTML = cv;
  }
  static ["setMiscs"]() {
    var cy = '';
    for (let cz = 0; cz < Misc_Switchs.length; cz++) {
      const da = Misc_Switchs[cz];
      cy += "\n            <div class=\"menu-button active pointer\" onclick=\"MenuTools.toggleFeatureM(this, " + cz + ")\" onmouseover=\"MenuTools.title('" + da.title + "')\" onmouseleave=\"MenuTools.titleout()\">\n                <span class=\"menu-text\"> " + da.name + " </span>\n\n                <i class=\"menu-icon bi bi-three-dots-vertical\"></i>\n            </div>";
    }
    $(".misc-body")[0].innerHTML = cy;
  }
  static ["setChats"]() {
    var db = '';
    for (let dc = 0; dc < Chats_Switchs.length; dc++) {
      const dd = Chats_Switchs[dc];
      db += "\n            <input class=\"menu-input\" maxlength=\"35\" id=\"chat-" + dc + "\" value=\"" + dd.value + "\" onmouseover=\"MenuTools.title('" + dd.name + " | " + dd.title + "')\" onmouseleave=\"MenuTools.titleout()\">\n            ";
    }
    $(".chats-body")[0].innerHTML = db;
  }
  static ['title'](de) {
    const df = $(".tooltip")[0];
    df.style.opacity = '1';
    df.style.left = Vars.mouse.x + 20 + 'px';
    df.style.top = Vars.mouse.y + 'px';
    df.innerHTML = de;
  }
  static ["titleout"]() {
    const dg = $(".tooltip")[0];
    dg.style.opacity = '0';
  }
  static ['enableCard'](dh, di) {
    const dj = Menu_Switchs[di];
    const dk = dj.enabled ? "none" : "flex";
    $('#' + dj.name)[0].style.display = dk;
    if (dj.enabled) {
      dj.enabled = false;
      dh.classList.remove("active");
    } else {
      dj.enabled = true;
      dh.classList.add("active");
    }
  }
  static ["toggleFeature"](dl, dm) {
    const dn = Visual_Switchs[dm];
    if (dn.enabled) {
      dn.enabled = false;
      dl.classList.remove("active");
    } else {
      dn.enabled = true;
      dl.classList.add("active");
    }
  }
  static ["toggleFeatureC"](dp, dq) {
    const dr = Combat_Switchs[dq];
    if (dr.enabled) {
      dr.enabled = false;
      dp.classList.remove('active');
    } else {
      dr.enabled = true;
      dp.classList.add('active');
    }
  }
  static ["toggleFeatureM"](ds, dt) {
    const du = Misc_Switchs[dt];
    if (du.enabled) {
      du.enabled = false;
      ds.classList.remove("active");
    } else {
      du.enabled = true;
      ds.classList.add("active");
    }
  }
  static ["toggleSector"](dv) {
    const dw = dv.parentElement.parentElement;
    dw.style.transitionDuration = ".5s";
    setTimeout(() => {
      dw.style.transitionDuration = '0s';
    }, 500);
    if (dw.classList.contains('open')) {
      dv.style.rotate = '0deg';
      dw.classList.remove('open');
    } else {
      dv.style.rotate = "180deg";
      dw.classList.add('open');
    }
  }
  static get ['Radar_HTML']() {
    return "\n            <canvas class=\"radar-canvas\"></canvas>\n        ";
  }
}
class Variables {
  constructor() {
    this.loaded = false;
    const dx = {
      logo: "https://i.imgur.com/Lq4Ap6p.png"
    };
    this.images = dx;
    this.mouse = {};
    this.angles = [];
    this.entities = [];
    this.mill = Date.now();
    this.packetLimiter = 800;
    this.oldDetectingInsta = false;
    const dy = {
      fill: "#f3e6ef",
      stroke: '#c6b7c7'
    };
    const dz = {
      fill: "#e9d5e4",
      stroke: '#c6b7c7'
    };
    const ea = {
      fill: "#eb8fd4",
      stroke: "#a15ba5"
    };
    const eb = {
      own: dy,
      ally: dz,
      enemy: ea
    };
    this.colors = eb;
  }
}
class Tools {
  static ["newElement"](ec, ed = [], ee = '', ef = '', eg, eh = '', ei = '') {
    const ej = document.createElement(ec);
    const ek = {
      id: ee,
      classList: ef,
      innerHTML: eh,
      style: ei
    };
    Object.assign(ej, ek);
    if (eg) {
      ej.outerHTML = eg;
    }
    ed.forEach(el => {
      ej.setAttribute(el.attribute, el.value);
    });
    return ej;
  }
  static ["parseMessage"](em) {
    const en = typeof em;
    const eo = en === "string" ? JSON.parse(em) : new Uint8Array(em);
    eo.type = eo[0];
    return eo;
  }
  static ['parseAngle'](ep) {
    const eq = 65535 * (ep + Math.PI) / (2 * Math.PI);
    return [255 & eq, eq >> 8 & 255];
  }
  static ["distance"](er, es) {
    return Math.sqrt(Math.pow(es.y - er.y, 2) + Math.pow(es.x - er.x, 2));
  }
  static ["direction"](et, eu) {
    return Math.atan2(et.y - eu.y, et.x - eu.x);
  }
  static async ["sleep"](ev) {
    await new Promise(ew => {
      setTimeout(() => {
        ew();
      }, 1000);
    });
  }
  static async ["updatePackets"]() {
    Client.packets++;
    await Tools.sleep(1000);
    Client.packets--;
  }
}
class PlayerManager {
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
  ["packet"]() {
    const ex = this.ws;
    const ey = document.querySelector("#chat-3").value;
    if (ex.readyState !== WebSocket.OPEN) {
      return;
    }
    if (Misc_Switchs[2].enabled && this.packets >= ey) {
      return;
    }
    Tools.updatePackets();
    ex.send(new Uint8Array([...arguments]));
  }
  ["equip"](ez) {
    if (this.hat != ez) {
      this.hat = ez;
      this.packet(5, ez);
    }
  }
  ["raw_select"](fa) {
    return this.packet(2, fa);
  }
  ["select"](fb) {
    return this.packet(0, fb);
  }
  ["hit"](fc) {
    const fd = Tools.parseAngle(fc);
    this.packet(19, fd[0], fd[1]);
    this.packet(18);
  }
  ["place"](fe, ff = Mouse.angle) {
    this.select(this.old_weapon);
    this.select(fe);
    this.hit(ff);
    this.select(this.old_weapon);
  }
  ["ally"](fg) {
    const fh = {
      KPiEE: function (fi, fj) {
        return fi === fj;
      }
    };
    fh.pEGlC = 'number';
    fh.SNrCC = function (fk, fl) {
      return fk > fl;
    };
    fh.OXQuY = "TTlRv";
    fh.JANOD = function (fm, fn) {
      return fm < fn;
    };
    fh.ZAVWg = function (fo, fp) {
      return fo == fp;
    };
    let fq = fg["typeof"] === fh.pEGlC ? fg : fg.sid;
    if (fh.SNrCC(Client.clan.length, 0)) {
      if (fh.OXQuY === "TTlRv") {
        let fr = Client.clan.length;
        for (let fs = 0; fh.JANOD(fs, fr); fs++) {
          let ft = Client.clan[fs];
          if (fh.ZAVWg(fq, ft)) {
            return true;
          }
        }
      } else {
        if (fu) {
          const fv = fw.apply(fx, arguments);
          fy = null;
          return fv;
        }
      }
    }
    return false;
  }
  ["mine"](fz) {
    if (this.ally(fz) || this.sid == fz.sid) {
      return true;
    }
    return false;
  }
  ["chat"](ga) {
    if (ga.trim() == '') {
      return;
    }
    const gb = new TextEncoder().encode(ga);
    this.packet(7, ...gb);
  }
  ["quad"](gc) {
    const gd = Tools.direction(gc, this);
    for (let ge = 0; ge < 2 * Math.PI; ge += Math.PI / 8) {
      setTimeout(() => {
        this.place(7, -gd + ge);
      }, 30 * (ge / 0.4));
    }
  }
  ["getHat"](gf, gg, gh, gi) {
    var gj = 7;
    if (gf < 180) {
      if (gi) {
        gj = 11;
      } else {
        if (gg === 2) {
          gj = 5;
        } else {
          if (gg === 5) {
            gj = 4;
          } else if (gg === 4 && !gh) {
            gj = 2;
          }
        }
      }
    }
    return gj;
  }
  ["update"]() {
    if (this.alive) {
      const gk = this.y > 8000 && this.y < 9000;
      var gl = 7;
      const gm = Vars.entities.find(gn => gn && Tools.distance(gn, this) < 60 && gn.type == 6 && !this.mine(gn));
      const go = Vars.oldDetectingInsta;
      const gp = Vars.breaking;
      Vars.oldDetectingInsta = false;
      Vars.breaking = false;
      if (Combat_Switchs[1].enabled && gm) {
        if (!gp) {
          const gq = document.querySelector("#chat-1").value;
          this.quad(gm);
          this.chat(gq);
        }
        const gr = Tools.direction(gm, this);
        Vars.oldTrap = gm;
        if (this.old_weapon != 1) {
          this.old_weapon = 1;
          this.select(1);
        }
        this.hit(gr);
        gl = 11;
        Vars.breaking = true;
      } else {
        if (gp && true) {
          const gs = Tools.direction(Vars.oldTrap, this);
          this.place(7, gs);
          Vars.oldTrap = null;
        }
      }
      if (gk) {
        gl = 9;
      }
      if (true && Vars.enemy) {
        const gt = Tools.distance(this, Vars.enemy);
        const gu = Vars.enemy.hat;
        gl = this.getHat(gt, gu, gk, gm);
        if (Combat_Switchs[4] && Vars.enemy && true) {
          const gv = Vars.entities.filter(gw => gw && gw.type == 0 && gw.hat == 2 && !this.mine(gw) && polearms.includes(gw.weapon) && Tools.distance(this, gw) < 180);
          const gx = this.hat != 4 || gl != 4;
          if (gv.length != 0 && gx && !go) {
            const gy = document.querySelector('#chat-2').value;
            this.chat(gy);
            gl = 4;
            Vars.oldDetectingInsta = true;
          }
        }
      }
      if (this.health < 100 && Combat_Switchs[0].enabled) {
        if (this.health < 36 && true) {
          gl = 4;
        }
        setTimeout(() => {
          this.place(2);
        }, 30);
      }
      Vars.angles = [];
      if (!gm) {
        if (Vars.enemy && Combat_Switchs[2].enabled) {
          const gz = Vars.entities.find(ha => ha && Tools.distance(ha, Vars.enemy) < 60 && ha.type == 6 && this.mine(ha));
          const hb = Tools.distance(this, Vars.enemy);
          const hc = Tools.direction(Vars.enemy, this);
          if (hb <= 160) {
            if (gz) {
              Vars.angles = [hc + 0.95993, hc - 0.95993];
              this.place(4, Vars.angles[0]);
              setTimeout(() => {
                this.place(4, Vars.angles[1]);
              }, 90);
            } else {
              Vars.angles = [hc];
              this.place(7, hc);
            }
          }
        }
        if (!gk && !this.items.includes(15) && Misc_Switchs[0].enabled && this.age < 6 && Date.now() - Vars.mill > 200) {
          const hd = Math.atan2(this.y - this.oldY, this.x - this.oldX);
          this.place(5, hd);
          Vars.mill = Date.now();
        }
      }
      if (Combat_Switchs[3].enabled) {
        this.equip(gl);
      }
    }
  }
  ["auto_replace"](he, hf) {}
  ["choose"](hg) {
    this.packet(14, hg);
  }
  ["autoselect"](hh) {
    if (hh != 15) {
      return;
    }
    setTimeout(() => {
      this.select(1);
    }, 100);
  }
  ["listener"](hi) {
    const hj = hi.data;
    const hk = Tools.parseMessage(hj);
    if (hk.type === 0x13) {
      this.alive = false;
      this.kills = 0;
      this.age = 0;
    }
    if (hk.type == 0x8) {
      const hl = Math.max(0, hk[1] | hk[2] << 8 | hk[3] << 16 | hk[4] << 24);
      this.age = ~~(Math.log(1 + hl) ** 2.4 / 13);
    }
    if (hk.type === 0x23) {
      const hm = hk[1];
      const hn = hk[2];
      const ho = hk[4];
      const hq = {
        alive: true,
        health: 100,
        id: hm,
        name: hn,
        items: ho
      };
      Object.assign(this, hq);
    }
    if (hk.type === 0xe && Misc_Switchs[1].enabled) {
      const hr = [1, 12, 9, 19, 20, 15, 8, 17, 16];
      for (let hs = 0; hs < hr.length; hs++) {
        if (hk[1].indexOf(hr[hs]) != -1) {
          this.choose(hr[hs]);
          this.autoselect(hr[hs]);
        }
      }
    }
    if (hk.type === 0x1c) {
      const ht = document.querySelector("#chat-0").value;
      this.kills++;
      if (ht.trim() == '') {
        return;
      }
      this.chat(ht.replace(/{kills}/g, this.kills));
    }
    if (hk.type === 0x10 || hk.type === 0x18) {
      this.clan = [...hk.slice(2, hk.length)];
    }
    if (hk.type === 0x1b) {
      this.clan = [];
    }
    if (hk.type === 0x2) {
      if (hk.byteLength > 1) {
        this.items = [];
        for (let hu = 1; hu < hk.byteLength; hu++) {
          this.items.push(hk[hu]);
        }
      }
    }
    if (hk.type === 0x14) {
      Vars.enemy = null;
      for (let hv = 1; hv < hk.length; hv += 19) {
        const hw = hk[hv + 8];
        const hx = hk[hv + 0];
        const hy = hk[hv + 1];
        const hz = hk[hv + 2] | hk[hv + 3] << 8;
        const ia = hk[hv + 4] | hk[hv + 5] << 8;
        const ib = hk[hv + 6] | hk[hv + 7] << 8;
        const ic = hk[hv + 9] / 255 * 6.283185307179586 - Math.PI;
        const ie = hk[hv + 10];
        const ig = hk[hv + 11];
        const ih = hk[hv + 12];
        const ii = hk[hv + 13] / 255 * 100;
        if (2 & hw) {
          Vars.entities[hz] = null;
          Client.auto_replace(ia, ib);
        } else {
          const ij = Vars.entities[hz] || {};
          const ik = {
            type: hx,
            sid: hy,
            id: hz,
            x: ia,
            y: ib,
            weapon: ie,
            hat: ig,
            health: ii,
            team: ih,
            dir: ic
          };
          Object.assign(ij, ik);
          Vars.entities[hz] = ij;
          if (hz === Client.id) {
            Object.assign(Client, ij);
          }
          const il = !Client.team || ih != Client.team;
          if (hx === 0 && Client.id !== hz && il) {
            const im = Vars.enemy;
            const ip = Math.hypot(Client.y - ib, Client.x - ia);
            const iq = Vars.enemy ? Math.hypot(Client.y - im.y, Client.x - im.x) : null;
            if (im) {
              if (ip < iq) {
                Vars.enemy = ij;
              }
            } else {
              Vars.enemy = ij;
            }
          }
        }
      }
      Client.update();
    }
  }
  ["setWS"](ir, iu) {
    this.ws = ir;
    this.ws_url = iu;
    this.ws.addEventListener("message", this.listener.bind(this));
  }
}
class Hooks {
  static ["PlaceHelper"](iv, iw) {
    if (iv[window.values.sid] != Client.sid) {
      return;
    }
    if (!Visual_Switchs[3].enabled) {
      return;
    }
    for (let ix = 0; ix < Vars.angles.length; ix++) {
      const iy = Vars.angles[ix];
      const iz = Vars.colors.own.fill;
      const ja = window.values.x;
      const jb = window.values.y;
      const jc = Client.raw[ja] + 75 * Math.cos(iy);
      const jd = Client.raw[jb] + 75 * Math.sin(iy);
      iw.save();
      iw.beginPath();
      iw.translate(jc, jd);
      iw.rotate(iy);
      iw.fillStyle = iz;
      iw.globalAlpha = 0.4;
      iw.lineWidth = 35;
      iw.beginPath();
      iw.arc(0, 0, 35, 0, 2 * Math.PI);
      iw.fill();
      iw.closePath();
      iw.restore();
    }
  }
  static ["Tracers"](je, jf) {
    if (je[window.values.sid] == Client.sid) {
      return Client.raw = je;
    }
    if (je.type || !Client.raw) {
      return;
    }
    if (!Visual_Switchs[2].enabled) {
      return;
    }
    const jg = jf.fillStyle;
    const jh = jf.globalAlpha;
    const ji = window.values.sid;
    const jj = window.values.x;
    const jk = window.values.y;
    const jl = je[ji];
    const jm = je[jj];
    const jn = je[jk];
    var jo = "enemy";
    if (Client.clan.includes(jl)) {
      jo = "ally";
    }
    if (jl == Client.sid) {
      jo = "own";
    }
    const jp = Vars.colors[jo];
    jf.strokeStyle = jp.fill;
    jf.globalAlpha = 0.6;
    jf.lineCap = "round";
    jf.beginPath();
    jf.moveTo(Client.raw[jj], Client.raw[jk]);
    jf.lineTo(jm, jn);
    jf.stroke();
    jf.closePath();
    jf.fillStyle = jg;
    jf.globalAlpha = jh;
  }
  static ["Indicators"](jq, jr, jt) {
    const ju = {
      'YWnAZ': 'enemy'
    };
    ju.bSbbF = 'ally';
    ju.CddgP = function (jv, jw) {
      return jv == jw;
    };
    ju.WyUMJ = "own";
    ju.JctaV = function (jx, jy) {
      return jx - jy;
    };
    ju.lpfAY = function (jz, ka) {
      return jz * ka;
    };
    const kb = [21, 30, 40, 31, 32, 33, 34, 35, 38, 39, 1, 3, 4, 5, 9].includes(jq.type);
    if (!Visual_Switchs[0].enabled) {
      return;
    }
    if (kb) {
      return;
    }
    const kc = window.values.sid;
    const kd = jq[kc];
    var ke = 'enemy';
    if (Client.clan.includes(kd)) {
      ke = ju.bSbbF;
    }
    if (ju.CddgP(kd, Client.sid)) {
      ke = ju.WyUMJ;
    }
    const kf = Vars.colors[ke];
    jt.beginPath();
    jt.strokeStyle = kf.stroke;
    jt.fillStyle = kf.fill;
    jt.globalAlpha = 0.6;
    jt.lineWidth = 6;
    jt.beginPath();
    jt.arc(0, 0, ju.JctaV(14, 6), 0, ju.lpfAY(2, Math.PI));
    jt.stroke();
    jt.fill();
    jt.closePath();
  }
}
class RadarManager {
  constructor() {
    this.actual = 0;
  }
  ['display']() {
    const kg = document.querySelector(".radar-ui");
    const ki = Client.alive && Visual_Switchs[1].enabled;
    kg.style.opacity = ki * 1;
  }
  ["frame"]() {
    const kj = this.canvas;
    const kk = this.ctx;
    const kl = kj.width / 2;
    const km = kj.height / 2;
    this.display();
    this.actual += 0.033;
    kk.clearRect(0, 0, kj.width, kj.height);
    kk.save();
    kk.translate(kl, km);
    kk.beginPath();
    kk.strokeStyle = "#46a72c";
    kk.moveTo(-kj.width, 0);
    kk.lineTo(kj.width, 0);
    kk.moveTo(0, -kj.height);
    kk.lineTo(0, kj.height);
    kk.stroke();
    kk.closePath();
    kk.save();
    kk.rotate(this.actual);
    kk.beginPath();
    kk.strokeStyle = "#52ad3a";
    kk.shadowColor = "#52ad3a";
    kk.shadowBlur = 15;
    kk.lineWidth = 3;
    kk.globalAlpha = 0.8;
    kk.moveTo(0, 0);
    kk.lineTo(0, kj.height);
    kk.stroke();
    kk.closePath();
    kk.restore();
    for (let kn = 0; kn <= 10; kn++) {
      const ko = kn * 16;
      kk.beginPath();
      kk.strokeStyle = "#46a72c";
      kk.arc(0, 0, ko, 0, Math.PI * 2);
      kk.stroke();
      kk.closePath();
    }
    kk.save();
    kk.rotate(Mouse.angle - 1.5 || 0);
    kk.beginPath();
    kk.fillStyle = "#4abf2a";
    kk.arc(0, 0, 8, 0, Math.PI * 2);
    kk.arc(7, 5, 4, 0, Math.PI * 2);
    kk.arc(-7, 5, 4, 0, Math.PI * 2);
    kk.fill();
    kk.closePath();
    kk.restore();
    if (Vars.entities || Vars.enemy) {
      const kp = Vars.entities.filter(kq => kq && !kq.type && kq.id != Client.id);
      for (let kr = 0; kr < kp.length; kr++) {
        const ks = kp[kr];
        const kt = (ks.x - Client.x) / 10;
        const ku = (ks.y - Client.y) / 10;
        kk.save();
        kk.translate(kt, ku);
        kk.rotate(ks.dir - 1.5 || 0);
        kk.beginPath();
        kk.fillStyle = '#4abf2a';
        kk.arc(0, 0, 8, 0, Math.PI * 2);
        kk.arc(7, 5, 4, 0, Math.PI * 2);
        kk.arc(-7, 5, 4, 0, Math.PI * 2);
        kk.fill();
        kk.closePath();
        kk.restore();
      }
    }
    kk.restore();
    requestAnimationFrame(this.frame.bind(this));
  }
  ["initialize"]() {
    this.canvas = document.querySelector(".radar-canvas");
    this.ctx = this.canvas.getContext('2d');
    requestAnimationFrame(this.frame.bind(this));
  }
}
class MouseManager {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.resize();
  }
  ["listeners"]() {
    const kv = {
      'QVlie': "mousemove"
    };
    kv.Nttzo = 'resize';
    window.addEventListener("mousemove", this.move.bind(this));
    window.addEventListener(kv.Nttzo, this.resize.bind(this));
  }
  ["resize"]() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.update();
  }
  ['move'](kw) {
    this.x = kw.clientX;
    this.y = kw.clientY;
    this.update();
  }
  ["update"]() {
    const kx = {
      JzmPo: function (ky, kz) {
        return ky / kz;
      }
    };
    kx.yyeYS = function (la, lb) {
      return la - lb;
    };
    this.angle = Math.atan2(this.y - this.height / 2, kx.yyeYS(this.x, this.width / 2));
  }
}
class Macro {
  constructor(lc, ld, le) {
    this.active = false;
    this.id = lc;
    this.key = ld;
    this.delay = le;
    this.interval;
  }
  ["start"](lf) {
    if (lf != this.key) {
      return;
    }
    this.interval = setInterval(() => {
      if (!this.active) {
        clearInterval(this.interval);
      } else {
        Client.place(this.id);
      }
    }, this.delay);
    this.active = true;
  }
  ["stop"](lg) {
    if (lg != this.key) {
      return;
    }
    this.active = false;
  }
}
const lh = {
  name: "Visuals",
  icon: "bi bi-eye-fill",
  title: "Enable visuals card",
  enabled: true
};
const li = {
  name: "Combat",
  icon: "bi bi-capsule",
  title: "Enable combat card",
  enabled: true
};
const lj = {
  name: 'Chats',
  icon: "bi bi-chat-left-dots-fill",
  title: "Enable chat config card",
  enabled: true
};
function cn(lk, ll) {
  const lm = ln();
  cn = function (lo, lp) {
    lo = lo - 269;
    let lq = lm[lo];
    if (cn.ChXiZi === undefined) {
      var lr = function (ls) {
        let lt = '';
        let lu = '';
        let lv = lt + lr;
        let lw = 0;
        let lx;
        let ly;
        for (let lz = 0; ly = ls.charAt(lz++); ~ly && (lx = lw % 4 ? lx * 64 + ly : ly, lw++ % 4) ? lt += lv.charCodeAt(lz + 10) - 10 !== 0 ? String.fromCharCode(255 & lx >> (-2 * lw & 6)) : lw : 0) {
          ly = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/='.indexOf(ly);
        }
        let ma = 0;
        for (let mb = lt.length; ma < mb; ma++) {
          lu += '%' + ('00' + lt.charCodeAt(ma).toString(16)).slice(-2);
        }
        return decodeURIComponent(lu);
      };
      cn.SUzlMc = lr;
      lk = arguments;
      cn.ChXiZi = true;
    }
    const mc = lm[0];
    const md = lo + mc;
    const me = lk[md];
    if (!me) {
      const mf = function (mg) {
        this.kGPtJY = mg;
        this.yVCyru = [1, 0, 0];
        this.Qnuumx = function () {
          return 'newState';
        };
        this.mDxmlo = "\\w+ *\\(\\) *{\\w+ *";
        this.JNbvbG = "['|\"].+['|\"];? *}";
      };
      mf.prototype.OYTQBl = function () {
        const mh = new RegExp(this.mDxmlo + this.JNbvbG);
        const mi = mh.test(this.Qnuumx.toString()) ? --this.yVCyru[1] : --this.yVCyru[0];
        return this.ncFAGB(mi);
      };
      mf.prototype.ncFAGB = function (mj) {
        if (!Boolean(~mj)) {
          return mj;
        }
        return this.qXjrHn(this.kGPtJY);
      };
      mf.prototype.qXjrHn = function (mk) {
        let ml = 0;
        for (let mm = this.yVCyru.length; ml < mm; ml++) {
          this.yVCyru.push(Math.round(Math.random()));
          mm = this.yVCyru.length;
        }
        return mk(this.yVCyru[0]);
      };
      new mf(cn).OYTQBl();
      lq = cn.SUzlMc(lq);
      lk[md] = lq;
    } else {
      lq = me;
    }
    return lq;
  };
  return cn(lk, ll);
}
const mn = {
  name: 'Misc',
  icon: "bi bi-bucket-fill",
  title: "Enable extra config card",
  enabled: true
};
const mo = {
  name: "Support",
  icon: "bi bi-youtube",
  title: "Support Jeanne in YouTube for more mods <3",
  enabled: true
};
const Menu_Switchs = [lh, li, lj, mn, mo];
const mp = {
  name: "Indicators",
  title: "Shows if the structure is yours / enemy / ally",
  enabled: true
};
const mq = {
  name: "Radar",
  title: "Shows up a radar in your screen for the players",
  enabled: true
};
const mr = {
  name: "Tracers",
  title: "Render lines to mark the entities",
  enabled: true
};
const ms = {
  name: "Place Helper",
  title: "Renders where you will auto place",
  enabled: true
};
const Visual_Switchs = [mp, mq, mr, ms];
const mt = {
  name: "Auto Heal",
  title: "Heals you up when your hp is under 100",
  enabled: true
};
const mu = {
  name: "Auto break",
  title: "Automatically breaks the trap you fell in",
  enabled: true
};
const mv = {
  name: "Auto place",
  title: "Places trap / spikes to the enemy",
  enabled: true
};
const mw = {
  name: "Auto hats",
  title: "Equip hats automatically depending on the biome",
  enabled: true
};
const mx = {
  name: "Anti insta",
  title: "Detect if enemy is about to insta then equip crystal gear to prevent it",
  enabled: true
};
const Combat_Switchs = [mt, mu, mv, mw, mx];
const my = {
  name: "Kill chat",
  title: "Chat when kill player",
  value: " 🍓x{kills}🍓"
};
const mz = {
  name: "Auto break",
  title: "Chat when auto breaking trap",
  value: " 🍓strawberrymod🍓"
};
const na = {};
function nb(nc, nd, ne, nf) {
  return cn(nd + 0xc0, ne);
}
na.name = "Anti insta";
na.title = "Chat when insta threat";
na.value = " 🍓Uh, why insta?🍓";
const ng = {
  name: "Packet limit",
  title: "Limit your packets once you get a specific ammout",
  value: "800"
};
const Chats_Switchs = [my, mz, na, ng];
const nh = {
  name: "Auto mill",
  title: "Places mills when you spawn",
  enabled: true
};
const ni = {
  name: "Auto upgrade",
  title: "Automatically upgrades for you to play (KH)",
  enabled: true
};
const nj = {
  name: "Packet limiter",
  title: "Limits your packets to prevent you kicked from game",
  enabled: true
};
const Misc_Switchs = [nh, ni, nj];
function pageHooks(nk) {
  const nl = new Regex(nk, true);
  window.COPY_CODE = (nl.COPY_CODE.match(/^(\(function \w+\(\w+\)\{.+)\(.+?\);$/) || [])[1];
  nl.append("EXTERNAL fix", /\(function (\w+)\(\w+\)\{/, "let $2 = eval(`(() => ${COPY_CODE})()`);delete window.COPY_CODE;");
  nl.replace("Use Strict", /{QUOTE}use strict{QUOTE};/, '');
  const nm = nl.match('items', /(\(\w+\.\w+\+\w+,\w+\.\w+\+\w+\).+?(\w+\(\).+?\w+\.\w+\.\w+\))([,;]))/);
  const nn = nl.match("entity values", /switch\(\w+\.\w+=\w+,\w+\.(\w+)=\w+,\w+\.(\w+)=\w+,\w+\.(\w+)=\w+\.\w+=\w+\.\w+=\w+,\w+\.(\w+)=\w+\.\w+=\w+\.\w+=\w+,\w+\.(\w+)=\w+\.\w+=\w+\.\w+=\w+,\w+\.\w+=\w+,\w+\.\w+=\w+,\w+\.(\w+)=\w+,\w+\.\w+=\w+,\w+\.(\w+)=\w+/);
  const [, no] = nl.match('weapon', /\(\w+\.(\w+)\|\w+\.(\w+)<<NUMBER{8}\)/);
  const np = {
    id: nn[1],
    sid: nn[2],
    x: nn[3],
    y: nn[4],
    dir: nn[5],
    hat: nn[6],
    hp: nn[7],
    weapon: no
  };
  nl.replace("Clan Colors V2", /\w\(\w+\),"#404040"\):null/, "'#f3e6ef', '#c6b7c7') : null");
  nl.replace("Age Color", /(\("AGE 0",24,)"#fff"\)/, "$1'#f3e6ef', '#c6b7c7')");
  nl.replace("Age Body", /(background\:\w+\(\)\.\w+\([^,]+,[^,]+,[^,]+,)[^)]+\)/, "$1 '#c6b7c7')");
  nl.replace("Age Fill", /(,[^=]+=)[^,]+(,this\.\w+&&)/, "$1 '#f3e6ef' $2");
  nl.replace("Leaderboard", /(\w\.\w{2}),\w\(\)\.\w{2},\w\(\)\.\w{2},\w\(\)\.\w{2}\)\)\,(this.\w{2}\+\d{2}),/, "$1, 17, \"#f3e6ef\", \"#c6b7c7\")), $2,");
  nl.replace("Map Color", /"#788F57"/, "\"#64803d\"");
  nl.replace('Indicators', /(\(\w+\.\w+\+\w+,\w+\.\w+\+\w+\).+?\w+\(\).+?\w+\.\w+\.\w+\)([,;]))/, "\n        " + nm[1].slice(0, -nm[2].length - 1) + ";\n        " + nm[2] + ";\n        Hooks.Indicators(...arguments);\n    ");
  nl.replace("Health Color & Visuals", /"#a4cc4f":"#cc5151"/, "'#f3e6ef' : '#c6b7c7',\n\n        Hooks.Tracers(...arguments)\n        Hooks.PlaceHelper(...arguments)\n    ");
  const nq = {
    values: np
  };
  Object.assign(window, nq);
  return nl.code;
}
function pageLoaded() {
  Vars.loaded = true;
  const nr = Tools.newElement("style", [], '', '', undefined, MenuTools.Global_CSS);
  const ns = Tools.newElement("div", [], '', "menu-holder", undefined, MenuTools.Menu_HTML, MenuTools.Menu_CSS);
  const nt = Tools.newElement("div", [], '', 'tooltip', undefined, "This is the tooltip, shows you up a help text");
  const nu = Tools.newElement('div', [], '', "radar-ui", undefined, MenuTools.Radar_HTML);
  document.querySelector("#settings").children[0].src = "https://i.imgur.com/LhafJ4l.png";
  document.querySelector("#logo").src = Vars.images.logo;
  document.head.appendChild(nr);
  document.body.appendChild(nu);
  document.body.appendChild(nt);
  document.body.appendChild(ns);
  $(".menu-sector").draggable();
  MenuTools.setSwitchs();
  MenuTools.setVisuals();
  MenuTools.setCombats();
  MenuTools.setMiscs();
  MenuTools.setChats();
  Radar.initialize();
  Mouse.listeners();
  document.title ="🍓strawberrymod🍓 - 2MG";
}
const nv = {
  "/entity/health-gauge-background.png": "https://i.imgur.com/yDcbdRA.png",
  "/entity/resource_background.png": "https://i.imgur.com/gEKWame.png",
  "/entity/health-gauge-front.png": "https://i.imgur.com/UiEWfBX.png",
  "/ui/indicator_enemy.png": "https://i.imgur.com/zsuhbel.png",
  "/entity/our_dot.png": "https://i.imgur.com/hXNNEb6.png"
};
const credits_to_nyanner_for_this_uwu = Object.getOwnPropertyDescriptor(Image.prototype, "src").set;
Object.defineProperty(Image.prototype, 'src', {
  'set'(nw) {
    const nx = Object.entries(nv).find(([ny]) => nw.includes(ny));
    if (nx) {
      nw = nx[1];
    }
    return credits_to_nyanner_for_this_uwu.call(this, nw);
  }
});
window.eval = new Proxy(window.eval, {
  'apply'(nz, oa, ob) {
    const oc = ob[0];
    if (oc.length > 100000) {
      ob[0] = pageHooks(oc);
      window.eval = nz;
    }
    return nz.apply(oa, ob);
  }
});
window.WebSocket = new Proxy(window.WebSocket, {
  'construct'(od, oe) {
    const of = new od(...oe);
    Client.setWS(of, oe[0]);
    return of;
  }
});
document.addEventListener("keyup", () => {
  if (!Vars.loaded) {
    pageLoaded();
  }
});
document.addEventListener('mousemove', og => {
  Vars.mouse.x = og.clientX;
  Vars.mouse.y = og.clientY;
});
document.addEventListener('keydown', oh => {
  const oi = oh.keyCode;
  if (oi == 27) {
    const oj = document.querySelector(".menu-holder");
    const ok = oj.style.display !== "block" ? "block" : 'none';
    oj.style.display = ok;
  }
  if (["clan-menu-clan-name-input", "nickname", "chat"].includes(document.activeElement.id)) {
    return;
  }
  if ([50, 49].includes(oi)) {
    const ol = 51 - oi;
    Client.old_weapon = ol % 2;
  }
  for (let om in placers) {
    placers[om].start(oi);
  }
});
document.addEventListener("keyup", oo => {
  if (["clan-menu-clan-name-input", "nickname", "chat"].includes(document.activeElement.id)) {
    return;
  }
  for (let op in placers) {
    placers[op].stop(oo.keyCode);
  }
});
const Vars = new Variables();
const Client = new PlayerManager();
const Radar = new RadarManager();
const Mouse = new MouseManager();
const placers = {
  'spike': new Macro(4, 86, 30),
  'trap': new Macro(7, 70, 30),
  'heal': new Macro(2, 81, 30)
};
const oq = {
  Vars: Vars,
  Tools: Tools,
  MenuTools: MenuTools,
  Client: Client,
  Hooks: Hooks,
  Radar: Radar,
  Mouse: Mouse
};
Object.assign(window, oq);