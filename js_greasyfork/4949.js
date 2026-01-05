// ==UserScript==
// @name Textarea Plus
// @version 3.0.0
// @description Have a better textarea! A userscript which can improve plain textarea for code editing.
// @homepageURL https://github.com/eight04/textarea-plus
// @supportURL https://github.com/eight04/textarea-plus/issues
// @license MIT
// @author eight04 <eight04@gmail.com>
// @namespace eight04.blogspot.com
// @include *
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @grant GM_addStyle
// @compatible firefox Tampermonkey latest
// @compatible chrome Tampermonkey latest
// @require https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=156587
// @downloadURL https://update.greasyfork.org/scripts/4949/Textarea%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/4949/Textarea%20Plus.meta.js
// ==/UserScript==

function isSameLine(editor) {
  return !editor.getSelection().includes("\n");
}

function getIndentInfo(text, {indentSize}) {
  var i, count = 0;
  for (i = 0; i < text.length; i++) {
    var c = text[i];
    if (c == " ") {
      count++;
    } else if (c == "\t") {
      count += indentSize;
    } else {
      break;
    }
  }
  return {
    count: Math.floor(count / indentSize),
    extraSpaces: count % indentSize,
    length: i
  };
}

function getIndentChar({indentStyle, indentSize}) {
  if (indentStyle === "TAB") {
    return "\t";
  }
  return " ".repeat(indentSize);
}

function runIndent({editor, options}) {
  if (!isSameLine(editor)) {
    runMultiIndent(editor, options);
    return;
  }
  var range = editor.getSelectionLineRange(),
    line = editor.getSelectionLine(),
    indent = getIndentInfo(line, options),
    pos = editor.getSelectionRange().start;
  if (pos > range.start + indent.length) {
    editor.setRangeText(
      getIndentChar(options),
      pos,
      pos,
      "end"
    );
  } else {
    editor.setRangeText(
      getIndentChar(options).repeat(indent.count + 1),
      range.start,
      range.start + indent.length,
      "end"
    );
  }
}

function runUnindent({editor, options}) {
  if (!isSameLine(editor)) {
    runMultiIndent(editor, options, -1);
    return;
  }
  var range = editor.getSelectionLineRange(),
    line = editor.getSelectionLine(),
    indent = getIndentInfo(line, options),
    pos = editor.getCaretPos(true),
    indentChar = getIndentChar(options);
    
  const indentCount = indent.count + (indent.extraSpaces ? 1 : 0);
  if (pos <= range.start + indent.length && indentCount) {
    editor.setRangeText(
      indentChar.repeat(indentCount - 1),
      range.start,
      range.start + indent.length,
      "end"
    );
  } else if (line.slice(0, pos - range.start).endsWith(indentChar)) {
    editor.setRangeText(
      "", pos - indentChar.length, pos, "end"
    );
  }
}

function runMultiIndent(editor, options, diff = 1) {
  var range = editor.getSelectionRange(),
    lines = editor.getSelectionLine(),
    lineRange = editor.getSelectionLineRange();
  if (lines[range.end - lineRange.start - 1] == "\n") {
    lineRange.end = range.end - 1;
    lines = lines.slice(0, range.end - lineRange.start - 1);
  }
  lines = lines.split("\n").map(line => {
    if (!line) return line;
    var indent = getIndentInfo(line, options),
      count = indent.count + diff;
    if (count < 0) {
      count = 0;
      // remove extra space when there is no indent
      indent.extraSpaces = 0;
    }
    return getIndentChar(options).repeat(count) +
      " ".repeat(indent.extraSpaces) +
      line.slice(indent.length);
  }).join("\n");
  editor.setRangeText(lines, lineRange.start, lineRange.end);
  editor.setSelectionRange(lineRange.start, lineRange.start + lines.length + 1);
}

function runSmartHome({editor, options, event}) {
  const collapse = !event.shiftKey;
  var line = editor.getCurrentLine(),
    range = editor.getCurrentLineRange(),
    pos = editor.getCaretPos(collapse) - range.start,
    indent = getIndentInfo(line, options);
  if (pos == indent.length) {
    editor.setCaretPos(range.start, collapse);
  } else {
    editor.setCaretPos(range.start + indent.length, collapse);
  }
}

const BRACES = {
  __proto__: null,
  "[": "]",
  "{": "}",
  "(": ")",
};

