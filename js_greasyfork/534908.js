// ==UserScript==
// @name		OzBargain Markdown Toolbar
// @namespace	nategasm
// @version		1.25
// @description	Displays a Markdown toolbar for textboxes on OzBargain and ChoiceCheapies
// @author		wOxxOm, darkred, nategasm
// @license		MIT
// @include		https://www.ozbargain.com.au/deals/submit
// @include		https://www.ozbargain.com.au/node/*
// @include		https://www.ozbargain.com.au/comment/edit/*
// @include		https://www.ozbargain.com.au/privatemsg/*
// @include		https://www.cheapies.nz/deals/submit
// @include		https://www.cheapies.nz/node/*
// @include		https://www.cheapies.nz/comment/edit/*
// @include		https://www.cheapies.nz/privatemsg/*
// @icon		https://www.ozbargain.com.au/favicon.ico
// @run-at		document-end
// @grant		GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534908/OzBargain%20Markdown%20Toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/534908/OzBargain%20Markdown%20Toolbar.meta.js
// ==/UserScript==

//Add button styles
GM_addStyle(`
	.mdBtn {
		display: inline-block;
		cursor: pointer;
		margin: 0 0.5px 4px 0.5px;
		padding: 4px;
		background: var(--input-bg);
		border: 1px solid #999;
		border-radius: 2px;
		white-space: pre;
		box-shadow: 0px 1px 0px #FFF inset, 0px -1px 2px #BBB inset;
		color: var(--page-fg);
		user-select: none;
	}
	.mdBtn:hover {
		background: var(--shade3-bg) !important;
		color: #fff !important;
	}
	.mdBtn svg {
		vertical-align: middle;
		pointer-events: none;
	}
	.qtBtn {
		font-weight: bold;
		position: fixed;
		display: none;
		line-height: 100%;
		padding: 3px 5px;
		border: var(--shade3-bg) solid 2px;
		opacity: 85%;
		user-select: none;
	}
	.qtBtn:hover {
		opacity: 100%;
	}
`);

//Add toolbar to main preloaded textboxes
const textarea = document.querySelector('textarea');
if (textarea) {
	addFeatures(textarea.parentNode);
} else {
	return;
}

//Add more features to nodes
if (location.href.indexOf('/node/') > 0) {
	//Observe and add toolbar to expanded reply boxes
	let targetNode = document.querySelectorAll(".comment.level0"); //Need All to capture pinned comments
	let callback = (mutationList, observer) => {
		for (const mutation of mutationList) {
			if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].className === "comment" && mutation.addedNodes[0].nodeName === "FORM") {
				addFeatures(mutation.addedNodes[0].querySelector('textarea').parentNode);
			}
		}
	};
	let observer = new MutationObserver(callback);
	for (let i = 0; i < targetNode.length; i++) {
		  observer.observe(targetNode[i], {attributes: false, childList: true, subtree: true});
	}
	//Add quote button to node content
	let node = document.querySelector('.node:not(.messages)');
	if (node) {
		let a = document.createElement('a');
		a.className = 'btn qtBtn';
		a.innerHTML = 'Quote Selection';
		a.addEventListener('click',
						   function(e){edPrefixTag('>', true, edInit(e.target,'>'));});
		a.addEventListener('mousedown',function(e){event.preventDefault()});
		node.textAreaNode = textarea;
		node.appendChild(a);
		['mouseup', 'touchend'].forEach(function(e) {
			node.addEventListener(e, (event) => {
				let selectedText = getSelectionText().trim();
				if (selectedText.length > 0) {
					const range = window.getSelection().getRangeAt(0);
					const rect = range.getBoundingClientRect();
					//Position the button near the selection
					a.style.top = `${event.clientY + 20}px`;
					a.style.left = `${event.clientX - 65}px`;
					a.style.display = 'inline-block';
				} else {
					a.style.display = 'none';
				}
			});
		});
		document.addEventListener("selectionchange", () => {
			//Remove button if unselected
			if (getSelectionText().length === 0) {
				a.style.display = 'none';
			}
		});
	}
}

