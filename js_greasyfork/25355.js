// ==UserScript==
// @name         Oracle iAcademy suckless
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Basic Syntax Highlighting and Auto-Completion. Enter key intelligently Auto-completes or Auto-Runs the query. Table names completion NYI.
// @author       You
// @match        https://iacademy.oracle.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.21.0/codemirror.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.21.0/addon/hint/show-hint.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.21.0/addon/hint/sql-hint.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.21.0/mode/sql/sql.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.21.0/addon/selection/active-line.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.21.0/addon/edit/matchbrackets.js
// @downloadURL https://update.greasyfork.org/scripts/25355/Oracle%20iAcademy%20suckless.user.js
// @updateURL https://update.greasyfork.org/scripts/25355/Oracle%20iAcademy%20suckless.meta.js
// ==/UserScript==

// Like this? Share with your class! Send them a link to:
// https://greasyfork.org/en/scripts/25355-oracle-iacademy-suckless

// Know javascript? Please Takeover! I wrote this on the last day of class, there is lots of room for improvement!
// Post your forks on greasyfork and send me a link in feedback. I will redirect people to the most up-to-date script.

function importScript(src) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.src = src;
    document.body.appendChild(script);
    return script;
}
function importCSS(src) {
    var script = document.createElement('link');
    script.type = "text/css";
    script.rel='stylesheet';
    script.href = src;
    document.head.appendChild(script);
    return script;
}
importCSS("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.21.0/codemirror.css");
importCSS("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.21.0/addon/hint/show-hint.css");

importCSS("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.21.0/theme/neonsyntax.css");
//importScript();

// Wait a second or lineNumber will develop a overlaping problem
setTimeout(function() {

    
var ExcludedIntelliSenseTriggerKeys =
{
    "8": "backspace",
    "9": "tab",
    "13": "enter",
    "16": "shift",
    "17": "ctrl",
    "18": "alt",
    "19": "pause",
    "20": "capslock",
    "27": "escape",
    "33": "pageup",
    "34": "pagedown",
    "35": "end",
    "36": "home",
    "37": "left",
    "38": "up",
    "39": "right",
    "40": "down",
    "45": "insert",
    "46": "delete",
    "91": "left window key",
    "92": "right window key",
    "93": "select",
    "107": "add",
    "109": "subtract",
    "110": "decimal point",
    "111": "divide",
    "112": "f1",
    "113": "f2",
    "114": "f3",
    "115": "f4",
    "116": "f5",
    "117": "f6",
    "118": "f7",
    "119": "f8",
    "120": "f9",
    "121": "f10",
    "122": "f11",
    "123": "f12",
    "144": "numlock",
    "145": "scrolllock",
    "186": "semicolon",
    "187": "equalsign",
    "188": "comma",
    "189": "dash",
    "190": "period",
    "191": "slash",
    "192": "graveaccent",
    "220": "backslash",
    "222": "quote"
};


var RunBtn = document.getElementsByClassName('aButton hotButton')[0];
var RunSQL_Cmd;
if (RunBtn.textContent == 'Run') {
    RunSQL_Cmd = RunBtn.onclick;
}
    
var SQL_Box = document.getElementById('P1003_SQL_COMMAND1');
    CodeMirror.commands.autocomplete = function(cm) {
			CodeMirror.showHint(cm, CodeMirror.hint.sql);
		};
    var SQL_Mirror = CodeMirror.fromTextArea(SQL_Box, {
    mode: "text/x-sql",
    //theme: "neonsyntax",
    lineWrapping: true,
    lineNumbers: true,
    styleActiveLine: true,
    extraKeys: {
					"Ctrl-Space": "autocomplete"
				},
    matchBrackets: true,
  });
    SQL_Mirror.on("keyup", function(editor, event) {
        var __Cursor = editor.getDoc().getCursor();
        var __Token = editor.getTokenAt(__Cursor);

        if (!editor.state.completionActive &&
            !ExcludedIntelliSenseTriggerKeys[(event.keyCode || event.which).toString()] &&
            (__Token.type == "tag" || __Token.string == " " || __Token.string == "<" || __Token.string == "/" ))
        {
            CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
        } else if (event.keyCode == 13 && event.shiftKey === false) {
            RunSQL_Cmd();
            // TODO eat the enter keypress
        }
    });
    SQL_Mirror.setSize(SQL_Box.style.width, '100%');
    SQL_Mirror.on("change", function(cm, change) { cm.save(); });



    
}, 1000);