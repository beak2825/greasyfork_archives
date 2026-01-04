// ==UserScript==
// @name         Overleaf - automatic hardwrap
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Set a hard linebreak at 80th col
// @author       Harutyun Amirjanyan 
// @match        https://www.overleaf.com/project/*
// @icon         https://www.google.com/s2/favicons?domain=overleaf.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434277/Overleaf%20-%20automatic%20hardwrap.user.js
// @updateURL https://update.greasyfork.org/scripts/434277/Overleaf%20-%20automatic%20hardwrap.meta.js
// ==/UserScript==

vimKeyboard = ace.require("ace/keyboard/vim")

vimKeyboard.handler.defaultKeymap.push({
    keys: 'gq',
    type: 'operator',
    operator: 'hardWrap'
})
vimKeyboard.Vim.defineOperator("hardWrap", function(cm, operatorArgs, ranges, oldAnchor, newHead) {
    var anchor = ranges[0].anchor.line;
    var head = ranges[0].head.line;
    if (anchor < head) {
        hardWrap(cm.ace, anchor, head);
    } else {
        hardWrap(cm.ace, head, anchor);
    }
    return cm.getCursor()
})
 
var editor = document.querySelector(".ace_editor").env.editor
editor.setOption("printMarginColumn", 80)
editor.commands.on("afterExec", function(e) {
    if (e.command.name == "insertstring" && /\S/.test(e.args)) {
        var cursor = editor.selection.cursor
        if (cursor.column <= editor.renderer.$printMarginColumn) return
        var wrapped = hardWrap(editor, {
            startRow: cursor.row, endRow: cursor.row,
            allowMerge: false
        })
        if (wrapped) editor.session.markUndoGroup()
    }

}) 
 
var Range = ace.Range

function hardWrap(editor, options) {
    var max = options.column || editor.getOption("printMarginColumn");
    var allowMerge = options.allowMerge != false
       
    var row = Math.min(options.startRow, options.endRow);
    var endRow = Math.max(options.startRow, options.endRow);
    
    var session = editor.session;
    
    while (row <= endRow) {
        var line = session.getLine(row);
        if (line.length > max) {
            var space = findSpace(line, max, 5);
            if (space) {
                session.replace(new Range(row,space.start,row,space.end), "\n");
            }
            endRow++;
        } else if (allowMerge && /\S/.test(line) && row != endRow) {
            var nextLine = session.getLine(row + 1);
            if (nextLine && /\S/.test(nextLine)) {
                var trimmedLine = line.replace(/\s+$/, "");
                var trimmedNextLine = nextLine.replace(/^\s+/, "");
                var mergedLine = trimmedLine + " " + trimmedNextLine;

                var space = findSpace(mergedLine, max, 5);
                if (space && space.start > trimmedLine.length || mergedLine.length < max) {
                    var replaceRange = new Range(row,trimmedLine.length,row + 1,nextLine.length - trimmedNextLine.length);
                    session.replace(replaceRange, " ");
                    row--;
                    endRow--;
                }
            }
        }
        row++;
    }

    function findSpace(line, max, min) {
        if (line.length < max)
            return;
        var before = line.slice(0, max);
        var after = line.slice(max);
        var spaceAfter = /^(?:(\s+)|(\S+)(\s+))/.exec(after);
        var spaceBefore = /(?:(\s+)|(\s+)(\S+))$/.exec(before);
        var start = 0;
        var end = 0;
        if (spaceBefore && !spaceBefore[2]) {
            start = max - spaceBefore[1].length;
            end = max;
        }
        if (spaceAfter && !spaceAfter[2]) {
            if (!start)
                start = max;
            end = max + spaceAfter[1].length;
        }
        if (start) {
            return {
                start: start,
                end: end
            };
        }
        if (spaceBefore && spaceBefore[2] && spaceBefore.index > min) {
            return {
                start: spaceBefore.index,
                end: spaceBefore.index + spaceBefore[2].length
            };
        }

    }

}