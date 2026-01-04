// ==UserScript==
// @name         GC - Inventory dropdown selector
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remembers the last dropdown selection
// @author       wibreth
// @match        https://www.grundos.cafe/itemview/*
// @match        https://www.grundos.cafe/useobject/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/462306/GC%20-%20Inventory%20dropdown%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/462306/GC%20-%20Inventory%20dropdown%20selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let itemaction = GM_getValue("itemaction", false);
    if (itemaction) {
        $('#itemaction_select').val(itemaction);
    }
    $('#itemaction_select').change(function() {
        itemaction = $('#itemaction_select').val();
        GM_setValue("itemaction", itemaction);
    });

    // useobject
    let recip =  GM_getValue("recip", false);
    if (recip) {
        $('#recip').val(recip);
    }
    $('#recip').change(function() {
        recip = $('#recip').val();
        GM_setValue("recip", recip);
    });

})();