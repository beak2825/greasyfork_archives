// ==UserScript==
// @description  Bind fd to <esc> in overleaf
// @name         Overleaf Editor Custom VIM Keybindings
// @namespace    overleaf_spacemacs
// @version      1
// @match        https://www.overleaf.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/393229/Overleaf%20Editor%20Custom%20VIM%20Keybindings.user.js
// @updateURL https://update.greasyfork.org/scripts/393229/Overleaf%20Editor%20Custom%20VIM%20Keybindings.meta.js
// ==/UserScript==
 
(function() {
    // poll until editor is loaded
    const retry = setInterval(() => {
      	console.log("Retry")
      	console.log(window.wikiEnabled)
        if (unsafeWindow._debug_editors === undefined) return
      	clearInterval(retry)
        // get current editor instance
        const editor = unsafeWindow._debug_editors[0]
        // vim keyboard plugin
        const vimKeyboard = unsafeWindow.ace.require("ace/keyboard/vim")
        // add custom keybindings - insert mode applies on insert
        vimKeyboard.Vim.map("fd", "<Esc>", "insert")
        // set the modified keyboard handler for editor
        editor.setKeyboardHandler(vimKeyboard.handler)
        console.log("Custom key bindings applied")
    }, 1000)
})();