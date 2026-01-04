// ==UserScript==
// @name        Unblock GameModels3D
// @namespace   Violentmonkey Scripts
// @match       *://gamemodels3d.com/*
// @grant       none
// @version     1.6
// @author      WengH
// @run-at      document-idle
// @description 2020/6/28 15:39:04
// @downloadURL https://update.greasyfork.org/scripts/406227/Unblock%20GameModels3D.user.js
// @updateURL https://update.greasyfork.org/scripts/406227/Unblock%20GameModels3D.meta.js
// ==/UserScript==

(function() {
    if (typeof viewer !== 'undefined') {
        viewer.saveButton.onclick = function() {
            self.saveModel(document.title.split(':')[0].trim())
        }
    }
    if (typeof loginForm !== 'undefined') {
        loginForm = function(a, b){
            console.log(a, b);
          
            if (['visual', 'armor', 'hitbox'].includes(a))
                go(a)
          
            else if (b !== undefined)
                SetModule(a, b)
              
            else if (a in VIEW.components)
                CONTROLLER.setComponents(a)
          
            else if (a in VIEW.characteristics)
                CONTROLLER.setCharacteristics(a)
        }
    }
})();
