// ==UserScript==
// @icon         https://hackmd.io/favicon.png
// @name         VSCode shortcuts in CodeMirror
// @namespace    http://github.com/cliffxzx
// @version      0.1
// @description  Using VSCode shortcuts in CodeMirror (like HackMD, CodiMd etc ...)
// @author       Cliff Chen
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422202/VSCode%20shortcuts%20in%20CodeMirror.user.js
// @updateURL https://update.greasyfork.org/scripts/422202/VSCode%20shortcuts%20in%20CodeMirror.meta.js
// ==/UserScript==

'use strict';
(function() {
  if (typeof window.CodeMirror === 'function') {
    var Pos = window.CodeMirror.Pos;

    const duplicateLines = (cm, down = false) => {
        cm.operation(function() {
            debugger;
            let selectionRange = cm.listSelections();
            var rangeCount = selectionRange.length;
            for (var i = 0; i < rangeCount; i++) {
                var range = cm.listSelections()[i];
                let text = '';
                let start = Math.min(range.head.line, range.anchor.line);
                let end = Math.max(range.head.line, range.anchor.line);

                for(let j = start; j <= end; ++j) {
                    text += cm.getLine(j) + "\n";
                }

                if (down) {
                    const rangeLineCount = end - start + 1;
                    cm.replaceRange(text, Pos(end + 1, 0));
                    selectionRange[i].head.line += rangeLineCount;
                    selectionRange[i].anchor.line += rangeLineCount;
                } else {
                    cm.replaceRange(text, Pos(start, 0));
                }

            }
            cm.setSelections(selectionRange);
            cm.scrollIntoView();
        });
    }

    window.editor.addKeyMap({
        "Alt-Up": "swapLineUp",
        "Alt-Down": "swapLineDown",
        "Shift-Cmd-Alt-Up": "addCursorToPrevLine",
        "Shift-Cmd-Alt-Down": "addCursorToNextLine",
        "Cmd-K Cmd-0": "foldAll",
        "Shift-Alt-Up": (cm) => duplicateLines(cm),
        "Shift-Alt-Down": (cm) => duplicateLines(cm, true)
    });
  }
})();