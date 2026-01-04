// ==UserScript==
// @name         Overleaf Editor Custom VIM Keybindings (legacy, for Ace editor only)
// @description  Configure a list of shortcuts for Vim-mode + :commands for toggling panes on Overleaf
// @namespace    http://tampermonkey.net/
// @version      0.3.7
// @match        https://www.overleaf.com/project/*
// @grant        none
// Source 1: https://groups.google.com/d/msg/ace-discuss/gwXMzUM17I4/9B_acHBSCQAJ
// Source 2: https://www.overleaf.com/learn/how-to/How_can_I_define_custom_Vim_macros_in_a_vimrc_file_on_Overleaf%3F
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/401089/Overleaf%20Editor%20Custom%20VIM%20Keybindings%20%28legacy%2C%20for%20Ace%20editor%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/401089/Overleaf%20Editor%20Custom%20VIM%20Keybindings%20%28legacy%2C%20for%20Ace%20editor%20only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // poll until editor is loaded
      setTimeout(function(){
            var card;
            var editor = window._debug_editors[window._debug_editors.length -1]
            $(document).keyup(function(event){
                    switch(event.keyCode) {
                    case 27:
                    esc()
                    case 96:
                    esc()
                    }
                    });
            function esc(){
            card = $('.writefull-suggest-card');
            if(card.css("display")=='flex'){
                card.css("display",'none')
                // Restore the focus back to ACE editor
                // Ref: https://groups.google.com/g/ace-discuss/c/1_AXADucTEA/m/cc2KZQMtDgAJ?utm_medium=email&utm_source=footer
                editor.focus() // side-effect - a side box is drawn
            }
            };
            var DA = {48:-1,49:0,50:1,51:2};
            $(document).keypress(function(e){
                    if(e.which>47 && e.which < 52){
                    card = $('.writefull-suggest-card');
                    if(card.css("display")=='flex'){
                    console.log(DA[e.which])
                    card.find('li.replacement').eq(DA[e.which])[0].click();
                    // Ref: https://groups.google.com/g/ace-discuss/c/1_AXADucTEA/m/cc2KZQMtDgAJ?utm_medium=email&utm_source=footer
                    editor.focus() // side-effect - a side box is drawn
                    }
                    }
                    });

    },2000);
    // End of chunk
    // The following chunk is the main Vim emulator piece, defining a bunch of functions + shortcuts + remapping of keys.
    const retry = setInterval(() => {
        if (window._debug_editors === undefined) return
        clearInterval(retry)
        // get current editor instance
        // get current editor instance
        var editor = window._debug_editors[window._debug_editors.length -1]
        // Option for a vertical split. Source: https://stackoverflow.com/a/24417327/3925312
        editor.setOption("showPrintMargin", true)
        // session wrap at 80: thanks to help from Harutyun Amirjanyan,
        // Source: https://groups.google.com/g/ace-discuss/c/gjLwB6Bmj0c/m/cdkIvkXuAgAJ
        //editor.setOption("wrap", 80)
        // Enforcing soft-wrap while allowing for auto-completion (not killing it).
        ace.config.on("session", function(session) {
        //    session.setOption("wrap", 80) // This may break auto-completion.
        session.setWrapLimitRange(80, 80) //Caveat: no more wrap to the pane of size smaler than 80 col.
        })
        // Unbind Ctrl+L ==> for Overleaf, this is to go to certain line/location. Not necessary with Vim bindings
        editor.commands.bindKeys({"ctrl-l":null})
        // vim keyboard plugin
        var vimKeyboard = window.ace.require("ace/keyboard/vim")
        ////////////////////////////////////////////////////////////
        // 2021-10-20 - https://groups.google.com/g/ace-discuss/c/2hwMMzBbYH8/m/Q0l9vJAqBQAJ?utm_medium=email&utm_source=footer
        // g0, g$, and g^ as a bonus
        vimKeyboard.handler.defaultKeymap.push({
            keys: "g$", type: "motion", motion: "moveToLineEnd"
        }, {
            keys: "g^", type: "motion", motion: "moveToLineStart"
        }, {
            keys: "g0", type: "motion", motion: "moveToLineStart"
        })
        vimKeyboard.Vim.defineMotion("moveToLineEnd", function(cm) {
            cm.ace.selection.moveCursorLineEnd()
            cm.ace.selection.clearSelection()
            return cm.getCursor()
        })
        vimKeyboard.Vim.defineMotion("moveToLineStart", function(cm) {
            cm.ace.selection.moveCursorLineStart()
            cm.ace.selection.clearSelection()
            return cm.getCursor()
        })
        // j k within long lines
        vimKeyboard.Vim.map("j", "gj", "normal")
        vimKeyboard.Vim.map("k", "gk", "normal")
        // Override $ and 0
        vimKeyboard.Vim.map("0", "g0", "normal")
        vimKeyboard.Vim.map("$", "g$", "normal")
        // add custom keybindings - insert mode applies on insert
        vimKeyboard.Vim.map("jj", "<Esc>", "insert")
        // Equilivantly, from https://groups.google.com/d/msg/ace-discuss/gwXMzUM17I4/9B_acHBSCQAJ
        // window.ace.require("ace/keyboard/vim").Vim.map('jj', '<Esc>', 'insert')
        vimKeyboard.Vim.map("jk", "<Esc>", "insert")
        ////////////////////////////////////////////////////////////
        // Remapping one key to another is doable, in Normal mode
        // `nmap h j` can be defined as the following:
        // Though, why should this mapping be here anyways? It is just meant for demo purpose.
        // vimKeyboard.Vim.map("h", "j", "normal")
        // Define local commands ==> matching elements along with a identifier that matches.
        // Maintenance note: if one hotkey/cmd does not work, check here for the matching HTML element.
        editor.commands.addCommands(
        [
        { // Note, this is not working as the element will change to "Split screen"
          // At least, we need an "or-condition" for the querySelector.
            name: "Projects",
            exec: function() {
              document.querySelector('a[class*="toolbar-header-back-projects"]').click()
            }
        },
        { // Note, this is not working as the element will change to "Split screen"
          // At least, we need an "or-condition" for the querySelector.
            name: "FullScreen",
            exec: function() {
              document.querySelector('a[tooltip*="Full screen"]').click()
            }
        },
        {
            name: "ToggleHistory",
            exec: function() {
              document.querySelector('.fa-history').click()
            }
        },
        {
            name: "ToggleLog",
            exec: function() {
              document.querySelector('.log-btn').click()
            }
        },
        {
            name: "jumpToPdf",
            exec: function() {
                document.querySelector(".fa-arrow-right").click()
            }
        },
          {
            name: "VimtexTocToggle",
            exec: function() {
                document.querySelector('a[tooltip*="the file-tree"]').click()
            }
        }, {
            name: "CloseComment",
            exec: function() {
                document.querySelector('a[class*="review-panel-toggler"]').click()
            }
        }, {
            name: "TogglePDF",
            exec: function() {
                //document.querySelector('a[tooltip*="the PDF"]').click() // This stops working (2022-01-31)
                document.querySelector('a[class*="custom-toggler-east"]').click()
            }
        }, {
            name: "OmegaPress",
            exec: function() {
                // For the Toggle Symbol Palette, press it twice, to remove the gray-box should the Overleaf project is page is restored.
                document.querySelector('button[tooltip*="Toggle Symbol Palette"]').click()
                document.querySelector('button[tooltip*="Toggle Symbol Palette"]').click()
            }
        }, {
            name: "FindTypoNext",
            exec: function() {
                document.querySelector('mwc-icon-button[id="writefull-next"]').click()
            }
        }, {
            name: "FindTypoPrevious",
            exec: function() {
                document.querySelector('mwc-icon-button[id="writefull-previous"]').click()
            }
        }, {
            name: "TestFocus",
            exec: function() {
                editor.focus()
            }
        }])
        // add keybindings for jump to pdf
        vimKeyboard.Vim.mapCommand("\\v", "action", "aceCommand",
            { name: "VimtexTocToggle" }, { context: "normal" });
        vimKeyboard.Vim.mapCommand("\\lv", "action", "aceCommand",
            { name: "jumpToPdf" }, { context: "normal" });
        vimKeyboard.Vim.mapCommand("\\o", "action", "aceCommand",
            { name: "TogglePDF" }, { context: "normal" });

        // add keybindgs for jump to typos
        // Note, [s and ]s has unknown complications. Just avoid using it.
        vimKeyboard.Vim.mapCommand("\]", "action", "aceCommand",
            { name: "FindTypoNext" }, { context: "normal" });
        //vimKeyboard.Vim.mapCommand("N", "action", "aceCommand",
            //{ name: "FindTypoNext" }, { context: "normal" });
        vimKeyboard.Vim.mapCommand("\[", "action", "aceCommand",
            { name: "FindTypoPrevious" }, { context: "normal" });
        //vimKeyboard.Vim.mapCommand("P", "action", "aceCommand",
            //{ name: "FindTypoPrevious" }, { context: "normal" });

        // ESC to regain focus
        vimKeyboard.Vim.mapCommand("<ESC>", "action", "aceCommand",
            { name: "TestFocus" }, { context: "normal" });

        // bind to ;lv
        vimKeyboard.Vim.unmap(";")
        vimKeyboard.Vim.unmap(",")
        vimKeyboard.Vim.unmap("\[\[")
        vimKeyboard.Vim.unmap("\]\]")
        vimKeyboard.Vim.map(";lv", "\\lv", "normal")
        vimKeyboard.Vim.map(",v", "\\v", "normal")

        // Use ,o to activate two hotkeys: hide file-menu and hide PDF preview
        vimKeyboard.Vim.map(",o", "\\v\\o", "normal")
        //vimKeyboard.Vim.mapCommand(",o", "action", "aceCommand",
        //    { name: "FullScreen" }, { context: "normal" });

        //Use cmd statment to change theme: :light vs :dark
            //Ref: https://github.com/Seldaek/php-console/issues/36
        vimKeyboard.Vim.defineEx("light", "", ()=>editor.setTheme("ace/theme/dreamweaver"))
        vimKeyboard.Vim.defineEx("dark", "", ()=>editor.setTheme("ace/theme/gruvbox"))
        //vimKeyboard.Vim.defineEx("full", "", ()=>editor.commands.exec("FullScreen"))
        vimKeyboard.Vim.defineEx("home", "", ()=>editor.commands.exec("Projects"))
        vimKeyboard.Vim.defineEx("back", "", ()=>editor.commands.exec("Projects"))
        vimKeyboard.Vim.defineEx("history", "", ()=>editor.commands.exec("ToggleHistory"))
        vimKeyboard.Vim.defineEx("log", "", ()=>editor.commands.exec("ToggleLog"))
        vimKeyboard.Vim.defineEx("ShowPDF", "", ()=>editor.commands.exec("TogglePDF"))
        vimKeyboard.Vim.defineEx("ClosePDF", "", ()=>editor.commands.exec("TogglePDF"))
        vimKeyboard.Vim.defineEx("OpenPDF", "", ()=>editor.commands.exec("TogglePDF"))
        vimKeyboard.Vim.defineEx("PDF", "", ()=>editor.commands.exec("TogglePDF"))
        vimKeyboard.Vim.defineEx("pdf", "", ()=>editor.commands.exec("TogglePDF"))
        // Close comment: CC, cc, CloseComment
        vimKeyboard.Vim.defineEx("CloseComment", "", ()=>editor.commands.exec("CloseComment"))
        vimKeyboard.Vim.defineEx("CC", "", ()=>editor.commands.exec("CloseComment"))
        vimKeyboard.Vim.defineEx("cc", "", ()=>editor.commands.exec("CloseComment"))
        // Toggl the omega icon, for symbol palette
        vimKeyboard.Vim.defineEx("o", "", ()=>editor.commands.exec("OmegaPress"))
        // Test editor-focus
        vimKeyboard.Vim.defineEx("focus", "", ()=>editor.commands.exec("TestFocus"))
        // Test typo-find
        vimKeyboard.Vim.defineEx("tnext", "", ()=>editor.commands.exec("FindTypoNext"))
        // set the modified keyboard handler for editor
        editor.setKeyboardHandler(vimKeyboard.handler)
        console.log("Custom key bindings applied")
    }, 100)
})();
