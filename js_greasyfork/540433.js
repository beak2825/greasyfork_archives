// ==UserScript==
// @name         JSVL
// @namespace    Unseeable's Libraries
// @version      1.0.0
// @description  A simple tool that allows you to execute code when a global variable is located.
// @author       Colton Stone
// @homepage     https://github.com/Unseeable8710/JSVL
// @license      GPL-3.0-or-later
// @tag          utilities
// ==/UserScript==

function checkNested(obj, args) {
  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
}
function waitForGlobal(obj, keyPath, callback) {
  var args = keyPath.split('.');
  if (checkNested(obj, args)) {
    callback();
  } else {
    setTimeout(function() {
      waitForGlobal(keyPath, callback);
    }, 100);
  }
}
