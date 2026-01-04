// ==UserScript==
// @name         Overleaf editor: map j to gj and k to gk
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://www.overleaf.com/project/*
// @grant        none
// @description  Remap j/k to gj/gk in Overleaf Vim mode editor
// @downloadURL https://update.greasyfork.org/scripts/390507/Overleaf%20editor%3A%20map%20j%20to%20gj%20and%20k%20to%20gk.user.js
// @updateURL https://update.greasyfork.org/scripts/390507/Overleaf%20editor%3A%20map%20j%20to%20gj%20and%20k%20to%20gk.meta.js
// ==/UserScript==
//Based on code from https://www.overleaf.com/learn/how-to/How_can_I_define_custom_Vim_macros_in_a_vimrc_file_on_Overleaf%3F
 
(function() {
    'use strict';
    // poll until editor is loaded
    const retry = setInterval(() => {
        if (window._debug_editors === undefined) return
        clearInterval(retry)
        // get current editor instance
        const editor = window._debug_editors[window._debug_editors.length -1]
        // vim keyboard plugin
        const vimKeyboard = window.ace.require("ace/keyboard/vim")
        vimKeyboard.Vim.map("j", "gj", "normal")
        vimKeyboard.Vim.map("k", "gk", "normal")
        // set the modified keyboard handler for editor
        editor.setKeyboardHandler(vimKeyboard.handler)
        console.log("Custom key bindings applied")
    }, 100)
})();