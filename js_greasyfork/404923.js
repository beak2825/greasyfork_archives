// ==UserScript==
// @name         Bonk.io Anti lag
// @namespace    https://github.com/Hydra-Developer
// @version      0.1
// @description  reduce bonk.io lag
// @author       Hydra-Developer
// @contact      hydrasupport@hydra.com
// @match        http://bonk.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404923/Bonkio%20Anti%20lag.user.js
// @updateURL https://update.greasyfork.org/scripts/404923/Bonkio%20Anti%20lag.meta.js
// ==/UserScript==

var inline_src =
    
// Input 0
(function(scope) {
  if (scope["CFInstall"]) {
    return;
  }
  var isAvailable = function() {
    return false;
  };
  var CFInstall = {};
  CFInstall.check = function(args) {
    if (window.console && console.warn) {
      console.warn("method no longer notifies the user; see " + "https://github.com/Hydra-Developer" + "for more information.");
    }
  };
  CFInstall._force = false;
  CFInstall._forceValue = false;
  CFInstall.isAvailable = isAvailable;
  scope.CFInstall = CFInstall;
})(this["ChromeFrameInstallScope"] || this);
// Input 1
var resolution = 1;
var rate = 0;


var compiled = this.CoffeeScript.compile(inline_src);
eval(compiled);