function addFeatures(n) {
	n.textAreaNode = n.querySelector('textarea');
	const ctrlKey = isMacOS() ? 'Cmd' : 'Ctrl';
	//Add buttons
	btnMake(n, '<b>B</b>', 'Bold ('+ctrlKey+'+B)', '**', '', false, false, false, 'b',
		   'M4 2h4.5a3.501 3.501 0 0 1 2.852 5.53A3.499 3.499 0 0 1 9.5 14H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm1 7v3h4.5a1.5 1.5 0 0 0 0-3Zm3.5-2a1.5 1.5 0 0 0 0-3H5v3Z');

	btnMake(n, '<i>I </i>', 'Italic ('+ctrlKey+'+I)', '*', '', false, false, false, 'i',
		   'M6 2.75A.75.75 0 0 1 6.75 2h6.5a.75.75 0 0 1 0 1.5h-2.505l-3.858 9H9.25a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5h2.505l3.858-9H6.75A.75.75 0 0 1 6 2.75Z');

	btnMake(n, '<s>S</s>', 'Strikethrough ('+ctrlKey+'+`)', '~~', '', false, false, false, '`',
		   'M6.333 5.686c0 .31.083.581.27.814H5.166a2.8 2.8 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967');

	btnMake(n, 'H', 'Add Heading ('+ctrlKey+'+3)','#', '', false, true, true, '3',
		   'M3.75 2a.75.75 0 0 1 .75.75V7h7V2.75a.75.75 0 0 1 1.5 0v10.5a.75.75 0 0 1-1.5 0V8.5h-7v4.75a.75.75 0 0 1-1.5 0V2.75A.75.75 0 0 1 3.75 2Z');

	btnMake(n, '---', 'Horizontal rule ('+ctrlKey+'+-)', '\n\n---\n\n', '', true, false, false, '-',
		   'M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8');

	btnMake(n, 'Quote', 'Quote text ('+ctrlKey+'+.)','>', '', false, true, true, '.',
		   'M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388q0-.527.062-1.054.093-.558.31-.992t.559-.683q.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992 4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 9 7.558V11a1 1 0 0 0 1 1zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612q0-.527.062-1.054.094-.558.31-.992.217-.434.559-.683.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992 4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 3 7.558V11a1 1 0 0 0 1 1z');

	btnMake(n, '• List', 'Unordered list ('+ctrlKey+'+8)',
			function(e) {
		try {edList('* ', edInit(e.target,'* '));}
		catch(e) {}
	}, '', false, false, false, '8',
		   'M5.75 2.5h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5Zm0 5h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5Zm0 5h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5ZM2 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-6a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM2 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z');

	btnMake(n, '# List', 'Numbered list ('+ctrlKey+'+/)',
			function(e) {
		try {edList('1. ', edInit(e.target,'1. '), true);}
		catch(e) {}
	}, '', false, false, false, '/',
		   'M5 3.25a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 5 3.25Zm0 5a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 5 8.25Zm0 5a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1-.75-.75ZM.924 10.32a.5.5 0 0 1-.851-.525l.001-.001.001-.002.002-.004.007-.011c.097-.144.215-.273.348-.384.228-.19.588-.392 1.068-.392.468 0 .858.181 1.126.484.259.294.377.673.377 1.038 0 .987-.686 1.495-1.156 1.845l-.047.035c-.303.225-.522.4-.654.597h1.357a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5c0-1.005.692-1.52 1.167-1.875l.035-.025c.531-.396.8-.625.8-1.078a.57.57 0 0 0-.128-.376C1.806 10.068 1.695 10 1.5 10a.658.658 0 0 0-.429.163.835.835 0 0 0-.144.153ZM2.003 2.5V6h.503a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1h.503V3.308l-.28.14a.5.5 0 0 1-.446-.895l1.003-.5a.5.5 0 0 1 .723.447Z');

	btnMake(n, 'URL', 'Add URL ('+ctrlKey+'+K)',
			function(e) {
		try {edWrapInTag('[', '](URL)', edInit(e.target,'['));}
		catch(e) {}
	}, '', false, false, false, 'k',
		   'm7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z');

	btnMake(n, 'Table', 'Insert table template',
			function(e) {
		try {
			const columns = parseInt(prompt('Enter number of columns:'), 10);
			const rows = parseInt(prompt('Enter number of rows:'), 10);

			if (isNaN(columns) || isNaN(rows) || columns <= 0 || rows <= 0) {
				alert('Please enter valid positive numbers');
				return;
			}
			edInsertText(createMarkdownTable(columns, rows), edInit(e.target,'|'));
		}
		catch(e) {}
	}, '', false, false, false, '',
	'M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z');

	btnMake(n, 'Code', 'Code Block',
			function(e){
		let ed = edInit(e.target,'`');
		if (ed.sel.indexOf('\n') < 0) {
			edWrapInTag('`', '`', ed);
		}
		else {
			edWrapInTag(((ed.sel1==0) || (ed.text.charAt(ed.sel1-1) == '\n') ? '' : '\n') + '~~~' + (ed.sel.charAt(0) == '\n' ? '' : '\n'),
						(ed.sel.substr(-1) == '\n' ? '' : '\n') + '~~~' + (ed.text.substr(ed.sel2,1) == '\n' ? '' : '\n'),
						ed);
		}
	}, '', false, false, false, '',
	'M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8z');
	bindCtrlKeyToTextareaAction(n.textAreaNode);
	//Update hover text for Preview button shortcut
	let preview = n.parentNode.querySelector('input.form-submit[value="Preview"]');
	if (preview) { preview.title = ctrlKey+'+P'}
}

