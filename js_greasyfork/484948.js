// ==UserScript==
// @name         gun.deals
// @namespace    http://www.ziffusion.com/
// @description  Highlights new listings since last visit.
// @author       ziffusion
// @match        https://gun.deals/*
// @grant        none
// @version      0.1
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484948/gundeals.user.js
// @updateURL https://update.greasyfork.org/scripts/484948/gundeals.meta.js
// ==/UserScript==

// defaults
var scriptID = 'ziffusion_gun_deals';

// functions
function addStyle(css) {
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  document.getElementsByTagName('head')[0].appendChild(style);
}

function fmt(key, value) {
  switch (key) {
    case 'history':
      key = key + '[' + value.length + ']';
      break;
  }
  return key + '=' + JSON.stringify(value);
}

// session data
var data;
if (!(data = localStorage.getItem(scriptID))) {
  data = JSON.stringify({});
}
data = JSON.parse(data);
if (!data.hasOwnProperty("history")) {
  data.history = [];
}
data.reset = function() {
  this.history = [];
};
data.historyAdd = function(key) {
  // bump the oldest one
  while (this.history.length > 10) this.history.shift();
  this.history.push(key);
};

// search params
for (const [key, value] of new URLSearchParams(window.location.search)) {
  switch (key) {
    case 'show':
      var op = '';
      for (const [key, value] of Object.entries(data)) if (!(value instanceof Function)) op += fmt(key, value) + '\n\n';
      alert(op);
      break;
    case 'reset':
      data.reset();
      break;
  }
}
// for faster lookups
var history = data.history.reduce((dict, key) => { dict[key] = true; return dict; }, {});

// mod: make visited links red
addStyle("a:visited { color: red; }");

// mod: mark the nodes
var count = 0;
for (var node of document.getElementsByClassName("tile tile--product")) {
  var key = node.getAttribute("data-nid");
  // mod: mark
  if (key in history) {
    node.style.background = "#89C4EC"; // #dfeffa
  } else if (count == 0) {
    data.historyAdd(key);
    node.style.background = "#faeadf"; // #dfeffa
  }
  count++;
}

// save session state
localStorage.setItem(scriptID, JSON.stringify(data));