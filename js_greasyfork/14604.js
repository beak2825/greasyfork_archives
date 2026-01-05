// ==UserScript==
// @id ScriptSettings
// @name ScriptSettings
// @description Allows you to manage script settings through GM menu
// @include *
// @run-at document-end
// ==/UserScript==
'use strict';
function ScriptSettings(a) {
  this.schema = a;
  this.proxy = new Proxy(this, {
      get : this.get.bind(this),
      set : this.set.bind(this),
      keys : this.keys.bind(this)
    });
  this.gui = {};
  this.createGUI();
  return this.proxy;
}
ScriptSettings.prototype.getDefault = function (a) {
  if (Array.isArray(this.schema[a])) {
    return this.schema[a][0];
  }
  switch (typeof this.schema[a]) {
  case 'number': ;
  case 'boolean': ;
  case 'string':
    return this.schema[a];
  default:
    throw Error('OH SHIT!'); ;
  }
};
ScriptSettings.prototype.get = function (a, b) {
  return GM_getValue(b, this.getDefault(b));
};
ScriptSettings.prototype.set = function (a, b, c) {
  GM_setValue(b, c);
  if (void 0 !== this.gui[b]) {
    this.gui[b].onChange();
  }
};
ScriptSettings.prototype.keys = function () {
  return GM_listValues();
};
ScriptSettings.prototype.createGUI = function () {
  for (let a in this.schema) {
    this.gui[a] = new SettingGui(this, a);
  }
};
function SettingGui(a, b) {
  let c = void 0;
  if (Array.isArray(a.schema[b])) {
    c = SettingEnum;
  } else {
    switch (typeof a.schema[b]) {
    case 'number':
      c = SettingNumber;
      break;
    case 'boolean':
      c = SettingBoolean;
      break;
    case 'string':
      c = SettingString;
      break;
    default:
      throw Error('Unsupported type: ' + typeof a.schema[b]); ;
    }
  }
  var d = Object.create(c.prototype);
  d.settings = a;
  d.name = b;
  d.act = d.act.bind(d);
  d.onChange();
  c.call(d, b);
  return d;
}
SettingGui.prototype.onChange = function () {
  this.command && GM_unregisterMenuCommand(this.command);
  this.command = GM_registerMenuCommand(this.name + ':' + this.settings.proxy[this.name], this.act);
};
SettingGui.prototype.act = function () {
  this.settings.proxy[this.name] = this.ackquire();
};
function SettingEnum(a) {
  this.val = 0;
}
SettingEnum.prototype = Object.create(SettingGui.prototype);
SettingEnum.prototype.ackquire = function () {
  this.val = (this.val + 1) % this.settings.schema[this.name].length;
  return this.settings.schema[this.name][this.val];
};
function SettingString(a) {}
SettingString.prototype = Object.create(SettingGui.prototype);
SettingString.prototype.ackquire = function () {
  return prompt('input new value of ' + this.name, this.settings.proxy[this.name]);
};
function SettingNumber(a) {}
SettingNumber.prototype = Object.create(SettingString.prototype);
SettingNumber.prototype.ackquire = function () {
  this.settings.proxy[this.name] = new Number(SettingString.prototype.ackquire.call(this));
};
function SettingBoolean(a) {}
SettingBoolean.prototype = Object.create(SettingString.prototype);
SettingBoolean.prototype.ackquire = function () {
  this.settings.proxy[this.name] = !this.settings.proxy[this.name];
};