function btnMake(afterNode, label, title, tag1, tag2, noWrap, prefix, gap, shortcut, svgPath) {
	let a = document.createElement('a');
	a.className = 'mdBtn';
	if (!svgPath) { a.innerHTML = label };
	a.title = title;
	a.dataset.key = shortcut;
	a.addEventListener('click',
					   typeof(tag1) === 'function'
					   ? tag1
					   : noWrap ? function(e){ edInsertText(tag1, edInit(e.target,tag1)); }
					   : prefix ? function(e){ edPrefixTag(tag1, gap, edInit(e.target,tag1)); }
					   : function(e){ edWrapInTag(tag1, tag2, edInit(e.target,tag1)); });
	if (prefix) { a.addEventListener('mousedown',function(e){ event.preventDefault() }) }
	if (label === 'Quote') {
		document.addEventListener("selectionchange", () => {
			//Highlight quote button if text selected outside of textbox
			if (getSelectionText().length > 0 && document.activeElement.tagName !== 'TEXTAREA') {
				a.style.background = 'var(--shade3-bg)';
			} else {
				a.style.background = 'var(--input-bg)';
			}
		});
	}
	a.textAreaNode = afterNode.textAreaNode;
	let newA = afterNode.insertBefore(a, afterNode.textAreaNode);
	//Insert button SVG
	if (svgPath) {
		const svgNS = "http://www.w3.org/2000/svg";
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute("width", "18");
		svg.setAttribute("height", "18");
		if(['<s>S</s>','---','Code','Quote'].includes(label)) {
			svg.setAttribute("viewBox", "1 1 14 14");
		} else {
			svg.setAttribute("viewBox", "0 0 16 16");
		}
		const path = document.createElementNS(svgNS, "path");
		path.setAttribute("d", svgPath);
		path.setAttribute("fill", "currentColor");
		svg.appendChild(path);
		newA.appendChild(svg);
	}
}

function edInit(btn, tag) {
	let ed = { node: btn.parentNode.textAreaNode };
	ed.sel1 = ed.node.selectionStart;
	ed.sel2 = ed.node.selectionEnd;
	//Trim Whitespace and line breaks from start/end of selection, also improves gap detection
	trimSelection(ed, tag);
	ed.text = ed.node.value;
	ed.sel = ed.text.substring(ed.sel1, ed.sel2);
	return ed;
}

function trimSelection(ed, tag) {
	while (ed.sel1 < ed.sel2) {
		const startChar = ed.node.value.charAt(ed.sel1);
		const endChar = ed.node.value.charAt(ed.sel2 - 1);
		const isListTag = ['* ', '1. ', '>'].includes(tag);
		const trimStart =
		(!isListTag && /\s/.test(startChar)) ||
		(isListTag && startChar === '\n');
		const trimEnd =
		(!isListTag && /\s/.test(endChar)) ||
		(isListTag && endChar === '\n');
		if (!trimStart && !trimEnd) break;
		if (trimStart) ed.sel1++;
		if (trimEnd) ed.sel2--;
	}
}

function detectGapBefore(selStart, text, tag) {
	if (selStart === 0 || selStart - tag.length === 0 || //Start of textbox
		text.substring(selStart - 2, selStart - 1) === '\n' || //Line break exists before selection
		text.substring(selStart - tag.length - 1, selStart - tag.length) === tag) { //Tag exists before selection
		return true;
	}
}

function detectGapAfter(selEnd, text, tag) {
	if (text.substring(selEnd + 1, selEnd + 2) === '\n' || //Line break exists after selection
		(!tag && selEnd === text.length)) { //End of textbox
		return true;
	}
}

