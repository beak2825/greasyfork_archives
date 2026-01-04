// ==UserScript==
// @name         Keymap Overlay for Custom Layouts on monkeytype.com (Updated)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Swap keys repeatedly on a base keymap layout till you get your modified version of the layout
// @author       full alt
// @match        https://monkeytype.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428278/Keymap%20Overlay%20for%20Custom%20Layouts%20on%20monkeytypecom%20%28Updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428278/Keymap%20Overlay%20for%20Custom%20Layouts%20on%20monkeytypecom%20%28Updated%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function swap(key1, key2){
        var s1 = "[data-key='"+key1+"']"
        var s2 = "[data-key='"+key2+"']"
        var k1 = document.querySelectorAll(s1)[0];
        var k2 = document.querySelectorAll(s2)[0];
        k1.setAttribute("data-key",key2)
        k2.setAttribute("data-key",key1)
        var tempk1val = k1.getElementsByTagName("span")[0].innerText
        k1.getElementsByTagName("span")[0].innerText = k2.getElementsByTagName("span")[0].innerText
        k2.getElementsByTagName("span")[0].innerText = tempk1val
    }

    //just right click anywhere for the changes to be made
    //the goal is to have keys swap places with each other on the keymap to suit your layout
    window.oncontextmenu = async function (){
        //IMPORTANT: For letters use inputs like "hH" or "jJ" since the updated site has 2 characters being used
        //for symbols, if you don't know the what the key is then just inspect element the key and see what the 'id' of the element is
        /*
        OLD CODE, IGNORE THIS
        swap("O","Semicolon");
        swap("F","G");
        swap("Z","Quote");
        swap("K","Quote");
        swap("D","Quote");
        swap("C","Quote");
        swap("X","Quote");
        */
        await swap("vV","fF");
        await swap("mM","qQ");
        await swap("fF","zZ");
        await swap("gG","kK");
        await swap("pP","cC");
        await swap("fF","kK");
        await swap("mM","kK");
    };
})();