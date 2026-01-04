// ==UserScript==
// @name         Accented Character Input
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.7
// @license      GNU AGPLv3
// @author       jcunews
// @description  Add functionality to input accented characters for non accented keyboards when the current input focus is on a text input element, or a content-editable element.
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/369291/Accented%20Character%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/369291/Accented%20Character%20Input.meta.js
// ==/UserScript==

/*
Note: accented character input will not work on a content-editable element when there's a selection which spans across other element).

Accented character can be inputted by holding the ALT key then pressing the desired character (e.g. <ALT+a> for "à", or <ALT+SHIFT+A> for "À").

Whether capital or non capital letter is used depends on the current state of the CapsLock key and whether the SHIFT key is also held down or not.

While the ALT key is still being held, pressing the same character again will change the generated character to the next available accented character (e.g. <ALT+e> then <e> then <e> will generate the "ê" character).

If a diffrent character is pressed while the ALT key is held down, the accented character of the new character will be generated (e.g. <ALT+a> then <e> will generate "àè").

The typed characters and their available accented characters are configurable in the `charMap` variable within the script.
*/

(function(charMap, ele, inp, prevIdx, prevChar) {

  charMap = {
    "A": "ÀÁÂÃÄÅ",
    "a": "àáâãäå",
    "C": "Ç",
    "c": "ç",
    "E": "ÈÉÊË",
    "e": "èéêë",
    "I": "ÌÍÎÏ",
    "i": "ìíîï",
    "N": "Ñ",
    "n": "ñ",
    "O": "ÒÓÔÕÖ",
    "o": "òóôõö",
    "U": "ÙÚÛÜ",
    "u": "ùúûü",
    "Y": "Ý",
    "y": "ýÿ"
  };

  function init(e) {
    ele = e;
    inp = ele && (ele.tagName === "TEXTAREA") || ((ele.tagName === "INPUT") && (ele.type === "text"));
    if (ele) {
      prevIdx = -1;
      prevChar = ""
    }
    return true
  }

  addEventListener("blur", function(ev) {
    ele = null
  }, true);

  addEventListener("keydown", function(ev, chars, i, sel, cs, ce) {
    if (!ev.altKey) {
      ele = null;
      init(ev.target);
      return
    } else if (!(chars = charMap[ev.key]) || (!ele && !init(ev.target))) return;
    if ((ev.target !== ele) && !init(ev.target)) return;
    if (ev.key !== prevChar) prevIdx = -1;
    if (prevIdx >= 0) {
      i = prevIdx + 1;
      if (i >= chars.length) i = 0
    } else i = 0;
    if (inp) {
      cs = ele.selectionStart;
      ce = ele.selectionEnd;
      if (prevIdx >= 0) cs--;
      ele.value = ele.value.substring(0, cs) + chars[i] + ele.value.substr(ce);
      ele.selectionStart = cs + 1;
      ele.selectionEnd = cs + 1
    } else if (ele.contentEditable === "true") {
      sel = getSelection();
      if (!sel || !sel.anchorNode || (sel.anchorNode !== sel.focusNode) || !sel.anchorNode.data) return;
      if ((cs = sel.anchorOffset) > (ce = sel.focusOffset)) {
        cs = sel.focusOffset;
        ce = sel.anchorOffset
      }
      if (prevIdx >= 0) cs--;
      sel.anchorNode.data = sel.anchorNode.data.substring(0, cs) + chars[i] + sel.anchorNode.data.substr(ce);
      sel.collapse(sel.anchorNode, cs + 1)
    }
    prevIdx = i;
    prevChar = ev.key;
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation()
  }, true)

})();