function edWrapInTag(tag1, tag2, ed) {
	if (ed.sel.startsWith(tag1) && ed.sel.endsWith(tag2?tag2:tag1)) {
		// Remove the syntax if it's already wrapped
		ed.node.value = ed.text.substr(0, ed.sel1) + ed.sel.slice(tag1.length, (tag2?-tag2.length:-tag1.length)) + ed.text.substr(ed.sel2);
		ed.node.setSelectionRange(ed.sel1, ed.sel1 + ed.sel.length - tag1.length - (tag2?tag2.length:tag1.length));
	} else {
		// Wrap syntax
		if (ed.sel.length === 0) {
			replaceTextWithUndo(ed, tag1 + (tag2?tag2:tag1), true);
		} else {
			if (tag2 === '](URL)' && ed.sel.substr(0,4) === 'http'){ //Check if URL was selected
				tag1 = '[Label](';
				tag2 = ')';
			}
			replaceTextWithUndo(ed, ed.text.substr(0, ed.sel1) + tag1 + ed.sel + (tag2?tag2:tag1) + ed.text.substr(ed.sel2));
		}
		//If URL tag select the URL or Label
		if (tag2 === '](URL)' && ed.sel.length > 0) {
			ed.node.setSelectionRange(ed.sel1 + tag1.length + ed.sel.length + 2, ed.sel1 + tag1.length + ed.sel.length + 5);
		} else if (tag1 === '[Label](' && ed.sel.length > 0) {
			ed.node.setSelectionRange(ed.sel1 + 1, ed.sel1 + 6);
		}
		else {
			ed.node.setSelectionRange(ed.sel1 + tag1.length, ed.sel1 + tag1.length + ed.sel.length);
		}
	}
	ed.node.focus();
}

function edInsertText(text, ed) {
	//Insert at cursor
	replaceTextWithUndo(ed, text, true);
	ed.node.setSelectionRange(ed.sel2 + text.length, ed.sel2 + text.length);
	ed.node.focus();
}

function edPrefixTag(tag, gap, ed) {
	if (ed.sel.startsWith(tag)) {
		//Remove the syntax if it's already prefixed
		const selection = removeCharAtStartOfLines(ed.sel, tag);
		ed.node.value = ed.text.substr(0, ed.sel1) + selection + ed.text.substr(ed.sel2);
		ed.node.setSelectionRange(ed.sel1, ed.sel1 + selection.length);
	} else {
		const selPage = (getSelectionText().length > 0 && document.activeElement.tagName !== 'TEXTAREA' && tag === '>');
		let selection;
		//Prefix syntax - Note Firefox and Chrome handle getSelection() differently for textboxes
		if (selPage || ed.sel.length > 0) {
			//Text selected in page or textarea
			const selTrimmed = trimWhitespaceFromLines(selPage?getSelectionText():ed.sel);
			const selectionObj = insertAtStartOfLines(selTrimmed.trimmedString,
													{charToInsert: tag, numberLines: false, skipEmptyLines: true});
			selection = markdownGapDetection(ed, selectionObj, tag, selTrimmed.trimmedCount, selPage?selTrimmed.trimmedString.length:0, selPage);
		} else { //Add tag to the start of the line
			const lineInfo = getLineInfo(ed, tag);
			ed.sel1 = lineInfo.startOfLine;
			ed.sel2 = lineInfo.endOfLine;
			trimSelection(ed, tag);
			ed.sel = ed.text.substring(ed.sel1, ed.sel2);
			const selTrimmed = trimWhitespaceFromLines(ed.sel);
			selection = markdownGapDetection(ed, {text: (tag + selTrimmed.trimmedString), tagCount: tag.length}, tag, selTrimmed.trimmedCount, 0);
		}
		//Set the full textarea
		replaceTextWithUndo(ed, ed.text.substr(0, ed.sel1) + (selPage?ed.sel:'') + (selection.result??selection) + ed.text.substr(ed.sel2));
		if (selPage) {
			//Exclude first tag from selection so that tag can continously be added for nested markdown like blockquote
			ed.node.setSelectionRange(ed.sel1 + (selPage?ed.sel.length:0) + selection.result.length, ed.sel1
									  + (selPage?ed.sel.length:0) + selection.result.length);
		} else if (ed.sel.length === 0) {
			ed.node.setSelectionRange(ed.sel2 + tag.length, ed.sel2 + tag.length);
		} else {
			ed.node.setSelectionRange(ed.sel1 + tag.length + selection.iBefore, ed.sel1 + selection.result.length - selection.iAfter);
		}
	}
	ed.node.focus();
}

