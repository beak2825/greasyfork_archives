// ==UserScript==
// @name         Silmerion Window Fix
// @namespace    SWF
// @version      1.1
// @description  Règle le problème faisant que la fenêtre du Silmerion empêche le clic ailleurs sur la page.
// @author       Anesca
// @match        https://www.dreadcast.net/Main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371206/Silmerion%20Window%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/371206/Silmerion%20Window%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // bout de code honteusement piqué à un anonyme du forum, merci à lui !
    // Permet de match un élément avec une regexp
    function getElementsByRegExpId(p_regexp, p_element, p_tagName) {
        p_element = p_element === undefined ? document : p_element;
        p_tagName = p_tagName === undefined ? '*' : p_tagName;
        var v_return = [];
        var v_inc = 0;
        for(var v_i = 0, v_il = p_element.getElementsByTagName(p_tagName).length; v_i < v_il; v_i++) {

            if(p_element.getElementsByTagName(p_tagName).item(v_i).id && p_element.getElementsByTagName(p_tagName).item(v_i).id.match(p_regexp)) {
                v_return[v_inc] = p_element.getElementsByTagName(p_tagName).item(v_i);
                v_inc++;
            }
        }
        return v_return;
   }

    function fixSilmerionsPopups() {
        var decks = getElementsByRegExpId(/^db_deck_\d{4,5}$/); //la fameuse regexp
        if (decks[0]){
            for(var i= 0; i < decks.length; i++){

                if(document.querySelector("#" + decks[i].id + " .content .deck_type_4") != null){ // permet de ne cibler que les silmerions
                    decks[i].style.width = null;
                    document.querySelector("#" + decks[i].id + " .content").style.height = null;
                    document.querySelector("#" + decks[i].id + " .content").style.marginTop = 0;
                }
            }
        }
    }
    document.getElementById('zone_dataBox').addEventListener("DOMNodeInserted", function(){setTimeout(fixSilmerionsPopups, 500);});
})();