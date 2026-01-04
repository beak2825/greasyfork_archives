// ==UserScript==
// @name         xdXot1c Krunker Cheats
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  xdXot1c Krunker Cheat
// @homepage     https://www.nigga.com
// @author       xdXot1c#4324
// @match        *://krunker.io/*
// @match        *://browserfps.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=krunker.io
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458809/xdXot1c%20Krunker%20Cheats.user.js
// @updateURL https://update.greasyfork.org/scripts/458809/xdXot1c%20Krunker%20Cheats.meta.js
// ==/UserScript==
 
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it =
    (typeof Symbol !== "undefined" && o[Symbol.iterator]) || o["@@iterator"];
  if (!it) {
    if (
      Array.isArray(o) ||
      (it = _unsupportedIterableToArray(o)) ||
      (allowArrayLike && o && typeof o.length === "number")
    ) {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return { done: true };
          return { done: false, value: o[i++] };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }
    throw new TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
var props = {
  game: randStr(),
  players: randStr(),
  handleInput: randStr(),
  controls: randStr(),
  settings: randStr()
};
var game = (window[props.game] = {});
var settings = (game[props.settings] = [
  {
    text: "xdXot1c's Aim",
    enabled: true,
    toggle: true,
    key: "L"
  },
  {
    text: "xdXot1c's Aimbot",
    enabled: true,
    toggle: true,
    key: "B"
  },
  {
    text: "Wallhax",
    enabled: true,
    toggle: true,
    key: "V"
  },
  {
    text: "Hide/Show Menu",
    enabled: true,
    key: "H",
    onclick: function onclick() {
      menu.style.opacity = this.enabled ? "1" : "0";
    }
  }
]);
window.addEventListener("keydown", function (event) {
  var key = event.key.toUpperCase();
  var setting = settings.find(function (s) {
    return s.key == key;
  });
  if (!setting) return;
  setting.enabled = !setting.enabled;
  if (setting.indicator) {
    var elem = setting.indicator;
    elem.style.color = setting.enabled ? "lime" : "red";
    elem.innerHTML = setting.enabled ? "ON" : "OFF";
  }
  if (setting.onclick) setting.onclick();
});
game[props.handleInput] = function (data) {
  var controls = game[props.controls];
  var players = game[props.players];
  var me = players.find(function (p) {
    return p.isYou;
  });
  var targets = players.filter(function (p) {
    return (
      p.cnBSeen && p.health > 0 && !p.isYou && (!me.team || p.team != me.team)
    );
  });
  var closestTargets = targets.sort(function (p1, p2) {
    return getDistance3D(me, p1) - getDistance3D(me, p2);
  });
  if (
    (settings[0].enabled || data[6]) &&
    settings[1].enabled &&
    closestTargets.length > 0
  ) {
    var target = closestTargets[0];
    var copy = Object.assign({}, target);
    copy.y -= target.crouchVal * 3;
    copy.y += me.crouchVal * 3;
    var xD = getXDir(me, copy) - me.recoilAnimY * 0.3;
    var yD = getYDir(me, copy);
    if (me.aimVal == 0) data[5] = me.weapon.nAuto ? data[0] % 2 : 1;
    data[2] = xD * 1000;
    data[3] = yD * 1000;
    data[6] = 1;
    controls.target = {
      xD: xD,
      yD: yD
    };
    controls.update(400);
  } else controls.target = null;
};
var decode = TextDecoder.prototype.decode;
TextDecoder.prototype.decode = function () {
  var code = decode.apply(this, arguments);
  if (code.length > 1e6) {
    code = code.replace(
      /(\['cnBSeen'\])\)/,
      "$1 || (true && "
        .concat(props.game, ".")
        .concat(props.settings, "[2].enabled))")
    );
    code = code.replace(
      /this\['list'\]\s?=\s?\[\];/,
      "$& ".concat(props.game, ".").concat(props.players, " = this.list;")
    );
    code = code.replace(
      /this\['procInputs'\]\s?=\s?function\s?\([^\)]+\)\s?\{/,
      "$& ".concat(props.game, ".").concat(props.handleInput, "(arguments[0]);")
    );
    code = code.replace(
      /\);[^[]+\['controls'\]\s?=\s?/,
      "$& ".concat(props.game, ".").concat(props.controls, " =")
    );
  }
  return code;
};
function getXDir(p1, p2) {
  var h = Math.abs(p1.y - p2.y);
  var dst = getDistance3D(p1, p2);
  return Math.asin(h / dst) * (p1.y > p2.y ? -1 : 1);
}
function getYDir(p1, p2) {
  var dx = p1.x - p2.x;
  var dz = p1.z - p2.z;
  return Math.atan2(dx, dz);
}
function getDistance3D(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);
}
function randStr() {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var str = chars[Math.floor(Math.random() * 52)];
  var amount = Math.floor(Math.random() * 8) + 5;
  while (str.length < amount) {
    var index = Math.floor(Math.random() * chars.length);
    str += chars[index];
  }
  return str;
}
function connect() {
  var socket = new WebSocket("wss://supercounter.tk");
  var onclose = function onclose() {
    return setTimeout(connect, 1000);
  };
  var onmessage = function onmessage(message) {
    var playerCount = message.data;
    setCount(playerCount);
  };
  socket.addEventListener("message", onmessage);
  socket.addEventListener("close", onclose);
  socket.addEventListener("error", onclose);
}
connect();
var menu = document.createElement("div");
var counter = document.createElement("span");
function addMenu() {
  menu.setAttribute(
    "style",
    "\n        transition-duration: 0.3s;\n        background: #000000A0;\n        padding: 0.3vw;\n        border-radius: 5px;\n        border: 2px black solid;\n        height: 11vw;\n        width: 13vw;\n        font-size: 0.7vw;\n        display: flex;\n        flex-direction: column;\n    "
  );
  var title = document.createElement("span");
  title.innerHTML = "xdXot1c Cheats";
  title.setAttribute(
    "style",
    "\n        color: white;\n        font-size: 0.9vw;\n        padding: 0.7vw;\n    "
  );
  menu.appendChild(title);
  var _iterator = _createForOfIteratorHelper(settings),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      var setting = _step.value;
      var key = setting.key,
        text = setting.text,
        toggle = setting.toggle,
        enabled = setting.enabled;
      var node = document.createElement("span");
      node.setAttribute(
        "style",
        "\n            color: white;\n            padding: 0.4vw;\n        "
      );
      node.innerHTML = "["
        .concat(key, "] ")
        .concat(text)
        .concat(toggle ? ": " : "");
      if (toggle) {
        var indicator = document.createElement("span");
        setting.indicator = indicator;
        indicator.style.color = enabled ? "lime" : "red";
        indicator.innerHTML = "ON";
        node.appendChild(indicator);
      }
      menu.appendChild(node);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var footer = document.createElement("div");
  footer.setAttribute(
    "style",
    "\n        display: flex;\n        margin-top: auto;\n    "
  );
  var link = document.createElement("a");
  link.href = "https://discord.gg/UuCqybVxP2";
  link.innerHTML = "DISCORD";
  link.target = "_blank";
  link.setAttribute(
    "style",
    "\n        color: #FFFFFFA0;\n        margin-top: auto;\n        margin-right: auto;\n        font-size: 70%;\n    "
  );
  footer.appendChild(link);
  counter.setAttribute(
    "style",
    "\n        color: #FFFFFFA0;\n        margin-top: auto;\n        margin-left: auto;\n        font-size: 70%;\n    "
  );
  footer.appendChild(counter);
  menu.appendChild(footer);
  var menuHolder = document.createElement("div");
  menuHolder.setAttribute(
    "style",
    "\n        position: absolute;\n        z-index: 999999;\n        top: 30%;\n        right: 20%;\n    "
  );
  menuHolder.appendChild(menu);
  dragElement(menuHolder);
  document.body.appendChild(menuHolder);
}
function setCount(amount) {
  counter.innerHTML = "".concat(amount, " Player(s) Online");
}
function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  var header = document.getElementById(elmnt.id + "header");
  if (header) {
    header.addEventListener("mousedown", dragMouseDown);
  } else {
    elmnt.addEventListener("mousedown", dragMouseDown);
  }
  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.addEventListener("mouseup", closeDragElement);
    document.addEventListener("mousemove", elementDrag);
  }
  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }
  function closeDragElement() {
    document.removeEventListener("mouseup", closeDragElement);
    document.removeEventListener("mousemove", elementDrag);
  }
}
window.addEventListener("DOMContentLoaded", addMenu);