function edList(tag, ed, ordered) {
	//Add what to do when no selection
	let selection;
	if (ed.sel.startsWith(tag)) {
		// Remove the syntax if it's already prefixed
		selection = trimWhitespaceFromLines(removeCharAtStartOfLines(ed.sel, tag, ordered)).trimmedString;
		ed.node.value = ed.text.substr(0, ed.sel1) + selection + ed.text.substr(ed.sel2);
		ed.node.setSelectionRange(ed.sel1, ed.sel1 + selection.length);
	} else {
		if (ed.sel.length > 0) {
			// Wrap syntax
			const selTrimmed = trimWhitespaceFromLines(ed.sel);
			const selectionObj = insertAtStartOfLines(selTrimmed.trimmedString,
													{charToInsert: tag, numberLines: ordered, skipEmptyLines: true});
			selection = markdownGapDetection(ed, selectionObj, tag, selTrimmed.trimmedCount, 0);
		} else { //Nothing selected, just add tag
			const lineInfo = getLineInfo(ed, tag);
			ed.sel1 = lineInfo.startOfLine;
			ed.sel2 = lineInfo.endOfLine;
			trimSelection(ed, tag);
			ed.sel = ed.text.substring(ed.sel1, ed.sel2);
			let selTrimmed = trimWhitespaceFromLines(ed.sel);
			selection = markdownGapDetection(ed, {text: (tag + selTrimmed.trimmedString), tagCount: tag.length}, tag, selTrimmed.trimmedCount, 0);
		}
		replaceTextWithUndo(ed, (ed.text.substr(0, ed.sel1) + (selection.result??selection) + ed.text.substr(ed.sel2)));
		if (ed.sel.length === 0){ //Don't select anything if only tag was inserted
				ed.node.setSelectionRange(ed.sel2 + tag.length, ed.sel2 + tag.length);
		} else {
			ed.node.setSelectionRange(ed.sel1 + selection.iBefore, ed.sel1 + selection.result.length - selection.iAfter);
		}
	}
	ed.node.focus();
}

function markdownGapDetection(ed, selectionObj, tag, trimCount, addedLength, selPage) {
	let iBefore;
	let iAfter;
	let selection = selectionObj.text;
	//Check and add up to 2 line breaks before the selection
	for (iBefore = 0;selection !== tag && iBefore < 2
		 && !detectGapBefore(ed.sel1 + iBefore, ed.text.substr(0, ed.sel1) + selection, tag);iBefore++) {
		selection = '\n' + selection;
	}
	//Check and add up to 2 line breaks after the selection
	for (iAfter = 0;selection !== tag && iAfter < 2 && (ed.sel2 !== ed.text.length || selPage)
		 && !detectGapAfter(ed.sel2 + selectionObj.tagCount + iBefore - (selPage?0:trimCount) + addedLength,
							ed.text.substr(0, ed.sel1) + selection + ed.text.substr(ed.sel2), tag);iAfter++) {
		selection = selection + '\n';
		}
	return {
		result: selection,
		iBefore: iBefore,
		iAfter: iAfter
	}
}

function getSelectionText() {
	if (window.getSelection) {
		return window.getSelection().toString();
	}
}

function createMarkdownTable(columns, rows) {
	const cellWidth = 9; //Define uniform cell width for better alignment
	function pad(text) { //Helper to pad text to fixed width
		return text.padEnd(cellWidth, ' ');
	}
	const headers = Array.from({ length: columns }, (_, i) => `Head${i + 1}`);
	const headerRow = `| ${headers.join(' | ')} |`;
	const separatorRow = `| ${headers.map(() => '-'.repeat(cellWidth)).join(' | ')} |`;
	const dataRows = [];
	for (let r = 0; r < rows; r++) {
		const row = Array.from({ length: columns }, () => pad('  Cell'));
		dataRows.push(`| ${row.join(' | ')} |`);
	}
	return [headerRow, separatorRow, ...dataRows].join('\n');
}

