// ==UserScript==
// @name         Autoselect Statistics in Noteflight
// @namespace    Unseeable's Noteflight Tools
// @version      1.2.0
// @license      GPL-3.0-or-later
// @description  Automatically toggles the statistics option on at noteflight.com.
// @description:es Activa automáticamente la opción de estadísticas en noteflight.com.
// @description:fr Active automatiquement l'option statistiques sur noteflight.com.
// @description:de Schaltet die Statistikoption auf noteflight.com automatisch ein.
// @author       Colton Stone
// @tag          productivity
// @tag          utilities
// @match        *://noteflight.com/scores/view/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=noteflight.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/517573/Autoselect%20Statistics%20in%20Noteflight.user.js
// @updateURL https://update.greasyfork.org/scripts/517573/Autoselect%20Statistics%20in%20Noteflight.meta.js
// ==/UserScript==

(function() {
  var uwin = unsafeWindow;
  console.log(uwin);
  function checkNested(obj, args) {
    for (var i = 0; i < args.length; i++) {
      if (!obj || !obj.hasOwnProperty(args[i])) {
        return false;
      }
      obj = obj[args[i]];
    }
    return true;
  }
  function waitForGlobal(keyPath, callback) {
    var args = keyPath.split('.');
    if (checkNested(uwin, args)) {
      callback();
    } else {
      setTimeout(function() {
        waitForGlobal(keyPath, callback);
      }, 100);
    }
  }
  waitForGlobal("nfeditor", () => {
    uwin.nfeditor.targetElement = document.getElementById("r3app");
    const targetElement = uwin.nfeditor.targetElement;
    const keyPressEvent = new KeyboardEvent("keypress", {
      key: "t" || "T",
      altKey: true,
    });
    targetElement.dispatchEvent(keyPressEvent);
  });
})();