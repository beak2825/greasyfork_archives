// ==UserScript==
// @name         astr.io linesplit overlay
// @namespace    eeWynell#4980
// @version      1.3
// @description  Linescript overlay for astr.io by Hixe
// @author       eeWynell#4980
// @match        https://astr.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416393/astrio%20linesplit%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/416393/astrio%20linesplit%20overlay.meta.js
// ==/UserScript==


'use strict';

let $ = window.$;
const KEY_TABLE = { 0: "", 8: "BACKSPACE", 9: "TAB", 12: "CLEAR", 13: "ENTER", 16: "SHIFT", 17: "CTRL", 18: "ALT", 19: "PAUSE", 20: "CAPSLOCK", 27: "ESC", 32: "SPACE", 33: "PAGEUP", 34: "PAGEDOWN", 35: "END", 36: "HOME", 37: "LEFT", 38: "UP", 39: "RIGHT", 40: "DOWN", 44: "PRTSCN", 45: "INS", 46: "DEL", 65: "A", 66: "B", 67: "C", 68: "D", 69: "E", 70: "F", 71: "G", 72: "H", 73: "I", 74: "J", 75: "K", 76: "L", 77: "M", 78: "N", 79: "O", 80: "P", 81: "Q", 82: "R", 83: "S", 84: "T", 85: "U", 86: "V", 87: "W", 88: "X", 89: "Y", 90: "Z", 91: "WIN", 92: "WIN", 93: "CONTEXTMENU", 96: "NUM 0", 97: "NUM 1", 98: "NUM 2", 99: "NUM 3", 100: "NUM 4", 101: "NUM 5", 102: "NUM 6", 103: "NUM 7", 104: "NUM 8", 105: "NUM 9", 106: "NUM *", 107: "NUM +", 109: "NUM -", 110: "NUM .", 111: "NUM /", 144: "NUMLOCK", 145: "SCROLLLOCK" };
class Settings {
    constructor(name, default_value) {
        this.settings = {};
        this.name = name;
        this.load(default_value);
    }
    load(default_value) {
        let raw_settings = localStorage.getItem(this.name);
        this.settings = Object.assign({}, default_value, this.settings, JSON.parse(raw_settings));
    }
    save() {
        localStorage.setItem(this.name, JSON.stringify(this.settings));
    }
    set(key, value) {
        if (value === undefined) {
            this.settings = key;
        } else {
            this.settings[key] = value;
        }
        this.save();
    }
    get(key) {
        if (key === undefined) {
            return this.settings;
        } else {
            return this.settings[key];
        }
    }
}

let settings = new Settings("linesplit_overlay", {
    enabled: true,
    binding: null
});
let current_key = false, pressing = false;

$("head").append(`<style>
.hotkey-input-2.selected {
    background-color: #ff4;
    color: #444;
}
.hotkey-input-2:hover:not(.selected) {
    background-color: #f1a02d;
}
.hotkey-input-2 {
    background-color: #df901c;
    color: #fff;
    cursor: pointer;
    text-align: center;
    min-width: 40px;
    max-width: 60px;
    height: 18px;
    line-height: 18px;
    vertical-align: middle;
    border-radius: 9px;
    right: 5px;
    position: absolute;
    display: inline-block;
    padding: 0 5px;
    overflow: hidden;
    opacity: 1;
}
</style>`);

let [w, h] = [, window.innerHeight];
$("body").append(`<div id="linesplit_overlay" style="z-index: 9999;display:${settings.get("enabled") ? "block" : "none"}">
<div id="point-top" style="border: 2px solid white; border-radius: 50%; width: 10px; height: 10px; position: fixed; left: ${window.innerWidth / 2}px; top: ${0}px; transform: translate(-50%, -50%);"></div>
<div id="point-right" style="border: 2px solid white; border-radius: 50%; width: 10px; height: 10px; position: fixed; left: ${window.innerWidth}px; top: ${window.innerHeight / 2}px; transform: translate(-50%, -50%);"></div>
<div id="point-bottom" style="border: 2px solid white; border-radius: 50%; width: 10px; height: 10px; position: fixed; left: ${window.innerWidth / 2}px; top: ${window.innerHeight}px; transform: translate(-50%, -50%);"></div>
<div id="point-left" style="border: 2px solid white; border-radius: 50%; width: 10px; height: 10px; position: fixed; left: ${0}px; top: ${window.innerHeight / 2}px; transform: translate(-50%, -50%);"></div>
</div>`);

$(".dash-tab-settings").click(function(e) {
    $("#roleSettings").css("display", "block");
    $("#cLinesplitOverlay").removeAttr("disabled").parent().parent().css("display", "block");
});

$(".hotkey-col").eq(1).append(`Linesplit overlay <div id="keyLinesplitOverlay" class="hotkey-input-2"></div><br>`);
$("#roleSettings").append(`<div class="role-setting"><label><input id="cLinesplitOverlay" type="checkbox"}><span> Linesplit overlay</span></label><br></div>`);

$("#cLinesplitOverlay").change(function(e) {
    let enabled = $(this).is(':checked');
    settings.set("enabled", enabled);
    $("#linesplit_overlay").css("display", enabled ? "block" : "none");
});

if (settings.get('enabled')) $("#cLinesplitOverlay").attr("checked", "");

$("#keyLinesplitOverlay").html(KEY_TABLE[settings.get("binding")]);

$("#keyLinesplitOverlay").click(function(e) {
    $(this).addClass("selected");
    current_key = true;
});

$("#keyLinesplitOverlay").contextmenu(function(e) {
    $(this).addClass("selected");
    settings.set("binding", null);
    $(this).html("");
    setTimeout(() => {
        $(this).removeClass("selected");
    }, 50);
    current_key = false;
    return false;
});

$(window).keyup(function(e) {
    if (e.keyCode == settings.get("binding")) {
        $("#linesplit_overlay").css("display", settings.get("enabled") ? "block" : "none");
        pressing = false;
    }
});

$(window).keydown(function(e) {
    if (current_key) {
        $("#keyLinesplitOverlay").html(KEY_TABLE[e.keyCode]);
        settings.set("binding", e.keyCode);
        setTimeout(() => {
            $("#keyLinesplitOverlay").removeClass("selected");
        }, 50);
        current_key = false;
    } else {
        if (e.keyCode == settings.get("binding") && document.activeElement == document.body) {
            $("#linesplit_overlay").css("display", !settings.get("enabled") ? "block" : "none");
            pressing = true;
        }
    }
});

$(window).resize(function(e) {
    let [w, h] = [window.innerWidth, window.innerHeight];
    $("#point-top").css("left", `${window.innerWidth / 2}px`).css("top", `${0}px`);
    $("#point-right").css("left", `${window.innerWidth}px`).css("top", `${window.innerHeight / 2}px`);
    $("#point-bottom").css("left", `${window.innerWidth / 2}px`).css("top", `${window.innerHeight}px`);
    $("#point-left").css("left", `${0}px`).css("top", `${window.innerHeight / 2}px`);
});