// ==UserScript==
// @name         cloudlatex keyboard shortcuts
// @namespace    zeicold
// @version      0.1
// @description  ctrl+s = save, ctrl + b = compile
// @author       Zeicold
// @match        https://cloudlatex.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21669/cloudlatex%20keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/21669/cloudlatex%20keyboard%20shortcuts.meta.js
// ==/UserScript==

$(document).on("keydown", function(e){
    if (e.ctrlKey && e.which === 83) {
        var save=w2ui.myToolbar;
        if (save) save.click('item0', event);
		e.preventDefault();
        return false;
    }
    if (e.ctrlKey && e.which === 66) {
        var compile=w2ui.myToolbar;
        if (compile) compile.click('item1', event);
		e.preventDefault();
        return false;
    }
});