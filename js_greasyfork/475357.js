(()=>	{
		// 自执行改为 function 编辑框fn() ⥅就变为外围广谱, 使用:在需要页面⥅编辑框fn();	然后每次使用先⥅window.编辑框插内容.init();
		//🕗V2 同步更新⥅库 见	https:github.com/dnknn/js/issues/63#issuecomment-1739080488
	window.编辑框插内容 = {};	let getSelection, setSelection;
	function isHostMethod(object, property) {
		var t = typeof object[property];	return t === "function" ||	(!!(t == "object" && object[property])) ||	t == "unknown";
	}
	function isHostProperty(object, property) {return typeof(object[property]) != "undefined";}
	function isHostObject(object, property) {return !!(typeof(object[property]) == "object" && object[property]);}
	function fail(reason) {window.console.log(`RangyInputs not supported in your browser. Reason: ${reason}`);}
	function adjustOffsets(el, start, end) {
		if (start < 0) {start += el.value.length;}
		if (typeof end == "undefined") {end = start;}
		if (end < 0) {end += el.value.length;}
		return { start: start, end: end };
	}
	function makeSelection(el, start, end) {
		return {
			start: start,	end: end,	length: end - start,	text: el.value.slice(start, end)
		};
	}
	function getBody() {return isHostObject(document, "body") ? document.body : document.querySelector("body");}

	window.编辑框插内容.init = ()=>	{
		const testTextArea = document.createElement("textarea");	getBody().appendChild(testTextArea);
		if (isHostProperty(testTextArea, "selectionStart") && isHostProperty(testTextArea, "selectionEnd") ) {
			getSelection = el => {return makeSelection(el, el.selectionStart, el.selectionEnd);};
			setSelection = (el, startOffset, endOffset) => {
				var offsets = adjustOffsets(el, startOffset, endOffset);
				el.selectionStart = offsets.start;	el.selectionEnd = offsets.end;
			};
		} else if (isHostMethod(testTextArea, "createTextRange") && isHostObject(document, "selection") && isHostMethod(document.selection, "createRange")
		) {
			getSelection = el => {
				let normalizedValue, textInputRange, len, endRange, start = 0, end = 0;
				const range = document.selection.createRange();
				if (range && range.parentElement() == el) {
					len = el.value.length;
					normalizedValue = el.value.replace(/\r\n/g, "\n");
					textInputRange = el.createTextRange();
					textInputRange.moveToBookmark(range.getBookmark());
					endRange = el.createTextRange();
					endRange.collapse(false);
					if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
						start = end = len;
					} else {
						start = -textInputRange.moveStart("character", -len);
						start += normalizedValue.slice(0, start).split("\n").length - 1;
						if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
							end = len;
						} else {
							end = -textInputRange.moveEnd("character", -len);
							end += normalizedValue.slice(0, end).split("\n").length - 1;
						}
					}
				}
				return makeSelection(el, start, end);
			};

			const offsetToRangeCharacterMove = function(el, offset) {return offset - (el.value.slice(0, offset).split("\r\n").length - 1);};
			setSelection = (el, startOffset, endOffset) => {
				const offsets = adjustOffsets(el, startOffset, endOffset),
					range = el.createTextRange(),
					startCharMove = offsetToRangeCharacterMove(el, offsets.start);
				range.collapse(true);
				if (offsets.start == offsets.end) {
					range.move("character", startCharMove);
				} else {
					range.moveEnd(
						"character",
						offsetToRangeCharacterMove(el, offsets.end)
					);
					range.moveStart("character", startCharMove);
				}
				range.select();
			};

		} else {getBody().removeChild(testTextArea);	fail("No means of finding text input caret position");	return;}

		getBody().removeChild(testTextArea);	// Clean up

		function getValueAfterPaste(el, text) {
			const val = el.value,	sel = getSelection(el),		selStart = sel.start;
			return {
				value: val.slice(0, selStart) + text + val.slice(sel.end),
				index: selStart,	replaced: sel.text
			};
		}

		function pasteTextWithCommand(el, text) {
			el.focus();	const sel = getSelection(el);
			// Hack to work around incorrect delete command when deleting the last
			// word on a line
			setSelection(el, sel.start, sel.end);
			if (text === "") {document.execCommand("delete", false, null);}
			else {document.execCommand("insertText", false, text);}

			return {replaced: sel.text,		index: sel.start};
		}

		function pasteTextWithValueChange(el, text) {
			el.focus();	const valueAfterPaste = getValueAfterPaste(el, text);
			el.value = valueAfterPaste.value;	return valueAfterPaste;
		}

		let pasteText = (el, text) => {
			const valueAfterPaste = getValueAfterPaste(el, text);
			try {
				const pasteInfo = pasteTextWithCommand(el, text);
				if (el.value == valueAfterPaste.value) {
					pasteText = pasteTextWithCommand;
					return pasteInfo;
				}
			} catch (ex) {
				// Do nothing and fall back to changing the value manually
			}
			pasteText = pasteTextWithValueChange;
			el.value = valueAfterPaste.value;
			return valueAfterPaste;
		};

		function updateSelectionAfterInsert(el, startIndex, text, selBehaviour) {
			let endIndex = startIndex + text.length;
			// selBehaviour = (typeof selBehaviour=="string") ? selBehaviour.toLowerCase() : ""; //新增[数组参数]用于替换选择后的选中的自定义范围 2
			selBehaviour = (typeof selBehaviour=="string") ? selBehaviour.toLowerCase() : Array.isArray(selBehaviour) ? selBehaviour : "";
			if ((selBehaviour=="collapsetoend" || selBehaviour=="select") && /[\r\n]/.test(text)) {
				// Find the length of the actual text inserted, which could vary
				// depending on how the browser deals with line breaks
				const normalizedText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
				endIndex = startIndex + normalizedText.length;
				const firstLineBreakIndex = startIndex + normalizedText.indexOf("\n");

				if (el.value.slice(firstLineBreakIndex, firstLineBreakIndex + 2) == "\r\n") {
					// Browser uses \r\n, so we need to account for extra \r characters
					endIndex += normalizedText.match(/\n/g).length;
				}
			}

switch(selBehaviour)	{
	case "select":			setSelection(el, startIndex, endIndex);		break;
	case "collapsetostart":	setSelection(el, startIndex, startIndex);	break;
	case "collapsetoend":	setSelection(el, endIndex, endIndex);	break;
		//新增[数组参数]用于替换选择后的选中的自定义范围 3	即在👆范围基础上的二次范围
	// default: Array.isArray(selBehaviour)&&setSelection(el, startIndex+selBehaviour[0], endIndex+selBehaviour[1]);
	default:
if(Array.isArray(selBehaviour))	{
	selBehaviour.includes(``)
		? selBehaviour[0]===`` ?	setSelection(el, startIndex+selBehaviour[1], startIndex+selBehaviour[2])	// [``,11,22]	相对于起点加减
								:	setSelection(el, endIndex+selBehaviour[0], endIndex+selBehaviour[1])		// [11,22,``]	相对于终点加减
		: setSelection(el, startIndex+selBehaviour[0], endIndex+selBehaviour[1]);	// [11,22] 相对于文选替换后的范围加减
}

}

		}

		window.编辑框插内容.在选择处覆盖替换 = (el, 回调, 选择范围="select")=>	{
				const sel = getSelection(el), result = 回调(sel.text), pasteInfo = pasteText(el, result);
			updateSelectionAfterInsert(el, pasteInfo.index, result, 选择范围);	//"select"改为选择范围	新增[数组参数]用于替换选择后的选中的自定义范围 1
		};
		window.编辑框插内容.在选择处前后追加 = (el, before, after, 选择范围="select")=>	{
				if(typeof after=="undefined")	after = before;
				const sel = getSelection(el),	pasteInfo = pasteText(el, before + sel.text + after);
			updateSelectionAfterInsert(el,	pasteInfo.index+before.length,	sel.text,	选择范围);	// "select"改为选择范围
		};
	};
})();	//编辑框插入内容	每次使用得先执行初始化语句 [window.编辑框插内容.init();]