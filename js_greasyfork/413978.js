// ==UserScript==
// @name         overleaf clopnaz
// @namespace    http://tampermonkey.net/
// @version      1.0
// @match        https://www.overleaf.com/project/*
// @grant        none
// @description  does :set tabstop=2 and :set softtabs in Overleaf's vim editor
// @downloadURL https://update.greasyfork.org/scripts/413978/overleaf%20clopnaz.user.js
// @updateURL https://update.greasyfork.org/scripts/413978/overleaf%20clopnaz.meta.js
// ==/UserScript==

// In overleaf's vim editor (see 'ACE'), you can't do many ':' commands
// this script changes the tabwidth to 2 and uses spaces instead of tabs
// there's some additional commented code that should help with remapping as well
(function() {
    'use strict';
    // get the ACE editor so we can modify settings
    const retry = setInterval(() => {
        if (window._debug_editors[window._debug_editors.length -1].session === undefined) return
        clearInterval(retry) // poll until editor is loaded
        // get current editor instance
        const editor = window._debug_editors[window._debug_editors.length -1]
        // vim keyboard plugin
        
        ace.config.on("session", function(session) {
            //    session.setOption("wrap", 80) // This may break auto-completion.
            // session.setWrapLimitRange(80, 80) //Caveat: no more wrap to the pane of size smaler than 80 col.
            session.setOption('tabSize',2) // set the width of tabs to 2 
            session.setOption('useSoftTabs', true) // use soft tabs 
            console.log("Custom tabwidth applied")
        })
        // // add custom keybindings - insert mode applies on insert
        // vimKeyboard.Vim.map("jj", "<Esc>", "insert")
        // // normal mode applies while escaped
        // vimKeyboard.Vim.map("h", "j", "normal")
        // // set the modified keyboard handler for editor
        // editor.setKeyboardHandler(vimKeyboard.handler)
        

    }, 100)
})();