function runNewLine({editor, options}) {
  var content = editor.getContent(),
    range = editor.getSelectionRange(),
    line = editor.getSelectionLine(),
    lineRange = editor.getLineRange(range.start, range.start),
    indent = getIndentInfo(line, options),
    out = "\n", pos,
    left = content[range.start - 1],
    right = content[range.end];

  if (/[[{(]/.test(left)) {
    out += getIndentChar(options).repeat(indent.count + 1);
  } else {
    out += line.slice(0, Math.min(indent.length, range.start - lineRange.start));
  }
  pos = range.start + out.length;
  if (BRACES[left] && right == BRACES[left]) {
    out += "\n" + line.slice(0, indent.length);
  }
  editor.setRangeText(out);
  editor.setSelectionRange(pos, pos);
}

function runCompleteBraces({editor, options, event}) {
  const left = event.key;
  const right = options.completeBraces[left];
  var text = editor.getSelection(),
    range = editor.getSelectionRange();
  editor.setRangeText(left + text + right, range.start, range.end);
  editor.setSelectionRange(range.start + 1, range.start + 1 + text.length);
}

const COMMANDS = [
  {
    // indent
    test: e => e.key === "Tab" && !e.shiftKey,
    run: runIndent
  },
  {
    // unindent
    test: e => e.key === "Tab" && e.shiftKey,
    run: runUnindent
  },
  {
    // smart home
    test: e => e.key === "Home",
    run: runSmartHome
  },
  {
    // new line
    test: e => e.key === "Enter",
    run: runNewLine
  },
  {
    // complete braces
    test: (e, {completeBraces}) => completeBraces[e.key],
    run: runCompleteBraces
  }
];

const DEFAULT_OPTIONS = {
  indentSize: 4,
  indentStyle: "TAB",
  completeBraces: {
    __proto__: null,
    "[": "]",
    "{": "}",
    "(": ")",
    "\"": "\"",
    "'": "'"
  }
};

function createCommandExecutor(options = {}) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  
  function run(event, editorFactory) {
    for (const command of COMMANDS) {
      if (command.test(event, options)) {
        event.preventDefault();
        command.run({editor: editorFactory(), options, event});
        break;
      }
    }
  }

	return {run};
}

/* eslint-env browser, greasemonkey */

class Editor {
	constructor(textarea) {
		this.el = textarea;
	}

	getSelectionRange() {
		return {
			start: this.el.selectionStart,
			end: this.el.selectionEnd
		};
	}

	setSelectionRange(start, end) {
		this.el.setSelectionRange(start, end);
	}

	getCaretPos(collapse = false) {
		if (this.el.selectionDirection == "backward" || collapse) {
			return this.el.selectionStart;
		}
		return this.el.selectionEnd;
	}
	
	setCaretPos(pos, collapse = false) {
		if (collapse) {
			this.setSelectionRange(pos, pos);
		} else {
			var start = this.el.selectionStart,
				end = this.el.selectionEnd,
				dir = this.el.selectionDirection;
				
			if (dir == "backward") {
				[start, end] = [end, start];
				dir = "forward";
			}
			end = pos;
			if (end < start) {
				[start, end] = [end, start];
				dir = "backward";
			}
			this.el.selectionEnd = end;
			this.el.selectionStart = start;
			this.el.selectionDirection = dir;
		}
	}

	getLineRange(start, end) {
		var content = this.getContent(),
			i, j;
		i = content.lastIndexOf("\n", start - 1) + 1;
		j = content.indexOf("\n", end);
		if (j < 0) {
			j = content.length;
		}
		return {
			start: i,
			end: j
		};
	}

	getSelectionLineRange() {
		var range = this.getSelectionRange();
		return this.getLineRange(range.start, range.end);
	}

	getSelectionLine() {
		var content = this.getContent(),
			range = this.getSelectionLineRange();
		return content.slice(range.start, range.end);
	}

	getCurrentLineRange() {
		var pos = this.getCaretPos();
		return this.getLineRange(pos, pos);
	}

	getCurrentLine() {
		var range = this.getCurrentLineRange(),
			content = this.getContent();
		return content.slice(range.start, range.end);
	}

	getContent() {
		return this.el.value;
	}

	getSelection() {
		var content = this.getContent(),
			range = this.getSelectionRange();
		return content.slice(range.start, range.end);
	}

	setRangeText(...args) {
		this.el.setRangeText(...args);
	}
}

var ignoreClassList = ["CodeMirror", "ace_editor"];

function validArea(area) {
	if (area.nodeName != "TEXTAREA") {
		return false;
	}

	if (area.dataset.textareaPlus === "false") {
		return false;
	}

	if (area.dataset.textareaPlus === "true") {
		return true;
	}

	var node = area, i;
	while ((node = node.parentNode) != document.body) {
		for (i = 0; i < ignoreClassList.length; i++) {
			if (node.classList.contains(ignoreClassList[i])) {
				area.dataset.textareaPlus = "false";
				return false;
			}
		}
	}

	area.dataset.textareaPlus = "true";
	return true;
}

let commandExcutor, styleEl;

GM_config.setup({
  indentSize: {
    label: "Indent size",
    type: "number",
    default: 4
  },
  indentStyle: {
    label: "Indent style",
    type: "radio",
    default: "TAB",
    options: {
      TAB: "Tab",
      SPACE: "Space"
    }
  },
  completeBraces: {
    label: "Complete braces. One pair per line",
    type: "textarea",
    default: "[]\n{}\n()"
  }
}, () => {
  const options = GM_config.get();
  options.completeBraces = createMap(options.completeBraces);
  commandExcutor = createCommandExecutor(options);
  if (styleEl) styleEl.remove();
  styleEl = GM_addStyle(`
    textarea {
      tab-size: ${options.indentSize};
      -moz-tab-size: ${options.indentSize};
      -o-tab-size: ${options.indentSize};
    }`
  );
  
  function createMap(text) {
    const map = {__proto__: null};
    for (const pair of text.split(/\s+/g)) {
      if (pair.length == 2) {
        map[pair[0]] = pair[1];
      } else if (pair.length != 0) {
        alert(`Invalid pair: ${pair}`);
      }
    }
    return map;
  }
});

window.addEventListener("keydown", function(e){
	if (!validArea(e.target) || e.ctrlKey || e.altKey) {
		return;
	}
	if (e.defaultPrevented) {
		return;
	}

  commandExcutor.run(e, () => new Editor(e.target));
});
