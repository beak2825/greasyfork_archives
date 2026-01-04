// ==UserScript==
// @name     Event Listeners list
// @description Adds a method to elements to get their event listeners
// @version  1.0.1
// @grant    none
// @match    *://*/*
// @license  MIT
// @run-at   document-start
// @namespace https://greasyfork.org/users/223733
// @downloadURL https://update.greasyfork.org/scripts/395822/Event%20Listeners%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/395822/Event%20Listeners%20list.meta.js
// ==/UserScript==

function main() {
  var _addEventListener = Element.prototype.addEventListener;
  var _removeEventListener = Element.prototype.removeEventListener;

  Element.prototype.listEventListeners = function(name) {
    if (!name) return this._eventsList || {};
    if (!this._eventsList) return []
    return this._eventsList[name] || [];
  };

  Element.prototype.addEventListener = function(name, callback) {
    _addEventListener.bind(this)(name, callback);
    if (!this._eventsList) this._eventsList = {};
    if (!this._eventsList[name]) this._eventsList[name] = [];
    this._eventsList[name].push(callback);
  };

  Element.prototype.removeEventListener = function(name, callback) {
    _removeEventListener.bind(this)(name, callback);

    if (!this._eventsList) return;
    if (!this._eventsList[name]) return;
    this._eventsList[name].splice(this._eventsList[name].indexOf(callback), 1);
  };
}

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ main +')();'));
(document.body || document.head || document.documentElement).appendChild(script);