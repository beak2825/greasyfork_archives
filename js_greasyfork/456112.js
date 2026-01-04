// ==UserScript==
// @name        Sploop.io update script
// @namespace   Trash key bind changing
// @match       https://sploop.io/
// @grant       none
// @version     1.1
// @author      Urban Dubov
// @description 12/6/2022, 11:57:43 AM
// @downloadURL https://update.greasyfork.org/scripts/456112/Sploopio%20update%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/456112/Sploopio%20update%20script.meta.js
// ==/UserScript==
const keybindObj = {
    keybinds: `{"0":"KeyW","1":"KeyS","2":"KeyD","3":"KeyA","4":"KeyF","5":"KeyQ","6":"Space","7":"KeyR","8":"KeyR","9":"KeyX","10":"KeyE","11":"ArrowUp","12":"ArrowRight","13":"ArrowDown","14":"ArrowLeft","15":"Escape","16":"Enter","17":"KeyL","18":"KeyN"}`,
    applicationUpdate: function (id, keybinds) {
      localStorage.removeItem(id);
      localStorage.removeItem(keybinds);
      localStorage.setItem(keybinds, this.keybinds);
    },
  },
  settings = { ...keybindObj },
  Settings = settings;
Settings.applicationUpdate("_adIds", "keybinds");
const reset = document.getElementById("reset-keybinds");
reset.classList.add("text-shadowed-3");
reset.innerHTML = "Reset";
reset.style.cssText = ` background:#f0ece0; border:4px solid #141414; height:fit-content; border-radius:0; box-shadow:inset 0 23px 0 #e8e0c8; text-align:center; font-size:14px; outline:none; color:#fff; cursor:url(img/ui/cursor-pointer.png) 6 0,pointer;`;
const fixedSettingsMenu = [".pop-box {", "border-radius: 0;", "box-shadow: none;", "justify-content: space-evenly;", "}", ".setting-line {", "margin-bottom: 10px;", "}", ".pop-box::-webkit-scrollbar {", "-webkit-appearance: none;", "width: 15px;", "height: 12px;", "background: rgba(40, 45, 34, 0.6);", "border: 3px solid #141414;", "outline: none;", "}", ".pop-box::-webkit-scrollbar-thumb {", "cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;", "-webkit-appearance: none;", "width: 20px;", "border-radius: 4px;", "height: 20px;", "background: #f0ece0;", "border: 4px solid #141414;", "position: relative;", "z-index: 3;", "}", ".pop-box .input {", "background: #f0ece0;", "border: 4px solid #141414;", "height: fit-content;", "border-radius: 0;", "box-shadow: inset 0 23px 0 #e8e0c8;", "text-align: center;", "font-size: 14px;", "outline: none;", "color: white;", "cursor: url(img/ui/cursor-text.png) 16 0, text;", "}", ".control_indicator {", "position: absolute;", "top: 0px;", "left: 0;", "height: 30px;", "width: 30px;", "background: #fdfdfd;", "border: 4px solid #141414;", "border-radius: 0;", "font-size: 14px;", "cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;", "}"].join("\n");
if (typeof GM_addStyle != "undefined") {
  GM_addStyle(fixedSettingsMenu);
} else if (typeof PRO_addStyle != "undefined") {
  PRO_addStyle(fixedSettingsMenu);
} else if (typeof addStyle != "undefined") {
  addStyle(fixedSettingsMenu);
} else {
  var node = document.createElement("style");
  node.type = "text/css";
  node.appendChild(document.createTextNode(fixedSettingsMenu));
  var heads = document.getElementsByTagName("head");
  if (heads.length > 0) {
    heads[0].appendChild(node);
  } else {
    document.documentElement.appendChild(node);
  }
}
