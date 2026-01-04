// ==UserScript==
// @name        Dragon Lib
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      OinkDaPig
// @description universal utilitys
// @grant       GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/533266/Dragon%20Lib.user.js
// @updateURL https://update.greasyfork.org/scripts/533266/Dragon%20Lib.meta.js
// ==/UserScript==

class DragonLib {
  constructor() {
    this.Style = function(styling) {
        return GM_addElement("style", styling)
      }

    this.Run = function(execute) {
      return GM_addElement("script", execute)
    }
    this.Insert = function(lib) {
      GM_addElement("script", {src: lib})
    }

  }
}
