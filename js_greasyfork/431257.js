// ==UserScript==
// @name         hideLeftPanel
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Esconde o painel esquerdo de conversas do WhatsApp. Apenas pressione Ctrl + Alt ou Alt + Ctrl
// @author       NoiselessMilk#0069
// @match        https://web.whatsapp.com/
// @icon         https://www.google.com/s2/favicons?domain=whatsapp.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431257/hideLeftPanel.user.js
// @updateURL https://update.greasyfork.org/scripts/431257/hideLeftPanel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var index = 0
    
    document.onkeydown = function(e) {
        if (e.altKey) {
            var sidepanel = document.getElementById('app').children[0].children[5].children[2]
        
            index += 1
        
            switch(index) {
                case 1:
                    sidepanel.style.display = 'none'
                    break;
                case 2:
                    sidepanel.style.display = 'block'
                    index = 0
                    break;
            }
        }
    }
})();