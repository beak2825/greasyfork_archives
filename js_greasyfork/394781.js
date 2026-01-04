// ==UserScript==
// @name         Overleaf morekeys
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Custom hotkeys for overleaf.com
// @author       markusmo3
// @match        https://www.overleaf.com/project/*
// @grant    GM_addStyle
// @run-at   document-start
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      http://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.1/mousetrap.min.js
// @require      http://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.1/plugins/global-bind/mousetrap-global-bind.min.js
// @downloadURL https://update.greasyfork.org/scripts/394781/Overleaf%20morekeys.user.js
// @updateURL https://update.greasyfork.org/scripts/394781/Overleaf%20morekeys.meta.js
// ==/UserScript==
// original source: https://greasyfork.org/en/scripts/387109-overleaf-fileswitcher/code
(function($, undefined) {
     function encloser(cmd) {
        var fn = function(editor) {
            var selection = editor.getSelection();
            if (selection.isEmpty()) {
                editor.insert("\\" + cmd + "{}");
                return editor.navigateLeft(1);
            }
            var text = editor.getCopyText();
            return editor.insert("\\" + cmd + "{" + text + "}");
        }
        return fn;
    }

    function init() {
        console.log("activating custom overleaf hotkeys...");
        var editor = ace.edit($('.ace-editor-body')[0]);
        //console.log(editor);
        // ctrl-m to insert '\text'
        editor.commands.addCommand({
            name: "mathmode",
            bindKey: {
                win: "Ctrl-M",
                mac: "Command-M"
            },
            exec: encloser('text'),
            readOnly: !1
        });
        // custom hotkey by markusmo3
        editor.commands.byName['add-new-comment'].exec = editor.commands.byName.togglecomment.exec
        editor.commands.byName.copylinesdown.bindKey = {
            win: "Alt-Shift-Down|Ctrl-Shift-D",
            mac: "Command-Option-Down|Command-Shift-D"
        }
    }

    function wait_to_load(callback) {
        if ($('.loading-screen-brand').length > 0) {
            console.log("still loading");
            window.setTimeout(wait_to_load, 500, callback);
        } else {
            console.log("detected loading completion");
            window.setTimeout(callback, 200);
        }
    }

    $(document).ready(function() {
        wait_to_load(init);
        $(".ace_text-layer").on('DOMNodeInserted', function(e) {
            $(e.target).find('.ace_type:contains("section")').addClass("ace_section");
            $(e.target).find('.ace_type:contains("todo")').addClass("ace_todo");
        });
    });

})(window.jQuery.noConflict(true));

GM_addStyle ( `
    .ace_type {
        color: #5d9d54
    }
    .ace_section {
        color: #9d5454
    }
    .ace_todo {
        color: #D291C8
    }
` );