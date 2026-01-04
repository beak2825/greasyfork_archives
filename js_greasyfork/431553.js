
// ==UserScript==
// @name        GGn lucianjp uploady
// @namespace   https://gazellegames.net/
// @description This is a userscript to add helpers to the GGn upload page.
// @match       https://gazellegames.net/upload.php
// @version     0.0.1
// @author      lucianjp
// @icon        https://gazellegames.net/favicon.ico
// @supportURL  https://gazellegames.net/forums.php?action=viewthread&threadid=20638&postid=1478606#post1478606
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@1,npm/@violentmonkey/ui@0.5
// @run-at      document-start
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/431553/GGn%20lucianjp%20uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/431553/GGn%20lucianjp%20uploady.meta.js
// ==/UserScript==

(function () {
'use strict';

const menuIds = [];
function generateMenu(features) {
  if (menuIds.length > 0) {
    noty({
      text: "GGn Uploady Helpers options changed. Please refresh the page",
      timeout: 3500
    });
  }

  menuIds.forEach(id => GM_unregisterMenuCommand(id));

  for (const feature of features) {
    menuIds.push(GM_registerMenuCommand(`${feature.enabled ? "Disable" : "Enable"} ${feature.name}`, () => {
      feature.toggle();
      generateMenu(features);
    }));
  }
}

function _classPrivateFieldBase(receiver, privateKey) {
  if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
    throw new TypeError("attempted to use private field on non-instance");
  }

  return receiver;
}

var id = 0;
function _classPrivateFieldKey(name) {
  return "__private_" + id++ + "_" + name;
}

const hashCode = s => s.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0) | 0, 0);
const observe = (t, cb, once = false) => {
  let complete = true; // prevent error trapping to keep stacktrace but stop executing to prevent looping

  const disconnectHandler = VM.observe(document, () => {
    if (!complete) return true;
    complete = false;
    const node = document.querySelector(t);

    if (node) {
      cb(node);
      return true;
    }

    complete = true;
  });
  if (once) ready(disconnectHandler);
};
const ready = callback => {
  if (document.readyState != "loading") callback();else document.addEventListener("DOMContentLoaded", callback);
};

let readRules = new Set(JSON.parse(GM_getValue("rule_read") || "[]"));
let hideRead = true;

class Manager {
  constructor(table, toggleContainer) {
    this._rules = [];
    this._node = table;
    this.render = this.render.bind(this);
    this.toggle = this.toggle.bind(this);
    toggleContainer.append(document.createTextNode('\u00A0'));
    this._btnToggle = toggleContainer.appendChild(VM.createElement("a", {
      onClick: this.toggle
    }, "Show"));

    this._node.querySelector('tr.colhead').append(VM.createElement("td", null));

    this._node.querySelectorAll("tr:not(.colhead)").forEach(el => this._rules.push(new Rule(el, this.render)));

    this.render();
  }

  toggle() {
    hideRead = !hideRead;
    this._btnToggle.textContent = hideRead ? 'Show' : 'Hide';

    this._rules.forEach(rule => rule.render(!hideRead));

    this.render();
  }

  render() {
    this._node.hidden = hideRead && this._rules.every(rule => rule.seen);
    GM_setValue("rule_read", JSON.stringify([...(readRules = new Set(this._rules.filter(rule => rule.seen).map(rule => rule.id)))]));
  }

}

var _id = /*#__PURE__*/_classPrivateFieldKey("id");

var _text = /*#__PURE__*/_classPrivateFieldKey("text");

var _node = /*#__PURE__*/_classPrivateFieldKey("node");

var _seen = /*#__PURE__*/_classPrivateFieldKey("seen");

var _btnRead = /*#__PURE__*/_classPrivateFieldKey("btnRead");

var _actioncell = /*#__PURE__*/_classPrivateFieldKey("actioncell");

var _cb = /*#__PURE__*/_classPrivateFieldKey("cb");

class Rule {
  constructor(node, readCallback) {
    Object.defineProperty(this, _id, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _text, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _node, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _seen, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _btnRead, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _actioncell, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _cb, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldBase(this, _node)[_node] = node;
    _classPrivateFieldBase(this, _text)[_text] = _classPrivateFieldBase(this, _node)[_node].querySelector("td").textContent;
    _classPrivateFieldBase(this, _id)[_id] = hashCode(_classPrivateFieldBase(this, _text)[_text]);
    _classPrivateFieldBase(this, _seen)[_seen] = readRules.has(_classPrivateFieldBase(this, _id)[_id]);
    _classPrivateFieldBase(this, _actioncell)[_actioncell] = _classPrivateFieldBase(this, _node)[_node].appendChild(VM.createElement("td", null));
    this.read = this.read.bind(this);
    _classPrivateFieldBase(this, _cb)[_cb] = readCallback;
    this.render();
  }

  get id() {
    return _classPrivateFieldBase(this, _id)[_id];
  }

  get seen() {
    return _classPrivateFieldBase(this, _seen)[_seen];
  }

  read() {
    _classPrivateFieldBase(this, _seen)[_seen] = true;
    this.render();

    _classPrivateFieldBase(this, _cb)[_cb]();
  }

  render(visible = false) {
    if (_classPrivateFieldBase(this, _seen)[_seen]) {
      var _classPrivateFieldLoo;

      (_classPrivateFieldLoo = _classPrivateFieldBase(this, _btnRead)[_btnRead]) == null ? void 0 : _classPrivateFieldLoo.remove();
      _classPrivateFieldBase(this, _node)[_node].hidden = !visible && hideRead;
    } else {
      var _classPrivateFieldLoo2;

      _classPrivateFieldBase(this, _btnRead)[_btnRead] = (_classPrivateFieldLoo2 = _classPrivateFieldBase(this, _btnRead)[_btnRead]) != null ? _classPrivateFieldLoo2 : _classPrivateFieldBase(this, _actioncell)[_actioncell].appendChild(VM.createElement("a", {
        id: "markread",
        onClick: this.read
      }));
      _classPrivateFieldBase(this, _node)[_node].hidden = false;
    }
  }

}

function dynamicRules () {
  observe('#dnu_header ~ table', node => {
    new Manager(node, node.previousElementSibling);
  });
}

var _name = /*#__PURE__*/_classPrivateFieldKey("name");

var _enabled = /*#__PURE__*/_classPrivateFieldKey("enabled");

var _action = /*#__PURE__*/_classPrivateFieldKey("action");

class Feature {
  get name() {
    return _classPrivateFieldBase(this, _name)[_name];
  }

  get enabled() {
    return _classPrivateFieldBase(this, _enabled)[_enabled];
  }

  set enabled(enabled) {
    if (_classPrivateFieldBase(this, _enabled)[_enabled] !== enabled) {
      _classPrivateFieldBase(this, _enabled)[_enabled] = enabled;
      GM_setValue(`feature_${_classPrivateFieldBase(this, _action)[_action].name}`, _classPrivateFieldBase(this, _enabled)[_enabled]);
    }
  }

  constructor(name, action) {
    var _GM_getValue;

    Object.defineProperty(this, _name, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _enabled, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _action, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldBase(this, _name)[_name] = name;
    _classPrivateFieldBase(this, _action)[_action] = action;
    this.enabled = (_GM_getValue = GM_getValue(`feature_${_classPrivateFieldBase(this, _action)[_action].name}`)) != null ? _GM_getValue : true;

    if (this.enabled) {
      _classPrivateFieldBase(this, _action)[_action]();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
  }

}

generateMenu([new Feature("Readable Rules", dynamicRules) // new Feature("template", "Templates", templates),
]);

}());
