// ==UserScript==
// @name         jsFiddle light theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a light theme, as well as a theme switcher to the settings
// @author       Malleys
// @match        https://jsfiddle.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403402/jsFiddle%20light%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/403402/jsFiddle%20light%20theme.meta.js
// ==/UserScript==

const styleSheet = document.createElement("style");
styleSheet.textContent = `
body { background: #f3f5f6; color: #39464E }
header { background: white; border-bottom: 1px solid #cfd6d9; }
header * { color: inherit !important }
.windowLabelCont .panelTidy, .windowLabelCont .windowLabel { color: #7f94a1; }
#editor .gutter { background: #cfd6d9; }
.CodeMirror { color: #39464E; }
.CodeMirror-gutters { background-color: #f3f5f6; }
.CodeMirror-linenumber { color: #c8d2d7; }
.CodeMirror-cursor { border-left: 1px solid black; }
div.CodeMirror span.CodeMirror-matchingbracket,
.CodeMirror-matchingtag { border-color: rgba(36,157,127,.8); }
.cm-searching { background: #ffa; background: rgba(255,255,0,.4) }
.cm-s-default .cm-header { color: #00f }
.cm-s-default .cm-quote { color: #36ac3b }
.cm-negative { color: #FF4D4D }
.cm-positive { color: #36ac3b }
.cm-s-default .cm-keyword { color: #a151d2 }
.cm-s-default .cm-atom { color: #219 }
.cm-s-default .cm-number { color: #ED5C65 }
.cm-s-default .cm-def { color: #f18c16 }
.cm-s-default .cm-variable,
.cm-s-default .cm-variable-2 { color: #2795EE }
.cm-s-default .cm-variable-3 { color: #249D7F }
.cm-s-default .cm-comment { color: #A0A1A7 }
.cm-s-default .cm-string { color: #249D7F }
.cm-s-default .cm-string-2 { color: #ED5C65 }
.cm-s-default .cm-meta { color: #39464E }
.cm-s-default .cm-builtin,
.cm-s-default .cm-qualifier { color: #f18c16 }
.cm-s-default .cm-tag { color: #2795EE }
.cm-s-default .cm-bracket { color: #39464E }
.cm-s-default .cm-attribute { color: #f18c16 }
.cm-s-default .cm-hr { color: #999 }
.cm-s-default .cm-link { color: #2795EE }
.cm-s-default .cm-property,
.cm-s-default .cm-punctuation { color: #a5567f; }
.cm-invalidchar,.cm-s-default .cm-error,
div.CodeMirror span.CodeMirror-nonmatchingbracket { background: #ED5C65; color: #fff; }
.CodeMirror-hints { box-shadow: 0 5px 15px rgba(0,0,0,.1); border: 1px solid #eee;background: #fff; }
.CodeMirror-hint { color: #222; }
.CodeMirror-focused .CodeMirror-selected { background: #d7d4f0; }
.CodeMirror-selected { background: #d9d9d9; }
#sidebar, .twitterCont { background: #fff; border-color: #cfd6d9;; }
#sidebar, #sidebar * { color: inherit !important; }
#sidebar .checkboxCont .checkbox,
.checkboxCont input[type=checkbox]:disabled+.checkbox,
.checkboxCont .checkbox { background: rgba(0,0,0,.1); }
#tabs { border-bottom-color: #cfd6d9; border-top-color: transparent; background: #ffffff; }
#tabs .tabItem.active { box-shadow: 0 1px 0 #f3f5f6, 0 -1px 0 #2e71ff; background: #f3f5f6; }
#tabs a, #tabs a:hover { color: #616367; border-color: #cfd6d9; }
#tabs .tabItem.active a { color: #7f94a1; }
#flash-messages li { box-shadow: 0 10px 10px rgba(0,0,0,.05); color: #1f2227; background: #ffffff }
#flash-messages .flashActions a { background: #EEEEEE; color: #757575; }
#flash-messages .flashActions a:hover { color: #212121 }
#flash-messages .success svg { stroke: #4CAF50 }
#flash-messages .error svg { stroke: #F44336 }
#flash-messages .warning svg { stroke: #FFC107 }
form fieldset { background: #fff; }
#app-updates .badge { color: #fff !important; }
.formHeading h2, form fieldset, form input[type="text"], form input[type="email"],
form input[type="password"], form input[type="url"], .otherLinks a { color: #333 }
#sidebar #profile-segment { border-color: #cfd6d9; }
.commonForm fieldset { background-color: transparent; }
#content { color: #1a1d21; }
.commonForm fieldset input[type="text"], .commonForm fieldset input[type="email"],
.commonForm fieldset input[type="password"], .commonForm fieldset input[type="url"], .commonForm fieldset textarea,
.commonForm fieldset select { background: #fff;color: #1a1d21;box-shadow: 0 0 0 1px #cfd6d9; }
.commonForm fieldset + fieldset { border-color: #cfd6d9; }
#user-top-bar { box-shadow: 0 1px 0 #cfd6d9; background: #f3f5f6; }
#user-top-bar strong, .fiddleList h3 a { color: #1a1d21; }
.sideMenu .newAction { border-color: #cfd6d9; }
.fiddleList h3 .latest { color: #FF9800; }#user-top-bar { box-shadow: 0 1px 0 #cfd6d9; background: #f3f5f6; }
#user-top-bar strong, .fiddleList h3 a { color: #1a1d21; }
.sideMenu .newAction { border-color: #cfd6d9; }
.fiddleList h3 .latest { color: #FF9800; }
form .buttonCont input:disabled, form .buttonCont button:disabled { background: rgba(0, 0, 0, 0.15); }
`;
document.body.append(styleSheet);

const p = document.createElement("p");
p.innerHTML = `
<label class="checkboxCont">
	<input type="checkbox" name="x-darkTheme">
	<span class="checkbox"></span>
	Dark theme
</label>`;
for(const node of $x("//*[@id='editor-options']/h3[contains(text(), 'General')]/following-sibling::div[1]")) {
	node.prepend(p);
}

const checkbox = p.querySelector("input");

checkbox.addEventListener("change", event => {
	forceDarkTheme(checkbox.checked);
});

forceDarkTheme("darkTheme" in localStorage ? localStorage.getItem("darkTheme") == "true" : false);

function forceDarkTheme(force) {
	styleSheet.disabled = force;
	checkbox.checked = force;
	localStorage.setItem("darkTheme", force.toString());
}
function $x(xpath, startNode) {
	var doc = startNode && startNode.ownerDocument || document;
	var result = doc.evaluate(xpath, startNode || doc, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE);
	var node, nodes = [];
	while(node = result.iterateNext()) nodes.push(node);
	return nodes;
}