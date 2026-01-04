// ==UserScript==
// @name         Overleaf morekeys
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Custom hotkeys for overleaf.com
// @author       manoj, markusmo3
// @match        https://www.overleaf.com/project/*
// @grant    GM_addStyle
// @run-at   document-start
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      http://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.1/mousetrap.min.js
// @require      http://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.1/plugins/global-bind/mousetrap-global-bind.min.js
// @downloadURL https://update.greasyfork.org/scripts/396389/Overleaf%20morekeys.user.js
// @updateURL https://update.greasyfork.org/scripts/396389/Overleaf%20morekeys.meta.js
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
    function shortcut(cmd) {
        var fn = function(editor) {
            var selection = editor.getSelection();
            if (selection.isEmpty()) {
                editor.insert(cmd+cmd);
                return editor.navigateLeft(1);
            }
            var text = editor.getCopyText();
            return editor.insert(cmd + text + cmd);
        }
        return fn;
    }
    function shortcutfunction(cmd) {
        var fn = function(editor) {
            var selection = editor.getSelection();
            if (selection.isEmpty()) {
                editor.insert("\\begin{" + cmd + "} \n\\end{" + cmd + "}");
                return editor.navigateLeft(1);
            }
            var text = editor.getCopyText();
            return editor.insert("\\begin{" + cmd + "}\n"+ text + "\n\\end{" + cmd + "}");
        }
        return fn;
    }
    function figure() {
        var fn = function(editor) {
            return editor.insert("\\begin{figure}[htb] \n\ \\centering \n\ \\includegraphics[width=\\columnwidth]{images/} \n\ \\caption{ } \n\ \\label{fig:} \n\ \\end{figure}");
                }
        return fn;
    }
     function equation() {
        var fn = function(editor) {
            return editor.insert("\\begin{equation}\n\n\\end{equation}");
                }
        return fn;
    }
    function table() {
        var fn = function(editor) {
            return editor.insert("\n\ \\begin{table}[htb] \n\ \\centering \n\ \\caption{} \n\ \\begin{tabularx}{\\columnwidth}{XXX}\n\ \\toprule \n\ & & \\\\ \n\ \\midrule[\\heavyrulewidth]\n\ & & \\\\ \n\ \\bottomrule\n\ \\end{tabularx}\n\ \\label{tab:}\n\ \\end{table}");
                }
        return fn;
    }
     function bracket() {
        var fn = function(editor) {
            var selection = editor.getSelection();
            if (selection.isEmpty()) {
                editor.insert("{ }");
                return editor.navigateLeft(1);
            }
            var text = editor.getCopyText();
            return editor.insert("{"+ text + "}");
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
        //Ctrl-Shift-m for adding inline math
        editor.commands.addCommand({
            name: "inlinemath",
            bindKey: {
                win: "Ctrl-Shift-M",
                mac: "Ctrl-Shift-M"
            },
            exec: shortcut('$'),
            readOnly: !1
        });
        
        //Ctrl-Shift-E for adding inline math
        editor.commands.addCommand({
            name: "equation",
            bindKey: {
                win: "Ctrl-Shift-E",
                mac: "Ctrl-Shift-E"
            },
            exec: shortcutfunction('equation'),
            readOnly: !1
        });
        //Ctrl-Shift-B for adding brackets
        editor.commands.addCommand({
            name: "bracket",
            bindKey: {
                win: "Ctrl-Shift-B",
                mac: "Ctrl-Shift-B"
            },
            exec: bracket(),
            readOnly: !1
        });
        // cref
        editor.commands.addCommand({
            name: "refrence",
            bindKey: {
                win: "Ctrl-Shift-R",
                mac: "Ctrl-Shift-R"
            },
            exec: encloser('cref'),
            readOnly: !1
        });
        //figure
          editor.commands.addCommand({
            name: "figure",
            bindKey: {
                win: "Ctrl-Shift-F",
                mac: "Ctrl-Shift-F"
            },
            exec: figure(),
            readOnly: !1
        });
          //equation
          editor.commands.addCommand({
            name: "eqn",
            bindKey: {
                win: "Ctrl-Shift-Q",
                mac: "Ctrl-Shift-Q"
            },
            exec: equation(),
            readOnly: !1
        });
        //taBLE
          editor.commands.addCommand({
            name: "table",
            bindKey: {
                win: "Ctrl-Shift-L",
                mac: "Ctrl-Shift-L"
            },
            exec: table(),
            readOnly: !1
        });
         // chemical formula
        editor.commands.addCommand({
            name: "chemicalFormula",
            bindKey: {
                win: "Ctrl-Shift-X",
                mac: "Ctrl-Shift-X"
            },
            exec: encloser('ch'),
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