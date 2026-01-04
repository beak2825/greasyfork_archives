// ==UserScript==
// @name         LaTeX Unicode Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Highlight text then press [ALT+X] to convert LaTeX commands to their unicode equivalent (ex. \pi → π)
// @author       eyl327
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407525/LaTeX%20Unicode%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/407525/LaTeX%20Unicode%20Shortcuts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var convert;

    var dictLoaded = false;

    /* source url for shortcut file */
    var dictionarySource = "https://raw.githubusercontent.com/eyl327/LaTeX-Gboard-Dictionary/master/dictionary.txt";

    /* fetch text file when requested */
    function loadAsset(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                    callback(xhr.responseText);
                }
            }
        }
        xhr.send();
    }

    /* on dictionary loaded callback */
    function loaded(response) {
        console.log("LaTeX Unicode Shortcuts has been loaded.");
        /* generate dictionary from text file */
        var dictArr = response.split("\n").slice(1);
        var dictionary = {};
        for (var i = 0, len = dictArr.length; i < len; ++i) {
            var kvp = dictArr[i].split("\t");
            dictionary[kvp[0]] = kvp[1];
        }
        /* conversion function */
        convert = function (text) {
            var result = text.replace(/{([A-Za-z0-9])}/g, '$1'); // {R} => R
            for (var key in dictionary) {
                var pattern = new RegExp(key.replace(/([[^$.|\\?*+(){}])/g, '\\$1') + "\\b", 'g'); // clean and escape key
                var replaced = result.replace(pattern, dictionary[key]);
                if (replaced.length < result.length) {
                    result = replaced;
                }
            }
            return result;
        };
        dictLoaded = true;
    }

    /* get caret position within input box */
    function getCaretPositionInputBox(el) {
        if ("selectionStart" in el && document.activeElement == el) {
            return {
                start: el.selectionStart,
                end: el.selectionEnd
            };
        }
        else if (el.createTextRange) {
            var sel = document.selection.createRange();
            if (sel.parentElement() === el) {
                var range = el.createTextRange();
                range.moveToBookmark(sel.getBookmark());
                for (var len = 0;
                    range.compareEndPoints("EndToStart", range) > 0;
                    range.moveEnd("character", -1)) {
                    len++;
                }
                range.setEndPoint("StartToStart", el.createTextRange());
                for (var pos = { start: 0, end: len };
                    range.compareEndPoints("EndToStart", range) > 0;
                    range.moveEnd("character", -1)) {
                    pos.start++;
                    pos.end++;
                }
                return pos;
            }
        }
        return -1;
    }

    /* set caret position within input box */
    function setCaretPosition(el, pos) {
        if (el.setSelectionRange) {
            el.focus();
            el.setSelectionRange(pos, pos);
        }
        else if (el.createTextRange) {
            var range = el.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }

    function overwriteInputBoxText(activeEl, before, convertedText, after) {
        // overwrite text
        activeEl.value = before + convertedText + after;
        // set cursor to be at end of selection
        setCaretPosition(activeEl, before.length + convertedText.length);
    }

    function replaceConversionInElement(activeEl, fullText, start, end) {
        var textToConvert = fullText.substring(start, end);
        var before = fullText.substring(0, start);
        var after = fullText.substring(end, fullText.length);
        // convert selection
        var convertedText = convert(textToConvert);
        if ("value" in activeEl) {
            overwriteInputBoxText(activeEl, before, convertedText, after);
        }
    }

    /* convert hilighted text in active element */
    function convertSelectionInputBox(activeEl) {
        var caretRange = getCaretPositionInputBox(activeEl);
        var selStart = caretRange.start;
        var selEnd = caretRange.end;
        var fullText = activeEl.value;
        /* if selection is empty, find word at caret */
        if (selStart == selEnd) {
            // Find beginning and end of word
            var left = fullText.slice(0, selStart + 1).search(/\S+$/);
            var right = fullText.slice(selStart).search(/(\s|$)/);
            /* convert the word at the caret selection */
            replaceConversionInElement(activeEl, fullText, left, right + selStart)
        }
        /* else convert the selection */
        else {
            replaceConversionInElement(activeEl, fullText, selStart, selEnd);
        }
    }

    /* convert hilighted text in active element */
    function convertSelectionContentEditable(element) {
        var NodeTree = {
            // Used to find all DOM nodes in window.getSelection()
            getInnerNodes: function (anchor, focus) {
                var ancestor = NodeTree.lowestCommonAncestor(anchor, focus);
                var childList = NodeTree.findChildrenList(ancestor);
                var [i, j] = [childList.indexOf(anchor), childList.indexOf(focus)].sort();
                return childList.slice(i, j + 1);
            },
            getNodeChain: function (node) {
                var chain = [];
                chain.push(node);
                while (node.parentNode) {
                    node = node.parentNode;
                    chain.push(node);
                }
                return chain.reverse();
            },
            lowestCommonAncestor: function (anchor, focus) {
                var uChain = NodeTree.getNodeChain(anchor);
                var vChain = NodeTree.getNodeChain(focus);
                var i;
                for (i = 0; i < uChain.length; i++) {
                    if (uChain[i] !== vChain[i]) {
                        break
                    }
                }
                return uChain[i - 1]
            },
            findChildrenList: function (node) {
                var list = []
                var find = function (n) {
                    if (!n) {
                        return;
                    }
                    list.push(n);
                    for (var child of Array.from(n.childNodes || [])) {
                        find(child);
                    }
                }
                find(node);
                return list;
            }
        }

        var sel = element.ownerDocument.getSelection();

        var selAN = sel.anchorNode;
        var selFN = sel.focusNode;

        var nodesBetweenNodes = NodeTree.getInnerNodes(selAN, selFN);

        var startNode = nodesBetweenNodes[0];
        var endNode = nodesBetweenNodes[nodesBetweenNodes.length - 1];

        var selAO = sel.anchorOffset;
        var selFO = sel.focusOffset;

        var [startCursor, endCursor] = (startNode === selAN && selAO <= selFO) ? [selAO, selFO] : [selFO, selAO];

        var cursor;

        for (var node of nodesBetweenNodes) {
            if (node.nodeType === 3) { // 3 = text type
                var selStart = (node === nodesBetweenNodes[0]) ? startCursor : 0;
                var selEnd = (node === nodesBetweenNodes[nodesBetweenNodes.length - 1]) ? endCursor : node.nodeValue.length;
                var text = node.nodeValue;
                selEnd = Math.min(text.length, selEnd);

                var convertStart = selStart;
                var convertEnd = selEnd;

                // cursor is not a hilighted selection
                if (selStart == selEnd) {
                    // Find beginning and end of word
                    convertStart = text.slice(0, selStart + 1).search(/\S+$/);
                    convertEnd = text.slice(selEnd).search(/(\s|$)/) + selStart;
                }

                /* convert the word at the caret selection */
                var textToConvert = text.substring(convertStart, convertEnd);
                var before = text.substring(0, convertStart);
                var after = text.substring(convertEnd, text.length);
                var convertedText = convert(textToConvert);

                // replace in element
                var result = before + convertedText + after;
                cursor = Math.min(result.length, before.length + convertedText.length);
                node.nodeValue = result;
            }
        }
        sel.collapse(endNode, cursor)
    }

    /* detect ALT+X keyboard shortcut */
    function enableLaTeXShortcuts(event) {
        if (event.altKey && event.keyCode == 88) { // ALT+X
            // load dictionary when first pressed
            if (!dictLoaded) {
                loadAsset(dictionarySource, loaded);
            }
            // convert selection
            var activeEl = document.activeElement;
            var activeElTag = activeEl.tagName.toLowerCase();
            if (activeElTag == "textarea" || activeElTag == "input") {
                convertSelectionInputBox(activeEl);
            }
            else if (activeEl.contentEditable) {
                convertSelectionContentEditable(activeEl);
            }
        }
    }

    document.addEventListener('keydown', enableLaTeXShortcuts, true);

})();