function getLineInfo(ed, tag) {
	if (!ed || typeof ed.text !== 'string' || typeof ed.sel1 !== 'number') {
		return {
			startOfLine: ed?.sel1 ?? 0,
			endOfLine: ed?.sel1 ?? 0,
			line: ''
		};
	}
	const startOfLine = ed.text.lastIndexOf('\n', ed.sel1 - 1) + 1;
	let endOfLine = ed.text.indexOf('\n', ed.sel1);
	if (endOfLine === -1) endOfLine = ed.text.length;
	const line = ed.text.slice(startOfLine, endOfLine).trim();
	//If tag is given and the trimmed line is made up of repeated tags
	if (typeof tag === 'string' && tag.length > 0) {
		const repeated = tag.repeat(Math.ceil(line.length / tag.length));
		const trimmedRepeated = repeated.slice(0, line.length);
		if (line === trimmedRepeated) {
			return {
				startOfLine: endOfLine,
				endOfLine: endOfLine,
				line: ed.text.slice(startOfLine, endOfLine) //Preserve original line (untrimmed)
			};
		}
	}
	return {
		startOfLine,
		endOfLine,
		line: ed.text.slice(startOfLine, endOfLine)
	};
}

function getStartOfLine(ed) {
	if (!ed || typeof ed.text !== 'string' || typeof ed.sel1 !== 'number') {
		return ed?.sel1;
	}
	const beforeSel = ed.text.substring(0, ed.sel1);
	const lastNewline = beforeSel.lastIndexOf('\n');
	return lastNewline + 1;
}

function insertAtStartOfLines(inputString, options = {}) {
	const { charToInsert = '', numberLines = false, skipEmptyLines = true } = options;
	let lineNumber = 1;
	let count = 0;
	let result = inputString
		.split('\n')
		.map(line => {
		if (skipEmptyLines && line.trim() === '') {
			return line;
		}
		if (numberLines) {
			count = count + lineNumber.toString().length + 2;
			return `${lineNumber++}. ${line}`;
		} else {
			count = count + charToInsert.length;
			return charToInsert + line;
		}
	})
		.join('\n');
	return {
        text: result,
        tagCount: count
    }
}

function removeCharAtStartOfLines(inputString, charToRemove, removeNumbers) {
	return inputString
		.split('\n')
		.map(line => {
		let newLine = line;
		//Remove the specific character if needed
		if (charToRemove && newLine.startsWith(charToRemove) && !removeNumbers) {
			newLine = newLine.slice(1);
		}
		//Remove leading numbers (and optional dot/space after) if needed
		if (removeNumbers) {
			newLine = newLine.replace(/^\d+\.?\s*/, '');
		}
		return newLine;
	})
		.join('\n');
}

function trimWhitespaceFromLines(inputString) {
	let trimmedCount = 0;
	const trimmedLines = inputString.split('\n').map(line => {
		const originalLength = line.length;
		const trimmedLine = line.trim();
		trimmedCount += originalLength - trimmedLine.length;
		return trimmedLine;
	});
	return {
		trimmedString: trimmedLines.join('\n'),
		trimmedCount
	};
}

function replaceTextWithUndo(ed, newText, insert) {
	ed.node.focus();
	ed.node.setSelectionRange(insert?ed.sel2:0, insert?ed.sel2:ed.node.value.length);
	try { //Note: execCommand is needed for Undo functionality but is deprecated and could fail in the future
		document.execCommand('insertText', false, newText);
	} catch (err) { //Fallback if execCommand fails
		ed.node.setRangeText(newText, 0, ed.node.value.length, 'start');
		ed.node.dispatchEvent(new Event('input', { bubbles: true }));
	}
}

function bindCtrlKeyToTextareaAction(textareaEl) {
	if (!textareaEl) return;
	function handleKeydown(e) {
		const ctrlKey = isMacOS() ? e.metaKey : e.ctrlKey;
		if (!ctrlKey || e.altKey || e.shiftKey) return;
		const key = e.key.toLowerCase();
		let button;
		if (key === 'p') { //Hardcode Preview shortcut (Ctrl+P)
			button = textareaEl.parentNode.parentNode.querySelector('input.form-submit[value="Preview"]');
		}
		else {
			button = textareaEl.parentNode.querySelector(`a[data-key="${key}"]`);
		}
		if (button) {
			e.preventDefault();
			button.click();
		}
	}
	textareaEl.addEventListener('keydown', handleKeydown);
}

function isMacOS() {
  const platform = navigator.platform || "";
  const userAgent = navigator.userAgent || "";
  return platform.includes("Mac") || userAgent.includes("Macintosh");
}