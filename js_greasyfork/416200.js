// ==UserScript==
// @name         Rainbow nickname
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Made by Qwerth [gratefulprobe#1000]
// @author       Qwerth
// @match        https://agma.io/
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/416200/Rainbow%20nickname.user.js
// @updateURL https://update.greasyfork.org/scripts/416200/Rainbow%20nickname.meta.js
// ==/UserScript==

unsafeWindow.ytspec_colornick_color = "#008080";
unsafeWindow.ytspec_colornick_enabled = false;
unsafeWindow.ytspec_fakeskin_enabled = false;
unsafeWindow.ytspec_fakeskin_id = false;

function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

class Settings {
    constructor(name, default_value) {
        this.settings = {};
        this.listeners = {
            load: [],
            save: [],
            set: [],
            get: []
        };
        this.default_value = default_value;
        this.name = name;
    }
    load() {
        let raw_settings = JSON.parse(localStorage.getItem(this.name)) || {};
        for (let setting in this.default_value) {
            this.set(setting, setting in raw_settings ? raw_settings[setting] : this.default_value[setting]);
        }
        this.emit("load");
    }
    save() {
        localStorage.setItem(this.name, JSON.stringify(this.settings));
        this.emit("save");
    }
    set(key, value) {
        if (value === undefined) {
            this.settings = key;
        } else {
            this.settings[key] = value;
        }
        this.emit("set", { key, value });
    }
    get(key) {
        if (key === undefined) {
            return this.settings;
        } else {
            return this.settings[key];
        }
        this.emit("get", { key });
    }
    emit(action, event = {}) {
        if (!(action in this.listeners)) return false;
        for (let listener of this.listeners[action]) {
            listener(event);
        }
    }
    on(action, handler) {
        if (!(action in this.listeners)) return false;
        this.listeners[action].push(handler.bind(this));
    }
    off(action) {
        if (!(action in this.listeners)) return false;
        this.listeners[action] = [];
    }
}

let timeout;
function interval_func() {
    clearTimeout(timeout);
    if (settings.get("colornick_rainbow")) {
        let rainbow_color = Math.floor(Date.now() / settings.get("colornick_interval")) * settings.get("colornick_step") % 360;
        unsafeWindow.ytspec_colornick_color = hslToHex(rainbow_color, 100, 50);
        timeout = setTimeout(interval_func, settings.get("colornick_interval"));
    } else {
        unsafeWindow.ytspec_colornick_color = settings.get("colornick_color");
    }
}

let settings = new Settings("ytspec", {
    "colornick_enabled": false,
    "colornick_color": "#FFFFFF",
    "colornick_interval": 10,
    "colornick_step": 1,
    "colornick_rainbow": false,
    "fakeskin_id": 0,
    "fakeskin_enabled": false
});

settings.on("set", function({ key, value }) {
    switch (key) {
        case "colornick_enabled":
            unsafeWindow.ytspec_colornick_enabled = value;
            break;
        case "colornick_rainbow":
            interval_func();
            break;
        case "colornick_color":
            if (!settings.get("colornick_rainbow")) unsafeWindow.ytspec_colornick_color = value;
            break;
        case "colornick_step":
            interval_func();
            break;
        case "colornick_interval":
            interval_func();
            break;
        case "fakeskin_id":
            unsafeWindow.ytspec_fakeskin_id = value;
            break;
        case "fakeskin_enabled":
            unsafeWindow.ytspec_fakeskin_enabled = value;
            break;
    }
    settings.save();
});

settings.on("load", function(e) {
    if (settings.get("colornick_enabled")) $("#ytspec_colornick_enabled").attr("checked", "");
    if (settings.get("colornick_rainbow")) $("#ytspec_colornick_rainbow").attr("checked", "");
    if (settings.get("fakeskin_enabled")) $("#ytspec_fakeskin_enabled").attr("checked", "");
    $("#ytspec_colornick_color").val(settings.get("colornick_color"));
    $("#ytspec_colornick_step").val(settings.get("colornick_step"));
    $("#ytspec_colornick_interval").val(settings.get("colornick_interval"));
    $("#ytspec_fakeskin_id").val(settings.get("fakeskin_id"));

    $(document).on("change", "#ytspec_colornick_enabled", function(e) {
        settings.set("colornick_enabled", $(this).is(":checked"));
    });
    $(document).on("change", "#ytspec_colornick_rainbow", function(e) {
        settings.set("colornick_rainbow", $(this).is(":checked"));
    });
    $(document).on("change", "#ytspec_colornick_color", function(e) {
        settings.set("colornick_color", $(this).val());
    });
    $(document).on("change", "#ytspec_colornick_step", function(e) {
        settings.set("colornick_step", +$(this).val());
    });
    $(document).on("change", "#ytspec_colornick_interval", function(e) {
        settings.set("colornick_interval", +$(this).val());
    });
    $(document).on("change", "#ytspec_fakeskin_id", function(e) {
        settings.set("fakeskin_id", +$(this).val());
    });
    $(document).on("change", "#ytspec_fakeskin_enabled", function(e) {
        settings.set("fakeskin_enabled", $(this).is(":checked"));
    });
});

function setUpUI() {
    $(`
<div class="form-group">
    <h4>Colored nickname</h4>
    <label><input type="checkbox" id="ytspec_colornick_enabled"/> Enabled</label>
    <input type="color" class="form-control text-center" id="ytspec_colornick_color" placeholder="Color: #FFFFFF" maxlength="7" style="width:70%;margin-top: -7px; margin-bottom: 7px; margin-left: 8px; margin-right: 8px; display: inline;">
    <label><input type="checkbox" id="ytspec_colornick_rainbow"/> Rainbow</label>
    <input type="number" min="1" class="form-control text-center" id="ytspec_colornick_interval" placeholder="Interval: 10" maxlength="7" style="width:35%;margin-top: -7px; margin-bottom: 7px; margin-left: 8px;display: inline;">
    <input type="number" min="1" max="359" class="form-control text-center" id="ytspec_colornick_step" placeholder="Step: 1" maxlength="7" style="width:35%;margin-top: -7px; margin-bottom: 7px; margin-right: 8px; display: inline;">
</div>`).insertAfter(".center-panel > form");
    settings.load();
}

function modifyCore(core) {
    let [, array_name, array_value] = core.match(/var (_0x[\w\d]+)=(\[.*\])/);
    let array = Function("return " + array_value)();

    let [, user_obj] = core.match(RegExp(`,([\\w\\d]+?)=\{nickName`));
    let [, colo_obj] = core.match(RegExp(`,([\\w\\d]+?)=\\[${array_name}\\[${array.indexOf("#FFFFFF")}\\]`));
    let [, text_obj] = core.match(RegExp(`if\\(([\\w\\d]+?)\\[${array_name}\\[${array.indexOf("setColor")}\\]\\]\\(${colo_obj}\\[this\\[${array_name}\\[${array.indexOf("colorIndexName")}\\]\\]\\]\\)`));

    core = core.replace(`${text_obj}[${array_name}[${array.indexOf("setColor")}]](${colo_obj}[this[${array_name}[${array.indexOf("colorIndexName")}]]])`,
                        `${text_obj}[${array_name}[${array.indexOf("setColor")}]](this.ownCell&&window.ytspec_colornick_enabled?window.ytspec_colornick_color:${colo_obj}[this[${array_name}[${array.indexOf("colorIndexName")}]]])`);

    return core;
}

let observer = new MutationObserver(mutations => {
    mutations.forEach(({
        addedNodes
    }) => {
        addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.tagName === 'SCRIPT' && node.src && node.src.match(/ag\d+?\.js/)) {
                node.type = 'javascript/blocked';
                node.parentElement.removeChild(node);
                fetch(node.src)
                    .then(res => res.text())
                    .then(core => Function(modifyCore(core))())
            }
        })
    })
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});

window.addEventListener("DOMContentLoaded", setUpUI);