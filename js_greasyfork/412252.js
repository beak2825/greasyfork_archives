// ==UserScript==
// @name         a usual script
// @namespace    Wynell
// @version      0.1
// @description  try to take over the world!
// @author       Wynell
// @match        https://agma.io/
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/412252/a%20usual%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/412252/a%20usual%20script.meta.js
// ==/UserScript==

unsafeWindow.unsafe_color = "#FF0000";
unsafeWindow.unsafe_enabled = false;

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
        this.name = name;
    }
    load(default_value) {
        let raw_settings = JSON.parse(localStorage.getItem(this.name));
        for (let setting in raw_settings) {
            this.set(setting, raw_settings[setting]);
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

// author wynell

let timeout;
function interval_func() {
    clearTimeout(timeout);
    if (settings.get("rainbow")) {
        let rainbow_color = Date.now() / settings.get("interval") * settings.get("step") % 360;
        unsafeWindow.unsafe_color = hslToHex(rainbow_color, 100, 50);
        timeout = setTimeout(interval_func, settings.get("interval"));
    } else {
        unsafeWindow.unsafe_color = settings.get("color");
    }
}

let settings = new Settings("colornick", {
    enabled: false,
    color: "#FFFFFF",
    interval: 10,
    step: 1,
    rainbow: false
});

settings.on("set", function({ key, value }) {
    switch (key) {
        case "enabled":
            unsafeWindow.unsafe_enabled = value;
            break;
        case "rainbow":
            interval_func();
            break;
        case "color":
            if (!settings.get("rainbow")) unsafeWindow.unsafe_color = value;
            break;
        case "step":
            interval_func();
            break;
        case "interval":
            interval_func();
            break;
    }
    settings.save();
});

settings.on("load", function(e) {
    if (settings.get("enabled")) $("#colornick_enabled").attr("checked", "");
    if (settings.get("rainbow")) $("#colornick_rainbow").attr("checked", "");
    $("#colornick_color").val(settings.get("color"));
    $("#colornick_step").val(settings.get("step"));
    $("#colornick_interval").val(settings.get("interval"));

    $(document).on("change", "#colornick_enabled", function(e) {
        settings.set("enabled", $(this).is(":checked"));
    });
    $(document).on("change", "#colornick_rainbow", function(e) {
        settings.set("rainbow", $(this).is(":checked"));
    });
    $(document).on("change", "#colornick_color", function(e) {
        settings.set("color", $(this).val());
    });
    $(document).on("change", "#colornick_step", function(e) {
        settings.set("step", +$(this).val());
    });
    $(document).on("change", "#colornick_interval", function(e) {
        settings.set("interval", +$(this).val());
    });
});

function setUpUI() {
    $(`
<div class="form-group">
    <h4>Colored nickname</h4>
    <label><input type="checkbox" id="colornick_enabled"/> Enabled</label>
    <input type="color" class="form-control text-center" id="colornick_color" placeholder="Color: #FFFFFF" maxlength="7" style="width:70%;margin-top: -7px; margin-bottom: 7px; margin-left: 8px; margin-right: 8px; display: inline;">
    <label><input type="checkbox" id="colornick_rainbow"/> Rainbow</label>
    <input type="number" min="1" class="form-control text-center" id="colornick_interval" placeholder="Interval: 10" maxlength="7" style="width:35%;margin-top: -7px; margin-bottom: 7px; margin-left: 8px;display: inline;">
    <input type="number" min="1" max="359" class="form-control text-center" id="colornick_step" placeholder="Step: 1" maxlength="7" style="width:35%;margin-top: -7px; margin-bottom: 7px; margin-right: 8px; display: inline;">
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
                        `${text_obj}[${array_name}[${array.indexOf("setColor")}]](${text_obj}._value==" "+${user_obj}.nickName.replace(/\\[.+?\\]/g, "")+" "&&window.unsafe_enabled?window.unsafe_color:${colo_obj}[this[${array_name}[${array.indexOf("colorIndexName")}]]])`);

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