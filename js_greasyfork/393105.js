// ==UserScript==
// @name         Matrice RP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.dreadcast.net/Main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393105/Matrice%20RP.user.js
// @updateURL https://update.greasyfork.org/scripts/393105/Matrice%20RP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals $ */

    // COMMANDES A AJOUTER ICI !!!!!!!!
    var commands = [
        { alias:"env", name:"Environment", color:"008000", bold:false, rp:true },
        { alias:"sis", name:"Ta soeur", color:"00FFFF", bold:false, rp:false },
        { alias:"creapy", name:"Le Monstre", color:"FF00FF", bold:false, rp:true }
        ];

    var chatInput = $("#chatForm .text_chat");

    var ameliorInput = function(e) {
        if (e.keyCode==13) {

            var chatInputValue = chatInput.val();

            commands.forEach(command => {
                var reg = new RegExp("^\/"+command.alias, "i");
                if (reg.test(chatInputValue)) {

                    chatInputValue = (command.rp ? "/me" : "")
                        + "[b][c=" + command.color + "]{" + command.name + "}[/c][/b]"
                        + (command.bold ? "[b]" : "")
                         + "[c=" + command.color + "]" + chatInputValue.substr(command.alias.length + 1) + "[/c]"
                        + (command.bold ? "[/b]" : "");

                    //TODO: Pré-calcul de la place que prendront les balises. Balisage que si ne dépasse pas 200 caractères, balises comprises.

                    chatInput.val(chatInputValue);
                }
            });

        }
    };

    chatInput.on('keypress', ameliorInput);
})();