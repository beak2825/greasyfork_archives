
//
// ==UserScript==
// @name        GitHub Auto-Indent Comments
// @version     0.0.2
// @description A userscript that allows you to indent & outdent blocks and auto indent for new line in the comment editor
// @license     MIT
// @author      ly525
// @namespace   https://github.com/ly525
// @include     https://github.com/*
// @include     https://gist.github.com/*
// @run-at      document-idle
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @connect     github.com
// @require     https://greasyfork.org/scripts/28721-mutations/code/mutations.js?version=666427
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @downloadURL https://update.greasyfork.org/scripts/397637/GitHub%20Auto-Indent%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/397637/GitHub%20Auto-Indent%20Comments.meta.js
// ==/UserScript==

/*
 * ly525 says:
 * HEAVILY MODIFIED 3/8/2020 from https://greasyfork.org/zh-CN/scripts/28176-github-indent-comments
 * Thanks a lot!
 */

/* HEAVILY MODIFIED 3/17/2017 from https://github.com/timdown/rangyinputs
 * - The code was unwrapped
 * - jQuery elements removed, updated to ES2015
 * - Unneeded code removed
 * - Added global variable "rangyInput"
 */


/**
* @license Rangy Inputs, a jQuery plug-in for selection and caret manipulation
* within textareas and text inputs.
*
* https://github.com/timdown/rangyinputs
*
* For range and selection features for contenteditable, see Rangy.
* http://code.google.com/p/rangy/
*
* xxxx Depends on jQuery 1.0 or later. xxxxx
*
* Copyright 2014, Tim Down
* Licensed under the MIT license.
* Version: 1.2.0
* Build date: 30 November 2014
*/
/* jshint esnext:true */
(() => {

  window.rangyInput = {};

  const UNDEF = "undefined";
  let getSelection, setSelection;

  // Trio of isHost* functions taken from Peter Michaux's article:
  // State of the art browser scripting (https://goo.gl/w6HPyE)
  function isHostMethod(object, property) {
    var t = typeof object[property];
    return t === "function" ||
      (!!(t == "object" && object[property])) ||
      t == "unknown";
  }
  function isHostProperty(object, property) {
    return typeof(object[property]) != UNDEF;
  }
  function isHostObject(object, property) {
    return !!(typeof(object[property]) == "object" && object[property]);
  }
  function fail(reason) {
    if (window.console && window.console.log) {
      window.console.log(
        `RangyInputs not supported in your browser. Reason: ${reason}`
      );
    }
  }

  function adjustOffsets(el, start, end) {
    if (start < 0) {
      start += el.value.length;
    }
    if (typeof end == UNDEF) {
      end = start;
    }
    if (end < 0) {
      end += el.value.length;
    }
    return { start: start, end: end };
  }

  function makeSelection(el, start, end) {
    return {
      start: start,
      end: end,
      length: end - start,
      text: el.value.slice(start, end)
    };
  }

  function getBody() {
    return isHostObject(document, "body") ?
      document.body :
      document.querySelector("body");
  }

  window.rangyInput.init = () => {
    const testTextArea = document.createElement("textarea");
    getBody().appendChild(testTextArea);

    if (
      isHostProperty(testTextArea, "selectionStart") &&
      isHostProperty(testTextArea, "selectionEnd")
    ) {

      getSelection = el => {
        return makeSelection(el, el.selectionStart, el.selectionEnd);
      };

      setSelection = (el, startOffset, endOffset) => {
        var offsets = adjustOffsets(el, startOffset, endOffset);
        el.selectionStart = offsets.start;
        el.selectionEnd = offsets.end;
      };

    } else if (
      isHostMethod(testTextArea, "createTextRange") &&
      isHostObject(document, "selection") &&
      isHostMethod(document.selection, "createRange")
    ) {

      getSelection = el => {
        let normalizedValue, textInputRange, len, endRange,
          start = 0,
          end = 0;
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

      // Moving across a line break only counts as moving one character in a
      // TextRange, whereas a line break in the textarea value is two
      // characters. This function corrects for that by converting a text offset
      // into a range character offset by subtracting one character for every
      // line break in the textarea prior to the offset
      const offsetToRangeCharacterMove = function(el, offset) {
        return offset - (el.value.slice(0, offset).split("\r\n").length - 1);
      };

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

    } else {
      getBody().removeChild(testTextArea);
      fail("No means of finding text input caret position");
      return;
    }

    // Clean up
    getBody().removeChild(testTextArea);

    function getValueAfterPaste(el, text) {
      const val = el.value,
        sel = getSelection(el),
        selStart = sel.start;
      return {
        value: val.slice(0, selStart) + text + val.slice(sel.end),
        index: selStart,
        replaced: sel.text
      };
    }

    function pasteTextWithCommand(el, text) {
      el.focus();
      const sel = getSelection(el);

      // Hack to work around incorrect delete command when deleting the last
      // word on a line
      setSelection(el, sel.start, sel.end);
      if (text === "") {
        document.execCommand("delete", false, null);
      } else {
        document.execCommand("insertText", false, text);
      }

      return {
        replaced: sel.text,
        index: sel.start
      };
    }

    function pasteTextWithValueChange(el, text) {
      el.focus();
      const valueAfterPaste = getValueAfterPaste(el, text);
      el.value = valueAfterPaste.value;
      return valueAfterPaste;
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
      selBehaviour = (typeof selBehaviour == "string") ?
        selBehaviour.toLowerCase() :
        "";

      if (
        (selBehaviour == "collapsetoend" || selBehaviour == "select") &&
        /[\r\n]/.test(text)
      ) {
        // Find the length of the actual text inserted, which could vary
        // depending on how the browser deals with line breaks
        const normalizedText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        endIndex = startIndex + normalizedText.length;
        const firstLineBreakIndex = startIndex + normalizedText.indexOf("\n");

        if (
          el.value.slice(firstLineBreakIndex, firstLineBreakIndex + 2) == "\r\n"
        ) {
          // Browser uses \r\n, so we need to account for extra \r characters
          endIndex += normalizedText.match(/\n/g).length;
        }
      }

      switch (selBehaviour) {
        case "collapsetostart":
          setSelection(el, startIndex, startIndex);
          break;
        case "collapsetoend":
          setSelection(el, endIndex, endIndex);
          break;
        case "select":
          setSelection(el, startIndex, endIndex);
          break;
      }
    }

    window.rangyInput.surroundSelectedText = (el, before, after) => {
      if (typeof after == UNDEF) {
        after = before;
      }
      const sel = getSelection(el),
        pasteInfo = pasteText(el, before + sel.text + after);
      updateSelectionAfterInsert(
        el,
        pasteInfo.index + before.length,
        sel.text,
        "select"
      );
    };

    window.rangyInput.indentSelectedText = (el, callback) => {
      const sel = getSelection(el),
        result = callback(sel.text),
        pasteInfo = pasteText(el, result);
      //「修改1」主要修改了这里，将updateSelectionAfterInsert的值由「select」改为「collapsetoend」
      updateSelectionAfterInsert(el, pasteInfo.index, result, "collapsetoend");
    };
  };
})();

(() => {
  "use strict";

  let spaceSize = GM_getValue("space-size", 2);

  const icons = {
    indent: `
      <svg class="octicon" xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16">
        <path d="M12 13c0 .6 0 1-.9 1H.9c-.9 0-.9-.4-.9-1s0-1 .9-1h10.2c.88 0 .88.4.88 1zM.92 4h10.2C12 4 12 3.6 12 3s0-1-.9-1H.92c-.9 0-.9.4-.9 1s0 1 .9 1zM11.5 7h-5C6 7 6 7.4 6 8s0 1 .5 1h5c.5 0 .5-.4.5-1s0-1-.5-1zm-7 1L0 5v6z"/>
      </svg>`,
    outdent: `
      <svg class="octicon" xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16">
        <path d="M12 13c0 .6 0 1-.9 1H.9c-.9 0-.9-.4-.9-1s0-1 .9-1h10.2c.88 0 .88.4.88 1zM.92 4h10.2C12 4 12 3.6 12 3s0-1-.9-1H.92c-.9 0-.9.4-.9 1s0 1 .9 1zm10.7 3H6.4c-.46 0-.4.4-.4 1s-.06 1 .4 1h5.2c.47 0 .4-.4.4-1s.07-1-.4-1zM0 8l4.5-3v6z"/>
      </svg>`
  };

  GM_addStyle(".ghio-in-outdent * { pointer-events:none; }");

  // Add indent & outdent buttons
  function addButtons() {
    createButton("Outdent");
    createButton("Indent");
  }

  function createButton(name) {
    const toolbars = $$(".toolbar-commenting"),
      nam = name.toLowerCase(),
      button = document.createElement("button");
    let el,
      indx = toolbars.length;
    if (indx) {
      button.type = "button";
      button.className = `ghio-${nam.toLowerCase()} ghio-in-outdent toolbar-item tooltipped tooltipped-n`;
      button.setAttribute("aria-label", `${name} Selected Text`);
      button.setAttribute("tabindex", "-1");
      button.innerHTML = icons[nam.toLowerCase()];
      while (indx--) {
        el = toolbars[indx];
        if (!$(`.ghio-${nam.toLowerCase()}`, el)) {
          el.insertBefore(button.cloneNode(true), el.childNodes[0]);
        }
      }
    }
  }

  function indent(text) {
    let result = [],
      block = new Array(parseInt(spaceSize, 10) + 1).join(" ");
    (text || "").split(/\r*\n/).forEach(line => {
      result.push(block + line);
    });
    return result.join("\n");
  }

  function outdent(text) {
    let regex = new RegExp(`^(\x20{1,${spaceSize}}|\xA0{1,${spaceSize}}|\x09)`),
      result = [];
    (text || "").split(/\r*\n/).forEach(line => {
      result.push(line.replace(regex, ""));
    });
    return result.join("\n");
  }

  function addBindings() {
    window.rangyInput.init();
    saveTabSize();
    $("body").addEventListener("click", event => {
			let textarea,
				target = event.target;
			if (target && target.classList.contains("ghio-in-outdent")) {
				textarea = closest(".previewable-comment-form", target);
				textarea = $(".comment-form-textarea", textarea);
				textarea.focus();
				setTimeout(() => {
					window.rangyInput.indentSelectedText(
						textarea,
						target.classList.contains("ghio-indent") ? indent : outdent
					);
				}, 100);
				return false;
			}
		});
    // Add Tab & Shift + Tab
    $("body").addEventListener("keydown", event => {
      if (event.key === "Tab") {
        let target = event.target;
        if (target && target.classList.contains("comment-form-textarea")) {
          event.preventDefault();
          target.focus();
          setTimeout(() => {
            window.rangyInput.indentSelectedText(
              target,
              // shift + tab = outdent
              event.getModifierState("Shift") ? outdent : indent
            );
          }, 100);
        }
      }
      // 「修改2」增加 New Line 自动对齐行为
      // https://stackoverflow.com/questions/5743916/how-to-add-autoindent-to-html-textarea
      else if (event.key === 'Enter') {
          let target = event.target;
          if (target && target.classList.contains("comment-form-textarea")) {
            // event.preventDefault();
            setTimeout((that) => {
                          var start = that.selectionStart;
                          var v = that.value;
                          var thisLine = "";
                          var indentation = 0;
                          for (let i = start - 2; i >= 0 && v[i] != "\n"; i--) {
                              thisLine = v[i] + thisLine;
                          }
                          for (let i = 0; i < thisLine.length && thisLine[i] == " "; i++) {

                              indentation++;
                          }
                          that.value = v.slice(0, start) + " ".repeat(indentation) + v.slice(start);
                          that.selectionStart = start + indentation;
                          that.selectionEnd = start + indentation;
            }, 0.01, target);
          }
      }
    });
  }

  function saveTabSize() {
    let $el = $(".gh-indent-size");
    if (!$el) {
      $el = document.createElement("style");
      $el.setAttribute("rel", "stylesheet");
      $el.className = "gh-indent-size";
      document.querySelector("head").appendChild($el);
    }
    $el.innerHTML = `.comment-form-textarea { tab-size:${spaceSize}; }`;
  }

  function $(selector, el) {
    return (el || document).querySelector(selector);
  }

  function $$(selector, el) {
    return Array.from((el || document).querySelectorAll(selector));
  }

  function closest(selector, el) {
    while (el && el.nodeType === 1) {
      if (el.matches(selector)) {
        return el;
      }
      el = el.parentNode;
    }
    return null;
  }

  // Add GM options
  GM_registerMenuCommand(
    "Indent or outdent size",
    () => {
      const spaces = GM_getValue("indentOutdentSize", spaceSize);
      let val = prompt("Enter number of spaces to indent or outdent:", spaces);
      if (val !== null && typeof val === "string") {
        spaceSize = val;
        GM_setValue("space-size", val);
        saveTabSize();
      }
    }
  );

  document.addEventListener("ghmo:container", addButtons);
  addBindings();
  addButtons();
})();
